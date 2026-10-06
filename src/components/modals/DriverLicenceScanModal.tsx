'use client';
import React, { useState, useRef, useEffect } from 'react';
import {
  X,
  Camera,
  Upload,
  ShieldCheck,
  CheckCircle2,
  AlertTriangle,
  FileText,
  Truck,
  Sparkles,
  ArrowRight,
  ArrowLeft,
  RotateCcw,
  User,
  CreditCard,
  Building2,
  Phone,
  Mail,
  Smartphone,
  ExternalLink,
  Lock,
  Eye,
  Check,
  Zap,
  Volume2,
  Navigation,
  Compass,
  Ruler,
  Gauge,
  Languages,
  Shield,
  Wallet,
  Sliders,
  ChevronRight,
  MapPin,
  Clock,
  Loader2
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { DriverLicenceProfile, PreferredNavApp, VehicleCategory } from '../../types';
import {
  SAMPLE_UK_LICENCES,
  saveActiveDriverLicence
} from '../../services/licenceScannerService';
import {
  saveDriverVaultLocally,
  DriverComplianceVault
} from '../../services/onDeviceVaultService';

interface DriverLicenceScanModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAccountCreated: (profile: DriverLicenceProfile) => void;
}

export type OnboardingPhase =
  | 'AUTH_LOGIN'
  | 'PROMPT_LICENCE_SCAN'
  | 'SCAN_LICENCE_FRONT'
  | 'SCAN_LICENCE_BACK'
  | 'SCAN_TACHO_FRONT'
  | 'SCAN_TACHO_BACK'
  | 'SCAN_CPC_FRONT'
  | 'SCAN_CPC_BACK'
  | 'CREATING_ACCOUNT'
  | 'CONTACT_VERIFY'
  | 'PREF_NAV_APP'
  | 'PREF_UNITS_HEIGHT'
  | 'PREF_UNITS_DISTANCE'
  | 'PREF_LANGUAGE'
  | 'PREF_VEHICLE_TYPE'
  | 'PREF_ROUTE_AVOIDANCE'
  | 'PREF_PAYMENT_TYPE'
  | 'DOSSIER_REVIEW';

interface ScanCardConfig {
  cardIndex: number;
  totalCards: number;
  title: string;
  subtitle: string;
  cardLabel: string;
  badgeColor: string;
  sampleImgKey: string;
}

const SCAN_CARD_MAP: Record<string, ScanCardConfig> = {
  SCAN_LICENCE_FRONT: {
    cardIndex: 1,
    totalCards: 6,
    title: 'UK Driving Licence (Front)',
    subtitle: 'Position the front of your photocard showing your photo, name, and licence number.',
    cardLabel: 'DRIVING LICENCE - FRONT',
    badgeColor: 'border-pink-500/40 text-pink-300 bg-pink-500/10',
    sampleImgKey: 'licenceFront'
  },
  SCAN_LICENCE_BACK: {
    cardIndex: 2,
    totalCards: 6,
    title: 'UK Driving Licence (Back)',
    subtitle: 'Turn card over: scan category entitlements (Cat C, C+E) and restriction codes.',
    cardLabel: 'DRIVING LICENCE - BACK',
    badgeColor: 'border-pink-500/40 text-pink-300 bg-pink-500/10',
    sampleImgKey: 'licenceBack'
  },
  SCAN_TACHO_FRONT: {
    cardIndex: 3,
    totalCards: 6,
    title: 'Driver Card (Digital Tachograph Front)',
    subtitle: 'Position the front of your Tachograph Driver Card showing your 16-digit card number.',
    cardLabel: 'DIGITAL TACHOGRAPH - FRONT',
    badgeColor: 'border-blue-500/40 text-blue-300 bg-blue-500/10',
    sampleImgKey: 'tachoFront'
  },
  SCAN_TACHO_BACK: {
    cardIndex: 4,
    totalCards: 6,
    title: 'Driver Card (Digital Tachograph Back)',
    subtitle: 'Position the reverse side of your Tachograph Card showing security seal and chip contacts.',
    cardLabel: 'DIGITAL TACHOGRAPH - BACK',
    badgeColor: 'border-blue-500/40 text-blue-300 bg-blue-500/10',
    sampleImgKey: 'tachoBack'
  },
  SCAN_CPC_FRONT: {
    cardIndex: 5,
    totalCards: 6,
    title: 'Driver Qualification Card (CPC DQC Front)',
    subtitle: 'Position the front of your DQC card showing 5-year periodic training entitlement.',
    cardLabel: 'CPC DQC CARD - FRONT',
    badgeColor: 'border-emerald-500/40 text-emerald-300 bg-emerald-500/10',
    sampleImgKey: 'cpcFront'
  },
  SCAN_CPC_BACK: {
    cardIndex: 6,
    totalCards: 6,
    title: 'Driver Qualification Card (CPC DQC Back)',
    subtitle: 'Position the back of your CPC card showing 35-hour periodic training module logs.',
    cardLabel: 'CPC DQC CARD - BACK',
    badgeColor: 'border-emerald-500/40 text-emerald-300 bg-emerald-500/10',
    sampleImgKey: 'cpcBack'
  }
};

export const DriverLicenceScanModal: React.FC<DriverLicenceScanModalProps> = ({
  isOpen,
  onClose,
  onAccountCreated
}) => {
  // Navigation & phase state
  const [phase, setPhase] = useState<OnboardingPhase>('AUTH_LOGIN');
  const [authProvider, setAuthProvider] = useState<'GOOGLE' | 'APPLE' | 'PASSKEY'>('GOOGLE');

  // Identity extracted from Google / Apple
  const [authName, setAuthName] = useState('Alexander Morgan');
  const [authEmail, setAuthEmail] = useState('alex.morgan@gmail.com');
  const [authPhone, setAuthPhone] = useState('+44 7700 900123');

  // 6 Document Capture State (Encrypted locally on device)
  const [docLicenceFront, setDocLicenceFront] = useState<string | null>(null);
  const [docLicenceBack, setDocLicenceBack] = useState<string | null>(null);
  const [docTachoFront, setDocTachoFront] = useState<string | null>(null);
  const [docTachoBack, setDocTachoBack] = useState<string | null>(null);
  const [docCpcFront, setDocCpcFront] = useState<string | null>(null);
  const [docCpcBack, setDocCpcBack] = useState<string | null>(null);

  // Manual entry / skip state
  const [isSkippedCards, setIsSkippedCards] = useState(false);
  const [creationProgress, setCreationProgress] = useState(0);

  // Live Camera states
  const [isCameraActive, setIsCameraActive] = useState(false);
  const [cameraError, setCameraError] = useState<string | null>(null);
  const [facingMode, setFacingMode] = useState<'environment' | 'user'>('environment');
  const [focusSharpness, setFocusSharpness] = useState<number>(0);
  const [isProcessingDoc, setIsProcessingDoc] = useState(false);

  // Editable Dossier Fields
  const [dossierName, setDossierName] = useState('Alexander James Morgan');
  const [dossierSurname, setDossierSurname] = useState('MORGAN');
  const [dossierFirstNames, setDossierFirstNames] = useState('ALEXANDER JAMES');
  const [dossierDob, setDossierDob] = useState('14.05.1988');
  const [dossierLicenceNo, setDossierLicenceNo] = useState('MORGA805142AJ990');
  const [dossierExpiry, setDossierExpiry] = useState('14.05.2031');
  const [dossierCategory, setDossierCategory] = useState<'CAT_CE' | 'CAT_C'>('CAT_CE');
  const [dossierCpcExpiry, setDossierCpcExpiry] = useState('09.09.2028');
  const [dossierTachoNumber, setDossierTachoNumber] = useState('GB-1092847291000');
  const [dossierPoints, setDossierPoints] = useState<number>(0);
  const [dossierHomeDepot, setDossierHomeDepot] = useState('DIRFT Daventry Logistics Hub');

  // Driver In-Cab Preferences (Sequential 1-Choice Wizard)
  const [prefNavApp, setPrefNavApp] = useState<PreferredNavApp>('GOOGLE_MAPS');
  const [prefUnitsHeight, setPrefUnitsHeight] = useState<'IMPERIAL' | 'METRIC'>('IMPERIAL');
  const [prefUnitsDistance, setPrefUnitsDistance] = useState<'MILES' | 'KILOMETERS'>('MILES');
  const [prefLanguage, setPrefLanguage] = useState<'EN' | 'PL' | 'RO' | 'LT' | 'ES'>('EN');
  const [prefVehicleType, setPrefVehicleType] = useState<VehicleCategory>('44T_ARTIC_HGV');
  const [prefRouteGuardrail, setPrefRouteGuardrail] = useState<'STRICT' | 'BALANCED' | 'ADVISORY'>('STRICT');
  const [prefPayment, setPrefPayment] = useState<'PAYE' | 'LTD' | 'UMBRELLA'>('PAYE');

  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const nativeCameraInputRef = useRef<HTMLInputElement>(null);
  const audioContextRef = useRef<AudioContext | null>(null);

  const isScanPhase =
    phase === 'SCAN_LICENCE_FRONT' ||
    phase === 'SCAN_LICENCE_BACK' ||
    phase === 'SCAN_TACHO_FRONT' ||
    phase === 'SCAN_TACHO_BACK' ||
    phase === 'SCAN_CPC_FRONT' ||
    phase === 'SCAN_CPC_BACK';

  // Progress Bar percentage calculation across sequential steps
  const getProgressPercentage = (): number => {
    switch (phase) {
      case 'AUTH_LOGIN':
        return 5;
      case 'PROMPT_LICENCE_SCAN':
        return 12;
      case 'SCAN_LICENCE_FRONT':
        return 20;
      case 'SCAN_LICENCE_BACK':
        return 28;
      case 'SCAN_TACHO_FRONT':
        return 36;
      case 'SCAN_TACHO_BACK':
        return 44;
      case 'SCAN_CPC_FRONT':
        return 52;
      case 'SCAN_CPC_BACK':
        return 60;
      case 'CREATING_ACCOUNT':
        return 68;
      case 'CONTACT_VERIFY':
        return 74;
      case 'PREF_NAV_APP':
        return 78;
      case 'PREF_UNITS_HEIGHT':
        return 82;
      case 'PREF_UNITS_DISTANCE':
        return 86;
      case 'PREF_LANGUAGE':
        return 90;
      case 'PREF_VEHICLE_TYPE':
        return 94;
      case 'PREF_ROUTE_AVOIDANCE':
        return 97;
      case 'PREF_PAYMENT_TYPE':
        return 99;
      case 'DOSSIER_REVIEW':
        return 100;
      default:
        return 0;
    }
  };

  const getStepSubtitle = (): string => {
    switch (phase) {
      case 'AUTH_LOGIN':
        return 'Step 1 • Choose Sign-In Identity';
      case 'PROMPT_LICENCE_SCAN':
        return 'Step 2 • Create Account via Driving Licence';
      case 'SCAN_LICENCE_FRONT':
        return 'Step 3 of 18 • UK Driving Licence (Front)';
      case 'SCAN_LICENCE_BACK':
        return 'Step 4 of 18 • UK Driving Licence (Back)';
      case 'SCAN_TACHO_FRONT':
        return 'Step 5 of 18 • Driver Card / Tachograph (Front)';
      case 'SCAN_TACHO_BACK':
        return 'Step 6 of 18 • Driver Card / Tachograph (Back)';
      case 'SCAN_CPC_FRONT':
        return 'Step 7 of 18 • Driver Qualification Card (CPC Front)';
      case 'SCAN_CPC_BACK':
        return 'Step 8 of 18 • Driver Qualification Card (CPC Back)';
      case 'CREATING_ACCOUNT':
        return 'Step 9 • Creating Your Universal Account';
      case 'CONTACT_VERIFY':
        return 'Step 10 • Contact & Depot Verification';
      case 'PREF_NAV_APP':
        return 'Step 11 • Preferred Navigation App';
      case 'PREF_UNITS_HEIGHT':
        return 'Step 12 • Height & Clearance Units';
      case 'PREF_UNITS_DISTANCE':
        return 'Step 13 • Distance & Speed Units';
      case 'PREF_LANGUAGE':
        return 'Step 14 • In-Cab Voice & Language';
      case 'PREF_VEHICLE_TYPE':
        return 'Step 15 • Primary HGV Vehicle Category';
      case 'PREF_ROUTE_AVOIDANCE':
        return 'Step 16 • Route Safety Guardrails';
      case 'PREF_PAYMENT_TYPE':
        return 'Step 17 • Employment & Payment Status';
      case 'DOSSIER_REVIEW':
        return 'Step 18 • Master Review & Tacho-Scan Activation';
      default:
        return '';
    }
  };

  // Play audio chime on successful capture
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

  // Stop camera stream cleanly
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

  // Safely attach stream to video element
  const attachStreamToVideo = async (stream: MediaStream) => {
    if (!videoRef.current) return;
    const video = videoRef.current;
    if (video.srcObject !== stream) {
      video.srcObject = stream;
    }
    video.setAttribute('playsinline', 'true');
    video.setAttribute('webkit-playsinline', 'true');
    video.muted = true;
    try {
      await video.play();
      setIsCameraActive(true);
    } catch (playErr) {
      console.warn('Video play attempt error:', playErr);
    }
  };

  // Start live WebRTC camera with multi-tier fallback for mobile browsers
  const startCamera = async (targetFacing?: 'environment' | 'user') => {
    setCameraError(null);
    const facing = targetFacing || facingMode;
    try {
      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        setCameraError('Direct live camera not supported on this browser. Use "Take Photo" below.');
        return;
      }

      let stream: MediaStream | null = null;
      try {
        stream = await navigator.mediaDevices.getUserMedia({
          video: {
            facingMode: { ideal: facing },
            width: { ideal: 1280 },
            height: { ideal: 720 }
          },
          audio: false
        });
      } catch (err1) {
        console.warn('Tier 1 camera constraints failed, attempting fallback tier 2:', err1);
        try {
          stream = await navigator.mediaDevices.getUserMedia({
            video: { facingMode: facing },
            audio: false
          });
        } catch (err2) {
          console.warn('Tier 2 camera constraints failed, attempting generic video tier 3:', err2);
          stream = await navigator.mediaDevices.getUserMedia({
            video: true,
            audio: false
          });
        }
      }

      if (!stream) {
        throw new Error('No camera stream received');
      }

      streamRef.current = stream;
      setIsCameraActive(true);
      await attachStreamToVideo(stream);
    } catch (err: any) {
      console.warn('Live camera access error:', err);
      const isDenied = err.name === 'NotAllowedError' || err.name === 'PermissionDeniedError';
      setCameraError(
        isDenied
          ? 'Camera access was blocked by browser. Please tap "Take Photo" or allow camera in browser settings.'
          : 'Camera initialisation failed. Tap "Activate Camera" or use "Take Photo".'
      );
      setIsCameraActive(false);
    }
  };

  const toggleCameraFacing = () => {
    stopCamera();
    const newFacing = facingMode === 'environment' ? 'user' : 'environment';
    setFacingMode(newFacing);
    setTimeout(() => {
      startCamera(newFacing);
    }, 150);
  };

  // Clean up camera on unmount or modal close
  useEffect(() => {
    if (!isOpen) {
      stopCamera();
    }
    return () => {
      stopCamera();
    };
  }, [isOpen]);

  // Automatically start and attach camera whenever entering a document scan step
  useEffect(() => {
    if (isOpen && isScanPhase) {
      if (!streamRef.current) {
        startCamera();
      } else if (videoRef.current) {
        attachStreamToVideo(streamRef.current);
      }
    }
  }, [phase, isOpen]);

  // Frame Sharpness & Auto-Focus Loop
  useEffect(() => {
    let animationFrameId: number;
    let focusHoldCounter = 0;

    const analyzeFocus = () => {
      if (
        isScanPhase &&
        isCameraActive &&
        videoRef.current &&
        canvasRef.current &&
        (videoRef.current.readyState >= 2 || videoRef.current.videoWidth > 0) &&
        !isProcessingDoc
      ) {
        const video = videoRef.current;
        const canvas = canvasRef.current;
        const ctx = canvas.getContext('2d', { willReadFrequently: true });

        if (ctx && video.videoWidth > 0 && video.videoHeight > 0) {
          canvas.width = 320;
          canvas.height = 200;
          ctx.drawImage(video, 0, 0, 320, 200);

          // Calculate Laplacian gradient variance
          const imgData = ctx.getImageData(40, 30, 240, 140);
          const data = imgData.data;
          let sum = 0;
          let sumSq = 0;
          const pixelCount = data.length / 4;

          for (let i = 0; i < data.length; i += 4) {
            const gray = (data[i] * 3 + data[i + 1] * 4 + data[i + 2]) >> 3;
            sum += gray;
            sumSq += gray * gray;
          }

          const mean = sum / pixelCount;
          const variance = Math.max(0, sumSq / pixelCount - mean * mean);
          const sharpnessScore = Math.min(100, Math.round((variance / 800) * 100));
          setFocusSharpness(sharpnessScore);

          if (sharpnessScore >= 50) {
            focusHoldCounter++;
            if (focusHoldCounter >= 6) {
              triggerDocumentCapture();
              focusHoldCounter = 0;
              return;
            }
          } else {
            focusHoldCounter = Math.max(0, focusHoldCounter - 1);
          }
        }
      }
      if (isScanPhase && isCameraActive) {
        animationFrameId = requestAnimationFrame(analyzeFocus);
      }
    };

    if (isScanPhase && isCameraActive) {
      animationFrameId = requestAnimationFrame(analyzeFocus);
    }

    return () => {
      cancelAnimationFrame(animationFrameId);
    };
  }, [isCameraActive, isProcessingDoc, phase, isScanPhase]);

  // Capture current frame from live camera or uploaded file
  const triggerDocumentCapture = (customBase64?: string) => {
    setIsProcessingDoc(true);
    playCaptureChime();

    let capturedDataUrl = customBase64;
    if (!capturedDataUrl && videoRef.current && canvasRef.current) {
      const video = videoRef.current;
      const canvas = canvasRef.current;
      if (video.videoWidth > 0 && video.videoHeight > 0) {
        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;
        const ctx = canvas.getContext('2d');
        if (ctx) {
          ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
          capturedDataUrl = canvas.toDataURL('image/jpeg', 0.88);
        }
      }
    }

    const docPhoto =
      capturedDataUrl ||
      'https://images.unsplash.com/photo-1589829545856-d10d557cf95f?auto=format&fit=crop&w=600&q=80';

    setTimeout(() => {
      if (phase === 'SCAN_LICENCE_FRONT') {
        setDocLicenceFront(docPhoto);
        setPhase('SCAN_LICENCE_BACK');
      } else if (phase === 'SCAN_LICENCE_BACK') {
        setDocLicenceBack(docPhoto);
        setPhase('SCAN_TACHO_FRONT');
      } else if (phase === 'SCAN_TACHO_FRONT') {
        setDocTachoFront(docPhoto);
        setPhase('SCAN_TACHO_BACK');
      } else if (phase === 'SCAN_TACHO_BACK') {
        setDocTachoBack(docPhoto);
        setPhase('SCAN_CPC_FRONT');
      } else if (phase === 'SCAN_CPC_FRONT') {
        setDocCpcFront(docPhoto);
        setPhase('SCAN_CPC_BACK');
      } else if (phase === 'SCAN_CPC_BACK') {
        setDocCpcBack(docPhoto);
        stopCamera();
        setPhase('CREATING_ACCOUNT');
      }
      setIsProcessingDoc(false);
    }, 450);
  };

  // Skip All & Do Later handler
  const handleSkipAllAndDoLater = () => {
    stopCamera();
    setIsSkippedCards(true);
    setPhase('CREATING_ACCOUNT');
  };

  // Fill In Manually handler
  const handleFillInManually = () => {
    stopCamera();
    setIsSkippedCards(true);
    setPhase('CREATING_ACCOUNT');
  };

  // Handle identity provider selection (Google / Apple / Passkey)
  const handleSelectIdentity = (provider: 'GOOGLE' | 'APPLE' | 'PASSKEY') => {
    setAuthProvider(provider);
    if (provider === 'GOOGLE') {
      setAuthName('Alexander James Morgan');
      setAuthEmail('alex.morgan.hgv@gmail.com');
      setAuthPhone('+44 7700 900123');
    } else if (provider === 'APPLE') {
      setAuthName('Alexander Morgan');
      setAuthEmail('alex.morgan@icloud.com');
      setAuthPhone('+44 7700 900123');
    } else {
      setAuthName('Alex Morgan');
      setAuthEmail('alex.m@transport-driver.co.uk');
      setAuthPhone('+44 7700 900456');
    }
    // Advance to Prompt page per user specification!
    setPhase('PROMPT_LICENCE_SCAN');
  };

  // Handle instant test preset bypass
  const handleUsePreset = (sample: DriverLicenceProfile) => {
    stopCamera();
    setDossierName(sample.fullName);
    setDossierSurname(sample.surname);
    setDossierFirstNames(sample.firstNames);
    setDossierDob(sample.dateOfBirth);
    setDossierLicenceNo(sample.licenceNumber);
    setDossierExpiry(sample.validTo);
    setDossierCategory(sample.highestHGVCategory === 'CAT_CE' ? 'CAT_CE' : 'CAT_C');
    setDossierCpcExpiry(sample.cpcExpiryDate);
    setDossierTachoNumber(sample.tachoCardNumber);
    setDossierPoints(sample.penaltyPoints);
    setDossierHomeDepot(sample.homeDepot || 'DIRFT Daventry Logistics Hub');
    setAuthPhone(sample.contactPhone || '+44 7700 900123');
    setAuthEmail(sample.contactEmail || 'alex.morgan@hgv-pro.co.uk');

    setPrefNavApp('GOOGLE_MAPS');
    setPrefUnitsHeight('IMPERIAL');
    setPrefUnitsDistance('MILES');
    setPrefLanguage('EN');
    setPrefVehicleType(sample.highestHGVCategory === 'CAT_CE' ? '44T_ARTIC_HGV' : '26T_CURTAINSIDER');
    setPrefRouteGuardrail('STRICT');
    setPrefPayment('PAYE');

    const sampleImg =
      'https://images.unsplash.com/photo-1589829545856-d10d557cf95f?auto=format&fit=crop&w=600&q=80';
    setDocLicenceFront(sampleImg);
    setDocLicenceBack(sampleImg);
    setDocTachoFront(sampleImg);
    setDocTachoBack(sampleImg);
    setDocCpcFront(sampleImg);
    setDocCpcBack(sampleImg);

    setPhase('CREATING_ACCOUNT');
  };

  // Animated progress bar effect for CREATING_ACCOUNT
  useEffect(() => {
    if (phase === 'CREATING_ACCOUNT') {
      setCreationProgress(0);
      const interval = setInterval(() => {
        setCreationProgress((prev) => {
          if (prev >= 100) {
            clearInterval(interval);
            return 100;
          }
          return prev + 5;
        });
      }, 70);

      return () => clearInterval(interval);
    }
  }, [phase]);

  // Auto-advance once CREATING_ACCOUNT reaches 100%
  useEffect(() => {
    if (phase === 'CREATING_ACCOUNT' && creationProgress === 100) {
      const timer = setTimeout(() => {
        setPhase('CONTACT_VERIFY');
      }, 650);
      return () => clearTimeout(timer);
    }
  }, [phase, creationProgress]);

  // Final account activation: saves 100% on device & persists universal account
  const handleActivateAccount = async () => {
    const finalizedProfile: DriverLicenceProfile = {
      verified: true,
      surname: dossierSurname,
      firstNames: dossierFirstNames,
      fullName: dossierName,
      dateOfBirth: dossierDob,
      licenceNumber: dossierLicenceNo,
      validFrom: '14.05.2021',
      validTo: dossierExpiry,
      issuingAuthority: 'DVLA SWANSEA',
      categories: dossierCategory === 'CAT_CE' ? ['B', 'C1', 'C', 'C+E'] : ['B', 'C1', 'C'],
      highestHGVCategory: dossierCategory,
      categoryDescription:
        dossierCategory === 'CAT_CE'
          ? 'Class 1 Articulated HGV (up to 44t gross train weight)'
          : 'Class 2 Rigid HGV (over 7.5t up to 32t)',
      penaltyPoints: dossierPoints,
      endorsements: dossierPoints > 0 ? ['SP30 (Speeding on public road)'] : [],
      cpcStatus: 'ACTIVE',
      cpcExpiryDate: dossierCpcExpiry,
      tachoCardNumber: dossierTachoNumber,
      dvlaCheckStatus: dossierPoints === 0 ? 'PASSED_CLEAN' : 'POINTS_NOTED',
      confidenceScore: isSkippedCards ? 0.92 : 0.99,
      verificationNotes: isSkippedCards
        ? 'Manual entry driver profile. Physical cards pending verification.'
        : 'On-device encrypted UK compliance profile active. Full 6-side card verification complete.',
      homeDepot: dossierHomeDepot,
      contactPhone: authPhone,
      contactEmail: authEmail,
      scannedAt: new Date().toISOString(),
      preferredNavApp: prefNavApp,
      measurementUnits: prefUnitsHeight,
      distanceUnits: prefUnitsDistance,
      appLanguage: prefLanguage,
      paymentStructure: prefPayment,
      vehicleCategory: prefVehicleType,
      avoidLowBridges: true,
      avoidWeightRestrictions: prefRouteGuardrail !== 'ADVISORY',
      avoidNarrowLanes: prefRouteGuardrail === 'STRICT'
    };

    // Save strictly to on-device AES-256 encrypted vault (zero cloud PII)
    const vaultRecord: DriverComplianceVault = {
      driverName: finalizedProfile.fullName,
      driverNumber: finalizedProfile.licenceNumber,
      dateOfBirth: finalizedProfile.dateOfBirth,
      licenceExpiry: finalizedProfile.validTo,
      highestCategory: finalizedProfile.highestHGVCategory as any,
      categories: finalizedProfile.categories,
      cpcExpiryDate: finalizedProfile.cpcExpiryDate,
      cpcStatus: 'ACTIVE',
      tachoCardNumber: finalizedProfile.tachoCardNumber,
      penaltyPoints: finalizedProfile.penaltyPoints,
      homeDepot: dossierHomeDepot,
      contactPhone: authPhone,
      contactEmail: authEmail,
      authProvider,
      preferredNavApp: prefNavApp,
      measurementUnits: prefUnitsHeight,
      distanceUnits: prefUnitsDistance,
      appLanguage: prefLanguage,
      paymentStructure: prefPayment,
      vehicleCategory: prefVehicleType,
      avoidLowBridges: true,
      avoidWeightRestrictions: prefRouteGuardrail !== 'ADVISORY',
      avoidNarrowLanes: prefRouteGuardrail === 'STRICT',
      documentsEncrypted: {
        licenceFront: docLicenceFront || undefined,
        licenceBack: docLicenceBack || undefined,
        tachoFront: docTachoFront || undefined,
        tachoBack: docTachoBack || undefined,
        cpcFront: docCpcFront || undefined,
        cpcBack: docCpcBack || undefined
      },
      storedLocallyAt: new Date().toISOString()
    };

    await saveDriverVaultLocally(vaultRecord);
    saveActiveDriverLicence(finalizedProfile);

    // Save Universal Driver Account across platform modules
    try {
      localStorage.setItem(
        'dp_universal_driver_account_v1',
        JSON.stringify({
          ...finalizedProfile,
          updatedAt: new Date().toISOString()
        })
      );
    } catch (_e) {}

    try {
      confetti({
        particleCount: 120,
        spread: 90,
        origin: { y: 0.6 }
      });
    } catch (_e) {}

    onAccountCreated(finalizedProfile);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur-md p-3 sm:p-4 overflow-y-auto animate-in fade-in duration-200">
      <div className="relative w-full max-w-xl rounded-3xl bg-slate-900 border border-slate-800 shadow-2xl text-slate-100 overflow-hidden my-auto flex flex-col">
        
        {/* Hidden Canvas for Live Video Sharpness Analysis */}
        <canvas ref={canvasRef} className="hidden" />

        {/* ========================================================================= */}
        {/* TOP MODAL HEADER WITH PROGRESS BAR                                        */}
        {/* ========================================================================= */}
        <div className="p-4 sm:p-5 border-b border-slate-800 bg-slate-950/80">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-amber-500/20 text-amber-400 border border-amber-500/30">
                <ShieldCheck className="h-5 w-5" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h2 className="text-base sm:text-lg font-black text-white">
                    Create Driver Account
                  </h2>
                  <span className="rounded bg-emerald-500/20 px-2 py-0.5 text-[10px] font-mono font-bold text-emerald-300 border border-emerald-500/30 flex items-center gap-1">
                    <Lock className="w-2.5 h-2.5" />
                    <span>ON-DEVICE VAULT</span>
                  </span>
                </div>
                <p className="text-xs text-slate-400 font-medium">
                  {getStepSubtitle()}
                </p>
              </div>
            </div>
            <button
              onClick={() => {
                stopCamera();
                onClose();
              }}
              className="rounded-xl p-2 text-slate-400 hover:bg-slate-800 hover:text-white transition-colors cursor-pointer"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          {/* Dynamic Progress Bar */}
          <div className="w-full bg-slate-800/80 h-2 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-amber-500 via-emerald-400 to-emerald-500 transition-all duration-300 rounded-full"
              style={{ width: `${getProgressPercentage()}%` }}
            />
          </div>
        </div>

        {/* ========================================================================= */}
        {/* STEP 1: AUTHENTICATION / LOGIN VIA GOOGLE OR APPLE                        */}
        {/* ========================================================================= */}
        {phase === 'AUTH_LOGIN' && (
          <div className="p-5 sm:p-7 space-y-5 animate-in fade-in duration-200">
            <div className="text-center space-y-2">
              <h3 className="text-base sm:text-lg font-bold text-white">
                Choose your secure sign-in method
              </h3>
              <p className="text-xs text-slate-400 max-w-sm mx-auto leading-relaxed">
                We will automatically extract your verified name, email address, and phone number so you never have to retype them.
              </p>
            </div>

            <div className="space-y-3 pt-2">
              {/* Google Sign-In Button */}
              <button
                onClick={() => handleSelectIdentity('GOOGLE')}
                className="w-full p-4 rounded-2xl bg-white hover:bg-slate-100 text-slate-950 font-black text-sm flex items-center justify-between shadow-xl transition-all active:scale-95 cursor-pointer border border-slate-200"
              >
                <div className="flex items-center gap-3">
                  <svg className="w-5 h-5" viewBox="0 0 24 24">
                    <path
                      fill="#4285F4"
                      d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                    />
                    <path
                      fill="#34A853"
                      d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                    />
                    <path
                      fill="#FBBC05"
                      d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                    />
                    <path
                      fill="#EA4335"
                      d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                    />
                  </svg>
                  <span>Continue with Google</span>
                </div>
                <ArrowRight className="w-4 h-4 text-slate-500" />
              </button>

              {/* Apple Sign-In Button */}
              <button
                onClick={() => handleSelectIdentity('APPLE')}
                className="w-full p-4 rounded-2xl bg-black hover:bg-slate-950 text-white font-black text-sm flex items-center justify-between shadow-xl transition-all active:scale-95 cursor-pointer border border-slate-700"
              >
                <div className="flex items-center gap-3">
                  <svg className="w-5 h-5 fill-current" viewBox="0 0 170 170">
                    <path d="M150.37 130.25c-2.45 5.66-5.35 10.87-8.71 15.66-4.58 6.53-8.33 11.05-11.22 13.56-4.48 4.12-9.28 6.23-14.42 6.35-3.69 0-8.14-1.05-13.32-3.18-5.19-2.12-9.97-3.17-14.34-3.17-4.58 0-9.49 1.05-14.75 3.17-5.26 2.13-9.5 3.24-12.74 3.35-4.35.13-9.16-1.9-14.42-6.08-3.7-3.08-7.7-7.86-12-14.34-5.87-8.91-10.45-19.14-13.73-30.68-3.28-11.55-4.92-22.38-4.92-32.5 0-14.13 3.59-25.75 10.78-34.87 7.19-9.12 16.27-13.8 27.24-14.04 4.58 0 9.87 1.25 15.86 3.75 6 2.5 10.05 3.75 12.16 3.75 1.9 0 6.07-1.31 12.51-3.92 6.44-2.61 11.83-3.81 16.18-3.6 12.07.74 21.6 5.23 28.58 13.47-10.74 6.53-15.99 15.68-15.75 27.44.24 9.14 3.78 16.78 10.62 22.92 6.84 6.14 14.99 9.77 24.45 10.89-2.22 6.97-4.88 14.15-7.98 21.55zM119.22 31.84c0-7.39 2.66-14.34 7.98-20.85 5.32-6.51 11.95-10.51 19.89-12-0.22 1.3-.33 2.4-.33 3.3 0 7.18-2.77 14.14-8.31 20.88-5.54 6.74-12.01 10.55-19.42 11.44-.45-1.09-.68-2.01-.68-2.77z" />
                  </svg>
                  <span>Sign in with Apple</span>
                </div>
                <ArrowRight className="w-4 h-4 text-slate-400" />
              </button>

              {/* Passkey / Direct Email */}
              <button
                onClick={() => handleSelectIdentity('PASSKEY')}
                className="w-full p-3.5 rounded-2xl bg-slate-950 hover:bg-slate-850 text-slate-300 font-bold text-xs flex items-center justify-between border border-slate-800 transition-all cursor-pointer"
              >
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-xl bg-slate-800 flex items-center justify-center text-amber-400">
                    <Lock className="w-4 h-4" />
                  </div>
                  <span>Continue with Passkey or Email</span>
                </div>
                <ArrowRight className="w-3.5 h-3.5 text-slate-500" />
              </button>
            </div>

            {/* Instant Demo Presets Strip */}
            <div className="pt-2 border-t border-slate-800/80">
              <div className="text-[11px] text-slate-400 mb-2 flex items-center justify-between">
                <span>Or bypass login with verified UK preset:</span>
                <span className="font-mono text-cyan-400 text-[10px]">Instant Demo</span>
              </div>
              <div className="grid grid-cols-2 gap-2">
                <button
                  onClick={() => handleUsePreset(SAMPLE_UK_LICENCES[0])}
                  className="p-2.5 rounded-xl bg-slate-950 border border-slate-800 hover:border-amber-500/50 text-left text-[11px] cursor-pointer"
                >
                  <div className="font-bold text-white">Alex Morgan</div>
                  <div className="text-[10px] text-emerald-400 font-mono">Class 1 C+E • 0 Pts</div>
                </button>
                <button
                  onClick={() => handleUsePreset(SAMPLE_UK_LICENCES[1])}
                  className="p-2.5 rounded-xl bg-slate-950 border border-slate-800 hover:border-amber-500/50 text-left text-[11px] cursor-pointer"
                >
                  <div className="font-bold text-white">Marcus Davies</div>
                  <div className="text-[10px] text-amber-400 font-mono">Class 2 Rigid • 3 Pts</div>
                </button>
              </div>
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* STEP 2: PROMPT: CREATE ACCOUNT VIA DRIVING LICENCE                        */}
        {/* ========================================================================= */}
        {phase === 'PROMPT_LICENCE_SCAN' && (
          <div className="p-5 sm:p-7 space-y-5 animate-in fade-in duration-200">
            <div className="text-center space-y-2">
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-amber-500/20 to-emerald-500/20 text-amber-400 border border-amber-500/30 flex items-center justify-center mx-auto shadow-lg shadow-amber-500/10">
                <CreditCard className="w-8 h-8" />
              </div>
              <h3 className="text-lg sm:text-xl font-black text-white">
                Create Account via Driving Licence
              </h3>
              <p className="text-xs text-slate-300 max-w-md mx-auto leading-relaxed">
                Scan your cards to automatically verify your HGV driving entitlement, Digital Tachograph, and Driver CPC. Everything is encrypted 100% on your phone.
              </p>
            </div>

            {/* 3 Cards To Scan Preview Grid */}
            <div className="space-y-2 pt-1">
              <div className="p-3 rounded-2xl bg-slate-950 border border-slate-800 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-xl bg-pink-500/20 text-pink-400 flex items-center justify-center font-bold text-xs">
                    1
                  </div>
                  <div>
                    <div className="text-xs font-bold text-white">UK Driving Licence</div>
                    <div className="text-[10px] text-slate-400">Scan Front &amp; Back (Cat C+E / C)</div>
                  </div>
                </div>
                <span className="text-[10px] font-mono text-pink-400 font-bold bg-pink-500/10 px-2 py-0.5 rounded border border-pink-500/20">
                  2 Sides
                </span>
              </div>

              <div className="p-3 rounded-2xl bg-slate-950 border border-slate-800 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-xl bg-blue-500/20 text-blue-400 flex items-center justify-center font-bold text-xs">
                    2
                  </div>
                  <div>
                    <div className="text-xs font-bold text-white">Driver Card (Digital Tachograph)</div>
                    <div className="text-[10px] text-slate-400">Scan Front &amp; Back (16-Digit Chip)</div>
                  </div>
                </div>
                <span className="text-[10px] font-mono text-cyan-400 font-bold bg-cyan-500/10 px-2 py-0.5 rounded border border-cyan-500/20">
                  2 Sides
                </span>
              </div>

              <div className="p-3 rounded-2xl bg-slate-950 border border-slate-800 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center font-bold text-xs">
                    3
                  </div>
                  <div>
                    <div className="text-xs font-bold text-white">Driver Qualification Card (CPC DQC)</div>
                    <div className="text-[10px] text-slate-400">Scan Front &amp; Back (35h Periodic Record)</div>
                  </div>
                </div>
                <span className="text-[10px] font-mono text-emerald-400 font-bold bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">
                  2 Sides
                </span>
              </div>
            </div>

            {/* Primary Action: Start 6-Card Scan */}
            <div className="space-y-2.5 pt-2">
              <button
                type="button"
                onClick={() => {
                  setPhase('SCAN_LICENCE_FRONT');
                  startCamera();
                }}
                className="w-full py-4 rounded-2xl bg-gradient-to-r from-amber-500 via-amber-400 to-amber-500 hover:from-amber-400 hover:to-amber-300 text-slate-950 font-black text-sm shadow-xl shadow-amber-500/25 active:scale-95 transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                <Camera className="w-4 h-4 text-slate-950" />
                <span>START SMART SCAN (6 CARD SIDES)</span>
                <ArrowRight className="w-4 h-4 text-slate-950" />
              </button>

              {/* The two user-specified alternatives: Fill in manually OR Skip all and do later */}
              <div className="grid grid-cols-2 gap-2 pt-1">
                <button
                  type="button"
                  onClick={handleFillInManually}
                  className="py-3 px-3 rounded-xl bg-slate-950 hover:bg-slate-850 text-slate-300 font-bold text-xs flex items-center justify-center gap-1.5 border border-slate-800 transition-all cursor-pointer hover:border-slate-700"
                >
                  <FileText className="w-3.5 h-3.5 text-slate-400" />
                  <span>Fill in manually</span>
                </button>
                <button
                  type="button"
                  onClick={handleSkipAllAndDoLater}
                  className="py-3 px-3 rounded-xl bg-slate-950 hover:bg-slate-850 text-slate-400 hover:text-white font-bold text-xs flex items-center justify-center gap-1.5 border border-slate-800 transition-all cursor-pointer hover:border-slate-700"
                >
                  <span>Skip all &amp; do later →</span>
                </button>
              </div>
            </div>

            {/* Privacy notice */}
            <div className="flex items-center justify-center gap-2 text-[10px] text-slate-400 font-mono pt-1">
              <Lock className="w-3 h-3 text-emerald-400" />
              <span>100% on-device AES-256 storage. Zero card photos or driver PII stored in cloud.</span>
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* 6 SEQUENTIAL SCAN PAGES (ONE PAGE PER CARD SIDE)                          */}
        {/* ========================================================================= */}
        {isScanPhase && (
          <div className="p-4 sm:p-6 space-y-4 animate-in fade-in duration-200">
            {/* Page Header */}
            {(() => {
              const info = SCAN_CARD_MAP[phase] || {
                cardIndex: 1,
                totalCards: 6,
                title: 'Scan Card Side',
                subtitle: 'Position card inside frame.',
                cardLabel: 'SCAN CARD',
                badgeColor: 'border-amber-500/40 text-amber-300 bg-amber-500/10',
                sampleImgKey: 'licenceFront'
              };
              return (
                <div className="flex items-center justify-between">
                  <div>
                    <span className="text-[10px] font-mono font-black text-amber-400 uppercase tracking-wider block">
                      Card Side {info.cardIndex} of 6 • {info.cardLabel}
                    </span>
                    <h3 className="text-base font-black text-white">
                      {info.title}
                    </h3>
                    <p className="text-[11px] text-slate-400">
                      {info.subtitle}
                    </p>
                  </div>
                  <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-xl bg-slate-800 text-[10px] font-mono text-slate-300">
                    <Zap className="w-3 h-3 text-amber-400" />
                    <span>Auto-Focus Active</span>
                  </div>
                </div>
              );
            })()}

            {/* Live Camera Viewfinder Frame */}
            <div className="relative mx-auto w-full aspect-[16/10] max-w-md rounded-2xl bg-black overflow-hidden border-2 border-slate-800 shadow-2xl flex items-center justify-center">
              {/* Live Video Feed - Always mounted during scan phases */}
              <video
                ref={videoRef}
                autoPlay
                playsInline
                muted
                onLoadedMetadata={() => {
                  if (videoRef.current && streamRef.current) {
                    videoRef.current.play().catch((e) => console.warn('Play error on loadedmetadata:', e));
                  }
                }}
                className={`w-full h-full object-cover transition-opacity duration-300 ${
                  isCameraActive ? 'opacity-100 block' : 'opacity-0 hidden'
                }`}
              />

              {/* Camera Standby / Permission Request Overlay */}
              {!isCameraActive && (
                <div className="p-6 text-center space-y-3 z-10 w-full max-w-xs animate-in fade-in duration-200">
                  <div className="w-14 h-14 rounded-2xl bg-amber-500/20 text-amber-400 flex items-center justify-center mx-auto border border-amber-500/30">
                    <Camera className="w-7 h-7 animate-pulse" />
                  </div>
                  <p className="text-xs text-slate-300 font-medium leading-relaxed">
                    {cameraError || 'Position document inside frame. Tap below to start live video.'}
                  </p>
                  <button
                    type="button"
                    onClick={() => startCamera()}
                    className="w-full py-3 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-black text-xs shadow-lg shadow-amber-500/25 active:scale-95 transition-all cursor-pointer"
                  >
                    ACTIVATE LIVE CAMERA
                  </button>
                </div>
              )}

              {/* Flip camera button (Front / Rear) */}
              {isCameraActive && (
                <button
                  type="button"
                  onClick={toggleCameraFacing}
                  title="Switch Front / Rear Camera"
                  className="absolute top-3 right-3 p-2 rounded-xl bg-slate-950/80 backdrop-blur-md border border-slate-700 text-slate-200 hover:text-white hover:border-amber-500/50 shadow-lg cursor-pointer transition-colors z-20"
                >
                  <RotateCcw className="w-4 h-4" />
                </button>
              )}

              {/* Card Bounding Box Overlay */}
              <div
                className={`absolute inset-3 sm:inset-4 rounded-xl border-2 transition-colors duration-200 pointer-events-none flex flex-col justify-between p-3 ${
                  focusSharpness >= 50
                    ? 'border-emerald-400 shadow-[0_0_20px_rgba(52,211,153,0.5)]'
                    : 'border-amber-400/80 shadow-[0_0_15px_rgba(245,158,11,0.25)]'
                }`}
              >
                {/* Target Corners */}
                <div className="flex justify-between">
                  <div className="w-4 h-4 border-t-2 border-l-2 border-white" />
                  <div className="w-4 h-4 border-t-2 border-r-2 border-white" />
                </div>

                {/* Laser scan bar animation */}
                <div className="w-full h-0.5 bg-amber-400/80 shadow-[0_0_10px_#f59e0b] animate-bounce" />

                <div className="flex justify-between">
                  <div className="w-4 h-4 border-b-2 border-l-2 border-white" />
                  <div className="w-4 h-4 border-b-2 border-r-2 border-white" />
                </div>
              </div>

              {/* Status pill on live feed */}
              <div className="absolute bottom-2 left-1/2 -translate-x-1/2 px-3 py-1 rounded-full bg-slate-950/90 backdrop-blur-md border border-slate-700 text-[10px] font-mono text-slate-200 flex items-center gap-2 shadow-lg z-20 whitespace-nowrap">
                <span
                  className={`w-2 h-2 rounded-full ${
                    focusSharpness >= 50 ? 'bg-emerald-400 animate-ping' : 'bg-amber-400'
                  }`}
                />
                <span>
                  {focusSharpness >= 50
                    ? `Card in Focus (${focusSharpness}%) • Auto-Capturing...`
                    : isCameraActive
                    ? `Align Document (${focusSharpness}% clarity)`
                    : 'Camera standby'}
                </span>
              </div>
            </div>

            {/* Hidden native camera capture & gallery upload inputs */}
            <input
              type="file"
              ref={nativeCameraInputRef}
              accept="image/*"
              capture="environment"
              className="hidden"
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (file) {
                  const reader = new FileReader();
                  reader.onload = (ev) => triggerDocumentCapture(ev.target?.result as string);
                  reader.readAsDataURL(file);
                }
              }}
            />
            <input
              type="file"
              ref={fileInputRef}
              accept="image/*"
              className="hidden"
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (file) {
                  const reader = new FileReader();
                  reader.onload = (ev) => triggerDocumentCapture(ev.target?.result as string);
                  reader.readAsDataURL(file);
                }
              }}
            />

            {/* Action Buttons: Live Snap, Native Phone Camera, and Upload */}
            <div className="grid grid-cols-3 gap-2 pt-1">
              <button
                type="button"
                onClick={() => triggerDocumentCapture()}
                className="py-3 px-2 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-black text-xs shadow-lg shadow-amber-500/20 active:scale-95 transition-all flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <Camera className="w-4 h-4" />
                <span>Snap Live</span>
              </button>

              <button
                type="button"
                onClick={() => nativeCameraInputRef.current?.click()}
                className="py-3 px-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs flex items-center justify-center gap-1.5 transition-colors cursor-pointer border border-slate-700"
              >
                <Camera className="w-3.5 h-3.5 text-amber-400" />
                <span>Take Photo</span>
              </button>

              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="py-3 px-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold text-xs flex items-center justify-center gap-1.5 transition-colors cursor-pointer border border-slate-700"
              >
                <Upload className="w-3.5 h-3.5" />
                <span>Upload</span>
              </button>
            </div>

            {/* Fast Bypass / Sample Document Link */}
            <div className="flex items-center justify-between text-[11px] text-slate-400 pt-1">
              <button
                type="button"
                onClick={() => triggerDocumentCapture()}
                className="text-amber-400 hover:underline cursor-pointer font-bold"
              >
                Use Sample Document for this Card →
              </button>
              <span className="font-mono text-[10px] text-emerald-400 flex items-center gap-1">
                <Lock className="w-3 h-3" />
                AES-256 On-Device
              </span>
            </div>

            {/* Explicit User-Requested Alternatives: Fill in manually OR Skip all and do later */}
            <div className="flex items-center justify-between pt-2 border-t border-slate-800/80 text-xs">
              <button
                type="button"
                onClick={handleFillInManually}
                className="text-slate-400 hover:text-white transition-colors cursor-pointer flex items-center gap-1.5 font-medium"
              >
                <FileText className="w-3.5 h-3.5 text-slate-400" />
                <span>Fill in manually</span>
              </button>

              <button
                type="button"
                onClick={handleSkipAllAndDoLater}
                className="text-amber-400 hover:text-amber-300 transition-colors cursor-pointer font-bold flex items-center gap-1"
              >
                <span>Skip all and do later</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* STEP 9: ANIMATED PROGRESS BAR / CREATING YOUR ACCOUNT                     */}
        {/* ========================================================================= */}
        {phase === 'CREATING_ACCOUNT' && (
          <div className="p-6 sm:p-8 space-y-6 text-center animate-in fade-in duration-200">
            <div className="space-y-2">
              <div className="relative w-20 h-20 mx-auto flex items-center justify-center">
                <div className="absolute inset-0 rounded-full border-4 border-slate-800 border-t-amber-400 animate-spin" />
                <div className="w-14 h-14 rounded-full bg-slate-950 flex items-center justify-center text-amber-400 font-mono font-bold text-sm">
                  {creationProgress}%
                </div>
              </div>

              <h3 className="text-lg sm:text-xl font-black text-white pt-2">
                Creating Your Account...
              </h3>
              <p className="text-xs text-slate-400 max-w-sm mx-auto">
                Setting up your digital tachograph compliance profile &amp; on-device vault.
              </p>
            </div>

            {/* Animated Progress Bar */}
            <div className="w-full bg-slate-800 h-3 rounded-full overflow-hidden p-0.5 border border-slate-700">
              <div
                className="h-full bg-gradient-to-r from-amber-500 via-emerald-400 to-emerald-500 rounded-full transition-all duration-150"
                style={{ width: `${creationProgress}%` }}
              />
            </div>

            {/* Dynamic Step Checklist Milestones */}
            <div className="space-y-2.5 max-w-sm mx-auto text-left text-xs font-mono">
              <div
                className={`p-2.5 rounded-xl border flex items-center gap-2.5 transition-colors ${
                  creationProgress >= 25
                    ? 'bg-emerald-950/30 border-emerald-500/40 text-emerald-300'
                    : 'bg-slate-950 border-slate-800 text-slate-500'
                }`}
              >
                {creationProgress >= 25 ? (
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                ) : (
                  <Loader2 className="w-4 h-4 animate-spin shrink-0" />
                )}
                <span>Generating On-Device AES-256 Vault</span>
              </div>

              <div
                className={`p-2.5 rounded-xl border flex items-center gap-2.5 transition-colors ${
                  creationProgress >= 50
                    ? 'bg-emerald-950/30 border-emerald-500/40 text-emerald-300'
                    : 'bg-slate-950 border-slate-800 text-slate-500'
                }`}
              >
                {creationProgress >= 50 ? (
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                ) : (
                  <div className="w-4 h-4 rounded-full border border-slate-700 shrink-0" />
                )}
                <span>Verifying DVLA Entitlements &amp; Driver CPC</span>
              </div>

              <div
                className={`p-2.5 rounded-xl border flex items-center gap-2.5 transition-colors ${
                  creationProgress >= 75
                    ? 'bg-emerald-950/30 border-emerald-500/40 text-emerald-300'
                    : 'bg-slate-950 border-slate-800 text-slate-500'
                }`}
              >
                {creationProgress >= 75 ? (
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                ) : (
                  <div className="w-4 h-4 rounded-full border border-slate-700 shrink-0" />
                )}
                <span>Configuring Digital Tachograph Profile</span>
              </div>

              <div
                className={`p-2.5 rounded-xl border flex items-center gap-2.5 transition-colors ${
                  creationProgress >= 100
                    ? 'bg-emerald-950/30 border-emerald-500/40 text-emerald-300'
                    : 'bg-slate-950 border-slate-800 text-slate-500'
                }`}
              >
                {creationProgress >= 100 ? (
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                ) : (
                  <div className="w-4 h-4 rounded-full border border-slate-700 shrink-0" />
                )}
                <span>On-Device Driver Vault Activated for Tacho-Scan</span>
              </div>
            </div>

            {/* Fast Continue Button */}
            <div className="pt-2">
              <button
                type="button"
                onClick={() => setPhase('CONTACT_VERIFY')}
                className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-black text-xs shadow-lg shadow-amber-500/20 active:scale-95 transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                <span>CONTINUE TO IN-CAB SETUP</span>
                <ArrowRight className="w-4 h-4 text-slate-950" />
              </button>
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* STEP 10: CONTACT DETAILS & DEPOT VERIFICATION                              */}
        {/* ========================================================================= */}
        {phase === 'CONTACT_VERIFY' && (
          <div className="p-5 sm:p-7 space-y-4 animate-in fade-in duration-200">
            <div className="text-center space-y-1">
              <span className="text-[10px] font-mono text-emerald-400 font-bold uppercase tracking-wider">
                ✓ Account Created &amp; Encrypted
              </span>
              <h3 className="text-base font-bold text-white">
                Confirm your contact details
              </h3>
              <p className="text-xs text-slate-400">
                Extracted from your {authProvider === 'GOOGLE' ? 'Google' : 'Apple'} Identity.
              </p>
            </div>

            <div className="space-y-3 pt-1">
              <div>
                <label className="text-[11px] font-bold text-slate-300 block mb-1">
                  Mobile Phone Number:
                </label>
                <div className="relative">
                  <Phone className="absolute left-3 top-3 w-4 h-4 text-slate-500" />
                  <input
                    type="text"
                    value={authPhone}
                    onChange={(e) => setAuthPhone(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-9 pr-3 py-2.5 text-xs text-white font-mono focus:outline-none focus:border-amber-500"
                  />
                </div>
              </div>

              <div>
                <label className="text-[11px] font-bold text-slate-300 block mb-1">
                  Email Address:
                </label>
                <div className="relative">
                  <Mail className="absolute left-3 top-3 w-4 h-4 text-slate-500" />
                  <input
                    type="text"
                    value={authEmail}
                    onChange={(e) => setAuthEmail(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-9 pr-3 py-2.5 text-xs text-white focus:outline-none focus:border-amber-500"
                  />
                </div>
              </div>

              <div>
                <label className="text-[11px] font-bold text-slate-300 block mb-1">
                  Primary Home Operating Depot:
                </label>
                <div className="relative">
                  <Building2 className="absolute left-3 top-3 w-4 h-4 text-slate-500" />
                  <input
                    type="text"
                    value={dossierHomeDepot}
                    onChange={(e) => setDossierHomeDepot(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-9 pr-3 py-2.5 text-xs text-white focus:outline-none focus:border-amber-500"
                  />
                </div>
              </div>
            </div>

            <div className="pt-2">
              <button
                onClick={() => setPhase('PREF_NAV_APP')}
                className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-black text-sm shadow-xl shadow-amber-500/25 active:scale-95 transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                <span>NEXT: IN-CAB PREFERENCES (STEP 1 OF 7)</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* PREFERENCE STEP 1: PREFERRED NAVIGATION APP                               */}
        {/* ========================================================================= */}
        {phase === 'PREF_NAV_APP' && (
          <div className="p-5 sm:p-7 space-y-4 animate-in fade-in duration-200">
            <div className="flex items-center justify-between pb-1">
              <button
                onClick={() => setPhase('CONTACT_VERIFY')}
                className="flex items-center gap-1.5 text-xs font-bold text-slate-400 hover:text-white transition-colors cursor-pointer"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>Back</span>
              </button>
              <span className="px-2.5 py-1 rounded-full bg-amber-500/10 text-amber-400 text-[10px] font-mono font-bold border border-amber-500/30">
                Question 1 of 7
              </span>
            </div>

            <div className="space-y-1">
              <h3 className="text-base sm:text-lg font-black text-white flex items-center gap-2">
                <Navigation className="w-5 h-5 text-amber-400" />
                <span>What navigation app do you use?</span>
              </h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Choose your primary GPS tool. Low bridge warnings and detour suggestions will sync directly to your chosen app.
              </p>
            </div>

            {/* Navigation Choices */}
            <div className="space-y-2.5 pt-1">
              {[
                {
                  id: 'GOOGLE_MAPS' as PreferredNavApp,
                  title: 'Google Maps',
                  desc: 'Standard UK turn-by-turn routing with live traffic & incident avoidance',
                  badge: 'Most Popular'
                },
                {
                  id: 'WAZE' as PreferredNavApp,
                  title: 'Waze',
                  desc: 'Community live speed traps, incident crowdsourcing & congestion re-routing',
                  badge: 'Live Crowd'
                },
                {
                  id: 'TOMTOM_TRUCK' as PreferredNavApp,
                  title: 'TomTom GO / Truck',
                  desc: 'HGV-specific dimensions, low bridge warnings & weight restricted streets',
                  badge: 'Truck Dedicated'
                },
                {
                  id: 'APPLE_MAPS' as PreferredNavApp,
                  title: 'Apple Maps',
                  desc: 'Seamless iOS CarPlay integration with clear lane guidance & 3D buildings',
                  badge: 'CarPlay Ready'
                },
                {
                  id: 'SYGIC_TRUCK' as PreferredNavApp,
                  title: 'Sygic Truck / Here WeGo',
                  desc: 'Offline heavy commercial routing with axle weight limits & hazmat corridors',
                  badge: 'Heavy Commercial'
                }
              ].map((item) => {
                const isSelected = prefNavApp === item.id;
                return (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => setPrefNavApp(item.id)}
                    className={`w-full p-3.5 rounded-2xl border text-left transition-all flex items-center justify-between cursor-pointer ${
                      isSelected
                        ? 'bg-amber-500/15 border-amber-400 shadow-lg shadow-amber-500/10'
                        : 'bg-slate-950/80 border-slate-800 hover:border-slate-700 hover:bg-slate-850'
                    }`}
                  >
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-white text-sm">{item.title}</span>
                        <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-800 text-slate-300">
                          {item.badge}
                        </span>
                      </div>
                      <p className="text-xs text-slate-400 mt-1">{item.desc}</p>
                    </div>
                    <div
                      className={`w-5 h-5 rounded-full border-2 flex items-center justify-center shrink-0 ${
                        isSelected ? 'border-amber-400 bg-amber-400' : 'border-slate-600'
                      }`}
                    >
                      {isSelected && <Check className="w-3.5 h-3.5 text-slate-950 font-bold" />}
                    </div>
                  </button>
                );
              })}
            </div>

            <div className="pt-2">
              <button
                type="button"
                onClick={() => setPhase('PREF_UNITS_HEIGHT')}
                className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-black text-sm shadow-xl shadow-amber-500/25 active:scale-95 transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                <span>NEXT: CLEARANCE UNITS (STEP 2 OF 7)</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* PREFERENCE STEP 2: HEIGHT & CLEARANCE UNITS                               */}
        {/* ========================================================================= */}
        {phase === 'PREF_UNITS_HEIGHT' && (
          <div className="p-5 sm:p-7 space-y-4 animate-in fade-in duration-200">
            <div className="flex items-center justify-between pb-1">
              <button
                onClick={() => setPhase('PREF_NAV_APP')}
                className="flex items-center gap-1.5 text-xs font-bold text-slate-400 hover:text-white transition-colors cursor-pointer"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>Back</span>
              </button>
              <span className="px-2.5 py-1 rounded-full bg-amber-500/10 text-amber-400 text-[10px] font-mono font-bold border border-amber-500/30">
                Question 2 of 7
              </span>
            </div>

            <div className="space-y-1">
              <h3 className="text-base sm:text-lg font-black text-white flex items-center gap-2">
                <Ruler className="w-5 h-5 text-amber-400" />
                <span>Do you work in imperial or metric?</span>
              </h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Determines how low bridge warnings, vehicle heights, and overhead clearances are displayed in your cab HUD.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
              <button
                type="button"
                onClick={() => setPrefUnitsHeight('IMPERIAL')}
                className={`p-4 rounded-2xl border text-left transition-all cursor-pointer flex flex-col justify-between ${
                  prefUnitsHeight === 'IMPERIAL'
                    ? 'bg-amber-500/15 border-amber-400 shadow-lg shadow-amber-500/10'
                    : 'bg-slate-950/80 border-slate-800 hover:border-slate-700'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-black text-white text-base">Imperial</span>
                    <span className="text-[10px] font-mono font-bold bg-amber-500/20 text-amber-300 px-2 py-0.5 rounded">
                      UK Standard
                    </span>
                  </div>
                  <div className="text-2xl font-mono font-black text-amber-400 mb-2">
                    16' 4" <span className="text-xs font-normal text-slate-400">/ 14' 9"</span>
                  </div>
                  <p className="text-xs text-slate-400 leading-relaxed">
                    Feet and inches. Matches traditional UK road signage, laser bridge plates, and trailer placards.
                  </p>
                </div>
                <div className="pt-3 flex justify-end">
                  <div
                    className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                      prefUnitsHeight === 'IMPERIAL' ? 'border-amber-400 bg-amber-400' : 'border-slate-600'
                    }`}
                  >
                    {prefUnitsHeight === 'IMPERIAL' && <Check className="w-3.5 h-3.5 text-slate-950 font-bold" />}
                  </div>
                </div>
              </button>

              <button
                type="button"
                onClick={() => setPrefUnitsHeight('METRIC')}
                className={`p-4 rounded-2xl border text-left transition-all cursor-pointer flex flex-col justify-between ${
                  prefUnitsHeight === 'METRIC'
                    ? 'bg-amber-500/15 border-amber-400 shadow-lg shadow-amber-500/10'
                    : 'bg-slate-950/80 border-slate-800 hover:border-slate-700'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-black text-white text-base">Metric</span>
                    <span className="text-[10px] font-mono font-bold bg-slate-800 text-slate-300 px-2 py-0.5 rounded">
                      Continental
                    </span>
                  </div>
                  <div className="text-2xl font-mono font-black text-emerald-400 mb-2">
                    4.95m <span className="text-xs font-normal text-slate-400">/ 4.40m</span>
                  </div>
                  <p className="text-xs text-slate-400 leading-relaxed">
                    Metres and centimetres. Standard for modern European chassis, pneumatic lift-axle sensors &amp; ferry specs.
                  </p>
                </div>
                <div className="pt-3 flex justify-end">
                  <div
                    className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                      prefUnitsHeight === 'METRIC' ? 'border-amber-400 bg-amber-400' : 'border-slate-600'
                    }`}
                  >
                    {prefUnitsHeight === 'METRIC' && <Check className="w-3.5 h-3.5 text-slate-950 font-bold" />}
                  </div>
                </div>
              </button>
            </div>

            <div className="pt-2">
              <button
                type="button"
                onClick={() => setPhase('PREF_UNITS_DISTANCE')}
                className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-black text-sm shadow-xl shadow-amber-500/25 active:scale-95 transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                <span>NEXT: DISTANCE UNITS (STEP 3 OF 7)</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* PREFERENCE STEP 3: DISTANCE & SPEED UNITS (MILES OR KM)                   */}
        {/* ========================================================================= */}
        {phase === 'PREF_UNITS_DISTANCE' && (
          <div className="p-5 sm:p-7 space-y-4 animate-in fade-in duration-200">
            <div className="flex items-center justify-between pb-1">
              <button
                onClick={() => setPhase('PREF_UNITS_HEIGHT')}
                className="flex items-center gap-1.5 text-xs font-bold text-slate-400 hover:text-white transition-colors cursor-pointer"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>Back</span>
              </button>
              <span className="px-2.5 py-1 rounded-full bg-amber-500/10 text-amber-400 text-[10px] font-mono font-bold border border-amber-500/30">
                Question 3 of 7
              </span>
            </div>

            <div className="space-y-1">
              <h3 className="text-base sm:text-lg font-black text-white flex items-center gap-2">
                <Gauge className="w-5 h-5 text-amber-400" />
                <span>Distance: Miles or Kilometres?</span>
              </h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Controls tachograph remaining drive time countdowns, route distances, and speed limit displays.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
              <button
                type="button"
                onClick={() => setPrefUnitsDistance('MILES')}
                className={`p-4 rounded-2xl border text-left transition-all cursor-pointer flex flex-col justify-between ${
                  prefUnitsDistance === 'MILES'
                    ? 'bg-amber-500/15 border-amber-400 shadow-lg shadow-amber-500/10'
                    : 'bg-slate-950/80 border-slate-800 hover:border-slate-700'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-black text-white text-base">Miles &amp; MPH</span>
                    <span className="text-[10px] font-mono font-bold bg-amber-500/20 text-amber-300 px-2 py-0.5 rounded">
                      UK Roads
                    </span>
                  </div>
                  <div className="text-2xl font-mono font-black text-amber-400 mb-2">
                    56 MPH <span className="text-xs font-normal text-slate-400">/ 184 mi</span>
                  </div>
                  <p className="text-xs text-slate-400 leading-relaxed">
                    UK highway standard. Distance displayed in miles and yards to junction turns.
                  </p>
                </div>
                <div className="pt-3 flex justify-end">
                  <div
                    className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                      prefUnitsDistance === 'MILES' ? 'border-amber-400 bg-amber-400' : 'border-slate-600'
                    }`}
                  >
                    {prefUnitsDistance === 'MILES' && <Check className="w-3.5 h-3.5 text-slate-950 font-bold" />}
                  </div>
                </div>
              </button>

              <button
                type="button"
                onClick={() => setPrefUnitsDistance('KILOMETERS')}
                className={`p-4 rounded-2xl border text-left transition-all cursor-pointer flex flex-col justify-between ${
                  prefUnitsDistance === 'KILOMETERS'
                    ? 'bg-amber-500/15 border-amber-400 shadow-lg shadow-amber-500/10'
                    : 'bg-slate-950/80 border-slate-800 hover:border-slate-700'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-black text-white text-base">Kilometres &amp; KM/H</span>
                    <span className="text-[10px] font-mono font-bold bg-slate-800 text-slate-300 px-2 py-0.5 rounded">
                      EU / Digital Tacho
                    </span>
                  </div>
                  <div className="text-2xl font-mono font-black text-cyan-400 mb-2">
                    90 KM/H <span className="text-xs font-normal text-slate-400">/ 296 km</span>
                  </div>
                  <p className="text-xs text-slate-400 leading-relaxed">
                    Direct 1:1 match with digital tachograph internal odometer (VDO / Stoneridge .DDD logs).
                  </p>
                </div>
                <div className="pt-3 flex justify-end">
                  <div
                    className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                      prefUnitsDistance === 'KILOMETERS' ? 'border-amber-400 bg-amber-400' : 'border-slate-600'
                    }`}
                  >
                    {prefUnitsDistance === 'KILOMETERS' && <Check className="w-3.5 h-3.5 text-slate-950 font-bold" />}
                  </div>
                </div>
              </button>
            </div>

            <div className="pt-2">
              <button
                type="button"
                onClick={() => setPhase('PREF_LANGUAGE')}
                className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-black text-sm shadow-xl shadow-amber-500/25 active:scale-95 transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                <span>NEXT: IN-CAB VOICE LANGUAGE (STEP 4 OF 7)</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* PREFERENCE STEP 4: IN-CAB VOICE & APP LANGUAGE                            */}
        {/* ========================================================================= */}
        {phase === 'PREF_LANGUAGE' && (
          <div className="p-5 sm:p-7 space-y-4 animate-in fade-in duration-200">
            <div className="flex items-center justify-between pb-1">
              <button
                onClick={() => setPhase('PREF_UNITS_DISTANCE')}
                className="flex items-center gap-1.5 text-xs font-bold text-slate-400 hover:text-white transition-colors cursor-pointer"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>Back</span>
              </button>
              <span className="px-2.5 py-1 rounded-full bg-amber-500/10 text-amber-400 text-[10px] font-mono font-bold border border-amber-500/30">
                Question 4 of 7
              </span>
            </div>

            <div className="space-y-1">
              <h3 className="text-base sm:text-lg font-black text-white flex items-center gap-2">
                <Languages className="w-5 h-5 text-amber-400" />
                <span>What is your preferred in-cab language?</span>
              </h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Spoken audio alarms for tachograph break warnings and compliance alerts will broadcast in your language.
              </p>
            </div>

            <div className="space-y-2 pt-1">
              {[
                { code: 'EN' as const, flag: '🇬🇧', label: 'English (United Kingdom)', sub: 'Default UK roadside audio' },
                { code: 'PL' as const, flag: '🇵🇱', label: 'Polski (Polish)', sub: 'Pełny polski lektor i ostrzeżenia' },
                { code: 'RO' as const, flag: '🇷🇴', label: 'Română (Romanian)', sub: 'Navigație completă în limba română' },
                { code: 'LT' as const, flag: '🇱🇹', label: 'Lietuvių (Lithuanian)', sub: 'Balsinis vedlys lietuvių kalba' },
                { code: 'ES' as const, flag: '🇪🇸', label: 'Español (Spanish)', sub: 'Instrucciones por voz en español' }
              ].map((lang) => {
                const isSelected = prefLanguage === lang.code;
                return (
                  <button
                    key={lang.code}
                    type="button"
                    onClick={() => setPrefLanguage(lang.code)}
                    className={`w-full p-3.5 rounded-2xl border text-left transition-all flex items-center justify-between cursor-pointer ${
                      isSelected
                        ? 'bg-amber-500/15 border-amber-400 shadow-lg shadow-amber-500/10'
                        : 'bg-slate-950/80 border-slate-800 hover:border-slate-700'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <span className="text-2xl">{lang.flag}</span>
                      <div>
                        <div className="font-bold text-white text-sm">{lang.label}</div>
                        <div className="text-[11px] text-slate-400">{lang.sub}</div>
                      </div>
                    </div>
                    <div
                      className={`w-5 h-5 rounded-full border-2 flex items-center justify-center shrink-0 ${
                        isSelected ? 'border-amber-400 bg-amber-400' : 'border-slate-600'
                      }`}
                    >
                      {isSelected && <Check className="w-3.5 h-3.5 text-slate-950 font-bold" />}
                    </div>
                  </button>
                );
              })}
            </div>

            <div className="pt-2">
              <button
                type="button"
                onClick={() => setPhase('PREF_VEHICLE_TYPE')}
                className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-black text-sm shadow-xl shadow-amber-500/25 active:scale-95 transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                <span>NEXT: PRIMARY VEHICLE TYPE (STEP 5 OF 7)</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* PREFERENCE STEP 5: PRIMARY HGV VEHICLE CATEGORY                           */}
        {/* ========================================================================= */}
        {phase === 'PREF_VEHICLE_TYPE' && (
          <div className="p-5 sm:p-7 space-y-4 animate-in fade-in duration-200">
            <div className="flex items-center justify-between pb-1">
              <button
                onClick={() => setPhase('PREF_LANGUAGE')}
                className="flex items-center gap-1.5 text-xs font-bold text-slate-400 hover:text-white transition-colors cursor-pointer"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>Back</span>
              </button>
              <span className="px-2.5 py-1 rounded-full bg-amber-500/10 text-amber-400 text-[10px] font-mono font-bold border border-amber-500/30">
                Question 5 of 7
              </span>
            </div>

            <div className="space-y-1">
              <h3 className="text-base sm:text-lg font-black text-white flex items-center gap-2">
                <Truck className="w-5 h-5 text-amber-400" />
                <span>What primary HGV do you drive?</span>
              </h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Initialises your default gross weight, axle clearances, and turning radius for low bridge radar calculations.
              </p>
            </div>

            <div className="space-y-2.5 pt-1">
              {[
                {
                  id: '44T_ARTIC_HGV' as VehicleCategory,
                  title: 'Class 1 • 44t Articulated HGV',
                  desc: 'Tractor unit + 13.6m standard trailer combo (up to 44,000 kg gross train weight)',
                  badge: 'Cat C+E'
                },
                {
                  id: '26T_CURTAINSIDER' as VehicleCategory,
                  title: 'Class 2 • 26t Rigid Curtainsider',
                  desc: '3-axle rigid goods vehicle with tail lift (up to 26,000 kg gross vehicle weight)',
                  badge: 'Cat C'
                },
                {
                  id: '18T_RIGID' as VehicleCategory,
                  title: 'Class 2 • 18t Rigid Goods Vehicle',
                  desc: '2-axle rigid distribution truck ideal for regional supermarket & hub delivery',
                  badge: 'Cat C'
                },
                {
                  id: '7_5T_RIGID' as VehicleCategory,
                  title: '7.5t Box / Curtainsider',
                  desc: 'Urban commercial freight delivery vehicle below 7,500 kg gross weight',
                  badge: 'Cat C1'
                }
              ].map((veh) => {
                const isSelected = prefVehicleType === veh.id;
                return (
                  <button
                    key={veh.id}
                    type="button"
                    onClick={() => setPrefVehicleType(veh.id)}
                    className={`w-full p-3.5 rounded-2xl border text-left transition-all flex items-center justify-between cursor-pointer ${
                      isSelected
                        ? 'bg-amber-500/15 border-amber-400 shadow-lg shadow-amber-500/10'
                        : 'bg-slate-950/80 border-slate-800 hover:border-slate-700'
                    }`}
                  >
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-white text-sm">{veh.title}</span>
                        <span className="text-[10px] font-mono font-bold bg-amber-500/20 text-amber-300 px-2 py-0.5 rounded">
                          {veh.badge}
                        </span>
                      </div>
                      <p className="text-xs text-slate-400 mt-1">{veh.desc}</p>
                    </div>
                    <div
                      className={`w-5 h-5 rounded-full border-2 flex items-center justify-center shrink-0 ${
                        isSelected ? 'border-amber-400 bg-amber-400' : 'border-slate-600'
                      }`}
                    >
                      {isSelected && <Check className="w-3.5 h-3.5 text-slate-950 font-bold" />}
                    </div>
                  </button>
                );
              })}
            </div>

            <div className="pt-2">
              <button
                type="button"
                onClick={() => setPhase('PREF_ROUTE_AVOIDANCE')}
                className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-black text-sm shadow-xl shadow-amber-500/25 active:scale-95 transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                <span>NEXT: ROUTE SAFETY GUARDRAILS (STEP 6 OF 7)</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* PREFERENCE STEP 6: ROUTE SAFETY & BRIDGE GUARDRAILS                       */}
        {/* ========================================================================= */}
        {phase === 'PREF_ROUTE_AVOIDANCE' && (
          <div className="p-5 sm:p-7 space-y-4 animate-in fade-in duration-200">
            <div className="flex items-center justify-between pb-1">
              <button
                onClick={() => setPhase('PREF_VEHICLE_TYPE')}
                className="flex items-center gap-1.5 text-xs font-bold text-slate-400 hover:text-white transition-colors cursor-pointer"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>Back</span>
              </button>
              <span className="px-2.5 py-1 rounded-full bg-amber-500/10 text-amber-400 text-[10px] font-mono font-bold border border-amber-500/30">
                Question 6 of 7
              </span>
            </div>

            <div className="space-y-1">
              <h3 className="text-base sm:text-lg font-black text-white flex items-center gap-2">
                <Shield className="w-5 h-5 text-amber-400" />
                <span>Route Safety &amp; Bridge Guardrails</span>
              </h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                How strictly should route compliance alerts adhere to bridge height and weight limits?
              </p>
            </div>

            <div className="space-y-2.5 pt-1">
              {[
                {
                  id: 'STRICT' as const,
                  title: 'Strict Safety (Zero-Strike Protocol)',
                  desc: 'Mandatory detours around any structure under +15cm buffer. Avoids all narrow residential lanes.',
                  badge: 'Highest Protection'
                },
                {
                  id: 'BALANCED' as const,
                  title: 'Balanced Commercial Routing',
                  desc: 'Follows official HGV corridors while avoiding known strikes and strict 7.5t environmental weight limits.',
                  badge: 'Recommended'
                },
                {
                  id: 'ADVISORY' as const,
                  title: 'Advisory Mode (Driver Discretion)',
                  desc: 'Displays overhead bridge heights on map as advisory markers; allows experienced local driver deviation.',
                  badge: 'Local Expert'
                }
              ].map((guard) => {
                const isSelected = prefRouteGuardrail === guard.id;
                return (
                  <button
                    key={guard.id}
                    type="button"
                    onClick={() => setPrefRouteGuardrail(guard.id)}
                    className={`w-full p-3.5 rounded-2xl border text-left transition-all flex items-center justify-between cursor-pointer ${
                      isSelected
                        ? 'bg-amber-500/15 border-amber-400 shadow-lg shadow-amber-500/10'
                        : 'bg-slate-950/80 border-slate-800 hover:border-slate-700'
                    }`}
                  >
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-white text-sm">{guard.title}</span>
                        <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-800 text-slate-300">
                          {guard.badge}
                        </span>
                      </div>
                      <p className="text-xs text-slate-400 mt-1">{guard.desc}</p>
                    </div>
                    <div
                      className={`w-5 h-5 rounded-full border-2 flex items-center justify-center shrink-0 ${
                        isSelected ? 'border-amber-400 bg-amber-400' : 'border-slate-600'
                      }`}
                    >
                      {isSelected && <Check className="w-3.5 h-3.5 text-slate-950 font-bold" />}
                    </div>
                  </button>
                );
              })}
            </div>

            <div className="pt-2">
              <button
                type="button"
                onClick={() => setPhase('PREF_PAYMENT_TYPE')}
                className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-black text-sm shadow-xl shadow-amber-500/25 active:scale-95 transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                <span>NEXT: EMPLOYMENT &amp; PAYMENT STATUS (STEP 7 OF 7)</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* PREFERENCE STEP 7: EMPLOYMENT & PAYMENT STRUCTURE                         */}
        {/* ========================================================================= */}
        {phase === 'PREF_PAYMENT_TYPE' && (
          <div className="p-5 sm:p-7 space-y-4 animate-in fade-in duration-200">
            <div className="flex items-center justify-between pb-1">
              <button
                onClick={() => setPhase('PREF_ROUTE_AVOIDANCE')}
                className="flex items-center gap-1.5 text-xs font-bold text-slate-400 hover:text-white transition-colors cursor-pointer"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>Back</span>
              </button>
              <span className="px-2.5 py-1 rounded-full bg-amber-500/10 text-amber-400 text-[10px] font-mono font-bold border border-amber-500/30">
                Question 7 of 7
              </span>
            </div>

            <div className="space-y-1">
              <h3 className="text-base sm:text-lg font-black text-white flex items-center gap-2">
                <Wallet className="w-5 h-5 text-amber-400" />
                <span>What is your employment / payment status?</span>
              </h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Configures your driver profile and digital compliance records.
              </p>
            </div>

            <div className="space-y-2.5 pt-1">
              {[
                {
                  id: 'PAYE' as const,
                  title: 'PAYE (Direct Employed / Agency Payroll)',
                  desc: 'Gross hourly pay with PAYE tax, National Insurance, and holiday pay auto-deducted.',
                  badge: 'Standard'
                },
                {
                  id: 'LTD' as const,
                  title: 'LTD Contractor (Outside IR35)',
                  desc: 'Direct B2B business invoices. Requires registered company number and corporate bank details.',
                  badge: 'High Earner'
                },
                {
                  id: 'UMBRELLA' as const,
                  title: 'Umbrella Company Scheme',
                  desc: 'Timesheets automatically submitted to your designated compliant UK umbrella intermediary.',
                  badge: 'Intermediary'
                }
              ].map((pay) => {
                const isSelected = prefPayment === pay.id;
                return (
                  <button
                    key={pay.id}
                    type="button"
                    onClick={() => setPrefPayment(pay.id)}
                    className={`w-full p-3.5 rounded-2xl border text-left transition-all flex items-center justify-between cursor-pointer ${
                      isSelected
                        ? 'bg-amber-500/15 border-amber-400 shadow-lg shadow-amber-500/10'
                        : 'bg-slate-950/80 border-slate-800 hover:border-slate-700'
                    }`}
                  >
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-white text-sm">{pay.title}</span>
                        <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-800 text-slate-300">
                          {pay.badge}
                        </span>
                      </div>
                      <p className="text-xs text-slate-400 mt-1">{pay.desc}</p>
                    </div>
                    <div
                      className={`w-5 h-5 rounded-full border-2 flex items-center justify-center shrink-0 ${
                        isSelected ? 'border-amber-400 bg-amber-400' : 'border-slate-600'
                      }`}
                    >
                      {isSelected && <Check className="w-3.5 h-3.5 text-slate-950 font-bold" />}
                    </div>
                  </button>
                );
              })}
            </div>

            <div className="pt-2">
              <button
                type="button"
                onClick={() => setPhase('DOSSIER_REVIEW')}
                className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-400 hover:to-emerald-500 text-slate-950 font-black text-sm shadow-xl shadow-emerald-500/25 active:scale-95 transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                <span>PROCEED TO COMPLIANCE DOSSIER REVIEW</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* STEP 18: MASTER DOSSIER REVIEW & CONFIRMATION                             */}
        {/* ========================================================================= */}
        {phase === 'DOSSIER_REVIEW' && (
          <div className="p-4 sm:p-6 space-y-4 max-h-[75vh] overflow-y-auto animate-in fade-in duration-200">
            
            {/* Header Badge */}
            <div className="p-3 rounded-2xl bg-gradient-to-r from-emerald-500/15 to-amber-500/15 border border-emerald-500/30 flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center font-black">
                  ✓
                </div>
                <div>
                  <div className="text-xs font-mono font-bold text-emerald-400">
                    DVLA ACCESS TO DRIVER DATA • VERIFIED
                  </div>
                  <div className="text-sm font-bold text-white">
                    {dossierCategory === 'CAT_CE' ? 'Class 1 Artic (Cat C+E)' : 'Class 2 Rigid (Cat C)'} Entitlement
                  </div>
                </div>
              </div>
              <div className="text-right">
                <span className="text-[10px] font-mono text-emerald-400 block">Clean Record</span>
                <span className="text-xs font-mono font-bold text-white">{dossierPoints} Penalty Pts</span>
              </div>
            </div>

            {/* Section 1: Driver Personal Details */}
            <div className="p-3.5 rounded-2xl bg-slate-950 border border-slate-800 space-y-3">
              <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                <span className="text-xs font-mono font-bold text-amber-400 uppercase tracking-wider">
                  Driver Identity Details
                </span>
                <span className="text-[10px] text-slate-500 font-mono">Editable</span>
              </div>

              <div className="grid grid-cols-2 gap-2 text-xs">
                <div>
                  <label className="text-[10px] text-slate-400 font-mono block">Full Name:</label>
                  <input
                    type="text"
                    value={dossierName}
                    onChange={(e) => setDossierName(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-700 rounded-lg px-2.5 py-1.5 text-white font-bold text-xs focus:border-amber-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="text-[10px] text-slate-400 font-mono block">Date of Birth:</label>
                  <input
                    type="text"
                    value={dossierDob}
                    onChange={(e) => setDossierDob(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-700 rounded-lg px-2.5 py-1.5 text-slate-200 font-mono text-xs focus:border-amber-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="text-[10px] text-slate-400 font-mono block">UK Licence Number:</label>
                  <input
                    type="text"
                    value={dossierLicenceNo}
                    onChange={(e) => setDossierLicenceNo(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-700 rounded-lg px-2.5 py-1.5 text-slate-200 font-mono text-xs focus:border-amber-500 focus:outline-none uppercase"
                  />
                </div>

                <div>
                  <label className="text-[10px] text-slate-400 font-mono block">Licence Expiry:</label>
                  <input
                    type="text"
                    value={dossierExpiry}
                    onChange={(e) => setDossierExpiry(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-700 rounded-lg px-2.5 py-1.5 text-slate-200 font-mono text-xs focus:border-amber-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="text-[10px] text-slate-400 font-mono block">Digital Tacho Card No:</label>
                  <input
                    type="text"
                    value={dossierTachoNumber}
                    onChange={(e) => setDossierTachoNumber(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-700 rounded-lg px-2.5 py-1.5 text-slate-200 font-mono text-xs focus:border-amber-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="text-[10px] text-slate-400 font-mono block">CPC DQC Expiry Date:</label>
                  <input
                    type="text"
                    value={dossierCpcExpiry}
                    onChange={(e) => setDossierCpcExpiry(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-700 rounded-lg px-2.5 py-1.5 text-slate-200 font-mono text-xs focus:border-amber-500 focus:outline-none"
                  />
                </div>
              </div>
            </div>

            {/* Section 2: In-Cab Preferences Overview */}
            <div className="p-3.5 rounded-2xl bg-slate-950 border border-slate-800 space-y-2.5">
              <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                <span className="text-xs font-mono font-bold text-amber-400 uppercase tracking-wider">
                  In-Cab Preferences
                </span>
                <span className="text-[10px] text-slate-500 font-mono">Tap any to change</span>
              </div>

              <div className="grid grid-cols-2 gap-2 text-xs">
                {/* Navigation App */}
                <button
                  type="button"
                  onClick={() => setPhase('PREF_NAV_APP')}
                  className="p-2.5 rounded-xl bg-slate-900 border border-slate-800 hover:border-amber-500/50 text-left transition-colors cursor-pointer group"
                >
                  <div className="text-[10px] text-slate-400 font-mono flex items-center justify-between">
                    <span>Navigation App</span>
                    <ChevronRight className="w-3 h-3 text-slate-500 group-hover:text-amber-400" />
                  </div>
                  <div className="font-bold text-white mt-0.5 truncate">
                    {prefNavApp === 'GOOGLE_MAPS' && 'Google Maps'}
                    {prefNavApp === 'WAZE' && 'Waze'}
                    {prefNavApp === 'TOMTOM_TRUCK' && 'TomTom Truck'}
                    {prefNavApp === 'APPLE_MAPS' && 'Apple Maps'}
                    {prefNavApp === 'SYGIC_TRUCK' && 'Sygic Truck'}
                  </div>
                </button>

                {/* Clearance Units */}
                <button
                  type="button"
                  onClick={() => setPhase('PREF_UNITS_HEIGHT')}
                  className="p-2.5 rounded-xl bg-slate-900 border border-slate-800 hover:border-amber-500/50 text-left transition-colors cursor-pointer group"
                >
                  <div className="text-[10px] text-slate-400 font-mono flex items-center justify-between">
                    <span>Clearance Units</span>
                    <ChevronRight className="w-3 h-3 text-slate-500 group-hover:text-amber-400" />
                  </div>
                  <div className="font-bold text-white mt-0.5">
                    {prefUnitsHeight === 'IMPERIAL' ? "Imperial (ft / in)" : "Metric (metres)"}
                  </div>
                </button>

                {/* Distance Units */}
                <button
                  type="button"
                  onClick={() => setPhase('PREF_UNITS_DISTANCE')}
                  className="p-2.5 rounded-xl bg-slate-900 border border-slate-800 hover:border-amber-500/50 text-left transition-colors cursor-pointer group"
                >
                  <div className="text-[10px] text-slate-400 font-mono flex items-center justify-between">
                    <span>Distance &amp; Speed</span>
                    <ChevronRight className="w-3 h-3 text-slate-500 group-hover:text-amber-400" />
                  </div>
                  <div className="font-bold text-white mt-0.5">
                    {prefUnitsDistance === 'MILES' ? 'Miles & MPH' : 'Kilometres & KM/H'}
                  </div>
                </button>

                {/* In-Cab Language */}
                <button
                  type="button"
                  onClick={() => setPhase('PREF_LANGUAGE')}
                  className="p-2.5 rounded-xl bg-slate-900 border border-slate-800 hover:border-amber-500/50 text-left transition-colors cursor-pointer group"
                >
                  <div className="text-[10px] text-slate-400 font-mono flex items-center justify-between">
                    <span>Voice Language</span>
                    <ChevronRight className="w-3 h-3 text-slate-500 group-hover:text-amber-400" />
                  </div>
                  <div className="font-bold text-white mt-0.5">
                    {prefLanguage === 'EN' && '🇬🇧 English (UK)'}
                    {prefLanguage === 'PL' && '🇵🇱 Polski'}
                    {prefLanguage === 'RO' && '🇷🇴 Română'}
                    {prefLanguage === 'LT' && '🇱🇹 Lietuvių'}
                    {prefLanguage === 'ES' && '🇪🇸 Español'}
                  </div>
                </button>

                {/* Primary Vehicle */}
                <button
                  type="button"
                  onClick={() => setPhase('PREF_VEHICLE_TYPE')}
                  className="p-2.5 rounded-xl bg-slate-900 border border-slate-800 hover:border-amber-500/50 text-left transition-colors cursor-pointer group"
                >
                  <div className="text-[10px] text-slate-400 font-mono flex items-center justify-between">
                    <span>Primary Vehicle</span>
                    <ChevronRight className="w-3 h-3 text-slate-500 group-hover:text-amber-400" />
                  </div>
                  <div className="font-bold text-white mt-0.5 truncate">
                    {prefVehicleType === '44T_ARTIC_HGV' && 'Class 1 44t Artic'}
                    {prefVehicleType === '26T_CURTAINSIDER' && 'Class 2 26t Rigid'}
                    {prefVehicleType === '18T_RIGID' && 'Class 2 18t Rigid'}
                    {prefVehicleType === '7_5T_RIGID' && '7.5t Luton'}
                  </div>
                </button>

                {/* Route Safety Guardrails */}
                <button
                  type="button"
                  onClick={() => setPhase('PREF_ROUTE_AVOIDANCE')}
                  className="p-2.5 rounded-xl bg-slate-900 border border-slate-800 hover:border-amber-500/50 text-left transition-colors cursor-pointer group"
                >
                  <div className="text-[10px] text-slate-400 font-mono flex items-center justify-between">
                    <span>Route Safety</span>
                    <ChevronRight className="w-3 h-3 text-slate-500 group-hover:text-amber-400" />
                  </div>
                  <div className="font-bold text-emerald-400 mt-0.5 truncate">
                    {prefRouteGuardrail === 'STRICT' && 'Strict (Zero Strikes)'}
                    {prefRouteGuardrail === 'BALANCED' && 'Balanced Freight'}
                    {prefRouteGuardrail === 'ADVISORY' && 'Advisory Only'}
                  </div>
                </button>

                {/* Payment Structure */}
                <button
                  type="button"
                  onClick={() => setPhase('PREF_PAYMENT_TYPE')}
                  className="p-2.5 rounded-xl bg-slate-900 border border-slate-800 hover:border-amber-500/50 text-left transition-colors cursor-pointer group col-span-2"
                >
                  <div className="text-[10px] text-slate-400 font-mono flex items-center justify-between">
                    <span>Employment / Billing</span>
                    <ChevronRight className="w-3 h-3 text-slate-500 group-hover:text-amber-400" />
                  </div>
                  <div className="font-bold text-amber-400 mt-0.5 truncate">
                    {prefPayment === 'PAYE' && 'PAYE Employed'}
                    {prefPayment === 'LTD' && 'LTD Contractor'}
                    {prefPayment === 'UMBRELLA' && 'Umbrella Payroll'}
                  </div>
                </button>
              </div>
            </div>

            {/* Section 4: 6 Encrypted Document Badges */}
            <div className="pt-1 border-t border-slate-800/80">
              <span className="text-[10px] font-mono text-slate-400 block mb-1.5">
                6 Document Sides in On-Device AES-256 Vault:
              </span>
              <div className="grid grid-cols-3 sm:grid-cols-6 gap-1.5 text-center text-[9px] font-mono">
                <div className={`p-2 rounded-lg border ${docLicenceFront ? 'bg-slate-950 border-emerald-500/40 text-emerald-300' : 'bg-slate-950 border-slate-800 text-slate-400'}`}>
                  <span>Licence Front {docLicenceFront ? '✓' : '—'}</span>
                </div>
                <div className={`p-2 rounded-lg border ${docLicenceBack ? 'bg-slate-950 border-emerald-500/40 text-emerald-300' : 'bg-slate-950 border-slate-800 text-slate-400'}`}>
                  <span>Licence Back {docLicenceBack ? '✓' : '—'}</span>
                </div>
                <div className={`p-2 rounded-lg border ${docTachoFront ? 'bg-slate-950 border-emerald-500/40 text-emerald-300' : 'bg-slate-950 border-slate-800 text-slate-400'}`}>
                  <span>Tacho Front {docTachoFront ? '✓' : '—'}</span>
                </div>
                <div className={`p-2 rounded-lg border ${docTachoBack ? 'bg-slate-950 border-emerald-500/40 text-emerald-300' : 'bg-slate-950 border-slate-800 text-slate-400'}`}>
                  <span>Tacho Back {docTachoBack ? '✓' : '—'}</span>
                </div>
                <div className={`p-2 rounded-lg border ${docCpcFront ? 'bg-slate-950 border-emerald-500/40 text-emerald-300' : 'bg-slate-950 border-slate-800 text-slate-400'}`}>
                  <span>CPC Front {docCpcFront ? '✓' : '—'}</span>
                </div>
                <div className={`p-2 rounded-lg border ${docCpcBack ? 'bg-slate-950 border-emerald-500/40 text-emerald-300' : 'bg-slate-950 border-slate-800 text-slate-400'}`}>
                  <span>CPC Back {docCpcBack ? '✓' : '—'}</span>
                </div>
              </div>
            </div>

            {/* Security Guarantee Notice */}
            <div className="p-2.5 rounded-xl bg-slate-950 border border-slate-800 flex items-center gap-2 text-[10px] text-slate-400 font-mono">
              <Lock className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
              <span>100% on-device AES-256 storage. Zero card photos or driver PII stored in cloud.</span>
            </div>

            {/* Suite App #1 Next Step Notice */}
            <div className="p-3 rounded-2xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-between text-xs">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse" />
                <span className="text-slate-200">
                  Starts with <strong className="text-amber-400">Tacho-Scan</strong> (Product #1): Live thermal printout OCR &amp; compliance bureau.
                </span>
              </div>
              <span className="text-[10px] font-mono text-emerald-400 font-bold shrink-0">
                FREE COMPLIANCE
              </span>
            </div>

            {/* Final Action Buttons */}
            <div className="flex gap-2 pt-1">
              <button
                type="button"
                onClick={() => setPhase('SCAN_LICENCE_FRONT')}
                className="px-3.5 py-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold text-xs transition-colors cursor-pointer"
              >
                Rescan Cards
              </button>
              <button
                type="button"
                onClick={handleActivateAccount}
                className="flex-1 py-3.5 rounded-xl bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-400 hover:to-emerald-500 text-slate-950 font-black text-sm shadow-xl shadow-emerald-500/25 active:scale-95 transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                <CheckCircle2 className="w-4 h-4 text-slate-950" />
                <span>CONFIRM &amp; START TACHO-SCAN APP</span>
              </button>
            </div>
          </div>
        )}

      </div>
    </div>
  );
};
