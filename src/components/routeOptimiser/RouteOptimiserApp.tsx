'use client';
import React, { useState, useCallback, useRef } from 'react';
import { APIProvider, Map, useMap, useMapsLibrary } from '@vis.gl/react-google-maps';
import { RouteState, VehicleProfile, RouteSummary, SnackbarMessage, VoiceAction } from '../../types/routeOptimiserTypes';
import { DEMO_ROUTE, DEFAULT_VEHICLE, revalidateRoute } from '../../services/routeOptimiserData';
import { speak } from '../../services/routeOptimiserVoice';
import { formatHeightBoth } from '../../utils/heightUtils';
import { DriverLicenceProfile, DriverVehicleProfile } from '../../types';
import { INITIAL_LAYBYS } from '../driver/LaybyCapacityRadarModal';

import { VehicleChip } from './VehicleChip';
import { RouteSummaryCard } from './RouteSummaryCard';
import { EmptyState } from './EmptyState';
import { ConfirmModal } from './ConfirmModal';
import { Snackbar } from './Snackbar';
import { TrailerMemoryModal } from './TrailerMemoryModal';
import { TrailerSwapAlert } from './TrailerSwapAlert';
import { VoiceCoPilot } from './VoiceCoPilot';
import {
  Navigation,
  Truck,
  ShieldCheck,
  ShieldAlert,
  AlertTriangle,
  RotateCcw,
  Sparkles,
  MapPin,
  Compass,
  ArrowRight,
  Maximize2,
  ChevronDown,
  ChevronRight,
  Layers,
  Calendar
} from 'lucide-react';
import { AmazonTourNavigator } from './AmazonTourNavigator';
import { PreTripWalkaroundStep } from './PreTripWalkaroundStep';
import { TourStop } from '../../services/amazonTourData';

interface RouteOptimiserAppProps {
  onOpenLicenceScanner?: () => void;
  driverLicenceProfile?: DriverLicenceProfile | null;
  driverVehicle?: DriverVehicleProfile;
  onUpdateDriverVehicle?: (vehicle: DriverVehicleProfile) => void;
  onSwitchToTachoScan?: () => void;
  onSwitchToVehicleCheck?: () => void;
  onSwitchToSiteRisk?: () => void;
  onSwitchToSafetyShield?: () => void;
}

const MAPS_API_KEY =
  (typeof process !== 'undefined' && process.env?.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY) ||
  (typeof import.meta !== 'undefined' && (import.meta as any).env?.VITE_GOOGLE_MAPS_API_KEY) ||
  '';
const DEMO_MAP_ID  = 'DEMO_HGV_MAP_ID';

// ─── Google Maps Route Polyline Subcomponent ──────────────────────────────────
function RoutePolyline({ active }: { active: boolean }) {
  const map       = useMap();
  const routesLib = useMapsLibrary('routes');
  const polyRef   = useRef<any>(null);

  React.useEffect(() => {
    if (routesLib && map && active && !polyRef.current && typeof window !== 'undefined' && (window as any).google?.maps) {
      const path = [
        { lat: 52.334, lng: -1.083 }, // Daventry DIRFT
        { lat: 52.200, lng: -1.230 }, // Rugby
        { lat: 51.950, lng: -1.000 }, // Milton Keynes
        { lat: 51.720, lng: -0.500 }, // Hemel Hempstead
        { lat: 51.533, lng: -0.277 }, // Park Royal London
      ];
      polyRef.current = new (window as any).google.maps.Polyline({
        path,
        strokeColor:   '#3b82f6',
        strokeOpacity: 0.9,
        strokeWeight:  6,
        map,
      });
    }
    if (!active && polyRef.current) {
      polyRef.current.setMap(null);
      polyRef.current = null;
    }
  }, [routesLib, map, active]);

  return null;
}

// ─── Inner Route Optimiser Core ───────────────────────────────────────────────
export const RouteOptimiserInner: React.FC<RouteOptimiserAppProps> = ({
  onOpenLicenceScanner,
  driverLicenceProfile,
  driverVehicle,
  onUpdateDriverVehicle,
  onSwitchToTachoScan,
  onSwitchToVehicleCheck,
  onSwitchToSiteRisk,
  onSwitchToSafetyShield
}) => {
  // Route State Machine
  const [routeState, setRouteState] = useState<RouteState>('IDLE');
  const [activeRoute, setActiveRoute] = useState<RouteSummary | null>(null);
  const [vehicle, setVehicle] = useState<VehicleProfile>(() => {
    if (driverVehicle) {
      return {
        height: driverVehicle.heightMeters || DEFAULT_VEHICLE.height,
        weight: driverVehicle.weightTonnes || DEFAULT_VEHICLE.weight,
        width: driverVehicle.widthMeters || DEFAULT_VEHICLE.width,
        trailerType: driverVehicle.vehicleCategory || DEFAULT_VEHICLE.trailerType,
        trailerName: driverVehicle.currentTrailerNumber
          ? `${driverVehicle.currentHaulierCompany ? driverVehicle.currentHaulierCompany + ' ' : ''}#${driverVehicle.currentTrailerNumber}`
          : DEFAULT_VEHICLE.trailerName,
      };
    }
    return DEFAULT_VEHICLE;
  });
  const [snackbars, setSnackbars] = useState<SnackbarMessage[]>([]);
  const [prevRoute, setPrevRoute] = useState<{ route: RouteSummary; state: RouteState } | null>(null);

  // Modals & Dialogs
  const [workflowStep, setWorkflowStep] = useState<1 | 2 | 3>(2);
  const [showClearConfirm, setShowClearConfirm] = useState(false);
  const [showTrailerModal, setShowTrailerModal] = useState(false);
  const [mobilePanelOpen, setMobilePanelOpen] = useState(true);
  const [trailerSwapAlert, setTrailerSwapAlert] = useState<{
    newRestrictions: ReturnType<typeof revalidateRoute>['restrictions'];
    hasNew: boolean;
    isImpossible: boolean;
    newProfile: VehicleProfile;
  } | null>(null);

  // ─── Sync Vehicle Changes with Shared Drive Partners State & LocalStorage ──
  const syncVehicleProfile = useCallback((newProfile: VehicleProfile) => {
    const trailerNum = (newProfile.trailerName || '').replace(/.*#/, '').trim() || newProfile.trailerName;
    if (onUpdateDriverVehicle && driverVehicle) {
      onUpdateDriverVehicle({
        ...driverVehicle,
        heightMeters: newProfile.height,
        weightTonnes: newProfile.weight,
        widthMeters: newProfile.width,
        currentTrailerNumber: trailerNum,
      });
    }
    try {
      const current = localStorage.getItem('siterisk_pro_vehicle_v2');
      const parsed = current ? JSON.parse(current) : {};
      localStorage.setItem('siterisk_pro_vehicle_v2', JSON.stringify({
        ...parsed,
        heightMeters: newProfile.height,
        weightTonnes: newProfile.weight,
        widthMeters: newProfile.width,
        currentTrailerNumber: trailerNum,
      }));
    } catch (e) {
      console.warn('Failed syncing vehicle to localStorage', e);
    }
  }, [onUpdateDriverVehicle, driverVehicle]);

  // ─── Snackbar Notification Helpers ──────────────────────────────────────────
  const addSnackbar = useCallback((text: string, action?: SnackbarMessage['action']) => {
    const id = Date.now().toString();
    setSnackbars((prev) => [...prev, { id, text, action }]);
    return id;
  }, []);

  const dismissSnackbar = useCallback((id: string) => {
    setSnackbars((prev) => prev.filter((s) => s.id !== id));
  }, []);

  // ─── Clear Route Confirmation & Execution ───────────────────────────────────
  const requiresClearConfirm = () =>
    routeState === 'NAVIGATING' ||
    (activeRoute !== null &&
      (activeRoute.restrictions.some((r) => r.severity === 'critical') ||
       activeRoute.distanceMiles > 5));

  const handleClearRequest = useCallback(() => {
    if (requiresClearConfirm()) {
      setShowClearConfirm(true);
    } else {
      executeClear();
    }
  }, [routeState, activeRoute]);

  const executeClear = useCallback(() => {
    const snapshot = activeRoute ? { route: activeRoute, state: routeState } : null;
    setPrevRoute(snapshot);
    setActiveRoute(null);
    setRouteState('IDLE');
    setShowClearConfirm(false);

    addSnackbar('Route cleared. Residual hazards removed.', {
      label: 'Undo',
      onClick: () => {
        if (snapshot) {
          setActiveRoute(snapshot.route);
          setRouteState(snapshot.state);
          speak('Route restored.');
        }
      },
    });

    speak('Route cleared. Residual hazards removed.');
  }, [activeRoute, routeState, addSnackbar]);

  // ─── Plan & Start Navigation ────────────────────────────────────────────────
  const planRoute = useCallback((destination?: string) => {
    const route: RouteSummary = {
      ...DEMO_ROUTE,
      destination: destination || DEMO_ROUTE.destination,
    };
    setActiveRoute(route);
    setRouteState('VALIDATED');
    const criticalCount = route.restrictions.filter((r) => r.severity === 'critical').length;
    speak(
      `Route planned to ${route.destination}. ${route.distanceMiles} miles, ${route.etaMinutes} minutes. ${
        criticalCount > 0 ? `${criticalCount} critical restrictions flagged.` : 'Full clearance.'
      }`
    );
  }, []);

  const handleStartNavigation = useCallback(() => {
    if (routeState !== 'NAVIGATING') {
      setRouteState('NAVIGATING');
      speak('Starting HGV turn-by-turn navigation. Route Optimiser bridge radar active.');
    }
  }, [routeState]);

  // ─── Trailer Swap (Trailer Fleet Memory) ────────────────────────────────────
  const handleTrailerSwap = useCallback((newProfile: VehicleProfile) => {
    syncVehicleProfile(newProfile);
    if (activeRoute && routeState !== 'IDLE') {
      const result = revalidateRoute(activeRoute.restrictions, newProfile);

      if (!result.hasNewHazards) {
        setVehicle(newProfile);
        setActiveRoute({ ...activeRoute, restrictions: result.restrictions });
        const heightNotice = formatHeightBoth(newProfile.height);
        addSnackbar(`Trailer swapped to ${newProfile.trailerName}. Route clear for ${heightNotice}.`);
        speak(`Trailer updated. Route still fully clear for ${newProfile.height} metres.`);
      } else {
        setTrailerSwapAlert({
          newRestrictions: result.restrictions,
          hasNew: result.hasNewHazards,
          isImpossible: result.isImpossible,
          newProfile,
        });
      }
    } else {
      setVehicle(newProfile);
      addSnackbar(`Vehicle profile updated: ${newProfile.trailerName || 'Trailer'}`);
    }
  }, [activeRoute, routeState, addSnackbar, syncVehicleProfile]);

  const confirmSafeDetour = useCallback(() => {
    if (!trailerSwapAlert) return;
    syncVehicleProfile(trailerSwapAlert.newProfile);
    setVehicle(trailerSwapAlert.newProfile);
    setActiveRoute((prev) => prev ? { ...prev, restrictions: trailerSwapAlert.newRestrictions.filter(r => r.severity !== 'critical') } : null);
    setTrailerSwapAlert(null);
    addSnackbar('Safe detour engaged. Critical hazards avoided.');
    speak('Safe detour engaged. Route re-validated for new trailer height.');
  }, [trailerSwapAlert, addSnackbar, syncVehicleProfile]);

  const keepCurrentRoute = useCallback(() => {
    if (!trailerSwapAlert) return;
    syncVehicleProfile(trailerSwapAlert.newProfile);
    setVehicle(trailerSwapAlert.newProfile);
    setTrailerSwapAlert(null);
    addSnackbar('Warning: Proceeding with low clearance margin.', undefined);
    speak('Warning: Proceeding on route with reduced clearance margins.');
  }, [trailerSwapAlert, addSnackbar, syncVehicleProfile]);

  // ─── Avoid Specific Restriction ─────────────────────────────────────────────
  const handleAvoidRestriction = useCallback((id: string) => {
    if (!activeRoute) return;
    const removed = activeRoute.restrictions.find((r) => r.id === id);
    const updated = activeRoute.restrictions.filter((r) => r.id !== id);
    setActiveRoute({ ...activeRoute, restrictions: updated });
    addSnackbar(`Avoiding ${removed?.label ?? 'hazard'}. Re-routing around bridge…`);
    speak('Re-routing around hazard point.');
  }, [activeRoute, addSnackbar]);

  // ─── Voice Command Dispatcher ───────────────────────────────────────────────
  const handleVoiceCommand = useCallback((action: VoiceAction, transcript: string) => {
    switch (action) {
      case 'CLEAR_ROUTE':
        handleClearRequest();
        break;
      case 'AVOID_LOW_BRIDGES':
        if (activeRoute) {
          const safest = activeRoute.restrictions.filter((r) => r.severity !== 'critical');
          setActiveRoute({ ...activeRoute, restrictions: safest });
          addSnackbar('Re-routing for maximum clearance.');
          speak('Re-routing for maximum clearance. All critical bridge hazards bypassed.');
        } else {
          speak('No active route to re-optimise.');
        }
        break;
      case 'FIND_NEXT_LAYBY': {
        const openLayby = INITIAL_LAYBYS.find((l) => l.capacityStatus === 'OPEN') || INITIAL_LAYBYS[0];
        if (openLayby) {
          const msg = `Layby Radar: nearest ${openLayby.capacityStatus.toLowerCase()} parking is ${openLayby.name} (${openLayby.distanceMiles} mi ahead on ${openLayby.road}, ${openLayby.openSpacesEstimated}/${openLayby.totalSpaces} bays free).`;
          addSnackbar(msg);
          speak(`Nearest open HGV layby is ${openLayby.name} on the ${openLayby.road}, ${openLayby.distanceMiles} miles ahead. ${openLayby.openSpacesEstimated} bays vacant.`);
        } else {
          addSnackbar('Layby Radar: nearest OPEN site 4.2 miles ahead (A5 Eastbound).');
          speak('Nearest open HGV layby is 4.2 miles ahead on the A5 Eastbound. 6 bays vacant.');
        }
        break;
      }
      case 'WHAT_IS_CLEARANCE':
        if (activeRoute) {
          const critical = activeRoute.restrictions.filter((r) => r.severity === 'critical');
          const msg = critical.length
            ? `${critical.length} critical collision hazard${critical.length > 1 ? 's' : ''}. First in ${critical[0].distanceMiles.toFixed(1)} miles at ${formatHeightBoth(critical[0].clearanceMetres)} clearance.`
            : `Route is clear. Minimum bridge clearance is 4.8m along the corridor.`;
          addSnackbar(msg);
          speak(msg);
        } else {
          speak(`No active route. Vehicle height is set to ${formatHeightBoth(vehicle.height)}.`);
        }
        break;
      default:
        addSnackbar(`Heard: "${transcript}" — try "Clear route" or "Avoid low bridges".`);
        speak('Command not recognised. You can say: clear route, avoid low bridges, or find next layby.');
    }
  }, [handleClearRequest, activeRoute, vehicle, addSnackbar]);

  const showActiveRoute = Boolean(activeRoute && routeState !== 'IDLE');

  return (
    <div className="flex-1 flex flex-col h-full bg-slate-950 text-slate-100 overflow-hidden relative font-sans">
      {/* ── Top Header & App Switcher ─────────────────────────────────────── */}
      <header className="bg-slate-900/90 backdrop-blur-md border-b border-slate-800 px-4 py-2.5 flex items-center justify-between z-30 shrink-0">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2">
            <div className="h-8 w-8 rounded-xl bg-blue-600/20 text-blue-400 border border-blue-500/30 flex items-center justify-center">
              <Navigation className="w-4 h-4" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-sm sm:text-base font-extrabold text-white tracking-tight">
                  Route Optimiser
                </h1>
                <span className="text-[10px] px-1.5 py-0.5 rounded bg-blue-500/20 text-blue-300 font-bold border border-blue-500/30">
                  HGV CLEARANCE
                </span>
              </div>
              <p className="text-[11px] text-slate-400 hidden sm:block">
                Drive Partners · Clear Route · Voice Co-Pilot · Mid-Route Trailer Swap
              </p>
            </div>
          </div>
        </div>

        {/* Center / Right Suite Switcher Pills */}
        <div className="flex items-center gap-2">
          <div className="hidden lg:flex items-center p-1 rounded-xl bg-slate-950 border border-slate-800">
            <button
              onClick={onSwitchToTachoScan}
              className="px-2.5 py-1 text-xs font-bold text-slate-400 hover:text-white transition-colors cursor-pointer"
            >
              ⏱️ Tacho-Scan
            </button>
            <button
              onClick={onSwitchToVehicleCheck}
              className="px-2.5 py-1 text-xs font-bold text-slate-400 hover:text-white transition-colors cursor-pointer"
            >
              🚛 Vehicle-Check
            </button>
            <button
              onClick={onSwitchToSiteRisk}
              className="px-2.5 py-1 text-xs font-bold text-slate-400 hover:text-white transition-colors cursor-pointer"
            >
              🛡️ SiteRisk
            </button>
            <span className="px-2.5 py-1 text-xs font-bold bg-blue-600 text-white rounded-lg shadow-sm">
              🗺️ Route Optimiser
            </span>
            {onSwitchToSafetyShield && (
              <button
                onClick={onSwitchToSafetyShield}
                className="px-2.5 py-1 text-xs font-bold text-rose-400 hover:text-white transition-colors cursor-pointer flex items-center gap-1"
              >
                <span>🌉 Safety Shield</span>
                <span className="text-[9px] px-1 py-0.2 rounded bg-rose-500/20 text-rose-300 font-black">
                  7
                </span>
              </button>
            )}
          </div>

          <VehicleChip profile={vehicle} onClick={() => setShowTrailerModal(true)} />

          {onOpenLicenceScanner && (
            <button
              onClick={onOpenLicenceScanner}
              className="text-xs font-mono text-cyan-400 hover:text-cyan-300 flex items-center gap-1 cursor-pointer px-2.5 py-1.5 rounded-lg bg-slate-800 border border-slate-700"
            >
              <span>👤 {driverLicenceProfile ? driverLicenceProfile.fullName.split(' ')[0] : 'Driver ID'}</span>
            </button>
          )}
        </div>
      </header>

      {/* ── Option 3: Sequential 3-Step Driver Journey Stepper ────────────── */}
      <div className="bg-slate-900/95 border-b border-slate-800 px-4 py-2 z-20 shrink-0 backdrop-blur-md">
        <div className="max-w-4xl mx-auto flex items-center justify-between gap-1.5 sm:gap-3">
          {/* Step 1: Pre-Trip Walkaround */}
          <button
            onClick={() => setWorkflowStep(1)}
            className={`flex-1 flex items-center justify-center sm:justify-start gap-2 px-3 py-2 rounded-xl text-xs font-bold transition-all border cursor-pointer ${
              workflowStep === 1
                ? 'bg-blue-600 text-white border-blue-400 shadow-md shadow-blue-600/30'
                : 'bg-slate-800/60 text-slate-400 border-slate-700/80 hover:text-white'
            }`}
          >
            <span className="w-5 h-5 rounded-full bg-slate-900/60 flex items-center justify-center text-[10px] font-mono">
              1
            </span>
            <span className="truncate">1. Pre-Trip Check</span>
          </button>

          <ChevronRight className="w-4 h-4 text-slate-600 shrink-0 hidden sm:block" />

          {/* Step 2: Tour & Clearance Dispatch */}
          <button
            onClick={() => setWorkflowStep(2)}
            className={`flex-1 flex items-center justify-center sm:justify-start gap-2 px-3 py-2 rounded-xl text-xs font-bold transition-all border cursor-pointer ${
              workflowStep === 2
                ? 'bg-amber-500 text-slate-950 font-black border-amber-400 shadow-md shadow-amber-500/25'
                : 'bg-slate-800/60 text-slate-400 border-slate-700/80 hover:text-white'
            }`}
          >
            <span className="w-5 h-5 rounded-full bg-slate-900/60 flex items-center justify-center text-[10px] font-mono">
              2
            </span>
            <span className="truncate">2. Tour Dispatch (5-Day)</span>
          </button>

          <ChevronRight className="w-4 h-4 text-slate-600 shrink-0 hidden sm:block" />

          {/* Step 3: In-Cab Navigation */}
          <button
            onClick={() => setWorkflowStep(3)}
            className={`flex-1 flex items-center justify-center sm:justify-start gap-2 px-3 py-2 rounded-xl text-xs font-bold transition-all border cursor-pointer ${
              workflowStep === 3
                ? 'bg-emerald-600 text-white border-emerald-400 shadow-md shadow-emerald-600/30'
                : 'bg-slate-800/60 text-slate-400 border-slate-700/80 hover:text-white'
            }`}
          >
            <span className="w-5 h-5 rounded-full bg-slate-900/60 flex items-center justify-center text-[10px] font-mono">
              3
            </span>
            <span className="truncate">3. In-Cab Navigation</span>
          </button>
        </div>
      </div>

      {workflowStep === 1 && (
        <PreTripWalkaroundStep
          vehicle={vehicle}
          driverReg={driverVehicle?.vehicleReg}
          onOpenTrailerModal={() => setShowTrailerModal(true)}
          onOpenFullChecklist={onSwitchToVehicleCheck}
          onProceedToTourPlanning={() => setWorkflowStep(2)}
        />
      )}

      {workflowStep === 2 && (
        <AmazonTourNavigator
          onSelectStopForNavigation={(stop: TourStop) => {
            planRoute(stop.destinationQuery);
            setWorkflowStep(3);
            addSnackbar(`Leg selected: Stop ${stop.stopNumber} (${stop.facilityCode} · ${stop.location}). Clearance verified.`);
            speak(`Route planned to stop ${stop.stopNumber}, ${stop.facilityCode} ${stop.location}. Bridge radar active.`);
          }}
          onClose={() => setWorkflowStep(3)}
        />
      )}

      {workflowStep === 3 && (
        /* ── Main Viewport: Map & Side Panel ────────────────────────────────── */
        <div className="flex-1 flex flex-col md:flex-row overflow-hidden relative">

        {/* ── Map Canvas Stage ────────────────────────────────────────────── */}
        <div className="flex-1 relative h-full bg-slate-950 flex flex-col">
          {MAPS_API_KEY ? (
            <Map
              mapId={DEMO_MAP_ID}
              defaultCenter={{ lat: 52.0, lng: -0.7 }}
              defaultZoom={8}
              gestureHandling="greedy"
              disableDefaultUI={false}
              className="map-container w-full h-full"
              colorScheme="DARK"
              internalUsageAttributionIds={['gmp_git_agentskills_v1']}
            >
              <RoutePolyline active={routeState === 'NAVIGATING'} />
            </Map>
          ) : (
            /* High-definition tactical fallback roadmap */
            <div className="w-full h-full bg-gradient-to-b from-slate-900 via-slate-950 to-slate-900 flex flex-col items-center justify-center p-6 relative overflow-hidden select-none">
              {/* Subtle background coordinate grid */}
              <div className="absolute inset-0 opacity-15 bg-[radial-gradient(#3b82f6_1px,transparent_1px)] [background-size:24px_24px]" />

              {/* Graphical corridor visualization */}
              <div className="relative z-10 w-full max-w-lg bg-slate-900/90 border border-slate-800 p-6 rounded-3xl shadow-2xl backdrop-blur-md">
                <div className="flex items-center justify-between border-b border-slate-800 pb-3 mb-4">
                  <div className="flex items-center gap-2">
                    <span className="h-3 w-3 rounded-full bg-blue-500 animate-ping" />
                    <span className="text-xs font-bold text-white uppercase tracking-wider">
                      HGV Corridor Radar: A45 / M1 / A406
                    </span>
                  </div>
                  <span className="text-xs font-mono font-bold text-amber-400">
                    Vehicle: {formatHeightBoth(vehicle.height)}
                  </span>
                </div>

                {/* Road Corridor Map Graphic */}
                <svg viewBox="0 0 400 180" className="w-full h-40">
                  <defs>
                    <linearGradient id="routeGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                      <stop offset="0%" stopColor="#10b981" />
                      <stop offset="50%" stopColor="#3b82f6" />
                      <stop offset="100%" stopColor="#f59e0b" />
                    </linearGradient>
                  </defs>
                  {/* Road centerline */}
                  <path
                    d="M 30 140 Q 120 40, 200 100 T 370 50"
                    fill="none"
                    stroke="#1e293b"
                    strokeWidth="16"
                    strokeLinecap="round"
                  />
                  <path
                    d="M 30 140 Q 120 40, 200 100 T 370 50"
                    fill="none"
                    stroke={showActiveRoute ? "url(#routeGradient)" : "#334155"}
                    strokeWidth="6"
                    strokeDasharray={routeState === 'NAVIGATING' ? "8 4" : "none"}
                    strokeLinecap="round"
                  />

                  {/* Waypoint Markers */}
                  {/* Origin */}
                  <circle cx="30" cy="140" r="8" fill="#10b981" />
                  <text x="30" y="165" fill="#94a3b8" fontSize="10" textAnchor="middle" fontWeight="bold">DIRFT Daventry</text>

                  {/* Bridge 1 */}
                  <circle cx="120" cy="80" r="7" fill={vehicle.height > 4.5 ? "#ef4444" : "#f59e0b"} />
                  <text x="120" y="65" fill="#f87171" fontSize="9" textAnchor="middle">4.50m Bridge</text>

                  {/* Bridge 2 */}
                  <circle cx="240" cy="95" r="7" fill="#10b981" />
                  <text x="240" y="80" fill="#34d399" fontSize="9" textAnchor="middle">4.80m Clear</text>

                  {/* Destination */}
                  <circle cx="370" cy="50" r="8" fill="#ef4444" />
                  <text x="370" y="35" fill="#f87171" fontSize="10" textAnchor="middle" fontWeight="bold">Park Royal</text>
                </svg>

                <div className="flex items-center justify-between text-[11px] text-slate-400 mt-2 pt-2 border-t border-slate-800">
                  <span>Routing Engine: <b>UK Network Rail Clearance DB</b></span>
                  <span className="text-emerald-400 font-semibold">Live GPS Ready</span>
                </div>
              </div>

              {/* Status pill in corner */}
              <div className="absolute top-4 left-4 z-10 flex items-center gap-2 px-3 py-1.5 rounded-full bg-slate-900/90 border border-slate-800 backdrop-blur-sm text-xs">
                <span className={`w-2 h-2 rounded-full ${showActiveRoute ? 'bg-emerald-400' : 'bg-slate-500'}`} />
                <span className="font-semibold text-slate-300">
                  {routeState === 'NAVIGATING' ? 'GPS Turn-by-Turn Active' : showActiveRoute ? 'Route Validated' : 'Awaiting Destination'}
                </span>
              </div>
            </div>
          )}

          {/* Quick Floating Action Bar on Mobile/Tablet */}
          <div className="md:hidden absolute bottom-4 right-4 z-20">
            <button
              onClick={() => setMobilePanelOpen(!mobilePanelOpen)}
              className="flex items-center gap-2 px-4 py-2.5 rounded-2xl bg-blue-600 text-white font-bold text-xs shadow-xl active:scale-95"
            >
              <Layers className="w-4 h-4" />
              <span>{mobilePanelOpen ? 'Hide Route Panel' : 'Show Route Panel'}</span>
            </button>
          </div>
        </div>

        {/* ── Side Control Panel ─────────────────────────────────────────── */}
        <div className={`w-full md:w-96 lg:w-[420px] flex flex-col gap-3 p-4 overflow-y-auto bg-slate-900/95 border-l border-slate-800 z-20 shrink-0 ${
          mobilePanelOpen ? 'block' : 'hidden md:flex'
        }`}>

          {/* Route Summary Card or Empty State */}
          {showActiveRoute && activeRoute ? (
            <RouteSummaryCard
              route={activeRoute}
              routeState={routeState}
              vehicle={vehicle}
              onClearRoute={handleClearRequest}
              onEditStops={() => addSnackbar('Edit Stops — via-point drop editor active.')}
              onStartNavigation={handleStartNavigation}
              onAvoidRestriction={handleAvoidRestriction}
            />
          ) : (
            <EmptyState
              vehicle={vehicle}
              onVehicleClick={() => setShowTrailerModal(true)}
              onSearch={(q) => planRoute(q)}
              onOpenAmazonTour={() => setWorkflowStep(2)}
              onRecentRoute={(label) => {
                if (label.toLowerCase().includes('layby')) {
                  addSnackbar('Layby Radar opened — nearest OPEN site 4.2 mi ahead.');
                  speak('Opening Layby Radar. Nearest open site is 4.2 miles ahead.');
                } else {
                  planRoute(label);
                }
              }}
            />
          )}

          {/* Hands-Free Voice Co-Pilot */}
          <div className="relative flex justify-center py-4 border border-slate-800 rounded-2xl bg-slate-950/70 shadow-inner">
            <VoiceCoPilot onCommand={handleVoiceCommand} />
          </div>

          {/* Quick Simulation & Demo Operations */}
          <div className="border border-slate-800 rounded-2xl p-3.5 bg-slate-950/50 space-y-2">
            <p className="text-[11px] text-slate-400 uppercase font-mono font-bold tracking-wider flex items-center justify-between">
              <span>Quick Actions</span>
              <span className="text-[10px] text-slate-500">CAB SHORTCUTS</span>
            </p>

            <div className="flex flex-col gap-1.5">
              <button
                onClick={() => planRoute()}
                disabled={showActiveRoute}
                className="text-xs px-3 py-2 rounded-xl bg-slate-800/80 hover:bg-slate-800 text-slate-200 disabled:opacity-40 text-left transition-all cursor-pointer flex items-center justify-between"
              >
                <span>📍 Load Freight Route (DIRFT → Park Royal)</span>
                <ArrowRight className="w-3.5 h-3.5 text-blue-400" />
              </button>

              <button
                onClick={() => setShowTrailerModal(true)}
                className="text-xs px-3 py-2 rounded-xl bg-slate-800/80 hover:bg-slate-800 text-slate-200 text-left transition-all cursor-pointer flex items-center justify-between"
              >
                <span>🚛 Mid-Route Trailer Swap (Test Diff Hazard)</span>
                <Truck className="w-3.5 h-3.5 text-amber-400" />
              </button>

              {showActiveRoute && (
                <button
                  onClick={handleStartNavigation}
                  disabled={routeState === 'NAVIGATING'}
                  className="text-xs px-3 py-2 rounded-xl bg-blue-600/30 hover:bg-blue-600/50 border border-blue-500/40 text-blue-300 disabled:opacity-40 text-left transition-all cursor-pointer flex items-center justify-between"
                >
                  <span>🗺️ Simulate GPS Navigation Audio</span>
                  <Navigation className="w-3.5 h-3.5 text-blue-400" />
                </button>
              )}

              {onSwitchToSafetyShield && (
                <button
                  onClick={onSwitchToSafetyShield}
                  className="text-xs px-3 py-2 rounded-xl bg-rose-950/60 hover:bg-rose-900/60 border border-rose-500/40 text-rose-200 text-left transition-all cursor-pointer flex items-center justify-between"
                >
                  <span className="flex items-center gap-1.5 font-bold">
                    <ShieldAlert className="w-3.5 h-3.5 text-rose-400" />
                    <span>Bridge Strike &amp; Safety Shield</span>
                  </span>
                  <span className="text-[10px] font-mono bg-rose-500/30 text-rose-300 px-1.5 py-0.5 rounded font-bold">
                    7 SHIELDS
                  </span>
                </button>
              )}
            </div>
          </div>

          {/* Current State Diagnostic Tag */}
          <div className="text-center py-1">
            <p className="text-[11px] text-slate-500 font-mono">
              Engine: <span className="text-slate-300 font-bold">DVSA HGV Core v2.4</span> · State: <span className="text-amber-400 font-bold">{routeState}</span>
            </p>
          </div>
        </div>
      </div>
      )}

      {/* ── Overlays & Modals ────────────────────────────────────────────── */}
      <ConfirmModal
        isOpen={showClearConfirm}
        title="Stop navigation and clear this route?"
        message="All clearance checks, bridge hazards, and ETAs will be removed from your screen."
        confirmLabel="Clear Route"
        cancelLabel="Keep Route"
        onConfirm={executeClear}
        onCancel={() => setShowClearConfirm(false)}
        danger
      />

      <TrailerMemoryModal
        isOpen={showTrailerModal}
        current={vehicle}
        onSwap={handleTrailerSwap}
        onClose={() => setShowTrailerModal(false)}
      />

      {trailerSwapAlert && (
        <TrailerSwapAlert
          isOpen
          newRestrictions={trailerSwapAlert.newRestrictions}
          vehicleHeight={trailerSwapAlert.newProfile.height}
          trailerName={trailerSwapAlert.newProfile.trailerName}
          isImpossible={trailerSwapAlert.isImpossible}
          onEngageSafeDetour={confirmSafeDetour}
          onKeepRoute={keepCurrentRoute}
          onClearRoute={() => {
            setTrailerSwapAlert(null);
            executeClear();
          }}
        />
      )}

      <Snackbar messages={snackbars} onDismiss={dismissSnackbar} />
    </div>
  );
};

// ─── Root Provider Wrapper ────────────────────────────────────────────────────
export const RouteOptimiserApp: React.FC<RouteOptimiserAppProps> = (props) => {
  if (MAPS_API_KEY) {
    return (
      <APIProvider apiKey={MAPS_API_KEY} libraries={['routes', 'places']}>
        <RouteOptimiserInner {...props} />
      </APIProvider>
    );
  }
  return <RouteOptimiserInner {...props} />;
};

export default RouteOptimiserApp;
