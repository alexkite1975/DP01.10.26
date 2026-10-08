'use client';

import React, { useState, useRef } from 'react';
import Link from 'next/link';
import {
  Truck, Briefcase, Award, ShieldCheck, CheckCircle2,
  ArrowRight, ArrowLeft, Camera, FileText, Sliders, CheckSquare, KeyRound,
  Globe, UploadCloud, Sparkles, CreditCard, Clock, Check, AlertCircle
} from 'lucide-react';
import { DriverLicenceProfile } from '@/types';

type Role = 'none' | 'driver' | 'haulier';

export default function OnboardingPage() {
  const [role, setRole] = useState<Role>('none');
  const [driverStep, setDriverStep] = useState(1);
  const [haulierStep, setHaulierStep] = useState(1);

  // Driver Form State (Trinity of Verification + Language)
  const [driverData, setDriverData] = useState({
    fullName: 'Alexander James Kite',
    licenceNumber: 'KITE9707185AJ9ZM',
    category: 'Class 1 (C+E) Articulated Heavy Goods (44t)',
    points: 0,
    tachoCardNumber: 'DB25029078179500',
    cpcHours: 35,
    cpcExpiryDate: '2029-09-10',
    dqcCardNumber: 'DQC-GB-9821049',
    appLanguage: 'EN' as 'EN' | 'PL' | 'RO' | 'LT' | 'BG' | 'ES',
    distanceUnits: 'miles',
    runningHeight: '4.45m (14ft 7in)',
    navPreference: 'in-app-tomtom',
    d906Signed: false,
    licenceScanned: true,
    tachoScanned: true,
    cpcScanned: true,
  });

  // Haulier Form State
  const [haulierData, setHaulierData] = useState({
    companyName: 'Drive Partners Logistics Ltd',
    operatingLicence: 'OF2049182',
    fleetSize: '15 Tractors / 22 Trailers',
    primaryDepot: 'Park Royal NW10',
    transportManager: 'John Smith (CPC National)'
  });

  const [signature, setSignature] = useState(false);

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans flex flex-col justify-between p-4 sm:p-6">
      {/* Top Header */}
      <header className="max-w-4xl mx-auto w-full flex items-center justify-between pb-6 border-b border-slate-800">
        <div className="flex items-center gap-3">
          <Link href="/" className="h-10 w-10 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-center text-slate-400 hover:text-white transition">
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <div>
            <h1 className="text-lg font-black tracking-tight text-white flex items-center gap-2">
              DRIVE PARTNERS
              <span className="text-[10px] bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 px-2 py-0.5 rounded-full font-mono font-bold">
                ONBOARDING
              </span>
            </h1>
            <p className="text-xs text-slate-400 font-mono">Workflow 1 • Role Setup & Compliance Verification</p>
          </div>
        </div>

        {role !== 'none' && (
          <button
            onClick={() => { setRole('none'); setDriverStep(1); setHaulierStep(1); }}
            className="text-xs font-mono text-slate-400 hover:text-white px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-800"
          >
            Switch Role
          </button>
        )}
      </header>

      {/* Main Container */}
      <main className="max-w-4xl mx-auto w-full py-8 flex-1">
        {/* ======================================================== */}
        {/* SCREEN 1: ROLE SELECTION                                 */}
        {/* ======================================================== */}
        {role === 'none' && (
          <div className="space-y-6 max-w-2xl mx-auto text-center">
            <div className="space-y-2">
              <span className="text-xs font-mono uppercase tracking-wider text-emerald-400 font-bold bg-emerald-500/10 border border-emerald-500/30 px-3 py-1 rounded-full inline-block">
                Select Your Operating Role
              </span>
              <h2 className="text-2xl sm:text-3xl font-black text-white">
                Welcome to Drive Partners
              </h2>
              <p className="text-sm text-slate-400">
                Choose your account type to configure your specialized workflow, licences, and operational tools.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4 text-left">
              {/* 1-Tap Google & Apple Open Auth */}
            <div className="bg-slate-900/60 border border-slate-800 p-5 rounded-3xl space-y-3 sm:col-span-2">
              <span className="text-[11px] font-mono uppercase tracking-wider text-slate-400 font-bold block text-center">
                1-Tap Open Authentication
              </span>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => alert('✓ Authenticated via Google Open Auth as alexander.kite@drivepartners.app')}
                  className="w-full py-3.5 px-4 rounded-2xl bg-white hover:bg-slate-100 text-slate-900 font-bold text-xs flex items-center justify-center gap-2 shadow-md transition"
                >
                  <span className="text-base font-black text-blue-600">G</span> Continue with Google
                </button>
                <button
                  type="button"
                  onClick={() => alert('✓ Authenticated via Apple Open Auth as alexander.kite@drivepartners.app')}
                  className="w-full py-3.5 px-4 rounded-2xl bg-slate-950 hover:bg-black border border-slate-700 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-md transition"
                >
                  <span className="text-base"></span> Continue with Apple
                </button>
              </div>
            </div>

            <div className="sm:col-span-2 relative py-1">
              <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-slate-800"></div></div>
              <div className="relative flex justify-center text-[10px] uppercase font-mono"><span className="bg-slate-950 px-3 text-slate-500 font-bold">Or Select Role Below</span></div>
            </div>

            {/* Option A: HGV Driver */}
              <div
                onClick={() => setRole('driver')}
                className="group cursor-pointer bg-slate-900/80 hover:bg-slate-900 border border-slate-800 hover:border-emerald-500/60 p-6 rounded-3xl space-y-4 transition shadow-xl flex flex-col justify-between"
              >
                <div className="space-y-3">
                  <div className="h-12 w-12 rounded-2xl bg-emerald-500/20 border border-emerald-500/50 flex items-center justify-center text-emerald-400 group-hover:scale-105 transition">
                    <Truck className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="text-lg font-black text-white group-hover:text-emerald-400 transition flex items-center justify-between">
                      HGV Driver <ArrowRight className="w-4 h-4" />
                    </h3>
                    <p className="text-xs text-slate-400 mt-1">
                      Driver-first command centre: digital DVSA passport, Vehicle Check, Route Optimiser, Bridge Strike Shield, and £45/hr demurrage.
                    </p>
                  </div>
                </div>
                <div className="pt-3 border-t border-slate-800 text-xs font-mono font-bold text-emerald-400">
                  Begin Driver Intake →
                </div>
              </div>

              {/* Option B: Haulier / Fleet */}
              <div
                onClick={() => setRole('haulier')}
                className="group cursor-pointer bg-slate-900/80 hover:bg-slate-900 border border-slate-800 hover:border-blue-500/60 p-6 rounded-3xl space-y-4 transition shadow-xl flex flex-col justify-between"
              >
                <div className="space-y-3">
                  <div className="h-12 w-12 rounded-2xl bg-blue-500/20 border border-blue-500/50 flex items-center justify-center text-blue-400 group-hover:scale-105 transition">
                    <Briefcase className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="text-lg font-black text-white group-hover:text-blue-400 transition flex items-center justify-between">
                      Haulier / Fleet <ArrowRight className="w-4 h-4" />
                    </h3>
                    <p className="text-xs text-slate-400 mt-1">
                      Transport operator portal: live 1Hz fleet tracking, direct driver dispatch at £28/hr, return load exchange, and compliance audit.
                    </p>
                  </div>
                </div>
                <div className="pt-3 border-t border-slate-800 text-xs font-mono font-bold text-blue-400">
                  Register Fleet Profile →
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ======================================================== */}
        {/* DRIVER ONBOARDING FLOW (TRINITY + LANGUAGE + D906)       */}
        {/* ======================================================== */}
        {role === 'driver' && (
          <div className="max-w-2xl mx-auto space-y-6">
            {/* Stepper Progress */}
            <div className="flex items-center justify-between border-b border-slate-800 pb-3 text-xs font-mono">
              <span className={driverStep >= 1 ? 'text-emerald-400 font-bold' : 'text-slate-600'}>1. Licence Scan</span>
              <span className="text-slate-600">→</span>
              <span className={driverStep >= 2 ? 'text-emerald-400 font-bold' : 'text-slate-600'}>2. Tacho &amp; CPC</span>
              <span className="text-slate-600">→</span>
              <span className={driverStep >= 3 ? 'text-emerald-400 font-bold' : 'text-slate-600'}>3. Language &amp; Units</span>
              <span className="text-slate-600">→</span>
              <span className={driverStep >= 4 ? 'text-emerald-400 font-bold' : 'text-slate-600'}>4. D906 Consent</span>
            </div>

            {/* Step 1: Scan Driving Licence */}
            {driverStep === 1 && (
              <div className="bg-slate-900 border border-slate-800 p-6 rounded-3xl space-y-5">
                <div className="space-y-1">
                  <div className="flex items-center justify-between">
                    <h2 className="text-xl font-black text-white flex items-center gap-2">
                      <Camera className="w-5 h-5 text-emerald-400" />
                      Step 1 of 4: Scan Driving Licence (DVLA Photocard)
                    </h2>
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-400 border border-emerald-500/40">
                      CARD 1 OF 3
                    </span>
                  </div>
                  <p className="text-xs text-slate-400">
                    Establishes your legal identity, DOB, and heavy goods category entitlement (Class 1 C+E).
                  </p>
                </div>

                {/* Card Scan Visual Box */}
                <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-3">
                  <div className="flex items-center justify-between text-xs font-mono">
                    <span className="text-slate-400 flex items-center gap-1.5">
                      <CreditCard className="w-4 h-4 text-emerald-400" />
                      <span>DVLA UK DRIVING LICENCE</span>
                    </span>
                    <span className="text-emerald-400 font-bold flex items-center gap-1">
                      <Check className="w-3.5 h-3.5" /> FRONT SCANNED
                    </span>
                  </div>

                  <div className="bg-slate-900/80 border border-slate-800 p-3.5 rounded-xl space-y-2.5 font-mono text-xs">
                    <div>
                      <label className="text-slate-500 block text-[10px] uppercase">Full Legal Name</label>
                      <input
                        type="text"
                        value={driverData.fullName}
                        onChange={e => setDriverData({ ...driverData, fullName: e.target.value })}
                        className="w-full bg-transparent border-b border-slate-700 py-1 text-white font-bold outline-none"
                      />
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <label className="text-slate-500 block text-[10px] uppercase">DVLA Licence Number</label>
                        <input
                          type="text"
                          value={driverData.licenceNumber}
                          onChange={e => setDriverData({ ...driverData, licenceNumber: e.target.value })}
                          className="w-full bg-transparent border-b border-slate-700 py-1 text-emerald-400 font-bold outline-none tracking-wider"
                        />
                      </div>
                      <div>
                        <label className="text-slate-500 block text-[10px] uppercase">Category Entitlement</label>
                        <input
                          type="text"
                          value={driverData.category}
                          onChange={e => setDriverData({ ...driverData, category: e.target.value })}
                          className="w-full bg-transparent border-b border-slate-700 py-1 text-cyan-300 font-bold outline-none"
                        />
                      </div>
                    </div>
                    <div className="flex items-center justify-between pt-1 text-[11px]">
                      <span className="text-slate-400">DVLA Endorsements / Points:</span>
                      <span className="text-emerald-400 font-bold font-mono">0 Points (100% Clean)</span>
                    </div>
                  </div>
                </div>

                <button
                  onClick={() => setDriverStep(2)}
                  className="w-full py-3.5 rounded-2xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black text-sm transition flex items-center justify-center gap-2 cursor-pointer shadow-lg shadow-emerald-500/20"
                >
                  Confirm Licence &amp; Proceed to Tacho &amp; CPC Cards →
                </button>
              </div>
            )}

            {/* Step 2: Digi-Tacho & CPC (Cards 2 & 3) */}
            {driverStep === 2 && (
              <div className="bg-slate-900 border border-slate-800 p-6 rounded-3xl space-y-5">
                <div className="space-y-1">
                  <div className="flex items-center justify-between">
                    <h2 className="text-xl font-black text-white flex items-center gap-2">
                      <Award className="w-5 h-5 text-emerald-400" />
                      Step 2 of 4: Scan Smart Tacho Card &amp; Driver CPC (DQC)
                    </h2>
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-blue-500/20 text-blue-300 border border-blue-500/40">
                      CARDS 2 &amp; 3 OF 3
                    </span>
                  </div>
                  <p className="text-xs text-slate-400">
                    Binds your tachograph chip number to your licence to prevent mixed slips, and tracks your 35h CPC renewal.
                  </p>
                </div>

                {/* Card 2: Smart Tachograph Driver Card */}
                <div className="p-4 rounded-2xl bg-slate-950 border border-cyan-500/30 space-y-3">
                  <div className="flex items-center justify-between text-xs font-mono">
                    <span className="text-cyan-400 flex items-center gap-1.5 font-bold">
                      <Sparkles className="w-4 h-4 text-cyan-400" />
                      <span>CARD 2: SMART TACHOGRAPH CARD (GEN 2)</span>
                    </span>
                    <span className="text-[10px] px-2 py-0.5 rounded bg-cyan-950 text-cyan-300 border border-cyan-800">
                      DVLA CHIP COMPLIANT
                    </span>
                  </div>

                  <div className="bg-slate-900/80 border border-slate-800 p-3.5 rounded-xl space-y-2 font-mono text-xs">
                    <div>
                      <label className="text-slate-500 block text-[10px] uppercase">Smart Tachograph Card Number</label>
                      <input
                        type="text"
                        value={driverData.tachoCardNumber}
                        onChange={e => setDriverData({ ...driverData, tachoCardNumber: e.target.value })}
                        className="w-full bg-transparent border-b border-slate-700 py-1 text-cyan-300 font-bold outline-none tracking-wider"
                      />
                    </div>
                    <div className="text-[11px] text-emerald-400 flex items-center gap-1.5 pt-1">
                      <Check className="w-3.5 h-3.5 shrink-0" />
                      <span>Cryptographically bound: Licence on chip matches {driverData.licenceNumber}</span>
                    </div>
                  </div>
                </div>

                {/* Card 3: Driver CPC Qualification Card */}
                <div className="p-4 rounded-2xl bg-slate-950 border border-amber-500/30 space-y-3">
                  <div className="flex items-center justify-between text-xs font-mono">
                    <span className="text-amber-400 flex items-center gap-1.5 font-bold">
                      <Award className="w-4 h-4 text-amber-400" />
                      <span>CARD 3: DRIVER QUALIFICATION CARD (CPC / DQC)</span>
                    </span>
                    <span className="text-[10px] px-2 py-0.5 rounded bg-emerald-950 text-emerald-300 border border-emerald-800">
                      35 / 35 HOURS VALID
                    </span>
                  </div>

                  <div className="bg-slate-900/80 border border-slate-800 p-3.5 rounded-xl space-y-2 font-mono text-xs">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <label className="text-slate-500 block text-[10px] uppercase">DQC Card Number</label>
                        <input
                          type="text"
                          value={driverData.dqcCardNumber}
                          onChange={e => setDriverData({ ...driverData, dqcCardNumber: e.target.value })}
                          className="w-full bg-transparent border-b border-slate-700 py-1 text-white font-bold outline-none"
                        />
                      </div>
                      <div>
                        <label className="text-slate-500 block text-[10px] uppercase">Periodic CPC Expiry Date</label>
                        <input
                          type="date"
                          value={driverData.cpcExpiryDate}
                          onChange={e => setDriverData({ ...driverData, cpcExpiryDate: e.target.value })}
                          className="w-full bg-transparent border-b border-slate-700 py-1 text-amber-300 font-bold outline-none"
                        />
                      </div>
                    </div>
                    <div className="flex items-center justify-between pt-1 text-[11px]">
                      <span className="text-slate-400">Periodic CPC Status:</span>
                      <span className="text-emerald-400 font-bold">100% Roadside Compliant (Expires 2029)</span>
                    </div>
                  </div>
                </div>

                <div className="flex gap-2">
                  <button
                    onClick={() => setDriverStep(1)}
                    className="px-5 py-3.5 rounded-2xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold text-xs cursor-pointer"
                  >
                    Back
                  </button>
                  <button
                    onClick={() => setDriverStep(3)}
                    className="flex-1 py-3.5 rounded-2xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black text-sm transition flex items-center justify-center gap-2 cursor-pointer shadow-lg shadow-emerald-500/20"
                  >
                    Confirm Cards &amp; Choose In-Cab Language →
                  </button>
                </div>
              </div>
            )}

            {/* Step 3: Driver Preferred Language & In-Cab Units */}
            {driverStep === 3 && (
              <div className="bg-slate-900 border border-slate-800 p-6 rounded-3xl space-y-5">
                <div className="space-y-1">
                  <h2 className="text-xl font-black text-white flex items-center gap-2">
                    <Globe className="w-5 h-5 text-emerald-400" />
                    Step 3 of 4: Preferred In-Cab Language &amp; Placard
                  </h2>
                  <p className="text-xs text-slate-400">
                    Choose your native language for in-cab audio coaching, countdown warnings, and scanning tips.
                  </p>
                </div>

                {/* Roadside Dual-Language Notice */}
                <div className="p-3.5 rounded-2xl bg-cyan-950/40 border border-cyan-500/30 text-xs font-mono text-cyan-200 space-y-1">
                  <div className="flex items-center gap-2 font-bold text-cyan-300">
                    <ShieldCheck className="w-4 h-4 text-cyan-400 shrink-0" />
                    <span>Statutory UK Roadside Guarantee (EC 561/2006)</span>
                  </div>
                  <p className="text-[11px] text-slate-300 leading-relaxed font-sans">
                    DVSA roadside examiner dossiers, clean shield defense packs, and official compliance reports are always exported in legal UK English for enforcement officers. Your native language here dictates in-cab voice warnings, AI shift debriefs, and OCR tips.
                  </p>
                </div>

                {/* Language Grid */}
                <div className="space-y-2">
                  <label className="text-xs font-mono uppercase text-slate-400 block font-bold">
                    Select In-Cab AI Co-Pilot Language
                  </label>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
                    {[
                      { code: 'EN', flag: '🇬🇧', name: 'English (UK)', desc: 'Standard UK Fleet' },
                      { code: 'PL', flag: '🇵🇱', name: 'Polski', desc: 'Asystent Kierowcy' },
                      { code: 'RO', flag: '🇷🇴', name: 'Română', desc: 'Asistent Rutier' },
                      { code: 'LT', flag: '🇱🇹', name: 'Lietuvių', desc: 'Kabinos Asistentas' },
                      { code: 'BG', flag: '🇧🇬', name: 'Български', desc: 'Гласов Асистент' },
                      { code: 'ES', flag: '🇪🇸', name: 'Español', desc: 'Asistente en Cabina' },
                    ].map(lang => {
                      const isSelected = driverData.appLanguage === lang.code;
                      return (
                        <button
                          key={lang.code}
                          type="button"
                          onClick={() => setDriverData({ ...driverData, appLanguage: lang.code as any })}
                          className={`p-3 rounded-2xl border text-left transition-all cursor-pointer flex flex-col justify-between ${
                            isSelected
                              ? 'bg-emerald-500/20 border-emerald-500 text-white shadow-md shadow-emerald-950/40'
                              : 'bg-slate-950 border-slate-800 text-slate-400 hover:border-slate-700'
                          }`}
                        >
                          <div className="flex items-center justify-between">
                            <span className="text-2xl">{lang.flag}</span>
                            {isSelected && <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />}
                          </div>
                          <div className="mt-2">
                            <div className="text-xs font-bold text-white">{lang.name}</div>
                            <div className="text-[10px] font-mono text-slate-400">{lang.desc}</div>
                          </div>
                        </button>
                      );
                    })}
                  </div>
                </div>

                <div className="space-y-4 pt-2 border-t border-slate-800">
                  <div>
                    <label className="text-xs font-mono uppercase text-slate-400 mb-1 block">Default Running Height Placard</label>
                    <select
                      value={driverData.runningHeight}
                      onChange={e => setDriverData({ ...driverData, runningHeight: e.target.value })}
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-sm text-white font-mono outline-none"
                    >
                      <option value="4.45m (14ft 7in)">4.45m (14ft 7in) - Standard UK High-Cube Artic</option>
                      <option value="4.20m (13ft 9in)">4.20m (13ft 9in) - Standard Curtain-Sider</option>
                      <option value="4.88m (16ft 0in)">4.88m (16ft 0in) - Super-Cube Double Deck Trailer</option>
                      <option value="4.00m (13ft 1in)">4.00m (13ft 1in) - Continental European Limit</option>
                    </select>
                  </div>

                  <div>
                    <label className="text-xs font-mono uppercase text-slate-400 mb-1 block">Distance &amp; Height Measurement Units</label>
                    <div className="grid grid-cols-2 gap-2">
                      <button
                        type="button"
                        onClick={() => setDriverData({ ...driverData, distanceUnits: 'miles' })}
                        className={`py-3 rounded-xl border text-xs font-mono font-bold cursor-pointer ${
                          driverData.distanceUnits === 'miles'
                            ? 'bg-emerald-500/20 border-emerald-500/60 text-emerald-400'
                            : 'bg-slate-950 border-slate-800 text-slate-400'
                        }`}
                      >
                        UK (Miles &amp; Feet/Inches)
                      </button>
                      <button
                        type="button"
                        onClick={() => setDriverData({ ...driverData, distanceUnits: 'km' })}
                        className={`py-3 rounded-xl border text-xs font-mono font-bold cursor-pointer ${
                          driverData.distanceUnits === 'km'
                            ? 'bg-emerald-500/20 border-emerald-500/60 text-emerald-400'
                            : 'bg-slate-950 border-slate-800 text-slate-400'
                        }`}
                      >
                        EU (Kilometres &amp; Metres)
                      </button>
                    </div>
                  </div>
                </div>

                <div className="flex gap-2">
                  <button
                    onClick={() => setDriverStep(2)}
                    className="px-5 py-3.5 rounded-2xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold text-xs cursor-pointer"
                  >
                    Back
                  </button>
                  <button
                    onClick={() => setDriverStep(4)}
                    className="flex-1 py-3.5 rounded-2xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black text-sm transition flex items-center justify-center gap-2 cursor-pointer shadow-lg shadow-emerald-500/20"
                  >
                    Confirm &amp; Proceed to D906 Consent →
                  </button>
                </div>
              </div>
            )}

            {/* Step 4: D906 Electronic Mandate Sign-On-Glass */}
            {driverStep === 4 && (
              <div className="bg-slate-900 border border-slate-800 p-6 rounded-3xl space-y-5">
                <div className="space-y-1">
                  <h2 className="text-xl font-black text-white flex items-center gap-2">
                    <ShieldCheck className="w-5 h-5 text-emerald-400" />
                    Step 4 of 4: D906 Electronic Mandate Consent
                  </h2>
                  <p className="text-xs text-slate-400">
                    Mandatory sign-on-glass declaration permitting DVLA Access to Driver Data (ADD).
                  </p>
                </div>

                <div className="bg-slate-950 border border-slate-800 p-4 rounded-2xl space-y-2 text-xs text-slate-300 leading-relaxed font-sans">
                  <p>
                    I, <strong className="text-white">{driverData.fullName}</strong> (Licence: <span className="font-mono text-cyan-300">{driverData.licenceNumber}</span>), hereby authorize Drive Partners Ltd to access my driver licence record from the DVLA driver database to verify my category entitlement (C+E) and periodic CPC validity.
                  </p>
                  <p className="text-[11px] text-slate-500 font-mono">
                    Statutory D906 Compliance • Valid for 3 years under Data Protection Act 2018.
                  </p>
                </div>

                {/* Signature Box */}
                <div
                  onClick={() => setSignature(!signature)}
                  className="h-28 bg-slate-950 border-2 border-dashed border-slate-800 hover:border-emerald-500/60 rounded-2xl flex flex-col items-center justify-center cursor-pointer transition select-none"
                >
                  {signature ? (
                    <div className="text-center">
                      <span className="text-xl font-serif italic text-emerald-400">Alexander J. Kite</span>
                      <span className="text-[10px] font-mono text-emerald-500 block mt-1">✓ Digitally Signed &amp; Timestamped</span>
                    </div>
                  ) : (
                    <div className="text-center text-slate-500">
                      <span className="text-xs font-mono font-bold block">Tap to Apply Sign-on-Glass Signature</span>
                      <span className="text-[10px] block mt-0.5">Captures biometric touch pressure</span>
                    </div>
                  )}
                </div>

                <div className="flex gap-2">
                  <button
                    onClick={() => setDriverStep(3)}
                    className="px-5 py-3.5 rounded-2xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold text-xs cursor-pointer"
                  >
                    Back
                  </button>
                  <button
                    onClick={() => {
                      if (!signature) {
                        alert("Please tap the signature box to provide your digital D906 signature.");
                        return;
                      }

                      // Package full statutory driver profile and persist to localStorage
                      const profileToSave: DriverLicenceProfile = {
                        verified: true,
                        surname: 'Kite',
                        firstNames: 'Alexander James',
                        fullName: driverData.fullName,
                        dateOfBirth: '1975-07-18',
                        licenceNumber: driverData.licenceNumber,
                        validFrom: '2016-09-10',
                        validTo: '2026-09-10',
                        issuingAuthority: 'DVLA Swansea',
                        categories: ['B', 'BE', 'C1', 'C1E', 'C', 'CE'],
                        highestHGVCategory: 'CAT_CE',
                        categoryDescription: driverData.category,
                        penaltyPoints: driverData.points,
                        endorsements: [],
                        cpcStatus: 'ACTIVE',
                        cpcExpiryDate: driverData.cpcExpiryDate,
                        tachoCardNumber: driverData.tachoCardNumber,
                        dvlaCheckStatus: 'PASSED_CLEAN',
                        confidenceScore: 99.8,
                        verificationNotes: 'Cryptographically bound to DVLA Smart Tachograph Gen 2 & DQC',
                        appLanguage: driverData.appLanguage,
                        distanceUnits: driverData.distanceUnits === 'miles' ? 'MILES' : 'KILOMETERS',
                        measurementUnits: driverData.distanceUnits === 'miles' ? 'IMPERIAL' : 'METRIC',
                        scannedAt: new Date().toISOString()
                      };

                      try {
                        localStorage.setItem('dp_driver_profile', JSON.stringify(profileToSave));
                        localStorage.setItem('dp_user_role', 'driver');
                      } catch (e) {
                        console.error('Storage error', e);
                      }

                      setDriverStep(5);
                    }}
                    className="flex-1 py-3.5 rounded-2xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black text-sm transition flex items-center justify-center gap-2 cursor-pointer shadow-lg shadow-emerald-500/20"
                  >
                    Complete Verification &amp; Create Passport →
                  </button>
                </div>
              </div>
            )}

            {/* Step 5: Success & Direct Launch to Tacho-Scan AI */}
            {driverStep === 5 && (
              <div className="bg-slate-900 border border-emerald-500/40 p-8 rounded-3xl text-center space-y-6 shadow-2xl animate-in zoom-in-95 duration-200">
                <div className="h-16 w-16 rounded-full bg-emerald-500/20 border border-emerald-500/50 flex items-center justify-center text-emerald-400 mx-auto text-2xl font-black">
                  ✓
                </div>
                <div className="space-y-1.5">
                  <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/15 border border-emerald-500/30 text-emerald-300 text-xs font-mono font-bold">
                    <ShieldCheck className="w-3.5 h-3.5" />
                    <span>TRINITY OF VERIFICATION CONFIRMED</span>
                  </div>
                  <h2 className="text-2xl font-black text-white">DVSA Digital Passport Created</h2>
                  <p className="text-xs font-mono text-emerald-400">
                    {driverData.fullName} • Class 1 C+E Active • Zero Points
                  </p>
                </div>

                {/* Verification Trinity Details Card */}
                <div className="bg-slate-950 border border-slate-800 p-4 rounded-2xl max-w-md mx-auto text-left text-xs font-mono space-y-2 text-slate-300">
                  <div className="flex items-center justify-between border-b border-slate-800 pb-1.5">
                    <span className="text-slate-400 flex items-center gap-1.5">
                      <CreditCard className="w-3.5 h-3.5 text-emerald-400" />
                      <span>1. UK Driving Licence:</span>
                    </span>
                    <strong className="text-white">{driverData.licenceNumber}</strong>
                  </div>
                  <div className="flex items-center justify-between border-b border-slate-800 pb-1.5">
                    <span className="text-slate-400 flex items-center gap-1.5">
                      <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
                      <span>2. Smart Tacho Card:</span>
                    </span>
                    <strong className="text-cyan-300">{driverData.tachoCardNumber}</strong>
                  </div>
                  <div className="flex items-center justify-between border-b border-slate-800 pb-1.5">
                    <span className="text-slate-400 flex items-center gap-1.5">
                      <Award className="w-3.5 h-3.5 text-amber-400" />
                      <span>3. Periodic CPC (DQC):</span>
                    </span>
                    <strong className="text-emerald-400">35 / 35 Hrs (Expires {driverData.cpcExpiryDate})</strong>
                  </div>
                  <div className="flex items-center justify-between pt-0.5">
                    <span className="text-slate-400 flex items-center gap-1.5">
                      <Globe className="w-3.5 h-3.5 text-blue-400" />
                      <span>In-Cab AI Language:</span>
                    </span>
                    <strong className="text-cyan-400">{driverData.appLanguage} (Official DVSA Dossiers in English)</strong>
                  </div>
                </div>

                {/* Primary Action Button: Direct to Tacho-Scan */}
                <div className="flex flex-col gap-3 justify-center pt-2 max-w-md mx-auto">
                  <Link
                    href="/driver/tacho"
                    className="w-full py-4 px-6 rounded-2xl bg-gradient-to-r from-amber-500 via-amber-400 to-yellow-500 hover:from-amber-400 hover:to-yellow-400 text-slate-950 font-black text-sm font-mono transition flex items-center justify-center gap-2 shadow-xl shadow-amber-500/20 cursor-pointer"
                  >
                    <Camera className="w-5 h-5 text-slate-950" />
                    <span>Launch Tacho-Scan AI &amp; Ingest First Shift →</span>
                  </Link>

                  <div className="grid grid-cols-2 gap-2">
                    <Link
                      href="/driver"
                      className="py-3 px-4 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs transition flex items-center justify-center gap-1.5 cursor-pointer"
                    >
                      <Truck className="w-4 h-4 text-cyan-400" />
                      <span>Driver Hub</span>
                    </Link>
                    <Link
                      href="/driver/walkaround"
                      className="py-3 px-4 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs transition flex items-center justify-center gap-1.5 cursor-pointer"
                    >
                      <CheckSquare className="w-4 h-4 text-emerald-400" />
                      <span>Walkaround</span>
                    </Link>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* ======================================================== */}
        {/* HAULIER ONBOARDING FLOW                                  */}
        {/* ======================================================== */}
        {role === 'haulier' && (
          <div className="max-w-2xl mx-auto space-y-6">
            <div className="bg-slate-900 border border-slate-800 p-6 rounded-3xl space-y-5">
              <div className="space-y-1">
                <h2 className="text-xl font-black text-white flex items-center gap-2">
                  <Briefcase className="w-5 h-5 text-blue-400" />
                  Register Haulier & Fleet Profile
                </h2>
                <p className="text-xs text-slate-400">
                  Register your transport operating entity, O-Licence, and fleet parameters.
                </p>
              </div>

              <div className="bg-slate-950 border border-slate-800 p-4 rounded-2xl space-y-3 font-mono text-xs">
                <div>
                  <label className="text-slate-500 block text-[10px] uppercase">Company Legal Name</label>
                  <input
                    type="text"
                    value={haulierData.companyName}
                    onChange={e => setHaulierData({ ...haulierData, companyName: e.target.value })}
                    className="w-full bg-transparent border-b border-slate-700 py-1 text-white font-bold outline-none"
                  />
                </div>
                <div>
                  <label className="text-slate-500 block text-[10px] uppercase">Operator Licence Number (O-Licence)</label>
                  <input
                    type="text"
                    value={haulierData.operatingLicence}
                    onChange={e => setHaulierData({ ...haulierData, operatingLicence: e.target.value })}
                    className="w-full bg-transparent border-b border-slate-700 py-1 text-blue-400 font-bold outline-none tracking-wider"
                  />
                </div>
                <div>
                  <label className="text-slate-500 block text-[10px] uppercase">Fleet Size & Configuration</label>
                  <input
                    type="text"
                    value={haulierData.fleetSize}
                    onChange={e => setHaulierData({ ...haulierData, fleetSize: e.target.value })}
                    className="w-full bg-transparent border-b border-slate-700 py-1 text-white font-bold outline-none"
                  />
                </div>
                <div>
                  <label className="text-slate-500 block text-[10px] uppercase">Primary Operating Centre Postcode</label>
                  <input
                    type="text"
                    value={haulierData.primaryDepot}
                    onChange={e => setHaulierData({ ...haulierData, primaryDepot: e.target.value })}
                    className="w-full bg-transparent border-b border-slate-700 py-1 text-white font-bold outline-none"
                  />
                </div>
              </div>

              <div className="flex gap-2">
                <button
                  onClick={() => setRole('none')}
                  className="px-5 py-3.5 rounded-2xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold text-xs"
                >
                  Back
                </button>
                <Link
                  href="/haulier"
                  className="flex-1 py-3.5 rounded-2xl bg-blue-600 hover:bg-blue-500 text-white font-black text-sm transition flex items-center justify-center gap-2"
                >
                  Save & Launch Haulier Dashboard →
                </Link>
              </div>
            </div>
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-800 text-center py-4 text-xs font-mono text-slate-500">
        Drive Partners • DVSA Statutory Onboarding & D906 Electronic Mandate System
      </footer>
    </div>
  );
}
