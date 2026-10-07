'use client';

import React from 'react';
import Link from 'next/link';
import dynamic from 'next/dynamic';
import { ArrowLeft, Shield } from 'lucide-react';

const DriverSafetyShieldHub = dynamic(() => import('@/components/safety/DriverSafetyShieldHub'), {
  ssr: false,
  loading: () => (
    <div className="p-8 text-center text-slate-400 font-mono text-sm">
      Loading Bridge & Safety Shield...
    </div>
  )
});

export default function DriverSafetyPage() {
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
            <span className="hidden sm:inline">Hub</span>
          </Link>
          <div>
            <h1 className="text-sm font-bold text-white flex items-center gap-1.5">
              <Shield className="w-4 h-4 text-amber-400" /> Bridge & Safety Shield
            </h1>
            <p className="text-[10px] text-slate-400 font-mono">Network Rail Strike Radar</p>
          </div>
        </div>

        <span className="text-[11px] font-semibold px-2 py-1 rounded bg-amber-950/80 text-amber-300 border border-amber-800/60">
          Live Radar
        </span>
      </header>

      {/* Mobile-Optimized Body (Single-Purpose Tool) */}
      <main className="flex-1 w-full max-w-2xl mx-auto p-2 sm:p-4 overflow-y-auto">
        <DriverSafetyShieldHub />
      </main>
    </div>
  );
}
