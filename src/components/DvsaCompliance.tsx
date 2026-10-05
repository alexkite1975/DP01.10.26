'use client';
import React from 'react';

export default function DvsaCompliance() {
  return (
    <div className="space-y-3 font-mono text-xs">
      <div className="p-3 bg-emerald-500/10 border border-emerald-500/40 rounded-xl flex justify-between items-center">
        <span className="font-bold text-emerald-400">DVSA STATUS: 100% GREEN (0 Infringements)</span>
        <span className="text-slate-400 text-[10px]">EU Reg 561/2006</span>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <div className="bg-slate-900/90 border border-slate-800 p-4 rounded-2xl">
          <span className="text-slate-500 text-[10px] block">CONTINUOUS DRIVE LIMIT</span>
          <span className="text-xl font-bold text-emerald-400">3h 15m / 4h 30m</span>
          <div className="w-full bg-slate-950 h-2 rounded-full mt-2 overflow-hidden">
            <div className="bg-emerald-400 h-full w-[72%]" />
          </div>
          <span className="text-[10px] text-amber-300 mt-1 block">45m break due in 1h 15m</span>
        </div>
        <div className="bg-slate-900/90 border border-slate-800 p-4 rounded-2xl">
          <span className="text-slate-500 text-[10px] block">DAILY DRIVE REMAINING</span>
          <span className="text-xl font-bold text-white">4h 45m Left</span>
          <div className="w-full bg-slate-950 h-2 rounded-full mt-2 overflow-hidden">
            <div className="bg-blue-400 h-full w-[47%]" />
          </div>
          <span className="text-[10px] text-slate-400 mt-1 block">10h extensions left: 2/2</span>
        </div>
        <div className="bg-slate-900/90 border border-slate-800 p-4 rounded-2xl">
          <span className="text-slate-500 text-[10px] block">WTD 6-HOUR BREAK</span>
          <span className="text-xl font-bold text-emerald-400">PASSED</span>
          <span className="text-[10px] text-slate-400 mt-1 block">30m break logged</span>
        </div>
      </div>
    </div>
  );
}
