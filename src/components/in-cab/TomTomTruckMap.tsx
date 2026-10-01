'use client';

import React, { useEffect, useRef, useState, useCallback } from 'react';
import { Navigation2, RefreshCw } from 'lucide-react';
import 'leaflet/dist/leaflet.css';

export interface HazardLocation {
  lat: number;
  lon: number;
  clearanceM: number;
  name: string;
}

export interface TomTomTruckMapProps {
  origin: { lat: number; lon: number };
  destination: { lat: number; lon: number };
  vehicleHeightMeters: number;
  vehicleWeightKg: number;
  hazards?: HazardLocation[];
  onHazardDetected?: (hazard: any) => void;
}

export default function TomTomTruckMap({
  origin,
  destination,
  vehicleHeightMeters,
  hazards = [
    { lat: 51.5850, lon: -0.2310, clearanceM: 4.42, name: 'Network Rail Bridge #BR-104 (Silk Stream)' }
  ],
  onHazardDetected
}: TomTomTruckMapProps) {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<any>(null);
  const [mapLoaded, setMapLoaded] = useState(false);

  const defaultCorridor: [number, number][] = [
    [origin.lat, origin.lon],
    [52.2850, -1.1340],
    [52.1450, -0.9520],
    [51.8980, -0.6380],
    [51.6980, -0.3450],
    [51.5850, -0.2310],
    [destination.lat, destination.lon]
  ];

  useEffect(() => {
    let isSubscribed = true;

    async function init() {
      if (!mapContainerRef.current || mapInstanceRef.current) return;
      const L = (await import('leaflet')).default;
      if (!isSubscribed || !mapContainerRef.current) return;

      const map = L.map(mapContainerRef.current, { zoomControl: true }).setView([51.9163, -0.7172], 9);
      L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png', { maxZoom: 19 }).addTo(map);

      mapInstanceRef.current = map;
      setMapLoaded(true);
    }

    init();

    return () => {
      isSubscribed = false;
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, []);

  const renderRoute = useCallback(async () => {
    if (!mapInstanceRef.current) return;
    const L = (await import('leaflet')).default;
    const map = mapInstanceRef.current;

    L.polyline(defaultCorridor, { color: '#10B981', weight: 10, opacity: 0.3 }).addTo(map);
    const core = L.polyline(defaultCorridor, { color: '#10B981', weight: 4, opacity: 1.0 }).addTo(map);

    hazards.forEach(h => {
      if (h.clearanceM < vehicleHeightMeters + 0.20) {
        const isStrike = h.clearanceM <= vehicleHeightMeters;
        const icon = L.divIcon({
          className: 'bridge-pin',
          html: `<div style="background:#090D16;border:2px solid ${isStrike ? '#EF4444' : '#F59E0B'};border-radius:50%;width:30px;height:30px;display:flex;align-items:center;justify-content:center;box-shadow:0 0 10px ${isStrike ? '#EF4444' : '#F59E0B'}">⚠️</div>`,
          iconSize: [30, 30]
        });

        L.marker([h.lat, h.lon], { icon }).addTo(map).bindPopup(`
          <div style="background:#090D16;color:#fff;padding:4px;font-family:monospace">
            <b style="color:${isStrike ? '#EF4444' : '#F59E0B'}">${isStrike ? '⛔ STRIKE HAZARD' : '⚠️ LOW BRIDGE'}</b><br/>
            ${h.name}<br/>Clearance: ${h.clearanceM}m | Vehicle: ${vehicleHeightMeters}m
          </div>
        `);

        if (onHazardDetected) {
          onHazardDetected({ name: h.name, clearanceM: h.clearanceM, distanceM: 650, isCriticalStrike: isStrike });
        }
      }
    });

    map.fitBounds(core.getBounds(), { padding: [30, 30] });
  }, [origin, destination, vehicleHeightMeters, hazards, onHazardDetected]);

  useEffect(() => {
    if (mapLoaded) renderRoute();
  }, [mapLoaded, renderRoute]);

  return (
    <div className="relative w-full h-[450px] rounded-2xl overflow-hidden border border-slate-800 bg-[#090D16]">
      <div ref={mapContainerRef} className="w-full h-full" />
      <div className="absolute bottom-3 left-3 right-3 z-[1000] flex items-center justify-between bg-[#0D1527]/90 border border-slate-800 p-2.5 rounded-xl text-xs font-mono text-slate-300">
        <span className="flex items-center text-emerald-400">
          <Navigation2 className="w-4 h-4 mr-1.5" /> 44t HGV Low-Bridge Shield Active ({vehicleHeightMeters}m)
        </span>
        <button onClick={renderRoute} className="flex items-center text-cyan-400 font-bold">
          <RefreshCw className="w-3 h-3 mr-1" /> Recheck
        </button>
      </div>
    </div>
  );
}
