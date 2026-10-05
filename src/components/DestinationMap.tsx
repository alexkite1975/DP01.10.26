'use client';
import React from 'react';

interface Props {
  vehicleHeight: string;
  navApp: string;
}

export default function DestinationMap({ vehicleHeight, navApp }: Props) {
  return (
    <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-5 space-y-3 font-mono text-xs">
      <h3 className="text-sm font-bold text-white">Destination: DIRFT Daventry Hub</h3>
      <div className="p-3 bg-amber-500/10 border border-amber-500/30 rounded-xl text-amber-300">
        ⚠️ Low Canopy 4.9m at Gate 3. In-Cab Route Clearance: <strong>{vehicleHeight}</strong>
      </div>
      <button
        onClick={() => alert(`Launching in ${navApp}`)}
        className="w-full py-3.5 bg-emerald-500 text-slate-950 font-black text-xs uppercase rounded-xl"
      >
        Launch In-Cab Navigation ({navApp})
      </button>
    </div>
  );
}
