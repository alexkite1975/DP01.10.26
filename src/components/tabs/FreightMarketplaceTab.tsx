'use client';
import React, { useState } from 'react';
import {
  Repeat,
  Truck,
  Users,
  Radio,
  Clock,
  MapPin,
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
  TrendingUp,
  SlidersHorizontal,
  Flame,
  Split,
  Plus
} from 'lucide-react';
import { MOCK_FREIGHT_LOADS, FreightLoadItem } from '../../data/mockFreightLoads';
import { initialMarketplaceShifts } from '../../data/mockMarketplaceData';
import { DriverVehicleProfile, MarketplaceShift } from '../../types';

interface FreightMarketplaceTabProps {
  driverVehicle: DriverVehicleProfile;
  onOpenReliefMarketplaceModal: () => void;
  onOpenHxWorkflow?: () => void;
  onOpenBreakEven?: () => void;
  onOpenDriverChecklist?: () => void;
  onOpenRecruitmentPlan?: () => void;
}

export const FreightMarketplaceTab: React.FC<FreightMarketplaceTabProps> = ({
  driverVehicle,
  onOpenReliefMarketplaceModal,
  onOpenHxWorkflow,
  onOpenBreakEven,
  onOpenDriverChecklist,
  onOpenRecruitmentPlan
}) => {
  // Toggle between Freight Loads and Relief Driver Shifts
  const [exchangeMode, setExchangeMode] = useState<'FREIGHT_LOADS' | 'RELIEF_SHIFTS'>('FREIGHT_LOADS');
  const [availableSoonBroadcasted, setAvailableSoonBroadcasted] = useState<boolean>(false);
  const [bookedLoadIds, setBookedLoadIds] = useState<string[]>([]);

  // Universal Driver Profile
  const [universalDriver] = useState<any>(() => {
    try {
      const saved = localStorage.getItem('dp_universal_driver_account_v1');
      if (saved) return JSON.parse(saved);
    } catch (_e) {}
    return null;
  });

  const handleBookLoad = (id: string) => {
    setBookedLoadIds((prev) => [...prev, id]);
  };

  return (
    <div className="space-y-4 pb-24 text-slate-100">
      {/* Quick TEG & RHA Strategy Toolstrip */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
        {onOpenHxWorkflow && (
          <button
            onClick={onOpenHxWorkflow}
            className="p-2.5 rounded-xl bg-slate-900 border border-slate-800 hover:border-cyan-500/50 text-left transition-all group"
          >
            <span className="text-[9px] font-mono text-cyan-400 font-bold block uppercase">HX Workflow</span>
            <span className="text-[11px] font-bold text-white group-hover:text-cyan-300 block truncate">6-Step &amp; CX</span>
          </button>
        )}
        {onOpenBreakEven && (
          <button
            onClick={onOpenBreakEven}
            className="p-2.5 rounded-xl bg-slate-900 border border-slate-800 hover:border-emerald-500/50 text-left transition-all group"
          >
            <span className="text-[9px] font-mono text-emerald-400 font-bold block uppercase">Break-Even</span>
            <span className="text-[11px] font-bold text-white group-hover:text-emerald-300 block truncate">Formula Engine</span>
          </button>
        )}
        {onOpenDriverChecklist && (
          <button
            onClick={onOpenDriverChecklist}
            className="p-2.5 rounded-xl bg-slate-900 border border-slate-800 hover:border-amber-500/50 text-left transition-all group"
          >
            <span className="text-[9px] font-mono text-amber-400 font-bold block uppercase">SOP-014</span>
            <span className="text-[11px] font-bold text-white group-hover:text-amber-300 block truncate">In-Cab Slip</span>
          </button>
        )}
        {onOpenRecruitmentPlan && (
          <button
            onClick={onOpenRecruitmentPlan}
            className="p-2.5 rounded-xl bg-slate-900 border border-slate-800 hover:border-purple-500/50 text-left transition-all group"
          >
            <span className="text-[9px] font-mono text-purple-400 font-bold block uppercase">ReliefHGV Pitch</span>
            <span className="text-[11px] font-bold text-white group-hover:text-purple-300 block truncate">Business Plan</span>
          </button>
        )}
      </div>

      {/* 1. Header Mode Selector (Freight Loads vs Relief Driver Shifts) */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-2 shadow-lg">
        <div className="grid grid-cols-2 gap-2">
          <button
            onClick={() => setExchangeMode('FREIGHT_LOADS')}
            className={`py-3 rounded-xl font-bold text-xs flex items-center justify-center gap-2 transition-all ${
              exchangeMode === 'FREIGHT_LOADS'
                ? 'bg-cyan-500 text-slate-950 shadow-md shadow-cyan-500/20'
                : 'text-slate-400 hover:text-white bg-slate-950/40'
            }`}
          >
            <Truck className="w-4 h-4" />
            Freight Loads (P2P Exchange)
          </button>

          <button
            onClick={() => setExchangeMode('RELIEF_SHIFTS')}
            className={`py-3 rounded-xl font-bold text-xs flex items-center justify-center gap-2 transition-all ${
              exchangeMode === 'RELIEF_SHIFTS'
                ? 'bg-cyan-500 text-slate-950 shadow-md shadow-cyan-500/20'
                : 'text-slate-400 hover:text-white bg-slate-950/40'
            }`}
          >
            <Users className="w-4 h-4" />
            Relief Driver Shifts (Cover)
          </button>
        </div>
      </div>

      {/* 2. 1-Tap "Available Soon" Capacity Broadcasting Banner */}
      <div className="bg-gradient-to-r from-cyan-950/60 to-blue-950/60 border border-cyan-500/40 rounded-2xl p-4 shadow-xl">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-cyan-500/20 text-cyan-400 flex items-center justify-center font-bold">
              <Radio className="w-5 h-5 animate-pulse" />
            </div>
            <div>
              <span className="text-xs font-bold text-white block">
                Broadcast Empty Capacity ("Available Soon")
              </span>
              <span className="text-[11px] text-slate-300">
                Alerts shippers within 30 miles that your 44t trailer will be free in 45 mins.
              </span>
            </div>
          </div>

          <button
            onClick={() => setAvailableSoonBroadcasted(!availableSoonBroadcasted)}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
              availableSoonBroadcasted
                ? 'bg-emerald-500 text-slate-950 shadow-lg shadow-emerald-500/30'
                : 'bg-cyan-500 hover:bg-cyan-400 text-slate-950'
            }`}
          >
            {availableSoonBroadcasted ? '✓ Live on Map' : 'Broadcast Now'}
          </button>
        </div>

        {availableSoonBroadcasted && (
          <div className="mt-3 pt-2 border-t border-cyan-800/40 text-[11px] text-cyan-300 flex items-center gap-1.5 font-mono">
            <CheckCircle2 className="w-3.5 h-3.5" />
            Active corridor broadcast: M1 Northbound (J18 - J26) • 14 local shippers notified
          </div>
        )}
      </div>

      {/* 3. Freight Loads Mode: Cascading Load Tendering Cards */}
      {exchangeMode === 'FREIGHT_LOADS' ? (
        <div className="space-y-3">
          <div className="flex items-center justify-between px-1">
            <span className="text-xs font-bold text-slate-300 font-mono uppercase tracking-wider">
              3-Tier Cascading Freight Tenders ({MOCK_FREIGHT_LOADS.length})
            </span>
            <span className="text-[10px] text-cyan-400">Auto-escalates rate every 15m</span>
          </div>

          {MOCK_FREIGHT_LOADS.map((load) => {
            const isBooked = bookedLoadIds.includes(load.id);
            const isTier1 = load.tierLevel === 1;
            const isTier2 = load.tierLevel === 2;
            const isTier3 = load.tierLevel === 3;

            return (
              <div
                key={load.id}
                className="bg-slate-900 border border-slate-800 rounded-2xl p-4 shadow-lg space-y-3"
              >
                {/* Top Badge: Tier Level & Escalation */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span
                      className={`text-[10px] font-black px-2 py-0.5 rounded font-mono ${
                        isTier1
                          ? 'bg-purple-500/20 text-purple-300 border border-purple-500/40'
                          : isTier2
                          ? 'bg-blue-500/20 text-blue-300 border border-blue-500/40'
                          : 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                      }`}
                    >
                      {load.tierLabel}
                    </span>

                    {load.isCrossDockMultiLeg && (
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-amber-500/20 text-amber-300 border border-amber-500/30 flex items-center gap-1">
                        <Split className="w-3 h-3" /> Multi-Leg Hub
                      </span>
                    )}
                  </div>

                  <span className="text-base font-black text-emerald-400 font-mono">
                    £{load.currentRateGbp.toFixed(2)}
                  </span>
                </div>

                {/* Shipper & Route */}
                <div>
                  <div className="text-xs text-slate-400 font-medium">{load.shipperName}</div>
                  <div className="text-sm font-bold text-white flex items-center gap-2 mt-1">
                    <span>{load.originHub}</span>
                    <ArrowRight className="w-4 h-4 text-cyan-400 shrink-0" />
                    <span>{load.destinationHub}</span>
                  </div>
                </div>

                {/* Load Spec Badges */}
                <div className="grid grid-cols-3 gap-2 bg-slate-950/80 p-2.5 rounded-xl border border-slate-800 text-[11px] text-slate-300">
                  <div>
                    <span className="text-slate-500 block text-[9px] font-mono">DISTANCE</span>
                    <strong className="text-white">{load.distanceMiles} Miles</strong>
                  </div>
                  <div>
                    <span className="text-slate-500 block text-[9px] font-mono">WEIGHT</span>
                    <strong className="text-white">{load.weightTonnes}t ({load.palletCount} Pallets)</strong>
                  </div>
                  <div>
                    <span className="text-slate-500 block text-[9px] font-mono">TRAILER</span>
                    <strong className="text-cyan-300 truncate block">{load.requiredTrailerType}</strong>
                  </div>
                </div>

                {/* Multi-leg Cross Dock details if applicable */}
                {load.isCrossDockMultiLeg && (
                  <div className="text-[11px] bg-amber-950/30 border border-amber-900/50 p-2 rounded-lg text-amber-200 flex items-center justify-between">
                    <span>Smart-Contract Cross-Dock: <strong>{load.hubTransferLocation}</strong></span>
                    <span className="font-mono text-[10px] text-amber-400">Leg 1 of 2</span>
                  </div>
                )}

                {/* Bottom Action & Countdown */}
                <div className="flex items-center justify-between pt-1">
                  <div className="text-xs text-slate-400 flex items-center gap-1.5 font-mono">
                    <Clock className="w-3.5 h-3.5 text-cyan-400" />
                    {load.minutesUntilNextTier > 0 ? (
                      <span>Tier auto-escalates in <strong>{load.minutesUntilNextTier}m</strong></span>
                    ) : (
                      <span className="text-emerald-400">Open to all carriers</span>
                    )}
                  </div>

                  <button
                    onClick={() => handleBookLoad(load.id)}
                    disabled={isBooked}
                    className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                      isBooked
                        ? 'bg-emerald-500 text-slate-950 font-black'
                        : 'bg-cyan-500 hover:bg-cyan-400 text-slate-950 shadow-md shadow-cyan-500/20'
                    }`}
                  >
                    {isBooked ? '✓ Booked' : 'Instant Bid / Book'}
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        /* 4. Relief Driver Shifts Mode */
        <div className="space-y-3">
          {universalDriver?.reliefRegistered && (
            <div className="p-3.5 rounded-2xl bg-gradient-to-r from-amber-500/15 via-emerald-500/15 to-slate-900 border border-emerald-500/40 flex items-center justify-between shadow-lg shadow-emerald-500/5">
              <div className="flex items-center gap-2.5">
                <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
                <div>
                  <div className="text-xs font-bold text-white flex items-center gap-2">
                    <span>Universal Account Verified for Relief Shifts</span>
                    <span className="text-[10px] font-mono text-emerald-300 bg-emerald-950 px-1.5 py-0.5 rounded border border-emerald-500/30">
                      DVLA &amp; CPC Active
                    </span>
                  </div>
                  <div className="text-[11px] text-slate-300">
                    {universalDriver.fullName} • Your target rate <strong className="text-amber-400">£{universalDriver.reliefHourlyRate || 32}/hr</strong> is broadcast to local hauliers.
                  </div>
                </div>
              </div>
              <span className="text-[10px] font-mono font-bold text-emerald-400 bg-slate-950 px-2.5 py-1 rounded-lg border border-slate-700">
                Direct Dispatch Ready
              </span>
            </div>
          )}

          <div className="flex items-center justify-between px-1">
            <span className="text-xs font-bold text-slate-300 font-mono uppercase tracking-wider">
              Emergency Relief Driver Shifts ({initialMarketplaceShifts.length})
            </span>
            <button
              onClick={onOpenReliefMarketplaceModal}
              className="text-xs text-cyan-400 font-bold hover:underline"
            >
              Full Dispatch Board →
            </button>
          </div>

          {initialMarketplaceShifts.map((shift: MarketplaceShift) => (
            <div
              key={shift.id}
              className="bg-slate-900 border border-slate-800 rounded-2xl p-4 shadow-lg space-y-2.5"
            >
              <div className="flex items-center justify-between">
                <div>
                  <span className="text-xs font-bold text-white block">{shift.haulierName}</span>
                  <span className="text-[11px] text-slate-400">{shift.siteName}</span>
                </div>
                <div className="text-right">
                  <span className="text-base font-black text-cyan-400 font-mono">
                    £{shift.baseHourlyRate}/hr
                  </span>
                  <span className="text-[10px] text-slate-500 block">
                    Est: £{(shift.durationHours * shift.baseHourlyRate).toFixed(2)}
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-2 text-xs text-slate-300">
                <span className="px-2 py-0.5 rounded bg-slate-800 font-mono text-[10px]">
                  {shift.shiftRef}
                </span>
                <span>•</span>
                <span>{shift.durationHours}h Shift</span>
                <span>•</span>
                <span className="text-emerald-400 font-semibold">{shift.vehicleClass}</span>
              </div>

              <div className="pt-2 border-t border-slate-800 flex items-center justify-between">
                <span className="text-[11px] text-slate-400 font-mono text-[10px]">{shift.ir35Status}</span>
                <button
                  onClick={onOpenReliefMarketplaceModal}
                  className="px-3.5 py-1.5 bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs rounded-xl"
                >
                  Accept Shift
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
