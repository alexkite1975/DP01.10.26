#!/bin/bash
set -e

mkdir -p src/components/modules

# ==========================================
# MODULE 1: DRIVER PASSPORT
# ==========================================
cat << 'SUB_EOF' > src/components/modules/DriverPassportModule.tsx
'use client';
import React, { useState } from 'react';
import { UserCheck, CreditCard, ShieldCheck, Award, AlertCircle } from 'lucide-react';

export default function DriverPassportModule({ onBack }: { onBack: () => void }) {
  const [tachoInserted, setTachoInserted] = useState(true);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between border-b border-slate-800 pb-4">
        <div>
          <h2 className="text-xl font-bold font-mono text-white flex items-center gap-2">
            <UserCheck className="w-6 h-6 text-emerald-400" />
            01. Driver Passport & Digital CPC Credential
          </h2>
          <p className="text-xs text-slate-400 font-mono mt-1">
            Statutory DVLA Driver Qualification & Digital Tachograph Authentication
          </p>
        </div>
        <button onClick={onBack} className="px-3 py-1.5 rounded-lg bg-slate-800 text-xs font-mono text-slate-300 hover:bg-slate-700">
          ← Back to Cockpit
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Digital Tacho Card Graphic */}
        <div className="bg-gradient-to-br from-slate-900 to-slate-950 border border-slate-800 rounded-2xl p-5 shadow-xl relative overflow-hidden">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-mono font-bold text-emerald-400 uppercase tracking-widest">
              UK Digital Tachograph Card
            </span>
            <CreditCard className="w-5 h-5 text-slate-400" />
          </div>
          <div className="mt-6 flex items-center gap-4">
            <div className="w-14 h-14 rounded-full bg-slate-800 border-2 border-emerald-500/50 flex items-center justify-center text-lg font-bold font-mono text-white">
              AK
            </div>
            <div>
              <div className="text-lg font-bold font-mono text-white">Alex Kite</div>
              <div className="text-xs font-mono text-slate-400">Card No: <span className="text-slate-200 font-bold">GB-902184-01</span></div>
              <div className="text-xs font-mono text-slate-400">Valid: <span className="text-emerald-400 font-bold">2029-05-18</span></div>
            </div>
          </div>
          <div className="mt-6 pt-4 border-t border-slate-800 flex items-center justify-between">
            <span className="text-xs font-mono text-slate-300">
              Slot Status: <strong className={tachoInserted ? "text-emerald-400" : "text-amber-400"}>{tachoInserted ? "CARD INSERTED (SLOT 1)" : "CARD EJECTED"}</strong>
            </span>
            <button
              onClick={() => setTachoInserted(!tachoInserted)}
              className="px-3 py-1 rounded bg-slate-800 hover:bg-slate-700 text-xs font-mono font-bold text-slate-200"
            >
              {tachoInserted ? "Eject Card" : "Insert Card"}
            </button>
          </div>
        </div>

        {/* DVLA & CPC Status */}
        <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-5 space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-xs font-mono font-bold text-slate-300 uppercase">DVLA Licence Checks</span>
            <ShieldCheck className="w-5 h-5 text-emerald-400" />
          </div>
          <div className="space-y-2 font-mono text-xs">
            <div className="flex justify-between p-2 rounded bg-slate-950/60 border border-slate-800/80">
              <span className="text-slate-400">Category C+E (Articulated HGV):</span>
              <span className="text-emerald-400 font-bold">VERIFIED (0 Points)</span>
            </div>
            <div className="flex justify-between p-2 rounded bg-slate-950/60 border border-slate-800/80">
              <span className="text-slate-400">Driver CPC Periodic Training:</span>
              <span className="text-emerald-400 font-bold">35 / 35 Hours Done</span>
            </div>
            <div className="flex justify-between p-2 rounded bg-slate-950/60 border border-slate-800/80">
              <span className="text-slate-400">DQC Expiry Date:</span>
              <span className="text-white font-bold">2028-09-14</span>
            </div>
            <div className="flex justify-between p-2 rounded bg-slate-950/60 border border-slate-800/80">
              <span className="text-slate-400">Right to Work in UK:</span>
              <span className="text-emerald-400 font-bold">SHARE CODE VERIFIED</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
SUB_EOF

# ==========================================
# MODULE 2: TACHO CLOCKS
# ==========================================
cat << 'SUB_EOF' > src/components/modules/TachoClocksModule.tsx
'use client';
import React, { useState, useEffect } from 'react';
import { Clock, Play, Pause, AlertTriangle, ShieldCheck } from 'lucide-react';

export default function TachoClocksModule({ onBack }: { onBack: () => void }) {
  const [dutyMode, setDutyMode] = useState<'DRIVE' | 'WORK' | 'REST' | 'POA'>('DRIVE');
  const [driveSeconds, setDriveSeconds] = useState(13240); // ~3h 40m
  const [dailySeconds, setDailySeconds] = useState(25800); // ~7h 10m

  useEffect(() => {
    const timer = setInterval(() => {
      if (dutyMode === 'DRIVE') {
        setDriveSeconds(s => s + 1);
        setDailySeconds(s => s + 1);
      }
    }, 1000);
    return () => clearInterval(timer);
  }, [dutyMode]);

  const formatHMS = (secs: number) => {
    const h = Math.floor(secs / 3600);
    const m = Math.floor((secs % 3600) / 60);
    const s = secs % 60;
    return `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  const remainingBreakSeconds = Math.max(0, 16200 - driveSeconds); // 4h 30m = 16200s
  const isNearLimit = remainingBreakSeconds < 1800; // less than 30 mins

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between border-b border-slate-800 pb-4">
        <div>
          <h2 className="text-xl font-bold font-mono text-white flex items-center gap-2">
            <Clock className="w-6 h-6 text-emerald-400" />
            02. EU 561/2006 Tachograph Compliance Console
          </h2>
          <p className="text-xs text-slate-400 font-mono mt-1">
            Real-Time Statutory Driving Limits, 45m Break Tracker & Daily Rest
          </p>
        </div>
        <button onClick={onBack} className="px-3 py-1.5 rounded-lg bg-slate-800 text-xs font-mono text-slate-300 hover:bg-slate-700">
          ← Back to Cockpit
        </button>
      </div>

      {/* Duty Switcher */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {(['DRIVE', 'WORK', 'REST', 'POA'] as const).map(mode => (
          <button
            key={mode}
            onClick={() => setDutyMode(mode)}
            className={`p-4 rounded-xl font-mono text-sm font-bold border transition-all ${
              dutyMode === mode
                ? mode === 'DRIVE' ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500 shadow-lg shadow-emerald-500/20'
                : mode === 'REST' ? 'bg-blue-500/20 text-blue-400 border-blue-500'
                : mode === 'WORK' ? 'bg-amber-500/20 text-amber-400 border-amber-500'
                : 'bg-purple-500/20 text-purple-400 border-purple-500'
                : 'bg-slate-900/60 text-slate-400 border-slate-800 hover:bg-slate-800'
            }`}
          >
            {mode === 'DRIVE' ? '🚛 DRIVING' : mode === 'WORK' ? '📦 OTHER WORK' : mode === 'REST' ? '☕ REST / BREAK' : '⏳ AVAILABILITY'}
          </button>
        ))}
      </div>

      {/* Active Clocks */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className={`p-5 rounded-2xl border ${isNearLimit ? 'bg-amber-500/10 border-amber-500/40' : 'bg-slate-900/80 border-slate-800'}`}>
          <span className="text-xs font-mono text-slate-400 uppercase">Continuous Driving Clock (Max 4.5h)</span>
          <div className="text-4xl font-extrabold font-mono text-white mt-2">{formatHMS(driveSeconds)}</div>
          <div className="text-xs font-mono mt-2 text-amber-400 font-bold">
            Break required in: {formatHMS(remainingBreakSeconds)}
          </div>
        </div>

        <div className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800">
          <span className="text-xs font-mono text-slate-400 uppercase">Daily Driving Limit (9h / 10h)</span>
          <div className="text-4xl font-extrabold font-mono text-white mt-2">{formatHMS(dailySeconds)}</div>
          <div className="text-xs font-mono mt-2 text-slate-400">
            Daily limit: <strong className="text-emerald-400">9h 00m (0 of 2 10h used)</strong>
          </div>
        </div>

        <div className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800">
          <span className="text-xs font-mono text-slate-400 uppercase">Statutory Daily Rest Due</span>
          <div className="text-4xl font-extrabold font-mono text-white mt-2">11:00:00</div>
          <div className="text-xs font-mono mt-2 text-emerald-400 font-bold flex items-center gap-1">
            <ShieldCheck className="w-4 h-4" /> 100% Legally Compliant
          </div>
        </div>
      </div>
    </div>
  );
}
SUB_EOF

# ==========================================
# MODULE 3: WALKAROUND & DEFECT CAMERA
# ==========================================
cat << 'SUB_EOF' > src/components/modules/WalkaroundModule.tsx
'use client';
import React, { useState } from 'react';
import { ClipboardCheck, AlertOctagon, CheckCircle2, Camera } from 'lucide-react';

export default function WalkaroundModule({ onBack }: { onBack: () => void }) {
  const [checks, setChecks] = useState<Record<string, 'PASS' | 'FAIL'>>({
    tyres: 'PASS',
    brakes: 'PASS',
    lights: 'PASS',
    coupling: 'PASS',
    mirrors: 'PASS',
    wipers: 'PASS',
    placards: 'PASS',
    airLeaks: 'PASS'
  });

  const [hasDefect, setHasDefect] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const toggleCheck = (item: string) => {
    setChecks(prev => {
      const next = prev[item] === 'PASS' ? 'FAIL' : 'PASS';
      const anyFail = Object.values({ ...prev, [item]: next }).some(v => v === 'FAIL');
      setHasDefect(anyFail);
      return { ...prev, [item]: next };
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between border-b border-slate-800 pb-4">
        <div>
          <h2 className="text-xl font-bold font-mono text-white flex items-center gap-2">
            <ClipboardCheck className="w-6 h-6 text-emerald-400" />
            03. DVSA Statutory 20-Point Walkaround Inspection
          </h2>
          <p className="text-xs text-slate-400 font-mono mt-1">
            Pre-Shift Vehicle Roadworthiness Audit with Camera Snapper & VOR Safety Lock
          </p>
        </div>
        <button onClick={onBack} className="px-3 py-1.5 rounded-lg bg-slate-800 text-xs font-mono text-slate-300 hover:bg-slate-700">
          ← Back to Cockpit
        </button>
      </div>

      {hasDefect && (
        <div className="p-4 bg-red-500/10 border border-red-500/50 rounded-xl flex items-center gap-3 text-red-400 font-mono text-xs">
          <AlertOctagon className="w-6 h-6 flex-shrink-0 text-red-400 animate-pulse" />
          <div>
            <strong>CRITICAL DEFECT DETECTED — VEHICLE PLACED ON VOR (VEHICLE OFF ROAD)</strong>
            <div>Tractor unit DG21EDP cannot legally be moved on public roads until signed off by a technician.</div>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3">
        {Object.entries(checks).map(([key, status]) => (
          <div
            key={key}
            onClick={() => toggleCheck(key)}
            className={`p-4 rounded-xl border cursor-pointer font-mono text-xs transition-all ${
              status === 'PASS'
                ? 'bg-slate-900/60 border-slate-800 text-slate-300 hover:border-emerald-500/50'
                : 'bg-red-500/20 border-red-500 text-red-300'
            }`}
          >
            <div className="flex justify-between items-center">
              <span className="capitalize font-bold">{key.replace(/([A-Z])/g, ' $1')}</span>
              <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${status === 'PASS' ? 'bg-emerald-500/20 text-emerald-400' : 'bg-red-500 text-white'}`}>
                {status}
              </span>
            </div>
            <div className="mt-2 text-[10px] text-slate-500">Tap to toggle Fail/Pass</div>
          </div>
        ))}
      </div>

      <div className="flex items-center justify-between pt-4 border-t border-slate-800">
        <button
          onClick={() => alert('Camera Snapper Opened: Defect snapshot captured.')}
          className="px-4 py-2 rounded-xl bg-slate-800 text-slate-200 font-mono text-xs font-bold flex items-center gap-2 hover:bg-slate-700"
        >
          <Camera className="w-4 h-4 text-emerald-400" />
          Capture Inspection Photos
        </button>

        <button
          onClick={() => setSubmitted(true)}
          className={`px-6 py-2.5 rounded-xl font-mono text-xs font-bold transition-all ${
            hasDefect
              ? 'bg-red-600 text-white'
              : 'bg-emerald-500 text-slate-950 hover:bg-emerald-400'
          }`}
        >
          {submitted ? '✓ AUDIT SIGNED & SUBMITTED' : hasDefect ? 'LOCK VEHICLE (VOR)' : 'SIGN & PASS INSPECTION'}
        </button>
      </div>
    </div>
  );
}
SUB_EOF

# ==========================================
# MODULE 4: TOMTOM HGV NAVIGATION
# ==========================================
cat << 'SUB_EOF' > src/components/modules/TruckNavModule.tsx
'use client';
import React, { useState } from 'react';
import dynamic from 'next/dynamic';
import { Navigation, AlertTriangle, ShieldCheck, MapPin } from 'lucide-react';

const TomTomTruckMap = dynamic(
  () => import('@/components/in-cab/TomTomTruckMap'),
  { ssr: false }
);

export default function TruckNavModule({ onBack }: { onBack: () => void }) {
  const [hazard, setHazard] = useState<any>({
    name: 'A5 Railway Arch Bridge',
    clearanceM: 4.12,
    distanceM: 450
  });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between border-b border-slate-800 pb-4">
        <div>
          <h2 className="text-xl font-bold font-mono text-white flex items-center gap-2">
            <Navigation className="w-6 h-6 text-emerald-400" />
            04. TomTom 44-Tonne Commercial Truck Navigation
          </h2>
          <p className="text-xs text-slate-400 font-mono mt-1">
            Active Height (4.45m), Weight (44t) & Low-Bridge Strike Collision Radar
          </p>
        </div>
        <button onClick={onBack} className="px-3 py-1.5 rounded-lg bg-slate-800 text-xs font-mono text-slate-300 hover:bg-slate-700">
          ← Back to Cockpit
        </button>
      </div>

      {hazard && (
        <div className="p-4 bg-amber-500/10 border border-amber-500/50 rounded-2xl flex items-center justify-between">
          <div className="flex items-center gap-3">
            <AlertTriangle className="w-7 h-7 text-amber-400 flex-shrink-0 animate-bounce" />
            <div className="font-mono text-xs">
              <strong className="text-amber-400 text-sm">LOW BRIDGE AHEAD: {hazard.name}</strong>
              <div className="text-slate-300">Clearance: <strong className="text-white">{hazard.clearanceM}m</strong> | Vehicle Height: <strong className="text-red-400">4.45m</strong> ({hazard.distanceM}m away)</div>
            </div>
          </div>
          <button
            onClick={() => {
              alert('Calculating safe 44t bypass around low bridge...');
              setHazard(null);
            }}
            className="px-4 py-2 rounded-xl bg-amber-500 text-slate-950 font-mono font-bold text-xs hover:bg-amber-400"
          >
            RECALCULATE SAFE HGV BYPASS
          </button>
        </div>
      )}

      {/* Map View */}
      <div className="rounded-2xl overflow-hidden border border-slate-800 shadow-2xl">
        <TomTomTruckMap
          origin={{ lat: 52.3025, lon: -1.1561 }}
          destination={{ lat: 51.5303, lon: -0.2783 }}
          vehicleHeightMeters={4.45}
          vehicleWeightKg={44000}
          onHazardDetected={h => setHazard(h)}
        />
      </div>
    </div>
  );
}
SUB_EOF

# ==========================================
# MODULE 5: SITE RISK & DEMURRAGE
# ==========================================
cat << 'SUB_EOF' > src/components/modules/SiteDemurrageModule.tsx
'use client';
import React, { useState, useEffect } from 'react';
import { Building2, Timer, KeyRound, AlertCircle } from 'lucide-react';

export default function SiteDemurrageModule({ onBack }: { onBack: () => void }) {
  const [elapsedMinutes, setElapsedMinutes] = useState(135); // 2h 15m (15m into demurrage)
  const freeMinutes = 120; // 2 hour standard UK free waiting time
  const demurrageRatePerHour = 55.0; // £55.00/hr

  const isDemurrageActive = elapsedMinutes > freeMinutes;
  const billableMinutes = Math.max(0, elapsedMinutes - freeMinutes);
  const demurrageCharge = ((billableMinutes / 60) * demurrageRatePerHour).toFixed(2);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between border-b border-slate-800 pb-4">
        <div>
          <h2 className="text-xl font-bold font-mono text-white flex items-center gap-2">
            <Building2 className="w-6 h-6 text-emerald-400" />
            05. Distribution Centre Gatehouse & Demurrage Meter
          </h2>
          <p className="text-xs text-slate-400 font-mono mt-1">
            Automated Site Check-In, Bay Routing & Statutory Detention Fee Billing
          </p>
        </div>
        <button onClick={onBack} className="px-3 py-1.5 rounded-lg bg-slate-800 text-xs font-mono text-slate-300 hover:bg-slate-700">
          ← Back to Cockpit
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Gatehouse PIN */}
        <div className="p-5 bg-slate-900 border border-slate-800 rounded-2xl space-y-3">
          <div className="flex items-center justify-between text-slate-400 font-mono text-xs">
            <span>Gatehouse Security PIN</span>
            <KeyRound className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="text-4xl font-extrabold font-mono text-white tracking-widest text-center py-2">
            0 4 9 2
          </div>
          <div className="text-xs font-mono text-slate-400 text-center">
            Assigned Bay: <strong className="text-emerald-400">BAY 24 (INBOUND PALLETS)</strong>
          </div>
        </div>

        {/* Demurrage Clock */}
        <div className={`p-5 rounded-2xl border col-span-2 ${isDemurrageActive ? 'bg-amber-500/10 border-amber-500/50' : 'bg-slate-900 border-slate-800'}`}>
          <div className="flex items-center justify-between text-slate-400 font-mono text-xs">
            <span className="flex items-center gap-1.5">
              <Timer className="w-4 h-4 text-amber-400" />
              Live Site Detention & Demurrage Meter
            </span>
            <span className="px-2 py-0.5 rounded bg-slate-800 text-xs font-mono text-slate-300">
              Free Allowance: 2 Hours
            </span>
          </div>

          <div className="mt-4 flex items-center justify-between">
            <div>
              <div className="text-3xl font-extrabold font-mono text-white">
                {Math.floor(elapsedMinutes / 60)}h {elapsedMinutes % 60}m On-Site
              </div>
              <div className="text-xs font-mono text-slate-400 mt-1">
                Shipper: <strong className="text-slate-200">Tesco National Distribution Centre</strong>
              </div>
            </div>

            <div className="text-right">
              <div className="text-3xl font-extrabold font-mono text-amber-400">
                +£{demurrageCharge}
              </div>
              <div className="text-[11px] font-mono text-amber-400 font-bold uppercase">
                Billed to Shipper Escrow
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
SUB_EOF

# ==========================================
# MODULE 6: IN-CAB AI COPILOT
# ==========================================
cat << 'SUB_EOF' > src/components/modules/AICopilotModule.tsx
'use client';
import React, { useState } from 'react';
import { Bot, Send, Sparkles } from 'lucide-react';

export default function AICopilotModule({ onBack }: { onBack: () => void }) {
  const [query, setQuery] = useState('');
  const [messages, setMessages] = useState([
    { sender: 'AI', text: 'Hello Alex! I am your In-Cab Regulatory Co-Pilot. I monitor your EU 561/2006 tachograph driving hours, low-bridge clearances, and DVSA rules in real time. How can I assist your shift?' }
  ]);

  const handleAsk = (questionText?: string) => {
    const q = questionText || query;
    if (!q.trim()) return;

    setMessages(prev => [...prev, { sender: 'DRIVER', text: q }]);
    setQuery('');

    setTimeout(() => {
      let answer = 'Under EU 561/2006, all commercial driving parameters must strictly conform to DVSA enforcement rules.';
      if (q.toLowerCase().includes('10 hour') || q.toLowerCase().includes('extend')) {
        answer = 'Under EU 561/2006 Article 6, you may extend your daily driving limit from 9 hours to 10 hours a maximum of twice in a fixed working week.';
      } else if (q.toLowerCase().includes('break') || q.toLowerCase().includes('4.5')) {
        answer = 'After 4.5 hours of continuous driving, you must take an uninterrupted break of at least 45 minutes, or a split break (15 minutes followed by 30 minutes).';
      } else if (q.toLowerCase().includes('bridge') || q.toLowerCase().includes('height')) {
        answer = 'Your trailer is 4.45m. Standard UK bridges under 16ft 6in (5.03m) are marked. Any arch bridge under 4.45m will trigger an immediate emergency reroute.';
      }

      setMessages(prev => [...prev, { sender: 'AI', text: answer }]);
    }, 400);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between border-b border-slate-800 pb-4">
        <div>
          <h2 className="text-xl font-bold font-mono text-white flex items-center gap-2">
            <Bot className="w-6 h-6 text-emerald-400" />
            06. In-Cab AI Regulatory Co-Pilot
          </h2>
          <p className="text-xs text-slate-400 font-mono mt-1">
            Natural Language Assistant for Statutory UK Transport Rules & Emergency Advice
          </p>
        </div>
        <button onClick={onBack} className="px-3 py-1.5 rounded-lg bg-slate-800 text-xs font-mono text-slate-300 hover:bg-slate-700">
          ← Back to Cockpit
        </button>
      </div>

      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 space-y-4">
        <div className="h-64 overflow-y-auto space-y-3 p-2 font-mono text-xs">
          {messages.map((m, idx) => (
            <div key={idx} className={`p-3 rounded-xl max-w-xl ${m.sender === 'AI' ? 'bg-slate-950 border border-slate-800 text-slate-200' : 'bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 ml-auto'}`}>
              <div className="text-[10px] font-bold text-slate-500 mb-1">{m.sender === 'AI' ? 'SMARTHAUL COPILOT' : 'DRIVER'}</div>
              {m.text}
            </div>
          ))}
        </div>

        {/* Quick Question Prompts */}
        <div className="flex flex-wrap gap-2 pt-2 border-t border-slate-800">
          <button onClick={() => handleAsk("Can I drive 10 hours today?")} className="px-3 py-1 rounded-full bg-slate-800 text-[11px] font-mono text-slate-300 hover:bg-slate-700">
            Can I drive 10 hours today?
          </button>
          <button onClick={() => handleAsk("What is the mandatory 4.5h break rule?")} className="px-3 py-1 rounded-full bg-slate-800 text-[11px] font-mono text-slate-300 hover:bg-slate-700">
            What is the 4.5h break rule?
          </button>
          <button onClick={() => handleAsk("What are the bridge clearance rules?")} className="px-3 py-1 rounded-full bg-slate-800 text-[11px] font-mono text-slate-300 hover:bg-slate-700">
            What are the bridge clearance rules?
          </button>
        </div>

        {/* Input Bar */}
        <div className="flex gap-2">
          <input
            type="text"
            value={query}
            onChange={e => setQuery(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && handleAsk()}
            placeholder="Ask anything about UK tacho rules, bridge limits, or rest breaks..."
            className="flex-1 bg-slate-950 border border-slate-800 rounded-xl px-4 py-2 font-mono text-xs text-white focus:outline-none focus:border-emerald-500"
          />
          <button onClick={() => handleAsk()} className="px-4 py-2 rounded-xl bg-emerald-500 text-slate-950 font-mono font-bold text-xs hover:bg-emerald-400">
            <Send className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
SUB_EOF

# ==========================================
# MASTER COCKPIT ORCHESTRATOR (PAGE.TSX)
# ==========================================
cat << 'SUB_EOF' > src/app/page.tsx
'use client';

import React, { useState } from 'react';
import { UserCheck, Clock, ClipboardCheck, Navigation, Building2, Bot, ArrowRight, ShieldCheck } from 'lucide-react';
import LiveTelemetryCluster from '@/components/in-cab/LiveTelemetryCluster';
import EscrowPayoutCard from '@/components/in-cab/EscrowPayoutCard';

import DriverPassportModule from '@/components/modules/DriverPassportModule';
import TachoClocksModule from '@/components/modules/TachoClocksModule';
import WalkaroundModule from '@/components/modules/WalkaroundModule';
import TruckNavModule from '@/components/modules/TruckNavModule';
import SiteDemurrageModule from '@/components/modules/SiteDemurrageModule';
import AICopilotModule from '@/components/modules/AICopilotModule';

export default function SmartHaulCockpit() {
  const [activeModule, setActiveModule] = useState<number | null>(null);

  return (
    <main className="min-h-screen bg-[#090D16] text-slate-100 p-4 sm:p-6 md:p-8 space-y-6 max-w-7xl mx-auto">
      {/* Top Telemetry & Escrow Badges */}
      <div className="space-y-4">
        <LiveTelemetryCluster />
        <EscrowPayoutCard />
      </div>

      {/* Render Active Module OR the 6-Module Grid */}
      {activeModule === 1 ? (
        <DriverPassportModule onBack={() => setActiveModule(null)} />
      ) : activeModule === 2 ? (
        <TachoClocksModule onBack={() => setActiveModule(null)} />
      ) : activeModule === 3 ? (
        <WalkaroundModule onBack={() => setActiveModule(null)} />
      ) : activeModule === 4 ? (
        <TruckNavModule onBack={() => setActiveModule(null)} />
      ) : activeModule === 5 ? (
        <SiteDemurrageModule onBack={() => setActiveModule(null)} />
      ) : activeModule === 6 ? (
        <AICopilotModule onBack={() => setActiveModule(null)} />
      ) : (
        <div className="space-y-6">
          <div className="border-b border-slate-800 pb-3">
            <div className="text-xs font-mono text-emerald-400 font-bold uppercase tracking-wider">
              TOMTOM TRUCK ENGINE • LIVE IN-CAB
            </div>
            <h1 className="text-2xl font-extrabold font-mono text-white tracking-tight mt-1">
              Driver Command Centre
            </h1>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Card 01 */}
            <div onClick={() => setActiveModule(1)} className="p-5 bg-slate-900/80 border border-slate-800 rounded-2xl hover:border-emerald-500/50 cursor-pointer transition-all space-y-4 group">
              <div className="flex justify-between items-center">
                <span className="font-mono text-xs font-bold text-slate-500">01</span>
                <UserCheck className="w-5 h-5 text-emerald-400 group-hover:scale-110 transition-transform" />
              </div>
              <div>
                <h3 className="font-mono text-base font-bold text-white">Driver Passport</h3>
                <p className="font-mono text-xs text-slate-400 mt-1">Identity, DVLA Licences & CPC Digital Record</p>
              </div>
              <div className="flex items-center gap-1 font-mono text-xs text-emerald-400 font-bold">
                Launch Module <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
              </div>
            </div>

            {/* Card 02 */}
            <div onClick={() => setActiveModule(2)} className="p-5 bg-slate-900/80 border border-slate-800 rounded-2xl hover:border-emerald-500/50 cursor-pointer transition-all space-y-4 group">
              <div className="flex justify-between items-center">
                <span className="font-mono text-xs font-bold text-slate-500">02</span>
                <Clock className="w-5 h-5 text-emerald-400 group-hover:scale-110 transition-transform" />
              </div>
              <div>
                <h3 className="font-mono text-base font-bold text-white">Tacho Clocks</h3>
                <p className="font-mono text-xs text-slate-400 mt-1">Active 4.5h Break & 9h/10h Daily Driving Parameters</p>
              </div>
              <div className="flex items-center gap-1 font-mono text-xs text-emerald-400 font-bold">
                Launch Module <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
              </div>
            </div>

            {/* Card 03 */}
            <div onClick={() => setActiveModule(3)} className="p-5 bg-slate-900/80 border border-slate-800 rounded-2xl hover:border-emerald-500/50 cursor-pointer transition-all space-y-4 group">
              <div className="flex justify-between items-center">
                <span className="font-mono text-xs font-bold text-slate-500">03</span>
                <ClipboardCheck className="w-5 h-5 text-emerald-400 group-hover:scale-110 transition-transform" />
              </div>
              <div>
                <h3 className="font-mono text-base font-bold text-white">Walkaround & Defect Camera</h3>
                <p className="font-mono text-xs text-slate-400 mt-1">DVSA 20-Point Inspection with Camera Snapper</p>
              </div>
              <div className="flex items-center gap-1 font-mono text-xs text-emerald-400 font-bold">
                Launch Module <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
              </div>
            </div>

            {/* Card 04 */}
            <div onClick={() => setActiveModule(4)} className="p-5 bg-slate-900/80 border border-slate-800 rounded-2xl hover:border-emerald-500/50 cursor-pointer transition-all space-y-4 group">
              <div className="flex justify-between items-center">
                <span className="font-mono text-xs font-bold text-slate-500">04</span>
                <Navigation className="w-5 h-5 text-emerald-400 group-hover:scale-110 transition-transform" />
              </div>
              <div>
                <h3 className="font-mono text-base font-bold text-white">TomTom HGV Navigation</h3>
                <p className="font-mono text-xs text-slate-400 mt-1">Live TomTom 44t Low-Bridge Commercial Routing Engine</p>
              </div>
              <div className="flex items-center gap-1 font-mono text-xs text-emerald-400 font-bold">
                Launch Module <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
              </div>
            </div>

            {/* Card 05 */}
            <div onClick={() => setActiveModule(5)} className="p-5 bg-slate-900/80 border border-slate-800 rounded-2xl hover:border-emerald-500/50 cursor-pointer transition-all space-y-4 group">
              <div className="flex justify-between items-center">
                <span className="font-mono text-xs font-bold text-slate-500">05</span>
                <Building2 className="w-5 h-5 text-emerald-400 group-hover:scale-110 transition-transform" />
              </div>
              <div>
                <h3 className="font-mono text-base font-bold text-white">Site Risk & Demurrage</h3>
                <p className="font-mono text-xs text-slate-400 mt-1">Gatehouse PIN 0492, Bay 24 & Live Demurrage Clock</p>
              </div>
              <div className="flex items-center gap-1 font-mono text-xs text-emerald-400 font-bold">
                Launch Module <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
              </div>
            </div>

            {/* Card 06 */}
            <div onClick={() => setActiveModule(6)} className="p-5 bg-slate-900/80 border border-slate-800 rounded-2xl hover:border-emerald-500/50 cursor-pointer transition-all space-y-4 group">
              <div className="flex justify-between items-center">
                <span className="font-mono text-xs font-bold text-slate-500">06</span>
                <Bot className="w-5 h-5 text-emerald-400 group-hover:scale-110 transition-transform" />
              </div>
              <div>
                <h3 className="font-mono text-base font-bold text-white">In-Cab AI Copilot</h3>
                <p className="font-mono text-xs text-slate-400 mt-1">Voice & Natural Language Regulatory Assistant</p>
              </div>
              <div className="flex items-center gap-1 font-mono text-xs text-emerald-400 font-bold">
                Launch Module <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
              </div>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}
SUB_EOF

echo "Building and deploying real software..."
bash build-and-deploy.sh
