'use client';

import React, { useState, useEffect, useRef } from 'react';
import {
  Truck, ShieldAlert, RotateCcw, Award, CheckCircle2, ChevronRight,
  Navigation, Clock, Building2, PhoneCall, Volume2, Mic, AlertTriangle,
  Briefcase, DollarSign, MapPin, CheckSquare, Square, Camera, Plus, Minus
} from 'lucide-react';

interface DriverProfile {
  fullName: string;
  mobile: string;
  email: string;
  licenceNumber: string;
  category: string;
  tachoCard: string;
  cpcHours: string;
  d906Signature: string;
  onboardedAt: string;
}

export default function DrivePartnersApp() {
  const [profile, setProfile] = useState<DriverProfile | null>(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const [activeTab, setActiveTab] = useState<'passport' | 'check_truck' | 'navigation' | 'bridge_shield' | 'depot_demurrage' | 'epod' | 'marketplace' | 'welfare'>('passport');

  // Onboarding wizard form state
  const [onboardingStep, setOnboardingStep] = useState(1);
  const [formData, setFormData] = useState({
    fullName: '',
    mobile: '',
    email: '',
    licenceNumber: '',
    category: 'Class 1 (C+E) Artic',
    tachoCard: '',
    cpcHours: '35 / 35 Periodic Hours',
    d906Signature: ''
  });

  // Canvas drawing ref for signatures
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [hasSigned, setHasSigned] = useState(false);

  // In-Cab Vehicle & Roadworthiness State
  const [runningHeight, setRunningHeight] = useState<number>(4.45);
  const [airSuspension, setAirSuspension] = useState<'Normal (0cm)' | 'Dump Air (-8cm)' | 'Raised (+10cm)'>('Normal (0cm)');
  const [isVoicePlaying, setIsVoicePlaying] = useState(false);
  const [airLeakTesting, setAirLeakTesting] = useState(false);
  const [airLeakResult, setAirLeakResult] = useState<'SEALED' | 'HISS_DEFECT' | null>(null);
  const [checkedItems, setCheckedItems] = useState<{ [key: string]: boolean }>({});
  const [walkaroundSigned, setWalkaroundSigned] = useState(false);

  // Demurrage & Depot State
  const [dwellMinutes, setDwellMinutes] = useState(95); // 35m past 60m free time
  const [whistleblowerStage, setWhistleblowerStage] = useState<1 | 2 | 3 | 4>(2);

  // ePOD Signature
  const epodCanvasRef = useRef<HTMLCanvasElement | null>(null);
  const [epodSigned, setEpodSigned] = useState(false);

  // HMRC Subsistence nights counter
  const [nightsAway, setNightsAway] = useState(16);

  // Load profile from localStorage on mount
  useEffect(() => {
    try {
      const saved = localStorage.getItem('dp_driver_profile');
      if (saved) {
        setProfile(JSON.parse(saved));
      }
    } catch (e) {
      console.error('Error reading local profile', e);
    }
    setIsLoaded(true);
  }, []);

  // Signature drawing logic
  const startDrawing = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>, targetCanvas: HTMLCanvasElement | null) => {
    setIsDrawing(true);
    draw(e, targetCanvas);
  };

  const stopDrawing = (isEpod = false) => {
    setIsDrawing(false);
    if (!isEpod && canvasRef.current) {
      setFormData(prev => ({ ...prev, d906Signature: canvasRef.current!.toDataURL() }));
      setHasSigned(true);
    } else if (isEpod && epodCanvasRef.current) {
      setEpodSigned(true);
    }
  };

  const draw = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>, targetCanvas: HTMLCanvasElement | null) => {
    if (!isDrawing && e.type !== 'mousedown' && e.type !== 'touchstart') return;
    if (!targetCanvas) return;
    const ctx = targetCanvas.getContext('2d');
    if (!ctx) return;

    const rect = targetCanvas.getBoundingClientRect();
    const clientX = 'touches' in e ? e.touches[0].clientX : (e as React.MouseEvent).clientX;
    const clientY = 'touches' in e ? e.touches[0].clientY : (e as React.MouseEvent).clientY;
    const x = clientX - rect.left;
    const y = clientY - rect.top;

    ctx.lineWidth = 3;
    ctx.lineCap = 'round';
    ctx.strokeStyle = '#10b981';

    if (e.type === 'mousedown' || e.type === 'touchstart') {
      ctx.beginPath();
      ctx.moveTo(x, y);
    } else {
      ctx.lineTo(x, y);
      ctx.stroke();
    }
  };

  const handleCompleteOnboarding = () => {
    if (!formData.fullName || !formData.licenceNumber) {
      alert('Please fill in your name and driving licence number.');
      return;
    }
    const newProfile: DriverProfile = {
      ...formData,
      onboardedAt: new Date().toISOString()
    };
    try {
      localStorage.setItem('dp_driver_profile', JSON.stringify(newProfile));
      setProfile(newProfile);
    } catch (e) {
      console.error('Error saving profile', e);
    }
  };

  const handleResetProfile = () => {
    if (confirm('Reset this driver account and start onboarding again?')) {
      localStorage.removeItem('dp_driver_profile');
      setProfile(null);
      setFormData({
        fullName: '',
        mobile: '',
        email: '',
        licenceNumber: '',
        category: 'Class 1 (C+E) Artic',
        tachoCard: '',
        cpcHours: '35 / 35 Periodic Hours',
        d906Signature: ''
      });
      setOnboardingStep(1);
      setHasSigned(false);
      setActiveTab('passport');
    }
  };

  // 0.80x Audio Inspection Prompt
  const speakInspectionPrompt = (text: string) => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.rate = 0.80; // Slower, calm in-cab voice
      utterance.pitch = 1.0;
      utterance.onstart = () => setIsVoicePlaying(true);
      utterance.onend = () => setIsVoicePlaying(false);
      window.speechSynthesis.speak(utterance);
    }
  };

  // Acoustic Air Leak DSP Simulation
  const runAcousticAirTest = () => {
    setAirLeakTesting(true);
    setAirLeakResult(null);
    speakInspectionPrompt('Listening for pneumatic hissing between 4000 and 8000 Hertz.');
    setTimeout(() => {
      setAirLeakTesting(false);
      setAirLeakResult('SEALED');
      speakInspectionPrompt('Air test complete. Pneumatic brake lines and red suzie are fully sealed. Pass.');
    }, 3500);
  };

  if (!isLoaded) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center text-emerald-400 font-mono">
        Loading Drive Partners Engine...
      </div>
    );
  }

  // ==========================================
  // VIEW 1: DRIVER ONBOARDING (IF NO PROFILE)
  // ==========================================
  if (!profile) {
    return (
      <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col justify-between p-4 sm:p-6 font-sans max-w-xl mx-auto">
        <div className="border-b border-slate-800 pb-4 mb-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="h-8 w-8 rounded-lg bg-emerald-500/20 border border-emerald-500/50 flex items-center justify-center font-black text-emerald-400 text-sm">
                DP
              </div>
              <h1 className="text-xl font-black tracking-tight text-white">DRIVE PARTNERS</h1>
            </div>
            <span className="text-xs px-2.5 py-1 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 font-mono">
              Driver Onboarding
            </span>
          </div>

          <div className="flex items-center gap-2 mt-4">
            <div className={`flex-1 h-1.5 rounded-full ${onboardingStep >= 1 ? 'bg-emerald-500' : 'bg-slate-800'}`} />
            <div className={`flex-1 h-1.5 rounded-full ${onboardingStep >= 2 ? 'bg-emerald-500' : 'bg-slate-800'}`} />
            <div className={`flex-1 h-1.5 rounded-full ${onboardingStep >= 3 ? 'bg-emerald-500' : 'bg-slate-800'}`} />
          </div>
          <div className="flex justify-between text-[11px] text-slate-400 font-mono mt-1.5">
            <span className={onboardingStep === 1 ? 'text-emerald-400 font-bold' : ''}>1. Identity</span>
            <span className={onboardingStep === 2 ? 'text-emerald-400 font-bold' : ''}>2. Licence & Tacho</span>
            <span className={onboardingStep === 3 ? 'text-emerald-400 font-bold' : ''}>3. D906 Consent</span>
          </div>
        </div>

        <div className="flex-1">
          {onboardingStep === 1 && (
            <div className="space-y-4">
              <div className="bg-slate-900/80 border border-slate-800 p-4 rounded-2xl">
                <h2 className="text-lg font-bold text-white mb-1">Create Your Driver Account</h2>
                <p className="text-xs text-slate-400">
                  Welcome to Drive Partners. Set up your personal profile to activate your verified in-cab credentials.
                </p>
              </div>

              <div>
                <label className="block text-xs font-mono uppercase text-slate-400 mb-1.5">Full Legal Name (as on Licence)</label>
                <input
                  type="text"
                  placeholder="e.g. MR ALEXANDER JAMES KITE"
                  value={formData.fullName}
                  onChange={e => setFormData({ ...formData, fullName: e.target.value.toUpperCase() })}
                  className="w-full bg-slate-900 border border-slate-800 focus:border-emerald-500 rounded-xl px-4 py-3.5 text-base font-bold text-white placeholder-slate-600 outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-mono uppercase text-slate-400 mb-1.5">Mobile Phone Number (for gate PINs)</label>
                <input
                  type="tel"
                  placeholder="e.g. 07123 456789"
                  value={formData.mobile}
                  onChange={e => setFormData({ ...formData, mobile: e.target.value })}
                  className="w-full bg-slate-900 border border-slate-800 focus:border-emerald-500 rounded-xl px-4 py-3.5 text-base text-white placeholder-slate-600 outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-mono uppercase text-slate-400 mb-1.5">Email Address</label>
                <input
                  type="email"
                  placeholder="e.g. driver@example.com"
                  value={formData.email}
                  onChange={e => setFormData({ ...formData, email: e.target.value })}
                  className="w-full bg-slate-900 border border-slate-800 focus:border-emerald-500 rounded-xl px-4 py-3.5 text-base text-white placeholder-slate-600 outline-none"
                />
              </div>

              <button
                type="button"
                onClick={() => {
                  if (!formData.fullName) {
                    alert('Please enter your full legal name.');
                    return;
                  }
                  setOnboardingStep(2);
                }}
                className="w-full mt-6 py-4 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black text-base flex items-center justify-center gap-2 shadow-lg shadow-emerald-500/20 active:scale-[0.98] transition-all"
              >
                Continue to Licence Details
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>
          )}

          {onboardingStep === 2 && (
            <div className="space-y-4">
              <div className="bg-slate-900/80 border border-slate-800 p-4 rounded-2xl">
                <h2 className="text-lg font-bold text-white mb-1">Commercial Entitlement</h2>
                <p className="text-xs text-slate-400">
                  Enter your DVLA photocard licence and Smart Tachograph details.
                </p>
              </div>

              <div>
                <label className="block text-xs font-mono uppercase text-slate-400 mb-1.5">DVLA Driving Licence Number</label>
                <input
                  type="text"
                  placeholder="e.g. KITE9707185AJ9ZM 26"
                  maxLength={19}
                  value={formData.licenceNumber}
                  onChange={e => setFormData({ ...formData, licenceNumber: e.target.value.toUpperCase() })}
                  className="w-full bg-slate-900 border border-slate-800 focus:border-emerald-500 rounded-xl px-4 py-3.5 text-base font-mono font-bold text-emerald-400 tracking-wider placeholder-slate-600 outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-mono uppercase text-slate-400 mb-1.5">Entitlement Category</label>
                <div className="grid grid-cols-2 gap-2">
                  {['Class 1 (C+E) Artic', 'Class 2 (C) Rigid'].map(cat => (
                    <button
                      key={cat}
                      type="button"
                      onClick={() => setFormData({ ...formData, category: cat })}
                      className={`p-3 rounded-xl border text-xs font-bold text-center transition-all ${
                        formData.category === cat
                          ? 'bg-emerald-500/20 border-emerald-500 text-emerald-400'
                          : 'bg-slate-900 border-slate-800 text-slate-400 hover:border-slate-700'
                      }`}
                    >
                      {cat}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-xs font-mono uppercase text-slate-400 mb-1.5">Smart Digi-Tacho Card Number</label>
                <input
                  type="text"
                  placeholder="e.g. DB25029078179500"
                  maxLength={16}
                  value={formData.tachoCard}
                  onChange={e => setFormData({ ...formData, tachoCard: e.target.value.toUpperCase() })}
                  className="w-full bg-slate-900 border border-slate-800 focus:border-emerald-500 rounded-xl px-4 py-3.5 text-base font-mono text-white placeholder-slate-600 outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-mono uppercase text-slate-400 mb-1.5">Driver CPC Status</label>
                <input
                  type="text"
                  value={formData.cpcHours}
                  onChange={e => setFormData({ ...formData, cpcHours: e.target.value })}
                  className="w-full bg-slate-900 border border-slate-800 focus:border-emerald-500 rounded-xl px-4 py-3 text-sm text-slate-300 outline-none"
                />
              </div>

              <div className="flex gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setOnboardingStep(1)}
                  className="flex-1 py-3.5 rounded-xl bg-slate-900 border border-slate-800 text-slate-300 font-bold text-sm"
                >
                  Back
                </button>
                <button
                  type="button"
                  onClick={() => {
                    if (!formData.licenceNumber) {
                      alert('Please enter your licence number.');
                      return;
                    }
                    setOnboardingStep(3);
                  }}
                  className="flex-[2] py-3.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black text-sm flex items-center justify-center gap-1.5 shadow-lg shadow-emerald-500/20"
                >
                  Continue to D906 Sign-off
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}

          {onboardingStep === 3 && (
            <div className="space-y-4">
              <div className="bg-slate-900/80 border border-slate-800 p-4 rounded-2xl">
                <h2 className="text-lg font-bold text-white mb-1">D906 Electronic Consent</h2>
                <p className="text-xs text-slate-400 leading-relaxed">
                  Under DVLA Access to Driver Data (ADD) rules, please sign below to authorise Drive Partners to periodically check your entitlement and tacho validity.
                </p>
              </div>

              <div className="border border-slate-800 rounded-2xl overflow-hidden bg-slate-900 touch-none">
                <canvas
                  ref={canvasRef}
                  width={480}
                  height={160}
                  onMouseDown={e => startDrawing(e, canvasRef.current)}
                  onMouseUp={() => stopDrawing(false)}
                  onMouseMove={e => draw(e, canvasRef.current)}
                  onTouchStart={e => startDrawing(e, canvasRef.current)}
                  onTouchEnd={() => stopDrawing(false)}
                  onTouchMove={e => draw(e, canvasRef.current)}
                  className="w-full h-40 cursor-crosshair bg-slate-950"
                />
              </div>

              <div className="flex gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setOnboardingStep(2)}
                  className="flex-1 py-3.5 rounded-xl bg-slate-900 border border-slate-800 text-slate-300 font-bold text-sm"
                >
                  Back
                </button>
                <button
                  type="button"
                  onClick={handleCompleteOnboarding}
                  className="flex-[2] py-4 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black text-sm flex items-center justify-center gap-2 shadow-lg shadow-emerald-500/20 active:scale-[0.98] transition-all"
                >
                  <CheckCircle2 className="w-5 h-5" />
                  Activate My Driver Account
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    );
  }

  // ==========================================
  // VIEW 2: ACTIVE UNIFIED DRIVER COMMAND CENTRE
  // ==========================================
  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 p-3 sm:p-5 font-sans max-w-5xl mx-auto space-y-4">
      {/* 1. TOP IN-CAB HUD (PERSISTENT STATUS) */}
      <div className="bg-slate-900/90 border border-slate-800 p-3.5 sm:p-4 rounded-2xl flex flex-wrap items-center justify-between gap-3 shadow-xl">
        <div className="flex items-center gap-3">
          <div className="h-11 w-11 rounded-xl bg-emerald-500/20 border border-emerald-500/50 flex items-center justify-center font-black text-emerald-400 text-base">
            {profile.fullName.split(' ').map(n => n[0]).join('').slice(0, 2) || 'DP'}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-sm sm:text-base font-black text-white">{profile.fullName}</h1>
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 font-mono font-bold">
                C+E VERIFIED
              </span>
            </div>
            <div className="flex items-center gap-3 text-xs font-mono text-slate-400 mt-0.5">
              <span>Unit: <strong className="text-white">DG21EDP</strong></span>
              <span>Trailer: <strong className="text-white">TR-8492</strong></span>
              <span className="px-2 py-0.5 rounded bg-amber-500/20 border border-amber-500/40 text-amber-400 font-bold">
                {runningHeight.toFixed(2)}m
              </span>
            </div>
          </div>
        </div>

        <button
          onClick={handleResetProfile}
          className="px-3 py-2 rounded-xl bg-slate-800 hover:bg-red-950/40 border border-slate-700 hover:border-red-500/50 text-slate-300 hover:text-red-400 text-xs font-mono font-bold flex items-center gap-1.5 transition-all"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          Reset Driver
        </button>
      </div>

      {/* 2. SHIFT PROGRESSION STEPPER (HORIZONTAL BIG-THUMB BAR) */}
      <div className="bg-slate-900/60 border border-slate-800 p-1.5 rounded-2xl flex items-center gap-1 overflow-x-auto scrollbar-none text-xs font-mono">
        {[
          { id: 'passport', label: '1. Passport' },
          { id: 'check_truck', label: '2. Check Truck' },
          { id: 'navigation', label: '3. 44t Nav' },
          { id: 'bridge_shield', label: '4. Bridge Shield' },
          { id: 'depot_demurrage', label: '5. Depot & Dwell' },
          { id: 'epod', label: '6. Delivery ePOD' },
          { id: 'marketplace', label: '7. Jobs & Loads' },
          { id: 'welfare', label: '8. Rest & Tax' }
        ].map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as any)}
            className={`px-3.5 py-2.5 rounded-xl whitespace-nowrap font-bold transition-all ${
              activeTab === tab.id
                ? 'bg-emerald-500 text-slate-950 shadow-md shadow-emerald-500/20'
                : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* 3. ACTIVE TAB CONTENT BODY */}
      <div className="space-y-4">

        {/* TAB 1: DRIVER PASSPORT */}
        {activeTab === 'passport' && (
          <div className="bg-slate-900/50 border border-slate-800 rounded-2xl p-5 space-y-4">
            <h2 className="text-sm font-mono uppercase tracking-wider text-slate-400 flex items-center gap-2">
              <Award className="w-4 h-4 text-emerald-400" />
              Roadside DVSA Digital Passport
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div className="bg-slate-950 border border-slate-800 p-4 rounded-xl">
                <span className="text-[10px] font-mono uppercase text-slate-500 block">DVLA Licence</span>
                <span className="text-base font-bold font-mono text-emerald-400">{profile.licenceNumber}</span>
                <span className="text-[11px] text-slate-400 block mt-1">{profile.category} • 0 Points</span>
              </div>
              <div className="bg-slate-950 border border-slate-800 p-4 rounded-xl">
                <span className="text-[10px] font-mono uppercase text-slate-500 block">Smart Digi-Tacho</span>
                <span className="text-base font-bold font-mono text-white">{profile.tachoCard || 'Active Card'}</span>
                <span className="text-[11px] text-emerald-400 block mt-1">Gen 2 Valid</span>
              </div>
              <div className="bg-slate-950 border border-slate-800 p-4 rounded-xl">
                <span className="text-[10px] font-mono uppercase text-slate-500 block">CPC Periodic Hours</span>
                <span className="text-base font-bold font-mono text-emerald-400">{profile.cpcHours}</span>
                <span className="text-[11px] text-slate-400 block mt-1">DQC Valid</span>
              </div>
            </div>

            <div className="p-4 bg-emerald-500/10 border border-emerald-500/20 rounded-xl flex items-center justify-between">
              <div>
                <span className="text-xs font-bold text-emerald-400 block">D906 Electronic Mandate Active</span>
                <span className="text-[11px] text-slate-400">Authorised for DVLA ADD Entitlement & Tachograph checks.</span>
              </div>
              <button 
                onClick={() => setActiveTab('check_truck')}
                className="px-4 py-2.5 rounded-xl bg-emerald-500 text-slate-950 font-bold text-xs"
              >
                Proceed to Check Truck →
              </button>
            </div>
          </div>
        )}

        {/* TAB 2: CHECK MY TRUCK */}
        {activeTab === 'check_truck' && (
          <div className="space-y-4">
            <div className="bg-slate-900/60 border border-slate-800 p-5 rounded-2xl">
              <span className="text-xs font-mono uppercase text-slate-400 block mb-2">Step 1: Lock In-Cab Height Placard</span>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                {[
                  { m: 4.00, imp: "13' 1\"" },
                  { m: 4.20, imp: "13' 9\"" },
                  { m: 4.45, imp: "14' 7\"" },
                  { m: 4.88, imp: "16' 0\"" }
                ].map(h => (
                  <button
                    key={h.m}
                    onClick={() => {
                      setRunningHeight(h.m);
                      speakInspectionPrompt(`Running height confirmed at ${h.m} meters.`);
                    }}
                    className={`p-4 rounded-xl border text-center transition-all ${
                      runningHeight === h.m
                        ? 'bg-amber-500/20 border-amber-500 text-amber-400 font-black scale-[1.02]'
                        : 'bg-slate-950 border-slate-800 text-slate-400'
                    }`}
                  >
                    <span className="text-lg font-black block">{h.m.toFixed(2)}m</span>
                    <span className="text-xs font-mono">{h.imp}</span>
                  </button>
                ))}
              </div>
            </div>

            <div className="bg-slate-900/60 border border-slate-800 p-5 rounded-2xl flex flex-wrap items-center justify-between gap-4">
              <div>
                <h3 className="text-sm font-bold text-white flex items-center gap-2">
                  <Volume2 className="w-4 h-4 text-emerald-400" />
                  Acoustic Air Leak Microphone Radar
                </h3>
                <p className="text-xs text-slate-400 mt-1">
                  Listens for pneumatic hissing (4kHz–8kHz) near red emergency suzies & brake chambers.
                </p>
              </div>

              <div className="flex items-center gap-3">
                {airLeakResult && (
                  <span className="text-xs px-3 py-1.5 rounded-xl bg-emerald-500/20 border border-emerald-500/40 text-emerald-400 font-mono font-bold">
                    SEALED (PASS) ✓
                  </span>
                )}
                <button
                  onClick={runAcousticAirTest}
                  disabled={airLeakTesting}
                  className="px-5 py-3 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs flex items-center gap-2"
                >
                  <Mic className="w-4 h-4" />
                  {airLeakTesting ? 'Listening...' : 'Test Air Lines'}
                </button>
              </div>
            </div>

            <div className="bg-slate-900/60 border border-slate-800 p-5 rounded-2xl space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono uppercase text-slate-400">Step 2: DVSA PG9 32-Point Inspection (0.80x Voice Guide)</span>
                <button
                  onClick={() => speakInspectionPrompt('Check fifth wheel locking bar and ensure dog clip is fully engaged down over the handle.')}
                  className="text-xs text-emerald-400 hover:underline flex items-center gap-1 font-mono"
                >
                  <Volume2 className="w-3.5 h-3.5" /> Read Next Item
                </button>
              </div>

              {[
                { id: 'c1', title: 'Fifth Wheel Locking Bar & Dog-Clip Latch Engaged' },
                { id: 'c2', title: 'Red Emergency & Yellow Service Suzies Connected' },
                { id: 'c3', title: 'All Tyre Treads > 1mm & Wheel Nut Indicators Aligned' },
                { id: 'c4', title: 'Trailer Curtain Straps & Load Security Tested' }
              ].map(item => (
                <div
                  key={item.id}
                  onClick={() => setCheckedItems(prev => ({ ...prev, [item.id]: !prev[item.id] }))}
                  className={`p-3.5 rounded-xl border flex items-center justify-between cursor-pointer transition-all ${
                    checkedItems[item.id]
                      ? 'bg-emerald-500/10 border-emerald-500/40 text-emerald-300'
                      : 'bg-slate-950 border-slate-800 text-slate-400'
                  }`}
                >
                  <span className="text-xs font-bold">{item.title}</span>
                  {checkedItems[item.id] ? <CheckSquare className="w-5 h-5 text-emerald-400" /> : <Square className="w-5 h-5" />}
                </div>
              ))}

              <button
                onClick={() => {
                  setWalkaroundSigned(true);
                  speakInspectionPrompt('Walkaround check complete and signed. 15-month DVSA audit record sealed.');
                }}
                className="w-full mt-4 py-4 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black text-sm"
              >
                {walkaroundSigned ? 'Inspection Completed & Sealed (15-Mo DVSA Audit ✓)' : 'Sign & Complete Walkaround Check'}
              </button>
            </div>
          </div>
        )}

        {/* TAB 3: 44t COMMERCIAL NAVIGATION */}
        {activeTab === 'navigation' && (
          <div className="bg-slate-900/60 border border-slate-800 p-5 rounded-2xl space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-bold text-white flex items-center gap-2">
                  <Navigation className="w-4 h-4 text-emerald-400" />
                  TomTom 44-Tonne Commercial Truck Routing
                </h3>
                <p className="text-xs text-slate-400 mt-0.5">
                  Clearance Corridor: Min 4.65m clearance (Locked at {runningHeight.toFixed(2)}m + 20cm safety margin).
                </p>
              </div>
              <span className="text-xs px-2.5 py-1 rounded-full bg-emerald-500/20 text-emerald-400 font-mono">
                LOW BRIDGES BYPASSED
              </span>
            </div>

            <div className="bg-slate-950 border border-slate-800 p-4 rounded-xl space-y-2 text-xs font-mono">
              <div className="flex justify-between text-slate-400">
                <span>Origin:</span>
                <span className="text-white font-bold">Daventry DIRFT (NN6 7GZ)</span>
              </div>
              <div className="flex justify-between text-slate-400">
                <span>Destination:</span>
                <span className="text-white font-bold">Park Royal Cross-Dock (NW10 7HQ)</span>
              </div>
              <div className="flex justify-between text-slate-400">
                <span>Remaining Distance:</span>
                <span className="text-emerald-400 font-bold">68.4 Miles (1h 22m)</span>
              </div>
            </div>

            <button 
              onClick={() => setActiveTab('bridge_shield')}
              className="w-full py-4 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-sm flex items-center justify-center gap-2"
            >
              Open In-Cab Bridge Strike Shield →
            </button>
          </div>
        )}

        {/* TAB 4: BRIDGE STRIKE COLLISION SHIELD */}
        {activeTab === 'bridge_shield' && (
          <div className="space-y-4">
            <div className="bg-red-950/40 border-2 border-red-500/80 p-5 rounded-2xl space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono font-bold text-red-400 flex items-center gap-1.5 animate-pulse">
                  <AlertTriangle className="w-4 h-4" />
                  CRITICAL 1-MILE COLLISION PROXIMITY RADAR
                </span>
                <span className="text-xs font-mono px-2 py-0.5 rounded bg-red-500 text-slate-950 font-black">
                  ASSET: WCML-WAT-049
                </span>
              </div>

              <div>
                <h3 className="text-lg font-black text-white">Watford Junction (St Albans Rd Girder Bridge)</h3>
                <p className="text-xs text-red-300 mt-1">
                  Signed Clearance: <strong>4.40m</strong> • Your Truck Height: <strong className="text-white underline">{runningHeight.toFixed(2)}m</strong>
                </p>
                <p className="text-xs font-bold text-amber-400 mt-1">
                  WARNING: +5cm Collision Strike Risk! Center Crown: 4.50m / Haunch: 3.90m.
                </p>
              </div>

              <a
                href="tel:03457114141"
                className="w-full py-4 rounded-xl bg-red-600 hover:bg-red-500 text-white font-black text-sm flex items-center justify-center gap-2 shadow-lg shadow-red-600/40 active:scale-[0.98] transition-all"
              >
                <PhoneCall className="w-5 h-5" />
                Call Network Rail Emergency Hotline: 03457 11 41 41
              </a>
            </div>

            <div className="bg-slate-900/60 border border-slate-800 p-5 rounded-2xl">
              <span className="text-xs font-mono uppercase text-slate-400 block mb-2">Air Suspension Ride Height Offset</span>
              <div className="grid grid-cols-3 gap-2">
                {[
                  { mode: 'Dump Air (-8cm)', note: 'Low clearance' },
                  { mode: 'Normal (0cm)', note: 'Cruising' },
                  { mode: 'Raised (+10cm)', note: 'Ferry / ramp' }
                ].map(item => (
                  <button
                    key={item.mode}
                    onClick={() => {
                      setAirSuspension(item.mode as any);
                      speakInspectionPrompt(`Air suspension set to ${item.mode}.`);
                    }}
                    className={`p-3.5 rounded-xl border text-center transition-all ${
                      airSuspension === item.mode
                        ? 'bg-emerald-500/20 border-emerald-500 text-emerald-400 font-bold'
                        : 'bg-slate-950 border-slate-800 text-slate-400'
                    }`}
                  >
                    <span className="text-xs font-bold block">{item.mode}</span>
                    <span className="text-[10px] font-mono text-slate-500">{item.note}</span>
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* TAB 5: DEPOT & DEMURRAGE */}
        {activeTab === 'depot_demurrage' && (
          <div className="space-y-4">
            <div className="bg-slate-900/60 border border-slate-800 p-5 rounded-2xl grid grid-cols-2 gap-3">
              <div className="bg-slate-950 border border-slate-800 p-4 rounded-xl text-center">
                <span className="text-[10px] font-mono uppercase text-slate-500 block">Freight Barrier PIN</span>
                <span className="text-2xl font-black font-mono text-emerald-400">8492</span>
                <span className="text-[11px] text-slate-400 block mt-1">Car barriers avoided ✓</span>
              </div>
              <div className="bg-slate-950 border border-slate-800 p-4 rounded-xl text-center">
                <span className="text-[10px] font-mono uppercase text-slate-500 block">Assigned Dock</span>
                <span className="text-2xl font-black font-mono text-amber-400">BAY #24</span>
                <span className="text-[11px] text-slate-400 block mt-1">Inbound Cross-Dock</span>
              </div>
            </div>

            {/* Live Demurrage Clock */}
            <div className="bg-slate-900/60 border border-slate-800 p-5 rounded-2xl space-y-3">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-bold text-white flex items-center gap-2">
                    <Clock className="w-4 h-4 text-red-400" />
                    Live Demurrage Detention Clock (£45.00/hr)
                  </h3>
                  <p className="text-xs text-slate-400 mt-0.5">
                    Free Time: 60 mins • Total Dwell: {dwellMinutes} mins (<strong className="text-red-400">35 mins billable</strong>)
                  </p>
                </div>
                <span className="text-xl font-black font-mono text-red-400">
                  £26.25 ACCRUING
                </span>
              </div>

              <div className="flex gap-2">
                <button
                  onClick={() => alert('Demurrage Claim PDF compiled with GPS arrival timestamp: 20:15 Today.')}
                  className="w-full py-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold text-xs font-mono"
                >
                  Generate Detention Claim PDF (£26.25)
                </button>
              </div>
            </div>

            {/* 4-Stage Anonymous Yard Whistleblower */}
            <div className="bg-slate-900/60 border border-slate-800 p-5 rounded-2xl space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono uppercase text-slate-400">4-Stage Anonymous Yard Whistleblower</span>
                <span className="text-xs font-mono text-amber-400">Stage {whistleblowerStage} of 4: Site Admin Notified (42h SLA left)</span>
              </div>

              <div className="p-3.5 bg-slate-950 border border-slate-800 rounded-xl space-y-1">
                <span className="text-xs font-bold text-white block">Active Report: Unsafe Bay #24 Wheel Lock & Unlit Catwalk</span>
                <span className="text-[11px] text-slate-400 block">
                  Site Manager was sent notification. Once they upload photo proof of the fix, you can verify and clear the hazard.
                </span>
              </div>

              <div className="flex gap-2">
                <button
                  onClick={() => {
                    setWhistleblowerStage(3);
                    alert('Site Admin uploaded photo proof of repaired wheel lock!');
                  }}
                  className="flex-1 py-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs text-slate-300 font-mono font-bold"
                >
                  Simulate Admin Proof
                </button>
                <button
                  onClick={() => {
                    setWhistleblowerStage(4);
                    alert('Driver confirmed fix. Hazard cleared!');
                  }}
                  className="flex-1 py-3 rounded-xl bg-emerald-500/20 border border-emerald-500/40 text-emerald-400 text-xs font-mono font-bold"
                >
                  Confirm & Clear Hazard
                </button>
              </div>
            </div>
          </div>
        )}

        {/* TAB 6: DELIVERY e-POD */}
        {activeTab === 'epod' && (
          <div className="bg-slate-900/60 border border-slate-800 p-5 rounded-2xl space-y-4">
            <div>
              <h3 className="text-sm font-bold text-white">Electronic Proof of Delivery (e-POD)</h3>
              <p className="text-xs text-slate-400 mt-0.5">
                Consignment: <strong>CMR-88291</strong> • Park Royal Inbound Cross-Dock.
              </p>
            </div>

            <div className="border border-slate-800 rounded-2xl overflow-hidden bg-slate-900 touch-none">
              <span className="block p-2 text-[10px] font-mono uppercase text-slate-500">Receiver Sign-on-Glass (Warehouse Supervisor)</span>
              <canvas
                ref={epodCanvasRef}
                width={480}
                height={150}
                onMouseDown={e => startDrawing(e, epodCanvasRef.current)}
                onMouseUp={() => stopDrawing(true)}
                onMouseMove={e => draw(e, epodCanvasRef.current)}
                onTouchStart={e => startDrawing(e, epodCanvasRef.current)}
                onTouchEnd={() => stopDrawing(true)}
                onTouchMove={e => draw(e, epodCanvasRef.current)}
                className="w-full h-36 cursor-crosshair bg-slate-950"
              />
            </div>

            <button
              onClick={() => {
                if (!epodSigned) {
                  alert('Please have the warehouse supervisor sign above.');
                  return;
                }
                alert('Delivery confirmed! e-POD sealed and escrow funds released.');
              }}
              className="w-full py-4 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black text-sm flex items-center justify-center gap-2"
            >
              <CheckCircle2 className="w-5 h-5" />
              Complete Delivery & Release Payment
            </button>
          </div>
        )}

        {/* TAB 7: JOBS & HAULAGE EXCHANGE */}
        {activeTab === 'marketplace' && (
          <div className="space-y-4">
            <div className="bg-slate-900/60 border border-slate-800 p-5 rounded-2xl space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono uppercase text-slate-400">Direct Haulier Offer (Zero Agency Markup)</span>
                <span className="text-xs px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-400 font-mono font-bold">£28.00/HR</span>
              </div>

              <div>
                <h4 className="text-sm font-bold text-white">Night Trunk: Daventry DIRFT ➔ Park Royal</h4>
                <p className="text-xs text-slate-400 mt-0.5">Midlands Freight Logistics Ltd • Start 18:30 • 10 Hours Guaranteed (£280.00)</p>
              </div>

              <div className="flex gap-2 pt-1">
                <button
                  onClick={() => alert('Job Offer Accepted! Shift locked into your calendar.')}
                  className="flex-1 py-3 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs"
                >
                  Accept Offer
                </button>
                <button
                  onClick={() => alert('Counter-offer sent for £32.00/hr.')}
                  className="px-4 py-3 rounded-xl bg-slate-800 text-slate-300 font-bold text-xs"
                >
                  Counter
                </button>
              </div>
            </div>

            <div className="bg-slate-900/60 border border-slate-800 p-5 rounded-2xl space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono uppercase text-slate-400">Driver-First Haulage Exchange</span>
                <span className="text-xs font-mono text-emerald-400 font-bold">£4.53/MILE</span>
              </div>

              <div>
                <h4 className="text-sm font-bold text-white">Return Load: Northampton ➔ Trafford Park, Manchester</h4>
                <p className="text-xs text-slate-400 mt-0.5">26 Pallets • 22t Ambient FMCG • Payout: <strong className="text-emerald-400">£580.00</strong> (Escrow Protected)</p>
              </div>

              <button
                onClick={() => alert('Load Claimed! 44t route synced directly to TomTom Navigation.')}
                className="w-full py-3.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-emerald-400 font-mono font-bold text-xs flex items-center justify-center gap-2"
              >
                Claim Backload & Sync Navigation →
              </button>
            </div>
          </div>
        )}

        {/* TAB 8: OVERNIGHT WELFARE & HMRC TAX */}
        {activeTab === 'welfare' && (
          <div className="space-y-4">
            <div className="bg-slate-900/60 border border-slate-800 p-5 rounded-2xl space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono uppercase text-slate-400">Secure HGV Overnight Parking</span>
                <span className="text-xs font-mono text-emerald-400 font-bold">14 BAYS FREE</span>
              </div>

              <div>
                <h4 className="text-sm font-bold text-white">Red Lion Truckstop (M1 J16)</h4>
                <p className="text-xs text-slate-400 mt-0.5">4.8 Miles Away • 5★ Security (CCTV & Fenced) • Hot Diner, Clean Showers, Truck Wash</p>
              </div>

              <button
                onClick={() => alert('Navigating to Red Lion Truckstop with SNAP billing.')}
                className="w-full py-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-mono font-bold text-xs"
              >
                Reserve Space with SNAP Account →
              </button>
            </div>

            <div className="bg-slate-900/60 border border-slate-800 p-5 rounded-2xl space-y-3">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-bold text-white flex items-center gap-2">
                    <DollarSign className="w-4 h-4 text-emerald-400" />
                    HMRC £34.90 Overnight Subsistence Vault
                  </h3>
                  <p className="text-xs text-slate-400 mt-0.5">Official tax-free meal allowance for nights away from home.</p>
                </div>
                <span className="text-xl font-black font-mono text-emerald-400">
                  £{(nightsAway * 34.90).toFixed(2)}
                </span>
              </div>

              <div className="flex items-center justify-between bg-slate-950 p-3.5 rounded-xl border border-slate-800">
                <span className="text-xs font-mono text-slate-400">Qualifying Nights Away:</span>
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => setNightsAway(Math.max(0, nightsAway - 1))}
                    className="p-2 rounded-lg bg-slate-800 text-white hover:bg-slate-700"
                  >
                    <Minus className="w-4 h-4" />
                  </button>
                  <span className="text-base font-black font-mono text-white">{nightsAway}</span>
                  <button
                    onClick={() => setNightsAway(nightsAway + 1)}
                    className="p-2 rounded-lg bg-slate-800 text-white hover:bg-slate-700"
                  >
                    <Plus className="w-4 h-4" />
                  </button>
                </div>
              </div>

              <button
                onClick={() => alert(`Exporting P87 tax schedule: £${(nightsAway * 34.90).toFixed(2)} tax relief claimed.`)}
                className="w-full py-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-mono font-bold text-xs"
              >
                Export P87 Tax Relief Claim Statement
              </button>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
