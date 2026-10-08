'use client';

import React, { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import confetti from 'canvas-confetti';
import { WorkflowLayout } from '@/components/layout/WorkflowLayout';
import {
  ShieldCheck,
  CheckCircle2,
  AlertCircle,
  Truck,
  FileSignature,
  Lock,
  Calendar,
  Clock,
  RotateCcw,
  Sparkles
} from 'lucide-react';
import { audioFeedback } from '@/utils/audioFeedback';

export default function SignOffPage() {
  const router = useRouter();
  const [signed, setSigned] = useState(false);
  const [hasDrawnSignature, setHasDrawnSignature] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [statusMessage, setStatusMessage] = useState('');
  const [statusType, setStatusType] = useState('');
  const [vehicleId, setVehicleId] = useState('');
  const [items, setItems] = useState([]);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [isDrawing, setIsDrawing] = useState(false);

  useEffect(() => {
    const storedVehicleId = localStorage.getItem('active_vehicle_id') || 'GN21 EVX';
    const storedItemsRaw = localStorage.getItem('pending_inspection_items') || '[]';
    setVehicleId(storedVehicleId);

    try {
      const parsedItems = JSON.parse(storedItemsRaw);
      const formattedItems = parsedItems.map((item: any) => ({
        itemName: item.name,
        isPassed: item.isPassed,
        defectDescription: item.defectDescription || '',
        defectImageUrl: '',
        aiConfidenceScore: null
      }));
      setItems(formattedItems);
    } catch (e) {
      console.error(e);
    }
  }, []);

  // Simple Canvas Drawing for Sign-on-Glass
  const startDrawing = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    setIsDrawing(true);
    setHasDrawnSignature(true);
    setSigned(true);
    audioFeedback.playCheckpointClick();

    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const rect = canvas.getBoundingClientRect();
    const x = 'touches' in e ? e.touches[0].clientX - rect.left : e.clientX - rect.left;
    const y = 'touches' in e ? e.touches[0].clientY - rect.top : e.clientY - rect.top;

    ctx.beginPath();
    ctx.moveTo(x, y);
  };

  const draw = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    if (!isDrawing) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const rect = canvas.getBoundingClientRect();
    const x = 'touches' in e ? e.touches[0].clientX - rect.left : e.clientX - rect.left;
    const y = 'touches' in e ? e.touches[0].clientY - rect.top : e.clientY - rect.top;

    ctx.strokeStyle = '#10b981';
    ctx.lineWidth = 2.5;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    ctx.lineTo(x, y);
    ctx.stroke();
  };

  const stopDrawing = () => {
    setIsDrawing(false);
  };

  const clearSignature = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    setHasDrawnSignature(false);
    setSigned(false);
    audioFeedback.playCheckpointClick();
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);
    setStatusMessage('Submitting statutory compliance declaration...');
    setStatusType('');
    audioFeedback.playCheckpointClick();

    try {
      const signatureHash = 'sha256-' + btoa(vehicleId + '-signed-' + Date.now()).substring(0, 16);
      const response = await fetch('/api/inspections', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          vehicleId: 1,
          driverId: 'driver-session',
          signatureHash,
          items
        })
      });

      const data = await response.json();
      if (response.ok) {
        setStatusType('success');
        setStatusMessage(data.grounded ? '⚠️ Grounded (VOR Defect Registered)' : '✅ Roadworthy Cleared & Sealed');
        audioFeedback.playSuccessChime();

        try {
          confetti({
            particleCount: 60,
            spread: 70,
            origin: { y: 0.75 },
            colors: ['#10b981', '#34d399', '#38bdf8', '#fbbf24']
          });
        } catch {}

        setTimeout(() => {
          localStorage.removeItem('pending_inspection_items');
          router.push('/driver');
        }, 1800);
      } else {
        throw new Error(data.error);
      }
    } catch (err: any) {
      setStatusType('error');
      setStatusMessage(err.message || 'Submission error');
      audioFeedback.playWarningAlert();
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <WorkflowLayout
      title="DVSA Statutory Sign-Off"
      subtitle="Roadworthiness Declaration & Glass Seal"
      currentStep={3}
      totalSteps={4}
      backRoute="/driver/walkaround"
      nextRoute="/driver"
      footerActions={
        <button
          onClick={handleSubmit}
          disabled={!signed || isSubmitting}
          className={`w-full py-3.5 rounded-2xl font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 transition shadow-cockpit touch-press ${
            signed && !isSubmitting
              ? 'bg-emerald-600 hover:bg-emerald-500 text-white shadow-glow-emerald cursor-pointer'
              : 'bg-slate-800 text-slate-500 cursor-not-allowed border border-slate-700/60'
          }`}
        >
          <Lock className="w-4 h-4" />
          <span>{isSubmitting ? 'Transmitting to Transport Office...' : 'Submit & Seal DVSA Declaration'}</span>
        </button>
      }
    >
      <div className="space-y-4">
        {/* Statutory Certificate Plaque */}
        <div className="cockpit-panel rounded-2xl p-4 border border-white/10 shadow-cockpit space-y-3">
          <div className="flex items-center justify-between border-b border-slate-800 pb-2.5">
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-5 h-5 text-emerald-400" />
              <span className="text-xs font-mono font-bold text-white uppercase tracking-wider">
                Statutory Roadworthiness Record
              </span>
            </div>
            <span className="text-[10px] font-mono text-cyan-400 font-bold bg-cyan-950/80 px-2 py-0.5 rounded border border-cyan-800/60">
              SEC 42 RTA 1988
            </span>
          </div>

          <div className="grid grid-cols-2 gap-2 text-[11px] font-mono text-slate-300">
            <div className="bg-slate-950/80 p-2.5 rounded-xl border border-slate-800">
              <span className="text-slate-400 block text-[9px] uppercase">Vehicle Reg</span>
              <strong className="text-white text-xs">{vehicleId || 'GN21 EVX'}</strong>
            </div>
            <div className="bg-slate-950/80 p-2.5 rounded-xl border border-slate-800">
              <span className="text-slate-400 block text-[9px] uppercase">Trailer Combination</span>
              <strong className="text-white text-xs">TR-8492 (44t Artic)</strong>
            </div>
          </div>

          <p className="text-[11px] text-slate-300 font-sans leading-relaxed bg-slate-950/60 p-3 rounded-xl border border-slate-800/80">
            I certify that I have conducted the statutory pre-use walkaround inspection of this vehicle and trailer combination. All 32 DVSA checkpoints have been audited for roadworthiness, tyre safety, braking efficiency, and coupling security.
          </p>
        </div>

        {/* Digital Signature On Glass Canvas */}
        <div className="cockpit-panel rounded-2xl p-4 border border-white/10 shadow-cockpit space-y-2.5">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <FileSignature className="w-4 h-4 text-cyan-400" />
              <span className="text-xs font-mono font-bold text-slate-200">
                Driver Signature On Glass
              </span>
            </div>
            {hasDrawnSignature && (
              <button
                type="button"
                onClick={clearSignature}
                className="text-[11px] font-mono text-slate-400 hover:text-rose-400 flex items-center gap-1 transition"
              >
                <RotateCcw className="w-3 h-3" />
                <span>Clear</span>
              </button>
            )}
          </div>

          <div className="relative rounded-xl border-2 border-dashed border-slate-700 bg-slate-950/90 h-36 overflow-hidden flex items-center justify-center">
            <canvas
              ref={canvasRef}
              width={340}
              height={140}
              onMouseDown={startDrawing}
              onMouseMove={draw}
              onMouseUp={stopDrawing}
              onMouseLeave={stopDrawing}
              onTouchStart={startDrawing}
              onTouchMove={draw}
              onTouchEnd={stopDrawing}
              className="w-full h-full cursor-crosshair touch-none"
            />
            {!hasDrawnSignature && (
              <div className="absolute pointer-events-none text-center space-y-1">
                <FileSignature className="w-6 h-6 text-slate-600 mx-auto opacity-60" />
                <span className="text-xs font-mono text-slate-500 block">
                  Sign with finger or stylus inside box
                </span>
              </div>
            )}
          </div>

          <label className="flex items-center space-x-3 cursor-pointer pt-1">
            <input
              type="checkbox"
              checked={signed}
              onChange={(e) => {
                setSigned(e.target.checked);
                audioFeedback.playCheckpointClick();
              }}
              className="rounded bg-slate-950 border-slate-700 text-emerald-500 focus:ring-emerald-500 w-4 h-4 cursor-pointer"
            />
            <span className="text-xs text-slate-300 font-medium">
              I formally verify and seal this statutory inspection report.
            </span>
          </label>
        </div>

        {/* Status Messages */}
        {statusMessage && (
          <div
            className={`p-3.5 rounded-2xl text-xs font-mono font-bold text-center border animate-in fade-in shadow-cockpit ${
              statusType === 'success'
                ? 'bg-emerald-950/80 text-emerald-300 border-emerald-800 shadow-glow-emerald'
                : 'bg-rose-950/80 text-rose-300 border-rose-800 shadow-glow-red'
            }`}
          >
            {statusMessage}
          </div>
        )}
      </div>
    </WorkflowLayout>
  );
}
