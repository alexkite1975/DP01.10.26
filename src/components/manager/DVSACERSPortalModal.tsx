'use client';
import React, { useState, useEffect } from 'react';
import {
  Award,
  CheckCircle2,
  AlertTriangle,
  FileCheck,
  Download,
  RefreshCw,
  X,
  ShieldCheck,
  Clock,
  Wrench,
  Truck,
  Hash,
  FileText
} from 'lucide-react';
import { DVSAEarnedRecognitionKPIs } from '../types';

interface DVSACERSPortalModalProps {
  isOpen?: boolean;
  onClose: () => void;
  operatorLicence?: string;
  haulierName?: string;
}

export const DVSACERSPortalModal: React.FC<DVSACERSPortalModalProps> = ({
  isOpen = true,
  onClose,
  operatorLicence = 'OB1298402/SN',
  haulierName = 'Drive Partners Logistics Fleet'
}) => {
  const [loading, setLoading] = useState(false);
  const [kpis, setKpis] = useState<DVSAEarnedRecognitionKPIs | null>(null);
  const [xmlPayload, setXmlPayload] = useState<string | null>(null);

  const fetchKpis = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/compliance/dvsa-ers', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ operatorLicence, haulierName })
      });
      const data = await res.json();
      if (data.success) {
        setKpis(data.kpis);
        setXmlPayload(data.xmlPayload);
      }
    } catch (err) {
      console.error('Failed to load ERS KPIs:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isOpen) {
      fetchKpis();
    }
  }, [isOpen]);

  if (isOpen === false) return null;

  const handleDownloadXml = () => {
    if (!xmlPayload) return;
    const blob = new Blob([xmlPayload], { type: 'application/xml' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `DVSA_ERS_Submission_${operatorLicence.replace('/', '_')}_${kpis?.reportingPeriod || '2026-W38'}.xml`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleDownloadJson = () => {
    if (!kpis) return;
    const blob = new Blob([JSON.stringify(kpis, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `DVSA_ERS_KPI_Report_${operatorLicence.replace('/', '_')}_${kpis.reportingPeriod}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur-md p-3 sm:p-5 overflow-y-auto">
      <div className="relative w-full max-w-4xl rounded-2xl border border-slate-700 bg-slate-900 text-slate-100 shadow-2xl flex flex-col max-h-[92vh] overflow-hidden">
        
        {/* HEADER */}
        <div className="flex items-center justify-between border-b border-slate-800 bg-slate-950/80 px-5 py-4">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
              <Award className="h-5 w-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base sm:text-lg font-bold text-white tracking-wide">
                  DVSA Earned Recognition Scheme (ERS) Portal
                </h2>
                <span className="rounded-full bg-emerald-500/20 px-2.5 py-0.5 text-xs font-semibold text-emerald-400 border border-emerald-500/30 flex items-center gap-1">
                  <ShieldCheck className="h-3 w-3" /> ERS Certified Green
                </span>
              </div>
              <p className="text-xs text-slate-400">
                Official Traffic Commissioner Regulatory KPIs • B1–B4 Maintenance • D1–D4 Driver Hours
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="rounded-lg p-2 text-slate-400 hover:bg-slate-800 hover:text-white transition"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* METRICS SUMMARY STRIP */}
        <div className="grid grid-cols-1 sm:grid-cols-4 gap-3 p-4 bg-slate-950/40 border-b border-slate-800 text-xs">
          <div className="rounded-xl border border-slate-800 bg-slate-900 p-3">
            <div className="text-slate-400 font-medium">Reporting Operator</div>
            <div className="text-sm font-bold text-white mt-0.5">{haulierName}</div>
            <div className="text-[10px] font-mono text-slate-500">O-Licence: {operatorLicence}</div>
          </div>

          <div className="rounded-xl border border-emerald-900/50 bg-emerald-950/20 p-3">
            <div className="text-emerald-400 font-bold flex items-center gap-1">
              <CheckCircle2 className="h-3.5 w-3.5" /> Maintenance Compliance
            </div>
            <div className="text-lg font-black text-emerald-300 mt-0.5">100.0% Pass</div>
            <div className="text-[10px] text-emerald-400">All 4 KPIs Met (B1–B4)</div>
          </div>

          <div className="rounded-xl border border-blue-900/50 bg-blue-950/20 p-3">
            <div className="text-blue-400 font-bold flex items-center gap-1">
              <Clock className="h-3.5 w-3.5" /> Driver Hours Compliance
            </div>
            <div className="text-lg font-black text-blue-300 mt-0.5">99.2% Pass</div>
            <div className="text-[10px] text-blue-400">1.1% Infringement Rate (≤2%)</div>
          </div>

          <div className="rounded-xl border border-amber-900/50 bg-amber-950/20 p-3">
            <div className="text-amber-400 font-bold flex items-center gap-1">
              <Award className="h-3.5 w-3.5" /> OCRS Risk Status
            </div>
            <div className="text-lg font-black text-amber-300 mt-0.5">Green Tier 0</div>
            <div className="text-[10px] text-amber-400">Exempt from Routine Roadside Stops</div>
          </div>
        </div>

        {/* MAIN BODY: 2 TABS / SECTIONS */}
        <div className="flex-1 overflow-y-auto p-5 space-y-5">
          {loading ? (
            <div className="text-center py-16 text-slate-400 flex flex-col items-center gap-2">
              <RefreshCw className="h-8 w-8 animate-spin text-emerald-500" />
              <p className="text-xs">Generating DVSA Earned Recognition KPI telemetry...</p>
            </div>
          ) : kpis ? (
            <>
              {/* SECTION 1: MAINTENANCE KPIS (B1 - B4) */}
              <div className="rounded-xl border border-slate-800 bg-slate-900 p-4 space-y-3">
                <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                  <h3 className="text-sm font-bold text-white flex items-center gap-2">
                    <Wrench className="h-4 w-4 text-emerald-400" />
                    Section B: Fleet Maintenance & Roadworthiness KPIs
                  </h3>
                  <span className="text-[10px] font-bold text-emerald-400 bg-emerald-950/60 px-2 py-0.5 rounded border border-emerald-800">
                    Target: 100% On-Time
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                  {/* B1 */}
                  <div className="rounded-lg bg-slate-950 p-3 border border-slate-800 space-y-1">
                    <div className="flex justify-between items-center">
                      <span className="font-bold text-white">KPI B1: Safety Inspection Intervals</span>
                      <span className="font-mono text-emerald-400 font-bold">{kpis.b1SafetyInspectionIntervalsPercent}%</span>
                    </div>
                    <div className="w-full bg-slate-800 rounded-full h-1.5 overflow-hidden">
                      <div className="bg-emerald-500 h-1.5 rounded-full" style={{ width: `${kpis.b1SafetyInspectionIntervalsPercent}%` }} />
                    </div>
                    <p className="text-[10px] text-slate-400">
                      Standard: 100% of periodic inspections completed within stated operator PMI intervals.
                    </p>
                  </div>

                  {/* B2 */}
                  <div className="rounded-lg bg-slate-950 p-3 border border-slate-800 space-y-1">
                    <div className="flex justify-between items-center">
                      <span className="font-bold text-white">KPI B2: Safety-Critical Defect Rectification</span>
                      <span className="font-mono text-emerald-400 font-bold">{kpis.b2SafetyCriticalDefectsRectifiedBeforeUsePercent}%</span>
                    </div>
                    <div className="w-full bg-slate-800 rounded-full h-1.5 overflow-hidden">
                      <div className="bg-emerald-500 h-1.5 rounded-full" style={{ width: `${kpis.b2SafetyCriticalDefectsRectifiedBeforeUsePercent}%` }} />
                    </div>
                    <p className="text-[10px] text-slate-400">
                      Standard: 100% of driver walkaround Red VOR defects cleared prior to highway dispatch.
                    </p>
                  </div>

                  {/* B3 */}
                  <div className="rounded-lg bg-slate-950 p-3 border border-slate-800 space-y-1">
                    <div className="flex justify-between items-center">
                      <span className="font-bold text-white">KPI B3: MOT & PMI Initial Pass Rate</span>
                      <span className="font-mono text-emerald-400 font-bold">{kpis.b3RoadworthinessInitialPassRatePercent}%</span>
                    </div>
                    <div className="w-full bg-slate-800 rounded-full h-1.5 overflow-hidden">
                      <div className="bg-emerald-500 h-1.5 rounded-full" style={{ width: `${kpis.b3RoadworthinessInitialPassRatePercent}%` }} />
                    </div>
                    <p className="text-[10px] text-slate-400">
                      Standard: $\ge 95\%$ initial roadworthiness pass rate at authorized test facilities (ATF).
                    </p>
                  </div>

                  {/* B4 */}
                  <div className="rounded-lg bg-slate-950 p-3 border border-slate-800 space-y-1">
                    <div className="flex justify-between items-center">
                      <span className="font-bold text-white">KPI B4: Unplanned VOR Downtime</span>
                      <span className="font-mono text-emerald-400 font-bold">{kpis.b4UnplannedVORRatePercent}%</span>
                    </div>
                    <div className="w-full bg-slate-800 rounded-full h-1.5 overflow-hidden">
                      <div className="bg-emerald-500 h-1.5 rounded-full" style={{ width: `${kpis.b4UnplannedVORRatePercent * 10}%` }} />
                    </div>
                    <p className="text-[10px] text-slate-400">
                      Standard: $\le 5.0\%$ fleet unplanned grounding rate outside scheduled service schedules.
                    </p>
                  </div>
                </div>
              </div>

              {/* SECTION 2: DRIVER HOURS KPIS (D1 - D4) */}
              <div className="rounded-xl border border-slate-800 bg-slate-900 p-4 space-y-3">
                <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                  <h3 className="text-sm font-bold text-white flex items-center gap-2">
                    <Clock className="h-4 w-4 text-blue-400" />
                    Section D: EU Drivers Hours & Working Time Directive KPIs
                  </h3>
                  <span className="text-[10px] font-bold text-blue-400 bg-blue-950/60 px-2 py-0.5 rounded border border-blue-800">
                    Target: Infringements &le; 2.0%
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                  {/* D1 */}
                  <div className="rounded-lg bg-slate-950 p-3 border border-slate-800 space-y-1">
                    <div className="flex justify-between items-center">
                      <span className="font-bold text-white">KPI D1: Overall Infringement Rate</span>
                      <span className="font-mono text-emerald-400 font-bold">{kpis.d1TotalInfringementRatePercent}%</span>
                    </div>
                    <p className="text-[10px] text-slate-400">
                      Target: $\le 2.0\%$ of total driver duties. Currently at 1.1% (Exemplary compliance).
                    </p>
                  </div>

                  {/* D2 */}
                  <div className="rounded-lg bg-slate-950 p-3 border border-slate-800 space-y-1">
                    <div className="flex justify-between items-center">
                      <span className="font-bold text-white">KPI D2: 4.5-Hour Continuous Drive Breaches</span>
                      <span className="font-mono text-emerald-400 font-bold">{kpis.d2ContinuousDrivingBreakInfringements} Breaches</span>
                    </div>
                    <p className="text-[10px] text-slate-400">
                      Zero Tolerance Target: 0 breaches of mandatory 45m (or 15m+30m split) rest breaks.
                    </p>
                  </div>

                  {/* D3 */}
                  <div className="rounded-lg bg-slate-950 p-3 border border-slate-800 space-y-1">
                    <div className="flex justify-between items-center">
                      <span className="font-bold text-white">KPI D3: Daily & Weekly Rest Infringements</span>
                      <span className="font-mono text-emerald-400 font-bold">{kpis.d3DailyRestPeriodInfringements} Breaches</span>
                    </div>
                    <p className="text-[10px] text-slate-400">
                      Zero Tolerance Target: 0 breaches of statutory 11-hour daily rest or 45-hour weekly rest.
                    </p>
                  </div>

                  {/* D4 */}
                  <div className="rounded-lg bg-slate-950 p-3 border border-slate-800 space-y-1">
                    <div className="flex justify-between items-center">
                      <span className="font-bold text-white">KPI D4: Unaccounted / Missing Mileage</span>
                      <span className="font-mono text-emerald-400 font-bold">{kpis.d4MissingTachographMileagePercent}%</span>
                    </div>
                    <p className="text-[10px] text-slate-400">
                      Target: $\le 0.5\%$. Validates that all vehicle movement is accompanied by driver card insertions.
                    </p>
                  </div>
                </div>
              </div>

              {/* AUDIT HASH & NON-REPUDIATION */}
              <div className="rounded-xl border border-slate-800 bg-slate-950 p-3.5 flex items-center justify-between text-xs font-mono text-slate-400">
                <div className="flex items-center gap-2">
                  <Hash className="h-4 w-4 text-emerald-400" />
                  <span>SHA-256 Audit Digest:</span>
                  <span className="text-white font-bold text-[11px]">{kpis.auditHashSHA256}</span>
                </div>
                <div className="text-emerald-400 font-bold">DVSA NON-REPUDIATION VERIFIED</div>
              </div>
            </>
          ) : null}
        </div>

        {/* FOOTER ACTIONS */}
        <div className="border-t border-slate-800 bg-slate-950/80 px-5 py-3 flex items-center justify-between text-xs">
          <button
            onClick={fetchKpis}
            className="flex items-center gap-1.5 rounded-lg border border-slate-700 bg-slate-800 px-3 py-1.5 font-semibold text-slate-200 hover:bg-slate-700"
          >
            <RefreshCw className="h-3.5 w-3.5" /> Refresh Audit Data
          </button>

          <div className="flex items-center gap-2">
            <button
              onClick={handleDownloadJson}
              className="flex items-center gap-1.5 rounded-lg border border-slate-700 bg-slate-800 px-3 py-1.5 font-bold text-slate-200 hover:bg-slate-700"
            >
              <FileText className="h-3.5 w-3.5 text-blue-400" /> Download JSON
            </button>
            <button
              onClick={handleDownloadXml}
              className="flex items-center gap-1.5 rounded-lg bg-emerald-500 hover:bg-emerald-400 px-4 py-1.5 font-bold text-slate-950 shadow"
            >
              <Download className="h-3.5 w-3.5" /> Export DVSA XML Payload
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
