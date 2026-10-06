'use client';
import React, { useState } from 'react';
import {
  X,
  Lock,
  Unlock,
  CheckSquare,
  Square,
  ShieldCheck,
  QrCode,
  AlertTriangle,
  FileCheck,
  Sparkles,
  ArrowRight,
  HardHat,
  Eye,
  CheckCircle2,
  Printer
} from 'lucide-react';
import { SiteRiskAssessment, InductionGatekeeping } from '../types';

interface InductionGatekeeperModalProps {
  isOpen: boolean;
  onClose: () => void;
  site: SiteRiskAssessment;
  driverName: string;
  vehicleReg: string;
  onConfirmInduction: (siteId: string, updatedInduction: InductionGatekeeping) => void;
}

export const InductionGatekeeperModal: React.FC<InductionGatekeeperModalProps> = ({
  isOpen,
  onClose,
  site,
  driverName,
  vehicleReg,
  onConfirmInduction
}) => {
  const currentInduction = site.inductionGatekeeping || {
    isCompleted: false,
    oneWayTrafficAcknowledged: false,
    speedLimitAcknowledged: false,
    mandatoryPPEConfirmed: [],
    qrToken: `DP-GATE-${site.id}-${Date.now().toString().slice(-4)}`,
    isQrUnlocked: false,
    specialHazardsAcknowledged: []
  };

  const [oneWayTraffic, setOneWayTraffic] = useState(currentInduction.oneWayTrafficAcknowledged);
  const [speedLimit, setSpeedLimit] = useState(currentInduction.speedLimitAcknowledged);
  const [confirmedPPE, setConfirmedPPE] = useState<string[]>(
    currentInduction.mandatoryPPEConfirmed || []
  );
  const [isUnlocked, setIsUnlocked] = useState(currentInduction.isQrUnlocked);
  const [isProcessing, setIsProcessing] = useState(false);

  if (!isOpen) return null;

  const requiredPPEList =
    site.businessSection.mandatoryPPE && site.businessSection.mandatoryPPE.length > 0
      ? site.businessSection.mandatoryPPE
      : [
          'Hi-Vis Class 3 Vest/Jacket',
          'Safety Footwear (Steel Toe S3)',
          'Hard Hat (Yellow/White in Bay Area)'
        ];

  const togglePPE = (item: string) => {
    if (confirmedPPE.includes(item)) {
      setConfirmedPPE(confirmedPPE.filter((p) => p !== item));
    } else {
      setConfirmedPPE([...confirmedPPE, item]);
    }
  };

  const allPPEChecked = requiredPPEList.every((item) => confirmedPPE.includes(item));
  const canUnlock = oneWayTraffic && speedLimit && allPPEChecked;

  const handleUnlockAndConfirm = () => {
    setIsProcessing(true);
    setTimeout(() => {
      const updated: InductionGatekeeping = {
        isCompleted: true,
        completedAt: new Date().toISOString(),
        completedByDriver: driverName,
        oneWayTrafficAcknowledged: oneWayTraffic,
        speedLimitAcknowledged: speedLimit,
        mandatoryPPEConfirmed: confirmedPPE,
        qrToken: currentInduction.qrToken || `DP-AUTH-${Date.now()}`,
        isQrUnlocked: true,
        specialHazardsAcknowledged: ['Standard Yard Traffic Protocol']
      };
      setIsUnlocked(true);
      setIsProcessing(false);
      onConfirmInduction(site.id, updated);
    }, 500);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur-md p-3 sm:p-4 overflow-y-auto animate-in fade-in duration-200">
      <div className="relative w-full max-w-xl rounded-3xl bg-slate-900 border border-slate-800 text-white shadow-2xl overflow-hidden flex flex-col max-h-[94vh]">
        {/* Top Header */}
        <div className="px-5 py-4 border-b border-slate-800 flex items-center justify-between bg-slate-950">
          <div className="flex items-center gap-2.5">
            <div
              className={`h-9 w-9 rounded-2xl flex items-center justify-center ${
                isUnlocked
                  ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40'
                  : 'bg-rose-500/20 text-rose-400 border border-rose-500/40'
              }`}
            >
              {isUnlocked ? <Unlock className="h-5 w-5" /> : <Lock className="h-5 w-5" />}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span
                  className={`text-[10px] font-black tracking-wider uppercase ${
                    isUnlocked ? 'text-emerald-400' : 'text-rose-400'
                  }`}
                >
                  {isUnlocked ? 'Gate Token Active // Unlocked' : 'Security Gate Token Locked'}
                </span>
                <span className="text-[10px] rounded-full bg-slate-800 px-2 py-0.5 text-slate-400">
                  Section 3.C
                </span>
              </div>
              <h3 className="text-sm font-bold text-white">Digital Induction & PPE Gatekeeping</h3>
            </div>
          </div>
          <button
            onClick={onClose}
            className="rounded-xl p-2 text-slate-400 hover:bg-slate-800 hover:text-white transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-5 overflow-y-auto space-y-4">
          {/* Site Overview Banner */}
          <div className="rounded-2xl bg-slate-950 border border-slate-800 p-3.5 flex items-center justify-between">
            <div>
              <div className="text-xs font-bold text-slate-200">{site.title}</div>
              <p className="text-[11px] text-slate-400 mt-0.5">
                Gate Security Code: <strong className="text-amber-400">{site.businessSection.gateSecurityCode}</strong>
              </p>
            </div>
            <div className="text-right">
              <span className="text-[10px] text-slate-400">Driver / Vehicle</span>
              <div className="text-xs font-mono font-bold text-cyan-300">
                {driverName} ({vehicleReg})
              </div>
            </div>
          </div>

          {/* Section 1: Site Safety Induction Checklist */}
          <div className="rounded-2xl bg-slate-950/70 border border-slate-800 p-4 space-y-3">
            <h4 className="text-xs font-bold text-slate-200 uppercase tracking-wider flex items-center gap-1.5">
              <FileCheck className="h-4 w-4 text-cyan-400" />
              <span>1. Mandatory Site Rules Induction</span>
            </h4>

            <div className="space-y-2">
              <button
                type="button"
                onClick={() => setOneWayTraffic(!oneWayTraffic)}
                className="w-full flex items-start gap-3 p-2.5 rounded-xl bg-slate-900 border border-slate-800 hover:border-slate-700 text-left transition-colors"
              >
                {oneWayTraffic ? (
                  <CheckSquare className="h-5 w-5 text-emerald-400 shrink-0 mt-0.5" />
                ) : (
                  <Square className="h-5 w-5 text-slate-500 shrink-0 mt-0.5" />
                )}
                <div>
                  <div className="text-xs font-bold text-slate-200">
                    One-Way Traffic Flow & Clockwise Circulation
                  </div>
                  <p className="text-[11px] text-slate-400">
                    I confirm I will navigate the yard clockwise, never reversing against internal traffic.
                  </p>
                </div>
              </button>

              <button
                type="button"
                onClick={() => setSpeedLimit(!speedLimit)}
                className="w-full flex items-start gap-3 p-2.5 rounded-xl bg-slate-900 border border-slate-800 hover:border-slate-700 text-left transition-colors"
              >
                {speedLimit ? (
                  <CheckSquare className="h-5 w-5 text-emerald-400 shrink-0 mt-0.5" />
                ) : (
                  <Square className="h-5 w-5 text-slate-500 shrink-0 mt-0.5" />
                )}
                <div>
                  <div className="text-xs font-bold text-slate-200">
                    Strict Yard Speed Limit & Hazard Lights
                  </div>
                  <p className="text-[11px] text-slate-400">
                    Maximum 10mph (5mph in dock apron). Hazard flashers on during all bay approach maneuvers.
                  </p>
                </div>
              </button>
            </div>
          </div>

          {/* Section 2: Mandatory PPE Verification */}
          <div className="rounded-2xl bg-slate-950/70 border border-slate-800 p-4 space-y-3">
            <h4 className="text-xs font-bold text-slate-200 uppercase tracking-wider flex items-center gap-1.5">
              <HardHat className="h-4 w-4 text-amber-400" />
              <span>2. Mandatory Personal Protective Equipment (PPE)</span>
            </h4>

            <div className="space-y-1.5">
              {requiredPPEList.map((ppe) => {
                const checked = confirmedPPE.includes(ppe);
                return (
                  <button
                    key={ppe}
                    type="button"
                    onClick={() => togglePPE(ppe)}
                    className="w-full flex items-center justify-between p-2.5 rounded-xl bg-slate-900 border border-slate-800 hover:border-slate-700 text-left transition-colors"
                  >
                    <div className="flex items-center gap-2.5">
                      {checked ? (
                        <CheckSquare className="h-4 w-4 text-emerald-400" />
                      ) : (
                        <Square className="h-4 w-4 text-slate-500" />
                      )}
                      <span className="text-xs font-bold text-slate-200">{ppe}</span>
                    </div>
                    <span
                      className={`text-[10px] px-2 py-0.5 rounded-full font-bold ${
                        checked
                          ? 'bg-emerald-500/20 text-emerald-300'
                          : 'bg-slate-800 text-slate-400'
                      }`}
                    >
                      {checked ? 'Verified' : 'Required'}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Section 3: Gate Access QR Pass (Releases upon completion) */}
          <div className="rounded-2xl bg-slate-950 border border-slate-800 p-4 space-y-3 text-center">
            <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider">
              Automatic Gate Barrier QR Token
            </h4>

            {isUnlocked ? (
              /* Unlocked QR Pass */
              <div className="p-4 rounded-2xl bg-emerald-950/30 border-2 border-emerald-500/60 space-y-3 animate-in zoom-in-95 duration-200">
                <div className="inline-flex p-3 bg-white rounded-2xl shadow-xl">
                  {/* Simulated High-Res Scannable QR Matrix */}
                  <svg className="w-36 h-36" viewBox="0 0 100 100" fill="none">
                    <rect width="100" height="100" fill="white" />
                    {/* Corner Position Boxes */}
                    <rect x="10" y="10" width="24" height="24" fill="black" />
                    <rect x="14" y="14" width="16" height="16" fill="white" />
                    <rect x="18" y="18" width="8" height="8" fill="black" />
                    <rect x="66" y="10" width="24" height="24" fill="black" />
                    <rect x="70" y="14" width="16" height="16" fill="white" />
                    <rect x="74" y="18" width="8" height="8" fill="black" />
                    <rect x="10" y="66" width="24" height="24" fill="black" />
                    <rect x="14" y="70" width="16" height="16" fill="white" />
                    <rect x="18" y="74" width="8" height="8" fill="black" />
                    {/* Matrix payload dots */}
                    <rect x="42" y="14" width="6" height="6" fill="black" />
                    <rect x="52" y="20" width="6" height="6" fill="black" />
                    <rect x="38" y="28" width="6" height="6" fill="black" />
                    <rect x="48" y="42" width="10" height="10" fill="#0284c7" />
                    <rect x="22" y="44" width="8" height="8" fill="black" />
                    <rect x="70" y="44" width="8" height="8" fill="black" />
                    <rect x="44" y="68" width="8" height="8" fill="black" />
                    <rect x="60" y="68" width="6" height="6" fill="black" />
                    <rect x="76" y="76" width="8" height="8" fill="black" />
                  </svg>
                </div>

                <div className="space-y-1">
                  <div className="flex items-center justify-center gap-1.5 text-xs font-black text-emerald-400">
                    <CheckCircle2 className="h-4 w-4" />
                    <span>GATE BARRIER ACCESS AUTHORIZED</span>
                  </div>
                  <p className="text-[11px] font-mono text-slate-300">
                    Token: {currentInduction.qrToken}
                  </p>
                  <p className="text-[10px] text-slate-400">
                    Present screen directly to security scanner or gate barcode reader on driver approach.
                  </p>
                </div>
              </div>
            ) : (
              /* Locked State */
              <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 text-center space-y-3">
                <div className="h-14 w-14 rounded-2xl bg-rose-500/10 border border-rose-500/30 text-rose-400 flex items-center justify-center mx-auto">
                  <Lock className="h-7 w-7 animate-pulse" />
                </div>
                <div className="space-y-1 max-w-sm mx-auto">
                  <p className="text-xs font-bold text-slate-200">
                    Gate Access QR is Locked
                  </p>
                  <p className="text-[11px] text-slate-400">
                    Per ISO 45001 & Section 3.C compliance, gate barrier tokens remain locked until you acknowledge yard traffic rules and confirm mandatory PPE.
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Modal Footer */}
        <div className="p-4 border-t border-slate-800 bg-slate-950 flex items-center justify-between gap-3">
          <div className="text-[11px] text-slate-400">
            {isUnlocked ? (
              <span className="text-emerald-400 font-bold">Induction Verified</span>
            ) : canUnlock ? (
              <span className="text-cyan-400 font-bold">All Requirements Met</span>
            ) : (
              <span>Check all boxes above to release QR</span>
            )}
          </div>

          {!isUnlocked ? (
            <button
              type="button"
              onClick={handleUnlockAndConfirm}
              disabled={!canUnlock || isProcessing}
              className="py-2.5 px-6 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-400 hover:from-emerald-400 hover:to-teal-300 text-slate-950 font-black text-xs shadow-lg shadow-emerald-500/20 transition-all active:scale-95 disabled:opacity-40 disabled:cursor-not-allowed flex items-center gap-2"
            >
              {isProcessing ? (
                <>
                  <Sparkles className="h-4 w-4 animate-spin text-slate-950" />
                  <span>Authorizing Pass...</span>
                </>
              ) : (
                <>
                  <Unlock className="h-4 w-4" />
                  <span>Release Gate Access QR</span>
                </>
              )}
            </button>
          ) : (
            <button
              type="button"
              onClick={onClose}
              className="py-2.5 px-6 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs transition-colors"
            >
              Done
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
