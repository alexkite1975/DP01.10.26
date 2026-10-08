'use client';
import React, { useState } from 'react';
import {
  Receipt,
  Clock,
  MapPin,
  CheckCircle2,
  AlertCircle,
  FileText,
  DollarSign,
  Zap,
  Download,
  Calendar,
  ChevronRight,
  ShieldCheck,
  Send
} from 'lucide-react';
import { SAMPLE_DEMURRAGE_CLAIMS, DemurrageCalculationResult } from '../../services/demurrageEngine';
import { DriverVehicleProfile } from '../../types';

interface TimesheetsPayrollTabProps {
  driverVehicle: DriverVehicleProfile;
  onOpenDemurrageLedgerModal: () => void;
  onOpenFullPayrollModal: () => void;
}

export const TimesheetsPayrollTab: React.FC<TimesheetsPayrollTabProps> = ({
  driverVehicle,
  onOpenDemurrageLedgerModal,
  onOpenFullPayrollModal
}) => {
  const [fastPayRequested, setFastPayRequested] = useState<boolean>(false);
  const [isSigned, setIsSigned] = useState<boolean>(false);

  // Mock timesheet shift records with GPS geofence & tacho timestamps
  const shifts = [
    {
      id: 'ts-101',
      date: 'Today (27 Sep 2026)',
      depot: 'Sainsbury\'s DIRFT RDC',
      geofenceArrival: '07:14 UTC',
      bayDocked: '07:22 UTC',
      bayCleared: '09:48 UTC',
      geofenceDeparture: '10:05 UTC',
      totalHours: '2h 51m',
      tachoVariance: '+18m gate delay vs scheduled slot',
      demurrageClaim: '£38.25 (51m excess wait)',
      status: 'APPROVED',
      grossEarnings: 185.00
    },
    {
      id: 'ts-102',
      date: 'Yesterday (26 Sep 2026)',
      depot: 'Amazon LBA4 Doncaster',
      geofenceArrival: '14:30 UTC',
      bayDocked: '14:45 UTC',
      bayCleared: '16:10 UTC',
      geofenceDeparture: '16:25 UTC',
      totalHours: '1h 55m',
      tachoVariance: 'Within 2h free-time limit',
      demurrageClaim: '£0.00 (On-time)',
      status: 'APPROVED',
      grossEarnings: 160.00
    },
    {
      id: 'ts-103',
      date: '25 Sep 2026',
      depot: 'Tesco Magor RDC',
      geofenceArrival: '06:00 UTC',
      bayDocked: '06:15 UTC',
      bayCleared: '09:30 UTC',
      geofenceDeparture: '09:50 UTC',
      totalHours: '3h 50m',
      tachoVariance: '+1h 50m bay congestion delay',
      demurrageClaim: '£82.50 (110m excess wait)',
      status: 'APPROVED',
      grossEarnings: 272.50
    }
  ];

  const baseWeeklyGross = shifts.reduce((acc, s) => acc + s.grossEarnings, 0);
  const demurrageClaimsTotal = 120.75;
  const [showDemurrageSection, setShowDemurrageSection] = useState(false);

  return (
    <div className="space-y-4 pb-24 text-slate-100">
      {/* 1. Fast-Pay & Available Earnings Hero Banner */}
      <div className="bg-gradient-to-br from-slate-900 to-slate-950 border border-slate-800 rounded-2xl p-4 shadow-xl">
        <div className="flex items-center justify-between">
          <div>
            <span className="text-slate-400 text-xs font-mono uppercase tracking-wider block">
              Base Weekly Timesheet Earnings
            </span>
            <div className="text-2xl font-black text-emerald-400 font-mono mt-0.5">
              £{baseWeeklyGross.toFixed(2)}
            </div>
            <span className="text-[11px] text-slate-400 mt-1 block">
              Verified against GPS on-site checkpoints &amp; tacho records
            </span>
          </div>

          <button
            onClick={() => setFastPayRequested(true)}
            disabled={fastPayRequested}
            className={`px-4 py-3 rounded-xl font-bold text-xs flex items-center gap-1.5 transition-all ${
              fastPayRequested
                ? 'bg-emerald-500 text-slate-950'
                : 'bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-slate-950 shadow-lg shadow-emerald-500/30'
            }`}
          >
            <Zap className="w-4 h-4" />
            {fastPayRequested ? 'Payout Processing (8h)' : 'Fast-Pay (8-24h)'}
          </button>
        </div>

        {fastPayRequested && (
          <div className="mt-3 p-2.5 bg-emerald-950/40 border border-emerald-800/60 rounded-xl text-emerald-300 text-xs flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 shrink-0" />
            <span>Fast-Pay transfer scheduled. Funds will hit your bank within 8 hours.</span>
          </div>
        )}
      </div>

      {/* 2. Segregated Demurrage & Detention Banner (Kept as a Separate Item) */}
      <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-3.5 shadow-sm space-y-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-amber-500/15 text-amber-400 flex items-center justify-center font-bold">
              <Clock className="w-4 h-4" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-white">
                  Separate Item: DC Demurrage &amp; Waiting Delay Tracker
                </span>
                <span className="text-[9px] font-mono px-2 py-0.5 rounded-full bg-slate-800 text-slate-400 border border-slate-700">
                  Optional
                </span>
              </div>
              <p className="text-[10px] text-slate-400">
                Only relevant for sub-contractors / drivers billing £45/hr bay waiting delays
              </p>
            </div>
          </div>

          <button
            onClick={() => setShowDemurrageSection(!showDemurrageSection)}
            className="text-xs font-mono font-bold px-2.5 py-1.5 bg-slate-800 hover:bg-slate-700 text-amber-300 rounded-lg transition-colors border border-slate-700"
          >
            {showDemurrageSection ? 'Hide' : 'Show Details'}
          </button>
        </div>

        {showDemurrageSection && (
          <div className="pt-2 border-t border-slate-800/80 space-y-2 animate-in fade-in duration-150">
            <div className="flex items-center justify-between text-xs font-mono">
              <span className="text-slate-400">Accrued Site Demurrage:</span>
              <strong className="text-amber-400 font-bold">+£{demurrageClaimsTotal.toFixed(2)}</strong>
            </div>
            <p className="text-[11px] text-slate-400 leading-relaxed">
              GPS geofence tracks bay detention beyond free 2-hour window and generates an official RHA-standard evidence pack.
            </p>
            <button
              onClick={onOpenDemurrageLedgerModal}
              className="w-full text-xs font-bold py-2 bg-amber-500/10 hover:bg-amber-500/20 text-amber-300 rounded-xl transition-colors border border-amber-500/30 flex items-center justify-center gap-1.5"
            >
              <span>Open Demurrage Claim Ledger</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>
        )}
      </div>

      {/* 3. Daily Geofence & Timesheet Ledger */}
      <div className="space-y-3">
        <div className="flex items-center justify-between px-1">
          <span className="text-xs font-bold text-slate-300 font-mono uppercase tracking-wider">
            GPS Geofence Shifts & Tacho Variance
          </span>
          <button
            onClick={onOpenFullPayrollModal}
            className="text-xs text-cyan-400 font-bold hover:underline"
          >
            Self-Billing Invoices →
          </button>
        </div>

        {shifts.map((s) => (
          <div
            key={s.id}
            className="bg-slate-900 border border-slate-800 rounded-2xl p-4 shadow-md space-y-2.5"
          >
            <div className="flex items-center justify-between">
              <div>
                <span className="text-xs font-bold text-white block">{s.depot}</span>
                <span className="text-[11px] text-slate-400 font-mono">{s.date}</span>
              </div>
              <div className="text-right">
                <span className="text-sm font-black text-emerald-400 font-mono">
                  +£{s.grossEarnings.toFixed(2)}
                </span>
                <span className="text-[10px] text-slate-500 block">{s.totalHours} on site</span>
              </div>
            </div>

            {/* Geofence Checkpoints */}
            <div className="grid grid-cols-4 gap-1.5 bg-slate-950/80 p-2 rounded-xl border border-slate-800 text-[10px] text-center font-mono">
              <div>
                <span className="text-slate-500 block text-[9px]">GEOFENCE IN</span>
                <span className="text-slate-200 font-bold">{s.geofenceArrival}</span>
              </div>
              <div>
                <span className="text-slate-500 block text-[9px]">BAY DOCKED</span>
                <span className="text-cyan-300 font-bold">{s.bayDocked}</span>
              </div>
              <div>
                <span className="text-slate-500 block text-[9px]">BAY CLEARED</span>
                <span className="text-cyan-300 font-bold">{s.bayCleared}</span>
              </div>
              <div>
                <span className="text-slate-500 block text-[9px]">GEOFENCE OUT</span>
                <span className="text-slate-200 font-bold">{s.geofenceDeparture}</span>
              </div>
            </div>

            {/* Variance & Demurrage */}
            <div className="flex items-center justify-between text-[11px] pt-1 border-t border-slate-800">
              <span className="text-amber-300/90 font-medium">{s.tachoVariance}</span>
              <span className="text-xs font-mono font-bold text-amber-400">
                {s.demurrageClaim}
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* 4. On-Screen Digital Driver Sign-off Pad */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 shadow-xl">
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs font-bold text-white block">Digital Driver e-Signature</span>
          <span className="text-[11px] text-slate-400">Timesheet approval</span>
        </div>

        <div className="h-20 bg-slate-950 border border-slate-800 rounded-xl flex items-center justify-center relative overflow-hidden">
          {isSigned ? (
            <div className="text-center">
              <span className="font-serif italic text-cyan-400 text-lg">Alex Kite</span>
              <span className="text-[10px] text-slate-500 block">Signed 27-Sep-2026 20:49 UTC</span>
            </div>
          ) : (
            <span className="text-xs text-slate-500 font-mono">
              Tap below to digitally sign weekly timesheet
            </span>
          )}
        </div>

        <button
          onClick={() => setIsSigned(!isSigned)}
          className={`w-full mt-3 py-3 rounded-xl font-bold text-xs flex items-center justify-center gap-2 transition-all ${
            isSigned
              ? 'bg-slate-800 text-emerald-400 border border-emerald-500/30'
              : 'bg-cyan-500 hover:bg-cyan-400 text-slate-950'
          }`}
        >
          <CheckCircle2 className="w-4 h-4" />
          {isSigned ? '✓ Timesheet Signed & Confirmed' : 'Sign & Submit Weekly Timesheet'}
        </button>
      </div>
    </div>
  );
};
