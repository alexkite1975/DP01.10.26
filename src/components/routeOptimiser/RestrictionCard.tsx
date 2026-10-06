'use client';
import React from 'react';
import { Restriction, RestrictionSeverity } from '../../types/routeOptimiserTypes';
import { formatHeightBoth } from '../../utils/heightUtils';
import { AlertTriangle, AlertCircle, CheckCircle2, Plus, Minus, ArrowRight } from 'lucide-react';

const severityConfig: Record<RestrictionSeverity, {
  bg: string;
  border: string;
  icon: React.ReactNode;
  label: string;
  textColor: string;
  badgeBg: string;
}> = {
  critical: {
    bg: 'bg-red-950/70',
    border: 'border-red-600/80',
    textColor: 'text-red-400',
    label: 'Collision Hazard',
    icon: <AlertCircle className="w-4 h-4 text-red-400 shrink-0" />,
    badgeBg: 'bg-red-500/20 text-red-300 border-red-500/30'
  },
  tight: {
    bg: 'bg-amber-950/70',
    border: 'border-amber-600/80',
    textColor: 'text-amber-400',
    label: 'Tight Clearance',
    icon: <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0" />,
    badgeBg: 'bg-amber-500/20 text-amber-300 border-amber-500/30'
  },
  clear: {
    bg: 'bg-emerald-950/70',
    border: 'border-emerald-600/80',
    textColor: 'text-emerald-400',
    label: 'Clear Passage',
    icon: <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />,
    badgeBg: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30'
  },
};

interface Props {
  restriction: Restriction;
  vehicleHeight: number;
  onAvoid?: (id: string) => void;
}

export const RestrictionCard: React.FC<Props> = ({ restriction, vehicleHeight, onAvoid }) => {
  const cfg = severityConfig[restriction.severity];
  const margin = (restriction.clearanceMetres - vehicleHeight).toFixed(2);
  const marginNum = parseFloat(margin);
  const clearanceDisplay = formatHeightBoth(restriction.clearanceMetres);

  return (
    <div className={`relative rounded-xl border ${cfg.bg} ${cfg.border} p-3.5 transition-all shadow-sm`}>
      {/* Trailer Swap Diff Badges */}
      {restriction.isNew && (
        <span className="absolute -top-2.5 -right-2 flex items-center gap-1 bg-red-600 text-white text-[10px] px-2 py-0.5 rounded-full font-bold shadow-md animate-pulse">
          <Plus className="w-3 h-3" /> NEW HAZARD
        </span>
      )}
      {restriction.isRemoved && (
        <span className="absolute -top-2.5 -right-2 flex items-center gap-1 bg-slate-600 text-white text-[10px] px-2 py-0.5 rounded-full font-bold shadow-md">
          <Minus className="w-3 h-3" /> REMOVED
        </span>
      )}
      {restriction.marginReduced && !restriction.isNew && (
        <span className="absolute -top-2.5 -right-2 flex items-center gap-1 bg-amber-600 text-white text-[10px] px-2 py-0.5 rounded-full font-bold shadow-md">
          ↓ MARGIN REDUCED
        </span>
      )}

      <div className="flex items-start justify-between gap-3">
        <div className="flex items-start gap-2.5 min-w-0">
          <div className="mt-0.5">{cfg.icon}</div>
          <div className="min-w-0">
            <div className="flex items-center gap-2">
              <span className={`text-[10px] font-bold uppercase tracking-wider ${cfg.textColor}`}>
                {cfg.label}
              </span>
              {restriction.roadName && (
                <span className="text-[10px] font-mono text-slate-400 bg-slate-800/80 px-1.5 py-0.2 rounded border border-slate-700">
                  {restriction.roadName}
                </span>
              )}
            </div>
            <p className="text-xs sm:text-sm font-semibold text-slate-100 truncate mt-0.5">
              {restriction.label}
            </p>
            <p className="text-[11px] text-slate-400 mt-0.5">
              {restriction.distanceMiles.toFixed(1)} miles ahead on route
            </p>
          </div>
        </div>

        <div className="text-right shrink-0">
          <p className="text-xs sm:text-sm font-bold text-white font-mono">{clearanceDisplay}</p>
          <p className={`text-[11px] font-mono font-bold mt-0.5 ${
            marginNum < 0 ? 'text-red-400' : marginNum < 0.35 ? 'text-amber-400' : 'text-emerald-400'
          }`}>
            {marginNum >= 0 ? `+${margin}m safety margin` : `${margin}m INSUFFICIENT`}
          </p>
        </div>
      </div>

      {restriction.detourAdvice && (
        <div className="mt-2 text-[11px] bg-slate-900/60 p-2 rounded-lg border border-slate-800 text-slate-300">
          <span className="font-semibold text-amber-400">Detour: </span>
          {restriction.detourAdvice}
        </div>
      )}

      {onAvoid && restriction.severity !== 'clear' && (
        <button
          onClick={() => onAvoid(restriction.id)}
          className="mt-2.5 w-full text-center text-xs font-semibold text-blue-400 hover:text-white py-1.5 px-3 rounded-lg border border-blue-800/60 hover:border-blue-600 bg-blue-950/30 hover:bg-blue-900/50 transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
        >
          <span>Avoid this hazard & re-calculate</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      )}
    </div>
  );
};
