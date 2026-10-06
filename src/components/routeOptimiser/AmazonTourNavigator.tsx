'use client';
import React, { useState } from 'react';
import {
  TourShift,
  TourStop,
  AMAZON_RELAY_5DAY_TOUR
} from '../../services/amazonTourData';
import {
  Calendar,
  Clock,
  MapPin,
  Truck,
  ArrowRight,
  ShieldCheck,
  Zap,
  Navigation,
  ChevronLeft,
  ChevronRight,
  SlidersHorizontal,
  Info,
  CheckCircle2,
  AlertTriangle,
  FileText,
  Sparkles,
  Maximize2
} from 'lucide-react';

interface AmazonTourNavigatorProps {
  onSelectStopForNavigation: (stop: TourStop) => void;
  onClose?: () => void;
}

export const AmazonTourNavigator: React.FC<AmazonTourNavigatorProps> = ({
  onSelectStopForNavigation,
  onClose,
}) => {
  // Simplistic "One Page At a Time" shift state
  const [selectedShiftIdx, setSelectedShiftIdx] = useState<number>(0);
  const [highlightEmptyFlexibility, setHighlightEmptyFlexibility] = useState<boolean>(true);
  const [viewMode, setViewMode] = useState<'ONE_PAGE_PER_SHIFT' | 'ALL_DAYS_TIMELINE'>('ONE_PAGE_PER_SHIFT');
  const [showScreenshotModal, setShowScreenshotModal] = useState<boolean>(false);

  const currentShift: TourShift = AMAZON_RELAY_5DAY_TOUR[selectedShiftIdx];

  const handlePrevShift = () => {
    if (selectedShiftIdx > 0) {
      setSelectedShiftIdx(selectedShiftIdx - 1);
    }
  };

  const handleNextShift = () => {
    if (selectedShiftIdx < AMAZON_RELAY_5DAY_TOUR.length - 1) {
      setSelectedShiftIdx(selectedShiftIdx + 1);
    }
  };

  // Helper to render action badge
  const renderActionBadge = (stop: TourStop) => {
    if (stop.trailerStatus === 'EMPTY') {
      return (
        <span className="inline-flex items-center gap-1 text-[11px] font-bold px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/40">
          <Zap className="w-3 h-3 text-emerald-400" />
          EMPTY TRAILER · ANYTIME DROP
        </span>
      );
    }
    return (
      <span className="inline-flex items-center gap-1 text-[11px] font-bold px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/40">
        <Clock className="w-3 h-3 text-amber-400" />
        LOADED TRAILER · APPOINTMENT SLOT
      </span>
    );
  };

  return (
    <div className="flex-1 flex flex-col h-full bg-slate-950 text-slate-100 overflow-y-auto">
      {/* ── Subheader / Control Bar ─────────────────────────────────────────── */}
      <div className="bg-slate-900/95 border-b border-slate-800 p-4 sticky top-0 z-20 backdrop-blur-md">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 max-w-5xl mx-auto">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-black uppercase px-2 py-0.5 rounded bg-blue-600 text-white tracking-wider">
                Amazon Relay
              </span>
              <h2 className="text-base sm:text-lg font-extrabold text-white tracking-tight">
                5-Day Tour Shift Navigator
              </h2>
            </div>
            <p className="text-xs text-slate-400 mt-0.5">
              17-Stop Tour formatted into 5 compliant shifts with rest layovers &amp; empty trailer flexibility
            </p>
          </div>

          {/* Quick Options */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => setHighlightEmptyFlexibility(!highlightEmptyFlexibility)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all border flex items-center gap-1.5 ${
                highlightEmptyFlexibility
                  ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40 shadow-sm shadow-emerald-500/20'
                  : 'bg-slate-800 text-slate-400 border-slate-700 hover:text-white'
              }`}
              title="Highlight stops where empty trailers allow early delivery anytime"
            >
              <Zap className="w-3.5 h-3.5" />
              <span>Empty Trailer Anytime Drop</span>
            </button>

            <button
              onClick={() =>
                setViewMode(viewMode === 'ONE_PAGE_PER_SHIFT' ? 'ALL_DAYS_TIMELINE' : 'ONE_PAGE_PER_SHIFT')
              }
              className="px-3 py-1.5 rounded-xl text-xs font-bold bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 flex items-center gap-1.5 transition-colors"
            >
              <SlidersHorizontal className="w-3.5 h-3.5 text-cyan-400" />
              <span>{viewMode === 'ONE_PAGE_PER_SHIFT' ? 'View All Days' : '1 Page / Shift'}</span>
            </button>
          </div>
        </div>

        {/* ── Simplistic "One Page at a Time" Day Switcher Tabs ────────────────── */}
        <div className="max-w-5xl mx-auto mt-3.5 flex items-center justify-between gap-2 overflow-x-auto pb-1">
          <button
            onClick={handlePrevShift}
            disabled={selectedShiftIdx === 0}
            className="p-2 rounded-lg bg-slate-800/80 hover:bg-slate-700 disabled:opacity-30 disabled:cursor-not-allowed text-slate-300 transition-colors shrink-0"
            title="Previous Day"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>

          <div className="flex items-center gap-2 overflow-x-auto">
            {AMAZON_RELAY_5DAY_TOUR.map((shift, idx) => {
              const isSelected = selectedShiftIdx === idx && viewMode === 'ONE_PAGE_PER_SHIFT';
              return (
                <button
                  key={shift.shiftNumber}
                  onClick={() => {
                    setSelectedShiftIdx(idx);
                    setViewMode('ONE_PAGE_PER_SHIFT');
                  }}
                  className={`px-3 py-2 rounded-xl text-xs font-bold transition-all shrink-0 flex items-center gap-2 border ${
                    isSelected
                      ? 'bg-blue-600 text-white border-blue-400 shadow-md shadow-blue-600/30'
                      : 'bg-slate-800/60 hover:bg-slate-800 text-slate-300 border-slate-700/60'
                  }`}
                >
                  <span className="w-5 h-5 rounded-full bg-slate-900/50 flex items-center justify-center text-[10px]">
                    {shift.shiftNumber}
                  </span>
                  <span>{shift.dayName}</span>
                  <span className="text-[10px] opacity-75 hidden sm:inline">
                    ({shift.stops.length} stops)
                  </span>
                </button>
              );
            })}
          </div>

          <button
            onClick={handleNextShift}
            disabled={selectedShiftIdx === AMAZON_RELAY_5DAY_TOUR.length - 1}
            className="p-2 rounded-lg bg-slate-800/80 hover:bg-slate-700 disabled:opacity-30 disabled:cursor-not-allowed text-slate-300 transition-colors shrink-0"
            title="Next Day"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* ── Main Content Area ───────────────────────────────────────────────── */}
      <div className="flex-1 max-w-5xl mx-auto w-full p-4 sm:p-6 space-y-6">
        {/* Rule Advice Banner */}
        {highlightEmptyFlexibility && (
          <div className="p-3.5 rounded-2xl bg-emerald-950/40 border border-emerald-500/30 text-emerald-200 text-xs flex items-start gap-3">
            <Zap className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
            <div>
              <span className="font-bold block text-sm text-emerald-300">
                Amazon Relay Empty Trailer Window Optimization Active
              </span>
              <p className="text-emerald-200/90 mt-0.5">
                The stops sequence cannot be altered, but <strong>empty trailer drop-offs have 24/7 yard flexibility</strong>. 
                If you arrive ahead of your Relay appointment with an empty trailer, you can drop it at the assigned yard immediately to bank legal rest hours early!
              </p>
            </div>
          </div>
        )}

        {/* ── Render Shifts ─────────────────────────────────────────────────── */}
        {(viewMode === 'ONE_PAGE_PER_SHIFT'
          ? [currentShift]
          : AMAZON_RELAY_5DAY_TOUR
        ).map((shift) => (
          <section
            key={shift.shiftNumber}
            className="bg-slate-900/60 rounded-3xl border border-slate-800 p-5 sm:p-6 shadow-xl space-y-5"
          >
            {/* Shift Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-slate-800 gap-3">
              <div>
                <div className="flex items-center gap-2">
                  <span className="px-2.5 py-0.5 rounded-md bg-blue-500/20 text-blue-300 border border-blue-500/30 font-mono font-bold text-xs">
                    SHIFT {shift.shiftNumber} OF 5
                  </span>
                  <h3 className="text-lg sm:text-xl font-black text-white">
                    {shift.dayName} · {shift.period}
                  </h3>
                </div>
                <p className="text-xs text-slate-400 mt-1 flex items-center gap-3">
                  <span>{shift.stops.length} Scheduled Stops</span>
                  <span>•</span>
                  <span>Est. {shift.totalMilesEst} Miles</span>
                  <span>•</span>
                  <span>Est. Drive Time: {shift.totalDriveEst}</span>
                </p>
              </div>

              {/* Shift Badges */}
              <div className="flex items-center gap-2">
                <span className="text-xs px-3 py-1.5 rounded-xl bg-slate-800 text-slate-300 font-semibold border border-slate-700">
                  {shift.dateLabel}
                </span>
              </div>
            </div>

            {/* List of Stops for this Shift */}
            <div className="space-y-4">
              {shift.stops.map((stop, stopIdx) => {
                const isFlexible = highlightEmptyFlexibility && stop.isFlexibleEmptyDrop;
                return (
                  <div
                    key={stop.id}
                    className={`p-4 sm:p-5 rounded-2xl border transition-all ${
                      isFlexible
                        ? 'bg-gradient-to-r from-emerald-950/20 to-slate-900/80 border-emerald-500/40 shadow-lg shadow-emerald-500/5'
                        : 'bg-slate-900/90 border-slate-800/80 hover:border-slate-700'
                    }`}
                  >
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                      {/* Left: Stop Number & Facility Details */}
                      <div className="flex items-start gap-3.5">
                        <div className="w-8 h-8 rounded-xl bg-blue-600 text-white font-extrabold flex items-center justify-center shrink-0 text-sm shadow-md shadow-blue-600/30">
                          {stop.stopNumber}
                        </div>
                        <div>
                          <div className="flex flex-wrap items-center gap-2">
                            <span className="text-base font-extrabold text-white">
                              {stop.facilityCode}
                            </span>
                            {stop.isThirdParty && (
                              <span className="px-1.5 py-0.2 rounded bg-amber-500/20 text-amber-300 border border-amber-500/30 text-[10px] font-bold">
                                3P THIRD PARTY
                              </span>
                            )}
                            <span className="text-sm font-semibold text-slate-300">
                              · {stop.location}
                            </span>
                          </div>
                          <p className="text-xs text-slate-400 mt-0.5">
                            {stop.facilityName}
                          </p>
                        </div>
                      </div>

                      {/* Right: Time Window & Action Badge */}
                      <div className="flex flex-col sm:items-end gap-1.5">
                        <div className="text-xs font-mono font-bold text-cyan-300 bg-cyan-950/50 px-2.5 py-1 rounded-lg border border-cyan-800">
                          {stop.timeWindow}
                        </div>
                        {renderActionBadge(stop)}
                      </div>
                    </div>

                    {/* Action Description & Driver Advice */}
                    <div className="mt-3.5 pt-3 border-t border-slate-800/60 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                      <div>
                        <div className="text-xs font-bold text-slate-200 flex items-center gap-1.5">
                          <Truck className="w-3.5 h-3.5 text-blue-400" />
                          <span>Action: {stop.actionText}</span>
                        </div>
                        {stop.flexibilityAdvice && (
                          <p className="text-[11px] text-slate-400 mt-1">
                            {stop.flexibilityAdvice}
                          </p>
                        )}
                      </div>

                      {/* 1-Tap Navigate Button */}
                      <button
                        onClick={() => onSelectStopForNavigation(stop)}
                        className="px-3.5 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold flex items-center justify-center gap-1.5 shadow-md shadow-blue-600/25 transition-all cursor-pointer shrink-0"
                      >
                        <Navigation className="w-3.5 h-3.5" />
                        <span>Navigate to Stop {stop.stopNumber}</span>
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Shift Layover / Daily Rest Card */}
            {shift.layoverHours > 0 && (
              <div className="p-4 rounded-2xl bg-indigo-950/40 border border-indigo-500/30 flex items-start sm:items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-indigo-600/30 text-indigo-300 border border-indigo-500/30 flex items-center justify-center shrink-0">
                    <Clock className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="text-xs font-extrabold text-indigo-200 block">
                      Daily Rest / Layover Window
                    </span>
                    <span className="text-xs text-slate-300 font-medium">
                      {shift.layoverText}
                    </span>
                  </div>
                </div>

                <div className="text-right shrink-0">
                  <span className="text-xs font-mono font-bold px-2.5 py-1 rounded-lg bg-indigo-900/60 text-indigo-300 border border-indigo-700">
                    ~{shift.layoverHours}h Layover
                  </span>
                </div>
              </div>
            )}
          </section>
        ))}

        {/* ── Bottom Tour Pagination Navigation ─────────────────────────────── */}
        {viewMode === 'ONE_PAGE_PER_SHIFT' && (
          <div className="flex items-center justify-between pt-4 border-t border-slate-800">
            <button
              onClick={handlePrevShift}
              disabled={selectedShiftIdx === 0}
              className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 disabled:opacity-30 disabled:cursor-not-allowed text-xs font-bold text-slate-200 flex items-center gap-2 transition-colors"
            >
              <ChevronLeft className="w-4 h-4" />
              <span>Previous Shift</span>
            </button>

            <span className="text-xs font-semibold text-slate-400">
              Shift {selectedShiftIdx + 1} of {AMAZON_RELAY_5DAY_TOUR.length}
            </span>

            <button
              onClick={handleNextShift}
              disabled={selectedShiftIdx === AMAZON_RELAY_5DAY_TOUR.length - 1}
              className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 disabled:opacity-30 disabled:cursor-not-allowed text-xs font-bold text-slate-200 flex items-center gap-2 transition-colors"
            >
              <span>Next Shift</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default AmazonTourNavigator;
