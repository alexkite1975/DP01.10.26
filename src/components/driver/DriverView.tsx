'use client';
import React, { useState } from 'react';
import {
  Search,
  MapPin,
  Truck,
  ShieldCheck,
  AlertTriangle,
  Volume2,
  Video,
  ChevronRight,
  Plus,
  SlidersHorizontal,
  Navigation,
  Compass,
  Sparkles,
  Lock,
  Layers,
  CheckCircle2,
  AlertCircle,
  ScanLine
} from 'lucide-react';
import { SiteRiskAssessment, DriverVehicleProfile, RiskLevel } from '../types';
import { calculateDistanceMiles } from '../services/googlePlaces';
import { tts } from '../services/ttsService';
import { generateNavUrl, NAV_APP_OPTIONS } from '../services/navigationService';
import { formatHeightBoth } from '../../utils/heightUtils';

interface DriverViewProps {
  sites: SiteRiskAssessment[];
  driverVehicle: DriverVehicleProfile;
  onSelectSite: (site: SiteRiskAssessment) => void;
  onOpenCreateModal: () => void;
  onOpenScanModal?: () => void;
  onOpenVehicleModal: () => void;
  onOpenVideoGuide: (site: SiteRiskAssessment) => void;
  onNavigateToSearch?: () => void;
  onNavigateToSitePlan?: (site: SiteRiskAssessment) => void;
}

export const DriverView: React.FC<DriverViewProps> = ({
  sites,
  driverVehicle,
  onSelectSite,
  onOpenCreateModal,
  onOpenScanModal,
  onOpenVehicleModal,
  onOpenVideoGuide,
  onNavigateToSearch,
  onNavigateToSitePlan
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [filterMode, setFilterMode] = useState<'ALL' | 'COMPATIBLE_ONLY' | 'HIGH_RISK' | 'NEAREST'>('ALL');

  // Simulated driver coordinates (e.g. Midlands M1 logistics corridor, 52.4200, -1.2500)
  const driverLat = 52.42;
  const driverLng = -1.25;

  const getRiskBadgeColor = (lvl: RiskLevel) => {
    switch (lvl) {
      case 'CRITICAL':
        return 'bg-rose-50 text-rose-700 border-rose-200';
      case 'HIGH':
        return 'bg-orange-50 text-orange-700 border-orange-200';
      case 'MEDIUM':
        return 'bg-amber-50 text-amber-800 border-amber-200';
      case 'LOW':
        return 'bg-emerald-50 text-emerald-700 border-emerald-200';
    }
  };

  const filteredSites = sites
    .map((site) => {
      const distance = calculateDistanceMiles(
        driverLat,
        driverLng,
        site.coordinates.lat,
        site.coordinates.lng
      );
      const isHeightOk = driverVehicle.heightMeters <= site.businessSection.vehicleConstraints.maxHeightMeters;
      const isWeightOk = driverVehicle.weightTonnes <= site.businessSection.vehicleConstraints.maxWeightTonnes;
      const isTailLiftOk = !site.businessSection.vehicleConstraints.tailLiftRequired || driverVehicle.hasTailLift;
      const isCompatible = isHeightOk && isWeightOk && isTailLiftOk;

      return {
        ...site,
        distance,
        isCompatible,
        isHeightOk,
        isWeightOk
      };
    })
    .filter((site) => {
      const matchQuery =
        site.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        site.address.toLowerCase().includes(searchQuery.toLowerCase()) ||
        site.businessName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (site.what3words && site.what3words.toLowerCase().includes(searchQuery.toLowerCase()));

      if (!matchQuery) return false;

      if (filterMode === 'COMPATIBLE_ONLY') return site.isCompatible;
      if (filterMode === 'HIGH_RISK') return site.overallRiskLevel === 'HIGH' || site.overallRiskLevel === 'CRITICAL';
      if (filterMode === 'NEAREST') return site.distance < 50;

      return true;
    })
    .sort((a, b) => (filterMode === 'NEAREST' ? a.distance - b.distance : 0));

  const handleQuickAudio = (e: React.MouseEvent, site: SiteRiskAssessment) => {
    e.stopPropagation();
    const brief = `${site.title}. Overall risk: ${site.overallRiskLevel}. Gate code: ${site.businessSection.gateSecurityCode}. Maximum vehicle clearance: ${site.businessSection.vehicleConstraints.maxHeightMeters} meters. Bay Reversing: ${site.businessSection.loadingBayDetails.reversingGuidance}`;
    tts.speak(brief, 1.1);
  };

  return (
    <div className="space-y-4">
      {/* Search Header Banner */}
      <div className="rounded-2xl border border-slate-200 bg-white p-4 sm:p-5 shadow-sm space-y-3">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-base sm:text-lg font-bold text-slate-900 flex items-center gap-2">
                <Compass className="h-5 w-5 text-blue-600" />
                Delivery Site Risk Directory
              </h1>
              <span className="rounded-full bg-blue-50 px-2 py-0.5 text-[11px] font-bold text-blue-700 border border-blue-200">
                Driver Design™
              </span>
            </div>
            <p className="text-xs text-slate-500">
              Assessed commercial logistics hubs, clearance limits & interactive yard plans
            </p>
          </div>

          <div className="flex items-center gap-2">
            {onOpenScanModal && (
              <button
                onClick={onOpenScanModal}
                className="flex items-center gap-1.5 rounded-xl border border-indigo-200 bg-indigo-50 hover:bg-indigo-100 px-3 py-1.5 text-xs font-bold text-indigo-700 shadow-2xs transition-all active:scale-95"
                title="Scan or upload existing risk assessment document (Paper RAMS / PDF)"
              >
                <ScanLine className="h-3.5 w-3.5 text-indigo-600" />
                <span>Scan RAMS</span>
                <span className="rounded bg-indigo-200 text-indigo-800 text-[9px] font-black px-1 py-0.2 uppercase">
                  AI
                </span>
              </button>
            )}

            <button
              onClick={onOpenCreateModal}
              className="flex items-center gap-1.5 rounded-xl bg-blue-600 hover:bg-blue-700 px-3 py-1.5 text-xs font-bold text-white shadow-xs transition-all active:scale-95"
            >
              <Plus className="h-3.5 w-3.5" />
              <span>Create Assessment</span>
            </button>
          </div>
        </div>

        {/* Search input field */}
        <div className="relative">
          <Search className="absolute left-3.5 top-3 h-4 w-4 text-slate-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Quick search assessed delivery sites by name, city, postcode or what3words..."
            className="w-full rounded-xl border border-slate-200 bg-slate-50 pl-10 pr-4 py-2.5 text-xs sm:text-sm font-medium text-slate-900 placeholder:text-slate-400 focus:border-blue-500 focus:bg-white focus:outline-none focus:ring-1 focus:ring-blue-500"
          />
        </div>

        {/* Filter Pills */}
        <div className="flex flex-wrap items-center justify-between gap-2 pt-1 border-t border-slate-100 text-xs">
          <div className="flex flex-wrap gap-1.5">
            {[
              { id: 'ALL', label: `All Sites (${sites.length})` },
              { id: 'COMPATIBLE_ONLY', label: 'Truck Compatible' },
              { id: 'HIGH_RISK', label: '🛑 High / Critical Risk' },
              { id: 'NEAREST', label: '⚡ Nearest (<50 mi)' }
            ].map((f) => (
              <button
                key={f.id}
                onClick={() => setFilterMode(f.id as any)}
                className={`rounded-lg px-2.5 py-1 font-semibold transition-all ${
                  filterMode === f.id
                    ? 'bg-blue-600 text-white shadow-sm'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                {f.label}
              </button>
            ))}
          </div>

          <div className="text-[11px] text-slate-500">
            Showing {filteredSites.length} of {sites.length} sites
          </div>
        </div>
      </div>

      {/* Sites Card Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filteredSites.length === 0 ? (
          <div className="col-span-full rounded-2xl border border-dashed border-slate-200 bg-white p-12 text-center text-slate-500">
            <MapPin className="mx-auto h-8 w-8 text-slate-300 mb-2" />
            <p className="font-bold text-slate-800">No matching delivery sites found</p>
            <p className="text-xs mt-1">Try relaxing filters or search a new location via Google Places.</p>
          </div>
        ) : (
          filteredSites.map((site) => {
            const annotationCount = site.businessSection.sitePlan?.annotations?.length || 6;

            return (
              <div
                key={site.id}
                onClick={() => onSelectSite(site)}
                className="group relative rounded-2xl border border-slate-200 bg-white p-4 sm:p-5 shadow-sm hover:border-blue-400 hover:shadow-md transition-all cursor-pointer space-y-3"
              >
                {/* Header Row: Title, Business & Risk Badge */}
                <div className="flex items-start justify-between gap-2">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-1.5 flex-wrap">
                      <h3 className="font-bold text-slate-900 text-sm sm:text-base group-hover:text-blue-600 transition-colors truncate">
                        {site.title}
                      </h3>
                      <span className="rounded bg-slate-100 px-1.5 py-0.2 text-[10px] font-mono text-slate-600">
                        v{site.version}.0
                      </span>
                    </div>
                    <p className="text-xs text-slate-500 truncate mt-0.5">{site.businessName}</p>
                  </div>

                  {/* Risk Badge */}
                  <span
                    className={`shrink-0 rounded-full border px-2.5 py-0.5 text-xs font-bold ${getRiskBadgeColor(
                      site.overallRiskLevel
                    )}`}
                  >
                    {site.overallRiskLevel} RISK
                  </span>
                </div>

                {/* Address & Distance */}
                <div className="space-y-1 text-xs text-slate-600">
                  <div className="flex items-start gap-1.5">
                    <MapPin className="h-3.5 w-3.5 text-blue-600 shrink-0 mt-0.5" />
                    <span className="line-clamp-1">{site.address}</span>
                  </div>

                  <div className="flex items-center justify-between text-[11px] text-slate-500 pt-1">
                    <span className="flex items-center gap-1 font-semibold text-slate-700">
                      <Navigation className="h-3 w-3 text-blue-600" />
                      {site.distance} miles away
                    </span>

                    {/* Gate code badge */}
                    <span className="flex items-center gap-1 font-mono font-bold text-slate-800 bg-slate-100 px-2 py-0.5 rounded border border-slate-200">
                      <Lock className="h-3 w-3 text-slate-500" />
                      Code: {site.businessSection.gateSecurityCode}
                    </span>
                  </div>
                </div>

                {/* Clearance Compatibility Bar */}
                <div className="flex items-center justify-between p-2 rounded-xl bg-slate-50 border border-slate-100 text-xs">
                  <div className="flex items-center gap-1.5">
                    {site.isCompatible ? (
                      <CheckCircle2 className="h-4 w-4 text-emerald-600" />
                    ) : (
                      <AlertCircle className="h-4 w-4 text-rose-600" />
                    )}
                    <span className="font-semibold text-slate-700">
                      {site.isCompatible ? 'Vehicle Clearance OK' : 'Height / Weight Alert'}
                    </span>
                  </div>

                  <span className="text-[11px] text-slate-500 font-mono">
                    Max: {formatHeightBoth(site.businessSection.vehicleConstraints.maxHeightMeters)} / {site.businessSection.vehicleConstraints.maxWeightTonnes}T
                  </span>
                </div>

                {/* Bottom Action Buttons */}
                <div className="flex items-center justify-between pt-2 border-t border-slate-100">
                  <div className="flex items-center gap-1.5">
                    {/* Turn-by-Turn Navigation Button */}
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        const navUrl = generateNavUrl(
                          site.coordinates.lat,
                          site.coordinates.lng,
                          driverVehicle.preferredNavApp || 'GOOGLE_MAPS',
                          site.address
                        );
                        window.open(navUrl, '_blank');
                      }}
                      className="flex items-center gap-1 rounded-lg border border-blue-200 bg-blue-50 hover:bg-blue-100 px-2.5 py-1 text-xs font-semibold text-blue-700 transition-colors"
                      title={`Open navigation in ${NAV_APP_OPTIONS[driverVehicle.preferredNavApp || 'GOOGLE_MAPS'].name}`}
                    >
                      <Navigation className="h-3.5 w-3.5 text-blue-600" />
                      <span>{NAV_APP_OPTIONS[driverVehicle.preferredNavApp || 'GOOGLE_MAPS'].shortLabel}</span>
                    </button>

                    {/* Audio Narration Button */}
                    <button
                      onClick={(e) => handleQuickAudio(e, site)}
                      className="flex items-center gap-1 rounded-lg border border-slate-200 bg-slate-50 hover:bg-slate-100 px-2.5 py-1 text-xs font-semibold text-slate-700 transition-colors"
                      title="Listen to quick audio risk briefing"
                    >
                      <Volume2 className="h-3.5 w-3.5 text-blue-600" />
                      <span>Audio</span>
                    </button>

                    {/* Interactive Site Plan Button */}
                    {onNavigateToSitePlan && (
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          onNavigateToSitePlan(site);
                        }}
                        className="flex items-center gap-1 rounded-lg border border-indigo-200 bg-indigo-50 hover:bg-indigo-100 px-2.5 py-1 text-xs font-semibold text-indigo-700 transition-colors"
                        title="View interactive yard plan and annotated points"
                      >
                        <Layers className="h-3.5 w-3.5 text-indigo-600" />
                        <span className="hidden sm:inline">Yard Plan ({annotationCount})</span>
                        <span className="sm:hidden">CAD</span>
                      </button>
                    )}
                  </div>

                  <span className="flex items-center gap-0.5 text-xs font-bold text-blue-600 group-hover:translate-x-0.5 transition-transform">
                    <span>Inspect</span>
                    <ChevronRight className="h-4 w-4" />
                  </span>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};
