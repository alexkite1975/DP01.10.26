'use client';

import React, { useState } from 'react';
import dynamic from 'next/dynamic';
import Link from 'next/link';
import { ArrowLeft, ShieldCheck, Home } from 'lucide-react';
import { INITIAL_SITES } from '@/data/initialSites';
import { SiteRiskAssessment, UserRole } from '@/components/types';

const BusinessDashboard = dynamic(
  () => import('@/components/manager/BusinessDashboard').then(m => m.BusinessDashboard),
  {
    ssr: false,
    loading: () => <div className="p-8 text-center text-slate-400 font-mono text-sm">Loading Haulier Command...</div>
  }
);

const CreateSiteModal = dynamic(
  () => import('@/components/manager/CreateSiteModal').then(m => m.CreateSiteModal),
  { ssr: false }
);

export default function HaulierMasterCommand() {
  const [sites, setSites] = useState<SiteRiskAssessment[]>(INITIAL_SITES);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [currentRole, setCurrentRole] = useState<UserRole>('haulier');

  const handleSiteCreated = (newSite: SiteRiskAssessment) => {
    setSites(prev => [newSite, ...prev]);
    setIsCreateModalOpen(false);
  };

  const handleApproveModification = (siteId: string, modificationId: string) => {
    setSites(prev =>
      prev.map(s => {
        if (s.id !== siteId) return s;
        return {
          ...s,
          pendingModifications: (s.pendingModifications || []).filter((m: any) => m.id !== modificationId)
        };
      })
    );
  };

  const handleRejectModification = (siteId: string, modificationId: string, _reason: string) => {
    setSites(prev =>
      prev.map(s => {
        if (s.id !== siteId) return s;
        return {
          ...s,
          pendingModifications: (s.pendingModifications || []).filter((m: any) => m.id !== modificationId)
        };
      })
    );
  };

  return (
    <div className="min-h-dvh bg-slate-950 text-white flex flex-col font-sans">
      {/* Mobile Top Navigation */}
      <header className="sticky top-0 z-40 bg-slate-900/95 backdrop-blur border-b border-slate-800 px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Link
            href="/"
            className="p-2 -ml-1 rounded-xl bg-slate-800 hover:bg-slate-700 active:scale-95 text-slate-300 hover:text-white transition flex items-center gap-1 text-xs font-semibold"
            aria-label="Return Home"
          >
            <Home className="w-4 h-4" />
          </Link>
          <div>
            <h1 className="text-sm font-bold text-white flex items-center gap-1.5">
              Haulier Master Command
            </h1>
            <p className="text-[10px] text-slate-400 font-mono">Fleet Compliance, VOR &amp; DC Approvals</p>
          </div>
        </div>

        <Link
          href="/admin"
          className="text-xs font-semibold px-2.5 py-1.5 rounded-lg bg-amber-500/10 hover:bg-amber-500/20 text-amber-300 border border-amber-500/30 flex items-center gap-1.5 transition"
        >
          <ShieldCheck className="w-3.5 h-3.5" />
          <span>Admin CMS</span>
        </Link>
      </header>

      {/* Main Single-Purpose Body: Full BusinessDashboard with Connected Sites & Creation Modal */}
      <main className="flex-1 w-full max-w-7xl mx-auto p-2 sm:p-4 overflow-y-auto">
        <BusinessDashboard
          sites={sites}
          onOpenCreateSite={() => setIsCreateModalOpen(true)}
          onOpenScanModal={() => setIsCreateModalOpen(true)}
          onSelectSiteForDetail={(site) => console.log('Selected site:', site.id)}
          onApproveModification={handleApproveModification}
          onRejectModification={handleRejectModification}
          currentRole={currentRole}
          onChangeRole={(role) => setCurrentRole(role)}
        />
      </main>

      {/* Connected 1,502 LOC AI Risk Assessment & Yard Blueprint CAD Modal */}
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
