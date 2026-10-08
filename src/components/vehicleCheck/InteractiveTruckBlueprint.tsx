'use client';

import React, { useState } from 'react';
import {
  ShieldCheck,
  AlertTriangle,
  Info,
  CheckCircle2,
  Maximize2,
  Eye,
  Sliders
} from 'lucide-react';

export interface BlueprintZone {
  id: string;
  name: string;
  code: string;
  xPercent: number; // 0 to 100 on blueprint
  yPercent: number; // 0 to 100 on blueprint
  description: string;
  dvsaRule: string;
  criticalPoints: string[];
}

export const BLUEPRINT_ZONES: BlueprintZone[] = [
  {
    id: 'zone-cab-front',
    name: 'Cab Front & Glass',
    code: 'ZONE 1',
    xPercent: 12,
    yPercent: 32,
    description: 'Windscreen, wipers, wash reservoir, mirrors & front marker lights.',
    dvsaRule: 'DVSA Category A: No cracks >40mm in swept area or >10mm in Zone A.',
    criticalPoints: ['Zone A optical sweep', 'Wiper blade condition', 'Forward camera calibration']
  },
  {
    id: 'zone-steer-axle',
    name: 'Steer Axle & Tyres',
    code: 'ZONE 2',
    xPercent: 18,
    yPercent: 78,
    description: 'Steer tyres, wheel nut pointers, hub oil seal & suspension.',
    dvsaRule: 'Minimum 1.0mm tread across 3/4 breadth; no cuts exposing cords.',
    criticalPoints: ['Wheel nut torque alignment', 'Tread depth >= 1.0mm', 'Hub grease cap']
  },
  {
    id: 'zone-suzi-coils',
    name: 'Suzi Coils & Catwalk',
    code: 'ZONE 3',
    xPercent: 28,
    yPercent: 42,
    description: 'Emergency (Red) & Service (Yellow) air lines, 24N/24S electrical coils.',
    dvsaRule: 'Couplings must seat with zero audible hiss; cables clear of catwalk.',
    criticalPoints: ['Palm coupling rubber seals', 'EBS CAN-bus 7-pin plug', 'Catwalk non-slip mesh']
  },
  {
    id: 'zone-fifth-wheel',
    name: 'Fifth Wheel & Kingpin',
    code: 'ZONE 4',
    xPercent: 33,
    yPercent: 62,
    description: 'Fifth wheel jaws, kingpin safety dog-clip & mounting bolts.',
    dvsaRule: 'Dog-clip must be fully engaged; zero daylight between apron and plate.',
    criticalPoints: ['Safety latch dog-clip engaged', 'Release handle parked', 'Bed grease lubrication']
  },
  {
    id: 'zone-landing-legs',
    name: 'Trailer Landing Legs',
    code: 'ZONE 5',
    xPercent: 42,
    yPercent: 78,
    description: 'Two-speed landing legs, handle stowage & brace crossbars.',
    dvsaRule: 'Feet fully wound up; winding handle securely seated in cradle.',
    criticalPoints: ['Feet stowed to max height', 'Handle locked in bracket', 'Zero diagonal twist']
  },
  {
    id: 'zone-curtain-straps',
    name: 'Curtains & Conspicuity',
    code: 'ZONE 6',
    xPercent: 55,
    yPercent: 30,
    description: 'Side curtains, rave ratchets, load straps & yellow conspicuity tape.',
    dvsaRule: 'EN 12642-XL rated side-curtains; buckles locked and tensioned.',
    criticalPoints: ['Rave hook engagement', 'ECE 104 retro-reflective tape', 'Tear-free curtain skin']
  },
  {
    id: 'zone-tri-axle',
    name: 'Tri-Axle Running Gear',
    code: 'ZONE 7',
    xPercent: 74,
    yPercent: 78,
    description: 'Six trailer tyres, air suspension bags, disc brake pads & mudguards.',
    dvsaRule: 'Air bellows inflated with zero chafing; mudflaps securely anchored.',
    criticalPoints: ['Air bag bellows condition', 'Brake chamber stroke', 'Tyre inflation pressure']
  },
  {
    id: 'zone-load-restraint',
    name: 'Internal Load Security',
    code: 'ZONE 8',
    xPercent: 65,
    yPercent: 48,
    description: 'Internal rave straps, load bars, headboard & pallet restraint.',
    dvsaRule: 'Load must withstand 80% forward and 50% sideways acceleration.',
    criticalPoints: ['Internal ratchet tension', 'Anti-slip floor friction', 'Zero cargo shifting']
  },
  {
    id: 'zone-rear-doors',
    name: 'Rear Doors & Locks',
    code: 'ZONE 9',
    xPercent: 90,
    yPercent: 35,
    description: 'Double barn doors, rubber edge seals, cam handles & safety catches.',
    dvsaRule: 'Secondary door safety retainer straps used when opening.',
    criticalPoints: ['Rubber weather seal intact', 'Door lock cams seated', 'Retainer safety straps']
  },
  {
    id: 'zone-rear-lighting',
    name: 'Rear Lighting & Underrun',
    code: 'ZONE 10',
    xPercent: 92,
    yPercent: 78,
    description: 'LED cluster lamps, reversing beeper, reflective boards & underrun bar.',
    dvsaRule: 'All rear markers, indicators, brake lights & yellow/red chevrons operational.',
    criticalPoints: ['ECE 70 Long Vehicle plates', 'Rear underrun crash bar', 'LED cluster illumination']
  }
];

interface InteractiveTruckBlueprintProps {
  passedZones?: string[];
  defectZones?: string[];
  onSelectZone?: (zone: BlueprintZone) => void;
  onTogglePassZone?: (zoneId: string) => void;
}

export const InteractiveTruckBlueprint: React.FC<InteractiveTruckBlueprintProps> = ({
  passedZones = [],
  defectZones = [],
  onSelectZone,
  onTogglePassZone
}) => {
  const [activeZoneId, setActiveZoneId] = useState<string>('zone-cab-front');
  const activeZone = BLUEPRINT_ZONES.find((z) => z.id === activeZoneId) || BLUEPRINT_ZONES[0];

  const totalZones = BLUEPRINT_ZONES.length;
  const passedCount = passedZones.length;
  const isAllPassed = passedCount === totalZones;

  const handleZoneClick = (zone: BlueprintZone) => {
    setActiveZoneId(zone.id);
    if (onSelectZone) {
      onSelectZone(zone);
    }
  };

  return (
    <div className="cockpit-panel rounded-3xl p-4 sm:p-6 space-y-5 border border-white/10 shadow-cockpit-lg">
      {/* Blueprint Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800 pb-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-cyan-400 animate-ping" />
            <span className="text-xs font-mono font-bold text-cyan-400 tracking-wider">
              INTERACTIVE 44T ARTIC BLUEPRINT
            </span>
            <span className="px-2 py-0.5 rounded-full text-[10px] font-mono bg-blue-500/10 text-blue-300 border border-blue-500/30">
              HUD VISION
            </span>
          </div>
          <h2 className="text-base sm:text-lg font-black text-white tracking-tight mt-0.5">
            DVSA Walkaround Inspection Radar
          </h2>
        </div>

        {/* Live Progress Pill */}
        <div className="flex items-center gap-3">
          <div className="text-right">
            <div className="text-[10px] font-mono text-slate-400 uppercase">Compliance Index</div>
            <div className="text-base font-black font-mono text-emerald-400">
              {passedCount} / {totalZones} Zones Verified
            </div>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-slate-900 border border-slate-800 flex items-center justify-center font-mono font-black text-sm text-cyan-400 shadow-inner">
            {Math.round((passedCount / totalZones) * 100)}%
          </div>
        </div>
      </div>

      {/* Vector Truck Silhouette with Hotspots */}
      <div className="relative w-full aspect-[21/9] sm:aspect-[24/9] bg-gradient-to-b from-slate-950 via-slate-900/90 to-slate-950 rounded-2xl border border-slate-800 overflow-hidden shadow-inner flex items-center justify-center select-none">
        {/* Holographic Radar Grid Background */}
        <div className="absolute inset-0 bg-cockpit-grid opacity-70 pointer-events-none" />

        {/* Directional Centerline Indicator */}
        <div className="absolute top-3 left-4 text-[9px] font-mono text-slate-500 tracking-wider flex items-center gap-2">
          <span>FRONT (CAB) ➔</span>
          <span className="w-12 h-[1px] bg-slate-700" />
          <span>REAR (BARN DOORS)</span>
        </div>

        {/* Realistic Stylized 44t Artic Truck SVG Blueprint */}
        <svg
          viewBox="0 0 1000 360"
          className="w-full h-full px-4 py-2 drop-shadow-[0_0_20px_rgba(34,211,238,0.15)]"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          {/* Ground Surface Shadow */}
          <ellipse cx="500" cy="330" rx="460" ry="14" fill="#020617" opacity="0.8" />

          {/* === TRACTOR UNIT (4x2 / 6x2 Globetrotter Cab) === */}
          {/* Cab Body */}
          <path
            d="M 60 270 L 60 150 L 110 80 L 230 80 L 250 140 L 250 270 Z"
            fill="#0f172a"
            stroke="#38bdf8"
            strokeWidth="2.5"
            strokeLinejoin="round"
          />
          {/* Windscreen & Side Windows */}
          <path
            d="M 115 88 L 155 88 L 140 160 L 75 160 Z"
            fill="#0284c7"
            fillOpacity="0.25"
            stroke="#38bdf8"
            strokeWidth="1.8"
          />
          <rect
            x="148"
            y="95"
            width="85"
            height="65"
            rx="4"
            fill="#0284c7"
            fillOpacity="0.2"
            stroke="#38bdf8"
            strokeWidth="1.8"
          />
          {/* Cab Aerofoil / Sunvisor */}
          <path d="M 85 75 L 145 75" stroke="#f59e0b" strokeWidth="3" strokeLinecap="round" />
          {/* Front Grille & Headlamp */}
          <rect x="58" y="190" width="12" height="60" rx="3" fill="#1e293b" stroke="#64748b" strokeWidth="1.5" />
          <circle cx="65" cy="255" r="7" fill="#fef08a" opacity="0.8" />
          {/* Class V/VI Mirrors */}
          <path d="M 70 110 L 50 110 L 50 140" stroke="#38bdf8" strokeWidth="2" strokeLinecap="round" />
          {/* Steer Wheel (Wheel 1) */}
          <circle cx="150" cy="275" r="34" fill="#020617" stroke="#475569" strokeWidth="3" />
          <circle cx="150" cy="275" r="18" fill="#1e293b" stroke="#94a3b8" strokeWidth="2" />
          {/* Mid/Drive Wheel (Wheel 2) */}
          <circle cx="280" cy="275" r="34" fill="#020617" stroke="#475569" strokeWidth="3" />
          <circle cx="280" cy="275" r="18" fill="#1e293b" stroke="#94a3b8" strokeWidth="2" />

          {/* Suzi Coils (Red & Yellow Spirals) */}
          <path
            d="M 255 180 C 270 170, 260 200, 280 185 C 295 175, 285 205, 305 190"
            stroke="#ef4444"
            strokeWidth="2.5"
            strokeDasharray="4 2"
          />
          <path
            d="M 255 195 C 270 185, 260 215, 280 200 C 295 190, 285 220, 305 205"
            stroke="#eab308"
            strokeWidth="2.5"
            strokeDasharray="4 2"
          />

          {/* Fifth Wheel Coupling Ramp */}
          <path d="M 265 240 L 320 240 L 305 250 Z" fill="#475569" stroke="#94a3b8" strokeWidth="1.5" />

          {/* === 13.6 METRE CURTAINSIDER TRAILER === */}
          {/* Main Trailer Box */}
          <rect
            x="300"
            y="65"
            width="650"
            height="205"
            rx="6"
            fill="#090d16"
            stroke="#38bdf8"
            strokeWidth="2.5"
          />
          {/* Curtain Ribs (Vertical Tensioners) */}
          {[360, 420, 480, 540, 600, 660, 720, 780, 840, 900].map((xPos) => (
            <line
              key={xPos}
              x1={xPos}
              y1="70"
              x2={xPos}
              y2="265"
              stroke="#1e293b"
              strokeWidth="1.5"
              strokeDasharray="6 4"
            />
          ))}
          {/* Reflective Yellow Conspicuity Line */}
          <line x1="310" y1="262" x2="940" y2="262" stroke="#eab308" strokeWidth="3" strokeDasharray="16 6" />
          {/* Trailer Landing Legs */}
          <rect x="420" y="270" width="16" height="35" fill="#1e293b" stroke="#64748b" strokeWidth="2" />
          <line x1="410" y1="305" x2="445" y2="305" stroke="#94a3b8" strokeWidth="3" />

          {/* Tri-Axle Bogie (Wheels 3, 4, 5) */}
          <circle cx="720" cy="285" r="32" fill="#020617" stroke="#475569" strokeWidth="3" />
          <circle cx="720" cy="285" r="16" fill="#1e293b" stroke="#94a3b8" strokeWidth="2" />

          <circle cx="795" cy="285" r="32" fill="#020617" stroke="#475569" strokeWidth="3" />
          <circle cx="795" cy="285" r="16" fill="#1e293b" stroke="#94a3b8" strokeWidth="2" />

          <circle cx="870" cy="285" r="32" fill="#020617" stroke="#475569" strokeWidth="3" />
          <circle cx="870" cy="285" r="16" fill="#1e293b" stroke="#94a3b8" strokeWidth="2" />

          {/* Rear Underrun Protection Bar & ECE 70 Chevrons */}
          <rect x="940" y="275" width="14" height="25" fill="#ef4444" stroke="#fca5a5" strokeWidth="1.5" />
          <rect x="948" y="200" width="6" height="60" fill="#eab308" stroke="#fef08a" strokeWidth="1" />
        </svg>

        {/* Hotspot Radar Checkpoints */}
        {BLUEPRINT_ZONES.map((zone) => {
          const isSelected = zone.id === activeZoneId;
          const isPassed = passedZones.includes(zone.id);
          const isDefect = defectZones.includes(zone.id);

          let pinColor = 'bg-cyan-500 border-cyan-300 text-cyan-200';
          let ringColor = 'border-cyan-400';

          if (isDefect) {
            pinColor = 'bg-rose-500 border-rose-300 text-rose-100 shadow-[0_0_15px_#f43f5e]';
            ringColor = 'border-rose-400';
          } else if (isPassed) {
            pinColor = 'bg-emerald-500 border-emerald-300 text-emerald-100 shadow-[0_0_15px_#10b981]';
            ringColor = 'border-emerald-400';
          } else if (isSelected) {
            pinColor = 'bg-amber-500 border-amber-300 text-amber-100 shadow-[0_0_15px_#f59e0b]';
            ringColor = 'border-amber-400';
          }

          return (
            <button
              key={zone.id}
              onClick={() => handleZoneClick(zone)}
              style={{
                left: `${zone.xPercent}%`,
                top: `${zone.yPercent}%`
              }}
              className="absolute -translate-x-1/2 -translate-y-1/2 group touch-press focus:outline-none"
              title={`${zone.name} (${zone.code})`}
            >
              {/* Outer Pulsing Ring when selected or active */}
              {isSelected && (
                <span
                  className={`absolute -inset-2 rounded-full border-2 ${ringColor} animate-ping opacity-75`}
                />
              )}

              {/* Checkpoint Badge */}
              <div
                className={`relative w-6 h-6 sm:w-7 sm:h-7 rounded-full border-2 flex items-center justify-center text-[10px] sm:text-xs font-mono font-black transition-all ${pinColor} ${
                  isSelected ? 'scale-125 z-10' : 'hover:scale-110'
                }`}
              >
                {isPassed ? (
                  <CheckCircle2 className="w-3.5 h-3.5" />
                ) : isDefect ? (
                  <AlertTriangle className="w-3.5 h-3.5" />
                ) : (
                  <span>{zone.id.replace('zone-', '').charAt(0).toUpperCase()}</span>
                )}
              </div>

              {/* Tooltip on Hover */}
              <span className="hidden sm:group-hover:block absolute top-full left-1/2 -translate-x-1/2 mt-1.5 px-2 py-1 rounded-md bg-slate-950/90 text-white border border-slate-700 text-[10px] font-mono whitespace-nowrap z-20 shadow-xl pointer-events-none">
                {zone.name}
              </span>
            </button>
          );
        })}
      </div>

      {/* Selected Zone Detail Card */}
      <div className="cockpit-panel rounded-2xl p-4 border border-slate-800 space-y-3 bg-slate-900/80">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-800/80 pb-3">
          <div className="flex items-center gap-2">
            <span className="px-2 py-0.5 rounded-md bg-cyan-500/10 text-cyan-400 border border-cyan-500/30 text-xs font-mono font-bold">
              {activeZone.code}
            </span>
            <h3 className="text-sm sm:text-base font-black text-white">{activeZone.name}</h3>
          </div>

          {/* Quick Action Button for this Zone */}
          <div className="flex items-center gap-2">
            {onTogglePassZone && (
              <button
                onClick={() => onTogglePassZone(activeZone.id)}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-mono font-bold flex items-center gap-1.5 transition touch-press ${
                  passedZones.includes(activeZone.id)
                    ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 hover:bg-emerald-500/30'
                    : 'bg-slate-800 text-slate-300 hover:text-white border border-slate-700'
                }`}
              >
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>
                  {passedZones.includes(activeZone.id) ? 'Zone Inspected ✓' : 'Mark Inspected'}
                </span>
              </button>
            )}
          </div>
        </div>

        <p className="text-xs text-slate-300 leading-relaxed">{activeZone.description}</p>

        {/* DVSA Regulation & Critical Checkpoints */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
          <div className="p-3 rounded-xl bg-slate-950/70 border border-slate-800/80 space-y-1">
            <div className="flex items-center gap-1.5 text-[10px] font-mono font-bold text-amber-400">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>DVSA STATUTORY CRITERIA</span>
            </div>
            <p className="text-[11px] text-slate-400 leading-relaxed">{activeZone.dvsaRule}</p>
          </div>

          <div className="p-3 rounded-xl bg-slate-950/70 border border-slate-800/80 space-y-1">
            <div className="flex items-center gap-1.5 text-[10px] font-mono font-bold text-cyan-400">
              <Sliders className="w-3.5 h-3.5" />
              <span>KEY PHYSICAL ANCHORS</span>
            </div>
            <ul className="text-[11px] text-slate-400 space-y-0.5 list-disc list-inside">
              {activeZone.criticalPoints.map((pt, i) => (
                <li key={i}>{pt}</li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InteractiveTruckBlueprint;
