'use client';
import React, { useState } from 'react';
import {
  Building2,
  Briefcase,
  AlertOctagon,
  Wrench,
  Truck,
  FileCheck,
  ShieldAlert,
  Users,
  CreditCard,
  Plus,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  Download,
  Printer,
  Sparkles,
  ExternalLink,
  ChevronRight,
  ShieldCheck,
  Clock,
  MapPin,
  Search,
  Receipt,
  ScanLine
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { ShiftMarketplaceModal } from './ShiftMarketplaceModal';
import { FleetVORGroundingModal } from './FleetVORGroundingModal';
import { SelfBillingPayrollModal } from './SelfBillingPayrollModal';
import { DVSACERSPortalModal } from './DVSACERSPortalModal';
import { DVSandCleanAirZoneModal } from './DVSandCleanAirZoneModal';
import { UserAccessControlPortal } from './UserAccessControlPortal';
import { GoogleBusinessProfileOAuthModal, VerifiedDepotProfile } from './GoogleBusinessProfileOAuthModal';
import {
  initialMarketplaceShifts,
  initialFleetVehicles,
  initialPayrollInvoices
} from '../data/mockMarketplaceData';
import {
  SiteRiskAssessment,
  DriverModificationRequest,
  UserRole
} from '../types';
import { formatHeightBoth } from '../../utils/heightUtils';

interface BusinessDashboardProps {
  sites: SiteRiskAssessment[];
  onOpenCreateSite: () => void;
  onOpenScanModal?: () => void;
  onSelectSiteForDetail: (site: SiteRiskAssessment) => void;
  onApproveModification: (siteId: string, modificationId: string) => void;
  onRejectModification: (siteId: string, modificationId: string, reason: string) => void;
  currentRole: UserRole;
  onChangeRole: (role: UserRole) => void;
  initialTab?: string;
  onTabChange?: (tab: string) => void;
  onImpersonateUser?: (user: any) => void;
}

export const BusinessDashboard: React.FC<BusinessDashboardProps> = ({
  sites,
  onOpenCreateSite,
  onOpenScanModal,
  onSelectSiteForDetail,
  onApproveModification,
  onRejectModification,
  currentRole: _currentRole,
  onChangeRole,
  initialTab,
  onTabChange,
  onImpersonateUser
}) => {
  const [activeTab, setActiveTab] = useState<
    | 'SITES'
    | 'APPROVALS'
    | 'COMPLIANCE'
    | 'ACCESS_CONTROL'
    | 'SUBSCRIPTION'
    | 'SHIFTS_MARKETPLACE'
    | 'FLEET_VOR_GROUNDING'
    | 'PAYROLL_SELF_BILLING'
  >(() => {
    if (initialTab && ['SITES', 'APPROVALS', 'COMPLIANCE', 'ACCESS_CONTROL', 'SUBSCRIPTION', 'SHIFTS_MARKETPLACE', 'FLEET_VOR_GROUNDING', 'PAYROLL_SELF_BILLING'].includes(initialTab)) {
      return initialTab as any;
    }
    if (typeof window !== 'undefined') {
      const p = new URLSearchParams(window.location.search);
      const tab = p.get('tab');
      if (tab === 'shifts') return 'SHIFTS_MARKETPLACE';
      if (tab === 'vor') return 'FLEET_VOR_GROUNDING';
      if (tab === 'payroll') return 'PAYROLL_SELF_BILLING';
      if (tab === 'compliance') return 'COMPLIANCE';
    }
    return 'SITES';
  });

  React.useEffect(() => {
    if (initialTab && initialTab !== activeTab && ['SITES', 'APPROVALS', 'COMPLIANCE', 'ACCESS_CONTROL', 'SUBSCRIPTION', 'SHIFTS_MARKETPLACE', 'FLEET_VOR_GROUNDING', 'PAYROLL_SELF_BILLING'].includes(initialTab)) {
      setActiveTab(initialTab as any);
    }
  }, [initialTab, activeTab]);

  const [isShiftModalOpen, setIsShiftModalOpen] = useState(false);
  const [isVorModalOpen, setIsVorModalOpen] = useState(false);
  const [isPayrollModalOpen, setIsPayrollModalOpen] = useState(false);
  const [isDvsaErsModalOpen, setIsDvsaErsModalOpen] = useState(false);
  const [isDvsCazModalOpen, setIsDvsCazModalOpen] = useState(false);
  const [isGbpModalOpen, setIsGbpModalOpen] = useState(false);
  const [verifiedClaim, setVerifiedClaim] = useState<VerifiedDepotProfile | null>(null);

  const [siteSearch, setSiteSearch] = useState('');
  const [billingCycle, setBillingCycle] = useState<'MONTHLY' | 'ANNUAL'>('MONTHLY');
  const [showCheckoutModal, setShowCheckoutModal] = useState(false);
  const [selectedPlanToUpgrade, setSelectedPlanToUpgrade] = useState<string | null>(null);
  const [checkoutSuccess, setCheckoutSuccess] = useState(false);

  // Aggregate all pending driver modifications across all sites
  const allPendingModifications: { site: SiteRiskAssessment; mod: DriverModificationRequest }[] = [];
  sites.forEach((site) => {
    site.driverSection.pendingModifications?.forEach((mod) => {
      if (mod.status === 'PENDING') {
        allPendingModifications.push({ site, mod });
      }
    });
  });

  // Calculate high-level compliance metrics
  const totalHazards = sites.reduce((acc, s) => acc + s.businessSection.baselineHazards.length, 0);
  const criticalCount = sites.filter((s) => s.overallRiskLevel === 'CRITICAL' || s.overallRiskLevel === 'HIGH').length;

  const handleApproveWithCelebration = (siteId: string, modId: string) => {
    onApproveModification(siteId, modId);
    try {
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 }
      });
    } catch (_e) {
      // Confetti fallback
    }
  };

  // Export full ISO 45001 Compliance Package
  const handleExportComplianceReport = () => {
    const report = {
      standard: 'ISO 45001:2018 Occupational Health and Safety Audit',
      generatedAt: new Date().toISOString(),
      organization: 'Fleet Delivery Operations Network',
      auditor: 'SiteRisk Pro Compliance Engine',
      summary: {
        totalSitesMonitored: sites.length,
        totalBaselineHazards: totalHazards,
        pendingDriverReviews: allPendingModifications.length
      },
      siteAudits: sites.map((s) => ({
        siteId: s.id,
        title: s.title,
        address: s.address,
        overallRiskLevel: s.overallRiskLevel,
        overallScore: s.overallScore,
        hazards: s.businessSection.baselineHazards,
        auditTrail: s.auditHistory
      }))
    };

    const blob = new Blob([JSON.stringify(report, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `ISO_45001_Compliance_Audit_Report_${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const filteredSites = sites.filter((s) => {
    const matchSearch =
      s.title.toLowerCase().includes(siteSearch.toLowerCase()) ||
      s.address.toLowerCase().includes(siteSearch.toLowerCase());
    return matchSearch;
  });

  return (
    <div className="space-y-5 pb-16">
      {/* Business Header Banner */}
      <div className="rounded-2xl border border-slate-800 bg-slate-900/90 p-4 sm:p-5 shadow-xl">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-amber-500/20 text-amber-400 border border-amber-500/30 shadow-inner">
              <Building2 className="h-6 w-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-lg sm:text-xl font-extrabold text-slate-100">
                  Business Operations & Risk Command
                </h1>
                <span className="rounded-md bg-emerald-500/20 px-2 py-0.5 text-[10px] font-bold text-emerald-400 border border-emerald-500/30">
                  Fleet Pro Active
                </span>
              </div>
              <p className="text-xs text-slate-400">
                Site baselines, ISO 45001 sign-offs, manager permissions & subscription
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {onOpenScanModal && (
              <button
                onClick={onOpenScanModal}
                className="flex items-center gap-1.5 rounded-xl border border-indigo-500/40 bg-indigo-950/60 hover:bg-indigo-900/80 px-3.5 py-2 text-xs font-bold text-indigo-300 shadow-md transition-all active:scale-95"
                title="Scan or upload existing risk assessment document (Paper RAMS / PDF)"
              >
                <ScanLine className="h-4 w-4 text-indigo-400" />
                <span>Scan / Upload RAMS</span>
                <span className="rounded bg-indigo-500/30 text-indigo-200 text-[9px] font-black px-1.5 py-0.2 uppercase">
                  AI
                </span>
              </button>
            )}

            <button
              onClick={() => setIsGbpModalOpen(true)}
              className="flex items-center gap-1.5 rounded-xl border border-cyan-500/40 bg-cyan-950/60 hover:bg-cyan-900/80 px-3.5 py-2 text-xs font-bold text-cyan-300 shadow-md transition-all active:scale-95 cursor-pointer"
              title="Authenticate depot ownership via Google Business Profile OAuth 2.0"
            >
              <Building2 className="h-4 w-4 text-cyan-400" />
              <span>Google OAuth Verification</span>
              <span className="rounded bg-cyan-500/30 text-cyan-200 text-[9px] font-black px-1.5 py-0.2 uppercase">
                4-Step
              </span>
            </button>

            <button
              onClick={onOpenCreateSite}
              className="flex items-center gap-1.5 rounded-xl bg-amber-500 hover:bg-amber-400 px-3.5 py-2 text-xs font-bold text-slate-950 shadow-md transition-all active:scale-95 cursor-pointer"
            >
              <Plus className="h-4 w-4" />
              <span>Add Delivery Site</span>
            </button>
          </div>
        </div>

        {/* Top Metric Cards */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 pt-4 mt-4 border-t border-slate-800 text-xs">
          <div className="rounded-xl bg-slate-950/80 p-3 border border-slate-800/80">
            <div className="text-[11px] text-slate-400">Active Delivery Sites</div>
            <div className="text-xl font-extrabold text-slate-100 mt-0.5">{sites.length}</div>
            <div className="text-[10px] text-emerald-400 mt-0.5">100% Verified Locations</div>
          </div>

          <div className="rounded-xl bg-slate-950/80 p-3 border border-slate-800/80">
            <div className="text-[11px] text-slate-400">Driver Reviews Pending</div>
            <div className="text-xl font-extrabold text-amber-400 mt-0.5">
              {allPendingModifications.length}
            </div>
            <div className="text-[10px] text-amber-400/80 mt-0.5">Requires Manager Sign-Off</div>
          </div>

          <div className="rounded-xl bg-slate-950/80 p-3 border border-slate-800/80">
            <div className="text-[11px] text-slate-400">Cataloged Hazards</div>
            <div className="text-xl font-extrabold text-slate-100 mt-0.5">{totalHazards}</div>
            <div className="text-[10px] text-slate-400 mt-0.5">ISO 45001 5x5 Matrix</div>
          </div>

          <div className="rounded-xl bg-slate-950/80 p-3 border border-slate-800/80">
            <div className="text-[11px] text-slate-400">High/Critical Attention</div>
            <div className="text-xl font-extrabold text-rose-400 mt-0.5">{criticalCount}</div>
            <div className="text-[10px] text-rose-400/80 mt-0.5">Active Safety Rules</div>
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="flex border-b border-slate-800 overflow-x-auto no-scrollbar gap-2 text-xs">
        {[
          { id: 'SITES', label: `Sites Directory (${sites.length})`, icon: Building2 },
          {
            id: 'APPROVALS',
            label: `Driver Sign-Offs (${allPendingModifications.length})`,
            icon: FileCheck,
            badge: allPendingModifications.length
          },
          { id: 'COMPLIANCE', label: 'ISO 45001 Compliance Matrix', icon: ShieldAlert },
          { id: 'ACCESS_CONTROL', label: 'Managers & Access', icon: Users },
          { id: 'SUBSCRIPTION', label: 'Subscription & Billing', icon: CreditCard },
          { id: 'SHIFTS_MARKETPLACE', label: 'Shifts & IR35 Tax Shield', icon: Briefcase },
          {
            id: 'FLEET_VOR_GROUNDING',
            label: 'Fleet VOR Grounding & DVSA',
            icon: AlertOctagon,
            badge: initialFleetVehicles.filter((v) => v.isGroundedVOR).length
          },
          { id: 'PAYROLL_SELF_BILLING', label: 'Friday Self-Billing', icon: Receipt }
        ].map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => {
                setActiveTab(tab.id as any);
                if (onTabChange) onTabChange(tab.id);
              }}
              className={`flex items-center gap-1.5 whitespace-nowrap px-3.5 py-2.5 font-bold transition-all border-b-2 ${
                isActive
                  ? 'border-emerald-500 text-emerald-400 bg-slate-800/40 rounded-t-lg'
                  : 'border-transparent text-slate-400 hover:text-slate-200'
              }`}
            >
              <Icon className="h-3.5 w-3.5" />
              <span>{tab.label}</span>
              {tab.badge && tab.badge > 0 && (
                <span className="rounded-full bg-rose-600 px-1.5 py-0.2 text-[10px] font-bold text-white">
                  {tab.badge}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* TAB 1: SITES DIRECTORY */}
      {activeTab === 'SITES' && (
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
              <input
                type="text"
                value={siteSearch}
                onChange={(e) => setSiteSearch(e.target.value)}
                placeholder="Search delivery site by name or address..."
                className="w-full rounded-xl border border-slate-700 bg-slate-900 pl-9 pr-3 py-2 text-xs text-slate-100 placeholder:text-slate-500 focus:border-amber-500 focus:outline-none"
              />
            </div>

            <button
              onClick={handleExportComplianceReport}
              className="flex items-center gap-1.5 rounded-xl border border-slate-700 bg-slate-900 hover:bg-slate-800 px-3 py-2 text-xs font-semibold text-slate-300 transition-colors"
            >
              <Download className="h-3.5 w-3.5 text-amber-400" />
              <span>Export Audit Package</span>
            </button>
          </div>

          <div className="space-y-3">
            {filteredSites.map((site) => (
              <div
                key={site.id}
                onClick={() => onSelectSiteForDetail(site)}
                className="group cursor-pointer rounded-2xl border border-slate-800 bg-slate-900 hover:bg-slate-850 p-4 transition-all shadow-md hover:border-slate-700 space-y-3"
              >
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <span className="text-[10px] font-semibold text-amber-400 uppercase tracking-wider">
                      {site.depotZone}
                    </span>
                    <h3 className="text-base font-bold text-slate-100 group-hover:text-amber-400 transition-colors">
                      {site.title}
                    </h3>
                    <p className="text-xs text-slate-400 flex items-center gap-1 mt-0.5">
                      <MapPin className="h-3 w-3 text-slate-500 shrink-0" />
                      <span>{site.address}</span>
                    </p>
                  </div>

                  <div className="flex flex-col items-end gap-1 shrink-0">
                    <span
                      className={`rounded-full px-2.5 py-0.5 text-[10px] font-bold border ${
                        site.overallRiskLevel === 'CRITICAL'
                          ? 'bg-rose-500/20 text-rose-400 border-rose-500/30'
                          : site.overallRiskLevel === 'HIGH'
                          ? 'bg-orange-500/20 text-orange-400 border-orange-500/30'
                          : 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30'
                      }`}
                    >
                      {site.overallRiskLevel} RISK (HSE {site.overallScore}/25)
                    </span>
                    <span className="text-[10px] text-slate-500 font-mono">v{site.version}.0 Published</span>
                  </div>
                </div>

                {/* Quick specs pill grid */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-[11px]">
                  <div className="rounded bg-slate-950 p-2 border border-slate-800">
                    <span className="text-slate-400">Security Gate: </span>
                    <span className="font-mono font-bold text-amber-400">{site.businessSection.gateSecurityCode}</span>
                  </div>
                  <div className="rounded bg-slate-950 p-2 border border-slate-800">
                    <span className="text-slate-400">Clearance: </span>
                    <span className="font-bold text-slate-200">{formatHeightBoth(site.businessSection.vehicleConstraints.maxHeightMeters)}</span>
                  </div>
                  <div className="rounded bg-slate-950 p-2 border border-slate-800">
                    <span className="text-slate-400">Hazards: </span>
                    <span className="font-bold text-slate-200">{site.businessSection.baselineHazards.length} Items</span>
                  </div>
                  <div className="rounded bg-slate-950 p-2 border border-slate-800">
                    <span className="text-slate-400">Manager: </span>
                    <span className="font-bold text-slate-200">{site.businessSection.siteManager.name.split(' ')[0]}</span>
                  </div>
                </div>

                <div className="flex items-center justify-between pt-1 border-t border-slate-800/80 text-xs">
                  <span className="text-slate-400 text-[11px]">
                    Last updated: {new Date(site.updatedAt).toLocaleDateString()} by {site.auditHistory[0]?.user || 'Operations'}
                  </span>
                  <span className="text-amber-400 font-semibold flex items-center gap-1 group-hover:translate-x-1 transition-transform">
                    Inspect Site Risk Matrix <ChevronRight className="h-3.5 w-3.5" />
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 2: DRIVER SIGN-OFFS & MODIFICATIONS */}
      {activeTab === 'APPROVALS' && (
        <div className="space-y-4">
          <div className="rounded-xl border border-slate-800 bg-slate-900 p-4 space-y-1">
            <h2 className="text-sm font-bold text-slate-100 flex items-center gap-2">
              <FileCheck className="h-4 w-4 text-amber-400" />
              Driver Field Observations & Baseline Modification Queue
            </h2>
            <p className="text-xs text-slate-400">
              When drivers experience on-site changes (such as rotated gate codes, temporary low scaffolding, or new bay rules), their submissions appear here for management review and official baseline sign-off.
            </p>
          </div>

          {allPendingModifications.length === 0 ? (
            <div className="rounded-2xl border border-slate-800 bg-slate-900/50 p-8 text-center text-slate-400">
              <CheckCircle2 className="mx-auto h-8 w-8 text-emerald-400 mb-2" />
              <p className="font-semibold text-slate-200">Queue Clear: All Driver Submissions Signed Off</p>
              <p className="text-xs text-slate-500 mt-0.5">
                Site baselines are currently 100% in sync with verified driver observations.
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {allPendingModifications.map(({ site, mod }) => (
                <div
                  key={mod.id}
                  className="rounded-2xl border border-amber-500/30 bg-slate-900 p-4 space-y-3 shadow-lg"
                >
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <span className="rounded bg-amber-500/20 px-2 py-0.5 text-[10px] font-bold text-amber-400 border border-amber-500/30">
                        {site.title}
                      </span>
                      <h3 className="text-sm font-bold text-slate-100 mt-1">
                        Proposed Modification: <span className="text-amber-400">{mod.fieldTarget}</span>
                      </h3>
                      <p className="text-[11px] text-slate-400">
                        Submitted by <strong className="text-slate-300">{mod.driverName}</strong> ({mod.driverPhone}) on {new Date(mod.date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </p>
                    </div>

                    <span className="rounded bg-rose-500/20 px-2 py-0.5 text-[10px] font-bold text-rose-400 border border-rose-500/30">
                      ACTION REQUIRED
                    </span>
                  </div>

                  {/* Diff Box: Original vs Proposed */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                    <div className="rounded-lg bg-slate-950 p-3 border border-slate-800">
                      <div className="text-[10px] uppercase font-bold text-slate-500">Current Site Baseline</div>
                      <div className="font-mono text-slate-300 mt-1 font-semibold">{mod.originalValue}</div>
                    </div>

                    <div className="rounded-lg bg-amber-500/10 p-3 border border-amber-500/30">
                      <div className="text-[10px] uppercase font-bold text-amber-400">Driver Proposed Value</div>
                      <div className="font-mono text-amber-300 mt-1 font-bold">{mod.proposedValue}</div>
                    </div>
                  </div>

                  {/* Reason & Evidence Photo */}
                  <div className="rounded-lg bg-slate-950 p-3 border border-slate-800 text-xs space-y-2">
                    <div>
                      <span className="font-semibold text-slate-300">Driver Justification: </span>
                      <span className="text-slate-400">{mod.reason}</span>
                    </div>

                    {mod.evidencePhoto && (
                      <div className="pt-2 border-t border-slate-800 flex items-center gap-3">
                        <img
                          src={mod.evidencePhoto}
                          alt="Evidence thumbnail"
                          className="h-16 w-24 object-cover rounded-lg border border-slate-700"
                        />
                        <span className="text-[11px] text-slate-400">
                          Photo evidence captured live by driver on site
                        </span>
                      </div>
                    )}
                  </div>

                  {/* Action Buttons */}
                  <div className="flex items-center justify-end gap-2 pt-1 border-t border-slate-800">
                    <button
                      onClick={() =>
                        onRejectModification(
                          site.id,
                          mod.id,
                          'Declined by site manager: current baseline confirmed with yard security.'
                        )
                      }
                      className="flex items-center gap-1.5 rounded-lg border border-slate-700 bg-slate-950 hover:bg-slate-800 px-3 py-1.5 text-xs font-semibold text-rose-400 transition-colors"
                    >
                      <XCircle className="h-3.5 w-3.5" />
                      <span>Decline</span>
                    </button>

                    <button
                      onClick={() => handleApproveWithCelebration(site.id, mod.id)}
                      className="flex items-center gap-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 px-4 py-1.5 text-xs font-bold text-white shadow-md transition-all active:scale-95"
                    >
                      <CheckCircle2 className="h-3.5 w-3.5" />
                      <span>Approve & Sign-Off (Bump Site Version)</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* TAB 3: REGULATORY COMPLIANCE (ISO 45001 & 5x5 MATRIX) */}
      {activeTab === 'COMPLIANCE' && (
        <div className="space-y-4 text-xs">
          {/* DVSA Earned Recognition & London DVS Regulatory Hub */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-2">
            <div className="rounded-xl border border-emerald-500/40 bg-gradient-to-br from-emerald-950/40 to-slate-900 p-4 flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between">
                  <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 uppercase">
                    Statutory Scheme
                  </span>
                  <span className="text-[10px] text-slate-400 font-mono">KPI B1-B4 // D1-D4</span>
                </div>
                <h3 className="text-sm font-bold text-white mt-2 flex items-center gap-1.5">
                  <ShieldCheck className="w-4 h-4 text-emerald-400" />
                  DVSA Earned Recognition Scheme (ERS)
                </h3>
                <p className="text-xs text-slate-300 mt-1 leading-relaxed">
                  Real-time driver hours, walkaround defect reporting and automated XML statutory submission payload generator.
                </p>
              </div>
              <div className="mt-3 pt-3 border-t border-slate-800 flex items-center justify-between">
                <span className="text-emerald-400 font-bold text-xs">Score: 98.4% (GREEN PASS)</span>
                <button
                  onClick={() => setIsDvsaErsModalOpen(true)}
                  className="px-3 py-1.5 rounded-lg bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs shadow-md transition-all active:scale-95"
                >
                  Open ERS Portal
                </button>
              </div>
            </div>

            <div className="rounded-xl border border-blue-500/40 bg-gradient-to-br from-blue-950/40 to-slate-900 p-4 flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between">
                  <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-blue-500/20 text-blue-300 border border-blue-500/40 uppercase">
                    TfL Oct 2024 Mandate
                  </span>
                  <span className="text-[10px] text-slate-400 font-mono">0-5 Star Rating</span>
                </div>
                <h3 className="text-sm font-bold text-white mt-2 flex items-center gap-1.5">
                  <ShieldAlert className="w-4 h-4 text-blue-400" />
                  London DVS & Clean Air Zones (CAZ)
                </h3>
                <p className="text-xs text-slate-300 mt-1 leading-relaxed">
                  Direct Vision Standard safety permit audit, Progressive Safe System (PSS) equipment check and Birmingham/Bath/Bristol CAZ fee avoidance.
                </p>
              </div>
              <div className="mt-3 pt-3 border-t border-slate-800 flex items-center justify-between">
                <span className="text-blue-400 font-bold text-xs">Avoided: £550 / day PCN</span>
                <button
                  onClick={() => setIsDvsCazModalOpen(true)}
                  className="px-3 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs shadow-md transition-all active:scale-95"
                >
                  Check DVS & CAZ
                </button>
              </div>
            </div>
          </div>

          <div className="rounded-xl border border-slate-800 bg-slate-900 p-4 space-y-2">
            <div className="flex items-center justify-between">
              <h2 className="text-sm font-bold text-slate-100 flex items-center gap-2">
                <ShieldAlert className="h-4 w-4 text-amber-400" />
                ISO 45001 / HSE 5x5 Delivery Risk Matrix
              </h2>
              <button
                onClick={handleExportComplianceReport}
                className="flex items-center gap-1.5 rounded-lg bg-amber-500 hover:bg-amber-400 px-3 py-1.5 font-bold text-slate-950 text-xs shadow transition-colors"
              >
                <Download className="h-3.5 w-3.5" />
                <span>Export ISO 45001 PDF/JSON</span>
              </button>
            </div>
            <p className="text-slate-400 text-xs leading-relaxed">
              Real-time audit overview across all depots. The 5x5 matrix cross-references Likelihood (1: Very Unlikely to 5: Almost Certain) against Severity (1: Minor to 5: Catastrophic/Fatality).
            </p>
          </div>

          {/* 5x5 Interactive Matrix Visualizer */}
          <div className="rounded-2xl border border-slate-800 bg-slate-900 p-4 space-y-3">
            <div className="text-xs font-bold text-slate-200">Severity vs. Likelihood Distribution</div>

            <div className="grid grid-cols-5 gap-1.5 text-center font-mono">
              {[
                { score: 5, label: '5 (Catastrophic)', color: 'bg-rose-950/80 border-rose-600 text-rose-300' },
                { score: 4, label: '4 (Major)', color: 'bg-orange-950/80 border-orange-600 text-orange-300' },
                { score: 3, label: '3 (Moderate)', color: 'bg-amber-950/80 border-amber-600 text-amber-300' },
                { score: 2, label: '2 (Minor)', color: 'bg-emerald-950/80 border-emerald-600 text-emerald-300' },
                { score: 1, label: '1 (Negligible)', color: 'bg-slate-950 border-slate-700 text-slate-400' }
              ].map((row, rIdx) => (
                <div key={rIdx} className="space-y-1">
                  <div className="text-[10px] text-slate-400 font-sans font-semibold">{row.label}</div>
                  <div className={`p-2.5 rounded-lg border ${row.color} text-xs font-bold`}>
                    Score {row.score * 4}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Catalog of Baseline Hazards */}
          <div className="space-y-2">
            <h3 className="font-bold text-slate-200 text-xs">Monitored Hazards Across Network</h3>
            {sites.map((s) => (
              <div key={s.id} className="rounded-xl border border-slate-800 bg-slate-900 p-3.5 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-amber-400">{s.title}</span>
                  <span className="text-[10px] font-mono text-slate-400">
                    {s.businessSection.baselineHazards.length} Controls Active
                  </span>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1">
                  {s.businessSection.baselineHazards.map((h) => (
                    <div key={h.id} className="rounded-lg bg-slate-950 p-2.5 border border-slate-800 space-y-1">
                      <div className="flex items-center justify-between">
                        <span className="font-semibold text-slate-200">{h.hazard}</span>
                        <span className="text-[10px] font-bold text-amber-400 font-mono">
                          {h.riskRating}/25 ({h.riskLevel})
                        </span>
                      </div>
                      <div className="text-[10px] text-slate-400">
                        Controls: {h.controlMeasures.join(', ')}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 4: MANAGERS & ROLE ACCESS CONTROL */}
      {activeTab === 'ACCESS_CONTROL' && (
        <UserAccessControlPortal
          onImpersonateUser={(user) => {
            if (onImpersonateUser) {
              onImpersonateUser(user);
            } else if (user.role === 'HGV_DRIVER') {
              onChangeRole('DRIVER');
            } else {
              onChangeRole('BUSINESS_ADMIN');
            }
          }}
        />
      )}

      {/* TAB 5: SUBSCRIPTION & BILLING SYSTEM */}
      {activeTab === 'SUBSCRIPTION' && (
        <div className="space-y-4 text-xs">
          <div className="rounded-xl border border-slate-800 bg-slate-900 p-4 space-y-2">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-sm font-bold text-slate-100 flex items-center gap-2">
                  <CreditCard className="h-4 w-4 text-amber-400" />
                  SiteRisk Pro Subscription & Fleet Billing
                </h2>
                <p className="text-slate-400 text-xs mt-0.5">
                  Manage recurring company subscription, driver seats, and invoice receipts.
                </p>
              </div>

              {/* Monthly vs Annual Toggle */}
              <div className="flex items-center rounded-lg border border-slate-800 bg-slate-950 p-0.5">
                <button
                  onClick={() => setBillingCycle('MONTHLY')}
                  className={`px-3 py-1 text-xs font-semibold rounded-md transition-all ${
                    billingCycle === 'MONTHLY' ? 'bg-amber-500 text-slate-950 font-bold' : 'text-slate-400'
                  }`}
                >
                  Monthly
                </button>
                <button
                  onClick={() => setBillingCycle('ANNUAL')}
                  className={`px-3 py-1 text-xs font-semibold rounded-md transition-all flex items-center gap-1 ${
                    billingCycle === 'ANNUAL' ? 'bg-amber-500 text-slate-950 font-bold' : 'text-slate-400'
                  }`}
                >
                  <span>Annual</span>
                  <span className="text-[9px] bg-emerald-500/30 text-emerald-300 px-1 rounded font-mono">SAVE 20%</span>
                </button>
              </div>
            </div>
          </div>

          {/* Pricing Tiers Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            {/* Starter Plan */}
            <div className="rounded-2xl border border-slate-800 bg-slate-900 p-4 space-y-3 flex flex-col justify-between">
              <div className="space-y-2">
                <div className="text-xs font-bold text-slate-400 uppercase tracking-wider">Starter Hub</div>
                <div className="text-2xl font-extrabold text-slate-100">
                  {billingCycle === 'MONTHLY' ? '£49' : '£39'}
                  <span className="text-xs font-normal text-slate-400">/mo</span>
                </div>
                <p className="text-slate-400 text-[11px]">Ideal for independent depots and single-site distribution yards.</p>
                <ul className="space-y-1.5 pt-2 text-[11px] text-slate-300">
                  <li>✓ Up to 5 Delivery Sites</li>
                  <li>✓ 25 Driver Access Accounts</li>
                  <li>✓ Google Places Verification</li>
                  <li>✓ Hands-Free TTS Voice Briefings</li>
                </ul>
              </div>
              <button
                onClick={() => {
                  setSelectedPlanToUpgrade('Starter Hub');
                  setShowCheckoutModal(true);
                }}
                className="w-full rounded-xl border border-slate-700 bg-slate-950 hover:bg-slate-800 py-2 font-bold text-slate-300 transition-colors"
              >
                Switch to Starter
              </button>
            </div>

            {/* Fleet Pro (Current Plan) */}
            <div className="rounded-2xl border-2 border-amber-500 bg-slate-900/90 p-4 space-y-3 flex flex-col justify-between relative shadow-xl shadow-amber-500/10">
              <div className="absolute -top-2.5 right-4 rounded-full bg-amber-500 px-2 py-0.5 text-[9px] font-extrabold uppercase text-slate-950">
                Current Active Plan
              </div>
              <div className="space-y-2">
                <div className="text-xs font-bold text-amber-400 uppercase tracking-wider">Fleet Pro</div>
                <div className="text-2xl font-extrabold text-slate-100">
                  {billingCycle === 'MONTHLY' ? '£199' : '£159'}
                  <span className="text-xs font-normal text-slate-400">/mo</span>
                </div>
                <p className="text-slate-400 text-[11px]">Comprehensive fleet safety with AI hazard modeling and video guides.</p>
                <ul className="space-y-1.5 pt-2 text-[11px] text-slate-200 font-medium">
                  <li>✓ Unlimited Delivery Sites & Depots</li>
                  <li>✓ 250 Fleet Drivers + PWA Offline Sync</li>
                  <li>✓ AI Hazard & Near-Miss Auto-Classifier</li>
                  <li>✓ Simulated Approach Video Walkthroughs</li>
                  <li>✓ ISO 45001 / HSE Risk Matrices & PDF Export</li>
                </ul>
              </div>
              <div className="rounded-xl bg-emerald-500/20 text-emerald-400 py-2 text-center font-bold text-xs border border-emerald-500/30">
                Active • Renews Oct 1st
              </div>
            </div>

            {/* Enterprise Plan */}
            <div className="rounded-2xl border border-slate-800 bg-slate-900 p-4 space-y-3 flex flex-col justify-between">
              <div className="space-y-2">
                <div className="text-xs font-bold text-purple-400 uppercase tracking-wider">Enterprise Network</div>
                <div className="text-2xl font-extrabold text-slate-100">
                  {billingCycle === 'MONTHLY' ? '£499' : '£399'}
                  <span className="text-xs font-normal text-slate-400">/mo</span>
                </div>
                <p className="text-slate-400 text-[11px]">Nationwide logistics haulage operations with ERP & TMS integration.</p>
                <ul className="space-y-1.5 pt-2 text-[11px] text-slate-300">
                  <li>✓ Unlimited Sites & Unlimited Drivers</li>
                  <li>✓ Custom Telematics & TMS API Integration</li>
                  <li>✓ Dedicated ISO 45001 Compliance Auditor</li>
                  <li>✓ 99.99% SLA & 24/7 Phone Support</li>
                </ul>
              </div>
              <button
                onClick={() => {
                  setSelectedPlanToUpgrade('Enterprise Network');
                  setShowCheckoutModal(true);
                }}
                className="w-full rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 py-2 font-bold text-slate-950 shadow transition-all"
              >
                Upgrade to Enterprise
              </button>
            </div>
          </div>

          {/* Usage Gauges */}
          <div className="rounded-2xl border border-slate-800 bg-slate-900 p-4 space-y-3">
            <h3 className="font-bold text-slate-200 text-xs">Current Billing Period Resource Consumption</h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div className="space-y-1">
                <div className="flex justify-between text-slate-400 text-[11px]">
                  <span>Active Sites Monitored</span>
                  <span className="font-bold text-slate-200">{sites.length} / Unlimited</span>
                </div>
                <div className="h-2 rounded-full bg-slate-950 overflow-hidden">
                  <div className="h-full bg-amber-500 w-1/4 rounded-full" />
                </div>
              </div>

              <div className="space-y-1">
                <div className="flex justify-between text-slate-400 text-[11px]">
                  <span>Driver Mobile Seats</span>
                  <span className="font-bold text-slate-200">48 / 250</span>
                </div>
                <div className="h-2 rounded-full bg-slate-950 overflow-hidden">
                  <div className="h-full bg-emerald-500 w-1/5 rounded-full" />
                </div>
              </div>

              <div className="space-y-1">
                <div className="flex justify-between text-slate-400 text-[11px]">
                  <span>AI Risk Syntheses</span>
                  <span className="font-bold text-slate-200">124 / 500</span>
                </div>
                <div className="h-2 rounded-full bg-slate-950 overflow-hidden">
                  <div className="h-full bg-blue-500 w-1/4 rounded-full" />
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Payment Checkout Modal */}
      {showCheckoutModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/85 backdrop-blur-md animate-in fade-in">
          <div className="relative w-full max-w-md rounded-2xl border border-slate-800 bg-slate-900 p-5 shadow-2xl text-slate-100">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <div className="flex items-center gap-2">
                <CreditCard className="h-5 w-5 text-amber-400" />
                <h3 className="font-bold text-slate-100">
                  {selectedPlanToUpgrade ? `Upgrade to ${selectedPlanToUpgrade}` : 'Manage Subscription'}
                </h3>
              </div>
              <button
                onClick={() => {
                  setShowCheckoutModal(false);
                  setCheckoutSuccess(false);
                }}
                className="text-slate-400 hover:text-white"
              >
                ✕
              </button>
            </div>

            {checkoutSuccess ? (
              <div className="p-4 text-center space-y-2">
                <CheckCircle2 className="h-10 w-10 text-emerald-400 mx-auto" />
                <h4 className="font-bold text-slate-100">Subscription Updated!</h4>
                <p className="text-xs text-slate-400">
                  Your recurring fleet subscription has been activated. A VAT invoice has been sent to billing@fleetops.co.uk.
                </p>
                <button
                  onClick={() => {
                    setShowCheckoutModal(false);
                    setCheckoutSuccess(false);
                  }}
                  className="mt-2 w-full rounded-xl bg-amber-500 py-2 text-xs font-bold text-slate-950"
                >
                  Return to Dashboard
                </button>
              </div>
            ) : (
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  setCheckoutSuccess(true);
                  try {
                    confetti({ particleCount: 70, spread: 60 });
                  } catch (_e) {}
                }}
                className="space-y-3 pt-3 text-xs"
              >
                <div>
                  <label className="block text-slate-300 mb-1">Company / Organization</label>
                  <input
                    type="text"
                    defaultValue="Fleet Logistics Group UK"
                    className="w-full rounded-lg border border-slate-700 bg-slate-950 p-2 text-slate-100"
                  />
                </div>

                <div>
                  <label className="block text-slate-300 mb-1">Card Number (Simulated Checkout)</label>
                  <input
                    type="text"
                    defaultValue="•••• •••• •••• 4242"
                    className="w-full rounded-lg border border-slate-700 bg-slate-950 p-2 font-mono text-slate-100"
                  />
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="block text-slate-300 mb-1">Expires</label>
                    <input
                      type="text"
                      defaultValue="12/28"
                      className="w-full rounded-lg border border-slate-700 bg-slate-950 p-2 font-mono text-slate-100"
                    />
                  </div>
                  <div>
                    <label className="block text-slate-300 mb-1">CVC</label>
                    <input
                      type="text"
                      defaultValue="883"
                      className="w-full rounded-lg border border-slate-700 bg-slate-950 p-2 font-mono text-slate-100"
                    />
                  </div>
                </div>

                <div className="pt-2">
                  <button
                    type="submit"
                    className="w-full rounded-xl bg-amber-500 hover:bg-amber-400 py-2.5 font-bold text-slate-950 shadow"
                  >
                    Confirm Recurring Plan
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}

      {/* TAB 6: SHIFT MARKETPLACE & AUTOMATED IR35 TAX SHIELD */}
      {activeTab === 'SHIFTS_MARKETPLACE' && (
        <div className="space-y-4 text-xs">
          <div className="rounded-xl border border-slate-800 bg-slate-900 p-4 space-y-3">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <h2 className="text-sm font-bold text-slate-100 flex items-center gap-2">
                  <Briefcase className="h-4 w-4 text-amber-400" />
                  ReliefHGV Shift Management & IR35 Tax Shield
                </h2>
                <p className="text-[11px] text-slate-400 mt-0.5">
                  Proximity shift dispatch (30-mile candidate radius) • Automated Section 44 ITEPA Safe-Harbour • Redlock Atomic Dispatch
                </p>
              </div>
              <button
                onClick={() => setIsShiftModalOpen(true)}
                className="flex items-center gap-1.5 rounded-xl bg-amber-500 hover:bg-amber-400 px-4 py-2 font-bold text-slate-950 shadow transition-all active:scale-95"
              >
                <Briefcase className="h-4 w-4" />
                <span>Launch Full Shift Marketplace</span>
              </button>
            </div>

            {/* Quick Metrics */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-2 border-t border-slate-800">
              <div className="rounded-lg bg-slate-950 p-2.5 border border-slate-800">
                <div className="text-slate-400 text-[10px]">Open Freight Shifts</div>
                <div className="text-lg font-black text-white mt-0.5">{initialMarketplaceShifts.length}</div>
                <div className="text-[10px] text-emerald-400">Class 1 & 2 Available</div>
              </div>
              <div className="rounded-lg bg-slate-950 p-2.5 border border-slate-800">
                <div className="text-slate-400 text-[10px]">IR35 Safe-Harbour Status</div>
                <div className="text-lg font-black text-emerald-400 mt-0.5">Sec 44 Shielded</div>
                <div className="text-[10px] text-slate-400">Zero Client Tax Liability</div>
              </div>
              <div className="rounded-lg bg-slate-950 p-2.5 border border-slate-800">
                <div className="text-slate-400 text-[10px]">Dispatch Proximity</div>
                <div className="text-lg font-black text-white mt-0.5">&lt; 30 Miles</div>
                <div className="text-[10px] text-amber-400">DVSA Rest Rule Compliant</div>
              </div>
              <div className="rounded-lg bg-slate-950 p-2.5 border border-slate-800">
                <div className="text-slate-400 text-[10px]">Concurrency Protection</div>
                <div className="text-lg font-black text-amber-300 mt-0.5">Redlock Active</div>
                <div className="text-[10px] text-slate-400">120s Atomic Shift Lock</div>
              </div>
            </div>

            {/* Shifts Table Preview */}
            <div className="rounded-xl border border-slate-800 bg-slate-950 overflow-hidden">
              <table className="w-full text-left border-collapse">
                <thead className="bg-slate-900 text-slate-400 text-[10px] uppercase font-bold border-b border-slate-800">
                  <tr>
                    <th className="p-2.5">Ref</th>
                    <th className="p-2.5">Route / Title</th>
                    <th className="p-2.5">Depot</th>
                    <th className="p-2.5">Class</th>
                    <th className="p-2.5">Rate (£/hr)</th>
                    <th className="p-2.5">Tax Determination</th>
                    <th className="p-2.5 text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800 text-slate-300">
                  {initialMarketplaceShifts.slice(0, 4).map((s) => (
                    <tr key={s.id} className="hover:bg-slate-900/60">
                      <td className="p-2.5 font-mono text-amber-400 font-bold">{s.shiftRef}</td>
                      <td className="p-2.5 font-medium text-white">{s.title}</td>
                      <td className="p-2.5 text-slate-400">{s.siteName}</td>
                      <td className="p-2.5">
                        <span className="rounded bg-blue-500/20 px-1.5 py-0.5 text-[10px] font-bold text-blue-300">
                          {s.vehicleClass.replace('CAT_', '').replace('_CLASS', '')}
                        </span>
                      </td>
                      <td className="p-2.5 font-mono text-emerald-400 font-bold">£{s.baseHourlyRate.toFixed(2)}</td>
                      <td className="p-2.5">
                        <span className="rounded bg-slate-800 px-2 py-0.5 text-[10px] text-slate-300 border border-slate-700">
                          {s.ir35Status === 'INSIDE_IR35' ? 'Sec 44 Safe-Harbour' : 'B2B O-Licence'}
                        </span>
                      </td>
                      <td className="p-2.5 text-right">
                        <button
                          onClick={() => setIsShiftModalOpen(true)}
                          className="rounded bg-amber-500 hover:bg-amber-400 text-slate-950 px-2.5 py-1 text-[10px] font-bold"
                        >
                          View Shift
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* TAB 7: FLEET VOR DEFECT GROUNDING & DVSA COMPLIANCE */}
      {activeTab === 'FLEET_VOR_GROUNDING' && (
        <div className="space-y-4 text-xs">
          <div className="rounded-xl border border-slate-800 bg-slate-900 p-4 space-y-3">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <h2 className="text-sm font-bold text-slate-100 flex items-center gap-2">
                  <AlertOctagon className="h-4 w-4 text-red-400" />
                  Automated Fleet VOR Defect Grounding & DVSA Audit Log
                </h2>
                <p className="text-[11px] text-slate-400 mt-0.5">
                  Real-time TMS Dispatch Freeze for Safety-Critical Defects • IRTE Master Tech Torque Sign-off • Tamper-proof DVSA PDF
                </p>
              </div>
              <button
                onClick={() => setIsVorModalOpen(true)}
                className="flex items-center gap-1.5 rounded-xl bg-red-600 hover:bg-red-500 px-4 py-2 font-bold text-white shadow transition-all active:scale-95"
              >
                <AlertOctagon className="h-4 w-4" />
                <span>Launch Fleet VOR Console</span>
              </button>
            </div>

            {/* Quick Fleet Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 pt-2 border-t border-slate-800">
              {initialFleetVehicles.map((v) => (
                <div
                  key={v.id}
                  className={`rounded-xl border p-3 ${
                    v.isGroundedVOR
                      ? 'border-red-600/80 bg-red-950/30'
                      : 'border-slate-800 bg-slate-950'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="font-mono font-black text-black bg-amber-400 px-2 py-0.5 rounded text-xs">
                      {v.vehicleReg}
                    </div>
                    {v.isGroundedVOR ? (
                      <span className="rounded bg-red-500/20 border border-red-500/40 text-red-400 text-[10px] font-black px-1.5 py-0.5 animate-pulse">
                        RED VOR
                      </span>
                    ) : (
                      <span className="rounded bg-emerald-500/20 text-emerald-400 text-[10px] font-bold px-1.5 py-0.5">
                        ROADWORTHY
                      </span>
                    )}
                  </div>
                  <div className="mt-2 text-xs font-bold text-white">{v.makeModel}</div>
                  <div className="text-[10px] text-slate-400">Fleet #{v.fleetNumber}</div>

                  {v.isGroundedVOR ? (
                    <div className="mt-2 text-[10px] text-red-300 line-clamp-2">
                      {v.vorReason}
                    </div>
                  ) : (
                    <div className="mt-2 text-[10px] text-emerald-400">
                      Last Walkaround: Nil defects reported
                    </div>
                  )}

                  <div className="mt-2 pt-2 border-t border-slate-800 flex justify-end">
                    <button
                      onClick={() => setIsVorModalOpen(true)}
                      className="text-[10px] font-bold text-amber-400 hover:underline"
                    >
                      Inspect Dossier &rarr;
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* TAB 8: FRIDAY SELF-BILLING PAYROLL & FACTORING SURCHARGE */}
      {activeTab === 'PAYROLL_SELF_BILLING' && (
        <div className="space-y-4 text-xs">
          <div className="rounded-xl border border-slate-800 bg-slate-900 p-4 space-y-3">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <h2 className="text-sm font-bold text-slate-100 flex items-center gap-2">
                  <Receipt className="h-4 w-4 text-emerald-400" />
                  Friday Self-Billing Payroll & Factoring Surcharge Engine
                </h2>
                <p className="text-[11px] text-slate-400 mt-0.5">
                  HMRC VAT Notice 700/62 Self-Billing • Tuesday 17:00 Dispute Cut-Off • Direct Debit vs Net-30 Factoring (3.5%)
                </p>
              </div>
              <button
                onClick={() => setIsPayrollModalOpen(true)}
                className="flex items-center gap-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 px-4 py-2 font-bold text-white shadow transition-all active:scale-95"
              >
                <Receipt className="h-4 w-4" />
                <span>Launch Full Payroll Console</span>
              </button>
            </div>

            {/* Invoices Summary Table */}
            <div className="rounded-xl border border-slate-800 bg-slate-950 overflow-hidden">
              <table className="w-full text-left border-collapse">
                <thead className="bg-slate-900 text-slate-400 text-[10px] uppercase font-bold border-b border-slate-800">
                  <tr>
                    <th className="p-2.5">Invoice #</th>
                    <th className="p-2.5">Driver (Self-Billee)</th>
                    <th className="p-2.5">Client Haulier</th>
                    <th className="p-2.5">Payment Rail</th>
                    <th className="p-2.5">Gross Pay</th>
                    <th className="p-2.5">Net Payable</th>
                    <th className="p-2.5 text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800 text-slate-300">
                  {initialPayrollInvoices.map((inv) => (
                    <tr key={inv.invoiceNumber} className="hover:bg-slate-900/60">
                      <td className="p-2.5 font-mono text-amber-400 font-bold">{inv.invoiceNumber}</td>
                      <td className="p-2.5 font-medium text-white">{inv.driverName}</td>
                      <td className="p-2.5 text-slate-400">{inv.haulierName}</td>
                      <td className="p-2.5">
                        <span className={`rounded px-1.5 py-0.5 text-[10px] font-bold ${
                          inv.paymentMethod === 'NET_30_FACTORING'
                            ? 'bg-blue-500/20 text-blue-300'
                            : 'bg-emerald-500/20 text-emerald-300'
                        }`}>
                          {inv.paymentMethod === 'NET_30_FACTORING' ? 'Factoring (3.5%)' : 'Direct Debit'}
                        </span>
                      </td>
                      <td className="p-2.5 font-mono">£{inv.grossTotal.toFixed(2)}</td>
                      <td className="p-2.5 font-mono text-emerald-400 font-bold">£{inv.netPayable.toFixed(2)}</td>
                      <td className="p-2.5 text-right">
                        <button
                          onClick={() => setIsPayrollModalOpen(true)}
                          className="rounded bg-slate-800 hover:bg-slate-700 text-white px-2.5 py-1 text-[10px] font-bold border border-slate-700"
                        >
                          View Self-Bill
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* PHASE 4 MODALS */}
      <ShiftMarketplaceModal
        isOpen={isShiftModalOpen}
        onClose={() => setIsShiftModalOpen(false)}
        userRole="business"
      />

      <FleetVORGroundingModal
        isOpen={isVorModalOpen}
        onClose={() => setIsVorModalOpen(false)}
        userRole="business"
      />

      <SelfBillingPayrollModal
        isOpen={isPayrollModalOpen}
        onClose={() => setIsPayrollModalOpen(false)}
        userRole="business"
      />
      {isDvsaErsModalOpen && (
        <DVSACERSPortalModal onClose={() => setIsDvsaErsModalOpen(false)} />
      )}

      {isDvsCazModalOpen && (
        <DVSandCleanAirZoneModal onClose={() => setIsDvsCazModalOpen(false)} />
      )}

      {/* Google Business Profile OAuth 2.0 & Depot Verification Modal */}
      <GoogleBusinessProfileOAuthModal
        isOpen={isGbpModalOpen}
        onClose={() => setIsGbpModalOpen(false)}
        onVerifiedDepotClaimed={(depot) => {
          setVerifiedClaim(depot);
          onOpenCreateSite();
        }}
        initialSearchQuery="Magna Park"
      />

    </div>
  );
};
