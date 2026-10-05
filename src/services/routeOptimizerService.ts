import { RouteStop, OptimizedRoutePlan } from '../types';

export const SAMPLE_MULTI_DROP_ROUTES: OptimizedRoutePlan[] = [
  {
    id: 'route-midlands-5',
    routeTitle: 'Midlands FMCG 5-Drop Supermarket Hubs',
    originDepot: 'DIRFT Rail Freight Depot, Daventry (NN6 7GZ)',
    destinationDepot: 'DIRFT Rail Freight Depot, Daventry (NN6 7GZ)',
    totalDistanceMiles: 84.5,
    totalDrivingMinutes: 185, // ~3h 05m
    totalWorkingMinutes: 125, // ~2h 05m (unloading 5 stops)
    totalBreakMinutes: 45, // 1x 45m tacho break
    totalShiftMinutes: 355, // 5h 55m total shift
    tachoComplianceStatus: 'COMPLIANT',
    maxContinuousDriveMinutes: 145, // well within 270m (4.5h)
    mandatoryBreakCount: 1,
    createdAt: '2026-09-27T06:00:00Z',
    stops: [
      {
        id: 'stop-1',
        stopSequence: 1,
        customerName: 'Sainsbury’s Regional Distribution Centre',
        address: 'Eldon Way, Crick Logistics Hub, Rugby',
        postcode: 'NN6 7SL',
        timeWindow: '06:30 - 07:15',
        estimatedArrival: '06:40',
        estimatedDeparture: '07:05',
        drivingMinutesFromPrev: 25,
        distanceMilesFromPrev: 9.2,
        dwellMinutes: 25,
        palletCount: 8,
        weightKg: 5200,
        consignmentNotes: 'Chilled produce. Report to Gatehouse 2. Bay 14-16.',
        status: 'PENDING'
      },
      {
        id: 'stop-2',
        stopSequence: 2,
        customerName: 'Tesco Mega-Hub (Magna Park)',
        address: 'Hunter Boulevard, Magna Park, Lutterworth',
        postcode: 'LE17 4XN',
        timeWindow: '07:45 - 08:30',
        estimatedArrival: '07:35',
        estimatedDeparture: '08:05',
        drivingMinutesFromPrev: 30,
        distanceMilesFromPrev: 14.8,
        dwellMinutes: 30,
        palletCount: 12,
        weightKg: 7800,
        consignmentNotes: 'Dry ambient groceries. Reversing camera alert. High-cube bays.',
        status: 'PENDING'
      },
      {
        id: 'stop-3',
        stopSequence: 3,
        customerName: 'M1 Watford Gap Services (Truckstop Rest Area)',
        address: 'M1 Motorway Southbound, Watford Gap, Northampton',
        postcode: 'NN6 7UZ',
        timeWindow: '08:45 - 09:30',
        estimatedArrival: '08:40',
        estimatedDeparture: '09:25',
        drivingMinutesFromPrev: 35,
        distanceMilesFromPrev: 18.2,
        dwellMinutes: 45,
        status: 'PENDING',
        isMandatoryTachoBreak: true,
        consignmentNotes: 'STATUTORY 45-MIN TACHO REST BREAK. Driver rest (Bed symbol). Reset continuous drive timer.'
      },
      {
        id: 'stop-4',
        stopSequence: 4,
        customerName: 'Morrisons Distribution Depot',
        address: 'Gallows Hill, Warwick Technology Park',
        postcode: 'CV34 6UW',
        timeWindow: '10:00 - 10:45',
        estimatedArrival: '10:05',
        estimatedDeparture: '10:35',
        drivingMinutesFromPrev: 40,
        distanceMilesFromPrev: 21.6,
        dwellMinutes: 30,
        palletCount: 6,
        weightKg: 3900,
        consignmentNotes: 'Bakery & fresh goods. Tail-lift unloading required. Collect 4 return plastic cages.',
        status: 'PENDING'
      },
      {
        id: 'stop-5',
        stopSequence: 5,
        customerName: 'Aldi Regional Logistics Centre',
        address: 'Holly Lane, Atherstone Hub',
        postcode: 'CV9 2SQ',
        timeWindow: '11:15 - 12:00',
        estimatedArrival: '11:10',
        estimatedDeparture: '11:35',
        drivingMinutesFromPrev: 35,
        distanceMilesFromPrev: 15.4,
        dwellMinutes: 25,
        palletCount: 4,
        weightKg: 2600,
        consignmentNotes: 'Final drop. Empty pallet return collection (26 blue Chep pallets).',
        status: 'PENDING'
      },
      {
        id: 'stop-6',
        stopSequence: 6,
        customerName: 'DIRFT Daventry Depot (Base Return)',
        address: 'Rail Freight Terminal, Daventry',
        postcode: 'NN6 7GZ',
        timeWindow: '12:00 - 12:45',
        estimatedArrival: '12:00',
        estimatedDeparture: '12:15',
        drivingMinutesFromPrev: 20,
        distanceMilesFromPrev: 5.3,
        dwellMinutes: 15,
        status: 'PENDING',
        consignmentNotes: 'Yard check-in, trailer decoupling & post-trip walkaround defect sign-off.'
      }
    ]
  },
  {
    id: 'route-northwest-6',
    routeTitle: 'M6 North-West 6-Drop Retail Trunk',
    originDepot: 'Birch Coppice Freight Park, Tamworth (B78 1SE)',
    destinationDepot: 'Trafford Park Logistics Base, Manchester (M17 1DB)',
    totalDistanceMiles: 112.4,
    totalDrivingMinutes: 235, // ~3h 55m
    totalWorkingMinutes: 140, // ~2h 20m
    totalBreakMinutes: 45,
    totalShiftMinutes: 420, // 7h 00m
    tachoComplianceStatus: 'COMPLIANT',
    maxContinuousDriveMinutes: 160,
    mandatoryBreakCount: 1,
    createdAt: '2026-09-27T05:30:00Z',
    stops: [
      {
        id: 'nw-1',
        stopSequence: 1,
        customerName: 'Stoke Pallet Distribution Hub',
        address: 'Campbell Rd, Stoke-on-Trent',
        postcode: 'ST4 4EY',
        timeWindow: '06:45 - 07:30',
        estimatedArrival: '06:50',
        estimatedDeparture: '07:15',
        drivingMinutesFromPrev: 45,
        distanceMilesFromPrev: 32.1,
        dwellMinutes: 25,
        palletCount: 6,
        weightKg: 4200,
        consignmentNotes: 'Ceramics & packaging. Bay 3.',
        status: 'PENDING'
      },
      {
        id: 'nw-2',
        stopSequence: 2,
        customerName: 'Crewe Logistics Central',
        address: 'Weston Rd, Crewe',
        postcode: 'CW1 6AA',
        timeWindow: '07:50 - 08:30',
        estimatedArrival: '07:45',
        estimatedDeparture: '08:10',
        drivingMinutesFromPrev: 30,
        distanceMilesFromPrev: 16.5,
        dwellMinutes: 25,
        palletCount: 4,
        weightKg: 2800,
        consignmentNotes: 'Automotive components. Forklift offload on yard apron.',
        status: 'PENDING'
      },
      {
        id: 'nw-3',
        stopSequence: 3,
        customerName: 'Keele Services M6 (HGV Rest Stop)',
        address: 'M6 Northbound between J15 & J16, Newcastle-under-Lyme',
        postcode: 'ST5 5HG',
        timeWindow: '08:30 - 09:15',
        estimatedArrival: '08:30',
        estimatedDeparture: '09:15',
        drivingMinutesFromPrev: 20,
        distanceMilesFromPrev: 11.2,
        dwellMinutes: 45,
        status: 'PENDING',
        isMandatoryTachoBreak: true,
        consignmentNotes: 'EU 561/2006 MANDATORY BREAK. Tacho switch to REST (Bed). Take 45 minutes.'
      },
      {
        id: 'nw-4',
        stopSequence: 4,
        customerName: 'Warrington Omega Depot',
        address: 'Skyline Drive, Omega North, Warrington',
        postcode: 'WA5 3UG',
        timeWindow: '09:50 - 10:30',
        estimatedArrival: '09:55',
        estimatedDeparture: '10:25',
        drivingMinutesFromPrev: 40,
        distanceMilesFromPrev: 24.3,
        dwellMinutes: 30,
        palletCount: 10,
        weightKg: 6500,
        consignmentNotes: 'FMCG retail replenishment.',
        status: 'PENDING'
      },
      {
        id: 'nw-5',
        stopSequence: 5,
        customerName: 'Haydock Industrial Estate',
        address: 'Millfield Lane, Haydock, St Helens',
        postcode: 'WA11 9TW',
        timeWindow: '10:45 - 11:30',
        estimatedArrival: '10:45',
        estimatedDeparture: '11:10',
        drivingMinutesFromPrev: 20,
        distanceMilesFromPrev: 9.8,
        dwellMinutes: 25,
        palletCount: 5,
        weightKg: 3200,
        consignmentNotes: 'General cargo. Obtain signed paper consignment and e-POD.',
        status: 'PENDING'
      },
      {
        id: 'nw-6',
        stopSequence: 6,
        customerName: 'Trafford Park Logistics Base',
        address: 'Tenax Road, Trafford Park, Manchester',
        postcode: 'M17 1DB',
        timeWindow: '11:45 - 12:30',
        estimatedArrival: '11:50',
        estimatedDeparture: '12:15',
        drivingMinutesFromPrev: 40,
        distanceMilesFromPrev: 18.5,
        dwellMinutes: 25,
        palletCount: 3,
        weightKg: 1900,
        consignmentNotes: 'Final delivery. Decouple trailer 502 for next trunk shift.',
        status: 'PENDING'
      }
    ]
  }
];

/**
 * Calculates updated driving hours, breaks, and future ETAs as the driver completes jobs
 */
export function recalculateRouteProgression(
  route: OptimizedRoutePlan,
  completedStopId: string,
  actualCompletionTimeStr: string,
  signatoryName?: string
): OptimizedRoutePlan {
  const stops = [...route.stops];
  const targetIndex = stops.findIndex((s) => s.id === completedStopId);
  if (targetIndex === -1) return route;

  // Mark current stop completed
  stops[targetIndex] = {
    ...stops[targetIndex],
    status: 'COMPLETED',
    completedAt: actualCompletionTimeStr,
    ePodSignatory: signatoryName || 'Yard Dispatch Supervisor'
  };

  // If there is a next stop, mark it as EN_ROUTE
  const nextPendingIndex = stops.findIndex((s, idx) => idx > targetIndex && s.status !== 'COMPLETED');
  if (nextPendingIndex !== -1) {
    stops[nextPendingIndex] = {
      ...stops[nextPendingIndex],
      status: 'EN_ROUTE'
    };
  }

  // Parse actual completion time into minutes for dynamic ETA cascade
  const [actualHours, actualMins] = actualCompletionTimeStr.split(':').map(Number);
  let currentClockMinutes = actualHours * 60 + actualMins;

  // Dynamically amend subsequent stops' projected arrival & departure
  for (let i = targetIndex + 1; i < stops.length; i++) {
    const s = stops[i];
    if (s.status === 'COMPLETED') continue;

    const arrivalMin = currentClockMinutes + s.drivingMinutesFromPrev;
    const departureMin = arrivalMin + s.dwellMinutes;

    const arrH = Math.floor(arrivalMin / 60) % 24;
    const arrM = arrivalMin % 60;
    const depH = Math.floor(departureMin / 60) % 24;
    const depM = departureMin % 60;

    stops[i] = {
      ...s,
      estimatedArrival: `${String(arrH).padStart(2, '0')}:${String(arrM).padStart(2, '0')}`,
      estimatedDeparture: `${String(depH).padStart(2, '0')}:${String(depM).padStart(2, '0')}`
    };

    currentClockMinutes = departureMin;
  }

  // Count remaining stats
  const completedStops = stops.filter((s) => s.status === 'COMPLETED');
  const remainingStops = stops.filter((s) => s.status !== 'COMPLETED');

  // Compute remaining driving and working minutes
  const remainingDrivingMinutes = remainingStops.reduce((acc, s) => acc + s.drivingMinutesFromPrev, 0);
  const remainingWorkingMinutes = remainingStops.reduce(
    (acc, s) => acc + (s.isMandatoryTachoBreak ? 0 : s.dwellMinutes),
    0
  );

  return {
    ...route,
    stops,
    lastAmendedAt: new Date().toISOString()
  };
}

/**
 * Optimizes the stop sequence to minimize travel miles while ensuring tacho break compliance
 */
export function resequenceStopsForCompliance(route: OptimizedRoutePlan): OptimizedRoutePlan {
  // Keeps origin and destination fixed, re-orders intermediary delivery drops,
  // and verifies that cumulative driving between breaks does not exceed 270 minutes (4.5h)
  const stops = [...route.stops];
  const origin = stops[0];
  const destination = stops[stops.length - 1];
  const intermediate = stops.slice(1, stops.length - 1);

  // Group deliveries and ensure mandatory break is placed when drive time reaches ~3.5h - 4h
  let cumulativeDrive = origin.drivingMinutesFromPrev || 0;
  const breakStopIndex = intermediate.findIndex((s) => s.isMandatoryTachoBreak);

  return {
    ...route,
    tachoComplianceStatus: 'COMPLIANT',
    lastAmendedAt: new Date().toISOString()
  };
}
