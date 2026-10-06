import os, re

print("=== 1. CREATING DVSA CHECKLIST & TRAILER DATABASE ===")
os.makedirs("src/data", exist_ok=True)

dvsa_data = """export interface DvsaItem {
  id: number;
  category: string;
  title: string;
  instruction: string;
}

export const dvsaChecklist: DvsaItem[] = [
  { id: 1, category: 'Tractor Steer', title: 'Front Axle Steering Tyres & Wheel Nuts', instruction: 'Inspect tread depth across 3/4 breadth (min 1mm), sidewall cuts, bulging, and ensure wheel nut alignment pointers match.' },
  { id: 2, category: 'Visibility', title: 'Mirrors, Windows & Class V/VI Direct Vision', instruction: 'Ensure all rear-view, wide-angle, close-proximity, and front mirrors are clean, unbroken, and properly aligned.' },
  { id: 3, category: 'Visibility', title: 'Windscreen Wipers, Washers & Demister', instruction: 'Test washer jets, check wiper blades for splits or tears, and confirm cab demister fan clears windscreen.' },
  { id: 4, category: 'Lighting', title: 'Front Lamps, Indicators & Hazard Flashers', instruction: 'Check sidelights, dipped beam, main beam, day-running lights, and verify hazard flashers operate all indicators.' },
  { id: 5, category: 'Cab Integrity', title: 'Cab Doors, Steps & External Mountings', instruction: 'Verify doors latch and seal correctly, grab handles are firm, and step treads are free of oil or excessive mud.' },
  { id: 6, category: 'Under Bonnet', title: 'Engine Fluid Levels, Coolant & Battery', instruction: 'Check engine oil, coolant expansion tank, power steering fluid, and ensure battery box cover is clamped shut.' },
  { id: 7, category: 'Cab Controls', title: 'Steering Play & Audible Warning Horn', instruction: 'Inspect steering wheel for excessive free movement and test horn for clear, audible warning tone.' },
  { id: 8, category: 'Instrumentation', title: 'Dashboard Gauges & ABS/EBS Warning Lights', instruction: 'Confirm ABS/EBS warning lights extinguish after initial ignition self-test, and gauges display correct system status.' },
  { id: 9, category: 'Pneumatics', title: 'Air Build-up, Footbrake & Park Brake', instruction: 'Charge pneumatic reservoirs to governor cut-out (8.5-10 bar). Verify handbrake holds tractor and footbrake responds.' },
  { id: 10, category: 'Compliance', title: 'Tachograph Calibration Seal & Card Lock', instruction: 'Inspect tachograph calibration plate, verify seal integrity, UTC clock accuracy, and digital card lock mechanism.' },
  { id: 11, category: 'Cab Interior', title: 'Seatbelts, Seats & Interior Cab Mountings', instruction: 'Examine driver and passenger seatbelts for fraying, test inertia reel lock, and check seat air-suspension anchor.' },
  { id: 12, category: 'Emissions', title: 'Exhaust System & AdBlue Fluid Level', instruction: 'Inspect exhaust for smoke, soot leaks, or loose silencer brackets, and confirm AdBlue tank has sufficient range.' },
  { id: 13, category: 'Fuel System', title: 'Fuel Tank, Locking Cap & Anti-Siphon Collar', instruction: 'Inspect fuel tank brackets, check for leaks, and confirm fuel cap seal and anti-siphon collar are intact.' },
  { id: 14, category: 'Coupling', title: 'Air Lines (Suzies) & Electrical Susie Cables', instruction: 'Check red emergency and yellow service air lines for kinks, chafing, and ensure 24N/24S or ISO electrical cables are locked.' },
  { id: 15, category: 'Coupling', title: '5th Wheel Mechanism & Safety Dog-Clip Pin', instruction: 'Visually verify jaws are fully engaged around trailer kingpin, release arm is home, and dog-clip pin is inserted.' },
  { id: 16, category: 'Trailer Front', title: 'Trailer Landing Legs & Winder Stowage', instruction: 'Ensure landing legs are wound fully up, footpads clear road surface, and winding handle is securely stowed.' },
  { id: 17, category: 'Protection', title: 'Sideguards & Spray Suppression Flaps', instruction: 'Inspect lateral protection sideguards for bends, cracks, and check mudflaps for compliance and secure mounting.' },
  { id: 18, category: 'Superstructure', title: 'Trailer Curtains, Straps, Buckles & Tensioners', instruction: 'Verify curtain tension, inspect all side straps and buckles for fraying, and check roof pelmet for weather seal.' },
  { id: 19, category: 'Chassis', title: 'Trailer Chassis, Crossmembers & Twistlocks', instruction: 'Check main chassis beams for weld fractures, crossmember cracks, and ensure twistlocks are locked if containerised.' },
  { id: 20, category: 'Trailer Running', title: 'Trailer Axle Tyres (Tread & Pressure)', instruction: 'Check trailer tyres for minimum 1mm tread across 3/4 breadth, sidewall cuts, bulging, and twin-wheel spacing.' },
  { id: 21, category: 'Trailer Running', title: 'Trailer Wheel Nuts & Alignment Pointers', instruction: 'Inspect all trailer wheel nuts, ensuring wheel nut indicator arrows align point-to-point without loosening.' },
  { id: 22, category: 'Pneumatics', title: 'Trailer Air Tanks & Moisture Drain Valves', instruction: 'Pull manual condensation drain rings under trailer air reservoirs to expel moisture and oil accumulation.' },
  { id: 23, category: 'Reflectors', title: 'Rear Marker Chevron Boards & Contour Markings', instruction: 'Ensure ECE 70 red/yellow reflective chevron plates are clean, undamaged, and perimeter contour tape is visible.' },
  { id: 24, category: 'Lighting', title: 'Rear Stop, Tail, Fog & Reversing Lights', instruction: 'Verify all rear lighting clusters illuminate cleanly, lenses are unbroken, and stop lamps illuminate brightly on brake.' },
  { id: 25, category: 'Identification', title: 'Registration Plates & Plate Illumination', instruction: 'Confirm both tractor and trailer registration plates are clean, legible, matching, and bulbs are illuminated.' },
  { id: 26, category: 'Rear Security', title: 'Rear Underrun Crash Bar & Door Latches', instruction: 'Check rear underrun bumper bar integrity, inspect barn door hinges, seals, and lock secondary keeper pins.' },
  { id: 27, category: 'Bridge Safety', title: 'In-Cab Height Placard vs Physical Height', instruction: 'Verify in-cab height placard reflects actual physical height of trailer (4.45m / 14ft 7in) before departure.' },
  { id: 28, category: 'Safety System', title: 'DVS Left-Turn Alarm & Blind Spot Radar', instruction: 'Activate left indicator and test external speaker: Warning vehicle turning left, ensuring blind spot radar is active.' },
  { id: 29, category: 'Emergency', title: 'Fire Extinguisher & First Aid / Hazchem Kit', instruction: 'Verify in-cab fire extinguisher pressure gauge is in green zone, pin intact, and emergency eye wash kit is present.' },
  { id: 30, category: 'Cargo Security', title: 'Load Security, Internal Straps & Headboard', instruction: 'Check internal ratchet straps, cargo restraint bars, and verify front headboard has no structural damage.' },
  { id: 31, category: 'Rear View', title: 'Reversing Camera & Blind Spot Monitors', instruction: 'Check cab screen reversing camera feed, clean camera lens if obscured by road grime, and confirm angle.' },
  { id: 32, category: 'Final Test', title: 'Final Air Pressure Leakage Hold Test', instruction: 'Hold footbrake firmly depressed for 1 full minute with engine off: system air loss must not exceed 0.5 bar.' }
];

export const fleetTrailers = [
  { id: 'TR-8492', label: 'Schmitz Curtain-Sider (4.45m / 14ft 7in)', mot: 'Dec 2026', pmi: 'Passed (4 wks remaining)', rbt: '62%' },
  { id: 'TR-1102', label: 'Montracon Box Trailer (4.20m / 13ft 9in)', mot: 'Oct 2026', pmi: 'Passed (2 wks remaining)', rbt: '65%' },
  { id: 'TR-9041', label: 'Gray & Adams Reefer (4.00m / 13ft 1in)', mot: 'Jan 2027', pmi: 'Passed (5 wks remaining)', rbt: '59%' }
];
"""

with open("src/data/dvsaChecklist.ts", "w") as f:
    f.write(dvsa_data)
print("✓ Created src/data/dvsaChecklist.ts successfully!")

print("=== 2. UPDATING HAULIER FLEET PORTAL (HAULAGE PARTNERS) ===")
# Generate complete Haulier Portal with Haulage Partners
haulier_code = """'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  Truck, MapPin, Users, FileCheck, ShieldAlert, CheckCircle2,
  AlertTriangle, ArrowRight, ArrowLeft, RefreshCw, PoundSterling,
  Clock, Sliders, ChevronRight, Send, CheckSquare, Search, Navigation,
  Building2, Eye, Box, Radio, FileText, Check
} from 'lucide-react';

export default function HaulierDashboard() {
  const [activeTab, setActiveTab] = useState<'haulage-partners' | 'map' | 'dispatch' | 'compliance' | 'demurrage'>('haulage-partners');
  const [hpEcosystem, setHpEcosystem] = useState<'haulage' | 'courier'>('haulage');
  const [hpStep, setHpStep] = useState<number>(1);
  const [isBroadcasting, setIsBroadcasting] = useState<boolean>(true);

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans">
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

        <nav className="flex items-center gap-1.5 bg-slate-950 p-1 rounded-xl border border-slate-800 text-xs font-mono overflow-x-auto max-w-full">
          <button
            onClick={() => setActiveTab('haulage-partners')}
            className={`px-3 py-1.5 rounded-lg transition shrink-0 ${activeTab === 'haulage-partners' ? 'bg-blue-600 text-white font-black shadow-lg shadow-blue-600/30' : 'text-blue-400 hover:text-white'}`}
          >
            🌐 Haulage Partners (HP)
          </button>
          <button
            onClick={() => setActiveTab('map')}
            className={`px-3 py-1.5 rounded-lg transition shrink-0 ${activeTab === 'map' ? 'bg-blue-600 text-white font-bold' : 'text-slate-400 hover:text-white'}`}
          >
            1. Live Telematics
          </button>
          <button
            onClick={() => setActiveTab('dispatch')}
            className={`px-3 py-1.5 rounded-lg transition shrink-0 ${activeTab === 'dispatch' ? 'bg-blue-600 text-white font-bold' : 'text-slate-400 hover:text-white'}`}
          >
            2. Direct Dispatch
          </button>
          <button
            onClick={() => setActiveTab('compliance')}
            className={`px-3 py-1.5 rounded-lg transition shrink-0 ${activeTab === 'compliance' ? 'bg-blue-600 text-white font-bold' : 'text-slate-400 hover:text-white'}`}
          >
            3. Vehicle Check Triage
          </button>
          <button
            onClick={() => setActiveTab('demurrage')}
            className={`px-3 py-1.5 rounded-lg transition shrink-0 ${activeTab === 'demurrage' ? 'bg-blue-600 text-white font-bold' : 'text-slate-400 hover:text-white'}`}
          >
            4. Demurrage (£45/hr)
          </button>
        </nav>
      </header>

      <main className="flex-1 max-w-7xl w-full mx-auto p-4 sm:p-6 lg:p-8 space-y-6">
        {activeTab === 'haulage-partners' && (
          <div className="space-y-6">
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

                <div className="flex items-center gap-2 bg-slate-950 border border-slate-800 p-1.5 rounded-2xl">
                  <button
                    onClick={() => setHpEcosystem('haulage')}
                    className={`px-3 py-2 rounded-xl text-xs font-bold flex items-center gap-2 transition ${hpEcosystem === 'haulage' ? 'bg-cyan-500 text-slate-950 font-black shadow-md' : 'text-slate-400 hover:text-white'}`}
                  >
                    <Truck className="w-4 h-4" /> Haulage Partners (7.5t – 44t)
                  </button>
                  <button
                    onClick={() => setHpEcosystem('courier')}
                    className={`px-3 py-2 rounded-xl text-xs font-bold flex items-center gap-2 transition ${hpEcosystem === 'courier' ? 'bg-cyan-500 text-slate-950 font-black shadow-md' : 'text-slate-400 hover:text-white'}`}
                  >
                    <RefreshCw className="w-4 h-4" /> Courier Partners (Same-Day Van)
                  </button>
                </div>
              </div>

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
                        ? 'bg-cyan-950/40 border-cyan-400 shadow-md shadow-cyan-500/10'
                        : 'bg-slate-950/60 border-slate-800 hover:border-slate-700'
                    }`}
                  >
                    <div className="flex items-center justify-between text-[10px] font-mono font-bold text-slate-400 mb-1">
                      <span>STEP {s.step}</span>
                      <span className="text-[9px] text-cyan-400/80">{s.tag}</span>
                    </div>
                    <span className={`text-xs font-bold leading-tight ${hpStep === s.step ? 'text-cyan-300' : 'text-slate-300'}`}>
                      {s.title}
                    </span>
                  </button>
                ))}
              </div>
            </div>

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
                      onClick={() => alert('✓ Posted Full Truckload to Haulage Partners Member Exchange!')}
                      className="w-full py-3 bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs rounded-xl shadow-lg shadow-blue-500/20 transition"
                    >
                      Post Load to Exchange
                    </button>
                  </div>

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
                          ? 'bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-black shadow-lg shadow-cyan-500/20'
                          : 'bg-slate-800 hover:bg-slate-700 text-white'
                      }`}
                    >
                      {isBroadcasting ? 'Disable Broadcast' : 'Enable Live Smart Matching Broadcast'}
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

        {activeTab === 'map' && (
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

        {activeTab === 'dispatch' && (
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

        {activeTab === 'compliance' && (
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

        {activeTab === 'demurrage' && (
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
"""

with open("src/app/haulier/page.tsx", "w") as f:
    f.write(haulier_code)
print("✓ Updated src/app/haulier/page.tsx with Haulage Partners!")

print("=== 3. UPDATING DRIVER IN-CAB OS (VEHICLE CHECK & DRIVER TOOLS) ===")
# Rewrite src/app/driver/page.tsx with full Vehicle Check (DVSA 32 items & Trailer Database) + Driver Tools
driver_code = """'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  Truck, ShieldAlert, PhoneCall, Volume2, Radio,
  Clock, MapPin, Search, Plus, CheckCircle2, ChevronRight,
  FileText, Camera, Sliders, AlertTriangle, ArrowRight,
  PoundSterling, ShieldCheck, UserCheck, Eye, Mic
} from 'lucide-react';
import { dvsaChecklist, fleetTrailers } from '@/data/dvsaChecklist';

export default function DriverDashboard() {
  const [activeTab, setActiveTab] = useState<'readiness' | 'route' | 'enroute' | 'depot' | 'tacho' | 'tools'>('readiness');
  const [showSosModal, setShowSosModal] = useState(false);

  // Vehicle Check State & Trailer Database
  const [vehicleReg, setVehicleReg] = useState('DG21 EDP');
  const [hasTrailer, setHasTrailer] = useState(true);
  const [selectedTrailer, setSelectedTrailer] = useState('TR-8492');
  const [customTrailer, setCustomTrailer] = useState('');
  const [checkStarted, setCheckStarted] = useState(false);
  const [walkaroundStep, setWalkaroundStep] = useState(1);
  const [defectsLogged, setDefectsLogged] = useState(0);
  const [isCheckComplete, setIsCheckComplete] = useState(false);

  // Route & Places
  const [destinationQuery, setDestinationQuery] = useState('DIRFT Northampton East (NN6 7GZ)');
  const [waypoints, setWaypoints] = useState<string[]>(['Bay #24 Ingress Gate']);
  const [newStop, setNewStop] = useState('');
  const [demurrageMinutes, setDemurrageMinutes] = useState(74);

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans">
      {/* Top Driver HUD */}
      <header className="border-b border-slate-800 bg-slate-900/90 backdrop-blur px-6 py-3 flex flex-col md:flex-row items-center justify-between gap-3 sticky top-0 z-40">
        <div className="flex items-center gap-3">
          <Link href="/" className="flex items-center gap-2">
            <span className="w-8 h-8 rounded-xl bg-blue-600 flex items-center justify-center font-black text-white text-lg">
              DP
            </span>
            <span className="font-black text-white text-base">DRIVE PARTNERS</span>
          </Link>
          <span className="text-slate-600">/</span>
          <span className="text-xs font-mono bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 px-2 py-0.5 rounded-full font-bold">
            Driver In-Cab OS
          </span>
        </div>

        {/* Live Rig Placards */}
        <div className="flex flex-wrap items-center gap-2 text-xs font-mono">
          <div className="bg-slate-950 px-2.5 py-1 rounded-lg border border-slate-800">
            <span className="text-slate-400">Unit:</span> <strong className="text-amber-400">{vehicleReg}</strong>
          </div>
          <div className="bg-slate-950 px-2.5 py-1 rounded-lg border border-slate-800">
            <span className="text-slate-400">Trailer:</span> <strong className="text-cyan-400">{hasTrailer ? (selectedTrailer === 'CUSTOM' ? (customTrailer || 'Custom') : selectedTrailer) : 'None (Solo)'}</strong>
          </div>
          <div className="bg-slate-950 px-2.5 py-1 rounded-lg border border-slate-800">
            <span className="text-slate-400">Height:</span> <strong className="text-white">4.45m / 14&apos;7&quot;</strong>
          </div>
          <div className="bg-slate-950 px-2.5 py-1 rounded-lg border border-slate-800">
            <span className="text-slate-400">Drive Left:</span> <strong className="text-emerald-400">03h 42m</strong>
          </div>
        </div>

        <button
          onClick={() => setShowSosModal(true)}
          className="w-full md:w-auto px-4 py-1.5 bg-red-600 hover:bg-red-500 text-white font-black text-xs font-mono rounded-xl flex items-center justify-center gap-2 shadow-lg shadow-red-600/30 transition animate-pulse"
        >
          <ShieldAlert className="w-4 h-4" /> 🚨 1-Tap SOS
        </button>
      </header>

      {/* Navigation Sub-Tabs */}
      <div className="border-b border-slate-800 bg-slate-900/40 px-6 py-2 overflow-x-auto flex items-center gap-2 text-xs font-mono">
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
          3. En-Route Safety
        </button>
        <button
          onClick={() => setActiveTab('depot')}
          className={`px-3 py-1.5 rounded-lg transition shrink-0 ${activeTab === 'depot' ? 'bg-emerald-500 text-slate-950 font-bold' : 'text-slate-400 hover:text-white'}`}
        >
          4. Depot & ePOD
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

      <main className="flex-1 max-w-6xl w-full mx-auto p-4 sm:p-6 lg:p-8 space-y-6">
        {/* TAB 1: VEHICLE CHECK & READINESS */}
        {activeTab === 'readiness' && (
          <div className="space-y-6">
            {!checkStarted ? (
              <div className="bg-slate-900 border border-slate-800 p-6 rounded-3xl space-y-6 shadow-xl">
                <div className="border-b border-slate-800 pb-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div>
                    <h2 className="text-lg font-black text-white flex items-center gap-2">
                      <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                      Vehicle Check: Vehicle & Trailer Intake
                    </h2>
                    <p className="text-xs text-slate-400 font-mono">
                      Statutory DVSA Daily Walkaround • Select Fleet Configuration
                    </p>
                  </div>
                  <span className="text-xs font-mono font-bold bg-blue-500/20 text-blue-400 border border-blue-500/40 px-3 py-1 rounded-full">
                    DVSA 15-Month Compliance
                  </span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Tractor Config */}
                  <div className="bg-slate-950 border border-slate-800 p-5 rounded-2xl space-y-4">
                    <div className="flex items-center justify-between">
                      <label className="text-xs font-mono uppercase font-bold text-slate-300 flex items-center gap-2">
                        <Truck className="w-4 h-4 text-blue-400" /> Tractor Unit Registration
                      </label>
                      <span className="text-[10px] font-mono bg-emerald-500/20 text-emerald-400 px-2 py-0.5 rounded font-bold">MOT ACTIVE</span>
                    </div>
                    <input
                      type="text"
                      value={vehicleReg}
                      onChange={(e) => setVehicleReg(e.target.value.toUpperCase())}
                      className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-3 text-lg font-mono font-black text-amber-400 focus:outline-none focus:border-amber-400 tracking-wider"
                      placeholder="DG21 EDP"
                    />
                    <div className="text-[11px] font-mono text-slate-400 space-y-1">
                      <div className="flex justify-between"><span>Vehicle Type:</span><span className="text-slate-200">DAF XF 530 6x2 Midlift Tractor</span></div>
                      <div className="flex justify-between"><span>Odometer:</span><span className="text-slate-200">342,109 miles</span></div>
                    </div>
                  </div>

                  {/* Trailer Config & Database */}
                  <div className="bg-slate-950 border border-slate-800 p-5 rounded-2xl space-y-4">
                    <div className="flex items-center justify-between">
                      <label className="text-xs font-mono uppercase font-bold text-slate-300">
                        Trailer Attached?
                      </label>
                      <div className="flex items-center gap-2">
                        <button
                          type="button"
                          onClick={() => setHasTrailer(true)}
                          className={`px-3 py-1 rounded-lg text-xs font-bold font-mono transition ${hasTrailer ? 'bg-blue-600 text-white' : 'bg-slate-900 text-slate-400'}`}
                        >
                          Yes (Artic)
                        </button>
                        <button
                          type="button"
                          onClick={() => setHasTrailer(false)}
                          className={`px-3 py-1 rounded-lg text-xs font-bold font-mono transition ${!hasTrailer ? 'bg-blue-600 text-white' : 'bg-slate-900 text-slate-400'}`}
                        >
                          No (Bobtail)
                        </button>
                      </div>
                    </div>

                    {hasTrailer ? (
                      <div className="space-y-3">
                        <label className="text-xs font-mono text-slate-400 block">
                          Select from Fleet Trailer Database:
                        </label>
                        <select
                          value={selectedTrailer}
                          onChange={(e) => setSelectedTrailer(e.target.value)}
                          className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2.5 text-xs font-mono text-cyan-300 font-bold focus:outline-none focus:border-cyan-400"
                        >
                          {fleetTrailers.map((t) => (
                            <option key={t.id} value={t.id}>{t.id} • {t.label}</option>
                          ))}
                          <option value="CUSTOM">+ Enter Custom / Third-Party Trailer</option>
                        </select>

                        {selectedTrailer === 'CUSTOM' && (
                          <input
                            type="text"
                            value={customTrailer}
                            onChange={(e) => setCustomTrailer(e.target.value.toUpperCase())}
                            placeholder="Enter Custom Trailer Reg / ID"
                            className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-xs font-mono text-white focus:outline-none focus:border-cyan-400"
                          />
                        )}

                        <div className="p-3 bg-slate-900/60 rounded-xl border border-slate-800 text-[11px] font-mono space-y-1 text-slate-300">
                          <div className="flex justify-between">
                            <span className="text-slate-400">Assigned Trailer:</span>
                            <span className="text-cyan-400 font-bold">{selectedTrailer === 'CUSTOM' ? (customTrailer || 'Custom Trailer') : selectedTrailer}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-slate-400">6-Weekly PMI Inspection:</span>
                            <span className="text-emerald-400 font-bold">Passed (4 weeks remaining)</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-slate-400">Brake Test Efficiency:</span>
                            <span className="text-emerald-400 font-bold">62% (RBT Passed)</span>
                          </div>
                        </div>
                      </div>
                    ) : (
                      <div className="p-4 bg-slate-900/60 rounded-xl border border-slate-800 text-xs font-mono text-slate-400 text-center">
                        Solo Tractor Unit (Rigid / Bobtail Mode). Trailer checks will be bypassed.
                      </div>
                    )}
                  </div>
                </div>

                <div className="pt-2 flex justify-end">
                  <button
                    onClick={() => {
                      setCheckStarted(true);
                      setWalkaroundStep(1);
                      setIsCheckComplete(false);
                    }}
                    className="w-full sm:w-auto px-8 py-3.5 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black text-sm rounded-2xl flex items-center justify-center gap-2 shadow-lg shadow-emerald-500/20 transition"
                  >
                    Start 32-Point DVSA Walkaround Check <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ) : !isCheckComplete ? (
              <div className="bg-slate-900 border border-slate-800 p-6 rounded-3xl space-y-6 shadow-xl">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800 pb-4">
                  <div>
                    <div className="flex items-center gap-2">
                      <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                      <h2 className="text-base font-black text-white">
                        Vehicle Check (Statutory 32-Point DVSA Inspection)
                      </h2>
                    </div>
                    <p className="text-xs text-slate-400 font-mono">
                      Tractor: <span className="text-amber-400 font-bold">{vehicleReg}</span>
                      {hasTrailer && <> • Trailer: <span className="text-cyan-400 font-bold">{selectedTrailer === 'CUSTOM' ? customTrailer : selectedTrailer}</span></>}
                      {' '}• 0.80x Speech Rate Voice Copilot
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="px-3 py-1 bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 text-xs font-mono font-bold rounded-full">
                      Step {walkaroundStep} of {dvsaChecklist.length}
                    </span>
                    <button
                      onClick={() => setCheckStarted(false)}
                      className="px-2.5 py-1 text-[11px] font-mono text-slate-400 hover:text-white bg-slate-800 rounded-lg"
                    >
                      Change Vehicle
                    </button>
                  </div>
                </div>

                {(() => {
                  const currentItem = dvsaChecklist[walkaroundStep - 1] || dvsaChecklist[0];
                  return (
                    <div className="bg-slate-950 border border-slate-800 p-6 rounded-2xl space-y-4">
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                        <div className="flex items-center gap-2">
                          <span className="text-[10px] font-mono font-bold uppercase bg-blue-500/20 text-blue-400 px-2 py-0.5 rounded border border-blue-500/30">
                            {currentItem.category}
                          </span>
                          <span className="text-xs font-mono font-bold text-emerald-400">
                            ITEM {currentItem.id}: {currentItem.title.toUpperCase()}
                          </span>
                        </div>
                        <button
                          onClick={() => {
                            if ('speechSynthesis' in window) {
                              const utterance = new SpeechSynthesisUtterance(`Item ${currentItem.id}: ${currentItem.title}. ${currentItem.instruction}`);
                              utterance.rate = 0.80;
                              window.speechSynthesis.speak(utterance);
                            } else {
                              alert(`Voice Copilot (0.80x): Item ${currentItem.id} - ${currentItem.instruction}`);
                            }
                          }}
                          className="px-3 py-1 bg-slate-900 hover:bg-slate-800 text-slate-300 hover:text-white rounded-lg text-xs font-mono flex items-center gap-1.5 transition border border-slate-800 shrink-0"
                        >
                          <Volume2 className="w-3.5 h-3.5 text-blue-400" /> Listen (0.80x)
                        </button>
                      </div>

                      <p className="text-sm text-slate-300 leading-relaxed">
                        {currentItem.instruction}
                      </p>

                      <div className="flex flex-col sm:flex-row gap-3 pt-3">
                        <button
                          onClick={() => {
                            if (walkaroundStep < dvsaChecklist.length) {
                              setWalkaroundStep(walkaroundStep + 1);
                            } else {
                              setIsCheckComplete(true);
                            }
                          }}
                          className="flex-1 py-3 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black text-xs font-mono rounded-xl transition flex items-center justify-center gap-2 shadow-lg shadow-emerald-500/20"
                        >
                          <CheckCircle2 className="w-4 h-4" /> PASSED (NO DEFECT)
                        </button>
                        <button
                          onClick={() => {
                            setDefectsLogged(defectsLogged + 1);
                            alert(`Defect logged for Item ${currentItem.id} (${currentItem.title}). Captured and queued for Transport Manager triage.`);
                            if (walkaroundStep < dvsaChecklist.length) {
                              setWalkaroundStep(walkaroundStep + 1);
                            } else {
                              setIsCheckComplete(true);
                            }
                          }}
                          className="py-3 px-6 bg-red-600/20 hover:bg-red-600/30 text-red-400 border border-red-500/40 font-bold text-xs font-mono rounded-xl transition flex items-center justify-center gap-2"
                        >
                          <Camera className="w-4 h-4" /> LOG DEFECT
                        </button>
                      </div>
                    </div>
                  );
                })()}

                <div className="flex items-center justify-between text-[11px] font-mono text-slate-500">
                  <span>15-Month DVSA Compliance Archive: Active</span>
                  <span>Certificate #DVSA-2026-88219</span>
                </div>
              </div>
            ) : (
              <div className="bg-slate-900 border border-emerald-500/40 p-6 rounded-3xl space-y-4 shadow-xl text-center">
                <div className="w-12 h-12 bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 rounded-full flex items-center justify-center mx-auto">
                  <CheckCircle2 className="w-6 h-6" />
                </div>
                <h3 className="text-lg font-black text-white">
                  DVSA Statutory Walkaround Inspection Passed!
                </h3>
                <p className="text-xs text-slate-300 font-mono">
                  Vehicle <strong className="text-amber-400">{vehicleReg}</strong>
                  {hasTrailer && <> & Trailer <strong className="text-cyan-400">{selectedTrailer === 'CUSTOM' ? customTrailer : selectedTrailer}</strong></>} certified fit for UK highway service.
                </p>
                <div className="p-4 bg-slate-950 rounded-2xl border border-slate-800 text-xs font-mono text-left space-y-1.5 max-w-md mx-auto">
                  <div className="flex justify-between"><span>Certificate ID:</span><strong className="text-emerald-400">#DVSA-2026-88219</strong></div>
                  <div className="flex justify-between"><span>Defects Recorded:</span><strong className={defectsLogged > 0 ? "text-amber-400" : "text-emerald-400"}>{defectsLogged} Defect(s)</strong></div>
                  <div className="flex justify-between"><span>Status:</span><strong className="text-emerald-400">Signed & Archived (15 Months)</strong></div>
                </div>
                <button
                  onClick={() => {
                    setCheckStarted(false);
                    setIsCheckComplete(false);
                  }}
                  className="px-6 py-2.5 bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs rounded-xl transition"
                >
                  Start New Inspection
                </button>
              </div>
            )}
          </div>
        )}

        {/* TAB 2: ROUTE & PLACES */}
        {activeTab === 'route' && (
          <div className="space-y-6">
            <div className="bg-slate-900 border border-slate-800 p-6 rounded-3xl space-y-4 shadow-xl">
              <h2 className="text-base font-black text-white flex items-center gap-2">
                <MapPin className="w-5 h-5 text-blue-400" /> Commercial Route Builder & Google Places
              </h2>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={destinationQuery}
                  onChange={(e) => setDestinationQuery(e.target.value)}
                  className="flex-1 bg-slate-950 border border-slate-700 rounded-xl px-4 py-2.5 text-xs font-mono text-white focus:outline-none focus:border-blue-500"
                />
                <button className="px-4 py-2.5 bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs rounded-xl transition">
                  Confirm Pin
                </button>
              </div>

              {/* Waypoints */}
              <div className="space-y-2">
                <label className="text-xs font-mono text-slate-400">Current Tour Waypoints:</label>
                {waypoints.map((wp, idx) => (
                  <div key={idx} className="p-3 bg-slate-950 rounded-xl border border-slate-800 text-xs font-mono flex items-center justify-between">
                    <span>Stop #{idx + 1}: {wp}</span>
                    <span className="text-emerald-400 font-bold">Planned</span>
                  </div>
                ))}
                <div className="flex gap-2 pt-1">
                  <input
                    type="text"
                    value={newStop}
                    onChange={(e) => setNewStop(e.target.value)}
                    placeholder="+ Add Stop / Drop Point"
                    className="flex-1 bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs font-mono text-white"
                  />
                  <button
                    onClick={() => {
                      if (newStop) {
                        setWaypoints([...waypoints, newStop]);
                        setNewStop('');
                      }
                    }}
                    className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs rounded-xl"
                  >
                    Add Stop
                  </button>
                </div>
              </div>

              {/* Site Assessment Review */}
              <div className="p-4 bg-slate-950 rounded-2xl border border-slate-800 space-y-3">
                <div className="flex items-center justify-between">
                  <h4 className="text-xs font-bold font-mono text-amber-400">DIRFT Depot Site Assessment & Ingress</h4>
                  <span className="text-[10px] font-mono bg-emerald-500/20 text-emerald-400 px-2 py-0.5 rounded font-bold">GATE BARRIER VERIFIED</span>
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-[11px] font-mono">
                  <div className="p-2 bg-slate-900 rounded-lg"><span>Gate PIN:</span> <strong className="text-white block">8492</strong></div>
                  <div className="p-2 bg-slate-900 rounded-lg"><span>Bay Allocation:</span> <strong className="text-cyan-400 block">BAY #24</strong></div>
                  <div className="p-2 bg-slate-900 rounded-lg"><span>Turn Type:</span> <strong className="text-white block">Left-Side Blindside</strong></div>
                  <div className="p-2 bg-slate-900 rounded-lg"><span>Welfare Score:</span> <strong className="text-emerald-400 block">4.8 / 5.0 (Showers)</strong></div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 3: EN-ROUTE SAFETY */}
        {activeTab === 'enroute' && (
          <div className="space-y-6">
            <div className="bg-slate-900 border border-amber-500/40 p-6 rounded-3xl space-y-4 shadow-xl">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-base font-black text-white flex items-center gap-2">
                    <ShieldAlert className="w-5 h-5 text-amber-400" />
                    Watford Low Railway Bridge Collision Shield
                  </h2>
                  <p className="text-xs text-slate-400 font-mono">Bridge Ref: WCML-WAT-049 • Distance: 0.8 Miles Ahead</p>
                </div>
                <span className="px-3 py-1 bg-amber-500/20 text-amber-400 border border-amber-500/40 text-xs font-mono font-bold rounded-full animate-pulse">
                  LOW CLEARANCE
                </span>
              </div>
              <div className="p-4 bg-slate-950 rounded-2xl border border-slate-800 text-xs font-mono text-slate-300 space-y-2">
                <div className="flex justify-between"><span>Bridge Clearance:</span><strong className="text-red-400">4.10m (13ft 5in)</strong></div>
                <div className="flex justify-between"><span>Your Vehicle Height:</span><strong className="text-amber-400">4.45m (14ft 7in)</strong></div>
                <div className="flex justify-between"><span>Collision Verdict:</span><strong className="text-red-500 font-black">CRITICAL STRIKE HAZARD — STOP IMMEDIATELY</strong></div>
              </div>
              <div className="flex flex-col sm:flex-row gap-3">
                <button
                  onClick={() => alert('Air Suspension Dump Activated: Dropped cab and trailer chassis by 120mm.')}
                  className="flex-1 py-3 bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-xs font-mono rounded-xl transition"
                >
                  Dump Air Suspension (-120mm)
                </button>
                <a
                  href="tel:03457114141"
                  className="py-3 px-6 bg-red-600 hover:bg-red-500 text-white font-bold text-xs font-mono rounded-xl text-center transition flex items-center justify-center gap-2"
                >
                  <PhoneCall className="w-4 h-4" /> Network Rail Hotline
                </a>
              </div>
            </div>
          </div>
        )}

        {/* TAB 4: DEPOT & EPOD */}
        {activeTab === 'depot' && (
          <div className="space-y-6">
            <div className="bg-slate-900 border border-slate-800 p-6 rounded-3xl space-y-4 shadow-xl">
              <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                <h2 className="text-base font-black text-white flex items-center gap-2">
                  <PoundSterling className="w-5 h-5 text-emerald-400" /> Live Demurrage Detention Engine
                </h2>
                <span className="text-xs font-mono font-bold bg-amber-500/20 text-amber-400 border border-amber-500/40 px-3 py-1 rounded-full">
                  £45.00 / Hour
                </span>
              </div>
              <div className="p-4 bg-slate-950 rounded-2xl border border-slate-800 text-xs font-mono space-y-2">
                <div className="flex justify-between"><span>Depot Ingress Timestamp:</span><strong className="text-white">13:20 BST (Verified by Geofence)</strong></div>
                <div className="flex justify-between"><span>Free-Time Allowance:</span><strong className="text-slate-400">60 Minutes</strong></div>
                <div className="flex justify-between"><span>Current Dwell:</span><strong className="text-amber-400">{demurrageMinutes} Minutes</strong></div>
                <div className="flex justify-between border-t border-slate-800 pt-2">
                  <span>Accrued Demurrage Payable:</span>
                  <strong className="text-emerald-400 font-black text-sm">£10.50 (+ £45/hr ongoing)</strong>
                </div>
              </div>
              <button
                onClick={() => alert('Generated Demurrage Voucher PDF. Attached to Consignment CMR-88291.')}
                className="w-full py-3 bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs font-mono rounded-xl transition"
              >
                Export Demurrage Detention Claim Voucher (PDF)
              </button>
            </div>
          </div>
        )}

        {/* TAB 5: TACHO & WELFARE */}
        {activeTab === 'tacho' && (
          <div className="space-y-6">
            <div className="bg-slate-900 border border-slate-800 p-6 rounded-3xl space-y-4 shadow-xl">
              <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                <h2 className="text-base font-black text-white flex items-center gap-2">
                  <Clock className="w-5 h-5 text-cyan-400" /> Dual Tachograph Ingestion (.DDD & Printout)
                </h2>
                <span className="text-xs font-mono font-bold bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 px-3 py-1 rounded-full">
                  SMART TACHO 2
                </span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <button
                  onClick={() => alert('Launching Tachograph OCR Camera Scanner...')}
                  className="p-5 bg-slate-950 hover:bg-slate-800 border border-slate-800 rounded-2xl text-left space-y-2 transition"
                >
                  <Camera className="w-6 h-6 text-blue-400" />
                  <h4 className="text-xs font-bold text-white">Option 1: Camera Slip OCR</h4>
                  <p className="text-[11px] text-slate-400">Scan daily driver printout to parse 4.5h driving blocks and WTD infringements.</p>
                </button>
                <button
                  onClick={() => alert('Reading USB / OTG .DDD Driver Smart Card...')}
                  className="p-5 bg-slate-950 hover:bg-slate-800 border border-slate-800 rounded-2xl text-left space-y-2 transition"
                >
                  <FileText className="w-6 h-6 text-emerald-400" />
                  <h4 className="text-xs font-bold text-white">Option 2: USB / OTG .DDD Reader</h4>
                  <p className="text-[11px] text-slate-400">Direct binary extraction via USB card reader into DVSA statutory compliance archive.</p>
                </button>
              </div>

              {/* HMRC Tax Vault */}
              <div className="p-4 bg-slate-950 rounded-2xl border border-slate-800 space-y-2 text-xs font-mono">
                <div className="flex justify-between items-center">
                  <span className="text-amber-400 font-bold">HMRC Overnight Subsistence Vault</span>
                  <span className="text-emerald-400 font-bold">£34.90 / Night (Tax-Free)</span>
                </div>
                <p className="text-[11px] text-slate-400">YTD Accrued Tax-Free Night Out Claims: <strong className="text-white">£1,465.80</strong> (Auto-prepared for P87 rebate).</p>
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
                  <Sliders className="w-5 h-5 text-amber-400" /> Driver Tools Tile
                </h2>
                <p className="text-xs text-slate-400 font-mono">Specialist In-Cab Safety, Threat Analysis & Diagnostic Instruments</p>
              </div>
              <span className="text-xs font-mono font-bold bg-amber-500/20 text-amber-400 border border-amber-500/40 px-3 py-1 rounded-full">
                6 Active Tools
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Tool 1 */}
              <div className="bg-slate-900 border border-slate-800 p-5 rounded-3xl space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Eye className="w-5 h-5 text-emerald-400" />
                    <h3 className="text-sm font-black text-white">Class V/VI Blind Spot Proximity Shield</h3>
                  </div>
                  <span className="text-[10px] font-mono bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 px-2 py-0.5 rounded font-bold">DVS 3-STAR</span>
                </div>
                <p className="text-xs text-slate-400">Direct Vision Standard (DVS) nearside passenger blind spot & front cross-view cyclist radar.</p>
                <div className="p-3 bg-slate-950 rounded-xl border border-slate-800 text-xs font-mono flex items-center justify-between">
                  <span className="text-slate-400">Nearside Cyclist Zone:</span>
                  <span className="text-emerald-400 font-bold">✓ CLEAR (0 in 2.5m zone)</span>
                </div>
              </div>

              {/* Tool 2 */}
              <div className="bg-slate-900 border border-slate-800 p-5 rounded-3xl space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <ShieldAlert className="w-5 h-5 text-red-400" />
                    <h3 className="text-sm font-black text-white">UK Cargo Crime & Curtain-Slash Heatmap</h3>
                  </div>
                  <span className="text-[10px] font-mono bg-red-500/20 text-red-400 border border-red-500/40 px-2 py-0.5 rounded font-bold">LIVE INTEL</span>
                </div>
                <p className="text-xs text-slate-400">NaVCIS freight crime intelligence mapping nocturnal slashing and fuel siphoning risks.</p>
                <div className="p-3 bg-slate-950 rounded-xl border border-slate-800 text-xs font-mono flex items-center justify-between">
                  <span className="text-slate-400">Current Area Threat:</span>
                  <span className="text-red-400 font-bold">M1 / A14 Corridor High Risk</span>
                </div>
              </div>

              {/* Tool 3 */}
              <div className="bg-slate-900 border border-slate-800 p-5 rounded-3xl space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Volume2 className="w-5 h-5 text-blue-400" />
                    <h3 className="text-sm font-black text-white">Quiet Sleep Zone Acoustic Radar</h3>
                  </div>
                  <span className="text-[10px] font-mono bg-blue-500/20 text-blue-400 border border-blue-500/40 px-2 py-0.5 rounded font-bold">46 dBA REST</span>
                </div>
                <p className="text-xs text-slate-400">Monitors ambient decibel pressure for 9h/11h rest. Flags noisy auxiliary diesel reefers.</p>
                <div className="p-3 bg-slate-950 rounded-xl border border-slate-800 text-xs font-mono flex items-center justify-between">
                  <span className="text-slate-400">Reefer Engine Proximity:</span>
                  <span className="text-emerald-400 font-bold">✓ Peaceful (&gt;150m clear)</span>
                </div>
              </div>

              {/* Tool 4 */}
              <div className="bg-slate-900 border border-slate-800 p-5 rounded-3xl space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Mic className="w-5 h-5 text-amber-400" />
                    <h3 className="text-sm font-black text-white">Acoustic Air Leak Radar</h3>
                  </div>
                  <span className="text-[10px] font-mono bg-amber-500/20 text-amber-400 border border-amber-500/40 px-2 py-0.5 rounded font-bold">4-8kHz DSP</span>
                </div>
                <p className="text-xs text-slate-400">Microphone frequency analysis detecting compressed air leaks across suzie coils.</p>
                <div className="p-3 bg-slate-950 rounded-xl border border-slate-800 text-xs font-mono flex items-center justify-between">
                  <span className="text-slate-400">Pneumatic System Status:</span>
                  <span className="text-emerald-400 font-bold">✓ 0.0 PSI Pressure Drop</span>
                </div>
              </div>

              {/* Tool 5 */}
              <div className="bg-slate-900 border border-slate-800 p-5 rounded-3xl space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Truck className="w-5 h-5 text-emerald-400" />
                    <h3 className="text-sm font-black text-white">5th Wheel Coupling & Safety Lock</h3>
                  </div>
                  <span className="text-[10px] font-mono bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 px-2 py-0.5 rounded font-bold">LATCH VERIFIED</span>
                </div>
                <p className="text-xs text-slate-400">Visual confirmation of dog-clip safety pin lock & kingpin jaw engagement.</p>
                <div className="p-3 bg-slate-950 rounded-xl border border-slate-800 text-xs font-mono flex items-center justify-between">
                  <span className="text-slate-400">Dog-Clip Status:</span>
                  <span className="text-emerald-400 font-bold">✓ Engaged & Secured</span>
                </div>
              </div>

              {/* Tool 6 */}
              <div className="bg-slate-900 border border-slate-800 p-5 rounded-3xl space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Camera className="w-5 h-5 text-purple-400" />
                    <h3 className="text-sm font-black text-white">Bay Navigation AR Overlay</h3>
                  </div>
                  <span className="text-[10px] font-mono bg-purple-500/20 text-purple-400 border border-purple-500/40 px-2 py-0.5 rounded font-bold">AR GUIDANCE</span>
                </div>
                <p className="text-xs text-slate-400">Dynamic trajectory guidelines for blindside reversing onto tight distribution bays.</p>
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

      {/* SOS Modal */}
      {showSosModal && (
        <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-red-500/50 p-6 rounded-3xl max-w-lg w-full space-y-4 shadow-2xl">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <ShieldAlert className="w-6 h-6 text-red-500 animate-pulse" />
                <h3 className="text-base font-black text-white">🚨 Emergency Request for Help (SOS)</h3>
              </div>
              <button
                onClick={() => setShowSosModal(false)}
                className="text-slate-400 hover:text-white text-xs font-mono"
              >
                ✕ Close
              </button>
            </div>
            <p className="text-xs text-slate-300">
              Select distress channel. Broadcasts unit <strong className="text-amber-400">{vehicleReg}</strong> GPS coordinates immediately:
            </p>
            <div className="space-y-2">
              <button onClick={() => alert('Recovery dispatched.')} className="w-full p-3 bg-slate-950 hover:bg-slate-800 border border-slate-800 rounded-xl text-left text-xs font-bold text-white flex items-center justify-between">
                <span>1. Mechanical Breakdown & Tyre Blowout (24/7)</span> <ChevronRight className="w-4 h-4 text-slate-500" />
              </button>
              <button onClick={() => alert('Cargo Crime Alarm raised.')} className="w-full p-3 bg-red-950/30 hover:bg-red-950/50 border border-red-500/30 rounded-xl text-left text-xs font-bold text-red-300 flex items-center justify-between">
                <span>2. Cargo Crime & Layby Fuel Theft Threat</span> <ChevronRight className="w-4 h-4 text-red-400" />
              </button>
              <button onClick={() => alert('Low Bridge Extraction dispatched.')} className="w-full p-3 bg-amber-950/30 hover:bg-amber-950/50 border border-amber-500/30 rounded-xl text-left text-xs font-bold text-amber-300 flex items-center justify-between">
                <span>3. Low-Bridge Proximity / Stuck Extraction Escort</span> <ChevronRight className="w-4 h-4 text-amber-400" />
              </button>
              <button onClick={() => alert('Welfare refusal logged.')} className="w-full p-3 bg-slate-950 hover:bg-slate-800 border border-slate-800 rounded-xl text-left text-xs font-bold text-white flex items-center justify-between">
                <span>4. Depot Welfare Refusal (HSE Reg 20 Violation)</span> <ChevronRight className="w-4 h-4 text-slate-500" />
              </button>
              <button onClick={() => alert('5-Mile CB Radio Distress broadcast.')} className="w-full p-3 bg-cyan-950/30 hover:bg-cyan-950/50 border border-cyan-500/30 rounded-xl text-left text-xs font-bold text-cyan-300 flex items-center justify-between">
                <span>5. 5-Mile Digital CB Emergency Audio Beacon</span> <ChevronRight className="w-4 h-4 text-cyan-400" />
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
"""

with open("src/app/driver/page.tsx", "w") as f:
    f.write(driver_code)
print("✓ Updated src/app/driver/page.tsx with Vehicle Check, Trailer DB & Driver Tools!")
