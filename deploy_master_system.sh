#!/bin/bash
set -e

mkdir -p src/components/onboarding src/components/driver src/components/haulier

# ==============================================================================
# 1. LIVE TELEMETRY TOP BAR
# ==============================================================================
cat << 'SUB_EOF' > src/components/LiveTelemetryBar.tsx
'use client';
import React from 'react';
import { ShieldCheck, Radio, Clock, MapPin } from 'lucide-react';

export default function LiveTelemetryBar() {
  return (
    <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-3 flex flex-wrap items-center justify-between text-xs font-mono text-slate-300 gap-3 shadow-lg">
      <div className="flex items-center gap-2">
        <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
        <span className="font-bold text-white">DRIVE PARTNERS OS</span>
        <span className="text-slate-600">|</span>
        <span className="text-emerald-400 font-bold">SYSTEM OPTIMAL</span>
      </div>
      <div className="flex items-center gap-4 text-[11px]">
        <div className="flex items-center gap-1.5">
          <Radio className="w-3.5 h-3.5 text-blue-400" />
          <span>GPS: M1 J15A (52.19° N, 0.90° W)</span>
        </div>
        <div className="flex items-center gap-1.5 text-emerald-400 font-bold">
          <ShieldCheck className="w-3.5 h-3.5" />
          <span>DVSA COMPLIANT</span>
        </div>
      </div>
    </div>
  );
}
SUB_EOF

# ==============================================================================
# 2. COMPLETE ONBOARDING WORKFLOW (SLIDES 1-6 + HAULIER BRANCH)
# ==============================================================================
cat << 'SUB_EOF' > src/components/onboarding/OnboardingFlow.tsx
'use client';
import React, { useState } from 'react';
import { Truck, Building2, Camera, Check, ArrowRight, ShieldCheck, CheckCircle2 } from 'lucide-react';

export default function OnboardingFlow({ onComplete }: { onComplete: (role: 'driver' | 'haulier', profile: any) => void }) {
  const [step, setStep] = useState<'role' | 'driver_fasttrack' | 'camera' | 'matrix' | 'vault' | 'prefs' | 'haulier'>('role');
  const [selectedNav, setSelectedNav] = useState('Google Maps');
  const [haulierData, setHaulierData] = useState({
    companyName: 'Anglo-Midland Logistics Ltd',
    oLicence: 'OF-1049281',
    fleetSize: '15-50 Units'
  });

  return (
    <div className="min-h-[85vh] flex items-center justify-center p-2 sm:p-4 font-sans">
      {/* SLIDE 1: ROLE SELECTOR */}
      {step === 'role' && (
        <div className="w-full max-w-2xl bg-slate-900/95 border border-slate-800 backdrop-blur-xl rounded-3xl p-6 sm:p-8 shadow-2xl space-y-8 animate-fadeIn">
          <div className="text-center space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-800 border border-slate-700 text-xs font-mono text-emerald-400">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              DRIVE PARTNERS ECOSYSTEM
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white">
              Welcome to Drive Partners - Select Your Role
            </h1>
            <p className="text-xs sm:text-sm text-slate-400">Choose your account type to access the platform</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="bg-slate-950 border-2 border-amber-500/30 hover:border-amber-500 rounded-2xl p-6 flex flex-col justify-between space-y-6 group transition-all">
              <div className="space-y-4">
                <div className="w-14 h-14 rounded-2xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400">
                  <Truck className="w-7 h-7" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-white">HGV Driver</h3>
                  <p className="text-xs text-slate-400 mt-1">Access routes, manage deliveries, and track progress.</p>
                </div>
              </div>
              <div className="space-y-2">
                <button
                  onClick={() => setStep('driver_fasttrack')}
                  className="w-full py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs shadow-lg shadow-amber-500/20"
                >
                  Create Driver Account
                </button>
                <button
                  onClick={() => onComplete('driver', { nav: 'Google Maps' })}
                  className="w-full py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-medium text-xs"
                >
                  Sign In
                </button>
              </div>
            </div>

            <div className="bg-slate-950 border-2 border-emerald-500/30 hover:border-emerald-500 rounded-2xl p-6 flex flex-col justify-between space-y-6 group transition-all">
              <div className="space-y-4">
                <div className="w-14 h-14 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
                  <Building2 className="w-7 h-7" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-white">Haulier / Fleet Operator</h3>
                  <p className="text-xs text-slate-400 mt-1">Manage fleet, view analytics, and assign drivers.</p>
                </div>
              </div>
              <div className="space-y-2">
                <button
                  onClick={() => setStep('haulier')}
                  className="w-full py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs shadow-lg shadow-emerald-500/20"
                >
                  Register Fleet
                </button>
                <button
                  onClick={() => onComplete('haulier', haulierData)}
                  className="w-full py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-medium text-xs"
                >
                  Sign In
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* SLIDE 2: DRIVER FAST TRACK */}
      {step === 'driver_fasttrack' && (
        <div className="w-full max-w-md bg-slate-900/95 border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-2xl space-y-6 text-center animate-fadeIn">
          <div>
            <h2 className="text-xl font-black text-white uppercase tracking-wider">Create Your Driver Account</h2>
            <p className="text-xs text-slate-400 mt-1">Fast-track verification using UK DVLA credentials</p>
          </div>
          <div className="p-5 bg-slate-950 border border-emerald-500/40 rounded-2xl space-y-4 shadow-lg shadow-emerald-500/10">
            <div className="flex items-center gap-3 text-left">
              <div className="w-10 h-10 rounded-xl bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-amber-400 font-bold">
                ★
              </div>
              <div>
                <div className="text-xs font-bold text-white uppercase">Fast-Track Onboarding</div>
                <div className="text-[11px] text-slate-400">Create Account via Driving Licence</div>
              </div>
            </div>
            <button
              onClick={() => setStep('camera')}
              className="w-full py-3 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 text-xs font-black uppercase tracking-wider flex items-center justify-center gap-2 shadow-lg shadow-emerald-500/20"
            >
              <Camera className="w-4 h-4" /> Scan UK Licence to Auto-Fill
            </button>
          </div>
          <div className="flex justify-between text-xs font-mono text-slate-500">
            <button onClick={() => setStep('prefs')} className="hover:text-slate-300">Skip and complete later</button>
            <button onClick={() => setStep('prefs')} className="hover:text-slate-300">Fill in manually</button>
          </div>
        </div>
      )}

      {/* SLIDE 3: CAMERA SCAN HUD */}
      {step === 'camera' && (
        <div className="w-full max-w-2xl bg-black/95 border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-2xl space-y-6 animate-fadeIn">
          <div className="flex justify-between items-center">
            <h2 className="text-base font-bold text-white">Step 1 of 6: Scan Front of Driving Licence</h2>
            <div className="px-3 py-1 rounded-full bg-emerald-500/20 border border-emerald-500 text-emerald-400 font-mono text-xs font-bold flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
              SHARPNESS: 99% - ALIGNED
            </div>
          </div>
          <div className="relative aspect-[16/9] w-full bg-slate-950 rounded-2xl border border-slate-800 flex items-center justify-center overflow-hidden">
            <div className="absolute top-4 left-4 w-8 h-8 border-t-2 border-l-2 border-emerald-400 rounded-tl-lg" />
            <div className="absolute top-4 right-4 w-8 h-8 border-t-2 border-r-2 border-emerald-400 rounded-tr-lg" />
            <div className="absolute bottom-4 left-4 w-8 h-8 border-b-2 border-l-2 border-emerald-400 rounded-bl-lg" />
            <div className="absolute bottom-4 right-4 w-8 h-8 border-b-2 border-r-2 border-emerald-400 rounded-br-lg" />
            <div className="w-64 h-40 bg-slate-900 border border-white/20 rounded-xl p-3 text-[9px] font-mono space-y-1 relative shadow-2xl">
              <div className="text-blue-400 font-black">UK DRIVING LICENCE</div>
              <div>1. REED | 2. ALEXANDER</div>
              <div className="text-emerald-400 font-bold">4b. EXP: 12/05/2030 (C+E CLASS 1)</div>
              <div className="absolute inset-x-0 h-0.5 bg-emerald-400 animate-pulse top-1/2" />
            </div>
          </div>
          <button
            onClick={() => setStep('matrix')}
            className="w-full py-3 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs uppercase tracking-wider rounded-xl shadow-lg shadow-emerald-500/20"
          >
            Capture Document (Front)
          </button>
        </div>
      )}

      {/* SLIDE 4: 6-STEP VERIFICATION MATRIX */}
      {step === 'matrix' && (
        <div className="w-full max-w-3xl bg-slate-900/95 border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-2xl space-y-6 animate-fadeIn">
          <div className="flex justify-between items-center">
            <h2 className="text-lg font-bold text-white uppercase">HGV Driver Document Verification | 6-Step Flow</h2>
            <span className="text-xs font-mono text-emerald-400 font-bold">Step 6 of 6</span>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-2.5 text-center text-xs font-mono">
            {['1. LICENCE FRONT', '2. LICENCE BACK', '3. TACHO FRONT', '4. TACHO BACK', '5. CPC FRONT'].map((label, i) => (
              <div key={i} className="p-3 bg-slate-950 border border-slate-800 rounded-xl space-y-1">
                <div className="text-[10px] text-slate-500">{label}</div>
                <div className="text-[10px] text-emerald-400 font-bold flex items-center justify-center gap-1">
                  <Check className="w-3 h-3" /> COMPLETE
                </div>
              </div>
            ))}
            <div 
              onClick={() => setStep('vault')}
              className="p-3 bg-emerald-950/40 border-2 border-emerald-400 rounded-xl space-y-1 cursor-pointer hover:bg-emerald-950/60 transition-all shadow-lg shadow-emerald-500/20"
            >
              <div className="text-[10px] text-emerald-400 font-bold">6. CPC BACK</div>
              <div className="text-[10px] text-white font-bold animate-pulse">TAP TO SCAN</div>
            </div>
          </div>
          <button
            onClick={() => setStep('vault')}
            className="w-full py-3 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black text-xs uppercase tracking-wider rounded-xl shadow-lg shadow-emerald-500/20"
          >
            Verify Credentials & Generate Vault <ArrowRight className="w-4 h-4 inline ml-1" />
          </button>
        </div>
      )}

      {/* SLIDE 5: 85% PROGRESS RING */}
      {step === 'vault' && (
        <div className="w-full max-w-md bg-slate-900/95 border border-slate-800 rounded-3xl p-8 shadow-2xl space-y-8 text-center animate-fadeIn">
          <div>
            <h2 className="text-xl font-black text-white">Creating Your Universal Driver Account</h2>
            <p className="text-xs text-slate-400 mt-1 font-mono">Generating encrypted compliance vault</p>
          </div>
          <div className="relative w-40 h-40 mx-auto flex items-center justify-center">
            <div className="absolute inset-0 rounded-full border-4 border-slate-800" />
            <div className="absolute inset-0 rounded-full border-4 border-emerald-400 border-t-amber-400 animate-spin" />
            <span className="text-3xl font-black text-white font-mono">85%</span>
          </div>
          <div className="space-y-2 text-left max-w-xs mx-auto font-mono text-xs text-emerald-400">
            <div className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4" /> Driving Licence Verified</div>
            <div className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4" /> Tachograph Card Synced</div>
            <div className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4" /> Universal Ecosystem ID Created</div>
          </div>
          <button
            onClick={() => setStep('prefs')}
            className="w-full py-3 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs uppercase tracking-wider rounded-xl shadow-lg shadow-emerald-500/20"
          >
            Personalise In-Cab Setup <ArrowRight className="w-4 h-4 inline ml-1" />
          </button>
        </div>
      )}

      {/* SLIDE 6: IN-CAB SETUP PERSONALISATION */}
      {step === 'prefs' && (
        <div className="w-full max-w-xl bg-slate-900/95 border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-2xl space-y-6 animate-fadeIn">
          <div>
            <span className="text-xs font-mono text-emerald-400 font-bold">FLEETDRIVE Setup • Step 1 of 4</span>
            <h2 className="text-xl font-black text-white mt-1">Which Navigation App Do You Prefer?</h2>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {['Google Maps', 'Waze', 'Apple Maps', 'TomTom Go'].map(app => (
              <div
                key={app}
                onClick={() => setSelectedNav(app)}
                className={`p-4 rounded-2xl border text-center cursor-pointer transition-all ${
                  selectedNav === app
                    ? 'bg-emerald-950/40 border-2 border-emerald-400 shadow-lg shadow-emerald-500/20'
                    : 'bg-slate-950 border-slate-800'
                }`}
              >
                <div className="text-xs font-bold text-white">{app}</div>
                {selectedNav === app && (
                  <span className="mt-2 inline-block px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 text-[10px] font-bold">
                    Selected
                  </span>
                )}
              </div>
            ))}
          </div>
          <button
            onClick={() => onComplete('driver', { nav: selectedNav })}
            className="w-full py-3.5 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black text-xs uppercase tracking-wider rounded-xl shadow-lg shadow-emerald-500/20"
          >
            Launch Driver Dashboard <ArrowRight className="w-4 h-4 inline ml-1" />
          </button>
        </div>
      )}

      {/* HAULIER REGISTRATION */}
      {step === 'haulier' && (
        <div className="w-full max-w-md bg-slate-900/95 border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-2xl space-y-6 animate-fadeIn">
          <div>
            <span className="text-xs font-mono text-emerald-400 font-bold uppercase">Fleet Operations Gateway</span>
            <h2 className="text-xl font-black text-white mt-1">Register Commercial Fleet</h2>
          </div>
          <div className="space-y-3 font-mono text-xs">
            <div>
              <label className="text-slate-400 block mb-1">Company Name</label>
              <input
                type="text"
                value={haulierData.companyName}
                onChange={e => setHaulierData({ ...haulierData, companyName: e.target.value })}
                className="w-full p-2.5 bg-slate-950 border border-slate-800 rounded-xl text-white"
              />
            </div>
            <div>
              <label className="text-slate-400 block mb-1">UK O-Licence Number</label>
              <input
                type="text"
                value={haulierData.oLicence}
                onChange={e => setHaulierData({ ...haulierData, oLicence: e.target.value })}
                className="w-full p-2.5 bg-slate-950 border border-slate-800 rounded-xl text-emerald-400 font-bold"
              />
            </div>
          </div>
          <button
            onClick={() => onComplete('haulier', haulierData)}
            className="w-full py-3.5 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black text-xs uppercase tracking-wider rounded-xl shadow-lg shadow-emerald-500/20"
          >
            Access Fleet Dashboard <ArrowRight className="w-4 h-4 inline ml-1" />
          </button>
        </div>
      )}
    </div>
  );
}
SUB_EOF

# ==============================================================================
# 3. COMPLETE DRIVER DASHBOARD (YOUR FLOWCHART + SLIDE 7)
# ==============================================================================
cat << 'SUB_EOF' > src/components/driver/DriverDashboard.tsx
'use client';
import React, { useState } from 'react';
import { Camera, Upload, CreditCard, Clock, MapPin, Navigation, Plus, Check, ShieldCheck, ArrowRight, ExternalLink } from 'lucide-react';

export default function DriverDashboard({ userProfile }: { userProfile?: any }) {
  const [tab, setTab] = useState<'route' | 'tacho' | 'compliance'>('route');
  const [routeState, setRouteState] = useState<'search' | 'pin_confirm' | 'add_stop' | 'summary' | 'site_review'>('search');
  const [stops, setStops] = useState<{ name: string; postcode: string; hazards: string }[]>([]);
  const [tachoDone, setTachoDone] = useState(false);

  return (
    <div className="space-y-6">
      {/* 3 Pillars */}
      <div className="grid grid-cols-3 gap-2 bg-slate-900/90 p-1.5 border border-slate-800 rounded-2xl">
        <button
          onClick={() => setTab('route')}
          className={`py-3 rounded-xl text-xs font-bold font-mono transition-all flex items-center justify-center gap-2 ${
            tab === 'route' ? 'bg-emerald-500 text-slate-950 shadow-lg shadow-emerald-500/20' : 'text-slate-400 hover:text-white'
          }`}
        >
          <Navigation className="w-4 h-4" /> Destination & Map
        </button>
        <button
          onClick={() => setTab('tacho')}
          className={`py-3 rounded-xl text-xs font-bold font-mono transition-all flex items-center justify-center gap-2 ${
            tab === 'tacho' ? 'bg-emerald-500 text-slate-950 shadow-lg shadow-emerald-500/20' : 'text-slate-400 hover:text-white'
          }`}
        >
          <Camera className="w-4 h-4" /> Tacho-Scan (Slide 7)
        </button>
        <button
          onClick={() => setTab('compliance')}
          className={`py-3 rounded-xl text-xs font-bold font-mono transition-all flex items-center justify-center gap-2 ${
            tab === 'compliance' ? 'bg-emerald-500 text-slate-950 shadow-lg shadow-emerald-500/20' : 'text-slate-400 hover:text-white'
          }`}
        >
          <Clock className="w-4 h-4" /> Compliance Hub
        </button>
      </div>

      {/* PILLAR 1: DESTINATION SEARCH & MAP */}
      {tab === 'route' && (
        <div className="bg-slate-900/80 border border-slate-800 rounded-3xl p-6 space-y-6 shadow-xl">
          {routeState === 'search' && (
            <div className="space-y-4">
              <h3 className="text-lg font-bold text-white flex items-center gap-2">
                <MapPin className="w-5 h-5 text-emerald-400" /> Search Delivery Destination
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {[
                  { name: 'DIRFT Daventry Hub', postcode: 'NN6 7GZ', hazards: '4.9m low canopy at Gate 3' },
                  { name: 'Magna Park Lutterworth', postcode: 'LE17 4XN', hazards: 'One-way anti-clockwise system' },
                  { name: 'Amazon LCY2 Tilbury', postcode: 'RM18 7AN', hazards: 'Strict ANPR slot booking' }
                ].map((hub, i) => (
                  <div
                    key={i}
                    onClick={() => {
                      setStops([...stops, hub]);
                      setRouteState('pin_confirm');
                    }}
                    className="p-4 bg-slate-950 border border-slate-800 hover:border-emerald-500/60 rounded-2xl cursor-pointer group"
                  >
                    <div className="text-xs font-bold text-white group-hover:text-emerald-400">{hub.name}</div>
                    <div className="text-[11px] text-slate-400 font-mono mt-1">{hub.postcode}</div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {routeState === 'pin_confirm' && (
            <div className="space-y-4">
              <h3 className="text-base font-bold text-white">Interactive Map: Confirm Destination Pin</h3>
              <div className="relative aspect-[16/8] bg-slate-950 rounded-2xl border border-slate-800 flex items-center justify-center">
                <div className="text-center animate-bounce">
                  <div className="px-3 py-1 bg-emerald-500 text-slate-950 rounded-lg text-xs font-bold">
                    {stops[stops.length - 1]?.postcode} Gate 1
                  </div>
                  <MapPin className="w-8 h-8 text-emerald-400 fill-emerald-400 mx-auto" />
                </div>
              </div>
              <div className="flex justify-between">
                <button onClick={() => setRouteState('search')} className="text-xs text-slate-400">Tap New Pin</button>
                <button
                  onClick={() => setRouteState('add_stop')}
                  className="px-6 py-2.5 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs uppercase rounded-xl flex items-center gap-2"
                >
                  <Check className="w-4 h-4" /> Confirm Pin
                </button>
              </div>
            </div>
          )}

          {routeState === 'add_stop' && (
            <div className="p-8 bg-slate-950 border border-slate-800 rounded-2xl text-center space-y-4 max-w-md mx-auto">
              <h3 className="text-lg font-bold text-white">Add Another Stop?</h3>
              <p className="text-xs text-slate-400">Would you like to chain an additional multi-drop stop?</p>
              <div className="grid grid-cols-2 gap-3 pt-2">
                <button onClick={() => setRouteState('search')} className="py-2.5 bg-slate-800 text-white rounded-xl text-xs font-bold flex items-center justify-center gap-1">
                  <Plus className="w-4 h-4" /> Yes (Add Stop)
                </button>
                <button onClick={() => setRouteState('summary')} className="py-2.5 bg-emerald-500 text-slate-950 rounded-xl text-xs font-black uppercase">
                  No (Summary)
                </button>
              </div>
            </div>
          )}

          {routeState === 'summary' && (
            <div className="space-y-4">
              <h3 className="text-lg font-bold text-white">Route Summary</h3>
              <div className="grid grid-cols-3 gap-3 text-xs font-mono">
                <div className="p-3 bg-slate-950 rounded-xl border border-slate-800">
                  <span className="text-slate-500 block text-[10px]">DISTANCE</span>
                  <span className="font-bold text-white">48.2 miles</span>
                </div>
                <div className="p-3 bg-slate-950 rounded-xl border border-slate-800">
                  <span className="text-slate-500 block text-[10px]">CLEARANCE</span>
                  <span className="font-bold text-emerald-400">4.9m SAFE</span>
                </div>
                <div className="p-3 bg-slate-950 rounded-xl border border-slate-800">
                  <span className="text-slate-500 block text-[10px]">EST. TIME</span>
                  <span className="font-bold text-white">1h 12m</span>
                </div>
              </div>
              <button
                onClick={() => setRouteState('site_review')}
                className="w-full py-3 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black text-xs uppercase rounded-xl"
              >
                Proceed to Site Assessment Review <ArrowRight className="w-4 h-4 inline ml-1" />
              </button>
            </div>
          )}

          {routeState === 'site_review' && (
            <div className="space-y-4">
              <h3 className="text-lg font-bold text-white">Site Assessment Review (Gate Hazards)</h3>
              <div className="p-4 bg-amber-500/10 border border-amber-500/30 rounded-2xl text-xs text-amber-300 space-y-1">
                <div>⚠️ {stops[0]?.hazards || 'Strict 10mph limit, Hi-Viz Class 3 mandatory'}</div>
                <div>Demurrage Charge: £55/hr after 90 mins free dwell</div>
              </div>
              <div className="grid grid-cols-2 gap-3 pt-2">
                <button
                  onClick={() => alert('Launching In-App Commercial HGV Nav with Low-Bridge Radar!')}
                  className="py-3 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black text-xs uppercase rounded-xl"
                >
                  Launch In-App HGV Nav
                </button>
                <button
                  onClick={() => window.open(`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(stops[0]?.postcode || 'DIRFT')}`, '_blank')}
                  className="py-3 bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs uppercase rounded-xl flex items-center justify-center gap-1"
                >
                  Open in {userProfile?.nav || 'Google Maps'} <ExternalLink className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      {/* PILLAR 2: TACHO-SCAN STUDIO (Slide 7) */}
      {tab === 'tacho' && (
        <div className="bg-slate-900/80 border border-slate-800 rounded-3xl p-6 space-y-6 shadow-xl">
          <div className="text-center space-y-1">
            <h3 className="text-2xl font-black text-white">Drive Partners • Tacho-Scan</h3>
            <p className="text-xs text-slate-400 font-mono">Free Printout Scanner with Full Analytics for the Driver</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-4 gap-3 text-center">
            {[
              { icon: Camera, title: 'Scan Printout', desc: 'Start a new scan with device camera.' },
              { icon: Upload, title: 'Upload Printout', desc: 'Import digital files or saved images.' },
              { icon: CreditCard, title: 'Card Reader', desc: 'Connect physical USB/OTG reader.' },
              { icon: Clock, title: 'See Dashboard', desc: 'Tachograph compliance analytics chart.' }
            ].map((card, i) => (
              <div
                key={i}
                onClick={() => setTachoDone(true)}
                className="p-5 bg-slate-950 border border-slate-800 hover:border-emerald-500/60 rounded-2xl cursor-pointer group space-y-2 transition-all"
              >
                <card.icon className="w-6 h-6 text-emerald-400 mx-auto group-hover:scale-110 transition-transform" />
                <div className="font-bold text-sm text-white">{card.title}</div>
                <p className="text-[11px] text-slate-400">{card.desc}</p>
              </div>
            ))}
          </div>
          {tachoDone && (
            <div className="p-4 bg-slate-950 border border-emerald-500 rounded-2xl text-xs font-mono space-y-2">
              <div className="text-emerald-400 font-bold flex items-center gap-2">
                <ShieldCheck className="w-4 h-4" /> Extracted Daily Printout OCR & Synced with Fleet
              </div>
              <div className="grid grid-cols-4 gap-2 text-slate-300">
                <div>Drive: <strong className="text-white">4h 15m</strong></div>
                <div>Break: <strong className="text-white">45m</strong></div>
                <div>WTD Duty: <strong className="text-white">8h 30m</strong></div>
                <div>Infringements: <strong className="text-emerald-400">0</strong></div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* PILLAR 3: COMPLIANCE CLOCKS */}
      {tab === 'compliance' && (
        <div className="bg-slate-900/80 border border-slate-800 rounded-3xl p-6 space-y-4 shadow-xl">
          <h3 className="text-lg font-bold text-white flex items-center gap-2">
            <ShieldCheck className="w-5 h-5 text-emerald-400" /> EU Drivers' Hours & WTD Hub
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3 font-mono text-xs">
            <div className="p-4 bg-slate-950 rounded-2xl border border-slate-800 space-y-2">
              <span className="text-slate-500 block text-[10px]">CONTINUOUS DRIVE LIMIT</span>
              <div className="text-2xl font-bold text-white">4h 15m <span className="text-xs text-slate-500">/ 4h 30m</span></div>
              <p className="text-amber-400 text-[11px]">⚠️ Break required in 15 mins</p>
            </div>
            <div className="p-4 bg-slate-950 rounded-2xl border border-slate-800 space-y-2">
              <span className="text-slate-500 block text-[10px]">DAILY DRIVE CLOCK</span>
              <div className="text-2xl font-bold text-white">4h 15m <span className="text-xs text-slate-500">/ 9h 00m</span></div>
              <p className="text-emerald-400 text-[11px]">4h 45m drive remaining today</p>
            </div>
            <div className="p-4 bg-slate-950 rounded-2xl border border-slate-800 space-y-2">
              <span className="text-slate-500 block text-[10px]">WEEKLY TOTAL</span>
              <div className="text-2xl font-bold text-white">32h 10m <span className="text-xs text-slate-500">/ 56h 00m</span></div>
              <p className="text-slate-400 text-[11px]">Compliant with EU Reg 561/2006</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
SUB_EOF

# ==============================================================================
# 4. COMPLETE HAULIER DASHBOARD (YOUR FLOWCHART)
# ==============================================================================
cat << 'SUB_EOF' > src/components/haulier/HaulierDashboard.tsx
'use client';
import React, { useState } from 'react';
import { Search, Users, ShieldCheck, Truck, Check, ArrowRight, FileDown } from 'lucide-react';

export default function HaulierDashboard({ userProfile }: { userProfile?: any }) {
  const [tab, setTab] = useState<'search' | 'availability' | 'compliance'>('search');
  const [assigned, setAssigned] = useState<string | null>(null);

  return (
    <div className="space-y-6">
      {/* 3 Pillars */}
      <div className="grid grid-cols-3 gap-2 bg-slate-900/90 p-1.5 border border-slate-800 rounded-2xl">
        <button
          onClick={() => setTab('search')}
          className={`py-3 rounded-xl text-xs font-bold font-mono transition-all flex items-center justify-center gap-2 ${
            tab === 'search' ? 'bg-emerald-500 text-slate-950 shadow-lg shadow-emerald-500/20' : 'text-slate-400 hover:text-white'
          }`}
        >
          <Search className="w-4 h-4" /> Driver & Fleet Search
        </button>
        <button
          onClick={() => setTab('availability')}
          className={`py-3 rounded-xl text-xs font-bold font-mono transition-all flex items-center justify-center gap-2 ${
            tab === 'availability' ? 'bg-emerald-500 text-slate-950 shadow-lg shadow-emerald-500/20' : 'text-slate-400 hover:text-white'
          }`}
        >
          <Users className="w-4 h-4" /> Driver Availability Search
        </button>
        <button
          onClick={() => setTab('compliance')}
          className={`py-3 rounded-xl text-xs font-bold font-mono transition-all flex items-center justify-center gap-2 ${
            tab === 'compliance' ? 'bg-emerald-500 text-slate-950 shadow-lg shadow-emerald-500/20' : 'text-slate-400 hover:text-white'
          }`}
        >
          <ShieldCheck className="w-4 h-4" /> Fleet Compliance Hub
        </button>
      </div>

      {/* PILLAR 1: SEARCH */}
      {tab === 'search' && (
        <div className="bg-slate-900/80 border border-slate-800 rounded-3xl p-6 space-y-4 shadow-xl">
          <h3 className="text-lg font-bold text-white flex items-center gap-2">
            <Search className="w-5 h-5 text-emerald-400" /> Driver & Fleet Asset Directory
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3 font-mono text-xs">
            <div className="p-4 bg-slate-950 rounded-2xl border border-slate-800 space-y-1">
              <div className="text-white font-bold">Alexander Reed (Driver)</div>
              <div className="text-slate-400 text-[11px]">Tractor: DG21 EDP | Trailer: TR-8492</div>
              <div className="text-emerald-400 text-[10px]">● On Route (M1 Southbound)</div>
            </div>
            <div className="p-4 bg-slate-950 rounded-2xl border border-slate-800 space-y-1">
              <div className="text-white font-bold">TR-9102 (Double-Deck Trailer)</div>
              <div className="text-slate-400 text-[11px]">Height: 4.85m | MOT: 02 Jun 2027</div>
              <div className="text-blue-400 text-[10px]">● Available in Depot (DIRFT Bay 24)</div>
            </div>
            <div className="p-4 bg-slate-950 rounded-2xl border border-slate-800 space-y-1">
              <div className="text-white font-bold">DIRFT Daventry Terminal (Site)</div>
              <div className="text-slate-400 text-[11px]">Postcode: NN6 7GZ | Gate 3</div>
              <div className="text-amber-400 text-[10px]">Demurrage: £55/hr</div>
            </div>
          </div>
        </div>
      )}

      {/* PILLAR 2: AVAILABILITY SEARCH */}
      {tab === 'availability' && (
        <div className="bg-slate-900/80 border border-slate-800 rounded-3xl p-6 space-y-4 shadow-xl">
          <h3 className="text-lg font-bold text-white flex items-center gap-2">
            <Users className="w-5 h-5 text-emerald-400" /> Driver Availability Radar (Within 30 Miles)
          </h3>
          <div className="space-y-3 font-mono text-xs">
            {[
              { id: '1', name: 'Krzysztof Nowak', loc: 'Northampton (8.2 mi)', hours: '9h 00m', qual: 'C+E Artic, ADR' },
              { id: '2', name: 'David Jenkins', loc: 'Rugby (14.5 mi)', hours: '8h 30m', qual: 'C+E Artic, Moffett' }
            ].map(d => (
              <div key={d.id} className="p-4 bg-slate-950 border border-slate-800 rounded-2xl flex justify-between items-center">
                <div>
                  <div className="font-bold text-white text-sm">{d.name}</div>
                  <div className="text-slate-400 text-[11px]">{d.loc} • {d.qual}</div>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-emerald-400 font-bold">{d.hours} Drive</span>
                  <button
                    onClick={() => setAssigned(d.id)}
                    className="px-4 py-2 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold rounded-xl text-xs uppercase"
                  >
                    {assigned === d.id ? 'Assigned' : 'Dispatch'}
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* PILLAR 3: FLEET COMPLIANCE */}
      {tab === 'compliance' && (
        <div className="bg-slate-900/80 border border-slate-800 rounded-3xl p-6 space-y-4 shadow-xl">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-bold text-white flex items-center gap-2">
              <ShieldCheck className="w-5 h-5 text-emerald-400" /> Fleet Compliance Hub
            </h3>
            <button
              onClick={() => alert('Exporting DVSA statutory audit pack...')}
              className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl text-xs font-mono font-bold flex items-center gap-1.5"
            >
              <FileDown className="w-4 h-4 text-emerald-400" /> Export DVSA Pack
            </button>
          </div>
          <div className="grid grid-cols-3 gap-3 font-mono text-xs">
            <div className="p-4 bg-slate-950 rounded-2xl border border-slate-800">
              <span className="text-slate-500 block text-[10px]">ACTIVE FLEET</span>
              <span className="text-2xl font-bold text-white">12 HGVs</span>
            </div>
            <div className="p-4 bg-slate-950 rounded-2xl border border-slate-800">
              <span className="text-slate-500 block text-[10px]">WTD INFRINGEMENTS</span>
              <span className="text-2xl font-bold text-emerald-400">0</span>
            </div>
            <div className="p-4 bg-slate-950 rounded-2xl border border-slate-800">
              <span className="text-slate-500 block text-[10px]">CARD DOWNLOAD DUE</span>
              <span className="text-2xl font-bold text-amber-400">4 Days</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
SUB_EOF

# ==============================================================================
# 5. MASTER CONTROLLER ENTRYPOINT
# ==============================================================================
cat << 'SUB_EOF' > src/app/page.tsx
'use client';
import React, { useState } from 'react';
import LiveTelemetryBar from '@/components/LiveTelemetryBar';
import OnboardingFlow from '@/components/onboarding/OnboardingFlow';
import DriverDashboard from '@/components/driver/DriverDashboard';
import HaulierDashboard from '@/components/haulier/HaulierDashboard';
import { Truck, Building2, RefreshCw } from 'lucide-react';

export default function MasterApp() {
  const [onboardingDone, setOnboardingDone] = useState(false);
  const [role, setRole] = useState<'driver' | 'haulier'>('driver');
  const [profile, setProfile] = useState<any>(null);

  if (!onboardingDone) {
    return (
      <main className="min-h-screen bg-[#070B13] p-4 flex flex-col justify-between max-w-7xl mx-auto">
        <LiveTelemetryBar />
        <OnboardingFlow
          onComplete={(r, p) => {
            setRole(r);
            setProfile(p);
            setOnboardingDone(true);
          }}
        />
        <div className="text-center text-[10px] font-mono text-slate-600 py-2">
          DRIVE PARTNERS PRODUCTION OS • COMPLIANT WITH UK DVSA & EU REG 561/2006
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#070B13] text-slate-100 p-4 sm:p-6 space-y-6 max-w-7xl mx-auto font-sans">
      <LiveTelemetryBar />

      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center border-b border-slate-800 pb-4 gap-4">
        <div>
          <div className="text-xs font-mono font-bold text-emerald-400 tracking-wider uppercase">
            {role === 'driver' ? 'DRIVER PORTAL • ACTIVE COCKPIT' : 'HAULIER RADAR • DISPATCH DESK'}
          </div>
          <h1 className="text-2xl font-black text-white mt-0.5">Drive Partners Commercial OS</h1>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setRole(r => r === 'driver' ? 'haulier' : 'driver')}
            className="px-3 py-2 bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 hover:bg-emerald-500 hover:text-slate-950 font-bold rounded-xl text-xs font-mono transition-all flex items-center gap-1.5"
          >
            {role === 'driver' ? <Building2 className="w-3.5 h-3.5" /> : <Truck className="w-3.5 h-3.5" />}
            Switch to {role === 'driver' ? 'Haulier View' : 'Driver View'}
          </button>
          <button
            onClick={() => setOnboardingDone(false)}
            className="px-3 py-2 bg-slate-900 border border-slate-800 text-slate-300 hover:bg-slate-800 rounded-xl text-xs font-mono flex items-center gap-1.5"
          >
            <RefreshCw className="w-3.5 h-3.5 text-emerald-400" /> Re-Onboard
          </button>
        </div>
      </div>

      {role === 'driver' ? <DriverDashboard userProfile={profile} /> : <HaulierDashboard userProfile={profile} />}
    </main>
  );
}
SUB_EOF

echo "Executing complete production build & deploy..."
bash build-and-deploy.sh
