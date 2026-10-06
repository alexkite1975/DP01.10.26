with open("src/app/driver/page.tsx", "r") as f:
    code = f.read()

# 1. Ensure vehicleReg and root currentItem are declared right inside DriverDashboard()
root_anchor = "export default function DriverDashboard() {"

declarations = """export default function DriverDashboard() {
  const [mounted, setMounted] = useState(false);
  const vehicleReg = 'GN21 EVX'; // Assigned Tractor Registration
"""

if "const vehicleReg = 'GN21 EVX';" not in code:
    code = code.replace(root_anchor, declarations)

# 2. Ensure currentItem is always safely derived at root level
if "const currentItem =" not in code.split("return (")[0]:
    step_anchor = "const [walkaroundStep, setWalkaroundStep] = useState(1);"
    item_declaration = """const [walkaroundStep, setWalkaroundStep] = useState(1);
  const currentItem = dvsaChecklist[walkaroundStep - 1] || dvsaChecklist[0] || {
    id: 1,
    category: 'Tractor Steer',
    title: 'Front Axle Steering Tyres & Wheel Nuts',
    instruction: 'Inspect tread depth across 3/4 breadth (min 1mm), sidewall cuts, bulging, and ensure wheel nut alignment pointers match.'
  };"""
    code = code.replace(step_anchor, item_declaration)

# 3. Add client-side mount protection to prevent hydration crashes
if "if (!mounted) {" not in code:
    safe_mount = """  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center text-white">
        <div className="w-8 h-8 border-2 border-emerald-500 border-t-transparent rounded-full animate-spin mb-4" />
        <p className="font-mono text-sm tracking-wider text-slate-400">INITIALIZING IN-CAB OS TELEMATICS...</p>
      </div>
    );
  }

  return ("""
    code = code.replace("  return (", safe_mount)

# 4. Safely guard Clara props
code = code.replace(
    "currentCheckTitle={currentItem.title}",
    "currentCheckTitle={currentItem?.title || 'Pre-Trip Inspection'}"
)
code = code.replace(
    "currentCheckInstruction={currentItem.instruction}",
    "currentCheckInstruction={currentItem?.instruction || 'Conduct statutory DVSA walkaround check.'}"
)

with open("src/app/driver/page.tsx", "w") as f:
    f.write(code)

print("✓ Successfully fixed vehicleReg, currentItem scope, and added client-side guard!")
