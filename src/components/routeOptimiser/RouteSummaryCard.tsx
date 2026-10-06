'use client';
import React from 'react';
import { RouteSummary, RouteState, VehicleProfile } from '../../types/routeOptimiserTypes';
import { RestrictionCard } from './RestrictionCard';
import { Navigation, Edit2, X, MapPin, Clock, AlertTriangle, ShieldCheck } from 'lucide-react';

interface Props {
  route: RouteSummary;
  routeState: RouteState;
  vehicle: VehicleProfile;
  onClearRoute: () => void;
  onEditStops: () => void;
  onStartNavigation: () => void;
  onAvoidRestriction: (id: string) => void;
}

export const RouteSummaryCard: React.FC<Props> = ({
  route,
  routeState,
  vehicle,
  onClearRoute,
  onEditStops,
  onStartNavigation,
  onAvoidRestriction,
}) => {
  const criticalCount = route.restrictions.filter((r) => r.severity === 'critical').length;
  const tightCount    = route.restrictions.filter((r) => r.severity === 'tight').length;

  const stateLabel: Record<RouteState, { text: string; dot: string; badge: string }> = {
    IDLE:       { text: 'Idle',       dot: 'bg-slate-500', badge: 'bg-slate-800 text-slate-400 border-slate-700' },
    PLANNING:   { text: 'Planning',   dot: 'bg-blue-400',  badge: 'bg-blue-900/40 text-blue-300 border-blue-700' },
    VALIDATED:  { text: 'Validated',  dot: 'bg-emerald-400', badge: 'bg-emerald-900/40 text-emerald-300 border-emerald-700' },
    NAVIGATING: { text: 'Navigating Live', dot: 'bg-orange-400 animate-ping', badge: 'bg-orange-950/60 text-orange-300 border-orange-600' },
  };
  const sl = stateLabel[routeState];

  return (
    <div className="bg-slate-900/95 backdrop-blur-md border border-slate-800 rounded-2xl overflow-hidden flex flex-col text-slate-100 shadow-2xl">
      {/* Header Bar */}
      <div className="px-4 pt-4 pb-3 border-b border-slate-800 bg-slate-950/50">
        <div className="flex items-center justify-between mb-2">
          <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-bold border ${sl.badge}`}>
            <span className={`w-2 h-2 rounded-full ${sl.dot}`} />
            {sl.text}
          </span>
          <span className="text-[11px] text-slate-400 uppercase font-mono font-bold tracking-wider">
            HGV Corridor
          </span>
        </div>

        {/* Origin / Destination Waypoints */}
        <div className="flex items-start gap-2.5 pt-1">
          <div className="flex flex-col items-center pt-1 gap-1">
            <MapPin className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
            <div className="w-0.5 h-6 bg-slate-700" />
            <MapPin className="w-3.5 h-3.5 text-red-400 shrink-0" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-xs sm:text-sm font-bold text-white truncate">{route.origin}</p>
            <p className="text-xs sm:text-sm text-slate-300 truncate mt-2">{route.destination}</p>
          </div>
        </div>

        {/* Stats Row */}
        <div className="flex items-center gap-4 mt-3 pt-2.5 border-t border-slate-800/80">
          <span className="flex items-center gap-1.5 text-xs sm:text-sm font-semibold text-slate-300">
            <Navigation className="w-3.5 h-3.5 text-blue-400" />
            <span>{route.distanceMiles} mi</span>
          </span>
          <span className="flex items-center gap-1.5 text-xs sm:text-sm font-semibold text-slate-300">
            <Clock className="w-3.5 h-3.5 text-blue-400" />
            <span>{route.etaMinutes} min</span>
          </span>
          {(criticalCount > 0 || tightCount > 0) ? (
            <span className="flex items-center gap-1 text-xs font-bold text-red-400 ml-auto bg-red-950/40 px-2 py-0.5 rounded border border-red-800/50">
              <AlertTriangle className="w-3 h-3 shrink-0" />
              {criticalCount > 0 && <span>{criticalCount} critical</span>}
              {tightCount > 0 && <span className="text-amber-400 ml-1">{tightCount} tight</span>}
            </span>
          ) : (
            <span className="flex items-center gap-1 text-xs font-bold text-emerald-400 ml-auto bg-emerald-950/40 px-2 py-0.5 rounded border border-emerald-800/50">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>Full Clearance</span>
            </span>
          )}
        </div>
      </div>

      {/* Restrictions List */}
      {route.restrictions.length > 0 ? (
        <div className="px-4 py-3 flex flex-col gap-2.5 max-h-72 overflow-y-auto">
          <p className="text-[11px] font-mono text-slate-400 uppercase font-bold tracking-wider">
            En-Route Hazard Clearance Checks:
          </p>
          {route.restrictions.map((r) => (
            <RestrictionCard
              key={r.id}
              restriction={r}
              vehicleHeight={vehicle.height}
              onAvoid={onAvoidRestriction}
            />
          ))}
        </div>
      ) : (
        <div className="p-4 text-center text-xs text-emerald-400 font-semibold flex items-center justify-center gap-2">
          <ShieldCheck className="w-4 h-4" />
          <span>All hazards clear for {vehicle.height}m height</span>
        </div>
      )}

      {/* Voice Prompts Bar */}
      <div className="px-4 py-2 border-t border-slate-800 bg-slate-950/70">
        <p className="text-[11px] text-slate-400 italic">
          💡 Voice commands: <span className="text-amber-400">"Clear route"</span> · <span className="text-blue-400">"Avoid low bridges"</span> · <span className="text-emerald-400">"Find next layby"</span>
        </p>
      </div>

      {/* Main Action Buttons */}
      <div className="px-4 pb-4 pt-3 flex gap-2 border-t border-slate-800/80 bg-slate-900">
        <button
          onClick={onClearRoute}
          className="flex-none flex items-center gap-1.5 px-3 py-2.5 rounded-xl border border-slate-700 text-slate-300 text-xs sm:text-sm font-semibold hover:bg-red-950/40 hover:border-red-600 hover:text-red-300 transition-colors cursor-pointer"
          title="Clear current route and remove all residual hazard state"
        >
          <X className="w-4 h-4" />
          <span>Clear Route</span>
        </button>

        <button
          onClick={onEditStops}
          className="flex-none flex items-center gap-1.5 px-3 py-2.5 rounded-xl border border-slate-700 text-slate-300 text-xs sm:text-sm font-semibold hover:bg-slate-800 transition-colors cursor-pointer"
          title="Add via-points, waypoints, or drop-offs"
        >
          <Edit2 className="w-4 h-4" />
          <span>Edit Stops</span>
        </button>

        <button
          onClick={onStartNavigation}
          className={`flex-1 flex items-center justify-center gap-2 px-3 py-2.5 rounded-xl text-white text-xs sm:text-sm font-bold shadow-lg transition-all cursor-pointer active:scale-95 ${
            routeState === 'NAVIGATING'
              ? 'bg-orange-600 hover:bg-orange-500 shadow-orange-600/30'
              : 'bg-blue-600 hover:bg-blue-500 shadow-blue-600/30'
          }`}
        >
          <Navigation className="w-4 h-4" />
          <span>{routeState === 'NAVIGATING' ? 'Navigating Active' : 'Start Navigation'}</span>
        </button>
      </div>
    </div>
  );
};
