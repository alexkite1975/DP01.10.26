'use client';
import React, { useState, useEffect } from 'react';
import {
  ShieldAlert,
  ShieldCheck,
  AlertTriangle,
  Clock,
  CreditCard,
  Radio,
  Volume2,
  VolumeX,
  Moon,
  FileCheck,
  ArrowLeft,
  CheckCircle2,
  XCircle,
  Sparkles,
  Download,
  ExternalLink,
  Send,
  Eye,
  Compass,
  MapPin,
  Sliders,
  Plus,
  Truck,
  PhoneCall,
  Activity,
  Layers,
  ChevronRight,
  Info
} from 'lucide-react';
import confetti from 'canvas-confetti';
import {
  NETWORK_RAIL_LOW_BRIDGES,
  calculateDynamicBridgeClearance,
  metersToFeetInches,
  feetInchesToMeters,
  LowBridgeItem,
  BridgeStrikeCheckResult
} from '../../services/bridgeStrikeService';
import {
  evaluateTachoStatus,
  SAMPLE_UPCOMING_SERVICES,
  TachoRuleState
} from '../../services/tachoHorizonService';
import {
  INITIAL_EXPENSE_CLAIMS,
  HMRC_NIGHTLY_SUBSISTENCE_RATE_GBP,
  calculateMonthlyTaxSavings,
  OvernightExpenseClaim
} from '../../services/snapExpenseService';
import {
  CARGO_CRIME_INCIDENTS,
  CargoCrimeIncident
} from '../../services/cargoCrimeService';
import { DriverVehicleProfile, DriverLicenceProfile } from '../../types';

export interface DriverSafetyShieldHubProps {
  onBack?: () => void;
  driverVehicle?: DriverVehicleProfile;
  onUpdateDriverVehicle?: (updated: DriverVehicleProfile) => void;
  driverLicenceProfile?: DriverLicenceProfile | null;
  initialTab?: SafetyTabId;
}

export type SafetyTabId =
  | 'BRIDGE_STRIKE'
  | 'TACHO_HORIZON'
  | 'ACCIDENT_PREVENTION'
  | 'SNAP_EXPENSES'
  | 'CARGO_CRIME'
  | 'DEMURRAGE'
  | 'QUIET_SLEEP'
  | 'DIGITAL_CB';

export const DriverSafetyShieldHub: React.FC<DriverSafetyShieldHubProps> = ({
  onBack = () => {},
  driverVehicle = {
    driverName: 'HGV Driver',
    vehicleReg: 'UK-HGV',
    vehicleCategory: '44T_ARTIC_HGV',
    heightMeters: 4.65,
    weightTonnes: 44,
    lengthMeters: 16.5,
    hasTailLift: false
  },
  onUpdateDriverVehicle,
  driverLicenceProfile,
  initialTab = 'BRIDGE_STRIKE'
}) => {
  const [activeTab, setActiveTab] = useState<SafetyTabId>(initialTab);
  const [showToast, setShowToast] = useState<string | null>(null);

  const triggerToast = (msg: string) => {
    setShowToast(msg);
    setTimeout(() => setShowToast(null), 3500);
  };

  // --------------------------------------------------------------------------
  // 1. BRIDGE STRIKE DEFENSE ENGINE STATE
  // --------------------------------------------------------------------------
  const [tractorHeightMeters, setTractorHeightMeters] = useState(4.0);
  const [trailerHeightMeters, setTrailerHeightMeters] = useState(driverVehicle.heightMeters || 4.45);
  const [airSuspensionMode, setAirSuspensionMode] = useState<'NORMAL' | 'DUMPED' | 'RAISED'>('NORMAL');
  const [selectedBridge, setSelectedBridge] = useState<LowBridgeItem>(NETWORK_RAIL_LOW_BRIDGES[1]); // Watford Junction
  const [isHeightDeclared, setIsHeightDeclared] = useState(false);
  const [isLaserArActive, setIsLaserArActive] = useState(false);
  const [horizonDistanceMeters, setHorizonDistanceMeters] = useState(800);

  const bridgeCheckResult: BridgeStrikeCheckResult = calculateDynamicBridgeClearance(
    {
      tractorHeightMeters,
      trailerHeightMeters,
      airSuspensionMode,
      safetyBufferMeters: 0.15
    },
    selectedBridge
  );

  // --------------------------------------------------------------------------
  // 2. TACHO 4.5H HORIZON & INFRINGEMENT SHIELD STATE
  // --------------------------------------------------------------------------
  const [continuousMinutes, setContinuousMinutes] = useState(245); // 4h 05m (Amber alert)
  const [dailyMinutes, setDailyMinutes] = useState(420); // 7h 00m
  const tachoState: TachoRuleState = evaluateTachoStatus(continuousMinutes, dailyMinutes);

  // --------------------------------------------------------------------------
  // 3. ACCIDENT & BLIND SPOT RADAR STATE
  // --------------------------------------------------------------------------
  const [isCyclistInBlindSpot, setIsCyclistInBlindSpot] = useState(true);
  const [tailSwingDegrees, setTailSwingDegrees] = useState(18);

  // --------------------------------------------------------------------------
  // 4. SNAP & HMRC £34.90 EXPENSES STATE
  // --------------------------------------------------------------------------
  const [expenseClaims, setExpenseClaims] = useState<OvernightExpenseClaim[]>(INITIAL_EXPENSE_CLAIMS);
  const [isNewClaimOpen, setIsNewClaimOpen] = useState(false);
  const [newLocation, setNewLocation] = useState('Rothwell Truckstop (A14 J13)');
  const [newCost, setNewCost] = useState('29.50');
  const [newMealVoucher, setNewMealVoucher] = useState('10.00');

  const taxSummary = calculateMonthlyTaxSavings(expenseClaims);

  const handleAddClaim = (e: React.FormEvent) => {
    e.preventDefault();
    const claim: OvernightExpenseClaim = {
      id: `exp-${Date.now()}`,
      date: new Date().toISOString().split('T')[0],
      locationName: newLocation,
      motorway: 'A14 J13',
      vehicleReg: driverVehicle.vehicleReg || 'GN21 JKM',
      parkingCostGbp: parseFloat(newCost) || 30.0,
      paymentMethod: 'SNAP_ACCOUNT',
      snapBookingRef: `SNAP-RT-${Date.now().toString().slice(-5)}`,
      foodVoucherIncluded: true,
      foodVoucherAmountGbp: parseFloat(newMealVoucher) || 10.0,
      hmrcTaxAllowanceGbp: HMRC_NIGHTLY_SUBSISTENCE_RATE_GBP,
      status: 'LOGGED'
    };
    setExpenseClaims([claim, ...expenseClaims]);
    setIsNewClaimOpen(false);
    try {
      confetti({ particleCount: 30, spread: 60 });
    } catch (_e) {}
    triggerToast(`✓ Overnight logged! Added £34.90 HMRC tax allowance.`);
  };

  // --------------------------------------------------------------------------
  // 5. CARGO CRIME & CURTAIN-SLASH RADAR STATE
  // --------------------------------------------------------------------------
  const [selectedCorridor, setSelectedCorridor] = useState<string>('ALL');
  const filteredCrimes = selectedCorridor === 'ALL'
    ? CARGO_CRIME_INCIDENTS
    : CARGO_CRIME_INCIDENTS.filter((c) => c.corridor.toLowerCase().includes(selectedCorridor.toLowerCase()));

  // --------------------------------------------------------------------------
  // 6. DC DEMURRAGE DETENTION TIMER STATE
  // --------------------------------------------------------------------------
  const [demurrageArrivalMinutesAgo, setDemurrageArrivalMinutesAgo] = useState(165); // 2h 45m
  const demurrageFreeLimitMinutes = 120; // 2 hours free
  const demurrageOverstayMinutes = Math.max(0, demurrageArrivalMinutesAgo - demurrageFreeLimitMinutes);
  const demurrageAccruedGbp = Number(((demurrageOverstayMinutes / 60) * 45.0).toFixed(2));

  // --------------------------------------------------------------------------
  // 7. QUIET SLEEP ZONE ACOUSTIC RADAR STATE
  // --------------------------------------------------------------------------
  const [ambientDb, setAmbientDb] = useState(48); // 48 dB (Quiet)
  const [isNearFridgeMotor, setIsNearFridgeMotor] = useState(false);

  // --------------------------------------------------------------------------
  // 8. DIGITAL 5-MILE MESH CB RADIO STATE
  // --------------------------------------------------------------------------
  const [cbChannel, setCbChannel] = useState(19);
  const [cbMessageInput, setCbMessageInput] = useState('');
  const [cbMessages, setCbMessages] = useState([
    { id: '1', sender: 'Lee (Scania 500)', time: '2m ago', ch: 19, text: 'Heads up south on M1 J18, slow moving for roadworks.' },
    { id: '2', sender: 'Dave Higgins (C+E)', time: '5m ago', ch: 19, text: 'Watford Gap has only ~8 bays left near fuel pumps.' }
  ]);

  const handleSendCbMessage = () => {
    if (!cbMessageInput.trim()) return;
    setCbMessages([
      {
        id: Date.now().toString(),
        sender: driverLicenceProfile?.fullName || 'Dave Higgins (GN21 JKM)',
        time: 'Just now',
        ch: cbChannel,
        text: cbMessageInput
      },
      ...cbMessages
    ]);
    setCbMessageInput('');
    triggerToast('✓ Broadcasted to 5-mile cab radio mesh');
  };

  return (
    <div className="w-full max-w-6xl mx-auto space-y-6 pb-16">
      {/* Toast */}
      {showToast && (
        <div className="fixed top-5 right-5 z-50 px-4 py-3 rounded-2xl bg-cyan-500 text-slate-950 font-bold text-xs shadow-2xl flex items-center gap-2 animate-bounce">
          <CheckCircle2 className="w-4 h-4 fill-slate-950 text-cyan-500" />
          <span>{showToast}</span>
        </div>
      )}

      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800 pb-4">
        <div className="flex items-center gap-3">
          <button
            onClick={onBack}
            className="p-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-400 hover:text-white transition-colors cursor-pointer border border-slate-800"
          >
            <ArrowLeft className="w-4 h-4" />
          </button>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl sm:text-2xl font-black text-white">
                Driver Safety, Compliance &amp; Protection Suite
              </h1>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-cyan-500/20 text-cyan-300 font-bold border border-cyan-500/40">
                ACTIVE SHIELD
              </span>
            </div>
            <p className="text-xs text-slate-400">
              Zero Bridge Strikes • Zero Tacho Infringements • Zero Cargo Loss • £34.90/night Tax Shield
            </p>
          </div>
        </div>

        {/* Vehicle Badge */}
        <div className="flex items-center gap-2 px-3 py-2 rounded-2xl bg-slate-900 border border-slate-800 text-xs">
          <Truck className="w-4 h-4 text-cyan-400" />
          <div>
            <div className="font-bold text-white flex items-center gap-1.5">
              <span>{driverVehicle.vehicleReg}</span>
              <span className="text-cyan-400">({metersToFeetInches(trailerHeightMeters)})</span>
            </div>
            <div className="text-[10px] text-slate-400 font-mono">
              Running Clearance: {metersToFeetInches(bridgeCheckResult.runningHeightMeters)}
            </div>
          </div>
        </div>
      </div>

      {/* Navigation Tabs for all 7 Feature Areas */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-1 no-scrollbar p-1.5 rounded-2xl bg-slate-900 border border-slate-800">
        <button
          onClick={() => setActiveTab('BRIDGE_STRIKE')}
          className={`px-3.5 py-2 rounded-xl text-xs font-bold shrink-0 transition-all cursor-pointer flex items-center gap-2 ${
            activeTab === 'BRIDGE_STRIKE'
              ? 'bg-red-500 text-slate-950 font-black shadow-lg shadow-red-500/20'
              : 'text-slate-400 hover:text-white'
          }`}
        >
          <span>🌉</span>
          <span>Bridge Strike Shield</span>
        </button>

        <button
          onClick={() => setActiveTab('TACHO_HORIZON')}
          className={`px-3.5 py-2 rounded-xl text-xs font-bold shrink-0 transition-all cursor-pointer flex items-center gap-2 ${
            activeTab === 'TACHO_HORIZON'
              ? 'bg-amber-500 text-slate-950 font-black shadow-lg shadow-amber-500/20'
              : 'text-slate-400 hover:text-white'
          }`}
        >
          <Clock className="w-3.5 h-3.5" />
          <span>Tacho Horizon &amp; Rest</span>
        </button>

        <button
          onClick={() => setActiveTab('ACCIDENT_PREVENTION')}
          className={`px-3.5 py-2 rounded-xl text-xs font-bold shrink-0 transition-all cursor-pointer flex items-center gap-2 ${
            activeTab === 'ACCIDENT_PREVENTION'
              ? 'bg-cyan-500 text-slate-950 font-black shadow-lg shadow-cyan-500/20'
              : 'text-slate-400 hover:text-white'
          }`}
        >
          <Eye className="w-3.5 h-3.5" />
          <span>Blind-Spots &amp; Hazards</span>
        </button>

        <button
          onClick={() => setActiveTab('SNAP_EXPENSES')}
          className={`px-3.5 py-2 rounded-xl text-xs font-bold shrink-0 transition-all cursor-pointer flex items-center gap-2 ${
            activeTab === 'SNAP_EXPENSES'
              ? 'bg-purple-500 text-slate-950 font-black shadow-lg shadow-purple-500/20'
              : 'text-slate-400 hover:text-white'
          }`}
        >
          <CreditCard className="w-3.5 h-3.5" />
          <span>SNAP &amp; £34.90 Tax</span>
        </button>

        <button
          onClick={() => setActiveTab('CARGO_CRIME')}
          className={`px-3.5 py-2 rounded-xl text-xs font-bold shrink-0 transition-all cursor-pointer flex items-center gap-2 ${
            activeTab === 'CARGO_CRIME'
              ? 'bg-rose-500 text-slate-950 font-black shadow-lg shadow-rose-500/20'
              : 'text-slate-400 hover:text-white'
          }`}
        >
          <ShieldAlert className="w-3.5 h-3.5" />
          <span>Cargo Crime Heatmap</span>
        </button>

        <button
          onClick={() => setActiveTab('DEMURRAGE')}
          className={`px-3.5 py-2 rounded-xl text-xs font-bold shrink-0 transition-all cursor-pointer flex items-center gap-2 ${
            activeTab === 'DEMURRAGE'
              ? 'bg-emerald-500 text-slate-950 font-black shadow-lg shadow-emerald-500/20'
              : 'text-slate-400 hover:text-white'
          }`}
        >
          <span>⏱️</span>
          <span>Demurrage Timer (£45/h)</span>
        </button>

        <button
          onClick={() => setActiveTab('QUIET_SLEEP')}
          className={`px-3.5 py-2 rounded-xl text-xs font-bold shrink-0 transition-all cursor-pointer flex items-center gap-2 ${
            activeTab === 'QUIET_SLEEP'
              ? 'bg-blue-500 text-slate-950 font-black shadow-lg shadow-blue-500/20'
              : 'text-slate-400 hover:text-white'
          }`}
        >
          <Moon className="w-3.5 h-3.5" />
          <span>Quiet Sleep Radar</span>
        </button>

        <button
          onClick={() => setActiveTab('DIGITAL_CB')}
          className={`px-3.5 py-2 rounded-xl text-xs font-bold shrink-0 transition-all cursor-pointer flex items-center gap-2 ${
            activeTab === 'DIGITAL_CB'
              ? 'bg-teal-500 text-slate-950 font-black shadow-lg shadow-teal-500/20'
              : 'text-slate-400 hover:text-white'
          }`}
        >
          <Radio className="w-3.5 h-3.5" />
          <span>5-Mile Mesh CB</span>
        </button>
      </div>

      {/* ========================================================================= */}
      {/* 1. BRIDGE STRIKE DEFENSE ENGINE (CENTRAL FOCUS)                            */}
      {/* ========================================================================= */}
      {activeTab === 'BRIDGE_STRIKE' && (
        <div className="space-y-6 animate-in fade-in duration-200">
          {/* Top Threat Banner */}
          <div
            className={`p-5 rounded-3xl border-2 transition-all ${
              bridgeCheckResult.alertLevel === 'CRITICAL_COLLISION'
                ? 'bg-red-950/80 border-red-500 text-white shadow-2xl shadow-red-500/30'
                : bridgeCheckResult.alertLevel === 'CAUTION'
                ? 'bg-amber-950/80 border-amber-500 text-white shadow-2xl shadow-amber-500/20'
                : 'bg-slate-900 border-emerald-500/40 text-slate-200'
            }`}
          >
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div className="flex items-start gap-4">
                <div
                  className={`w-14 h-14 rounded-2xl flex items-center justify-center font-black text-2xl shrink-0 ${
                    bridgeCheckResult.alertLevel === 'CRITICAL_COLLISION'
                      ? 'bg-red-500 text-slate-950 animate-pulse'
                      : bridgeCheckResult.alertLevel === 'CAUTION'
                      ? 'bg-amber-500 text-slate-950'
                      : 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40'
                  }`}
                >
                  {bridgeCheckResult.alertLevel === 'CRITICAL_COLLISION' ? '🚨' : bridgeCheckResult.alertLevel === 'CAUTION' ? '⚠️' : '🛡️'}
                </div>

                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="text-sm sm:text-base font-black uppercase tracking-wider">
                      {bridgeCheckResult.alertLevel === 'CRITICAL_COLLISION'
                        ? 'CRITICAL BRIDGE COLLISION IMMINENT'
                        : bridgeCheckResult.alertLevel === 'CAUTION'
                        ? 'MARGINAL CLEARANCE CAUTION'
                        : 'CLEARANCE VERIFIED • BRIDGE STRIKE SHIELD ACTIVE'}
                    </span>
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-black/40 border border-white/20 font-bold">
                      {selectedBridge.road} • {selectedBridge.name}
                    </span>
                  </div>

                  <p className="text-xs sm:text-sm text-slate-200 font-medium">
                    {bridgeCheckResult.audioAlertMessage}
                  </p>

                  {bridgeCheckResult.recommendedSuspensionAction && (
                    <div className="p-2 rounded-xl bg-cyan-950/80 border border-cyan-500/40 text-cyan-200 text-xs font-bold flex items-center gap-2 w-fit">
                      <Sliders className="w-4 h-4 text-cyan-400" />
                      <span>{bridgeCheckResult.recommendedSuspensionAction}</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Emergency Hotline for Railway Bridge */}
              <div className="shrink-0 flex flex-col items-end gap-1">
                <div className="text-[10px] font-mono uppercase text-slate-400">Network Rail Emergency Line</div>
                <a
                  href={`tel:${selectedBridge.emergencyPhone}`}
                  className="px-4 py-2 rounded-xl bg-red-600 hover:bg-red-500 text-white font-black text-xs flex items-center gap-2 cursor-pointer shadow-lg shadow-red-600/30"
                >
                  <PhoneCall className="w-4 h-4" />
                  <span>Call {selectedBridge.emergencyPhone}</span>
                </a>
                <span className="text-[10px] font-mono text-slate-400">Bridge ID: {selectedBridge.networkRailBridgeId}</span>
              </div>
            </div>
          </div>

          {/* Interactive Bridge Strike Defense Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Left: Dynamic Air-Suspension Offset & Dual Height Controller */}
            <div className="p-5 rounded-3xl bg-slate-900 border border-slate-800 space-y-5">
              <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                <h3 className="text-sm font-black text-white flex items-center gap-2">
                  <Sliders className="w-4 h-4 text-cyan-400" />
                  <span>Vehicle Height &amp; Suspension Offset</span>
                </h3>
                <span className="text-[10px] font-mono text-cyan-400 bg-cyan-950/60 px-2 py-0.5 rounded border border-cyan-500/30">
                  DVSA Metric &amp; Feet
                </span>
              </div>

              {/* Dual Height Input */}
              <div className="space-y-3">
                <div className="space-y-1">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-slate-300 font-bold">Trailer Running Height:</span>
                    <span className="font-mono text-cyan-400 font-black text-sm">
                      {trailerHeightMeters.toFixed(2)}m ({metersToFeetInches(trailerHeightMeters)})
                    </span>
                  </div>
                  <input
                    type="range"
                    min="3.8"
                    max="5.1"
                    step="0.05"
                    value={trailerHeightMeters}
                    onChange={(e) => {
                      const val = parseFloat(e.target.value);
                      setTrailerHeightMeters(val);
                      if (onUpdateDriverVehicle) {
                        onUpdateDriverVehicle({ ...driverVehicle, heightMeters: val });
                      }
                    }}
                    className="w-full accent-cyan-500 cursor-pointer"
                  />
                  <div className="flex justify-between text-[10px] font-mono text-slate-500">
                    <span>3.80m (12' 6")</span>
                    <span>4.45m Standard (14' 7")</span>
                    <span>4.95m Double Deck (16' 3")</span>
                  </div>
                </div>

                {/* Dynamic Air Suspension Ride Mode */}
                <div className="space-y-2 pt-2 border-t border-slate-800">
                  <div className="text-xs font-bold text-white flex items-center justify-between">
                    <span>Air Suspension Ride Mode:</span>
                    <span
                      className={`text-[10px] font-mono px-2 py-0.5 rounded font-bold ${
                        airSuspensionMode === 'DUMPED'
                          ? 'bg-blue-500/20 text-blue-300 border border-blue-500/30'
                          : airSuspensionMode === 'RAISED'
                          ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                          : 'bg-slate-800 text-slate-300'
                      }`}
                    >
                      {airSuspensionMode === 'DUMPED'
                        ? 'DUMPED (-8cm)'
                        : airSuspensionMode === 'RAISED'
                        ? 'RAISED (+10cm)'
                        : 'NORMAL (0cm)'}
                    </span>
                  </div>

                  <div className="grid grid-cols-3 gap-2">
                    <button
                      type="button"
                      onClick={() => setAirSuspensionMode('DUMPED')}
                      className={`p-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer text-center ${
                        airSuspensionMode === 'DUMPED'
                          ? 'bg-blue-600 text-white shadow-md shadow-blue-600/30'
                          : 'bg-slate-950 text-slate-400 border border-slate-800 hover:text-white'
                      }`}
                    >
                      <div>Dump Air</div>
                      <div className="text-[10px] font-mono">-8 cm</div>
                    </button>

                    <button
                      type="button"
                      onClick={() => setAirSuspensionMode('NORMAL')}
                      className={`p-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer text-center ${
                        airSuspensionMode === 'NORMAL'
                          ? 'bg-emerald-600 text-white shadow-md shadow-emerald-600/30'
                          : 'bg-slate-950 text-slate-400 border border-slate-800 hover:text-white'
                      }`}
                    >
                      <div>Normal Ride</div>
                      <div className="text-[10px] font-mono">0 cm</div>
                    </button>

                    <button
                      type="button"
                      onClick={() => setAirSuspensionMode('RAISED')}
                      className={`p-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer text-center ${
                        airSuspensionMode === 'RAISED'
                          ? 'bg-amber-600 text-white shadow-md shadow-amber-600/30'
                          : 'bg-slate-950 text-slate-400 border border-slate-800 hover:text-white'
                      }`}
                    >
                      <div>Raised</div>
                      <div className="text-[10px] font-mono">+10 cm</div>
                    </button>
                  </div>
                </div>

                {/* Final Total Running Travel Clearance */}
                <div className="p-3.5 rounded-2xl bg-slate-950 border border-slate-800 space-y-1.5">
                  <div className="flex items-center justify-between text-xs text-slate-400">
                    <span>Base Trailer Height:</span>
                    <span className="font-mono text-white">{trailerHeightMeters.toFixed(2)}m</span>
                  </div>
                  <div className="flex items-center justify-between text-xs text-slate-400">
                    <span>Suspension Offset:</span>
                    <span className="font-mono text-cyan-400">
                      {airSuspensionMode === 'RAISED' ? '+0.10m' : airSuspensionMode === 'DUMPED' ? '-0.08m' : '0.00m'}
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-xs text-slate-400">
                    <span>DVSA Mandatory Safety Buffer:</span>
                    <span className="font-mono text-amber-400">+0.15m (6")</span>
                  </div>
                  <div className="flex items-center justify-between text-sm font-black text-white pt-1.5 border-t border-slate-800">
                    <span>Total Required Clearance:</span>
                    <span className="font-mono text-emerald-400">
                      {bridgeCheckResult.requiredClearanceMeters.toFixed(2)}m ({bridgeCheckResult.requiredClearanceFeetInches})
                    </span>
                  </div>
                </div>

                {/* In-Cab Height Declaration Button */}
                <button
                  type="button"
                  onClick={() => {
                    setIsHeightDeclared(true);
                    try {
                      confetti({ particleCount: 30, spread: 60 });
                    } catch (_e) {}
                    triggerToast(`✓ Statutory In-Cab Height Sign-Off confirmed at ${metersToFeetInches(bridgeCheckResult.runningHeightMeters)}.`);
                  }}
                  className={`w-full py-3 rounded-xl text-xs font-black flex items-center justify-center gap-2 cursor-pointer transition-all ${
                    isHeightDeclared
                      ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                      : 'bg-gradient-to-r from-red-600 to-amber-600 hover:from-red-500 hover:to-amber-500 text-white shadow-lg shadow-red-500/20'
                  }`}
                >
                  <ShieldCheck className="w-4 h-4" />
                  <span>
                    {isHeightDeclared
                      ? '✓ In-Cab Height Declared (Statutory Compliant)'
                      : 'Sign-Off In-Cab Height Indicator Board'}
                  </span>
                </button>
              </div>
            </div>

            {/* Middle: Network Rail Low Bridge Database & 3-Stage Horizon Radar */}
            <div className="p-5 rounded-3xl bg-slate-900 border border-slate-800 space-y-4">
              <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                <h3 className="text-sm font-black text-white flex items-center gap-2">
                  <Activity className="w-4 h-4 text-red-400" />
                  <span>Network Rail Low Bridge Radar</span>
                </h3>
                <span className="text-[10px] font-mono text-slate-400">
                  {NETWORK_RAIL_LOW_BRIDGES.length} Monitored Bridges
                </span>
              </div>

              {/* Bridge Selector */}
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-300">Select Test Low Bridge along Route:</label>
                <select
                  value={selectedBridge.id}
                  onChange={(e) => {
                    const br = NETWORK_RAIL_LOW_BRIDGES.find((b) => b.id === e.target.value);
                    if (br) setSelectedBridge(br);
                  }}
                  className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white text-xs font-mono focus:outline-none focus:border-cyan-500"
                >
                  {NETWORK_RAIL_LOW_BRIDGES.map((b) => (
                    <option key={b.id} value={b.id}>
                      {b.road} • {b.name} ({b.clearanceFeetInches} / {b.clearanceMeters}m)
                    </option>
                  ))}
                </select>
              </div>

              {/* 3-Stage In-Cab Horizon Radar Simulator */}
              <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-black text-white uppercase">3-Stage Audio Horizon Warning</span>
                  <span className="font-mono text-xs text-cyan-400 font-bold">{horizonDistanceMeters}m Ahead</span>
                </div>

                <input
                  type="range"
                  min="50"
                  max="1600"
                  step="50"
                  value={horizonDistanceMeters}
                  onChange={(e) => setHorizonDistanceMeters(parseInt(e.target.value))}
                  className="w-full accent-cyan-500 cursor-pointer"
                />

                <div className="grid grid-cols-3 gap-2 text-center text-[10px] font-bold">
                  <div className={`p-2 rounded-lg border ${horizonDistanceMeters > 500 ? 'bg-cyan-950/60 border-cyan-500 text-cyan-300' : 'bg-slate-900 border-slate-800 text-slate-500'}`}>
                    1 Mile Pre-Alert
                  </div>
                  <div className={`p-2 rounded-lg border ${horizonDistanceMeters <= 500 && horizonDistanceMeters > 200 ? 'bg-amber-950/60 border-amber-500 text-amber-300' : 'bg-slate-900 border-slate-800 text-slate-500'}`}>
                    500m Caution
                  </div>
                  <div className={`p-2 rounded-lg border ${horizonDistanceMeters <= 200 ? 'bg-red-950/60 border-red-500 text-red-300 animate-pulse' : 'bg-slate-900 border-slate-800 text-slate-500'}`}>
                    200m STOP HALT
                  </div>
                </div>

                <div className="text-[11px] text-slate-300 p-2.5 rounded-xl bg-slate-900/80 border border-slate-800">
                  {horizonDistanceMeters <= 200 ? (
                    <span className="text-red-400 font-bold">
                      🔴 HORIZON CRITICAL: Vehicle at 200m. Emergency cab warning sound active. Stop vehicle!
                    </span>
                  ) : horizonDistanceMeters <= 500 ? (
                    <span className="text-amber-400 font-bold">
                      🟡 HORIZON CAUTION: Approaching {selectedBridge.name} in 500m. Verify center arch clearance.
                    </span>
                  ) : (
                    <span className="text-cyan-400">
                      🟢 HORIZON ROUTE: Low bridge detected 1 mile ahead. Reroute corridor ready.
                    </span>
                  )}
                </div>
              </div>

              {/* Selected Bridge Intel Card */}
              <div className="p-3.5 rounded-2xl bg-slate-950 border border-slate-800 space-y-1.5 text-xs">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-white">{selectedBridge.name}</span>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-red-500/20 text-red-300 border border-red-500/30">
                    {selectedBridge.historyStrikes} Strikes Recorded
                  </span>
                </div>
                <div className="text-slate-400">{selectedBridge.location} • Type: {selectedBridge.bridgeType}</div>
                <div className="text-amber-300 font-medium pt-1 border-t border-slate-900">
                  {selectedBridge.remedyAction}
                </div>
              </div>
            </div>

            {/* Right: Arched Bridge Haunch vs Crown Diagram & Laser AR Height Reticle */}
            <div className="p-5 rounded-3xl bg-slate-900 border border-slate-800 space-y-4">
              <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                <h3 className="text-sm font-black text-white flex items-center gap-2">
                  <span>🏛️</span>
                  <span>Arched Bridge Haunch Danger Guide</span>
                </h3>
                <span className="text-[10px] font-mono text-amber-400 bg-amber-950/60 px-2 py-0.5 rounded border border-amber-500/30">
                  Haunch vs Crown
                </span>
              </div>

              {/* SVG Visual Arch Haunch Demonstration */}
              <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 flex flex-col items-center">
                <svg viewBox="0 0 300 160" className="w-full h-36">
                  {/* Arch Bridge Brickwork */}
                  <path
                    d="M 20 150 L 20 60 Q 150 10, 280 60 L 280 150"
                    fill="none"
                    stroke="#dc2626"
                    strokeWidth="8"
                    strokeLinecap="round"
                  />
                  {/* Roadway Surface */}
                  <line x1="10" y1="150" x2="290" y2="150" stroke="#64748b" strokeWidth="4" />
                  
                  {/* Center White Line */}
                  <line x1="150" y1="150" x2="150" y2="135" stroke="#f8fafc" strokeWidth="3" strokeDasharray="6 4" />
                  
                  {/* Crown Clearance Measurement */}
                  <line x1="150" y1="36" x2="150" y2="148" stroke="#10b981" strokeWidth="2" strokeDasharray="3 3" />
                  <circle cx="150" cy="36" r="4" fill="#10b981" />
                  <text x="150" y="80" fill="#34d399" fontSize="10" fontWeight="bold" textAnchor="middle">
                    Crown: 4.45m (14' 7")
                  </text>

                  {/* Kerbside Haunch Measurement (The Trap!) */}
                  <line x1="50" y1="88" x2="50" y2="148" stroke="#ef4444" strokeWidth="2" strokeDasharray="3 3" />
                  <circle cx="50" cy="88" r="4" fill="#ef4444" />
                  <text x="50" y="125" fill="#f87171" fontSize="9" fontWeight="bold" textAnchor="middle">
                    Haunch: 3.85m
                  </text>

                  {/* Truck Silhouette in center lane */}
                  <rect x="125" y="65" width="50" height="85" fill="#0284c7" opacity="0.6" rx="4" />
                  <text x="150" y="110" fill="#ffffff" fontSize="9" fontWeight="bold" textAnchor="middle">
                    HGV Cab
                  </text>
                </svg>

                <div className="w-full text-left space-y-1.5 pt-2 text-[11px] text-slate-300">
                  <div className="font-bold text-amber-400">⚠️ Why 80% of UK bridge strikes occur on arches:</div>
                  <p className="text-slate-400 text-[11px] leading-relaxed">
                    The bridge plate states maximum crown height (e.g. 14' 7"), but near the kerb the arch curves down to 12' 7". Passing on the left causes top-corner trailer peel. Drivers must straddle the white line safely or divert.
                  </p>
                </div>
              </div>

              {/* Laser AR Camera Reticle Mode */}
              <button
                type="button"
                onClick={() => {
                  setIsLaserArActive(!isLaserArActive);
                  if (!isLaserArActive) {
                    triggerToast('📷 Laser AR Height Scanner Active — align crosshairs with trailer top rail.');
                  }
                }}
                className="w-full py-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs flex items-center justify-center gap-2 cursor-pointer border border-slate-700"
              >
                <Compass className="w-4 h-4 text-cyan-400" />
                <span>{isLaserArActive ? 'Close Laser AR Reticle' : 'Launch Laser AR Camera Height Checker'}</span>
              </button>

              {isLaserArActive && (
                <div className="p-4 rounded-2xl bg-black border-2 border-cyan-500 space-y-2 text-center animate-in zoom-in-95 duration-200">
                  <div className="text-[10px] font-mono text-cyan-400 uppercase">AR Optical Reticle Active</div>
                  <div className="h-24 rounded-xl border border-cyan-500/40 relative flex items-center justify-center bg-cyan-950/20">
                    <div className="w-full border-t border-dashed border-red-500 absolute" />
                    <div className="h-full border-l border-dashed border-red-500 absolute" />
                    <span className="text-xs font-mono font-bold text-white bg-slate-950/80 px-2 py-1 rounded z-10">
                      Optical Height Confirmed: {trailerHeightMeters.toFixed(2)}m
                    </span>
                  </div>
                  <div className="text-[10px] text-slate-400">Matched against ISO 17712 bulkhead plate &amp; pneumatic sensors.</div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 2. TACHO 4.5H HORIZON & PROACTIVE REST MATCHER                             */}
      {/* ========================================================================= */}
      {activeTab === 'TACHO_HORIZON' && (
        <div className="space-y-6 animate-in fade-in duration-200">
          <div className="p-5 rounded-3xl bg-slate-900 border border-slate-800 space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <h3 className="text-base font-black text-white flex items-center gap-2">
                  <Clock className="w-5 h-5 text-amber-400" />
                  <span>EU Regulation 561/2006 Tachograph Compliance Shield</span>
                </h3>
                <p className="text-xs text-slate-400">
                  Live countdown to 4.5h continuous driving cutoff with proactive space-verified rest stop matching.
                </p>
              </div>

              <span
                className={`text-xs font-mono font-bold px-3 py-1.5 rounded-xl border ${
                  tachoState.status === 'INFRINGED'
                    ? 'bg-red-500/20 text-red-300 border-red-500/40'
                    : tachoState.status === 'CRITICAL_REST_REQUIRED'
                    ? 'bg-red-500/20 text-red-300 border-red-500/40'
                    : tachoState.status === 'BREAK_DUE_SOON'
                    ? 'bg-amber-500/20 text-amber-300 border-amber-500/40'
                    : 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40'
                }`}
              >
                {tachoState.status.replace(/_/g, ' ')}
              </span>
            </div>

            {/* Continuous Drive Clocks */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
              <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-1">
                <span className="text-[10px] font-mono text-slate-400 uppercase">Continuous Driving</span>
                <div className="text-2xl font-black text-white">
                  {Math.floor(continuousMinutes / 60)}h {(continuousMinutes % 60).toString().padStart(2, '0')}m
                </div>
                <div className="text-xs font-bold text-amber-400">
                  {tachoState.remainingContinuousMinutes}m Remaining until 4.5h Cutoff
                </div>
              </div>

              <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-1">
                <span className="text-[10px] font-mono text-slate-400 uppercase">Daily Driving Duty</span>
                <div className="text-2xl font-black text-white">
                  {Math.floor(dailyMinutes / 60)}h {(dailyMinutes % 60).toString().padStart(2, '0')}m
                </div>
                <div className="text-xs font-bold text-emerald-400">
                  {tachoState.remainingDailyMinutes}m Remaining (9h standard limit)
                </div>
              </div>

              <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-1">
                <span className="text-[10px] font-mono text-slate-400 uppercase">Split Break Strategy</span>
                <div className="text-sm font-bold text-white flex items-center gap-2 pt-1">
                  <span className="px-2 py-0.5 rounded bg-slate-900 border border-slate-700 text-xs">
                    Break 1: 15 min
                  </span>
                  <span>+</span>
                  <span className="px-2 py-0.5 rounded bg-slate-900 border border-slate-700 text-xs">
                    Break 2: 30 min
                  </span>
                </div>
                <div className="text-[11px] text-slate-400">
                  Must be taken strictly in 15m + 30m order under EU rules.
                </div>
              </div>
            </div>

            {/* Simulated Driver Controller */}
            <div className="p-3.5 rounded-2xl bg-slate-950 border border-slate-800 flex flex-wrap items-center justify-between gap-3 text-xs">
              <span className="text-slate-300 font-bold">Simulate Drive Clock Time:</span>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setContinuousMinutes(180)}
                  className="px-3 py-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 text-slate-300 font-bold"
                >
                  Reset to 3h 00m
                </button>
                <button
                  type="button"
                  onClick={() => setContinuousMinutes(245)}
                  className="px-3 py-1.5 rounded-lg bg-amber-500/20 text-amber-300 font-bold border border-amber-500/30"
                >
                  Amber (4h 05m)
                </button>
                <button
                  type="button"
                  onClick={() => setContinuousMinutes(275)}
                  className="px-3 py-1.5 rounded-lg bg-red-500/20 text-red-300 font-bold border border-red-500/30"
                >
                  Infringed (4h 35m)
                </button>
              </div>
            </div>

            {/* Proactive Rest Stop Matcher */}
            <div className="space-y-3 pt-2">
              <div className="flex items-center justify-between">
                <h4 className="text-xs font-black text-white uppercase tracking-wider">
                  Upcoming Rest Stops Reachable Before 4.5h Cutoff
                </h4>
                <span className="text-[10px] font-mono text-cyan-400">Cross-Referenced with Live Crowd Radar</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {SAMPLE_UPCOMING_SERVICES.map((stop) => (
                  <div
                    key={stop.siteId}
                    className={`p-3.5 rounded-2xl border transition-all ${
                      stop.isReachableBeforeTachoExpiry
                        ? 'bg-slate-950 border-slate-800 hover:border-cyan-500/50'
                        : 'bg-slate-950/40 border-red-900/40 opacity-60'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-white text-xs">{stop.name}</span>
                      <span
                        className={`text-[9px] font-mono font-bold px-2 py-0.5 rounded-full ${
                          stop.occupancyStatus === 'SPACES_AVAILABLE'
                            ? 'bg-emerald-500/20 text-emerald-300'
                            : stop.occupancyStatus === 'BUSY_FILLING_FAST'
                            ? 'bg-amber-500/20 text-amber-300'
                            : 'bg-red-500/20 text-red-300'
                        }`}
                      >
                        {stop.occupancyStatus === 'SPACES_AVAILABLE'
                          ? `🟢 ${stop.availableBays} bays free`
                          : stop.occupancyStatus === 'BUSY_FILLING_FAST'
                          ? `🟡 Tight (${stop.availableBays} left)`
                          : '🔴 Full'}
                      </span>
                    </div>

                    <div className="flex items-center justify-between text-[11px] text-slate-400 pt-1">
                      <span>{stop.motorway} • {stop.distanceMiles} mi ({stop.driveTimeMinutes} mins)</span>
                      <span className="text-amber-400 font-bold">{stop.overallRating}★</span>
                    </div>

                    <div className="pt-2 flex items-center justify-between text-[11px]">
                      {stop.isReachableBeforeTachoExpiry ? (
                        <span className="text-emerald-400 font-bold flex items-center gap-1">
                          <CheckCircle2 className="w-3 h-3" />
                          <span>Reachable with {tachoState.remainingContinuousMinutes - stop.driveTimeMinutes}m tacho safety margin</span>
                        </span>
                      ) : (
                        <span className="text-red-400 font-bold flex items-center gap-1">
                          <XCircle className="w-3 h-3" />
                          <span>EXCEEDS 4.5H TACHO LIMIT (DO NOT ATTEMPT)</span>
                        </span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 3. ACCIDENT & BLIND-SPOT PREVENTION SHIELD                                 */}
      {/* ========================================================================= */}
      {activeTab === 'ACCIDENT_PREVENTION' && (
        <div className="space-y-6 animate-in fade-in duration-200">
          <div className="p-5 rounded-3xl bg-slate-900 border border-slate-800 space-y-4">
            <h3 className="text-base font-black text-white flex items-center gap-2">
              <Eye className="w-5 h-5 text-cyan-400" />
              <span>Accident Prevention &amp; Class V/VI Blind Spot Proximity Shield</span>
            </h3>
            <p className="text-xs text-slate-400">
              Direct Vision Standard (DVS) compliance radar, left-turn cyclist detection, and trailer tail-swing warnings.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Cyclist Left-Turn Radar */}
              <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-black text-white uppercase">Left-Turn Cyclist Proximity</span>
                  <span className="px-2 py-0.5 rounded bg-red-500/20 text-red-300 font-mono text-[10px] font-bold">
                    Class V / VI Mirror Blind Zone
                  </span>
                </div>

                <div className="p-4 rounded-xl bg-red-950/30 border border-red-500/40 text-center space-y-2">
                  <div className="text-3xl">🚴‍♂️ 🚨</div>
                  <div className="text-xs font-bold text-red-300">
                    CYCLIST DETECTED ON PASSENGER FLANK (0.8m)
                  </div>
                  <p className="text-[11px] text-slate-300">
                    In-cab acoustic horn triggered. Do not initiate left turn until cyclist clears nearside front bumper.
                  </p>
                </div>
              </div>

              {/* Rear Apron Tail-Swing Clearance */}
              <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-black text-white uppercase">Articulated Rear Tail-Swing Angle</span>
                  <span className="font-mono text-cyan-400 font-bold text-xs">{tailSwingDegrees}° Swing</span>
                </div>

                <input
                  type="range"
                  min="0"
                  max="45"
                  value={tailSwingDegrees}
                  onChange={(e) => setTailSwingDegrees(parseInt(e.target.value))}
                  className="w-full accent-cyan-500 cursor-pointer"
                />

                <div className="p-3 rounded-xl bg-slate-900 border border-slate-800 text-xs text-slate-300 space-y-1">
                  <div className="font-bold text-white flex items-center justify-between">
                    <span>Overhang Projection:</span>
                    <span className="font-mono text-amber-400">
                      {((tailSwingDegrees / 45) * 1.2).toFixed(2)}m outside turn arc
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-400">
                    On full lock turns, articulated trailer rear out-swings by up to 1.2 meters. Keep 1.5m clearance from parked vehicles.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 4. SNAP & HMRC £34.90 TAX ALLOWANCE LOGGER                                */}
      {/* ========================================================================= */}
      {activeTab === 'SNAP_EXPENSES' && (
        <div className="space-y-6 animate-in fade-in duration-200">
          <div className="p-5 rounded-3xl bg-slate-900 border border-slate-800 space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <h3 className="text-base font-black text-white flex items-center gap-2">
                  <CreditCard className="w-5 h-5 text-purple-400" />
                  <span>SNAP Account &amp; HMRC £34.90 Overnight Tax Allowance Tracker</span>
                </h3>
                <p className="text-xs text-slate-400">
                  HMRC allows commercial drivers a tax-free subsistence allowance of <strong>£34.90 per night</strong> spent sleeping in the cab.
                </p>
              </div>

              <button
                type="button"
                onClick={() => setIsNewClaimOpen(!isNewClaimOpen)}
                className="px-4 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs flex items-center gap-1.5 cursor-pointer shadow-md shadow-purple-600/30"
              >
                <Plus className="w-4 h-4" />
                <span>Log Overnight Stay</span>
              </button>
            </div>

            {/* Monthly Tax Relief Summary Cards */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <div className="p-3.5 rounded-2xl bg-slate-950 border border-slate-800">
                <span className="text-[10px] font-mono text-slate-400 uppercase">Nights Logged</span>
                <div className="text-xl font-black text-white">{taxSummary.totalNights} Nights</div>
              </div>

              <div className="p-3.5 rounded-2xl bg-slate-950 border border-slate-800">
                <span className="text-[10px] font-mono text-slate-400 uppercase">HMRC Tax-Free Allowance</span>
                <div className="text-xl font-black text-purple-400">£{taxSummary.totalHmrcTaxAllowance.toFixed(2)}</div>
              </div>

              <div className="p-3.5 rounded-2xl bg-slate-950 border border-slate-800">
                <span className="text-[10px] font-mono text-slate-400 uppercase">Est. Tax Cash Savings</span>
                <div className="text-xl font-black text-emerald-400">£{taxSummary.estimatedDriverTaxSavings.toFixed(2)}</div>
              </div>

              <div className="p-3.5 rounded-2xl bg-slate-950 border border-slate-800">
                <span className="text-[10px] font-mono text-slate-400 uppercase">Parking Fees Paid</span>
                <div className="text-xl font-black text-cyan-400">£{taxSummary.totalParkingPaid.toFixed(2)}</div>
              </div>
            </div>

            {/* New Claim Modal / Form */}
            {isNewClaimOpen && (
              <form onSubmit={handleAddClaim} className="p-4 rounded-2xl bg-slate-950 border border-purple-500/40 space-y-3">
                <div className="text-xs font-black uppercase text-purple-300">Log Overnight Truckstop / Layby Stay</div>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div>
                    <label className="text-xs text-slate-300 font-bold">Location / Services:</label>
                    <input
                      type="text"
                      value={newLocation}
                      onChange={(e) => setNewLocation(e.target.value)}
                      className="w-full px-3 py-1.5 rounded-xl bg-slate-900 border border-slate-800 text-white text-xs mt-1"
                    />
                  </div>
                  <div>
                    <label className="text-xs text-slate-300 font-bold">Parking Cost (£):</label>
                    <input
                      type="number"
                      step="0.5"
                      value={newCost}
                      onChange={(e) => setNewCost(e.target.value)}
                      className="w-full px-3 py-1.5 rounded-xl bg-slate-900 border border-slate-800 text-white text-xs mt-1"
                    />
                  </div>
                  <div>
                    <label className="text-xs text-slate-300 font-bold">Food Voucher Value (£):</label>
                    <input
                      type="number"
                      step="0.5"
                      value={newMealVoucher}
                      onChange={(e) => setNewMealVoucher(e.target.value)}
                      className="w-full px-3 py-1.5 rounded-xl bg-slate-900 border border-slate-800 text-white text-xs mt-1"
                    />
                  </div>
                </div>

                <div className="flex justify-end gap-2 pt-2">
                  <button
                    type="button"
                    onClick={() => setIsNewClaimOpen(false)}
                    className="px-3 py-1.5 rounded-xl bg-slate-900 text-slate-400 text-xs font-bold"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-1.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs"
                  >
                    Save &amp; Claim £34.90
                  </button>
                </div>
              </form>
            )}

            {/* Claims Table */}
            <div className="space-y-2">
              {expenseClaims.map((claim) => (
                <div
                  key={claim.id}
                  className="p-3.5 rounded-2xl bg-slate-950 border border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs"
                >
                  <div className="space-y-0.5">
                    <div className="font-bold text-white flex items-center gap-2">
                      <span>{claim.locationName}</span>
                      <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-purple-500/20 text-purple-300">
                        {claim.paymentMethod.replace(/_/g, ' ')}
                      </span>
                    </div>
                    <div className="text-[11px] text-slate-400">
                      Date: {claim.date} • Reg: {claim.vehicleReg} • Ref: {claim.snapBookingRef || 'N/A'}
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <div className="text-right">
                      <div className="font-black text-white">£{claim.parkingCostGbp.toFixed(2)}</div>
                      <div className="text-[10px] text-emerald-400 font-bold">+£34.90 HMRC Tax Relief</div>
                    </div>

                    <button
                      onClick={() => triggerToast(`✓ Exported ${claim.locationName} claim to company payroll PDF.`)}
                      className="p-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-300 cursor-pointer"
                      title="Download receipt pack"
                    >
                      <Download className="w-4 h-4 text-cyan-400" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 5. UK CARGO CRIME & CURTAIN-SLASH THREAT ALERT HEATMAP                      */}
      {/* ========================================================================= */}
      {activeTab === 'CARGO_CRIME' && (
        <div className="space-y-6 animate-in fade-in duration-200">
          <div className="p-5 rounded-3xl bg-slate-900 border border-slate-800 space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <h3 className="text-base font-black text-white flex items-center gap-2">
                  <ShieldAlert className="w-5 h-5 text-rose-500" />
                  <span>UK Cargo Crime &amp; Nocturnal Curtain-Slash Threat Heatmap</span>
                </h3>
                <p className="text-xs text-slate-400">
                  Real-time threat radar tracking organized fuel theft, curtain slashing, and seal tampering across UK trunks.
                </p>
              </div>

              <div className="flex items-center gap-1.5 p-1 rounded-xl bg-slate-950 border border-slate-800 text-xs">
                {['ALL', 'M1', 'A14', 'M6', 'M25'].map((corr) => (
                  <button
                    key={corr}
                    onClick={() => setSelectedCorridor(corr)}
                    className={`px-2.5 py-1 rounded-lg font-bold transition-all cursor-pointer ${
                      selectedCorridor === corr
                        ? 'bg-rose-600 text-white'
                        : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    {corr}
                  </button>
                ))}
              </div>
            </div>

            <div className="space-y-3">
              {filteredCrimes.map((crime) => (
                <div
                  key={crime.id}
                  className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-2 hover:border-rose-500/50 transition-all"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-black text-white">{crime.road} • {crime.location}</span>
                      <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-rose-500/20 text-rose-300 font-bold border border-rose-500/30">
                        {crime.incidentType.replace(/_/g, ' ')}
                      </span>
                    </div>
                    <span className="text-[10px] font-mono text-slate-400">{crime.date}</span>
                  </div>

                  <p className="text-xs text-slate-300">{crime.description}</p>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-2 border-t border-slate-900 text-[11px]">
                    <div className="text-amber-300">
                      <strong>Defensive Cab Tip:</strong> {crime.preventativeTip}
                    </div>
                    <div className="text-emerald-400">
                      <strong>Guarded Alternative:</strong> {crime.recommendedSecureAlternative}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 6. DC DEMURRAGE DETENTION AUTO-BILLING TIMER (£45/H)                        */}
      {/* ========================================================================= */}
      {activeTab === 'DEMURRAGE' && (
        <div className="space-y-6 animate-in fade-in duration-200">
          <div className="p-5 rounded-3xl bg-slate-900 border border-slate-800 space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <h3 className="text-base font-black text-white flex items-center gap-2">
                  <span>⏱️</span>
                  <span>DC Demurrage Detention Auto-Billing Timer (£45.00/Hour)</span>
                </h3>
                <p className="text-xs text-slate-400">
                  Automated geofenced detention clock. Recovers lost earnings when warehouses exceed the 2-hour loading window.
                </p>
              </div>

              <span className="px-3 py-1.5 rounded-xl bg-emerald-500/20 text-emerald-300 font-mono text-xs font-bold border border-emerald-500/40">
                RHA / FTA SOP-OPS-014 Standard
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-1">
                <span className="text-[10px] font-mono text-slate-400 uppercase">Total Dwell at DC</span>
                <div className="text-2xl font-black text-white">
                  {Math.floor(demurrageArrivalMinutesAgo / 60)}h {(demurrageArrivalMinutesAgo % 60).toString().padStart(2, '0')}m
                </div>
                <div className="text-xs text-slate-400">Free Allowance: 2 Hours</div>
              </div>

              <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-1">
                <span className="text-[10px] font-mono text-slate-400 uppercase">Detention Overstay</span>
                <div className="text-2xl font-black text-amber-400">
                  {Math.floor(demurrageOverstayMinutes / 60)}h {(demurrageOverstayMinutes % 60).toString().padStart(2, '0')}m
                </div>
                <div className="text-xs text-amber-300 font-bold">Billable at £45.00/hr + VAT</div>
              </div>

              <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-1">
                <span className="text-[10px] font-mono text-slate-400 uppercase">Accrued Detention Claim</span>
                <div className="text-2xl font-black text-emerald-400">£{demurrageAccruedGbp.toFixed(2)}</div>
                <div className="text-[11px] text-emerald-300 font-mono">+ VAT (Auto-Invoice Ready)</div>
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => {
                  try {
                    confetti({ particleCount: 40, spread: 60 });
                  } catch (_e) {}
                  triggerToast(`✓ Generated £${demurrageAccruedGbp.toFixed(2)} Demurrage PDF Invoice with GPS timestamps.`);
                }}
                className="px-5 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black text-xs flex items-center gap-2 cursor-pointer shadow-lg shadow-emerald-500/20"
              >
                <Download className="w-4 h-4 fill-slate-950" />
                <span>Generate Official Demurrage Claim PDF</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 7. QUIET SLEEP ZONE ACOUSTIC RADAR                                         */}
      {/* ========================================================================= */}
      {activeTab === 'QUIET_SLEEP' && (
        <div className="space-y-6 animate-in fade-in duration-200">
          <div className="p-5 rounded-3xl bg-slate-900 border border-slate-800 space-y-4">
            <h3 className="text-base font-black text-white flex items-center gap-2">
              <Moon className="w-5 h-5 text-blue-400" />
              <span>Quiet Sleep Zone Acoustic Radar</span>
            </h3>
            <p className="text-xs text-slate-400">
              Protects driver REM sleep during 9h/11h daily rest by segregating ambient trailers from noisy diesel fridge motors.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-black text-white uppercase">Cab Ambient Sound Level</span>
                  <span className="font-mono text-cyan-400 font-bold text-sm">{ambientDb} dB</span>
                </div>

                <div className="w-full h-3 rounded-full bg-slate-900 overflow-hidden">
                  <div
                    className={`h-full rounded-full transition-all ${
                      ambientDb > 65 ? 'bg-red-500' : ambientDb > 50 ? 'bg-amber-500' : 'bg-emerald-500'
                    }`}
                    style={{ width: `${(ambientDb / 100) * 100}%` }}
                  />
                </div>

                <div className="text-[11px] text-slate-300">
                  {ambientDb <= 50 ? (
                    <span className="text-emerald-400 font-bold">✓ Optimum Sleep Zone (Duck Pond / Perimeter Row)</span>
                  ) : (
                    <span className="text-amber-400 font-bold">⚠️ High Noise: Highway lane or fridge motor running nearby</span>
                  )}
                </div>
              </div>

              <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-2 text-xs">
                <div className="font-bold text-white">Recommended Rest Area Bays:</div>
                <div className="space-y-1.5 text-slate-300">
                  <div className="p-2 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-between">
                    <span>Tebay M6 J38 — Duck Pond Perimeter</span>
                    <span className="text-emerald-400 font-mono font-bold">42 dB (Dead Quiet)</span>
                  </div>
                  <div className="p-2 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-between">
                    <span>Formula Services M53 J8 — Quiet Lounge Flank</span>
                    <span className="text-emerald-400 font-mono font-bold">45 dB</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 8. DIGITAL 5-MILE MESH CB RADIO                                           */}
      {/* ========================================================================= */}
      {activeTab === 'DIGITAL_CB' && (
        <div className="space-y-6 animate-in fade-in duration-200">
          <div className="p-5 rounded-3xl bg-slate-900 border border-slate-800 space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <h3 className="text-base font-black text-white flex items-center gap-2">
                  <Radio className="w-5 h-5 text-teal-400" />
                  <span>Digital 5-Mile Cab-to-Cab Mesh CB Radio</span>
                </h3>
                <p className="text-xs text-slate-400">
                  Low-latency local mesh voice &amp; text communications between HGVs within a 5-mile radius.
                </p>
              </div>

              <div className="flex items-center gap-1.5 p-1 rounded-xl bg-slate-950 border border-slate-800 text-xs">
                {[19, 9, 14, 27].map((ch) => (
                  <button
                    key={ch}
                    onClick={() => setCbChannel(ch)}
                    className={`px-3 py-1 rounded-lg font-bold transition-all cursor-pointer ${
                      cbChannel === ch
                        ? 'bg-teal-500 text-slate-950'
                        : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    CH {ch.toString().padStart(2, '0')}
                  </button>
                ))}
              </div>
            </div>

            {/* Chat Feed */}
            <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-3 max-h-72 overflow-y-auto">
              {cbMessages.map((msg) => (
                <div key={msg.id} className="p-2.5 rounded-xl bg-slate-900/80 border border-slate-800 space-y-0.5 text-xs">
                  <div className="flex items-center justify-between text-[10px] font-mono text-slate-400">
                    <strong className="text-teal-400">{msg.sender} (CH {msg.ch})</strong>
                    <span>{msg.time}</span>
                  </div>
                  <p className="text-slate-200">{msg.text}</p>
                </div>
              ))}
            </div>

            {/* Input Bar */}
            <div className="flex items-center gap-2">
              <input
                type="text"
                value={cbMessageInput}
                onChange={(e) => setCbMessageInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSendCbMessage()}
                placeholder={`Broadcast to CH ${cbChannel} (5-mile radius)...`}
                className="flex-1 px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white text-xs placeholder:text-slate-600 focus:outline-none focus:border-teal-500"
              />
              <button
                type="button"
                onClick={handleSendCbMessage}
                className="px-4 py-2.5 rounded-xl bg-teal-500 hover:bg-teal-400 text-slate-950 font-bold text-xs flex items-center gap-1.5 cursor-pointer"
              >
                <Send className="w-4 h-4 fill-slate-950" />
                <span>Transmit</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DriverSafetyShieldHub;
