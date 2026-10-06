import os

haulier_code = '''\'use client\';

import React, { useState } from \'react\';
import Link from \'next/link\';
import {
  Truck, MapPin, Users, FileCheck, ShieldAlert, CheckCircle2,
  AlertTriangle, ArrowRight, ArrowLeft, RefreshCw, PoundSterling,
  Clock, Sliders, ChevronRight, Send, CheckSquare, Search, Navigation,
  Building2, Eye, Box, Radio, FileText, Check
} from \'lucide-react\';

export default function HaulierDashboard() {
  const [activeTab, setActiveTab] = useState<\'map\' | \'dispatch\' | \'haulage-partners\' | \'compliance\' | \'demurrage\'>(\'haulage-partners\');
  
  // Haulage Partners State
  const [hpEcosystem, setHpEcosystem] = useState<\'haulage\' | \'courier\'>(\'haulage\');
  const [hpStep, setHpStep] = useState<number>(1);
  const [isBroadcasting, setIsBroadcasting] = useState<boolean>(true);

  // Dispatch filter
  const [filterRegion, setFilterRegion] = useState(\'all\');

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans">
      {/* Header */}
      <header className="border-b border-slate-800 bg-slate-900/90 backdrop-blur px-6 py-4 flex flex-col md:flex-row items-center justify-between gap-4 sticky top-0 z-50">
        <div className="flex items-center gap-3">
          <Link href="/" className="flex items-center gap-2">
            <span className="w-8 h-8 rounded-xl bg-blue-600 flex items-center justify-center font-black text-white text-lg shadow-md shadow-blue-500/20">
              DP
            </span>
            <span className="font-black tracking-tight text-white text-lg">DRIVE PARTNERS</span>
          </Link>
          <span className="text-slate-600">/</span>
          <span className="text-xs font-mono bg-blue-500/10 text-blue-400 border border-blue-500/30 px-2.5 py-1 rounded-full font-bold">
            Haulier Fleet & Freight Portal
          </span>
        </div>

        {/* Navigation Tabs */}
        <nav className="flex items-center gap-1.5 bg-slate-950 p-1 rounded-xl border border-slate-800 text-xs font-mono overflow-x-auto max-w-full">
          <button
            onClick={() => setActiveTab(\'haulage-partners\')}
            className={`px-3 py-1.5 rounded-lg transition shrink-0 ${activeTab === \'haulage-partners\' ? \'bg-blue-600 text-white font-black shadow-lg shadow-blue-600/30\' : \'text-blue-400 hover:text-white\'}`}
          >
            🌐 Haulage Partners (HP)
          </button>
          <button
            onClick={() => setActiveTab(\'map\')}
            className={`px-3 py-1.5 rounded-lg transition shrink-0 ${activeTab === \'map\' ? \'bg-blue-600 text-white font-bold\' : \'text-slate-400 hover:text-white\'}`}
          >
            1. Live Telematics
          </button>
          <button
            onClick={() => setActiveTab(\'dispatch\')}
            className={`px-3 py-1.5 rounded-lg transition shrink-0 ${activeTab === \'dispatch\' ? \'bg-blue-600 text-white font-bold\' : \'text-slate-400 hover:text-white\'}`}
          >
            2. Direct Dispatch
          </button>
          <button
            onClick={() => setActiveTab(\'compliance\')}
            className={`px-3 py-1.5 rounded-lg transition shrink-0 ${activeTab === \'compliance\' ? \'bg-blue-600 text-white font-bold\' : \'text-slate-400 hover:text-white\'}`}
          >
            3. Vehicle Check Triage
          </button>
          <button
            onClick={() => setActiveTab(\'demurrage\')}
            className={`px-3 py-1.5 rounded-lg transition shrink-0 ${activeTab === \'demurrage\' ? \'bg-blue-600 text-white font-bold\' : \'text-slate-400 hover:text-white\'}`}
          >
            4. Demurrage (£45/hr)
          </button>
        </nav>
      </header>

      {/* Main Body */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-4 sm:p-6 lg:p-8 space-y-6">

        {/* TAB 1: HAULAGE PARTNERS (HP) & RETURNLOADS ECOSYSTEM */}
        {activeTab === \'haulage-partners\' && (
          <div className="space-y-6">
            {/* Modal Header Bar */}
            <div className="bg-slate-900 border border-slate-800 p-6 rounded-3xl space-y-4 shadow-xl">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-2xl bg-blue-600 flex items-center justify-center font-black text-white text-xl shadow-lg shadow-blue-500/20">
                    HP
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h1 className="text-xl font-black text-white">Haulage Partners (HP) & Returnloads Platform Workflow</h1>
                      <span className="text-[10px] font-mono bg-blue-500/20 text-blue-400 border border-blue-500/40 px-2 py-0.5 rounded font-bold uppercase">
                        DP Standard
                      </span>
                    </div>
                    <p className="text-xs text-slate-400 font-mono">
                      High-density member-to-member freight trading, closed vetting & direct financial settlement (Zero Escrow Middleman)
                    </p>
                  </div>
                </div>

                {/* Unified Ecosystem Switcher */}
                <div className="flex items-center gap-2 bg-slate-950 border border-slate-800 p-1.5 rounded-2xl">
                  <button
                    onClick={() => setHpEcosystem(\'haulage\')}
                    className={`px-3 py-2 rounded-xl text-xs font-bold flex items-center gap-2 transition ${hpEcosystem === \'haulage\' ? \'bg-cyan-500 text-slate-950 font-black shadow-md\' : \'text-slate-400 hover:text-white\'}`}
                  >
                    <Truck className="w-4 h-4" /> Haulage Partners (7.5t – 44t)
                  </button>
                  <button
                    onClick={() => setHpEcosystem(\'courier\')}
                    className={`px-3 py-2 rounded-xl text-xs font-bold flex items-center gap-2 transition ${hpEcosystem === \'courier\' ? \'bg-cyan-500 text-slate-950 font-black shadow-md\' : \'text-slate-400 hover:text-white\'}`}
                  >
                    <RefreshCw className="w-4 h-4" /> Courier Partners (Same-Day Van)
                  </button>
                </div>
              </div>

              {/* 6-Step Stepper Header */}
              <div className="grid grid-cols-2 md:grid-cols-6 gap-2 pt-2">
                {[
                  { step: 1, tag: 'POSTER / HAULIER', title: '1. Load Posting / Availability' },
                  { step: 2, tag: 'PRIVATE QUOTING', title: '2. Quoting & Negotiation' },
                  { step: 3, tag: 'DISPATCH CONTRACT', title: '3. Booking & Confirmation' },
                  { step: 4, tag: 'GPS TRACKING', title: '4. In-Transit Tracking' },
                  { step: 5, tag: 'PROOF OF DELIVERY', title: '5. e-POD Capture' },
                  { step: 6, tag: 'FINANCIAL SETTLEMENT', title: '6. Invoicing & Settlement' }
                ].map((s) => (
                  <button
                    key={s.step}
                    onClick={() => setHpStep(s.step)}
                    className={`p-3 rounded-2xl border text-left transition flex flex-col justify-between ${
                      hpStep === s.step
                        ? \'bg-cyan-950/40 border-cyan-400 shadow-md shadow-cyan-500/10\'
                        : \'bg-slate-950/60 border-slate-800 hover:border-slate-700\'
                    }`}
                  >
                    <div className="flex items-center justify-between text-[10px] font-mono font-bold text-slate-400 mb-1">
                      <span>STEP {s.step}</span>
                      <span className="text-[9px] text-cyan-400/80">{s.tag}</span>
                    </div>
                    <span className={`text-xs font-bold leading-tight ${hpStep === s.step ? \'text-cyan-300\' : \'text-slate-300\'}`}>
                      {s.title}
                    </span>
                  </button>
                ))}
              </div>
            </div>

            {/* Step Body */}
            {hpStep === 1 && (
              <div className="bg-slate-900 border border-slate-800 p-6 rounded-3xl space-y-6">
                <div className="flex items-center justify-between border-b border-slate-800 pb-4">
                  <div className="flex items-center gap-2">
                    <Radio className="w-5 h-5 text-cyan-400 animate-pulse" />
                    <h2 className="text-base font-black text-white">
                      Step 1: Load Posting or Availability Broadcasting
                    </h2>
                  </div>
                  <span className="text-xs font-mono font-bold bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 px-3 py-1 rounded-full uppercase">
                    44T CURTAIN-SIDER
                  </span>
                </div>
                <p className="text-xs text-slate-400 font-mono">
                  Choose between open board overflow auction or instant "Smart Matching" GPS broadcast.
                </p>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Method A: Post Overflow Load */}
                  <div className="bg-slate-950 border border-slate-800 p-6 rounded-2xl space-y-4 flex flex-col justify-between">
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <h3 className="text-sm font-black text-white">Method A: Post Overflow Load</h3>
                        <span className="text-[10px] font-mono bg-slate-800 text-slate-300 px-2 py-0.5 rounded font-bold">Forwarder / 3PL</span>
                      </div>
                      <p className="text-xs text-slate-400">
                        Specify vehicle specs (44t curtain-sider, box trailer, tail-lift required), collection/drop-off windows, cargo tonnage, and standard terms.
                      </p>
                      <div className="p-4 bg-slate-900 rounded-xl border border-slate-800 text-xs font-mono space-y-2">
                        <div className="flex justify-between">
                          <span className="text-slate-400">Route:</span>
                          <span className="text-cyan-400 font-bold">NN6 (Crick) → M25 (Dartford)</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-slate-400">Payload:</span>
                          <span className="text-white font-bold">26 Pallets (Full Truckload • 24.5t)</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-slate-400">Terms:</span>
                          <span className="text-emerald-400 font-bold">RHA Conditions (2h Free-Time, £60/hr Demurrage)</span>
                        </div>
                      </div>
                    </div>
                    <button
                      onClick={() => alert(\'✓ Posted Full Truckload to Haulage Partners Member Exchange!\')}
                      className="w-full py-3 bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs rounded-xl shadow-lg shadow-blue-500/20 transition"
                    >
                      Post Load to Exchange
                    </button>
                  </div>

                  {/* Method B: Live Smart Matching */}
                  <div className="bg-slate-950 border border-slate-800 p-6 rounded-2xl space-y-4 flex flex-col justify-between">
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <h3 className="text-sm font-black text-white">Method B: Live Smart Matching</h3>
                        <span className="text-[10px] font-mono bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 px-2 py-0.5 rounded font-bold">GPS Live</span>
                      </div>
                      <p className="text-xs text-slate-400">
                        Advertise truck as "Empty" or "Available Soon" with live GPS location. Shippers search the live map and use Book Direct.
                      </p>
                      <div className="p-4 bg-slate-900 rounded-xl border border-slate-800 text-xs font-mono space-y-2">
                        <div className="flex justify-between">
                          <span className="text-slate-400">Status:</span>
                          <span className="text-emerald-400 font-bold">Broadcasting to 15,000+ members</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-slate-400">Current Position:</span>
                          <span className="text-white font-bold">Crick DIRFT East (M1 J18)</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-slate-400">Vehicle Type:</span>
                          <span className="text-cyan-400 font-bold">44t Artic Curtain-Sider</span>
                        </div>
                      </div>
                    </div>
                    <button
                      onClick={() => setIsBroadcasting(!isBroadcasting)}
                      className={`w-full py-3 rounded-xl font-bold text-xs transition ${
                        isBroadcasting
                          ? \'bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-black shadow-lg shadow-cyan-500/20\'
                          : \'bg-slate-800 hover:bg-slate-700 text-white\'
                      }`}
                    >
                      {isBroadcasting ? \'Disable Broadcast\' : \'Enable Live Smart Matching Broadcast\'}
                    </button>
                  </div>
                </div>
              </div>
            )}

            {hpStep === 2 && (
              <div className="bg-slate-900 border border-slate-800 p-6 rounded-3xl space-y-4">
                <h2 className="text-base font-black text-white">Step 2: Quoting & Negotiation (Private Quoting)</h2>
                <p className="text-xs text-slate-400">Real-time private bids from accredited hauliers without race-to-the-bottom public boards.</p>
                <div className="p-4 bg-slate-950 rounded-2xl border border-slate-800 text-xs font-mono space-y-2">
                  <div className="flex justify-between"><span>Incoming Quote #1:</span><strong className="text-emerald-400">£620.00 (Express Logistics - 99.4% rating)</strong></div>
                  <div className="flex justify-between"><span>Incoming Quote #2:</span><strong className="text-emerald-400">£595.00 (Midland Freight Direct - 98.8% rating)</strong></div>
                </div>
              </div>
            )}

            {hpStep === 3 && (
              <div className="bg-slate-900 border border-slate-800 p-6 rounded-3xl space-y-4">
                <h2 className="text-base font-black text-white">Step 3: Booking & Confirmation (Dispatch Contract)</h2>
                <p className="text-xs text-slate-400">Legally binding electronic assignment under RHA 2024 conditions with direct automated transport confirmation.</p>
                <div className="p-4 bg-slate-950 rounded-2xl border border-slate-800 text-xs font-mono space-y-2">
                  <div className="flex justify-between"><span>Contract Ref:</span><strong className="text-cyan-400">HP-CON-2026-9812</strong></div>
                  <div className="flex justify-between"><span>Settlement terms:</span><strong className="text-white">Direct 14-day BACS (Zero Escrow Deductions)</strong></div>
                </div>
              </div>
            )}

            {hpStep === 4 && (
              <div className="bg-slate-900 border border-slate-800 p-6 rounded-3xl space-y-4">
                <h2 className="text-base font-black text-white">Step 4: In-Transit Tracking (1Hz GPS Telematics)</h2>
                <p className="text-xs text-slate-400">Real-time breadcrumb tracking shared securely between shipper and haulier.</p>
                <div className="p-4 bg-slate-950 rounded-2xl border border-slate-800 text-xs font-mono space-y-2">
                  <div className="flex justify-between"><span>Vehicle:</span><strong className="text-white">DG21 EDP (Speed 54 mph on M1 Southbound)</strong></div>
                  <div className="flex justify-between"><span>ETA to Dartford:</span><strong className="text-emerald-400">14:15 BST (On Schedule)</strong></div>
                </div>
              </div>
            )}

            {hpStep === 5 && (
              <div className="bg-slate-900 border border-slate-800 p-6 rounded-3xl space-y-4">
                <h2 className="text-base font-black text-white">Step 5: Paperless e-POD Capture</h2>
                <p className="text-xs text-slate-400">Digital sign-on-glass with GPS location and timestamp watermarked proof-of-delivery.</p>
                <div className="p-4 bg-slate-950 rounded-2xl border border-slate-800 text-xs font-mono space-y-2">
                  <div className="flex justify-between"><span>Signatory:</span><strong className="text-white">J. Richardson (Warehouse Supervisor)</strong></div>
                  <div className="flex justify-between"><span>Status:</span><strong className="text-emerald-400">✓ e-POD Verified & Timestamped</strong></div>
                </div>
              </div>
            )}

            {hpStep === 6 && (
              <div className="bg-slate-900 border border-slate-800 p-6 rounded-3xl space-y-4">
                <h2 className="text-base font-black text-white">Step 6: Invoicing & Financial Settlement</h2>
                <p className="text-xs text-slate-400">Instant PDF invoice generation matching agreed RHA demurrage and base freight rate.</p>
                <div className="p-4 bg-slate-950 rounded-2xl border border-slate-800 text-xs font-mono space-y-2">
                  <div className="flex justify-between"><span>Gross Payable:</span><strong className="text-white">£620.00 + VAT</strong></div>
                  <div className="flex justify-between"><span>Platform Fee:</span><strong className="text-emerald-400">£0.00 (Zero Escrow Middleman Take)</strong></div>
                </div>
              </div>
            )}

            {/* Stepper Navigation Buttons */}
            <div className="flex items-center justify-between">
              <button
                disabled={hpStep === 1}
                onClick={() => setHpStep((prev) => Math.max(1, prev - 1))}
                className="py-2.5 px-4 bg-slate-900 hover:bg-slate-800 disabled:opacity-40 border border-slate-800 text-xs font-bold rounded-xl flex items-center gap-2"
              >
                ← Previous Step
              </button>
              <span className="text-xs font-mono text-slate-400">
                Step {hpStep} of 6
              </span>
              <button
                disabled={hpStep === 6}
                onClick={() => setHpStep((prev) => Math.min(6, prev + 1))}
                className="py-2.5 px-5 bg-cyan-500 hover:bg-cyan-400 disabled:opacity-40 text-slate-950 font-black text-xs rounded-xl flex items-center gap-2 shadow-md shadow-cyan-500/20"
              >
                Next Step →
              </button>
            </div>

            {/* Benchmark Pricing Table */}
            <div className="bg-slate-900 border border-slate-800 p-6 rounded-3xl space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-800 pb-3">
                <h3 className="text-sm font-black text-white uppercase tracking-wider">
                  Haulage Partners (HP) Core Membership Tiers & Pricing Benchmarks
                </h3>
                <span className="text-[11px] font-mono text-slate-400">
                  12-Month Annual Contracts (excl. VAT)
                </span>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs font-mono">
                  <thead>
                    <tr className="border-b border-slate-800 text-slate-400 uppercase text-[10px]">
                      <th className="py-2.5 px-3">Tier</th>
                      <th className="py-2.5 px-3">Fleet Size</th>
                      <th className="py-2.5 px-3">Included Users</th>
                      <th className="py-2.5 px-3">Market Access</th>
                      <th className="py-2.5 px-3 text-right">Indicative Price</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800/60">
                    <tr className="hover:bg-slate-800/30">
                      <td className="py-3 px-3 font-bold text-white">HP Small Fleet</td>
                      <td className="py-3 px-3 text-slate-300">1 – 5 vehicles</td>
                      <td className="py-3 px-3 text-slate-300">3 users</td>
                      <td className="py-3 px-3 text-slate-300">Haulage only (7.5t+)</td>
                      <td className="py-3 px-3 text-right text-cyan-400 font-bold">~£259.99 / mo</td>
                    </tr>
                    <tr className="hover:bg-slate-800/30">
                      <td className="py-3 px-3 font-bold text-white">HP Med Fleet</td>
                      <td className="py-3 px-3 text-slate-300">6 – 15 vehicles</td>
                      <td className="py-3 px-3 text-slate-300">4 users</td>
                      <td className="py-3 px-3 text-slate-300">Haulage + Courier (CP)</td>
                      <td className="py-3 px-3 text-right text-cyan-400 font-bold">~£299.99 / mo</td>
                    </tr>
                    <tr className="hover:bg-slate-800/30">
                      <td className="py-3 px-3 font-bold text-white">HP Large Fleet</td>
                      <td className="py-3 px-3 text-slate-300">16 – 50 vehicles</td>
                      <td className="py-3 px-3 text-slate-300">8 users</td>
                      <td className="py-3 px-3 text-slate-300">Haulage + Courier (CP)</td>
                      <td className="py-3 px-3 text-right text-cyan-400 font-bold">~£549.99 / mo</td>
                    </tr>
                    <tr className="hover:bg-slate-800/30">
                      <td className="py-3 px-3 font-bold text-white">HP Enterprise</td>
                      <td className="py-3 px-3 text-slate-300">50+ vehicles</td>
                      <td className="py-3 px-3 text-slate-300">20+ users</td>
                      <td className="py-3 px-3 text-slate-300">Haulage + Courier (CP)</td>
                      <td className="py-3 px-3 text-right text-amber-400 font-bold">Bespoke / POA</td>
                    </tr>
                    <tr className="hover:bg-slate-800/30">
                      <td className="py-3 px-3 font-bold text-emerald-400">Forwarder Packages</td>
                      <td className="py-3 px-3 text-slate-300">Non-asset / 3PL</td>
                      <td className="py-3 px-3 text-slate-300">1 – 3 users</td>
                      <td className="py-3 px-3 text-slate-300">Posting & Brokering</td>
                      <td className="py-3 px-3 text-right text-emerald-400 font-bold">£199.99 – £359.99 / mo</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: LIVE TELEMATICS MAP */}
        {activeTab === \'map\' && (
          <div className="space-y-4">
            <div className="bg-slate-900 border border-slate-800 p-6 rounded-3xl space-y-4">
              <h2 className="text-base font-black text-white">Live 1Hz Fleet GPS Telematics Map</h2>
              <p className="text-xs text-slate-400">Real-time vehicle breadcrumbs across UK trunk roads.</p>
              <div className="h-64 bg-slate-950 rounded-2xl border border-slate-800 flex items-center justify-center text-xs font-mono text-slate-500">
                [ Map Engine: 15 Tractors Active • 3 In-Transit • 1 Demurrage Incurred ]
              </div>
            </div>
          </div>
        )}

        {/* TAB 3: DIRECT DISPATCH */}
        {activeTab === \'dispatch\' && (
          <div className="space-y-4">
            <div className="bg-slate-900 border border-slate-800 p-6 rounded-3xl space-y-4">
              <h2 className="text-base font-black text-white">Direct Driver Dispatch (£28.00/hr)</h2>
              <p className="text-xs text-slate-400">Dispatch vetted Class 1 drivers directly with zero recruitment agency cut.</p>
              <div className="p-4 bg-slate-950 rounded-2xl border border-slate-800 text-xs font-mono text-slate-300 space-y-2">
                <div className="flex justify-between"><span>Available Drivers:</span><strong className="text-emerald-400">8 Verified Class 1 Drivers Ready</strong></div>
                <div className="flex justify-between"><span>Standard Rate:</span><strong className="text-white">£28.00/hr Direct (Net Zero Agency Markup)</strong></div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 4: COMPLIANCE & DEFECT TRIAGE */}
        {activeTab === \'compliance\' && (
          <div className="space-y-4">
            <div className="bg-slate-900 border border-slate-800 p-6 rounded-3xl space-y-4">
              <h2 className="text-base font-black text-white">Vehicle Check Walkaround Defect Triage</h2>
              <p className="text-xs text-slate-400">DVSA 32-point inspection submissions stream directly from drivers.</p>
              <div className="p-4 bg-slate-950 rounded-2xl border border-slate-800 text-xs font-mono text-slate-300 space-y-2">
                <div className="flex justify-between"><span>Last Submission:</span><strong className="text-emerald-400">DG21 EDP (Alexander Kite) • ZERO DEFECTS</strong></div>
                <div className="flex justify-between"><span>Trailer Checked:</span><strong className="text-white">TR-8492 (Curtain-sider)</strong></div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 5: DEMURRAGE INVOICING */}
        {activeTab === \'demurrage\' && (
          <div className="space-y-4">
            <div className="bg-slate-900 border border-slate-800 p-6 rounded-3xl space-y-4">
              <h2 className="text-base font-black text-white">Live Demurrage Invoicing Manager (£45.00/hr)</h2>
              <p className="text-xs text-slate-400">Automated detention invoicing triggered when depot dwell exceeds 60 minutes.</p>
              <div className="p-4 bg-slate-950 rounded-2xl border border-slate-800 text-xs font-mono text-slate-300 space-y-2">
                <div className="flex justify-between"><span>Pending Dwell Invoices:</span><strong className="text-amber-400">£180.00 (Watford DC • 4 Hours Dwell)</strong></div>
                <div className="flex justify-between"><span>Terms:</span><strong className="text-white">RHA 2h Free-Time • Immediate Ingress Geofence</strong></div>
              </div>
            </div>
          </div>
        )}

      </main>
    </div>
  );
}
'''

with open('src/app/haulier/page.tsx', 'w') as f:
    f.write(haulier_code)

print("✓ Updated src/app/haulier/page.tsx with complete Haulage Partners module!")
