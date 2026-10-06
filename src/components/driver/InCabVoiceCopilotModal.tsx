'use client';
import React, { useState, useEffect, useRef } from 'react';
import {
  Mic,
  MicOff,
  Volume2,
  VolumeX,
  X,
  Sparkles,
  ShieldAlert,
  ShieldCheck,
  Lock,
  Phone,
  Truck,
  RotateCcw,
  CheckCircle2,
  AlertTriangle,
  ArrowRight
} from 'lucide-react';
import { SiteRiskAssessment, DriverVehicleProfile } from '../types';
import { tts } from '../services/ttsService';
import { askInCabVoiceCopilot, VoiceCopilotResponse } from '../services/voiceCopilotService';
import { formatHeightBoth } from '../../utils/heightUtils';

interface InCabVoiceCopilotModalProps {
  isOpen: boolean;
  onClose: () => void;
  site: SiteRiskAssessment;
  vehicleProfile?: DriverVehicleProfile;
  driverVehicle?: DriverVehicleProfile;
  onOpenInMotionHud?: () => void;
}

export const InCabVoiceCopilotModal: React.FC<InCabVoiceCopilotModalProps> = ({
  isOpen,
  onClose,
  site,
  vehicleProfile,
  driverVehicle,
  onOpenInMotionHud
}) => {
  const activeVehicle = vehicleProfile || driverVehicle || {
    driverName: 'Driver',
    vehicleReg: 'HGV',
    vehicleCategory: '44T_ARTIC_HGV',
    heightMeters: 4.45,
    weightTonnes: 44.0,
    lengthMeters: 16.5,
    widthMeters: 2.55,
    hasTailLift: false,
    preferredNavApp: 'GOOGLE_MAPS'
  } as DriverVehicleProfile;

  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [isThinking, setIsThinking] = useState(false);
  const [copilotResponse, setCopilotResponse] = useState<VoiceCopilotResponse | null>(null);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [speechSupported, setSpeechSupported] = useState(false);
  const recognitionRef = useRef<any>(null);

  // Check speech recognition support
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const SpeechRecognition =
        (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
      if (SpeechRecognition) {
        setSpeechSupported(true);
        const recognition = new SpeechRecognition();
        recognition.continuous = false;
        recognition.interimResults = true;
        recognition.lang = 'en-GB';

        recognition.onstart = () => {
          setIsListening(true);
        };

        recognition.onresult = (event: any) => {
          let current = '';
          for (let i = event.resultIndex; i < event.results.length; ++i) {
            current += event.results[i][0].transcript;
          }
          setTranscript(current);
        };

        recognition.onerror = (e: any) => {
          console.warn('Speech recognition notice:', e);
          setIsListening(false);
        };

        recognition.onend = () => {
          setIsListening(false);
        };

        recognitionRef.current = recognition;
      }
    }

    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.abort();
      }
    };
  }, []);

  // Track TTS speaking status
  useEffect(() => {
    return tts.subscribe((speaking) => {
      setIsSpeaking(speaking);
    });
  }, []);

  // Clean up on close
  useEffect(() => {
    if (!isOpen) {
      if (isListening && recognitionRef.current) {
        recognitionRef.current.abort();
      }
      tts.stop();
    } else {
      // Auto-briefing on open if no response yet
      if (!copilotResponse) {
        handleQuickQuery("What's the gate code and entry instructions?");
      }
    }
  }, [isOpen]);

  const toggleListening = () => {
    if (isListening) {
      recognitionRef.current?.stop();
      setIsListening(false);
      if (transcript.trim()) {
        handleProcessQuery(transcript.trim());
      }
    } else {
      setTranscript('');
      tts.stop();
      try {
        recognitionRef.current?.start();
        setIsListening(true);
      } catch (err) {
        console.warn('Could not start microphone:', err);
      }
    }
  };

  const handleProcessQuery = async (queryText: string) => {
    if (!queryText.trim()) return;
    setIsThinking(true);
    try {
      const result = await askInCabVoiceCopilot(queryText, site, activeVehicle);
      setCopilotResponse(result);
      // Auto-speak response in cab
      tts.speak(result.spokenResponse, 1.05);
    } catch (err) {
      console.warn('Failed querying copilot:', err);
    } finally {
      setIsThinking(false);
    }
  };

  const handleQuickQuery = (queryText: string) => {
    setTranscript(queryText);
    handleProcessQuery(queryText);
  };

  if (!isOpen) return null;

  const quickPrompts = [
    { label: 'Transport Office', query: "Where is the transport office on the site plan?" },
    { label: 'Find Bay 4', query: "Where is loading bay 4 located?" },
    { label: 'Gate PIN Code', query: "What is the security gate keypad code?" },
    { label: 'Height Clearance', query: "Check my vehicle height clearance vs site limit" },
    { label: 'Reversing & Bays', query: "What are the loading bay and reversing rules?" },
    { label: 'Mandatory PPE', query: "What PPE is mandatory outside the cab?" },
    { label: 'Emergency Muster', query: "Where is the emergency muster point?" },
    { label: 'Call Gatehouse', query: "What is the site manager or gatehouse phone number?" }
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/85 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-xl rounded-3xl border border-slate-700 bg-slate-900 p-5 sm:p-7 shadow-2xl text-white max-h-[94vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-800 pb-4">
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-br from-amber-500 to-amber-600 font-bold text-slate-950 shadow-lg shadow-amber-500/20">
              <Sparkles className="h-6 w-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base sm:text-lg font-black tracking-tight text-white">
                  In-Cab Voice Safety Co-Pilot
                </h3>
                <span className="rounded-full bg-amber-500/20 px-2 py-0.5 text-[10px] font-bold text-amber-300 border border-amber-500/40">
                  Gemini Live
                </span>
              </div>
              <p className="text-xs text-slate-400">
                Hands-free voice queries for {site.title}
              </p>
            </div>
          </div>
          <button
            onClick={() => {
              tts.stop();
              onClose();
            }}
            className="rounded-xl p-2 text-slate-400 hover:bg-slate-800 hover:text-white transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Oversized HUD Response Card */}
        <div className="mt-5 space-y-4">
          {isThinking ? (
            <div className="rounded-2xl border border-slate-700 bg-slate-800/80 p-6 text-center space-y-3 animate-pulse">
              <div className="flex justify-center">
                <span className="h-10 w-10 rounded-full border-4 border-amber-500 border-t-transparent animate-spin" />
              </div>
              <p className="text-sm font-bold text-amber-300">
                Evaluating site risk assessment context & vehicle dimensions...
              </p>
            </div>
          ) : copilotResponse ? (
            <div className="rounded-2xl border-2 border-amber-500/40 bg-gradient-to-b from-slate-800 to-slate-850 p-5 shadow-xl space-y-3">
              <div className="flex items-center justify-between">
                <span className="rounded-lg bg-amber-500/20 px-2.5 py-1 text-xs font-black tracking-wider text-amber-300 border border-amber-500/40">
                  {copilotResponse.visualBadge}
                </span>

                {isSpeaking && (
                  <div className="flex items-center gap-1.5 text-xs text-emerald-400 font-bold bg-emerald-950/60 px-2.5 py-1 rounded-full border border-emerald-500/30 animate-pulse">
                    <Volume2 className="h-4 w-4" />
                    <span>Speaking in cab...</span>
                  </div>
                )}
              </div>

              {/* GIANT HUD METRIC */}
              <div className="text-center py-2">
                <div className="text-3xl sm:text-5xl font-black font-mono tracking-wider text-amber-400 drop-shadow-md">
                  {copilotResponse.highlightedValue}
                </div>
              </div>

              {/* Natural Spoken Answer */}
              <p className="text-sm sm:text-base font-medium text-slate-200 leading-relaxed bg-slate-900/60 p-3.5 rounded-xl border border-slate-700/60">
                "{copilotResponse.spokenResponse}"
              </p>

              {/* Caution / Warning if applicable */}
              {copilotResponse.cautionWarning && (
                <div className="flex items-center gap-2 rounded-xl bg-rose-950/70 border border-rose-600/60 p-3 text-xs text-rose-200">
                  <ShieldAlert className="h-4 w-4 text-rose-400 shrink-0" />
                  <span className="font-bold">{copilotResponse.cautionWarning}</span>
                </div>
              )}

              {/* Audio Controls */}
              <div className="flex items-center justify-between pt-1">
                <button
                  onClick={() => {
                    if (isSpeaking) {
                      tts.stop();
                    } else {
                      tts.speak(copilotResponse.spokenResponse, 1.05);
                    }
                  }}
                  className="flex items-center gap-1.5 text-xs font-bold text-slate-300 hover:text-white bg-slate-800 hover:bg-slate-700 px-3 py-1.5 rounded-xl border border-slate-700 transition-colors"
                >
                  {isSpeaking ? (
                    <>
                      <VolumeX className="h-3.5 w-3.5 text-rose-400" />
                      <span>Silence Voice</span>
                    </>
                  ) : (
                    <>
                      <Volume2 className="h-3.5 w-3.5 text-amber-400" />
                      <span>Replay Spoken Audio</span>
                    </>
                  )}
                </button>

                <span className="text-[11px] font-mono text-slate-400">
                  Vehicle: {activeVehicle.vehicleReg} ({formatHeightBoth(activeVehicle.heightMeters)} H)
                </span>
              </div>
            </div>
          ) : (
            <div className="rounded-2xl border border-slate-800 bg-slate-850 p-6 text-center text-slate-400 space-y-2">
              <Mic className="h-8 w-8 mx-auto text-amber-400/60" />
              <p className="text-sm">Tap the microphone below and speak, or tap a quick question.</p>
            </div>
          )}

          {/* Hands-Free Voice Control Button */}
          <div className="flex flex-col items-center justify-center py-2 space-y-3">
            <button
              onClick={toggleListening}
              className={`relative flex h-20 w-20 sm:h-24 sm:w-24 items-center justify-center rounded-full shadow-2xl transition-all active:scale-95 ${
                isListening
                  ? 'bg-rose-600 text-white ring-8 ring-rose-500/30 animate-pulse'
                  : 'bg-gradient-to-tr from-amber-500 to-amber-400 text-slate-950 hover:brightness-110 shadow-amber-500/30'
              }`}
              title={isListening ? 'Tap to finish speaking' : 'Tap to speak hands-free'}
            >
              {isListening ? (
                <MicOff className="h-9 w-9" />
              ) : (
                <Mic className="h-9 w-9" />
              )}
            </button>

            <div className="text-center">
              <span className="text-xs font-bold text-slate-300">
                {isListening ? 'Listening to voice... (Tap again to send)' : 'Tap Microphone to Speak Hands-Free'}
              </span>
              {transcript && (
                <p className="text-xs text-amber-300 font-mono mt-1 max-w-sm mx-auto truncate">
                  "{transcript}"
                </p>
              )}
            </div>
          </div>

          {/* Quick Query Chips (1-Tap Driver Presets) */}
          <div className="space-y-2 pt-2 border-t border-slate-800">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
              One-Tap Common In-Cab Questions
            </span>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              {quickPrompts.map((p) => (
                <button
                  key={p.label}
                  onClick={() => handleQuickQuery(p.query)}
                  className="rounded-xl border border-slate-800 bg-slate-800/80 hover:bg-slate-700 active:scale-98 p-2.5 text-left text-xs font-semibold text-slate-200 transition-all hover:border-amber-500/40"
                >
                  <span className="block text-[11px] font-bold text-amber-400">{p.label}</span>
                  <span className="text-[10px] text-slate-400 line-clamp-1">{p.query}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Switch to Dedicated In-Motion HUD */}
          {onOpenInMotionHud && (
            <div className="pt-2">
              <button
                onClick={() => {
                  tts.stop();
                  onClose();
                  onOpenInMotionHud();
                }}
                className="w-full flex items-center justify-center gap-2 rounded-2xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-black py-3 px-4 text-xs transition-all shadow-lg shadow-amber-500/20"
              >
                <span>Launch Full-Screen In-Motion HUD Mode</span>
                <ArrowRight className="h-4 w-4" />
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
