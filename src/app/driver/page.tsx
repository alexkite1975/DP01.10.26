'use client';

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
