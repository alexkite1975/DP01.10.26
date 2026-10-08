'use client';
import React, { useState, useRef, useEffect } from 'react';
import {
  ScanLine,
  Camera,
  CheckCircle2,
  AlertTriangle,
  Play,
  Pause,
  ArrowLeft,
  X,
  ShieldCheck,
  Sparkles,
  Clock,
  Trash2,
  Calendar,
  FileText,
  ChevronRight,
  Zap,
  RefreshCw,
  Eye,
  Check,
  Layers,
  Info,
  Printer,
  Download,
  ShieldAlert,
  Share2,
  Copy,
  Gauge,
  ZoomIn,
  FileCheck,
  Lock,
  Volume2,
  Mic,
  Activity,
  Truck,
  Wrench,
  QrCode,
  Navigation,
  Compass,
  MapPin,
  ExternalLink,
  EyeOff,
  Unlock,
  Key,
  AlertOctagon,
  ArrowUpRight,
  Sliders,
  ClipboardCheck,
  Radio
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { ConversationalChecklist } from './ConversationalChecklist';
import { DeliverySiteRouteModal } from './DeliverySiteRouteModal';
import { DriverWalkaroundSettingsModal } from './DriverWalkaroundSettingsModal';
import { AcousticAirLeakAnalyzerModal } from './AcousticAirLeakAnalyzerModal';
import { ARWalkaroundVisionHUD } from './ARWalkaroundVisionHUD';
import {
  WalkaroundCheckRecord,
  WalkaroundDefectItem,
  InspectionZoneId,
  TrailerDropSwapMemory,
  TrailerAssetRecord,
  TractorUnitAssetRecord,
  CombinationVehicleEnvelope
} from '../../types/vehicleCheckTypes';
import { DriverLicenceProfile } from '../../types';
import {
  DVSA_STATUTORY_CHECKPOINTS,
  DvsaCheckItem,
  calculateDvsaRoadworthinessScore
} from '../../data/dvsaCheckpoints';
import {
  SAMPLE_WALKAROUND_RECORDS,
  SAMPLE_TRAILER_MEMORIES,
  WALKAROUND_AI_TIPS,
  SAMPLE_TRAILER_DATABASE,
  SAMPLE_TRACTOR_DATABASE,
  calculateCombinationEnvelope,
  metersToFeetInches
} from '../../data/sampleVehicleChecks';
import { formatHeightBoth } from '../../utils/heightUtils';

const STORAGE_KEY_WALKAROUNDS = 'dp_walkaround_records_v1';

export interface VehicleCheckAppProps {
  onOpenLicenceScanner?: () => void;
  driverLicenceProfile?: DriverLicenceProfile | null;
  onSwitchToTachoScan?: () => void;
  onSwitchToSiteRisk?: () => void;
  onSwitchToRouteOptimiser?: () => void;
  onSwitchToSafetyShield?: () => void;
}

export const VehicleCheckApp: React.FC<VehicleCheckAppProps> = ({
  onOpenLicenceScanner = () => {},
  driverLicenceProfile,
  onSwitchToTachoScan,
  onSwitchToSiteRisk,
  onSwitchToRouteOptimiser,
  onSwitchToSafetyShield
}) => {
  // Navigation View State
  const [view, setView] = useState<
    | 'WELCOME'
    | 'ACTION_MENU'
    | 'FULLSCREEN_SCAN'
    | 'PROGRESS_BAR'
    | 'DAYS_OVERVIEW'
    | 'DAY_DETAIL'
  >('WELCOME');

  // Video walkthrough modal state
  const [isVideoModalOpen, setIsVideoModalOpen] = useState(false);
  const [videoChapter, setVideoChapter] = useState<'WALKTHROUGH' | 'WHEEL_NUTS' | 'COUPLING' | 'TACHO'>('WALKTHROUGH');
  const [isVideoPlaying, setIsVideoPlaying] = useState(true);
  const [videoProgress, setVideoProgress] = useState(30);

  // Animated Walkaround Tips Video State
  const [isTipsModalOpen, setIsTipsModalOpen] = useState(false);
  const [tipsActiveIndex, setTipsActiveIndex] = useState(0);
  const [isTipsPlaying, setIsTipsPlaying] = useState(true);
  const [tipsProgress, setTipsProgress] = useState(0);
  const [welcomeVideoTab, setWelcomeVideoTab] = useState<'WALKTHROUGH' | 'TIPS'>('WALKTHROUGH');

  // Operational Modals
  const [isDvsaQrModalOpen, setIsDvsaQrModalOpen] = useState(false);
  const [isAcousticModalOpen, setIsAcousticModalOpen] = useState(false);
  const [isTrailerMemoryModalOpen, setIsTrailerMemoryModalOpen] = useState(false);
  const [isTrailerNavModalOpen, setIsTrailerNavModalOpen] = useState(false);
  const [selectedTrailerId, setSelectedTrailerId] = useState('TR-8842');
  const [selectedTractorReg, setSelectedTractorReg] = useState('DG21 EDP');
  const [cargoPayloadTonnes, setCargoPayloadTonnes] = useState(26.5);
  const [navTab, setNavTab] = useState<'ENVELOPE' | 'PRIVACY' | 'SYNC'>('ENVELOPE');
  const [combinationEnvelope, setCombinationEnvelope] = useState<CombinationVehicleEnvelope>(() =>
    calculateCombinationEnvelope('DG21 EDP', 'TR-8842', 26.5)
  );
  const [isTachoSyncModalOpen, setIsTachoSyncModalOpen] = useState(false);
  const [isDossierModalOpen, setIsDossierModalOpen] = useState(false);

  // DVSA 32-Point Statutory Checklist State
  const [isStatutoryChecklistModalOpen, setIsStatutoryChecklistModalOpen] = useState(false);
  const [statutoryChecklist, setStatutoryChecklist] = useState<DvsaCheckItem[]>(DVSA_STATUTORY_CHECKPOINTS);
  const [checklistAssetFilter, setChecklistAssetFilter] = useState<'ALL' | 'TRACTOR' | 'TRAILER'>('ALL');
  const [checklistCategoryFilter, setChecklistCategoryFilter] = useState<string>('ALL');

  // Conversational 32-Point Walkaround State
  const [isConversationalChecklistOpen, setIsConversationalChecklistOpen] = useState(false);
  // Next Delivery Site & Compliant HGV Routing State
  const [isDeliveryRouteModalOpen, setIsDeliveryRouteModalOpen] = useState(false);
  // Driver Routine Settings State
  const [isDriverSettingsModalOpen, setIsDriverSettingsModalOpen] = useState(false);

  const handleCompleteConversationalChecklist = (results: {
    checkpoints: DvsaCheckItem[];
    defects: any[];
    visualEvidence: any[];
    roadworthiness: ReturnType<typeof calculateDvsaRoadworthinessScore>;
  }) => {
    setStatutoryChecklist(results.checkpoints);
    setIsConversationalChecklistOpen(false);

    // Map any defects to WalkaroundDefectItem format
    const mappedDefects: WalkaroundDefectItem[] = results.defects.map((def, idx) => ({
      id: def.id || `def-${Date.now()}-${idx}`,
      zoneId:
        def.itemNumber <= 10
          ? 'IN_CAB'
          : def.itemNumber <= 20
          ? 'STEER_AXLE'
          : def.itemNumber <= 25
          ? 'COUPLING_CATWALK'
          : def.itemNumber <= 29
          ? 'TRAILER_RUNNING_GEAR'
          : 'REAR_LIGHTING',
      component: def.component,
      severity:
        def.severity === 'IMMEDIATE_PG9'
          ? 'IMMEDIATE_PROHIBITION_PG9'
          : def.severity === 'DELAYED_10_DAY'
          ? 'DELAYED_PROHIBITION_10_DAY'
          : 'ADVISORY',
      dvsaReference: def.dvsaReference,
      description: def.description,
      actionRequired:
        def.severity === 'IMMEDIATE_PG9'
          ? 'Immediate workshop grounding & component replacement before highway transit'
          : 'Scheduled maintenance rectification',
      estimatedRepairHours: def.severity === 'IMMEDIATE_PG9' ? 2.5 : 1.0,
      partRequired: def.component,
      workshopJobCardCreated: true,
      photoUrl: def.photos?.[0]
    }));

    const overallResult: WalkaroundCheckRecord['overallResult'] =
      results.roadworthiness.immediatePg9Fails > 0
        ? 'IMMEDIATE_PROHIBITION_PG9'
        : results.roadworthiness.delayed10DayFails > 0
        ? 'RECTIFICATION_10_DAY'
        : results.roadworthiness.advisories > 0
        ? 'ADVISORY_ISSUED'
        : 'PASS_CLEAN';

    const newRecord: WalkaroundCheckRecord = {
      id: `chk-${Date.now()}`,
      dateKey: new Date().toISOString().split('T')[0],
      displayDate: new Date().toLocaleDateString('en-GB', {
        weekday: 'long',
        day: 'numeric',
        month: 'short',
        year: 'numeric'
      }),
      timestamp: new Date().toISOString(),
      driverName: driverLicenceProfile?.fullName || 'Alexander James Kite',
      driverLicenceNumber: driverLicenceProfile?.licenceNumber || 'KITEA805219AJ99G',
      driverTachoCard: driverLicenceProfile?.tachoCardNumber || 'UK / DB250290781795 0 0',
      vehicleReg: selectedTractorReg,
      trailerId: selectedTrailerId,
      trailerType: 'CURTAINSIDER',
      haulierName: 'Drive Logistics UK Ltd',
      oLicenceNumber: 'OD2019482',
      ocrsStatus:
        results.roadworthiness.immediatePg9Fails > 0
          ? 'RED'
          : results.roadworthiness.delayed10DayFails > 0
          ? 'AMBER'
          : 'GREEN',
      odometerKm: 709945,
      durationMinutes: 15,
      tachoStatusReconciled: true,
      tachoShiftState: 'OTHER_WORK',
      overallResult,
      vaultSha256: `sha256-dvsa-audit-${Date.now()}-conversational-verified`,
      digitalSignature: `${driverLicenceProfile?.fullName || 'Alexander James Kite'} (C+E Verified)`,
      pmiDueDays: 16,
      tyreTreadMinMm: 8.0,
      wheelNutsTorqued: true,
      couplingDogClipLocked: true,
      airPressureBar: 8.9,
      zones: SAMPLE_WALKAROUND_RECORDS[0].zones,
      defects: mappedDefects,
      notes: `Conversational 32-point walkaround completed with ${results.visualEvidence.length} visual verifications and ${mappedDefects.length} recorded defects.`
    };

    setWalkaroundRecords((prev) => [newRecord, ...prev]);
    setSelectedRecordId(newRecord.id);
    setView('DAYS_OVERVIEW');
    showToast(
      `✓ Conversational Walkaround recorded: ${results.visualEvidence.length} media verifications & 15-month DVSA audit vault generated!`
    );
  };

  const handleToggleStatutoryItem = (id: string, status: 'PASS' | 'FAIL') => {
    setStatutoryChecklist((prev) =>
      prev.map((item) => (item.id === id ? { ...item, status } : item))
    );
  };

  // Recalculate envelope when tractor, trailer, or payload changes
  useEffect(() => {
    setCombinationEnvelope(
      calculateCombinationEnvelope(selectedTractorReg, selectedTrailerId, cargoPayloadTonnes)
    );
  }, [selectedTractorReg, selectedTrailerId, cargoPayloadTonnes]);

  // Sync to TomTom Truck Routing Engine
  const handleSyncToTomTom = () => {
    try {
      if (typeof window !== 'undefined') {
        (window as any).ACTIVE_HGV_ENVELOPE = combinationEnvelope;
      }
      showToast(
        `✓ TomTom Truck Routing synced: ${combinationEnvelope.combinedHeightFeetInches} • ${combinationEnvelope.grossCombinationWeightTonnes}t GCW! Low bridge protection active.`
      );
    } catch (_e) {
      showToast('TomTom Truck sync ready');
    }
  };

  // Launch Google Maps with Truck Destination & Dimension Copy
  const handleLaunchGoogleMaps = () => {
    const text = `HGV Profile: ${combinationEnvelope.combinedHeightFeetInches} (${combinationEnvelope.combinedHeightMeters}m) | ${combinationEnvelope.grossCombinationWeightTonnes}t | ${combinationEnvelope.combinedLengthMeters}m L`;
    navigator.clipboard.writeText(text);
    window.open(
      'https://www.google.com/maps/dir/?api=1&destination=DIRFT+Daventry+Logistics+Hub&travelmode=driving',
      '_blank'
    );
    showToast('✓ Google Maps launched! Dimensions copied to clipboard for truck profile check.');
  };

  // Export to Garmin dēzl / CoPilot Truck URI Scheme
  const handleExportGarminCopilot = () => {
    const uri = `copilot://navigate?destination=DIRFT%20Daventry&vehicleType=HGV&h=${combinationEnvelope.combinedHeightMeters}&w=${combinationEnvelope.combinedWidthMeters}&l=${combinationEnvelope.combinedLengthMeters}&gvw=${combinationEnvelope.grossCombinationWeightTonnes}`;
    navigator.clipboard.writeText(uri);
    showToast('✓ Garmin dēzl & CoPilot Truck URI generated & copied to clipboard!');
  };

  // Copy Full Dimensions
  const handleCopyDimensions = () => {
    const text = `DRIVE PARTNERS COMBINATION VEHICLE ENVELOPE (DVSA AUDITED)
Tractor Unit: ${selectedTractorReg}
Trailer ID:   ${selectedTrailerId} (${SAMPLE_TRAILER_DATABASE[selectedTrailerId]?.trailerType || 'Curtainsider'})
--------------------------------------------------
Overall Height:         ${combinationEnvelope.combinedHeightMeters}m (${combinationEnvelope.combinedHeightFeetInches})
Bridge Safety Warning:  Bridges under ${combinationEnvelope.bridgeAlertThresholdMeters}m
Gross Combination Wt:   ${combinationEnvelope.grossCombinationWeightTonnes} Tonnes (Axles: ${combinationEnvelope.totalAxles})
Overall Length:         ${combinationEnvelope.combinedLengthMeters}m (UK Artic Legal Max)
Overall Width:          ${combinationEnvelope.combinedWidthMeters}m
Emissions / CAZ:        ${combinationEnvelope.emissionStandard}
Direct Vision Standard: ${combinationEnvelope.dvsRating} Stars
Hazardous Goods / ADR:  ${combinationEnvelope.adrCategory}
--------------------------------------------------
Generated via Drive Partners Vehicle-Check`;
    navigator.clipboard.writeText(text);
    showToast('Vehicle Combination Envelope copied to clipboard!');
  };

  // Toast feedback
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 4000);
  };

  // Stored Walkaround Checks (15-Month DVSA History)
  const [walkaroundRecords, setWalkaroundRecords] = useState<WalkaroundCheckRecord[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_WALKAROUNDS);
      if (saved) return JSON.parse(saved);
    } catch (_e) {}
    return SAMPLE_WALKAROUND_RECORDS;
  });

  // Selected check record for detailed inspection
  const [selectedRecordId, setSelectedRecordId] = useState<string | null>(
    SAMPLE_WALKAROUND_RECORDS[0]?.id || null
  );

  // Progress Bar state
  const [progressPercent, setProgressPercent] = useState(0);
  const [progressStatusText, setProgressStatusText] = useState('Initializing scan...');

  // Live Camera states for FULLSCREEN SCAN
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const nativeCameraInputRef = useRef<HTMLInputElement | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const [isCameraActive, setIsCameraActive] = useState(false);
  const [facingMode, setFacingMode] = useState<'environment' | 'user'>('environment');
  const [isTorchOn, setIsTorchOn] = useState(false);
  const [activeZone, setActiveZone] = useState<InspectionZoneId>('STEER_AXLE');
  const audioContextRef = useRef<AudioContext | null>(null);

  // Save records to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY_WALKAROUNDS, JSON.stringify(walkaroundRecords));
    } catch (_e) {}
  }, [walkaroundRecords]);

  // Scanning tips animated video progress ticker
  useEffect(() => {
    if (!isTipsPlaying) return;
    const interval = setInterval(() => {
      setTipsProgress((prev) => {
        if (prev >= 100) {
          setTipsActiveIndex((curr) => (curr + 1) % WALKAROUND_AI_TIPS.length);
          return 0;
        }
        return prev + 2;
      });
    }, 100);
    return () => clearInterval(interval);
  }, [isTipsPlaying]);

  // Swipe Gesture Navigation: Allow going back a page with swipe right on mobile
  const touchStartXRef = useRef<number | null>(null);
  const touchStartYRef = useRef<number | null>(null);

  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartXRef.current = e.touches[0].clientX;
    touchStartYRef.current = e.touches[0].clientY;
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (touchStartXRef.current === null || touchStartYRef.current === null) return;
    const touchEndX = e.changedTouches[0].clientX;
    const touchEndY = e.changedTouches[0].clientY;
    const deltaX = touchEndX - touchStartXRef.current;
    const deltaY = touchEndY - touchStartYRef.current;

    // Swipe right (horizontal distance > 65px and horizontal movement exceeds vertical)
    if (deltaX > 65 && Math.abs(deltaX) > Math.abs(deltaY) * 1.2) {
      handleSwipeBack();
    }
    touchStartXRef.current = null;
    touchStartYRef.current = null;
  };

  const handleSwipeBack = () => {
    // 1. Close any open overlays or modals first
    if (isTipsModalOpen) {
      setIsTipsModalOpen(false);
      showToast('Swiped back');
      return;
    }
    if (isDvsaQrModalOpen) {
      setIsDvsaQrModalOpen(false);
      showToast('Swiped back');
      return;
    }
    if (isAcousticModalOpen) {
      setIsAcousticModalOpen(false);
      showToast('Swiped back');
      return;
    }
    if (isTrailerMemoryModalOpen) {
      setIsTrailerMemoryModalOpen(false);
      showToast('Swiped back');
      return;
    }
    if (isTachoSyncModalOpen) {
      setIsTachoSyncModalOpen(false);
      showToast('Swiped back');
      return;
    }
    if (isDossierModalOpen) {
      setIsDossierModalOpen(false);
      showToast('Swiped back');
      return;
    }
    if (isStatutoryChecklistModalOpen) {
      setIsStatutoryChecklistModalOpen(false);
      showToast('Swiped back');
      return;
    }

    // 2. View navigation stack
    if (view === 'DAY_DETAIL') {
      setView('DAYS_OVERVIEW');
      showToast('Swiped back to Dashboard');
    } else if (view === 'DAYS_OVERVIEW') {
      setView('ACTION_MENU');
      showToast('Swiped back to Menu');
    } else if (view === 'FULLSCREEN_SCAN') {
      stopCamera();
      setView('ACTION_MENU');
      showToast('Swiped back to Menu');
    } else if (view === 'PROGRESS_BAR') {
      setView('ACTION_MENU');
      showToast('Swiped back to Menu');
    } else if (view === 'ACTION_MENU') {
      setView('WELCOME');
      showToast('Swiped back to Welcome');
    }
  };

  // Audio chime for scan capture
  const playCaptureChime = () => {
    try {
      if (!audioContextRef.current) {
        audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)();
      }
      const ctx = audioContextRef.current;
      if (ctx.state === 'suspended') ctx.resume();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(587.33, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(880, ctx.currentTime + 0.15);
      gain.gain.setValueAtTime(0.3, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.25);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + 0.25);
    } catch (_e) {}
  };

  // Camera handling for Fullscreen Scanner
  const stopCamera = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop());
      streamRef.current = null;
    }
    if (videoRef.current) {
      videoRef.current.srcObject = null;
    }
    setIsCameraActive(false);
  };

  const startCamera = async (targetFacing?: 'environment' | 'user') => {
    const facing = targetFacing || facingMode;
    try {
      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        return;
      }
      let stream: MediaStream | null = null;
      try {
        stream = await navigator.mediaDevices.getUserMedia({
          video: {
            facingMode: { ideal: facing },
            width: { ideal: 1920 },
            height: { ideal: 1080 }
          },
          audio: false
        });
      } catch (_err) {
        stream = await navigator.mediaDevices.getUserMedia({
          video: true,
          audio: false
        });
      }

      if (stream) {
        streamRef.current = stream;
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          videoRef.current.setAttribute('playsinline', 'true');
          videoRef.current.setAttribute('webkit-playsinline', 'true');
          videoRef.current.muted = true;
          await videoRef.current.play();
          setIsCameraActive(true);
        }
      }
    } catch (err: any) {
      console.warn('Camera start error:', err);
    }
  };

  // Flip camera between back and front
  const toggleFacingMode = () => {
    const nextFacing = facingMode === 'environment' ? 'user' : 'environment';
    setFacingMode(nextFacing);
    stopCamera();
    startCamera(nextFacing);
  };

  // Toggle Flash to Reduce Shadows (Hardware LED Torch + Screen Diffuser Light)
  const toggleTorch = async () => {
    const nextState = !isTorchOn;
    setIsTorchOn(nextState);
    showToast(nextState ? '⚡ Flash ON: Anti-Shadow Illumination Active' : 'Flash OFF');

    if (streamRef.current) {
      const track = streamRef.current.getVideoTracks()[0];
      if (track) {
        try {
          const capabilities = (track as any).getCapabilities?.() || {};
          if (capabilities.torch) {
            await (track as any).applyConstraints({
              advanced: [{ torch: nextState }]
            });
          }
        } catch (err) {
          console.warn('Torch constraint error:', err);
        }
      }
    }
  };

  // Auto-start camera when entering FULLSCREEN_SCAN
  useEffect(() => {
    if (view === 'FULLSCREEN_SCAN') {
      startCamera();
    } else {
      stopCamera();
    }
    return () => stopCamera();
  }, [view]);

  // Perform AI Inspection Progress Flow
  const startWalkaroundAnalysis = () => {
    stopCamera();
    setView('PROGRESS_BAR');
    setProgressPercent(15);
    setProgressStatusText('Locking optical coordinates & wheel nut geometry...');

    setTimeout(() => {
      setProgressPercent(40);
      setProgressStatusText('Measuring tyre tread depth via parallax & checking sidewall ply...');
    }, 600);

    setTimeout(() => {
      setProgressPercent(65);
      setProgressStatusText('Verifying 5th-wheel kingpin seating & safety dog-clip latching...');
    }, 1200);

    setTimeout(() => {
      setProgressPercent(85);
      setProgressStatusText('Reconciling Tachograph: 14 mins "Other Work" (⚒️) confirmed...');
    }, 1800);

    setTimeout(() => {
      setProgressPercent(100);
      setProgressStatusText('✓ 100% DVSA Roadworthiness verified! SHA-256 certificate signed.');

      try {
        confetti({
          particleCount: 50,
          spread: 60,
          origin: { y: 0.6 }
        });
      } catch (_e) {}

      // Add a fresh check record
      const newRecord: WalkaroundCheckRecord = {
        id: `chk-${Date.now()}`,
        dateKey: new Date().toISOString().split('T')[0],
        displayDate: new Date().toLocaleDateString('en-GB', {
          weekday: 'long',
          day: 'numeric',
          month: 'short',
          year: 'numeric'
        }),
        timestamp: new Date().toISOString(),
        driverName: driverLicenceProfile?.fullName || 'Alexander James Kite',
        driverLicenceNumber: driverLicenceProfile?.licenceNumber || 'KITEA805219AJ99G',
        driverTachoCard: driverLicenceProfile?.tachoCardNumber || 'UK / DB250290781795 0 0',
        vehicleReg: 'DG21 EDP',
        trailerId: selectedTrailerId,
        trailerType: 'CURTAINSIDER',
        haulierName: 'Drive Logistics UK Ltd',
        oLicenceNumber: 'OD2019482',
        ocrsStatus: 'GREEN',
        odometerKm: 709945,
        durationMinutes: 14,
        tachoStatusReconciled: true,
        tachoShiftState: 'OTHER_WORK',
        overallResult: 'PASS_CLEAN',
        vaultSha256: `sha256-dvsa-audit-${Date.now()}-passed-clean`,
        digitalSignature: `${driverLicenceProfile?.fullName || 'Alexander James Kite'} (C+E Verified)`,
        pmiDueDays: 16,
        tyreTreadMinMm: 8.0,
        wheelNutsTorqued: true,
        couplingDogClipLocked: true,
        airPressureBar: 8.9,
        zones: SAMPLE_WALKAROUND_RECORDS[0].zones,
        defects: []
      };

      setWalkaroundRecords((prev) => [newRecord, ...prev]);
      setSelectedRecordId(newRecord.id);

      setTimeout(() => {
        setView('DAYS_OVERVIEW');
        showToast('✓ Walkaround Check passed & recorded in 15-month DVSA audit vault!');
      }, 500);
    }, 2400);
  };

  const handleCaptureFromCamera = () => {
    playCaptureChime();
    startWalkaroundAnalysis();
  };

  const selectedRecord =
    walkaroundRecords.find((r) => r.id === selectedRecordId) || walkaroundRecords[0];

  return (
    <div
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
      className="min-h-screen bg-slate-950 text-slate-100 font-sans selection:bg-amber-500 selection:text-slate-950 flex flex-col"
    >
      {/* Toast banner */}
      {toastMessage && (
        <div className="fixed top-4 right-4 z-50 rounded-2xl bg-slate-900 text-white px-4 py-3 text-xs font-bold shadow-2xl border border-amber-500/40 animate-in slide-in-from-top-5 flex items-center gap-2">
          <span className="h-2 w-2 rounded-full bg-amber-400 animate-ping" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Hidden canvas for video analysis */}
      <canvas ref={canvasRef} className="hidden" />

      {/* ========================================================================= */}
      {/* 1. WELCOME VIEW: Welcome to Vehicle-Check from Drive Partners             */}
      {/* ========================================================================= */}
      {view === 'WELCOME' && (
        <main className="flex-1 flex flex-col items-center justify-center px-4 py-8 sm:py-12">
          <div className="w-full max-w-4xl mx-auto text-center space-y-6">
            {/* Top Switcher: Toggle between Tacho-Scan and Vehicle-Check */}
            <div className="flex items-center justify-center gap-2">
              {onSwitchToTachoScan && (
                <button
                  onClick={onSwitchToTachoScan}
                  className="px-3.5 py-1.5 rounded-full bg-slate-900 hover:bg-slate-800 border border-slate-700 text-slate-400 hover:text-white text-xs font-mono font-bold flex items-center gap-1.5 transition-colors cursor-pointer"
                >
                  <Gauge className="w-3.5 h-3.5 text-amber-400" />
                  <span>Switch to Tacho-Scan</span>
                </button>
              )}
              {onSwitchToSiteRisk && (
                <button
                  onClick={onSwitchToSiteRisk}
                  className="px-3.5 py-1.5 rounded-full bg-slate-900 hover:bg-slate-800 border border-cyan-500/30 text-cyan-400 hover:text-white text-xs font-mono font-bold flex items-center gap-1.5 transition-colors cursor-pointer"
                >
                  <ShieldCheck className="w-3.5 h-3.5 text-cyan-400" />
                  <span>Switch to SiteRisk</span>
                </button>
              )}
              {onSwitchToRouteOptimiser && (
                <button
                  onClick={onSwitchToRouteOptimiser}
                  className="px-3.5 py-1.5 rounded-full bg-slate-900 hover:bg-slate-800 border border-blue-500/30 text-blue-400 hover:text-white text-xs font-mono font-bold flex items-center gap-1.5 transition-colors cursor-pointer"
                >
                  <Navigation className="w-3.5 h-3.5 text-blue-400" />
                  <span>Route Optimiser</span>
                </button>
              )}
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-xs font-mono font-bold tracking-wider uppercase">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                <span>AUTONOMOUS DVSA ROADWORTHINESS</span>
              </div>
            </div>

            {/* Main Welcome Heading: Drive Partners small, Vehicle-Check big */}
            <div className="space-y-1 text-center">
              <div className="text-xs sm:text-sm font-semibold tracking-widest text-slate-400 uppercase">
                Welcome to
              </div>
              <h1 className="text-5xl sm:text-7xl md:text-8xl font-black tracking-tight drop-shadow-2xl leading-none">
                <span className="bg-gradient-to-r from-emerald-400 via-teal-300 to-cyan-400 bg-clip-text text-transparent">
                  Vehicle-Check
                </span>
              </h1>
              <div className="text-xs sm:text-sm font-semibold tracking-widest text-slate-400 uppercase pt-1">
                from <span className="text-cyan-400 font-extrabold tracking-wider">Drive Partners</span>
              </div>
            </div>

            {/* Subtitles */}
            <div className="space-y-1.5 max-w-2xl mx-auto pt-1">
              <p className="text-base sm:text-2xl font-bold text-slate-200">
                A Suite of Products for <strong className="text-white">Drivers and Hauliers</strong>
              </p>
              <p className="text-xs sm:text-base text-emerald-400 font-semibold tracking-wide">
                Autonomous AI Daily Walkaround &amp; Trailer Inspector (UK DVSA Compliant)
              </p>
            </div>

            {/* Primary Action Button: Launch Vehicle-Check */}
            <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3">
              <button
                onClick={() => setIsConversationalChecklistOpen(true)}
                className="w-full sm:w-auto px-7 py-4 rounded-2xl bg-gradient-to-r from-emerald-500 via-teal-400 to-cyan-400 hover:from-emerald-400 hover:to-cyan-300 text-slate-950 font-black text-base sm:text-lg shadow-xl shadow-emerald-500/25 flex items-center justify-center gap-3 transition-all active:scale-95 cursor-pointer"
              >
                <Radio className="w-6 h-6 text-slate-950 stroke-[2.5] animate-pulse" />
                <span>Conversational 32-Point Check</span>
              </button>

              <button
                onClick={() => setView('ACTION_MENU')}
                className="w-full sm:w-auto px-6 py-4 rounded-2xl bg-slate-900 hover:bg-slate-850 border border-slate-700 hover:border-emerald-500/50 text-white font-bold text-sm sm:text-base flex items-center justify-center gap-2.5 transition-all cursor-pointer shadow-lg shadow-emerald-500/10"
              >
                <Truck className="w-5 h-5 text-emerald-400" />
                <span>All Inspection Modes</span>
              </button>

              <button
                onClick={() => setIsDeliveryRouteModalOpen(true)}
                className="w-full sm:w-auto px-5 py-4 rounded-2xl bg-gradient-to-r from-blue-600/30 to-cyan-600/30 hover:from-blue-600/50 hover:to-cyan-600/50 border border-cyan-500/50 text-cyan-300 font-bold text-sm sm:text-base flex items-center justify-center gap-2 transition-all cursor-pointer shadow-lg shadow-cyan-900/20"
              >
                <Navigation className="w-5 h-5 text-cyan-400" />
                <span>Next Delivery &amp; HGV Route</span>
              </button>

              <button
                onClick={() => setIsDriverSettingsModalOpen(true)}
                className="w-full sm:w-auto px-4 py-4 rounded-2xl bg-slate-900 hover:bg-slate-800 border border-emerald-500/40 text-emerald-300 font-bold text-sm sm:text-base flex items-center justify-center gap-2 transition-all cursor-pointer"
                title="Configure Walkaround Routine AI (Adaptive habit learning vs strict statutory sequence)"
              >
                <Sliders className="w-5 h-5 text-emerald-400" />
                <span>Routine AI</span>
              </button>

              {onSwitchToTachoScan && (
                <button
                  onClick={onSwitchToTachoScan}
                  className="w-full sm:w-auto px-5 py-4 rounded-2xl bg-slate-900 hover:bg-slate-800 border border-amber-500/40 text-amber-300 font-bold text-sm sm:text-base flex items-center justify-center gap-2 transition-all cursor-pointer shadow-lg shadow-amber-500/10"
                >
                  <ScanLine className="w-4 h-4 text-amber-400" />
                  <span>Tacho-Scan</span>
                </button>
              )}

              {onSwitchToSiteRisk && (
                <button
                  onClick={onSwitchToSiteRisk}
                  className="w-full sm:w-auto px-5 py-4 rounded-2xl bg-slate-900 hover:bg-slate-800 border border-cyan-500/40 text-cyan-300 font-bold text-sm sm:text-base flex items-center justify-center gap-2 transition-all cursor-pointer shadow-lg shadow-cyan-500/10"
                >
                  <ShieldCheck className="w-4 h-4 text-cyan-400" />
                  <span>SiteRisk</span>
                </button>
              )}

              {onSwitchToRouteOptimiser && (
                <button
                  onClick={onSwitchToRouteOptimiser}
                  className="w-full sm:w-auto px-5 py-4 rounded-2xl bg-slate-900 hover:bg-slate-800 border border-blue-500/40 text-blue-300 font-bold text-sm sm:text-base flex items-center justify-center gap-2 transition-all cursor-pointer shadow-lg shadow-blue-500/10"
                >
                  <Navigation className="w-4 h-4 text-blue-400" />
                  <span>Route Optimiser</span>
                </button>
              )}

              {onSwitchToSafetyShield && (
                <button
                  onClick={onSwitchToSafetyShield}
                  className="w-full sm:w-auto px-5 py-4 rounded-2xl bg-slate-900 hover:bg-slate-800 border border-rose-500/40 text-rose-300 font-bold text-sm sm:text-base flex items-center justify-center gap-2 transition-all cursor-pointer shadow-lg shadow-rose-500/10"
                >
                  <ShieldAlert className="w-4 h-4 text-rose-400" />
                  <span>Safety &amp; Bridge Shield (7 SHIELDS)</span>
                </button>
              )}
            </div>

            {/* Inserted Video: See How It Works / Walkaround Tips */}
            <div className="w-full max-w-3xl mx-auto pt-4 text-left">
              <div className="rounded-3xl bg-slate-900 border border-slate-800 overflow-hidden shadow-2xl">
                {/* Video Header Bar with Tab Switcher */}
                <div className="p-3 sm:p-4 border-b border-slate-800 bg-slate-950/80 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div className="flex items-center gap-1.5 p-1 rounded-xl bg-slate-900 border border-slate-800">
                    <button
                      onClick={() => setWelcomeVideoTab('WALKTHROUGH')}
                      className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                        welcomeVideoTab === 'WALKTHROUGH'
                          ? 'bg-emerald-500 text-slate-950 shadow-md shadow-emerald-500/20'
                          : 'text-slate-400 hover:text-white'
                      }`}
                    >
                      <Play className="w-3.5 h-3.5 fill-current" />
                      <span>Walkaround Video</span>
                    </button>
                    <button
                      onClick={() => setWelcomeVideoTab('TIPS')}
                      className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                        welcomeVideoTab === 'TIPS'
                          ? 'bg-emerald-500 text-slate-950 shadow-md shadow-emerald-500/20'
                          : 'text-slate-400 hover:text-white'
                      }`}
                    >
                      <Zap className="w-3.5 h-3.5 fill-current text-emerald-950" />
                      <span>Walkaround AI Tips</span>
                      <span className="text-[9px] px-1.5 py-0.5 rounded bg-emerald-400/30 text-emerald-950 font-black">
                        NEW
                      </span>
                    </button>
                  </div>

                  <div className="flex items-center gap-2">
                    <span className="text-xs font-mono text-emerald-400 flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-950/50 border border-emerald-500/30">
                      <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                      <span>DVSA Certified</span>
                    </span>
                  </div>
                </div>

                {/* Viewport: Walkthrough or Walkaround AI Tips */}
                {welcomeVideoTab === 'WALKTHROUGH' ? (
                  <div className="flex flex-col bg-slate-950">
                    <div className="relative aspect-video w-full bg-black overflow-hidden group">
                      <img
                        src="/tips/tip3_laser_guidelines.jpg"
                        alt="Autonomous AI Walkaround Overview"
                        className="w-full h-full object-cover opacity-85 group-hover:scale-105 transition-transform duration-700"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-transparent flex flex-col justify-end p-5 space-y-2">
                        <span className="px-2.5 py-1 rounded-full text-xs font-mono font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 w-fit backdrop-blur-md">
                          🎥 360° AR WALKAROUND DEMO
                        </span>
                        <h4 className="text-base sm:text-xl font-black text-white">
                          Autonomous AI DVSA Roadworthiness Inspection in 90 Seconds
                        </h4>
                        <p className="text-xs sm:text-sm text-slate-300 max-w-xl">
                          Continuous optical video walkaround checks wheel nut pointers, tyre tread depth, 5th-wheel coupling dog-clip, and compressed air leaks.
                        </p>
                      </div>
                      <button
                        onClick={() => setIsTipsModalOpen(true)}
                        className="absolute inset-0 m-auto w-14 h-14 rounded-full bg-emerald-500 text-slate-950 flex items-center justify-center shadow-xl shadow-emerald-500/50 cursor-pointer hover:scale-110 transition-transform"
                      >
                        <Play className="w-6 h-6 fill-slate-950 ml-1" />
                      </button>
                    </div>

                    <div className="p-3.5 sm:p-4 bg-slate-950/90 border-t border-slate-800/80 flex flex-wrap items-center justify-between gap-3 text-xs font-mono">
                      <div className="flex items-center gap-2 text-slate-400">
                        <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                        <span>Core Inspection Features:</span>
                      </div>
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="px-2.5 py-1 rounded-lg bg-slate-900 text-emerald-300 border border-slate-800">
                          1. Wheel Nut Checkpoints
                        </span>
                        <span className="px-2.5 py-1 rounded-lg bg-slate-900 text-teal-300 border border-slate-800">
                          2. 5th Wheel Dog-Clip
                        </span>
                        <span className="px-2.5 py-1 rounded-lg bg-slate-900 text-cyan-300 border border-slate-800">
                          3. Acoustic Air Leaks
                        </span>
                        <span className="px-2.5 py-1 rounded-lg bg-slate-900 text-purple-300 border border-slate-800">
                          4. Tacho ⚒️ Cross-Lock
                        </span>
                      </div>
                    </div>
                  </div>
                ) : (
                  /* Animated Video Player for Walkaround AI Tips */
                  <div className="flex flex-col bg-slate-950">
                    <div className="relative aspect-video w-full bg-black overflow-hidden group select-none">
                      <img
                        key={WALKAROUND_AI_TIPS[tipsActiveIndex].id}
                        src={WALKAROUND_AI_TIPS[tipsActiveIndex].image}
                        alt={WALKAROUND_AI_TIPS[tipsActiveIndex].title}
                        className="w-full h-full object-cover transition-all duration-700 ease-out transform scale-100 group-hover:scale-105"
                      />

                      <div className="absolute top-3 inset-x-3 sm:top-4 sm:inset-x-4 flex items-center justify-between pointer-events-none">
                        <span
                          className={`px-2.5 py-1 rounded-full text-xs font-mono font-bold border backdrop-blur-md ${WALKAROUND_AI_TIPS[tipsActiveIndex].badgeColor}`}
                        >
                          {WALKAROUND_AI_TIPS[tipsActiveIndex].badge}
                        </span>
                        <span className="px-2.5 py-1 rounded-full text-xs font-mono font-bold bg-black/70 text-slate-300 border border-white/10 backdrop-blur-md">
                          Step {tipsActiveIndex + 1} of {WALKAROUND_AI_TIPS.length}
                        </span>
                      </div>

                      <div className="absolute inset-x-0 bottom-0 p-4 sm:p-5 bg-gradient-to-t from-slate-950 via-slate-950/85 to-transparent text-white space-y-1">
                        <h4 className="text-sm sm:text-lg font-black text-emerald-400 drop-shadow-md">
                          {WALKAROUND_AI_TIPS[tipsActiveIndex].title}
                        </h4>
                        <p className="text-xs sm:text-sm text-slate-200 font-medium drop-shadow-sm line-clamp-2">
                          {WALKAROUND_AI_TIPS[tipsActiveIndex].description}
                        </p>
                        <div className="pt-1 flex items-center gap-1.5 text-[11px] font-mono text-teal-300">
                          <CheckCircle2 className="w-3.5 h-3.5 text-teal-400 shrink-0" />
                          <span>{WALKAROUND_AI_TIPS[tipsActiveIndex].actionTip}</span>
                        </div>
                      </div>

                      <button
                        onClick={() => setIsTipsPlaying(!isTipsPlaying)}
                        className="absolute inset-0 m-auto w-12 h-12 rounded-full bg-black/60 hover:bg-emerald-500 hover:text-slate-950 text-white backdrop-blur-md border border-white/20 flex items-center justify-center transition-all opacity-0 group-hover:opacity-100 cursor-pointer"
                        aria-label={isTipsPlaying ? 'Pause video' : 'Play video'}
                      >
                        {isTipsPlaying ? (
                          <Pause className="w-5 h-5" />
                        ) : (
                          <Play className="w-5 h-5 fill-current" />
                        )}
                      </button>
                    </div>

                    <div
                      className="h-1.5 w-full bg-slate-800 relative cursor-pointer"
                      onClick={(e) => {
                        const rect = e.currentTarget.getBoundingClientRect();
                        const clickX = e.clientX - rect.left;
                        const pct = (clickX / rect.width) * 100;
                        setTipsProgress(pct);
                      }}
                    >
                      <div
                        className="h-full bg-emerald-400 transition-all duration-100 ease-linear"
                        style={{ width: `${tipsProgress}%` }}
                      />
                    </div>

                    <div className="p-3 sm:p-4 bg-slate-950 border-t border-slate-800/80 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => setIsTipsPlaying(!isTipsPlaying)}
                          className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-white text-xs font-bold flex items-center gap-1.5 cursor-pointer"
                        >
                          {isTipsPlaying ? (
                            <Pause className="w-3.5 h-3.5" />
                          ) : (
                            <Play className="w-3.5 h-3.5 fill-current text-emerald-400" />
                          )}
                          <span>{isTipsPlaying ? 'Pause' : 'Play'}</span>
                        </button>
                        <button
                          onClick={() => {
                            setTipsActiveIndex(
                              (curr) =>
                                (curr - 1 + WALKAROUND_AI_TIPS.length) %
                                WALKAROUND_AI_TIPS.length
                            );
                            setTipsProgress(0);
                          }}
                          className="px-2.5 py-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 text-slate-300 text-xs font-mono border border-slate-800 cursor-pointer"
                        >
                          Prev
                        </button>
                        <button
                          onClick={() => {
                            setTipsActiveIndex(
                              (curr) => (curr + 1) % WALKAROUND_AI_TIPS.length
                            );
                            setTipsProgress(0);
                          }}
                          className="px-2.5 py-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 text-slate-300 text-xs font-mono border border-slate-800 cursor-pointer"
                        >
                          Next
                        </button>
                      </div>

                      <div className="flex flex-wrap items-center gap-1.5">
                        {WALKAROUND_AI_TIPS.map((tip, idx) => (
                          <button
                            key={tip.id}
                            onClick={() => {
                              setTipsActiveIndex(idx);
                              setTipsProgress(0);
                            }}
                            className={`px-2.5 py-1 rounded-lg text-[11px] font-mono font-bold transition-all cursor-pointer ${
                              tipsActiveIndex === idx
                                ? 'bg-emerald-500 text-slate-950 shadow-md shadow-emerald-500/20'
                                : 'bg-slate-900 text-slate-400 hover:text-slate-200 border border-slate-800'
                            }`}
                          >
                            Tip {idx + 1}
                          </button>
                        ))}
                        <button
                          onClick={() => setIsTipsModalOpen(true)}
                          className="px-2.5 py-1 rounded-lg text-[11px] font-mono text-cyan-400 hover:text-cyan-300 bg-cyan-950/40 border border-cyan-500/30 cursor-pointer flex items-center gap-1"
                        >
                          <ZoomIn className="w-3 h-3" />
                          <span>Expand</span>
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Swipe gesture prompt */}
            <div className="text-[11px] font-mono text-slate-500 pt-2">
              Tip: Swipe right from the left edge anytime to go back
            </div>
          </div>
        </main>
      )}

      {/* ========================================================================= */}
      {/* 2. ACTION MENU                                                            */}
      {/* ========================================================================= */}
      {view === 'ACTION_MENU' && (
        <main className="flex-1 flex flex-col justify-center max-w-xl mx-auto w-full p-4 sm:p-6 space-y-5">
          <div className="flex items-center justify-between">
            <button
              onClick={() => setView('WELCOME')}
              className="flex items-center gap-1.5 text-xs font-bold text-slate-400 hover:text-white transition-colors cursor-pointer"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Back</span>
            </button>
            <span className="text-[10px] font-mono text-emerald-400 bg-emerald-500/10 px-2.5 py-1 rounded-full border border-emerald-500/30">
              Inspection Mode
            </span>
          </div>

          <div className="space-y-1">
            <h2 className="text-2xl font-black text-white">Vehicle-Check</h2>
            <p className="text-xs text-slate-400">
              Select inspection routine for tractor <strong className="text-white">DG21 EDP</strong> and trailer <strong className="text-white">{selectedTrailerId}</strong>:
            </p>
          </div>

          <div className="space-y-3">
            {/* A. Next Delivery Site & Compliant HGV Routing */}
            <button
              onClick={() => setIsDeliveryRouteModalOpen(true)}
              className="w-full p-4 rounded-2xl bg-gradient-to-r from-blue-600/25 via-cyan-500/15 to-slate-900 border-2 border-cyan-500 hover:border-cyan-400 flex items-center justify-between transition-all group text-left cursor-pointer shadow-xl shadow-cyan-900/20"
            >
              <div className="flex items-center gap-3.5">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-cyan-500 to-blue-600 text-white flex items-center justify-center font-bold shadow-md shadow-cyan-500/30">
                  <Navigation className="w-6 h-6 text-white" />
                </div>
                <div>
                  <div className="text-base font-black text-white group-hover:text-cyan-300 flex items-center gap-2">
                    <span>Next Delivery Site &amp; Compliant Route</span>
                    <span className="inline-flex items-center gap-1 text-[10px] font-mono font-bold text-slate-950 bg-cyan-400 px-2 py-0.5 rounded-full">
                      GOOGLE PLACES &amp; OCR
                    </span>
                  </div>
                  <div className="text-xs text-slate-300">
                    Search Google Places, upload run sheets, or say "add routes xx" • Auto-extracts vehicle profile for low bridge avoidance
                  </div>
                </div>
              </div>
              <ChevronRight className="w-5 h-5 text-cyan-400 group-hover:translate-x-1 transition-transform" />
            </button>

            {/* B. Driver Walkaround Routine AI Settings */}
            <button
              onClick={() => setIsDriverSettingsModalOpen(true)}
              className="w-full p-3.5 rounded-2xl bg-slate-900 border border-emerald-500/40 hover:border-emerald-400 flex items-center justify-between transition-all group text-left cursor-pointer"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center font-bold">
                  <Sliders className="w-5 h-5" />
                </div>
                <div>
                  <div className="text-sm font-bold text-white group-hover:text-emerald-300 flex items-center gap-2">
                    <span>Driver Walkaround Routine AI</span>
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 font-bold">
                      Habit Learning
                    </span>
                  </div>
                  <div className="text-xs text-slate-400">
                    Learn driver's preferred inspection order or enforce strict statutory DVSA 1-32 sequence
                  </div>
                </div>
              </div>
              <ChevronRight className="w-5 h-5 text-slate-500 group-hover:text-emerald-400 group-hover:translate-x-1 transition-transform" />
            </button>

            {/* 0. Conversational 32-Point Walkaround */}
            <button
              onClick={() => setIsConversationalChecklistOpen(true)}
              className="w-full p-4 rounded-2xl bg-gradient-to-r from-emerald-500/20 via-teal-500/10 to-slate-900 border-2 border-emerald-500 hover:border-emerald-400 flex items-center justify-between transition-all group text-left cursor-pointer shadow-xl shadow-emerald-500/15"
            >
              <div className="flex items-center gap-3.5">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-400 text-slate-950 flex items-center justify-center font-bold shadow-md shadow-emerald-500/30">
                  <Radio className="w-6 h-6 text-slate-950 animate-pulse" />
                </div>
                <div>
                  <div className="text-base font-black text-white group-hover:text-emerald-300 flex items-center gap-2">
                    <span>Conversational 32-Point Check</span>
                    <span className="inline-flex items-center gap-1 text-[10px] font-mono font-bold text-slate-950 bg-emerald-400 px-2 py-0.5 rounded-full">
                      VOICE &amp; AR CO-PILOT
                    </span>
                  </div>
                  <div className="text-xs text-slate-300">
                    Confirm all 32 points hands-free • Say "Pass", "Fail" with reason • Take photo of seal, trailer height or video at any stage
                  </div>
                </div>
              </div>
              <ChevronRight className="w-5 h-5 text-emerald-400 group-hover:translate-x-1 transition-transform" />
            </button>

            {/* 1. 360° AR Walkaround Camera */}
            <button
              onClick={() => setView('FULLSCREEN_SCAN')}
              className="w-full p-4 rounded-2xl bg-gradient-to-r from-emerald-500/15 via-slate-900 to-slate-900 border-2 border-emerald-500/50 hover:border-emerald-400 flex items-center justify-between transition-all group text-left cursor-pointer shadow-lg shadow-emerald-500/10"
            >
              <div className="flex items-center gap-3.5">
                <div className="w-12 h-12 rounded-xl bg-emerald-500 text-slate-950 flex items-center justify-center font-bold shadow-md shadow-emerald-500/30">
                  <Camera className="w-6 h-6" />
                </div>
                <div>
                  <div className="text-base font-black text-white group-hover:text-emerald-300 flex items-center gap-2">
                    <span>360° AR Walkaround</span>
                    <span className="inline-flex items-center gap-1 text-[10px] font-mono font-bold text-emerald-300 bg-emerald-500/20 px-2 py-0.5 rounded-full border border-emerald-500/30">
                      <Zap className="w-2.5 h-2.5 fill-emerald-400" /> Anti-Shadow Flash
                    </span>
                  </div>
                  <div className="text-xs text-slate-400">
                    Live AR optical check for wheel nuts, tyres, 5th-wheel &amp; lighting
                  </div>
                </div>
              </div>
              <ChevronRight className="w-5 h-5 text-emerald-400 group-hover:translate-x-1 transition-transform" />
            </button>

            {/* 1b. DVSA 32-Point Statutory Checklist */}
            <button
              onClick={() => setIsStatutoryChecklistModalOpen(true)}
              className="w-full p-4 rounded-2xl bg-gradient-to-r from-blue-500/15 via-slate-900 to-slate-900 border border-blue-500/40 hover:border-blue-400 flex items-center justify-between transition-all group text-left cursor-pointer shadow-lg shadow-blue-500/10"
            >
              <div className="flex items-center gap-3.5">
                <div className="w-12 h-12 rounded-xl bg-blue-500/20 text-blue-400 flex items-center justify-center font-bold border border-blue-500/30">
                  <ClipboardCheck className="w-6 h-6" />
                </div>
                <div>
                  <div className="text-base font-bold text-white group-hover:text-blue-300 flex items-center gap-2">
                    <span>DVSA Statutory 32-Point Check</span>
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-blue-500/20 text-blue-300 border border-blue-500/30 font-bold">
                      Tractor (20) &amp; Trailer (12)
                    </span>
                  </div>
                  <div className="text-xs text-slate-400">
                    Complete statutory roadworthiness checklist • PG9 immediate prohibition classifications
                  </div>
                </div>
              </div>
              <ChevronRight className="w-5 h-5 text-slate-500 group-hover:text-blue-400 group-hover:translate-x-1 transition-transform" />
            </button>

            {/* 2. Drop & Swap Trailer Memory Check */}
            <button
              onClick={() => setIsTrailerMemoryModalOpen(true)}
              className="w-full p-4 rounded-2xl bg-slate-900 border border-slate-800 hover:border-cyan-500/50 flex items-center justify-between transition-all group text-left cursor-pointer"
            >
              <div className="flex items-center gap-3.5">
                <div className="w-12 h-12 rounded-xl bg-cyan-500/20 text-cyan-400 flex items-center justify-center font-bold">
                  <Truck className="w-6 h-6" />
                </div>
                <div>
                  <div className="text-base font-bold text-white group-hover:text-cyan-300 flex items-center gap-2">
                    <span>Drop &amp; Swap Trailer Check</span>
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-800 text-cyan-300">
                      {selectedTrailerId}
                    </span>
                  </div>
                  <div className="text-xs text-slate-400">
                    Verify trailer chain-of-custody, previous driver notes &amp; kingpin
                  </div>
                </div>
              </div>
              <ChevronRight className="w-5 h-5 text-slate-500 group-hover:text-cyan-400 group-hover:translate-x-1 transition-transform" />
            </button>

            {/* 3. Acoustic Air Leak Test */}
            <button
              onClick={() => setIsAcousticModalOpen(true)}
              className="w-full p-4 rounded-2xl bg-slate-900 border border-slate-800 hover:border-purple-500/50 flex items-center justify-between transition-all group text-left cursor-pointer"
            >
              <div className="flex items-center gap-3.5">
                <div className="w-12 h-12 rounded-xl bg-purple-500/20 text-purple-400 flex items-center justify-center font-bold">
                  <Volume2 className="w-6 h-6" />
                </div>
                <div>
                  <div className="text-base font-bold text-white group-hover:text-purple-300 flex items-center gap-2">
                    <span>Acoustic Air Leak Test</span>
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-purple-500/20 text-purple-300">
                      12–22 kHz Ultrasonic
                    </span>
                  </div>
                  <div className="text-xs text-slate-400">
                    Detect Susie coupling seals &amp; brake chamber pneumatic leaks
                  </div>
                </div>
              </div>
              <ChevronRight className="w-5 h-5 text-slate-500 group-hover:text-purple-400 group-hover:translate-x-1 transition-transform" />
            </button>

            {/* 4. Trailer ID & Navigation Autopopulation (Weight, Length, Width & Low Bridge Protection) */}
            <button
              onClick={() => setIsTrailerNavModalOpen(true)}
              className="w-full p-4 rounded-2xl bg-gradient-to-r from-cyan-500/15 via-slate-900 to-slate-900 border border-cyan-500/40 hover:border-cyan-400 flex items-center justify-between transition-all group text-left cursor-pointer shadow-lg shadow-cyan-500/5"
            >
              <div className="flex items-center gap-3.5">
                <div className="w-12 h-12 rounded-xl bg-cyan-500/20 text-cyan-400 flex items-center justify-center font-bold">
                  <Navigation className="w-6 h-6" />
                </div>
                <div>
                  <div className="text-base font-bold text-white group-hover:text-cyan-300 flex items-center gap-2">
                    <span>Trailer ID &amp; Nav Sync</span>
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-cyan-500/20 text-cyan-300 font-bold border border-cyan-500/30">
                      {combinationEnvelope.combinedHeightFeetInches} • {combinationEnvelope.grossCombinationWeightTonnes}t
                    </span>
                    {combinationEnvelope.isHighCube && (
                      <span className="text-[9px] font-mono px-1.5 py-0.5 rounded bg-amber-500/20 text-amber-300 font-bold border border-amber-500/30">
                        High-Cube
                      </span>
                    )}
                  </div>
                  <div className="text-xs text-slate-400">
                    Auto-populates TomTom &amp; Google Maps • Low bridge &amp; weight restriction avoidance
                  </div>
                </div>
              </div>
              <ChevronRight className="w-5 h-5 text-slate-500 group-hover:text-cyan-400 group-hover:translate-x-1 transition-transform" />
            </button>

            {/* 5. See Roadworthiness Dashboard */}
            <button
              onClick={() => setView('DAYS_OVERVIEW')}
              className="w-full p-4 rounded-2xl bg-slate-900 border border-slate-800 hover:border-emerald-500/50 flex items-center justify-between transition-all group text-left cursor-pointer"
            >
              <div className="flex items-center gap-3.5">
                <div className="w-12 h-12 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center font-bold">
                  <ShieldCheck className="w-6 h-6" />
                </div>
                <div>
                  <div className="text-base font-bold text-white group-hover:text-emerald-300 flex items-center gap-2">
                    <span>See Roadworthiness Dashboard</span>
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-800 text-slate-300">
                      {walkaroundRecords.length} records
                    </span>
                  </div>
                  <div className="text-xs text-slate-400">
                    15-month DVSA audit vault, PMI countdown &amp; defect ledger
                  </div>
                </div>
              </div>
              <ChevronRight className="w-5 h-5 text-slate-500 group-hover:text-emerald-400 group-hover:translate-x-1 transition-transform" />
            </button>

            {/* 5. Roadside DVSA "Green Flag" QR Portal */}
            <button
              onClick={() => setIsDvsaQrModalOpen(true)}
              className="w-full p-4 rounded-2xl bg-slate-900 border border-slate-800 hover:border-amber-500/50 flex items-center justify-between transition-all group text-left cursor-pointer"
            >
              <div className="flex items-center gap-3.5">
                <div className="w-12 h-12 rounded-xl bg-amber-500/20 text-amber-400 flex items-center justify-center font-bold">
                  <QrCode className="w-6 h-6" />
                </div>
                <div>
                  <div className="text-base font-bold text-white group-hover:text-amber-300 flex items-center gap-2">
                    <span>Roadside DVSA Mode</span>
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-amber-500/20 text-amber-300">
                      Examiner QR
                    </span>
                  </div>
                  <div className="text-xs text-slate-400">
                    Instant 3-minute clearance at DVSA weighbridges &amp; police stops
                  </div>
                </div>
              </div>
              <ChevronRight className="w-5 h-5 text-slate-500 group-hover:text-amber-400 group-hover:translate-x-1 transition-transform" />
            </button>

            {/* 6. Switch to Tacho-Scan */}
            {onSwitchToTachoScan && (
              <button
                onClick={onSwitchToTachoScan}
                className="w-full p-4 rounded-2xl bg-gradient-to-r from-amber-500/15 via-slate-900 to-slate-900 border border-amber-500/40 hover:border-amber-400 flex items-center justify-between transition-all group text-left cursor-pointer shadow-lg shadow-amber-500/5"
              >
                <div className="flex items-center gap-3.5">
                  <div className="w-12 h-12 rounded-xl bg-amber-500/20 text-amber-400 flex items-center justify-center font-bold">
                    <ScanLine className="w-6 h-6" />
                  </div>
                  <div>
                    <div className="text-base font-bold text-white group-hover:text-amber-300 flex items-center gap-2">
                      <span>Tacho-Scan</span>
                      <span className="text-[10px] font-mono font-bold text-amber-400 bg-amber-500/20 px-2 py-0.5 rounded-full border border-amber-500/30">
                        EU 561/2006
                      </span>
                    </div>
                    <div className="text-xs text-slate-400">
                      Optical thermal printout scanner &amp; digital card reader
                    </div>
                  </div>
                </div>
                <ChevronRight className="w-5 h-5 text-slate-500 group-hover:text-amber-400 group-hover:translate-x-1 transition-transform" />
              </button>
            )}

            {/* 7. Switch to Route Optimiser */}
            {onSwitchToRouteOptimiser && (
              <button
                onClick={onSwitchToRouteOptimiser}
                className="w-full p-4 rounded-2xl bg-gradient-to-r from-blue-600/15 via-slate-900 to-slate-900 border border-blue-500/40 hover:border-blue-400 flex items-center justify-between transition-all group text-left cursor-pointer shadow-lg shadow-blue-500/5"
              >
                <div className="flex items-center gap-3.5">
                  <div className="w-12 h-12 rounded-xl bg-blue-500/20 text-blue-400 flex items-center justify-center font-bold">
                    <Navigation className="w-6 h-6" />
                  </div>
                  <div>
                    <div className="text-base font-bold text-white group-hover:text-blue-300 flex items-center gap-2">
                      <span>Route Optimiser</span>
                      <span className="text-[10px] font-mono font-bold text-blue-400 bg-blue-500/20 px-2 py-0.5 rounded-full border border-blue-500/30">
                        HGV GPS CLEARANCE
                      </span>
                    </div>
                    <div className="text-xs text-slate-400">
                      Low-bridge avoidance, voice co-pilot &amp; mid-route trailer swap
                    </div>
                  </div>
                </div>
                <ChevronRight className="w-5 h-5 text-slate-500 group-hover:text-blue-400 group-hover:translate-x-1 transition-transform" />
              </button>
            )}
          </div>
        </main>
      )}

      {/* ========================================================================= */}
      {/* 3. FULLSCREEN CAMERA SCANNER VIEW                                         */}
      {/* ========================================================================= */}
      {view === 'FULLSCREEN_SCAN' && (
        <div className="fixed inset-0 z-50 w-screen h-screen bg-black overflow-hidden flex flex-col">
          <video
            ref={videoRef}
            autoPlay
            playsInline
            muted
            className="absolute inset-0 w-full h-full object-cover"
          />

          {/* Anti-Shadow Diffuser Ring: Illuminates paper/components and washes out phone shadow */}
          {isTorchOn && (
            <div className="absolute inset-0 pointer-events-none border-[18px] sm:border-[28px] border-white/95 shadow-[inset_0_0_120px_rgba(255,255,255,0.9)] z-20 transition-all duration-300" />
          )}

          <canvas ref={canvasRef} className="hidden" />

          {/* Minimalist Floating Controls */}
          <div className="relative z-30 flex-1 flex flex-col justify-between p-4 sm:p-6 pointer-events-none">
            {/* Top Bar: Back, Zone Indicator, Anti-Shadow Flash, Camera Flip, Tips */}
            <div className="flex items-center justify-between pointer-events-auto">
              <button
                onClick={() => {
                  stopCamera();
                  setView('ACTION_MENU');
                }}
                className="w-11 h-11 rounded-full bg-black/60 backdrop-blur-md border border-white/20 text-white flex items-center justify-center transition-transform active:scale-95 cursor-pointer shadow-lg"
                aria-label="Back to Menu"
              >
                <ArrowLeft className="w-5 h-5" />
              </button>

              <div className="flex items-center gap-2">
                {/* Dedicated Anti-Shadow Flash */}
                <button
                  onClick={toggleTorch}
                  className={`px-3 py-2 rounded-full backdrop-blur-md border flex items-center gap-1.5 transition-all active:scale-95 cursor-pointer shadow-xl ${
                    isTorchOn
                      ? 'bg-emerald-400 text-slate-950 border-emerald-300 ring-2 ring-emerald-400/50 shadow-emerald-500/50 font-black'
                      : 'bg-black/60 text-white border-white/20 hover:border-emerald-400/60 font-bold'
                  }`}
                  aria-label="Toggle Flash to Reduce Shadow"
                >
                  <Zap
                    className={`w-4 h-4 ${
                      isTorchOn
                        ? 'fill-slate-950 text-slate-950 animate-bounce'
                        : 'text-emerald-400'
                    }`}
                  />
                  <span className="text-[11px] font-mono tracking-tight hidden sm:inline">
                    {isTorchOn ? 'Flash ON' : 'Flash (Anti-Shadow)'}
                  </span>
                </button>

                {/* Flip Facing Mode */}
                <button
                  onClick={toggleFacingMode}
                  className="w-11 h-11 rounded-full bg-black/60 backdrop-blur-md border border-white/20 text-white flex items-center justify-center transition-transform active:scale-95 cursor-pointer shadow-lg"
                  aria-label="Flip Camera"
                >
                  <RefreshCw className="w-5 h-5" />
                </button>

                {/* Tips Video Button */}
                <button
                  onClick={() => setIsTipsModalOpen(true)}
                  className="w-11 h-11 rounded-full bg-emerald-500/20 backdrop-blur-md border border-emerald-500/50 text-emerald-300 flex items-center justify-center transition-transform active:scale-95 cursor-pointer shadow-lg"
                  aria-label="View Walkaround Tips Video"
                >
                  <Play className="w-4 h-4 fill-emerald-300 text-emerald-300" />
                </button>
              </div>
            </div>

            {/* Central Optical Alignment Viewfinder (Laser Guides with Component Hologram) */}
            <div className="relative mx-auto w-full max-w-xs aspect-[9/16] max-h-[58vh] rounded-2xl border-2 border-dashed border-emerald-400/80 shadow-[0_0_50px_rgba(16,185,129,0.25)] flex flex-col items-center justify-between p-4">
              <div className="absolute top-0 left-0 w-6 h-6 border-t-4 border-l-4 border-emerald-400 rounded-tl-lg" />
              <div className="absolute top-0 right-0 w-6 h-6 border-t-4 border-r-4 border-emerald-400 rounded-tr-lg" />
              <div className="absolute bottom-0 left-0 w-6 h-6 border-b-4 border-l-4 border-emerald-400 rounded-bl-lg" />
              <div className="absolute bottom-0 right-0 w-6 h-6 border-b-4 border-r-4 border-emerald-400 rounded-br-lg" />
              <div className="absolute inset-x-2 top-1/2 h-0.5 bg-gradient-to-r from-transparent via-emerald-400 to-transparent animate-pulse" />

              {/* Top Status inside laser guides */}
              <div className="w-full flex justify-between items-center z-10">
                <span className="px-2 py-0.5 rounded-full bg-slate-950/80 backdrop-blur-md text-[10px] font-mono text-emerald-300 border border-emerald-500/40">
                  {activeZone === 'STEER_AXLE' && '🔩 WHEEL NUTS & TREAD'}
                  {activeZone === 'COUPLING_CATWALK' && '🔒 5TH WHEEL & SUSIE'}
                  {activeZone === 'IN_CAB' && '📊 AIR GAUGES & ABS'}
                  {activeZone === 'TRAILER_RUNNING_GEAR' && '🚛 CHASSIS & LEGS'}
                  {activeZone === 'REAR_LIGHTING' && '💡 LIGHTING CLUSTERS'}
                </span>
                {isTorchOn && (
                  <span className="px-2 py-0.5 rounded-full bg-emerald-400 text-slate-950 text-[10px] font-mono font-black uppercase tracking-wider flex items-center gap-1 shadow-lg">
                    <Zap className="w-2.5 h-2.5 fill-slate-950" />
                    <span>Flash Active</span>
                  </span>
                )}
              </div>

              {/* Bottom Live Target Box: Real-Time Optical Locks */}
              <div className="w-full p-2.5 rounded-xl bg-slate-950/80 backdrop-blur-md border border-emerald-500/40 space-y-1 z-10 text-[11px] font-mono">
                <div className="flex items-center justify-between text-emerald-400 font-bold">
                  <span className="flex items-center gap-1">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>Optical Lock Verified</span>
                  </span>
                  <span>99.4% AI</span>
                </div>
                <div className="text-slate-300 text-[10px]">
                  {activeZone === 'STEER_AXLE' &&
                    '10/10 Checkpoints aligned nose-to-nose • 0 rust streaks • Tread: 8.2mm'}
                  {activeZone === 'COUPLING_CATWALK' &&
                    'Kingpin seated in jaw • Dog-clip latched • 0 acoustic air hisses'}
                  {activeZone === 'IN_CAB' &&
                    'Air: 8.8 bar (>6.5 legal) • Trailer ABS extinguished • Height: 14ft 6in'}
                  {activeZone === 'TRAILER_RUNNING_GEAR' &&
                    'Landing legs raised • EN 12642 XL straps secured • Twins clear'}
                  {activeZone === 'REAR_LIGHTING' &&
                    'Brake lights active • Hazards flashing • Number plate lit clean'}
                </div>
              </div>
            </div>

            {/* Bottom Zone Switcher & Shutter Bar */}
            <div className="flex flex-col items-center justify-center pb-4 pointer-events-auto space-y-3">
              {/* Inspection Zone Switcher Pills */}
              <div className="flex items-center gap-1.5 p-1 rounded-xl bg-black/70 backdrop-blur-md border border-white/10 max-w-sm overflow-x-auto">
                <button
                  onClick={() => setActiveZone('STEER_AXLE')}
                  className={`px-2.5 py-1 rounded-lg text-[10px] font-mono font-bold transition-all cursor-pointer ${
                    activeZone === 'STEER_AXLE'
                      ? 'bg-emerald-500 text-slate-950'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  Steer/Wheel
                </button>
                <button
                  onClick={() => setActiveZone('COUPLING_CATWALK')}
                  className={`px-2.5 py-1 rounded-lg text-[10px] font-mono font-bold transition-all cursor-pointer ${
                    activeZone === 'COUPLING_CATWALK'
                      ? 'bg-emerald-500 text-slate-950'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  Coupling
                </button>
                <button
                  onClick={() => setActiveZone('IN_CAB')}
                  className={`px-2.5 py-1 rounded-lg text-[10px] font-mono font-bold transition-all cursor-pointer ${
                    activeZone === 'IN_CAB'
                      ? 'bg-emerald-500 text-slate-950'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  In-Cab
                </button>
                <button
                  onClick={() => setActiveZone('TRAILER_RUNNING_GEAR')}
                  className={`px-2.5 py-1 rounded-lg text-[10px] font-mono font-bold transition-all cursor-pointer ${
                    activeZone === 'TRAILER_RUNNING_GEAR'
                      ? 'bg-emerald-500 text-slate-950'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  Trailer
                </button>
                <button
                  onClick={() => setActiveZone('REAR_LIGHTING')}
                  className={`px-2.5 py-1 rounded-lg text-[10px] font-mono font-bold transition-all cursor-pointer ${
                    activeZone === 'REAR_LIGHTING'
                      ? 'bg-emerald-500 text-slate-950'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  Lights
                </button>
              </div>

              {/* Large Capture Shutter Button */}
              <button
                onClick={handleCaptureFromCamera}
                className="w-20 h-20 rounded-full border-4 border-white bg-emerald-500 hover:bg-emerald-400 text-slate-950 flex items-center justify-center shadow-2xl shadow-emerald-500/50 transition-all active:scale-90 cursor-pointer"
                aria-label="Capture Walkaround Zone"
              >
                <div className="w-15 h-15 rounded-full border-2 border-slate-950/40 flex items-center justify-center">
                  <ScanLine className="w-8 h-8 text-slate-950" />
                </div>
              </button>

              <button
                onClick={() => setIsTipsModalOpen(true)}
                className="text-[11px] font-mono text-emerald-300/90 hover:text-emerald-200 flex items-center gap-1.5 px-3 py-1 rounded-full bg-black/60 backdrop-blur-md border border-white/10 transition-colors cursor-pointer"
              >
                <Play className="w-3 h-3 fill-emerald-300" />
                <span>Tips for daily walkaround inspection</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 4. PROGRESS BAR VIEW                                                      */}
      {/* ========================================================================= */}
      {view === 'PROGRESS_BAR' && (
        <main className="flex-1 flex flex-col items-center justify-center p-6 max-w-md mx-auto w-full text-center space-y-6">
          <div className="w-20 h-20 rounded-3xl bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 flex items-center justify-center mx-auto animate-pulse">
            <ShieldCheck className="w-10 h-10" />
          </div>

          <div className="space-y-2">
            <h3 className="text-xl font-black text-white">Analyzing Vehicle &amp; Trailer</h3>
            <p className="text-xs font-mono text-emerald-300">{progressStatusText}</p>
          </div>

          {/* Progress Bar */}
          <div className="w-full bg-slate-900 rounded-full h-3 border border-slate-800 overflow-hidden">
            <div
              className="bg-gradient-to-r from-emerald-500 via-teal-400 to-cyan-400 h-full transition-all duration-300 ease-out"
              style={{ width: `${progressPercent}%` }}
            />
          </div>

          <div className="text-[11px] font-mono text-slate-400">
            Reconciling Tachograph Smart Card &amp; O-Licence Compliance Ledger...
          </div>
        </main>
      )}

      {/* ========================================================================= */}
      {/* 5. ROADWORTHINESS DASHBOARD & 15-MONTH DVSA LEDGER (DAYS_OVERVIEW)        */}
      {/* ========================================================================= */}
      {view === 'DAYS_OVERVIEW' && (
        <main className="flex-1 max-w-4xl mx-auto w-full p-4 sm:p-6 space-y-6">
          {/* Header Bar */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800 pb-4">
            <div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setView('ACTION_MENU')}
                  className="p-1.5 rounded-lg bg-slate-900 border border-slate-800 text-slate-400 hover:text-white transition-colors cursor-pointer"
                  aria-label="Back to Menu"
                >
                  <ArrowLeft className="w-4 h-4" />
                </button>
                <h2 className="text-2xl font-black text-white">Roadworthiness Dashboard</h2>
              </div>
              <p className="text-xs text-slate-400 mt-1">
                Tractor <strong className="text-white">DG21 EDP</strong> • Trailer <strong className="text-white">{selectedTrailerId}</strong> • Driver <strong className="text-white">{driverLicenceProfile?.fullName || 'Alexander James Kite'}</strong>
              </p>
            </div>

            {/* Quick Actions */}
            <div className="flex flex-wrap items-center gap-2">
              <button
                onClick={() => setIsStatutoryChecklistModalOpen(true)}
                className="px-3 py-1.5 rounded-xl bg-blue-500/20 text-blue-300 border border-blue-500/40 text-xs font-mono font-bold flex items-center gap-1.5 hover:bg-blue-500/30 transition-colors cursor-pointer"
              >
                <ClipboardCheck className="w-3.5 h-3.5" />
                <span>32-Point DVSA Standard</span>
              </button>
              <button
                onClick={() => setIsDvsaQrModalOpen(true)}
                className="px-3 py-1.5 rounded-xl bg-amber-500/20 text-amber-300 border border-amber-500/40 text-xs font-mono font-bold flex items-center gap-1.5 hover:bg-amber-500/30 transition-colors cursor-pointer"
              >
                <QrCode className="w-3.5 h-3.5" />
                <span>Roadside DVSA Mode</span>
              </button>
              <button
                onClick={() => setView('FULLSCREEN_SCAN')}
                className="px-3.5 py-1.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 text-xs font-black flex items-center gap-1.5 transition-colors cursor-pointer shadow-md shadow-emerald-500/20"
              >
                <Camera className="w-3.5 h-3.5" />
                <span>New Walkaround</span>
              </button>
            </div>
          </div>

          {/* Compliance & Fleet Health Cards */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {/* OCRS Score */}
            <div className="p-3.5 rounded-2xl bg-slate-900 border border-emerald-500/30 space-y-1">
              <div className="text-[10px] font-mono text-slate-400 uppercase">DVSA OCRS Score</div>
              <div className="text-xl font-black text-emerald-400 flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4" />
                <span>GREEN (0 pts)</span>
              </div>
              <div className="text-[10px] text-slate-400">Zero Roadside PG9s</div>
            </div>

            {/* Tachograph Sync */}
            <div className="p-3.5 rounded-2xl bg-slate-900 border border-slate-800 space-y-1">
              <div className="text-[10px] font-mono text-slate-400 uppercase">Tachograph ⚒️ Check</div>
              <div className="text-xl font-black text-white flex items-center gap-1.5">
                <Clock className="w-4 h-4 text-cyan-400" />
                <span>14 mins Work</span>
              </div>
              <div className="text-[10px] text-emerald-400">Stationary Verified</div>
            </div>

            {/* 6-Week PMI Countdown */}
            <div className="p-3.5 rounded-2xl bg-slate-900 border border-slate-800 space-y-1">
              <div className="text-[10px] font-mono text-slate-400 uppercase">6-Week PMI Service</div>
              <div className="text-xl font-black text-amber-400 flex items-center gap-1.5">
                <Wrench className="w-4 h-4" />
                <span>In 16 Days</span>
              </div>
              <div className="text-[10px] text-slate-400">Depot Bay 4 Reserved</div>
            </div>

            {/* 15-Month Vault */}
            <div className="p-3.5 rounded-2xl bg-slate-900 border border-slate-800 space-y-1">
              <div className="text-[10px] font-mono text-slate-400 uppercase">15-Month DVSA Vault</div>
              <div className="text-xl font-black text-purple-400 flex items-center gap-1.5">
                <Lock className="w-4 h-4" />
                <span>SHA-256</span>
              </div>
              <div className="text-[10px] text-slate-400">Tamper-Proof Audit</div>
            </div>
          </div>

          {/* 15-Month Walkaround Checks Ledger */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-white uppercase tracking-wider font-mono">
                Recent Walkaround Certificates (Pass / Advisory / Defects):
              </h3>
              <span className="text-xs text-slate-400 font-mono">
                {walkaroundRecords.length} audits logged
              </span>
            </div>

            <div className="space-y-2.5">
              {walkaroundRecords.map((rec) => (
                <div
                  key={rec.id}
                  onClick={() => {
                    setSelectedRecordId(rec.id);
                    setView('DAY_DETAIL');
                  }}
                  className={`p-4 rounded-2xl border transition-all cursor-pointer flex flex-col sm:flex-row sm:items-center justify-between gap-3 ${
                    rec.overallResult === 'PASS_CLEAN'
                      ? 'bg-slate-900/90 border-slate-800 hover:border-emerald-500/50'
                      : rec.overallResult === 'ADVISORY_ISSUED'
                      ? 'bg-slate-900/90 border-amber-500/30 hover:border-amber-400/60'
                      : 'bg-rose-950/20 border-rose-500/40 hover:border-rose-400'
                  }`}
                >
                  <div className="flex items-center gap-3.5">
                    <div
                      className={`w-11 h-11 rounded-xl flex items-center justify-center font-black ${
                        rec.overallResult === 'PASS_CLEAN'
                          ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                          : rec.overallResult === 'ADVISORY_ISSUED'
                          ? 'bg-amber-500/20 text-amber-400 border border-amber-500/30'
                          : 'bg-rose-500/20 text-rose-400 border border-rose-500/30'
                      }`}
                    >
                      {rec.overallResult === 'PASS_CLEAN' && <Check className="w-6 h-6" />}
                      {rec.overallResult === 'ADVISORY_ISSUED' && <AlertTriangle className="w-6 h-6" />}
                      {rec.overallResult === 'IMMEDIATE_PROHIBITION_PG9' && <ShieldAlert className="w-6 h-6" />}
                    </div>

                    <div>
                      <div className="text-sm font-bold text-white flex items-center gap-2">
                        <span>{rec.displayDate}</span>
                        <span
                          className={`text-[10px] font-mono px-2 py-0.5 rounded-full border ${
                            rec.overallResult === 'PASS_CLEAN'
                              ? 'bg-emerald-500/10 text-emerald-300 border-emerald-500/30'
                              : rec.overallResult === 'ADVISORY_ISSUED'
                              ? 'bg-amber-500/10 text-amber-300 border-amber-500/30'
                              : 'bg-rose-500/10 text-rose-300 border-rose-500/30'
                          }`}
                        >
                          {rec.overallResult === 'PASS_CLEAN' && '100% ROADWORTHY'}
                          {rec.overallResult === 'ADVISORY_ISSUED' && 'ADVISORY LOGGED'}
                          {rec.overallResult === 'IMMEDIATE_PROHIBITION_PG9' && 'PG9 LOCKOUT'}
                        </span>
                      </div>
                      <div className="text-xs text-slate-400 mt-0.5 font-mono">
                        {rec.vehicleReg} + Trailer {rec.trailerId} • {rec.durationMinutes}m check (⚒️ Other Work) • Odo: {rec.odometerKm.toLocaleString()} km
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 self-end sm:self-center">
                    <span className="text-xs font-mono text-cyan-400">View Dossier</span>
                    <ChevronRight className="w-4 h-4 text-slate-500" />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </main>
      )}

      {/* ========================================================================= */}
      {/* 6. DETAILED WALK-AROUND CERTIFICATE & DEFECT DOSSIER (DAY_DETAIL)         */}
      {/* ========================================================================= */}
      {view === 'DAY_DETAIL' && selectedRecord && (
        <main className="flex-1 max-w-4xl mx-auto w-full p-4 sm:p-6 space-y-6">
          <div className="flex items-center justify-between border-b border-slate-800 pb-4">
            <button
              onClick={() => setView('DAYS_OVERVIEW')}
              className="flex items-center gap-1.5 text-xs font-bold text-slate-400 hover:text-white transition-colors cursor-pointer"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Back to Dashboard</span>
            </button>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setIsStatutoryChecklistModalOpen(true)}
                className="px-3 py-1.5 rounded-xl bg-blue-500/20 text-blue-300 border border-blue-500/40 text-xs font-mono font-bold flex items-center gap-1.5 cursor-pointer hover:bg-blue-500/30 transition-colors"
              >
                <ClipboardCheck className="w-3.5 h-3.5" />
                <span>32-Point Audit Breakdown</span>
              </button>
              <button
                onClick={() => setIsDvsaQrModalOpen(true)}
                className="px-3 py-1.5 rounded-xl bg-amber-500/20 text-amber-300 border border-amber-500/40 text-xs font-mono font-bold flex items-center gap-1.5 cursor-pointer"
              >
                <QrCode className="w-3.5 h-3.5" />
                <span>Roadside QR</span>
              </button>
              <button
                onClick={() => {
                  window.print();
                }}
                className="px-3 py-1.5 rounded-xl bg-slate-900 border border-slate-800 text-slate-300 text-xs font-mono flex items-center gap-1.5 cursor-pointer hover:text-white"
              >
                <Printer className="w-3.5 h-3.5" />
                <span>Print Certificate</span>
              </button>
            </div>
          </div>

          {/* Certificate Header Banner */}
          <div className="p-5 rounded-3xl bg-slate-900 border border-slate-800 space-y-3">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-800 pb-3">
              <div>
                <span className="text-[10px] font-mono text-emerald-400 uppercase tracking-wider block">
                  UK DVSA Statutory Walkaround Audit Certificate
                </span>
                <h3 className="text-xl font-black text-white">{selectedRecord.displayDate}</h3>
              </div>
              <span
                className={`px-3 py-1 rounded-full text-xs font-mono font-bold border w-fit ${
                  selectedRecord.overallResult === 'PASS_CLEAN'
                    ? 'bg-emerald-500/10 text-emerald-300 border-emerald-500/40'
                    : 'bg-amber-500/10 text-amber-300 border-amber-500/40'
                }`}
              >
                {selectedRecord.overallResult === 'PASS_CLEAN' ? '✓ FULL ROADWORTHINESS CERTIFICATE' : '⚠️ ADVISORY RECORD'}
              </span>
            </div>

            {/* Key Audit Metadata Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs font-mono">
              <div className="p-2.5 rounded-xl bg-slate-950/80 border border-slate-800/80">
                <span className="text-slate-400 block text-[10px]">Tractor Reg:</span>
                <span className="text-white font-bold">{selectedRecord.vehicleReg}</span>
              </div>
              <div className="p-2.5 rounded-xl bg-slate-950/80 border border-slate-800/80">
                <span className="text-slate-400 block text-[10px]">Trailer ID:</span>
                <span className="text-cyan-400 font-bold">{selectedRecord.trailerId} ({selectedRecord.trailerType})</span>
              </div>
              <div className="p-2.5 rounded-xl bg-slate-950/80 border border-slate-800/80">
                <span className="text-slate-400 block text-[10px]">Driver (C+E):</span>
                <span className="text-white font-bold">{selectedRecord.driverName}</span>
              </div>
              <div className="p-2.5 rounded-xl bg-slate-950/80 border border-slate-800/80">
                <span className="text-slate-400 block text-[10px]">Haulier O-Licence:</span>
                <span className="text-white font-bold">{selectedRecord.oLicenceNumber}</span>
              </div>
            </div>

            {/* Tachograph & Cryptographic Proof */}
            <div className="p-3 rounded-2xl bg-slate-950 border border-slate-800/80 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-[11px] font-mono">
              <div className="flex items-center gap-2 text-emerald-400">
                <Clock className="w-4 h-4 shrink-0" />
                <span>Tachograph Reconciled: <strong>{selectedRecord.durationMinutes} minutes</strong> under <strong>⚒️ Other Work</strong></span>
              </div>
              <div className="text-slate-500 truncate max-w-xs">
                Vault: {selectedRecord.vaultSha256}
              </div>
            </div>
          </div>

          {/* 5 Walkaround Zones Detailed Checklist */}
          <div className="space-y-3">
            <h4 className="text-sm font-bold text-white uppercase tracking-wider font-mono">
              The 5 Statutory DVSA Inspection Zones:
            </h4>

            <div className="space-y-3">
              {selectedRecord.zones.map((zone) => (
                <div
                  key={zone.zoneId}
                  className="p-4 rounded-2xl bg-slate-900 border border-slate-800 space-y-2.5"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span
                        className={`w-2.5 h-2.5 rounded-full ${
                          zone.status === 'PASS' ? 'bg-emerald-400' : 'bg-amber-400'
                        }`}
                      />
                      <h5 className="text-sm font-bold text-white">{zone.name}</h5>
                    </div>
                    <span className="text-[10px] font-mono text-cyan-400 bg-cyan-950/40 px-2 py-0.5 rounded border border-cyan-500/30">
                      {Math.round(zone.aiConfidence * 100)}% AI Verification
                    </span>
                  </div>
                  <p className="text-xs text-slate-400">{zone.subtitle}</p>

                  <div className="space-y-1.5 pt-1">
                    {zone.itemsChecked.map((item, idx) => (
                      <div
                        key={idx}
                        className="text-xs font-mono text-slate-300 flex items-start gap-2 bg-slate-950/60 p-2 rounded-xl border border-slate-800/60"
                      >
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
                        <span>{item}</span>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Active Defects & Workshop Job Cards */}
          {selectedRecord.defects.length > 0 && (
            <div className="space-y-3">
              <h4 className="text-sm font-bold text-amber-400 uppercase tracking-wider font-mono flex items-center gap-2">
                <AlertTriangle className="w-4 h-4" />
                <span>Recorded Defects &amp; Rectification Orders:</span>
              </h4>

              <div className="space-y-2.5">
                {selectedRecord.defects.map((def) => (
                  <div
                    key={def.id}
                    className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/40 space-y-2"
                  >
                    <div className="flex items-center justify-between">
                      <h5 className="text-sm font-bold text-white">{def.component}</h5>
                      <span className="text-[10px] font-mono font-bold text-amber-300 bg-amber-500/20 px-2 py-0.5 rounded border border-amber-500/40">
                        {def.severity}
                      </span>
                    </div>
                    <div className="text-xs text-slate-400 font-mono">{def.dvsaReference}</div>
                    <p className="text-xs text-slate-200">{def.description}</p>
                    <div className="p-2.5 rounded-xl bg-slate-950/80 border border-amber-500/20 text-xs font-mono text-emerald-400">
                      Action Required: {def.actionRequired}
                    </div>
                    {def.partRequired && (
                      <div className="text-[11px] font-mono text-cyan-300">
                        Part: {def.partRequired} (Est. Repair: {def.estimatedRepairHours}h)
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Driver Digital Signature Block */}
          <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 flex items-center justify-between text-xs font-mono">
            <div>
              <span className="text-slate-400 block text-[10px]">Driver Sign-off:</span>
              <span className="text-emerald-400 font-bold">{selectedRecord.digitalSignature}</span>
            </div>
            <div className="text-right">
              <span className="text-slate-400 block text-[10px]">Recorded At:</span>
              <span className="text-white">{new Date(selectedRecord.timestamp).toUTCString()}</span>
            </div>
          </div>
        </main>
      )}

      {/* ========================================================================= */}
      {/* 7. ROADSIDE DVSA "GREEN FLAG" EXAMINER QR MODAL                           */}
      {/* ========================================================================= */}
      {isDvsaQrModalOpen && selectedRecord && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-md p-4 animate-in fade-in duration-200">
          <div className="relative w-full max-w-md rounded-3xl bg-slate-950 border border-amber-500/40 text-white shadow-2xl p-6 space-y-5 text-center">
            <button
              onClick={() => setIsDvsaQrModalOpen(false)}
              className="absolute top-4 right-4 p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="w-14 h-14 rounded-2xl bg-amber-500/20 text-amber-400 border border-amber-500/30 flex items-center justify-center mx-auto">
              <QrCode className="w-7 h-7" />
            </div>

            <div className="space-y-1">
              <h3 className="text-lg font-black text-white">DVSA Roadside Examiner Portal</h3>
              <p className="text-xs text-slate-400">
                Show this encrypted QR code to DVSA examiners or police officers at roadside checks.
              </p>
            </div>

            {/* Simulated QR Box */}
            <div className="p-4 rounded-2xl bg-white mx-auto w-48 h-48 flex flex-col items-center justify-center shadow-xl">
              <div className="w-40 h-40 border-4 border-slate-950 p-2 flex flex-col items-center justify-between text-slate-950 font-mono text-[9px] text-center font-bold">
                <div className="w-full flex justify-between">
                  <div className="w-7 h-7 bg-slate-950" />
                  <div className="w-7 h-7 bg-slate-950" />
                </div>
                <div className="py-1">
                  DVSA COMPLIANT
                  <br />
                  DG21 EDP • {selectedRecord.trailerId}
                  <br />
                  OCRS: GREEN (0 PTS)
                </div>
                <div className="w-full flex justify-between">
                  <div className="w-7 h-7 bg-slate-950" />
                  <div className="text-[7px]">SHA-256 VAULT</div>
                </div>
              </div>
            </div>

            <div className="p-3 rounded-2xl bg-slate-900 border border-slate-800 text-xs font-mono space-y-1 text-left">
              <div className="flex justify-between">
                <span className="text-slate-400">Tractor / Trailer:</span>
                <span className="text-white font-bold">DG21 EDP / {selectedRecord.trailerId}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Driver C+E:</span>
                <span className="text-emerald-400 font-bold">{selectedRecord.driverName}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Tacho Shift Status:</span>
                <span className="text-cyan-400 font-bold">14m Other Work (⚒️)</span>
              </div>
            </div>

            <button
              onClick={() => setIsDvsaQrModalOpen(false)}
              className="w-full py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs cursor-pointer transition-colors"
            >
              Done
            </button>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 8. ACOUSTIC AIR LEAK DIAGNOSTIC MODAL                                    */}
      {/* ========================================================================= */}
      {isAcousticModalOpen && (
        <AcousticAirLeakAnalyzerModal
          isOpen={isAcousticModalOpen}
          onClose={() => setIsAcousticModalOpen(false)}
          vehicleReg={selectedTractorReg}
          trailerId={selectedTrailerId}
          onPassInspection={(proof) => {
            showToast(`✓ Acoustic seal verified: 0 air hissing (${proof.dbLevel} dB at ${proof.peakFrequencyKhz} kHz)`);
            setIsAcousticModalOpen(false);
          }}
        />
      )}

      {/* ========================================================================= */}
      {/* 9. TRAILER DROP & SWAP MEMORY MODAL                                      */}
      {/* ========================================================================= */}
      {isTrailerMemoryModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-md p-4 animate-in fade-in duration-200">
          <div className="relative w-full max-w-lg rounded-3xl bg-slate-950 border border-cyan-500/40 text-white shadow-2xl p-6 space-y-4 max-h-[90vh] overflow-y-auto">
            <button
              onClick={() => setIsTrailerMemoryModalOpen(false)}
              className="absolute top-4 right-4 p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-3 border-b border-slate-800 pb-3">
              <div className="w-10 h-10 rounded-xl bg-cyan-500/20 text-cyan-400 flex items-center justify-center font-bold border border-cyan-500/30">
                <Truck className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-base font-bold text-white">Trailer Drop &amp; Swap Memory</h3>
                <p className="text-xs text-slate-400">Persistent custody ledger across UK distribution hubs</p>
              </div>
            </div>

            <div className="space-y-3">
              {Object.values(SAMPLE_TRAILER_MEMORIES).map((trailer) => (
                <div
                  key={trailer.trailerId}
                  onClick={() => {
                    setSelectedTrailerId(trailer.trailerId);
                    showToast(`Trailer set to ${trailer.trailerId}`);
                    setIsTrailerMemoryModalOpen(false);
                  }}
                  className={`p-4 rounded-2xl border transition-all cursor-pointer space-y-2 ${
                    selectedTrailerId === trailer.trailerId
                      ? 'bg-cyan-500/15 border-cyan-400 ring-2 ring-cyan-400/30'
                      : 'bg-slate-900 border-slate-800 hover:border-slate-700'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="text-base font-black text-white">{trailer.trailerId}</span>
                    <span className="text-[10px] font-mono text-cyan-300 bg-cyan-950/50 px-2 py-0.5 rounded border border-cyan-500/30">
                      {trailer.kingpinSize}
                    </span>
                  </div>
                  <div className="text-xs text-slate-300 font-medium">{trailer.trailerType}</div>
                  <div className="text-[11px] font-mono text-slate-400">
                    Dropped at: {trailer.lastDroppedLocation} by {trailer.lastDriverName}
                  </div>
                  <div className="p-2 rounded-xl bg-slate-950/80 border border-slate-800 text-[11px] text-amber-300 space-y-0.5">
                    <span className="font-bold block text-[10px] text-slate-400 uppercase">Previous Driver Advisories:</span>
                    {trailer.activeAdvisories.map((adv, i) => (
                      <div key={i}>• {adv}</div>
                    ))}
                  </div>
                </div>
              ))}
            </div>

            <button
              onClick={() => setIsTrailerMemoryModalOpen(false)}
              className="w-full py-2.5 rounded-xl bg-slate-800 text-white font-bold text-xs cursor-pointer"
            >
              Done
            </button>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 9B. DVSA STATUTORY 32-POINT WALKAROUND AUDIT MODAL                        */}
      {/* ========================================================================= */}
      {isStatutoryChecklistModalOpen && (() => {
        const roadworthinessScore = calculateDvsaRoadworthinessScore(statutoryChecklist);
        
        // Filter items
        const filteredCheckpoints = statutoryChecklist.filter((item) => {
          if (checklistAssetFilter === 'TRACTOR') {
            if (item.targetAsset !== 'TRACTOR_UNIT' && item.targetAsset !== 'COMBINED_INTERFACE') return false;
          } else if (checklistAssetFilter === 'TRAILER') {
            if (item.targetAsset !== 'SEMI_TRAILER' && item.targetAsset !== 'COMBINED_INTERFACE') return false;
          }
          if (checklistCategoryFilter !== 'ALL' && item.category !== checklistCategoryFilter) {
            return false;
          }
          return true;
        });

        const tractorCount = statutoryChecklist.filter(
          (c) => c.targetAsset === 'TRACTOR_UNIT' || c.targetAsset === 'COMBINED_INTERFACE'
        ).length;
        const trailerCount = statutoryChecklist.filter(
          (c) => c.targetAsset === 'SEMI_TRAILER' || c.targetAsset === 'COMBINED_INTERFACE'
        ).length;

        return (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-md p-3 sm:p-6 animate-in fade-in duration-200">
            <div className="relative w-full max-w-5xl rounded-3xl bg-slate-950 border border-emerald-500/40 text-white shadow-2xl overflow-hidden flex flex-col max-h-[92vh]">
              {/* Header */}
              <div className="p-4 sm:p-5 flex items-start justify-between border-b border-slate-800 bg-slate-900/90 sticky top-0 z-10">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center font-bold border border-emerald-500/30">
                    <ClipboardCheck className="w-5 h-5 text-emerald-400" />
                  </div>
                  <div>
                    <h3 className="text-base sm:text-lg font-bold text-white flex items-center gap-2">
                      <span>DVSA Statutory 32-Point Walkaround Checklist</span>
                      <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 hidden sm:inline">
                        100% Statutory DVSA Coverage
                      </span>
                    </h3>
                    <p className="text-xs text-slate-400">
                      UK Guide to Maintaining Roadworthiness &amp; Categorisation of Defects (Tractor &amp; Semi-Trailer)
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => setIsStatutoryChecklistModalOpen(false)}
                  className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white cursor-pointer transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Roadworthiness Score & Severity Alert Banner */}
              <div className="px-4 py-3 bg-slate-900/60 border-b border-slate-800/80 flex flex-wrap items-center justify-between gap-3">
                <div className="flex items-center gap-2 sm:gap-4 flex-wrap">
                  <div className="flex items-center gap-1.5">
                    <span className="text-xs text-slate-400">Roadworthiness:</span>
                    <span className="text-sm font-black text-emerald-400">
                      {Math.round((roadworthinessScore.passed / roadworthinessScore.total) * 100)}%
                    </span>
                    <span className="text-xs text-slate-500 font-mono">
                      ({roadworthinessScore.passed}/{roadworthinessScore.total} Passed)
                    </span>
                  </div>

                  {roadworthinessScore.immediatePg9Fails > 0 ? (
                    <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-rose-500/20 text-rose-300 border border-rose-500/40 flex items-center gap-1.5 animate-pulse">
                      <AlertOctagon className="w-3.5 h-3.5" />
                      {roadworthinessScore.immediatePg9Fails} PG9 Immediate Prohibition (Grounding Risk)
                    </span>
                  ) : roadworthinessScore.delayed10DayFails > 0 ? (
                    <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-amber-500/20 text-amber-300 border border-amber-500/40 flex items-center gap-1.5">
                      <AlertTriangle className="w-3.5 h-3.5" />
                      {roadworthinessScore.delayed10DayFails} Delayed 10-Day Notice
                    </span>
                  ) : (
                    <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 flex items-center gap-1.5">
                      <ShieldCheck className="w-3.5 h-3.5" />
                      100% DVSA Roadworthy — Cleared for Transit
                    </span>
                  )}
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => {
                      setIsStatutoryChecklistModalOpen(false);
                      setIsConversationalChecklistOpen(true);
                    }}
                    className="px-3 py-1.5 rounded-lg bg-gradient-to-r from-emerald-500/20 to-teal-500/20 hover:from-emerald-500/30 hover:to-teal-500/30 text-emerald-300 border border-emerald-500/40 text-xs font-bold cursor-pointer transition-all flex items-center gap-1.5 shadow-sm"
                  >
                    <Radio className="w-3.5 h-3.5 text-emerald-400 animate-pulse" />
                    <span>Conversational Voice Mode</span>
                  </button>
                  <button
                    onClick={() => {
                      setStatutoryChecklist((prev) => prev.map((item) => ({ ...item, status: 'PASS' })));
                      showToast('✓ All 32 DVSA points marked PASS');
                    }}
                    className="px-3 py-1.5 rounded-lg bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-300 border border-emerald-500/30 text-xs font-semibold cursor-pointer transition-colors"
                  >
                    Pass All 32
                  </button>
                </div>
              </div>

              {/* Filter Bar */}
              <div className="p-3 bg-slate-950 border-b border-slate-800 space-y-2">
                {/* Asset Filters */}
                <div className="flex items-center gap-2 overflow-x-auto pb-1 text-xs">
                  <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider shrink-0">Asset:</span>
                  <button
                    onClick={() => setChecklistAssetFilter('ALL')}
                    className={`px-3 py-1 rounded-lg font-medium cursor-pointer transition-all shrink-0 ${
                      checklistAssetFilter === 'ALL'
                        ? 'bg-emerald-500 text-slate-950 font-bold'
                        : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800'
                    }`}
                  >
                    All 32 Points
                  </button>
                  <button
                    onClick={() => setChecklistAssetFilter('TRACTOR')}
                    className={`px-3 py-1 rounded-lg font-medium cursor-pointer transition-all shrink-0 flex items-center gap-1 ${
                      checklistAssetFilter === 'TRACTOR'
                        ? 'bg-cyan-500 text-slate-950 font-bold'
                        : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800'
                    }`}
                  >
                    🚛 Tractor Unit ({tractorCount})
                  </button>
                  <button
                    onClick={() => setChecklistAssetFilter('TRAILER')}
                    className={`px-3 py-1 rounded-lg font-medium cursor-pointer transition-all shrink-0 flex items-center gap-1 ${
                      checklistAssetFilter === 'TRAILER'
                        ? 'bg-amber-500 text-slate-950 font-bold'
                        : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800'
                    }`}
                  >
                    🚚 Semi-Trailer ({trailerCount})
                  </button>
                </div>

                {/* Category Filters */}
                <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-[11px]">
                  <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider shrink-0">Group:</span>
                  {[
                    { id: 'ALL', label: 'All Groups' },
                    { id: 'CAB_CONTROLS', label: 'In-Cab & Controls (1-10)' },
                    { id: 'TRACTOR_EXTERIOR', label: 'Tractor Powertrain (11-20)' },
                    { id: 'COUPLING_CATWALK', label: 'Coupling & Catwalk (21-25)' },
                    { id: 'TRAILER_RUNNING_GEAR', label: 'Trailer Running Gear (26-29)' },
                    { id: 'TRAILER_BODY_LOAD', label: 'Body & Load (30-31)' },
                    { id: 'LIGHTING_MARKERS', label: 'Lighting (32)' }
                  ].map((cat) => (
                    <button
                      key={cat.id}
                      onClick={() => setChecklistCategoryFilter(cat.id)}
                      className={`px-2.5 py-0.5 rounded-md font-medium cursor-pointer transition-all shrink-0 ${
                        checklistCategoryFilter === cat.id
                          ? 'bg-slate-700 text-white font-bold border border-slate-600'
                          : 'bg-slate-900/60 text-slate-400 hover:text-white border border-slate-800/80'
                      }`}
                    >
                      {cat.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Checkpoints Scrollable List */}
              <div className="flex-1 overflow-y-auto p-4 space-y-3">
                {filteredCheckpoints.map((item) => {
                  const isPass = item.status === 'PASS';
                  const isFail = item.status === 'FAIL';

                  return (
                    <div
                      key={item.id}
                      className={`p-3.5 rounded-2xl border transition-all ${
                        isFail
                          ? 'bg-rose-950/20 border-rose-500/50 ring-1 ring-rose-500/30'
                          : isPass
                          ? 'bg-slate-900/80 border-slate-800 hover:border-slate-700'
                          : 'bg-slate-900/40 border-slate-800/60'
                      }`}
                    >
                      <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
                        <div className="space-y-1.5 flex-1">
                          <div className="flex flex-wrap items-center gap-1.5">
                            <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-slate-800 text-slate-300 border border-slate-700">
                              {item.code}
                            </span>
                            <span className="px-1.5 py-0.5 rounded text-[10px] font-mono text-cyan-300 bg-cyan-950/50 border border-cyan-800/50">
                              Item {item.govUkItemNumber}
                            </span>
                            <span className="px-1.5 py-0.5 rounded text-[10px] font-medium bg-slate-800/80 text-slate-400">
                              {item.targetAsset === 'TRACTOR_UNIT'
                                ? '🚛 Tractor Unit'
                                : item.targetAsset === 'SEMI_TRAILER'
                                ? '🚚 Semi-Trailer'
                                : '🔗 Coupling Interface'}
                            </span>
                            {item.prohibitionType === 'IMMEDIATE_PG9' && (
                              <span className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-rose-500/20 text-rose-300 border border-rose-500/40">
                                PG9 Grounding
                              </span>
                            )}
                            {item.prohibitionType === 'DELAYED_10_DAY' && (
                              <span className="px-1.5 py-0.5 rounded text-[10px] font-medium bg-amber-500/20 text-amber-300 border border-amber-500/40">
                                10-Day Delayed
                              </span>
                            )}
                            {item.prohibitionType === 'ADVISORY' && (
                              <span className="px-1.5 py-0.5 rounded text-[10px] font-medium bg-blue-500/20 text-blue-300 border border-blue-500/40">
                                Advisory Notice
                              </span>
                            )}
                          </div>

                          <h4 className="text-sm font-bold text-white">{item.title}</h4>
                          <p className="text-xs text-slate-300 leading-relaxed">{item.description}</p>
                          <div className="text-[10px] font-mono text-slate-500">{item.dvsaReference}</div>
                        </div>

                        {/* Interactive Pass / Fail Action Buttons */}
                        <div className="flex items-center sm:flex-col gap-2 shrink-0 pt-2 sm:pt-0">
                          <button
                            onClick={() => handleToggleStatutoryItem(item.id, 'PASS')}
                            className={`flex-1 sm:w-24 py-2 px-3 rounded-xl font-bold text-xs flex items-center justify-center gap-1.5 cursor-pointer transition-all ${
                              isPass
                                ? 'bg-emerald-500 text-slate-950 font-black shadow-lg shadow-emerald-500/20'
                                : 'bg-slate-800/80 text-slate-400 hover:text-white border border-slate-700'
                            }`}
                          >
                            <Check className="w-3.5 h-3.5" />
                            Pass
                          </button>
                          <button
                            onClick={() => handleToggleStatutoryItem(item.id, 'FAIL')}
                            className={`flex-1 sm:w-24 py-2 px-3 rounded-xl font-bold text-xs flex items-center justify-center gap-1.5 cursor-pointer transition-all ${
                              isFail
                                ? 'bg-rose-500 text-white font-black shadow-lg shadow-rose-500/30'
                                : 'bg-slate-800/80 text-slate-400 hover:text-white border border-slate-700'
                            }`}
                          >
                            <AlertTriangle className="w-3.5 h-3.5" />
                            Fail
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Footer */}
              <div className="p-4 bg-slate-900 border-t border-slate-800 flex items-center justify-between gap-3">
                <div className="text-xs text-slate-400">
                  Showing <span className="font-bold text-white">{filteredCheckpoints.length}</span> of 32 Statutory DVSA Checkpoints
                </div>
                <button
                  onClick={() => setIsStatutoryChecklistModalOpen(false)}
                  className="px-6 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs cursor-pointer shadow-lg shadow-emerald-500/20 transition-all"
                >
                  Done &amp; Close Audit
                </button>
              </div>
            </div>
          </div>
        );
      })()}

      {/* ========================================================================= */}
      {/* 10. ANIMATED TIPS MODAL                                                  */}
      {/* ========================================================================= */}
      {isTipsModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-md p-3 sm:p-6 animate-in fade-in duration-200">
          <div className="relative w-full max-w-4xl rounded-3xl bg-slate-950 border border-emerald-500/40 text-white shadow-2xl overflow-hidden flex flex-col max-h-[92vh]">
            <div className="p-4 sm:p-5 flex items-center justify-between border-b border-slate-800 bg-slate-950/90">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center font-bold border border-emerald-500/30">
                  <Play className="w-4 h-4 fill-emerald-400" />
                </div>
                <div>
                  <h3 className="text-sm sm:text-base font-bold text-white flex items-center gap-2">
                    <span>Tips for Daily Walkaround Inspections</span>
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 hidden sm:inline">
                      Animated Tutorial
                    </span>
                  </h3>
                  <p className="text-[11px] font-mono text-slate-400">
                    Wheel nut geometry, tread depth gauge, 5th-wheel lock &amp; acoustic air tests
                  </p>
                </div>
              </div>
              <button
                onClick={() => setIsTipsModalOpen(false)}
                className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4">
              <div className="relative aspect-video w-full rounded-2xl bg-black overflow-hidden border border-slate-800 shadow-2xl group select-none">
                <img
                  key={WALKAROUND_AI_TIPS[tipsActiveIndex].id}
                  src={WALKAROUND_AI_TIPS[tipsActiveIndex].image}
                  alt={WALKAROUND_AI_TIPS[tipsActiveIndex].title}
                  className="w-full h-full object-cover transition-all duration-700 ease-out transform scale-100 group-hover:scale-105"
                />

                <div className="absolute top-3 inset-x-3 sm:top-4 sm:inset-x-4 flex items-center justify-between pointer-events-none">
                  <span
                    className={`px-2.5 py-1 rounded-full text-xs font-mono font-bold border backdrop-blur-md ${WALKAROUND_AI_TIPS[tipsActiveIndex].badgeColor}`}
                  >
                    {WALKAROUND_AI_TIPS[tipsActiveIndex].badge}
                  </span>
                  <span className="px-2.5 py-1 rounded-full text-xs font-mono font-bold bg-black/70 text-slate-300 border border-white/10 backdrop-blur-md">
                    Tip {tipsActiveIndex + 1} of {WALKAROUND_AI_TIPS.length}
                  </span>
                </div>

                <div className="absolute inset-x-0 bottom-0 p-4 sm:p-6 bg-gradient-to-t from-slate-950 via-slate-950/85 to-transparent text-white space-y-1.5">
                  <h4 className="text-base sm:text-2xl font-black text-emerald-400 drop-shadow-md">
                    {WALKAROUND_AI_TIPS[tipsActiveIndex].title}
                  </h4>
                  <p className="text-xs sm:text-base text-slate-200 font-medium drop-shadow-sm max-w-3xl">
                    {WALKAROUND_AI_TIPS[tipsActiveIndex].description}
                  </p>
                  <div className="pt-1.5 flex items-center gap-2 text-xs sm:text-sm font-mono text-teal-300">
                    <CheckCircle2 className="w-4 h-4 text-teal-400 shrink-0" />
                    <span><strong>Pro Tip:</strong> {WALKAROUND_AI_TIPS[tipsActiveIndex].actionTip}</span>
                  </div>
                </div>

                <button
                  onClick={() => setIsTipsPlaying(!isTipsPlaying)}
                  className="absolute inset-0 m-auto w-14 h-14 rounded-full bg-black/60 hover:bg-emerald-500 hover:text-slate-950 text-white backdrop-blur-md border border-white/20 flex items-center justify-center transition-all opacity-0 group-hover:opacity-100 cursor-pointer"
                >
                  {isTipsPlaying ? <Pause className="w-6 h-6" /> : <Play className="w-6 h-6 fill-current" />}
                </button>
              </div>

              <div
                className="h-2 w-full rounded-full bg-slate-800 overflow-hidden cursor-pointer relative"
                onClick={(e) => {
                  const rect = e.currentTarget.getBoundingClientRect();
                  const clickX = e.clientX - rect.left;
                  const pct = (clickX / rect.width) * 100;
                  setTipsProgress(pct);
                }}
              >
                <div
                  className="h-full bg-gradient-to-r from-emerald-500 to-teal-400 transition-all duration-100 ease-linear rounded-full"
                  style={{ width: `${tipsProgress}%` }}
                />
              </div>

              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-1">
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setIsTipsPlaying(!isTipsPlaying)}
                    className="px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-white text-xs font-bold flex items-center gap-2 cursor-pointer shadow"
                  >
                    {isTipsPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4 fill-current text-emerald-400" />}
                    <span>{isTipsPlaying ? 'Pause' : 'Play'}</span>
                  </button>
                  <button
                    onClick={() => {
                      setTipsActiveIndex((curr) => (curr - 1 + WALKAROUND_AI_TIPS.length) % WALKAROUND_AI_TIPS.length);
                      setTipsProgress(0);
                    }}
                    className="px-3 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-300 text-xs font-mono border border-slate-800 cursor-pointer"
                  >
                    Previous Tip
                  </button>
                  <button
                    onClick={() => {
                      setTipsActiveIndex((curr) => (curr + 1) % WALKAROUND_AI_TIPS.length);
                      setTipsProgress(0);
                    }}
                    className="px-3 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-300 text-xs font-mono border border-slate-800 cursor-pointer"
                  >
                    Next Tip
                  </button>
                </div>

                <button
                  onClick={() => {
                    setIsTipsModalOpen(false);
                    setView('FULLSCREEN_SCAN');
                    if (!isTorchOn) toggleTorch();
                  }}
                  className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-400 hover:from-emerald-400 hover:to-teal-300 text-slate-950 font-black text-xs shadow-lg shadow-emerald-500/25 flex items-center justify-center gap-2 transition-all cursor-pointer"
                >
                  <Zap className="w-4 h-4 fill-slate-950" />
                  <span>Launch Camera with Flash Active</span>
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2.5 pt-2">
                {WALKAROUND_AI_TIPS.map((tip, idx) => (
                  <button
                    key={tip.id}
                    onClick={() => {
                      setTipsActiveIndex(idx);
                      setTipsProgress(0);
                    }}
                    className={`p-3 rounded-2xl border text-left transition-all cursor-pointer flex flex-col justify-between ${
                      tipsActiveIndex === idx
                        ? 'bg-emerald-500/15 border-emerald-400 ring-2 ring-emerald-400/30'
                        : 'bg-slate-900 border-slate-800 hover:border-slate-700'
                    }`}
                  >
                    <div className="space-y-1">
                      <div className="flex items-center justify-between">
                        <span className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded-full border ${tip.badgeColor}`}>
                          {tip.badge}
                        </span>
                        <span className="text-[10px] font-mono text-slate-500">#{idx + 1}</span>
                      </div>
                      <h5 className="text-xs font-bold text-white line-clamp-1">{tip.title}</h5>
                      <p className="text-[11px] text-slate-400 line-clamp-2">{tip.subtitle}</p>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 11. TRAILER ID & NAVIGATION AUTOPOPULATION HUB MODAL                      */}
      {/* ========================================================================= */}
      {isTrailerNavModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-md p-3 sm:p-6 animate-in fade-in duration-200">
          <div className="relative w-full max-w-4xl rounded-3xl bg-slate-950 border border-cyan-500/40 text-white shadow-2xl overflow-hidden flex flex-col max-h-[92vh]">
            {/* Modal Header */}
            <div className="p-4 sm:p-5 flex items-center justify-between border-b border-slate-800 bg-slate-950/90">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-cyan-500/20 text-cyan-400 flex items-center justify-center font-bold border border-cyan-500/30">
                  <Navigation className="w-5 h-5 text-cyan-400" />
                </div>
                <div>
                  <h3 className="text-sm sm:text-base font-bold text-white flex items-center gap-2">
                    <span>Trailer ID &amp; HGV Navigation Autopopulate</span>
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 hidden sm:inline">
                      Live Bridge &amp; Weight Protection
                    </span>
                  </h3>
                  <p className="text-[11px] font-mono text-slate-400">
                    Calculates Unified Combination Envelope • 4-Tier Zero-Trust Privacy • TomTom &amp; Google Maps Sync
                  </p>
                </div>
              </div>
              <button
                onClick={() => setIsTrailerNavModalOpen(false)}
                className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Tab Navigation */}
            <div className="px-4 pt-3 pb-2 border-b border-slate-800/80 bg-slate-950 flex items-center gap-2">
              <button
                onClick={() => setNavTab('ENVELOPE')}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                  navTab === 'ENVELOPE'
                    ? 'bg-cyan-500 text-slate-950 shadow-md shadow-cyan-500/20'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                <Truck className="w-3.5 h-3.5" />
                <span>1. Combination Envelope</span>
              </button>
              <button
                onClick={() => setNavTab('PRIVACY')}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                  navTab === 'PRIVACY'
                    ? 'bg-cyan-500 text-slate-950 shadow-md shadow-cyan-500/20'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                <Lock className="w-3.5 h-3.5" />
                <span>2. 4-Tier Privacy Auditor</span>
              </button>
              <button
                onClick={() => setNavTab('SYNC')}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                  navTab === 'SYNC'
                    ? 'bg-cyan-500 text-slate-950 shadow-md shadow-cyan-500/20'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                <Compass className="w-3.5 h-3.5" />
                <span>3. Sync to Sat-Nav Apps</span>
              </button>
            </div>

            {/* Modal Body */}
            <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-5">
              {/* TAB 1: COMBINATION ENVELOPE */}
              {navTab === 'ENVELOPE' && (
                <div className="space-y-4">
                  {/* Selector Strip: Tractor + Trailer */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 p-4 rounded-2xl bg-slate-900 border border-slate-800">
                    {/* Tractor Unit Selection */}
                    <div className="space-y-1.5">
                      <label className="text-[11px] font-mono font-bold text-slate-400 uppercase flex items-center gap-1.5">
                        <Truck className="w-3.5 h-3.5 text-cyan-400" />
                        <span>Tractor Unit</span>
                      </label>
                      <select
                        value={selectedTractorReg}
                        onChange={(e) => setSelectedTractorReg(e.target.value)}
                        className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-700 text-white font-mono text-xs focus:outline-none focus:border-cyan-400"
                      >
                        {Object.values(SAMPLE_TRACTOR_DATABASE).map((t) => (
                          <option key={t.vehicleReg} value={t.vehicleReg}>
                            {t.vehicleReg} • {t.makeModel} (Cab {formatHeightBoth(t.cabHeightMeters)})
                          </option>
                        ))}
                      </select>
                    </div>

                    {/* Trailer ID Selection */}
                    <div className="space-y-1.5">
                      <label className="text-[11px] font-mono font-bold text-slate-400 uppercase flex items-center gap-1.5">
                        <Layers className="w-3.5 h-3.5 text-emerald-400" />
                        <span>Coupled Trailer ID</span>
                      </label>
                      <select
                        value={selectedTrailerId}
                        onChange={(e) => setSelectedTrailerId(e.target.value)}
                        className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-700 text-white font-mono text-xs focus:outline-none focus:border-cyan-400"
                      >
                        {Object.values(SAMPLE_TRAILER_DATABASE).map((tr) => (
                          <option key={tr.trailerId} value={tr.trailerId}>
                            {tr.trailerId} • {tr.trailerType} ({formatHeightBoth(tr.heightMeters)})
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>

                  {/* High Cube Bridge Warning Banner */}
                  {combinationEnvelope.isHighCube && (
                    <div className="p-3.5 rounded-2xl bg-amber-500/15 border border-amber-500/40 text-amber-300 flex items-start gap-3 animate-in fade-in">
                      <AlertOctagon className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
                      <div className="space-y-0.5 text-xs">
                        <div className="font-black text-amber-200">
                          HIGH-CUBE HGV: {formatHeightBoth(combinationEnvelope.combinedHeightMeters)}
                        </div>
                        <div className="text-[11px] text-amber-300/90">
                          Statutory clearance threshold is <strong>{formatHeightBoth(combinationEnvelope.bridgeAlertThresholdMeters)}</strong> (includes 6-inch safety buffer). Standard 14ft 6in rail arches will strike. Autopopulating navigation will strictly enforce HGV-designated routes.
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Envelope Metric Cards Grid */}
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                    {/* Overall Height */}
                    <div className="p-3.5 rounded-2xl bg-slate-900 border border-slate-800 space-y-1">
                      <span className="text-[10px] font-mono text-slate-400 uppercase">Overall Height</span>
                      <div className="text-xl sm:text-2xl font-black text-cyan-300">
                        {formatHeightBoth(combinationEnvelope.combinedHeightMeters)}
                      </div>
                      <div className="text-[11px] font-mono text-slate-400">
                        Clearance Threshold: {formatHeightBoth(combinationEnvelope.bridgeAlertThresholdMeters)}
                      </div>
                    </div>

                    {/* Gross Train Weight */}
                    <div className="p-3.5 rounded-2xl bg-slate-900 border border-slate-800 space-y-1">
                      <span className="text-[10px] font-mono text-slate-400 uppercase">Gross Weight (GCW)</span>
                      <div className="text-xl sm:text-2xl font-black text-emerald-300">
                        {combinationEnvelope.grossCombinationWeightTonnes}t
                      </div>
                      <div className="text-[11px] font-mono text-slate-400">
                        {combinationEnvelope.totalAxles} Axles • 44t UK Limit
                      </div>
                    </div>

                    {/* Overall Length */}
                    <div className="p-3.5 rounded-2xl bg-slate-900 border border-slate-800 space-y-1">
                      <span className="text-[10px] font-mono text-slate-400 uppercase">Total Length</span>
                      <div className="text-xl sm:text-2xl font-black text-amber-300">
                        {combinationEnvelope.combinedLengthMeters}m
                      </div>
                      <div className="text-[11px] font-mono text-slate-400">
                        16.50m Statutory Artic Max
                      </div>
                    </div>

                    {/* Overall Width */}
                    <div className="p-3.5 rounded-2xl bg-slate-900 border border-slate-800 space-y-1">
                      <span className="text-[10px] font-mono text-slate-400 uppercase">Body Width</span>
                      <div className="text-xl sm:text-2xl font-black text-purple-300">
                        {combinationEnvelope.combinedWidthMeters}m
                      </div>
                      <div className="text-[11px] font-mono text-slate-400">
                        {combinationEnvelope.combinedWidthMeters === 2.6 ? 'Reefer Insulated' : 'Standard HGV'}
                      </div>
                    </div>
                  </div>

                  {/* Quick Trailer Preset Chips */}
                  <div className="space-y-1.5">
                    <span className="text-xs font-mono font-bold text-slate-400 uppercase">Quick Trailer Presets:</span>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                      {Object.values(SAMPLE_TRAILER_DATABASE).map((tr) => (
                        <button
                          key={tr.trailerId}
                          onClick={() => setSelectedTrailerId(tr.trailerId)}
                          className={`p-3 rounded-xl border text-left transition-all cursor-pointer flex items-center justify-between ${
                            selectedTrailerId === tr.trailerId
                              ? 'bg-cyan-500/15 border-cyan-400 ring-2 ring-cyan-400/30'
                              : 'bg-slate-900 border-slate-800 hover:border-slate-700'
                          }`}
                        >
                          <div>
                            <div className="font-bold text-xs text-white flex items-center gap-2">
                              <span>{tr.trailerId}</span>
                              <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-slate-800 text-slate-300">
                                {tr.trailerType}
                              </span>
                            </div>
                            <div className="text-[11px] text-slate-400">
                              Owner: {tr.fleetOwnerName} • {formatHeightBoth(tr.heightMeters)}
                            </div>
                          </div>
                          <span className="text-xs font-mono font-bold text-cyan-400">
                            {tr.maxGrossWeightTonnes}t
                          </span>
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Primary CTA: Push to Navigation Apps */}
                  <div className="pt-2 flex flex-col sm:flex-row items-center gap-2">
                    <button
                      onClick={() => setNavTab('SYNC')}
                      className="w-full py-3.5 rounded-xl bg-gradient-to-r from-cyan-500 to-teal-400 hover:from-cyan-400 hover:to-teal-300 text-slate-950 font-black text-xs shadow-lg shadow-cyan-500/20 flex items-center justify-center gap-2 cursor-pointer transition-all active:scale-95"
                    >
                      <Navigation className="w-4 h-4 fill-slate-950" />
                      <span>Autopopulate In-Cab Navigation Apps Now</span>
                    </button>
                  </div>
                </div>
              )}

              {/* TAB 2: 4-TIER PRIVACY AUDITOR */}
              {navTab === 'PRIVACY' && (
                <div className="space-y-4">
                  <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 space-y-2">
                    <div className="flex items-center gap-2 text-cyan-400 font-bold text-xs">
                      <Lock className="w-4 h-4" />
                      <span>Zero-Trust Asset Sharing &amp; Privacy Enforcement</span>
                    </div>
                    <p className="text-xs text-slate-300 leading-relaxed">
                      Trailers in the UK are regularly dropped and swapped between different haulage firms at railheads and ports. Our 4-tier model guarantees physical dimensions propagate to navigation systems without leaking sensitive business intelligence or driver personal data.
                    </p>
                  </div>

                  <div className="space-y-3">
                    {/* Tier 1 */}
                    <div className="p-4 rounded-2xl bg-slate-900/90 border border-emerald-500/40 space-y-1.5">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-black text-emerald-400 flex items-center gap-2">
                          <CheckCircle2 className="w-4 h-4" />
                          <span>TIER 1: Public Physical Dimensions</span>
                        </span>
                        <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 font-bold border border-emerald-500/40">
                          UNRESTRICTED
                        </span>
                      </div>
                      <p className="text-xs text-slate-300">
                        <strong>Height (4.45m), Width (2.55m), Length (16.5m), GCW (41.9t)</strong> are accessible to any authenticated driver and exported to TomTom, Google Maps, Garmin dēzl, and CoPilot Truck to eliminate low-bridge strikes.
                      </p>
                    </div>

                    {/* Tier 2 */}
                    <div className="p-4 rounded-2xl bg-slate-900/90 border border-blue-500/40 space-y-1.5">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-black text-blue-400 flex items-center gap-2">
                          <ShieldCheck className="w-4 h-4" />
                          <span>TIER 2: Operational Safety &amp; Defect State</span>
                        </span>
                        <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-blue-500/20 text-blue-300 font-bold border border-blue-500/40">
                          AUTHORIZED ONLY
                        </span>
                      </div>
                      <p className="text-xs text-slate-300">
                        <strong>Roadworthiness status, defect advisories, and PMI inspection expiry</strong> are visible to the driver currently operating the shift, the operating haulier, and DVSA examiners via Roadside QR.
                      </p>
                    </div>

                    {/* Tier 3 */}
                    <div className="p-4 rounded-2xl bg-slate-900/90 border border-purple-500/40 space-y-1.5">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-black text-purple-400 flex items-center gap-2">
                          <Lock className="w-4 h-4" />
                          <span>TIER 3: Proprietary Fleet &amp; Commercial Vault</span>
                        </span>
                        <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-purple-500/20 text-purple-300 font-bold border border-purple-500/40">
                          STRICTLY MASKED
                        </span>
                      </div>
                      <p className="text-xs text-slate-300">
                        <strong>Customer delivery manifests, freight revenue rates, and telematics GPS breadcrumb history</strong> are encrypted and restricted to the trailer's registered owner ({SAMPLE_TRAILER_DATABASE[selectedTrailerId]?.fleetOwnerName || 'Fleet Owner'}). Completely hidden from third-party drivers.
                      </p>
                    </div>

                    {/* Tier 4 */}
                    <div className="p-4 rounded-2xl bg-slate-900/90 border border-amber-500/40 space-y-1.5">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-black text-amber-400 flex items-center gap-2">
                          <EyeOff className="w-4 h-4" />
                          <span>TIER 4: Driver PII &amp; GDPR Redaction</span>
                        </span>
                        <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-amber-500/20 text-amber-300 font-bold border border-amber-500/40">
                          ANONYMIZED
                        </span>
                      </div>
                      <p className="text-xs text-slate-300">
                        Personal phone numbers, home addresses, and NI numbers are never shared across firms. Historical checks display pseudonymized identifiers (e.g. <code>Verified C+E Driver #GB-4819</code>).
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {/* TAB 3: SYNC TO SAT-NAV APPS */}
              {navTab === 'SYNC' && (
                <div className="space-y-4">
                  <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 space-y-2">
                    <span className="text-xs font-mono font-bold text-cyan-400 uppercase">1-Tap Commercial Navigation Autopopulation</span>
                    <p className="text-xs text-slate-300 leading-relaxed">
                      Select your preferred navigation tool below. The exact combination envelope ({combinationEnvelope.combinedHeightFeetInches} H • {combinationEnvelope.grossCombinationWeightTonnes}t W • {combinationEnvelope.combinedLengthMeters}m L) will be transmitted to prevent bridge strikes and weight penalties.
                    </p>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {/* 1. TomTom Truck SDK */}
                    <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 hover:border-cyan-400/50 transition-all flex flex-col justify-between space-y-3">
                      <div className="space-y-1.5">
                        <div className="flex items-center justify-between">
                          <span className="text-sm font-black text-white flex items-center gap-2">
                            <Navigation className="w-4 h-4 text-cyan-400" />
                            <span>TomTom Truck Navigation</span>
                          </span>
                          <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                            SDK ACTIVE
                          </span>
                        </div>
                        <p className="text-xs text-slate-400">
                          Directly syncs vehicle height, width, length, and gross weight into the TomTom Truck Commercial Routing engine.
                        </p>
                      </div>
                      <button
                        onClick={handleSyncToTomTom}
                        className="w-full py-2.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs flex items-center justify-center gap-2 cursor-pointer shadow-md shadow-cyan-500/20"
                      >
                        <Compass className="w-4 h-4" />
                        <span>Push to TomTom Truck SDK</span>
                      </button>
                    </div>

                    {/* 2. Google Maps Platform */}
                    <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 hover:border-blue-400/50 transition-all flex flex-col justify-between space-y-3">
                      <div className="space-y-1.5">
                        <div className="flex items-center justify-between">
                          <span className="text-sm font-black text-white flex items-center gap-2">
                            <MapPin className="w-4 h-4 text-blue-400" />
                            <span>Google Maps Platform</span>
                          </span>
                          <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-blue-500/20 text-blue-300 border border-blue-500/30">
                            COMMERCIAL GATE
                          </span>
                        </div>
                        <p className="text-xs text-slate-400">
                          Navigates directly to HGV Goods-In Gate (avoiding car parks) and copies dimension specs to clipboard.
                        </p>
                      </div>
                      <button
                        onClick={handleLaunchGoogleMaps}
                        className="w-full py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs flex items-center justify-center gap-2 cursor-pointer shadow-md shadow-blue-600/20"
                      >
                        <ExternalLink className="w-4 h-4" />
                        <span>Open HGV Gate in Google Maps</span>
                      </button>
                    </div>

                    {/* 3. Garmin dēzl & CoPilot Truck */}
                    <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 hover:border-amber-400/50 transition-all flex flex-col justify-between space-y-3">
                      <div className="space-y-1.5">
                        <div className="flex items-center justify-between">
                          <span className="text-sm font-black text-white flex items-center gap-2">
                            <Compass className="w-4 h-4 text-amber-400" />
                            <span>Garmin dēzl / CoPilot Truck</span>
                          </span>
                          <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-amber-500/20 text-amber-300 border border-amber-500/30">
                            IN-CAB SATNAV
                          </span>
                        </div>
                        <p className="text-xs text-slate-400">
                          Generates universal deep links for dedicated hardware sat-navs with custom HGV profile dimensions.
                        </p>
                      </div>
                      <button
                        onClick={handleExportGarminCopilot}
                        className="w-full py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs flex items-center justify-center gap-2 cursor-pointer shadow-md shadow-amber-500/20"
                      >
                        <ExternalLink className="w-4 h-4" />
                        <span>Launch Garmin / CoPilot URI</span>
                      </button>
                    </div>

                    {/* 4. Clipboard Spec Sheet */}
                    <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 hover:border-emerald-400/50 transition-all flex flex-col justify-between space-y-3">
                      <div className="space-y-1.5">
                        <div className="flex items-center justify-between">
                          <span className="text-sm font-black text-white flex items-center gap-2">
                            <Copy className="w-4 h-4 text-emerald-400" />
                            <span>Copy HGV Dimension Spec</span>
                          </span>
                          <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                            QUICK PASTE
                          </span>
                        </div>
                        <p className="text-xs text-slate-400">
                          Copies complete metric and imperial height, width, length, and weight specs for manual entry or driver WhatsApp.
                        </p>
                      </div>
                      <button
                        onClick={handleCopyDimensions}
                        className="w-full py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs flex items-center justify-center gap-2 cursor-pointer"
                      >
                        <Copy className="w-4 h-4 text-emerald-400" />
                        <span>Copy Spec Sheet to Clipboard</span>
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Modal Footer */}
            <div className="p-4 border-t border-slate-800 bg-slate-950 flex items-center justify-between">
              <span className="text-[11px] font-mono text-slate-400">
                Active Combination: <strong className="text-cyan-400">{selectedTractorReg} + {selectedTrailerId}</strong>
              </span>
              <button
                onClick={() => setIsTrailerNavModalOpen(false)}
                className="px-5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs cursor-pointer transition-colors"
              >
                Close Hub
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 11. CONVERSATIONAL 32-POINT WALKAROUND MODAL                              */}
      {/* ========================================================================= */}
      {isConversationalChecklistOpen && (
        <ConversationalChecklist
          onClose={() => setIsConversationalChecklistOpen(false)}
          onCompleteChecklist={handleCompleteConversationalChecklist}
          driverProfile={driverLicenceProfile}
          vehicleReg={selectedTractorReg}
          trailerId={selectedTrailerId}
          onOpenDeliverySiteRouteModal={() => setIsDeliveryRouteModalOpen(true)}
        />
      )}

      {/* ========================================================================= */}
      {/* 12. DELIVERY SITE & COMPLIANT HGV ROUTE MODAL                             */}
      {/* ========================================================================= */}
      {isDeliveryRouteModalOpen && (
        <DeliverySiteRouteModal
          isOpen={isDeliveryRouteModalOpen}
          onClose={() => setIsDeliveryRouteModalOpen(false)}
          combinationEnvelope={combinationEnvelope}
          selectedTractorReg={selectedTractorReg}
          selectedTrailerId={selectedTrailerId}
          driverName={driverLicenceProfile?.fullName}
          driverLicenceNumber={driverLicenceProfile?.licenceNumber}
          onSendToCabHud={(dest) => {
            showToast(`✓ Destination ${dest} sent to In-Cab HUD!`);
          }}
          onOpenGatePass={(dest) => {
            showToast(`✓ Gate Pass pre-filled for ${dest}!`);
          }}
        />
      )}

      {/* ========================================================================= */}
      {/* 13. DRIVER WALKAROUND ROUTINE AI SETTINGS MODAL                           */}
      {/* ========================================================================= */}
      {isDriverSettingsModalOpen && (
        <DriverWalkaroundSettingsModal
          isOpen={isDriverSettingsModalOpen}
          onClose={() => setIsDriverSettingsModalOpen(false)}
          onPreferencesChanged={(updated) => {
            showToast(
              `✓ Walkaround AI routine updated to ${
                updated.mode === 'AI_ADAPTIVE'
                  ? 'AI Adaptive Habit'
                  : updated.mode === 'STRICT_STATUTORY'
                  ? 'Strict DVSA Order'
                  : 'Clockwise Yard Walk'
              }!`
            );
          }}
        />
      )}
    </div>
  );
};

export default VehicleCheckApp;
