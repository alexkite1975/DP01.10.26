'use client';
import React, { useState } from 'react';
import { Camera, Upload, CreditCard, Clock, MapPin, Navigation, Plus, Check, ShieldCheck, ArrowRight, ExternalLink } from 'lucide-react';

export default function DriverDashboard({ userProfile }: { userProfile?: any }) {
  const [tab, setTab] = useState<'route' | 'tacho' | 'compliance'>('route');
  const [routeState, setRouteState] = useState<'search' | 'pin_confirm' | 'add_stop' | 'summary' | 'site_review'>('search');
  const [stops, setStops] = useState<{ name: string; postcode: string; hazards: string }[]>([]);
  const [tachoDone, setTachoDone] = useState(false);

  return (
    <div className="space-y-6">
      {/* 3 Pillars */}
      <div className="grid grid-cols-3 gap-2 bg-slate-900/90 p-1.5 border border-slate-800 rounded-2xl">
        <button
          onClick={() => setTab('route')}
          className={`py-3 rounded-xl text-xs font-bold font-mono transition-all flex items-center justify-center gap-2 ${
            tab === 'route' ? 'bg-emerald-500 text-slate-950 shadow-lg shadow-emerald-500/20' : 'text-slate-400 hover:text-white'
          }`}
        >
          <Navigation className="w-4 h-4" /> Destination & Map
        </button>
        <button
          onClick={() => setTab('tacho')}
          className={`py-3 rounded-xl text-xs font-bold font-mono transition-all flex items-center justify-center gap-2 ${
            tab === 'tacho' ? 'bg-emerald-500 text-slate-950 shadow-lg shadow-emerald-500/20' : 'text-slate-400 hover:text-white'
          }`}
        >
          <Camera className="w-4 h-4" /> Tacho-Scan (Slide 7)
        </button>
        <button
          onClick={() => setTab('compliance')}
          className={`py-3 rounded-xl text-xs font-bold font-mono transition-all flex items-center justify-center gap-2 ${
            tab === 'compliance' ? 'bg-emerald-500 text-slate-950 shadow-lg shadow-emerald-500/20' : 'text-slate-400 hover:text-white'
          }`}
        >
          <Clock className="w-4 h-4" /> Compliance Hub
        </button>
      </div>

      {/* PILLAR 1: DESTINATION SEARCH & MAP */}
      {tab === 'route' && (
        <div className="bg-slate-900/80 border border-slate-800 rounded-3xl p-6 space-y-6 shadow-xl">
          {routeState === 'search' && (
            <div className="space-y-4">
              <h3 className="text-lg font-bold text-white flex items-center gap-2">
                <MapPin className="w-5 h-5 text-emerald-400" /> Search Delivery Destination
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {[
                  { name: 'DIRFT Daventry Hub', postcode: 'NN6 7GZ', hazards: '4.9m low canopy at Gate 3' },
                  { name: 'Magna Park Lutterworth', postcode: 'LE17 4XN', hazards: 'One-way anti-clockwise system' },
                  { name: 'Amazon LCY2 Tilbury', postcode: 'RM18 7AN', hazards: 'Strict ANPR slot booking' }
                ].map((hub, i) => (
                  <div
                    key={i}
                    onClick={() => {
                      setStops([...stops, hub]);
                      setRouteState('pin_confirm');
                    }}
                    className="p-4 bg-slate-950 border border-slate-800 hover:border-emerald-500/60 rounded-2xl cursor-pointer group"
                  >
                    <div className="text-xs font-bold text-white group-hover:text-emerald-400">{hub.name}</div>
                    <div className="text-[11px] text-slate-400 font-mono mt-1">{hub.postcode}</div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {routeState === 'pin_confirm' && (
            <div className="space-y-4">
              <h3 className="text-base font-bold text-white">Interactive Map: Confirm Destination Pin</h3>
              <div className="relative aspect-[16/8] bg-slate-950 rounded-2xl border border-slate-800 flex items-center justify-center">
                <div className="text-center animate-bounce">
                  <div className="px-3 py-1 bg-emerald-500 text-slate-950 rounded-lg text-xs font-bold">
                    {stops[stops.length - 1]?.postcode} Gate 1
                  </div>
                  <MapPin className="w-8 h-8 text-emerald-400 fill-emerald-400 mx-auto" />
                </div>
              </div>
              <div className="flex justify-between">
                <button onClick={() => setRouteState('search')} className="text-xs text-slate-400">Tap New Pin</button>
                <button
                  onClick={() => setRouteState('add_stop')}
                  className="px-6 py-2.5 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs uppercase rounded-xl flex items-center gap-2"
                >
                  <Check className="w-4 h-4" /> Confirm Pin
                </button>
              </div>
            </div>
          )}

          {routeState === 'add_stop' && (
            <div className="p-8 bg-slate-950 border border-slate-800 rounded-2xl text-center space-y-4 max-w-md mx-auto">
              <h3 className="text-lg font-bold text-white">Add Another Stop?</h3>
              <p className="text-xs text-slate-400">Would you like to chain an additional multi-drop stop?</p>
              <div className="grid grid-cols-2 gap-3 pt-2">
                <button onClick={() => setRouteState('search')} className="py-2.5 bg-slate-800 text-white rounded-xl text-xs font-bold flex items-center justify-center gap-1">
                  <Plus className="w-4 h-4" /> Yes (Add Stop)
                </button>
                <button onClick={() => setRouteState('summary')} className="py-2.5 bg-emerald-500 text-slate-950 rounded-xl text-xs font-black uppercase">
                  No (Summary)
                </button>
              </div>
            </div>
          )}

          {routeState === 'summary' && (
            <div className="space-y-4">
              <h3 className="text-lg font-bold text-white">Route Summary</h3>
              <div className="grid grid-cols-3 gap-3 text-xs font-mono">
                <div className="p-3 bg-slate-950 rounded-xl border border-slate-800">
                  <span className="text-slate-500 block text-[10px]">DISTANCE</span>
                  <span className="font-bold text-white">48.2 miles</span>
                </div>
                <div className="p-3 bg-slate-950 rounded-xl border border-slate-800">
                  <span className="text-slate-500 block text-[10px]">CLEARANCE</span>
                  <span className="font-bold text-emerald-400">4.9m SAFE</span>
                </div>
                <div className="p-3 bg-slate-950 rounded-xl border border-slate-800">
                  <span className="text-slate-500 block text-[10px]">EST. TIME</span>
                  <span className="font-bold text-white">1h 12m</span>
                </div>
              </div>
              <button
                onClick={() => setRouteState('site_review')}
                className="w-full py-3 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black text-xs uppercase rounded-xl"
              >
                Proceed to Site Assessment Review <ArrowRight className="w-4 h-4 inline ml-1" />
              </button>
            </div>
          )}

          {routeState === 'site_review' && (
            <div className="space-y-4">
              <h3 className="text-lg font-bold text-white">Site Assessment Review (Gate Hazards)</h3>
              <div className="p-4 bg-amber-500/10 border border-amber-500/30 rounded-2xl text-xs text-amber-300 space-y-1">
                <div>⚠️ {stops[0]?.hazards || 'Strict 10mph limit, Hi-Viz Class 3 mandatory'}</div>
                <div>Demurrage Charge: £55/hr after 90 mins free dwell</div>
              </div>
              <div className="grid grid-cols-2 gap-3 pt-2">
                <button
                  onClick={() => alert('Launching In-App Commercial HGV Nav with Low-Bridge Radar!')}
                  className="py-3 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black text-xs uppercase rounded-xl"
                >
                  Launch In-App HGV Nav
                </button>
                <button
                  onClick={() => window.open(`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(stops[0]?.postcode || 'DIRFT')}`, '_blank')}
                  className="py-3 bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs uppercase rounded-xl flex items-center justify-center gap-1"
                >
                  Open in {userProfile?.nav || 'Google Maps'} <ExternalLink className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      {/* PILLAR 2: TACHO-SCAN STUDIO (Slide 7) */}
      {tab === 'tacho' && (
        <div className="bg-slate-900/80 border border-slate-800 rounded-3xl p-6 space-y-6 shadow-xl">
          <div className="text-center space-y-1">
            <h3 className="text-2xl font-black text-white">Drive Partners • Tacho-Scan</h3>
            <p className="text-xs text-slate-400 font-mono">Free Printout Scanner with Full Analytics for the Driver</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-4 gap-3 text-center">
            {[
              { icon: Camera, title: 'Scan Printout', desc: 'Start a new scan with device camera.' },
              { icon: Upload, title: 'Upload Printout', desc: 'Import digital files or saved images.' },
              { icon: CreditCard, title: 'Card Reader', desc: 'Connect physical USB/OTG reader.' },
              { icon: Clock, title: 'See Dashboard', desc: 'Tachograph compliance analytics chart.' }
            ].map((card, i) => (
              <div
                key={i}
                onClick={() => setTachoDone(true)}
                className="p-5 bg-slate-950 border border-slate-800 hover:border-emerald-500/60 rounded-2xl cursor-pointer group space-y-2 transition-all"
              >
                <card.icon className="w-6 h-6 text-emerald-400 mx-auto group-hover:scale-110 transition-transform" />
                <div className="font-bold text-sm text-white">{card.title}</div>
                <p className="text-[11px] text-slate-400">{card.desc}</p>
              </div>
            ))}
          </div>
          {tachoDone && (
            <div className="p-4 bg-slate-950 border border-emerald-500 rounded-2xl text-xs font-mono space-y-2">
              <div className="text-emerald-400 font-bold flex items-center gap-2">
                <ShieldCheck className="w-4 h-4" /> Extracted Daily Printout OCR & Synced with Fleet
              </div>
              <div className="grid grid-cols-4 gap-2 text-slate-300">
                <div>Drive: <strong className="text-white">4h 15m</strong></div>
                <div>Break: <strong className="text-white">45m</strong></div>
                <div>WTD Duty: <strong className="text-white">8h 30m</strong></div>
                <div>Infringements: <strong className="text-emerald-400">0</strong></div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* PILLAR 3: COMPLIANCE CLOCKS */}
      {tab === 'compliance' && (
        <div className="bg-slate-900/80 border border-slate-800 rounded-3xl p-6 space-y-4 shadow-xl">
          <h3 className="text-lg font-bold text-white flex items-center gap-2">
            <ShieldCheck className="w-5 h-5 text-emerald-400" /> EU Drivers' Hours & WTD Hub
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3 font-mono text-xs">
            <div className="p-4 bg-slate-950 rounded-2xl border border-slate-800 space-y-2">
              <span className="text-slate-500 block text-[10px]">CONTINUOUS DRIVE LIMIT</span>
              <div className="text-2xl font-bold text-white">4h 15m <span className="text-xs text-slate-500">/ 4h 30m</span></div>
              <p className="text-amber-400 text-[11px]">⚠️ Break required in 15 mins</p>
            </div>
            <div className="p-4 bg-slate-950 rounded-2xl border border-slate-800 space-y-2">
              <span className="text-slate-500 block text-[10px]">DAILY DRIVE CLOCK</span>
              <div className="text-2xl font-bold text-white">4h 15m <span className="text-xs text-slate-500">/ 9h 00m</span></div>
              <p className="text-emerald-400 text-[11px]">4h 45m drive remaining today</p>
            </div>
            <div className="p-4 bg-slate-950 rounded-2xl border border-slate-800 space-y-2">
              <span className="text-slate-500 block text-[10px]">WEEKLY TOTAL</span>
              <div className="text-2xl font-bold text-white">32h 10m <span className="text-xs text-slate-500">/ 56h 00m</span></div>
              <p className="text-slate-400 text-[11px]">Compliant with EU Reg 561/2006</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
