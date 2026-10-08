'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import dynamic from 'next/dynamic';
import { ArrowLeft, Clock, Sparkles } from 'lucide-react';
import { TachoHeadUnitHUD } from '@/components/tacho/TachoHeadUnitHUD';

const TachoScanApp = dynamic(() => import('@/components/tacho/TachoScanApp'), {
  ssr: false,
  loading: () => (
    <div className="p-8 text-center text-slate-400 font-mono text-sm">
      Loading Tacho AI & .DDD Compliance...
    </div>
  )
});

export default function DriverTachoPage() {
  const [viewMode, setViewMode] = useState<'SCANNER' | 'HUD'>('HUD');

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
            <span className="hidden sm:inline">Hub</span>
          </Link>
          <div>
            <h1 className="text-sm font-bold text-white flex items-center gap-1.5">
              <Clock className="w-4 h-4 text-cyan-400" /> Tacho AI &amp; .DDD
            </h1>
            <p className="text-[10px] text-slate-400 font-mono">EU 561/2006 &amp; WTD Compliance</p>
          </div>
        </div>

        {/* View Mode Switcher */}
        <div className="bg-slate-950/80 p-0.5 rounded-xl border border-slate-800 flex items-center">
          <button
            onClick={() => setViewMode('HUD')}
            className={`px-2.5 py-1 rounded-lg text-xs font-mono font-bold flex items-center gap-1 transition ${
              viewMode === 'HUD'
                ? 'bg-cyan-600 text-white shadow-sm'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Sparkles className="w-3 h-3 text-amber-300" />
            <span>SE5000 HUD</span>
          </button>
          <button
            onClick={() => setViewMode('SCANNER')}
            className={`px-2.5 py-1 rounded-lg text-xs font-mono font-bold transition ${
              viewMode === 'SCANNER'
                ? 'bg-blue-600 text-white shadow-sm'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            OCR Scan
          </button>
        </div>
      </header>

      {/* Mobile-Optimized Body */}
      <main className="flex-1 w-full max-w-2xl mx-auto p-2 sm:p-4 overflow-y-auto space-y-4">
        {viewMode === 'HUD' ? (
          <div className="space-y-4 animate-in fade-in duration-200">
            <TachoHeadUnitHUD />
          </div>
        ) : (
          <TachoScanApp />
        )}
      </main>
    </div>
  );
}
