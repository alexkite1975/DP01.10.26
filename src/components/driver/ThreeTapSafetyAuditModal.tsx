import React, { useState, useRef } from 'react';
import {
  X,
  ShieldAlert,
  CheckCircle2,
  AlertTriangle,
  Camera,
  Upload,
  MapPin,
  Sparkles,
  Layers,
  ChevronRight,
  Info
} from 'lucide-react';
import { SiteRiskAssessment, ThreeTapRating, ThreeTapSafetyAudit } from '../types';

interface ThreeTapSafetyAuditModalProps {
  isOpen: boolean;
  onClose: () => void;
  site: SiteRiskAssessment;
  driverName: string;
  vehicleReg: string;
  onSubmitAudit: (audit: ThreeTapSafetyAudit) => void;
}

export const ThreeTapSafetyAuditModal: React.FC<ThreeTapSafetyAuditModalProps> = ({
  isOpen,
  onClose,
  site,
  driverName,
  vehicleReg,
  onSubmitAudit
}) => {
  // 3-Tap state: default to GREEN or unset
  const [yardAccess, setYardAccess] = useState<ThreeTapRating>('GREEN');
  const [pedestrian, setPedestrian] = useState<ThreeTapRating>('GREEN');
  const [bayClearance, setBayClearance] = useState<ThreeTapRating>('GREEN');

  const [notes, setNotes] = useState('');
  const [obstructionPhotos, setObstructionPhotos] = useState<string[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  if (!isOpen) return null;

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      Array.from(files).forEach((file: any) => {
        const reader = new FileReader();
        reader.onload = () => {
          setObstructionPhotos((prev) => [...prev, reader.result as string]);
        };
        reader.readAsDataURL(file);
      });
    }
  };

  const calculateRiskContribution = () => {
    let score = 20;
    if (yardAccess === 'RED') score += 30;
    else if (yardAccess === 'AMBER') score += 15;

    if (pedestrian === 'RED') score += 35;
    else if (pedestrian === 'AMBER') score += 18;

    if (bayClearance === 'RED') score += 25;
    else if (bayClearance === 'AMBER') score += 12;

    return Math.min(100, score);
  };

  const handleSubmit = () => {
    setIsSubmitting(true);
    const newAudit: ThreeTapSafetyAudit = {
      id: `audit-${Date.now()}`,
      timestamp: new Date().toISOString(),
      driverName,
      vehicleReg,
      yardAccessRating: yardAccess,
      pedestrianSegregationRating: pedestrian,
      bayClearanceLightingRating: bayClearance,
      obstructionPhotos,
      additionalNotes: notes.trim() || undefined,
      calculatedRiskContribution: calculateRiskContribution()
    };

    setTimeout(() => {
      onSubmitAudit(newAudit);
      setIsSubmitting(false);
      onClose();
    }, 400);
  };

  const renderRatingButtons = (
    current: ThreeTapRating,
    onChange: (val: ThreeTapRating) => void
  ) => (
    <div className="grid grid-cols-3 gap-2">
      <button
        type="button"
        onClick={() => onChange('GREEN')}
        className={`py-2.5 px-3 rounded-xl font-bold text-xs flex items-center justify-center gap-1.5 border transition-all ${
          current === 'GREEN'
            ? 'bg-emerald-500 text-slate-950 border-emerald-400 shadow-md shadow-emerald-500/20 scale-[1.02]'
            : 'bg-slate-800 text-slate-300 border-slate-700 hover:bg-slate-750'
        }`}
      >
        <span className="h-2 w-2 rounded-full bg-emerald-400" />
        <span>Green (Safe)</span>
      </button>

      <button
        type="button"
        onClick={() => onChange('AMBER')}
        className={`py-2.5 px-3 rounded-xl font-bold text-xs flex items-center justify-center gap-1.5 border transition-all ${
          current === 'AMBER'
            ? 'bg-amber-400 text-slate-950 border-amber-300 shadow-md shadow-amber-400/20 scale-[1.02]'
            : 'bg-slate-800 text-slate-300 border-slate-700 hover:bg-slate-750'
        }`}
      >
        <span className="h-2 w-2 rounded-full bg-amber-400" />
        <span>Amber (Caution)</span>
      </button>

      <button
        type="button"
        onClick={() => onChange('RED')}
        className={`py-2.5 px-3 rounded-xl font-bold text-xs flex items-center justify-center gap-1.5 border transition-all ${
          current === 'RED'
            ? 'bg-rose-500 text-white border-rose-400 shadow-md shadow-rose-500/20 scale-[1.02]'
            : 'bg-slate-800 text-slate-300 border-slate-700 hover:bg-slate-750'
        }`}
      >
        <span className="h-2 w-2 rounded-full bg-rose-400" />
        <span>Red (Hazard)</span>
      </button>
    </div>
  );

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-3 sm:p-4 overflow-y-auto animate-in fade-in duration-200">
      <div className="relative w-full max-w-lg rounded-3xl bg-slate-900 border border-slate-800 text-white shadow-2xl overflow-hidden flex flex-col max-h-[92vh]">
        {/* Header */}
        <div className="px-5 py-4 border-b border-slate-800 flex items-center justify-between bg-slate-950">
          <div className="flex items-center gap-2.5">
            <div className="h-9 w-9 rounded-2xl bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-amber-400">
              <ShieldAlert className="h-5 w-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-black tracking-wider text-amber-400 uppercase">
                  150m Geofence Trigger
                </span>
                <span className="text-[10px] rounded-full bg-blue-500/20 text-blue-300 px-2 py-0.2 border border-blue-500/30">
                  Section 3.A Spec
                </span>
              </div>
              <h3 className="text-sm font-bold text-white">Rapid 3-Tap Site Safety Audit</h3>
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
          {/* Depot Summary Tag */}
          <div className="rounded-2xl bg-slate-950 border border-slate-800 p-3.5 flex items-center justify-between">
            <div>
              <div className="text-xs font-bold text-slate-200">{site.title}</div>
              <div className="text-[11px] text-slate-400 flex items-center gap-1 mt-0.5">
                <MapPin className="h-3 w-3 text-cyan-400" />
                <span className="truncate max-w-xs">{site.address}</span>
              </div>
            </div>
            <div className="text-right">
              <span className="text-[10px] text-slate-400">Driver</span>
              <div className="text-xs font-bold text-cyan-300">{driverName}</div>
            </div>
          </div>

          <p className="text-xs text-slate-300">
            You are within 150m of the delivery apron. Tap to score these three critical yard safety parameters:
          </p>

          {/* PARAMETER 1: Yard Access & Turning Space */}
          <div className="rounded-2xl bg-slate-950/80 border border-slate-800/80 p-3.5 space-y-2">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold text-slate-200">
                1. Yard Access & Turning Space
              </label>
              <span className="text-[10px] text-slate-400">Gates, apron radius, choke points</span>
            </div>
            {renderRatingButtons(yardAccess, setYardAccess)}
          </div>

          {/* PARAMETER 2: Pedestrian & Forklift Segregation */}
          <div className="rounded-2xl bg-slate-950/80 border border-slate-800/80 p-3.5 space-y-2">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold text-slate-200">
                2. Pedestrian & Forklift Segregation
              </label>
              <span className="text-[10px] text-slate-400">Marked walkways, barrier railings</span>
            </div>
            {renderRatingButtons(pedestrian, setPedestrian)}
          </div>

          {/* PARAMETER 3: Bay Clearance & Lighting Conditions */}
          <div className="rounded-2xl bg-slate-950/80 border border-slate-800/80 p-3.5 space-y-2">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold text-slate-200">
                3. Bay Clearance & Lighting Conditions
              </label>
              <span className="text-[10px] text-slate-400">Floodlights, canopy pipes, dock height</span>
            </div>
            {renderRatingButtons(bayClearance, setBayClearance)}
          </div>

          {/* Media Attachment for Obstruction Hazards */}
          <div className="rounded-2xl bg-slate-950/80 border border-slate-800/80 p-3.5 space-y-2">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold text-slate-200">
                Snap Geotagged Obstruction Hazard (Optional)
              </label>
              <span className="text-[10px] text-slate-400">Parked vans, loose pallets</span>
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="flex items-center gap-1.5 rounded-xl border border-slate-700 bg-slate-800 px-3 py-2 text-xs font-bold text-slate-200 hover:bg-slate-750 transition-colors"
              >
                <Camera className="h-4 w-4 text-cyan-400" />
                <span>Add Photo</span>
              </button>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                capture="environment"
                multiple
                className="hidden"
                onChange={handlePhotoUpload}
              />
              <span className="text-[11px] text-slate-400">
                {obstructionPhotos.length > 0
                  ? `${obstructionPhotos.length} photo(s) attached`
                  : 'No photo attached'}
              </span>
            </div>

            {obstructionPhotos.length > 0 && (
              <div className="flex gap-2 pt-1 overflow-x-auto">
                {obstructionPhotos.map((p, idx) => (
                  <div key={idx} className="relative h-14 w-14 rounded-lg overflow-hidden border border-slate-700 shrink-0">
                    <img src={p} alt="Hazard" className="h-full w-full object-cover" />
                    <button
                      type="button"
                      onClick={() => setObstructionPhotos((prev) => prev.filter((_, i) => i !== idx))}
                      className="absolute top-0 right-0 bg-black/70 text-white rounded-bl p-0.5 text-[10px]"
                    >
                      ×
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Driver Notes */}
          <div>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Optional notes for fellow drivers and depot transport manager..."
              rows={2}
              className="w-full rounded-xl bg-slate-950 border border-slate-800 p-2.5 text-xs text-slate-200 placeholder:text-slate-500 focus:outline-none focus:border-cyan-400 transition-colors"
            />
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-slate-800 bg-slate-950 flex items-center justify-between gap-3">
          <div className="text-[11px] text-slate-400">
            Calculated Risk Contribution:{' '}
            <strong className="text-amber-400">{calculateRiskContribution()}/100</strong>
          </div>
          <button
            type="button"
            onClick={handleSubmit}
            disabled={isSubmitting}
            className="py-2.5 px-5 rounded-xl bg-gradient-to-r from-amber-500 to-amber-400 hover:from-amber-400 hover:to-amber-300 text-slate-950 font-black text-xs shadow-lg shadow-amber-500/20 transition-all active:scale-95 disabled:opacity-50"
          >
            {isSubmitting ? 'Logging Audit...' : 'Submit 3-Tap Audit'}
          </button>
        </div>
      </div>
    </div>
  );
};
