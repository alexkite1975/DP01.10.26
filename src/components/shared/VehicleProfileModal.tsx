'use client';
import React, { useState } from 'react';
import {
  X,
  Layers,
  Truck,
  AlertTriangle,
  CheckCircle2,
  ShieldCheck,
  Scale,
  Ruler,
  ArrowDownUp,
  Navigation,
  Clock,
  Compass,
  Info
} from 'lucide-react';
import { DriverVehicleProfile, VehicleCategory, PreferredNavApp } from '../types';
import { NAV_APP_OPTIONS } from '../services/navigationService';

interface VehicleProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  profile: DriverVehicleProfile;
  onSave: (updated: DriverVehicleProfile) => void;
  onOpenTrailerFleet?: () => void;
}

const VEHICLE_DEFAULTS: Record<
  VehicleCategory,
  {
    label: string;
    defaultHeight: number;
    defaultWeight: number;
    defaultLength: number;
    defaultWidth: number;
    hasTailLift: boolean;
  }
> = {
  CAR_VAN: {
    label: 'Small Delivery Van (e.g. Transit/Sprinter)',
    defaultHeight: 2.4,
    defaultWeight: 3.5,
    defaultLength: 5.9,
    defaultWidth: 2.05,
    hasTailLift: false
  },
  '3_5T_LUTON': {
    label: '3.5T Luton Box Van with Tail-Lift',
    defaultHeight: 3.2,
    defaultWeight: 3.5,
    defaultLength: 6.8,
    defaultWidth: 2.2,
    hasTailLift: true
  },
  '7_5T_RIGID': {
    label: '7.5 Tonne Urban Rigid Box',
    defaultHeight: 3.5,
    defaultWeight: 7.5,
    defaultLength: 8.2,
    defaultWidth: 2.4,
    hasTailLift: true
  },
  '18T_RIGID': {
    label: '18 Tonne Multi-Drop Rigid HGV',
    defaultHeight: 3.9,
    defaultWeight: 18.0,
    defaultLength: 10.5,
    defaultWidth: 2.55,
    hasTailLift: true
  },
  '26T_CURTAINSIDER': {
    label: '26 Tonne 3-Axle Curtainsider',
    defaultHeight: 4.2,
    defaultWeight: 26.0,
    defaultLength: 11.8,
    defaultWidth: 2.55,
    hasTailLift: true
  },
  '44T_ARTIC_HGV': {
    label: '44 Tonne Articulated Tractor & Trailer',
    defaultHeight: 4.45,
    defaultWeight: 44.0,
    defaultLength: 16.5,
    defaultWidth: 2.55,
    hasTailLift: false
  }
};

export const VehicleProfileModal: React.FC<VehicleProfileModalProps> = ({
  isOpen,
  onClose,
  profile,
  onSave,
  onOpenTrailerFleet
}) => {
  const [formData, setFormData] = useState<DriverVehicleProfile>({
    ...profile,
    widthMeters: profile.widthMeters ?? 2.55,
    preferredNavApp: profile.preferredNavApp || 'GOOGLE_MAPS',
    avoidLowBridges: profile.avoidLowBridges ?? true,
    avoidWeightRestrictions: profile.avoidWeightRestrictions ?? true,
    avoidNarrowLanes: profile.avoidNarrowLanes ?? true,
    avoidTimeCurfews: profile.avoidTimeCurfews ?? true
  });

  if (!isOpen) return null;

  const handleCategorySelect = (cat: VehicleCategory) => {
    const defaults = VEHICLE_DEFAULTS[cat];
    setFormData((prev) => ({
      ...prev,
      vehicleCategory: cat,
      heightMeters: defaults.defaultHeight,
      weightTonnes: defaults.defaultWeight,
      lengthMeters: defaults.defaultLength,
      widthMeters: defaults.defaultWidth,
      hasTailLift: defaults.hasTailLift
    }));
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
    onClose();
  };

  const activeNavApp = NAV_APP_OPTIONS[formData.preferredNavApp || 'GOOGLE_MAPS'];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/80 backdrop-blur-sm animate-in fade-in duration-150">
      <div className="relative w-full max-w-xl rounded-2xl border border-slate-800 bg-slate-900 p-5 sm:p-6 shadow-2xl text-slate-100 max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-800">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-500/20 text-amber-400 border border-amber-500/30">
              <Truck className="h-5 w-5" />
            </div>
            <div>
              <h2 className="text-base sm:text-lg font-bold text-slate-100">Driver & Vehicle Profile</h2>
              <p className="text-xs text-slate-400">Configure vehicle dimensions, clearance limits & navigation app</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-800 hover:text-white transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <form onSubmit={handleSave} className="space-y-4 pt-4">
          {/* Driver Name & Plate */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Driver Name</label>
              <input
                type="text"
                required
                value={formData.driverName}
                onChange={(e) => setFormData({ ...formData, driverName: e.target.value })}
                className="w-full rounded-lg border border-slate-700 bg-slate-950 px-3 py-2 text-sm text-slate-100 focus:border-amber-500 focus:outline-none"
                placeholder="e.g. Alex Morgan"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Registration Plate</label>
              <input
                type="text"
                required
                value={formData.vehicleReg}
                onChange={(e) => setFormData({ ...formData, vehicleReg: e.target.value.toUpperCase() })}
                className="w-full rounded-lg border border-slate-700 bg-slate-950 px-3 py-2 text-sm font-mono uppercase text-amber-400 focus:border-amber-500 focus:outline-none"
                placeholder="e.g. KX72 WYZ"
              />
            </div>
          </div>

          {/* Vehicle Category Picker */}
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-2">Vehicle Type</label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {(Object.keys(VEHICLE_DEFAULTS) as VehicleCategory[]).map((cat) => {
                const isSelected = formData.vehicleCategory === cat;
                return (
                  <button
                    type="button"
                    key={cat}
                    onClick={() => handleCategorySelect(cat)}
                    className={`flex items-start gap-2 p-2.5 rounded-xl border text-left text-xs transition-all ${
                      isSelected
                        ? 'border-amber-500 bg-amber-500/10 text-slate-100 ring-1 ring-amber-500'
                        : 'border-slate-800 bg-slate-950/60 text-slate-400 hover:border-slate-700 hover:text-slate-200'
                    }`}
                  >
                    <Truck className={`h-4 w-4 mt-0.5 shrink-0 ${isSelected ? 'text-amber-400' : 'text-slate-500'}`} />
                    <div>
                      <div className="font-semibold text-slate-200">{VEHICLE_DEFAULTS[cat].label}</div>
                      <div className="text-[10px] text-slate-400 mt-0.5">
                        H: {VEHICLE_DEFAULTS[cat].defaultHeight}m • Gross: {VEHICLE_DEFAULTS[cat].defaultWeight}t • W: {VEHICLE_DEFAULTS[cat].defaultWidth}m
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Preferred Route Planning App */}
          <div className="rounded-xl border border-slate-800 bg-slate-950/80 p-3.5 space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Compass className="h-4 w-4 text-amber-400" />
                <h3 className="text-xs font-bold text-slate-100">Preferred Route Planning App</h3>
              </div>
              <span className="text-[10px] font-semibold text-blue-400 bg-blue-950/80 px-2 py-0.5 rounded-full border border-blue-800">
                Default: Google Maps
              </span>
            </div>

            <p className="text-[11px] text-slate-400 leading-relaxed">
              Choose which navigation app will be launched when you tap <strong>Start Navigation</strong> on site cards or depot briefings:
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {(Object.keys(NAV_APP_OPTIONS) as PreferredNavApp[]).map((appKey) => {
                const opt = NAV_APP_OPTIONS[appKey];
                const isSelected = (formData.preferredNavApp || 'GOOGLE_MAPS') === appKey;
                const isDefault = appKey === 'GOOGLE_MAPS';

                return (
                  <button
                    type="button"
                    key={appKey}
                    onClick={() => setFormData({ ...formData, preferredNavApp: appKey })}
                    className={`flex flex-col p-2.5 rounded-xl border text-left transition-all ${
                      isSelected
                        ? 'border-amber-500 bg-amber-500/10 ring-1 ring-amber-500 text-slate-100'
                        : 'border-slate-800 bg-slate-900/60 text-slate-400 hover:border-slate-700 hover:text-slate-200'
                    }`}
                  >
                    <div className="flex items-center justify-between w-full">
                      <span className="font-bold text-xs text-slate-200 flex items-center gap-1.5">
                        <Navigation className={`h-3.5 w-3.5 ${isSelected ? 'text-amber-400' : 'text-slate-500'}`} />
                        {opt.name}
                      </span>
                      {isDefault && (
                        <span className="text-[9px] font-bold uppercase tracking-wider bg-blue-500/20 text-blue-300 px-1.5 py-0.5 rounded border border-blue-500/30">
                          Default
                        </span>
                      )}
                      {opt.isTruckSpecific && (
                        <span className="text-[9px] font-bold uppercase tracking-wider bg-emerald-500/20 text-emerald-300 px-1.5 py-0.5 rounded border border-emerald-500/30">
                          HGV Aware
                        </span>
                      )}
                    </div>
                    <p className="text-[10px] text-slate-400 mt-1 line-clamp-2 leading-tight">
                      {opt.tagline}
                    </p>
                  </button>
                );
              })}
            </div>

            {/* Contextual routing advisory banner */}
            <div className={`p-2.5 rounded-xl border text-[11px] flex items-start gap-2 ${
              activeNavApp.isTruckSpecific
                ? 'bg-emerald-950/30 border-emerald-800/60 text-emerald-300'
                : 'bg-blue-950/30 border-blue-800/60 text-blue-300'
            }`}>
              <Info className="h-4 w-4 shrink-0 mt-0.5" />
              <div>
                {activeNavApp.id === 'GOOGLE_MAPS' ? (
                  <span>
                    <strong>Google Maps (Default):</strong> Standard Google Maps provides fast turn-by-turn routing to the gatehouse. Our app displays real-time clearance advisories and approach warnings. For automatic vehicle-profile detour routing (low bridges & weight bans), you can select TomTom or HERE Truck above.
                  </span>
                ) : activeNavApp.isTruckSpecific ? (
                  <span>
                    <strong>{activeNavApp.name}:</strong> Specialized commercial vehicle engine active. Turn-by-turn navigation will automatically account for your vehicle height ({formData.heightMeters}m), gross weight ({formData.weightTonnes}t), and width ({formData.widthMeters || 2.55}m).
                  </span>
                ) : (
                  <span>
                    <strong>{activeNavApp.name}:</strong> Consumer navigation mode selected. Keep visual verification of low bridges and weight zones along your route.
                  </span>
                )}
              </div>
            </div>
          </div>

          
          {/* Company Trailer Quick Hitch Banner */}
          <div className="rounded-xl border border-emerald-500/30 bg-emerald-950/20 p-3 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs">
            <div className="flex items-center gap-2">
              <Layers className="h-5 w-5 text-emerald-400 shrink-0" />
              <div>
                <span className="font-bold text-white">Attaching a Haulage Company's Trailer?</span>
                <p className="text-[11px] text-slate-400">Match trailer numbers to Eddie Stobart, DHL, Maritime, Wincanton to auto-fill heights.</p>
              </div>
            </div>
            {onOpenTrailerFleet && (
              <button
                type="button"
                onClick={() => {
                  onClose();
                  onOpenTrailerFleet();
                }}
                className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-slate-950 font-bold rounded-lg text-xs shrink-0 self-start sm:self-auto transition-all active:scale-95"
              >
                Trailer Memory
              </button>
            )}
          </div>

          {/* Physical Dimensions: Height, Weight, Width, Length */}
          <div className="rounded-xl border border-slate-800 bg-slate-950/70 p-3.5 space-y-3">
            <h3 className="text-xs font-semibold text-amber-400 flex items-center gap-1.5">
              <ShieldCheck className="h-4 w-4" />
              Physical Vehicle Dimensions & Road Clearances
            </h3>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
              <div>
                <label className="block text-[11px] text-slate-400 mb-1 flex items-center gap-1">
                  <Ruler className="h-3 w-3 text-amber-400" /> Height (m)
                </label>
                <input
                  type="number"
                  step="0.05"
                  min="1.5"
                  max="5.0"
                  value={formData.heightMeters}
                  onChange={(e) => setFormData({ ...formData, heightMeters: parseFloat(e.target.value) || 0 })}
                  className="w-full rounded-lg border border-slate-700 bg-slate-900 px-2.5 py-1.5 text-sm font-semibold text-slate-100 focus:border-amber-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-[11px] text-slate-400 mb-1 flex items-center gap-1">
                  <Scale className="h-3 w-3 text-amber-400" /> Weight (t)
                </label>
                <input
                  type="number"
                  step="0.5"
                  min="1.0"
                  max="50.0"
                  value={formData.weightTonnes}
                  onChange={(e) => setFormData({ ...formData, weightTonnes: parseFloat(e.target.value) || 0 })}
                  className="w-full rounded-lg border border-slate-700 bg-slate-900 px-2.5 py-1.5 text-sm font-semibold text-slate-100 focus:border-amber-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-[11px] text-slate-400 mb-1 flex items-center gap-1">
                  <ArrowDownUp className="h-3 w-3 text-amber-400 rotate-90" /> Width (m)
                </label>
                <input
                  type="number"
                  step="0.05"
                  min="1.5"
                  max="3.5"
                  value={formData.widthMeters ?? 2.55}
                  onChange={(e) => setFormData({ ...formData, widthMeters: parseFloat(e.target.value) || 0 })}
                  className="w-full rounded-lg border border-slate-700 bg-slate-900 px-2.5 py-1.5 text-sm font-semibold text-slate-100 focus:border-amber-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-[11px] text-slate-400 mb-1 flex items-center gap-1">
                  <ArrowDownUp className="h-3 w-3 text-amber-400" /> Length (m)
                </label>
                <input
                  type="number"
                  step="0.1"
                  min="3.0"
                  max="20.0"
                  value={formData.lengthMeters}
                  onChange={(e) => setFormData({ ...formData, lengthMeters: parseFloat(e.target.value) || 0 })}
                  className="w-full rounded-lg border border-slate-700 bg-slate-900 px-2.5 py-1.5 text-sm font-semibold text-slate-100 focus:border-amber-500 focus:outline-none"
                />
              </div>
            </div>

            {/* Restriction Avoidance Checkboxes */}
            <div className="pt-2 border-t border-slate-800/80 space-y-2 text-xs">
              <label className="flex items-center gap-2 cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={formData.avoidLowBridges ?? true}
                  onChange={(e) => setFormData({ ...formData, avoidLowBridges: e.target.checked })}
                  className="h-3.5 w-3.5 rounded border-slate-700 bg-slate-900 text-amber-500 focus:ring-0"
                />
                <span className="text-slate-300">
                  Avoid & Alert on Low Bridges under <strong>{formData.heightMeters}m</strong> (+ 0.15m safety margin)
                </span>
              </label>

              <label className="flex items-center gap-2 cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={formData.avoidWeightRestrictions ?? true}
                  onChange={(e) => setFormData({ ...formData, avoidWeightRestrictions: e.target.checked })}
                  className="h-3.5 w-3.5 rounded border-slate-700 bg-slate-900 text-amber-500 focus:ring-0"
                />
                <span className="text-slate-300">
                  Avoid Weak Bridges & Weight Limits under <strong>{formData.weightTonnes} Tonnes</strong>
                </span>
              </label>

              <label className="flex items-center gap-2 cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={formData.avoidTimeCurfews ?? true}
                  onChange={(e) => setFormData({ ...formData, avoidTimeCurfews: e.target.checked })}
                  className="h-3.5 w-3.5 rounded border-slate-700 bg-slate-900 text-amber-500 focus:ring-0"
                />
                <span className="text-slate-300 flex items-center gap-1">
                  <Clock className="h-3 w-3 text-amber-400" />
                  Check Municipal Lorry Control Schemes & Night Delivery Curfews
                </span>
              </label>

              <label className="flex items-center gap-2 cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={formData.hasTailLift}
                  onChange={(e) => setFormData({ ...formData, hasTailLift: e.target.checked })}
                  className="h-3.5 w-3.5 rounded border-slate-700 bg-slate-900 text-amber-500 focus:ring-0"
                />
                <span className="text-slate-300">
                  Hydraulic Tail-Lift Fitted (Required for ground-level drop-offs)
                </span>
              </label>
            </div>
          </div>

          {/* Action buttons */}
          <div className="flex items-center justify-end gap-2 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="rounded-lg border border-slate-800 bg-slate-800 px-4 py-2 text-xs font-semibold text-slate-300 hover:bg-slate-700 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex items-center gap-1.5 rounded-lg bg-amber-500 hover:bg-amber-400 px-4 py-2 text-xs font-bold text-slate-950 shadow-md transition-colors"
            >
              <CheckCircle2 className="h-4 w-4" />
              Save Profile & Preferences
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
export default VehicleProfileModal;
