import React, { useState, useRef } from 'react';
import {
  X,
  Navigation,
  Upload,
  Camera,
  FileText,
  CheckCircle2,
  Clock,
  MapPin,
  AlertTriangle,
  RotateCcw,
  Sparkles,
  ArrowRight,
  TrendingUp,
  Truck,
  CheckSquare,
  Shield,
  Coffee,
  ChevronRight,
  Download,
  SlidersHorizontal,
  Plus,
  Play
} from 'lucide-react';
import { RouteStop, OptimizedRoutePlan } from '../../types';
import {
  SAMPLE_MULTI_DROP_ROUTES,
  recalculateRouteProgression,
  resequenceStopsForCompliance
} from '../../services/routeOptimizerService';

interface MultiDropRouteOptimizerModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSendToCabHud?: (nextStopAddress: string) => void;
}

const SAMPLE_MANIFEST_IMAGES = [
  {
    id: 'manifest-1',
    name: 'Tesco & Sainsbury’s 5-Drop Manifest (Midlands Hubs)',
    subtitle: 'Consignment Note #MNF-92810 • 5 Drops • 26 Pallets',
    url: 'https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?auto=format&fit=crop&w=800&q=80'
  },
  {
    id: 'manifest-2',
    name: 'M6 North-West Pallet Linehaul (6 Drops)',
    subtitle: 'Run Sheet #NW-49201 • 6 Drops • General Freight',
    url: 'https://images.unsplash.com/photo-1607344645866-009c320c5ab8?auto=format&fit=crop&w=800&q=80'
  }
];

export const MultiDropRouteOptimizerModal: React.FC<MultiDropRouteOptimizerModalProps> = ({
  isOpen,
  onClose,
  onSendToCabHud
}) => {
  // Active sub-tab: 'PLAN' vs 'IN_TRANSIT_EXECUTION'
  const [activeTab, setActiveTab] = useState<'PLAN' | 'IN_TRANSIT_EXECUTION'>('IN_TRANSIT_EXECUTION');

  // Active route
  const [routePlan, setRoutePlan] = useState<OptimizedRoutePlan>(SAMPLE_MULTI_DROP_ROUTES[0]);

  // Upload & OCR State
  const [isScanningManifest, setIsScanningManifest] = useState(false);
  const [uploadedManifestImage, setUploadedManifestImage] = useState<string | null>(null);
  const [scanSuccessMessage, setScanSuccessMessage] = useState<string | null>(null);

  // Stop Completion Sign-Off Dialog State
  const [completingStop, setCompletingStop] = useState<RouteStop | null>(null);
  const [receiverName, setReceiverName] = useState('John Davies (Site Manager)');
  const [receiverSignature, setReceiverSignature] = useState('J. Davies');
  const [notesInput, setNotesInput] = useState('All 8 pallets accepted intact. Temperature +3.4°C verified.');

  const fileInputRef = useRef<HTMLInputElement>(null);

  if (!isOpen) return null;

  // Process manifest scan
  const handleScanManifest = async (presetRouteIndex = 0) => {
    setIsScanningManifest(true);
    setScanSuccessMessage(null);

    // Simulate AI Vision OCR extraction of delivery addresses and stops
    setTimeout(() => {
      const selected = SAMPLE_MULTI_DROP_ROUTES[presetRouteIndex] || SAMPLE_MULTI_DROP_ROUTES[0];
      setRoutePlan(selected);
      setIsScanningManifest(false);
      setScanSuccessMessage(
        `Manifest parsed via OCR: ${selected.stops.length} stops detected. Tacho 4.5h break scheduled at ${selected.stops.find((s) => s.isMandatoryTachoBreak)?.customerName || 'Services'}.`
      );
      setActiveTab('IN_TRANSIT_EXECUTION');
    }, 900);
  };

  // Complete a stop and trigger dynamic forward amendment of the route
  const handleConfirmStopCompletion = () => {
    if (!completingStop) return;

    const now = new Date();
    const actualTimeStr = `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;

    const updated = recalculateRouteProgression(routePlan, completingStop.id, actualTimeStr, receiverName);
    setRoutePlan(updated);
    setCompletingStop(null);
  };

  // Optimize sequence to cut dead miles
  const handleResequence = () => {
    const optimized = resequenceStopsForCompliance(routePlan);
    setRoutePlan(optimized);
    setScanSuccessMessage('Route re-sequenced: Stops grouped logically. Mandatory tacho break verified.');
    setTimeout(() => setScanSuccessMessage(null), 4000);
  };

  const completedCount = routePlan.stops.filter((s) => s.status === 'COMPLETED').length;
  const totalCount = routePlan.stops.length;
  const progressPercent = Math.round((completedCount / totalCount) * 100);

  // Find next pending or active stop
  const currentActiveStop =
    routePlan.stops.find((s) => s.status === 'EN_ROUTE' || s.status === 'ARRIVED') ||
    routePlan.stops.find((s) => s.status === 'PENDING') ||
    routePlan.stops[routePlan.stops.length - 1];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur-md p-2 sm:p-4 overflow-y-auto animate-in fade-in duration-200">
      <div className="relative w-full max-w-5xl rounded-3xl bg-slate-950 border border-emerald-500/40 text-white shadow-2xl overflow-hidden flex flex-col max-h-[94vh]">
        
        {/* TOP MODAL HEADER */}
        <div className="flex items-center justify-between px-5 py-3.5 border-b border-slate-800 bg-slate-900/90 shrink-0">
          <div className="flex items-center gap-3">
            <div className="h-9 w-9 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center text-slate-950 font-black shadow-md shadow-emerald-500/20">
              <Navigation className="h-5 w-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-black tracking-wider text-emerald-400 uppercase">
                  Drive Partners • Route Optimiser
                </span>
                <span className="text-[10px] rounded-full bg-emerald-500/20 px-2 py-0.5 font-bold text-emerald-300 border border-emerald-500/30">
                  EU 561/2006 &amp; WTD Compliant
                </span>
              </div>
              <h3 className="text-sm font-bold text-slate-100">
                Multi-Drop Manifest Scanner &amp; Dynamic In-Shift Route Execution
              </h3>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setActiveTab(activeTab === 'PLAN' ? 'IN_TRANSIT_EXECUTION' : 'PLAN')}
              className="rounded-xl px-3 py-1.5 text-xs font-bold bg-slate-800 hover:bg-slate-700 text-emerald-300 border border-emerald-500/30 transition-colors flex items-center gap-1.5 cursor-pointer"
            >
              {activeTab === 'PLAN' ? (
                <>
                  <Play className="w-3.5 h-3.5" />
                  <span>View Active Route</span>
                </>
              ) : (
                <>
                  <Upload className="w-3.5 h-3.5" />
                  <span>Upload / Change Manifest</span>
                </>
              )}
            </button>
            <button
              onClick={onClose}
              className="rounded-xl p-2 text-slate-400 hover:bg-slate-800 hover:text-white transition-colors cursor-pointer"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
        </div>

        {/* NOTIFICATION MESSAGE BANNER */}
        {scanSuccessMessage && (
          <div className="px-5 py-2.5 bg-emerald-500/20 border-b border-emerald-500/30 text-emerald-300 text-xs font-bold flex items-center justify-between">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-400" />
              <span>{scanSuccessMessage}</span>
            </div>
            <button onClick={() => setScanSuccessMessage(null)} className="text-emerald-400 hover:text-white">
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        )}

        {/* MODAL MAIN CONTENT */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-5">
          {activeTab === 'PLAN' ? (
            /* ========================================================================= */
            /* UPLOAD & OCR MANIFEST VIEW                                                */
            /* ========================================================================= */
            <div className="space-y-6 max-w-3xl mx-auto">
              
              {/* Upload Dropzone */}
              <div className="p-6 rounded-3xl bg-slate-900 border-2 border-dashed border-emerald-500/40 hover:border-emerald-400 text-center space-y-3 transition-colors">
                <div className="w-14 h-14 rounded-2xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center mx-auto border border-emerald-500/30">
                  <Camera className="w-7 h-7" />
                </div>
                <div>
                  <h4 className="text-base font-bold text-white">Upload Route Manifest, Consignment Note or Run Sheet</h4>
                  <p className="text-xs text-slate-400 max-w-md mx-auto mt-1">
                    Take a photo of your paper delivery sheet or upload a PDF/image. Gemini Vision OCR will extract customer names, postcodes, time windows, and pallets automatically.
                  </p>
                </div>

                <div className="flex items-center justify-center gap-3 pt-2">
                  <button
                    onClick={() => fileInputRef.current?.click()}
                    className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 hover:to-teal-500 text-slate-950 font-black text-xs shadow-md shadow-emerald-500/20 flex items-center gap-2 cursor-pointer"
                  >
                    <Upload className="w-4 h-4" />
                    <span>Upload Manifest File</span>
                  </button>
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*,.pdf,.csv"
                    className="hidden"
                    onChange={(e) => {
                      if (e.target.files?.[0]) {
                        handleScanManifest(0);
                      }
                    }}
                  />
                </div>
              </div>

              {/* Sample Manifest Presets for Demo */}
              <div className="space-y-3">
                <span className="text-xs font-mono font-bold text-slate-400 uppercase tracking-wider block">
                  Or Test with Real-World Multi-Drop Presets:
                </span>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {SAMPLE_MANIFEST_IMAGES.map((sample, idx) => (
                    <div
                      key={sample.id}
                      onClick={() => handleScanManifest(idx)}
                      className="p-4 rounded-2xl bg-slate-900 border border-slate-800 hover:border-emerald-500/50 cursor-pointer transition-all space-y-2 group"
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-emerald-400 uppercase font-mono">
                          {idx === 0 ? '5-Drop FMCG' : '6-Drop Pallet Trunk'}
                        </span>
                        <ArrowRight className="w-4 h-4 text-slate-500 group-hover:text-emerald-400 transition-colors" />
                      </div>
                      <h5 className="text-sm font-bold text-white group-hover:text-emerald-300 transition-colors">
                        {sample.name}
                      </h5>
                      <p className="text-xs text-slate-400">{sample.subtitle}</p>
                    </div>
                  ))}
                </div>
              </div>

            </div>
          ) : (
            /* ========================================================================= */
            /* IN-TRANSIT ROUTE EXECUTION & LIVE AUTO-AMENDMENT                          */
            /* ========================================================================= */
            <div className="space-y-6">
              
              {/* Route Summary Statistics Header */}
              <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 text-xs">
                <div className="p-3.5 rounded-2xl bg-slate-900 border border-slate-800 space-y-1">
                  <span className="text-[10px] text-slate-400 font-mono block uppercase">Progress</span>
                  <div className="text-lg font-black text-emerald-400 flex items-baseline gap-1">
                    <span>{completedCount}</span>
                    <span className="text-xs text-slate-400 font-normal">/ {totalCount} drops</span>
                  </div>
                  <div className="h-1.5 w-full bg-slate-800 rounded-full overflow-hidden">
                    <div className="h-full bg-emerald-400 rounded-full" style={{ width: `${progressPercent}%` }} />
                  </div>
                </div>

                <div className="p-3.5 rounded-2xl bg-slate-900 border border-slate-800 space-y-1">
                  <span className="text-[10px] text-slate-400 font-mono block uppercase">Total Mileage</span>
                  <div className="text-lg font-black text-cyan-400">{routePlan.totalDistanceMiles} mi</div>
                  <span className="text-[10px] text-slate-500 block">Optimized sequence</span>
                </div>

                <div className="p-3.5 rounded-2xl bg-slate-900 border border-slate-800 space-y-1">
                  <span className="text-[10px] text-slate-400 font-mono block uppercase">Driving Time</span>
                  <div className="text-lg font-black text-blue-400">
                    {Math.floor(routePlan.totalDrivingMinutes / 60)}h {routePlan.totalDrivingMinutes % 60}m
                  </div>
                  <span className="text-[10px] text-slate-500 block">Out of 9h 00m daily limit</span>
                </div>

                <div className="p-3.5 rounded-2xl bg-slate-900 border border-slate-800 space-y-1">
                  <span className="text-[10px] text-slate-400 font-mono block uppercase">Tacho Rest Break</span>
                  <div className="text-lg font-black text-amber-400">45 mins</div>
                  <span className="text-[10px] text-amber-300/80 block">Pre-scheduled on M1/M6</span>
                </div>

                <div className="p-3.5 rounded-2xl bg-slate-900 border border-slate-800 space-y-1">
                  <span className="text-[10px] text-slate-400 font-mono block uppercase">Total Shift Time</span>
                  <div className="text-lg font-black text-teal-300">
                    {Math.floor(routePlan.totalShiftMinutes / 60)}h {routePlan.totalShiftMinutes % 60}m
                  </div>
                  <span className="text-[10px] text-slate-500 block">Drive + Unload + Rest</span>
                </div>
              </div>

              {/* Action Toolbar */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-4 rounded-2xl bg-slate-900/90 border border-slate-800">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold text-white">Active Route:</span>
                  <span className="text-xs font-bold text-emerald-400">{routePlan.routeTitle}</span>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={handleResequence}
                    className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-cyan-300 text-xs font-bold border border-cyan-500/30 flex items-center gap-1.5 transition-colors cursor-pointer"
                  >
                    <SlidersHorizontal className="w-3.5 h-3.5" />
                    <span>Auto-Resequence for Tacho</span>
                  </button>
                  <button
                    onClick={() => {
                      if (onSendToCabHud && currentActiveStop) {
                        onSendToCabHud(`${currentActiveStop.customerName}, ${currentActiveStop.postcode}`);
                        setScanSuccessMessage(`Next stop sent to In-Cab HUD: ${currentActiveStop.customerName}`);
                      }
                    }}
                    className="px-3 py-1.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black text-xs flex items-center gap-1.5 transition-colors cursor-pointer"
                  >
                    <Navigation className="w-3.5 h-3.5" />
                    <span>Send Next Stop to Cab HUD</span>
                  </button>
                </div>
              </div>

              {/* Dynamic Route Stops Timeline */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <h4 className="text-xs font-mono font-bold uppercase tracking-wider text-slate-400">
                    Delivery Stops &amp; Mandatory Rest Schedule (Auto-Amending)
                  </h4>
                  <span className="text-[11px] text-slate-500">
                    Click "Complete Stop" to sign e-POD and recalculate all remaining drop ETAs
                  </span>
                </div>

                <div className="space-y-2.5">
                  {routePlan.stops.map((stop, index) => {
                    const isCompleted = stop.status === 'COMPLETED';
                    const isEnRoute = stop.status === 'EN_ROUTE';
                    const isBreak = stop.isMandatoryTachoBreak;

                    return (
                      <div
                        key={stop.id}
                        className={`p-4 rounded-2xl border transition-all ${
                          isCompleted
                            ? 'bg-slate-950/60 border-slate-800/80 text-slate-400 opacity-75'
                            : isBreak
                            ? 'bg-amber-950/20 border-amber-500/50 text-amber-200'
                            : isEnRoute
                            ? 'bg-emerald-950/30 border-emerald-500 ring-2 ring-emerald-500/20 text-white'
                            : 'bg-slate-900 border-slate-800 text-slate-200'
                        }`}
                      >
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                          
                          {/* Left: Sequence Badge + Customer + Address */}
                          <div className="flex items-start gap-3">
                            <div
                              className={`w-8 h-8 rounded-xl font-mono font-black text-xs flex items-center justify-center shrink-0 ${
                                isCompleted
                                  ? 'bg-slate-800 text-emerald-400'
                                  : isBreak
                                  ? 'bg-amber-500 text-slate-950'
                                  : isEnRoute
                                  ? 'bg-emerald-400 text-slate-950'
                                  : 'bg-slate-800 text-slate-300'
                              }`}
                            >
                              {isCompleted ? (
                                <CheckCircle2 className="w-4 h-4" />
                              ) : isBreak ? (
                                <Coffee className="w-4 h-4" />
                              ) : (
                                stop.stopSequence
                              )}
                            </div>

                            <div className="space-y-0.5">
                              <div className="flex items-center gap-2">
                                <h5 className="font-bold text-sm text-white">{stop.customerName}</h5>
                                {isBreak && (
                                  <span className="px-2 py-0.2 rounded text-[9px] font-bold uppercase bg-amber-500/20 text-amber-300 border border-amber-500/30">
                                    STATUTORY REST (45M)
                                  </span>
                                )}
                                {isCompleted && (
                                  <span className="px-2 py-0.2 rounded text-[9px] font-bold uppercase bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                                    COMPLETED AT {stop.completedAt}
                                  </span>
                                )}
                              </div>
                              <p className="text-xs text-slate-400 flex items-center gap-1.5">
                                <MapPin className="w-3.5 h-3.5 text-slate-500 shrink-0" />
                                <span>{stop.address}, {stop.postcode}</span>
                              </p>
                              {stop.consignmentNotes && (
                                <p className="text-[11px] text-slate-500 font-mono">{stop.consignmentNotes}</p>
                              )}
                            </div>
                          </div>

                          {/* Right: ETA, Distance, Dwell & Completion Button */}
                          <div className="flex items-center justify-between sm:justify-end gap-4 shrink-0 pt-2 sm:pt-0 border-t sm:border-0 border-slate-800">
                            <div className="text-right text-xs">
                              <div className="font-mono font-bold text-cyan-300">
                                ETA {stop.estimatedArrival} – {stop.estimatedDeparture}
                              </div>
                              <div className="text-[10px] text-slate-500">
                                {stop.distanceMilesFromPrev} mi ({stop.drivingMinutesFromPrev}m drive) • {stop.dwellMinutes}m dwell
                              </div>
                            </div>

                            <div>
                              {isCompleted ? (
                                <span className="text-xs font-mono text-emerald-400 flex items-center gap-1 font-bold">
                                  <CheckSquare className="w-4 h-4" />
                                  <span>Signed: {stop.ePodSignatory || 'Supervisor'}</span>
                                </span>
                              ) : (
                                <button
                                  onClick={() => setCompletingStop(stop)}
                                  className="px-3.5 py-1.5 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 hover:to-teal-500 text-slate-950 font-black text-xs shadow-md shadow-emerald-500/20 flex items-center gap-1.5 transition-all active:scale-95 cursor-pointer"
                                >
                                  <CheckSquare className="w-3.5 h-3.5" />
                                  <span>{isBreak ? 'Complete Break' : 'Complete Stop'}</span>
                                </button>
                              )}
                            </div>

                          </div>

                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

            </div>
          )}
        </div>

        {/* STOP COMPLETION & E-POD SIGN-OFF MODAL DIALOG */}
        {completingStop && (
          <div className="fixed inset-0 z-60 flex items-center justify-center p-3 bg-black/85 backdrop-blur-md">
            <div className="w-full max-w-md rounded-2xl bg-slate-900 border border-emerald-500/50 p-5 space-y-4 shadow-2xl">
              <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                <div className="flex items-center gap-2">
                  <CheckSquare className="w-5 h-5 text-emerald-400" />
                  <h4 className="font-bold text-white text-sm">
                    {completingStop.isMandatoryTachoBreak ? 'Confirm Mandatory Break' : 'Confirm Delivery & e-POD'}
                  </h4>
                </div>
                <button onClick={() => setCompletingStop(null)} className="text-slate-400 hover:text-white">
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 text-xs space-y-1">
                <span className="text-slate-500 block uppercase font-mono">Location</span>
                <span className="font-bold text-white block">{completingStop.customerName}</span>
                <span className="text-slate-400 block">{completingStop.address}</span>
              </div>

              {!completingStop.isMandatoryTachoBreak && (
                <div className="space-y-3 text-xs">
                  <div>
                    <label className="font-bold text-slate-300 block mb-1">Receiver / Site Manager Name:</label>
                    <input
                      type="text"
                      value={receiverName}
                      onChange={(e) => setReceiverName(e.target.value)}
                      className="w-full rounded-xl bg-slate-950 border border-slate-800 p-2.5 text-white text-xs focus:border-emerald-400 focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="font-bold text-slate-300 block mb-1">e-POD Digital Signature Token:</label>
                    <input
                      type="text"
                      value={receiverSignature}
                      onChange={(e) => setReceiverSignature(e.target.value)}
                      className="w-full rounded-xl bg-slate-950 border border-slate-800 p-2.5 text-cyan-300 font-mono text-xs focus:border-emerald-400 focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="font-bold text-slate-300 block mb-1">Goods Condition &amp; Temperature Note:</label>
                    <input
                      type="text"
                      value={notesInput}
                      onChange={(e) => setNotesInput(e.target.value)}
                      className="w-full rounded-xl bg-slate-950 border border-slate-800 p-2.5 text-slate-300 text-xs focus:border-emerald-400 focus:outline-none"
                    />
                  </div>
                </div>
              )}

              <div className="flex items-center gap-2 pt-2">
                <button
                  onClick={() => setCompletingStop(null)}
                  className="flex-1 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold text-xs"
                >
                  Cancel
                </button>
                <button
                  onClick={handleConfirmStopCompletion}
                  className="flex-1 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black text-xs shadow-lg shadow-emerald-500/20"
                >
                  Confirm &amp; Amend Route
                </button>
              </div>
            </div>
          </div>
        )}

        {/* MODAL FOOTER */}
        <div className="px-5 py-3 border-t border-slate-800 bg-slate-900/80 flex items-center justify-between text-xs text-slate-400 shrink-0">
          <div className="flex items-center gap-2">
            <Shield className="w-4 h-4 text-emerald-400" />
            <span>Route Optimiser: Dynamic Stop Progression &amp; Continuous Tacho Recalculation</span>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={onClose}
              className="px-4 py-1.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black transition-colors cursor-pointer"
            >
              Done
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};
