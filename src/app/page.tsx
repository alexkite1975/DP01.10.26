'use client';

import React, { useState, useEffect, useRef } from 'react';
import {
  Truck, ShieldAlert, RotateCcw, Award, CheckCircle2, ChevronRight
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

  // Onboarding wizard form state
  const [step, setStep] = useState(1);
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

  // Canvas drawing ref for D906 signature
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [hasSigned, setHasSigned] = useState(false);

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

  // Signature canvas handlers
  const startDrawing = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    setIsDrawing(true);
    draw(e);
  };

  const stopDrawing = () => {
    setIsDrawing(false);
    if (canvasRef.current) {
      const dataUrl = canvasRef.current.toDataURL();
      setFormData(prev => ({ ...prev, d906Signature: dataUrl }));
      setHasSigned(true);
    }
  };

  const draw = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    if (!isDrawing && e.type !== 'mousedown' && e.type !== 'touchstart') return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const rect = canvas.getBoundingClientRect();
    const clientX = 'touches' in e ? e.touches[0].clientX : (e as React.MouseEvent).clientX;
    const clientY = 'touches' in e ? e.touches[0].clientY : (e as React.MouseEvent).clientY;
    const x = clientX - rect.left;
    const y = clientY - rect.top;

    ctx.lineWidth = 3;
    ctx.lineCap = 'round';
    ctx.strokeStyle = '#10b981'; // Emerald

    if (e.type === 'mousedown' || e.type === 'touchstart') {
      ctx.beginPath();
      ctx.moveTo(x, y);
    } else {
      ctx.lineTo(x, y);
      ctx.stroke();
    }
  };

  const clearCanvas = () => {
    const canvas = canvasRef.current;
    if (canvas) {
      const ctx = canvas.getContext('2d');
      if (ctx) ctx.clearRect(0, 0, canvas.width, canvas.height);
      setHasSigned(false);
      setFormData(prev => ({ ...prev, d906Signature: '' }));
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
      setStep(1);
      setHasSigned(false);
    }
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
        {/* Top Header */}
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

          {/* Stepper */}
          <div className="flex items-center gap-2 mt-4">
            <div className={`flex-1 h-1.5 rounded-full ${step >= 1 ? 'bg-emerald-500' : 'bg-slate-800'}`} />
            <div className={`flex-1 h-1.5 rounded-full ${step >= 2 ? 'bg-emerald-500' : 'bg-slate-800'}`} />
            <div className={`flex-1 h-1.5 rounded-full ${step >= 3 ? 'bg-emerald-500' : 'bg-slate-800'}`} />
          </div>
          <div className="flex justify-between text-[11px] text-slate-400 font-mono mt-1.5">
            <span className={step === 1 ? 'text-emerald-400 font-bold' : ''}>1. Identity</span>
            <span className={step === 2 ? 'text-emerald-400 font-bold' : ''}>2. Licence & Tacho</span>
            <span className={step === 3 ? 'text-emerald-400 font-bold' : ''}>3. D906 Consent</span>
          </div>
        </div>

        {/* Form Body */}
        <div className="flex-1">
          {/* STEP 1: IDENTITY */}
          {step === 1 && (
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
                  setStep(2);
                }}
                className="w-full mt-6 py-4 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black text-base flex items-center justify-center gap-2 shadow-lg shadow-emerald-500/20 active:scale-[0.98] transition-all"
              >
                Continue to Licence Details
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>
          )}

          {/* STEP 2: LICENCE & TACHO */}
          {step === 2 && (
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
                  onClick={() => setStep(1)}
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
                    setStep(3);
                  }}
                  className="flex-[2] py-3.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black text-sm flex items-center justify-center gap-1.5 shadow-lg shadow-emerald-500/20"
                >
                  Continue to D906 Sign-off
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}

          {/* STEP 3: D906 MANDATE */}
          {step === 3 && (
            <div className="space-y-4">
              <div className="bg-slate-900/80 border border-slate-800 p-4 rounded-2xl">
                <h2 className="text-lg font-bold text-white mb-1">D906 Electronic Consent</h2>
                <p className="text-xs text-slate-400 leading-relaxed">
                  Under DVLA Access to Driver Data (ADD) requirements, please sign below to authorise Drive Partners to periodically verify your driving entitlement and tachograph validity.
                </p>
              </div>

              <div className="bg-slate-900/50 border border-slate-800 rounded-xl p-3 text-[11px] font-mono text-slate-400">
                Declaration: I, <span className="text-white font-bold">{formData.fullName || 'Driver'}</span> ({formData.licenceNumber}), authorise Drive Partners to check my driving record with the DVLA.
              </div>

              <div>
                <div className="flex justify-between items-center mb-1.5">
                  <label className="text-xs font-mono uppercase text-slate-400">Sign with Finger / Mouse</label>
                  <button
                    type="button"
                    onClick={clearCanvas}
                    className="text-[11px] text-amber-400 hover:text-amber-300 font-mono"
                  >
                    Clear Signature
                  </button>
                </div>
                <div className="border border-slate-800 rounded-2xl overflow-hidden bg-slate-900 touch-none">
                  <canvas
                    ref={canvasRef}
                    width={480}
                    height={160}
                    onMouseDown={startDrawing}
                    onMouseUp={stopDrawing}
                    onMouseMove={draw}
                    onTouchStart={startDrawing}
                    onTouchEnd={stopDrawing}
                    onTouchMove={draw}
                    className="w-full h-40 cursor-crosshair bg-slate-950"
                  />
                </div>
              </div>

              <div className="flex gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setStep(2)}
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

        {/* Footer info */}
        <div className="mt-8 text-center text-[11px] text-slate-600 font-mono">
          Drive Partners Ltd • DVLA ADD Compliance Gateway
        </div>
      </div>
    );
  }

  // ==========================================
  // VIEW 2: ACTIVE LIVE DASHBOARD (WITH REAL USER DATA)
  // ==========================================
  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 p-4 sm:p-6 font-sans max-w-4xl mx-auto space-y-6">
      {/* Active Driver Top Bar */}
      <div className="bg-slate-900/80 border border-slate-800 p-4 sm:p-5 rounded-2xl flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="h-12 w-12 rounded-xl bg-emerald-500/20 border border-emerald-500/50 flex items-center justify-center font-black text-emerald-400 text-lg">
            {profile.fullName.split(' ').map(n => n[0]).join('').slice(0, 2) || 'DP'}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-base sm:text-lg font-black text-white">{profile.fullName}</h1>
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 font-mono font-bold">
                ACTIVE
              </span>
            </div>
            <p className="text-xs text-slate-400 font-mono">
              {profile.category} • Licence: <span className="text-emerald-400">{profile.licenceNumber}</span>
            </p>
          </div>
        </div>

        {/* Action Button: Reset / Test New Driver */}
        <button
          onClick={handleResetProfile}
          className="px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-red-950/40 border border-slate-700 hover:border-red-500/50 text-slate-300 hover:text-red-400 text-xs font-mono font-bold flex items-center gap-2 transition-all"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          Reset & Test New Driver
        </button>
      </div>

      {/* Verified Digital Credentials Card */}
      <div className="bg-slate-900/50 border border-slate-800 rounded-2xl p-5">
        <h2 className="text-xs font-mono uppercase tracking-wider text-slate-400 mb-3 flex items-center gap-2">
          <Award className="w-4 h-4 text-emerald-400" />
          Verified Roadside Credentials
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div className="bg-slate-950 border border-slate-800 p-3.5 rounded-xl">
            <span className="text-[10px] font-mono uppercase text-slate-500 block">Digi-Tacho Card</span>
            <span className="text-sm font-bold font-mono text-white">{profile.tachoCard || 'Active Card'}</span>
          </div>
          <div className="bg-slate-950 border border-slate-800 p-3.5 rounded-xl">
            <span className="text-[10px] font-mono uppercase text-slate-500 block">CPC Status</span>
            <span className="text-sm font-bold font-mono text-emerald-400">{profile.cpcHours}</span>
          </div>
          <div className="bg-slate-950 border border-slate-800 p-3.5 rounded-xl">
            <span className="text-[10px] font-mono uppercase text-slate-500 block">D906 Mandate</span>
            <span className="text-sm font-bold font-mono text-emerald-400">Signed on Glass ✓</span>
          </div>
        </div>
      </div>

      {/* Live Modules Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {/* Module A: Check My Truck */}
        <div className="bg-slate-900/60 border border-slate-800 hover:border-emerald-500/50 p-5 rounded-2xl transition-all">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2 text-white font-bold text-sm">
              <Truck className="w-4 h-4 text-emerald-400" />
              Check My Truck
            </div>
            <span className="text-[11px] font-mono text-slate-500">Ready for Walkaround</span>
          </div>
          <p className="text-xs text-slate-400 mb-4">
            Lock in-cab running height, run 0.80x voice inspection, and perform acoustic air leak test.
          </p>
          <button className="w-full py-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-emerald-400 text-xs font-mono font-bold flex items-center justify-center gap-2">
            Start Vehicle Inspection →
          </button>
        </div>

        {/* Module B: Bridge Strike Collision Shield */}
        <div className="bg-slate-900/60 border border-slate-800 hover:border-amber-500/50 p-5 rounded-2xl transition-all">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2 text-white font-bold text-sm">
              <ShieldAlert className="w-4 h-4 text-amber-400" />
              Bridge Strike Shield
            </div>
            <span className="text-[11px] font-mono text-emerald-400">Proximity Radar Ready</span>
          </div>
          <p className="text-xs text-slate-400 mb-4">
            1-mile collision radar, Network Rail emergency hotline (03457 11 41 41), and air dump offset.
          </p>
          <button className="w-full py-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-amber-400 text-xs font-mono font-bold flex items-center justify-center gap-2">
            View Collision Radar →
          </button>
        </div>
      </div>
    </div>
  );
}
