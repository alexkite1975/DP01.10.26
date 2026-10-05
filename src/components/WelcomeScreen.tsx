'use client';
import React from 'react';
import { LogIn, Truck, Building2, MapPin, Volume2, VolumeX } from 'lucide-react';

interface Props {
  onSelectDriverSignIn: () => void;
  onSelectDriverRegister: () => void;
  onSelectFleetRegister: () => void;
  onSelectSiteAdmin: () => void;
  onFastAuth: (email: string) => void;
  voiceEnabled: boolean;
  onToggleVoice: () => void;
}

export default function WelcomeScreen({
  onSelectDriverSignIn,
  onSelectDriverRegister,
  onSelectFleetRegister,
  onSelectSiteAdmin,
  onFastAuth,
  voiceEnabled,
  onToggleVoice
}: Props) {
  return (
    <main className="h-[100dvh] w-full bg-[#070B13] text-slate-100 flex flex-col justify-between p-4 sm:p-6 font-sans max-w-md mx-auto select-none">
      <header className="flex justify-between items-center border-b border-slate-800 pb-3 text-xs font-mono">
        <div className="flex items-center gap-2">
          <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
          <span className="font-bold text-white tracking-wide">DRIVE PARTNERS OS</span>
        </div>
        <button
          onClick={onToggleVoice}
          className={`px-2.5 py-1 rounded-full border text-[11px] font-bold flex items-center gap-1 ${
            voiceEnabled ? 'bg-emerald-500/20 border-emerald-500 text-emerald-400' : 'bg-slate-800 text-slate-400'
          }`}
        >
          {voiceEnabled ? <Volume2 className="w-3.5 h-3.5" /> : <VolumeX className="w-3.5 h-3.5" />}
          <span>Voice</span>
        </button>
      </header>

      <div className="space-y-4 my-auto text-center">
        <div className="space-y-1">
          <span className="px-3 py-0.5 rounded-full bg-slate-900 border border-slate-800 text-[10px] font-mono text-emerald-400">
            DVSA & STATUTORY FREIGHT PLATFORM
          </span>
          <h1 className="text-2xl font-black text-white">Select Portal</h1>
          <p className="text-xs text-slate-400">Choose your operational role</p>
        </div>

        {/* 3 ROLES: DRIVER, FLEET, SITE ADMIN */}
        <div className="space-y-2">
          <button
            onClick={onSelectDriverSignIn}
            className="w-full py-3 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black text-xs uppercase rounded-xl flex items-center justify-center gap-2 shadow-lg shadow-emerald-500/20"
          >
            <LogIn className="w-4 h-4" /> 1. Driver Sign In
          </button>

          <button
            onClick={onSelectDriverRegister}
            className="w-full py-3 bg-slate-900 hover:bg-slate-800 border-2 border-slate-700 hover:border-slate-500 text-white font-bold text-xs uppercase rounded-xl flex items-center justify-center gap-2"
          >
            <Truck className="w-4 h-4 text-emerald-400" /> 2. New Driver Registration
          </button>

          <button
            onClick={onSelectFleetRegister}
            className="w-full py-3 bg-blue-950/40 hover:bg-blue-900/40 border border-blue-500/40 text-blue-300 font-bold text-xs uppercase rounded-xl flex items-center justify-center gap-2"
          >
            <Building2 className="w-4 h-4 text-blue-400" /> 3. Haulier / Fleet Operator
          </button>

          <button
            onClick={onSelectSiteAdmin}
            className="w-full py-3 bg-amber-950/40 hover:bg-amber-900/40 border border-amber-500/40 text-amber-300 font-bold text-xs uppercase rounded-xl flex items-center justify-center gap-2"
          >
            <MapPin className="w-4 h-4 text-amber-400" /> 4. Depot / Google Places Admin (Risk Assessments)
          </button>
        </div>

        {/* 1-TAP FAST AUTH */}
        <div className="space-y-1.5 pt-1">
          <div className="text-[10px] font-mono text-slate-500 uppercase tracking-wider">Fast 1-tap sign in</div>
          <div className="grid grid-cols-2 gap-2">
            <button
              onClick={() => onFastAuth('alexkite1975@gmail.com')}
              className="py-2 px-3 bg-slate-900 border border-slate-800 rounded-xl text-xs font-bold text-slate-300 hover:text-white"
            >
              Google
            </button>
            <button
              onClick={() => onFastAuth('alexkite1975@gmail.com')}
              className="py-2 px-3 bg-slate-900 border border-slate-800 rounded-xl text-xs font-bold text-slate-300 hover:text-white"
            >
              Apple
            </button>
          </div>
        </div>
      </div>

      <footer className="text-center text-[10px] font-mono text-slate-600">
        UK COMMERCIAL TRANSPORT STANDARD • HSE HSG136 & DVSA COMPLIANT
      </footer>
    </main>
  );
}
