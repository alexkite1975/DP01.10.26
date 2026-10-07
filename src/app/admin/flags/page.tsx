'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { ArrowLeft, Sliders, CheckCircle2, ShieldCheck, Zap, Radio, Cloud } from 'lucide-react';

interface FeatureFlag {
  id: string;
  name: string;
  category: string;
  description: string;
  enabled: boolean;
}

const INITIAL_FLAGS: FeatureFlag[] = [
  {
    id: 'ai_risk_ocr',
    name: 'Gemini 3 Risk Assessment OCR',
    category: 'AI Services',
    description: 'Enables automatic digitization of printed paper RAMS documents and PDF safety sheets.',
    enabled: true
  },
  {
    id: 'cad_satellite_vision',
    name: 'Satellite Yard CAD Boundary AI',
    category: 'AI Services',
    description: 'Enables aerial computer vision detection of low tree canopies and blind reversing zones.',
    enabled: true
  },
  {
    id: 'acoustic_leak_fft',
    name: 'Acoustic Air Leak FFT Analyzer',
    category: 'Vehicle Inspection',
    description: 'Microphone-based 3.2-8.5 kHz ultrasonic air line and valve hiss detection.',
    enabled: true
  },
  {
    id: 'dvsa_ers_sync',
    name: 'DVSA Earned Recognition Validator',
    category: 'Compliance',
    description: 'Real-time B1-B4 maintenance and D1-D4 driver hours KPI audit verification.',
    enabled: true
  },
  {
    id: 'tomtom_44t_routing',
    name: 'TomTom 44t Truck Routing Engine',
    category: 'Navigation',
    description: 'Commercial routing incorporating ADR hazardous goods and low bridge avoidance.',
    enabled: true
  },
  {
    id: 'whistleblower_sla',
    name: 'Whistleblower 48h Auto-Escalation',
    category: 'Safety Moderation',
    description: 'Automatically dispatches Amber notices to site operators for unrectified yard hazards.',
    enabled: true
  }
];

export default function AdminFlagsCmsPage() {
  const [flags, setFlags] = useState<FeatureFlag[]>(INITIAL_FLAGS);

  const toggleFlag = (id: string) => {
    setFlags(prev =>
      prev.map(f => (f.id === id ? { ...f, enabled: !f.enabled } : f))
    );
  };

  return (
    <div className="min-h-dvh bg-slate-950 text-white flex flex-col font-sans">
      {/* Mobile Top App Bar */}
      <header className="sticky top-0 z-40 bg-slate-900/95 backdrop-blur border-b border-slate-800 px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Link
            href="/admin"
            className="p-2 -ml-1 rounded-xl bg-slate-800 hover:bg-slate-700 active:scale-95 text-slate-300 hover:text-white transition flex items-center gap-1 text-xs font-semibold"
            aria-label="Return to Admin Hub"
          >
            <ArrowLeft className="w-4 h-4" />
            <span className="hidden sm:inline">Admin</span>
          </Link>
          <div>
            <h1 className="text-sm font-bold text-white flex items-center gap-1.5">
              <Sliders className="w-4 h-4 text-purple-400" /> Feature Flags CMS
            </h1>
            <p className="text-[10px] text-slate-400 font-mono">Module Configuration &amp; Cloud Run Topology</p>
          </div>
        </div>

        <span className="text-[11px] font-semibold px-2 py-1 rounded bg-purple-950/80 text-purple-300 border border-purple-800/60 font-mono">
          Live Proxy
        </span>
      </header>

      {/* Main Single-Purpose Body: Flags & Cloud Topology */}
      <main className="flex-1 w-full max-w-2xl mx-auto p-4 space-y-4 overflow-y-auto">
        {/* Backend Infrastructure Card */}
        <section className="bg-slate-900 border border-slate-800 rounded-2xl p-4 space-y-3">
          <div className="flex items-center justify-between">
            <h2 className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
              <Cloud className="w-4 h-4 text-sky-400" /> Cloud Run Cluster Topology
            </h2>
            <span className="flex items-center gap-1 text-[11px] font-mono text-emerald-400">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" /> Active (200 OK)
            </span>
          </div>
          <div className="space-y-1.5 text-xs font-mono">
            <div className="flex justify-between py-1 border-b border-slate-800/60">
              <span className="text-slate-400">UI Origin:</span>
              <span className="text-slate-200">smarthaul-ui (europe-west1)</span>
            </div>
            <div className="flex justify-between py-1 border-b border-slate-800/60">
              <span className="text-slate-400">API Cluster:</span>
              <span className="text-slate-200">fleetops-api (europe-west2)</span>
            </div>
            <div className="flex justify-between py-1 border-b border-slate-800/60">
              <span className="text-slate-400">Firestore Project:</span>
              <span className="text-slate-200">drive-partners2 (default)</span>
            </div>
            <div className="flex justify-between py-1">
              <span className="text-slate-400">Model Cascade:</span>
              <span className="text-slate-200">gemini-3.8-flash ➔ lite</span>
            </div>
          </div>
        </section>

        {/* Feature Flags List */}
        <section className="space-y-3">
          <h2 className="text-xs font-bold uppercase tracking-wider text-slate-400 px-1">
            Operational Feature Flags
          </h2>

          <div className="space-y-2">
            {flags.map(f => (
              <div
                key={f.id}
                className="bg-slate-900/90 border border-slate-800 hover:border-slate-700 rounded-xl p-3.5 flex items-start justify-between gap-3 transition"
              >
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-white">{f.name}</span>
                    <span className="text-[9px] uppercase px-1.5 py-0.5 rounded bg-slate-800 text-slate-400 font-mono">
                      {f.category}
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-400 leading-relaxed">{f.description}</p>
                </div>

                <button
                  onClick={() => toggleFlag(f.id)}
                  className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                    f.enabled ? 'bg-purple-600' : 'bg-slate-700'
                  }`}
                  aria-label={`Toggle ${f.name}`}
                >
                  <span
                    className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
                      f.enabled ? 'translate-x-5' : 'translate-x-0'
                    }`}
                  />
                </button>
              </div>
            ))}
          </div>
        </section>
      </main>
    </div>
  );
}
