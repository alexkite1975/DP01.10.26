'use client';
import React, { useState, useRef, useEffect } from 'react';
import {
  ShieldCheck,
  ShieldAlert,
  Building2,
  MapPin,
  Sparkles,
  Truck,
  AlertTriangle,
  Play,
  Pause,
  ArrowLeft,
  X,
  Plus,
  Trash2,
  CheckCircle2,
  ChevronRight,
  Clock,
  Compass,
  Navigation,
  ExternalLink,
  Layers,
  Printer,
  Share2,
  Copy,
  ScanLine,
  UploadCloud,
  Eye,
  Lock,
  Zap,
  Info,
  Sliders,
  AlertOctagon,
  Volume2,
  FileCheck,
  Check,
  Key,
  QrCode,
  Coffee,
  Search,
  Star
} from 'lucide-react';
import confetti from 'canvas-confetti';
import {
  SiteRiskAssessment,
  HazardMatrixItem,
  ApproachVideoStep,
  RiskLevel,
  DriverLicenceProfile,
  CapacityOccupancyStatus,
  ServiceAreaFacilityChecklist,
  DriverServiceReview
} from '../../types';
import { INITIAL_SITES } from '../../data/initialSites';
import { INITIAL_MOTORWAY_SERVICES } from '../../data/initialMotorwayServices';
import { formatHeightBoth } from '../../utils/heightUtils';
import { MotorwayServiceDetail } from './MotorwayServiceDetail';
import {
  GoogleBusinessProfileOAuthModal,
  VerifiedDepotProfile
} from '../manager/GoogleBusinessProfileOAuthModal';

const STORAGE_KEY_SITES = 'dp_siterisk_assessments_v1';

interface SiteRiskAppProps {
  onOpenLicenceScanner?: () => void;
  driverLicenceProfile?: DriverLicenceProfile | null;
  onSwitchToTachoScan?: () => void;
  onSwitchToVehicleCheck?: () => void;
  onSwitchToRouteOptimiser?: () => void;
  onSwitchToSafetyShield?: () => void;
}

export const SiteRiskApp: React.FC<SiteRiskAppProps> = ({
  onOpenLicenceScanner,
  driverLicenceProfile,
  onSwitchToTachoScan,
  onSwitchToVehicleCheck,
  onSwitchToRouteOptimiser,
  onSwitchToSafetyShield
}) => {
  // Navigation View State
  const [view, setView] = useState<
    | 'WELCOME'
    | 'ACTION_MENU'
    | 'STEP_WIZARD'
    | 'SITE_DETAIL'
    | 'ANDROID_NAV_SDK_VIEW'
    | 'AI_SCAN_VIEW'
  >('WELCOME');

  // Stored Assessments
  const [sites, setSites] = useState<SiteRiskAssessment[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_SITES);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          // Check if previously cached sites include Motorway Services
          const hasMsa = parsed.some(
            (s: any) => s.siteType === 'MOTORWAY_SERVICES' || s.siteType === 'TRUCKSTOP'
          );
          if (!hasMsa) {
            const merged = [...parsed, ...INITIAL_MOTORWAY_SERVICES];
            localStorage.setItem(STORAGE_KEY_SITES, JSON.stringify(merged));
            return merged;
          }
          return parsed;
        }
      }
    } catch (_e) {}
    return INITIAL_SITES;
  });

  const [selectedSiteId, setSelectedSiteId] = useState<string>(
    INITIAL_SITES[0]?.id || 'site-001'
  );

  // Category Filter & Search for Directory (Depots vs Motorway Services)
  const [siteCategoryFilter, setSiteCategoryFilter] = useState<'ALL' | 'DEPOT' | 'MOTORWAY_SERVICES'>('ALL');
  const [siteSearchQuery, setSiteSearchQuery] = useState('');

  // Welcome video demo state
  const [welcomeVideoTab, setWelcomeVideoTab] = useState<'CREATOR_DEMO' | 'ANDROID_NAV'>('CREATOR_DEMO');
  const [isDemoPlaying, setIsDemoPlaying] = useState(true);

  // Step-by-Step Wizard Creation State
  const [wizardStep, setWizardStep] = useState<number>(1);
  const totalWizardSteps = 6;

  // Wizard Form Fields
  const [wTitle, setWTitle] = useState('Prologis Park Apex Bay 4');
  const [wBusinessName, setWBusinessName] = useState('Prologis Distribution Hub');
  const [wAddress, setWAddress] = useState('Apex Parkway, Magna Park, Lutterworth LE17 4XN, UK');
  const [wCoordinates, setWCoordinates] = useState({ lat: 52.4578, lng: -1.2467 });
  const [wPlusCode, setWPlusCode] = useState('9C4VFR54+9Q');
  const [wWhat3words, setWWhat3words] = useState('///focal.shoppers.cushion');
  const [wDepotZone, setWDepotZone] = useState('Midlands Primary Trunking Corridor');
  const [wIsHGVGate, setWIsHGVGate] = useState(true);

  // Google Business Profile OAuth & Verified Depot State
  const [isGbpModalOpen, setIsGbpModalOpen] = useState(false);
  const [verifiedDepotClaim, setVerifiedDepotClaim] = useState<VerifiedDepotProfile | null>(null);

  const handleVerifiedDepotClaimed = (depot: VerifiedDepotProfile) => {
    setVerifiedDepotClaim(depot);
    setWTitle(depot.businessName);
    setWBusinessName(depot.businessName);
    setWAddress(depot.address);
    setWCoordinates({ lat: depot.lat, lng: depot.lng });
    showToast(`✓ Google Business Profile Verified: ${depot.businessName} (${depot.verifiedUser.role})`);
  };

  // Step 2: Dimensions & Restrictions
  const [wMaxHeight, setWMaxHeight] = useState(4.5);
  const [wMaxWeight, setWMaxWeight] = useState(44.0);
  const [wMaxLength, setWMaxLength] = useState(16.5);
  const [wMaxWidth, setWMaxWidth] = useState(2.55);
  const [wTurningCircle, setWTurningCircle] = useState<'EASY' | 'MODERATE' | 'TIGHT' | 'EXTREME_REVERSING_ONLY'>('MODERATE');
  const [wTailLift, setWTailLift] = useState(false);
  const [wAdrCategory, setWAdrCategory] = useState('GENERAL_FREIGHT');

  // Step 3: Hazard Matrix
  const [wHazards, setWHazards] = useState<HazardMatrixItem[]>([
    {
      id: 'haz-1',
      hazard: 'Forklift Crossing at Bay 4 East Apron',
      category: 'TRAFFIC',
      likelihood: 3,
      severity: 4,
      riskRating: 12,
      riskLevel: 'MEDIUM',
      controlMeasures: [
        'Engage hazard beacons upon gatehouse entry',
        'Strict 10 mph yard speed limit enforced by radar',
        'Pedestrian barrier gates interlocked with dock doors'
      ]
    },
    {
      id: 'haz-2',
      hazard: 'Blind Corner Reversing into Flush Dock 12-16',
      category: 'TRAFFIC',
      likelihood: 4,
      severity: 4,
      riskRating: 16,
      riskLevel: 'HIGH',
      controlMeasures: [
        'Trained yard banksman required for all articulated reversing',
        'Ultrasonic dock acoustic guide chimes active',
        'Chock both trailer bogie rear wheels before decoupled tractor departs'
      ]
    },
    {
      id: 'haz-3',
      hazard: 'Low Canopy Drainage Gutter (4.35m clearance)',
      category: 'OVERHEAD',
      likelihood: 2,
      severity: 5,
      riskRating: 10,
      riskLevel: 'MEDIUM',
      controlMeasures: [
        'High-Cube trailers (>4.2m) restricted to West Access Apron only',
        'Yellow warning chevrons and laser height sensor alarm at barrier'
      ]
    }
  ]);
  const [newHazardName, setNewHazardName] = useState('');
  const [newHazardSeverity, setNewHazardSeverity] = useState(3);
  const [newHazardLikelihood, setNewHazardLikelihood] = useState(3);

  // Step 4: Last-Mile Approach Corridor
  const [wMotorwayJunction, setWMotorwayJunction] = useState('M1 Junction 20 / A4304 Bypass');
  const [wDesignatedRoute, setWDesignatedRoute] = useState(
    'Exit M1 at J20, proceed west along A4304 bypass. At the Magna Park roundabout, take 2nd exit into Apex Parkway. DO NOT enter via Bitteswell village.'
  );
  const [wForbiddenTurns, setWForbiddenTurns] = useState(
    'STRICTLY PROHIBITED: Left turn from Valley Drive into residential Bitteswell (6ft 6in width restriction & 7.5t environmental weight limit).'
  );
  const [wApproachSteps, setWApproachSteps] = useState<ApproachVideoStep[]>([
    {
      stepNumber: 1,
      heading: 'Motorway Egress (M1 J20)',
      instruction: 'Take western slip road following signs for Magna Park HGV Freight.',
      narrationText: 'Prepare to exit M1 at Junction 20. Stay in left lane for A4304.',
      checkpointType: 'HIGHWAY_EXIT',
      mockImageUrl: '/tips/tip1_flash_shadow.jpg'
    },
    {
      stepNumber: 2,
      heading: 'Magna Park Roundabout',
      instruction: 'Take 2nd exit into Apex Parkway commercial industrial zone.',
      narrationText: 'Approach roundabout at 25 mph. Give way to circulating traffic.',
      checkpointType: 'ROUNDABOUT',
      mockImageUrl: '/tips/tip3_laser_guidelines.jpg'
    },
    {
      stepNumber: 3,
      heading: 'Security Gatehouse Entry',
      instruction: 'Position cab beside Intercom Post 1. Present digital Gate Pass QR.',
      narrationText: 'Pull forward to Gate 2 barrier. Have gate code #5820* ready.',
      checkpointType: 'SECURITY_GATE',
      mockImageUrl: '/tips/tip4_comparison_accuracy.jpg'
    }
  ]);

  // Step 5: Satellite Yard & Gate Protocols
  const [wGateCode, setWGateCode] = useState('#5820*');
  const [wRadioChannel, setWRadioChannel] = useState('UHF Channel 19 (446.006 MHz)');
  const [wPPE, setWPPE] = useState<string[]>([
    'High-Visibility Vest (Class 3 EN ISO 20471)',
    'Steel Toe Safety Boots (S3 Standard)',
    'Safety Hard Hat (EN 397)',
    'Safety Glasses (EN 166)'
  ]);
  const [wBayCount, setWBayCount] = useState(24);
  const [wDockType, setWDockType] = useState<'FLUSH_DOCK' | 'GROUND_LEVEL' | 'RAMP' | 'TAIL_LIFT_ONLY'>('FLUSH_DOCK');

  // Android Nav SDK In-Cab Simulation State
  const [navSimSpeed, setNavSimSpeed] = useState(48); // mph
  const [navSimDistance, setNavSimDistance] = useState(1.4); // miles
  const [navSimEta, setNavSimEta] = useState(3); // minutes
  const [navSimCurrentInstruction, setNavSimCurrentInstruction] = useState(
    'In 400 yards, take 2nd exit at Magna Park roundabout into Apex Parkway'
  );
  const [navSimHorizonAlert, setNavSimHorizonAlert] = useState<string | null>(null);
  const [isNavSimActive, setIsNavSimActive] = useState(false);
  const [isGateInductionAutoTriggered, setIsGateInductionAutoTriggered] = useState(false);

  // Toast feedback
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 4000);
  };

  // Horizontal touch navigation swipe handling
  const touchStartX = useRef<number>(0);
  const touchStartY = useRef<number>(0);

  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
    touchStartY.current = e.touches[0].clientY;
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    const diffX = e.changedTouches[0].clientX - touchStartX.current;
    const diffY = e.changedTouches[0].clientY - touchStartY.current;

    // Swipe right to go back
    if (diffX > 80 && Math.abs(diffX) > Math.abs(diffY) * 1.5) {
      if (view === 'STEP_WIZARD') {
        if (wizardStep > 1) {
          setWizardStep((prev) => prev - 1);
        } else {
          setView('ACTION_MENU');
        }
      } else if (view === 'SITE_DETAIL' || view === 'ANDROID_NAV_SDK_VIEW' || view === 'AI_SCAN_VIEW') {
        setView('ACTION_MENU');
      } else if (view === 'ACTION_MENU') {
        setView('WELCOME');
      }
    }
  };

  // Add a hazard in Step 3
  const handleAddHazard = () => {
    if (!newHazardName.trim()) return;
    const rating = newHazardSeverity * newHazardLikelihood;
    const level: RiskLevel = rating >= 15 ? 'HIGH' : rating >= 8 ? 'MEDIUM' : 'LOW';

    const item: HazardMatrixItem = {
      id: `haz-${Date.now()}`,
      hazard: newHazardName.trim(),
      category: 'TRAFFIC',
      severity: newHazardSeverity,
      likelihood: newHazardLikelihood,
      riskRating: rating,
      riskLevel: level,
      controlMeasures: ['Engage hazard lights', 'Comply with 10 mph yard speed limit']
    };

    setWHazards((prev) => [...prev, item]);
    setNewHazardName('');
    showToast(`✓ Hazard added: ${item.hazard} (Score: ${rating})`);
  };

  // Delete hazard
  const handleDeleteHazard = (id: string) => {
    setWHazards((prev) => prev.filter((h) => h.id !== id));
  };

  // Complete Step 6 & Publish Site Risk Assessment
  const handleCompleteAssessment = () => {
    const maxHazardScore = wHazards.reduce((max, h) => Math.max(max, h.riskRating), 0);
    const overallLevel: RiskLevel =
      maxHazardScore >= 20
        ? 'CRITICAL'
        : maxHazardScore >= 15
        ? 'HIGH'
        : maxHazardScore >= 8
        ? 'MEDIUM'
        : 'LOW';

    const newAssessment: SiteRiskAssessment = {
      id: `site-${Date.now()}`,
      title: wTitle,
      businessName: wBusinessName,
      address: wAddress,
      coordinates: wCoordinates,
      plusCode: wPlusCode,
      what3words: wWhat3words,
      depotZone: wDepotZone,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      version: 1,
      overallRiskLevel: overallLevel,
      overallScore: maxHazardScore || 10,
      status: 'APPROVED',
      isOfflineCached: true,
      dynamicRiskIndex: {
        score: maxHazardScore * 4,
        level: overallLevel,
        ratingScore: 45,
        defectFrequencyScore: 30,
        nearMissScore: 25,
        isHighRiskAlert: overallLevel === 'HIGH' || overallLevel === 'CRITICAL',
        lastCalculatedAt: new Date().toISOString()
      },
      inductionGatekeeping: {
        isCompleted: false,
        oneWayTrafficAcknowledged: false,
        speedLimitAcknowledged: false,
        mandatoryPPEConfirmed: [],
        qrToken: `DP-${wTitle.replace(/\s+/g, '-').toUpperCase()}-${Date.now().toString(16)}`,
        isQrUnlocked: false,
        specialHazardsAcknowledged: []
      },
      businessSection: {
        mandatoryPPE: wPPE,
        accessProcedures: 'Report to security gatehouse upon arrival. Present Digital Gate Pass QR.',
        gateSecurityCode: wGateCode,
        intercomInstructions: `Security Intercom Channel 1 or ${wRadioChannel}.`,
        operatingHours: {
          open: '06:00',
          close: '22:00',
          days: 'Mon-Sat',
          outOfHoursDeliveryPermitted: true
        },
        timeWindowHazards: [],
        vehicleConstraints: {
          maxHeightMeters: wMaxHeight,
          maxWeightTonnes: wMaxWeight,
          maxLengthMeters: wMaxLength,
          maxWidthMeters: wMaxWidth,
          tailLiftRequired: wTailLift,
          turningCircleConstraint: wTurningCircle,
          lowBridgeAlert: wMaxHeight >= 4.4 ? 'Avoid Low Railway Bridges on A-road approach' : undefined
        },
        loadingBayDetails: {
          bayCount: wBayCount,
          dockType: wDockType,
          reversingGuidance: 'Trained yard banksman required for all articulated reversing.',
          wheelChocksMandatory: true,
          keysHandoverRequired: true
        },
        siteManager: {
          name: driverLicenceProfile?.fullName || 'Alex Kite (Safety Lead)',
          phone: '+44 (0) 7911 204918',
          email: 'safety@drivepartners.co.uk',
          radioChannel: wRadioChannel
        },
        emergencyMusterPoint: 'Assembly Area 1 beside main gatehouse.',
        baselineHazards: wHazards,
        approachVideoGuide: {
          title: `HGV Inbound Approach: ${wTitle}`,
          summary: `Approved corridor from ${wMotorwayJunction} directly to commercial goods entrance.`,
          durationSeconds: 180,
          steps: wApproachSteps
        },
        media: []
      },
      driverSection: {
        realTimeAlerts: [],
        observations: [],
        pendingModifications: []
      },
      auditHistory: []
    };

    setSites((prev) => [newAssessment, ...prev]);
    setSelectedSiteId(newAssessment.id);
    localStorage.setItem(STORAGE_KEY_SITES, JSON.stringify([newAssessment, ...sites]));

    try {
      confetti({
        particleCount: 60,
        spread: 70,
        origin: { y: 0.6 }
      });
    } catch (_e) {}

    setView('SITE_DETAIL');
    showToast(`✓ Site Risk Assessment published: ${wTitle} (Syncing to TomTom Android Nav SDK...)`);
  };

  // Motorway Services: Update Live Crowdsourced Capacity
  const handleUpdateCapacity = (
    siteId: string,
    status: CapacityOccupancyStatus,
    reportedBays: number,
    notes: string
  ) => {
    setSites((prev) => {
      const updated = prev.map((s) => {
        if (s.id !== siteId || !s.motorwayServicesData) return s;
        return {
          ...s,
          motorwayServicesData: {
            ...s.motorwayServicesData,
            currentOccupancyStatus: status,
            estimatedAvailableBays: reportedBays,
            lastCapacityUpdate: {
              driverName: driverLicenceProfile?.fullName || 'Dave Higgins (C+E)',
              vehicleReg: 'GN21 JKM',
              timestamp: 'Just now',
              status,
              reportedBays,
              notes
            }
          }
        };
      });
      try {
        localStorage.setItem(STORAGE_KEY_SITES, JSON.stringify(updated));
      } catch (_e) {}
      return updated;
    });
  };

  // Motorway Services: Toggle Facility Status (Showers, 24h food, etc.)
  const handleUpdateFacility = (
    siteId: string,
    facilityKey: keyof ServiceAreaFacilityChecklist,
    value: any
  ) => {
    setSites((prev) => {
      const updated = prev.map((s) => {
        if (s.id !== siteId || !s.motorwayServicesData) return s;
        return {
          ...s,
          motorwayServicesData: {
            ...s.motorwayServicesData,
            facilities: {
              ...s.motorwayServicesData.facilities,
              [facilityKey]: value
            }
          }
        };
      });
      try {
        localStorage.setItem(STORAGE_KEY_SITES, JSON.stringify(updated));
      } catch (_e) {}
      return updated;
    });
  };

  // Motorway Services: Add Driver Review & Recalculate Rating
  const handleAddReview = (siteId: string, review: DriverServiceReview) => {
    setSites((prev) => {
      const updated = prev.map((s) => {
        if (s.id !== siteId || !s.motorwayServicesData) return s;
        const newReviews = [review, ...s.motorwayServicesData.driverReviews];
        const newCount = s.motorwayServicesData.reviewCount + 1;
        const newOverall = Number(
          (
            (s.motorwayServicesData.overallRating * s.motorwayServicesData.reviewCount +
              review.overallScore) /
            newCount
          ).toFixed(1)
        );
        return {
          ...s,
          motorwayServicesData: {
            ...s.motorwayServicesData,
            overallRating: newOverall,
            reviewCount: newCount,
            driverReviews: newReviews
          }
        };
      });
      try {
        localStorage.setItem(STORAGE_KEY_SITES, JSON.stringify(updated));
      } catch (_e) {}
      return updated;
    });
  };

  const selectedSite = sites.find((s) => s.id === selectedSiteId) || sites[0] || INITIAL_SITES[0];

  const filteredSites = sites.filter((s) => {
    if (siteCategoryFilter === 'DEPOT') {
      if (s.siteType === 'MOTORWAY_SERVICES' || s.siteType === 'TRUCKSTOP' || Boolean(s.motorwayServicesData)) {
        return false;
      }
    } else if (siteCategoryFilter === 'MOTORWAY_SERVICES') {
      if (s.siteType !== 'MOTORWAY_SERVICES' && s.siteType !== 'TRUCKSTOP' && !s.motorwayServicesData) {
        return false;
      }
    }

    if (siteSearchQuery.trim()) {
      const q = siteSearchQuery.toLowerCase();
      const matchTitle = s.title.toLowerCase().includes(q);
      const matchAddress = s.address.toLowerCase().includes(q);
      const matchZone = s.depotZone.toLowerCase().includes(q);
      const matchMsa = s.motorwayServicesData?.motorway.toLowerCase().includes(q);
      if (!matchTitle && !matchAddress && !matchZone && !matchMsa) {
        return false;
      }
    }

    return true;
  });

  // In-Cab Simulation Timer Effect
  useEffect(() => {
    let interval: any = null;
    if (view === 'ANDROID_NAV_SDK_VIEW' && isNavSimActive) {
      interval = setInterval(() => {
        setNavSimDistance((prev) => {
          if (prev <= 0.1) {
            setIsNavSimActive(false);
            setNavSimSpeed(0);
            setIsGateInductionAutoTriggered(true);
            setNavSimCurrentInstruction('✓ Arrived at Gate 2 Commercial Inbound Barrier.');
            setNavSimHorizonAlert(null);
            showToast('✓ Arrived! Gate Induction Pass automatically presented.');
            return 0;
          }
          const next = Number((prev - 0.1).toFixed(1));
          if (next <= 0.3) {
            setNavSimSpeed(10); // Yard speed limit enforcement!
            setNavSimCurrentInstruction('Turn Right into Gate 2 • Enforcing 10 mph Yard Speed Limit');
            setNavSimHorizonAlert('🚨 YARD DOCKING GEOFENCE: 10 mph Limit Active • Forklift Crossing Ahead');
          } else if (next <= 0.8) {
            setNavSimSpeed(25);
            setNavSimCurrentInstruction('At roundabout, take 2nd exit onto Apex Parkway');
            setNavSimHorizonAlert('⚠️ HORIZON WARNING: Low canopy ahead (4.35m) — High-Cube keep left');
          } else {
            setNavSimSpeed(45);
          }
          return next;
        });
      }, 1200);
    }
    return () => clearInterval(interval);
  }, [view, isNavSimActive]);

  return (
    <div
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
      className="min-h-screen bg-slate-950 text-slate-100 font-sans selection:bg-cyan-500 selection:text-slate-950 flex flex-col"
    >
      {/* Toast Banner */}
      {toastMessage && (
        <div className="fixed top-16 right-4 z-50 rounded-2xl bg-slate-900 text-white px-4 py-3 text-xs font-bold shadow-2xl border border-cyan-500/40 animate-in slide-in-from-top-5 flex items-center gap-2">
          <span className="h-2 w-2 rounded-full bg-cyan-400 animate-ping" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 1. WELCOME VIEW: Welcome to SiteRisk from Drive Partners                  */}
      {/* ========================================================================= */}
      {view === 'WELCOME' && (
        <main className="flex-1 flex flex-col items-center justify-center px-4 py-8 sm:py-12">
          <div className="w-full max-w-4xl mx-auto text-center space-y-6">
            
            {/* Top Eyebrow Pill */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-300 text-xs font-mono font-bold tracking-wider uppercase">
              <ShieldCheck className="w-3.5 h-3.5 text-cyan-400" />
              <span>THE UNIFIED LOGISTICS PLATFORM • DEPOT RISK &amp; TRUCK NAV</span>
            </div>

            {/* Main Welcome Heading: Drive Partners small, SiteRisk big */}
            <div className="space-y-1 text-center">
              <div className="text-xs sm:text-sm font-semibold tracking-widest text-slate-400 uppercase">
                Welcome to
              </div>
              <h1 className="text-5xl sm:text-7xl md:text-8xl font-black tracking-tight drop-shadow-2xl leading-none">
                <span className="bg-gradient-to-r from-blue-400 via-cyan-300 to-teal-400 bg-clip-text text-transparent">
                  SiteRisk
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
              <p className="text-xs sm:text-base text-cyan-400 font-semibold tracking-wide">
                Step-by-Step Commercial Depot Risk Assessment &amp; In-Cab Android Truck Nav
              </p>
            </div>

            {/* Primary Action Buttons */}
            <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3">
              <button
                onClick={() => setView('STEP_WIZARD')}
                className="w-full sm:w-auto px-8 py-4 rounded-2xl bg-gradient-to-r from-cyan-500 via-blue-500 to-cyan-500 hover:from-cyan-400 hover:to-blue-400 text-slate-950 font-black text-base sm:text-lg shadow-xl shadow-cyan-500/25 flex items-center justify-center gap-3 transition-all active:scale-95 cursor-pointer"
              >
                <Plus className="w-6 h-6 text-slate-950 stroke-[2.5]" />
                <span>Launch SiteRisk Creator</span>
              </button>

              <button
                onClick={() => setView('ACTION_MENU')}
                className="w-full sm:w-auto px-6 py-4 rounded-2xl bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-200 font-bold text-sm sm:text-base flex items-center justify-center gap-2.5 transition-all cursor-pointer shadow-lg"
              >
                <Building2 className="w-5 h-5 text-cyan-400" />
                <span>Browse Assessments ({sites.length})</span>
              </button>
            </div>

            {/* Reciprocal Switcher Buttons */}
            <div className="flex flex-wrap items-center justify-center gap-2 pt-1">
              {onSwitchToTachoScan && (
                <button
                  onClick={onSwitchToTachoScan}
                  className="px-4 py-2 rounded-xl bg-slate-900/80 hover:bg-slate-800 border border-amber-500/30 text-amber-300 font-bold text-xs flex items-center gap-2 transition-all cursor-pointer"
                >
                  <Clock className="w-4 h-4 text-amber-400" />
                  <span>Switch to Tacho-Scan</span>
                </button>
              )}
              {onSwitchToVehicleCheck && (
                <button
                  onClick={onSwitchToVehicleCheck}
                  className="px-4 py-2 rounded-xl bg-slate-900/80 hover:bg-slate-800 border border-emerald-500/30 text-emerald-300 font-bold text-xs flex items-center gap-2 transition-all cursor-pointer"
                >
                  <Truck className="w-4 h-4 text-emerald-400" />
                  <span>Switch to Vehicle-Check (DVSA)</span>
                </button>
              )}
              {onSwitchToRouteOptimiser && (
                <button
                  onClick={onSwitchToRouteOptimiser}
                  className="px-4 py-2 rounded-xl bg-slate-900/80 hover:bg-slate-800 border border-blue-500/30 text-blue-300 font-bold text-xs flex items-center gap-2 transition-all cursor-pointer"
                >
                  <Navigation className="w-4 h-4 text-blue-400" />
                  <span>Route Optimiser (HGV GPS)</span>
                </button>
              )}
              {onSwitchToSafetyShield && (
                <button
                  onClick={onSwitchToSafetyShield}
                  className="px-4 py-2 rounded-xl bg-slate-900/80 hover:bg-slate-800 border border-rose-500/40 text-rose-300 font-bold text-xs flex items-center gap-2 transition-all cursor-pointer"
                >
                  <ShieldAlert className="w-4 h-4 text-rose-400" />
                  <span>Safety &amp; Bridge Shield (7 SHIELDS)</span>
                </button>
              )}
            </div>

            {/* Inserted Video Demo / Android SDK Preview */}
            <div className="w-full max-w-3xl mx-auto pt-4 text-left">
              <div className="rounded-3xl bg-slate-900 border border-slate-800 overflow-hidden shadow-2xl">
                {/* Video Header Bar with Tab Switcher */}
                <div className="p-3 sm:p-4 border-b border-slate-800 bg-slate-950/80 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div className="flex items-center gap-1.5 p-1 rounded-xl bg-slate-900 border border-slate-800">
                    <button
                      onClick={() => setWelcomeVideoTab('CREATOR_DEMO')}
                      className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                        welcomeVideoTab === 'CREATOR_DEMO'
                          ? 'bg-cyan-500 text-slate-950 shadow-md shadow-cyan-500/20'
                          : 'text-slate-400 hover:text-white'
                      }`}
                    >
                      <Play className="w-3.5 h-3.5 fill-current" />
                      <span>Step-by-Step Creator</span>
                    </button>
                    <button
                      onClick={() => setWelcomeVideoTab('ANDROID_NAV')}
                      className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                        welcomeVideoTab === 'ANDROID_NAV'
                          ? 'bg-cyan-500 text-slate-950 shadow-md shadow-cyan-500/20'
                          : 'text-slate-400 hover:text-white'
                      }`}
                    >
                      <Compass className="w-3.5 h-3.5 fill-current text-cyan-950" />
                      <span>TomTom Android Nav SDK</span>
                      <span className="text-[9px] px-1.5 py-0.5 rounded bg-cyan-400/30 text-cyan-950 font-black">
                        LIVE
                      </span>
                    </button>
                  </div>

                  <div className="flex items-center gap-2">
                    <span className="text-xs font-mono text-cyan-400 flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-cyan-950/50 border border-cyan-500/30">
                      <Key className="w-3.5 h-3.5 text-cyan-400" />
                      <span>Key: Dx27rvc...</span>
                    </span>
                  </div>
                </div>

                {/* Video / Simulator Viewport */}
                {welcomeVideoTab === 'CREATOR_DEMO' ? (
                  <div className="flex flex-col bg-slate-950">
                    <div className="relative aspect-video w-full bg-black overflow-hidden group">
                      <img
                        src="/tips/tip3_laser_guidelines.jpg"
                        alt="Step by Step Risk Assessment Creator"
                        className="w-full h-full object-cover opacity-80 group-hover:scale-105 transition-transform duration-700"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-transparent flex flex-col justify-end p-5 space-y-2">
                        <span className="px-2.5 py-1 rounded-full text-xs font-mono font-bold bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 w-fit backdrop-blur-md">
                          📋 6-STEP CREATION WIZARD
                        </span>
                        <h4 className="text-base sm:text-xl font-black text-white">
                          Turn Complex Logistics Hubs into Living Digital Safety Blueprints
                        </h4>
                        <p className="text-xs sm:text-sm text-slate-300 max-w-xl">
                          Map commercial HGV gates, vehicle height/weight limits, hazard matrices, mandatory inbound corridors, and automated gate induction codes.
                        </p>
                      </div>
                      <button
                        onClick={() => setView('STEP_WIZARD')}
                        className="absolute inset-0 m-auto w-14 h-14 rounded-full bg-cyan-500 text-slate-950 flex items-center justify-center shadow-xl shadow-cyan-500/50 cursor-pointer hover:scale-110 transition-transform"
                      >
                        <Play className="w-6 h-6 fill-slate-950 ml-1" />
                      </button>
                    </div>

                    <div className="p-3.5 sm:p-4 bg-slate-950/90 border-t border-slate-800/80 flex flex-wrap items-center justify-between gap-3 text-xs font-mono">
                      <div className="flex items-center gap-2 text-slate-400">
                        <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
                        <span>Wizard Steps:</span>
                      </div>
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="px-2.5 py-1 rounded-lg bg-slate-900 text-cyan-300 border border-slate-800">1. Depot Location</span>
                        <span className="px-2.5 py-1 rounded-lg bg-slate-900 text-blue-300 border border-slate-800">2. Dimensions</span>
                        <span className="px-2.5 py-1 rounded-lg bg-slate-900 text-amber-300 border border-slate-800">3. Hazard Matrix</span>
                        <span className="px-2.5 py-1 rounded-lg bg-slate-900 text-emerald-300 border border-slate-800">4. Truck Corridor</span>
                        <span className="px-2.5 py-1 rounded-lg bg-slate-900 text-purple-300 border border-slate-800">5. Yard Plan</span>
                        <span className="px-2.5 py-1 rounded-lg bg-slate-900 text-teal-300 border border-slate-800">6. Sign-off</span>
                      </div>
                    </div>
                  </div>
                ) : (
                  /* Android Nav SDK Feature Showcase View */
                  <div className="p-5 bg-slate-950 space-y-4">
                    <div className="p-4 rounded-2xl bg-cyan-950/30 border border-cyan-500/40 space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-black text-cyan-300 flex items-center gap-2">
                          <Navigation className="w-4 h-4 text-cyan-400" />
                          <span>TomTom Maps &amp; Navigation SDK for Android (`Dx27rvc...`)</span>
                        </span>
                        <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-cyan-500/20 text-cyan-300 font-bold border border-cyan-500/30">
                          ENTERPRISE TRUCK NAV
                        </span>
                      </div>
                      <p className="text-xs text-slate-300 leading-relaxed">
                        The Android Navigation SDK connects directly to our SiteRisk assessments to solve the "final 2 miles" problem. It enforces the exact approved HGV approach corridor, prevents low-bridge strikes, alerts the driver to assessed hazards with Horizon audio chimes, and auto-switches to 10 mph yard docking.
                      </p>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div className="p-3.5 rounded-xl bg-slate-900 border border-slate-800 space-y-1">
                        <span className="text-xs font-bold text-white flex items-center gap-2">
                          <CheckCircle2 className="w-3.5 h-3.5 text-cyan-400" />
                          <span>Last-Mile Corridor Enforcement</span>
                        </span>
                        <p className="text-[11px] text-slate-400">
                          Bypasses generic car GPS shortcuts; forces trucks onto designated bypasses to avoid village bottlenecks.
                        </p>
                      </div>

                      <div className="p-3.5 rounded-xl bg-slate-900 border border-slate-800 space-y-1">
                        <span className="text-xs font-bold text-white flex items-center gap-2">
                          <CheckCircle2 className="w-3.5 h-3.5 text-amber-400" />
                          <span>In-Cab Horizon Audio Alerts</span>
                        </span>
                        <p className="text-[11px] text-slate-400">
                          Triggers voice warnings 250m before assessed blind spots, steep ramps, or forklift crossings.
                        </p>
                      </div>

                      <div className="p-3.5 rounded-xl bg-slate-900 border border-slate-800 space-y-1">
                        <span className="text-xs font-bold text-white flex items-center gap-2">
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                          <span>Bridge Strike 3D Verification</span>
                        </span>
                        <p className="text-[11px] text-slate-400">
                          Cross-references trailer combination height (4.45m) with road bridge heights with 0.15m buffer.
                        </p>
                      </div>

                      <div className="p-3.5 rounded-xl bg-slate-900 border border-slate-800 space-y-1">
                        <span className="text-xs font-bold text-white flex items-center gap-2">
                          <CheckCircle2 className="w-3.5 h-3.5 text-purple-400" />
                          <span>Geofenced Yard Docking Mode</span>
                        </span>
                        <p className="text-[11px] text-slate-400">
                          Switches to 10 mph yard speed limit and auto-presents gate induction pass when approaching barrier.
                        </p>
                      </div>
                    </div>

                    <button
                      onClick={() => {
                        setView('ANDROID_NAV_SDK_VIEW');
                        setIsNavSimActive(true);
                      }}
                      className="w-full py-3 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-400 hover:to-blue-400 text-slate-950 font-black text-xs flex items-center justify-center gap-2 cursor-pointer shadow-lg shadow-cyan-500/20"
                    >
                      <Compass className="w-4 h-4 fill-slate-950" />
                      <span>Launch In-Cab Android Navigation Simulator</span>
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </main>
      )}

      {/* ========================================================================= */}
      {/* 2. ACTION MENU VIEW                                                       */}
      {/* ========================================================================= */}
      {view === 'ACTION_MENU' && (
        <main className="flex-1 flex flex-col justify-center max-w-xl mx-auto w-full p-4 sm:p-6 space-y-6">
          <div className="flex items-center justify-between">
            <button
              onClick={() => setView('WELCOME')}
              className="flex items-center gap-1.5 text-xs font-bold text-slate-400 hover:text-white transition-colors cursor-pointer"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Back</span>
            </button>
            <span className="text-[10px] font-mono text-cyan-400 bg-cyan-500/10 px-2.5 py-1 rounded-full border border-cyan-500/30">
              SiteRisk Action Hub
            </span>
          </div>

          <div className="space-y-1">
            <h2 className="text-2xl font-black text-white">SiteRisk Suite</h2>
            <p className="text-xs text-slate-400">
              Select an action or create a new depot risk assessment:
            </p>
          </div>

          <div className="space-y-3">
            {/* 1. Create New Site Risk Assessment (Step-by-Step Wizard) */}
            <button
              onClick={() => {
                setWizardStep(1);
                setView('STEP_WIZARD');
              }}
              className="w-full p-4 rounded-2xl bg-gradient-to-r from-cyan-500/15 via-slate-900 to-slate-900 border-2 border-cyan-500/50 hover:border-cyan-400 flex items-center justify-between transition-all group text-left cursor-pointer shadow-lg shadow-cyan-500/10"
            >
              <div className="flex items-center gap-3.5">
                <div className="w-12 h-12 rounded-xl bg-cyan-500 text-slate-950 flex items-center justify-center font-bold shadow-md shadow-cyan-500/30">
                  <Plus className="w-6 h-6 stroke-[2.5]" />
                </div>
                <div>
                  <div className="text-base font-black text-white group-hover:text-cyan-300 flex items-center gap-2">
                    <span>Create Risk Assessment</span>
                    <span className="text-[10px] font-mono font-bold text-cyan-300 bg-cyan-500/20 px-2 py-0.5 rounded-full border border-cyan-500/30">
                      6-Step Wizard
                    </span>
                  </div>
                  <div className="text-xs text-slate-400">
                    Location, dimensions, hazard matrix, truck corridor &amp; yard plan
                  </div>
                </div>
              </div>
              <ChevronRight className="w-5 h-5 text-cyan-400 group-hover:translate-x-1 transition-transform" />
            </button>

            {/* 2. In-Cab Android Nav SDK Simulator */}
            <button
              onClick={() => {
                setView('ANDROID_NAV_SDK_VIEW');
                setIsNavSimActive(true);
              }}
              className="w-full p-4 rounded-2xl bg-gradient-to-r from-blue-500/15 via-slate-900 to-slate-900 border border-blue-500/40 hover:border-blue-400 flex items-center justify-between transition-all group text-left cursor-pointer"
            >
              <div className="flex items-center gap-3.5">
                <div className="w-12 h-12 rounded-xl bg-blue-500/20 text-blue-400 flex items-center justify-center font-bold">
                  <Navigation className="w-6 h-6" />
                </div>
                <div>
                  <div className="text-base font-bold text-white group-hover:text-blue-300 flex items-center gap-2">
                    <span>Android Truck Nav Simulator</span>
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-blue-500/20 text-blue-300">
                      TomTom SDK
                    </span>
                  </div>
                  <div className="text-xs text-slate-400">
                    Live turn-by-turn guidance, Horizon audio alerts &amp; yard geofence
                  </div>
                </div>
              </div>
              <ChevronRight className="w-5 h-5 text-slate-500 group-hover:text-blue-400 group-hover:translate-x-1 transition-transform" />
            </button>

            {/* 3. Site Risk Assessments Library */}
            <button
              onClick={() => setView('SITE_DETAIL')}
              className="w-full p-4 rounded-2xl bg-slate-900 border border-slate-800 hover:border-emerald-500/50 flex items-center justify-between transition-all group text-left cursor-pointer"
            >
              <div className="flex items-center gap-3.5">
                <div className="w-12 h-12 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center font-bold">
                  <Building2 className="w-6 h-6" />
                </div>
                <div>
                  <div className="text-base font-bold text-white group-hover:text-emerald-300 flex items-center gap-2">
                    <span>Site Assessments Directory</span>
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-800 text-slate-300">
                      {sites.length} Active Hubs
                    </span>
                  </div>
                  <div className="text-xs text-slate-400">
                    DIRFT Daventry, Magna Park, Felixstowe Port &amp; Crick NDC
                  </div>
                </div>
              </div>
              <ChevronRight className="w-5 h-5 text-slate-500 group-hover:text-emerald-400 group-hover:translate-x-1 transition-transform" />
            </button>

            {/* 3b. Motorway Services & Truckstops (TripAdvisor for Truckers) */}
            <button
              onClick={() => {
                setSiteCategoryFilter('MOTORWAY_SERVICES');
                const firstMsa = sites.find((s) => s.siteType === 'MOTORWAY_SERVICES' || s.siteType === 'TRUCKSTOP');
                if (firstMsa) setSelectedSiteId(firstMsa.id);
                setView('SITE_DETAIL');
              }}
              className="w-full p-4 rounded-2xl bg-gradient-to-r from-emerald-500/15 via-slate-900 to-slate-900 border-2 border-emerald-500/50 hover:border-emerald-400 flex items-center justify-between transition-all group text-left cursor-pointer shadow-lg shadow-emerald-500/10"
            >
              <div className="flex items-center gap-3.5">
                <div className="w-12 h-12 rounded-xl bg-emerald-500 text-slate-950 flex items-center justify-center font-bold shadow-md shadow-emerald-500/30">
                  <Coffee className="w-6 h-6 stroke-[2.5]" />
                </div>
                <div>
                  <div className="text-base font-black text-white group-hover:text-emerald-300 flex items-center gap-2">
                    <span>Motorway Services &amp; Truckstops</span>
                    <span className="text-[10px] font-mono font-bold text-emerald-300 bg-emerald-500/20 px-2 py-0.5 rounded-full border border-emerald-500/30">
                      TripAdvisor for Truckers
                    </span>
                  </div>
                  <div className="text-xs text-slate-400">
                    Live HGV parking capacity, 5-star driver ratings, showers, security &amp; SNAP tariffs
                  </div>
                </div>
              </div>
              <ChevronRight className="w-5 h-5 text-emerald-400 group-hover:translate-x-1 transition-transform" />
            </button>

            {/* 4. Switch to Tacho-Scan */}
            {onSwitchToTachoScan && (
              <button
                onClick={onSwitchToTachoScan}
                className="w-full p-4 rounded-2xl bg-gradient-to-r from-amber-500/10 via-slate-900 to-slate-900 border border-amber-500/30 hover:border-amber-400 flex items-center justify-between transition-all group text-left cursor-pointer shadow-lg shadow-amber-500/5"
              >
                <div className="flex items-center gap-3.5">
                  <div className="w-12 h-12 rounded-xl bg-amber-500/20 text-amber-400 flex items-center justify-center font-bold">
                    <Clock className="w-6 h-6" />
                  </div>
                  <div>
                    <div className="text-base font-bold text-white group-hover:text-amber-300 flex items-center gap-2">
                      <span>Tacho-Scan</span>
                      <span className="text-[10px] font-mono font-bold text-amber-400 bg-amber-500/20 px-2 py-0.5 rounded-full border border-amber-500/30">
                        EU 561/2006
                      </span>
                    </div>
                    <div className="text-xs text-slate-400">
                      Thermal roll OCR scanner, timesheets &amp; roadside dossier
                    </div>
                  </div>
                </div>
                <ChevronRight className="w-5 h-5 text-slate-500 group-hover:text-amber-400 group-hover:translate-x-1 transition-transform" />
              </button>
            )}

            {/* 5. Switch to Vehicle-Check */}
            {onSwitchToVehicleCheck && (
              <button
                onClick={onSwitchToVehicleCheck}
                className="w-full p-4 rounded-2xl bg-gradient-to-r from-emerald-500/10 via-slate-900 to-slate-900 border border-emerald-500/30 hover:border-emerald-400 flex items-center justify-between transition-all group text-left cursor-pointer shadow-lg shadow-emerald-500/5"
              >
                <div className="flex items-center gap-3.5">
                  <div className="w-12 h-12 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center font-bold">
                    <Truck className="w-6 h-6" />
                  </div>
                  <div>
                    <div className="text-base font-bold text-white group-hover:text-emerald-300 flex items-center gap-2">
                      <span>Vehicle-Check (DVSA)</span>
                      <span className="text-[10px] font-mono font-bold text-emerald-400 bg-emerald-500/20 px-2 py-0.5 rounded-full border border-emerald-500/30">
                        AI Walkaround
                      </span>
                    </div>
                    <div className="text-xs text-slate-400">
                      Wheel nut AI, tread depth gauge, 5th-wheel coupling &amp; acoustic air leaks
                    </div>
                  </div>
                </div>
                <ChevronRight className="w-5 h-5 text-slate-500 group-hover:text-emerald-400 group-hover:translate-x-1 transition-transform" />
              </button>
            )}

            {/* 6. Switch to Safety & Bridge Shield (7 SHIELDS) */}
            {onSwitchToSafetyShield && (
              <button
                onClick={onSwitchToSafetyShield}
                className="w-full p-4 rounded-2xl bg-gradient-to-r from-rose-500/15 via-slate-900 to-slate-900 border-2 border-rose-500/50 hover:border-rose-400 flex items-center justify-between transition-all group text-left cursor-pointer shadow-lg shadow-rose-500/10"
              >
                <div className="flex items-center gap-3.5">
                  <div className="w-12 h-12 rounded-xl bg-rose-600 text-white flex items-center justify-center font-bold shadow-md shadow-rose-600/30">
                    <ShieldAlert className="w-6 h-6 stroke-[2.5]" />
                  </div>
                  <div>
                    <div className="text-base font-black text-white group-hover:text-rose-300 flex items-center gap-2">
                      <span>Safety &amp; Bridge Shield</span>
                      <span className="text-[10px] font-mono font-bold text-rose-300 bg-rose-500/20 px-2 py-0.5 rounded-full border border-rose-500/30">
                        7 SHIELDS
                      </span>
                    </div>
                    <div className="text-xs text-slate-400">
                      Network Rail low bridge radar, tacho 4.5h horizon, blind-spot mirror alert &amp; £34.90 tax logger
                    </div>
                  </div>
                </div>
                <ChevronRight className="w-5 h-5 text-rose-400 group-hover:translate-x-1 transition-transform" />
              </button>
            )}
          </div>
        </main>
      )}

      {/* ========================================================================= */}
      {/* 3. STEP-BY-STEP CREATION WIZARD (THE REQUESTED CREATION MODEL)            */}
      {/* ========================================================================= */}
      {view === 'STEP_WIZARD' && (
        <main className="flex-1 flex flex-col max-w-4xl mx-auto w-full p-4 sm:p-6 space-y-6">
          {/* Header Bar */}
          <div className="flex items-center justify-between border-b border-slate-800 pb-4">
            <button
              onClick={() => {
                if (wizardStep > 1) {
                  setWizardStep((prev) => prev - 1);
                } else {
                  setView('ACTION_MENU');
                }
              }}
              className="flex items-center gap-1.5 text-xs font-bold text-slate-400 hover:text-white transition-colors cursor-pointer"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>{wizardStep > 1 ? 'Previous Step' : 'Cancel'}</span>
            </button>
            <div className="flex items-center gap-2">
              <span className="text-xs font-mono font-bold text-cyan-400">
                Step {wizardStep} of {totalWizardSteps}
              </span>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-cyan-500/20 text-cyan-300 border border-cyan-500/30">
                Creation Model
              </span>
            </div>
          </div>

          {/* Wizard Progress Bar */}
          <div className="h-2 w-full rounded-full bg-slate-900 border border-slate-800 overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-cyan-500 via-blue-500 to-teal-400 transition-all duration-300"
              style={{ width: `${(wizardStep / totalWizardSteps) * 100}%` }}
            />
          </div>

          {/* STEP 1: DEPOT LOCATION & INBOUND COMMERCIAL GATE */}
          {wizardStep === 1 && (
            <div className="space-y-5 animate-in fade-in">
              <div className="space-y-1">
                <h3 className="text-xl font-black text-white flex items-center gap-2">
                  <MapPin className="w-5 h-5 text-cyan-400" />
                  <span>Step 1: Depot Location &amp; Inbound Commercial Gate</span>
                </h3>
                <p className="text-xs text-slate-400">
                  Define the logistics destination. Ensure coordinates point to the <strong>HGV Goods Gate</strong> rather than the car park.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 p-4 rounded-2xl bg-slate-900 border border-slate-800">
                {/* Google Places & Business Profile OAuth Architecture Banner */}
                <div className="sm:col-span-2 p-3.5 rounded-2xl bg-cyan-950/40 border border-cyan-500/40 flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-inner">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-xl bg-cyan-500/20 text-cyan-400 flex items-center justify-center shrink-0 border border-cyan-500/30">
                      <Building2 className="w-5 h-5" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-bold text-white">
                          {verifiedDepotClaim
                            ? `✓ ${verifiedDepotClaim.businessName}`
                            : 'Google Places & Business Profile OAuth Architecture'}
                        </span>
                        <span className="text-[9px] font-mono px-1.5 py-0.2 rounded bg-cyan-500/20 text-cyan-300 font-bold uppercase">
                          {verifiedDepotClaim ? verifiedDepotClaim.verifiedUser.role : 'OAuth 2.0'}
                        </span>
                      </div>
                      <p className="text-[11px] text-slate-400 mt-0.5">
                        {verifiedDepotClaim
                          ? `Verified Primary Owner: ${verifiedDepotClaim.verifiedUser.name} (${verifiedDepotClaim.verifiedUser.email})`
                          : 'Places API (Discovery & place_id) + Business Profile API (Owner Authentication)'}
                      </p>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => setIsGbpModalOpen(true)}
                    className="px-3.5 py-2 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-slate-950 font-black text-xs flex items-center justify-center gap-1.5 transition-all shadow-md shadow-cyan-500/20 cursor-pointer whitespace-nowrap active:scale-95"
                  >
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>{verifiedDepotClaim ? 'Re-Verify Facility' : 'Verify via Google OAuth'}</span>
                  </button>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-mono font-bold text-slate-300 uppercase">Site Name / Hub Title</label>
                  <input
                    type="text"
                    value={wTitle}
                    onChange={(e) => setWTitle(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-white font-mono text-xs focus:outline-none focus:border-cyan-400"
                    placeholder="e.g. DIRFT Daventry Intermodal Rail Hub"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-mono font-bold text-slate-300 uppercase">Operating Entity / Haulier</label>
                  <input
                    type="text"
                    value={wBusinessName}
                    onChange={(e) => setWBusinessName(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-white font-mono text-xs focus:outline-none focus:border-cyan-400"
                    placeholder="e.g. Maritime Transport UK"
                  />
                </div>

                <div className="sm:col-span-2 space-y-1.5">
                  <label className="text-xs font-mono font-bold text-slate-300 uppercase">Full Physical Address</label>
                  <input
                    type="text"
                    value={wAddress}
                    onChange={(e) => setWAddress(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-white font-mono text-xs focus:outline-none focus:border-cyan-400"
                    placeholder="e.g. Crick Road, DIRFT, Daventry, NN6 7GZ, UK"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-mono font-bold text-slate-300 uppercase">What3Words Address</label>
                  <input
                    type="text"
                    value={wWhat3words}
                    onChange={(e) => setWWhat3words(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-white font-mono text-xs focus:outline-none focus:border-cyan-400"
                    placeholder="///focal.shoppers.cushion"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-mono font-bold text-slate-300 uppercase">Google Plus Code</label>
                  <input
                    type="text"
                    value={wPlusCode}
                    onChange={(e) => setWPlusCode(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-white font-mono text-xs focus:outline-none focus:border-cyan-400"
                    placeholder="9C4VFR54+9Q"
                  />
                </div>
              </div>

              {/* HGV Gate vs Car Park Warning Banner */}
              <div className="p-4 rounded-2xl bg-cyan-950/30 border border-cyan-500/40 text-xs text-slate-300 flex items-start gap-3">
                <CheckCircle2 className="w-5 h-5 text-cyan-400 shrink-0 mt-0.5" />
                <div>
                  <strong className="text-white">Commercial Gate Protection Active:</strong> Destination is locked to Latitude <code>{wCoordinates.lat}</code>, Longitude <code>{wCoordinates.lng}</code>. When synced to TomTom Android Nav SDK, trucks will be guided past the low-barrier visitor car park directly into the HGV Security Weighbridge.
                </div>
              </div>
            </div>
          )}

          {/* STEP 2: VEHICLE & DIMENSIONAL ACCESS RESTRICTIONS */}
          {wizardStep === 2 && (
            <div className="space-y-5 animate-in fade-in">
              <div className="space-y-1">
                <h3 className="text-xl font-black text-white flex items-center gap-2">
                  <Truck className="w-5 h-5 text-blue-400" />
                  <span>Step 2: Vehicle &amp; Dimensional Access Profile</span>
                </h3>
                <p className="text-xs text-slate-400">
                  Set statutory site height clearances, weight limits, and turning restrictions to prevent bridge strikes and groundings.
                </p>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {/* Max Height */}
                <div className="p-3.5 rounded-2xl bg-slate-900 border border-slate-800 space-y-1">
                  <label className="text-[10px] font-mono text-slate-400 uppercase">Max Height (m)</label>
                  <input
                    type="number"
                    step="0.05"
                    value={wMaxHeight}
                    onChange={(e) => setWMaxHeight(parseFloat(e.target.value))}
                    className="w-full px-2.5 py-1.5 rounded-lg bg-slate-950 border border-slate-700 text-white font-black text-lg"
                  />
                  <div className="text-[10px] font-mono text-cyan-400">{Math.floor(wMaxHeight * 3.28084)}ft {Math.round((wMaxHeight * 3.28084 % 1) * 12)}in</div>
                </div>

                {/* Max Weight */}
                <div className="p-3.5 rounded-2xl bg-slate-900 border border-slate-800 space-y-1">
                  <label className="text-[10px] font-mono text-slate-400 uppercase">Max Weight (Tonnes)</label>
                  <input
                    type="number"
                    step="0.5"
                    value={wMaxWeight}
                    onChange={(e) => setWMaxWeight(parseFloat(e.target.value))}
                    className="w-full px-2.5 py-1.5 rounded-lg bg-slate-950 border border-slate-700 text-white font-black text-lg"
                  />
                  <div className="text-[10px] font-mono text-emerald-400">44t UK Limit</div>
                </div>

                {/* Max Length */}
                <div className="p-3.5 rounded-2xl bg-slate-900 border border-slate-800 space-y-1">
                  <label className="text-[10px] font-mono text-slate-400 uppercase">Max Length (m)</label>
                  <input
                    type="number"
                    step="0.5"
                    value={wMaxLength}
                    onChange={(e) => setWMaxLength(parseFloat(e.target.value))}
                    className="w-full px-2.5 py-1.5 rounded-lg bg-slate-950 border border-slate-700 text-white font-black text-lg"
                  />
                  <div className="text-[10px] font-mono text-amber-400">16.5m Artic Max</div>
                </div>

                {/* Max Width */}
                <div className="p-3.5 rounded-2xl bg-slate-900 border border-slate-800 space-y-1">
                  <label className="text-[10px] font-mono text-slate-400 uppercase">Max Width (m)</label>
                  <input
                    type="number"
                    step="0.05"
                    value={wMaxWidth}
                    onChange={(e) => setWMaxWidth(parseFloat(e.target.value))}
                    className="w-full px-2.5 py-1.5 rounded-lg bg-slate-950 border border-slate-700 text-white font-black text-lg"
                  />
                  <div className="text-[10px] font-mono text-purple-400">2.55m Standard</div>
                </div>
              </div>

              {/* Turning Circle & Constraints */}
              <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 space-y-3">
                <div className="space-y-1.5">
                  <label className="text-xs font-mono font-bold text-slate-300 uppercase">Yard Turning Geometry</label>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                    {(['EASY', 'MODERATE', 'TIGHT', 'EXTREME_REVERSING_ONLY'] as const).map((mode) => (
                      <button
                        key={mode}
                        type="button"
                        onClick={() => setWTurningCircle(mode)}
                        className={`p-2.5 rounded-xl border text-xs font-bold transition-all cursor-pointer ${
                          wTurningCircle === mode
                            ? 'bg-cyan-500/20 border-cyan-400 text-cyan-300'
                            : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-white'
                        }`}
                      >
                        {mode.replace(/_/g, ' ')}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="flex items-center gap-3 pt-2 border-t border-slate-800">
                  <input
                    type="checkbox"
                    id="tailLiftChk"
                    checked={wTailLift}
                    onChange={(e) => setWTailLift(e.target.checked)}
                    className="rounded bg-slate-950 border-slate-700 text-cyan-500 focus:ring-cyan-400"
                  />
                  <label htmlFor="tailLiftChk" className="text-xs text-slate-200 cursor-pointer">
                    Tail Lift Required (Ground discharge without loading bay)
                  </label>
                </div>
              </div>
            </div>
          )}

          {/* STEP 3: DYNAMIC HAZARD MATRIX & HIGH-RISK ZONES */}
          {wizardStep === 3 && (
            <div className="space-y-5 animate-in fade-in">
              <div className="space-y-1">
                <h3 className="text-xl font-black text-white flex items-center gap-2">
                  <AlertTriangle className="w-5 h-5 text-amber-400" />
                  <span>Step 3: Dynamic Hazard Matrix &amp; High-Risk Zones</span>
                </h3>
                <p className="text-xs text-slate-400">
                  Identify specific site dangers (forklifts, blind spots, steep inclines). These will trigger in-cab audio warnings in the TomTom Android Nav SDK.
                </p>
              </div>

              {/* Add Hazard Inline Form */}
              <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 space-y-3">
                <span className="text-xs font-mono font-bold text-slate-300 uppercase">Add Site Hazard:</span>
                <div className="flex flex-col sm:flex-row items-center gap-2">
                  <input
                    type="text"
                    value={newHazardName}
                    onChange={(e) => setNewHazardName(e.target.value)}
                    placeholder="e.g. Pedestrian zebra crossing at driver exit gate"
                    className="flex-1 px-3 py-2 rounded-xl bg-slate-950 border border-slate-700 text-white font-mono text-xs focus:outline-none focus:border-cyan-400"
                  />
                  <div className="flex items-center gap-2 w-full sm:w-auto">
                    <select
                      value={newHazardSeverity}
                      onChange={(e) => setNewHazardSeverity(parseInt(e.target.value))}
                      className="px-2.5 py-2 rounded-xl bg-slate-950 border border-slate-700 text-xs text-white"
                    >
                      <option value="1">Sev: 1 (Minor)</option>
                      <option value="2">Sev: 2 (Low)</option>
                      <option value="3">Sev: 3 (Moderate)</option>
                      <option value="4">Sev: 4 (Major)</option>
                      <option value="5">Sev: 5 (Fatal/Catastrophic)</option>
                    </select>
                    <select
                      value={newHazardLikelihood}
                      onChange={(e) => setNewHazardLikelihood(parseInt(e.target.value))}
                      className="px-2.5 py-2 rounded-xl bg-slate-950 border border-slate-700 text-xs text-white"
                    >
                      <option value="1">Lik: 1 (Rare)</option>
                      <option value="2">Lik: 2 (Unlikely)</option>
                      <option value="3">Lik: 3 (Possible)</option>
                      <option value="4">Lik: 4 (Probable)</option>
                      <option value="5">Lik: 5 (Frequent)</option>
                    </select>
                    <button
                      onClick={handleAddHazard}
                      className="px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs cursor-pointer transition-colors"
                    >
                      Add
                    </button>
                  </div>
                </div>
              </div>

              {/* Hazard List */}
              <div className="space-y-2">
                {wHazards.map((haz) => (
                  <div
                    key={haz.id}
                    className="p-3.5 rounded-2xl bg-slate-900 border border-slate-800 flex items-center justify-between gap-3"
                  >
                    <div className="space-y-0.5">
                      <div className="text-xs font-bold text-white flex items-center gap-2">
                        <span>{haz.hazard}</span>
                        <span
                          className={`text-[9px] font-mono px-1.5 py-0.2 rounded font-bold ${
                            haz.riskLevel === 'HIGH'
                              ? 'bg-rose-500/20 text-rose-300 border border-rose-500/40'
                              : 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
                          }`}
                        >
                          Score: {haz.riskRating} ({haz.riskLevel})
                        </span>
                      </div>
                      <div className="text-[11px] text-slate-400 line-clamp-1">
                        Control: {haz.controlMeasures[0] || 'Observe 10 mph yard speed limit'}
                      </div>
                    </div>
                    <button
                      onClick={() => handleDeleteHazard(haz.id)}
                      className="p-1 text-slate-500 hover:text-rose-400 cursor-pointer"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* STEP 4: LAST-MILE APPROACH CORRIDOR & TURN-BY-TURN */}
          {wizardStep === 4 && (
            <div className="space-y-5 animate-in fade-in">
              <div className="space-y-1">
                <h3 className="text-xl font-black text-white flex items-center gap-2">
                  <Compass className="w-5 h-5 text-emerald-400" />
                  <span>Step 4: Last-Mile Inbound Corridor &amp; Turn-by-Turn</span>
                </h3>
                <p className="text-xs text-slate-400">
                  Establish the designated truck route from the motorway and specify forbidden turns to prevent village jams and weight limit fines.
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 space-y-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-mono font-bold text-slate-300 uppercase">Primary Motorway Junction</label>
                  <input
                    type="text"
                    value={wMotorwayJunction}
                    onChange={(e) => setWMotorwayJunction(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-white font-mono text-xs focus:outline-none focus:border-cyan-400"
                    placeholder="e.g. M1 J20 or M6 J1"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-mono font-bold text-slate-300 uppercase">Mandatory Designated HGV Corridor</label>
                  <textarea
                    rows={3}
                    value={wDesignatedRoute}
                    onChange={(e) => setWDesignatedRoute(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-white font-mono text-xs focus:outline-none focus:border-cyan-400"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-mono font-bold text-rose-300 uppercase">Forbidden Turns &amp; Weight Limit Avoidance</label>
                  <textarea
                    rows={2}
                    value={wForbiddenTurns}
                    onChange={(e) => setWForbiddenTurns(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-rose-900/50 text-rose-200 font-mono text-xs focus:outline-none focus:border-rose-400"
                  />
                </div>
              </div>

              {/* Turn-by-Turn Checkpoints */}
              <div className="space-y-2">
                <span className="text-xs font-mono font-bold text-slate-300 uppercase">Inbound Navigation Checkpoints:</span>
                {wApproachSteps.map((st, i) => (
                  <div key={i} className="p-3 rounded-xl bg-slate-900/70 border border-slate-800 flex items-center gap-3">
                    <span className="w-6 h-6 rounded-full bg-cyan-500/20 text-cyan-300 flex items-center justify-center font-mono font-bold text-xs">
                      {st.stepNumber}
                    </span>
                    <div className="flex-1">
                      <div className="text-xs font-bold text-white">{st.heading}</div>
                      <div className="text-[11px] text-slate-400">{st.instruction}</div>
                    </div>
                    <span className="text-[10px] font-mono text-slate-500 uppercase">{st.checkpointType}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* STEP 5: SATELLITE YARD PLAN & GATE PROTOCOLS */}
          {wizardStep === 5 && (
            <div className="space-y-5 animate-in fade-in">
              <div className="space-y-1">
                <h3 className="text-xl font-black text-white flex items-center gap-2">
                  <Building2 className="w-5 h-5 text-purple-400" />
                  <span>Step 5: Visual Satellite Yard Layout &amp; Gate Protocols</span>
                </h3>
                <p className="text-xs text-slate-400">
                  Set the security barrier access code, communication channels, and mandatory PPE for visiting drivers.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 p-4 rounded-2xl bg-slate-900 border border-slate-800">
                <div className="space-y-1.5">
                  <label className="text-xs font-mono font-bold text-slate-300 uppercase flex items-center gap-1.5">
                    <Key className="w-3.5 h-3.5 text-cyan-400" />
                    <span>Gate Security Barrier Passcode</span>
                  </label>
                  <input
                    type="text"
                    value={wGateCode}
                    onChange={(e) => setWGateCode(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-white font-mono text-sm font-bold focus:outline-none focus:border-cyan-400"
                    placeholder="#5820*"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-mono font-bold text-slate-300 uppercase flex items-center gap-1.5">
                    <Volume2 className="w-3.5 h-3.5 text-amber-400" />
                    <span>UHF CB Radio Channel</span>
                  </label>
                  <input
                    type="text"
                    value={wRadioChannel}
                    onChange={(e) => setWRadioChannel(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-white font-mono text-xs focus:outline-none focus:border-cyan-400"
                    placeholder="UHF CH 19"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-mono font-bold text-slate-300 uppercase">Loading Bays Available</label>
                  <input
                    type="number"
                    value={wBayCount}
                    onChange={(e) => setWBayCount(parseInt(e.target.value))}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-white font-mono text-xs focus:outline-none focus:border-cyan-400"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-mono font-bold text-slate-300 uppercase">Dock Type</label>
                  <select
                    value={wDockType}
                    onChange={(e) => setWDockType(e.target.value as any)}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-white font-mono text-xs"
                  >
                    <option value="FLUSH_DOCK">Flush Loading Bay with Leveller</option>
                    <option value="GROUND_LEVEL">Ground Level Apron Discharge</option>
                    <option value="RAMP">Incline Drive-In Ramp</option>
                    <option value="TAIL_LIFT_ONLY">Tail-Lift Only</option>
                  </select>
                </div>
              </div>

              {/* Mandatory PPE Checklist */}
              <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 space-y-2">
                <span className="text-xs font-mono font-bold text-slate-300 uppercase">Mandatory Visiting Driver PPE:</span>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {wPPE.map((ppe, i) => (
                    <div key={i} className="flex items-center gap-2 p-2 rounded-xl bg-slate-950 text-xs text-slate-200">
                      <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                      <span>{ppe}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* STEP 6: REVIEW, RISK SCORE CALCULATION & PUBLISH */}
          {wizardStep === 6 && (
            <div className="space-y-5 animate-in fade-in">
              <div className="space-y-1">
                <h3 className="text-xl font-black text-white flex items-center gap-2">
                  <FileCheck className="w-5 h-5 text-teal-400" />
                  <span>Step 6: Review, Risk Score Calculation &amp; Publish</span>
                </h3>
                <p className="text-xs text-slate-400">
                  Review the composite site blueprint. Once signed, the assessment will broadcast to driver cockpits and the TomTom Android Nav SDK.
                </p>
              </div>

              {/* Review Card */}
              <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800 pb-4">
                  <div>
                    <h4 className="text-lg font-black text-white">{wTitle}</h4>
                    <p className="text-xs text-slate-400">{wAddress}</p>
                  </div>
                  <div className="text-right">
                    <span className="px-3 py-1 rounded-full text-xs font-mono font-bold bg-cyan-500/20 text-cyan-300 border border-cyan-500/40">
                      APPROVED HGV HUB
                    </span>
                  </div>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
                  <div>
                    <span className="text-slate-500 block text-[10px] uppercase">Height Limit</span>
                    <strong className="text-white">{wMaxHeight}m ({Math.floor(wMaxHeight * 3.28084)}ft {Math.round((wMaxHeight * 3.28084 % 1) * 12)}in)</strong>
                  </div>
                  <div>
                    <span className="text-slate-500 block text-[10px] uppercase">Weight Limit</span>
                    <strong className="text-emerald-400">{wMaxWeight}t GCW</strong>
                  </div>
                  <div>
                    <span className="text-slate-500 block text-[10px] uppercase">Gate Code</span>
                    <strong className="text-cyan-400 font-mono">{wGateCode}</strong>
                  </div>
                  <div>
                    <span className="text-slate-500 block text-[10px] uppercase">Hazards Mapped</span>
                    <strong className="text-amber-400">{wHazards.length} Critical Points</strong>
                  </div>
                </div>

                <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-300 space-y-1">
                  <div className="font-bold text-cyan-400">Designated Motorway Route:</div>
                  <div className="text-slate-400">{wDesignatedRoute}</div>
                </div>

                {/* Statutory Sign-off */}
                <div className="p-3.5 rounded-xl bg-emerald-950/30 border border-emerald-500/40 text-xs text-emerald-300 space-y-1">
                  <div className="font-bold flex items-center gap-1.5">
                    <ShieldCheck className="w-4 h-4 text-emerald-400" />
                    <span>Statutory Health &amp; Safety at Work Act 1974 Compliance</span>
                  </div>
                  <p className="text-[11px] text-emerald-300/80">
                    Signed by {driverLicenceProfile?.fullName || 'Alex Kite (Safety Lead)'} • Audit cryptographically anchored to SHA-256 ledger.
                  </p>
                </div>

                {/* Google Business Profile Verified Badge */}
                {verifiedDepotClaim && (
                  <div className="p-3.5 rounded-xl bg-cyan-950/40 border border-cyan-500/40 text-xs text-cyan-300 space-y-1">
                    <div className="font-bold flex items-center justify-between">
                      <div className="flex items-center gap-1.5">
                        <Building2 className="w-4 h-4 text-cyan-400" />
                        <span>Google Business Profile Verified Depot RAMS</span>
                      </div>
                      <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-cyan-500/20 text-cyan-200 border border-cyan-500/30 uppercase">
                        {verifiedDepotClaim.verifiedUser.role}
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-300">
                      Verified Owner: {verifiedDepotClaim.verifiedUser.name} ({verifiedDepotClaim.verifiedUser.email}) • Token: {verifiedDepotClaim.attestationToken.substring(0, 20)}...
                    </p>
                  </div>
                )}
              </div>

              {/* Action: Publish */}
              <button
                onClick={handleCompleteAssessment}
                className="w-full py-4 rounded-2xl bg-gradient-to-r from-cyan-500 via-blue-500 to-teal-400 hover:from-cyan-400 hover:to-teal-300 text-slate-950 font-black text-base shadow-xl shadow-cyan-500/25 flex items-center justify-center gap-2 cursor-pointer transition-all active:scale-95"
              >
                <CheckCircle2 className="w-5 h-5 text-slate-950" />
                <span>Publish Site Risk Assessment &amp; Sync to TomTom Android Nav</span>
              </button>
            </div>
          )}

          {/* Wizard Next / Previous Footer */}
          <div className="flex items-center justify-between pt-4 border-t border-slate-800">
            {wizardStep > 1 ? (
              <button
                onClick={() => setWizardStep((prev) => prev - 1)}
                className="px-4 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-300 font-bold text-xs cursor-pointer"
              >
                Previous Step
              </button>
            ) : <div />}

            {wizardStep < totalWizardSteps && (
              <button
                onClick={() => setWizardStep((prev) => prev + 1)}
                className="px-6 py-2.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-black text-xs flex items-center gap-1.5 cursor-pointer shadow-md shadow-cyan-500/20"
              >
                <span>Continue to Step {wizardStep + 1}</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            )}
          </div>
        </main>
      )}

      {/* ========================================================================= */}
      {/* 4. ANDROID NAVIGATION SDK SIMULATOR (DEDICATED SHOWCASE)                   */}
      {/* ========================================================================= */}
      {view === 'ANDROID_NAV_SDK_VIEW' && (
        <main className="flex-1 flex flex-col max-w-4xl mx-auto w-full p-4 sm:p-6 space-y-5">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <button
              onClick={() => setView('ACTION_MENU')}
              className="flex items-center gap-1.5 text-xs font-bold text-slate-400 hover:text-white transition-colors cursor-pointer"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Back to Action Hub</span>
            </button>
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-cyan-500/20 text-cyan-300 font-bold border border-cyan-500/30">
                TomTom Nav SDK for Android
              </span>
              <span className="text-[10px] font-mono text-slate-400 hidden sm:inline">
                Key: Dx27rvcSChcZITfTrb4v44abVjQX4RNR
              </span>
            </div>
          </div>

          {/* Android In-Cab Tablet Frame */}
          <div className="rounded-3xl bg-slate-900 border-2 border-slate-800 overflow-hidden shadow-2xl flex flex-col">
            {/* Top Turn-by-Turn Instruction Banner */}
            <div className="p-4 bg-gradient-to-r from-cyan-600 via-blue-600 to-indigo-700 text-white flex items-center justify-between shadow-md">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-2xl bg-black/30 backdrop-blur-md flex items-center justify-center font-black text-2xl border border-white/20">
                  ↱
                </div>
                <div>
                  <div className="text-sm sm:text-base font-black leading-snug">
                    {navSimCurrentInstruction}
                  </div>
                  <div className="text-xs text-cyan-100 font-mono">
                    Approved HGV Corridor • M1 J20 to {selectedSite.title}
                  </div>
                </div>
              </div>
              <div className="text-right">
                <div className="text-2xl font-black font-mono">{navSimDistance} mi</div>
                <div className="text-[10px] text-cyan-200 uppercase font-mono">Distance to Gate</div>
              </div>
            </div>

            {/* Dynamic Horizon Hazard Warning Card (if triggered) */}
            {navSimHorizonAlert && (
              <div className="p-3 bg-amber-500 text-slate-950 font-bold text-xs flex items-center justify-between animate-in slide-in-from-top-3">
                <div className="flex items-center gap-2">
                  <Volume2 className="w-5 h-5 animate-pulse" />
                  <span>{navSimHorizonAlert}</span>
                </div>
                <span className="px-2 py-0.5 rounded bg-black text-amber-400 text-[10px] font-mono font-bold">
                  HORIZON ADAS
                </span>
              </div>
            )}

            {/* Simulated Map Viewport */}
            <div className="relative aspect-video w-full bg-slate-950 overflow-hidden flex flex-col justify-between p-4">
              <img
                src="/tips/tip3_laser_guidelines.jpg"
                alt="Navigation Map Route"
                className="absolute inset-0 w-full h-full object-cover opacity-30 pointer-events-none"
              />

              {/* Top Map Overlays */}
              <div className="relative z-10 flex items-center justify-between pointer-events-none">
                <div className="p-2.5 rounded-2xl bg-slate-900/90 border border-slate-700 backdrop-blur-md space-y-0.5 text-xs font-mono">
                  <div className="text-[10px] text-slate-400">VEHICLE PROFILE</div>
                  <div className="font-bold text-cyan-300">4.45m H • 41.9t GCW • 16.5m L</div>
                  <div className="text-[10px] text-emerald-400">Low-Bridges: Detoured Clean</div>
                </div>

                <div className="p-2.5 rounded-2xl bg-slate-900/90 border border-slate-700 backdrop-blur-md space-y-0.5 text-right font-mono">
                  <div className="text-[10px] text-slate-400">YARD SPEED LIMIT</div>
                  <div className={`text-xl font-black ${navSimSpeed > 10 && navSimDistance <= 0.3 ? 'text-rose-400 animate-pulse' : 'text-white'}`}>
                    {navSimSpeed} <span className="text-xs">MPH</span>
                  </div>
                </div>
              </div>

              {/* Bottom Simulation Controls & Progress */}
              <div className="relative z-10 flex flex-col sm:flex-row items-center justify-between gap-3 p-3 rounded-2xl bg-slate-900/90 border border-slate-800 backdrop-blur-md">
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setIsNavSimActive(!isNavSimActive)}
                    className="px-4 py-2 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs flex items-center gap-1.5 cursor-pointer shadow"
                  >
                    {isNavSimActive ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4 fill-current" />}
                    <span>{isNavSimActive ? 'Pause Approach' : 'Start Approach Simulation'}</span>
                  </button>
                  <button
                    onClick={() => {
                      setNavSimDistance(1.4);
                      setNavSimSpeed(48);
                      setIsNavSimActive(true);
                      setIsGateInductionAutoTriggered(false);
                      setNavSimHorizonAlert(null);
                      setNavSimCurrentInstruction('In 400 yards, take 2nd exit at Magna Park roundabout into Apex Parkway');
                    }}
                    className="px-3 py-2 rounded-xl bg-slate-800 text-slate-300 text-xs font-bold cursor-pointer"
                  >
                    Reset Run
                  </button>
                </div>

                <div className="flex items-center gap-2 text-xs font-mono text-slate-300">
                  <span>ETA: <strong>{navSimEta} mins</strong></span>
                  <span>•</span>
                  <span>Destination: <strong>Gate 2 Commercial</strong></span>
                </div>
              </div>
            </div>

            {/* Arrival Gate Induction Auto-Popup */}
            {isGateInductionAutoTriggered && (
              <div className="p-4 bg-emerald-950 border-t border-emerald-500/50 flex flex-col sm:flex-row items-center justify-between gap-3 animate-in slide-in-from-bottom-5">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-emerald-500 text-slate-950 flex items-center justify-center font-bold">
                    <QrCode className="w-6 h-6" />
                  </div>
                  <div>
                    <h5 className="text-sm font-black text-white">Geofenced Gate Induction Auto-Triggered</h5>
                    <p className="text-xs text-emerald-300">
                      Security Passcode: <strong className="font-mono text-white text-sm">{selectedSite.businessSection.gateSecurityCode}</strong> • Show QR code to gatekeeper.
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => setView('SITE_DETAIL')}
                  className="px-4 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs cursor-pointer"
                >
                  View Digital Gate Pass
                </button>
              </div>
            )}
          </div>
        </main>
      )}

      {/* ========================================================================= */}
      {/* ========================================================================= */}
      {/* 5. SITE DETAIL / DIRECTORY VIEW                                           */}
      {/* ========================================================================= */}
      {view === 'SITE_DETAIL' && (
        <main className="flex-1 flex flex-col max-w-5xl mx-auto w-full p-4 sm:p-6 space-y-6">
          {/* Top Filter and Location Switcher Hub */}
          <div className="space-y-3 border-b border-slate-800 pb-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <button
                onClick={() => setView('ACTION_MENU')}
                className="flex items-center gap-1.5 text-xs font-bold text-slate-400 hover:text-white transition-colors cursor-pointer w-fit"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>Back to Action Hub</span>
              </button>

              {/* Category Filter Tabs */}
              <div className="flex flex-wrap items-center gap-1.5 p-1 rounded-xl bg-slate-900 border border-slate-800">
                <button
                  type="button"
                  onClick={() => setSiteCategoryFilter('ALL')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                    siteCategoryFilter === 'ALL'
                      ? 'bg-cyan-500 text-slate-950 font-black shadow-md shadow-cyan-500/20'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  All ({sites.length})
                </button>
                <button
                  type="button"
                  onClick={() => setSiteCategoryFilter('DEPOT')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                    siteCategoryFilter === 'DEPOT'
                      ? 'bg-cyan-500 text-slate-950 font-black shadow-md shadow-cyan-500/20'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  <Building2 className="w-3.5 h-3.5" />
                  <span>Depots &amp; DCs ({sites.filter((s) => s.siteType === 'DEPOT' || s.siteType === 'DISTRIBUTION_CENTRE' || !s.siteType).length})</span>
                </button>
                <button
                  type="button"
                  onClick={() => setSiteCategoryFilter('MOTORWAY_SERVICES')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                    siteCategoryFilter === 'MOTORWAY_SERVICES'
                      ? 'bg-emerald-500 text-slate-950 font-black shadow-md shadow-emerald-500/20'
                      : 'text-emerald-400 hover:text-emerald-300'
                  }`}
                >
                  <Coffee className="w-3.5 h-3.5" />
                  <span>Motorway Services &amp; Truckstops ({sites.filter((s) => s.siteType === 'MOTORWAY_SERVICES' || s.siteType === 'TRUCKSTOP').length})</span>
                </button>
              </div>
            </div>

            {/* Search & Location Select */}
            <div className="flex flex-col sm:flex-row sm:items-center gap-3">
              <div className="relative flex-1">
                <Search className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={siteSearchQuery}
                  onChange={(e) => setSiteSearchQuery(e.target.value)}
                  placeholder="Search by motorway (e.g. M1, M6, A14) or location name..."
                  className="w-full pl-9 pr-3 py-2 rounded-xl bg-slate-900 border border-slate-800 text-white text-xs placeholder:text-slate-500 focus:outline-none focus:border-cyan-500"
                />
              </div>

              <div className="flex items-center gap-2 shrink-0">
                <span className="text-[11px] text-slate-400 font-bold hidden md:inline">Selected:</span>
                <select
                  value={selectedSiteId}
                  onChange={(e) => setSelectedSiteId(e.target.value)}
                  className="px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-white font-mono text-xs w-full sm:w-auto"
                >
                  {filteredSites.map((s) => (
                    <option key={s.id} value={s.id}>
                      {s.motorwayServicesData ? `☕ ${s.title}` : `🏭 ${s.title}`}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Quick Horizontal Browsing Bar with Live Capacity Badges */}
            <div className="flex items-center gap-2 overflow-x-auto pb-1 pt-1 no-scrollbar">
              {filteredSites.map((s) => {
                const isSelected = s.id === selectedSite.id;
                const msa = s.motorwayServicesData;
                return (
                  <button
                    key={s.id}
                    onClick={() => setSelectedSiteId(s.id)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold shrink-0 transition-all cursor-pointer flex items-center gap-2 border ${
                      isSelected
                        ? msa
                          ? 'bg-emerald-950/80 border-emerald-500 text-white shadow-md shadow-emerald-500/10'
                          : 'bg-cyan-950/80 border-cyan-500 text-white shadow-md shadow-cyan-500/10'
                        : 'bg-slate-900/90 border-slate-800 text-slate-400 hover:text-white hover:border-slate-700'
                    }`}
                  >
                    <span>{msa ? '☕' : '🏭'}</span>
                    <span className="truncate max-w-[150px]">{s.title.split('(')[0].trim()}</span>
                    {msa && (
                      <span
                        className={`text-[9px] font-mono px-1.5 py-0.2 rounded-full font-bold uppercase ${
                          msa.currentOccupancyStatus === 'SPACES_AVAILABLE'
                            ? 'bg-emerald-500/20 text-emerald-300'
                            : msa.currentOccupancyStatus === 'BUSY_FILLING_FAST'
                            ? 'bg-amber-500/20 text-amber-300'
                            : 'bg-red-500/20 text-red-300'
                        }`}
                      >
                        {msa.currentOccupancyStatus === 'SPACES_AVAILABLE'
                          ? `🟢 ${msa.estimatedAvailableBays} Free`
                          : msa.currentOccupancyStatus === 'BUSY_FILLING_FAST'
                          ? `🟡 Tight`
                          : `🔴 Full`}
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Conditional Rendering: Motorway Service Detail vs Commercial Depot Detail */}
          {selectedSite.motorwayServicesData ? (
            <MotorwayServiceDetail
              site={selectedSite}
              onUpdateCapacity={handleUpdateCapacity}
              onUpdateFacility={handleUpdateFacility}
              onAddReview={handleAddReview}
              onBack={() => setView('ACTION_MENU')}
              currentDriverName={driverLicenceProfile?.fullName || 'Dave Higgins (C+E)'}
              currentVehicleReg="GN21 JKM"
            />
          ) : (
            <div className="space-y-6">
              {/* Site Overview Banner */}
              <div className="p-5 rounded-3xl bg-slate-900 border border-slate-800 space-y-3">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <span className="text-[10px] font-mono text-cyan-400 uppercase tracking-wider">{selectedSite.depotZone}</span>
                <h3 className="text-2xl font-black text-white">{selectedSite.title}</h3>
                <p className="text-xs text-slate-400">{selectedSite.address}</p>
              </div>
              <div className="flex items-center gap-2">
                <span className="px-3 py-1.5 rounded-xl bg-cyan-500/20 text-cyan-300 font-mono text-xs font-bold border border-cyan-500/40">
                  Risk Level: {selectedSite.overallRiskLevel} ({selectedSite.overallScore}/25)
                </span>
              </div>
            </div>

            {/* Quick Specs */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2 border-t border-slate-800">
              <div className="p-3 rounded-xl bg-slate-950 border border-slate-800">
                <span className="text-[10px] font-mono text-slate-400 uppercase">Max Height</span>
                <div className="text-sm font-bold text-white">
                  {formatHeightBoth(selectedSite.businessSection.vehicleConstraints.maxHeightMeters)}
                </div>
              </div>
              <div className="p-3 rounded-xl bg-slate-950 border border-slate-800">
                <span className="text-[10px] font-mono text-slate-400 uppercase">Max Weight</span>
                <div className="text-sm font-bold text-emerald-400">{selectedSite.businessSection.vehicleConstraints.maxWeightTonnes}t</div>
              </div>
              <div className="p-3 rounded-xl bg-slate-950 border border-slate-800">
                <span className="text-[10px] font-mono text-slate-400 uppercase">Gate Code</span>
                <div className="text-sm font-mono font-bold text-cyan-400">{selectedSite.businessSection.gateSecurityCode}</div>
              </div>
              <div className="p-3 rounded-xl bg-slate-950 border border-slate-800">
                <span className="text-[10px] font-mono text-slate-400 uppercase">CB Radio</span>
                <div className="text-sm font-mono font-bold text-amber-400">{selectedSite.businessSection.siteManager.radioChannel || 'CH 19'}</div>
              </div>
            </div>

            {/* Action Strip */}
            <div className="flex flex-wrap items-center gap-2 pt-2">
              <button
                onClick={() => {
                  setView('ANDROID_NAV_SDK_VIEW');
                  setIsNavSimActive(true);
                }}
                className="px-4 py-2.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs flex items-center gap-1.5 cursor-pointer shadow"
              >
                <Navigation className="w-4 h-4 fill-slate-950" />
                <span>Simulate In-Cab Android Nav</span>
              </button>
              <button
                onClick={() => {
                  navigator.clipboard.writeText(
                    `HGV DESTINATION: ${selectedSite.title}\nAddress: ${selectedSite.address}\nGate Code: ${selectedSite.businessSection.gateSecurityCode}\nHeight Limit: ${formatHeightBoth(selectedSite.businessSection.vehicleConstraints.maxHeightMeters)}`
                  );
                  showToast('✓ Site details copied to clipboard!');
                }}
                className="px-3.5 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs flex items-center gap-1.5 cursor-pointer"
              >
                <Copy className="w-4 h-4" />
                <span>Copy Summary</span>
              </button>
            </div>
          </div>

          {/* Hazard Matrix Table */}
          <div className="p-5 rounded-3xl bg-slate-900 border border-slate-800 space-y-3">
            <h4 className="text-sm font-black text-white flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 text-amber-400" />
              <span>Assessed High-Risk Zones &amp; Hazard Matrix ({selectedSite.businessSection.baselineHazards.length})</span>
            </h4>
            <div className="space-y-2">
              {selectedSite.businessSection.baselineHazards.map((haz) => (
                <div key={haz.id} className="p-3 rounded-xl bg-slate-950 border border-slate-800 space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-white">{haz.hazard}</span>
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-amber-500/20 text-amber-300 font-bold border border-amber-500/30">
                      Score: {haz.riskRating} ({haz.riskLevel})
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-400">
                    Controls: {haz.controlMeasures.join(' • ')}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </main>
  )}

      {/* Google Business Profile OAuth & Depot Verification Modal */}
      <GoogleBusinessProfileOAuthModal
        isOpen={isGbpModalOpen}
        onClose={() => setIsGbpModalOpen(false)}
        onVerifiedDepotClaimed={handleVerifiedDepotClaimed}
        initialSearchQuery={wTitle || 'Magna Park'}
      />
    </div>
  );
};

export default SiteRiskApp;
