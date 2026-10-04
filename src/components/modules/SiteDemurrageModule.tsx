'use client';
import React, { useState, useEffect } from 'react';
import { Building2, Timer, KeyRound, AlertCircle } from 'lucide-react';

export default function SiteDemurrageModule({ onBack }: { onBack: () => void }) {
  const [elapsedMinutes, setElapsedMinutes] = useState(135); // 2h 15m (15m into demurrage)
  const freeMinutes = 120; // 2 hour standard UK free waiting time
  const demurrageRatePerHour = 55.0; // £55.00/hr

  const isDemurrageActive = elapsedMinutes > freeMinutes;
  const billableMinutes = Math.max(0, elapsedMinutes - freeMinutes);
  const demurrageCharge = ((billableMinutes / 60) * demurrageRatePerHour).toFixed(2);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between border-b border-slate-800 pb-4">
        <div>
          <h2 className="text-xl font-bold font-mono text-white flex items-center gap-2">
            <Building2 className="w-6 h-6 text-emerald-400" />
            05. Distribution Centre Gatehouse & Demurrage Meter
          </h2>
          <p className="text-xs text-slate-400 font-mono mt-1">
            Automated Site Check-In, Bay Routing & Statutory Detention Fee Billing
          </p>
        </div>
        <button onClick={onBack} className="px-3 py-1.5 rounded-lg bg-slate-800 text-xs font-mono text-slate-300 hover:bg-slate-700">
          ← Back to Cockpit
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Gatehouse PIN */}
        <div className="p-5 bg-slate-900 border border-slate-800 rounded-2xl space-y-3">
          <div className="flex items-center justify-between text-slate-400 font-mono text-xs">
            <span>Gatehouse Security PIN</span>
            <KeyRound className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="text-4xl font-extrabold font-mono text-white tracking-widest text-center py-2">
            0 4 9 2
          </div>
          <div className="text-xs font-mono text-slate-400 text-center">
            Assigned Bay: <strong className="text-emerald-400">BAY 24 (INBOUND PALLETS)</strong>
          </div>
        </div>

        {/* Demurrage Clock */}
        <div className={`p-5 rounded-2xl border col-span-2 ${isDemurrageActive ? 'bg-amber-500/10 border-amber-500/50' : 'bg-slate-900 border-slate-800'}`}>
          <div className="flex items-center justify-between text-slate-400 font-mono text-xs">
            <span className="flex items-center gap-1.5">
              <Timer className="w-4 h-4 text-amber-400" />
              Live Site Detention & Demurrage Meter
            </span>
            <span className="px-2 py-0.5 rounded bg-slate-800 text-xs font-mono text-slate-300">
              Free Allowance: 2 Hours
            </span>
          </div>

          <div className="mt-4 flex items-center justify-between">
            <div>
              <div className="text-3xl font-extrabold font-mono text-white">
                {Math.floor(elapsedMinutes / 60)}h {elapsedMinutes % 60}m On-Site
              </div>
              <div className="text-xs font-mono text-slate-400 mt-1">
                Shipper: <strong className="text-slate-200">Tesco National Distribution Centre</strong>
              </div>
            </div>

            <div className="text-right">
              <div className="text-3xl font-extrabold font-mono text-amber-400">
                +£{demurrageCharge}
              </div>
              <div className="text-[11px] font-mono text-amber-400 font-bold uppercase">
                Billed to Shipper Escrow
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
