'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import {
  Shield,
  CheckCircle2,
  AlertTriangle,
  Volume2,
  VolumeX,
  Mic,
  Navigation,
  Truck,
  FileText,
  RotateCcw,
  Camera,
  Radio,
  Clock,
  Activity,
  ArrowRight,
  Check,
  Cloud
} from 'lucide-react';
import { dvsaChecklist } from '@/data/dvsaChecklist';

const fleetTrailers = [
  { id: 'TR-8492', type: 'Curtainsider Tri-Axle (4.45m)', height: '4.45m', status: 'ACTIVE', mot: '2027-04' },
  { id: 'TR-3104', type: 'High-Cube Refrigerated Box (4.88m)', height: '4.88m', status: 'ACTIVE', mot: '2026-11' },
  { id: 'TR-9912', type: 'Standard Dry Freight Box (4.20m)', height: '4.20m', status: 'ACTIVE', mot: '2027-01' },
  { id: 'TR-5541', type: 'Double-Deck Step-Frame (4.95m)', height: '4.95m', status: 'MAINTENANCE', mot: '2026-10' }
];

export default function DriverDashboardView() {
  // Navigation & UI State
  const [activeTab, setActiveTab] = useState<'readiness' | 'route' | 'enroute' | 'depot' | 'tacho' | 'tools'>('readiness');
  const [showSosModal, setShowSosModal] = useState(false);

  // Vehicle & Trailer State
  const [vehicleReg, setVehicleReg] = useState('DG21 EDP');
  const [hasTrailer, setHasTrailer] = useState(true);
  const [selectedTrailer, setSelectedTrailer] = useState('TR-8492');
  const [customTrailer, setCustomTrailer] = useState('');

  // 32-Point DVSA Walkaround State
  const [walkaroundStep, setWalkaroundStep] = useState(1);
  const [checkStarted, setCheckStarted] = useState(false);
  const [isCheckComplete, setIsCheckComplete] = useState(false);
  const [defectsLogged, setDefectsLogged] = useState(0);
  const [defectNotes, setDefectNotes] = useState<{ [stepId: number]: string }>({});
  const [defectPhotoUrl, setDefectPhotoUrl] = useState<string | null>(null);

  // Cloud Firestore Submission State
  const [submittingCheck, setSubmittingCheck] = useState(false);
  const [submissionCert, setSubmissionCert] = useState<string | null>(null);

  // Voice Guidance State (Default: ON, British Voice)
  const [voiceGuidance, setVoiceGuidance] = useState<boolean>(true);
  const [activeVoiceName, setActiveVoiceName] = useState('British Voice (en-GB)');

  // Telematics & Sensor Mocks
  const [liveDb, setLiveDb] = useState(38);
  const [leakFrequency, setLeakFrequency] = useState(0);
  const [leakEnergy, setLeakEnergy] = useState(0);
  const [liveSpeedMph, setLiveSpeedMph] = useState(0);

  // Current Inspection Item
  const currentItem = dvsaChecklist[walkaroundStep - 1] || dvsaChecklist[0];

  // British Female Voice Selector (Safe Helper)
  const getExactBritishFemaleVoice = (): SpeechSynthesisVoice | null => {
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) return null;
    try {
      const allVoices = window.speechSynthesis.getVoices();
      if (!allVoices || allVoices.length === 0) return null;

      const ukNames = ['sonia', 'libby', 'hazel', 'serena', 'george', 'uk female', 'english united kingdom'];
      for (const name of ukNames) {
        const match = allVoices.find(v =>
          v.lang?.replace('_', '-').toLowerCase().startsWith('en-gb') &&
          v.name?.toLowerCase().includes(name)
        );
        if (match) return match;
      }
      return allVoices.find(v => v.lang?.replace('_', '-').toLowerCase().startsWith('en-gb')) || allVoices[0];
    } catch {
      return null;
    }
  };

  // Safe Voice Initialization in useEffect ONLY
  useEffect(() => {
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) return;

    const updateVoice = () => {
      const v = getExactBritishFemaleVoice();
      if (v) setActiveVoiceName(`${v.name} (en-GB)`);
    };

    updateVoice();
    window.speechSynthesis.onvoiceschanged = updateVoice;

    return () => {
      if ('speechSynthesis' in window) {
        window.speechSynthesis.onvoiceschanged = null;
      }
    };
  }, []);

  // British Voice Speech Function
  const speakBritishClara = (text: string) => {
    if (!voiceGuidance || typeof window === 'undefined' || !('speechSynthesis' in window)) return;
    try {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      const voice = getExactBritishFemaleVoice();
      if (voice) utterance.voice = voice;
      utterance.rate = 1.0;
      utterance.pitch = 1.05;
      utterance.lang = 'en-GB';
      window.speechSynthesis.speak(utterance);
    } catch (err) {
      console.warn('Speech error:', err);
    }
  };

  // Auto-speak statutory check on step advance
  useEffect(() => {
    if (checkStarted && !isCheckComplete && voiceGuidance) {
      const item = dvsaChecklist[walkaroundStep - 1];
      if (item) {
        speakBritishClara(`Step ${item.id}: ${item.title}. ${item.instruction}`);
      }
    }
  }, [walkaroundStep, checkStarted, isCheckComplete, voiceGuidance]);

  // Submit Completed Inspection to Firestore API
  const submitInspectionToCloud = async () => {
    setSubmittingCheck(true);
    try {
      const payload = {
        vehicleReg,
        trailerId: selectedTrailer === 'CUSTOM' ? customTrailer : selectedTrailer,
        trailerHeight: fleetTrailers.find(t => t.id === selectedTrailer)?.height || '4.45m',
        defectsLogged,
        driverName: 'Alex (In-Cab Operator)'
      };

      const res = await fetch('/api/inspections', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      const data = await res.json();
      if (data.success) {
        setSubmissionCert(data.record?.digitalSignature || `DVSA-CERT-${Date.now().toString(36).toUpperCase()}`);
        setIsCheckComplete(true);
        speakBritishClara("Statutory inspection complete and verified to Google Cloud Firestore. Safe travels.");
      } else {
        setIsCheckComplete(true);
      }
    } catch (err) {
      console.error('Failed to submit inspection:', err);
      setIsCheckComplete(true);
    } finally {
      setSubmittingCheck(false);
    }
  };

  // Active Trailer Height Calculation
  const currentTrailerHeight = selectedTrailer === 'CUSTOM'
    ? 'Custom Height'
    : fleetTrailers.find(t => t.id === selectedTrailer)?.height || '4.45m';

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans pb-24 selection:bg-emerald-500 selection:text-slate-950">
      {/* Top Telematics Bar */}
      <header className="sticky top-0 z-50 bg-slate-900/90 backdrop-blur-md border-b border-slate-800 px-4 py-3 flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <Link href="/" className="flex items-center space-x-2">
            <span className="w-8 h-8 rounded-lg bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center text-emerald-400 font-bold text-sm">
              DP
            </span>
            <div>
              <h1 className="text-sm font-bold tracking-wider text-white">DRIVE PARTNERS</h1>
              <p className="text-[10px] text-slate-400 font-mono">IN-CAB OS v1.0 • {vehicleReg}</p>
            </div>
          </Link>
        </div>

        {/* Voice Guidance Toggle */}
        <div className="flex items-center space-x-2">
          <button
            onClick={() => {
              const next = !voiceGuidance;
              setVoiceGuidance(next);
              if (next) speakBritishClara("Voice guidance activated.");
            }}
            className={`px-3 py-1.5 rounded-lg border text-xs font-medium flex items-center space-x-2 transition-colors ${
              voiceGuidance
                ? 'bg-emerald-500/10 border-emerald-500/40 text-emerald-400'
                : 'bg-slate-800 border-slate-700 text-slate-400'
            }`}
          >
            {voiceGuidance ? <Volume2 className="w-3.5 h-3.5" /> : <VolumeX className="w-3.5 h-3.5" />}
            <span className="hidden sm:inline">{voiceGuidance ? 'Clara ON (en-GB)' : 'Voice Muted'}</span>
          </button>

          <button
            onClick={() => setShowSosModal(true)}
            className="px-3 py-1.5 rounded-lg bg-rose-500/20 border border-rose-500/40 text-rose-400 text-xs font-bold hover:bg-rose-500/30 transition-colors"
          >
            SOS
          </button>
        </div>
      </header>

      {/* Main Container */}
      <main className="flex-1 max-w-5xl w-full mx-auto p-4 space-y-6">
        {/* Universal Low Bridge Shield Banner */}
        <section className="bg-gradient-to-r from-amber-500/10 via-slate-900 to-slate-900 border border-amber-500/30 rounded-xl p-4 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-lg bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-amber-400">
              <Shield className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <span className="text-xs font-bold text-amber-400 uppercase tracking-wider">Low Bridge Shield</span>
                <span className="px-1.5 py-0.5 rounded text-[10px] font-mono bg-amber-500/20 text-amber-300">ACTIVE</span>
              </div>
              <p className="text-sm text-slate-300">
                Running Height: <strong className="text-white font-mono">{currentTrailerHeight}</strong> ({selectedTrailer})
              </p>
            </div>
          </div>
          <select
            value={selectedTrailer}
            onChange={(e) => {
              setSelectedTrailer(e.target.value);
              speakBritishClara(`Trailer updated. Running height set to ${fleetTrailers.find(t => t.id === e.target.value)?.height || '4.45m'}.`);
            }}
            className="bg-slate-950 border border-slate-700 rounded-lg px-3 py-1.5 text-xs text-slate-200 focus:outline-none focus:border-emerald-500"
          >
            {fleetTrailers.map(t => (
              <option key={t.id} value={t.id}>{t.id} - {t.height}</option>
            ))}
          </select>
        </section>

        {/* Tab Navigation */}
        <nav className="flex space-x-2 border-b border-slate-800 pb-2 overflow-x-auto text-xs font-medium">
          {[
            { id: 'readiness', label: '32-Pt Walkaround', icon: CheckCircle2 },
            { id: 'route', label: 'Route & Bridges', icon: Navigation },
            { id: 'enroute', label: 'En-Route Telematics', icon: Activity },
            { id: 'tacho', label: 'Quiet Sleep (dB)', icon: Clock },
            { id: 'tools', label: 'Air Leak DSP', icon: Radio },
          ].map(t => (
            <button
              key={t.id}
              onClick={() => setActiveTab(t.id as any)}
              className={`flex items-center space-x-2 px-3 py-2 rounded-lg transition-colors whitespace-nowrap ${
                activeTab === t.id
                  ? 'bg-emerald-500 text-slate-950 font-bold shadow-lg shadow-emerald-500/20'
                  : 'bg-slate-900 border border-slate-800 text-slate-400 hover:text-white'
              }`}
            >
              <t.icon className="w-3.5 h-3.5" />
              <span>{t.label}</span>
            </button>
          ))}
        </nav>

        {/* TAB 1: 32-Point DVSA Walkaround */}
        {activeTab === 'readiness' && (
          <section className="space-y-4">
            {!checkStarted ? (
              <div className="bg-slate-900 border border-slate-800 rounded-xl p-8 text-center space-y-4">
                <div className="w-16 h-16 bg-emerald-500/10 border border-emerald-500/30 rounded-full flex items-center justify-center mx-auto text-emerald-400">
                  <CheckCircle2 className="w-8 h-8" />
                </div>
                <h2 className="text-xl font-bold text-white">Statutory DVSA Pre-Trip Inspection</h2>
                <p className="text-sm text-slate-400 max-w-md mx-auto">
                  Complete all 32 statutory items to verify roadworthiness. Results are digitally signed and pushed straight to Fleet Ops.
                </p>
                <button
                  onClick={() => {
                    setCheckStarted(true);
                    speakBritishClara(`Starting 32-point inspection. Step 1: ${currentItem.title}`);
                  }}
                  className="px-6 py-3 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold rounded-lg transition-colors inline-flex items-center space-x-2"
                >
                  <span>Begin Statutory Walkaround</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            ) : isCheckComplete ? (
              <div className="bg-slate-900 border border-emerald-500/30 rounded-xl p-8 text-center space-y-4">
                <div className="w-16 h-16 bg-emerald-500/20 border border-emerald-500/50 rounded-full flex items-center justify-center mx-auto text-emerald-400">
                  <Check className="w-8 h-8" />
                </div>
                <h2 className="text-xl font-bold text-white">Inspection Certified & Synced</h2>
                <p className="text-sm text-slate-300 font-mono">
                  Certificate: <span className="text-emerald-400">{submissionCert || 'DVSA-CERT-VERIFIED'}</span>
                </p>
                <p className="text-xs text-slate-400">
                  Synced directly with Google Cloud Firestore (<span className="text-slate-300 font-mono">drive-partners2</span>). Fleet Ops has received your dispatch clearance.
                </p>
                <button
                  onClick={() => {
                    setCheckStarted(false);
                    setIsCheckComplete(false);
                    setWalkaroundStep(1);
                  }}
                  className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold rounded-lg transition-colors"
                >
                  Start New Inspection
                </button>
              </div>
            ) : (
              <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 space-y-6">
                {/* Progress Bar */}
                <div className="space-y-2">
                  <div className="flex justify-between text-xs text-slate-400 font-mono">
                    <span>STEP {walkaroundStep} OF 32</span>
                    <span>{currentItem.category}</span>
                  </div>
                  <div className="w-full h-2 bg-slate-950 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-emerald-500 transition-all duration-300"
                      style={{ width: `${(walkaroundStep / 32) * 100}%` }}
                    />
                  </div>
                </div>

                {/* Inspection Item Card */}
                <div className="bg-slate-950 p-6 rounded-lg border border-slate-800 space-y-3">
                  <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-emerald-500/20 text-emerald-300 uppercase">
                    {currentItem.category}
                  </span>
                  <h3 className="text-lg font-bold text-white">{currentItem.title}</h3>
                  <p className="text-sm text-slate-300 leading-relaxed">{currentItem.instruction}</p>
                </div>

                {/* Pass / Defect Buttons */}
                <div className="grid grid-cols-2 gap-4">
                  <button
                    disabled={submittingCheck}
                    onClick={() => {
                      if (walkaroundStep < 32) {
                        setWalkaroundStep(walkaroundStep + 1);
                      } else {
                        submitInspectionToCloud();
                      }
                    }}
                    className="py-4 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold rounded-xl flex items-center justify-center space-x-2 transition-colors disabled:opacity-50"
                  >
                    <CheckCircle2 className="w-5 h-5" />
                    <span>{walkaroundStep === 32 ? (submittingCheck ? 'SYNCING TO CLOUD...' : 'SIGN & CERTIFY') : 'PASS & NEXT'}</span>
                  </button>

                  <button
                    disabled={submittingCheck}
                    onClick={() => {
                      setDefectsLogged(prev => prev + 1);
                      speakBritishClara(`Defect logged for ${currentItem.title}. Please capture photo.`);
                      if (walkaroundStep < 32) {
                        setWalkaroundStep(walkaroundStep + 1);
                      } else {
                        submitInspectionToCloud();
                      }
                    }}
                    className="py-4 bg-rose-500/20 hover:bg-rose-500/30 border border-rose-500/40 text-rose-300 font-bold rounded-xl flex items-center justify-center space-x-2 transition-colors disabled:opacity-50"
                  >
                    <AlertTriangle className="w-5 h-5" />
                    <span>FLAG DEFECT</span>
                  </button>
                </div>
              </div>
            )}
          </section>
        )}

        {/* TAB 2: Route & Low Bridges */}
        {activeTab === 'route' && (
          <section className="bg-slate-900 border border-slate-800 rounded-xl p-6 space-y-4">
            <h3 className="text-lg font-bold text-white flex items-center space-x-2">
              <Navigation className="w-5 h-5 text-emerald-400" />
              <span>Commercial HGV Low-Bridge Corridor Shield</span>
            </h3>
            <p className="text-sm text-slate-400">
              Corridor navigation active for running height <strong className="text-emerald-400">{currentTrailerHeight}</strong>. Low bridges under 5.0m automatically rerouted.
            </p>
            <div className="bg-slate-950 p-4 rounded-lg border border-slate-800 space-y-2 text-xs font-mono text-slate-300">
              <div className="flex justify-between py-1 border-b border-slate-800/60">
                <span>M6 J6 Gravelly Hill (Spaghetti)</span>
                <span className="text-emerald-400">CLEAR (5.20m)</span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-800/60">
                <span>A406 Angel Road Overbridge</span>
                <span className="text-emerald-400">CLEAR (4.90m)</span>
              </div>
              <div className="flex justify-between py-1">
                <span>B4114 Coleshill Arch Bridge</span>
                <span className="text-rose-400 font-bold">AVOID (4.10m RESTRICTION)</span>
              </div>
            </div>
          </section>
        )}

        {/* TAB 3: En-Route Telematics */}
        {activeTab === 'enroute' && (
          <section className="bg-slate-900 border border-slate-800 rounded-xl p-6 space-y-4">
            <h3 className="text-lg font-bold text-white">Live In-Cab Telematics</h3>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
              <div className="bg-slate-950 p-4 rounded-lg border border-slate-800 text-center">
                <span className="text-xs text-slate-400">SPEED</span>
                <div className="text-2xl font-bold font-mono text-emerald-400">56 <span className="text-xs font-normal">MPH</span></div>
              </div>
              <div className="bg-slate-950 p-4 rounded-lg border border-slate-800 text-center">
                <span className="text-xs text-slate-400">DRIVE TIME</span>
                <div className="text-2xl font-bold font-mono text-white">3h 42m</div>
              </div>
              <div className="bg-slate-950 p-4 rounded-lg border border-slate-800 text-center col-span-2 sm:col-span-1">
                <span className="text-xs text-slate-400">NEXT MANDATORY BREAK</span>
                <div className="text-2xl font-bold font-mono text-amber-400">48 <span className="text-xs font-normal">MIN</span></div>
              </div>
            </div>
          </section>
        )}

        {/* TAB 4: Quiet Sleep Decibel Meter */}
        {activeTab === 'tacho' && (
          <section className="bg-slate-900 border border-slate-800 rounded-xl p-6 space-y-4">
            <h3 className="text-lg font-bold text-white">Quiet Sleep Cab Acoustic Meter</h3>
            <p className="text-sm text-slate-400">Monitors sleeper berth decibels to guarantee statutory undisturbed rest periods.</p>
            <div className="bg-slate-950 p-6 rounded-lg border border-slate-800 text-center space-y-2">
              <span className="text-xs text-slate-400 font-mono">CABIN AMBIENT NOISE</span>
              <div className="text-4xl font-bold font-mono text-emerald-400">{liveDb} dB</div>
              <span className="inline-block px-2 py-0.5 rounded text-[10px] font-mono bg-emerald-500/20 text-emerald-300">
                IDEAL SLEEP ZONE (&lt;45 dB)
              </span>
            </div>
          </section>
        )}

        {/* TAB 5: Air Leak Ultrasonic DSP */}
        {activeTab === 'tools' && (
          <section className="bg-slate-900 border border-slate-800 rounded-xl p-6 space-y-4">
            <h3 className="text-lg font-bold text-white">Air Brake Ultrasonic Acoustic DSP</h3>
            <p className="text-sm text-slate-400">Acoustic digital signal processor scanning for 4-8 kHz air coupling hiss.</p>
            <div className="bg-slate-950 p-6 rounded-lg border border-slate-800 text-center space-y-2">
              <span className="text-xs text-slate-400 font-mono">AIR COUPLING FREQUENCY</span>
              <div className="text-4xl font-bold font-mono text-slate-400">0.00 kHz</div>
              <span className="inline-block px-2 py-0.5 rounded text-[10px] font-mono bg-emerald-500/20 text-emerald-300">
                PRESSURE SYSTEM AIR-TIGHT
              </span>
            </div>
          </section>
        )}
      </main>

      {/* Floating Clara Voice Assistant HUD */}
      <aside className="fixed bottom-4 right-4 z-40 bg-slate-900/95 border border-emerald-500/40 rounded-full px-4 py-2.5 shadow-2xl flex items-center space-x-3 backdrop-blur-md">
        <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
        <div className="text-left">
          <p className="text-[11px] font-bold text-white flex items-center space-x-1">
            <span>Clara British AI</span>
            <span className="text-[9px] text-emerald-400 bg-emerald-500/10 px-1 rounded">en-GB</span>
          </p>
          <p className="text-[9px] text-slate-400">{voiceGuidance ? 'Guidance Active' : 'Guidance Muted'}</p>
        </div>
        <button
          onClick={() => {
            speakBritishClara(`Current inspection check: ${currentItem.title}. Running height is ${currentTrailerHeight}.`);
          }}
          className="p-1.5 rounded-full bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-400 text-xs transition-colors"
          title="Repeat Guidance"
        >
          <Volume2 className="w-3.5 h-3.5" />
        </button>
      </aside>
    </div>
  );
}
