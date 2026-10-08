'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import dynamic from 'next/dynamic';
import confetti from 'canvas-confetti';
import {
  ArrowLeft,
  Truck,
  Repeat,
  DollarSign,
  MapPin,
  Clock,
  ShieldCheck,
  CheckCircle2,
  SlidersHorizontal,
  Plus,
  Send,
  ArrowRight,
  TrendingUp,
  Flame,
  Leaf,
  Sparkles,
  Zap
} from 'lucide-react';
import { MOCK_FREIGHT_LOADS, FreightLoadItem } from '@/data/mockFreightLoads';
import { audioFeedback } from '@/utils/audioFeedback';
import { RollingCounter } from '@/components/shared/RollingCounter';

const HxFreightWorkflowModal = dynamic(
  () => import('@/components/modals/HxFreightWorkflowModal').then((m) => m.HxFreightWorkflowModal),
  { ssr: false }
);

const FreightBreakEvenCalculatorModal = dynamic(
  () =>
    import('@/components/modals/FreightBreakEvenCalculatorModal').then(
      (m) => m.FreightBreakEvenCalculatorModal
    ),
  { ssr: false }
);

export default function HaulageFreightExchangePage() {
  const [loads, setLoads] = useState<FreightLoadItem[]>(MOCK_FREIGHT_LOADS);
  const [activeTab, setActiveTab] = useState<'BROWSE_LOADS' | 'POST_LOAD'>('BROWSE_LOADS');
  const [selectedTierFilter, setSelectedTierFilter] = useState<'ALL' | 1 | 2 | 3>('ALL');
  const [bookedLoadIds, setBookedLoadIds] = useState<string[]>([]);
  const [isHxModalOpen, setIsHxModalOpen] = useState(false);
  const [isBreakEvenOpen, setIsBreakEvenOpen] = useState(false);

  // New Load Posting Form State
  const [newOrigin, setNewOrigin] = useState('');
  const [newDestination, setNewDestination] = useState('');
  const [newTrailerType, setNewTrailerType] = useState('44t Curtain / Tail-lift');
  const [newPalletCount, setNewPalletCount] = useState(26);
  const [newWeightTonnes, setNewWeightTonnes] = useState(24.0);
  const [newTargetRate, setNewTargetRate] = useState(750);
  const [postSuccess, setPostSuccess] = useState(false);

  const filteredLoads = loads.filter((l) => {
    if (selectedTierFilter === 'ALL') return true;
    return l.tierLevel === selectedTierFilter;
  });

  const handleTabChange = (tab: 'BROWSE_LOADS' | 'POST_LOAD') => {
    setActiveTab(tab);
    audioFeedback.playCheckpointClick();
  };

  const handleTierFilter = (filter: 'ALL' | 1 | 2 | 3) => {
    setSelectedTierFilter(filter);
    audioFeedback.playCheckpointClick();
  };

  const handleBookLoad = (id: string) => {
    setBookedLoadIds((prev) => [...prev, id]);
    audioFeedback.playSuccessChime();

    try {
      confetti({
        particleCount: 50,
        spread: 60,
        origin: { y: 0.8 },
        colors: ['#38bdf8', '#06b6d4', '#10b981', '#f59e0b']
      });
    } catch {
      // Ignore
    }
  };

  const handleCreateLoad = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newOrigin || !newDestination) return;

    const created: FreightLoadItem = {
      id: `hx-user-${Date.now()}`,
      loadNumber: `HX-${Math.floor(100000 + Math.random() * 900000)}`,
      shipperName: 'Direct Commercial Business',
      originHub: newOrigin,
      originPostcode: 'LOCAL',
      destinationHub: newDestination,
      destinationPostcode: 'LOCAL',
      distanceMiles: 145,
      requiredTrailerType: newTrailerType,
      palletCount: Number(newPalletCount),
      weightTonnes: Number(newWeightTonnes),
      baseRateGbp: Number(newTargetRate),
      currentRateGbp: Number(newTargetRate),
      tierLevel: 1,
      tierLabel: 'TIER 1 (Private Fleet)',
      minutesUntilNextTier: 45,
      isCrossDockMultiLeg: false,
      isHazmat: false,
      pickupWindow: 'Today 14:00 - 16:00',
      deliveryWindow: 'Tomorrow 08:00 - 10:00',
      status: 'OPEN_TENDER',
      deadheadSavingsCo2Kg: 85
    };

    setLoads((prev) => [created, ...prev]);
    setPostSuccess(true);
    audioFeedback.playSuccessChime();

    setTimeout(() => {
      setPostSuccess(false);
      setActiveTab('BROWSE_LOADS');
    }, 1200);
  };

  return (
    <div className="min-h-dvh bg-slate-950 text-white flex flex-col font-sans">
      {/* Mobile Top App Bar */}
      <header className="sticky top-0 z-40 bg-slate-900/90 backdrop-blur-xl border-b border-slate-800 px-4 py-3 flex items-center justify-between shadow-cockpit">
        <div className="flex items-center gap-3">
          <Link
            href="/"
            className="p-2 -ml-1 rounded-xl bg-slate-800/80 hover:bg-slate-700 active:scale-95 text-slate-300 hover:text-white transition flex items-center gap-1 text-xs font-semibold touch-press"
            aria-label="Return Home"
          >
            <ArrowLeft className="w-4 h-4" />
            <span className="hidden sm:inline">Home</span>
          </Link>
          <div>
            <h1 className="text-sm font-bold text-white flex items-center gap-1.5">
              <Repeat className="w-4 h-4 text-cyan-400" /> Haulage &amp; Freight Exchange
            </h1>
            <p className="text-[10px] text-slate-400 font-mono">B2B Cargo Network • 44t Cascading Tenders</p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => {
              setIsBreakEvenOpen(true);
              audioFeedback.playCheckpointClick();
            }}
            className="px-2.5 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-200 text-xs font-semibold flex items-center gap-1 transition touch-press"
          >
            <DollarSign className="w-3.5 h-3.5 text-emerald-400" />
            <span className="hidden sm:inline">Break-Even</span>
          </button>
          <button
            onClick={() => {
              setIsHxModalOpen(true);
              audioFeedback.playCheckpointClick();
            }}
            className="px-2.5 py-1.5 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white text-xs font-semibold flex items-center gap-1 shadow-glow-cyan transition touch-press"
          >
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>HX 6-Step</span>
          </button>
        </div>
      </header>

      {/* Main Single-Purpose Body */}
      <main className="flex-1 w-full max-w-2xl mx-auto p-4 space-y-4 overflow-y-auto">
        {/* Top Perspective Switch: Browse Loads vs Post Load */}
        <div className="grid grid-cols-2 p-1 bg-slate-900/90 rounded-2xl border border-slate-800 shadow-inner">
          <button
            onClick={() => handleTabChange('BROWSE_LOADS')}
            className={`py-2 text-xs font-bold rounded-xl transition touch-press ${
              activeTab === 'BROWSE_LOADS'
                ? 'bg-cyan-600 text-white shadow-md shadow-cyan-900/40'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            For Hauliers: Available Cargo ({filteredLoads.length})
          </button>
          <button
            onClick={() => handleTabChange('POST_LOAD')}
            className={`py-2 text-xs font-bold rounded-xl transition touch-press ${
              activeTab === 'POST_LOAD'
                ? 'bg-cyan-600 text-white shadow-md shadow-cyan-900/40'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            For Businesses: Post Freight Load
          </button>
        </div>

        {/* Tab 1: Available Freight Loads (Hauliers tender on loads) */}
        {activeTab === 'BROWSE_LOADS' && (
          <div className="space-y-3.5">
            {/* Tier Filters */}
            <div className="flex items-center gap-2 overflow-x-auto pb-1 no-scrollbar">
              <button
                onClick={() => handleTierFilter('ALL')}
                className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition touch-press ${
                  selectedTierFilter === 'ALL'
                    ? 'bg-cyan-600 text-white shadow-md shadow-cyan-900/30'
                    : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800'
                }`}
              >
                All Cascading Tenders
              </button>
              <button
                onClick={() => handleTierFilter(1)}
                className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition touch-press ${
                  selectedTierFilter === 1
                    ? 'bg-emerald-600 text-white shadow-md shadow-emerald-900/30'
                    : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800'
                }`}
              >
                Tier 1 (Private Fleet)
              </button>
              <button
                onClick={() => handleTierFilter(2)}
                className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition touch-press ${
                  selectedTierFilter === 2
                    ? 'bg-blue-600 text-white shadow-md shadow-blue-900/30'
                    : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800'
                }`}
              >
                Tier 2 (Preferred)
              </button>
              <button
                onClick={() => handleTierFilter(3)}
                className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition touch-press ${
                  selectedTierFilter === 3
                    ? 'bg-amber-600 text-white shadow-md shadow-amber-900/30'
                    : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800'
                }`}
              >
                Tier 3 (Spot Exchange)
              </button>
            </div>

            {/* Loads Cards */}
            <div className="space-y-3.5">
              {filteredLoads.map((load) => {
                const isBooked = bookedLoadIds.includes(load.id);
                const ratePerMile = (load.currentRateGbp / load.distanceMiles).toFixed(2);

                return (
                  <div
                    key={load.id}
                    className={`cockpit-panel rounded-2xl p-4 transition-all shadow-cockpit space-y-3 border ${
                      isBooked
                        ? 'border-cyan-500/60 bg-cyan-950/20 shadow-glow-cyan'
                        : 'border-white/10 hover:border-cyan-500/40'
                    }`}
                  >
                    {/* Header */}
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <div className="flex items-center gap-2">
                          <span
                            className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded border ${
                              load.tierLevel === 1
                                ? 'bg-emerald-950 text-emerald-400 border-emerald-800/60'
                                : load.tierLevel === 2
                                ? 'bg-blue-950 text-blue-400 border-blue-800/60'
                                : 'bg-amber-950 text-amber-400 border-amber-800/60'
                            }`}
                          >
                            {load.tierLabel}
                          </span>
                          <span className="text-[10px] text-slate-400 font-mono">{load.loadNumber}</span>
                        </div>
                        <h2 className="text-sm font-bold text-white mt-1 leading-snug">{load.shipperName}</h2>
                      </div>

                      <div className="text-right shrink-0">
                        <span className="text-base font-black text-cyan-400 font-mono">
                          £{load.currentRateGbp.toFixed(2)}
                        </span>
                        <span className="text-[10px] text-slate-400 block font-mono">
                          £{ratePerMile}/mi
                        </span>
                      </div>
                    </div>

                    {/* Route Info */}
                    <div className="bg-slate-950/80 p-3 rounded-xl border border-slate-800 space-y-2 text-xs font-mono">
                      <div className="flex items-center justify-between text-slate-300">
                        <div className="flex items-center gap-1.5">
                          <MapPin className="w-3.5 h-3.5 text-emerald-400" />
                          <span className="font-bold">{load.originHub}</span>
                          <span className="text-slate-400">({load.originPostcode})</span>
                        </div>
                        <span className="text-slate-400 text-[10px]">{load.pickupWindow}</span>
                      </div>
                      <div className="flex items-center justify-between text-slate-300">
                        <div className="flex items-center gap-1.5">
                          <MapPin className="w-3.5 h-3.5 text-cyan-400" />
                          <span className="font-bold">{load.destinationHub}</span>
                          <span className="text-slate-400">({load.destinationPostcode})</span>
                        </div>
                        <span className="text-slate-400 text-[10px]">{load.deliveryWindow}</span>
                      </div>
                    </div>

                    {/* Trailer & Specs */}
                    <div className="grid grid-cols-3 gap-2 text-[11px] font-mono text-slate-300 py-1 border-b border-slate-800/60">
                      <div>
                        <span className="text-slate-400 block text-[9px] uppercase">Trailer</span>
                        <span className="font-semibold truncate block">{load.requiredTrailerType}</span>
                      </div>
                      <div>
                        <span className="text-slate-400 block text-[9px] uppercase">Pallets</span>
                        <span className="font-semibold">{load.palletCount} Plts ({load.weightTonnes}t)</span>
                      </div>
                      <div>
                        <span className="text-slate-400 block text-[9px] uppercase">CO2 Deadhead</span>
                        <span className="text-emerald-400 font-semibold flex items-center gap-1">
                          <Leaf className="w-3 h-3" /> -{load.deadheadSavingsCo2Kg}kg
                        </span>
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="pt-1 flex items-center justify-between gap-3">
                      <div className="text-[11px] font-mono text-amber-400 flex items-center gap-1">
                        <Clock className="w-3.5 h-3.5" />
                        <span>Cascade: {load.minutesUntilNextTier}m remaining</span>
                      </div>

                      {isBooked ? (
                        <div className="px-4 py-2 rounded-xl bg-cyan-950/80 text-cyan-400 border border-cyan-800/80 text-xs font-bold font-mono flex items-center gap-1.5 shadow-inner">
                          <CheckCircle2 className="w-4 h-4 text-cyan-400" /> Tender Submitted
                        </div>
                      ) : (
                        <button
                          onClick={() => handleBookLoad(load.id)}
                          className="px-4 py-2 rounded-xl bg-cyan-600 hover:bg-cyan-500 active:scale-95 text-white text-xs font-bold transition shadow-md shadow-cyan-900/30 flex items-center gap-1 touch-press"
                        >
                          <Zap className="w-3.5 h-3.5" />
                          <span>Submit Haulier Tender</span>
                        </button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Tab 2: Post Cargo Form (Businesses post freight) */}
        {activeTab === 'POST_LOAD' && (
          <form
            onSubmit={handleCreateLoad}
            className="cockpit-panel border border-white/10 rounded-3xl p-5 space-y-4 shadow-cockpit"
          >
            <div>
              <h2 className="text-sm font-bold text-white flex items-center gap-1.5">
                <Truck className="w-4 h-4 text-cyan-400" /> Post Freight Cargo / Broadcast Tender
              </h2>
              <p className="text-xs text-slate-400 mt-0.5">
                Broadcast full truckload (FTL) or pallet overflow to verified UK hauliers.
              </p>
            </div>

            {postSuccess && (
              <div className="p-3 rounded-xl bg-emerald-950 border border-emerald-800 text-emerald-300 text-xs font-bold flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4" /> Cargo Posted! Cascading to Tier 1 Partner Fleets...
              </div>
            )}

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-[11px] font-mono text-slate-300 block mb-1">Origin Hub / Depot</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Northampton NN4"
                  value={newOrigin}
                  onChange={(e) => setNewOrigin(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white placeholder-slate-600 focus:outline-none focus:border-cyan-500"
                />
              </div>

              <div>
                <label className="text-[11px] font-mono text-slate-300 block mb-1">Destination Hub</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Manchester M17"
                  value={newDestination}
                  onChange={(e) => setNewDestination(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white placeholder-slate-600 focus:outline-none focus:border-cyan-500"
                />
              </div>
            </div>

            <div className="grid grid-cols-3 gap-3">
              <div>
                <label className="text-[11px] font-mono text-slate-300 block mb-1">Trailer Type</label>
                <select
                  value={newTrailerType}
                  onChange={(e) => setNewTrailerType(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-2 py-2 text-xs text-white focus:outline-none focus:border-cyan-500"
                >
                  <option>44t Curtain / Tail-lift</option>
                  <option>44t Box / Barn Doors</option>
                  <option>44t Temp Controlled / Reefer</option>
                  <option>44t Flatbed / Low-Loader</option>
                </select>
              </div>

              <div>
                <label className="text-[11px] font-mono text-slate-300 block mb-1">Pallet Count</label>
                <input
                  type="number"
                  min="1"
                  max="26"
                  value={newPalletCount}
                  onChange={(e) => setNewPalletCount(Number(e.target.value))}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-cyan-500"
                />
              </div>

              <div>
                <label className="text-[11px] font-mono text-slate-300 block mb-1">Target Rate (£)</label>
                <input
                  type="number"
                  min="100"
                  step="25"
                  value={newTargetRate}
                  onChange={(e) => setNewTargetRate(Number(e.target.value))}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-cyan-500"
                />
              </div>
            </div>

            <button
              type="submit"
              className="w-full py-3 rounded-xl bg-cyan-600 hover:bg-cyan-500 active:scale-95 text-white font-bold text-xs transition shadow-lg shadow-cyan-900/40 flex items-center justify-center gap-2 touch-press"
            >
              <Send className="w-4 h-4" /> Broadcast 3-Tier Cascading Tender
            </button>
          </form>
        )}
      </main>

      {/* Modals */}
      {isHxModalOpen && <HxFreightWorkflowModal isOpen={isHxModalOpen} onClose={() => setIsHxModalOpen(false)} />}
      {isBreakEvenOpen && (
        <FreightBreakEvenCalculatorModal
          isOpen={isBreakEvenOpen}
          onClose={() => setIsBreakEvenOpen(false)}
        />
      )}
    </div>
  );
}
