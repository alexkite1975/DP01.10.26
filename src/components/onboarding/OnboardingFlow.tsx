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
