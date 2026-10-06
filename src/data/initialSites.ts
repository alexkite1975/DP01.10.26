import { SiteRiskAssessment, SiteManagerUser, SubscriptionInfo } from '../types';
import { INITIAL_MOTORWAY_SERVICES } from './initialMotorwayServices';

export const INITIAL_SITES: SiteRiskAssessment[] = [
  {
    id: 'site-001',
    siteType: 'DISTRIBUTION_CENTRE',
    title: 'Prologis Park Apex Bay 4',
    businessName: 'Prologis Distribution Hub',
    address: 'Apex Parkway, Magna Park, Lutterworth LE17 4XN, UK',
    placeId: 'ChIJb6eBf30Vd0gReZ5Bv_0cEAg',
    plusCode: '9C4VFR54+9Q',
    isOfflineCached: true,
    placePhotos: [
      'https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1590674899484-d5640e854abe?auto=format&fit=crop&w=800&q=80'
    ],
    coordinates: { lat: 52.4578, lng: -1.2467 },
    what3words: '///focal.shoppers.cushion',
    depotZone: 'Midlands Trunking Hub',
    createdAt: '2026-08-12T09:00:00Z',
    updatedAt: '2026-09-12T14:30:00Z',
    version: 4,
    overallRiskLevel: 'MEDIUM',
    overallScore: 12,
    status: 'APPROVED',
    dynamicRiskIndex: {
      score: 46,
      level: 'MEDIUM',
      ratingScore: 40,
      defectFrequencyScore: 45,
      nearMissScore: 55,
      isHighRiskAlert: false,
      lastCalculatedAt: '2026-09-20T10:00:00Z'
    },
    inductionGatekeeping: {
      isCompleted: false,
      oneWayTrafficAcknowledged: false,
      speedLimitAcknowledged: false,
      mandatoryPPEConfirmed: [],
      qrToken: 'DP-PROLOGIS-BAY4-9921',
      isQrUnlocked: false,
      specialHazardsAcknowledged: []
    },
    congestionTracker: {
      queueCount: 3,
      avgTurnaroundMinutes: 42,
      currentWaitMinutes: 0,
      isDemurrageTimerRunning: false,
      demurrageHourlyRate: 45.0,
      estimatedDemurrageClaim: 0
    },
    threeTapAudits: [
      {
        id: 'tta-1',
        timestamp: '2026-09-19T14:32:00Z',
        driverName: 'Dave Higgins (C+E)',
        vehicleReg: 'GN21 JKM',
        yardAccessRating: 'GREEN',
        yardAccessNotes: 'Clear swept tarmac and wide turning apron at Gate 2.',
        pedestrianSegregationRating: 'AMBER',
        pedestrianNotes: 'Green walkway crossing busy at 14:00 shift handoff.',
        bayClearanceLightingRating: 'GREEN',
        bayLightingNotes: 'LED floodlights operating on all flush bays.',
        obstructionPhotos: [],
        calculatedRiskContribution: 35
      }
    ],

    businessSection: {
      mandatoryPPE: [
        'Hi-Vis Class 3 Vest/Jacket',
        'Safety Boots (Steel Toe & Midsole S3)',
        'Hard Hat (Yellow/White)',
        'Safety Glasses (in bay)'
      ],
      accessProcedures:
        'Approach via Gate 2 North. Report to security gatehouse, present booking ref and consignee manifest. Drivers must turn off engine at security and step into the booth for breathalyzer spot-check.',
      gateSecurityCode: 'Buzzer 2 or Keypad #8412*',
      intercomInstructions: 'Security Intercom Channel 4. State company name, trailer number, and bay appointment slot.',
      operatingHours: {
        open: '05:00',
        close: '23:00',
        days: 'Mon - Sun (24/7 Gate Guarded)',
        outOfHoursDeliveryPermitted: true
      },
      timeWindowHazards: [
        {
          id: 'twh-1',
          title: 'Shift Change Pedestrian Crossing Surge',
          timeStart: '06:45',
          timeEnd: '07:30',
          severity: 'HIGH',
          description: 'Over 200 warehouse staff cross main internal transit roadway on foot. 10mph enforced strictly.',
          affectedParties: 'Warehouse personnel, cyclists at roundabout'
        },
        {
          id: 'twh-2',
          title: 'Evening Curtainsider Departure Wave',
          timeStart: '18:00',
          timeEnd: '19:30',
          severity: 'MEDIUM',
          description: 'High volume of artics pulling out of bays 1-18. Blind spot reversing into perimeter roadway.',
          affectedParties: 'All approaching delivery drivers'
        }
      ],
      vehicleConstraints: {
        maxHeightMeters: 4.65,
        maxWeightTonnes: 44.0,
        maxLengthMeters: 18.75,
        tailLiftRequired: false,
        turningCircleConstraint: 'EASY',
        lowBridgeAlert: 'Clear route via A4303. Avoid Bitteswell village route (3.3m arch bridge).'
      },
      loadingBayDetails: {
        bayCount: 24,
        dockType: 'FLUSH_DOCK',
        reversingGuidance:
          'Bays 1-12 are scissor-lift hydraulic levelers. Yellow floor alignment lines. Marshals present during peak hours. Hazard lights must remain flashing.',
        wheelChocksMandatory: true,
        keysHandoverRequired: true
      },
      siteManager: {
        name: 'Dave Henderson (Site Safety Director)',
        phone: '+44 7700 900142',
        email: 'dave.henderson@prologis-apex.co.uk',
        radioChannel: 'PMR Ch 8 (Sub-code 12)'
      },
      emergencyMusterPoint: 'Assembly Point C - North Visitor Car Park perimeter',
      baselineHazards: [
        {
          id: 'haz-1',
          hazard: 'Forklift truck (FLT) cross-traffic at Bay 14-20 apron',
          category: 'TRAFFIC',
          likelihood: 3,
          severity: 4,
          riskRating: 12,
          riskLevel: 'MEDIUM',
          controlMeasures: [
            'Designated pedestrian walking walkway painted in green',
            'FLT flashing blue spot beacons installed',
            'Sound horn before reversing into bay'
          ]
        },
        {
          id: 'haz-2',
          hazard: 'Trailer rollaway during forklift loading',
          category: 'TRAFFIC',
          likelihood: 2,
          severity: 5,
          riskRating: 10,
          riskLevel: 'MEDIUM',
          controlMeasures: [
            'Mandatory dual red cast wheel chocks locked on off-side rear axle',
            'Ignition key red tag box handed to bay coordinator'
          ]
        },
        {
          id: 'haz-3',
          hazard: 'Wet metal dock leveller plate slip risk during rain',
          category: 'SLIP_TRIP',
          likelihood: 3,
          severity: 3,
          riskRating: 9,
          riskLevel: 'LOW',
          controlMeasures: ['Anti-slip grit paint coated', 'Footwear S3 SRC slip resistance required']
        }
      ],
      approachVideoGuide: {
        title: 'Gate 2 to Bay 4 Approach Guide',
        summary: 'Step-by-step navigation from Apex roundabout to unloading bay with blind spot alerts.',
        durationSeconds: 95,
        steps: [
          {
            stepNumber: 1,
            heading: 'Roundabout Exit 3 (Apex Way)',
            instruction: 'Take Exit 3 onto Apex Parkway. Stay in middle lane. Do not take Exit 2 (Staff Car Park).',
            narrationText:
              'Approaching Prologis Park. At the Apex roundabout, take the third exit onto Apex Parkway. Heavy vehicle lane is on the left.',
            checkpointType: 'ROUNDABOUT',
            mockImageUrl: 'https://images.unsplash.com/photo-1542282088-72c9c27ed0cd?auto=format&fit=crop&w=600&q=80'
          },
          {
            stepNumber: 2,
            heading: 'Security Inbound Gate 2',
            instruction: 'Pull up alongside security intercom tower. Engine off. Present QR booking ref to scanner.',
            narrationText:
              'Stop at Security Gate 2 on the right. Buzz security on channel 4 or enter code pound 8 4 1 2 star. Driver must step into booth for site log.',
            checkpointType: 'SECURITY_GATE',
            hazardWarning: 'Barrier arm auto-descends after 12 seconds.',
            mockImageUrl: 'https://images.unsplash.com/photo-1590674899484-d5640e854abe?auto=format&fit=crop&w=600&q=80'
          },
          {
            stepNumber: 3,
            heading: 'Internal One-Way Apron',
            instruction: 'Follow yellow painted directional arrows counter-clockwise around Building B.',
            narrationText:
              'Proceed counter-clockwise at maximum 10 miles per hour. Be alert for pedestrians crossing between warehouse bays 10 and 14.',
            checkpointType: 'HIGHWAY_EXIT',
            mockImageUrl: 'https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?auto=format&fit=crop&w=600&q=80'
          },
          {
            stepNumber: 4,
            heading: 'Bay 4 Dock Incline Reversing',
            instruction: 'Swing wide into apron, engage hazard lights, apply handbrake, chock rear wheels.',
            narrationText:
              'You have arrived at Bay 4. Reverse straight onto hydraulic buffer pads. Chock both rear wheels immediately and hand keys to the bay marshal.',
            checkpointType: 'LOADING_BAY',
            hazardWarning: 'Concrete bollard on driver blind-side 2 meters from dock seal.',
            mockImageUrl: 'https://images.unsplash.com/photo-1587293852726-70cdb56c2866?auto=format&fit=crop&w=600&q=80'
          }
        ]
      },
      media: [
        {
          id: 'med-1',
          type: 'PHOTO',
          url: 'https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?auto=format&fit=crop&w=800&q=80',
          caption: 'Gate 2 Security Entrance & Inbound Lane',
          category: 'ENTRANCE',
          uploadedAt: '2026-08-12T10:00:00Z',
          uploadedBy: 'Dave Henderson (Safety Director)'
        },
        {
          id: 'med-2',
          type: 'PHOTO',
          url: 'https://images.unsplash.com/photo-1587293852726-70cdb56c2866?auto=format&fit=crop&w=800&q=80',
          caption: 'Bay 4-8 Dock Apron Layout & Wheel Chock stations',
          category: 'LOADING_BAY',
          uploadedAt: '2026-08-12T10:05:00Z',
          uploadedBy: 'Dave Henderson (Safety Director)'
        }
      ]
    },
    driverSection: {
      realTimeAlerts: [
        'Bay 3 dock seal rubber torn - use Bay 4 or 5',
        'Pothole filled with gravel near security exit barrier'
      ],
      observations: [
        {
          id: 'obs-1',
          driverName: 'Marcus Vance',
          vehicleReg: 'KX72 WYZ',
          vehicleCategory: '44T_ARTIC_HGV',
          timestamp: '2026-09-13T08:15:00Z',
          groundConditions: 'WET',
          congestionLevel: 'BUSY',
          gateCodeStillValid: true,
          notes:
            'Security guard was fast and helpful. The apron was slippery near bay 6 due to rain, take extra care when swinging 44t trailer.',
          photos: [
            'https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?auto=format&fit=crop&w=600&q=80'
          ],
          aiCategoryTag: 'Ground Traction & Slip Risk',
          status: 'APPROVED_BY_BUSINESS'
        },
        {
          id: 'obs-2',
          driverName: 'Elena Rostova',
          vehicleReg: 'BK24 NPL',
          vehicleCategory: '18T_RIGID',
          timestamp: '2026-09-14T07:45:00Z',
          groundConditions: 'DRY',
          congestionLevel: 'CLEAR',
          gateCodeStillValid: true,
          reportedGateCode: '#8412*',
          notes:
            'Gate keypad numbers 1 and 2 are slightly worn out. Wheel chocks in bay 4 are brand new and easy to place.',
          photos: [],
          aiCategoryTag: 'Access & Equipment Quality',
          status: 'APPROVED_BY_BUSINESS'
        }
      ],
      pendingModifications: [
        {
          id: 'mod-1',
          siteId: 'site-001',
          siteTitle: 'Prologis Park Apex Bay 4',
          driverName: 'Liam O’Connor',
          driverPhone: '+44 7911 234567',
          date: '2026-09-14T06:30:00Z',
          fieldTarget: 'Low Clearance / Overhead Obstruction',
          originalValue: '4.65m unrestricted clearance',
          proposedValue: 'Temporary scaffolding pipe at 4.35m clearance near Bay 2 corner',
          reason: 'Roof repair contractors erected scaffolding yesterday afternoon. Artic box vans over 4.4m risk striking top clamp!',
          evidencePhoto: 'https://images.unsplash.com/photo-1541888946425-d0fbb186c5f6?auto=format&fit=crop&w=600&q=80',
          status: 'PENDING'
        }
      ]
    },
    auditHistory: [
      {
        id: 'aud-1',
        timestamp: '2026-08-12T09:00:00Z',
        user: 'Dave Henderson',
        role: 'Site Safety Director',
        action: 'CREATED_ASSESSMENT',
        details: 'Initial ISO 45001 baseline site assessment published'
      },
      {
        id: 'aud-2',
        timestamp: '2026-09-02T11:20:00Z',
        user: 'Marcus Vance',
        role: 'Driver',
        action: 'DRIVER_OBSERVATION',
        details: 'Added report on Bay 3 dock seal damage and wet apron'
      },
      {
        id: 'aud-3',
        timestamp: '2026-09-02T14:15:00Z',
        user: 'Dave Henderson',
        role: 'Site Safety Director',
        action: 'APPROVED_DRIVER_NOTE',
        details: 'Approved Marcus observation and raised maintenance ticket #4092'
      }
    ]
  },
  {
    id: 'site-002',
    siteType: 'DISTRIBUTION_CENTRE',
    title: 'Metro Central Retail Depot - Narrow Access',
    businessName: 'Urban Superstore Consignment Hub',
    address: '45-49 St John’s Road, Shoreditch, London N1 6EB, UK',
    placeId: 'ChIJdd4hrwug2EcRmSrV3Vo6llI',
    plusCode: '9C3XGWJ9+8F',
    isOfflineCached: true,
    placePhotos: [
      'https://images.unsplash.com/photo-1519003722824-194d4455a60c?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1542282088-72c9c27ed0cd?auto=format&fit=crop&w=800&q=80'
    ],
    coordinates: { lat: 51.5302, lng: -0.0812 },
    what3words: '///metro.urban.shoreditch',
    depotZone: 'Greater London Central Zone',
    createdAt: '2026-08-20T10:00:00Z',
    updatedAt: '2026-09-13T16:00:00Z',
    version: 6,
    overallRiskLevel: 'HIGH',
    overallScore: 18,
    status: 'PENDING_DRIVER_CHANGES',
    businessSection: {
      mandatoryPPE: [
        'Hi-Vis Vest (Orange or Yellow)',
        'Steel Toe Boots S1P',
        'Cut-Resistant Gloves (handling cages)'
      ],
      accessProcedures:
        'Deliveries restricted to vehicles under 12m length. Strict reversing bans between 08:00 and 09:30 AM due to primary school walking route. Must use site banksman before reversing into archway.',
      gateSecurityCode: 'Keypad Code 3910#',
      intercomInstructions: 'Press buzzer marked "GOODS INWARDS" on left pillar. Wait for red light to turn green.',
      operatingHours: {
        open: '06:30',
        close: '19:00',
        days: 'Mon - Sat (No Sunday HGV deliveries)',
        outOfHoursDeliveryPermitted: false
      },
      timeWindowHazards: [
        {
          id: 'twh-3',
          title: 'Primary School Walking Bus & Cycling Congestion',
          timeStart: '08:15',
          timeEnd: '09:15',
          severity: 'HIGH',
          description: 'Hundreds of children and cargo bikes along St Johns Road. Heavy pedestrian risk.',
          affectedParties: 'School pupils, pedestrians, prams'
        },
        {
          id: 'twh-4',
          title: 'London Borough Noise Curfew Penalty Zone',
          timeStart: '20:00',
          timeEnd: '07:00',
          severity: 'HIGH',
          description: 'No tail-lift banging or engine idling. £500 council penalty enforced by acoustic sensors.',
          affectedParties: 'Local residential apartments above store'
        }
      ],
      vehicleConstraints: {
        maxHeightMeters: 3.8,
        maxWeightTonnes: 18.0,
        maxLengthMeters: 10.5,
        tailLiftRequired: true,
        turningCircleConstraint: 'EXTREME_REVERSING_ONLY',
        lowBridgeAlert: 'WARNING: Brick archway entrance is 3.85m nominal clearance. DO NOT ENTER WITH HIGH-CUBE VEHICLES.'
      },
      loadingBayDetails: {
        bayCount: 2,
        dockType: 'TAIL_LIFT_ONLY',
        reversingGuidance:
          'Blind reverse from main road through archway. Mandatory banksman/marshal equipped with whistle and hi-vis to halt roadway traffic.',
        wheelChocksMandatory: true,
        keysHandoverRequired: false
      },
      siteManager: {
        name: 'Sarah Jenkins (Logistics Manager)',
        phone: '+44 7820 445566',
        email: 's.jenkins@metrogoods.co.uk',
        radioChannel: 'Store Intercom Ext 201'
      },
      emergencyMusterPoint: 'St John’s Church Courtyard across street',
      baselineHazards: [
        {
          id: 'haz-4',
          hazard: 'Blind reverse through narrow archway with pedestrian footpath',
          category: 'PEDESTRIAN',
          likelihood: 4,
          severity: 5,
          riskRating: 20,
          riskLevel: 'CRITICAL',
          controlMeasures: [
            'Mandatory site banksman with stop paddle',
            'Hazard warning audible beeper engaged',
            'Max speed 2mph during reverse'
          ]
        },
        {
          id: 'haz-5',
          hazard: 'Low brick archway collision risk',
          category: 'OVERHEAD',
          likelihood: 3,
          severity: 5,
          riskRating: 15,
          riskLevel: 'HIGH',
          controlMeasures: [
            'Physical hanging gauge bar warning at 3.75m',
            'Air suspension must be dumped to lowest ride height'
          ]
        }
      ],
      approachVideoGuide: {
        title: 'Shoreditch St John’s Archway Inbound',
        summary: 'Critical approach and blind-side reversing protocol for tight London retail site.',
        durationSeconds: 80,
        steps: [
          {
            stepNumber: 1,
            heading: 'Turn off Great Eastern St onto St John’s Rd',
            instruction: 'Approach in right hand lane. Beware of protected cycle lane on the nearside.',
            narrationText:
              'Approaching Shoreditch delivery entrance. Watch for cyclists on the near side cycle lane before turning onto Saint John’s Road.',
            checkpointType: 'HIGHWAY_EXIT',
            mockImageUrl: 'https://images.unsplash.com/photo-1513635269975-59663e0ac1ad?auto=format&fit=crop&w=600&q=80'
          },
          {
            stepNumber: 2,
            heading: 'Halt Outside Brick Archway',
            instruction: 'Stop opposite Church. Engage hazard lights. Press intercom or telephone goods inwards.',
            narrationText:
              'Pull up outside the brick archway. Do not attempt to reverse into the arch without a certified banksman present.',
            checkpointType: 'SECURITY_GATE',
            hazardWarning: 'Clearance is 3.8m only. Check roof before entry.',
            mockImageUrl: 'https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?auto=format&fit=crop&w=600&q=80'
          },
          {
            stepNumber: 3,
            heading: 'Marshalled Reverse into Goods In Bay',
            instruction: 'Follow banksman signals exclusively. Lower tail-lift slowly onto rubber cushions.',
            narrationText:
              'Banksman is now in position with traffic paddle. Reverse at walking pace. Apply wheel chocks once in position.',
            checkpointType: 'LOADING_BAY',
            mockImageUrl: 'https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?auto=format&fit=crop&w=600&q=80'
          }
        ]
      },
      media: [
        {
          id: 'med-3',
          type: 'PHOTO',
          url: 'https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?auto=format&fit=crop&w=800&q=80',
          caption: 'St John’s Archway Entrance - 3.8m Clearance Sign',
          category: 'ENTRANCE',
          uploadedAt: '2026-08-20T10:15:00Z',
          uploadedBy: 'Sarah Jenkins'
        }
      ]
    },
    driverSection: {
      realTimeAlerts: [
        'Council utility works on St John’s Rd - single lane controlled by temp traffic lights'
      ],
      observations: [
        {
          id: 'obs-3',
          driverName: 'Gary Miller',
          vehicleReg: 'LP23 XDF',
          vehicleCategory: '7_5T_RIGID',
          timestamp: '2026-09-14T07:15:00Z',
          groundConditions: 'DRY',
          congestionLevel: 'BUSY',
          gateCodeStillValid: true,
          notes:
            'Banksman was ready at 07:15. Water delivery van was parked slightly in the mouth of the alley, needed extra lock on the steering.',
          photos: [],
          aiCategoryTag: 'Obstruction & Turning Radius',
          status: 'APPROVED_BY_BUSINESS'
        }
      ],
      pendingModifications: [
        {
          id: 'mod-2',
          siteId: 'site-002',
          siteTitle: 'Metro Central Retail Depot - Narrow Access',
          driverName: 'Tomasz Kowalski',
          driverPhone: '+44 7799 112233',
          date: '2026-09-14T07:50:00Z',
          fieldTarget: 'Gate Access / Buzzer Code',
          originalValue: 'Keypad Code 3910#',
          proposedValue: 'Code changed to 9204# (Security updated box this morning)',
          reason: 'Attempted 3910# and buzzer failed. Site porter came down and said code was rotated to 9204# at 6am.',
          status: 'PENDING'
        }
      ]
    },
    auditHistory: [
      {
        id: 'aud-4',
        timestamp: '2026-08-20T10:00:00Z',
        user: 'Sarah Jenkins',
        role: 'Logistics Manager',
        action: 'CREATED_ASSESSMENT',
        details: 'Initial site assessment with urban restrictions published'
      }
    ]
  },
  {
    id: 'site-003',
    siteType: 'DEPOT',
    title: 'Manchester Trafford Park Cold Storage Depot',
    businessName: 'Polar Express Cold Chain Logistics',
    address: 'Tenax Road, Trafford Park, Manchester M17 1JT, UK',
    placeId: 'ChIJk7QvQ-yxe0gRoK-4k2wK548',
    plusCode: '9C5VFMXM+7Q',
    isOfflineCached: true,
    placePhotos: [
      'https://images.unsplash.com/photo-1580674684081-7617fbf3d745?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?auto=format&fit=crop&w=800&q=80'
    ],
    coordinates: { lat: 53.4682, lng: -2.3156 },
    what3words: '///frozen.dock.pallets',
    depotZone: 'North West Industrial Zone',
    createdAt: '2026-08-25T11:00:00Z',
    updatedAt: '2026-09-11T12:00:00Z',
    version: 3,
    overallRiskLevel: 'MEDIUM',
    overallScore: 11,
    status: 'APPROVED',
    dynamicRiskIndex: {
      score: 34,
      level: 'LOW',
      ratingScore: 30,
      defectFrequencyScore: 35,
      nearMissScore: 38,
      isHighRiskAlert: false,
      lastCalculatedAt: '2026-09-18T16:00:00Z'
    },
    inductionGatekeeping: {
      isCompleted: true,
      completedAt: '2026-09-19T06:00:00Z',
      completedByDriver: 'Alex Morgan',
      oneWayTrafficAcknowledged: true,
      speedLimitAcknowledged: true,
      mandatoryPPEConfirmed: ['Hi-Vis Class 3 Vest/Jacket', 'Safety Boots', 'Hard Hat'],
      qrToken: 'DP-THAMES-GATEWAY-0012',
      isQrUnlocked: true,
      specialHazardsAcknowledged: ['Container Reach Stacker Zone']
    },
    congestionTracker: {
      queueCount: 2,
      avgTurnaroundMinutes: 30,
      currentWaitMinutes: 0,
      isDemurrageTimerRunning: false,
      demurrageHourlyRate: 45.0,
      estimatedDemurrageClaim: 0
    },
    threeTapAudits: [],
    businessSection: {
      mandatoryPPE: [
        'Hi-Vis Thermal Jacket',
        'Thermal Safety Boots with Grip Tread',
        'Insulated Work Gloves',
        'Thermal Headwear / Balaclava inside Cold Store'
      ],
      accessProcedures:
        'Enter through Inbound Weighbridge on Tenax Road. Weigh in laden. Receive bay allocation slip from weighbridge clerk.',
      gateSecurityCode: 'Automatic ANPR Camera Barrier (License Plate Read)',
      intercomInstructions: 'Weighbridge Intercom button. State Gross Vehicle Weight and refrigeration temp setting.',
      operatingHours: {
        open: '00:00',
        close: '23:59',
        days: '24/7 365 Days Operation',
        outOfHoursDeliveryPermitted: true
      },
      timeWindowHazards: [
        {
          id: 'twh-5',
          title: 'Sub-Zero Icy Ramp Hazards',
          timeStart: '03:00',
          timeEnd: '08:00',
          severity: 'MEDIUM',
          description: 'Condensation runoff from fridge units freezes on loading ramp. Gritting team operates hourly.',
          affectedParties: 'Drivers walking on apron, reversing HGVs'
        }
      ],
      vehicleConstraints: {
        maxHeightMeters: 4.8,
        maxWeightTonnes: 44.0,
        maxLengthMeters: 18.75,
        tailLiftRequired: false,
        turningCircleConstraint: 'EASY',
        lowBridgeAlert: 'Clear route from M60 Junction 9 or 10.'
      },
      loadingBayDetails: {
        bayCount: 16,
        dockType: 'FLUSH_DOCK',
        reversingGuidance:
          'Inflatable dock seals. Reverse until rear rubber buffers make contact with acoustic sensor pad. Green bay light indicates safe dock seal.',
        wheelChocksMandatory: true,
        keysHandoverRequired: true
      },
      siteManager: {
        name: 'Gareth Thorne (Operations Manager)',
        phone: '+44 7711 889900',
        email: 'gareth.t@polarexpress.co.uk',
        radioChannel: 'ColdStore Ch 1'
      },
      emergencyMusterPoint: 'Assembly Point A - Weighbridge Island',
      baselineHazards: [
        {
          id: 'haz-6',
          hazard: 'Sub-zero temperature exposure (-22°C inside cold dock)',
          category: 'ENVIRONMENTAL',
          likelihood: 3,
          severity: 4,
          riskRating: 12,
          riskLevel: 'MEDIUM',
          controlMeasures: [
            'Driver must stay in vehicle cab or warm driver waiting lounge',
            'Full thermal PPE required if entering warehouse'
          ]
        },
        {
          id: 'haz-7',
          hazard: 'Diesel fridge unit exhaust fumes in enclosed dock bay',
          category: 'ENVIRONMENTAL',
          likelihood: 2,
          severity: 4,
          riskRating: 8,
          riskLevel: 'LOW',
          controlMeasures: [
            'Switch diesel fridge unit to 3-phase electric standby hookup within 5 mins of dock arrival'
          ]
        }
      ],
      approachVideoGuide: {
        title: 'Tenax Road Inbound to Cold Store Bay',
        summary: 'Weighbridge entry, refrigeration hookup, and inflatable dock procedure.',
        durationSeconds: 90,
        steps: [
          {
            stepNumber: 1,
            heading: 'Tenax Road Inbound Gate',
            instruction: 'Drive onto Weighbridge 1. Camera reads front plate automatically.',
            narrationText:
              'Entering Polar Express Cold Store. Drive slowly onto weighbridge number one. ANPR cameras will log your plate.',
            checkpointType: 'WEIGHBRIDGE',
            mockImageUrl: 'https://images.unsplash.com/photo-1542282088-72c9c27ed0cd?auto=format&fit=crop&w=600&q=80'
          },
          {
            stepNumber: 2,
            heading: 'Dock Bay 10 Reversing',
            instruction: 'Align with guide mirrors. Inflatable seal automatically seals trailer perimeter.',
            narrationText:
              'Reverse into Bay 10. Wait for the green light on the bay gantry before switching off engine. Connect 3-phase electric standby lead.',
            checkpointType: 'LOADING_BAY',
            hazardWarning: 'Watch for condensation moisture on concrete ramp.',
            mockImageUrl: 'https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?auto=format&fit=crop&w=600&q=80'
          }
        ]
      },
      media: [
        {
          id: 'med-4',
          type: 'PHOTO',
          url: 'https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?auto=format&fit=crop&w=800&q=80',
          caption: 'Weighbridge 1 & Automated ANPR Barrier',
          category: 'ENTRANCE',
          uploadedAt: '2026-08-25T11:15:00Z',
          uploadedBy: 'Gareth Thorne'
        }
      ]
    },
    driverSection: {
      realTimeAlerts: [
        'Electric standby socket at Bay 12 undergoing maintenance'
      ],
      observations: [
        {
          id: 'obs-4',
          driverName: 'Robert Campbell',
          vehicleReg: 'SN71 HJU',
          vehicleCategory: '44T_ARTIC_HGV',
          timestamp: '2026-09-13T22:30:00Z',
          groundConditions: 'DRY',
          congestionLevel: 'CLEAR',
          gateCodeStillValid: true,
          notes:
            'Fast turnaround. Driver rest room has fresh hot drinks and clean toilets. Weighbridge attendant was top class.',
          photos: [],
          aiCategoryTag: 'Driver Welfare & Facilities',
          status: 'APPROVED_BY_BUSINESS'
        }
      ],
      pendingModifications: []
    },
    auditHistory: [
      {
        id: 'aud-5',
        timestamp: '2026-08-25T11:00:00Z',
        user: 'Gareth Thorne',
        role: 'Operations Manager',
        action: 'CREATED_ASSESSMENT',
        details: 'Cold store 24/7 operating procedure assessment logged'
      }
    ]
  },
  ...INITIAL_MOTORWAY_SERVICES
];

export const INITIAL_MANAGERS: SiteManagerUser[] = [
  {
    id: 'mgr-1',
    name: 'Dave Henderson',
    email: 'dave.henderson@prologis-apex.co.uk',
    role: 'SITE_MANAGER',
    assignedSites: ['site-001'],
    phone: '+44 7700 900142',
    status: 'ACTIVE'
  },
  {
    id: 'mgr-2',
    name: 'Sarah Jenkins',
    email: 's.jenkins@metrogoods.co.uk',
    role: 'SITE_MANAGER',
    assignedSites: ['site-002'],
    phone: '+44 7820 445566',
    status: 'ACTIVE'
  },
  {
    id: 'mgr-3',
    name: 'Gareth Thorne',
    email: 'gareth.t@polarexpress.co.uk',
    role: 'SITE_MANAGER',
    assignedSites: ['site-003'],
    phone: '+44 7711 889900',
    status: 'ACTIVE'
  },
  {
    id: 'mgr-4',
    name: 'Alexandra Vance (Fleet Director)',
    email: 'alex.vance@nationalfleet.com',
    role: 'BUSINESS_ADMIN',
    assignedSites: ['site-001', 'site-002', 'site-003'],
    phone: '+44 7900 123456',
    status: 'ACTIVE'
  }
];

export const INITIAL_SUBSCRIPTION: SubscriptionInfo = {
  tier: 'FLEET_PRO',
  status: 'ACTIVE',
  billingCycle: 'monthly',
  monthlyPrice: 79,
  sitesAllowed: 25,
  sitesUsed: 3,
  driversAllowed: 150,
  aiAuditsRemaining: 84,
  renewalDate: '2026-10-15'
};
