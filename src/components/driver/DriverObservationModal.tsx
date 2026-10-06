'use client';
import React, { useState } from 'react';
import {
  X,
  Camera,
  CheckCircle2,
  AlertTriangle,
  UploadCloud,
  FileCheck2,
  ShieldAlert,
  Edit3
} from 'lucide-react';
import { SiteRiskAssessment, DriverVehicleProfile, VehicleCategory } from '../types';

interface DriverObservationModalProps {
  isOpen: boolean;
  onClose: () => void;
  site: SiteRiskAssessment;
  driverVehicle: DriverVehicleProfile;
  onSubmitObservation: (
    siteId: string,
    observation: any,
    modification?: any
  ) => void;
}

export const DriverObservationModal: React.FC<DriverObservationModalProps> = ({
  isOpen,
  onClose,
  site,
  driverVehicle,
  onSubmitObservation
}) => {
  const [groundConditions, setGroundConditions] = useState<
    'DRY' | 'WET' | 'ICY_SLIPPERY' | 'POTHOLES' | 'DEBRIS_OIL'
  >('DRY');
  const [congestionLevel, setCongestionLevel] = useState<'CLEAR' | 'BUSY' | 'GRIDLOCK_WAITING_OUTSIDE'>('CLEAR');
  const [gateCodeValid, setGateCodeValid] = useState(true);
  const [reportedGateCode, setReportedGateCode] = useState('');
  const [notes, setNotes] = useState('');
  const [photos, setPhotos] = useState<string[]>([]);
  const [isSuggestingModification, setIsSuggestingModification] = useState(false);
  const [modificationField, setModificationField] = useState('Gate Code / Buzzer');
  const [modificationValue, setModificationValue] = useState('');
  const [modificationReason, setModificationReason] = useState('');

  if (!isOpen) return null;

  const handleAddPhoto = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (ev) => {
        if (ev.target?.result) {
          setPhotos((prev) => [...prev, ev.target!.result as string]);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const observation = {
      id: `obs-${Date.now()}`,
      driverName: driverVehicle.driverName || 'Verified Fleet Driver',
      vehicleReg: driverVehicle.vehicleReg,
      vehicleCategory: driverVehicle.vehicleCategory,
      timestamp: new Date().toISOString(),
      groundConditions,
      congestionLevel,
      gateCodeStillValid: gateCodeValid,
      reportedGateCode: !gateCodeValid ? reportedGateCode : undefined,
      notes,
      photos,
      status: 'SUBMITTED'
    };

    let modification: any = null;
    if (isSuggestingModification && modificationValue.trim()) {
      modification = {
        id: `mod-${Date.now()}`,
        siteId: site.id,
        siteTitle: site.title,
        driverName: driverVehicle.driverName || 'Verified Fleet Driver',
        driverPhone: '+44 7911 000111',
        date: new Date().toISOString(),
        fieldTarget: modificationField,
        originalValue:
          modificationField === 'Gate Code / Buzzer'
            ? site.businessSection.gateSecurityCode
            : site.businessSection.vehicleConstraints.lowBridgeAlert || 'Standard clearance',
        proposedValue: modificationValue,
        reason: modificationReason || 'Driver real-time on-site verification',
        evidencePhoto: photos[0],
        status: 'PENDING'
      };
    }

    onSubmitObservation(site.id, observation, modification);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/85 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-lg rounded-2xl border border-slate-800 bg-slate-900 p-5 sm:p-6 shadow-2xl text-slate-100 max-h-[92vh] overflow-y-auto">
        <div className="flex items-center justify-between pb-3 border-b border-slate-800">
          <div className="flex items-center gap-2.5">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-amber-500/20 text-amber-400 border border-amber-500/30">
              <Edit3 className="h-5 w-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-slate-100">Driver Real-Time Observation</h2>
              <p className="text-xs text-slate-400">{site.title}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-800 hover:text-white"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 pt-4 text-xs">
          {/* Ground Conditions */}
          <div>
            <label className="block font-semibold text-slate-300 mb-1.5">
              Yard & Ramp Ground Condition
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              {[
                { id: 'DRY', label: 'Dry & Clear' },
                { id: 'WET', label: 'Wet Rain' },
                { id: 'ICY_SLIPPERY', label: 'Icy / Frost Ramp' },
                { id: 'POTHOLES', label: 'Potholes / Broken Surface' },
                { id: 'DEBRIS_OIL', label: 'Oil Spill / Debris' }
              ].map((g) => (
                <button
                  type="button"
                  key={g.id}
                  onClick={() => setGroundConditions(g.id as any)}
                  className={`rounded-lg border p-2 text-center transition-all ${
                    groundConditions === g.id
                      ? 'border-amber-500 bg-amber-500/10 font-bold text-amber-400 ring-1 ring-amber-500'
                      : 'border-slate-800 bg-slate-950 text-slate-400 hover:border-slate-700 hover:text-slate-200'
                  }`}
                >
                  {g.label}
                </button>
              ))}
            </div>
          </div>

          {/* Congestion Level */}
          <div>
            <label className="block font-semibold text-slate-300 mb-1.5">
              Current Yard Congestion
            </label>
            <div className="grid grid-cols-3 gap-2">
              {[
                { id: 'CLEAR', label: 'Fast / Clear Bays' },
                { id: 'BUSY', label: 'Moderate Queue' },
                { id: 'GRIDLOCK_WAITING_OUTSIDE', label: 'Queuing on Highway' }
              ].map((c) => (
                <button
                  type="button"
                  key={c.id}
                  onClick={() => setCongestionLevel(c.id as any)}
                  className={`rounded-lg border p-2 text-center transition-all ${
                    congestionLevel === c.id
                      ? 'border-amber-500 bg-amber-500/10 font-bold text-amber-400 ring-1 ring-amber-500'
                      : 'border-slate-800 bg-slate-950 text-slate-400 hover:border-slate-700 hover:text-slate-200'
                  }`}
                >
                  {c.label}
                </button>
              ))}
            </div>
          </div>

          {/* Gate Code Check */}
          <div className="rounded-xl border border-slate-800 bg-slate-950/70 p-3 space-y-2">
            <div className="flex items-center justify-between">
              <div>
                <span className="font-semibold text-slate-200">Security Gate Code Verification</span>
                <p className="text-[11px] text-slate-400">
                  Listed in assessment: <span className="font-mono text-amber-400">{site.businessSection.gateSecurityCode}</span>
                </p>
              </div>
              <label className="flex items-center gap-2 cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={gateCodeValid}
                  onChange={(e) => setGateCodeValid(e.target.checked)}
                  className="h-4 w-4 rounded border-slate-700 bg-slate-900 text-amber-500"
                />
                <span className="font-medium text-slate-300">Code Works</span>
              </label>
            </div>

            {!gateCodeValid && (
              <div className="pt-2 border-t border-slate-800">
                <label className="block text-slate-300 mb-1 font-semibold text-rose-400">
                  Report Correct / Rotated Gate Code:
                </label>
                <input
                  type="text"
                  required
                  value={reportedGateCode}
                  onChange={(e) => setReportedGateCode(e.target.value)}
                  placeholder="e.g. New code provided by security: 9412#"
                  className="w-full rounded-lg border border-rose-500/40 bg-slate-900 px-3 py-1.5 text-xs text-slate-100 focus:border-rose-400 focus:outline-none"
                />
              </div>
            )}
          </div>

          {/* Observations Notes */}
          <div>
            <label className="block font-semibold text-slate-300 mb-1">
              Driver Notes / Advice for Next Drivers
            </label>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              rows={2}
              required
              placeholder="e.g. Stay left when reversing into Bay 4 to clear bollards; friendly marshals on duty..."
              className="w-full rounded-lg border border-slate-800 bg-slate-950 p-2.5 text-xs text-slate-100 placeholder:text-slate-500 focus:border-amber-500 focus:outline-none"
            />
          </div>

          {/* Photo Attachments */}
          <div>
            <label className="block font-semibold text-slate-300 mb-1">
              Attach On-Site Photo
            </label>
            <div className="flex items-center gap-2 flex-wrap">
              {photos.map((p, idx) => (
                <div key={idx} className="relative h-14 w-14 rounded-lg overflow-hidden border border-slate-700">
                  <img src={p} alt="Observation" className="h-full w-full object-cover" />
                  <button
                    type="button"
                    onClick={() => setPhotos((prev) => prev.filter((_, i) => i !== idx))}
                    className="absolute top-0.5 right-0.5 rounded-full bg-slate-950/80 p-0.5 text-slate-300 hover:text-white"
                  >
                    <X className="h-3 w-3" />
                  </button>
                </div>
              ))}
              <label className="flex h-14 w-14 items-center justify-center rounded-lg border border-dashed border-slate-700 bg-slate-950/50 hover:border-amber-500 cursor-pointer transition-colors">
                <Camera className="h-5 w-5 text-slate-400" />
                <input type="file" accept="image/*" capture="environment" onChange={handleAddPhoto} className="hidden" />
              </label>
            </div>
          </div>

          {/* Propose Official Modification for Business Sign-off */}
          <div className="rounded-xl border border-amber-500/20 bg-amber-500/5 p-3 space-y-2">
            <label className="flex items-center gap-2 cursor-pointer select-none">
              <input
                type="checkbox"
                checked={isSuggestingModification}
                onChange={(e) => setIsSuggestingModification(e.target.checked)}
                className="h-4 w-4 rounded border-slate-700 bg-slate-900 text-amber-500"
              />
              <span className="font-bold text-amber-400">
                Submit as Formal Modification for Business Review & Sign-Off
              </span>
            </label>

            {isSuggestingModification && (
              <div className="space-y-2 pt-2 border-t border-amber-500/20">
                <div>
                  <label className="block text-slate-300 mb-1">Field to Update</label>
                  <select
                    value={modificationField}
                    onChange={(e) => setModificationField(e.target.value)}
                    className="w-full rounded-lg border border-slate-700 bg-slate-950 px-2.5 py-1.5 text-xs text-slate-100"
                  >
                    <option>Gate Access / Buzzer Code</option>
                    <option>Low Overhead Obstruction / Clearance</option>
                    <option>Loading Bay Procedure</option>
                    <option>Mandatory PPE Rule</option>
                    <option>Blind Spot Warning</option>
                  </select>
                </div>
                <div>
                  <label className="block text-slate-300 mb-1">Proposed Value</label>
                  <input
                    type="text"
                    value={modificationValue}
                    onChange={(e) => setModificationValue(e.target.value)}
                    placeholder="e.g. Scaffolding reduced clearance to 4.2m"
                    className="w-full rounded-lg border border-slate-700 bg-slate-950 px-2.5 py-1.5 text-xs text-slate-100"
                  />
                </div>
                <div>
                  <label className="block text-slate-300 mb-1">Safety Justification / Reason</label>
                  <input
                    type="text"
                    value={modificationReason}
                    onChange={(e) => setModificationReason(e.target.value)}
                    placeholder="Why this must be officially merged into site baseline..."
                    className="w-full rounded-lg border border-slate-700 bg-slate-950 px-2.5 py-1.5 text-xs text-slate-100"
                  />
                </div>
              </div>
            )}
          </div>

          <div className="flex items-center justify-end gap-2 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="rounded-lg border border-slate-800 bg-slate-800 px-4 py-2 text-slate-300 hover:bg-slate-700"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex items-center gap-1.5 rounded-lg bg-amber-500 hover:bg-amber-400 px-4 py-2 font-bold text-slate-950 shadow-md"
            >
              <CheckCircle2 className="h-4 w-4" />
              <span>Submit Real-Time Report</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
