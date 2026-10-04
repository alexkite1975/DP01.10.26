'use client';
import React, { useState } from 'react';
import { ClipboardCheck, AlertOctagon, CheckCircle2, Camera } from 'lucide-react';

export default function WalkaroundModule({ onBack }: { onBack: () => void }) {
  const [checks, setChecks] = useState<Record<string, 'PASS' | 'FAIL'>>({
    tyres: 'PASS',
    brakes: 'PASS',
    lights: 'PASS',
    coupling: 'PASS',
    mirrors: 'PASS',
    wipers: 'PASS',
    placards: 'PASS',
    airLeaks: 'PASS'
  });

  const [hasDefect, setHasDefect] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const toggleCheck = (item: string) => {
    setChecks(prev => {
      const next = prev[item] === 'PASS' ? 'FAIL' : 'PASS';
      const anyFail = Object.values({ ...prev, [item]: next }).some(v => v === 'FAIL');
      setHasDefect(anyFail);
      return { ...prev, [item]: next };
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between border-b border-slate-800 pb-4">
        <div>
          <h2 className="text-xl font-bold font-mono text-white flex items-center gap-2">
            <ClipboardCheck className="w-6 h-6 text-emerald-400" />
            03. DVSA Statutory 20-Point Walkaround Inspection
          </h2>
          <p className="text-xs text-slate-400 font-mono mt-1">
            Pre-Shift Vehicle Roadworthiness Audit with Camera Snapper & VOR Safety Lock
          </p>
        </div>
        <button onClick={onBack} className="px-3 py-1.5 rounded-lg bg-slate-800 text-xs font-mono text-slate-300 hover:bg-slate-700">
          ← Back to Cockpit
        </button>
      </div>

      {hasDefect && (
        <div className="p-4 bg-red-500/10 border border-red-500/50 rounded-xl flex items-center gap-3 text-red-400 font-mono text-xs">
          <AlertOctagon className="w-6 h-6 flex-shrink-0 text-red-400 animate-pulse" />
          <div>
            <strong>CRITICAL DEFECT DETECTED — VEHICLE PLACED ON VOR (VEHICLE OFF ROAD)</strong>
            <div>Tractor unit DG21EDP cannot legally be moved on public roads until signed off by a technician.</div>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3">
        {Object.entries(checks).map(([key, status]) => (
          <div
            key={key}
            onClick={() => toggleCheck(key)}
            className={`p-4 rounded-xl border cursor-pointer font-mono text-xs transition-all ${
              status === 'PASS'
                ? 'bg-slate-900/60 border-slate-800 text-slate-300 hover:border-emerald-500/50'
                : 'bg-red-500/20 border-red-500 text-red-300'
            }`}
          >
            <div className="flex justify-between items-center">
              <span className="capitalize font-bold">{key.replace(/([A-Z])/g, ' $1')}</span>
              <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${status === 'PASS' ? 'bg-emerald-500/20 text-emerald-400' : 'bg-red-500 text-white'}`}>
                {status}
              </span>
            </div>
            <div className="mt-2 text-[10px] text-slate-500">Tap to toggle Fail/Pass</div>
          </div>
        ))}
      </div>

      <div className="flex items-center justify-between pt-4 border-t border-slate-800">
        <button
          onClick={() => alert('Camera Snapper Opened: Defect snapshot captured.')}
          className="px-4 py-2 rounded-xl bg-slate-800 text-slate-200 font-mono text-xs font-bold flex items-center gap-2 hover:bg-slate-700"
        >
          <Camera className="w-4 h-4 text-emerald-400" />
          Capture Inspection Photos
        </button>

        <button
          onClick={() => setSubmitted(true)}
          className={`px-6 py-2.5 rounded-xl font-mono text-xs font-bold transition-all ${
            hasDefect
              ? 'bg-red-600 text-white'
              : 'bg-emerald-500 text-slate-950 hover:bg-emerald-400'
          }`}
        >
          {submitted ? '✓ AUDIT SIGNED & SUBMITTED' : hasDefect ? 'LOCK VEHICLE (VOR)' : 'SIGN & PASS INSPECTION'}
        </button>
      </div>
    </div>
  );
}
