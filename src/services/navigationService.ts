import { DriverVehicleProfile, PreferredNavApp, SiteRiskAssessment } from '../types';

export interface NavAppOption {
  id: PreferredNavApp;
  name: string;
  shortLabel: string;
  tagline: string;
  isTruckSpecific: boolean;
  supportsBridgeAvoidance: boolean;
  supportsWeightRestrictions: boolean;
  supportsTimeCurfews: boolean;
  colorScheme: {
    bg: string;
    text: string;
    border: string;
  };
}

export const NAV_APP_OPTIONS: Record<PreferredNavApp, NavAppOption> = {
  GOOGLE_MAPS: {
    id: 'GOOGLE_MAPS',
    name: 'Google Maps',
    shortLabel: 'Google Maps',
    tagline: 'Default navigation with commercial approach advisories and site gatehouse routing',
    isTruckSpecific: false,
    supportsBridgeAvoidance: false,
    supportsWeightRestrictions: false,
    supportsTimeCurfews: false,
    colorScheme: {
      bg: 'bg-blue-50',
      text: 'text-blue-700',
      border: 'border-blue-200'
    }
  },
  TOMTOM_TRUCK: {
    id: 'TOMTOM_TRUCK',
    name: 'TomTom GO Fleet (Truck)',
    shortLabel: 'TomTom Truck',
    tagline: 'Professional HGV navigation: automatically avoids low bridges, weight limits & narrow lanes',
    isTruckSpecific: true,
    supportsBridgeAvoidance: true,
    supportsWeightRestrictions: true,
    supportsTimeCurfews: true,
    colorScheme: {
      bg: 'bg-emerald-50',
      text: 'text-emerald-800',
      border: 'border-emerald-300'
    }
  },
  HERE_WEGO: {
    id: 'HERE_WEGO',
    name: 'HERE WeGo / HERE Truck',
    shortLabel: 'HERE Truck',
    tagline: 'Dedicated commercial fleet routing with strict axle, height, and curfew bypasses',
    isTruckSpecific: true,
    supportsBridgeAvoidance: true,
    supportsWeightRestrictions: true,
    supportsTimeCurfews: true,
    colorScheme: {
      bg: 'bg-teal-50',
      text: 'text-teal-800',
      border: 'border-teal-300'
    }
  },
  WAZE: {
    id: 'WAZE',
    name: 'Waze Navigation',
    shortLabel: 'Waze',
    tagline: 'Community-reported traffic, roadworks, and stationary vehicle alerts',
    isTruckSpecific: false,
    supportsBridgeAvoidance: false,
    supportsWeightRestrictions: false,
    supportsTimeCurfews: false,
    colorScheme: {
      bg: 'bg-cyan-50',
      text: 'text-cyan-800',
      border: 'border-cyan-200'
    }
  },
  APPLE_MAPS: {
    id: 'APPLE_MAPS',
    name: 'Apple Maps',
    shortLabel: 'Apple Maps',
    tagline: 'Clean iOS turn-by-turn navigation with live highway traffic guidance',
    isTruckSpecific: false,
    supportsBridgeAvoidance: false,
    supportsWeightRestrictions: false,
    supportsTimeCurfews: false,
    colorScheme: {
      bg: 'bg-slate-100',
      text: 'text-slate-800',
      border: 'border-slate-300'
    }
  },
  SYGIC_TRUCK: {
    id: 'SYGIC_TRUCK',
    name: 'Sygic Truck Navigation',
    shortLabel: 'Sygic Truck',
    tagline: 'Offline 3D truck maps designed for ADR, low bridges, and tight turning radius',
    isTruckSpecific: true,
    supportsBridgeAvoidance: true,
    supportsWeightRestrictions: true,
    supportsTimeCurfews: true,
    colorScheme: {
      bg: 'bg-amber-50',
      text: 'text-amber-800',
      border: 'border-amber-300'
    }
  }
};

/**
 * Generate deep link or web planner URL for the driver's preferred navigation app
 */
export function generateNavUrl(
  lat: number,
  lng: number,
  app: PreferredNavApp = 'GOOGLE_MAPS',
  address?: string,
  vehicle?: Partial<DriverVehicleProfile>
): string {
  const encodedAddress = encodeURIComponent(address || `${lat},${lng}`);

  switch (app) {
    case 'TOMTOM_TRUCK': {
      const height = vehicle?.heightMeters || 4.2;
      const weight = vehicle?.weightTonnes || 44;
      // TomTom Plan web interface with professional truck vehicle profile mode
      return `https://plan.tomtom.com/en/?p=${lat},${lng}&vehicleType=truck&vehicleHeight=${height}&vehicleWeight=${weight}`;
    }

    case 'HERE_WEGO':
      // HERE WeGo route planner
      return `https://wego.here.com/directions/drive//${lat},${lng}`;

    case 'WAZE':
      return `https://waze.com/ul?ll=${lat},${lng}&navigate=yes`;

    case 'APPLE_MAPS':
      return `https://maps.apple.com/?daddr=${lat},${lng}&dirflg=d`;

    case 'SYGIC_TRUCK':
      // Sygic truck navigation / mobile fallback
      return `https://www.google.com/maps/dir/?api=1&destination=${lat},${lng}&travelmode=driving`;

    case 'GOOGLE_MAPS':
    default:
      return `https://www.google.com/maps/dir/?api=1&destination=${lat},${lng}&travelmode=driving`;
  }
}

/**
 * Evaluate compatibility between the driver's vehicle profile and site physical constraints
 */
export function evaluateRouteClearanceAdvisory(
  profile: DriverVehicleProfile,
  site?: SiteRiskAssessment
): {
  isClear: boolean;
  warnings: string[];
  guidanceText: string;
  appNotice: string;
  advisoryType: 'AUTOMATED_TRUCK_AVOIDANCE' | 'MANUAL_ATTENTION_REQUIRED';
} {
  const warnings: string[] = [];
  const appInfo = NAV_APP_OPTIONS[profile.preferredNavApp || 'GOOGLE_MAPS'];

  if (site) {
    const vc = site.businessSection.vehicleConstraints;
    if (vc.maxHeightMeters && profile.heightMeters > vc.maxHeightMeters) {
      warnings.push(
        `Height Clearance Alert: Vehicle (${profile.heightMeters}m) exceeds site limit (${vc.maxHeightMeters}m).`
      );
    }
    if (vc.maxWeightTonnes && profile.weightTonnes > vc.maxWeightTonnes) {
      warnings.push(
        `Weight Limit Alert: Vehicle gross weight (${profile.weightTonnes}t) exceeds road/bridge limit (${vc.maxWeightTonnes}t).`
      );
    }
    if (vc.maxWidthMeters && profile.widthMeters && profile.widthMeters > vc.maxWidthMeters) {
      warnings.push(
        `Width Restriction: Vehicle width (${profile.widthMeters}m) exceeds narrow access corridor (${vc.maxWidthMeters}m).`
      );
    }
    if (vc.tailLiftRequired && !profile.hasTailLift) {
      warnings.push('Equipment Alert: Site requires hydraulic tail-lift for ground offload.');
    }
  }

  let guidanceText = '';
  let appNotice = '';
  const advisoryType: 'AUTOMATED_TRUCK_AVOIDANCE' | 'MANUAL_ATTENTION_REQUIRED' = appInfo.isTruckSpecific
    ? 'AUTOMATED_TRUCK_AVOIDANCE'
    : 'MANUAL_ATTENTION_REQUIRED';

  if (appInfo.isTruckSpecific) {
    guidanceText = `Routing via ${appInfo.name}. Dimensions (${profile.heightMeters}m H, ${profile.weightTonnes}t W, ${profile.widthMeters || 2.55}m Width) are routed around low bridges, weight limits, and lorry bans automatically.`;
    appNotice = 'Automated clearance avoidance active';
  } else {
    guidanceText = `Routing via ${appInfo.name} (Standard consumer directions). Standard consumer maps do NOT automatically steer around low bridges or 7.5T/18T weight zones. Keep high alert for overhead clearances under ${profile.heightMeters}m.`;
    appNotice = 'Advisory mode: Visual bridge verification required';
  }

  return {
    isClear: warnings.length === 0,
    warnings,
    guidanceText,
    appNotice,
    advisoryType
  };
}
