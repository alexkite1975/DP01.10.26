import { SiteRiskAssessment } from '../types';

export const INITIAL_MOTORWAY_SERVICES: SiteRiskAssessment[] = [
  {
    id: 'msa-001',
    siteType: 'MOTORWAY_SERVICES',
    title: 'Tebay Services (M6 J38 Cumbria)',
    businessName: 'Westmorland Family - Tebay Services',
    address: 'M6 Motorway Northbound & Southbound, Orton, Penrith CA10 3SB, UK',
    placeId: 'ChIJ7Y0Q-X9se0gRSK9sHqF8Zls',
    plusCode: '9C8RCRQ2+5F',
    isOfflineCached: true,
    placePhotos: [
      'https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=800&q=80'
    ],
    coordinates: { lat: 54.4361, lng: -2.6001 },
    what3words: '///freshest.spitfire.steers',
    depotZone: 'M6 Trans-Pennine Corridor',
    createdAt: '2026-08-01T08:00:00Z',
    updatedAt: '2026-09-28T09:15:00Z',
    version: 8,
    overallRiskLevel: 'LOW',
    overallScore: 4,
    status: 'APPROVED',
    motorwayServicesData: {
      operator: 'Westmorland',
      motorway: 'M6 J38',
      hgvParkingSpaces: 110,
      currentOccupancyStatus: 'SPACES_AVAILABLE',
      estimatedAvailableBays: 32,
      lastCapacityUpdate: {
        driverName: 'Dave Higgins (C+E Tramper)',
        vehicleReg: 'GN21 JKM',
        timestamp: '14 mins ago',
        status: 'SPACES_AVAILABLE',
        reportedBays: 32,
        notes: 'Plenty of bays available along duck pond perimeter. Quiet night expected.'
      },
      parkingTariff: {
        freeHours: 2,
        overnightCost: 33.0,
        includesFoodVoucher: true,
        foodVoucherAmount: 14.0,
        snapAccepted: true,
        fuelCardsAccepted: ['Keyfuels', 'Allstar', 'DKV', 'UTA', 'Esso Card']
      },
      facilities: {
        showersWorking: true,
        showerRating: 4.9,
        hotFood24h: true,
        foodOutlets: ['Westmorland Farmshop & Kitchen', 'Artisan Butchery', 'Quick Kitchen Deli'],
        securityLevel: 'GUARDED_CCTV_GATED',
        securityRating: 4.8,
        fuelTheftRisk: 'LOW',
        truckWash: false,
        adBluePump: true,
        evTruckCharging: true,
        freeWifi: true,
        quietSleepZone: true,
        turningEase: 'WIDE_EASY'
      },
      overallRating: 4.9,
      reviewCount: 412,
      categoryRatings: {
        showers: 4.9,
        security: 4.8,
        foodQuality: 5.0,
        parkingLayout: 4.7,
        valueForMoney: 4.6
      },
      driverReviews: [
        {
          id: 'rev-tb-1',
          driverName: 'Mark "Yorkshire" S.',
          driverBadge: 'Class 1 Tramper (18 yrs)',
          vehicleReg: 'YN72 VPL',
          timestamp: 'Yesterday at 20:45',
          overallScore: 5,
          categoryScores: { showers: 5, security: 5, food: 5, parking: 5, value: 5 },
          title: 'Undisputed King of British Motorway Services',
          comment: 'Outstanding hot shower with proper water pressure and clean private cubicle. Farmshop breakfast bap with voucher is unbeatable. Duck pond parking is pitch black and dead quiet for 9hr reduced rest.',
          facilitiesVerified: { showersClean: true, cctvWorking: true, hotFoodAvailable: true, spacesAtNight: true },
          helpfulCount: 38
        },
        {
          id: 'rev-tb-2',
          driverName: 'Krzysztof W.',
          driverBadge: 'Reefer Continental Driver',
          vehicleReg: 'PL-WA8891',
          timestamp: '3 days ago',
          overallScore: 5,
          categoryScores: { showers: 5, security: 4, food: 5, parking: 4, value: 4 },
          title: 'Fresh cooked meat and clean facilities',
          comment: 'Very good SNAP payment processed quickly at fuel desk. Real food not fast food sludge. Fills up after 21:00 on Sunday nights so get in before 19:30 if possible.',
          facilitiesVerified: { showersClean: true, cctvWorking: true, hotFoodAvailable: true, spacesAtNight: false },
          helpfulCount: 21
        }
      ]
    },
    businessSection: {
      mandatoryPPE: ['Hi-Vis Vest on HGV apron'],
      accessProcedures: 'Decelerate on dedicated deceleration slip road. Follow green HGV road markings towards rear apron.',
      gateSecurityCode: 'ANPR Registered - Pay at Fuel Desk or SNAP',
      intercomInstructions: 'Press 24h Assistance button at entrance barrier if ANPR camera does not open.',
      operatingHours: { open: '00:00', close: '23:59', days: 'Mon - Sun (24/7)', outOfHoursDeliveryPermitted: true },
      timeWindowHazards: [],
      vehicleConstraints: {
        maxHeightMeters: 4.95,
        maxWeightTonnes: 44.0,
        maxLengthMeters: 18.75,
        maxWidthMeters: 2.6,
        tailLiftRequired: false,
        turningCircleConstraint: 'EASY'
      },
      loadingBayDetails: {
        bayCount: 110,
        dockType: 'GROUND_LEVEL',
        reversingGuidance: 'Drive-through chevron parking bays available. Reverse only if end bay.',
        wheelChocksMandatory: false,
        keysHandoverRequired: false
      },
      siteManager: {
        name: 'Duty Manager (Westmorland Operations)',
        phone: '+44 1539 624511',
        email: 'duty.tebay@westmorland.co.uk',
        radioChannel: 'CH 19 Truck Calling'
      },
      emergencyMusterPoint: 'Main Car Park Pedestrian Walkway by Duck Pond',
      baselineHazards: [
        {
          id: 'msa-tb-haz-1',
          hazard: 'Winter Black Ice on Tebay Incline Slip Road',
          category: 'ENVIRONMENTAL',
          likelihood: 4,
          severity: 3,
          riskRating: 12,
          riskLevel: 'MEDIUM',
          controlMeasures: [
            'Automated brine spraying active when air temp < 2°C',
            'Strict 15 mph limit on apron ramp'
          ]
        }
      ],
      approachVideoGuide: {
        title: 'HGV Slip Road Deceleration & Parking Approach',
        summary: 'Follow dedicated truck lane to rear apron',
        durationSeconds: 60,
        steps: []
      },
      media: [],
      designatedHGVRoute: 'Direct off-slip M6 Junction 38 (Northbound and Southbound connected via overbridge)'
    },
    driverSection: {
      realTimeAlerts: ['Showers cleaned between uses', 'Duck pond parking quiet tonight'],
      observations: [],
      pendingModifications: []
    },
    auditHistory: []
  },

  {
    id: 'msa-002',
    siteType: 'MOTORWAY_SERVICES',
    title: 'Watford Gap Services (M1 J16/17 Northamptonshire)',
    businessName: 'Moto Hospitality - Watford Gap Services',
    address: 'M1 Motorway between J16 & J17, Watford, Northampton NN6 7UZ, UK',
    placeId: 'ChIJV_J2gQfBd0gRJQ41yW1sA6E',
    plusCode: '9C4V8VP8+22',
    isOfflineCached: true,
    placePhotos: [
      'https://images.unsplash.com/photo-1578575437130-527eed3abbec?auto=format&fit=crop&w=800&q=80'
    ],
    coordinates: { lat: 52.3088, lng: -1.1219 },
    what3words: '///roost.snooping.outpost',
    depotZone: 'M1 Golden Logistics Triangle',
    createdAt: '2026-08-01T08:00:00Z',
    updatedAt: '2026-09-28T11:40:00Z',
    version: 12,
    overallRiskLevel: 'MEDIUM',
    overallScore: 11,
    status: 'APPROVED',
    motorwayServicesData: {
      operator: 'Moto',
      motorway: 'M1 J16/17',
      hgvParkingSpaces: 145,
      currentOccupancyStatus: 'BUSY_FILLING_FAST',
      estimatedAvailableBays: 8,
      lastCapacityUpdate: {
        driverName: 'Lee Robinson (Night Trunk)',
        vehicleReg: 'EK71 XZX',
        timestamp: '9 mins ago',
        status: 'BUSY_FILLING_FAST',
        reportedBays: 8,
        notes: 'Southbound HGV apron filling fast. Only ~8 bays left near fuel pumps.'
      },
      parkingTariff: {
        freeHours: 2,
        overnightCost: 35.0,
        includesFoodVoucher: true,
        foodVoucherAmount: 10.0,
        snapAccepted: true,
        fuelCardsAccepted: ['Keyfuels', 'Allstar', 'DKV', 'UTA', 'Shell Card']
      },
      facilities: {
        showersWorking: true,
        showerRating: 3.5,
        hotFood24h: true,
        foodOutlets: ['McDonalds', 'Costa Coffee', 'Marks & Spencer Simply Food', 'Greggs'],
        securityLevel: 'CCTV_PATROLLED',
        securityRating: 3.6,
        fuelTheftRisk: 'MEDIUM',
        truckWash: false,
        adBluePump: true,
        evTruckCharging: false,
        freeWifi: true,
        quietSleepZone: false,
        turningEase: 'MODERATE'
      },
      overallRating: 3.8,
      reviewCount: 289,
      categoryRatings: {
        showers: 3.4,
        security: 3.6,
        foodQuality: 4.1,
        parkingLayout: 3.7,
        valueForMoney: 3.2
      },
      driverReviews: [
        {
          id: 'rev-wg-1',
          driverName: 'Gary "Spud" M.',
          driverBadge: 'Night Trunk Driver',
          vehicleReg: 'BK20 TZZ',
          timestamp: '2 days ago',
          overallScore: 3,
          categoryScores: { showers: 3, security: 3, food: 4, parking: 3, value: 3 },
          title: 'Decent for food, gets jammed after 19:30',
          comment: 'Historical site! 24h McDonalds is handy for a late coffee. Showers are okay but could do with a refurb. Check curtain straps before sleep as M1 corridor is prone to opportunists.',
          facilitiesVerified: { showersClean: true, cctvWorking: true, hotFoodAvailable: true, spacesAtNight: false },
          helpfulCount: 19
        }
      ]
    },
    businessSection: {
      mandatoryPPE: ['Hi-Vis Vest on apron'],
      accessProcedures: 'Follow HGV lane separate from cars. ANPR camera logs entry.',
      gateSecurityCode: 'ANPR Registered - Pay via Moto Parking App or SNAP',
      intercomInstructions: 'Security intercom located beside BP fuel kiosk.',
      operatingHours: { open: '00:00', close: '23:59', days: 'Mon - Sun (24/7)', outOfHoursDeliveryPermitted: true },
      timeWindowHazards: [],
      vehicleConstraints: {
        maxHeightMeters: 4.8,
        maxWeightTonnes: 44.0,
        maxLengthMeters: 18.75,
        maxWidthMeters: 2.6,
        tailLiftRequired: false,
        turningCircleConstraint: 'MODERATE'
      },
      loadingBayDetails: {
        bayCount: 145,
        dockType: 'GROUND_LEVEL',
        reversingGuidance: 'Straight reverse into marked bays. Watch for refuelling tankers on inner loop.',
        wheelChocksMandatory: false,
        keysHandoverRequired: false
      },
      siteManager: {
        name: 'Moto Site Operations',
        phone: '+44 1327 871144',
        email: 'watfordgap@moto-way.co.uk',
        radioChannel: 'CH 19'
      },
      emergencyMusterPoint: 'BP Fuel Forecourt Pedestrian Zone',
      baselineHazards: [
        {
          id: 'msa-wg-haz-1',
          hazard: 'Tight radius curb at Southbound fuel exit',
          category: 'TRAFFIC',
          likelihood: 3,
          severity: 2,
          riskRating: 6,
          riskLevel: 'LOW',
          controlMeasures: ['Keep cab wide around kerb to protect trailer tyre walls']
        }
      ],
      approachVideoGuide: {
        title: 'HGV Slip Road Deceleration & Parking Approach',
        summary: 'Follow dedicated truck lane to rear apron',
        durationSeconds: 60,
        steps: []
      },
      media: [],
      designatedHGVRoute: 'Direct M1 J16/J17 slip road'
    },
    driverSection: {
      realTimeAlerts: ['Southbound HGV apron filling fast', 'Greggs open from 05:00'],
      observations: [],
      pendingModifications: []
    },
    auditHistory: []
  },

  {
    id: 'msa-003',
    siteType: 'MOTORWAY_SERVICES',
    title: 'Rugby Services (M6 J1 Warwickshire)',
    businessName: 'Moto Hospitality - Rugby Services',
    address: 'M6 Motorway Junction 1, Rugby, Warwickshire CV23 0EZ, UK',
    placeId: 'ChIJL6X7-b_hd0gRrhZ5173eT-g',
    plusCode: '9C4V8X2H+9F',
    isOfflineCached: true,
    placePhotos: [
      'https://images.unsplash.com/photo-1541888946425-d0fbb186f5f7?auto=format&fit=crop&w=800&q=80'
    ],
    coordinates: { lat: 52.3922, lng: -1.2405 },
    what3words: '///glance.wants.stew',
    depotZone: 'M6 / A14 Gateway',
    createdAt: '2026-08-01T08:00:00Z',
    updatedAt: '2026-09-28T12:05:00Z',
    version: 6,
    overallRiskLevel: 'LOW',
    overallScore: 3,
    status: 'APPROVED',
    motorwayServicesData: {
      operator: 'Moto',
      motorway: 'M6 J1',
      hgvParkingSpaces: 120,
      currentOccupancyStatus: 'SPACES_AVAILABLE',
      estimatedAvailableBays: 24,
      lastCapacityUpdate: {
        driverName: 'Pawel Kowalski (Curtainsider)',
        vehicleReg: 'FD22 JXU',
        timestamp: '22 mins ago',
        status: 'SPACES_AVAILABLE',
        reportedBays: 24,
        notes: 'Good modern layout. Barrier working well and plenty of room in back row.'
      },
      parkingTariff: {
        freeHours: 2,
        overnightCost: 34.0,
        includesFoodVoucher: true,
        foodVoucherAmount: 10.0,
        snapAccepted: true,
        fuelCardsAccepted: ['Keyfuels', 'Allstar', 'DKV', 'UTA', 'BP Plus']
      },
      facilities: {
        showersWorking: true,
        showerRating: 4.8,
        hotFood24h: true,
        foodOutlets: ['Greggs', 'Pret A Manger', 'Costa Coffee', 'Marks & Spencer', 'Burger King'],
        securityLevel: 'GUARDED_CCTV_GATED',
        securityRating: 4.7,
        fuelTheftRisk: 'LOW',
        truckWash: false,
        adBluePump: true,
        evTruckCharging: true,
        freeWifi: true,
        quietSleepZone: true,
        turningEase: 'WIDE_EASY'
      },
      overallRating: 4.7,
      reviewCount: 340,
      categoryRatings: {
        showers: 4.8,
        security: 4.7,
        foodQuality: 4.6,
        parkingLayout: 4.8,
        valueForMoney: 4.3
      },
      driverReviews: [
        {
          id: 'rev-rg-1',
          driverName: 'Steve "Brummie" B.',
          driverBadge: 'Relief Tramper C+E',
          vehicleReg: 'BT21 VCC',
          timestamp: 'Yesterday at 17:10',
          overallScore: 5,
          categoryScores: { showers: 5, security: 5, food: 5, parking: 5, value: 4 },
          title: 'Top tier modern services - voted best in Britain',
          comment: 'Moto really got this one right. Massive bays with wide turning radius, high-spec modern showers with underfloor heating, secure entry ANPR barriers. Greggs and Pret open early.',
          facilitiesVerified: { showersClean: true, cctvWorking: true, hotFoodAvailable: true, spacesAtNight: true },
          helpfulCount: 42
        }
      ]
    },
    businessSection: {
      mandatoryPPE: ['Hi-Vis Vest on apron'],
      accessProcedures: 'Enter through automatic ANPR barrier. Follow one-way signage around the rear.',
      gateSecurityCode: 'Automatic ANPR Barcode / SNAP Account',
      intercomInstructions: 'Barrier intercom directly rings customer service desk 24/7.',
      operatingHours: { open: '00:00', close: '23:59', days: 'Mon - Sun (24/7)', outOfHoursDeliveryPermitted: true },
      timeWindowHazards: [],
      vehicleConstraints: {
        maxHeightMeters: 4.95,
        maxWeightTonnes: 44.0,
        maxLengthMeters: 18.75,
        maxWidthMeters: 2.6,
        tailLiftRequired: false,
        turningCircleConstraint: 'EASY'
      },
      loadingBayDetails: {
        bayCount: 120,
        dockType: 'GROUND_LEVEL',
        reversingGuidance: 'Drive-through bays in central aisle. Chevron parking on flanks.',
        wheelChocksMandatory: false,
        keysHandoverRequired: false
      },
      siteManager: {
        name: 'Moto Rugby General Management',
        phone: '+44 1788 560000',
        email: 'rugby.general@moto-way.co.uk',
        radioChannel: 'CH 19'
      },
      emergencyMusterPoint: 'Main Building Entrance Coach Bays',
      baselineHazards: [],
      approachVideoGuide: {
        title: 'HGV Slip Road Deceleration & Parking Approach',
        summary: 'Follow dedicated truck lane to rear apron',
        durationSeconds: 60,
        steps: []
      },
      media: [],
      designatedHGVRoute: 'Direct off M6 J1 roundabout'
    },
    driverSection: {
      realTimeAlerts: ['High-power EV truck charger active', 'Underfloor heated showers'],
      observations: [],
      pendingModifications: []
    },
    auditHistory: []
  },

  {
    id: 'msa-004',
    siteType: 'TRUCKSTOP',
    title: 'Formula Services Ellesmere Port (M53 J8 Cheshire)',
    businessName: 'Formula Services Purpose-Built Truckstop',
    address: 'Premier Way, Ellesmere Port, Cheshire CH65 3FR, UK',
    placeId: 'ChIJ5ZqXh-Gke0gRhDk4Y373Y7c',
    plusCode: '9C5VGQ4M+7R',
    isOfflineCached: true,
    placePhotos: [
      'https://images.unsplash.com/photo-1519003722824-194d4455a60c?auto=format&fit=crop&w=800&q=80'
    ],
    coordinates: { lat: 53.2801, lng: -2.9012 },
    what3words: '///verbs.spoke.chains',
    depotZone: 'North West & Liverpool Port Corridor',
    createdAt: '2026-08-01T08:00:00Z',
    updatedAt: '2026-09-28T12:30:00Z',
    version: 15,
    overallRiskLevel: 'LOW',
    overallScore: 2,
    status: 'APPROVED',
    motorwayServicesData: {
      operator: 'Independent',
      motorway: 'M53 J8',
      hgvParkingSpaces: 160,
      currentOccupancyStatus: 'SPACES_AVAILABLE',
      estimatedAvailableBays: 41,
      lastCapacityUpdate: {
        driverName: 'Darren Collins (Container Logistics)',
        vehicleReg: 'LL23 GTO',
        timestamp: '5 mins ago',
        status: 'SPACES_AVAILABLE',
        reportedBays: 41,
        notes: 'Security dogs on patrol. Driver gym open. Still plenty of space.'
      },
      parkingTariff: {
        freeHours: 1,
        overnightCost: 31.0,
        includesFoodVoucher: true,
        foodVoucherAmount: 12.0,
        snapAccepted: true,
        fuelCardsAccepted: ['Keyfuels', 'Allstar', 'DKV', 'UTA', 'Morgan Fuels', 'Circle K']
      },
      facilities: {
        showersWorking: true,
        showerRating: 5.0,
        hotFood24h: true,
        foodOutlets: ['Formula Drivers Restaurant', '24h Hot Food Kitchen', 'Licensed Truckers Bar'],
        securityLevel: 'GUARDED_CCTV_GATED',
        securityRating: 5.0,
        fuelTheftRisk: 'LOW',
        truckWash: true,
        adBluePump: true,
        evTruckCharging: true,
        freeWifi: true,
        quietSleepZone: true,
        turningEase: 'WIDE_EASY'
      },
      overallRating: 4.9,
      reviewCount: 520,
      categoryRatings: {
        showers: 5.0,
        security: 5.0,
        foodQuality: 4.8,
        parkingLayout: 4.9,
        valueForMoney: 4.8
      },
      driverReviews: [
        {
          id: 'rev-fs-1',
          driverName: 'Mick "The Hat" T.',
          driverBadge: 'Heavy Haulage Specialist',
          vehicleReg: 'MX19 KLP',
          timestamp: 'Yesterday at 22:15',
          overallScore: 5,
          categoryScores: { showers: 5, security: 5, food: 5, parking: 5, value: 5 },
          title: 'The gold standard of truckstops in Europe',
          comment: 'Unbelievable security - 10ft razor wire, trained guard dogs, 24h manned gatehouse. You can sleep like a baby without checking straps. Free gym, pool tables, free hot power showers, and proper cooked steak pie.',
          facilitiesVerified: { showersClean: true, cctvWorking: true, hotFoodAvailable: true, spacesAtNight: true },
          helpfulCount: 65
        }
      ]
    },
    businessSection: {
      mandatoryPPE: ['Hi-Vis on fuel lane'],
      accessProcedures: 'Stop at manned security gatehouse. Guard records registration, checks seal, issues parking token.',
      gateSecurityCode: 'Manned Security Gatehouse 24/7',
      intercomInstructions: 'Speak to gate officer in security cabin upon arrival.',
      operatingHours: { open: '00:00', close: '23:59', days: 'Mon - Sun (24/7)', outOfHoursDeliveryPermitted: true },
      timeWindowHazards: [],
      vehicleConstraints: {
        maxHeightMeters: 5.1,
        maxWeightTonnes: 60.0,
        maxLengthMeters: 25.0,
        maxWidthMeters: 3.5,
        tailLiftRequired: false,
        turningCircleConstraint: 'EASY'
      },
      loadingBayDetails: {
        bayCount: 160,
        dockType: 'GROUND_LEVEL',
        reversingGuidance: 'Concrete yard with painted bay lines and high-output LED floodlights.',
        wheelChocksMandatory: false,
        keysHandoverRequired: false
      },
      siteManager: {
        name: 'Formula Operations Control',
        phone: '+44 151 356 0444',
        email: 'info@formulaservices.co.uk',
        radioChannel: 'CH 19'
      },
      emergencyMusterPoint: 'Gatehouse Security Office Assembly Zone',
      baselineHazards: [],
      approachVideoGuide: {
        title: 'HGV Slip Road Deceleration & Parking Approach',
        summary: 'Follow dedicated truck lane to rear apron',
        durationSeconds: 60,
        steps: []
      },
      media: [],
      designatedHGVRoute: 'Direct dual carriageway access off M53 Junction 8'
    },
    driverSection: {
      realTimeAlerts: ['Driver fitness gym & sauna open 24/7', 'Manned security gatehouse active'],
      observations: [],
      pendingModifications: []
    },
    auditHistory: []
  },

  {
    id: 'msa-005',
    siteType: 'TRUCKSTOP',
    title: 'Rothwell Truckstop (A14 J13 Northamptonshire)',
    businessName: 'Rothwell Truckstop Secure Logistics Hub',
    address: 'Orton Road, Rothwell, Kettering NN14 1TX, UK',
    placeId: 'ChIJv8S74fNxd0gReD_834J9y3M',
    plusCode: '9C4VCW32+9X',
    isOfflineCached: true,
    placePhotos: [
      'https://images.unsplash.com/photo-1592838064575-70ed626d3a0e?auto=format&fit=crop&w=800&q=80'
    ],
    coordinates: { lat: 52.4271, lng: -0.8034 },
    what3words: '///breeze.revolves.rekindle',
    depotZone: 'A14 Felixstowe Container Freight Spine',
    createdAt: '2026-08-01T08:00:00Z',
    updatedAt: '2026-09-28T12:55:00Z',
    version: 9,
    overallRiskLevel: 'LOW',
    overallScore: 3,
    status: 'APPROVED',
    motorwayServicesData: {
      operator: 'Independent',
      motorway: 'A14 J13',
      hgvParkingSpaces: 130,
      currentOccupancyStatus: 'FULL_NO_SPACES',
      estimatedAvailableBays: 0,
      lastCapacityUpdate: {
        driverName: 'Liam Fitzpatrick (East Coast Container)',
        vehicleReg: 'AY21 VBM',
        timestamp: '3 mins ago',
        status: 'FULL_NO_SPACES',
        reportedBays: 0,
        notes: 'Rammed solid! Gate security turning trucks away. Slip road full.'
      },
      parkingTariff: {
        freeHours: 1,
        overnightCost: 29.5,
        includesFoodVoucher: true,
        foodVoucherAmount: 10.0,
        snapAccepted: true,
        fuelCardsAccepted: ['Keyfuels', 'Allstar', 'DKV', 'UTA', 'Texaco Fastfuel']
      },
      facilities: {
        showersWorking: true,
        showerRating: 4.4,
        hotFood24h: true,
        foodOutlets: ['Traditional Truckers Cafe & Grill', 'Bar & TV Lounge'],
        securityLevel: 'GUARDED_CCTV_GATED',
        securityRating: 4.8,
        fuelTheftRisk: 'LOW',
        truckWash: true,
        adBluePump: true,
        evTruckCharging: false,
        freeWifi: true,
        quietSleepZone: true,
        turningEase: 'WIDE_EASY'
      },
      overallRating: 4.5,
      reviewCount: 310,
      categoryRatings: {
        showers: 4.4,
        security: 4.8,
        foodQuality: 4.7,
        parkingLayout: 4.5,
        valueForMoney: 4.6
      },
      driverReviews: [
        {
          id: 'rev-rw-1',
          driverName: 'Chris "Felixstowe" H.',
          driverBadge: 'Container Trunk Lead',
          vehicleReg: 'SN70 ZXR',
          timestamp: 'Yesterday at 19:20',
          overallScore: 5,
          categoryScores: { showers: 4, security: 5, food: 5, parking: 4, value: 5 },
          title: 'Essential A14 stop but arrive before 18:00',
          comment: 'Proper old-school trucker hospitality. Great roast dinner and full English. Superb security with high fence and floodlights. Gets full every night by 18:30 due to Felixstowe-Midlands traffic.',
          facilitiesVerified: { showersClean: true, cctvWorking: true, hotFoodAvailable: true, spacesAtNight: false },
          helpfulCount: 29
        }
      ]
    },
    businessSection: {
      mandatoryPPE: ['Hi-Vis Vest on apron'],
      accessProcedures: 'Report to entry booth. Present SNAP card or company credit card.',
      gateSecurityCode: 'Manned Gate Barrier',
      intercomInstructions: 'Call 01536 713020 if barrier is closed.',
      operatingHours: { open: '00:00', close: '23:59', days: 'Mon - Sun (24/7)', outOfHoursDeliveryPermitted: true },
      timeWindowHazards: [],
      vehicleConstraints: {
        maxHeightMeters: 4.9,
        maxWeightTonnes: 44.0,
        maxLengthMeters: 18.75,
        maxWidthMeters: 2.6,
        tailLiftRequired: false,
        turningCircleConstraint: 'EASY'
      },
      loadingBayDetails: {
        bayCount: 130,
        dockType: 'GROUND_LEVEL',
        reversingGuidance: 'Well-spaced parking lanes. Easy drive-in.',
        wheelChocksMandatory: false,
        keysHandoverRequired: false
      },
      siteManager: {
        name: 'Rothwell Yard Operations',
        phone: '+44 1536 713020',
        email: 'info@rothwelltruckstop.co.uk',
        radioChannel: 'CH 19'
      },
      emergencyMusterPoint: 'Diner Restaurant Entrance Forecourt',
      baselineHazards: [],
      approachVideoGuide: {
        title: 'HGV Slip Road Deceleration & Parking Approach',
        summary: 'Follow dedicated truck lane to rear apron',
        durationSeconds: 60,
        steps: []
      },
      media: [],
      designatedHGVRoute: 'Direct off A14 Junction 13'
    },
    driverSection: {
      realTimeAlerts: ['Rammed full by 18:30 due to container traffic', 'SNAP payment accepted'],
      observations: [],
      pendingModifications: []
    },
    auditHistory: []
  },

  {
    id: 'msa-006',
    siteType: 'MOTORWAY_SERVICES',
    title: 'Cobham Services (M25 J9/10 Surrey)',
    businessName: 'Extra MSA Group - Cobham Services',
    address: 'M25 Motorway between J9 & J10, Downside, Cobham KT11 3DB, UK',
    placeId: 'ChIJV4Z4W9bndkgRC0T4qLw1Plo',
    plusCode: '9C3XFXV8+44',
    isOfflineCached: true,
    placePhotos: [
      'https://images.unsplash.com/photo-1517649763962-0c623266ddc0?auto=format&fit=crop&w=800&q=80'
    ],
    coordinates: { lat: 51.3149, lng: -0.4072 },
    what3words: '///bliss.lamps.curiosity',
    depotZone: 'M25 London Orbital Corridor',
    createdAt: '2026-08-01T08:00:00Z',
    updatedAt: '2026-09-28T13:00:00Z',
    version: 7,
    overallRiskLevel: 'MEDIUM',
    overallScore: 8,
    status: 'APPROVED',
    motorwayServicesData: {
      operator: 'Extra',
      motorway: 'M25 J9/10',
      hgvParkingSpaces: 95,
      currentOccupancyStatus: 'BUSY_FILLING_FAST',
      estimatedAvailableBays: 5,
      lastCapacityUpdate: {
        driverName: 'Robert Vance (Kent Shuttle)',
        vehicleReg: 'KX22 YHH',
        timestamp: '11 mins ago',
        status: 'BUSY_FILLING_FAST',
        reportedBays: 5,
        notes: 'Nearly full. Only 5 slots left near the truck fuel pumps.'
      },
      parkingTariff: {
        freeHours: 2,
        overnightCost: 38.0,
        includesFoodVoucher: true,
        foodVoucherAmount: 10.0,
        snapAccepted: true,
        fuelCardsAccepted: ['Keyfuels', 'Allstar', 'DKV', 'UTA', 'Shell Card']
      },
      facilities: {
        showersWorking: true,
        showerRating: 4.2,
        hotFood24h: true,
        foodOutlets: ["Nando's", 'KFC', 'Pizza Express', 'Costa Coffee', 'Marks & Spencer', "McDonald's"],
        securityLevel: 'CCTV_PATROLLED',
        securityRating: 4.1,
        fuelTheftRisk: 'LOW',
        truckWash: false,
        adBluePump: true,
        evTruckCharging: true,
        freeWifi: true,
        quietSleepZone: false,
        turningEase: 'MODERATE'
      },
      overallRating: 4.2,
      reviewCount: 395,
      categoryRatings: {
        showers: 4.2,
        security: 4.1,
        foodQuality: 4.7,
        parkingLayout: 3.9,
        valueForMoney: 3.3
      },
      driverReviews: [
        {
          id: 'rev-cb-1',
          driverName: 'Tony "Londoner" D.',
          driverBadge: 'Class 1 Distribution',
          vehicleReg: 'LL69 BXP',
          timestamp: '3 days ago',
          overallScore: 4,
          categoryScores: { showers: 4, security: 4, food: 5, parking: 3, value: 3 },
          title: 'Top food choice on M25 but pricey overnight',
          comment: 'Best food choice on the entire M25 with Nandos and KFC. Showers are clean and modern. Very steep £38 parking tariff though, make sure company pays SNAP.',
          facilitiesVerified: { showersClean: true, cctvWorking: true, hotFoodAvailable: true, spacesAtNight: false },
          helpfulCount: 31
        }
      ]
    },
    businessSection: {
      mandatoryPPE: ['Hi-Vis on apron'],
      accessProcedures: 'Decelerate into dedicated HGV lane. ANPR logged.',
      gateSecurityCode: 'Automatic ANPR Barcode / SNAP Account',
      intercomInstructions: 'Security assistance point at fuel forecourt.',
      operatingHours: { open: '00:00', close: '23:59', days: 'Mon - Sun (24/7)', outOfHoursDeliveryPermitted: true },
      timeWindowHazards: [],
      vehicleConstraints: {
        maxHeightMeters: 4.8,
        maxWeightTonnes: 44.0,
        maxLengthMeters: 18.75,
        maxWidthMeters: 2.6,
        tailLiftRequired: false,
        turningCircleConstraint: 'MODERATE'
      },
      loadingBayDetails: {
        bayCount: 95,
        dockType: 'GROUND_LEVEL',
        reversingGuidance: 'Reverse into bays. Watch for circulating car traffic near slip road.',
        wheelChocksMandatory: false,
        keysHandoverRequired: false
      },
      siteManager: {
        name: 'Extra MSA Cobham Management',
        phone: '+44 1932 860710',
        email: 'cobham@extraservices.co.uk',
        radioChannel: 'CH 19'
      },
      emergencyMusterPoint: 'Food Court Main Plaza Assembly Point',
      baselineHazards: [],
      approachVideoGuide: {
        title: 'HGV Slip Road Deceleration & Parking Approach',
        summary: 'Follow dedicated truck lane to rear apron',
        durationSeconds: 60,
        steps: []
      },
      media: [],
      designatedHGVRoute: 'Direct off-slip M25 between J9 & J10'
    },
    driverSection: {
      realTimeAlerts: ['Nandos and KFC open until 22:30', 'Steep overnight tariff (£38)'],
      observations: [],
      pendingModifications: []
    },
    auditHistory: []
  }
];
