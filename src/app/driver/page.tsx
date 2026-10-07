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
  ExternalLink
} from 'lucide-react';

const VehicleCheckApp = dynamic(() => import('@/components/vehicleCheck/VehicleCheckApp'), { ssr: false });
const TachoScanApp = dynamic(() => import('@/components/tacho/TachoScanApp'), { ssr: false });
const DriverSafetyShieldHub = dynamic(() => import('@/components/safety/DriverSafetyShieldHub'), { ssr: false });
const RouteOptimiserApp = dynamic(() => import('@/components/routeOptimiser/RouteOptimiserApp'), { ssr: false });
const SiteRiskApp = dynamic(() => import('@/components/siterisk/SiteRiskApp'), { ssr: false });

function DriverInCabHubContent() {
  const searchParams = useSearchParams();
  const activeTab = searchParams.get('tab');

  // If a tab query parameter is explicitly provided, render that component directly
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

  // Primary View: Mobile-First In-Cab Hub Launcher (Pure links, no cross-component pollution)
  return (
    <div className="min-h-dvh bg-slate-950 text-white flex flex-col font-sans">
      {/* Mobile Sticky Cab Header */}
      <header className="sticky top-0 z-30 bg-slate-900/95 backdrop-blur border-b border-slate-800 px-4 py-3">
        <div className="max-w-md mx-auto flex items-center justify-between">
          <div>
            <div className="text-[10px] font-bold tracking-widest uppercase text-cyan-400">Drive Partners</div>
            <h1 className="text-base font-bold text-white tracking-tight">Driver In-Cab Hub</h1>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
            <span className="text-[11px] font-mono font-semibold text-slate-300 bg-slate-800 px-2 py-1 rounded border border-slate-700">
              GN21 EVX
            </span>
          </div>
        </div>
      </header>

      {/* Main Mobile Screen Body */}
      <main className="flex-1 w-full max-w-md mx-auto p-4 space-y-4">
        {/* Active Vehicle & Trailer Placard Card */}
        <div className="p-3.5 rounded-2xl bg-gradient-to-r from-slate-900 to-slate-800/80 border border-slate-700/80 shadow-lg flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-cyan-950/80 border border-cyan-800/60 text-cyan-400">
              <Truck className="w-5 h-5" />
            </div>
            <div>
              <div className="text-xs font-bold text-white">44t Artic HGV</div>
              <div className="text-[11px] text-slate-400 font-mono">Trailer TR-8492 • Height: 4.45m (14&apos; 7&quot;)</div>
            </div>
          </div>
          <Link
            href="/driver/inspections/select-vehicle"
            className="text-[11px] font-semibold text-cyan-400 hover:text-cyan-300 underline"
          >
            Change
          </Link>
        </div>

        {/* Page-by-Page Navigation Menu (Optimized for Mobile Phone Use) */}
        <div className="space-y-2.5">
          <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider px-1">
            Driver Workflow Pages
          </div>

          {/* 1. Driver Walkaround */}
          <Link
            href="/driver/walkaround"
            className="w-full min-h-[68px] p-3.5 rounded-2xl bg-slate-900 hover:bg-slate-850 active:scale-[0.98] border border-slate-800 hover:border-emerald-500/50 transition-all flex items-center justify-between group shadow-sm"
          >
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-xl bg-emerald-950/80 border border-emerald-800/60 text-emerald-400 group-hover:scale-105 transition">
                <CheckCircle2 className="w-5 h-5" />
              </div>
              <div className="text-left">
                <div className="text-sm font-bold text-white flex items-center gap-1.5">
                  Driver Walkaround
                  <span className="text-[9px] font-bold px-1.5 py-0.5 rounded bg-emerald-900/60 text-emerald-300 border border-emerald-700/60">
                    Mandatory
                  </span>
                </div>
                <div className="text-[11px] text-slate-400">DVSA 32-point inspection • Acoustic leak test</div>
              </div>
            </div>
            <ArrowRight className="w-4 h-4 text-slate-500 group-hover:text-emerald-400 group-hover:translate-x-0.5 transition" />
          </Link>

          {/* 2. Tacho AI & .DDD */}
          <Link
            href="/driver/tacho"
            className="w-full min-h-[68px] p-3.5 rounded-2xl bg-slate-900 hover:bg-slate-850 active:scale-[0.98] border border-slate-800 hover:border-indigo-500/50 transition-all flex items-center justify-between group shadow-sm"
          >
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-xl bg-indigo-950/80 border border-indigo-800/60 text-indigo-400 group-hover:scale-105 transition">
                <Clock className="w-5 h-5" />
              </div>
              <div className="text-left">
                <div className="text-sm font-bold text-white flex items-center gap-1.5">
                  Tacho AI &amp; .DDD
                  <span className="text-[9px] font-bold px-1.5 py-0.5 rounded bg-indigo-900/60 text-indigo-300 border border-indigo-700/60">
                    EU 561
                  </span>
                </div>
                <div className="text-[11px] text-slate-400">Printout OCR scan • .DDD download • Driving timers</div>
              </div>
            </div>
            <ArrowRight className="w-4 h-4 text-slate-500 group-hover:text-indigo-400 group-hover:translate-x-0.5 transition" />
          </Link>

          {/* 3. Bridge & Safety Shield */}
          <Link
            href="/driver/safety"
            className="w-full min-h-[68px] p-3.5 rounded-2xl bg-slate-900 hover:bg-slate-850 active:scale-[0.98] border border-slate-800 hover:border-amber-500/50 transition-all flex items-center justify-between group shadow-sm"
          >
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-xl bg-amber-950/80 border border-amber-800/60 text-amber-400 group-hover:scale-105 transition">
                <Shield className="w-5 h-5" />
              </div>
              <div className="text-left">
                <div className="text-sm font-bold text-white flex items-center gap-1.5">
                  Bridge &amp; Safety Shield
                  <span className="text-[9px] font-bold px-1.5 py-0.5 rounded bg-amber-900/60 text-amber-300 border border-amber-700/60">
                    Radar
                  </span>
                </div>
                <div className="text-[11px] text-slate-400">Low bridge radar • Arch geometry • Subsistence</div>
              </div>
            </div>
            <ArrowRight className="w-4 h-4 text-slate-500 group-hover:text-amber-400 group-hover:translate-x-0.5 transition" />
          </Link>

          {/* 4. HGV Routing & Tours */}
          <Link
            href="/driver/route"
            className="w-full min-h-[68px] p-3.5 rounded-2xl bg-slate-900 hover:bg-slate-850 active:scale-[0.98] border border-slate-800 hover:border-cyan-500/50 transition-all flex items-center justify-between group shadow-sm"
          >
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-xl bg-cyan-950/80 border border-cyan-800/60 text-cyan-400 group-hover:scale-105 transition">
                <Navigation className="w-5 h-5" />
              </div>
              <div className="text-left">
                <div className="text-sm font-bold text-white flex items-center gap-1.5">
                  HGV Routing &amp; Tours
                  <span className="text-[9px] font-bold px-1.5 py-0.5 rounded bg-cyan-900/60 text-cyan-300 border border-cyan-700/60">
                    44t Nav
                  </span>
                </div>
                <div className="text-[11px] text-slate-400">TomTom commercial routing • Amazon Relay tours</div>
              </div>
            </div>
            <ArrowRight className="w-4 h-4 text-slate-500 group-hover:text-cyan-400 group-hover:translate-x-0.5 transition" />
          </Link>

          {/* 5. Site Risk & Services */}
          <Link
            href="/driver/sites"
            className="w-full min-h-[68px] p-3.5 rounded-2xl bg-slate-900 hover:bg-slate-850 active:scale-[0.98] border border-slate-800 hover:border-rose-500/50 transition-all flex items-center justify-between group shadow-sm"
          >
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-xl bg-rose-950/80 border border-rose-800/60 text-rose-400 group-hover:scale-105 transition">
                <MapPin className="w-5 h-5" />
              </div>
              <div className="text-left">
                <div className="text-sm font-bold text-white flex items-center gap-1.5">
                  Site Risk &amp; Services
                  <span className="text-[9px] font-bold px-1.5 py-0.5 rounded bg-rose-900/60 text-rose-300 border border-rose-700/60">
                    Crowd Bay
                  </span>
                </div>
                <div className="text-[11px] text-slate-400">Motorway services parking • SNAP • Gate hazard guides</div>
              </div>
            </div>
            <ArrowRight className="w-4 h-4 text-slate-500 group-hover:text-rose-400 group-hover:translate-x-0.5 transition" />
          </Link>

          {/* 6. Relief Driver Shifts (ReliefHGV) */}
          <Link
            href="/driver/shifts"
            className="w-full min-h-[68px] p-3.5 rounded-2xl bg-slate-900 hover:bg-slate-850 active:scale-[0.98] border border-slate-800 hover:border-teal-500/50 transition-all flex items-center justify-between group shadow-sm"
          >
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-xl bg-teal-950/80 border border-teal-800/60 text-teal-400 group-hover:scale-105 transition">
                <UserCheck className="w-5 h-5" />
              </div>
              <div className="text-left">
                <div className="text-sm font-bold text-white flex items-center gap-1.5">
                  Relief Driver Shifts
                  <span className="text-[9px] font-bold px-1.5 py-0.5 rounded bg-teal-900/60 text-teal-300 border border-teal-700/60">
                    £24.50-£31/hr
                  </span>
                </div>
                <div className="text-[11px] text-slate-400">Haulier agency cover • Night trunks • IR35 Safe Harbour</div>
              </div>
            </div>
            <ArrowRight className="w-4 h-4 text-slate-500 group-hover:text-teal-400 group-hover:translate-x-0.5 transition" />
          </Link>
        </div>

        {/* Secondary Portal Links (Explicit Links Only) */}
        <div className="pt-2 border-t border-slate-800/80 space-y-2">
          <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider px-1">
            Related Portals
          </div>
          <div className="grid grid-cols-2 gap-2">
            <Link
              href="/freight"
              className="p-3 rounded-xl bg-slate-900 border border-slate-800 hover:border-slate-700 transition flex items-center gap-2 text-xs font-semibold text-slate-200"
            >
              <Truck className="w-4 h-4 text-cyan-400" />
              <span>Freight Exchange (HX)</span>
            </Link>
            <Link
              href="/driver/inspections/signoff"
              className="p-3 rounded-xl bg-slate-900 border border-slate-800 hover:border-slate-700 transition flex items-center gap-2 text-xs font-semibold text-slate-200"
            >
              <FileCheck2 className="w-4 h-4 text-emerald-400" />
              <span>Inspection Sign-Off</span>
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

export default function DriverPage() {
  return (
    <Suspense fallback={<div className="p-8 text-center text-slate-400 font-mono text-sm">Loading Driver Hub...</div>}>
      <DriverInCabHubContent />
    </Suspense>
  );
}
