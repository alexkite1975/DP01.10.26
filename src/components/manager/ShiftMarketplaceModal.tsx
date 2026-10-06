'use client';
import React, { useState, useEffect } from 'react';
import {
  Briefcase,
  Clock,
  MapPin,
  Shield,
  Truck,
  CheckCircle2,
  AlertTriangle,
  Lock,
  Search,
  Filter,
  X,
  ChevronRight,
  Info,
  Calendar,
  CreditCard,
  PlusCircle,
  FileCheck,
  Zap,
  Sparkles
} from 'lucide-react';
import { MarketplaceShift, VehicleClass, IR35Status, TrailerType } from '../types';
import { initialMarketplaceShifts } from '../data/mockMarketplaceData';

interface ShiftMarketplaceModalProps {
  isOpen: boolean;
  onClose: () => void;
  userRole?: 'driver' | 'business' | 'admin';
  driverLocation?: { lat: number; lng: number; postcode?: string };
}

export const ShiftMarketplaceModal: React.FC<ShiftMarketplaceModalProps> = ({
  isOpen,
  onClose,
  userRole = 'driver',
  driverLocation = { lat: 52.368, lng: -1.161, postcode: 'NN6 7GZ' }
}) => {
  const [shifts, setShifts] = useState<MarketplaceShift[]>(initialMarketplaceShifts);
  const [radiusFilter, setRadiusFilter] = useState<number>(30); // 30-mile safe commute default
  const [vehicleClassFilter, setVehicleClassFilter] = useState<string>('ALL');
  const [ir35Filter, setIr35Filter] = useState<string>('ALL');
  const [selectedShift, setSelectedShift] = useState<MarketplaceShift | null>(null);

  // Atomic Redlock state
  const [lockingShiftId, setLockingShiftId] = useState<string | null>(null);
  const [lockRemainingSeconds, setLockRemainingSeconds] = useState<number>(120);
  const [bookedSuccessMessage, setBookedSuccessMessage] = useState<string | null>(null);

  // New Shift Posting State (for Hauliers / Business role)
  const [showPostModal, setShowPostModal] = useState<boolean>(false);
  const [newTitle, setNewTitle] = useState('');
  const [newHaulier, setNewHaulier] = useState('Stobart Prime Logistics');
  const [newOlicence, setNewOlicence] = useState('OB9921402/SN');
  const [newSite, setNewSite] = useState('DIRFT Crick Terminal');
  const [newPostcode, setNewPostcode] = useState('NN6 7GZ');
  const [newClass, setNewClass] = useState<VehicleClass>('CAT_CE_CLASS_1');
  const [newTrailer, setNewTrailer] = useState<TrailerType>('CURTAINSIDER');
  const [newBaseRate, setNewBaseRate] = useState('24.00');
  const [newOvertimeRate, setNewOvertimeRate] = useState('30.00');
  const [newNightOut, setNewNightOut] = useState('35.00');
  const [newIr35, setNewIr35] = useState<IR35Status>('INSIDE_IR35');

  // Redlock countdown timer
  useEffect(() => {
    let interval: any = null;
    if (lockingShiftId && lockRemainingSeconds > 0) {
      interval = setInterval(() => {
        setLockRemainingSeconds((prev) => {
          if (prev <= 1) {
            setLockingShiftId(null);
            return 120;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [lockingShiftId, lockRemainingSeconds]);

  if (!isOpen) return null;

  // Filter shifts
  const filteredShifts = shifts.filter((s) => {
    if (radiusFilter !== 999 && s.distanceMilesFromDriver > radiusFilter) return false;
    if (vehicleClassFilter !== 'ALL' && s.vehicleClass !== vehicleClassFilter) return false;
    if (ir35Filter !== 'ALL' && s.ir35Status !== ir35Filter) return false;
    return true;
  });

  // Handle atomic shift booking
  const handleInitiateLock = (shift: MarketplaceShift) => {
    setLockingShiftId(shift.id);
    setLockRemainingSeconds(120);
    setSelectedShift(shift);
    setBookedSuccessMessage(null);
  };

  const handleConfirmBooking = () => {
    if (!lockingShiftId) return;
    setShifts((prev) =>
      prev.map((s) =>
        s.id === lockingShiftId
          ? {
              ...s,
              status: 'BOOKED',
              bookedDriverId: 'DRV-CURRENT-USER',
              bookedDriverName: 'Dave Miller (HGV C+E)'
            }
          : s
      )
    );
    setBookedSuccessMessage(
      'Shift Confirmed! Concurrency Lock finalized. Timesheet & Induction Pass registered in Driver Portal.'
    );
    setLockingShiftId(null);
  };

  const handleCreateShift = (e: React.FormEvent) => {
    e.preventDefault();
    const created: MarketplaceShift = {
      id: 'shift-' + Date.now(),
      shiftRef: 'SH-POST-' + Math.floor(1000 + Math.random() * 9000),
      title: newTitle || 'Scheduled Freight Trunking',
      haulierName: newHaulier,
      haulierOlicence: newOlicence,
      siteName: newSite,
      location: {
        address: 'National Hub Approach',
        city: 'Northamptonshire Hub',
        postcode: newPostcode,
        lat: 52.368,
        lng: -1.161
      },
      vehicleClass: newClass,
      trailerType: newTrailer,
      startTime: new Date(Date.now() + 86400000).toISOString(),
      endTime: new Date(Date.now() + 86400000 + 36000000).toISOString(),
      durationHours: 10,
      baseHourlyRate: parseFloat(newBaseRate) || 24,
      overtimeHourlyRate: parseFloat(newOvertimeRate) || 30,
      nightOutAllowance: parseFloat(newNightOut) || 0,
      agencyPlatformFeePercent: 10,
      ir35Status: newIr35,
      ir35Reasoning:
        newIr35 === 'INSIDE_IR35'
          ? 'Automated Section 44 ITEPA Safe-Harbour default applied to insulate client haulier from agency clawback.'
          : 'Verified Operator Licence Holder (Schedule 1 B2B Sub-Contractor with sole vehicle provision).',
      status: 'OPEN',
      distanceMilesFromDriver: 12.4,
      drivingTimeMinutesFromDriver: 18,
      specialRequirements: ['Valid Digital Tacho Card', 'Driver CPC', 'Class 3 Hi-Vis'],
      goodsDescription: 'Standard palletized freight',
      palletCount: 26
    };

    setShifts([created, ...shifts]);
    setShowPostModal(false);
    setSelectedShift(created);
  };

  const getVehicleClassLabel = (v: VehicleClass) => {
    switch (v) {
      case 'CAT_CE_CLASS_1':
        return 'Class 1 (Cat C+E)';
      case 'CAT_C_CLASS_2':
        return 'Class 2 (Cat C)';
      case 'ADR_HAZCHEM':
        return 'ADR Hazchem';
      case 'HIAB_LORRY_LOADER':
        return 'HIAB Crane';
      case 'MOFFETT_FORKLIFT':
        return 'Moffett Forklift';
      default:
        return v;
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur-md p-3 sm:p-5 overflow-y-auto">
      <div className="relative w-full max-w-5xl rounded-2xl border border-slate-700 bg-slate-900 text-slate-100 shadow-2xl flex flex-col max-h-[92vh] overflow-hidden">
        
        {/* MODAL HEADER */}
        <div className="flex items-center justify-between border-b border-slate-800 bg-slate-950/80 px-5 py-4">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-500/20 text-amber-400 border border-amber-500/30">
              <Briefcase className="h-5 w-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base sm:text-lg font-bold text-white tracking-wide">
                  ReliefHGV Shift Marketplace
                </h2>
                <span className="rounded-full bg-emerald-500/20 px-2.5 py-0.5 text-xs font-semibold text-emerald-400 border border-emerald-500/30 flex items-center gap-1">
                  <Shield className="h-3 w-3" /> IR35 Tax Shield Active
                </span>
              </div>
              <p className="text-xs text-slate-400">
                30-Mile Proximity Matching • Section 44 ITEPA Safe-Harbour • Redlock Atomic Dispatch
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setShowPostModal(true)}
              className="flex items-center gap-1.5 rounded-lg bg-amber-500 px-3 py-1.5 text-xs font-bold text-slate-950 hover:bg-amber-400 transition"
            >
              <PlusCircle className="h-4 w-4" /> Post Shift
            </button>
            <button
              onClick={onClose}
              className="rounded-lg p-2 text-slate-400 hover:bg-slate-800 hover:text-white transition"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
        </div>

        {/* NOTIFICATION BANNER */}
        {bookedSuccessMessage && (
          <div className="flex items-center gap-2 bg-emerald-950/90 border-b border-emerald-700/60 px-5 py-2.5 text-xs font-medium text-emerald-300">
            <CheckCircle2 className="h-4 w-4 text-emerald-400 shrink-0" />
            <span>{bookedSuccessMessage}</span>
          </div>
        )}

        {/* ATOMIC LOCK PULSE BANNER */}
        {lockingShiftId && (
          <div className="flex items-center justify-between bg-amber-950/90 border-b border-amber-600 px-5 py-2.5 text-xs text-amber-200 animate-pulse">
            <div className="flex items-center gap-2 font-bold">
              <Lock className="h-4 w-4 text-amber-400 shrink-0" />
              <span>
                REDLOCK CONCURRENCY SAFEGUARD ACTIVE: Shift locked to your device for{' '}
                <span className="text-amber-300 font-mono text-sm underline">{lockRemainingSeconds}s</span>
              </span>
            </div>
            <button
              onClick={handleConfirmBooking}
              className="rounded-lg bg-emerald-500 px-3 py-1 font-bold text-slate-950 hover:bg-emerald-400 transition shadow"
            >
              Confirm 1-Tap Booking
            </button>
          </div>
        )}

        {/* FILTER BAR */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 p-4 bg-slate-950/40 border-b border-slate-800 text-xs">
          {/* Proximity Radius */}
          <div className="flex flex-col gap-1">
            <span className="text-slate-400 font-semibold flex items-center gap-1">
              <MapPin className="h-3.5 w-3.5 text-amber-400" /> Commute Distance Radius:
            </span>
            <div className="flex items-center gap-1.5">
              {[10, 20, 30, 50, 999].map((r) => (
                <button
                  key={r}
                  onClick={() => setRadiusFilter(r)}
                  className={`px-2.5 py-1 rounded-md font-semibold transition ${
                    radiusFilter === r
                      ? 'bg-amber-500 text-slate-950 font-bold'
                      : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                  }`}
                >
                  {r === 999 ? 'UK Wide' : `${r} mi`}
                </button>
              ))}
            </div>
          </div>

          {/* Vehicle Class Filter */}
          <div className="flex flex-col gap-1">
            <span className="text-slate-400 font-semibold flex items-center gap-1">
              <Truck className="h-3.5 w-3.5 text-blue-400" /> Vehicle Category:
            </span>
            <select
              value={vehicleClassFilter}
              onChange={(e) => setVehicleClassFilter(e.target.value)}
              className="rounded-md border border-slate-700 bg-slate-800 px-2.5 py-1 text-slate-200 focus:outline-none focus:border-amber-500"
            >
              <option value="ALL">All Categories</option>
              <option value="CAT_CE_CLASS_1">Class 1 (Cat C+E)</option>
              <option value="CAT_C_CLASS_2">Class 2 (Cat C)</option>
              <option value="ADR_HAZCHEM">ADR Hazchem</option>
              <option value="HIAB_LORRY_LOADER">HIAB Crane Lorry</option>
              <option value="MOFFETT_FORKLIFT">Moffett Forklift</option>
            </select>
          </div>

          {/* IR35 Tax Status Filter */}
          <div className="flex flex-col gap-1">
            <span className="text-slate-400 font-semibold flex items-center gap-1">
              <Shield className="h-3.5 w-3.5 text-emerald-400" /> Tax Determination (IR35):
            </span>
            <select
              value={ir35Filter}
              onChange={(e) => setIr35Filter(e.target.value)}
              className="rounded-md border border-slate-700 bg-slate-800 px-2.5 py-1 text-slate-200 focus:outline-none focus:border-amber-500"
            >
              <option value="ALL">All Tax Models</option>
              <option value="INSIDE_IR35">Inside IR35 (Sec 44 Safe-Harbour)</option>
              <option value="OUTSIDE_IR35_B2B">Outside IR35 (Verified B2B O-Licence)</option>
            </select>
          </div>
        </div>

        {/* MAIN BODY: 2 COLUMN LAYOUT */}
        <div className="flex-1 overflow-y-auto grid grid-cols-1 lg:grid-cols-12 divide-y lg:divide-y-0 lg:divide-x divide-slate-800">
          
          {/* SHIFT CARDS LIST (7 COLS) */}
          <div className="lg:col-span-7 p-4 space-y-3 overflow-y-auto max-h-[60vh] lg:max-h-none">
            <div className="flex items-center justify-between text-xs text-slate-400 pb-1">
              <span>{filteredShifts.length} Verified Shifts Available</span>
              <span className="text-emerald-400 font-medium flex items-center gap-1">
                <CheckCircle2 className="h-3.5 w-3.5" /> All Hauliers O-Licence Verified
              </span>
            </div>

            {filteredShifts.length === 0 ? (
              <div className="rounded-xl border border-dashed border-slate-700 p-8 text-center text-slate-400">
                <Truck className="h-10 w-10 mx-auto text-slate-600 mb-2" />
                <p className="font-semibold text-slate-300">No shifts match active filters</p>
                <p className="text-xs mt-1">Try expanding your commute radius beyond {radiusFilter} miles.</p>
              </div>
            ) : (
              filteredShifts.map((shift) => {
                const isSelected = selectedShift?.id === shift.id;
                const isLocked = lockingShiftId === shift.id;
                const isBooked = shift.status === 'BOOKED';

                return (
                  <div
                    key={shift.id}
                    onClick={() => setSelectedShift(shift)}
                    className={`rounded-xl border p-3.5 transition-all cursor-pointer relative ${
                      isLocked
                        ? 'border-amber-500 bg-amber-950/20 shadow-lg shadow-amber-500/10'
                        : isSelected
                        ? 'border-blue-500 bg-slate-800/80 shadow-md'
                        : 'border-slate-800 bg-slate-900/90 hover:border-slate-700 hover:bg-slate-850'
                    }`}
                  >
                    {/* Top Row: Shift Ref, Distance & Rate */}
                    <div className="flex items-start justify-between gap-2">
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <span className="font-mono text-xs font-bold text-amber-400">
                            {shift.shiftRef}
                          </span>
                          <span
                            className={`rounded px-1.5 py-0.5 text-[10px] font-bold uppercase tracking-wider ${
                              shift.vehicleClass === 'CAT_CE_CLASS_1'
                                ? 'bg-blue-500/20 text-blue-300 border border-blue-500/30'
                                : shift.vehicleClass === 'ADR_HAZCHEM'
                                ? 'bg-orange-500/20 text-orange-300 border border-orange-500/30'
                                : shift.vehicleClass === 'HIAB_LORRY_LOADER'
                                ? 'bg-purple-500/20 text-purple-300 border border-purple-500/30'
                                : 'bg-slate-700 text-slate-300'
                            }`}
                          >
                            {getVehicleClassLabel(shift.vehicleClass)}
                          </span>
                          <span className="text-[10px] text-slate-400 font-mono">
                            {shift.trailerType.replace('_', ' ')}
                          </span>
                        </div>
                        <h3 className="text-sm font-bold text-white group-hover:text-amber-400">
                          {shift.title}
                        </h3>
                        <p className="text-xs text-slate-400 font-medium">{shift.haulierName}</p>
                      </div>

                      {/* Financials Pill */}
                      <div className="text-right">
                        <div className="text-lg font-black text-emerald-400">
                          £{shift.baseHourlyRate.toFixed(2)}
                          <span className="text-xs font-normal text-slate-400">/hr</span>
                        </div>
                        {shift.nightOutAllowance > 0 && (
                          <div className="text-[10px] text-amber-300 font-semibold">
                            +£{shift.nightOutAllowance.toFixed(2)} Night Out
                          </div>
                        )}
                        <div className="text-[10px] text-slate-400">
                          {shift.durationHours}h shift (~£{(shift.baseHourlyRate * shift.durationHours + shift.nightOutAllowance).toFixed(0)})
                        </div>
                      </div>
                    </div>

                    {/* Middle Row: Proximity & IR35 Status */}
                    <div className="mt-3 flex flex-wrap items-center justify-between gap-2 border-t border-slate-800/80 pt-2.5 text-xs text-slate-300">
                      <div className="flex items-center gap-3">
                        <span className="flex items-center gap-1 font-semibold text-slate-300">
                          <MapPin className="h-3.5 w-3.5 text-amber-400" />
                          {shift.distanceMilesFromDriver} mi ({shift.drivingTimeMinutesFromDriver} min drive)
                        </span>
                        <span className="flex items-center gap-1 text-slate-400">
                          <Clock className="h-3.5 w-3.5 text-slate-500" />
                          {new Date(shift.startTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} Start
                        </span>
                      </div>

                      <div className="flex items-center gap-2">
                        {shift.ir35Status === 'INSIDE_IR35' ? (
                          <span className="inline-flex items-center gap-1 rounded bg-slate-800 px-2 py-0.5 text-[10px] font-semibold text-slate-300 border border-slate-700">
                            <Shield className="h-3 w-3 text-emerald-400" /> Sec 44 Inside IR35
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 rounded bg-blue-950/80 px-2 py-0.5 text-[10px] font-semibold text-blue-300 border border-blue-700/60">
                            <Zap className="h-3 w-3 text-blue-400" /> Outside IR35 B2B
                          </span>
                        )}

                        {isBooked ? (
                          <span className="rounded bg-emerald-500/20 px-2 py-0.5 text-[10px] font-bold text-emerald-400 border border-emerald-500/30">
                            BOOKED
                          </span>
                        ) : isLocked ? (
                          <span className="rounded bg-amber-500 text-slate-950 px-2 py-0.5 text-[10px] font-black animate-pulse">
                            LOCK: {lockRemainingSeconds}s
                          </span>
                        ) : (
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleInitiateLock(shift);
                            }}
                            className="rounded-md bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold px-2.5 py-1 text-xs transition"
                          >
                            Claim Shift
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>

          {/* SHIFT DETAIL & IR35 TAX SHIELD BREAKDOWN (5 COLS) */}
          <div className="lg:col-span-5 p-4 bg-slate-950/60 space-y-4 overflow-y-auto">
            {selectedShift ? (
              <div className="space-y-4">
                {/* Header */}
                <div className="border-b border-slate-800 pb-3">
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-xs text-amber-400 font-bold">
                      {selectedShift.shiftRef}
                    </span>
                    <span
                      className={`text-[10px] font-bold px-2 py-0.5 rounded ${
                        selectedShift.status === 'BOOKED'
                          ? 'bg-emerald-500/20 text-emerald-400'
                          : 'bg-blue-500/20 text-blue-400'
                      }`}
                    >
                      {selectedShift.status}
                    </span>
                  </div>
                  <h3 className="text-base font-bold text-white mt-1">{selectedShift.title}</h3>
                  <p className="text-xs text-slate-400">{selectedShift.haulierName}</p>
                  {selectedShift.haulierOlicence && (
                    <p className="text-[10px] font-mono text-slate-500">
                      O-Licence: {selectedShift.haulierOlicence}
                    </p>
                  )}
                </div>

                {/* IR35 TAX SHIELD EXPLAINER */}
                <div className="rounded-xl border border-emerald-700/50 bg-emerald-950/30 p-3.5 space-y-2">
                  <div className="flex items-center gap-2">
                    <Shield className="h-4 w-4 text-emerald-400" />
                    <h4 className="text-xs font-bold text-emerald-300">
                      IR35 Tax Shield & Legal Status Determination
                    </h4>
                  </div>
                  <div className="text-[11px] text-slate-300 leading-relaxed space-y-1">
                    <p>
                      <strong className="text-white">Determination:</strong>{' '}
                      {selectedShift.ir35Status === 'INSIDE_IR35'
                        ? 'De Facto Inside IR35 (Statutory Agency Shield)'
                        : 'Verified Outside IR35 B2B Sub-Contractor'}
                    </p>
                    <p className="text-slate-400">{selectedShift.ir35Reasoning}</p>
                    <div className="pt-1 border-t border-emerald-800/40 text-[10px] text-emerald-400 flex items-center gap-1 font-mono">
                      <Sparkles className="h-3 w-3" /> Section 44 ITEPA Indemnity: Haulier protected from retrospective tax clawback.
                    </div>
                  </div>
                </div>

                {/* FINANCIAL BREAKDOWN TABLE */}
                <div className="rounded-xl border border-slate-800 bg-slate-900 p-3 space-y-2">
                  <h4 className="text-xs font-bold text-slate-200 flex items-center gap-1.5">
                    <CreditCard className="h-3.5 w-3.5 text-amber-400" /> Remuneration Structure
                  </h4>
                  <div className="divide-y divide-slate-800 text-xs">
                    <div className="flex justify-between py-1.5 text-slate-300">
                      <span>Standard Rate ({selectedShift.durationHours} hrs)</span>
                      <span className="font-mono font-semibold">
                        £{(selectedShift.baseHourlyRate * selectedShift.durationHours).toFixed(2)}
                      </span>
                    </div>
                    <div className="flex justify-between py-1.5 text-slate-300">
                      <span>Night Out Tax-Free Allowance</span>
                      <span className="font-mono font-semibold">
                        £{selectedShift.nightOutAllowance.toFixed(2)}
                      </span>
                    </div>
                    <div className="flex justify-between py-1.5 text-slate-300">
                      <span>Agency Fee Included (10%)</span>
                      <span className="font-mono text-slate-400">
                        £{(selectedShift.baseHourlyRate * selectedShift.durationHours * 0.1).toFixed(2)}
                      </span>
                    </div>
                    <div className="flex justify-between py-2 text-white font-bold text-sm bg-slate-950/40 px-2 rounded mt-1">
                      <span>Gross Driver Payout:</span>
                      <span className="text-emerald-400 font-mono">
                        £{(selectedShift.baseHourlyRate * selectedShift.durationHours + selectedShift.nightOutAllowance).toFixed(2)}
                      </span>
                    </div>
                  </div>
                </div>

                {/* SPECIAL REQUIREMENTS */}
                <div className="space-y-1.5 text-xs">
                  <h4 className="font-bold text-slate-300 flex items-center gap-1.5">
                    <FileCheck className="h-3.5 w-3.5 text-blue-400" /> Driver Prerequisites & PPE
                  </h4>
                  <div className="flex flex-wrap gap-1.5">
                    {selectedShift.specialRequirements.map((req, i) => (
                      <span
                        key={i}
                        className="rounded bg-slate-800 border border-slate-700 px-2 py-0.5 text-[10px] text-slate-300"
                      >
                        {req}
                      </span>
                    ))}
                  </div>
                </div>

                {/* ACTION BUTTON */}
                <div className="pt-2">
                  {selectedShift.status === 'BOOKED' ? (
                    <div className="rounded-xl border border-emerald-500/30 bg-emerald-950/40 p-3 text-center text-xs font-bold text-emerald-400">
                      Shift Confirmed by {selectedShift.bookedDriverName || 'Driver'}
                    </div>
                  ) : lockingShiftId === selectedShift.id ? (
                    <button
                      onClick={handleConfirmBooking}
                      className="w-full rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black py-3 text-sm transition shadow-lg shadow-emerald-500/20 flex items-center justify-center gap-2"
                    >
                      <CheckCircle2 className="h-4 w-4" /> Confirm Booking ({lockRemainingSeconds}s lock)
                    </button>
                  ) : (
                    <button
                      onClick={() => handleInitiateLock(selectedShift)}
                      className="w-full rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-black py-3 text-sm transition shadow-lg shadow-amber-500/20 flex items-center justify-center gap-2"
                    >
                      <Lock className="h-4 w-4" /> Acquire 1-Tap Booking Lock
                    </button>
                  )}
                </div>
              </div>
            ) : (
              <div className="text-center py-16 text-slate-500 space-y-2">
                <Briefcase className="h-10 w-10 mx-auto text-slate-600" />
                <p className="text-sm font-medium">Select a shift to view full terms and IR35 SDS</p>
              </div>
            )}
          </div>
        </div>

        {/* POST SHIFT SUB-MODAL */}
        {showPostModal && (
          <div className="fixed inset-0 z-60 flex items-center justify-center bg-black/90 p-4">
            <div className="relative w-full max-w-lg rounded-xl border border-slate-700 bg-slate-900 p-5 text-slate-100 shadow-2xl max-h-[90vh] overflow-y-auto">
              <div className="flex items-center justify-between border-b border-slate-800 pb-3 mb-4">
                <h3 className="text-sm font-bold text-white flex items-center gap-2">
                  <PlusCircle className="h-4 w-4 text-amber-400" /> Post New Haulage Shift
                </h3>
                <button
                  onClick={() => setShowPostModal(false)}
                  className="rounded p-1 text-slate-400 hover:text-white"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>

              <form onSubmit={handleCreateShift} className="space-y-3 text-xs">
                <div>
                  <label className="block text-slate-400 font-semibold mb-1">Shift Title / Route</label>
                  <input
                    type="text"
                    required
                    value={newTitle}
                    onChange={(e) => setNewTitle(e.target.value)}
                    placeholder="e.g. Amazon LCY2 to EDI4 Trunking"
                    className="w-full rounded border border-slate-700 bg-slate-800 px-3 py-1.5 text-white"
                  />
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="block text-slate-400 font-semibold mb-1">Haulier Entity</label>
                    <input
                      type="text"
                      required
                      value={newHaulier}
                      onChange={(e) => setNewHaulier(e.target.value)}
                      className="w-full rounded border border-slate-700 bg-slate-800 px-3 py-1.5 text-white"
                    />
                  </div>
                  <div>
                    <label className="block text-slate-400 font-semibold mb-1">O-Licence Number</label>
                    <input
                      type="text"
                      required
                      value={newOlicence}
                      onChange={(e) => setNewOlicence(e.target.value)}
                      className="w-full rounded border border-slate-700 bg-slate-800 px-3 py-1.5 text-white font-mono"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="block text-slate-400 font-semibold mb-1">Depot / Hub Name</label>
                    <input
                      type="text"
                      required
                      value={newSite}
                      onChange={(e) => setNewSite(e.target.value)}
                      className="w-full rounded border border-slate-700 bg-slate-800 px-3 py-1.5 text-white"
                    />
                  </div>
                  <div>
                    <label className="block text-slate-400 font-semibold mb-1">Postcode (Proximity)</label>
                    <input
                      type="text"
                      required
                      value={newPostcode}
                      onChange={(e) => setNewPostcode(e.target.value)}
                      className="w-full rounded border border-slate-700 bg-slate-800 px-3 py-1.5 text-white font-mono uppercase"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="block text-slate-400 font-semibold mb-1">Vehicle Class</label>
                    <select
                      value={newClass}
                      onChange={(e) => setNewClass(e.target.value as any)}
                      className="w-full rounded border border-slate-700 bg-slate-800 px-2.5 py-1.5 text-white"
                    >
                      <option value="CAT_CE_CLASS_1">Class 1 (Cat C+E)</option>
                      <option value="CAT_C_CLASS_2">Class 2 (Cat C)</option>
                      <option value="ADR_HAZCHEM">ADR Hazchem</option>
                      <option value="HIAB_LORRY_LOADER">HIAB Crane</option>
                      <option value="MOFFETT_FORKLIFT">Moffett</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-slate-400 font-semibold mb-1">Trailer Type</label>
                    <select
                      value={newTrailer}
                      onChange={(e) => setNewTrailer(e.target.value as any)}
                      className="w-full rounded border border-slate-700 bg-slate-800 px-2.5 py-1.5 text-white"
                    >
                      <option value="CURTAINSIDER">Curtainsider</option>
                      <option value="BOX_VAN">Box Van</option>
                      <option value="REFRIGERATED_TEMP">Reefer Temp</option>
                      <option value="FLATBED">Flatbed</option>
                      <option value="RIGID_TAILLIFT">Rigid Tail-lift</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-2">
                  <div>
                    <label className="block text-slate-400 font-semibold mb-1">Base Rate (£/hr)</label>
                    <input
                      type="number"
                      step="0.5"
                      value={newBaseRate}
                      onChange={(e) => setNewBaseRate(e.target.value)}
                      className="w-full rounded border border-slate-700 bg-slate-800 px-2.5 py-1.5 text-white font-mono"
                    />
                  </div>
                  <div>
                    <label className="block text-slate-400 font-semibold mb-1">Overtime (£/hr)</label>
                    <input
                      type="number"
                      step="0.5"
                      value={newOvertimeRate}
                      onChange={(e) => setNewOvertimeRate(e.target.value)}
                      className="w-full rounded border border-slate-700 bg-slate-800 px-2.5 py-1.5 text-white font-mono"
                    />
                  </div>
                  <div>
                    <label className="block text-slate-400 font-semibold mb-1">Night Out (£)</label>
                    <input
                      type="number"
                      step="5"
                      value={newNightOut}
                      onChange={(e) => setNewNightOut(e.target.value)}
                      className="w-full rounded border border-slate-700 bg-slate-800 px-2.5 py-1.5 text-white font-mono"
                    />
                  </div>
                </div>

                {/* IR35 Selection */}
                <div>
                  <label className="block text-slate-400 font-semibold mb-1">
                    IR35 Tax Status Determination (Section 44 ITEPA)
                  </label>
                  <select
                    value={newIr35}
                    onChange={(e) => setNewIr35(e.target.value as any)}
                    className="w-full rounded border border-slate-700 bg-slate-800 px-2.5 py-1.5 text-white"
                  >
                    <option value="INSIDE_IR35">
                      Inside IR35 (Recommended Safe-Harbour - PAYE Umbrella Shield)
                    </option>
                    <option value="OUTSIDE_IR35_B2B">
                      Outside IR35 (B2B Gross - Requires Verified O-Licence)
                    </option>
                  </select>
                </div>

                <div className="pt-2 flex justify-end gap-2">
                  <button
                    type="button"
                    onClick={() => setShowPostModal(false)}
                    className="rounded bg-slate-800 px-4 py-2 font-semibold text-slate-300 hover:bg-slate-700"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="rounded bg-amber-500 px-4 py-2 font-bold text-slate-950 hover:bg-amber-400"
                  >
                    Publish to Marketplace
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
