import re

with open('src/app/driver/page.tsx', 'r') as f:
    code = f.read()

# 1. Update activeTab type to include 'tools'
code = code.replace(
    "activeTab, setActiveTab] = useState<'readiness' | 'route' | 'enroute' | 'depot' | 'tacho'>('readiness');",
    "activeTab, setActiveTab] = useState<'readiness' | 'route' | 'enroute' | 'depot' | 'tacho' | 'tools'>('readiness');"
)

# 2. Add 'Driver Tools' button to the HUD tab bar
old_tab_bar = '''          <button
            onClick={() => setActiveTab('tacho')}
            className={`px-3 py-1.5 rounded-lg transition shrink-0 ${activeTab === 'tacho' ? 'bg-emerald-500 text-slate-950 font-bold' : 'text-slate-400 hover:text-white'}`}
          >
            5. Tacho & Welfare
          </button>'''

new_tab_bar = '''          <button
            onClick={() => setActiveTab('tacho')}
            className={`px-3 py-1.5 rounded-lg transition shrink-0 ${activeTab === 'tacho' ? 'bg-emerald-500 text-slate-950 font-bold' : 'text-slate-400 hover:text-white'}`}
          >
            5. Tacho & Welfare
          </button>
          <button
            onClick={() => setActiveTab('tools')}
            className={`px-3 py-1.5 rounded-lg transition shrink-0 ${activeTab === 'tools' ? 'bg-amber-500 text-slate-950 font-black' : 'text-amber-400 hover:text-white border border-amber-500/30'}`}
          >
            🛠️ Driver Tools Tile
          </button>'''

code = code.replace(old_tab_bar, new_tab_bar)

# 3. Add Driver Tools Tile Content Section
driver_tools_section = '''        {/* TAB 6: DEDICATED DRIVER TOOLS TILE */}
        {activeTab === 'tools' && (
          <div className="space-y-6">
            <div className="border-b border-slate-800 pb-3 flex items-center justify-between">
              <div>
                <h2 className="text-lg font-black text-white flex items-center gap-2">
                  <Sliders className="w-5 h-5 text-amber-400" />
                  Driver Tools Tile
                </h2>
                <p className="text-xs text-slate-400 font-mono">Specialist In-Cab Safety, Threat Analysis & Diagnostic Instruments</p>
              </div>
              <span className="text-xs font-mono font-bold bg-amber-500/20 text-amber-400 border border-amber-500/40 px-3 py-1 rounded-full">
                6 Active Tools
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Tool 1: Class V/VI Blind Spot Proximity Shield */}
              <div className="bg-slate-900 border border-slate-800 p-5 rounded-3xl space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Eye className="w-5 h-5 text-emerald-400" />
                    <h3 className="text-sm font-black text-white">Class V/VI Blind Spot Proximity Shield</h3>
                  </div>
                  <span className="text-[10px] font-mono bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 px-2 py-0.5 rounded font-bold">
                    DVS 3-STAR
                  </span>
                </div>
                <p className="text-xs text-slate-400">
                  Direct Vision Standard (DVS) nearside passenger blind spot & front cross-view cyclist radar.
                </p>
                <div className="p-3 bg-slate-950 rounded-xl border border-slate-800 text-xs font-mono flex items-center justify-between">
                  <span className="text-slate-400">Nearside Cyclist Zone:</span>
                  <span className="text-emerald-400 font-bold">✓ CLEAR (0 in 2.5m zone)</span>
                </div>
              </div>

              {/* Tool 2: UK Cargo Crime & Curtain-Slash Heatmap */}
              <div className="bg-slate-900 border border-slate-800 p-5 rounded-3xl space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <ShieldAlert className="w-5 h-5 text-red-400" />
                    <h3 className="text-sm font-black text-white">UK Cargo Crime & Curtain-Slash Heatmap</h3>
                  </div>
                  <span className="text-[10px] font-mono bg-red-500/20 text-red-400 border border-red-500/40 px-2 py-0.5 rounded font-bold">
                    LIVE INTEL
                  </span>
                </div>
                <p className="text-xs text-slate-400">
                  NaVCIS freight crime intelligence mapping nocturnal slashing and fuel siphoning risks.
                </p>
                <div className="p-3 bg-slate-950 rounded-xl border border-slate-800 text-xs font-mono flex items-center justify-between">
                  <span className="text-slate-400">Current Area Threat:</span>
                  <span className="text-red-400 font-bold">M1 / A14 Corridor High Risk</span>
                </div>
              </div>

              {/* Tool 3: Quiet Sleep Zone Acoustic Radar */}
              <div className="bg-slate-900 border border-slate-800 p-5 rounded-3xl space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Volume2 className="w-5 h-5 text-blue-400" />
                    <h3 className="text-sm font-black text-white">Quiet Sleep Zone Acoustic Radar</h3>
                  </div>
                  <span className="text-[10px] font-mono bg-blue-500/20 text-blue-400 border border-blue-500/40 px-2 py-0.5 rounded font-bold">
                    46 dBA REST
                  </span>
                </div>
                <p className="text-xs text-slate-400">
                  Monitors ambient decibel pressure for 9h/11h rest. Flags noisy auxiliary diesel reefers.
                </p>
                <div className="p-3 bg-slate-950 rounded-xl border border-slate-800 text-xs font-mono flex items-center justify-between">
                  <span className="text-slate-400">Reefer Engine Proximity:</span>
                  <span className="text-emerald-400 font-bold">✓ Peaceful (&gt;150m clear)</span>
                </div>
              </div>

              {/* Tool 4: Acoustic Air Leak Radar */}
              <div className="bg-slate-900 border border-slate-800 p-5 rounded-3xl space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Mic className="w-5 h-5 text-amber-400" />
                    <h3 className="text-sm font-black text-white">Acoustic Air Leak Radar</h3>
                  </div>
                  <span className="text-[10px] font-mono bg-amber-500/20 text-amber-400 border border-amber-500/40 px-2 py-0.5 rounded font-bold">
                    4-8kHz DSP
                  </span>
                </div>
                <p className="text-xs text-slate-400">
                  Microphone frequency analysis detecting compressed air leaks across suzie coils.
                </p>
                <div className="p-3 bg-slate-950 rounded-xl border border-slate-800 text-xs font-mono flex items-center justify-between">
                  <span className="text-slate-400">Pneumatic System Status:</span>
                  <span className="text-emerald-400 font-bold">✓ 0.0 PSI Pressure Drop</span>
                </div>
              </div>

              {/* Tool 5: Coupling & 5th Wheel Vision */}
              <div className="bg-slate-900 border border-slate-800 p-5 rounded-3xl space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Truck className="w-5 h-5 text-emerald-400" />
                    <h3 className="text-sm font-black text-white">5th Wheel Coupling & Safety Lock</h3>
                  </div>
                  <span className="text-[10px] font-mono bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 px-2 py-0.5 rounded font-bold">
                    LATCH VERIFIED
                  </span>
                </div>
                <p className="text-xs text-slate-400">
                  Visual confirmation of dog-clip safety pin lock & kingpin jaw engagement.
                </p>
                <div className="p-3 bg-slate-950 rounded-xl border border-slate-800 text-xs font-mono flex items-center justify-between">
                  <span className="text-slate-400">Dog-Clip Status:</span>
                  <span className="text-emerald-400 font-bold">✓ Engaged & Secured</span>
                </div>
              </div>

              {/* Tool 6: Bay Navigation AR Overlay */}
              <div className="bg-slate-900 border border-slate-800 p-5 rounded-3xl space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Camera className="w-5 h-5 text-purple-400" />
                    <h3 className="text-sm font-black text-white">Bay Navigation AR Overlay</h3>
                  </div>
                  <span className="text-[10px] font-mono bg-purple-500/20 text-purple-400 border border-purple-500/40 px-2 py-0.5 rounded font-bold">
                    AR GUIDANCE
                  </span>
                </div>
                <p className="text-xs text-slate-400">
                  Dynamic trajectory guidelines for blindside reversing onto tight distribution bays.
                </p>
                <button
                  onClick={() => alert('Launching Bay Navigation AR Reversing Guides...')}
                  className="w-full py-2 bg-slate-950 hover:bg-slate-800 text-purple-400 font-bold text-xs font-mono rounded-xl border border-slate-800"
                >
                  Launch AR Guide
                </button>
              </div>
            </div>
          </div>
        )}
'''

code = code.replace("      </main>", driver_tools_section + "\n      </main>")

with open('src/app/driver/page.tsx', 'w') as f:
    f.write(code)

print("✓ Successfully created Driver Tools Tile inside Driver Dashboard!")
