'use client';
import React, { useState, useEffect } from 'react';
import { Search, MapPin, Clock, Navigation, Compass, Building2, ChevronRight } from 'lucide-react';
import { RECENT_ROUTES } from '../../services/routeOptimiserData';
import { VehicleProfile } from '../../types/routeOptimiserTypes';
import { VehicleChip } from './VehicleChip';
import { searchPlacesAutocomplete, PlacePrediction } from '../../services/googlePlaces';

interface Props {
  vehicle: VehicleProfile;
  onVehicleClick: () => void;
  onSearch: (query: string) => void;
  onRecentRoute: (label: string) => void;
  onOpenAmazonTour?: () => void;
}

const SHORTCUTS = [
  { icon: <MapPin className="w-3.5 h-3.5 text-emerald-400" />, label: 'Home depot' },
  { icon: <Clock className="w-3.5 h-3.5 text-blue-400" />,     label: 'Last job' },
  { icon: <Navigation className="w-3.5 h-3.5 text-amber-400" />, label: 'Find layby' },
];

export const EmptyState: React.FC<Props> = ({ vehicle, onVehicleClick, onSearch, onRecentRoute, onOpenAmazonTour }) => {
  const [query, setQuery] = useState('');
  const [predictions, setPredictions] = useState<PlacePrediction[]>([]);
  const [isSearching, setIsSearching] = useState(false);

  // Live Google Places autocomplete search
  useEffect(() => {
    if (!query.trim() || query.trim().length < 2) {
      setPredictions([]);
      return;
    }

    let active = true;
    setIsSearching(true);
    searchPlacesAutocomplete(query).then((results) => {
      if (active) {
        setPredictions(results);
        setIsSearching(false);
      }
    });

    return () => {
      active = false;
    };
  }, [query]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      onSearch(query.trim());
      setPredictions([]);
    }
  };

  const handleSelectPrediction = (p: PlacePrediction) => {
    setQuery(p.description);
    setPredictions([]);
    onSearch(p.description);
  };

  return (
    <div className="bg-slate-900/90 backdrop-blur-md border border-slate-800 rounded-2xl p-4 sm:p-5 flex flex-col gap-4 text-slate-100 shadow-xl">
      {/* Featured: Amazon Relay 5-Day Tour Shortcut */}
      {onOpenAmazonTour && (
        <button
          onClick={onOpenAmazonTour}
          className="w-full p-3.5 rounded-2xl bg-gradient-to-r from-amber-500/20 via-blue-600/20 to-slate-900 border border-amber-500/40 hover:border-amber-400 text-left transition-all group flex items-center justify-between shadow-lg shadow-amber-500/5 cursor-pointer"
        >
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-amber-500 text-slate-950 font-black flex items-center justify-center shrink-0 shadow-md text-xs">
              17
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs sm:text-sm font-extrabold text-white group-hover:text-amber-300">
                  Amazon Relay 5-Day Tour
                </span>
                <span className="text-[10px] px-1.5 py-0.5 rounded bg-emerald-500/20 text-emerald-300 font-bold border border-emerald-500/30">
                  5 SHIFTS
                </span>
              </div>
              <p className="text-[11px] text-slate-400 mt-0.5">
                1-page-at-a-time shift navigator · Empty trailer flexibility &amp; daily rest layovers
              </p>
            </div>
          </div>
          <div className="flex items-center gap-1 text-xs font-bold text-amber-400 group-hover:translate-x-1 transition-transform shrink-0">
            <span className="hidden sm:inline">Inspect Shifts</span>
            <ChevronRight className="w-4 h-4" />
          </div>
        </button>
      )}

      {/* Vehicle Profile Status */}
      <div className="flex items-center justify-between gap-2">
        <p className="text-xs text-slate-400 uppercase tracking-wide font-bold">
          Active Combination
        </p>
        <VehicleChip profile={vehicle} onClick={onVehicleClick} />
      </div>

      {/* Destination Search Form with Autocomplete */}
      <div className="relative">
        <form onSubmit={handleSubmit}>
          <div className="relative">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search destination, depot, or post code..."
              className="w-full bg-slate-800 border border-slate-700 rounded-xl pl-10 pr-4 py-3 text-xs sm:text-sm text-white placeholder-slate-500 focus:outline-none focus:border-blue-500 transition-colors shadow-inner"
            />
            {isSearching && (
              <span className="absolute right-3.5 top-1/2 -translate-y-1/2 text-[10px] font-mono text-blue-400 animate-pulse">
                Searching...
              </span>
            )}
          </div>
        </form>

        {/* Live Places Autocomplete Dropdown */}
        {predictions.length > 0 && (
          <div className="absolute top-full left-0 right-0 mt-1.5 bg-slate-900 border border-slate-700 rounded-xl shadow-2xl z-30 overflow-hidden divide-y divide-slate-800">
            {predictions.map((p) => (
              <button
                key={p.placeId}
                onClick={() => handleSelectPrediction(p)}
                className="w-full p-2.5 text-left hover:bg-slate-800 flex items-center justify-between transition-colors cursor-pointer group"
              >
                <div className="min-w-0 pr-2">
                  <p className="text-xs font-bold text-white group-hover:text-blue-300 truncate">
                    {p.mainText || p.description}
                  </p>
                  {p.secondaryText && (
                    <p className="text-[11px] text-slate-400 truncate">{p.secondaryText}</p>
                  )}
                </div>
                <ChevronRight className="w-3.5 h-3.5 text-slate-500 group-hover:text-blue-400 shrink-0" />
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Quick Access Shortcut Pills */}
      <div className="flex gap-2 flex-wrap">
        {SHORTCUTS.map((s) => (
          <button
            key={s.label}
            onClick={() => onRecentRoute(s.label)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-slate-800 hover:bg-slate-700 border border-slate-700 text-xs font-medium text-slate-300 transition-all cursor-pointer active:scale-95"
          >
            {s.icon}
            <span>{s.label}</span>
          </button>
        ))}
      </div>

      {/* Recent & Favourite Routes */}
      <div>
        <p className="text-xs text-slate-400 uppercase tracking-wide font-bold mb-2 flex items-center gap-1.5">
          <Compass className="w-3.5 h-3.5 text-blue-400" />
          <span>Recent Freight Corridors</span>
        </p>
        <div className="flex flex-col gap-1.5">
          {RECENT_ROUTES.map((r) => (
            <button
              key={r.label}
              onClick={() => onRecentRoute(r.label)}
              className="flex items-center gap-3 p-2.5 rounded-xl hover:bg-slate-800 border border-transparent hover:border-slate-700 text-left transition-all cursor-pointer group"
            >
              <div className="w-8 h-8 rounded-lg bg-slate-800 group-hover:bg-slate-700 flex items-center justify-center shrink-0 border border-slate-700/60">
                <Clock className="w-4 h-4 text-blue-400" />
              </div>
              <div className="min-w-0">
                <p className="text-xs sm:text-sm text-slate-200 font-semibold truncate group-hover:text-white">
                  {r.label}
                </p>
                <p className="text-[11px] text-slate-500 truncate">{r.subtitle}</p>
              </div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};
