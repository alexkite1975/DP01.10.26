'use client';
import React, { useState, useRef } from 'react';
import { Mic, MicOff, Volume2, Sparkles } from 'lucide-react';
import { startSpeechRecognition, parseVoiceCommand, speak } from '../../services/routeOptimiserVoice';
import { VoiceAction } from '../../types/routeOptimiserTypes';

interface Props {
  onCommand: (action: VoiceAction, transcript: string) => void;
  disabled?: boolean;
}

type VoiceState = 'idle' | 'listening' | 'processing';

export const VoiceCoPilot: React.FC<Props> = ({ onCommand, disabled }) => {
  const [state, setState] = useState<VoiceState>('idle');
  const [lastTranscript, setLastTranscript] = useState('');
  const recognitionRef = useRef<any>(null);

  const startListening = () => {
    if (disabled || state === 'listening') return;

    setState('listening');
    recognitionRef.current = startSpeechRecognition(
      (transcript: string) => {
        setState('processing');
        setLastTranscript(transcript);
        const action = parseVoiceCommand(transcript);
        onCommand(action, transcript);
        setTimeout(() => setState('idle'), 1000);
      },
      () => {
        setState((current) => (current === 'listening' ? 'idle' : current));
      }
    );

    if (!recognitionRef.current) {
      // Browser doesn't support speech — simulate for cab demo
      setState('listening');
      setTimeout(() => {
        setState('idle');
        speak('Hands-free cab voice co-pilot ready. Speak commands like: clear route, avoid low bridges, or find next layby.');
      }, 1500);
    }
  };

  const stopListening = () => {
    recognitionRef.current?.stop();
    setState('idle');
  };

  const buttonColour =
    state === 'listening'
      ? 'bg-red-600 hover:bg-red-500 shadow-lg shadow-red-600/50 animate-pulse'
      : state === 'processing'
      ? 'bg-blue-600 text-white'
      : 'bg-slate-800 hover:bg-slate-700 text-slate-300';

  return (
    <div className="flex flex-col items-center gap-2 relative">
      <button
        onClick={state === 'listening' ? stopListening : startListening}
        disabled={disabled}
        className={`relative w-14 h-14 rounded-full flex items-center justify-center transition-all ${buttonColour} disabled:opacity-40 disabled:cursor-not-allowed border border-slate-700 cursor-pointer active:scale-95`}
        aria-label={state === 'listening' ? 'Stop listening' : 'Start Voice Co-Pilot'}
        title="Say: 'Clear route' · 'Avoid low bridges' · 'Find next layby' · 'What is my clearance?'"
      >
        {state === 'processing' ? (
          <Volume2 className="w-6 h-6 text-white animate-bounce" />
        ) : state === 'listening' ? (
          <MicOff className="w-6 h-6 text-white" />
        ) : (
          <Mic className="w-6 h-6 text-slate-300" />
        )}
      </button>

      <div className="text-center">
        <p className="text-xs font-bold text-slate-300 flex items-center justify-center gap-1">
          {state === 'listening' ? (
            <span className="text-red-400 font-mono">🔴 Listening in Cab...</span>
          ) : state === 'processing' ? (
            <span className="text-blue-400 font-mono">⚡ Processing Command...</span>
          ) : (
            <>
              <Sparkles className="w-3.5 h-3.5 text-amber-400" />
              <span>Hands-Free Voice Co-Pilot</span>
            </>
          )}
        </p>
        {lastTranscript && state === 'idle' ? (
          <p className="text-[11px] text-slate-400 italic truncate max-w-44 mt-0.5">
            "{lastTranscript}"
          </p>
        ) : (
          <p className="text-[10px] text-slate-500">Tap mic or speak wake command</p>
        )}
      </div>

      {/* Cab Command Hints Popup */}
      {state === 'listening' && (
        <div className="absolute bottom-20 left-1/2 -translate-x-1/2 bg-slate-900 border border-slate-700 rounded-xl p-3 shadow-2xl text-xs text-slate-200 space-y-1.5 min-w-56 z-40 backdrop-blur-md">
          <p className="font-bold text-amber-400 text-[11px] uppercase tracking-wider mb-1">
            Cab Voice Commands:
          </p>
          <p className="flex items-center gap-1.5 text-slate-300">
            <span>🗺️</span> <span>"Clear route"</span>
          </p>
          <p className="flex items-center gap-1.5 text-slate-300">
            <span>🌉</span> <span>"Avoid low bridges"</span>
          </p>
          <p className="flex items-center gap-1.5 text-slate-300">
            <span>🅿️</span> <span>"Find next layby"</span>
          </p>
          <p className="flex items-center gap-1.5 text-slate-300">
            <span>📐</span> <span>"What's my clearance?"</span>
          </p>
        </div>
      )}
    </div>
  );
};
