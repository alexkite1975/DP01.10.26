'use client';
import React from 'react';
import { VehicleProfile } from '../../types/routeOptimiserTypes';
import { formatHeightBoth } from '../../utils/heightUtils';
import { Truck } from 'lucide-react';

interface Props {
  profile: VehicleProfile;
  onClick?: () => void;
}

export const VehicleChip: React.FC<Props> = ({ profile, onClick }) => {
  const heightStr = formatHeightBoth(profile.height);

  return (
    <button
      onClick={onClick}
      className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-slate-800 hover:bg-slate-700 border border-slate-700 hover:border-slate-500 text-xs sm:text-sm font-medium text-slate-200 transition-all cursor-pointer shadow-md active:scale-95"
      title="Tap to open Trailer Fleet Memory & swap trailer"
    >
      <Truck className="w-4 h-4 text-blue-400 shrink-0" />
      <span className="text-blue-300 font-bold">{heightStr}</span>
      <span className="text-slate-500">·</span>
      <span className="text-slate-300">{profile.weight}t</span>
      <span className="text-slate-500">·</span>
      <span className="text-slate-300">{profile.width}m</span>
      {profile.trailerName && (
        <>
          <span className="text-slate-500">·</span>
          <span className="text-amber-400 font-mono text-xs">{profile.trailerName}</span>
        </>
      )}
    </button>
  );
};
