'use client';

import React, { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import {
  ArrowLeft,
  Clock,
  Sparkles,
  ScanLine,
  CreditCard,
  Shield,
  ShieldCheck,
  AlertTriangle,
  Upload,
  Camera,
  FileText,
  Volume2,
  VolumeX,
  CheckCircle2,
  ChevronRight,
  BarChart3,
  RotateCcw,
  Info,
  X,
  FileCheck2,
  Truck,
  Award
} from 'lucide-react';
import { audioFeedback } from '@/utils/audioFeedback';
import { TachoVisualReportsHub } from '@/components/tacho/TachoVisualReportsHub';
import { PRESET_ARTICLE_12_TEMPLATES } from '@/services/tachoDebriefService';

type TachoTab = 'DASHBOARD' | 'SCAN' | 'CARD_READER';
type ShiftType = 'END_OF_SHIFT' | 'MID_SHIFT';

interface ActivitySegment {
  timeStart: string;
  timeEnd: string;
  durationMinutes: number;
  activityType: 'DRIVE' | 'WORK' | 'POA' | 'REST';
}

interface MockTachoDay {
  dateKey: string;
  displayDate: string;
  shiftType: ShiftType;
  vehicleReg: string;
  odoStartKm: number;
  odoEndKm: number;
  distanceKm: number;
  distanceMiles: number;
  dailyDriveMinutes: number;
  continuousDriveMinutes: number;
  dailyRestMinutes: number;
  otherWorkMinutes: number;
  poaMinutes: number;
  wtdCompliant: boolean;
  activities: ActivitySegment[];
}

const DEFAULT_SHIFT_DAY: MockTachoDay = {
  dateKey: '2026-09-17',
  displayDate: 'Thursday, 17 Sep 2026',
  shiftType: 'END_OF_SHIFT',
  vehicleReg: 'GN21 EVX',
  odoStartKm: 708638,
  odoEndKm: 708940,
  distanceKm: 302,
  distanceMiles: 188,
  dailyDriveMinutes: 296, // 4h 56m
  continuousDriveMinutes: 195, // 3h 15m
  dailyRestMinutes: 1090, // 18h 10m
  otherWorkMinutes: 54, // 0h 54m
  poaMinutes: 0,
  wtdCompliant: true,
  activities: [
    { timeStart: '00:00', timeEnd: '06:30', durationMinutes: 390, activityType: 'REST' },
    { timeStart: '06:30', timeEnd: '06:45', durationMinutes: 15, activityType: 'WORK' },
    { timeStart: '06:45', timeEnd: '09:15', durationMinutes: 150, activityType: 'DRIVE' },
    { timeStart: '09:15', timeEnd: '10:00', durationMinutes: 45, activityType: 'REST' },
    { timeStart: '10:00', timeEnd: '12:26', durationMinutes: 146, activityType: 'DRIVE' },
    { timeStart: '12:26', timeEnd: '13:05', durationMinutes: 39, activityType: 'WORK' },
    { timeStart: '13:05', timeEnd: '23:59', durationMinutes: 654, activityType: 'REST' }
  ]
};

export default function DriverTachoPage() {
  const [activeTab, setActiveTab] = useState<TachoTab>('DASHBOARD');
  const [currentDay, setCurrentDay] = useState<MockTachoDay>(DEFAULT_SHIFT_DAY);
  const [shiftType, setShiftType] = useState<ShiftType>('END_OF_SHIFT');
  
  // Modals
  const [isRoadsideShieldOpen, setIsRoadsideShieldOpen] = useState(false);
  const [isArticle12ModalOpen, setIsArticle12ModalOpen] = useState(false);
  const [isVisualReportsOpen, setIsVisualReportsOpen] = useState(false);
  const [isMacroDisputeOpen, setIsMacroDisputeOpen] = useState(false);
  
  // Voice AI Debrief
  const [isSpeaking, setIsSpeaking] = useState(false);

  // Scan state
  const [isScanning, setIsScanning] = useState(false);
  const [scanSuccessMessage, setScanSuccessMessage] = useState<string | null>(null);
  const [selectedDisputeField, setSelectedDisputeField] = useState<string>('DRIVE_TIME');
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const dddFileInputRef = useRef<HTMLInputElement | null>(null);
  const macroInputRef = useRef<HTMLInputElement | null>(null);

  // Speech synthesis for AI Debrief
  const handleToggleVoice = () => {
    if (typeof window === 'undefined' || !window.speechSynthesis) return;

    if (isSpeaking) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
      return;
    }

    const script = `Driver debrief for Alexander James Kite. Shift completed on vehicle GN21 EVX. Total driving time: four hours, fifty-six minutes. Total distance: 188 miles. Continuous driving counter reset after mandatory forty-five minute break. Zero infringements recorded under E U Regulation 561. Earliest legal start time for your next shift is tomorrow at 04:26. 100 percent compliant.`;

    const utterance = new SpeechSynthesisUtterance(script);
    utterance.rate = 1.0;
    utterance.pitch = 1.0;

    const voices = window.speechSynthesis.getVoices();
    const britishVoice = voices.find((v) => v.lang === 'en-GB') || voices.find((v) => v.lang.startsWith('en'));
    if (britishVoice) utterance.voice = britishVoice;

    utterance.onstart = () => setIsSpeaking(true);
    utterance.onend = () => setIsSpeaking(false);
    utterance.onerror = () => setIsSpeaking(false);

    window.speechSynthesis.speak(utterance);
    audioFeedback.playCheckpointClick();
  };

  const handleTabChange = (tab: TachoTab) => {
    setActiveTab(tab);
    audioFeedback.playCheckpointClick();
  };

  const handleSimulateScan = (presetName: string) => {
    setIsScanning(true);
    setScanSuccessMessage(null);
    audioFeedback.playCheckpointClick();

    setTimeout(() => {
      setIsScanning(false);
      audioFeedback.playSuccessChime();
      setScanSuccessMessage(`Scanned ${presetName} successfully! Uploaded as ${shiftType === 'END_OF_SHIFT' ? 'Authoritative End-of-Shift' : 'Interim Mid-Shift'} record.`);
      setActiveTab('DASHBOARD');
    }, 1200);
  };

  // 3 Golden Numbers calculations
  const remainingDailyDriveMins = Math.max(0, 540 - currentDay.dailyDriveMinutes); // 9h limit = 540 mins
  const remainingContinuousMins = Math.max(0, 270 - currentDay.continuousDriveMinutes); // 4h30m = 270 mins

  const formatHoursMins = (totalMinutes: number) => {
    const h = Math.floor(totalMinutes / 60);
    const m = totalMinutes % 60;
    return `${h}h ${m.toString().padStart(2, '0')}m`;
  };

  return (
    <div className="min-h-dvh bg-slate-950 text-white flex flex-col font-sans bg-cockpit-grid">
      {/* Top Header Bar */}
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
                <span>Tachograph &amp; Hours</span>
              </h1>
              <div className="hidden sm:flex items-center gap-1 px-2 py-0.5 rounded-full bg-emerald-950/80 border border-emerald-800/60 text-[10px] font-mono font-bold text-emerald-300">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                EU 561/2006
              </div>
            </div>
            <p className="text-[10px] text-slate-400 font-mono">Tachogram Clean Compliance Standard</p>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="bg-slate-950/90 p-1 rounded-2xl border border-slate-800/80 flex items-center shadow-inner gap-1">
          <button
            onClick={() => handleTabChange('DASHBOARD')}
            className={`px-3 py-1.5 rounded-xl text-xs font-mono font-bold flex items-center gap-1.5 transition touch-press ${
              activeTab === 'DASHBOARD'
                ? 'bg-amber-500 text-slate-950 shadow-md shadow-amber-500/20'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Clock className="w-3.5 h-3.5" />
            <span className="hidden xs:inline">Dashboard</span>
          </button>
          <button
            onClick={() => handleTabChange('SCAN')}
            className={`px-3 py-1.5 rounded-xl text-xs font-mono font-bold flex items-center gap-1.5 transition touch-press ${
              activeTab === 'SCAN'
                ? 'bg-amber-500 text-slate-950 shadow-md shadow-amber-500/20'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <ScanLine className="w-3.5 h-3.5" />
            <span className="hidden xs:inline">Scan Roll</span>
          </button>
          <button
            onClick={() => handleTabChange('CARD_READER')}
            className={`px-3 py-1.5 rounded-xl text-xs font-mono font-bold flex items-center gap-1.5 transition touch-press ${
              activeTab === 'CARD_READER'
                ? 'bg-amber-500 text-slate-950 shadow-md shadow-amber-500/20'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <CreditCard className="w-3.5 h-3.5" />
            <span className="hidden xs:inline">Card / .DDD</span>
          </button>
        </div>
      </header>

      {/* Main Container */}
      <main className="flex-1 w-full max-w-2xl mx-auto p-3 sm:p-5 space-y-4 overflow-y-auto">
        {scanSuccessMessage && (
          <div className="p-3 bg-emerald-950/80 border border-emerald-600/60 rounded-xl text-xs text-emerald-300 flex items-center justify-between gap-2 shadow-sm animate-in fade-in">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" />
              <span>{scanSuccessMessage}</span>
            </div>
            <button
              onClick={() => setScanSuccessMessage(null)}
              className="text-emerald-400 hover:text-white p-1"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        )}

        {/* ------------------------------------------------------------------ */}
        {/* TAB 1: SHIFT DASHBOARD (Tachogram Clean Layout) */}
        {/* ------------------------------------------------------------------ */}
        {activeTab === 'DASHBOARD' && (
          <div className="space-y-4 animate-in fade-in duration-150">
            {/* Driver & Card Overview Plaque */}
            <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-3.5 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-amber-500/20 border border-amber-500/30 text-amber-400 flex items-center justify-center font-bold text-sm">
                  AK
                </div>
                <div>
                  <div className="text-sm font-bold text-white flex items-center gap-2">
                    Alexander James Kite
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-slate-800 text-slate-300 border border-slate-700">
                      Class 1 C+E
                    </span>
                  </div>
                  <div className="text-xs text-slate-400 font-mono">
                    UK/DB250290781795 0 0 • Unit: {currentDay.vehicleReg}
                  </div>
                </div>
              </div>
              <span className="text-[10px] font-mono font-bold text-emerald-400 bg-emerald-500/10 px-2.5 py-1 rounded-full border border-emerald-500/30">
                Card Valid
              </span>
            </div>

            {/* Shift Compliance Status Banner */}
            <div className="bg-emerald-950/50 border border-emerald-700/60 rounded-2xl p-3 flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <ShieldCheck className="w-5 h-5 text-emerald-400 flex-shrink-0" />
                <div>
                  <div className="text-xs font-bold text-emerald-300">
                    100% Legal • 0 Infringements Detected
                  </div>
                  <div className="text-[11px] text-slate-400">
                    Shift {currentDay.shiftType === 'END_OF_SHIFT' ? 'Closed & Verified' : 'In-Progress (Mid-Shift)'} • {currentDay.displayDate}
                  </div>
                </div>
              </div>
              <button
                onClick={() => {
                  audioFeedback.playCheckpointClick();
                  setIsRoadsideShieldOpen(true);
                }}
                className="px-3 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-slate-950 text-xs font-mono font-bold flex items-center gap-1 shadow-sm transition active:scale-95"
              >
                <Shield className="w-3.5 h-3.5" />
                <span>Roadside Shield</span>
              </button>
            </div>

            {/* THE 3 GOLDEN NUMBERS (Tachogram Shift Compliance Cards) */}
            <div className="grid grid-cols-3 gap-2.5">
              <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-3 text-center shadow-cockpit">
                <div className="text-[10px] font-mono font-bold text-slate-400 uppercase tracking-wider mb-1">
                  Drive Left Today
                </div>
                <div className="text-xl sm:text-2xl font-black font-mono text-cyan-400">
                  {formatHoursMins(remainingDailyDriveMins)}
                </div>
                <div className="text-[10px] font-mono text-slate-500 mt-0.5">
                  Limit: 9h 00m
                </div>
              </div>

              <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-3 text-center shadow-cockpit">
                <div className="text-[10px] font-mono font-bold text-slate-400 uppercase tracking-wider mb-1">
                  Continuous Left
                </div>
                <div className="text-xl sm:text-2xl font-black font-mono text-amber-400">
                  {formatHoursMins(remainingContinuousMins)}
                </div>
                <div className="text-[10px] font-mono text-slate-500 mt-0.5">
                  Break in 4h 30m
                </div>
              </div>

              <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-3 text-center shadow-cockpit">
                <div className="text-[10px] font-mono font-bold text-slate-400 uppercase tracking-wider mb-1">
                  Next Legal Start
                </div>
                <div className="text-xl sm:text-2xl font-black font-mono text-emerald-400">
                  04:26
                </div>
                <div className="text-[10px] font-mono text-slate-500 mt-0.5">
                  After 11h Rest
                </div>
              </div>
            </div>

            {/* 24-HOUR TACHOGRAM GRAPHICAL ACTIVITY RIBBON */}
            <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-4 space-y-3">
              <div className="flex items-center justify-between text-xs">
                <span className="font-bold text-white flex items-center gap-1.5 font-mono">
                  <BarChart3 className="w-4 h-4 text-amber-400" />
                  24-Hour Graphical Ribbon
                </span>
                <span className="text-[11px] font-mono text-slate-400">
                  Total Shift: 05h 50m
                </span>
              </div>

              {/* Graphical Activity Bar */}
              <div className="w-full h-8 rounded-xl bg-slate-950 border border-slate-800 p-0.5 flex overflow-hidden">
                {currentDay.activities.map((act, idx) => {
                  const percent = (act.durationMinutes / 1440) * 100;
                  const bgClass =
                    act.activityType === 'DRIVE'
                      ? 'bg-cyan-500'
                      : act.activityType === 'WORK'
                      ? 'bg-amber-500'
                      : act.activityType === 'POA'
                      ? 'bg-slate-500'
                      : 'bg-emerald-600/80';
                  return (
                    <div
                      key={idx}
                      style={{ width: `${percent}%` }}
                      className={`${bgClass} h-full transition-all relative group cursor-pointer`}
                      title={`${act.activityType}: ${act.timeStart} - ${act.timeEnd} (${formatHoursMins(act.durationMinutes)})`}
                    />
                  );
                })}
              </div>

              {/* Color Legend & Totals */}
              <div className="grid grid-cols-4 gap-2 pt-1 text-center font-mono text-[11px]">
                <div className="bg-slate-950/60 p-2 rounded-xl border border-slate-800">
                  <div className="flex items-center justify-center gap-1 text-cyan-400 font-bold">
                    <span className="w-2 h-2 rounded-full bg-cyan-400" />
                    <span>Drive</span>
                  </div>
                  <div className="text-white font-bold text-xs mt-0.5">
                    {formatHoursMins(currentDay.dailyDriveMinutes)}
                  </div>
                  <div className="text-[9px] text-slate-500">{currentDay.distanceMiles} mi</div>
                </div>

                <div className="bg-slate-950/60 p-2 rounded-xl border border-slate-800">
                  <div className="flex items-center justify-center gap-1 text-amber-400 font-bold">
                    <span className="w-2 h-2 rounded-full bg-amber-400" />
                    <span>Work</span>
                  </div>
                  <div className="text-white font-bold text-xs mt-0.5">
                    {formatHoursMins(currentDay.otherWorkMinutes)}
                  </div>
                  <div className="text-[9px] text-slate-500">Coupling &amp; Checks</div>
                </div>

                <div className="bg-slate-950/60 p-2 rounded-xl border border-slate-800">
                  <div className="flex items-center justify-center gap-1 text-slate-400 font-bold">
                    <span className="w-2 h-2 rounded-full bg-slate-400" />
                    <span>POA</span>
                  </div>
                  <div className="text-white font-bold text-xs mt-0.5">
                    {formatHoursMins(currentDay.poaMinutes)}
                  </div>
                  <div className="text-[9px] text-slate-500">Wait Time</div>
                </div>

                <div className="bg-slate-950/60 p-2 rounded-xl border border-slate-800">
                  <div className="flex items-center justify-center gap-1 text-emerald-400 font-bold">
                    <span className="w-2 h-2 rounded-full bg-emerald-400" />
                    <span>Rest</span>
                  </div>
                  <div className="text-white font-bold text-xs mt-0.5">
                    {formatHoursMins(currentDay.dailyRestMinutes)}
                  </div>
                  <div className="text-[9px] text-slate-500">Legal Daily</div>
                </div>
              </div>
            </div>

            {/* AI SHIFT DEBRIEF & VOICE AUDIO */}
            <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-4 space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-amber-400" />
                  <span className="text-xs font-bold text-white font-mono">
                    AI Shift Debrief (Natural Voice)
                  </span>
                </div>
                <button
                  onClick={handleToggleVoice}
                  className={`px-3 py-1 rounded-xl text-xs font-mono font-bold flex items-center gap-1.5 transition active:scale-95 ${
                    isSpeaking
                      ? 'bg-rose-500 text-white animate-pulse'
                      : 'bg-slate-800 hover:bg-slate-700 text-slate-300'
                  }`}
                >
                  {isSpeaking ? (
                    <>
                      <VolumeX className="w-3.5 h-3.5" />
                      <span>Stop Voice</span>
                    </>
                  ) : (
                    <>
                      <Volume2 className="w-3.5 h-3.5 text-amber-400" />
                      <span>Listen to Debrief</span>
                    </>
                  )}
                </button>
              </div>

              <div className="bg-slate-950/70 p-3 rounded-xl border border-slate-800 text-xs text-slate-300 leading-relaxed space-y-2">
                <p>
                  <strong className="text-white">Summary:</strong> All driving and working blocks were conducted 100% within statutory limits. Your mandatory 45-minute split break was taken on schedule at 09:15, resetting your continuous driving countdown.
                </p>
                <p className="text-[11px] text-slate-400 font-mono">
                  Earliest statutory start time tomorrow is <span className="text-emerald-400 font-bold">04:26 UTC</span> after completing the required 11-hour continuous regular rest period.
                </p>
              </div>

              {/* Quick Actions Row */}
              <div className="grid grid-cols-2 gap-2 pt-1">
                <button
                  onClick={() => {
                    audioFeedback.playCheckpointClick();
                    setIsArticle12ModalOpen(true);
                  }}
                  className="p-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700 text-xs font-mono font-semibold text-slate-200 flex items-center justify-center gap-1.5 transition active:scale-95"
                >
                  <FileText className="w-3.5 h-3.5 text-amber-400" />
                  <span>Article 12 Statement</span>
                </button>

                <button
                  onClick={() => {
                    audioFeedback.playCheckpointClick();
                    setIsVisualReportsOpen(true);
                  }}
                  className="p-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700 text-xs font-mono font-semibold text-slate-200 flex items-center justify-center gap-1.5 transition active:scale-95"
                >
                  <BarChart3 className="w-3.5 h-3.5 text-cyan-400" />
                  <span>Full Visual Dossier</span>
                </button>
              </div>
            </div>

            {/* Quick Action Navigation Buttons */}
            <div className="grid grid-cols-2 gap-3 pt-2">
              <button
                onClick={() => handleTabChange('SCAN')}
                className="p-4 rounded-2xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-sm flex flex-col items-center justify-center gap-1 shadow-lg shadow-amber-500/10 active:scale-95 transition"
              >
                <ScanLine className="w-5 h-5" />
                <span>Scan Printout Roll</span>
                <span className="text-[10px] font-normal text-slate-900/80 font-mono">End-of-Shift or Mid-Shift</span>
              </button>

              <button
                onClick={() => handleTabChange('CARD_READER')}
                className="p-4 rounded-2xl bg-slate-800 hover:bg-slate-700 border border-slate-700 text-white font-bold text-sm flex flex-col items-center justify-center gap-1 active:scale-95 transition"
              >
                <CreditCard className="w-5 h-5 text-amber-400" />
                <span>Card Reader / .DDD</span>
                <span className="text-[10px] font-normal text-slate-400 font-mono">USB or File Ingest</span>
              </button>
            </div>
          </div>
        )}

        {/* ------------------------------------------------------------------ */}
        {/* TAB 2: SCAN THERMAL PRINTOUT (End-of-Shift / Mid-Shift OCR) */}
        {/* ------------------------------------------------------------------ */}
        {activeTab === 'SCAN' && (
          <div className="space-y-4 animate-in fade-in duration-150">
            {/* Shift Ingest Rule Callout */}
            <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-3.5 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-white font-mono flex items-center gap-1.5">
                  <Info className="w-4 h-4 text-amber-400" />
                  Shift Ingest Mode
                </span>
                <span className="text-[10px] font-mono text-slate-400">
                  {shiftType === 'END_OF_SHIFT' ? 'Authoritative Record' : 'Interim Record'}
                </span>
              </div>

              {/* Mode Toggle */}
              <div className="grid grid-cols-2 gap-2 bg-slate-950 p-1 rounded-xl border border-slate-800">
                <button
                  onClick={() => {
                    setShiftType('END_OF_SHIFT');
                    audioFeedback.playCheckpointClick();
                  }}
                  className={`py-2 rounded-lg text-xs font-mono font-bold transition ${
                    shiftType === 'END_OF_SHIFT'
                      ? 'bg-emerald-500 text-slate-950 shadow-sm'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  End of Shift
                </button>
                <button
                  onClick={() => {
                    setShiftType('MID_SHIFT');
                    audioFeedback.playCheckpointClick();
                  }}
                  className={`py-2 rounded-lg text-xs font-mono font-bold transition ${
                    shiftType === 'MID_SHIFT'
                      ? 'bg-amber-500 text-slate-950 shadow-sm'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  Mid-Shift
                </button>
              </div>

              <p className="text-[11px] text-slate-400 leading-relaxed">
                Tacho scanning ingests end-of-shift data. If uploaded mid-shift, your subsequent end-of-shift upload will become the authoritative record. Manual inputs are overridden by optical scans.
              </p>
            </div>

            {/* Scan / Upload Action Box */}
            <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-6 text-center space-y-4">
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                capture="environment"
                className="hidden"
                onChange={() => handleSimulateScan('Thermal Roll Photo')}
              />

              <div className="w-16 h-16 rounded-full bg-amber-500/10 border-2 border-dashed border-amber-500/40 flex items-center justify-center mx-auto text-amber-400">
                <Camera className="w-8 h-8" />
              </div>

              <div className="space-y-1">
                <div className="text-sm font-bold text-white">
                  Photograph Thermal Printout
                </div>
                <div className="text-xs text-slate-400 max-w-sm mx-auto">
                  Hold camera 15cm from roll in good light. Stoneridge SE5000 &amp; VDO DTCO models detected automatically.
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-2.5 justify-center max-w-xs mx-auto">
                <button
                  onClick={() => fileInputRef.current?.click()}
                  disabled={isScanning}
                  className="px-5 py-3 rounded-xl bg-amber-500 hover:bg-amber-400 active:scale-95 text-slate-950 font-bold text-xs font-mono flex items-center justify-center gap-2 shadow-md transition"
                >
                  <Camera className="w-4 h-4" />
                  <span>Open Camera</span>
                </button>
                <button
                  onClick={() => fileInputRef.current?.click()}
                  disabled={isScanning}
                  className="px-5 py-3 rounded-xl bg-slate-800 hover:bg-slate-700 active:scale-95 text-slate-200 font-bold text-xs font-mono flex items-center justify-center gap-2 border border-slate-700 transition"
                >
                  <Upload className="w-4 h-4" />
                  <span>Upload File</span>
                </button>
              </div>
            </div>

            {/* Quick Demo Presets */}
            <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-4 space-y-2.5">
              <div className="text-xs font-bold text-slate-300 font-mono">
                Instant Demo Printouts (Trained OCR Sets)
              </div>
              <div className="space-y-2">
                <button
                  onClick={() => handleSimulateScan('Stoneridge SE5000 Daily Roll (17 Sep)')}
                  disabled={isScanning}
                  className="w-full p-3 rounded-xl bg-slate-950/80 hover:bg-slate-800 border border-slate-800 text-left flex items-center justify-between text-xs transition"
                >
                  <div>
                    <div className="font-bold text-white">Stoneridge SE5000 Gen 2 Daily Roll</div>
                    <div className="text-[11px] text-slate-400 font-mono">GN21 EVX • 302 km • 04h56 Drive • 100% Legal</div>
                  </div>
                  <ChevronRight className="w-4 h-4 text-slate-500" />
                </button>

                <button
                  onClick={() => handleSimulateScan('VDO DTCO 4.1 Daily Roll (15 Sep)')}
                  disabled={isScanning}
                  className="w-full p-3 rounded-xl bg-slate-950/80 hover:bg-slate-800 border border-slate-800 text-left flex items-center justify-between text-xs transition"
                >
                  <div>
                    <div className="font-bold text-white">VDO DTCO 4.1 Daily Roll</div>
                    <div className="text-[11px] text-slate-400 font-mono">GN21 EVX • 324 km • 05h44 Drive • 100% Legal</div>
                  </div>
                  <ChevronRight className="w-4 h-4 text-slate-500" />
                </button>
              </div>
            </div>

            {/* Macro Scan Dispute Tool */}
            <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-4 flex items-center justify-between">
              <div>
                <div className="text-xs font-bold text-white">Dispute OCR Reading?</div>
                <div className="text-[11px] text-slate-400">
                  Take a close-up macro photo to verify any line misread by OCR.
                </div>
              </div>
              <button
                onClick={() => {
                  audioFeedback.playCheckpointClick();
                  setIsMacroDisputeOpen(true);
                }}
                className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-mono font-bold text-amber-400 border border-slate-700 transition active:scale-95"
              >
                Macro Dispute
              </button>
            </div>
          </div>
        )}

        {/* ------------------------------------------------------------------ */}
        {/* TAB 3: CARD READER & .DDD FILE INGEST */}
        {/* ------------------------------------------------------------------ */}
        {activeTab === 'CARD_READER' && (
          <div className="space-y-4 animate-in fade-in duration-150">
            {/* Direct .DDD File Upload */}
            <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-6 text-center space-y-4">
              <input
                ref={dddFileInputRef}
                type="file"
                accept=".ddd,.esm,.tgd,.v1b,.bin"
                className="hidden"
                onChange={() => handleSimulateScan('Digital Tachograph .DDD File')}
              />

              <div className="w-16 h-16 rounded-full bg-cyan-500/10 border-2 border-dashed border-cyan-500/40 flex items-center justify-center mx-auto text-cyan-400">
                <FileCheck2 className="w-8 h-8" />
              </div>

              <div className="space-y-1">
                <div className="text-sm font-bold text-white">
                  Upload .DDD / .ESM Driver Card File
                </div>
                <div className="text-xs text-slate-400 max-w-sm mx-auto">
                  Annex 1C Smart Tachograph Gen 2 &amp; Annex 1B Gen 1 digital file support.
                </div>
              </div>

              <button
                onClick={() => dddFileInputRef.current?.click()}
                disabled={isScanning}
                className="px-6 py-3 rounded-xl bg-cyan-600 hover:bg-cyan-500 active:scale-95 text-white font-bold text-xs font-mono inline-flex items-center gap-2 shadow-md transition mx-auto"
              >
                <Upload className="w-4 h-4" />
                <span>Select .DDD File</span>
              </button>
            </div>

            {/* Hardware Smart Card Reader Status */}
            <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-4 space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <CreditCard className="w-4 h-4 text-emerald-400" />
                  <span className="text-xs font-bold text-white font-mono">
                    Hardware Card Reader
                  </span>
                </div>
                <span className="text-[10px] font-mono text-emerald-400 bg-emerald-500/10 border border-emerald-500/30 px-2 py-0.5 rounded-full font-bold">
                  Reader Connected
                </span>
              </div>

              <div className="bg-slate-950/70 p-3 rounded-xl border border-slate-800 flex items-center justify-between text-xs">
                <div>
                  <div className="font-bold text-slate-200">USB / Bluetooth Reader: Digidown Plus</div>
                  <div className="text-[11px] text-slate-400 font-mono">Ready for card insertion • 28-day statutory dump</div>
                </div>
                <button
                  onClick={() => handleSimulateScan('Smart Card Reader Direct Read')}
                  className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700 text-xs font-mono font-bold text-white transition active:scale-95"
                >
                  Read Card
                </button>
              </div>
            </div>
          </div>
        )}
      </main>

      {/* ------------------------------------------------------------------ */}
      {/* MODAL 1: DVSA ROADSIDE INSPECTION SHIELD */}
      {/* ------------------------------------------------------------------ */}
      {isRoadsideShieldOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/90 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl max-w-md w-full p-5 space-y-4 shadow-2xl animate-in zoom-in-95">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-5 h-5 text-emerald-400" />
                <h3 className="text-sm font-bold text-white font-mono">
                  DVSA Roadside Inspection Dossier
                </h3>
              </div>
              <button
                onClick={() => setIsRoadsideShieldOpen(false)}
                className="text-slate-400 hover:text-white p-1 rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="bg-emerald-950/60 border border-emerald-600/60 rounded-2xl p-4 text-center space-y-1">
              <div className="text-xs font-mono font-bold text-emerald-400 uppercase tracking-wider">
                Compliance Status
              </div>
              <div className="text-2xl font-black text-emerald-300">
                100% ROAD LEGAL
              </div>
              <div className="text-xs text-slate-300">
                0 Infringements in Current 28-Day Accounting Cycle
              </div>
            </div>

            <div className="bg-slate-950 p-3.5 rounded-2xl border border-slate-800 space-y-2 text-xs font-mono">
              <div className="flex justify-between text-slate-300">
                <span className="text-slate-500">Driver:</span>
                <span className="font-bold text-white">Alexander James Kite</span>
              </div>
              <div className="flex justify-between text-slate-300">
                <span className="text-slate-500">Card No:</span>
                <span>UK/DB250290781795 0 0</span>
              </div>
              <div className="flex justify-between text-slate-300">
                <span className="text-slate-500">Current Unit:</span>
                <span className="text-amber-400 font-bold">{currentDay.vehicleReg}</span>
              </div>
              <div className="flex justify-between text-slate-300">
                <span className="text-slate-500">Today Drive:</span>
                <span>{formatHoursMins(currentDay.dailyDriveMinutes)} (Limit: 9h/10h)</span>
              </div>
              <div className="flex justify-between text-slate-300">
                <span className="text-slate-500">Continuous Drive:</span>
                <span>{formatHoursMins(currentDay.continuousDriveMinutes)} (Legal &lt; 4h30m)</span>
              </div>
            </div>

            <button
              onClick={() => setIsRoadsideShieldOpen(false)}
              className="w-full py-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-slate-950 font-bold text-xs font-mono transition"
            >
              Done / Return to In-Cab Hub
            </button>
          </div>
        </div>
      )}

      {/* ------------------------------------------------------------------ */}
      {/* MODAL 2: ARTICLE 12 DEROGATION STATEMENT GENERATOR */}
      {/* ------------------------------------------------------------------ */}
      {isArticle12ModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/90 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl max-w-lg w-full p-5 space-y-4 shadow-2xl animate-in zoom-in-95 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center gap-2">
                <FileText className="w-5 h-5 text-amber-400" />
                <h3 className="text-sm font-bold text-white font-mono">
                  Article 12 Emergency Derogation
                </h3>
              </div>
              <button
                onClick={() => setIsArticle12ModalOpen(false)}
                className="text-slate-400 hover:text-white p-1 rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <p className="text-xs text-slate-400 leading-relaxed">
              Under Regulation (EC) 561/2006 Article 12, a driver may depart from the rules to reach a suitable stopping place to ensure road safety, vehicle safety, or load security. Select a verified unforeseen event to generate a DVSA-compliant note:
            </p>

            <div className="space-y-2">
              {PRESET_ARTICLE_12_TEMPLATES.map((tmpl) => (
                <div
                  key={tmpl.id}
                  className="p-3 bg-slate-950 rounded-xl border border-slate-800 space-y-1.5"
                >
                  <div className="flex items-center justify-between text-xs font-bold text-white">
                    <span>{tmpl.label}</span>
                    <span className="text-[10px] text-amber-400 font-mono">+{tmpl.defaultMinutesOver}m Extension</span>
                  </div>
                  <div className="text-[11px] text-slate-400 font-mono">{tmpl.location}</div>
                  <p className="text-[11px] text-slate-300 italic">{tmpl.narrative}</p>
                </div>
              ))}
            </div>

            <button
              onClick={() => {
                audioFeedback.playSuccessChime();
                setIsArticle12ModalOpen(false);
              }}
              className="w-full py-3 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs font-mono transition"
            >
              Sign &amp; Attach to Shift Record
            </button>
          </div>
        </div>
      )}

      {/* ------------------------------------------------------------------ */}
      {/* MODAL 3: MACRO DISPUTE SECTION */}
      {/* ------------------------------------------------------------------ */}
      {isMacroDisputeOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/90 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl max-w-md w-full p-5 space-y-4 shadow-2xl animate-in zoom-in-95">
            <input
              ref={macroInputRef}
              type="file"
              accept="image/*"
              capture="environment"
              className="hidden"
              onChange={() => {
                audioFeedback.playSuccessChime();
                setIsMacroDisputeOpen(false);
                setScanSuccessMessage('Macro scan received and verified against physical roll!');
              }}
            />

            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center gap-2">
                <ScanLine className="w-5 h-5 text-amber-400" />
                <h3 className="text-sm font-bold text-white font-mono">
                  Macro Scan OCR Dispute
                </h3>
              </div>
              <button
                onClick={() => setIsMacroDisputeOpen(false)}
                className="text-slate-400 hover:text-white p-1 rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <p className="text-xs text-slate-300 leading-relaxed">
              Manual inputs are ignored if they conflict with optical scans. To correct an OCR misread, take a close-up macro photo of the specific line on your thermal roll.
            </p>

            <div className="space-y-1">
              <label className="text-[11px] font-mono text-slate-400">Target Disputed Field</label>
              <select
                value={selectedDisputeField}
                onChange={(e) => setSelectedDisputeField(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white"
              >
                <option value="DRIVE_TIME">Daily Drive Time</option>
                <option value="ODOMETER_KM">Odometer KM</option>
                <option value="VEHICLE_REG">Vehicle Registration</option>
                <option value="DAILY_REST">Daily Rest Duration</option>
              </select>
            </div>

            <button
              onClick={() => macroInputRef.current?.click()}
              className="w-full py-3 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs font-mono flex items-center justify-center gap-2 transition"
            >
              <Camera className="w-4 h-4" />
              <span>Photograph Disputed Line</span>
            </button>
          </div>
        </div>
      )}

      {/* ------------------------------------------------------------------ */}
      {/* MODAL 4: FULL VISUAL REPORTS HUB */}
      {/* ------------------------------------------------------------------ */}
      <TachoVisualReportsHub
        isOpen={isVisualReportsOpen}
        onClose={() => setIsVisualReportsOpen(false)}
        importedDays={[
          {
            dateKey: currentDay.dateKey,
            displayDate: currentDay.displayDate,
            importedAt: new Date().toISOString(),
            source: 'CAMERA_SCAN',
            odometerStartKm: currentDay.odoStartKm,
            odometerEndKm: currentDay.odoEndKm,
            distanceDrivenKm: currentDay.distanceKm,
            distanceDrivenMiles: currentDay.distanceMiles,
            shiftType: currentDay.shiftType,
            result: {
              id: 'shift-1',
              timestamp: new Date().toISOString(),
              driverName: 'Alexander James Kite',
              driverCardNumber: 'UK/DB250290781795 0 0',
              vehicleReg: currentDay.vehicleReg,
              printoutDate: currentDay.dateKey,
              printoutType: 'Stoneridge SE5000 Gen 2',
              dailyDriveMinutes: currentDay.dailyDriveMinutes,
              continuousDriveMinutes: currentDay.continuousDriveMinutes,
              dailyRestMinutes: currentDay.dailyRestMinutes,
              weeklyDriveMinutes: 1845,
              wtdCompliant: currentDay.wtdCompliant,
              infringements: [],
              detailedInfringements: [],
              activities: currentDay.activities
            }
          }
        ]}
      />
    </div>
  );
}
