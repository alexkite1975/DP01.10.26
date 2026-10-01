'use client';

import React, { useState, useEffect, useMemo } from 'react';
import {
  Clock, Truck, Navigation, FileCheck,
  ScanLine, FileText, LogOut, Sliders, Play, Pause, X
} from 'lucide-react';

export interface TrailerProfile {
  id: string;
  code: string;
  type: string;
  heightMetric: string;
  heightImperial: string;
  grossWeight: string;
  axleConfig: string;
}

const AVAILABLE_TRAILERS: TrailerProfile[] = [
  { id: 'tr_8492', code: 'TR-8492', type: 'High-Cube Curtainsider', heightMetric: '4.45m', heightImperial: "14' 7\"", grossWeight: '44t Gross', axleConfig: '3-Axle Semi (6-Axle Artic)' },
  { id: 'tr_3301', code: 'TR-3301', type: 'Standard Box Van', heightMetric: '4.20m', heightImperial: "13' 9\"", grossWeight: '44t Gross', axleConfig: '3-Axle Semi (6-Axle Artic)' },
  { id: 'tr_9104', code: 'TR-9104', type: 'Double-Deck Step-Frame', heightMetric: '4.88m', heightImperial: "16' 0\"", grossWeight: '44t Gross', axleConfig: '3-Axle Step-Frame' }
];

export default function InCabDashboard({
  onOpenWalkaround,
  onOpenMap
}: {
  onOpenWalkaround?: () => void;
  onOpenMap?: () => void;
}) {
  const [continuousSecs, setContinuousSecs] = useState<number>(3 * 3600 + 42 * 60);
  const [dailySecs, setDailySecs] = useState<number>(7 * 3600 + 18 * 60);
  const [shiftSpreadSecs, setShiftSpreadSecs] = useState<number>(5 * 3600 + 50 * 60);
  const [isDriving, setIsDriving] = useState<boolean>(true);
  const [isExtendedDaily, setIsExtendedDaily] = useState<boolean>(false);
  const [selectedTrailer, setSelectedTrailer] = useState<TrailerProfile>(AVAILABLE_TRAILERS[0]);
  const [isTrailerModalOpen, setIsTrailerModalOpen] = useState<boolean>(false);
  const [currentStepIndex, setCurrentStepIndex] = useState<number>(3);

  useEffect(() => {
    if (!isDriving) return;
    const interval = setInterval(() => {
      setContinuousSecs(prev => Math.max(0, prev - 1));
      setDailySecs(prev => Math.max(0, prev - 1));
      setShiftSpreadSecs(prev => Math.max(0, prev - 1));
    }, 1000);
    return () => clearInterval(interval);
  }, [isDriving]);

  const formatTimer = (totalSecs: number) => {
    const h = Math.floor(totalSecs / 3600);
    const m = Math.floor((totalSecs % 3600) / 60);
    const s = totalSecs % 60;
    const pad = (n: number) => n.toString().padStart(2, '0');
    return `${pad(h)}h ${pad(m)}m ${pad(s)}s`;
  };

  const continuousStatus = useMemo(() => {
    if (continuousSecs <= 900) return 'critical';
    if (continuousSecs <= 2700) return 'warning';
    return 'normal';
  }, [continuousSecs]);

  const shiftSteps = [
    { stepNumber: '01', title: 'Clock In', icon: Clock, action: () => setCurrentStepIndex(0) },
    { stepNumber: '02', title: 'Tacho Scan', icon: ScanLine, action: () => setCurrentStepIndex(1) },
    { stepNumber: '03', title: 'Walkaround Check', icon: FileCheck, action: () => { setCurrentStepIndex(2); if (onOpenWalkaround) onOpenWalkaround(); } },
    { stepNumber: '04', title: 'Route Navigation', icon: Navigation, action: () => { setCurrentStepIndex(3); if (onOpenMap) onOpenMap(); } },
    { stepNumber: '05', title: 'Delivery / e-POD', icon: FileText, action: () => setCurrentStepIndex(4) },
    { stepNumber: '06', title: 'Daily De-brief', icon: LogOut, action: () => setCurrentStepIndex(5) }
  ];

  return (
    <div className="space-y-5">
      <header className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-[#0D1527] border border-slate-800 p-4 sm:p-5 rounded-2xl shadow-2xl">
        <div className="flex items-center space-x-3.5">
          <div className="w-12 h-12 rounded-xl bg-cyan-500/20 border border-cyan-500/40 flex items-center justify-center">
            <Truck className="w-6 h-6 text-cyan-400" />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <span className="text-xs uppercase font-semibold text-cyan-400 bg-cyan-950 px-2 py-0.5 rounded-full border border-cyan-800">Sprint 1.1 In-Cab</span>
              <span className="text-xs text-emerald-400 font-mono flex items-center"><span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse mr-1" /> CAN-Bus Online</span>
            </div>
            <h1 className="text-xl sm:text-2xl font-bold text-white mt-0.5">Driver Command Centre</h1>
          </div>
        </div>

        <button onClick={() => setIsTrailerModalOpen(true)} className="flex items-center gap-3 bg-slate-900 hover:bg-slate-800 border border-slate-700 hover:border-cyan-500/60 p-3 rounded-xl transition text-left">
          <div className="flex flex-col items-center bg-black/60 border border-slate-700 px-2.5 py-1 rounded-lg">
            <span className="text-[9px] uppercase font-bold text-slate-400">CAB PLACARD</span>
            <span className="text-base font-black font-mono text-cyan-300">{selectedTrailer.heightMetric}</span>
            <span className="text-[9px] font-mono text-slate-400">{selectedTrailer.heightImperial}</span>
          </div>
          <div>
            <div className="text-xs font-bold text-white font-mono">DG21EDP / {selectedTrailer.code}</div>
            <div className="text-[11px] text-slate-400">{selectedTrailer.type}</div>
          </div>
          <div className="ml-2 flex items-center text-xs font-medium text-cyan-400 bg-cyan-500/10 px-2 py-1 rounded border border-cyan-500/30">
            <Sliders className="w-3 h-3 mr-1" /> Swap
          </div>
        </button>
      </header>

      <section className="space-y-2">
        <div className="flex items-center justify-between px-1">
          <h2 className="text-xs font-bold uppercase text-slate-300 font-mono flex items-center gap-1.5">
            <Clock className="w-4 h-4 text-cyan-400" /> EU 561/2006 Tachograph Compliance Strip
          </h2>
          <button onClick={() => setIsDriving(!isDriving)} className="flex items-center gap-1 text-xs font-mono text-slate-300 bg-slate-800 px-2.5 py-1 rounded border border-slate-700">
            {isDriving ? <><Pause className="w-3 h-3 text-amber-400" /> Pause Drive</> : <><Play className="w-3 h-3 text-emerald-400" /> Resume Drive</>}
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          <div className={`p-4 rounded-xl border ${continuousStatus === 'critical' ? 'bg-rose-950/40 border-rose-500 animate-pulse' : continuousStatus === 'warning' ? 'bg-amber-950/40 border-amber-500' : 'bg-[#0D1527] border-slate-800'}`}>
            <div className="flex items-center justify-between text-xs text-slate-400 mb-1">
              <span>Clock 1 • Continuous</span>
              {continuousStatus === 'critical' ? <span className="text-rose-400 font-bold">&lt;15m VIOLATION</span> : continuousStatus === 'warning' ? <span className="text-amber-400 font-bold">&lt;45m WARNING</span> : <span className="text-emerald-400">SAFE</span>}
            </div>
            <div className="text-2xl font-black font-mono text-white">{formatTimer(continuousSecs)}</div>
            <p className="text-[11px] text-slate-400 mt-1">To mandatory 45m break (04h 30m max)</p>
          </div>

          <div className="p-4 rounded-xl border bg-[#0D1527] border-slate-800">
            <div className="flex items-center justify-between text-xs text-slate-400 mb-1">
              <span>Clock 2 • Daily Drive</span>
              <button onClick={() => setIsExtendedDaily(!isExtendedDaily)} className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-slate-800 border border-slate-700 text-cyan-300">
                {isExtendedDaily ? '10h Extended' : '9h Standard'}
              </button>
            </div>
            <div className="text-2xl font-black font-mono text-cyan-300">{formatTimer(isExtendedDaily ? dailySecs + 3600 : dailySecs)}</div>
            <p className="text-[11px] text-slate-400 mt-1">Total daily driving remaining</p>
          </div>

          <div className="p-4 rounded-xl border bg-[#0D1527] border-slate-800">
            <div className="flex items-center justify-between text-xs text-slate-400 mb-1">
              <span>Clock 3 • Shift Spread</span>
              <span className="text-[10px] text-cyan-400">13h Window</span>
            </div>
            <div className="text-2xl font-black font-mono text-white">{formatTimer(shiftSpreadSecs)}</div>
            <p className="text-[11px] text-slate-400 mt-1">To required 11h daily rest</p>
          </div>

          <div className="p-4 rounded-xl border bg-[#0D1527] border-slate-800 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between text-xs text-slate-400 mb-1">
                <span>Clock 4 • Next Break</span>
                <span className="text-[10px] text-emerald-400">45m Qualifying</span>
              </div>
              <div className="text-2xl font-black font-mono text-emerald-400">{Math.floor(continuousSecs / 3600)}h {Math.floor((continuousSecs % 3600) / 60)}m</div>
            </div>
            <button onClick={() => { setContinuousSecs(4.5 * 3600); alert('45m rest logged! Reset to 04h 30m.'); }} className="mt-2 text-xs font-bold text-slate-200 bg-slate-800 hover:bg-emerald-900 border border-slate-700 py-1.5 rounded transition text-center">
              Log 45m Rest Now
            </button>
          </div>
        </div>
      </section>

      <section className="bg-[#0D1527] border border-slate-800 p-4 sm:p-5 rounded-2xl shadow-2xl">
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-sm font-bold text-white uppercase font-mono">Shift Progression Workflow</h2>
          <span className="text-xs text-cyan-300 font-mono">Stage {shiftSteps[currentStepIndex].stepNumber}: {shiftSteps[currentStepIndex].title}</span>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2.5">
          {shiftSteps.map((step, idx) => {
            const isCompleted = idx < currentStepIndex;
            const isActive = idx === currentStepIndex;
            const StepIcon = step.icon;
            return (
              <button key={step.stepNumber} onClick={step.action} className={`p-3 rounded-xl border text-left transition min-h-[88px] flex flex-col justify-between ${isActive ? 'bg-cyan-950/50 border-cyan-400 ring-2 ring-cyan-500/40' : isCompleted ? 'bg-slate-900/70 border-emerald-500/50' : 'bg-slate-900/30 border-slate-800 opacity-60'}`}>
                <div className="flex items-center justify-between w-full">
                  <span className={`text-[10px] font-mono font-bold px-1 rounded ${isActive ? 'bg-cyan-500 text-black' : isCompleted ? 'bg-emerald-950 text-emerald-400' : 'bg-slate-800 text-slate-400'}`}>{step.stepNumber}</span>
                  {isCompleted && <span className="text-[10px] font-bold text-emerald-400">DONE</span>}
                  {isActive && <span className="text-[10px] font-bold text-cyan-300 animate-pulse">ACTIVE</span>}
                </div>
                <div className="flex items-center gap-1.5 mt-2">
                  <StepIcon className={`w-3.5 h-3.5 ${isActive ? 'text-cyan-400' : isCompleted ? 'text-emerald-400' : 'text-slate-500'}`} />
                  <span className="text-xs font-bold text-white truncate">{step.title}</span>
                </div>
              </button>
            );
          })}
        </div>
      </section>

      {isTrailerModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="w-full max-w-md bg-[#0D1527] border border-cyan-500/50 rounded-2xl p-5 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-2">
              <h3 className="text-base font-bold text-white">Swap Trailer Profile</h3>
              <button onClick={() => setIsTrailerModalOpen(false)} className="text-slate-400 hover:text-white"><X className="w-5 h-5" /></button>
            </div>
            <div className="space-y-2">
              {AVAILABLE_TRAILERS.map(trailer => (
                <button key={trailer.id} onClick={() => { setSelectedTrailer(trailer); setIsTrailerModalOpen(false); }} className={`w-full flex items-center justify-between p-3 rounded-xl border text-left ${trailer.id === selectedTrailer.id ? 'bg-cyan-950 border-cyan-400' : 'bg-slate-900 border-slate-800'}`}>
                  <div>
                    <div className="text-sm font-bold text-white font-mono">{trailer.code} • {trailer.type}</div>
                    <div className="text-xs text-slate-400">{trailer.grossWeight}</div>
                  </div>
                  <div className="text-right font-mono text-cyan-300 font-bold">{trailer.heightMetric}</div>
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
