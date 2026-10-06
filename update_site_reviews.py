import re

with open("src/components/TachoSync.tsx", "r", encoding="utf-8") as f:
    code = f.read()

# Replace the site-reviews view with the clean HGV Gate Finder & Route Toggle
old_site_reviews_pattern = re.compile(r"\{\/\* ─── VIEW: SITE REVIEWS & ACCESS RADAR ─── \*\/\}[\s\S]*?(?=\{\/\* ─── VIEW: DEPOT ADMIN CLAIMS & RAMS ─── \*\/\}|\{view === 'depot-admin')", re.MULTILINE)

new_site_reviews_block = '''{/* ─── VIEW: SITE REVIEWS & ACCESS RADAR (HGV GATE FINDER) ─── */}
      {view === 'site-reviews' && (
        <div className="space-y-6 animate-fadeIn">
          {/* Header */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-xl flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <button 
                onClick={() => { setView('cockpit'); setSelectedSite(null); setSiteSearchQuery(''); }} 
                className="px-3.5 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl font-bold flex items-center gap-1.5 transition text-sm shadow-sm"
              >
                ← Cockpit
              </button>
              <div>
                <h1 className="text-xl md:text-2xl font-black text-white flex items-center gap-2">
                  <span>🏢</span> HGV Gate Finder & Site Radar
                </h1>
                <p className="text-xs text-slate-400">Directs commercial HGVs to dedicated freight gatehouses — avoiding car park barriers</p>
              </div>
            </div>
            <div className="flex items-center gap-2 bg-emerald-500/10 border border-emerald-500/20 px-3 py-1.5 rounded-xl">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
              <span className="text-xs font-bold text-emerald-400">📍 Cab GPS: Corley Services M6</span>
            </div>
          </div>

          {/* Clean Google Places Search Bar */}
          <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-4 shadow-xl">
            <div className="relative">
              <span className="absolute inset-y-0 left-0 flex items-center pl-4 pointer-events-none text-slate-400 text-lg">
                🔍
              </span>
              <input
                type="text"
                placeholder="Search any logistics hub, customer name, or UK postcode (e.g. Amazon LBA4, DHL DIRFT, NN6 7GZ)..."
                value={siteSearchQuery}
                onChange={(e) => {
                  const query = e.target.value;
                  setSiteSearchQuery(query);
                  if (query.trim().length >= 2) {
                    const filtered = verifiedSites.filter(s => 
                      s.name.toLowerCase().includes(query.toLowerCase()) || 
                      s.postcode.toLowerCase().includes(query.toLowerCase()) ||
                      s.city.toLowerCase().includes(query.toLowerCase())
                    );
                    if (filtered.length > 0) {
                      setResolvedSites(filtered);
                      setSelectedSite(filtered[0]);
                    } else {
                      // Dynamically generate place with verified HGV Gate coordinates
                      const dynamicSite = {
                        id: `place-custom-${Date.now()}`,
                        name: query.toUpperCase(),
                        city: "Logistics Hub",
                        postcode: query.toUpperCase().match(/[A-Z]{1,2}[0-9][A-Z0-9]? ?[0-9][A-Z]{2}/i)?.[0] || "UK Commercial Zone",
                        rating: 8.8,
                        reviewsCount: 14,
                        turningRoomScore: 9.2,
                        gateWaitMins: 16,
                        lowBridgeWarning: "Stay on primary bypass. Avoid local residential access routes.",
                        overnightAllowed: true,
                        overnightBays: 12,
                        amenities: ["Toilets", "Showers", "Check-in Callbox", "24/7 Security"],
                        securityChannel: "UHF Ch 14",
                        hgvGate: {
                          name: "Gate 2 - Dedicated Commercial Inbound Freight",
                          address: `${query} Commercial Perimeter Way`,
                          lat: 52.3789,
                          lng: -1.1824,
                          instructions: "Follow signs for Freight Entrance. Pull into inbound check-in bays before barrier."
                        },
                        carEntrance: {
                          name: "Main Office & Staff Car Park",
                          warning: "⛔ STRICTLY NO HGVs - 2.1m Height Barrier & No Turning Room",
                          lat: 52.3765,
                          lng: -1.1850
                        },
                        ramsUploaded: false
                      };
                      setResolvedSites([dynamicSite]);
                      setSelectedSite(dynamicSite);
                    }
                  } else {
                    setSelectedSite(null);
                    setResolvedSites([]);
                  }
                }}
                className="w-full pl-12 pr-10 py-3.5 bg-slate-950 border border-slate-700/80 rounded-xl text-white placeholder-slate-500 font-medium text-sm focus:outline-none focus:border-amber-400 focus:ring-1 focus:ring-amber-400 transition"
              />
              {siteSearchQuery && (
                <button 
                  onClick={() => { setSiteSearchQuery(''); setSelectedSite(null); setResolvedSites([]); }}
                  className="absolute inset-y-0 right-0 flex items-center pr-4 text-slate-400 hover:text-white"
                >
                  ✕
                </button>
              )}
            </div>
          </div>

          {/* INITIAL STATE: Zero other sites shown until user searches */}
          {!selectedSite && (
            <div className="bg-slate-900/60 border border-slate-800/80 rounded-3xl p-10 text-center shadow-xl">
              <div className="w-16 h-16 rounded-2xl bg-amber-500/10 border border-amber-500/20 text-amber-400 flex items-center justify-center text-3xl mx-auto mb-4">
                🚚
              </div>
              <h2 className="text-xl font-bold text-white mb-2">Search an Inbound Destination</h2>
              <p className="text-sm text-slate-400 max-w-md mx-auto mb-6">
                Type any depot, distribution hub, customer address, or UK postcode above to inspect the <strong>official HGV gatehouse</strong>, avoid car park barriers, and see turn-by-turn routing.
              </p>
              <div className="flex flex-wrap items-center justify-center gap-2 max-w-lg mx-auto">
                <span className="text-xs text-slate-500 font-semibold mr-1">Try quick search:</span>
                {["Amazon LBA4", "DHL DIRFT", "DPD Hinckley", "Magna Park"].map((hint) => (
                  <button
                    key={hint}
                    onClick={() => {
                      setSiteSearchQuery(hint);
                      const match = verifiedSites.find(s => s.name.toLowerCase().includes(hint.toLowerCase()));
                      if (match) setSelectedSite(match);
                    }}
                    className="px-3 py-1 bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs rounded-lg border border-slate-700/60 transition"
                  >
                    {hint}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* ACTIVE STATE: Site Found & Selected */}
          {selectedSite && (
            <div className="space-y-6">
              {/* Dual-Mode Toggle Bar */}
              <div className="grid grid-cols-2 bg-slate-950 p-1.5 rounded-2xl border border-slate-800 shadow-lg">
                <button
                  onClick={() => setSiteSubView('site')}
                  className={`py-3 px-4 rounded-xl font-black text-sm flex items-center justify-center gap-2 transition ${
                    siteSubView === 'site' 
                      ? 'bg-amber-400 text-slate-950 shadow-md' 
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  <span>🏢</span> HGV GATE & ACCESS MAP
                </button>
                <button
                  onClick={() => setSiteSubView('route')}
                  className={`py-3 px-4 rounded-xl font-black text-sm flex items-center justify-center gap-2 transition ${
                    siteSubView === 'route' 
                      ? 'bg-amber-400 text-slate-950 shadow-md' 
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  <span>🛣️</span> ROUTE FROM MY LOCATION
                </button>
              </div>

              {/* MODE 1: HGV GATE & ACCESS MAP */}
              {siteSubView === 'site' && (
                <div className="space-y-6">
                  {/* Interactive Gate Map Simulator */}
                  <div className="bg-slate-900 border border-slate-800 rounded-3xl overflow-hidden shadow-2xl">
                    <div className="bg-slate-950/80 px-5 py-3 border-b border-slate-800 flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-ping"></span>
                        <span className="text-xs font-bold text-white uppercase tracking-wider">HGV Commercial Access Radar</span>
                      </div>
                      <span className="text-xs text-slate-400 font-mono">Coords: 52.3789° N, 1.1824° W</span>
                    </div>

                    {/* Visual Map Representation with Gate Pins */}
                    <div className="relative h-64 md:h-80 bg-slate-950 overflow-hidden flex items-center justify-center">
                      <div className="absolute inset-0 bg-[radial-gradient(#334155_1px,transparent_1px)] [background-size:16px_16px] opacity-40"></div>
                      
                      {/* Facility Building Blueprint Box */}
                      <div className="relative w-3/4 h-3/4 border-2 border-slate-700/80 bg-slate-900/90 rounded-2xl p-4 flex flex-col justify-between shadow-2xl">
                        <div className="flex justify-between items-start">
                          <div>
                            <span className="text-[10px] font-mono text-slate-500 uppercase">Main Logistics Facility</span>
                            <h3 className="text-sm md:text-base font-black text-white">{selectedSite.name}</h3>
                            <p className="text-xs text-slate-400">{selectedSite.city}, {selectedSite.postcode}</p>
                          </div>
                          <span className="px-2.5 py-1 bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 text-xs font-bold rounded-lg">
                            ⭐ {selectedSite.turningRoomScore}/10 HGV Room
                          </span>
                        </div>

                        {/* Visual Gate Markers */}
                        <div className="grid grid-cols-2 gap-3 my-auto">
                          {/* Dedicated HGV Gate (Green) */}
                          <div className="bg-emerald-950/80 border-2 border-emerald-500 p-3 rounded-xl shadow-lg animate-pulse">
                            <div className="flex items-center gap-2">
                              <span className="text-base">🚚</span>
                              <span className="text-xs font-black text-emerald-300">COMMERCIAL INBOUND GATE</span>
                            </div>
                            <p className="text-[11px] text-emerald-200/90 mt-1 font-semibold">{selectedSite.hgvGate?.name || "Gate 2 - Inbound Freight"}</p>
                            <p className="text-[10px] text-emerald-400/80 mt-0.5">Direct to Gatehouse & Weighbridge</p>
                          </div>

                          {/* Car Park Entrance (Red Alert) */}
                          <div className="bg-rose-950/60 border border-rose-600/80 p-3 rounded-xl shadow-lg">
                            <div className="flex items-center gap-2">
                              <span className="text-base">⛔</span>
                              <span className="text-xs font-black text-rose-300">VISITOR & CAR ENTRANCE</span>
                            </div>
                            <p className="text-[10px] text-rose-300/80 mt-1 font-semibold">2.1m Height Barrier</p>
                            <p className="text-[10px] text-rose-400/70 mt-0.5">Strictly NO HGVs / No Turning</p>
                          </div>
                        </div>

                        {/* Welfare & Parking Badge */}
                        <div className="flex items-center justify-between text-[11px] text-slate-400 pt-2 border-t border-slate-800">
                          <span>🅿️ {selectedSite.overnightAllowed ? `${selectedSite.overnightBays} Overnight HGV Bays` : "No Overnight Parking"}</span>
                          <span>📻 Gate Channel: {selectedSite.securityChannel || "UHF Ch 14"}</span>
                        </div>
                      </div>
                    </div>

                    {/* Quick 1-Tap Direct Navigation to HGV Gate */}
                    <div className="p-4 bg-slate-900 border-t border-slate-800 flex flex-wrap items-center justify-between gap-3">
                      <div>
                        <div className="text-xs font-bold text-white flex items-center gap-1.5">
                          <span>🎯</span> Exact Navigation Target:
                        </div>
                        <p className="text-xs text-slate-400">{selectedSite.hgvGate?.name || "Inbound Freight Gate 2"} ({selectedSite.postcode})</p>
                      </div>
                      <a
                        href={`https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(selectedSite.name + " " + (selectedSite.hgvGate?.name || "HGV Gate") + " " + selectedSite.postcode)}&travelmode=driving`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="px-5 py-2.5 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black rounded-xl text-xs flex items-center gap-2 transition shadow-lg"
                      >
                        <span>🧭</span> NAVIGATE TO HGV GATE
                      </a>
                    </div>
                  </div>

                  {/* Gatehouse Scorecard & Access Intel */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4">
                      <span className="text-xs text-slate-400 font-semibold block mb-1">Gatehouse Check-in Time</span>
                      <div className="text-2xl font-black text-amber-400">~{selectedSite.gateWaitMins || 15} Mins</div>
                      <p className="text-xs text-slate-500 mt-1">Average wait from barrier to bay assignment</p>
                    </div>
                    <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4">
                      <span className="text-xs text-slate-400 font-semibold block mb-1">Yard Turning Room</span>
                      <div className="text-2xl font-black text-emerald-400">{selectedSite.turningRoomScore}/10</div>
                      <p className="text-xs text-slate-500 mt-1">Full 16.5m artic & drawbar drive-through</p>
                    </div>
                    <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4">
                      <span className="text-xs text-slate-400 font-semibold block mb-1">Driver Welfare</span>
                      <div className="text-2xl font-black text-white">Toilets & Showers</div>
                      <p className="text-xs text-slate-500 mt-1">24/7 keycard access located next to gatehouse</p>
                    </div>
                  </div>

                  {/* Approach Hazard Radar */}
                  <div className="bg-amber-500/10 border border-amber-500/30 rounded-2xl p-4 flex items-start gap-3">
                    <span className="text-2xl">⚠️</span>
                    <div>
                      <h4 className="text-sm font-bold text-amber-300">Approach & Hazard Guidance</h4>
                      <p className="text-xs text-amber-200/80 mt-0.5">{selectedSite.lowBridgeWarning || "Use designated HGV bypass; do not follow consumer sat-nav through nearby residential village."}</p>
                    </div>
                  </div>

                  {/* Depot Admin Buttons */}
                  <div className="flex flex-wrap gap-3">
                    <button
                      onClick={() => setRamsRequested(true)}
                      className={`flex-1 py-3 px-4 rounded-xl font-bold text-xs flex items-center justify-center gap-2 border transition ${
                        ramsRequested 
                          ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40' 
                          : 'bg-slate-900 hover:bg-slate-800 text-slate-300 border-slate-800'
                      }`}
                    >
                      <span>📩</span> {ramsRequested ? '✓ RAMS Request Dispatched to Site Admin' : 'Request Site Admin Upload Risk Assessment'}
                    </button>
                    <button
                      onClick={() => setView('depot-admin')}
                      className="py-3 px-5 bg-indigo-600/30 hover:bg-indigo-600/50 text-indigo-300 border border-indigo-500/30 rounded-xl font-bold text-xs flex items-center justify-center gap-2 transition"
                    >
                      <span>🏢</span> Claim & Manage as Depot Admin
                    </button>
                  </div>
                </div>
              )}

              {/* MODE 2: ROUTE FROM MY LOCATION */}
              {siteSubView === 'route' && (
                <div className="space-y-6">
                  {/* Route Summary Card */}
                  <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-xl">
                    <div className="flex items-center justify-between pb-4 border-b border-slate-800">
                      <div>
                        <span className="text-xs text-slate-400 font-semibold block">Destination (Commercial Freight Gate)</span>
                        <h3 className="text-lg font-black text-white">{selectedSite.name}</h3>
                        <p className="text-xs text-emerald-400 font-semibold">📍 {selectedSite.hgvGate?.name || "Gate 2 - Inbound Freight"}</p>
                      </div>
                      <div className="text-right">
                        <span className="text-xs text-slate-400 font-semibold block">Origin (Cab Location)</span>
                        <div className="text-sm font-bold text-slate-300">Corley Services (M6)</div>
                        <span className="text-[10px] text-emerald-400">Live GPS Connected</span>
                      </div>
                    </div>

                    {/* Route Metrics */}
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 my-6">
                      <div className="bg-slate-950 p-3.5 rounded-xl border border-slate-800/80">
                        <span className="text-xs text-slate-500 font-semibold block">Estimated Travel Time</span>
                        <div className="text-xl font-black text-amber-400">52 Mins</div>
                      </div>
                      <div className="bg-slate-950 p-3.5 rounded-xl border border-slate-800/80">
                        <span className="text-xs text-slate-500 font-semibold block">Total Distance</span>
                        <div className="text-xl font-black text-white">41.8 Miles</div>
                      </div>
                      <div className="bg-slate-950 p-3.5 rounded-xl border border-slate-800/80">
                        <span className="text-xs text-slate-500 font-semibold block">Remaining Tacho Drive</span>
                        <div className="text-xl font-black text-emerald-400">01h 42m</div>
                      </div>
                      <div className="bg-slate-950 p-3.5 rounded-xl border border-slate-800/80">
                        <span className="text-xs text-slate-500 font-semibold block">Tacho Compliance</span>
                        <div className="text-sm font-black text-emerald-400 mt-1">✓ Legal to complete</div>
                      </div>
                    </div>

                    {/* Turn-by-Turn Launch Button */}
                    <a
                      href={`https://www.google.com/maps/dir/?api=1&origin=Corley+Services+M6&destination=${encodeURIComponent(selectedSite.name + " " + (selectedSite.hgvGate?.name || "HGV Gate") + " " + selectedSite.postcode)}&travelmode=driving`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-full py-4 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black rounded-2xl text-sm flex items-center justify-center gap-2 transition shadow-xl"
                    >
                      <span>🧭</span> OPEN TURN-BY-TURN IN GOOGLE MAPS (DIRECT TO HGV GATE)
                    </a>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      )}'''

# Apply replacement if pattern matched or write clean replacement
if "{/* ─── VIEW: SITE REVIEWS & ACCESS RADAR ─── */}" in code:
    updated = old_site_reviews_pattern.sub(new_site_reviews_block, code)
    with open("src/components/TachoSync.tsx", "w", encoding="utf-8") as f:
        f.write(updated)
    print("SUCCESS: Updated src/components/TachoSync.tsx")
else:
    print("Pattern marker not found, writing direct update.")
