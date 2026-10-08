'use client';

import React, { useState } from 'react';
import {
  Clock,
  CreditCard,
  CheckCircle2,
  AlertTriangle,
  Play,
  Pause,
  Coffee,
  Hammer,
  Volume2,
  VolumeX,
  Sparkles
} from 'lucide-react';
import { audioFeedback } from '@/utils/audioFeedback';

export type TachoMode = 'DRIVE' | 'WORK' | 'POA' | 'REST';

interface TachoHeadUnitHUDProps {
  driverName?: string;
  driverCardNumber?: string;
  vehicleReg?: string;
  drivingMinutesRemaining?: number; // Minutes remaining in 4h30m block
  dailyDriveMinutesRemaining?: number;
  initialMode?: TachoMode;
}

export const TachoHeadUnitHUD: React.FC<TachoHeadUnitHUDProps> = ({
  driverName = 'KITE ALEXANDER JAMES',
  driverCardNumber = 'UK/DB250290781795 0 0',
  vehicleReg = 'DG21 EDP',
  drivingMinutesRemaining = 168, // 2h 48m
  dailyDriveMinutesRemaining = 282, // 4h 42m
  initialMode = 'DRIVE'
}) => {
  const [currentMode, setCurrentMode] = useState<TachoMode>(initialMode);
  const [isCardInserted, setIsCardInserted] = useState<boolean>(true);
  const [isMuted, setIsMuted] = useState<boolean>(false);

  const toggleMute = () => {
    const nextMuted = !isMuted;
    setIsMuted(nextMuted);
    audioFeedback.setMuted(nextMuted);
  };

  const handleModeChange = (mode: TachoMode) => {
    setCurrentMode(mode);
    audioFeedback.playCheckpointClick();
    if (mode === 'DRIVE' && drivingMinutesRemaining < 45) {
      audioFeedback.playWarningTone();
    }
  };

  const handleCardToggle = () => {
    const nextState = !isCardInserted;
    setIsCardInserted(nextState);
    if (nextState) {
      audioFeedback.playSuccessChime();
    } else {
      audioFeedback.playCheckpointClick();
    }
  };

  const formatHoursMins = (totalMinutes: number) => {
    const hrs = Math.floor(totalMinutes / 60);
    const mins = totalMinutes % 60;
    return `${hrs.toString().padStart(2, '0')}h ${mins.toString().padStart(2, '0')}m`;
  };

  // Warning state if under 45m remaining
  const isBreakDueSoon = drivingMinutesRemaining <= 45;
  const isBreakCritical = drivingMinutesRemaining <= 15;

  return (
    <div className="cockpit-panel rounded-3xl p-4 sm:p-6 space-y-4 border border-white/10 shadow-cockpit-lg select-none">
      {/* Head-Unit Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-800 pb-3">
        <div className="flex items-center gap-2.5">
          <span className="w-2.5 h-2.5 rounded-full bg-cyan-400 animate-ping" />
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-mono font-bold text-cyan-400 tracking-wider">
                STONERIDGE SE5000 GEN-2 DIGITAL TACHO
              </span>
              <span className="px-1.5 py-0.2 rounded text-[9px] font-mono bg-indigo-500/20 text-indigo-300 border border-indigo-500/40">
                1-DIN CAB UNIT
              </span>
            </div>
            <h3 className="text-sm font-bold text-white">EU 561/2006 Continuous Driving Horizon</h3>
          </div>
        </div>

        {/* Mute and Card Status */}
        <div className="flex items-center gap-2">
          <button
            onClick={toggleMute}
            className="p-1.5 rounded-lg bg-slate-900 border border-slate-800 text-slate-400 hover:text-white transition touch-press"
            title={isMuted ? 'Unmute Audio Chimes' : 'Mute Audio Chimes'}
          >
            {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4 text-cyan-400" />}
          </button>

          <button
            onClick={handleCardToggle}
            className={`px-3 py-1 rounded-xl text-xs font-mono font-bold flex items-center gap-1.5 transition touch-press ${
              isCardInserted
                ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40'
                : 'bg-amber-500/20 text-amber-400 border border-amber-500/40'
            }`}
          >
            <CreditCard className="w-3.5 h-3.5" />
            <span>{isCardInserted ? 'Card 1 Locked' : 'Eject / Insert'}</span>
          </button>
        </div>
      </div>

      {/* 1-DIN Metallic Head-Unit Chassis */}
      <div className="rounded-2xl bg-gradient-to-b from-slate-900 via-slate-950 to-black p-3 sm:p-5 border-2 border-slate-800 shadow-2xl relative">
        {/* Corner Mounting Screws */}
        <span className="absolute top-2 left-2 text-[9px] text-slate-600 font-mono">⊕</span>
        <span className="absolute top-2 right-2 text-[9px] text-slate-600 font-mono">⊕</span>
        <span className="absolute bottom-2 left-2 text-[9px] text-slate-600 font-mono">⊕</span>
        <span className="absolute bottom-2 right-2 text-[9px] text-slate-600 font-mono">⊕</span>

        {/* Dot-Matrix LCD Display Screen */}
        <div className="rounded-xl bg-[#03150d] border-2 border-emerald-950/80 p-3 sm:p-4 text-emerald-400 font-mono shadow-inner relative overflow-hidden space-y-2">
          {/* LCD Scanline Overlay */}
          <div className="absolute inset-0 bg-[linear-gradient(rgba(16,185,129,0.04)_1px,transparent_1px)] bg-[size:100%_3px] pointer-events-none" />

          {/* Top Line: Mode & Reg */}
          <div className="flex items-center justify-between text-xs tracking-wider border-b border-emerald-900/40 pb-1.5">
            <div className="flex items-center gap-2">
              <span className="animate-pulse">●</span>
              <span className="font-bold">1 {currentMode}</span>
              <span className="text-emerald-600">|</span>
              <span className="text-emerald-300 font-bold">{vehicleReg}</span>
            </div>
            <div className="text-[11px] text-emerald-500">
              {new Date().toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' })} UTC
            </div>
          </div>

          {/* Main LCD Area: Big Time Counters */}
          <div className="grid grid-cols-2 gap-3 py-1">
            <div className="space-y-0.5">
              <div className="text-[10px] text-emerald-600 uppercase font-bold">
                Continuous Drive Remaining
              </div>
              <div
                className={`text-xl sm:text-2xl font-black tabular-nums tracking-wider ${
                  isBreakCritical
                    ? 'text-red-400 animate-pulse'
                    : isBreakDueSoon
                    ? 'text-amber-400'
                    : 'text-emerald-300'
                }`}
              >
                {formatHoursMins(drivingMinutesRemaining)}
              </div>
              <div className="text-[10px] text-emerald-600">Max 04h 30m block</div>
            </div>

            <div className="space-y-0.5 text-right">
              <div className="text-[10px] text-emerald-600 uppercase font-bold">
                Daily Drive Budget
              </div>
              <div className="text-xl sm:text-2xl font-black text-emerald-300 tabular-nums tracking-wider">
                {formatHoursMins(dailyDriveMinutesRemaining)}
              </div>
              <div className="text-[10px] text-emerald-600">09h 00m Standard</div>
            </div>
          </div>

          {/* Bottom LCD Ticker: Driver Profile & Card Status */}
          <div className="text-[11px] text-emerald-400/90 pt-1 border-t border-emerald-900/40 flex items-center justify-between">
            <span className="truncate max-w-[200px]">{driverName}</span>
            <span className="text-emerald-600 text-[10px]">{driverCardNumber}</span>
          </div>
        </div>

        {/* Physical Tacho Controls & Mode Selector */}
        <div className="mt-4 grid grid-cols-4 gap-2">
          <button
            onClick={() => handleModeChange('DRIVE')}
            className={`py-2 px-1 rounded-xl text-xs font-mono font-bold flex flex-col items-center justify-center gap-1 transition touch-press ${
              currentMode === 'DRIVE'
                ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-600/30'
                : 'bg-slate-900 hover:bg-slate-800 text-slate-300 border border-slate-700'
            }`}
          >
            <Play className="w-3.5 h-3.5" />
            <span>DRIVE</span>
          </button>

          <button
            onClick={() => handleModeChange('WORK')}
            className={`py-2 px-1 rounded-xl text-xs font-mono font-bold flex flex-col items-center justify-center gap-1 transition touch-press ${
              currentMode === 'WORK'
                ? 'bg-amber-600 text-white shadow-lg shadow-amber-600/30'
                : 'bg-slate-900 hover:bg-slate-800 text-slate-300 border border-slate-700'
            }`}
          >
            <Hammer className="w-3.5 h-3.5" />
            <span>WORK</span>
          </button>

          <button
            onClick={() => handleModeChange('POA')}
            className={`py-2 px-1 rounded-xl text-xs font-mono font-bold flex flex-col items-center justify-center gap-1 transition touch-press ${
              currentMode === 'POA'
                ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/30'
                : 'bg-slate-900 hover:bg-slate-800 text-slate-300 border border-slate-700'
            }`}
          >
            <Pause className="w-3.5 h-3.5" />
            <span>POA</span>
          </button>

          <button
            onClick={() => handleModeChange('REST')}
            className={`py-2 px-1 rounded-xl text-xs font-mono font-bold flex flex-col items-center justify-center gap-1 transition touch-press ${
              currentMode === 'REST'
                ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/30'
                : 'bg-slate-900 hover:bg-slate-800 text-slate-300 border border-slate-700'
            }`}
          >
            <Coffee className="w-3.5 h-3.5" />
            <span>REST</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default TachoHeadUnitHUD;
