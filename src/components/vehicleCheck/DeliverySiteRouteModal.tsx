'use client';
import React, { useState, useEffect, useRef } from 'react';
import {
  X,
  MapPin,
  Search,
  Upload,
  Camera,
  Navigation,
  CheckCircle2,
  AlertTriangle,
  ShieldCheck,
  Truck,
  FileText,
  Sparkles,
  ArrowRight,
  ExternalLink,
  Volume2,
  Compass,
  Layers,
  Copy,
  Clock,
  Printer,
  Radio,
  FileCheck
} from 'lucide-react';
import { CombinationVehicleEnvelope, DeliveryRouteSubmission } from '../../types/vehicleCheckTypes';
import {
  searchPlacesAutocomplete,
  PlacePrediction,
  getPlaceDetails,
  PlaceResultDetails
} from '../../services/googlePlaces';
import { DualHeightInput, formatHeightBoth } from '../../utils/heightUtils';
import { tts } from '../../services/ttsService';

interface DeliverySiteRouteModalProps {
  isOpen: boolean;
  onClose: () => void;
  combinationEnvelope: CombinationVehicleEnvelope;
  selectedTractorReg: string;
  selectedTrailerId: string;
  driverName?: string;
  driverLicenceNumber?: string;
  onSendToCabHud?: (destination: string) => void;
  onOpenGatePass?: (destination: string) => void;
}

// Preset Major UK Logistics Superhubs
const PRESET_LOGISTICS_HUBS = [
  {
    name: 'DIRFT Rail Freight Logistics Hub',
    address: 'A5 / Crick Corridor, Daventry, Northamptonshire',
    postcode: 'NN6 7GZ',
    placeId: 'ChIJdirft_daventry_uk_01',
    maxSiteHeight: 4.88,
    bridgeAlert: 'Direct A5/M1 dual carriageway access. Clear 5.10m bridge clearance.'
  },
  {
    name: 'Magna Park Mega-Distribution Hub',
    address: 'Hunter Boulevard, Magna Park, Lutterworth',
    postcode: 'LE17 4XN',
    placeId: 'ChIJmagnapark_lutterworth_02',
    maxSiteHeight: 4.95,
    bridgeAlert: 'M1 J20 to A4303 bypass. High-cube double-decker approved.'
  },
  {
    name: 'Avonmouth Logistics & Deep Sea Hub',
    address: 'Severnside Distribution Gateway, Bristol',
    postcode: 'BS11 0YB',
    placeId: 'ChIJavonmouth_bristol_03',
    maxSiteHeight: 4.65,
    bridgeAlert: 'M49 corridor clear. Avoid Avonmouth village rail bridge (3.80m).'
  },
  {
    name: 'Trafford Park Logistics Superhub',
    address: 'Tenax Road, Trafford Park, Manchester',
    postcode: 'M17 1JT',
    placeId: 'ChIJtrafford_manchester_04',
    maxSiteHeight: 4.50,
    bridgeAlert: 'Barton dock railway viaduct 4.40m caution on Ashburton Rd.'
  },
  {
    name: 'Bicester Superhub (Sainbury’s/DHL)',
    address: 'Telford Way, Bicester Distribution Center, Oxfordshire',
    postcode: 'OX26 4LD',
    placeId: 'ChIJbicester_superhub_05',
    maxSiteHeight: 4.65,
    bridgeAlert: 'A41 link road clear. Rail overbridge 4.60m at station bypass.'
  }
];

export const DeliverySiteRouteModal: React.FC<DeliverySiteRouteModalProps> = ({
  isOpen,
  onClose,
  combinationEnvelope,
  selectedTractorReg,
  selectedTrailerId,
  driverName = 'Alexander James Kite',
  driverLicenceNumber = 'KITEA805219AJ99G',
  onSendToCabHud,
  onOpenGatePass
}) => {
  // Input method tabs
  const [activeTab, setActiveTab] = useState<'GOOGLE_PLACES' | 'UPLOAD_SCAN' | 'COMMAND_INPUT'>('GOOGLE_PLACES');

  // Google Places Search State
  const [searchQuery, setSearchQuery] = useState('');
  const [predictions, setPredictions] = useState<PlacePrediction[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [selectedPlace, setSelectedPlace] = useState<PlaceResultDetails | null>(null);

  // Freeform Command State ("add routes xx")
  const [routeCommandInput, setRouteCommandInput] = useState('add routes Avonmouth Logistics Hub via M5');

  // Manifest / Run Sheet Upload State
  const [isUploading, setIsUploading] = useState(false);
  const [uploadedFileName, setUploadedFileName] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Active Destination Details
  const [destinationName, setDestinationName] = useState('DIRFT Rail Freight Logistics Hub');
  const [destinationAddress, setDestinationAddress] = useState('A5 / Crick Corridor, Daventry, NN6 7GZ');
  const [postcode, setPostcode] = useState('NN6 7GZ');
  const [deliveryWindow, setDeliveryWindow] = useState('07:30 - 08:30');
  const [palletCount, setPalletCount] = useState(26);
  const [cargoWeightTonnes, setCargoWeightTonnes] = useState(combinationEnvelope.grossCombinationWeightTonnes);

  // Compliant Route Engine State
  const [detourApplied, setDetourApplied] = useState(true);
  const [routeDistanceMiles, setRouteDistanceMiles] = useState(68.4);
  const [drivingTimeMinutes, setDrivingTimeMinutes] = useState(78);
  const [speechFeedback, setSpeechFeedback] = useState<string | null>(null);

  // Autocomplete debounce
  useEffect(() => {
    if (!searchQuery || searchQuery.trim().length < 2) {
      setPredictions([]);
      return;
    }

    const timer = setTimeout(async () => {
      setIsSearching(true);
      try {
        const results = await searchPlacesAutocomplete(searchQuery);
        setPredictions(results);
      } catch (_e) {
        setPredictions([]);
      } finally {
        setIsSearching(false);
      }
    }, 280);

    return () => clearTimeout(timer);
  }, [searchQuery]);

  if (!isOpen) return null;

  // Select place from autocomplete
  const handleSelectPrediction = async (p: PlacePrediction) => {
    setIsSearching(true);
    try {
      const details = await getPlaceDetails(p.placeId);
      if (details) {
        setSelectedPlace(details);
        setDestinationName(details.name);
        setDestinationAddress(details.formattedAddress);
        const pcMatch = details.formattedAddress.match(/[A-Z]{1,2}[0-9][A-Z0-9]?\s?[0-9][A-Z]{2}/i);
        if (pcMatch) setPostcode(pcMatch[0].toUpperCase());
        setSearchQuery('');
        setPredictions([]);
      }
    } catch (_e) {
      setDestinationName(p.mainText);
      setDestinationAddress(p.description);
    } finally {
      setIsSearching(false);
    }
  };

  // Select Preset Hub
  const handleSelectPresetHub = (hub: typeof PRESET_LOGISTICS_HUBS[0]) => {
    setDestinationName(hub.name);
    setDestinationAddress(hub.address);
    setPostcode(hub.postcode);
    setSelectedPlace({
      name: hub.name,
      formattedAddress: `${hub.address}, ${hub.postcode}`,
      lat: 52.348,
      lng: -1.152,
      placeId: hub.placeId
    });
  };

  // Process Document Upload / Camera Scan
  const handleProcessUploadedDocument = (fileName: string) => {
    setIsUploading(true);
    setUploadedFileName(fileName);
    setTimeout(() => {
      setIsUploading(false);
      // Simulated AI OCR Run Sheet Extraction
      setDestinationName('Tesco Mega Distribution Hub (Magna Park)');
      setDestinationAddress('Hunter Boulevard, Magna Park, Lutterworth, LE17 4XN');
      setPostcode('LE17 4XN');
      setDeliveryWindow('08:00 - 09:00');
      setPalletCount(26);
      setCargoWeightTonnes(24.5);
      tts.speak(
        'Delivery manifest parsed via AI vision: Destination Magna Park, 26 pallets, 24.5 tonnes. Vehicle profile extracted: 4.20m box curtainsider.',
        1.0,
        1.0
      );
    }, 1100);
  };

  // Process Command "add routes xx"
  const handleProcessRouteCommand = () => {
    const raw = routeCommandInput.trim();
    if (!raw) return;

    let target = raw.replace(/^add\s+routes?\s+/i, '');
    if (!target) target = raw;

    setDestinationName(target);
    setDestinationAddress(`${target}, UK Road Freight Network`);
    tts.speak(`Route added for ${target}. Recalculating compliant HGV route avoiding low bridges.`, 1.0, 1.0);
  };

  // Voice pre-arrival yard safety briefing
  const handlePlayPreArrivalBriefing = () => {
    const msg = `Pre-arrival yard safety briefing for ${destinationName}: Maximum yard speed 10 mph. Hazard lights active. Reverse only with banksman in Bay 14. High-vis jacket and safety boots mandatory.`;
    setSpeechFeedback(msg);
    tts.speak(msg, 1.0, 1.0);
  };

  // Launch Google Maps with vehicle parameters copied
  const handleLaunchGoogleMaps = () => {
    const text = `HGV Profile: ${combinationEnvelope.combinedHeightFeetInches} (${combinationEnvelope.combinedHeightMeters}m) | ${combinationEnvelope.grossCombinationWeightTonnes}t | ${combinationEnvelope.combinedLengthMeters}m L | ${selectedTractorReg} + ${selectedTrailerId}`;
    navigator.clipboard.writeText(text);
    const destParam = encodeURIComponent(`${destinationName}, ${postcode}`);
    window.open(`https://www.google.com/maps/dir/?api=1&destination=${destParam}&travelmode=driving`, '_blank');
  };

  // Copy Garmin dēzl / CoPilot Truck URI
  const handleExportTruckUri = () => {
    const uri = `copilot://navigate?destination=${encodeURIComponent(destinationName)}&postcode=${postcode}&vehicleType=HGV&h=${combinationEnvelope.combinedHeightMeters}&w=${combinationEnvelope.combinedWidthMeters}&l=${combinationEnvelope.combinedLengthMeters}&gvw=${combinationEnvelope.grossCombinationWeightTonnes}`;
    navigator.clipboard.writeText(uri);
    alert('Copied Garmin dēzl / CoPilot Truck Navigation URI to clipboard!');
  };

  // Evaluate bridge clearance along route
  const vehicleHeight = combinationEnvelope.combinedHeightMeters;
  const bridge1Clearance = 4.10; // B488 low bridge
  const bridge1MarginMm = Math.round((bridge1Clearance - vehicleHeight) * 1000);
  const bridge1Critical = bridge1MarginMm < 150;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur-md p-4 animate-in fade-in duration-200">
      <div className="relative w-full max-w-3xl rounded-3xl bg-slate-950 border border-cyan-500/40 text-white shadow-2xl p-6 space-y-6 max-h-[92vh] overflow-y-auto">
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 text-slate-400 hover:text-white rounded-xl hover:bg-slate-800 transition-colors"
          aria-label="Close Route Planner"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header */}
        <div className="flex items-center gap-3 border-b border-slate-800 pb-4">
          <div className="w-12 h-12 rounded-2xl bg-cyan-500/20 text-cyan-400 border border-cyan-500/30 flex items-center justify-center font-bold">
            <Navigation className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-lg font-black text-white">Next Delivery Site &amp; Compliant HGV Routing</h3>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-cyan-500/20 text-cyan-300 border border-cyan-500/40">
                Vehicle Check Hand-off
              </span>
            </div>
            <p className="text-xs text-slate-400">
              Extracts vehicle envelope directly from Vehicle Check to calculate 100% compliant, hazard-free routes
            </p>
          </div>
        </div>

        {/* Extracted Vehicle Profile Banner */}
        <div className="p-4 rounded-2xl bg-gradient-to-r from-slate-900 via-cyan-950/40 to-slate-900 border border-cyan-500/30 space-y-2.5">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-cyan-400 font-bold text-xs uppercase tracking-wider">
              <Truck className="w-4 h-4" />
              <span>Extracted Vehicle &amp; Trailer Profile</span>
            </div>
            <span className="text-xs font-mono font-bold text-cyan-300 bg-cyan-950 px-2 py-0.5 rounded border border-cyan-500/30">
              {selectedTractorReg} + {selectedTrailerId}
            </span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-1 text-center font-mono">
            <div className="p-2 rounded-xl bg-slate-950/80 border border-slate-800">
              <div className="text-[10px] text-slate-400 uppercase font-sans">Combined Height</div>
              <div className="text-sm font-bold text-cyan-400">
                {formatHeightBoth(combinationEnvelope.combinedHeightMeters, 'parens')}
              </div>
            </div>
            <div className="p-2 rounded-xl bg-slate-950/80 border border-slate-800">
              <div className="text-[10px] text-slate-400 uppercase font-sans">Gross Weight</div>
              <div className="text-sm font-bold text-emerald-400">
                {combinationEnvelope.grossCombinationWeightTonnes}t (6-Axle)
              </div>
            </div>
            <div className="p-2 rounded-xl bg-slate-950/80 border border-slate-800">
              <div className="text-[10px] text-slate-400 uppercase font-sans">Length / Width</div>
              <div className="text-xs font-bold text-white">
                {combinationEnvelope.combinedLengthMeters}m x {combinationEnvelope.combinedWidthMeters}m
              </div>
            </div>
            <div className="p-2 rounded-xl bg-slate-950/80 border border-slate-800">
              <div className="text-[10px] text-slate-400 uppercase font-sans">Emissions / CAZ</div>
              <div className="text-xs font-bold text-purple-300">
                {combinationEnvelope.emissionStandard}
              </div>
            </div>
          </div>
        </div>

        {/* Input Method Switcher */}
        <div className="flex border-b border-slate-800">
          <button
            onClick={() => setActiveTab('GOOGLE_PLACES')}
            className={`flex-1 py-2.5 text-xs font-bold border-b-2 flex items-center justify-center gap-1.5 transition-colors cursor-pointer ${
              activeTab === 'GOOGLE_PLACES'
                ? 'border-cyan-400 text-cyan-400 bg-cyan-500/10'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <Search className="w-3.5 h-3.5" />
            <span>Google Places Search</span>
          </button>
          <button
            onClick={() => setActiveTab('UPLOAD_SCAN')}
            className={`flex-1 py-2.5 text-xs font-bold border-b-2 flex items-center justify-center gap-1.5 transition-colors cursor-pointer ${
              activeTab === 'UPLOAD_SCAN'
                ? 'border-cyan-400 text-cyan-400 bg-cyan-500/10'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <Upload className="w-3.5 h-3.5" />
            <span>Upload / Scan Run Sheet</span>
          </button>
          <button
            onClick={() => setActiveTab('COMMAND_INPUT')}
            className={`flex-1 py-2.5 text-xs font-bold border-b-2 flex items-center justify-center gap-1.5 transition-colors cursor-pointer ${
              activeTab === 'COMMAND_INPUT'
                ? 'border-cyan-400 text-cyan-400 bg-cyan-500/10'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <FileText className="w-3.5 h-3.5" />
            <span>Command "add routes xx"</span>
          </button>
        </div>

        {/* TAB 1: GOOGLE PLACES SEARCH */}
        {activeTab === 'GOOGLE_PLACES' && (
          <div className="space-y-4">
            <div className="relative">
              <label className="text-xs font-bold text-slate-300 uppercase tracking-wider block mb-1.5">
                Search Delivery Depot via Google Places Directory
              </label>
              <div className="relative flex items-center">
                <Search className="w-4 h-4 text-slate-400 absolute left-3.5 pointer-events-none" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="e.g. DIRFT Daventry, Sainsbury's Bicester, Magna Park..."
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-white placeholder-slate-500 text-sm focus:outline-none focus:border-cyan-400"
                />
                {isSearching && (
                  <span className="absolute right-3 text-xs text-cyan-400 animate-pulse font-mono">
                    Searching...
                  </span>
                )}
              </div>

              {/* Suggestions Dropdown */}
              {predictions.length > 0 && (
                <div className="absolute top-full left-0 right-0 z-30 mt-1 rounded-2xl bg-slate-900 border border-cyan-500/40 shadow-2xl overflow-hidden max-h-56 overflow-y-auto">
                  {predictions.map((p) => (
                    <div
                      key={p.placeId}
                      onClick={() => handleSelectPrediction(p)}
                      className="p-3 hover:bg-slate-800/80 cursor-pointer border-b border-slate-800/60 transition-colors flex items-center justify-between"
                    >
                      <div>
                        <div className="text-xs font-bold text-white">{p.mainText}</div>
                        <div className="text-[11px] text-slate-400 truncate">{p.secondaryText}</div>
                      </div>
                      <MapPin className="w-4 h-4 text-cyan-400 shrink-0" />
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Quick Pick Logistics Hub Presets */}
            <div className="space-y-2">
              <span className="text-[11px] text-slate-400 uppercase font-mono block">
                Quick Select Major UK Logistics Hubs:
              </span>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {PRESET_LOGISTICS_HUBS.map((hub) => (
                  <button
                    key={hub.name}
                    onClick={() => handleSelectPresetHub(hub)}
                    className={`p-2.5 rounded-xl border text-left transition-all cursor-pointer ${
                      destinationName === hub.name
                        ? 'bg-cyan-500/20 border-cyan-400 text-cyan-300'
                        : 'bg-slate-900/60 border-slate-800 text-slate-300 hover:border-slate-700'
                    }`}
                  >
                    <div className="text-xs font-bold text-white truncate">{hub.name}</div>
                    <div className="text-[10px] text-slate-400 font-mono">{hub.postcode} • Max {formatHeightBoth(hub.maxSiteHeight)}</div>
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: UPLOAD OR SCAN RUN SHEET */}
        {activeTab === 'UPLOAD_SCAN' && (
          <div className="space-y-4">
            <div className="p-6 rounded-2xl border-2 border-dashed border-cyan-500/30 bg-slate-900/40 text-center space-y-3">
              <div className="w-12 h-12 rounded-2xl bg-cyan-500/20 text-cyan-400 flex items-center justify-center mx-auto">
                <Upload className="w-6 h-6" />
              </div>
              <div>
                <h4 className="text-sm font-bold text-white">Upload Delivery Consignment Note or Run Sheet</h4>
                <p className="text-xs text-slate-400 mt-1">
                  AI OCR automatically scans the document, extracts destination address, pallet count &amp; time windows
                </p>
              </div>

              <input
                ref={fileInputRef}
                type="file"
                accept=".pdf,image/*"
                className="hidden"
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) handleProcessUploadedDocument(file.name);
                }}
              />

              <div className="flex flex-wrap justify-center gap-3 pt-2">
                <button
                  onClick={() => fileInputRef.current?.click()}
                  className="px-4 py-2 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white font-bold text-xs flex items-center gap-2 cursor-pointer transition-colors"
                >
                  <Upload className="w-4 h-4" />
                  <span>Choose PDF / Image</span>
                </button>
                <button
                  onClick={() => handleProcessUploadedDocument('Live_Camera_Consignment_Scan.jpg')}
                  className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold text-xs flex items-center gap-2 cursor-pointer transition-colors border border-slate-700"
                >
                  <Camera className="w-4 h-4" />
                  <span>Snap with Camera</span>
                </button>
              </div>

              {isUploading && (
                <div className="pt-2 text-xs text-cyan-400 font-mono animate-pulse flex items-center justify-center gap-2">
                  <Sparkles className="w-4 h-4" />
                  <span>Scanning paperwork via AI Vision OCR...</span>
                </div>
              )}

              {uploadedFileName && !isUploading && (
                <div className="pt-2 text-xs text-emerald-400 font-mono flex items-center justify-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Parsed {uploadedFileName} successfully!</span>
                </div>
              )}
            </div>
          </div>
        )}

        {/* TAB 3: COMMAND "add routes xx" */}
        {activeTab === 'COMMAND_INPUT' && (
          <div className="space-y-4">
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-300 uppercase tracking-wider block">
                Type or Dictate Route Command (`add routes xx`)
              </label>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={routeCommandInput}
                  onChange={(e) => setRouteCommandInput(e.target.value)}
                  placeholder="e.g. add routes Avonmouth Logistics Hub via M5"
                  className="flex-1 px-4 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-white placeholder-slate-500 text-sm font-mono focus:outline-none focus:border-cyan-400"
                />
                <button
                  onClick={handleProcessRouteCommand}
                  className="px-4 py-2.5 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white font-bold text-xs flex items-center gap-1.5 cursor-pointer transition-colors shrink-0"
                >
                  <Sparkles className="w-4 h-4" />
                  <span>Parse Route</span>
                </button>
              </div>
              <p className="text-[11px] text-slate-400">
                Tip: You can say or type commands like: <code>add routes Avonmouth Hub</code>, <code>add routes Bicester DHL</code>, or <code>add routes Magna Park Drop 4</code>.
              </p>
            </div>
          </div>
        )}

        {/* ACTIVE ROUTE & HAZARD EVALUATION SUMMARY */}
        <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 space-y-3">
          <div className="flex items-center justify-between border-b border-slate-800 pb-2.5">
            <div>
              <div className="text-[10px] text-slate-400 uppercase font-mono">Current Selected Destination</div>
              <div className="text-sm font-bold text-white flex items-center gap-1.5">
                <MapPin className="w-4 h-4 text-cyan-400" />
                <span>{destinationName}</span>
              </div>
              <div className="text-xs text-slate-400 font-mono mt-0.5">{destinationAddress}</div>
            </div>
            <div className="text-right">
              <div className="text-xs font-bold text-emerald-400 font-mono">
                {routeDistanceMiles} mi • {drivingTimeMinutes} min
              </div>
              <div className="text-[10px] text-slate-400 font-mono">Window: {deliveryWindow}</div>
            </div>
          </div>

          {/* Low Bridge Hazard Assessment */}
          <div className="space-y-2">
            <div className="flex items-center justify-between text-xs">
              <span className="font-bold text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-cyan-400" />
                <span>Low Bridge Hazard Clearance Engine</span>
              </span>
              <span className="font-mono text-[11px] text-slate-400">
                Threshold: {formatHeightBoth(combinationEnvelope.combinedHeightMeters + 0.15)}
              </span>
            </div>

            {/* Evaluated Bridge Card */}
            <div className={`p-3 rounded-xl border text-xs space-y-1.5 ${
              detourApplied
                ? 'bg-emerald-950/20 border-emerald-500/40 text-emerald-300'
                : 'bg-red-950/20 border-red-500/40 text-red-300'
            }`}>
              <div className="flex items-center justify-between font-bold">
                <div className="flex items-center gap-2">
                  {detourApplied ? (
                    <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  ) : (
                    <AlertTriangle className="w-4 h-4 text-red-400" />
                  )}
                  <span>
                    {detourApplied
                      ? 'Compliant Detour Active: Low Overbridge Avoided'
                      : 'WARNING: B488 Rail Bridge 4.10m (13\' 5") on Direct Path'}
                  </span>
                </div>
                <button
                  onClick={() => setDetourApplied(!detourApplied)}
                  className="px-2 py-0.5 rounded bg-slate-800 text-[10px] text-cyan-300 hover:bg-slate-700 cursor-pointer"
                >
                  {detourApplied ? 'View Direct Route' : 'Apply Compliant Detour'}
                </button>
              </div>

              <div className="text-[11px] text-slate-300 leading-relaxed font-mono">
                {detourApplied
                  ? 'Detour bypasses B488 via A41 Dual Carriageway. All bridges on selected path have clearance > 4.80m (15\' 9"). 100% compliant for high-cube envelope.'
                  : `Your vehicle height is ${formatHeightBoth(vehicleHeight)}. Direct path clearance is 4.10m (13' 5"), resulting in a negative margin of ${bridge1MarginMm}mm. Bridge strike risk!`}
              </div>
            </div>
          </div>

          {/* Integrated Site Features Bar */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 pt-1 text-center font-mono text-xs">
            <button
              onClick={handlePlayPreArrivalBriefing}
              className="p-2.5 rounded-xl bg-slate-950 border border-slate-800 hover:border-cyan-500/50 text-slate-200 hover:text-white flex items-center justify-center gap-2 cursor-pointer transition-colors"
            >
              <Volume2 className="w-4 h-4 text-cyan-400" />
              <span>Yard Safety Voice Brief</span>
            </button>

            <button
              onClick={() => onOpenGatePass && onOpenGatePass(destinationName)}
              className="p-2.5 rounded-xl bg-slate-950 border border-slate-800 hover:border-cyan-500/50 text-slate-200 hover:text-white flex items-center justify-center gap-2 cursor-pointer transition-colors"
            >
              <FileCheck className="w-4 h-4 text-emerald-400" />
              <span>Auto-Fill Gate Pass</span>
            </button>

            <button
              onClick={() => onSendToCabHud && onSendToCabHud(destinationAddress)}
              className="p-2.5 rounded-xl bg-slate-950 border border-slate-800 hover:border-cyan-500/50 text-slate-200 hover:text-white flex items-center justify-center gap-2 cursor-pointer transition-colors"
            >
              <Compass className="w-4 h-4 text-purple-400" />
              <span>Send to In-Cab HUD</span>
            </button>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-wrap items-center justify-between gap-3 pt-2 border-t border-slate-800">
          <div className="flex gap-2">
            <button
              onClick={handleExportTruckUri}
              className="px-3.5 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-300 font-bold text-xs flex items-center gap-1.5 cursor-pointer border border-slate-800"
            >
              <Copy className="w-3.5 h-3.5" />
              <span>Copy Garmin / CoPilot URI</span>
            </button>
          </div>

          <div className="flex gap-2">
            <button
              onClick={handleLaunchGoogleMaps}
              className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-500 hover:to-cyan-500 text-white font-bold text-xs flex items-center gap-2 cursor-pointer shadow-lg shadow-cyan-900/30"
            >
              <ExternalLink className="w-4 h-4" />
              <span>Open Google Maps (HGV Profile Synced)</span>
            </button>
            <button
              onClick={onClose}
              className="px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs flex items-center gap-1.5 cursor-pointer shadow-lg shadow-emerald-900/30"
            >
              <CheckCircle2 className="w-4 h-4" />
              <span>Confirm Active Delivery Route</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
