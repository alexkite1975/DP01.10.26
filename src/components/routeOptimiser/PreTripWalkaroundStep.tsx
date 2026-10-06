'use client';
import React from 'react';
import { VehicleProfile } from '../../types/routeOptimiserTypes';
import { formatHeightBoth } from '../../utils/heightUtils';
import {
  CheckCircle2,
  ShieldCheck,
  Truck,
  AlertTriangle,
  ArrowRight,
  Sparkles,
  RefreshCw,
  Eye,
  Volume2,
  Activity,
  Layers,
  Check
} from 'lucide-react';

interface PreTripWalkaroundStepProps {
  vehicle: VehicleProfile;
  driverReg?: string;
  onOpenTrailerModal: () => void;
  onOpenFullChecklist?: () => void;
  onProceedToTourPlanning: () => void;
}

export const PreTripWalkaroundStep: React.FC<PreTripWalkaroundStepProps> = ({
  vehicle,
  driverReg = 'KX72 WYZ',
  onOpenTrailerModal,
  onOpenFullChecklist,
  onProceedToTourPlanning,
}) => {
  const heightBoth = formatHeightBoth(vehicle.height);

  return (
    <div className="flex-1 flex flex-col h-full bg-slate-950 text-slate-100 overflow-y-auto p-4 sm:p-6">
      <div className="max-w-4xl mx-auto w-full space-y-6">
        {/* Step Banner */}
        <div className="bg-gradient-to-r from-blue-900/40 via-slate-900 to-slate-900 border border-blue-500/30 rounded-3xl p-5 sm:p-6 shadow-xl">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2">
                <span className="px-2.5 py-0.5 rounded-full bg-blue-500/20 text-blue-300 font-mono font-bold text-xs border border-blue-500/30">
                  STEP 1 OF 3 · PRE-TRIP DISPATCH
                </span>
                <span className="text-xs px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 font-bold border border-emerald-500/30">
                  DVSA STATUTORY
                </span>
              </div>
              <h2 className="text-xl sm:text-2xl font-black text-white mt-1">
                Vehicle &amp; Trailer Roadworthiness Verification
              </h2>
              <p className="text-xs sm:text-sm text-slate-300 mt-1 max-w-xl">
                Verify tractor-trailer combination and statutory height card clearance before commencing the tour dispatch schedule.
              </p>
            </div>

            <button
              onClick={onProceedToTourPlanning}
              className="px-5 py-3 rounded-2xl bg-blue-600 hover:bg-blue-500 text-white font-extrabold text-sm flex items-center justify-center gap-2 shadow-lg shadow-blue-600/30 transition-all cursor-pointer shrink-0"
            >
              <span>Confirm &amp; Plan Tour</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Combination Specification Card */}
        <div className="bg-slate-900/80 rounded-3xl border border-slate-800 p-5 sm:p-6 space-y-4">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <div className="flex items-center gap-2">
              <Truck className="w-5 h-5 text-blue-400" />
              <h3 className="text-base font-extrabold text-white">
                Active Articulated Combination
              </h3>
            </div>
            <button
              onClick={onOpenTrailerModal}
              className="text-xs px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-cyan-300 font-bold border border-slate-700 flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span>Trailer Fleet Memory Swap</span>
            </button>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className="p-3.5 rounded-2xl bg-slate-950/60 border border-slate-800/80">
              <span className="text-[11px] font-bold text-slate-400 block uppercase">
                Tractor Unit
              </span>
              <span className="text-base font-black text-white font-mono mt-0.5 block">
                {driverReg}
              </span>
              <span className="text-[10px] text-slate-500">6x2 Mid-lift Artic</span>
            </div>

            <div className="p-3.5 rounded-2xl bg-slate-950/60 border border-slate-800/80">
              <span className="text-[11px] font-bold text-slate-400 block uppercase">
                Trailer Unit
              </span>
              <span className="text-base font-black text-cyan-300 font-mono mt-0.5 block truncate">
                {vehicle.trailerName || 'TRL-4422'}
              </span>
              <span className="text-[10px] text-slate-500 truncate block">
                {vehicle.trailerType}
              </span>
            </div>

            <div className="p-3.5 rounded-2xl bg-amber-950/20 border border-amber-500/30">
              <span className="text-[11px] font-bold text-amber-400 block uppercase">
                Operating Height
              </span>
              <span className="text-base font-black text-amber-300 font-mono mt-0.5 block">
                {heightBoth}
              </span>
              <span className="text-[10px] text-amber-400/80">Cab Height Card Synced</span>
            </div>

            <div className="p-3.5 rounded-2xl bg-slate-950/60 border border-slate-800/80">
              <span className="text-[11px] font-bold text-slate-400 block uppercase">
                Gross Weight / Axles
              </span>
              <span className="text-base font-black text-white font-mono mt-0.5 block">
                {vehicle.weight}T · {vehicle.axles || 6} Axles
              </span>
              <span className="text-[10px] text-emerald-400">Class VI · ULEZ Ready</span>
            </div>
          </div>
        </div>

        {/* 32-Point Statutory Checklist Overview */}
        <div className="bg-slate-900/80 rounded-3xl border border-slate-800 p-5 sm:p-6 space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800 pb-3">
            <div>
              <h3 className="text-base font-extrabold text-white flex items-center gap-2">
                <ShieldCheck className="w-5 h-5 text-emerald-400" />
                <span>DVSA 32-Point Statutory Walkaround Status</span>
              </h3>
              <p className="text-xs text-slate-400 mt-0.5">
                All mandatory road safety inspection groups confirmed roadworthy for long-distance linehaul.
              </p>
            </div>

            {onOpenFullChecklist && (
              <button
                onClick={onOpenFullChecklist}
                className="text-xs px-3.5 py-2 rounded-xl bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-300 font-bold border border-emerald-500/40 flex items-center gap-1.5 transition-colors cursor-pointer shrink-0"
              >
                <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
                <span>Open Conversational Checklist</span>
              </button>
            )}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="p-4 rounded-2xl bg-slate-950/50 border border-slate-800 flex items-start gap-3">
              <div className="w-8 h-8 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center shrink-0">
                <Check className="w-4 h-4" />
              </div>
              <div>
                <span className="text-xs font-bold text-white block">
                  1. In-Cab Safety &amp; Tachograph
                </span>
                <span className="text-[11px] text-slate-400 block mt-0.5">
                  Tacho driver card calibrated, digital clock sync, mirrors adjusted, windscreen washers &amp; wipers clear.
                </span>
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-slate-950/50 border border-slate-800 flex items-start gap-3">
              <div className="w-8 h-8 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center shrink-0">
                <Check className="w-4 h-4" />
              </div>
              <div>
                <span className="text-xs font-bold text-white block">
                  2. Coupling, Suzie Lines &amp; Air System
                </span>
                <span className="text-[11px] text-slate-400 block mt-0.5">
                  5th-wheel dog clip engaged, dog pin locked, red &amp; yellow air lines sealed, acoustic air leak test passed.
                </span>
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-slate-950/50 border border-slate-800 flex items-start gap-3">
              <div className="w-8 h-8 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center shrink-0">
                <Check className="w-4 h-4" />
              </div>
              <div>
                <span className="text-xs font-bold text-white block">
                  3. Running Gear &amp; Tyres
                </span>
                <span className="text-[11px] text-slate-400 block mt-0.5">
                  Wheel nut indicators aligned, tread depth &gt;1mm across all axles, no sidewall bulges or cuts.
                </span>
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-slate-950/50 border border-slate-800 flex items-start gap-3">
              <div className="w-8 h-8 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center shrink-0">
                <Check className="w-4 h-4" />
              </div>
              <div>
                <span className="text-xs font-bold text-white block">
                  4. Height Clearance &amp; Load Security
                </span>
                <span className="text-[11px] text-slate-400 block mt-0.5">
                  In-cab height card set to {heightBoth}. Rear barn doors latched. Security seals intact.
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Action Footer */}
        <div className="flex flex-col sm:flex-row items-center justify-between p-5 rounded-3xl bg-slate-900 border border-slate-800 gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-blue-600/20 text-blue-400 border border-blue-500/30 flex items-center justify-center font-bold">
              1/3
            </div>
            <div>
              <span className="text-sm font-extrabold text-white block">
                Pre-Trip Verification Completed
              </span>
              <span className="text-xs text-slate-400">
                Next: View your 5-day Amazon Relay shift schedule and optimize empty drops.
              </span>
            </div>
          </div>

          <button
            onClick={onProceedToTourPlanning}
            className="w-full sm:w-auto px-6 py-3 rounded-2xl bg-blue-600 hover:bg-blue-500 text-white font-black text-sm flex items-center justify-center gap-2 shadow-lg shadow-blue-600/30 transition-all cursor-pointer"
          >
            <span>Proceed to Step 2: Tour &amp; Clearance Dispatch</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default PreTripWalkaroundStep;
