code = '''\'use client\';

import React, { useState, useEffect } from \'react\';
import Link from \'next/link\';
import {
  Truck, ShieldCheck, Briefcase, KeyRound, ArrowRight,
  Lock, LogOut, CheckCircle2, ShieldAlert
} from \'lucide-react\';

export type UserRole = \'guest\' | \'driver\' | \'haulier\' | \'admin\';

export default function HomePage() {
  const [userRole, setUserRole] = useState<UserRole>(\'guest\');
  const [showAdminModal, setShowAdminModal] = useState(false);
  const [passcode, setPasscode] = useState(\'\');
  const [errorMsg, setErrorMsg] = useState(\'\');

  useEffect(() => {
    const savedRole = localStorage.getItem(\'dp_user_role\') as UserRole;
    if (savedRole) {
      setUserRole(savedRole);
    }
  }, []);

  const handleAdminAuth = (e: React.FormEvent) => {
    e.preventDefault();
    if (passcode === \'DP-ADMIN-2026\') {
      setUserRole(\'admin\');
      localStorage.setItem(\'dp_user_role\', \'admin\');
      setShowAdminModal(false);
      setPasscode(\'\');
      setErrorMsg(\'\');
    } else {
      setErrorMsg(\'Invalid Admin Passcode\');
    }
  };

  const handleLogout = () => {
    setUserRole(\'guest\');
    localStorage.removeItem(\'dp_user_role\');
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans selection:bg-blue-600">
      {/* Top Navigation Bar */}
      <header className="border-b border-slate-800 bg-slate-900/90 backdrop-blur px-6 py-4 flex items-center justify-between sticky top-0 z-50">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-blue-600 flex items-center justify-center font-black text-white text-lg shadow-lg shadow-blue-500/20">
            DP
          </div>
          <div>
            <span className="font-black tracking-tight text-white text-lg block leading-none">
              DRIVE PARTNERS
            </span>
            <span className="text-[10px] font-mono text-slate-400">
              UK Logistics & Freight Operating System
            </span>
          </div>
        </div>

        {/* Right Header Navigation & Gated Admin Option */}
        <div className="flex items-center gap-3">
          {/* ONLY SHOWN WHEN USER IS SIGNED IN AS ADMIN */}
          {userRole === \'admin\' ? (
            <div className="flex items-center gap-2">
              <Link
                href="/admin"
                className="px-3.5 py-1.5 bg-red-600 hover:bg-red-500 text-white font-bold text-xs font-mono rounded-xl flex items-center gap-1.5 shadow-md shadow-red-600/20 transition"
              >
                <KeyRound className="w-3.5 h-3.5" /> Admin CMS
              </Link>
              <button
                onClick={handleLogout}
                title="Sign out of Admin CMS"
                className="p-1.5 bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white rounded-xl text-xs transition"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          ) : (
            /* Discrete unlock button for admins */
            <button
              onClick={() => setShowAdminModal(true)}
              className="text-slate-600 hover:text-slate-400 text-xs font-mono flex items-center gap-1 transition px-2 py-1"
            >
              <Lock className="w-3 h-3" /> Staff
            </button>
          )}

          <Link
            href="/onboarding"
            className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs rounded-xl shadow-md shadow-blue-500/20 transition"
          >
            Sign In / Register
          </Link>
        </div>
      </header>

      {/* Admin Passcode Modal */}
      {showAdminModal && (
        <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 p-6 rounded-3xl max-w-sm w-full space-y-4 shadow-2xl">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <KeyRound className="w-5 h-5 text-red-400" />
                <h3 className="text-sm font-black text-white">Admin Staff Authentication</h3>
              </div>
              <button
                onClick={() => {
                  setShowAdminModal(false);
                  setErrorMsg(\'\');
                }}
                className="text-slate-500 hover:text-white text-xs font-mono"
              >
                ✕
              </button>
            </div>
            <p className="text-xs text-slate-400">
              Enter master passcode to unlock the Admin CMS.
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
              {errorMsg && (
                <p className="text-red-400 text-xs font-mono">{errorMsg}</p>
              )}
              <div className="flex gap-2">
                <button
                  type="submit"
                  className="flex-1 py-2.5 bg-red-600 hover:bg-red-500 text-white font-bold text-xs rounded-xl transition"
                >
                  Verify & Unlock
                </button>
                <button
                  type="button"
                  onClick={() => setShowAdminModal(false)}
                  className="px-4 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-bold rounded-xl transition"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Main Hero & Launchpad Grid */}
      <main className="flex-1 max-w-6xl w-full mx-auto p-6 sm:p-10 flex flex-col justify-center space-y-10">
        <div className="text-center space-y-3 max-w-2xl mx-auto">
          <span className="px-3 py-1 bg-blue-500/10 text-blue-400 border border-blue-500/30 text-xs font-mono font-bold rounded-full">
            Drive Partners Platform 2026
          </span>
          <h1 className="text-3xl sm:text-5xl font-black tracking-tight text-white">
            Haulage Built for Drivers & Operators
          </h1>
          <p className="text-slate-400 text-sm sm:text-base">
            Zero agency deductions, direct member-to-member freight settlement, and full DVSA statutory safety compliance.
          </p>
        </div>

        {/* Workflow Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Card 1: Onboarding */}
          <Link
            href="/onboarding"
            className="group bg-slate-900/60 hover:bg-slate-900 border border-slate-800 hover:border-blue-500/50 p-6 rounded-3xl transition shadow-xl flex flex-col justify-between space-y-6"
          >
            <div className="space-y-3">
              <div className="w-12 h-12 rounded-2xl bg-blue-500/10 text-blue-400 border border-blue-500/20 flex items-center justify-center">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-black text-white group-hover:text-blue-400 transition">
                1. Onboarding & Registration
              </h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Driver & haulier intake with 1-Tap Google & Apple Open Auth, DVLA licence OCR, and D906 Sign-on-Glass.
              </p>
            </div>
            <span className="text-xs font-mono font-bold text-blue-400 flex items-center gap-1 group-hover:translate-x-1 transition">
              Launch Onboarding <ArrowRight className="w-4 h-4" />
            </span>
          </Link>

          {/* Card 2: Driver In-Cab OS */}
          <Link
            href="/driver"
            className="group bg-slate-900/60 hover:bg-slate-900 border border-slate-800 hover:border-emerald-500/50 p-6 rounded-3xl transition shadow-xl flex flex-col justify-between space-y-6"
          >
            <div className="space-y-3">
              <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 flex items-center justify-center">
                <Truck className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-black text-white group-hover:text-emerald-400 transition">
                2. Driver In-Cab OS
              </h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                32-Point DVSA Vehicle Check with trailer database, Bridge Strike Shield, £45/hr Demurrage, and SOS.
              </p>
            </div>
            <span className="text-xs font-mono font-bold text-emerald-400 flex items-center gap-1 group-hover:translate-x-1 transition">
              Launch Driver OS <ArrowRight className="w-4 h-4" />
            </span>
          </Link>

          {/* Card 3: Haulier Portal & Haulage Partners */}
          <Link
            href="/haulier"
            className="group bg-slate-900/60 hover:bg-slate-900 border border-slate-800 hover:border-cyan-500/50 p-6 rounded-3xl transition shadow-xl flex flex-col justify-between space-y-6"
          >
            <div className="space-y-3">
              <div className="w-12 h-12 rounded-2xl bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 flex items-center justify-center">
                <Briefcase className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-black text-white group-hover:text-cyan-400 transition">
                3. Haulier Fleet & Freight
              </h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                1Hz telematics map, direct £28/hr dispatch, and the full 6-step Haulage Partners freight exchange.
              </p>
            </div>
            <span className="text-xs font-mono font-bold text-cyan-400 flex items-center gap-1 group-hover:translate-x-1 transition">
              Launch Haulier Portal <ArrowRight className="w-4 h-4" />
            </span>
          </Link>
        </div>

        {/* Admin Card (ONLY DISPLAYED ON THE PAGE IF LOGGED IN AS ADMIN) */}
        {userRole === \'admin\' && (
          <div className="p-6 bg-red-950/20 border border-red-500/40 rounded-3xl flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-red-600 text-white flex items-center justify-center">
                <KeyRound className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-sm font-black text-white">Authenticated as Master Admin</h4>
                <p className="text-xs text-slate-400 font-mono">Full CMS access, feature flags & operator rosters unlocked.</p>
              </div>
            </div>
            <Link
              href="/admin"
              className="px-5 py-2.5 bg-red-600 hover:bg-red-500 text-white font-bold text-xs rounded-xl shadow-md transition"
            >
              Open Master Admin CMS →
            </Link>
          </div>
        )}
      </main>
    </div>
  );
}
'''

with open('src/app/page.tsx', 'w') as f:
    f.write(code)

print("✓ Updated src/app/page.tsx: Admin CMS only visible when Admin is signed in!")
