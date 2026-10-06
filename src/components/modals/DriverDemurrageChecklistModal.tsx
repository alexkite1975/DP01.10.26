'use client';
import React, { useState } from 'react';
import {
  X,
  FileText,
  Clock,
  CheckSquare,
  Square,
  AlertTriangle,
  Camera,
  PhoneCall,
  ShieldCheck,
  MapPin,
  CheckCircle2,
  Printer
} from 'lucide-react';
import { DriverVehicleProfile } from '../../types';

interface DriverDemurrageChecklistModalProps {
  isOpen: boolean;
  onClose: () => void;
  driverVehicle: DriverVehicleProfile;
  currentSiteName?: string;
}

export const DriverDemurrageChecklistModal: React.FC<DriverDemurrageChecklistModalProps> = ({
  isOpen,
  onClose,
  driverVehicle,
  currentSiteName = 'DIRFT Logistics Park - Sainsbury\'s RDC'
}) => {
  const [checkedItems, setCheckedItems] = useState<Record<number, boolean>>({});
  const [arrivalTime, setArrivalTime] = useState<string>('08:45');
  const [freeTimeExpires, setFreeTimeExpires] = useState<string>('10:45');
  const [bayDelayReason, setBayDelayReason] = useState<string>('DOCK_FULL');
  const [isRefusalMode, setIsRefusalMode] = useState<boolean>(false);
  const [refusalPhotoTaken, setRefusalPhotoTaken] = useState<boolean>(false);

  if (!isOpen) return null;

  const toggleCheck = (idx: number) => {
    setCheckedItems((prev) => ({ ...prev, [idx]: !prev[idx] }));
  };

  const handleSimulateRefusalPhoto = () => {
    setRefusalPhotoTaken(true);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-slate-950/85 backdrop-blur-md overflow-y-auto">
      <div className="relative w-full max-w-2xl bg-slate-900 border-2 border-amber-500/50 rounded-3xl shadow-2xl p-5 sm:p-7 text-slate-100 max-h-[92vh] overflow-y-auto space-y-5">
        
        {/* Header */}
        <div className="flex items-start justify-between pb-3 border-b border-slate-800">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-amber-500 text-slate-950 flex items-center justify-center shadow-lg shadow-amber-500/30 font-black">
              <Clock className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base sm:text-lg font-black text-amber-400">
                  HGV DRIVER WAITING TIME CHECKLIST
                </h2>
                <span className="rounded bg-amber-500/20 text-amber-300 text-[10px] font-mono font-bold px-2 py-0.5 border border-amber-500/30">
                  SOP-OPS-014
                </span>
              </div>
              <p className="text-xs text-slate-400 mt-0.5">
                RHA Conditions of Carriage • Condition 16 (Unreasonable Detention • £60.00/hr)
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-9 h-9 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white flex items-center justify-center transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Vehicle & Site Badge */}
        <div className="flex items-center justify-between p-3 rounded-xl bg-slate-950 border border-slate-800 text-xs">
          <div>Site: <strong className="text-white">{currentSiteName}</strong></div>
          <div className="font-mono text-cyan-400 font-bold">{driverVehicle.vehicleReg} • {driverVehicle.driverName}</div>
        </div>

        {/* 6-Step In-Cab Checklist */}
        <div className="space-y-3 font-mono text-xs">
          
          {/* STEP 1: ARRIVAL RECORD */}
          <div
            onClick={() => toggleCheck(1)}
            className={`p-3.5 rounded-xl border cursor-pointer transition-all flex items-start gap-3 ${
              checkedItems[1] ? 'bg-emerald-950/20 border-emerald-500/50 text-emerald-200' : 'bg-slate-950/70 border-slate-800 text-slate-300'
            }`}
          >
            <div className="mt-0.5 text-amber-400">
              {checkedItems[1] ? <CheckSquare className="w-5 h-5 text-emerald-400" /> : <Square className="w-5 h-5 text-slate-500" />}
            </div>
            <div className="flex-1 space-y-1 font-sans">
              <div className="font-bold text-xs flex items-center justify-between">
                <span>1. ARRIVAL RECORD (AT PERIMETER GATE)</span>
                <span className="text-[10px] font-mono text-cyan-400">Time: {arrivalTime}</span>
              </div>
              <p className="text-[11px] text-slate-400">
                Arrive within scheduled booking window. Record gatehouse arrival time immediately and request security write arrival time on POD / entry slip.
              </p>
            </div>
          </div>

          {/* STEP 2: FREE-TIME TRACKING */}
          <div
            onClick={() => toggleCheck(2)}
            className={`p-3.5 rounded-xl border cursor-pointer transition-all flex items-start gap-3 ${
              checkedItems[2] ? 'bg-emerald-950/20 border-emerald-500/50 text-emerald-200' : 'bg-slate-950/70 border-slate-800 text-slate-300'
            }`}
          >
            <div className="mt-0.5 text-amber-400">
              {checkedItems[2] ? <CheckSquare className="w-5 h-5 text-emerald-400" /> : <Square className="w-5 h-5 text-slate-500" />}
            </div>
            <div className="flex-1 space-y-1 font-sans">
              <div className="font-bold text-xs flex items-center justify-between">
                <span>2. FREE-TIME TRACKING (2 HOURS ALLOWANCE)</span>
                <span className="text-[10px] font-mono text-amber-400">Expires: {freeTimeExpires}</span>
              </div>
              <p className="text-[11px] text-slate-400">
                Standard contractual allowance is 2 hours from gate arrival. Demurrage accrues at <strong>£60.00/hr + VAT</strong> in 15-minute increments thereafter.
              </p>
            </div>
          </div>

          {/* STEP 3: 60-MINUTE ALERT */}
          <div
            className={`p-3.5 rounded-xl border transition-all space-y-2 ${
              checkedItems[3] ? 'bg-emerald-950/20 border-emerald-500/50 text-emerald-200' : 'bg-slate-950/70 border-slate-800 text-slate-300'
            }`}
          >
            <div className="flex items-start gap-3 cursor-pointer" onClick={() => toggleCheck(3)}>
              <div className="mt-0.5 text-amber-400">
                {checkedItems[3] ? <CheckSquare className="w-5 h-5 text-emerald-400" /> : <Square className="w-5 h-5 text-slate-500" />}
              </div>
              <div className="flex-1 font-sans">
                <div className="font-bold text-xs flex items-center justify-between">
                  <span>3. 60-MINUTE CHECK-IN ALERT</span>
                  <span className="text-[10px] font-mono text-rose-400">Call Dispatch</span>
                </div>
                <p className="text-[11px] text-slate-400">
                  Still not on a bay at 1 hour? Call dispatch desk immediately with the delay reason given by site staff:
                </p>
              </div>
            </div>
            <div className="flex flex-wrap gap-2 pl-8 pt-1">
              {[
                { id: 'DOCK_FULL', label: 'Dock Bays Full' },
                { id: 'STOCK_NOT_READY', label: 'Stock Not Picked' },
                { id: 'STAFF_SHORTAGE', label: 'FLT Staff Shortage' }
              ].map((r) => (
                <button
                  key={r.id}
                  onClick={() => setBayDelayReason(r.id)}
                  className={`px-2.5 py-1 rounded-lg text-[10px] font-bold border transition-all ${
                    bayDelayReason === r.id
                      ? 'bg-amber-500 text-slate-950 border-amber-400 font-extrabold'
                      : 'bg-slate-900 border-slate-700 text-slate-400'
                  }`}
                >
                  {r.label}
                </button>
              ))}
            </div>
          </div>

          {/* STEP 4: PERIMETER DISCIPLINE */}
          <div
            onClick={() => toggleCheck(4)}
            className={`p-3.5 rounded-xl border cursor-pointer transition-all flex items-start gap-3 ${
              checkedItems[4] ? 'bg-emerald-950/20 border-emerald-500/50 text-emerald-200' : 'bg-slate-950/70 border-slate-800 text-slate-300'
            }`}
          >
            <div className="mt-0.5 text-amber-400">
              {checkedItems[4] ? <CheckSquare className="w-5 h-5 text-emerald-400" /> : <Square className="w-5 h-5 text-slate-500" />}
            </div>
            <div className="flex-1 space-y-1 font-sans">
              <div className="font-bold text-xs text-rose-400">4. DO NOT LEAVE THE SITE PERIMETER (CRITICAL)</div>
              <p className="text-[11px] text-slate-400">
                You must remain inside site perimeter. Driving to an off-site layby to take a break stops the demurrage clock and voids the claim under RHA Condition 16.
              </p>
            </div>
          </div>

          {/* STEP 5: DEPARTURE DUAL-TIME SIGN-OFF */}
          <div
            onClick={() => toggleCheck(5)}
            className={`p-3.5 rounded-xl border cursor-pointer transition-all flex items-start gap-3 ${
              checkedItems[5] ? 'bg-emerald-950/20 border-emerald-500/50 text-emerald-200' : 'bg-slate-950/70 border-slate-800 text-slate-300'
            }`}
          >
            <div className="mt-0.5 text-amber-400">
              {checkedItems[5] ? <CheckSquare className="w-5 h-5 text-emerald-400" /> : <Square className="w-5 h-5 text-slate-500" />}
            </div>
            <div className="flex-1 space-y-1 font-sans">
              <div className="font-bold text-xs text-cyan-300">5. DEPARTURE DUAL-TIME SIGN-OFF ON POD</div>
              <p className="text-[11px] text-slate-400">
                Ensure receiver writes ALL 4: Arrival Time, Departure Time, Legible Printed Name, and Dock Signature / Stamp.
              </p>
            </div>
          </div>

          {/* STEP 6: HANDLING REFUSAL TO SIGN */}
          <div className="p-3.5 rounded-xl border border-rose-500/40 bg-rose-950/20 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-black text-rose-400 font-sans flex items-center gap-1.5">
                <AlertTriangle className="w-4 h-4 text-rose-400" />
                6. IF SITE CLERK REFUSES TO SIGN DEPARTURE TIME
              </span>
              <button
                onClick={() => setIsRefusalMode(!isRefusalMode)}
                className="px-2.5 py-1 rounded-lg text-[10px] font-bold bg-rose-600 hover:bg-rose-500 text-white transition-colors"
              >
                {isRefusalMode ? 'Hide Refusal Protocol' : 'Launch Refusal Action'}
              </button>
            </div>

            {isRefusalMode && (
              <div className="space-y-2 pt-1 font-sans text-xs">
                <p className="text-slate-300 text-[11px] leading-relaxed">
                  1. Write across the paper POD: <strong className="text-white">"Site clerk refused to write times. Actual departure: {new Date().toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' })}"</strong>.
                  <br />
                  2. Take a photo showing the cab dashboard clock with the site gatehouse/exit in the background.
                </p>

                <div className="flex items-center gap-3 pt-1">
                  <button
                    onClick={handleSimulateRefusalPhoto}
                    className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-slate-900 border border-rose-500/50 text-rose-300 hover:bg-slate-800 text-xs font-bold transition-all shadow-sm"
                  >
                    <Camera className="w-4 h-4" />
                    <span>{refusalPhotoTaken ? '✓ Clock Photo Timestamped' : 'Snap Dashboard Clock Photo'}</span>
                  </button>

                  {refusalPhotoTaken && (
                    <span className="text-[11px] font-mono text-emerald-400 font-bold">
                      GPS &amp; Timestamp Watermarked: {new Date().toISOString()}
                    </span>
                  )}
                </div>
              </div>
            )}
          </div>

        </div>

        {/* Footer Actions */}
        <div className="flex items-center justify-between pt-2">
          <button
            onClick={() => window.print()}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-bold transition-colors"
          >
            <Printer className="w-4 h-4 text-cyan-400" />
            <span>Print Laminated Cab Slip</span>
          </button>
          <button
            onClick={onClose}
            className="px-5 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-black transition-colors"
          >
            Done • Close Checklist
          </button>
        </div>

      </div>
    </div>
  );
};
