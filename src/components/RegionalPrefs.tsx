'use client';
import React, { useState } from 'react';
import { ChevronLeft, ChevronRight, Gauge, Globe, Ruler, Navigation } from 'lucide-react';

interface Props {
  onBack: () => void;
  onNext: (prefs: any) => void;
}

export default function RegionalPrefs({ onBack, onNext }: Props) {
  const [driverUnits, setDriverUnits] = useState<'Miles (mph)' | 'Kilometres (km/h)'>('Miles (mph)');
  const [driverLang, setDriverLang] = useState('English (UK)');
  const [vehicleHeight, setVehicleHeight] = useState('4.9m (Double-Deck Artic)');
  const [navApp, setNavApp] = useState<'Google Maps' | 'Waze' | 'Apple Maps' | 'TomTom Go'>('Google Maps');

  return (
    <main className="h-[100dvh] w-full bg-[#070B13] text-slate-100 flex flex-col justify-between p-4 sm:p-6 font-sans max-w-md mx-auto select-none">
      <header className="flex justify-between items-center border-b border-slate-800 pb-3 text-xs font-mono shrink-0">
        <button onClick={onBack} className="text-slate-400 flex items-center gap-1">
          <ChevronLeft className="w-4 h-4" /> Back
        </button>
        <span className="font-bold text-emerald-400">REGIONAL PREFERENCES</span>
        <span className="text-emerald-400 text-[10px]">Step 3/4</span>
      </header>

      <div className="space-y-4 my-auto overflow-y-auto max-h-[80vh] pr-1 font-mono text-xs">
        <div>
          <h2 className="text-xl font-black text-white font-sans">Set Regional Preferences</h2>
          <p className="text-xs text-slate-400">Units, dimensions & in-cab navigation</p>
        </div>

        <div className="space-y-1.5">
          <label className="text-[10px] text-slate-400 flex items-center gap-1">
            <Gauge className="w-3.5 h-3.5 text-emerald-400" /> DISTANCE & SPEED UNITS
          </label>
          <div className="grid grid-cols-2 gap-2 font-bold">
            {(['Miles (mph)', 'Kilometres (km/h)'] as const).map(u => (
              <button
                key={u}
                type="button"
                onClick={() => setDriverUnits(u)}
                className={`p-2.5 rounded-xl border text-center ${
                  driverUnits === u ? 'bg-emerald-950 border-emerald-400 text-emerald-400' : 'bg-slate-950 border-slate-800 text-slate-400'
                }`}
              >
                {u}
              </button>
            ))}
          </div>
        </div>

        <div className="space-y-1.5">
          <label className="text-[10px] text-slate-400 flex items-center gap-1">
            <Globe className="w-3.5 h-3.5 text-blue-400" /> SYSTEM LANGUAGE & TIMEZONE
          </label>
          <div className="grid grid-cols-2 gap-2 text-[11px] font-bold">
            {['English (UK)', 'Polski', 'Română', 'Español'].map(lang => (
              <button
                key={lang}
                type="button"
                onClick={() => setDriverLang(lang)}
                className={`p-2 rounded-xl border text-center ${
                  driverLang === lang ? 'bg-blue-950 border-blue-400 text-blue-400' : 'bg-slate-950 border-slate-800 text-slate-400'
                }`}
              >
                {lang}
              </button>
            ))}
          </div>
        </div>

        <div className="space-y-1.5">
          <label className="text-[10px] text-slate-400 flex items-center gap-1">
            <Ruler className="w-3.5 h-3.5 text-amber-400" /> VEHICLE CLEARANCE DEFAULT (BRIDGE SAFEGUARD)
          </label>
          <select
            value={vehicleHeight}
            onChange={e => setVehicleHeight(e.target.value)}
            className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-white text-xs"
          >
            <option value="4.9m (Double-Deck Artic)">4.9m Height (Double-Deck Artic)</option>
            <option value="4.2m (Standard Box Trailer)">4.2m Height (Standard Box Trailer)</option>
            <option value="4.0m (Curtainside)">4.0m Height (Curtainside)</option>
          </select>
        </div>

        <div className="space-y-1.5">
          <label className="text-[10px] text-slate-400 flex items-center gap-1">
            <Navigation className="w-3.5 h-3.5 text-emerald-400" /> PREFERRED NAVIGATION APP
          </label>
          <div className="grid grid-cols-2 gap-2 font-bold text-[11px]">
            {(['Google Maps', 'Waze', 'Apple Maps', 'TomTom Go'] as const).map(app => (
              <button
                key={app}
                type="button"
                onClick={() => setNavApp(app)}
                className={`p-2 rounded-xl border text-center ${
                  navApp === app ? 'bg-emerald-950 border-emerald-400 text-emerald-400' : 'bg-slate-950 border-slate-800 text-slate-400'
                }`}
              >
                {app}
              </button>
            ))}
          </div>
        </div>

        <button
          onClick={() => onNext({ driverUnits, driverLang, vehicleHeight, navApp })}
          className="w-full py-4 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black text-xs uppercase rounded-xl flex items-center justify-center gap-1.5 shadow-lg shadow-emerald-500/20"
        >
          Next: Review & Accept Terms <ChevronRight className="w-4 h-4" />
        </button>
      </div>

      <footer className="text-center text-[10px] font-mono text-slate-600">STEP 3: REGIONAL & VEHICLE CONFIG</footer>
    </main>
  );
}
