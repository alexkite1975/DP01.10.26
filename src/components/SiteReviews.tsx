import React, { useState } from 'react';

interface SiteReviewsProps {
  onBack: () => void;
}

interface Hazard {
  id: string;
  category: string;
  details: string;
  status: 'amber_notice' | 'proof_submitted' | 'recurring_escalated' | 'resolved';
  reportedAt: string;
  hoursRemaining?: number;
  reportCount: number;
  siteProofNote?: string;
  escalationChoice?: string;
}

interface Site {
  id: string;
  name: string;
  postcode: string;
  location: string;
  hgvGate: string;
  carPark: string;
  toilets: string;
  parking: string;
  avgWait: string;
  hazards: Hazard[];
}

export const SiteReviews: React.FC<SiteReviewsProps> = ({ onBack }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSite, setSelectedSite] = useState<Site | null>(null);
  const [mapMode, setMapMode] = useState<'gate' | 'route'>('gate');
  const [showHazardReport, setShowHazardReport] = useState(false);
  const [hazardCategory, setHazardCategory] = useState('');
  const [hazardDetails, setHazardDetails] = useState('');
  const [reportSubmitted, setReportSubmitted] = useState(false);
  const [activeEscalation, setActiveEscalation] = useState<{ [hazardId: string]: string }>({});
  const [verificationFeedback, setVerificationFeedback] = useState<{ [hazardId: string]: string }>({});

  const [sites, setSites] = useState<Site[]>([
    {
      id: '1',
      name: 'Amazon Fulfillment Centre LBA4',
      postcode: 'DH6 5NP',
      location: 'Bowburn, Durham',
      hgvGate: 'Gate 2 via A177 Freight Link Road',
      carPark: 'Gate 1 (Visitor Cars Only - 2.1m Barrier)',
      toilets: 'Clean • 24/7 Access with code 4492',
      parking: 'No overnight parking on site',
      avgWait: '35 mins',
      hazards: [
        {
          id: 'hz-1',
          category: 'Reversing Danger / Blind Spot with No Banksman',
          details: 'Blind corner when reversing into Bay 14 next to the trash compactor. Shunter nearly clipped cab.',
          status: 'amber_notice',
          reportedAt: 'Yesterday, 14:20',
          hoursRemaining: 54,
          reportCount: 1
        }
      ]
    },
    {
      id: '2',
      name: 'DHL Supply Chain Rugby (DIRFT 11)',
      postcode: 'NN6 7GZ',
      location: 'Crick, Northamptonshire',
      hgvGate: 'DIRFT South Gatehouse via A428 / A5',
      carPark: 'Main Office Gate (Strict 2.1m Barrier)',
      toilets: 'Clean • Showers available in driver hub',
      parking: 'Overnight bays available (book via security)',
      avgWait: '45 mins',
      hazards: [
        {
          id: 'hz-2',
          category: 'Deep Pothole Damaging Steer Axles',
          details: 'Severe 15cm pothole on the inbound weighbridge lane right by the security hut.',
          status: 'proof_submitted',
          reportedAt: '3 days ago',
          reportCount: 2,
          siteProofNote: 'Resurfacing contractor patched the weighbridge approach tarmac on 05 Oct. Confirmed safe.'
        }
      ]
    },
    {
      id: '3',
      name: 'Magna Park Logistics Campus',
      postcode: 'LE17 4XN',
      location: 'Lutterworth',
      hgvGate: 'Hunter Boulevard Commercial Freight Gate',
      carPark: 'Management Car Park (No HGVs)',
      toilets: 'Clean • Driver amenity block',
      parking: 'Truck stop adjacent at Magna Park north',
      avgWait: '40 mins',
      hazards: [
        {
          id: 'hz-3',
          category: 'Drivers Denied Toilet Access / Refused Welfare',
          details: 'Security locked out drivers between 19:00 and 06:00. Explicit breach of HSE Workplace Reg 20.',
          status: 'recurring_escalated',
          reportedAt: '12 days ago',
          reportCount: 4
        }
      ]
    },
    {
      id: '4',
      name: 'DPD Superhub 4 Hinckley',
      postcode: 'LE10 3BQ',
      location: 'Hinckley Commercial Park',
      hgvGate: 'Logistics Way Commercial Gate 3',
      carPark: 'Staff Car Park (Barrier Guarded)',
      toilets: 'Clean • Security cabin access',
      parking: 'Strictly no overnight parking',
      avgWait: '25 mins',
      hazards: []
    },
    {
      id: '5',
      name: 'Tesco Grocery Distribution Centre',
      postcode: 'NN11 8QL',
      location: 'Daventry RDC',
      hgvGate: 'North Gate HGV Inbound via A361',
      carPark: 'Visitor Reception (No HGVs)',
      toilets: 'Clean • Driver waiting room',
      parking: 'Bays allocated on gate check-in',
      avgWait: '55 mins',
      hazards: []
    }
  ]);

  const filteredSites = searchQuery.trim().length > 0
    ? sites.filter(s =>
        s.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        s.postcode.toLowerCase().includes(searchQuery.toLowerCase()) ||
        s.location.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : [];

  const handleHazardSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedSite || !hazardCategory) return;

    const newHazard: Hazard = {
      id: 'hz-' + Date.now(),
      category: hazardCategory,
      details: hazardDetails,
      status: 'amber_notice',
      reportedAt: 'Just now',
      hoursRemaining: 72,
      reportCount: 1
    };

    const updatedSite = {
      ...selectedSite,
      hazards: [newHazard, ...selectedSite.hazards]
    };

    setSites(sites.map(s => s.id === updatedSite.id ? updatedSite : s));
    setSelectedSite(updatedSite);
    setReportSubmitted(true);

    setTimeout(() => {
      setReportSubmitted(false);
      setShowHazardReport(false);
      setHazardCategory('');
      setHazardDetails('');
    }, 2200);
  };

  const verifyFix = (hazardId: string, confirmedSafe: boolean) => {
    if (!selectedSite) return;
    if (confirmedSafe) {
      setVerificationFeedback({ ...verificationFeedback, [hazardId]: 'resolved' });
      const updatedHazards = selectedSite.hazards.map(h => 
        h.id === hazardId ? { ...h, status: 'resolved' as const } : h
      );
      const updatedSite = { ...selectedSite, hazards: updatedHazards };
      setSites(sites.map(s => s.id === updatedSite.id ? updatedSite : s));
      setSelectedSite(updatedSite);
    } else {
      setVerificationFeedback({ ...verificationFeedback, [hazardId]: 'escalated' });
      const updatedHazards = selectedSite.hazards.map(h => 
        h.id === hazardId ? { ...h, status: 'recurring_escalated' as const, reportCount: h.reportCount + 1 } : h
      );
      const updatedSite = { ...selectedSite, hazards: updatedHazards };
      setSites(sites.map(s => s.id === updatedSite.id ? updatedSite : s));
      setSelectedSite(updatedSite);
    }
  };

  const chooseEscalation = (hazardId: string, choiceTitle: string) => {
    setActiveEscalation({ ...activeEscalation, [hazardId]: choiceTitle });
  };

  return (
    <div className="space-y-6 pb-20 select-none animate-fadeIn">
      {/* Header Bar */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-4 shadow-xl flex items-center justify-between">
        <div className="flex items-center gap-3">
          <button
            onClick={() => {
              if (showHazardReport) {
                setShowHazardReport(false);
              } else if (selectedSite) {
                setSelectedSite(null);
              } else {
                onBack();
              }
            }}
            className="w-11 h-11 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-2xl font-black flex items-center justify-center transition text-xl shadow"
            title="Go Back"
          >
            ←
          </button>
          <div>
            <h1 className="text-lg md:text-xl font-black text-white flex items-center gap-2">
              <span>🏢</span> Depot Gates & Site Safety
            </h1>
            <p className="text-xs text-slate-400">
              {showHazardReport 
                ? 'Anonymous Yard Safety Whistleblower'
                : selectedSite 
                ? selectedSite.name 
                : 'Direct to freight gates • Holding dangerous yards legally accountable'}
            </p>
          </div>
        </div>
        <div className="hidden sm:flex items-center gap-2 bg-emerald-500/10 border border-emerald-500/20 px-3 py-1.5 rounded-xl">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
          <span className="text-xs font-bold text-emerald-400">📍 Cab GPS: Corley Services M6</span>
        </div>
      </div>

      {/* ─── 1. TALL UNCLUTTERED SEARCH BAR (ZERO IDLE CLUTTER) ─── */}
      {!selectedSite && !showHazardReport && (
        <div className="max-w-2xl mx-auto py-10 space-y-4">
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-6 flex items-center pointer-events-none text-2xl">
              🔍
            </div>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search depot, customer or postcode (e.g. Amazon, DHL, NN6)..."
              className="w-full pl-16 pr-12 py-5 bg-slate-900/90 border-2 border-slate-700 hover:border-amber-400 focus:border-amber-400 rounded-3xl text-white text-base md:text-lg font-bold placeholder-slate-500 shadow-2xl focus:outline-none transition-all"
              autoFocus
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute inset-y-0 right-0 pr-6 flex items-center text-slate-400 hover:text-white text-xl"
              >
                ✕
              </button>
            )}
          </div>

          {/* Dynamic As-You-Type Recommendations */}
          {searchQuery.trim().length > 0 ? (
            <div className="bg-slate-900 border border-slate-800 rounded-3xl p-3 shadow-2xl space-y-2 animate-fadeIn">
              <div className="px-4 py-2 text-[11px] font-mono text-slate-500 uppercase font-bold tracking-wider">
                Matching Delivery Hubs & Depots
              </div>
              {filteredSites.length > 0 ? (
                filteredSites.map(site => {
                  const activeHazardsCount = site.hazards.filter(h => h.status !== 'resolved').length;
                  return (
                    <button
                      key={site.id}
                      onClick={() => setSelectedSite(site)}
                      className="w-full text-left p-4 rounded-2xl bg-slate-950/60 hover:bg-slate-800/80 border border-slate-800/60 hover:border-amber-400/50 transition flex items-center justify-between group"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-amber-400/10 border border-amber-400/20 text-amber-400 flex items-center justify-center text-lg group-hover:scale-105 transition">
                          🏢
                        </div>
                        <div>
                          <div className="text-sm font-black text-white group-hover:text-amber-300 transition flex items-center gap-2">
                            <span>{site.name}</span>
                            {activeHazardsCount > 0 ? (
                              <span className="text-[10px] bg-rose-500/20 text-rose-300 border border-rose-500/30 px-2 py-0.5 rounded-full font-mono">
                                ⚠️ {activeHazardsCount} Safety Issue{activeHazardsCount > 1 ? 's' : ''}
                              </span>
                            ) : (
                              <span className="text-[10px] bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 px-2 py-0.5 rounded-full font-mono">
                                ✓ Yard Safe
                              </span>
                            )}
                          </div>
                          <div className="text-xs text-slate-400 font-mono">
                            {site.postcode} • {site.location}
                          </div>
                        </div>
                      </div>
                      <span className="text-xs text-amber-400 font-bold px-3 py-1 bg-amber-400/10 rounded-xl">
                        View Gate Radar →
                      </span>
                    </button>
                  );
                })
              ) : (
                <div className="p-4 text-center text-slate-400 text-sm">
                  No matching depots found for "{searchQuery}". Try a nearby town or postcode.
                </div>
              )}
            </div>
          ) : (
            <div className="text-center py-16 text-slate-500 text-xs space-y-2">
              <div className="text-3xl">🚛</div>
              <p className="font-bold text-slate-400 text-sm">Type any UK depot, supermarket RDC, or postcode above.</p>
              <p className="text-[11px] text-slate-500 max-w-md mx-auto">
                Directs you straight to the freight gatehouse (avoiding 2.1m car park barriers) and shows real-time safety notices logged by fellow drivers.
              </p>
            </div>
          )}
        </div>
      )}

      {/* ─── 2. DEDICATED SINGLE-SITE DETAIL PAGE ─── */}
      {selectedSite && !showHazardReport && (
        <div className="max-w-4xl mx-auto space-y-6 animate-fadeIn">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-2xl space-y-6">
            {/* Header */}
            <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-800 pb-4">
              <div>
                <span className="text-[10px] font-mono text-emerald-400 uppercase font-bold tracking-wider">
                  Verified Commercial Freight Hub
                </span>
                <h2 className="text-xl font-black text-white">{selectedSite.name}</h2>
                <p className="text-xs text-slate-400 font-mono">{selectedSite.postcode} • {selectedSite.location}</p>
              </div>

              {/* Radar Dual Toggle */}
              <div className="flex bg-slate-950 p-1 rounded-2xl border border-slate-800">
                <button
                  onClick={() => setMapMode('gate')}
                  className={`px-4 py-2 rounded-xl text-xs font-black transition ${mapMode === 'gate' ? 'bg-amber-400 text-slate-950 shadow-md' : 'text-slate-400 hover:text-white'}`}
                >
                  🏢 LORRY GATE MAP
                </button>
                <button
                  onClick={() => setMapMode('route')}
                  className={`px-4 py-2 rounded-xl text-xs font-black transition ${mapMode === 'route' ? 'bg-emerald-400 text-slate-950 shadow-md' : 'text-slate-400 hover:text-white'}`}
                >
                  🛣️ ROUTE FROM CAB
                </button>
              </div>
            </div>

            {/* Entrance Gate Warnings */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-4 bg-emerald-500/10 border border-emerald-500/30 rounded-2xl">
                <div className="flex items-center gap-2 text-emerald-400 font-black text-xs uppercase mb-1">
                  <span>🟢</span> Official Lorry Entrance
                </div>
                <div className="text-sm font-bold text-white mb-1">{selectedSite.hgvGate}</div>
                <div className="text-[11px] text-emerald-300">Dedicated freight gatehouse, weighbridge & security check-in.</div>
              </div>

              <div className="p-4 bg-rose-500/10 border border-rose-500/30 rounded-2xl">
                <div className="flex items-center gap-2 text-rose-400 font-black text-xs uppercase mb-1">
                  <span>⛔</span> Visitor Car Park (NO HGVs)
                </div>
                <div className="text-sm font-bold text-white mb-1">{selectedSite.carPark}</div>
                <div className="text-[11px] text-rose-300">WARNING: 2.1m height barrier. Severe trailer damage risk.</div>
              </div>
            </div>

            {/* Driver Welfare Box */}
            <div className="bg-slate-950 border border-slate-800 p-4 rounded-2xl space-y-3">
              <div className="text-xs font-mono text-amber-400 font-bold uppercase tracking-wider">
                Driver Welfare & Amenities
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                <div className="p-3 bg-slate-900 rounded-xl border border-slate-800">
                  <span className="text-slate-400 block mb-1">🚻 Driver Toilets</span>
                  <span className="font-bold text-white">{selectedSite.toilets}</span>
                </div>
                <div className="p-3 bg-slate-900 rounded-xl border border-slate-800">
                  <span className="text-slate-400 block mb-1">🅿️ Overnight Parking</span>
                  <span className="font-bold text-white">{selectedSite.parking}</span>
                </div>
                <div className="p-3 bg-slate-900 rounded-xl border border-slate-800">
                  <span className="text-slate-400 block mb-1">⏳ Average Wait</span>
                  <span className="font-bold text-emerald-400">{selectedSite.avgWait}</span>
                </div>
              </div>
            </div>

            {/* ─── LIVE YARD SAFETY REGISTER & HAZARD LIFECYCLE ─── */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="text-xs font-mono text-slate-400 font-bold uppercase tracking-wider flex items-center gap-2">
                  <span>🛡️</span> Live Yard Safety & Whistleblower Register
                </div>
                <button
                  onClick={() => setShowHazardReport(true)}
                  className="px-3 py-1.5 bg-rose-500/20 hover:bg-rose-500/30 border border-rose-500/40 text-rose-300 rounded-xl text-xs font-bold transition flex items-center gap-1.5"
                >
                  <span>⚠️</span> Log New Hazard (Anonymous)
                </button>
              </div>

              {selectedSite.hazards.length === 0 ? (
                <div className="p-4 bg-emerald-500/10 border border-emerald-500/20 rounded-2xl text-center text-xs text-emerald-300 font-bold">
                  ✓ No active safety hazards reported at this depot. Yard operating normally.
                </div>
              ) : (
                <div className="space-y-3">
                  {selectedSite.hazards.map(hazard => (
                    <div 
                      key={hazard.id} 
                      className="p-4 rounded-2xl border space-y-3 bg-slate-950 border-slate-800"
                    >
                      {/* Hazard Status Badges */}
                      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-800/80 pb-2.5">
                        <div className="flex items-center gap-2">
                          {hazard.status === 'amber_notice' && (
                            <span className="px-2.5 py-1 bg-amber-500/20 border border-amber-500/40 text-amber-300 rounded-full text-[11px] font-mono font-bold flex items-center gap-1">
                              <span>⏳</span> STAGE 1: AMBER NOTICE ({hazard.hoursRemaining}h to rectify)
                            </span>
                          )}
                          {hazard.status === 'proof_submitted' && (
                            <span className="px-2.5 py-1 bg-blue-500/20 border border-blue-500/40 text-blue-300 rounded-full text-[11px] font-mono font-bold flex items-center gap-1">
                              <span>📸</span> STAGE 2: SITE CLAIMED FIX • AWAITING DRIVER VERIFICATION
                            </span>
                          )}
                          {hazard.status === 'recurring_escalated' && (
                            <span className="px-2.5 py-1 bg-rose-500/20 border border-rose-500/40 text-rose-300 rounded-full text-[11px] font-mono font-bold flex items-center gap-1 animate-pulse">
                              <span>🚨</span> STAGE 4: SYSTEMIC HAZARD ({hazard.reportCount} Verified Reports)
                            </span>
                          )}
                          {hazard.status === 'resolved' && (
                            <span className="px-2.5 py-1 bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 rounded-full text-[11px] font-mono font-bold flex items-center gap-1">
                              <span>✓</span> RESOLVED & VERIFIED SAFE BY DRIVERS
                            </span>
                          )}
                        </div>
                        <span className="text-[11px] text-slate-500 font-mono">Reported {hazard.reportedAt}</span>
                      </div>

                      {/* Details */}
                      <div>
                        <div className="text-sm font-bold text-white">{hazard.category}</div>
                        <p className="text-xs text-slate-300 mt-1">{hazard.details}</p>
                      </div>

                      {/* Stage 2 Proof Note from Site */}
                      {hazard.siteProofNote && (
                        <div className="p-3 bg-blue-500/10 border border-blue-500/30 rounded-xl text-xs space-y-1">
                          <div className="font-bold text-blue-300 flex items-center gap-1.5">
                            <span>🏢</span> Site Management Response & Proof of Repair:
                          </div>
                          <p className="text-slate-200">{hazard.siteProofNote}</p>
                        </div>
                      )}

                      {/* Visiting Driver Verification Actions (Stage 2) */}
                      {hazard.status === 'proof_submitted' && (
                        <div className="pt-2 border-t border-slate-800/80 flex flex-wrap items-center justify-between gap-3">
                          <div className="text-xs text-slate-400">
                            Visiting this depot right now? Confirm if this hazard has actually been repaired:
                          </div>
                          <div className="flex gap-2">
                            <button
                              onClick={() => verifyFix(hazard.id, true)}
                              className="px-4 py-2 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black rounded-xl text-xs transition"
                            >
                              ✓ CONFIRM RESOLVED
                            </button>
                            <button
                              onClick={() => verifyFix(hazard.id, false)}
                              className="px-4 py-2 bg-rose-500/20 hover:bg-rose-500/30 border border-rose-500/40 text-rose-300 font-bold rounded-xl text-xs transition"
                            >
                              ✕ STILL DANGEROUS
                            </button>
                          </div>
                        </div>
                      )}

                      {/* Escalation Ladder (Stage 4) */}
                      {hazard.status === 'recurring_escalated' && (
                        <div className="pt-3 border-t border-slate-800 space-y-3">
                          <div className="text-xs text-rose-300 font-bold">
                            ⚠️ This site has repeatedly failed to rectify this hazard. Choose how you want to escalate:
                          </div>
                          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                            <button
                              onClick={() => chooseEscalation(hazard.id, 'Cab Warning Broadcasted')}
                              className={`p-2.5 rounded-xl text-left border text-xs transition ${
                                activeEscalation[hazard.id] === 'Cab Warning Broadcasted'
                                  ? 'bg-amber-400 text-slate-950 font-black border-amber-300'
                                  : 'bg-slate-900 border-slate-800 text-slate-300 hover:border-amber-400/50'
                              }`}
                            >
                              <div className="font-bold">📢 1. Cab Map Warning</div>
                              <div className="text-[10px] opacity-80 mt-0.5">Pins hazard on all inbound drivers' approach radar.</div>
                            </button>

                            <button
                              onClick={() => chooseEscalation(hazard.id, 'Safety Rep Dossier Queued')}
                              className={`p-2.5 rounded-xl text-left border text-xs transition ${
                                activeEscalation[hazard.id] === 'Safety Rep Dossier Queued'
                                  ? 'bg-amber-400 text-slate-950 font-black border-amber-300'
                                  : 'bg-slate-900 border-slate-800 text-slate-300 hover:border-amber-400/50'
                              }`}
                            >
                              <div className="font-bold">🛡️ 2. Union Safety Dossier</div>
                              <div className="text-[10px] opacity-80 mt-0.5">Alerts driver safety reps to initiate haulier dialogue.</div>
                            </button>

                            <button
                              onClick={() => chooseEscalation(hazard.id, 'HSE RIDDOR Pack Generated')}
                              className={`p-2.5 rounded-xl text-left border text-xs transition ${
                                activeEscalation[hazard.id] === 'HSE RIDDOR Pack Generated'
                                  ? 'bg-amber-400 text-slate-950 font-black border-amber-300'
                                  : 'bg-slate-900 border-slate-800 text-slate-300 hover:border-amber-400/50'
                              }`}
                            >
                              <div className="font-bold">⚖️ 3. Formal HSE Pack</div>
                              <div className="text-[10px] opacity-80 mt-0.5">Compiles legal PDF under HSWA 1974 s.3 for the HSE inspector.</div>
                            </button>
                          </div>
                          {activeEscalation[hazard.id] && (
                            <div className="p-2.5 bg-emerald-500/10 border border-emerald-500/30 rounded-xl text-xs text-emerald-300 font-bold flex items-center gap-2">
                              <span>✓</span> Action Confirmed: {activeEscalation[hazard.id]}. Permanent audit entry logged.
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Direct Navigation Action */}
            <div className="pt-2">
              <a
                href={`https://www.google.com/maps/dir/?api=1&origin=Corley+Services+M6&destination=${encodeURIComponent(selectedSite.name + ' ' + selectedSite.postcode)}&travelmode=driving`}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full py-4 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black rounded-2xl text-sm flex items-center justify-center gap-2 transition shadow-xl"
              >
                <span>🧭</span> NAVIGATE DIRECT TO FREIGHT GATEHOUSE
              </a>
            </div>
          </div>
        </div>
      )}

      {/* ─── 3. ANONYMOUS YARD SAFETY WHISTLEBLOWER SCREEN ─── */}
      {showHazardReport && (
        <div className="max-w-2xl mx-auto space-y-6 animate-fadeIn">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-2xl space-y-5">
            <div className="border-b border-slate-800 pb-4">
              <div className="flex items-center gap-2 text-rose-400 font-mono text-[10px] font-bold uppercase tracking-wider mb-1">
                <span>🛡️</span> Protected Whistleblower • Anti-Spam GPS Verified
              </div>
              <h2 className="text-lg md:text-xl font-black text-white">
                Log Safety Hazard at {selectedSite?.name}
              </h2>
              <p className="text-xs text-slate-400 mt-1">
                Your report is 100% anonymous. This notice triggers a formal 72-hour notice under UK Health & Safety (HSE) regulations, legally holding site management accountable if unaddressed.
              </p>
            </div>

            {reportSubmitted ? (
              <div className="p-8 bg-emerald-500/20 border border-emerald-500/40 rounded-2xl text-center space-y-3">
                <div className="text-4xl">🛡️</div>
                <div className="text-lg font-black text-white">Official Safety Notice Logged</div>
                <p className="text-xs text-emerald-300 max-w-md mx-auto">
                  Site management has been served a 72-hour Stage 1 Advisory Notice. A permanent legal audit entry is now stored in the safety register.
                </p>
              </div>
            ) : (
              <form onSubmit={handleHazardSubmit} className="space-y-4">
                <div>
                  <label className="text-xs font-bold text-slate-300 block mb-2">
                    What is the safety hazard? (HSE Standardized Category)
                  </label>
                  <select
                    required
                    value={hazardCategory}
                    onChange={(e) => setHazardCategory(e.target.value)}
                    className="w-full p-4 bg-slate-950 border border-slate-700 rounded-2xl text-white text-sm font-bold focus:outline-none focus:border-amber-400"
                  >
                    <option value="">Select hazard type...</option>
                    <option value="Reversing Danger / Blind Spot with No Banksman">Reversing Danger / Blind Spot with No Banksman</option>
                    <option value="No Pedestrian Walkway / Drivers Forced into Live Traffic">No Pedestrian Walkway / Drivers Forced into Live Traffic</option>
                    <option value="Reckless Forklift Driving / Speeding Yard Shunters">Reckless Forklift Driving / Speeding Yard Shunters</option>
                    <option value="Poor Lighting in Yard / Reversing in Pitch Black">Poor Lighting in Yard / Reversing in Pitch Black</option>
                    <option value="Drivers Denied Toilet Access / Refused Welfare">Drivers Denied Toilet Access / Refused Welfare (HSE Reg 20)</option>
                    <option value="Deep Potholes Damaging Steer Axles / Dangerous Surface">Deep Potholes Damaging Steer Axles / Dangerous Surface</option>
                  </select>
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-300 block mb-2">
                    Specific details (Location in yard, bay numbers, times):
                  </label>
                  <textarea
                    required
                    rows={4}
                    value={hazardDetails}
                    onChange={(e) => setHazardDetails(e.target.value)}
                    placeholder="Describe the exact location in the yard and what makes it dangerous..."
                    className="w-full p-4 bg-slate-950 border border-slate-700 rounded-2xl text-white text-sm focus:outline-none focus:border-amber-400"
                  />
                </div>

                <div className="p-3 bg-slate-950 border border-slate-800 rounded-xl text-[11px] text-slate-400 flex items-center gap-2">
                  <span>🔒</span>
                  <span>Anti-Spam Verified: Your cab GPS places you on-site. Your name and company remain completely anonymous.</span>
                </div>

                <div className="pt-2 flex gap-3">
                  <button
                    type="button"
                    onClick={() => setShowHazardReport(false)}
                    className="flex-1 py-4 bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold rounded-2xl text-xs transition"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="flex-1 py-4 bg-rose-500 hover:bg-rose-400 text-slate-950 font-black rounded-2xl text-xs transition shadow-xl"
                  >
                    SUBMIT ANONYMOUS NOTICE
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
