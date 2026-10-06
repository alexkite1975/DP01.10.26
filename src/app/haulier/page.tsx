'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  Briefcase, Truck, Users, ShieldCheck, MapPin, Search,
  DollarSign, ArrowLeft, ArrowRight, CheckSquare, Clock, FileText
} from 'lucide-react';

export default function HaulierDashboardPage() {
  const [activeTab, setActiveTab] = useState<'tracking' | 'dispatch' | 'compliance'>('tracking');

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans pb-16">
      {/* Top Header */}
      <header className="sticky top-0 z-40 bg-slate-900/95 backdrop-blur border-b border-slate-800 px-4 py-3 shadow-xl">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <Link href="/" className="h-9 w-9 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-center text-slate-400 hover:text-white">
              <ArrowLeft className="w-4 h-4" />
            </Link>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-mono font-black text-sm text-blue-400 tracking-wider">DRIVE PARTNERS FLEET</span>
                <span className="text-[10px] font-mono bg-blue-500/20 text-blue-300 border border-blue-500/30 px-2 py-0.5 rounded font-bold">O-LICENCE: OF2049182</span>
              </div>
              <p className="text-[11px] text-slate-400 font-mono">15 Tractors • 22 Trailers • 14 Active Shifts</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Link href="/onboarding" className="text-xs font-mono text-slate-400 hover:text-white px-2.5 py-1.5 rounded-lg bg-slate-950 border border-slate-800">
              Fleet Settings
            </Link>
          </div>
        </div>

        {/* Tab Selector */}
        <div className="max-w-7xl mx-auto flex gap-1 mt-3 overflow-x-auto pb-1 text-xs font-mono">
          <button
            onClick={() => setActiveTab('tracking')}
            className={`px-3 py-1.5 rounded-lg transition shrink-0 ${activeTab === 'tracking' ? 'bg-blue-600 text-white font-bold' : 'text-slate-400 hover:text-white'}`}
          >
            1. Fleet & Driver Search (1Hz Map)
          </button>
          <button
            onClick={() => setActiveTab('dispatch')}
            className={`px-3 py-1.5 rounded-lg transition shrink-0 ${activeTab === 'dispatch' ? 'bg-blue-600 text-white font-bold' : 'text-slate-400 hover:text-white'}`}
          >
            2. Direct Dispatch (£28/hr) & Return Loads
          </button>
          <button
            onClick={() => setActiveTab('compliance')}
            className={`px-3 py-1.5 rounded-lg transition shrink-0 ${activeTab === 'compliance' ? 'bg-blue-600 text-white font-bold' : 'text-slate-400 hover:text-white'}`}
          >
            3. Fleet Compliance & Demurrage Billing
          </button>
        </div>
      </header>

      {/* Main Container */}
      <main className="max-w-7xl mx-auto p-4 sm:p-6 space-y-6">
        {activeTab === 'tracking' && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="md:col-span-2 bg-slate-900 border border-slate-800 p-6 rounded-3xl space-y-4">
              <h2 className="text-base font-black text-white flex items-center gap-2">
                <MapPin className="w-5 h-5 text-blue-400" />
                Live 1Hz Fleet Telematics Stream
              </h2>
              <div className="h-64 bg-slate-950 border border-slate-800 rounded-2xl flex flex-col items-center justify-center text-xs font-mono text-slate-400">
                <Truck className="w-8 h-8 text-blue-400 mb-2 animate-bounce" />
                <span>15 Tractors Online • All units streaming 1Hz GPS</span>
                <span className="text-[10px] text-emerald-400 mt-1">Redis Geo Clustering Active</span>
              </div>
            </div>

            <div className="bg-slate-900 border border-slate-800 p-5 rounded-3xl space-y-3">
              <h3 className="text-sm font-black text-white">Vehicle Inspector Card</h3>
              <div className="p-3 bg-slate-950 rounded-xl border border-slate-800 text-xs font-mono space-y-1.5">
                <div className="flex justify-between"><span>Unit:</span><strong className="text-white">DG21 EDP</strong></div>
                <div className="flex justify-between"><span>Trailer:</span><strong className="text-emerald-400">TR-8492</strong></div>
                <div className="flex justify-between"><span>Driver:</span><strong className="text-slate-200">Alex Kite</strong></div>
                <div className="flex justify-between"><span>MOT Expiry:</span><strong className="text-slate-200">14 Nov 2026</strong></div>
                <div className="flex justify-between"><span>PM Inspection:</span><strong className="text-emerald-400">Due in 18 Days</strong></div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'dispatch' && (
          <div className="space-y-6">
            <div className="bg-slate-900 border border-slate-800 p-6 rounded-3xl space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-base font-black text-white flex items-center gap-2">
                    <DollarSign className="w-5 h-5 text-emerald-400" />
                    Direct Driver Shift Dispatch (£28.00/Hour)
                  </h2>
                  <p className="text-xs text-slate-400 font-mono">Zero Agency Fees • Instant D906 Electronic Mandate & CPC Verification</p>
                </div>
                <button
                  onClick={() => alert('New Shift Published: £28.00/hr Class 1 Tramper out of Park Royal NW10.')}
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white font-mono font-bold text-xs rounded-xl"
                >
                  + Post Direct Shift
                </button>
              </div>

              <div className="p-4 bg-slate-950 border border-slate-800 rounded-2xl flex items-center justify-between text-xs font-mono">
                <div>
                  <strong className="text-white block">Park Royal NW10 → Magna Park Lutterworth</strong>
                  <span className="text-slate-400">Class 1 C+E Night Trunk • 19:00 - 05:00</span>
                </div>
                <span className="text-emerald-400 font-bold bg-emerald-500/20 px-3 py-1 rounded-lg border border-emerald-500/40">
                  £28.00/hr Fixed
                </span>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'compliance' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-slate-900 border border-slate-800 p-6 rounded-3xl space-y-3">
              <h2 className="text-base font-black text-white flex items-center gap-2">
                <CheckSquare className="w-5 h-5 text-emerald-400" />
                Live 32-Pt Vehicle Check Submissions
              </h2>
              <p className="text-xs text-slate-400">Incoming daily walkaround reports with photo defect triage and immediate PG9 notifications.</p>
              <div className="p-3 bg-slate-950 rounded-xl border border-slate-800 text-xs font-mono flex items-center justify-between">
                <span>Unit DG21 EDP (A. Kite):</span>
                <span className="text-emerald-400 font-bold">✓ PASSED 32/32 (07:15)</span>
              </div>
            </div>

            <div className="bg-slate-900 border border-slate-800 p-6 rounded-3xl space-y-3">
              <h2 className="text-base font-black text-white flex items-center gap-2">
                <DollarSign className="w-5 h-5 text-amber-400" />
                Demurrage Invoicing Manager
              </h2>
              <p className="text-xs text-slate-400">Driver detention logs auto-billed to customer accounts at £45.00/hour after 60m dwell.</p>
              <div className="p-3 bg-slate-950 rounded-xl border border-slate-800 text-xs font-mono flex items-center justify-between">
                <span>Shipper Amazon Tilbury:</span>
                <span className="text-amber-400 font-bold">£51.50 Billable (01h 08m)</span>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
