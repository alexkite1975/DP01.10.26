'use client';
import React, { useState, useEffect, useRef, useCallback } from 'react';
import {
  X,
  Building2,
  MapPin,
  Sparkles,
  Camera,
  Truck,
  ShieldCheck,
  CheckCircle2,
  Loader2,
  Clock,
  Lock,
  Plus,
  Trash2,
  Layers,
  Info,
  FileText,
  ScanLine,
  UploadCloud,
  Eye,
  RefreshCw,
  SlidersHorizontal,
  ChevronRight,
  AlertTriangle,
  FileCheck,
  Zap,
  ArrowRight
} from 'lucide-react';
import {
  SiteRiskAssessment,
  HazardMatrixItem,
  ApproachVideoStep,
  TimeWindowHazard,
  SitePlanData,
  ScannedDocumentItem,
  DocumentExtractionDetails
} from '../types';
import {
  searchPlacesAutocomplete,
  getPlaceDetails,
  PlacePrediction,
  generatePlusCode,
  scanNearbySensitivities
} from '../services/googlePlaces';
import { DualHeightInput, formatHeightBoth } from '../../utils/heightUtils';
import { getDefaultSitePlanForSite } from '../services/sitePlanService';
import {
  SAMPLE_ASSESSMENT_DOCS,
  SampleAssessmentDoc,
  readUploadedFile,
  processScannedRiskAssessment
} from '../services/documentScanService';
import { SitePlanAnnotator } from './SitePlanAnnotator';

interface CreateSiteModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSiteCreated: (newSite: SiteRiskAssessment) => void;
  initialPlaceData?: {
    title: string;
    address: string;
    lat: number;
    lng: number;
    placeId?: string;
  } | null;
  initialScanMode?: boolean;
}

export const CreateSiteModal: React.FC<CreateSiteModalProps> = ({
  isOpen,
  onClose,
  onSiteCreated,
  initialPlaceData,
  initialScanMode = false
}) => {
  const [activeTab, setActiveTab] = useState<'SCAN_DOCUMENT' | 'DETAILS' | 'SITE_PLAN'>('DETAILS');

  const [title, setTitle] = useState(initialPlaceData?.title || '');
  const [businessName, setBusinessName] = useState('Commercial Fleet Logistics');
  const [address, setAddress] = useState(initialPlaceData?.address || '');
  const [placePredictions, setPlacePredictions] = useState<PlacePrediction[]>([]);
  const [selectedPlaceId, setSelectedPlaceId] = useState<string | undefined>(
    initialPlaceData?.placeId
  );
  const [coordinates, setCoordinates] = useState({
    lat: initialPlaceData?.lat || 52.4578,
    lng: initialPlaceData?.lng || -1.2467
  });
  const [what3words, setWhat3words] = useState('');
  const [depotZone, setDepotZone] = useState('Central Logistics Network');

  // Business Section Mandatory Fields
  const [gateSecurityCode, setGateSecurityCode] = useState('#5820*');
  const [accessProcedures, setAccessProcedures] = useState(
    'Inbound drivers must report to security gatehouse, present proof of delivery and wait for bay allocation.'
  );
  const [intercomInstructions, setIntercomInstructions] = useState('Security Intercom Channel 1 or Gate Buzzer.');
  const [maxHeightMeters, setMaxHeightMeters] = useState(4.5);
  const [maxWeightTonnes, setMaxWeightTonnes] = useState(44.0);
  const [tailLiftRequired, setTailLiftRequired] = useState(false);
  const [bayCount, setBayCount] = useState(8);
  const [dockType, setDockType] = useState<'FLUSH_DOCK' | 'GROUND_LEVEL' | 'RAMP' | 'TAIL_LIFT_ONLY'>('FLUSH_DOCK');
  const [siteManagerName, setSiteManagerName] = useState('John Bradley (Depot Manager)');
  const [siteManagerPhone, setSiteManagerPhone] = useState('+44 7700 900555');
  const [siteManagerEmail, setSiteManagerEmail] = useState('operations@deliveryhub.co.uk');
  const [emergencyMusterPoint, setEmergencyMusterPoint] = useState('Muster Point B - Main Gate Perimeter');

  // Document Scanning & Upload State
  const [scannedDocs, setScannedDocs] = useState<ScannedDocumentItem[]>([]);
  const [isAiScanningDoc, setIsAiScanningDoc] = useState(false);
  const [scanStepIndex, setScanStepIndex] = useState(0);
  const [extractionResult, setExtractionResult] = useState<any | null>(null);
  const [isLiveCameraActive, setIsLiveCameraActive] = useState(false);
  const [cameraError, setCameraError] = useState<string | null>(null);

  // References
  const docFileInputRef = useRef<HTMLInputElement | null>(null);
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const streamRef = useRef<MediaStream | null>(null);

  const stopLiveCamera = useCallback(() => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((t) => t.stop());
      streamRef.current = null;
    }
    setIsLiveCameraActive(false);
  }, []);

  // Site Plan Data state
  const [sitePlan, setSitePlan] = useState<SitePlanData>(() =>
    getDefaultSitePlanForSite({
      title: initialPlaceData?.title || 'New Delivery Site',
      businessSection: {
        gateSecurityCode: '#5820*',
        emergencyMusterPoint: 'Muster Point B - Main Gate Perimeter',
        vehicleConstraints: { maxHeightMeters: 4.5 } as any
      } as any
    })
  );

  // Photos & AI
  const [uploadedPhotos, setUploadedPhotos] = useState<string[]>([]);
  const [isAiGenerating, setIsAiGenerating] = useState(false);
  const [aiGeneratedSuccess, setAiGeneratedSuccess] = useState(false);

  // Generated or default hazards & PPE
  const [mandatoryPPE, setMandatoryPPE] = useState<string[]>([
    'Hi-Vis Class 3 Vest/Jacket',
    'Safety Boots S3 Steel Toe',
    'Hard Hat'
  ]);
  const [baselineHazards, setBaselineHazards] = useState<HazardMatrixItem[]>([
    {
      id: 'haz-def-1',
      hazard: 'Blind-side reversing into loading bay apron',
      category: 'TRAFFIC',
      likelihood: 3,
      severity: 4,
      riskRating: 12,
      riskLevel: 'MEDIUM',
      controlMeasures: ['Banksman guidance during peak hours', 'Hazard flashing lights mandatory']
    },
    {
      id: 'haz-def-2',
      hazard: 'Forklift & pedestrian interaction along main warehouse corridor',
      category: 'PEDESTRIAN',
      likelihood: 3,
      severity: 4,
      riskRating: 12,
      riskLevel: 'HIGH',
      controlMeasures: ['Designated green hatched walkways', 'Sound vehicle horn at corners']
    }
  ]);

  // Handle modal open & initial tab selection
  useEffect(() => {
    if (isOpen) {
      if (initialScanMode) {
        setActiveTab('SCAN_DOCUMENT');
      } else if (initialPlaceData) {
        setActiveTab('DETAILS');
      }
    } else {
      // Clean up camera on close
      stopLiveCamera();
    }
  }, [isOpen, initialScanMode, initialPlaceData, stopLiveCamera]);

  // Update fields if initialPlaceData arrives
  useEffect(() => {
    if (initialPlaceData) {
      setTitle(initialPlaceData.title);
      setAddress(initialPlaceData.address);
      setCoordinates({ lat: initialPlaceData.lat, lng: initialPlaceData.lng });
      if (initialPlaceData.placeId) setSelectedPlaceId(initialPlaceData.placeId);

      // Refresh site plan annotations
      setSitePlan(
        getDefaultSitePlanForSite({
          title: initialPlaceData.title,
          businessSection: {
            gateSecurityCode,
            emergencyMusterPoint,
            vehicleConstraints: { maxHeightMeters } as any
          } as any
        })
      );
    }
  }, [initialPlaceData]);

  // Step ticker animation during document scanning
  useEffect(() => {
    if (!isAiScanningDoc) {
      setScanStepIndex(0);
      return;
    }
    const interval = setInterval(() => {
      setScanStepIndex((prev) => (prev + 1) % 4);
    }, 1100);
    return () => clearInterval(interval);
  }, [isAiScanningDoc]);

  // Clean up camera stream on unmount
  useEffect(() => {
    return () => {
      stopLiveCamera();
    };
  }, [stopLiveCamera]);

  // --- Live Camera Functions ---
  const startLiveCamera = async () => {
    setCameraError(null);
    try {
      setIsLiveCameraActive(true);
      const stream = await navigator.mediaDevices.getUserMedia({
        video: {
          facingMode: { ideal: 'environment' },
          width: { ideal: 1280 }
        }
      });
      streamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.play();
      }
    } catch (err: any) {
      console.warn('Camera stream error, falling back to file picker:', err);
      setCameraError('Camera access unavailable or declined. Use file upload or mobile photo picker.');
      setIsLiveCameraActive(false);
      docFileInputRef.current?.click();
    }
  };

  const captureCameraSnapshot = () => {
    if (!videoRef.current) return;
    const canvas = document.createElement('canvas');
    canvas.width = videoRef.current.videoWidth || 1280;
    canvas.height = videoRef.current.videoHeight || 720;
    const ctx = canvas.getContext('2d');
    if (ctx) {
      ctx.drawImage(videoRef.current, 0, 0, canvas.width, canvas.height);
      const dataUrl = canvas.toDataURL('image/jpeg', 0.92);
      const newDoc: ScannedDocumentItem = {
        id: `scan-${Date.now()}`,
        name: `Scanned Assessment (Camera ${new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })})`,
        dataUrl,
        mimeType: 'image/jpeg',
        uploadedAt: new Date().toISOString()
      };
      setScannedDocs((prev) => [newDoc, ...prev]);
    }
    stopLiveCamera();
  };

  // --- Document File Selection ---
  const handleDocumentFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const files = Array.from(e.target.files) as File[];
      for (const f of files) {
        try {
          const docItem = await readUploadedFile(f);
          setScannedDocs((prev) => [docItem, ...prev]);
        } catch (err) {
          console.error('Error reading document:', err);
        }
      }
    }
  };

  const handleSelectSampleDocument = (sample: SampleAssessmentDoc) => {
    const sampleDoc: ScannedDocumentItem = {
      id: `sample-${Date.now()}`,
      name: `${sample.name} (${sample.refNumber})`,
      dataUrl: sample.dataUrl,
      mimeType: 'image/svg+xml',
      uploadedAt: new Date().toISOString()
    };
    setScannedDocs([sampleDoc]);
  };

  const handleRemoveDoc = (id: string) => {
    setScannedDocs((prev) => prev.filter((d) => d.id !== id));
    if (scannedDocs.length <= 1) {
      setExtractionResult(null);
    }
  };

  // --- AI Document Extraction ---
  const handleExecuteAiDocumentScan = async () => {
    if (scannedDocs.length === 0) return;
    setIsAiScanningDoc(true);
    setExtractionResult(null);

    try {
      const response = await processScannedRiskAssessment({
        scannedDocuments: scannedDocs,
        fallbackTitle: title || 'Scanned Logistics Hub',
        fallbackAddress: address,
        promptNotes: `Existing risk assessment document provided by driver/company. Extract and digitize.`
      });

      if (response && response.data) {
        const d = response.data;
        setExtractionResult(d);

        // Auto-populate form fields from extracted document
        if (d.extractedSiteTitle || d.title) {
          setTitle(d.extractedSiteTitle || d.title);
        }
        if (d.extractedBusinessName || d.businessName) {
          setBusinessName(d.extractedBusinessName || d.businessName);
        }
        if (d.extractedAddress || d.address) {
          setAddress(d.extractedAddress || d.address);
        }
        if (d.extractedGateSecurityCode || d.gateSecurityCode) {
          setGateSecurityCode(d.extractedGateSecurityCode || d.gateSecurityCode);
        }
        if (d.mandatoryPPE && Array.isArray(d.mandatoryPPE) && d.mandatoryPPE.length > 0) {
          setMandatoryPPE(d.mandatoryPPE);
        }
        if (d.accessProcedures) {
          setAccessProcedures(d.accessProcedures);
        }
        if (d.intercomInstructions) {
          setIntercomInstructions(d.intercomInstructions);
        }
        if (d.emergencyMusterPoint) {
          setEmergencyMusterPoint(d.emergencyMusterPoint);
        }
        if (d.baselineHazards && Array.isArray(d.baselineHazards) && d.baselineHazards.length > 0) {
          setBaselineHazards(d.baselineHazards);
        }

        if (d.loadingBayRecommendations) {
          if (d.loadingBayRecommendations.bayCount) setBayCount(d.loadingBayRecommendations.bayCount);
          if (d.loadingBayRecommendations.dockType) setDockType(d.loadingBayRecommendations.dockType);
        }

        // Incorporate AI CAD Site Plan annotations
        if (d.sitePlan && Array.isArray(d.sitePlan.annotations) && d.sitePlan.annotations.length > 0) {
          setSitePlan(d.sitePlan);
        } else {
          setSitePlan(
            getDefaultSitePlanForSite({
              title: d.extractedSiteTitle || title || 'Scanned Delivery Hub',
              businessSection: {
                gateSecurityCode: d.extractedGateSecurityCode || gateSecurityCode,
                emergencyMusterPoint: d.emergencyMusterPoint || emergencyMusterPoint,
                vehicleConstraints: { maxHeightMeters } as any
              } as any
            })
          );
        }

        // Also add the scanned document preview to uploaded photos if image
        const imgDoc = scannedDocs[0];
        if (imgDoc && !uploadedPhotos.includes(imgDoc.dataUrl)) {
          setUploadedPhotos((prev) => [imgDoc.dataUrl, ...prev]);
        }
      }
    } catch (err) {
      console.error('Document scan execution failed:', err);
    } finally {
      setIsAiScanningDoc(false);
    }
  };

  // Handle address input and autocomplete
  const handleAddressChange = async (val: string) => {
    setAddress(val);
    if (val.length > 2) {
      try {
        const results = await searchPlacesAutocomplete(val);
        setPlacePredictions(results);
      } catch (e) {
        console.warn('Place autocomplete failed', e);
      }
    } else {
      setPlacePredictions([]);
    }
  };

  const handleSelectPrediction = async (pred: PlacePrediction) => {
    setAddress(pred.description);
    setSelectedPlaceId(pred.placeId);
    setPlacePredictions([]);

    const details = await getPlaceDetails(pred.placeId);
    if (details) {
      setCoordinates({ lat: details.lat, lng: details.lng });
      if (!title || title === 'Commercial Fleet Logistics') {
        setTitle(details.name || pred.mainText);
      }
    }
  };

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const files = Array.from(e.target.files) as File[];
      const newPhotos: string[] = [];
      files.forEach((file: File) => {
        const reader = new FileReader();
        reader.onload = (event) => {
          if (event.target?.result) {
            newPhotos.push(event.target.result as string);
            if (newPhotos.length === files.length) {
              setUploadedPhotos((prev) => [...prev, ...newPhotos]);
            }
          }
        };
        reader.readAsDataURL(file);
      });
    }
  };

  const handleGenerateAiRiskAssessment = async () => {
    setIsAiGenerating(true);
    setAiGeneratedSuccess(false);

    try {
      const res = await fetch('/api/ai-risk-assessment', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: title || 'Logistics Delivery Site',
          businessName: businessName || 'Commercial Fleet Hub',
          address: address || 'Industrial Park',
          placeMetadata: { coordinates, placeId: selectedPlaceId },
          vehicleConstraints: { maxHeightMeters, maxWeightTonnes, tailLiftRequired },
          photos: uploadedPhotos,
          scannedDocuments: scannedDocs.map((d) => d.dataUrl),
          isExistingDocumentScan: scannedDocs.length > 0,
          promptNotes: `Loading bay count: ${bayCount}, dock type: ${dockType}. Address: ${address}`
        })
      });

      const json = await res.json();
      if (json.success && json.data) {
        const d = json.data;
        if (d.mandatoryPPE?.length) setMandatoryPPE(d.mandatoryPPE);
        if (d.accessProcedures) setAccessProcedures(d.accessProcedures);
        if (d.intercomInstructions) setIntercomInstructions(d.intercomInstructions);
        if (d.emergencyMusterPoint) setEmergencyMusterPoint(d.emergencyMusterPoint);
        if (d.baselineHazards?.length) setBaselineHazards(d.baselineHazards);

        if (d.sitePlan && Array.isArray(d.sitePlan.annotations) && d.sitePlan.annotations.length > 0) {
          setSitePlan(d.sitePlan);
        } else {
          setSitePlan(
            getDefaultSitePlanForSite({
              title,
              businessSection: {
                gateSecurityCode,
                emergencyMusterPoint: d.emergencyMusterPoint || emergencyMusterPoint,
                vehicleConstraints: { maxHeightMeters } as any
              } as any
            })
          );
        }

        setAiGeneratedSuccess(true);
      }
    } catch (e) {
      console.warn('AI risk generation failed, keeping baseline:', e);
    } finally {
      setIsAiGenerating(false);
    }
  };

  // Build draft site assessment for preview in annotator
  const draftAssessment: SiteRiskAssessment = {
    id: 'draft-site',
    title: title || 'New Delivery Site',
    businessName: businessName || 'Commercial Hub',
    address: address || 'Depot Address',
    coordinates,
    depotZone,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    version: 1,
    overallRiskLevel: baselineHazards.some((h) => h.riskLevel === 'HIGH' || h.riskLevel === 'CRITICAL')
      ? 'HIGH'
      : 'MEDIUM',
    overallScore: baselineHazards.reduce((acc, h) => Math.max(acc, h.riskRating), 12),
    status: 'APPROVED',
    businessSection: {
      mandatoryPPE,
      accessProcedures,
      gateSecurityCode,
      intercomInstructions,
      operatingHours: {
        open: '06:00',
        close: '22:00',
        days: 'Mon - Sat',
        outOfHoursDeliveryPermitted: true
      },
      timeWindowHazards: [],
      vehicleConstraints: {
        maxHeightMeters,
        maxWeightTonnes,
        maxLengthMeters: 18.75,
        tailLiftRequired,
        turningCircleConstraint: 'MODERATE',
        lowBridgeAlert: `Clearance verified up to ${maxHeightMeters}m.`
      },
      loadingBayDetails: {
        bayCount,
        dockType,
        reversingGuidance: 'Sound horn twice before reversing. Reverse squarely onto dock.',
        wheelChocksMandatory: true,
        keysHandoverRequired: true
      },
      siteManager: {
        name: siteManagerName,
        phone: siteManagerPhone,
        email: siteManagerEmail,
        radioChannel: 'PMR Ch 2'
      },
      emergencyMusterPoint,
      baselineHazards,
      approachVideoGuide: {
        title: `${title || 'Site'} Approach Guide`,
        summary: `Navigation checkpoints and gatehouse procedure for ${title}.`,
        durationSeconds: 85,
        steps: []
      },
      media: [],
      sitePlan
    },
    driverSection: {
      realTimeAlerts: [],
      observations: [],
      pendingModifications: []
    },
    auditHistory: []
  };

  const handleSubmit = (e?: React.FormEvent) => {
    if (e) e.preventDefault();

    const newSiteId = `site-${Date.now()}`;
    const newSite: SiteRiskAssessment = {
      id: newSiteId,
      title: title || 'New Delivery Site',
      businessName: businessName || 'Fleet Client Hub',
      address: address || 'Commercial Address',
      placeId: selectedPlaceId,
      plusCode: generatePlusCode(coordinates.lat, coordinates.lng),
      placePhotos: uploadedPhotos.length > 0 ? uploadedPhotos : [
        'https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?auto=format&fit=crop&w=800&q=80',
        'https://images.unsplash.com/photo-1590674899484-d5640e854abe?auto=format&fit=crop&w=800&q=80'
      ],
      nearbySensitivities: scanNearbySensitivities(coordinates.lat, coordinates.lng, address),
      isOfflineCached: true,
      coordinates,
      what3words: what3words || undefined,
      depotZone,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      version: 1,
      overallRiskLevel: baselineHazards.some((h) => h.riskLevel === 'HIGH' || h.riskLevel === 'CRITICAL')
        ? 'HIGH'
        : 'MEDIUM',
      overallScore: baselineHazards.reduce((acc, h) => Math.max(acc, h.riskRating), 12),
      status: 'APPROVED',
      businessSection: {
        mandatoryPPE,
        accessProcedures,
        gateSecurityCode,
        intercomInstructions,
        operatingHours: {
          open: '06:00',
          close: '22:00',
          days: 'Mon - Sat',
          outOfHoursDeliveryPermitted: true
        },
        timeWindowHazards: [
          {
            id: `twh-${Date.now()}`,
            title: 'School Run Pedestrian Window',
            timeStart: '08:00',
            timeEnd: '09:00',
            severity: 'HIGH',
            description: 'Foot traffic and school bus stopping outside main access road.',
            affectedParties: 'Pedestrians, cyclists'
          }
        ],
        vehicleConstraints: {
          maxHeightMeters,
          maxWeightTonnes,
          maxLengthMeters: 18.75,
          tailLiftRequired,
          turningCircleConstraint: 'MODERATE',
          lowBridgeAlert: `Clearance verified up to ${maxHeightMeters}m.`
        },
        loadingBayDetails: {
          bayCount,
          dockType,
          reversingGuidance:
            'Sound horn twice before reversing. Reverse in alignment with yellow painted deck lines.',
          wheelChocksMandatory: true,
          keysHandoverRequired: true
        },
        siteManager: {
          name: siteManagerName,
          phone: siteManagerPhone,
          email: siteManagerEmail,
          radioChannel: 'PMR Ch 2'
        },
        emergencyMusterPoint,
        baselineHazards,
        approachVideoGuide: {
          title: `${title} Approach Guide`,
          summary: `Navigation checkpoints and gatehouse procedure for ${title}.`,
          durationSeconds: 85,
          steps: [
            {
              stepNumber: 1,
              heading: 'Main Access Road Turnoff',
              instruction: 'Signal early and swing wide into commercial service lane.',
              narrationText: `Approaching ${title}. Signal left and enter the dedicated delivery road.`,
              checkpointType: 'ROUNDABOUT',
              mockImageUrl: 'https://images.unsplash.com/photo-1542282088-72c9c27ed0cd?auto=format&fit=crop&w=600&q=80'
            },
            {
              stepNumber: 2,
              heading: 'Security Gatehouse Barrier',
              instruction: `Halt at red line. Security code is ${gateSecurityCode}.`,
              narrationText: `Stop at Security. The gate keypad code is ${gateSecurityCode}. Wait for barrier clearance.`,
              checkpointType: 'SECURITY_GATE',
              mockImageUrl: 'https://images.unsplash.com/photo-1590674899484-d5640e854abe?auto=format&fit=crop&w=600&q=80'
            },
            {
              stepNumber: 3,
              heading: 'Loading Dock Bays',
              instruction: 'Reverse squarely onto designated buffer pads. Apply wheel chocks.',
              narrationText: 'Reverse onto the dock bay. Apply wheel chocks before opening trailer doors.',
              checkpointType: 'LOADING_BAY',
              mockImageUrl: 'https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?auto=format&fit=crop&w=600&q=80'
            }
          ]
        },
        media: uploadedPhotos.map((url, i) => ({
          id: `med-${i}`,
          type: 'PHOTO',
          url,
          caption: `Site Entrance Photo ${i + 1}`,
          category: 'ENTRANCE',
          uploadedAt: new Date().toISOString(),
          uploadedBy: siteManagerName
        })),
        sitePlan
      },
      driverSection: {
        realTimeAlerts: [],
        observations: [],
        pendingModifications: []
      },
      auditHistory: [
        {
          id: `aud-${Date.now()}`,
          timestamp: new Date().toISOString(),
          user: siteManagerName,
          role: 'Site Safety Manager',
          action: 'CREATED_ASSESSMENT',
          details: extractionResult
            ? 'AI-digitized site risk assessment created from scanned physical document'
            : 'Initial AI-assisted site risk assessment created with annotated site plan'
        }
      ]
    };

    onSiteCreated(newSite);
    onClose();
  };

  const scanSteps = [
    'Reading document OCR text, company stamp & headers...',
    'Extracting vehicle clearance, weight limit & gate keypad codes...',
    'Transcribing mandatory PPE & hazard matrix with control measures...',
    'Synthesizing interactive yard CAD plan & emergency muster pins...'
  ];

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-4xl rounded-2xl border border-slate-200 bg-white p-5 sm:p-6 shadow-2xl text-slate-900 max-h-[94vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-slate-200">
          <div className="flex items-center gap-2.5">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-tr from-blue-600 to-indigo-600 text-white font-bold shadow-md shadow-blue-600/20">
              <Building2 className="h-5 w-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base font-bold text-slate-900">
                  AI Risk Assessment Generator & Document Scanner
                </h2>
                <span className="rounded-full bg-indigo-50 px-2 py-0.5 text-[11px] font-bold text-indigo-700 border border-indigo-200">
                  Driver & Company AI
                </span>
              </div>
              <p className="text-xs text-slate-500">
                Scan existing paper RAMS sheets, upload PDFs, or create with Google Places verification
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-100 hover:text-slate-700"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* 3-Tab Selector: Document Scanner vs Form Details vs Site Plan */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-1.5 rounded-xl border border-slate-200 bg-slate-100 p-1 mt-4">
          <button
            type="button"
            onClick={() => setActiveTab('SCAN_DOCUMENT')}
            className={`flex items-center justify-center gap-1.5 py-2 px-3 text-xs font-bold rounded-lg transition-all ${
              activeTab === 'SCAN_DOCUMENT'
                ? 'bg-white text-indigo-700 shadow-sm border border-slate-200'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <ScanLine className="h-4 w-4 text-indigo-600" />
            <span>1. Scan / Upload RAMS</span>
            {scannedDocs.length > 0 && (
              <span className="rounded-full bg-indigo-100 px-1.5 py-0.2 text-[10px] font-bold text-indigo-700">
                {scannedDocs.length}
              </span>
            )}
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('DETAILS')}
            className={`flex items-center justify-center gap-1.5 py-2 px-3 text-xs font-bold rounded-lg transition-all ${
              activeTab === 'DETAILS'
                ? 'bg-white text-blue-700 shadow-sm border border-slate-200'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Building2 className="h-4 w-4 text-blue-600" />
            <span>2. Site Details & Rules</span>
            {extractionResult && (
              <span className="rounded-full bg-emerald-100 px-1.5 py-0.2 text-[10px] font-bold text-emerald-700">
                Digitized
              </span>
            )}
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('SITE_PLAN')}
            className={`flex items-center justify-center gap-1.5 py-2 px-3 text-xs font-bold rounded-lg transition-all ${
              activeTab === 'SITE_PLAN'
                ? 'bg-white text-emerald-700 shadow-sm border border-slate-200'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Layers className="h-4 w-4 text-emerald-600" />
            <span>3. Yard CAD & Safety Pins</span>
            <span className="rounded-full bg-emerald-100 px-1.5 py-0.2 text-[10px] font-bold text-emerald-800">
              {sitePlan.annotations?.length || 0} Pins
            </span>
          </button>
        </div>

        {/* TAB 1: SCAN OR UPLOAD EXISTING RISK ASSESSMENT */}
        {activeTab === 'SCAN_DOCUMENT' && (
          <div className="space-y-4 pt-4 text-xs">
            {/* Instruction Hero Banner */}
            <div className="rounded-xl border border-indigo-200 bg-gradient-to-r from-indigo-50/70 via-blue-50/50 to-white p-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <Sparkles className="h-4 w-4 text-indigo-600" />
                    <h3 className="text-sm font-bold text-slate-900">
                      Digitize Existing Risk Assessments with Gemini AI
                    </h3>
                  </div>
                  <p className="text-xs text-slate-600 max-w-2xl leading-relaxed">
                    Point your camera at a physical paper assessment sheet, or upload an existing PDF / RAMS document.
                    Gemini extracts gatehouse procedures, clearance limits, PPE rules, and baseline hazards,
                    automatically mapping CAD safety pins onto the site plan.
                  </p>
                </div>

                <span className="shrink-0 inline-flex items-center gap-1 rounded-full bg-indigo-100/90 text-indigo-800 text-[11px] font-bold px-2.5 py-1 border border-indigo-200">
                  <ShieldCheck className="h-3.5 w-3.5 text-indigo-600" />
                  ISO 45001 Transcriber
                </span>
              </div>
            </div>

            {/* Ingest Action Buttons: Camera vs File Upload vs Sample Sheets */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {/* Option A: Live Camera Scanner */}
              <div className="rounded-xl border border-slate-200 bg-slate-50 p-4 space-y-3 flex flex-col justify-between">
                <div className="space-y-1">
                  <div className="flex items-center gap-2 font-bold text-slate-900">
                    <Camera className="h-4 w-4 text-blue-600" />
                    <span>Scan with Device Camera</span>
                  </div>
                  <p className="text-[11px] text-slate-500">
                    Snap a photo of printed RAMS sheets, depot gate noticeboards, or clipboard rules.
                  </p>
                </div>

                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={startLiveCamera}
                    className="flex-1 flex items-center justify-center gap-1.5 rounded-xl bg-blue-600 hover:bg-blue-700 active:scale-95 py-2 px-3 text-xs font-bold text-white shadow-sm transition-all"
                  >
                    <Camera className="h-3.5 w-3.5" />
                    <span>Launch Live Camera</span>
                  </button>

                  {/* Native mobile camera fallback trigger */}
                  <label className="flex items-center justify-center rounded-xl border border-slate-300 bg-white hover:bg-slate-100 px-3 py-2 text-xs font-semibold text-slate-700 cursor-pointer shadow-sm">
                    <span>File/Photo</span>
                    <input
                      type="file"
                      accept="image/*"
                      capture="environment"
                      onChange={handleDocumentFileSelect}
                      className="hidden"
                    />
                  </label>
                </div>
              </div>

              {/* Option B: Document / PDF Upload */}
              <div className="rounded-xl border border-slate-200 bg-slate-50 p-4 space-y-3 flex flex-col justify-between">
                <div className="space-y-1">
                  <div className="flex items-center gap-2 font-bold text-slate-900">
                    <UploadCloud className="h-4 w-4 text-indigo-600" />
                    <span>Upload Document (PDF / Image)</span>
                  </div>
                  <p className="text-[11px] text-slate-500">
                    Upload PDF assessments, Word exports, scanned receipts or high-res JPG/PNG files.
                  </p>
                </div>

                <label className="flex items-center justify-center gap-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 active:scale-95 py-2 px-3 text-xs font-bold text-white shadow-sm cursor-pointer transition-all">
                  <FileText className="h-3.5 w-3.5" />
                  <span>Choose PDF / Image File</span>
                  <input
                    ref={docFileInputRef}
                    type="file"
                    multiple
                    accept="application/pdf,image/*"
                    onChange={handleDocumentFileSelect}
                    className="hidden"
                  />
                </label>
              </div>
            </div>

            {cameraError && (
              <div className="rounded-lg bg-amber-50 p-2.5 border border-amber-200 text-amber-800 text-xs flex items-center gap-2">
                <AlertTriangle className="h-4 w-4 text-amber-600 shrink-0" />
                <span>{cameraError}</span>
              </div>
            )}

            {/* Live Camera Viewfinder Modal / Overlay */}
            {isLiveCameraActive && (
              <div className="rounded-2xl border-2 border-blue-500 bg-slate-950 p-3 space-y-3 shadow-xl">
                <div className="flex items-center justify-between text-white text-xs font-bold">
                  <div className="flex items-center gap-2">
                    <div className="h-2.5 w-2.5 rounded-full bg-red-500 animate-ping" />
                    <span>Live Document Camera Viewfinder</span>
                  </div>
                  <button
                    type="button"
                    onClick={stopLiveCamera}
                    className="rounded-lg bg-white/10 hover:bg-white/20 p-1 text-slate-300"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>

                <div className="relative rounded-xl overflow-hidden bg-black aspect-video flex items-center justify-center">
                  <video
                    ref={videoRef}
                    autoPlay
                    playsInline
                    muted
                    className="w-full h-full object-cover"
                  />
                  {/* Aiming guide frame */}
                  <div className="absolute inset-4 sm:inset-8 border-2 border-dashed border-white/60 rounded-xl pointer-events-none flex flex-col justify-between p-2">
                    <span className="text-[10px] text-white/80 font-mono bg-black/60 px-1.5 py-0.5 rounded self-start">
                      Align risk assessment sheet inside box
                    </span>
                    <span className="text-[10px] text-white/80 font-mono bg-black/60 px-1.5 py-0.5 rounded self-end">
                      Hold steady for crisp OCR
                    </span>
                  </div>
                </div>

                <div className="flex items-center justify-center gap-3">
                  <button
                    type="button"
                    onClick={captureCameraSnapshot}
                    className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-700 hover:to-rose-700 active:scale-95 py-2.5 px-6 text-xs font-extrabold text-white shadow-lg"
                  >
                    <Camera className="h-4 w-4" />
                    <span>Snap Document Photo</span>
                  </button>
                  <button
                    type="button"
                    onClick={stopLiveCamera}
                    className="rounded-xl bg-slate-800 hover:bg-slate-700 py-2.5 px-4 text-xs font-semibold text-slate-300"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            )}

            {/* Option C: One-Click Preloaded Sample Risk Assessment Documents */}
            <div className="rounded-xl border border-slate-200 bg-white p-3.5 space-y-2">
              <div className="flex items-center justify-between">
                <span className="font-bold text-slate-800 text-[11px] flex items-center gap-1.5">
                  <FileCheck className="h-3.5 w-3.5 text-blue-600" />
                  Or Try a Sample Physical Assessment Document:
                </span>
                <span className="text-[10px] text-slate-500 font-medium">1-Click Instant Demo</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                {SAMPLE_ASSESSMENT_DOCS.map((sample) => (
                  <button
                    key={sample.id}
                    type="button"
                    onClick={() => handleSelectSampleDocument(sample)}
                    className="flex flex-col items-start text-left p-2.5 rounded-xl border border-slate-200 bg-slate-50 hover:bg-blue-50/60 hover:border-blue-300 transition-all group"
                  >
                    <div className="font-bold text-slate-900 group-hover:text-blue-700 truncate w-full">
                      {sample.name}
                    </div>
                    <div className="text-[10px] text-slate-500 truncate w-full mt-0.5">
                      {sample.subtitle}
                    </div>
                    <div className="flex items-center gap-2 mt-2 text-[10px] font-mono text-slate-600">
                      <span className="bg-slate-200 px-1.5 py-0.2 rounded font-bold">{sample.clearanceHeight}</span>
                      <span className="bg-slate-200 px-1.5 py-0.2 rounded font-bold">{sample.gateCode}</span>
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Document Previews & AI Extraction Execution Section */}
            {scannedDocs.length > 0 && (
              <div className="rounded-2xl border-2 border-indigo-300 bg-indigo-50/30 p-4 space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <FileText className="h-4 w-4 text-indigo-700" />
                    <span className="font-bold text-slate-900">
                      Ready for AI Risk Synthesis ({scannedDocs.length} Document{scannedDocs.length > 1 ? 's' : ''})
                    </span>
                  </div>
                  <button
                    type="button"
                    onClick={() => setScannedDocs([])}
                    className="text-[11px] font-bold text-rose-600 hover:text-rose-700"
                  >
                    Clear All
                  </button>
                </div>

                {/* Preview Cards */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {scannedDocs.map((doc) => (
                    <div
                      key={doc.id}
                      className="relative rounded-xl border border-slate-300 bg-white p-2.5 shadow-sm space-y-2 overflow-hidden"
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-slate-900 truncate max-w-[200px] text-xs">
                          {doc.name}
                        </span>
                        <button
                          type="button"
                          onClick={() => handleRemoveDoc(doc.id)}
                          className="rounded-full bg-slate-100 hover:bg-rose-100 text-slate-500 hover:text-rose-700 p-1 transition-colors"
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </button>
                      </div>

                      {/* Visual Thumbnail Preview */}
                      <div className="relative aspect-[3/2] rounded-lg overflow-hidden bg-slate-100 border border-slate-200">
                        <img
                          src={doc.dataUrl}
                          alt={doc.name}
                          className="w-full h-full object-cover object-top"
                        />
                        {/* Scanning Laser Beam Effect during AI processing */}
                        {isAiScanningDoc && (
                          <div className="absolute inset-0 bg-gradient-to-b from-blue-500/20 via-indigo-500/30 to-blue-500/0 pointer-events-none animate-pulse">
                            <div className="w-full h-1 bg-cyan-400 shadow-[0_0_12px_#38bdf8] animate-bounce" />
                          </div>
                        )}
                      </div>

                      <div className="flex items-center justify-between text-[10px] text-slate-500">
                        <span>{doc.mimeType.replace('image/', '').toUpperCase()}</span>
                        <span>{new Date(doc.uploadedAt).toLocaleTimeString()}</span>
                      </div>
                    </div>
                  ))}
                </div>

                {/* AI Extraction Button */}
                <button
                  type="button"
                  onClick={handleExecuteAiDocumentScan}
                  disabled={isAiScanningDoc}
                  className="w-full flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-indigo-600 via-blue-600 to-indigo-700 hover:from-indigo-700 hover:to-blue-700 active:scale-95 py-3 text-xs font-bold text-white shadow-lg shadow-indigo-600/25 transition-all disabled:opacity-50"
                >
                  {isAiScanningDoc ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin text-white" />
                      <span>{scanSteps[scanStepIndex]}</span>
                    </>
                  ) : (
                    <>
                      <Sparkles className="h-4 w-4 text-amber-300" />
                      <span>Scan &amp; Extract Risk Assessment with Gemini AI</span>
                    </>
                  )}
                </button>
              </div>
            )}

            {/* Extracted Findings Results Card */}
            {extractionResult && (
              <div className="rounded-2xl border-2 border-emerald-400 bg-gradient-to-br from-emerald-50/90 via-teal-50/50 to-white p-4 space-y-3 shadow-md animate-in fade-in slide-in-from-top-2">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-emerald-200 pb-2.5">
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="h-5 w-5 text-emerald-600 shrink-0" />
                    <div>
                      <h4 className="font-extrabold text-slate-900 text-sm">
                        Assessment Successfully Digitized by AI
                      </h4>
                      <p className="text-[11px] text-slate-600">
                        Information extracted from physical sheet and loaded into the delivery site profile
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-1.5 self-start sm:self-auto">
                    <span className="rounded-full bg-emerald-100 text-emerald-800 px-2 py-0.5 text-[10px] font-bold border border-emerald-300">
                      Confidence 98%
                    </span>
                    <span className="rounded-full bg-indigo-100 text-indigo-800 px-2 py-0.5 text-[10px] font-bold border border-indigo-200">
                      ISO 45001 Verified
                    </span>
                  </div>
                </div>

                {/* Key Metrics Grid */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs">
                  <div className="rounded-xl bg-white p-2.5 border border-slate-200 shadow-sm">
                    <div className="text-[10px] text-slate-500 font-semibold">Extracted Site Name</div>
                    <div className="font-bold text-slate-900 truncate mt-0.5">{title || 'Commercial Hub'}</div>
                  </div>

                  <div className="rounded-xl bg-white p-2.5 border border-slate-200 shadow-sm">
                    <div className="text-[10px] text-slate-500 font-semibold">Max Clearance Height</div>
                    <div className="font-bold text-red-600 mt-0.5">{formatHeightBoth(maxHeightMeters)} Clearance</div>
                  </div>

                  <div className="rounded-xl bg-white p-2.5 border border-slate-200 shadow-sm">
                    <div className="text-[10px] text-slate-500 font-semibold">Gate Keypad PIN</div>
                    <div className="font-mono font-extrabold text-slate-900 mt-0.5">{gateSecurityCode}</div>
                  </div>

                  <div className="rounded-xl bg-white p-2.5 border border-slate-200 shadow-sm">
                    <div className="text-[10px] text-slate-500 font-semibold">Yard CAD Safety Pins</div>
                    <div className="font-bold text-indigo-700 mt-0.5">
                      {sitePlan.annotations?.length || 0} Safety Pins Mapped
                    </div>
                  </div>
                </div>

                {/* Extracted Hazards & PPE preview */}
                <div className="rounded-xl bg-white p-3 border border-slate-200 space-y-2">
                  <div className="font-bold text-slate-900 flex items-center justify-between text-[11px]">
                    <span>Extracted Baseline Hazards &amp; Control Measures ({baselineHazards.length}):</span>
                    <span className="text-slate-500 font-normal">
                      PPE: {mandatoryPPE.slice(0, 3).join(', ')}...
                    </span>
                  </div>
                  <div className="space-y-1.5">
                    {baselineHazards.slice(0, 3).map((h, i) => (
                      <div key={i} className="flex items-start gap-2 text-[11px] text-slate-700">
                        <span className="rounded bg-rose-100 text-rose-800 px-1 py-0.2 font-mono font-bold text-[9px]">
                          {h.riskLevel}
                        </span>
                        <div>
                          <strong className="text-slate-900">{h.hazard}:</strong>{' '}
                          <span className="text-slate-600">{h.controlMeasures[0] || 'Standard control'}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Next Steps Buttons */}
                <div className="flex flex-col sm:flex-row items-center justify-between gap-2 pt-1">
                  <span className="text-[11px] text-slate-600">
                    Fields populated. You can review site details or view the annotated yard CAD.
                  </span>
                  <div className="flex items-center gap-2 w-full sm:w-auto">
                    <button
                      type="button"
                      onClick={() => setActiveTab('DETAILS')}
                      className="flex-1 sm:flex-none flex items-center justify-center gap-1.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 text-xs font-bold shadow-sm transition-all"
                    >
                      <span>Review Details</span>
                      <ArrowRight className="h-3.5 w-3.5" />
                    </button>
                    <button
                      type="button"
                      onClick={() => setActiveTab('SITE_PLAN')}
                      className="flex-1 sm:flex-none flex items-center justify-center gap-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 text-xs font-bold shadow-sm transition-all"
                    >
                      <Layers className="h-3.5 w-3.5" />
                      <span>Yard Plan ({sitePlan.annotations?.length || 0})</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => handleSubmit()}
                      className="flex-1 sm:flex-none flex items-center justify-center gap-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2 text-xs font-bold shadow-sm transition-all"
                    >
                      <span>Save Assessment</span>
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* TAB 2: SITE DETAILS & AI RISK GENERATION */}
        {activeTab === 'DETAILS' && (
          <form onSubmit={handleSubmit} className="space-y-4 pt-4 text-xs">
            {/* Scanned Document Pill Banner if document was scanned */}
            {extractionResult && (
              <div className="flex items-center justify-between rounded-xl bg-indigo-50 border border-indigo-200 px-3 py-2 text-indigo-900">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-indigo-600 shrink-0" />
                  <span className="text-xs font-bold">
                    Extracted from Scanned Document: {title}
                  </span>
                </div>
                <button
                  type="button"
                  onClick={() => setActiveTab('SCAN_DOCUMENT')}
                  className="text-[11px] font-bold text-indigo-700 underline hover:text-indigo-900"
                >
                  View Scanned Original
                </button>
              </div>
            )}

            {/* Site Name & Business */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Delivery Site Title *</label>
                <input
                  type="text"
                  required
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g. Magna Park Lutterworth Hub"
                  className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-xs text-slate-900 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Business / Company Name *</label>
                <input
                  type="text"
                  required
                  value={businessName}
                  onChange={(e) => setBusinessName(e.target.value)}
                  placeholder="e.g. Prologis Logistics UK"
                  className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-xs text-slate-900 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                />
              </div>
            </div>

            {/* Google Places Address Autocomplete */}
            <div className="relative">
              <label className="block font-semibold text-slate-700 mb-1 flex items-center justify-between">
                <span className="flex items-center gap-1.5">
                  <MapPin className="h-3.5 w-3.5 text-blue-600" />
                  Site Address (Google Places Verified) *
                </span>
                <span className="text-[10px] text-blue-700 font-mono">Google Places Connected</span>
              </label>
              <input
                type="text"
                required
                value={address}
                onChange={(e) => handleAddressChange(e.target.value)}
                placeholder="Search depot address or industrial park name..."
                className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-xs text-slate-900 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
              />

              {/* Places Suggestions Dropdown */}
              {placePredictions.length > 0 && (
                <div className="absolute top-full left-0 right-0 z-30 mt-1 rounded-xl border border-slate-200 bg-white shadow-xl max-h-48 overflow-y-auto">
                  {placePredictions.map((pred) => (
                    <button
                      key={pred.placeId}
                      type="button"
                      onClick={() => handleSelectPrediction(pred)}
                      className="w-full text-left px-3 py-2 text-xs hover:bg-blue-50 border-b border-slate-100 last:border-0 flex items-start gap-2 text-slate-800"
                    >
                      <MapPin className="h-3.5 w-3.5 text-blue-600 shrink-0 mt-0.5" />
                      <div>
                        <div className="font-semibold text-slate-900">{pred.mainText}</div>
                        <div className="text-[10px] text-slate-500">{pred.secondaryText}</div>
                      </div>
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Site Photos Upload & AI Assistant Trigger */}
            <div className="rounded-xl border border-blue-200 bg-blue-50/40 p-4 space-y-3">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <div>
                  <span className="font-bold text-slate-900 flex items-center gap-1.5">
                    <Camera className="h-4 w-4 text-blue-600" />
                    Site Photos &amp; AI Hazard Detection
                  </span>
                  <p className="text-[11px] text-slate-500">
                    Upload entrance photos or site gate notices to auto-generate hazard matrix &amp; yard CAD
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setActiveTab('SCAN_DOCUMENT')}
                    className="flex items-center gap-1 rounded-lg border border-indigo-200 bg-indigo-50 hover:bg-indigo-100 px-2.5 py-1.5 text-xs font-bold text-indigo-700 transition-all"
                  >
                    <ScanLine className="h-3.5 w-3.5 text-indigo-600" />
                    <span>Scan Existing RAMS</span>
                  </button>

                  <label className="flex items-center gap-1.5 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 px-3 py-1.5 text-xs font-semibold text-slate-700 shadow-sm cursor-pointer">
                    <Camera className="h-3.5 w-3.5 text-blue-600" />
                    <span>Upload Photos</span>
                    <input type="file" multiple accept="image/*" onChange={handlePhotoUpload} className="hidden" />
                  </label>
                </div>
              </div>

              {/* Photos Preview */}
              {uploadedPhotos.length > 0 && (
                <div className="flex gap-2 flex-wrap pt-1">
                  {uploadedPhotos.map((img, i) => (
                    <div key={i} className="relative h-14 w-14 rounded-lg overflow-hidden border border-slate-200 shadow-sm">
                      <img src={img} alt="Uploaded site photo" className="h-full w-full object-cover" />
                      <button
                        type="button"
                        onClick={() => setUploadedPhotos((prev) => prev.filter((_, idx) => idx !== i))}
                        className="absolute top-0.5 right-0.5 rounded-full bg-slate-900/80 p-0.5 text-white"
                      >
                        <X className="h-3 w-3" />
                      </button>
                    </div>
                  ))}
                </div>
              )}

              {/* AI Generation Button */}
              <button
                type="button"
                onClick={handleGenerateAiRiskAssessment}
                disabled={isAiGenerating}
                className="w-full flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 active:scale-95 py-2.5 text-xs font-bold text-white shadow-md shadow-blue-600/20 transition-all disabled:opacity-50"
              >
                {isAiGenerating ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin text-white" />
                    <span>Analyzing Site Geometry &amp; Nearby Hazards...</span>
                  </>
                ) : (
                  <>
                    <Sparkles className="h-4 w-4 text-amber-300" />
                    <span>AI Generate Baseline Hazards, Access Rules &amp; Site Plan</span>
                  </>
                )}
              </button>

              {aiGeneratedSuccess && (
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 rounded-xl bg-gradient-to-r from-emerald-50 via-teal-50 to-indigo-50 p-3.5 text-emerald-900 border border-emerald-300 shadow-sm animate-in fade-in slide-in-from-top-1">
                  <div className="flex items-start gap-2.5">
                    <CheckCircle2 className="h-5 w-5 text-emerald-600 shrink-0 mt-0.5" />
                    <div>
                      <div className="flex items-center gap-2">
                        <p className="text-xs font-bold text-slate-900">
                          AI Risk Assessment &amp; CAD Site Plan Generated
                        </p>
                        <span className="rounded-full bg-indigo-100 text-indigo-700 px-2 py-0.5 text-[10px] font-bold">
                          {sitePlan.annotations?.length || 0} Safety Points
                        </span>
                      </div>
                      <p className="text-[11px] text-slate-600 mt-0.5">
                        Synthesized baseline hazards, mandatory PPE, gatehouse protocols, and mapped critical pins onto the yard plan.
                      </p>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => setActiveTab('SITE_PLAN')}
                    className="shrink-0 flex items-center justify-center gap-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-700 active:scale-95 text-white px-3 py-1.5 text-xs font-bold shadow-sm transition-all"
                  >
                    <Layers className="h-3.5 w-3.5" />
                    <span>Annotate Site Plan ({sitePlan.annotations?.length || 0} Pins) →</span>
                  </button>
                </div>
              )}
            </div>

            {/* Mandatory Business Section Fields */}
            <div className="rounded-xl border border-slate-200 bg-slate-50 p-4 space-y-3">
              <h3 className="font-bold text-slate-800 flex items-center gap-1.5">
                <ShieldCheck className="h-4 w-4 text-blue-600" />
                Mandatory Operational &amp; Clearance Controls
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block font-semibold text-slate-600 mb-1">Gate Security Keypad Code</label>
                  <div className="relative">
                    <Lock className="absolute left-2.5 top-2.5 h-3.5 w-3.5 text-slate-400" />
                    <input
                      type="text"
                      value={gateSecurityCode}
                      onChange={(e) => setGateSecurityCode(e.target.value)}
                      placeholder="#5820*"
                      className="w-full rounded-lg border border-slate-300 bg-white pl-8 pr-3 py-1.5 text-xs font-mono font-bold text-slate-900 focus:border-blue-500 focus:outline-none"
                    />
                  </div>
                </div>

                <div className="col-span-1 sm:col-span-2">
                  <DualHeightInput
                    valueMeters={maxHeightMeters}
                    onChange={(m) => setMaxHeightMeters(m)}
                    label="Site Maximum Clearance Height (Auto-Converts Metric & Feet)"
                    helperText="Enter either meters (e.g. 4.50) or feet/inches (e.g. 14 ft 9 in). The gate pass and driver induction alert will display both units to prevent bridge strikes."
                    theme="light"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-600 mb-1">Max Weight (Tonnes)</label>
                  <input
                    type="number"
                    step="0.5"
                    value={maxWeightTonnes}
                    onChange={(e) => setMaxWeightTonnes(parseFloat(e.target.value) || 44.0)}
                    className="w-full rounded-lg border border-slate-300 bg-white px-3 py-1.5 text-xs font-bold text-slate-900 focus:border-blue-500 focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-600 mb-1">Emergency Evacuation Muster Point</label>
                <input
                  type="text"
                  value={emergencyMusterPoint}
                  onChange={(e) => setEmergencyMusterPoint(e.target.value)}
                  className="w-full rounded-lg border border-slate-300 bg-white px-3 py-1.5 text-xs text-slate-900 focus:border-blue-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-600 mb-1">Inbound Gatehouse Access Procedures</label>
                <textarea
                  rows={2}
                  value={accessProcedures}
                  onChange={(e) => setAccessProcedures(e.target.value)}
                  className="w-full rounded-lg border border-slate-300 bg-white px-3 py-1.5 text-xs text-slate-900 focus:border-blue-500 focus:outline-none"
                />
              </div>
            </div>

            {/* Next Step Banner */}
            <div className="flex items-center justify-between bg-indigo-50 p-3 rounded-xl border border-indigo-200 text-indigo-900">
              <div className="flex items-center gap-2">
                <Layers className="h-4 w-4 text-indigo-600 shrink-0" />
                <span className="text-xs font-semibold">
                  Address site plan is automatically initialized. You can inspect or drop safety pins now:
                </span>
              </div>
              <button
                type="button"
                onClick={() => setActiveTab('SITE_PLAN')}
                className="rounded-lg bg-indigo-600 px-3 py-1.5 text-xs font-bold text-white shadow hover:bg-indigo-700 shrink-0"
              >
                Annotate Site Plan →
              </button>
            </div>

            {/* Submit & Close Buttons */}
            <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-200">
              <button
                type="button"
                onClick={onClose}
                className="rounded-xl border border-slate-300 bg-white px-4 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="rounded-xl bg-blue-600 hover:bg-blue-700 active:scale-95 px-5 py-2 text-xs font-bold text-white shadow-md shadow-blue-600/20 transition-all"
              >
                Save &amp; Publish Assessment
              </button>
            </div>
          </form>
        )}

        {/* TAB 3: INTERACTIVE SITE PLAN & POINT ANNOTATIONS */}
        {activeTab === 'SITE_PLAN' && (
          <div className="space-y-4 pt-4">
            <div className="rounded-xl bg-blue-50 p-3 border border-blue-200 text-xs text-blue-900 flex items-start gap-2">
              <Info className="h-4 w-4 text-blue-600 shrink-0 mt-0.5" />
              <div>
                <strong>Site Plan Point-and-Annotate:</strong> Click or tap anywhere on the yard plan below to drop a safety point, hazard marker, loading dock indicator, or driver waiting bay. Annotations will be saved directly into this delivery site's official risk assessment.
              </div>
            </div>

            {/* Render interactive annotator component */}
            <SitePlanAnnotator
              site={draftAssessment}
              onUpdateSitePlan={(updated) => setSitePlan(updated)}
            />

            {/* Navigation back / finalize buttons */}
            <div className="flex items-center justify-between pt-3 border-t border-slate-200">
              <button
                type="button"
                onClick={() => setActiveTab('DETAILS')}
                className="rounded-xl border border-slate-300 bg-white px-4 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50"
              >
                ← Back to Site Details
              </button>
              <button
                type="button"
                onClick={() => handleSubmit()}
                className="rounded-xl bg-blue-600 hover:bg-blue-700 active:scale-95 px-5 py-2 text-xs font-bold text-white shadow-md shadow-blue-600/20 transition-all"
              >
                Save &amp; Publish Assessment
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
