import re

with open("src/app/driver/page.tsx", "r") as f:
    code = f.read()

# 1. Ensure VolumeX and RotateCcw are in lucide-react imports
if "VolumeX" not in code:
    code = re.sub(
        r'from\s+[\'"]lucide-react[\'"]',
        ', VolumeX, RotateCcw } from \'lucide-react\'',
        code,
        count=1
    )

# 2. Add Voice Guidance Preference state (Default: ON) and Auto-Narration Effect
state_anchor = "  const [defectsLogged, setDefectsLogged] = useState(0);"
voice_state = '''  const [defectsLogged, setDefectsLogged] = useState(0);

  // Statutory Voice Guidance Preference (Default: ON, persisted in Account Settings)
  const [voiceGuidance, setVoiceGuidance] = useState<boolean>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('dp_voice_guidance_pref');
      return saved !== null ? saved === 'true' : true; // DEFAULT: ON
    }
    return true;
  });

  const toggleVoiceGuidance = () => {
    const nextState = !voiceGuidance;
    setVoiceGuidance(nextState);
    if (typeof window !== 'undefined') {
      localStorage.setItem('dp_voice_guidance_pref', String(nextState));
    }
    if (!nextState && typeof window !== 'undefined' && 'speechSynthesis' in window) {
      window.speechSynthesis.cancel();
    }
  };

  // British English Female Voice Speech Engine
  const speakBritishClara = (text: string) => {
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) return;
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    const voices = window.speechSynthesis.getVoices();
    const ukFemale = voices.find(v => 
      (v.lang.startsWith('en-GB') || v.lang === 'en_GB') && 
      (v.name.includes('Female') || v.name.includes('Sonia') || v.name.includes('Libby') || 
       v.name.includes('Serena') || v.name.includes('Victoria') || v.name.includes('Martha') ||
       v.name.includes('Google UK English Female') || v.name.includes('Hazel') || v.name.includes('Susan'))
    ) || voices.find(v => v.lang.startsWith('en-GB') || v.lang === 'en_GB');

    if (ukFemale) utterance.voice = ukFemale;
    utterance.lang = 'en-GB';
    utterance.rate = 0.88;
    utterance.pitch = 1.05;
    window.speechSynthesis.speak(utterance);
  };

  // Auto-speak statutory check whenever step advances if Voice Guidance is ON
  useEffect(() => {
    if (checkStarted && !isCheckComplete && voiceGuidance) {
      const current = dvsaChecklist[walkaroundStep - 1];
      if (current) {
        speakBritishClara(`Step ${current.id}: ${current.title}. ${current.instruction}`);
      }
    }
  }, [walkaroundStep, checkStarted, isCheckComplete, voiceGuidance]);'''

code = code.replace(state_anchor, voice_state)

# 3. Replace the Listen button with the Auto-Listen ON (Default) toggle & Replay pill
old_listen_btn = re.search(r'<button\s+onClick=\{\(\)\s*=>\s*speakText[^>]+>.*?<\/button>', code, re.DOTALL)
if old_listen_btn:
    new_listen_controls = '''<div className="flex items-center gap-2">
                        <button
                          onClick={toggleVoiceGuidance}
                          className={`flex items-center gap-1.5 px-3 py-1 rounded-xl text-xs font-mono font-bold border transition ${
                            voiceGuidance 
                              ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40 shadow-sm shadow-emerald-500/20' 
                              : 'bg-slate-800 text-slate-400 border-slate-700'
                          }`}
                          title="Toggle automatic voice narration in account preferences"
                        >
                          {voiceGuidance ? <Volume2 className="w-3.5 h-3.5 text-emerald-400 animate-pulse" /> : <VolumeX className="w-3.5 h-3.5 text-slate-400" />}
                          Voice Guidance: <span className={voiceGuidance ? "text-emerald-400 font-black" : "text-slate-400"}>{voiceGuidance ? "ON (Default)" : "OFF"}</span>
                        </button>
                        <button
                          onClick={() => speakBritishClara(`Step ${currentItem.id}: ${currentItem.title}. ${currentItem.instruction}`)}
                          className="flex items-center gap-1 px-2.5 py-1 bg-indigo-600/20 hover:bg-indigo-600/30 text-indigo-300 border border-indigo-500/30 rounded-xl text-xs font-mono font-bold transition"
                          title="Replay narration in British female voice"
                        >
                          <RotateCcw className="w-3 h-3" /> Replay
                        </button>
                      </div>'''
    code = code[:old_listen_btn.start()] + new_listen_controls + code[old_listen_btn.end():]

with open("src/app/driver/page.tsx", "w") as f:
    f.write(code)

print("✓ Successfully configured Voice Guidance to ON as default with persistent account preferences!")
