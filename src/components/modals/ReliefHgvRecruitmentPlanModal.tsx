'use client';
import React, { useState } from 'react';
import {
  X,
  Users,
  ShieldCheck,
  CreditCard,
  TrendingUp,
  Cpu,
  Layers,
  ArrowRight,
  CheckCircle2,
  AlertTriangle,
  Clock,
  MapPin,
  Building2,
  DollarSign,
  FileText,
  Lock,
  EyeOff,
  Sparkles,
  Presentation,
  ChevronLeft,
  ChevronRight,
  PieChart,
  HardDrive,
  Truck,
  Database,
  Copy,
  ExternalLink
} from 'lucide-react';

interface ReliefHgvRecruitmentPlanModalProps {
  isOpen: boolean;
  onClose: () => void;
  onOpenTachoScanner?: () => void;
}

export const ReliefHgvRecruitmentPlanModal: React.FC<ReliefHgvRecruitmentPlanModalProps> = ({
  isOpen,
  onClose,
  onOpenTachoScanner
}) => {
  const [activeTab, setActiveTab] = useState<
    'MATCH_ENGINE' | 'MONETIZATION_FINANCE' | 'PRESENTATION_SLIDES' | 'DATABASE_SCHEMA'
  >('MATCH_ENGINE');
  const [currentSlideIndex, setCurrentSlideIndex] = useState(0);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  // Universal Driver profile from on-device registration
  const [universalDriver, setUniversalDriver] = useState<any>(() => {
    try {
      const saved = localStorage.getItem('dp_universal_driver_account_v1');
      if (saved) return JSON.parse(saved);
    } catch (_e) {}
    return null;
  });

  // Match engine interactive simulation state
  const [simCategory, setSimCategory] = useState<'CAT_CE' | 'CAT_C'>('CAT_CE');
  const [simRequireAdr, setSimRequireAdr] = useState(true);
  const [simRatePerHour, setSimRatePerHour] = useState(32);
  const [simModel, setSimModel] = useState<'INSTANT_BROADCAST' | 'CURATED_SHORTLIST'>('INSTANT_BROADCAST');
  const [simInsuranceTier, setSimInsuranceTier] = useState<'ZERO_EXCESS' | 'STANDARD'>('ZERO_EXCESS');
  const [simFactoringSelected, setSimFactoringSelected] = useState(true);
  const [shiftBooked, setShiftBooked] = useState(false);

  if (!isOpen) return null;

  const SLIDES = [
    {
      title: 'RELIEF-HGV & DRIVE PARTNERS',
      subtitle: 'The Unified Freight Labor Marketplace, Compliance SaaS & Fleet Monetization Engine',
      eyebrow: 'Executive Investor & Ecosystem Presentation',
      keyMetrics: [
        { label: 'Pilot Starting Capital', value: '£18,000' },
        { label: 'Month 3 Shift Vol', value: '600 / mo' },
        { label: 'Steady Monthly EBITDA', value: '£22,662' },
        { label: 'EBITDA Margin', value: '71.2%' }
      ],
      points: [
        'UK commercial haulage moves 89% of domestic freight but is crippled by 25–35% agency markups.',
        'High compliance liability: DVLA points, CPC training, 9h/11h tachograph rest rules, and HMRC IR35/SDC tax risk.',
        'Drive Partners delivers zero-agency direct dispatch with native smart card reader .DDD compliance ingestion.'
      ],
      speakerNotes: 'ReliefHGV replaces traditional manual phone-tree agencies with programmatic, location-based dispatch and native hardware compliance verification.'
    },
    {
      title: 'THE PROBLEM (A BROKEN £35B SECTOR)',
      subtitle: 'UK Haulage Is Trapped Between Labor Shortages & Regulatory Gridlock',
      eyebrow: 'Market Inefficiency & Risk',
      keyMetrics: [
        { label: 'UK Freight Moved by Road', value: '89%' },
        { label: 'Typical Agency Markup', value: '25% - 35%' },
        { label: 'Agency Hourly Charge', value: '£36 - £42/h' },
        { label: 'Driver Hourly Pay', value: '£22 - £25/h' }
      ],
      points: [
        'Predatory Agency Markups: Traditional agencies extract up to £15/hr in markups while using slow phone trees at 04:30 AM.',
        'Severe Regulatory Liabilities: Inadvertent WTD infractions and missed 9h/11h rest periods risk the haulier’s O-Licence.',
        'The IR35 & SDC Trap: Unvetted sole trader payments expose transport operators and platforms to retrospective tax fines.'
      ],
      speakerNotes: '89% of domestic freight travels by road. When a driver calls in sick at 04:30 AM, transport managers are forced into slow, extortionate manual agency phone trees.'
    },
    {
      title: 'THE SOLUTION (RELIEF-HGV)',
      subtitle: 'Automated On-Demand Dispatch Backed by Hardware Compliance',
      eyebrow: 'Technology & Legal Architecture',
      keyMetrics: [
        { label: 'Dispatch Speed', value: '< 60 Seconds' },
        { label: 'Commute Boundary', value: '30 Miles / 45 Min' },
        { label: 'Tacho Validation', value: 'Local Chip APDU' },
        { label: 'IR35 Safe-Harbour', value: 'Section 44 ITEPA' }
      ],
      points: [
        'Algorithmic Instant Match: PostGIS spatial queries match shifts in <60 seconds within a 30-mile commute radius.',
        'Hardware Smart Card Reader: Cryptographic .DDD parsing directly on the phone eliminates third-party telematics fees.',
        'FCSA Umbrella Safe-Harbour: Full tax compliance with zero joint liability under Section 44 ITEPA.'
      ],
      speakerNotes: 'We deliver the convenience of an Uber-style marketplace with the ironclad compliance demanded by commercial transport law.'
    },
    {
      title: 'HARDWARE ONBOARDING LOOP',
      subtitle: 'Native APDU .DDD Smart Card Ingestion Replaces Third-Party Telematics',
      eyebrow: 'Proprietary Hardware Advantage',
      keyMetrics: [
        { label: 'Dispatch Fulfillment', value: 'Tracked 24' },
        { label: 'Hardware Cost', value: '£9.50 / unit' },
        { label: 'Protocol', value: 'ISO 7816 / CCID' },
        { label: 'API Subscription Cost', value: '£0 / month' }
      ],
      points: [
        'Upon accepting their 1st shift, drivers are automatically dispatched a Drive Partners USB-C / BLE card reader.',
        'The mobile app directly issues APDU commands over CCID protocols, extracting raw binary .DDD card blocks.',
        'Guarantees 11h continuous daily rest (or 9h reduced), rolling weekly (<56h) & fortnightly (<90h) limits on-chip before wheel movement.',
        'Zero per-call telematics API fees: 100% cryptographic validation done locally.'
      ],
      speakerNotes: 'Instead of trusting driver verbal claims or paying costly telematics monthly fees, we verify the physical smart card cryptographically.'
    },
    {
      title: 'PILOT UNIT ECONOMICS & P&L',
      subtitle: 'Unit Economics of an Average 10-Hour Class 1 Relief Assignment',
      eyebrow: 'High-Margin Contribution',
      keyMetrics: [
        { label: 'Haulier Invoice', value: '£320.00' },
        { label: 'Driver Pass-Through', value: '£275.00' },
        { label: 'Base Take-Rate', value: '£45.00 (14.1%)' },
        { label: 'Contribution Margin', value: '91.0% (£47.01)' }
      ],
      points: [
        '£320.00 gross bill to haulier with £275.00 pass-through to driver umbrella.',
        'Ancillary monetization adds £4.25 insurtech net margin and £2.40 factoring net margin = £51.65 net revenue per shift.',
        'Direct variable costs of sale are just £4.64 (card acquiring, Faster Payments, telemetry), yielding £47.01 net contribution.',
        'At steady state (600 shifts/mo), generates £31,851 net monthly revenue and £22,662 monthly EBITDA.'
      ],
      speakerNotes: 'At steady state with 600 monthly shifts, the platform generates £31,851 in net monthly revenue and £22,662 in monthly EBITDA.'
    },
    {
      title: 'FINANCIAL FLOATS & FRIDAY WEEKLY PAY CYCLE',
      subtitle: 'Industry-Standard Weekly Payroll in Arrears Eliminates Capital Deficits',
      eyebrow: 'Working Capital Efficiency',
      keyMetrics: [
        { label: 'Cash Valley (Trough)', value: '-£133 (W6)' },
        { label: 'Required Capital', value: '£18,000' },
        { label: 'Payroll Cushion', value: '5 to 11 Days' },
        { label: 'Cash Positive By', value: 'Week 7' }
      ],
      points: [
        'Instant/daily pay models require £60k+ in equity float to survive week 7 cash troughs.',
        'ReliefHGV runs standard UK industry payroll: worked Monday–Sunday, paid the following Friday.',
        '80% of hauliers settle via 7-day card auto-debit (inflows arrive Monday–Wednesday, funding Friday driver payroll).',
        '20% of hauliers opt for 30-day factored credit, funded via embedded non-recourse credit lines.'
      ],
      speakerNotes: 'By aligning haulier receivables with Friday disbursements, the entire 100-driver pilot is fully funded with just £18,000 in capital.'
    },
    {
      title: '7 REVENUE STREAMS & MONETIZATION ENGINES',
      subtitle: 'Transforming Labor Data into Multi-Sided Recurring High-Margin Cash Flow',
      eyebrow: 'Commercial Architecture',
      keyMetrics: [
        { label: 'Labor Base Take-Rate', value: '14.1% (£45)' },
        { label: 'Insurtech Gap Margin', value: '50% (£4.25)' },
        { label: 'Factoring Arbitrage', value: '2.5% (+£3.20)' },
        { label: 'Fleet SaaS Net', value: '£3.60 / driver' }
      ],
      points: [
        '1. Core Labor Marketplace: 14.1% net take-rate (£45/shift).',
        '2. Insurtech £0-Excess Gap Protection: £8.50/shift (£4.25 net platform margin).',
        '3. Embedded Factoring: Net-30 terms with 2.5% financing arbitrage (£3.20/shift net).',
        '4. Fleet Tacho Compliance SaaS: Remote audit for haulier fleets (£4.00/driver/mo).',
        '5. Driver Lifecycle Affiliates: JAUPT CPC course booking (£15) & D4 medical concierge (£12).',
        '6. Co-Branded Fuel Cards: Trailing 0.75p–1.25p per litre pumped across active fleets.',
        '7. Enterprise Labor Rate Index: Anonymized wage benchmark subscriptions (£5,000/yr).'
      ],
      speakerNotes: 'We monetize both the supply and demand side across compliance, fintech, insurance, and enterprise data.'
    },
    {
      title: 'IR35 TAX INSULATION & PLATFORM SECURITY',
      subtitle: 'Statutory SDC Safe-Harbour & Defense Against Automated Data Scraping',
      eyebrow: 'Legal & IP Defense',
      keyMetrics: [
        { label: 'IR35 Default', value: 'Inside IR35' },
        { label: 'EOR Model', value: 'FCSA Umbrella' },
        { label: 'Rate Limiter', value: '30 req / min' },
        { label: 'Honeypot Decoys', value: 'Canary Alerts' }
      ],
      points: [
        'All shifts default to Inside IR35: Relief drivers operate haulier rigs under Supervision, Direction, or Control (SDC).',
        'Gross assignment fees route to FCSA-accredited Umbrella partners who operate PAYE & NICs, shielding hauliers.',
        'Anti-Scraping WAF & Redis sliding window limiters block headless scrapers (Puppeteer/Playwright).',
        'Synthetic canary records in database trigger automated IP ban & alert webhooks if scraped.',
        'Dynamic server-side watermarking on all generated PDF timesheets and certifications.'
      ],
      speakerNotes: 'We completely eliminate joint tax liability under Section 44 ITEPA while defending our proprietary driver database.'
    },
    {
      title: '12-MONTH SCALING ROADMAP',
      subtitle: 'Phased Expansion Across UK High-Density Logistics Corridors',
      eyebrow: 'Growth Strategy',
      keyMetrics: [
        { label: 'Phase 1 Cluster', value: 'Golden Triangle' },
        { label: 'Phase 2 Scale', value: '400 Drivers / 35 Fleets' },
        { label: 'Phase 3 TMS API', value: 'Enterprise Mandata' },
        { label: 'Year 1 Run-Rate', value: '£270k+ EBITDA' }
      ],
      points: [
        'Phase 1 (Months 1–3): Pilot validation across Northampton, Crick, and Daventry. Prove hardware reliability and Friday rails.',
        'Phase 2 (Months 4–6): Regional expansion across M1/M6 corridors (Birmingham, Manchester, Milton Keynes). Scale to 2,400 shifts/mo.',
        'Phase 3 (Months 7–12): Enterprise TMS connectors (Mandata, Stirling, Microlise), B2B haulier staff sharing, and Labor Rate Index.'
      ],
      speakerNotes: 'We prove unit economics in the dense Golden Triangle before expanding along primary motorway freight corridors.'
    },
    {
      title: 'THE INVESTMENT & PILOT EXECUTION ASK',
      subtitle: 'Capital Efficiency, High Returns & Strategic Logistics Moat',
      eyebrow: 'Investment Highlights',
      keyMetrics: [
        { label: 'Capital Required', value: '£18,000 - £20,000' },
        { label: 'Pre-Launch Sunk', value: '£6,400' },
        { label: 'Working Float', value: '£11,600' },
        { label: 'Payback Period', value: 'Week 8' }
      ],
      points: [
        'Minimal capital outlay: £6,400 in sunk costs (initial 100 readers, legal terms, insurtech binder) + £11,600 working float.',
        'Cash-flow positive in Week 7 with self-funding receivables and zero equity-diluting factoring needed for launch.',
        'Defensible data and hardware moat creates an unassailable ecosystem across UK road freight.'
      ],
      speakerNotes: 'With minimal starting capital, ReliefHGV reaches cash-flow positivity in Week 7 and establishes an unassailable data moat in UK commercial logistics.'
    }
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur-md p-2 sm:p-4 overflow-y-auto animate-in fade-in duration-200">
      <div className="relative w-full max-w-5xl rounded-3xl bg-slate-950 border border-emerald-500/40 text-white shadow-2xl overflow-hidden flex flex-col max-h-[94vh]">
        
        {/* TOP MODAL HEADER */}
        <div className="flex items-center justify-between px-5 py-3.5 border-b border-slate-800 bg-slate-900/90 shrink-0">
          <div className="flex items-center gap-3">
            <div className="h-9 w-9 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center text-slate-950 font-black shadow-md shadow-emerald-500/20">
              <Users className="h-5 w-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-black tracking-wider text-emerald-400 uppercase">
                  Drive Partners • ReliefHGV
                </span>
                <span className="text-[10px] rounded-full bg-emerald-500/20 px-2 py-0.5 font-bold text-emerald-300 border border-emerald-500/30">
                  Automated HGV Recruitment Engine
                </span>
              </div>
              <h3 className="text-sm font-bold text-slate-100">
                On-Demand Dispatch, Hardware Compliance &amp; Multi-Tier Fleet Economics
              </h3>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={onClose}
              className="rounded-xl p-2 text-slate-400 hover:bg-slate-800 hover:text-white transition-colors cursor-pointer"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
        </div>

        {/* TOAST FEEDBACK */}
        {toastMessage && (
          <div className="absolute top-14 right-6 z-50 rounded-2xl bg-emerald-500 text-slate-950 px-4 py-2 text-xs font-black shadow-2xl flex items-center gap-2 animate-in fade-in slide-in-from-top-2">
            <CheckCircle2 className="w-4 h-4" />
            <span>{toastMessage}</span>
          </div>
        )}

        {/* NAVIGATION TABS */}
        <div className="px-5 pt-3 pb-2 border-b border-slate-800 bg-slate-900/40 flex items-center gap-2 overflow-x-auto no-scrollbar">
          {[
            { id: 'MATCH_ENGINE', label: '1. Shift Booking & Match Engine', icon: Cpu },
            { id: 'MONETIZATION_FINANCE', label: '2. 7-Stream Revenue & 12-Week Cash Flow', icon: DollarSign },
            { id: 'PRESENTATION_SLIDES', label: '3. Investor Presentation Deck', icon: Presentation },
            { id: 'DATABASE_SCHEMA', label: '4. PostgreSQL Schema & Google Docs Master', icon: Database }
          ].map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer whitespace-nowrap ${
                  isActive
                    ? 'bg-emerald-500 text-slate-950 font-black shadow-md shadow-emerald-500/20'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* MAIN BODY */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-6">
          
          {/* TAB 1: INTERACTIVE MATCH ENGINE SIMULATION */}
          {activeTab === 'MATCH_ENGINE' && (
            <div className="space-y-6 animate-in fade-in duration-150">
              
              {/* Architecture Blueprint Strip */}
              <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 grid grid-cols-1 sm:grid-cols-4 gap-3 text-xs">
                <div className="space-y-1">
                  <span className="text-[10px] font-mono text-emerald-400 uppercase font-bold block">1. Verification</span>
                  <div className="font-bold text-white">DVLA ADD &amp; DQC API</div>
                  <p className="text-[11px] text-slate-400">Auto-checks Category C+E, points &le;6, active CPC &amp; RTW.</p>
                </div>
                <div className="space-y-1">
                  <span className="text-[10px] font-mono text-cyan-400 uppercase font-bold block">2. Tacho Ingestion</span>
                  <div className="font-bold text-white">Drive Partners Reader</div>
                  <p className="text-[11px] text-slate-400">USB-C smart reader parses raw .DDD chip blocks for 11h rest.</p>
                </div>
                <div className="space-y-1">
                  <span className="text-[10px] font-mono text-amber-400 uppercase font-bold block">3. Dispatch Model</span>
                  <div className="font-bold text-white">Dual Instant / Shortlist</div>
                  <p className="text-[11px] text-slate-400">Atomic Redis lock prevents double booking across 30mi radius.</p>
                </div>
                <div className="space-y-1">
                  <span className="text-[10px] font-mono text-purple-400 uppercase font-bold block">4. Settlement</span>
                  <div className="font-bold text-white">Friday Arrears &amp; IR35</div>
                  <p className="text-[11px] text-slate-400">FCSA umbrella EOR routing eliminates haulier tax liability.</p>
                </div>
              </div>

              {/* Live Shift Booking Creator Simulation */}
              <div className="p-5 rounded-3xl bg-slate-900/90 border border-slate-800 space-y-4">
                <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                  <div>
                    <h4 className="text-base font-bold text-white">Haulier Shift Creator &amp; Algorithmic Matcher</h4>
                    <p className="text-xs text-slate-400">Simulate posting an urgent relief shift in the Golden Triangle (Northampton / Crick)</p>
                  </div>
                  <span className="px-2.5 py-1 rounded-full text-xs font-mono font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                    PostGIS Engine Active
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                  <div>
                    <label className="font-bold text-slate-400 block mb-1">Licence Category Required:</label>
                    <select
                      value={simCategory}
                      onChange={(e) => setSimCategory(e.target.value as any)}
                      className="w-full rounded-xl bg-slate-950 border border-slate-800 p-2.5 text-white font-bold"
                    >
                      <option value="CAT_CE">Class 1 / Cat C+E (Articulated 44t)</option>
                      <option value="CAT_C">Class 2 / Cat C (Rigid 18t-26t)</option>
                    </select>
                  </div>

                  <div>
                    <label className="font-bold text-slate-400 block mb-1">Special Endorsements:</label>
                    <button
                      onClick={() => setSimRequireAdr(!simRequireAdr)}
                      className={`w-full p-2.5 rounded-xl border text-xs font-bold transition-all text-left flex items-center justify-between ${
                        simRequireAdr
                          ? 'bg-amber-500/20 border-amber-500/50 text-amber-300'
                          : 'bg-slate-950 border-slate-800 text-slate-400'
                      }`}
                    >
                      <span>ADR Hazardous Tanks &amp; Packages</span>
                      <span>{simRequireAdr ? 'REQUIRED' : 'STANDARD'}</span>
                    </button>
                  </div>

                  <div>
                    <label className="font-bold text-slate-400 block mb-1">Offered Rate Per Hour:</label>
                    <div className="flex items-center gap-2">
                      <input
                        type="range"
                        min="28"
                        max="42"
                        value={simRatePerHour}
                        onChange={(e) => setSimRatePerHour(Number(e.target.value))}
                        className="flex-1 accent-emerald-500"
                      />
                      <span className="font-mono font-black text-emerald-400 text-sm w-16 text-right">
                        £{simRatePerHour}.00/h
                      </span>
                    </div>
                  </div>
                </div>

                {/* Ancillary Add-ons Toggles */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2 text-xs">
                  <div
                    onClick={() => setSimInsuranceTier(simInsuranceTier === 'ZERO_EXCESS' ? 'STANDARD' : 'ZERO_EXCESS')}
                    className={`p-3.5 rounded-2xl border cursor-pointer transition-all flex items-center justify-between ${
                      simInsuranceTier === 'ZERO_EXCESS'
                        ? 'bg-emerald-950/40 border-emerald-500/50 text-emerald-200'
                        : 'bg-slate-950 border-slate-800 text-slate-400'
                    }`}
                  >
                    <div>
                      <div className="font-bold text-white">Insurtech Shift Excess Protection (£8.50)</div>
                      <div className="text-[11px] text-slate-400 mt-0.5">Reduces haulier vehicle damage excess from £1,500 to £0.</div>
                    </div>
                    <span className="font-mono font-bold text-xs">
                      {simInsuranceTier === 'ZERO_EXCESS' ? 'INCLUDED' : 'OPTED OUT'}
                    </span>
                  </div>

                  <div
                    onClick={() => setSimFactoringSelected(!simFactoringSelected)}
                    className={`p-3.5 rounded-2xl border cursor-pointer transition-all flex items-center justify-between ${
                      simFactoringSelected
                        ? 'bg-blue-950/40 border-blue-500/50 text-blue-200'
                        : 'bg-slate-950 border-slate-800 text-slate-400'
                    }`}
                  >
                    <div>
                      <div className="font-bold text-white">Embedded Net-30 Factoring (2.5% fee)</div>
                      <div className="text-[11px] text-slate-400 mt-0.5">Driver paid Friday in arrears; haulier settles in 30 days.</div>
                    </div>
                    <span className="font-mono font-bold text-xs">
                      {simFactoringSelected ? 'NET-30 ENABLED' : '7-DAY CARD'}
                    </span>
                  </div>
                </div>

                {/* Top Matched Drivers Pool Result */}
                <div className="pt-2">
                  {universalDriver && (
                    <div className="p-3.5 rounded-2xl bg-gradient-to-r from-amber-500/15 via-emerald-500/15 to-slate-900 border-2 border-emerald-500/50 mb-3 flex items-center justify-between shadow-lg shadow-emerald-500/10">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center font-black">
                          ✓
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="font-bold text-white text-xs">{universalDriver.fullName}</span>
                            <span className="text-[10px] font-mono font-bold bg-emerald-500/20 text-emerald-300 px-2 py-0.5 rounded border border-emerald-500/30">
                              Universal Driver Account Active
                            </span>
                          </div>
                          <div className="text-[11px] text-slate-300 mt-0.5">
                            {universalDriver.highestHGVCategory === 'CAT_CE' ? 'Class 1 C+E' : 'Class 2 Rigid'} • {universalDriver.penaltyPoints || 0} DVLA Points • Target Relief Rate: <strong className="text-amber-400">£{universalDriver.reliefHourlyRate || 32}/hr</strong> • Home Depot: {universalDriver.homeDepot || 'DIRFT Daventry'}
                          </div>
                        </div>
                      </div>
                      <div className="text-right">
                        <span className="text-[10px] font-mono font-bold text-emerald-400 bg-emerald-950/80 px-2.5 py-1 rounded-lg border border-emerald-500/40">
                          Relief Pool Registered
                        </span>
                      </div>
                    </div>
                  )}

                  <div className="flex items-center justify-between text-xs text-slate-400 mb-2">
                    <span className="font-bold text-white">Algorithmically Verified Candidates (Within 25 Miles):</span>
                    <span className="font-mono text-emerald-400 font-bold">3 Drivers 100% Compliant</span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    {[
                      {
                        name: 'Marcus Brooks',
                        distance: '8.4 miles away (Crick)',
                        points: '0 points (Clean DVLA)',
                        tachoRest: '13h 20m rest recorded',
                        rating: '4.95 ★ (114 shifts)',
                        hardwareStatus: 'Card Reader Active'
                      },
                      {
                        name: 'Sarah Jenkins',
                        distance: '12.1 miles away (Northampton)',
                        points: '3 points (SP30 expired)',
                        tachoRest: '11h 45m rest recorded',
                        rating: '4.98 ★ (89 shifts)',
                        hardwareStatus: 'Card Reader Active'
                      },
                      {
                        name: 'David O’Connor',
                        distance: '16.5 miles away (Rugby)',
                        points: '0 points (Clean DVLA)',
                        tachoRest: '15h 10m rest recorded',
                        rating: '4.91 ★ (62 shifts)',
                        hardwareStatus: 'Card Reader Active'
                      }
                    ].map((driver, i) => (
                      <div key={i} className="p-3.5 rounded-2xl bg-slate-950 border border-slate-800 space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="font-bold text-white text-xs">{driver.name}</span>
                          <span className="text-[10px] font-mono text-emerald-400 font-bold">{driver.rating}</span>
                        </div>
                        <div className="text-[11px] text-slate-400 space-y-0.5">
                          <div className="flex items-center gap-1">
                            <MapPin className="w-3 h-3 text-cyan-400" />
                            <span>{driver.distance}</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <ShieldCheck className="w-3 h-3 text-emerald-400" />
                            <span>{driver.points}</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <Clock className="w-3 h-3 text-amber-400" />
                            <span>{driver.tachoRest}</span>
                          </div>
                        </div>
                        <button
                          onClick={() => setShiftBooked(true)}
                          className="w-full py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-slate-950 font-black text-xs transition-colors cursor-pointer"
                        >
                          Book Driver ({simRatePerHour * 10} Gross)
                        </button>
                      </div>
                    ))}
                  </div>
                </div>

                {shiftBooked && (
                  <div className="p-4 rounded-2xl bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 text-xs font-bold flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                      <span>
                        Shift booked atomically under Redis OCC Lock! Escrow authorized. Driver push notification sent. Self-billing invoice generated.
                      </span>
                    </div>
                    <button onClick={() => setShiftBooked(false)} className="text-white hover:text-emerald-200 text-xs">
                      Reset
                    </button>
                  </div>
                )}
              </div>

            </div>
          )}

          {/* TAB 2: 7-STREAM MONETIZATION & 12-WEEK CASH FLOW */}
          {activeTab === 'MONETIZATION_FINANCE' && (
            <div className="space-y-6 animate-in fade-in duration-150">
              
              {/* 7 Revenue Engines Cards */}
              <div>
                <h4 className="font-bold text-white text-sm mb-3">7 Core Monetization Engines Built on Driver Dataset</h4>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                  <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 space-y-1.5">
                    <span className="text-[10px] font-mono text-emerald-400 font-bold block uppercase">Engine 1</span>
                    <h5 className="font-bold text-white">Labor Marketplace (14.1%)</h5>
                    <p className="text-slate-400 text-[11px] leading-relaxed">
                      £320 charge rate vs £275 driver assignment pay. £45.00 net margin per completed 10h relief shift.
                    </p>
                  </div>

                  <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 space-y-1.5">
                    <span className="text-[10px] font-mono text-cyan-400 font-bold block uppercase">Engine 2</span>
                    <h5 className="font-bold text-white">Insurtech Gap Cover</h5>
                    <p className="text-slate-400 text-[11px] leading-relaxed">
                      £8.50 zero-excess protection option at checkout. £4.25 wholesale underwriting cost = £4.25 pure profit per shift.
                    </p>
                  </div>

                  <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 space-y-1.5">
                    <span className="text-[10px] font-mono text-blue-400 font-bold block uppercase">Engine 3</span>
                    <h5 className="font-bold text-white">Embedded Net-30 Factoring</h5>
                    <p className="text-slate-400 text-[11px] leading-relaxed">
                      2.5% finance surcharge (£8.00) minus 1.5% wholesale credit facility fee = £3.20 net financing arbitrage per shift.
                    </p>
                  </div>

                  <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 space-y-1.5">
                    <span className="text-[10px] font-mono text-purple-400 font-bold block uppercase">Engine 4</span>
                    <h5 className="font-bold text-white">Remote Fleet Tacho SaaS</h5>
                    <p className="text-slate-400 text-[11px] leading-relaxed">
                      Hauliers license the card-reader infrastructure to audit their full-time fleets at £4.00/driver/month (£3.60 net margin).
                    </p>
                  </div>

                  <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 space-y-1.5">
                    <span className="text-[10px] font-mono text-amber-400 font-bold block uppercase">Engine 5</span>
                    <h5 className="font-bold text-white">Driver CPC &amp; Medical Affiliates</h5>
                    <p className="text-slate-400 text-[11px] leading-relaxed">
                      Auto-booking expiring CPC hours (£15 commission) &amp; D4 commercial medical renewal concierge (£12 referral fee).
                    </p>
                  </div>

                  <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 space-y-1.5">
                    <span className="text-[10px] font-mono text-teal-400 font-bold block uppercase">Engine 6 &amp; 7</span>
                    <h5 className="font-bold text-white">Fuel Cards &amp; Freight Index</h5>
                    <p className="text-slate-400 text-[11px] leading-relaxed">
                      Trailing 1p/litre fuel card rebate + quarterly enterprise UK Freight Labor Index subscription (£5,000/yr).
                    </p>
                  </div>
                </div>
              </div>

              {/* 12-Week Cash Flow Schedule Table */}
              <div className="rounded-2xl bg-slate-900 border border-slate-800 overflow-hidden text-xs">
                <div className="p-3.5 bg-slate-950/80 border-b border-slate-800 flex items-center justify-between">
                  <div>
                    <h5 className="font-bold text-white">12-Week Pilot Cash Flow Projection (Weekly Friday Pay Model)</h5>
                    <p className="text-[11px] text-slate-400">Starting capital £18,000 • Sunk launch setup £6,400 • Safe-harbour trough at Week 6</p>
                  </div>
                  <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                    Self-Funding from W7
                  </span>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full text-left text-[11px]">
                    <thead className="bg-slate-950 text-slate-400 border-b border-slate-800 font-mono">
                      <tr>
                        <th className="p-2.5">Week</th>
                        <th className="p-2.5">Shifts</th>
                        <th className="p-2.5">Inflow Collected</th>
                        <th className="p-2.5">Payroll Outflow</th>
                        <th className="p-2.5">Fixed OpEx</th>
                        <th className="p-2.5">Net Cash Flow</th>
                        <th className="p-2.5">Closing Cash</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-800/80 font-mono">
                      <tr className="bg-slate-950/40 text-slate-400">
                        <td className="p-2.5 font-bold">Pre-Live</td>
                        <td className="p-2.5">—</td>
                        <td className="p-2.5">£0</td>
                        <td className="p-2.5">£0</td>
                        <td className="p-2.5">(£6,400) [Setup]</td>
                        <td className="p-2.5 text-rose-400">(£6,400)</td>
                        <td className="p-2.5 font-bold text-white">£11,600</td>
                      </tr>
                      <tr>
                        <td className="p-2.5 font-bold text-white">W01</td>
                        <td className="p-2.5">20</td>
                        <td className="p-2.5">£0</td>
                        <td className="p-2.5">£0 (Paid W2)</td>
                        <td className="p-2.5">(£1,561)</td>
                        <td className="p-2.5 text-rose-400">(£1,561)</td>
                        <td className="p-2.5 text-emerald-300">£10,039</td>
                      </tr>
                      <tr>
                        <td className="p-2.5 font-bold text-white">W02</td>
                        <td className="p-2.5">40</td>
                        <td className="p-2.5 text-emerald-400">£5,226</td>
                        <td className="p-2.5 text-rose-400">(£5,593)</td>
                        <td className="p-2.5">(£1,561)</td>
                        <td className="p-2.5 text-rose-400">(£1,928)</td>
                        <td className="p-2.5 text-emerald-300">£8,111</td>
                      </tr>
                      <tr>
                        <td className="p-2.5 font-bold text-white">W04</td>
                        <td className="p-2.5">100</td>
                        <td className="p-2.5 text-emerald-400">£18,292</td>
                        <td className="p-2.5 text-rose-400">(£19,575)</td>
                        <td className="p-2.5">(£1,561)</td>
                        <td className="p-2.5 text-rose-400">(£2,844)</td>
                        <td className="p-2.5 text-emerald-300">£2,973</td>
                      </tr>
                      <tr className="bg-amber-950/20 text-amber-200">
                        <td className="p-2.5 font-bold">W06 (Trough)</td>
                        <td className="p-2.5">135</td>
                        <td className="p-2.5 text-emerald-400">£34,098</td>
                        <td className="p-2.5 text-rose-400">(£33,557)</td>
                        <td className="p-2.5">(£1,561)</td>
                        <td className="p-2.5 text-rose-400">(£1,020)</td>
                        <td className="p-2.5 font-bold text-amber-400">£887 (Buffer safe)</td>
                      </tr>
                      <tr className="bg-emerald-950/20 text-emerald-200">
                        <td className="p-2.5 font-bold">W08</td>
                        <td className="p-2.5">150</td>
                        <td className="p-2.5 text-emerald-400">£45,725</td>
                        <td className="p-2.5 text-rose-400">(£41,946)</td>
                        <td className="p-2.5">(£1,561)</td>
                        <td className="p-2.5 text-emerald-400 font-bold">+£2,218</td>
                        <td className="p-2.5 font-bold text-emerald-300">£2,621</td>
                      </tr>
                      <tr className="bg-emerald-950/30 text-emerald-100 font-bold">
                        <td className="p-2.5">W12 (Steady)</td>
                        <td className="p-2.5">150</td>
                        <td className="p-2.5 text-emerald-400">£48,998</td>
                        <td className="p-2.5 text-rose-400">(£41,946)</td>
                        <td className="p-2.5">(£1,561)</td>
                        <td className="p-2.5 text-emerald-400">+£5,491</td>
                        <td className="p-2.5 text-emerald-300">£24,585</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Steady-State Monthly P&L Summary */}
              <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 grid grid-cols-2 sm:grid-cols-4 gap-3 text-center">
                <div>
                  <span className="text-[10px] text-slate-400 font-mono block">MONTHLY BILLINGS</span>
                  <div className="text-base font-black text-white mt-0.5">£192,000</div>
                  <span className="text-[10px] text-slate-500">600 shifts/mo</span>
                </div>
                <div>
                  <span className="text-[10px] text-slate-400 font-mono block">NET PLATFORM REVENUE</span>
                  <div className="text-base font-black text-cyan-400 mt-0.5">£31,851</div>
                  <span className="text-[10px] text-cyan-300/80">Take-rate + Ancillary</span>
                </div>
                <div>
                  <span className="text-[10px] text-slate-400 font-mono block">MONTHLY OPEX</span>
                  <div className="text-base font-black text-slate-300 mt-0.5">£6,245</div>
                  <span className="text-[10px] text-slate-500">1 FTE + AWS + Stock</span>
                </div>
                <div>
                  <span className="text-[10px] text-slate-400 font-mono block">MONTHLY EBITDA</span>
                  <div className="text-base font-black text-emerald-400 mt-0.5">£22,662</div>
                  <span className="text-[10px] text-emerald-300/80">71.2% Net Margin</span>
                </div>
              </div>

            </div>
          )}

          {/* TAB 3: INVESTOR & STAKEHOLDER PRESENTATION DECK */}
          {activeTab === 'PRESENTATION_SLIDES' && (
            <div className="space-y-5 animate-in fade-in duration-150">
              
              {/* Slide Navigation Header */}
              <div className="flex items-center justify-between">
                <div>
                  <span className="text-[10px] font-mono font-bold text-emerald-400 uppercase tracking-wider">
                    Slide {currentSlideIndex + 1} of {SLIDES.length}
                  </span>
                  <h4 className="text-sm font-bold text-white">Executive Stakeholder Pitch Deck</h4>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    disabled={currentSlideIndex === 0}
                    onClick={() => setCurrentSlideIndex((prev) => Math.max(0, prev - 1))}
                    className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 disabled:opacity-40 cursor-pointer"
                  >
                    <ChevronLeft className="w-4 h-4" />
                  </button>
                  <button
                    disabled={currentSlideIndex === SLIDES.length - 1}
                    onClick={() => setCurrentSlideIndex((prev) => Math.min(SLIDES.length - 1, prev + 1))}
                    className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 disabled:opacity-40 cursor-pointer"
                  >
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Main Slide Card Presentation Canvas */}
              <div className="p-6 sm:p-8 rounded-3xl bg-slate-900 border-2 border-emerald-500/40 shadow-2xl space-y-6 relative overflow-hidden">
                <div className="space-y-1">
                  <span className="text-[11px] font-mono font-black text-emerald-400 uppercase tracking-widest block">
                    {SLIDES[currentSlideIndex].eyebrow}
                  </span>
                  <h3 className="text-xl sm:text-2xl font-black text-white">
                    {SLIDES[currentSlideIndex].title}
                  </h3>
                  <p className="text-xs sm:text-sm text-slate-300 max-w-2xl leading-relaxed">
                    {SLIDES[currentSlideIndex].subtitle}
                  </p>
                </div>

                {/* Key Metrics Strip */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2">
                  {SLIDES[currentSlideIndex].keyMetrics.map((km, idx) => (
                    <div key={idx} className="p-3.5 rounded-2xl bg-slate-950 border border-slate-800 text-center">
                      <span className="text-[10px] text-slate-400 font-mono uppercase block">{km.label}</span>
                      <div className="text-base font-black text-emerald-400 mt-0.5">{km.value}</div>
                    </div>
                  ))}
                </div>

                {/* Bullet Points */}
                <div className="space-y-2.5 pt-2">
                  {SLIDES[currentSlideIndex].points.map((pt, idx) => (
                    <div key={idx} className="flex items-start gap-2.5 text-xs text-slate-200">
                      <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                      <span className="leading-relaxed">{pt}</span>
                    </div>
                  ))}
                </div>

                {/* Speaker Notes Callout */}
                <div className="p-4 rounded-2xl bg-slate-950/80 border border-slate-800 text-xs space-y-1">
                  <span className="text-[10px] font-mono text-cyan-400 font-bold block uppercase">Speaker Notes:</span>
                  <p className="text-slate-400 italic">"{SLIDES[currentSlideIndex].speakerNotes}"</p>
                </div>
              </div>

              {/* Slide Thumbnail Strip */}
              <div className="grid grid-cols-5 sm:grid-cols-10 gap-1.5">
                {SLIDES.map((slide, idx) => (
                  <button
                    key={idx}
                    onClick={() => setCurrentSlideIndex(idx)}
                    className={`p-1.5 rounded-xl text-left border transition-all text-[10px] cursor-pointer ${
                      currentSlideIndex === idx
                        ? 'border-emerald-400 bg-emerald-950/40 text-emerald-200'
                        : 'border-slate-800 bg-slate-900 text-slate-400 hover:border-slate-700'
                    }`}
                  >
                    <span className="font-bold block truncate">Slide {idx + 1}</span>
                    <span className="text-slate-500 truncate block text-[9px]">{slide.title.split(' ')[0]}</span>
                  </button>
                ))}
              </div>

            </div>
          )}

          {/* TAB 4: DATABASE SCHEMA & GOOGLE DOCS MASTER EXPORT */}
          {activeTab === 'DATABASE_SCHEMA' && (
            <div className="space-y-6 animate-in fade-in duration-150">
              
              {/* Google Drive 4-Step Instructions Banner */}
              <div className="p-4 rounded-2xl bg-gradient-to-r from-emerald-500/15 via-teal-500/15 to-slate-900 border border-emerald-500/40 space-y-3">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-lg bg-emerald-500/20 text-emerald-300 flex items-center justify-center font-black">
                      📁
                    </div>
                    <div>
                      <h4 className="text-sm font-bold text-white flex items-center gap-2">
                        <span>Google Drive &amp; Docs Master Document Setup</span>
                        <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                          Ready for Copy / Paste
                        </span>
                      </h4>
                      <p className="text-xs text-slate-300">
                        Follow these 4 simple steps to save this complete specification to your Google Drive:
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={() => window.open('https://drive.google.com', '_blank')}
                    className="px-3 py-1.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs flex items-center gap-1.5 transition-colors cursor-pointer shrink-0 self-start sm:self-auto"
                  >
                    <span>Open drive.google.com</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </button>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-4 gap-2 pt-1 text-xs">
                  <div className="p-2.5 rounded-xl bg-slate-950/80 border border-slate-800">
                    <span className="font-mono text-emerald-400 font-bold block text-[10px]">STEP 1</span>
                    <p className="text-slate-200 font-medium mt-0.5">Go to <strong>drive.google.com</strong> on your computer.</p>
                  </div>
                  <div className="p-2.5 rounded-xl bg-slate-950/80 border border-slate-800">
                    <span className="font-mono text-cyan-400 font-bold block text-[10px]">STEP 2</span>
                    <p className="text-slate-200 font-medium mt-0.5">Click the <strong>+ New</strong> button on the top left.</p>
                  </div>
                  <div className="p-2.5 rounded-xl bg-slate-950/80 border border-slate-800">
                    <span className="font-mono text-amber-400 font-bold block text-[10px]">STEP 3</span>
                    <p className="text-slate-200 font-medium mt-0.5">Select <strong>New folder</strong>, name it <em>"Drive Partners - ReliefHGV"</em>, and click Create.</p>
                  </div>
                  <div className="p-2.5 rounded-xl bg-slate-950/80 border border-slate-800">
                    <span className="font-mono text-purple-400 font-bold block text-[10px]">STEP 4</span>
                    <p className="text-slate-200 font-medium mt-0.5">Open the folder, click <strong>+ New &gt; Google Docs</strong>, and paste the master document below!</p>
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row items-center gap-2 pt-1">
                  <button
                    onClick={() => {
                      const docText = `# Drive Partners: ReliefHGV Master Platform Blueprint
## Automated On-Demand Freight Labor Marketplace, Hardware Compliance SaaS & Fleet Monetization Engine

### 1. Executive Summary & Core Opportunity
- UK Road Haulage moves 89% of all domestic freight (£35B sector).
- Problem: Predatory agency markups (25-35%), strict tachograph rest liabilities, and HMRC IR35/SDC tax risk.
- Solution: Algorithmic instant dispatch (<60s) via PostGIS, native CCID smart card reader (.DDD on-chip rest validation), and Friday weekly payroll.

### 2. Shift Economics (10-Hour Class 1 Assignment)
- Haulier Invoice: £320.00
- Driver Pass-Through (Umbrella): £275.00
- Net Base Platform Take-Rate: £45.00 (14.1%)
- Ancillary Insurtech Net Margin: +£4.25 (£0-excess gap cover)
- Ancillary Factoring Net Margin: +£2.40 (Net-30 2.5% surcharge)
- Total Net Revenue: £51.65
- Variable Costs (Card, Faster Payments, Telemetry): (£4.64)
- Net Contribution Profit: £47.01 (91.0% Contribution Margin)

### 3. Financial Floats & Friday Payroll
- Shifts worked Monday-Sunday, paid following Friday (5 to 11-day cushion).
- Haulier 7-day card auto-debits clear Mon-Wed, funding Friday driver disbursements.
- Peak cash valley is only -£133 at Week 6.
- Total pilot starting capital required: £18,000 - £20,000 (covers £6,400 setup + working buffer).
- Steady state (Month 3 / 600 shifts): £31,851 net monthly revenue, £22,662 monthly EBITDA (71.2% margin).

### 4. 7 Diversified Revenue Engines
1. Core Labor Take-Rate: 14.1% (£45/shift).
2. Insurtech £0-Excess Gap: £8.50/shift (£4.25 net platform margin).
3. Embedded Factoring: Net-30 terms with 2.5% financing arbitrage (£3.20/shift net).
4. Fleet Tacho Compliance SaaS: Remote audit for haulier fleets (£4.00/driver/mo).
5. Driver Lifecycle Affiliates: JAUPT CPC course booking (£15) & D4 medical concierge (£12).
6. Co-Branded Fuel Cards: Trailing 0.75p-1.25p per litre pumped across active fleets.
7. Enterprise Labor Rate Index: Anonymized wage benchmark subscriptions (£5,000/yr).

### 5. Regulatory, Tax & Security Defense
- Inside IR35 Default: FCSA-accredited umbrella EOR operating PAYE & NICs.
- Anti-Scraping: Cloudflare WAF, Redis sliding-window limiters (30 req/min), database canary honeytokens, and dynamic asset watermarking.`;
                      navigator.clipboard.writeText(docText);
                      showToast('✓ Master Blueprint copied! Paste directly into Google Docs.');
                    }}
                    className="w-full sm:flex-1 py-2 px-4 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black text-xs flex items-center justify-center gap-2 shadow-lg shadow-emerald-500/20 cursor-pointer transition-all"
                  >
                    <Copy className="w-4 h-4" />
                    <span>Copy Master Blueprint (For Google Docs)</span>
                  </button>
                  <button
                    onClick={() => {
                      const sqlText = `-- PostgreSQL 16+ & PostGIS Production Schema for ReliefHGV
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "postgis";

CREATE TYPE user_role AS ENUM ('DRIVER', 'HAULIER_ADMIN', 'DISPATCHER', 'PLATFORM_SUPERADMIN');
CREATE TYPE licence_category AS ENUM ('CAT_C', 'CAT_CE', 'CAT_C1', 'CAT_C1E');
CREATE TYPE shift_status AS ENUM ('DRAFT', 'OPEN', 'MATCHING', 'CONFIRMED', 'IN_PROGRESS', 'COMPLETED', 'CANCELLED', 'DISPUTED');
CREATE TYPE shift_type AS ENUM ('STANDARD_RELIEF', 'STANDBY_RETAINER', 'B2B_SUBLEASE', 'CAB_RESCUE');
CREATE TYPE insurance_tier AS ENUM ('STANDARD_HAULIER_POLICY', 'ZERO_EXCESS_PROTECTION');
CREATE TYPE reader_dispatch_status AS ENUM ('NONE', 'PENDING', 'DISPATCHED', 'DELIVERED', 'ACTIVATED');
CREATE TYPE endorsement_code AS ENUM ('SP30', 'SP50', 'CU80', 'IN10', 'DR10', 'OTHER');

CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  email VARCHAR(255) UNIQUE NOT NULL,
  phone_number VARCHAR(32) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  role user_role NOT NULL,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE hauliers (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES users(id) ON DELETE RESTRICT,
  company_name VARCHAR(255) NOT NULL,
  company_number VARCHAR(16) UNIQUE NOT NULL,
  operator_licence_number VARCHAR(64) UNIQUE NOT NULL,
  is_medium_or_large BOOLEAN DEFAULT TRUE,
  billing_customer_id VARCHAR(128),
  credit_limit_cents INT DEFAULT 0,
  has_tacho_saas_subscription BOOLEAN DEFAULT FALSE,
  is_verified BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE depots (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  haulier_id UUID REFERENCES hauliers(id) ON DELETE CASCADE,
  name VARCHAR(150) NOT NULL,
  location GEOGRAPHY(Point, 4326) NOT NULL,
  postal_code VARCHAR(12) NOT NULL,
  address_line1 VARCHAR(255) NOT NULL,
  geofence_radius_meters INT DEFAULT 200,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE drivers (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  first_name VARCHAR(100) NOT NULL,
  last_name VARCHAR(100) NOT NULL,
  tacho_card_number VARCHAR(16) UNIQUE NOT NULL,
  ni_number VARCHAR(9) UNIQUE NOT NULL,
  cpc_expiry_date DATE NOT NULL,
  cpc_card_number VARCHAR(32) NOT NULL,
  medical_renewal_date DATE NOT NULL,
  home_location GEOGRAPHY(Point, 4326) NOT NULL,
  max_travel_radius_meters INT DEFAULT 48280,
  is_active BOOLEAN DEFAULT TRUE,
  is_verified BOOLEAN DEFAULT FALSE,
  hardware_ready BOOLEAN DEFAULT FALSE,
  is_honeytoken BOOLEAN DEFAULT FALSE,
  parent_haulier_id UUID REFERENCES hauliers(id),
  fuel_card_account_ref VARCHAR(64),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE driver_hardware (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  driver_id UUID REFERENCES drivers(id) ON DELETE CASCADE,
  serial_number VARCHAR(64) UNIQUE,
  dispatch_status reader_dispatch_status DEFAULT 'PENDING',
  courier_tracking_ref VARCHAR(128),
  dispatched_at TIMESTAMPTZ,
  paired_at TIMESTAMPTZ,
  last_successful_read TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE driver_entitlements (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  driver_id UUID REFERENCES drivers(id) ON DELETE CASCADE,
  category licence_category NOT NULL,
  issue_date DATE NOT NULL,
  expiry_date DATE NOT NULL,
  has_adr BOOLEAN DEFAULT FALSE,
  has_hiab BOOLEAN DEFAULT FALSE,
  has_moffett BOOLEAN DEFAULT FALSE,
  dvla_last_checked TIMESTAMPTZ,
  UNIQUE(driver_id, category)
);

CREATE TABLE driver_endorsements (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  driver_id UUID REFERENCES drivers(id) ON DELETE CASCADE,
  penalty_code endorsement_code NOT NULL,
  points INT NOT NULL CHECK (points BETWEEN 1 AND 12),
  offence_date DATE NOT NULL,
  expiry_date DATE NOT NULL
);

CREATE TABLE tacho_card_dumps (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  driver_id UUID REFERENCES drivers(id) ON DELETE CASCADE,
  hardware_id UUID REFERENCES driver_hardware(id),
  raw_file_storage_url VARCHAR(512) NOT NULL,
  file_signature_verified BOOLEAN NOT NULL DEFAULT FALSE,
  consecutive_daily_rest_hours NUMERIC(4, 2) NOT NULL,
  current_weekly_hours NUMERIC(5, 2) NOT NULL,
  fortnightly_accumulated_hours NUMERIC(5, 2) NOT NULL,
  recorded_infractions JSONB DEFAULT '[]'::jsonb,
  read_timestamp TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE shifts (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  haulier_id UUID REFERENCES hauliers(id) ON DELETE RESTRICT,
  depot_id UUID REFERENCES depots(id) ON DELETE RESTRICT,
  type shift_type DEFAULT 'STANDARD_RELIEF',
  required_category licence_category NOT NULL,
  requires_adr BOOLEAN DEFAULT FALSE,
  requires_hiab BOOLEAN DEFAULT FALSE,
  requires_moffett BOOLEAN DEFAULT FALSE,
  max_acceptable_points INT DEFAULT 6,
  start_time TIMESTAMPTZ NOT NULL,
  estimated_end_time TIMESTAMPTZ NOT NULL,
  gross_pay_cents INT NOT NULL,
  platform_fee_cents INT NOT NULL,
  insurance_selected insurance_tier DEFAULT 'STANDARD_HAULIER_POLICY',
  insurance_premium_cents INT DEFAULT 0,
  is_factored BOOLEAN DEFAULT FALSE,
  factoring_fee_cents INT DEFAULT 0,
  credit_due_date DATE,
  status shift_status DEFAULT 'OPEN',
  assigned_driver_id UUID REFERENCES drivers(id) ON DELETE SET NULL,
  version INT DEFAULT 1,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE standby_pools (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  depot_id UUID REFERENCES depots(id) ON DELETE CASCADE,
  start_window TIMESTAMPTZ NOT NULL,
  end_window TIMESTAMPTZ NOT NULL,
  retainer_pay_cents INT NOT NULL,
  max_drivers_needed INT NOT NULL DEFAULT 1,
  claimed_drivers UUID[] DEFAULT ARRAY[]::UUID[],
  status VARCHAR(32) DEFAULT 'ACTIVE',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE ancillary_transactions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  service_type VARCHAR(64) NOT NULL,
  gross_amount_cents INT NOT NULL,
  cost_amount_cents INT NOT NULL,
  net_margin_cents INT NOT NULL,
  partner_reference VARCHAR(128),
  status VARCHAR(32) DEFAULT 'SETTLED',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE settlement_transactions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  shift_id UUID UNIQUE REFERENCES shifts(id),
  gross_amount_cents INT NOT NULL,
  platform_fee_cents INT NOT NULL,
  insurance_cents INT NOT NULL,
  factoring_cents INT NOT NULL,
  net_driver_or_umbrella_cents INT NOT NULL,
  umbrella_partner_id VARCHAR(64),
  payout_status VARCHAR(32) DEFAULT 'HELD_IN_ESCROW',
  disbursed_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_drivers_geo ON drivers USING GIST(home_location);
CREATE INDEX idx_depots_geo ON depots USING GIST(location);
CREATE INDEX idx_shifts_matching ON shifts(status, start_time, required_category);`;
                      navigator.clipboard.writeText(sqlText);
                      showToast('✓ PostgreSQL 16+ & PostGIS Schema copied to clipboard!');
                    }}
                    className="w-full sm:w-auto py-2 px-4 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs flex items-center justify-center gap-2 cursor-pointer transition-all"
                  >
                    <Database className="w-4 h-4 text-cyan-400" />
                    <span>Copy PostgreSQL Schema</span>
                  </button>
                </div>
              </div>

              {/* Database Schema Code Container */}
              <div className="p-5 rounded-3xl bg-slate-900/90 border border-slate-800 space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Database className="w-4 h-4 text-emerald-400" />
                    <h4 className="text-sm font-bold text-white">PostgreSQL 16+ &amp; PostGIS Production Schema DDL</h4>
                  </div>
                  <span className="text-[10px] font-mono text-slate-400 bg-slate-950 px-2 py-0.5 rounded border border-slate-800">
                    12 Tables • GiST Indexes • Honeytoken Canaries
                  </span>
                </div>
                <div className="rounded-2xl bg-slate-950 border border-slate-800 p-4 font-mono text-xs text-slate-300 max-h-72 overflow-y-auto leading-relaxed select-text">
                  <pre>{`-- PostgreSQL 16+ & PostGIS Production Schema for ReliefHGV
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "postgis";

CREATE TYPE user_role AS ENUM ('DRIVER', 'HAULIER_ADMIN', 'DISPATCHER', 'PLATFORM_SUPERADMIN');
CREATE TYPE licence_category AS ENUM ('CAT_C', 'CAT_CE', 'CAT_C1', 'CAT_C1E');
CREATE TYPE shift_status AS ENUM ('DRAFT', 'OPEN', 'MATCHING', 'CONFIRMED', 'IN_PROGRESS', 'COMPLETED', 'CANCELLED', 'DISPUTED');
CREATE TYPE shift_type AS ENUM ('STANDARD_RELIEF', 'STANDBY_RETAINER', 'B2B_SUBLEASE', 'CAB_RESCUE');
CREATE TYPE insurance_tier AS ENUM ('STANDARD_HAULIER_POLICY', 'ZERO_EXCESS_PROTECTION');
CREATE TYPE reader_dispatch_status AS ENUM ('NONE', 'PENDING', 'DISPATCHED', 'DELIVERED', 'ACTIVATED');
CREATE TYPE endorsement_code AS ENUM ('SP30', 'SP50', 'CU80', 'IN10', 'DR10', 'OTHER');

-- 1. Users Table
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  email VARCHAR(255) UNIQUE NOT NULL,
  phone_number VARCHAR(32) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  role user_role NOT NULL,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. Hauliers & Depots
CREATE TABLE hauliers (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES users(id) ON DELETE RESTRICT,
  company_name VARCHAR(255) NOT NULL,
  company_number VARCHAR(16) UNIQUE NOT NULL,
  operator_licence_number VARCHAR(64) UNIQUE NOT NULL,
  is_medium_or_large BOOLEAN DEFAULT TRUE,
  billing_customer_id VARCHAR(128),
  credit_limit_cents INT DEFAULT 0,
  has_tacho_saas_subscription BOOLEAN DEFAULT FALSE,
  is_verified BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE depots (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  haulier_id UUID REFERENCES hauliers(id) ON DELETE CASCADE,
  name VARCHAR(150) NOT NULL,
  location GEOGRAPHY(Point, 4326) NOT NULL,
  postal_code VARCHAR(12) NOT NULL,
  address_line1 VARCHAR(255) NOT NULL,
  geofence_radius_meters INT DEFAULT 200,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. Drivers Table
CREATE TABLE drivers (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  first_name VARCHAR(100) NOT NULL,
  last_name VARCHAR(100) NOT NULL,
  tacho_card_number VARCHAR(16) UNIQUE NOT NULL,
  ni_number VARCHAR(9) UNIQUE NOT NULL,
  cpc_expiry_date DATE NOT NULL,
  cpc_card_number VARCHAR(32) NOT NULL,
  medical_renewal_date DATE NOT NULL,
  home_location GEOGRAPHY(Point, 4326) NOT NULL,
  max_travel_radius_meters INT DEFAULT 48280,
  is_active BOOLEAN DEFAULT TRUE,
  is_verified BOOLEAN DEFAULT FALSE,
  hardware_ready BOOLEAN DEFAULT FALSE,
  is_honeytoken BOOLEAN DEFAULT FALSE,
  parent_haulier_id UUID REFERENCES hauliers(id),
  fuel_card_account_ref VARCHAR(64),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. Native Hardware Reader Ingestion
CREATE TABLE driver_hardware (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  driver_id UUID REFERENCES drivers(id) ON DELETE CASCADE,
  serial_number VARCHAR(64) UNIQUE,
  dispatch_status reader_dispatch_status DEFAULT 'PENDING',
  courier_tracking_ref VARCHAR(128),
  dispatched_at TIMESTAMPTZ,
  paired_at TIMESTAMPTZ,
  last_successful_read TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE tacho_card_dumps (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  driver_id UUID REFERENCES drivers(id) ON DELETE CASCADE,
  hardware_id UUID REFERENCES driver_hardware(id),
  raw_file_storage_url VARCHAR(512) NOT NULL,
  file_signature_verified BOOLEAN NOT NULL DEFAULT FALSE,
  consecutive_daily_rest_hours NUMERIC(4, 2) NOT NULL,
  current_weekly_hours NUMERIC(5, 2) NOT NULL,
  fortnightly_accumulated_hours NUMERIC(5, 2) NOT NULL,
  recorded_infractions JSONB DEFAULT '[]'::jsonb,
  read_timestamp TIMESTAMPTZ DEFAULT NOW()
);

-- 5. Shifts & Concurrency Locking
CREATE TABLE shifts (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  haulier_id UUID REFERENCES hauliers(id) ON DELETE RESTRICT,
  depot_id UUID REFERENCES depots(id) ON DELETE RESTRICT,
  type shift_type DEFAULT 'STANDARD_RELIEF',
  required_category licence_category NOT NULL,
  requires_adr BOOLEAN DEFAULT FALSE,
  requires_hiab BOOLEAN DEFAULT FALSE,
  requires_moffett BOOLEAN DEFAULT FALSE,
  max_acceptable_points INT DEFAULT 6,
  start_time TIMESTAMPTZ NOT NULL,
  estimated_end_time TIMESTAMPTZ NOT NULL,
  gross_pay_cents INT NOT NULL,
  platform_fee_cents INT NOT NULL,
  insurance_selected insurance_tier DEFAULT 'STANDARD_HAULIER_POLICY',
  insurance_premium_cents INT DEFAULT 0,
  is_factored BOOLEAN DEFAULT FALSE,
  factoring_fee_cents INT DEFAULT 0,
  credit_due_date DATE,
  status shift_status DEFAULT 'OPEN',
  assigned_driver_id UUID REFERENCES drivers(id) ON DELETE SET NULL,
  version INT DEFAULT 1,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 6. Standby Retainer Pools
CREATE TABLE standby_pools (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  depot_id UUID REFERENCES depots(id) ON DELETE CASCADE,
  start_window TIMESTAMPTZ NOT NULL,
  end_window TIMESTAMPTZ NOT NULL,
  retainer_pay_cents INT NOT NULL,
  max_drivers_needed INT NOT NULL DEFAULT 1,
  claimed_drivers UUID[] DEFAULT ARRAY[]::UUID[],
  status VARCHAR(32) DEFAULT 'ACTIVE',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Spatial Indexes
CREATE INDEX idx_drivers_geo ON drivers USING GIST(home_location);
CREATE INDEX idx_depots_geo ON depots USING GIST(location);
CREATE INDEX idx_shifts_matching ON shifts(status, start_time, required_category);`}</pre>
                </div>
              </div>

            </div>
          )}

        </div>

        {/* MODAL FOOTER */}
        <div className="px-5 py-3 border-t border-slate-800 bg-slate-900/80 flex items-center justify-between text-xs text-slate-400 shrink-0">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            <span>ReliefHGV Master Specification: FCSA Umbrella • Royal Mail Tracked 24 Reader • Section 44 ITEPA</span>
          </div>

          <div className="flex items-center gap-3">
            {onOpenTachoScanner && (
              <button
                onClick={() => {
                  onClose();
                  onOpenTachoScanner();
                }}
                className="font-bold text-cyan-300 hover:text-white transition-colors cursor-pointer"
              >
                Test Tacho Card Reader &rarr;
              </button>
            )}
            <button
              onClick={onClose}
              className="px-4 py-1.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black transition-colors cursor-pointer"
            >
              Done
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};
