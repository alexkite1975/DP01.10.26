'use client';
import React, { useEffect, useRef, useState } from 'react';
import {
  X,
  Compass,
  RotateCw,
  Eye,
  ShieldAlert,
  Navigation,
  CheckCircle2,
  Maximize2,
  ExternalLink,
  Layers
} from 'lucide-react';
import { getGoogleStreetViewUrl } from '../services/googlePlaces';

interface StreetViewGateModalProps {
  siteTitle?: string;
  address?: string;
  lat?: number;
  lng?: number;
  isOpen?: boolean;
  site?: any;
  onClose: () => void;
}

const PRESET_VIEW_ANGLES = [
  { label: 'Gatehouse Barrier Entry', heading: 210, pitch: 0, description: 'Straight view toward security barrier and intercom' },
  { label: 'Highway Approach Turn-in', heading: 120, pitch: 5, description: 'Swing radius and lane approach from main highway' },
  { label: 'Inbound Reversing Apron', heading: 315, pitch: -2, description: 'Internal yard roadway and dock leveller view' },
  { label: 'Overhead Clearance Check', heading: 210, pitch: 25, description: 'Overhead trees, wires, and canopy inspection' }
];

export const StreetViewGateModal: React.FC<StreetViewGateModalProps> = ({
  siteTitle: propTitle,
  address: propAddress,
  lat: propLat,
  lng: propLng,
  site,
  isOpen = true,
  onClose
}) => {
  const siteTitle = propTitle || site?.businessSection?.siteName || site?.name || 'Gatehouse Inspection';
  const address = propAddress || site?.businessSection?.address || site?.address || '';
  const lat = propLat ?? site?.businessSection?.coordinates?.lat ?? 52.0;
  const lng = propLng ?? site?.businessSection?.coordinates?.lng ?? -0.5;

  const containerRef = useRef<HTMLDivElement>(null);
  const panoramaRef = useRef<any>(null);
  const [selectedAngleIndex, setSelectedAngleIndex] = useState(0);
  const [heading, setHeading] = useState(210);
  const [pitch, setPitch] = useState(0);
  const [zoom, setZoom] = useState(1);
  const [isInteractiveLoaded, setIsInteractiveLoaded] = useState(false);

  // Initialize Google Maps Street View Panorama if API is loaded
  useEffect(() => {
    if (!isOpen) return;
    if (typeof window !== 'undefined' && (window as any).google?.maps?.StreetViewPanorama && containerRef.current) {
      try {
        const panorama = new (window as any).google.maps.StreetViewPanorama(containerRef.current, {
          position: { lat, lng },
          pov: { heading, pitch },
          zoom,
          addressControl: false,
          showRoadLabels: true,
          motionTracking: false,
          fullscreenControl: false
        });

        panoramaRef.current = panorama;
        setIsInteractiveLoaded(true);

        panorama.addListener('pov_changed', () => {
          const currentPov = panorama.getPov();
          if (currentPov) {
            setHeading(Math.round(currentPov.heading));
            setPitch(Math.round(currentPov.pitch));
          }
        });
      } catch (err) {
        console.warn('Interactive Street View failed to initialize, using high-res static panorama:', err);
        setIsInteractiveLoaded(false);
      }
    }
  }, [lat, lng]);

  const handleAngleSelect = (index: number) => {
    setSelectedAngleIndex(index);
    const angle = PRESET_VIEW_ANGLES[index];
    setHeading(angle.heading);
    setPitch(angle.pitch);

    if (panoramaRef.current) {
      panoramaRef.current.setPov({ heading: angle.heading, pitch: angle.pitch });
    }
  };

  const handleManualRotate = (delta: number) => {
    const newHeading = (heading + delta + 360) % 360;
    setHeading(newHeading);
    if (panoramaRef.current) {
      panoramaRef.current.setPov({ heading: newHeading, pitch });
    }
  };

  const staticUrl = getGoogleStreetViewUrl(lat, lng, heading, pitch);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-900/70 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-4xl rounded-2xl border border-slate-200 bg-white p-5 sm:p-6 shadow-2xl text-slate-900 max-h-[94vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-slate-200 shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-50 text-blue-600 border border-blue-200">
              <Eye className="h-5 w-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base sm:text-lg font-bold text-slate-900">
                  Google Street View: 360° Gate & Approach Inspection
                </h2>
                <span className="rounded-full bg-blue-100 text-blue-800 text-[10px] font-bold px-2 py-0.5">
                  Live View
                </span>
              </div>
              <p className="text-xs text-slate-500 line-clamp-1">
                {siteTitle} — {address}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-100 hover:text-slate-700 transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* View Angle Preset Chips */}
        <div className="py-3 shrink-0 flex items-center gap-2 overflow-x-auto no-scrollbar">
          <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider shrink-0 flex items-center gap-1">
            <Compass className="h-3.5 w-3.5 text-blue-600" />
            Camera Angle:
          </span>
          {PRESET_VIEW_ANGLES.map((angle, idx) => (
            <button
              key={idx}
              onClick={() => handleAngleSelect(idx)}
              className={`shrink-0 rounded-lg px-3 py-1.5 text-xs font-semibold transition-all flex items-center gap-1.5 ${
                selectedAngleIndex === idx
                  ? 'bg-blue-600 text-white shadow-sm'
                  : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
              }`}
            >
              <span>{angle.label}</span>
              <span className="text-[10px] opacity-75">({angle.heading}°)</span>
            </button>
          ))}
        </div>

        {/* Panorama Canvas Area */}
        <div className="relative flex-1 min-h-[340px] sm:min-h-[420px] rounded-xl overflow-hidden border border-slate-200 bg-slate-900 shadow-inner flex flex-col items-center justify-center">
          {/* Interactive Google Maps Panorama Container */}
          <div ref={containerRef} className="absolute inset-0 h-full w-full" />

          {/* Static Street View Fallback (visible if JS panorama cannot embed) */}
          {!isInteractiveLoaded && (
            <img
              src={staticUrl}
              alt="Street View Gate Inspection"
              className="h-full w-full object-cover"
            />
          )}

          {/* Real-time Compass & Inspection HUD Overlay */}
          <div className="absolute top-3 left-3 bg-slate-900/85 backdrop-blur-md rounded-xl p-2.5 text-white border border-slate-700/80 shadow-lg text-xs space-y-1">
            <div className="flex items-center gap-1.5 font-bold text-blue-300">
              <Compass className="h-3.5 w-3.5" />
              <span>Bearing: {heading}° ({getCompassDirection(heading)})</span>
            </div>
            <div className="text-[11px] text-slate-300">
              Coordinates: {lat.toFixed(5)}, {lng.toFixed(5)}
            </div>
            <div className="text-[10px] text-amber-300 font-medium">
              {PRESET_VIEW_ANGLES[selectedAngleIndex]?.description}
            </div>
          </div>

          {/* Visual Rotation Controls */}
          <div className="absolute bottom-3 right-3 flex items-center gap-2 bg-slate-900/85 backdrop-blur-md rounded-xl p-1.5 border border-slate-700 shadow-lg">
            <button
              onClick={() => handleManualRotate(-45)}
              className="rounded-lg bg-slate-800 hover:bg-slate-700 text-white px-2.5 py-1 text-xs font-bold transition-all flex items-center gap-1"
              title="Rotate Left 45°"
            >
              <RotateCw className="h-3 w-3 -scale-x-100" />
              <span>Pan Left</span>
            </button>
            <button
              onClick={() => handleManualRotate(45)}
              className="rounded-lg bg-slate-800 hover:bg-slate-700 text-white px-2.5 py-1 text-xs font-bold transition-all flex items-center gap-1"
              title="Rotate Right 45°"
            >
              <RotateCw className="h-3 w-3" />
              <span>Pan Right</span>
            </button>
          </div>

          {/* Driver Gate Verification Checklist Badge */}
          <div className="absolute bottom-3 left-3 hidden sm:flex items-center gap-2 bg-emerald-950/90 backdrop-blur-md border border-emerald-600/80 rounded-xl px-3 py-1.5 text-emerald-200 text-xs">
            <CheckCircle2 className="h-4 w-4 text-emerald-400 shrink-0" />
            <span>Gate Curb Clearance & Low Overhang Visually Inspected</span>
          </div>
        </div>

        {/* Footer Guidance */}
        <div className="pt-3 border-t border-slate-200 mt-3 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs text-slate-600">
          <div className="flex items-center gap-2">
            <ShieldAlert className="h-4 w-4 text-amber-500 shrink-0" />
            <span>
              Tip: Rotate 360° to identify low tree branches, pedestrian refuge islands, and intercom height.
            </span>
          </div>
          <button
            onClick={onClose}
            className="rounded-lg bg-slate-900 hover:bg-slate-800 text-white px-4 py-2 text-xs font-bold transition-all self-end sm:self-auto"
          >
            Done Inspecting
          </button>
        </div>
      </div>
    </div>
  );
};

function getCompassDirection(heading: number): string {
  const directions = ['N', 'NE', 'E', 'SE', 'S', 'SW', 'W', 'NW'];
  const index = Math.round(((heading % 360) + 360) % 360 / 45) % 8;
  return directions[index];
}
