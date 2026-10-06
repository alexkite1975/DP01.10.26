'use client';
import React, { useState } from 'react';
import {
  X,
  Briefcase,
  TrendingUp,
  Truck,
  Building2,
  DollarSign,
  PieChart,
  CheckCircle2,
  ArrowRight,
  ShieldCheck,
  Calendar,
  Layers,
  FileText,
  Download
} from 'lucide-react';

interface CommercialBusinessPlanModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const CommercialBusinessPlanModal: React.FC<CommercialBusinessPlanModalProps> = ({
  isOpen,
  onClose
}) => {
  const [activeSection, setActiveSection] = useState<'SUMMARY' | 'BUDGET' | 'ROADMAP'>('SUMMARY');

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-slate-950/85 backdrop-blur-md overflow-y-auto">
      <div className="relative w-full max-w-4xl bg-slate-900 border border-slate-800 rounded-3xl shadow-2xl p-5 sm:p-7 text-slate-100 max-h-[92vh] overflow-y-auto space-y-6">
        
        {/* Header */}
        <div className="flex items-start justify-between pb-4 border-b border-slate-800">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-amber-500 to-orange-600 text-slate-950 flex items-center justify-center shadow-lg shadow-amber-500/20 font-black">
              <Briefcase className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-lg sm:text-xl font-extrabold text-white">
                  Commercial Business Plan: Apex Freight Solutions Ltd
                </h2>
                <span className="rounded-md bg-amber-500/20 px-2 py-0.5 text-[10px] font-mono font-bold text-amber-300 border border-amber-500/30">
                  £1.08M Pro-Forma
                </span>
              </div>
              <p className="text-xs text-slate-400 mt-0.5">
                Asset-Right Regional Haulier &amp; Managed Subcontracting Brokerage • Jurisdiction: UK (RHA Conditions)
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

        {/* Section Navigation Buttons */}
        <div className="flex gap-2">
          <button
            onClick={() => setActiveSection('SUMMARY')}
            className={`flex-1 py-2.5 rounded-xl text-xs font-bold transition-all ${
              activeSection === 'SUMMARY'
                ? 'bg-amber-500 text-slate-950 font-extrabold shadow-md shadow-amber-500/20'
                : 'bg-slate-950 border border-slate-800 text-slate-400 hover:text-white'
            }`}
          >
            1. Operating Model &amp; Revenue Mix
          </button>
          <button
            onClick={() => setActiveSection('BUDGET')}
            className={`flex-1 py-2.5 rounded-xl text-xs font-bold transition-all ${
              activeSection === 'BUDGET'
                ? 'bg-amber-500 text-slate-950 font-extrabold shadow-md shadow-amber-500/20'
                : 'bg-slate-950 border border-slate-800 text-slate-400 hover:text-white'
            }`}
          >
            2. Year 1 P&amp;L Budget (£149k EBITDA)
          </button>
          <button
            onClick={() => setActiveSection('ROADMAP')}
            className={`flex-1 py-2.5 rounded-xl text-xs font-bold transition-all ${
              activeSection === 'ROADMAP'
                ? 'bg-amber-500 text-slate-950 font-extrabold shadow-md shadow-amber-500/20'
                : 'bg-slate-950 border border-slate-800 text-slate-400 hover:text-white'
            }`}
          >
            3. 12-Month Implementation Milestones
          </button>
        </div>

        {/* SECTION 1: EXECUTIVE SUMMARY & REVENUE MIX */}
        {activeSection === 'SUMMARY' && (
          <div className="space-y-4 animate-in fade-in duration-200">
            
            {/* Top 3 KPI Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 text-center space-y-1">
                <span className="text-[10px] font-mono text-slate-400 uppercase">Gross Annual Turnover</span>
                <div className="text-2xl font-black text-white font-mono">£1,080,000</div>
                <span className="text-[10px] text-emerald-400 font-bold">3 Leased Units + Brokerage</span>
              </div>
              <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 text-center space-y-1">
                <span className="text-[10px] font-mono text-slate-400 uppercase">EBITDA (Operating Profit)</span>
                <div className="text-2xl font-black text-amber-400 font-mono">£149,040</div>
                <span className="text-[10px] text-amber-300 font-bold">13.8% Net Margin</span>
              </div>
              <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 text-center space-y-1">
                <span className="text-[10px] font-mono text-slate-400 uppercase">Loaded Mileage Ratio</span>
                <div className="text-2xl font-black text-cyan-400 font-mono">82% Loaded</div>
                <span className="text-[10px] text-cyan-300 font-bold">&lt;18% Deadhead (UK avg ~28%)</span>
              </div>
            </div>

            {/* Tri-Partite Operating Model */}
            <div className="space-y-3 pt-2">
              <span className="text-xs font-bold text-slate-200 uppercase tracking-wider block">
                The 3 Core Revenue Streams:
              </span>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                <div className="p-4 rounded-xl border border-blue-500/30 bg-blue-950/20 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-extrabold text-blue-300">A. Outbound Core (65%)</span>
                    <span className="text-[10px] font-mono text-slate-400">£564,570 Rev</span>
                  </div>
                  <p className="text-xs text-slate-300 leading-relaxed">
                    Dedicated recurring contracted lanes (food &amp; beverage packaging, industrial manufacturing, regional pallet hubs) supplemented by HaulageHub enterprise tender contracts.
                  </p>
                  <div className="text-[11px] font-mono text-blue-400 font-bold">Target: £2.75 to £3.10 / loaded mile</div>
                </div>

                <div className="p-4 rounded-xl border border-cyan-500/30 bg-cyan-950/20 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-extrabold text-cyan-300">B. Return Spot Legs (25%)</span>
                    <span className="text-[10px] font-mono text-slate-400">HX Backloads</span>
                  </div>
                  <p className="text-xs text-slate-300 leading-relaxed">
                    Drivers set to "Available Soon" on HX Fleet App 30 mins before drop in key corridors (Midlands, M62, M4/M5). Sourcing loads paying well above the £1.05/mi marginal cost.
                  </p>
                  <div className="text-[11px] font-mono text-cyan-400 font-bold">Target: £1.90 to £2.40 / backload mile</div>
                </div>

                <div className="p-4 rounded-xl border border-amber-500/30 bg-amber-950/20 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-extrabold text-amber-300">C. Brokerage Margin (10%)</span>
                    <span className="text-[10px] font-mono text-slate-400">£515,430 Turn</span>
                  </div>
                  <p className="text-xs text-slate-300 leading-relaxed">
                    Peak overflow volume won from direct clients is subcontracted via HX &amp; HaulageHub panels to vetted RHA/FORS accredited hauliers on risk-free margin.
                  </p>
                  <div className="text-[11px] font-mono text-amber-400 font-bold">Target: 12% to 15% retained gross margin</div>
                </div>
              </div>
            </div>

            {/* Working Capital Architecture Banner */}
            <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-2 text-xs">
              <span className="font-bold text-white block">Cash Flow &amp; Working Capital Architecture:</span>
              <ul className="space-y-1 text-slate-300 list-disc list-inside text-[11px]">
                <li><strong>Centralised Billing:</strong> Automated digital e-POD capture cuts back-office billing overhead.</li>
                <li><strong>Dynamic Liquidity (Fast-Pay):</strong> Selective use of HaulageHub 8-to-24-hour settlement around payroll or diesel price spikes eliminates expensive invoice factoring lock-in.</li>
                <li><strong>Strict Credit Rule:</strong> Subcontracting and spot carriage strictly refused for any counterparty with a credit rating under 85%.</li>
              </ul>
            </div>

          </div>
        )}

        {/* SECTION 2: YEAR 1 P&L BUDGET */}
        {activeSection === 'BUDGET' && (
          <div className="space-y-4 animate-in fade-in duration-200">
            <div className="overflow-x-auto rounded-2xl border border-slate-800">
              <table className="w-full text-left text-xs text-slate-300">
                <thead className="bg-slate-950 text-slate-400 font-mono text-[10px] uppercase border-b border-slate-800">
                  <tr>
                    <th className="p-3">Cost Centre</th>
                    <th className="p-3">Operational Details</th>
                    <th className="p-3 text-right">Annual Cost (£)</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/80 bg-slate-900/60 font-sans">
                  <tr className="bg-slate-950/80 font-bold text-white">
                    <td className="p-3">Gross Turnover</td>
                    <td className="p-3 text-slate-400 font-normal">Fleet transport operations + Brokerage turnover</td>
                    <td className="p-3 text-right text-emerald-400 font-mono text-sm">£1,080,000</td>
                  </tr>
                  <tr>
                    <td className="p-3 font-semibold text-slate-200">Cost of Purchased Transport</td>
                    <td className="p-3 text-slate-400 text-[11px]">Subcontractor payouts on brokered loads (86% payout)</td>
                    <td className="p-3 text-right text-rose-300 font-mono">£443,270</td>
                  </tr>
                  <tr>
                    <td className="p-3 font-semibold text-slate-200">Fuel &amp; AdBlue</td>
                    <td className="p-3 text-slate-400 text-[11px]">255,000 fleet miles @ 8.2 MPG (~£1.42/L diesel)</td>
                    <td className="p-3 text-right text-rose-300 font-mono">£201,300</td>
                  </tr>
                  <tr>
                    <td className="p-3 font-semibold text-slate-200">Driver Wages &amp; On-Costs</td>
                    <td className="p-3 text-slate-400 text-[11px]">3 full-time HGV Class 1 drivers (£42k base + NI/pension)</td>
                    <td className="p-3 text-right text-rose-300 font-mono">£147,000</td>
                  </tr>
                  <tr>
                    <td className="p-3 font-semibold text-slate-200">Vehicle Leases &amp; Maintenance</td>
                    <td className="p-3 text-slate-400 text-[11px]">3x Euro-6 Units + Curtain Trailers (Full R&amp;M contract)</td>
                    <td className="p-3 text-right text-rose-300 font-mono">£75,600</td>
                  </tr>
                  <tr>
                    <td className="p-3 font-semibold text-slate-200">Platform Tech &amp; Subscriptions</td>
                    <td className="p-3 text-slate-400 text-[11px]">Haulage Exchange Small Fleet (£3,120) + TMS &amp; Telematics</td>
                    <td className="p-3 text-right text-rose-300 font-mono">£5,400</td>
                  </tr>
                  <tr>
                    <td className="p-3 font-semibold text-slate-200">Insurances &amp; Licencing</td>
                    <td className="p-3 text-slate-400 text-[11px]">O-Licence compliance, GIT (£1,300/t RHA), Fleet PL/EL</td>
                    <td className="p-3 text-right text-rose-300 font-mono">£19,500</td>
                  </tr>
                  <tr>
                    <td className="p-3 font-semibold text-slate-200">Operating Overheads</td>
                    <td className="p-3 text-slate-400 text-[11px]">Base depot operating centre, dispatch staffing, legal/audit</td>
                    <td className="p-3 text-right text-rose-300 font-mono">£38,890</td>
                  </tr>
                  <tr className="bg-amber-950/30 border-t-2 border-amber-500 font-extrabold text-white">
                    <td className="p-3 text-amber-300">EBITDA (Operating Profit)</td>
                    <td className="p-3 text-amber-200/80 font-normal">Net Operating Profit Margin (13.8%)</td>
                    <td className="p-3 text-right text-amber-400 font-mono text-base">£149,040</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* SECTION 3: 12-MONTH IMPLEMENTATION ROADMAP */}
        {activeSection === 'ROADMAP' && (
          <div className="space-y-4 animate-in fade-in duration-200 text-xs">
            <div className="space-y-3">
              {[
                {
                  month: 'Month 1',
                  title: 'Compliance & Licencing Baseline',
                  desc: 'Secure Standard National Operator\'s Licence (O-Licence) with operating centre authorization; register with Companies House and RHA.',
                  status: 'COMPLETED'
                },
                {
                  month: 'Month 2',
                  title: 'Platform Integration & Cloud TMS',
                  desc: 'Complete vetting and registration on HaulageHub and Haulage Exchange; integrate driver telematics and cloud TMS (Mandata/Xero).',
                  status: 'IN_PROGRESS'
                },
                {
                  month: 'Month 3',
                  title: 'Fleet Deployment & Core Lane Launch',
                  desc: 'Take delivery of 3 leased tractor units; onboard Class 1 drivers under SOP-OPS-014 demurrage training; initiate live runs on core lanes.',
                  status: 'READY'
                },
                {
                  month: 'Month 6',
                  title: 'Break-Even Review & Brokerage Scale',
                  desc: 'Conduct break-even review of HX return loads; expand brokerage desk to handle third-party client overflow on 12–15% margin.',
                  status: 'PLANNED'
                },
                {
                  month: 'Month 12',
                  title: 'Fleet Expansion & Corporate ESG Auditing',
                  desc: 'Evaluate expansion to 5 vehicles; onboard corporate retailers using HaulageHub Scope 3 carbon auditing and proven deadhead reductions.',
                  status: 'PLANNED'
                }
              ].map((m, idx) => (
                <div key={idx} className="p-3.5 rounded-xl border border-slate-800 bg-slate-950/80 flex items-start justify-between gap-4">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-[10px] font-bold px-2 py-0.5 rounded bg-cyan-500/20 text-cyan-300 border border-cyan-500/30">
                        {m.month}
                      </span>
                      <h4 className="font-bold text-white text-xs">{m.title}</h4>
                    </div>
                    <p className="text-slate-400 text-[11px] leading-relaxed pl-1">{m.desc}</p>
                  </div>
                  <span className={`shrink-0 text-[9px] font-bold px-2 py-1 rounded ${
                    m.status === 'COMPLETED' ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30' :
                    m.status === 'IN_PROGRESS' ? 'bg-cyan-500/20 text-cyan-300 animate-pulse border border-cyan-500/30' :
                    'bg-slate-800 text-slate-400'
                  }`}>
                    {m.status}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

      </div>
    </div>
  );
};
