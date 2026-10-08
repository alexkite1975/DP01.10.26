'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  Truck,
  ShieldCheck,
  Briefcase,
  KeyRound,
  ArrowRight,
  Lock,
  LogOut,
  CalendarDays,
  Repeat,
  Clock,
  Sparkles,
  Zap,
  CheckCircle2,
  TrendingUp,
  Activity
} from 'lucide-react';
import { RollingCounter } from '@/components/shared/RollingCounter';

export type UserRole = 'guest' | 'driver' | 'haulier' | 'admin';

export default function HomePage() {
  const [userRole, setUserRole] = useState<UserRole>('guest');
  const [showAdminModal, setShowAdminModal] = useState(false);
  const [passcode, setPasscode] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  useEffect(() => {
    const savedRole = localStorage.getItem('dp_user_role') as UserRole;
    if (savedRole) {
      setUserRole(savedRole);
    }
  }, []);

  const handleAdminAuth = (e: React.FormEvent) => {
    e.preventDefault();
    if (passcode === 'DP-ADMIN-2026') {
      setUserRole('admin');
      localStorage.setItem('dp_user_role', 'admin');
      setShowAdminModal(false);
      setPasscode('');
      setErrorMsg('');
    } else {
      setErrorMsg('Invalid Admin Passcode');
    }
  };

  const handleLogout = () => {
    setUserRole('guest');
    localStorage.removeItem('dp_user_role');
  };

  return (
    <div className="min-h-dvh bg-slate-950 text-slate-100 flex flex-col font-sans selection:bg-blue-600 relative overflow-hidden">
      {/* Ambient Cockpit Glow Orbs */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[300px] bg-blue-600/10 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute top-2/3 right-10 w-[400px] h-[300px] bg-emerald-500/10 rounded-full blur-[140px] pointer-events-none" />

      {/* Top Cockpit Navigation Bar */}
      <header className="border-b border-slate-800/80 bg-slate-950/80 backdrop-blur-xl px-4 sm:px-8 py-3.5 flex items-center justify-between sticky top-0 z-50">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-blue-600 to-indigo-700 flex items-center justify-center font-black text-white text-lg shadow-glow-blue border border-blue-400/30">
            DP
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-black tracking-tight text-white text-base sm:text-lg block leading-none">
                DRIVE PARTNERS
              </span>
              <span className="px-1.5 py-0.5 rounded text-[9px] font-mono font-bold bg-blue-500/20 text-blue-300 border border-blue-500/40">
                OS 2.0
              </span>
            </div>
            <span className="text-[10px] font-mono text-slate-400">
              UK Logistics &amp; Freight Operating System
            </span>
          </div>
        </div>

        {/* Right Header Navigation & Staff Unlock */}
        <div className="flex items-center gap-3">
          {userRole === 'admin' ? (
            <div className="flex items-center gap-2">
              <Link
                href="/admin"
                className="px-3.5 py-1.5 bg-red-600 hover:bg-red-500 text-white font-bold text-xs font-mono rounded-xl flex items-center gap-1.5 shadow-md shadow-red-600/20 transition touch-press"
              >
                <KeyRound className="w-3.5 h-3.5" /> Admin CMS
              </Link>
              <button
                onClick={handleLogout}
                title="Sign out of Admin CMS"
                className="p-1.5 bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white rounded-xl text-xs transition touch-press"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <button
              onClick={() => setShowAdminModal(true)}
              className="text-slate-500 hover:text-slate-300 text-xs font-mono flex items-center gap-1 transition px-2 py-1"
            >
              <Lock className="w-3 h-3" /> Staff
            </button>
          )}

          <Link
            href="/onboarding"
            className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs rounded-xl shadow-glow-blue border border-blue-400/30 transition touch-press"
          >
            Sign In / Register
          </Link>
        </div>
      </header>

      {/* Admin Passcode Modal */}
      {showAdminModal && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-md flex items-center justify-center p-4 z-50 animate-in fade-in">
          <div className="cockpit-panel rounded-3xl max-w-sm w-full p-6 space-y-4 border border-red-500/30">
            <div className="flex items-center gap-2 text-red-400 font-mono text-xs font-bold">
              <KeyRound className="w-4 h-4" />
              <span>STAFF ADMIN GATEWAY</span>
            </div>
            <h3 className="text-lg font-black text-white">Enter System Passcode</h3>
            <p className="text-xs text-slate-400">
              Access the Master CMS Suite, feature toggles, and live platform registry.
            </p>
            <form onSubmit={handleAdminAuth} className="space-y-3">
              <input
                type="password"
                value={passcode}
                onChange={(e) => setPasscode(e.target.value)}
                placeholder="Enter Admin Passcode"
                className="w-full bg-slate-950 border border-slate-700 rounded-xl px-4 py-2.5 text-xs font-mono text-white focus:outline-none focus:border-red-500"
                autoFocus
              />
              {errorMsg && <p className="text-red-400 text-xs font-mono">{errorMsg}</p>}
              <div className="flex gap-2">
                <button
                  type="submit"
                  className="flex-1 py-2.5 bg-red-600 hover:bg-red-500 text-white font-bold text-xs rounded-xl transition touch-press"
                >
                  Verify &amp; Unlock
                </button>
                <button
                  type="button"
                  onClick={() => setShowAdminModal(false)}
                  className="px-4 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-bold rounded-xl transition touch-press"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Main Hero & Cockpit Launchpad */}
      <main className="flex-1 max-w-6xl w-full mx-auto px-4 sm:px-8 py-8 sm:py-12 flex flex-col justify-center space-y-10 z-10">
        {/* Live Operating Telemetry Banner */}
        <div className="cockpit-panel rounded-2xl px-4 py-2.5 flex flex-wrap items-center justify-between gap-3 text-xs font-mono border border-white/10">
          <div className="flex items-center gap-2">
            <span className="relative flex h-2.5 w-2.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500" />
            </span>
            <span className="text-slate-300 font-bold">UK Network Live Telemetry</span>
          </div>

          <div className="flex flex-wrap items-center gap-4 sm:gap-6 text-[11px]">
            <span className="text-slate-400">
              DVSA Roadworthiness:{' '}
              <span className="text-emerald-400 font-bold">100% Green</span>
            </span>
            <span className="text-slate-400">
              Agency Cut:{' '}
              <span className="text-emerald-400 font-bold">£0.00 (Direct Member Payouts)</span>
            </span>
            <span className="text-slate-400">
              Demurrage Rate:{' '}
              <span className="text-amber-400 font-bold">£45.00/hr Guaranteed</span>
            </span>
          </div>
        </div>

        {/* Hero Typography */}
        <div className="text-center space-y-4 max-w-3xl mx-auto">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/30 text-blue-400 text-xs font-mono font-bold">
            <Sparkles className="w-3.5 h-3.5 text-amber-300" />
            <span>Built for British Hauliers &amp; Professional Class 1/2 Drivers</span>
          </div>
          <h1 className="text-3xl sm:text-5xl font-black tracking-tight text-white leading-tight">
            The Modern Operating System for <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-cyan-300 to-emerald-400">UK Road Freight</span>
          </h1>
          <p className="text-slate-300 text-sm sm:text-base leading-relaxed max-w-2xl mx-auto">
            Zero agency commission, instant driver self-billing, 32-point DVSA statutory walkarounds, and member-to-member freight settlement.
          </p>
        </div>

        {/* Dedicated Operational Workflow Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {/* Card 1: Relief Driver Shifts (ReliefHGV) */}
          <Link
            href="/driver/shifts"
            className="cockpit-panel hover:border-amber-500/50 p-6 rounded-3xl transition-all shadow-cockpit flex flex-col justify-between space-y-6 group touch-press"
          >
            <div className="space-y-3.5">
              <div className="flex items-center justify-between">
                <div className="w-12 h-12 rounded-2xl bg-amber-500/10 text-amber-400 border border-amber-500/30 flex items-center justify-center shadow-glow-amber">
                  <CalendarDays className="w-6 h-6" />
                </div>
                <span className="px-2.5 py-1 rounded-full text-[10px] font-mono font-bold bg-amber-500/15 text-amber-300 border border-amber-500/30">
                  Haulier ⇄ Driver
                </span>
              </div>
              <h3 className="text-lg font-black text-white group-hover:text-amber-400 transition">
                1. Relief Driver Shifts (ReliefHGV)
              </h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Agency cover without the agency. Book verified Class 1 &amp; Class 2 relief drivers. Includes Section 44 ITEPA IR35 Safe-Harbour documentation.
              </p>
            </div>
            <div className="flex items-center justify-between pt-2 border-t border-slate-800/80">
              <span className="text-[11px] font-mono text-slate-400">
                Active Cover:{' '}
                <RollingCounter value={142} className="text-amber-400 font-bold" suffix=" Shifts" />
              </span>
              <span className="text-xs font-mono font-bold text-amber-400 flex items-center gap-1 group-hover:translate-x-1 transition">
                Find Shifts <ArrowRight className="w-4 h-4" />
              </span>
            </div>
          </Link>

          {/* Card 2: Haulage & Freight Exchange (HX Freight) */}
          <Link
            href="/freight"
            className="cockpit-panel hover:border-blue-500/50 p-6 rounded-3xl transition-all shadow-cockpit flex flex-col justify-between space-y-6 group touch-press"
          >
            <div className="space-y-3.5">
              <div className="flex items-center justify-between">
                <div className="w-12 h-12 rounded-2xl bg-blue-500/10 text-blue-400 border border-blue-500/30 flex items-center justify-center shadow-glow-blue">
                  <Repeat className="w-6 h-6" />
                </div>
                <span className="px-2.5 py-1 rounded-full text-[10px] font-mono font-bold bg-blue-500/15 text-blue-300 border border-blue-500/30">
                  Business ⇄ Haulier
                </span>
              </div>
              <h3 className="text-lg font-black text-white group-hover:text-blue-400 transition">
                2. Freight Exchange (HX Freight)
              </h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Post 44t FTL &amp; pallet cargo, broadcast 3-tier cascading tenders, eliminate empty return miles, and calculate break-even fuel rates.
              </p>
            </div>
            <div className="flex items-center justify-between pt-2 border-t border-slate-800/80">
              <span className="text-[11px] font-mono text-slate-400">
                Settlement:{' '}
                <span className="text-blue-400 font-bold">Direct e-POD</span>
              </span>
              <span className="text-xs font-mono font-bold text-blue-400 flex items-center gap-1 group-hover:translate-x-1 transition">
                Browse Tenders <ArrowRight className="w-4 h-4" />
              </span>
            </div>
          </Link>

          {/* Card 3: Driver Walkaround & Blueprint HUD */}
          <Link
            href="/driver/walkaround"
            className="cockpit-panel hover:border-emerald-500/50 p-6 rounded-3xl transition-all shadow-cockpit flex flex-col justify-between space-y-6 group touch-press"
          >
            <div className="space-y-3.5">
              <div className="flex items-center justify-between">
                <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 flex items-center justify-center shadow-glow-emerald">
                  <ShieldCheck className="w-6 h-6" />
                </div>
                <span className="px-2.5 py-1 rounded-full text-[10px] font-mono font-bold bg-emerald-500/15 text-emerald-300 border border-emerald-500/30">
                  DVSA Statutory
                </span>
              </div>
              <h3 className="text-lg font-black text-white group-hover:text-emerald-400 transition">
                3. DVSA Walkaround Check
              </h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                32-Point walkaround inspection with interactive 44t Vector Blueprint, defect audio notes, photographic evidence, and instant audit trail.
              </p>
            </div>
            <div className="flex items-center justify-between pt-2 border-t border-slate-800/80">
              <span className="text-[11px] font-mono text-slate-400">
                Compliance:{' '}
                <span className="text-emerald-400 font-bold">100% Statutory</span>
              </span>
              <span className="text-xs font-mono font-bold text-emerald-400 flex items-center gap-1 group-hover:translate-x-1 transition">
                Start Inspection <ArrowRight className="w-4 h-4" />
              </span>
            </div>
          </Link>

          {/* Card 4: Tachograph Rest Horizon & AI OCR */}
          <Link
            href="/driver/tacho"
            className="cockpit-panel hover:border-cyan-500/50 p-6 rounded-3xl transition-all shadow-cockpit flex flex-col justify-between space-y-6 group touch-press"
          >
            <div className="space-y-3.5">
              <div className="flex items-center justify-between">
                <div className="w-12 h-12 rounded-2xl bg-cyan-500/10 text-cyan-400 border border-cyan-500/30 flex items-center justify-center shadow-glow-cyan">
                  <Clock className="w-6 h-6" />
                </div>
                <span className="px-2.5 py-1 rounded-full text-[10px] font-mono font-bold bg-cyan-500/15 text-cyan-300 border border-cyan-500/30">
                  EU 561/2006
                </span>
              </div>
              <h3 className="text-lg font-black text-white group-hover:text-cyan-400 transition">
                4. Tachograph Horizon &amp; OCR
              </h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Instant thermal printout OCR scan, Stoneridge/VDO DDD card import, and live countdowns for 4h 30m continuous driving &amp; daily rest.
              </p>
            </div>
            <div className="flex items-center justify-between pt-2 border-t border-slate-800/80">
              <span className="text-[11px] font-mono text-slate-400">
                Rule Engine:{' '}
                <span className="text-cyan-400 font-bold">EU 561/2006</span>
              </span>
              <span className="text-xs font-mono font-bold text-cyan-400 flex items-center gap-1 group-hover:translate-x-1 transition">
                Scan Roll <ArrowRight className="w-4 h-4" />
              </span>
            </div>
          </Link>

          {/* Card 5: In-Cab Safety Shield & Demurrage */}
          <Link
            href="/driver/safety"
            className="cockpit-panel hover:border-rose-500/50 p-6 rounded-3xl transition-all shadow-cockpit flex flex-col justify-between space-y-6 group touch-press"
          >
            <div className="space-y-3.5">
              <div className="flex items-center justify-between">
                <div className="w-12 h-12 rounded-2xl bg-rose-500/10 text-rose-400 border border-rose-500/30 flex items-center justify-center shadow-md">
                  <Zap className="w-6 h-6" />
                </div>
                <span className="px-2.5 py-1 rounded-full text-[10px] font-mono font-bold bg-rose-500/15 text-rose-300 border border-rose-500/30">
                  In-Cab Radar
                </span>
              </div>
              <h3 className="text-lg font-black text-white group-hover:text-rose-400 transition">
                5. Driver Safety Shield
              </h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Low Bridge Strike radar with 4.65m clearance alarms, £45/hr GPS Demurrage wait-time claim generator, SNAP meal claims &amp; cargo security.
              </p>
            </div>
            <div className="flex items-center justify-between pt-2 border-t border-slate-800/80">
              <span className="text-[11px] font-mono text-slate-400">
                Demurrage:{' '}
                <span className="text-rose-400 font-bold">£45/hr Accrual</span>
              </span>
              <span className="text-xs font-mono font-bold text-rose-400 flex items-center gap-1 group-hover:translate-x-1 transition">
                Shield Active <ArrowRight className="w-4 h-4" />
              </span>
            </div>
          </Link>

          {/* Card 6: Haulier Fleet Operations */}
          <Link
            href="/haulier"
            className="cockpit-panel hover:border-indigo-500/50 p-6 rounded-3xl transition-all shadow-cockpit flex flex-col justify-between space-y-6 group touch-press"
          >
            <div className="space-y-3.5">
              <div className="flex items-center justify-between">
                <div className="w-12 h-12 rounded-2xl bg-indigo-500/10 text-indigo-400 border border-indigo-500/30 flex items-center justify-center shadow-md">
                  <Briefcase className="w-6 h-6" />
                </div>
                <span className="px-2.5 py-1 rounded-full text-[10px] font-mono font-bold bg-indigo-500/15 text-indigo-300 border border-indigo-500/30">
                  Transport Office
                </span>
              </div>
              <h3 className="text-lg font-black text-white group-hover:text-indigo-400 transition">
                6. Haulier Fleet Command
              </h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                1Hz telematics radar, fleet VOR lockout, instant shift broadcast, driver timesheet verification, and self-billing remittance.
              </p>
            </div>
            <div className="flex items-center justify-between pt-2 border-t border-slate-800/80">
              <span className="text-[11px] font-mono text-slate-400">
                Fleet Management:{' '}
                <span className="text-indigo-400 font-bold">1Hz Live</span>
              </span>
              <span className="text-xs font-mono font-bold text-indigo-400 flex items-center gap-1 group-hover:translate-x-1 transition">
                Open Fleet Desk <ArrowRight className="w-4 h-4" />
              </span>
            </div>
          </Link>
        </div>

        {/* Master Admin Banner (If Unlocked) */}
        {userRole === 'admin' && (
          <div className="cockpit-panel p-6 bg-red-950/30 border border-red-500/40 rounded-3xl flex flex-col sm:flex-row items-center justify-between gap-4 shadow-cockpit">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-red-600 text-white flex items-center justify-center shadow-lg">
                <KeyRound className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-sm font-black text-white">Authenticated as Master Admin</h4>
                <p className="text-xs text-slate-400 font-mono">
                  Full CMS access, feature flags &amp; operator rosters unlocked.
                </p>
              </div>
            </div>
            <Link
              href="/admin"
              className="px-5 py-2.5 bg-red-600 hover:bg-red-500 text-white font-bold text-xs rounded-xl shadow-md transition touch-press"
            >
              Open Master Admin CMS →
            </Link>
          </div>
        )}
      </main>
    </div>
  );
}
