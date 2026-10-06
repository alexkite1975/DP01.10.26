'use client';
import React, { useState, useEffect, useRef } from 'react';
import {
  X,
  Clock,
  Play,
  Square,
  DollarSign,
  AlertCircle,
  Truck,
  FileCheck,
  RotateCcw,
  CheckCircle2,
  TrendingUp,
  PenTool,
  Download,
  Eraser
} from 'lucide-react';
import { SiteRiskAssessment, CongestionWaitTracker } from '../types';

interface CongestionWaitTrackerModalProps {
  isOpen: boolean;
  onClose: () => void;
  site: SiteRiskAssessment;
  driverName: string;
  vehicleReg: string;
  onUpdateTracker: (siteId: string, tracker: CongestionWaitTracker) => void;
}

export const CongestionWaitTrackerModal: React.FC<CongestionWaitTrackerModalProps> = ({
  isOpen,
  onClose,
  site,
  driverName,
  vehicleReg,
  onUpdateTracker
}) => {
  const currentTracker = site.congestionTracker || {
    queueCount: 3,
    avgTurnaroundMinutes: 45,
    currentWaitMinutes: 0,
    isDemurrageTimerRunning: false,
    demurrageHourlyRate: 45.0,
    estimatedDemurrageClaim: 0
  };

  const [isRunning, setIsRunning] = useState(currentTracker.isDemurrageTimerRunning);
  const [elapsedSeconds, setElapsedSeconds] = useState(
    (currentTracker.currentWaitMinutes || 0) * 60
  );
  const [demurrageRate, setDemurrageRate] = useState(currentTracker.demurrageHourlyRate || 45.0);
  const [loggedNotification, setLoggedNotification] = useState(false);

  // Digital Signature on Glass State
  const [marshalName, setMarshalName] = useState('Dave Miller (Goods-In)');
  const [bayNumber, setBayNumber] = useState('Bay 14');
  const [isSigned, setIsSigned] = useState(false);
  const [isDrawing, setIsDrawing] = useState(false);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isRunning) {
      interval = setInterval(() => {
        setElapsedSeconds((prev) => prev + 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isRunning]);

  // Initialize Canvas
  useEffect(() => {
    if (isOpen && canvasRef.current) {
      const canvas = canvasRef.current;
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.strokeStyle = '#38bdf8'; // Sky blue ink
        ctx.lineWidth = 2.5;
        ctx.lineCap = 'round';
        ctx.lineJoin = 'round';
      }
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const minutes = Math.floor(elapsedSeconds / 60);
  const seconds = elapsedSeconds % 60;
  // Standard haulier rule: first 60 minutes free, demurrage starts after 1 hour
  const billableMinutes = Math.max(0, minutes - 60);
  const billableAmount = (billableMinutes / 60) * demurrageRate;

  // Drawing Handlers
  const startDrawing = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    setIsDrawing(true);
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    const rect = canvas.getBoundingClientRect();
    const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
    const clientY = 'touches' in e ? e.touches[0].clientY : e.clientY;
    ctx.beginPath();
    ctx.moveTo(clientX - rect.left, clientY - rect.top);
  };

  const draw = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    if (!isDrawing) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    const rect = canvas.getBoundingClientRect();
    const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
    const clientY = 'touches' in e ? e.touches[0].clientY : e.clientY;
    ctx.lineTo(clientX - rect.left, clientY - rect.top);
    ctx.stroke();
    setIsSigned(true);
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
    setIsSigned(false);
  };

  const handleToggleTimer = () => {
    const nextState = !isRunning;
    setIsRunning(nextState);

    const updated: CongestionWaitTracker = {
      queueCount: currentTracker.queueCount,
      avgTurnaroundMinutes: currentTracker.avgTurnaroundMinutes,
      currentWaitMinutes: minutes,
      isDemurrageTimerRunning: nextState,
      timerStartedAt: nextState ? new Date().toISOString() : currentTracker.timerStartedAt,
      demurrageHourlyRate: demurrageRate,
      estimatedDemurrageClaim: Math.round(billableAmount * 100) / 100
    };
    onUpdateTracker(site.id, updated);
  };

  const handleResetTimer = () => {
    setIsRunning(false);
    setElapsedSeconds(0);
    const updated: CongestionWaitTracker = {
      ...currentTracker,
      currentWaitMinutes: 0,
      isDemurrageTimerRunning: false,
      estimatedDemurrageClaim: 0
    };
    onUpdateTracker(site.id, updated);
  };

  const handleSaveToTimesheet = () => {
    setLoggedNotification(true);
    setTimeout(() => setLoggedNotification(false), 3500);
    const updated: CongestionWaitTracker = {
      ...currentTracker,
      currentWaitMinutes: minutes,
      isDemurrageTimerRunning: isRunning,
      demurrageHourlyRate: demurrageRate,
      estimatedDemurrageClaim: Math.round(billableAmount * 100) / 100
    };
    onUpdateTracker(site.id, updated);
  };

  const handleExportVoucher = () => {
    const siteTitle = (site as any).siteName || site.title || 'Logistics Depot';
    const sitePostcode = (site as any).postcode || site.address || '';

    const voucherData = {
      title: 'HGV DEMURRAGE DETENTION CLAIM VOUCHER',
      siteName: siteTitle,
      postcode: sitePostcode,
      driverName,
      vehicleReg,
      bayNumber,
      marshalName,
      arrivalTimestamp: new Date(Date.now() - elapsedSeconds * 1000).toISOString(),
      releaseTimestamp: new Date().toISOString(),
      totalWaitingMinutes: minutes,
      freeAllowanceMinutes: 60,
      billableMinutes,
      hourlyRate: `£${demurrageRate.toFixed(2)}/hr`,
      totalCharge: `£${billableAmount.toFixed(2)}`,
      digitalSignatureStatus: isSigned ? 'VERIFIED_ON_GLASS' : 'PENDING',
      rhaConditionClause: 'Subject to RHA Conditions of Carriage 2024 Section 9 (Detention of Vehicles)'
    };

    const blob = new Blob([JSON.stringify(voucherData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `Demurrage-Voucher-${vehicleReg.replace(/\s/g, '')}-${siteTitle.replace(/[^a-zA-Z0-9]/g, '_')}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur-md p-3 sm:p-4 overflow-y-auto animate-in fade-in duration-200">
      <div className="relative w-full max-w-xl rounded-3xl bg-slate-900 border border-slate-800 text-white shadow-2xl overflow-hidden flex flex-col max-h-[92vh]">
        
        {/* Header */}
        <div className="px-5 py-4 border-b border-slate-800 flex items-center justify-between bg-slate-950">
          <div className="flex items-center gap-2.5">
            <div className="h-9 w-9 rounded-2xl bg-blue-500/20 border border-blue-500/40 flex items-center justify-center text-blue-400">
              <Clock className="h-5 w-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-black tracking-wider text-blue-400 uppercase font-mono">
                  Demurrage & Billing Engine
                </span>
                <span className="text-[10px] rounded-full bg-slate-800 px-2 py-0.5 text-slate-400">
                  RHA £45/hr Standard
                </span>
              </div>
              <h3 className="text-sm font-bold text-white">Congestion & Wait-Time Tracker</h3>
            </div>
          </div>
          <button
            onClick={onClose}
            className="rounded-xl p-2 text-slate-400 hover:bg-slate-800 hover:text-white transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-5 space-y-4 overflow-y-auto">
          {/* Real-time Depot Congestion Metrics */}
          <div className="grid grid-cols-2 gap-3">
            <div className="rounded-2xl bg-slate-950 border border-slate-800 p-3.5 space-y-1">
              <div className="flex items-center gap-1.5 text-slate-400 text-xs font-bold">
                <Truck className="h-4 w-4 text-amber-400" />
                <span>Live Apron Queue</span>
              </div>
              <div className="text-2xl font-black text-amber-400">
                {currentTracker.queueCount}{' '}
                <span className="text-xs font-medium text-slate-400">HGVs waiting</span>
              </div>
              <p className="text-[10px] text-slate-400">Estimated gate queue delay</p>
            </div>

            <div className="rounded-2xl bg-slate-950 border border-slate-800 p-3.5 space-y-1">
              <div className="flex items-center gap-1.5 text-slate-400 text-xs font-bold">
                <TrendingUp className="h-4 w-4 text-cyan-400" />
                <span>Avg Turnaround</span>
              </div>
              <div className="text-2xl font-black text-cyan-300">
                {currentTracker.avgTurnaroundMinutes}{' '}
                <span className="text-xs font-medium text-slate-400">mins</span>
              </div>
              <p className="text-[10px] text-slate-400">Gate-in to bay release average</p>
            </div>
          </div>

          {/* Demurrage Clock Counter Card */}
          <div className="rounded-2xl bg-slate-950 border border-slate-800 p-5 text-center space-y-3">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
              Active Driver Demurrage Timer
            </span>

            <div className="font-mono text-4xl sm:text-5xl font-black tracking-widest text-slate-100">
              {String(Math.floor(elapsedSeconds / 3600)).padStart(2, '0')}:
              {String(minutes % 60).padStart(2, '0')}:
              {String(seconds).padStart(2, '0')}
            </div>

            <div className="flex items-center justify-center gap-3 pt-1">
              <button
                type="button"
                onClick={handleToggleTimer}
                className={`px-6 py-2.5 rounded-xl font-bold text-xs flex items-center gap-2 transition-all active:scale-95 ${
                  isRunning
                    ? 'bg-rose-500 hover:bg-rose-600 text-white shadow-lg shadow-rose-500/25'
                    : 'bg-emerald-500 hover:bg-emerald-600 text-slate-950 shadow-lg shadow-emerald-500/25'
                }`}
              >
                {isRunning ? (
                  <>
                    <Square className="h-4 w-4 fill-current" />
                    <span>Pause Timer</span>
                  </>
                ) : (
                  <>
                    <Play className="h-4 w-4 fill-current" />
                    <span>Start Arrival Clock</span>
                  </>
                )}
              </button>

              <button
                type="button"
                onClick={handleResetTimer}
                className="p-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white transition-colors"
                title="Reset Clock"
              >
                <RotateCcw className="h-4 w-4" />
              </button>
            </div>
          </div>

          {/* Demurrage Financial Claim Summary */}
          <div className="rounded-2xl bg-slate-950/70 border border-slate-800 p-4 space-y-2.5">
            <div className="flex items-center justify-between text-xs">
              <span className="text-slate-400">Total Waiting Time:</span>
              <span className="font-bold text-slate-200">{minutes} minutes</span>
            </div>
            <div className="flex items-center justify-between text-xs">
              <span className="text-slate-400">Free Demurrage Allowance:</span>
              <span className="font-bold text-slate-300">First 60 minutes (Standard RHA)</span>
            </div>
            <div className="flex items-center justify-between text-xs">
              <span className="text-slate-400">Billable Excess Time:</span>
              <span className="font-bold text-amber-400">{billableMinutes} minutes</span>
            </div>
            <div className="flex items-center justify-between text-xs pt-2 border-t border-slate-800">
              <span className="font-bold text-slate-200">Accrued Demurrage Claim (£45/hr):</span>
              <span className="text-base font-black text-emerald-400">
                £{billableAmount.toFixed(2)}
              </span>
            </div>
          </div>

          {/* Digital Signature on Glass (Yard Marshal Sign-off) */}
          <div className="rounded-2xl bg-slate-950 border border-slate-800 p-4 space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <PenTool className="w-4 h-4 text-sky-400" />
                <h4 className="text-xs font-bold text-white uppercase tracking-wider">
                  Marshal Sign on Glass (Detention Sign-off)
                </h4>
              </div>
              <button
                onClick={clearSignature}
                className="text-[11px] text-slate-400 hover:text-rose-400 flex items-center gap-1 transition-colors"
              >
                <Eraser className="w-3 h-3" />
                Clear
              </button>
            </div>

            <div className="grid grid-cols-2 gap-2">
              <input
                type="text"
                value={marshalName}
                onChange={(e) => setMarshalName(e.target.value)}
                placeholder="Yard Marshal Name"
                className="bg-slate-900 border border-slate-800 rounded-lg px-2.5 py-1 text-xs text-white placeholder:text-slate-600 focus:outline-none focus:border-sky-400"
              />
              <input
                type="text"
                value={bayNumber}
                onChange={(e) => setBayNumber(e.target.value)}
                placeholder="Bay / Loading Dock #"
                className="bg-slate-900 border border-slate-800 rounded-lg px-2.5 py-1 text-xs text-white placeholder:text-slate-600 focus:outline-none focus:border-sky-400"
              />
            </div>

            {/* Signature Canvas Pad */}
            <div className="relative border-2 border-dashed border-slate-700/80 rounded-xl overflow-hidden bg-slate-900/60 touch-none">
              <canvas
                ref={canvasRef}
                width={480}
                height={120}
                onMouseDown={startDrawing}
                onMouseMove={draw}
                onMouseUp={stopDrawing}
                onMouseLeave={stopDrawing}
                onTouchStart={startDrawing}
                onTouchMove={draw}
                onTouchEnd={stopDrawing}
                className="w-full h-[120px] cursor-crosshair"
              />
              {!isSigned && (
                <div className="absolute inset-0 pointer-events-none flex items-center justify-center text-slate-600 text-xs font-semibold">
                  Sign here on glass to authorize detention hours
                </div>
              )}
            </div>

            {isSigned && (
              <div className="flex items-center gap-2 text-emerald-400 text-xs font-bold">
                <CheckCircle2 className="w-4 h-4" />
                <span>Legally Binding Digital Sign-off Captured</span>
              </div>
            )}
          </div>

          {loggedNotification && (
            <div className="p-3 rounded-xl bg-emerald-950/50 border border-emerald-500/40 text-emerald-300 text-xs flex items-center gap-2 animate-in fade-in">
              <CheckCircle2 className="h-4 w-4 shrink-0" />
              <span>Demurrage record successfully logged to Friday Payroll timesheet!</span>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-slate-800 bg-slate-950 flex flex-col sm:flex-row items-center justify-between gap-3">
          <button
            type="button"
            onClick={handleExportVoucher}
            className="w-full sm:w-auto py-2 px-3 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 border border-slate-700 transition-colors"
          >
            <Download className="w-3.5 h-3.5 text-sky-400" />
            <span>Export RHA Voucher (JSON)</span>
          </button>

          <button
            type="button"
            onClick={handleSaveToTimesheet}
            className="w-full sm:w-auto py-2.5 px-5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs shadow-md shadow-blue-600/20 transition-all active:scale-95 flex items-center justify-center gap-1.5"
          >
            <FileCheck className="h-4 w-4" />
            <span>Save Waiting Timecard</span>
          </button>
        </div>
      </div>
    </div>
  );
};
