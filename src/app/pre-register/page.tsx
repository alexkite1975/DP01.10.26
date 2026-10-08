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
  const [tachoManufacturer, setTachoManufacturer] = useState('Stoneridge SE5000 (Smart Gen 2)');
  const [workType, setWorkType] = useState('Trunking / Hub-to-Hub');
  const [cpcExpiryYear, setCpcExpiryYear] = useState('2028');
  const [primaryChallenge, setPrimaryChallenge] = useState('Calculating 15h shift spread & 9h reduced rest');

  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [registeredData, setRegisteredData] = useState<{
    passId: string;
    queueNumber: number;
    fullName: string;
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
          licenceCategory,
          tachoManufacturer,
          workType,
          cpcExpiryYear,
          primaryChallenge
        })
      });

      const data = await res.json();

      if (res.ok && data.success) {
        setRegisteredData({
          passId: data.passId,
          queueNumber: data.queueNumber,
          fullName: data.fullName
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

              {/* Licence Category & Tacho Model */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-mono text-slate-300 block">
                    Licence Category
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

                <div className="space-y-1.5">
                  <label className="text-xs font-mono text-slate-300 block">
                    Preferred Ingest Method / Hardware
                  </label>
                  <select
                    value={tachoManufacturer}
                    onChange={(e) => setTachoManufacturer(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-xs font-mono text-white focus:outline-none focus:border-cyan-400"
                  >
                    <option>Smart Card Reader (Any Brand - USB / Bluetooth)</option>
                    <option>Stoneridge SE5000 (Smart Gen 2)</option>
                    <option>Continental VDO DTCO 4.1</option>
                    <option>Actia / SmarTach</option>
                    <option>Both Thermal Rolls &amp; Card Reader</option>
                    <option>Mixed Fleet / Not Sure</option>
                  </select>
                </div>
              </div>

              {/* Driving Pattern & CPC */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-mono text-slate-300 block">
                    Driving Pattern
                  </label>
                  <select
                    value={workType}
                    onChange={(e) => setWorkType(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-xs font-mono text-white focus:outline-none focus:border-cyan-400"
                  >
                    <option>Trunking / Hub-to-Hub</option>
                    <option>Tramping (Nights Out)</option>
                    <option>Multi-Drop Distribution</option>
                    <option>Agency / Relief Driver</option>
                    <option>Owner Operator / Sub-Contractor</option>
                  </select>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-mono text-slate-300 block">
                    Driver CPC Expiry Year
                  </label>
                  <select
                    value={cpcExpiryYear}
                    onChange={(e) => setCpcExpiryYear(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-xs font-mono text-white focus:outline-none focus:border-cyan-400"
                  >
                    <option>2026</option>
                    <option>2027</option>
                    <option>2028</option>
                    <option>2029</option>
                    <option>2030</option>
                  </select>
                </div>
              </div>

              {/* Headache */}
              <div className="space-y-1.5">
                <label className="text-xs font-mono text-slate-300 block">
                  Biggest Tachograph Frustration
                </label>
                <select
                  value={primaryChallenge}
                  onChange={(e) => setPrimaryChallenge(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-xs font-mono text-white focus:outline-none focus:border-cyan-400"
                >
                  <option>Calculating 15h shift spread &amp; 9h reduced rest</option>
                  <option>28-day roadside DVSA audit compliance</option>
                  <option>Fading thermal printout rolls losing text</option>
                  <option>Accidental 4.5hr driving infringements</option>
                  <option>Unfair transport office deductions or disputes</option>
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
            /* Success confirmation */
            <div className="text-center space-y-6 py-6 animate-in zoom-in-95 duration-300">
              <div className="w-16 h-16 mx-auto rounded-3xl bg-emerald-500/20 border-2 border-emerald-400 text-emerald-400 flex items-center justify-center shadow-lg">
                <CheckCircle2 className="w-8 h-8" />
              </div>

              <div className="space-y-2">
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/15 border border-emerald-500/30 text-emerald-300 text-xs font-mono font-bold">
                  <Award className="w-3.5 h-3.5" />
                  <span>PRIORITY DRIVER BETA PASS CONFIRMED</span>
                </div>
                <h2 className="text-2xl sm:text-3xl font-black text-white">
                  Welcome to the Driver Pioneer Circle, {registeredData.fullName}!
                </h2>
                <p className="text-xs sm:text-sm text-slate-300 max-w-md mx-auto font-sans leading-relaxed">
                  Your registration has been received and verified. You will receive an exclusive early access link via SMS and Email before public release.
                </p>
              </div>

              {/* Pass Card */}
              <div className="p-6 rounded-2xl bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 border border-cyan-500/40 shadow-2xl space-y-4 font-mono text-left max-w-md mx-auto">
                <div className="flex justify-between items-center border-b border-slate-800 pb-2">
                  <span className="text-xs text-cyan-400 font-bold">DRIVEPARTNERS PILOT PASS</span>
                  <span className="text-[10px] text-emerald-400 font-bold bg-emerald-500/20 px-2 py-0.5 rounded">
                    PRIORITY TIER 1
                  </span>
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-[10px] text-slate-400">PILOT PASS ID</div>
                    <div className="text-xl text-white font-black">{registeredData.passId}</div>
                  </div>

                  <button
                    onClick={handleCopyPass}
                    className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs flex items-center gap-1.5 cursor-pointer transition"
                  >
                    {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>{copied ? 'Copied' : 'Copy Pass'}</span>
                  </button>
                </div>

                <div className="grid grid-cols-2 gap-2 text-xs border-t border-slate-800 pt-3 text-slate-300">
                  <div>
                    <span className="text-slate-500">Waitlist Position:</span>{' '}
                    <span className="text-cyan-300 font-bold">#{registeredData.queueNumber}</span>
                  </div>
                  <div>
                    <span className="text-slate-500">Module:</span>{' '}
                    <span className="text-white font-bold">Tacho-Scan AI</span>
                  </div>
                </div>
              </div>

              <div className="pt-2">
                <Link
                  href="/coming-soon"
                  className="inline-block px-5 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold text-xs font-mono transition"
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
