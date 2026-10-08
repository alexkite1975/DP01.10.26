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
  Zap
} from 'lucide-react';

interface TachoScanMarketingVideoProps {
  onPreRegisterClick?: () => void;
}

export const TachoScanMarketingVideo: React.FC<TachoScanMarketingVideoProps> = ({
  onPreRegisterClick
}) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [isMuted, setIsMuted] = useState(true);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const audioCtxRef = useRef<AudioContext | null>(null);

  const TOTAL_DURATION = 40; // 40 seconds exact

  // Sound Synthesizer via Web Audio API
  const playSoundEffect = (type: 'laser' | 'shutter' | 'chime' | 'alert') => {
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
        osc.frequency.exponentialRampToValueAtTime(200, now + 0.25);
        gain.gain.setValueAtTime(0.08, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.25);
        osc.start(now);
        osc.stop(now + 0.25);
      } else if (type === 'shutter') {
        osc.type = 'square';
        osc.frequency.setValueAtTime(400, now);
        osc.frequency.setValueAtTime(150, now + 0.05);
        gain.gain.setValueAtTime(0.1, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.12);
        osc.start(now);
        osc.stop(now + 0.12);
      } else if (type === 'chime') {
        osc.type = 'sine';
        osc.frequency.setValueAtTime(523.25, now); // C5
        osc.frequency.setValueAtTime(659.25, now + 0.1); // E5
        osc.frequency.setValueAtTime(783.99, now + 0.2); // G5
        gain.gain.setValueAtTime(0.12, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.45);
        osc.start(now);
        osc.stop(now + 0.45);
      } else if (type === 'alert') {
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(350, now);
        gain.gain.setValueAtTime(0.1, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.3);
        osc.start(now);
        osc.stop(now + 0.3);
      }
    } catch (e) {
      // audio failed or blocked
    }
  };

  // Playback Loop
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isPlaying) {
      interval = setInterval(() => {
        setCurrentTime((prev) => {
          if (prev >= TOTAL_DURATION) {
            setIsPlaying(false);
            return TOTAL_DURATION;
          }
          const next = +(prev + 0.1).toFixed(1);

          // Audio triggers at specific milestones
          if (Math.abs(next - 8.5) < 0.08) playSoundEffect('shutter');
          if (Math.abs(next - 10.0) < 0.08) playSoundEffect('laser');
          if (Math.abs(next - 18.5) < 0.08) playSoundEffect('chime');
          if (Math.abs(next - 28.5) < 0.08) playSoundEffect('alert');
          if (Math.abs(next - 35.5) < 0.08) playSoundEffect('chime');

          return next;
        });
      }, 100);
    }
    return () => clearInterval(interval);
  }, [isPlaying, isMuted]);

  const togglePlay = () => {
    if (currentTime >= TOTAL_DURATION) {
      setCurrentTime(0);
      setIsPlaying(true);
    } else {
      setIsPlaying(!isPlaying);
    }
  };

  const handleRestart = () => {
    setCurrentTime(0);
    setIsPlaying(true);
  };

  const jumpToTime = (seconds: number) => {
    setCurrentTime(seconds);
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

  // Scene definitions
  const currentScene =
    currentTime < 8
      ? 1
      : currentTime < 18
      ? 2
      : currentTime < 28
      ? 3
      : currentTime < 35
      ? 4
      : 5;

  return (
    <div
      ref={containerRef}
      className={`relative w-full rounded-3xl overflow-hidden bg-slate-950 border border-slate-800 shadow-2xl group flex flex-col ${
        isFullscreen ? 'h-screen w-screen rounded-none' : 'aspect-[16/9] min-h-[360px] sm:min-h-[480px]'
      }`}
    >
      {/* ===================================================================== */}
      {/* STAGE SCREEN (CINEMATIC SCENES)                                       */}
      {/* ===================================================================== */}
      <div className="relative flex-1 w-full overflow-hidden flex items-center justify-center select-none bg-gradient-to-b from-slate-900 via-slate-950 to-slate-950">
        {/* Background Grid Pattern */}
        <div className="absolute inset-0 bg-cockpit-grid opacity-30 pointer-events-none" />

        {/* Ambient Glows depending on active scene */}
        {currentScene === 1 && (
          <div className="absolute inset-0 bg-red-950/20 animate-pulse pointer-events-none" />
        )}
        {currentScene === 2 && (
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-cyan-500/15 rounded-full blur-[100px] pointer-events-none" />
        )}
        {currentScene === 3 && (
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-emerald-500/15 rounded-full blur-[100px] pointer-events-none" />
        )}
        {currentScene === 4 && (
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-amber-500/15 rounded-full blur-[100px] pointer-events-none" />
        )}
        {currentScene === 5 && (
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-blue-600/20 rounded-full blur-[120px] pointer-events-none" />
        )}

        {/* Scene 1: The Problem (00:00 - 00:08) */}
        {currentScene === 1 && (
          <div className="absolute inset-0 p-6 sm:p-12 flex flex-col justify-between items-center text-center animate-in fade-in duration-500">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-rose-500/20 border border-rose-500/40 text-rose-300 text-xs font-mono font-bold tracking-wider">
              <AlertTriangle className="w-3.5 h-3.5" />
              <span>THE HGV DRIVER REALITY</span>
            </div>

            <div className="max-w-xl space-y-4">
              <h2 className="text-2xl sm:text-4xl font-black text-white leading-tight">
                Tachograph Rules Shouldn't Put Your Licence at Risk
              </h2>
              <p className="text-xs sm:text-base text-slate-300 font-sans leading-relaxed">
                Fading thermal paper rolls, 15-hour shift spread limits, and roadside DVSA scrutiny make end-of-shift compliance a constant headache.
              </p>

              {/* Problem Pills */}
              <div className="flex flex-wrap justify-center gap-2 pt-2">
                <span className="px-3 py-1 rounded-lg bg-slate-900 border border-rose-500/30 text-rose-300 text-xs font-mono">
                  ❌ Fading Thermal Rolls
                </span>
                <span className="px-3 py-1 rounded-lg bg-slate-900 border border-rose-500/30 text-rose-300 text-xs font-mono">
                  ❌ Complex Spread-Over Limits
                </span>
                <span className="px-3 py-1 rounded-lg bg-slate-900 border border-rose-500/30 text-rose-300 text-xs font-mono">
                  ❌ Roadside DVSA Fines
                </span>
              </div>
            </div>

            <div className="text-[11px] font-mono text-slate-400">
              There is a faster, safer way for British drivers.
            </div>
          </div>
        )}

        {/* Scene 2: Universal AI Scan (00:08 - 00:18) */}
        {currentScene === 2 && (
          <div className="absolute inset-0 p-4 sm:p-8 flex flex-col justify-between items-center text-center animate-in fade-in duration-500">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/20 border border-cyan-500/40 text-cyan-300 text-xs font-mono font-bold">
              <Camera className="w-3.5 h-3.5" />
              <span>STEP 1 • NEURAL THERMAL SCAN</span>
            </div>

            {/* Simulated Phone Camera Scanning Viewfinder */}
            <div className="relative w-72 sm:w-80 h-44 sm:h-52 rounded-2xl bg-slate-900/90 border-2 border-cyan-400/80 p-3 shadow-glow-blue flex flex-col justify-between overflow-hidden">
              {/* Animated Laser Scanning Line */}
              <div className="absolute top-0 left-0 right-0 h-1 bg-cyan-400 shadow-[0_0_12px_#22d3ee] animate-bounce" />

              {/* Simulated Thermal Printout Content */}
              <div className="font-mono text-[9px] sm:text-[10px] text-left text-slate-300 space-y-1">
                <div className="flex justify-between border-b border-slate-700 pb-1 text-cyan-300 font-bold">
                  <span>STONERIDGE SE5000 GEN 2</span>
                  <span>14/10/2026 UTC</span>
                </div>
                <div className="flex justify-between items-center bg-cyan-500/10 px-1.5 py-0.5 rounded">
                  <span>☸ DRIVE TOTAL:</span>
                  <span className="text-cyan-300 font-bold">04h 28m</span>
                </div>
                <div className="flex justify-between items-center px-1.5">
                  <span>⚒ OTHER WORK:</span>
                  <span className="text-slate-300">02h 15m</span>
                </div>
                <div className="flex justify-between items-center px-1.5">
                  <span>⊡ POA:</span>
                  <span className="text-slate-400">00h 45m</span>
                </div>
                <div className="flex justify-between items-center bg-emerald-500/10 px-1.5 py-0.5 rounded">
                  <span>🛌 REST TAKEN:</span>
                  <span className="text-emerald-300 font-bold">11h 12m</span>
                </div>
              </div>

              <div className="flex justify-between items-center text-[10px] font-mono text-cyan-300 border-t border-slate-800 pt-1">
                <span>OCR: 99.8% VERIFIED</span>
                <span className="bg-cyan-500 text-slate-950 px-1.5 py-0.5 rounded font-black text-[9px]">
                  CAB CLOCK BST (+1H)
                </span>
              </div>
            </div>

            <div className="space-y-1">
              <h3 className="text-xl sm:text-2xl font-black text-white">
                Snap Any Thermal Printout in 2 Seconds
              </h3>
              <p className="text-xs sm:text-sm text-slate-300 max-w-lg">
                Universal OCR works with Stoneridge, Continental VDO &amp; Actia rolls. Anti-glare filtering for dim cab lighting.
              </p>
            </div>
          </div>
        )}

        {/* Scene 3: 28-Day Statutory DVSA Matrix (00:18 - 00:28) */}
        {currentScene === 3 && (
          <div className="absolute inset-0 p-4 sm:p-8 flex flex-col justify-between items-center text-center animate-in fade-in duration-500">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 text-xs font-mono font-bold">
              <Calendar className="w-3.5 h-3.5" />
              <span>STEP 2 • STATUTORY 28-DAY DVSA MATRIX</span>
            </div>

            {/* Simulated 28-Day Matrix Grid */}
            <div className="max-w-md w-full bg-slate-900/90 rounded-2xl border border-emerald-500/40 p-3 sm:p-4 space-y-2.5 shadow-2xl">
              <div className="flex justify-between items-center text-xs font-mono">
                <span className="text-white font-bold">28-DAY AUDIT LEDGER</span>
                <span className="text-emerald-400 font-bold bg-emerald-500/20 px-2 py-0.5 rounded-full border border-emerald-500/30">
                  100% DVSA Ready
                </span>
              </div>

              {/* 4-Week Mini Cells */}
              <div className="grid grid-cols-7 gap-1">
                {Array.from({ length: 28 }).map((_, i) => (
                  <div
                    key={i}
                    className={`h-6 sm:h-7 rounded flex items-center justify-center font-mono text-[9px] font-bold ${
                      i === 27
                        ? 'bg-cyan-500 text-slate-950 ring-2 ring-cyan-300 animate-pulse'
                        : i % 7 === 5 || i % 7 === 6
                        ? 'bg-slate-800 text-slate-400'
                        : 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                    }`}
                  >
                    {i === 27 ? 'NOW' : i + 1}
                  </div>
                ))}
              </div>

              <div className="grid grid-cols-3 gap-2 text-[10px] font-mono border-t border-slate-800 pt-2">
                <div>
                  <div className="text-slate-400">Records Held</div>
                  <div className="text-white font-bold">28 / 28 Days</div>
                </div>
                <div>
                  <div className="text-slate-400">Fortnight Drive</div>
                  <div className="text-emerald-400 font-bold">78h 30m / 90h</div>
                </div>
                <div>
                  <div className="text-slate-400">Compliance</div>
                  <div className="text-emerald-400 font-bold">Zero Fines</div>
                </div>
              </div>
            </div>

            <div className="space-y-1">
              <h3 className="text-xl sm:text-2xl font-black text-white">
                EU Regulation 165/2014 Roadside Proof
              </h3>
              <p className="text-xs sm:text-sm text-slate-300 max-w-lg">
                Shows roadside enforcement officers your clean 4-week history in seconds. No more missing shifts or lost paper slips.
              </p>
            </div>
          </div>
        )}

        {/* Scene 4: Article 12 Defense & Macro Proof (00:28 - 00:35) */}
        {currentScene === 4 && (
          <div className="absolute inset-0 p-4 sm:p-8 flex flex-col justify-between items-center text-center animate-in fade-in duration-500">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/20 border border-amber-500/40 text-amber-300 text-xs font-mono font-bold">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>STEP 3 • LEGAL ARTICLE 12 DEFENSE</span>
            </div>

            {/* Simulated Article 12 Slip Card */}
            <div className="max-w-md w-full bg-slate-900/90 rounded-2xl border border-amber-500/40 p-4 space-y-2 text-left font-mono shadow-2xl">
              <div className="flex justify-between items-center text-xs border-b border-slate-800 pb-1.5">
                <span className="text-amber-400 font-bold flex items-center gap-1.5">
                  <FileText className="w-4 h-4" /> STATUTORY CONCESSION SLIP
                </span>
                <span className="text-[10px] text-slate-400">REG (EC) 561/2006 ART 12</span>
              </div>
              <div className="text-xs text-slate-200">
                <span className="text-slate-400">Cause:</span> Emergency Traffic Delay (M25 J16 - J18 Closed)
              </div>
              <div className="text-xs text-slate-200">
                <span className="text-slate-400">Action:</span> Reached Safe Parking at South Mimms Services
              </div>
              <div className="flex items-center justify-between text-[10px] text-emerald-400 border-t border-slate-800 pt-1.5">
                <span>✓ Digitally Timestamped</span>
                <span className="text-cyan-300">Macro Optical Photo Attached</span>
              </div>
            </div>

            <div className="space-y-1">
              <h3 className="text-xl sm:text-2xl font-black text-white">
                Protect Your Licence Against Unfair Infringements
              </h3>
              <p className="text-xs sm:text-sm text-slate-300 max-w-lg">
                Generate legitimate roadside defense slips for unavoidable delays, backed by macro photographic verification.
              </p>
            </div>
          </div>
        )}

        {/* Scene 5: Driver Pre-Register CTA (00:35 - 00:40) */}
        {currentScene === 5 && (
          <div className="absolute inset-0 p-6 sm:p-10 flex flex-col justify-between items-center text-center animate-in zoom-in-95 duration-500">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/20 border border-cyan-500/40 text-cyan-300 text-xs font-mono font-bold">
              <Sparkles className="w-3.5 h-3.5" />
              <span>DRIVER BETA NOW OPEN</span>
            </div>

            <div className="space-y-4 max-w-lg">
              <div className="w-14 h-14 mx-auto rounded-3xl bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center text-white font-black text-2xl shadow-glow-blue border border-cyan-400/40">
                DP
              </div>
              <h2 className="text-2xl sm:text-4xl font-black text-white tracking-tight">
                Be First in Line for Tacho-Scan AI
              </h2>
              <p className="text-xs sm:text-base text-slate-300 font-sans">
                Limited early access slots exclusively for UK Class 1 &amp; Class 2 commercial drivers. Free access for pilot drivers.
              </p>

              <button
                onClick={onPreRegisterClick}
                className="px-6 py-3 rounded-2xl bg-gradient-to-r from-cyan-500 via-blue-500 to-indigo-600 hover:from-cyan-400 hover:to-indigo-500 text-slate-950 font-black text-sm font-mono flex items-center justify-center gap-2 mx-auto shadow-glow-blue transition transform hover:scale-105 cursor-pointer"
              >
                <Truck className="w-4 h-4 text-slate-950" />
                <span>Pre-Register as a Driver Now</span>
                <ArrowRight className="w-4 h-4 text-slate-950" />
              </button>
            </div>

            <div className="text-[11px] font-mono text-slate-400">
              Built by British transport veterans for professional drivers.
            </div>
          </div>
        )}

        {/* Floating Play Overlay (when paused) */}
        {!isPlaying && currentTime < TOTAL_DURATION && (
          <button
            onClick={togglePlay}
            className="absolute inset-0 m-auto w-16 sm:w-20 h-16 sm:h-20 rounded-full bg-cyan-500/90 hover:bg-cyan-400 text-slate-950 flex items-center justify-center shadow-glow-blue transition transform hover:scale-110 cursor-pointer z-30"
            title="Play 40s Feature Video"
          >
            <Play className="w-8 sm:w-10 h-8 sm:h-10 fill-current translate-x-1" />
          </button>
        )}
      </div>

      {/* ===================================================================== */}
      {/* CONTROLS & TIMELINE DOCK (BOTTOM)                                     */}
      {/* ===================================================================== */}
      <div className="bg-slate-950/90 border-t border-slate-800 p-3 sm:p-4 space-y-2 z-20 backdrop-blur-md">
        {/* Scrubber Bar */}
        <div className="relative w-full h-2 bg-slate-800 rounded-full overflow-hidden cursor-pointer">
          <div
            className="absolute top-0 left-0 bottom-0 bg-gradient-to-r from-cyan-500 via-emerald-400 to-amber-400 rounded-full transition-all duration-100"
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

          {/* Quick Scene Markers */}
          <div className="hidden sm:flex items-center gap-1">
            <button
              onClick={() => jumpToTime(0)}
              className={`px-2 py-0.5 rounded text-[10px] transition ${
                currentScene === 1 ? 'bg-rose-500/20 text-rose-300 border border-rose-500/40' : 'text-slate-500 hover:text-slate-300'
              }`}
            >
              1. The Reality
            </button>
            <button
              onClick={() => jumpToTime(8)}
              className={`px-2 py-0.5 rounded text-[10px] transition ${
                currentScene === 2 ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40' : 'text-slate-500 hover:text-slate-300'
              }`}
            >
              2. AI Scan
            </button>
            <button
              onClick={() => jumpToTime(18)}
              className={`px-2 py-0.5 rounded text-[10px] transition ${
                currentScene === 3 ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40' : 'text-slate-500 hover:text-slate-300'
              }`}
            >
              3. 28-Day Matrix
            </button>
            <button
              onClick={() => jumpToTime(28)}
              className={`px-2 py-0.5 rounded text-[10px] transition ${
                currentScene === 4 ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40' : 'text-slate-500 hover:text-slate-300'
              }`}
            >
              4. Article 12
            </button>
            <button
              onClick={() => jumpToTime(35)}
              className={`px-2 py-0.5 rounded text-[10px] transition ${
                currentScene === 5 ? 'bg-blue-500/20 text-blue-300 border border-blue-500/40' : 'text-slate-500 hover:text-slate-300'
              }`}
            >
              5. Pre-Register
            </button>
          </div>

          {/* Sound & Fullscreen */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => {
                setIsMuted(!isMuted);
                if (isMuted) playSoundEffect('chime');
              }}
              className="p-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 text-slate-300 hover:text-white border border-slate-700 transition cursor-pointer flex items-center gap-1"
              title={isMuted ? 'Unmute Sound' : 'Mute Sound'}
            >
              {isMuted ? <VolumeX className="w-3.5 h-3.5 text-slate-500" /> : <Volume2 className="w-3.5 h-3.5 text-cyan-400" />}
              <span className="text-[10px]">{isMuted ? 'Muted' : 'Sound On'}</span>
            </button>

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
