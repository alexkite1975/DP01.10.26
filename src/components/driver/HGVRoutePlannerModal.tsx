'use client';
import React, { useState } from 'react';
import { 
  Navigation, AlertTriangle, ShieldCheck, CheckCircle2, 
  MapPin, CornerUpRight, Volume2, ShieldAlert, ArrowRight,
  Truck, X, RotateCcw
} from 'lucide-react';
import { BridgeHazardPoint, HGVRoutePlan } from '../types';
import { DualHeightInput, formatHeightBoth } from '../../utils/heightUtils';

interface HGVRoutePlannerModalProps {
  onClose: () => void;
}

const SAMPLE_BRIDGES: Omit<BridgeHazardPoint, 'vehicleMarginMm' | 'severity'>[] = [
  {
    id: 'br-1',
    bridgeName: 'Grand Union Canal Aqueduct (NR-GUC-12)',
    roadName: 'A41 Watford Rd',
    clearanceMeters: 4.25,
    clearanceFeetInches: `13' 11"`,
    distanceAheadMiles: 3.4,
    recommendedDetour: 'Exit A41 at J19 towards A411 Hempstead Rd, rejoin via A405 dual carriageway'
  },
  {
    id: 'br-2',
    bridgeName: 'Chiltern Railway Low Overbridge',
    roadName: 'B488 Station Rd, Tring',
    clearanceMeters: 4.10,
    clearanceFeetInches: `13' 5"`,
    distanceAheadMiles: 8.7,
    recommendedDetour: 'Avoid B488; stay on A41 bypass north towards Aston Clinton'
  },
  {
    id: 'br-3',
    bridgeName: 'Midland Mainline Arched Viaduct (NR-MML-142B)',
    roadName: 'A5183 St Albans Rd',
    clearanceMeters: 4.55,
    clearanceFeetInches: `14' 11"`,
    distanceAheadMiles: 14.2,
    recommendedDetour: 'Center-lane transit only due to arched camber; recommend M1 J8 corridor'
  },
  {
    id: 'br-4',
    bridgeName: 'West Coast Mainline Heavy Rail Bridge',
    roadName: 'A508 Roade Bypass',
    clearanceMeters: 4.90,
    clearanceFeetInches: `16' 1"`,
    distanceAheadMiles: 28.6,
    recommendedDetour: 'Full clearance for all high-cube 4.95m mega-trailers'
  }
];

export const HGVRoutePlannerModal: React.FC<HGVRoutePlannerModalProps> = ({ onClose }) => {
  const [vehicleHeightM, setVehicleHeightM] = useState<number>(4.45);
  const [vehicleWeightT, setVehicleWeightT] = useState<number>(44);
  const [vehicleWidthM, setVehicleWidthM] = useState<number>(2.55);
  const [origin, setOrigin] = useState('DIRFT Daventry (NN6 7GZ)');
  const [destination, setDestination] = useState('Park Royal Logistics Depot (NW10 7HQ)');
  const [detourApplied, setDetourApplied] = useState(false);
  const [playingAlert, setPlayingAlert] = useState(false);

  // Compute clearances relative to configured vehicle height
  const evaluatedBridges: BridgeHazardPoint[] = SAMPLE_BRIDGES.map((b) => {
    const marginM = b.clearanceMeters - vehicleHeightM;
    const marginMm = Math.round(marginM * 1000);
    
    let severity: BridgeHazardPoint['severity'] = 'GREEN_CLEAR';
    if (marginMm < 100) {
      severity = 'RED_CRITICAL_STOP';
    } else if (marginMm < 250) {
      severity = 'AMBER_ADVISORY';
    }

    return {
      ...b,
      vehicleMarginMm: marginMm,
      severity
    };
  });

  const criticalCount = evaluatedBridges.filter(b => b.severity === 'RED_CRITICAL_STOP').length;
  const advisoryCount = evaluatedBridges.filter(b => b.severity === 'AMBER_ADVISORY').length;

  const currentRoutePlan: HGVRoutePlan = {
    origin,
    destination,
    distanceMiles: detourApplied ? 74.8 : 68.2,
    estimatedDrivingTimeMinutes: detourApplied ? 82 : 75,
    vehicleHeightMeters: vehicleHeightM,
    vehicleWeightTonnes: vehicleWeightT,
    hazardBridges: detourApplied ? [] : evaluatedBridges.filter(b => b.severity !== 'GREEN_CLEAR'),
    detourRouteAvailable: true,
    detourDistanceMiles: 6.6,
    detourExtraMinutes: 7,
    cazZonesTraversed: ['London ULEZ', 'London Congestion Zone']
  };

  const playBridgeAlarm = () => {
    setPlayingAlert(true);
    try {
      const audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();

      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(880, audioCtx.currentTime); // A5
      osc.frequency.exponentialRampToValueAtTime(440, audioCtx.currentTime + 0.3); // Drop to A4
      
      gain.gain.setValueAtTime(0.4, audioCtx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 0.5);

      osc.connect(gain);
      gain.connect(audioCtx.destination);

      osc.start();
      osc.stop(audioCtx.currentTime + 0.5);

      // Repeat 3 quick beeps
      setTimeout(() => {
        const osc2 = audioCtx.createOscillator();
        const gain2 = audioCtx.createGain();
        osc2.type = 'sawtooth';
        osc2.frequency.setValueAtTime(880, audioCtx.currentTime);
        osc2.frequency.exponentialRampToValueAtTime(440, audioCtx.currentTime + 0.3);
        gain2.gain.setValueAtTime(0.4, audioCtx.currentTime);
        gain2.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 0.5);
        osc2.connect(gain2);
        gain2.connect(audioCtx.destination);
        osc2.start();
        osc2.stop(audioCtx.currentTime + 0.5);
      }, 300);

      // Synthetic speech alert
      if ('speechSynthesis' in window) {
        const utter = new SpeechSynthesisUtterance("Warning: Low bridge 4.25 meters ahead on A41 Watford Road. Critical stop required. Detour to motorway corridor.");
        utter.rate = 1.05;
        window.speechSynthesis.speak(utter);
      }
    } catch (e) {
      console.warn('Audio alert error:', e);
    } finally {
      setTimeout(() => setPlayingAlert(false), 2000);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/80 backdrop-blur-md overflow-y-auto animate-fadeIn">
      <div className="relative w-full max-w-5xl bg-slate-900 border border-slate-700/80 rounded-2xl shadow-2xl overflow-hidden flex flex-col my-auto max-h-[92vh]">

        {/* Header */}
        <div className="bg-gradient-to-r from-amber-950/60 via-slate-900 to-red-950/60 px-6 py-4 border-b border-slate-700/80 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-amber-500/20 text-amber-400 border border-amber-500/30">
              <Navigation className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-xl font-black text-white tracking-wide">
                  HGV Low-Bridge Routing & Strike Prevention
                </h2>
                <span className="px-2 py-0.5 rounded text-[11px] font-bold bg-red-500/20 text-red-300 border border-red-500/30 uppercase">
                  Network Rail Safety Matrix
                </span>
              </div>
              <p className="text-xs text-slate-400">
                Turn-by-turn clearance monitoring, camber arc hazard detection & Strategic Road Network (SRN) detours
              </p>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-6 overflow-y-auto space-y-6">

          {/* Dual Metric & Feet Height Auto-Converter */}
          <div className="mb-4">
            <DualHeightInput
              valueMeters={vehicleHeightM}
              onChange={(m) => {
                setVehicleHeightM(m);
                setDetourApplied(false);
              }}
              label="HGV Clearance Datum (Auto-Converts Metric & Feet)"
              helperText="Enter either metric or feet/inches. All route clearances and bridge warnings are automatically updated in both units."
            />
          </div>

          {/* Vehicle Dimensions Bar */}
          <div className="bg-slate-800/60 border border-slate-700/60 rounded-xl p-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
              <div>
                <label className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block mb-1">
                  Active Height Datum
                </label>
                <div className="p-2 rounded-lg bg-slate-900 border border-slate-700 font-mono text-sm font-bold text-amber-400">
                  {formatHeightBoth(vehicleHeightM)}
                </div>
                <span className="text-[10px] text-slate-500 mt-1 block">
                  Synchronized with Nav SDK
                </span>
              </div>

              <div>
                <label className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block mb-1">
                  Gross Vehicle Weight
                </label>
                <div className="flex items-center gap-2">
                  <input
                    type="number"
                    min="7.5"
                    max="44"
                    value={vehicleWeightT}
                    onChange={(e) => setVehicleWeightT(parseFloat(e.target.value) || 44)}
                    className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-1.5 text-white font-mono text-sm focus:outline-none focus:border-amber-500"
                  />
                  <span className="text-xs font-semibold text-slate-400">tonnes</span>
                </div>
                <span className="text-[10px] text-slate-500 mt-1 block">6-Axle Articulated Max 44t</span>
              </div>

              <div>
                <label className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block mb-1">
                  Overall Width
                </label>
                <div className="flex items-center gap-2">
                  <input
                    type="number"
                    step="0.05"
                    min="2.0"
                    max="3.0"
                    value={vehicleWidthM}
                    onChange={(e) => setVehicleWidthM(parseFloat(e.target.value) || 2.55)}
                    className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-1.5 text-white font-mono text-sm focus:outline-none focus:border-amber-500"
                  />
                  <span className="text-xs font-semibold text-slate-400">m</span>
                </div>
                <span className="text-[10px] text-slate-500 mt-1 block">Standard Max 2.55m</span>
              </div>

              <div className="flex flex-col justify-end">
                <button
                  onClick={playBridgeAlarm}
                  disabled={playingAlert}
                  className="w-full py-2 px-3 bg-red-600/20 hover:bg-red-600/30 text-red-300 border border-red-500/40 rounded-lg text-xs font-bold flex items-center justify-center gap-2 transition-all shadow-sm"
                >
                  <Volume2 className={`w-4 h-4 text-red-400 ${playingAlert ? 'animate-bounce' : ''}`} />
                  Test Audio Proximity Alarm
                </button>
              </div>
            </div>
          </div>

          {/* Route Status Summary & Detour Toggle */}
          <div className={`p-5 rounded-xl border transition-all ${
            detourApplied
              ? 'bg-emerald-950/20 border-emerald-500/40'
              : criticalCount > 0
              ? 'bg-red-950/25 border-red-500/50'
              : 'bg-amber-950/20 border-amber-500/40'
          }`}>
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <div className="flex items-center gap-2">
                  {detourApplied ? (
                    <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 flex items-center gap-1.5">
                      <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                      SAFE ROUTE APPROVED (0 Low Bridges)
                    </span>
                  ) : criticalCount > 0 ? (
                    <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-red-500/20 text-red-300 border border-red-500/40 flex items-center gap-1.5 animate-pulse">
                      <ShieldAlert className="w-3.5 h-3.5 text-red-400" />
                      STRIKE HAZARD DETECTED: {criticalCount} CRITICAL RESTRICTION(S)
                    </span>
                  ) : (
                    <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-amber-500/20 text-amber-300 border border-amber-500/40 flex items-center gap-1.5">
                      <AlertTriangle className="w-3.5 h-3.5 text-amber-400" />
                      {advisoryCount} ADVISORY TIGHT CLEARANCES
                    </span>
                  )}
                </div>

                <div className="mt-2 text-sm text-slate-300">
                  <span className="font-semibold text-white">{origin}</span>
                  <span className="mx-2 text-slate-500">➔</span>
                  <span className="font-semibold text-white">{destination}</span>
                </div>

                <div className="flex items-center gap-4 mt-2 text-xs text-slate-400 font-mono">
                  <span>Distance: <strong className="text-white">{currentRoutePlan.distanceMiles} miles</strong></span>
                  <span>Transit Time: <strong className="text-white">{currentRoutePlan.estimatedDrivingTimeMinutes} mins</strong></span>
                  {detourApplied && (
                    <span className="text-emerald-400 font-sans font-bold">
                      +6.6 miles via M1/M25 (avoiding £13,000 Network Rail bridge strike cost)
                    </span>
                  )}
                </div>
              </div>

              <div>
                {detourApplied ? (
                  <button
                    onClick={() => setDetourApplied(false)}
                    className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-600 rounded-xl text-xs font-bold flex items-center gap-2 transition-all"
                  >
                    <RotateCcw className="w-3.5 h-3.5" />
                    Reset Direct Corridor
                  </button>
                ) : (
                  <button
                    onClick={() => setDetourApplied(true)}
                    className="px-4 py-2.5 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-bold text-xs rounded-xl shadow-lg shadow-emerald-600/30 flex items-center gap-2 transition-all transform hover:scale-105"
                  >
                    <CornerUpRight className="w-4 h-4" />
                    Engage Safe Motorway Detour
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* Bridges Corridor List */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">
                Route Clearance Cross-Sections ({evaluatedBridges.length} Tracked Structures)
              </h3>
              <span className="text-[11px] text-slate-500">
                Vehicle Height Datum: <strong className="text-amber-400">{vehicleHeightM.toFixed(2)}m</strong>
              </span>
            </div>

            <div className="space-y-2.5">
              {evaluatedBridges.map((b) => {
                const isCritical = b.severity === 'RED_CRITICAL_STOP';
                const isAdvisory = b.severity === 'AMBER_ADVISORY';

                return (
                  <div
                    key={b.id}
                    className={`p-4 rounded-xl border transition-all ${
                      detourApplied
                        ? 'bg-slate-900/40 border-slate-800 opacity-50 line-through'
                        : isCritical
                        ? 'bg-red-950/20 border-red-500/50 shadow-md shadow-red-950/30'
                        : isAdvisory
                        ? 'bg-amber-950/15 border-amber-500/40'
                        : 'bg-slate-800/40 border-slate-700/60'
                    }`}
                  >
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                      <div>
                        <div className="flex items-center gap-2">
                          <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                            isCritical
                              ? 'bg-red-500 text-white animate-pulse'
                              : isAdvisory
                              ? 'bg-amber-500/30 text-amber-300 border border-amber-500/40'
                              : 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                          }`}>
                            {isCritical ? 'COLLISION HAZARD' : isAdvisory ? 'TIGHT CLEARANCE' : 'CLEAR PASSAGE'}
                          </span>
                          <h4 className="text-sm font-bold text-white">
                            {b.bridgeName}
                          </h4>
                        </div>
                        <p className="text-xs text-slate-400 mt-1 flex items-center gap-2">
                          <span className="font-semibold text-slate-300">{b.roadName}</span>
                          <span>•</span>
                          <span>{b.distanceAheadMiles} miles ahead on current trajectory</span>
                        </p>
                      </div>

                      <div className="text-right flex sm:flex-col items-center sm:items-end justify-between gap-1">
                        <div className="text-sm font-mono font-bold text-white">
                          Clearance: {b.clearanceMeters.toFixed(2)}m ({b.clearanceFeetInches})
                        </div>
                        <div className={`text-xs font-mono font-bold ${
                          b.vehicleMarginMm < 0 
                            ? 'text-red-400' 
                            : b.vehicleMarginMm < 100 
                            ? 'text-red-400' 
                            : b.vehicleMarginMm < 250 
                            ? 'text-amber-400' 
                            : 'text-emerald-400'
                        }`}>
                          Margin: {b.vehicleMarginMm > 0 ? `+${b.vehicleMarginMm}mm` : `${b.vehicleMarginMm}mm (DEFICIT)`}
                        </div>
                      </div>
                    </div>

                    <div className="mt-3 pt-2.5 border-t border-slate-700/50 flex items-center justify-between text-xs text-slate-400">
                      <div className="flex items-center gap-1.5">
                        <CornerUpRight className="w-3.5 h-3.5 text-blue-400 shrink-0" />
                        <span className="text-slate-300">{b.recommendedDetour}</span>
                      </div>
                      <span className="text-[10px] font-mono text-slate-500 shrink-0">
                        NR Emergency: 03457 11 41 41
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Detour Guidance Banner */}
          {detourApplied && (
            <div className="bg-emerald-950/30 border border-emerald-500/40 rounded-xl p-4 flex items-center gap-3">
              <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
              <div className="text-xs text-emerald-200">
                <strong>Strategic Road Network (SRN) Route Locked:</strong> Your GPS guidance has re-routed via M1 Southbound, joining M25 clockwise at Junction 21, and approaching Park Royal via A40 Western Avenue. Guaranteed zero low bridges under 5.0m clearance.
              </div>
            </div>
          )}

          {/* Footer */}
          <div className="flex items-center justify-between pt-2">
            <div className="text-xs text-slate-500 flex items-center gap-1">
              <Truck className="w-4 h-4 text-slate-400" />
              <span>Conforms to UK Network Rail Bridge Strike Reduction Guidelines (PR8/3)</span>
            </div>
            <button
              onClick={onClose}
              className="px-5 py-2 bg-amber-600 hover:bg-amber-500 text-white font-bold text-xs rounded-xl shadow-lg shadow-amber-600/20 transition-all"
            >
              Close & Keep Route Loaded
            </button>
          </div>

        </div>

      </div>
    </div>
  );
};
