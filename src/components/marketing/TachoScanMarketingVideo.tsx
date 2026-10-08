'use client';

import React, { useState, useEffect, useRef } from 'react';
import {
  Play,
  Pause,
  RotateCcw,
  Volume2,
  VolumeX,
  Maximize2,
  Minimize2,
  Camera,
  Calendar,
  ShieldCheck,
  FileText,
  Clock,
  Sparkles,
  CheckCircle2,
  AlertTriangle,
  ArrowRight,
  Truck,
  ScanLine,
  Zap,
  Mic,
  CreditCard,
  UploadCloud,
  Check
} from 'lucide-react';

interface TachoScanMarketingVideoProps {
  onPreRegisterClick?: () => void;
}

// British English Voiceover Script focused on "Scan, Upload, View"
const VOICEOVER_SCRIPTS: Record<number, string> = {
  1: "How Tacho-Scan works in three simple steps: Scan, Upload, and View.",
  2: "Step one: Scan. Point your camera at your printed tachograph roll. Our neural scanner instantly reads Stoneridge and VDO layouts, capturing odometers, vehicle details, and activity blocks.",
  3: "Step two: Upload. Tap upload to process your shift data, or connect any card reader of your choice to download your driver card directly.",
  4: "Step three: View. Instantly inspect your complete shift summary, driving totals, rest compliance, and your statutory twenty-eight day DVSA matrix.",
  5: "Scan, upload, and view. Pre-register today to claim your priority driver pass before public launch."
};

export const TachoScanMarketingVideo: React.FC<TachoScanMarketingVideoProps> = ({
  onPreRegisterClick
}) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [isMuted, setIsMuted] = useState(false); // Default unmuted so voiceover is heard
  const [isVoiceoverEnabled, setIsVoiceoverEnabled] = useState(true);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const audioCtxRef = useRef<AudioContext | null>(null);
  const lastSpokenSceneRef = useRef<number>(0);

  const TOTAL_DURATION = 40; // 40 seconds exact

  // British English Voiceover Synthesis using Web Speech API
  const speakBritishVoiceover = (sceneNum: number) => {
    if (!isVoiceoverEnabled || isMuted || typeof window === 'undefined' || !('speechSynthesis' in window)) {
      return;
    }

    try {
      window.speechSynthesis.cancel(); // Stop any pending speech
      const text = VOICEOVER_SCRIPTS[sceneNum];
      if (!text) return;

      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = 'en-GB';
      utterance.rate = 1.0;
      utterance.pitch = 1.0;
      utterance.volume = 1.0;

      // Select authentic British voice if available
      const voices = window.speechSynthesis.getVoices();
      const britishVoice =
        voices.find(
          (v) =>
            (v.lang === 'en-GB' || v.lang.includes('GB') || v.lang.startsWith('en_GB')) &&
            (v.name.includes('UK') ||
              v.name.includes('British') ||
              v.name.includes('George') ||
              v.name.includes('Oliver') ||
              v.name.includes('Daniel') ||
              v.name.includes('Hazel') ||
              v.name.includes('Serena'))
        ) ||
        voices.find((v) => v.lang === 'en-GB' || v.lang.includes('GB')) ||
        voices.find((v) => v.lang.startsWith('en'));

      if (britishVoice) {
        utterance.voice = britishVoice;
      }

      window.speechSynthesis.speak(utterance);
    } catch (e) {
      console.warn('Speech synthesis unavailable', e);
    }
  };

  // Sound Synthesizer via Web Audio API for SFX
  const playSoundEffect = (type: 'laser' | 'shutter' | 'chime' | 'beep') => {
    if (isMuted) return;
    try {
      if (!audioCtxRef.current) {
        audioCtxRef.current = new (window.AudioContext || (window as any).webkitAudioContext)();
      }
      const ctx = audioCtxRef.current;
      if (ctx.state === 'suspended') {
        ctx.resume();
      }

      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.connect(gain);
      gain.connect(ctx.destination);

      const now = ctx.currentTime;

      if (type === 'laser') {
        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(800, now);
        osc.frequency.exponentialRampToValueAtTime(220, now + 0.3);
        gain.gain.setValueAtTime(0.06, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.3);
        osc.start(now);
        osc.stop(now + 0.3);
      } else if (type === 'shutter') {
        osc.type = 'square';
        osc.frequency.setValueAtTime(380, now);
        osc.frequency.setValueAtTime(140, now + 0.05);
        gain.gain.setValueAtTime(0.08, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.12);
        osc.start(now);
        osc.stop(now + 0.12);
      } else if (type === 'chime') {
        osc.type = 'sine';
        osc.frequency.setValueAtTime(523.25, now);
        osc.frequency.setValueAtTime(659.25, now + 0.1);
        osc.frequency.setValueAtTime(783.99, now + 0.2);
        gain.gain.setValueAtTime(0.09, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.45);
        osc.start(now);
        osc.stop(now + 0.45);
      } else if (type === 'beep') {
        osc.type = 'sine';
        osc.frequency.setValueAtTime(880, now);
        gain.gain.setValueAtTime(0.06, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.15);
        osc.start(now);
        osc.stop(now + 0.15);
      }
    } catch (e) {
      // Audio fallback
    }
  };

  // Scene definitions based on 40s timeline:
  // Scene 1: 00:00 - 00:05 (Overview: Scan • Upload • View)
  // Scene 2: 00:05 - 00:18 (Step 1: SCAN - How the OCR works on physical printout)
  // Scene 3: 00:18 - 00:27 (Step 2: UPLOAD - Ingest & Card Reader option)
  // Scene 4: 00:27 - 00:35 (Step 3: VIEW - Digital shift breakdown & 28-day matrix)
  // Scene 5: 00:35 - 00:40 (Outro: Pre-Register CTA)
  const currentScene =
    currentTime < 5
      ? 1
      : currentTime < 18
      ? 2
      : currentTime < 27
      ? 3
      : currentTime < 35
      ? 4
      : 5;

  // Trigger British Voiceover on scene change
  useEffect(() => {
    if (isPlaying && currentScene !== lastSpokenSceneRef.current) {
      lastSpokenSceneRef.current = currentScene;
      speakBritishVoiceover(currentScene);
    }
  }, [isPlaying, currentScene, isVoiceoverEnabled, isMuted]);

  // Main Playback Loop
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isPlaying) {
      interval = setInterval(() => {
        setCurrentTime((prev) => {
          if (prev >= TOTAL_DURATION) {
            setIsPlaying(false);
            if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
              window.speechSynthesis.cancel();
            }
            return TOTAL_DURATION;
          }
          const next = +(prev + 0.1).toFixed(1);

          // Audio triggers at specific milestones
          if (Math.abs(next - 5.5) < 0.08) playSoundEffect('shutter');
          if (Math.abs(next - 8.0) < 0.08) playSoundEffect('laser');
          if (Math.abs(next - 12.0) < 0.08) playSoundEffect('laser');
          if (Math.abs(next - 18.5) < 0.08) playSoundEffect('beep');
          if (Math.abs(next - 27.5) < 0.08) playSoundEffect('chime');
          if (Math.abs(next - 35.5) < 0.08) playSoundEffect('chime');

          return next;
        });
      }, 100);
    } else {
      if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
        window.speechSynthesis.cancel();
      }
    }
    return () => clearInterval(interval);
  }, [isPlaying, isMuted]);

  const togglePlay = () => {
    if (currentTime >= TOTAL_DURATION) {
      setCurrentTime(0);
      lastSpokenSceneRef.current = 0;
      setIsPlaying(true);
    } else {
      const nextPlay = !isPlaying;
      setIsPlaying(nextPlay);
      if (!nextPlay) {
        if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
          window.speechSynthesis.cancel();
        }
      } else {
        lastSpokenSceneRef.current = 0; // Trigger speech for current scene on play
      }
    }
  };

  const handleRestart = () => {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      window.speechSynthesis.cancel();
    }
    setCurrentTime(0);
    lastSpokenSceneRef.current = 0;
    setIsPlaying(true);
  };

  const jumpToTime = (seconds: number) => {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      window.speechSynthesis.cancel();
    }
    setCurrentTime(seconds);
    lastSpokenSceneRef.current = 0;
  };

  const toggleVoiceover = () => {
    const nextState = !isVoiceoverEnabled;
    setIsVoiceoverEnabled(nextState);
    if (!nextState) {
      if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
        window.speechSynthesis.cancel();
      }
    } else if (isPlaying) {
      speakBritishVoiceover(currentScene);
    }
  };

  const toggleFullscreen = () => {
    if (!containerRef.current) return;
    if (!document.fullscreenElement) {
      containerRef.current.requestFullscreen().catch(() => {});
      setIsFullscreen(true);
    } else {
      document.exitFullscreen().catch(() => {});
      setIsFullscreen(false);
    }
  };

  // Format seconds to mm:ss
  const formatTime = (secs: number) => {
    const s = Math.floor(secs);
    const m = Math.floor(s / 60);
    const remainder = s % 60;
    return `${m.toString().padStart(2, '0')}:${remainder.toString().padStart(2, '0')}`;
  };

  // Dynamic Laser Position for Scene 2 (How scanning works)
  // Scans from 5s to 18s (13 seconds total duration)
  const scanProgressPercent = Math.min(
    100,
    Math.max(0, ((currentTime - 5.5) / 11) * 100)
  );

  return (
    <div
      ref={containerRef}
      className={`relative w-full rounded-3xl overflow-hidden bg-slate-950 border border-slate-800 shadow-2xl group flex flex-col ${
        isFullscreen ? 'h-screen w-screen rounded-none' : 'aspect-[16/9] min-h-[380px] sm:min-h-[500px]'
      }`}
    >
      {/* ===================================================================== */}
      {/* STAGE SCREEN (CINEMATIC SCENES)                                       */}
      {/* ===================================================================== */}
      <div className="relative flex-1 w-full overflow-hidden flex items-center justify-center select-none bg-gradient-to-b from-slate-900 via-slate-950 to-slate-950">
        {/* Background Grid Pattern */}
        <div className="absolute inset-0 bg-cockpit-grid opacity-25 pointer-events-none" />

        {/* Ambient Glows depending on active scene */}
        {currentScene === 1 && (
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-blue-500/15 rounded-full blur-[100px] pointer-events-none" />
        )}
        {currentScene === 2 && (
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-cyan-500/20 rounded-full blur-[100px] pointer-events-none" />
        )}
        {currentScene === 3 && (
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-indigo-500/20 rounded-full blur-[100px] pointer-events-none" />
        )}
        {currentScene === 4 && (
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-emerald-500/20 rounded-full blur-[100px] pointer-events-none" />
        )}
        {currentScene === 5 && (
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-cyan-500/20 rounded-full blur-[100px] pointer-events-none" />
        )}

        {/* TOP STATUS OVERLAY */}
        <div className="absolute top-3 left-4 right-4 flex items-center justify-between z-20 pointer-events-none">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-cyan-400 animate-ping" />
            <span className="text-[11px] font-mono font-bold text-white bg-slate-900/80 px-2.5 py-1 rounded-full border border-slate-700/80 backdrop-blur-sm shadow">
              TACHO-SCAN AI • DEMO
            </span>
          </div>

          <div className="flex items-center gap-2">
            {isVoiceoverEnabled && !isMuted ? (
              <span className="text-[10px] font-mono text-cyan-300 bg-cyan-950/80 border border-cyan-500/40 px-2.5 py-1 rounded-full flex items-center gap-1.5 backdrop-blur-sm">
                <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse" />
                🇬🇧 British Voiceover
              </span>
            ) : null}
            <span className="text-[11px] font-mono font-bold text-cyan-400 bg-slate-900/80 px-2.5 py-1 rounded-full border border-slate-700/80 backdrop-blur-sm shadow">
              {formatTime(currentTime)} / 00:40
            </span>
          </div>
        </div>

        {/* ================================================================= */}
        {/* SCENE 1: THREE CORE STEPS (00:00 - 00:05)                         */}
        {/* ================================================================= */}
        {currentScene === 1 && (
          <div className="absolute inset-0 p-4 sm:p-8 flex flex-col justify-center items-center text-center animate-in fade-in duration-300 space-y-6">
            <div className="space-y-2 max-w-lg">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/20 border border-cyan-500/40 text-cyan-300 text-xs font-mono font-bold">
                <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
                <span>3 SIMPLE STEPS FOR UK DRIVERS</span>
              </div>
              <h2 className="text-2xl sm:text-4xl font-black text-white tracking-tight">
                Scan. Upload. View.
              </h2>
              <p className="text-xs sm:text-sm text-slate-300 font-sans">
                Turn physical printed tachograph rolls into instant statutory compliance.
              </p>
            </div>

            {/* 3 Step Flow Pills */}
            <div className="grid grid-cols-3 gap-2.5 max-w-lg w-full font-mono text-xs">
              <div className="p-3 rounded-2xl bg-cyan-950/40 border border-cyan-500/40 text-center space-y-1 shadow">
                <div className="text-cyan-400 font-black text-sm">1. SCAN</div>
                <div className="text-[11px] text-slate-300">Camera OCR</div>
              </div>
              <div className="p-3 rounded-2xl bg-indigo-950/40 border border-indigo-500/40 text-center space-y-1 shadow">
                <div className="text-indigo-400 font-black text-sm">2. UPLOAD</div>
                <div className="text-[11px] text-slate-300">Scan or Card</div>
              </div>
              <div className="p-3 rounded-2xl bg-emerald-950/40 border border-emerald-500/40 text-center space-y-1 shadow">
                <div className="text-emerald-400 font-black text-sm">3. VIEW</div>
                <div className="text-[11px] text-slate-300">28-Day DVSA</div>
              </div>
            </div>

            <div className="text-[11px] font-mono text-slate-400">
              Supports Stoneridge SE5000, Continental VDO DTCO &amp; Any Standard Card Reader
            </div>
          </div>
        )}

        {/* ================================================================= */}
        {/* SCENE 2: STEP 1: HOW SCANNING WORKS (00:05 - 00:18)               */}
        {/* ================================================================= */}
        {currentScene === 2 && (
          <div className="absolute inset-0 p-3 sm:p-6 flex flex-col justify-between items-center text-center animate-in fade-in duration-300">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/20 border border-cyan-500/40 text-cyan-300 text-xs font-mono font-bold">
              <Camera className="w-3.5 h-3.5" />
              <span>STEP 1 • HOW THE SCANNING WORKS</span>
            </div>

            {/* Smartphone Viewfinder Scanning Physical Printout */}
            <div className="relative w-full max-w-md bg-slate-950/90 rounded-2xl border-2 border-cyan-500/50 p-3.5 shadow-2xl overflow-hidden font-mono text-left">
              {/* Viewfinder Corner Reticles */}
              <div className="absolute top-2 left-2 w-4 h-4 border-t-2 border-l-2 border-cyan-400" />
              <div className="absolute top-2 right-2 w-4 h-4 border-t-2 border-r-2 border-cyan-400" />
              <div className="absolute bottom-2 left-2 w-4 h-4 border-b-2 border-l-2 border-cyan-400" />
              <div className="absolute bottom-2 right-2 w-4 h-4 border-b-2 border-r-2 border-cyan-400" />

              {/* Physical Thermal Printout Simulation inside Viewfinder */}
              <div className="relative bg-white text-slate-900 rounded-lg p-3 text-[10px] leading-tight shadow-inner font-mono max-h-[170px] overflow-hidden">
                {/* Real-time Cyan Laser Sweep Line */}
                <div
                  className="absolute left-0 right-0 h-1 bg-cyan-400 shadow-[0_0_15px_#22d3ee] z-20 pointer-events-none transition-all duration-100"
                  style={{ top: `${scanProgressPercent}%` }}
                >
                  <div className="absolute right-2 -top-4 bg-cyan-500 text-slate-950 text-[8px] font-black px-1.5 py-0.5 rounded shadow">
                    SCANNING LINE
                  </div>
                </div>

                {/* Printout Content with Bounding Box Overlays */}
                <div className="border-b border-dashed border-slate-300 pb-1 text-center font-bold text-slate-800">
                  --- 24h DAILY PRINTOUT ---
                </div>

                <div className="py-1 space-y-1">
                  {/* Header Row */}
                  <div
                    className={`p-0.5 rounded transition ${
                      scanProgressPercent > 15 ? 'bg-cyan-100 text-cyan-900 font-bold ring-1 ring-cyan-400' : 'text-slate-700'
                    }`}
                  >
                    <div>DATE: 2026-10-08 19:29 UTC</div>
                    <div>DRIVER: 0000000001099201</div>
                    <div>VEHICLE: GB26 HGV (VOLVO FH)</div>
                  </div>

                  {/* Activity Sequence */}
                  <div
                    className={`p-0.5 rounded transition ${
                      scanProgressPercent > 45 ? 'bg-emerald-100 text-emerald-900 font-bold ring-1 ring-emerald-400' : 'text-slate-600'
                    }`}
                  >
                    <div>06:14  ⚒  OTHER WORK  00h 18m</div>
                    <div>06:32  ☸  DRIVING     04h 12m</div>
                    <div>10:44  🛌  REST/BREAK  00h 48m</div>
                    <div>11:32  ☸  DRIVING     04h 30m</div>
                    <div>16:02  ⊡  POA         00h 45m</div>
                    <div>16:47  🛌  DAILY REST  11h 12m</div>
                  </div>

                  {/* Odometer Summary */}
                  <div
                    className={`p-0.5 rounded transition ${
                      scanProgressPercent > 80 ? 'bg-amber-100 text-amber-900 font-bold ring-1 ring-amber-400' : 'text-slate-600'
                    }`}
                  >
                    <div>ODOMETER: 413,280 km (END OF SHIFT)</div>
                  </div>
                </div>
              </div>

              {/* Real-time Recognition Status Overlays */}
              <div className="grid grid-cols-2 gap-2 pt-2 text-[10px]">
                <div className="flex items-center gap-1.5 text-cyan-300">
                  <Check className="w-3.5 h-3.5 text-cyan-400" />
                  <span>Stoneridge / VDO Detected</span>
                </div>
                <div className="flex items-center gap-1.5 text-emerald-300">
                  <Check className="w-3.5 h-3.5 text-emerald-400" />
                  <span>6 Activity Blocks Read</span>
                </div>
              </div>
            </div>

            <div className="space-y-0.5">
              <h3 className="text-lg sm:text-xl font-black text-white">
                Hold Phone Over Your Printout
              </h3>
              <p className="text-xs text-slate-300 max-w-md">
                Neural OCR automatically aligns to the receipt edges, reading odometers and activity pictograms under dim cab lighting.
              </p>
            </div>
          </div>
        )}

        {/* ================================================================= */}
        {/* SCENE 3: STEP 2: UPLOAD (SCAN OR CARD READER) (00:18 - 00:27)    */}
        {/* ================================================================= */}
        {currentScene === 3 && (
          <div className="absolute inset-0 p-4 sm:p-8 flex flex-col justify-between items-center text-center animate-in fade-in duration-300">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/20 border border-indigo-500/40 text-indigo-300 text-xs font-mono font-bold">
              <UploadCloud className="w-3.5 h-3.5" />
              <span>STEP 2 • UPLOAD SHIFT OR CARD DATA</span>
            </div>

            {/* Ingestion Options Card */}
            <div className="max-w-md w-full bg-slate-900/90 rounded-2xl border border-indigo-500/40 p-4 space-y-3 font-mono shadow-2xl text-left">
              {/* Upload Progress Bar */}
              <div className="space-y-1">
                <div className="flex justify-between text-xs text-slate-300">
                  <span className="flex items-center gap-1.5 font-bold text-white">
                    <UploadCloud className="w-4 h-4 text-cyan-400" /> Ingesting End-of-Shift Data
                  </span>
                  <span className="text-emerald-400 font-bold">100% Verified</span>
                </div>
                <div className="w-full h-2 bg-slate-800 rounded-full overflow-hidden">
                  <div className="h-full bg-gradient-to-r from-cyan-500 to-indigo-500 w-full animate-pulse" />
                </div>
              </div>

              {/* Two Ingest Methods Drivers Can Choose */}
              <div className="grid grid-cols-2 gap-2 pt-1 text-xs">
                <div className="p-3 rounded-xl bg-slate-950 border border-cyan-500/40 space-y-1">
                  <div className="flex items-center gap-1.5 text-cyan-300 font-bold text-[11px]">
                    <Camera className="w-4 h-4" /> Thermal Scan
                  </div>
                  <div className="text-[10px] text-slate-400 leading-tight">
                    Instant photo upload of your physical daily printout.
                  </div>
                  <div className="text-[9px] text-emerald-400 font-bold pt-1">✓ End of Shift</div>
                </div>

                <div className="p-3 rounded-xl bg-slate-950 border border-indigo-500/40 space-y-1">
                  <div className="flex items-center gap-1.5 text-indigo-300 font-bold text-[11px]">
                    <CreditCard className="w-4 h-4" /> Card Reader
                  </div>
                  <div className="text-[10px] text-slate-400 leading-tight">
                    Download using any card reader of your choice.
                  </div>
                  <div className="text-[9px] text-cyan-400 font-bold pt-1">✓ Direct .DDD File</div>
                </div>
              </div>

              <div className="text-[10px] text-slate-400 border-t border-slate-800 pt-2 flex items-center justify-between">
                <span>Tamper-proof end-of-shift verification</span>
                <span className="text-emerald-400 font-bold">EU Reg 165/2014 Compliant</span>
              </div>
            </div>

            <div className="space-y-0.5">
              <h3 className="text-lg sm:text-xl font-black text-white">
                Upload in Seconds — Or Connect Any Card Reader
              </h3>
              <p className="text-xs text-slate-300 max-w-md">
                Upload your camera scan directly, or plug in any standard USB or Bluetooth smart card reader of your choice.
              </p>
            </div>
          </div>
        )}

        {/* ================================================================= */}
        {/* SCENE 4: STEP 3: VIEW COMPLIANCE (00:27 - 00:35)                  */}
        {/* ================================================================= */}
        {currentScene === 4 && (
          <div className="absolute inset-0 p-4 sm:p-8 flex flex-col justify-between items-center text-center animate-in fade-in duration-300">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 text-xs font-mono font-bold">
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>STEP 3 • VIEW DIGITAL COMPLIANCE MATRIX</span>
            </div>

            {/* Clean Parsed Shift Report Card */}
            <div className="max-w-md w-full bg-slate-900/90 rounded-2xl border border-emerald-500/40 p-3.5 space-y-2.5 font-mono shadow-2xl text-left">
              <div className="flex justify-between items-center text-xs border-b border-slate-800 pb-1.5">
                <span className="text-white font-bold flex items-center gap-1.5">
                  <Truck className="w-4 h-4 text-cyan-400" /> SHIFT SUMMARY (TODAY)
                </span>
                <span className="text-emerald-400 font-bold text-[10px] bg-emerald-500/20 px-2 py-0.5 rounded">
                  ✓ COMPLIANT
                </span>
              </div>

              {/* Shift Metrics */}
              <div className="grid grid-cols-3 gap-2 text-center text-xs">
                <div className="p-2 rounded-xl bg-slate-950 border border-slate-800">
                  <div className="text-[10px] text-slate-400">TOTAL DRIVE</div>
                  <div className="text-cyan-300 font-black text-sm">08h 42m</div>
                  <div className="text-[9px] text-slate-500">Legal: 9h / 10h</div>
                </div>

                <div className="p-2 rounded-xl bg-slate-950 border border-slate-800">
                  <div className="text-[10px] text-slate-400">REST TAKEN</div>
                  <div className="text-emerald-300 font-black text-sm">11h 12m</div>
                  <div className="text-[9px] text-emerald-400 font-bold">Full Daily Rest</div>
                </div>

                <div className="p-2 rounded-xl bg-slate-950 border border-slate-800">
                  <div className="text-[10px] text-slate-400">SHIFT SPREAD</div>
                  <div className="text-white font-black text-sm">13h 15m</div>
                  <div className="text-[9px] text-emerald-400">Within 15h Limit</div>
                </div>
              </div>

              {/* 28-Day Audit Matrix Strip */}
              <div className="space-y-1 text-[10px]">
                <div className="flex justify-between text-slate-400">
                  <span>28-Day Statutory DVSA Ledger:</span>
                  <span className="text-emerald-400 font-bold">28 / 28 Days Active</span>
                </div>
                <div className="grid grid-cols-7 gap-1">
                  {Array.from({ length: 14 }).map((_, i) => (
                    <div
                      key={i}
                      className={`h-4 rounded flex items-center justify-center font-bold text-[8px] ${
                        i === 13
                          ? 'bg-cyan-500 text-slate-950 ring-1 ring-cyan-300'
                          : 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                      }`}
                    >
                      D{i + 15}
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="space-y-0.5">
              <h3 className="text-lg sm:text-xl font-black text-white">
                View Clear Driving Hours &amp; 28-Day Matrix
              </h3>
              <p className="text-xs text-slate-300 max-w-md">
                Instantly check your remaining driving allowance, 15h spread status, and statutory 28-day compliance without calculator guesswork.
              </p>
            </div>
          </div>
        )}

        {/* ================================================================= */}
        {/* SCENE 5: CALL TO ACTION (00:35 - 00:40)                           */}
        {/* ================================================================= */}
        {currentScene === 5 && (
          <div className="absolute inset-0 p-6 sm:p-10 flex flex-col justify-center items-center text-center animate-in zoom-in-95 duration-300 space-y-4">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/20 border border-cyan-500/40 text-cyan-300 text-xs font-mono font-bold">
              <Sparkles className="w-3.5 h-3.5" />
              <span>DRIVER BETA NOW OPEN</span>
            </div>

            <div className="space-y-2 max-w-md">
              <h2 className="text-2xl sm:text-4xl font-black text-white tracking-tight">
                Scan. Upload. View.
              </h2>
              <p className="text-xs sm:text-sm text-slate-300 font-sans">
                Claim your priority driver pass for the upcoming Tacho-Scan AI beta pilot. Free for British commercial drivers.
              </p>
            </div>

            <button
              onClick={onPreRegisterClick}
              className="px-8 py-3.5 rounded-2xl bg-gradient-to-r from-cyan-500 via-blue-500 to-indigo-600 hover:from-cyan-400 hover:to-indigo-500 text-slate-950 font-black text-sm font-mono flex items-center justify-center gap-2 shadow-glow-blue transition transform hover:scale-105 cursor-pointer touch-press"
            >
              <Truck className="w-4 h-4 text-slate-950" />
              <span>Pre-Register as a Driver Now</span>
              <ArrowRight className="w-4 h-4 text-slate-950" />
            </button>

            <div className="text-[11px] font-mono text-slate-400">
              Works with printed thermal rolls and any card reader of your choice.
            </div>
          </div>
        )}

        {/* SUBTITLE NARRATION BAR (SYNCHRONIZED WITH BRITISH VOICEOVER) */}
        <div className="absolute bottom-3 left-4 right-4 z-20 pointer-events-none">
          <div className="max-w-xl mx-auto px-4 py-1.5 rounded-xl bg-slate-950/85 border border-slate-700/80 backdrop-blur-md shadow-lg text-center">
            <p className="text-xs sm:text-sm text-cyan-200 font-sans leading-tight">
              "{VOICEOVER_SCRIPTS[currentScene]}"
            </p>
          </div>
        </div>

        {/* Floating Play Overlay (when paused) */}
        {!isPlaying && currentTime < TOTAL_DURATION && (
          <button
            onClick={togglePlay}
            className="absolute inset-0 m-auto w-16 sm:w-20 h-16 sm:h-20 rounded-full bg-cyan-500/90 hover:bg-cyan-400 text-slate-950 flex items-center justify-center shadow-glow-blue transition transform hover:scale-110 cursor-pointer z-30"
            title="Play 40s Feature Video with British Voiceover"
          >
            <Play className="w-8 sm:w-10 h-8 sm:h-10 fill-current translate-x-1" />
          </button>
        )}
      </div>

      {/* ===================================================================== */}
      {/* CONTROLS & TIMELINE DOCK (BOTTOM)                                     */}
      {/* ===================================================================== */}
      <div className="bg-slate-950/95 border-t border-slate-800 p-3 sm:p-4 space-y-2 z-20 backdrop-blur-md">
        {/* Scrubber Bar */}
        <div
          onClick={(e) => {
            const rect = e.currentTarget.getBoundingClientRect();
            const clickX = e.clientX - rect.left;
            const pct = Math.max(0, Math.min(1, clickX / rect.width));
            jumpToTime(+(pct * TOTAL_DURATION).toFixed(1));
          }}
          className="relative w-full h-2.5 bg-slate-800 rounded-full overflow-hidden cursor-pointer"
        >
          <div
            className="absolute top-0 left-0 bottom-0 bg-gradient-to-r from-cyan-500 via-indigo-400 to-emerald-400 rounded-full transition-all duration-100"
            style={{ width: `${(currentTime / TOTAL_DURATION) * 100}%` }}
          />
        </div>

        {/* Chapter Pills & Controls */}
        <div className="flex flex-wrap items-center justify-between gap-2 text-xs font-mono">
          {/* Play / Restart / Timecode */}
          <div className="flex items-center gap-2">
            <button
              onClick={togglePlay}
              className="p-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 text-white border border-slate-700 transition cursor-pointer"
              title={isPlaying ? 'Pause' : 'Play'}
            >
              {isPlaying ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
            </button>

            <button
              onClick={handleRestart}
              className="p-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 text-slate-300 hover:text-white border border-slate-700 transition cursor-pointer"
              title="Restart Video"
            >
              <RotateCcw className="w-3.5 h-3.5" />
            </button>

            <div className="text-slate-300 font-bold">
              <span className="text-cyan-400">{formatTime(currentTime)}</span>
              <span className="text-slate-500"> / {formatTime(TOTAL_DURATION)}</span>
            </div>
          </div>

          {/* Quick 3-Step Markers */}
          <div className="hidden sm:flex items-center gap-1">
            <button
              onClick={() => jumpToTime(0)}
              className={`px-2 py-0.5 rounded text-[10px] transition cursor-pointer ${
                currentScene === 1 ? 'bg-blue-500/20 text-blue-300 border border-blue-500/40' : 'text-slate-500 hover:text-slate-300'
              }`}
            >
              Overview
            </button>
            <button
              onClick={() => jumpToTime(5)}
              className={`px-2 py-0.5 rounded text-[10px] transition cursor-pointer ${
                currentScene === 2 ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40' : 'text-slate-500 hover:text-slate-300'
              }`}
            >
              1. Scan
            </button>
            <button
              onClick={() => jumpToTime(18)}
              className={`px-2 py-0.5 rounded text-[10px] transition cursor-pointer ${
                currentScene === 3 ? 'bg-indigo-500/20 text-indigo-300 border border-indigo-500/40' : 'text-slate-500 hover:text-slate-300'
              }`}
            >
              2. Upload
            </button>
            <button
              onClick={() => jumpToTime(27)}
              className={`px-2 py-0.5 rounded text-[10px] transition cursor-pointer ${
                currentScene === 4 ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40' : 'text-slate-500 hover:text-slate-300'
              }`}
            >
              3. View
            </button>
            <button
              onClick={() => jumpToTime(35)}
              className={`px-2 py-0.5 rounded text-[10px] transition cursor-pointer ${
                currentScene === 5 ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40' : 'text-slate-500 hover:text-slate-300'
              }`}
            >
              Pre-Register
            </button>
          </div>

          {/* Voiceover, Mute & Fullscreen */}
          <div className="flex items-center gap-2">
            {/* British Voiceover Toggle */}
            <button
              onClick={toggleVoiceover}
              className={`px-2 py-1 rounded-lg border text-xs font-mono flex items-center gap-1.5 transition cursor-pointer ${
                isVoiceoverEnabled
                  ? 'bg-cyan-500/20 border-cyan-500/50 text-cyan-300 hover:bg-cyan-500/30'
                  : 'bg-slate-900 border-slate-700 text-slate-500 hover:text-slate-300'
              }`}
              title="Toggle British Voiceover"
            >
              <Mic className="w-3.5 h-3.5" />
              <span className="text-[10px] font-bold">
                🇬🇧 Voiceover: {isVoiceoverEnabled ? 'ON' : 'OFF'}
              </span>
            </button>

            {/* Sound Mute/Unmute */}
            <button
              onClick={() => {
                const nextMuted = !isMuted;
                setIsMuted(nextMuted);
                if (nextMuted) {
                  if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
                    window.speechSynthesis.cancel();
                  }
                } else {
                  playSoundEffect('chime');
                  if (isPlaying && isVoiceoverEnabled) {
                    speakBritishVoiceover(currentScene);
                  }
                }
              }}
              className="p-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 text-slate-300 hover:text-white border border-slate-700 transition cursor-pointer flex items-center gap-1"
              title={isMuted ? 'Unmute Sound' : 'Mute Sound'}
            >
              {isMuted ? <VolumeX className="w-3.5 h-3.5 text-slate-500" /> : <Volume2 className="w-3.5 h-3.5 text-cyan-400" />}
            </button>

            {/* Fullscreen */}
            <button
              onClick={toggleFullscreen}
              className="p-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 text-slate-300 hover:text-white border border-slate-700 transition cursor-pointer"
              title="Toggle Fullscreen"
            >
              {isFullscreen ? <Minimize2 className="w-3.5 h-3.5" /> : <Maximize2 className="w-3.5 h-3.5" />}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
