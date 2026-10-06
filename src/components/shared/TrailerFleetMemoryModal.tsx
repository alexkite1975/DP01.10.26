'use client';
import React, { useState, useEffect, useRef } from 'react';
import {
  X,
  Truck,
  Building2,
  Search,
  CheckCircle2,
  AlertTriangle,
  Plus,
  ArrowRight,
  ShieldCheck,
  Camera,
  Layers,
  Clock,
  Sparkles,
  SlidersHorizontal,
  BookmarkCheck,
  RotateCcw,
  Hash,
  Ruler,
  Scale
} from 'lucide-react';
import { DriverVehicleProfile, HaulageCompany, LearnedTrailerProfile, TrailerType } from '../types';
import {
  trailerFleetService,
  metersToFeetInches,
  feetInchesToMeters
} from '../services/trailerFleetService';
import { DualHeightInput, formatHeightBoth } from '../../utils/heightUtils';

interface TrailerFleetMemoryModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentProfile: DriverVehicleProfile;
  onHitchTrailer: (updatedProfile: DriverVehicleProfile) => void;
}

export const TrailerFleetMemoryModal: React.FC<TrailerFleetMemoryModalProps> = ({
  isOpen,
  onClose,
  currentProfile,
  onHitchTrailer
}) => {
  const [companies, setCompanies] = useState<HaulageCompany[]>(() => trailerFleetService.getCompanies());
  const [selectedCompanyId, setSelectedCompanyId] = useState<string>('stobart');
  const [searchTrailerNum, setSearchTrailerNum] = useState<string>('1042');
  const [trailers, setTrailers] = useState<LearnedTrailerProfile[]>(() => trailerFleetService.getAllTrailers());
  const [showAddModal, setShowAddModal] = useState<boolean>(false);
  const [showAddCompanyModal, setShowAddCompanyModal] = useState<boolean>(false);
  const [newCompanyName, setNewCompanyName] = useState<string>('');

  // New Trailer Form State
  const [newTrailerNum, setNewTrailerNum] = useState<string>('');
  const [newTrailerType, setNewTrailerType] = useState<TrailerType>('CURTAINSIDER');
  const [newHeightM, setNewHeightM] = useState<number>(4.45);
  const [newLengthM, setNewLengthM] = useState<number>(13.6);
  const [newWidthM, setNewWidthM] = useState<number>(2.55);
  const [newWeightT, setNewWeightT] = useState<number>(44);
  const [newHasTailLift, setNewHasTailLift] = useState<boolean>(false);
  const [newIsDoubleDecker, setNewIsDoubleDecker] = useState<boolean>(false);
  const [newNotes, setNewNotes] = useState<string>('');
  const [scannedPlateText, setScannedPlateText] = useState<string | null>(null);

  useEffect(() => {
    if (isOpen) {
      refreshData();
    }
  }, [isOpen]);

  const refreshData = () => {
    setCompanies(trailerFleetService.getCompanies());
    setTrailers(trailerFleetService.getAllTrailers());
  };

  if (!isOpen) return null;

  const selectedCompany = companies.find(c => c.id === selectedCompanyId) || companies[0] || {
    id: 'stobart',
    name: 'Eddie Stobart Logistics',
    code: 'ESL',
    primaryColor: '#16a34a',
    commonTrailerTypes: ['Curtainsider']
  };

  // Disambiguation search: Find all trailers matching the search query across ALL companies
  const duplicateMatches = searchTrailerNum.trim()
    ? trailerFleetService.findTrailersByNumber(searchTrailerNum.trim())
    : [];

  const hasMultipleHauliersForNumber = duplicateMatches.length > 1;

  // Exact match for currently selected company + searched trailer number
  const exactMatch = trailerFleetService.findExactTrailer(selectedCompanyId, searchTrailerNum.trim());

  const handleSelectExactTrailer = (trailer: LearnedTrailerProfile) => {
    trailerFleetService.recordTrailerHitch(trailer.id);

    // Auto-populate all vehicle dimensions into the active driver vehicle profile
    const updatedProfile: DriverVehicleProfile = {
      ...currentProfile,
      heightMeters: trailer.heightMeters,
      lengthMeters: trailer.combinationLengthMeters || 16.5,
      widthMeters: trailer.widthMeters || 2.55,
      weightTonnes: trailer.grossWeightTonnes || 44,
      hasTailLift: trailer.hasTailLift,
      currentTrailerNumber: trailer.trailerNumber,
      currentHaulierCompany: trailer.companyName,
      currentTrailerType: trailer.trailerType,
      // If double decker, enforce low-bridge and weight avoidance flags
      avoidLowBridges: trailer.isDoubleDecker ? true : currentProfile.avoidLowBridges,
      avoidWeightRestrictions: currentProfile.avoidWeightRestrictions ?? true
    };

    onHitchTrailer(updatedProfile);
    refreshData();
    onClose();
  };

  const handleSaveNewTrailer = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTrailerNum.trim()) return;

    const created = trailerFleetService.learnOrUpdateTrailer({
      companyId: selectedCompanyId,
      companyName: selectedCompany.name,
      trailerNumber: newTrailerNum.trim().toUpperCase(),
      trailerType: newTrailerType,
      heightMeters: Number(newHeightM),
      lengthMeters: Number(newLengthM),
      combinationLengthMeters: Number(newLengthM) + 2.9, // 16.5m combo standard
      widthMeters: Number(newWidthM),
      grossWeightTonnes: Number(newWeightT),
      hasTailLift: newHasTailLift,
      isDoubleDecker: newIsDoubleDecker || Number(newHeightM) > 4.75,
      notes: newNotes.trim(),
      bulkheadVerified: true
    });

    setShowAddModal(false);
    setSearchTrailerNum(created.trailerNumber);
    refreshData();
    handleSelectExactTrailer(created);
  };

  const handleAddNewCompany = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCompanyName.trim()) return;
    const added = trailerFleetService.addCompany(newCompanyName);
    setSelectedCompanyId(added.id);
    setNewCompanyName('');
    setShowAddCompanyModal(false);
    refreshData();
  };

  const handleSimulatePlateScan = () => {
    // Simulates instant OCR scan of a trailer bulkhead badge
    setScannedPlateText(`MAX VEHICLE OVERALL HEIGHT 4.85m / 15' 11" - DOUBLE DECK TR-1042`);
    setNewHeightM(4.85);
    setNewIsDoubleDecker(true);
    setNewTrailerType('BOX_VAN');
    if (!newTrailerNum) setNewTrailerNum('1042');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/85 backdrop-blur-md overflow-y-auto animate-fadeIn">
      <div className="relative w-full max-w-5xl bg-slate-900 border border-slate-700/80 rounded-3xl shadow-2xl overflow-hidden flex flex-col my-auto max-h-[92vh] text-white">

        {/* Modal Header */}
        <div className="bg-gradient-to-r from-emerald-950/60 via-slate-900 to-teal-950/60 px-6 py-4 border-b border-slate-700/80 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-2xl bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
              <Layers className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-xl font-black text-white tracking-wide">
                  Trailer Fleet Memory & Auto-Hitch Sync
                </h2>
                <span className="px-2 py-0.5 rounded text-[11px] font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 uppercase">
                  Multi-Haulier Intelligence
                </span>
              </div>
              <p className="text-xs text-slate-400">
                Matches trailer numbers to haulage companies and automatically injects height, length & weight into routing and cab HUD
              </p>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-6 overflow-y-auto space-y-6">

          {/* Current Active Vehicle & Trailer Status Banner */}
          <div className="bg-slate-800/60 border border-slate-700/70 rounded-2xl p-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="h-11 w-11 rounded-xl bg-blue-500/20 text-blue-400 flex items-center justify-center border border-blue-500/30">
                  <Truck className="w-6 h-6" />
                </div>
                <div>
                  <div className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                    Currently Hitched Combination
                  </div>
                  <div className="text-base font-extrabold text-white flex items-center gap-2">
                    <span className="font-mono text-amber-400">{currentProfile.vehicleReg}</span>
                    {currentProfile.currentTrailerNumber ? (
                      <>
                        <span className="text-slate-500">•</span>
                        <span className="text-emerald-400 font-mono">
                          {currentProfile.currentHaulierCompany || 'Haulier'} #{currentProfile.currentTrailerNumber}
                        </span>
                      </>
                    ) : (
                      <span className="text-slate-400 text-xs font-normal">(Unit Only / Default Setup)</span>
                    )}
                  </div>
                  <div className="flex items-center gap-3 text-xs text-slate-300 mt-0.5 font-mono">
                    <span>Height: <strong className="text-amber-400">{currentProfile.heightMeters}m</strong> ({metersToFeetInches(currentProfile.heightMeters)})</span>
                    <span>Length: <strong className="text-white">{currentProfile.lengthMeters}m</strong></span>
                    <span>Weight: <strong className="text-white">{currentProfile.weightTonnes}t</strong></span>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => setShowAddModal(true)}
                  className="px-3.5 py-2 bg-emerald-600 hover:bg-emerald-500 text-slate-950 font-bold text-xs rounded-xl shadow-md shadow-emerald-600/20 flex items-center gap-1.5 transition-all active:scale-95"
                >
                  <Plus className="w-4 h-4" />
                  <span>Learn New Trailer</span>
                </button>
              </div>
            </div>
          </div>

          {/* Section 1: Haulage Company Selector Bar */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
                <Building2 className="w-4 h-4 text-blue-400" />
                Select Current Haulage Company / Subcontractor
              </label>
              <button
                onClick={() => setShowAddCompanyModal(true)}
                className="text-[11px] font-bold text-emerald-400 hover:text-emerald-300 flex items-center gap-1"
              >
                <Plus className="w-3.5 h-3.5" />
                Add Company
              </button>
            </div>

            <div className="flex flex-wrap gap-2">
              {companies.map((co) => {
                const isSelected = selectedCompanyId === co.id;
                return (
                  <button
                    key={co.id}
                    onClick={() => setSelectedCompanyId(co.id)}
                    className={`px-3 py-2 rounded-xl text-xs font-bold transition-all border flex items-center gap-2 ${
                      isSelected
                        ? 'bg-slate-800 text-white border-emerald-400 ring-2 ring-emerald-500/30 shadow-md'
                        : 'bg-slate-900/90 text-slate-300 border-slate-700 hover:border-slate-500'
                    }`}
                  >
                    <span 
                      className="w-2.5 h-2.5 rounded-full" 
                      style={{ backgroundColor: co.primaryColor }}
                    />
                    <span>{co.name}</span>
                    <span className="text-[10px] text-slate-500 font-mono font-normal">
                      ({trailerFleetService.getTrailersByCompany(co.id).length} trailers)
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Section 2: Trailer Number Input & Duplicate Disambiguation Engine */}
          <div className="bg-slate-800/40 border border-slate-700/60 rounded-2xl p-5 space-y-4">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div className="flex-1">
                <label className="text-xs font-bold uppercase tracking-wider text-slate-400 block mb-1.5">
                  Enter Trailer Number / Fleet ID (e.g. 1042, 502, 881)
                </label>
                <div className="relative">
                  <Hash className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    value={searchTrailerNum}
                    onChange={(e) => setSearchTrailerNum(e.target.value.toUpperCase())}
                    placeholder="Enter or search trailer number..."
                    className="w-full bg-slate-900 border border-slate-700 rounded-xl pl-10 pr-4 py-2.5 text-sm text-white font-mono placeholder:text-slate-600 focus:outline-none focus:border-emerald-400"
                  />
                </div>
              </div>

              <div className="flex items-end gap-2">
                <button
                  type="button"
                  onClick={handleSimulatePlateScan}
                  className="px-4 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-600 rounded-xl text-xs font-bold flex items-center gap-2 transition-all shadow-sm shrink-0"
                  title="Simulate scanning bulkhead plate with camera"
                >
                  <Camera className="w-4 h-4 text-amber-400" />
                  <span>Scan Bulkhead Plate</span>
                </button>
              </div>
            </div>

            {/* CRITICAL MULTI-HAULIER DUPLICATE NUMBER WARNING BANNER */}
            {hasMultipleHauliersForNumber && (
              <div className="p-4 rounded-xl bg-amber-950/40 border-2 border-amber-500/60 space-y-3 animate-fadeIn">
                <div className="flex items-start gap-3">
                  <AlertTriangle className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
                  <div>
                    <h4 className="text-sm font-bold text-amber-300">
                      Multi-Company Match Warning: Trailer #{searchTrailerNum.trim()} exists in {duplicateMatches.length} different fleets!
                    </h4>
                    <p className="text-xs text-slate-300 mt-0.5 leading-relaxed">
                      Different haulage companies use the same trailer numbers with <strong>completely different heights & clearances</strong>. Select your exact company below to prevent bridge strikes:
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 pt-1">
                  {duplicateMatches.map((match) => {
                    const isSelectedCo = match.companyId === selectedCompanyId;
                    return (
                      <div
                        key={match.id}
                        onClick={() => {
                          setSelectedCompanyId(match.companyId);
                        }}
                        className={`p-3 rounded-xl border cursor-pointer transition-all ${
                          isSelectedCo
                            ? 'bg-slate-900 border-emerald-400 ring-2 ring-emerald-500/30 shadow-md'
                            : 'bg-slate-900/60 border-slate-700 hover:border-slate-500'
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-bold text-white truncate max-w-[140px]">
                            {match.companyName}
                          </span>
                          {isSelectedCo && (
                            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                          )}
                        </div>

                        <div className="mt-2 flex items-baseline justify-between">
                          <span className="text-lg font-mono font-black text-amber-400">
                            {match.heightMeters}m
                          </span>
                          <span className="text-xs font-mono text-slate-400">
                            {match.heightFeetInches}
                          </span>
                        </div>

                        <div className="text-[11px] text-slate-400 mt-1 capitalize truncate">
                          {match.trailerType.toLowerCase().replace('_', ' ')}
                          {match.isDoubleDecker && ' (Double Decker)'}
                        </div>

                        {/* MOT & Roadworthiness pill */}
                        <div className="flex items-center gap-1.5 mt-2">
                          <span className={`px-1.5 py-0.5 rounded text-[9px] font-bold font-mono ${
                            match.motStatus === 'VALID'
                              ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                              : match.motStatus === 'DUE_SOON'
                              ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                              : 'bg-rose-500/20 text-rose-300 border border-rose-500/30'
                          }`}>
                            MOT: {match.motStatus || 'VALID'} ({match.motExpiryDate || '11/2026'})
                          </span>
                          <span className="text-[10px] text-slate-400 font-mono">
                            Brakes: {match.lastBrakeEfficiencyPercent || 62}%
                          </span>
                        </div>

                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            setSelectedCompanyId(match.companyId);
                            handleSelectExactTrailer(match);
                          }}
                          className="w-full mt-3 py-1.5 px-2 bg-emerald-600 hover:bg-emerald-500 text-slate-950 font-bold text-xs rounded-lg flex items-center justify-center gap-1 transition-all"
                        >
                          <span>Hitch this #{match.trailerNumber}</span>
                          <ArrowRight className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Exact Match Card for Currently Selected Company */}
            {exactMatch ? (
              <div className="p-4 rounded-xl bg-slate-900/90 border border-emerald-500/50 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="space-y-3 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 uppercase">
                      Fleet Verified Match
                    </span>
                    <span className="text-sm font-bold text-white">
                      {exactMatch.companyName} #{exactMatch.trailerNumber}
                    </span>
                    <span className="text-xs text-slate-400 font-mono">
                      (Hitched {exactMatch.timesUsed} times)
                    </span>
                    <span className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold ${
                      exactMatch.motStatus === 'VALID'
                        ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                        : exactMatch.motStatus === 'DUE_SOON'
                        ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                        : 'bg-rose-500/20 text-rose-300 border border-rose-500/30'
                    }`}>
                      MOT {exactMatch.motStatus || 'VALID'} (Exp: {exactMatch.motExpiryDate || '11/2026'})
                    </span>
                  </div>

                  {/* Dimensions Grid */}
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                    <div>
                      <span className="text-[10px] text-slate-400 uppercase font-semibold">Overall Height</span>
                      <div className="text-lg font-mono font-black text-amber-400">
                        {exactMatch.heightMeters}m <span className="text-xs font-normal text-slate-400">({exactMatch.heightFeetInches})</span>
                      </div>
                    </div>
                    <div>
                      <span className="text-[10px] text-slate-400 uppercase font-semibold">Trailer Type</span>
                      <div className="text-xs font-bold text-white mt-1">
                        {exactMatch.trailerType.replace('_', ' ')}
                        {exactMatch.isDoubleDecker && ' (Double Deck)'}
                      </div>
                    </div>
                    <div>
                      <span className="text-[10px] text-slate-400 uppercase font-semibold">Total Combination</span>
                      <div className="text-xs font-mono font-bold text-white mt-1">
                        {exactMatch.combinationLengthMeters}m Artic
                      </div>
                    </div>
                    <div>
                      <span className="text-[10px] text-slate-400 uppercase font-semibold">Gross &amp; Tare</span>
                      <div className="text-xs font-mono font-bold text-white mt-1">
                        {exactMatch.grossWeightTonnes}t Max • {exactMatch.unladenWeightTonnes || 7.5}t Tare
                      </div>
                    </div>
                  </div>

                  {/* MOT & Technical Roadworthiness Dossier */}
                  <div className="p-3 rounded-xl bg-slate-950/80 border border-slate-800 grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs">
                    <div>
                      <span className="text-[10px] text-slate-500 font-mono block uppercase">MOT Certificate #</span>
                      <span className="font-mono text-cyan-300 font-bold">{exactMatch.motCertificateNumber || 'VTG-948102'}</span>
                    </div>
                    <div>
                      <span className="text-[10px] text-slate-500 font-mono block uppercase">Roller Brake Test</span>
                      <span className="font-mono text-emerald-400 font-bold">
                        {exactMatch.lastBrakeEfficiencyPercent || 64}% (Pass &gt;=50%)
                      </span>
                    </div>
                    <div>
                      <span className="text-[10px] text-slate-500 font-mono block uppercase">Chassis VIN</span>
                      <span className="font-mono text-slate-300 truncate block">{exactMatch.chassisVinNumber || 'W09SD2720M1094820'}</span>
                    </div>
                    <div>
                      <span className="text-[10px] text-slate-500 font-mono block uppercase">Operator O-Disc</span>
                      <span className="font-mono text-slate-300 block">{exactMatch.operatorDiscNumber || 'OK1092841/004'}</span>
                    </div>
                  </div>

                  {exactMatch.notes && (
                    <p className="text-xs text-slate-400 font-mono">
                      Notes: {exactMatch.notes}
                    </p>
                  )}
                </div>

                <div className="flex sm:flex-col items-center sm:items-end justify-between gap-2 shrink-0">
                  <button
                    onClick={() => handleSelectExactTrailer(exactMatch)}
                    className="w-full sm:w-auto px-5 py-2.5 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black text-xs rounded-xl shadow-lg shadow-emerald-500/20 flex items-center justify-center gap-2 transition-all transform active:scale-95 cursor-pointer"
                  >
                    <BookmarkCheck className="w-4 h-4" />
                    <span>Hitch &amp; Sync Dimensions</span>
                  </button>
                </div>
              </div>
            ) : searchTrailerNum.trim() && !hasMultipleHauliersForNumber ? (
              <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800 text-center space-y-2">
                <p className="text-xs text-slate-300">
                  Trailer <strong>#{searchTrailerNum}</strong> is not yet learned under <strong>{selectedCompany.name}</strong>.
                </p>
                <button
                  onClick={() => {
                    setNewTrailerNum(searchTrailerNum.trim());
                    setShowAddModal(true);
                  }}
                  className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-slate-950 font-bold text-xs rounded-xl inline-flex items-center gap-1.5 transition-all shadow-md"
                >
                  <Plus className="w-4 h-4" />
                  <span>Learn & Save #{searchTrailerNum} Now</span>
                </button>
              </div>
            ) : null}
          </div>

          {/* Section 3: Learned Trailers for Selected Company */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
                <BookmarkCheck className="w-4 h-4 text-emerald-400" />
                Learned Trailers in {selectedCompany.name} ({trailerFleetService.getTrailersByCompany(selectedCompanyId).length})
              </h3>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
              {trailerFleetService.getTrailersByCompany(selectedCompanyId).map((t) => (
                <div
                  key={t.id}
                  className="p-3.5 rounded-xl bg-slate-800/40 border border-slate-700/60 flex flex-col justify-between space-y-3"
                >
                  <div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-mono font-black text-white">
                        Trailer #{t.trailerNumber}
                      </span>
                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                        t.isDoubleDecker 
                          ? 'bg-red-500/20 text-red-300 border border-red-500/40' 
                          : 'bg-slate-700/50 text-slate-300'
                      }`}>
                        {t.isDoubleDecker ? 'DOUBLE DECK' : t.trailerType.replace('_', ' ')}
                      </span>
                    </div>

                    <div className="mt-2 flex items-baseline justify-between">
                      <span className="text-2xl font-mono font-black text-amber-400">
                        {t.heightMeters}m
                      </span>
                      <span className="text-xs font-mono text-slate-400">
                        {t.heightFeetInches}
                      </span>
                    </div>

                    <div className="text-[11px] text-slate-400 mt-1 flex items-center justify-between">
                      <span>Length: {t.lengthMeters}m (16.5m artic)</span>
                      <span>Weight: {t.grossWeightTonnes}t</span>
                    </div>
                  </div>

                  <button
                    onClick={() => handleSelectExactTrailer(t)}
                    className="w-full py-2 bg-slate-800 hover:bg-emerald-600 text-slate-200 hover:text-slate-950 font-bold text-xs rounded-lg transition-all flex items-center justify-center gap-1 border border-slate-700 hover:border-emerald-500"
                  >
                    <span>Hitch #{t.trailerNumber}</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))}
            </div>
          </div>

        </div>

        {/* Learn New Trailer Dialog Modal */}
        {showAddModal && (
          <div className="absolute inset-0 z-20 bg-black/90 backdrop-blur-md p-4 sm:p-6 flex flex-col justify-center items-center overflow-y-auto animate-fadeIn">
            <div className="w-full max-w-lg bg-slate-900 border border-slate-700 rounded-2xl p-5 space-y-4 shadow-2xl">
              <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                <div className="flex items-center gap-2">
                  <div className="p-2 rounded-xl bg-emerald-500/20 text-emerald-400">
                    <Plus className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-base font-bold text-white">
                      Learn New Trailer Specification
                    </h3>
                    <p className="text-xs text-slate-400">
                      Adding to <strong className="text-white">{selectedCompany.name}</strong>
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => setShowAddModal(false)}
                  className="p-1 text-slate-400 hover:text-white"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {scannedPlateText && (
                <div className="p-3 rounded-xl bg-amber-950/40 border border-amber-500/40 text-xs text-amber-300 flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-amber-400 shrink-0" />
                  <span>OCR Bulkhead Detected: {scannedPlateText}</span>
                </div>
              )}

              <form onSubmit={handleSaveNewTrailer} className="space-y-3 text-xs">
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-slate-400 font-semibold mb-1">
                      Trailer Number / Fleet ID
                    </label>
                    <input
                      type="text"
                      required
                      value={newTrailerNum}
                      onChange={(e) => setNewTrailerNum(e.target.value.toUpperCase())}
                      placeholder="e.g. 1042 or TRL-901"
                      className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-white font-mono"
                    />
                  </div>

                  <div>
                    <label className="block text-slate-400 font-semibold mb-1">
                      Trailer Type
                    </label>
                    <select
                      value={newTrailerType}
                      onChange={(e) => setNewTrailerType(e.target.value as TrailerType)}
                      className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-white"
                    >
                      <option value="CURTAINSIDER">Standard Curtainsider</option>
                      <option value="BOX_VAN">Dry Freight Box Van</option>
                      <option value="REFRIGERATED_TEMP">Refrigerated (Reefer)</option>
                      <option value="FLATBED">Flatbed / Skeletal Container</option>
                      <option value="RIGID_TAILLIFT">Rigid with Tail-Lift</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-3">
                  <div className="col-span-1 sm:col-span-2">
                    <DualHeightInput
                      valueMeters={newHeightM}
                      onChange={(val) => {
                        setNewHeightM(val);
                        if (val > 4.75) setNewIsDoubleDecker(true);
                      }}
                      label="Trailer Overall Height (Automatic Metric & Feet Conversion)"
                      helperText="Type in either meters (e.g. 4.20) or feet/inches (e.g. 13 ft 9 in). Both units convert automatically in real-time."
                    />
                  </div>

                  <div>
                    <label className="block text-slate-400 font-semibold mb-1">
                      Trailer Length (m)
                    </label>
                    <input
                      type="number"
                      step="0.1"
                      min="10"
                      max="16"
                      value={newLengthM}
                      onChange={(e) => setNewLengthM(parseFloat(e.target.value) || 13.6)}
                      className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-white font-mono"
                    />
                    <span className="text-[10px] text-slate-500 mt-0.5 block font-mono">
                      16.5m combo
                    </span>
                  </div>

                  <div>
                    <label className="block text-slate-400 font-semibold mb-1">
                      Gross Weight (t)
                    </label>
                    <input
                      type="number"
                      min="18"
                      max="44"
                      value={newWeightT}
                      onChange={(e) => setNewWeightT(parseFloat(e.target.value) || 44)}
                      className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-white font-mono"
                    />
                    <span className="text-[10px] text-slate-500 mt-0.5 block font-mono">
                      Max 44 Tonnes
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-4 py-1">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={newIsDoubleDecker}
                      onChange={(e) => setNewIsDoubleDecker(e.target.checked)}
                      className="rounded border-slate-700 text-emerald-500 focus:ring-emerald-400"
                    />
                    <span className="text-slate-300 font-semibold">High-Cube Double Decker</span>
                  </label>

                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={newHasTailLift}
                      onChange={(e) => setNewHasTailLift(e.target.checked)}
                      className="rounded border-slate-700 text-emerald-500 focus:ring-emerald-400"
                    />
                    <span className="text-slate-300 font-semibold">Equipped with Tail-Lift</span>
                  </label>
                </div>

                <div>
                  <label className="block text-slate-400 font-semibold mb-1">
                    Special Operating Notes
                  </label>
                  <input
                    type="text"
                    value={newNotes}
                    onChange={(e) => setNewNotes(e.target.value)}
                    placeholder="e.g. Aerodynamic teardrop roof, dual-temp bulkhead..."
                    className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-white"
                  />
                </div>

                <div className="flex justify-end gap-2 pt-3 border-t border-slate-800">
                  <button
                    type="button"
                    onClick={() => setShowAddModal(false)}
                    className="px-4 py-2 bg-slate-800 text-slate-300 rounded-xl hover:bg-slate-700"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold rounded-xl shadow-md"
                  >
                    Save & Hitch to Cab
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Add Company Dialog Modal */}
        {showAddCompanyModal && (
          <div className="absolute inset-0 z-20 bg-black/90 backdrop-blur-md p-4 flex flex-col justify-center items-center animate-fadeIn">
            <div className="w-full max-w-sm bg-slate-900 border border-slate-700 rounded-2xl p-5 space-y-4 shadow-2xl">
              <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                <h3 className="text-sm font-bold text-white">Add New Haulage Company</h3>
                <button onClick={() => setShowAddCompanyModal(false)} className="text-slate-400 hover:text-white">
                  <X className="w-4 h-4" />
                </button>
              </div>

              <form onSubmit={handleAddNewCompany} className="space-y-3 text-xs">
                <div>
                  <label className="block text-slate-400 font-semibold mb-1">Company / Fleet Name</label>
                  <input
                    type="text"
                    required
                    value={newCompanyName}
                    onChange={(e) => setNewCompanyName(e.target.value)}
                    placeholder="e.g. Gist Logistics, EV Cargo..."
                    className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-white"
                  />
                </div>

                <div className="flex justify-end gap-2 pt-2">
                  <button
                    type="button"
                    onClick={() => setShowAddCompanyModal(false)}
                    className="px-3 py-1.5 bg-slate-800 text-slate-300 rounded-lg"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-1.5 bg-emerald-500 text-slate-950 font-bold rounded-lg"
                  >
                    Add Company
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

      </div>
    </div>
  );
};
