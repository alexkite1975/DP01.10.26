'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import dynamic from 'next/dynamic';
import {
  ArrowLeft,
  CheckCircle2,
  ShieldCheck,
  FileText,
  Sliders,
  Layers,
  Sparkles
} from 'lucide-react';
import { InteractiveTruckBlueprint } from '@/components/vehicleCheck/InteractiveTruckBlueprint';

const VehicleCheckApp = dynamic(() => import('@/components/vehicleCheck/VehicleCheckApp'), {
  ssr: false,
  loading: () => (
    <div className="p-8 text-center text-slate-400 font-mono text-sm">
      Loading Driver Walkaround...
    </div>
  )
});

export default function DriverWalkaroundPage() {
  const [viewMode, setViewMode] = useState<'CHECKLIST' | 'BLUEPRINT'>('CHECKLIST');
  const [passedBlueprintZones, setPassedBlueprintZones] = useState<string[]>([
    'zone-cab-front',
    'zone-suzi-coils',
    'zone-fifth-wheel'
  ]);

  const handleToggleZone = (zoneId: string) => {
    setPassedBlueprintZones((prev) =>
      prev.includes(zoneId) ? prev.filter((id) => id !== zoneId) : [...prev, zoneId]
    );
  };

  return (
    <div className="min-h-dvh bg-slate-950 text-white flex flex-col font-sans">
      {/* Mobile Top App Bar */}
      <header className="sticky top-0 z-40 bg-slate-900/90 backdrop-blur-xl border-b border-slate-800 px-4 py-3 flex items-center justify-between shadow-cockpit">
        <div className="flex items-center gap-3">
          <Link
            href="/driver"
            className="p-2 -ml-1 rounded-xl bg-slate-800/80 hover:bg-slate-700 active:scale-95 text-slate-300 hover:text-white transition flex items-center gap-1 text-xs font-semibold touch-press"
            aria-label="Return to In-Cab Hub"
          >
            <ArrowLeft className="w-4 h-4" />
            <span className="hidden sm:inline">Hub</span>
          </Link>
          <div>
            <h1 className="text-sm font-bold text-white flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" /> Driver Walkaround
            </h1>
            <p className="text-[10px] text-slate-400 font-mono">DVSA Statutory 32-Point Check</p>
          </div>
        </div>

        {/* View Mode Toggle & Sign-off Link */}
        <div className="flex items-center gap-2">
          <div className="bg-slate-950/80 p-0.5 rounded-xl border border-slate-800 flex items-center">
            <button
              onClick={() => setViewMode('CHECKLIST')}
              className={`px-2.5 py-1 rounded-lg text-xs font-mono font-bold transition ${
                viewMode === 'CHECKLIST'
                  ? 'bg-blue-600 text-white shadow-sm'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              List
            </button>
            <button
              onClick={() => setViewMode('BLUEPRINT')}
              className={`px-2.5 py-1 rounded-lg text-xs font-mono font-bold flex items-center gap-1 transition ${
                viewMode === 'BLUEPRINT'
                  ? 'bg-cyan-600 text-white shadow-sm'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <Sparkles className="w-3 h-3 text-amber-300" />
              <span>44t HUD</span>
            </button>
          </div>

          <Link
            href="/driver/inspections/signoff"
            className="px-3 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold flex items-center gap-1 shadow-md transition touch-press"
          >
            <FileText className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Sign-Off</span>
          </Link>
        </div>
      </header>

      {/* Mobile-Optimized Body */}
      <main className="flex-1 w-full max-w-2xl mx-auto p-2 sm:p-4 overflow-y-auto space-y-4">
        {viewMode === 'BLUEPRINT' ? (
          <div className="space-y-4 animate-in fade-in duration-200">
            <InteractiveTruckBlueprint
              passedZones={passedBlueprintZones}
              onTogglePassZone={handleToggleZone}
            />
            <div className="pt-2">
              <Link
                href="/driver/inspections/signoff"
                className="w-full py-3.5 px-4 rounded-2xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-mono font-bold uppercase tracking-wider flex items-center justify-center gap-2 shadow-cockpit shadow-glow-emerald transition touch-press"
              >
                <FileText className="w-4 h-4" />
                <span>Proceed to Statutory Sign-Off ({passedBlueprintZones.length}/10 Hotspots Verified)</span>
              </Link>
            </div>
          </div>
        ) : (
          <VehicleCheckApp />
        )}
      </main>
    </div>
  );
}
