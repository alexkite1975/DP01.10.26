/**
 * Text-to-Speech service for hands-free driver safety
 */
class TTSService {
  private synth: SpeechSynthesis | null = null;
  private currentUtterance: SpeechSynthesisUtterance | null = null;
  private isSpeakingState = false;
  private onStateChangeListeners: Array<(speaking: boolean) => void> = [];

  constructor() {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      this.synth = window.speechSynthesis;
    }
  }

  public isAvailable(): boolean {
    return this.synth !== null;
  }

  public subscribe(listener: (speaking: boolean) => void): () => void {
    this.onStateChangeListeners.push(listener);
    listener(this.isSpeakingState);
    return () => {
      this.onStateChangeListeners = this.onStateChangeListeners.filter(l => l !== listener);
    };
  }

  private notifyListeners(speaking: boolean) {
    this.isSpeakingState = speaking;
    this.onStateChangeListeners.forEach(l => l(speaking));
  }

  public speak(text: string, rate = 1.0, pitch = 1.0): Promise<void> {
    return new Promise((resolve) => {
      if (!this.synth) {
        console.warn('SpeechSynthesis is not supported in this browser.');
        resolve();
        return;
      }

      this.stop();

      const utterance = new SpeechSynthesisUtterance(text);
      this.currentUtterance = utterance;
      utterance.rate = rate;
      utterance.pitch = pitch;

      // Select a clean English voice if available
      const voices = this.synth.getVoices();
      const preferredVoice =
        voices.find(v => (v.lang === 'en-GB' || v.lang === 'en-US') && (v.name.includes('Natural') || v.name.includes('Google') || v.name.includes('Samantha'))) ||
        voices.find(v => v.lang.startsWith('en'));
      if (preferredVoice) {
        utterance.voice = preferredVoice;
      }

      utterance.onstart = () => {
        this.notifyListeners(true);
      };

      utterance.onend = () => {
        this.notifyListeners(false);
        this.currentUtterance = null;
        resolve();
      };

      utterance.onerror = (e) => {
        console.warn('TTS error:', e);
        this.notifyListeners(false);
        this.currentUtterance = null;
        resolve();
      };

      this.synth.speak(utterance);
    });
  }

  public stop() {
    if (this.synth) {
      this.synth.cancel();
      this.currentUtterance = null;
      this.notifyListeners(false);
    }
  }

  public isSpeaking(): boolean {
    return this.isSpeakingState;
  }
}

export const tts = new TTSService();
