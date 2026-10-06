'use client';
import React, { useState, useEffect, useRef } from 'react';
import {
  X,
  ShieldAlert,
  ShieldCheck,
  Lock,
  Volume2,
  VolumeX,
  Phone,
  Truck,
  Gauge,
  AlertTriangle,
  Mic,
  Copy,
  Check,
  Radio,
  Sliders,
  Sparkles,
  Compass,
  Clock,
  Play,
  Pause,
  RotateCcw,
  Zap,
  Moon,
  Sun,
  Siren,
  BellRing,
  ArrowRight
} from 'lucide-react';
import {
  SiteRiskAssessment,
  DriverVehicleProfile,
  LowBridgeAlertTier,
  SplitBreakType
} from '../types';
import { tts } from '../services/ttsService';
import { askInCabVoiceCopilot } from '../services/voiceCopilotService';

interface InMotionDriverHudModalProps {
  isOpen: boolean;
  onClose: () => void;
  site: SiteRiskAssessment;
  vehicleProfile?: DriverVehicleProfile;
  driverVehicle?: DriverVehicleProfile;
  onOpenVoiceCopilot?: () => void;
  onOpenLaybyRadar?: () => void;
  onOpenCbRadio?: () => void;
  onOpenBulkheadSync?: () => void;
}

export const InMotionDriverHudModal: React.FC<InMotionDriverHudModalProps> = ({
  isOpen,
  onClose,
  site,
  vehicleProfile,
  driverVehicle,
  onOpenVoiceCopilot,
  onOpenLaybyRadar,
  onOpenCbRadio,
  onOpenBulkheadSync
}) => {
  const activeVehicle = vehicleProfile || driverVehicle || {
    driverName: 'Driver',
    vehicleReg: 'KX72 WYZ',
    vehicleCategory: '44T_ARTIC_HGV',
    heightMeters: 4.45,
    weightTonnes: 44.0,
    lengthMeters: 16.5,
    widthMeters: 2.55,
    hasTailLift: false,
    preferredNavApp: 'GOOGLE_MAPS'
  } as DriverVehicleProfile;

  // 1. Speed Tracking
  const [speedMph, setSpeedMph] = useState(8);
  const [isCopied, setIsCopied] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [activeVoiceAnswer, setActiveVoiceAnswer] = useState<string | null>(null);

  // 2. Hardware-Aware Power Arbiter Mode: 'DRIVING' vs 'REST_MODE' (< 1% battery/hr)
  const [powerMode, setPowerMode] = useState<'DRIVING' | 'REST_MODE'>('DRIVING');

  // 3. Low-Bridge Predictive Radar (3-Tier Escalation: 2mi -> 1mi -> 800yd Siren)
  const [bridgeAlertTier, setBridgeAlertTier] = useState<LowBridgeAlertTier | null>(null);
  const [simulatedBridgeDistance, setSimulatedBridgeDistance] = useState<string | null>(null);

  // 4. Tacho-Safe Split-Break Monitor with 15-second Roll-Away Grace Window
  const [breakType, setBreakType] = useState<SplitBreakType>('15_MIN_SPLIT');
  const [isBreakRunning, setIsBreakRunning] = useState(false);
  const [breakSecondsElapsed, setBreakSecondsElapsed] = useState(0);
  const [isRollAwayGraceActive, setIsRollAwayGraceActive] = useState(false);
  const [rollAwaySecondsRemaining, setRollAwaySecondsRemaining] = useState(15);

  const rollAwayTimerRef = useRef<NodeJS.Timeout | null>(null);

  const targetBreakMinutes =
    breakType === '15_MIN_SPLIT' ? 15 : breakType === '30_MIN_SPLIT' ? 30 : breakType === '45_MIN_FULL' ? 45 : 660;
  const targetBreakSeconds = targetBreakMinutes * 60;
  const breakSecondsRemaining = Math.max(0, targetBreakSeconds - breakSecondsElapsed);

  // Vehicle clearance math
  const vehicleConstraints = site.businessSection.vehicleConstraints;
  const clearanceMargin = +(vehicleConstraints.maxHeightMeters - activeVehicle.heightMeters).toFixed(2);
  const isOverheight = clearanceMargin < 0;

  // Yard speed limit check
  const yardLimit = 10;
  const isSpeeding = speedMph > yardLimit;

  // Track TTS
  useEffect(() => {
    return tts.subscribe((speaking) => {
      setIsSpeaking(speaking);
    });
  }, []);

  // Split-break timer interval
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isBreakRunning && !isRollAwayGraceActive && breakSecondsRemaining > 0) {
      interval = setInterval(() => {
        setBreakSecondsElapsed((prev) => prev + 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isBreakRunning, isRollAwayGraceActive, breakSecondsRemaining]);

  // Roll-away grace countdown interval
  useEffect(() => {
    if (isRollAwayGraceActive) {
      rollAwayTimerRef.current = setInterval(() => {
        setRollAwaySecondsRemaining((prev) => {
          if (prev <= 1) {
            // Grace expired: break forfeited
            clearInterval(rollAwayTimerRef.current as NodeJS.Timeout);
            setIsRollAwayGraceActive(false);
            setIsBreakRunning(false);
            setBreakSecondsElapsed(0);
            tts.speak('Rest break forfeited due to prolonged vehicle motion.', 1.1);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    } else {
      if (rollAwayTimerRef.current) clearInterval(rollAwayTimerRef.current);
    }
    return () => {
      if (rollAwayTimerRef.current) clearInterval(rollAwayTimerRef.current);
    };
  }, [isRollAwayGraceActive]);

  if (!isOpen) return null;

  // Trigger simulated low bridge distance
  const handleSetBridgeDistance = (tier: LowBridgeAlertTier | null, distLabel: string | null) => {
    setBridgeAlertTier(tier);
    setSimulatedBridgeDistance(distLabel);

    if (tier === 'TIER_1_ADVISORY') {
      tts.speak('Advisory: 3.95m low bridge detected 2 miles ahead on route.', 1.05);
    } else if (tier === 'TIER_2_WARNING') {
      tts.speak('Warning: Low clearance bridge 1 mile ahead. Prepare diversion route.', 1.1);
    } else if (tier === 'TIER_3_SIREN') {
      tts.speak('EMERGENCY SIREN: Overheight vehicle for bridge in 800 yards! Stop immediately.', 1.2);
    }
  };

  // Trigger simulated roll-away during break
  const handleSimulateRollAway = () => {
    if (!isBreakRunning) {
      setIsBreakRunning(true);
    }
    setIsRollAwayGraceActive(true);
    setRollAwaySecondsRemaining(15);
    setSpeedMph(4);
    tts.speak('Warning: Vehicle roll-away detected. 15-second grace window to stop vehicle before rest break is forfeited.', 1.15);
  };

  const handleHaltRollAway = () => {
    setIsRollAwayGraceActive(false);
    setSpeedMph(0);
    setRollAwaySecondsRemaining(15);
    tts.speak('Vehicle halted. Rest period preserved.', 1.05);
  };

  const handleCopyCode = () => {
    if (typeof navigator !== 'undefined' && navigator.clipboard) {
      navigator.clipboard.writeText(site.businessSection.gateSecurityCode);
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 2000);
    }
  };

  const handleSpeakCode = () => {
    tts.speak(
      'Gate security keypad code is ' + site.businessSection.gateSecurityCode + '. Speed limit 10 miles per hour.',
      1.05
    );
  };

  // REST MODE (ULTRA-LOW POWER < 1% BATTERY/HR)
  if (powerMode === 'REST_MODE') {
    return (
      <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-black text-white p-6 select-none animate-in fade-in duration-300">
        <div className="absolute top-4 right-4 flex items-center gap-3">
          <button
            onClick={() => setPowerMode('DRIVING')}
            className="flex items-center gap-1.5 px-4 py-2 rounded-2xl bg-slate-900 hover:bg-slate-800 text-amber-300 border border-amber-500/40 text-xs font-bold transition-all"
          >
            <Sun className="h-4 w-4" />
            <span>Wake Driving Mode</span>
          </button>
          <button
            onClick={onClose}
            className="p-2 rounded-xl text-slate-500 hover:text-white"
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        <div className="text-center space-y-6 max-w-sm">
          <div className="flex items-center justify-center gap-2 text-xs font-mono text-emerald-500 bg-emerald-950/40 border border-emerald-500/40 px-3 py-1 rounded-full w-fit mx-auto">
            <Moon className="h-3.5 w-3.5" />
            <span>ULTRA-LOW POWER REST MODE (&lt; 1% BATTERY/HR)</span>
          </div>

          <div>
            <div className="text-xs text-slate-500 uppercase tracking-widest font-mono">
              {breakType.replace(/_/g, ' ')}
            </div>
            <div className="text-6xl sm:text-7xl font-mono font-black tracking-widest text-slate-200 mt-2">
              {String(Math.floor(breakSecondsRemaining / 60)).padStart(2, '0')}:
              {String(breakSecondsRemaining % 60).padStart(2, '0')}
            </div>
            <p className="text-xs text-slate-500 mt-2">
              {isBreakRunning ? 'Statutory Rest Active' : 'Rest Break Paused'}
            </p>
          </div>

          <div className="flex items-center justify-center gap-3">
            <button
              onClick={() => setIsBreakRunning(!isBreakRunning)}
              className="px-6 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-white font-bold text-xs"
            >
              {isBreakRunning ? 'Pause' : 'Resume'}
            </button>
            <button
              onClick={() => {
                setIsBreakRunning(false);
                setBreakSecondsElapsed(0);
              }}
              className="p-2.5 rounded-xl bg-slate-900 border border-slate-700 text-slate-400 hover:text-white text-xs"
            >
              <RotateCcw className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-50 flex flex-col bg-[#070b13] text-white p-3 sm:p-5 overflow-y-auto select-none">
      {/* Top HUD Bar */}
      <div className="flex items-center justify-between border-b border-slate-800 pb-3">
        <div className="flex items-center gap-2.5">
          <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-amber-500 font-black text-slate-950 shadow-lg shadow-amber-500/25">
            <Gauge className="h-6 w-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-base sm:text-lg font-black uppercase tracking-wider text-amber-400">
                Driver In-Motion Telematics HUD
              </span>
              <span className="rounded-full bg-emerald-500/20 px-2 py-0.5 text-[10px] font-black text-emerald-400 border border-emerald-500/40 animate-pulse">
                LIVE GPS
              </span>
            </div>
            <p className="text-xs text-slate-400 truncate max-w-xs sm:max-w-md">
              {site.title} • {site.address}
            </p>
          </div>
        </div>

        {/* Top Control Cluster */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => setPowerMode('REST_MODE')}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-300 border border-slate-700 text-xs font-bold transition-all"
            title="Switch to ultra-low power dark OLED mode (< 1% battery/hr)"
          >
            <Moon className="h-3.5 w-3.5 text-cyan-400" />
            <span className="hidden sm:inline">Rest Mode</span>
          </button>

          <button
            onClick={() => {
              tts.stop();
              onClose();
            }}
            className="flex items-center gap-1.5 rounded-2xl bg-slate-800 hover:bg-slate-700 text-slate-200 hover:text-white px-3 sm:px-4 py-2 text-xs font-black border border-slate-700 transition-colors"
          >
            <span>Exit HUD</span>
            <X className="h-4 w-4" />
          </button>
        </div>
      </div>

      {/* 3-TIER PREDICTIVE LOW-BRIDGE RADAR BANNER (SPEC PAGE 6) */}
      {bridgeAlertTier && (
        <div
          className={'mt-3 p-4 rounded-2xl border-2 flex items-center justify-between gap-3 shadow-2xl animate-in slide-in-from-top-4 ' + (
            bridgeAlertTier === 'TIER_3_SIREN'
              ? 'bg-rose-600 border-white text-white animate-pulse shadow-rose-600/50'
              : bridgeAlertTier === 'TIER_2_WARNING'
              ? 'bg-amber-500 border-amber-300 text-slate-950 font-black'
              : 'bg-amber-950/90 border-amber-400 text-amber-200'
          )}
        >
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-xl bg-black/30 flex items-center justify-center shrink-0">
              <Siren className="h-6 w-6 animate-bounce" />
            </div>
            <div>
              <div className="text-xs font-black uppercase tracking-wider">
                {bridgeAlertTier === 'TIER_3_SIREN'
                  ? 'TIER 3 EMERGENCY RADAR SIREN: 800 YARDS!'
                  : bridgeAlertTier === 'TIER_2_WARNING'
                  ? 'TIER 2 CLEARANCE WARNING: 1 MILE AHEAD'
                  : 'TIER 1 LOW BRIDGE ADVISORY: 2 MILES OUT'}
              </div>
              <p className="text-xs font-semibold">
                Low arch bridge clearance: <strong>3.95m</strong>. Your vehicle height: <strong>{activeVehicle.heightMeters}m</strong>.
                {bridgeAlertTier === 'TIER_3_SIREN' ? ' STOP VEHICLE OR DIVERT IMMEDIATELY!' : ' Plan alternate route now.'}
              </p>
            </div>
          </div>

          <button
            onClick={() => handleSetBridgeDistance(null, null)}
            className="px-3 py-1.5 rounded-xl bg-black/40 hover:bg-black/60 text-xs font-bold shrink-0"
          >
            Dismiss Siren
          </button>
        </div>
      )}

      {/* ROLL-AWAY GRACE WINDOW ALERT BANNER (15-SECOND COUNTDOWN) */}
      {isRollAwayGraceActive && (
        <div className="mt-3 p-4 rounded-2xl bg-rose-600 text-white border-2 border-white shadow-2xl flex items-center justify-between gap-3 animate-bounce">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-xl bg-black/30 flex items-center justify-center font-mono font-black text-xl">
              {rollAwaySecondsRemaining}s
            </div>
            <div>
              <div className="text-xs font-black uppercase tracking-wider">
                VEHICLE ROLL-AWAY DETECTED ({speedMph} MPH)
              </div>
              <p className="text-xs">
                15-second grace window active. Halt vehicle before {rollAwaySecondsRemaining}s or statutory rest cycle will be forfeited!
              </p>
            </div>
          </div>

          <button
            onClick={handleHaltRollAway}
            className="px-4 py-2 rounded-xl bg-white hover:bg-slate-100 text-rose-700 font-black text-xs shadow-lg transition-transform active:scale-95"
          >
            HALT VEHICLE NOW
          </button>
        </div>
      )}

      {/* Speeding Warning Banner */}
      {isSpeeding && !isRollAwayGraceActive && (
        <div className="mt-3 flex items-center justify-between rounded-2xl bg-rose-600 px-4 py-2.5 font-black text-white shadow-xl animate-pulse">
          <div className="flex items-center gap-2 text-sm">
            <AlertTriangle className="h-5 w-5 shrink-0" />
            <span>SPEED WARNING: {speedMph} MPH IN {yardLimit} MPH YARD LIMIT!</span>
          </div>
          <span className="text-xs bg-black/30 px-2.5 py-1 rounded-lg">REDUCE SPEED</span>
        </div>
      )}

      {/* Primary HUD Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3 sm:gap-4 my-auto py-3">
        {/* CARD 1: GIANT GATE CODE */}
        <div className="rounded-3xl border-2 border-amber-500/50 bg-gradient-to-b from-slate-900 to-[#0d1525] p-5 shadow-2xl flex flex-col justify-between space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-black uppercase tracking-widest text-amber-400 flex items-center gap-1.5">
              <Lock className="h-4 w-4" />
              Gate Keypad PIN
            </span>
            <button
              onClick={handleCopyCode}
              className="flex items-center gap-1 text-xs text-slate-300 hover:text-white bg-slate-800 px-2 py-1 rounded-lg border border-slate-700"
            >
              {isCopied ? <Check className="h-3.5 w-3.5 text-emerald-400" /> : <Copy className="h-3.5 w-3.5" />}
              <span>{isCopied ? 'Copied' : 'Copy'}</span>
            </button>
          </div>

          <div className="text-center py-2">
            <div className="text-4xl sm:text-6xl font-black font-mono tracking-widest text-amber-400 drop-shadow-[0_0_20px_rgba(245,158,11,0.35)]">
              {site.businessSection.gateSecurityCode}
            </div>
            <p className="text-[11px] text-slate-400 mt-1">
              {site.businessSection.intercomInstructions || 'Driver-side intercom buzzer'}
            </p>
          </div>

          <button
            onClick={handleSpeakCode}
            className="w-full flex items-center justify-center gap-2 rounded-2xl bg-amber-500 hover:bg-amber-400 active:scale-95 py-2.5 text-slate-950 font-black text-xs transition-all shadow-md shadow-amber-500/20"
          >
            <Volume2 className="h-4 w-4" />
            <span>Speak PIN Aloud</span>
          </button>
        </div>

        {/* CARD 2: TACHO-SAFE SPLIT-BREAK MONITOR (SPEC PAGE 6) */}
        <div className="rounded-3xl border-2 border-cyan-500/50 bg-gradient-to-b from-slate-900 to-[#0c1829] p-5 shadow-2xl flex flex-col justify-between space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-black uppercase tracking-widest text-cyan-400 flex items-center gap-1.5">
              <Clock className="h-4 w-4" />
              Tacho-Safe Split-Break
            </span>
            <div className="flex items-center gap-1">
              {(['15_MIN_SPLIT', '30_MIN_SPLIT', '45_MIN_FULL'] as SplitBreakType[]).map((t) => (
                <button
                  key={t}
                  onClick={() => {
                    setBreakType(t);
                    setBreakSecondsElapsed(0);
                    setIsBreakRunning(false);
                  }}
                  className={'px-1.5 py-0.5 rounded text-[10px] font-bold ' + (
                    breakType === t
                      ? 'bg-cyan-500 text-slate-950 font-black'
                      : 'bg-slate-800 text-slate-400'
                  )}
                >
                  {t === '15_MIN_SPLIT' ? '15m' : t === '30_MIN_SPLIT' ? '30m' : '45m'}
                </button>
              ))}
            </div>
          </div>

          <div className="text-center py-2">
            <div className="text-4xl sm:text-5xl font-black font-mono tracking-widest text-cyan-300">
              {String(Math.floor(breakSecondsRemaining / 60)).padStart(2, '0')}:
              {String(breakSecondsRemaining % 60).padStart(2, '0')}
            </div>
            <div className="text-[11px] text-slate-400 mt-1">
              {isBreakRunning ? (
                <span className="text-emerald-400 font-bold">WTD Rest Protected (15s Grace Active)</span>
              ) : (
                <span>Break Paused • Tap Start to Log</span>
              )}
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setIsBreakRunning(!isBreakRunning)}
              className={'flex-1 py-2.5 rounded-xl font-bold text-xs flex items-center justify-center gap-1.5 transition-all ' + (
                isBreakRunning
                  ? 'bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700'
                  : 'bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-black shadow-md shadow-cyan-500/20'
              )}
            >
              {isBreakRunning ? <Pause className="h-3.5 w-3.5" /> : <Play className="h-3.5 w-3.5" />}
              <span>{isBreakRunning ? 'Pause Break' : 'Start Rest Break'}</span>
            </button>
            <button
              onClick={handleSimulateRollAway}
              className="px-2.5 py-2.5 rounded-xl bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 border border-amber-500/40 text-xs font-bold"
              title="Test 15-second roll-away grace window"
            >
              Simulate Creep
            </button>
          </div>
        </div>

        {/* CARD 3: VEHICLE CLEARANCE & SPEEDOMETER */}
        <div className={'rounded-3xl border-2 p-5 shadow-2xl flex flex-col justify-between space-y-3 ' + (
          isOverheight
            ? 'border-rose-500 bg-gradient-to-b from-rose-950/40 to-[#12080a]'
            : 'border-blue-500/50 bg-gradient-to-b from-slate-900 to-[#0b1424]'
        )}>
          <div className="flex items-center justify-between">
            <span className="text-xs font-black uppercase tracking-widest text-blue-400 flex items-center gap-1.5">
              <Truck className="h-4 w-4" />
              Height & Speed Telemetry
            </span>
            <span className="text-[10px] font-mono text-slate-400">{activeVehicle.vehicleReg}</span>
          </div>

          <div className="grid grid-cols-2 gap-2 text-center py-1">
            <div className="rounded-2xl bg-black/40 p-2.5 border border-slate-800">
              <div className="text-[10px] text-slate-400 uppercase">GPS Speed</div>
              <div className={'text-3xl font-mono font-black mt-0.5 ' + (isSpeeding ? 'text-rose-400' : 'text-white')}>
                {speedMph} <span className="text-xs font-normal text-slate-400">MPH</span>
              </div>
            </div>

            <div className="rounded-2xl bg-black/40 p-2.5 border border-slate-800">
              <div className="text-[10px] text-slate-400 uppercase">Cab Clearance</div>
              <div className={'text-3xl font-mono font-black mt-0.5 ' + (isOverheight ? 'text-rose-400' : 'text-emerald-400')}>
                {activeVehicle.heightMeters}m
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setSpeedMph(speedMph > 0 ? 0 : 8)}
              className="flex-1 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-bold"
            >
              {speedMph > 0 ? 'Set Speed 0 MPH' : 'Set Speed 8 MPH'}
            </button>
            {onOpenBulkheadSync && (
              <button
                onClick={onOpenBulkheadSync}
                className="px-3 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs"
                title="Scan trailer front plate"
              >
                Scan Plate
              </button>
            )}
          </div>
        </div>
      </div>

      {/* PREDICTIVE RADAR SIMULATOR & COMMUNITY UTILITIES BAR */}
      <div className="mt-auto pt-3 border-t border-slate-800 space-y-2">
        <div className="flex flex-wrap items-center justify-between gap-2">
          {/* Low-bridge simulation buttons */}
          <div className="flex items-center gap-1.5 text-xs text-slate-400">
            <span className="font-bold text-slate-300">Simulate Bridge Radar:</span>
            <button
              onClick={() => handleSetBridgeDistance('TIER_1_ADVISORY', '2 Miles')}
              className="px-2.5 py-1 rounded-lg bg-amber-950/60 text-amber-300 border border-amber-500/40 text-[11px] font-bold hover:bg-amber-900/60"
            >
              2 Miles (Tier 1)
            </button>
            <button
              onClick={() => handleSetBridgeDistance('TIER_2_WARNING', '1 Mile')}
              className="px-2.5 py-1 rounded-lg bg-amber-500/20 text-amber-300 border border-amber-500/40 text-[11px] font-bold hover:bg-amber-500/30"
            >
              1 Mile (Tier 2)
            </button>
            <button
              onClick={() => handleSetBridgeDistance('TIER_3_SIREN', '800 Yards')}
              className="px-2.5 py-1 rounded-lg bg-rose-600 text-white font-black text-[11px] hover:bg-rose-500 shadow-md shadow-rose-600/30 animate-pulse"
            >
              800y Siren (Tier 3)
            </button>
          </div>

          {/* Telematics Modals Buttons */}
          <div className="flex items-center gap-2">
            {onOpenLaybyRadar && (
              <button
                onClick={onOpenLaybyRadar}
                className="px-3 py-1.5 rounded-xl bg-emerald-950 hover:bg-emerald-900 border border-emerald-500/50 text-emerald-300 text-xs font-bold flex items-center gap-1.5"
              >
                <Compass className="h-3.5 w-3.5 text-emerald-400" />
                <span>Layby Radar</span>
              </button>
            )}

            {onOpenCbRadio && (
              <button
                onClick={onOpenCbRadio}
                className="px-3 py-1.5 rounded-xl bg-amber-950 hover:bg-amber-900 border border-amber-500/50 text-amber-300 text-xs font-bold flex items-center gap-1.5"
              >
                <Radio className="h-3.5 w-3.5 text-amber-400" />
                <span>Digital CB</span>
              </button>
            )}

            {onOpenVoiceCopilot && (
              <button
                onClick={onOpenVoiceCopilot}
                className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-amber-300 border border-slate-700 text-xs font-bold flex items-center gap-1.5"
              >
                <Mic className="h-3.5 w-3.5 text-amber-400" />
                <span>Voice Co-Pilot</span>
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
