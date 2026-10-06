import {
  WalkaroundCheckRecord,
  TrailerDropSwapMemory,
  TrailerAssetRecord,
  TractorUnitAssetRecord,
  CombinationVehicleEnvelope
} from '../types/vehicleCheckTypes';

export const SAMPLE_TRAILER_MEMORIES: Record<string, TrailerDropSwapMemory> = {
  'TR-8842': {
    trailerId: 'TR-8842',
    trailerType: 'Schmitz Cargobull EN 12642 XL Curtainsider',
    lastDroppedAt: '2026-09-28 04:15 UTC',
    lastDroppedLocation: 'DIRFT Daventry Logistics Hub (Bay 14)',
    lastDriverName: 'Marcus Vance (C+E)',
    activeAdvisories: [
      'Minor 2cm surface scuff on nearside curtain near upright #3 (Non-structural)',
      'Nearside landing leg winding handle clip stiff — lubricated on 24/09'
    ],
    kingpinSize: '2.0 inch (SAF Holland)',
    tyreSpec: '385/65 R22.5 Tri-Axle'
  },
  'TR-9104': {
    trailerId: 'TR-9104',
    trailerType: 'Gray & Adams Multi-Temp Refrigerated Box',
    lastDroppedAt: '2026-09-27 18:30 UTC',
    lastDroppedLocation: 'Magna Park Lutterworth Depot 3',
    lastDriverName: 'Alexander James (C+E)',
    activeAdvisories: [
      'Fridge motor Thermo King SLXi 400 service due in 140 engine hours',
      'Rear roller shutter lock cable replaced clean'
    ],
    kingpinSize: '2.0 inch (Jost JSK 37C)',
    tyreSpec: '385/55 R22.5 Low-Deck'
  }
};

export const SAMPLE_WALKAROUND_RECORDS: WalkaroundCheckRecord[] = [
  {
    id: 'chk-2026-09-28-01',
    dateKey: '2026-09-28',
    displayDate: 'Monday, 28 Sep 2026',
    timestamp: '2026-09-28T05:45:00Z',
    driverName: 'Alexander James Kite',
    driverLicenceNumber: 'KITEA805219AJ99G',
    driverTachoCard: 'UK / DB250290781795 0 0',
    vehicleReg: 'DG21 EDP',
    trailerId: 'TR-8842',
    trailerType: 'CURTAINSIDER',
    haulierName: 'Drive Logistics UK Ltd',
    oLicenceNumber: 'OD2019482',
    ocrsStatus: 'GREEN',
    odometerKm: 709932,
    durationMinutes: 14,
    tachoStatusReconciled: true,
    tachoShiftState: 'OTHER_WORK',
    overallResult: 'PASS_CLEAN',
    vaultSha256: 'sha256-dvsa-chk-8842-20260928-passed-clean',
    digitalSignature: 'Alexander J. Kite (C+E Verified)',
    pmiDueDays: 16,
    tyreTreadMinMm: 7.8,
    wheelNutsTorqued: true,
    couplingDogClipLocked: true,
    airPressureBar: 8.8,
    notes: 'Autonomous AI Walkaround completed. All 5 DVSA roadworthiness zones verified clean.',
    zones: [
      {
        zoneId: 'IN_CAB',
        name: 'In-Cab Controls & Visibility (DVSA 01–10)',
        subtitle: 'Glass, wipers, ABS/EBS MIL, steering, horn, brakes, height marker & tacho',
        status: 'PASS',
        aiConfidence: 0.996,
        itemsChecked: [
          '[DVSA-01] Front view, mirrors & DVS CMS camera visibility (Zone A clear)',
          '[DVSA-02] Windscreen wipers & washer spray jets clearing screen cleanly',
          '[DVSA-03] Warning lamps: ABS/EBS extinguish after self-test, air gauges >8.5 bar',
          '[DVSA-04] Steering wheel free play <15mm, column lift & power assistance normal',
          '[DVSA-05] Audible horn operating clearly from driving position',
          '[DVSA-06] Service & parking brake controls, anti-slip pedal pad intact',
          '[DVSA-07] In-cab travel height indicator set to 14ft 6in (Bridge strike prevention)',
          '[DVSA-08] Seatbelts & buckle latching mechanism undamaged with clean retract',
          '[DVSA-09] Cab tilt lock engaged, doors latch securely, steps clean & safe',
          '[DVSA-10] Digital tachograph accepted card, UTC clock synced (⚒️ Other Work)'
        ]
      },
      {
        zoneId: 'STEER_AXLE',
        name: 'Tractor Powertrain, Tyres & Wheels (DVSA 11–20)',
        subtitle: 'Lamps, fluid leaks, battery, AdBlue, emissions, tyres, nuts & sideguards',
        status: 'PASS',
        aiConfidence: 0.994,
        itemsChecked: [
          '[DVSA-11] Front headlights (dipped/main beam), sidelights & indicators flashing',
          '[DVSA-12] Fuel cap sealed tight, engine/gearbox 0 fluid leaks or weeping',
          '[DVSA-13] Battery securely clamped, protective lid & terminal covers intact',
          '[DVSA-14] Diesel exhaust fluid (AdBlue) tank level & dosing lines sealed',
          '[DVSA-15] Exhaust silencer, DPF/SCR & engine emissions smoke clean',
          '[DVSA-16] High-voltage emergency cut-off / alternative fuel isolation switch checked',
          '[DVSA-17] Steer & drive tyres: 8.2mm tread, sidewalls sound, twin tyre gap clean',
          '[DVSA-18] 10/10 wheel nuts torqued, yellow Checkpoint pointers aligned nose-to-nose',
          '[DVSA-19] Tractor mudguards & spray suppression flaps intact',
          '[DVSA-20] Lateral cyclist sideguards & chassis longitudinals structurally sound'
        ]
      },
      {
        zoneId: 'COUPLING_CATWALK',
        name: '5th Wheel Coupling & Catwalk Interface (DVSA 21–25)',
        subtitle: 'Kingpin lock, dog-clip, rub-plate gap, Suzie airlines, EBS & landing legs',
        status: 'PASS',
        aiConfidence: 0.998,
        acousticAirLeakDetected: false,
        itemsChecked: [
          '[DVSA-21] 5th wheel jaw locked around kingpin throat & safety dog-clip pinned',
          '[DVSA-22] Zero gap verified between trailer rub-plate and 5th wheel turntable',
          '[DVSA-23] Red Emergency & Yellow Service Suzie air hoses clean, 0 acoustic leaks',
          '[DVSA-24] ISO 7638 7-pin EBS & 24V lighting electrical cables securely latched',
          '[DVSA-25] Catwalk non-slip decking clean, rear grab handles solid',
          '[DVSA-26] Trailer landing legs fully raised, winding handle pinned in cradle'
        ]
      },
      {
        zoneId: 'TRAILER_RUNNING_GEAR',
        name: 'Trailer Running Gear & Axles (DVSA 26–29)',
        subtitle: 'Tri-axle tyres, wheel fixings, hub sight glasses, air bags & mudwings',
        status: 'PASS',
        aiConfidence: 0.991,
        itemsChecked: [
          '[DVSA-27] Trailer tri-axle tyres: minimum 7.8mm tread across central 3/4 breadth',
          '[DVSA-28] Trailer wheel nuts tight with yellow Checkpoint torque indicators',
          '[DVSA-29] Clear plastic hub grease/oil sight glasses intact without leaks',
          '[DVSA-30] Trailer air suspension bellows inflated evenly & park brake released',
          '[DVSA-31] Trailer mudwings & anti-spray textured flaps fitted'
        ]
      },
      {
        zoneId: 'REAR_LIGHTING',
        name: 'Trailer Body, Load, Doors & Rear Lighting (DVSA 30–32)',
        subtitle: 'EN 12642 XL curtains, load straps, barn doors, TIR seal & LED clusters',
        status: 'PASS',
        aiConfidence: 0.995,
        itemsChecked: [
          '[DVSA-32] Load security: EN 12642 XL curtains tensioned & internal straps applied',
          '[DVSA-33] Rear barn doors double locking bars engaged, TIR security tilt cord intact',
          '[DVSA-34] Rear LED light clusters: stop, tail, indicator, fog & reverse lamps',
          '[DVSA-35] Rear number plate matching tractor combination, clean & illuminated',
          '[DVSA-36] ECE 70 chevron marker boards, side conspicuity tape & tail-lift locked'
        ]
      }
    ],
    defects: []
  },
  {
    id: 'chk-2026-09-27-02',
    dateKey: '2026-09-27',
    displayDate: 'Sunday, 27 Sep 2026',
    timestamp: '2026-09-27T06:10:00Z',
    driverName: 'Alexander James Kite',
    driverLicenceNumber: 'KITEA805219AJ99G',
    driverTachoCard: 'UK / DB250290781795 0 0',
    vehicleReg: 'DG21 EDP',
    trailerId: 'TR-8842',
    trailerType: 'CURTAINSIDER',
    haulierName: 'Drive Logistics UK Ltd',
    oLicenceNumber: 'OD2019482',
    ocrsStatus: 'GREEN',
    odometerKm: 709622,
    durationMinutes: 15,
    tachoStatusReconciled: true,
    tachoShiftState: 'OTHER_WORK',
    overallResult: 'ADVISORY_ISSUED',
    vaultSha256: 'sha256-dvsa-chk-8842-20260927-advisory-logged',
    digitalSignature: 'Alexander J. Kite (C+E Verified)',
    pmiDueDays: 17,
    tyreTreadMinMm: 7.9,
    wheelNutsTorqued: true,
    couplingDogClipLocked: true,
    airPressureBar: 8.7,
    notes: 'Advisory logged: Nearside rear spray suppression flap split at lower 5cm. Permitted for shift, scheduled for PMI replacement.',
    zones: [
      {
        zoneId: 'IN_CAB',
        name: 'In-Cab & Dashboard Diagnostics',
        subtitle: 'Air gauges, ABS/EBS lamps, mirror glass & height board',
        status: 'PASS',
        aiConfidence: 0.991,
        itemsChecked: [
          'Primary & Secondary Air Gauges at 8.7 bar',
          'ABS/EBS Warning Lamp Extinguished',
          'Windscreen Clean & Free of Obstructions'
        ]
      },
      {
        zoneId: 'STEER_AXLE',
        name: 'Front Steer Axles & Wheel Security',
        subtitle: 'Wheel nut indicators, rust trails, tread depth & sidewalls',
        status: 'PASS',
        aiConfidence: 0.993,
        itemsChecked: [
          'Wheel Nut Checkpoints Aligned',
          '0 Rust Streaks',
          'Steer Tyre Tread: 8.4mm'
        ]
      },
      {
        zoneId: 'COUPLING_CATWALK',
        name: '5th Wheel Coupling & Catwalk Deck',
        subtitle: 'Kingpin lock, safety dog-clip, Susie airlines & acoustic audio',
        status: 'PASS',
        aiConfidence: 0.994,
        acousticAirLeakDetected: false,
        itemsChecked: [
          'Kingpin Jaw Fully Locked',
          'Safety Dog-Clip Pinned',
          'Airlines & Cables Suspended Correctly'
        ]
      },
      {
        zoneId: 'TRAILER_RUNNING_GEAR',
        name: 'Trailer Chassis, Curtains & Tri-Axle',
        subtitle: 'EN 12642 XL straps, landing legs, twin tyre clearance',
        status: 'ADVISORY',
        aiConfidence: 0.975,
        itemsChecked: [
          'Landing Legs Secured',
          'Curtains & Buckles Sound',
          'Spray Suppression Flap: 5cm split on nearside rear flap'
        ]
      },
      {
        zoneId: 'REAR_LIGHTING',
        name: 'Rear Lighting, Markers & Number Plate',
        subtitle: 'LED clusters, hazard flashers, brake lights & marker boards',
        status: 'PASS',
        aiConfidence: 0.992,
        itemsChecked: [
          'All Lighting Clusters Fully Functional',
          'Number Plate Illuminated'
        ]
      }
    ],
    defects: [
      {
        id: 'def-20260927-01',
        zoneId: 'TRAILER_RUNNING_GEAR',
        component: 'Nearside Rear Spray Suppression Mudflap',
        severity: 'ADVISORY',
        dvsaReference: 'DVSA Categorisation of Defects Part 2 Sec 10 (Spray Suppression)',
        description: 'Lower 5cm vertical split in anti-spray filament flap. Does not foul wheel or running gear.',
        actionRequired: 'Replace spray suppression flap at scheduled 6-week PMI inspection.',
        estimatedRepairHours: 0.5,
        partRequired: 'Schmitz Cargobull Anti-Spray Flap 650x200mm',
        workshopJobCardCreated: true
      }
    ]
  }
];

export const WALKAROUND_AI_TIPS = [
  {
    id: 'tip-nuts',
    step: 1,
    title: 'Wheel Nut Checkpoints & Rust Run Detection',
    subtitle: 'Point camera at wheel hubs to verify torque indicators and detect stud movement',
    image: '/walkaround_tips/walkaround_tip1_wheel_nuts.jpg',
    badge: '🔩 WHEEL NUT GEOMETRY',
    badgeColor: 'text-amber-400 bg-amber-500/20 border-amber-500/40',
    description: 'The AI vision engine maps every fluorescent Checkpoint pointer, confirming nose-to-nose alignment. It also scans for microscopic vertical rust trails which indicate stud fretting or elongation.',
    actionTip: 'Hold phone 50cm from wheel face so all 10 nut indicators are in frame.'
  },
  {
    id: 'tip-tread',
    step: 2,
    title: 'Optical Tyre Tread Depth & Sidewall Integrity',
    subtitle: 'Autonomous optical parallax checks statutory 1.0mm continuous band',
    image: '/walkaround_tips/walkaround_tip2_tyre_tread.jpg',
    badge: '🛡️ TREAD DEPTH GAUGE',
    badgeColor: 'text-emerald-400 bg-emerald-500/20 border-emerald-500/40',
    description: 'DVSA requires at least 1.0mm tread across 3/4 breadth of tyres. Our AI calculates groove depth in millimeters, flagging an advisory at 2.0mm and alerting you if cords or cuts are exposed.',
    actionTip: 'Also check clearance between rear twin tyres for trapped rocks or bricks.'
  },
  {
    id: 'tip-coupling',
    step: 3,
    title: 'Fifth-Wheel Kingpin & Safety Dog-Clip Latching',
    subtitle: 'Verify kingpin throat lock and secondary carabiner pin before moving',
    image: '/walkaround_tips/walkaround_tip3_coupling_jaw.jpg',
    badge: '🔒 5TH WHEEL COUPLING',
    badgeColor: 'text-cyan-400 bg-cyan-500/20 border-cyan-500/40',
    description: 'Never drive off without confirming the fifth-wheel jaw has fully enclosed the trailer kingpin and the secondary safety dog-clip / handle pin is engaged. Flash illuminates dark catwalk areas.',
    actionTip: 'Toggle Flash ON under the trailer to eliminate catwalk and chassis shadows.'
  },
  {
    id: 'tip-acoustic',
    step: 4,
    title: 'Acoustic Compressed Air Leak Frequency Analysis',
    subtitle: 'Smartphone microphone detects 12–22 kHz ultrasonic pneumatic hisses',
    image: '/walkaround_tips/walkaround_tip4_susie_airlines.jpg',
    badge: '🎧 ACOUSTIC AIR LEAK AI',
    badgeColor: 'text-purple-400 bg-purple-500/20 border-purple-500/40',
    description: 'Commercial air brake lines run at 8.5 to 10.0 bar. A specialized audio classifier filters diesel engine rumble to pinpoint high-frequency air hisses at Susie palm seals before pressure drops on motorways.',
    actionTip: 'Hold phone microphone near Red & Yellow Susie palm couplings for 2 seconds.'
  }
];

// Unified Fleet Asset Database with 4-Tier Privacy Governance
export const SAMPLE_TRAILER_DATABASE: Record<string, TrailerAssetRecord> = {
  'TR-8842': {
    trailerId: 'TR-8842',
    plateNumber: 'C481928',
    trailerType: 'CURTAINSIDER',
    fleetOwnerName: 'Maritime Transport Ltd',
    oLicenceNumber: 'OF1084201',
    heightMeters: 4.45, // 14' 7"
    widthMeters: 2.55,
    lengthMeters: 13.60,
    unladenWeightTonnes: 7.2,
    maxGrossWeightTonnes: 38.0,
    currentPayloadTonnes: 26.5,
    axlesCount: 3,
    kingpinOffsetMeters: 1.20,
    adrHazardClass: 'NONE',
    tunnelRestrictionCode: 'E',
    lastPmiDate: '2026-09-12',
    nextPmiDueDate: '2026-10-24',
    motExpiryDate: '2027-03-31',
    lastKnownLocation: 'DIRFT Daventry Hub Bay 14',
    roadworthinessStatus: 'ROADWORTHY_PASS',
    activeAdvisories: [
      'Minor 2cm surface scuff on nearside curtain near upright #3 (Non-structural)',
      'Nearside landing leg winding handle clip stiff — lubricated on 24/09'
    ],
    privacyAudit: {
      publicDimensionsAllowed: true, // Navigation apps can read height/width/length/weight
      operationalSafetyAllowed: true, // Roadside DVSA QR & driver can verify defects
      commercialCargoMasked: true,   // Customer freight rate & cargo manifest protected
      driverPiiRedacted: true,       // Driver names pseudonymized across hauliers
      ownerFleetTenantId: 'TENANT_MARITIME_01',
      activeHaulierTenantId: 'TENANT_DRIVE_PARTNERS_UK',
      isCrossHaulierPool: true
    }
  },
  'TR-9104': {
    trailerId: 'TR-9104',
    plateNumber: 'C512093',
    trailerType: 'REFRIGERATED_REEFER',
    fleetOwnerName: 'Stobart Logistics UK',
    oLicenceNumber: 'OE2901411',
    heightMeters: 4.10, // 13' 5"
    widthMeters: 2.60, // Insulated refrigerated body is 2.60m wide
    lengthMeters: 13.60,
    unladenWeightTonnes: 8.6,
    maxGrossWeightTonnes: 38.0,
    currentPayloadTonnes: 24.2,
    axlesCount: 3,
    kingpinOffsetMeters: 1.20,
    adrHazardClass: 'NONE',
    tunnelRestrictionCode: 'E',
    lastPmiDate: '2026-09-08',
    nextPmiDueDate: '2026-10-20',
    motExpiryDate: '2027-05-15',
    lastKnownLocation: 'Magna Park Lutterworth Depot 3',
    roadworthinessStatus: 'ADVISORY_MONITOR',
    activeAdvisories: [
      'Thermo King SLXi fridge motor service due in 140 engine hours',
      'Rear roller shutter lock cable replaced clean'
    ],
    privacyAudit: {
      publicDimensionsAllowed: true,
      operationalSafetyAllowed: true,
      commercialCargoMasked: true,
      driverPiiRedacted: true,
      ownerFleetTenantId: 'TENANT_STOBART_99',
      activeHaulierTenantId: 'TENANT_DRIVE_PARTNERS_UK',
      isCrossHaulierPool: true
    }
  },
  'TR-4421': {
    trailerId: 'TR-4421',
    plateNumber: 'C773819',
    trailerType: 'BOX_VAN',
    fleetOwnerName: 'Tesco Primary Logistics',
    oLicenceNumber: 'OC3910842',
    heightMeters: 4.88, // 16' 0" Extra-High High-Cube Mega Box
    widthMeters: 2.55,
    lengthMeters: 13.60,
    unladenWeightTonnes: 7.8,
    maxGrossWeightTonnes: 38.0,
    currentPayloadTonnes: 22.0,
    axlesCount: 3,
    kingpinOffsetMeters: 1.25,
    adrHazardClass: 'NONE',
    tunnelRestrictionCode: 'E',
    lastPmiDate: '2026-09-18',
    nextPmiDueDate: '2026-10-30',
    motExpiryDate: '2027-08-31',
    lastKnownLocation: 'Crick National Distribution Centre Bay 8',
    roadworthinessStatus: 'ROADWORTHY_PASS',
    activeAdvisories: ['HIGH-CUBE ALERT: Total height is 16ft 0in (4.88m). Avoid rail bridges under 16ft 3in!'],
    privacyAudit: {
      publicDimensionsAllowed: true,
      operationalSafetyAllowed: true,
      commercialCargoMasked: true,
      driverPiiRedacted: true,
      ownerFleetTenantId: 'TENANT_TESCO_04',
      activeHaulierTenantId: 'TENANT_DRIVE_PARTNERS_UK',
      isCrossHaulierPool: true
    }
  },
  'TR-7002': {
    trailerId: 'TR-7002',
    plateNumber: 'C992104',
    trailerType: 'SKELETAL_CONTAINER',
    fleetOwnerName: 'Freightliner Road Services',
    oLicenceNumber: 'OF9921840',
    heightMeters: 4.25, // 13' 11" with 9ft 6in High Cube ISO Box mounted
    widthMeters: 2.50,
    lengthMeters: 12.20,
    unladenWeightTonnes: 4.2,
    maxGrossWeightTonnes: 36.0,
    currentPayloadTonnes: 28.5,
    axlesCount: 3,
    kingpinOffsetMeters: 1.10,
    adrHazardClass: 'CLASS_3_FLAMMABLE',
    tunnelRestrictionCode: 'D',
    lastPmiDate: '2026-09-22',
    nextPmiDueDate: '2026-11-03',
    motExpiryDate: '2027-01-31',
    lastKnownLocation: 'Port of Felixstowe Trinity Terminal Berth 8',
    roadworthinessStatus: 'ROADWORTHY_PASS',
    activeAdvisories: ['ADR Class 3 Placards mounted on all 4 faces. Fire extinguisher certified until Dec 2026.'],
    privacyAudit: {
      publicDimensionsAllowed: true,
      operationalSafetyAllowed: true,
      commercialCargoMasked: true,
      driverPiiRedacted: true,
      ownerFleetTenantId: 'TENANT_FREIGHTLINER_08',
      activeHaulierTenantId: 'TENANT_DRIVE_PARTNERS_UK',
      isCrossHaulierPool: true
    }
  }
};

export const SAMPLE_TRACTOR_DATABASE: Record<string, TractorUnitAssetRecord> = {
  'DG21 EDP': {
    vehicleReg: 'DG21 EDP',
    fleetNumber: 'FL-104',
    makeModel: 'Scania 450S 6x2 Twin-Steer Highline',
    haulierOwner: 'Drive Logistics UK Ltd',
    cabHeightMeters: 3.85,
    widthMeters: 2.55,
    lengthMeters: 6.20,
    unladenWeightTonnes: 8.4,
    maxTrainWeightTonnes: 44.0,
    fifthWheelOffsetMeters: 0.85,
    axleConfig: '6x2',
    euroStandard: 'EURO_6',
    dvsStarRating: 3,
    cazStatus: 'EXEMPT'
  },
  'KX72 WYZ': {
    vehicleReg: 'KX72 WYZ',
    fleetNumber: 'FL-208',
    makeModel: 'Volvo FH540 6x2 Globetrotter XL',
    haulierOwner: 'Drive Logistics UK Ltd',
    cabHeightMeters: 3.95,
    widthMeters: 2.55,
    lengthMeters: 6.25,
    unladenWeightTonnes: 8.6,
    maxTrainWeightTonnes: 44.0,
    fifthWheelOffsetMeters: 0.85,
    axleConfig: '6x2',
    euroStandard: 'EURO_6',
    dvsStarRating: 4,
    cazStatus: 'EXEMPT'
  }
};

// Helper: Convert meters to feet & inches string (e.g. 4.45m -> 14' 7")
export function metersToFeetInches(meters: number): string {
  const totalInches = meters * 39.3701;
  const feet = Math.floor(totalInches / 12);
  const inches = Math.round(totalInches % 12);
  return `${feet}' ${inches}"`;
}

// Math Engine: Combines Tractor Unit + Trailer ID into the unified Combination Vehicle Envelope
export function calculateCombinationEnvelope(
  tractorReg: string,
  trailerId: string,
  payloadOverrideTonnes?: number
): CombinationVehicleEnvelope {
  const tractor = SAMPLE_TRACTOR_DATABASE[tractorReg] || SAMPLE_TRACTOR_DATABASE['DG21 EDP'];
  const trailer = SAMPLE_TRAILER_DATABASE[trailerId] || SAMPLE_TRAILER_DATABASE['TR-8842'];

  const combinedHeightMeters = Math.max(tractor.cabHeightMeters, trailer.heightMeters);
  const combinedWidthMeters = Math.max(tractor.widthMeters, trailer.widthMeters);
  
  // Standard artic: tractor front overhang (1.4m) + wheelbase (3.9m) + trailer (13.6m) - coupling overlap (2.4m) = ~16.5m
  const combinedLengthMeters = Number(Math.min(16.50, tractor.lengthMeters + trailer.lengthMeters - 3.30).toFixed(2));
  
  const payload = payloadOverrideTonnes ?? trailer.currentPayloadTonnes;
  const grossCombinationWeightTonnes = Number(
    Math.min(44.0, tractor.unladenWeightTonnes + trailer.unladenWeightTonnes + payload).toFixed(1)
  );

  const totalAxles = (tractor.axleConfig === '6x2' || tractor.axleConfig === '6x4' ? 3 : 2) + trailer.axlesCount;
  const isHighCube = combinedHeightMeters >= 4.20;
  const lowBridgeClearanceMarginMeters = 0.15; // 6-inch statutory clearance
  const bridgeAlertThresholdMeters = Number((combinedHeightMeters + lowBridgeClearanceMarginMeters).toFixed(2));

  return {
    combinedHeightMeters,
    combinedHeightFeetInches: metersToFeetInches(combinedHeightMeters),
    combinedWidthMeters,
    combinedLengthMeters,
    grossCombinationWeightTonnes,
    totalAxles,
    maxAxleWeightTonnes: 11.5,
    isHighCube,
    lowBridgeClearanceMarginMeters,
    bridgeAlertThresholdMeters,
    emissionStandard: `${tractor.euroStandard} • Clean Air Zone Exempt`,
    dvsRating: tractor.dvsStarRating,
    adrCategory: trailer.adrHazardClass && trailer.adrHazardClass !== 'NONE' ? trailer.adrHazardClass : 'GENERAL_FREIGHT',
    lastSyncedAt: new Date().toISOString(),
    tomtomPayload: {
      vehicleHeight: combinedHeightMeters,
      vehicleWidth: combinedWidthMeters,
      vehicleLength: combinedLengthMeters,
      vehicleWeight: Math.round(grossCombinationWeightTonnes * 1000), // kg
      vehicleAxleWeight: 11500, // kg
      vehicleCommercial: true,
      vehicleLoadType: trailer.adrHazardClass && trailer.adrHazardClass !== 'NONE' ? 'USR_HAZARDOUS' : 'GENERAL_FREIGHT'
    }
  };
}
