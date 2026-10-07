'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import dynamic from 'next/dynamic';
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
  Leaf
} from 'lucide-react';
import { MOCK_FREIGHT_LOADS, FreightLoadItem } from '@/data/mockFreightLoads';

const HxFreightWorkflowModal = dynamic(
  () => import('@/components/modals/HxFreightWorkflowModal').then(m => m.HxFreightWorkflowModal),
  { ssr: false }
);

const FreightBreakEvenCalculatorModal = dynamic(
  () => import('@/components/modals/FreightBreakEvenCalculatorModal').then(m => m.FreightBreakEvenCalculatorModal),
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

  const filteredLoads = loads.filter(l => {
    if (selectedTierFilter === 'ALL') return true;
    return l.tierLevel === selectedTierFilter;
  });

  const handleBookLoad = (id: string) => {
    setBookedLoadIds(prev => [...prev, id]);
  };

  const handleCreateLoad = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newOrigin || !newDestination) return;

    const created: FreightLoadItem = {
      id: `ld-${Date.now()}`,
      loadNumber: `FL-2026-${Math.floor(1000 + Math.random() * 9000)}`,
      shipperName: 'Verified UK Shipper / Manufacturer',
      originHub: newOrigin,
      originPostcode: 'UK-DEPOT',
      destinationHub: newDestination,
      destinationPostcode: 'UK-RDC',
      pickupWindow: 'Today Window Scheduled',
      deliveryWindow: 'Tomorrow Morning SLA',
      distanceMiles: 185,
      weightTonnes: Number(newWeightTonnes),
      palletCount: Number(newPalletCount),
      requiredTrailerType: newTrailerType,
      baseRateGbp: Number(newTargetRate),
      currentRateGbp: Number(newTargetRate),
      tierLevel: 1,
      tierLabel: 'TIER 1 (Private Fleet)',
      minutesUntilNextTier: 20,
      isCrossDockMultiLeg: false,
      isHazmat: false,
      status: 'OPEN_TENDER',
      deadheadSavingsCo2Kg: 52.4
    };

    setLoads(prev => [created, ...prev]);
    setPostSuccess(true);
    setTimeout(() => {
      setPostSuccess(false);
      setActiveTab('BROWSE_LOADS');
    }, 1200);
  };

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
            onClick={() => setIsBreakEvenOpen(true)}
            className="px-2.5 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-200 text-xs font-semibold flex items-center gap-1 transition"
          >
            <DollarSign className="w-3.5 h-3.5 text-emerald-400" />
            <span className="hidden sm:inline">Break-Even</span>
          </button>
          <button
            onClick={() => setIsHxModalOpen(true)}
            className="px-2.5 py-1.5 rounded-lg bg-cyan-600 hover:bg-cyan-500 text-white text-xs font-semibold flex items-center gap-1 shadow-md shadow-cyan-900/30 transition active:scale-95"
          >
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>HX 6-Step</span>
          </button>
        </div>
      </header>

      {/* Main Single-Purpose Body */}
      <main className="flex-1 w-full max-w-2xl mx-auto p-4 space-y-4 overflow-y-auto">
        {/* Top Perspective Switch: Browse Loads vs Post Load */}
        <div className="grid grid-cols-2 p-1 bg-slate-900 rounded-2xl border border-slate-800">
          <button
            onClick={() => setActiveTab('BROWSE_LOADS')}
            className={`py-2 text-xs font-bold rounded-xl transition ${
              activeTab === 'BROWSE_LOADS'
                ? 'bg-cyan-600 text-white shadow-md shadow-cyan-900/40'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            For Hauliers: Available Cargo ({filteredLoads.length})
          </button>
          <button
            onClick={() => setActiveTab('POST_LOAD')}
            className={`py-2 text-xs font-bold rounded-xl transition ${
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
          <div className="space-y-3">
            {/* Tier Filters */}
            <div className="flex items-center gap-2 overflow-x-auto pb-1 no-scrollbar">
              <button
                onClick={() => setSelectedTierFilter('ALL')}
                className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition ${
                  selectedTierFilter === 'ALL'
                    ? 'bg-cyan-600 text-white shadow-md shadow-cyan-900/30'
                    : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800'
                }`}
              >
                All Cascading Tenders
              </button>
              <button
                onClick={() => setSelectedTierFilter(1)}
                className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition ${
                  selectedTierFilter === 1
                    ? 'bg-cyan-600 text-white shadow-md shadow-cyan-900/30'
                    : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800'
                }`}
              >
                Tier 1 (Private Fleet)
              </button>
              <button
                onClick={() => setSelectedTierFilter(2)}
                className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition ${
                  selectedTierFilter === 2
                    ? 'bg-cyan-600 text-white shadow-md shadow-cyan-900/30'
                    : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800'
                }`}
              >
                Tier 2 (Preferred)
              </button>
              <button
                onClick={() => setSelectedTierFilter(3)}
                className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition ${
                  selectedTierFilter === 3
                    ? 'bg-cyan-600 text-white shadow-md shadow-cyan-900/30'
                    : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800'
                }`}
              >
                Tier 3 (Spot Exchange)
              </button>
            </div>

            {/* Loads Cards */}
            <div className="space-y-3">
              {filteredLoads.map((load) => {
                const isBooked = bookedLoadIds.includes(load.id);

                return (
                  <div
                    key={load.id}
                    className="bg-slate-900/90 border border-slate-800 hover:border-slate-700 rounded-2xl p-4 transition shadow-lg space-y-3"
                  >
                    {/* Header */}
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-cyan-950 text-cyan-400 border border-cyan-800/60">
                            {load.tierLabel}
                          </span>
                          <span className="text-[10px] text-slate-400 font-mono">{load.loadNumber}</span>
                        </div>
                        <h2 className="text-sm font-bold text-white mt-1 leading-snug">{load.shipperName}</h2>
                      </div>

                      <div className="text-right shrink-0">
                        <span className="text-base font-extrabold text-cyan-400">
                          £{load.currentRateGbp.toFixed(2)}
                        </span>
                        <span className="text-[10px] text-slate-400 block font-mono">
                          £{(load.currentRateGbp / load.distanceMiles).toFixed(2)}/mi
                        </span>
                      </div>
                    </div>

                    {/* Route Info */}
                    <div className="bg-slate-950 p-3 rounded-xl border border-slate-800 space-y-2 text-xs font-mono">
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
                        <div className="px-4 py-2 rounded-xl bg-cyan-950 text-cyan-400 border border-cyan-800/80 text-xs font-bold flex items-center gap-1.5">
                          <CheckCircle2 className="w-4 h-4" /> Tender Submitted
                        </div>
                      ) : (
                        <button
                          onClick={() => handleBookLoad(load.id)}
                          className="px-4 py-2 rounded-xl bg-cyan-600 hover:bg-cyan-500 active:scale-95 text-white text-xs font-bold transition shadow-md shadow-cyan-900/30 flex items-center gap-1"
                        >
                          Submit Haulier Tender
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
          <form onSubmit={handleCreateLoad} className="bg-slate-900 border border-slate-800 rounded-3xl p-5 space-y-4 shadow-xl">
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
                <CheckCircle2 className="w-4 h-4" /> Load broadcasted to Tier 1 Private Hauliers!
              </div>
            )}

            <div className="space-y-3 text-xs">
              <div>
                <label className="block text-slate-300 font-bold mb-1">Collection Depot / Hub</label>
                <input
                  type="text"
                  placeholder="e.g. DIRFT Central Logistics Park (NN6 7GZ)"
                  value={newOrigin}
                  onChange={e => setNewOrigin(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 focus:border-cyan-400 text-white outline-none"
                  required
                />
              </div>

              <div>
                <label className="block text-slate-300 font-bold mb-1">Delivery Destination / DC</label>
                <input
                  type="text"
                  placeholder="e.g. Eurocentral MegaHub, Scotland (ML1 4WQ)"
                  value={newDestination}
                  onChange={e => setNewDestination(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 focus:border-cyan-400 text-white outline-none"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-300 font-bold mb-1">Trailer Specification</label>
                  <select
                    value={newTrailerType}
                    onChange={e => setNewTrailerType(e.target.value)}
                    className="w-full px-3 py-2.5 rounded-xl bg-slate-950 border border-slate-800 focus:border-cyan-400 text-white outline-none"
                  >
                    <option value="44t Curtain / Tail-lift">44t Curtain / Tail-lift</option>
                    <option value="44t Box Trailer (High Security)">44t Box (High Security)</option>
                    <option value="44t Temperature Controlled (Reefer)">44t Reefer / Chilled</option>
                    <option value="44t Flatbed / Low-Loader">44t Flatbed / Steel</option>
                  </select>
                </div>

                <div>
                  <label className="block text-slate-300 font-bold mb-1">Target Rate (£ GBP)</label>
                  <input
                    type="number"
                    value={newTargetRate}
                    onChange={e => setNewTargetRate(Number(e.target.value))}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 focus:border-cyan-400 text-white outline-none font-mono"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-300 font-bold mb-1">Pallet Count</label>
                  <input
                    type="number"
                    value={newPalletCount}
                    onChange={e => setNewPalletCount(Number(e.target.value))}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 focus:border-cyan-400 text-white outline-none font-mono"
                    required
                  />
                </div>

                <div>
                  <label className="block text-slate-300 font-bold mb-1">Gross Weight (Tonnes)</label>
                  <input
                    type="number"
                    step="0.1"
                    value={newWeightTonnes}
                    onChange={e => setNewWeightTonnes(Number(e.target.value))}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 focus:border-cyan-400 text-white outline-none font-mono"
                    required
                  />
                </div>
              </div>

              <div className="p-3 bg-slate-950 rounded-xl border border-slate-800 text-[11px] text-slate-400 space-y-1">
                <span className="font-bold text-slate-300 block">Automated Cascading Tendering Rules:</span>
                <p>• <strong>0–20 min:</strong> Broadcasted privately to Tier 1 partner hauliers.</p>
                <p>• <strong>20–60 min:</strong> Escalates to Tier 2 preferred regional carriers.</p>
                <p>• <strong>60+ min:</strong> Opens to Tier 3 certified spot market with RHA detention clauses.</p>
              </div>
            </div>

            <button
              type="submit"
              className="w-full py-3 rounded-xl bg-cyan-600 hover:bg-cyan-500 active:scale-95 text-white font-bold text-sm transition shadow-lg shadow-cyan-900/40 flex items-center justify-center gap-1.5"
            >
              <Send className="w-4 h-4" /> Broadcast Cascading Tender
            </button>
          </form>
        )}
      </main>

      {/* Connected 6-Step HX & CX Workflow Modal */}
      {isHxModalOpen && (
        <HxFreightWorkflowModal
          isOpen={isHxModalOpen}
          onClose={() => setIsHxModalOpen(false)}
        />
      )}

      {/* Connected Break-Even Formula Engine Modal */}
      {isBreakEvenOpen && (
        <FreightBreakEvenCalculatorModal
          isOpen={isBreakEvenOpen}
          onClose={() => setIsBreakEvenOpen(false)}
        />
      )}
    </div>
  );
}
