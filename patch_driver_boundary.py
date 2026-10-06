import re

# 1. Create InCabErrorBoundary component
boundary_code = """'use client';
import React, { Component, ErrorInfo, ReactNode } from 'react';

interface Props { children: ReactNode; }
interface State { hasError: boolean; error: Error | null; }

export class InCabErrorBoundary extends Component<Props, State> {
  state: State = { hasError: false, error: null };

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('In-Cab Telematics Error caught by boundary:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-slate-950 text-white p-8 flex flex-col items-center justify-center font-mono">
          <div className="max-w-xl w-full bg-slate-900 border border-amber-500/30 rounded-xl p-6 shadow-2xl">
            <div className="flex items-center space-x-3 mb-4">
              <span className="w-3 h-3 rounded-full bg-amber-500 animate-ping" />
              <h2 className="text-amber-400 text-lg font-bold">DRIVE PARTNERS: IN-CAB OS SAFE-MODE</h2>
            </div>
            <p className="text-slate-300 text-sm mb-4">
              A browser hardware/audio component encountered a startup delay:
            </p>
            <div className="bg-slate-950 p-4 rounded border border-slate-800 text-xs text-rose-300 overflow-x-auto mb-6">
              {this.state.error?.message || 'Hardware API Initialization Pending'}
            </div>
            <button
              onClick={() => { this.setState({ hasError: false }); window.location.reload(); }}
              className="w-full py-3 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold rounded-lg transition-colors"
            >
              RESTART IN-CAB TELEMATICS
            </button>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}
"""

with open("src/components/InCabErrorBoundary.tsx", "w") as f:
    f.write(boundary_code)

# 2. Wrap DriverPage in InCabErrorBoundary
page_wrapper = """'use client';

import dynamic from 'next/dynamic';
import { InCabErrorBoundary } from '@/components/InCabErrorBoundary';

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
  return (
    <InCabErrorBoundary>
      <DriverDashboardView />
    </InCabErrorBoundary>
  );
}
"""

with open("src/app/driver/page.tsx", "w") as f:
    f.write(page_wrapper)

# 3. Clean up any unhandled global calls in DriverDashboardView
with open("src/components/DriverDashboardView.tsx", "r") as f:
    d = f.read()

# Guard window.speechSynthesis.onvoiceschanged so it never runs during initial render
d = d.replace("syncVoice();", "if (typeof window !== 'undefined') { syncVoice(); }")

with open("src/components/DriverDashboardView.tsx", "w") as f:
    f.write(d)

print("✓ Successfully installed InCabErrorBoundary and wrapped Driver OS!")
