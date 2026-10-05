'use client';

import React, { useState, useEffect } from 'react';
import TachoSync from '@/components/TachoSync';

export default function Home() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userEmail, setUserEmail] = useState('');
  
  // ─── STRICT PRIVATE BETA ACCESS WHITELIST ───
  const ALLOWED_EMAILS = ['alexkite1975@gmail.com'];
  const [authEmailInput, setAuthEmailInput] = useState('');
  const [accessDeniedMsg, setAccessDeniedMsg] = useState<string | null>(null);

  // ─── COPYRIGHT & ANTI-COPYING SHIELD (UK Patents & Copyright Act 1988) ───
  useEffect(() => {
    // 1. Console Legal Warning
    console.log(
      "%c🛑 DRIVE PARTNERS PROPRIETARY SYSTEM\nProtected under the UK Copyright, Designs and Patents Act 1988 (c. 48).\nUnauthorized inspection, decompilation, scraping, or reverse engineering is strictly prohibited.",
      "color: #f59e0b; font-size: 14px; font-weight: bold; background: #0f172a; padding: 10px; border-radius: 8px;"
    );

    // 2. Disable Right-Click Context Menu
    const handleContextMenu = (e: MouseEvent) => {
      e.preventDefault();
      return false;
    };

    // 3. Disable DevTools & Source Hotkeys (F12, Ctrl+U, Ctrl+S, Ctrl+Shift+I)
    const handleKeyDown = (e: KeyboardEvent) => {
      if (
        e.key === 'F12' ||
        (e.ctrlKey && e.shiftKey && (e.key === 'I' || e.key === 'i' || e.key === 'J' || e.key === 'j' || e.key === 'C' || e.key === 'c')) ||
        (e.ctrlKey && (e.key === 'u' || e.key === 'U' || e.key === 's' || e.key === 'S'))
      ) {
        e.preventDefault();
        return false;
      }
    };

    window.addEventListener('contextmenu', handleContextMenu);
    window.addEventListener('keydown', handleKeyDown);

    return () => {
      window.removeEventListener('contextmenu', handleContextMenu);
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

  const handleAuthorizedLogin = (email: string) => {
    const cleanEmail = email.trim().toLowerCase();
    if (ALLOWED_EMAILS.includes(cleanEmail)) {
      setAccessDeniedMsg(null);
      setUserEmail(cleanEmail);
      setIsLoggedIn(true);
    } else {
      setAccessDeniedMsg(`Access Restricted: "${cleanEmail}" is not authorized. Drive Partners is currently in private pilot for authorized accounts only.`);
    }
  };

  if (isLoggedIn) {
    return (
      <div className="select-none min-h-screen bg-slate-950 text-white">
        <TachoSync />
      </div>
    );
  }

  return (
    <main className="select-none min-h-screen bg-slate-950 flex flex-col justify-between p-4 md:p-8 relative overflow-hidden font-sans">
      {/* Background Ambient Glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-96 bg-amber-500/5 blur-[120px] pointer-events-none rounded-full" />
      
      {/* Header */}
      <header className="flex justify-between items-center max-w-6xl w-full mx-auto z-10 py-2">
        <div className="flex items-center gap-2">
          <span className="text-2xl">🚚</span>
          <span className="font-black text-xl tracking-wider text-white">DRIVE<span className="text-amber-400">PARTNERS</span></span>
        </div>
        <div className="flex items-center gap-2 bg-slate-900 border border-slate-800 px-3 py-1.5 rounded-full text-xs font-semibold text-slate-400">
          <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse"></span>
          Private Pilot Beta
        </div>
      </header>

      {/* Login Card */}
      <div className="max-w-md w-full mx-auto my-auto z-10 py-8">
        <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-8 shadow-2xl backdrop-blur-xl">
          <div className="text-center mb-6">
            <div className="w-16 h-16 rounded-2xl bg-amber-400/10 border border-amber-400/20 text-amber-400 flex items-center justify-center text-3xl mx-auto mb-4 shadow-inner">
              🚚
            </div>
            <h1 className="text-2xl font-black text-white tracking-tight">Driver & Fleet Cockpit</h1>
            <p className="text-xs text-slate-400 mt-1">Authorized pilot accounts only</p>
          </div>

          {/* Access Denied Warning Banner */}
          {accessDeniedMsg && (
            <div className="mb-6 p-4 bg-rose-500/10 border border-rose-500/30 rounded-2xl text-rose-300 text-xs flex items-start gap-3">
              <span className="text-lg">🔒</span>
              <div>
                <strong className="block font-bold text-rose-200">Access Restricted</strong>
                {accessDeniedMsg}
              </div>
            </div>
          )}

          {/* Login Actions */}
          <div className="space-y-3">
            <button
              onClick={() => handleAuthorizedLogin('alexkite1975@gmail.com')}
              className="w-full py-3.5 px-4 bg-white hover:bg-slate-100 text-slate-950 font-black rounded-xl text-sm flex items-center justify-center gap-3 transition shadow-lg"
            >
              <svg className="w-5 h-5" viewBox="0 0 24 24">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" />
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" />
              </svg>
              Continue with Google (Alex Kite)
            </button>

            <div className="relative my-4 text-center">
              <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-slate-800"></div></div>
              <span className="relative px-3 bg-slate-900 text-[11px] font-semibold text-slate-500 uppercase">Or test another email</span>
            </div>

            <div className="flex gap-2">
              <input
                type="email"
                placeholder="Enter email to test access..."
                value={authEmailInput}
                onChange={(e) => setAuthEmailInput(e.target.value)}
                className="flex-1 px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-white text-xs placeholder-slate-500 focus:outline-none focus:border-amber-400"
              />
              <button
                onClick={() => handleAuthorizedLogin(authEmailInput)}
                className="px-4 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold rounded-xl text-xs transition"
              >
                Enter
              </button>
            </div>
          </div>

          <div className="mt-6 pt-6 border-t border-slate-800/80 text-center">
            <div className="text-[11px] text-slate-500 flex items-center justify-center gap-1.5">
              <span>🔒</span>
              <span>Whitelisted Pilot Access: <strong>alexkite1975@gmail.com</strong></span>
            </div>
          </div>
        </div>
      </div>

      {/* Legal UK Copyright Footer */}
      <footer className="max-w-6xl w-full mx-auto z-10 text-center py-4 border-t border-slate-900">
        <p className="text-[11px] text-slate-600 font-mono">
          © 2026 Drive Partners UK. All Rights Reserved. Protected under UK Copyright, Designs and Patents Act 1988 (c. 48).
        </p>
      </footer>
    </main>
  );
}
