'use client';
import React from 'react';
import {
  X,
  Radio,
  ScanLine,
  Leaf,
  Layers,
  Mic,
  Shield,
  Briefcase,
  ExternalLink,
  ChevronRight,
  Sparkles,
  RefreshCw,
  Clock,
  Building2,
  FileCheck,
  CreditCard,
  Users,
  Home,
  Repeat,
  SlidersHorizontal,
  Navigation
} from 'lucide-react';
import { DriverVehicleProfile } from '../../types';

interface SlideOutUtilityDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  driverVehicle: DriverVehicleProfile;
  onOpenArOverlay: () => void;
  onOpenCbRadio: () => void;
  onOpenEsgModal: () => void;
  onOpenTmsModal: () => void;
  onOpenVoiceSettings: () => void;
  onOpenDemurrageLedger: () => void;
  onOpenSsoModal: () => void;
  onSwitchToDesktopCommand?: () => void;
  onOpenTachographScanner?: () => void;
  onOpenUserAccessPortal?: () => void;
  onReturnToSuiteLanding?: () => void;
  onOpenHxWorkflow?: () => void;
  onOpenBreakEven?: () => void;
  onOpenThreeTierStack?: () => void;
  onOpenBusinessPlan?: () => void;
  onOpenDynamicPricing?: () => void;
  onOpenDriverChecklist?: () => void;
  onOpenRouteOptimizer?: () => void;
  onOpenRecruitmentPlan?: () => void;
  onOpenLicenceScanner?: () => void;
}

export const SlideOutUtilityDrawer: React.FC<SlideOutUtilityDrawerProps> = ({
  isOpen,
  onClose,
  driverVehicle,
  onOpenArOverlay,
  onOpenCbRadio,
  onOpenEsgModal,
  onOpenTmsModal,
  onOpenVoiceSettings,
  onOpenDemurrageLedger,
  onOpenSsoModal,
  onSwitchToDesktopCommand,
  onOpenTachographScanner,
  onOpenLicenceScanner,
  onOpenUserAccessPortal,
  onReturnToSuiteLanding,
  onOpenHxWorkflow,
  onOpenBreakEven,
  onOpenThreeTierStack,
  onOpenBusinessPlan,
  onOpenDynamicPricing,
  onOpenDriverChecklist,
  onOpenRouteOptimizer,
  onOpenRecruitmentPlan
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      />

      {/* Drawer Body */}
      <aside className="relative w-80 max-w-[85vw] h-full bg-slate-900 border-r border-slate-800 shadow-2xl flex flex-col z-10 text-slate-100 overflow-y-auto">
        {/* Drawer Header */}
        <div className="p-5 border-b border-slate-800 bg-slate-950/60 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center text-slate-950 font-black text-lg shadow-md shadow-cyan-500/20">
              DP
            </div>
            <div>
              <h2 className="text-base font-bold text-white tracking-tight flex items-center gap-1.5">
                Drive Partners <span className="text-xs px-1.5 py-0.5 rounded bg-cyan-500/20 text-cyan-400 font-mono">2.0</span>
              </h2>
              <p className="text-xs text-slate-400 truncate">
                {driverVehicle.vehicleReg} • {driverVehicle.currentHaulierCompany || 'ReliefHGV Fleet'}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-9 h-9 rounded-lg bg-slate-800/80 hover:bg-slate-700 text-slate-400 hover:text-white flex items-center justify-center transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Vehicle Quick Spec Banner */}
        <div className="mx-4 my-3 p-3 rounded-xl bg-slate-950/80 border border-slate-800 text-xs flex justify-between items-center">
          <div>
            <span className="text-slate-500 text-[10px] block uppercase font-mono tracking-wider">Tractor Clearance</span>
            <span className="text-amber-400 font-bold text-sm">{driverVehicle.heightMeters}m (14' 5")</span>
          </div>
          <div className="h-6 w-px bg-slate-800" />
          <div>
            <span className="text-slate-500 text-[10px] block uppercase font-mono tracking-wider">Gross Weight</span>
            <span className="text-cyan-400 font-bold text-sm">{driverVehicle.weightTonnes} Tonnes</span>
          </div>
          <div className="h-6 w-px bg-slate-800" />
          <div>
            <span className="text-slate-500 text-[10px] block uppercase font-mono tracking-wider">Trailer</span>
            <span className="text-white font-bold text-xs">{driverVehicle.currentTrailerNumber || 'TRL-409'}</span>
          </div>
        </div>

        {/* Navigation / Utility List */}
        <div className="px-3 py-2 space-y-1 flex-1">
          <p className="px-3 py-1.5 text-[10px] font-mono uppercase tracking-wider text-slate-500">
            In-Cab & Tactical Tools
          </p>

          <button
            onClick={() => {
              onClose();
              onOpenArOverlay();
            }}
            className="w-full flex items-center justify-between p-3 rounded-xl bg-slate-800/50 hover:bg-slate-800 text-left transition-colors border border-transparent hover:border-cyan-500/30 group"
          >
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-lg bg-emerald-500/20 text-emerald-400 flex items-center justify-center">
                <ScanLine className="w-5 h-5" />
              </div>
              <div>
                <div className="text-sm font-semibold text-slate-100 group-hover:text-emerald-300">
                  3D AR Bay Docking Guide
                </div>
                <div className="text-xs text-slate-400">Camera reverse guidance & blindspot lines</div>
              </div>
            </div>
            <ChevronRight className="w-4 h-4 text-slate-500 group-hover:text-emerald-400" />
          </button>

          <button
            onClick={() => {
              onClose();
              onOpenCbRadio();
            }}
            className="w-full flex items-center justify-between p-3 rounded-xl bg-slate-800/50 hover:bg-slate-800 text-left transition-colors border border-transparent hover:border-cyan-500/30 group"
          >
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-lg bg-cyan-500/20 text-cyan-400 flex items-center justify-center">
                <Radio className="w-5 h-5" />
              </div>
              <div>
                <div className="text-sm font-semibold text-slate-100 group-hover:text-cyan-300">
                  Digital CB Emergency Radio
                </div>
                <div className="text-xs text-slate-400">Yard broadcasts & driver mesh chatter</div>
              </div>
            </div>
            <ChevronRight className="w-4 h-4 text-slate-500 group-hover:text-cyan-400" />
          </button>

          <button
            onClick={() => {
              onClose();
              onOpenVoiceSettings();
            }}
            className="w-full flex items-center justify-between p-3 rounded-xl bg-slate-800/50 hover:bg-slate-800 text-left transition-colors border border-transparent hover:border-cyan-500/30 group"
          >
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-lg bg-purple-500/20 text-purple-400 flex items-center justify-center">
                <Mic className="w-5 h-5" />
              </div>
              <div>
                <div className="text-sm font-semibold text-slate-100 group-hover:text-purple-300">
                  Voice Co-Pilot & TTS Setup
                </div>
                <div className="text-xs text-slate-400">Hands-free gate codes & audio alerts</div>
              </div>
            </div>
            <ChevronRight className="w-4 h-4 text-slate-500 group-hover:text-purple-400" />
          </button>

          {onOpenTachographScanner && (
            <button
              onClick={() => {
                onClose();
                onOpenTachographScanner();
              }}
              className="w-full flex items-center justify-between p-3 rounded-xl bg-slate-800/50 hover:bg-slate-800 text-left transition-colors border border-transparent hover:border-blue-500/30 group"
            >
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-lg bg-blue-500/20 text-blue-400 flex items-center justify-center">
                  <CreditCard className="w-5 h-5" />
                </div>
                <div>
                  <div className="text-sm font-semibold text-slate-100 group-hover:text-blue-300">
                    Tachograph Roll Scanner
                  </div>
                  <div className="text-xs text-slate-400">AI camera OCR, 4.5h split checks & WTD</div>
                </div>
              </div>
              <ChevronRight className="w-4 h-4 text-slate-500 group-hover:text-blue-400" />
            </button>
          )}

          {onOpenLicenceScanner && (
            <button
              onClick={() => {
                onClose();
                onOpenLicenceScanner();
              }}
              className="w-full flex items-center justify-between p-3 rounded-xl bg-slate-800/50 hover:bg-slate-800 text-left transition-colors border border-transparent hover:border-amber-500/30 group cursor-pointer"
            >
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-lg bg-amber-500/20 text-amber-400 flex items-center justify-center font-bold">
                  <Shield className="w-5 h-5" />
                </div>
                <div>
                  <div className="text-sm font-semibold text-slate-100 group-hover:text-amber-300">
                    UK Driving Licence &amp; CPC Check
                  </div>
                  <div className="text-xs text-slate-400">Scan photocard, check DVLA points &amp; DQC</div>
                </div>
              </div>
              <ChevronRight className="w-4 h-4 text-slate-500 group-hover:text-amber-400" />
            </button>
          )}

          <p className="px-3 pt-4 pb-1.5 text-[10px] font-mono uppercase tracking-wider text-slate-500">
            Enterprise & ESG Extensions
          </p>

          <button
            onClick={() => {
              onClose();
              onOpenDemurrageLedger();
            }}
            className="w-full flex items-center justify-between p-3 rounded-xl bg-slate-800/50 hover:bg-slate-800 text-left transition-colors border border-transparent hover:border-cyan-500/30 group"
          >
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-lg bg-amber-500/20 text-amber-400 flex items-center justify-center">
                <Clock className="w-5 h-5" />
              </div>
              <div>
                <div className="text-sm font-semibold text-slate-100 group-hover:text-amber-300">
                  Demurrage & Detention Claims
                </div>
                <div className="text-xs text-slate-400">Automated £45/h geofence billing engine</div>
              </div>
            </div>
            <ChevronRight className="w-4 h-4 text-slate-500 group-hover:text-amber-400" />
          </button>

          <button
            onClick={() => {
              onClose();
              onOpenEsgModal();
            }}
            className="w-full flex items-center justify-between p-3 rounded-xl bg-slate-800/50 hover:bg-slate-800 text-left transition-colors border border-transparent hover:border-cyan-500/30 group"
          >
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-lg bg-emerald-500/20 text-emerald-400 flex items-center justify-center">
                <Leaf className="w-5 h-5" />
              </div>
              <div>
                <div className="text-sm font-semibold text-slate-100 group-hover:text-emerald-300">
                  Scope 3 ESG Carbon Reports
                </div>
                <div className="text-xs text-slate-400">GHG Protocol deadhead audit export</div>
              </div>
            </div>
            <ChevronRight className="w-4 h-4 text-slate-500 group-hover:text-emerald-400" />
          </button>

          <button
            onClick={() => {
              onClose();
              onOpenTmsModal();
            }}
            className="w-full flex items-center justify-between p-3 rounded-xl bg-slate-800/50 hover:bg-slate-800 text-left transition-colors border border-transparent hover:border-cyan-500/30 group"
          >
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-lg bg-blue-500/20 text-blue-400 flex items-center justify-center">
                <RefreshCw className="w-5 h-5" />
              </div>
              <div>
                <div className="text-sm font-semibold text-slate-100 group-hover:text-blue-300">
                  TMS / ERP Connectors
                </div>
                <div className="text-xs text-slate-400">SAP S/4HANA, Oracle OTM, Mandata</div>
              </div>
            </div>
            <ChevronRight className="w-4 h-4 text-slate-500 group-hover:text-blue-400" />
          </button>

          <button
            onClick={() => {
              onClose();
              onOpenSsoModal();
            }}
            className="w-full flex items-center justify-between p-3 rounded-xl bg-slate-800/50 hover:bg-slate-800 text-left transition-colors border border-transparent hover:border-cyan-500/30 group"
          >
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-lg bg-indigo-500/20 text-indigo-400 flex items-center justify-center">
                <Shield className="w-5 h-5" />
              </div>
              <div>
                <div className="text-sm font-semibold text-slate-100 group-hover:text-indigo-300">
                  SAML SSO & Google Identity
                </div>
                <div className="text-xs text-slate-400">Google Business Profile OAuth 2.0</div>
              </div>
            </div>
            <ChevronRight className="w-4 h-4 text-slate-500 group-hover:text-indigo-400" />
          </button>

          {onOpenHxWorkflow && (
            <button
              onClick={() => {
                onClose();
                onOpenHxWorkflow();
              }}
              className="w-full flex items-center justify-between p-3 rounded-xl bg-slate-800/50 hover:bg-slate-800 text-left transition-colors border border-transparent hover:border-cyan-500/30 group"
            >
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-lg bg-cyan-500/20 text-cyan-400 flex items-center justify-center">
                  <Repeat className="w-5 h-5" />
                </div>
                <div>
                  <div className="text-sm font-semibold text-slate-100 group-hover:text-cyan-300">
                    HX &amp; Returnloads Workflow
                  </div>
                  <div className="text-xs text-slate-400">6-stage cycle &amp; CX van toggle</div>
                </div>
              </div>
              <ChevronRight className="w-4 h-4 text-slate-500 group-hover:text-cyan-400" />
            </button>
          )}

          {onOpenBreakEven && (
            <button
              onClick={() => {
                onClose();
                onOpenBreakEven();
              }}
              className="w-full flex items-center justify-between p-3 rounded-xl bg-slate-800/50 hover:bg-slate-800 text-left transition-colors border border-transparent hover:border-emerald-500/30 group"
            >
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-lg bg-emerald-500/20 text-emerald-400 flex items-center justify-center">
                  <Layers className="w-5 h-5" />
                </div>
                <div>
                  <div className="text-sm font-semibold text-slate-100 group-hover:text-emerald-300">
                    Break-Even &amp; Net Contribution
                  </div>
                  <div className="text-xs text-slate-400">Loads required formula calculator</div>
                </div>
              </div>
              <ChevronRight className="w-4 h-4 text-slate-500 group-hover:text-emerald-400" />
            </button>
          )}

          {onOpenThreeTierStack && (
            <button
              onClick={() => {
                onClose();
                onOpenThreeTierStack();
              }}
              className="w-full flex items-center justify-between p-3 rounded-xl bg-slate-800/50 hover:bg-slate-800 text-left transition-colors border border-transparent hover:border-indigo-500/30 group"
            >
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-lg bg-indigo-500/20 text-indigo-400 flex items-center justify-center">
                  <Shield className="w-5 h-5" />
                </div>
                <div>
                  <div className="text-sm font-semibold text-slate-100 group-hover:text-indigo-300">
                    Hybrid 3-Tier Logistics Stack
                  </div>
                  <div className="text-xs text-slate-400">HaulageHub, HX &amp; RHA Demurrage</div>
                </div>
              </div>
              <ChevronRight className="w-4 h-4 text-slate-500 group-hover:text-indigo-400" />
            </button>
          )}

          {onOpenBusinessPlan && (
            <button
              onClick={() => {
                onClose();
                onOpenBusinessPlan();
              }}
              className="w-full flex items-center justify-between p-3 rounded-xl bg-slate-800/50 hover:bg-slate-800 text-left transition-colors border border-transparent hover:border-amber-500/30 group"
            >
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-lg bg-amber-500/20 text-amber-400 flex items-center justify-center">
                  <Briefcase className="w-5 h-5" />
                </div>
                <div>
                  <div className="text-sm font-semibold text-slate-100 group-hover:text-amber-300">
                    Commercial Business Plan (Apex)
                  </div>
                  <div className="text-xs text-slate-400">£1.08M revenue &amp; Year 1 budget</div>
                </div>
              </div>
              <ChevronRight className="w-4 h-4 text-slate-500 group-hover:text-amber-400" />
            </button>
          )}

          {onOpenDynamicPricing && (
            <button
              onClick={() => {
                onClose();
                onOpenDynamicPricing();
              }}
              className="w-full flex items-center justify-between p-3 rounded-xl bg-slate-800/50 hover:bg-slate-800 text-left transition-colors border border-transparent hover:border-cyan-500/30 group"
            >
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-lg bg-cyan-500/20 text-cyan-400 flex items-center justify-center">
                  <SlidersHorizontal className="w-5 h-5" />
                </div>
                <div>
                  <div className="text-sm font-semibold text-slate-100 group-hover:text-cyan-300">
                    Dynamic Site-Risk Pricing
                  </div>
                  <div className="text-xs text-slate-400">Destination friction rate engine</div>
                </div>
              </div>
              <ChevronRight className="w-4 h-4 text-slate-500 group-hover:text-cyan-400" />
            </button>
          )}

          {onOpenDriverChecklist && (
            <button
              onClick={() => {
                onClose();
                onOpenDriverChecklist();
              }}
              className="w-full flex items-center justify-between p-3 rounded-xl bg-slate-800/50 hover:bg-slate-800 text-left transition-colors border border-transparent hover:border-amber-500/30 group"
            >
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-lg bg-amber-500/20 text-amber-400 flex items-center justify-center">
                  <FileCheck className="w-5 h-5" />
                </div>
                <div>
                  <div className="text-sm font-semibold text-slate-100 group-hover:text-amber-300">
                    SOP-014 In-Cab Waiting Checklist
                  </div>
                  <div className="text-xs text-slate-400">6-step slip &amp; refusal photo tool</div>
                </div>
              </div>
              <ChevronRight className="w-4 h-4 text-slate-500 group-hover:text-amber-400" />
            </button>
          )}

          {onOpenRouteOptimizer && (
            <button
              onClick={() => {
                onClose();
                onOpenRouteOptimizer();
              }}
              className="w-full flex items-center justify-between p-3 rounded-xl bg-slate-800/50 hover:bg-slate-800 text-left transition-colors border border-transparent hover:border-emerald-500/30 group"
            >
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-lg bg-emerald-500/20 text-emerald-400 flex items-center justify-center">
                  <Navigation className="w-5 h-5" />
                </div>
                <div>
                  <div className="text-sm font-semibold text-slate-100 group-hover:text-emerald-300">
                    Route Optimiser
                  </div>
                  <div className="text-xs text-slate-400">Clear route, bridge radar &amp; trailer swap</div>
                </div>
              </div>
              <ChevronRight className="w-4 h-4 text-slate-500 group-hover:text-emerald-400" />
            </button>
          )}

          {onOpenRecruitmentPlan && (
            <button
              onClick={() => {
                onClose();
                onOpenRecruitmentPlan();
              }}
              className="w-full flex items-center justify-between p-3 rounded-xl bg-slate-800/50 hover:bg-slate-800 text-left transition-colors border border-transparent hover:border-cyan-500/30 group"
            >
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-lg bg-cyan-500/20 text-cyan-400 flex items-center justify-center">
                  <Users className="w-5 h-5" />
                </div>
                <div>
                  <div className="text-sm font-semibold text-slate-100 group-hover:text-cyan-300">
                    ReliefHGV Blueprint &amp; Pitch
                  </div>
                  <div className="text-xs text-slate-400">Card reader loop &amp; 7 revenue streams</div>
                </div>
              </div>
              <ChevronRight className="w-4 h-4 text-slate-500 group-hover:text-cyan-400" />
            </button>
          )}

          {onOpenUserAccessPortal && (
            <button
              onClick={() => {
                onClose();
                onOpenUserAccessPortal();
              }}
              className="w-full flex items-center justify-between p-3 rounded-xl bg-slate-800/50 hover:bg-slate-800 text-left transition-colors border border-transparent hover:border-cyan-500/30 group"
            >
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-lg bg-cyan-500/20 text-cyan-400 flex items-center justify-center">
                  <Users className="w-5 h-5" />
                </div>
                <div>
                  <div className="text-sm font-semibold text-slate-100 group-hover:text-cyan-300">
                    Users &amp; Feature Permissions
                  </div>
                  <div className="text-xs text-slate-400">Admin portal, roles &amp; RBAC matrix</div>
                </div>
              </div>
              <ChevronRight className="w-4 h-4 text-slate-500 group-hover:text-cyan-400" />
            </button>
          )}
        </div>

        {/* Footer: Return to Drive Partners Suite Hub */}
        <div className="p-4 border-t border-slate-800 bg-slate-950/80 space-y-2">
          {onReturnToSuiteLanding ? (
            <button
              onClick={() => {
                onClose();
                onReturnToSuiteLanding();
              }}
              className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-cyan-600 via-blue-600 to-indigo-600 hover:from-cyan-500 hover:to-blue-500 text-white font-extrabold text-xs flex items-center justify-center gap-2 shadow-lg shadow-cyan-600/30 transition-all active:scale-95"
            >
              <Home className="w-4 h-4" />
              <span>Return to Drive Partners Suite</span>
            </button>
          ) : (
            onSwitchToDesktopCommand && (
              <button
                onClick={() => {
                  onClose();
                  onSwitchToDesktopCommand();
                }}
                className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-lg shadow-cyan-600/30 transition-all"
              >
                <Briefcase className="w-4 h-4" />
                <span>Switch to Fleet Command</span>
              </button>
            )
          )}
          <p className="text-[10px] text-slate-500 text-center">
            Build v2.1.0 • Drive Partners Ltd &amp; ReliefHGV
          </p>
        </div>
      </aside>
    </div>
  );
};
