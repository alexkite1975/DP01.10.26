import subprocess

page_code = """'use client';

import React, { useState, useEffect, useRef } from 'react';
import {
  Truck, ShieldAlert, RotateCcw, Award, CheckCircle2, ChevronRight,
  Navigation, Clock, Building2, PhoneCall, Volume2, Mic, AlertTriangle,
  Briefcase, DollarSign, MapPin, CheckSquare, Square, Settings, ToggleLeft, ToggleRight,
  Users, Sliders, Shield, FileText, Check
} from 'lucide-react';

interface FeatureFlags {
  onboarding: boolean;
  passport: boolean;
  checkTruck: boolean;
  airLeakRadar: boolean;
  navigation: boolean;
  bridgeShield: boolean;
  depotDemurrage: boolean;
  whistleblower: boolean;
  epod: boolean;
  marketplace: boolean;
  welfare: boolean;
}

const DEFAULT_FLAGS: FeatureFlags = {
  onboarding: true,
  passport: true,
  checkTruck: true,
  airLeakRadar: true,
  navigation: false, // Default off until configured
  bridgeShield: true,
  depotDemurrage: true,
  whistleblower: false,
  epod: true,
  marketplace: false,
  welfare: true
};

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
  const [flags, setFlags] = useState<FeatureFlags>(DEFAULT_FLAGS);
  const [showAdminPortal, setShowAdminPortal] = useState(false);
  const [activeTab, setActiveTab] = useState<string>('passport');

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

  // Canvas drawing ref
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [isDrawing, setIsDrawing] = useState(false);

  // In-Cab Vehicle State
  const [runningHeight, setRunningHeight] = useState<number>(4.45);
  const [airSuspension, setAirSuspension] = useState<'Normal (0cm)' | 'Dump Air (-8cm)' | 'Raised (+10cm)'>('Normal (0cm)');
  const [airLeakTesting, setAirLeakTesting] = useState(false);
  const [airLeakResult, setAirLeakResult] = useState<string | null>(null);
  const [checkedItems, setCheckedItems] = useState<{ [key: string]: boolean }>({});
  const [walkaroundSigned, setWalkaroundSigned] = useState(false);
  const [nightsAway, setNightsAway] = useState(16);

  // Load profile and flags from localStorage on mount
  useEffect(() => {
    try {
      const savedProfile = localStorage.getItem('dp_driver_profile');
      if (savedProfile) setProfile(JSON.parse(savedProfile));

      const savedFlags = localStorage.getItem('dp_feature_flags');
      if (savedFlags) setFlags(JSON.parse(savedFlags));
    } catch (e) {
      console.error('Error loading local state', e);
    }
    setIsLoaded(true);
  }, []);

  const toggleFlag = (key: keyof FeatureFlags) => {
    setFlags(prev => {
      const updated = { ...prev, [key]: !prev[key] };
      localStorage.setItem('dp_feature_flags', JSON.stringify(updated));
      return updated;
    });
  };

  const handleResetProfile = () => {
    if (confirm('Reset driver profile and re-test onboarding?')) {
      localStorage.removeItem('dp_driver_profile');
      setProfile(null);
      setOnboardingStep(1);
    }
  };

  const loadPresetDriver = () => {
    const preset: DriverProfile = {
      fullName: 'MR ALEXANDER JAMES KITE',
      mobile: '07123 456789',
      email: 'alexkite1975@gmail.com',
      licenceNumber: 'KITE9707185AJ9ZM 26',
      category: 'Class 1 (C+E) Artic',
      tachoCard: 'DB25029078179500',
      cpcHours: '35 / 35 Periodic Hours',
      d906Signature: 'preset_valid',
      onboardedAt: new Date().toISOString()
    };
    localStorage.setItem('dp_driver_profile', JSON.stringify(preset));
    setProfile(preset);
    setShowAdminPortal(false);
  };

  // Canvas Handlers
  const startDrawing = (e: any) => {
    setIsDrawing(true);
    draw(e);
  };

  const stopDrawing = () => {
    setIsDrawing(false);
    if (canvasRef.current) {
      setFormData(prev => ({ ...prev, d906Signature: canvasRef.current!.toDataURL() }));
    }
  };

  const draw = (e: any) => {
    if (!isDrawing && e.type !== 'mousedown' && e.type !== 'touchstart') return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const rect = canvas.getBoundingClientRect();
    const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
    const clientY = 'touches' in e ? e.touches[0].clientY : e.clientY;
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
      alert('Please enter your full legal name and licence number.');
      return;
    }
    const newProfile: DriverProfile = {
      ...formData,
      onboardedAt: new Date().toISOString()
    };
    localStorage.setItem('dp_driver_profile', JSON.stringify(newProfile));
    setProfile(newProfile);
  };

  if (!isLoaded) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center text-emerald-400 font-mono">
        Loading Drive Partners Engine...
      </div>
    );
  }

  // ==========================================
  // VIEW: ADMIN PORTAL & FEATURE FLAG CMS
  // ==========================================
  if (showAdminPortal) {
    return (
      <div className="min-h-screen bg-slate-950 text-slate-100 p-4 sm:p-6 font-sans max-w-4xl mx-auto space-y-6">
        {/* Admin Header */}
        <div className="bg-slate-900 border border-slate-800 p-5 rounded-2xl flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-xl bg-amber-500/20 border border-amber-500/50 flex items-center justify-center text-amber-400">
              <Settings className="w-5 h-5" />
            </div>
            <div>
              <h1 className="text-lg font-black text-white">DRIVE PARTNERS CMS & FEATURE FLAGS</h1>
              <p className="text-xs text-slate-400">Turn on complete modules, turn off in-progress elements, and manage test users.</p>
            </div>
          </div>
          <button
            onClick={() => setShowAdminPortal(false)}
            className="px-4 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs"
          >
            ← Return to Live Site
          </button>
        </div>

        {/* Feature Flags Grid */}
        <div className="bg-slate-900/60 border border-slate-800 p-5 rounded-2xl space-y-4">
          <h2 className="text-xs font-mono uppercase tracking-wider text-slate-400 flex items-center gap-2">
            <Sliders className="w-4 h-4 text-emerald-400" />
            Site Modules & Feature Visibility
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {[
              { key: 'onboarding', label: 'Driver Onboarding & D906 Intake', desc: 'Zero-typing licence capture & sign-on-glass' },
              { key: 'passport', label: 'Digital Roadside Passport', desc: 'DVLA licence, Smart Tacho, and CPC check' },
              { key: 'checkTruck', label: 'Check My Truck (32-Pt Check)', desc: 'Running height lock & walkaround guide' },
              { key: 'airLeakRadar', label: 'Acoustic Air Leak Radar', desc: '4kHz-8kHz microphone hissing detection' },
              { key: 'navigation', label: 'TomTom 44t Commercial Nav', desc: 'Low-bridge and weight avoidance routing' },
              { key: 'bridgeShield', label: 'Bridge Strike Collision Shield', desc: '1-mile proximity radar & Network Rail call' },
              { key: 'depotDemurrage', label: 'Gatehouse PIN & £45/h Demurrage', desc: 'Barrier PIN 8492 & live dwell counter' },
              { key: 'whistleblower', label: '4-Stage Yard Whistleblower', desc: 'Anonymous yard safety hazard escalation' },
              { key: 'epod', label: 'Paperless Delivery ePOD', desc: 'Warehouse supervisor sign-on-glass' },
              { key: 'marketplace', label: 'Haulier Direct Jobs & Loads', desc: 'Direct £28/hr shifts & £4.53/m return loads' },
              { key: 'welfare', label: 'SNAP Truckstops & HMRC Tax', desc: 'HGV parking & £34.90 tax relief vault' }
            ].map(item => {
              const active = flags[item.key as keyof FeatureFlags];
              return (
                <div
                  key={item.key}
                  onClick={() => toggleFlag(item.key as keyof FeatureFlags)}
                  className={`p-4 rounded-xl border cursor-pointer transition-all flex items-center justify-between ${
                    active
                      ? 'bg-emerald-500/10 border-emerald-500/40 text-white'
                      : 'bg-slate-950 border-slate-800 text-slate-500'
                  }`}
                >
                  <div>
                    <span className="text-xs font-bold block">{item.label}</span>
                    <span className="text-[11px] text-slate-400 block">{item.desc}</span>
                  </div>
                  <span className={`text-xs font-mono font-bold px-2.5 py-1 rounded-full ${
                    active ? 'bg-emerald-500 text-slate-950' : 'bg-slate-800 text-slate-400'
                  }`}>
                    {active ? 'ON' : 'OFF'}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        {/* User Management & Quick Presets */}
        <div className="bg-slate-900/60 border border-slate-800 p-5 rounded-2xl space-y-4">
          <h2 className="text-xs font-mono uppercase tracking-wider text-slate-400 flex items-center gap-2">
            <Users className="w-4 h-4 text-emerald-400" />
            Driver Account Testing Tools
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <button
              onClick={handleResetProfile}
              className="p-4 rounded-xl bg-slate-950 border border-red-500/30 hover:border-red-500 text-red-400 text-xs font-bold font-mono text-left"
            >
              <span className="block font-black text-sm mb-1">Wipe Active Driver Profile</span>
              Clear localStorage so you can test onboarding from scratch.
            </button>

            <button
              onClick={loadPresetDriver}
              className="p-4 rounded-xl bg-slate-950 border border-emerald-500/30 hover:border-emerald-500 text-emerald-400 text-xs font-bold font-mono text-left"
            >
              <span className="block font-black text-sm mb-1">Pre-load Verified C+E Test Profile</span>
              Instantly login as Mr Alexander Kite with verified Class 1 licence.
            </button>
          </div>
        </div>
      </div>
    );
  }

  // ==========================================
  // VIEW: DRIVER ONBOARDING (IF NO PROFILE & ON)
  // ==========================================
  if (!profile && flags.onboarding) {
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
            <button
              onClick={() => setShowAdminPortal(true)}
              className="text-xs px-2.5 py-1 rounded-full bg-slate-800 hover:bg-slate-700 text-slate-300 font-mono flex items-center gap-1"
            >
              <Settings className="w-3 h-3 text-amber-400" /> CMS
            </button>
          </div>

          <div className="flex items-center gap-2 mt-4">
            <div className={`flex-1 h-1.5 rounded-full ${onboardingStep >= 1 ? 'bg-emerald-500' : 'bg-slate-800'}`} />
            <div className={`flex-1 h-1.5 rounded-full ${onboardingStep >= 2 ? 'bg-emerald-500' : 'bg-slate-800'}`} />
            <div className={`flex-1 h-1.5 rounded-full ${onboardingStep >= 3 ? 'bg-emerald-500' : 'bg-slate-800'}`} />
          </div>
        </div>

        <div className="flex-1">
          {onboardingStep === 1 && (
            <div className="space-y-4">
              <div className="bg-slate-900/80 border border-slate-800 p-4 rounded-2xl">
                <h2 className="text-lg font-bold text-white mb-1">Create Your Driver Account</h2>
                <p className="text-xs text-slate-400">Welcome to Drive Partners. Enter your legal details to activate your in-cab credentials.</p>
              </div>

              <div>
                <label className="block text-xs font-mono uppercase text-slate-400 mb-1.5">Full Legal Name</label>
                <input
                  type="text"
                  placeholder="e.g. MR ALEXANDER JAMES KITE"
                  value={formData.fullName}
                  onChange={e => setFormData({ ...formData, fullName: e.target.value.toUpperCase() })}
                  className="w-full bg-slate-900 border border-slate-800 focus:border-emerald-500 rounded-xl px-4 py-3.5 text-base font-bold text-white placeholder-slate-600 outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-mono uppercase text-slate-400 mb-1.5">Mobile Phone (for gate PINs)</label>
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
                className="w-full mt-6 py-4 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black text-base flex items-center justify-center gap-2"
              >
                Continue to Licence Details →
              </button>
            </div>
          )}

          {onboardingStep === 2 && (
            <div className="space-y-4">
              <div className="bg-slate-900/80 border border-slate-800 p-4 rounded-2xl">
                <h2 className="text-lg font-bold text-white mb-1">Commercial Entitlement</h2>
                <p className="text-xs text-slate-400">Enter your DVLA photocard licence and Smart Tachograph card.</p>
              </div>

              <div>
                <label className="block text-xs font-mono uppercase text-slate-400 mb-1.5">DVLA Driving Licence Number</label>
                <input
                  type="text"
                  placeholder="e.g. KITE9707185AJ9ZM 26"
                  maxLength={19}
                  value={formData.licenceNumber}
                  onChange={e => setFormData({ ...formData, licenceNumber: e.target.value.toUpperCase() })}
                  className="w-full bg-slate-900 border border-slate-800 focus:border-emerald-500 rounded-xl px-4 py-3.5 text-base font-mono font-bold text-emerald-400 tracking-wider outline-none"
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
                      className={`p-3 rounded-xl border text-xs font-bold text-center ${
                        formData.category === cat
                          ? 'bg-emerald-500/20 border-emerald-500 text-emerald-400'
                          : 'bg-slate-900 border-slate-800 text-slate-400'
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
                  className="w-full bg-slate-900 border border-slate-800 focus:border-emerald-500 rounded-xl px-4 py-3.5 text-base font-mono text-white outline-none"
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
                  className="flex-[2] py-3.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black text-sm"
                >
                  Continue to D906 Sign-off →
                </button>
              </div>
            </div>
          )}

          {onboardingStep === 3 && (
            <div className="space-y-4">
              <div className="bg-slate-900/80 border border-slate-800 p-4 rounded-2xl">
                <h2 className="text-lg font-bold text-white mb-1">D906 Electronic Consent</h2>
                <p className="text-xs text-slate-400 leading-relaxed">
                  Under DVLA Access to Driver Data (ADD) rules, sign below to authorise Drive Partners to periodically check your entitlement and tacho validity.
                </p>
              </div>

              <div className="border border-slate-800 rounded-2xl overflow-hidden bg-slate-900 touch-none">
                <canvas
                  ref={canvasRef}
                  width={480}
                  height={150}
                  onMouseDown={startDrawing}
                  onMouseUp={stopDrawing}
                  onMouseMove={draw}
                  onTouchStart={startDrawing}
                  onTouchEnd={stopDrawing}
                  onTouchMove={draw}
                  className="w-full h-36 cursor-crosshair bg-slate-950"
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
                  className="flex-[2] py-4 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black text-sm flex items-center justify-center gap-2"
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
  // VIEW: LIVE DRIVER COMMAND CENTRE
  // ==========================================
  const activeDriver = profile || {
    fullName: 'MR ALEXANDER JAMES KITE',
    category: 'Class 1 (C+E) Artic',
    licenceNumber: 'KITE9707185AJ9ZM 26',
    tachoCard: 'DB25029078179500',
    cpcHours: '35 / 35 Periodic Hours'
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 p-3 sm:p-5 font-sans max-w-5xl mx-auto space-y-4">
      {/* 1. TOP IN-CAB HUD */}
      <div className="bg-slate-900/90 border border-slate-800 p-3.5 sm:p-4 rounded-2xl flex flex-wrap items-center justify-between gap-3 shadow-xl">
        <div className="flex items-center gap-3">
          <div className="h-11 w-11 rounded-xl bg-emerald-500/20 border border-emerald-500/50 flex items-center justify-center font-black text-emerald-400 text-base">
            {activeDriver.fullName.slice(0, 2)}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-sm sm:text-base font-black text-white">{activeDriver.fullName}</h1>
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

        <div className="flex items-center gap-2">
          <button
            onClick={() => setShowAdminPortal(true)}
            className="px-3 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700 text-amber-400 text-xs font-mono font-bold flex items-center gap-1.5"
          >
            <Settings className="w-3.5 h-3.5" /> CMS Admin
          </button>
          <button
            onClick={handleResetProfile}
            className="px-3 py-2 rounded-xl bg-slate-800 hover:bg-red-950/40 border border-slate-700 text-slate-300 hover:text-red-400 text-xs font-mono font-bold flex items-center gap-1.5"
          >
            <RotateCcw className="w-3.5 h-3.5" /> Reset
          </button>
        </div>
      </div>

      {/* 2. SHIFT STEPPER TABS (ONLY SHOWS FLAGS TURNED ON) */}
      <div className="bg-slate-900/60 border border-slate-800 p-1.5 rounded-2xl flex items-center gap-1 overflow-x-auto scrollbar-none text-xs font-mono">
        {flags.passport && (
          <button
            onClick={() => setActiveTab('passport')}
            className={`px-3.5 py-2.5 rounded-xl whitespace-nowrap font-bold transition-all ${
              activeTab === 'passport' ? 'bg-emerald-500 text-slate-950' : 'text-slate-400 hover:text-white'
            }`}
          >
            1. Passport
          </button>
        )}
        {flags.checkTruck && (
          <button
            onClick={() => setActiveTab('check_truck')}
            className={`px-3.5 py-2.5 rounded-xl whitespace-nowrap font-bold transition-all ${
              activeTab === 'check_truck' ? 'bg-emerald-500 text-slate-950' : 'text-slate-400 hover:text-white'
            }`}
          >
            2. Check Truck
          </button>
        )}
        {flags.bridgeShield && (
          <button
            onClick={() => setActiveTab('bridge_shield')}
            className={`px-3.5 py-2.5 rounded-xl whitespace-nowrap font-bold transition-all ${
              activeTab === 'bridge_shield' ? 'bg-emerald-500 text-slate-950' : 'text-slate-400 hover:text-white'
            }`}
          >
            3. Bridge Shield
          </button>
        )}
        {flags.depotDemurrage && (
          <button
            onClick={() => setActiveTab('depot_demurrage')}
            className={`px-3.5 py-2.5 rounded-xl whitespace-nowrap font-bold transition-all ${
              activeTab === 'depot_demurrage' ? 'bg-emerald-500 text-slate-950' : 'text-slate-400 hover:text-white'
            }`}
          >
            4. Depot & Dwell
          </button>
        )}
        {flags.epod && (
          <button
            onClick={() => setActiveTab('epod')}
            className={`px-3.5 py-2.5 rounded-xl whitespace-nowrap font-bold transition-all ${
              activeTab === 'epod' ? 'bg-emerald-500 text-slate-950' : 'text-slate-400 hover:text-white'
            }`}
          >
            5. ePOD Delivery
          </button>
        )}
        {flags.welfare && (
          <button
            onClick={() => setActiveTab('welfare')}
            className={`px-3.5 py-2.5 rounded-xl whitespace-nowrap font-bold transition-all ${
              activeTab === 'welfare' ? 'bg-emerald-500 text-slate-950' : 'text-slate-400 hover:text-white'
            }`}
          >
            6. Rest & Tax
          </button>
        )}
      </div>

      {/* 3. ACTIVE TAB CONTENT BODY */}
      <div className="space-y-4">
        {/* TAB: PASSPORT */}
        {activeTab === 'passport' && flags.passport && (
          <div className="bg-slate-900/50 border border-slate-800 rounded-2xl p-5 space-y-4">
            <h2 className="text-sm font-mono uppercase tracking-wider text-slate-400 flex items-center gap-2">
              <Award className="w-4 h-4 text-emerald-400" /> Roadside DVSA Digital Passport
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div className="bg-slate-950 border border-slate-800 p-4 rounded-xl">
                <span className="text-[10px] font-mono uppercase text-slate-500 block">DVLA Licence</span>
                <span className="text-base font-bold font-mono text-emerald-400">{activeDriver.licenceNumber}</span>
                <span className="text-[11px] text-slate-400 block mt-1">{activeDriver.category} • 0 Points</span>
              </div>
              <div className="bg-slate-950 border border-slate-800 p-4 rounded-xl">
                <span className="text-[10px] font-mono uppercase text-slate-500 block">Smart Digi-Tacho</span>
                <span className="text-base font-bold font-mono text-white">{activeDriver.tachoCard || 'Active Card'}</span>
                <span className="text-[11px] text-emerald-400 block mt-1">Gen 2 Valid</span>
              </div>
              <div className="bg-slate-950 border border-slate-800 p-4 rounded-xl">
                <span className="text-[10px] font-mono uppercase text-slate-500 block">CPC Periodic Hours</span>
                <span className="text-base font-bold font-mono text-emerald-400">{activeDriver.cpcHours}</span>
                <span className="text-[11px] text-slate-400 block mt-1">DQC Valid</span>
              </div>
            </div>
          </div>
        )}

        {/* TAB: CHECK TRUCK */}
        {activeTab === 'check_truck' && flags.checkTruck && (
          <div className="space-y-4">
            <div className="bg-slate-900/60 border border-slate-800 p-5 rounded-2xl">
              <span className="text-xs font-mono uppercase text-slate-400 block mb-2">Lock In-Cab Height Placard</span>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                {[4.00, 4.20, 4.45, 4.88].map(m => (
                  <button
                    key={m}
                    onClick={() => setRunningHeight(m)}
                    className={`p-4 rounded-xl border text-center transition-all ${
                      runningHeight === m
                        ? 'bg-amber-500/20 border-amber-500 text-amber-400 font-black'
                        : 'bg-slate-950 border-slate-800 text-slate-400'
                    }`}
                  >
                    <span className="text-lg font-black block">{m.toFixed(2)}m</span>
                  </button>
                ))}
              </div>
            </div>

            {flags.airLeakRadar && (
              <div className="bg-slate-900/60 border border-slate-800 p-5 rounded-2xl flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-bold text-white flex items-center gap-2">
                    <Mic className="w-4 h-4 text-emerald-400" /> Acoustic Air Leak Radar
                  </h3>
                  <p className="text-xs text-slate-400">Listens for pneumatic hissing (4kHz-8kHz) at brake lines.</p>
                </div>
                <button
                  onClick={() => {
                    setAirLeakTesting(true);
                    setTimeout(() => {
                      setAirLeakTesting(false);
                      setAirLeakResult('SEALED (PASS) ✓');
                    }, 2000);
                  }}
                  className="px-4 py-2.5 rounded-xl bg-emerald-500 text-slate-950 font-bold text-xs"
                >
                  {airLeakTesting ? 'Testing...' : (airLeakResult || 'Test Air Lines')}
                </button>
              </div>
            )}
          </div>
        )}

        {/* TAB: BRIDGE SHIELD */}
        {activeTab === 'bridge_shield' && flags.bridgeShield && (
          <div className="bg-red-950/40 border-2 border-red-500/80 p-5 rounded-2xl space-y-3">
            <span className="text-xs font-mono font-bold text-red-400 flex items-center gap-1.5 animate-pulse">
              <AlertTriangle className="w-4 h-4" /> 1-MILE BRIDGE COLLISION PROXIMITY RADAR
            </span>
            <h3 className="text-lg font-black text-white">Watford Junction (St Albans Rd Girder Bridge)</h3>
            <p className="text-xs text-red-300">Signed Clearance: 4.40m • Your Truck: {runningHeight.toFixed(2)}m</p>
            <a
              href="tel:03457114141"
              className="w-full py-4 rounded-xl bg-red-600 hover:bg-red-500 text-white font-black text-sm flex items-center justify-center gap-2"
            >
              <PhoneCall className="w-5 h-5" /> Call Network Rail Emergency: 03457 11 41 41
            </a>
          </div>
        )}

        {/* TAB: DEPOT DEMURRAGE */}
        {activeTab === 'depot_demurrage' && flags.depotDemurrage && (
          <div className="space-y-4">
            <div className="bg-slate-900/60 border border-slate-800 p-5 rounded-2xl grid grid-cols-2 gap-3 text-center">
              <div className="bg-slate-950 border border-slate-800 p-4 rounded-xl">
                <span className="text-[10px] font-mono text-slate-500 block">Freight PIN</span>
                <span className="text-2xl font-black font-mono text-emerald-400">8492</span>
              </div>
              <div className="bg-slate-950 border border-slate-800 p-4 rounded-xl">
                <span className="text-[10px] font-mono text-slate-500 block">Assigned Dock</span>
                <span className="text-2xl font-black font-mono text-amber-400">BAY #24</span>
              </div>
            </div>

            <div className="bg-slate-900/60 border border-slate-800 p-5 rounded-2xl flex items-center justify-between">
              <div>
                <h3 className="text-sm font-bold text-white flex items-center gap-2">
                  <Clock className="w-4 h-4 text-red-400" /> Demurrage (£45.00/hr)
                </h3>
                <p className="text-xs text-slate-400">Free time 60m • Dwell 95m (35m billable)</p>
              </div>
              <span className="text-xl font-black font-mono text-red-400">£26.25 ACCRUING</span>
            </div>
          </div>
        )}

        {/* TAB: EPOD */}
        {activeTab === 'epod' && flags.epod && (
          <div className="bg-slate-900/60 border border-slate-800 p-5 rounded-2xl space-y-3">
            <h3 className="text-sm font-bold text-white">Electronic Proof of Delivery (e-POD)</h3>
            <p className="text-xs text-slate-400">CMR-88291 • Park Royal Cross-Dock</p>
            <button
              onClick={() => alert('Delivery confirmed & signed! Payment escrow released.')}
              className="w-full py-4 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black text-sm flex items-center justify-center gap-2"
            >
              <CheckCircle2 className="w-5 h-5" /> Complete Delivery & Release Payment
            </button>
          </div>
        )}

        {/* TAB: WELFARE & TAX */}
        {activeTab === 'welfare' && flags.welfare && (
          <div className="bg-slate-900/60 border border-slate-800 p-5 rounded-2xl space-y-3">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-bold text-white">HMRC £34.90 Overnight Subsistence</h3>
                <p className="text-xs text-slate-400">Qualifying nights away: {nightsAway}</p>
              </div>
              <span className="text-xl font-black font-mono text-emerald-400">£{(nightsAway * 34.90).toFixed(2)}</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
"""

with open('src/app/page.tsx', 'w', encoding='utf-8') as f:
    f.write(page_code)

print("✓ src/app/page.tsx written successfully.")
