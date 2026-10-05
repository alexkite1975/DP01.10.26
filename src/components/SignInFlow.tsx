'use client';
import React, { useState } from 'react';
import { ChevronLeft, ChevronRight, Mail, Lock } from 'lucide-react';

interface Props {
  onBack: () => void;
  onSuccess: (email: string) => void;
}

export default function SignInFlow({ onBack, onSuccess }: Props) {
  const [identifier, setIdentifier] = useState('alexkite1975@gmail.com');
  const [password, setPassword] = useState('••••••••••••');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSuccess(identifier);
  };

  return (
    <main className="h-[100dvh] w-full bg-[#070B13] text-slate-100 flex flex-col justify-between p-4 sm:p-6 font-sans max-w-md mx-auto select-none">
      <header className="flex justify-between items-center border-b border-slate-800 pb-3 text-xs font-mono shrink-0">
        <button onClick={onBack} className="text-slate-400 flex items-center gap-1 hover:text-white">
          <ChevronLeft className="w-4 h-4" /> Welcome
        </button>
        <span className="font-bold text-emerald-400">DRIVER SIGN IN</span>
        <span className="text-slate-500 text-[10px]">Secure Auth</span>
      </header>

      <form onSubmit={handleSubmit} className="space-y-4 my-auto">
        <div>
          <h2 className="text-xl font-black text-white">Sign In Flow</h2>
          <p className="text-xs text-slate-400">Enter your credentials to access your verified profile</p>
        </div>

        <div className="space-y-3 bg-slate-900 border border-slate-800 p-5 rounded-2xl">
          <div className="space-y-1">
            <label className="text-[10px] font-mono text-slate-400 flex items-center gap-1">
              <Mail className="w-3.5 h-3.5 text-emerald-400" /> EMAIL OR MOBILE NUMBER
            </label>
            <input
              type="text"
              value={identifier}
              onChange={e => setIdentifier(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-xs text-white font-mono"
              required
            />
          </div>

          <div className="space-y-1">
            <label className="text-[10px] font-mono text-slate-400 flex items-center gap-1">
              <Lock className="w-3.5 h-3.5 text-emerald-400" /> PASSWORD
            </label>
            <input
              type="password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-xs text-white font-mono"
              required
            />
          </div>
        </div>

        <button
          type="submit"
          className="w-full py-4 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black text-xs uppercase rounded-xl flex items-center justify-center gap-1.5 shadow-lg shadow-emerald-500/20"
        >
          Authenticate & Launch Cockpit <ChevronRight className="w-4 h-4" />
        </button>
      </form>

      <footer className="text-center text-[10px] font-mono text-slate-600">DIRECT AUTHENTICATION PIPELINE</footer>
    </main>
  );
}
