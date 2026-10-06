'use client';
import React, { useState } from 'react';
import {
  X,
  Truck,
  Repeat,
  Radio,
  FileCheck,
  CreditCard,
  MapPin,
  Clock,
  ShieldCheck,
  CheckCircle2,
  DollarSign,
  ArrowRight,
  ExternalLink,
  Download,
  Send,
  Building2,
  Users,
  Search,
  Check,
  Sliders,
  AlertCircle
} from 'lucide-react';

interface HxFreightWorkflowModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const HxFreightWorkflowModal: React.FC<HxFreightWorkflowModalProps> = ({
  isOpen,
  onClose
}) => {
  const [activeStep, setActiveStep] = useState<number>(1);
  const [fleetType, setFleetType] = useState<'HGV_FREIGHT' | 'CX_COURIER_VAN'>('HGV_FREIGHT');
  const [sampleQuote, setSampleQuote] = useState<number>(650);
  const [smartMatchingActive, setSmartMatchingActive] = useState<boolean>(true);
  const [bookingConfirmed, setBookingConfirmed] = useState<boolean>(false);
  const [podCaptured, setPodCaptured] = useState<boolean>(false);
  const [invoicePaired, setInvoicePaired] = useState<boolean>(false);

  if (!isOpen) return null;

  const STEPS = [
    {
      step: 1,
      title: '1. Load Posting / Broadcast',
      sub: 'Post overflow load or broadcast empty truck via Smart Matching',
      tag: 'POSTER / HAULIER'
    },
    {
      step: 2,
      title: '2. Quoting & Negotiation',
      sub: 'Private quotes, carrier vetting, feedback score & insurance limits',
      tag: 'PRIVATE QUOTING'
    },
    {
      step: 3,
      title: '3. Booking Confirmation',
      sub: 'Electronic booking locking price, postcodes, refs & RHA detention rules',
      tag: 'DISPATCH CONTRACT'
    },
    {
      step: 4,
      title: '4. In-Transit Telematics',
      sub: 'Live GPS tracking & automated site arrival / departure milestone alerts',
      tag: 'GPS TRACKING'
    },
    {
      step: 5,
      title: '5. e-POD Capture',
      sub: 'Screen signature or photo docket uploaded instantly to traffic desk',
      tag: 'PROOF OF DELIVERY'
    },
    {
      step: 6,
      title: '6. Invoicing & Settlement',
      sub: 'Direct member-to-member billing with paired e-POD & accounting export',
      tag: 'FINANCIAL SETTLEMENT'
    }
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-slate-950/85 backdrop-blur-md overflow-y-auto">
      <div className="relative w-full max-w-4xl bg-slate-900 border border-slate-800 rounded-3xl shadow-2xl p-5 sm:p-7 text-slate-100 max-h-[92vh] overflow-y-auto space-y-6">
        
        {/* Header */}
        <div className="flex items-start justify-between pb-4 border-b border-slate-800">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-cyan-500 to-blue-600 text-slate-950 flex items-center justify-center shadow-lg shadow-cyan-500/20 font-black">
              HX
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-lg sm:text-xl font-extrabold text-white">
                  Haulage Exchange (HX) &amp; Returnloads Platform Workflow
                </h2>
                <span className="rounded-md bg-cyan-500/20 px-2 py-0.5 text-[10px] font-mono font-bold text-cyan-300 border border-cyan-500/30">
                  TEG Standard
                </span>
              </div>
              <p className="text-xs text-slate-400 mt-0.5">
                High-density member-to-member freight trading, closed vetting &amp; direct financial settlement (Zero Escrow Middleman)
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-9 h-9 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white flex items-center justify-center transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Unified Login Ecosystem Toggle: HGV Freight vs Courier Exchange (CX) Van */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 p-3 rounded-2xl bg-slate-950/70 border border-slate-800">
          <div className="flex items-center gap-2 text-xs">
            <span className="font-bold text-slate-300">Unified TEG Ecosystem:</span>
            <span className="text-slate-400">Switch mode without changing login credentials</span>
          </div>
          <div className="flex items-center rounded-xl bg-slate-900 p-1 border border-slate-800">
            <button
              onClick={() => setFleetType('HGV_FREIGHT')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                fleetType === 'HGV_FREIGHT'
                  ? 'bg-cyan-500 text-slate-950 shadow-md font-extrabold'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <Truck className="w-3.5 h-3.5" />
              <span>Haulage Exchange (7.5t – 44t)</span>
            </button>
            <button
              onClick={() => setFleetType('CX_COURIER_VAN')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                fleetType === 'CX_COURIER_VAN'
                  ? 'bg-amber-500 text-slate-950 shadow-md font-extrabold'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <Repeat className="w-3.5 h-3.5" />
              <span>Courier Exchange (Same-Day Van)</span>
            </button>
          </div>
        </div>

        {/* 6-Stage Interactive Stepper Bar */}
        <div className="grid grid-cols-2 md:grid-cols-6 gap-2">
          {STEPS.map((s) => (
            <button
              key={s.step}
              onClick={() => setActiveStep(s.step)}
              className={`p-3 rounded-2xl text-left border transition-all flex flex-col justify-between ${
                activeStep === s.step
                  ? 'bg-cyan-950/50 border-cyan-500 text-white shadow-lg shadow-cyan-500/10'
                  : 'bg-slate-950/50 border-slate-800/80 text-slate-400 hover:border-slate-700'
              }`}
            >
              <div className="flex items-center justify-between">
                <span className={`text-[10px] font-mono font-black px-1.5 py-0.5 rounded ${
                  activeStep === s.step ? 'bg-cyan-500 text-slate-950' : 'bg-slate-800 text-slate-300'
                }`}>
                  STEP {s.step}
                </span>
                <span className="text-[9px] font-bold text-slate-500 uppercase">{s.tag}</span>
              </div>
              <div className="font-bold text-xs mt-2 text-slate-200 line-clamp-1">{s.title}</div>
            </button>
          ))}
        </div>

        {/* Step-by-Step Interactive Details Container */}
        <div className="rounded-2xl border border-slate-800 bg-slate-950/80 p-5 space-y-4">
          
          {/* STEP 1 */}
          {activeStep === 1 && (
            <div className="space-y-4 animate-in fade-in duration-200">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-bold text-white flex items-center gap-2">
                    <Radio className="w-4 h-4 text-cyan-400" />
                    Step 1: Load Posting or Availability Broadcasting
                  </h3>
                  <p className="text-xs text-slate-400">
                    Choose between open board overflow auction or instant "Smart Matching" GPS broadcast.
                  </p>
                </div>
                <span className="text-xs font-mono px-2 py-1 rounded bg-cyan-500/20 text-cyan-300 border border-cyan-500/30">
                  {fleetType === 'HGV_FREIGHT' ? '44T CURTAIN-SIDER' : 'LUTON VAN / TAIL-LIFT'}
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-2">
                {/* Method A: Poster Load Listing */}
                <div className="p-4 rounded-xl border border-slate-800 bg-slate-900/90 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-extrabold text-cyan-300">Method A: Post Overflow Load</span>
                    <span className="text-[10px] bg-slate-800 text-slate-300 px-2 py-0.5 rounded">Forwarder / 3PL</span>
                  </div>
                  <p className="text-xs text-slate-300 leading-relaxed">
                    Specify vehicle specs (44t curtain-sider, box trailer, tail-lift required), collection/drop-off windows, cargo tonnage, and standard terms.
                  </p>
                  <div className="rounded-lg bg-slate-950 p-2.5 font-mono text-[11px] text-slate-300 space-y-1 border border-slate-800">
                    <div>Route: <span className="text-emerald-400">NN6 (Crick) ➔ M25 (Dartford)</span></div>
                    <div>Payload: 26 Pallets (Full Truckload • 24.5t)</div>
                    <div>Terms: RHA Conditions (2h Free-Time, £60/hr Demurrage)</div>
                  </div>
                </div>

                {/* Method B: Haulier Smart Matching */}
                <div className="p-4 rounded-xl border border-cyan-500/40 bg-cyan-950/20 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-extrabold text-cyan-300">Method B: Live Smart Matching</span>
                    <span className="text-[10px] bg-emerald-500/20 text-emerald-300 px-2 py-0.5 rounded font-bold">GPS Live</span>
                  </div>
                  <p className="text-xs text-slate-300 leading-relaxed">
                    Advertise truck as "Empty" or "Available Soon" with live GPS location. Shippers search the live map and use <strong>Book Direct</strong>.
                  </p>
                  <div className="flex items-center justify-between pt-1">
                    <span className="text-xs text-slate-300">Status: {smartMatchingActive ? 'Broadcasting to 15,000+ members' : 'Offline'}</span>
                    <button
                      onClick={() => setSmartMatchingActive(!smartMatchingActive)}
                      className="px-3 py-1 rounded-lg text-xs font-bold bg-cyan-500 text-slate-950 hover:bg-cyan-400 transition-all"
                    >
                      {smartMatchingActive ? 'Disable Broadcast' : 'Go Live Now'}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* STEP 2 */}
          {activeStep === 2 && (
            <div className="space-y-4 animate-in fade-in duration-200">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-bold text-white flex items-center gap-2">
                    <DollarSign className="w-4 h-4 text-emerald-400" />
                    Step 2: Quoting &amp; Private Negotiation
                  </h3>
                  <p className="text-xs text-slate-400">
                    Review incoming private bids against carrier feedback ratings, verified O-licences, and insurance limits.
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-3 pt-2">
                <div className="p-3.5 rounded-xl border border-slate-800 bg-slate-900/90 space-y-2">
                  <span className="text-xs font-bold text-slate-400">Quote Input Simulation</span>
                  <div className="flex items-center gap-2">
                    <span className="text-base font-black text-white">£</span>
                    <input
                      type="number"
                      value={sampleQuote}
                      onChange={(e) => setSampleQuote(Number(e.target.value))}
                      className="w-full rounded-lg bg-slate-950 border border-slate-700 px-3 py-1.5 text-sm font-bold text-emerald-400 focus:outline-none"
                    />
                  </div>
                  <p className="text-[11px] text-slate-400">Lane: Northampton to Bristol (118 miles @ £{(sampleQuote / 118).toFixed(2)}/mi)</p>
                </div>

                <div className="p-3.5 rounded-xl border border-slate-800 bg-slate-900/90 space-y-2 col-span-2">
                  <span className="text-xs font-bold text-slate-400">Poster Review Panel</span>
                  <div className="grid grid-cols-3 gap-2 text-center text-xs">
                    <div className="p-2 rounded-lg bg-slate-950 border border-slate-800">
                      <div className="text-[10px] text-slate-400">Member Rating</div>
                      <div className="text-emerald-400 font-extrabold text-sm">98.4% (480 drops)</div>
                    </div>
                    <div className="p-2 rounded-lg bg-slate-950 border border-slate-800">
                      <div className="text-[10px] text-slate-400">Goods in Transit</div>
                      <div className="text-cyan-300 font-extrabold text-sm">£50,000 Verified</div>
                    </div>
                    <div className="p-2 rounded-lg bg-slate-950 border border-slate-800">
                      <div className="text-[10px] text-slate-400">Accreditations</div>
                      <div className="text-amber-400 font-extrabold text-sm">FORS Silver • RHA</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* STEP 3 */}
          {activeStep === 3 && (
            <div className="space-y-4 animate-in fade-in duration-200">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-bold text-white flex items-center gap-2">
                    <FileCheck className="w-4 h-4 text-cyan-400" />
                    Step 3: Dispatch &amp; Electronic Booking Confirmation
                  </h3>
                  <p className="text-xs text-slate-400">
                    Automated binding confirmation locking price, postcodes, references, and detention terms.
                  </p>
                </div>
                <button
                  onClick={() => setBookingConfirmed(true)}
                  className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all ${
                    bookingConfirmed ? 'bg-emerald-500 text-slate-950 font-black' : 'bg-cyan-500 text-slate-950 hover:bg-cyan-400'
                  }`}
                >
                  {bookingConfirmed ? '✓ Booking Locked' : 'Generate Confirmation'}
                </button>
              </div>

              <div className="p-4 rounded-xl border border-slate-800 bg-slate-900/90 space-y-2 text-xs font-mono">
                <div className="flex justify-between border-b border-slate-800 pb-2">
                  <span className="text-slate-400">ELECTRONIC RATE CONFIRMATION</span>
                  <span className="text-cyan-400 font-bold">REF: HX-CONF-2026-7819</span>
                </div>
                <div className="grid grid-cols-2 gap-3 pt-1">
                  <div>Poster: <strong className="text-white">Apex Freight Solutions Ltd</strong></div>
                  <div>Carrier: <strong className="text-white">Express Midlands Transport</strong></div>
                  <div>Agreed Price: <strong className="text-emerald-400">£{sampleQuote}.00 + VAT</strong></div>
                  <div>Payment Terms: <strong className="text-white">30 Days End of Month</strong></div>
                </div>
                <div className="p-2.5 rounded-lg bg-amber-500/10 border border-amber-500/30 text-[11px] text-amber-200 mt-2 font-sans">
                  <strong>Detention Clause:</strong> All carriage subject to RHA Conditions of Carriage. 2 hours free-time at collection/delivery; waiting time thereafter charged at £60.00 + VAT / hour in 15-minute increments.
                </div>
              </div>
            </div>
          )}

          {/* STEP 4 */}
          {activeStep === 4 && (
            <div className="space-y-4 animate-in fade-in duration-200">
              <div>
                <h3 className="text-sm font-bold text-white flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-emerald-400" />
                  Step 4: In-Transit Telematics &amp; Milestone Alerts
                </h3>
                <p className="text-xs text-slate-400">
                  Driver mobile app streams GPS location back to poster dashboard with automated status updates.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-4 gap-2 pt-1 text-xs">
                {[
                  { label: 'Within 1 Mile', status: 'COMPLETED', time: '08:42' },
                  { label: 'Arrived on Site', status: 'COMPLETED', time: '08:58' },
                  { label: 'Loaded / Departing', status: 'ACTIVE', time: '10:15' },
                  { label: 'Delivered', status: 'PENDING', time: 'Est 12:45' }
                ].map((m, idx) => (
                  <div key={idx} className="p-3 rounded-xl border border-slate-800 bg-slate-900/90 space-y-1">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-bold text-slate-400 font-mono">{m.time}</span>
                      <span className={`text-[9px] font-bold px-1.5 py-0.2 rounded ${
                        m.status === 'COMPLETED' ? 'bg-emerald-500/20 text-emerald-300' :
                        m.status === 'ACTIVE' ? 'bg-cyan-500/20 text-cyan-300 animate-pulse' : 'bg-slate-800 text-slate-400'
                      }`}>
                        {m.status}
                      </span>
                    </div>
                    <div className="font-bold text-slate-200">{m.label}</div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* STEP 5 */}
          {activeStep === 5 && (
            <div className="space-y-4 animate-in fade-in duration-200">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-bold text-white flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-cyan-400" />
                    Step 5: Delivery Sign-Off (e-POD Capture)
                  </h3>
                  <p className="text-xs text-slate-400">
                    Receiver signs directly on mobile screen or driver snaps photo of physically stamped docket.
                  </p>
                </div>
                <button
                  onClick={() => setPodCaptured(true)}
                  className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all ${
                    podCaptured ? 'bg-emerald-500 text-slate-950 font-black' : 'bg-cyan-500 text-slate-950 hover:bg-cyan-400'
                  }`}
                >
                  {podCaptured ? '✓ e-POD Uploaded' : 'Capture Sample e-POD'}
                </button>
              </div>

              <div className="p-4 rounded-xl border border-slate-800 bg-slate-900/90 flex flex-col sm:flex-row items-center justify-between gap-4">
                <div className="space-y-1">
                  <div className="text-xs font-bold text-white">Consignee Sign-Off: J. Henderson (Dock Master)</div>
                  <div className="text-[11px] text-slate-400">Dual Timestamps: Arrived 12:45 • Departed 13:50 (No Demurrage)</div>
                  <div className="text-[10px] text-cyan-400 font-mono">Hash: ePOD-2026-SHA256-49102-DIRFT</div>
                </div>
                <div className="px-4 py-2 rounded-lg bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 text-xs font-bold text-center">
                  Instant Poster Sync: 100% Cleared
                </div>
              </div>
            </div>
          )}

          {/* STEP 6 */}
          {activeStep === 6 && (
            <div className="space-y-4 animate-in fade-in duration-200">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-bold text-white flex items-center gap-2">
                    <CreditCard className="w-4 h-4 text-emerald-400" />
                    Step 6: Invoicing, Member Settlement &amp; Finance Manager
                  </h3>
                  <p className="text-xs text-slate-400">
                    Pair digital e-POD directly with the sales invoice and sync straight to Xero, Sage, or QuickBooks.
                  </p>
                </div>
                <button
                  onClick={() => setInvoicePaired(true)}
                  className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all ${
                    invoicePaired ? 'bg-emerald-500 text-slate-950 font-black' : 'bg-cyan-500 text-slate-950 hover:bg-cyan-400'
                  }`}
                >
                  {invoicePaired ? '✓ Invoiced to Poster' : 'Pair e-POD & Invoice'}
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 pt-1 text-xs">
                <button
                  onClick={() => alert('Exporting billing data to Xero API / CSV...')}
                  className="p-3 rounded-xl border border-slate-800 bg-slate-900/90 hover:border-cyan-500/50 text-left transition-colors"
                >
                  <div className="font-bold text-cyan-400">Export to Xero</div>
                  <div className="text-[10px] text-slate-400 mt-1">Direct ledger sync with attached e-POD PDF</div>
                </button>
                <button
                  onClick={() => alert('Exporting billing data to Sage 50 / Cloud...')}
                  className="p-3 rounded-xl border border-slate-800 bg-slate-900/90 hover:border-emerald-500/50 text-left transition-colors"
                >
                  <div className="font-bold text-emerald-400">Export to Sage</div>
                  <div className="text-[10px] text-slate-400 mt-1">Sales invoice matching 30-day EOM schedule</div>
                </button>
                <button
                  onClick={() => alert('Exporting billing data to QuickBooks Online...')}
                  className="p-3 rounded-xl border border-slate-800 bg-slate-900/90 hover:border-amber-500/50 text-left transition-colors"
                >
                  <div className="font-bold text-amber-400">Export to QuickBooks</div>
                  <div className="text-[10px] text-slate-400 mt-1">Multi-currency &amp; CIS compliance integration</div>
                </button>
              </div>
            </div>
          )}

        </div>

        {/* Subscription Tiers Reference Table */}
        <div className="rounded-2xl border border-slate-800 bg-slate-950/60 p-4 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-extrabold text-white uppercase tracking-wider">
              Haulage Exchange (HX) Core Membership Tiers &amp; Pricing Benchmarks
            </span>
            <span className="text-[10px] text-slate-400">12-Month Annual Contracts (excl. VAT)</span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-300">
              <thead className="bg-slate-900 text-slate-400 font-mono text-[10px] uppercase border-b border-slate-800">
                <tr>
                  <th className="p-2.5">Tier</th>
                  <th className="p-2.5">Fleet Size</th>
                  <th className="p-2.5">Included Users</th>
                  <th className="p-2.5">Market Access</th>
                  <th className="p-2.5">Indicative Price</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60 font-mono text-[11px]">
                <tr>
                  <td className="p-2.5 font-bold text-white">HX Small Fleet</td>
                  <td className="p-2.5">1 – 5 vehicles</td>
                  <td className="p-2.5">3 users</td>
                  <td className="p-2.5">Haulage only (7.5t+)</td>
                  <td className="p-2.5 text-cyan-400 font-bold">~£259.99 / mo</td>
                </tr>
                <tr>
                  <td className="p-2.5 font-bold text-white">HX Med Fleet</td>
                  <td className="p-2.5">6 – 15 vehicles</td>
                  <td className="p-2.5">4 users</td>
                  <td className="p-2.5">Haulage + Courier (CX)</td>
                  <td className="p-2.5 text-cyan-400 font-bold">~£299.99 / mo</td>
                </tr>
                <tr>
                  <td className="p-2.5 font-bold text-white">HX Large Fleet</td>
                  <td className="p-2.5">16 – 50 vehicles</td>
                  <td className="p-2.5">8 users</td>
                  <td className="p-2.5">Haulage + Courier (CX)</td>
                  <td className="p-2.5 text-cyan-400 font-bold">~£549.99 / mo</td>
                </tr>
                <tr>
                  <td className="p-2.5 font-bold text-white">HX Enterprise</td>
                  <td className="p-2.5">50+ vehicles</td>
                  <td className="p-2.5">20+ users</td>
                  <td className="p-2.5">Haulage + Courier (CX)</td>
                  <td className="p-2.5 text-amber-400 font-bold">Bespoke / POA</td>
                </tr>
                <tr className="bg-slate-900/40">
                  <td className="p-2.5 font-bold text-emerald-400">Forwarder Packages</td>
                  <td className="p-2.5">Non-asset / 3PL</td>
                  <td className="p-2.5">1 – 3 users</td>
                  <td className="p-2.5">Posting &amp; Brokering</td>
                  <td className="p-2.5 text-emerald-300 font-bold">£199.99 – £359.99 / mo</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* Footer Navigation */}
        <div className="flex items-center justify-between pt-2">
          <button
            onClick={() => setActiveStep((prev) => Math.max(1, prev - 1))}
            disabled={activeStep === 1}
            className="px-4 py-2 rounded-xl text-xs font-bold bg-slate-800 hover:bg-slate-700 disabled:opacity-40 transition-colors"
          >
            ← Previous Step
          </button>
          <span className="text-xs text-slate-400">Step {activeStep} of 6</span>
          <button
            onClick={() => setActiveStep((prev) => Math.min(6, prev + 1))}
            disabled={activeStep === 6}
            className="px-4 py-2 rounded-xl text-xs font-bold bg-cyan-500 text-slate-950 hover:bg-cyan-400 disabled:opacity-40 transition-colors font-extrabold"
          >
            Next Step →
          </button>
        </div>

      </div>
    </div>
  );
};
