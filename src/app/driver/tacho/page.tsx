'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import dynamic from 'next/dynamic';
import { ArrowLeft, Clock, Sparkles, ScanLine, Radio } from 'lucide-react';
import { TachoHeadUnitHUD } from '@/components/tacho/TachoHeadUnitHUD';
import { audioFeedback } from '@/utils/audioFeedback';

const TachoScanApp = dynamic(() => import('@/components/tacho/TachoScanApp').then((m) => m.TachoScanApp), {
  ssr: false,
  loading: () => (
    <div className="p-12 text-center space-y-3 font-mono">
      <div className="w-10 h-10 border-2 border-amber-500 border-t-transparent rounded-full animate-spin mx-auto" />
      <div className="text-sm font-bold text-slate-300">Initializing Tacho-Scan Neural OCR...</div>
      <div className="text-xs text-slate-500">Stoneridge SE5000 &amp; VDO DTCO Multi-Model Alignment</div>
    </div>
  )
});

export default function DriverTachoPage() {
  const [viewMode, setViewMode] = useState<'SCANNER' | 'HUD'>('SCANNER');

  const handleModeSwitch = (mode: 'SCANNER' | 'HUD') => {
    setViewMode(mode);
    audioFeedback.playCheckpointClick();
  };

  return (
    <div className="min-h-dvh bg-slate-950 text-white flex flex-col font-sans bg-cockpit-grid">
      {/* Mobile Top App Bar */}
      <header className="sticky top-0 z-40 bg-slate-900/90 backdrop-blur-xl border-b border-slate-800/80 px-4 py-3 flex items-center justify-between shadow-cockpit">
        <div className="flex items-center gap-3">
          <Link
            href="/driver"
            onClick={() => audioFeedback.playCheckpointClick()}
            className="p-2 -ml-1 rounded-xl bg-slate-800/80 hover:bg-slate-700 active:scale-95 text-slate-300 hover:text-white transition flex items-center gap-1 text-xs font-semibold touch-press shadow-sm"
            aria-label="Return to In-Cab Hub"
          >
            <ArrowLeft className="w-4 h-4" />
            <span className="hidden sm:inline font-mono">Hub</span>
          </Link>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-sm font-bold text-white flex items-center gap-1.5">
                <ScanLine className="w-4 h-4 text-amber-400" />
                <span>Tacho AI &amp; .DDD</span>
              </h1>
              <div className="hidden sm:flex items-center gap-1 px-2 py-0.5 rounded-full bg-amber-950/80 border border-amber-800/60 text-[10px] font-mono font-bold text-amber-300">
                <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-pulse" />
                EU 561/2006
              </div>
            </div>
            <p className="text-[10px] text-slate-400 font-mono">Optical Thermal Scanner &amp; In-Cab Audit</p>
          </div>
        </div>

        {/* View Mode Switcher */}
        <div className="bg-slate-950/90 p-1 rounded-2xl border border-slate-800/80 flex items-center shadow-inner gap-1">
          <button
            onClick={() => handleModeSwitch('SCANNER')}
            className={`px-3 py-1.5 rounded-xl text-xs font-mono font-bold flex items-center gap-1.5 transition touch-press ${
              viewMode === 'SCANNER'
                ? 'bg-amber-500 text-slate-950 shadow-md shadow-amber-500/20'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <ScanLine className="w-3.5 h-3.5" />
            <span>Tacho Scan</span>
          </button>
          <button
            onClick={() => handleModeSwitch('HUD')}
            className={`px-3 py-1.5 rounded-xl text-xs font-mono font-bold flex items-center gap-1.5 transition touch-press ${
              viewMode === 'HUD'
                ? 'bg-cyan-600 text-white shadow-md shadow-cyan-900/30'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5 text-yellow-300" />
            <span>SE5000 HUD</span>
          </button>
        </div>
      </header>

      {/* Main Single-Purpose Body */}
      <main className="flex-1 w-full max-w-4xl mx-auto p-2 sm:p-4 overflow-y-auto">
        {viewMode === 'HUD' ? (
          <div className="space-y-4 animate-in fade-in duration-200">
            <TachoHeadUnitHUD />
          </div>
        ) : (
          <div className="space-y-4 animate-in fade-in duration-200">
            <TachoScanApp initialView="ACTION_MENU" />
          </div>
        )}
      </main>
    </div>
  );
}
