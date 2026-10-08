'use client';

import React, { useState } from 'react';
import {
  ShieldAlert,
  ShieldCheck,
  AlertTriangle,
  ArrowDown,
  ArrowUp,
  Volume2,
  VolumeX,
  Sliders,
  Sparkles
} from 'lucide-react';
import { audioFeedback } from '@/utils/audioFeedback';

interface BridgeClearanceGantryHUDProps {
  initialVehicleHeightMeters?: number;
  bridgeName?: string;
  bridgeClearanceMeters?: number;
  networkRailId?: string;
}

export const BridgeClearanceGantryHUD: React.FC<BridgeClearanceGantryHUDProps> = ({
  initialVehicleHeightMeters = 4.65, // 15' 3" UK Artic Max
  bridgeName = 'A140 Low Railway Arch',
  bridgeClearanceMeters = 4.50, // 14' 9"
  networkRailId = 'NWR/EA-0892'
}) => {
  const [vehicleHeight, setVehicleHeight] = useState<number>(initialVehicleHeightMeters);
  const [bridgeHeight, setBridgeHeight] = useState<number>(bridgeClearanceMeters);
  const [isMuted, setIsMuted] = useState<boolean>(false);

  const deltaMeters = Number((bridgeHeight - vehicleHeight).toFixed(2));
  const isStrikeImminent = deltaMeters < 0;
  const isTightTolerance = deltaMeters >= 0 && deltaMeters < 0.15;
  const isSafeClearance = deltaMeters >= 0.15;

  const handleHeightChange = (newHeight: number) => {
    setVehicleHeight(newHeight);
    const newDelta = bridgeHeight - newHeight;
    if (newDelta < 0) {
      audioFeedback.playWarningTone();
    } else {
      audioFeedback.playCheckpointClick();
    }
  };

  const toggleMute = () => {
    const next = !isMuted;
    setIsMuted(next);
    audioFeedback.setMuted(next);
  };

  const formatFeetInches = (meters: number) => {
    const totalInches = Math.round(meters * 39.3701);
    const feet = Math.floor(totalInches / 12);
    const inches = totalInches % 12;
    return `${feet}' ${inches}"`;
  };

  return (
    <div className="cockpit-panel rounded-3xl p-4 sm:p-6 space-y-4 border border-white/10 shadow-cockpit-lg select-none">
      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-800 pb-3">
        <div className="flex items-center gap-2.5">
          <span
            className={`w-2.5 h-2.5 rounded-full ${
              isStrikeImminent
                ? 'bg-rose-500 animate-ping'
                : isTightTolerance
                ? 'bg-amber-400 animate-ping'
                : 'bg-emerald-400 animate-ping'
            }`}
          />
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-mono font-bold text-amber-400 tracking-wider">
                NETWORK RAIL RADAR CLEARANCE HUD
              </span>
              <span className="px-1.5 py-0.2 rounded text-[9px] font-mono bg-rose-500/20 text-rose-300 border border-rose-500/40">
                {networkRailId}
              </span>
            </div>
            <h3 className="text-sm font-bold text-white">{bridgeName}</h3>
          </div>
        </div>

        {/* Mute Button */}
        <button
          onClick={toggleMute}
          className="p-1.5 self-start sm:self-center rounded-lg bg-slate-900 border border-slate-800 text-slate-400 hover:text-white transition touch-press"
          title={isMuted ? 'Unmute' : 'Mute'}
        >
          {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4 text-amber-400" />}
        </button>
      </div>

      {/* Visual Overhead Gantry Graphic */}
      <div
        className={`relative w-full aspect-[21/9] sm:aspect-[24/9] rounded-2xl border-2 overflow-hidden flex flex-col justify-between p-4 transition-colors ${
          isStrikeImminent
            ? 'bg-gradient-to-b from-rose-950/80 via-slate-950 to-black border-rose-500/60 shadow-[0_0_30px_rgba(244,63,94,0.2)]'
            : isTightTolerance
            ? 'bg-gradient-to-b from-amber-950/60 via-slate-950 to-black border-amber-500/50'
            : 'bg-gradient-to-b from-slate-950 via-slate-900/90 to-black border-slate-800'
        }`}
      >
        <div className="absolute inset-0 bg-cockpit-grid opacity-60 pointer-events-none" />

        {/* Overhead Bridge Girder Beam with Chevrons */}
        <div className="relative z-10 flex items-center justify-between bg-yellow-500/10 border-b-2 border-yellow-500/40 p-2 rounded-lg">
          <div className="flex items-center gap-2">
            <span className="px-2 py-0.5 rounded bg-yellow-500 text-black text-xs font-black font-mono">
              MAX CLEARANCE: {bridgeHeight.toFixed(2)}m ({formatFeetInches(bridgeHeight)})
            </span>
          </div>

          <div className="text-[10px] font-mono text-yellow-300 font-bold hidden sm:block">
            BLACK &amp; YELLOW STATUTORY GANTRY WARNING
          </div>
        </div>

        {/* Clearance Delta Alert Box in Center */}
        <div className="relative z-10 flex flex-col items-center justify-center text-center space-y-1">
          {isStrikeImminent ? (
            <div className="animate-bounce flex flex-col items-center">
              <span className="px-3 py-1 rounded-full bg-rose-600 text-white font-mono font-black text-xs sm:text-sm flex items-center gap-1.5 shadow-lg shadow-rose-600/50">
                <ShieldAlert className="w-4 h-4" />
                STRIKE IMMINENT: {Math.abs(deltaMeters * 100).toFixed(0)}cm DEFICIT!
              </span>
              <p className="text-[11px] text-rose-300 font-mono mt-1 font-bold">
                STOP IMMEDIATELY • DO NOT ENTER UNDERPASS
              </p>
            </div>
          ) : isTightTolerance ? (
            <div className="flex flex-col items-center">
              <span className="px-3 py-1 rounded-full bg-amber-500 text-black font-mono font-black text-xs sm:text-sm flex items-center gap-1.5">
                <AlertTriangle className="w-4 h-4" />
                CRITICAL MARGIN: +{Math.round(deltaMeters * 100)}cm CLEARANCE
              </span>
              <p className="text-[11px] text-amber-300 font-mono mt-1 font-bold">
                Dump Air Suspension Before Ingress
              </p>
            </div>
          ) : (
            <div className="flex flex-col items-center">
              <span className="px-3 py-1 rounded-full bg-emerald-500 text-white font-mono font-black text-xs sm:text-sm flex items-center gap-1.5 shadow-lg shadow-emerald-500/30">
                <ShieldCheck className="w-4 h-4" />
                SAFE TO PROCEED: +{Math.round(deltaMeters * 100)}cm CLEARANCE
              </span>
              <p className="text-[11px] text-emerald-300 font-mono mt-1">
                Vehicle Envelope Fully Cleared
              </p>
            </div>
          )}
        </div>

        {/* Road Surface & Truck Height Line */}
        <div className="relative z-10 flex items-center justify-between text-xs font-mono text-slate-400 border-t border-slate-800 pt-2">
          <div className="flex items-center gap-2">
            <span className="text-white font-bold">TRUCK HEIGHT:</span>
            <span className="px-2 py-0.5 rounded bg-blue-500/20 text-blue-300 border border-blue-500/40 font-bold">
              {vehicleHeight.toFixed(2)}m ({formatFeetInches(vehicleHeight)})
            </span>
          </div>
          <div className="text-[10px] text-slate-500 hidden sm:block">
            Calibrated against Fifth-Wheel Kingpin
          </div>
        </div>
      </div>

      {/* Quick In-Cab Calibration Buttons */}
      <div className="space-y-2">
        <div className="flex items-center justify-between text-xs font-mono text-slate-400">
          <span className="flex items-center gap-1">
            <Sliders className="w-3.5 h-3.5 text-cyan-400" />
            <span>Simulate Tractor &amp; Trailer Height Profile</span>
          </span>
          <span className="text-cyan-400 font-bold">Tap to Calibrate</span>
        </div>

        <div className="grid grid-cols-4 gap-2">
          {[
            { label: 'Standard Box', meters: 4.0 },
            { label: 'Euro Trailer', meters: 4.2 },
            { label: 'UK Max High', meters: 4.65 },
            { label: 'Double Deck', meters: 4.95 }
          ].map((profile) => (
            <button
              key={profile.meters}
              onClick={() => handleHeightChange(profile.meters)}
              className={`py-2 px-1 rounded-xl text-xs font-mono font-bold flex flex-col items-center justify-center gap-0.5 transition touch-press ${
                vehicleHeight === profile.meters
                  ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/30 border border-blue-400'
                  : 'bg-slate-900 hover:bg-slate-800 text-slate-300 border border-slate-800'
              }`}
            >
              <span>{profile.meters.toFixed(2)}m</span>
              <span className="text-[9px] text-slate-400 font-normal truncate max-w-full">
                {profile.label}
              </span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default BridgeClearanceGantryHUD;
