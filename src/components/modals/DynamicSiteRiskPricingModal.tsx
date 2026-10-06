'use client';
import React, { useState } from 'react';
import {
  X,
  TrendingUp,
  Percent,
  AlertTriangle,
  Building2,
  DollarSign,
  ShieldAlert,
  Clock,
  ArrowRight,
  CheckCircle2,
  Sparkles,
  MapPin,
  Sliders
} from 'lucide-react';
import { INITIAL_SITES } from '../../data/initialSites';

interface DynamicSiteRiskPricingModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const DynamicSiteRiskPricingModal: React.FC<DynamicSiteRiskPricingModalProps> = ({
  isOpen,
  onClose
}) => {
  const [selectedSiteId, setSelectedSiteId] = useState<string>(INITIAL_SITES[0]?.id || 'site-dirft-daventry');
  const [baseMileage, setBaseMileage] = useState<number>(115);
  const [baseRatePerMile, setBaseRatePerMile] = useState<number>(2.60);
  const [includeDvsCaz, setIncludeDvsCaz] = useState<boolean>(false);
  const [includeOffloadComplexity, setIncludeOffloadComplexity] = useState<boolean>(true);

  if (!isOpen) return null;

  const selectedSite = INITIAL_SITES.find((s) => s.id === selectedSiteId) || INITIAL_SITES[0];

  // Dynamic risk calculation based on actual site properties
  const isHighRisk = selectedSite.overallRiskLevel === 'HIGH' || selectedSite.overallRiskLevel === 'CRITICAL';
  const baselineHazardsCount = selectedSite.businessSection.baselineHazards?.length || 2;
  const dwellHistoryMinutes = selectedSite.congestionTracker?.avgTurnaroundMinutes || 75;

  // Dwell risk premium: if dwell > 60 mins, add +£0.20/mi, if > 90 mins add +£0.35/mi
  const dwellSurchargePerMile = dwellHistoryMinutes > 90 ? 0.35 : dwellHistoryMinutes > 60 ? 0.20 : 0.05;
  
  // Access difficulty surcharge (bridges, tight turns, reversing)
  const accessSurchargePerMile = isHighRisk ? 0.25 : 0.10;

  // HSE Hazard rating surcharge
  const hazardSurchargePerMile = baselineHazardsCount > 3 ? 0.15 : 0.05;

  // DVS / Clean Air Zone fee
  const dvsCazSurchargePerMile = includeDvsCaz ? 0.20 : 0.00;

  // Offload complexity (tail-lift, manual pallet pump)
  const offloadSurchargePerMile = includeOffloadComplexity ? 0.15 : 0.00;

  // Total adjustments
  const totalRiskAdjustmentPerMile = +(
    dwellSurchargePerMile +
    accessSurchargePerMile +
    hazardSurchargePerMile +
    dvsCazSurchargePerMile +
    offloadSurchargePerMile
  ).toFixed(2);

  const recommendedRatePerMile = +(baseRatePerMile + totalRiskAdjustmentPerMile).toFixed(2);

  const standardFlatQuote = +(baseMileage * baseRatePerMile).toFixed(2);
  const recommendedRiskAdjustedQuote = +(baseMileage * recommendedRatePerMile).toFixed(2);
  const protectedMarginGbp = +(recommendedRiskAdjustedQuote - standardFlatQuote).toFixed(2);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-slate-950/85 backdrop-blur-md overflow-y-auto">
      <div className="relative w-full max-w-4xl bg-slate-900 border border-slate-800 rounded-3xl shadow-2xl p-5 sm:p-7 text-slate-100 max-h-[92vh] overflow-y-auto space-y-6">
        
        {/* Header */}
        <div className="flex items-start justify-between pb-4 border-b border-slate-800">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-cyan-500 via-blue-600 to-indigo-600 text-slate-950 flex items-center justify-center shadow-lg shadow-cyan-500/20 font-black">
              <TrendingUp className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-lg sm:text-xl font-extrabold text-white">
                  Dynamic, Risk-Adjusted Freight Pricing Engine
                </h2>
                <span className="rounded-md bg-cyan-500/20 px-2 py-0.5 text-[10px] font-mono font-bold text-cyan-300 border border-cyan-500/30">
                  Gap 3 Solution
                </span>
              </div>
              <p className="text-xs text-slate-400 mt-0.5">
                Automatically price spot loads based on destination site difficulty, historical dwell friction &amp; access complexity
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

        {/* The Industry Gap Diagnostic Banner */}
        <div className="p-3.5 rounded-2xl bg-slate-950 border border-slate-800 text-xs space-y-1">
          <span className="text-amber-400 font-bold flex items-center gap-1.5">
            <AlertTriangle className="w-4 h-4" />
            The UK Transport Industry Flat-Rate Flaw:
          </span>
          <p className="text-slate-300 text-[11px] leading-relaxed">
            Hauliers routinely quote flat rates (e.g. £2.60/mile) regardless of whether delivering to a seamless modern logistics park or a congested urban depot with narrow access and 3-hour bay delays. This engine protects profit margins by calculating destination-specific risk factors.
          </p>
        </div>

        {/* Main Configuration Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          
          {/* Left Column: Quotation Inputs */}
          <div className="p-5 rounded-2xl bg-slate-950/70 border border-slate-800 space-y-4">
            <span className="text-xs font-bold text-white uppercase tracking-wider block">
              1. Delivery Destination &amp; Baseline
            </span>

            {/* Destination Site Selector */}
            <div className="space-y-1">
              <label className="text-xs text-slate-300 font-medium">Select Delivery Site in Network:</label>
              <select
                value={selectedSiteId}
                onChange={(e) => setSelectedSiteId(e.target.value)}
                className="w-full rounded-xl bg-slate-900 border border-slate-700 px-3 py-2 text-xs font-bold text-white focus:outline-none"
              >
                {INITIAL_SITES.map((site) => (
                  <option key={site.id} value={site.id}>
                    {site.title} ({site.overallRiskLevel} RISK • {site.address.split(',')[1] || site.address})
                  </option>
                ))}
              </select>
            </div>

            {/* Mileage Slider */}
            <div className="space-y-1">
              <div className="flex justify-between text-xs">
                <span className="text-slate-300">One-Way Loaded Distance:</span>
                <span className="font-mono font-bold text-cyan-400">{baseMileage} miles</span>
              </div>
              <input
                type="range"
                min="20"
                max="300"
                step="5"
                value={baseMileage}
                onChange={(e) => setBaseMileage(Number(e.target.value))}
                className="w-full accent-cyan-400"
              />
            </div>

            {/* Standard Base Rate Slider */}
            <div className="space-y-1">
              <div className="flex justify-between text-xs">
                <span className="text-slate-300">Standard Base Rate (Flat Rate):</span>
                <span className="font-mono font-bold text-white">£{baseRatePerMile.toFixed(2)} / mi</span>
              </div>
              <input
                type="range"
                min="1.80"
                max="3.50"
                step="0.05"
                value={baseRatePerMile}
                onChange={(e) => setBaseRatePerMile(Number(e.target.value))}
                className="w-full accent-blue-500"
              />
            </div>

            {/* Toggles */}
            <div className="space-y-2 pt-1 border-t border-slate-800 text-xs">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={includeDvsCaz}
                  onChange={(e) => setIncludeDvsCaz(e.target.checked)}
                  className="rounded accent-cyan-500"
                />
                <span className="text-slate-300">Route enters London DVS / Clean Air Zone (+£0.20/mi)</span>
              </label>

              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={includeOffloadComplexity}
                  onChange={(e) => setIncludeOffloadComplexity(e.target.checked)}
                  className="rounded accent-cyan-500"
                />
                <span className="text-slate-300">Offloading complexity (tail-lift or driver pump truck required) (+£0.15/mi)</span>
              </label>
            </div>
          </div>

          {/* Right Column: Dynamic Price Recommendation */}
          <div className="p-5 rounded-2xl bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 border border-cyan-500/40 flex flex-col justify-between space-y-4">
            <div>
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                  2. Risk Breakdown &amp; Quote Verdict
                </span>
                <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-cyan-500/20 text-cyan-300 border border-cyan-500/30">
                  {selectedSite.overallRiskLevel} Yard Friction
                </span>
              </div>

              {/* Surcharge Breakdown Table */}
              <div className="mt-3 space-y-2 text-xs">
                <div className="p-2.5 rounded-lg bg-slate-950 border border-slate-800 space-y-1.5 font-mono text-[11px]">
                  <div className="flex justify-between text-slate-300">
                    <span>Base Mileage Rate:</span>
                    <span>£{baseRatePerMile.toFixed(2)}/mi</span>
                  </div>
                  <div className="flex justify-between text-amber-400">
                    <span>+ Historic Dwell Risk ({dwellHistoryMinutes}m avg):</span>
                    <span>+£{dwellSurchargePerMile.toFixed(2)}/mi</span>
                  </div>
                  <div className="flex justify-between text-amber-400">
                    <span>+ Yard Access &amp; Bridge Surcharge:</span>
                    <span>+£{accessSurchargePerMile.toFixed(2)}/mi</span>
                  </div>
                  <div className="flex justify-between text-amber-400">
                    <span>+ HSE Hazard Severity ({baselineHazardsCount} hazards):</span>
                    <span>+£{hazardSurchargePerMile.toFixed(2)}/mi</span>
                  </div>
                  {includeDvsCaz && (
                    <div className="flex justify-between text-cyan-400">
                      <span>+ London DVS / CAZ Permit Fee:</span>
                      <span>+£0.20/mi</span>
                    </div>
                  )}
                  {includeOffloadComplexity && (
                    <div className="flex justify-between text-cyan-400">
                      <span>+ Offload Handling Complexity:</span>
                      <span>+£0.15/mi</span>
                    </div>
                  )}
                  <div className="flex justify-between text-emerald-400 font-bold border-t border-slate-800 pt-1 text-xs">
                    <span>Recommended Dynamic Rate:</span>
                    <span>£{recommendedRatePerMile.toFixed(2)} / mi</span>
                  </div>
                </div>
              </div>

              {/* Total Quote Comparison */}
              <div className="grid grid-cols-2 gap-2 text-center text-xs mt-3">
                <div className="p-3 rounded-xl bg-slate-950 border border-slate-800">
                  <div className="text-[10px] text-slate-400">Unadjusted Flat Quote</div>
                  <div className="text-base font-bold text-slate-400 font-mono mt-0.5">£{standardFlatQuote}</div>
                </div>
                <div className="p-3 rounded-xl bg-cyan-950/40 border border-cyan-500/50">
                  <div className="text-[10px] text-cyan-300 font-bold">Recommended Quote</div>
                  <div className="text-base font-black text-cyan-300 font-mono mt-0.5">£{recommendedRiskAdjustedQuote}</div>
                </div>
              </div>
            </div>

            {/* Protected Margin Notification */}
            <div className="p-3 rounded-xl bg-emerald-950/30 border border-emerald-500/40 text-xs space-y-1">
              <div className="font-bold text-emerald-300 flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                <span>Protected Margin: +£{protectedMarginGbp}</span>
              </div>
              <p className="text-[11px] text-slate-300 leading-relaxed">
                By pricing in destination site risk upfront, you avoid absorbing £{protectedMarginGbp} in uncompensated congestion and access friction.
              </p>
            </div>

          </div>

        </div>

        {/* Footer */}
        <div className="flex items-center justify-between pt-2">
          <span className="text-xs text-slate-400">Site Risk Pro Telematics Engine • UK Road Freight Gap 3</span>
          <button
            onClick={onClose}
            className="px-5 py-2 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 text-xs font-black transition-colors"
          >
            Apply to Active Quote • Close
          </button>
        </div>

      </div>
    </div>
  );
};
