'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import dynamic from 'next/dynamic';
import { ArrowLeft, Building2, Plus, Sparkles, MapPin } from 'lucide-react';
import { INITIAL_SITES } from '@/data/initialSites';
import { SiteRiskAssessment } from '@/components/types';

const PlaceSearchPage = dynamic(() => import('@/components/shared/PlaceSearchPage').then(m => m.PlaceSearchPage), {
  ssr: false,
  loading: () => <div className="p-8 text-center text-slate-400 font-mono text-sm">Loading UK Hub Directory...</div>
});

const CreateSiteModal = dynamic(() => import('@/components/manager/CreateSiteModal').then(m => m.CreateSiteModal), {
  ssr: false
});

export default function AdminSitesCmsPage() {
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [sites, setSites] = useState<SiteRiskAssessment[]>(INITIAL_SITES);

  const handleSiteCreated = (newSite: SiteRiskAssessment) => {
    setSites(prev => [newSite, ...prev]);
    setIsCreateModalOpen(false);
  };

  return (
    <div className="min-h-dvh bg-slate-950 text-white flex flex-col font-sans">
      {/* Mobile Top App Bar */}
      <header className="sticky top-0 z-40 bg-slate-900/95 backdrop-blur border-b border-slate-800 px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Link
            href="/admin"
            className="p-2 -ml-1 rounded-xl bg-slate-800 hover:bg-slate-700 active:scale-95 text-slate-300 hover:text-white transition flex items-center gap-1 text-xs font-semibold"
            aria-label="Return to Admin Hub"
          >
            <ArrowLeft className="w-4 h-4" />
            <span className="hidden sm:inline">Admin</span>
          </Link>
          <div>
            <h1 className="text-sm font-bold text-white flex items-center gap-1.5">
              <Building2 className="w-4 h-4 text-emerald-400" /> Depot &amp; Yard CMS
            </h1>
            <p className="text-[10px] text-slate-400 font-mono">ISO 45001 • AI Risk Assessments &amp; CAD Blueprints</p>
          </div>
        </div>

        <button
          onClick={() => setIsCreateModalOpen(true)}
          className="px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold flex items-center gap-1.5 shadow-md shadow-emerald-900/30 transition active:scale-95"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>New Site</span>
        </button>
      </header>

      {/* Main Single-Purpose Body: UK Logistics Hubs & Gate Previews */}
      <main className="flex-1 w-full max-w-2xl mx-auto p-2 sm:p-4 overflow-y-auto">
        <PlaceSearchPage
          onSelectSite={(site) => {
            console.log('Selected site for management:', site);
          }}
          onOpenCreateSite={() => setIsCreateModalOpen(true)}
        />
      </main>

      {/* 1,502 LOC AI Risk Assessment & Yard Blueprint CAD Modal */}
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
