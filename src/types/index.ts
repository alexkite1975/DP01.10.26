export type RiskLevel = 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';

export type UserRole = 'BUSINESS_ADMIN' | 'SITE_MANAGER' | 'DRIVER';

export type VehicleCategory =
  | 'CAR_VAN'
  | '3_5T_LUTON'
  | '7_5T_RIGID'
  | '18T_RIGID'
  | '26T_CURTAINSIDER'
  | '44T_ARTIC_HGV';

export type PreferredNavApp =
  | 'GOOGLE_MAPS'
  | 'TOMTOM_TRUCK'
  | 'HERE_WEGO'
  | 'WAZE'
  | 'APPLE_MAPS'
  | 'SYGIC_TRUCK';

export interface DriverVehicleProfile {
  id?: string;
  driverName: string;
  vehicleReg: string;
  vehicleCategory: VehicleCategory;
  heightMeters: number;
  weightTonnes: number;
  lengthMeters: number;
  widthMeters?: number;
  hasTailLift: boolean;
  preferredNavApp?: PreferredNavApp;
  avoidLowBridges?: boolean;
  avoidWeightRestrictions?: boolean;
  avoidNarrowLanes?: boolean;
  avoidTimeCurfews?: boolean;
  currentTrailerNumber?: string;
  currentHaulierCompany?: string;
  currentTrailerType?: TrailerType;
  tachoCardNumber?: string;
  licenceNumber?: string;
  measurementUnits?: 'IMPERIAL' | 'METRIC';
  distanceUnits?: 'MILES' | 'KILOMETERS';
  appLanguage?: 'EN' | 'PL' | 'RO' | 'LT' | 'ES';
  paymentStructure?: 'PAYE' | 'LTD' | 'UMBRELLA';
}

export interface TimeWindowHazard {
  id: string;
  title: string;
  timeStart: string; // "08:00"
  timeEnd: string;   // "09:15"
  severity: RiskLevel;
  description: string;
  affectedParties: string;
}

export interface HazardMatrixItem {
  id: string;
  hazard: string;
  category: 'TRAFFIC' | 'PEDESTRIAN' | 'SLIP_TRIP' | 'OVERHEAD' | 'MANUAL_HANDLING' | 'ENVIRONMENTAL';
  likelihood: number; // 1-5
  severity: number;   // 1-5
  riskRating: number; // 1-25 (likelihood * severity)
  riskLevel: RiskLevel;
  controlMeasures: string[];
}

export interface ApproachVideoStep {
  stepNumber: number;
  heading: string;
  instruction: string;
  narrationText: string;
  checkpointType:
    | 'HIGHWAY_EXIT'
    | 'ROUNDABOUT'
    | 'SECURITY_GATE'
    | 'WEIGHBRIDGE'
    | 'NARROW_ALLEY'
    | 'LOADING_BAY'
    | 'PARKING';
  hazardWarning?: string;
  visualPrompt?: string;
  mockImageUrl: string;
}

export interface ApproachVideoGuide {
  title: string;
  summary: string;
  durationSeconds: number;
  steps: ApproachVideoStep[];
}

export interface MediaAsset {
  id: string;
  type: 'PHOTO' | 'VIDEO' | 'SATELLITE' | 'SCHEMATIC';
  url: string;
  caption: string;
  category: 'ENTRANCE' | 'GATE' | 'LOADING_BAY' | 'RESTRICTION' | 'HAZARD';
  uploadedAt: string;
  uploadedBy: string;
}

export interface DriverObservation {
  id: string;
  driverName: string;
  vehicleReg: string;
  vehicleCategory: VehicleCategory;
  timestamp: string;
  groundConditions: 'DRY' | 'WET' | 'ICY_SLIPPERY' | 'POTHOLES' | 'DEBRIS_OIL';
  congestionLevel: 'CLEAR' | 'BUSY' | 'GRIDLOCK_WAITING_OUTSIDE';
  gateCodeStillValid: boolean;
  reportedGateCode?: string;
  notes: string;
  comment?: string;
  photos: string[];
  aiCategoryTag?: string;
  status: 'SUBMITTED' | 'APPROVED_BY_BUSINESS' | 'REJECTED';
}

export interface PendingDriverModification {
  id: string;
  siteId: string;
  siteTitle: string;
  driverName: string;
  driverPhone?: string;
  date: string;
  fieldTarget: string; // e.g. "Gate Code", "Height Clearance", "Blind Spot Warning"
  originalValue: string;
  proposedValue: string;
  reason: string;
  evidencePhoto?: string;
  status: 'PENDING' | 'APPROVED' | 'REJECTED';
  reviewedBy?: string;
  reviewedAt?: string;
  reviewComment?: string;
}

export interface BusinessSiteSection {
  mandatoryPPE: string[];
  accessProcedures: string;
  gateSecurityCode: string;
  intercomInstructions: string;
  operatingHours: {
    open: string;
    close: string;
    days: string;
    outOfHoursDeliveryPermitted: boolean;
  };
  timeWindowHazards: TimeWindowHazard[];
  vehicleConstraints: {
    maxHeightMeters: number;
    maxWeightTonnes: number;
    maxLengthMeters: number;
    maxWidthMeters?: number;
    tailLiftRequired: boolean;
    turningCircleConstraint: 'EASY' | 'MODERATE' | 'TIGHT' | 'EXTREME_REVERSING_ONLY';
    lowBridgeAlert?: string;
    timeCurfews?: string;
  };
  loadingBayDetails: {
    bayCount: number;
    dockType: 'FLUSH_DOCK' | 'GROUND_LEVEL' | 'RAMP' | 'TAIL_LIFT_ONLY';
    reversingGuidance: string;
    wheelChocksMandatory: boolean;
    keysHandoverRequired: boolean;
  };
  siteManager: {
    name: string;
    phone: string;
    email: string;
    radioChannel?: string;
  };
  emergencyMusterPoint: string;
  baselineHazards: HazardMatrixItem[];
  approachVideoGuide: ApproachVideoGuide;
  media: MediaAsset[];
  sitePlan?: SitePlanData;
}

export interface DriverSiteSection {
  realTimeAlerts: (string | any)[];
  observations: DriverObservation[];
  pendingModifications: PendingDriverModification[];
}

export interface AuditHistoryEntry {
  id: string;
  timestamp: string;
  user: string;
  role: string;
  action: string;
  details: string;
}

export interface NearbySensitivity {
  name: string;
  type: string;
  distanceMeters: number;
  riskReason: string;
}

export interface SiteRiskAssessment {
  id: string;
  title: string;
  businessName: string;
  address: string;
  placeId?: string;
  coordinates: {
    lat: number;
    lng: number;
  };
  plusCode?: string;
  what3words?: string;
  depotZone: string;
  createdAt: string;
  updatedAt: string;
  version: number;
  overallRiskLevel: RiskLevel;
  overallScore: number; // 1 - 25
  status: 'APPROVED' | 'PENDING_DRIVER_CHANGES' | 'UNDER_REVIEW' | 'DRAFT';
  businessSection: BusinessSiteSection;
  driverSection: DriverSiteSection;
  auditHistory: AuditHistoryEntry[];
  placePhotos?: string[];
  nearbySensitivities?: NearbySensitivity[];
  isOfflineCached?: boolean;
  dynamicRiskIndex?: DynamicRiskIndex;
  inductionGatekeeping?: InductionGatekeeping;
  congestionTracker?: CongestionWaitTracker;
  threeTapAudits?: ThreeTapSafetyAudit[];
}

export interface SubscriptionInfo {
  tier: 'STARTER' | 'FLEET_PRO' | 'ENTERPRISE';
  status: 'ACTIVE' | 'TRIALING' | 'PAST_DUE';
  billingCycle: 'monthly' | 'annual';
  monthlyPrice: number;
  sitesAllowed: number;
  sitesUsed: number;
  driversAllowed: number;
  aiAuditsRemaining: number;
  renewalDate: string;
}

export interface SiteManagerUser {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  assignedSites: string[]; // Site IDs
  phone: string;
  status: 'ACTIVE' | 'INVITED' | 'INACTIVE';
}

export type DriverModificationRequest = PendingDriverModification;
export type SubscriptionPlan = SubscriptionInfo;

export type SitePlanAnnotationType =
  | 'HAZARD'
  | 'CLEARANCE_RESTRICTION'
  | 'SECURITY_GATE'
  | 'LOADING_BAY'
  | 'TRANSPORT_OFFICE'
  | 'PEDESTRIAN_PATH'
  | 'MUSTER_POINT'
  | 'BLIND_SPOT'
  | 'WEIGHBRIDGE'
  | 'PARKING_WAITING'
  | 'ONE_WAY';

export interface SitePlanAnnotation {
  id: string;
  xPercent: number; // 0 to 100 on canvas
  yPercent: number; // 0 to 100 on canvas
  type: SitePlanAnnotationType;
  label: string;
  description: string;
  severity?: RiskLevel;
  color?: string;
  createdAt?: string;
  createdBy?: string;
  photoUrl?: string;
  videoUrl?: string;
  bayNumber?: string;
  aiDetected?: boolean;
  aiConfidence?: number;
}

export interface SitePlanData {
  planType: 'SATELLITE' | 'BLUEPRINT' | 'SCHEMATIC_YARD';
  backgroundUrl?: string;
  widthMeters?: number;
  lengthMeters?: number;
  annotations: SitePlanAnnotation[];
  lastAnnotatedAt?: string;
}

export type AppPageView =
  | 'search'
  | 'sites'
  | 'site-plan'
  | 'detail'
  | 'approach'
  | 'hazard-snap'
  | 'business'
  | 'hud'
  | 'shifts-marketplace'
  | 'fleet-vor-grounding'
  | 'self-billing-payroll';

export interface ScannedDocumentItem {
  id: string;
  name: string;
  dataUrl: string; // base64 data url (image or application/pdf)
  mimeType: string;
  sizeBytes?: number;
  pageNumber?: number;
  uploadedAt: string;
}

export interface DocumentExtractionDetails {
  isExtractedFromExistingDoc: boolean;
  documentType: string;
  keyFindings: string[];
  extractedDate?: string;
  confidenceScore?: number;
}

// --- Drive Partners & ReliefHGV Specification Additions ---

export type ThreeTapRating = 'RED' | 'AMBER' | 'GREEN';

export interface ThreeTapSafetyAudit {
  id: string;
  timestamp: string;
  driverName: string;
  vehicleReg: string;
  yardAccessRating: ThreeTapRating;
  yardAccessNotes?: string;
  pedestrianSegregationRating: ThreeTapRating;
  pedestrianNotes?: string;
  bayClearanceLightingRating: ThreeTapRating;
  bayLightingNotes?: string;
  obstructionPhotos: string[];
  additionalNotes?: string;
  calculatedRiskContribution: number; // 0 to 100
}

export interface DynamicRiskIndex {
  score: number; // 1 - 100
  level: RiskLevel;
  ratingScore: number; // 0 - 100
  defectFrequencyScore: number; // 0 - 100
  nearMissScore: number; // 0 - 100
  isHighRiskAlert: boolean; // true if score > 75
  mandatorySafetyAdvisory?: string;
  lastCalculatedAt: string;
}

export interface InductionGatekeeping {
  isCompleted: boolean;
  completedAt?: string;
  completedByDriver?: string;
  oneWayTrafficAcknowledged: boolean;
  speedLimitAcknowledged: boolean;
  mandatoryPPEConfirmed: string[];
  qrToken: string;
  isQrUnlocked: boolean;
  specialHazardsAcknowledged: string[];
}

export interface CongestionWaitTracker {
  queueCount: number;
  avgTurnaroundMinutes: number;
  currentWaitMinutes: number;
  isDemurrageTimerRunning: boolean;
  timerStartedAt?: string;
  demurrageHourlyRate: number; // default £45.00/hr
  estimatedDemurrageClaim: number;
}

export interface TachographActivityBlock {
  timeStart: string;
  timeEnd: string;
  durationMinutes: number;
  activityType: 'DRIVING' | 'REST' | 'WORK' | 'AVAILABILITY';
  speedKmh?: number;
}

export interface TachographScanResult {
  id: string;
  timestamp: string;
  driverName: string;
  driverCardNumber: string;
  vehicleReg: string;
  printoutDate: string;
  printoutType: string;
  continuousDriveMinutes: number;
  dailyDriveMinutes: number;
  dailyRestMinutes: number;
  weeklyDriveMinutes: number;
  wtdCompliant: boolean;
  infringements: string[];
  wtdBreakCountdownMinutes: number;
  splitBreakEligible: boolean;
  activities: TachographActivityBlock[];
  summary: string;
  confidence: number;
  sourceImage?: string;
  detectedManufacturer?: string;
  odometerStartKm?: number;
  odometerEndKm?: number;
  distanceDrivenKm?: number;
  detailedInfringements?: any[];
  hoursSummary?: {
    drivingMinutes: number;
    workingMinutes: number;
    restMinutes: number;
    poaMinutes: number;
  };
  remainingCounters?: any;
  workedHours?: any;
  cardMetadata?: any;
}

// --- Phase 3: In-Cab Safety & Telematics Infrastructure ---

export type LowBridgeAlertTier = 'TIER_1_ADVISORY' | 'TIER_2_WARNING' | 'TIER_3_SIREN';

export type SplitBreakType = '15_MIN_SPLIT' | '30_MIN_SPLIT' | '45_MIN_FULL' | '11_HOUR_DAILY';

export interface TachoSplitBreakState {
  breakType: SplitBreakType;
  targetMinutes: number;
  elapsedSeconds: number;
  isResting: boolean;
  isRollAwayGraceActive: boolean;
  rollAwayGraceSecondsRemaining: number;
  lastCompletedBreak?: {
    breakType: SplitBreakType;
    durationMinutes: number;
    completedAt: string;
  };
}

export type LaybyStatus = 'OPEN' | 'BUSY' | 'FULL';

export interface LaybyParkingLocation {
  id: string;
  name: string;
  road: string;
  markerPost?: string;
  direction: 'NORTHBOUND' | 'SOUTHBOUND' | 'EASTBOUND' | 'WESTBOUND';
  distanceMiles: number;
  capacityStatus: LaybyStatus;
  totalSpaces: number;
  openSpacesEstimated: number;
  facilities: string[]; // e.g. ["24h Toilets", "Hot Food Van", "CCTV", "Lit"]
  lastReportedAt: string;
  reportedBy: string;
}

export interface DigitalCbMessage {
  id: string;
  senderName: string;
  callsign: string;
  vehicleReg: string;
  channel: number;
  distanceMiles: number;
  message: string;
  isEmergency: boolean;
  timestamp: string;
}

export interface BulkheadScanResult {
  id: string;
  heightMeters: number;
  heightFeetInches: string;
  trailerId?: string;
  confidence: number;
  rawPlateText: string;
  timestamp: string;
}


// --- Phase 4: Core Marketplace & FleetOps Suite (Platform Architecture Section 1 & 2) ---

export type VehicleClass =
  | 'CAT_C_CLASS_2'
  | 'CAT_CE_CLASS_1'
  | 'ADR_HAZCHEM'
  | 'HIAB_LORRY_LOADER'
  | 'MOFFETT_FORKLIFT';

export type TrailerType =
  | 'CURTAINSIDER'
  | 'BOX_VAN'
  | 'FLATBED'
  | 'REFRIGERATED_TEMP'
  | 'CONTAINER_SKELETAL'
  | 'RIGID_TAILLIFT';

export type IR35Status = 'INSIDE_IR35' | 'OUTSIDE_IR35_B2B';

export type ShiftStatus = 'OPEN' | 'LOCKING' | 'BOOKED' | 'IN_PROGRESS' | 'COMPLETED' | 'CANCELLED';

export interface MarketplaceShift {
  id: string;
  shiftRef: string;
  title: string;
  haulierName: string;
  haulierOlicence?: string;
  siteName: string;
  location: {
    address: string;
    city: string;
    postcode: string;
    lat: number;
    lng: number;
  };
  vehicleClass: VehicleClass;
  trailerType: TrailerType;
  startTime: string;
  endTime: string;
  durationHours: number;
  baseHourlyRate: number;
  overtimeHourlyRate: number;
  nightOutAllowance: number;
  agencyPlatformFeePercent: number;
  ir35Status: IR35Status;
  ir35Reasoning: string;
  status: ShiftStatus;
  bookedDriverId?: string;
  bookedDriverName?: string;
  bookingLockExpiresAt?: string; // Atomic Redlock timeout timestamp (e.g. 120s lockout)
  distanceMilesFromDriver: number; // 30-mile / 45-min proximity matching
  drivingTimeMinutesFromDriver: number;
  specialRequirements: string[];
  goodsDescription?: string;
  palletCount?: number;
}

export type InspectionCheckCategory =
  | 'TIRES_WHEELS'
  | 'BRAKES_AIR_SYSTEM'
  | 'STEERING_SUSPENSION'
  | 'LIGHTS_ELECTRICAL'
  | 'CHASSIS_BULKHEAD'
  | 'ADBLUE_FLUIDS'
  | 'TACHOGRAPH_SAFETY';

export type DefectSeverity =
  | 'MINOR_MONITOR'
  | 'MAJOR_REPAIR_SOON'
  | 'SAFETY_CRITICAL_RED_VOR';

export interface WalkaroundCheckItem {
  id: string;
  category: InspectionCheckCategory;
  name: string;
  dvsaGuideReference: string; // e.g. 'DVSA Roadworthiness Guide §2.1'
  status: 'PASS' | 'DEFECT';
  severity?: DefectSeverity;
  notes?: string;
  photoUrl?: string;
}

export interface TechnicianSignOff {
  technicianId: string;
  technicianName: string;
  workshopFacility: string;
  torqueWrenchCalibrationId: string;
  torqueNmApplied: number;
  replacementPartsSerials: string[];
  repairedAt: string;
  dvsaRoadworthyCertNumber: string;
}

export interface FleetVehicleVORRecord {
  id: string;
  vehicleReg: string;
  makeModel: string;
  fleetNumber: string;
  vehicleType: VehicleClass;
  trailerAssigned?: string;
  isGroundedVOR: boolean;
  vorTriggeredAt?: string;
  vorReason?: string;
  reportedByDriverName?: string;
  reportedByDriverLicence?: string;
  mileageOdometer: number;
  defectsList: WalkaroundCheckItem[];
  technicianSignOff?: TechnicianSignOff;
  auditTrail: {
    timestamp: string;
    action: string;
    user: string;
  }[];
}

export interface TimesheetShiftRecord {
  shiftId: string;
  shiftRef: string;
  date: string;
  vehicleReg: string;
  haulierClient: string;
  hoursClaimed: number;
  hoursApproved: number;
  hourlyRate: number;
  grossPay: number;
  disputed: boolean;
  disputeReason?: string;
}

export type PaymentMethod = 'AUTOMATED_DIRECT_DEBIT' | 'NET_30_FACTORING';

export interface SelfBillingInvoice {
  invoiceNumber: string;
  weekEnding: string;
  driverId: string;
  driverName: string;
  driverNiNumber: string;
  driverUtrOrCompany?: string;
  haulierName: string;
  haulierVatNumber: string;
  ir35Status: IR35Status;
  taxDeductionPAYE?: number;
  nicEmployeeDeduction?: number;
  grossTotal: number;
  agencyPlatformFee: number;
  factoringSurcharge: number;
  vatAmount: number;
  netPayable: number;
  paymentMethod: PaymentMethod;
  payoutDueDate: string;
  tuesdayDisputeCutoffMet: boolean;
  status:
    | 'PENDING_TUESDAY_CUTOFF'
    | 'APPROVED_FOR_PAYROLL'
    | 'DISPUTED'
    | 'PROCESSED_BACS_DIRECT_DEBIT'
    | 'FUNDED_FACTORING';
  timesheets: TimesheetShiftRecord[];
}


// --- Enterprise Compliance, Telematics & Vision AI Extensions ---

export interface DVSAEarnedRecognitionKPIs {
  reportingPeriod: string; // e.g. "2026-W38"
  operatorLicenceNumber: string;
  haulierName: string;
  overallStatus: 'COMPLIANT_GREEN' | 'ACTION_REQUIRED_AMBER' | 'NON_COMPLIANT_RED';
  
  // Maintenance KPIs (B1 - B4)
  b1SafetyInspectionIntervalsPercent: number; // Target: 100% on-time within PMI
  b2SafetyCriticalDefectsRectifiedBeforeUsePercent: number; // Target: 100%
  b3RoadworthinessInitialPassRatePercent: number; // Target: >= 95%
  b4UnplannedVORRatePercent: number; // Target: <= 5%

  // Driver Hours KPIs (D1 - D4)
  d1TotalInfringementRatePercent: number; // Target: <= 2.0%
  d2ContinuousDrivingBreakInfringements: number; // Target: 0
  d3DailyRestPeriodInfringements: number; // Target: 0
  d4MissingTachographMileagePercent: number; // Target: <= 0.5%

  lastAuditDate: string;
  auditHashSHA256: string;
}

export type DVSStarRating = 0 | 1 | 2 | 3 | 4 | 5;

export interface DVSComplianceRecord {
  vehicleReg: string;
  makeModel: string;
  grossVehicleWeightTonnes: number;
  dvsStarRating: DVSStarRating;
  isPSSCompliant: boolean; // Progressive Safe System (Oct 2024 mandate)
  pssEquipment: {
    blindSpotInfoSystemBSIS: boolean;
    movingOffInfoSystemMOIS: boolean;
    cameraMonitoringSystemCMS: boolean;
    leftTurnAudibleWarning: boolean;
    sideUnderRunProtection: boolean;
  };
  tflPermitStatus: 'PERMIT_ISSUED' | 'APPLICATION_REQUIRED' | 'PROHIBITED';
  cazExemptions: {
    londonULEZ: boolean;
    londonLEZ: boolean;
    birminghamCAZ: boolean;
    bathCAZ: boolean;
    bristolCAZ: boolean;
    sheffieldCAZ: boolean;
  };
  applicableDailyCharges: {
    zoneName: string;
    dailyFee: number;
    penaltyFee: number;
  }[];
}

export interface BridgeHazardPoint {
  id: string;
  bridgeName: string;
  roadName: string;
  clearanceMeters: number;
  clearanceFeetInches: string;
  distanceAheadMiles: number;
  vehicleMarginMm: number; // clearanceMeters - vehicleHeight
  severity: 'RED_CRITICAL_STOP' | 'AMBER_ADVISORY' | 'GREEN_CLEAR';
  recommendedDetour: string;
}

export interface HGVRoutePlan {
  origin: string;
  destination: string;
  distanceMiles: number;
  estimatedDrivingTimeMinutes: number;
  vehicleHeightMeters: number;
  vehicleWeightTonnes: number;
  hazardBridges: BridgeHazardPoint[];
  detourRouteAvailable: boolean;
  detourDistanceMiles?: number;
  detourExtraMinutes?: number;
  cazZonesTraversed: string[];
}

export interface OfflineQueueItem {
  id: string;
  actionType: 'WALKAROUND_DEFECT' | 'HAZARD_SNAP' | 'THREE_TAP_AUDIT' | 'DEMURRAGE_CLAIM';
  payload: any;
  queuedAt: string;
  synced: boolean;
  syncAttempts: number;
}

export interface TyreScanAnalysis {
  confidence: number;
  treadDepthMm: number;
  isLegalTread: boolean; // >= 1.0mm DVSA limit
  sidewallDamageDetected: boolean;
  damageDescription?: string;
  wheelNutPointersAligned: boolean;
  pressureBarEstimated?: number;
  severity: 'PASS_ROADWORTHY' | 'MONITOR_ADVISORY' | 'FAIL_SAFETY_CRITICAL_RED_VOR';
  recommendation: string;
  timestamp: string;
}

export interface CouplingLockAnalysis {
  confidence: number;
  isKingpinLocked: boolean;
  isSafetyDogClipEngaged: boolean;
  areSuzieHosesConnected: boolean;
  severity: 'SAFE_COUPLED' | 'UNSAFE_UNLOCKED_RED_VOR';
  recommendation: string;
  timestamp: string;
}

export interface HaulageCompany {
  id: string;
  name: string;
  code: string;
  primaryColor: string;
  fleetCount?: number;
  commonTrailerTypes: string[];
}

export interface LearnedTrailerProfile {
  id: string; // composite key: companyId + '_' + trailerNumber
  companyId: string;
  companyName: string;
  trailerNumber: string; // e.g. "1042", "TRL-881"
  trailerType: TrailerType;
  heightMeters: number;
  heightFeetInches: string;
  lengthMeters: number; // standard trailer 13.6m
  combinationLengthMeters: number; // total artic combo 16.5m
  widthMeters: number; // standard 2.55m or 2.60m refrigerated
  grossWeightTonnes: number; // 44t
  hasTailLift: boolean;
  isDoubleDecker: boolean;
  notes?: string;
  dateLearned: string;
  timesUsed: number;
  lastUsedAt?: string;
  bulkheadVerified: boolean;
  // Statutory MOT & Roadworthiness Testing Dossier
  motExpiryDate?: string;
  motStatus?: 'VALID' | 'DUE_SOON' | 'EXPIRED';
  motCertificateNumber?: string;
  lastBrakeTestDate?: string;
  lastBrakeEfficiencyPercent?: number;
  chassisVinNumber?: string;
  unladenWeightTonnes?: number;
  manufactureYear?: number;
  operatorDiscNumber?: string;
  axleCount?: number;
}

export interface RouteStop {
  id: string;
  stopSequence: number;
  customerName: string;
  address: string;
  postcode: string;
  timeWindow?: string;
  estimatedArrival: string;
  estimatedDeparture: string;
  drivingMinutesFromPrev: number;
  distanceMilesFromPrev: number;
  dwellMinutes: number; // unloading/loading time (worked as "Work")
  palletCount?: number;
  weightKg?: number;
  consignmentNotes?: string;
  status: 'PENDING' | 'EN_ROUTE' | 'ARRIVED' | 'COMPLETED' | 'EXCEPTION';
  completedAt?: string;
  ePodSignatory?: string;
  isMandatoryTachoBreak?: boolean;
}

export interface OptimizedRoutePlan {
  id: string;
  routeTitle: string;
  originDepot: string;
  destinationDepot: string;
  totalDistanceMiles: number;
  totalDrivingMinutes: number;
  totalWorkingMinutes: number;
  totalBreakMinutes: number;
  totalShiftMinutes: number;
  tachoComplianceStatus: 'COMPLIANT' | 'BREAK_REQUIRED' | 'LIMIT_EXCEEDED';
  maxContinuousDriveMinutes: number;
  mandatoryBreakCount: number;
  stops: RouteStop[];
  createdAt: string;
  lastAmendedAt?: string;
}

export interface DriverLicenceProfile {
  verified: boolean;
  surname: string;
  firstNames: string;
  fullName: string;
  dateOfBirth: string;
  licenceNumber: string;
  validFrom: string;
  validTo: string;
  issuingAuthority: string;
  categories: string[];
  highestHGVCategory: 'CAT_CE' | 'CAT_C' | 'CAT_C1' | 'NONE';
  categoryDescription: string;
  penaltyPoints: number;
  endorsements: string[];
  cpcStatus: 'ACTIVE' | 'EXPIRED' | 'REQUIRED';
  cpcExpiryDate: string;
  tachoCardNumber: string;
  dvlaCheckStatus: 'PASSED_CLEAN' | 'POINTS_NOTED' | 'SUSPENDED';
  confidenceScore: number;
  verificationNotes: string;
  homeDepot?: string;
  contactPhone?: string;
  contactEmail?: string;
  scannedAt?: string;
  preferredNavApp?: PreferredNavApp;
  measurementUnits?: 'IMPERIAL' | 'METRIC';
  distanceUnits?: 'MILES' | 'KILOMETERS';
  appLanguage?: 'EN' | 'PL' | 'RO' | 'LT' | 'ES';
  paymentStructure?: 'PAYE' | 'LTD' | 'UMBRELLA';
  vehicleCategory?: VehicleCategory;
  avoidLowBridges?: boolean;
  avoidWeightRestrictions?: boolean;
  avoidNarrowLanes?: boolean;
  reliefHgvRegistered?: boolean;
  reliefHourlyRate?: number;
}
