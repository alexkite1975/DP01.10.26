export interface LowBridgeItem {
  id: string;
  name: string;
  road: string;
  location: string;
  latitude: number;
  longitude: number;
  clearanceMeters: number;
  clearanceFeetInches: string;
  bridgeType: 'ARCH' | 'FLAT_GIRDER' | 'FOOTBRIDGE' | 'RAILWAY_VIADUCT';
  haunchClearanceMeters?: number; // For arch bridges, clearance at kerbside
  haunchClearanceFeetInches?: string;
  networkRailBridgeId: string;
  emergencyPhone: string;
  historyStrikes: number; // Historical strikes at this bridge
  dangerLevel: 'CRITICAL' | 'HIGH' | 'MEDIUM';
  remedyAction: string;
}

export interface HeightCalculationParams {
  tractorHeightMeters: number;
  trailerHeightMeters: number;
  airSuspensionMode: 'NORMAL' | 'DUMPED' | 'RAISED';
  fifthWheelOffsetMeters?: number;
  safetyBufferMeters?: number; // DVSA recommends minimum 0.15m (6 inches)
}

export interface BridgeStrikeCheckResult {
  runningHeightMeters: number;
  runningHeightFeetInches: string;
  requiredClearanceMeters: number;
  requiredClearanceFeetInches: string;
  safetyBufferMeters: number;
  isCompliant: boolean;
  clearanceMarginMeters: number;
  alertLevel: 'SAFE' | 'CAUTION' | 'CRITICAL_COLLISION';
  audioAlertMessage: string;
  recommendedSuspensionAction?: string;
}

export const NETWORK_RAIL_LOW_BRIDGES: LowBridgeItem[] = [
  {
    id: 'nr-bridge-001',
    name: 'Stuntney Road Railway Bridge',
    road: 'A142',
    location: 'Ely, Cambridgeshire',
    latitude: 52.3921,
    longitude: 0.2745,
    clearanceMeters: 2.74,
    clearanceFeetInches: "9' 0\"",
    bridgeType: 'FLAT_GIRDER',
    networkRailBridgeId: 'ECM-ELY-1204',
    emergencyPhone: '03457 11 41 41',
    historyStrikes: 35,
    dangerLevel: 'CRITICAL',
    remedyAction: 'Immediate diversion via A10 bypass. Any HGV over 2.7m will suffer catastrophic cab shearing.'
  },
  {
    id: 'nr-bridge-002',
    name: 'Watford Junction St Albans Road Girder Bridge',
    road: 'A412',
    location: 'Watford, Hertfordshire',
    latitude: 51.6645,
    longitude: -0.3952,
    clearanceMeters: 4.30,
    clearanceFeetInches: "14' 1\"",
    bridgeType: 'FLAT_GIRDER',
    networkRailBridgeId: 'WCML-WAT-049',
    emergencyPhone: '03457 11 41 41',
    historyStrikes: 18,
    dangerLevel: 'CRITICAL',
    remedyAction: 'Divert via A41 / M1 J5. Standard UK 4.45m curtainsiders and 4.90m double-deckers CANNOT pass.'
  },
  {
    id: 'nr-bridge-003',
    name: 'Caldecott Arched Railway Viaduct',
    road: 'B672',
    location: 'Caldecott, Rutland',
    latitude: 52.5312,
    longitude: -0.7189,
    clearanceMeters: 4.45,
    clearanceFeetInches: "14' 7\"",
    bridgeType: 'ARCH',
    haunchClearanceMeters: 3.85,
    haunchClearanceFeetInches: "12' 7\"",
    networkRailBridgeId: 'MR-RUT-088',
    emergencyPhone: '03457 11 41 41',
    historyStrikes: 14,
    dangerLevel: 'HIGH',
    remedyAction: 'ARCH WARNING: Center white line straddling required if under 4.3m. Kerbside haunch drops to 3.85m.'
  },
  {
    id: 'nr-bridge-004',
    name: 'Tamworth Road Railway Bridge',
    road: 'A513',
    location: 'Lichfield, Staffordshire',
    latitude: 52.6841,
    longitude: -1.8210,
    clearanceMeters: 4.20,
    clearanceFeetInches: "13' 9\"",
    bridgeType: 'FLAT_GIRDER',
    networkRailBridgeId: 'WCML-LCH-210',
    emergencyPhone: '03457 11 41 41',
    historyStrikes: 12,
    dangerLevel: 'HIGH',
    remedyAction: 'Divert via A38 trunk road. Do not enter single-lane approach.'
  },
  {
    id: 'nr-bridge-005',
    name: 'Kenworthy Road Arched Overbridge',
    road: 'B113',
    location: 'Hackney, East London',
    latitude: 51.5478,
    longitude: -0.0401,
    clearanceMeters: 4.55,
    clearanceFeetInches: "14' 11\"",
    bridgeType: 'ARCH',
    haunchClearanceMeters: 4.10,
    haunchClearanceFeetInches: "13' 5\"",
    networkRailBridgeId: 'NLL-HCK-015',
    emergencyPhone: '03457 11 41 41',
    historyStrikes: 9,
    dangerLevel: 'MEDIUM',
    remedyAction: 'Stay aligned strictly in center lane. Watch for opposing bus mirrors.'
  },
  {
    id: 'nr-bridge-006',
    name: 'Park Royal Western Avenue Viaduct',
    road: 'A40',
    location: 'Ealing, London',
    latitude: 51.5289,
    longitude: -0.2801,
    clearanceMeters: 5.03,
    clearanceFeetInches: "16' 6\"",
    bridgeType: 'FLAT_GIRDER',
    networkRailBridgeId: 'GWML-EAL-032',
    emergencyPhone: '03457 11 41 41',
    historyStrikes: 2,
    dangerLevel: 'SAFE' as any,
    remedyAction: 'Standard UK clearance unrestricted up to 4.95m.'
  }
];

export function metersToFeetInches(meters: number): string {
  const totalInches = meters * 39.3701;
  const feet = Math.floor(totalInches / 12);
  const inches = Math.round(totalInches % 12);
  return `${feet}' ${inches}"`;
}

export function feetInchesToMeters(feet: number, inches: number): number {
  const totalInches = feet * 12 + inches;
  return Number((totalInches * 0.0254).toFixed(3));
}

export function calculateDynamicBridgeClearance(
  params: HeightCalculationParams,
  targetBridge: LowBridgeItem
): BridgeStrikeCheckResult {
  const safetyBuffer = params.safetyBufferMeters ?? 0.15; // 15cm safety margin
  
  // Calculate air suspension offset
  let suspensionOffset = 0;
  if (params.airSuspensionMode === 'RAISED') {
    suspensionOffset = +0.10; // +10cm when raised for uneven ground
  } else if (params.airSuspensionMode === 'DUMPED') {
    suspensionOffset = -0.08; // -8cm when air dumped
  }

  // Running height equals the trailer height (usually highest point) plus suspension offset
  const baseHeight = Math.max(params.tractorHeightMeters, params.trailerHeightMeters);
  const runningHeightMeters = Number((baseHeight + suspensionOffset).toFixed(3));
  const requiredClearanceMeters = Number((runningHeightMeters + safetyBuffer).toFixed(3));
  
  // Compare against target bridge (taking arch haunch into consideration if arch)
  const effectiveBridgeClearance = targetBridge.clearanceMeters;
  const clearanceMargin = Number((effectiveBridgeClearance - runningHeightMeters).toFixed(3));

  let alertLevel: 'SAFE' | 'CAUTION' | 'CRITICAL_COLLISION' = 'SAFE';
  let audioAlertMessage = '';
  let recommendedSuspensionAction: string | undefined = undefined;

  if (clearanceMargin <= 0) {
    alertLevel = 'CRITICAL_COLLISION';
    audioAlertMessage = `EMERGENCY STOP! Bridge clearance is ${metersToFeetInches(effectiveBridgeClearance)}, but your vehicle running height is ${metersToFeetInches(runningHeightMeters)}. Catastrophic bridge strike imminent. Stop vehicle immediately and turn on hazard beacons!`;
  } else if (clearanceMargin < safetyBuffer) {
    alertLevel = 'CAUTION';
    audioAlertMessage = `CAUTION: Approaching ${targetBridge.name}. Clearance margin is only ${(clearanceMargin * 100).toFixed(0)}cm, which is less than the DVSA 15cm safety buffer. ${params.airSuspensionMode !== 'DUMPED' ? 'Consider lowering air suspension to normal ride height.' : 'Proceed with extreme vigilance at under 5 mph.'}`;
    if (params.airSuspensionMode === 'RAISED') {
      recommendedSuspensionAction = 'Return air suspension from RAISED to NORMAL ride height to gain 10cm safety clearance.';
    }
  } else {
    alertLevel = 'SAFE';
    audioAlertMessage = `Clearance verified: Vehicle height ${metersToFeetInches(runningHeightMeters)} has ${(clearanceMargin * 100).toFixed(0)}cm clearance beneath ${targetBridge.name}. Safe to proceed.`;
  }

  return {
    runningHeightMeters,
    runningHeightFeetInches: metersToFeetInches(runningHeightMeters),
    requiredClearanceMeters,
    requiredClearanceFeetInches: metersToFeetInches(requiredClearanceMeters),
    safetyBufferMeters: safetyBuffer,
    isCompliant: alertLevel !== 'CRITICAL_COLLISION',
    clearanceMarginMeters: clearanceMargin,
    alertLevel,
    audioAlertMessage,
    recommendedSuspensionAction
  };
}
