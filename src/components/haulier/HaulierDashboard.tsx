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
