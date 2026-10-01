'use client';

import React, { useState } from 'react';
import { Volume2, VolumeX, RotateCcw } from 'lucide-react';

export default function LowBridgeWarningBanner({
  hazardName,
  bridgeClearanceMeters,
  vehicleHeightMeters,
  distanceMeters,
  onReroute
}: {
  hazardName: string;
  bridgeClearanceMeters: number;
  vehicleHeightMeters: number;
  distanceMeters: number;
  onReroute?: () => void;
}) {
  const [isMuted, setIsMuted] = useState(false);
  const deficit = vehicleHeightMeters - bridgeClearanceMeters;

  return (
    <div className="w-full rounded-2xl bg-gradient-to-r from-red-950 via-rose-950 to-red-950 border-2 border-red-500 p-4 text-white shadow-2xl animate-pulse">
      <div className="flex items-center justify-between border-b border-red-800/80 pb-2 mb-2">
        <div className="flex items-center space-x-2">
          <div className="w-8 h-8 rounded-lg bg-red-600 flex items-center justify-center font-bold">⚠️</div>
          <div>
            <span className="text-[10px] font-mono uppercase bg-red-600 px-1.5 py-0.5 rounded font-black">STRIKE HAZARD (Within {distanceMeters}m)</span>
            <div className="text-sm font-bold truncate max-w-sm">{hazardName}</div>
          </div>
        </div>
        <button onClick={() => setIsMuted(!isMuted)} className="p-1.5 bg-red-900 rounded-lg">
          {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
        </button>
      </div>

      <div className="grid grid-cols-3 gap-2 bg-black/60 rounded-xl p-2.5 text-center font-mono text-xs">
        <div>
          <span className="text-[9px] text-red-300 block">BRIDGE</span>
          <span className="text-base font-bold text-amber-300">{bridgeClearanceMeters.toFixed(2)}m</span>
        </div>
        <div>
          <span className="text-[9px] text-slate-400 block">CAB PLACARD</span>
          <span className="text-base font-bold text-white">{vehicleHeightMeters.toFixed(2)}m</span>
        </div>
        <div>
          <span className="text-[9px] text-red-300 block">DEFICIT</span>
          <span className="text-base font-bold text-red-400">-{deficit.toFixed(2)}m (STRIKE)</span>
        </div>
      </div>

      <div className="flex items-center justify-between mt-2.5">
        <span className="text-xs font-mono text-red-200">Auto-diverting truck corridor...</span>
        <button onClick={onReroute} className="flex items-center space-x-1 text-xs font-mono font-bold bg-white text-black px-3 py-1.5 rounded-lg active:scale-95">
          <RotateCcw className="w-3.5 h-3.5" />
          <span>Recalculate Safe Bypass</span>
        </button>
      </div>
    </div>
  );
}
