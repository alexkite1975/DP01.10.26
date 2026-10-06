'use client';
import React, { useState } from 'react';
import {
  UserCheck,
  Shield,
  Award,
  FileText,
  Clock,
  CheckCircle2,
  Calendar,
  Lock,
  Download,
  AlertTriangle,
  CreditCard,
  Building2,
  ChevronRight,
  ExternalLink
} from 'lucide-react';
import { DriverVehicleProfile } from '../../types';

interface DriverProfileTabProps {
  driverVehicle: DriverVehicleProfile;
  onOpenTachographScanner: () => void;
  onOpenInductionGatekeeper: () => void;
  onOpenLicenceScanner?: () => void;
}

export const DriverProfileTab: React.FC<DriverProfileTabProps> = ({
  driverVehicle,
  onOpenTachographScanner,
  onOpenInductionGatekeeper,
  onOpenLicenceScanner
}) => {
  // CPC 35 Hour Progress
  const cpcCompletedHours = 28;
  const cpcTotalHours = 35;
  const cpcProgressPct = Math.round((cpcCompletedHours / cpcTotalHours) * 100);

  // Document Locker Items
  const documents = [
    {
      id: 'doc-1',
      title: 'HGV Class 1 (C+E) Driving License',
      issuer: 'DVLA Swansea',
      expiry: '14-May-2030',
      status: 'VERIFIED_ACTIVE',
      type: 'LICENSE'
    },
    {
      id: 'doc-2',
      title: 'Digital Tachograph Driver Card (Gen 2v2)',
      issuer: 'DVLA Tachograph Services',
      expiry: '28-Feb-2028',
      status: 'VERIFIED_ACTIVE',
      type: 'TACHO'
    },
    {
      id: 'doc-3',
      title: 'Driver CPC Qualification Card (DQC)',
      issuer: 'DVSA',
      expiry: '09-Sep-2029',
      status: 'VERIFIED_ACTIVE',
      type: 'CPC'
    },
    {
      id: 'doc-4',
      title: 'Sainsbury\'s National Depot Site Induction',
      issuer: 'Sainsbury\'s Logistics',
      expiry: 'Valid until 12-Dec-2026',
      status: 'VERIFIED_ACTIVE',
      type: 'INDUCTION'
    },
    {
      id: 'doc-5',
      title: 'Amazon Fulfillment UK Driver Safety Passport',
      issuer: 'Amazon Transportation Services',
      expiry: 'Valid until 18-Jan-2027',
      status: 'VERIFIED_ACTIVE',
      type: 'INDUCTION'
    }
  ];

  return (
    <div className="space-y-4 pb-24 text-slate-100">
      {/* 1. Driver Profile Hero Card with Community Karma */}
      <div className="bg-gradient-to-br from-slate-900 via-slate-900 to-cyan-950/40 border border-slate-800 rounded-2xl p-4 shadow-xl">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-14 h-14 rounded-2xl bg-cyan-500/20 border border-cyan-500/40 flex items-center justify-center text-cyan-400 font-black text-xl shadow-lg shadow-cyan-500/10">
              AK
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base font-bold text-white">Alex Kite</h2>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-cyan-500/20 text-cyan-300 border border-cyan-500/30">
                  TOP 5% DRIVER
                </span>
              </div>
              <p className="text-xs text-slate-400 mt-0.5">
                Class 1 C+E Articulated • ReliefHGV Accredited
              </p>
            </div>
          </div>

          <div className="text-right">
            <div className="flex items-center gap-1 justify-end text-amber-400 font-black text-lg">
              <Award className="w-5 h-5" />
              <span>98</span>
              <span className="text-xs text-slate-500 font-normal">/100</span>
            </div>
            <span className="text-[10px] text-slate-400 uppercase tracking-wider font-mono block">
              Karma Score
            </span>
          </div>
        </div>

        {/* Karma Badges Strip */}
        <div className="grid grid-cols-3 gap-2 mt-4 pt-3 border-t border-slate-800/80 text-center text-xs">
          <div className="bg-slate-950/60 p-2 rounded-xl border border-slate-800">
            <span className="text-[10px] text-slate-500 block font-mono">SAFE MILES</span>
            <span className="font-bold text-slate-200">184,500 mi</span>
          </div>
          <div className="bg-slate-950/60 p-2 rounded-xl border border-slate-800">
            <span className="text-[10px] text-slate-500 block font-mono">VERIFIED HAZARDS</span>
            <span className="font-bold text-cyan-300">14 Verified</span>
          </div>
          <div className="bg-slate-950/60 p-2 rounded-xl border border-slate-800">
            <span className="text-[10px] text-slate-500 block font-mono">ZERO STRIKES</span>
            <span className="font-bold text-emerald-400">100% Clean</span>
          </div>
        </div>
      </div>

      {/* 2. Driver CPC 35-Hour Progress Bar */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 shadow-lg space-y-2.5">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Clock className="w-4 h-4 text-purple-400" />
            <span className="text-xs font-bold text-white uppercase tracking-wider font-mono">
              Driver CPC 35-Hour Cycle
            </span>
          </div>
          <span className="text-xs font-mono font-bold text-purple-300">
            {cpcCompletedHours} of {cpcTotalHours} Hours ({cpcProgressPct}%)
          </span>
        </div>

        <div className="w-full bg-slate-950 rounded-full h-3 border border-slate-800 overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-purple-500 to-indigo-500 transition-all"
            style={{ width: `${cpcProgressPct}%` }}
          />
        </div>

        <div className="flex items-center justify-between text-[11px] text-slate-400">
          <span>Current Cycle Deadline: <strong>09-Sep-2029</strong></span>
          <span className="text-purple-400 font-semibold">1 Module (7h) Remaining</span>
        </div>
      </div>

      {/* 3. Digital Tachograph Card Sync Status */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 shadow-lg flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-blue-500/20 text-blue-400 flex items-center justify-center font-bold">
            <CreditCard className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-white block">Digital Tacho Card Synced</span>
              <span className="text-[10px] font-bold px-1.5 py-0.2 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                ACTIVE
              </span>
            </div>
            <span className="text-[11px] text-slate-400">
              Card: 100000000492800 • Last read 4h ago
            </span>
          </div>
        </div>

        <button
          onClick={onOpenTachographScanner}
          className="px-3 py-2 bg-slate-800 hover:bg-slate-700 text-blue-300 text-xs font-bold rounded-xl transition-colors"
        >
          Scan Printout
        </button>
      </div>

      {/* 4. Document Locker (RAMS, Licences, Site Inductions) */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 shadow-xl space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <FileText className="w-4 h-4 text-cyan-400" />
            <span className="text-xs font-bold text-white uppercase tracking-wider font-mono">
              Driver Compliance Locker
            </span>
          </div>
          <div className="flex items-center gap-2">
            {onOpenLicenceScanner && (
              <button
                onClick={onOpenLicenceScanner}
                className="text-xs text-amber-400 font-bold hover:underline cursor-pointer"
              >
                Scan Licence →
              </button>
            )}
            <button
              onClick={onOpenInductionGatekeeper}
              className="text-xs text-cyan-400 font-bold hover:underline"
            >
              Gatekeeper Passport →
            </button>
          </div>
        </div>

        <div className="space-y-2">
          {documents.map((doc) => (
            <div
              key={doc.id}
              className="p-3 bg-slate-950/80 rounded-xl border border-slate-800 flex items-center justify-between text-xs"
            >
              <div>
                <span className="font-semibold text-slate-100 block">{doc.title}</span>
                <span className="text-[11px] text-slate-400">
                  {doc.issuer} • <span className="text-slate-300">{doc.expiry}</span>
                </span>
              </div>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
                VERIFIED
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
