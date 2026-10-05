import { Restriction, RouteSummary, VehicleProfile } from '../types/routeOptimiserTypes';

// ─── Mock route data (replaces real Maps API responses in dev or offline) ──────

export const DEMO_ROUTE: RouteSummary = {
  origin: 'DIRFT Daventry (NN6 7GZ)',
  destination: 'Park Royal Logistics Depot (NW10 7HQ)',
  distanceMiles: 68.2,
  etaMinutes: 75,
  restrictions: [
    {
      id: 'r1',
      label: 'A45 Railway Bridge, Coventry',
      roadName: 'A45 Fletchamstead Hwy',
      distanceMiles: 12.4,
      clearanceMetres: 4.5,
      severity: 'critical',
      detourAdvice: 'Re-route via A46 Eastern Bypass to avoid arch compression'
    },
    {
      id: 'r2',
      label: 'M1 J18 Overbridge',
      roadName: 'M1 Motorway Northbound',
      distanceMiles: 24.1,
      clearanceMetres: 4.8,
      severity: 'tight',
      detourAdvice: 'Lane 2/3 transit advised for high-camber clearance'
    },
    {
      id: 'r3',
      label: 'A5 Watling Street Low Bridge',
      roadName: 'A5 Hinckley Rd',
      distanceMiles: 31.7,
      clearanceMetres: 4.6,
      severity: 'critical',
      detourAdvice: 'Exit prior to bridge, use B4114 dual link road'
    },
  ],
  polylinePoints: [
    { lat: 52.334, lng: -1.083 }, // Daventry DIRFT
    { lat: 52.200, lng: -1.230 }, // Rugby corridor
    { lat: 51.950, lng: -1.000 }, // Milton Keynes / M1
    { lat: 51.720, lng: -0.500 }, // Hemel Hempstead
    { lat: 51.533, lng: -0.277 }, // Park Royal London
  ]
};

export const DEFAULT_VEHICLE: VehicleProfile = {
  height: 4.45,
  weight: 44,
  width: 2.55,
  trailerType: 'Curtainsider',
  trailerName: 'TRL-4422',
  axles: 6,
  euroClass: 'Euro VI (ULEZ Exempt)'
};

export const TALL_TRAILER: VehicleProfile = {
  height: 4.85,
  weight: 44,
  width: 2.55,
  trailerType: 'Refrigerated High-Cube',
  trailerName: 'TRL-7701 (High-Cube)',
  axles: 6,
  euroClass: 'Euro VI'
};

export const FLATBED_TRAILER: VehicleProfile = {
  height: 4.20,
  weight: 26,
  width: 2.45,
  trailerType: 'Flatbed Plant Hauler',
  trailerName: 'TRL-1105 (Low Profile)',
  axles: 4,
  euroClass: 'Euro VI'
};

export const TRAILER_PRESETS: VehicleProfile[] = [
  DEFAULT_VEHICLE,
  TALL_TRAILER,
  FLATBED_TRAILER,
  {
    height: 4.65,
    weight: 44,
    width: 2.55,
    trailerType: 'Double-Deck Box Van',
    trailerName: 'TRL-9980 (Double Deck)',
    axles: 6,
    euroClass: 'Euro VI'
  }
];

// ─── Clearance engine ─────────────────────────────────────────────────────────
export function revalidateRoute(
  currentRestrictions: Restriction[],
  newProfile: VehicleProfile
): { restrictions: Restriction[]; hasNewHazards: boolean; isImpossible: boolean } {
  // Re-check margin against new trailer height
  const updated: Restriction[] = currentRestrictions.map((r) => {
    const margin = r.clearanceMetres - newProfile.height;
    if (margin < 0) {
      return { ...r, severity: 'critical', isNew: true };
    }
    if (margin < 0.35 && r.severity !== 'critical') {
      return { ...r, severity: 'tight', marginReduced: true };
    }
    if (margin >= 0.35) {
      return { ...r, severity: 'clear', isNew: false, marginReduced: false };
    }
    return r;
  });

  // Inject a new restriction when a tall trailer is hitched
  let withNew = [...updated];
  if (newProfile.height >= 4.75) {
    const exists = withNew.some((r) => r.id === 'r-new-1');
    if (!exists) {
      withNew = [
        ...updated,
        {
          id: 'r-new-1',
          label: 'North Circular A406 Arched Overbridge (NEW CRITICAL HAZARD)',
          roadName: 'A406 Hanger Lane Approach',
          distanceMiles: 58.2,
          clearanceMetres: 4.75,
          severity: 'critical',
          isNew: true,
          detourAdvice: 'Immediate mandatory detour via M25 J16 / M40 corridor to avoid bridge strike'
        },
      ];
    }
  }

  const hasNewHazards = withNew.some((r) => r.isNew || r.marginReduced);
  const isImpossible  = withNew.filter((r) => r.severity === 'critical').length >= 4;

  return { restrictions: withNew, hasNewHazards, isImpossible };
}

// ─── Saved / recent routes ────────────────────────────────────────────────────
export const RECENT_ROUTES = [
  { label: 'DIRFT Daventry to Park Royal', subtitle: '68.2 mi · A45 / M1 corridor' },
  { label: 'Home Depot (Northampton NN4)', subtitle: 'Depot Gate 2 · M1 J15' },
  { label: 'Amazon LBA4 Logistics Hub',   subtitle: 'Doncaster iPort DN11' },
  { label: 'Find Layby',                  subtitle: 'Nearest open HGV parking radar' },
];
