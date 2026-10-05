'use client';
import React from 'react';
import { Building2, ShieldCheck, Truck, Users, LogOut, CheckCircle2 } from 'lucide-react';

interface Props {
  fleet: any;
  onLogout: () => void;
}

export default function FleetDashboard({ fleet, onLogout }: Props) {
  return (
    <main className="min-h-[100dvh] w-full bg-[#070B13] text-slate-100 p-4 sm:p-6 space-y-4 max-w-5xl mx-auto font-sans">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center border-b border-slate-800 pb-3 gap-3">
        <div>
          <div className="text-[11px] font-mono font-bold text-blue-400 uppercase tracking-widest flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-blue-400 animate-pulse" />
            HAULIER FLEET OPERATOR • {fleet?.companyName}
          </div>
          <h1 className="text-xl font-black text-white mt-0.5">Fleet Compliance Hub</h1>
        </div>

        <button
          onClick={onLogout}
          className="px-3 py-1.5 bg-rose-500/10 border border-rose-500/30 text-rose-400 rounded-xl text-xs font-mono flex items-center gap-1.5"
        >
          <LogOut className="w-3.5 h-3.5" /> Log Out
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 font-mono text-xs">
        <div className="p-4 bg-slate-900 border border-slate-800 rounded-2xl">
          <span className="text-slate-500 text-[10px] block">OPERATING LICENCE</span>
          <span className="text-lg font-bold text-emerald-400">{fleet?.operatingLicenceNo || 'OF2039182'}</span>
          <span className="text-[10px] text-slate-400 mt-1 block">Traffic Commissioner: VALID</span>
        </div>
        <div className="p-4 bg-slate-900 border border-slate-800 rounded-2xl">
          <span className="text-slate-500 text-[10px] block">ACTIVE FLEET SIZE</span>
          <span className="text-lg font-bold text-white">{fleet?.fleetSize || '25-50 HGVs'}</span>
          <span className="text-[10px] text-slate-400 mt-1 block">All vehicles tracker synced</span>
        </div>
        <div className="p-4 bg-slate-900 border border-slate-800 rounded-2xl">
          <span className="text-slate-500 text-[10px] block">DRIVER COMPLIANCE SCORE</span>
          <span className="text-lg font-bold text-emerald-400">99.4% GREEN</span>
          <span className="text-[10px] text-slate-400 mt-1 block">0 Incurred Infringements</span>
        </div>
      </div>

      <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-5 space-y-3 font-mono text-xs">
        <h3 className="text-sm font-bold text-white">Live Driver Roster & Tachograph Status</h3>
        <div className="p-3 bg-slate-950 border border-slate-800 rounded-xl flex justify-between items-center">
          <div>
            <div className="font-bold text-white">Alexander James Kite (Cat C+E)</div>
            <div className="text-[10px] text-slate-400">Card: UK 84729104882 • Vehicle: VOLVO FH 500</div>
          </div>
          <span className="px-2.5 py-1 bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 rounded-full text-[10px] font-bold">
            ✓ Synced & Compliant
          </span>
        </div>
      </div>
    </main>
  );
}
