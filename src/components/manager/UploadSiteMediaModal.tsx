'use client';
import React, { useState, useRef } from 'react';
import {
  Camera,
  Video,
  Upload,
  Sparkles,
  CheckCircle2,
  X,
  Trash2,
  AlertTriangle,
  Building2,
  Truck,
  Layers,
  Info,
  Compass,
  ArrowRight,
  ShieldCheck
} from 'lucide-react';
import { SiteRiskAssessment, SitePlanAnnotation } from '../types';
import {
  UploadedMediaItem,
  improveSitePlanFromMedia,
  SitePlanMediaEnhancementResult
} from '../services/sitePlanMediaEnhancer';

interface UploadSiteMediaModalProps {
  isOpen: boolean;
  onClose: () => void;
  site: SiteRiskAssessment;
  onApplyImprovements: (newAnnotations: SitePlanAnnotation[], summary: string) => void;
}

export const UploadSiteMediaModal: React.FC<UploadSiteMediaModalProps> = ({
  isOpen,
  onClose,
  site,
  onApplyImprovements
}) => {
  const [mediaItems, setMediaItems] = useState<UploadedMediaItem[]>([]);
  const [userNotes, setUserNotes] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [analysisResult, setAnalysisResult] = useState<SitePlanMediaEnhancementResult | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const cameraInputRef = useRef<HTMLInputElement>(null);

  if (!isOpen) return null;

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;
    processFiles(Array.from(files));
  };

  const processFiles = (files: File[]) => {
    setErrorMessage(null);
    files.forEach((file) => {
      const isVideo = file.type.startsWith('video/');
      const isImage = file.type.startsWith('image/');

      if (!isVideo && !isImage) {
        setErrorMessage('Please upload photo images (JPG, PNG, WebP) or video clips (MP4, MOV).');
        return;
      }

      if (file.size > 25 * 1024 * 1024) {
        setErrorMessage('File size exceeds 25MB limit. Please choose a smaller video clip or image.');
        return;
      }

      const reader = new FileReader();
      reader.onload = (event) => {
        const dataUrl = event.target?.result as string;
        if (dataUrl) {
          const newItem: UploadedMediaItem = {
            id: `media-${Date.now()}-${Math.random().toString(36).substr(2, 6)}`,
            dataUrl,
            mediaType: isVideo ? 'VIDEO' : 'PHOTO',
            fileName: file.name,
            sizeBytes: file.size,
            previewUrl: dataUrl,
            timestamp: new Date().toISOString()
          };
          setMediaItems((prev) => [...prev, newItem]);
        }
      };
      reader.readAsDataURL(file);
    });
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      processFiles(Array.from(e.dataTransfer.files));
    }
  };

  const handleRemoveMedia = (id: string) => {
    setMediaItems((prev) => prev.filter((item) => item.id !== id));
  };

  const handleAnalyzeWithAI = async () => {
    if (mediaItems.length === 0) {
      setErrorMessage('Please capture or upload at least one photo or video of the site.');
      return;
    }

    setIsProcessing(true);
    setErrorMessage(null);

    try {
      const result = await improveSitePlanFromMedia(site, mediaItems, userNotes);
      setAnalysisResult(result);
    } catch (err: any) {
      setErrorMessage(err.message || 'Failed to process media with AI.');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleConfirmApply = () => {
    if (!analysisResult) return;
    onApplyImprovements(analysisResult.newAnnotations, analysisResult.summary);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-3 sm:p-4 animate-in fade-in">
      <div className="w-full max-w-2xl max-h-[90vh] flex flex-col rounded-2xl bg-white shadow-2xl border border-slate-200 overflow-hidden">
        {/* Modal Header */}
        <div className="flex items-center justify-between border-b border-slate-200 px-5 py-3.5 bg-slate-50/80">
          <div className="flex items-center gap-2.5">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-tr from-blue-600 to-indigo-600 text-white font-bold shadow-xs">
              <Sparkles className="h-5 w-5 text-amber-300" />
            </div>
            <div>
              <h2 className="text-sm sm:text-base font-bold text-slate-900 flex items-center gap-1.5">
                <span>AI Site Plan Enhancer</span>
                <span className="rounded bg-indigo-100 text-indigo-800 text-[10px] font-extrabold px-1.5 py-0.2">
                  Vision
                </span>
              </h2>
              <p className="text-[11px] text-slate-500">
                Upload yard photos or video to map loading bays & transport office
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-200 hover:text-slate-700 transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="flex-1 overflow-y-auto p-5 space-y-4">
          {/* Error Banner */}
          {errorMessage && (
            <div className="flex items-start gap-2 rounded-xl bg-rose-50 border border-rose-200 p-3 text-xs text-rose-800 animate-in fade-in">
              <AlertTriangle className="h-4 w-4 text-rose-600 shrink-0 mt-0.5" />
              <span>{errorMessage}</span>
            </div>
          )}

          {!analysisResult ? (
            <>
              {/* Instructions */}
              <div className="rounded-xl border border-blue-100 bg-blue-50/60 p-3 text-xs text-blue-900 space-y-1">
                <p className="font-semibold flex items-center gap-1.5">
                  <ShieldCheck className="h-4 w-4 text-blue-600 shrink-0" />
                  <span>How AI Improves Your Site Plan:</span>
                </p>
                <p className="text-[11px] text-blue-800 leading-relaxed">
                  Record a walk around the yard or upload photos of <strong>Bay numbers</strong>, the{' '}
                  <strong>Transport Office / Driver Reception</strong>, gatehouse, and apron. Gemini
                  AI will recognize landmarks, calculate yard positions, and add interactive CAD pins
                  with your real photos attached.
                </p>
              </div>

              {/* Upload Dropzone & Action Buttons */}
              <div
                onDragOver={(e) => e.preventDefault()}
                onDrop={handleDrop}
                className="rounded-2xl border-2 border-dashed border-slate-300 hover:border-blue-500 bg-slate-50/70 p-5 text-center transition-all space-y-3 cursor-pointer"
                onClick={() => fileInputRef.current?.click()}
              >
                <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-white shadow-xs border border-slate-200 text-blue-600">
                  <Upload className="h-6 w-6" />
                </div>
                <div>
                  <p className="text-xs font-bold text-slate-800">
                    Click to select yard photos or video clip
                  </p>
                  <p className="text-[11px] text-slate-500 mt-0.5">
                    Drag and drop images or MP4 video here (max 25MB)
                  </p>
                </div>

                {/* Mobile Camera Direct Buttons */}
                <div className="flex flex-wrap items-center justify-center gap-2 pt-1" onClick={(e) => e.stopPropagation()}>
                  <button
                    type="button"
                    onClick={() => cameraInputRef.current?.click()}
                    className="flex items-center gap-1.5 rounded-xl border border-slate-300 bg-white hover:bg-slate-100 px-3 py-1.5 text-xs font-bold text-slate-700 shadow-2xs transition-colors"
                  >
                    <Camera className="h-3.5 w-3.5 text-blue-600" />
                    <span>Take Photo</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="flex items-center gap-1.5 rounded-xl border border-slate-300 bg-white hover:bg-slate-100 px-3 py-1.5 text-xs font-bold text-slate-700 shadow-2xs transition-colors"
                  >
                    <Video className="h-3.5 w-3.5 text-cyan-600" />
                    <span>Upload Video / Gallery</span>
                  </button>
                </div>

                {/* Hidden Inputs */}
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*,video/*"
                  multiple
                  onChange={handleFileSelect}
                  className="hidden"
                />
                <input
                  ref={cameraInputRef}
                  type="file"
                  accept="image/*"
                  capture="environment"
                  onChange={handleFileSelect}
                  className="hidden"
                />
              </div>

              {/* Uploaded Media Thumbnails */}
              {mediaItems.length > 0 && (
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-bold text-slate-700">
                      Uploaded Media ({mediaItems.length})
                    </span>
                    <button
                      onClick={() => setMediaItems([])}
                      className="text-slate-400 hover:text-rose-600 text-[11px] font-semibold"
                    >
                      Clear all
                    </button>
                  </div>

                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                    {mediaItems.map((item, idx) => (
                      <div
                        key={item.id}
                        className="relative group rounded-xl border border-slate-200 bg-white overflow-hidden shadow-2xs"
                      >
                        {item.mediaType === 'VIDEO' ? (
                          <div className="h-24 bg-slate-900 flex flex-col items-center justify-center text-white">
                            <Video className="h-6 w-6 text-cyan-400 mb-1" />
                            <span className="text-[10px] font-mono">Video Clip</span>
                          </div>
                        ) : (
                          <img
                            src={item.dataUrl}
                            alt="Upload preview"
                            className="h-24 w-full object-cover"
                          />
                        )}

                        <button
                          type="button"
                          onClick={() => handleRemoveMedia(item.id)}
                          className="absolute top-1 right-1 rounded-full bg-slate-900/80 text-white p-1 opacity-80 hover:opacity-100 transition-opacity"
                          title="Remove media"
                        >
                          <X className="h-3 w-3" />
                        </button>

                        <div className="p-1.5 text-[10px] bg-white border-t border-slate-100 flex items-center justify-between">
                          <span className="truncate font-semibold text-slate-700">
                            #{idx + 1} {item.fileName}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Surveyor / Driver Notes */}
              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-700 flex items-center justify-between">
                  <span>Optional Notes (what did you capture?):</span>
                  <span className="text-[11px] text-slate-400 font-normal">e.g. Bays 1-12, Transport Hatch</span>
                </label>
                <input
                  type="text"
                  value={userNotes}
                  onChange={(e) => setUserNotes(e.target.value)}
                  placeholder="e.g. Captured Bays 12 to 16, transport office driver door, and canopy clearance"
                  className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-xs text-slate-900 placeholder:text-slate-400 focus:border-blue-500 focus:bg-white focus:outline-none"
                />
              </div>
            </>
          ) : (
            /* AI Results Review Screen */
            <div className="space-y-4 animate-in fade-in">
              <div className="rounded-2xl border border-emerald-200 bg-emerald-50/80 p-4 space-y-2">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="h-5 w-5 text-emerald-600 shrink-0" />
                  <h3 className="text-xs sm:text-sm font-bold text-emerald-950">
                    AI Spatial Analysis Complete
                  </h3>
                </div>
                <p className="text-xs text-emerald-900 leading-relaxed font-medium">
                  {analysisResult.summary}
                </p>
              </div>

              {/* Detected Landmarks Summary */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                {analysisResult.detectedBayNumbers.length > 0 && (
                  <div className="rounded-xl border border-slate-200 bg-white p-3 space-y-1.5 shadow-2xs">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1">
                      <Truck className="h-3.5 w-3.5 text-blue-600" />
                      <span>Detected Loading Bays</span>
                    </span>
                    <div className="flex flex-wrap gap-1">
                      {analysisResult.detectedBayNumbers.map((bay, i) => (
                        <span
                          key={i}
                          className="rounded-md bg-emerald-50 text-emerald-800 border border-emerald-200 px-2 py-0.5 text-xs font-black"
                        >
                          {bay}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {analysisResult.detectedTransportOffice && (
                  <div className="rounded-xl border border-slate-200 bg-white p-3 space-y-1.5 shadow-2xs">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1">
                      <Building2 className="h-3.5 w-3.5 text-cyan-600" />
                      <span>Transport Office</span>
                    </span>
                    <span className="inline-block rounded-md bg-cyan-50 text-cyan-800 border border-cyan-200 px-2 py-0.5 text-xs font-bold">
                      ✓ Driver Reception Door Located
                    </span>
                  </div>
                )}
              </div>

              {/* New Pins Preview List */}
              <div className="space-y-2">
                <h4 className="text-xs font-bold text-slate-800 flex items-center justify-between">
                  <span>New CAD Pins Ready to Merge ({analysisResult.newAnnotations.length})</span>
                  <span className="text-[11px] font-normal text-slate-500">Includes photo thumbnails</span>
                </h4>

                <div className="space-y-2 max-h-56 overflow-y-auto pr-1">
                  {analysisResult.newAnnotations.map((ann, i) => (
                    <div
                      key={ann.id}
                      className="flex items-center gap-3 rounded-xl border border-slate-200 bg-white p-2.5 shadow-2xs hover:border-blue-300 transition-colors"
                    >
                      {ann.photoUrl ? (
                        <img
                          src={ann.photoUrl}
                          alt={ann.label}
                          className="h-11 w-11 rounded-lg object-cover shrink-0 border border-slate-100"
                        />
                      ) : (
                        <div className="flex h-11 w-11 items-center justify-center rounded-lg bg-blue-50 text-blue-600 shrink-0 font-bold text-xs">
                          CAD
                        </div>
                      )}

                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-1.5">
                          <span className="font-bold text-slate-900 text-xs truncate">
                            {ann.label}
                          </span>
                          <span className="rounded bg-indigo-50 text-indigo-700 text-[9px] font-extrabold px-1.5 py-0.2">
                            AI {(ann.aiConfidence ? Math.round(ann.aiConfidence * 100) : 94)}%
                          </span>
                        </div>
                        <p className="text-[11px] text-slate-500 truncate mt-0.5">
                          {ann.description}
                        </p>
                      </div>

                      <div className="text-right shrink-0 text-[10px] font-mono text-slate-400">
                        x: {ann.xPercent}%, y: {ann.yPercent}%
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Driver Navigation Tips from Photos */}
              {analysisResult.driverNavigationTips.length > 0 && (
                <div className="rounded-xl border border-blue-200 bg-blue-50/50 p-3 text-xs text-blue-900 space-y-1">
                  <span className="font-bold text-[11px] uppercase tracking-wider text-blue-800">
                    Driver In-Cab Guidance:
                  </span>
                  <ul className="list-disc list-inside space-y-0.5 text-[11px] text-slate-700">
                    {analysisResult.driverNavigationTips.map((tip, idx) => (
                      <li key={idx}>{tip}</li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="flex items-center justify-between border-t border-slate-200 px-5 py-3.5 bg-slate-50/80">
          <button
            type="button"
            onClick={onClose}
            className="rounded-xl border border-slate-200 bg-white hover:bg-slate-100 px-4 py-2 text-xs font-bold text-slate-700 transition-colors"
          >
            Cancel
          </button>

          {!analysisResult ? (
            <button
              type="button"
              disabled={isProcessing || mediaItems.length === 0}
              onClick={handleAnalyzeWithAI}
              className={`flex items-center gap-2 rounded-xl px-4 py-2 text-xs font-bold text-white shadow-xs transition-all ${
                isProcessing || mediaItems.length === 0
                  ? 'bg-slate-300 cursor-not-allowed text-slate-500'
                  : 'bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 active:scale-98 shadow-blue-600/20'
              }`}
            >
              {isProcessing ? (
                <>
                  <span className="h-3.5 w-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  <span>Gemini AI Analyzing Media...</span>
                </>
              ) : (
                <>
                  <Sparkles className="h-3.5 w-3.5 text-amber-300" />
                  <span>Improve Site Plan with AI</span>
                </>
              )}
            </button>
          ) : (
            <button
              type="button"
              onClick={handleConfirmApply}
              className="flex items-center gap-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 px-4 py-2 text-xs font-bold text-white shadow-xs transition-all active:scale-98"
            >
              <CheckCircle2 className="h-3.5 w-3.5" />
              <span>Apply {analysisResult.newAnnotations.length} Pins to Site Plan</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
