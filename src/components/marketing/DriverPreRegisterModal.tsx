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

              {/* Licence Category & Tacho Manufacturer */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-[11px] font-mono text-slate-300 block">
                    Licence Category
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

                <div className="space-y-1">
                  <label className="text-[11px] font-mono text-slate-300 block">
                    Hardware / Ingest Method
                  </label>
                  <select
                    value={tachoManufacturer}
                    onChange={(e) => setTachoManufacturer(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-700 text-xs font-mono text-white focus:outline-none focus:border-cyan-400"
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

              {/* Work Type & CPC Expiry */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-[11px] font-mono text-slate-300 block">
                    Driving Pattern
                  </label>
                  <select
                    value={workType}
                    onChange={(e) => setWorkType(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-700 text-xs font-mono text-white focus:outline-none focus:border-cyan-400"
                  >
                    <option>Trunking / Hub-to-Hub</option>
                    <option>Tramping (Nights Out)</option>
                    <option>Multi-Drop Distribution</option>
                    <option>Agency / Relief Driver</option>
                    <option>Owner Operator / Sub-Contractor</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="text-[11px] font-mono text-slate-300 block">
                    Driver CPC Expiry
                  </label>
                  <select
                    value={cpcExpiryYear}
                    onChange={(e) => setCpcExpiryYear(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-700 text-xs font-mono text-white focus:outline-none focus:border-cyan-400"
                  >
                    <option>2026</option>
                    <option>2027</option>
                    <option>2028</option>
                    <option>2029</option>
                    <option>2030</option>
                  </select>
                </div>
              </div>

              {/* Biggest Frustration */}
              <div className="space-y-1">
                <label className="text-[11px] font-mono text-slate-300 block">
                  Biggest Tachograph Headache
                </label>
                <select
                  value={primaryChallenge}
                  onChange={(e) => setPrimaryChallenge(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-700 text-xs font-mono text-white focus:outline-none focus:border-cyan-400"
                >
                  <option>Calculating 15h shift spread &amp; 9h reduced rest</option>
                  <option>28-day roadside DVSA audit compliance</option>
                  <option>Fading thermal printout rolls losing text</option>
                  <option>Accidental 4.5hr driving infringements</option>
                  <option>Unfair transport office deductions or disputes</option>
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
          /* Success Screen: Priority Driver Pass */
          <div className="text-center space-y-6 py-4 animate-in zoom-in-95 duration-300">
            <div className="w-16 h-16 mx-auto rounded-3xl bg-emerald-500/20 border-2 border-emerald-400 text-emerald-400 flex items-center justify-center shadow-lg">
              <CheckCircle2 className="w-8 h-8" />
            </div>

            <div className="space-y-1">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/15 border border-emerald-500/30 text-emerald-300 text-[10px] font-mono font-bold">
                <Award className="w-3.5 h-3.5" />
                <span>PRIORITY DRIVER BETA PASS RESERVED</span>
              </div>
              <h3 className="text-2xl font-black text-white">
                You're on the Pioneer List, {registeredData.fullName}!
              </h3>
              <p className="text-xs text-slate-300 max-w-sm mx-auto font-sans">
                Your spot in the closed pilot has been confirmed. You will receive an early invitation via SMS &amp; Email.
              </p>
            </div>

            {/* Pass Card */}
            <div className="p-5 rounded-2xl bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 border border-cyan-500/40 shadow-2xl space-y-3 font-mono text-left">
              <div className="flex justify-between items-center border-b border-slate-800 pb-2">
                <span className="text-[11px] text-cyan-400 font-bold">DRIVEPARTNERS PILOT PASS</span>
                <span className="text-[10px] text-emerald-400 font-bold bg-emerald-500/20 px-2 py-0.5 rounded">
                  PRIORITY TIER 1
                </span>
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <div className="text-[10px] text-slate-400">PASS ID</div>
                  <div className="text-lg text-white font-black">{registeredData.passId}</div>
                </div>

                <button
                  onClick={handleCopyPass}
                  className="px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs flex items-center gap-1 cursor-pointer transition"
                >
                  {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copied ? 'Copied' : 'Copy'}</span>
                </button>
              </div>

              <div className="grid grid-cols-2 gap-2 text-[10px] border-t border-slate-800 pt-2 text-slate-300">
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

            <button
              onClick={onClose}
              className="w-full py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold text-xs font-mono transition cursor-pointer"
            >
              Back to Coming Soon Page
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
