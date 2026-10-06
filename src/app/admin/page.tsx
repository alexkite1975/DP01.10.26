'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  Lock, KeyRound, ShieldAlert, Sliders, Users, Server, ArrowLeft, ArrowRight
} from 'lucide-react';

export default function AdminPage() {
  const [passcode, setPasscode] = useState('');
  const [unlocked, setUnlocked] = useState(false);

  const [flags, setFlags] = useState({
    vehicleCheck: true,
    routeOptimiser: true,
    siteAssessment: true,
    bridgeShield: true,
    demurrageEngine: true,
    sosEmergency: true,
    tachoDddReader: true,
    openAuth: true,
    haulierExchange: true
  });

  const toggleFlag = (key: keyof typeof flags) => {
    setFlags(f => ({ ...f, [key]: !f[key] }));
  };

  const handleUnlock = (e: React.FormEvent) => {
    e.preventDefault();
    if (passcode === 'DP-ADMIN-2026') {
      setUnlocked(true);
    } else {
      alert('Invalid Passcode. Access restricted to Master Admins.');
    }
  };

  if (!unlocked) {
    return (
      <div className="min-h-screen bg-slate-950 text-slate-100 flex items-center justify-center p-4">
        <form onSubmit={handleUnlock} className="bg-slate-900 border border-slate-800 p-8 rounded-3xl max-w-md w-full space-y-5 text-center shadow-2xl">
          <div className="h-14 w-14 rounded-2xl bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-amber-400 mx-auto">
            <Lock className="w-7 h-7" />
          </div>
          <div>
            <h1 className="text-xl font-black text-white">Drive Partners Admin Gate</h1>
            <p className="text-xs text-slate-400 mt-1 font-mono">Workflow 4 • Central Command & Feature Flags</p>
          </div>
          <input
            type="password"
            value={passcode}
            onChange={e => setPasscode(e.target.value)}
            placeholder="Enter Master Passcode (DP-ADMIN-2026)"
            className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-center text-sm font-mono text-white outline-none focus:border-amber-400"
          />
          <button
            type="submit"
            className="w-full py-3.5 bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-xs font-mono rounded-xl transition"
          >
            Unlock Command Centre →
          </button>
        </form>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans p-6 space-y-6">
      <header className="max-w-6xl mx-auto flex items-center justify-between pb-6 border-b border-slate-800">
        <div>
          <h1 className="text-xl font-black text-white flex items-center gap-2">
            DRIVE PARTNERS CMS
            <span className="text-[10px] bg-amber-500/20 text-amber-400 border border-amber-500/40 px-2 py-0.5 rounded-full font-mono font-bold">
              CENTRAL COMMAND
            </span>
          </h1>
          <p className="text-xs text-slate-400 font-mono">Master Feature Flag Engine & Security Audit</p>
        </div>
        <Link href="/" className="px-3 py-1.5 bg-slate-900 border border-slate-800 text-xs font-mono rounded-xl hover:text-white">
          Exit to Launchpad
        </Link>
      </header>

      <main className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Feature Flags */}
        <div className="bg-slate-900 border border-slate-800 p-6 rounded-3xl space-y-4">
          <h2 className="text-sm font-black text-white flex items-center gap-2">
            <Sliders className="w-4 h-4 text-emerald-400" />
            Granular Module Feature Flags
          </h2>
          <div className="space-y-2 font-mono text-xs">
            {Object.entries(flags).map(([key, val]) => (
              <div key={key} className="flex items-center justify-between p-3 bg-slate-950 rounded-xl border border-slate-800">
                <span className="capitalize">{key.replace(/([A-Z])/g, ' $1')}</span>
                <button
                  onClick={() => toggleFlag(key as keyof typeof flags)}
                  className={`px-3 py-1 rounded-lg font-bold text-[10px] ${val ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40' : 'bg-red-500/20 text-red-400 border border-red-500/40'}`}
                >
                  {val ? 'ENABLED' : 'DISABLED'}
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Audit Rosters */}
        <div className="bg-slate-900 border border-slate-800 p-6 rounded-3xl space-y-4">
          <h2 className="text-sm font-black text-white flex items-center gap-2">
            <Users className="w-4 h-4 text-blue-400" />
            User Roster & Whistleblower Audit
          </h2>
          <div className="space-y-3 font-mono text-xs">
            <div className="p-3 bg-slate-950 rounded-xl border border-slate-800">
              <span className="text-slate-500 text-[10px] block">Verified Drivers</span>
              <strong className="text-white">Alexander James Kite (C+E Artic, 0 Points, D906 Signed)</strong>
            </div>
            <div className="p-3 bg-slate-950 rounded-xl border border-slate-800">
              <span className="text-slate-500 text-[10px] block">Verified Operators</span>
              <strong className="text-white">Drive Partners Logistics Ltd (O-Licence: OF2049182)</strong>
            </div>
            <div className="p-3 bg-slate-950 rounded-xl border border-slate-800">
              <span className="text-slate-500 text-[10px] block">Unresolved Yard Whistleblower Hazards</span>
              <strong className="text-emerald-400">0 Unresolved • All 48h SLAs Clear</strong>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
