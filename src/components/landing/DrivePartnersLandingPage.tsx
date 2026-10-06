'use client';
import React, { useState } from 'react';
import {
  Compass,
  Truck,
  Building2,
  ShieldCheck,
  CheckCircle2,
  ChevronRight,
  Sparkles,
  Zap,
  Layers,
  Repeat,
  Receipt,
  ScanLine,
  Leaf,
  Users,
  Lock,
  ArrowRight,
  Shield,
  Smartphone,
  Laptop,
  CreditCard,
  FileCheck,
  Activity,
  UserCheck,
  LogIn,
  Calculator,
  TrendingUp,
  Sliders
} from 'lucide-react';

export type UserPortalType = 'DRIVER' | 'HAULIER' | 'BUSINESS' | 'ADMIN';

interface DrivePartnersLandingPageProps {
  onSelectPortal: (portal: UserPortalType) => void;
  onOpenHxWorkflow?: () => void;
  onOpenBreakEven?: () => void;
  onOpenThreeTierStack?: () => void;
  onOpenBusinessPlan?: () => void;
  onOpenDynamicPricing?: () => void;
  onOpenDriverChecklist?: () => void;
  onOpenRouteOptimizer?: () => void;
  onOpenRecruitmentPlan?: () => void;
  onOpenLicenceScanner?: () => void;
  onOpenTachoScan?: () => void;
}

export const DrivePartnersLandingPage: React.FC<DrivePartnersLandingPageProps> = ({
  onSelectPortal,
  onOpenHxWorkflow,
  onOpenBreakEven,
  onOpenThreeTierStack,
  onOpenBusinessPlan,
  onOpenDynamicPricing,
  onOpenDriverChecklist,
  onOpenRouteOptimizer,
  onOpenRecruitmentPlan,
  onOpenLicenceScanner,
  onOpenTachoScan
}) => {
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans selection:bg-cyan-500 selection:text-slate-950 flex flex-col">
      {/* 1. TOP GLOBAL NAVIGATION HEADER */}
      <header className="sticky top-0 z-50 w-full border-b border-slate-800/80 bg-slate-950/90 backdrop-blur-md px-4 sm:px-8 py-3.5 shadow-xl">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-4">
          
          {/* Logo & Brand Identity */}
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-br from-cyan-500 via-blue-600 to-indigo-600 text-slate-950 font-black text-xl shadow-lg shadow-cyan-500/25">
              DP
            </div>
            <div>
              <div className="flex items-center gap-2 leading-none">
                <span className="font-extrabold tracking-tight text-white text-lg sm:text-xl">
                  Drive Partners <span className="text-cyan-400 font-mono text-base">2.0</span>
                </span>
                <span className="hidden sm:inline rounded px-2 py-0.5 text-[10px] font-mono font-bold bg-cyan-500/10 text-cyan-300 border border-cyan-500/30">
                  ReliefHGV Suite
                </span>
              </div>
              <p className="text-[11px] text-slate-400 font-medium mt-0.5 hidden xs:block">
                Unified Logistics Ecosystem for UK Transport
              </p>
            </div>
          </div>

          {/* Center Navigation Links (Desktop) */}
          <nav className="hidden lg:flex items-center gap-4 text-xs font-bold text-slate-300">
            {onOpenHxWorkflow && (
              <button
                onClick={onOpenHxWorkflow}
                className="text-cyan-400 font-extrabold hover:text-cyan-300 transition-colors flex items-center gap-1.5 bg-cyan-950/70 border border-cyan-500/40 px-3 py-1.5 rounded-xl shadow-sm shadow-cyan-500/10 active:scale-95 cursor-pointer"
              >
                <Repeat className="w-3.5 h-3.5" />
                <span>Haulage Exchange (HX)</span>
              </button>
            )}
            {onOpenBreakEven && (
              <button
                onClick={onOpenBreakEven}
                className="text-amber-400 font-bold hover:text-amber-300 transition-colors flex items-center gap-1 bg-amber-950/40 border border-amber-500/30 px-2.5 py-1.5 rounded-xl active:scale-95 cursor-pointer"
              >
                <Calculator className="w-3.5 h-3.5" />
                <span>Break-Even Calc</span>
              </button>
            )}
            {onOpenTachoScan && (
              <button
                onClick={onOpenTachoScan}
                className="text-amber-400 font-extrabold hover:text-amber-300 transition-colors flex items-center gap-1.5 bg-amber-950/60 border border-amber-500/40 px-3 py-1.5 rounded-xl shadow-sm shadow-amber-500/10 active:scale-95 cursor-pointer"
              >
                <ScanLine className="w-3.5 h-3.5" />
                <span>Tacho-Scan App</span>
              </button>
            )}
            <a href="#suite" className="hover:text-cyan-400 transition-colors">
              Product Suite
            </a>
            <a href="#drivers" className="hover:text-cyan-400 transition-colors">
              For Drivers
            </a>
            <a href="#hauliers" className="hover:text-cyan-400 transition-colors">
              For Hauliers
            </a>
            <a href="#businesses" className="hover:text-cyan-400 transition-colors">
              For Businesses
            </a>
            <a href="#efficiency" className="hover:text-cyan-400 transition-colors">
              Cost Reduction
            </a>
          </nav>

          {/* Right: Tacho-Scan Direct Access + One Simple Sign-In */}
          <div className="flex items-center gap-2 sm:gap-3">
            {onOpenTachoScan && (
              <button
                onClick={onOpenTachoScan}
                className="hidden xs:flex items-center gap-1.5 rounded-xl bg-amber-500/15 hover:bg-amber-500/25 text-amber-300 font-bold px-3 py-2 text-xs border border-amber-500/30 transition-all active:scale-95 cursor-pointer"
              >
                <ScanLine className="w-3.5 h-3.5 text-amber-400" />
                <span>Tacho-Scan</span>
              </button>
            )}
            <button
              onClick={() => setIsLoginModalOpen(true)}
              className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-slate-950 font-extrabold px-4 sm:px-5 py-2.5 text-xs shadow-lg shadow-cyan-500/25 transition-all active:scale-95"
            >
              <LogIn className="w-4 h-4" />
              <span>Simple Sign-In</span>
            </button>
          </div>
        </div>
      </header>

      {/* 2. HERO SECTION */}
      <section className="relative overflow-hidden pt-12 pb-20 sm:pt-20 sm:pb-28 px-4 sm:px-8 border-b border-slate-900 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-cyan-950/20 via-slate-950 to-slate-950">
        <div className="mx-auto max-w-5xl text-center space-y-6">
          
          {/* Eyebrow Pill */}
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-300 text-xs font-mono font-bold tracking-wider uppercase">
            <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
            <span>The Unified Logistics Platform</span>
          </div>

          {/* Main Title */}
          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black text-white tracking-tight leading-[1.1]">
            Welcome to <span className="bg-gradient-to-r from-cyan-400 via-blue-400 to-indigo-400 bg-clip-text text-transparent">Drive Partners</span>
          </h1>

          {/* User's Exact Value Proposition Statement */}
          <p className="text-base sm:text-xl text-slate-300 max-w-3xl mx-auto font-normal leading-relaxed">
            A Suite of Products for <strong>Drivers and Hauliers</strong> that integrates the various apps on the market today into <strong>one simple sign-in for all</strong>. Reducing cost and creating simplicity to achieve a new standard in efficiency.
          </p>

          {/* PRODUCT #1 SPOTLIGHT: TACHO-SCAN */}
          <div className="pt-6 max-w-4xl mx-auto text-left">
            <div className="p-6 sm:p-7 rounded-3xl bg-gradient-to-br from-amber-500/10 via-slate-900 to-slate-950 border-2 border-amber-500/50 shadow-2xl shadow-amber-500/10 space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800 pb-4">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-amber-500 to-amber-600 text-slate-950 flex items-center justify-center font-black shadow-lg shadow-amber-500/25 shrink-0">
                    <ScanLine className="w-6 h-6 text-slate-950" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-mono font-black text-amber-400 uppercase tracking-wider bg-amber-500/15 px-2.5 py-0.5 rounded-full border border-amber-500/30">
                        Drive Partners Suite Product #1
                      </span>
                      <span className="text-[10px] font-mono text-emerald-400 font-bold bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/30">
                        Free for Drivers
                      </span>
                    </div>
                    <h3 className="text-xl sm:text-2xl font-black text-white mt-1">
                      Tacho-Scan: Instant Thermal Printout OCR &amp; Compliance App
                    </h3>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-xs font-mono text-slate-400">
                    Smart Card Reader: <strong className="text-amber-300">£14.99</strong>
                  </span>
                </div>
              </div>

              <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                The first app launched from the Drive Partners suite. Drivers can scan their tachograph thermal paper printouts using our live auto-focus camera scanner, or plug in a smart card reader. AI Optical Character Recognition instantly translates rolls into a full graphical compliance dashboard showing EU 561/2006 limits, infringements, worked hours, and qualifies clean drivers for £32/hr Relief HGV shifts.
              </p>

              {/* 4 Feature Pills */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-center text-[11px] font-mono">
                <div className="p-2.5 rounded-xl bg-slate-950 border border-slate-800 text-slate-300">
                  <span className="text-amber-400 font-bold block">1. Live Autofocus OCR</span>
                  Hands-free thermal roll scan
                </div>
                <div className="p-2.5 rounded-xl bg-slate-950 border border-slate-800 text-slate-300">
                  <span className="text-amber-400 font-bold block">2. 24h Visual Timeline</span>
                  Drive, Rest, Work &amp; POA
                </div>
                <div className="p-2.5 rounded-xl bg-slate-950 border border-slate-800 text-slate-300">
                  <span className="text-amber-400 font-bold block">3. Card Reader Option</span>
                  In-app order (£14.99)
                </div>
                <div className="p-2.5 rounded-xl bg-slate-950 border border-slate-800 text-slate-300">
                  <span className="text-emerald-400 font-bold block">4. Relief HGV Pool</span>
                  Unlock £32/hr direct shifts
                </div>
              </div>

              {/* Interactive Action Buttons */}
              <div className="pt-2 flex flex-wrap items-center gap-3">
                {onOpenTachoScan && (
                  <button
                    onClick={onOpenTachoScan}
                    className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-black text-xs shadow-lg shadow-amber-500/25 flex items-center gap-2 transition-all active:scale-95 cursor-pointer"
                  >
                    <ScanLine className="w-4 h-4 text-slate-950" />
                    <span>Launch Tacho-Scan (Free OCR)</span>
                  </button>
                )}
                {onOpenTachoScan && (
                  <button
                    onClick={onOpenTachoScan}
                    className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-750 text-cyan-300 hover:text-cyan-200 font-bold text-xs border border-cyan-500/40 flex items-center gap-2 transition-all active:scale-95 cursor-pointer"
                  >
                    <CreditCard className="w-4 h-4" />
                    <span>Order Card Reader (£14.99)</span>
                  </button>
                )}
                {onOpenLicenceScanner && (
                  <button
                    onClick={onOpenLicenceScanner}
                    className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-750 text-slate-300 hover:text-white font-bold text-xs border border-slate-700 flex items-center gap-2 transition-all active:scale-95 cursor-pointer"
                  >
                    <ShieldCheck className="w-4 h-4 text-amber-400" />
                    <span>Create Driver Account (Scan Licence)</span>
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* Quick Portal Launch Cards Row (Direct 1-Click Access) */}
          <div className="pt-8 grid grid-cols-1 sm:grid-cols-3 gap-4 max-w-4xl mx-auto text-left">
            
            {/* 1. Driver Portal Quick Card */}
            <div
              className="p-5 rounded-2xl bg-gradient-to-br from-slate-900 to-slate-950 border-2 border-amber-500/60 shadow-xl shadow-amber-500/10 flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-3">
                  <div className="w-12 h-12 rounded-xl bg-amber-500/20 text-amber-400 flex items-center justify-center font-bold">
                    <Truck className="w-6 h-6" />
                  </div>
                  <span className="text-[10px] font-mono font-black px-2 py-0.5 rounded-full bg-amber-500 text-slate-950 uppercase tracking-wider">
                    Driver Portal
                  </span>
                </div>
                <div className="text-xs font-mono text-amber-400 font-bold uppercase tracking-wider">
                  HGV Driver
                </div>
                <h3 className="text-lg font-black text-white mt-1">In-Cab Co-Pilot</h3>
                <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                  Low bridge radar, tacho countdowns, demurrage logs, walkarounds &amp; Relief HGV driver network. Includes <strong className="text-amber-300 font-mono">Tacho-Scan App</strong>.
                </p>
              </div>

              {/* Explicit Actions: Log In, Create Account, or Launch Tacho-Scan */}
              <div className="pt-4 space-y-2">
                <div className="grid grid-cols-2 gap-2">
                  <button
                    onClick={() => onSelectPortal('DRIVER')}
                    className="py-2.5 px-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs flex items-center justify-center gap-1.5 transition-all active:scale-95 cursor-pointer border border-slate-700"
                  >
                    <LogIn className="w-3.5 h-3.5 text-amber-400" />
                    <span>Log In</span>
                  </button>
                  <button
                    onClick={() => onOpenLicenceScanner?.()}
                    className="py-2.5 px-3 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-black text-xs flex items-center justify-center gap-1.5 shadow-md shadow-amber-500/20 transition-all active:scale-95 cursor-pointer"
                  >
                    <ShieldCheck className="w-3.5 h-3.5 text-slate-950" />
                    <span>Create Account</span>
                  </button>
                </div>
                {onOpenTachoScan && (
                  <button
                    onClick={onOpenTachoScan}
                    className="w-full py-2 px-3 rounded-xl bg-amber-500/15 hover:bg-amber-500/25 text-amber-300 font-bold text-xs flex items-center justify-center gap-1.5 border border-amber-500/30 transition-all active:scale-95 cursor-pointer"
                  >
                    <ScanLine className="w-3.5 h-3.5 text-amber-400" />
                    <span>Launch Tacho-Scan Directly</span>
                  </button>
                )}
              </div>
            </div>

            {/* 2. Haulier Portal Quick Card */}
            <div
              onClick={() => onSelectPortal('HAULIER')}
              className="p-5 rounded-2xl bg-slate-900/90 hover:bg-slate-850 border border-slate-800 hover:border-cyan-500/50 shadow-xl transition-all cursor-pointer group flex flex-col justify-between"
            >
              <div>
                <div className="w-12 h-12 rounded-xl bg-cyan-500/20 text-cyan-400 flex items-center justify-center font-bold mb-3 group-hover:scale-105 transition-transform">
                  <Laptop className="w-6 h-6" />
                </div>
                <div className="text-xs font-mono text-cyan-400 font-bold uppercase tracking-wider">
                  Haulier Portal
                </div>
                <h3 className="text-lg font-bold text-white mt-1">Transport Command</h3>
                <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                  Cascading freight tenders, trailer fleet tracking, DVSA ERS grounding & Scope 3 carbon reports.
                </p>
              </div>
              <div className="pt-4 flex items-center gap-1.5 text-xs font-bold text-cyan-400 group-hover:translate-x-1 transition-transform">
                <span>Launch Fleet Command</span>
                <ChevronRight className="w-4 h-4" />
              </div>
            </div>

            {/* 3. Business Portal Quick Card */}
            <div
              onClick={() => onSelectPortal('BUSINESS')}
              className="p-5 rounded-2xl bg-slate-900/90 hover:bg-slate-850 border border-slate-800 hover:border-emerald-500/50 shadow-xl transition-all cursor-pointer group flex flex-col justify-between"
            >
              <div>
                <div className="w-12 h-12 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center font-bold mb-3 group-hover:scale-105 transition-transform">
                  <Building2 className="w-6 h-6" />
                </div>
                <div className="text-xs font-mono text-emerald-400 font-bold uppercase tracking-wider">
                  Business Portal
                </div>
                <h3 className="text-lg font-bold text-white mt-1">Depot &amp; Yard Risk</h3>
                <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                  Depot baselines, ISO 45001 sign-offs, gatehouse briefings & £45/hr demurrage claim ledger.
                </p>
              </div>
              <div className="pt-4 flex items-center gap-1.5 text-xs font-bold text-emerald-400 group-hover:translate-x-1 transition-transform">
                <span>Launch Business Portal</span>
                <ChevronRight className="w-4 h-4" />
              </div>
            </div>

          </div>

          {/* 4. PROMINENT HAULAGE EXCHANGE (HX) & FREIGHT TRADING SHOWCASE CARD */}
          <div className="pt-6 max-w-4xl mx-auto text-left">
            <div className="p-6 rounded-3xl bg-gradient-to-br from-slate-900 via-slate-900/95 to-slate-950 border-2 border-cyan-500/50 shadow-2xl shadow-cyan-500/15 space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800 pb-4">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-cyan-500 via-blue-600 to-indigo-600 text-slate-950 flex items-center justify-center font-black shadow-lg shadow-cyan-500/25">
                    <Repeat className="w-6 h-6" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-mono font-bold text-cyan-400 uppercase tracking-wider bg-cyan-500/10 px-2.5 py-0.5 rounded-full border border-cyan-500/30">
                        Freight Trading Platform
                      </span>
                      <span className="text-[10px] font-mono text-emerald-400 font-bold bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/30">
                        No Middleman Settlement
                      </span>
                    </div>
                    <h3 className="text-xl sm:text-2xl font-black text-white mt-1">
                      Haulage Exchange (HX) &amp; Returnloads Workflow
                    </h3>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-xs font-mono text-slate-400">
                    Tier Benchmarking: <strong className="text-cyan-300">£259.99 – £550/mo</strong>
                  </span>
                </div>
              </div>

              <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                Functions as a high-density, member-to-member freight trading and subcontracting platform. Unlike open public load boards or managed platforms that act as middlemen for payments, HX provides the software infrastructure, closed-network vetting, and execution tools, while leaving pricing and direct financial settlements between members.
              </p>

              {/* 6-Step Workflow Step Badges */}
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-2 text-center text-[11px] font-mono">
                <div className="p-2.5 rounded-xl bg-slate-950 border border-slate-800 text-slate-300">
                  <span className="text-cyan-400 font-bold block">1. Post Load</span>
                  Broadcast specs
                </div>
                <div className="p-2.5 rounded-xl bg-slate-950 border border-slate-800 text-slate-300">
                  <span className="text-cyan-400 font-bold block">2. Live Quotes</span>
                  Vetted operators
                </div>
                <div className="p-2.5 rounded-xl bg-slate-950 border border-slate-800 text-slate-300">
                  <span className="text-cyan-400 font-bold block">3. Booking</span>
                  RHA / CMR terms
                </div>
                <div className="p-2.5 rounded-xl bg-slate-950 border border-slate-800 text-slate-300">
                  <span className="text-cyan-400 font-bold block">4. Tracking</span>
                  In-transit GPS
                </div>
                <div className="p-2.5 rounded-xl bg-slate-950 border border-slate-800 text-slate-300">
                  <span className="text-cyan-400 font-bold block">5. e-POD</span>
                  Sign &amp; photo
                </div>
                <div className="p-2.5 rounded-xl bg-slate-950 border border-slate-800 text-slate-300">
                  <span className="text-emerald-400 font-bold block">6. Invoicing</span>
                  Direct member pay
                </div>
              </div>

              {/* Interactive Action Buttons */}
              <div className="pt-2 flex flex-wrap items-center gap-3">
                {onOpenHxWorkflow && (
                  <button
                    onClick={onOpenHxWorkflow}
                    className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-slate-950 font-black text-xs shadow-lg shadow-cyan-500/25 flex items-center gap-2 transition-all active:scale-95 cursor-pointer"
                  >
                    <Repeat className="w-4 h-4" />
                    <span>Open HX 6-Step Workflow</span>
                  </button>
                )}
                {onOpenBreakEven && (
                  <button
                    onClick={onOpenBreakEven}
                    className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-750 text-amber-400 hover:text-amber-300 font-bold text-xs border border-amber-500/40 flex items-center gap-2 transition-all active:scale-95 cursor-pointer"
                  >
                    <Calculator className="w-4 h-4" />
                    <span>Break-Even Calculator</span>
                  </button>
                )}
                {onOpenThreeTierStack && (
                  <button
                    onClick={onOpenThreeTierStack}
                    className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-750 text-indigo-400 hover:text-indigo-300 font-bold text-xs border border-indigo-500/40 flex items-center gap-2 transition-all active:scale-95 cursor-pointer"
                  >
                    <Layers className="w-4 h-4" />
                    <span>3-Tier Logistics Stack</span>
                  </button>
                )}
                {onOpenBusinessPlan && (
                  <button
                    onClick={onOpenBusinessPlan}
                    className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-750 text-emerald-400 hover:text-emerald-300 font-bold text-xs border border-emerald-500/40 flex items-center gap-2 transition-all active:scale-95 cursor-pointer"
                  >
                    <TrendingUp className="w-4 h-4" />
                    <span>Commercial Business Plan (£1.08M)</span>
                  </button>
                )}
                {onOpenDynamicPricing && (
                  <button
                    onClick={onOpenDynamicPricing}
                    className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-750 text-rose-400 hover:text-rose-300 font-bold text-xs border border-rose-500/40 flex items-center gap-2 transition-all active:scale-95 cursor-pointer"
                  >
                    <Sliders className="w-4 h-4" />
                    <span>Dynamic Site-Risk Pricing</span>
                  </button>
                )}
                {onOpenDriverChecklist && (
                  <button
                    onClick={onOpenDriverChecklist}
                    className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-750 text-slate-300 hover:text-white font-bold text-xs border border-slate-700 flex items-center gap-2 transition-all active:scale-95 cursor-pointer"
                  >
                    <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                    <span>SOP-014 Demurrage Checklist</span>
                  </button>
                )}
                {onOpenRouteOptimizer && (
                  <button
                    onClick={onOpenRouteOptimizer}
                    className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-cyan-950/80 to-blue-950/80 hover:from-cyan-900/90 hover:to-blue-900/90 text-cyan-300 hover:text-cyan-200 font-bold text-xs border border-cyan-500/50 flex items-center gap-2 transition-all active:scale-95 cursor-pointer shadow-md shadow-cyan-500/10"
                  >
                    <Truck className="w-4 h-4 text-cyan-400" />
                    <span>Multi-Drop Route Optimiser (Tacho Compliant)</span>
                  </button>
                )}
                {onOpenRecruitmentPlan && (
                  <button
                    onClick={onOpenRecruitmentPlan}
                    className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-purple-950/80 to-indigo-950/80 hover:from-purple-900/90 hover:to-indigo-900/90 text-purple-300 hover:text-purple-200 font-bold text-xs border border-purple-500/50 flex items-center gap-2 transition-all active:scale-95 cursor-pointer shadow-md shadow-purple-500/10"
                  >
                    <Sparkles className="w-4 h-4 text-purple-400" />
                    <span>ReliefHGV 10-Slide Investor Deck &amp; Plan</span>
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 3. COST REDUCTION & SIMPLICITY MATRIX */}
      <section id="efficiency" className="py-16 sm:py-24 px-4 sm:px-8 border-b border-slate-900 bg-slate-900/40">
        <div className="mx-auto max-w-6xl space-y-12">
          
          <div className="text-center space-y-3">
            <h2 className="text-2xl sm:text-4xl font-extrabold text-white tracking-tight">
              One Unified Sign-In. Eliminating 7 Fragmented Subscriptions.
            </h2>
            <p className="text-sm sm:text-base text-slate-400 max-w-2xl mx-auto">
              UK operators waste thousands annually juggling incompatible apps for routing, checks, tacho bureau, freight exchanges, and demurrage claims. Drive Partners brings them all together.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            
            <div className="p-5 rounded-2xl bg-slate-950 border border-slate-800 space-y-2">
              <div className="w-8 h-8 rounded-lg bg-red-500/20 text-red-400 flex items-center justify-center font-bold text-xs font-mono">
                OLD
              </div>
              <h4 className="text-sm font-bold text-white line-through text-slate-400">7 Disjointed Apps &amp; Logins</h4>
              <p className="text-xs text-slate-500">
                Separate satnav hardware, paper defect slips, broker calls, and manual spreadsheets.
              </p>
            </div>

            <div className="p-5 rounded-2xl bg-slate-950 border border-cyan-500/40 shadow-lg shadow-cyan-500/5 space-y-2">
              <div className="w-8 h-8 rounded-lg bg-cyan-500/20 text-cyan-400 flex items-center justify-center font-bold text-xs font-mono">
                NEW
              </div>
              <h4 className="text-sm font-bold text-cyan-300">1 Unified Sign-In</h4>
              <p className="text-xs text-slate-400">
                Drivers, hauliers, and depots log into a single real-time platform with role-tailored apps.
              </p>
            </div>

            <div className="p-5 rounded-2xl bg-slate-950 border border-slate-800 space-y-2">
              <div className="w-8 h-8 rounded-lg bg-red-500/20 text-red-400 flex items-center justify-center font-bold text-xs font-mono">
                COST
              </div>
              <h4 className="text-sm font-bold text-white line-through text-slate-400">Unrecovered Demurrage &amp; Fines</h4>
              <p className="text-xs text-slate-500">
                Hauliers lose hundreds in unbilled detention time at busy depot docks.
              </p>
            </div>

            <div className="p-5 rounded-2xl bg-slate-950 border border-emerald-500/40 shadow-lg shadow-emerald-500/5 space-y-2">
              <div className="w-8 h-8 rounded-lg bg-emerald-500/20 text-emerald-400 flex items-center justify-center font-bold text-xs font-mono">
                ROI
              </div>
              <h4 className="text-sm font-bold text-emerald-300">Automated £45/hr Billing</h4>
              <p className="text-xs text-slate-400">
                GPS geofencing proves arrival, dwell, and departure to recover demurrage automatically.
              </p>
            </div>

          </div>
        </div>
      </section>

      {/* 4. DETAILED PRODUCT SUITE SECTIONS */}
      <section id="suite" className="py-16 sm:py-24 px-4 sm:px-8 space-y-20 max-w-7xl mx-auto">
        
        {/* DRIVERS DEEP DIVE */}
        <div id="drivers" className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          <div className="lg:col-span-6 space-y-4">
            <span className="text-xs font-mono font-bold text-amber-400 tracking-wider uppercase bg-amber-500/10 px-2.5 py-1 rounded-full border border-amber-500/20">
              Driver Experience
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-white">
              Built for In-Cab Simplicity: Glove-Friendly, Safe &amp; Direct
            </h2>
            <p className="text-sm text-slate-300 leading-relaxed">
              Drivers don't need complex menus while behind the wheel. The Drive Partners In-Cab Cockpit gives drivers a high-contrast 5-tab interface:
            </p>
            <ul className="space-y-2.5 text-xs text-slate-300">
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                <span><strong>3-Tier Low-Bridge Radar:</strong> Live overhead clearance alerts for your exact combo height.</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                <span><strong>DVSA 27-Point Checks:</strong> Fast walkaround inspection with camera defect locks & MOT records.</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                <span><strong>Tachograph Thermal Roll OCR:</strong> Instant AI printout scans to prevent 4.5h driving infringements.</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                <span><strong>Relief Shift Marketplace:</strong> Pick up local relief shifts and get paid on Friday with self-billing.</span>
              </li>
            </ul>
            <div className="pt-2">
              <button
                onClick={() => onSelectPortal('DRIVER')}
                className="px-5 py-2.5 bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-xs rounded-xl shadow-lg shadow-amber-500/20 flex items-center gap-2 transition-all active:scale-95"
              >
                <span>Open Driver Cockpit</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>

          <div className="lg:col-span-6 bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center gap-2">
                <Smartphone className="w-5 h-5 text-amber-400" />
                <span className="font-bold text-white text-xs">Mobile 5-Tab Interface</span>
              </div>
              <span className="text-[10px] font-mono text-emerald-400 font-bold bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">
                GLOVE-FRIENDLY
              </span>
            </div>
            <div className="grid grid-cols-2 gap-3 text-xs">
              <div className="p-3 rounded-xl bg-slate-950 border border-slate-800">
                <span className="text-[10px] text-slate-500 block font-mono">RADAR STATUS</span>
                <span className="font-bold text-emerald-400">Green Clearance (&gt;30cm)</span>
              </div>
              <div className="p-3 rounded-xl bg-slate-950 border border-slate-800">
                <span className="text-[10px] text-slate-500 block font-mono">TACHO BREAK</span>
                <span className="font-bold text-amber-400">1h 15m Remaining</span>
              </div>
              <div className="p-3 rounded-xl bg-slate-950 border border-slate-800">
                <span className="text-[10px] text-slate-500 block font-mono">1-TAP ACTION</span>
                <span className="font-bold text-cyan-300">Clear Route + 5s Undo</span>
              </div>
              <div className="p-3 rounded-xl bg-slate-950 border border-slate-800">
                <span className="text-[10px] text-slate-500 block font-mono">ARRIVAL MARKER</span>
                <span className="font-bold text-purple-400 font-mono">///safe.truck.entry</span>
              </div>
            </div>
          </div>
        </div>

        {/* HAULIERS DEEP DIVE */}
        <div id="hauliers" className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center pt-8 border-t border-slate-900">
          <div className="lg:col-span-6 order-2 lg:order-1 bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center gap-2">
                <Laptop className="w-5 h-5 text-cyan-400" />
                <span className="font-bold text-white text-xs">Transport Command Suite</span>
              </div>
              <span className="text-[10px] font-mono text-cyan-400 font-bold bg-cyan-500/10 px-2 py-0.5 rounded border border-cyan-500/20">
                WIDESCREEN OPS
              </span>
            </div>
            <div className="grid grid-cols-2 gap-3 text-xs">
              <div className="p-3 rounded-xl bg-slate-950 border border-slate-800">
                <span className="text-[10px] text-slate-500 block font-mono">CASCADING TENDERS</span>
                <span className="font-bold text-cyan-400">Tier 1 &rarr; Tier 2 &rarr; Tier 3</span>
              </div>
              <div className="p-3 rounded-xl bg-slate-950 border border-slate-800">
                <span className="text-[10px] text-slate-500 block font-mono">FLEET VOR</span>
                <span className="font-bold text-rose-400">1 Grounded (Walkaround Lock)</span>
              </div>
              <div className="p-3 rounded-xl bg-slate-950 border border-slate-800">
                <span className="text-[10px] text-slate-500 block font-mono">SCOPE 3 ESG</span>
                <span className="font-bold text-emerald-400">168.4 kg CO2e Deadhead Saved</span>
              </div>
              <div className="p-3 rounded-xl bg-slate-950 border border-slate-800">
                <span className="text-[10px] text-slate-500 block font-mono">TMS CONNECTORS</span>
                <span className="font-bold text-blue-400">SAP / Oracle / Mandata</span>
              </div>
            </div>
          </div>

          <div className="lg:col-span-6 order-1 lg:order-2 space-y-4">
            <span className="text-xs font-mono font-bold text-cyan-400 tracking-wider uppercase bg-cyan-500/10 px-2.5 py-1 rounded-full border border-cyan-500/20">
              Haulier Operations
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-white">
              Transport Command: Cascading Freight &amp; Fleet Compliance
            </h2>
            <p className="text-sm text-slate-300 leading-relaxed">
              Designed for transport managers, fleet owners, and dispatchers to maintain DVSA Earned Recognition while filling empty trailers:
            </p>
            <ul className="space-y-2.5 text-xs text-slate-300">
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-cyan-400 shrink-0" />
                <span><strong>Cascading Load Tendering:</strong> Auto-tender unassigned freight to internal fleet, then subcontractors, then open exchange.</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-cyan-400 shrink-0" />
                <span><strong>DVSA Earned Recognition:</strong> Real-time KPI audit matrices (B1-B4 safety &amp; D1-D4 tachograph compliance).</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-cyan-400 shrink-0" />
                <span><strong>Trailer Fleet Tracking:</strong> Real-time coupling verification, brake tests, and MOT expiration badges.</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-cyan-400 shrink-0" />
                <span><strong>Scope 3 Carbon Accounting:</strong> DEFRA greenhouse gas conversion factors certified for shipper sustainability tenders.</span>
              </li>
            </ul>
            <div className="pt-2">
              <button
                onClick={() => onSelectPortal('HAULIER')}
                className="px-5 py-2.5 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-slate-950 font-black text-xs rounded-xl shadow-lg shadow-cyan-500/20 flex items-center gap-2 transition-all active:scale-95"
              >
                <span>Open Transport Command</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        {/* BUSINESSES / DEPOTS DEEP DIVE */}
        <div id="businesses" className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center pt-8 border-t border-slate-900">
          <div className="lg:col-span-6 space-y-4">
            <span className="text-xs font-mono font-bold text-emerald-400 tracking-wider uppercase bg-emerald-500/10 px-2.5 py-1 rounded-full border border-emerald-500/20">
              Commercial Depots &amp; Shippers
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-white">
              Site Risk Profiles, ISO 45001 &amp; Demurrage Ledgers
            </h2>
            <p className="text-sm text-slate-300 leading-relaxed">
              Depot operators baseline yard hazards, issue automated gatehouse inductions, and manage transparent turnaround times:
            </p>
            <ul className="space-y-2.5 text-xs text-slate-300">
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                <span><strong>Satellite Yard CAD &amp; AI Hazards:</strong> Detect turnaround pinch points, blind corners, and bay numbers from aerial imagery.</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                <span><strong>Automated Demurrage Claims:</strong> Unarguable geofenced arrival/departure logs billing £45/hr after agreed free time.</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                <span><strong>Digital Driver Inductions:</strong> Touchless gatehouse safety videos, PPE declarations, and cage chock verifications.</span>
              </li>
            </ul>
            <div className="pt-2">
              <button
                onClick={() => onSelectPortal('BUSINESS')}
                className="px-5 py-2.5 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black text-xs rounded-xl shadow-lg shadow-emerald-500/20 flex items-center gap-2 transition-all active:scale-95"
              >
                <span>Open Business &amp; Depot Portal</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>

          <div className="lg:col-span-6 bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center gap-2">
                <Building2 className="w-5 h-5 text-emerald-400" />
                <span className="font-bold text-white text-xs">Depot Risk Assessment</span>
              </div>
              <span className="text-[10px] font-mono text-emerald-400 font-bold bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">
                ISO 45001 READY
              </span>
            </div>
            <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-2 text-xs">
              <div className="flex justify-between items-center">
                <span className="font-bold text-white">Bristol Gateway DC (Bay 14)</span>
                <span className="text-emerald-400 font-mono text-[11px] font-bold">SAFETY SCORE: 94/100</span>
              </div>
              <p className="text-slate-400 text-[11px]">
                Low risk yard. One-way clockwise circulation enforced. Trailer wheel chocks mandatory before decoupling.
              </p>
            </div>
          </div>
        </div>

      </section>

      {/* 5. FOOTER & ADMIN ACCESS */}
      <footer className="mt-auto border-t border-slate-900 bg-slate-950 px-4 sm:px-8 py-8 text-xs text-slate-500">
        <div className="mx-auto max-w-7xl flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <span className="font-bold text-slate-300">Drive Partners Ltd &amp; ReliefHGV</span>
            <span>•</span>
            <span>Enterprise Logistics Suite v2.1.0</span>
          </div>
          <div className="flex items-center gap-4">
            <button
              onClick={() => onSelectPortal('ADMIN')}
              className="text-slate-400 hover:text-cyan-400 font-bold transition-colors flex items-center gap-1.5"
            >
              <Users className="w-3.5 h-3.5" />
              <span>Admin Portal &amp; User Access</span>
            </button>
            <span>•</span>
            <span>Google Cloud Run (europe-west2)</span>
          </div>
        </div>
      </footer>

      {/* 6. SIMPLE SIGN-IN MODAL (USER TYPE SELECTION) */}
      {isLoginModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-md animate-in fade-in">
          <div className="w-full max-w-md bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-2xl space-y-5">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center text-slate-950 font-black">
                  DP
                </div>
                <div>
                  <h3 className="font-bold text-base text-white">Drive Partners Sign-In</h3>
                  <p className="text-[11px] text-slate-400">Choose your portal to enter</p>
                </div>
              </div>
              <button
                onClick={() => setIsLoginModalOpen(false)}
                className="text-slate-400 hover:text-white p-1 rounded-lg text-sm"
              >
                ✕
              </button>
            </div>

            <div className="space-y-2.5">
              
              {/* Option 1: Driver (Log In or Create Account) */}
              <div className="rounded-2xl bg-slate-950 border border-amber-500/40 p-3.5 space-y-3 shadow-lg shadow-amber-500/5">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-amber-500/20 text-amber-400 flex items-center justify-center font-bold">
                      <Truck className="w-5 h-5" />
                    </div>
                    <div>
                      <div className="text-sm font-bold text-white flex items-center gap-1.5">
                        <span>HGV Driver</span>
                        <span className="text-[10px] font-mono font-bold bg-amber-500/20 text-amber-300 px-1.5 py-0.5 rounded border border-amber-500/30">
                          Co-Pilot &amp; Relief
                        </span>
                      </div>
                      <div className="text-[11px] text-slate-400">
                        In-cab navigation, checks, tacho &amp; relief shifts
                      </div>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-2 pt-1 border-t border-slate-800/80">
                  <button
                    onClick={() => {
                      setIsLoginModalOpen(false);
                      onSelectPortal('DRIVER');
                    }}
                    className="py-2.5 px-3 rounded-xl bg-slate-850 hover:bg-slate-800 text-white font-bold text-xs flex items-center justify-center gap-1.5 transition-all active:scale-95 cursor-pointer border border-slate-700 hover:border-amber-400/40"
                  >
                    <LogIn className="w-3.5 h-3.5 text-amber-400" />
                    <span>Log In</span>
                  </button>
                  <button
                    onClick={() => {
                      setIsLoginModalOpen(false);
                      onOpenLicenceScanner?.();
                    }}
                    className="py-2.5 px-3 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-black text-xs flex items-center justify-center gap-1.5 shadow-md shadow-amber-500/20 transition-all active:scale-95 cursor-pointer"
                  >
                    <ShieldCheck className="w-3.5 h-3.5 text-slate-950" />
                    <span>Create Account</span>
                  </button>
                </div>
                {onOpenTachoScan && (
                  <button
                    onClick={() => {
                      setIsLoginModalOpen(false);
                      onOpenTachoScan();
                    }}
                    className="w-full py-2.5 px-3 rounded-xl bg-amber-500/15 hover:bg-amber-500/25 text-amber-300 font-bold text-xs flex items-center justify-center gap-2 border border-amber-500/35 transition-all active:scale-95 cursor-pointer"
                  >
                    <ScanLine className="w-3.5 h-3.5 text-amber-400" />
                    <span>Launch Tacho-Scan Directly (Product #1)</span>
                  </button>
                )}
              </div>

              {/* Option 2: Haulier */}
              <button
                onClick={() => {
                  setIsLoginModalOpen(false);
                  onSelectPortal('HAULIER');
                }}
                className="w-full p-3.5 rounded-2xl bg-slate-950 border border-slate-800 hover:border-cyan-500/50 hover:bg-slate-850 flex items-center justify-between transition-all group text-left"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-cyan-500/20 text-cyan-400 flex items-center justify-center font-bold">
                    <Laptop className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="text-sm font-bold text-white group-hover:text-cyan-300">
                      Haulier / Fleet Operator
                    </div>
                    <div className="text-[11px] text-slate-400">
                      Transport command, cascading freight &amp; ESG
                    </div>
                  </div>
                </div>
                <ChevronRight className="w-4 h-4 text-slate-500 group-hover:text-cyan-400" />
              </button>

              {/* Option 3: Business */}
              <button
                onClick={() => {
                  setIsLoginModalOpen(false);
                  onSelectPortal('BUSINESS');
                }}
                className="w-full p-3.5 rounded-2xl bg-slate-950 border border-slate-800 hover:border-emerald-500/50 hover:bg-slate-850 flex items-center justify-between transition-all group text-left"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center font-bold">
                    <Building2 className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="text-sm font-bold text-white group-hover:text-emerald-300">
                      Commercial Depot / Business
                    </div>
                    <div className="text-[11px] text-slate-400">
                      Site baselines, ISO sign-offs &amp; demurrage
                    </div>
                  </div>
                </div>
                <ChevronRight className="w-4 h-4 text-slate-500 group-hover:text-emerald-400" />
              </button>

              {/* Option 4: Admin Portal */}
              <button
                onClick={() => {
                  setIsLoginModalOpen(false);
                  onSelectPortal('ADMIN');
                }}
                className="w-full p-3 rounded-xl bg-slate-950/60 border border-slate-800 hover:border-slate-700 flex items-center justify-between transition-all group text-left mt-2"
              >
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-lg bg-slate-800 text-slate-400 flex items-center justify-center font-bold">
                    <Users className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="text-xs font-bold text-slate-300 group-hover:text-white">
                      Admin Portal &amp; Permissions
                    </div>
                    <div className="text-[10px] text-slate-500">
                      Add users &amp; configure feature access
                    </div>
                  </div>
                </div>
                <ChevronRight className="w-4 h-4 text-slate-600 group-hover:text-slate-400" />
              </button>

              {/* Option 5: Register by Driving Licence Scan */}
              {onOpenLicenceScanner && (
                <div className="pt-3 mt-1 border-t border-slate-800">
                  <div className="text-[11px] font-mono text-slate-400 mb-2 uppercase tracking-wider">
                    First Time HGV Driver?
                  </div>
                  <button
                    onClick={() => {
                      setIsLoginModalOpen(false);
                      onOpenLicenceScanner();
                    }}
                    className="w-full p-3.5 rounded-2xl bg-gradient-to-r from-amber-500/15 via-amber-500/10 to-amber-600/15 border border-amber-500/40 hover:border-amber-400 flex items-center justify-between transition-all group text-left cursor-pointer"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-amber-500/20 text-amber-400 flex items-center justify-center font-bold">
                        <ShieldCheck className="w-5 h-5" />
                      </div>
                      <div>
                        <div className="text-sm font-bold text-white group-hover:text-amber-300">
                          Create Account via Driving Licence
                        </div>
                        <div className="text-[11px] text-amber-400/80">
                          Scan photocard for instant DVLA &amp; CPC verification
                        </div>
                      </div>
                    </div>
                    <ChevronRight className="w-4 h-4 text-amber-400 group-hover:translate-x-0.5 transition-transform" />
                  </button>
                </div>
              )}

            </div>
          </div>
        </div>
      )}
    </div>
  );
};
