'use client';
import React from 'react';
import { ShieldCheck, Radio, Clock, MapPin } from 'lucide-react';

export default function LiveTelemetryBar() {
  return (
    <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-3 flex flex-wrap items-center justify-between text-xs font-mono text-slate-300 gap-3 shadow-lg">
      <div className="flex items-center gap-2">
        <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
        <span className="font-bold text-white">DRIVE PARTNERS OS</span>
        <span className="text-slate-600">|</span>
        <span className="text-emerald-400 font-bold">SYSTEM OPTIMAL</span>
      </div>
      <div className="flex items-center gap-4 text-[11px]">
        <div className="flex items-center gap-1.5">
          <Radio className="w-3.5 h-3.5 text-blue-400" />
          <span>GPS: M1 J15A (52.19° N, 0.90° W)</span>
        </div>
        <div className="flex items-center gap-1.5 text-emerald-400 font-bold">
          <ShieldCheck className="w-3.5 h-3.5" />
          <span>DVSA COMPLIANT</span>
        </div>
      </div>
    </div>
  );
}
