'use client';
import React, { useState, useEffect } from 'react';
import {
  Truck,
  Clock,
  Briefcase,
  CreditCard,
  Camera,
  CheckCircle2,
  AlertTriangle,
  ArrowRight,
  ArrowLeft,
  MapPin,
  Navigation,
  Sparkles,
  RotateCcw,
  ShieldCheck,
  Smartphone,
  Layers,
  ChevronRight,
  Radio,
  FileText,
  User,
  ExternalLink,
  Volume2,
  Home
} from 'lucide-react';
import {
  driverStateService,
  DriverFlowStep,
  ActiveShiftContext,
  DisambiguationChoice
} from '../../services/driverStateService';
import { trailerFleetService } from '../../services/trailerFleetService';
import { initialMarketplaceShifts } from '../../data/mockMarketplaceData';
import { MOCK_FREIGHT_LOADS } from '../../data/mockFreightLoads';
import { tts } from '../../services/ttsService';
import { DriverLicenceProfile } from '../../types';
import { getActiveDriverLicence } from '../../services/licenceScannerService';

interface SimpleCoPilotAppProps {
  onSwitchToAdvancedConsole?: () => void;
  onOpenTachoScanner?: () => void;
  onOpenReliefMarketplace?: () => void;
  onReturnToSuiteLanding?: () => void;
  onOpenLicenceScanner?: () => void;
}

export const SimpleCoPilotApp: React.FC<SimpleCoPilotAppProps> = ({
  onSwitchToAdvancedConsole,
  onOpenTachoScanner,
  onOpenReliefMarketplace,
  onReturnToSuiteLanding,
  onOpenLicenceScanner
}) => {
  const [currentStep, setCurrentStep] = useState<DriverFlowStep>(driverStateService.getStep());
  const [activeLicence, setActiveLicence] = useState<DriverLicenceProfile | null>(() => getActiveDriverLicence());
  const [shiftContext, setShiftContext] = useState<ActiveShiftContext | null>(
    driverStateService.getShiftContext()
  );
  const [disambiguationOptions, setDisambiguationOptions] = useState<DisambiguationChoice[]>([]);

  // Input states
  const [customReg, setCustomReg] = useState('');
  const [trailerInput, setTrailerInput] = useState('');
  const [receiverName, setReceiverName] = useState('Dave Miller (Goods In)');
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Sync state with service
  const refreshState = () => {
    setCurrentStep(driverStateService.getStep());
    setShiftContext(driverStateService.getShiftContext());
    setDisambiguationOptions(driverStateService.getDisambiguationOptions());
  };

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  // Actions
  const handleStartShift = () => {
    driverStateService.startNewShift();
    refreshState();
  };

  const handleConfirmVehicle = (reg: string, category?: string) => {
    driverStateService.confirmVehicle(reg, category);
    refreshState();
    showToast(`Vehicle confirmed: ${reg}`);
  };

  const handleSubmitTrailer = (num: string) => {
    const res = driverStateService.submitTrailerNumber(num);
    refreshState();
    if (res.status === 'DISAMBIGUATION_NEEDED') {
      showToast(`Multiple fleets use trailer #${num}. Please select your company.`);
    } else if (res.status === 'EXACT_MATCH') {
      showToast(`Hitched ${res.profile?.companyName} #${num} (${res.profile?.heightMeters}m).`);
    } else if (res.status === 'NO_TRAILER') {
      showToast('Rigid / No-Trailer mode selected.');
    }
  };

  const handleSelectOperator = (choice: DisambiguationChoice) => {
    driverStateService.selectDisambiguatedOperator(choice.companyId, choice.trailerNumber);
    refreshState();
    showToast(`Selected ${choice.companyName} (${choice.heightMeters}m). Height profile locked in.`);
  };

  const handleConfirmManifest = () => {
    driverStateService.confirmManifest();
    refreshState();
    showToast('Route optimized! Tacho 45m break scheduled.');
  };

  const handleArriveAtGate = () => {
    driverStateService.arriveAtGate();
    refreshState();
    try {
      tts.speak('You have arrived at the gatehouse. Gate PIN is 8492.');
    } catch (_e) {}
  };

  const handleOpenPodSign = () => {
    driverStateService.openPodSign();
    refreshState();
  };

  const handleConfirmPod = () => {
    driverStateService.confirmPodSignature(receiverName);
    refreshState();
    showToast('e-POD signed! Forward schedule recalculated.');
  };

  const handleFinishShift = () => {
    driverStateService.finishShift();
    refreshState();
    showToast('Shift recorded. Earnings queued for Friday deposit.');
  };

  const handleReset = () => {
    driverStateService.resetToLauncher();
    refreshState();
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans selection:bg-amber-500 selection:text-slate-950 flex flex-col justify-between">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed top-16 left-4 right-4 z-50 max-w-sm mx-auto rounded-2xl bg-amber-500 text-slate-950 px-4 py-3 text-xs font-black shadow-2xl border border-amber-400 animate-in slide-in-from-top-4 flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 shrink-0" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Top Mobile Bar */}
      <header className="sticky top-0 z-40 bg-slate-950/95 backdrop-blur-md border-b border-slate-900 px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-amber-500 to-amber-600 text-slate-950 font-black text-sm shadow-md shadow-amber-500/20">
            DP
          </div>
          <div>
            <div className="flex items-center gap-1.5 leading-none">
              <span className="font-extrabold text-white text-sm">Drive Partners</span>
              <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
            </div>
            <span className="text-[10px] text-slate-400 font-mono">
              {shiftContext ? `Live Run • Drop ${shiftContext.currentStopIndex + 1} of 5` : 'Driver Co-Pilot • Ready'}
            </span>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {onOpenLicenceScanner && (
            <button
              onClick={onOpenLicenceScanner}
              className="text-[11px] font-bold text-amber-300 hover:text-amber-200 px-2.5 py-1.5 rounded-xl border border-amber-500/40 bg-amber-500/10 transition-colors flex items-center gap-1 shadow-sm cursor-pointer"
              title="UK Driving Licence & DVLA Profile"
            >
              <ShieldCheck className="w-3.5 h-3.5 text-amber-400" />
              <span className="hidden xs:inline">{activeLicence ? 'My Licence' : 'Scan Licence'}</span>
            </button>
          )}
          {onReturnToSuiteLanding && (
            <button
              onClick={onReturnToSuiteLanding}
              className="text-[11px] font-bold text-slate-300 hover:text-white px-2.5 py-1.5 rounded-xl border border-slate-800 bg-slate-900 transition-colors flex items-center gap-1 shadow-sm"
              title="Return to Suite Landing Hub"
            >
              <Home className="w-3 h-3 text-cyan-400" />
              <span>Suite Hub</span>
            </button>
          )}
          {onSwitchToAdvancedConsole && (
            <button
              onClick={onSwitchToAdvancedConsole}
              className="text-[11px] font-bold text-slate-400 hover:text-white px-2.5 py-1.5 rounded-xl border border-slate-800 hover:border-slate-700 bg-slate-900 transition-colors flex items-center gap-1"
            >
              <Layers className="w-3 h-3 text-cyan-400" />
              <span>Full Suite</span>
            </button>
          )}
        </div>
      </header>

      {/* ========================================================================= */}
      {/* MAIN SCREEN AREA (1 SIMPLE JOB PER SCREEN)                                 */}
      {/* ========================================================================= */}
      <main className="flex-1 w-full max-w-md mx-auto p-4 flex flex-col justify-center">

        {/* ------------------------------------------------------------------------- */}
        {/* 1. HOME LAUNCHER (When Off-Duty or Between Shifts)                         */}
        {/* ------------------------------------------------------------------------- */}
        {currentStep === 'HOME_LAUNCHER' && (
          <div className="space-y-4 py-2 animate-in fade-in duration-300">
            {/* Friendly Greeting Card */}
            <div className="p-5 rounded-3xl bg-gradient-to-br from-slate-900 to-slate-900/90 border border-slate-800 shadow-xl space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-xs font-mono text-amber-400 font-bold uppercase tracking-wider">
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>Good Morning, {activeLicence ? activeLicence.firstNames.split(' ')[0] : 'Alex'}</span>
                </div>
                {activeLicence && (
                  <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                    {activeLicence.highestHGVCategory === 'CAT_CE' ? 'C+E Class 1' : 'Cat C'} Clean
                  </span>
                )}
              </div>
              <h2 className="text-xl font-black text-white leading-tight">
                Ready for today's run?
              </h2>
              <p className="text-xs text-slate-400 leading-relaxed">
                Start your shift in 2 taps. We will check trailer bridge clearance and organize your drops automatically.
              </p>

              {/* Giant Primary Action Button */}
              <button
                onClick={handleStartShift}
                className="w-full py-4 rounded-2xl bg-gradient-to-r from-amber-500 via-amber-400 to-amber-500 hover:from-amber-400 hover:to-amber-300 text-slate-950 font-black text-base shadow-xl shadow-amber-500/25 active:scale-95 transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                <Truck className="w-5 h-5 text-slate-950" />
                <span>START TODAY'S SHIFT</span>
                <ArrowRight className="w-5 h-5" />
              </button>
            </div>

            {/* Driver Identity Card / Licence Verification Box */}
            <div className="p-3.5 rounded-2xl bg-slate-900 border border-slate-800 flex items-center justify-between shadow-md">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-amber-500/20 text-amber-400 flex items-center justify-center font-bold">
                  <ShieldCheck className="w-5 h-5" />
                </div>
                <div>
                  <div className="flex items-center gap-1.5">
                    <span className="text-xs font-bold text-white">
                      {activeLicence ? activeLicence.fullName : 'Scan Your Driving Licence'}
                    </span>
                    <span className="text-[9px] font-mono px-1.5 py-0.2 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                      {activeLicence ? 'DVLA VERIFIED' : 'GET STARTED'}
                    </span>
                  </div>
                  <p className="text-[10px] text-slate-400 mt-0.5 font-mono">
                    {activeLicence
                      ? `${activeLicence.licenceNumber} • ${activeLicence.penaltyPoints} Pts • CPC ${activeLicence.cpcStatus}`
                      : 'Create driver account in 15 seconds'}
                  </p>
                </div>
              </div>
              {onOpenLicenceScanner && (
                <button
                  onClick={onOpenLicenceScanner}
                  className="px-3 py-1.5 rounded-xl bg-amber-500/10 hover:bg-amber-500/20 text-amber-300 border border-amber-500/30 text-[11px] font-bold transition-all active:scale-95 cursor-pointer shrink-0"
                >
                  {activeLicence ? 'View ID' : 'Scan ID'}
                </button>
              )}
            </div>

            {/* The 4-Tile "Simple Life" Grid */}
            <div className="grid grid-cols-2 gap-3 pt-1">
              {/* Tile 1: Route & Trailer */}
              <button
                onClick={() => {
                  driverStateService.setStep('VIEW_TRAILER_LOOKUP');
                  refreshState();
                }}
                className="p-4 rounded-2xl bg-slate-900 border border-slate-800 hover:border-cyan-500/50 text-left transition-all active:scale-95 flex flex-col justify-between h-32 group"
              >
                <div className="w-9 h-9 rounded-xl bg-cyan-500/20 text-cyan-400 flex items-center justify-center font-bold">
                  <Truck className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-white group-hover:text-cyan-400 transition-colors">
                    Trailer &amp; Bridges
                  </h4>
                  <p className="text-[10px] text-slate-400 mt-0.5">
                    Check heights &amp; MOT status
                  </p>
                </div>
              </button>

              {/* Tile 2: Tacho & Hours */}
              <button
                onClick={() => {
                  driverStateService.setStep('VIEW_TACHO');
                  refreshState();
                }}
                className="p-4 rounded-2xl bg-slate-900 border border-slate-800 hover:border-emerald-500/50 text-left transition-all active:scale-95 flex flex-col justify-between h-32 group"
              >
                <div className="w-9 h-9 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center font-bold">
                  <Clock className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-white group-hover:text-emerald-400 transition-colors">
                    My Tacho &amp; Hours
                  </h4>
                  <p className="text-[10px] text-slate-400 mt-0.5">
                    1h 25m drive time remaining
                  </p>
                </div>
              </button>

              {/* Tile 3: Extra Work */}
              <button
                onClick={() => {
                  driverStateService.setStep('VIEW_WORK');
                  refreshState();
                }}
                className="p-4 rounded-2xl bg-slate-900 border border-slate-800 hover:border-purple-500/50 text-left transition-all active:scale-95 flex flex-col justify-between h-32 group"
              >
                <div className="w-9 h-9 rounded-xl bg-purple-500/20 text-purple-400 flex items-center justify-center font-bold">
                  <Briefcase className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-white group-hover:text-purple-400 transition-colors">
                    Find Extra Work
                  </h4>
                  <p className="text-[10px] text-slate-400 mt-0.5">
                    Relief shifts &amp; return loads
                  </p>
                </div>
              </button>

              {/* Tile 4: Money & Friday Pay */}
              <button
                onClick={() => {
                  driverStateService.setStep('VIEW_PAY');
                  refreshState();
                }}
                className="p-4 rounded-2xl bg-slate-900 border border-slate-800 hover:border-amber-500/50 text-left transition-all active:scale-95 flex flex-col justify-between h-32 group"
              >
                <div className="w-9 h-9 rounded-xl bg-amber-500/20 text-amber-400 flex items-center justify-center font-bold">
                  <CreditCard className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-white group-hover:text-amber-400 transition-colors">
                    My Pay &amp; Hours
                  </h4>
                  <p className="text-[10px] text-slate-400 mt-0.5">
                    £680.00 arriving Friday
                  </p>
                </div>
              </button>
            </div>
          </div>
        )}

        {/* ------------------------------------------------------------------------- */}
        {/* 2. STEP 1: VEHICLE CONFIRMATION                                           */}
        {/* ------------------------------------------------------------------------- */}
        {currentStep === 'VEHICLE_SELECT' && (
          <div className="space-y-4 py-2 animate-in fade-in duration-300">
            <div className="flex items-center justify-between text-xs text-slate-400">
              <button
                onClick={handleReset}
                className="flex items-center gap-1 hover:text-white"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>Cancel</span>
              </button>
              <span className="font-mono font-bold text-amber-400">Step 1 of 3</span>
            </div>

            <div className="p-5 rounded-3xl bg-slate-900 border border-slate-800 shadow-xl space-y-4">
              <div>
                <h3 className="text-lg font-black text-white">What vehicle are you driving?</h3>
                <p className="text-xs text-slate-400 mt-1">
                  Choose your regular tractor unit or enter a new registration.
                </p>
              </div>

              {/* Quick Preset 1 */}
              <button
                onClick={() => handleConfirmVehicle('KX72 WYZ')}
                className="w-full p-4 rounded-2xl bg-slate-950 hover:bg-slate-850 border-2 border-amber-500 text-left transition-all flex items-center justify-between group cursor-pointer"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-amber-500/20 text-amber-400 flex items-center justify-center font-black">
                    <Truck className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="text-sm font-black text-white block">KX72 WYZ</span>
                    <span className="text-xs text-slate-400">44t Articulated Tractor Unit (DAF XG+)</span>
                  </div>
                </div>
                <ChevronRight className="w-5 h-5 text-amber-400 group-hover:translate-x-1 transition-transform" />
              </button>

              {/* Quick Preset 2 */}
              <button
                onClick={() => handleConfirmVehicle('PO21 XTF', '26t Rigid Curtain')}
                className="w-full p-3.5 rounded-2xl bg-slate-950 hover:bg-slate-850 border border-slate-800 text-left transition-all flex items-center justify-between group cursor-pointer"
              >
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-slate-800 text-slate-300 flex items-center justify-center font-bold">
                    <Truck className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="text-xs font-bold text-white block">PO21 XTF</span>
                    <span className="text-[11px] text-slate-400">26t Rigid Curtain with Tail-Lift</span>
                  </div>
                </div>
                <ChevronRight className="w-4 h-4 text-slate-400 group-hover:translate-x-1 transition-transform" />
              </button>

              {/* Custom Reg Input */}
              <div className="pt-2 border-t border-slate-800">
                <label className="text-[11px] font-bold text-slate-400 block mb-1">
                  Or enter another registration:
                </label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    placeholder="e.g. GN23 BKR"
                    value={customReg}
                    onChange={(e) => setCustomReg(e.target.value.toUpperCase())}
                    className="flex-1 bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs font-mono font-bold text-amber-300 uppercase tracking-wider focus:outline-none focus:border-amber-500"
                  />
                  <button
                    onClick={() => {
                      if (customReg.trim()) handleConfirmVehicle(customReg);
                    }}
                    disabled={!customReg.trim()}
                    className="px-4 py-2 bg-slate-800 hover:bg-slate-700 disabled:opacity-40 text-white text-xs font-bold rounded-xl transition-all"
                  >
                    Confirm
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ------------------------------------------------------------------------- */}
        {/* 3. STEP 2: TRAILER HITCH & DISAMBIGUATION                                 */}
        {/* ------------------------------------------------------------------------- */}
        {currentStep === 'TRAILER_HITCH' && (
          <div className="space-y-4 py-2 animate-in fade-in duration-300">
            <div className="flex items-center justify-between text-xs text-slate-400">
              <button
                onClick={() => {
                  driverStateService.setStep('VEHICLE_SELECT');
                  refreshState();
                }}
                className="flex items-center gap-1 hover:text-white"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>Back</span>
              </button>
              <span className="font-mono font-bold text-amber-400">Step 2 of 3</span>
            </div>

            <div className="p-5 rounded-3xl bg-slate-900 border border-slate-800 shadow-xl space-y-4">
              <div>
                <h3 className="text-lg font-black text-white">Are you hitching a trailer?</h3>
                <p className="text-xs text-slate-400 mt-1">
                  Type the trailer fleet number so we can check bridge heights and MOT roadworthiness.
                </p>
              </div>

              {/* Number Input Box */}
              <div>
                <label className="text-[11px] font-bold text-slate-400 block mb-1">
                  Trailer Fleet Number:
                </label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    placeholder="e.g. 1042 or 502"
                    value={trailerInput}
                    onChange={(e) => setTrailerInput(e.target.value)}
                    className="flex-1 bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-base font-mono font-black text-amber-400 tracking-wider focus:outline-none focus:border-amber-500"
                  />
                  <button
                    onClick={() => {
                      if (trailerInput.trim()) handleSubmitTrailer(trailerInput);
                    }}
                    disabled={!trailerInput.trim()}
                    className="px-5 py-3 bg-amber-500 hover:bg-amber-400 disabled:opacity-40 text-slate-950 text-xs font-black rounded-xl transition-all cursor-pointer"
                  >
                    Check
                  </button>
                </div>
              </div>

              {/* Quick Shortcut Buttons */}
              <div className="space-y-2 pt-2 border-t border-slate-800">
                <span className="text-[11px] text-slate-400 block font-medium">Quick suggestions:</span>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    onClick={() => handleSubmitTrailer('1042')}
                    className="p-2.5 rounded-xl bg-slate-950 border border-slate-800 hover:border-amber-500/50 text-left text-xs font-mono text-slate-200 transition-all cursor-pointer"
                  >
                    <span className="text-amber-400 font-bold block">Trailer #1042</span>
                    <span className="text-[10px] text-slate-400">Multiple Fleets</span>
                  </button>
                  <button
                    onClick={() => handleSubmitTrailer('502')}
                    className="p-2.5 rounded-xl bg-slate-950 border border-slate-800 hover:border-amber-500/50 text-left text-xs font-mono text-slate-200 transition-all cursor-pointer"
                  >
                    <span className="text-amber-400 font-bold block">Trailer #502</span>
                    <span className="text-[10px] text-slate-400">Wincanton / Culina</span>
                  </button>
                </div>

                <button
                  onClick={() => handleSubmitTrailer('NONE')}
                  className="w-full py-3 rounded-xl bg-slate-950 hover:bg-slate-800 border border-slate-800 text-slate-400 hover:text-white text-xs font-bold transition-all text-center block mt-2 cursor-pointer"
                >
                  No Trailer / Driving Solo Tractor
                </button>
              </div>
            </div>
          </div>
        )}

        {/* ------------------------------------------------------------------------- */}
        {/* 4. TRAILER DISAMBIGUATION (Simple Operator Choice)                        */}
        {/* ------------------------------------------------------------------------- */}
        {currentStep === 'TRAILER_DISAMBIGUATION' && (
          <div className="space-y-4 py-2 animate-in fade-in duration-300">
            <div className="flex items-center justify-between text-xs text-slate-400">
              <button
                onClick={() => {
                  driverStateService.setStep('TRAILER_HITCH');
                  refreshState();
                }}
                className="flex items-center gap-1 hover:text-white"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>Back</span>
              </button>
              <span className="font-mono font-bold text-amber-400">Which Company?</span>
            </div>

            <div className="p-5 rounded-3xl bg-slate-900 border border-slate-800 shadow-xl space-y-4">
              <div>
                <span className="text-[10px] font-mono text-amber-400 uppercase tracking-wider font-bold">
                  Duplicate Number Detected
                </span>
                <h3 className="text-lg font-black text-white mt-0.5">
                  Which company owns this trailer?
                </h3>
                <p className="text-xs text-slate-400 mt-1">
                  Multiple hauliers use trailer number #{disambiguationOptions[0]?.trailerNumber}. Tap yours to load the right height:
                </p>
              </div>

              {/* Operator Cards */}
              <div className="space-y-2.5">
                {disambiguationOptions.map((opt) => (
                  <button
                    key={opt.companyId}
                    onClick={() => handleSelectOperator(opt)}
                    className="w-full p-4 rounded-2xl bg-slate-950 hover:bg-slate-850 border-2 border-slate-800 hover:border-amber-400 text-left transition-all active:scale-95 flex items-center justify-between group cursor-pointer"
                  >
                    <div className="flex items-center gap-3">
                      <div
                        className="w-10 h-10 rounded-xl flex items-center justify-center font-black text-xs text-slate-950 shadow"
                        style={{ backgroundColor: opt.primaryColor }}
                      >
                        {opt.companyName.substring(0, 3).toUpperCase()}
                      </div>
                      <div>
                        <span className="text-sm font-black text-white block">
                          {opt.companyName}
                        </span>
                        <div className="flex items-center gap-2 text-xs text-slate-400 mt-0.5 font-mono">
                          <span className="text-amber-400 font-bold">{opt.heightMeters}m Height</span>
                          <span>•</span>
                          <span>{opt.trailerType}</span>
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                        MOT {opt.motStatus}
                      </span>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* ------------------------------------------------------------------------- */}
        {/* 5. STEP 3: MANIFEST PAPERWORK SNAP & ROUTE PREVIEW                        */}
        {/* ------------------------------------------------------------------------- */}
        {currentStep === 'MANIFEST_UPLOAD' && (
          <div className="space-y-4 py-2 animate-in fade-in duration-300">
            <div className="flex items-center justify-between text-xs text-slate-400">
              <button
                onClick={() => {
                  driverStateService.setStep('TRAILER_HITCH');
                  refreshState();
                }}
                className="flex items-center gap-1 hover:text-white"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>Back</span>
              </button>
              <span className="font-mono font-bold text-amber-400">Step 3 of 3</span>
            </div>

            <div className="p-5 rounded-3xl bg-slate-900 border border-slate-800 shadow-xl space-y-4">
              <div>
                <h3 className="text-lg font-black text-white">Got your route paperwork?</h3>
                <p className="text-xs text-slate-400 mt-1">
                  Snap a photo of the consignment sheet, or use today's pre-loaded schedule.
                </p>
              </div>

              {/* Action: Snap Manifest */}
              <button
                onClick={handleConfirmManifest}
                className="w-full p-4 rounded-2xl bg-slate-950 hover:bg-slate-850 border border-slate-800 hover:border-amber-400 text-left transition-all active:scale-95 flex items-center gap-3 cursor-pointer group"
              >
                <div className="w-12 h-12 rounded-xl bg-amber-500/20 text-amber-400 flex items-center justify-center font-bold shrink-0">
                  <Camera className="w-6 h-6" />
                </div>
                <div>
                  <span className="text-sm font-bold text-white block group-hover:text-amber-400 transition-colors">
                    Take Photo of Paper Manifest
                  </span>
                  <span className="text-xs text-slate-400 mt-0.5 block">
                    Our camera OCR reads drop postcodes &amp; optimizes sequence
                  </span>
                </div>
              </button>

              {/* Action: Use Pre-loaded Schedule */}
              <button
                onClick={handleConfirmManifest}
                className="w-full p-4 rounded-2xl bg-slate-950 hover:bg-slate-850 border border-slate-800 hover:border-cyan-400 text-left transition-all active:scale-95 flex items-center gap-3 cursor-pointer group"
              >
                <div className="w-12 h-12 rounded-xl bg-cyan-500/20 text-cyan-400 flex items-center justify-center font-bold shrink-0">
                  <FileText className="w-6 h-6" />
                </div>
                <div>
                  <span className="text-sm font-bold text-white block group-hover:text-cyan-400 transition-colors">
                    Use Pre-loaded 5-Drop Schedule
                  </span>
                  <span className="text-xs text-slate-400 mt-0.5 block">
                    Midlands FMCG Hubs (Sainsbury's, Tesco Magna Park)
                  </span>
                </div>
              </button>

              {/* Height Confirmation Pill */}
              <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-between text-xs">
                <span className="text-slate-400">Total Vehicle Running Height:</span>
                <span className="font-mono font-bold text-emerald-400">
                  {shiftContext?.vehicleHeightMeters || 4.45}m • Bridge Safe
                </span>
              </div>
            </div>
          </div>
        )}

        {/* ------------------------------------------------------------------------- */}
        {/* 6. DRIVING EN-ROUTE (Zero-Distraction Mode)                                 */}
        {/* ------------------------------------------------------------------------- */}
        {currentStep === 'DRIVING_EN_ROUTE' && shiftContext && (
          <div className="space-y-4 py-2 animate-in fade-in duration-300">
            {/* Top Navigation Next-Turn Banner */}
            <div className="p-4 rounded-2xl bg-cyan-950/80 border border-cyan-500/50 shadow-lg flex items-center gap-3">
              <div className="w-11 h-11 rounded-xl bg-cyan-500 text-slate-950 flex items-center justify-center font-black shrink-0">
                <Navigation className="w-6 h-6 rotate-45" />
              </div>
              <div className="flex-1">
                <span className="text-[10px] font-mono text-cyan-400 font-bold uppercase tracking-wider block">
                  Next Turn • 1.2 miles
                </span>
                <h3 className="text-base font-black text-white leading-tight">
                  Bear left onto A428 towards Daventry
                </h3>
              </div>
            </div>

            {/* Main Destination Card */}
            <div className="p-5 rounded-3xl bg-slate-900 border border-slate-800 shadow-xl space-y-4">
              <div>
                <span className="text-[10px] font-mono text-amber-400 font-bold uppercase tracking-wider">
                  Stop {shiftContext.currentStopIndex + 1} of 5
                </span>
                <h2 className="text-xl font-black text-white mt-0.5">
                  {shiftContext.routePlan.stops[shiftContext.currentStopIndex]?.customerName}
                </h2>
                <div className="flex items-center gap-1.5 text-xs text-slate-400 mt-1">
                  <MapPin className="w-3.5 h-3.5 text-rose-400 shrink-0" />
                  <span>{shiftContext.routePlan.stops[shiftContext.currentStopIndex]?.address}</span>
                </div>
              </div>

              {/* Tacho Hours Progress Bar */}
              <div className="p-3.5 rounded-2xl bg-slate-950 border border-slate-800 space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-slate-400 font-medium">Drive Time Before Break:</span>
                  <span className="font-mono font-bold text-cyan-400">1h 25m remaining</span>
                </div>
                <div className="w-full bg-slate-800 rounded-full h-2.5 overflow-hidden">
                  <div className="bg-cyan-500 h-full w-[68%]" />
                </div>
                <div className="text-[10px] text-slate-400 flex items-center justify-between">
                  <span>Current: 3h 05m</span>
                  <span className="text-emerald-400 font-bold">45m Break Scheduled @ Stop 3</span>
                  <span>Limit: 4h 30m</span>
                </div>
              </div>

              {/* Hazard Alert (If Any) */}
              {shiftContext.currentHazardAlert && (
                <div className="p-3 rounded-xl bg-amber-950/60 border border-amber-500/40 text-xs text-amber-200 flex items-center gap-2">
                  <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0" />
                  <span>{shiftContext.currentHazardAlert.message}</span>
                </div>
              )}

              {/* Giant "Arrived" Button */}
              <button
                onClick={handleArriveAtGate}
                className="w-full py-4 rounded-2xl bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-400 hover:to-emerald-500 text-slate-950 font-black text-base shadow-xl shadow-emerald-500/20 active:scale-95 transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                <MapPin className="w-5 h-5 text-slate-950" />
                <span>ARRIVED AT DELIVERY SITE</span>
              </button>
            </div>
          </div>
        )}

        {/* ------------------------------------------------------------------------- */}
        {/* 7. AT DEPOT GATE (Giant Gate PIN & Bay Assignment)                        */}
        {/* ------------------------------------------------------------------------- */}
        {currentStep === 'AT_DEPOT_GATE' && shiftContext && (
          <div className="space-y-4 py-2 animate-in fade-in duration-300">
            <div className="p-5 rounded-3xl bg-slate-900 border-2 border-emerald-500 shadow-2xl space-y-4 text-center">
              <div>
                <span className="text-xs font-mono text-emerald-400 font-bold uppercase tracking-wider">
                  You Have Arrived
                </span>
                <h2 className="text-xl font-black text-white mt-1">
                  {shiftContext.routePlan.stops[shiftContext.currentStopIndex]?.customerName}
                </h2>
              </div>

              {/* Giant Gate PIN */}
              <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-1">
                <span className="text-xs text-slate-400 font-mono uppercase">Gatehouse Entry PIN</span>
                <div className="text-4xl sm:text-5xl font-mono font-black text-amber-400 tracking-widest">
                  8492
                </div>
                <span className="text-[11px] text-slate-400">Intercom Channel: CH 01</span>
              </div>

              {/* Bay Assignment */}
              <div className="p-3.5 rounded-2xl bg-slate-950 border border-slate-800 flex items-center justify-around text-xs">
                <div>
                  <span className="text-slate-400 block text-[10px]">Assigned Bay</span>
                  <span className="text-base font-black text-white font-mono">Bay 14</span>
                </div>
                <div className="h-6 w-px bg-slate-800" />
                <div>
                  <span className="text-slate-400 block text-[10px]">Cargo</span>
                  <span className="text-base font-black text-white font-mono">8 Pallets</span>
                </div>
              </div>

              {/* Big Ready for Sign-Off Button */}
              <button
                onClick={handleOpenPodSign}
                className="w-full py-4 rounded-2xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-base shadow-xl shadow-amber-500/20 active:scale-95 transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                <CheckCircle2 className="w-5 h-5 text-slate-950" />
                <span>UNLOADED • GET SIGNATURE</span>
              </button>
            </div>
          </div>
        )}

        {/* ------------------------------------------------------------------------- */}
        {/* 8. POD SIGN (1-Tap Receiver Sign-Off)                                      */}
        {/* ------------------------------------------------------------------------- */}
        {currentStep === 'POD_SIGN' && shiftContext && (
          <div className="space-y-4 py-2 animate-in fade-in duration-300">
            <div className="p-5 rounded-3xl bg-slate-900 border border-slate-800 shadow-xl space-y-4">
              <div>
                <span className="text-xs font-mono text-amber-400 font-bold uppercase tracking-wider">
                  Digital Proof of Delivery
                </span>
                <h3 className="text-lg font-black text-white mt-1">
                  Receiver Sign-Off (e-POD)
                </h3>
                <p className="text-xs text-slate-400">
                  Ask the duty goods-in receiver for their name:
                </p>
              </div>

              <div>
                <label className="text-[11px] font-bold text-slate-400 block mb-1">
                  Receiver Full Name:
                </label>
                <input
                  type="text"
                  value={receiverName}
                  onChange={(e) => setReceiverName(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-sm font-bold text-white focus:outline-none focus:border-amber-500"
                />
              </div>

              {/* Mock Signature Box */}
              <div className="p-4 rounded-2xl bg-slate-950 border-2 border-dashed border-slate-800 text-center space-y-2">
                <span className="text-[11px] text-slate-500 block">Sign on screen below</span>
                <div className="h-16 flex items-center justify-center text-slate-600 font-serif italic text-lg select-none">
                  ✍️ Signed digitally by receiver
                </div>
              </div>

              {/* Confirm e-POD Button */}
              <button
                onClick={handleConfirmPod}
                className="w-full py-4 rounded-2xl bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-400 hover:to-emerald-500 text-slate-950 font-black text-base shadow-xl shadow-emerald-500/25 active:scale-95 transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                <CheckCircle2 className="w-5 h-5 text-slate-950" />
                <span>CONFIRM SIGN-OFF &amp; NEXT STOP</span>
              </button>
            </div>
          </div>
        )}

        {/* ------------------------------------------------------------------------- */}
        {/* 9. SHIFT SUMMARY (End of Shift & Earnings)                                 */}
        {/* ------------------------------------------------------------------------- */}
        {currentStep === 'SHIFT_SUMMARY' && (
          <div className="space-y-4 py-2 animate-in fade-in duration-300 text-center">
            <div className="p-6 rounded-3xl bg-gradient-to-br from-slate-900 to-slate-950 border-2 border-emerald-500 shadow-2xl space-y-4">
              <div className="w-14 h-14 rounded-2xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center mx-auto">
                <CheckCircle2 className="w-8 h-8" />
              </div>

              <div>
                <span className="text-xs font-mono text-emerald-400 font-bold uppercase tracking-wider">
                  All Drops Completed
                </span>
                <h2 className="text-2xl font-black text-white mt-1">Great Job Today!</h2>
                <p className="text-xs text-slate-400 mt-1">
                  5 drops delivered with digital e-PODs. 100% tacho compliant.
                </p>
              </div>

              {/* Pay & Hours Summary */}
              <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 grid grid-cols-2 gap-3 text-left">
                <div>
                  <span className="text-[10px] text-slate-400 block font-mono">Hours Worked</span>
                  <span className="text-base font-black text-white font-mono">8h 45m</span>
                </div>
                <div>
                  <span className="text-[10px] text-slate-400 block font-mono">Estimated Earnings</span>
                  <span className="text-base font-black text-emerald-400 font-mono">£152.00</span>
                </div>
              </div>

              <p className="text-[11px] text-slate-400">
                Your payment will be automatically deposited this Friday.
              </p>

              <button
                onClick={handleFinishShift}
                className="w-full py-4 rounded-2xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-base shadow-xl shadow-amber-500/20 active:scale-95 transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                <span>FINISH SHIFT &amp; REST</span>
                <ArrowRight className="w-5 h-5" />
              </button>
            </div>
          </div>
        )}

        {/* ------------------------------------------------------------------------- */}
        {/* SUB-VIEW: TACHO & HOURS OVERVIEW                                          */}
        {/* ------------------------------------------------------------------------- */}
        {currentStep === 'VIEW_TACHO' && (
          <div className="space-y-4 py-2 animate-in fade-in duration-300">
            <div className="flex items-center justify-between text-xs text-slate-400">
              <button onClick={handleReset} className="flex items-center gap-1 hover:text-white">
                <ArrowLeft className="w-4 h-4" />
                <span>Back</span>
              </button>
              <span className="font-mono font-bold text-emerald-400">Tacho Bureau</span>
            </div>

            <div className="p-5 rounded-3xl bg-slate-900 border border-slate-800 shadow-xl space-y-4">
              <div>
                <h3 className="text-lg font-black text-white">My Tacho &amp; Hours</h3>
                <p className="text-xs text-slate-400 mt-1">
                  Automatic EU 561/2006 compliance tracking without confusing math.
                </p>
              </div>

              {/* Status Box */}
              <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs text-slate-300 font-bold">Drive Time Left Today:</span>
                  <span className="text-lg font-black text-emerald-400 font-mono">5h 55m</span>
                </div>
                <div className="flex items-center justify-between text-xs">
                  <span className="text-slate-400">Continuous driving before break:</span>
                  <span className="font-bold text-amber-400 font-mono">1h 25m left</span>
                </div>
                <div className="flex items-center justify-between text-xs">
                  <span className="text-slate-400">Weekly Driving Hours:</span>
                  <span className="font-bold text-white font-mono">28h 15m / 56h max</span>
                </div>
              </div>

              {/* Action 1: Thermal Printout Auto-Focus Scan */}
              <button
                onClick={() => {
                  if (onOpenTachoScanner) {
                    onOpenTachoScanner();
                  } else {
                    showToast('Opening Tacho-Scan Camera...');
                  }
                }}
                className="w-full p-4 rounded-2xl bg-gradient-to-r from-amber-500/15 via-amber-500/10 to-amber-600/15 border border-amber-500/40 hover:border-amber-400 text-left transition-all flex items-center justify-between cursor-pointer group"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-amber-500/20 text-amber-400 flex items-center justify-center font-bold shrink-0">
                    <Camera className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="text-xs font-black text-white block group-hover:text-amber-300 transition-colors">
                      Scan Thermal Printout Roll (Live Camera OCR)
                    </span>
                    <span className="text-[10px] text-slate-400">
                      Auto-focus hands-free scan reads 24h compliance in 2 seconds
                    </span>
                  </div>
                </div>
                <ChevronRight className="w-4 h-4 text-slate-500 group-hover:text-amber-400 transition-transform" />
              </button>

              {/* Action 2: Card Reader / DDD */}
              <button
                onClick={() => {
                  if (onOpenTachoScanner) {
                    onOpenTachoScanner();
                  } else {
                    showToast('USB-C Card Reader detected! Reading .DDD files...');
                  }
                }}
                className="w-full p-4 rounded-2xl bg-slate-950 hover:bg-slate-850 border border-slate-800 hover:border-emerald-500 text-left transition-all flex items-center justify-between cursor-pointer group"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center font-bold shrink-0">
                    <Smartphone className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="text-xs font-bold text-white block group-hover:text-emerald-400 transition-colors">
                      Plug in USB-C Card Reader or Upload DDD
                    </span>
                    <span className="text-[10px] text-slate-400">
                      Direct card download or order Drive Partners Reader (£14.99)
                    </span>
                  </div>
                </div>
                <ChevronRight className="w-4 h-4 text-slate-500 group-hover:text-emerald-400 transition-transform" />
              </button>

              <button
                onClick={handleReset}
                className="w-full py-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-white text-xs font-bold transition-all text-center block cursor-pointer"
              >
                Done • Back to Home
              </button>
            </div>
          </div>
        )}

        {/* ------------------------------------------------------------------------- */}
        {/* SUB-VIEW: FIND EXTRA WORK (Loads & Relief Shifts)                          */}
        {/* ------------------------------------------------------------------------- */}
        {currentStep === 'VIEW_WORK' && (
          <div className="space-y-4 py-2 animate-in fade-in duration-300">
            <div className="flex items-center justify-between text-xs text-slate-400">
              <button onClick={handleReset} className="flex items-center gap-1 hover:text-white">
                <ArrowLeft className="w-4 h-4" />
                <span>Back</span>
              </button>
              <span className="font-mono font-bold text-purple-400">Extra Work</span>
            </div>

            <div className="p-5 rounded-3xl bg-slate-900 border border-slate-800 shadow-xl space-y-4">
              <div>
                <h3 className="text-lg font-black text-white">Find Extra Work</h3>
                <p className="text-xs text-slate-400 mt-1">
                  1-Tap claim local shifts and return loads. Paid automatically this Friday.
                </p>
              </div>

              {/* Sample Shifts */}
              <div className="space-y-2.5">
                <div className="p-3.5 rounded-2xl bg-slate-950 border border-slate-800 flex items-center justify-between">
                  <div>
                    <span className="text-xs font-bold text-white block">Tomorrow • 06:00 - 16:00</span>
                    <span className="text-[11px] text-slate-400">Magna Park to DIRFT Daventry</span>
                    <span className="text-[10px] text-emerald-400 font-mono block mt-0.5">£185.00 • Cat C+E</span>
                  </div>
                  <button
                    onClick={() => showToast('Shift reserved! Added to your schedule.')}
                    className="px-3 py-1.5 bg-purple-600 hover:bg-purple-500 text-white text-xs font-bold rounded-xl shadow active:scale-95 transition-all cursor-pointer"
                  >
                    1-Tap Claim
                  </button>
                </div>

                <div className="p-3.5 rounded-2xl bg-slate-950 border border-slate-800 flex items-center justify-between">
                  <div>
                    <span className="text-xs font-bold text-white block">Return Load • Rugby to Birmingham</span>
                    <span className="text-[11px] text-slate-400">44t Curtainsider • 24 Pallets</span>
                    <span className="text-[10px] text-emerald-400 font-mono block mt-0.5">£260.00 • Direct Haulier</span>
                  </div>
                  <button
                    onClick={() => showToast('Load booked! Terms sent to your email.')}
                    className="px-3 py-1.5 bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-bold rounded-xl shadow active:scale-95 transition-all cursor-pointer"
                  >
                    1-Tap Book
                  </button>
                </div>
              </div>

              <button
                onClick={handleReset}
                className="w-full py-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-white text-xs font-bold transition-all text-center block cursor-pointer"
              >
                Done • Back to Home
              </button>
            </div>
          </div>
        )}

        {/* ------------------------------------------------------------------------- */}
        {/* SUB-VIEW: MY MONEY & HOURS (Clean Friday Pay)                             */}
        {/* ------------------------------------------------------------------------- */}
        {currentStep === 'VIEW_PAY' && (
          <div className="space-y-4 py-2 animate-in fade-in duration-300">
            <div className="flex items-center justify-between text-xs text-slate-400">
              <button onClick={handleReset} className="flex items-center gap-1 hover:text-white">
                <ArrowLeft className="w-4 h-4" />
                <span>Back</span>
              </button>
              <span className="font-mono font-bold text-amber-400">My Earnings</span>
            </div>

            <div className="p-5 rounded-3xl bg-slate-900 border border-slate-800 shadow-xl space-y-4">
              <div>
                <h3 className="text-lg font-black text-white">This Week's Pay</h3>
                <p className="text-xs text-slate-400 mt-1">
                  Deposited directly to your bank account every Friday.
                </p>
              </div>

              {/* Big Pay Card */}
              <div className="p-5 rounded-2xl bg-slate-950 border border-slate-800 text-center space-y-1">
                <span className="text-xs text-slate-400 font-mono uppercase">Arriving This Friday</span>
                <div className="text-3xl sm:text-4xl font-mono font-black text-emerald-400">
                  £680.00
                </div>
                <span className="text-[11px] text-slate-400 block pt-1">
                  4 Shifts Completed • 38.5 Total Hours
                </span>
              </div>

              <div className="space-y-2 text-xs">
                <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-between">
                  <span className="text-slate-300">Base Driving Pay:</span>
                  <span className="font-mono font-bold text-white">£635.00</span>
                </div>
                <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-between">
                  <span className="text-slate-300">Bay Waiting Demurrage:</span>
                  <span className="font-mono font-bold text-emerald-400">+£45.00</span>
                </div>
              </div>

              <div className="p-3 rounded-xl bg-emerald-950/40 border border-emerald-500/30 text-[11px] text-emerald-300 flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 shrink-0 text-emerald-400" />
                <span>All tax and National Insurance handled automatically. No surprise bills.</span>
              </div>

              <button
                onClick={handleReset}
                className="w-full py-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-white text-xs font-bold transition-all text-center block cursor-pointer"
              >
                Done • Back to Home
              </button>
            </div>
          </div>
        )}

        {/* ------------------------------------------------------------------------- */}
        {/* SUB-VIEW: TRAILER LOOKUP & MOT                                             */}
        {/* ------------------------------------------------------------------------- */}
        {currentStep === 'VIEW_TRAILER_LOOKUP' && (
          <div className="space-y-4 py-2 animate-in fade-in duration-300">
            <div className="flex items-center justify-between text-xs text-slate-400">
              <button onClick={handleReset} className="flex items-center gap-1 hover:text-white">
                <ArrowLeft className="w-4 h-4" />
                <span>Back</span>
              </button>
              <span className="font-mono font-bold text-cyan-400">Trailer Heights</span>
            </div>

            <div className="p-5 rounded-3xl bg-slate-900 border border-slate-800 shadow-xl space-y-4">
              <div>
                <h3 className="text-lg font-black text-white">Check Any Trailer</h3>
                <p className="text-xs text-slate-400 mt-1">
                  Look up running height, MOT expiry, and brake test efficiency before hitching.
                </p>
              </div>

              <div>
                <label className="text-[11px] font-bold text-slate-400 block mb-1">
                  Enter Trailer Number:
                </label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    placeholder="e.g. 1042"
                    value={trailerInput}
                    onChange={(e) => setTrailerInput(e.target.value)}
                    className="flex-1 bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-sm font-mono font-bold text-cyan-300 uppercase tracking-wider focus:outline-none focus:border-cyan-500"
                  />
                  <button
                    onClick={() => {
                      if (trailerInput.trim()) handleSubmitTrailer(trailerInput);
                    }}
                    className="px-4 py-2.5 bg-cyan-500 hover:bg-cyan-400 text-slate-950 text-xs font-black rounded-xl transition-all cursor-pointer"
                  >
                    Lookup
                  </button>
                </div>
              </div>

              <div className="space-y-2 pt-2 border-t border-slate-800 text-xs">
                <span className="text-[11px] text-slate-400 block font-medium">Common fleet trailers:</span>
                <button
                  onClick={() => handleSubmitTrailer('1042')}
                  className="w-full p-3 rounded-xl bg-slate-950 border border-slate-800 text-left flex items-center justify-between cursor-pointer"
                >
                  <span className="font-mono font-bold text-white">#1042 (Stobart / DHL / Maritime)</span>
                  <span className="text-amber-400 font-mono text-[11px]">4.45m - 4.85m</span>
                </button>
                <button
                  onClick={() => handleSubmitTrailer('502')}
                  className="w-full p-3 rounded-xl bg-slate-950 border border-slate-800 text-left flex items-center justify-between cursor-pointer"
                >
                  <span className="font-mono font-bold text-white">#502 (Wincanton / Culina)</span>
                  <span className="text-cyan-400 font-mono text-[11px]">4.20m - 4.50m</span>
                </button>
              </div>

              <button
                onClick={handleReset}
                className="w-full py-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-white text-xs font-bold transition-all text-center block cursor-pointer"
              >
                Done • Back to Home
              </button>
            </div>
          </div>
        )}
      </main>

      {/* Footer reassurance banner */}
      <footer className="w-full max-w-md mx-auto px-4 py-3 text-center border-t border-slate-900 text-[10px] text-slate-500">
        Drive Partners 2.0 • Ultra-Simple Cab Assistant • Connected to DVSA &amp; Tacho Bureau
      </footer>
    </div>
  );
};
