'use client';
import React, { useState } from 'react';
import {
  X,
  Clock,
  CheckCircle2,
  DollarSign,
  AlertCircle,
  ShieldCheck,
  Plus,
  MapPin,
  FileCheck,
  Mail,
  Download,
  AlertTriangle,
  Send
} from 'lucide-react';
import {
  SAMPLE_DEMURRAGE_CLAIMS,
  DemurrageCalculationResult,
  calculate_site_demurrage,
  generate_t30_demurrage_notice,
  generate_rha_three_point_evidence_pack
} from '../../services/demurrageEngine';
import { DriverVehicleProfile } from '../../types';

interface DemurrageDetentionModalProps {
  isOpen: boolean;
  onClose: () => void;
  driverVehicle: DriverVehicleProfile;
}

export const DemurrageDetentionModal: React.FC<DemurrageDetentionModalProps> = ({
  isOpen,
  onClose,
  driverVehicle
}) => {
  const [claims, setClaims] = useState<DemurrageCalculationResult[]>(SAMPLE_DEMURRAGE_CLAIMS);
  const [activeTab, setActiveTab] = useState<'CLAIMS' | 'CALCULATOR' | 'SOP_POLICY'>('CLAIMS');

  // Interactive Calculator state
  const [siteName, setSiteName] = useState('DIRFT Logistics Park - Sainsbury\'s RDC');
  const [customerName, setCustomerName] = useState('Sainsbury’s Distribution Central');
  const [customerEmail, setCustomerEmail] = useState('inbound-traffic@sainsburys.co.uk');
  const [dwellMinutes, setDwellMinutes] = useState(195);
  const [hourlyRate, setHourlyRate] = useState(60.0); // SOP-OPS-014 default £60.00 + VAT

  // Inspect modals
  const [selectedClaimForT30, setSelectedClaimForT30] = useState<DemurrageCalculationResult | null>(null);
  const [selectedClaimForEvidence, setSelectedClaimForEvidence] = useState<DemurrageCalculationResult | null>(null);

  if (!isOpen) return null;

  const totalClaimedGbp = claims.reduce((acc, c) => acc + c.totalClaimAmountGbp, 0);

  const handleSimulateNewClaim = () => {
    const arrivalTime = new Date(Date.now() - dwellMinutes * 60 * 1000).toISOString();
    const newClaim = calculate_site_demurrage({
      siteId: 'site-dirft-manual',
      siteName,
      customerName,
      customerEmail,
      vehicleReg: driverVehicle.vehicleReg,
      driverName: driverVehicle.driverName,
      haulierCompany: driverVehicle.currentHaulierCompany || 'Apex Freight Solutions Ltd',
      geofenceArrivalTime: arrivalTime,
      geofenceDepartureTime: new Date().toISOString(),
      freeTimeAllowanceMinutes: 120,
      hourlyRateGbp: hourlyRate
    });

    setClaims([newClaim, ...claims]);
    setActiveTab('CLAIMS');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-slate-950/85 backdrop-blur-md overflow-y-auto">
      <div className="relative w-full max-w-3xl bg-slate-900 border border-slate-800 rounded-3xl shadow-2xl p-5 sm:p-7 text-slate-100 max-h-[92vh] overflow-y-auto space-y-5">
        
        {/* Header */}
        <div className="flex items-start justify-between pb-4 border-b border-slate-800">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-amber-500/20 text-amber-400 flex items-center justify-center border border-amber-500/30 font-black shadow-lg shadow-amber-500/10">
              <Clock className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base sm:text-lg font-extrabold text-white">
                  Automated Demurrage &amp; Waiting Time Recovery
                </h2>
                <span className="rounded-md bg-amber-500/20 px-2 py-0.5 text-[10px] font-mono font-bold text-amber-300 border border-amber-500/30">
                  SOP-OPS-014 • RHA Condition 16
                </span>
              </div>
              <p className="text-xs text-slate-400 mt-0.5">
                Standard £60.00 + VAT/hour in 15-minute increments after 2h free-time • Automated T-30 alerts &amp; Condition 14 evidence packs
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

        {/* Tab switcher */}
        <div className="flex gap-2">
          <button
            onClick={() => setActiveTab('CLAIMS')}
            className={`flex-1 py-2 rounded-xl text-xs font-bold transition-all ${
              activeTab === 'CLAIMS'
                ? 'bg-amber-500 text-slate-950 font-extrabold shadow-md shadow-amber-500/20'
                : 'bg-slate-950 border border-slate-800 text-slate-400 hover:text-white'
            }`}
          >
            Audited Claims ({claims.length})
          </button>
          <button
            onClick={() => setActiveTab('CALCULATOR')}
            className={`flex-1 py-2 rounded-xl text-xs font-bold transition-all ${
              activeTab === 'CALCULATOR'
                ? 'bg-amber-500 text-slate-950 font-extrabold shadow-md shadow-amber-500/20'
                : 'bg-slate-950 border border-slate-800 text-slate-400 hover:text-white'
            }`}
          >
            + New Demurrage Calculation
          </button>
          <button
            onClick={() => setActiveTab('SOP_POLICY')}
            className={`flex-1 py-2 rounded-xl text-xs font-bold transition-all ${
              activeTab === 'SOP_POLICY'
                ? 'bg-amber-500 text-slate-950 font-extrabold shadow-md shadow-amber-500/20'
                : 'bg-slate-950 border border-slate-800 text-slate-400 hover:text-white'
            }`}
          >
            SOP-OPS-014 Legal Policy
          </button>
        </div>

        {/* TAB 1: CLAIMS */}
        {activeTab === 'CLAIMS' && (
          <div className="space-y-3 animate-in fade-in duration-200">
            {/* Summary card */}
            <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800 flex items-center justify-between">
              <div>
                <span className="text-[10px] text-slate-500 font-mono uppercase block">Total Recoverable Demurrage (Net)</span>
                <span className="text-2xl font-black text-amber-400 font-mono">
                  £{totalClaimedGbp.toFixed(2)}
                </span>
                <span className="text-[10px] text-slate-400 block">+ 20% VAT: £{(totalClaimedGbp * 0.2).toFixed(2)}</span>
              </div>
              <div className="text-right text-xs text-slate-400 space-y-0.5">
                <div>Standard Free-Time: <strong className="text-white">2 Hours (FTL)</strong></div>
                <div>Tariff Baseline: <strong className="text-amber-400">£60.00 + VAT / hr</strong></div>
                <div className="text-emerald-400 font-semibold text-[11px]">15-Minute Increments • RHA Condition 16</div>
              </div>
            </div>

            {/* Claims list */}
            {claims.map((c) => (
              <div
                key={c.claimReference}
                className="bg-slate-950/80 p-4 rounded-2xl border border-slate-800 space-y-3"
              >
                <div className="flex items-start justify-between">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-mono font-bold text-amber-300">{c.claimReference}</span>
                      <span className="text-[10px] text-slate-400 font-mono">({c.orderReference})</span>
                    </div>
                    <h4 className="text-sm font-bold text-white mt-0.5">{c.siteName}</h4>
                    <p className="text-[11px] text-slate-400">Principal: {c.customerName} ({c.customerEmail})</p>
                  </div>
                  <div className="text-right">
                    <span className="text-base font-black text-emerald-400 font-mono">
                      £{c.totalClaimAmountGbp.toFixed(2)} <span className="text-xs text-slate-400 font-sans font-normal">+ VAT</span>
                    </span>
                    <span
                      className={`text-[9px] font-bold px-2 py-0.5 rounded block mt-0.5 ${
                        c.status === 'APPROVED_AUTO'
                          ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                          : 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
                      }`}
                    >
                      {c.status}
                    </span>
                  </div>
                </div>

                <div className="grid grid-cols-4 gap-2 bg-slate-900/70 p-2.5 rounded-xl text-[11px] text-slate-300 font-mono">
                  <div>
                    <span className="text-slate-500 block text-[9px]">TOTAL DWELL</span>
                    <strong>{c.totalDwellMinutes} mins</strong>
                  </div>
                  <div>
                    <span className="text-slate-500 block text-[9px]">FREE ALLOWANCE</span>
                    <strong>{c.freeTimeAllowanceMinutes} mins</strong>
                  </div>
                  <div>
                    <span className="text-slate-500 block text-[9px]">ROUNDED (15M)</span>
                    <strong className="text-amber-400">+{c.roundedBillableMinutes} mins</strong>
                  </div>
                  <div>
                    <span className="text-slate-500 block text-[9px]">DEADLINE (COND 14)</span>
                    <strong className="text-cyan-300 text-[10px]">7d Notice Active</strong>
                  </div>
                </div>

                {/* SOP-OPS-014 Quick Action Buttons */}
                <div className="flex flex-wrap items-center justify-between gap-2 pt-1 border-t border-slate-800/80">
                  <div className="text-[10px] text-slate-500 font-mono">
                    Audit: {c.gpsAuditHash} • Reg: {c.vehicleReg}
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => setSelectedClaimForT30(c)}
                      className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-slate-900 border border-amber-500/40 text-amber-300 hover:bg-slate-800 text-[11px] font-bold transition-all"
                    >
                      <Mail className="w-3.5 h-3.5" />
                      <span>View T-30 Alert</span>
                    </button>
                    <button
                      onClick={() => setSelectedClaimForEvidence(c)}
                      className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-slate-900 border border-cyan-500/40 text-cyan-300 hover:bg-slate-800 text-[11px] font-bold transition-all"
                    >
                      <Download className="w-3.5 h-3.5" />
                      <span>3-Point Evidence Pack</span>
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* TAB 2: CALCULATOR */}
        {activeTab === 'CALCULATOR' && (
          <div className="bg-slate-950 p-5 rounded-2xl border border-slate-800 space-y-4 animate-in fade-in duration-200">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="text-xs font-bold text-slate-300 block mb-1">Facility / Depot Name</label>
                <input
                  type="text"
                  value={siteName}
                  onChange={(e) => setSiteName(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white"
                />
              </div>
              <div>
                <label className="text-xs font-bold text-slate-300 block mb-1">Contracting Principal (Customer)</label>
                <input
                  type="text"
                  value={customerName}
                  onChange={(e) => setCustomerName(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-xs font-bold text-slate-300 block mb-1">
                  Actual Dwell Time (Minutes)
                </label>
                <input
                  type="number"
                  value={dwellMinutes}
                  onChange={(e) => setDwellMinutes(Number(e.target.value))}
                  className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white font-mono"
                />
                <span className="text-[10px] text-slate-500 mt-1 block">
                  Free time: 120m • Rounded billable: {Math.max(0, Math.ceil((dwellMinutes - 120) / 15) * 15)}m
                </span>
              </div>

              <div>
                <label className="text-xs font-bold text-slate-300 block mb-1">
                  Contracted Rate (£/Hour + VAT)
                </label>
                <input
                  type="number"
                  value={hourlyRate}
                  onChange={(e) => setHourlyRate(Number(e.target.value))}
                  className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white font-mono"
                />
                <span className="text-[10px] text-slate-500 mt-1 block">
                  SOP-OPS-014 UK Standard RHA baseline: £60.00/h
                </span>
              </div>
            </div>

            <div className="p-3 bg-amber-950/30 border border-amber-800/40 rounded-xl text-xs flex justify-between items-center font-mono">
              <span className="text-slate-300">Estimated Claim (15-min rounding):</span>
              <span className="text-base font-black text-amber-400">
                £{((Math.max(0, Math.ceil((dwellMinutes - 120) / 15) * 15) / 60) * hourlyRate).toFixed(2)} + VAT
              </span>
            </div>

            <button
              onClick={handleSimulateNewClaim}
              className="w-full py-3 bg-amber-500 hover:bg-amber-400 text-slate-950 font-extrabold text-xs rounded-xl flex items-center justify-center gap-2 shadow-lg shadow-amber-500/20 transition-all"
            >
              <Plus className="w-4 h-4" />
              Generate &amp; Submit Demurrage Claim (SOP-014)
            </button>
          </div>
        )}

        {/* TAB 3: SOP-OPS-014 LEGAL POLICY */}
        {activeTab === 'SOP_POLICY' && (
          <div className="bg-slate-950 p-5 rounded-2xl border border-slate-800 space-y-3 text-xs leading-relaxed text-slate-300 animate-in fade-in duration-200">
            <h4 className="font-extrabold text-white text-sm">Standard Operating Procedure: SOP-OPS-014 Summary</h4>
            <div className="space-y-2 text-[11px]">
              <div><strong>Contractual Authority:</strong> All jobs are carried under RHA Conditions of Carriage. Under Condition 16 (Unreasonable Detention), the Customer (contracting principal who booked the load) is legally liable for demurrage costs, regardless of whether fault lies with a third-party consignor or consignee.</div>
              <div><strong>Default Free Time:</strong> 2 hours for full truckload (FTL) collections and 2 hours for deliveries.</div>
              <div><strong>Agreed Tariff:</strong> Standard baseline £60.00 + VAT per hour, rounded to the nearest 15-minute increment after free time expires.</div>
              <div><strong>T-Minus 30 Minutes:</strong> At 90 minutes on site (30 mins free time remaining), dispatch issues an urgent written Demurrage Warning to the customer to enable immediate intervention.</div>
              <div><strong>Condition 14 Deadlines:</strong> Preliminary written claim notice within 7 days, fully detailed claim pack within 14 days of transit completion.</div>
            </div>
          </div>
        )}

        {/* T-30 Warning Modal Sub-View */}
        {selectedClaimForT30 && (
          <div className="p-4 rounded-2xl bg-slate-950 border-2 border-amber-500/50 space-y-3 text-xs">
            <div className="flex items-center justify-between border-b border-slate-800 pb-2">
              <span className="font-bold text-amber-400 flex items-center gap-1.5">
                <Mail className="w-4 h-4" />
                <span>Transmitted T-30 Minute Demurrage Warning</span>
              </span>
              <button onClick={() => setSelectedClaimForT30(null)} className="text-slate-400 hover:text-white">✕</button>
            </div>
            {(() => {
              const notice = generate_t30_demurrage_notice(selectedClaimForT30);
              return (
                <div className="space-y-2 font-mono text-[11px]">
                  <div>To: <strong className="text-white">{notice.to}</strong></div>
                  <div>Subject: <strong className="text-cyan-300">{notice.subject}</strong></div>
                  <pre className="p-3 rounded-xl bg-slate-900 border border-slate-800 font-sans text-slate-300 whitespace-pre-wrap leading-relaxed">
                    {notice.body}
                  </pre>
                </div>
              );
            })()}
          </div>
        )}

        {/* 3-Point Evidence Pack Modal Sub-View */}
        {selectedClaimForEvidence && (
          <div className="p-4 rounded-2xl bg-slate-950 border-2 border-cyan-500/50 space-y-3 text-xs">
            <div className="flex items-center justify-between border-b border-slate-800 pb-2">
              <span className="font-bold text-cyan-400 flex items-center gap-1.5">
                <FileCheck className="w-4 h-4" />
                <span>RHA Condition 14 Three-Point Evidence Pack</span>
              </span>
              <button onClick={() => setSelectedClaimForEvidence(null)} className="text-slate-400 hover:text-white">✕</button>
            </div>
            {(() => {
              const pack = generate_rha_three_point_evidence_pack(selectedClaimForEvidence);
              return (
                <div className="space-y-2 font-sans text-[11px]">
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                    <div className="p-2.5 rounded-lg bg-slate-900 border border-slate-800">
                      <div className="font-bold text-cyan-300">Point 1: Time-Endorsed POD</div>
                      <div className="text-slate-400 text-[10px] mt-1">{pack.point1_signed_pod.endorsementType}</div>
                      <span className="text-[9px] text-emerald-400 font-bold block mt-1">✓ DUAL TIMESTAMP VERIFIED</span>
                    </div>
                    <div className="p-2.5 rounded-lg bg-slate-900 border border-slate-800">
                      <div className="font-bold text-cyan-300">Point 2: Telematics GPS Proof</div>
                      <div className="text-slate-400 text-[10px] mt-1">{pack.point2_telematics_audit.geofenceHash}</div>
                      <span className="text-[9px] text-emerald-400 font-bold block mt-1">✓ {pack.point2_telematics_audit.billableMinutes}</span>
                    </div>
                    <div className="p-2.5 rounded-lg bg-slate-900 border border-slate-800">
                      <div className="font-bold text-cyan-300">Point 3: 30-Min Advance Alert</div>
                      <div className="text-slate-400 text-[10px] mt-1">Sent to {pack.point3_advance_alert.recipient}</div>
                      <span className="text-[9px] text-emerald-400 font-bold block mt-1">✓ TRANSMITTED AT 90M</span>
                    </div>
                  </div>
                  <div className="flex justify-between items-center p-2 rounded-lg bg-slate-900 text-xs font-mono pt-1">
                    <span>Payable: <strong className="text-amber-400">{pack.financialSummary.grossPayable}</strong> (incl. 20% VAT)</span>
                    <button
                      onClick={() => alert(`Downloading RHA Evidence Pack ${pack.claimReference}.json`)}
                      className="px-3 py-1 bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs rounded-lg"
                    >
                      Export PDF / JSON Pack
                    </button>
                  </div>
                </div>
              );
            })()}
          </div>
        )}

      </div>
    </div>
  );
};
