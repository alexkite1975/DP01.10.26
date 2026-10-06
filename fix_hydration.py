import re

# 1. Protect Clara with mounted check (prevents SSR audio/voice crash)
with open("src/components/ClaraVoiceAssistant.tsx", "r") as f:
    c = f.read()

if "mounted" not in c:
    c = c.replace(
        "const [isExpanded, setIsExpanded] = useState(false);",
        "const [isExpanded, setIsExpanded] = useState(false);\n  const [mounted, setMounted] = useState(false);\n  useEffect(() => { setMounted(true); }, []);"
    )
    c = c.replace("return (", "if (!mounted) return null;\n\n  return (")
    with open("src/components/ClaraVoiceAssistant.tsx", "w") as f:
        f.write(c)
    print("✓ Clara mounted guard applied.")

# 2. Fix driver page localStorage
with open("src/app/driver/page.tsx", "r") as f:
    d = f.read()

d = d.replace(
    "const [activeVoiceName, setActiveVoiceName] = useState('Loading UK Voice...');",
    "const [activeVoiceName, setActiveVoiceName] = useState('British Voice (en-GB)');"
)

d = re.sub(
    r'const \[voiceGuidance, setVoiceGuidance\] = useState<boolean>\(\(\) => \{[\s\S]*?\}\);',
    "const [voiceGuidance, setVoiceGuidance] = useState<boolean>(true);",
    d
)

with open("src/app/driver/page.tsx", "w") as f:
    f.write(d)
print("✓ Driver OS hydration fixed.")

# 3. Fix home page localStorage
with open("src/app/page.tsx", "r") as f:
    p = f.read()

p = re.sub(
    r'const \[userRole, setUserRole\] = useState<UserRole>\(\(\) => \{[\s\S]*?\}\);',
    "const [userRole, setUserRole] = useState<UserRole>('guest');\n  useEffect(() => {\n    try {\n      const saved = localStorage.getItem('dp_user_role');\n      if (saved) setUserRole(saved as UserRole);\n    } catch (e) {}\n  }, []);",
    p
)

with open("src/app/page.tsx", "w") as f:
    f.write(p)
print("✓ Home page hydration fixed.")
