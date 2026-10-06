'use client';
import React, { useState, useRef, useEffect } from 'react';
import {
  X,
  Radio,
  Volume2,
  VolumeX,
  Mic,
  AlertTriangle,
  Send,
  ShieldAlert,
  Sliders,
  Activity
} from 'lucide-react';
import { DigitalCbMessage } from '../types';
import { tts } from '../services/ttsService';

interface DigitalCbRadioModalProps {
  isOpen: boolean;
  onClose: () => void;
  driverName: string;
  driverReg: string;
}

const CHANNELS = [
  { number: 19, label: 'CH 19 - Highway Truckers (Main Calling)', desc: 'General UK HGV motorway calling channel' },
  { number: 9, label: 'CH 09 - Emergency SOS & Breakdown', desc: 'Reserved for live lane breakdowns & bridge strikes' },
  { number: 14, label: 'CH 14 - Yard & Depot Shunters', desc: 'Internal depot maneuvering & bay handoffs' },
  { number: 27, label: 'CH 27 - Midlands Freight Corridor', desc: 'M1 / M6 / A14 cross-country traffic alerts' }
];

const INITIAL_MESSAGES: DigitalCbMessage[] = [
  {
    id: 'cb-1',
    senderName: 'Big Scania 500',
    callsign: 'Kev H.',
    vehicleReg: 'GN21 JKM',
    channel: 19,
    distanceMiles: 1.8,
    message: 'Heads up south on M1 J18, queue forming fast for the roadworks slip. Bear left early.',
    isEmergency: false,
    timestamp: '3 mins ago'
  },
  {
    id: 'cb-2',
    senderName: 'Red DAF Logistics',
    callsign: 'Stefan R.',
    vehicleReg: 'LP23 XDF',
    channel: 19,
    distanceMiles: 3.4,
    message: 'Anyone heading into Magna Park? Gate 2 has three trucks stacked out on the roundabout.',
    isEmergency: false,
    timestamp: '9 mins ago'
  },
  {
    id: 'cb-3',
    senderName: 'Severnside Shunter',
    callsign: 'Marcus Vance',
    vehicleReg: 'WP70 LLZ',
    channel: 9,
    distanceMiles: 0.9,
    message: 'ROAD BLOCKED: Broken down curtain-sider on railway bridge approach. Avoid St Johns Rd!',
    isEmergency: true,
    timestamp: '15 mins ago'
  }
];

// Helper to synthesize realistic analog CB radio RF squelch bursts and roger beeps
class CBSoundSynthesizer {
  private ctx: AudioContext | null = null;

  private getContext(): AudioContext {
    if (!this.ctx) {
      this.ctx = new (window.AudioContext || (window as any).webkitAudioContext)();
    }
    if (this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
    return this.ctx;
  }

  // Authentic white noise RF squelch pop
  playSquelchBurst(durationSec = 0.08, volume = 0.25) {
    try {
      const ctx = this.getContext();
      const bufferSize = ctx.sampleRate * durationSec;
      const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
      const data = buffer.getChannelData(0);
      for (let i = 0; i < bufferSize; i++) {
        data[i] = Math.random() * 2 - 1;
      }

      const noise = ctx.createBufferSource();
      noise.buffer = buffer;

      // Bandpass filter to simulate 27MHz AM radio RF receiver audio curve
      const filter = ctx.createBiquadFilter();
      filter.type = 'bandpass';
      filter.frequency.value = 1800;
      filter.Q.value = 1.2;

      const gain = ctx.createGain();
      gain.gain.setValueAtTime(volume, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + durationSec);

      noise.connect(filter);
      filter.connect(gain);
      gain.connect(ctx.destination);

      noise.start();
    } catch (e) {
      // Audio context might be restricted before interaction
    }
  }

  // Classic UK/US trucker dual-tone Roger Beep
  playRogerBeep() {
    try {
      const ctx = this.getContext();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(1050, ctx.currentTime);
      osc.frequency.setValueAtTime(1250, ctx.currentTime + 0.06);

      gain.gain.setValueAtTime(0.2, ctx.currentTime);
      gain.gain.setValueAtTime(0.2, ctx.currentTime + 0.12);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.16);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start();
      osc.stop(ctx.currentTime + 0.16);
    } catch (e) {}
  }
}

const cbAudio = new CBSoundSynthesizer();

export const DigitalCbRadioModal: React.FC<DigitalCbRadioModalProps> = ({
  isOpen,
  onClose,
  driverName,
  driverReg
}) => {
  const [activeChannel, setActiveChannel] = useState(19);
  const [messages, setMessages] = useState<DigitalCbMessage[]>(INITIAL_MESSAGES);
  const [squelchLevel, setSquelchLevel] = useState(3);
  const [isMuted, setIsMuted] = useState(false);
  const [isTransmitting, setIsTransmitting] = useState(false);
  const [newMessageText, setNewMessageText] = useState('');
  const [showSosModal, setShowSosModal] = useState(false);
  const [rfMeter, setRfMeter] = useState([4, 6, 8, 7, 5, 9, 3]);

  // Audio RF spectrum simulation effect
  useEffect(() => {
    if (!isOpen) return;
    const timer = setInterval(() => {
      setRfMeter([
        Math.floor(Math.random() * 8) + 2,
        Math.floor(Math.random() * 9) + 1,
        Math.floor(Math.random() * 10) + 1,
        Math.floor(Math.random() * 8) + 3,
        Math.floor(Math.random() * 7) + 2,
        Math.floor(Math.random() * 9) + 2,
        Math.floor(Math.random() * 6) + 1,
      ]);
    }, 120);
    return () => clearInterval(timer);
  }, [isOpen]);

  if (!isOpen) return null;

  const currentChannelMessages = messages.filter((m) => m.channel === activeChannel);

  const handleTransmit = (isEmergency = false, customText?: string) => {
    const textToSend = customText || newMessageText.trim();
    if (!textToSend) return;

    if (!isMuted) {
      cbAudio.playSquelchBurst(0.09, 0.3); // Key-down RF click
    }
    setIsTransmitting(true);

    setTimeout(() => {
      const msg: DigitalCbMessage = {
        id: 'cb-' + Date.now(),
        senderName: driverName,
        callsign: driverName.split(' ')[0] + ' (' + driverReg + ')',
        vehicleReg: driverReg,
        channel: activeChannel,
        distanceMiles: 0.1,
        message: textToSend,
        isEmergency,
        timestamp: 'Just now'
      };

      setMessages((prev) => [msg, ...prev]);
      setNewMessageText('');
      setIsTransmitting(false);
      setShowSosModal(false);

      if (!isMuted) {
        // Play Roger Beep + Closing squelch burst
        cbAudio.playRogerBeep();
        setTimeout(() => cbAudio.playSquelchBurst(0.07, 0.2), 180);
        tts.speak('Transmitted on Channel ' + activeChannel + ': ' + textToSend, 1.1);
      }
    }, 450);
  };

  const handlePlayAudio = (text: string) => {
    if (!isMuted) {
      cbAudio.playSquelchBurst(0.06, 0.2);
    }
    tts.speak(text, 1.05);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur-md p-3 sm:p-4 overflow-y-auto animate-in fade-in duration-200">
      <div className="relative w-full max-w-2xl rounded-3xl bg-slate-950 border-2 border-slate-800 text-white shadow-2xl overflow-hidden flex flex-col max-h-[94vh]">
        
        {/* Retro-Futuristic CB Faceplate Header */}
        <div className="p-4 bg-gradient-to-r from-slate-900 via-slate-950 to-slate-900 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-2xl bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-amber-400">
              <Radio className="h-5 w-5 animate-pulse" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-black tracking-widest text-amber-400 uppercase font-mono">
                  DIGITAL CB 27MHz // 4G SQUELCH
                </span>
                <span className="text-[10px] rounded bg-amber-500/20 px-1.5 py-0.5 font-mono text-amber-300 border border-amber-500/40 flex items-center gap-1">
                  <Sliders className="w-2.5 h-2.5" />
                  SQL {squelchLevel}
                </span>
              </div>
              <div className="flex items-center gap-2 mt-0.5">
                <h3 className="text-sm font-bold text-slate-100">In-Cab Relief Drivers Emergency Radio</h3>
                
                {/* Visual RF S-Meter Bars */}
                <div className="hidden sm:flex items-end gap-0.5 h-3">
                  {rfMeter.map((val, idx) => (
                    <div
                      key={idx}
                      className={`w-1 rounded-sm transition-all ${
                        idx >= 5 ? 'bg-red-400' : idx >= 3 ? 'bg-amber-400' : 'bg-emerald-400'
                      }`}
                      style={{ height: `${val * 10}%` }}
                    />
                  ))}
                </div>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => {
                cbAudio.playSquelchBurst(0.05, 0.15);
                setSquelchLevel(s => (s % 5) + 1);
              }}
              className="px-2 py-1 rounded-lg bg-slate-800/80 hover:bg-slate-700 text-amber-300 text-[10px] font-mono border border-slate-700 transition-colors"
              title="Cycle RF squelch gate"
            >
              SQL: {squelchLevel}
            </button>
            <button
              onClick={() => setIsMuted(!isMuted)}
              className="p-2 rounded-xl bg-slate-800 text-slate-300 hover:text-white transition-colors"
            >
              {isMuted ? <VolumeX className="h-4 w-4" /> : <Volume2 className="h-4 w-4 text-amber-400" />}
            </button>
            <button
              onClick={onClose}
              className="p-2 rounded-xl text-slate-400 hover:bg-slate-800 hover:text-white transition-colors"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
        </div>

        {/* Channel Selector Screen Bar */}
        <div className="px-4 py-3 bg-black/80 border-b border-slate-800/80 flex items-center justify-between gap-2 overflow-x-auto">
          <div className="flex items-center gap-2">
            {CHANNELS.map((ch) => (
              <button
                key={ch.number}
                onClick={() => {
                  if (!isMuted) cbAudio.playSquelchBurst(0.04, 0.15);
                  setActiveChannel(ch.number);
                }}
                className={'px-3 py-1.5 rounded-xl text-xs font-black transition-all font-mono ' + (
                  activeChannel === ch.number
                    ? ch.number === 9
                      ? 'bg-rose-600 text-white shadow-lg shadow-rose-600/30 ring-2 ring-rose-400'
                      : 'bg-amber-400 text-slate-950 shadow-lg shadow-amber-400/20'
                    : 'bg-slate-900 text-slate-400 hover:bg-slate-800 border border-slate-800'
                )}
              >
                CH {ch.number < 10 ? '0' + ch.number : ch.number}
              </button>
            ))}
          </div>

          <button
            onClick={() => setShowSosModal(true)}
            className="px-3 py-1.5 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-black text-xs shadow-lg shadow-rose-600/30 flex items-center gap-1.5 transition-transform active:scale-95 shrink-0"
          >
            <ShieldAlert className="h-4 w-4 animate-bounce" />
            <span>SOS BROADCAST</span>
          </button>
        </div>

        {/* Live Channel Transmissions Stream */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-[#080d16]">
          {currentChannelMessages.length === 0 ? (
            <div className="text-center py-10 text-slate-500 text-xs space-y-2">
              <Radio className="h-8 w-8 mx-auto opacity-40 animate-pulse" />
              <p>Channel is clear. RF Squelch filter active within 5-mile radius.</p>
            </div>
          ) : (
            currentChannelMessages.map((msg) => (
              <div
                key={msg.id}
                className={'rounded-2xl p-3.5 border transition-all space-y-2 ' + (
                  msg.isEmergency
                    ? 'bg-rose-950/40 border-rose-500/80 text-rose-100 shadow-lg shadow-rose-950/50 animate-pulse'
                    : 'bg-slate-900/90 border-slate-800 text-slate-200'
                )}
              >
                <div className="flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2">
                    <span
                      className={'h-2 w-2 rounded-full ' + (
                        msg.isEmergency ? 'bg-rose-400' : 'bg-emerald-400'
                      )}
                    />
                    <strong className="text-white font-bold">{msg.callsign}</strong>
                    <span className="text-[10px] text-slate-400 font-mono">
                      {msg.distanceMiles}m away
                    </span>
                  </div>

                  <div className="flex items-center gap-2">
                    <span className="text-[10px] text-slate-400">{msg.timestamp}</span>
                    <button
                      onClick={() => handlePlayAudio(msg.message)}
                      className="p-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-300"
                      title="Read aloud in cab with squelch"
                    >
                      <Volume2 className="h-3.5 w-3.5" />
                    </button>
                  </div>
                </div>

                <p className="text-xs text-slate-100 leading-relaxed font-medium">
                  {msg.message}
                </p>
              </div>
            ))
          )}
        </div>

        {/* Bottom PTT Microphone Transmit Deck */}
        <div className="p-4 bg-slate-950 border-t border-slate-800 space-y-3">
          <div className="flex items-center gap-2">
            <input
              type="text"
              value={newMessageText}
              onChange={(e) => setNewMessageText(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') handleTransmit(false);
              }}
              placeholder={'Broadcast to drivers on CH ' + activeChannel + '...'}
              className="flex-1 bg-slate-900 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-slate-200 placeholder:text-slate-500 focus:outline-none focus:border-amber-400 transition-colors"
            />
            <button
              onClick={() => handleTransmit(false)}
              disabled={!newMessageText.trim() || isTransmitting}
              className={`px-4 py-2.5 rounded-xl font-black text-xs shadow-md flex items-center gap-1.5 transition-all active:scale-95 disabled:opacity-40 ${
                isTransmitting 
                  ? 'bg-red-500 text-white animate-pulse' 
                  : 'bg-amber-500 hover:bg-amber-400 text-slate-950 shadow-amber-500/20'
              }`}
            >
              <Mic className={`h-4 w-4 ${isTransmitting ? 'animate-bounce text-white' : ''}`} />
              <span>{isTransmitting ? 'TX ON AIR' : 'PTT Transmit'}</span>
            </button>
          </div>

          <div className="flex items-center justify-between text-[11px] text-slate-400 font-mono">
            <span className="flex items-center gap-1.5">
              <Activity className="w-3 h-3 text-emerald-400" />
              Range: 5.0 miles (LoRa / 4G Bridge)
            </span>
            <span>RF Squelch & Roger Beep: Enabled</span>
          </div>
        </div>

        {/* SOS Emergency Broadcast Modal Dialog */}
        {showSosModal && (
          <div className="absolute inset-0 z-20 bg-black/90 p-5 flex flex-col justify-center items-center text-center space-y-4 animate-in zoom-in-95">
            <div className="h-16 w-16 rounded-full bg-rose-600/20 border-2 border-rose-500 text-rose-400 flex items-center justify-center animate-bounce">
              <AlertTriangle className="h-8 w-8" />
            </div>

            <div className="space-y-1 max-w-sm">
              <h4 className="text-base font-black text-rose-400 tracking-wide uppercase">
                Broadcast Emergency SOS Alert
              </h4>
              <p className="text-xs text-slate-300">
                This will alert all relief drivers and depot dispatchers within a 5-mile radius and lock to Channel 09.
              </p>
            </div>

            <div className="grid grid-cols-1 gap-2 w-full max-w-sm">
              {[
                'BRIDGE STRIKE / LOW CLEARANCE INCIDENT',
                'LIVE LANE VEHICLE BREAKDOWN / OBSTRUCTION',
                'ROAD CLOSURE / IMMEDIATE DIVERSION NEEDED',
                'DIESEL SPILL / SEVERE SKID HAZARD'
              ].map((preset, idx) => (
                <button
                  key={idx}
                  onClick={() => handleTransmit(true, preset)}
                  className="w-full py-2.5 px-3 rounded-xl bg-rose-600 hover:bg-rose-500 text-white text-xs font-black text-left flex items-center justify-between shadow-lg shadow-rose-600/30 transition-all active:scale-98"
                >
                  <span>{preset}</span>
                  <Send className="h-3.5 w-3.5" />
                </button>
              ))}
            </div>

            <button
              onClick={() => setShowSosModal(false)}
              className="text-xs text-slate-400 hover:text-white pt-2"
            >
              Cancel SOS
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
