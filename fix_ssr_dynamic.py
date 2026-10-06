import os

# 1. Move current driver page to a clean client component
with open("src/app/driver/page.tsx", "r") as f:
    code = f.read()

# Ensure DriverDashboardView is exported
code = code.replace("export default function DriverDashboard()", "export default function DriverDashboardView()")

os.makedirs("src/components", exist_ok=True)
with open("src/components/DriverDashboardView.tsx", "w") as f:
    f.write(code)

# 2. Create the bulletproof ssr: false wrapper at src/app/driver/page.tsx
wrapper = """'use client';

import dynamic from 'next/dynamic';

const DriverDashboardView = dynamic(
  () => import('@/components/DriverDashboardView'),
  {
    ssr: false,
    loading: () => (
      <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center text-white">
        <div className="w-8 h-8 border-2 border-emerald-500 border-t-transparent rounded-full animate-spin mb-4" />
        <p className="font-mono text-sm tracking-wider text-slate-400">INITIALIZING IN-CAB OS TELEMATICS...</p>
      </div>
    )
  }
);

export default function DriverPage() {
  return <DriverDashboardView />;
}
"""

with open("src/app/driver/page.tsx", "w") as f:
    f.write(wrapper)

print("✓ Successfully decoupled Driver OS with ssr: false dynamic client rendering!")
