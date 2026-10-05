import React, { useState, useEffect, useRef } from 'react';
import {
  X,
  Play,
  Pause,
  RotateCcw,
  SkipForward,
  SkipBack,
  Volume2,
  VolumeX,
  Download,
  Video,
  AlertTriangle,
  Compass,
  CheckCircle2,
  Share2,
  Navigation
} from 'lucide-react';
import { ApproachVideoGuide, SiteRiskAssessment } from '../types';
import { tts } from '../services/ttsService';

interface ApproachVideoModalProps {
  isOpen: boolean;
  onClose: () => void;
  site: SiteRiskAssessment;
}

export const ApproachVideoModal: React.FC<ApproachVideoModalProps> = ({
  isOpen,
  onClose,
  site
}) => {
  const guide = site.businessSection.approachVideoGuide;
  const steps = guide?.steps || [];

  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isAudioMuted, setIsAudioMuted] = useState(false);
  const [playbackSpeed, setPlaybackSpeed] = useState<number>(1.0);
  const [exportNotice, setExportNotice] = useState<string | null>(null);

  const stepTimeoutRef = useRef<any>(null);

  // Reset when opening
  useEffect(() => {
    if (isOpen) {
      setCurrentStepIndex(0);
      setIsPlaying(false);
    } else {
      tts.stop();
      if (stepTimeoutRef.current) clearTimeout(stepTimeoutRef.current);
    }
  }, [isOpen]);

  const currentStep = steps[currentStepIndex];

  // Play narration when step changes if playing
  useEffect(() => {
    if (!isOpen || !currentStep) return;

    if (isPlaying && !isAudioMuted) {
      tts.speak(
        `${currentStep.heading}. ${currentStep.narrationText}${
          currentStep.hazardWarning ? ` Warning: ${currentStep.hazardWarning}` : ''
        }`,
        playbackSpeed
      ).then(() => {
        // When speech finishes, auto advance after 2 seconds
        if (isPlaying) {
          stepTimeoutRef.current = setTimeout(() => {
            handleNextStep();
          }, 2000 / playbackSpeed);
        }
      });
    }

    return () => {
      if (stepTimeoutRef.current) clearTimeout(stepTimeoutRef.current);
    };
  }, [currentStepIndex, isPlaying, isAudioMuted, isOpen, playbackSpeed]);

  if (!isOpen || !guide || steps.length === 0) return null;

  const handleTogglePlay = () => {
    if (isPlaying) {
      setIsPlaying(false);
      tts.stop();
      if (stepTimeoutRef.current) clearTimeout(stepTimeoutRef.current);
    } else {
      setIsPlaying(true);
    }
  };

  const handleNextStep = () => {
    tts.stop();
    if (currentStepIndex < steps.length - 1) {
      setCurrentStepIndex((prev) => prev + 1);
    } else {
      setIsPlaying(false);
    }
  };

  const handlePrevStep = () => {
    tts.stop();
    if (currentStepIndex > 0) {
      setCurrentStepIndex((prev) => prev - 1);
    }
  };

  const handleRestart = () => {
    tts.stop();
    setCurrentStepIndex(0);
    setIsPlaying(true);
  };

  const handleClose = () => {
    tts.stop();
    setIsPlaying(false);
    onClose();
  };

  // Export Approach Video Briefing package for offline drivers
  const handleExportBriefing = () => {
    const exportData = {
      siteId: site.id,
      title: guide.title,
      businessName: site.businessName,
      address: site.address,
      gateCode: site.businessSection.gateSecurityCode,
      musterPoint: site.businessSection.emergencyMusterPoint,
      vehicleRestrictions: site.businessSection.vehicleConstraints,
      steps: guide.steps,
      generatedAt: new Date().toISOString()
    };

    const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${site.title.replace(/[^a-z0-9]/gi, '_').toLowerCase()}_approach_video_guide.json`;
    a.click();
    URL.revokeObjectURL(url);

    setExportNotice('Approach Video Guide downloaded for offline use!');
    setTimeout(() => setExportNotice(null), 3000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-slate-950/90 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-2xl rounded-2xl border border-slate-800 bg-slate-900 shadow-2xl text-slate-100 overflow-hidden flex flex-col max-h-[95vh]">
        {/* Modal Header */}
        <div className="flex items-center justify-between px-4 py-3 border-b border-slate-800 bg-slate-950/70">
          <div className="flex items-center gap-2.5">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-amber-500/20 text-amber-400 border border-amber-500/30">
              <Video className="h-4 w-4" />
            </div>
            <div>
              <h2 className="text-sm sm:text-base font-bold text-slate-100 leading-tight">
                {guide.title}
              </h2>
              <p className="text-[11px] text-slate-400">
                Step-by-Step Approach Navigation & Gatehouse Video Guide
              </p>
            </div>
          </div>
          <button
            onClick={handleClose}
            className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-800 hover:text-white transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Video Canvas Simulation Stage */}
        <div className="relative aspect-video w-full bg-slate-950 overflow-hidden select-none border-b border-slate-800">
          {/* Step Photo / Imagery */}
          <img
            src={currentStep.mockImageUrl}
            alt={currentStep.heading}
            className="h-full w-full object-cover opacity-85 transition-opacity duration-500"
          />

          {/* Vignette & Gradients */}
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/30 to-slate-950/60" />

          {/* Animated GPS Radar Pulse */}
          <div className="absolute top-4 right-4 flex items-center gap-2 rounded-full bg-slate-900/90 border border-slate-700/80 px-3 py-1 shadow-lg backdrop-blur-sm">
            <div className="relative flex h-2.5 w-2.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-amber-500"></span>
            </div>
            <span className="text-[11px] font-mono font-semibold text-amber-400 tracking-wider">
              APPROACH LIVE
            </span>
          </div>

          {/* Top Checkpoint Badge */}
          <div className="absolute top-4 left-4 flex items-center gap-2">
            <span className="flex items-center gap-1.5 rounded-lg bg-amber-500 px-2.5 py-1 text-xs font-bold text-slate-950 shadow-md">
              <Navigation className="h-3.5 w-3.5" />
              CHECKPOINT {currentStepIndex + 1}/{steps.length}
            </span>
            <span className="rounded-lg bg-slate-900/90 border border-slate-700/80 px-2.5 py-1 text-[11px] font-semibold text-slate-300 backdrop-blur-sm">
              {currentStep.checkpointType.replace('_', ' ')}
            </span>
          </div>

          {/* Active Step Overlay Card */}
          <div className="absolute bottom-4 inset-x-4 p-4 rounded-xl bg-slate-900/90 border border-slate-700/80 backdrop-blur-md shadow-2xl">
            <div className="flex items-start justify-between gap-2">
              <h3 className="text-base sm:text-lg font-bold text-slate-100 flex items-center gap-2">
                <span>{currentStep.heading}</span>
              </h3>
              {isPlaying && !isAudioMuted && (
                <div className="flex items-center gap-1 text-emerald-400 text-xs shrink-0">
                  <Volume2 className="h-4 w-4 animate-pulse" />
                  <span className="text-[11px] font-mono">Narrating...</span>
                </div>
              )}
            </div>

            <p className="text-xs sm:text-sm text-slate-300 mt-1 leading-relaxed">
              {currentStep.instruction}
            </p>

            {/* Hazard Caution Callout */}
            {currentStep.hazardWarning && (
              <div className="mt-2 flex items-center gap-2 rounded-lg bg-rose-500/20 border border-rose-500/40 p-2 text-xs font-semibold text-rose-300">
                <AlertTriangle className="h-4 w-4 shrink-0 text-rose-400" />
                <span>{currentStep.hazardWarning}</span>
              </div>
            )}
          </div>
        </div>

        {/* Playback Controls & Timeline */}
        <div className="p-4 bg-slate-900 space-y-3">
          {/* Progress Segments */}
          <div className="flex items-center gap-1.5 w-full">
            {steps.map((_, idx) => (
              <button
                key={idx}
                onClick={() => {
                  tts.stop();
                  setCurrentStepIndex(idx);
                }}
                className={`h-1.5 flex-1 rounded-full transition-all ${
                  idx === currentStepIndex
                    ? 'bg-amber-400 shadow-sm shadow-amber-400/50'
                    : idx < currentStepIndex
                    ? 'bg-amber-600'
                    : 'bg-slate-800'
                }`}
                title={`Jump to step ${idx + 1}`}
              />
            ))}
          </div>

          {/* Interactive Control Bar */}
          <div className="flex items-center justify-between gap-2 flex-wrap pt-1">
            <div className="flex items-center gap-2">
              <button
                onClick={handlePrevStep}
                disabled={currentStepIndex === 0}
                className="rounded-lg border border-slate-800 bg-slate-950 p-2 text-slate-300 hover:bg-slate-800 disabled:opacity-40 transition-colors"
                title="Previous step"
              >
                <SkipBack className="h-4 w-4" />
              </button>

              <button
                onClick={handleTogglePlay}
                className="flex items-center gap-2 rounded-xl bg-amber-500 hover:bg-amber-400 px-4 py-2 font-bold text-slate-950 text-xs shadow-lg shadow-amber-500/20 transition-all active:scale-95"
              >
                {isPlaying ? (
                  <>
                    <Pause className="h-4 w-4 fill-slate-950" />
                    <span>Pause Walkthrough</span>
                  </>
                ) : (
                  <>
                    <Play className="h-4 w-4 fill-slate-950" />
                    <span>{currentStepIndex === steps.length - 1 ? 'Replay Guide' : 'Play Narration'}</span>
                  </>
                )}
              </button>

              <button
                onClick={handleNextStep}
                disabled={currentStepIndex === steps.length - 1}
                className="rounded-lg border border-slate-800 bg-slate-950 p-2 text-slate-300 hover:bg-slate-800 disabled:opacity-40 transition-colors"
                title="Next step"
              >
                <SkipForward className="h-4 w-4" />
              </button>

              <button
                onClick={handleRestart}
                className="rounded-lg border border-slate-800 bg-slate-950 p-2 text-slate-400 hover:text-slate-200 hover:bg-slate-800 transition-colors"
                title="Restart from beginning"
              >
                <RotateCcw className="h-4 w-4" />
              </button>
            </div>

            {/* Audio Voice Narration & Export */}
            <div className="flex items-center gap-2">
              <button
                onClick={() => {
                  if (isAudioMuted) {
                    setIsAudioMuted(false);
                  } else {
                    tts.stop();
                    setIsAudioMuted(true);
                  }
                }}
                className={`flex items-center gap-1.5 rounded-lg border px-2.5 py-1.5 text-xs font-semibold transition-colors ${
                  isAudioMuted
                    ? 'border-slate-800 bg-slate-950 text-slate-500'
                    : 'border-emerald-500/30 bg-emerald-500/10 text-emerald-400'
                }`}
                title="Toggle Text-to-Speech voice narration"
              >
                {isAudioMuted ? <VolumeX className="h-3.5 w-3.5" /> : <Volume2 className="h-3.5 w-3.5" />}
                <span className="hidden sm:inline">{isAudioMuted ? 'Muted' : 'Voice ON'}</span>
              </button>

              <button
                onClick={handleExportBriefing}
                className="flex items-center gap-1 rounded-lg border border-slate-800 bg-slate-950 hover:bg-slate-800 px-2.5 py-1.5 text-xs font-medium text-slate-300 hover:text-white transition-colors"
                title="Download video walkthrough data for offline delivery runs"
              >
                <Download className="h-3.5 w-3.5 text-amber-400" />
                <span className="hidden sm:inline">Export Video Guide</span>
              </button>
            </div>
          </div>

          {exportNotice && (
            <div className="flex items-center gap-2 p-2 rounded-lg bg-emerald-500/20 text-emerald-300 text-xs border border-emerald-500/30">
              <CheckCircle2 className="h-3.5 w-3.5 text-emerald-400" />
              <span>{exportNotice}</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
