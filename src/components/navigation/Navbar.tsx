'use client';
import React from 'react';
import {
  ShieldAlert,
  Truck,
  Building2,
  Volume2,
  VolumeX,
  Wifi,
  Sparkles,
  SlidersHorizontal
} from 'lucide-react';
import { UserRole, DriverVehicleProfile } from '../types';
import { tts } from '../services/ttsService';

interface NavbarProps {
  currentRole: UserRole;
  onRoleChange: (role: UserRole) => void;
  driverVehicle: DriverVehicleProfile;
  onOpenVehicleModal: () => void;
  activeSiteCount: number;
  pendingReviewCount: number;
  onOpenQuickHazard: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentRole,
  onRoleChange,
  driverVehicle,
  onOpenVehicleModal,
  pendingReviewCount,
  onOpenQuickHazard
}) => {
  const [isSpeaking, setIsSpeaking] = React.useState(false);

  React.useEffect(() => {
    return tts.subscribe((speaking) => {
      setIsSpeaking(speaking);
    });
  }, []);

  const handleStopAudio = () => {
    tts.stop();
  };

  return (
    <header className="sticky top-0 z-40 w-full border-b border-slate-800 bg-slate-950/95 backdrop-blur-md px-3 sm:px-6 py-2.5">
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-2">
        {/* Brand Logo & Name */}
        <div className="flex items-center gap-2.5">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-amber-500 font-bold text-slate-950 shadow-lg shadow-amber-500/20">
            <ShieldAlert className="h-5 w-5" />
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="font-extrabold tracking-tight text-slate-100 text-base sm:text-lg">
                SiteRisk<span className="text-amber-400">Pro</span>
              </span>
              <span className="hidden sm:inline-block rounded-md bg-amber-500/10 px-1.5 py-0.5 text-[10px] font-semibold text-amber-400 border border-amber-500/20">
                HSE & ISO 45001
              </span>
            </div>
            <p className="text-[10px] text-slate-400 hidden xs:block">
              Delivery Hazard & Site Assessment Network
            </p>
          </div>
        </div>

        {/* Action Center */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Active Audio Narration Indicator */}
          {isSpeaking && (
            <button
              onClick={handleStopAudio}
              className="flex items-center gap-1.5 rounded-full bg-emerald-500/20 px-2.5 py-1 text-xs font-medium text-emerald-400 border border-emerald-500/30 animate-pulse hover:bg-emerald-500/30 transition-all"
              title="Click to stop audio narration"
            >
              <Volume2 className="h-3.5 w-3.5 animate-spin text-emerald-400" />
              <span className="hidden md:inline">Audio Narration Active</span>
              <VolumeX className="h-3 w-3 ml-0.5 text-emerald-300" />
            </button>
          )}

          {/* 10-Second Quick Hazard Snap Button */}
          <button
            onClick={onOpenQuickHazard}
            className="flex items-center gap-1.5 rounded-lg bg-rose-600 hover:bg-rose-500 active:scale-95 px-2.5 sm:px-3 py-1.5 text-xs font-semibold text-white shadow-md shadow-rose-600/25 transition-all"
            title="Rapid 10-Second Hazard & Near-Miss Voice/Photo Capture"
          >
            <Sparkles className="h-3.5 w-3.5 animate-pulse" />
            <span className="whitespace-nowrap">Hazard Snap</span>
          </button>

          {/* Vehicle Profile Pill (in Driver Mode) */}
          {currentRole === 'DRIVER' && (
            <button
              onClick={onOpenVehicleModal}
              className="flex items-center gap-1.5 rounded-lg border border-slate-800 bg-slate-900 hover:bg-slate-850 px-2.5 py-1.5 text-xs font-medium text-slate-300 hover:text-white transition-colors"
              title="Configure your vehicle dimensions & restrictions"
            >
              <Truck className="h-3.5 w-3.5 text-amber-400" />
              <span className="hidden sm:inline font-mono">{driverVehicle.vehicleReg}</span>
              <span className="text-[11px] text-slate-400">({driverVehicle.heightMeters}m)</span>
              <SlidersHorizontal className="h-3 w-3 text-slate-400 ml-0.5" />
            </button>
          )}

          {/* Perspective Switcher: Driver App vs Business / Manager */}
          <div className="flex rounded-lg border border-slate-800 bg-slate-900 p-0.5">
            <button
              onClick={() => onRoleChange('DRIVER')}
              className={`flex items-center gap-1 rounded-md px-2.5 py-1 text-xs font-medium transition-all ${
                currentRole === 'DRIVER'
                  ? 'bg-amber-500 text-slate-950 font-bold shadow'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <Truck className="h-3.5 w-3.5" />
              <span>Driver</span>
            </button>
            <button
              onClick={() => onRoleChange('BUSINESS_ADMIN')}
              className={`relative flex items-center gap-1 rounded-md px-2.5 py-1 text-xs font-medium transition-all ${
                currentRole !== 'DRIVER'
                  ? 'bg-amber-500 text-slate-950 font-bold shadow'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <Building2 className="h-3.5 w-3.5" />
              <span>Business</span>
              {pendingReviewCount > 0 && (
                <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-rose-600 text-[9px] font-bold text-white shadow">
                  {pendingReviewCount}
                </span>
              )}
            </button>
          </div>

          {/* Offline/Cached Sync Status indicator */}
          <div
            className="hidden lg:flex items-center gap-1 text-[11px] text-emerald-400/80 bg-emerald-500/10 px-2 py-1 rounded border border-emerald-500/20"
            title="Offline PWA Storage Active: 3 Sites Cached Locally"
          >
            <Wifi className="h-3 w-3 text-emerald-400" />
            <span>Cached Offline</span>
          </div>
        </div>
      </div>
    </header>
  );
};
