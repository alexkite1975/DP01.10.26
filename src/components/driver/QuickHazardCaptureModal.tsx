'use client';
import React, { useState } from 'react';
import {
  X,
  Mic,
  Square,
  Camera,
  UploadCloud,
  Sparkles,
  AlertTriangle,
  CheckCircle2,
  Loader2,
  ShieldAlert
} from 'lucide-react';
import { SiteRiskAssessment } from '../types';

interface QuickHazardCaptureModalProps {
  isOpen: boolean;
  onClose: () => void;
  sites: SiteRiskAssessment[];
  activeSiteId?: string;
  onHazardReported: (siteId: string, hazardData: any) => void;
}

export const QuickHazardCaptureModal: React.FC<QuickHazardCaptureModalProps> = ({
  isOpen,
  onClose,
  sites,
  activeSiteId,
  onHazardReported
}) => {
  const [selectedSiteId, setSelectedSiteId] = useState<string>(activeSiteId || sites[0]?.id || '');
  const [transcript, setTranscript] = useState('');
  const [photoPreview, setPhotoPreview] = useState<string | null>(null);
  const [isRecording, setIsRecording] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisResult, setAnalysisResult] = useState<any | null>(null);

  if (!isOpen) return null;

  // Voice recording simulation / Web Speech API
  const handleToggleRecord = () => {
    if (isRecording) {
      setIsRecording(false);
    } else {
      setIsRecording(true);
      // If Web Speech API is available, hook in, otherwise simulate rapid speech capture
      if (typeof window !== 'undefined' && ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window)) {
        try {
          const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
          const recognition = new SpeechRecognition();
          recognition.continuous = false;
          recognition.interimResults = true;
          recognition.lang = 'en-GB';

          recognition.onresult = (event: any) => {
            const text = Array.from(event.results)
              .map((r: any) => r[0].transcript)
              .join('');
            setTranscript(text);
          };

          recognition.onerror = () => {
            setIsRecording(false);
          };

          recognition.onend = () => {
            setIsRecording(false);
          };

          recognition.start();
          return;
        } catch (e) {
          console.warn('Speech recognition init error:', e);
        }
      }

      // Quick voice prompt simulation
      setTimeout(() => {
        setTranscript(
          'Warning for upcoming drivers: hydraulic oil spill on Bay 2 ramp entrance. Highly slippery for steel toecap boots and trailer tires.'
        );
        setIsRecording(false);
      }, 3000);
    }
  };

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (ev) => {
        setPhotoPreview(ev.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleRunAnalysis = async () => {
    if (!transcript && !photoPreview) return;

    setIsAnalyzing(true);
    setAnalysisResult(null);

    const site = sites.find((s) => s.id === selectedSiteId);

    try {
      const res = await fetch('/api/quick-hazard-analysis', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          transcript,
          photoDescription: photoPreview ? 'Site hazard photo captured by driver mobile device' : '',
          siteContext: site ? `${site.title} (${site.address})` : 'Delivery Site'
        })
      });

      const data = await res.json();
      if (data.success && data.analysis) {
        setAnalysisResult(data.analysis);
      }
    } catch (e) {
      console.warn('Failed AI hazard analysis, generating fallback:', e);
      setAnalysisResult({
        category: 'SLIP_TRIP',
        severity: 'HIGH',
        aiSummary: `Driver logged hazard: ${transcript.slice(0, 80)}`,
        suggestedImmediateAction: 'Broadcast warning to approaching drivers and request yard gritting.',
        requiresImmediateSignOff: true
      });
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleConfirmSubmit = () => {
    if (!selectedSiteId) return;

    const newObservation = {
      id: `obs-snap-${Date.now()}`,
      driverName: 'Mobile Driver (Instant Snap)',
      vehicleReg: 'LIVE-SNAP',
      vehicleCategory: '18T_RIGID',
      timestamp: new Date().toISOString(),
      groundConditions: analysisResult?.category === 'SLIP_TRIP' ? 'ICY_SLIPPERY' : 'WET',
      congestionLevel: 'BUSY',
      gateCodeStillValid: true,
      notes: transcript || 'Instant hazard observation captured',
      photos: photoPreview ? [photoPreview] : [],
      aiCategoryTag: analysisResult ? `${analysisResult.category} (${analysisResult.severity})` : 'Instant Driver Hazard',
      status: 'SUBMITTED'
    };

    onHazardReported(selectedSiteId, newObservation);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/85 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-lg rounded-2xl border border-slate-800 bg-slate-900 p-5 sm:p-6 shadow-2xl text-slate-100 max-h-[92vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-slate-800">
          <div className="flex items-center gap-2.5">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-rose-500/20 text-rose-400 border border-rose-500/30">
              <ShieldAlert className="h-5 w-5" />
            </div>
            <div>
              <h2 className="text-base sm:text-lg font-bold text-slate-100 flex items-center gap-1.5">
                <span>10-Second Hazard Snap</span>
                <span className="rounded bg-rose-500/20 px-1.5 py-0.5 text-[10px] font-bold text-rose-400 border border-rose-500/30">
                  AI Rapid
                </span>
              </h2>
              <p className="text-xs text-slate-400">
                Instantly capture site hazards via voice note & photo
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-800 hover:text-white transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="space-y-4 pt-3">
          {/* Target Site Selector */}
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">
              Select Delivery Site
            </label>
            <select
              value={selectedSiteId}
              onChange={(e) => setSelectedSiteId(e.target.value)}
              className="w-full rounded-lg border border-slate-700 bg-slate-950 px-3 py-2 text-xs text-slate-100 focus:border-amber-500 focus:outline-none"
            >
              {sites.map((s) => (
                <option key={s.id} value={s.id}>
                  {s.title} ({s.address.slice(0, 35)}...)
                </option>
              ))}
            </select>
          </div>

          {/* Voice Note Capture */}
          <div className="rounded-xl border border-slate-800 bg-slate-950/70 p-4 text-center">
            <button
              type="button"
              onClick={handleToggleRecord}
              className={`relative mx-auto flex h-16 w-16 items-center justify-center rounded-full transition-all active:scale-95 ${
                isRecording
                  ? 'bg-rose-600 text-white ring-4 ring-rose-500/40 animate-pulse'
                  : 'bg-amber-500 text-slate-950 hover:bg-amber-400 shadow-lg shadow-amber-500/20'
              }`}
            >
              {isRecording ? <Square className="h-6 w-6" /> : <Mic className="h-7 w-7" />}
            </button>
            <div className="mt-2 text-xs font-semibold text-slate-200">
              {isRecording ? 'Listening... Speak hazard clearly' : 'Tap to Record Voice Hazard Memo'}
            </div>
            <p className="text-[11px] text-slate-400 mt-0.5">
              Hands-free: Describe gate issues, low cables, blind reversing or oil leaks
            </p>

            {/* Transcript Area */}
            <textarea
              value={transcript}
              onChange={(e) => setTranscript(e.target.value)}
              placeholder="Or type hazard observation here (e.g. Scaffolding pipe hanging low over Bay 3 access...)"
              rows={2}
              className="mt-3 w-full rounded-lg border border-slate-800 bg-slate-900 p-2.5 text-xs text-slate-100 placeholder:text-slate-500 focus:border-amber-500 focus:outline-none"
            />
          </div>

          {/* Photo Snap */}
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1 flex items-center gap-1.5">
              <Camera className="h-3.5 w-3.5 text-amber-400" />
              Optional Hazard Photo
            </label>
            {photoPreview ? (
              <div className="relative rounded-xl overflow-hidden border border-slate-700 aspect-video max-h-40 bg-slate-950">
                <img src={photoPreview} alt="Hazard preview" className="w-full h-full object-cover" />
                <button
                  type="button"
                  onClick={() => setPhotoPreview(null)}
                  className="absolute top-2 right-2 rounded-full bg-slate-950/80 p-1 text-slate-300 hover:text-white"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
            ) : (
              <label className="flex flex-col items-center justify-center rounded-xl border border-dashed border-slate-700 bg-slate-950/50 p-4 hover:border-amber-500/50 cursor-pointer transition-colors">
                <UploadCloud className="h-6 w-6 text-slate-400" />
                <span className="text-xs text-slate-300 mt-1 font-medium">Take Photo or Upload Evidence</span>
                <span className="text-[10px] text-slate-500">JPG, PNG up to 10MB</span>
                <input type="file" accept="image/*" capture="environment" onChange={handlePhotoUpload} className="hidden" />
              </label>
            )}
          </div>

          {/* AI Categorization Action */}
          {!analysisResult && (
            <button
              type="button"
              onClick={handleRunAnalysis}
              disabled={(!transcript && !photoPreview) || isAnalyzing}
              className="w-full flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 disabled:opacity-50 px-4 py-2.5 text-xs font-bold text-slate-950 shadow-lg transition-all"
            >
              {isAnalyzing ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  <span>AI Safety Engine Categorizing Hazard...</span>
                </>
              ) : (
                <>
                  <Sparkles className="h-4 w-4" />
                  <span>Categorize Hazard with AI</span>
                </>
              )}
            </button>
          )}

          {/* AI Analysis Result Card */}
          {analysisResult && (
            <div className="rounded-xl border border-amber-500/30 bg-amber-500/10 p-4 space-y-2.5 animate-in fade-in">
              <div className="flex items-center justify-between">
                <span className="flex items-center gap-1.5 text-xs font-bold text-amber-400">
                  <AlertTriangle className="h-4 w-4" />
                  {analysisResult.category} Hazard Flagged
                </span>
                <span
                  className={`rounded px-2 py-0.5 text-[10px] font-bold ${
                    analysisResult.severity === 'CRITICAL' || analysisResult.severity === 'HIGH'
                      ? 'bg-rose-500/20 text-rose-400 border border-rose-500/40'
                      : 'bg-amber-500/20 text-amber-400'
                  }`}
                >
                  {analysisResult.severity} SEVERITY
                </span>
              </div>

              <p className="text-xs text-slate-200 font-medium leading-relaxed">
                {analysisResult.aiSummary}
              </p>

              <div className="rounded-lg bg-slate-950/70 p-2 text-xs border border-slate-800">
                <span className="font-semibold text-amber-400">Immediate Action: </span>
                <span className="text-slate-300">{analysisResult.suggestedImmediateAction}</span>
              </div>

              <button
                type="button"
                onClick={handleConfirmSubmit}
                className="w-full flex items-center justify-center gap-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 px-4 py-2.5 text-xs font-bold text-white shadow-lg transition-all"
              >
                <CheckCircle2 className="h-4 w-4" />
                <span>Submit to Site Live Alerts & Business Review</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
