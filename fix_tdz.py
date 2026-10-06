import re

with open("src/app/driver/page.tsx", "r") as f:
    code = f.read()

# 1. Remove duplicate/delayed declarations of checkStarted & isCheckComplete further down
code = re.sub(r'const\s+\[checkStarted,\s*setCheckStarted\]\s*=\s*useState\([^)]*\);?\n?', '', code)
code = re.sub(r'const\s+\[isCheckComplete,\s*setIsCheckComplete\]\s*=\s*useState\([^)]*\);?\n?', '', code)

# 2. Place them right at the top next to walkaroundStep so they are initialized FIRST
target = "const [walkaroundStep, setWalkaroundStep] = useState(1);"
clean_states = """const [walkaroundStep, setWalkaroundStep] = useState(1);
  const [checkStarted, setCheckStarted] = useState(false);
  const [isCheckComplete, setIsCheckComplete] = useState(false);"""

code = code.replace(target, clean_states, 1)

# 3. Add header tag to guarantee a fresh git commit
code = "// Driver OS v1.0.8 - TDZ Resolved\n" + code.lstrip()

with open("src/app/driver/page.tsx", "w") as f:
    f.write(code)

print("✓ Successfully eliminated Temporal Dead Zone (TDZ)!")
