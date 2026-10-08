'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import confetti from 'canvas-confetti';
import {
  ArrowLeft,
  Users,
  Clock,
  MapPin,
  ShieldCheck,
  CheckCircle2,
  AlertCircle,
  Truck,
  DollarSign,
  ChevronRight,
  Filter,
  Sparkles,
  Building2,
  CalendarCheck
} from 'lucide-react';
import { initialMarketplaceShifts } from '@/data/mockMarketplaceData';
import { MarketplaceShift } from '@/types';
import { audioFeedback } from '@/utils/audioFeedback';
import { RollingCounter } from '@/components/shared/RollingCounter';

export default function ReliefDriverShiftsPage() {
  const [shifts] = useState<MarketplaceShift[]>(initialMarketplaceShifts);
  const [selectedFilter, setSelectedFilter] = useState<'ALL' | 'CAT_CE_CLASS_1' | 'CAT_C_CLASS_2'>('ALL');
  const [acceptedShiftIds, setAcceptedShiftIds] = useState<string[]>([]);
  const [activeShiftDetail, setActiveShiftDetail] = useState<MarketplaceShift | null>(null);

  const filteredShifts = shifts.filter((s) => {
    if (selectedFilter === 'ALL') return true;
    return s.vehicleClass === selectedFilter;
  });

  const handleFilterClick = (filter: 'ALL' | 'CAT_CE_CLASS_1' | 'CAT_C_CLASS_2') => {
    setSelectedFilter(filter);
    audioFeedback.playCheckpointClick();
  };

  const handleAcceptShift = (shiftId: string) => {
    setAcceptedShiftIds((prev) => [...prev, shiftId]);
    setActiveShiftDetail(null);
    audioFeedback.playSuccessChime();

    // Celebratory confetti burst
    try {
      confetti({
        particleCount: 50,
        spread: 60,
        origin: { y: 0.8 },
        colors: ['#10b981', '#34d399', '#6ee7b7', '#f59e0b', '#38bdf8']
      });
    } catch {
      // Ignore if canvas not supported
    }
  };

  return (
    <div className="min-h-dvh bg-slate-950 text-white flex flex-col font-sans">
      {/* Mobile Top App Bar */}
      <header className="sticky top-0 z-40 bg-slate-900/90 backdrop-blur-xl border-b border-slate-800 px-4 py-3 flex items-center justify-between shadow-cockpit">
        <div className="flex items-center gap-3">
          <Link
            href="/driver"
            className="p-2 -ml-1 rounded-xl bg-slate-800/80 hover:bg-slate-700 active:scale-95 text-slate-300 hover:text-white transition flex items-center gap-1 text-xs font-semibold touch-press"
            aria-label="Return to In-Cab Hub"
          >
            <ArrowLeft className="w-4 h-4" />
            <span className="hidden sm:inline">In-Cab</span>
          </Link>
          <div>
            <h1 className="text-sm font-bold text-white flex items-center gap-1.5">
              <Users className="w-4 h-4 text-emerald-400" /> Relief Driver Shifts
            </h1>
            <p className="text-[10px] text-slate-400 font-mono">Haulier Sickness &amp; Night Trunk Cover • IR35 Safe</p>
          </div>
        </div>

        <span className="text-[11px] font-semibold px-2 py-1 rounded-xl bg-emerald-950/80 text-emerald-300 border border-emerald-800/60 font-mono shadow-inner">
          {filteredShifts.length} Shifts Open
        </span>
      </header>

      {/* Main Single-Purpose Body */}
      <main className="flex-1 w-full max-w-md mx-auto p-4 space-y-4 overflow-y-auto">
        {/* Category Pill Filters */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 no-scrollbar">
          <button
            onClick={() => handleFilterClick('ALL')}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition touch-press ${
              selectedFilter === 'ALL'
                ? 'bg-emerald-600 text-white shadow-md shadow-emerald-900/30'
                : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800'
            }`}
          >
            All Shifts
          </button>
          <button
            onClick={() => handleFilterClick('CAT_CE_CLASS_1')}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition touch-press ${
              selectedFilter === 'CAT_CE_CLASS_1'
                ? 'bg-emerald-600 text-white shadow-md shadow-emerald-900/30'
                : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800'
            }`}
          >
            Class 1 (C+E)
          </button>
          <button
            onClick={() => handleFilterClick('CAT_C_CLASS_2')}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition touch-press ${
              selectedFilter === 'CAT_C_CLASS_2'
                ? 'bg-emerald-600 text-white shadow-md shadow-emerald-900/30'
                : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800'
            }`}
          >
            Class 2 (C)
          </button>
        </div>

        {/* Shifts List */}
        <div className="space-y-3.5">
          {filteredShifts.map((shift) => {
            const isAccepted = acceptedShiftIds.includes(shift.id);
            const totalEstimatedPay = shift.baseHourlyRate * shift.durationHours;

            return (
              <div
                key={shift.id}
                className={`cockpit-panel rounded-2xl p-4 transition-all shadow-cockpit space-y-3 border ${
                  isAccepted
                    ? 'border-emerald-500/60 bg-emerald-950/20 shadow-glow-emerald'
                    : 'border-white/10 hover:border-emerald-500/40'
                }`}
              >
                {/* Header */}
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-emerald-950 text-emerald-400 border border-emerald-800/60">
                        {shift.vehicleClass === 'CAT_CE_CLASS_1' ? 'Class 1 (C+E)' : 'Class 2 (C)'}
                      </span>
                      <span className="text-[10px] text-slate-400 font-mono">{shift.shiftRef}</span>
                    </div>
                    <h2 className="text-sm font-bold text-white mt-1 leading-snug">{shift.title}</h2>
                    <p className="text-xs text-slate-400 font-medium">{shift.haulierName}</p>
                  </div>

                  <div className="text-right shrink-0">
                    <span className="text-base font-black text-emerald-400 font-mono">
                      £{shift.baseHourlyRate.toFixed(2)}
                    </span>
                    <span className="text-[10px] text-slate-400 block font-mono">/hour</span>
                  </div>
                </div>

                {/* Logistics Metadata */}
                <div className="grid grid-cols-3 gap-2 text-xs font-mono py-2 border-y border-slate-800/80">
                  <div className="flex items-center gap-1.5 text-slate-300">
                    <MapPin className="w-3.5 h-3.5 text-slate-400" />
                    <span className="truncate">{shift.location.city}</span>
                  </div>
                  <div className="flex items-center gap-1.5 text-slate-300">
                    <Clock className="w-3.5 h-3.5 text-slate-400" />
                    <span>{shift.durationHours}h Shift</span>
                  </div>
                  <div className="flex items-center gap-1 text-emerald-300 font-bold justify-end">
                    <span>Est:</span>
                    <span>£{totalEstimatedPay.toFixed(0)}</span>
                  </div>
                </div>

                {/* Statutory IR35 Safe-Harbour Badge */}
                <div className="flex items-center justify-between text-[11px] bg-slate-950/80 p-2.5 rounded-xl border border-slate-800/80">
                  <div className="flex items-center gap-1.5 text-slate-300">
                    <ShieldCheck className="w-4 h-4 text-sky-400 shrink-0" />
                    <span className="truncate font-sans font-medium">Sec 44 ITEPA Safe-Harbour</span>
                  </div>
                  <span className="text-emerald-400 font-bold font-mono">INSIDE IR35</span>
                </div>

                {/* Actions */}
                <div className="pt-1 flex items-center justify-between gap-3">
                  <button
                    onClick={() => {
                      setActiveShiftDetail(shift);
                      audioFeedback.playCheckpointClick();
                    }}
                    className="text-xs text-slate-400 hover:text-white transition font-medium underline-offset-4 hover:underline"
                  >
                    View Requirements ({shift.specialRequirements.length})
                  </button>

                  {isAccepted ? (
                    <div className="px-4 py-2 rounded-xl bg-emerald-950/80 text-emerald-400 border border-emerald-800/80 text-xs font-bold font-mono flex items-center gap-1.5 shadow-inner">
                      <CheckCircle2 className="w-4 h-4 text-emerald-400" /> Shift Booked
                    </div>
                  ) : (
                    <button
                      onClick={() => handleAcceptShift(shift.id)}
                      className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 active:scale-95 text-white text-xs font-bold transition shadow-md shadow-emerald-900/30 flex items-center gap-1 touch-press"
                    >
                      <CalendarCheck className="w-3.5 h-3.5" />
                      <span>Accept Shift</span>
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </main>

      {/* Requirement Details Modal */}
      {activeShiftDetail && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 animate-in fade-in">
          <div className="cockpit-panel rounded-t-3xl sm:rounded-3xl max-w-md w-full p-6 space-y-4 max-h-[85vh] overflow-y-auto border border-white/10">
            <div className="flex items-start justify-between border-b border-slate-800 pb-3">
              <div>
                <span className="text-[10px] font-mono text-emerald-400 uppercase font-bold">
                  {activeShiftDetail.shiftRef} Requirements
                </span>
                <h3 className="text-base font-bold text-white">{activeShiftDetail.title}</h3>
                <p className="text-xs text-slate-400">{activeShiftDetail.haulierName}</p>
              </div>
              <button
                onClick={() => setActiveShiftDetail(null)}
                className="text-slate-400 hover:text-white text-sm p-1 touch-press"
              >
                ✕
              </button>
            </div>

            <div className="space-y-2">
              <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider font-mono">
                Mandatory In-Cab Criteria
              </h4>
              <ul className="space-y-1.5 text-xs text-slate-300">
                {activeShiftDetail.specialRequirements.map((req, i) => (
                  <li key={i} className="flex items-center gap-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                    <span>{req}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="p-3 bg-slate-950/80 rounded-xl border border-slate-800 text-xs space-y-1">
              <div className="flex items-center gap-1.5 text-sky-400 font-bold">
                <ShieldCheck className="w-4 h-4" />
                <span>Statutory Compliance Guarantee</span>
              </div>
              <p className="text-slate-400 text-[11px] leading-relaxed">
                Remuneration settled directly with gross pay and standard tax deducted at source under PAYE/Umbrella rules. Zero agency clawbacks.
              </p>
            </div>

            <div className="pt-2 flex gap-3">
              <button
                onClick={() => handleAcceptShift(activeShiftDetail.id)}
                className="flex-1 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 font-bold text-xs text-white shadow-md shadow-emerald-900/30 transition touch-press"
              >
                Accept &amp; Book Shift
              </button>
              <button
                onClick={() => setActiveShiftDetail(null)}
                className="px-4 py-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold text-xs transition touch-press"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
