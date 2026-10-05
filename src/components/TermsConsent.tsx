'use client';
import React, { useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface Props {
  onBack: () => void;
  onComplete: () => void;
  summary: any;
}

export default function TermsConsent({ onBack, onComplete, summary }: Props) {
  const [termsAccepted, setTermsAccepted] = useState(true);

  return (
    <main className="h-[100dvh] w-full bg-[#070B13] text-slate-100 flex flex-col justify-between p-4 sm:p-6 font-sans max-w-md mx-auto select-none">
      <header className="flex justify-between items-center border-b border-slate-800 pb-3 text-xs font-mono shrink-0">
        <button onClick={onBack} className="text-slate-400 flex items-center gap-1">
          <ChevronLeft className="w-4 h-4" /> Back
        </button>
        <span className="font-bold text-emerald-400">TERMS & CONSENT</span>
        <span className="text-emerald-400 text-[10px]">Step 4/4</span>
      </header>

      <div className="space-y-4 my-auto font-mono text-xs">
        <div>
          <h2 className="text-xl font-black text-white font-sans">Review & Accept Terms</h2>
          <p className="text-xs text-slate-400">Statutory Consent & Audit Verification</p>
        </div>

        <div className="p-4 bg-slate-900 border border-slate-800 rounded-2xl space-y-2">
          <div className="flex justify-between"><span className="text-slate-500">NAME:</span><span className="text-white font-bold">{summary.name}</span></div>
          <div className="flex justify-between"><span className="text-slate-500">DVLA LICENCE:</span><span className="text-emerald-400 font-bold">{summary.licenceNo} ({summary.licenceCategories})</span></div>
          <div className="flex justify-between"><span className="text-slate-500">CPC CARD:</span><span className="text-emerald-400 font-bold">{summary.cpcCardNo} (35h Complete)</span></div>
          <div className="flex justify-between"><span className="text-slate-500">TACHO CARD:</span><span className="text-emerald-400 font-bold">{summary.tachoCardNo}</span></div>
          <div className="flex justify-between"><span className="text-slate-500">CLEARANCE:</span><span className="text-amber-400 font-bold">{summary.vehicleHeight}</span></div>
        </div>

        <div className="p-4 bg-slate-950 border border-slate-800 rounded-2xl space-y-3">
          <label className="flex items-start gap-2.5 cursor-pointer">
            <input
              type="checkbox"
              checked={termsAccepted}
              onChange={e => setTermsAccepted(e.target.checked)}
              className="mt-1 w-4 h-4 rounded text-emerald-500 bg-slate-900 border-slate-700"
            />
            <span className="text-[11px] text-slate-300 leading-snug">
              I hereby accept the <strong>Company Privacy Policy</strong> and authorize Drive Partners to log my <strong>Tachograph & DVSA compliance hours</strong> in accordance with EU Regulation 561/2006.
            </span>
          </label>
        </div>

        <button
          onClick={onComplete}
          disabled={!termsAccepted}
          className="w-full py-4 bg-emerald-500 hover:bg-emerald-400 disabled:bg-slate-800 disabled:text-slate-500 text-slate-950 font-black text-xs uppercase rounded-xl flex items-center justify-center gap-1.5 shadow-xl shadow-emerald-500/20"
        >
          Launch Driver Dashboard <ChevronRight className="w-4 h-4" />
        </button>
      </div>

      <footer className="text-center text-[10px] font-mono text-slate-600">STEP 4: REGULATORY CONSENT</footer>
    </main>
  );
}
