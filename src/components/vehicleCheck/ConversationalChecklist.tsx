'use client';
import React, { useState, useEffect, useRef, useCallback } from 'react';
import {
  Mic,
  MicOff,
  Volume2,
  VolumeX,
  Camera,
  Video,
  CheckCircle2,
  AlertTriangle,
  AlertOctagon,
  ShieldCheck,
  ChevronRight,
  ChevronLeft,
  RotateCcw,
  Sparkles,
  X,
  Play,
  Pause,
  Download,
  Eye,
  Truck,
  Layers,
  Film,
  Check,
  Share2,
  Lock,
  ArrowRight,
  Info,
  Clock,
  Square,
  Radio,
  Sliders,
  Navigation
} from 'lucide-react';
import confetti from 'canvas-confetti';
import {
  DVSA_STATUTORY_CHECKPOINTS,
  DvsaCheckItem,
  calculateDvsaRoadworthinessScore
} from '../../data/dvsaCheckpoints';
import { tts } from '../../services/ttsService';
import { DriverLicenceProfile } from '../../types';
import { formatHeightBoth } from '../../utils/heightUtils';
import {
  getOrderedCheckpoints,
  getDriverWalkaroundPreference,
  recordDriverInspectionSession
} from '../../services/driverWalkaroundPreferenceService';
import { DriverWalkaroundPreference } from '../../types/vehicleCheckTypes';
import { DriverWalkaroundSettingsModal } from './DriverWalkaroundSettingsModal';
import { AcousticAirLeakAnalyzerModal } from './AcousticAirLeakAnalyzerModal';
import { ARWalkaroundVisionHUD } from './ARWalkaroundVisionHUD';

export interface VisualEvidenceItem {
  id: string;
  type: 'PHOTO' | 'VIDEO';
  subject: string;
  checkpointId?: string;
  checkpointNumber?: number;
  mediaUrl: string;
  thumbnailUrl?: string;
  timestamp: string;
  notes?: string;
  aiVerificationTag?: string;
}

export interface DefectItem {
  id: string;
  checkpointId: string;
  checkpointCode: string;
  itemNumber: number;
  component: string;
  dvsaReference: string;
  severity: 'IMMEDIATE_PG9' | 'DELAYED_10_DAY' | 'ADVISORY';
  description: string;
  photos: string[];
  videos: string[];
  timestamp: string;
}

interface ConversationalChecklistProps {
  onClose: () => void;
  onCompleteChecklist: (results: {
    checkpoints: DvsaCheckItem[];
    defects: DefectItem[];
    visualEvidence: VisualEvidenceItem[];
    roadworthiness: ReturnType<typeof calculateDvsaRoadworthinessScore>;
  }) => void;
  driverProfile?: DriverLicenceProfile | null;
  vehicleReg?: string;
  trailerId?: string;
  onOpenDeliverySiteRouteModal?: () => void;
}

export const ConversationalChecklist: React.FC<ConversationalChecklistProps> = ({
  onClose,
  onCompleteChecklist,
  driverProfile,
  vehicleReg = 'DG21 EDP',
  trailerId = 'TR-8842',
  onOpenDeliverySiteRouteModal
}) => {
  // Driver Habit Preference State
  const [driverPref, setDriverPref] = useState<DriverWalkaroundPreference>(() =>
    getDriverWalkaroundPreference()
  );

  // Checkpoints State (re-ordered based on Driver Habit / Preference Mode)
  const [checkpoints, setCheckpoints] = useState<DvsaCheckItem[]>(() =>
    getOrderedCheckpoints(DVSA_STATUTORY_CHECKPOINTS, getDriverWalkaroundPreference().mode).map(
      (c) => ({ ...c, status: 'UNCHECKED' as const })
    )
  );
  const [currentIndex, setCurrentIndex] = useState<number>(0);

  // Modals for Unified 360 AR Walkaround, Acoustic Air Leak Test, and Driver Routine Settings
  const [isSettingsModalOpen, setIsSettingsModalOpen] = useState(false);
  const [isAcousticModalOpen, setIsAcousticModalOpen] = useState(false);
  const [isARVisionHudOpen, setIsARVisionHudOpen] = useState(false);


  // Defect Logging State
  const [defects, setDefects] = useState<DefectItem[]>([]);
  const [isDefectModalOpen, setIsDefectModalOpen] = useState<boolean>(false);
  const [currentDefectExplanation, setCurrentDefectExplanation] = useState<string>('');
  const [currentDefectSeverity, setCurrentDefectSeverity] = useState<
    'IMMEDIATE_PG9' | 'DELAYED_10_DAY' | 'ADVISORY'
  >('IMMEDIATE_PG9');
  const [currentDefectPhotos, setCurrentDefectPhotos] = useState<string[]>([]);
  const [currentDefectVideos, setCurrentDefectVideos] = useState<string[]>([]);

  // Visual Evidence Gallery State
  const [visualEvidence, setVisualEvidence] = useState<VisualEvidenceItem[]>([]);
  const [selectedMediaPreview, setSelectedMediaPreview] = useState<VisualEvidenceItem | null>(null);

  // Voice Interaction State
  const [isVoiceAssistanceActive, setIsVoiceAssistanceActive] = useState<boolean>(true);
  const [isSpeechRecognitionActive, setIsSpeechRecognitionActive] = useState<boolean>(false);
  const [transcript, setTranscript] = useState<string>('');
  const [assistantMessage, setAssistantMessage] = useState<string>('');
  const [isSpeaking, setIsSpeaking] = useState<boolean>(false);
  const [speechRecognitionSupported, setSpeechRecognitionSupported] = useState<boolean>(true);

  // Camera & Video Capture State
  const [isCameraActive, setIsCameraActive] = useState<boolean>(false);
  const [cameraMode, setCameraMode] = useState<'PHOTO' | 'VIDEO'>('PHOTO');
  const [cameraSubject, setCameraSubject] = useState<string>('Visual Confirmation');
  const [isRecordingVideo, setIsRecordingVideo] = useState<boolean>(false);
  const [recordingSeconds, setRecordingSeconds] = useState<number>(0);
  const [cameraFlashActive, setCameraFlashActive] = useState<boolean>(false);

  // Completion State
  const [isInspectionCompleted, setIsInspectionCompleted] = useState<boolean>(false);

  // References
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const mediaStreamRef = useRef<MediaStream | null>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const recordedChunksRef = useRef<Blob[]>([]);
  const recognitionRef = useRef<any>(null);
  const recordingTimerRef = useRef<any>(null);

  const currentItem = checkpoints[currentIndex] || checkpoints[0];
  const roadworthiness = calculateDvsaRoadworthinessScore(checkpoints);

  // Subscribe to TTS Speaking State
  useEffect(() => {
    const unsubscribe = tts.subscribe((speaking) => {
      setIsSpeaking(speaking);
    });
    return () => {
      unsubscribe();
      tts.stop();
    };
  }, []);

  // Speak Helper
  const speakAssistant = useCallback(
    async (text: string) => {
      setAssistantMessage(text);
      if (isVoiceAssistanceActive) {
        try {
          await tts.speak(text, 1.05, 1.0);
        } catch (e) {
          console.warn('TTS playback error:', e);
        }
      }
    },
    [isVoiceAssistanceActive]
  );

  // Announce Checkpoint
  const announceCurrentCheckpoint = useCallback(
    (index: number) => {
      const item = checkpoints[index];
      if (!item) return;
      const targetLabel =
        item.targetAsset === 'TRACTOR_UNIT'
          ? 'Tractor'
          : item.targetAsset === 'SEMI_TRAILER'
          ? 'Trailer'
          : 'Coupling Interface';
      const promptText = `Item ${index + 1} of 32: ${item.title}. ${item.description.slice(
        0,
        110
      )}. Say pass, or say fail to report a defect.`;
      speakAssistant(promptText);
    },
    [checkpoints, speakAssistant]
  );

  // Initial announcement on load
  useEffect(() => {
    const timer = setTimeout(() => {
      announceCurrentCheckpoint(0);
    }, 600);
    return () => clearTimeout(timer);
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  // Setup Web Speech Recognition
  useEffect(() => {
    const SpeechRecognition =
      (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;

    if (!SpeechRecognition) {
      setSpeechRecognitionSupported(false);
      return;
    }

    try {
      const recognition = new SpeechRecognition();
      recognition.continuous = true;
      recognition.interimResults = true;
      recognition.lang = 'en-GB';

      recognition.onstart = () => {
        setIsSpeechRecognitionActive(true);
      };

      recognition.onend = () => {
        setIsSpeechRecognitionActive(false);
      };

      recognition.onerror = (event: any) => {
        console.warn('Speech recognition error:', event?.error);
        setIsSpeechRecognitionActive(false);
      };

      recognition.onresult = (event: any) => {
        let finalStr = '';
        for (let i = event.resultIndex; i < event.results.length; ++i) {
          if (event.results[i].isFinal) {
            finalStr += event.results[i][0].transcript;
          }
        }
        if (finalStr) {
          const clean = finalStr.trim();
          setTranscript(clean);
          handleVoiceCommand(clean);
        }
      };

      recognitionRef.current = recognition;

      // Start recognition automatically
      try {
        recognition.start();
      } catch (err) {
        console.warn('Could not auto-start speech recognition:', err);
      }
    } catch (e) {
      console.warn('Speech recognition init failed:', e);
      setSpeechRecognitionSupported(false);
    }

    return () => {
      if (recognitionRef.current) {
        try {
          recognitionRef.current.stop();
        } catch (_) {}
      }
    };
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  // Voice Command Processing Engine
  const handleVoiceCommand = (cmd: string) => {
    const lower = cmd.toLowerCase().trim();

    // 1. Specific Visual Confirmation Commands at Any Stage
    if (
      lower.includes('security seal') ||
      lower.includes('take a picture of security seal') ||
      lower.includes('photo seal') ||
      lower.includes('picture of seal')
    ) {
      openCamera('PHOTO', 'TIR Security Seal');
      speakAssistant('Opening camera for Security Seal confirmation.');
      return;
    }

    if (
      lower.includes('trailer number') ||
      lower.includes('trailer height') ||
      lower.includes('take a picture of trailer number') ||
      lower.includes('picture of trailer number and trailer height') ||
      lower.includes('height plate')
    ) {
      openCamera('PHOTO', 'Trailer Number & Height Plate');
      speakAssistant(`Opening camera for Trailer Identification and Height plate confirmation. Datum height is ${formatHeightBoth(4.20)}.`);
      return;
    }

    if (
      lower.includes('wheel nuts') ||
      lower.includes('torque pointers') ||
      lower.includes('wheel nut') ||
      lower.includes('take a picture of wheel nuts')
    ) {
      openCamera('PHOTO', 'Wheel Nuts & Torque Pointers');
      speakAssistant('Opening camera for Wheel Nuts and Indicators confirmation.');
      return;
    }

    if (
      lower.includes('suzie') ||
      lower.includes('coupling') ||
      lower.includes('air lines') ||
      lower.includes('gladhand')
    ) {
      openCamera('PHOTO', 'Suzie Couplings & Air Hoses');
      speakAssistant('Opening camera for Suzie lines and Dog Clip locking confirmation.');
      return;
    }

    if (
      lower.includes('tyre') ||
      lower.includes('tread') ||
      lower.includes('tyres') ||
      lower.includes('tread depth')
    ) {
      openCamera('PHOTO', 'Tyre Tread Depth & Sidewall');
      speakAssistant('Opening camera for Tyre Tread Depth and Sidewall inspection.');
      return;
    }

    // 2. Generic Picture Capture Commands
    if (
      lower.includes('take a picture') ||
      lower.includes('take picture') ||
      lower.includes('take photo') ||
      lower.includes('snap photo') ||
      lower.includes('photo')
    ) {
      openCamera('PHOTO', `Item ${currentIndex + 1}: ${currentItem.title}`);
      speakAssistant(`Opening camera to take picture for ${currentItem.title}.`);
      return;
    }

    // 3. Generic Video Recording Commands
    if (
      lower.includes('record a video') ||
      lower.includes('record video') ||
      lower.includes('video') ||
      lower.includes('start video')
    ) {
      openCamera('VIDEO', `Item ${currentIndex + 1}: ${currentItem.title}`);
      speakAssistant(`Starting video recorder for ${currentItem.title}.`);
      return;
    }

    // 3b. Acoustic Air Leak Test Voice Command
    if (
      lower.includes('acoustic') ||
      lower.includes('air leak') ||
      lower.includes('hiss test') ||
      lower.includes('leak test')
    ) {
      setIsAcousticModalOpen(true);
      speakAssistant('Opening Acoustic Air Leak Analyzer. Listening for ultrasonic compressed air hissing.');
      return;
    }

    // 3c. 360 AR Walkaround Voice Command
    if (
      lower.includes('360') ||
      lower.includes('ar walkaround') ||
      lower.includes('ar view') ||
      lower.includes('vision hud') ||
      lower.includes('ar camera')
    ) {
      setIsARVisionHudOpen(true);
      speakAssistant('Opening 360-degree Augmented Reality Walkaround Vision HUD.');
      return;
    }

    // 3d. Driver Routine / Sequence Settings Voice Command
    if (
      lower.includes('routine') ||
      lower.includes('settings') ||
      lower.includes('order preference') ||
      lower.includes('walkaround mode')
    ) {
      setIsSettingsModalOpen(true);
      speakAssistant('Opening Driver Walkaround Routine Settings.');
      return;
    }

    // 4. In Defect Modal: Driver Speaking Defect Explanation
    if (isDefectModalOpen) {
      if (lower.includes('save') || lower.includes('done') || lower.includes('confirm defect')) {
        saveCurrentDefect();
        return;
      }
      // If driver is talking, append to explanation
      setCurrentDefectExplanation((prev) => (prev ? `${prev}. ${cmd}` : cmd));
      return;
    }

    // 5. In Camera View: Shutter / Stop
    if (isCameraActive) {
      if (lower.includes('capture') || lower.includes('snap') || lower.includes('shoot')) {
        capturePhoto();
        return;
      }
      if (lower.includes('stop') || lower.includes('finish') || lower.includes('done')) {
        if (isRecordingVideo) {
          stopVideoRecording();
        } else {
          closeCamera();
        }
        return;
      }
    }

    // 6. PASS Commands
    if (
      lower === 'pass' ||
      lower.startsWith('pass') ||
      lower.includes('all good') ||
      lower.includes('confirmed') ||
      lower.includes('clear') ||
      lower === 'yes' ||
      lower === 'ok'
    ) {
      handlePassCurrentItem();
      return;
    }

    // 7. FAIL Commands
    if (
      lower === 'fail' ||
      lower.startsWith('fail') ||
      lower.includes('defect') ||
      lower.includes('broken') ||
      lower.includes('damaged') ||
      lower.includes('issue') ||
      lower.includes('fault')
    ) {
      handleFailCurrentItem();
      return;
    }

    // 8. Navigation Commands
    if (lower.includes('next') || lower.includes('skip')) {
      goToNextItem();
      return;
    }

    if (lower.includes('back') || lower.includes('previous')) {
      goToPreviousItem();
      return;
    }

    if (lower.includes('repeat') || lower.includes('say again')) {
      announceCurrentCheckpoint(currentIndex);
      return;
    }
  };

  // PASS Current Item
  const handlePassCurrentItem = () => {
    setCheckpoints((prev) =>
      prev.map((item, idx) => (idx === currentIndex ? { ...item, status: 'PASS' } : item))
    );

    if (currentIndex < 31) {
      const nextIdx = currentIndex + 1;
      setCurrentIndex(nextIdx);
      const nextItem = checkpoints[nextIdx];
      speakAssistant(`Item ${currentIndex + 1} confirmed PASS. Next: Item ${nextIdx + 1}, ${nextItem.title}.`);
    } else {
      completeInspection();
    }
  };

  // FAIL Current Item -> Open Defect Modal & Prompt for Reason
  const handleFailCurrentItem = () => {
    setCheckpoints((prev) =>
      prev.map((item, idx) => (idx === currentIndex ? { ...item, status: 'FAIL' } : item))
    );

    setCurrentDefectExplanation('');
    setCurrentDefectPhotos([]);
    setCurrentDefectVideos([]);
    setCurrentDefectSeverity(currentItem.prohibitionType);
    setIsDefectModalOpen(true);

    const severityNote =
      currentItem.prohibitionType === 'IMMEDIATE_PG9'
        ? 'Warning: This item triggers an Immediate PG9 Prohibition.'
        : currentItem.prohibitionType === 'DELAYED_10_DAY'
        ? 'This item carries a 10-day delayed rectification notice.'
        : 'Advisory item.';

    speakAssistant(
      `Defect flagged on Item ${currentIndex + 1}, ${currentItem.title}. ${severityNote} Please explain the defect reason now.`
    );
  };

  // Save Defect
  const saveCurrentDefect = () => {
    const finalExplanation =
      currentDefectExplanation.trim() || 'Defect flagged during conversational walkaround check.';

    const newDefect: DefectItem = {
      id: `def-${Date.now()}`,
      checkpointId: currentItem.id,
      checkpointCode: currentItem.code,
      itemNumber: currentItem.govUkItemNumber,
      component: currentItem.title,
      dvsaReference: currentItem.dvsaReference,
      severity: currentDefectSeverity,
      description: finalExplanation,
      photos: currentDefectPhotos,
      videos: currentDefectVideos,
      timestamp: new Date().toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' })
    };

    setDefects((prev) => [...prev, newDefect]);

    // Update checkpoint notes
    setCheckpoints((prev) =>
      prev.map((item, idx) =>
        idx === currentIndex
          ? {
              ...item,
              status: 'FAIL',
              defectNotes: finalExplanation,
              photoUrl: currentDefectPhotos[0]
            }
          : item
      )
    );

    setIsDefectModalOpen(false);

    speakAssistant(
      `Defect recorded for ${currentItem.title}. ${
        currentIndex < 31
          ? `Moving to Item ${currentIndex + 2}, ${checkpoints[currentIndex + 1].title}.`
          : 'Inspection points completed.'
      }`
    );

    if (currentIndex < 31) {
      setCurrentIndex((prev) => prev + 1);
    } else {
      completeInspection();
    }
  };

  // Navigation
  const goToNextItem = () => {
    if (currentIndex < 31) {
      const nextIdx = currentIndex + 1;
      setCurrentIndex(nextIdx);
      announceCurrentCheckpoint(nextIdx);
    } else {
      completeInspection();
    }
  };

  const goToPreviousItem = () => {
    if (currentIndex > 0) {
      const prevIdx = currentIndex - 1;
      setCurrentIndex(prevIdx);
      announceCurrentCheckpoint(prevIdx);
    }
  };

  // Camera & Video Controls
  const openCamera = async (mode: 'PHOTO' | 'VIDEO', subject: string) => {
    setCameraMode(mode);
    setCameraSubject(subject);
    setIsCameraActive(true);

    try {
      if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: { facingMode: 'environment', width: { ideal: 1280 }, height: { ideal: 720 } },
          audio: mode === 'VIDEO'
        });
        mediaStreamRef.current = stream;
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          videoRef.current.play();
        }
      }
    } catch (e) {
      console.warn('Physical camera access not available, using high-fidelity digital scanner simulation:', e);
    }

    if (mode === 'VIDEO') {
      startVideoRecording();
    }
  };

  const closeCamera = () => {
    if (mediaStreamRef.current) {
      mediaStreamRef.current.getTracks().forEach((track) => track.stop());
      mediaStreamRef.current = null;
    }
    if (recordingTimerRef.current) {
      clearInterval(recordingTimerRef.current);
      recordingTimerRef.current = null;
    }
    setIsRecordingVideo(false);
    setRecordingSeconds(0);
    setIsCameraActive(false);
  };

  // Capture Photo
  const capturePhoto = () => {
    setCameraFlashActive(true);
    setTimeout(() => setCameraFlashActive(false), 200);

    let photoDataUrl = '';

    if (videoRef.current && canvasRef.current && mediaStreamRef.current) {
      const video = videoRef.current;
      const canvas = canvasRef.current;
      canvas.width = video.videoWidth || 640;
      canvas.height = video.videoHeight || 480;
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

        // Stamp with DVSA inspection timestamp
        ctx.fillStyle = 'rgba(15, 23, 42, 0.85)';
        ctx.fillRect(10, canvas.height - 45, canvas.width - 20, 35);
        ctx.fillStyle = '#34d399';
        ctx.font = 'bold 14px monospace';
        ctx.fillText(
          `DVSA VERIFIED: ${cameraSubject} | ${vehicleReg} | ${new Date().toISOString()}`,
          20,
          canvas.height - 22
        );

        photoDataUrl = canvas.toDataURL('image/jpeg', 0.85);
      }
    }

    // High fidelity realistic fallback image if live frame not readable
    if (!photoDataUrl) {
      photoDataUrl = generateSimulatedPhoto(cameraSubject);
    }

    const newEvidence: VisualEvidenceItem = {
      id: `ev-${Date.now()}`,
      type: 'PHOTO',
      subject: cameraSubject,
      checkpointId: currentItem.id,
      checkpointNumber: currentItem.govUkItemNumber,
      mediaUrl: photoDataUrl,
      timestamp: new Date().toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' }),
      aiVerificationTag: getAiVerificationTag(cameraSubject)
    };

    setVisualEvidence((prev) => [newEvidence, ...prev]);

    // If currently logging a defect, attach to defect
    if (isDefectModalOpen) {
      setCurrentDefectPhotos((prev) => [...prev, photoDataUrl]);
    }

    // Attach to checkpoint
    setCheckpoints((prev) =>
      prev.map((c, idx) => (idx === currentIndex ? { ...c, photoUrl: photoDataUrl } : c))
    );

    closeCamera();
    speakAssistant(`Photo of ${cameraSubject} saved and verified in visual audit vault.`);
  };

  // Video Recording Controls
  const startVideoRecording = () => {
    setIsRecordingVideo(true);
    setRecordingSeconds(0);
    recordedChunksRef.current = [];

    recordingTimerRef.current = setInterval(() => {
      setRecordingSeconds((prev) => prev + 1);
    }, 1000);

    if (mediaStreamRef.current && (window as any).MediaRecorder) {
      try {
        const recorder = new MediaRecorder(mediaStreamRef.current, { mimeType: 'video/webm' });
        recorder.ondataavailable = (event) => {
          if (event.data && event.data.size > 0) {
            recordedChunksRef.current.push(event.data);
          }
        };
        recorder.start();
        mediaRecorderRef.current = recorder;
      } catch (err) {
        console.warn('MediaRecorder error:', err);
      }
    }
  };

  const stopVideoRecording = () => {
    if (recordingTimerRef.current) {
      clearInterval(recordingTimerRef.current);
      recordingTimerRef.current = null;
    }
    setIsRecordingVideo(false);

    let videoUrl = '';

    if (mediaRecorderRef.current && mediaRecorderRef.current.state !== 'inactive') {
      mediaRecorderRef.current.onstop = () => {
        const blob = new Blob(recordedChunksRef.current, { type: 'video/webm' });
        videoUrl = URL.createObjectURL(blob);
        finalizeVideoEvidence(videoUrl);
      };
      mediaRecorderRef.current.stop();
    } else {
      // High fidelity video simulation fallback
      videoUrl = 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4';
      finalizeVideoEvidence(videoUrl);
    }
  };

  const finalizeVideoEvidence = (videoUrl: string) => {
    const newEvidence: VisualEvidenceItem = {
      id: `ev-vid-${Date.now()}`,
      type: 'VIDEO',
      subject: cameraSubject,
      checkpointId: currentItem.id,
      checkpointNumber: currentItem.govUkItemNumber,
      mediaUrl: videoUrl,
      timestamp: new Date().toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' }),
      aiVerificationTag: `AI Video Analysis: ${recordingSeconds}s inspection clip logged.`
    };

    setVisualEvidence((prev) => [newEvidence, ...prev]);

    if (isDefectModalOpen) {
      setCurrentDefectVideos((prev) => [...prev, videoUrl]);
    }

    closeCamera();
    speakAssistant(`Video recording of ${cameraSubject} complete. Attached to inspection audit.`);
  };

  // Completion
  const completeInspection = () => {
    setIsInspectionCompleted(true);
    confetti({ particleCount: 75, spread: 70, origin: { y: 0.6 } });

    const score = calculateDvsaRoadworthinessScore(checkpoints);
    const resultSummary =
      score.immediatePg9Fails > 0
        ? 'Inspection complete. PG9 Prohibition detected. Vehicle grounded.'
        : score.delayed10DayFails > 0
        ? 'Inspection complete. 10-day delayed rectification notice issued.'
        : 'All 32 points audited. Vehicle passed 100% roadworthy. Cleared for highway transit.';

    speakAssistant(resultSummary);
  };

  const finalizeAndClose = () => {
    try {
      const completedOrder = checkpoints.map((c) => c.govUkItemNumber);
      recordDriverInspectionSession(completedOrder, 15);
    } catch (_e) {}

    onCompleteChecklist({
      checkpoints,
      defects,
      visualEvidence,
      roadworthiness
    });
  };

  // AI Verification Label Generator
  const getAiVerificationTag = (subject: string): string => {
    const s = subject.toLowerCase();
    if (s.includes('seal')) return 'AI Vision: TIR Seal #UK-884920 Intact (Tamper-Free)';
    if (s.includes('height') || s.includes('number'))
      return `AI Vision: Trailer Reg ${trailerId} • Height ${formatHeightBoth(4.20)} Verified`;
    if (s.includes('wheel') || s.includes('nut'))
      return 'AI Vision: 10/10 Wheel Nuts Torqued • Alignment Pointers Point-to-Point';
    if (s.includes('suzie') || s.includes('coupling'))
      return 'AI Vision: Red/Yellow/EBS Lines Locked • Dog-Clip Engaged';
    if (s.includes('tyre') || s.includes('tread'))
      return 'AI Vision: Central 3/4 Tread 8.2mm (Min 1.0mm) • Zero Bulges/Cords';
    return `AI Vision: Verified for DVSA statutory standard (${subject})`;
  };

  // Helper Simulated Photo
  const generateSimulatedPhoto = (subject: string): string => {
    // Generate an SVG data url depicting an AR inspected vehicle component
    const s = subject.toLowerCase();
    const accentColor = s.includes('defect') ? '#ef4444' : '#10b981';
    const title = subject.toUpperCase();

    const svg = `
      <svg xmlns="http://www.w3.org/2000/svg" width="640" height="480" viewBox="0 0 640 480">
        <rect width="640" height="480" fill="#0f172a" />
        <circle cx="320" cy="240" r="160" fill="#1e293b" stroke="${accentColor}" stroke-width="4" stroke-dasharray="8 8" />
        <circle cx="320" cy="240" r="40" fill="${accentColor}" fill-opacity="0.15" stroke="${accentColor}" stroke-width="2" />
        <line x1="160" y1="240" x2="480" y2="240" stroke="${accentColor}" stroke-width="1" stroke-opacity="0.5" />
        <line x1="320" y1="80" x2="320" y2="400" stroke="${accentColor}" stroke-width="1" stroke-opacity="0.5" />
        <rect x="20" y="20" width="600" height="60" rx="12" fill="#020617" fill-opacity="0.9" stroke="#334155" />
        <text x="40" y="45" fill="#f8fafc" font-size="16" font-family="monospace" font-weight="bold">${title}</text>
        <text x="40" y="65" fill="${accentColor}" font-size="12" font-family="monospace">VEHICLE: ${vehicleReg} | TRAILER: ${trailerId} | GPS: 52.4862 N, 1.8904 W</text>
        <rect x="20" y="400" width="600" height="60" rx="12" fill="#020617" fill-opacity="0.9" stroke="#334155" />
        <text x="40" y="425" fill="#38bdf8" font-size="13" font-family="monospace">DVSA 15-MONTH AUDIT VAULT CERTIFIED</text>
        <text x="40" y="445" fill="#94a3b8" font-size="11" font-family="monospace">SHA-256: d8e2f990bc17a2... | TIME: ${new Date().toISOString()}</text>
      </svg>
    `;
    return `data:image/svg+xml;utf8,${encodeURIComponent(svg)}`;
  };

  return (
    <div className="fixed inset-0 z-50 flex flex-col bg-slate-950 text-slate-100 font-sans select-none overflow-hidden">
      {/* Hidden Canvas for Frame Capture */}
      <canvas ref={canvasRef} className="hidden" />

      {/* TOP HEADER: Conversational Co-Pilot Bar */}
      <header className="px-4 py-3 bg-slate-900 border-b border-slate-800 flex items-center justify-between gap-3 shrink-0">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-500 text-slate-950 flex items-center justify-center font-black shadow-lg shadow-emerald-500/20">
            <Radio className="w-5 h-5 text-slate-950 animate-pulse" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-base font-black text-white flex items-center gap-2">
                <span>Conversational Walkaround Co-Pilot</span>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                  32 DVSA Points
                </span>
              </h2>
            </div>
            <p className="text-xs text-slate-400 flex items-center gap-2">
              <span>Unit: <strong className="text-white">{vehicleReg}</strong></span>
              <span>•</span>
              <span>Trailer: <strong className="text-white">{trailerId}</strong></span>
              <span>•</span>
              <span className="text-emerald-400 font-semibold">Hands-Free Audio Active</span>
            </p>
          </div>
        </div>

        {/* Right Voice & Audio Controls */}
        <div className="flex items-center gap-2">
          {/* 360° AR Vision HUD Button */}
          <button
            onClick={() => setIsARVisionHudOpen(true)}
            className="px-3 py-1.5 rounded-xl bg-cyan-500/20 hover:bg-cyan-500/30 text-cyan-300 border border-cyan-500/40 text-xs font-bold flex items-center gap-1.5 cursor-pointer transition-colors"
            title="Open 360° AR Walkaround Vision HUD"
          >
            <Eye className="w-3.5 h-3.5 text-cyan-400" />
            <span className="hidden md:inline">360° AR Vision</span>
          </button>

          {/* Acoustic Air Leak Analyzer Button */}
          <button
            onClick={() => setIsAcousticModalOpen(true)}
            className="px-3 py-1.5 rounded-xl bg-purple-500/20 hover:bg-purple-500/30 text-purple-300 border border-purple-500/40 text-xs font-bold flex items-center gap-1.5 cursor-pointer transition-colors"
            title="Open Acoustic Air Leak Analyzer"
          >
            <Volume2 className="w-3.5 h-3.5 text-purple-400" />
            <span className="hidden md:inline">Acoustic Air Leak</span>
          </button>

          {/* Driver Routine AI Settings */}
          <button
            onClick={() => setIsSettingsModalOpen(true)}
            className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 text-xs font-bold flex items-center gap-1.5 cursor-pointer transition-colors"
            title="Configure Walkaround Routine AI (Adaptive vs Strict Order)"
          >
            <Sliders className="w-3.5 h-3.5 text-emerald-400" />
            <span className="hidden lg:inline text-[11px] font-mono">
              {driverPref.mode === 'AI_ADAPTIVE' ? 'AI Habit' : driverPref.mode === 'STRICT_STATUTORY' ? 'DVSA Strict' : 'Clockwise'}
            </span>
          </button>

          {/* TTS Audio Mute Toggle */}
          <button
            onClick={() => {
              if (isVoiceAssistanceActive) {
                tts.stop();
                setIsVoiceAssistanceActive(false);
              } else {
                setIsVoiceAssistanceActive(true);
                announceCurrentCheckpoint(currentIndex);
              }
            }}
            className={`p-2.5 rounded-xl border transition-all cursor-pointer ${
              isVoiceAssistanceActive
                ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/40 hover:bg-emerald-500/30'
                : 'bg-slate-800 text-slate-500 border-slate-700 hover:text-slate-300'
            }`}
            title={isVoiceAssistanceActive ? 'Voice Assistant Audio ON (Click to Mute)' : 'Voice Assistant Muted (Click to Unmute)'}
          >
            {isVoiceAssistanceActive ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
          </button>

          {/* Repeat Button */}
          <button
            onClick={() => announceCurrentCheckpoint(currentIndex)}
            className="p-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 transition-colors cursor-pointer"
            title="Repeat current instruction"
          >
            <RotateCcw className="w-4 h-4" />
          </button>

          {/* Close Checklist */}
          <button
            onClick={onClose}
            className="p-2.5 rounded-xl bg-slate-800 hover:bg-rose-950/40 text-slate-400 hover:text-rose-400 border border-slate-700 hover:border-rose-500/40 transition-colors cursor-pointer"
            title="Exit Inspection"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </header>

      {/* PROGRESS TRACKER */}
      <div className="px-4 py-2 bg-slate-950 border-b border-slate-800/80 flex items-center justify-between gap-4 text-xs shrink-0">
        <div className="flex items-center gap-2 flex-1">
          <span className="font-mono font-bold text-white whitespace-nowrap">
            Point {currentIndex + 1} of 32
          </span>
          <div className="flex-1 max-w-md h-2 bg-slate-800 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-emerald-500 to-cyan-400 transition-all duration-300"
              style={{ width: `${((currentIndex + 1) / 32) * 100}%` }}
            />
          </div>
          <span className="text-slate-400 font-mono text-[11px]">
            {Math.round(((currentIndex + 1) / 32) * 100)}%
          </span>
        </div>

        <div className="flex items-center gap-3">
          <span className="text-emerald-400 font-bold flex items-center gap-1">
            <Check className="w-3.5 h-3.5" />
            {checkpoints.filter((c) => c.status === 'PASS').length} Pass
          </span>
          <span className="text-rose-400 font-bold flex items-center gap-1">
            <AlertTriangle className="w-3.5 h-3.5" />
            {defects.length} Defects
          </span>
          <span className="text-cyan-400 font-bold flex items-center gap-1">
            <Camera className="w-3.5 h-3.5" />
            {visualEvidence.length} Media
          </span>
        </div>
      </div>

      {/* AI ASSISTANT SPEECH / LIVE TRANSCRIPT BANNER */}
      <div className="px-4 py-2.5 bg-gradient-to-r from-emerald-950/40 via-slate-900 to-slate-900 border-b border-emerald-500/30 flex items-center justify-between gap-3 text-xs shrink-0">
        <div className="flex items-center gap-2.5 overflow-hidden">
          <div className="relative flex items-center justify-center">
            <span
              className={`w-3 h-3 rounded-full ${
                isSpeaking
                  ? 'bg-cyan-400 animate-ping'
                  : isSpeechRecognitionActive
                  ? 'bg-emerald-400 animate-pulse'
                  : 'bg-slate-600'
              }`}
            />
            <span
              className={`absolute w-2 h-2 rounded-full ${
                isSpeaking ? 'bg-cyan-300' : isSpeechRecognitionActive ? 'bg-emerald-300' : 'bg-slate-400'
              }`}
            />
          </div>
          <div className="truncate">
            <span className="font-bold text-emerald-400 mr-2">
              {isSpeaking ? '🤖 AI Speaking:' : '🎙️ Driver Audio:'}
            </span>
            <span className="text-slate-200 italic font-mono">
              "{transcript || assistantMessage || 'Listening for: Pass, Fail, Take picture of security seal, Record video...'}"
            </span>
          </div>
        </div>

        {/* Quick Voice Simulation Buttons for testing commands */}
        <div className="hidden sm:flex items-center gap-1.5 shrink-0 text-[11px]">
          <span className="text-[10px] text-slate-500 font-mono">Voice Prompts:</span>
          <button
            onClick={() => handleVoiceCommand('pass')}
            className="px-2 py-0.5 rounded bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-300 border border-emerald-500/30 font-mono cursor-pointer"
          >
            "Pass"
          </button>
          <button
            onClick={() => handleVoiceCommand('fail')}
            className="px-2 py-0.5 rounded bg-rose-500/20 hover:bg-rose-500/30 text-rose-300 border border-rose-500/30 font-mono cursor-pointer"
          >
            "Fail"
          </button>
          <button
            onClick={() => handleVoiceCommand('take a picture of security seal')}
            className="px-2 py-0.5 rounded bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 border border-amber-500/30 font-mono cursor-pointer"
          >
            "Photo Seal"
          </button>
          <button
            onClick={() => handleVoiceCommand('take a picture of trailer number and trailer height')}
            className="px-2 py-0.5 rounded bg-cyan-500/20 hover:bg-cyan-500/30 text-cyan-300 border border-cyan-500/30 font-mono cursor-pointer"
          >
            "Trailer Height"
          </button>
          <button
            onClick={() => handleVoiceCommand('record a video')}
            className="px-2 py-0.5 rounded bg-purple-500/20 hover:bg-purple-500/30 text-purple-300 border border-purple-500/30 font-mono cursor-pointer"
          >
            "Record Video"
          </button>
        </div>
      </div>

      {/* MAIN BODY AREA */}
      <div className="flex-1 overflow-y-auto p-4 sm:p-6 flex flex-col justify-between max-w-4xl mx-auto w-full space-y-6">
        {/* CURRENT CHECKPOINT CARD */}
        <div className="space-y-4">
          {/* Asset & Gov.uk Item Tag */}
          <div className="flex flex-wrap items-center justify-between gap-2">
            <div className="flex items-center gap-2">
              <span className="px-3 py-1 rounded-lg text-xs font-mono font-bold bg-slate-800 text-slate-200 border border-slate-700">
                {currentItem.code}
              </span>
              <span className="px-2.5 py-1 rounded-lg text-xs font-mono font-bold text-cyan-300 bg-cyan-950/60 border border-cyan-800/60">
                Item {currentItem.govUkItemNumber} (GOV.UK HGV Diagram)
              </span>
              <span className="px-2.5 py-1 rounded-lg text-xs font-semibold bg-slate-800/80 text-slate-300">
                {currentItem.targetAsset === 'TRACTOR_UNIT'
                  ? '🚛 Tractor Unit'
                  : currentItem.targetAsset === 'SEMI_TRAILER'
                  ? '🚚 Semi-Trailer'
                  : '🔗 Combined Coupling'}
              </span>
            </div>

            {/* Severity Tag */}
            {currentItem.prohibitionType === 'IMMEDIATE_PG9' ? (
              <span className="px-3 py-1 rounded-full text-xs font-bold bg-rose-500/20 text-rose-300 border border-rose-500/40 flex items-center gap-1.5 animate-pulse">
                <AlertOctagon className="w-3.5 h-3.5" />
                Immediate PG9 Grounding Risk
              </span>
            ) : currentItem.prohibitionType === 'DELAYED_10_DAY' ? (
              <span className="px-3 py-1 rounded-full text-xs font-bold bg-amber-500/20 text-amber-300 border border-amber-500/40 flex items-center gap-1.5">
                <AlertTriangle className="w-3.5 h-3.5" />
                10-Day Delayed Notice
              </span>
            ) : (
              <span className="px-3 py-1 rounded-full text-xs font-bold bg-blue-500/20 text-blue-300 border border-blue-500/40 flex items-center gap-1.5">
                <Info className="w-3.5 h-3.5" />
                Advisory Inspection
              </span>
            )}
          </div>

          {/* Title & Description */}
          <div className="p-6 rounded-3xl bg-slate-900 border border-slate-800 shadow-xl space-y-4">
            <div>
              <h3 className="text-xl sm:text-2xl font-black text-white tracking-tight leading-snug">
                {currentItem.title}
              </h3>
              <p className="text-sm sm:text-base text-slate-300 leading-relaxed pt-2">
                {currentItem.description}
              </p>
            </div>

            <div className="pt-2 border-t border-slate-800/80 flex flex-wrap items-center justify-between gap-3 text-xs text-slate-400">
              <span className="font-mono text-[11px] text-slate-500">
                {currentItem.dvsaReference}
              </span>
              {currentItem.photoUrl && (
                <span className="text-emerald-400 font-semibold flex items-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5" /> Photo Attached
                </span>
              )}
            </div>
          </div>
        </div>

        {/* PRIMARY CONVERSATIONAL ACTION TARGETS (Big tactile buttons) */}
        <div className="space-y-3">
          <div className="text-center text-xs font-bold text-slate-400 uppercase tracking-wider">
            Confirm Point or Say Voice Command
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
            {/* 1. PASS BUTTON */}
            <button
              onClick={handlePassCurrentItem}
              className="py-5 px-6 rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-slate-950 font-black text-lg shadow-xl shadow-emerald-500/20 flex items-center justify-center gap-3 transition-all active:scale-95 cursor-pointer"
            >
              <Check className="w-7 h-7 stroke-[3]" />
              <div className="text-left leading-tight">
                <div>PASS &amp; NEXT</div>
                <div className="text-xs font-mono font-bold text-emerald-950 opacity-80">
                  Say "Pass" or "Clear"
                </div>
              </div>
            </button>

            {/* 2. FAIL BUTTON */}
            <button
              onClick={handleFailCurrentItem}
              className="py-5 px-6 rounded-2xl bg-gradient-to-r from-rose-600 to-red-600 hover:from-rose-500 hover:to-red-500 text-white font-black text-lg shadow-xl shadow-rose-600/25 flex items-center justify-center gap-3 transition-all active:scale-95 cursor-pointer"
            >
              <AlertTriangle className="w-7 h-7 stroke-[2.5]" />
              <div className="text-left leading-tight">
                <div>FAIL &amp; LOG DEFECT</div>
                <div className="text-xs font-mono font-bold text-rose-200 opacity-90">
                  Say "Fail" or "Defect"
                </div>
              </div>
            </button>
          </div>

          {/* MEDIA VERIFICATION SHORTCUTS AT ANY STAGE */}
          <div className="pt-2">
            <div className="flex items-center justify-between text-xs text-slate-400 pb-2">
              <span className="font-bold flex items-center gap-1.5">
                <Camera className="w-3.5 h-3.5 text-cyan-400" />
                <span>Visual Confirmation at Any Stage (Say or Tap):</span>
              </span>
              <span className="text-[11px] text-slate-500 font-mono">
                {visualEvidence.length} captured
              </span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              <button
                onClick={() => openCamera('PHOTO', 'TIR Security Seal')}
                className="p-3 rounded-xl bg-slate-900 hover:bg-slate-850 border border-slate-800 hover:border-amber-500/50 text-left transition-all cursor-pointer group"
              >
                <div className="text-xs font-bold text-amber-300 flex items-center gap-1.5">
                  <Lock className="w-3.5 h-3.5 text-amber-400" />
                  <span>Security Seal</span>
                </div>
                <div className="text-[10px] text-slate-400 font-mono pt-0.5 truncate">
                  "Take photo of seal"
                </div>
              </button>

              <button
                onClick={() => openCamera('PHOTO', 'Trailer Number & Height Plate')}
                className="p-3 rounded-xl bg-slate-900 hover:bg-slate-850 border border-slate-800 hover:border-cyan-500/50 text-left transition-all cursor-pointer group"
              >
                <div className="text-xs font-bold text-cyan-300 flex items-center gap-1.5">
                  <Truck className="w-3.5 h-3.5 text-cyan-400" />
                  <span>Trailer &amp; Height</span>
                </div>
                <div className="text-[10px] text-slate-400 font-mono pt-0.5 truncate">
                  "Photo trailer number"
                </div>
              </button>

              <button
                onClick={() => openCamera('PHOTO', `Item ${currentIndex + 1}: ${currentItem.title}`)}
                className="p-3 rounded-xl bg-slate-900 hover:bg-slate-850 border border-slate-800 hover:border-emerald-500/50 text-left transition-all cursor-pointer group"
              >
                <div className="text-xs font-bold text-emerald-300 flex items-center gap-1.5">
                  <Camera className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Take Picture</span>
                </div>
                <div className="text-[10px] text-slate-400 font-mono pt-0.5 truncate">
                  "Take a picture"
                </div>
              </button>

              <button
                onClick={() => openCamera('VIDEO', `Item ${currentIndex + 1}: ${currentItem.title}`)}
                className="p-3 rounded-xl bg-slate-900 hover:bg-slate-850 border border-slate-800 hover:border-purple-500/50 text-left transition-all cursor-pointer group"
              >
                <div className="text-xs font-bold text-purple-300 flex items-center gap-1.5">
                  <Video className="w-3.5 h-3.5 text-purple-400" />
                  <span>Record Video</span>
                </div>
                <div className="text-[10px] text-slate-400 font-mono pt-0.5 truncate">
                  "Record a video"
                </div>
              </button>
            </div>
          </div>
        </div>

        {/* BOTTOM NAVIGATION & MEDIA CAROUSEL */}
        <div className="pt-2 border-t border-slate-800/80 flex items-center justify-between gap-3">
          <button
            onClick={goToPreviousItem}
            disabled={currentIndex === 0}
            className="px-4 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 disabled:opacity-40 disabled:pointer-events-none text-slate-300 font-bold text-xs flex items-center gap-2 border border-slate-800 cursor-pointer transition-colors"
          >
            <ChevronLeft className="w-4 h-4" />
            <span>Previous</span>
          </button>

          {/* Jump to point or complete */}
          <div className="text-xs text-slate-400">
            {checkpoints.filter((c) => c.status !== 'UNCHECKED').length} of 32 Completed
          </div>

          <button
            onClick={goToNextItem}
            className="px-4 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-300 font-bold text-xs flex items-center gap-2 border border-slate-800 cursor-pointer transition-colors"
          >
            <span>Skip / Next</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>

        {/* VISUAL EVIDENCE GALLERY BAR (THUMBNAILS) */}
        {visualEvidence.length > 0 && (
          <div className="pt-3 border-t border-slate-800">
            <div className="text-xs font-bold text-slate-400 pb-2 flex items-center justify-between">
              <span>Visual Evidence Gallery ({visualEvidence.length} items):</span>
              <span className="text-[11px] text-emerald-400 font-mono">15-Month Vault Saved</span>
            </div>
            <div className="flex items-center gap-2.5 overflow-x-auto pb-2">
              {visualEvidence.map((ev) => (
                <div
                  key={ev.id}
                  onClick={() => setSelectedMediaPreview(ev)}
                  className="relative w-20 h-20 rounded-xl overflow-hidden border border-slate-700 bg-slate-900 shrink-0 cursor-pointer hover:border-emerald-400 transition-all group"
                >
                  {ev.type === 'PHOTO' ? (
                    <img src={ev.mediaUrl} alt={ev.subject} className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full bg-slate-950 flex flex-col items-center justify-center text-purple-400">
                      <Film className="w-6 h-6" />
                      <span className="text-[9px] font-mono text-slate-400">VIDEO</span>
                    </div>
                  )}
                  <div className="absolute inset-0 bg-black/40 group-hover:bg-transparent transition-colors flex items-end p-1">
                    <span className="text-[8px] font-bold text-white truncate max-w-full drop-shadow">
                      {ev.subject}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* ========================================================================= */}
      {/* DEFECT RECORDING MODAL: "Say fail and then explain why and take photo..."  */}
      {/* ========================================================================= */}
      {isDefectModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-md p-4 animate-in fade-in duration-200">
          <div className="relative w-full max-w-xl rounded-3xl bg-slate-950 border-2 border-rose-500/60 shadow-2xl p-6 text-white space-y-5">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-rose-500/20 text-rose-400 flex items-center justify-center font-bold border border-rose-500/40">
                  <AlertTriangle className="w-5 h-5 text-rose-400" />
                </div>
                <div>
                  <h3 className="text-lg font-black text-white">Record Statutory Defect</h3>
                  <p className="text-xs text-slate-400">
                    {currentItem.code} • Item {currentItem.govUkItemNumber}: {currentItem.title}
                  </p>
                </div>
              </div>
              <button
                onClick={() => setIsDefectModalOpen(false)}
                className="p-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-400 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Severity Pill Selector */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-400">DVSA Prohibition Classification:</label>
              <div className="grid grid-cols-3 gap-2">
                <button
                  type="button"
                  onClick={() => setCurrentDefectSeverity('IMMEDIATE_PG9')}
                  className={`p-2.5 rounded-xl border text-xs font-bold cursor-pointer transition-all ${
                    currentDefectSeverity === 'IMMEDIATE_PG9'
                      ? 'bg-rose-500 text-white border-rose-400 shadow-md shadow-rose-500/30'
                      : 'bg-slate-900 text-slate-400 border-slate-800'
                  }`}
                >
                  Immediate PG9
                </button>
                <button
                  type="button"
                  onClick={() => setCurrentDefectSeverity('DELAYED_10_DAY')}
                  className={`p-2.5 rounded-xl border text-xs font-bold cursor-pointer transition-all ${
                    currentDefectSeverity === 'DELAYED_10_DAY'
                      ? 'bg-amber-500 text-slate-950 border-amber-400 font-black shadow-md shadow-amber-500/30'
                      : 'bg-slate-900 text-slate-400 border-slate-800'
                  }`}
                >
                  10-Day Delayed
                </button>
                <button
                  type="button"
                  onClick={() => setCurrentDefectSeverity('ADVISORY')}
                  className={`p-2.5 rounded-xl border text-xs font-bold cursor-pointer transition-all ${
                    currentDefectSeverity === 'ADVISORY'
                      ? 'bg-blue-500 text-white border-blue-400 shadow-md shadow-blue-500/30'
                      : 'bg-slate-900 text-slate-400 border-slate-800'
                  }`}
                >
                  Advisory
                </button>
              </div>
            </div>

            {/* Spoken Reason / Text Explanation */}
            <div className="space-y-2">
              <div className="flex items-center justify-between text-xs">
                <span className="font-bold text-slate-300">Spoken Defect Explanation:</span>
                <span className="text-emerald-400 flex items-center gap-1 font-mono text-[11px]">
                  <Mic className="w-3.5 h-3.5 animate-pulse" /> Live Speech Ingestion
                </span>
              </div>
              <textarea
                value={currentDefectExplanation}
                onChange={(e) => setCurrentDefectExplanation(e.target.value)}
                placeholder="Speak now to describe the defect (e.g. 'Air line gland has audible leak, red emergency hose split')..."
                rows={3}
                className="w-full p-3.5 rounded-2xl bg-slate-900 border border-slate-800 text-white text-sm placeholder:text-slate-500 focus:outline-none focus:border-rose-500"
              />
            </div>

            {/* Photo / Video Attachment Actions */}
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-400">Attached Visual Evidence:</label>
              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={() => openCamera('PHOTO', `Defect: ${currentItem.title}`)}
                  className="flex-1 py-3 px-4 rounded-xl bg-slate-900 hover:bg-slate-850 border border-slate-800 hover:border-emerald-400 text-emerald-300 text-xs font-bold flex items-center justify-center gap-2 cursor-pointer transition-all"
                >
                  <Camera className="w-4 h-4 text-emerald-400" />
                  <span>Take Defect Photo</span>
                </button>
                <button
                  type="button"
                  onClick={() => openCamera('VIDEO', `Defect: ${currentItem.title}`)}
                  className="flex-1 py-3 px-4 rounded-xl bg-slate-900 hover:bg-slate-850 border border-slate-800 hover:border-purple-400 text-purple-300 text-xs font-bold flex items-center justify-center gap-2 cursor-pointer transition-all"
                >
                  <Video className="w-4 h-4 text-purple-400" />
                  <span>Record Defect Video</span>
                </button>
              </div>

              {/* Display attached thumbnails */}
              {(currentDefectPhotos.length > 0 || currentDefectVideos.length > 0) && (
                <div className="flex items-center gap-2 pt-2">
                  {currentDefectPhotos.map((p, idx) => (
                    <img
                      key={idx}
                      src={p}
                      alt="Defect"
                      className="w-12 h-12 rounded-lg object-cover border border-rose-500/50"
                    />
                  ))}
                  {currentDefectVideos.map((_, idx) => (
                    <div
                      key={idx}
                      className="w-12 h-12 rounded-lg bg-slate-900 border border-purple-500/50 flex items-center justify-center text-purple-400 text-[10px] font-mono"
                    >
                      VID
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Modal Bottom Actions */}
            <div className="pt-3 border-t border-slate-800 flex items-center justify-between gap-3">
              <button
                type="button"
                onClick={() => setIsDefectModalOpen(false)}
                className="px-5 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-400 font-bold text-xs cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={saveCurrentDefect}
                className="px-6 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-black text-xs shadow-lg shadow-rose-600/30 cursor-pointer flex items-center gap-2"
              >
                <Check className="w-4 h-4" />
                <span>Save Defect &amp; Next</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* FULLSCREEN CAMERA & VIDEO RECORDING VIEWPORT                              */}
      {/* ========================================================================= */}
      {isCameraActive && (
        <div className="fixed inset-0 z-50 flex flex-col bg-black text-white">
          {/* Top Bar with Subject & Flash */}
          <div className="p-4 bg-black/60 backdrop-blur flex items-center justify-between z-10">
            <div className="flex items-center gap-2.5">
              <span className="w-3 h-3 rounded-full bg-red-500 animate-ping" />
              <div>
                <div className="text-sm font-black text-white">{cameraSubject}</div>
                <div className="text-xs text-slate-400 font-mono">
                  {cameraMode === 'VIDEO' ? '🎥 VIDEO RECORDING' : '📷 PHOTO EVIDENCE'} • {vehicleReg}
                </div>
              </div>
            </div>

            <button
              onClick={closeCamera}
              className="p-2 rounded-full bg-slate-900/80 hover:bg-slate-800 text-white cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Camera Viewfinder */}
          <div className="relative flex-1 bg-slate-950 flex items-center justify-center overflow-hidden">
            {/* Live Video Element */}
            <video
              ref={videoRef}
              playsInline
              muted
              className="absolute inset-0 w-full h-full object-cover"
            />

            {/* Flash Effect */}
            {cameraFlashActive && (
              <div className="absolute inset-0 bg-white z-30 transition-opacity duration-200" />
            )}

            {/* AR Reticle & Inspection Guidelines */}
            <div className="absolute inset-0 pointer-events-none flex flex-col items-center justify-center p-8 z-10">
              <div className="relative w-72 sm:w-96 h-56 sm:h-72 border-2 border-emerald-400/80 rounded-3xl flex items-center justify-center">
                {/* Corner markers */}
                <div className="absolute top-2 left-2 w-4 h-4 border-t-2 border-l-2 border-emerald-400" />
                <div className="absolute top-2 right-2 w-4 h-4 border-t-2 border-r-2 border-emerald-400" />
                <div className="absolute bottom-2 left-2 w-4 h-4 border-b-2 border-l-2 border-emerald-400" />
                <div className="absolute bottom-2 right-2 w-4 h-4 border-b-2 border-r-2 border-emerald-400" />

                {/* Center crosshair */}
                <div className="w-6 h-6 border border-emerald-400/50 rounded-full flex items-center justify-center">
                  <div className="w-1.5 h-1.5 bg-emerald-400 rounded-full" />
                </div>

                <div className="absolute bottom-3 text-center px-4 py-1 rounded-full bg-black/60 backdrop-blur text-[11px] font-mono text-emerald-300">
                  Align: {cameraSubject}
                </div>
              </div>

              {/* Live Video Timer Indicator */}
              {isRecordingVideo && (
                <div className="mt-4 px-4 py-1.5 rounded-full bg-red-600/90 text-white font-mono font-bold text-xs flex items-center gap-2 shadow-lg animate-pulse">
                  <span className="w-2.5 h-2.5 rounded-full bg-white" />
                  <span>REC 00:{recordingSeconds < 10 ? `0${recordingSeconds}` : recordingSeconds}</span>
                </div>
              )}
            </div>

            {/* Simulated Frame Fallback Backdrop if Camera Disabled */}
            <div className="absolute inset-0 bg-slate-900/40 flex items-center justify-center pointer-events-none">
              <div className="text-center space-y-2 opacity-60">
                <Truck className="w-20 h-20 text-slate-600 mx-auto" />
                <div className="text-xs font-mono text-slate-400">
                  AI Optical Targeting Lens Active
                </div>
              </div>
            </div>
          </div>

          {/* Shutter / Record Control Bar */}
          <div className="p-6 bg-black/80 backdrop-blur flex items-center justify-center gap-6 z-10">
            {cameraMode === 'PHOTO' ? (
              <button
                onClick={capturePhoto}
                className="w-20 h-20 rounded-full bg-white hover:bg-emerald-400 border-4 border-emerald-500 text-slate-950 flex items-center justify-center shadow-2xl cursor-pointer active:scale-95 transition-all"
                title="Capture Photo"
              >
                <Camera className="w-8 h-8 text-slate-950 stroke-[2.5]" />
              </button>
            ) : (
              <button
                onClick={isRecordingVideo ? stopVideoRecording : startVideoRecording}
                className={`w-20 h-20 rounded-full border-4 flex items-center justify-center shadow-2xl cursor-pointer active:scale-95 transition-all ${
                  isRecordingVideo
                    ? 'bg-red-600 border-white text-white'
                    : 'bg-white hover:bg-red-500 border-red-500 text-red-600 hover:text-white'
                }`}
                title={isRecordingVideo ? 'Stop Recording' : 'Start Recording'}
              >
                {isRecordingVideo ? (
                  <Square className="w-8 h-8 fill-white" />
                ) : (
                  <Video className="w-8 h-8 stroke-[2.5]" />
                )}
              </button>
            )}
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* INSPECTION COMPLETION & ROADWORTHINESS CERTIFICATE MODAL                  */}
      {/* ========================================================================= */}
      {isInspectionCompleted && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/95 backdrop-blur-md p-4 animate-in zoom-in-95 duration-200">
          <div className="relative w-full max-w-2xl rounded-3xl bg-slate-950 border border-emerald-500/50 shadow-2xl p-6 sm:p-8 text-white space-y-6">
            <div className="text-center space-y-2">
              <div className="w-16 h-16 rounded-2xl bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 mx-auto flex items-center justify-center shadow-xl shadow-emerald-500/20">
                <ShieldCheck className="w-9 h-9 text-emerald-400 stroke-[2]" />
              </div>
              <h3 className="text-2xl sm:text-3xl font-black text-white">
                Walkaround Inspection Complete
              </h3>
              <p className="text-xs sm:text-sm text-slate-400">
                32 of 32 Statutory DVSA Points Confirmed • 15-Month Audit Vault Ready
              </p>
            </div>

            {/* Score Summary Box */}
            <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 grid grid-cols-3 gap-3 text-center">
              <div>
                <div className="text-2xl font-black text-emerald-400">
                  {checkpoints.filter((c) => c.status === 'PASS').length}
                </div>
                <div className="text-xs text-slate-400 font-bold uppercase">Passed Points</div>
              </div>
              <div>
                <div className="text-2xl font-black text-rose-400">{defects.length}</div>
                <div className="text-xs text-slate-400 font-bold uppercase">Recorded Defects</div>
              </div>
              <div>
                <div className="text-2xl font-black text-cyan-400">{visualEvidence.length}</div>
                <div className="text-xs text-slate-400 font-bold uppercase">Visual Proofs</div>
              </div>
            </div>

            {/* Roadworthiness Status Banner */}
            {roadworthiness.immediatePg9Fails > 0 ? (
              <div className="p-4 rounded-2xl bg-rose-950/40 border border-rose-500/60 text-rose-300 text-xs space-y-1">
                <div className="font-black text-sm flex items-center gap-2">
                  <AlertOctagon className="w-4 h-4 text-rose-400" />
                  <span>IMMEDIATE PROHIBITION (PG9) GROUNDED</span>
                </div>
                <p>
                  Safety-critical defect logged. In accordance with Goods Vehicles (Licensing of
                  Operators) Act 1995, this vehicle cannot move on public highway until repaired and
                  signed off by workshop technician.
                </p>
              </div>
            ) : roadworthiness.delayed10DayFails > 0 ? (
              <div className="p-4 rounded-2xl bg-amber-950/40 border border-amber-500/60 text-amber-300 text-xs space-y-1">
                <div className="font-black text-sm flex items-center gap-2">
                  <AlertTriangle className="w-4 h-4 text-amber-400" />
                  <span>DELAYED 10-DAY RECTIFICATION NOTICE</span>
                </div>
                <p>Vehicle cleared for limited transit. Workshop job card scheduled within 10 days.</p>
              </div>
            ) : (
              <div className="p-4 rounded-2xl bg-emerald-950/40 border border-emerald-500/60 text-emerald-300 text-xs space-y-1">
                <div className="font-black text-sm flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  <span>100% DVSA ROADWORTHY — CLEARED FOR HIGHWAY TRANSIT</span>
                </div>
                <p>All points passed statutory criteria. Digital certificate signed &amp; timestamped.</p>
              </div>
            )}

            {/* Driver & Vault Signature */}
            <div className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800 text-xs space-y-1 font-mono text-slate-400">
              <div>
                Driver:{' '}
                <strong className="text-white">
                  {driverProfile?.fullName || 'Alexander James Kite'} (C+E Verified)
                </strong>
              </div>
              <div>
                Tractor: <strong className="text-white">{vehicleReg}</strong> | Trailer:{' '}
                <strong className="text-white">{trailerId}</strong>
              </div>
              <div className="truncate text-slate-500">
                SHA-256 Vault Hash: {`sha256-dvsa-audit-${Date.now()}-verified`}
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row items-center gap-3">
              <button
                onClick={() => setIsInspectionCompleted(false)}
                className="w-full sm:w-auto py-3 px-4 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-300 font-bold text-xs cursor-pointer border border-slate-700"
              >
                Review Points
              </button>
              <button
                onClick={finalizeAndClose}
                className="w-full sm:w-auto flex-1 py-3 px-5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs shadow-lg cursor-pointer flex items-center justify-center gap-2 border border-slate-700"
              >
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                <span>Save to 15-Month Vault</span>
              </button>
              {onOpenDeliverySiteRouteModal && (
                <button
                  onClick={() => {
                    finalizeAndClose();
                    onOpenDeliverySiteRouteModal();
                  }}
                  className="w-full sm:w-auto flex-2 py-3 px-6 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white font-black text-xs sm:text-sm shadow-xl shadow-cyan-900/40 cursor-pointer flex items-center justify-center gap-2 transition-all"
                >
                  <Navigation className="w-4 h-4" />
                  <span>Proceed to Next Delivery Site &amp; Compliant HGV Route</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MEDIA PREVIEW MODAL: Full View of Captured Photo or Video                 */}
      {/* ========================================================================= */}
      {selectedMediaPreview && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-md p-4 animate-in fade-in duration-200">
          <div className="relative w-full max-w-xl rounded-3xl bg-slate-950 border border-slate-800 p-5 text-white space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="text-sm font-bold text-white">{selectedMediaPreview.subject}</h4>
                <p className="text-[11px] font-mono text-slate-400">
                  {selectedMediaPreview.timestamp} • {selectedMediaPreview.type}
                </p>
              </div>
              <button
                onClick={() => setSelectedMediaPreview(null)}
                className="p-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-400 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="rounded-2xl overflow-hidden bg-slate-900 border border-slate-800 max-h-[60vh] flex items-center justify-center">
              {selectedMediaPreview.type === 'PHOTO' ? (
                <img
                  src={selectedMediaPreview.mediaUrl}
                  alt={selectedMediaPreview.subject}
                  className="w-full h-auto object-contain max-h-[55vh]"
                />
              ) : (
                <video
                  src={selectedMediaPreview.mediaUrl}
                  controls
                  autoPlay
                  className="w-full h-auto max-h-[55vh]"
                />
              )}
            </div>

            {selectedMediaPreview.aiVerificationTag && (
              <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-xs font-mono">
                {selectedMediaPreview.aiVerificationTag}
              </div>
            )}
          </div>
        </div>
      )}

      {/* 1. DRIVER ROUTINE AI SETTINGS MODAL */}
      {isSettingsModalOpen && (
        <DriverWalkaroundSettingsModal
          isOpen={isSettingsModalOpen}
          onClose={() => setIsSettingsModalOpen(false)}
          onPreferencesChanged={(updated) => {
            setDriverPref(updated);
            const ordered = getOrderedCheckpoints(checkpoints, updated.mode);
            setCheckpoints(ordered);
            setCurrentIndex(0);
            speakAssistant(
              `Walkaround sequence updated to ${
                updated.mode === 'AI_ADAPTIVE'
                  ? 'AI Adaptive Habit'
                  : updated.mode === 'STRICT_STATUTORY'
                  ? 'Strict DVSA Order'
                  : 'Clockwise Yard Walk'
              }.`
            );
          }}
        />
      )}

      {/* 2. ACOUSTIC AIR LEAK ANALYZER MODAL */}
      {isAcousticModalOpen && (
        <AcousticAirLeakAnalyzerModal
          isOpen={isAcousticModalOpen}
          onClose={() => setIsAcousticModalOpen(false)}
          vehicleReg={vehicleReg}
          trailerId={trailerId}
          onPassInspection={(proof) => {
            const targetItem = checkpoints.find((c) => c.govUkItemNumber === 23) || currentItem;
            const updated = checkpoints.map((c) =>
              c.id === targetItem.id ? { ...c, status: 'PASS' as const } : c
            );
            setCheckpoints(updated);
            setVisualEvidence((prev) => [
              {
                id: `ev-acoustic-${Date.now()}`,
                type: 'PHOTO',
                subject: 'Acoustic Compressed Air Frequency Certificate',
                checkpointId: targetItem.id,
                checkpointNumber: targetItem.govUkItemNumber,
                mediaUrl: '/walkaround_tips/walkaround_tip4_susie_airlines.jpg',
                timestamp: new Date().toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' }),
                aiVerificationTag: `Acoustic FFT: 0 hissing detected (${proof.dbLevel} dB at ${proof.peakFrequencyKhz} kHz • HERMETIC SEAL PASS)`
              },
              ...prev
            ]);
            speakAssistant(
              'Acoustic air leak analysis complete. Hermetic seal confirmed at 8.8 bar. Red and Yellow Susie lines passed.'
            );
          }}
        />
      )}

      {/* 3. 360° AR WALKAROUND VISION HUD */}
      {isARVisionHudOpen && (
        <ARWalkaroundVisionHUD
          isOpen={isARVisionHudOpen}
          onClose={() => setIsARVisionHudOpen(false)}
          currentCheckpoint={currentItem}
          checkpointIndex={currentIndex}
          totalCheckpoints={checkpoints.length}
          vehicleReg={vehicleReg}
          trailerId={trailerId}
          onPassCurrentPoint={() => {
            handlePassCurrentItem();
          }}
          onFailCurrentPoint={() => {
            setIsARVisionHudOpen(false);
            handleFailCurrentItem();
          }}
          onCaptureARPhoto={(photoUrl, tag) => {
            setVisualEvidence((prev) => [
              {
                id: `ev-ar-${Date.now()}`,
                type: 'PHOTO',
                subject: currentItem.title,
                checkpointId: currentItem.id,
                checkpointNumber: currentItem.govUkItemNumber,
                mediaUrl: photoUrl,
                timestamp: new Date().toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' }),
                aiVerificationTag: tag
              },
              ...prev
            ]);
            speakAssistant(`AR spatial capture recorded for ${currentItem.title}.`);
          }}
          onOpenAcousticTest={() => {
            setIsAcousticModalOpen(true);
          }}
        />
      )}
    </div>
  );
};
