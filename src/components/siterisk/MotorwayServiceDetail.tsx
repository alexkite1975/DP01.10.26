'use client';
import React, { useState } from 'react';
import {
  Star,
  ShieldCheck,
  AlertTriangle,
  Clock,
  ArrowLeft,
  Truck,
  CreditCard,
  Fuel,
  Zap,
  Wifi,
  Moon,
  MessageSquare,
  ThumbsUp,
  Share2,
  CheckCircle2,
  XCircle,
  Sparkles,
  Volume2,
  Send,
  Navigation,
  ExternalLink,
  ChevronRight,
  Info
} from 'lucide-react';
import confetti from 'canvas-confetti';
import {
  SiteRiskAssessment,
  CapacityOccupancyStatus,
  ServiceAreaFacilityChecklist,
  DriverServiceReview
} from '../../types';
import { formatHeightBoth } from '../../utils/heightUtils';

interface MotorwayServiceDetailProps {
  site: SiteRiskAssessment;
  onUpdateCapacity: (
    siteId: string,
    status: CapacityOccupancyStatus,
    reportedBays: number,
    notes: string
  ) => void;
  onUpdateFacility: (
    siteId: string,
    facilityKey: keyof ServiceAreaFacilityChecklist,
    value: any
  ) => void;
  onAddReview: (siteId: string, review: DriverServiceReview) => void;
  onBack: () => void;
  currentDriverName?: string;
  currentVehicleReg?: string;
}

export const MotorwayServiceDetail: React.FC<MotorwayServiceDetailProps> = ({
  site,
  onUpdateCapacity,
  onUpdateFacility,
  onAddReview,
  onBack,
  currentDriverName = 'Dave Higgins (C+E)',
  currentVehicleReg = 'GN21 JKM'
}) => {
  const msa = site.motorwayServicesData;
  if (!msa) return null;

  // Local state for 1-Tap Capacity reporting
  const [selectedStatus, setSelectedStatus] = useState<CapacityOccupancyStatus>(
    msa.currentOccupancyStatus
  );
  const [reportedBays, setReportedBays] = useState<number>(msa.estimatedAvailableBays);
  const [capacityNotes, setCapacityNotes] = useState<string>('');
  const [isCapacityReportingOpen, setIsCapacityReportingOpen] = useState(false);
  const [showToast, setShowToast] = useState<string | null>(null);

  // Local state for Review Form
  const [isReviewFormOpen, setIsReviewFormOpen] = useState(false);
  const [revTitle, setRevTitle] = useState('');
  const [revComment, setRevComment] = useState('');
  const [revScore, setRevScore] = useState(5);
  const [revShowers, setRevShowers] = useState(5);
  const [revSecurity, setRevSecurity] = useState(5);
  const [revFood, setRevFood] = useState(5);
  const [revParking, setRevParking] = useState(5);
  const [revValue, setRevValue] = useState(5);

  // Helpful votes state (local demo)
  const [helpfulVotes, setHelpfulVotes] = useState<Record<string, number>>({});

  const triggerToast = (msg: string) => {
    setShowToast(msg);
    setTimeout(() => setShowToast(null), 3500);
  };

  const handleBroadcastCapacity = () => {
    onUpdateCapacity(
      site.id,
      selectedStatus,
      reportedBays,
      capacityNotes || (selectedStatus === 'SPACES_AVAILABLE' ? 'Spaces confirmed on HGV apron' : selectedStatus === 'BUSY_FILLING_FAST' ? 'Filling rapidly, few spots left' : 'Apron full, queueing on slip')
    );
    try {
      confetti({
        particleCount: 40,
        spread: 60,
        origin: { y: 0.7 }
      });
    } catch (_e) {}
    setIsCapacityReportingOpen(false);
    triggerToast(`✓ Live Capacity Broadcasted! Other drivers alerted: ${selectedStatus.replace(/_/g, ' ')}`);
  };

  const handleSubmitReview = (e: React.FormEvent) => {
    e.preventDefault();
    if (!revTitle.trim() || !revComment.trim()) return;

    const newRev: DriverServiceReview = {
      id: `rev-${Date.now()}`,
      driverName: currentDriverName,
      driverBadge: 'Verified HGV Relief Driver',
      vehicleReg: currentVehicleReg,
      timestamp: 'Just now',
      overallScore: revScore,
      categoryScores: {
        showers: revShowers,
        security: revSecurity,
        food: revFood,
        parking: revParking,
        value: revValue
      },
      title: revTitle,
      comment: revComment,
      facilitiesVerified: {
        showersClean: revShowers >= 4,
        cctvWorking: revSecurity >= 4,
        hotFoodAvailable: revFood >= 4,
        spacesAtNight: revParking >= 4
      },
      helpfulCount: 0
    };

    onAddReview(site.id, newRev);
    setIsReviewFormOpen(false);
    setRevTitle('');
    setRevComment('');
    try {
      confetti({
        particleCount: 50,
        spread: 70,
        origin: { y: 0.6 }
      });
    } catch (_e) {}
    triggerToast('✓ Driver review published to TripAdvisor for Truckers network!');
  };

  const handleHelpfulClick = (revId: string, currentHelpful: number) => {
    if (helpfulVotes[revId]) return;
    setHelpfulVotes((prev) => ({ ...prev, [revId]: currentHelpful + 1 }));
    triggerToast('✓ Marked review as helpful');
  };

  // Helper for star rendering
  const renderStars = (score: number, max = 5) => {
    return (
      <div className="flex items-center gap-0.5 text-amber-400">
        {[...Array(max)].map((_, i) => (
          <Star
            key={i}
            className={`w-3.5 h-3.5 ${
              i < Math.floor(score)
                ? 'fill-amber-400 text-amber-400'
                : i < score
                ? 'fill-amber-400/50 text-amber-400'
                : 'text-slate-600'
            }`}
          />
        ))}
        <span className="ml-1 text-xs font-mono font-bold text-slate-200">
          {score.toFixed(1)}
        </span>
      </div>
    );
  };

  return (
    <div className="w-full max-w-5xl mx-auto space-y-6 pb-12">
      {/* Toast notification */}
      {showToast && (
        <div className="fixed top-5 right-5 z-50 px-4 py-3 rounded-2xl bg-emerald-500 text-slate-950 font-bold text-xs shadow-2xl flex items-center gap-2 animate-bounce">
          <CheckCircle2 className="w-4 h-4 fill-slate-950 text-emerald-500" />
          <span>{showToast}</span>
        </div>
      )}

      {/* Top Navigation Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-800 pb-3">
        <button
          onClick={onBack}
          className="flex items-center gap-2 text-xs font-bold text-slate-300 hover:text-white transition-colors cursor-pointer bg-slate-900 px-3.5 py-2 rounded-xl border border-slate-800"
        >
          <ArrowLeft className="w-4 h-4 text-cyan-400" />
          <span>Back to All Locations</span>
        </button>

        <div className="flex items-center gap-2">
          <span className="text-[10px] font-mono uppercase px-2.5 py-1 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 font-bold flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            TripAdvisor for Motorway Services
          </span>
          <span className="text-[10px] font-mono px-2 py-1 rounded-md bg-slate-800 text-slate-300 font-bold">
            {msa.operator}
          </span>
        </div>
      </div>

      {/* Hero Header with Photos & Live Capacity */}
      <div className="rounded-3xl bg-slate-900 border border-slate-800 overflow-hidden shadow-2xl">
        <div className="relative aspect-21/9 sm:aspect-3/1 w-full bg-slate-950 overflow-hidden">
          <img
            src={site.placePhotos?.[0] || 'https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?auto=format&fit=crop&w=1200&q=80'}
            alt={site.title}
            className="w-full h-full object-cover opacity-75"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-transparent flex flex-col justify-end p-5 sm:p-7 space-y-2">
            <div className="flex flex-wrap items-center gap-2">
              <span className="px-2.5 py-1 rounded-lg text-xs font-mono font-bold bg-cyan-500/30 text-cyan-200 border border-cyan-400/40">
                🛣️ {msa.motorway}
              </span>
              <span className="px-2.5 py-1 rounded-lg text-xs font-mono font-bold bg-amber-500/20 text-amber-300 border border-amber-400/30">
                🅿️ {msa.hgvParkingSpaces} HGV Bays
              </span>
              <span className="px-2.5 py-1 rounded-lg text-xs font-mono font-bold bg-purple-500/20 text-purple-300 border border-purple-400/30">
                💳 SNAP Account Accepted
              </span>
            </div>

            <h1 className="text-xl sm:text-3xl font-black text-white tracking-tight">
              {site.title}
            </h1>
            <p className="text-xs sm:text-sm text-slate-300 flex items-center gap-1.5">
              <span>{site.address}</span>
              <span className="text-slate-500">•</span>
              <span className="font-mono text-cyan-400">{site.what3words}</span>
            </p>
          </div>
        </div>

        {/* ========================================================================= */}
        {/* LIVE HGV CAPACITY RADAR (AS PER LAYBY PARKING FINDER)                     */}
        {/* ========================================================================= */}
        <div className="p-4 sm:p-6 bg-slate-950/90 border-t border-slate-800 space-y-4">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-4 rounded-2xl bg-slate-900/90 border border-slate-800">
            <div className="flex items-start sm:items-center gap-3.5">
              <div
                className={`w-12 h-12 rounded-2xl flex items-center justify-center font-black text-xl shrink-0 ${
                  msa.currentOccupancyStatus === 'SPACES_AVAILABLE'
                    ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40'
                    : msa.currentOccupancyStatus === 'BUSY_FILLING_FAST'
                    ? 'bg-amber-500/20 text-amber-400 border border-amber-500/40'
                    : 'bg-red-500/20 text-red-400 border border-red-500/40'
                }`}
              >
                {msa.currentOccupancyStatus === 'SPACES_AVAILABLE' ? '🟢' : msa.currentOccupancyStatus === 'BUSY_FILLING_FAST' ? '🟡' : '🔴'}
              </div>

              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="text-xs sm:text-sm font-black uppercase tracking-wide text-white">
                    Live HGV Parking Capacity Radar
                  </span>
                  <span
                    className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded-full uppercase ${
                      msa.currentOccupancyStatus === 'SPACES_AVAILABLE'
                        ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                        : msa.currentOccupancyStatus === 'BUSY_FILLING_FAST'
                        ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                        : 'bg-red-500/20 text-red-300 border border-red-500/30'
                    }`}
                  >
                    {msa.currentOccupancyStatus === 'SPACES_AVAILABLE'
                      ? `🟢 Spaces Available (~${msa.estimatedAvailableBays} bays free)`
                      : msa.currentOccupancyStatus === 'BUSY_FILLING_FAST'
                      ? `🟡 Filling Up Rapidly (~${msa.estimatedAvailableBays} bays left)`
                      : '🔴 FULL / HGV OVERFLOW ONLY'}
                  </span>
                </div>

                <div className="text-xs text-slate-400 flex flex-wrap items-center gap-2">
                  <span className="text-slate-300 font-medium">
                    Updated {msa.lastCapacityUpdate.timestamp} by{' '}
                    <strong className="text-cyan-400">{msa.lastCapacityUpdate.driverName}</strong>
                    {msa.lastCapacityUpdate.vehicleReg && (
                      <span className="ml-1 text-[10px] font-mono px-1.5 py-0.2 rounded bg-slate-800 text-slate-300">
                        [{msa.lastCapacityUpdate.vehicleReg}]
                      </span>
                    )}
                  </span>
                </div>

                {msa.lastCapacityUpdate.notes && (
                  <p className="text-[11px] text-amber-300/90 italic bg-amber-950/20 px-2.5 py-1 rounded-lg border border-amber-500/20 w-fit">
                    "{msa.lastCapacityUpdate.notes}"
                  </p>
                )}
              </div>
            </div>

            {/* Quick 1-Tap Update CTA */}
            <div className="flex items-center gap-2 shrink-0">
              <button
                onClick={() => setIsCapacityReportingOpen(!isCapacityReportingOpen)}
                className="w-full md:w-auto px-4 py-2.5 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-slate-950 font-black text-xs flex items-center justify-center gap-2 cursor-pointer shadow-lg shadow-emerald-500/20 transition-all active:scale-95"
              >
                <Truck className="w-4 h-4 fill-slate-950" />
                <span>Update Live Space for Drivers</span>
              </button>
            </div>
          </div>

          {/* Expanded 1-Tap Capacity Broadcast Panel */}
          {isCapacityReportingOpen && (
            <div className="p-4 sm:p-5 rounded-2xl bg-slate-900 border-2 border-emerald-500/40 space-y-4 animate-in fade-in duration-200">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-emerald-400" />
                  <span className="text-xs font-black uppercase text-white tracking-wider">
                    Broadcast Live Capacity Update (Driver Crowdsource)
                  </span>
                </div>
                <button
                  onClick={() => setIsCapacityReportingOpen(false)}
                  className="text-xs text-slate-400 hover:text-white"
                >
                  Cancel
                </button>
              </div>

              <p className="text-xs text-slate-300">
                Are you parked at or approaching <strong>{site.title}</strong> right now? Help your fellow drivers on the road:
              </p>

              {/* 3 Large Touch Buttons */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <button
                  type="button"
                  onClick={() => {
                    setSelectedStatus('SPACES_AVAILABLE');
                    if (reportedBays <= 5) setReportedBays(25);
                  }}
                  className={`p-3.5 rounded-xl border text-left transition-all cursor-pointer flex flex-col justify-between gap-1.5 ${
                    selectedStatus === 'SPACES_AVAILABLE'
                      ? 'bg-emerald-950/60 border-emerald-500 text-white shadow-lg shadow-emerald-500/10'
                      : 'bg-slate-950 border-slate-800 text-slate-400 hover:border-slate-700'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="text-lg">🟢</span>
                    <span className="text-[10px] font-mono font-bold text-emerald-400">READY TO PARK</span>
                  </div>
                  <div className="text-xs font-bold text-white">Plenty of Spaces</div>
                  <div className="text-[11px] text-slate-400">Easy parking, wide spaces free</div>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setSelectedStatus('BUSY_FILLING_FAST');
                    setReportedBays(8);
                  }}
                  className={`p-3.5 rounded-xl border text-left transition-all cursor-pointer flex flex-col justify-between gap-1.5 ${
                    selectedStatus === 'BUSY_FILLING_FAST'
                      ? 'bg-amber-950/60 border-amber-500 text-white shadow-lg shadow-amber-500/10'
                      : 'bg-slate-950 border-slate-800 text-slate-400 hover:border-slate-700'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="text-lg">🟡</span>
                    <span className="text-[10px] font-mono font-bold text-amber-400">FILLING RAPIDLY</span>
                  </div>
                  <div className="text-xs font-bold text-white">Getting Tight / Few Left</div>
                  <div className="text-[11px] text-slate-400">Less than 10 bays left</div>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setSelectedStatus('FULL_NO_SPACES');
                    setReportedBays(0);
                  }}
                  className={`p-3.5 rounded-xl border text-left transition-all cursor-pointer flex flex-col justify-between gap-1.5 ${
                    selectedStatus === 'FULL_NO_SPACES'
                      ? 'bg-red-950/60 border-red-500 text-white shadow-lg shadow-red-500/10'
                      : 'bg-slate-950 border-slate-800 text-slate-400 hover:border-slate-700'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="text-lg">🔴</span>
                    <span className="text-[10px] font-mono font-bold text-red-400">RAMMED SOLID</span>
                  </div>
                  <div className="text-xs font-bold text-white">Full / Gate Turning Away</div>
                  <div className="text-[11px] text-slate-400">Overspill or slip parking only</div>
                </button>
              </div>

              {/* Bay estimate slider and comment */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-300 flex items-center justify-between">
                    <span>Estimated Bays Free:</span>
                    <span className="font-mono text-cyan-400 font-bold">{reportedBays} bays</span>
                  </label>
                  <input
                    type="range"
                    min="0"
                    max={msa.hgvParkingSpaces}
                    value={reportedBays}
                    onChange={(e) => setReportedBays(parseInt(e.target.value) || 0)}
                    className="w-full accent-emerald-500 cursor-pointer"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-300">
                    Cab Note / Parking Tip (Optional):
                  </label>
                  <input
                    type="text"
                    value={capacityNotes}
                    onChange={(e) => setCapacityNotes(e.target.value)}
                    placeholder="e.g. Back row free, avoid puddle near bay 18"
                    className="w-full px-3 py-1.5 rounded-xl bg-slate-950 border border-slate-800 text-white text-xs placeholder:text-slate-600 focus:outline-none focus:border-emerald-500"
                  />
                </div>
              </div>

              <div className="flex justify-end pt-2">
                <button
                  type="button"
                  onClick={handleBroadcastCapacity}
                  className="px-6 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black text-xs flex items-center gap-2 cursor-pointer shadow-md shadow-emerald-500/20"
                >
                  <Send className="w-3.5 h-3.5 fill-slate-950" />
                  <span>Broadcast to Live Driver Network</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Main Grid: TripAdvisor Scores & Facilities Checklist */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: TripAdvisor Rating & Category Breakdown */}
        <div className="lg:col-span-1 space-y-6">
          {/* TripAdvisor Overall Score Card */}
          <div className="p-5 rounded-3xl bg-slate-900 border border-slate-800 space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-mono uppercase text-slate-400">
                Driver Review Index
              </span>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 font-bold border border-emerald-500/30">
                TripAdvisor Rated
              </span>
            </div>

            <div className="flex items-center gap-4">
              <div className="w-16 h-16 rounded-2xl bg-emerald-500 text-slate-950 flex flex-col items-center justify-center font-black shadow-lg shadow-emerald-500/20">
                <span className="text-2xl leading-none">{msa.overallRating.toFixed(1)}</span>
                <span className="text-[9px] font-bold uppercase mt-0.5">/ 5.0</span>
              </div>
              <div className="space-y-1">
                <h3 className="text-base font-black text-white">
                  {msa.overallRating >= 4.5
                    ? 'Exceptional Truckstop'
                    : msa.overallRating >= 4.0
                    ? 'Very Good Services'
                    : msa.overallRating >= 3.0
                    ? 'Average Rest Stop'
                    : 'Poor Rating'}
                </h3>
                <div className="flex items-center gap-1.5 text-xs text-slate-400">
                  {renderStars(msa.overallRating)}
                  <span>({msa.reviewCount} verified reviews)</span>
                </div>
              </div>
            </div>

            {/* 5 TripAdvisor Category Bars */}
            <div className="space-y-3 pt-3 border-t border-slate-800">
              <div className="space-y-1">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-slate-300 flex items-center gap-1.5">
                    <span>🚿</span>
                    <span>Showers &amp; Cleanliness</span>
                  </span>
                  <span className="font-mono font-bold text-emerald-400">
                    {msa.categoryRatings.showers.toFixed(1)}
                  </span>
                </div>
                <div className="w-full h-2 rounded-full bg-slate-800 overflow-hidden">
                  <div
                    className="h-full bg-emerald-500 rounded-full"
                    style={{ width: `${(msa.categoryRatings.showers / 5) * 100}%` }}
                  />
                </div>
              </div>

              <div className="space-y-1">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-slate-300 flex items-center gap-1.5">
                    <span>🛡️</span>
                    <span>Security &amp; Fuel Anti-Theft</span>
                  </span>
                  <span className="font-mono font-bold text-emerald-400">
                    {msa.categoryRatings.security.toFixed(1)}
                  </span>
                </div>
                <div className="w-full h-2 rounded-full bg-slate-800 overflow-hidden">
                  <div
                    className="h-full bg-emerald-500 rounded-full"
                    style={{ width: `${(msa.categoryRatings.security / 5) * 100}%` }}
                  />
                </div>
              </div>

              <div className="space-y-1">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-slate-300 flex items-center gap-1.5">
                    <span>🍔</span>
                    <span>Food Quality &amp; Meal Deal</span>
                  </span>
                  <span className="font-mono font-bold text-emerald-400">
                    {msa.categoryRatings.foodQuality.toFixed(1)}
                  </span>
                </div>
                <div className="w-full h-2 rounded-full bg-slate-800 overflow-hidden">
                  <div
                    className="h-full bg-cyan-500 rounded-full"
                    style={{ width: `${(msa.categoryRatings.foodQuality / 5) * 100}%` }}
                  />
                </div>
              </div>

              <div className="space-y-1">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-slate-300 flex items-center gap-1.5">
                    <span>🅿️</span>
                    <span>Parking Layout &amp; Turning</span>
                  </span>
                  <span className="font-mono font-bold text-amber-400">
                    {msa.categoryRatings.parkingLayout.toFixed(1)}
                  </span>
                </div>
                <div className="w-full h-2 rounded-full bg-slate-800 overflow-hidden">
                  <div
                    className="h-full bg-amber-500 rounded-full"
                    style={{ width: `${(msa.categoryRatings.parkingLayout / 5) * 100}%` }}
                  />
                </div>
              </div>

              <div className="space-y-1">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-slate-300 flex items-center gap-1.5">
                    <span>💷</span>
                    <span>Tariff Value for Money</span>
                  </span>
                  <span className="font-mono font-bold text-purple-400">
                    {msa.categoryRatings.valueForMoney.toFixed(1)}
                  </span>
                </div>
                <div className="w-full h-2 rounded-full bg-slate-800 overflow-hidden">
                  <div
                    className="h-full bg-purple-500 rounded-full"
                    style={{ width: `${(msa.categoryRatings.valueForMoney / 5) * 100}%` }}
                  />
                </div>
              </div>
            </div>

            <button
              onClick={() => setIsReviewFormOpen(true)}
              className="w-full py-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs flex items-center justify-center gap-2 cursor-pointer transition-all border border-slate-700"
            >
              <MessageSquare className="w-4 h-4 text-cyan-400" />
              <span>Write Driver Review &amp; Rate</span>
            </button>
          </div>

          {/* Overnight Parking Tariff Card */}
          <div className="p-5 rounded-3xl bg-slate-900 border border-slate-800 space-y-3">
            <h4 className="text-xs font-black uppercase text-white flex items-center gap-2">
              <CreditCard className="w-4 h-4 text-cyan-400" />
              <span>Overnight Tariff &amp; Payment</span>
            </h4>

            <div className="p-3 rounded-2xl bg-slate-950 border border-slate-800 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs text-slate-400">Overnight Tariff (24h)</span>
                <span className="text-base font-black text-white">
                  £{msa.parkingTariff.overnightCost.toFixed(2)}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-xs text-slate-400">Free Stay Duration</span>
                <span className="text-xs font-bold text-emerald-400">
                  {msa.parkingTariff.freeHours} Hours Free
                </span>
              </div>
              {msa.parkingTariff.includesFoodVoucher && (
                <div className="flex items-center justify-between pt-1 border-t border-slate-800">
                  <span className="text-xs text-amber-300 font-medium">Meal Voucher Included</span>
                  <span className="text-xs font-mono font-bold text-amber-400">
                    £{msa.parkingTariff.foodVoucherAmount?.toFixed(2)} Voucher
                  </span>
                </div>
              )}
            </div>

            <div className="space-y-1.5 pt-1">
              <div className="text-[11px] font-bold text-slate-400">Accepted Payment &amp; Fuel Cards:</div>
              <div className="flex flex-wrap gap-1.5">
                {msa.parkingTariff.snapAccepted && (
                  <span className="px-2 py-0.5 rounded-md bg-purple-500/20 text-purple-300 text-[10px] font-mono font-bold border border-purple-500/40">
                    SNAP Account
                  </span>
                )}
                {msa.parkingTariff.fuelCardsAccepted.map((fc) => (
                  <span
                    key={fc}
                    className="px-2 py-0.5 rounded-md bg-slate-800 text-slate-300 text-[10px] font-mono border border-slate-700"
                  >
                    {fc}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Right Columns: Interactive Facilities Checklist & Driver Reviews */}
        <div className="lg:col-span-2 space-y-6">
          {/* ========================================================================= */}
          {/* INTERACTIVE FACILITIES CHECKLIST (DRIVER UPDATABLE)                       */}
          {/* ========================================================================= */}
          <div className="p-5 rounded-3xl bg-slate-900 border border-slate-800 space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div>
                <h3 className="text-base font-black text-white flex items-center gap-2">
                  <ShieldCheck className="w-5 h-5 text-emerald-400" />
                  <span>Driver Facilities Checklist &amp; Live Status</span>
                </h3>
                <p className="text-xs text-slate-400">
                  Drivers can toggle and report operational status to keep the community informed.
                </p>
              </div>

              <span className="text-[10px] font-mono text-cyan-400 bg-cyan-950/60 px-2.5 py-1 rounded-full border border-cyan-500/30 w-fit">
                Live Status Verified
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {/* 1. Showers */}
              <div className="p-3.5 rounded-2xl bg-slate-950 border border-slate-800 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-cyan-500/20 text-cyan-400 flex items-center justify-center font-bold text-sm">
                    🚿
                  </div>
                  <div>
                    <div className="text-xs font-bold text-white flex items-center gap-1.5">
                      <span>Showers</span>
                      <span className="text-[10px] font-mono text-amber-400">
                        ({msa.facilities.showerRating}★)
                      </span>
                    </div>
                    <div className="text-[11px] text-slate-400">
                      {msa.facilities.showersWorking ? (
                        <span className="text-emerald-400 font-bold">✓ Working &amp; Hot Water</span>
                      ) : (
                        <span className="text-red-400 font-bold">✕ Reported Out of Order</span>
                      )}
                    </div>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => {
                    const newVal = !msa.facilities.showersWorking;
                    onUpdateFacility(site.id, 'showersWorking', newVal);
                    triggerToast(`✓ Showers status updated: ${newVal ? 'Working' : 'Out of order'}`);
                  }}
                  className={`px-2.5 py-1 rounded-lg text-[10px] font-bold cursor-pointer transition-colors ${
                    msa.facilities.showersWorking
                      ? 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                      : 'bg-red-500/20 text-red-300 border border-red-500/40'
                  }`}
                >
                  {msa.facilities.showersWorking ? 'Report Issue' : 'Mark Fixed'}
                </button>
              </div>

              {/* 2. 24h Hot Food */}
              <div className="p-3.5 rounded-2xl bg-slate-950 border border-slate-800 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-amber-500/20 text-amber-400 flex items-center justify-center font-bold text-sm">
                    🍲
                  </div>
                  <div>
                    <div className="text-xs font-bold text-white">24h Hot Food</div>
                    <div className="text-[11px] text-slate-400">
                      {msa.facilities.hotFood24h ? (
                        <span className="text-emerald-400 font-bold">✓ 24/7 Kitchen Open</span>
                      ) : (
                        <span className="text-amber-400">Closes at 22:00</span>
                      )}
                    </div>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => {
                    const newVal = !msa.facilities.hotFood24h;
                    onUpdateFacility(site.id, 'hotFood24h', newVal);
                    triggerToast(`✓ 24h food status updated`);
                  }}
                  className="px-2.5 py-1 rounded-lg text-[10px] font-bold bg-slate-800 text-slate-300 hover:bg-slate-700 cursor-pointer"
                >
                  Toggle
                </button>
              </div>

              {/* 3. Security Level & Fuel Theft */}
              <div className="p-3.5 rounded-2xl bg-slate-950 border border-slate-800 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-purple-500/20 text-purple-400 flex items-center justify-center font-bold text-sm">
                    👮
                  </div>
                  <div>
                    <div className="text-xs font-bold text-white">Security &amp; Patrols</div>
                    <div className="text-[11px] text-slate-400">
                      {msa.facilities.securityLevel === 'GUARDED_CCTV_GATED' ? (
                        <span className="text-emerald-400 font-bold">Manned Guard &amp; ANPR Gate</span>
                      ) : msa.facilities.securityLevel === 'CCTV_PATROLLED' ? (
                        <span className="text-cyan-400">CCTV &amp; Mobile Patrols</span>
                      ) : (
                        <span className="text-amber-400">Unguarded / Open Access</span>
                      )}
                    </div>
                  </div>
                </div>

                <span
                  className={`px-2 py-0.5 rounded-full text-[10px] font-mono font-bold ${
                    msa.facilities.fuelTheftRisk === 'LOW'
                      ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                      : msa.facilities.fuelTheftRisk === 'MEDIUM'
                      ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                      : 'bg-red-500/20 text-red-300 border border-red-500/30'
                  }`}
                >
                  {msa.facilities.fuelTheftRisk} Theft Risk
                </span>
              </div>

              {/* 4. Turning Ease & Apron Layout */}
              <div className="p-3.5 rounded-2xl bg-slate-950 border border-slate-800 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-blue-500/20 text-blue-400 flex items-center justify-center font-bold text-sm">
                    📐
                  </div>
                  <div>
                    <div className="text-xs font-bold text-white">Turning Radius &amp; Apron</div>
                    <div className="text-[11px] text-slate-400">
                      {msa.facilities.turningEase === 'WIDE_EASY' ? (
                        <span className="text-emerald-400 font-bold">Wide Drive-Through Bays</span>
                      ) : msa.facilities.turningEase === 'MODERATE' ? (
                        <span className="text-cyan-400">Standard Chevron Parking</span>
                      ) : (
                        <span className="text-red-400 font-bold">Tight Curbs / Reverse Only</span>
                      )}
                    </div>
                  </div>
                </div>

                <span className="text-xs font-mono font-bold text-slate-300">
                  {formatHeightBoth(site.businessSection.vehicleConstraints.maxHeightMeters)}
                </span>
              </div>

              {/* 5. Additional Amenities Chips */}
              <div className="sm:col-span-2 p-3.5 rounded-2xl bg-slate-950 border border-slate-800 space-y-2">
                <div className="text-xs font-bold text-white">Additional Site Amenities:</div>
                <div className="flex flex-wrap gap-2">
                  <span
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 ${
                      msa.facilities.truckWash
                        ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                        : 'bg-slate-900 text-slate-500 border border-slate-800'
                    }`}
                  >
                    <span>🚿</span>
                    <span>HGV Truck Wash: {msa.facilities.truckWash ? 'YES' : 'NO'}</span>
                  </span>

                  <span
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 ${
                      msa.facilities.adBluePump
                        ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/30'
                        : 'bg-slate-900 text-slate-500 border border-slate-800'
                    }`}
                  >
                    <Fuel className="w-3.5 h-3.5" />
                    <span>AdBlue at Pump: {msa.facilities.adBluePump ? 'YES' : 'NO'}</span>
                  </span>

                  <span
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 ${
                      msa.facilities.evTruckCharging
                        ? 'bg-purple-500/20 text-purple-300 border border-purple-500/30'
                        : 'bg-slate-900 text-slate-500 border border-slate-800'
                    }`}
                  >
                    <Zap className="w-3.5 h-3.5" />
                    <span>EV Truck MW Charger: {msa.facilities.evTruckCharging ? 'YES' : 'NO'}</span>
                  </span>

                  <span
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 ${
                      msa.facilities.quietSleepZone
                        ? 'bg-blue-500/20 text-blue-300 border border-blue-500/30'
                        : 'bg-slate-900 text-slate-500 border border-slate-800'
                    }`}
                  >
                    <Moon className="w-3.5 h-3.5" />
                    <span>Quiet Sleep Zone: {msa.facilities.quietSleepZone ? 'YES' : 'NO'}</span>
                  </span>

                  <span
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 ${
                      msa.facilities.freeWifi
                        ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                        : 'bg-slate-900 text-slate-500 border border-slate-800'
                    }`}
                  >
                    <Wifi className="w-3.5 h-3.5" />
                    <span>Free Trucker Wi-Fi: {msa.facilities.freeWifi ? 'YES' : 'NO'}</span>
                  </span>
                </div>

                <div className="pt-2 border-t border-slate-800/80 flex flex-wrap items-center gap-2">
                  <span className="text-[11px] text-slate-400">Food Outlets on Site:</span>
                  {msa.facilities.foodOutlets.map((outlet) => (
                    <span
                      key={outlet}
                      className="px-2 py-0.5 rounded-md bg-slate-900 text-slate-300 text-[11px] font-bold border border-slate-800"
                    >
                      🍴 {outlet}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* ========================================================================= */}
          {/* DRIVER REVIEWS FEED ("TRIPADVISOR FOR TRUCKERS")                          */}
          {/* ========================================================================= */}
          <div className="p-5 rounded-3xl bg-slate-900 border border-slate-800 space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-base font-black text-white flex items-center gap-2">
                  <MessageSquare className="w-5 h-5 text-amber-400" />
                  <span>Driver Reviews &amp; Cab Intel ({msa.driverReviews.length})</span>
                </h3>
                <p className="text-xs text-slate-400">
                  Real feedback from commercial HGV drivers who have parked, eaten, and slept here.
                </p>
              </div>

              <button
                onClick={() => setIsReviewFormOpen(!isReviewFormOpen)}
                className="px-3.5 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-xs flex items-center gap-1.5 cursor-pointer shadow-md shadow-amber-500/20"
              >
                <Sparkles className="w-3.5 h-3.5 fill-slate-950" />
                <span>{isReviewFormOpen ? 'Close Form' : 'Write a Review'}</span>
              </button>
            </div>

            {/* Inline Review Form */}
            {isReviewFormOpen && (
              <form
                onSubmit={handleSubmitReview}
                className="p-4 sm:p-5 rounded-2xl bg-slate-950 border-2 border-amber-500/40 space-y-4 animate-in fade-in duration-200"
              >
                <div className="flex items-center justify-between">
                  <h4 className="text-xs font-black uppercase text-amber-400 tracking-wider">
                    Add Driver Review for {site.title}
                  </h4>
                  <span className="text-[10px] font-mono text-slate-400">
                    Posting as {currentDriverName} [{currentVehicleReg}]
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-slate-300">Overall Rating (1 - 5):</label>
                    <div className="flex items-center gap-2">
                      {[1, 2, 3, 4, 5].map((num) => (
                        <button
                          key={num}
                          type="button"
                          onClick={() => setRevScore(num)}
                          className={`w-9 h-9 rounded-xl font-black text-xs cursor-pointer transition-all ${
                            revScore >= num
                              ? 'bg-amber-500 text-slate-950 shadow-md shadow-amber-500/20'
                              : 'bg-slate-900 text-slate-400 border border-slate-800'
                          }`}
                        >
                          {num}★
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-bold text-slate-300">Review Headline:</label>
                    <input
                      type="text"
                      required
                      value={revTitle}
                      onChange={(e) => setRevTitle(e.target.value)}
                      placeholder="e.g. Great hot showers, fills up early"
                      className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-800 text-white text-xs placeholder:text-slate-600 focus:outline-none focus:border-amber-500"
                    />
                  </div>
                </div>

                {/* Sliders for Category Ratings */}
                <div className="grid grid-cols-2 sm:grid-cols-5 gap-2 pt-2 border-t border-slate-800">
                  <div className="space-y-1">
                    <span className="text-[10px] text-slate-400">🚿 Showers: {revShowers}★</span>
                    <input
                      type="range"
                      min="1"
                      max="5"
                      value={revShowers}
                      onChange={(e) => setRevShowers(parseInt(e.target.value))}
                      className="w-full accent-amber-500"
                    />
                  </div>
                  <div className="space-y-1">
                    <span className="text-[10px] text-slate-400">🛡️ Security: {revSecurity}★</span>
                    <input
                      type="range"
                      min="1"
                      max="5"
                      value={revSecurity}
                      onChange={(e) => setRevSecurity(parseInt(e.target.value))}
                      className="w-full accent-amber-500"
                    />
                  </div>
                  <div className="space-y-1">
                    <span className="text-[10px] text-slate-400">🍔 Food: {revFood}★</span>
                    <input
                      type="range"
                      min="1"
                      max="5"
                      value={revFood}
                      onChange={(e) => setRevFood(parseInt(e.target.value))}
                      className="w-full accent-amber-500"
                    />
                  </div>
                  <div className="space-y-1">
                    <span className="text-[10px] text-slate-400">🅿️ Parking: {revParking}★</span>
                    <input
                      type="range"
                      min="1"
                      max="5"
                      value={revParking}
                      onChange={(e) => setRevParking(parseInt(e.target.value))}
                      className="w-full accent-amber-500"
                    />
                  </div>
                  <div className="space-y-1">
                    <span className="text-[10px] text-slate-400">💷 Value: {revValue}★</span>
                    <input
                      type="range"
                      min="1"
                      max="5"
                      value={revValue}
                      onChange={(e) => setRevValue(parseInt(e.target.value))}
                      className="w-full accent-amber-500"
                    />
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-300">
                    Detailed Review &amp; Advice for other Drivers:
                  </label>
                  <textarea
                    required
                    rows={3}
                    value={revComment}
                    onChange={(e) => setRevComment(e.target.value)}
                    placeholder="Mention water pressure, parking turnaround room, food quality, overnight noise, or security notes..."
                    className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-800 text-white text-xs placeholder:text-slate-600 focus:outline-none focus:border-amber-500"
                  />
                </div>

                <div className="flex justify-end gap-2 pt-2">
                  <button
                    type="button"
                    onClick={() => setIsReviewFormOpen(false)}
                    className="px-4 py-2 rounded-xl bg-slate-900 text-slate-400 text-xs font-bold cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-xs flex items-center gap-1.5 cursor-pointer shadow-md shadow-amber-500/20"
                  >
                    <Send className="w-3.5 h-3.5 fill-slate-950" />
                    <span>Publish Driver Review</span>
                  </button>
                </div>
              </form>
            )}

            {/* Reviews List */}
            <div className="space-y-3">
              {msa.driverReviews.map((rev) => (
                <div
                  key={rev.id}
                  className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-2.5 transition-all hover:border-slate-700"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1.5">
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-black text-white">{rev.title}</span>
                      <span className="text-xs font-mono font-bold text-amber-400">
                        {renderStars(rev.overallScore)}
                      </span>
                    </div>
                    <span className="text-[10px] font-mono text-slate-400">{rev.timestamp}</span>
                  </div>

                  <p className="text-xs text-slate-300 leading-relaxed">{rev.comment}</p>

                  <div className="flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-slate-900 text-[11px]">
                    <div className="flex items-center gap-2 text-slate-400">
                      <strong className="text-cyan-400">{rev.driverName}</strong>
                      <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-slate-900 text-slate-400 border border-slate-800">
                        {rev.driverBadge}
                      </span>
                      {rev.vehicleReg && (
                        <span className="text-[10px] font-mono text-slate-500">[{rev.vehicleReg}]</span>
                      )}
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => handleHelpfulClick(rev.id, rev.helpfulCount)}
                        className="px-2.5 py-1 rounded-lg bg-slate-900 hover:bg-slate-800 text-slate-400 hover:text-white flex items-center gap-1 text-[11px] font-bold cursor-pointer transition-colors"
                      >
                        <ThumbsUp className="w-3 h-3 text-cyan-400" />
                        <span>Helpful ({helpfulVotes[rev.id] !== undefined ? helpfulVotes[rev.id] : rev.helpfulCount})</span>
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
