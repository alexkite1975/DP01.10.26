'use client';

import React, { useState } from 'react';
import dynamic from 'next/dynamic';
import InCabDashboard from '@/components/in-cab/InCabDashboard';
import LowBridgeWarningBanner from '@/components/in-cab/LowBridgeWarningBanner';
import WalkaroundInspectionModal from '@/components/in-cab/WalkaroundInspectionModal';
import LiveTelemetryCluster from '@/components/in-cab/LiveTelemetryCluster';

const TomTomTruckMap = dynamic(
  () => import('@/components/in-cab/TomTomTruckMap'),
  { ssr: false }
);

export default function SmartHaulCockpit() {
  const [isWalkaroundOpen, setIsWalkaroundOpen] = useState(false);
  const [activeHazard, setActiveHazard] = useState<any>(null);

  return (
    <main className="min-h-screen bg-[#090D16] text-slate-100 p-4 sm:p-6 md:p-8 space-y-6 max-w-7xl mx-auto">
      {activeHazard && (
        <LowBridgeWarningBanner
          hazardName={activeHazard.name}
          bridgeClearanceMeters={activeHazard.clearanceM}
          vehicleHeightMeters={4.45}
          distanceMeters={activeHazard.distanceM}
          onReroute={() => {
            alert('Safe bypass recalculated around low bridge.');
            setActiveHazard(null);
          }}
        />
      )}

      {/* Sprint 3.1: 1Hz CAN Telematics Stream */}
      <LiveTelemetryCluster />

      {/* Sprint 1.1: Tacho Clocks & Stepper */}
      <InCabDashboard
        onOpenWalkaround={() => setIsWalkaroundOpen(true)}
        onOpenMap={() => window.scrollTo({ top: 800, behavior: 'smooth' })}
      />

      {/* Sprint 1.2: 44t Low-Bridge Leaflet Map */}
      <section className="space-y-2">
        <h2 className="text-xs font-bold uppercase tracking-wider text-slate-400 font-mono">
          Live Commercial HGV Low-Bridge Routing (Daventry → Park Royal)
        </h2>
        <TomTomTruckMap
          origin={{ lat: 52.3025, lon: -1.1561 }}
          destination={{ lat: 51.5303, lon: -0.2783 }}
          vehicleHeightMeters={4.45}
          vehicleWeightKg={44000}
          onHazardDetected={h => setActiveHazard(h)}
        />
      </section>

      {/* Sprint 1.3: DVSA 20-Point Walkaround Check */}
      <WalkaroundInspectionModal
        isOpen={isWalkaroundOpen}
        onClose={() => setIsWalkaroundOpen(false)}
        onPassed={() => alert('Inspection complete! Shift verified.')}
      />
    </main>
  );
}
