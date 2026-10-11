'use client';

import React, { useState } from 'react';
import {
  X,
  Truck,
  CheckCircle2,
  AlertTriangle,
  ArrowRight,
  ShieldCheck,
  Award,
  Sparkles,
  Copy,
  Check
} from 'lucide-react';
import confetti from 'canvas-confetti';

interface DriverPreRegisterModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const DriverPreRegisterModal: React.FC<DriverPreRegisterModalProps> = ({
  isOpen,
  onClose
}) => {
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

  if (!isOpen) return null;

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

        // Trigger celebratory confetti
        try {
          confetti({
            particleCount: 80,
            spread: 70,
            origin: { y: 0.6 }
          });
        } catch (e) {
          // ignore
        }
      } else {
        setErrorMsg(data.error || 'Failed to submit registration. Please try again.');
      }
    } catch (err) {
      setErrorMsg('Network error. Please check your connection.');
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
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur-md p-4 animate-in fade-in duration-200 overflow-y-auto">
      <div className="relative w-full max-w-lg rounded-3xl bg-slate-900 border border-slate-800 shadow-2xl p-6 sm:p-8 space-y-6 my-8">
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-1.5 text-slate-400 hover:text-white rounded-lg cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        {!registeredData ? (
          <>
            {/* Modal Header */}
            <div className="space-y-1.5">
              <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-cyan-500/15 border border-cyan-500/30 text-cyan-300 text-[10px] font-mono font-bold">
                <Truck className="w-3 h-3 text-cyan-400" />
                <span>EXCLUSIVELY FOR UK COMMERCIAL DRIVERS</span>
              </div>
              <h3 className="text-xl sm:text-2xl font-black text-white">
                Driver Early Access Pre-Registration
              </h3>
              <p className="text-xs text-slate-400">
                Be among the first British HGV drivers to test Tacho-Scan AI on your actual shift printouts before public launch.
              </p>
            </div>

            {errorMsg && (
              <div className="p-3 rounded-xl bg-rose-500/15 border border-rose-500/30 text-rose-300 text-xs font-mono flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 text-rose-400 shrink-0" />
                <span>{errorMsg}</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Name & Email */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-[11px] font-mono text-slate-300 block">
                    Full Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    placeholder="e.g. John Davies"
                    className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-700 text-xs font-mono text-white placeholder-slate-600 focus:outline-none focus:border-cyan-400"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[11px] font-mono text-slate-300 block">
                    Email Address *
                  </label>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="driver@transport.co.uk"
                    className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-700 text-xs font-mono text-white placeholder-slate-600 focus:outline-none focus:border-cyan-400"
                  />
                </div>
              </div>

              {/* Phone */}
              <div className="space-y-1">
                <label className="text-[11px] font-mono text-slate-300 block">
                  Mobile Number (for SMS &amp; WhatsApp beta link) *
                </label>
                <input
                  type="tel"
                  required
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="+44 7700 900123"
                  className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-700 text-xs font-mono text-white placeholder-slate-600 focus:outline-none focus:border-cyan-400"
                />
              </div>

              {/* Licence Category */}
              <div className="space-y-1">
                <label className="text-[11px] font-mono text-slate-300 block">
                  Licence Category / Entitlement *
                </label>
                <select
                  value={licenceCategory}
                  onChange={(e) => setLicenceCategory(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-700 text-xs font-mono text-white focus:outline-none focus:border-cyan-400"
                >
                  <option>Class 1 (C+E / Artic)</option>
                  <option>Class 2 (Cat C / Rigid)</option>
                  <option>7.5 Tonne (C1)</option>
                  <option>PSV / Bus &amp; Coach</option>
                </select>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isLoading}
                className="w-full py-3 rounded-2xl bg-gradient-to-r from-cyan-500 via-blue-500 to-indigo-600 hover:from-cyan-400 hover:to-indigo-500 text-slate-950 font-black text-xs font-mono flex items-center justify-center gap-2 shadow-glow-blue transition transform hover:scale-[1.01] cursor-pointer disabled:opacity-50"
              >
                {isLoading ? (
                  <span>Securing Priority Queue...</span>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4 text-slate-950" />
                    <span>Claim Driver Priority Beta Pass</span>
                    <ArrowRight className="w-4 h-4 text-slate-950" />
                  </>
                )}
              </button>

              <div className="flex items-center justify-center gap-4 text-[10px] font-mono text-slate-400 pt-1">
                <span className="flex items-center gap-1">
                  <ShieldCheck className="w-3 h-3 text-emerald-400" /> 100% Free for Beta Drivers
                </span>
                <span>•</span>
                <span>No Spam Guarantee</span>
              </div>
            </form>
          </>
        ) : (
          /* Success Screen: Apple/Google Wallet Digital Driver Beta Pass */
          <div className="text-center space-y-5 py-2 animate-in zoom-in-95 duration-300">
            <div className="space-y-1">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/15 border border-emerald-500/30 text-emerald-300 text-[10px] font-mono font-bold">
                <Award className="w-3.5 h-3.5 text-emerald-400" />
                <span>OFFICIAL DRIVER BETA PASS RESERVED</span>
              </div>
              <h3 className="text-xl sm:text-2xl font-black text-white">
                You're In, {registeredData.fullName}!
              </h3>
              <p className="text-xs text-slate-300 max-w-sm mx-auto font-sans">
                Your spot in the closed driver pilot is secured. Here is your digital wallet pass:
              </p>
            </div>

            {/* Apple / Google Wallet Style Digital Card */}
            <div className="relative mx-auto w-full max-w-sm rounded-3xl bg-gradient-to-br from-slate-900 via-slate-950 to-slate-900 border-2 border-cyan-400/50 shadow-[0_0_40px_rgba(6,182,212,0.18)] p-5 text-left font-mono space-y-4 overflow-hidden">
              {/* Metallic Top Accent Bar */}
              <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-emerald-400 via-cyan-400 to-indigo-500" />

              {/* Pass Header */}
              <div className="flex items-center justify-between border-b border-slate-800/80 pb-3 pt-1">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-xl bg-cyan-500/20 border border-cyan-400/40 flex items-center justify-center text-cyan-300">
                    <Truck className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="text-[11px] font-black text-white tracking-wider">DRIVEPARTNERS</div>
                    <div className="text-[9px] text-cyan-400">DIGITAL DRIVER PASS</div>
                  </div>
                </div>
                <div className="text-right">
                  <span className="text-[10px] font-bold text-emerald-400 bg-emerald-500/20 px-2 py-0.5 rounded border border-emerald-500/30">
                    TIER 1 VIP
                  </span>
                </div>
              </div>

              {/* Driver & Entitlement */}
              <div className="grid grid-cols-2 gap-3 text-xs">
                <div>
                  <div className="text-[9px] text-slate-500 uppercase tracking-wider">DRIVER NAME</div>
                  <div className="text-sm font-bold text-white truncate">{registeredData.fullName}</div>
                </div>
                <div>
                  <div className="text-[9px] text-slate-500 uppercase tracking-wider">ENTITLEMENT</div>
                  <div className="text-xs font-bold text-cyan-300">{registeredData.licenceCategory}</div>
                </div>
              </div>

              {/* Pass ID & Queue Number */}
              <div className="p-3 rounded-2xl bg-slate-950/80 border border-slate-800 flex items-center justify-between">
                <div>
                  <div className="text-[9px] text-slate-500 uppercase">PASS CODE</div>
                  <div className="text-base font-black text-white tracking-widest">{registeredData.passId}</div>
                </div>
                <div className="text-right">
                  <div className="text-[9px] text-slate-500 uppercase">QUEUE POSITION</div>
                  <div className="text-sm font-black text-emerald-400">#{registeredData.queueNumber}</div>
                </div>
              </div>

              {/* Stylized Barcode / NFC Stamp */}
              <div className="pt-2 border-t border-slate-800/80 flex items-center justify-between">
                <div className="flex items-center gap-1 text-[8px] text-slate-500 tracking-widest uppercase">
                  <span>||||||||</span>
                  <span>|||||</span>
                  <span>|||||||||</span>
                  <span>||||||</span>
                </div>
                <span className="text-[9px] text-slate-400">TACHO-SCAN AI PILOT</span>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex items-center justify-center gap-2 pt-1">
              <button
                onClick={handleCopyPass}
                className="px-4 py-2.5 rounded-xl bg-cyan-500/20 hover:bg-cyan-500/30 text-cyan-300 border border-cyan-500/40 text-xs font-mono font-bold flex items-center gap-1.5 cursor-pointer transition touch-press"
              >
                {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copied ? 'Pass Code Copied' : 'Copy Pass Code'}</span>
              </button>

              <button
                onClick={onClose}
                className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-mono font-bold transition cursor-pointer"
              >
                Done
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
