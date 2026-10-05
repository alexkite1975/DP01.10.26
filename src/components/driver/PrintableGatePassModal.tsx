import React from 'react';
import {
  X,
  Printer,
  ShieldCheck,
  CheckSquare,
  Lock,
  Phone,
  Radio,
  MapPin,
  Clock,
  Truck,
  AlertTriangle,
  FileText,
  Download
} from 'lucide-react';
import { SiteRiskAssessment } from '../types';
import { formatHeightBoth } from '../../utils/heightUtils';

interface PrintableGatePassModalProps {
  site: SiteRiskAssessment;
  onClose: () => void;
  isOpen?: boolean;
  driverVehicle?: any;
}

export const PrintableGatePassModal: React.FC<PrintableGatePassModalProps> = ({
  site,
  onClose,
  isOpen = true
}) => {
  if (!isOpen) return null;

  const handlePrint = () => {
    window.print();
  };

  const b = site.businessSection;
  const annotations = b.sitePlan?.annotations || [];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-900/70 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-4xl rounded-2xl border border-slate-200 bg-white p-6 sm:p-8 shadow-2xl text-slate-900 max-h-[94vh] flex flex-col">
        {/* Modal Controls (Hidden in Print) */}
        <div className="print:hidden flex items-center justify-between pb-4 border-b border-slate-200 shrink-0">
          <div className="flex items-center gap-2">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-blue-50 text-blue-600 border border-blue-200">
              <FileText className="h-5 w-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-slate-900">
                ISO 45001 Gate Pass & Fleet Site Safety Briefing
              </h2>
              <p className="text-xs text-slate-500">
                Official contractor & delivery driver site induction documentation
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="flex items-center gap-1.5 rounded-lg bg-blue-600 hover:bg-blue-700 text-white px-3.5 py-1.5 text-xs font-bold shadow-sm transition-all"
            >
              <Printer className="h-4 w-4" />
              <span>Print / Save PDF</span>
            </button>
            <button
              onClick={onClose}
              className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-100 hover:text-slate-700"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
        </div>

        {/* Printable Document Container */}
        <div className="overflow-y-auto flex-1 pt-4 space-y-5 text-slate-900">
          {/* Document Header */}
          <div className="flex items-start justify-between border-b-2 border-slate-900 pb-4">
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-black uppercase tracking-wider text-blue-700 bg-blue-50 px-2.5 py-0.5 rounded border border-blue-200">
                  ISO 45001 Certified Fleet Safety
                </span>
                <span className="text-xs font-bold text-slate-500">
                  Document Ref: {site.id.toUpperCase()}
                </span>
              </div>
              <h1 className="text-2xl font-black text-slate-900 mt-1">
                {site.title}
              </h1>
              <p className="text-sm font-semibold text-slate-700">{site.businessName}</p>
              <p className="text-xs text-slate-600 flex items-center gap-1 mt-0.5">
                <MapPin className="h-3.5 w-3.5 text-slate-400" />
                {site.address}
              </p>
            </div>

            <div className="text-right border border-slate-300 rounded-xl p-3 bg-slate-50">
              <div className="text-[10px] uppercase font-bold text-slate-500">Security Gate Passcode</div>
              <div className="text-xl font-mono font-black text-blue-700 tracking-wider">
                {b.gateSecurityCode}
              </div>
              <div className="text-[10px] text-slate-500 mt-0.5">
                Channel: {b.intercomInstructions.slice(0, 24)}
              </div>
            </div>
          </div>

          {/* Quick Details Bar */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 bg-slate-50 p-3.5 rounded-xl border border-slate-200 text-xs">
            <div>
              <span className="text-[10px] uppercase font-bold text-slate-500 block">Google Plus Code</span>
              <span className="font-mono font-bold text-slate-900">
                {site.plusCode || '9C4VFR54+9Q'}
              </span>
            </div>
            <div>
              <span className="text-[10px] uppercase font-bold text-slate-500 block">GPS Coordinates</span>
              <span className="font-mono text-slate-800">
                {site.coordinates.lat.toFixed(4)}, {site.coordinates.lng.toFixed(4)}
              </span>
            </div>
            <div>
              <span className="text-[10px] uppercase font-bold text-slate-500 block">Vehicle Max Height</span>
              <span className="font-bold text-amber-700">
                {formatHeightBoth(b.vehicleConstraints.maxHeightMeters)} Clearance
              </span>
            </div>
            <div>
              <span className="text-[10px] uppercase font-bold text-slate-500 block">Speed Limit</span>
              <span className="font-bold text-rose-700">10 MPH Strictly Enforced</span>
            </div>
          </div>

          {/* Mandatory PPE Checklist */}
          <div className="rounded-xl border border-slate-200 p-4">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-700 mb-2 flex items-center gap-1.5">
              <ShieldCheck className="h-4 w-4 text-blue-600" />
              Mandatory Personal Protective Equipment (PPE) Checklist
            </h3>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs">
              {b.mandatoryPPE.map((ppe, i) => (
                <div key={i} className="flex items-center gap-2 p-2 rounded-lg bg-slate-50 border border-slate-200 font-medium">
                  <CheckSquare className="h-4 w-4 text-emerald-600 shrink-0" />
                  <span>{ppe}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Site Plan CAD Reference with Plotted Safety Points */}
          <div className="rounded-xl border border-slate-200 p-4">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-700 flex items-center gap-1.5">
                <Truck className="h-4 w-4 text-indigo-600" />
                Site Plan & Annotated Safety Coordinates ({annotations.length} Safety Points)
              </h3>
              <span className="text-[11px] font-medium text-slate-500">
                Depot Layout: {b.sitePlan?.planType || 'LOGISTICS_SUPERHUB'}
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
              {annotations.map((ann, idx) => (
                <div
                  key={idx}
                  className="flex items-start gap-2.5 p-2 rounded-lg border border-slate-200 bg-slate-50/70"
                >
                  <span className="flex h-5 w-5 items-center justify-center rounded-full bg-slate-900 text-[10px] font-bold text-white shrink-0">
                    {idx + 1}
                  </span>
                  <div>
                    <div className="font-bold text-slate-900 flex items-center gap-1.5">
                      <span>{ann.label || (ann as any).title || 'Safety Checkpoint'}</span>
                      <span className="text-[9px] uppercase font-bold text-slate-500">
                        [{String(ann.type || (ann as any).category || 'POINT').replace('_', ' ')}]
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-600 mt-0.5">{ann.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Emergency & Manager Contacts */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
            <div className="rounded-xl border border-slate-200 p-3.5 bg-slate-50">
              <h4 className="font-bold text-slate-900 mb-1 flex items-center gap-1.5">
                <AlertTriangle className="h-4 w-4 text-amber-600" />
                Emergency Evacuation Assembly
              </h4>
              <p className="text-slate-700 font-semibold">{b.emergencyMusterPoint}</p>
              <p className="text-[11px] text-slate-500 mt-1">
                In event of yard alarm, sound continuous horn, turn off engine, leave keys in ignition, and report directly to Assembly Point A.
              </p>
            </div>

            <div className="rounded-xl border border-slate-200 p-3.5 bg-slate-50">
              <h4 className="font-bold text-slate-900 mb-1 flex items-center gap-1.5">
                <Phone className="h-4 w-4 text-blue-600" />
                Depot Control & Duty Safety Officer
              </h4>
              <p className="text-slate-900 font-bold">{b.siteManager.name}</p>
              <p className="text-slate-600">Telephone: {b.siteManager.phone}</p>
              <p className="text-slate-600">Radio Channel: {b.siteManager.radioChannel || 'PMR Channel 2'}</p>
            </div>
          </div>

          {/* Driver Sign-Off Statement */}
          <div className="border-t border-slate-200 pt-3 text-[11px] text-slate-500 flex flex-col sm:flex-row justify-between items-start sm:items-end gap-3">
            <div>
              <p className="font-semibold text-slate-700">Driver Safety Declaration:</p>
              <p>
                I confirm that I have received, listened to, or read the delivery site risk assessment rules for {site.title}, and will adhere to the 10mph limit, mandatory PPE, and reversing controls.
              </p>
            </div>
            <div className="border-b border-slate-400 w-48 text-center text-[10px] text-slate-400 pt-4">
              Driver Signature / Date
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
