'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
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
  Zap,
  Mic,
  CreditCard,
  UploadCloud,
  Check,
  Award,
  Globe,
  Share2,
  Sliders,
  BatteryCharging,
  TrendingUp,
  ChevronRight
} from 'lucide-react';

interface TachoScanMarketingVideoProps {
  onPreRegisterClick?: () => void;
}

// 5 Chapters - Total Duration: 70 seconds (14s average per scene)
export const TOTAL_VIDEO_DURATION = 70;

export const CHAPTER_TIMESTAMPS = {
  1: { start: 0, end: 15, title: '1. Quick Registration', sub: 'Just Licence Type' },
  2: { start: 15, end: 30, title: '2. Tacho Ingestion', sub: 'Scan & Card Reader' },
  3: { start: 30, end: 46, title: '3. Current Shift', sub: 'HUD & 24h Ribbon' },
  4: { start: 46, end: 60, title: '4. Future Shifts', sub: 'Availability & Bank' },
  5: { start: 60, end: 70, title: '5. Get Started', sub: 'Launch & Drive' }
};

// Natural Conversational British Female Voiceover Script
export const VOICEOVER_SCRIPTS: Record<number, string> = {
  1: "Hi there, and welcome to DrivePartners! Getting started is genuinely quick and simple. All you need to do is choose your licence category — whether that's Class 1 artic, Class 2 rigid, or seven-and-a-half tonne — pop in your contact details, and you're immediately in. No endless forms, and no unnecessary paperwork.",
  2: "When it comes to logging your shift, it couldn't be easier. Just hold your phone camera over your daily tachograph roll, and our smart scanner reads it in a flash — even in dim cab lighting. Or, if you prefer, simply plug in your favourite card reader to download your driver card directly.",
  3: "As soon as your shift is in, your cockpit displays your three golden numbers right at the top: how much driving time you've got left, your continuous driving countdown, and the exact time you can legally head out tomorrow. Plus, you can copy a clean shift summary straight into WhatsApp for dispatch with just one tap.",
  4: "Planning ahead? Tacho-Scan acts as your strategic co-pilot. Your flexibility bank keeps track of your ten-hour driving extensions and reduced daily rests, while the predictive clearance clock shows exactly when you're legal for upcoming work — completely protecting your weekly driving hours and your licence.",
  5: "It's clean, simple, and built by drivers, for drivers. Choose your licence type today, claim your early access beta pass, and take the stress out of your shifts."
};

export const TachoScanMarketingVideo: React.FC<TachoScanMarketingVideoProps> = ({
  onPreRegisterClick
}) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [isMuted, setIsMuted] = useState(false);
  const [isVoiceoverEnabled, setIsVoiceoverEnabled] = useState(true);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const audioCtxRef = useRef<AudioContext | null>(null);
  const lastSpokenSceneRef = useRef<number>(0);

  // Scene determination (1 to 5)
  const currentScene =
    currentTime < 15
      ? 1
      : currentTime < 30
      ? 2
      : currentTime < 46
      ? 3
      : currentTime < 60
      ? 4
      : 5;

  // Natural Conversational British Female Voiceover Synthesis using Web Speech API
  const speakBritishVoiceover = (sceneNum: number) => {
    if (!isVoiceoverEnabled || isMuted || typeof window === 'undefined' || !('speechSynthesis' in window)) {
      return;
    }

    try {
      window.speechSynthesis.cancel();
      const text = VOICEOVER_SCRIPTS[sceneNum];
      if (!text) return;

      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = 'en-GB';
      // Natural conversational cadence: unhurried, warm tone
      utterance.rate = 0.94;
      utterance.pitch = 1.0; // Completely natural human pitch (no robotic distortion)
      utterance.volume = 1.0;

      const voices = window.speechSynthesis.getVoices();

      // Prioritize natural/neural British female voices first:
      const naturalUkFemaleVoice =
        voices.find(
          (v) =>
            (v.lang === 'en-GB' || v.lang.includes('GB') || v.lang.startsWith('en_GB')) &&
            (v.name.toLowerCase().includes('natural') || v.name.toLowerCase().includes('neural') || v.name.toLowerCase().includes('online')) &&
            !v.name.toLowerCase().includes('male')
        ) ||
        voices.find(
          (v) =>
            (v.lang === 'en-GB' || v.lang.includes('GB') || v.lang.startsWith('en_GB')) &&
            (v.name.toLowerCase().includes('libby') ||
              v.name.toLowerCase().includes('sonia') ||
              v.name.toLowerCase().includes('maisie') ||
              v.name.toLowerCase().includes('hazel') ||
              v.name.toLowerCase().includes('victoria') ||
              v.name.toLowerCase().includes('serena') ||
              v.name.toLowerCase().includes('kate') ||
              v.name.toLowerCase().includes('martha'))
        ) ||
        voices.find(
          (v) =>
            (v.lang === 'en-GB' || v.lang.includes('GB') || v.lang.startsWith('en_GB')) &&
            v.name.toLowerCase().includes('female')
        ) ||
        voices.find((v) => v.name.toLowerCase().includes('google uk english female')) ||
        voices.find((v) => (v.lang === 'en-GB' || v.lang.includes('GB')) && !v.name.toLowerCase().includes('male')) ||
        voices.find((v) => v.lang === 'en-GB' || v.lang.includes('GB')) ||
        voices.find((v) => v.lang.startsWith('en') && v.name.toLowerCase().includes('female')) ||
        voices.find((v) => v.lang.startsWith('en'));

      if (naturalUkFemaleVoice) {
        utterance.voice = naturalUkFemaleVoice;
      }

      setIsSpeaking(true);
      utterance.onend = () => setIsSpeaking(false);
      utterance.onerror = () => setIsSpeaking(false);

      window.speechSynthesis.speak(utterance);
    } catch (e) {
      console.warn('Speech synthesis unavailable', e);
      setIsSpeaking(false);
    }
  };

  // Keep voices primed on mobile and desktop
  useEffect(() => {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      window.speechSynthesis.onvoiceschanged = () => {
        window.speechSynthesis.getVoices();
      };
    }
  }, []);

  // Web Audio SFX
  const playSoundEffect = (type: 'laser' | 'shutter' | 'chime' | 'beep' | 'success') => {
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
        osc.frequency.setValueAtTime(850, now);
        osc.frequency.exponentialRampToValueAtTime(240, now + 0.35);
        gain.gain.setValueAtTime(0.06, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.35);
        osc.start(now);
        osc.stop(now + 0.35);
      } else if (type === 'shutter') {
        osc.type = 'square';
        osc.frequency.setValueAtTime(420, now);
        osc.frequency.setValueAtTime(160, now + 0.05);
        gain.gain.setValueAtTime(0.08, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.12);
        osc.start(now);
        osc.stop(now + 0.12);
      } else if (type === 'chime') {
        osc.type = 'sine';
        osc.frequency.setValueAtTime(523.25, now);
        osc.frequency.setValueAtTime(659.25, now + 0.08);
        osc.frequency.setValueAtTime(783.99, now + 0.16);
        gain.gain.setValueAtTime(0.08, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.45);
        osc.start(now);
        osc.stop(now + 0.45);
      } else if (type === 'beep') {
        osc.type = 'sine';
        osc.frequency.setValueAtTime(880, now);
        gain.gain.setValueAtTime(0.05, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.12);
        osc.start(now);
        osc.stop(now + 0.12);
      } else if (type === 'success') {
        osc.type = 'sine';
        osc.frequency.setValueAtTime(440, now);
        osc.frequency.setValueAtTime(554.37, now + 0.1);
        osc.frequency.setValueAtTime(659.25, now + 0.2);
        osc.frequency.setValueAtTime(880, now + 0.3);
        gain.gain.setValueAtTime(0.08, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.6);
        osc.start(now);
        osc.stop(now + 0.6);
      }
    } catch (_e) {}
  };

  // Trigger Voiceover on scene transition
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
          if (prev >= TOTAL_VIDEO_DURATION) {
            setIsPlaying(false);
            setIsSpeaking(false);
            if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
              window.speechSynthesis.cancel();
            }
            return TOTAL_VIDEO_DURATION;
          }
          const next = +(prev + 0.1).toFixed(1);

          // Audio triggers aligned to animations
          if (Math.abs(next - 0.5) < 0.08) playSoundEffect('chime');
          if (Math.abs(next - 4.5) < 0.08) playSoundEffect('shutter');
          if (Math.abs(next - 8.5) < 0.08) playSoundEffect('beep');
          if (Math.abs(next - 15.5) < 0.08) playSoundEffect('laser');
          if (Math.abs(next - 21.0) < 0.08) playSoundEffect('beep');
          if (Math.abs(next - 30.5) < 0.08) playSoundEffect('chime');
          if (Math.abs(next - 46.5) < 0.08) playSoundEffect('chime');
          if (Math.abs(next - 60.5) < 0.08) playSoundEffect('success');

          return next;
        });
      }, 100);
    } else {
      setIsSpeaking(false);
      if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
        window.speechSynthesis.cancel();
      }
    }
    return () => clearInterval(interval);
  }, [isPlaying, isMuted]);

  const togglePlay = () => {
    if (currentTime >= TOTAL_VIDEO_DURATION) {
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
        lastSpokenSceneRef.current = 0;
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
      setIsSpeaking(false);
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

  const formatTime = (secs: number) => {
    const s = Math.floor(secs);
    const m = Math.floor(s / 60);
    const remainder = s % 60;
    return `${m.toString().padStart(2, '0')}:${remainder.toString().padStart(2, '0')}`;
  };

  // Dynamic Laser Position for Scene 2 (15s to 24s)
  const scanProgressPercent = Math.min(
    100,
    Math.max(0, ((currentTime - 15.5) / 8.5) * 100)
  );

  return (
    <div
      ref={containerRef}
      className={`relative w-full rounded-3xl overflow-hidden bg-slate-950 border border-slate-800 shadow-2xl group flex flex-col ${
        isFullscreen ? 'h-screen w-screen rounded-none' : 'aspect-[16/9] min-h-[440px] sm:min-h-[560px]'
      }`}
    >
      {/* ===================================================================== */}
      {/* CINEMATIC STAGE SCREEN                                                */}
      {/* ===================================================================== */}
      <div className="relative flex-1 w-full overflow-hidden flex items-center justify-center select-none bg-gradient-to-b from-slate-900 via-slate-950 to-slate-950">
        {/* Background Grid Pattern */}
        <div className="absolute inset-0 bg-cockpit-grid opacity-25 pointer-events-none" />

        {/* Ambient Glows per Scene */}
        {currentScene === 1 && (
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-emerald-500/15 rounded-full blur-[110px] pointer-events-none" />
        )}
        {currentScene === 2 && (
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-cyan-500/20 rounded-full blur-[110px] pointer-events-none" />
        )}
        {currentScene === 3 && (
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-purple-500/20 rounded-full blur-[110px] pointer-events-none" />
        )}
        {currentScene === 4 && (
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-amber-500/20 rounded-full blur-[110px] pointer-events-none" />
        )}
        {currentScene === 5 && (
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-emerald-500/25 rounded-full blur-[110px] pointer-events-none" />
        )}

        {/* TOP STATUS OVERLAY */}
        <div className="absolute top-3 left-4 right-4 flex items-center justify-between z-20 pointer-events-none">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
            <span className="text-[11px] font-mono font-bold text-white bg-slate-900/85 px-3 py-1 rounded-full border border-slate-700/80 backdrop-blur-md shadow">
              STEP-BY-STEP IN-CAB GUIDE
            </span>
            <span className="hidden sm:inline-block text-[10px] font-mono text-cyan-300 bg-cyan-950/70 border border-cyan-800 px-2 py-0.5 rounded-full">
              {CHAPTER_TIMESTAMPS[currentScene as keyof typeof CHAPTER_TIMESTAMPS].title}
            </span>
          </div>

          <div className="flex items-center gap-2">
            {isVoiceoverEnabled && !isMuted ? (
              <span className="text-[10px] font-mono text-emerald-300 bg-emerald-950/80 border border-emerald-500/40 px-2.5 py-1 rounded-full flex items-center gap-1.5 backdrop-blur-md">
                <span className={`w-1.5 h-1.5 rounded-full bg-emerald-400 ${isSpeaking ? 'animate-ping' : ''}`} />
                🇬🇧 British Female Voiceover
              </span>
            ) : null}
            <span className="text-[11px] font-mono font-bold text-cyan-400 bg-slate-900/85 px-2.5 py-1 rounded-full border border-slate-700/80 backdrop-blur-md shadow">
              {formatTime(currentTime)} / {formatTime(TOTAL_VIDEO_DURATION)}
            </span>
          </div>
        </div>

        {/* ================================================================= */}
        {/* CHAPTER 1: QUICK REGISTRATION & LICENCE TYPE (00:00 - 00:15)      */}
        {/* ================================================================= */}
        {currentScene === 1 && (
          <div className="absolute inset-0 p-4 sm:p-6 flex flex-col justify-between items-center text-center animate-in fade-in duration-300">
            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 text-xs font-mono font-bold mt-2">
              <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
              <span>STEP 1 • QUICK REGISTRATION • JUST YOUR LICENCE TYPE</span>
            </div>

            {/* Clean, Zero-Friction Pre-Registration Mockup */}
            <div className="w-full max-w-xl bg-slate-900/90 border border-slate-700/80 rounded-2xl p-4 sm:p-5 shadow-2xl backdrop-blur-md space-y-3.5 text-left font-mono">
              <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                <span className="text-xs text-white font-bold flex items-center gap-2">
                  <Truck className="w-4 h-4 text-cyan-400" />
                  <span>Choose Your Driving Entitlement</span>
                </span>
                <span className="text-[10px] text-emerald-400 bg-emerald-500/10 border border-emerald-500/30 px-2 py-0.5 rounded font-bold">
                  ✓ NO PAPERWORK
                </span>
              </div>

              {/* 4 Clean Licence Category Cards */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-center text-xs">
                <div className="p-2.5 rounded-xl bg-cyan-950/80 border-2 border-cyan-400 text-white shadow-lg shadow-cyan-500/20 flex flex-col items-center justify-center gap-1 transition">
                  <Check className="w-4 h-4 text-cyan-300" />
                  <span className="font-bold text-[11px]">Class 1 (C+E)</span>
                  <span className="text-[9px] text-cyan-300">Articulated 44t</span>
                </div>
                <div className="p-2.5 rounded-xl bg-slate-950/80 border border-slate-800 text-slate-400 flex flex-col items-center justify-center gap-1 opacity-70">
                  <span className="w-4 h-4 rounded-full border border-slate-700 text-[10px] flex items-center justify-center">2</span>
                  <span className="font-bold text-[11px]">Class 2</span>
                  <span className="text-[9px] text-slate-500">Rigid Cat C</span>
                </div>
                <div className="p-2.5 rounded-xl bg-slate-950/80 border border-slate-800 text-slate-400 flex flex-col items-center justify-center gap-1 opacity-70">
                  <span className="w-4 h-4 rounded-full border border-slate-700 text-[10px] flex items-center justify-center">3</span>
                  <span className="font-bold text-[11px]">7.5 Tonne</span>
                  <span className="text-[9px] text-slate-500">Cat C1</span>
                </div>
                <div className="p-2.5 rounded-xl bg-slate-950/80 border border-slate-800 text-slate-400 flex flex-col items-center justify-center gap-1 opacity-70">
                  <span className="w-4 h-4 rounded-full border border-slate-700 text-[10px] flex items-center justify-center">4</span>
                  <span className="font-bold text-[11px]">PSV / Coach</span>
                  <span className="text-[9px] text-slate-500">Cat D</span>
                </div>
              </div>

              {/* Quick Driver Profile Row */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-[11px]">
                <div className="p-2 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-between">
                  <span className="text-slate-400">Driver:</span>
                  <span className="text-white font-bold">Alexander James Kite</span>
                </div>
                <div className="p-2 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-between">
                  <span className="text-slate-400">Mobile:</span>
                  <span className="text-cyan-300 font-bold">+44 7700 900123</span>
                </div>
              </div>

              {/* Instant Priority Beta Pass Issued */}
              <div className="p-2.5 rounded-xl bg-emerald-950/50 border border-emerald-500/30 flex items-center justify-between text-xs">
                <span className="text-emerald-300 font-bold flex items-center gap-2">
                  <Award className="w-4 h-4 text-emerald-400" />
                  <span>Driver Priority Pass: DP-BETA-795</span>
                </span>
                <span className="text-emerald-400 font-bold text-[10px] bg-emerald-500/20 px-2 py-0.5 rounded">
                  QUEUE #183 • VERIFIED
                </span>
              </div>
            </div>

            <div className="space-y-0.5 max-w-lg mb-2">
              <h3 className="text-lg sm:text-xl font-black text-white">
                Simple, Instant Registration
              </h3>
              <p className="text-xs text-slate-300">
                Just choose your licence category, pop in your contact details, and you're ready for Tacho-Scan.
              </p>
            </div>
          </div>
        )}

        {/* ================================================================= */}
        {/* CHAPTER 2: TACHO-SCAN INGESTION (00:15 - 00:30)                   */}
        {/* ================================================================= */}
        {currentScene === 2 && (
          <div className="absolute inset-0 p-4 sm:p-6 flex flex-col justify-between items-center text-center animate-in fade-in duration-300">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/20 border border-cyan-500/40 text-cyan-300 text-xs font-mono font-bold mt-2">
              <Camera className="w-3.5 h-3.5" />
              <span>PHASE 2 • 2 FAST WAYS TO INGEST YOUR SHIFT</span>
            </div>

            {/* Dual Ingest Showcase */}
            <div className="w-full max-w-xl grid grid-cols-1 sm:grid-cols-2 gap-3 text-left font-mono">
              {/* Option A: Neural Thermal Scan */}
              <div className="relative bg-slate-950/90 rounded-2xl border-2 border-cyan-500/50 p-3 shadow-xl overflow-hidden text-[10px]">
                <div className="flex items-center justify-between text-cyan-400 font-bold pb-1.5 border-b border-slate-800">
                  <span className="flex items-center gap-1.5">
                    <Camera className="w-3.5 h-3.5" /> OPTION 1: THERMAL SCAN
                  </span>
                  <span className="text-[9px] px-1.5 py-0.5 rounded bg-cyan-950 text-cyan-300">CAMERA OCR</span>
                </div>

                {/* Mini Receipt with laser */}
                <div className="relative bg-white text-slate-900 rounded p-2 mt-2 leading-tight max-h-[110px] overflow-hidden text-[9px]">
                  <div
                    className="absolute left-0 right-0 h-1 bg-cyan-400 shadow-[0_0_12px_#22d3ee] z-20 pointer-events-none"
                    style={{ top: `${scanProgressPercent}%` }}
                  />
                  <div className="font-bold border-b border-slate-300 pb-0.5 text-center">
                    --- 24h DAILY PRINTOUT ---
                  </div>
                  <div className="py-0.5 text-slate-700">
                    <div>DATE: 2026-10-08 19:29 UTC</div>
                    <div>DRIVER: KITE ALEXANDER</div>
                    <div>VEHICLE: SJ70 HFR (VOLVO FH)</div>
                    <div className="text-emerald-700 font-bold">DRIVE: 08h 42m | REST: 11h 12m</div>
                    <div>ODO: 413,280 km (END OF SHIFT)</div>
                  </div>
                </div>

                <div className="flex items-center justify-between pt-2 text-[10px] text-cyan-300">
                  <span>Stoneridge &amp; VDO Supported</span>
                  <span className="text-emerald-400 font-bold">99.8% Neural Acc</span>
                </div>
              </div>

              {/* Option B: Any Smart Card Reader */}
              <div className="bg-slate-900/90 rounded-2xl border border-indigo-500/40 p-3 shadow-xl flex flex-col justify-between text-[10px]">
                <div>
                  <div className="flex items-center justify-between text-indigo-300 font-bold pb-1.5 border-b border-slate-800">
                    <span className="flex items-center gap-1.5">
                      <CreditCard className="w-3.5 h-3.5 text-indigo-400" /> OPTION 2: CARD READER
                    </span>
                    <span className="text-[9px] px-1.5 py-0.5 rounded bg-indigo-950 text-indigo-300">DIRECT .DDD</span>
                  </div>

                  <div className="p-3 my-2 rounded-xl bg-slate-950 border border-slate-800 space-y-1.5">
                    <div className="flex items-center gap-2 text-white font-bold text-xs">
                      <Zap className="w-4 h-4 text-cyan-400" />
                      <span>Use Any £10 CCID Reader</span>
                    </div>
                    <p className="text-[9px] text-slate-400 leading-normal">
                      Plug any standard USB-C or Bluetooth smart card reader into your phone. Direct microchip download in 4 seconds.
                    </p>
                    <div className="text-[9px] text-emerald-400 font-mono font-bold">
                      ✓ Extracts 0x0520 &amp; 0x0504 Files
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-between text-[10px] text-slate-400 border-t border-slate-800 pt-1.5">
                  <span>Ground Truth Lock</span>
                  <span className="text-emerald-400 font-bold">Tamper-Proof</span>
                </div>
              </div>
            </div>

            <div className="space-y-0.5 max-w-lg mb-2">
              <h3 className="text-lg sm:text-xl font-black text-white">
                Scan Your Paper Roll or Download Your Card
              </h3>
              <p className="text-xs text-slate-300">
                Point your phone camera at your daily receipt under cab lighting, or connect any standard card reader of your choice.
              </p>
            </div>
          </div>
        )}

        {/* ================================================================= */}
        {/* CHAPTER 3: WHAT YOU SEE ABOUT YOUR CURRENT SHIFT (00:30 - 00:46)  */}
        {/* ================================================================= */}
        {currentScene === 3 && (
          <div className="absolute inset-0 p-4 sm:p-6 flex flex-col justify-between items-center text-center animate-in fade-in duration-300">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-500/20 border border-purple-500/40 text-purple-300 text-xs font-mono font-bold mt-2">
              <Truck className="w-3.5 h-3.5" />
              <span>PHASE 3 • WHAT YOU SEE: COCKPIT HUD &amp; 24H RIBBON</span>
            </div>

            {/* Shift Breakdown Display */}
            <div className="w-full max-w-xl bg-slate-900/90 rounded-2xl border border-purple-500/40 p-3.5 space-y-2.5 font-mono shadow-2xl text-left">
              {/* Header */}
              <div className="flex items-center justify-between text-xs border-b border-slate-800 pb-1.5">
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                  <span className="text-white font-bold">ACTIVE SHIFT COCKPIT HUD</span>
                  <span className="text-[10px] text-cyan-400">SJ70 HFR</span>
                </div>
                <span className="text-emerald-400 font-bold text-[10px] bg-emerald-500/20 px-2 py-0.5 rounded">
                  ✓ 100% COMPLIANT
                </span>
              </div>

              {/* 3 Golden Numbers */}
              <div className="grid grid-cols-3 gap-2 text-center">
                <div className="p-2 rounded-xl bg-slate-950 border border-slate-800">
                  <div className="text-[9px] text-slate-400 uppercase">Drive Left</div>
                  <div className="text-sm sm:text-base font-black text-amber-300">0h 18m</div>
                  <div className="text-[8px] text-slate-500">of 9h 00m cap</div>
                </div>
                <div className="p-2 rounded-xl bg-slate-950 border border-slate-800">
                  <div className="text-[9px] text-slate-400 uppercase">Continuous</div>
                  <div className="text-sm sm:text-base font-black text-emerald-400">4h 30m</div>
                  <div className="text-[8px] text-emerald-500">Break reset clean</div>
                </div>
                <div className="p-2 rounded-xl bg-slate-950 border border-slate-800">
                  <div className="text-[9px] text-slate-400 uppercase">Next Start</div>
                  <div className="text-sm sm:text-base font-black text-cyan-300">04:26 UTC</div>
                  <div className="text-[8px] text-slate-500">11h rest done</div>
                </div>
              </div>

              {/* Interactive 24-Hour Tacho Ribbon Simulation */}
              <div className="space-y-1">
                <div className="flex justify-between text-[10px] text-slate-400">
                  <span>Interactive 24-Hour Activity Ribbon:</span>
                  <span className="text-cyan-300">06:16 - 17:26 UTC (478 km)</span>
                </div>
                <div className="h-4 w-full rounded-md overflow-hidden flex border border-slate-700 bg-slate-950">
                  <div className="w-[20%] bg-emerald-600/80" title="Rest 00:00-06:00" />
                  <div className="w-[5%] bg-amber-500" title="Work 06:00-06:30" />
                  <div className="w-[28%] bg-cyan-500" title="Drive 06:30-09:45" />
                  <div className="w-[6%] bg-emerald-500" title="Break 09:45-10:30" />
                  <div className="w-[25%] bg-cyan-500" title="Drive 10:30-15:45" />
                  <div className="w-[6%] bg-purple-500" title="POA 15:45-16:30" />
                  <div className="w-[10%] bg-emerald-600/80" title="Rest 16:30-24:00" />
                </div>
                <div className="flex justify-between text-[8px] text-slate-500">
                  <span>00:00</span>
                  <span className="text-cyan-400">Cyan: Drive</span>
                  <span className="text-amber-400">Amber: Work</span>
                  <span className="text-purple-400">Purple: POA</span>
                  <span className="text-emerald-400">Green: Rest</span>
                  <span>24:00</span>
                </div>
              </div>

              {/* Actions: WhatsApp + Art 12 Defense */}
              <div className="grid grid-cols-2 gap-2 pt-1">
                <div className="p-2 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-between text-[10px]">
                  <span className="text-slate-300 flex items-center gap-1.5">
                    <Share2 className="w-3 h-3 text-cyan-400" /> WhatsApp Report
                  </span>
                  <span className="text-emerald-400 font-bold">1-Tap Copy</span>
                </div>
                <div className="p-2 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-between text-[10px]">
                  <span className="text-slate-300 flex items-center gap-1.5">
                    <ShieldCheck className="w-3 h-3 text-amber-400" /> Article 12 Defense
                  </span>
                  <span className="text-amber-300 font-bold">Attached</span>
                </div>
              </div>
            </div>

            <div className="space-y-0.5 max-w-lg mb-2">
              <h3 className="text-lg sm:text-xl font-black text-white">
                Live Shift Cockpit &amp; Minute-by-Minute Trace
              </h3>
              <p className="text-xs text-slate-300">
                Inspect your 3 Golden Numbers, 24-hour colour-coded ribbon, circadian recovery, and share clean WhatsApp timesheets in seconds.
              </p>
            </div>
          </div>
        )}

        {/* ================================================================= */}
        {/* CHAPTER 4: FUTURE SHIFTS & AVAILABILITY (00:46 - 00:60)            */}
        {/* ================================================================= */}
        {currentScene === 4 && (
          <div className="absolute inset-0 p-4 sm:p-6 flex flex-col justify-between items-center text-center animate-in fade-in duration-300">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/20 border border-amber-500/40 text-amber-300 text-xs font-mono font-bold mt-2">
              <Calendar className="w-3.5 h-3.5" />
              <span>PHASE 4 • FUTURE SHIFT AVAILABILITY &amp; STRATEGY</span>
            </div>

            {/* Strategic Bank & Availability View */}
            <div className="w-full max-w-xl bg-slate-900/90 rounded-2xl border border-amber-500/40 p-3.5 space-y-2.5 font-mono shadow-2xl text-left">
              <div className="flex items-center justify-between text-xs border-b border-slate-800 pb-1.5">
                <span className="text-white font-bold flex items-center gap-1.5">
                  <BatteryCharging className="w-4 h-4 text-amber-400" /> DRIVER FLEXIBILITY BANK
                </span>
                <span className="text-amber-300 font-bold text-[10px] bg-amber-500/20 px-2 py-0.5 rounded">
                  EC 561/2006 CO-PILOT
                </span>
              </div>

              {/* Flexibility Tokens */}
              <div className="grid grid-cols-2 gap-2 text-xs">
                <div className="p-2.5 rounded-xl bg-slate-950 border border-slate-800 space-y-1">
                  <div className="text-[10px] text-slate-400 flex items-center justify-between">
                    <span>10h Extended Drive:</span>
                    <span className="text-amber-300 font-bold">2 / 2 Left</span>
                  </div>
                  <div className="flex gap-1.5 pt-0.5">
                    <span className="px-2 py-0.5 rounded bg-amber-500/20 text-amber-400 border border-amber-500/40 text-[9px] font-bold">
                      TOKEN 1 AVAILABLE
                    </span>
                    <span className="px-2 py-0.5 rounded bg-amber-500/20 text-amber-400 border border-amber-500/40 text-[9px] font-bold">
                      TOKEN 2 AVAILABLE
                    </span>
                  </div>
                </div>

                <div className="p-2.5 rounded-xl bg-slate-950 border border-slate-800 space-y-1">
                  <div className="text-[10px] text-slate-400 flex items-center justify-between">
                    <span>9h Reduced Daily Rest:</span>
                    <span className="text-emerald-400 font-bold">3 / 3 Left</span>
                  </div>
                  <div className="flex gap-1 pt-0.5">
                    <span className="px-1.5 py-0.5 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 text-[9px] font-bold">
                      R1
                    </span>
                    <span className="px-1.5 py-0.5 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 text-[9px] font-bold">
                      R2
                    </span>
                    <span className="px-1.5 py-0.5 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 text-[9px] font-bold">
                      R3
                    </span>
                  </div>
                </div>
              </div>

              {/* Weekly & Fortnightly Fuel Tank Gauges */}
              <div className="space-y-1.5 text-[10px]">
                <div className="flex justify-between text-slate-300">
                  <span>Weekly Drive Cap (56h):</span>
                  <span className="text-cyan-400 font-bold">28h 45m used (27h 15m remaining capacity)</span>
                </div>
                <div className="h-2 w-full bg-slate-800 rounded-full overflow-hidden">
                  <div className="h-full bg-cyan-500 w-[51%]" />
                </div>

                <div className="flex justify-between text-slate-300 pt-0.5">
                  <span>Fortnightly Drive Cap (90h):</span>
                  <span className="text-emerald-400 font-bold">54h 10m used (35h 50m remaining)</span>
                </div>
                <div className="h-2 w-full bg-slate-800 rounded-full overflow-hidden">
                  <div className="h-full bg-emerald-500 w-[60%]" />
                </div>
              </div>

              {/* Predictive Shift Clearance Callout */}
              <div className="p-2.5 rounded-xl bg-cyan-950/50 border border-cyan-500/30 flex items-center justify-between text-xs">
                <div>
                  <span className="text-[10px] text-cyan-300 block">EARLIEST LEGAL AVAILABILITY</span>
                  <strong className="text-white text-sm">Tomorrow at 04:26 UTC</strong>
                </div>
                <span className="text-emerald-400 font-bold text-[10px] border border-emerald-500/40 bg-emerald-500/10 px-2 py-1 rounded-lg">
                  ✓ 11h Rest Cleared
                </span>
              </div>
            </div>

            <div className="space-y-0.5 max-w-lg mb-2">
              <h3 className="text-lg sm:text-xl font-black text-white">
                Predictive Shift Clearance &amp; Flexibility Bank
              </h3>
              <p className="text-xs text-slate-300">
                Track your 10h extensions, reduced rests, and weekly 56h allowances so you always know your exact legal availability for future high-earning shifts.
              </p>
            </div>
          </div>
        )}

        {/* ================================================================= */}
        {/* CHAPTER 5: READY TO DRIVE (00:60 - 00:70)                         */}
        {/* ================================================================= */}
        {currentScene === 5 && (
          <div className="absolute inset-0 p-6 sm:p-8 flex flex-col justify-center items-center text-center animate-in zoom-in-95 duration-300 space-y-4">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 text-xs font-mono font-bold">
              <Sparkles className="w-3.5 h-3.5" />
              <span>LIVE SYSTEM ACTIVE</span>
            </div>

            <div className="space-y-1.5 max-w-lg">
              <h2 className="text-2xl sm:text-4xl font-black text-white tracking-tight">
                Ready to Experience Tacho-Scan?
              </h2>
              <p className="text-xs sm:text-sm text-slate-300 font-sans">
                Protect your licence, eliminate tachograph guesswork, and prove every minute of duty.
              </p>
            </div>

            {/* Direct Action Buttons */}
            <div className="flex flex-col sm:flex-row items-center gap-3 w-full max-w-md pt-2">
              <Link
                href="/onboarding"
                className="w-full sm:flex-1 py-3.5 px-5 rounded-2xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black text-xs sm:text-sm font-mono flex items-center justify-center gap-2 shadow-lg shadow-emerald-500/20 transition transform hover:scale-105 cursor-pointer"
              >
                <ShieldCheck className="w-4 h-4 text-slate-950" />
                <span>Create Account &amp; Passport →</span>
              </Link>
              <Link
                href="/driver/tacho"
                className="w-full sm:flex-1 py-3.5 px-5 rounded-2xl bg-gradient-to-r from-amber-500 to-yellow-500 hover:from-amber-400 hover:to-yellow-400 text-slate-950 font-black text-xs sm:text-sm font-mono flex items-center justify-center gap-2 shadow-lg shadow-amber-500/20 transition transform hover:scale-105 cursor-pointer"
              >
                <Camera className="w-4 h-4 text-slate-950" />
                <span>Launch Tacho-Scan Live</span>
              </Link>
            </div>

            <div className="pt-1">
              <button
                onClick={onPreRegisterClick}
                className="text-xs font-mono text-cyan-400 hover:text-cyan-300 underline underline-offset-4 cursor-pointer"
              >
                Or join the Driver Beta Pre-Registration List ➔
              </button>
            </div>

            <div className="text-[11px] font-mono text-slate-400 pt-1">
              Statutory EU 561/2006 • UK Domestic Rules • Stoneridge &amp; VDO Compliant
            </div>
          </div>
        )}

        {/* ================================================================= */}
        {/* SUBTITLE NARRATION BAR (SYNCHRONIZED WITH BRITISH VOICEOVER)      */}
        {/* ================================================================= */}
        <div className="absolute bottom-3 left-4 right-4 z-20 pointer-events-none">
          <div className="max-w-2xl mx-auto px-4 py-2 rounded-2xl bg-slate-950/90 border border-slate-700/80 backdrop-blur-md shadow-2xl text-center">
            <div className="flex items-center justify-center gap-2 mb-0.5">
              <span className={`w-1.5 h-1.5 rounded-full bg-emerald-400 ${isSpeaking ? 'animate-ping' : ''}`} />
              <span className="text-[10px] font-mono uppercase tracking-wider text-slate-400 font-bold">
                British Female Voiceover
              </span>
            </div>
            <p className="text-xs sm:text-sm text-cyan-100 font-sans leading-relaxed">
              "{VOICEOVER_SCRIPTS[currentScene]}"
            </p>
          </div>
        </div>

        {/* Floating Play Overlay (when paused) */}
        {!isPlaying && currentTime < TOTAL_VIDEO_DURATION && (
          <button
            onClick={togglePlay}
            className="absolute inset-0 m-auto w-16 sm:w-20 h-16 sm:h-20 rounded-full bg-emerald-500/90 hover:bg-emerald-400 text-slate-950 flex items-center justify-center shadow-2xl transition transform hover:scale-110 cursor-pointer z-30"
            title="Play Interactive Step-by-Step Guide with British Female Voiceover"
          >
            <Play className="w-8 sm:w-10 h-8 sm:h-10 fill-current translate-x-1" />
          </button>
        )}
      </div>

      {/* ===================================================================== */}
      {/* CONTROLS & CHAPTER TIMELINE DOCK (BOTTOM)                             */}
      {/* ===================================================================== */}
      <div className="bg-slate-950/95 border-t border-slate-800 p-3 sm:p-4 space-y-2.5 z-20 backdrop-blur-md">
        {/* Scrubber Bar */}
        <div
          onClick={(e) => {
            const rect = e.currentTarget.getBoundingClientRect();
            const clickX = e.clientX - rect.left;
            const pct = Math.max(0, Math.min(1, clickX / rect.width));
            jumpToTime(+(pct * TOTAL_VIDEO_DURATION).toFixed(1));
          }}
          className="relative w-full h-2.5 bg-slate-800 rounded-full overflow-hidden cursor-pointer group/scrub"
        >
          <div
            className="absolute top-0 left-0 bottom-0 bg-gradient-to-r from-emerald-500 via-cyan-400 via-purple-400 to-amber-400 rounded-full transition-all duration-100"
            style={{ width: `${(currentTime / TOTAL_VIDEO_DURATION) * 100}%` }}
          />
        </div>

        {/* Chapter Buttons & Controls */}
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
              title="Restart Guide"
            >
              <RotateCcw className="w-3.5 h-3.5" />
            </button>

            <div className="text-slate-300 font-bold">
              <span className="text-emerald-400">{formatTime(currentTime)}</span>
              <span className="text-slate-500"> / {formatTime(TOTAL_VIDEO_DURATION)}</span>
            </div>
          </div>

          {/* 5 Chapter Pills */}
          <div className="hidden lg:flex items-center gap-1">
            {Object.entries(CHAPTER_TIMESTAMPS).map(([sceneKey, chapter]) => {
              const numKey = Number(sceneKey);
              const isSelected = currentScene === numKey;
              return (
                <button
                  key={sceneKey}
                  onClick={() => jumpToTime(chapter.start)}
                  className={`px-2.5 py-1 rounded-xl text-[10px] transition cursor-pointer flex items-center gap-1 ${
                    isSelected
                      ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/50 font-bold shadow'
                      : 'text-slate-400 hover:text-white bg-slate-900/60 border border-slate-800'
                  }`}
                >
                  <span>{chapter.title}</span>
                </button>
              );
            })}
          </div>

          {/* Voiceover, Mute & Fullscreen */}
          <div className="flex items-center gap-2">
            {/* British Female Voiceover Toggle */}
            <button
              onClick={toggleVoiceover}
              className={`px-2.5 py-1 rounded-xl border text-xs font-mono flex items-center gap-1.5 transition cursor-pointer ${
                isVoiceoverEnabled
                  ? 'bg-emerald-500/20 border-emerald-500/50 text-emerald-300 hover:bg-emerald-500/30'
                  : 'bg-slate-900 border-slate-700 text-slate-500 hover:text-slate-300'
              }`}
              title="Toggle British Female Voiceover"
            >
              <Mic className="w-3.5 h-3.5 text-emerald-400" />
              <span className="text-[10px] font-bold">
                🇬🇧 Voice: {isVoiceoverEnabled ? 'ON' : 'OFF'}
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
                  setIsSpeaking(false);
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
              {isMuted ? <VolumeX className="w-3.5 h-3.5 text-slate-500" /> : <Volume2 className="w-3.5 h-3.5 text-emerald-400" />}
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
