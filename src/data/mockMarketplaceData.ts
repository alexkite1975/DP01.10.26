import {
  MarketplaceShift,
  FleetVehicleVORRecord,
  WalkaroundCheckItem,
  SelfBillingInvoice
} from '../types';

export const initialMarketplaceShifts: MarketplaceShift[] = [
  {
    id: 'shift-dirft-001',
    shiftRef: 'SH-DIRFT-9041',
    title: 'Tesco Regional Distribution - Night Trunking',
    haulierName: 'Tesco Primary Distribution Ltd',
    haulierOlicence: 'OK1092834/SN',
    siteName: 'DIRFT Central Logistics Park (Tesco RDC)',
    location: {
      address: 'A5 Watling Street, DIRFT East',
      city: 'Crick, Northamptonshire',
      postcode: 'NN6 7GZ',
      lat: 52.368,
      lng: -1.161
    },
    vehicleClass: 'CAT_CE_CLASS_1',
    trailerType: 'REFRIGERATED_TEMP',
    startTime: '2026-09-22T19:00:00Z',
    endTime: '2026-09-23T05:00:00Z',
    durationHours: 10,
    baseHourlyRate: 24.5,
    overtimeHourlyRate: 31.0,
    nightOutAllowance: 35.0,
    agencyPlatformFeePercent: 10,
    ir35Status: 'INSIDE_IR35',
    ir35Reasoning: 'Statutory Section 44 ITEPA Safe-Harbour default applied: Relief driver under direction, supervision & control. Haulier protected from retrospective tax liability.',
    status: 'OPEN',
    distanceMilesFromDriver: 14.2,
    drivingTimeMinutesFromDriver: 22,
    specialRequirements: [
      'Valid UK Class 1 (C+E) Licence',
      'Valid Digital Tachograph Card',
      'Driver CPC Qualification Card',
      'Class 3 High-Visibility Jacket & Safety Boots',
      'Temperature-Controlled Log Book proficiency'
    ],
    goodsDescription: 'Chilled produce & dairy pallets',
    palletCount: 26
  },
  {
    id: 'shift-magna-002',
    shiftRef: 'SH-MAGNA-8812',
    title: 'DHL Supply Chain - Automotive Just-in-Time Trunk',
    haulierName: 'DHL Supply Chain UK & Ireland',
    haulierOlicence: 'MD8492019/SN',
    siteName: 'Magna Park Distribution Centre',
    location: {
      address: 'Hunter Boulevard, Magna Park',
      city: 'Lutterworth, Leicestershire',
      postcode: 'LE17 4XN',
      lat: 52.449,
      lng: -1.242
    },
    vehicleClass: 'CAT_CE_CLASS_1',
    trailerType: 'CURTAINSIDER',
    startTime: '2026-09-22T21:30:00Z',
    endTime: '2026-09-23T07:30:00Z',
    durationHours: 10,
    baseHourlyRate: 23.0,
    overtimeHourlyRate: 29.0,
    nightOutAllowance: 0,
    agencyPlatformFeePercent: 10,
    ir35Status: 'INSIDE_IR35',
    ir35Reasoning: 'Haulier risk-averse default. Umbrella payroll statutory deduction enabled via Section 44 ITEPA provisions.',
    status: 'OPEN',
    distanceMilesFromDriver: 21.8,
    drivingTimeMinutesFromDriver: 32,
    specialRequirements: [
      'Experience with double-deck curtainsiders',
      'Load restraint internal strap compliance',
      'Clean driving record (max 6 penalty points)'
    ],
    goodsDescription: 'Stamping press car body panels & wiring harnesses',
    palletCount: 30
  },
  {
    id: 'shift-trafford-003',
    shiftRef: 'SH-TRAFF-7603',
    title: 'BOC Industrial Gases - Cryogenic & Bulk Cylinder Transport',
    haulierName: 'BOC Linde UK Logistics Ltd',
    haulierOlicence: 'OB1298402/SN',
    siteName: 'Trafford Park Industrial Estate',
    location: {
      address: 'Westinghouse Road, Trafford Park',
      city: 'Manchester',
      postcode: 'M17 1DY',
      lat: 53.468,
      lng: -2.316
    },
    vehicleClass: 'ADR_HAZCHEM',
    trailerType: 'BOX_VAN',
    startTime: '2026-09-23T06:00:00Z',
    endTime: '2026-09-23T16:30:00Z',
    durationHours: 10.5,
    baseHourlyRate: 29.0,
    overtimeHourlyRate: 38.0,
    nightOutAllowance: 40.0,
    agencyPlatformFeePercent: 10,
    ir35Status: 'OUTSIDE_IR35_B2B',
    ir35Reasoning: 'Verified Operator Licence Holder (Schedule 1 B2B Sub-Contractor with sole vehicle provision & right of substitution).',
    status: 'OPEN',
    distanceMilesFromDriver: 28.5,
    drivingTimeMinutesFromDriver: 41,
    specialRequirements: [
      'ADR Vocational Certificate (Classes 2 & 3 Tanks/Packages)',
      'Hazchem Emergency Eyewash & Spill Response kit equipped',
      'Minimum 2 years verified cryogenic gas transport experience'
    ],
    goodsDescription: 'Medical oxygen cylinders & compressed argon canisters',
    palletCount: 22
  },
  {
    id: 'shift-hams-004',
    shiftRef: 'SH-HAMS-5521',
    title: 'Travis Perkins Building Materials - HIAB Crane Offload',
    haulierName: 'Travis Perkins Transport Fleet',
    haulierOlicence: 'WM9921045/SN',
    siteName: 'Hams Hall National Distribution Hub',
    location: {
      address: 'Canton Lane, Hams Hall',
      city: 'Coleshill, Birmingham',
      postcode: 'B46 1GA',
      lat: 52.523,
      lng: -1.705
    },
    vehicleClass: 'HIAB_LORRY_LOADER',
    trailerType: 'FLATBED',
    startTime: '2026-09-23T07:00:00Z',
    endTime: '2026-09-23T17:00:00Z',
    durationHours: 10,
    baseHourlyRate: 27.5,
    overtimeHourlyRate: 34.0,
    nightOutAllowance: 0,
    agencyPlatformFeePercent: 10,
    ir35Status: 'INSIDE_IR35',
    ir35Reasoning: 'Section 44 ITEPA protective shield. Site crane supervisor directs sling attachment.',
    status: 'OPEN',
    distanceMilesFromDriver: 8.6,
    drivingTimeMinutesFromDriver: 15,
    specialRequirements: [
      'ALLMI or CPCS Lorry Loader (HIAB) Operator Card',
      'Slinger/Signaller qualification',
      'Hard hat, safety glasses, high-vis and steel toe boots'
    ],
    goodsDescription: 'Concrete kerb stones, timber packs & structural steel beams',
    palletCount: 16
  },
  {
    id: 'shift-daventry-005',
    shiftRef: 'SH-DAV-4109',
    title: 'Sainsburys Supermarkets - Moffett Truck-Mounted Forklift Delivery',
    haulierName: 'Wincanton Retail Dedicated Fleet',
    haulierOlicence: 'EK4401923/SN',
    siteName: 'Daventry Rail Freight Terminal',
    location: {
      address: 'Gallows Hill, Daventry',
      city: 'Daventry, Northamptonshire',
      postcode: 'NN11 8PB',
      lat: 52.261,
      lng: -1.149
    },
    vehicleClass: 'MOFFETT_FORKLIFT',
    trailerType: 'CURTAINSIDER',
    startTime: '2026-09-23T05:30:00Z',
    endTime: '2026-09-23T15:30:00Z',
    durationHours: 10,
    baseHourlyRate: 26.0,
    overtimeHourlyRate: 32.5,
    nightOutAllowance: 0,
    agencyPlatformFeePercent: 10,
    ir35Status: 'INSIDE_IR35',
    ir35Reasoning: 'Inside IR35 deemed contract under HMRC CEST rules to shield client haulier from agency tax clawbacks.',
    status: 'OPEN',
    distanceMilesFromDriver: 18.0,
    drivingTimeMinutesFromDriver: 25,
    specialRequirements: [
      'RTITB or ITSSAR Moffett Certification (all terrain forklift)',
      'Tail-lift safety interlock certificate',
      'Urban store delivery night quiet-hours protocol compliance'
    ],
    goodsDescription: 'Supermarket ambient roll-cages & beverage dollies',
    palletCount: 24
  },
  {
    id: 'shift-rugby-006',
    shiftRef: 'SH-RUG-3011',
    title: 'Royal Mail Regional Hub - Rigid 18T Tail-Lift Trunk',
    haulierName: 'Royal Mail Logistics Operations',
    haulierOlicence: 'RM0019284/SN',
    siteName: 'Rugby Distribution Operations Centre',
    location: {
      address: 'Technology Drive, Valley Park',
      city: 'Rugby, Warwickshire',
      postcode: 'CV21 1BD',
      lat: 52.378,
      lng: -1.258
    },
    vehicleClass: 'CAT_C_CLASS_2',
    trailerType: 'RIGID_TAILLIFT',
    startTime: '2026-09-22T14:00:00Z',
    endTime: '2026-09-22T23:00:00Z',
    durationHours: 9,
    baseHourlyRate: 20.5,
    overtimeHourlyRate: 26.0,
    nightOutAllowance: 0,
    agencyPlatformFeePercent: 10,
    ir35Status: 'INSIDE_IR35',
    ir35Reasoning: 'Standard Inside IR35 Agency Worker Regulations (AWR) entitlement.',
    status: 'BOOKED',
    bookedDriverId: 'DRV-8492',
    bookedDriverName: 'Marcus Bell (HGV Class 2)',
    distanceMilesFromDriver: 6.4,
    drivingTimeMinutesFromDriver: 12,
    specialRequirements: [
      'Valid UK Class 2 (Cat C) Licence',
      'Security vetting level 1 (DBS basic)',
      'High-security seal logging protocol'
    ],
    goodsDescription: 'Parcel cages and trackable wheeled mail yorks',
    palletCount: 14
  }
];

export const standardDVSAChecklist: WalkaroundCheckItem[] = [
  {
    id: 'chk-tyres-01',
    category: 'TIRES_WHEELS',
    name: 'Tyre Tread Depth (≥1.0mm) & Sidewall Integrity',
    dvsaGuideReference: 'DVSA Roadworthiness Guide §2.1 (Tyres & Wheels)',
    status: 'PASS'
  },
  {
    id: 'chk-tyres-02',
    category: 'TIRES_WHEELS',
    name: 'Wheel Nut Torque Indicators & Retaining Rings Aligned',
    dvsaGuideReference: 'DVSA Roadworthiness Guide §2.1 (Wheel Nut Indicators)',
    status: 'PASS'
  },
  {
    id: 'chk-brakes-01',
    category: 'BRAKES_AIR_SYSTEM',
    name: 'Air System Pressure Build-up & Low Air Warning Buzzer',
    dvsaGuideReference: 'DVSA Roadworthiness Guide §2.2 (Air Pressure Warning)',
    status: 'PASS'
  },
  {
    id: 'chk-brakes-02',
    category: 'BRAKES_AIR_SYSTEM',
    name: 'ABS / EBS Electronic Braking Malfunction Warning Lamp',
    dvsaGuideReference: 'DVSA Roadworthiness Guide §2.2 (ABS/EBS Dashboard Tell-Tale)',
    status: 'PASS'
  },
  {
    id: 'chk-steer-01',
    category: 'STEERING_SUSPENSION',
    name: 'Steering Play & Air Suspension Ride-Height Leveling',
    dvsaGuideReference: 'DVSA Roadworthiness Guide §2.3 (Steering & Suspension)',
    status: 'PASS'
  },
  {
    id: 'chk-lights-01',
    category: 'LIGHTS_ELECTRICAL',
    name: 'Marker Lamps, Stop Lights, Side Indicators & Hazards',
    dvsaGuideReference: 'DVSA Roadworthiness Guide §2.4 (Lamps & Reflectors)',
    status: 'PASS'
  },
  {
    id: 'chk-coupling-01',
    category: 'CHASSIS_BULKHEAD',
    name: 'Fifth Wheel Coupling Lockjaw, Safety Pin & Suzie Hoses',
    dvsaGuideReference: 'DVSA Roadworthiness Guide §2.5 (Coupling Security)',
    status: 'PASS'
  },
  {
    id: 'chk-fluids-01',
    category: 'ADBLUE_FLUIDS',
    name: 'Engine Oil, Coolant & AdBlue Levels / No Visible Leaks',
    dvsaGuideReference: 'DVSA Roadworthiness Guide §2.6 (Fluids & Exhaust)',
    status: 'PASS'
  },
  {
    id: 'chk-safety-01',
    category: 'TACHOGRAPH_SAFETY',
    name: 'Digital Tachograph Seal, Horn, Mirrors & Windscreen View',
    dvsaGuideReference: 'DVSA Roadworthiness Guide §2.7 (In-Cab & Tachograph)',
    status: 'PASS'
  }
];

export const initialFleetVehicles: FleetVehicleVORRecord[] = [
  {
    id: 'veh-001',
    vehicleReg: 'KX21 FDX',
    makeModel: 'Scania R450 6x2 Mid-lift Tractor',
    fleetNumber: 'TR-104',
    vehicleType: 'CAT_CE_CLASS_1',
    trailerAssigned: 'TRL-042 (Schmitz Cargobull Reefer)',
    isGroundedVOR: true,
    vorTriggeredAt: '2026-09-21T18:45:00Z',
    vorReason: 'SAFETY-CRITICAL RED VOR: Nearside Steer Axle tyre tread measured at 0.8mm (Below legal 1.0mm DVSA limit) & audible hissing leak on brake chamber actuator.',
    reportedByDriverName: 'Dave Miller (Lic: MILLE840293D89)',
    reportedByDriverLicence: 'MILLE840293D89',
    mileageOdometer: 342180,
    defectsList: [
      {
        id: 'def-01',
        category: 'TIRES_WHEELS',
        name: 'Nearside Steer Tyre Tread Depth < 1.0mm',
        dvsaGuideReference: 'DVSA Roadworthiness Guide §2.1',
        status: 'DEFECT',
        severity: 'SAFETY_CRITICAL_RED_VOR',
        notes: 'Excessive shoulder wear on inner tread groove, depth gauge read 0.8mm.'
      },
      {
        id: 'def-02',
        category: 'BRAKES_AIR_SYSTEM',
        name: 'Brake Chamber Actuator Audible Pressure Leak',
        dvsaGuideReference: 'DVSA Roadworthiness Guide §2.2',
        status: 'DEFECT',
        severity: 'SAFETY_CRITICAL_RED_VOR',
        notes: 'Significant pressure drop on foot-brake application; air reservoir drops below 6.5 bar in under 45 seconds.'
      }
    ],
    auditTrail: [
      {
        timestamp: '2026-09-21T18:45:00Z',
        action: 'VEHICLE GROUNDED (RED VOR): Locked in TMS. Shift dispatch disabled.',
        user: 'Driver Dave Miller (Walkaround Audit)'
      },
      {
        timestamp: '2026-09-21T18:46:12Z',
        action: 'SMS & Push Notification dispatched to Fleet Workshop Supervisor.',
        user: 'System Automated Guard'
      }
    ]
  },
  {
    id: 'veh-002',
    vehicleReg: 'MX23 ZTR',
    makeModel: 'Volvo FH 500 Globetrotter XL',
    fleetNumber: 'TR-208',
    vehicleType: 'CAT_CE_CLASS_1',
    trailerAssigned: 'TRL-019 (Lawrence David Curtainsider)',
    isGroundedVOR: false,
    mileageOdometer: 148920,
    defectsList: standardDVSAChecklist.map(c => ({ ...c, status: 'PASS' })),
    technicianSignOff: {
      technicianId: 'TECH-771',
      technicianName: 'Graham Thorpe (IRTE Master Tech)',
      workshopFacility: 'Volvo Truck & Bus Centre East Midlands',
      torqueWrenchCalibrationId: 'TW-CAL-2026-081',
      torqueNmApplied: 600,
      replacementPartsSerials: ['WHL-NUT-SET-10', 'DRM-SEAL-889'],
      repairedAt: '2026-09-10T14:30:00Z',
      dvsaRoadworthyCertNumber: 'DVSA-RW-2026-99042'
    },
    auditTrail: [
      {
        timestamp: '2026-09-22T05:10:00Z',
        action: 'DAILY WALKAROUND PASS: Nil defects reported. Roadworthy status confirmed.',
        user: 'Driver Marcus Bell'
      }
    ]
  },
  {
    id: 'veh-003',
    vehicleReg: 'WX69 BKP',
    makeModel: 'DAF XF 480 Super Space Cab',
    fleetNumber: 'TR-089',
    vehicleType: 'CAT_CE_CLASS_1',
    trailerAssigned: 'TRL-088 (Don-Bur Teardrop)',
    isGroundedVOR: false,
    mileageOdometer: 482010,
    defectsList: [
      {
        id: 'def-minor-01',
        category: 'LIGHTS_ELECTRICAL',
        name: 'Offside Rear Perimeter Marker LED Dim',
        dvsaGuideReference: 'DVSA Roadworthiness Guide §2.4',
        status: 'DEFECT',
        severity: 'MINOR_MONITOR',
        notes: 'LED diode cluster dim, but primary tail and brake lights 100% operational. Flagged for weekend scheduled PMI.'
      }
    ],
    auditTrail: [
      {
        timestamp: '2026-09-21T07:20:00Z',
        action: 'MINOR DEFECT LOGGED: Vehicle remains roadworthy. Logged for workshop queue.',
        user: 'Driver Sam Green'
      }
    ]
  },
  {
    id: 'veh-004',
    vehicleReg: 'FN24 LKJ',
    makeModel: 'Mercedes-Benz Actros 2548 GigaSpace',
    fleetNumber: 'TR-312',
    vehicleType: 'CAT_CE_CLASS_1',
    trailerAssigned: 'TRL-115 (Gray & Adams ThermoKing)',
    isGroundedVOR: true,
    vorTriggeredAt: '2026-09-22T06:15:00Z',
    vorReason: 'SAFETY-CRITICAL RED VOR: Persistent ABS/EBS malfunction lamp illuminated on instrument cluster during static self-check.',
    reportedByDriverName: 'Colin Vance (Lic: VANCE394012C41)',
    reportedByDriverLicence: 'VANCE394012C41',
    mileageOdometer: 62400,
    defectsList: [
      {
        id: 'def-03',
        category: 'BRAKES_AIR_SYSTEM',
        name: 'ABS/EBS Trailer Sensor Signal Failure',
        dvsaGuideReference: 'DVSA Roadworthiness Guide §2.2',
        status: 'DEFECT',
        severity: 'SAFETY_CRITICAL_RED_VOR',
        notes: 'CAN-bus fault code EBS 042: Offside wheel speed sensor open circuit.'
      }
    ],
    auditTrail: [
      {
        timestamp: '2026-09-22T06:15:00Z',
        action: 'VEHICLE GROUNDED (RED VOR): Locked in TMS. Scheduled driver reassigned.',
        user: 'Driver Colin Vance (Walkaround Audit)'
      }
    ]
  }
];

export const initialPayrollInvoices: SelfBillingInvoice[] = [
  {
    invoiceNumber: 'SBI-2026-W38-0089',
    weekEnding: '2026-09-25',
    driverId: 'DRV-1002',
    driverName: 'Mark Stevens',
    driverNiNumber: 'JH •••• 42C',
    haulierName: 'Eddie Stobart Logistics Ltd',
    haulierVatNumber: 'GB 123 4567 89',
    ir35Status: 'INSIDE_IR35',
    taxDeductionPAYE: 168.0,
    nicEmployeeDeduction: 56.0,
    grossTotal: 1120.0,
    agencyPlatformFee: 112.0,
    factoringSurcharge: 0.0,
    vatAmount: 224.0,
    netPayable: 896.0,
    paymentMethod: 'AUTOMATED_DIRECT_DEBIT',
    payoutDueDate: '2026-09-25T11:00:00Z', // Friday payment
    tuesdayDisputeCutoffMet: true,
    status: 'APPROVED_FOR_PAYROLL',
    timesheets: [
      {
        shiftId: 'sh-ts-01',
        shiftRef: 'SH-DIRFT-9041',
        date: '2026-09-21',
        vehicleReg: 'MX23 ZTR',
        haulierClient: 'Eddie Stobart Logistics Ltd',
        hoursClaimed: 10.0,
        hoursApproved: 10.0,
        hourlyRate: 24.5,
        grossPay: 245.0,
        disputed: false
      },
      {
        shiftId: 'sh-ts-02',
        shiftRef: 'SH-MAGNA-8812',
        date: '2026-09-22',
        vehicleReg: 'WX69 BKP',
        haulierClient: 'Eddie Stobart Logistics Ltd',
        hoursClaimed: 10.0,
        hoursApproved: 10.0,
        hourlyRate: 24.5,
        grossPay: 245.0,
        disputed: false
      },
      {
        shiftId: 'sh-ts-03',
        shiftRef: 'SH-DAV-4109',
        date: '2026-09-23',
        vehicleReg: 'MX23 ZTR',
        haulierClient: 'Eddie Stobart Logistics Ltd',
        hoursClaimed: 10.0,
        hoursApproved: 10.0,
        hourlyRate: 24.5,
        grossPay: 245.0,
        disputed: false
      },
      {
        shiftId: 'sh-ts-04',
        shiftRef: 'SH-RUG-3011',
        date: '2026-09-24',
        vehicleReg: 'MX23 ZTR',
        haulierClient: 'Eddie Stobart Logistics Ltd',
        hoursClaimed: 15.7,
        hoursApproved: 15.7,
        hourlyRate: 24.5,
        grossPay: 385.0,
        disputed: false
      }
    ]
  },
  {
    invoiceNumber: 'SBI-2026-W38-0092',
    weekEnding: '2026-09-25',
    driverId: 'DRV-1088',
    driverName: 'Sarah Jenkins (SJ Haulage Services Ltd)',
    driverNiNumber: 'PL •••• 91A',
    driverUtrOrCompany: 'Co. Reg: 12904812 / UTR: 894012849',
    haulierName: 'Wincanton Group Ltd',
    haulierVatNumber: 'GB 987 6543 21',
    ir35Status: 'OUTSIDE_IR35_B2B',
    grossTotal: 1540.0,
    agencyPlatformFee: 154.0,
    factoringSurcharge: 53.9, // 3.5% factoring advance
    vatAmount: 308.0,
    netPayable: 1332.1,
    paymentMethod: 'NET_30_FACTORING',
    payoutDueDate: '2026-09-23T15:00:00Z', // Immediate 2-hour capital release
    tuesdayDisputeCutoffMet: true,
    status: 'FUNDED_FACTORING',
    timesheets: [
      {
        shiftId: 'sh-ts-05',
        shiftRef: 'SH-TRAFF-7603',
        date: '2026-09-21',
        vehicleReg: 'MX23 ZTR',
        haulierClient: 'Wincanton Group Ltd',
        hoursClaimed: 11.0,
        hoursApproved: 11.0,
        hourlyRate: 29.0,
        grossPay: 319.0,
        disputed: false
      },
      {
        shiftId: 'sh-ts-06',
        shiftRef: 'SH-TRAFF-7603',
        date: '2026-09-22',
        vehicleReg: 'MX23 ZTR',
        haulierClient: 'Wincanton Group Ltd',
        hoursClaimed: 11.0,
        hoursApproved: 11.0,
        hourlyRate: 29.0,
        grossPay: 319.0,
        disputed: false
      },
      {
        shiftId: 'sh-ts-07',
        shiftRef: 'SH-HAMS-5521',
        date: '2026-09-23',
        vehicleReg: 'WX69 BKP',
        haulierClient: 'Wincanton Group Ltd',
        hoursClaimed: 10.0,
        hoursApproved: 10.0,
        hourlyRate: 29.0,
        grossPay: 290.0,
        disputed: false
      }
    ]
  },
  {
    invoiceNumber: 'SBI-2026-W38-0095',
    weekEnding: '2026-09-25',
    driverId: 'DRV-1144',
    driverName: 'Arthur Pendelton',
    driverNiNumber: 'NZ •••• 18D',
    haulierName: 'Turners (Soham) Ltd',
    haulierVatNumber: 'GB 456 7890 12',
    ir35Status: 'INSIDE_IR35',
    taxDeductionPAYE: 142.0,
    nicEmployeeDeduction: 48.0,
    grossTotal: 960.0,
    agencyPlatformFee: 96.0,
    factoringSurcharge: 0.0,
    vatAmount: 192.0,
    netPayable: 770.0,
    paymentMethod: 'AUTOMATED_DIRECT_DEBIT',
    payoutDueDate: '2026-09-25T11:00:00Z',
    tuesdayDisputeCutoffMet: false, // Dispute window still ticking down!
    status: 'PENDING_TUESDAY_CUTOFF',
    timesheets: [
      {
        shiftId: 'sh-ts-08',
        shiftRef: 'SH-RUG-3011',
        date: '2026-09-21',
        vehicleReg: 'WX69 BKP',
        haulierClient: 'Turners (Soham) Ltd',
        hoursClaimed: 10.5,
        hoursApproved: 9.5,
        hourlyRate: 24.0,
        grossPay: 228.0,
        disputed: true,
        disputeReason: 'Client adjusted 1 hr due to extended unpaid meal break at Crick truckstop. Driver counter-evidence uploaded.'
      }
    ]
  }
];
