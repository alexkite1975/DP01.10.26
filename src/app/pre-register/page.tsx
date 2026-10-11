'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  Truck,
  Sparkles,
  ShieldCheck,
  CheckCircle2,
  ArrowRight,
  AlertTriangle,
  Award,
  Copy,
  Check,
  Play
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { TachoScanMarketingVideo } from '@/components/marketing/TachoScanMarketingVideo';

export default function PreRegisterPage() {
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [licenceCategory, setLicenceCategory] = useState('Class 1 (C+E / Artic)');

  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [registeredData, setRegisteredData] = useState<{
    passId: string;
    queueNumber: number;
    fullName: string;
    licenceCategory: string;
  } | null>(null);
  const [copied, setCopied] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setErrorMsg('');

    try {
      const res = await fetch('/api/preregister/driver', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          fullName,
          email,
          phone,
          licenceCategory
        })
      });

      const data = await res.json();

      if (res.ok && data.success) {
        setRegisteredData({
          passId: data.passId,
          queueNumber: data.queueNumber,
          fullName: data.fullName,
          licenceCategory: licenceCategory
        });

        try {
          confetti({
            particleCount: 100,
            spread: 80,
            origin: { y: 0.6 }
          });
        } catch (e) {
          // ignore
        }
      } else {
        setErrorMsg(data.error || 'Failed to submit driver registration. Please try again.');
      }
    } catch (err) {
      setErrorMsg('Network connection error. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleCopyPass = () => {
    if (!registeredData) return;
    navigator.clipboard.writeText(registeredData.passId);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="min-h-dvh bg-slate-950 text-slate-100 flex flex-col font-sans selection:bg-cyan-500 relative overflow-x-hidden">
      {/* Ambient Cockpit Background Glows */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[350px] bg-cyan-600/10 rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute top-1/2 -right-20 w-[500px] h-[400px] bg-blue-600/10 rounded-full blur-[160px] pointer-events-none" />

      {/* Header */}
      <header className="border-b border-slate-800/80 bg-slate-950/80 backdrop-blur-xl px-4 sm:px-8 py-4 flex items-center justify-between sticky top-0 z-40">
        <Link href="/coming-soon" className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-cyan-500 via-blue-600 to-indigo-700 flex items-center justify-center font-black text-white text-lg shadow-glow-blue border border-cyan-400/40">
            DP
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-black tracking-tight text-white text-base sm:text-lg block leading-none">
                DRIVE PARTNERS
              </span>
              <span className="px-1.5 py-0.5 rounded text-[9px] font-mono font-bold bg-cyan-500/20 text-cyan-300 border border-cyan-500/40">
                DRIVER BETA
              </span>
            </div>
            <span className="text-[10px] font-mono text-slate-400">
              Tacho-Scan AI Priority Pre-Registration
            </span>
          </div>
        </Link>

        <Link
          href="/coming-soon"
          className="text-xs font-mono text-cyan-300 hover:text-cyan-200"
        >
          ← Back to Preview
        </Link>
      </header>

      {/* Main Container */}
      <main className="flex-1 max-w-4xl mx-auto w-full px-4 sm:px-8 py-10 space-y-12">
        {/* Title */}
        <div className="text-center space-y-3 max-w-2xl mx-auto">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-300 text-xs font-mono font-bold">
            <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
            <span>EXCLUSIVELY FOR UK COMMERCIAL DRIVERS</span>
          </div>

          <h1 className="text-3xl sm:text-5xl font-black text-white tracking-tight leading-tight">
            Pre-Register for Tacho-Scan AI
          </h1>

          <p className="text-sm sm:text-base text-slate-400 leading-relaxed font-sans">
            Snap your end-of-shift thermal printouts or download your driver card using any card reader of your choice. Automated 28-day statutory DVSA compliance, Article 12 defense generation, and zero calculator guesswork.
          </p>
        </div>

        {/* 40-Second Video Preview */}
        <div className="space-y-3">
          <div className="flex items-center justify-between text-xs font-mono">
            <span className="text-white font-bold flex items-center gap-2">
              <Play className="w-4 h-4 text-cyan-400" /> Watch the 40-Second Feature Tour (with British Voiceover):
            </span>
            <span className="text-cyan-400">00:40 Runtime</span>
          </div>
          <TachoScanMarketingVideo />
        </div>

        {/* Pre-Registration Form Card */}
        <div className="cockpit-panel rounded-3xl p-6 sm:p-10 border-t-2 border-t-cyan-400 border-cyan-500/30 shadow-2xl max-w-2xl mx-auto">
          {!registeredData ? (
            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="space-y-1">
                <h2 className="text-xl sm:text-2xl font-black text-white">
                  Driver Priority Pre-Registration
                </h2>
                <p className="text-xs text-slate-400 font-sans">
                  Register with your mobile and email to receive the direct pilot access link when beta tests launch.
                </p>
              </div>

              {errorMsg && (
                <div className="p-3 rounded-xl bg-rose-500/15 border border-rose-500/30 text-rose-300 text-xs font-mono flex items-center gap-2">
                  <AlertTriangle className="w-4 h-4 text-rose-400 shrink-0" />
                  <span>{errorMsg}</span>
                </div>
              )}

              {/* Name & Email */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-mono text-slate-300 block">
                    Full Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    placeholder="e.g. John Davies"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-xs font-mono text-white placeholder-slate-600 focus:outline-none focus:border-cyan-400"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-mono text-slate-300 block">
                    Email Address *
                  </label>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="driver@transport.co.uk"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-xs font-mono text-white placeholder-slate-600 focus:outline-none focus:border-cyan-400"
                  />
                </div>
              </div>

              {/* Mobile Phone */}
              <div className="space-y-1.5">
                <label className="text-xs font-mono text-slate-300 block">
                  Mobile Number (for SMS &amp; WhatsApp beta invite) *
                </label>
                <input
                  type="tel"
                  required
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="+44 7700 900123"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-xs font-mono text-white placeholder-slate-600 focus:outline-none focus:border-cyan-400"
                />
              </div>

              {/* Licence Category */}
              <div className="space-y-1.5">
                <label className="text-xs font-mono text-slate-300 block">
                  Licence Category / Entitlement *
                </label>
                <select
                  value={licenceCategory}
                  onChange={(e) => setLicenceCategory(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-xs font-mono text-white focus:outline-none focus:border-cyan-400"
                >
                  <option>Class 1 (C+E / Artic)</option>
                  <option>Class 2 (Cat C / Rigid)</option>
                  <option>7.5 Tonne (C1)</option>
                  <option>PSV / Bus &amp; Coach</option>
                </select>
              </div>

              {/* Submit */}
              <button
                type="submit"
                disabled={isLoading}
                className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-cyan-500 via-blue-500 to-indigo-600 hover:from-cyan-400 hover:to-indigo-500 text-slate-950 font-black text-sm font-mono flex items-center justify-center gap-2 shadow-glow-blue transition transform hover:scale-[1.01] cursor-pointer disabled:opacity-50"
              >
                {isLoading ? (
                  <span>Reserving Driver Slot...</span>
                ) : (
                  <>
                    <Truck className="w-4 h-4 text-slate-950" />
                    <span>Claim Driver Priority Beta Pass</span>
                    <ArrowRight className="w-4 h-4 text-slate-950" />
                  </>
                )}
              </button>

              <div className="flex items-center justify-center gap-4 text-[11px] font-mono text-slate-400 pt-2">
                <span className="flex items-center gap-1">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" /> Free for Beta Drivers
                </span>
                <span>•</span>
                <span>Direct Pilot Invitation Guarantee</span>
              </div>
            </form>
          ) : (
            /* Success confirmation: Apple / Google Wallet Style Digital Driver Beta Pass */
            <div className="text-center space-y-6 py-4 animate-in zoom-in-95 duration-300">
              <div className="space-y-1.5">
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/15 border border-emerald-500/30 text-emerald-300 text-xs font-mono font-bold">
                  <Award className="w-4 h-4 text-emerald-400" />
                  <span>OFFICIAL DRIVER BETA PASS RESERVED</span>
                </div>
                <h2 className="text-2xl sm:text-3xl font-black text-white">
                  Welcome to the Pioneer Circle, {registeredData.fullName}!
                </h2>
                <p className="text-xs sm:text-sm text-slate-300 max-w-md mx-auto font-sans leading-relaxed">
                  Your spot in the closed driver pilot is secured. Here is your digital wallet pass:
                </p>
              </div>

              {/* Apple / Google Wallet Style Digital Card */}
              <div className="relative mx-auto w-full max-w-sm rounded-3xl bg-gradient-to-br from-slate-900 via-slate-950 to-slate-900 border-2 border-cyan-400/50 shadow-[0_0_50px_rgba(6,182,212,0.2)] p-6 text-left font-mono space-y-4 overflow-hidden">
                {/* Metallic Top Accent Bar */}
                <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-emerald-400 via-cyan-400 to-indigo-500" />

                {/* Pass Header */}
                <div className="flex items-center justify-between border-b border-slate-800/80 pb-3 pt-1">
                  <div className="flex items-center gap-2.5">
                    <div className="w-9 h-9 rounded-xl bg-cyan-500/20 border border-cyan-400/40 flex items-center justify-center text-cyan-300">
                      <Truck className="w-5 h-5" />
                    </div>
                    <div>
                      <div className="text-xs font-black text-white tracking-wider">DRIVEPARTNERS</div>
                      <div className="text-[10px] text-cyan-400">DIGITAL DRIVER PASS</div>
                    </div>
                  </div>
                  <div className="text-right">
                    <span className="text-[10px] font-bold text-emerald-400 bg-emerald-500/20 px-2.5 py-0.5 rounded border border-emerald-500/30">
                      TIER 1 VIP
                    </span>
                  </div>
                </div>

                {/* Driver & Entitlement */}
                <div className="grid grid-cols-2 gap-3 text-xs">
                  <div>
                    <div className="text-[10px] text-slate-500 uppercase tracking-wider">DRIVER NAME</div>
                    <div className="text-sm font-bold text-white truncate">{registeredData.fullName}</div>
                  </div>
                  <div>
                    <div className="text-[10px] text-slate-500 uppercase tracking-wider">ENTITLEMENT</div>
                    <div className="text-xs font-bold text-cyan-300">{registeredData.licenceCategory}</div>
                  </div>
                </div>

                {/* Pass ID & Queue Number */}
                <div className="p-3.5 rounded-2xl bg-slate-950/90 border border-slate-800 flex items-center justify-between">
                  <div>
                    <div className="text-[10px] text-slate-500 uppercase">PASS CODE</div>
                    <div className="text-lg font-black text-white tracking-widest">{registeredData.passId}</div>
                  </div>
                  <div className="text-right">
                    <div className="text-[10px] text-slate-500 uppercase">QUEUE POSITION</div>
                    <div className="text-base font-black text-emerald-400">#{registeredData.queueNumber}</div>
                  </div>
                </div>

                {/* Stylized Barcode / NFC Stamp */}
                <div className="pt-2 border-t border-slate-800/80 flex items-center justify-between">
                  <div className="flex items-center gap-1.5 text-[9px] text-slate-500 tracking-widest uppercase">
                    <span>||||||||</span>
                    <span>|||||</span>
                    <span>|||||||||</span>
                    <span>||||||</span>
                  </div>
                  <span className="text-[10px] text-slate-400">TACHO-SCAN AI PILOT</span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center justify-center gap-3 pt-2">
                <button
                  onClick={handleCopyPass}
                  className="px-4 py-2.5 rounded-xl bg-cyan-500/20 hover:bg-cyan-500/30 text-cyan-300 border border-cyan-500/40 text-xs font-mono font-bold flex items-center gap-2 cursor-pointer transition touch-press"
                >
                  {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
                  <span>{copied ? 'Pass Code Copied' : 'Copy Pass Code'}</span>
                </button>

                <Link
                  href="/coming-soon"
                  className="px-5 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-mono font-bold transition"
                >
                  Return to Overview
                </Link>
              </div>
            </div>
          )}
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-800/80 py-6 text-center text-xs font-mono text-slate-500">
        <p>© 2026 DrivePartners (SmartHaul OS) • UK Commercial Fleet &amp; Driver Platform</p>
      </footer>
    </div>
  );
}
