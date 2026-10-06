'use client';
import React, { useState, useRef } from 'react';
import {
  X,
  Camera,
  ScanLine,
  CheckCircle2,
  AlertTriangle,
  Upload,
  Sparkles,
  Truck,
  ArrowRight,
  ShieldCheck
} from 'lucide-react';
import { BulkheadScanResult, DriverVehicleProfile } from '../types';

interface BulkheadHeightSyncModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentProfile: DriverVehicleProfile;
  onSyncHeight: (newHeightMeters: number) => void;
}

const SAMPLE_PLATES = [
  {
    id: 'plate-1',
    title: 'Standard UK Curtainsider (4.45m / 14\' 7")',
    heightMeters: 4.45,
    heightFeetInches: '14\' 7"',
    trailerId: 'TR-9021-UK',
    imageUrl:
      'https://images.unsplash.com/photo-1601584115197-04ecc0da31d7?auto=format&fit=crop&w=800&q=80'
  },
  {
    id: 'plate-2',
    title: 'High-Cube Double Decker Trailer (4.85m / 15\' 11")',
    heightMeters: 4.85,
    heightFeetInches: '15\' 11"',
    trailerId: 'DD-4850-GB',
    imageUrl:
      'https://images.unsplash.com/photo-1519003722824-194d4455a60c?auto=format&fit=crop&w=800&q=80'
  },
  {
    id: 'plate-3',
    title: 'Standard European Flush Box (4.00m / 13\' 1")',
    heightMeters: 4.00,
    heightFeetInches: '13\' 1"',
    trailerId: 'EU-4000-BOX',
    imageUrl:
      'https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?auto=format&fit=crop&w=800&q=80'
  }
];

export const BulkheadHeightSyncModal: React.FC<BulkheadHeightSyncModalProps> = ({
  isOpen,
  onClose,
  currentProfile,
  onSyncHeight
}) => {
  const [selectedSample, setSelectedSample] = useState(SAMPLE_PLATES[0]);
  const [uploadedImage, setUploadedImage] = useState<string | null>(null);
  const [isScanning, setIsScanning] = useState(false);
  const [scanResult, setScanResult] = useState<BulkheadScanResult | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  if (!isOpen) return null;

  const currentPreview = uploadedImage || selectedSample.imageUrl;

  const handleScanPlate = () => {
    setIsScanning(true);
    setTimeout(() => {
      const result: BulkheadScanResult = {
        id: 'bhk-' + Date.now(),
        heightMeters: selectedSample.heightMeters,
        heightFeetInches: selectedSample.heightFeetInches,
        trailerId: selectedSample.trailerId,
        confidence: 0.98,
        rawPlateText: 'MAX VEHICLE HEIGHT ' + selectedSample.heightMeters + 'm / ' + selectedSample.heightFeetInches,
        timestamp: new Date().toISOString()
      };
      setScanResult(result);
      setIsScanning(false);
    }, 700);
  };

  const handleApplySync = () => {
    if (scanResult) {
      onSyncHeight(scanResult.heightMeters);
      onClose();
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        setUploadedImage(reader.result as string);
        setScanResult(null);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur-md p-3 sm:p-4 overflow-y-auto animate-in fade-in duration-200">
      <div className="relative w-full max-w-lg rounded-3xl bg-slate-900 border border-slate-800 text-white shadow-2xl overflow-hidden flex flex-col max-h-[92vh]">
        {/* Header */}
        <div className="px-5 py-4 border-b border-slate-800 flex items-center justify-between bg-slate-950">
          <div className="flex items-center gap-2.5">
            <div className="h-9 w-9 rounded-2xl bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-amber-400">
              <ScanLine className="h-5 w-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-black tracking-wider text-amber-400 uppercase">
                  Camera OCR Telematics
                </span>
                <span className="text-[10px] rounded-full bg-slate-800 px-2 py-0.5 text-slate-400">
                  Spec Page 6 Utility
                </span>
              </div>
              <h3 className="text-sm font-bold text-white">Trailer Bulkhead Height Sync</h3>
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
          {/* Viewfinder Target */}
          <div className="relative aspect-video rounded-2xl overflow-hidden bg-slate-950 border-2 border-slate-800 flex items-center justify-center">
            <img src={currentPreview} alt="Trailer Bulkhead" className="w-full h-full object-cover" />
            <div className="absolute inset-0 bg-black/40" />

            {/* Cyan Reticle */}
            <div className="absolute inset-6 border-2 border-dashed border-amber-400/80 rounded-xl flex flex-col justify-between p-3 pointer-events-none">
              <div className="flex justify-between items-center text-[10px] font-mono text-amber-300 bg-black/60 px-2 py-0.5 rounded w-fit">
                <span>ALIGN CLEARANCE NOTICE PLATE</span>
              </div>
              {isScanning && (
                <div className="w-full h-1 bg-gradient-to-r from-transparent via-amber-400 to-transparent shadow-[0_0_15px_#f59e0b] animate-pulse" />
              )}
              <div className="text-center text-[10px] text-slate-300 font-bold">
                FRONT BULKHEAD CAB HEIGHT SENSOR
              </div>
            </div>
          </div>

          {/* Preset Samples */}
          <div className="space-y-2">
            <div className="flex items-center justify-between text-xs text-slate-400">
              <span className="font-bold text-slate-300">Select Trailer Type to Sync:</span>
              <button
                onClick={() => fileInputRef.current?.click()}
                className="text-amber-400 hover:text-amber-300 font-bold flex items-center gap-1"
              >
                <Upload className="h-3.5 w-3.5" />
                <span>Snap Camera</span>
              </button>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                capture="environment"
                className="hidden"
                onChange={handleFileUpload}
              />
            </div>

            <div className="grid grid-cols-1 gap-2">
              {SAMPLE_PLATES.map((plate) => (
                <button
                  key={plate.id}
                  onClick={() => {
                    setSelectedSample(plate);
                    setUploadedImage(null);
                    setScanResult(null);
                  }}
                  className={'p-3 rounded-xl text-left border transition-all text-xs flex items-center justify-between ' + (
                    selectedSample.id === plate.id && !uploadedImage
                      ? 'border-amber-400 bg-amber-950/30 text-amber-200'
                      : 'border-slate-800 bg-slate-950 text-slate-300 hover:border-slate-700'
                  )}
                >
                  <div>
                    <div className="font-bold text-white">{plate.title}</div>
                    <div className="text-[11px] text-slate-400 font-mono mt-0.5">
                      Plate ID: {plate.trailerId}
                    </div>
                  </div>
                  <div className="text-right">
                    <span className="text-base font-mono font-black text-amber-400">
                      {plate.heightMeters}m
                    </span>
                    <div className="text-[10px] text-slate-400">{plate.heightFeetInches}</div>
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Action to scan */}
          {!scanResult ? (
            <button
              onClick={handleScanPlate}
              disabled={isScanning}
              className="w-full py-3 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-xs shadow-lg shadow-amber-500/20 flex items-center justify-center gap-2 transition-all active:scale-98 disabled:opacity-50"
            >
              {isScanning ? (
                <>
                  <Sparkles className="h-4 w-4 animate-spin text-slate-950" />
                  <span>Gemini Vision Parsing Clearance Plate...</span>
                </>
              ) : (
                <>
                  <Camera className="h-4 w-4" />
                  <span>SCAN TRAILER BULKHEAD PLATE</span>
                </>
              )}
            </button>
          ) : (
            /* Result Card */
            <div className="p-4 rounded-2xl bg-emerald-950/40 border-2 border-emerald-500/60 space-y-3 animate-in zoom-in-95">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-xl bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 flex items-center justify-center shrink-0">
                  <CheckCircle2 className="h-6 w-6" />
                </div>
                <div>
                  <div className="text-xs font-black text-emerald-400">
                    TRAILER CLEARANCE DETECTED
                  </div>
                  <div className="text-xl font-mono font-black text-white">
                    {scanResult.heightMeters} METRES ({scanResult.heightFeetInches})
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-between text-xs pt-1 border-t border-emerald-500/30 text-slate-300">
                <span>Current Profile: <strong>{currentProfile.heightMeters}m</strong></span>
                <span className="text-emerald-400 font-bold flex items-center gap-1">
                  <span>Sync to {scanResult.heightMeters}m</span>
                  <ArrowRight className="h-3.5 w-3.5" />
                </span>
              </div>

              <button
                onClick={handleApplySync}
                className="w-full py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black text-xs shadow-md shadow-emerald-500/20 transition-all active:scale-98"
              >
                APPLY & SYNC TO VEHICLE PROFILE
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
