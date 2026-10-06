'use client';

import React from 'react';
import Link from 'next/link';
import {
  Truck, Briefcase, Lock, CheckSquare, Search,
  Navigation, ShieldAlert, Award, ArrowRight
} from 'lucide-react';

export default function HomePage() {
  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans p-6 flex flex-col justify-between">
      <header className="max-w-5xl mx-auto w-full flex items-center justify-between pb-6 border-b border-slate-800">
        <div>
          <h1 className="text-xl font-black text-white tracking-tight flex items-center gap-2">
            DRIVE PARTNERS
            <span className="text-[10px] bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 px-2 py-0.5 rounded-full font-mono font-bold">
              PRODUCTION 2026
            </span>
          </h1>
          <p className="text-xs text-slate-400 font-mono">Driver-First Commercial Logistics Operating System</p>
        </div>
        <Link
          href="/admin"
          className="text-xs font-mono text-slate-400 hover:text-white px-3 py-1.5 rounded-xl bg-slate-900 border border-slate-800 flex items-center gap-1.5"
        >
          <Lock className="w-3.5 h-3.5 text-amber-400" /> Admin CMS
        </Link>
      </header>

      <main className="max-w-5xl mx-auto w-full py-10 space-y-8">
        <div className="text-center space-y-2">
          <span className="text-xs font-mono uppercase tracking-wider text-emerald-400 font-bold bg-emerald-500/10 border border-emerald-500/30 px-3 py-1 rounded-full inline-block">
            Universal Operating Launchpad
          </span>
          <h2 className="text-3xl sm:text-4xl font-black text-white">
            Select Your Dedicated Portal
          </h2>
          <p className="text-sm text-slate-400 max-w-lg mx-auto">
            Every statutory module and workflow is active across driver, operator, and administrative domains.
          </p>
        </div>

        {/* 3 Main Workflow Portals */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Workflow 1: Onboarding */}
          <Link
            href="/onboarding"
            className="group bg-slate-900/80 hover:bg-slate-900 border border-slate-800 hover:border-emerald-500/60 p-6 rounded-3xl space-y-4 transition shadow-xl flex flex-col justify-between"
          >
            <div className="space-y-3">
              <div className="h-12 w-12 rounded-2xl bg-emerald-500/20 border border-emerald-500/50 flex items-center justify-center text-emerald-400 group-hover:scale-105 transition">
                <Award className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-black text-white group-hover:text-emerald-400 transition">
                1. Onboarding & Entitlement
              </h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Photocard licence scan, Smart Digi-Tacho & CPC hours check, regional units & running height placard, and D906 sign-on-glass.
              </p>
            </div>
            <div className="text-xs font-mono font-bold text-emerald-400 pt-3 border-t border-slate-800 flex items-center justify-between">
              Launch Workflow 1 <ArrowRight className="w-4 h-4" />
            </div>
          </Link>

          {/* Workflow 2: Driver In-Cab OS */}
          <Link
            href="/driver"
            className="group bg-slate-900/80 hover:bg-slate-900 border border-slate-800 hover:border-emerald-500/60 p-6 rounded-3xl space-y-4 transition shadow-xl flex flex-col justify-between ring-1 ring-emerald-500/30"
          >
            <div className="space-y-3">
              <div className="h-12 w-12 rounded-2xl bg-emerald-500/20 border border-emerald-500/50 flex items-center justify-center text-emerald-400 group-hover:scale-105 transition">
                <Truck className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-black text-white group-hover:text-emerald-400 transition">
                2. Driver In-Cab OS
              </h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Vehicle Check (32-pt), Google Places Route Builder, Bridge Strike Shield, £45/hr Demurrage, Dual Tacho (.DDD), and 1-Tap SOS.
              </p>
            </div>
            <div className="text-xs font-mono font-bold text-emerald-400 pt-3 border-t border-slate-800 flex items-center justify-between">
              Launch Workflow 2 <ArrowRight className="w-4 h-4" />
            </div>
          </Link>

          {/* Workflow 3: Haulier Fleet Portal */}
          <Link
            href="/haulier"
            className="group bg-slate-900/80 hover:bg-slate-900 border border-slate-800 hover:border-blue-500/60 p-6 rounded-3xl space-y-4 transition shadow-xl flex flex-col justify-between"
          >
            <div className="space-y-3">
              <div className="h-12 w-12 rounded-2xl bg-blue-500/20 border border-blue-500/50 flex items-center justify-center text-blue-400 group-hover:scale-105 transition">
                <Briefcase className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-black text-white group-hover:text-blue-400 transition">
                3. Haulier Fleet Portal
              </h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Live 1Hz telematics map, direct £28/hr shift dispatch, return load exchange, 32-pt inspection triage, and demurrage billing.
              </p>
            </div>
            <div className="text-xs font-mono font-bold text-blue-400 pt-3 border-t border-slate-800 flex items-center justify-between">
              Launch Workflow 3 <ArrowRight className="w-4 h-4" />
            </div>
          </Link>
        </div>
      </main>

      <footer className="max-w-5xl mx-auto w-full border-t border-slate-800 text-center py-4 text-xs font-mono text-slate-500">
        Drive Partners • Complete Multi-Workflow Platform • https://drivepartners.app
      </footer>
    </div>
  );
}
