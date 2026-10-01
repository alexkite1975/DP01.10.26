'use client';

import React, { useState } from 'react';
import { X } from 'lucide-react';

const DVSA_ITEMS = [
  'Mirrors, Glass & CMS Cameras', 'Wipers & Washer Fluid', 'Audible Horn', 'Cab Height Matches Placard (4.45m)',
  'Headlamps & Sidelights', 'Direction Indicators & Hazards', 'Stop Lights & Reverse Lamps', 'Side Marker Lights',
  'Susie Cables (ISO 7638 EBS)', 'Air Pressure Build-up Gauge', 'Audible Air Leaks Test', 'Trailer Susies (Red/Yellow)',
  'Foot Brake & Parking Handbrake', 'Tyre Tread (>=1mm central 3/4)', 'Tyre Cuts / Cords / Bulges', 'Wheel Nuts & Indicators',
  'Mudguards & Spray Flaps', 'Fifth-Wheel Dog-Clip & Kingpin', 'Landing Legs Stowed', 'Load Restraint & Rear Doors'
];

export default function WalkaroundInspectionModal({
  isOpen,
  onClose,
  onPassed
}: {
  isOpen: boolean;
  onClose: () => void;
  onPassed: () => void;
}) {
  const [statuses, setStatuses] = useState<Record<number, 'pass' | 'minor' | 'critical'>>({});
  const [pin, setPin] = useState('');

  if (!isOpen) return null;

  const criticalCount = Object.values(statuses).filter(s => s === 'critical').length;
  const isVor = criticalCount > 0;
  const isComplete = Object.keys(statuses).length === 20;

  const setAllPass = () => {
    const all: Record<number, 'pass'> = {};
    DVSA_ITEMS.forEach((_, i) => (all[i] = 'pass'));
    setStatuses(all);
  };

  return (
    <div className="fixed inset-0 z-50 bg-[#090D16] overflow-y-auto p-4 sm:p-6 text-slate-100 flex flex-col items-center">
      <div className="w-full max-w-3xl space-y-4 pb-20">
        <div className="flex items-center justify-between bg-[#0D1527] border border-slate-800 p-4 rounded-2xl">
          <div>
            <span className="text-[10px] font-mono uppercase bg-cyan-950 text-cyan-400 px-2 py-0.5 rounded border border-cyan-800">DVSA Pre-Use Check</span>
            <h2 className="text-lg font-bold text-white mt-1">20-Point Statutory Walkaround</h2>
          </div>
          <button onClick={onClose} className="p-2 bg-slate-800 rounded-lg text-slate-400 hover:text-white"><X className="w-5 h-5" /></button>
        </div>

        {isVor && (
          <div className="bg-red-950/90 border-2 border-red-500 rounded-2xl p-4 text-white animate-pulse">
            <b className="text-sm uppercase block">⛔ VEHICLE OFF ROAD (VOR): CRITICAL DEFECT LOGGED</b>
            <span className="text-xs text-red-200">The vehicle is grounded under statutory regulations. Gatekeeper lockout active.</span>
          </div>
        )}

        <div className="flex justify-between items-center px-1">
          <span className="text-xs font-mono text-slate-400">Completed: {Object.keys(statuses).length}/20</span>
          <button onClick={setAllPass} className="text-xs font-bold text-emerald-300 bg-emerald-950 border border-emerald-600 px-3 py-1 rounded-lg">
            ✓ Quick Pass All Clean (20/20)
          </button>
        </div>

        <div className="space-y-2">
          {DVSA_ITEMS.map((item, idx) => (
            <div key={idx} className="flex items-center justify-between p-3 rounded-xl bg-[#0D1527] border border-slate-800">
              <span className="text-xs font-medium text-white">{idx + 1}. {item}</span>
              <div className="flex items-center space-x-1">
                <button onClick={() => setStatuses(p => ({ ...p, [idx]: 'pass' }))} className={`px-2.5 py-1 text-xs rounded font-bold ${statuses[idx] === 'pass' ? 'bg-emerald-500 text-black' : 'bg-slate-800 text-slate-300'}`}>PASS</button>
                <button onClick={() => setStatuses(p => ({ ...p, [idx]: 'minor' }))} className={`px-2.5 py-1 text-xs rounded font-bold ${statuses[idx] === 'minor' ? 'bg-amber-500 text-black' : 'bg-slate-800 text-slate-300'}`}>MINOR</button>
                <button onClick={() => setStatuses(p => ({ ...p, [idx]: 'critical' }))} className={`px-2.5 py-1 text-xs rounded font-bold ${statuses[idx] === 'critical' ? 'bg-red-600 text-white' : 'bg-slate-800 text-slate-300'}`}>CRITICAL</button>
              </div>
            </div>
          ))}
        </div>

        <div className="bg-[#0D1527] border border-slate-800 p-4 rounded-2xl flex flex-col sm:flex-row items-center gap-3">
          <input type="password" maxLength={4} value={pin} onChange={e => setPin(e.target.value)} placeholder="Driver PIN (8492)" className="bg-slate-900 border border-slate-700 px-3 py-2 rounded-xl text-center font-mono w-full sm:w-40 text-white" />
          {isVor ? (
            <button onClick={() => { alert('VOR defect dispatched to workshop.'); onClose(); }} className="w-full sm:flex-1 bg-red-600 py-3 rounded-xl font-bold font-mono text-sm text-white">Submit VOR Grounding Report</button>
          ) : (
            <button disabled={!isComplete || pin !== '8492'} onClick={() => { onPassed(); onClose(); }} className={`w-full sm:flex-1 py-3 rounded-xl font-bold font-mono text-sm ${isComplete && pin === '8492' ? 'bg-emerald-500 text-black' : 'bg-slate-800 text-slate-500 cursor-not-allowed'}`}>Sign & Begin Shift</button>
          )}
        </div>
      </div>
    </div>
  );
}
