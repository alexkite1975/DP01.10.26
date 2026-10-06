import { dvsaChecklist, fleetTrailers } from '@/data/dvsaChecklist';
'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  Truck, ShieldAlert, ShieldCheck, MapPin, Search, Navigation,
  AlertTriangle, Clock, Radio, FileText, CheckSquare, Camera,
  Award, Sliders, PhoneCall, Volume2, Mic, Eye, DollarSign,
  ArrowRight, ArrowLeft, RefreshCw, CheckCircle2, ChevronRight
} from 'lucide-react';

export default function DriverDashboardPage() {
  const [activeTab, setActiveTab] = useState<'readiness' | 'route' | 'enroute' | 'depot' | 'tacho' | 'tools'>('readiness');
  const [sosOpen, setSosOpen] = useState(false);

  // Route Planning State
  const [searchQuery, setSearchQuery] = useState('Amazon LCY2 Tilbury, RM18 7AN');
  const [stops, setStops] = useState<string[]>(['Amazon LCY2 Tilbury, RM18 7AN']);
  const [newStop, setNewStop] = useState('');
  const [isAddingStop, setIsAddingStop] = useState(false);

  // Vehicle Check State
  const [checkStep, setCheckStep] = useState(1);
  const [leakDetecting, setLeakDetecting] = useState(false);

  // Demurrage State
  const [demurrageActive, setDemurrageActive] = useState(false);
  const [demurrageSeconds, setDemurrageSeconds] = useState(4120); // > 60m

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans pb-16">
      {/* ======================================================== */}
      {/* TOP PERSISTENT IN-CAB HUD & SOS BUTTON                   */}
      {/* ======================================================== */}
      <header className="sticky top-0 z-40 bg-slate-900/95 backdrop-blur border-b border-slate-800 px-4 py-3 shadow-xl">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-3">
          {/* Unit & Driver Telematics */}
          <div className="flex items-center gap-3">
            <Link href="/" className="h-9 w-9 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-center text-slate-400 hover:text-white">
              <ArrowLeft className="w-4 h-4" />
            </Link>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-mono font-black text-sm text-emerald-400 tracking-wider">UNIT: DG21 EDP</span>
                <span className="text-[10px] font-mono bg-slate-800 text-slate-300 px-2 py-0.5 rounded border border-slate-700">TR-8492</span>
                <span className="text-[10px] font-mono bg-amber-500/20 text-amber-400 border border-amber-500/30 px-2 py-0.5 rounded font-bold">4.45m / 14\'7\"</span>
              </div>
              <p className="text-[11px] text-slate-400 font-mono">Driver: Alex Kite (C+E) • Drive Left: 03h 42m</p>
            </div>
          </div>

          {/* Navigation Links + Emergency SOS */}
          <div className="flex items-center gap-2">
            <Link href="/onboarding" className="text-xs font-mono text-slate-400 hover:text-white px-2.5 py-1.5 rounded-lg bg-slate-950 border border-slate-800">
              Preferences
            </Link>

            {/* EVER-PRESENT 1-TAP SOS BUTTON */}
            <button
              onClick={() => setSosOpen(true)}
              className="px-3.5 py-2 rounded-xl bg-red-600 hover:bg-red-500 text-white font-black text-xs font-mono flex items-center gap-1.5 shadow-lg shadow-red-950 animate-pulse"
            >
              <ShieldAlert className="w-4 h-4" />
              <span>REQUEST HELP (SOS)</span>
            </button>
          </div>
        </div>

        {/* Workflow 2 In-Cab Tab Navigation */}
        <div className="max-w-7xl mx-auto flex gap-1 mt-3 overflow-x-auto pb-1 text-xs font-mono">
          <button
            onClick={() => setActiveTab('readiness')}
            className={`px-3 py-1.5 rounded-lg transition shrink-0 ${activeTab === 'readiness' ? 'bg-emerald-500 text-slate-950 font-bold' : 'text-slate-400 hover:text-white'}`}
          >
            1. Vehicle Check
          </button>
          <button
            onClick={() => setActiveTab('route')}
            className={`px-3 py-1.5 rounded-lg transition shrink-0 ${activeTab === 'route' ? 'bg-emerald-500 text-slate-950 font-bold' : 'text-slate-400 hover:text-white'}`}
          >
            2. Route & Places
          </button>
          <button
            onClick={() => setActiveTab('enroute')}
            className={`px-3 py-1.5 rounded-lg transition shrink-0 ${activeTab === 'enroute' ? 'bg-emerald-500 text-slate-950 font-bold' : 'text-slate-400 hover:text-white'}`}
          >
            3. Bridge Shield & CB
          </button>
          <button
            onClick={() => setActiveTab('depot')}
            className={`px-3 py-1.5 rounded-lg transition shrink-0 ${activeTab === 'depot' ? 'bg-emerald-500 text-slate-950 font-bold' : 'text-slate-400 hover:text-white'}`}
          >
            4. Demurrage & ePOD
          </button>
          <button
            onClick={() => setActiveTab('tacho')}
            className={`px-3 py-1.5 rounded-lg transition shrink-0 ${activeTab === 'tacho' ? 'bg-emerald-500 text-slate-950 font-bold' : 'text-slate-400 hover:text-white'}`}
          >
            5. Tacho & Welfare
          </button>
          <button
            onClick={() => setActiveTab('tools')}
            className={`px-3 py-1.5 rounded-lg transition shrink-0 ${activeTab === 'tools' ? 'bg-amber-500 text-slate-950 font-black' : 'text-amber-400 hover:text-white border border-amber-500/30'}`}
          >
            🛠️ Driver Tools Tile
          </button>
        </div>
      </header>

      {/* Main Content Body */}
      <main className="max-w-7xl mx-auto p-4 sm:p-6 space-y-6">

        {/* TAB 1: VEHICLE READINESS (VEHICLE CHECK + AIR LEAK RADAR + COUPLING) */}
        {activeTab === 'readiness' && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* 32-Point Statutory Vehicle Check */}
            <div className="md:col-span-2 bg-slate-900 border border-slate-800 p-6 rounded-3xl space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-lg font-black text-white flex items-center gap-2">
                    <CheckSquare className="w-5 h-5 text-emerald-400" />
                    Vehicle Check (Statutory 32-Point DVSA Inspection)
                  </h2>
                  <p className="text-xs text-slate-400 font-mono">0.80x Speech Rate Voice Copilot • Mandatory Daily Walkaround</p>
                </div>
                <span className="text-xs font-mono font-bold bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 px-2.5 py-1 rounded-full">
                  Step {checkStep} of 32
                </span>
              </div>

              {/* Inspection Card Item */}
              <div className="bg-slate-950 border border-slate-800 p-5 rounded-2xl space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-mono text-emerald-400 font-bold uppercase">Item 1: Front Axle Steering Tyres & Wheel Nuts</span>
                  <button
                    onClick={() => alert('Voice Copilot: "Check tyre tread depth minimum 1.0 millimetre and verify wheel nut alignment indicators."')}
                    className="text-xs font-mono text-slate-300 hover:text-white flex items-center gap-1.5 bg-slate-900 px-2.5 py-1 rounded-lg border border-slate-700"
                  >
                    <Volume2 className="w-3.5 h-3.5 text-emerald-400" /> Listen (0.80x)
                  </button>
                </div>
                <p className="text-xs text-slate-300">
                  Inspect tread depth across 3/4 breadth, sidewall cuts, bulging, and ensure wheel nut alignment pointers match.
                </p>

                <div className="flex gap-2">
                  <button
                    onClick={() => setCheckStep(s => Math.min(32, s + 1))}
                    className="flex-1 py-3 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black text-xs font-mono rounded-xl transition flex items-center justify-center gap-1.5"
                  >
                    <CheckCircle2 className="w-4 h-4" /> PASSED (NO DEFECT)
                  </button>
                  <button
                    onClick={() => alert('Defect Camera: Opened photo intake for immediate PG9 notification to Transport Manager.')}
                    className="px-4 py-3 bg-red-600/20 hover:bg-red-600/30 text-red-400 border border-red-500/40 font-bold text-xs font-mono rounded-xl transition flex items-center gap-1"
                  >
                    <Camera className="w-4 h-4" /> LOG DEFECT
                  </button>
                </div>
              </div>

              <div className="flex justify-between items-center text-xs font-mono text-slate-400 pt-2">
                <span>15-Month DVSA Compliance Archive: Active</span>
                <span className="text-emerald-400 font-bold">Certificate #DVSA-2026-88219</span>
              </div>
            </div>

            {/* Acoustic Air Leak Radar & Coupling */}
            <div className="space-y-4">
              <div className="bg-slate-900 border border-slate-800 p-5 rounded-3xl space-y-3">
                <div className="flex items-center gap-2">
                  <Mic className="w-5 h-5 text-amber-400" />
                  <h3 className="text-sm font-black text-white">Acoustic Air Leak Radar</h3>
                </div>
                <p className="text-xs text-slate-400">
                  DSP Audio analysis filtering 4kHz - 8kHz for compressed air line hiss around suzie lines and brake chambers.
                </p>
                <button
                  onClick={() => {
                    setLeakDetecting(true);
                    setTimeout(() => {
                      setLeakDetecting(false);
                      alert('✓ Air Leak Radar: 0.0 PSI drop detected across Red Service and Yellow Emergency lines.');
                    }, 1500);
                  }}
                  className="w-full py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-xs font-mono transition"
                >
                  {leakDetecting ? 'Listening on 4kHz-8kHz DSP...' : 'Run Acoustic Air Leak Scan'}
                </button>
              </div>

              <div className="bg-slate-900 border border-slate-800 p-5 rounded-3xl space-y-2">
                <div className="flex items-center gap-2">
                  <Eye className="w-5 h-5 text-blue-400" />
                  <h3 className="text-sm font-black text-white">5th Wheel Coupling Vision</h3>
                </div>
                <p className="text-xs text-slate-400">
                  Dog-clip safety pin lock & kingpin jaw engagement verification.
                </p>
                <div className="p-3 bg-slate-950 rounded-xl border border-slate-800 text-[11px] font-mono text-emerald-400 flex items-center justify-between">
                  <span>Jaw Latch Status:</span>
                  <strong>LOCKED & PINNED</strong>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: ROUTE PLANNING, GOOGLE PLACES & SITE ASSESSMENT */}
        {activeTab === 'route' && (
          <div className="space-y-6">
            {/* Search Input & Interactive Pin */}
            <div className="bg-slate-900 border border-slate-800 p-6 rounded-3xl space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-lg font-black text-white flex items-center gap-2">
                    <Search className="w-5 h-5 text-emerald-400" />
                    Google Places Search & Multi-Stop Waypoint Loop
                  </h2>
                  <p className="text-xs text-slate-400 font-mono">Commercial 44t Heavy Vehicle Routing • Low Bridge Avoidance</p>
                </div>
                <button
                  onClick={() => setIsAddingStop(!isAddingStop)}
                  className="text-xs font-mono font-bold bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 px-3 py-1.5 rounded-xl"
                >
                  + Add Stop
                </button>
              </div>

              {/* Search Bar */}
              <div className="flex gap-2">
                <input
                  type="text"
                  value={searchQuery}
                  onChange={e => setSearchQuery(e.target.value)}
                  placeholder="Search depot, distribution centre, or postcode via Google Places..."
                  className="flex-1 bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-xs font-mono text-white outline-none focus:border-emerald-500"
                />
                <button
                  onClick={() => alert(`Selected: ${searchQuery}`)}
                  className="px-5 bg-emerald-500 text-slate-950 font-black text-xs font-mono rounded-xl hover:bg-emerald-400 transition"
                >
                  Search
                </button>
              </div>

              {/* Add Stop Loop */}
              {isAddingStop && (
                <div className="p-4 bg-slate-950 border border-slate-800 rounded-2xl space-y-3">
                  <span className="text-xs font-mono font-bold text-amber-400 uppercase">Add Another Waypoint (Multi-Drop Tour)</span>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={newStop}
                      onChange={e => setNewStop(e.target.value)}
                      placeholder="Enter second delivery stop..."
                      className="flex-1 bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-xs font-mono text-white outline-none"
                    />
                    <button
                      onClick={() => {
                        if (newStop) {
                          setStops([...stops, newStop]);
                          setNewStop('');
                          setIsAddingStop(false);
                        }
                      }}
                      className="px-4 bg-emerald-500 text-slate-950 font-bold text-xs rounded-xl"
                    >
                      Save Stop
                    </button>
                  </div>
                </div>
              )}

              {/* Waypoints List */}
              <div className="space-y-2">
                {stops.map((stop, idx) => (
                  <div key={idx} className="flex items-center justify-between p-3 bg-slate-950 rounded-xl border border-slate-800 text-xs font-mono">
                    <span className="flex items-center gap-2">
                      <span className="h-5 w-5 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center font-bold text-[10px]">
                        {idx + 1}
                      </span>
                      {stop}
                    </span>
                    <span className="text-slate-500 text-[11px]">Pin Confirmed</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Site Assessment Card */}
            <div className="bg-slate-900 border border-slate-800 p-6 rounded-3xl space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-base font-black text-white flex items-center gap-2">
                    <MapPin className="w-5 h-5 text-blue-400" />
                    Site Assessment Review: Amazon LCY2 Tilbury
                  </h3>
                  <p className="text-xs text-slate-400 font-mono">Gatehouse Access Rules • Hazard Screening • Driver Community Reviews</p>
                </div>
                <span className="text-xs font-mono bg-blue-500/20 text-blue-400 border border-blue-500/40 px-2.5 py-1 rounded-full font-bold">
                  ★ 4.6 (42 Reviews)
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 font-mono text-xs">
                <div className="p-3 bg-slate-950 rounded-xl border border-slate-800">
                  <span className="text-slate-500 block text-[10px] uppercase">Gate Barrier PIN</span>
                  <strong className="text-emerald-400 text-sm">PIN: 8492</strong>
                </div>
                <div className="p-3 bg-slate-950 rounded-xl border border-slate-800">
                  <span className="text-slate-500 block text-[10px] uppercase">Allocated Loading Bay</span>
                  <strong className="text-white text-sm">BAY #24 (Reverse Blindside)</strong>
                </div>
                <div className="p-3 bg-slate-950 rounded-xl border border-slate-800">
                  <span className="text-slate-500 block text-[10px] uppercase">Low Bridge Clearance</span>
                  <strong className="text-emerald-400 text-sm">5.10m Safe (Placard 4.45m)</strong>
                </div>
              </div>

              <div className="flex gap-2 pt-2">
                <button
                  onClick={() => alert('Printable Gate Pass: QR Code Generated #DP-GATE-8492.')}
                  className="px-4 py-3 bg-slate-950 hover:bg-slate-800 text-slate-300 font-mono text-xs font-bold rounded-xl border border-slate-800 transition"
                >
                  View QR Gate Pass
                </button>
                <button
                  onClick={() => alert('Navigation Launched: Using In-App 44t TomTom Commercial Engine avoidance matrix.')}
                  className="flex-1 py-3 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black text-xs font-mono rounded-xl transition flex items-center justify-center gap-1.5"
                >
                  <Navigation className="w-4 h-4" /> LAUNCH 44T COMMERCIAL NAVIGATION
                </button>
              </div>
            </div>
          </div>
        )}

        {/* TAB 3: EN-ROUTE SAFETY & BRIDGE SHIELD */}
        {activeTab === 'enroute' && (
          <div className="space-y-6">
            {/* Bridge Strike Collision Shield */}
            <div className="bg-slate-900 border border-red-500/40 p-6 rounded-3xl space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-lg font-black text-white flex items-center gap-2">
                    <AlertTriangle className="w-5 h-5 text-red-500" />
                    Bridge Strike Collision Shield (1-Mile Radar)
                  </h2>
                  <p className="text-xs text-slate-400 font-mono">Watford WCML-WAT-049 • Height: 4.10m (Vehicle Placard: 4.45m - STRIKE RISK)</p>
                </div>
                <span className="px-3 py-1 bg-red-600 text-white font-mono font-bold text-xs rounded-full animate-pulse">
                  CRITICAL PROXIMITY
                </span>
              </div>

              <div className="p-4 bg-slate-950 border border-red-500/30 rounded-2xl space-y-2 text-xs font-mono text-slate-300">
                <p className="text-red-400 font-bold">
                  WARNING: Approaching low bridge 0.8 miles ahead. Clearance 4.10m is LOWER than vehicle running height 4.45m.
                </p>
                <div className="flex flex-wrap gap-2 pt-2">
                  <button
                    onClick={() => alert('Rerouting around Watford Low Bridge via A41 Colne Way.')}
                    className="px-4 py-2.5 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black rounded-xl text-xs"
                  >
                    Accept Divert Route (A41)
                  </button>
                  <button
                    onClick={() => alert('Dialing Network Rail Bridge Strike Hotline: 03457 11 41 41')}
                    className="px-4 py-2.5 bg-red-600 hover:bg-red-500 text-white font-bold rounded-xl text-xs flex items-center gap-1"
                  >
                    <PhoneCall className="w-3.5 h-3.5" /> Call Network Rail (03457 11 41 41)
                  </button>
                  <button
                    onClick={() => alert('Air Suspension Dump Activated: Dropped cab and trailer chassis by 120mm.')}
                    className="px-4 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold rounded-xl text-xs"
                  >
                    Dump Cab Air Suspension
                  </button>
                </div>
              </div>
            </div>

            {/* Digital CB Radio & Layby Radar */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="bg-slate-900 border border-slate-800 p-5 rounded-3xl space-y-3">
                <div className="flex items-center gap-2">
                  <Radio className="w-5 h-5 text-emerald-400" />
                  <h3 className="text-sm font-black text-white">Digital CB Radio (5-Mile Geofence)</h3>
                </div>
                <p className="text-xs text-slate-400">
                  Sub-100ms voice channel linking all verified commercial drivers within 5 miles.
                </p>
                <div className="p-3 bg-slate-950 rounded-xl border border-slate-800 text-xs font-mono flex items-center justify-between">
                  <span className="text-slate-400">Active Channel 19:</span>
                  <span className="text-emerald-400 font-bold">14 Drivers in Range</span>
                </div>
              </div>

              <div className="bg-slate-900 border border-slate-800 p-5 rounded-3xl space-y-3">
                <div className="flex items-center gap-2">
                  <Truck className="w-5 h-5 text-blue-400" />
                  <h3 className="text-sm font-black text-white">Layby Capacity Radar</h3>
                </div>
                <p className="text-xs text-slate-400">
                  Live occupancy telemetry for M25/A13 laybys and secure truck stops.
                </p>
                <div className="p-3 bg-slate-950 rounded-xl border border-slate-800 text-xs font-mono flex items-center justify-between">
                  <span className="text-slate-400">Thurrock Services:</span>
                  <span className="text-emerald-400 font-bold">8 Bays Available</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 4: DEMURRAGE, BAY AR & ePOD */}
        {activeTab === 'depot' && (
          <div className="space-y-6">
            {/* Live Demurrage Clock */}
            <div className="bg-slate-900 border border-amber-500/40 p-6 rounded-3xl space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-lg font-black text-white flex items-center gap-2">
                    <DollarSign className="w-5 h-5 text-amber-400" />
                    Live Demurrage Detention Clock (£45.00/Hour)
                  </h2>
                  <p className="text-xs text-slate-400 font-mono">Shipper Dwell Time Tracker • 60m Free Window Exceeded</p>
                </div>
                <div className="text-right">
                  <span className="text-xl font-black font-mono text-amber-400">
                    £{((demurrageSeconds - 3600) / 3600 * 45).toFixed(2)}
                  </span>
                  <span className="block text-[10px] font-mono text-slate-500">ACCUMULATED DETENTION</span>
                </div>
              </div>

              <div className="p-4 bg-slate-950 border border-slate-800 rounded-2xl flex items-center justify-between text-xs font-mono">
                <div>
                  <span className="text-slate-400">Depot Gatehouse Ingress:</span>
                  <strong className="text-white ml-2">14:15:00 BST</strong>
                </div>
                <div>
                  <span className="text-slate-400">Dwell Duration:</span>
                  <strong className="text-amber-400 ml-2">01h 08m 40s</strong>
                </div>
              </div>

              <button
                onClick={() => alert('PDF Detention Voucher Exported: Sent to Shipper Accounts & Haulier Billing.')}
                className="w-full py-3 bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-xs font-mono rounded-xl transition"
              >
                Export £45/hr Detention Voucher (PDF)
              </button>
            </div>

            {/* Bay AR & Paperless Delivery ePOD */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="bg-slate-900 border border-slate-800 p-5 rounded-3xl space-y-3">
                <div className="flex items-center gap-2">
                  <Camera className="w-5 h-5 text-emerald-400" />
                  <h3 className="text-sm font-black text-white">Bay Navigation AR Overlay</h3>
                </div>
                <p className="text-xs text-slate-400">
                  Camera trajectory guidelines for reversing onto BAY #24 with blindside mirror alignment.
                </p>
                <button
                  onClick={() => alert('Opening Blindside Reversing Camera Guide...')}
                  className="w-full py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold text-xs font-mono rounded-xl"
                >
                  Activate Reversing Overlay
                </button>
              </div>

              <div className="bg-slate-900 border border-slate-800 p-5 rounded-3xl space-y-3">
                <div className="flex items-center gap-2">
                  <FileText className="w-5 h-5 text-blue-400" />
                  <h3 className="text-sm font-black text-white">Paperless ePOD Delivery</h3>
                </div>
                <p className="text-xs text-slate-400">
                  Consignment CMR-88291 • Sign-on-glass capture with instant haulier escrow payment release.
                </p>
                <button
                  onClick={() => alert('✓ Sign-on-Glass Captured: Delivery Confirmed & Escrow Released.')}
                  className="w-full py-2.5 bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs font-mono rounded-xl"
                >
                  Capture Consignee Signature
                </button>
              </div>
            </div>
          </div>
        )}

        {/* TAB 5: TACHOGRAPH, WTD & WELFARE */}
        {activeTab === 'tacho' && (
          <div className="space-y-6">
            {/* Dual Tachograph Ingestion */}
            <div className="bg-slate-900 border border-slate-800 p-6 rounded-3xl space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-lg font-black text-white flex items-center gap-2">
                    <Award className="w-5 h-5 text-emerald-400" />
                    Dual Tachograph Ingestion & Horizon Tracker
                  </h2>
                  <p className="text-xs text-slate-400 font-mono">Scan Printout OCR or Connect USB/OTG Card Reader (.DDD direct)</p>
                </div>
                <span className="text-xs font-mono text-emerald-400 font-bold">Driver Card: DB25029078179500</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <button
                  onClick={() => alert('Camera OCR Scan: Read printout. 03h 42m drive time remaining.')}
                  className="p-4 bg-slate-950 border border-slate-800 hover:border-emerald-500/60 rounded-2xl text-left space-y-1 transition"
                >
                  <span className="text-xs font-mono font-black text-emerald-400 block">Option 1: Camera Scan Printout</span>
                  <span className="text-[11px] text-slate-400 block">OCR extraction of daily shift hours and rest breaks</span>
                </button>

                <button
                  onClick={() => alert('USB/OTG Card Reader: Binary .DDD file parsed via dddParserService.')}
                  className="p-4 bg-slate-950 border border-slate-800 hover:border-emerald-500/60 rounded-2xl text-left space-y-1 transition"
                >
                  <span className="text-xs font-mono font-black text-emerald-400 block">Option 2: USB/OTG Card Reader</span>
                  <span className="text-[11px] text-slate-400 block">Direct binary card read with instant fleet synchronization</span>
                </button>
              </div>

              {/* Tacho Clocks */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2 font-mono text-center">
                <div className="p-3 bg-slate-950 rounded-xl border border-slate-800">
                  <span className="text-[10px] text-slate-500 uppercase block">Drive Time Left</span>
                  <strong className="text-emerald-400 text-base">03h 42m</strong>
                </div>
                <div className="p-3 bg-slate-950 rounded-xl border border-slate-800">
                  <span className="text-[10px] text-slate-500 uppercase block">Next 45m Break</span>
                  <strong className="text-amber-400 text-base">In 01h 18m</strong>
                </div>
                <div className="p-3 bg-slate-950 rounded-xl border border-slate-800">
                  <span className="text-[10px] text-slate-500 uppercase block">Weekly Drive</span>
                  <strong className="text-white text-base">32h / 56h</strong>
                </div>
                <div className="p-3 bg-slate-950 rounded-xl border border-slate-800">
                  <span className="text-[10px] text-slate-500 uppercase block">WTD Infringements</span>
                  <strong className="text-emerald-400 text-base">0 Clean</strong>
                </div>
              </div>
            </div>

            {/* Welfare & HMRC Tax Vault */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="bg-slate-900 border border-slate-800 p-5 rounded-3xl space-y-3">
                <div className="flex items-center gap-2">
                  <DollarSign className="w-5 h-5 text-emerald-400" />
                  <h3 className="text-sm font-black text-white">HMRC £34.90/Night Tax Vault</h3>
                </div>
                <p className="text-xs text-slate-400">
                  Tax-free overnight meal allowance tracker with automatic P87 tax rebate export.
                </p>
                <div className="p-3 bg-slate-950 rounded-xl border border-slate-800 text-xs font-mono flex items-center justify-between">
                  <span className="text-slate-400">Accumulated 2026/27:</span>
                  <strong className="text-emerald-400">£1,465.80 Tax Relief</strong>
                </div>
              </div>

              <div className="bg-slate-900 border border-slate-800 p-5 rounded-3xl space-y-3">
                <div className="flex items-center gap-2">
                  <ShieldAlert className="w-5 h-5 text-amber-400" />
                  <h3 className="text-sm font-black text-white">4-Stage Yard Whistleblower</h3>
                </div>
                <p className="text-xs text-slate-400">
                  Anonymous safety hazard reporting (48h Site SLA → Regional Director → HSE).
                </p>
                <button
                  onClick={() => alert('Anonymous Whistleblower: Report logged with 48h Site Manager SLA.')}
                  className="w-full py-2.5 bg-slate-800 hover:bg-slate-700 text-amber-400 font-bold text-xs font-mono rounded-xl"
                >
                  File Anonymous Hazard
                </button>
              </div>
            </div>
          </div>
        )}
        {/* TAB 6: DEDICATED DRIVER TOOLS TILE */}
        {activeTab === 'tools' && (
          <div className="space-y-6">
            <div className="border-b border-slate-800 pb-3 flex items-center justify-between">
              <div>
                <h2 className="text-lg font-black text-white flex items-center gap-2">
                  <Sliders className="w-5 h-5 text-amber-400" />
                  Driver Tools Tile
                </h2>
                <p className="text-xs text-slate-400 font-mono">Specialist In-Cab Safety, Threat Analysis & Diagnostic Instruments</p>
              </div>
              <span className="text-xs font-mono font-bold bg-amber-500/20 text-amber-400 border border-amber-500/40 px-3 py-1 rounded-full">
                6 Active Tools
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Tool 1: Class V/VI Blind Spot Proximity Shield */}
              <div className="bg-slate-900 border border-slate-800 p-5 rounded-3xl space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Eye className="w-5 h-5 text-emerald-400" />
                    <h3 className="text-sm font-black text-white">Class V/VI Blind Spot Proximity Shield</h3>
                  </div>
                  <span className="text-[10px] font-mono bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 px-2 py-0.5 rounded font-bold">
                    DVS 3-STAR
                  </span>
                </div>
                <p className="text-xs text-slate-400">
                  Direct Vision Standard (DVS) nearside passenger blind spot & front cross-view cyclist radar.
                </p>
                <div className="p-3 bg-slate-950 rounded-xl border border-slate-800 text-xs font-mono flex items-center justify-between">
                  <span className="text-slate-400">Nearside Cyclist Zone:</span>
                  <span className="text-emerald-400 font-bold">✓ CLEAR (0 in 2.5m zone)</span>
                </div>
              </div>

              {/* Tool 2: UK Cargo Crime & Curtain-Slash Heatmap */}
              <div className="bg-slate-900 border border-slate-800 p-5 rounded-3xl space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <ShieldAlert className="w-5 h-5 text-red-400" />
                    <h3 className="text-sm font-black text-white">UK Cargo Crime & Curtain-Slash Heatmap</h3>
                  </div>
                  <span className="text-[10px] font-mono bg-red-500/20 text-red-400 border border-red-500/40 px-2 py-0.5 rounded font-bold">
                    LIVE INTEL
                  </span>
                </div>
                <p className="text-xs text-slate-400">
                  NaVCIS freight crime intelligence mapping nocturnal slashing and fuel siphoning risks.
                </p>
                <div className="p-3 bg-slate-950 rounded-xl border border-slate-800 text-xs font-mono flex items-center justify-between">
                  <span className="text-slate-400">Current Area Threat:</span>
                  <span className="text-red-400 font-bold">M1 / A14 Corridor High Risk</span>
                </div>
              </div>

              {/* Tool 3: Quiet Sleep Zone Acoustic Radar */}
              <div className="bg-slate-900 border border-slate-800 p-5 rounded-3xl space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Volume2 className="w-5 h-5 text-blue-400" />
                    <h3 className="text-sm font-black text-white">Quiet Sleep Zone Acoustic Radar</h3>
                  </div>
                  <span className="text-[10px] font-mono bg-blue-500/20 text-blue-400 border border-blue-500/40 px-2 py-0.5 rounded font-bold">
                    46 dBA REST
                  </span>
                </div>
                <p className="text-xs text-slate-400">
                  Monitors ambient decibel pressure for 9h/11h rest. Flags noisy auxiliary diesel reefers.
                </p>
                <div className="p-3 bg-slate-950 rounded-xl border border-slate-800 text-xs font-mono flex items-center justify-between">
                  <span className="text-slate-400">Reefer Engine Proximity:</span>
                  <span className="text-emerald-400 font-bold">✓ Peaceful (&gt;150m clear)</span>
                </div>
              </div>

              {/* Tool 4: Acoustic Air Leak Radar */}
              <div className="bg-slate-900 border border-slate-800 p-5 rounded-3xl space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Mic className="w-5 h-5 text-amber-400" />
                    <h3 className="text-sm font-black text-white">Acoustic Air Leak Radar</h3>
                  </div>
                  <span className="text-[10px] font-mono bg-amber-500/20 text-amber-400 border border-amber-500/40 px-2 py-0.5 rounded font-bold">
                    4-8kHz DSP
                  </span>
                </div>
                <p className="text-xs text-slate-400">
                  Microphone frequency analysis detecting compressed air leaks across suzie coils.
                </p>
                <div className="p-3 bg-slate-950 rounded-xl border border-slate-800 text-xs font-mono flex items-center justify-between">
                  <span className="text-slate-400">Pneumatic System Status:</span>
                  <span className="text-emerald-400 font-bold">✓ 0.0 PSI Pressure Drop</span>
                </div>
              </div>

              {/* Tool 5: Coupling & 5th Wheel Vision */}
              <div className="bg-slate-900 border border-slate-800 p-5 rounded-3xl space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Truck className="w-5 h-5 text-emerald-400" />
                    <h3 className="text-sm font-black text-white">5th Wheel Coupling & Safety Lock</h3>
                  </div>
                  <span className="text-[10px] font-mono bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 px-2 py-0.5 rounded font-bold">
                    LATCH VERIFIED
                  </span>
                </div>
                <p className="text-xs text-slate-400">
                  Visual confirmation of dog-clip safety pin lock & kingpin jaw engagement.
                </p>
                <div className="p-3 bg-slate-950 rounded-xl border border-slate-800 text-xs font-mono flex items-center justify-between">
                  <span className="text-slate-400">Dog-Clip Status:</span>
                  <span className="text-emerald-400 font-bold">✓ Engaged & Secured</span>
                </div>
              </div>

              {/* Tool 6: Bay Navigation AR Overlay */}
              <div className="bg-slate-900 border border-slate-800 p-5 rounded-3xl space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Camera className="w-5 h-5 text-purple-400" />
                    <h3 className="text-sm font-black text-white">Bay Navigation AR Overlay</h3>
                  </div>
                  <span className="text-[10px] font-mono bg-purple-500/20 text-purple-400 border border-purple-500/40 px-2 py-0.5 rounded font-bold">
                    AR GUIDANCE
                  </span>
                </div>
                <p className="text-xs text-slate-400">
                  Dynamic trajectory guidelines for blindside reversing onto tight distribution bays.
                </p>
                <button
                  onClick={() => alert('Launching Bay Navigation AR Reversing Guides...')}
                  className="w-full py-2 bg-slate-950 hover:bg-slate-800 text-purple-400 font-bold text-xs font-mono rounded-xl border border-slate-800"
                >
                  Launch AR Guide
                </button>
              </div>
            </div>
          </div>
        )}

      </main>

      {/* ======================================================== */}
      {/* 5-CHANNEL REQUEST FOR HELP (SOS) MODAL                   */}
      {/* ======================================================== */}
      {sosOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-red-500/60 max-w-lg w-full p-6 rounded-3xl space-y-5 shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h2 className="text-base font-black text-white flex items-center gap-2">
                <ShieldAlert className="w-5 h-5 text-red-500" />
                🚨 DRIVER EMERGENCY DISTRESS & REQUEST FOR HELP
              </h2>
              <button onClick={() => setSosOpen(false)} className="text-slate-400 hover:text-white font-mono text-sm">
                ✕
              </button>
            </div>

            <p className="text-xs text-slate-300">
              Select distress channel. Automatically transmits unit <strong>DG21 EDP</strong> GPS coordinates, height, and phone number to emergency services:
            </p>

            <div className="space-y-2.5 font-mono text-xs">
              <button
                onClick={() => { alert('Dispatched 24/7 Commercial Heavy Recovery to your GPS position.'); setSosOpen(false); }}
                className="w-full p-3.5 bg-slate-950 hover:bg-slate-800 border border-slate-800 rounded-xl text-left flex items-center justify-between"
              >
                <span>1. Mechanical Breakdown & 24/7 Commercial Tyre Blowout</span>
                <span className="text-emerald-400 font-bold">Dispatch →</span>
              </button>

              <button
                onClick={() => { alert('Cargo Crime Alarm Triggered: Notifying local police constabulary & fleet security.'); setSosOpen(false); }}
                className="w-full p-3.5 bg-red-950/40 hover:bg-red-950/60 border border-red-800 rounded-xl text-left flex items-center justify-between text-red-300"
              >
                <span>2. Cargo Crime & Fuel Theft Layby Alarm</span>
                <span className="text-red-400 font-bold">ALARM →</span>
              </button>

              <button
                onClick={() => { alert('Dialing Network Rail 03457 11 41 41 and routing recovery vehicle.'); setSosOpen(false); }}
                className="w-full p-3.5 bg-slate-950 hover:bg-slate-800 border border-slate-800 rounded-xl text-left flex items-center justify-between"
              >
                <span>3. Low-Bridge / Stuck Vehicle Extraction</span>
                <span className="text-amber-400 font-bold">Extract →</span>
              </button>

              <button
                onClick={() => { alert('HSE Welfare Refusal logged: Escalating to Transport Manager & HSE Inspectorate.'); setSosOpen(false); }}
                className="w-full p-3.5 bg-slate-950 hover:bg-slate-800 border border-slate-800 rounded-xl text-left flex items-center justify-between"
              >
                <span>4. Welfare Refusal Dispute (Refused Toilet/Showers)</span>
                <span className="text-blue-400 font-bold">Report →</span>
              </button>

              <button
                onClick={() => { alert('Broadcast emergency distress beacon on 5-Mile Driver CB Radio.'); setSosOpen(false); }}
                className="w-full p-3.5 bg-slate-950 hover:bg-slate-800 border border-slate-800 rounded-xl text-left flex items-center justify-between"
              >
                <span>5. Broadcast 5-Mile CB Radio Distress Beacon</span>
                <span className="text-emerald-400 font-bold">Broadcast →</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
