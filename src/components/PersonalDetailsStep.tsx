'use client';
import React, { useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface Props {
  onBack: () => void;
  onNext: (data: { name: string; email: string; mobile: string }) => void;
  initialName: string;
  initialEmail: string;
}

export default function PersonalDetailsStep({ onBack, onNext, initialName, initialEmail }: Props) {
  const [fullName, setFullName] = useState(initialName || 'Alexander James Kite');
  const [email, setEmail] = useState(initialEmail || 'alexkite1975@gmail.com');
  const [mobile, setMobile] = useState('+44 7700 900123');
  const [password, setPassword] = useState('SecurePass123!');

  return (
    <main className="h-[100dvh] w-full bg-[#070B13] text-slate-100 flex flex-col justify-between p-4 sm:p-6 font-sans max-w-md mx-auto select-none">
      <header className="flex justify-between items-center border-b border-slate-800 pb-3 text-xs font-mono shrink-0">
        <button onClick={onBack} className="text-slate-400 flex items-center gap-1">
          <ChevronLeft className="w-4 h-4" /> Back
        </button>
        <span className="font-bold text-emerald-400">ACCOUNT SETUP</span>
        <span className="text-emerald-400 text-[10px]">Step 1/4</span>
      </header>

      <div className="space-y-4 my-auto">
        <div>
          <h2 className="text-xl font-black text-white">Enter Driver Personal Details</h2>
          <p className="text-xs text-slate-400">Step one of registration</p>
        </div>

        <div className="space-y-3 bg-slate-900 border border-slate-800 p-5 rounded-2xl font-mono text-xs">
          <div className="space-y-1">
            <label className="text-[10px] text-slate-400">FULL LEGAL NAME</label>
            <input
              type="text"
              value={fullName}
              onChange={e => setFullName(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-white"
              required
            />
          </div>
          <div className="space-y-1">
            <label className="text-[10px] text-slate-400">EMAIL ADDRESS</label>
            <input
              type="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-white"
              required
            />
          </div>
          <div className="space-y-1">
            <label className="text-[10px] text-slate-400">MOBILE NUMBER</label>
            <input
              type="tel"
              value={mobile}
              onChange={e => setMobile(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-white"
              required
            />
          </div>
          <div className="space-y-1">
            <label className="text-[10px] text-slate-400">PASSWORD</label>
            <input
              type="password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-white"
              required
            />
          </div>
        </div>

        <button
          onClick={() => onNext({ name: fullName, email, mobile })}
          className="w-full py-4 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black text-xs uppercase rounded-xl flex items-center justify-center gap-1.5 shadow-lg"
        >
          Next: Scan Statutory Cards (Front & Back) <ChevronRight className="w-4 h-4" />
        </button>
      </div>

      <footer className="text-center text-[10px] font-mono text-slate-600">STEP 1: CREDENTIALS SETUP</footer>
    </main>
  );
}
