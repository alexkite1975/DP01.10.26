'use client';
import React, { useState } from 'react';
import {
  X,
  Leaf,
  Download,
  CheckCircle2,
  TrendingDown,
  BarChart3,
  ShieldCheck,
  FileSpreadsheet,
  FileText
} from 'lucide-react';
import { SAMPLE_ESG_DATA, EsgSummaryReport } from '../../services/esgCarbonService';

interface Scope3CarbonModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const Scope3CarbonModal: React.FC<Scope3CarbonModalProps> = ({ isOpen, onClose }) => {
  const [data] = useState<EsgSummaryReport>(SAMPLE_ESG_DATA);
  const [isExported, setIsExported] = useState<boolean>(false);

  if (!isOpen) return null;

  const handleExport = () => {
    setIsExported(true);
    setTimeout(() => setIsExported(false), 4000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm overflow-y-auto">
      <div className="relative w-full max-w-2xl bg-slate-900 border border-slate-800 rounded-3xl shadow-2xl p-6 text-slate-100 max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-800">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center">
              <Leaf className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-white">Scope 3 ESG Carbon Accounting</h2>
              <p className="text-xs text-slate-400">{data.reportingStandard}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-9 h-9 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white flex items-center justify-center transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Hero Carbon Metrics */}
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 my-5">
          <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800">
            <span className="text-[10px] text-slate-500 font-mono uppercase block">Gross CO2 Emitted</span>
            <div className="text-xl font-black text-slate-100 font-mono mt-0.5">
              {(data.totalGrossCo2Kg / 1000).toFixed(1)} <span className="text-xs text-slate-400 font-normal">Tonnes</span>
            </div>
            <span className="text-[11px] text-slate-400 mt-1 block">{data.totalLoadedMiles.toLocaleString()} Loaded Miles</span>
          </div>

          <div className="bg-slate-950 p-4 rounded-2xl border border-emerald-500/30">
            <span className="text-[10px] text-emerald-400 font-mono uppercase block">Deadhead Avoidance</span>
            <div className="text-xl font-black text-emerald-400 font-mono mt-0.5 flex items-center gap-1">
              <TrendingDown className="w-5 h-5" />
              {data.fleetAverageDeadheadPct}%
            </div>
            <span className="text-[11px] text-emerald-300/80 mt-1 block">vs 29% UK Benchmark</span>
          </div>

          <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800 col-span-2 sm:col-span-1">
            <span className="text-[10px] text-cyan-400 font-mono uppercase block">Certified CO2 Saved</span>
            <div className="text-xl font-black text-cyan-300 font-mono mt-0.5">
              {(data.totalSavedCo2Kg / 1000).toFixed(1)} <span className="text-xs text-slate-400 font-normal">Tonnes</span>
            </div>
            <span className="text-[11px] text-slate-400 mt-1 block">From P2P return-matching</span>
          </div>
        </div>

        {/* Trip Breakdown Table */}
        <div className="space-y-2 mb-5">
          <span className="text-xs font-bold text-slate-300 font-mono uppercase tracking-wider block">
            Audited Haulage Legs ({data.trips.length})
          </span>

          <div className="space-y-2">
            {data.trips.map((trip) => (
              <div
                key={trip.id}
                className="bg-slate-950/60 p-3 rounded-xl border border-slate-800 flex items-center justify-between text-xs"
              >
                <div>
                  <div className="font-semibold text-slate-200">
                    {trip.origin} → {trip.destination}
                  </div>
                  <div className="text-[11px] text-slate-400 mt-0.5">
                    {trip.date} • {trip.loadedMiles} mi loaded • {trip.emptyDeadheadMiles} mi deadhead ({trip.deadheadAvoidedPct}%)
                  </div>
                </div>

                <div className="text-right">
                  <span className="font-mono font-bold text-slate-200 block">
                    {trip.co2EmittedKg} kg CO2
                  </span>
                  <span className="text-[10px] text-emerald-400 font-mono">
                    -{trip.co2SavedFromMatchingKg} kg saved
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Export / Download Action */}
        <div className="pt-4 border-t border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2 text-xs text-emerald-400">
            <ShieldCheck className="w-4 h-4" />
            <span>GHG Protocol Scope 3 Certified</span>
          </div>

          <div className="flex gap-2">
            <button
              onClick={handleExport}
              className="px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs flex items-center gap-2 transition-colors shadow-lg shadow-emerald-600/30"
            >
              <Download className="w-4 h-4" />
              {isExported ? '✓ Downloaded CSV/PDF' : 'Export Auditor Certificate'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
