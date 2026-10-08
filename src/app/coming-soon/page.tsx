'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  Truck,
  ShieldCheck,
  Clock,
  Sparkles,
  Zap,
  Lock,
  Unlock,
  KeyRound,
  Eye,
  EyeOff,
  CheckCircle2,
  AlertTriangle,
  ArrowRight,
  Camera,
  Calendar,
  FileText,
  Search,
  Check,
  X,
  Play
} from 'lucide-react';
import { TachoScanMarketingVideo } from '@/components/marketing/TachoScanMarketingVideo';
import { DriverPreRegisterModal } from '@/components/marketing/DriverPreRegisterModal';

export default function ComingSoonPage() {
  const router = useRouter();

  // Driver Pre-Registration Modal State
  const [isDriverPreRegisterOpen, setIsDriverPreRegisterOpen] = useState(false);

  // VIP Login Modal State
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  // Already authenticated state
  const [currentUser, setCurrentUser] = useState<string | null>(null);

  // Early interest email newsletter state
  const [interestEmail, setInterestEmail] = useState('');
  const [interestSubmitted, setInterestSubmitted] = useState(false);

  useEffect(() => {
    // Check if user already has an active VIP session in cookie or localStorage
    const savedUser = localStorage.getItem('dp_preview_user');
    const hasAccess = document.cookie.includes('dp_preview_access=1') || localStorage.getItem('dp_preview_access') === '1';
    if (hasAccess && savedUser) {
      setCurrentUser(savedUser);
    }
  }, []);

  const handleVipLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setErrorMessage('');
    setSuccessMessage('');

    try {
      const res = await fetch('/api/auth/vip-access', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });

      const data = await res.json();

      if (res.ok && data.success) {
        setSuccessMessage(`Welcome, ${data.name || data.email}! Unlocking platform...`);
        localStorage.setItem('dp_preview_access', '1');
        localStorage.setItem('dp_preview_user', data.email);
        setCurrentUser(data.email);

        setTimeout(() => {
          setIsLoginModalOpen(false);
          router.push('/');
          router.refresh();
        }, 800);
      } else {
        setErrorMessage(data.error || 'Invalid credentials. Please verify your email and password.');
      }
    } catch (err) {
      setErrorMessage('Network error. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleLockPlatform = async () => {
    try {
      await fetch('/api/auth/vip-access', { method: 'DELETE' });
    } catch (e) {
      // ignore
    }
    document.cookie = 'dp_preview_access=; path=/; max-age=0';
    document.cookie = 'dp_preview_user=; path=/; max-age=0';
    localStorage.removeItem('dp_preview_access');
    localStorage.removeItem('dp_preview_user');
    setCurrentUser(null);
    router.refresh();
  };

  const handleInterestSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!interestEmail || !interestEmail.includes('@')) return;
    setInterestSubmitted(true);
  };

  return (
    <div className="min-h-dvh bg-slate-950 text-slate-100 flex flex-col font-sans selection:bg-cyan-500 relative overflow-x-hidden">
      {/* Ambient Cockpit Backlight Effects */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[350px] bg-cyan-600/10 rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute top-1/3 -right-20 w-[500px] h-[400px] bg-amber-500/10 rounded-full blur-[160px] pointer-events-none" />
      <div className="absolute bottom-1/4 -left-20 w-[500px] h-[400px] bg-blue-600/10 rounded-full blur-[160px] pointer-events-none" />

      {/* Top Bar / VIP Status */}
      {currentUser ? (
        <div className="bg-emerald-950/90 border-b border-emerald-500/30 px-4 py-2 text-xs font-mono flex items-center justify-between z-50 sticky top-0 backdrop-blur-md">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
            <span className="text-emerald-300 font-bold">
              VIP PREVIEW ACTIVE: {currentUser}
            </span>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => router.push('/')}
              className="px-3 py-1 rounded-lg bg-emerald-500 text-slate-950 font-bold text-xs hover:bg-emerald-400 transition cursor-pointer"
            >
              Enter Full Cockpit ➔
            </button>
            <button
              onClick={handleLockPlatform}
              className="px-2.5 py-1 rounded-lg bg-slate-900 border border-slate-700 text-slate-300 hover:text-white text-xs cursor-pointer"
            >
              Lock Site
            </button>
          </div>
        </div>
      ) : null}

      {/* Header */}
      <header className="border-b border-slate-800/80 bg-slate-950/80 backdrop-blur-xl px-4 sm:px-8 py-4 flex items-center justify-between sticky top-0 z-40">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-cyan-500 via-blue-600 to-indigo-700 flex items-center justify-center font-black text-white text-lg shadow-glow-blue border border-cyan-400/40">
            DP
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-black tracking-tight text-white text-base sm:text-lg block leading-none">
                DRIVE PARTNERS
              </span>
              <span className="px-1.5 py-0.5 rounded text-[9px] font-mono font-bold bg-cyan-500/20 text-cyan-300 border border-cyan-500/40">
                SMARTHAUL OS
              </span>
            </div>
            <span className="text-[10px] font-mono text-slate-400">
              UK Freight &amp; Digital Compliance Ecosystem
            </span>
          </div>
        </div>

        {/* Header Action Buttons */}
        <div className="flex items-center gap-2">
          {/* Driver Pre-Registration CTA */}
          <button
            onClick={() => setIsDriverPreRegisterOpen(true)}
            className="px-3.5 py-2 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-slate-950 font-black text-xs font-mono flex items-center gap-1.5 transition shadow-glow-blue cursor-pointer touch-press"
          >
            <Truck className="w-3.5 h-3.5 text-slate-950" />
            <span className="hidden sm:inline">Driver</span> Pre-Register
          </button>

          {/* Colleague Access Button */}
          <button
            onClick={() => setIsLoginModalOpen(true)}
            className="px-3 py-2 rounded-xl bg-slate-900/90 hover:bg-slate-800 border border-slate-700/80 hover:border-cyan-500/50 text-xs font-mono text-cyan-300 hover:text-cyan-200 flex items-center gap-1.5 transition-all shadow-sm cursor-pointer touch-press"
          >
            <Lock className="w-3.5 h-3.5 text-cyan-400" />
            <span className="font-bold hidden sm:inline">Colleague</span> Access
          </button>
        </div>
      </header>

      {/* Main Hero & Spotlight */}
      <main className="flex-1 max-w-5xl mx-auto w-full px-4 sm:px-8 py-10 sm:py-16 space-y-12">
        {/* Launch Status Banner */}
        <div className="text-center space-y-4 max-w-2xl mx-auto">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-300 text-xs font-mono font-bold">
            <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
            <span>NOW OPEN • DRIVER BETA PRE-REGISTRATION</span>
          </div>

          <h1 className="text-3xl sm:text-5xl font-black text-white tracking-tight leading-tight">
            The Operating System for British Haulage &amp; Compliance
          </h1>

          <p className="text-sm sm:text-base text-slate-400 leading-relaxed font-sans">
            DrivePartners is modernizing commercial transport with unified in-cab AI, direct haulier freight exchange, and automated statutory compliance.
          </p>

          {/* Exclusive Driver Pre-Registration CTA */}
          <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3">
            <button
              onClick={() => setIsDriverPreRegisterOpen(true)}
              className="w-full sm:w-auto px-6 py-3.5 rounded-2xl bg-gradient-to-r from-cyan-500 via-blue-500 to-indigo-600 hover:from-cyan-400 hover:to-indigo-500 text-slate-950 font-black text-xs sm:text-sm font-mono flex items-center justify-center gap-2 shadow-glow-blue transition transform hover:scale-105 cursor-pointer"
            >
              <Truck className="w-4 h-4 text-slate-950" />
              <span>Pre-Register as a Driver (Tacho-Scan Beta)</span>
              <ArrowRight className="w-4 h-4 text-slate-950" />
            </button>
            <Link
              href="/pre-register"
              className="text-xs font-mono text-cyan-400 hover:text-cyan-300 underline underline-offset-4"
            >
              Direct Pre-Register Link ➔
            </Link>
          </div>
        </div>

        {/* Featured Spotlight Card: Tacho-Scan AI */}
        <div className="relative rounded-3xl p-6 sm:p-10 cockpit-panel border-t-2 border-t-cyan-400 border-cyan-500/30 shadow-2xl space-y-8">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-6">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono font-black bg-cyan-500 text-slate-950 uppercase">
                  Flagship Feature
                </span>
                <span className="text-xs font-mono text-cyan-400 font-bold">
                  Module 4 • In-Cab AI Suite
                </span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-black text-white flex items-center gap-2.5">
                <span>Tacho-Scan AI</span>
                <span className="text-xs font-mono font-normal text-slate-400 border border-slate-700 px-2 py-0.5 rounded-md">
                  v2.0 Horizon
                </span>
              </h2>
              <p className="text-xs sm:text-sm text-slate-300 font-sans">
                Instant digital tachograph thermal printout OCR, 28-day statutory audit matrix, and automated DVSA defense generator.
              </p>
            </div>

            <div className="flex items-center gap-2 shrink-0">
              <div className="px-3 py-1.5 rounded-xl bg-slate-950 border border-slate-800 text-center font-mono">
                <div className="text-[10px] text-slate-400">OCR RECOGNITION</div>
                <div className="text-cyan-400 font-black text-sm">99.8% Neural</div>
              </div>
              <div className="px-3 py-1.5 rounded-xl bg-slate-950 border border-slate-800 text-center font-mono">
                <div className="text-[10px] text-slate-400">RETENTION</div>
                <div className="text-emerald-400 font-black text-sm">28 Days DVSA</div>
              </div>
            </div>
          </div>

          {/* 40-Second Interactive Marketing Video Tour */}
          <div className="space-y-2.5 pt-2">
            <div className="flex items-center justify-between text-xs font-mono">
              <span className="text-white font-bold flex items-center gap-2">
                <Play className="w-4 h-4 text-cyan-400" /> Watch the 40-Second Feature Video:
              </span>
              <span className="text-cyan-400">00:40 Runtime • Interactive In-Cab Demo</span>
            </div>
            <TachoScanMarketingVideo onPreRegisterClick={() => setIsDriverPreRegisterOpen(true)} />
          </div>

          {/* Key Pillars of Tacho-Scan AI */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* 1. Universal Hardware Scan */}
            <div className="p-4 rounded-2xl bg-slate-950/60 border border-slate-800/80 space-y-2">
              <div className="flex items-center gap-2.5 text-cyan-400">
                <Camera className="w-5 h-5" />
                <h3 className="font-bold text-white text-sm font-mono">
                  Universal Thermal Roll Scanning
                </h3>
              </div>
              <p className="text-xs text-slate-400 leading-relaxed font-sans">
                Trained across all major manufacturer layouts (Stoneridge Electronics SE5000 Smart Gen 2, Continental VDO DTCO 4.1, Actia). Ingests multi-drop 40–60cm rolls, driver cards, or end-of-shift receipts in seconds with anti-glare cab shadow correction.
              </p>
            </div>

            {/* 2. Statutory 28-Day Matrix */}
            <div className="p-4 rounded-2xl bg-slate-950/60 border border-slate-800/80 space-y-2">
              <div className="flex items-center gap-2.5 text-emerald-400">
                <Calendar className="w-5 h-5" />
                <h3 className="font-bold text-white text-sm font-mono">
                  28-Day Statutory DVSA Matrix
                </h3>
              </div>
              <p className="text-xs text-slate-400 leading-relaxed font-sans">
                Full 4-week compliance ledger meeting statutory Transport Act 1968 &amp; EU Regulation 165/2014 Article 36 roadside inspection mandates. Highlights compliant shifts, reduced rests, and fortnight driving hours.
              </p>
            </div>

            {/* 3. Article 12 Defense Generator */}
            <div className="p-4 rounded-2xl bg-slate-950/60 border border-slate-800/80 space-y-2">
              <div className="flex items-center gap-2.5 text-amber-400">
                <FileText className="w-5 h-5" />
                <h3 className="font-bold text-white text-sm font-mono">
                  Article 12 Emergency Defense Slips
                </h3>
              </div>
              <p className="text-xs text-slate-400 leading-relaxed font-sans">
                One-tap roadside concession generator with pre-formatted statutory narratives for unexpected traffic gridlock, ferry delays, or lack of safe parking, signed digitally in-cab before officer inspection.
              </p>
            </div>

            {/* 4. Optical Macro Dispute Proof */}
            <div className="p-4 rounded-2xl bg-slate-950/60 border border-slate-800/80 space-y-2">
              <div className="flex items-center gap-2.5 text-purple-400">
                <Search className="w-5 h-5" />
                <h3 className="font-bold text-white text-sm font-mono">
                  Macro Optical Dispute Verification
                </h3>
              </div>
              <p className="text-xs text-slate-400 leading-relaxed font-sans">
                DVSA rules strictly prohibit arbitrary manual overrides. Contesting any misread odometer or activity line requires a high-resolution optical macro photo of the thermal paper, permanently verifying data integrity.
              </p>
            </div>
          </div>

          {/* Timezone Switcher & Cab Clock highlight */}
          <div className="p-4 rounded-2xl bg-gradient-to-r from-cyan-950/40 via-blue-950/30 to-slate-950 border border-cyan-500/20 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs font-mono">
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4 text-cyan-400" />
              <span className="text-white font-bold">Dual UTC ⇄ BST Local Cab Clock:</span>
              <span className="text-slate-400">
                Instant translation between tachograph legal UTC standard and local dashboard cab time.
              </span>
            </div>
            <div className="flex items-center gap-1.5 shrink-0">
              <span className="px-2 py-0.5 rounded bg-slate-800 text-slate-300 text-[10px]">🕒 UTC</span>
              <span className="text-slate-500">⇄</span>
              <span className="px-2 py-0.5 rounded bg-cyan-500/20 text-cyan-300 text-[10px] border border-cyan-500/40 font-bold">
                🇬🇧 BST (+1h)
              </span>
            </div>
          </div>
        </div>

        {/* Other Modules Teaser */}
        <div className="space-y-4">
          <div className="text-center space-y-1">
            <h3 className="text-lg font-black text-white font-mono uppercase tracking-wider">
              Also Launching in SmartHaul OS
            </h3>
            <p className="text-xs text-slate-400">
              A comprehensive suite designed from the ground up for UK transport operations
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs font-mono">
            <div className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-2">
              <div className="text-rose-400 font-bold flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4" /> Driver Safety Shield
              </div>
              <p className="text-slate-400 font-sans text-[11px]">
                4.65m low-bridge radar alerts, snapshot SNAP meal expense tracking, and £45/hr automated GPS demurrage delay claim generator.
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-2">
              <div className="text-emerald-400 font-bold flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4" /> Walkaround Check 2.0
              </div>
              <p className="text-slate-400 font-sans text-[11px]">
                18-point DVSA photographic defect inspection, electronic driver signoff, and direct fleet workshop defect dispatch.
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-2">
              <div className="text-blue-400 font-bold flex items-center gap-1.5">
                <Truck className="w-4 h-4" /> Haulier Fleet Command
              </div>
              <p className="text-slate-400 font-sans text-[11px]">
                1Hz live vehicle telematics, VOR lockouts, driver timesheet verification, and direct haulage exchange matching.
              </p>
            </div>
          </div>
        </div>

        {/* Email Signup / Register Interest */}
        <div className="p-6 sm:p-8 rounded-3xl bg-slate-900 border border-slate-800 text-center space-y-4 max-w-xl mx-auto">
          <h3 className="text-lg font-bold text-white">Get Notified at Launch</h3>
          <p className="text-xs text-slate-400">
            Join independent British HGV drivers and transport operators receiving early access invitations.
          </p>

          {interestSubmitted ? (
            <div className="p-3 rounded-xl bg-emerald-500/15 border border-emerald-500/40 text-emerald-300 text-xs font-mono font-bold flex items-center justify-center gap-2">
              <Check className="w-4 h-4 text-emerald-400" />
              <span>You're on the list! We will reach out when public access goes live.</span>
            </div>
          ) : (
            <form onSubmit={handleInterestSubmit} className="flex gap-2 max-w-md mx-auto">
              <input
                type="email"
                required
                value={interestEmail}
                onChange={(e) => setInterestEmail(e.target.value)}
                placeholder="driver@transport.co.uk"
                className="flex-1 px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-xs font-mono text-white placeholder-slate-500 focus:outline-none focus:border-cyan-400"
              />
              <button
                type="submit"
                className="px-4 py-2.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs font-mono transition cursor-pointer"
              >
                Notify Me
              </button>
            </form>
          )}
        </div>

        {/* Discreet Colleague Access Trigger */}
        <div className="text-center pt-4">
          <button
            onClick={() => setIsLoginModalOpen(true)}
            className="text-xs font-mono text-slate-500 hover:text-cyan-400 flex items-center justify-center gap-1.5 mx-auto transition cursor-pointer"
          >
            <KeyRound className="w-3.5 h-3.5" />
            <span>Colleague / Partner Access Portal</span>
          </button>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-800/80 py-6 text-center text-xs font-mono text-slate-500">
        <p>© 2026 DrivePartners (SmartHaul OS) • UK Freight &amp; In-Cab Compliance Platform</p>
      </footer>

      {/* ========================================================================= */}
      {/* COLLEAGUE VIP LOGIN MODAL                                                 */}
      {/* ========================================================================= */}
      {isLoginModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-4 animate-in fade-in duration-200">
          <div className="relative w-full max-w-md rounded-3xl bg-slate-900 border border-slate-800 shadow-2xl p-6 sm:p-8 space-y-6">
            <button
              onClick={() => {
                setIsLoginModalOpen(false);
                setErrorMessage('');
                setSuccessMessage('');
              }}
              className="absolute top-5 right-5 p-1.5 text-slate-400 hover:text-white rounded-lg cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="space-y-1">
              <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-cyan-500/15 border border-cyan-500/30 text-cyan-300 text-[10px] font-mono font-bold">
                <Lock className="w-3 h-3 text-cyan-400" />
                <span>RESTRICTED TEAM PREVIEW</span>
              </div>
              <h3 className="text-xl font-black text-white">
                Colleague Access
              </h3>
              <p className="text-xs text-slate-400">
                Please enter your authorized email and password to view the live platform.
              </p>
            </div>

            {errorMessage && (
              <div className="p-3 rounded-xl bg-rose-500/15 border border-rose-500/30 text-rose-300 text-xs font-mono flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 text-rose-400 shrink-0" />
                <span>{errorMessage}</span>
              </div>
            )}

            {successMessage && (
              <div className="p-3 rounded-xl bg-emerald-500/15 border border-emerald-500/40 text-emerald-300 text-xs font-mono flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>{successMessage}</span>
              </div>
            )}

            <form onSubmit={handleVipLogin} className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-xs font-mono text-slate-300 block">
                  Colleague Email Address:
                </label>
                <input
                  type="email"
                  required
                  autoFocus
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="angie.kite@me.com"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-xs font-mono text-white placeholder-slate-600 focus:outline-none focus:border-cyan-400"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-mono text-slate-300 block">
                  Access Password:
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Enter password"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-xs font-mono text-white placeholder-slate-600 focus:outline-none focus:border-cyan-400 pr-10"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full py-3 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-slate-950 font-black text-xs font-mono flex items-center justify-center gap-2 transition shadow-lg shadow-cyan-500/20 cursor-pointer disabled:opacity-50"
              >
                {isLoading ? (
                  <span>Verifying Credentials...</span>
                ) : (
                  <>
                    <Unlock className="w-4 h-4" />
                    <span>Unlock SmartHaul OS</span>
                  </>
                )}
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Driver Early Access Pre-Registration Modal */}
      <DriverPreRegisterModal
        isOpen={isDriverPreRegisterOpen}
        onClose={() => setIsDriverPreRegisterOpen(false)}
      />
    </div>
  );
}
