'use client';

import React, { useEffect, useRef, useState, useCallback } from 'react';
import L from 'leaflet';

// Fix Leaflet's default pin icon paths in Webpack/Next.js
const defaultIcon = L.icon({
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41]
});
L.Marker.prototype.options.icon = defaultIcon;

interface TruckMapProps {
  apiKey: string;
  origin: string;
  destination: string;
  onStatsCalculated?: (stats: { miles: string; duration: string; trafficDelay: string }) => void;
  triggerRecalculate: number;
}

export default function TomTomTruckMap({
  apiKey,
  origin,
  destination,
  onStatsCalculated,
  triggerRecalculate
}: TruckMapProps) {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const routeLayerRef = useRef<L.Polyline | null>(null);
  const markersLayerRef = useRef<L.LayerGroup | null>(null);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // Initialize Map Instance
  useEffect(() => {
    if (!mapContainerRef.current) return;

    if (mapInstanceRef.current) {
      mapInstanceRef.current.remove();
      mapInstanceRef.current = null;
    }

    const map = L.map(mapContainerRef.current, {
      zoomControl: true,
      attributionControl: true
    }).setView([52.1386, -0.4668], 7);

    // Official TomTom Tile Layer
    L.tileLayer(`https://api.tomtom.com/map/1/tile/basic/main/{z}/{x}/{y}.png?key=${apiKey}`, {
      attribution: '© 1992 - 2026 TomTom',
      maxZoom: 19
    }).addTo(map);

    markersLayerRef.current = L.layerGroup().addTo(map);
    mapInstanceRef.current = map;

    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, [apiKey]);

  // Execute TomTom Commercial Truck Route Calculation
  const calculateRoute = useCallback(async () => {
    if (!mapInstanceRef.current) return;

    setLoading(true);
    setErrorMsg(null);

    try {
      // 1. Geocode Origin & Destination
      const geoOrigUrl = `https://api.tomtom.com/search/2/geocode/${encodeURIComponent(origin)}.json?key=${apiKey}&countrySet=GB&limit=1`;
      const geoDestUrl = `https://api.tomtom.com/search/2/geocode/${encodeURIComponent(destination)}.json?key=${apiKey}&countrySet=GB&limit=1`;

      const [origRes, destRes] = await Promise.all([
        fetch(geoOrigUrl).then(r => r.json()),
        fetch(geoDestUrl).then(r => r.json())
      ]);

      if (!origRes?.results?.length || !destRes?.results?.length) {
        throw new Error('Unable to geocode departure or destination address.');
      }

      const sPos = origRes.results[0].position;
      const ePos = destRes.results[0].position;

      // 2. TomTom Commercial Truck Routing API (Class 1 HGV: 44t, 4.45m height, 16.5m length)
      const truckUrl = `https://api.tomtom.com/routing/1/calculateRoute/${sPos.lat},${sPos.lon}:${ePos.lat},${ePos.lon}/json?key=${apiKey}&travelMode=truck&vehicleCommercial=true&vehicleWeight=44000&vehicleHeight=4.45&vehicleWidth=2.55&vehicleLength=16.5&traffic=true`;

      const routeData = await fetch(truckUrl).then(r => r.json());

      if (!routeData.routes || routeData.routes.length === 0) {
        throw new Error('No legal 44t truck route found avoiding low bridges.');
      }

      const route = routeData.routes[0];
      const summary = route.summary;
      const miles = (summary.lengthInMeters / 1609.34).toFixed(1);
      const hours = Math.floor(summary.travelTimeInSeconds / 3600);
      const mins = Math.round((summary.travelTimeInSeconds % 3600) / 60);
      const delayMins = Math.round((summary.trafficDelayInSeconds || 0) / 60);

      if (onStatsCalculated) {
        onStatsCalculated({
          miles: `${miles} mi`,
          duration: `${hours}h ${mins}m`,
          trafficDelay: delayMins > 0 ? `+${delayMins}m traffic delay` : 'Clear traffic'
        });
      }

      // 3. Render Route Polyline & Markers
      if (routeLayerRef.current) {
        mapInstanceRef.current.removeLayer(routeLayerRef.current);
      }
      if (markersLayerRef.current) {
        markersLayerRef.current.clearLayers();
      }

      const latLngs = route.legs[0].points.map((p: any) => [p.latitude, p.longitude] as [number, number]);
      routeLayerRef.current = L.polyline(latLngs, {
        color: '#10b981',
        weight: 6,
        opacity: 0.9,
        lineJoin: 'round'
      }).addTo(mapInstanceRef.current);

      L.marker([sPos.lat, sPos.lon])
        .addTo(markersLayerRef.current!)
        .bindPopup(`<b>Start Point:</b> ${origin}`);

      L.marker([ePos.lat, ePos.lon])
        .addTo(markersLayerRef.current!)
        .bindPopup(`<b>Destination (Bay 24):</b> ${destination}`)
        .openPopup();

      mapInstanceRef.current.fitBounds(routeLayerRef.current.getBounds(), {
        padding: [30, 30]
      });

    } catch (err: any) {
      console.error('Routing calculation failed', err);
      setErrorMsg(err.message || 'Route calculation error');
    } finally {
      setLoading(false);
    }
  }, [apiKey, origin, destination, onStatsCalculated]);

  useEffect(() => {
    const timer = setTimeout(() => {
      calculateRoute();
    }, 400);
    return () => clearTimeout(timer);
  }, [calculateRoute, triggerRecalculate]);

  return (
    <div className="relative w-full h-80 rounded-2xl overflow-hidden border border-slate-800 bg-slate-950">
      <div ref={mapContainerRef} className="w-full h-full" />
      {loading && (
        <div className="absolute top-3 right-3 z-[1000] bg-slate-900/90 border border-emerald-500/40 text-emerald-400 text-xs font-mono px-3 py-1.5 rounded-xl shadow-lg flex items-center space-x-2">
          <div className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
          <span>Calculating 44t Low-Bridge Safe Path...</span>
        </div>
      )}
      {errorMsg && (
        <div className="absolute bottom-3 left-3 right-3 z-[1000] bg-red-950/90 border border-red-500/50 text-red-200 text-xs font-mono p-2.5 rounded-xl">
          ⚠️ {errorMsg}
        </div>
      )}
    </div>
  );
}
