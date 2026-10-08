'use client';

import React, { Suspense } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import dynamic from 'next/dynamic';
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

const VehicleCheckApp = dynamic(() => import('@/components/vehicleCheck/VehicleCheckApp'), { ssr: false });
const TachoScanApp = dynamic(() => import('@/components/tacho/TachoScanApp'), { ssr: false });
const DriverSafetyShieldHub = dynamic(() => import('@/components/safety/DriverSafetyShieldHub'), { ssr: false });
const RouteOptimiserApp = dynamic(() => import('@/components/routeOptimiser/RouteOptimiserApp'), { ssr: false });
const SiteRiskApp = dynamic(() => import('@/components/siterisk/SiteRiskApp'), { ssr: false });

function DriverInCabHubContent() {
  const searchParams = useSearchParams();
  const activeTab = searchParams.get('tab');

  if (activeTab === 'walkaround') {
    return (
      <div className="min-h-dvh bg-slate-950 p-2 sm:p-4 max-w-2xl mx-auto">
        <div className="mb-3 flex items-center justify-between border-b border-slate-800 pb-2">
          <Link href="/driver" className="text-xs text-cyan-400 hover:underline">← Back to In-Cab Hub</Link>
          <span className="text-xs text-slate-400 font-mono">Driver Walkaround</span>
        </div>
        <VehicleCheckApp />
      </div>
    );
  }

  if (activeTab === 'tacho') {
    return (
      <div className="min-h-dvh bg-slate-950 p-2 sm:p-4 max-w-2xl mx-auto">
        <div className="mb-3 flex items-center justify-between border-b border-slate-800 pb-2">
          <Link href="/driver" className="text-xs text-cyan-400 hover:underline">← Back to In-Cab Hub</Link>
          <span className="text-xs text-slate-400 font-mono">Tacho AI & .DDD</span>
        </div>
        <TachoScanApp />
      </div>
    );
  }

  if (activeTab === 'safety') {
    return (
      <div className="min-h-dvh bg-slate-950 p-2 sm:p-4 max-w-2xl mx-auto">
        <div className="mb-3 flex items-center justify-between border-b border-slate-800 pb-2">
          <Link href="/driver" className="text-xs text-cyan-400 hover:underline">← Back to In-Cab Hub</Link>
          <span className="text-xs text-slate-400 font-mono">Bridge & Safety Shield</span>
        </div>
        <DriverSafetyShieldHub />
      </div>
    );
  }

  if (activeTab === 'route') {
    return (
      <div className="min-h-dvh bg-slate-950 p-2 sm:p-4 max-w-2xl mx-auto">
        <div className="mb-3 flex items-center justify-between border-b border-slate-800 pb-2">
          <Link href="/driver" className="text-xs text-cyan-400 hover:underline">← Back to In-Cab Hub</Link>
          <span className="text-xs text-slate-400 font-mono">HGV Routing & Tours</span>
        </div>
        <RouteOptimiserApp />
      </div>
    );
  }

  if (activeTab === 'sites') {
    return (
      <div className="min-h-dvh bg-slate-950 p-2 sm:p-4 max-w-2xl mx-auto">
        <div className="mb-3 flex items-center justify-between border-b border-slate-800 pb-2">
          <Link href="/driver" className="text-xs text-cyan-400 hover:underline">← Back to In-Cab Hub</Link>
          <span className="text-xs text-slate-400 font-mono">Site Risk & Services</span>
        </div>
        <SiteRiskApp />
      </div>
    );
  }

  // Primary View: High-Precision Cockpit Nerve Center
  return (
    <div className="min-h-dvh bg-slate-950 text-white flex flex-col font-sans bg-cockpit-grid">
      {/* Mobile Sticky Cab Header */}
      <header className="sticky top-0 z-30 bg-slate-900/90 backdrop-blur-xl border-b border-slate-800/80 px-4 py-3 shadow-cockpit">
        <div className="max-w-md mx-auto flex items-center justify-between">
          <div>
            <div className="text-[10px] font-mono font-bold tracking-widest uppercase text-cyan-400 flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse" />
              DRIVEPARTNERS COCKPIT
            </div>
            <h1 className="text-base font-bold text-white tracking-tight">Driver In-Cab Hub</h1>
          </div>
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-1.5 px-2 py-0.5 rounded-lg bg-emerald-950/80 border border-emerald-800/60">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span className="text-[10px] font-mono font-bold text-emerald-400">1Hz LINK</span>
            </div>
            <span className="text-[11px] font-mono font-bold text-slate-100 bg-slate-800/90 px-2.5 py-1 rounded-lg border border-slate-700 shadow-inner">
              GN21 EVX
            </span>
          </div>
        </div>
      </header>

      {/* Main Mobile Screen Body */}
      <main className="flex-1 w-full max-w-md mx-auto p-4 space-y-4">
        {/* Metallic Statutory DVSA Cab Spec Plaque */}
        <div className="cockpit-panel rounded-2xl p-4 border border-white/10 shadow-cockpit relative overflow-hidden group">
          <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-cyan-400/50 to-transparent" />
          
          <div className="flex items-start justify-between gap-3">
            <div className="flex items-center gap-3">
              <div className="p-3 rounded-xl bg-gradient-to-br from-cyan-950 to-slate-900 border border-cyan-700/60 text-cyan-400 shadow-glow-cyan">
                <Truck className="w-6 h-6" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-xs font-black text-white uppercase tracking-wider font-mono">
                    44t Articulated HGV
                  </span>
                  <span className="text-[9px] font-mono font-bold px-1.5 py-0.5 rounded bg-emerald-950 text-emerald-400 border border-emerald-800/60">
                    6-AXLE
                  </span>
                </div>
                <div className="text-[11px] text-slate-300 font-mono mt-0.5 flex items-center gap-2">
                  <span>Trailer: <strong className="text-white">TR-8492</strong></span>
                  <span className="text-slate-600">•</span>
                  <span className="text-amber-400 font-bold">4.45m / 14&apos; 7&quot;</span>
                </div>
              </div>
            </div>

            <Link
              href="/driver/inspections/select-vehicle"
              onClick={() => audioFeedback.playCheckpointClick()}
              className="text-[10px] font-mono font-bold text-cyan-400 hover:text-cyan-300 bg-cyan-950/60 px-2.5 py-1 rounded-lg border border-cyan-800/60 hover:border-cyan-600 transition touch-press shrink-0"
            >
              CHANGE
            </Link>
          </div>

          {/* Quick Telemetry Status Ticker */}
          <div className="mt-3 pt-2.5 border-t border-slate-800/80 flex items-center justify-between text-[10px] font-mono text-slate-400">
            <div className="flex items-center gap-1.5">
              <Radio className="w-3 h-3 text-cyan-400" />
              <span>GPS: <strong className="text-slate-300">52.334° N, 1.083° W</strong></span>
            </div>
            <div className="flex items-center gap-1.5">
              <Activity className="w-3 h-3 text-emerald-400" />
              <span>Speed: <strong className="text-emerald-400 font-bold">0 MPH (STATIONARY)</strong></span>
            </div>
          </div>
        </div>

        {/* Page-by-Page Navigation Menu (High-Precision Cockpit Cards) */}
        <div className="space-y-2.5">
          <div className="flex items-center justify-between px-1">
            <span className="text-[11px] font-mono font-bold text-slate-400 uppercase tracking-wider">
              Driver Cockpit Workflows
            </span>
            <span className="text-[10px] font-mono text-cyan-400">
              6 MODULES ACTIVE
            </span>
          </div>

          {/* 1. Driver Walkaround */}
          <Link
            href="/driver/walkaround"
            onClick={() => audioFeedback.playCheckpointClick()}
            className="w-full min-h-[72px] p-4 rounded-2xl cockpit-panel hover:border-emerald-500/60 transition-all flex items-center justify-between group shadow-cockpit border border-white/10 touch-press relative overflow-hidden"
          >
            <div className="absolute top-0 bottom-0 left-0 w-1 bg-emerald-500 opacity-60 group-hover:opacity-100 transition" />
            <div className="flex items-center gap-3.5 pl-1">
              <div className="p-2.5 rounded-xl bg-emerald-950/80 border border-emerald-800/60 text-emerald-400 group-hover:scale-105 group-hover:shadow-glow-emerald transition">
                <CheckCircle2 className="w-5 h-5" />
              </div>
              <div className="text-left">
                <div className="text-sm font-bold text-white flex items-center gap-2">
                  <span>Driver Walkaround</span>
                  <span className="text-[9px] font-mono font-bold px-1.5 py-0.5 rounded bg-emerald-950 text-emerald-400 border border-emerald-800/60">
                    DVSA MANDATORY
                  </span>
                </div>
                <div className="text-[11px] text-slate-400 font-sans mt-0.5">
                  44t interactive vector blueprint • 32-point inspection • Air leak test
                </div>
              </div>
            </div>
            <ArrowRight className="w-4 h-4 text-slate-500 group-hover:text-emerald-400 group-hover:translate-x-1 transition shrink-0" />
          </Link>

          {/* 2. Tacho AI & .DDD */}
          <Link
            href="/driver/tacho"
            onClick={() => audioFeedback.playCheckpointClick()}
            className="w-full min-h-[72px] p-4 rounded-2xl cockpit-panel hover:border-indigo-500/60 transition-all flex items-center justify-between group shadow-cockpit border border-white/10 touch-press relative overflow-hidden"
          >
            <div className="absolute top-0 bottom-0 left-0 w-1 bg-indigo-500 opacity-60 group-hover:opacity-100 transition" />
            <div className="flex items-center gap-3.5 pl-1">
              <div className="p-2.5 rounded-xl bg-indigo-950/80 border border-indigo-800/60 text-indigo-400 group-hover:scale-105 group-hover:shadow-glow-blue transition">
                <Clock className="w-5 h-5" />
              </div>
              <div className="text-left">
                <div className="text-sm font-bold text-white flex items-center gap-2">
                  <span>Tacho AI &amp; SE5000 HUD</span>
                  <span className="text-[9px] font-mono font-bold px-1.5 py-0.5 rounded bg-indigo-950 text-indigo-300 border border-indigo-800/60">
                    EU 561/2006
                  </span>
                </div>
                <div className="text-[11px] text-slate-400 font-sans mt-0.5">
                  Stoneridge head-unit simulation • 04h 30m countdown • .DDD scan
                </div>
              </div>
            </div>
            <ArrowRight className="w-4 h-4 text-slate-500 group-hover:text-indigo-400 group-hover:translate-x-1 transition shrink-0" />
          </Link>

          {/* 3. Bridge & Safety Shield */}
          <Link
            href="/driver/safety"
            onClick={() => audioFeedback.playCheckpointClick()}
            className="w-full min-h-[72px] p-4 rounded-2xl cockpit-panel hover:border-amber-500/60 transition-all flex items-center justify-between group shadow-cockpit border border-white/10 touch-press relative overflow-hidden"
          >
            <div className="absolute top-0 bottom-0 left-0 w-1 bg-amber-500 opacity-60 group-hover:opacity-100 transition" />
            <div className="flex items-center gap-3.5 pl-1">
              <div className="p-2.5 rounded-xl bg-amber-950/80 border border-amber-800/60 text-amber-400 group-hover:scale-105 group-hover:shadow-glow-amber transition">
                <Shield className="w-5 h-5" />
              </div>
              <div className="text-left">
                <div className="text-sm font-bold text-white flex items-center gap-2">
                  <span>Bridge &amp; Safety Shield</span>
                  <span className="text-[9px] font-mono font-bold px-1.5 py-0.5 rounded bg-amber-950 text-amber-300 border border-amber-800/60">
                    GANTRY HUD
                  </span>
                </div>
                <div className="text-[11px] text-slate-400 font-sans mt-0.5">
                  Overhead clearance gantry • Low bridge radar • £45/hr demurrage
                </div>
              </div>
            </div>
            <ArrowRight className="w-4 h-4 text-slate-500 group-hover:text-amber-400 group-hover:translate-x-1 transition shrink-0" />
          </Link>

          {/* 4. HGV Routing & Tours */}
          <Link
            href="/driver/route"
            onClick={() => audioFeedback.playCheckpointClick()}
            className="w-full min-h-[72px] p-4 rounded-2xl cockpit-panel hover:border-cyan-500/60 transition-all flex items-center justify-between group shadow-cockpit border border-white/10 touch-press relative overflow-hidden"
          >
            <div className="absolute top-0 bottom-0 left-0 w-1 bg-cyan-500 opacity-60 group-hover:opacity-100 transition" />
            <div className="flex items-center gap-3.5 pl-1">
              <div className="p-2.5 rounded-xl bg-cyan-950/80 border border-cyan-800/60 text-cyan-400 group-hover:scale-105 group-hover:shadow-glow-cyan transition">
                <Navigation className="w-5 h-5" />
              </div>
              <div className="text-left">
                <div className="text-sm font-bold text-white flex items-center gap-2">
                  <span>HGV Routing &amp; Tours</span>
                  <span className="text-[9px] font-mono font-bold px-1.5 py-0.5 rounded bg-cyan-950 text-cyan-300 border border-cyan-800/60">
                    44t TRUCK NAV
                  </span>
                </div>
                <div className="text-[11px] text-slate-400 font-sans mt-0.5">
                  Commercial truck corridors • Axle weights • Relay tour legs
                </div>
              </div>
            </div>
            <ArrowRight className="w-4 h-4 text-slate-500 group-hover:text-cyan-400 group-hover:translate-x-1 transition shrink-0" />
          </Link>

          {/* 5. Site Risk & Services */}
          <Link
            href="/driver/sites"
            onClick={() => audioFeedback.playCheckpointClick()}
            className="w-full min-h-[72px] p-4 rounded-2xl cockpit-panel hover:border-rose-500/60 transition-all flex items-center justify-between group shadow-cockpit border border-white/10 touch-press relative overflow-hidden"
          >
            <div className="absolute top-0 bottom-0 left-0 w-1 bg-rose-500 opacity-60 group-hover:opacity-100 transition" />
            <div className="flex items-center gap-3.5 pl-1">
              <div className="p-2.5 rounded-xl bg-rose-950/80 border border-rose-800/60 text-rose-400 group-hover:scale-105 transition">
                <MapPin className="w-5 h-5" />
              </div>
              <div className="text-left">
                <div className="text-sm font-bold text-white flex items-center gap-2">
                  <span>Site Risk &amp; Services</span>
                  <span className="text-[9px] font-mono font-bold px-1.5 py-0.5 rounded bg-rose-950 text-rose-300 border border-rose-800/60">
                    DEPOT AMENITIES
                  </span>
                </div>
                <div className="text-[11px] text-slate-400 font-sans mt-0.5">
                  Motorway services parking • SNAP • Toilets &amp; hot food ratings
                </div>
              </div>
            </div>
            <ArrowRight className="w-4 h-4 text-slate-500 group-hover:text-rose-400 group-hover:translate-x-1 transition shrink-0" />
          </Link>

          {/* 6. Relief Driver Shifts (ReliefHGV) */}
          <Link
            href="/driver/shifts"
            onClick={() => audioFeedback.playCheckpointClick()}
            className="w-full min-h-[72px] p-4 rounded-2xl cockpit-panel hover:border-teal-500/60 transition-all flex items-center justify-between group shadow-cockpit border border-white/10 touch-press relative overflow-hidden"
          >
            <div className="absolute top-0 bottom-0 left-0 w-1 bg-teal-500 opacity-60 group-hover:opacity-100 transition" />
            <div className="flex items-center gap-3.5 pl-1">
              <div className="p-2.5 rounded-xl bg-teal-950/80 border border-teal-800/60 text-teal-400 group-hover:scale-105 transition">
                <UserCheck className="w-5 h-5" />
              </div>
              <div className="text-left">
                <div className="text-sm font-bold text-white flex items-center gap-2">
                  <span>Relief Driver Shifts</span>
                  <span className="text-[9px] font-mono font-bold px-1.5 py-0.5 rounded bg-teal-950 text-teal-300 border border-teal-800/60">
                    £24.50-£31/hr
                  </span>
                </div>
                <div className="text-[11px] text-slate-400 font-sans mt-0.5">
                  Haulier sickness cover • Night trunks • IR35 Safe-Harbour
                </div>
              </div>
            </div>
            <ArrowRight className="w-4 h-4 text-slate-500 group-hover:text-teal-400 group-hover:translate-x-1 transition shrink-0" />
          </Link>
        </div>

        {/* Secondary Portal Links (Explicit Links Only) */}
        <div className="pt-3 border-t border-slate-800/80 space-y-2">
          <div className="text-[11px] font-mono font-bold text-slate-400 uppercase tracking-wider px-1">
            Connected Systems
          </div>
          <div className="grid grid-cols-2 gap-2">
            <Link
              href="/freight"
              onClick={() => audioFeedback.playCheckpointClick()}
              className="p-3 rounded-xl cockpit-panel border border-white/10 hover:border-cyan-500/40 transition flex items-center gap-2 text-xs font-semibold text-slate-200 touch-press"
            >
              <Truck className="w-4 h-4 text-cyan-400" />
              <span className="truncate">Freight Exchange (HX)</span>
            </Link>
            <Link
              href="/driver/inspections/signoff"
              onClick={() => audioFeedback.playCheckpointClick()}
              className="p-3 rounded-xl cockpit-panel border border-white/10 hover:border-emerald-500/40 transition flex items-center gap-2 text-xs font-semibold text-slate-200 touch-press"
            >
              <FileCheck2 className="w-4 h-4 text-emerald-400" />
              <span className="truncate">Inspection Sign-Off</span>
            </Link>
            <Link
              href="/haulier"
              onClick={() => audioFeedback.playCheckpointClick()}
              className="col-span-2 p-3 rounded-xl cockpit-panel border border-white/10 hover:border-amber-500/40 transition flex items-center justify-between text-xs font-semibold text-slate-200 touch-press"
            >
              <span className="flex items-center gap-2">
                <Building2 className="w-4 h-4 text-amber-400" />
                <span>Haulier Command Center &amp; Fleet Radar</span>
              </span>
              <ExternalLink className="w-3.5 h-3.5 text-slate-500" />
            </Link>
          </div>
        </div>
      </main>
    </div>
  );
}

export default function DriverPage() {
  return (
    <Suspense fallback={<div className="p-8 text-center text-slate-400 font-mono text-sm">Loading Driver Hub...</div>}>
      <DriverInCabHubContent />
    </Suspense>
  );
}
