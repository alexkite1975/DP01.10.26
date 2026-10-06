'use client';
import React, { useState, useRef, useEffect } from 'react';
import {
  ShieldCheck,
  Building2,
  Truck,
  Sparkles,
  Volume2,
  VolumeX,
  WifiOff,
  ScanLine,
  ChevronDown,
  Briefcase,
  AlertOctagon,
  FileCheck,
  ShieldAlert,
  Plus,
  SlidersHorizontal,
  CreditCard,
  Layers,
  ArrowLeft,
  Activity,
  FileText,
  Users,
  Home,
  Repeat,
  Shield,
  Navigation
} from 'lucide-react';
import { AppPageView, UserRole, DriverVehicleProfile, SiteRiskAssessment } from '../../types';
import { tts } from '../../services/ttsService';

export interface QuickNavBarProps {
  currentPage: AppPageView;
  onNavigate: (page: AppPageView) => void;
  currentRole: UserRole;
  onRoleChange: (role: UserRole) => void;
  selectedSite: SiteRiskAssessment | null;
  driverVehicle: DriverVehicleProfile;
  onOpenVehicleModal: () => void;
  onOpenQuickHazard: () => void;
  onOpenScanModal?: () => void;
  onOpenVoiceCopilot?: () => void;
  onOpenInMotionHud?: () => void;
  onOpenTachographScanner?: () => void;
  onOpenThreeTapAudit?: () => void;
  onOpenLaybyRadar?: () => void;
  onOpenCbRadio?: () => void;
  onOpenBulkheadSync?: () => void;
  onOpenShiftMarketplace?: () => void;
  onOpenFleetVOR?: () => void;
  onOpenPayroll?: () => void;
  onOpenHgvRouter?: () => void;
  onOpenAiVision?: () => void;
  onOpenDvsaErs?: () => void;
  onOpenDvsCaz?: () => void;
  onOpenTrailerFleet?: () => void;
  onOpenInductionGatekeeper?: () => void;
  onOpenCongestionTracker?: () => void;
  onOpenCreateSite?: () => void;
  onOpenHxWorkflow?: () => void;
  onOpenBreakEven?: () => void;
  onOpenThreeTierStack?: () => void;
  onOpenBusinessPlan?: () => void;
  onOpenDynamicPricing?: () => void;
  onOpenDriverChecklist?: () => void;
  onOpenRouteOptimizer?: () => void;
  onOpenRecruitmentPlan?: () => void;
  pendingReviewCount: number;
  activeBusinessTab?: string;
  onSelectBusinessTab?: (tab: string) => void;
  onReturnToDriverCockpit?: () => void;
  onReturnToSuiteLanding?: () => void;
}

export const QuickNavBar: React.FC<QuickNavBarProps> = ({
  currentPage,
  onNavigate,
  currentRole,
  onRoleChange,
  selectedSite,
  driverVehicle,
  onOpenVehicleModal,
  onOpenQuickHazard,
  onOpenScanModal,
  onOpenVoiceCopilot,
  onOpenInMotionHud,
  onOpenTachographScanner,
  onOpenThreeTapAudit,
  onOpenLaybyRadar,
  onOpenCbRadio,
  onOpenBulkheadSync,
  onOpenShiftMarketplace,
  onOpenFleetVOR,
  onOpenPayroll,
  onOpenHgvRouter,
  onOpenAiVision,
  onOpenDvsaErs,
  onOpenDvsCaz,
  onOpenTrailerFleet,
  onOpenInductionGatekeeper,
  onOpenCongestionTracker,
  onOpenCreateSite,
  onOpenHxWorkflow,
  onOpenBreakEven,
  onOpenThreeTierStack,
  onOpenBusinessPlan,
  onOpenDynamicPricing,
  onOpenDriverChecklist,
  onOpenRouteOptimizer,
  onOpenRecruitmentPlan,
  pendingReviewCount,
  activeBusinessTab = 'SITES',
  onSelectBusinessTab,
  onReturnToDriverCockpit,
  onReturnToSuiteLanding
}) => {
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [isComplianceMenuOpen, setIsComplianceMenuOpen] = useState(false);
  const complianceMenuRef = useRef<HTMLDivElement>(null);

  // Monitor TTS speaking state
  useEffect(() => {
    const checkTTS = () => setIsSpeaking(tts.isSpeaking());
    const interval = setInterval(checkTTS, 500);
    return () => clearInterval(interval);
  }, []);

  // Monitor network online/offline state
  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  // Close dropdowns on outside click
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (complianceMenuRef.current && !complianceMenuRef.current.contains(event.target as Node)) {
        setIsComplianceMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const businessTabs = [
    {
      id: 'SITES',
      label: 'Depot Sites & Yards',
      icon: Building2,
      isActive: currentPage === 'business' && activeBusinessTab === 'SITES'
    },
    {
      id: 'APPROVALS',
      label: 'Driver Sign-Offs',
      icon: FileCheck,
      badge: pendingReviewCount > 0 ? pendingReviewCount : undefined,
      badgeColor: 'bg-rose-500 text-white',
      isActive: currentPage === 'business' && activeBusinessTab === 'APPROVALS'
    },
    {
      id: 'COMPLIANCE',
      label: 'DVSA ERS & Matrix',
      icon: ShieldAlert,
      isActive: currentPage === 'business' && activeBusinessTab === 'COMPLIANCE'
    },
    {
      id: 'FLEET_VOR_GROUNDING',
      label: 'Fleet VOR & Grounding',
      icon: AlertOctagon,
      isActive: currentPage === 'business' && activeBusinessTab === 'FLEET_VOR_GROUNDING'
    },
    {
      id: 'SHIFTS_MARKETPLACE',
      label: 'Freight & Relief Shifts',
      icon: Briefcase,
      isActive: currentPage === 'business' && (activeBusinessTab === 'SHIFTS_MARKETPLACE' || activeBusinessTab === 'PAYROLL_SELF_BILLING')
    },
    {
      id: 'ACCESS_CONTROL',
      label: 'Users & Permissions',
      icon: Users,
      isActive: currentPage === 'business' && activeBusinessTab === 'ACCESS_CONTROL'
    }
  ];

  const handleTabClick = (tabId: string) => {
    if (currentPage !== 'business') {
      onNavigate('business');
    }
    if (onSelectBusinessTab) {
      onSelectBusinessTab(tabId);
    }
  };

  return (
    <header className="sticky top-0 z-40 w-full border-b border-slate-800 bg-slate-950/95 backdrop-blur-md px-4 sm:px-6 py-2.5 shadow-xl text-slate-100">
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-3 sm:gap-6">
        
        {/* LEFT: BRAND IDENTITY & SUITE HUB LINK */}
        <div className="flex items-center gap-3 sm:gap-4 shrink-0">
          <button
            onClick={onReturnToSuiteLanding}
            className="flex items-center gap-2.5 text-left group focus:outline-none"
            title="Return to Drive Partners Suite Hub"
          >
            <div className="flex h-10 w-10 items-center justify-center rounded-xl font-black shadow-lg bg-gradient-to-br from-cyan-500 to-blue-600 text-slate-950 shadow-cyan-500/20 group-hover:scale-105 transition-transform">
              DP
            </div>
            <div>
              <div className="flex items-center gap-2 leading-none">
                <span className="font-extrabold tracking-tight text-white text-base group-hover:text-cyan-400 transition-colors">
                  Drive Partners <span className="text-cyan-400 font-mono text-sm">2.0</span>
                </span>
                <span className="rounded px-1.5 py-0.5 text-[9px] font-black uppercase tracking-wider bg-cyan-500/10 text-cyan-300 border border-cyan-500/30">
                  Fleet Command
                </span>
              </div>
              <p className="text-[11px] text-slate-400 font-medium mt-0.5">
                ReliefHGV Enterprise • Transport & Logistics Suite
              </p>
            </div>
          </button>

          {/* RETURN TO DRIVE PARTNERS SUITE HUB BUTTON */}
          {onReturnToSuiteLanding && (
            <button
              onClick={onReturnToSuiteLanding}
              className="flex items-center gap-1.5 rounded-xl border border-slate-700 bg-slate-900/90 hover:bg-cyan-500 hover:text-slate-950 hover:border-cyan-400 text-slate-200 px-3 py-1.5 text-xs font-bold transition-all shadow-sm group"
              title="Return to Drive Partners Suite Landing Page"
            >
              <Home className="h-3.5 w-3.5 text-cyan-400 group-hover:text-slate-950 transition-colors" />
              <span className="hidden sm:inline">Suite Hub</span>
            </button>
          )}

          {/* HAULAGE EXCHANGE (HX) DIRECT NAVIGATION BUTTON */}
          {onOpenHxWorkflow && (
            <button
              onClick={onOpenHxWorkflow}
              className="flex items-center gap-1.5 rounded-xl border border-cyan-500/40 bg-cyan-950/70 hover:bg-cyan-500 hover:text-slate-950 text-cyan-300 px-3 py-1.5 text-xs font-extrabold transition-all shadow-sm shadow-cyan-500/10 group cursor-pointer"
              title="Open Haulage Exchange (HX) 6-Step Workflow"
            >
              <Repeat className="h-3.5 w-3.5 text-cyan-400 group-hover:text-slate-950 transition-colors" />
              <span className="hidden md:inline">Haulage Exchange (HX)</span>
              <span className="md:hidden">HX</span>
            </button>
          )}
        </div>

        {/* CENTER: PRIMARY ENTERPRISE DESKTOP TABS */}
        <nav className="hidden lg:flex items-center gap-1 rounded-xl bg-slate-900/90 p-1 border border-slate-800/80 shadow-inner">
          {businessTabs.map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => handleTabClick(tab.id)}
                className={`flex items-center gap-2 rounded-lg px-3 py-1.5 text-xs font-bold transition-all ${
                  tab.isActive
                    ? 'bg-cyan-500/15 text-cyan-300 shadow-sm border border-cyan-500/30'
                    : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
                }`}
              >
                <Icon className={`h-3.5 w-3.5 ${tab.isActive ? 'text-cyan-400' : 'text-slate-400'}`} />
                <span>{tab.label}</span>
                {tab.badge !== undefined && (
                  <span className={`ml-1 rounded-full px-1.5 py-0.2 text-[9px] font-black animate-pulse ${tab.badgeColor || 'bg-slate-700 text-slate-200'}`}>
                    {tab.badge}
                  </span>
                )}
              </button>
            );
          })}
        </nav>

        {/* RIGHT ACTION CLUSTER: VEHICLE SPECS, TACHO SCAN & FAST ACTIONS */}
        <div className="flex items-center gap-2 shrink-0">
          
          {/* TTS Audio Indicator */}
          {isSpeaking && (
            <button
              onClick={() => tts.stop()}
              className="flex items-center gap-1 rounded-full bg-cyan-500/20 px-2.5 py-1 text-xs font-bold text-cyan-300 border border-cyan-500/40 animate-pulse hover:bg-cyan-500/30"
              title="Voice narration active. Click to stop."
            >
              <Volume2 className="h-3.5 w-3.5 text-cyan-400 animate-bounce" />
              <span className="hidden xl:inline text-[11px]">Speaking</span>
              <VolumeX className="h-3 w-3 text-cyan-400 ml-0.5" />
            </button>
          )}

          {/* Offline Status */}
          {!isOnline && (
            <div
              className="flex items-center gap-1 rounded-lg bg-amber-500/20 px-2 py-1 text-xs font-bold text-amber-300 border border-amber-500/40"
              title="Operating offline with cached site data."
            >
              <WifiOff className="h-3.5 w-3.5 text-amber-400" />
              <span className="hidden xl:inline text-[11px]">Offline</span>
            </div>
          )}

          {/* Quick Vehicle Profile Badge */}
          <button
            onClick={onOpenVehicleModal}
            className="flex items-center gap-1.5 rounded-xl border border-slate-800 bg-slate-900/90 hover:border-slate-700 px-2.5 py-1.5 text-xs font-bold text-slate-200 transition-all shadow-xs"
            title={`Vehicle Reg: ${driverVehicle.vehicleReg}, Height: ${driverVehicle.heightMeters}m. Click to configure.`}
          >
            <Truck className="h-3.5 w-3.5 text-amber-400 shrink-0" />
            <span className="font-mono text-[11px] font-bold text-amber-300">
              {driverVehicle.vehicleReg}
            </span>
            <span className="hidden sm:inline text-[11px] font-semibold text-slate-400">
              ({driverVehicle.heightMeters}m)
            </span>
            <SlidersHorizontal className="h-3 w-3 text-slate-400 ml-0.5" />
          </button>

          {/* 1-Click Tachograph Printout Scanner */}
          {onOpenTachographScanner && (
            <button
              onClick={onOpenTachographScanner}
              className="flex items-center gap-1.5 rounded-xl border border-blue-500/40 bg-blue-950/60 hover:bg-blue-900/80 px-2.5 sm:px-3 py-1.5 text-xs font-bold text-blue-300 shadow-xs transition-all active:scale-95"
              title="Scan or upload 24h digital tachograph printout roll"
            >
              <ScanLine className="h-3.5 w-3.5 text-blue-400" />
              <span className="hidden md:inline">Scan Tacho</span>
              <span className="rounded bg-blue-500/30 text-blue-200 text-[9px] font-black px-1 py-0.2 uppercase">
                OCR
              </span>
            </button>
          )}

          {/* Compliance & Audit Popover Menu */}
          <div className="relative" ref={complianceMenuRef}>
            <button
              onClick={() => setIsComplianceMenuOpen(!isComplianceMenuOpen)}
              className={`flex items-center gap-1.5 rounded-xl border px-2.5 sm:px-3 py-1.5 text-xs font-bold transition-all shadow-xs ${
                isComplianceMenuOpen
                  ? 'bg-slate-800 text-cyan-400 border-cyan-500/50'
                  : 'border-slate-800 bg-slate-900/90 text-slate-200 hover:bg-slate-850 hover:border-slate-700'
              }`}
              title="Compliance Standards & Audit Log"
            >
              <ShieldCheck className="h-3.5 w-3.5 text-cyan-400" />
              <span className="hidden sm:inline">Compliance</span>
              <ChevronDown className={`h-3 w-3 transition-transform ${isComplianceMenuOpen ? 'rotate-180 text-cyan-400' : 'text-slate-400'}`} />
            </button>

            {isComplianceMenuOpen && (
              <div className="absolute right-0 mt-2 w-72 rounded-2xl bg-slate-900 border border-slate-700/80 p-2 shadow-2xl z-50 animate-in fade-in zoom-in-95 space-y-1">
                <div className="px-3 py-1.5 border-b border-slate-800 flex items-center justify-between">
                  <span className="text-[11px] font-black uppercase tracking-wider text-cyan-400">
                    Fleet Compliance & Audit
                  </span>
                  <span className="text-[10px] font-mono text-emerald-400">DVSA ERS Certified</span>
                </div>

                {onOpenDvsaErs && (
                  <button
                    onClick={() => {
                      setIsComplianceMenuOpen(false);
                      onOpenDvsaErs();
                    }}
                    className="w-full flex items-center gap-2.5 rounded-xl p-2 text-left hover:bg-slate-800 transition-colors group"
                  >
                    <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                      <ShieldCheck className="h-4 w-4" />
                    </div>
                    <div>
                      <div className="text-xs font-bold text-slate-200 group-hover:text-emerald-400">DVSA Earned Recognition</div>
                      <div className="text-[10px] text-slate-400">KPIs B1-B4 & D1-D4 XML exports</div>
                    </div>
                  </button>
                )}

                {onOpenDvsCaz && (
                  <button
                    onClick={() => {
                      setIsComplianceMenuOpen(false);
                      onOpenDvsCaz();
                    }}
                    className="w-full flex items-center gap-2.5 rounded-xl p-2 text-left hover:bg-slate-800 transition-colors group"
                  >
                    <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-blue-500/20 text-blue-400 border border-blue-500/30">
                      <Activity className="h-4 w-4" />
                    </div>
                    <div>
                      <div className="text-xs font-bold text-slate-200 group-hover:text-blue-400">London DVS & CAZ Permits</div>
                      <div className="text-[10px] text-slate-400">TfL Progressive Safe System & Star Rating</div>
                    </div>
                  </button>
                )}

                {onOpenFleetVOR && (
                  <button
                    onClick={() => {
                      setIsComplianceMenuOpen(false);
                      onOpenFleetVOR();
                    }}
                    className="w-full flex items-center gap-2.5 rounded-xl p-2 text-left hover:bg-slate-800 transition-colors group"
                  >
                    <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-rose-500/20 text-rose-400 border border-rose-500/30">
                      <AlertOctagon className="h-4 w-4" />
                    </div>
                    <div>
                      <div className="text-xs font-bold text-slate-200 group-hover:text-rose-400">Fleet VOR & Grounding</div>
                      <div className="text-[10px] text-slate-400">Defect walkaround lockouts & MOT</div>
                    </div>
                  </button>
                )}

                {onOpenShiftMarketplace && (
                  <button
                    onClick={() => {
                      setIsComplianceMenuOpen(false);
                      onOpenShiftMarketplace();
                    }}
                    className="w-full flex items-center gap-2.5 rounded-xl p-2 text-left hover:bg-slate-800 transition-colors group"
                  >
                    <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-cyan-500/20 text-cyan-400 border border-cyan-500/30">
                      <Briefcase className="h-4 w-4" />
                    </div>
                    <div>
                      <div className="text-xs font-bold text-slate-200 group-hover:text-cyan-400">Relief Driver Shifts</div>
                      <div className="text-[10px] text-slate-400">CPC verification & emergency shift cover</div>
                    </div>
                  </button>
                )}

                {/* ADVANCED FREIGHT & STRATEGY MODULES */}
                <div className="px-3 py-1.5 border-t border-b border-slate-800 flex items-center justify-between mt-1">
                  <span className="text-[10px] font-black uppercase tracking-wider text-amber-400">
                    Freight Exchange & Strategy
                  </span>
                  <span className="text-[9px] font-mono text-cyan-400">TEG / RHA Standard</span>
                </div>

                {onOpenHxWorkflow && (
                  <button
                    onClick={() => {
                      setIsComplianceMenuOpen(false);
                      onOpenHxWorkflow();
                    }}
                    className="w-full flex items-center gap-2.5 rounded-xl p-2 text-left hover:bg-slate-800 transition-colors group"
                  >
                    <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-cyan-500/20 text-cyan-400 border border-cyan-500/30">
                      <Repeat className="h-4 w-4" />
                    </div>
                    <div>
                      <div className="text-xs font-bold text-slate-200 group-hover:text-cyan-400">HX & Returnloads 6-Step Workflow</div>
                      <div className="text-[10px] text-slate-400">Smart Matching, e-POD & Courier CX toggle</div>
                    </div>
                  </button>
                )}

                {onOpenBreakEven && (
                  <button
                    onClick={() => {
                      setIsComplianceMenuOpen(false);
                      onOpenBreakEven();
                    }}
                    className="w-full flex items-center gap-2.5 rounded-xl p-2 text-left hover:bg-slate-800 transition-colors group"
                  >
                    <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                      <Layers className="h-4 w-4" />
                    </div>
                    <div>
                      <div className="text-xs font-bold text-slate-200 group-hover:text-emerald-400">Break-Even & Net Contribution</div>
                      <div className="text-[10px] text-slate-400">Loads to break even & £0.95/mi marginal formula</div>
                    </div>
                  </button>
                )}

                {onOpenThreeTierStack && (
                  <button
                    onClick={() => {
                      setIsComplianceMenuOpen(false);
                      onOpenThreeTierStack();
                    }}
                    className="w-full flex items-center gap-2.5 rounded-xl p-2 text-left hover:bg-slate-800 transition-colors group"
                  >
                    <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-indigo-500/20 text-indigo-400 border border-indigo-500/30">
                      <Shield className="h-4 w-4" />
                    </div>
                    <div>
                      <div className="text-xs font-bold text-slate-200 group-hover:text-indigo-400">Hybrid 3-Tier Logistics Stack</div>
                      <div className="text-[10px] text-slate-400">HaulageHub + HX + RHA Demurrage stack</div>
                    </div>
                  </button>
                )}

                {onOpenBusinessPlan && (
                  <button
                    onClick={() => {
                      setIsComplianceMenuOpen(false);
                      onOpenBusinessPlan();
                    }}
                    className="w-full flex items-center gap-2.5 rounded-xl p-2 text-left hover:bg-slate-800 transition-colors group"
                  >
                    <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-amber-500/20 text-amber-400 border border-amber-500/30">
                      <Briefcase className="h-4 w-4" />
                    </div>
                    <div>
                      <div className="text-xs font-bold text-slate-200 group-hover:text-amber-400">Commercial Business Plan (Apex)</div>
                      <div className="text-[10px] text-slate-400">£1.08M revenue, £149k EBITDA P&L model</div>
                    </div>
                  </button>
                )}

                {onOpenDynamicPricing && (
                  <button
                    onClick={() => {
                      setIsComplianceMenuOpen(false);
                      onOpenDynamicPricing();
                    }}
                    className="w-full flex items-center gap-2.5 rounded-xl p-2 text-left hover:bg-slate-800 transition-colors group"
                  >
                    <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-cyan-500/20 text-cyan-400 border border-cyan-500/30">
                      <SlidersHorizontal className="h-4 w-4" />
                    </div>
                    <div>
                      <div className="text-xs font-bold text-slate-200 group-hover:text-cyan-400">Dynamic Site-Risk Freight Pricing</div>
                      <div className="text-[10px] text-slate-400">Adjust £/mile for destination yard difficulty</div>
                    </div>
                  </button>
                )}

                {onOpenDriverChecklist && (
                  <button
                    onClick={() => {
                      setIsComplianceMenuOpen(false);
                      onOpenDriverChecklist();
                    }}
                    className="w-full flex items-center gap-2.5 rounded-xl p-2 text-left hover:bg-slate-800 transition-colors group"
                  >
                    <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-amber-500/20 text-amber-400 border border-amber-500/30">
                      <FileCheck className="h-4 w-4" />
                    </div>
                    <div>
                      <div className="text-xs font-bold text-slate-200 group-hover:text-amber-400">SOP-014 In-Cab Waiting Checklist</div>
                      <div className="text-[10px] text-slate-400">6-step slip &amp; clerk refusal photo action</div>
                    </div>
                  </button>
                )}

                {/* ROUTE OPTIMISER & RECRUITMENT PLAN */}
                <div className="px-3 py-1.5 border-t border-b border-slate-800 flex items-center justify-between mt-1">
                  <span className="text-[10px] font-black uppercase tracking-wider text-emerald-400">
                    Route &amp; Recruitment Intelligence
                  </span>
                  <span className="text-[9px] font-mono text-emerald-400">ReliefHGV</span>
                </div>

                {onOpenRouteOptimizer && (
                  <button
                    onClick={() => {
                      setIsComplianceMenuOpen(false);
                      onOpenRouteOptimizer();
                    }}
                    className="w-full flex items-center gap-2.5 rounded-xl p-2 text-left hover:bg-slate-800 transition-colors group"
                  >
                    <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                      <Navigation className="h-4 w-4" />
                    </div>
                    <div>
                      <div className="text-xs font-bold text-slate-200 group-hover:text-emerald-400">Multi-Drop Route Optimiser</div>
                      <div className="text-[10px] text-slate-400">Upload manifest, tacho break sync &amp; live amendments</div>
                    </div>
                  </button>
                )}

                {onOpenRecruitmentPlan && (
                  <button
                    onClick={() => {
                      setIsComplianceMenuOpen(false);
                      onOpenRecruitmentPlan();
                    }}
                    className="w-full flex items-center gap-2.5 rounded-xl p-2 text-left hover:bg-slate-800 transition-colors group"
                  >
                    <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-cyan-500/20 text-cyan-400 border border-cyan-500/30">
                      <Users className="h-4 w-4" />
                    </div>
                    <div>
                      <div className="text-xs font-bold text-slate-200 group-hover:text-cyan-400">ReliefHGV Blueprint &amp; Pitch</div>
                      <div className="text-[10px] text-slate-400">Automated agency, card reader loop &amp; 7 revenue streams</div>
                    </div>
                  </button>
                )}
              </div>
            )}
          </div>

          {/* Add Delivery Site */}
          {onOpenCreateSite && (
            <button
              onClick={onOpenCreateSite}
              className="flex items-center gap-1.5 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-slate-950 px-2.5 sm:px-3 py-1.5 text-xs font-extrabold shadow-sm transition-all active:scale-95"
              title="Register a new commercial delivery site or depot"
            >
              <Plus className="h-3.5 w-3.5" />
              <span className="hidden sm:inline">Add Site</span>
            </button>
          )}

        </div>
      </div>
    </header>
  );
};
