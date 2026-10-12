'use client';

import React from 'react';
import Link from 'next/link';
import {
  CheckCircle2,
  Clock,
  Shield,
  Navigation,
  MapPin,
  Truck,
  ArrowRight,
  UserCheck,
  Building2,
  FileCheck2,
  ExternalLink,
  Radio,
  Sparkles,
  Zap,
  Activity,
  Layers,
  ChevronRight
} from 'lucide-react';
import { audioFeedback } from '@/utils/audioFeedback';

export default function DriverPage() {
  return (
    <div className="min-h-dvh bg-slate-950 text-white flex flex-col font-sans">
      {/* Clean Driver Header */}
      <header className="sticky top-0 z-30 bg-slate-900/95 backdrop-blur-md border-b border-slate-800 px-4 py-3">
        <div className="max-w-md mx-auto flex items-center justify-between">
          <div>
            <h1 className="text-base font-bold text-white tracking-tight">Driver Dashboard</h1>
            <p className="text-[11px] text-slate-400 font-mono">Alexander James Kite • Class 1 C+E</p>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-mono font-bold text-slate-200 bg-slate-800 px-2.5 py-1 rounded-lg border border-slate-700">
              GN21 EVX
            </span>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 w-full max-w-md mx-auto p-4 space-y-4">
        {/* Active Vehicle & Trailer Status Card */}
        <div className="p-3.5 rounded-2xl bg-slate-900/90 border border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-cyan-950 text-cyan-400 border border-cyan-800/60">
              <Truck className="w-5 h-5" />
            </div>
            <div>
              <div className="text-xs font-bold text-white">44t Articulated HGV</div>
              <div className="text-[11px] text-slate-400 font-mono mt-0.5">
                Trailer: <strong className="text-slate-200">TR-8492</strong> • Height: <strong className="text-amber-400">4.45m (14&apos; 7&quot;)</strong>
              </div>
            </div>
          </div>
          <Link
            href="/driver/inspections/select-vehicle"
            className="text-[10px] font-mono font-bold text-cyan-400 hover:text-cyan-300 bg-cyan-950/60 px-2.5 py-1.5 rounded-lg border border-cyan-800/60 hover:border-cyan-600 transition shrink-0"
          >
            CHANGE
          </Link>
        </div>

        {/* Tachograph Quick Status (The 3 Golden Numbers) */}
        <div className="p-4 rounded-2xl bg-slate-900/90 border border-slate-800 space-y-3">
          <div className="flex items-center justify-between border-b border-slate-800/80 pb-2">
            <span className="text-[11px] font-mono font-bold text-slate-400 uppercase tracking-wider">
              Shift Compliance Status
            </span>
            <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-emerald-950 text-emerald-400 border border-emerald-800/60">
              0 INFRINGEMENTS
            </span>
          </div>

          <div className="grid grid-cols-3 gap-2 text-center">
            <div className="p-2.5 rounded-xl bg-slate-950 border border-slate-800/80">
              <div className="text-[10px] font-mono text-slate-400">Drive Left</div>
              <div className="text-base font-black text-cyan-400 font-mono mt-0.5">0h 18m</div>
            </div>
            <div className="p-2.5 rounded-xl bg-slate-950 border border-slate-800/80">
              <div className="text-[10px] font-mono text-slate-400">Continuous</div>
              <div className="text-base font-black text-amber-400 font-mono mt-0.5">4h 30m</div>
            </div>
            <div className="p-2.5 rounded-xl bg-slate-950 border border-slate-800/80">
              <div className="text-[10px] font-mono text-slate-400">Next Start</div>
              <div className="text-base font-black text-emerald-400 font-mono mt-0.5">04:26</div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-2 pt-1">
            <Link
              href="/driver/tacho"
              className="py-2 px-3 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-slate-950 font-bold text-xs font-mono text-center transition flex items-center justify-center gap-1.5"
            >
              <Clock className="w-3.5 h-3.5" />
              <span>Open Tacho</span>
            </Link>
            <Link
              href="/driver/walkaround"
              className="py-2 px-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs font-mono text-center transition flex items-center justify-center gap-1.5 border border-slate-700"
            >
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
              <span>Walkaround</span>
            </Link>
          </div>
        </div>

        {/* Dedicated Operational Workflows */}
        <div className="space-y-2">
          <div className="text-[11px] font-mono font-bold text-slate-400 uppercase tracking-wider px-1">
            Driver Workflows
          </div>

          {/* 1. Driver Walkaround */}
          <Link
            href="/driver/walkaround"
            className="w-full min-h-[68px] p-3.5 rounded-2xl bg-slate-900 hover:bg-slate-850 border border-slate-800 hover:border-emerald-500/50 transition flex items-center justify-between group"
          >
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-xl bg-emerald-950 text-emerald-400 border border-emerald-800/60 group-hover:scale-105 transition">
                <CheckCircle2 className="w-5 h-5" />
              </div>
              <div className="text-left">
                <div className="text-sm font-bold text-white flex items-center gap-2">
                  <span>Driver Walkaround</span>
                  <span className="text-[9px] font-mono font-bold px-1.5 py-0.5 rounded bg-emerald-950 text-emerald-400 border border-emerald-800/60">
                    DVSA
                  </span>
                </div>
                <div className="text-[11px] text-slate-400 mt-0.5">
                  32-point inspection • Defect photos • Digital sign-off
                </div>
              </div>
            </div>
            <ArrowRight className="w-4 h-4 text-slate-500 group-hover:text-emerald-400 group-hover:translate-x-0.5 transition shrink-0" />
          </Link>

          {/* 2. Tacho AI & .DDD */}
          <Link
            href="/driver/tacho"
            className="w-full min-h-[68px] p-3.5 rounded-2xl bg-slate-900 hover:bg-slate-850 border border-slate-800 hover:border-indigo-500/50 transition flex items-center justify-between group"
          >
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-xl bg-indigo-950 text-indigo-400 border border-indigo-800/60 group-hover:scale-105 transition">
                <Clock className="w-5 h-5" />
              </div>
              <div className="text-left">
                <div className="text-sm font-bold text-white flex items-center gap-2">
                  <span>Tacho AI &amp; .DDD</span>
                  <span className="text-[9px] font-mono font-bold px-1.5 py-0.5 rounded bg-indigo-950 text-indigo-300 border border-indigo-800/60">
                    EU 561
                  </span>
                </div>
                <div className="text-[11px] text-slate-400 mt-0.5">
                  Scan thermal roll • Card download • 28-day DVSA shield
                </div>
              </div>
            </div>
            <ArrowRight className="w-4 h-4 text-slate-500 group-hover:text-indigo-400 group-hover:translate-x-0.5 transition shrink-0" />
          </Link>

          {/* 3. Bridge & Safety Shield */}
          <Link
            href="/driver/safety"
            className="w-full min-h-[68px] p-3.5 rounded-2xl bg-slate-900 hover:bg-slate-850 border border-slate-800 hover:border-amber-500/50 transition flex items-center justify-between group"
          >
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-xl bg-amber-950 text-amber-400 border border-amber-800/60 group-hover:scale-105 transition">
                <Shield className="w-5 h-5" />
              </div>
              <div className="text-left">
                <div className="text-sm font-bold text-white flex items-center gap-2">
                  <span>Bridge &amp; Safety Shield</span>
                  <span className="text-[9px] font-mono font-bold px-1.5 py-0.5 rounded bg-amber-950 text-amber-300 border border-amber-800/60">
                    RADAR
                  </span>
                </div>
                <div className="text-[11px] text-slate-400 mt-0.5">
                  Low bridge radar • Running height warning • CB radio
                </div>
              </div>
            </div>
            <ArrowRight className="w-4 h-4 text-slate-500 group-hover:text-amber-400 group-hover:translate-x-0.5 transition shrink-0" />
          </Link>

          {/* 4. HGV Routing & Tours */}
          <Link
            href="/driver/route"
            className="w-full min-h-[68px] p-3.5 rounded-2xl bg-slate-900 hover:bg-slate-850 border border-slate-800 hover:border-cyan-500/50 transition flex items-center justify-between group"
          >
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-xl bg-cyan-950 text-cyan-400 border border-cyan-800/60 group-hover:scale-105 transition">
                <Navigation className="w-5 h-5" />
              </div>
              <div className="text-left">
                <div className="text-sm font-bold text-white flex items-center gap-2">
                  <span>HGV Routing &amp; Tours</span>
                  <span className="text-[9px] font-mono font-bold px-1.5 py-0.5 rounded bg-cyan-950 text-cyan-300 border border-cyan-800/60">
                    44t NAV
                  </span>
                </div>
                <div className="text-[11px] text-slate-400 mt-0.5">
                  Commercial truck routing • Axle limits • Tour legs
                </div>
              </div>
            </div>
            <ArrowRight className="w-4 h-4 text-slate-500 group-hover:text-cyan-400 group-hover:translate-x-0.5 transition shrink-0" />
          </Link>

          {/* 5. Site Risk & Services */}
          <Link
            href="/driver/sites"
            className="w-full min-h-[68px] p-3.5 rounded-2xl bg-slate-900 hover:bg-slate-850 border border-slate-800 hover:border-rose-500/50 transition flex items-center justify-between group"
          >
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-xl bg-rose-950 text-rose-400 border border-rose-800/60 group-hover:scale-105 transition">
                <MapPin className="w-5 h-5" />
              </div>
              <div className="text-left">
                <div className="text-sm font-bold text-white flex items-center gap-2">
                  <span>Site Risk &amp; Services</span>
                  <span className="text-[9px] font-mono font-bold px-1.5 py-0.5 rounded bg-rose-950 text-rose-300 border border-rose-800/60">
                    PARKING
                  </span>
                </div>
                <div className="text-[11px] text-slate-400 mt-0.5">
                  Motorway services parking • SNAP • DC gate guides
                </div>
              </div>
            </div>
            <ArrowRight className="w-4 h-4 text-slate-500 group-hover:text-rose-400 group-hover:translate-x-0.5 transition shrink-0" />
          </Link>

          {/* 6. Relief Driver Shifts (ReliefHGV) */}
          <Link
            href="/driver/shifts"
            className="w-full min-h-[68px] p-3.5 rounded-2xl bg-slate-900 hover:bg-slate-850 border border-slate-800 hover:border-teal-500/50 transition flex items-center justify-between group"
          >
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-xl bg-teal-950 text-teal-400 border border-teal-800/60 group-hover:scale-105 transition">
                <UserCheck className="w-5 h-5" />
              </div>
              <div className="text-left">
                <div className="text-sm font-bold text-white flex items-center gap-2">
                  <span>Relief Driver Shifts</span>
                  <span className="text-[9px] font-mono font-bold px-1.5 py-0.5 rounded bg-teal-950 text-teal-300 border border-teal-800/60">
                    IR35 SAFE
                  </span>
                </div>
                <div className="text-[11px] text-slate-400 mt-0.5">
                  Haulier shift cover • Night trunks • Direct self-billing
                </div>
              </div>
            </div>
            <ArrowRight className="w-4 h-4 text-slate-500 group-hover:text-teal-400 group-hover:translate-x-0.5 transition shrink-0" />
          </Link>
        </div>

        {/* Secondary Connected Links */}
        <div className="pt-2 border-t border-slate-800 space-y-2">
          <div className="text-[11px] font-mono font-bold text-slate-400 uppercase tracking-wider px-1">
            Connected Systems
          </div>
          <div className="grid grid-cols-2 gap-2">
            <Link
              href="/freight"
              className="p-3 rounded-xl bg-slate-900 border border-slate-800 hover:border-slate-700 transition flex items-center gap-2 text-xs font-semibold text-slate-200"
            >
              <Truck className="w-4 h-4 text-cyan-400" />
              <span className="truncate">Freight Exchange</span>
            </Link>
            <Link
              href="/driver/inspections/signoff"
              className="p-3 rounded-xl bg-slate-900 border border-slate-800 hover:border-slate-700 transition flex items-center gap-2 text-xs font-semibold text-slate-200"
            >
              <FileCheck2 className="w-4 h-4 text-emerald-400" />
              <span className="truncate">Inspection Sign-Off</span>
            </Link>
            <Link
              href="/haulier"
              className="col-span-2 p-3 rounded-xl bg-slate-900 border border-slate-800 hover:border-slate-700 transition flex items-center justify-between text-xs font-semibold text-slate-200"
            >
              <span className="flex items-center gap-2">
                <Building2 className="w-4 h-4 text-amber-400" />
                <span>Haulier Command Center</span>
              </span>
              <ExternalLink className="w-3.5 h-3.5 text-slate-500" />
            </Link>
          </div>
        </div>
      </main>
    </div>
  );
}

