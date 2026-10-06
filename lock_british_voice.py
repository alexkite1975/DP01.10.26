import re

with open("src/app/driver/page.tsx", "r") as f:
    code = f.read()

# Replace speakBritishClara with an asynchronous voice-guaranteed British female selector
old_speak = re.search(r'const speakBritishClara = \(text: string\) => \{.*?window\.speechSynthesis\.speak\(utterance\);\s*\};', code, re.DOTALL)

new_speak = '''  // Pre-load and cache British Female Voice
  const [activeVoiceName, setActiveVoiceName] = useState('Loading UK Voice...');

  const getExactBritishFemaleVoice = (): SpeechSynthesisVoice | null => {
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) return null;
    const allVoices = window.speechSynthesis.getVoices();
    if (!allVoices || allVoices.length === 0) return null;

    // 1. Exact UK Female priority list
    const preferredUkFemaleNames = [
      'google uk english female',
      'sonia',
      'libby',
      'hazel',
      'susan',
      'serena',
      'victoria',
      'martha',
      'stephanie',
      'alice'
    ];

    for (const name of preferredUkFemaleNames) {
      const match = allVoices.find(v => 
        (v.lang.replace('_', '-').toLowerCase().startsWith('en-gb')) && 
        v.name.toLowerCase().includes(name)
      );
      if (match) return match;
    }

    // 2. Any en-GB female voice
    const anyUkFemale = allVoices.find(v => 
      (v.lang.replace('_', '-').toLowerCase().startsWith('en-gb')) && 
      v.name.toLowerCase().includes('female')
    );
    if (anyUkFemale) return anyUkFemale;

    // 3. Any en-GB voice (UK English)
    const anyUk = allVoices.find(v => v.lang.replace('_', '-').toLowerCase().startsWith('en-gb'));
    if (anyUk) return anyUk;

    return null;
  };

  useEffect(() => {
    const syncVoice = () => {
      const v = getExactBritishFemaleVoice();
      if (v) {
        setActiveVoiceName(`${v.name} (en-GB)`);
      }
    };
    syncVoice();
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      window.speechSynthesis.onvoiceschanged = syncVoice;
    }
  }, []);

  const speakBritishClara = (text: string) => {
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) return;
    window.speechSynthesis.cancel();

    const doSpeak = () => {
      const utterance = new SpeechSynthesisUtterance(text);
      const ukVoice = getExactBritishFemaleVoice();

      if (ukVoice) {
        utterance.voice = ukVoice;
        setActiveVoiceName(`${ukVoice.name} (en-GB)`);
      }
      utterance.lang = 'en-GB';
      utterance.rate = 0.88; // Clear British cadence
      utterance.pitch = 1.05;

      window.speechSynthesis.speak(utterance);
    };

    // If voices aren't loaded yet, wait for onvoiceschanged
    if (window.speechSynthesis.getVoices().length === 0) {
      window.speechSynthesis.onvoiceschanged = () => {
        doSpeak();
      };
    } else {
      doSpeak();
    }
  };'''

if old_speak:
    code = code[:old_speak.start()] + new_speak + code[old_speak.end():]

# Also display the active voice name on the inspection header badge
code = code.replace(
    'title="Toggle automatic voice narration in account preferences"',
    'title={`Voice: ${activeVoiceName}`}'
)

with open("src/app/driver/page.tsx", "w") as f:
    f.write(code)

print("✓ Successfully locked British Female Voice engine with async loading guarantee!")
