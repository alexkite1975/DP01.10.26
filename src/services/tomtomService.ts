import { DriverVehicleProfile } from '../types';

export const TOMTOM_API_KEY =
  (typeof process !== 'undefined' && process.env?.NEXT_PUBLIC_TOMTOM_API_KEY) ||
  (typeof window !== 'undefined' && (window as any).TOMTOM_API_KEY) ||
  (typeof import.meta !== 'undefined' && (import.meta as any).env?.VITE_TOMTOM_API_KEY) ||
  '01nsqhBOfhiCZBqY6W8n14RTcstjuFC2';

export const TOMTOM_MAPS_KEY =
  (typeof process !== 'undefined' && (process.env?.NEXT_PUBLIC_TOMTOM_MAPS_KEY || process.env?.NEXT_PUBLIC_TOMTOM_API_KEY)) ||
  (typeof window !== 'undefined' && (window as any).TOMTOM_MAPS_KEY) ||
  (typeof import.meta !== 'undefined' && ((import.meta as any).env?.VITE_TOMTOM_MAPS_KEY || (import.meta as any).env?.VITE_TOMTOM_API_KEY)) ||
  '01nsqhBOfhiCZBqY6W8n14RTcstjuFC2';

/**
 * Initialize TomTom Web Map using Maps SDK for JavaScript (window.tt)
 */
export function initTomTomMap(container: HTMLElement | string, options?: any) {
  if (typeof window !== 'undefined' && (window as any).tt) {
    return (window as any).tt.map({
      key: TOMTOM_MAPS_KEY,
      container,
      center: options?.center || [-1.1570, 52.3680], // [lng, lat] in TomTom SDK
      zoom: options?.zoom || 13,
      ...options
    });
  }
  return null;
}

export interface TomTomTruckRouteResult {
  success: boolean;
  distanceMeters: number;
  distanceMiles: number;
  distanceKm: number;
  travelTimeSeconds: number;
  travelTimeMinutes: number;
  trafficDelaySeconds: number;
  coordinates: [number, number][]; // [lat, lng]
  departureTime: string;
  arrivalTime: string;
  warnings?: string[];
  error?: string;
}

export interface TomTomGeocodeResult {
  id: string;
  address: string;
  lat: number;
  lng: number;
  country: string;
  municipality?: string;
  postalCode?: string;
}

/**
 * Calculate commercial truck route avoiding low bridges, weight limits, and narrow lanes via TomTom Routing API
 */
export async function calculateTomTomTruckRoute(
  origin: { lat: number; lng: number },
  destination: { lat: number; lng: number },
  vehicle?: Partial<DriverVehicleProfile>,
  apiKey: string = TOMTOM_API_KEY
): Promise<TomTomTruckRouteResult> {
  try {
    const height = vehicle?.heightMeters || 4.2;
    const weightKg = Math.round((vehicle?.weightTonnes || 44) * 1000);
    const width = vehicle?.widthMeters || 2.55;
    const length = vehicle?.lengthMeters || 16.5;

    const url = new URL(
      `https://api.tomtom.com/routing/1/calculateRoute/${origin.lat},${origin.lng}:${destination.lat},${destination.lng}/json`
    );

    url.searchParams.set('key', apiKey);
    url.searchParams.set('vehicleCommercial', 'true');
    url.searchParams.set('travelMode', 'truck');
    url.searchParams.set('vehicleWeight', String(weightKg));
    url.searchParams.set('vehicleHeight', String(height));
    url.searchParams.set('vehicleWidth', String(width));
    url.searchParams.set('vehicleLength', String(length));
    url.searchParams.set('traffic', 'true');
    url.searchParams.set('computeBestOrder', 'false');

    const res = await fetch(url.toString());
    if (!res.ok) {
      throw new Error(`TomTom Routing HTTP ${res.status}: ${res.statusText}`);
    }

    const data = await res.json();
    const route = data.routes?.[0];
    if (!route) {
      throw new Error('No route returned by TomTom API for this vehicle profile');
    }

    const summary = route.summary || {};
    const points: [number, number][] = (route.legs?.[0]?.points || []).map(
      (p: { latitude: number; longitude: number }) => [p.latitude, p.longitude]
    );

    const distMeters = summary.lengthInMeters || 0;
    const distKm = Math.round((distMeters / 1000) * 10) / 10;
    const distMiles = Math.round((distMeters / 1609.34) * 10) / 10;
    const travelSecs = summary.travelTimeInSeconds || 0;
    const delaySecs = summary.trafficDelayInSeconds || 0;

    return {
      success: true,
      distanceMeters: distMeters,
      distanceKm: distKm,
      distanceMiles: distMiles,
      travelTimeSeconds: travelSecs,
      travelTimeMinutes: Math.round(travelSecs / 60),
      trafficDelaySeconds: delaySecs,
      coordinates: points,
      departureTime: summary.departureTime || new Date().toISOString(),
      arrivalTime: summary.arrivalTime || new Date(Date.now() + travelSecs * 1000).toISOString(),
      warnings: []
    };
  } catch (err: any) {
    console.warn('TomTom Truck Route Calculation fallback/error:', err);
    return {
      success: false,
      distanceMeters: 0,
      distanceMiles: 0,
      distanceKm: 0,
      travelTimeSeconds: 0,
      travelTimeMinutes: 0,
      trafficDelaySeconds: 0,
      coordinates: [],
      departureTime: new Date().toISOString(),
      arrivalTime: new Date().toISOString(),
      error: err.message || 'Failed to calculate TomTom truck route'
    };
  }
}

/**
 * Geocode address or postal code using TomTom Search API
 */
export async function searchAddressTomTom(
  query: string,
  apiKey: string = TOMTOM_API_KEY
): Promise<TomTomGeocodeResult[]> {
  try {
    const url = new URL(`https://api.tomtom.com/search/2/geocode/${encodeURIComponent(query)}.json`);
    url.searchParams.set('key', apiKey);
    url.searchParams.set('countrySet', 'GB');
    url.searchParams.set('limit', '5');

    const res = await fetch(url.toString());
    if (!res.ok) return [];

    const data = await res.json();
    return (data.results || []).map((r: any) => ({
      id: r.id,
      address: r.address?.freeformAddress || query,
      lat: r.position?.lat,
      lng: r.position?.lon,
      country: r.address?.countryCode || 'GB',
      municipality: r.address?.municipality,
      postalCode: r.address?.postalCode
    }));
  } catch (_e) {
    return [];
  }
}

/**
 * Generate navigation URL targeting TomTom GO Fleet app with web plan fallback
 */
export function generateTomTomTruckNavUrl(
  lat: number,
  lng: number,
  address?: string,
  vehicle?: Partial<DriverVehicleProfile>
): {
  webUrl: string;
  appDeepLink: string;
} {
  const height = vehicle?.heightMeters || 4.2;
  const weight = vehicle?.weightTonnes || 44;

  const webUrl = `https://plan.tomtom.com/en/?p=${lat},${lng}&vehicleType=truck&vehicleHeight=${height}&vehicleWeight=${weight}`;
  const appDeepLink = `tomtomgo://x-callback-url/navigate?destination=${lat},${lng}`;

  return { webUrl, appDeepLink };
}
