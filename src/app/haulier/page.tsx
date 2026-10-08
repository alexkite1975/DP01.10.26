'use client';

import React, { useState } from 'react';
import dynamic from 'next/dynamic';
import Link from 'next/link';
import { ArrowLeft, ShieldCheck, Home, Radio, Building2 } from 'lucide-react';
import { INITIAL_SITES } from '@/data/initialSites';
import { SiteRiskAssessment, UserRole } from '@/components/types';
import { audioFeedback } from '@/utils/audioFeedback';

const BusinessDashboard = dynamic(
  () => import('@/components/manager/BusinessDashboard').then((m) => m.BusinessDashboard),
  {
    ssr: false,
    loading: () => (
      <div className="p-8 text-center text-slate-400 font-mono text-sm">
        Loading Haulier Master Command...
      </div>
    )
  }
);

const CreateSiteModal = dynamic(
  () => import('@/components/manager/CreateSiteModal').then((m) => m.CreateSiteModal),
  { ssr: false }
);

export default function HaulierMasterCommand() {
  const [sites, setSites] = useState<SiteRiskAssessment[]>(INITIAL_SITES);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [currentRole, setCurrentRole] = useState<UserRole>('haulier');

  const handleSiteCreated = (newSite: SiteRiskAssessment) => {
    setSites((prev) => [newSite, ...prev]);
    setIsCreateModalOpen(false);
    audioFeedback.playSuccessChime();
  };

  const handleApproveModification = (siteId: string, modificationId: string) => {
    setSites((prev) =>
      prev.map((s) => {
        if (s.id !== siteId) return s;
        return {
          ...s,
          pendingModifications: (s.pendingModifications || []).filter((m: any) => m.id !== modificationId)
        };
      })
    );
    audioFeedback.playSuccessChime();
  };

  const handleRejectModification = (siteId: string, modificationId: string, _reason: string) => {
    setSites((prev) =>
      prev.map((s) => {
        if (s.id !== siteId) return s;
        return {
          ...s,
          pendingModifications: (s.pendingModifications || []).filter((m: any) => m.id !== modificationId)
        };
      })
    );
    audioFeedback.playWarningAlert();
  };

  return (
    <div className="min-h-dvh bg-slate-950 text-white flex flex-col font-sans bg-cockpit-grid">
      {/* Mobile Top Navigation */}
      <header className="sticky top-0 z-40 bg-slate-900/90 backdrop-blur-xl border-b border-slate-800/80 px-4 py-3 flex items-center justify-between shadow-cockpit">
        <div className="flex items-center gap-3">
          <Link
            href="/"
            onClick={() => audioFeedback.playCheckpointClick()}
            className="p-2 -ml-1 rounded-xl bg-slate-800/80 hover:bg-slate-700 active:scale-95 text-slate-300 hover:text-white transition flex items-center gap-1 text-xs font-semibold touch-press"
            aria-label="Return Home"
          >
            <Home className="w-4 h-4" />
          </Link>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-sm font-bold text-white flex items-center gap-1.5">
                <Building2 className="w-4 h-4 text-amber-400" />
                Haulier Master Command
              </h1>
              <div className="hidden sm:flex items-center gap-1 px-2 py-0.5 rounded-full bg-emerald-950 border border-emerald-800/60 text-[10px] font-mono font-bold text-emerald-400">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                1Hz LIVE
              </div>
            </div>
            <p className="text-[10px] text-slate-400 font-mono">Fleet Compliance, VOR &amp; DC Approvals</p>
          </div>
        </div>

        <Link
          href="/admin"
          onClick={() => audioFeedback.playCheckpointClick()}
          className="text-xs font-semibold px-2.5 py-1.5 rounded-xl bg-amber-500/10 hover:bg-amber-500/20 text-amber-300 border border-amber-500/30 flex items-center gap-1.5 transition touch-press shadow-glow-amber"
        >
          <ShieldCheck className="w-3.5 h-3.5" />
          <span>Admin Suite</span>
        </Link>
      </header>

      {/* Main Single-Purpose Body: Full BusinessDashboard with Connected Sites & Creation Modal */}
      <main className="flex-1 w-full max-w-7xl mx-auto p-2 sm:p-4 overflow-y-auto">
        <BusinessDashboard
          sites={sites}
          onOpenCreateSite={() => {
            setIsCreateModalOpen(true);
            audioFeedback.playCheckpointClick();
          }}
          onSelectSiteForDetail={() => {}}
          onApproveModification={handleApproveModification}
          onRejectModification={handleRejectModification}
          currentRole={currentRole}
          onChangeRole={setCurrentRole}
        />
      </main>

      {/* Modals */}
      {isCreateModalOpen && (
        <CreateSiteModal
          isOpen={isCreateModalOpen}
          onClose={() => setIsCreateModalOpen(false)}
          onSiteCreated={handleSiteCreated}
        />
      )}
    </div>
  );
}
