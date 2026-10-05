import React, { useState, useEffect, useRef } from 'react';
import {
  X,
  Compass,
  Navigation,
  Volume2,
  VolumeX,
  AlertTriangle,
  Camera,
  Layers,
  MapPin,
  CheckCircle2,
  ShieldAlert,
  Radio,
  Eye
} from 'lucide-react';
import { SiteRiskAssessment, DriverVehicleProfile } from '../types';
import { tts } from '../services/ttsService';

interface BayNavigationAROverlayModalProps {
  isOpen: boolean;
  onClose: () => void;
  site: SiteRiskAssessment;
  driverVehicle: DriverVehicleProfile;
}

const YARD_STAGES = [
  {
    id: 'stage-1',
    title: 'Inbound Gate & Weighbridge Approach',
    distanceMeters: 120,
    headingText: 'FOLLOW GREEN TARMAC VECTOR TO WEIGHBRIDGE',
    targetBay: 'Inbound Weighbridge Platform 1',
    hazardAlert: null,
    imageUrl:
      'https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?auto=format&fit=crop&w=1200&q=80',
    arrowAngle: 'straight'
  },
  {
    id: 'stage-2',
    title: 'Inner Circulation & Blind Corner',
    distanceMeters: 75,
    headingText: 'BEAR RIGHT PAST DIESEL PUMP // SPEED 5MPH',
    targetBay: 'Approaching North Canopy',
    hazardAlert: 'PEDESTRIAN CORRIDOR: High-visibility walking route ahead. Sound horn before blind turn.',
    imageUrl:
      'https://images.unsplash.com/photo-1590674899484-d5640e854abe?auto=format&fit=crop&w=1200&q=80',
    arrowAngle: 'right'
  },
  {
    id: 'stage-3',
    title: 'Final Loading Dock Apron',
    distanceMeters: 30,
    headingText: 'ALIGN 90° REVERSE INTO BAY 4',
    targetBay: 'Bay 4 (Flush Dock Leveler)',
    hazardAlert: 'REVERSING SAFETY: Deploy wheel chocks immediately upon docking. Hand keys to transport hatch.',
    imageUrl:
      'https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=1200&q=80',
    arrowAngle: 'reverse'
  }
];

export const BayNavigationAROverlayModal: React.FC<BayNavigationAROverlayModalProps> = ({
  isOpen,
  onClose,
  site,
  driverVehicle
}) => {
  const [currentStageIndex, setCurrentStageIndex] = useState(0);
  const [isMuted, setIsMuted] = useState(false);
  const [isLiveCamera, setIsLiveCamera] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);

  const currentStage = YARD_STAGES[currentStageIndex];

  useEffect(() => {
    if (isOpen && currentStage.hazardAlert && !isMuted) {
      tts.speak(`AR Guidance: ${currentStage.headingText}. ${currentStage.hazardAlert}`);
    }
  }, [isOpen, currentStageIndex, isMuted]);

  useEffect(() => {
    let stream: MediaStream | null = null;
    if (isLiveCamera && videoRef.current) {
      navigator.mediaDevices
        ?.getUserMedia({ video: { facingMode: 'environment' } })
        .then((s) => {
          stream = s;
          if (videoRef.current) videoRef.current.srcObject = s;
        })
        .catch((err) => {
          console.warn('Camera access denied or unavailable, using simulated feed:', err);
          setIsLiveCamera(false);
        });
    }
    return () => {
      if (stream) {
        stream.getTracks().forEach((t) => t.stop());
      }
    };
  }, [isLiveCamera]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-md p-2 sm:p-4 overflow-y-auto animate-in fade-in duration-200">
      <div className="relative w-full max-w-4xl rounded-3xl bg-slate-950 border border-emerald-500/40 text-white shadow-2xl overflow-hidden flex flex-col max-h-[94vh]">
        {/* Top Header */}
        <div className="px-5 py-3 border-b border-slate-800 flex items-center justify-between bg-slate-900/95">
          <div className="flex items-center gap-2.5">
            <div className="h-8 w-8 rounded-xl bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center text-emerald-400">
              <Compass className="h-4 w-4 animate-spin-slow" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-black tracking-wider text-emerald-400 uppercase">
                  AR Tarmac Navigation
                </span>
                <span className="text-[10px] rounded-full bg-emerald-500/20 text-emerald-300 px-2 py-0.5 border border-emerald-500/30">
                  Location-Aware Utility
                </span>
              </div>
              <h3 className="text-sm font-bold text-white">Bay & Yard Guidance AR Overlay</h3>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setIsMuted(!isMuted)}
              className="p-2 rounded-xl bg-slate-800 text-slate-300 hover:text-white transition-colors"
              title={isMuted ? 'Unmute Audio' : 'Mute Audio'}
            >
              {isMuted ? <VolumeX className="h-4 w-4" /> : <Volume2 className="h-4 w-4 text-emerald-400" />}
            </button>
            <button
              onClick={onClose}
              className="rounded-xl p-2 text-slate-400 hover:bg-slate-800 hover:text-white transition-colors"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
        </div>

        {/* Viewport Canvas */}
        <div className="relative aspect-[16/9] w-full bg-slate-900 overflow-hidden flex items-center justify-center">
          {/* Background Image / Camera Feed */}
          {isLiveCamera ? (
            <video ref={videoRef} autoPlay playsInline muted className="w-full h-full object-cover" />
          ) : (
            <img
              src={currentStage.imageUrl}
              alt="Yard camera feed"
              className="w-full h-full object-cover filter contrast-105"
            />
          )}

          {/* Perspective Shadow Vignette */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/40 pointer-events-none" />

          {/* AR Ground Vector Overlay (Projected on Tarmac) */}
          <div className="absolute inset-x-0 bottom-8 flex flex-col items-center pointer-events-none">
            {/* Animated Directional Arrows */}
            <div className="flex flex-col items-center space-y-1 animate-bounce duration-1000">
              <div className="w-24 h-4 bg-emerald-400/90 rounded-full shadow-[0_0_20px_#34d399] filter blur-[0.5px]" />
              <div className="w-16 h-3 bg-emerald-300/80 rounded-full shadow-[0_0_15px_#34d399]" />
              <div className="w-8 h-2 bg-emerald-200/90 rounded-full shadow-[0_0_10px_#34d399]" />
            </div>

            {/* Destination Floating Pin */}
            <div className="mt-3 px-4 py-2 rounded-2xl bg-slate-950/90 border-2 border-emerald-400 text-center shadow-2xl backdrop-blur-md">
              <div className="flex items-center justify-center gap-1.5 text-xs font-black text-emerald-400 tracking-wide">
                <Navigation className="h-4 w-4" />
                <span>{currentStage.headingText}</span>
              </div>
              <div className="text-[11px] text-slate-300 mt-0.5">
                Target: <strong className="text-white">{currentStage.targetBay}</strong> ({currentStage.distanceMeters}m away)
              </div>
            </div>
          </div>

          {/* In-Cab Hazard Siren / Warning Banner */}
          {currentStage.hazardAlert && (
            <div className="absolute top-4 inset-x-4 sm:inset-x-12 p-3 rounded-2xl bg-rose-950/90 border-2 border-rose-500 shadow-2xl backdrop-blur-md flex items-center gap-3 animate-pulse">
              <div className="h-9 w-9 rounded-xl bg-rose-500 text-slate-950 flex items-center justify-center shrink-0">
                <AlertTriangle className="h-5 w-5" />
              </div>
              <div className="flex-1">
                <div className="text-xs font-black text-rose-300 uppercase tracking-wide">
                  Live Site Hazard & Speed Warning
                </div>
                <p className="text-xs text-white font-medium">{currentStage.hazardAlert}</p>
              </div>
            </div>
          )}

          {/* AR Waypoint Floating Badges */}
          <div className="absolute top-16 left-6 hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-xl bg-black/70 border border-cyan-400/50 backdrop-blur-sm text-xs font-bold text-cyan-300">
            <span className="h-2 w-2 rounded-full bg-cyan-400 animate-ping" />
            <span>Transport Office Hatch (25m Left)</span>
          </div>

          <div className="absolute top-24 right-6 hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-xl bg-black/70 border border-emerald-400/50 backdrop-blur-sm text-xs font-bold text-emerald-300">
            <span className="h-2 w-2 rounded-full bg-emerald-400" />
            <span>Scissor Leveler Active</span>
          </div>
        </div>

        {/* Navigation Stage Stepper Toolbar */}
        <div className="p-4 bg-slate-950 border-t border-slate-800 flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            {YARD_STAGES.map((s, idx) => (
              <button
                key={s.id}
                onClick={() => setCurrentStageIndex(idx)}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold border transition-all ${
                  currentStageIndex === idx
                    ? 'bg-emerald-500 text-slate-950 border-emerald-400 font-black shadow-md shadow-emerald-500/20'
                    : 'bg-slate-900 text-slate-300 border-slate-800 hover:bg-slate-800'
                }`}
              >
                Step {idx + 1}: {s.title.split('&')[0].trim()}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setIsLiveCamera(!isLiveCamera)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold border transition-colors flex items-center gap-1.5 ${
                isLiveCamera
                  ? 'bg-cyan-500 text-slate-950 border-cyan-400'
                  : 'bg-slate-800 text-slate-300 border-slate-700 hover:bg-slate-750'
              }`}
            >
              <Camera className="h-3.5 w-3.5" />
              <span>{isLiveCamera ? 'Switch to Simulated' : 'Use Phone Camera'}</span>
            </button>
            <button
              onClick={onClose}
              className="px-4 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold transition-colors"
            >
              Close AR
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
