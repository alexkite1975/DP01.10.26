'use client';

import React, { useState } from 'react';
import Link from 'next/link';
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
  Filter
} from 'lucide-react';
import { initialMarketplaceShifts } from '@/data/mockMarketplaceData';
import { MarketplaceShift } from '@/types';

export default function ReliefDriverShiftsPage() {
  const [shifts] = useState<MarketplaceShift[]>(initialMarketplaceShifts);
  const [selectedFilter, setSelectedFilter] = useState<'ALL' | 'CAT_CE_CLASS_1' | 'CAT_C_CLASS_2'>('ALL');
  const [acceptedShiftIds, setAcceptedShiftIds] = useState<string[]>([]);
  const [activeShiftDetail, setActiveShiftDetail] = useState<MarketplaceShift | null>(null);

  const filteredShifts = shifts.filter(s => {
    if (selectedFilter === 'ALL') return true;
    return s.vehicleClass === selectedFilter;
  });

  const handleAcceptShift = (shiftId: string) => {
    setAcceptedShiftIds(prev => [...prev, shiftId]);
    setActiveShiftDetail(null);
  };

  return (
    <div className="min-h-dvh bg-slate-950 text-white flex flex-col font-sans">
      {/* Mobile Top App Bar */}
      <header className="sticky top-0 z-40 bg-slate-900/95 backdrop-blur border-b border-slate-800 px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Link
            href="/driver"
            className="p-2 -ml-1 rounded-xl bg-slate-800 hover:bg-slate-700 active:scale-95 text-slate-300 hover:text-white transition flex items-center gap-1 text-xs font-semibold"
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

        <span className="text-[11px] font-semibold px-2 py-1 rounded bg-emerald-950/80 text-emerald-300 border border-emerald-800/60 font-mono">
          {filteredShifts.length} Shifts Open
        </span>
      </header>

      {/* Main Single-Purpose Body */}
      <main className="flex-1 w-full max-w-md mx-auto p-4 space-y-4 overflow-y-auto">
        {/* Category Pill Filters */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 no-scrollbar">
          <button
            onClick={() => setSelectedFilter('ALL')}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition ${
              selectedFilter === 'ALL'
                ? 'bg-emerald-600 text-white shadow-md shadow-emerald-900/30'
                : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800'
            }`}
          >
            All Shifts
          </button>
          <button
            onClick={() => setSelectedFilter('CAT_CE_CLASS_1')}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition ${
              selectedFilter === 'CAT_CE_CLASS_1'
                ? 'bg-emerald-600 text-white shadow-md shadow-emerald-900/30'
                : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800'
            }`}
          >
            Class 1 (C+E)
          </button>
          <button
            onClick={() => setSelectedFilter('CAT_C_CLASS_2')}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition ${
              selectedFilter === 'CAT_C_CLASS_2'
                ? 'bg-emerald-600 text-white shadow-md shadow-emerald-900/30'
                : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800'
            }`}
          >
            Class 2 (C)
          </button>
        </div>

        {/* Shifts List */}
        <div className="space-y-3">
          {filteredShifts.map((shift) => {
            const isAccepted = acceptedShiftIds.includes(shift.id);

            return (
              <div
                key={shift.id}
                className="bg-slate-900/90 border border-slate-800 hover:border-slate-700 rounded-2xl p-4 transition shadow-lg space-y-3"
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
                    <span className="text-base font-extrabold text-emerald-400">
                      £{shift.baseHourlyRate.toFixed(2)}
                    </span>
                    <span className="text-[10px] text-slate-400 block font-mono">/hour</span>
                  </div>
                </div>

                {/* Logistics Metadata */}
                <div className="grid grid-cols-2 gap-2 text-xs font-mono py-2 border-y border-slate-800/80">
                  <div className="flex items-center gap-1.5 text-slate-300">
                    <MapPin className="w-3.5 h-3.5 text-slate-400" />
                    <span className="truncate">{shift.location.city}</span>
                  </div>
                  <div className="flex items-center gap-1.5 text-slate-300">
                    <Clock className="w-3.5 h-3.5 text-slate-400" />
                    <span>{shift.durationHours}h Shift</span>
                  </div>
                </div>

                {/* Statutory IR35 Safe-Harbour Badge */}
                <div className="flex items-center justify-between text-[11px] bg-slate-950 p-2.5 rounded-xl border border-slate-800/80">
                  <div className="flex items-center gap-1.5 text-slate-300">
                    <ShieldCheck className="w-4 h-4 text-sky-400 shrink-0" />
                    <span className="truncate font-sans font-medium">Sec 44 ITEPA Safe-Harbour</span>
                  </div>
                  <span className="text-emerald-400 font-bold font-mono">INSIDE IR35</span>
                </div>

                {/* Actions */}
                <div className="pt-1 flex items-center justify-between gap-3">
                  <button
                    onClick={() => setActiveShiftDetail(shift)}
                    className="text-xs text-slate-400 hover:text-white transition font-medium underline-offset-4 hover:underline"
                  >
                    View Requirements ({shift.specialRequirements.length})
                  </button>

                  {isAccepted ? (
                    <div className="px-4 py-2 rounded-xl bg-emerald-950 text-emerald-400 border border-emerald-800/80 text-xs font-bold flex items-center gap-1.5">
                      <CheckCircle2 className="w-4 h-4" /> Booked
                    </div>
                  ) : (
                    <button
                      onClick={() => handleAcceptShift(shift.id)}
                      className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 active:scale-95 text-white text-xs font-bold transition shadow-md shadow-emerald-900/30 flex items-center gap-1"
                    >
                      Accept Shift
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
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-end sm:items-center justify-center p-0 sm:p-4">
          <div className="bg-slate-900 border border-slate-800 w-full max-w-md rounded-t-3xl sm:rounded-3xl p-5 space-y-4 shadow-2xl animate-in slide-in-from-bottom duration-200">
            <div className="flex items-center justify-between">
              <div>
                <span className="text-[10px] font-mono text-emerald-400 font-bold uppercase">
                  Shift Compliance Requirements
                </span>
                <h3 className="text-sm font-bold text-white">{activeShiftDetail.title}</h3>
              </div>
              <button
                onClick={() => setActiveShiftDetail(null)}
                className="p-1.5 rounded-lg bg-slate-800 text-slate-400 hover:text-white text-xs"
              >
                ✕
              </button>
            </div>

            <div className="space-y-2 text-xs">
              <p className="text-slate-400">
                Operating for <strong className="text-white">{activeShiftDetail.haulierName}</strong> (O-Licence: <span className="font-mono text-slate-300">{activeShiftDetail.haulierOlicence}</span>).
              </p>

              <div className="bg-slate-950 p-3 rounded-xl border border-slate-800 space-y-1.5">
                <span className="text-[11px] font-bold text-slate-300 block">Mandatory Qualifications:</span>
                {activeShiftDetail.specialRequirements.map((req, idx) => (
                  <div key={idx} className="flex items-center gap-2 text-slate-300 text-xs">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                    <span>{req}</span>
                  </div>
                ))}
              </div>

              <div className="bg-slate-950 p-3 rounded-xl border border-slate-800 text-[11px] text-slate-400">
                <span className="font-bold text-slate-300 block mb-0.5">IR35 &amp; Tax Determination:</span>
                {activeShiftDetail.ir35Reasoning}
              </div>
            </div>

            <div className="pt-2">
              <button
                onClick={() => handleAcceptShift(activeShiftDetail.id)}
                className="w-full py-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 active:scale-95 text-white font-bold text-sm transition shadow-lg shadow-emerald-900/40"
              >
                Confirm &amp; Accept Shift (£{activeShiftDetail.baseHourlyRate.toFixed(2)}/hr)
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
