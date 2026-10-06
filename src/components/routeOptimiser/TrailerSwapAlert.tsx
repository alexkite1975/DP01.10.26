'use client';
import React from 'react';
import { Restriction } from '../../types/routeOptimiserTypes';
import { formatHeightBoth } from '../../utils/heightUtils';
import { AlertCircle, Navigation, X, RotateCcw, AlertTriangle } from 'lucide-react';
import { RestrictionCard } from './RestrictionCard';

interface Props {
  isOpen: boolean;
  newRestrictions: Restriction[];
  vehicleHeight: number;
  trailerName?: string;
  isImpossible: boolean;
  onEngageSafeDetour: () => void;
  onKeepRoute: () => void;
  onClearRoute: () => void;
}

export const TrailerSwapAlert: React.FC<Props> = ({
  isOpen,
  newRestrictions,
  vehicleHeight,
  trailerName,
  isImpossible,
  onEngageSafeDetour,
  onKeepRoute,
  onClearRoute,
}) => {
  if (!isOpen) return null;

  const criticalNew = newRestrictions.filter((r) => r.isNew && r.severity === 'critical').length;
  const totalNew    = newRestrictions.filter((r) => r.isNew).length;
  const reducedNew  = newRestrictions.filter((r) => r.marginReduced).length;
  const heightDisplay = formatHeightBoth(vehicleHeight);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/85 backdrop-blur-md animate-in fade-in duration-200">
      <div className="bg-slate-900 border border-red-600/80 rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden text-slate-100 flex flex-col max-h-[92vh]">
        {/* Alert Header */}
        <div className="bg-gradient-to-r from-red-950 via-slate-900 to-red-950 px-5 py-4 border-b border-red-800/80 flex items-start gap-3">
          <div className="p-2 rounded-xl bg-red-600/20 text-red-400 border border-red-600/30 shrink-0 mt-0.5">
            <AlertCircle className="w-6 h-6 animate-pulse" />
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="text-base sm:text-lg font-bold text-white leading-tight">
              {isImpossible ? 'Route Impassable: Severe Bridge Strike Risk' : 'Mid-Route Trailer Swap: New Hazards Detected'}
            </h3>
            <p className="text-xs sm:text-sm text-red-300 mt-1">
              Trailer <span className="font-bold text-white">{trailerName || 'New Unit'}</span> ({heightDisplay}) adds{' '}
              <span className="font-bold text-white">{totalNew} new hazard{totalNew !== 1 ? 's' : ''}</span>
              {criticalNew > 0 && <span className="text-red-200"> ({criticalNew} critical collision risk)</span>}
              {reducedNew > 0 && <span> and reduces clearance margins on {reducedNew} bridge{reducedNew !== 1 ? 's' : ''}</span>}.
            </p>
          </div>
        </div>

        {/* Changed Restrictions Diff Feed */}
        <div className="p-4 flex flex-col gap-2.5 overflow-y-auto">
          <p className="text-[11px] font-mono text-slate-400 uppercase font-bold tracking-wider">
            Clearance Difference Analysis (Diff View):
          </p>
          {newRestrictions.filter((r) => r.isNew || r.marginReduced).map((r) => (
            <RestrictionCard
              key={r.id}
              restriction={r}
              vehicleHeight={vehicleHeight}
            />
          ))}
        </div>

        {/* Call to Action Controls */}
        <div className="p-4 border-t border-slate-800 bg-slate-950/80 flex flex-col gap-2.5">
          <button
            onClick={onEngageSafeDetour}
            className="w-full py-3 bg-blue-600 hover:bg-blue-500 active:scale-98 text-white font-bold text-sm rounded-xl flex items-center justify-center gap-2 shadow-lg shadow-blue-600/30 transition-all cursor-pointer"
          >
            <Navigation className="w-4 h-4" />
            <span>Engage Safe HGV Detour (Avoids All {criticalNew} New Hazards)</span>
          </button>

          {isImpossible ? (
            <button
              onClick={onClearRoute}
              className="w-full py-2.5 bg-red-700 hover:bg-red-600 text-white font-bold text-xs sm:text-sm rounded-xl transition-all cursor-pointer flex items-center justify-center gap-2 shadow-md shadow-red-700/30"
            >
              <RotateCcw className="w-4 h-4" />
              <span>Clear Route & Re-Plan From Current Position</span>
            </button>
          ) : (
            <div className="flex items-center justify-between gap-2 pt-1">
              <button
                onClick={onClearRoute}
                className="py-2 px-3 border border-slate-700 bg-slate-800/80 hover:bg-slate-700 text-slate-300 text-xs rounded-xl transition-colors cursor-pointer flex items-center gap-1.5"
              >
                <X className="w-3.5 h-3.5" />
                <span>Clear Route</span>
              </button>

              <button
                onClick={onKeepRoute}
                className="py-2 px-3 border border-red-900/60 bg-red-950/20 hover:bg-red-950/40 text-red-300 text-xs rounded-xl transition-colors cursor-pointer flex items-center gap-1.5"
                title="Proceed on current route with driver assumption of risk"
              >
                <AlertTriangle className="w-3.5 h-3.5 text-red-400" />
                <span>Keep Current Route (Hazard Warning)</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
