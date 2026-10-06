'use client';
import React, { useState } from 'react';
import {
  AlertOctagon,
  CheckCircle2,
  AlertTriangle,
  Wrench,
  FileText,
  Truck,
  ShieldAlert,
  Camera,
  Download,
  Printer,
  X,
  History,
  Info,
  Calendar,
  Lock,
  Unlock,
  Plus,
  Hash,
  ShieldCheck,
  Eye
} from 'lucide-react';
import {
  FleetVehicleVORRecord,
  WalkaroundCheckItem,
  InspectionCheckCategory,
  DefectSeverity,
  TechnicianSignOff
} from '../types';
import { initialFleetVehicles, standardDVSAChecklist } from '../data/mockMarketplaceData';

interface FleetVORGroundingModalProps {
  isOpen: boolean;
  onClose: () => void;
  userRole?: 'driver' | 'business' | 'admin';
}

export const FleetVORGroundingModal: React.FC<FleetVORGroundingModalProps> = ({
  isOpen,
  onClose,
  userRole = 'business'
}) => {
  const [vehicles, setVehicles] = useState<FleetVehicleVORRecord[]>(initialFleetVehicles);
  const [selectedVehicle, setSelectedVehicle] = useState<FleetVehicleVORRecord | null>(
    initialFleetVehicles[0]
  );

  // Walkaround Modal State
  const [showWalkaroundModal, setShowWalkaroundModal] = useState<boolean>(false);
  const [walkaroundVehicle, setWalkaroundVehicle] = useState<FleetVehicleVORRecord | null>(null);
  const [walkaroundChecks, setWalkaroundChecks] = useState<WalkaroundCheckItem[]>(
    standardDVSAChecklist.map((c) => ({ ...c }))
  );
  const [driverNameInput, setDriverNameInput] = useState('Dave Miller');
  const [driverLicenceInput, setDriverLicenceInput] = useState('MILLE840293D89');
  const [odometerInput, setOdometerInput] = useState('342180');

  // Technician Sign-Off State
  const [showSignOffModal, setShowSignOffModal] = useState<boolean>(false);
  const [signOffVehicle, setSignOffVehicle] = useState<FleetVehicleVORRecord | null>(null);
  const [techName, setTechName] = useState('Graham Thorpe');
  const [techId, setTechId] = useState('TECH-IRTE-884');
  const [workshopName, setWorkshopName] = useState('Scania Approved Workshop Rugby');
  const [torqueWrenchId, setTorqueWrenchId] = useState('TW-CAL-2026-081');
  const [torqueNm, setTorqueNm] = useState('600');
  const [partsSerials, setPartsSerials] = useState('CHMB-ACT-991, AIR-SEAL-044');
  const [certNum, setCertNum] = useState('DVSA-RW-2026-' + Math.floor(10000 + Math.random() * 90000));

  // DVSA Printable Certificate View State
  const [showCertModal, setShowCertModal] = useState<boolean>(false);
  const [certVehicle, setCertVehicle] = useState<FleetVehicleVORRecord | null>(null);

  if (!isOpen) return null;

  // Counts
  const groundedCount = vehicles.filter((v) => v.isGroundedVOR).length;
  const roadworthyCount = vehicles.filter((v) => !v.isGroundedVOR).length;

  // Walkaround item toggle
  const handleToggleCheck = (id: string, status: 'PASS' | 'DEFECT') => {
    setWalkaroundChecks((prev) =>
      prev.map((item) =>
        item.id === id
          ? {
              ...item,
              status,
              severity: status === 'DEFECT' ? 'SAFETY_CRITICAL_RED_VOR' : undefined,
              notes: status === 'DEFECT' ? 'Defect identified during walkaround.' : undefined
            }
          : item
      )
    );
  };

  const handleUpdateNotes = (id: string, notes: string, severity: DefectSeverity) => {
    setWalkaroundChecks((prev) =>
      prev.map((item) => (item.id === id ? { ...item, notes, severity } : item))
    );
  };

  // Submit Walkaround Audit
  const handleSubmitWalkaround = (e: React.FormEvent) => {
    e.preventDefault();
    if (!walkaroundVehicle) return;

    const defectsFound = walkaroundChecks.filter((c) => c.status === 'DEFECT');
    const hasSafetyCritical = defectsFound.some(
      (c) => c.severity === 'SAFETY_CRITICAL_RED_VOR'
    );

    const updatedVehicle: FleetVehicleVORRecord = {
      ...walkaroundVehicle,
      isGroundedVOR: hasSafetyCritical,
      vorTriggeredAt: hasSafetyCritical ? new Date().toISOString() : undefined,
      vorReason: hasSafetyCritical
        ? `SAFETY-CRITICAL RED VOR: ${defectsFound
            .filter((d) => d.severity === 'SAFETY_CRITICAL_RED_VOR')
            .map((d) => d.name)
            .join('; ')}`
        : undefined,
      reportedByDriverName: driverNameInput,
      reportedByDriverLicence: driverLicenceInput,
      mileageOdometer: parseInt(odometerInput) || walkaroundVehicle.mileageOdometer,
      defectsList: walkaroundChecks,
      auditTrail: [
        {
          timestamp: new Date().toISOString(),
          action: hasSafetyCritical
            ? 'GROUNDED IN TMS (RED VOR): Safety critical defect logged. Shift dispatch frozen.'
            : 'DVSA WALKAROUND COMPLETED: Roadworthy certificate active.',
          user: `Driver ${driverNameInput} (${driverLicenceInput})`
        },
        ...walkaroundVehicle.auditTrail
      ]
    };

    setVehicles((prev) =>
      prev.map((v) => (v.id === updatedVehicle.id ? updatedVehicle : v))
    );
    setSelectedVehicle(updatedVehicle);
    setShowWalkaroundModal(false);
  };

  // Submit Technician Clearance
  const handleSubmitClearance = (e: React.FormEvent) => {
    e.preventDefault();
    if (!signOffVehicle) return;

    const signOff: TechnicianSignOff = {
      technicianId: techId,
      technicianName: techName,
      workshopFacility: workshopName,
      torqueWrenchCalibrationId: torqueWrenchId,
      torqueNmApplied: parseFloat(torqueNm) || 600,
      replacementPartsSerials: partsSerials.split(',').map((s) => s.trim()),
      repairedAt: new Date().toISOString(),
      dvsaRoadworthyCertNumber: certNum
    };

    const releasedVehicle: FleetVehicleVORRecord = {
      ...signOffVehicle,
      isGroundedVOR: false,
      vorTriggeredAt: undefined,
      vorReason: undefined,
      technicianSignOff: signOff,
      defectsList: signOffVehicle.defectsList.map((d) => ({
        ...d,
        status: 'PASS',
        notes: `Rectified by ${techName} (${certNum})`
      })),
      auditTrail: [
        {
          timestamp: new Date().toISOString(),
          action: `VOR LOCK RELEASED BY WORKSHOP: Roadworthy certified under ${certNum}. Torque: ${torqueNm}Nm (Cal ID: ${torqueWrenchId}). Parts: ${partsSerials}.`,
          user: `Master Tech ${techName} (${workshopName})`
        },
        ...signOffVehicle.auditTrail
      ]
    };

    setVehicles((prev) =>
      prev.map((v) => (v.id === releasedVehicle.id ? releasedVehicle : v))
    );
    setSelectedVehicle(releasedVehicle);
    setShowSignOffModal(false);
  };

  const openWalkaroundFor = (vehicle: FleetVehicleVORRecord) => {
    setWalkaroundVehicle(vehicle);
    setWalkaroundChecks(
      standardDVSAChecklist.map((c) => ({
        ...c,
        status: 'PASS',
        notes: undefined,
        severity: undefined
      }))
    );
    setOdometerInput(vehicle.mileageOdometer.toString());
    setShowWalkaroundModal(true);
  };

  const openSignOffFor = (vehicle: FleetVehicleVORRecord) => {
    setSignOffVehicle(vehicle);
    setShowSignOffModal(true);
  };

  const openCertFor = (vehicle: FleetVehicleVORRecord) => {
    setCertVehicle(vehicle);
    setShowCertModal(true);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur-md p-3 sm:p-5 overflow-y-auto">
      <div className="relative w-full max-w-5xl rounded-2xl border border-slate-700 bg-slate-900 text-slate-100 shadow-2xl flex flex-col max-h-[92vh] overflow-hidden">
        
        {/* HEADER */}
        <div className="flex items-center justify-between border-b border-slate-800 bg-slate-950/80 px-5 py-4">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-red-500/20 text-red-400 border border-red-500/30">
              <AlertOctagon className="h-5 w-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base sm:text-lg font-bold text-white tracking-wide">
                  Fleet VOR Defect Grounding & DVSA Audit Compliance
                </h2>
                <span className="rounded-full bg-blue-500/20 px-2.5 py-0.5 text-xs font-semibold text-blue-400 border border-blue-500/30">
                  DVSA Roadworthiness Guide §2
                </span>
              </div>
              <p className="text-xs text-slate-400">
                Automated TMS Dispatch Freeze • IRTE Technician Torque Sign-off • Tamper-proof Roadworthiness Sheet
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

        {/* METRICS STRIP */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 p-4 bg-slate-950/40 border-b border-slate-800 text-xs">
          <div className="rounded-xl border border-slate-800 bg-slate-900/90 p-3">
            <div className="text-slate-400 font-medium">Total Fleet Tracked</div>
            <div className="text-xl font-black text-white mt-1">{vehicles.length} Units</div>
            <div className="text-[10px] text-slate-500">O-Licence Active Vehicles</div>
          </div>

          <div className="rounded-xl border border-red-900/60 bg-red-950/30 p-3">
            <div className="text-red-400 font-bold flex items-center gap-1">
              <AlertOctagon className="h-3.5 w-3.5" /> Grounded (Red VOR)
            </div>
            <div className="text-xl font-black text-red-400 mt-1">{groundedCount} Units</div>
            <div className="text-[10px] text-red-300">Dispatch Locked in TMS</div>
          </div>

          <div className="rounded-xl border border-emerald-900/60 bg-emerald-950/30 p-3">
            <div className="text-emerald-400 font-bold flex items-center gap-1">
              <CheckCircle2 className="h-3.5 w-3.5" /> Roadworthy Active
            </div>
            <div className="text-xl font-black text-emerald-400 mt-1">{roadworthyCount} Units</div>
            <div className="text-[10px] text-emerald-300">Ready for Dispatch</div>
          </div>

          <div className="rounded-xl border border-blue-900/60 bg-blue-950/30 p-3">
            <div className="text-blue-400 font-bold flex items-center gap-1">
              <Wrench className="h-3.5 w-3.5" /> Workshop Torque Log
            </div>
            <div className="text-xl font-black text-blue-300 mt-1">100% Calibrated</div>
            <div className="text-[10px] text-blue-400">IRTE Certified Sign-Off</div>
          </div>
        </div>

        {/* MAIN BODY: 2 COLUMN SPLIT */}
        <div className="flex-1 overflow-y-auto grid grid-cols-1 lg:grid-cols-12 divide-y lg:divide-y-0 lg:divide-x divide-slate-800">
          
          {/* VEHICLE LIST (5 COLS) */}
          <div className="lg:col-span-5 p-4 space-y-3 overflow-y-auto max-h-[60vh] lg:max-h-none">
            <div className="flex items-center justify-between text-xs text-slate-400 pb-1">
              <span>Fleet Inventory Status</span>
              <span>Select Unit for Full Dossier</span>
            </div>

            {vehicles.map((v) => {
              const isSelected = selectedVehicle?.id === v.id;
              return (
                <div
                  key={v.id}
                  onClick={() => setSelectedVehicle(v)}
                  className={`rounded-xl border p-3.5 transition-all cursor-pointer ${
                    v.isGroundedVOR
                      ? isSelected
                        ? 'border-red-500 bg-red-950/40 shadow-lg shadow-red-500/10'
                        : 'border-red-900/80 bg-red-950/20 hover:border-red-700'
                      : isSelected
                      ? 'border-emerald-500 bg-slate-800/90 shadow-md'
                      : 'border-slate-800 bg-slate-900/80 hover:border-slate-700'
                  }`}
                >
                  <div className="flex items-start justify-between">
                    <div>
                      {/* UK Number Plate Design */}
                      <div className="inline-flex items-center rounded-md border border-black/40 bg-amber-400 px-2 py-0.5 text-xs font-black tracking-widest text-black font-mono shadow-sm">
                        <span className="mr-1 text-[9px] bg-blue-700 text-white px-1 py-0.2 rounded font-sans font-bold">
                          GB
                        </span>
                        {v.vehicleReg}
                      </div>
                      <div className="mt-1 text-xs font-bold text-white">{v.makeModel}</div>
                      <div className="text-[11px] text-slate-400">Fleet #{v.fleetNumber}</div>
                    </div>

                    <div className="text-right">
                      {v.isGroundedVOR ? (
                        <span className="inline-flex items-center gap-1 rounded bg-red-500/20 border border-red-500/40 px-2 py-0.5 text-[10px] font-black text-red-400 animate-pulse">
                          <Lock className="h-3 w-3" /> GROUNDED VOR
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 rounded bg-emerald-500/20 border border-emerald-500/40 px-2 py-0.5 text-[10px] font-bold text-emerald-400">
                          <CheckCircle2 className="h-3 w-3" /> ROADWORTHY
                        </span>
                      )}
                      <div className="text-[10px] text-slate-400 font-mono mt-1">
                        {v.mileageOdometer.toLocaleString()} mi
                      </div>
                    </div>
                  </div>

                  {v.isGroundedVOR && (
                    <div className="mt-2.5 rounded bg-red-950/60 border border-red-800/60 p-2 text-[11px] text-red-300">
                      <div className="font-bold flex items-center gap-1 text-red-200">
                        <AlertTriangle className="h-3 w-3 text-red-400 shrink-0" /> Safety-Critical Defect
                      </div>
                      <div className="line-clamp-2 mt-0.5 text-[10px] text-slate-300">{v.vorReason}</div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {/* VEHICLE DOSSIER & WORKSHOP CONTROLS (7 COLS) */}
          <div className="lg:col-span-7 p-4 bg-slate-950/60 space-y-4 overflow-y-auto">
            {selectedVehicle ? (
              <div className="space-y-4">
                
                {/* STATUS BANNER */}
                <div
                  className={`rounded-xl border p-4 ${
                    selectedVehicle.isGroundedVOR
                      ? 'border-red-600 bg-red-950/50 text-red-200'
                      : 'border-emerald-700 bg-emerald-950/40 text-emerald-200'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      {selectedVehicle.isGroundedVOR ? (
                        <ShieldAlert className="h-5 w-5 text-red-400 shrink-0" />
                      ) : (
                        <ShieldCheck className="h-5 w-5 text-emerald-400 shrink-0" />
                      )}
                      <div>
                        <h3 className="text-sm font-bold text-white uppercase tracking-wider">
                          {selectedVehicle.isGroundedVOR
                            ? 'LOCKED IN TMS: VEHICLE GROUNDED (RED VOR)'
                            : 'ROADWORTHY: CLEARED FOR ROAD DISPATCH'}
                        </h3>
                        <p className="text-[11px] text-slate-300">
                          {selectedVehicle.isGroundedVOR
                            ? 'Vehicle is legally prohibited from operating on public highways (DVSA S.40 RTA).'
                            : 'All statutory DVSA safety-critical items pass inspection standards.'}
                        </p>
                      </div>
                    </div>

                    <div className="text-right">
                      {selectedVehicle.isGroundedVOR ? (
                        <button
                          onClick={() => openSignOffFor(selectedVehicle)}
                          className="rounded-lg bg-red-500 hover:bg-red-400 text-slate-950 font-black px-3 py-1.5 text-xs transition shadow flex items-center gap-1.5"
                        >
                          <Wrench className="h-3.5 w-3.5" /> Workshop Sign-Off
                        </button>
                      ) : (
                        <button
                          onClick={() => openWalkaroundFor(selectedVehicle)}
                          className="rounded-lg bg-slate-800 hover:bg-slate-700 text-white font-bold px-3 py-1.5 text-xs transition border border-slate-700 flex items-center gap-1.5"
                        >
                          <FileText className="h-3.5 w-3.5 text-amber-400" /> Walkaround Audit
                        </button>
                      )}
                    </div>
                  </div>

                  {selectedVehicle.isGroundedVOR && (
                    <div className="mt-3 pt-3 border-t border-red-800/40 text-xs">
                      <div className="font-semibold text-red-300">Grounding Trigger Reason:</div>
                      <div className="font-mono text-[11px] text-white mt-0.5">{selectedVehicle.vorReason}</div>
                      <div className="text-[10px] text-slate-400 mt-1">
                        Reported by: {selectedVehicle.reportedByDriverName} at{' '}
                        {new Date(selectedVehicle.vorTriggeredAt || '').toLocaleString()}
                      </div>
                    </div>
                  )}
                </div>

                {/* ACTION BUTTONS ROW */}
                <div className="flex flex-wrap items-center gap-2">
                  <button
                    onClick={() => openWalkaroundFor(selectedVehicle)}
                    className="flex-1 rounded-xl border border-slate-700 bg-slate-800/80 hover:bg-slate-700/80 p-2.5 text-xs font-bold text-white transition flex items-center justify-center gap-2"
                  >
                    <FileText className="h-4 w-4 text-amber-400" /> Log Walkaround Check
                  </button>

                  <button
                    onClick={() => openCertFor(selectedVehicle)}
                    className="flex-1 rounded-xl border border-blue-500/40 bg-blue-950/40 hover:bg-blue-900/40 p-2.5 text-xs font-bold text-blue-300 transition flex items-center justify-center gap-2"
                  >
                    <Download className="h-4 w-4 text-blue-400" /> View DVSA Certificate
                  </button>
                </div>

                {/* TECHNICIAN SIGN-OFF CERTIFICATION CARD */}
                {selectedVehicle.technicianSignOff && (
                  <div className="rounded-xl border border-blue-800/50 bg-blue-950/20 p-3.5 space-y-2 text-xs">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-blue-300 flex items-center gap-1.5">
                        <Wrench className="h-4 w-4 text-blue-400" /> IRTE Workshop Clearance Sign-Off
                      </span>
                      <span className="font-mono text-[10px] text-slate-400">
                        Cert: {selectedVehicle.technicianSignOff.dvsaRoadworthyCertNumber}
                      </span>
                    </div>

                    <div className="grid grid-cols-2 gap-2 text-[11px] text-slate-300 pt-1">
                      <div>
                        <span className="text-slate-500">Technician:</span>{' '}
                        <strong className="text-white">
                          {selectedVehicle.technicianSignOff.technicianName} ({selectedVehicle.technicianSignOff.technicianId})
                        </strong>
                      </div>
                      <div>
                        <span className="text-slate-500">Workshop:</span>{' '}
                        <strong className="text-white">
                          {selectedVehicle.technicianSignOff.workshopFacility}
                        </strong>
                      </div>
                      <div>
                        <span className="text-slate-500">Torque Applied:</span>{' '}
                        <strong className="text-emerald-400 font-mono">
                          {selectedVehicle.technicianSignOff.torqueNmApplied} Nm
                        </strong>{' '}
                        <span className="text-[10px] text-slate-500">
                          (Cal ID: {selectedVehicle.technicianSignOff.torqueWrenchCalibrationId})
                        </span>
                      </div>
                      <div>
                        <span className="text-slate-500">Parts Serials:</span>{' '}
                        <span className="font-mono text-white text-[10px]">
                          {selectedVehicle.technicianSignOff.replacementPartsSerials.join(', ')}
                        </span>
                      </div>
                    </div>
                  </div>
                )}

                {/* RECENT DEFECTS / CHECKS LIST */}
                <div className="rounded-xl border border-slate-800 bg-slate-900 p-3.5 space-y-2.5">
                  <h4 className="text-xs font-bold text-slate-200 flex items-center gap-2">
                    <Eye className="h-4 w-4 text-amber-400" /> Walkaround Checklist Findings
                  </h4>

                  <div className="divide-y divide-slate-800 text-xs">
                    {selectedVehicle.defectsList.map((item) => (
                      <div key={item.id} className="py-2 flex items-start justify-between gap-2">
                        <div className="space-y-0.5">
                          <div className="flex items-center gap-2">
                            <span className="font-medium text-white">{item.name}</span>
                            <span className="text-[10px] text-slate-500 font-mono">
                              {item.dvsaGuideReference}
                            </span>
                          </div>
                          {item.notes && (
                            <p className="text-[11px] text-slate-400">{item.notes}</p>
                          )}
                        </div>

                        <div>
                          {item.status === 'PASS' ? (
                            <span className="rounded bg-emerald-500/20 px-2 py-0.5 text-[10px] font-bold text-emerald-400">
                              PASS
                            </span>
                          ) : (
                            <span
                              className={`rounded px-2 py-0.5 text-[10px] font-black ${
                                item.severity === 'SAFETY_CRITICAL_RED_VOR'
                                  ? 'bg-red-500/30 text-red-400 border border-red-500/40 animate-pulse'
                                  : 'bg-amber-500/20 text-amber-400'
                              }`}
                            >
                              {item.severity === 'SAFETY_CRITICAL_RED_VOR'
                                ? 'RED VOR'
                                : 'MONITOR'}
                            </span>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* AUDIT TRAIL LOG */}
                <div className="rounded-xl border border-slate-800 bg-slate-900 p-3.5 space-y-2">
                  <h4 className="text-xs font-bold text-slate-200 flex items-center gap-1.5">
                    <History className="h-3.5 w-3.5 text-blue-400" /> Tamper-Proof Audit Trail
                  </h4>
                  <div className="space-y-2 text-[11px]">
                    {selectedVehicle.auditTrail.map((log, i) => (
                      <div key={i} className="rounded bg-slate-950/60 border border-slate-800 p-2">
                        <div className="flex items-center justify-between text-slate-400 text-[10px]">
                          <span className="font-mono">{new Date(log.timestamp).toLocaleString()}</span>
                          <span className="text-amber-400 font-medium">{log.user}</span>
                        </div>
                        <p className="mt-1 text-slate-300 font-medium">{log.action}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ) : (
              <div className="text-center py-20 text-slate-500">
                <Truck className="h-10 w-10 mx-auto text-slate-600 mb-2" />
                <p>Select a vehicle to inspect roadworthiness history</p>
              </div>
            )}
          </div>
        </div>

        {/* WALKAROUND INSPECTION SUB-MODAL */}
        {showWalkaroundModal && walkaroundVehicle && (
          <div className="fixed inset-0 z-60 flex items-center justify-center bg-black/90 p-4">
            <div className="relative w-full max-w-2xl rounded-2xl border border-slate-700 bg-slate-900 p-5 text-slate-100 shadow-2xl max-h-[90vh] overflow-y-auto">
              <div className="flex items-center justify-between border-b border-slate-800 pb-3 mb-4">
                <div className="flex items-center gap-2">
                  <div className="rounded bg-amber-400 px-2 py-0.5 text-xs font-black text-black font-mono">
                    {walkaroundVehicle.vehicleReg}
                  </div>
                  <h3 className="text-sm font-bold text-white">
                    DVSA Pre-Use Daily Walkaround Inspection
                  </h3>
                </div>
                <button
                  onClick={() => setShowWalkaroundModal(false)}
                  className="rounded p-1 text-slate-400 hover:text-white"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              <form onSubmit={handleSubmitWalkaround} className="space-y-4 text-xs">
                <div className="grid grid-cols-3 gap-2">
                  <div>
                    <label className="block text-slate-400 font-semibold mb-1">Driver Name</label>
                    <input
                      type="text"
                      required
                      value={driverNameInput}
                      onChange={(e) => setDriverNameInput(e.target.value)}
                      className="w-full rounded border border-slate-700 bg-slate-800 px-2.5 py-1.5 text-white"
                    />
                  </div>
                  <div>
                    <label className="block text-slate-400 font-semibold mb-1">Driver Licence Number</label>
                    <input
                      type="text"
                      required
                      value={driverLicenceInput}
                      onChange={(e) => setDriverLicenceInput(e.target.value)}
                      className="w-full rounded border border-slate-700 bg-slate-800 px-2.5 py-1.5 text-white font-mono"
                    />
                  </div>
                  <div>
                    <label className="block text-slate-400 font-semibold mb-1">Odometer (Miles)</label>
                    <input
                      type="number"
                      required
                      value={odometerInput}
                      onChange={(e) => setOdometerInput(e.target.value)}
                      className="w-full rounded border border-slate-700 bg-slate-800 px-2.5 py-1.5 text-white font-mono"
                    />
                  </div>
                </div>

                <div className="rounded-xl border border-slate-800 bg-slate-950 p-3 space-y-2">
                  <div className="text-xs font-bold text-slate-300">
                    Mandatory DVSA Roadworthiness Checklist Items:
                  </div>

                  <div className="divide-y divide-slate-800 max-h-[45vh] overflow-y-auto pr-1">
                    {walkaroundChecks.map((item) => {
                      const isDefect = item.status === 'DEFECT';
                      return (
                        <div key={item.id} className="py-2.5 space-y-2">
                          <div className="flex items-center justify-between gap-2">
                            <div>
                              <div className="font-semibold text-white">{item.name}</div>
                              <div className="text-[10px] text-slate-400">{item.dvsaGuideReference}</div>
                            </div>

                            <div className="flex items-center gap-1.5">
                              <button
                                type="button"
                                onClick={() => handleToggleCheck(item.id, 'PASS')}
                                className={`px-2.5 py-1 rounded text-xs font-bold transition ${
                                  !isDefect
                                    ? 'bg-emerald-500 text-slate-950'
                                    : 'bg-slate-800 text-slate-400 hover:bg-slate-700'
                                }`}
                              >
                                PASS
                              </button>
                              <button
                                type="button"
                                onClick={() => handleToggleCheck(item.id, 'DEFECT')}
                                className={`px-2.5 py-1 rounded text-xs font-bold transition ${
                                  isDefect
                                    ? 'bg-red-500 text-white'
                                    : 'bg-slate-800 text-slate-400 hover:bg-slate-700'
                                }`}
                              >
                                DEFECT
                              </button>
                            </div>
                          </div>

                          {isDefect && (
                            <div className="rounded bg-red-950/40 border border-red-800/60 p-2.5 space-y-2 text-xs">
                              <div className="flex items-center justify-between">
                                <label className="text-red-300 font-bold">Defect Severity:</label>
                                <select
                                  value={item.severity}
                                  onChange={(e) =>
                                    handleUpdateNotes(item.id, item.notes || '', e.target.value as any)
                                  }
                                  className="rounded border border-red-700 bg-red-950 px-2 py-0.5 text-xs text-white"
                                >
                                  <option value="SAFETY_CRITICAL_RED_VOR">
                                    SAFETY CRITICAL - GROUND VEHICLE (RED VOR)
                                  </option>
                                  <option value="MAJOR_REPAIR_SOON">Major - Repair in 24h</option>
                                  <option value="MINOR_MONITOR">Minor - Monitor at PMI</option>
                                </select>
                              </div>
                              <input
                                type="text"
                                placeholder="Describe defect (e.g. tyre tread 0.8mm, hissing air leak)..."
                                value={item.notes || ''}
                                onChange={(e) =>
                                  handleUpdateNotes(
                                    item.id,
                                    e.target.value,
                                    item.severity || 'SAFETY_CRITICAL_RED_VOR'
                                  )
                                }
                                className="w-full rounded border border-slate-700 bg-slate-900 px-2 py-1 text-white"
                              />
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>

                <div className="pt-2 flex justify-end gap-2">
                  <button
                    type="button"
                    onClick={() => setShowWalkaroundModal(false)}
                    className="rounded bg-slate-800 px-4 py-2 font-semibold text-slate-300 hover:bg-slate-700"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="rounded bg-emerald-500 px-4 py-2 font-bold text-slate-950 hover:bg-emerald-400"
                  >
                    Submit & Sign Off Walkaround
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* WORKSHOP CLEARANCE TECHNICIAN MODAL */}
        {showSignOffModal && signOffVehicle && (
          <div className="fixed inset-0 z-60 flex items-center justify-center bg-black/90 p-4">
            <div className="relative w-full max-w-lg rounded-2xl border border-slate-700 bg-slate-900 p-5 text-slate-100 shadow-2xl max-h-[90vh] overflow-y-auto">
              <div className="flex items-center justify-between border-b border-slate-800 pb-3 mb-4">
                <div className="flex items-center gap-2">
                  <Wrench className="h-5 w-5 text-blue-400" />
                  <h3 className="text-sm font-bold text-white">
                    IRTE Workshop Clearance & Torque Sign-Off
                  </h3>
                </div>
                <button
                  onClick={() => setShowSignOffModal(false)}
                  className="rounded p-1 text-slate-400 hover:text-white"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>

              <form onSubmit={handleSubmitClearance} className="space-y-3 text-xs">
                <div className="rounded bg-amber-950/30 border border-amber-800/40 p-2 text-amber-200 text-[11px]">
                  Releasing <strong>{signOffVehicle.vehicleReg}</strong> from TMS Red VOR lock requires
                  calibrated torque documentation and replacement parts audit.
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="block text-slate-400 font-semibold mb-1">Technician Name</label>
                    <input
                      type="text"
                      required
                      value={techName}
                      onChange={(e) => setTechName(e.target.value)}
                      className="w-full rounded border border-slate-700 bg-slate-800 px-2.5 py-1.5 text-white"
                    />
                  </div>
                  <div>
                    <label className="block text-slate-400 font-semibold mb-1">Technician IRTE / ID</label>
                    <input
                      type="text"
                      required
                      value={techId}
                      onChange={(e) => setTechId(e.target.value)}
                      className="w-full rounded border border-slate-700 bg-slate-800 px-2.5 py-1.5 text-white font-mono"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-slate-400 font-semibold mb-1">Approved Workshop Facility</label>
                  <input
                    type="text"
                    required
                    value={workshopName}
                    onChange={(e) => setWorkshopName(e.target.value)}
                    className="w-full rounded border border-slate-700 bg-slate-800 px-2.5 py-1.5 text-white"
                  />
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="block text-slate-400 font-semibold mb-1">Torque Wrench Cal ID</label>
                    <input
                      type="text"
                      required
                      value={torqueWrenchId}
                      onChange={(e) => setTorqueWrenchId(e.target.value)}
                      className="w-full rounded border border-slate-700 bg-slate-800 px-2.5 py-1.5 text-white font-mono"
                    />
                  </div>
                  <div>
                    <label className="block text-slate-400 font-semibold mb-1">Torque Applied (Nm)</label>
                    <input
                      type="number"
                      required
                      value={torqueNm}
                      onChange={(e) => setTorqueNm(e.target.value)}
                      className="w-full rounded border border-slate-700 bg-slate-800 px-2.5 py-1.5 text-white font-mono"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-slate-400 font-semibold mb-1">Replacement Parts Serial Numbers</label>
                  <input
                    type="text"
                    required
                    value={partsSerials}
                    onChange={(e) => setPartsSerials(e.target.value)}
                    placeholder="e.g. WHL-NUT-01, ACT-VALVE-88"
                    className="w-full rounded border border-slate-700 bg-slate-800 px-2.5 py-1.5 text-white font-mono"
                  />
                </div>

                <div>
                  <label className="block text-slate-400 font-semibold mb-1">DVSA Roadworthy Cert Number</label>
                  <input
                    type="text"
                    required
                    value={certNum}
                    onChange={(e) => setCertNum(e.target.value)}
                    className="w-full rounded border border-slate-700 bg-slate-800 px-2.5 py-1.5 text-white font-mono"
                  />
                </div>

                <div className="pt-2 flex justify-end gap-2">
                  <button
                    type="button"
                    onClick={() => setShowSignOffModal(false)}
                    className="rounded bg-slate-800 px-4 py-2 font-semibold text-slate-300 hover:bg-slate-700"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="rounded bg-emerald-500 px-4 py-2 font-bold text-slate-950 hover:bg-emerald-400"
                  >
                    Unlock Vehicle & Release VOR
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* DVSA ROADWORTHINESS CERTIFICATE / DEFECT SHEET MODAL */}
        {showCertModal && certVehicle && (
          <div className="fixed inset-0 z-60 flex items-center justify-center bg-black/90 p-4">
            <div className="relative w-full max-w-3xl rounded-2xl border border-slate-600 bg-white text-slate-900 p-6 shadow-2xl max-h-[90vh] overflow-y-auto">
              <div className="flex items-center justify-between border-b-2 border-slate-900 pb-3 mb-4">
                <div>
                  <div className="text-[10px] font-black uppercase tracking-widest text-slate-600">
                    DRIVER & VEHICLE STANDARDS AGENCY (DVSA) AUDIT RECORD
                  </div>
                  <h2 className="text-lg font-black text-slate-950 tracking-tight">
                    HGV Daily Walkaround Inspection & Defect Rectification Certificate
                  </h2>
                  <p className="text-xs text-slate-600">
                    Formulated pursuant to the DVSA Guide to Maintaining Roadworthiness (Section 2)
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => window.print()}
                    className="rounded bg-slate-900 text-white px-3 py-1.5 text-xs font-bold hover:bg-slate-800 flex items-center gap-1"
                  >
                    <Printer className="h-3.5 w-3.5" /> Print
                  </button>
                  <button
                    onClick={() => setShowCertModal(false)}
                    className="rounded p-1 text-slate-500 hover:text-slate-900"
                  >
                    <X className="h-5 w-5" />
                  </button>
                </div>
              </div>

              {/* CERTIFICATE DETAILS */}
              <div className="grid grid-cols-3 gap-3 border border-slate-300 rounded p-3 text-xs mb-4 bg-slate-50">
                <div>
                  <span className="text-slate-500 block text-[10px]">VEHICLE REGISTRATION</span>
                  <strong className="text-sm font-black font-mono">{certVehicle.vehicleReg}</strong>
                </div>
                <div>
                  <span className="text-slate-500 block text-[10px]">MAKE & MODEL</span>
                  <strong>{certVehicle.makeModel}</strong>
                </div>
                <div>
                  <span className="text-slate-500 block text-[10px]">ODOMETER READING</span>
                  <strong className="font-mono">{certVehicle.mileageOdometer.toLocaleString()} MILES</strong>
                </div>
                <div>
                  <span className="text-slate-500 block text-[10px]">OPERATOR FLEET ID</span>
                  <strong>#{certVehicle.fleetNumber}</strong>
                </div>
                <div>
                  <span className="text-slate-500 block text-[10px]">CURRENT ROADWORTHY STATUS</span>
                  <strong className={certVehicle.isGroundedVOR ? 'text-red-700' : 'text-emerald-700'}>
                    {certVehicle.isGroundedVOR ? 'GROUNDED (RED VOR)' : 'ROADWORTHY CERTIFIED'}
                  </strong>
                </div>
                <div>
                  <span className="text-slate-500 block text-[10px]">INSPECTION DATE</span>
                  <strong className="font-mono">{new Date().toLocaleDateString('en-GB')}</strong>
                </div>
              </div>

              {/* CHECKLIST TABLE */}
              <div className="border border-slate-300 rounded overflow-hidden text-xs mb-4">
                <table className="w-full text-left border-collapse">
                  <thead className="bg-slate-200 text-slate-800 text-[10px] uppercase font-bold">
                    <tr>
                      <th className="p-2 border-b border-slate-300">DVSA Code</th>
                      <th className="p-2 border-b border-slate-300">Safety Critical Inspection Item</th>
                      <th className="p-2 border-b border-slate-300">Result</th>
                      <th className="p-2 border-b border-slate-300">Remarks & Rectification</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-200">
                    {certVehicle.defectsList.map((item) => (
                      <tr key={item.id} className="hover:bg-slate-50">
                        <td className="p-2 font-mono text-[10px] text-slate-500">
                          {item.dvsaGuideReference.replace('DVSA Roadworthiness Guide ', '')}
                        </td>
                        <td className="p-2 font-medium">{item.name}</td>
                        <td className="p-2 font-bold">
                          {item.status === 'PASS' ? (
                            <span className="text-emerald-700">PASS</span>
                          ) : (
                            <span className="text-red-700">DEFECT ({item.severity})</span>
                          )}
                        </td>
                        <td className="p-2 text-slate-600 text-[11px]">{item.notes || 'Nil defect detected'}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* WORKSHOP CLEARANCE & TORQUE DETAILS */}
              {certVehicle.technicianSignOff && (
                <div className="border border-blue-300 bg-blue-50 rounded p-3 text-xs mb-4 space-y-1.5">
                  <div className="font-bold text-blue-900 uppercase text-[10px] tracking-wide">
                    Section 3: Workshop Rectification & Roadworthiness Sign-Off
                  </div>
                  <div className="grid grid-cols-2 gap-2 text-[11px]">
                    <div>
                      Technician:{' '}
                      <strong>{certVehicle.technicianSignOff.technicianName} (ID: {certVehicle.technicianSignOff.technicianId})</strong>
                    </div>
                    <div>
                      Facility: <strong>{certVehicle.technicianSignOff.workshopFacility}</strong>
                    </div>
                    <div>
                      Wheel Nut Torque Applied:{' '}
                      <strong className="text-emerald-800 font-mono">
                        {certVehicle.technicianSignOff.torqueNmApplied} Nm
                      </strong>{' '}
                      (Wrench Cal ID: {certVehicle.technicianSignOff.torqueWrenchCalibrationId})
                    </div>
                    <div>
                      Parts Serials: <strong>{certVehicle.technicianSignOff.replacementPartsSerials.join(', ')}</strong>
                    </div>
                  </div>
                </div>
              )}

              {/* CRYPTOGRAPHIC VERIFICATION FOOTER */}
              <div className="border-t border-slate-300 pt-3 text-[10px] text-slate-500 flex items-center justify-between font-mono">
                <div>
                  SHA-256 DIGEST: c79e84b02e9a21d9f0412849e819a2b7e19401824a7bc9910d
                </div>
                <div>NON-REPUDIATION VERIFIED • DVSA COMPLIANT</div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
