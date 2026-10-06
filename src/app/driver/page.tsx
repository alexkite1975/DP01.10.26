'use client';

import React, { useState } from 'react';
import dynamic from 'next/dynamic';
import { Shield, CheckCircle2, Clock, Navigation, MapPin, Truck } from 'lucide-react';

const VehicleCheckApp = dynamic(() => import('@/components/vehicleCheck/VehicleCheckApp'), { ssr: false });
const TachoScanApp = dynamic(() => import('@/components/tacho/TachoScanApp'), { ssr: false });
const DriverSafetyShieldHub = dynamic(() => import('@/components/safety/DriverSafetyShieldHub'), { ssr: false });
const RouteOptimiserApp = dynamic(() => import('@/components/routeOptimiser/RouteOptimiserApp'), { ssr: false });
const SiteRiskApp = dynamic(() => import('@/components/siterisk/SiteRiskApp'), { ssr: false });

export default function DriverMasterOS() {
  const [activeTab, setActiveTab] = useState<'walkaround' | 'tacho' | 'safety' | 'route' | 'sites'>('walkaround');

  return (
    <div className="min-h-screen bg-slate-950 text-white flex flex-col">
      {/* Top In-Cab Master Navigation Bar */}
      <header className="bg-slate-900 border-b border-slate-800 px-4 py-3 flex items-center justify-between sticky top-0 z-50">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-emerald-600 to-teal-400 flex items-center justify-center font-black text-black">
            DP
          </div>
          <div>
            <h1 className="font-bold text-sm tracking-wide">DRIVE PARTNERS • IN-CAB OS</h1>
            <p className="text-[10px] text-slate-400 font-mono">VEHICLE: GN21 EVX | TRAILER: TR-8492 (4.45m)</p>
          </div>
        </div>

        {/* Operational Modules Ribbon */}
        <nav className="flex items-center gap-1 bg-slate-950 p-1 rounded-xl border border-slate-800">
          <button
            onClick={() => setActiveTab('walkaround')}
            className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              activeTab === 'walkaround' ? 'bg-emerald-600 text-white shadow-lg' : 'text-slate-400 hover:text-white'
            }`}
          >
            <CheckCircle2 className="w-4 h-4" /> Walkaround & AI Vision
          </button>

          <button
            onClick={() => setActiveTab('tacho')}
            className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              activeTab === 'tacho' ? 'bg-indigo-600 text-white shadow-lg' : 'text-slate-400 hover:text-white'
            }`}
          >
            <Clock className="w-4 h-4" /> Tacho AI & .DDD
          </button>

          <button
            onClick={() => setActiveTab('safety')}
            className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              activeTab === 'safety' ? 'bg-amber-600 text-white shadow-lg' : 'text-slate-400 hover:text-white'
            }`}
          >
            <Shield className="w-4 h-4" /> Bridge & Safety Shield
          </button>

          <button
            onClick={() => setActiveTab('route')}
            className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              activeTab === 'route' ? 'bg-cyan-600 text-white shadow-lg' : 'text-slate-400 hover:text-white'
            }`}
          >
            <Navigation className="w-4 h-4" /> HGV Routing & Tours
          </button>

          <button
            onClick={() => setActiveTab('sites')}
            className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              activeTab === 'sites' ? 'bg-rose-600 text-white shadow-lg' : 'text-slate-400 hover:text-white'
            }`}
          >
            <MapPin className="w-4 h-4" /> Site Risk & Services
          </button>
        </nav>
      </header>

      {/* Main Module Viewport */}
      <main className="flex-1 p-2 sm:p-4 overflow-y-auto">
        {activeTab === 'walkaround' && <VehicleCheckApp />}
        {activeTab === 'tacho' && <TachoScanApp />}
        {activeTab === 'safety' && <DriverSafetyShieldHub />}
        {activeTab === 'route' && <RouteOptimiserApp />}
        {activeTab === 'sites' && <SiteRiskApp />}
      </main>
    </div>
  );
}
