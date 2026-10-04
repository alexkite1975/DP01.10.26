'use client';
import React, { useState, useEffect } from 'react';
import { Clock, Play, Pause, AlertTriangle, ShieldCheck } from 'lucide-react';

export default function TachoClocksModule({ onBack }: { onBack: () => void }) {
  const [dutyMode, setDutyMode] = useState<'DRIVE' | 'WORK' | 'REST' | 'POA'>('DRIVE');
  const [driveSeconds, setDriveSeconds] = useState(13240); // ~3h 40m
  const [dailySeconds, setDailySeconds] = useState(25800); // ~7h 10m

  useEffect(() => {
    const timer = setInterval(() => {
      if (dutyMode === 'DRIVE') {
        setDriveSeconds(s => s + 1);
        setDailySeconds(s => s + 1);
      }
    }, 1000);
    return () => clearInterval(timer);
  }, [dutyMode]);

  const formatHMS = (secs: number) => {
    const h = Math.floor(secs / 3600);
    const m = Math.floor((secs % 3600) / 60);
    const s = secs % 60;
    return `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  const remainingBreakSeconds = Math.max(0, 16200 - driveSeconds); // 4h 30m = 16200s
  const isNearLimit = remainingBreakSeconds < 1800; // less than 30 mins

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between border-b border-slate-800 pb-4">
        <div>
          <h2 className="text-xl font-bold font-mono text-white flex items-center gap-2">
            <Clock className="w-6 h-6 text-emerald-400" />
            02. EU 561/2006 Tachograph Compliance Console
          </h2>
          <p className="text-xs text-slate-400 font-mono mt-1">
            Real-Time Statutory Driving Limits, 45m Break Tracker & Daily Rest
          </p>
        </div>
        <button onClick={onBack} className="px-3 py-1.5 rounded-lg bg-slate-800 text-xs font-mono text-slate-300 hover:bg-slate-700">
          ← Back to Cockpit
        </button>
      </div>

      {/* Duty Switcher */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {(['DRIVE', 'WORK', 'REST', 'POA'] as const).map(mode => (
          <button
            key={mode}
            onClick={() => setDutyMode(mode)}
            className={`p-4 rounded-xl font-mono text-sm font-bold border transition-all ${
              dutyMode === mode
                ? mode === 'DRIVE' ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500 shadow-lg shadow-emerald-500/20'
                : mode === 'REST' ? 'bg-blue-500/20 text-blue-400 border-blue-500'
                : mode === 'WORK' ? 'bg-amber-500/20 text-amber-400 border-amber-500'
                : 'bg-purple-500/20 text-purple-400 border-purple-500'
                : 'bg-slate-900/60 text-slate-400 border-slate-800 hover:bg-slate-800'
            }`}
          >
            {mode === 'DRIVE' ? '🚛 DRIVING' : mode === 'WORK' ? '📦 OTHER WORK' : mode === 'REST' ? '☕ REST / BREAK' : '⏳ AVAILABILITY'}
          </button>
        ))}
      </div>

      {/* Active Clocks */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className={`p-5 rounded-2xl border ${isNearLimit ? 'bg-amber-500/10 border-amber-500/40' : 'bg-slate-900/80 border-slate-800'}`}>
          <span className="text-xs font-mono text-slate-400 uppercase">Continuous Driving Clock (Max 4.5h)</span>
          <div className="text-4xl font-extrabold font-mono text-white mt-2">{formatHMS(driveSeconds)}</div>
          <div className="text-xs font-mono mt-2 text-amber-400 font-bold">
            Break required in: {formatHMS(remainingBreakSeconds)}
          </div>
        </div>

        <div className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800">
          <span className="text-xs font-mono text-slate-400 uppercase">Daily Driving Limit (9h / 10h)</span>
          <div className="text-4xl font-extrabold font-mono text-white mt-2">{formatHMS(dailySeconds)}</div>
          <div className="text-xs font-mono mt-2 text-slate-400">
            Daily limit: <strong className="text-emerald-400">9h 00m (0 of 2 10h used)</strong>
          </div>
        </div>

        <div className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800">
          <span className="text-xs font-mono text-slate-400 uppercase">Statutory Daily Rest Due</span>
          <div className="text-4xl font-extrabold font-mono text-white mt-2">11:00:00</div>
          <div className="text-xs font-mono mt-2 text-emerald-400 font-bold flex items-center gap-1">
            <ShieldCheck className="w-4 h-4" /> 100% Legally Compliant
          </div>
        </div>
      </div>
    </div>
  );
}
