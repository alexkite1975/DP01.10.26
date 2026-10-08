'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import dynamic from 'next/dynamic';
import { ArrowLeft, Shield, Sparkles } from 'lucide-react';
import { BridgeClearanceGantryHUD } from '@/components/safety/BridgeClearanceGantryHUD';

const DriverSafetyShieldHub = dynamic(() => import('@/components/safety/DriverSafetyShieldHub'), {
  ssr: false,
  loading: () => (
    <div className="p-8 text-center text-slate-400 font-mono text-sm">
      Loading Bridge &amp; Safety Shield...
    </div>
  )
});

export default function DriverSafetyPage() {
  const [viewMode, setViewMode] = useState<'HUD' | 'HUB'>('HUD');

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
              <Shield className="w-4 h-4 text-amber-400" /> Bridge &amp; Safety Shield
            </h1>
            <p className="text-[10px] text-slate-400 font-mono">Network Rail Strike Radar</p>
          </div>
        </div>

        {/* View Mode Switcher */}
        <div className="bg-slate-950/80 p-0.5 rounded-xl border border-slate-800 flex items-center">
          <button
            onClick={() => setViewMode('HUD')}
            className={`px-2.5 py-1 rounded-lg text-xs font-mono font-bold flex items-center gap-1 transition ${
              viewMode === 'HUD'
                ? 'bg-amber-600 text-white shadow-sm'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Sparkles className="w-3 h-3 text-yellow-200" />
            <span>Gantry HUD</span>
          </button>
          <button
            onClick={() => setViewMode('HUB')}
            className={`px-2.5 py-1 rounded-lg text-xs font-mono font-bold transition ${
              viewMode === 'HUB'
                ? 'bg-blue-600 text-white shadow-sm'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            Shield Hub
          </button>
        </div>
      </header>

      {/* Mobile-Optimized Body */}
      <main className="flex-1 w-full max-w-2xl mx-auto p-2 sm:p-4 overflow-y-auto space-y-4">
        {viewMode === 'HUD' ? (
          <div className="space-y-4 animate-in fade-in duration-200">
            <BridgeClearanceGantryHUD />
          </div>
        ) : (
          <DriverSafetyShieldHub />
        )}
      </main>
    </div>
  );
}
