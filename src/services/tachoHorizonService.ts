export interface TachoRuleState {
  continuousDriveMinutes: number; // Max 270 (4.5h)
  remainingContinuousMinutes: number;
  splitBreak1Completed: boolean; // 15 mins
  splitBreak2Completed: boolean; // 30 mins
  dailyDriveMinutes: number; // Max 540 (9h) or 600 (10h)
  remainingDailyMinutes: number;
  extendedDriveCountThisWeek: number; // Max 2 allowed (10h days)
  currentDutyMode: 'DRIVING' | 'REST_BREAK' | 'OTHER_WORK' | 'PERIOD_OF_AVAILABILITY';
  status: 'COMPLIANT' | 'BREAK_DUE_SOON' | 'CRITICAL_REST_REQUIRED' | 'INFRINGED';
  infringementRiskReason?: string;
  recommendedAction: string;
}

export interface RestStopMatch {
  siteId: string;
  name: string;
  motorway: string;
  distanceMiles: number;
  driveTimeMinutes: number;
  isReachableBeforeTachoExpiry: boolean;
  occupancyStatus: 'SPACES_AVAILABLE' | 'BUSY_FILLING_FAST' | 'FULL_NO_SPACES';
  availableBays: number;
  snapAccepted: boolean;
  overallRating: number;
}

export function evaluateTachoStatus(continuousMinutes: number, dailyMinutes: number): TachoRuleState {
  const maxContinuous = 270; // 4.5h
  const maxDaily = 540; // 9h

  const remainingContinuous = Math.max(0, maxContinuous - continuousMinutes);
  const remainingDaily = Math.max(0, maxDaily - dailyMinutes);

  let status: 'COMPLIANT' | 'BREAK_DUE_SOON' | 'CRITICAL_REST_REQUIRED' | 'INFRINGED' = 'COMPLIANT';
  let riskReason: string | undefined = undefined;
  let recommendedAction = 'Drive time compliant. Normal operations.';

  if (continuousMinutes > maxContinuous) {
    status = 'INFRINGED';
    riskReason = `Continuous drive time exceeded by ${continuousMinutes - maxContinuous} minutes (EU 561/2006 Art 7). DVSA Roadside Fixed Penalty £300 + 3 Penalty Points.`;
    recommendedAction = 'PARK AT NEAREST IMMEDIATE SAFE HAVEN. Issue statutory written statement on back of analogue chart or printout citing road safety grounds (Art 12).';
  } else if (remainingContinuous <= 15) {
    status = 'CRITICAL_REST_REQUIRED';
    riskReason = `Only ${remainingContinuous} minutes of legal driving remaining before 4.5h threshold.`;
    recommendedAction = 'Pull into the next service area immediately. Do not attempt further mileage.';
  } else if (remainingContinuous <= 45) {
    status = 'BREAK_DUE_SOON';
    riskReason = `4.5h continuous limit approaching in ${remainingContinuous} minutes.`;
    recommendedAction = 'Locate suitable parking with verified space within 30 miles.';
  }

  return {
    continuousDriveMinutes: continuousMinutes,
    remainingContinuousMinutes: remainingContinuous,
    splitBreak1Completed: false,
    splitBreak2Completed: false,
    dailyDriveMinutes: dailyMinutes,
    remainingDailyMinutes: remainingDaily,
    extendedDriveCountThisWeek: 1,
    currentDutyMode: 'DRIVING',
    status,
    infringementRiskReason: riskReason,
    recommendedAction
  };
}

export const SAMPLE_UPCOMING_SERVICES: RestStopMatch[] = [
  {
    siteId: 'msa-003',
    name: 'Rugby Services',
    motorway: 'M6 J1',
    distanceMiles: 14.2,
    driveTimeMinutes: 18,
    isReachableBeforeTachoExpiry: true,
    occupancyStatus: 'SPACES_AVAILABLE',
    availableBays: 24,
    snapAccepted: true,
    overallRating: 4.7
  },
  {
    siteId: 'msa-002',
    name: 'Watford Gap Services',
    motorway: 'M1 J16/17',
    distanceMiles: 26.5,
    driveTimeMinutes: 32,
    isReachableBeforeTachoExpiry: true,
    occupancyStatus: 'BUSY_FILLING_FAST',
    availableBays: 8,
    snapAccepted: true,
    overallRating: 3.8
  },
  {
    siteId: 'msa-005',
    name: 'Rothwell Truckstop',
    motorway: 'A14 J13',
    distanceMiles: 38.0,
    driveTimeMinutes: 46,
    isReachableBeforeTachoExpiry: false,
    occupancyStatus: 'FULL_NO_SPACES',
    availableBays: 0,
    snapAccepted: true,
    overallRating: 4.5
  },
  {
    siteId: 'msa-001',
    name: 'Tebay Services',
    motorway: 'M6 J38',
    distanceMiles: 142.0,
    driveTimeMinutes: 165,
    isReachableBeforeTachoExpiry: false,
    occupancyStatus: 'SPACES_AVAILABLE',
    availableBays: 32,
    snapAccepted: true,
    overallRating: 4.9
  }
];
