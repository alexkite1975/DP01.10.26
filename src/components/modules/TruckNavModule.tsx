'use client';
import React, { useState } from 'react';
import dynamic from 'next/dynamic';
import { Navigation, AlertTriangle, ShieldCheck, MapPin } from 'lucide-react';

const TomTomTruckMap = dynamic(
  () => import('@/components/in-cab/TomTomTruckMap'),
  { ssr: false }
);

export default function TruckNavModule({ onBack }: { onBack: () => void }) {
  const [hazard, setHazard] = useState<any>({
    name: 'A5 Railway Arch Bridge',
    clearanceM: 4.12,
    distanceM: 450
  });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between border-b border-slate-800 pb-4">
        <div>
          <h2 className="text-xl font-bold font-mono text-white flex items-center gap-2">
            <Navigation className="w-6 h-6 text-emerald-400" />
            04. TomTom 44-Tonne Commercial Truck Navigation
          </h2>
          <p className="text-xs text-slate-400 font-mono mt-1">
            Active Height (4.45m), Weight (44t) & Low-Bridge Strike Collision Radar
          </p>
        </div>
        <button onClick={onBack} className="px-3 py-1.5 rounded-lg bg-slate-800 text-xs font-mono text-slate-300 hover:bg-slate-700">
          ← Back to Cockpit
        </button>
      </div>

      {hazard && (
        <div className="p-4 bg-amber-500/10 border border-amber-500/50 rounded-2xl flex items-center justify-between">
          <div className="flex items-center gap-3">
            <AlertTriangle className="w-7 h-7 text-amber-400 flex-shrink-0 animate-bounce" />
            <div className="font-mono text-xs">
              <strong className="text-amber-400 text-sm">LOW BRIDGE AHEAD: {hazard.name}</strong>
              <div className="text-slate-300">Clearance: <strong className="text-white">{hazard.clearanceM}m</strong> | Vehicle Height: <strong className="text-red-400">4.45m</strong> ({hazard.distanceM}m away)</div>
            </div>
          </div>
          <button
            onClick={() => {
              alert('Calculating safe 44t bypass around low bridge...');
              setHazard(null);
            }}
            className="px-4 py-2 rounded-xl bg-amber-500 text-slate-950 font-mono font-bold text-xs hover:bg-amber-400"
          >
            RECALCULATE SAFE HGV BYPASS
          </button>
        </div>
      )}

      {/* Map View */}
      <div className="rounded-2xl overflow-hidden border border-slate-800 shadow-2xl">
        <TomTomTruckMap
          origin={{ lat: 52.3025, lon: -1.1561 }}
          destination={{ lat: 51.5303, lon: -0.2783 }}
          vehicleHeightMeters={4.45}
          vehicleWeightKg={44000}
          onHazardDetected={h => setHazard(h)}
        />
      </div>
    </div>
  );
}
