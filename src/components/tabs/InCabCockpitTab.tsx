'use client';
import React, { useState, useEffect } from 'react';
import {
  Compass,
  AlertTriangle,
  ShieldCheck,
  Truck,
  Mic,
  Clock,
  Navigation,
  RotateCcw,
  CheckCircle2,
  MapPin,
  Volume2,
  XCircle,
  Eye,
  Video,
  Radio,
  Share2,
  Layers,
  ChevronRight
} from 'lucide-react';
import {
  SiteRiskAssessment,
  DriverVehicleProfile,
  BridgeHazardPoint
} from '../../types';

interface InCabCockpitTabProps {
  selectedSite: SiteRiskAssessment | null;
  driverVehicle: DriverVehicleProfile;
  onOpenVehicleModal: () => void;
  onOpenVoiceCopilot: () => void;
  onOpenApproachVideo: () => void;
  onOpenHazardCapture: () => void;
  onOpenInMotionHud: () => void;
  onSelectSite: (site: SiteRiskAssessment) => void;
  sites: SiteRiskAssessment[];
  onOpenRouteOptimizer?: () => void;
}

export const InCabCockpitTab: React.FC<InCabCockpitTabProps> = ({
  selectedSite,
  driverVehicle,
  onOpenVehicleModal,
  onOpenVoiceCopilot,
  onOpenApproachVideo,
  onOpenHazardCapture,
  onOpenInMotionHud,
  onSelectSite,
  sites,
  onOpenRouteOptimizer
}) => {
  // 1-Tap "Clear Route" with 5-second undo snackbar state
  const [routeCleared, setRouteCleared] = useState(false);
  const [undoCountdown, setUndoCountdown] = useState<number | null>(null);

  // Tacho 4.5hr driving countdown timer simulation
  const [drivingSeconds, setDrivingSeconds] = useState(3 * 3600 + 42 * 60); // 3h 42m elapsed
  const MAX_DRIVE_SECONDS = 4.5 * 3600; // 4h 30m limit
  const remainingSeconds = Math.max(0, MAX_DRIVE_SECONDS - drivingSeconds);
  const remainingHours = Math.floor(remainingSeconds / 3600);
  const remainingMins = Math.floor((remainingSeconds % 3600) / 60);

  // Low-Bridge Radar Calculation
  const vHeight = driverVehicle.heightMeters; // e.g. 4.40m
  const siteBridgeLimit = selectedSite?.businessSection?.vehicleConstraints?.maxHeightMeters || 4.50;
  const clearanceMarginCm = Math.round((siteBridgeLimit - vHeight) * 100);

  // 3-Tier Low-Bridge Radar logic:
  // Tier 1: Green (>30cm safe margin)
  // Tier 2: Amber (10cm to 30cm tight clearance)
  // Tier 3: Red (<10cm critical risk or breach)
  const isRedBreach = clearanceMarginCm < 10;
  const isAmberWarning = clearanceMarginCm >= 10 && clearanceMarginCm <= 30;

  // Handle Clear Route with Undo
  const handleTriggerClearRoute = () => {
    setRouteCleared(true);
    setUndoCountdown(5);
  };

  useEffect(() => {
    if (undoCountdown === null) return;
    if (undoCountdown === 0) {
      setUndoCountdown(null);
      return;
    }
    const timer = setTimeout(() => {
      setUndoCountdown((prev) => (prev !== null ? prev - 1 : null));
    }, 1000);
    return () => clearTimeout(timer);
  }, [undoCountdown]);

  const handleUndoClearRoute = () => {
    setRouteCleared(false);
    setUndoCountdown(null);
  };

  return (
    <div className="space-y-4 pb-24 text-slate-100">
      {/* 1. Vehicle & Trailer Status Chip Banner */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 shadow-lg flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400">
            <Truck className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-mono font-black text-sm text-amber-400 bg-slate-950 px-2 py-0.5 rounded border border-slate-800">
                {driverVehicle.vehicleReg}
              </span>
              <span className="text-xs text-slate-400 font-mono">
                {driverVehicle.currentTrailerNumber || 'TRL-409'}
              </span>
              <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-emerald-500/20 text-emerald-300">
                5TH WHEEL LOCKED
              </span>
            </div>
            <div className="text-xs text-slate-400 mt-1 flex items-center gap-2">
              <span>H: <strong className="text-slate-200">{driverVehicle.heightMeters}m</strong></span>
              <span>•</span>
              <span>W: <strong className="text-slate-200">{driverVehicle.weightTonnes}t</strong></span>
              <span>•</span>
              <span>44t Artic Articulated</span>
            </div>
          </div>
        </div>

        <button
          onClick={onOpenVehicleModal}
          className="text-xs font-semibold px-3 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 transition-colors"
        >
          Edit Combo
        </button>
      </div>

      {/* 2. Three-Tier Low-Bridge Radar Banner */}
      <div
        className={`p-4 rounded-2xl border transition-all ${
          isRedBreach
            ? 'bg-rose-950/80 border-rose-600 text-rose-100 shadow-[0_0_20px_rgba(225,29,72,0.4)] animate-pulse'
            : isAmberWarning
            ? 'bg-amber-950/80 border-amber-600 text-amber-100 shadow-[0_0_15px_rgba(217,119,6,0.3)]'
            : 'bg-emerald-950/60 border-emerald-600/50 text-emerald-100'
        }`}
      >
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            <div
              className={`w-10 h-10 rounded-xl flex items-center justify-center font-black ${
                isRedBreach
                  ? 'bg-rose-600 text-white'
                  : isAmberWarning
                  ? 'bg-amber-500 text-slate-950'
                  : 'bg-emerald-500 text-slate-950'
              }`}
            >
              <AlertTriangle className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-black tracking-wider uppercase font-mono">
                  {isRedBreach
                    ? 'CRITICAL LOW-BRIDGE BREACH'
                    : isAmberWarning
                    ? 'CAUTION: TIGHT CLEARANCE RADAR'
                    : 'SAFE CLEARANCE CORRIDOR'}
                </span>
                <span className="text-[10px] px-1.5 py-0.5 rounded bg-black/40 font-mono">
                  Margin: {clearanceMarginCm > 0 ? `+${clearanceMarginCm}cm` : `${clearanceMarginCm}cm`}
                </span>
              </div>
              <p className="text-xs opacity-90 mt-0.5">
                {isRedBreach
                  ? `Approach bridge is ${siteBridgeLimit}m. Your vehicle is ${vHeight}m. IMMINENT BRIDGE STRIKE RISK.`
                  : isAmberWarning
                  ? `Bridge limit is ${siteBridgeLimit}m. Clearance is only ${clearanceMarginCm}cm. Slow to 10mph.`
                  : `Route vetted for ${driverVehicle.heightMeters}m height & 44t gross weight. No low bridges on approach.`}
              </p>
            </div>
          </div>

          {isRedBreach && (
            <button className="px-3 py-1.5 bg-rose-600 hover:bg-rose-500 text-white text-xs font-bold rounded-lg shadow-md">
              Detour Now
            </button>
          )}
        </div>
      </div>

      {/* 3. Tacho-Safe Split Break Countdown Card */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 shadow-lg">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2">
            <Clock className="w-4 h-4 text-cyan-400" />
            <span className="text-xs font-bold text-slate-300 uppercase tracking-wider font-mono">
              EU Drivers Hours • Tacho Break Timer
            </span>
          </div>
          <span className="text-xs font-mono font-bold text-cyan-400">
            {remainingHours}h {remainingMins}m remaining
          </span>
        </div>

        {/* Progress bar */}
        <div className="w-full bg-slate-950 rounded-full h-3 border border-slate-800 overflow-hidden relative">
          <div
            className={`h-full transition-all ${
              remainingSeconds < 1800
                ? 'bg-rose-500'
                : remainingSeconds < 3600
                ? 'bg-amber-500'
                : 'bg-cyan-500'
            }`}
            style={{ width: `${Math.min(100, (drivingSeconds / MAX_DRIVE_SECONDS) * 100)}%` }}
          />
        </div>

        <div className="flex items-center justify-between text-[11px] text-slate-400 mt-2">
          <span>Current Driving: <strong>3h 42m</strong></span>
          <span className="text-cyan-300 font-semibold">Option: Take 15m + 30m Split Break</span>
          <span>Max Continuous: <strong>4h 30m</strong></span>
        </div>

        {onOpenRouteOptimizer && (
          <div className="mt-3 pt-3 border-t border-slate-800 flex items-center justify-between">
            <div className="text-[11px] text-slate-400">
              <span className="text-white font-semibold block">Multi-Drop Delivery Manifest</span>
              <span>Auto-optimises stops &amp; schedules tacho rest stops</span>
            </div>
            <button
              onClick={onOpenRouteOptimizer}
              className="px-3 py-1.5 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-slate-950 font-black text-xs rounded-xl flex items-center gap-1.5 shadow-md shadow-cyan-500/20 active:scale-95 transition-all cursor-pointer"
            >
              <Truck className="w-3.5 h-3.5" />
              <span>Open Route Optimiser</span>
            </button>
          </div>
        )}
      </div>

      {/* 4. Active Destination & Navigation Map Preview */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-xl">
        <div className="p-4 border-b border-slate-800 flex items-center justify-between bg-slate-950/40">
          <div>
            <span className="text-[10px] text-cyan-400 font-mono uppercase tracking-wider block">
              Active Destination / Depot
            </span>
            <h3 className="text-sm font-bold text-white">
              {selectedSite?.title || 'Sainsbury\'s Regional Distribution Centre (DIRFT)'}
            </h3>
            <div className="flex items-center gap-2 text-xs text-slate-400 mt-0.5">
              <MapPin className="w-3.5 h-3.5 text-rose-400" />
              <span>{selectedSite?.address || 'DIRFT Logistics Park, A428, Daventry'}</span>
            </div>
          </div>

          <div className="text-right">
            <span className="text-base font-black text-cyan-400 font-mono">14.2 mi</span>
            <span className="text-xs text-slate-500 block">ETA: 22:15</span>
          </div>
        </div>

        {/* Map / Route Visualizer */}
        <div className="relative h-48 bg-slate-950 flex items-center justify-center overflow-hidden">
          {/* Mock Map Background Grid */}
          <div className="absolute inset-0 opacity-20 bg-[linear-gradient(to_right,#1e293b_1px,transparent_1px),linear-gradient(to_bottom,#1e293b_1px,transparent_1px)] bg-[size:24px_24px]" />

          {/* Turn by turn live overlay banner */}
          <div className="absolute top-3 left-3 right-3 bg-slate-900/90 backdrop-blur-md p-3 rounded-xl border border-slate-800 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-lg bg-cyan-500 text-slate-950 flex items-center justify-center font-bold">
                <Navigation className="w-5 h-5 rotate-45" />
              </div>
              <div>
                <span className="text-xs font-bold text-white block">In 800 yards, bear left for Gatehouse</span>
                <span className="text-[11px] text-slate-400">Avoid private car entrance • Stay in HGV lane</span>
              </div>
            </div>
            <span className="text-xs font-mono font-bold text-emerald-400 bg-emerald-950/80 px-2 py-1 rounded border border-emerald-800">
              800 yd
            </span>
          </div>

          {/* What3Words & Gatehouse Intercom Pin */}
          <div className="absolute bottom-3 left-3 bg-slate-900/90 backdrop-blur-md px-3 py-1.5 rounded-lg border border-slate-800 flex items-center gap-2">
            <span className="text-rose-400 font-black text-xs font-mono">///</span>
            <span className="text-xs font-mono text-slate-200">safe.truck.entry</span>
            <span className="text-[10px] text-slate-500">Gate Channel: CH 01</span>
          </div>

          {/* Quick Navigation & HUD Triggers */}
          <div className="absolute bottom-3 right-3 flex items-center gap-2">
            {onOpenRouteOptimizer && (
              <button
                onClick={onOpenRouteOptimizer}
                className="bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs px-3 py-1.5 rounded-lg flex items-center gap-1.5 shadow-lg shadow-blue-600/30 transition-all"
              >
                <Navigation className="w-3.5 h-3.5" />
                Route Optimiser
              </button>
            )}
            <button
              onClick={onOpenInMotionHud}
              className="bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-black text-xs px-3 py-1.5 rounded-lg flex items-center gap-1.5 shadow-lg shadow-cyan-500/20"
            >
              <Compass className="w-3.5 h-3.5" />
              Open In-Cab HUD
            </button>
          </div>
        </div>

        {/* Action Bar: 1-Tap Clear Route, Approach Video, Voice Copilot */}
        <div className="p-3 bg-slate-950/60 border-t border-slate-800 grid grid-cols-3 gap-2">
          <button
            onClick={onOpenApproachVideo}
            className="py-2.5 px-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors"
          >
            <Video className="w-4 h-4 text-emerald-400" />
            Approach Guide
          </button>

          <button
            onClick={onOpenVoiceCopilot}
            className="py-2.5 px-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors"
          >
            <Mic className="w-4 h-4 text-purple-400" />
            Voice Copilot
          </button>

          <button
            onClick={handleTriggerClearRoute}
            disabled={routeCleared && undoCountdown === null}
            className={`py-2.5 px-3 rounded-xl text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors ${
              routeCleared
                ? 'bg-slate-800 text-slate-500 cursor-not-allowed'
                : 'bg-rose-500/20 hover:bg-rose-500/30 text-rose-300 border border-rose-500/40'
            }`}
          >
            <XCircle className="w-4 h-4" />
            Clear Route
          </button>
        </div>
      </div>

      {/* 5. 5-Second Undo Snackbar for Clear Route */}
      {undoCountdown !== null && (
        <div className="fixed bottom-24 left-4 right-4 z-50 max-w-md mx-auto bg-slate-950 text-white p-4 rounded-2xl border border-rose-500/50 shadow-2xl flex items-center justify-between animate-bounce">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-rose-500/20 text-rose-400 flex items-center justify-center font-bold text-xs">
              {undoCountdown}s
            </div>
            <div>
              <span className="text-xs font-bold block">Route cleared</span>
              <span className="text-[11px] text-slate-400">Auto-clears on e-POD completion</span>
            </div>
          </div>
          <button
            onClick={handleUndoClearRoute}
            className="px-3 py-1.5 bg-rose-600 hover:bg-rose-500 text-white text-xs font-bold rounded-lg flex items-center gap-1 transition-colors"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            UNDO
          </button>
        </div>
      )}

      {/* 6. Quick Yard Hazard Snap Trigger */}
      <div className="bg-gradient-to-r from-slate-900 to-slate-950 p-4 rounded-2xl border border-slate-800 flex items-center justify-between">
        <div>
          <span className="text-xs font-bold text-white block">See a hazard in the yard?</span>
          <span className="text-[11px] text-slate-400">1-Tap voice & photo report alerts fellow drivers</span>
        </div>
        <button
          onClick={onOpenHazardCapture}
          className="px-4 py-2.5 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs rounded-xl flex items-center gap-1.5 shadow-md shadow-amber-500/20"
        >
          <AlertTriangle className="w-4 h-4" />
          Report Hazard
        </button>
      </div>
    </div>
  );
};
