'use client';
import React, { useState } from 'react';
import {
  X,
  Calculator,
  TrendingUp,
  Percent,
  AlertTriangle,
  CheckCircle2,
  HelpCircle,
  Truck,
  ArrowRight,
  ShieldCheck,
  Building2,
  DollarSign
} from 'lucide-react';

interface FreightBreakEvenCalculatorModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const FreightBreakEvenCalculatorModal: React.FC<FreightBreakEvenCalculatorModalProps> = ({
  isOpen,
  onClose
}) => {
  // Interactive Calculator State
  const [subscriptionCost, setSubscriptionCost] = useState<number>(259.99); // Small Fleet default
  const [returnMiles, setReturnMiles] = useState<number>(80);
  const [ratePerMile, setRatePerMile] = useState<number>(2.00);
  const [marginalCostPerMile, setMarginalCostPerMile] = useState<number>(1.00); // UK 44t baseline £0.95-£1.15
  const [activeTab, setActiveTab] = useState<'CALCULATOR' | 'WORKED_EXAMPLES' | 'SCORECARD'>('CALCULATOR');

  if (!isOpen) return null;

  // Mathematical Calculations
  const grossRevenuePerLoad = returnMiles * ratePerMile;
  const variableCostPerLoad = returnMiles * marginalCostPerMile;
  const netContributionPerLoad = Math.max(1, grossRevenuePerLoad - variableCostPerLoad);
  const loadsNeededPerMonth = +(subscriptionCost / netContributionPerLoad).toFixed(2);
  const daysPerLoad = loadsNeededPerMonth > 0 ? +(30.5 / loadsNeededPerMonth).toFixed(1) : 0;
  const deadheadBurnAvoided = returnMiles * marginalCostPerMile;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-slate-950/85 backdrop-blur-md overflow-y-auto">
      <div className="relative w-full max-w-4xl bg-slate-900 border border-slate-800 rounded-3xl shadow-2xl p-5 sm:p-7 text-slate-100 max-h-[92vh] overflow-y-auto space-y-6">
        
        {/* Header */}
        <div className="flex items-start justify-between pb-4 border-b border-slate-800">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-emerald-500 to-cyan-600 text-slate-950 flex items-center justify-center shadow-lg shadow-emerald-500/20 font-black">
              <Calculator className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-lg sm:text-xl font-extrabold text-white">
                  Haulage Exchange (HX) Break-Even &amp; Net Contribution Engine
                </h2>
                <span className="rounded-md bg-emerald-500/20 px-2 py-0.5 text-[10px] font-mono font-bold text-emerald-300 border border-emerald-500/30">
                  Formula Verified
                </span>
              </div>
              <p className="text-xs text-slate-400 mt-0.5">
                Calculate the exact backload volume required to cover fixed annual subscriptions through net marginal contribution
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

        {/* Tab Selector */}
        <div className="flex gap-2">
          <button
            onClick={() => setActiveTab('CALCULATOR')}
            className={`flex-1 py-2.5 rounded-xl text-xs font-bold transition-all ${
              activeTab === 'CALCULATOR'
                ? 'bg-emerald-500 text-slate-950 font-extrabold shadow-md shadow-emerald-500/20'
                : 'bg-slate-950 border border-slate-800 text-slate-400 hover:text-white'
            }`}
          >
            Interactive Break-Even Calculator
          </button>
          <button
            onClick={() => setActiveTab('WORKED_EXAMPLES')}
            className={`flex-1 py-2.5 rounded-xl text-xs font-bold transition-all ${
              activeTab === 'WORKED_EXAMPLES'
                ? 'bg-emerald-500 text-slate-950 font-extrabold shadow-md shadow-emerald-500/20'
                : 'bg-slate-950 border border-slate-800 text-slate-400 hover:text-white'
            }`}
          >
            Worked Case Studies (Small, Med, Broker)
          </button>
          <button
            onClick={() => setActiveTab('SCORECARD')}
            className={`flex-1 py-2.5 rounded-xl text-xs font-bold transition-all ${
              activeTab === 'SCORECARD'
                ? 'bg-emerald-500 text-slate-950 font-extrabold shadow-md shadow-emerald-500/20'
                : 'bg-slate-950 border border-slate-800 text-slate-400 hover:text-white'
            }`}
          >
            Fleet Size Viability Scorecard
          </button>
        </div>

        {/* TAB 1: INTERACTIVE CALCULATOR */}
        {activeTab === 'CALCULATOR' && (
          <div className="space-y-5 animate-in fade-in duration-200">
            
            {/* The Formula Banner */}
            <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-2">
              <div className="text-[11px] font-mono text-cyan-400 font-bold uppercase tracking-wider">
                The Core Financial Formula:
              </div>
              <div className="font-mono text-xs sm:text-sm text-slate-200 bg-slate-900/90 p-3 rounded-xl border border-slate-800/80 overflow-x-auto">
                <div className="text-cyan-300 font-bold text-sm">
                  Loads Needed to Break Even = Monthly Subscription ÷ Net Contribution per Load
                </div>
                <div className="text-[11px] text-slate-400 mt-1">
                  Where: <span className="text-emerald-400 font-bold">Net Contribution</span> = Load Revenue − (Miles × Marginal Running Cost/Mile)
                </div>
              </div>
            </div>

            {/* Controls & Outputs Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              
              {/* Left Column: Interactive Inputs */}
              <div className="space-y-4 p-5 rounded-2xl bg-slate-950/70 border border-slate-800">
                <span className="text-xs font-bold text-white uppercase tracking-wider block">
                  1. Operating Parameters &amp; Costs
                </span>

                {/* Subscription Tier Preset */}
                <div className="space-y-1.5">
                  <label className="text-xs text-slate-300 font-medium">Monthly HX Subscription (£/mo):</label>
                  <div className="grid grid-cols-3 gap-2">
                    {[
                      { label: 'Small (£260)', val: 259.99 },
                      { label: 'Medium (£300)', val: 299.99 },
                      { label: 'Large (£550)', val: 549.99 }
                    ].map((p) => (
                      <button
                        key={p.val}
                        onClick={() => setSubscriptionCost(p.val)}
                        className={`py-1.5 rounded-lg text-xs font-bold border transition-all ${
                          subscriptionCost === p.val
                            ? 'bg-cyan-500/20 text-cyan-300 border-cyan-500/40 font-extrabold'
                            : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-white'
                        }`}
                      >
                        {p.label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Return Mileage Slider */}
                <div className="space-y-1">
                  <div className="flex justify-between text-xs">
                    <span className="text-slate-300">Average Return / Backload Distance:</span>
                    <span className="font-mono font-bold text-cyan-400">{returnMiles} miles</span>
                  </div>
                  <input
                    type="range"
                    min="30"
                    max="250"
                    step="5"
                    value={returnMiles}
                    onChange={(e) => setReturnMiles(Number(e.target.value))}
                    className="w-full accent-cyan-400"
                  />
                </div>

                {/* Rate Per Mile Slider */}
                <div className="space-y-1">
                  <div className="flex justify-between text-xs">
                    <span className="text-slate-300">Achieved Spot Rate per Mile:</span>
                    <span className="font-mono font-bold text-emerald-400">£{ratePerMile.toFixed(2)} / mi</span>
                  </div>
                  <input
                    type="range"
                    min="1.40"
                    max="3.20"
                    step="0.05"
                    value={ratePerMile}
                    onChange={(e) => setRatePerMile(Number(e.target.value))}
                    className="w-full accent-emerald-400"
                  />
                </div>

                {/* Marginal Running Cost Slider */}
                <div className="space-y-1">
                  <div className="flex justify-between text-xs">
                    <span className="text-slate-300">Marginal Variable Cost (Fuel/AdBlue/Tyres):</span>
                    <span className="font-mono font-bold text-amber-400">£{marginalCostPerMile.toFixed(2)} / mi</span>
                  </div>
                  <input
                    type="range"
                    min="0.85"
                    max="1.25"
                    step="0.05"
                    value={marginalCostPerMile}
                    onChange={(e) => setMarginalCostPerMile(Number(e.target.value))}
                    className="w-full accent-amber-400"
                  />
                  <p className="text-[10px] text-slate-500">
                    UK baseline for 44t Euro-6 artic is £0.95–£1.15/mi. Standing overheads (depot, leases, insurance) exist whether parked or moving.
                  </p>
                </div>
              </div>

              {/* Right Column: Live Break-Even Verdict */}
              <div className="space-y-4 p-5 rounded-2xl bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 border border-emerald-500/40 flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                      2. Live Financial Verdict
                    </span>
                    <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                      Break-Even Threshold
                    </span>
                  </div>

                  <div className="mt-4 space-y-3">
                    <div className="p-4 rounded-xl bg-slate-950/80 border border-slate-800 text-center space-y-1">
                      <div className="text-xs text-slate-400">Loads Required Across Fleet Each Month:</div>
                      <div className="text-3xl sm:text-4xl font-black text-emerald-400 font-mono">
                        {loadsNeededPerMonth} <span className="text-sm font-sans font-bold text-slate-300">loads / mo</span>
                      </div>
                      <div className="text-[11px] text-cyan-300 font-medium">
                        Just <strong>1 backload every {daysPerLoad} days</strong> covers the entire £{subscriptionCost.toFixed(2)} subscription!
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-2 text-xs font-mono">
                      <div className="p-3 rounded-lg bg-slate-950 border border-slate-800">
                        <div className="text-[10px] text-slate-400">Gross Load Value</div>
                        <div className="text-sm font-bold text-white">£{grossRevenuePerLoad.toFixed(2)}</div>
                      </div>
                      <div className="p-3 rounded-lg bg-slate-950 border border-slate-800">
                        <div className="text-[10px] text-slate-400">Net Contribution</div>
                        <div className="text-sm font-bold text-emerald-400">+£{netContributionPerLoad.toFixed(2)}</div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="p-3 rounded-xl bg-emerald-950/20 border border-emerald-500/30 text-xs text-slate-300 space-y-1">
                  <div className="font-bold text-emerald-400 flex items-center gap-1.5">
                    <CheckCircle2 className="w-4 h-4" />
                    <span>The Return-Leg Reality:</span>
                  </div>
                  <p className="text-[11px] leading-relaxed">
                    Driving empty (deadhead) burns <strong>£{deadheadBurnAvoided.toFixed(2)}</strong> with £0 revenue. Any load paying above £{marginalCostPerMile.toFixed(2)}/mile delivers positive cash flow directly to company overheads.
                  </p>
                </div>
              </div>

            </div>
          </div>
        )}

        {/* TAB 2: WORKED EXAMPLES */}
        {activeTab === 'WORKED_EXAMPLES' && (
          <div className="space-y-4 animate-in fade-in duration-200">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              
              {/* Example A */}
              <div className="p-5 rounded-2xl bg-slate-950/80 border border-slate-800 space-y-3 flex flex-col justify-between">
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-cyan-400">Example A</span>
                    <span className="text-[10px] font-mono text-slate-400">Small Fleet (1–5)</span>
                  </div>
                  <h4 className="text-sm font-extrabold text-white">2 Artics • Regional Outbound</h4>
                  <p className="text-xs text-slate-300 leading-relaxed">
                    Frequently running empty 80 miles back to base. Captures an 80-mile HX return load @ £2.00/mile = <strong>£160 revenue</strong>.
                  </p>
                  <div className="p-3 rounded-xl bg-slate-900 border border-slate-800 text-xs font-mono space-y-1">
                    <div>Gross Revenue: £160</div>
                    <div>Marginal Fuel/Tyres: -£80</div>
                    <div className="text-emerald-400 font-bold border-t border-slate-800 pt-1">Net Contribution: £80.00</div>
                  </div>
                </div>
                <div className="p-3 rounded-xl bg-cyan-950/30 border border-cyan-500/30 text-xs">
                  <div className="text-[11px] font-bold text-cyan-300">Break-Even: £260 / £80 = 3.25 loads/mo</div>
                  <div className="text-[10px] text-slate-400 mt-0.5">1 return load every 7 to 8 days covers cost. Everything beyond is pure profit.</div>
                </div>
              </div>

              {/* Example B */}
              <div className="p-5 rounded-2xl bg-slate-950/80 border border-slate-800 space-y-3 flex flex-col justify-between">
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-emerald-400">Example B</span>
                    <span className="text-[10px] font-mono text-slate-400">Med Fleet (6–15)</span>
                  </div>
                  <h4 className="text-sm font-extrabold text-white">8 Rigids/Artics • Contract Base</h4>
                  <p className="text-xs text-slate-300 leading-relaxed">
                    Capturing just two full-distance spot runs (180 miles @ £2.40/mile = £432 revenue; variable costs £190; <strong>net contribution = £242</strong>).
                  </p>
                  <div className="p-3 rounded-xl bg-slate-900 border border-slate-800 text-xs font-mono space-y-1">
                    <div>Gross Revenue: £432</div>
                    <div>Marginal Variable: -£190</div>
                    <div className="text-emerald-400 font-bold border-t border-slate-800 pt-1">Net Contribution: £242.00</div>
                  </div>
                </div>
                <div className="p-3 rounded-xl bg-emerald-950/30 border border-emerald-500/30 text-xs">
                  <div className="text-[11px] font-bold text-emerald-300">Break-Even: £300 / £242 = 1.24 loads/mo</div>
                  <div className="text-[10px] text-slate-400 mt-0.5">Under 2 captured loads a month across an 8-truck fleet covers the annual cost.</div>
                </div>
              </div>

              {/* Example C */}
              <div className="p-5 rounded-2xl bg-slate-950/80 border border-slate-800 space-y-3 flex flex-col justify-between">
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-amber-400">Example C</span>
                    <span className="text-[10px] font-mono text-slate-400">Forwarder / 3PL</span>
                  </div>
                  <h4 className="text-sm font-extrabold text-white">Subcontracting Margin</h4>
                  <p className="text-xs text-slate-300 leading-relaxed">
                    Brokering peak overflow won from clients. Average 10% to 15% margin on booked loads (billing client £700, subbing via HX for £600 = <strong>£100 margin</strong>).
                  </p>
                  <div className="p-3 rounded-xl bg-slate-900 border border-slate-800 text-xs font-mono space-y-1">
                    <div>Client Invoiced: £700</div>
                    <div>Subcontractor: -£600</div>
                    <div className="text-amber-400 font-bold border-t border-slate-800 pt-1">Retained Margin: £100.00</div>
                  </div>
                </div>
                <div className="p-3 rounded-xl bg-amber-950/30 border border-amber-500/30 text-xs">
                  <div className="text-[11px] font-bold text-amber-300">Break-Even: 3 to 4 loads/mo</div>
                  <div className="text-[10px] text-slate-400 mt-0.5">Clears subscription fee without owning a single truck.</div>
                </div>
              </div>

            </div>
          </div>
        )}

        {/* TAB 3: FLEET SIZE VIABILITY SCORECARD */}
        {activeTab === 'SCORECARD' && (
          <div className="space-y-4 animate-in fade-in duration-200">
            <div className="overflow-x-auto rounded-2xl border border-slate-800">
              <table className="w-full text-left text-xs text-slate-300">
                <thead className="bg-slate-950 text-slate-400 font-mono text-[10px] uppercase border-b border-slate-800">
                  <tr>
                    <th className="p-3">Fleet Category</th>
                    <th className="p-3">Break-Even Difficulty</th>
                    <th className="p-3">Primary Commercial Risk</th>
                    <th className="p-3">Strategic Recommendation</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/80 bg-slate-900/60 font-sans">
                  <tr>
                    <td className="p-3 font-bold text-white">Solo Owner-Driver (1 Truck)</td>
                    <td className="p-3 text-amber-400 font-bold">Moderate</td>
                    <td className="p-3 text-slate-400">Missing spot loads while driving; 12-month lock-in contract.</td>
                    <td className="p-3 text-slate-300">Viable only if outbound runs terminate in high-density freight hotspots (Midlands, Golden Triangle).</td>
                  </tr>
                  <tr>
                    <td className="p-3 font-bold text-white">Small Fleet (2–5 Trucks)</td>
                    <td className="p-3 text-emerald-400 font-bold">Low</td>
                    <td className="p-3 text-slate-400">Rate undercut by desperate operators on common trunk lanes.</td>
                    <td className="p-3 text-slate-300"><strong>Highly viable.</strong> Requires under 1 backload per week across the entire business.</td>
                  </tr>
                  <tr>
                    <td className="p-3 font-bold text-white">Medium/Large (6–20+ Trucks)</td>
                    <td className="p-3 text-emerald-400 font-bold">Very Low</td>
                    <td className="p-3 text-slate-400">Time wasted quoting low-margin loads during peak dispatch.</td>
                    <td className="p-3 text-slate-300"><strong>Essential tool.</strong> Subscription easily covered through overflow brokering and deadhead elimination.</td>
                  </tr>
                </tbody>
              </table>
            </div>

            {/* Non-Financial Checklist */}
            <div className="p-4 rounded-2xl bg-slate-950/80 border border-slate-800 space-y-2">
              <span className="text-xs font-bold text-slate-200">Three Non-Financial Factors to Check Before Signing:</span>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 pt-1 text-xs">
                <div className="p-2.5 rounded-xl bg-slate-900 border border-slate-800">
                  <div className="font-bold text-cyan-400">1. Deadhead Geography</div>
                  <div className="text-[11px] text-slate-400 mt-1">Midlands/M62 drops are fast to backload; rural drops (Cornwall/Highlands) require planned outbound pricing.</div>
                </div>
                <div className="p-2.5 rounded-xl bg-slate-900 border border-slate-800">
                  <div className="font-bold text-emerald-400">2. Dispatch Capacity</div>
                  <div className="text-[11px] text-slate-400 mt-1">The highest-paying spot loads on HX are accepted within 60 to 180 seconds of posting.</div>
                </div>
                <div className="p-2.5 rounded-xl bg-slate-900 border border-slate-800">
                  <div className="font-bold text-amber-400">3. Debtor Credit Control</div>
                  <div className="text-[11px] text-slate-400 mt-1">HX is direct billing on 30-to-60 day terms. Factor in credit checks vs HaulageHub automated self-billing.</div>
                </div>
              </div>
            </div>
          </div>
        )}

      </div>
    </div>
  );
};
