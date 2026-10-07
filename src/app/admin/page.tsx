'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  ShieldCheck,
  Building2,
  ShieldAlert,
  Users,
  Sliders,
  ArrowRight,
  Home,
  Lock,
  ChevronRight
} from 'lucide-react';

const ADMIN_PASSCODE = 'DP-ADMIN-2026';

interface CmsTool {
  title: string;
  category: string;
  description: string;
  href: string;
  icon: React.ReactNode;
  badge: string;
  badgeColor: string;
}

const CMS_TOOLS: CmsTool[] = [
  {
    title: 'Depot & Yard Blueprint CMS',
    category: 'ISO 45001 Risk Engine',
    description: 'Create site risk profiles with AI document OCR and annotate 2D satellite yard blueprints.',
    href: '/admin/sites',
    icon: <Building2 className="w-6 h-6 text-emerald-400" />,
    badge: '1,502 LOC Wizard',
    badgeColor: 'bg-emerald-950/80 text-emerald-300 border-emerald-800/60'
  },
  {
    title: 'Whistleblower Hazard Moderation',
    category: 'Safety Compliance',
    description: 'Triage driver hazard submissions, verify photographic evidence, and issue 48h Amber notices.',
    href: '/admin/reviews',
    icon: <ShieldAlert className="w-6 h-6 text-amber-400" />,
    badge: '48h SLA',
    badgeColor: 'bg-amber-950/80 text-amber-300 border-amber-800/60'
  },
  {
    title: 'RBAC User Access Control',
    category: 'Security & Governance',
    description: 'Manage permissions, send enterprise fleet invitations, and provision auditor/manager roles.',
    href: '/admin/users',
    icon: <Users className="w-6 h-6 text-sky-400" />,
    badge: 'Level 5 RBAC',
    badgeColor: 'bg-sky-950/80 text-sky-300 border-sky-800/60'
  },
  {
    title: 'Feature Flags & System Health',
    category: 'Infrastructure',
    description: 'Inspect live Cloud Run proxy connections and configure operational module flags.',
    href: '/admin/flags',
    icon: <Sliders className="w-6 h-6 text-purple-400" />,
    badge: 'europe-west2',
    badgeColor: 'bg-purple-950/80 text-purple-300 border-purple-800/60'
  }
];

export default function AdminHubPage() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [passcode, setPasscode] = useState('');
  const [error, setError] = useState(false);

  useEffect(() => {
    // Check local storage for existing session
    const saved = localStorage.getItem('dp_admin_session');
    if (saved === 'authorized') {
      setIsAuthenticated(true);
    }
  }, []);

  const handleUnlock = (e: React.FormEvent) => {
    e.preventDefault();
    if (passcode.trim() === ADMIN_PASSCODE) {
      localStorage.setItem('dp_admin_session', 'authorized');
      setIsAuthenticated(true);
      setError(false);
    } else {
      setError(true);
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-dvh bg-slate-950 text-white flex flex-col justify-center items-center p-4 font-sans">
        <div className="w-full max-w-sm bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-2xl text-center space-y-4">
          <div className="w-14 h-14 rounded-2xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center mx-auto text-amber-400">
            <Lock className="w-7 h-7" />
          </div>
          <div>
            <h1 className="text-lg font-extrabold text-white">Admin CMS Portal</h1>
            <p className="text-xs text-slate-400 mt-1">Confidential preview access restricted. Enter administrator key to unlock.</p>
          </div>

          <form onSubmit={handleUnlock} className="space-y-3 pt-2">
            <input
              type="password"
              placeholder="Passcode (e.g. DP-ADMIN-2026)"
              value={passcode}
              onChange={(e) => {
                setPasscode(e.target.value);
                setError(false);
              }}
              className="w-full px-4 py-3 rounded-xl bg-slate-950 border border-slate-800 focus:border-amber-400 focus:ring-1 focus:ring-amber-400 text-sm font-mono text-center tracking-wider outline-none text-white transition"
              autoFocus
            />
            {error && (
              <p className="text-xs text-rose-400 font-semibold">Invalid administrator passcode.</p>
            )}
            <button
              type="submit"
              className="w-full py-3 rounded-xl bg-amber-500 hover:bg-amber-400 active:scale-95 text-slate-950 font-bold text-sm transition shadow-lg shadow-amber-500/20"
            >
              Unlock Admin Suite
            </button>
          </form>

          <div className="pt-2">
            <Link
              href="/"
              className="text-xs text-slate-400 hover:text-slate-200 transition inline-flex items-center gap-1"
            >
              <Home className="w-3.5 h-3.5" /> Return to Home
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-dvh bg-slate-950 text-white flex flex-col font-sans">
      {/* Mobile Top App Bar */}
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
              <ShieldCheck className="w-4 h-4 text-amber-400" /> Admin CMS Hub
            </h1>
            <p className="text-[10px] text-slate-400 font-mono">Master Content &amp; Compliance Console</p>
          </div>
        </div>

        <Link
          href="/haulier"
          className="text-xs font-semibold px-2.5 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 flex items-center gap-1 transition"
        >
          <span>Fleet Command</span>
          <ArrowRight className="w-3 h-3" />
        </Link>
      </header>

      {/* Main Single-Purpose Body: Touch-Friendly CMS Tool Cards */}
      <main className="flex-1 w-full max-w-md mx-auto p-4 space-y-3 overflow-y-auto">
        <div className="text-xs font-bold uppercase tracking-wider text-slate-400 px-1 pt-1">
          Content &amp; Governance Tools
        </div>

        <div className="space-y-2.5">
          {CMS_TOOLS.map((tool) => (
            <Link
              key={tool.href}
              href={tool.href}
              className="block group bg-slate-900/90 hover:bg-slate-850 active:scale-[0.98] border border-slate-800 hover:border-slate-700 rounded-2xl p-4 transition-all shadow-md"
            >
              <div className="flex items-start gap-3.5">
                <div className="p-2.5 rounded-xl bg-slate-950 border border-slate-800 shrink-0 group-hover:border-slate-700 transition">
                  {tool.icon}
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-2">
                    <h2 className="text-sm font-bold text-white truncate group-hover:text-amber-400 transition">
                      {tool.title}
                    </h2>
                    <ChevronRight className="w-4 h-4 text-slate-400 group-hover:text-white group-hover:translate-x-0.5 transition shrink-0" />
                  </div>

                  <p className="text-[11px] font-mono text-slate-400 mt-0.5">{tool.category}</p>
                  <p className="text-xs text-slate-400 mt-1 line-clamp-2 leading-relaxed">
                    {tool.description}
                  </p>

                  <div className="mt-2.5">
                    <span className={`inline-block text-[10px] font-semibold px-2 py-0.5 rounded border font-mono ${tool.badgeColor}`}>
                      {tool.badge}
                    </span>
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </main>
    </div>
  );
}
