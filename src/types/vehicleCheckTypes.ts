// Drive Partners: Autonomous AI DVSA Vehicle & Trailer Checker Types
// Regulatory Basis: UK DVSA Guide to Maintaining Roadworthiness & Goods Vehicles Licensing Act 1995

export type DvsaDefectSeverity =
  | 'IMMEDIATE_PROHIBITION_PG9' // Critical: Vehicle locked out, cannot drive on public highway
  | 'DELAYED_PROHIBITION_10_DAY' // 10 days to rectify before road ban
  | 'ADVISORY' // Minor cosmetic or pre-wear item for next PMI
  | 'PASS';

export type InspectionZoneId =
  | 'IN_CAB'
  | 'STEER_AXLE'
  | 'COUPLING_CATWALK'
  | 'TRAILER_RUNNING_GEAR'
  | 'REAR_LIGHTING';

export interface WalkaroundDefectItem {
  id: string;
  zoneId: InspectionZoneId;
  component: string;
  severity: DvsaDefectSeverity;
  dvsaReference: string; // e.g. "DVSA Categorisation of Defects Part 2 Sec 1.1"
  description: string;
  actionRequired: string;
  estimatedRepairHours: number;
  partRequired?: string;
  workshopJobCardCreated: boolean;
  photoUrl?: string;
}

export interface WalkaroundZoneResult {
  zoneId: InspectionZoneId;
  name: string;
  subtitle: string;
  status: 'PASS' | 'ADVISORY' | 'FAIL';
  itemsChecked: string[];
  aiConfidence: number;
  photoUrl?: string;
  acousticAirLeakDetected?: boolean;
}

export interface WalkaroundCheckRecord {
  id: string;
  dateKey: string; // YYYY-MM-DD
  displayDate: string; // e.g. Monday, 28 Sep 2026
  timestamp: string;
  driverName: string;
  driverLicenceNumber: string;
  driverTachoCard: string;
  vehicleReg: string;
  trailerId: string;
  trailerType: 'CURTAINSIDER' | 'BOX' | 'REFRIGERATED' | 'SKELETAL' | 'FLATBED';
  haulierName: string;
  oLicenceNumber: string;
  ocrsStatus: 'GREEN' | 'AMBER' | 'RED';
  odometerKm: number;
  durationMinutes: number; // Must be >= 12 mins for artic HGV
  tachoStatusReconciled: boolean;
  tachoShiftState: 'OTHER_WORK' | 'REST' | 'DRIVING';
  overallResult: 'PASS_CLEAN' | 'ADVISORY_ISSUED' | 'RECTIFICATION_10_DAY' | 'IMMEDIATE_PROHIBITION_PG9';
  zones: WalkaroundZoneResult[];
  defects: WalkaroundDefectItem[];
  vaultSha256: string;
  digitalSignature: string;
  pmiDueDays: number;
  tyreTreadMinMm: number;
  wheelNutsTorqued: boolean;
  couplingDogClipLocked: boolean;
  airPressureBar: number;
  notes?: string;
}

export interface TrailerDropSwapMemory {
  trailerId: string;
  trailerType: string;
  lastDroppedAt: string;
  lastDroppedLocation: string;
  lastDriverName: string;
  activeAdvisories: string[];
  kingpinSize: string;
  tyreSpec: string;
}

// 4-Tier Privacy & Permission Framework
export type AssetPrivacyTier =
  | 'TIER_1_PUBLIC_PHYSICAL_ENVELOPE' // Unrestricted: Dimensions & weight for navigation & safe bridge clearance
  | 'TIER_2_OPERATIONAL_SAFETY_STATE' // Authorized: Defect state, roadworthiness pass/fail, DVSA examiner QR
  | 'TIER_3_PROPRIETARY_FLEET_DATA'  // Masked: Customer booking references, cargo value, telematics GPS history
  | 'TIER_4_DRIVER_PII_PROTECTED';    // Redacted: Driver full name, phone number, NI number (GDPR compliant)

export interface AssetPrivacyAudit {
  publicDimensionsAllowed: boolean;
  operationalSafetyAllowed: boolean;
  commercialCargoMasked: boolean;
  driverPiiRedacted: boolean;
  ownerFleetTenantId: string;
  activeHaulierTenantId: string;
  isCrossHaulierPool: boolean;
}

export interface TrailerAssetRecord {
  trailerId: string; // e.g. "TR-8842"
  plateNumber: string; // e.g. "C481928"
  trailerType: 'CURTAINSIDER' | 'BOX_VAN' | 'REFRIGERATED_REEFER' | 'SKELETAL_CONTAINER' | 'FLATBED' | 'LOW_LOADER';
  fleetOwnerName: string; // e.g. "Maritime Transport Ltd"
  oLicenceNumber: string; // e.g. "OF1084201"
  heightMeters: number; // e.g. 4.45 (14' 7")
  widthMeters: number; // e.g. 2.55 (2.60 for reefer)
  lengthMeters: number; // e.g. 13.60
  unladenWeightTonnes: number; // e.g. 7.2
  maxGrossWeightTonnes: number; // e.g. 38.0
  currentPayloadTonnes: number; // e.g. 26.5
  axlesCount: number; // e.g. 3 (triaxle)
  kingpinOffsetMeters: number; // e.g. 1.20
  adrHazardClass?: string; // e.g. "NONE" | "CLASS_3_FLAMMABLE"
  tunnelRestrictionCode?: 'B' | 'C' | 'D' | 'E';
  lastPmiDate: string;
  nextPmiDueDate: string;
  motExpiryDate: string;
  lastKnownLocation: string;
  roadworthinessStatus: 'ROADWORTHY_PASS' | 'ADVISORY_MONITOR' | 'GROUNDED_VOR';
  activeAdvisories: string[];
  privacyAudit: AssetPrivacyAudit;
}

export interface TractorUnitAssetRecord {
  vehicleReg: string; // e.g. "DG21 EDP"
  fleetNumber: string; // e.g. "FL-104"
  makeModel: string; // e.g. "Scania 450S 6x2"
  haulierOwner: string;
  cabHeightMeters: number; // e.g. 3.85
  widthMeters: number; // e.g. 2.55
  lengthMeters: number; // e.g. 6.20
  unladenWeightTonnes: number; // e.g. 8.4
  maxTrainWeightTonnes: number; // e.g. 44.0
  fifthWheelOffsetMeters: number; // e.g. 0.85
  axleConfig: '6x2' | '4x2' | '6x4';
  euroStandard: 'EURO_6';
  dvsStarRating: number; // 0 to 5 stars
  cazStatus: 'EXEMPT' | 'PAYABLE';
}

export interface CombinationVehicleEnvelope {
  combinedHeightMeters: number; // e.g. 4.45m
  combinedHeightFeetInches: string; // e.g. 14' 7"
  combinedWidthMeters: number; // e.g. 2.55m
  combinedLengthMeters: number; // e.g. 16.50m
  grossCombinationWeightTonnes: number; // e.g. 41.9 Tonnes
  totalAxles: number; // e.g. 6
  maxAxleWeightTonnes: number; // e.g. 11.5
  isHighCube: boolean; // true if height >= 4.20m (triggers low bridge warnings)
  lowBridgeClearanceMarginMeters: number; // 0.15m statutory buffer
  bridgeAlertThresholdMeters: number; // combinedHeight + 0.15m
  emissionStandard: string; // "Euro 6 / ULEZ Exempt"
  dvsRating: number;
  adrCategory: string;
  lastSyncedAt?: string;
  tomtomPayload: {
    vehicleHeight: number;
    vehicleWidth: number;
    vehicleLength: number;
    vehicleWeight: number;
    vehicleAxleWeight: number;
    vehicleCommercial: boolean;
    vehicleLoadType: string;
  };
}

export type InspectionSequenceMode = 'AI_ADAPTIVE' | 'STRICT_STATUTORY' | 'CLOCKWISE_PERIMETER';

export interface DriverWalkaroundPreference {
  mode: InspectionSequenceMode;
  preferredSequence: number[]; // Ordered item numbers (1..32)
  historySessionsCount: number;
  habitConfidencePercent: number;
  habitSummary: string;
  averageDurationMinutes: number;
  lastCalibrationTimestamp: string;
}

export interface DeliveryRouteSubmission {
  id: string;
  destinationName: string;
  destinationAddress: string;
  postcode: string;
  googlePlaceId?: string;
  sourceType: 'GOOGLE_PLACES' | 'MANIFEST_UPLOAD' | 'CAMERA_OCR' | 'VOICE_COMMAND_INPUT';
  routeCommand?: string; // e.g. "add routes xx"
  palletCount?: number;
  cargoWeightTonnes?: number;
  deliveryTimeWindow?: string;
  adrHazardClass?: string;
  evaluatedBridgesCount?: number;
  criticalBridgeHazard?: boolean;
}

