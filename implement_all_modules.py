import os, glob, re

# 1. Ensure 'use client' on all React components for Next.js
print("1. Preparing component client compatibility...")
for filepath in glob.glob("src/components/**/*.tsx", recursive=True):
    with open(filepath, "r", encoding="utf-8", errors="ignore") as f:
        content = f.read()
    if not content.startswith("'use client'") and not content.startswith('"use client"'):
        with open(filepath, "w", encoding="utf-8") as f:
            f.write("'use client';\n" + content)

# 2. Universal API Gateway Proxy to fleetops-api in europe-west2
print("2. Creating Universal Backend API Proxy...")
os.makedirs("src/app/api/[...route]", exist_ok=True)
proxy_code = """import { NextRequest, NextResponse } from 'next/server';

const FLEETOPS_API_URL = 'https://fleetops-api-139081326033.europe-west2.run.app';
const AUTH_HEADER = 'Basic ' + Buffer.from('AlexKite1975:Kite-Tacho-2026!Uk').toString('base64');

async function handleProxy(req: NextRequest) {
  const pathname = req.nextUrl.pathname;
  const search = req.nextUrl.search;
  const targetUrl = `${FLEETOPS_API_URL}${pathname}${search}`;

  const headers = new Headers(req.headers);
  headers.set('Authorization', AUTH_HEADER);
  headers.delete('host');

  try {
    const body = ['GET', 'HEAD'].includes(req.method) ? undefined : await req.arrayBuffer();
    const response = await fetch(targetUrl, {
      method: req.method,
      headers,
      body,
      cache: 'no-store',
    });

    const data = await response.arrayBuffer();
    return new NextResponse(data, {
      status: response.status,
      statusText: response.statusText,
      headers: response.headers,
    });
  } catch (err: any) {
    return NextResponse.json({ error: 'Proxy dispatch failed', details: err.message }, { status: 502 });
  }
}

export const GET = handleProxy;
export const POST = handleProxy;
export const PUT = handleProxy;
export const DELETE = handleProxy;
"""
with open("src/app/api/[...route]/route.ts", "w") as f:
    f.write(proxy_code)

# 3. Wire the Complete Driver In-Cab OS
print("3. Connecting Driver In-Cab OS...")
driver_page_code = """'use client';

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
"""
with open("src/app/driver/page.tsx", "w") as f:
    f.write(driver_page_code)

# 4. Wire the Complete Haulier Command Centre
print("4. Connecting Haulier Command Centre...")
haulier_page_code = """'use client';

import React from 'react';
import dynamic from 'next/dynamic';

const BusinessDashboard = dynamic(() => import('@/components/manager/BusinessDashboard'), { ssr: false });

export default function HaulierMasterCommand() {
  return (
    <div className="min-h-screen bg-slate-950 text-white">
      <BusinessDashboard />
    </div>
  );
}
"""
with open("src/app/haulier/page.tsx", "w") as f:
    f.write(haulier_page_code)

# 5. Wire the Site Admin Control Plane
print("5. Connecting Site Admin Control Plane...")
admin_page_code = """'use client';

import React from 'react';
import dynamic from 'next/dynamic';

const UserAccessControlPortal = dynamic(() => import('@/components/manager/UserAccessControlPortal'), { ssr: false });

export default function AdminControlPlane() {
  return (
    <div className="min-h-screen bg-slate-950 text-white">
      <UserAccessControlPortal />
    </div>
  );
}
"""
with open("src/app/admin/page.tsx", "w") as f:
    f.write(admin_page_code)

print("✓ All Driver, Haulier, and Admin modules successfully wired to the front end!")
