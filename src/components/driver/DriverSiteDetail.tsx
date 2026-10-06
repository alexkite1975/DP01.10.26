'use client';
import React, { useState, useEffect, useRef } from 'react';
import {
  ArrowLeft,
  ScanLine,
  Unlock,
  Volume2,
  VolumeX,
  Video,
  AlertTriangle,
  CheckCircle2,
  ShieldAlert,
  ShieldCheck,
  Lock,
  Radio,
  Phone,
  Clock,
  Truck,
  Layers,
  MapPin,
  Sparkles,
  Navigation,
  FileSpreadsheet,
  AlertCircle,
  Camera,
  Play,
  Share2,
  Eye,
  Printer,
  FileCheck,
  ExternalLink,
  Gauge,
  Mic,
  Copy,
  Check,
  ChevronDown,
  Compass
} from 'lucide-react';
import {
  SiteRiskAssessment,
  DriverVehicleProfile,
  RiskLevel,
  SitePlanData,
  PreferredNavApp
} from '../types';
import { tts } from '../services/ttsService';
import { formatHeightBoth } from '../../utils/heightUtils';
import { SitePlanAnnotator } from '../manager/SitePlanAnnotator';
import { StreetViewGateModal } from '../shared/StreetViewGateModal';
import { PrintableGatePassModal } from './PrintableGatePassModal';
import { InCabVoiceCopilotModal } from './InCabVoiceCopilotModal';
import { InMotionDriverHudModal } from './InMotionDriverHudModal';
import { scanNearbySensitivities } from '../services/googlePlaces';
import {
  generateNavUrl,
  NAV_APP_OPTIONS,
  evaluateRouteClearanceAdvisory
} from '../services/navigationService';

interface DriverSiteDetailProps {
  site: SiteRiskAssessment;
  driverVehicle: DriverVehicleProfile;
  onBack: () => void;
  onOpenVideoGuide: () => void;
  onOpenObservationModal: () => void;
  onUpdateSitePlan?: (siteId: string, updatedPlan: SitePlanData) => void;
  onOpenVoiceCopilot?: () => void;
  onOpenInMotionHud?: () => void;
  onOpenThreeTapAudit?: () => void;
  onOpenInductionGatekeeper?: () => void;
  onOpenAROverlay?: () => void;
  onOpenCongestionTracker?: () => void;
  onOpenTachographScanner?: () => void;
}

export const DriverSiteDetail: React.FC<DriverSiteDetailProps> = ({
  site,
  driverVehicle,
  onBack,
  onOpenVideoGuide,
  onOpenObservationModal,
  onUpdateSitePlan,
  onOpenVoiceCopilot,
  onOpenInMotionHud,
  onOpenThreeTapAudit,
  onOpenInductionGatekeeper,
  onOpenAROverlay,
  onOpenCongestionTracker,
  onOpenTachographScanner
}) => {
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);
  const [activeTab, setActiveTab] = useState<'RULES' | 'SITE_PLAN' | 'DRIVER_NOTES'>('RULES');
  const [simulatedGeofenceTriggered, setSimulatedGeofenceTriggered] = useState(false);
  const [showStreetView, setShowStreetView] = useState(false);
  const [showPrintPass, setShowPrintPass] = useState(false);
  const [showVoiceCopilot, setShowVoiceCopilot] = useState(false);
  const [showInMotionHud, setShowInMotionHud] = useState(false);
  const [showToolsMenu, setShowToolsMenu] = useState(false);
  const [showNavDropdown, setShowNavDropdown] = useState(false);
  const [isCopiedPin, setIsCopiedPin] = useState(false);
  const [isCached, setIsCached] = useState(site.isOfflineCached || false);
  const [cacheNotification, setCacheNotification] = useState<string | null>(null);

  const toolsMenuRef = useRef<HTMLDivElement>(null);
  const navDropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    return tts.subscribe((speaking) => {
      setIsPlayingAudio(speaking);
    });
  }, []);

  // Close menus when clicking outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (toolsMenuRef.current && !toolsMenuRef.current.contains(e.target as Node)) {
        setShowToolsMenu(false);
      }
      if (navDropdownRef.current && !navDropdownRef.current.contains(e.target as Node)) {
        setShowNavDropdown(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleToggleOfflineCache = () => {
    const nextState = !isCached;
    setIsCached(nextState);
    try {
      const cachedSitesRaw = localStorage.getItem('DRIVER_OFFLINE_SITES') || '[]';
      let cachedSites = JSON.parse(cachedSitesRaw);
      if (nextState) {
        if (!cachedSites.includes(site.id)) {
          cachedSites.push(site.id);
        }
        localStorage.setItem(`SITE_CACHE_${site.id}`, JSON.stringify(site));
        setCacheNotification('✓ Saved to Cab Storage');
      } else {
        cachedSites = cachedSites.filter((id: string) => id !== site.id);
        localStorage.removeItem(`SITE_CACHE_${site.id}`);
        setCacheNotification('Removed from offline cache');
      }
      localStorage.setItem('DRIVER_OFFLINE_SITES', JSON.stringify(cachedSites));
      setTimeout(() => setCacheNotification(null), 3000);
    } catch (e) {
      console.warn('Cache error:', e);
    }
  };

  const handleCopyPin = () => {
    if (!site.businessSection.gateSecurityCode) return;
    navigator.clipboard?.writeText(site.businessSection.gateSecurityCode);
    setIsCopiedPin(true);
    setTimeout(() => setIsCopiedPin(false), 2500);
  };

  // Check vehicle compatibility & route advisory
  const vehicleConstraints = site.businessSection.vehicleConstraints;
  const isHeightViolation = driverVehicle.heightMeters > vehicleConstraints.maxHeightMeters;
  const isWeightViolation = driverVehicle.weightTonnes > vehicleConstraints.maxWeightTonnes;
  const isWidthViolation = Boolean(
    vehicleConstraints.maxWidthMeters && (driverVehicle.widthMeters || 2.55) > vehicleConstraints.maxWidthMeters
  );
  const isTailLiftViolation = vehicleConstraints.tailLiftRequired && !driverVehicle.hasTailLift;
  const hasVehicleConflict = isHeightViolation || isWeightViolation || isTailLiftViolation || isWidthViolation;

  const routeAdvisory = evaluateRouteClearanceAdvisory(driverVehicle, site);
  const activeNavOption = NAV_APP_OPTIONS[driverVehicle.preferredNavApp || 'GOOGLE_MAPS'];

  // Check current time window hazards
  const now = new Date();
  const currentHoursMins = `${String(now.getHours()).padStart(2, '0')}:${String(
    now.getMinutes()
  ).padStart(2, '0')}`;
  const activeTimeWindowHazards = site.businessSection.timeWindowHazards.filter(
    (h) => currentHoursMins >= h.timeStart && currentHoursMins <= h.timeEnd
  );

  // Hands-free audio briefing synthesis
  const handlePlayFullAudioBriefing = () => {
    if (isPlayingAudio) {
      tts.stop();
      return;
    }

    const script = `Delivery site briefing for ${site.title}.
Address: ${site.address}.
Overall Risk Level: ${site.overallRiskLevel}.
Vehicle clearance: Maximum height is ${vehicleConstraints.maxHeightMeters} meters. Maximum weight is ${vehicleConstraints.maxWeightTonnes} tonnes.
${hasVehicleConflict ? 'Warning: Your current vehicle profile exceeds site limits!' : 'Vehicle profile verified compatible.'}
Access Procedure: ${site.businessSection.accessProcedures}.
Security gate code: ${site.businessSection.gateSecurityCode}.
Intercom instructions: ${site.businessSection.intercomInstructions}.
Loading bay guidance: ${site.businessSection.loadingBayDetails.reversingGuidance}.
${site.businessSection.loadingBayDetails.wheelChocksMandatory ? 'Wheel chocks are strictly mandatory.' : ''}
Emergency assembly point: ${site.businessSection.emergencyMusterPoint}.
Please observe 10 miles per hour yard speed limit.`;

    tts.speak(script, 1.05);
  };

  // Simulate GPS arrival geofence (auto-speaks when < 500m)
  const handleSimulateGeofence = () => {
    setSimulatedGeofenceTriggered(true);
    const audioArrivalAlert = `Arrival alert. You are within 500 meters of ${site.title}.
Prepare for entry. Gate code is ${site.businessSection.gateSecurityCode}.
Mandatory PPE required outside cab: ${site.businessSection.mandatoryPPE.join(', ')}.
${site.businessSection.vehicleConstraints.lowBridgeAlert || ''}`;

    tts.speak(audioArrivalAlert, 1.05);
    setTimeout(() => setSimulatedGeofenceTriggered(false), 8000);
  };

  const getRiskBadgeColor = (lvl: RiskLevel) => {
    switch (lvl) {
      case 'CRITICAL':
        return 'bg-rose-50 text-rose-700 border-rose-200';
      case 'HIGH':
        return 'bg-orange-50 text-orange-700 border-orange-200';
      case 'MEDIUM':
        return 'bg-amber-50 text-amber-800 border-amber-200';
      case 'LOW':
        return 'bg-emerald-50 text-emerald-700 border-emerald-200';
    }
  };

  const annotationCount = site.businessSection.sitePlan?.annotations?.length || 6;

  return (
    <div className="space-y-4 pb-12">
      {/* 1. TOP UTILITY & BREADCRUMB BAR */}
      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-200/80 pb-3">
        <button
          onClick={() => {
            tts.stop();
            onBack();
          }}
          className="flex items-center gap-1.5 rounded-xl border border-slate-200 bg-white px-3 py-1.5 text-xs font-bold text-slate-700 hover:bg-slate-50 transition-colors shadow-2xs"
        >
          <ArrowLeft className="h-4 w-4 text-slate-500" />
          <span>Deliveries Directory</span>
        </button>

        <div className="flex items-center gap-2">
          {cacheNotification && (
            <span className="text-[11px] font-bold text-emerald-700 bg-emerald-50 px-2 py-1 rounded-lg border border-emerald-200 animate-in fade-in">
              {cacheNotification}
            </span>
          )}

          <button
            onClick={handleToggleOfflineCache}
            className={`flex items-center gap-1 rounded-xl px-2.5 py-1.5 text-xs font-bold transition-all border ${
              isCached
                ? 'bg-emerald-50 border-emerald-300 text-emerald-800'
                : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
            }`}
            title="Toggle offline storage for cab use"
          >
            <FileCheck className={`h-3.5 w-3.5 ${isCached ? 'text-emerald-600' : 'text-slate-400'}`} />
            <span className="hidden sm:inline">{isCached ? 'Offline Ready' : 'Save Offline'}</span>
          </button>

          <button
            onClick={() => setShowPrintPass(true)}
            className="flex items-center gap-1 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 px-2.5 py-1.5 text-xs font-bold text-slate-700 transition-colors shadow-2xs"
            title="Download printable ISO 45001 Gate Pass PDF"
          >
            <Printer className="h-3.5 w-3.5 text-blue-600" />
            <span className="hidden sm:inline">Gate Pass PDF</span>
          </button>

          <span
            className={`rounded-xl px-2.5 py-1 text-xs font-bold border ${getRiskBadgeColor(
              site.overallRiskLevel
            )}`}
          >
            {site.overallRiskLevel} RISK ({site.overallScore}/25)
          </span>
        </div>
      </div>

      {/* 150m Geofence Alert Trigger Banner (Section 3.A Spec) */}
      {simulatedGeofenceTriggered && (
        <div className="rounded-2xl border-2 border-amber-400 bg-amber-950/90 text-amber-200 p-4 text-xs shadow-xl backdrop-blur-md flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 animate-in slide-in-from-top-3">
          <div className="flex items-center gap-2.5">
            <Radio className="h-5 w-5 text-amber-400 animate-ping" />
            <div>
              <div className="font-black text-amber-300 uppercase tracking-wider text-xs">
                150-Metre Depot Apron Geofence Triggered
              </div>
              <p className="text-[11px] text-amber-100/90">
                You have entered the 150m arrival zone. Complete your rapid 3-tap audit to verify yard safety and unlock the gate barrier pass.
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2 self-end sm:self-center">
            {onOpenThreeTapAudit && (
              <button
                onClick={onOpenThreeTapAudit}
                className="px-3 py-1.5 rounded-xl bg-amber-400 text-slate-950 font-black text-xs hover:bg-amber-300 shadow transition-transform active:scale-95"
              >
                Launch 3-Tap Audit
              </button>
            )}
            <button
              onClick={() => setSimulatedGeofenceTriggered(false)}
              className="text-amber-300/80 hover:text-white text-xs px-2 py-1"
            >
              Dismiss
            </button>
          </div>
        </div>
      )}

      {/* Dynamic Haulier & Site Risk Index Banner (Section 3.B Spec - 1 to 100) */}
      {site.dynamicRiskIndex && (
        <div
          className={`rounded-2xl border p-4 shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 ${
            site.dynamicRiskIndex.isHighRiskAlert
              ? 'bg-rose-950/90 border-rose-500 text-white animate-pulse'
              : 'bg-white border-slate-200 text-slate-800'
          }`}
        >
          <div className="flex items-center gap-3">
            <div
              className={`h-12 w-12 rounded-2xl flex items-center justify-center font-black text-lg shrink-0 ${
                site.dynamicRiskIndex.isHighRiskAlert
                  ? 'bg-rose-500 text-white shadow-lg shadow-rose-500/30'
                  : 'bg-blue-100 text-blue-800'
              }`}
            >
              {site.dynamicRiskIndex.score}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span
                  className={`text-xs font-black uppercase tracking-wider ${
                    site.dynamicRiskIndex.isHighRiskAlert ? 'text-rose-400' : 'text-slate-900'
                  }`}
                >
                  Section 3.B Dynamic Site Risk Index
                </span>
                <span
                  className={`text-[10px] px-2 py-0.5 rounded-full font-bold ${
                    site.dynamicRiskIndex.isHighRiskAlert
                      ? 'bg-rose-500/20 text-rose-300 border border-rose-500/40'
                      : 'bg-slate-100 text-slate-600'
                  }`}
                >
                  {site.dynamicRiskIndex.score > 75
                    ? 'HIGH RISK (>75)'
                    : site.dynamicRiskIndex.score > 50
                    ? 'MODERATE RISK'
                    : 'LOW HAZARD ZONE'}
                </span>
              </div>
              <p
                className={`text-xs mt-0.5 ${
                  site.dynamicRiskIndex.isHighRiskAlert ? 'text-rose-200' : 'text-slate-600'
                }`}
              >
                {site.dynamicRiskIndex.mandatorySafetyAdvisory ||
                  `Aggregated from ${site.threeTapAudits?.length || 1} driver audit(s), walkaround defects and near-miss logs.`}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {onOpenThreeTapAudit && (
              <button
                onClick={onOpenThreeTapAudit}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                  site.dynamicRiskIndex.isHighRiskAlert
                    ? 'bg-white text-rose-900 hover:bg-slate-100'
                    : 'bg-blue-600 text-white hover:bg-blue-700'
                }`}
              >
                Score 3-Tap Audit
              </button>
            )}
          </div>
        </div>
      )}

      {/* Induction & PPE Gatekeeping Quick Status Bar (Section 3.C) */}
      <div className="rounded-2xl bg-white border border-slate-200 p-4 shadow-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div
            className={`h-10 w-10 rounded-xl flex items-center justify-center ${
              site.inductionGatekeeping?.isQrUnlocked
                ? 'bg-emerald-100 text-emerald-700'
                : 'bg-amber-100 text-amber-700'
            }`}
          >
            {site.inductionGatekeeping?.isQrUnlocked ? (
              <Unlock className="h-5 w-5" />
            ) : (
              <Lock className="h-5 w-5" />
            )}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h4 className="text-xs font-bold text-slate-900">
                Gate Barrier Token:{' '}
                {site.inductionGatekeeping?.isQrUnlocked ? (
                  <span className="text-emerald-600 font-black">UNLOCKED & AUTHORIZED</span>
                ) : (
                  <span className="text-amber-600 font-black">LOCKED (INDUCTION REQUIRED)</span>
                )}
              </h4>
              <span className="text-[10px] text-slate-400 font-mono">
                {site.inductionGatekeeping?.qrToken || 'DP-GATE-PENDING'}
              </span>
            </div>
            <p className="text-[11px] text-slate-500">
              {site.inductionGatekeeping?.isQrUnlocked
                ? 'Mandatory PPE and one-way rules verified. Gate QR barrier pass is active.'
                : 'Confirm mandatory PPE & one-way traffic rules to unlock barrier barcode.'}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {onOpenInductionGatekeeper && (
            <button
              onClick={onOpenInductionGatekeeper}
              className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all shadow-sm ${
                site.inductionGatekeeping?.isQrUnlocked
                  ? 'bg-slate-100 text-slate-800 hover:bg-slate-200'
                  : 'bg-emerald-600 text-white hover:bg-emerald-700'
              }`}
            >
              {site.inductionGatekeeping?.isQrUnlocked ? 'View Gate QR Pass' : 'Complete Induction & Unlock'}
            </button>
          )}
        </div>
      </div>

      {/* Location-Aware On-Site Action Bar (Section 3 Utilities) */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
        {onOpenAROverlay && (
          <button
            onClick={onOpenAROverlay}
            className="p-3 rounded-2xl bg-emerald-950/80 border border-emerald-500/50 hover:border-emerald-400 text-left transition-all group shadow-sm"
          >
            <div className="flex items-center justify-between mb-1">
              <Compass className="h-5 w-5 text-emerald-400 group-hover:animate-spin-slow" />
              <span className="text-[10px] font-bold text-emerald-400 uppercase">AR Utility</span>
            </div>
            <div className="text-xs font-bold text-white">AR Bay Navigation</div>
            <p className="text-[10px] text-slate-400 line-clamp-1">Tarmac arrow projection</p>
          </button>
        )}

        {onOpenCongestionTracker && (
          <button
            onClick={onOpenCongestionTracker}
            className="p-3 rounded-2xl bg-blue-950/80 border border-blue-500/50 hover:border-blue-400 text-left transition-all group shadow-sm"
          >
            <div className="flex items-center justify-between mb-1">
              <Clock className="h-5 w-5 text-blue-400" />
              <span className="text-[10px] font-bold text-blue-400 uppercase">
                {site.congestionTracker?.queueCount || 3} HGVs
              </span>
            </div>
            <div className="text-xs font-bold text-white">Wait-Time Tracker</div>
            <p className="text-[10px] text-slate-400 line-clamp-1">Live demurrage clock</p>
          </button>
        )}

        {onOpenTachographScanner && (
          <button
            onClick={onOpenTachographScanner}
            className="p-3 rounded-2xl bg-cyan-950/80 border border-cyan-500/50 hover:border-cyan-400 text-left transition-all group shadow-sm"
          >
            <div className="flex items-center justify-between mb-1">
              <ScanLine className="h-5 w-5 text-cyan-400" />
              <span className="text-[10px] font-bold text-cyan-400 uppercase">WTD Audit</span>
            </div>
            <div className="text-xs font-bold text-white">Scan Tacho Roll</div>
            <p className="text-[10px] text-slate-400 line-clamp-1">Gemini Vision OCR</p>
          </button>
        )}

        {onOpenThreeTapAudit && (
          <button
            onClick={onOpenThreeTapAudit}
            className="p-3 rounded-2xl bg-amber-950/80 border border-amber-500/50 hover:border-amber-400 text-left transition-all group shadow-sm"
          >
            <div className="flex items-center justify-between mb-1">
              <ShieldAlert className="h-5 w-5 text-amber-400" />
              <span className="text-[10px] font-bold text-amber-400 uppercase">150m Zone</span>
            </div>
            <div className="text-xs font-bold text-white">3-Tap Safety Audit</div>
            <p className="text-[10px] text-slate-400 line-clamp-1">R/A/G yard assessment</p>
          </button>
        )}
      </div>

      {/* 2. HERO DRIVER COCKPIT GLANCE CARD (THE 5-SECOND SCAN) */}
      <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-xs space-y-4">
        <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
          {/* Site Details & Clearance Check */}
          <div className="space-y-1.5 flex-1">
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-blue-600 uppercase tracking-wider">
                {site.businessName}
              </span>
              <span className="rounded bg-slate-100 px-1.5 py-0.2 text-[10px] font-bold text-slate-600 border border-slate-200">
                v{site.version}.0
              </span>
            </div>
            <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight">
              {site.title}
            </h1>
            <p className="text-xs text-slate-500 flex items-center gap-1.5">
              <MapPin className="h-3.5 w-3.5 text-blue-600 shrink-0" />
              <span>{site.address}</span>
            </p>

            <div className="flex flex-wrap items-center gap-2 pt-1 text-[11px]">
              <span className="font-mono text-slate-600 bg-slate-100 px-2 py-0.5 rounded border border-slate-200">
                Plus Code: <strong>{site.plusCode || '9C4VFR54+9Q'}</strong>
              </span>
              {site.what3words && (
                <span className="font-mono text-rose-700 bg-rose-50 px-2 py-0.5 rounded border border-rose-200">
                  /// <strong>{site.what3words}</strong>
                </span>
              )}
            </div>

            {/* In-Cab Vehicle Clearance Assessment Pill */}
            <div className="pt-1">
              {hasVehicleConflict ? (
                <div className="flex items-center gap-2 rounded-xl bg-rose-50 border border-rose-300 p-2 text-xs text-rose-900 font-bold">
                  <AlertTriangle className="h-4 w-4 text-rose-600 shrink-0" />
                  <span>
                    Clearance Conflict: Your vehicle ({formatHeightBoth(driverVehicle.heightMeters)} / {driverVehicle.weightTonnes}t) exceeds site limits ({formatHeightBoth(vehicleConstraints.maxHeightMeters)} / {vehicleConstraints.maxWeightTonnes}t)!
                  </span>
                </div>
              ) : (
                <div className="flex items-center gap-2 rounded-xl bg-emerald-50/80 border border-emerald-200 px-3 py-1.5 text-xs text-emerald-900 font-semibold">
                  <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0" />
                  <span>
                    Vehicle <strong className="font-mono">{driverVehicle.vehicleReg}</strong> ({formatHeightBoth(driverVehicle.heightMeters)}) cleared for site max ({formatHeightBoth(vehicleConstraints.maxHeightMeters)}).
                  </span>
                </div>
              )}
            </div>
          </div>

          {/* 4-Metric Glance Strip */}
          <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-2 lg:grid-cols-4 gap-2.5 shrink-0 w-full md:w-auto">
            {/* Gate Access Code */}
            <div className="rounded-xl border border-blue-200 bg-blue-50/50 p-3 flex flex-col justify-between">
              <span className="text-[10px] font-bold text-blue-800 uppercase tracking-wider">Gate Code</span>
              <div className="flex items-center justify-between gap-1 mt-1">
                <span className="font-mono text-lg font-black text-blue-700">
                  {site.businessSection.gateSecurityCode || 'N/A'}
                </span>
                {site.businessSection.gateSecurityCode && (
                  <button
                    onClick={handleCopyPin}
                    className="p-1 text-blue-600 hover:bg-blue-100 rounded transition-colors"
                    title="Copy gate code to clipboard"
                  >
                    {isCopiedPin ? <Check className="h-3.5 w-3.5 text-emerald-600" /> : <Copy className="h-3.5 w-3.5" />}
                  </button>
                )}
              </div>
            </div>

            {/* Clearance Limit */}
            <div className="rounded-xl border border-slate-200 bg-slate-50 p-3 flex flex-col justify-between">
              <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Clearance</span>
              <span className="font-mono text-xs sm:text-sm font-black text-slate-900 mt-1 whitespace-nowrap">
                {formatHeightBoth(vehicleConstraints.maxHeightMeters)}
              </span>
            </div>

            {/* Speed Limit */}
            <div className="rounded-xl border border-slate-200 bg-slate-50 p-3 flex flex-col justify-between">
              <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Yard Speed</span>
              <span className="font-mono text-lg font-black text-amber-600 mt-1">
                5 mph
              </span>
            </div>

            {/* Docks / Bays */}
            <div className="rounded-xl border border-slate-200 bg-slate-50 p-3 flex flex-col justify-between">
              <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Loading Bays</span>
              <span className="text-sm font-black text-slate-900 mt-1 truncate">
                {site.businessSection.loadingBayDetails.bayCount} Bays
              </span>
            </div>
          </div>
        </div>

        {/* 3. PRIMARY DRIVER ACTION STRIP (CONSOLIDATED) */}
        <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-slate-100">
          {/* Turn-by-Turn Navigation Launch Button with App Switcher */}
          <div className="relative flex-1 min-w-[220px]" ref={navDropdownRef}>
            <div className="flex rounded-xl shadow-xs overflow-hidden">
              <button
                onClick={() => {
                  const url = generateNavUrl(
                    site.coordinates.lat,
                    site.coordinates.lng,
                    driverVehicle.preferredNavApp || 'GOOGLE_MAPS',
                    site.address
                  );
                  window.open(url, '_blank');
                }}
                className="flex-1 flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs py-2.5 px-4 transition-all active:scale-98"
              >
                <Navigation className="h-4 w-4" />
                <span>Navigate ({activeNavOption.shortLabel})</span>
                <ExternalLink className="h-3 w-3 text-blue-200" />
              </button>
              <button
                onClick={() => setShowNavDropdown(!showNavDropdown)}
                className="bg-blue-700 hover:bg-blue-800 text-white px-2.5 border-l border-blue-500 flex items-center justify-center transition-colors"
                title="Switch Navigation App (TomTom, Waze, HERE, Apple Maps)"
              >
                <ChevronDown className="h-3.5 w-3.5" />
              </button>
            </div>

            {showNavDropdown && (
              <div className="absolute left-0 mt-1.5 w-60 rounded-xl bg-white p-1.5 shadow-xl border border-slate-200 z-50 animate-in fade-in space-y-0.5 text-xs">
                <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400 px-2 py-1">
                  Select Navigation App
                </div>
                {(['GOOGLE_MAPS', 'TOMTOM_TRUCK', 'HERE_WEGO', 'WAZE', 'APPLE_MAPS'] as PreferredNavApp[]).map((appKey) => {
                  const opt = NAV_APP_OPTIONS[appKey];
                  return (
                    <button
                      key={appKey}
                      onClick={() => {
                        setShowNavDropdown(false);
                        const url = generateNavUrl(site.coordinates.lat, site.coordinates.lng, appKey, site.address);
                        window.open(url, '_blank');
                      }}
                      className="w-full flex items-center justify-between rounded-lg px-2.5 py-1.5 text-left text-slate-700 hover:bg-slate-100 transition-colors"
                    >
                      <span className="font-semibold">{opt.name}</span>
                      {opt.isTruckSpecific && (
                        <span className="text-[10px] font-bold bg-emerald-100 text-emerald-800 px-1.5 py-0.2 rounded">
                          Truck
                        </span>
                      )}
                    </button>
                  );
                })}
              </div>
            )}
          </div>

          {/* Gemini Live In-Cab Voice Co-Pilot */}
          <button
            onClick={() => {
              if (onOpenVoiceCopilot) onOpenVoiceCopilot();
              else setShowVoiceCopilot(true);
            }}
            className="flex items-center gap-1.5 rounded-xl bg-slate-950 hover:bg-slate-850 text-amber-300 font-bold text-xs py-2.5 px-3.5 shadow-xs transition-all active:scale-98"
          >
            <Mic className="h-4 w-4 text-amber-400 animate-pulse" />
            <span>Voice Co-Pilot</span>
          </button>

          {/* Glare-Resistant In-Motion Driver HUD */}
          <button
            onClick={() => {
              if (onOpenInMotionHud) onOpenInMotionHud();
              else setShowInMotionHud(true);
            }}
            className="flex items-center gap-1.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-xs py-2.5 px-3.5 shadow-xs transition-all active:scale-98"
          >
            <Gauge className="h-4 w-4" />
            <span>Driver HUD</span>
          </button>

          {/* Audio TTS Briefing */}
          <button
            onClick={handlePlayFullAudioBriefing}
            className={`flex items-center gap-1.5 rounded-xl font-bold text-xs py-2.5 px-3.5 transition-all active:scale-98 ${
              isPlayingAudio
                ? 'bg-rose-600 text-white'
                : 'border border-slate-200 bg-slate-50 hover:bg-slate-100 text-slate-800'
            }`}
          >
            {isPlayingAudio ? (
              <>
                <VolumeX className="h-4 w-4" />
                <span>Stop Briefing</span>
              </>
            ) : (
              <>
                <Volume2 className="h-4 w-4 text-blue-600" />
                <span>Audio Briefing</span>
              </>
            )}
          </button>

          {/* Secondary Inspection Tools Dropdown */}
          <div className="relative" ref={toolsMenuRef}>
            <button
              onClick={() => setShowToolsMenu(!showToolsMenu)}
              className="flex items-center gap-1 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 font-bold text-xs py-2.5 px-3 shadow-2xs transition-colors"
            >
              <span>More Tools</span>
              <ChevronDown className="h-3.5 w-3.5 text-slate-400" />
            </button>

            {showToolsMenu && (
              <div className="absolute right-0 mt-1.5 w-56 rounded-xl bg-white p-1.5 shadow-xl border border-slate-200 z-50 animate-in fade-in space-y-1 text-xs">
                <button
                  onClick={() => {
                    setShowToolsMenu(false);
                    setShowStreetView(true);
                  }}
                  className="w-full flex items-center gap-2 rounded-lg px-2.5 py-2 text-left text-slate-700 hover:bg-slate-100 font-semibold"
                >
                  <Eye className="h-4 w-4 text-blue-600" />
                  <span>360° Street View Gate</span>
                </button>

                <button
                  onClick={() => {
                    setShowToolsMenu(false);
                    onOpenVideoGuide();
                  }}
                  className="w-full flex items-center gap-2 rounded-lg px-2.5 py-2 text-left text-slate-700 hover:bg-slate-100 font-semibold"
                >
                  <Video className="h-4 w-4 text-cyan-600" />
                  <span>Dynamic Approach Video</span>
                </button>

                <button
                  onClick={() => {
                    setShowToolsMenu(false);
                    onOpenObservationModal();
                  }}
                  className="w-full flex items-center gap-2 rounded-lg px-2.5 py-2 text-left text-slate-700 hover:bg-slate-100 font-semibold"
                >
                  <Camera className="h-4 w-4 text-emerald-600" />
                  <span>Report Observation / Photo</span>
                </button>

                <button
                  onClick={() => {
                    setShowToolsMenu(false);
                    handleSimulateGeofence();
                  }}
                  className="w-full flex items-center gap-2 rounded-lg px-2.5 py-2 text-left text-slate-700 hover:bg-slate-100 font-semibold"
                >
                  <Radio className="h-4 w-4 text-amber-600" />
                  <span>Simulate Geofence Arrival</span>
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Active Time-Window Hazards Alert */}
      {activeTimeWindowHazards.length > 0 && (
        <div className="rounded-2xl border border-amber-300 bg-amber-50 p-4 space-y-2 shadow-xs">
          <div className="flex items-center gap-2 text-xs font-bold text-amber-900">
            <Clock className="h-4 w-4 text-amber-600" />
            <span>TIME-CRITICAL TEMPORARY HAZARD ACTIVE NOW ({currentHoursMins})</span>
          </div>
          {activeTimeWindowHazards.map((h) => (
            <div key={h.id} className="text-xs text-amber-800 bg-white p-2.5 rounded-xl border border-amber-200">
              <strong>{h.title}</strong> ({h.timeStart} - {h.timeEnd}): {h.description}
            </div>
          ))}
        </div>
      )}

      {/* 4. STREAMLINED 3-VIEW TAB NAVIGATION */}
      <div className="flex rounded-2xl border border-slate-200 bg-white p-1 shadow-xs">
        <button
          onClick={() => setActiveTab('RULES')}
          className={`flex-1 rounded-xl py-2 px-3 text-xs font-bold transition-all flex items-center justify-center gap-1.5 ${
            activeTab === 'RULES'
              ? 'bg-blue-600 text-white shadow-xs'
              : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          <ShieldCheck className="h-4 w-4" />
          <span>Safety & Access Protocols</span>
        </button>

        <button
          onClick={() => setActiveTab('SITE_PLAN')}
          className={`flex-1 rounded-xl py-2 px-3 text-xs font-bold transition-all flex items-center justify-center gap-1.5 ${
            activeTab === 'SITE_PLAN'
              ? 'bg-indigo-600 text-white shadow-xs'
              : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          <Layers className="h-4 w-4" />
          <span>Yard Map & CAD Plan ({annotationCount})</span>
        </button>

        <button
          onClick={() => setActiveTab('DRIVER_NOTES')}
          className={`flex-1 rounded-xl py-2 px-3 text-xs font-bold transition-all flex items-center justify-center gap-1.5 ${
            activeTab === 'DRIVER_NOTES'
              ? 'bg-blue-600 text-white shadow-xs'
              : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          <Camera className="h-4 w-4" />
          <span>Driver Intel & Notes ({site.driverSection.observations.length})</span>
        </button>
      </div>

      {/* VIEW 1: SAFETY & ACCESS PROTOCOLS (CONSOLIDATED) */}
      {activeTab === 'RULES' && (
        <div className="space-y-4">
          {/* PPE & Emergency Muster in clean 2-column grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {/* Mandatory PPE Required */}
            <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-xs space-y-2">
              <h3 className="text-xs font-bold text-slate-800 flex items-center gap-2">
                <ShieldCheck className="h-4 w-4 text-emerald-600" />
                <span>Mandatory PPE Outside Cab</span>
              </h3>
              <div className="flex flex-wrap gap-1.5">
                {site.businessSection.mandatoryPPE.map((ppe, i) => (
                  <span
                    key={i}
                    className="rounded-lg bg-emerald-50 px-2.5 py-1 text-xs font-semibold text-emerald-800 border border-emerald-200"
                  >
                    ✓ {ppe}
                  </span>
                ))}
              </div>
            </div>

            {/* Emergency Muster Point */}
            <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-xs space-y-2">
              <h3 className="text-xs font-bold text-slate-800 flex items-center gap-2">
                <ShieldAlert className="h-4 w-4 text-indigo-600" />
                <span>Emergency Evacuation Muster Point</span>
              </h3>
              <p className="text-xs text-slate-700 font-semibold bg-indigo-50/60 p-2.5 rounded-xl border border-indigo-100">
                {site.businessSection.emergencyMusterPoint}
              </p>
            </div>
          </div>

          {/* Loading Bay & Reversing Guidance */}
          <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-xs space-y-2">
            <h3 className="text-xs font-bold text-slate-800 flex items-center gap-2">
              <Truck className="h-4 w-4 text-blue-600" />
              <span>Loading Bay & Reversing Procedures</span>
            </h3>
            <p className="text-xs text-slate-700 bg-slate-50 p-3 rounded-xl border border-slate-100 leading-relaxed">
              {site.businessSection.loadingBayDetails.reversingGuidance}
            </p>
            <div className="flex flex-wrap gap-2 pt-1 text-[11px]">
              {site.businessSection.loadingBayDetails.wheelChocksMandatory && (
                <span className="rounded-lg bg-rose-50 text-rose-800 px-2 py-0.5 font-bold border border-rose-200">
                  Wheel Chocking Mandatory
                </span>
              )}
              {site.businessSection.loadingBayDetails.keysHandoverRequired && (
                <span className="rounded-lg bg-amber-50 text-amber-800 px-2 py-0.5 font-bold border border-amber-200">
                  Ignition Keys Handover Required
                </span>
              )}
            </div>
          </div>

          {/* Gatehouse Check-In & Depot Contact */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-xs space-y-2">
              <h3 className="text-xs font-bold text-slate-800">Gatehouse Inbound Check-In</h3>
              <p className="text-xs text-slate-700 leading-relaxed bg-slate-50 p-2.5 rounded-xl border border-slate-100">
                {site.businessSection.accessProcedures}
              </p>
              {site.businessSection.intercomInstructions && (
                <p className="text-xs text-slate-600 bg-blue-50/50 p-2 rounded-lg border border-blue-100">
                  <strong>Intercom:</strong> {site.businessSection.intercomInstructions}
                </p>
              )}
            </div>

            <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-xs space-y-2">
              <h3 className="text-xs font-bold text-slate-800">Depot Safety Management Contact</h3>
              <div className="space-y-1.5 text-xs">
                <div className="flex items-center justify-between bg-slate-50 p-2 rounded-lg border border-slate-100">
                  <span className="text-slate-500">Manager:</span>
                  <strong className="text-slate-900">{site.businessSection.siteManager.name}</strong>
                </div>
                <div className="flex items-center justify-between bg-slate-50 p-2 rounded-lg border border-slate-100">
                  <span className="text-slate-500">Phone:</span>
                  <a href={`tel:${site.businessSection.siteManager.phone}`} className="text-blue-600 font-bold hover:underline">
                    {site.businessSection.siteManager.phone}
                  </a>
                </div>
                <div className="flex items-center justify-between bg-slate-50 p-2 rounded-lg border border-slate-100">
                  <span className="text-slate-500">Yard Radio:</span>
                  <strong className="font-mono text-indigo-700">{site.businessSection.siteManager.radioChannel}</strong>
                </div>
              </div>
            </div>
          </div>

          {/* HSE Baseline Hazard Matrix with Controls */}
          <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-xs space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-bold text-slate-800">
                HSE Baseline Risk Assessment & Controls ({site.businessSection.baselineHazards.length} identified)
              </h3>
            </div>

            <div className="space-y-2">
              {site.businessSection.baselineHazards.map((h) => (
                <div key={h.id} className="rounded-xl border border-slate-200 bg-slate-50/60 p-3 space-y-1.5">
                  <div className="flex items-start justify-between gap-2">
                    <h4 className="text-xs font-bold text-slate-900">{h.hazard}</h4>
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${getRiskBadgeColor(h.riskLevel)}`}>
                      {h.riskLevel} ({h.riskRating}/25)
                    </span>
                  </div>
                  <div className="text-xs text-slate-600">
                    <span className="font-semibold text-slate-700 block mb-0.5">Control Measures:</span>
                    <ul className="list-disc list-inside space-y-0.5">
                      {h.controlMeasures.map((c, i) => (
                        <li key={i}>{c}</li>
                      ))}
                    </ul>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Nearby Sensitive Infrastructure (Google Places Intelligence) */}
          <div className="rounded-2xl border border-amber-200 bg-amber-50/80 p-4 shadow-xs space-y-2.5">
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-bold text-amber-900 flex items-center gap-2">
                <AlertCircle className="h-4 w-4 text-amber-600" />
                <span>Nearby Sensitive Public Infrastructure & Hazard Corridors</span>
              </h3>
              <span className="text-[10px] font-bold uppercase tracking-wider text-amber-800 bg-amber-100 px-2 py-0.5 rounded border border-amber-300">
                Google Places Intelligence
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-xs">
              {(site.nearbySensitivities && site.nearbySensitivities.length > 0
                ? site.nearbySensitivities
                : scanNearbySensitivities(site.coordinates.lat, site.coordinates.lng, site.address)
              ).map((sens, idx) => (
                <div key={idx} className="bg-white p-3 rounded-xl border border-amber-200 shadow-2xs space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-slate-900 text-[11px] truncate">{sens.name}</span>
                    <span className="text-[10px] font-mono text-amber-700 font-bold">{sens.distanceMeters}m</span>
                  </div>
                  <p className="text-[11px] text-slate-600 leading-snug">{sens.riskReason}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* VIEW 2: INTERACTIVE YARD PLAN & CAD ANNOTATIONS */}
      {activeTab === 'SITE_PLAN' && (
        <div className="space-y-4">
          <SitePlanAnnotator
            site={site}
            onUpdateSitePlan={(updatedPlan) => {
              if (onUpdateSitePlan) {
                onUpdateSitePlan(site.id, updatedPlan);
              }
            }}
          />
        </div>
      )}

      {/* VIEW 3: DRIVER INTEL & COMMUNITY OBSERVATIONS */}
      {activeTab === 'DRIVER_NOTES' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-xs font-bold text-slate-800">
              Driver Real-Time Yard Observations & Field Updates
            </h3>
            <button
              onClick={onOpenObservationModal}
              className="flex items-center gap-1.5 rounded-xl bg-blue-600 hover:bg-blue-700 px-3 py-1.5 text-xs font-bold text-white shadow-xs transition-all"
            >
              <Camera className="h-3.5 w-3.5" />
              <span>Submit Driver Observation</span>
            </button>
          </div>

          {site.driverSection.observations.length === 0 ? (
            <div className="rounded-2xl border border-dashed border-slate-200 bg-white p-8 text-center text-slate-500 text-xs">
              No real-time driver observations recorded yet. Be the first to share yard updates!
            </div>
          ) : (
            <div className="space-y-3">
              {site.driverSection.observations.map((obs) => (
                <div key={obs.id} className="rounded-2xl border border-slate-200 bg-white p-4 shadow-xs space-y-2">
                  <div className="flex items-center justify-between text-xs">
                    <div className="font-bold text-slate-900">{obs.driverName}</div>
                    <span className="text-[11px] text-slate-400">
                      {new Date(obs.timestamp).toLocaleDateString()}
                    </span>
                  </div>
                  <p className="text-xs text-slate-700 leading-relaxed">{obs.comment}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* 360° Street View Gate Modal */}
      {showStreetView && (
        <StreetViewGateModal
          isOpen={showStreetView}
          onClose={() => setShowStreetView(false)}
          site={site}
        />
      )}

      {/* Printable ISO 45001 Gate Pass Modal */}
      {showPrintPass && (
        <PrintableGatePassModal
          isOpen={showPrintPass}
          site={site}
          driverVehicle={driverVehicle}
          onClose={() => setShowPrintPass(false)}
        />
      )}

      {/* Gemini Live In-Cab Voice Safety Co-Pilot Modal */}
      {showVoiceCopilot && (
        <InCabVoiceCopilotModal
          isOpen={showVoiceCopilot}
          onClose={() => setShowVoiceCopilot(false)}
          site={site}
          driverVehicle={driverVehicle}
        />
      )}

      {/* Dedicated In-Motion Driver HUD Mode Modal */}
      {showInMotionHud && (
        <InMotionDriverHudModal
          isOpen={showInMotionHud}
          onClose={() => setShowInMotionHud(false)}
          site={site}
          driverVehicle={driverVehicle}
        />
      )}
    </div>
  );
};
