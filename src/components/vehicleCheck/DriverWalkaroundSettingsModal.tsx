'use client';
import React, { useState } from 'react';
import {
  X,
  Sparkles,
  Sliders,
  CheckCircle2,
  RotateCcw,
  Truck,
  ArrowRight,
  ShieldAlert,
  Clock,
  Activity,
  Compass,
  FileText,
  ListOrdered
} from 'lucide-react';
import {
  InspectionSequenceMode,
  DriverWalkaroundPreference
} from '../../types/vehicleCheckTypes';
import {
  getDriverWalkaroundPreference,
  setInspectionSequenceMode,
  DEFAULT_AI_LEARNED_ORDER,
  saveDriverWalkaroundPreference
} from '../../services/driverWalkaroundPreferenceService';
import { DVSA_STATUTORY_CHECKPOINTS } from '../../data/dvsaCheckpoints';

interface DriverWalkaroundSettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  onPreferencesChanged?: (updated: DriverWalkaroundPreference) => void;
}

export const DriverWalkaroundSettingsModal: React.FC<DriverWalkaroundSettingsModalProps> = ({
  isOpen,
  onClose,
  onPreferencesChanged
}) => {
  const [pref, setPref] = useState<DriverWalkaroundPreference>(() => getDriverWalkaroundPreference());
  const [showFullSequencePreview, setShowFullSequencePreview] = useState(false);

  if (!isOpen) return null;

  const handleSelectMode = (mode: InspectionSequenceMode) => {
    const updated = setInspectionSequenceMode(mode);
    setPref(updated);
    if (onPreferencesChanged) onPreferencesChanged(updated);
  };

  const handleResetLearning = () => {
    const reset: DriverWalkaroundPreference = {
      ...pref,
      mode: 'AI_ADAPTIVE',
      preferredSequence: DEFAULT_AI_LEARNED_ORDER,
      historySessionsCount: 1,
      habitConfidencePercent: 88.0,
      habitSummary: 'Calibrated default HGV routine: In-Cab warm-up → Front Lights → Offside Steer → Susie Catwalk Acoustic Test → Trailer Running Gear → Rear Cargo Doors',
      lastCalibrationTimestamp: new Date().toISOString()
    };
    saveDriverWalkaroundPreference(reset);
    setPref(reset);
    if (onPreferencesChanged) onPreferencesChanged(reset);
  };

  const checkpointMap = new Map(DVSA_STATUTORY_CHECKPOINTS.map((c) => [c.govUkItemNumber, c]));

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur-md p-4 animate-in fade-in duration-200">
      <div className="relative w-full max-w-xl rounded-3xl bg-slate-950 border border-emerald-500/40 text-white shadow-2xl p-6 space-y-6 max-h-[92vh] overflow-y-auto">
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 text-slate-400 hover:text-white rounded-xl hover:bg-slate-800 transition-colors"
          aria-label="Close Settings"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header */}
        <div className="flex items-center gap-3 border-b border-slate-800 pb-4">
          <div className="w-12 h-12 rounded-2xl bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 flex items-center justify-center font-bold">
            <Sliders className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-lg font-black text-white">Driver Walkaround Routine AI</h3>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/40">
                AI Adaptive Engine
              </span>
            </div>
            <p className="text-xs text-slate-400">
              Configure how the conversational voice co-pilot &amp; AR guide steps through your 32-point inspection
            </p>
          </div>
        </div>

        {/* AI Habit Learning Metrics Card */}
        <div className="p-4 rounded-2xl bg-gradient-to-br from-emerald-950/40 via-slate-900 to-slate-950 border border-emerald-500/30 space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-emerald-400 font-bold text-xs uppercase tracking-wider">
              <Sparkles className="w-4 h-4" />
              <span>AI Learned Habit Analytics</span>
            </div>
            <span className="text-xs font-mono font-bold text-emerald-300 bg-emerald-950 px-2 py-0.5 rounded border border-emerald-500/30">
              {pref.habitConfidencePercent}% Confidence
            </span>
          </div>

          <p className="text-xs text-slate-300 leading-relaxed font-mono">
            {pref.habitSummary}
          </p>

          <div className="grid grid-cols-3 gap-2 pt-2 border-t border-slate-800/80 text-center">
            <div className="p-2 rounded-xl bg-slate-900/80 border border-slate-800">
              <div className="text-[10px] text-slate-400">Historical Audits</div>
              <div className="text-sm font-bold text-white font-mono">{pref.historySessionsCount} Sessions</div>
            </div>
            <div className="p-2 rounded-xl bg-slate-900/80 border border-slate-800">
              <div className="text-[10px] text-slate-400">Avg Duration</div>
              <div className="text-sm font-bold text-emerald-400 font-mono">{pref.averageDurationMinutes} mins</div>
            </div>
            <div className="p-2 rounded-xl bg-slate-900/80 border border-slate-800">
              <div className="text-[10px] text-slate-400">Current Order</div>
              <div className="text-sm font-bold text-cyan-400 font-mono">32 / 32 Points</div>
            </div>
          </div>
        </div>

        {/* Sequence Mode Selection */}
        <div className="space-y-3">
          <label className="text-xs font-bold text-slate-300 uppercase tracking-wider block">
            Choose Walkaround Execution Sequence
          </label>

          {/* Mode 1: AI Adaptive */}
          <div
            onClick={() => handleSelectMode('AI_ADAPTIVE')}
            className={`p-4 rounded-2xl border transition-all cursor-pointer space-y-2 ${
              pref.mode === 'AI_ADAPTIVE'
                ? 'bg-emerald-500/15 border-emerald-400 ring-2 ring-emerald-400/30'
                : 'bg-slate-900/70 border-slate-800 hover:border-slate-700'
            }`}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center font-bold">
                  <Sparkles className="w-4 h-4" />
                </div>
                <div>
                  <div className="text-sm font-bold text-white">AI Adaptive Learning (Recommended)</div>
                  <div className="text-[11px] text-emerald-400/90 font-medium">
                    Learns your natural inspection routine and auto-orders checks to match your habit
                  </div>
                </div>
              </div>
              {pref.mode === 'AI_ADAPTIVE' && <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />}
            </div>
            <p className="text-xs text-slate-400 pl-10.5">
              The AI tracks which points you check first. If you always check In-Cab air build-up before stepping out, the voice co-pilot follows your routine automatically.
            </p>
          </div>

          {/* Mode 2: Strict DVSA Order */}
          <div
            onClick={() => handleSelectMode('STRICT_STATUTORY')}
            className={`p-4 rounded-2xl border transition-all cursor-pointer space-y-2 ${
              pref.mode === 'STRICT_STATUTORY'
                ? 'bg-blue-500/15 border-blue-400 ring-2 ring-blue-400/30'
                : 'bg-slate-900/70 border-slate-800 hover:border-slate-700'
            }`}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-blue-500/20 text-blue-400 flex items-center justify-center font-bold">
                  <ListOrdered className="w-4 h-4" />
                </div>
                <div>
                  <div className="text-sm font-bold text-white">Strict Statutory Order (DVSA Manual)</div>
                  <div className="text-[11px] text-blue-400/90 font-medium">
                    Sequential Point 1 to 32 exactly as published by GOV.UK
                  </div>
                </div>
              </div>
              {pref.mode === 'STRICT_STATUTORY' && <CheckCircle2 className="w-5 h-5 text-blue-400 shrink-0" />}
            </div>
            <p className="text-xs text-slate-400 pl-10.5">
              Follows points 1 to 10 (In-Cab) → 11 to 20 (Tractor Exterior) → 21 to 25 (Coupling) → 26 to 29 (Trailer) → 30 to 32 (Rear) in strict numbered order.
            </p>
          </div>

          {/* Mode 3: Clockwise Yard Perimeter Walk */}
          <div
            onClick={() => handleSelectMode('CLOCKWISE_PERIMETER')}
            className={`p-4 rounded-2xl border transition-all cursor-pointer space-y-2 ${
              pref.mode === 'CLOCKWISE_PERIMETER'
                ? 'bg-amber-500/15 border-amber-400 ring-2 ring-amber-400/30'
                : 'bg-slate-900/70 border-slate-800 hover:border-slate-700'
            }`}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-amber-500/20 text-amber-400 flex items-center justify-center font-bold">
                  <Compass className="w-4 h-4" />
                </div>
                <div>
                  <div className="text-sm font-bold text-white">Clockwise Yard Perimeter Walk</div>
                  <div className="text-[11px] text-amber-400/90 font-medium">
                    Continuous physical walking loop around the vehicle combination
                  </div>
                </div>
              </div>
              {pref.mode === 'CLOCKWISE_PERIMETER' && <CheckCircle2 className="w-5 h-5 text-amber-400 shrink-0" />}
            </div>
            <p className="text-xs text-slate-400 pl-10.5">
              Optimized for physical step-efficiency: Cab Front → Offside Steer → Susie Catwalk &amp; Acoustic Leak → Offside Trailer → Rear Doors → Nearside → In-Cab finish.
            </p>
          </div>
        </div>

        {/* Sequence Preview Toggle */}
        <div className="space-y-3 pt-2">
          <div className="flex items-center justify-between">
            <button
              onClick={() => setShowFullSequencePreview(!showFullSequencePreview)}
              className="text-xs text-emerald-400 hover:text-emerald-300 font-bold flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              <span>{showFullSequencePreview ? 'Hide Active Sequence List' : 'Preview 32-Point Checkpoint Order'}</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>

            <button
              onClick={handleResetLearning}
              className="text-xs text-slate-400 hover:text-slate-200 flex items-center gap-1 transition-colors cursor-pointer"
            >
              <RotateCcw className="w-3 h-3" />
              <span>Recalibrate Habit</span>
            </button>
          </div>

          {showFullSequencePreview && (
            <div className="p-3 rounded-2xl bg-slate-900 border border-slate-800 space-y-2 max-h-56 overflow-y-auto">
              {pref.preferredSequence.map((itemNum, idx) => {
                const item = checkpointMap.get(itemNum);
                return (
                  <div
                    key={itemNum}
                    className="flex items-center justify-between p-2 rounded-xl bg-slate-950/80 border border-slate-800/80 text-xs"
                  >
                    <div className="flex items-center gap-2">
                      <span className="w-6 h-6 rounded-lg bg-slate-800 text-slate-300 font-mono text-[11px] flex items-center justify-center font-bold shrink-0">
                        {idx + 1}
                      </span>
                      <span className="text-white font-medium truncate max-w-[280px]">
                        {item?.title || `Checkpoint #${itemNum}`}
                      </span>
                    </div>
                    <span className="text-[10px] font-mono text-slate-400 bg-slate-900 px-2 py-0.5 rounded border border-slate-800 shrink-0">
                      DVSA #{itemNum}
                    </span>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Save / Close */}
        <button
          onClick={onClose}
          className="w-full py-3 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-bold text-sm cursor-pointer shadow-lg shadow-emerald-900/30 transition-all"
        >
          Confirm &amp; Apply Routine Preference
        </button>
      </div>
    </div>
  );
};
