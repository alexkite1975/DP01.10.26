'use client';
import React, { useState } from 'react';
import {
  X,
  Layers,
  Shield,
  Zap,
  DollarSign,
  Truck,
  Repeat,
  AlertOctagon,
  ArrowRight,
  CheckCircle2,
  Lock,
  ChevronRight,
  TrendingUp,
  FileCheck,
  Clock
} from 'lucide-react';

interface ThreeTierLogisticsStackModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ThreeTierLogisticsStackModal: React.FC<ThreeTierLogisticsStackModalProps> = ({
  isOpen,
  onClose
}) => {
  const [selectedProfile, setSelectedProfile] = useState<'SOLO' | 'SMALL' | 'MED_LARGE' | 'BROKER'>('SMALL');

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-slate-950/85 backdrop-blur-md overflow-y-auto">
      <div className="relative w-full max-w-4xl bg-slate-900 border border-slate-800 rounded-3xl shadow-2xl p-5 sm:p-7 text-slate-100 max-h-[92vh] overflow-y-auto space-y-6">
        
        {/* Header */}
        <div className="flex items-start justify-between pb-4 border-b border-slate-800">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-indigo-500 via-blue-600 to-cyan-500 text-slate-950 flex items-center justify-center shadow-lg shadow-indigo-500/20 font-black">
              <Layers className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-lg sm:text-xl font-extrabold text-white">
                  The Hybrid Three-Tier Logistics Stack Architecture
                </h2>
                <span className="rounded-md bg-indigo-500/20 px-2 py-0.5 text-[10px] font-mono font-bold text-indigo-300 border border-indigo-500/30">
                  UK Best Practice
                </span>
              </div>
              <p className="text-xs text-slate-400 mt-0.5">
                Integrating HaulageHub cash liquidity, Haulage Exchange spot volume, and RHA legal demurrage enforcement into a single operational stack
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

        {/* The Three Structural Bottlenecks */}
        <div className="space-y-2">
          <span className="text-xs font-bold text-slate-300 uppercase tracking-wider block">
            Why Single-Platform Strategies Fail: The 3 Structural Bottlenecks
          </span>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs">
            <div className="p-3.5 rounded-xl border border-slate-800 bg-slate-950/70 space-y-1.5">
              <div className="font-bold text-rose-400 flex items-center gap-1.5">
                <AlertOctagon className="w-4 h-4" />
                <span>1. Liquidity vs Cost Overhead</span>
              </div>
              <p className="text-slate-400 text-[11px] leading-relaxed">
                Haulage Exchange offers deep daily volume (~15k loads) but locks hauliers into £3k–£6.5k annual contracts. HaulageHub has £0 fees but lower ad-hoc spot liquidity.
              </p>
            </div>

            <div className="p-3.5 rounded-xl border border-slate-800 bg-slate-950/70 space-y-1.5">
              <div className="font-bold text-amber-400 flex items-center gap-1.5">
                <Clock className="w-4 h-4" />
                <span>2. Working Capital &amp; Debtor Lag</span>
              </div>
              <p className="text-slate-400 text-[11px] leading-relaxed">
                Member-to-member boards create a 30- to 60-day lag between diesel spend and payment receipt, demanding heavy credit checking and debt collection overhead.
              </p>
            </div>

            <div className="p-3.5 rounded-xl border border-slate-800 bg-slate-950/70 space-y-1.5">
              <div className="font-bold text-cyan-400 flex items-center gap-1.5">
                <DollarSign className="w-4 h-4" />
                <span>3. Operational Demurrage Leakage</span>
              </div>
              <p className="text-slate-400 text-[11px] leading-relaxed">
                Unsubstantiated waiting time costs UK hauliers 4% to 7% of billable revenue annually due to missed gatehouse sign-offs and weak legal claims under RHA Conditions.
              </p>
            </div>
          </div>
        </div>

        {/* The Blueprint: 3 Layers Visualizer */}
        <div className="p-5 rounded-2xl border border-indigo-500/30 bg-gradient-to-b from-slate-950 to-slate-900 space-y-4">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <div>
              <span className="text-xs font-mono font-bold text-indigo-400 uppercase">Operational Architecture</span>
              <h3 className="text-sm font-black text-white">The Hybrid Three-Tier Logistics Stack</h3>
            </div>
            <div className="text-right">
              <span className="text-[10px] text-slate-400 block">Baseline Core Volume:</span>
              <span className="text-xs font-bold text-emerald-400">65% – 75% Primary B2B Accounts</span>
            </div>
          </div>

          <div className="space-y-3">
            
            {/* LAYER 1 */}
            <div className="p-4 rounded-xl border border-blue-500/30 bg-blue-950/20 space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="w-6 h-6 rounded-lg bg-blue-500 text-slate-950 text-xs font-black flex items-center justify-center">L1</span>
                  <span className="font-bold text-sm text-blue-300">Working Capital &amp; Baseline Route Security (HaulageHub)</span>
                </div>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-blue-500/20 text-blue-200 font-bold border border-blue-500/30">
                  £0 / Month Fixed Cost
                </span>
              </div>
              <p className="text-xs text-slate-300 leading-relaxed">
                Route regular contracted lanes and standard return routes through HaulageHub. Deploy <strong>Fast-Pay (8–24 hours)</strong> selectively during month-end payroll or diesel spikes to maintain liquid cash reserves without invoice discounting fees or bank overdrafts. Automated self-billing eliminates back-office invoicing.
              </p>
            </div>

            {/* LAYER 2 */}
            <div className="p-4 rounded-xl border border-cyan-500/30 bg-cyan-950/20 space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="w-6 h-6 rounded-lg bg-cyan-400 text-slate-950 text-xs font-black flex items-center justify-center">L2</span>
                  <span className="font-bold text-sm text-cyan-300">On-Demand Density &amp; Subcontracting (Haulage Exchange)</span>
                </div>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-cyan-500/20 text-cyan-200 font-bold border border-cyan-500/30">
                  ~£260 to £550+ / Mo Overhead
                </span>
              </div>
              <p className="text-xs text-slate-300 leading-relaxed">
                Deploy the <strong>1-Load-Per-Week Rule</strong>: traffic desks capture 2 to 4 return spot loads per month to clear the platform fee. Broadcast empty trucks via Smart Matching 30 minutes before delivery to capture urgent loads paying £2.50 to £3.20+/mile. Offload peak overflow onto vetted subcontractors for a risk-free <strong>10% to 15% booking margin</strong>.
              </p>
            </div>

            {/* LAYER 3 */}
            <div className="p-4 rounded-xl border border-amber-500/30 bg-amber-950/20 space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="w-6 h-6 rounded-lg bg-amber-400 text-slate-950 text-xs font-black flex items-center justify-center">L3</span>
                  <span className="font-bold text-sm text-amber-300">Risk Protection &amp; Legal Demurrage Enforcement (RHA SOP-014)</span>
                </div>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-amber-500/20 text-amber-200 font-bold border border-amber-500/30">
                  Zero Revenue Leakage
                </span>
              </div>
              <p className="text-xs text-slate-300 leading-relaxed">
                Enforce the <strong>&gt;85% Counterparty Credit Rule</strong>: never haul for posters with unverified ratings. Execute the 5-step on-site demurrage protocol (Gate arrival sign-off ➔ T-30 advance notice to customer ➔ Dual time sign-off on POD ➔ GPS geofence audit export) under legal binding of RHA Conditions (Condition 16 &amp; 14).
              </p>
            </div>

          </div>
        </div>

        {/* Implementation Matrix by Fleet Size */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-300 uppercase tracking-wider">
              Implementation Matrix by Business Profile
            </span>
            <div className="flex items-center gap-1.5">
              {[
                { id: 'SOLO', label: 'Solo (1 Truck)' },
                { id: 'SMALL', label: 'Small (2–7)' },
                { id: 'MED_LARGE', label: 'Med/Large (8–30+)' },
                { id: 'BROKER', label: 'Broker/3PL' }
              ].map((b) => (
                <button
                  key={b.id}
                  onClick={() => setSelectedProfile(b.id as any)}
                  className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all ${
                    selectedProfile === b.id
                      ? 'bg-cyan-500 text-slate-950 font-extrabold'
                      : 'bg-slate-950 border border-slate-800 text-slate-400 hover:text-white'
                  }`}
                >
                  {b.label}
                </button>
              ))}
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-slate-950/70 border border-slate-800 text-xs space-y-2">
            {selectedProfile === 'SOLO' && (
              <div>
                <div className="font-bold text-white text-sm">Solo Owner-Driver (1 Truck)</div>
                <div className="text-cyan-400 font-bold mt-1">Recommended Configuration: HaulageHub (Primary) + Returnloads (Backup)</div>
                <p className="text-slate-300 mt-1 leading-relaxed">
                  Avoids HX's costly 12-month lock-in contract (£3,120/yr). Fast-Pay (8-24 hours) keeps fuel tanks full without cash shortfalls or factoring interest.
                </p>
              </div>
            )}

            {selectedProfile === 'SMALL' && (
              <div>
                <div className="font-bold text-white text-sm">Small Fleet (2–7 Vehicles)</div>
                <div className="text-emerald-400 font-bold mt-1">Recommended Configuration: HaulageHub + Haulage Exchange (Small Fleet Tier)</div>
                <p className="text-slate-300 mt-1 leading-relaxed">
                  Recovers the £260/mo HX cost within the first 4 days of each month through 1 return load; uses HaulageHub for immediate cash settlement on designated runs.
                </p>
              </div>
            )}

            {selectedProfile === 'MED_LARGE' && (
              <div>
                <div className="font-bold text-white text-sm">Medium / Large Fleet (8–30+ Vehicles)</div>
                <div className="text-indigo-400 font-bold mt-1">Recommended Configuration: Haulage Exchange (Med/Large) + HaulageHub Enterprise + API TMS</div>
                <p className="text-slate-300 mt-1 leading-relaxed">
                  HX captures daily overflow work and same-day backloads across national corridors; HaulageHub handles automated enterprise subcontracting, Scope 3 ESG carbon auditing, and live control-tower tracking.
                </p>
              </div>
            )}

            {selectedProfile === 'BROKER' && (
              <div>
                <div className="font-bold text-white text-sm">Freight Broker / Non-Asset 3PL</div>
                <div className="text-amber-400 font-bold mt-1">Recommended Configuration: Haulage Exchange (Forwarder Max) + HaulageHub Control Tower</div>
                <p className="text-slate-300 mt-1 leading-relaxed">
                  Maximises instant access to carrier capacity across the UK while retaining end-to-end GPS and e-POD visibility for commercial retail clients.
                </p>
              </div>
            )}
          </div>
        </div>

      </div>
    </div>
  );
};
