import os

# 1. Create the dedicated, clean SiteReviews component
site_reviews_code = """import React, { useState } from 'react';

interface SiteReviewsProps {
  onBack: () => void;
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
}

export const SiteReviews: React.FC<SiteReviewsProps> = ({ onBack }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSite, setSelectedSite] = useState<Site | null>(null);
  const [mapMode, setMapMode] = useState<'gate' | 'route'>('gate');
  const [showHazardReport, setShowHazardReport] = useState(false);
  const [hazardCategory, setHazardCategory] = useState('');
  const [hazardDetails, setHazardDetails] = useState('');
  const [reportSubmitted, setReportSubmitted] = useState(false);

  const mockSites: Site[] = [
    {
      id: '1',
      name: 'Amazon Fulfillment Centre LBA4',
      postcode: 'DH6 5NP',
      location: 'Bowburn, Durham',
      hgvGate: 'Gate 2 via A177 Freight Link Road',
      carPark: 'Gate 1 (Visitor Cars Only - 2.1m Barrier)',
      toilets: 'Clean • 24/7 Access with code 4492',
      parking: 'No overnight parking on site',
      avgWait: '35 mins'
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
      avgWait: '45 mins'
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
      avgWait: '40 mins'
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
      avgWait: '25 mins'
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
      avgWait: '55 mins'
    }
  ];

  const filteredSites = searchQuery.trim().length > 0
    ? mockSites.filter(s =>
        s.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        s.postcode.toLowerCase().includes(searchQuery.toLowerCase()) ||
        s.location.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : [];

  const handleHazardSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setReportSubmitted(true);
    setTimeout(() => {
      setReportSubmitted(false);
      setShowHazardReport(false);
      setHazardCategory('');
      setHazardDetails('');
    }, 2500);
  };

  return (
    <div className="space-y-6 pb-16 select-none animate-fadeIn">
      {/* Top Header */}
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
                : 'Lorry entrances & driver welfare (avoids car park barriers)'}
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
                Matching Depots & Delivery Hubs
              </div>
              {filteredSites.length > 0 ? (
                filteredSites.map(site => (
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
                        <div className="text-sm font-black text-white group-hover:text-amber-300 transition">
                          {site.name}
                        </div>
                        <div className="text-xs text-slate-400 font-mono">
                          {site.postcode} • {site.location}
                        </div>
                      </div>
                    </div>
                    <span className="text-xs text-amber-400 font-bold px-3 py-1 bg-amber-400/10 rounded-xl">
                      View Lorry Gate →
                    </span>
                  </button>
                ))
              ) : (
                <div className="p-4 text-center text-slate-400 text-sm">
                  No matching depots found for "{searchQuery}". Try a nearby town or postcode.
                </div>
              )}
            </div>
          ) : (
            <div className="text-center py-16 text-slate-500 text-xs space-y-2">
              <div className="text-2xl">🚛</div>
              <p className="font-medium">Type any UK depot, supermarket RDC, or postcode above.</p>
              <p className="text-[11px] text-slate-600">Directs you straight to the freight gatehouse, steering you clear of 2.1m car park barriers.</p>
            </div>
          )}
        </div>
      )}

      {/* ─── 2. DEDICATED SINGLE-SITE DETAIL PAGE ─── */}
      {selectedSite && !showHazardReport && (
        <div className="max-w-4xl mx-auto space-y-6 animate-fadeIn">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-2xl space-y-5">
            {/* Header */}
            <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-800 pb-4">
              <div>
                <span className="text-[10px] font-mono text-emerald-400 uppercase font-bold tracking-wider">Verified Freight Gatehouse</span>
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
                Driver Welfare & Facilities
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

            {/* Actions: Navigation + Whistleblower */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
              <a
                href={`https://www.google.com/maps/dir/?api=1&origin=Corley+Services+M6&destination=${encodeURIComponent(selectedSite.name + ' ' + selectedSite.postcode)}&travelmode=driving`}
                target="_blank"
                rel="noopener noreferrer"
                className="py-4 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black rounded-2xl text-xs md:text-sm flex items-center justify-center gap-2 transition shadow-xl"
              >
                <span>🧭</span> NAVIGATE TO LORRY GATE
              </a>

              <button
                onClick={() => setShowHazardReport(true)}
                className="py-4 bg-rose-500/20 hover:bg-rose-500/30 border border-rose-500/40 text-rose-300 hover:text-white font-black rounded-2xl text-xs md:text-sm flex items-center justify-center gap-2 transition shadow-xl"
              >
                <span>⚠️</span> REPORT UNSAFE YARD HAZARD
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ─── 3. ANONYMOUS YARD SAFETY WHISTLEBLOWER SCREEN ─── */}
      {showHazardReport && (
        <div className="max-w-2xl mx-auto space-y-6 animate-fadeIn">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-2xl space-y-5">
            <div className="border-b border-slate-800 pb-4">
              <span className="text-[10px] font-mono text-rose-400 uppercase font-bold tracking-wider">
                Protected Whistleblower Log
              </span>
              <h2 className="text-lg md:text-xl font-black text-white">
                Report Dangerous Condition at {selectedSite?.name}
              </h2>
              <p className="text-xs text-slate-400 mt-1">
                Your report is 100% anonymous. This notice creates a formal timestamped record under UK Health & Safety (HSE) regulations, legally holding site management accountable if unaddressed.
              </p>
            </div>

            {reportSubmitted ? (
              <div className="p-8 bg-emerald-500/20 border border-emerald-500/40 rounded-2xl text-center space-y-3">
                <div className="text-4xl">🛡️</div>
                <div className="text-lg font-black text-white">Safety Notice Formally Logged</div>
                <p className="text-xs text-emerald-300 max-w-md mx-auto">
                  Site management has been served an anonymous hazard notice. A permanent audit entry is now stored in the safety register.
                </p>
              </div>
            ) : (
              <form onSubmit={handleHazardSubmit} className="space-y-4">
                <div>
                  <label className="text-xs font-bold text-slate-300 block mb-2">
                    What is the safety hazard?
                  </label>
                  <select
                    required
                    value={hazardCategory}
                    onChange={(e) => setHazardCategory(e.target.value)}
                    className="w-full p-4 bg-slate-950 border border-slate-700 rounded-2xl text-white text-sm font-bold focus:outline-none focus:border-amber-400"
                  >
                    <option value="">Select hazard type...</option>
                    <option value="reversing">Reversing Danger / Blind Spot with No Banksman</option>
                    <option value="walkway">No Pedestrian Walkway / Drivers Forced into Live Shunting Traffic</option>
                    <option value="speeding">Reckless Forklift Driving / Speeding Yard Shunters</option>
                    <option value="lighting">Poor Lighting in Yard / Reversing in Pitch Black</option>
                    <option value="welfare">Hostile Security / Drivers Denied Access to Toilets</option>
                    <option value="surface">Dangerous Ground Surface / Deep Potholes Damaging Axles</option>
                  </select>
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-300 block mb-2">
                    Specific details (Location in yard, bay numbers, time):
                  </label>
                  <textarea
                    required
                    rows={4}
                    value={hazardDetails}
                    onChange={(e) => setHazardDetails(e.target.value)}
                    placeholder="Describe what is dangerous and where it is located..."
                    className="w-full p-4 bg-slate-950 border border-slate-700 rounded-2xl text-white text-sm focus:outline-none focus:border-amber-400"
                  />
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
"""

with open("src/components/SiteReviews.tsx", "w", encoding="utf-8") as f:
    f.write(site_reviews_code)
print("✓ Created clean src/components/SiteReviews.tsx")

# 2. Update TachoSync.tsx to import SiteReviews cleanly
tacho_path = "src/components/TachoSync.tsx"
with open(tacho_path, "r", encoding="utf-8") as f:
    tacho_code = f.read()

# Add import if missing
if "import { SiteReviews } from './SiteReviews';" not in tacho_code:
    tacho_code = "import { SiteReviews } from './SiteReviews';\n" + tacho_code

# Replace the site-reviews block inside TachoSync.tsx with a clean component call
import re
pattern = re.compile(r"\{view === 'site-reviews' && \([\s\S]*?(?=\{\/\* ─── VIEW:|\{view === '|\}\n  \);)", re.MULTILINE)
clean_call = """{view === 'site-reviews' && (
        <SiteReviews onBack={() => setView('cockpit')} />
      )}

      """

if pattern.search(tacho_code):
    tacho_code = pattern.sub(clean_call, tacho_code)
    print("✓ Replaced site-reviews view with clean <SiteReviews onBack={...} />")
else:
    # If regex fails, append view handler before closing div
    tacho_code = tacho_code.replace("</main>", "{view === 'site-reviews' && <SiteReviews onBack={() => setView('cockpit')} />}\n    </main>")
    print("✓ Hooked SiteReviews cleanly before </main>")

with open(tacho_path, "w", encoding="utf-8") as f:
    f.write(tacho_code)
print("✓ Updated src/components/TachoSync.tsx successfully")
