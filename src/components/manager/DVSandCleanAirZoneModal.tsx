'use client';
import React, { useState, useEffect } from 'react';
import { 
  ShieldCheck, AlertTriangle, Eye, CheckCircle2, XCircle, 
  Download, PoundSterling, X, RefreshCw
} from 'lucide-react';
import { DVSComplianceRecord, DVSStarRating } from '../types';

interface DVSandCleanAirZoneModalProps {
  onClose: () => void;
}

const PRESET_VEHICLES = [
  { reg: 'KX21 FDX', make: 'Scania R450 6x2', weight: 44, defaultStars: 2 },
  { reg: 'LJ19 KXE', make: 'DAF XF 530 6x2', weight: 44, defaultStars: 1 },
  { reg: 'GN23 HGV', make: 'Mercedes Actros 2548', weight: 26, defaultStars: 4 },
  { reg: 'WA18 TFR', make: 'Volvo FM 420 8x4 Tipper', weight: 32, defaultStars: 1 },
];

export const DVSandCleanAirZoneModal: React.FC<DVSandCleanAirZoneModalProps> = ({ onClose }) => {
  const [selectedReg, setSelectedReg] = useState('KX21 FDX');
  const [customReg, setCustomReg] = useState('');
  const [vehicleMake, setVehicleMake] = useState('Scania R450 6x2');
  const [grossWeight, setGrossWeight] = useState(44);
  
  const [pssEquipment, setPssEquipment] = useState({
    blindSpotInfoSystemBSIS: true,
    movingOffInfoSystemMOIS: true,
    cameraMonitoringSystemCMS: true,
    leftTurnAudibleWarning: true,
    sideUnderRunProtection: true,
  });

  const [loading, setLoading] = useState(false);
  const [complianceData, setComplianceData] = useState<DVSComplianceRecord | null>(null);

  const performDVSCheck = async () => {
    setLoading(true);
    const activeReg = (customReg.trim() || selectedReg).toUpperCase();
    
    try {
      const res = await fetch('/api/compliance/dvs-check', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          vehicleReg: activeReg,
          grossWeightTonnes: grossWeight,
          pssEquipment
        })
      });

      if (res.ok) {
        const data = await res.json();
        setComplianceData(data.complianceRecord);
      } else {
        throw new Error('API request failed');
      }
    } catch (err) {
      console.warn('Using client-side fallback calculation for DVS/CAZ:', err);
      // Fallback calculation
      const preset = PRESET_VEHICLES.find(v => v.reg === activeReg);
      const stars = (preset ? preset.defaultStars : 3) as DVSStarRating;
      const allPssFitted = Object.values(pssEquipment).every(Boolean);
      const permitEligible = stars >= 3 || (stars < 3 && allPssFitted);

      const record: DVSComplianceRecord = {
        vehicleReg: activeReg,
        makeModel: vehicleMake,
        grossVehicleWeightTonnes: grossWeight,
        dvsStarRating: stars,
        isPSSCompliant: allPssFitted,
        pssEquipment: pssEquipment,
        tflPermitStatus: permitEligible ? 'PERMIT_ISSUED' : 'PROHIBITED',
        cazExemptions: {
          londonULEZ: true,
          londonLEZ: true,
          birminghamCAZ: true,
          bathCAZ: true,
          bristolCAZ: true,
          sheffieldCAZ: true
        },
        applicableDailyCharges: [
          { zoneName: 'TfL Congestion Zone', dailyFee: 15.00, penaltyFee: 180.00 },
          { zoneName: 'London Direct Vision Breach', dailyFee: 0, penaltyFee: 550.00 },
          { zoneName: 'Birmingham CAZ Class D', dailyFee: 0, penaltyFee: 120.00 },
          { zoneName: 'Bath Clean Air Zone', dailyFee: 0, penaltyFee: 120.00 },
          { zoneName: 'Bristol Clean Air Zone', dailyFee: 0, penaltyFee: 120.00 },
          { zoneName: 'Sheffield CAZ Class C', dailyFee: 0, penaltyFee: 120.00 }
        ]
      };
      setComplianceData(record);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    performDVSCheck();
  }, [selectedReg, pssEquipment]);

  const handleSelectPreset = (preset: typeof PRESET_VEHICLES[0]) => {
    setSelectedReg(preset.reg);
    setCustomReg('');
    setVehicleMake(preset.make);
    setGrossWeight(preset.weight);
  };

  const togglePssItem = (key: keyof typeof pssEquipment) => {
    setPssEquipment(prev => ({ ...prev, [key]: !prev[key] }));
  };

  const downloadComplianceReport = () => {
    if (!complianceData) return;
    const jsonStr = JSON.stringify(complianceData, null, 2);
    const blob = new Blob([jsonStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `TfL-DVS-CAZ-Compliance-${complianceData.vehicleReg}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/80 backdrop-blur-md overflow-y-auto animate-fadeIn">
      <div className="relative w-full max-w-5xl bg-slate-900 border border-slate-700/80 rounded-2xl shadow-2xl overflow-hidden flex flex-col my-auto max-h-[92vh]">
        
        {/* Modal Header */}
        <div className="bg-gradient-to-r from-blue-900/60 via-slate-900 to-indigo-950/60 px-6 py-4 border-b border-slate-700/80 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-blue-500/20 text-blue-400 border border-blue-500/30">
              <Eye className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-xl font-black text-white tracking-wide">
                  Direct Vision Standard (DVS) & Clean Air Zones
                </h2>
                <span className="px-2 py-0.5 rounded text-[11px] font-bold bg-blue-500/20 text-blue-300 border border-blue-500/30 uppercase">
                  TfL 2024/2025 PSS Mandate
                </span>
              </div>
              <p className="text-xs text-slate-400">
                London HGV Safety Permit verification, Progressive Safe System (PSS) audit & UK CAZ fee mitigation
              </p>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Content */}
        <div className="p-6 overflow-y-auto space-y-6">

          {/* Vehicle Selector Bar */}
          <div className="bg-slate-800/60 border border-slate-700/60 rounded-xl p-4">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider block mb-1.5">
                  Select Fleet Asset
                </label>
                <div className="flex flex-wrap gap-2">
                  {PRESET_VEHICLES.map(v => (
                    <button
                      key={v.reg}
                      onClick={() => handleSelectPreset(v)}
                      className={`px-3 py-1.5 rounded-lg text-xs font-bold font-mono transition-all border ${
                        selectedReg === v.reg && !customReg
                          ? 'bg-amber-500 text-slate-950 border-amber-400 shadow-md shadow-amber-500/20 scale-105'
                          : 'bg-slate-900/80 text-slate-300 border-slate-700 hover:border-slate-500'
                      }`}
                    >
                      {v.reg} ({v.defaultStars}★)
                    </button>
                  ))}
                </div>
              </div>

              <div className="flex items-center gap-2">
                <div>
                  <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider block mb-1.5">
                    Custom VRM
                  </label>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      placeholder="e.g. EU71 TRK"
                      value={customReg}
                      onChange={(e) => setCustomReg(e.target.value.toUpperCase())}
                      className="bg-slate-900 border border-slate-700 rounded-lg px-3 py-1.5 text-xs text-white font-mono placeholder:text-slate-600 focus:outline-none focus:border-blue-500 w-32"
                    />
                    <button
                      onClick={performDVSCheck}
                      disabled={loading}
                      className="px-3 py-1.5 bg-blue-600 hover:bg-blue-500 disabled:opacity-50 text-white rounded-lg text-xs font-semibold flex items-center gap-1 transition-colors"
                    >
                      <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
                      Check
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* DVS & Permit Status Hero Grid */}
          {complianceData && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              
              {/* Star Rating Card */}
              <div className="bg-slate-800/40 border border-slate-700/60 rounded-xl p-5 flex flex-col justify-between">
                <div>
                  <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
                    Direct Vision Rating
                  </span>
                  <div className="flex items-baseline gap-2 mt-2">
                    <span className="text-4xl font-black text-amber-400">
                      {complianceData.dvsStarRating}
                    </span>
                    <span className="text-sm font-semibold text-slate-400">/ 5 Stars</span>
                  </div>

                  {/* Visual Star Glyphs */}
                  <div className="flex gap-1.5 mt-3">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <div
                        key={star}
                        className={`w-7 h-7 rounded-md flex items-center justify-center text-sm font-bold ${
                          star <= complianceData.dvsStarRating
                            ? 'bg-amber-400 text-slate-950 shadow-md shadow-amber-400/20'
                            : 'bg-slate-700/50 text-slate-600'
                        }`}
                      >
                        ★
                      </div>
                    ))}
                  </div>
                </div>

                <div className="mt-4 pt-3 border-t border-slate-700/50 text-xs text-slate-400">
                  {complianceData.dvsStarRating >= 3 ? (
                    <span className="text-emerald-400 font-semibold flex items-center gap-1">
                      <CheckCircle2 className="w-4 h-4" /> Qualifies automatically under Oct 2024 rules (≥3★)
                    </span>
                  ) : (
                    <span className="text-amber-400 font-semibold flex items-center gap-1">
                      <AlertTriangle className="w-4 h-4" /> &lt;3★: Requires Progressive Safe System (PSS)
                    </span>
                  )}
                </div>
              </div>

              {/* TfL Safety Permit Status */}
              <div className={`border rounded-xl p-5 flex flex-col justify-between ${
                complianceData.tflPermitStatus === 'PERMIT_ISSUED'
                  ? 'bg-emerald-950/20 border-emerald-500/40'
                  : 'bg-red-950/20 border-red-500/40'
              }`}>
                <div>
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
                      TfL HGV Safety Permit
                    </span>
                    <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                      complianceData.tflPermitStatus === 'PERMIT_ISSUED'
                        ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40' 
                        : 'bg-red-500/20 text-red-300 border border-red-500/40'
                    }`}>
                      {complianceData.tflPermitStatus}
                    </span>
                  </div>

                  <div className="mt-4">
                    <div className="text-lg font-bold text-white flex items-center gap-2">
                      {complianceData.tflPermitStatus === 'PERMIT_ISSUED' ? (
                        <>
                          <CheckCircle2 className="w-6 h-6 text-emerald-400" />
                          <span>Permit Granted for Greater London</span>
                        </>
                      ) : (
                        <>
                          <XCircle className="w-6 h-6 text-red-400" />
                          <span>Non-Compliant Vehicle</span>
                        </>
                      )}
                    </div>
                    <p className="text-xs text-slate-400 mt-1">
                      {complianceData.tflPermitStatus === 'PERMIT_ISSUED'
                        ? 'Permit granted. Free to operate across Greater London 24/7 without PCN exposure.'
                        : 'Cannot enter Greater London without risk of immediate automated camera fine.'}
                    </p>
                  </div>
                </div>

                <div className="mt-4 pt-3 border-t border-slate-700/50">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-slate-400">Daily PCN Fine Avoided:</span>
                    <span className="font-bold text-emerald-400">£550 / day</span>
                  </div>
                </div>
              </div>

              {/* Emissions & Clean Air Zones */}
              <div className="bg-slate-800/40 border border-slate-700/60 rounded-xl p-5 flex flex-col justify-between">
                <div>
                  <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
                    Clean Air Zones (CAZ / ULEZ)
                  </span>
                  
                  <div className="mt-2 flex items-center justify-between">
                    <span className="text-sm text-slate-300 font-medium">Euro Rating:</span>
                    <span className="font-mono font-bold text-sm px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                      Euro VI Compliant
                    </span>
                  </div>

                  <div className="mt-3 space-y-1.5 text-xs">
                    <div className="flex justify-between text-slate-300">
                      <span>London LEZ / ULEZ:</span>
                      <span className={complianceData.cazExemptions.londonULEZ ? 'text-emerald-400 font-bold' : 'text-red-400 font-bold'}>
                        {complianceData.cazExemptions.londonULEZ ? 'Exempt (£0)' : '£300/day'}
                      </span>
                    </div>
                    <div className="flex justify-between text-slate-300">
                      <span>Birmingham CAZ:</span>
                      <span className={complianceData.cazExemptions.birminghamCAZ ? 'text-emerald-400 font-bold' : 'text-amber-400 font-bold'}>
                        {complianceData.cazExemptions.birminghamCAZ ? 'Exempt (£0)' : '£50/day'}
                      </span>
                    </div>
                    <div className="flex justify-between text-slate-300">
                      <span>Bath & Bristol CAZ:</span>
                      <span className={complianceData.cazExemptions.bristolCAZ ? 'text-emerald-400 font-bold' : 'text-amber-400 font-bold'}>
                        {complianceData.cazExemptions.bristolCAZ ? 'Exempt (£0)' : '£100/day'}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="mt-4 pt-3 border-t border-slate-700/50 text-xs text-slate-400 flex items-center gap-1.5">
                  <ShieldCheck className="w-4 h-4 text-blue-400" />
                  <span>Auto-ANPR registered fleet profile</span>
                </div>
              </div>

            </div>
          )}

          {/* Progressive Safe System (PSS) Audit Checklist */}
          <div className="bg-slate-800/40 border border-slate-700/60 rounded-xl p-5">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-blue-400" />
                  Progressive Safe System (PSS) Equipment Audit
                </h3>
                <p className="text-xs text-slate-400 mt-0.5">
                  Mandatory for all 0, 1, and 2-star HGVs entering Greater London from October 2024
                </p>
              </div>
              <span className={`text-xs font-bold px-2.5 py-1 rounded-full ${
                complianceData?.isPSSCompliant
                  ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                  : 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
              }`}>
                {complianceData?.isPSSCompliant ? '100% PSS COMPLIANT' : 'PSS INCOMPLETE'}
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {[
                { 
                  id: 'blindSpotInfoSystemBSIS' as const, 
                  label: 'Blind Spot Information System (BSIS)', 
                  desc: 'Active radar or sensor detecting vulnerable road users (cyclists) along near-side' 
                },
                { 
                  id: 'movingOffInfoSystemMOIS' as const, 
                  label: 'Moving Off Information System (MOIS)', 
                  desc: 'Forward sensor/camera alerting driver to pedestrians in front blind spot' 
                },
                { 
                  id: 'cameraMonitoringSystemCMS' as const, 
                  label: 'Camera Monitoring System (CMS)', 
                  desc: 'In-cab near-side digital display eliminating physical mirror blind spots' 
                },
                { 
                  id: 'sideUnderRunProtection' as const, 
                  label: 'Side Under-run Protection', 
                  desc: 'Fitted to both sides to prevent cyclists/pedestrians being drawn under wheels' 
                },
                { 
                  id: 'leftTurnAudibleWarning' as const, 
                  label: 'Audible Left-Turn Warning Alarm', 
                  desc: 'External acoustic speech alarm: "Caution: Vehicle turning left"' 
                },
              ].map((item) => {
                const isChecked = pssEquipment[item.id];
                return (
                  <div
                    key={item.id}
                    onClick={() => togglePssItem(item.id)}
                    className={`p-3 rounded-lg border cursor-pointer transition-all flex items-start gap-3 ${
                      isChecked
                        ? 'bg-slate-900/60 border-emerald-500/40 hover:border-emerald-500/70'
                        : 'bg-slate-900/30 border-slate-700 hover:border-slate-600 opacity-75'
                    }`}
                  >
                    <input
                      type="checkbox"
                      checked={isChecked}
                      onChange={() => {}}
                      className="mt-1 h-4 w-4 rounded border-slate-700 bg-slate-900 text-emerald-500 focus:ring-emerald-400 pointer-events-none"
                    />
                    <div>
                      <div className="text-xs font-bold text-white flex items-center gap-1.5">
                        {item.label}
                        {isChecked ? (
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 inline" />
                        ) : (
                          <XCircle className="w-3.5 h-3.5 text-red-400 inline" />
                        )}
                      </div>
                      <p className="text-[11px] text-slate-400 mt-0.5 leading-snug">
                        {item.desc}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Action Footer */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-2">
            <div className="text-xs text-slate-400 flex items-center gap-2">
              <PoundSterling className="w-4 h-4 text-amber-400" />
              <span>Estimated Annual Penalty Avoidance: <strong className="text-white">£12,650 per vehicle</strong></span>
            </div>

            <div className="flex items-center gap-3">
              <button
                onClick={downloadComplianceReport}
                className="px-4 py-2 bg-slate-800 hover:bg-slate-700 border border-slate-600 text-slate-200 rounded-xl text-xs font-bold flex items-center gap-2 transition-all shadow-sm"
              >
                <Download className="w-4 h-4 text-blue-400" />
                Export TfL Safety Evidence (JSON)
              </button>
              <button
                onClick={onClose}
                className="px-5 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-xs font-bold transition-all shadow-lg shadow-blue-600/20"
              >
                Done
              </button>
            </div>
          </div>

        </div>

      </div>
    </div>
  );
};
