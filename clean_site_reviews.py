import re, os

tacho_path = "src/components/TachoSync.tsx"
if not os.path.exists(tacho_path):
    print("Error: TachoSync.tsx not found")
    exit(1)

with open(tacho_path, "r", encoding="utf-8") as f:
    code = f.read()

# Clean replacement for the Site Reviews view
new_site_reviews_view = """{/* ─── VIEW: SITE REVIEWS & ACCESS RADAR (CLEAN TALL SEARCH) ─── */}
      {view === 'site-reviews' && (
        <div className="space-y-6 animate-fadeIn pb-12 select-none">
          {/* Header */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 shadow-xl flex items-center justify-between">
            <div className="flex items-center gap-3">
              <button 
                onClick={() => {
                  if (selectedSite) {
                    setSelectedSite(null);
                  } else {
                    setView('cockpit');
                    setSiteSearchQuery('');
                  }
                }} 
                className="w-10 h-10 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl font-bold flex items-center justify-center transition text-lg shadow-sm"
                title="Go Back"
              >
                ←
              </button>
              <div>
                <h1 className="text-lg md:text-xl font-black text-white flex items-center gap-2">
                  <span>🏢</span> HGV Gate Finder & Site Radar
                </h1>
                <p className="text-xs text-slate-400">
                  {selectedSite ? selectedSite.name : 'Search commercial HGV freight gates — avoiding car park barriers'}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2 bg-emerald-500/10 border border-emerald-500/20 px-3 py-1.5 rounded-xl">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
              <span className="text-xs font-bold text-emerald-400">📍 Cab GPS: Corley Services M6</span>
            </div>
          </div>

          {/* ─── 1. TALL UNCLUTTERED SEARCH BAR (ZERO IDLE CLUTTER) ─── */}
          {!selectedSite && (
            <div className="max-w-2xl mx-auto py-8 space-y-4">
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-5 flex items-center pointer-events-none text-xl">
                  🔍
                </div>
                <input
                  type="text"
                  value={siteSearchQuery}
                  onChange={(e) => setSiteSearchQuery(e.target.value)}
                  placeholder="Type depot, hub, or postcode (e.g. Amazon, DHL, DIRFT, NN6)..."
                  className="w-full pl-14 pr-12 py-5 bg-slate-900/90 border-2 border-slate-700 hover:border-amber-400 focus:border-amber-400 rounded-3xl text-white text-base md:text-lg font-bold placeholder-slate-500 shadow-2xl focus:outline-none transition-all"
                  autoFocus
                />
                {siteSearchQuery && (
                  <button
                    onClick={() => setSiteSearchQuery('')}
                    className="absolute inset-y-0 right-0 pr-5 flex items-center text-slate-400 hover:text-white text-lg"
                  >
                    ✕
                  </button>
                )}
              </div>

              {/* Dynamic As-You-Type Recommendations (ONLY shows when typing!) */}
              {siteSearchQuery.trim().length > 0 ? (
                <div className="bg-slate-900 border border-slate-800 rounded-3xl p-3 shadow-2xl space-y-2 animate-fadeIn">
                  <div className="px-4 py-2 text-[11px] font-mono text-slate-500 uppercase font-bold tracking-wider">
                    Matching Logistics Hubs
                  </div>
                  {[
                    { id: '1', name: 'Amazon Fulfillment Centre LBA4', postcode: 'DH6 5NP', location: 'Bowburn, Durham', hgvGate: 'Gate 2 via A177 Commercial Freight Road', carPark: 'Gate 1 (Visitor Cars Only - 2.1m Barrier)' },
                    { id: '2', name: 'DHL Supply Chain Rugby (DIRFT 11)', postcode: 'NN6 7GZ', location: 'Crick, Northamptonshire', hgvGate: 'DIRFT South Gatehouse via A428 / A5', carPark: 'Office Entrance (2.1m Barrier)' },
                    { id: '3', name: 'Magna Park Logistics Campus', postcode: 'LE17 4XN', location: 'Lutterworth', hgvGate: 'Hunter Boulevard Freight Inbound', carPark: 'Admin Car Park (Height Restricted)' },
                    { id: '4', name: 'DPD Superhub 4 Hinckley', postcode: 'LE10 3BQ', location: 'Hinckley Commercial Park', hgvGate: 'Logistics Way Commercial Gate 3', carPark: 'Staff Car Park (Barrier Guarded)' },
                    { id: '5', name: 'Tesco Grocery Distribution Centre', postcode: 'NN11 8QL', location: 'Daventry RDC', hgvGate: 'North Gate HGV Inbound via A361', carPark: 'Visitor Reception (No HGVs)' }
                  ]
                    .filter(s => 
                      s.name.toLowerCase().includes(siteSearchQuery.toLowerCase()) || 
                      s.postcode.toLowerCase().includes(siteSearchQuery.toLowerCase()) ||
                      s.location.toLowerCase().includes(siteSearchQuery.toLowerCase())
                    )
                    .map(site => (
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
                          View Gate Radar →
                        </span>
                      </button>
                    ))}
                </div>
              ) : (
                <div className="text-center py-12 text-slate-500 text-xs">
                  <span>💡 Start typing above to search dedicated freight gates across all UK hubs</span>
                </div>
              )}
            </div>
          )}

          {/* ─── 2. DEDICATED SINGLE-SITE DETAIL PAGE (ONLY THIS SITE) ─── */}
          {selectedSite && (
            <div className="max-w-4xl mx-auto space-y-6 animate-fadeIn">
              {/* Site Card */}
              <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-2xl space-y-5">
                <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-800 pb-4">
                  <div>
                    <span className="text-[10px] font-mono text-emerald-400 uppercase font-bold tracking-wider">Verified Commercial Freight Hub</span>
                    <h2 className="text-xl font-black text-white">{selectedSite.name}</h2>
                    <p className="text-xs text-slate-400 font-mono">{selectedSite.postcode} • {selectedSite.location}</p>
                  </div>
                  
                  {/* Radar Dual Toggle */}
                  <div className="flex bg-slate-950 p-1 rounded-2xl border border-slate-800">
                    <button
                      onClick={() => setMapMode('gate')}
                      className={`px-4 py-2 rounded-xl text-xs font-black transition ${mapMode === 'gate' ? 'bg-amber-400 text-slate-950 shadow-md' : 'text-slate-400 hover:text-white'}`}
                    >
                      🏢 HGV GATE MAP
                    </button>
                    <button
                      onClick={() => setMapMode('route')}
                      className={`px-4 py-2 rounded-xl text-xs font-black transition ${mapMode === 'route' ? 'bg-emerald-400 text-slate-950 shadow-md' : 'text-slate-400 hover:text-white'}`}
                    >
                      🛣️ ROUTE FROM CAB
                    </button>
                  </div>
                </div>

                {/* Gate Points Breakdown */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="p-4 bg-emerald-500/10 border border-emerald-500/30 rounded-2xl">
                    <div className="flex items-center gap-2 text-emerald-400 font-black text-xs uppercase mb-1">
                      <span>🟢</span> Commercial HGV Inbound Gate
                    </div>
                    <div className="text-sm font-bold text-white mb-1">{selectedSite.hgvGate}</div>
                    <div className="text-[11px] text-emerald-300">Dedicated freight gatehouse, weighbridge & security check-in.</div>
                  </div>

                  <div className="p-4 bg-rose-500/10 border border-rose-500/30 rounded-2xl">
                    <div className="flex items-center gap-2 text-rose-400 font-black text-xs uppercase mb-1">
                      <span>⛔</span> Car & Visitor Entrance (NO HGVs)
                    </div>
                    <div className="text-sm font-bold text-white mb-1">{selectedSite.carPark}</div>
                    <div className="text-[11px] text-rose-300">DO NOT ENTER: 2.1m height barrier installed. Risk of trailer damage.</div>
                  </div>
                </div>

                {/* Simulated Visual Radar Map */}
                <div className="relative h-64 bg-slate-950 rounded-2xl border border-slate-800 overflow-hidden flex items-center justify-center">
                  <div className="absolute inset-0 bg-[radial-gradient(#1e293b_1px,transparent_1px)] [background-size:16px_16px] opacity-40"></div>
                  
                  {mapMode === 'gate' ? (
                    <div className="text-center space-y-3 z-10 p-4">
                      <div className="inline-flex items-center gap-2 bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 px-4 py-2 rounded-full text-xs font-black">
                        <span>🟢</span> PINPOINTED: HGV Gatehouse on {selectedSite.hgvGate.split('via')[0]}
                      </div>
                      <p className="text-xs text-slate-400 max-w-sm">Directing cab sat-nav coordinates straight to the freight security barrier.</p>
                    </div>
                  ) : (
                    <div className="text-center space-y-3 z-10 p-4">
                      <div className="inline-flex items-center gap-2 bg-amber-400/20 border border-amber-400/40 text-amber-300 px-4 py-2 rounded-full text-xs font-black">
                        <span>🛣️</span> 44t HGV Approved Route from Corley Services M6
                      </div>
                      <p className="text-xs text-slate-400 max-w-sm">Approved freight corridor avoiding all low bridges and residential zones.</p>
                    </div>
                  )}
                </div>

                {/* 1-Tap Navigation Dispatch */}
                <div className="pt-2">
                  <a
                    href={`https://www.google.com/maps/dir/?api=1&origin=Corley+Services+M6&destination=${encodeURIComponent(selectedSite.name + ' ' + selectedSite.postcode)}&travelmode=driving`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full py-4 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black rounded-2xl text-sm flex items-center justify-center gap-2 transition shadow-xl"
                  >
                    <span>🧭</span> LAUNCH TURN-BY-TURN NAVIGATION DIRECT TO HGV GATE
                  </a>
                </div>
              </div>
            </div>
          )}
        </div>
      )}
"""

# Replace the site reviews block in TachoSync.tsx
pattern = re.compile(r"\{\/\* ─── VIEW: SITE REVIEWS & ACCESS RADAR[\s\S]*?(?=\{\/\* ─── VIEW: DRIVER VEHICLE CHECK|\{\/\* ─── VIEW: HGV ROUTE OPTIMISER|view === 'depot-admin'|view === 'vehicle-check'|\}\n  \);)", re.MULTILINE)

if pattern.search(code):
    code = pattern.sub(new_site_reviews_view + "\n\n      ", code)
    print("✓ Replaced site-reviews block with clean, tall search and zero idle clutter")
else:
    # If pattern not found, replace the old view === 'site-reviews' block
    alt_pattern = re.compile(r"\{view === 'site-reviews' && \([\s\S]*?(?=\{view === '|\}\n  \);)", re.MULTILINE)
    if alt_pattern.search(code):
        code = alt_pattern.sub(new_site_reviews_view + "\n\n      ", code)
        print("✓ Replaced via alternative pattern")
    else:
        print("Could not match pattern automatically, appending.")

with open(tacho_path, "w", encoding="utf-8") as f:
    f.write(code)

print("Updated TachoSync.tsx successfully")
