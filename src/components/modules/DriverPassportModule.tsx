'use client';
import React, { useState } from 'react';
import { UserCheck, CreditCard, ShieldCheck, Award, AlertCircle } from 'lucide-react';

export default function DriverPassportModule({ onBack }: { onBack: () => void }) {
  const [tachoInserted, setTachoInserted] = useState(true);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between border-b border-slate-800 pb-4">
        <div>
          <h2 className="text-xl font-bold font-mono text-white flex items-center gap-2">
            <UserCheck className="w-6 h-6 text-emerald-400" />
            01. Driver Passport & Digital CPC Credential
          </h2>
          <p className="text-xs text-slate-400 font-mono mt-1">
            Statutory DVLA Driver Qualification & Digital Tachograph Authentication
          </p>
        </div>
        <button onClick={onBack} className="px-3 py-1.5 rounded-lg bg-slate-800 text-xs font-mono text-slate-300 hover:bg-slate-700">
          ← Back to Cockpit
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Digital Tacho Card Graphic */}
        <div className="bg-gradient-to-br from-slate-900 to-slate-950 border border-slate-800 rounded-2xl p-5 shadow-xl relative overflow-hidden">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-mono font-bold text-emerald-400 uppercase tracking-widest">
              UK Digital Tachograph Card
            </span>
            <CreditCard className="w-5 h-5 text-slate-400" />
          </div>
          <div className="mt-6 flex items-center gap-4">
            <div className="w-14 h-14 rounded-full bg-slate-800 border-2 border-emerald-500/50 flex items-center justify-center text-lg font-bold font-mono text-white">
              AK
            </div>
            <div>
              <div className="text-lg font-bold font-mono text-white">Alex Kite</div>
              <div className="text-xs font-mono text-slate-400">Card No: <span className="text-slate-200 font-bold">GB-902184-01</span></div>
              <div className="text-xs font-mono text-slate-400">Valid: <span className="text-emerald-400 font-bold">2029-05-18</span></div>
            </div>
          </div>
          <div className="mt-6 pt-4 border-t border-slate-800 flex items-center justify-between">
            <span className="text-xs font-mono text-slate-300">
              Slot Status: <strong className={tachoInserted ? "text-emerald-400" : "text-amber-400"}>{tachoInserted ? "CARD INSERTED (SLOT 1)" : "CARD EJECTED"}</strong>
            </span>
            <button
              onClick={() => setTachoInserted(!tachoInserted)}
              className="px-3 py-1 rounded bg-slate-800 hover:bg-slate-700 text-xs font-mono font-bold text-slate-200"
            >
              {tachoInserted ? "Eject Card" : "Insert Card"}
            </button>
          </div>
        </div>

        {/* DVLA & CPC Status */}
        <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-5 space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-xs font-mono font-bold text-slate-300 uppercase">DVLA Licence Checks</span>
            <ShieldCheck className="w-5 h-5 text-emerald-400" />
          </div>
          <div className="space-y-2 font-mono text-xs">
            <div className="flex justify-between p-2 rounded bg-slate-950/60 border border-slate-800/80">
              <span className="text-slate-400">Category C+E (Articulated HGV):</span>
              <span className="text-emerald-400 font-bold">VERIFIED (0 Points)</span>
            </div>
            <div className="flex justify-between p-2 rounded bg-slate-950/60 border border-slate-800/80">
              <span className="text-slate-400">Driver CPC Periodic Training:</span>
              <span className="text-emerald-400 font-bold">35 / 35 Hours Done</span>
            </div>
            <div className="flex justify-between p-2 rounded bg-slate-950/60 border border-slate-800/80">
              <span className="text-slate-400">DQC Expiry Date:</span>
              <span className="text-white font-bold">2028-09-14</span>
            </div>
            <div className="flex justify-between p-2 rounded bg-slate-950/60 border border-slate-800/80">
              <span className="text-slate-400">Right to Work in UK:</span>
              <span className="text-emerald-400 font-bold">SHARE CODE VERIFIED</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
