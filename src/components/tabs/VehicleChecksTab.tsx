'use client';
import React, { useState } from 'react';
import {
  ClipboardCheck,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  Camera,
  ShieldCheck,
  Eye,
  Lock,
  Unlock,
  Truck,
  RotateCw,
  FileCheck,
  ChevronDown,
  ChevronUp,
  Sparkles,
  Radio
} from 'lucide-react';
import {
  DVSA_STATUTORY_CHECKPOINTS,
  DvsaCheckItem,
  calculateDvsaRoadworthinessScore
} from '../../data/dvsaCheckpoints';
import { DriverVehicleProfile } from '../../types';
import { ConversationalChecklist } from '../vehicleCheck/ConversationalChecklist';
import { DeliverySiteRouteModal } from '../vehicleCheck/DeliverySiteRouteModal';
import { DriverWalkaroundSettingsModal } from '../vehicleCheck/DriverWalkaroundSettingsModal';
import { calculateCombinationEnvelope } from '../../data/sampleVehicleChecks';

interface VehicleChecksTabProps {
  driverVehicle: DriverVehicleProfile;
  onOpenTyreVision: () => void;
  onOpenCouplingVision: () => void;
}

export const VehicleChecksTab: React.FC<VehicleChecksTabProps> = ({
  driverVehicle,
  onOpenTyreVision,
  onOpenCouplingVision
}) => {
  const [checkpoints, setCheckpoints] = useState<DvsaCheckItem[]>(DVSA_STATUTORY_CHECKPOINTS);
  const [filterAsset, setFilterAsset] = useState<'ALL' | 'TRACTOR' | 'TRAILER'>('ALL');
  const [filterCategory, setFilterCategory] = useState<string>('ALL');
  const [selectedPhotoCheck, setSelectedPhotoCheck] = useState<string | null>(null);
  const [isSignedOff, setIsSignedOff] = useState<boolean>(false);
  const [isConversationalChecklistOpen, setIsConversationalChecklistOpen] = useState(false);
  const [isDeliveryRouteModalOpen, setIsDeliveryRouteModalOpen] = useState(false);
  const [isDriverSettingsModalOpen, setIsDriverSettingsModalOpen] = useState(false);

  // Wheel re-torque state
  const [wheelRetorqued, setWheelRetorqued] = useState<boolean>(true);

  // Roadworthiness & Defect Statistics
  const roadworthiness = calculateDvsaRoadworthinessScore(checkpoints);
  const passedCount = roadworthiness.passed;
  const failedCount = roadworthiness.failed;
  const hasSafetyCriticalDefect = roadworthiness.immediatePg9Fails > 0;

  // Defect Photo Failure Lock: any failed item needing a photo must have photoUrl
  const unphotographedFails = checkpoints.filter(
    (c) => c.status === 'FAIL' && c.defectPhotoRequiredIfFailed && !c.photoUrl
  );
  const isFailureLocked = unphotographedFails.length > 0;

  const handleToggleStatus = (id: string, newStatus: 'PASS' | 'FAIL') => {
    setCheckpoints((prev) =>
      prev.map((item) => (item.id === id ? { ...item, status: newStatus } : item))
    );
  };

  const handleSimulatePhotoUpload = (id: string) => {
    const mockPhoto =
      'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="200" height="150" viewBox="0 0 200 150"><rect width="200" height="150" fill="%23e11d48"/><text x="50%25" y="50%25" fill="white" font-size="12" font-family="sans-serif" text-anchor="middle" dy=".3em">DEFECT PHOTO VERIFIED</text></svg>';
    setCheckpoints((prev) =>
      prev.map((item) => (item.id === id ? { ...item, photoUrl: mockPhoto } : item))
    );
    setSelectedPhotoCheck(null);
  };

  const filteredItems = checkpoints.filter((chk) => {
    const matchesCategory = filterCategory === 'ALL' || chk.category === filterCategory;
    const matchesAsset =
      filterAsset === 'ALL' ||
      (filterAsset === 'TRACTOR' &&
        (chk.targetAsset === 'TRACTOR_UNIT' || chk.targetAsset === 'COMBINED_INTERFACE')) ||
      (filterAsset === 'TRAILER' &&
        (chk.targetAsset === 'SEMI_TRAILER' || chk.targetAsset === 'COMBINED_INTERFACE'));
    return matchesCategory && matchesAsset;
  });

  return (
    <div className="space-y-4 pb-24 text-slate-100">
      {/* 1. DVLA Tax, MOT & Compliance Header */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 shadow-lg">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-mono font-black text-sm text-slate-100 bg-slate-950 px-2 py-0.5 rounded border border-slate-800">
                  {driverVehicle.vehicleReg}
                </span>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/40">
                  DVLA MOT VALID: 18-NOV-2026
                </span>
              </div>
              <p className="text-xs text-slate-400 mt-1">
                DVSA Statutory Walkaround • 32 Mandatory Checkpoints (Tractor &amp; Trailer)
              </p>
            </div>
          </div>
        </div>

        {/* Smart Wheel Re-Torque Alert */}
        <div className="mt-3 p-3 rounded-xl bg-slate-950/80 border border-slate-800 flex items-center justify-between text-xs">
          <div className="flex items-center gap-2">
            <RotateCw className="w-4 h-4 text-cyan-400" />
            <div>
              <span className="font-semibold text-slate-200 block">Smart Wheel Re-Torque Compliance</span>
              <span className="text-[11px] text-slate-400">
                Torqued to 600 Nm • Next required in 420 miles
              </span>
            </div>
          </div>
          <button
            onClick={() => setWheelRetorqued(!wheelRetorqued)}
            className={`text-xs px-2.5 py-1 rounded-lg font-bold transition-colors ${
              wheelRetorqued
                ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                : 'bg-amber-500 text-slate-950'
            }`}
          >
            {wheelRetorqued ? '✓ Logged' : 'Verify Now'}
          </button>
        </div>
      </div>

      {/* Conversational Co-Pilot Walkaround Launch Card */}
      <div className="bg-gradient-to-r from-emerald-500/20 via-teal-500/10 to-slate-900 border-2 border-emerald-500/60 rounded-2xl p-4 shadow-xl">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-400 text-slate-950 flex items-center justify-center font-bold shadow-md shadow-emerald-500/30 shrink-0">
              <Radio className="w-6 h-6 text-slate-950 animate-pulse" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h4 className="text-base font-black text-white">Conversational 32-Point Walkaround</h4>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-emerald-400 text-slate-950 font-black">
                  VOICE &amp; AR CO-PILOT
                </span>
              </div>
              <p className="text-xs text-slate-300 mt-0.5">
                Confirm all 32 points hands-free • Say "Pass", "Fail" with reason • Take photo of seal, trailer height or video at any stage
              </p>
            </div>
          </div>
          <button
            onClick={() => setIsConversationalChecklistOpen(true)}
            className="px-6 py-3 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-400 hover:from-emerald-400 hover:to-teal-300 text-slate-950 font-black text-xs sm:text-sm shadow-lg shadow-emerald-500/20 flex items-center justify-center gap-2 cursor-pointer transition-all active:scale-95 shrink-0"
          >
            <Radio className="w-4 h-4 text-slate-950" />
            <span>Start Voice Co-Pilot</span>
          </button>
        </div>
      </div>

      {/* 2. AI Multimodal Vision Shortcuts (Tyre & Coupling) */}
      <div className="grid grid-cols-2 gap-3">
        <button
          onClick={onOpenTyreVision}
          className="p-3.5 rounded-2xl bg-gradient-to-br from-slate-900 to-slate-950 border border-slate-800 hover:border-cyan-500/50 text-left transition-all group shadow-md"
        >
          <div className="w-8 h-8 rounded-lg bg-cyan-500/20 text-cyan-400 flex items-center justify-center mb-2">
            <Sparkles className="w-4 h-4" />
          </div>
          <div className="text-xs font-bold text-white group-hover:text-cyan-300">
            AI Tyre Vision Scan
          </div>
          <div className="text-[11px] text-slate-400">Scan tread depth &amp; nut pointers</div>
        </button>

        <button
          onClick={onOpenCouplingVision}
          className="p-3.5 rounded-2xl bg-gradient-to-br from-slate-900 to-slate-950 border border-slate-800 hover:border-emerald-500/50 text-left transition-all group shadow-md"
        >
          <div className="w-8 h-8 rounded-lg bg-emerald-500/20 text-emerald-400 flex items-center justify-center mb-2">
            <Sparkles className="w-4 h-4" />
          </div>
          <div className="text-xs font-bold text-white group-hover:text-emerald-300">
            AI 5th Wheel Check
          </div>
          <div className="text-[11px] text-slate-400">Verify dog-clip &amp; kingpin jaws</div>
        </button>
      </div>

      {/* 3. Inspection Progress, Target Asset & Category Filter */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 shadow-lg space-y-3">
        <div className="flex items-center justify-between">
          <div>
            <span className="text-xs font-bold text-white uppercase tracking-wider font-mono">
              Walkaround Progress
            </span>
            <div className="text-xs text-slate-400 mt-0.5">
              {passedCount} Passed • {failedCount} Failed of 32 Statutory Checkpoints
            </div>
          </div>

          <div className="flex items-center gap-1.5">
            {hasSafetyCriticalDefect ? (
              <span className="text-xs font-black px-2.5 py-1 rounded-full bg-rose-600 text-white animate-pulse">
                RED PG9 VOR GROUNDED
              </span>
            ) : roadworthiness.delayed10DayFails > 0 ? (
              <span className="text-xs font-bold px-2.5 py-1 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/40">
                10-DAY RECTIFICATION
              </span>
            ) : (
              <span className="text-xs font-bold px-2.5 py-1 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/40">
                100% ROADWORTHY
              </span>
            )}
            {isFailureLocked && (
              <span className="text-xs font-bold px-2 py-1 rounded-full bg-amber-500/20 text-amber-300 flex items-center gap-1 border border-amber-500/40">
                <Lock className="w-3 h-3" /> Photo Lock
              </span>
            )}
          </div>
        </div>

        {/* Target Asset Selector (Tractor vs Trailer vs All) */}
        <div className="flex items-center gap-1.5 p-1 bg-slate-950 rounded-xl border border-slate-800 text-xs">
          <button
            onClick={() => setFilterAsset('ALL')}
            className={`flex-1 py-1.5 px-2 rounded-lg font-bold transition-all text-center ${
              filterAsset === 'ALL'
                ? 'bg-cyan-500 text-slate-950 shadow-sm'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            All 32 Points
          </button>
          <button
            onClick={() => setFilterAsset('TRACTOR')}
            className={`flex-1 py-1.5 px-2 rounded-lg font-bold transition-all text-center flex items-center justify-center gap-1 ${
              filterAsset === 'TRACTOR'
                ? 'bg-cyan-500 text-slate-950 shadow-sm'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <span>🚛 Tractor</span>
            <span className="text-[10px] opacity-75">(20)</span>
          </button>
          <button
            onClick={() => setFilterAsset('TRAILER')}
            className={`flex-1 py-1.5 px-2 rounded-lg font-bold transition-all text-center flex items-center justify-center gap-1 ${
              filterAsset === 'TRAILER'
                ? 'bg-cyan-500 text-slate-950 shadow-sm'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <span>🚚 Trailer</span>
            <span className="text-[10px] opacity-75">(12)</span>
          </button>
        </div>

        {/* Category Filter Chips */}
        <div className="flex gap-1.5 overflow-x-auto pb-1 scrollbar-none text-xs">
          {[
            { id: 'ALL', label: 'All Categories' },
            { id: 'CAB_CONTROLS', label: 'Cab Controls (10)' },
            { id: 'TRACTOR_EXTERIOR', label: 'Tractor Powertrain (10)' },
            { id: 'COUPLING_CATWALK', label: 'Coupling & Catwalk (5)' },
            { id: 'TRAILER_RUNNING_GEAR', label: 'Trailer Axles (4)' },
            { id: 'TRAILER_BODY_LOAD', label: 'Curtains & Doors (2)' },
            { id: 'LIGHTING_MARKERS', label: 'Rear Lighting & Markers (1)' }
          ].map((cat) => (
            <button
              key={cat.id}
              onClick={() => setFilterCategory(cat.id)}
              className={`px-3 py-1.5 rounded-xl whitespace-nowrap font-medium transition-colors ${
                filterCategory === cat.id
                  ? 'bg-cyan-500 text-slate-950 font-bold'
                  : 'bg-slate-800 text-slate-400 hover:text-slate-200'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>
      </div>

      {/* 4. Card-by-Card Checkpoints List */}
      <div className="space-y-2.5">
        {filteredItems.map((chk) => {
          const isPassed = chk.status === 'PASS';
          const isFailed = chk.status === 'FAIL';
          const needsPhoto = isFailed && chk.defectPhotoRequiredIfFailed && !chk.photoUrl;

          return (
            <div
              key={chk.id}
              className={`p-4 rounded-2xl border transition-all ${
                isFailed
                  ? 'bg-rose-950/40 border-rose-600/80 shadow-md shadow-rose-950/50'
                  : 'bg-slate-900 border-slate-800'
              }`}
            >
              <div className="flex items-start justify-between gap-3">
                <div className="flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="font-mono text-[10px] font-bold px-1.5 py-0.5 rounded bg-slate-800 text-slate-300">
                      {chk.code}
                    </span>
                    <span className="text-xs font-bold text-white">{chk.title}</span>
                    <span className="text-[9px] font-mono px-1.5 py-0.5 rounded bg-slate-950 text-slate-400 border border-slate-800">
                      {chk.targetAsset === 'TRACTOR_UNIT'
                        ? '🚛 Tractor'
                        : chk.targetAsset === 'SEMI_TRAILER'
                        ? '🚚 Trailer'
                        : '🔗 Interface'}
                    </span>
                    {chk.prohibitionType === 'IMMEDIATE_PG9' && (
                      <span className="text-[9px] font-bold px-1.5 py-0.2 rounded bg-rose-500/20 text-rose-300 border border-rose-500/30">
                        PG9 Grounding
                      </span>
                    )}
                    {chk.prohibitionType === 'DELAYED_10_DAY' && (
                      <span className="text-[9px] font-bold px-1.5 py-0.2 rounded bg-amber-500/20 text-amber-300 border border-amber-500/30">
                        10-Day Notice
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                    {chk.description}
                  </p>
                  <p className="text-[10px] font-mono text-cyan-400/80 mt-1">
                    {chk.dvsaReference}
                  </p>
                </div>

                {/* PASS / FAIL Toggle Buttons */}
                <div className="flex items-center gap-1.5 shrink-0">
                  <button
                    onClick={() => handleToggleStatus(chk.id, 'PASS')}
                    className={`p-2 rounded-xl transition-all ${
                      isPassed
                        ? 'bg-emerald-500 text-slate-950 font-bold shadow-md shadow-emerald-500/30 scale-105'
                        : 'bg-slate-800 text-slate-500 hover:text-slate-300'
                    }`}
                  >
                    <CheckCircle2 className="w-5 h-5" />
                  </button>

                  <button
                    onClick={() => handleToggleStatus(chk.id, 'FAIL')}
                    className={`p-2 rounded-xl transition-all ${
                      isFailed
                        ? 'bg-rose-600 text-white font-bold shadow-md shadow-rose-600/30 scale-105'
                        : 'bg-slate-800 text-slate-500 hover:text-slate-300'
                    }`}
                  >
                    <XCircle className="w-5 h-5" />
                  </button>
                </div>
              </div>

              {/* Mandatory Defect Photo Upload Requirement */}
              {isFailed && (
                <div className="mt-3 pt-3 border-t border-rose-900/60 flex items-center justify-between">
                  <div className="flex items-center gap-2 text-xs">
                    {chk.photoUrl ? (
                      <span className="text-emerald-400 font-semibold flex items-center gap-1">
                        <CheckCircle2 className="w-3.5 h-3.5" /> Defect Photo Attached
                      </span>
                    ) : (
                      <span className="text-amber-400 font-bold flex items-center gap-1 animate-pulse">
                        <Camera className="w-3.5 h-3.5" /> Mandatory Photo Proof Required
                      </span>
                    )}
                  </div>

                  {!chk.photoUrl && (
                    <button
                      onClick={() => handleSimulatePhotoUpload(chk.id)}
                      className="px-3 py-1.5 bg-rose-600 hover:bg-rose-500 text-white text-xs font-bold rounded-lg flex items-center gap-1.5"
                    >
                      <Camera className="w-3.5 h-3.5" />
                      Take Photo
                    </button>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* 5. Sign-Off & Roadworthiness Declaration */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 shadow-xl">
        <div className="flex items-center justify-between mb-3">
          <div>
            <span className="text-xs font-bold text-white block">Driver Walkaround Declaration</span>
            <span className="text-[11px] text-slate-400">
              I confirm the 32-point check was performed in compliance with DVSA guidelines.
            </span>
          </div>
        </div>

        {isFailureLocked ? (
          <div className="p-3 bg-amber-500/10 border border-amber-500/30 rounded-xl text-amber-300 text-xs flex items-center gap-2">
            <Lock className="w-4 h-4 shrink-0" />
            <span>Sign-off locked: All failed items require an attached photo proof.</span>
          </div>
        ) : (
          <button
            onClick={() => setIsSignedOff(true)}
            className={`w-full py-3.5 rounded-xl font-bold text-xs flex items-center justify-center gap-2 transition-all ${
              isSignedOff
                ? 'bg-emerald-500 text-slate-950'
                : hasSafetyCriticalDefect
                ? 'bg-rose-600 hover:bg-rose-500 text-white'
                : 'bg-cyan-500 hover:bg-cyan-400 text-slate-950 shadow-lg shadow-cyan-500/20'
            }`}
          >
            <FileCheck className="w-4 h-4" />
            {isSignedOff
              ? '✓ Walkaround Completed & Roadworthy Declared'
              : hasSafetyCriticalDefect
              ? 'Submit Defect & Ground Vehicle (VOR)'
              : 'Sign & Submit Daily Roadworthiness Check'}
          </button>
        )}
      </div>

      {/* Conversational Checklist Modal */}
      {isConversationalChecklistOpen && (
        <ConversationalChecklist
          onClose={() => setIsConversationalChecklistOpen(false)}
          onCompleteChecklist={(results) => {
            setCheckpoints(results.checkpoints);
            setIsConversationalChecklistOpen(false);
          }}
          vehicleReg={driverVehicle.vehicleReg}
          trailerId="TR-8842"
          onOpenDeliverySiteRouteModal={() => setIsDeliveryRouteModalOpen(true)}
        />
      )}

      {/* Delivery Site & Compliant HGV Route Modal */}
      {isDeliveryRouteModalOpen && (
        <DeliverySiteRouteModal
          isOpen={isDeliveryRouteModalOpen}
          onClose={() => setIsDeliveryRouteModalOpen(false)}
          combinationEnvelope={calculateCombinationEnvelope(driverVehicle.vehicleReg, 'TR-8842', 26.5)}
          selectedTractorReg={driverVehicle.vehicleReg}
          selectedTrailerId="TR-8842"
          driverName="Alexander James Kite"
        />
      )}

      {/* Driver Walkaround Routine AI Settings Modal */}
      {isDriverSettingsModalOpen && (
        <DriverWalkaroundSettingsModal
          isOpen={isDriverSettingsModalOpen}
          onClose={() => setIsDriverSettingsModalOpen(false)}
        />
      )}
    </div>
  );
};
