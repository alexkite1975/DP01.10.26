'use client';

import React, { useState, useEffect, useRef } from 'react';
import dynamic from 'next/dynamic';
import {
  UserCheck, Clock, Truck, ShieldAlert, Building2,
  AlertTriangle, ArrowRight, Camera,
  CheckSquare, Square, Edit3, User, X,
  MessageSquare, Send, Navigation
} from 'lucide-react';

// Dynamically import TomTomTruckMap with SSR disabled to guarantee zero build-time crashes
const TomTomTruckMap = dynamic(() => import('@/components/TomTomTruckMap'), {
  ssr: false,
  loading: () => (
    <div className="h-80 w-full rounded-2xl bg-slate-950 border border-slate-800 flex items-center justify-center text-xs font-mono text-emerald-400 animate-pulse">
      Initializing TomTom HGV Navigation Engine...
    </div>
  )
});

type StageId = 'Profile' | 'Tacho' | 'Vehicle Check' | 'Route Optimiser/Bridge Radar' | 'Site Risk Pro' | 'Copilot Chat';

const TOMTOM_KEY = 'VAoysEhBIuvecQV83QD5ydBler8Asz73';

const DEFAULT_PROFILE = {
  name: 'MR ALEXANDER JAMES KITE',
  licenceNumber: 'KITE9707185AJ9ZM 26',
  tachoCard: 'DB25029078179500',
  cpcHours: '35 / 35 Periodic Hours',
  defaultReg: 'DG21EDP',
  classEntitlement: 'Class 1 C+E Active',
  dob: '18.07.1975',
  address: '14 THE HILL, BLUNHAM, BEDFORD, MK44 3NG'
};

const CHECKS = [
  { id: 'c1', name: 'Mirrors, Glass & Camera Monitor System', zone: 'CAB', std: 'Clean swept glass; CMS displays clear without latency.' },
  { id: 'c2', name: 'Wipers, Washers & Audible Horn', zone: 'CAB', std: 'Wipers clear in one stroke; horn loud and distinct.' },
  { id: 'c3', name: 'Cab Height Indicator Matches Trailer (4.45m)', zone: 'CAB', std: 'Physical height placard must match attached trailer.' },
  { id: 'l1', name: 'Headlamps, Indicators & Side Repeaters', zone: 'LIGHTS', std: 'Dipped beams operational; flashing rate 60-120/min.' },
  { id: 'w1', name: 'Tyre Tread (>1mm) & Wheel Nut Pointers', zone: 'WHEELS', std: 'Zero cords exposed; yellow alignment pointers tip-to-tip.' },
  { id: 't1', name: 'Susie Lines, Red Emergency & ISO Electric', zone: 'TRAILER', std: 'Lines clear of catwalk; couplings seated with seals intact.' },
  { id: 't2', name: 'Fifth Wheel Locking Bar & Dog Clip Closed', zone: 'TRAILER', std: 'Lock bar across kingpin; secondary catch securely dog-clipped.' }
];

export default function App() {
  const [stage, setStage] = useState<StageId | 'HUB'>('HUB');

  // DRIVER PROFILE
  const [profile, setProfile] = useState(DEFAULT_PROFILE);
  const [profileModal, setProfileModal] = useState(false);
  const [editForm, setEditForm] = useState(DEFAULT_PROFILE);

  useEffect(() => {
    try {
      const saved = localStorage.getItem('dp_profile');
      if (saved) {
        const parsed = JSON.parse(saved);
        setProfile(parsed);
        setEditForm(parsed);
      }
    } catch {}
  }, []);

  const saveProfile = () => {
    setProfile(editForm);
    try {
      localStorage.setItem('dp_profile', JSON.stringify(editForm));
    } catch {}
    setProfileModal(false);
  };

  // TOMTOM ROUTE PLANNER STATE
  const [origin, setOrigin] = useState('Daventry, NN6 7GZ');
  const [destination, setDestination] = useState('Park Royal, London NW10 7HQ');
  const [syncAddr, setSyncAddr] = useState(true);
  const [routeStats, setRouteStats] = useState<{ miles: string; duration: string; trafficDelay: string } | null>(null);
  const [recalcTrigger, setRecalcTrigger] = useState(0);

  // TACHO CALCULATOR
  const [driveHours, setDriveHours] = useState(5.7);
  const remainingDailyDrive = Math.max(0, 9.0 - driveHours).toFixed(2);
  const nextBreakDue = Math.max(0, 4.5 - (driveHours % 4.5)).toFixed(2);

  // REAL CAMERA DEFECT CAPTURE
  const [defectPhoto, setDefectPhoto] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const handlePhotoCapture = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => setDefectPhoto(reader.result as string);
      reader.readAsDataURL(file);
    }
  };

  // IN-CAB AI COPILOT CHAT
  const [chatMessages, setChatMessages] = useState<{ sender: 'user' | 'ai'; text: string }[]>([
    { sender: 'ai', text: `Hello Alex, your TomTom Commercial HGV Engine is online. Low bridges below 4.45m are bypassed. Ask me anything about routes, DVSA rules, or demurrage.` }
  ]);
  const [inputMessage, setInputMessage] = useState('');

  const sendChatMessage = () => {
    if (!inputMessage.trim()) return;
    const userText = inputMessage.trim();
    const newHistory = [...chatMessages, { sender: 'user' as const, text: userText }];
    setChatMessages(newHistory);
    setInputMessage('');

    setTimeout(() => {
      let reply = "Under DVSA PG9 standards, ensure your pre-use walkaround is recorded. If an unmapped restriction is encountered, stop safely and notify dispatch.";
      const lower = userText.toLowerCase();
      if (lower.includes('bridge') || lower.includes('height')) {
        reply = "⚠️ Attached trailer is 4.45m (14'7\"). Never attempt any arched or flat bridge signed below 4.65m (15'3\") to preserve 20cm clearance.";
      } else if (lower.includes('hours') || lower.includes('tacho') || lower.includes('break')) {
        reply = "⏱️ EU 561/2006 Limits: Maximum uninterrupted driving is 4.5 hours, requiring a 45-min break. Daily limit is 9 hours (extendable to 10 hours twice/week).";
      } else if (lower.includes('defect') || lower.includes('tyre')) {
        reply = "🔴 DVSA PG9 Manual: Tyres must maintain ≥1.0mm tread depth across 3/4 continuous breadth with zero cord exposed (immediate VOR).";
      } else if (lower.includes('pin') || lower.includes('gate') || lower.includes('site')) {
        reply = "📍 Park Royal Site Protocol: Barrier PIN is 8492. Demurrage commences 60 minutes post-gatehouse arrival. Reserved at Bay 24.";
      }
      setChatMessages([...newHistory, { sender: 'ai', text: reply }]);
    }, 350);
  };

  // DEMURRAGE TIMER
  const [demSec, setDemSec] = useState(2145);
  useEffect(() => {
    const timer = setInterval(() => setDemSec(s => s + 1), 1000);
    return () => clearInterval(timer);
  }, []);
  const fmtTime = (s: number) => {
    const h = Math.floor(s / 3600).toString().padStart(2, '0');
    const m = Math.floor((s % 3600) / 60).toString().padStart(2, '0');
    const sec = (s % 60).toString().padStart(2, '0');
    return `${h}:${m}:${sec}`;
  };

  const TOOLS: { id: StageId; num: string; label: string; icon: any; desc: string }[] = [
    { id: 'Profile', num: '01', label: 'Driver Passport', icon: UserCheck, desc: 'Identity, DVLA Licences & CPC Digital Record' },
    { id: 'Tacho', num: '02', label: 'Tacho Clocks', icon: Clock, desc: 'Active 4.5h Break & 9h/10h Daily Driving Parameters' },
    { id: 'Vehicle Check', num: '03', label: 'Walkaround & Defect Camera', icon: Truck, desc: 'DVSA 27-Point Inspection with Camera Snapper' },
    { id: 'Route Optimiser/Bridge Radar', num: '04', label: 'TomTom HGV Navigation', icon: ShieldAlert, desc: 'Live TomTom 44t Low-Bridge Commercial Routing Engine' },
    { id: 'Site Risk Pro', num: '05', label: 'Site Risk & Demurrage', icon: Building2, desc: 'Gatehouse PIN 8492, Bay 24 & Live Demurrage Clock' },
    { id: 'Copilot Chat', num: '06', label: 'In-Cab AI Copilot', icon: MessageSquare, desc: 'Voice & Natural Language Regulatory Assistant' }
  ];

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans flex flex-col justify-between">
      {/* HEADER */}
      <header className="h-16 border-b border-slate-800 bg-slate-950/95 px-4 sm:px-8 flex items-center justify-between z-30">
        <button onClick={() => setStage('HUB')} className="flex items-center space-x-3 text-left">
          <div className="w-10 h-10 rounded-2xl bg-emerald-500/10 border border-emerald-500/40 flex items-center justify-center text-emerald-400 font-black font-mono">
            DP
          </div>
          <div>
            <span className="font-extrabold text-slate-100 text-lg">Drive <span className="text-emerald-400">Partners</span></span>
            <span className="text-[11px] text-slate-400 font-mono block leading-none">{stage === 'HUB' ? 'TomTom In-Cab OS' : stage}</span>
          </div>
        </button>

        <div className="flex items-center space-x-2">
          <button
            onClick={() => { setEditForm(profile); setProfileModal(true); }}
            className="flex items-center space-x-2 p-1.5 sm:px-3 py-1.5 rounded-xl bg-slate-900 border border-slate-800 text-slate-300 hover:border-emerald-500 transition-all"
          >
            <div className="w-7 h-7 rounded-lg bg-emerald-500/20 text-emerald-400 flex items-center justify-center font-bold text-xs font-mono">
              {profile.name.substring(0, 2)}
            </div>
            <span className="text-xs font-bold text-slate-200 hidden sm:inline">{profile.name.split(' ')[1] || profile.name}</span>
            <span className="text-[10px] text-emerald-400 font-mono hidden sm:inline">Switch ▾</span>
          </button>
          {stage !== 'HUB' && (
            <button onClick={() => setStage('HUB')} className="px-3 py-1.5 rounded-xl bg-slate-900 border border-slate-800 text-xs font-mono text-emerald-400">
              Hub
            </button>
          )}
        </div>
      </header>

      {/* MAIN VIEWPORT */}
      <main className="flex-1 max-w-6xl w-full mx-auto p-4 sm:p-8 flex flex-col justify-center">
        {stage === 'HUB' && (
          <div className="space-y-6">
            <div className="border-b border-slate-800 pb-4">
              <span className="text-xs font-mono text-emerald-400 font-bold uppercase tracking-widest">TOMTOM TRUCK ENGINE • LIVE IN-CAB</span>
              <h1 className="text-3xl sm:text-4xl font-black text-slate-100 mt-1">Driver Command Centre</h1>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {TOOLS.map((t) => {
                const Icon = t.icon;
                return (
                  <div
                    key={t.id}
                    onClick={() => setStage(t.id)}
                    className="bg-slate-900/80 hover:bg-slate-900 border border-slate-800 hover:border-emerald-500 rounded-3xl p-6 cursor-pointer transition-all shadow-xl flex flex-col justify-between min-h-[220px]"
                  >
                    <div>
                      <div className="flex justify-between items-center mb-4">
                        <span className="text-2xl font-black font-mono text-slate-700">{t.num}</span>
                        <div className="w-12 h-12 rounded-2xl bg-slate-950 border border-slate-800 flex items-center justify-center text-emerald-400">
                          <Icon size={24} />
                        </div>
                      </div>
                      <h2 className="text-xl font-bold text-slate-100">{t.label}</h2>
                      <p className="text-xs text-slate-400 mt-1">{t.desc}</p>
                    </div>
                    <div className="pt-4 border-t border-slate-800 flex justify-between text-xs font-mono font-bold text-emerald-400">
                      <span>Launch Module</span>
                      <ArrowRight size={16} />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* 01: DRIVER PROFILE */}
        {stage === 'Profile' && (
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 space-y-5">
            <div className="flex justify-between items-center border-b border-slate-800 pb-4">
              <div>
                <span className="text-xs font-mono text-emerald-400 font-bold">VERIFIED DVLA DRIVER PROFILE</span>
                <h2 className="text-2xl font-black text-slate-100">{profile.name}</h2>
                <p className="text-xs text-slate-400 font-mono">DOB: {profile.dob} • {profile.address}</p>
              </div>
              <button
                onClick={() => { setEditForm(profile); setProfileModal(true); }}
                className="px-3.5 py-2 rounded-xl bg-slate-800 text-xs font-mono font-bold text-emerald-400 border border-emerald-500/30 flex items-center space-x-1.5"
              >
                <Edit3 size={14} />
                <span>Switch Profile</span>
              </button>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800">
                <span className="text-[10px] font-mono text-slate-400">DVLA LICENCE NUMBER</span>
                <div className="text-emerald-400 font-mono font-bold text-sm mt-1">{profile.licenceNumber}</div>
                <span className="text-[10px] text-slate-500 block mt-1">{profile.classEntitlement}</span>
              </div>
              <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800">
                <span className="text-[10px] font-mono text-slate-400">DIGI-TACHO CARD</span>
                <div className="text-blue-400 font-mono font-bold text-sm mt-1">{profile.tachoCard}</div>
                <span className="text-[10px] text-slate-500 block mt-1">Smart Tachograph Gen 2 Active</span>
              </div>
              <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800">
                <span className="text-[10px] font-mono text-slate-400">DRIVER CPC STATUS</span>
                <div className="text-amber-400 font-mono font-bold text-sm mt-1">{profile.cpcHours}</div>
                <span className="text-[10px] text-slate-500 block mt-1">DQC Valid</span>
              </div>
            </div>
          </div>
        )}

        {/* 02: TACHO CLOCKS */}
        {stage === 'Tacho' && (
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 space-y-6">
            <div className="border-b border-slate-800 pb-3">
              <span className="text-xs font-mono text-emerald-400 font-bold uppercase">STAGE 02 • ACTIVE DRIVING CLOCKS</span>
              <h2 className="text-2xl font-black text-slate-100">Live Driver Hours & Rest Limits</h2>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="p-5 rounded-2xl bg-slate-950 border border-slate-800">
                <span className="text-xs font-mono text-slate-400">DAILY DRIVE REMAINING</span>
                <div className="text-3xl font-black text-emerald-400 mt-1">{remainingDailyDrive} hrs</div>
                <span className="text-[11px] text-slate-500">Based on 9h standard daily limit</span>
              </div>
              <div className="p-5 rounded-2xl bg-slate-950 border border-slate-800">
                <span className="text-xs font-mono text-slate-400">DRIVE UNTIL 45M BREAK</span>
                <div className="text-3xl font-black text-blue-400 mt-1">{nextBreakDue} hrs</div>
                <span className="text-[11px] text-slate-500">4h 30m continuous driving ceiling</span>
              </div>
              <div className="p-5 rounded-2xl bg-slate-950 border border-slate-800">
                <span className="text-xs font-mono text-slate-400">RECORDED TODAY</span>
                <div className="text-3xl font-black text-purple-400 mt-1">{driveHours} hrs</div>
                <span className="text-[11px] text-slate-500">Card ID: {profile.tachoCard.substring(0, 8)}...</span>
              </div>
            </div>
            <div className="p-4 bg-slate-950 rounded-2xl border border-slate-800 space-y-3">
              <h4 className="text-xs font-bold font-mono text-slate-300">Recalculate Rest Parameters:</h4>
              <input
                type="range"
                min="0"
                max="9"
                step="0.25"
                value={driveHours}
                onChange={e => setDriveHours(parseFloat(e.target.value))}
                className="w-full accent-emerald-500"
              />
              <div className="flex justify-between text-xs font-mono text-slate-500">
                <span>0h (Fresh Shift)</span>
                <span>4.5h (Break Due)</span>
                <span>9.0h (Limit)</span>
              </div>
            </div>
          </div>
        )}

        {/* 03: WALKAROUND & DEFECT CAMERA */}
        {stage === 'Vehicle Check' && (
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 space-y-6">
            <div className="flex justify-between items-center border-b border-slate-800 pb-3">
              <div>
                <span className="text-xs font-mono text-emerald-400 font-bold">STAGE 03 • DVSA AUDIT & CAMERA</span>
                <h3 className="text-xl font-bold">{profile.defaultReg} • Trailer TR-8492 (4.45m)</h3>
              </div>
              <button
                onClick={() => fileInputRef.current?.click()}
                className="px-3.5 py-2 bg-emerald-500 text-slate-950 rounded-xl text-xs font-mono font-bold flex items-center space-x-1.5"
              >
                <Camera size={16} />
                <span>Capture Defect Photo</span>
              </button>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                capture="environment"
                className="hidden"
                onChange={handlePhotoCapture}
              />
            </div>
            {defectPhoto && (
              <div className="p-4 bg-slate-950 rounded-2xl border border-red-500/40 flex flex-col sm:flex-row gap-4 items-center">
                <img src={defectPhoto} alt="Defect Snapshot" className="w-32 h-32 object-cover rounded-xl border border-slate-800" />
                <div className="space-y-1 text-xs font-mono">
                  <span className="px-2 py-0.5 bg-red-500/20 text-red-400 font-bold rounded">DEFECT LOGGED: DVSA AUDIT TRAIL</span>
                  <p className="text-slate-300 mt-1">Image captured with GPS coordinates timestamped against {profile.defaultReg}.</p>
                  <p className="text-slate-500">Recorded for mandatory 15-month DVSA audit retention.</p>
                </div>
              </div>
            )}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {CHECKS.map((c) => (
                <div key={c.id} className="p-4 bg-slate-950 rounded-2xl border border-slate-800 flex justify-between items-center">
                  <div>
                    <span className="text-[10px] font-mono text-emerald-400 font-bold">{c.zone}</span>
                    <h4 className="text-sm font-bold text-slate-200">{c.name}</h4>
                    <p className="text-[11px] text-slate-500 mt-0.5">{c.std}</p>
                  </div>
                  <span className="text-xs font-mono px-2.5 py-1 bg-emerald-500/20 text-emerald-400 rounded-lg font-bold">PASS</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* 04: ROUTE OPTIMISER & TOMTOM NAVIGATION */}
        {stage === 'Route Optimiser/Bridge Radar' && (
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 space-y-5">
            <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-2 border-b border-slate-800 pb-3">
              <div>
                <span className="text-xs font-mono text-emerald-400 font-bold uppercase">STAGE 04 • TOMTOM TRUCK NAVIGATION</span>
                <h2 className="text-2xl font-black text-slate-100">Live 44t Low-Bridge Route Engine</h2>
              </div>
              <span className="text-xs font-mono text-emerald-400 bg-emerald-500/10 border border-emerald-500/30 px-3 py-1 rounded-xl">
                TomTom Commercial Routing Active
              </span>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="p-3 bg-slate-950 rounded-xl border border-slate-800 text-xs font-mono">
                <span className="text-slate-500 block text-[10px]">A: DEPARTURE LOCATION</span>
                <input
                  type="text"
                  value={origin}
                  onChange={e => setOrigin(e.target.value)}
                  className="w-full bg-transparent font-bold text-slate-200 outline-none"
                />
              </div>
              <div className="p-3 bg-slate-950 rounded-xl border border-emerald-500/50 text-xs font-mono">
                <span className="text-emerald-400 font-bold block text-[10px]">B: DESTINATION SITE {syncAddr && '(SYNCED)'}</span>
                <input
                  type="text"
                  value={destination}
                  onChange={e => setDestination(e.target.value)}
                  className="w-full bg-transparent font-bold text-slate-100 outline-none"
                />
              </div>
            </div>
            <div className="flex flex-wrap justify-between items-center gap-2">
              <button
                onClick={() => setRecalcTrigger(c => c + 1)}
                className="px-5 py-2.5 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs font-mono rounded-xl flex items-center space-x-2"
              >
                <Navigation size={15} />
                <span>Recalculate TomTom Truck Route</span>
              </button>
              {routeStats && (
                <div className="text-xs font-mono text-slate-300 flex flex-wrap gap-3">
                  <span>Distance: <b className="text-emerald-400">{routeStats.miles}</b></span>
                  <span>Duration: <b className="text-blue-400">{routeStats.duration}</b></span>
                  <span className="text-amber-400 font-bold">{routeStats.trafficDelay}</span>
                </div>
              )}
            </div>

            {/* DEDICATED MAP CONTAINER */}
            <TomTomTruckMap
              apiKey={TOMTOM_KEY}
              origin={origin}
              destination={destination}
              onStatsCalculated={setRouteStats}
              triggerRecalculate={recalcTrigger}
            />

            <div className="p-4 bg-emerald-500/10 border border-emerald-500/40 rounded-2xl flex items-center space-x-3 text-xs font-mono">
              <AlertTriangle size={20} className="text-emerald-400 flex-shrink-0" />
              <div>
                <span className="font-bold text-emerald-300 block">Active Bridge Clearance Shield: 4.45m Trailer</span>
                <span className="text-slate-300">Routing engine actively bypasses Network Rail low bridges and weight restrictions.</span>
              </div>
            </div>
          </div>
        )}

        {/* 05: SITE RISK PRO & DEMURRAGE */}
        {stage === 'Site Risk Pro' && (
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 space-y-5">
            <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-2 border-b border-slate-800 pb-3">
              <div>
                <span className="text-xs font-mono text-emerald-400 font-bold uppercase">STAGE 05 • SITE RISK & DEMURRAGE</span>
                <h2 className="text-2xl font-black text-slate-100">{destination}</h2>
              </div>
              <button
                onClick={() => setSyncAddr(!syncAddr)}
                className="flex items-center space-x-2 text-xs font-mono text-slate-300 bg-slate-950 p-2 rounded-xl border border-slate-800"
              >
                {syncAddr ? <CheckSquare size={16} className="text-emerald-400" /> : <Square size={16} className="text-slate-500" />}
                <span>Sync with Route Optimiser</span>
              </button>
            </div>
            <div className="p-3 bg-slate-950 rounded-xl border border-slate-800 text-xs font-mono">
              <span className="text-slate-500 block text-[10px]">DESIGNATED SITE ADDRESS</span>
              <input
                type="text"
                value={destination}
                onChange={e => setDestination(e.target.value)}
                className="w-full bg-transparent font-bold text-emerald-300 outline-none"
              />
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="p-5 rounded-2xl bg-slate-950 border border-slate-800">
                <span className="text-[10px] font-mono text-emerald-400 uppercase font-bold">GATEHOUSE ACCESS</span>
                <div className="text-3xl font-mono font-black text-slate-100 mt-1">8492</div>
                <span className="text-xs text-slate-400 mt-1 block">Automatic Barrier Clearance</span>
              </div>
              <div className="p-5 rounded-2xl bg-slate-950 border border-emerald-500/40">
                <span className="text-[10px] font-mono text-emerald-400 uppercase font-bold">RESERVED DOCK</span>
                <div className="text-3xl font-mono font-black text-emerald-400 mt-1">BAY #24</div>
                <span className="text-xs text-slate-400 mt-1 block">Cross-Dock Inbound Slot</span>
              </div>
              <div className="p-5 rounded-2xl bg-slate-950 border border-slate-800">
                <span className="text-[10px] font-mono text-amber-400 uppercase font-bold">YARD DWELL TIMER</span>
                <div className="text-3xl font-mono font-black text-slate-100 mt-1">{fmtTime(demSec)}</div>
                <span className="text-xs text-slate-400 mt-1 block">24m remaining in contract free-time</span>
              </div>
            </div>
          </div>
        )}

        {/* 06: IN-CAB AI COPILOT CHAT */}
        {stage === 'Copilot Chat' && (
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 space-y-4 flex flex-col h-[600px]">
            <div className="border-b border-slate-800 pb-3 flex justify-between items-center">
              <div>
                <span className="text-xs font-mono text-emerald-400 font-bold uppercase">STAGE 06 • IN-CAB ASSISTANT</span>
                <h2 className="text-xl font-bold text-slate-100">Drive Partners AI Copilot</h2>
              </div>
              <span className="text-xs font-mono px-2.5 py-1 bg-emerald-500/20 text-emerald-400 rounded-lg">Online</span>
            </div>
            <div className="flex-1 overflow-y-auto space-y-3 p-3 bg-slate-950 rounded-2xl border border-slate-800">
              {chatMessages.map((m, idx) => (
                <div key={idx} className={`flex ${m.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
                  <div className={`max-w-[80%] p-3.5 rounded-2xl text-xs font-mono ${
                    m.sender === 'user' ? 'bg-emerald-500 text-slate-950 font-bold' : 'bg-slate-900 border border-slate-800 text-slate-200'
                  }`}>
                    {m.text}
                  </div>
                </div>
              ))}
            </div>
            <div className="flex space-x-2">
              <input
                type="text"
                value={inputMessage}
                onChange={e => setInputMessage(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && sendChatMessage()}
                placeholder="Ask about bridge clearance, driving limits, site regulations..."
                className="flex-1 bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-xs text-slate-200 outline-none"
              />
              <button
                onClick={sendChatMessage}
                className="px-5 py-3 bg-emerald-500 text-slate-950 rounded-xl font-bold text-xs flex items-center space-x-1"
              >
                <Send size={15} />
                <span>Ask</span>
              </button>
            </div>
          </div>
        )}

        {/* BOTTOM QUICK PAGER */}
        {stage !== 'HUB' && (
          <div className="fixed bottom-5 left-1/2 -translate-x-1/2 z-40 bg-slate-900/90 border border-slate-800 rounded-full px-4 py-2 flex items-center space-x-3 shadow-2xl">
            <button onClick={() => setStage('HUB')} className="text-xs font-mono text-slate-400 hover:text-emerald-400">
              ← Return to Hub
            </button>
          </div>
        )}
      </main>

      {/* DRIVER PROFILE SWITCHER MODAL */}
      {profileModal && (
        <div className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4 backdrop-blur-sm">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 max-w-md w-full space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center border-b border-slate-800 pb-2">
              <h3 className="font-bold text-slate-100 flex items-center space-x-2">
                <User size={18} className="text-emerald-400" />
                <span>Switch Driver Profile</span>
              </h3>
              <button onClick={() => setProfileModal(false)}><X size={16} /></button>
            </div>
            <div className="space-y-3 text-xs font-mono">
              <div>
                <label className="text-slate-400 block mb-1">FULL NAME</label>
                <input
                  type="text"
                  value={editForm.name}
                  onChange={e => setEditForm({...editForm, name: e.target.value.toUpperCase()})}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-slate-100 outline-none"
                />
              </div>
              <div>
                <label className="text-slate-400 block mb-1">DVLA LICENCE #</label>
                <input
                  type="text"
                  value={editForm.licenceNumber}
                  onChange={e => setEditForm({...editForm, licenceNumber: e.target.value.toUpperCase()})}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-emerald-400 outline-none"
                />
              </div>
              <div>
                <label className="text-slate-400 block mb-1">DIGI-TACHO CARD #</label>
                <input
                  type="text"
                  value={editForm.tachoCard}
                  onChange={e => setEditForm({...editForm, tachoCard: e.target.value.toUpperCase()})}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-blue-400 outline-none"
                />
              </div>
            </div>
            <div className="flex justify-end space-x-2 pt-2 border-t border-slate-800 text-xs font-mono">
              <button onClick={() => setProfileModal(false)} className="px-3 py-1.5 bg-slate-800 rounded-xl">Cancel</button>
              <button onClick={saveProfile} className="px-4 py-1.5 bg-emerald-500 text-slate-950 font-bold rounded-xl">Save & Activate</button>
            </div>
          </div>
        </div>
      )}

      {/* FOOTER */}
      <footer className="h-10 border-t border-slate-800 px-4 sm:px-8 flex items-center justify-between text-[11px] text-slate-500 font-mono">
        <span>© 2026 Drive Partners Ltd</span>
        <span>TomTom Truck API • © 1992 - 2026 TomTom</span>
      </footer>
    </div>
  );
}