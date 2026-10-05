'use client';
import React, { useState } from 'react';
import { 
  Building2, MapPin, AlertTriangle, ShieldCheck, Ruler, 
  Phone, Users, CheckCircle2, Star, Send, LogOut, Search, Clock
} from 'lucide-react';

interface Props {
  siteAdmin?: any;
  onLogout: () => void;
}

export default function SiteRiskAssessment({ siteAdmin, onLogout }: Props) {
  const [depotName, setDepotName] = useState(siteAdmin?.depotName || 'DIRFT Daventry Hub - Rail Freight Terminal');
  const [address, setAddress] = useState('Crick, Rugby, Northamptonshire NN6 7GZ (Google Places ID: ChIJ4092...)');
  const [securityPhone, setSecurityPhone] = useState('+44 1788 820001');
  const [maxHeight, setMaxHeight] = useState('4.9m (Gate 3 Overhead Sensor Bar)');
  const [speedLimit, setSpeedLimit] = useState('10 mph (Strict Radar Enforcement)');
  const [reversingRules, setReversingRules] = useState('Tractor unit disconnect before unloading. Wheel chocks & gladhand lock mandatory.');
  const [activeTab, setActiveTab] = useState<'assessment' | 'hazards' | 'reviews'>('assessment');
  const [published, setPublished] = useState(false);

  return (
    <main className="min-h-[100dvh] w-full bg-[#070B13] text-slate-100 p-3 sm:p-6 space-y-4 max-w-5xl mx-auto font-sans">
      {/* HEADER */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center border-b border-slate-800 pb-3 gap-3">
        <div>
          <div className="text-[11px] font-mono font-bold text-amber-400 uppercase tracking-widest flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse" />
            DEPOT SITE ADMIN • GOOGLE PLACES LOCATION
          </div>
          <h1 className="text-xl font-black text-white mt-0.5">Site Risk Assessment & Hazard Studio</h1>
        </div>

        <button
          onClick={onLogout}
          className="px-3 py-1.5 bg-rose-500/10 border border-rose-500/30 text-rose-400 rounded-xl text-xs font-mono flex items-center gap-1.5 hover:bg-rose-500/20"
        >
          <LogOut className="w-3.5 h-3.5" /> Log Out
        </button>
      </div>

      {/* DEPOT IDENTITY HUD */}
      <div className="p-4 bg-slate-900/80 border border-slate-800 rounded-2xl flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 font-mono text-xs">
        <div className="space-y-1">
          <div className="flex items-center gap-2 text-white font-bold text-sm">
            <MapPin className="w-4 h-4 text-emerald-400" />
            {depotName}
          </div>
          <div className="text-slate-400 text-[11px]">{address}</div>
          <div className="text-emerald-400 text-[10px]">Gate Security 24/7 Phone: {securityPhone}</div>
        </div>
        <span className="px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-[11px] font-bold">
          ✓ Verified Google Places Business
        </span>
      </div>

      {/* TABS */}
      <div className="grid grid-cols-3 gap-1.5 bg-slate-900 p-1 border border-slate-800 rounded-2xl text-xs font-mono font-bold">
        <button
          onClick={() => setActiveTab('assessment')}
          className={`py-2.5 rounded-xl transition-all ${
            activeTab === 'assessment' ? 'bg-amber-500 text-slate-950 font-black shadow-lg' : 'text-slate-400'
          }`}
        >
          <ShieldCheck className="w-3.5 h-3.5 inline mr-1" /> Risk Assessment
        </button>
        <button
          onClick={() => setActiveTab('hazards')}
          className={`py-2.5 rounded-xl transition-all ${
            activeTab === 'hazards' ? 'bg-amber-500 text-slate-950 font-black shadow-lg' : 'text-slate-400'
          }`}
        >
          <AlertTriangle className="w-3.5 h-3.5 inline mr-1" /> Yard Hazard Registry
        </button>
        <button
          onClick={() => setActiveTab('reviews')}
          className={`py-2.5 rounded-xl transition-all ${
            activeTab === 'reviews' ? 'bg-amber-500 text-slate-950 font-black shadow-lg' : 'text-slate-400'
          }`}
        >
          <Star className="w-3.5 h-3.5 inline mr-1" /> Driver Feedback (1-10)
        </button>
      </div>

      {/* TAB 1: RISK ASSESSMENT FORM */}
      {activeTab === 'assessment' && (
        <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-5 space-y-4 font-mono text-xs">
          <div>
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-amber-400" /> HSE HSG136 Statutory Workplace Transport Assessment
            </h3>
            <p className="text-slate-400 text-[11px] mt-0.5">
              Rules published here automatically sync with visiting drivers' in-cab GPS navigation.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-slate-400 text-[10px] flex items-center gap-1">
                <Ruler className="w-3.5 h-3.5 text-amber-400" /> MAXIMUM SITE VEHICLE HEIGHT
              </label>
              <input
                type="text"
                value={maxHeight}
                onChange={e => setMaxHeight(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-white"
              />
            </div>

            <div className="space-y-1">
              <label className="text-slate-400 text-[10px] flex items-center gap-1">
                <Clock className="w-3.5 h-3.5 text-blue-400" /> YARD SPEED RESTRICTION
              </label>
              <input
                type="text"
                value={speedLimit}
                onChange={e => setSpeedLimit(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-white"
              />
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-slate-400 text-[10px]">BAY REVERSING & SAFETY PROTOCOLS</label>
            <textarea
              value={reversingRules}
              onChange={e => setReversingRules(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-white"
              rows={2}
            />
          </div>

          <div className="space-y-2">
            <label className="text-slate-400 text-[10px]">MANDATORY DRIVER PPE ON SITE</label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-[11px]">
              <div className="p-2.5 bg-slate-950 border border-emerald-500/50 rounded-xl text-emerald-400 flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5" /> Hi-Vis Class 3
              </div>
              <div className="p-2.5 bg-slate-950 border border-emerald-500/50 rounded-xl text-emerald-400 flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5" /> Safety Boots
              </div>
              <div className="p-2.5 bg-slate-950 border border-emerald-500/50 rounded-xl text-emerald-400 flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5" /> Hard Hat (Bays)
              </div>
              <div className="p-2.5 bg-slate-950 border border-emerald-500/50 rounded-xl text-emerald-400 flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5" /> Eye Protection
              </div>
            </div>
          </div>

          <button
            onClick={() => setPublished(true)}
            className="w-full py-3.5 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black text-xs uppercase rounded-xl flex items-center justify-center gap-2 shadow-lg shadow-emerald-500/20"
          >
            <Send className="w-4 h-4" /> Publish & Broadcast to In-Cab Driver GPS
          </button>

          {published && (
            <div className="p-3 bg-emerald-500/10 border border-emerald-500/40 text-emerald-400 rounded-xl text-center">
              ✓ Site Risk Assessment Live! All approaching drivers now receive safety alerts for {depotName}.
            </div>
          )}
        </div>
      )}

      {/* TAB 2: YARD HAZARD REGISTRY */}
      {activeTab === 'hazards' && (
        <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-5 space-y-3 font-mono text-xs">
          <h3 className="text-sm font-bold text-white flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 text-amber-400" /> Active Depot Roadway Hazards
          </h3>
          <div className="space-y-2">
            <div className="p-3 bg-slate-950 border border-amber-500/40 rounded-xl flex justify-between items-center">
              <div>
                <strong className="text-amber-300">Hazard 1: Gate 3 Canopy Height (4.9m)</strong>
                <div className="text-[10px] text-slate-400">High-cube double deck trailers must use Gate 1 only.</div>
              </div>
              <span className="text-[10px] text-emerald-400 font-bold">Active in Driver GPS</span>
            </div>

            <div className="p-3 bg-slate-950 border border-amber-500/40 rounded-xl flex justify-between items-center">
              <div>
                <strong className="text-amber-300">Hazard 2: Blind-Side Reversing Bays 14–22</strong>
                <div className="text-[10px] text-slate-400">Banksman assistance required when pedestrians are in cross-walk.</div>
              </div>
              <span className="text-[10px] text-emerald-400 font-bold">Active in Driver GPS</span>
            </div>

            <div className="p-3 bg-slate-950 border border-slate-800 rounded-xl flex justify-between items-center">
              <div>
                <strong className="text-white">Facility: Driver Rest Area & 24/7 Showers</strong>
                <div className="text-[10px] text-slate-400">Located adjacent to Security Gatehouse B. Hot drinks available.</div>
              </div>
              <span className="text-[10px] text-blue-400 font-bold">Driver Amenity</span>
            </div>
          </div>
        </div>
      )}

      {/* TAB 3: DRIVER REVIEWS INBOX */}
      {activeTab === 'reviews' && (
        <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-5 space-y-3 font-mono text-xs">
          <div className="flex justify-between items-center">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <Star className="w-4 h-4 text-amber-400 fill-amber-400" /> Driver Reviews for this Location
            </h3>
            <span className="text-emerald-400 font-bold">Overall Rating: 9.2 / 10</span>
          </div>

          <div className="p-3.5 bg-slate-950 border border-slate-800 rounded-xl space-y-1.5">
            <div className="flex justify-between items-center">
              <span className="text-white font-bold">Alexander James Kite (Class 1)</span>
              <span className="text-amber-400 font-bold">★ 9 / 10</span>
            </div>
            <p className="text-slate-300 text-[11px]">
              "Quick security at Gate 1, clear signage for bay 18, clean toilets and overnight parking available."
            </p>
            <div className="text-[9px] text-emerald-400">✓ Vertex AI Moderated • Constructive</div>
          </div>
        </div>
      )}
    </main>
  );
}
