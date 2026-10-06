import os

# 1. Ensure components directory exists
os.makedirs("src/components", exist_ok=True)

# 2. Create ClaraVoiceAssistant.tsx
clara_code = ''''use client';

import React, { useState, useEffect, useRef } from 'react';
import { Mic, MicOff, Volume2, Sparkles, MessageSquare, ChevronUp, ChevronDown } from 'lucide-react';

interface ClaraVoiceProps {
  vehicleReg: string;
  trailerId: string;
  trailerHeight: string;
  walkaroundStep: number;
  currentCheckTitle: string;
  currentCheckInstruction: string;
  onNextCheck?: () => void;
  ambientDb?: number;
}

export default function ClaraVoiceAssistant({
  vehicleReg,
  trailerId,
  trailerHeight,
  walkaroundStep,
  currentCheckTitle,
  currentCheckInstruction,
  onNextCheck,
  ambientDb = 44
}: ClaraVoiceProps) {
  const [isListening, setIsListening] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [claraReply, setClaraReply] = useState('Hello Alex. I am Clara, your in-cab voice copilot. Tap the microphone or ask me anything hands-free.');
  const [isExpanded, setIsExpanded] = useState(false);
  const [voices, setVoices] = useState<SpeechSynthesisVoice[]>([]);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const recognitionRef = useRef<any>(null);

  // Load browser voices & pick British English Female
  useEffect(() => {
    const updateVoices = () => {
      if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
        setVoices(window.speechSynthesis.getVoices());
      }
    };
    updateVoices();
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      window.speechSynthesis.onvoiceschanged = updateVoices;
    }
  }, []);

  const getBritishFemaleVoice = (): SpeechSynthesisVoice | null => {
    // 1. Prioritize British Female voices
    const ukFemale = voices.find(v => 
      (v.lang.startsWith('en-GB') || v.lang === 'en_GB') && 
      (v.name.includes('Female') || v.name.includes('Sonia') || v.name.includes('Libby') || 
       v.name.includes('Serena') || v.name.includes('Victoria') || v.name.includes('Martha') ||
       v.name.includes('Google UK English Female') || v.name.includes('Hazel') || v.name.includes('Susan'))
    );
    if (ukFemale) return ukFemale;

    // 2. Fallback to any en-GB voice
    const anyUk = voices.find(v => v.lang.startsWith('en-GB') || v.lang === 'en_GB');
    if (anyUk) return anyUk;

    return null;
  };

  const speak = (text: string) => {
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) return;
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    const voice = getBritishFemaleVoice();
    if (voice) utterance.voice = voice;
    utterance.lang = 'en-GB';
    utterance.rate = 0.88; // Polite, crystal-clear British cadence
    utterance.pitch = 1.05;

    setIsSpeaking(true);
    utterance.onend = () => setIsSpeaking(false);
    utterance.onerror = () => setIsSpeaking(false);
    window.speechSynthesis.speak(utterance);
    setClaraReply(text);
  };

  // Conversational response engine
  const processCommand = (query: string) => {
    const q = query.toLowerCase();

    if (q.includes('bridge') || q.includes('clearance') || q.includes('height')) {
      speak(`Warning Alex: The upcoming low bridge has 4.10 metres clearance. Your Schmitz trailer is ${trailerHeight}. This is a critical collision hazard. Stop immediately or dump your air suspension.`);
    } else if (q.includes('demurrage') || q.includes('waiting') || q.includes('detention') || q.includes('timer')) {
      speak('Free time at DIRFT expired 14 minutes ago. Accrued demurrage is currently £10.50 running at £45 per hour on your RHA contract.');
    } else if (q.includes('gate') || q.includes('pin') || q.includes('code') || q.includes('bay') || q.includes('access')) {
      speak('The gatehouse ingress PIN for DIRFT Bay 24 is 8492. Ingress turn is left-side blindside.');
    } else if (q.includes('sleep') || q.includes('rest') || q.includes('noise') || q.includes('quiet')) {
      if (ambientDb > 55) {
        speak(`Ambient cab noise is high at ${ambientDb} decibels. A noisy refrigeration unit may be nearby. Consider relocating before starting your 11-hour rest.`);
      } else {
        speak(`Ambient cab noise is peaceful at ${ambientDb} decibels. No noisy diesel reefers detected. You are safe for your 11-hour statutory rest.`);
      }
    } else if (q.includes('next') || q.includes('check') || q.includes('inspection') || q.includes('walkaround')) {
      if (onNextCheck) onNextCheck();
      speak(`DVSA Step ${walkaroundStep}: ${currentCheckTitle}. ${currentCheckInstruction}`);
    } else if (q.includes('trailer') || q.includes('rig')) {
      speak(`You are coupled to trailer ${trailerId}. Running height is locked at ${trailerHeight}. MOT and 6-weekly safety inspections are active.`);
    } else if (q.includes('hello') || q.includes('clara') || q.includes('hi')) {
      speak(`Good morning Alex! All systems are green on tractor ${vehicleReg}. How can I assist your route today?`);
    } else {
      speak(`I heard you say: "${query}". You can ask me about the low bridge, demurrage timer, gate PIN, walkaround checks, or sleep noise.`);
    }
  };

  // Toggle Hands-Free Microphone
  const toggleListening = () => {
    if (isListening) {
      if (recognitionRef.current) recognitionRef.current.stop();
      setIsListening(false);
      return;
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SpeechRecognition) {
      alert('Speech recognition is not supported in this browser. You can click the quick prompt buttons below to speak with Clara.');
      return;
    }

    try {
      const recognition = new SpeechRecognition();
      recognition.lang = 'en-GB';
      recognition.continuous = false;
      recognition.interimResults = false;

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      recognition.onresult = (event: any) => {
        const text = event.results[0][0].transcript;
        setTranscript(text);
        processCommand(text);
      };

      recognition.onerror = () => {
        setIsListening(false);
      };

      recognition.onend = () => {
        setIsListening(false);
      };

      recognitionRef.current = recognition;
      recognition.start();
      setIsListening(true);
    } catch {
      setIsListening(false);
    }
  };

  return (
    <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 border border-indigo-500/40 rounded-3xl p-4 shadow-xl shadow-indigo-500/10 transition-all">
      {/* Header bar */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className={`relative w-9 h-9 rounded-2xl flex items-center justify-center font-bold text-xs transition ${isSpeaking ? 'bg-pink-500 text-white animate-bounce' : isListening ? 'bg-red-500 text-white animate-pulse' : 'bg-indigo-600 text-white'}`}>
            <Sparkles className="w-5 h-5" />
            {(isSpeaking || isListening) && (
              <span className="absolute -top-1 -right-1 w-3 h-3 bg-cyan-400 rounded-full animate-ping" />
            )}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-sm font-black text-white tracking-wide">CLARA</h3>
              <span className="text-[10px] font-mono font-bold bg-indigo-500/30 text-indigo-300 border border-indigo-500/50 px-2 py-0.5 rounded-full">
                British Female AI Copilot
              </span>
            </div>
            <p className="text-[11px] text-slate-400 font-medium">
              {isSpeaking ? 'Speaking in clear en-GB voice...' : isListening ? 'Listening for your voice in cab...' : 'Hands-free cab assistant ready'}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={toggleListening}
            className={`px-3 py-1.5 rounded-xl text-xs font-mono font-bold transition flex items-center gap-1.5 ${isListening ? 'bg-red-500 text-white animate-pulse' : 'bg-indigo-600 hover:bg-indigo-500 text-white'}`}
          >
            {isListening ? <MicOff className="w-3.5 h-3.5" /> : <Mic className="w-3.5 h-3.5" />}
            {isListening ? 'Listening...' : 'Talk to Clara'}
          </button>
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="p-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl transition"
          >
            {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
          </button>
        </div>
      </div>

      {/* Reply Speech Bubble */}
      <div className="mt-3 p-3 bg-slate-950/80 rounded-2xl border border-slate-800 flex items-start gap-3">
        <Volume2 className={`w-4 h-4 mt-0.5 shrink-0 ${isSpeaking ? 'text-pink-400 animate-pulse' : 'text-indigo-400'}`} />
        <div className="space-y-1">
          {transcript && (
            <p className="text-[11px] font-mono text-slate-400">
              You asked: <span className="text-white italic">"{transcript}"</span>
            </p>
          )}
          <p className="text-xs text-indigo-100 font-medium leading-relaxed">
            {claraReply}
          </p>
        </div>
      </div>

      {/* Expanded Quick Action Pills */}
      {isExpanded && (
        <div className="mt-3 pt-3 border-t border-slate-800/80 space-y-2">
          <p className="text-[10px] font-mono font-bold uppercase text-slate-400 flex items-center gap-1">
            <MessageSquare className="w-3 h-3" /> Quick Driving Prompts (Click to Test Voice)
          </p>
          <div className="flex flex-wrap gap-1.5">
            <button
              onClick={() => processCommand('Check low bridge clearance')}
              className="px-2.5 py-1 bg-slate-800 hover:bg-indigo-900/60 text-slate-200 text-[11px] rounded-lg border border-slate-700 transition"
            >
              ⚠️ Low Bridge Hazard?
            </button>
            <button
              onClick={() => processCommand('What is my demurrage status?')}
              className="px-2.5 py-1 bg-slate-800 hover:bg-indigo-900/60 text-slate-200 text-[11px] rounded-lg border border-slate-700 transition"
            >
              ⏱️ Demurrage Clock?
            </button>
            <button
              onClick={() => processCommand('What is the gate PIN?')}
              className="px-2.5 py-1 bg-slate-800 hover:bg-indigo-900/60 text-slate-200 text-[11px] rounded-lg border border-slate-700 transition"
            >
              🔑 Gatehouse PIN?
            </button>
            <button
              onClick={() => processCommand('Is it quiet enough to sleep?')}
              className="px-2.5 py-1 bg-slate-800 hover:bg-indigo-900/60 text-slate-200 text-[11px] rounded-lg border border-slate-700 transition"
            >
              😴 Quiet Sleep Check?
            </button>
            <button
              onClick={() => processCommand('Next walkaround check')}
              className="px-2.5 py-1 bg-slate-800 hover:bg-indigo-900/60 text-slate-200 text-[11px] rounded-lg border border-slate-700 transition"
            >
              📋 Read Walkaround Item
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
'''

with open("src/components/ClaraVoiceAssistant.tsx", "w") as f:
    f.write(clara_code)

print("✓ Created src/components/ClaraVoiceAssistant.tsx successfully!")

# 3. Mount Clara into src/app/driver/page.tsx
with open("src/app/driver/page.tsx", "r") as f:
    driver_code = f.read()

# Add import if missing
if "ClaraVoiceAssistant" not in driver_code:
    import_stmt = "import ClaraVoiceAssistant from '@/components/ClaraVoiceAssistant';\n"
    driver_code = import_stmt + driver_code

# Place Clara right above the navigation tabs
target_marker = '      {/* In-Cab Workflow Navigation Tabs */}'
clara_mount = '''      {/* Clara: British English Female In-Cab Voice Assistant */}
      <ClaraVoiceAssistant
        vehicleReg={vehicleReg}
        trailerId={selectedTrailer === 'CUSTOM' ? customTrailer : selectedTrailer}
        trailerHeight={fleetTrailers.find(t => t.id === selectedTrailer)?.height || '4.45m'}
        walkaroundStep={walkaroundStep}
        currentCheckTitle={currentItem.title}
        currentCheckInstruction={currentItem.instruction}
        onNextCheck={() => {
          if (walkaroundStep < dvsaChecklist.length) {
            setWalkaroundStep(walkaroundStep + 1);
          }
        }}
        ambientDb={liveDb}
      />

      {/* In-Cab Workflow Navigation Tabs */}'''

if target_marker in driver_code:
    driver_code = driver_code.replace(target_marker, clara_mount)

with open("src/app/driver/page.tsx", "w") as f:
    f.write(driver_code)

print("✓ Successfully integrated Clara into Driver In-Cab OS!")
