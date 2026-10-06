// ─── Route State Machine ──────────────────────────────────────────────────────
export type RouteState = 'IDLE' | 'PLANNING' | 'VALIDATED' | 'NAVIGATING';

// ─── Vehicle / Trailer profile ────────────────────────────────────────────────
export interface VehicleProfile {
  height: number;   // metres
  weight: number;   // tonnes
  width: number;    // metres
  trailerType: string;
  trailerName?: string;
  axles?: number;
  euroClass?: string;
}

// ─── Restriction card ─────────────────────────────────────────────────────────
export type RestrictionSeverity = 'critical' | 'tight' | 'clear';

export interface Restriction {
  id: string;
  label: string;
  distanceMiles: number;
  clearanceMetres: number;
  severity: RestrictionSeverity;
  isNew?: boolean;       // highlighted after trailer swap diff
  isRemoved?: boolean;
  marginReduced?: boolean;
  roadName?: string;
  detourAdvice?: string;
}

// ─── Route Summary ────────────────────────────────────────────────────────────
export interface RouteSummary {
  origin: string;
  destination: string;
  distanceMiles: number;
  etaMinutes: number;
  restrictions: Restriction[];
  polylinePoints?: { lat: number; lng: number }[];
}

// ─── Snackbar ─────────────────────────────────────────────────────────────────
export interface SnackbarMessage {
  id: string;
  text: string;
  action?: { label: string; onClick: () => void };
}

// ─── Voice command result ─────────────────────────────────────────────────────
export type VoiceAction =
  | 'CLEAR_ROUTE'
  | 'AVOID_LOW_BRIDGES'
  | 'FIND_NEXT_LAYBY'
  | 'WHAT_IS_CLEARANCE'
  | 'UNKNOWN';
