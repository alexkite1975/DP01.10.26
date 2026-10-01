'use client';

import React from 'react';
import { useLayout } from '@/context/LayoutContext';
import { Truck, ShieldCheck } from 'lucide-react';
import { Vehicle } from '@/lib/fleetops';

export const VehicleInspectorCard: React.FC<{ vehicle: Vehicle }> = ({ vehicle }) => {
  const { openDrawer } = useLayout();

  const handleInspect = () => {
    openDrawer(
      `Vehicle: ${vehicle.plateNumber}`,
      <div className="space-y-6 text-sm">
        <div className="p-4 rounded-lg bg-slate-950 border border-slate-800 space-y-3">
          <div className="flex justify-between items-center text-xs font-mono text-slate-400">
            <span>ID: {vehicle.vehicleId}</span>
            <span className="text-emerald-400">{vehicle.lastPing}</span>
          </div>
          <div className="text-base font-semibold text-slate-100">{vehicle.driverName}</div>
          <div className="grid grid-cols-2 gap-2 text-xs font-mono pt-2 border-t border-slate-800">
            <div>
              <span className="text-slate-500 block">TRAILER:</span>
              <span className="text-slate-200">{vehicle.currentTrailer}</span>
            </div>
            <div>
              <span className="text-slate-500 block">HEIGHT:</span>
              <span className="text-slate-200">{vehicle.clearanceMeters}m</span>
            </div>
          </div>
        </div>

        <div className="space-y-2">
          <h4 className="text-xs font-semibold text-slate-400 uppercase tracking-wider font-mono">
            Spatial Radar Intersect
          </h4>
          <div className="p-3 rounded-lg bg-slate-800/40 border border-slate-700/60 flex items-start space-x-3">
            <ShieldCheck size={18} className="text-emerald-400 flex-shrink-0 mt-0.5" />
            <div className="text-xs">
              <span className="font-semibold text-slate-200 block">Corridor Clear</span>
              <span className="text-slate-400">Connected to Cloud Run (europe-west2). No clearance hazards detected.</span>
            </div>
          </div>
        </div>

        <div className="pt-4 border-t border-slate-800">
          <button
            onClick={() => alert(`Connecting cockpit call to ${vehicle.plateNumber}...`)}
            className="w-full py-2 px-3 rounded-lg bg-slate-800 hover:bg-slate-750 text-slate-200 text-xs font-medium transition-colors"
          >
            Direct Cockpit Audio Call
          </button>
        </div>
      </div>
    );
  };

  return (
    <div
      onClick={handleInspect}
      className="p-4 rounded-xl bg-slate-900 border border-slate-800 hover:border-slate-700 hover:bg-slate-850/60 transition-all cursor-pointer group"
    >
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center space-x-2">
          <div className="p-2 rounded-lg bg-slate-800 text-slate-300 group-hover:text-emerald-400 transition-colors">
            <Truck size={18} />
          </div>
          <div>
            <div className="font-semibold text-sm text-slate-100">{vehicle.plateNumber}</div>
            <div className="text-xs text-slate-500 font-mono">{vehicle.vehicleId}</div>
          </div>
        </div>
        <span className={`text-[10px] px-2 py-0.5 rounded font-mono font-bold ${
          vehicle.status === 'CAUTION_APPROACH'
            ? 'bg-amber-500/20 text-amber-400 border border-amber-500/30'
            : 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
        }`}>
          {vehicle.status}
        </span>
      </div>

      <div className="grid grid-cols-2 gap-2 text-xs font-mono text-slate-400 border-t border-slate-800/80 pt-3">
        <div>
          <span className="text-slate-600 block text-[10px]">SPEED</span>
          <span className="text-slate-300 font-semibold">{vehicle.speedMph} mph</span>
        </div>
        <div>
          <span className="text-slate-600 block text-[10px]">MAX CLEARANCE</span>
          <span className="text-slate-300 font-semibold">{vehicle.clearanceMeters}m</span>
        </div>
      </div>
    </div>
  );
};
