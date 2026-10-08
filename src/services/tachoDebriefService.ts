import { TachographDayRecord, Article12Record } from '../components/tacho/TachoScanApp';

export interface SmartDebriefCoachingPoint {
  title: string;
  description: string;
  actionableTip: string;
  regulation: string;
  severity: 'GOOD' | 'INFO' | 'ADVISORY' | 'CRITICAL';
}

export interface CircadianFatigueAnalysis {
  score: number; // 0 to 100
  level: 'LOW' | 'MODERATE' | 'ELEVATED' | 'HIGH';
  dangerWindow: string;
  circadianNadir: string;
  recommendedAction: string;
  sleepDebtHours: number;
}

export interface SmartDebriefReport {
  driverName: string;
  totalDaysAnalyzed: number;
  overallStatus: 'ALL_CLEAR' | 'ADVISORY_PENDING' | 'ACTION_REQUIRED';
  headline: string;
  voiceScript: string;
  coachingPoints: SmartDebriefCoachingPoint[];
  fatigueAnalysis: CircadianFatigueAnalysis;
  tomorrowActionPlan: string[];
  totalMilesDriven: number;
  totalDriveHours: number;
  totalRestHours: number;
}

export const PRESET_ARTICLE_12_TEMPLATES = [
  {
    id: 'M6_J18_CLOSURE',
    label: 'Motorway / Highway Unforeseen Closure',
    category: 'ROAD_CLOSURE' as const,
    location: 'M6 Northbound J18 (Holmes Chapel) to J19 (Knutsford)',
    defaultMinutesOver: 24,
    narrative:
      'Carriageway fully blocked following an overturned HGV at M6 J18 (National Highways Incident Log). Trapped in live queuing traffic with no emergency egress. In order to reach a suitable safe stopping place without compromising road safety or load security, driving was extended 24 minutes to safely park at Lymm Truckstop under Regulation (EC) No 561/2006 Article 12.'
  },
  {
    id: 'SEVERE_BLIZZARD',
    label: 'Sudden Severe Weather / Flash Flooding',
    category: 'EXTREME_WEATHER' as const,
    location: 'A66 Stainmore Summit (Brough to Bowes)',
    defaultMinutesOver: 35,
    narrative:
      'Sudden blizzard and black ice at Stainmore summit reduced safe transit speed to under 18 mph. Stopping on unlit exposed hard shoulder was deemed an unacceptable danger to road safety. Extended driving 35 minutes to reach designated lighted truck stop at Brough under Regulation (EC) No 561/2006 Article 12.'
  },
  {
    id: 'SERVICES_FULL',
    label: 'Designated Truck Layby / Services Fully Occupied',
    category: 'SAFE_PARKING_UNAVAILABLE' as const,
    location: 'M1 Motorway - Newport Pagnell Services',
    defaultMinutesOver: 18,
    narrative:
      'Arrived at planned rest location (Newport Pagnell Services) at 4h 26m continuous drive. All HGV bays were at 100% capacity with vehicles queueing on access road. To prevent causing an obstruction on highway slipway, proceeded 18 minutes at cautious speed to Northampton Services under Regulation (EC) No 561/2006 Article 12.'
  },
  {
    id: 'EMERGENCY_DIVERSION',
    label: 'Police Roadblock / Emergency Diversion',
    category: 'ACCIDENT_CONGESTION' as const,
    location: 'M40 J10 to J11 (Cherwell Valley)',
    defaultMinutesOver: 22,
    narrative:
      'Police emergency rolling roadblock diverted all traffic onto single-carriageway rural relief roads unsuited for HGV stationary layover. Continued safely 22 minutes to reach safe industrial estate parking under Regulation (EC) No 561/2006 Article 12.'
  }
];

export function generateSmartDebrief(
  days: TachographDayRecord[],
  driverName: string = 'Alexander James'
): SmartDebriefReport {
  if (!days || days.length === 0) {
    return {
      driverName,
      totalDaysAnalyzed: 0,
      overallStatus: 'ALL_CLEAR',
      headline: `Welcome back, ${driverName}. Ready to analyze your shift.`,
      voiceScript: `Hello ${driverName}. No tachograph days are loaded yet. Please scan or upload a thermal roll to begin your personalized AI debrief.`,
      coachingPoints: [],
      fatigueAnalysis: {
        score: 12,
        level: 'LOW',
        dangerWindow: 'None detected',
        circadianNadir: '03:00 - 05:00',
        recommendedAction: 'Maintain regular sleep hygiene before tomorrow’s first duty.',
        sleepDebtHours: 0
      },
      tomorrowActionPlan: ['Complete statutory pre-use walkaround check', 'Verify driver card insertion into Slot 1'],
      totalMilesDriven: 0,
      totalDriveHours: 0,
      totalRestHours: 0
    };
  }

  const totalDriveMins = days.reduce((acc, d) => acc + d.result.dailyDriveMinutes, 0);
  const totalRestMins = days.reduce((acc, d) => acc + d.result.dailyRestMinutes, 0);
  const totalMiles = days.reduce((acc, d) => acc + d.distanceDrivenMiles, 0);

  const totalInfringements = days.reduce(
    (acc, d) => acc + (d.article12Exception ? 0 : d.result.infringements.length),
    0
  );

  const coachingPoints: SmartDebriefCoachingPoint[] = [];

  // Check split-breaks & 4.5h driving
  let hasSplitBreakQuestion = false;
  days.forEach((d) => {
    const drive = d.result.dailyDriveMinutes;
    if (drive > 270 && !d.result.splitBreakEligible) {
      hasSplitBreakQuestion = true;
    }
  });

  if (totalInfringements === 0) {
    coachingPoints.push({
      title: 'Flawless Driver Hours Compliance',
      description: `All ${days.length} shift logs satisfy Regulation (EC) 561/2006 and GB Working Time Directive rules.`,
      actionableTip: 'Keep up your current break rhythm. Your proactive stops are keeping your record 100% green.',
      regulation: 'EC 561/2006 Art. 6 & 7',
      severity: 'GOOD'
    });
  } else {
    coachingPoints.push({
      title: 'Continuous Driving Optimization',
      description: 'Remember that under EU rules, a 45-minute qualifying break resets your 4.5-hour driving clock.',
      actionableTip:
        'If splitting breaks, the first must be AT LEAST 15 minutes and the second AT LEAST 30 minutes in that exact order.',
      regulation: 'EC 561/2006 Art. 7',
      severity: 'ADVISORY'
    });
  }

  // Daily Rest analysis
  const hasReducedRest = days.some((d) => d.result.dailyRestMinutes < 660 && d.result.dailyRestMinutes >= 540);
  if (hasReducedRest) {
    coachingPoints.push({
      title: 'Reduced Daily Rest Management',
      description: 'You took a reduced daily rest (under 11 hours, but at least 9 hours).',
      actionableTip:
        'You can take a maximum of 3 reduced daily rests between any two weekly rest periods. Plan an 11h regular rest soon.',
      regulation: 'EC 561/2006 Art. 8(4)',
      severity: 'INFO'
    });
  }

  // Circadian Fatigue Analysis
  const latestDay = days[0];
  const isNightShift = latestDay && (latestDay.odometerStartKm % 2 === 0); // simulated shift variance
  const fatigueScore = Math.min(
    95,
    Math.max(
      15,
      Math.round(
        20 +
          (totalDriveMins > 540 ? 30 : 15) +
          (hasReducedRest ? 20 : 0) +
          (isNightShift ? 25 : 0)
      )
    )
  );

  let fatigueLevel: CircadianFatigueAnalysis['level'] = 'LOW';
  if (fatigueScore >= 75) fatigueLevel = 'HIGH';
  else if (fatigueScore >= 50) fatigueLevel = 'ELEVATED';
  else if (fatigueScore >= 30) fatigueLevel = 'MODERATE';

  const fatigueAnalysis: CircadianFatigueAnalysis = {
    score: fatigueScore,
    level: fatigueLevel,
    dangerWindow: isNightShift ? '04:15 - 06:30 (Circadian Low)' : '14:00 - 15:30 (Post-Prandial Dip)',
    circadianNadir: isNightShift ? '03:00 - 05:30' : '02:00 - 06:00',
    recommendedAction:
      fatigueScore > 50
        ? 'Schedule a 20-minute power nap at your next 45-minute statutory break. Hydrate with water rather than sugary energy drinks.'
        : 'Fatigue metrics look solid. Maintain a steady cab temperature (19-21°C) to stay sharp.',
    sleepDebtHours: hasReducedRest ? 2.0 : 0.5
  };

  const driveHrs = (totalDriveMins / 60).toFixed(1);
  const headline =
    totalInfringements === 0
      ? `Top-tier driving, ${driverName}! 100% compliant across ${days.length} ${days.length === 1 ? 'day' : 'days'}.`
      : `${driverName}, you have ${totalInfringements} item flagged for review with instant Article 12 defense options.`;

  const voiceScript =
    totalInfringements === 0
      ? `Great work today, ${driverName}. You have completed ${driveHrs} hours of driving covering ${totalMiles} miles with zero infringements. Your circadian fatigue index is currently at ${fatigueScore} percent, which is in the ${fatigueLevel.toLowerCase()} range. Tomorrow, plan your first 45-minute break around the three-and-a-half hour mark to stay comfortably inside legal limits.`
      : `Hello ${driverName}. Across your recent shifts, we identified ${totalInfringements} compliance notification. Under EU rules, remember that split breaks must always be 15 minutes followed by 30 minutes. If this overrun was caused by an emergency or highway closure, you can tap File Article 12 Defense right now to attach a certified statutory declaration.`;

  const tomorrowActionPlan = [
    'Take statutory 45m break (or 15m + 30m split) before reaching 4h 30m driving',
    fatigueScore > 45 ? 'Plan a 20-min power nap during your 45m break' : 'Ensure cab ventilation remains fresh',
    hasReducedRest ? 'Target a full 11-hour regular daily rest tonight' : 'Maintain minimum 9-hour reduced daily rest window'
  ];

  return {
    driverName,
    totalDaysAnalyzed: days.length,
    overallStatus: totalInfringements === 0 ? 'ALL_CLEAR' : 'ADVISORY_PENDING',
    headline,
    voiceScript,
    coachingPoints,
    fatigueAnalysis,
    tomorrowActionPlan,
    totalMilesDriven: totalMiles,
    totalDriveHours: Math.round(totalDriveMins / 60),
    totalRestHours: Math.round(totalRestMins / 60)
  };
}
