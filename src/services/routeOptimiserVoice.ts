import { VoiceAction } from '../types/routeOptimiserTypes';

// ─── Voice command parser ─────────────────────────────────────────────────────
// Offline-capable: pure string matching against natural cab driver speech patterns.

const CLEAR_PATTERNS  = /\b(clear|cancel|wipe|stop|drop|discard)\b.*\b(route|nav|navigation|journey)\b|\b(clear|cancel|wipe)\b\s+(the\s+)?route/i;
const BRIDGE_PATTERNS = /\b(avoid|safest|safe|no|without)\b.*\b(low.?bridge|bridge|height|hazard)\b|\b(low.?bridge|clearance)\b.*\b(route|avoid)\b/i;
const LAYBY_PATTERNS  = /\b(find|next|nearest|where.?is|open)\b.*\b(layby|lay.?by|truck.?stop|lorry.?park|parking|rest.?stop)\b/i;
const CLEAR_Q_PATTERNS = /\b(what.?s|any|check|read|tell.?me)\b.*\b(clearance|low.?bridge|restriction|height)\b|\bhow\s+(high|tall|wide)\b/i;

export function parseVoiceCommand(transcript: string): VoiceAction {
  if (CLEAR_PATTERNS.test(transcript))   return 'CLEAR_ROUTE';
  if (BRIDGE_PATTERNS.test(transcript))  return 'AVOID_LOW_BRIDGES';
  if (LAYBY_PATTERNS.test(transcript))   return 'FIND_NEXT_LAYBY';
  if (CLEAR_Q_PATTERNS.test(transcript)) return 'WHAT_IS_CLEARANCE';
  return 'UNKNOWN';
}

// ─── Web Speech API helper ────────────────────────────────────────────────────
export function startSpeechRecognition(
  onResult: (transcript: string) => void,
  onEnd: () => void
): any {
  if (typeof window === 'undefined') return null;

  const SpeechRecognition =
    (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;

  if (!SpeechRecognition) return null;

  try {
    const recognition = new SpeechRecognition();
    recognition.continuous    = false;
    recognition.interimResults = false;
    recognition.lang           = 'en-GB';
    recognition.maxAlternatives = 1;

    recognition.onresult = (event: any) => {
      if (event.results && event.results[0] && event.results[0][0]) {
        const transcript = event.results[0][0].transcript;
        onResult(transcript);
      }
    };

    recognition.onerror = (e: any) => {
      console.warn('Speech recognition error in cab:', e);
      onEnd();
    };

    recognition.onend = onEnd;
    recognition.start();
    return recognition;
  } catch (err) {
    console.warn('Failed starting SpeechRecognition:', err);
    return null;
  }
}

import { tts } from './ttsService';

// ─── Text-to-speech helper (unified with platform ttsService) ─────────────────
export function speak(text: string) {
  tts.speak(text, 0.95);
}
