'use client';

import React, { useState, useRef } from 'react';
import Link from 'next/link';
import {
  Truck, Briefcase, Award, ShieldCheck, CheckCircle2,
  ArrowRight, ArrowLeft, Camera, FileText, Sliders, CheckSquare, KeyRound
} from 'lucide-react';

type Role = 'none' | 'driver' | 'haulier';

export default function OnboardingPage() {
  const [role, setRole] = useState<Role>('none');
  const [driverStep, setDriverStep] = useState(1);
  const [haulierStep, setHaulierStep] = useState(1);

  // Driver Form State
  const [driverData, setDriverData] = useState({
    fullName: 'Alexander James Kite',
    licenceNumber: 'KITE9707185AJ9ZM 26',
    category: 'Class 1 (C+E) Articulated Heavy Goods',
    points: 0,
    tachoCardNumber: 'DB25029078179500',
    cpcHours: 35,
    distanceUnits: 'miles',
    runningHeight: '4.45m (14ft 7in)',
    navPreference: 'in-app-tomtom',
    d906Signed: false
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
        {/* DRIVER ONBOARDING FLOW (4 STEPS)                         */}
        {/* ======================================================== */}
        {role === 'driver' && (
          <div className="max-w-2xl mx-auto space-y-6">
            {/* Stepper Progress */}
            <div className="flex items-center justify-between border-b border-slate-800 pb-3 text-xs font-mono">
              <span className={driverStep >= 1 ? 'text-emerald-400 font-bold' : 'text-slate-600'}>1. Licence Scan</span>
              <span className="text-slate-600">→</span>
              <span className={driverStep >= 2 ? 'text-emerald-400 font-bold' : 'text-slate-600'}>2. Tacho & CPC</span>
              <span className="text-slate-600">→</span>
              <span className={driverStep >= 3 ? 'text-emerald-400 font-bold' : 'text-slate-600'}>3. Preferences</span>
              <span className="text-slate-600">→</span>
              <span className={driverStep >= 4 ? 'text-emerald-400 font-bold' : 'text-slate-600'}>4. D906 Consent</span>
            </div>

            {/* Step 1: Scan Driving Licence */}
            {driverStep === 1 && (
              <div className="bg-slate-900 border border-slate-800 p-6 rounded-3xl space-y-5">
                <div className="space-y-1">
                  <h2 className="text-xl font-black text-white flex items-center gap-2">
                    <Camera className="w-5 h-5 text-emerald-400" />
                    Step 1: Scan Photocard Driving Licence
                  </h2>
                  <p className="text-xs text-slate-400">
                    Capture or verify your Great Britain photocard driving licence.
                  </p>
                </div>

                <div className="bg-slate-950 border border-slate-800 p-4 rounded-2xl space-y-3 font-mono text-xs">
                  <div>
                    <label className="text-slate-500 block text-[10px] uppercase">Full Legal Name</label>
                    <input
                      type="text"
                      value={driverData.fullName}
                      onChange={e => setDriverData({ ...driverData, fullName: e.target.value })}
                      className="w-full bg-transparent border-b border-slate-700 py-1 text-white font-bold outline-none"
                    />
                  </div>
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
                      className="w-full bg-transparent border-b border-slate-700 py-1 text-white font-bold outline-none"
                    />
                  </div>
                </div>

                <button
                  onClick={() => setDriverStep(2)}
                  className="w-full py-3.5 rounded-2xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black text-sm transition flex items-center justify-center gap-2"
                >
                  Confirm & Proceed to Tacho Card →
                </button>
              </div>
            )}

            {/* Step 2: Digi-Tacho & CPC */}
            {driverStep === 2 && (
              <div className="bg-slate-900 border border-slate-800 p-6 rounded-3xl space-y-5">
                <div className="space-y-1">
                  <h2 className="text-xl font-black text-white flex items-center gap-2">
                    <Award className="w-5 h-5 text-emerald-400" />
                    Step 2: Smart Digi-Tacho & Driver CPC
                  </h2>
                  <p className="text-xs text-slate-400">
                    Verify your Smart Tachograph Gen 2 Card and DQC training status.
                  </p>
                </div>

                <div className="bg-slate-950 border border-slate-800 p-4 rounded-2xl space-y-3 font-mono text-xs">
                  <div>
                    <label className="text-slate-500 block text-[10px] uppercase">Smart Tachograph Card Number</label>
                    <input
                      type="text"
                      value={driverData.tachoCardNumber}
                      onChange={e => setDriverData({ ...driverData, tachoCardNumber: e.target.value })}
                      className="w-full bg-transparent border-b border-slate-700 py-1 text-white font-bold outline-none tracking-wider"
                    />
                  </div>
                  <div className="flex items-center justify-between pt-2">
                    <span className="text-slate-400">Periodic CPC Hours Completed:</span>
                    <span className="text-emerald-400 font-bold text-sm bg-emerald-500/20 px-2.5 py-1 rounded-lg border border-emerald-500/40">
                      {driverData.cpcHours} / 35 Hours (Fully Valid)
                    </span>
                  </div>
                </div>

                <div className="flex gap-2">
                  <button
                    onClick={() => setDriverStep(1)}
                    className="px-5 py-3.5 rounded-2xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold text-xs"
                  >
                    Back
                  </button>
                  <button
                    onClick={() => setDriverStep(3)}
                    className="flex-1 py-3.5 rounded-2xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black text-sm transition flex items-center justify-center gap-2"
                  >
                    Confirm & Setup Preferences →
                  </button>
                </div>
              </div>
            )}

            {/* Step 3: Driver Preferences Setup */}
            {driverStep === 3 && (
              <div className="bg-slate-900 border border-slate-800 p-6 rounded-3xl space-y-5">
                <div className="space-y-1">
                  <h2 className="text-xl font-black text-white flex items-center gap-2">
                    <Sliders className="w-5 h-5 text-emerald-400" />
                    Step 3: Driver Regional Preferences & Dimensions
                  </h2>
                  <p className="text-xs text-slate-400">
                    Configure your in-cab units, running height placard, and navigation engine.
                  </p>
                </div>

                <div className="space-y-4">
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
                    <label className="text-xs font-mono uppercase text-slate-400 mb-1 block">Distance & Height Measurement Units</label>
                    <div className="grid grid-cols-2 gap-2">
                      <button
                        type="button"
                        onClick={() => setDriverData({ ...driverData, distanceUnits: 'miles' })}
                        className={`py-3 rounded-xl border text-xs font-mono font-bold ${
                          driverData.distanceUnits === 'miles'
                            ? 'bg-emerald-500/20 border-emerald-500/60 text-emerald-400'
                            : 'bg-slate-950 border-slate-800 text-slate-400'
                        }`}
                      >
                        UK (Miles & Feet/Inches)
                      </button>
                      <button
                        type="button"
                        onClick={() => setDriverData({ ...driverData, distanceUnits: 'km' })}
                        className={`py-3 rounded-xl border text-xs font-mono font-bold ${
                          driverData.distanceUnits === 'km'
                            ? 'bg-emerald-500/20 border-emerald-500/60 text-emerald-400'
                            : 'bg-slate-950 border-slate-800 text-slate-400'
                        }`}
                      >
                        EU (Kilometres & Metres)
                      </button>
                    </div>
                  </div>

                  <div>
                    <label className="text-xs font-mono uppercase text-slate-400 mb-1 block">Preferred Routing Engine</label>
                    <select
                      value={driverData.navPreference}
                      onChange={e => setDriverData({ ...driverData, navPreference: e.target.value })}
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-sm text-white font-mono outline-none"
                    >
                      <option value="in-app-tomtom">In-App Commercial 44t TomTom Truck Navigation</option>
                      <option value="external-google">External Google Maps / Waze Launch</option>
                    </select>
                  </div>
                </div>

                <div className="flex gap-2">
                  <button
                    onClick={() => setDriverStep(2)}
                    className="px-5 py-3.5 rounded-2xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold text-xs"
                  >
                    Back
                  </button>
                  <button
                    onClick={() => setDriverStep(4)}
                    className="flex-1 py-3.5 rounded-2xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black text-sm transition flex items-center justify-center gap-2"
                  >
                    Confirm & Proceed to Consent →
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
                    Step 4: D906 Electronic Mandate Consent
                  </h2>
                  <p className="text-xs text-slate-400">
                    Mandatory sign-on-glass declaration permitting DVLA Access to Driver Data (ADD).
                  </p>
                </div>

                <div className="bg-slate-950 border border-slate-800 p-4 rounded-2xl space-y-2 text-xs text-slate-300 leading-relaxed">
                  <p>
                    I, <strong>{driverData.fullName}</strong>, hereby authorize Drive Partners Ltd to access my driver licence record from the DVLA driver database to verify my category entitlement (C+E) and endorse check status.
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
                      <span className="text-[10px] font-mono text-emerald-500 block mt-1">✓ Digitally Signed & Timestamped</span>
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
                    className="px-5 py-3.5 rounded-2xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold text-xs"
                  >
                    Back
                  </button>
                  <button
                    onClick={() => {
                      if (!signature) {
                        alert("Please tap the signature box to provide your digital D906 signature.");
                        return;
                      }
                      setDriverStep(5);
                    }}
                    className="flex-1 py-3.5 rounded-2xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black text-sm transition flex items-center justify-center gap-2"
                  >
                    Complete Verification & Create Passport →
                  </button>
                </div>
              </div>
            )}

            {/* Step 5: Success & Launch */}
            {driverStep === 5 && (
              <div className="bg-slate-900 border border-emerald-500/40 p-8 rounded-3xl text-center space-y-6 shadow-2xl">
                <div className="h-16 w-16 rounded-full bg-emerald-500/20 border border-emerald-500/50 flex items-center justify-center text-emerald-400 mx-auto text-2xl font-black">
                  ✓
                </div>
                <div className="space-y-1.5">
                  <h2 className="text-2xl font-black text-white">DVSA Digital Passport Created</h2>
                  <p className="text-xs font-mono text-emerald-400">
                    Licence: {driverData.licenceNumber} • Class 1 C+E Active • Zero Points
                  </p>
                </div>

                <div className="bg-slate-950 border border-slate-800 p-4 rounded-2xl max-w-md mx-auto text-left text-xs font-mono space-y-1.5 text-slate-300">
                  <div className="flex justify-between"><span>Placard Height:</span><strong className="text-amber-400">{driverData.runningHeight}</strong></div>
                  <div className="flex justify-between"><span>DQC Periodic CPC:</span><strong className="text-emerald-400">35 / 35 Hours Valid</strong></div>
                  <div className="flex justify-between"><span>D906 Mandate:</span><strong className="text-white">Active & Archived</strong></div>
                </div>

                <div className="flex flex-col sm:flex-row gap-3 justify-center pt-2">
                  <Link
                    href="/driver"
                    className="px-6 py-4 rounded-2xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black text-sm transition flex items-center justify-center gap-2 shadow-lg"
                  >
                    Launch Driver In-Cab Dashboard <ArrowRight className="w-4 h-4" />
                  </Link>
                  <Link
                    href="/driver/check-truck"
                    className="px-6 py-4 rounded-2xl bg-slate-800 hover:bg-slate-700 text-white font-bold text-sm transition flex items-center justify-center gap-2"
                  >
                    <CheckSquare className="w-4 h-4 text-emerald-400" /> Start Vehicle Check
                  </Link>
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
