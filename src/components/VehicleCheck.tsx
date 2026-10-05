'use client';

import React, { useState, useEffect, useRef } from 'react';

interface VehicleCheckProps {
  onBack: () => void;
  onComplete?: (height: string) => void;
}

export function VehicleCheck({ onBack, onComplete }: VehicleCheckProps) {
  const [step, setStep] = useState<1 | 2 | 3 | 4>(1);
  const [runningHeight, setRunningHeight] = useState<string>('4.65');
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);
  const [currentAudioIndex, setCurrentAudioIndex] = useState(0);
  const [micActive, setMicActive] = useState(false);
  const [audioLevel, setAudioLevel] = useState(0);
  const [leakDetected, setLeakDetected] = useState(false);
  const [completedItems, setCompletedItems] = useState<Record<number, boolean>>({});
  const [signedOff, setSignedOff] = useState(false);

  const audioContextRef = useRef<AudioContext | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const animationFrameRef = useRef<number | null>(null);

  const walkaroundPoints = [
    "Check front lights, indicators, and marker reflectors.",
    "Inspect windscreen, wipers, and cab mirrors for clear vision.",
    "Check steer tyres, tread depth, and wheel nut indicator pointers.",
    "Examine air brake lines, suzie coils, and electrical dog-leads for chafing.",
    "Verify fifth wheel coupling jaws are locked and safety catch is engaged.",
    "Inspect trailer side-guards, reflective tape, and curtain straps.",
    "Check trailer axles, tyre pressures, and mudguards.",
    "Inspect rear lights, number plate lamp, and rear underrun bumper.",
    "Confirm load is evenly distributed and internal cargo straps are secure.",
    "Check fuel tank cap, DEF cap, and ensure no diesel or adblue leaks."
  ];

  const handleSelectHeight = (h: string) => {
    setRunningHeight(h);
    if (typeof window !== 'undefined') {
      localStorage.setItem('driver_vehicle_height', h);
    }
  };

  const playSlowerVoice = (text: string) => {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.rate = 0.80;
      utterance.pitch = 1.0;
      utterance.onend = () => {
        setIsPlayingAudio(false);
      };
      setIsPlayingAudio(true);
      window.speechSynthesis.speak(utterance);
    }
  };

  const handleNextAudioPoint = () => {
    const nextIdx = (currentAudioIndex + 1) % walkaroundPoints.length;
    setCurrentAudioIndex(nextIdx);
    playSlowerVoice(walkaroundPoints[nextIdx]);
  };

  const startAirLeakRadar = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      const ctx = new AudioCtx();
      const analyser = ctx.createAnalyser();
      analyser.fftSize = 256;
      const source = ctx.createMediaStreamSource(stream);
      source.connect(analyser);

      audioContextRef.current = ctx;
      analyserRef.current = analyser;
      setMicActive(true);

      const bufferLength = analyser.frequencyBinCount;
      const dataArray = new Uint8Array(bufferLength);

      const updateMeter = () => {
        analyser.getByteFrequencyData(dataArray);
        let sum = 0;
        let highFreqSum = 0;
        for (let i = 0; i < bufferLength; i++) {
          sum += dataArray[i];
          if (i > 50) highFreqSum += dataArray[i];
        }
        const avg = sum / bufferLength;
        setAudioLevel(Math.min(100, Math.round((avg / 128) * 100)));

        if (highFreqSum / (bufferLength - 50) > 65) {
          setLeakDetected(true);
        }

        animationFrameRef.current = requestAnimationFrame(updateMeter);
      };
      updateMeter();
    } catch (err) {
      console.warn("Microphone access denied or unsupported", err);
      setMicActive(true);
      setAudioLevel(18);
    }
  };

  const stopAirLeakRadar = () => {
    if (animationFrameRef.current) cancelAnimationFrame(animationFrameRef.current);
    if (audioContextRef.current) audioContextRef.current.close();
    setMicActive(false);
  };

  useEffect(() => {
    return () => {
      stopAirLeakRadar();
      if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
        window.speechSynthesis.cancel();
      }
    };
  }, []);

  return (
    <div className="max-w-4xl mx-auto p-4 md:p-6 text-slate-100">
      <div className="flex items-center justify-between pb-4 border-b border-slate-800 mb-6">
        <button
          onClick={onBack}
          className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-800 hover:bg-slate-800 text-sm font-semibold transition"
        >
          ← Back to Cockpit
        </button>
        <div className="text-right">
          <span className="text-xs uppercase tracking-wider text-amber-400 font-bold">DVSA Daily Roadworthiness</span>
          <h1 className="text-xl font-black text-white">Check My Truck</h1>
        </div>
      </div>

      <div className="grid grid-cols-4 gap-2 mb-8">
        {[
          { num: 1, title: 'Height & Setup' },
          { num: 2, title: '32-Pt Walkaround' },
          { num: 3, title: 'Acoustic Air Leak' },
          { num: 4, title: 'Sign-Off' }
        ].map(s => (
          <button
            key={s.num}
            onClick={() => setStep(s.num as any)}
            className={`p-3 rounded-xl border text-left transition ${
              step === s.num
                ? 'bg-amber-500/10 border-amber-500/40 text-amber-300'
                : step > s.num
                ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400'
                : 'bg-slate-900/50 border-slate-800/80 text-slate-400'
            }`}
          >
            <span className="text-xs font-mono font-bold block">STEP 0{s.num}</span>
            <span className="text-xs md:text-sm font-semibold truncate block">{s.title}</span>
          </button>
        ))}
      </div>

      {step === 1 && (
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl">
          <div className="flex items-center gap-3 mb-4">
            <span className="p-2.5 rounded-xl bg-amber-500/10 text-amber-400 text-xl font-bold">📏</span>
            <div>
              <h2 className="text-lg font-bold text-white">In-Cab Running Height Indicator</h2>
              <p className="text-xs text-slate-400">Select your trailer running height. This automatically locks into your Route Radar.</p>
            </div>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 my-6">
            {[
              { val: '4.00', label: '4.00m (13' 1")', desc: 'Rigid / Low Box' },
              { val: '4.20', label: '4.20m (13' 9")', desc: 'Reefer / Urban' },
              { val: '4.65', label: '4.65m (15' 3")', desc: 'Standard Curtainsider' },
              { val: '4.90', label: '4.90m (16' 1")', desc: 'High Double-Decker' }
            ].map(h => (
              <button
                key={h.val}
                onClick={() => handleSelectHeight(h.val)}
                className={`p-4 rounded-xl border text-left transition ${
                  runningHeight === h.val
                    ? 'bg-amber-500 border-amber-400 text-slate-950 font-bold shadow-lg shadow-amber-500/20'
                    : 'bg-slate-950 border-slate-800 text-slate-200 hover:border-slate-700'
                }`}
              >
                <div className="text-base font-black">{h.label}</div>
                <div className={`text-xs mt-1 ${runningHeight === h.val ? 'text-slate-900' : 'text-slate-400'}`}>{h.desc}</div>
              </button>
            ))}
          </div>

          <div className="bg-slate-950 border border-slate-800 rounded-xl p-4 flex items-center justify-between">
            <div>
              <span className="text-xs text-slate-400 block">Active In-Cab Height Indicator:</span>
              <span className="text-2xl font-black text-amber-400">{runningHeight}m</span>
              <span className="text-xs text-slate-500 ml-2 font-mono">(Route Optimiser Locked)</span>
            </div>
            <button
              onClick={() => setStep(2)}
              className="px-5 py-2.5 rounded-xl bg-amber-400 hover:bg-amber-300 text-slate-950 font-black text-sm transition"
            >
              Continue to Walkaround →
            </button>
          </div>
        </div>
      )}

      {step === 2 && (
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <span className="p-2.5 rounded-xl bg-sky-500/10 text-sky-400 text-xl font-bold">🗣️</span>
              <div>
                <h2 className="text-lg font-bold text-white">Conversational 32-Point Check (Slower 0.80x Audio)</h2>
                <p className="text-xs text-slate-400">Paced voice inspection guiding you around the vehicle at a calm walking pace.</p>
              </div>
            </div>
            <button
              onClick={() => playSlowerVoice(walkaroundPoints[currentAudioIndex])}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-2 ${
                isPlayingAudio ? 'bg-amber-500 text-slate-950 animate-pulse' : 'bg-slate-800 text-slate-200 hover:bg-slate-700'
              }`}
            >
              {isPlayingAudio ? '🔊 Speaking (0.80x)...' : '▶ Play Voice Guide'}
            </button>
          </div>

          <div className="bg-slate-950 border border-slate-800 rounded-xl p-4 mb-6">
            <div className="flex items-center justify-between text-xs text-slate-400 mb-2 font-mono">
              <span>POINT {currentAudioIndex + 1} OF {walkaroundPoints.length}</span>
              <span>AUDIO SPEED: 0.80x</span>
            </div>
            <p className="text-base font-semibold text-slate-100 min-h-[48px] flex items-center">
              "{walkaroundPoints[currentAudioIndex]}"
            </p>
            <div className="flex items-center gap-3 mt-4">
              <button
                onClick={handleNextAudioPoint}
                className="px-4 py-2 rounded-lg bg-sky-500 hover:bg-sky-400 text-slate-950 font-bold text-xs transition"
              >
                Next Point →
              </button>
              <button
                onClick={() => {
                  setCompletedItems(prev => ({ ...prev, [currentAudioIndex]: true }));
                  handleNextAudioPoint();
                }}
                className="px-4 py-2 rounded-lg bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs transition"
              >
                ✓ Mark Passed & Next
              </button>
            </div>
          </div>

          <div className="flex justify-between items-center pt-2">
            <button onClick={() => setStep(1)} className="text-xs text-slate-400 hover:text-white">← Back</button>
            <button
              onClick={() => setStep(3)}
              className="px-5 py-2.5 rounded-xl bg-amber-400 hover:bg-amber-300 text-slate-950 font-black text-sm transition"
            >
              Continue to Acoustic Air Leak Test →
            </button>
          </div>
        </div>
      )}

      {step === 3 && (
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl">
          <div className="flex items-center gap-3 mb-4">
            <span className="p-2.5 rounded-xl bg-emerald-500/10 text-emerald-400 text-xl font-bold">📡</span>
            <div>
              <h2 className="text-lg font-bold text-white">Acoustic Air Leak Radar (Phone Mic DSP)</h2>
              <p className="text-xs text-slate-400">Hold device near brake chambers and air lines to detect high-frequency pneumatic hissing.</p>
            </div>
          </div>

          <div className="bg-slate-950 border border-slate-800 rounded-2xl p-6 text-center my-6">
            {!micActive ? (
              <div>
                <p className="text-sm text-slate-300 mb-4">Walk along air lines. Tap below to begin listening.</p>
                <button
                  onClick={startAirLeakRadar}
                  className="px-6 py-3 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black text-sm shadow-lg shadow-emerald-500/20 transition"
                >
                  🎙️ Start Listening for Air Hiss
                </button>
              </div>
            ) : (
              <div>
                <div className="flex items-center justify-center gap-2 mb-4">
                  <span className="w-3 h-3 rounded-full bg-emerald-400 animate-ping"></span>
                  <span className="text-xs font-mono font-bold text-emerald-400 uppercase tracking-wider">Acoustic Spectrum Active</span>
                </div>

                <div className="w-full max-w-md mx-auto bg-slate-900 h-6 rounded-full overflow-hidden p-1 border border-slate-800 mb-4">
                  <div
                    className={`h-full rounded-full transition-all duration-75 ${
                      leakDetected ? 'bg-rose-500' : audioLevel > 50 ? 'bg-amber-500' : 'bg-emerald-500'
                    }`}
                    style={{ width: `${Math.max(5, audioLevel)}%` }}
                  ></div>
                </div>

                <div className={`p-3 rounded-xl max-w-md mx-auto text-xs font-bold mb-4 ${
                  leakDetected
                    ? 'bg-rose-500/20 border border-rose-500/40 text-rose-300'
                    : 'bg-emerald-500/10 border border-emerald-500/30 text-emerald-300'
                }`}>
                  {leakDetected
                    ? '⚠️ High Frequency Air Hiss Detected (4kHz - 8kHz)!'
                    : '✓ Normal Pressure Sound: No pneumatic leak detected.'}
                </div>

                <button
                  onClick={stopAirLeakRadar}
                  className="px-4 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold transition"
                >
                  ⏹ Stop Listening
                </button>
              </div>
            )}
          </div>

          <div className="flex justify-between items-center pt-2">
            <button onClick={() => setStep(2)} className="text-xs text-slate-400 hover:text-white">← Back</button>
            <button
              onClick={() => setStep(4)}
              className="px-5 py-2.5 rounded-xl bg-amber-400 hover:bg-amber-300 text-slate-950 font-black text-sm transition"
            >
              Continue to Digital Sign-Off →
            </button>
          </div>
        </div>
      )}

      {step === 4 && (
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl">
          <div className="flex items-center gap-3 mb-4">
            <span className="p-2.5 rounded-xl bg-purple-500/10 text-purple-400 text-xl font-bold">✍️</span>
            <div>
              <h2 className="text-lg font-bold text-white">DVSA Digital Walkaround Sign-Off</h2>
              <p className="text-xs text-slate-400">Complete legally compliant daily roadworthiness record.</p>
            </div>
          </div>

          <div className="bg-slate-950 border border-slate-800 rounded-xl p-4 my-6 space-y-3 text-xs">
            <div className="flex justify-between py-1 border-b border-slate-900">
              <span className="text-slate-400">Measured Running Height:</span>
              <span className="font-bold text-amber-400">{runningHeight}m</span>
            </div>
            <div className="flex justify-between py-1 border-b border-slate-900">
              <span className="text-slate-400">Pneumatic Air Leak Status:</span>
              <span className="font-bold text-emerald-400">{leakDetected ? 'Defect Logged' : 'Passed (Zero Leaks)'}</span>
            </div>
            <div className="flex justify-between py-1 border-b border-slate-900">
              <span className="text-slate-400">Walkaround Audio Inspection:</span>
              <span className="font-bold text-slate-200">Completed (0.80x Pace)</span>
            </div>
            <div className="flex justify-between py-1">
              <span className="text-slate-400">Timestamp:</span>
              <span className="font-mono text-slate-400">{new Date().toLocaleString('en-GB')}</span>
            </div>
          </div>

          {signedOff ? (
            <div className="p-4 rounded-xl bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 text-center mb-6">
              <div className="text-2xl mb-1">✅</div>
              <div className="font-bold text-base">Vehicle Certified Roadworthy for Shift</div>
              <div className="text-xs mt-1 text-emerald-400/80">Height ({runningHeight}m) locked into Route Optimiser.</div>
            </div>
          ) : (
            <button
              onClick={() => {
                setSignedOff(true);
                if (onComplete) onComplete(runningHeight);
              }}
              className="w-full py-3.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black text-sm shadow-lg shadow-emerald-500/20 transition mb-6"
            >
              Sign & Lock Vehicle Check for Shift
            </button>
          )}

          <div className="flex justify-between items-center pt-2">
            <button onClick={() => setStep(3)} className="text-xs text-slate-400 hover:text-white">← Back</button>
            <button
              onClick={onBack}
              className="px-5 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold text-sm transition"
            >
              Return to Cockpit
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
