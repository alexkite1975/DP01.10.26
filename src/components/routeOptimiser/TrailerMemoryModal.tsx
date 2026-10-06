'use client';
import React, { useState, useMemo } from 'react';
import { VehicleProfile } from '../../types/routeOptimiserTypes';
import { formatHeightBoth, DualHeightInput } from '../../utils/heightUtils';
import { trailerFleetService } from '../../services/trailerFleetService';
import { LearnedTrailerProfile } from '../../types';
import { X, Truck, ArrowRight, Search, Building2, CheckCircle2, ShieldAlert } from 'lucide-react';

interface Props {
  isOpen: boolean;
  current: VehicleProfile;
  onSwap: (profile: VehicleProfile) => void;
  onClose: () => void;
}

export const TrailerMemoryModal: React.FC<Props> = ({ isOpen, current, onSwap, onClose }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCompanyId, setSelectedCompanyId] = useState<string>('ALL');
  const [showCustomForm, setShowCustomForm] = useState(false);

  // Custom trailer state
  const [customName, setCustomName] = useState('');
  const [customHeightM, setCustomHeightM] = useState<number>(4.45);
  const [customWeightT, setCustomWeightT] = useState<number>(44);
  const [customWidthM, setCustomWidthM] = useState<number>(2.55);
  const [customType, setCustomType] = useState('Curtainsider');

  const companies = useMemo(() => trailerFleetService.getCompanies(), []);
  const allTrailers = useMemo(() => trailerFleetService.getAllTrailers(), []);

  // Filter trailers by search & company
  const filteredTrailers = useMemo(() => {
    let list = allTrailers;
    if (selectedCompanyId !== 'ALL') {
      list = list.filter((t) => t.companyId === selectedCompanyId);
    }
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      list = list.filter(
        (t) =>
          t.trailerNumber.toLowerCase().includes(q) ||
          t.companyName.toLowerCase().includes(q) ||
          t.trailerType.toLowerCase().includes(q)
      );
    }
    return list;
  }, [allTrailers, selectedCompanyId, searchQuery]);

  if (!isOpen) return null;

  const handleSelectLearnedTrailer = (t: LearnedTrailerProfile) => {
    trailerFleetService.recordTrailerHitch(t.id);
    const newProfile: VehicleProfile = {
      height: t.heightMeters,
      weight: t.grossWeightTonnes || 44,
      width: t.widthMeters || 2.55,
      trailerType: t.trailerType,
      trailerName: `${t.companyName.split(' ')[0]} #${t.trailerNumber}`,
      axles: 6,
      euroClass: 'Euro VI'
    };
    onSwap(newProfile);
    onClose();
  };

  const handleApplyCustom = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customHeightM || customHeightM <= 0) return;

    const newProfile: VehicleProfile = {
      height: customHeightM,
      weight: customWeightT || 44,
      width: customWidthM || 2.55,
      trailerName: customName.trim() || `TRL-${Math.floor(1000 + Math.random() * 9000)}`,
      trailerType: customType,
      axles: 6,
      euroClass: 'Euro VI'
    };
    onSwap(newProfile);
    onClose();
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-3 sm:p-4 bg-slate-950/85 backdrop-blur-sm animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div
        className="bg-slate-900 border border-slate-700 rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden text-slate-100 flex flex-col max-h-[92vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-5 pt-4 pb-3 border-b border-slate-800 bg-slate-950/60 shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-blue-500/20 text-blue-400 border border-blue-500/30">
              <Truck className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white">Trailer Fleet Memory</h3>
              <p className="text-[11px] text-slate-400">
                Connected UK Haulier Database &amp; Instant Clearance Scan
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Current Active Hitch */}
        <div className="px-5 py-2.5 bg-slate-950/40 border-b border-slate-800/80 flex items-center justify-between shrink-0">
          <span className="text-xs text-slate-400 font-medium">Active Hitch:</span>
          <div className="flex items-center gap-2">
            <span className="text-xs font-mono font-bold text-amber-400">
              {current.trailerName || 'Standard Unit'}
            </span>
            <span className="text-xs font-bold text-blue-300">
              ({formatHeightBoth(current.height)})
            </span>
          </div>
        </div>

        {/* Search & Company Filter Bar */}
        <div className="p-3 bg-slate-900 border-b border-slate-800 space-y-2 shrink-0">
          <div className="flex items-center gap-2">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search trailer number (e.g. 1042) or company..."
                className="w-full bg-slate-800 border border-slate-700 rounded-xl pl-9 pr-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-blue-500"
              />
            </div>
            <button
              onClick={() => setShowCustomForm(!showCustomForm)}
              className="px-3 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700 text-xs font-semibold text-blue-400 hover:text-blue-300 transition-colors shrink-0 cursor-pointer"
            >
              {showCustomForm ? 'Fleet List' : '+ Custom'}
            </button>
          </div>

          {!showCustomForm && (
            <div className="flex items-center gap-1.5 overflow-x-auto pb-1 no-scrollbar text-xs">
              <button
                onClick={() => setSelectedCompanyId('ALL')}
                className={`px-2.5 py-1 rounded-lg text-[11px] font-semibold shrink-0 transition-colors ${
                  selectedCompanyId === 'ALL'
                    ? 'bg-blue-600 text-white'
                    : 'bg-slate-800 text-slate-400 hover:text-white'
                }`}
              >
                All Fleets ({allTrailers.length})
              </button>
              {companies.map((c) => (
                <button
                  key={c.id}
                  onClick={() => setSelectedCompanyId(c.id)}
                  className={`px-2.5 py-1 rounded-lg text-[11px] font-semibold shrink-0 transition-colors flex items-center gap-1 ${
                    selectedCompanyId === c.id
                      ? 'bg-blue-600 text-white'
                      : 'bg-slate-800 text-slate-400 hover:text-white'
                  }`}
                >
                  <span
                    className="w-1.5 h-1.5 rounded-full"
                    style={{ backgroundColor: c.primaryColor }}
                  />
                  <span>{c.code}</span>
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Content Body: Fleet List or Custom Form */}
        <div className="p-4 flex flex-col gap-2.5 overflow-y-auto flex-1">
          {!showCustomForm ? (
            filteredTrailers.length > 0 ? (
              filteredTrailers.map((t) => {
                const isActive =
                  current.trailerName?.includes(t.trailerNumber) ||
                  current.height === t.heightMeters;
                return (
                  <button
                    key={t.id}
                    onClick={() => handleSelectLearnedTrailer(t)}
                    className={`flex items-center justify-between p-3.5 rounded-xl border text-left transition-all cursor-pointer ${
                      isActive
                        ? 'border-blue-500 bg-blue-950/40 text-white shadow-md shadow-blue-500/10'
                        : 'border-slate-800 bg-slate-800/60 text-slate-300 hover:bg-slate-800 hover:border-slate-600'
                    }`}
                  >
                    <div className="min-w-0 pr-2">
                      <div className="flex items-center gap-2">
                        <span className="text-xs sm:text-sm font-bold text-white">
                          #{t.trailerNumber}
                        </span>
                        <span className="text-[11px] text-slate-400 font-medium">
                          {t.companyName}
                        </span>
                        {isActive && (
                          <span className="text-[9px] bg-blue-500/20 text-blue-300 px-1.5 py-0.2 rounded font-bold border border-blue-500/30">
                            COUPLED
                          </span>
                        )}
                      </div>
                      <p className="text-[11px] text-slate-400 mt-0.5">
                        {t.trailerType}
                        {t.isDoubleDecker ? ' · Double-Deck' : ''}
                        {t.hasTailLift ? ' · Tail-Lift' : ''}
                      </p>
                      <p className="text-[10px] text-slate-500 font-mono mt-0.5">
                        {t.lengthMeters}m Length · {t.widthMeters || 2.55}m Width
                      </p>
                    </div>

                    <div className="text-right shrink-0">
                      <p className="text-xs sm:text-sm font-mono font-bold text-blue-300">
                        {formatHeightBoth(t.heightMeters)}
                      </p>
                      <div className="mt-1 flex items-center justify-end text-[11px] text-blue-400 font-semibold gap-1">
                        <span>Hitch</span>
                        <ArrowRight className="w-3 h-3" />
                      </div>
                    </div>
                  </button>
                );
              })
            ) : (
              <div className="text-center py-8 text-slate-400 text-xs">
                <Truck className="w-8 h-8 mx-auto text-slate-600 mb-2" />
                <p>No trailers found matching "{searchQuery}".</p>
                <button
                  onClick={() => setShowCustomForm(true)}
                  className="mt-3 text-blue-400 font-bold hover:underline"
                >
                  Create Custom Trailer Profile →
                </button>
              </div>
            )
          ) : (
            /* Custom Trailer Form with Dual Height Input */
            <form onSubmit={handleApplyCustom} className="p-4 bg-slate-950/70 border border-slate-800 rounded-xl space-y-4">
              <h4 className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-1.5">
                <Building2 className="w-4 h-4 text-blue-400" />
                <span>Custom Trailer Hitch Specification</span>
              </h4>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Trailer Identification / Reg
                </label>
                <input
                  type="text"
                  value={customName}
                  onChange={(e) => setCustomName(e.target.value)}
                  placeholder="e.g. ESL-1042 or TRL-4401"
                  className="w-full px-3 py-2 rounded-lg bg-slate-800 border border-slate-700 text-xs text-white focus:outline-none focus:border-blue-500 font-mono"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Trailer Type
                </label>
                <select
                  value={customType}
                  onChange={(e) => setCustomType(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg bg-slate-800 border border-slate-700 text-xs text-white focus:outline-none focus:border-blue-500"
                >
                  <option value="Curtainsider">Curtainsider Standard (13.6m)</option>
                  <option value="Refrigerated High-Cube">Refrigerated High-Cube (4.85m)</option>
                  <option value="Double-Deck Box Van">Double-Deck Box Van (4.95m)</option>
                  <option value="Flatbed Plant Hauler">Flatbed Plant Hauler (4.20m)</option>
                  <option value="Skeletal Container Chassis">Skeletal Container Chassis (4.30m)</option>
                </select>
              </div>

              {/* Utilizing Universal DualHeightInput */}
              <div className="bg-slate-900 p-3 rounded-xl border border-slate-800">
                <label className="block text-xs font-semibold text-amber-400 mb-2">
                  Operating Overall Height (Mandatory Clearance Baseline)
                </label>
                <DualHeightInput
                  valueMeters={customHeightM}
                  onChange={(val: number) => setCustomHeightM(val)}
                  label="Trailer Total Height"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    Gross Weight (T)
                  </label>
                  <input
                    type="number"
                    value={customWeightT}
                    onChange={(e) => setCustomWeightT(parseFloat(e.target.value) || 44)}
                    className="w-full px-3 py-2 rounded-lg bg-slate-800 border border-slate-700 text-xs text-white font-mono focus:outline-none focus:border-blue-500"
                    min={7.5}
                    max={44}
                    step={0.5}
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    Overall Width (m)
                  </label>
                  <input
                    type="number"
                    value={customWidthM}
                    onChange={(e) => setCustomWidthM(parseFloat(e.target.value) || 2.55)}
                    className="w-full px-3 py-2 rounded-lg bg-slate-800 border border-slate-700 text-xs text-white font-mono focus:outline-none focus:border-blue-500"
                    min={2.0}
                    max={3.0}
                    step={0.05}
                  />
                </div>
              </div>

              <button
                type="submit"
                className="w-full py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold transition-all shadow-md shadow-blue-600/30 cursor-pointer"
              >
                Couple Trailer &amp; Run Instant Collision Scan
              </button>
            </form>
          )}
        </div>

        {/* Footer */}
        <div className="px-5 py-3 border-t border-slate-800 bg-slate-950/80 shrink-0">
          <div className="flex items-center gap-2 text-[11px] text-slate-400">
            <ShieldAlert className="w-4 h-4 text-amber-400 shrink-0" />
            <span>
              Coupled dimensions sync automatically with DVSA Vehicle Check &amp; In-Cab Bridge Radar.
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
