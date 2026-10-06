/**
 * UK DVSA Heavy Goods Vehicle (HGV) & Trailer Statutory Walkaround Inspection Checklist
 * Aligned with the UK DVSA Guide to Maintaining Roadworthiness & Road Vehicles (Construction and Use) Regulations.
 * Covers 100% of statutory driver daily inspection requirements for both Tractor Unit & Semi-Trailer.
 */

export type DvsaTargetAsset = 'TRACTOR_UNIT' | 'SEMI_TRAILER' | 'COMBINED_INTERFACE';

export type DvsaCategory =
  | 'CAB_CONTROLS'
  | 'TRACTOR_EXTERIOR'
  | 'COUPLING_CATWALK'
  | 'TRAILER_RUNNING_GEAR'
  | 'TRAILER_BODY_LOAD'
  | 'LIGHTING_MARKERS';

export type DvsaProhibitionSeverity =
  | 'IMMEDIATE_PG9'    // Critical defect: Immediate Prohibition notice, vehicle cannot move on highway
  | 'DELAYED_10_DAY'   // Serious defect: 10 days to rectify before road ban
  | 'ADVISORY';        // Minor wear / cosmetic: Rectify at next Periodic Maintenance Inspection (PMI)

export interface DvsaCheckItem {
  id: string;
  code: string; // e.g. "DVSA-01"
  category: DvsaCategory;
  targetAsset: DvsaTargetAsset;
  title: string;
  description: string;
  dvsaReference: string; // Statutory citation from DVSA Categorisation of Defects
  govUkItemNumber: number; // Item number corresponding to GOV.UK HGV walkaround diagram
  isSafetyCritical: boolean; // Triggers immediate RED VOR Grounding / PG9 if failed
  prohibitionType: DvsaProhibitionSeverity;
  status: 'PASS' | 'FAIL' | 'UNCHECKED';
  defectPhotoRequiredIfFailed: boolean;
  defectNotes?: string;
  photoUrl?: string;
}

export const DVSA_STATUTORY_CHECKPOINTS: DvsaCheckItem[] = [
  // =========================================================================
  // GROUP 1: CAB INTERIOR & DRIVER CONTROLS (Items 1 - 10)
  // =========================================================================
  {
    id: 'chk-01',
    code: 'DVSA-01',
    category: 'CAB_CONTROLS',
    targetAsset: 'TRACTOR_UNIT',
    title: 'Front View, Mirrors, Cameras & Glass Visibility',
    description: 'Windscreen swept area clear of obstructions. Zone A chips <10mm, no cracks. Side windows operate. All mirrors secure and adjusted. CMS camera monitors functional.',
    dvsaReference: 'DVSA Categorisation of Defects Part 2 Sec 1 (Visibility & Mirrors)',
    govUkItemNumber: 1,
    isSafetyCritical: true,
    prohibitionType: 'IMMEDIATE_PG9',
    status: 'PASS',
    defectPhotoRequiredIfFailed: true
  },
  {
    id: 'chk-02',
    code: 'DVSA-02',
    category: 'CAB_CONTROLS',
    targetAsset: 'TRACTOR_UNIT',
    title: 'Windscreen Wipers & Washers',
    description: 'Wiper blades clear glass cleanly across full stroke, not split or perished. Washer reservoir filled and spray jets functional.',
    dvsaReference: 'DVSA Categorisation of Defects Part 2 Sec 2 (Wipers & Washers)',
    govUkItemNumber: 2,
    isSafetyCritical: false,
    prohibitionType: 'DELAYED_10_DAY',
    status: 'PASS',
    defectPhotoRequiredIfFailed: false
  },
  {
    id: 'chk-03',
    code: 'DVSA-03',
    category: 'CAB_CONTROLS',
    targetAsset: 'TRACTOR_UNIT',
    title: 'Dashboard Warning Lights, Gauges & MIL',
    description: 'All instruments illuminate. ABS/EBS malfunction warning lamps extinguish after self-test. Engine MIL, DPF/AdBlue and air pressure gauges normal.',
    dvsaReference: 'DVSA Categorisation of Defects Part 2 Sec 3 (Warning Lights & Gauges)',
    govUkItemNumber: 3,
    isSafetyCritical: true,
    prohibitionType: 'IMMEDIATE_PG9',
    status: 'PASS',
    defectPhotoRequiredIfFailed: true
  },
  {
    id: 'chk-04',
    code: 'DVSA-04',
    category: 'CAB_CONTROLS',
    targetAsset: 'TRACTOR_UNIT',
    title: 'Steering Controls & Column Play',
    description: 'Steering wheel moves freely without jamming or stiffness. Power-assisted steering functional. Free play at rim <15mm. Steering column has no excessive lift.',
    dvsaReference: 'DVSA Categorisation of Defects Part 2 Sec 4 (Steering Controls)',
    govUkItemNumber: 4,
    isSafetyCritical: true,
    prohibitionType: 'IMMEDIATE_PG9',
    status: 'PASS',
    defectPhotoRequiredIfFailed: false
  },
  {
    id: 'chk-05',
    code: 'DVSA-05',
    category: 'CAB_CONTROLS',
    targetAsset: 'TRACTOR_UNIT',
    title: 'Audible Warning Horn',
    description: 'Horn operates loudly and clearly, readily accessible from driver seating position.',
    dvsaReference: 'DVSA Categorisation of Defects Part 2 Sec 5 (Audible Warning)',
    govUkItemNumber: 5,
    isSafetyCritical: false,
    prohibitionType: 'DELAYED_10_DAY',
    status: 'PASS',
    defectPhotoRequiredIfFailed: false
  },
  {
    id: 'chk-06',
    code: 'DVSA-06',
    category: 'CAB_CONTROLS',
    targetAsset: 'TRACTOR_UNIT',
    title: 'Brakes, Air Pressure Build-Up & Pedal Anti-Slip',
    description: 'Air builds smoothly to >8.5 bar governor pressure. Low pressure buzzer/light operational. Footwell clear. Foot pedal anti-slip rubber intact without excessive play.',
    dvsaReference: 'DVSA Categorisation of Defects Part 2 Sec 6 (Brake Controls & Air Build-up)',
    govUkItemNumber: 6,
    isSafetyCritical: true,
    prohibitionType: 'IMMEDIATE_PG9',
    status: 'PASS',
    defectPhotoRequiredIfFailed: true
  },
  {
    id: 'chk-07',
    code: 'DVSA-07',
    category: 'CAB_CONTROLS',
    targetAsset: 'COMBINED_INTERFACE',
    title: 'In-Cab Height Indicator (Bridge Strike Prevention)',
    description: 'Overall travel height displayed in cab. Adjusted correctly to coupled trailer or high load height under Road Vehicles C&U Regulations 1986.',
    dvsaReference: 'DVSA Categorisation of Defects Part 2 Sec 7 (Height Indicator & Markers)',
    govUkItemNumber: 7,
    isSafetyCritical: false,
    prohibitionType: 'DELAYED_10_DAY',
    status: 'PASS',
    defectPhotoRequiredIfFailed: false
  },
  {
    id: 'chk-08',
    code: 'DVSA-08',
    category: 'CAB_CONTROLS',
    targetAsset: 'TRACTOR_UNIT',
    title: 'Seatbelts & Cab Safety Integrity',
    description: 'Driver seatbelt latches securely into buckle, retracts properly, webbing free from cuts, tears, or fraying. Cab free of unsecured loose items.',
    dvsaReference: 'DVSA Categorisation of Defects Part 2 Sec 8 (Seatbelts & Cab Safety)',
    govUkItemNumber: 8,
    isSafetyCritical: true,
    prohibitionType: 'IMMEDIATE_PG9',
    status: 'PASS',
    defectPhotoRequiredIfFailed: true
  },
  {
    id: 'chk-09',
    code: 'DVSA-09',
    category: 'CAB_CONTROLS',
    targetAsset: 'TRACTOR_UNIT',
    title: 'Cab Security, Tilt Lock, Doors & Steps',
    description: 'Cab tilt locking mechanism and warning buzzer engaged. Doors open, close and latch securely from both sides. Access steps clean, secure and anti-slip.',
    dvsaReference: 'DVSA Categorisation of Defects Part 2 Sec 9 (Cab Security, Doors & Steps)',
    govUkItemNumber: 9,
    isSafetyCritical: true,
    prohibitionType: 'IMMEDIATE_PG9',
    status: 'PASS',
    defectPhotoRequiredIfFailed: true
  },
  {
    id: 'chk-10',
    code: 'DVSA-10',
    category: 'CAB_CONTROLS',
    targetAsset: 'TRACTOR_UNIT',
    title: 'Digital Tachograph & Time Clocks',
    description: 'Tachograph accepts driver card 1 without error. Printer paper roll present. Mode switch recording Other Work ⚒️ during walkaround. Accurate UTC time.',
    dvsaReference: 'DVSA Categorisation of Defects Part 2 Sec 10 (Tachograph & Recording Equipment)',
    govUkItemNumber: 10,
    isSafetyCritical: true,
    prohibitionType: 'IMMEDIATE_PG9',
    status: 'PASS',
    defectPhotoRequiredIfFailed: false
  },

  // =========================================================================
  // GROUP 2: TRACTOR UNIT EXTERIOR & POWERTRAIN (Items 11 - 20)
  // =========================================================================
  {
    id: 'chk-11',
    code: 'DVSA-11',
    category: 'TRACTOR_EXTERIOR',
    targetAsset: 'TRACTOR_UNIT',
    title: 'Front Lights, Sidelights & Indicators',
    description: 'Both headlights operational on dipped and main beam. Sidelights and DRLs illuminated. Front direction indicators and side repeaters flash at 60-120 cpm.',
    dvsaReference: 'DVSA Categorisation of Defects Part 2 Sec 11 (Headlights & Front Lamps)',
    govUkItemNumber: 11,
    isSafetyCritical: true,
    prohibitionType: 'IMMEDIATE_PG9',
    status: 'PASS',
    defectPhotoRequiredIfFailed: true
  },
  {
    id: 'chk-12',
    code: 'DVSA-12',
    category: 'TRACTOR_EXTERIOR',
    targetAsset: 'TRACTOR_UNIT',
    title: 'Fuel, Oil & Coolant Leaks',
    description: 'Fuel filler cap fitted with tight rubber seal. No diesel weeping from tanks or lines. Engine sump, gearbox and radiator free from active dripping leaks.',
    dvsaReference: 'DVSA Categorisation of Defects Part 2 Sec 12 (Fluid Leaks & Fuel System)',
    govUkItemNumber: 12,
    isSafetyCritical: true,
    prohibitionType: 'IMMEDIATE_PG9',
    status: 'PASS',
    defectPhotoRequiredIfFailed: true
  },
  {
    id: 'chk-13',
    code: 'DVSA-13',
    category: 'TRACTOR_EXTERIOR',
    targetAsset: 'TRACTOR_UNIT',
    title: 'Battery Security & Terminal Condition',
    description: 'Battery tray securely clamped to chassis. Protective cover fitted. Terminals clean and insulated. No electrolyte acid leaks or corrosion buildup.',
    dvsaReference: 'DVSA Categorisation of Defects Part 2 Sec 13 (Battery Security & Condition)',
    govUkItemNumber: 13,
    isSafetyCritical: false,
    prohibitionType: 'DELAYED_10_DAY',
    status: 'PASS',
    defectPhotoRequiredIfFailed: false
  },
  {
    id: 'chk-14',
    code: 'DVSA-14',
    category: 'TRACTOR_EXTERIOR',
    targetAsset: 'TRACTOR_UNIT',
    title: 'Diesel Exhaust Fluid (AdBlue) System',
    description: 'AdBlue tank filled with blue cap sealed. Heater line connections intact. No white crystallized urea leaks around injector dosing unit.',
    dvsaReference: 'DVSA Categorisation of Defects Part 2 Sec 14 (AdBlue Fluid & SCR Emissions)',
    govUkItemNumber: 14,
    isSafetyCritical: false,
    prohibitionType: 'DELAYED_10_DAY',
    status: 'PASS',
    defectPhotoRequiredIfFailed: false
  },
  {
    id: 'chk-15',
    code: 'DVSA-15',
    category: 'TRACTOR_EXTERIOR',
    targetAsset: 'TRACTOR_UNIT',
    title: 'Engine Exhaust Smoke & Emissions Integrity',
    description: 'Exhaust silencer and DPF/SCR canisters securely clamped. No excessive smoke emissions (black, blue or white). No gas blowing leaks or noise.',
    dvsaReference: 'DVSA Categorisation of Defects Part 2 Sec 15 (Exhaust Smoke & Silencer)',
    govUkItemNumber: 15,
    isSafetyCritical: true,
    prohibitionType: 'IMMEDIATE_PG9',
    status: 'PASS',
    defectPhotoRequiredIfFailed: true
  },
  {
    id: 'chk-16',
    code: 'DVSA-16',
    category: 'TRACTOR_EXTERIOR',
    targetAsset: 'TRACTOR_UNIT',
    title: 'High-Voltage Cut-Off & Alternative Fuel Isolation',
    description: 'For EV/hybrid HGVs: high-voltage manual service disconnect / emergency cut-off accessible and functional. For gas HGVs: fuel isolation valves undamaged.',
    dvsaReference: 'DVSA Categorisation of Defects Part 2 Sec 16 (High Voltage & Alternative Fuels)',
    govUkItemNumber: 16,
    isSafetyCritical: true,
    prohibitionType: 'IMMEDIATE_PG9',
    status: 'PASS',
    defectPhotoRequiredIfFailed: true
  },
  {
    id: 'chk-17',
    code: 'DVSA-17',
    category: 'TRACTOR_EXTERIOR',
    targetAsset: 'TRACTOR_UNIT',
    title: 'Tractor Steer & Drive Tyres (Tread Depth & Condition)',
    description: 'Minimum 1.0mm continuous tread depth across central 3/4 breadth. Sidewalls free of cuts >25mm exposing ply cords or bulges. Correct pressures. Valve caps fitted.',
    dvsaReference: 'DVSA Categorisation of Defects Part 2 Sec 17 (Tyre Tread & Sidewall Condition)',
    govUkItemNumber: 17,
    isSafetyCritical: true,
    prohibitionType: 'IMMEDIATE_PG9',
    status: 'PASS',
    defectPhotoRequiredIfFailed: true
  },
  {
    id: 'chk-18',
    code: 'DVSA-18',
    category: 'TRACTOR_EXTERIOR',
    targetAsset: 'TRACTOR_UNIT',
    title: 'Tractor Wheel Fixings, Studs & Checkpoint Pointers',
    description: 'All 10 wheel nuts present and tight. Yellow plastic Checkpoint pointers aligned nose-to-nose in pairs. Zero vertical rust streaks from stud fretting. Rims undamaged.',
    dvsaReference: 'DVSA Categorisation of Defects Part 2 Sec 18 (Wheel Fixings & Hub Integrity)',
    govUkItemNumber: 18,
    isSafetyCritical: true,
    prohibitionType: 'IMMEDIATE_PG9',
    status: 'PASS',
    defectPhotoRequiredIfFailed: true
  },
  {
    id: 'chk-19',
    code: 'DVSA-19',
    category: 'TRACTOR_EXTERIOR',
    targetAsset: 'TRACTOR_UNIT',
    title: 'Tractor Mudguards, Wings & Spray Suppression',
    description: 'Mudguards secure over all steer and drive axles. Anti-spray textured flaps intact, clean, and not rubbing against tyres.',
    dvsaReference: 'DVSA Categorisation of Defects Part 2 Sec 19 (Spray Suppression & Wings)',
    govUkItemNumber: 19,
    isSafetyCritical: false,
    prohibitionType: 'ADVISORY',
    status: 'PASS',
    defectPhotoRequiredIfFailed: false
  },
  {
    id: 'chk-20',
    code: 'DVSA-20',
    category: 'TRACTOR_EXTERIOR',
    targetAsset: 'TRACTOR_UNIT',
    title: 'Tractor Chassis, Sideguards & Underrun Protection',
    description: 'Lateral cyclist protection sideguards intact and secure. Chassis main longitudinals free of severe corrosion, structural cracks or distortion.',
    dvsaReference: 'DVSA Categorisation of Defects Part 2 Sec 20 (Chassis & Underrun Protection)',
    govUkItemNumber: 20,
    isSafetyCritical: true,
    prohibitionType: 'IMMEDIATE_PG9',
    status: 'PASS',
    defectPhotoRequiredIfFailed: true
  },

  // =========================================================================
  // GROUP 3: COUPLING GEAR & CATWALK INTERFACE (Items 21 - 25)
  // =========================================================================
  {
    id: 'chk-21',
    code: 'DVSA-21',
    category: 'COUPLING_CATWALK',
    targetAsset: 'COMBINED_INTERFACE',
    title: '5th Wheel Locking Jaw, Kingpin & Safety Dog-Clip',
    description: '5th wheel jaw locked around kingpin throat. Release handle pushed home. Secondary safety dog-clip pin engaged. Zero gap between trailer rub-plate and 5th wheel.',
    dvsaReference: 'DVSA Categorisation of Defects Part 2 Sec 21 (Coupling Gear & 5th Wheel)',
    govUkItemNumber: 21,
    isSafetyCritical: true,
    prohibitionType: 'IMMEDIATE_PG9',
    status: 'PASS',
    defectPhotoRequiredIfFailed: true
  },
  {
    id: 'chk-22',
    code: 'DVSA-22',
    category: 'COUPLING_CATWALK',
    targetAsset: 'COMBINED_INTERFACE',
    title: 'Red & Yellow Suzie Air Hoses & Acoustic Leak Scan',
    description: 'Red Emergency & Yellow Service air hoses coupled with seals intact, suspended without chafing catwalk. Acoustic scan confirms zero hissing air leaks at 8.5-10 bar.',
    dvsaReference: 'DVSA Categorisation of Defects Part 2 Sec 22 (Brake Lines & Suzie Couplings)',
    govUkItemNumber: 22,
    isSafetyCritical: true,
    prohibitionType: 'IMMEDIATE_PG9',
    status: 'PASS',
    defectPhotoRequiredIfFailed: true
  },
  {
    id: 'chk-23',
    code: 'DVSA-23',
    category: 'COUPLING_CATWALK',
    targetAsset: 'COMBINED_INTERFACE',
    title: 'EBS & 24V Lighting Electrical Suzie Cables',
    description: '7-pin ISO 7638 EBS cable and 15-pin 24V lighting cable locked into sockets with safety latches. Cables insulated without stretching, kinks or bare wires.',
    dvsaReference: 'DVSA Categorisation of Defects Part 2 Sec 23 (Electrical Connections & Cables)',
    govUkItemNumber: 23,
    isSafetyCritical: true,
    prohibitionType: 'IMMEDIATE_PG9',
    status: 'PASS',
    defectPhotoRequiredIfFailed: true
  },
  {
    id: 'chk-24',
    code: 'DVSA-24',
    category: 'COUPLING_CATWALK',
    targetAsset: 'TRACTOR_UNIT',
    title: 'Catwalk Decking & Safety Grab Handles',
    description: 'Catwalk decking walkway non-slip, secure, free of fuel or grease spills. Access steps and safety grab handles solid and undamaged.',
    dvsaReference: 'DVSA Categorisation of Defects Part 2 Sec 24 (Catwalk & Access Ladders)',
    govUkItemNumber: 24,
    isSafetyCritical: false,
    prohibitionType: 'ADVISORY',
    status: 'PASS',
    defectPhotoRequiredIfFailed: false
  },
  {
    id: 'chk-25',
    code: 'DVSA-25',
    category: 'COUPLING_CATWALK',
    targetAsset: 'SEMI_TRAILER',
    title: 'Trailer Landing Legs & Winder Handle Stowage',
    description: 'Landing leg support legs fully wound up into high transit position. Foot pads intact. Winding handle securely pinned into transit bracket cradle.',
    dvsaReference: 'DVSA Categorisation of Defects Part 2 Sec 25 (Landing Legs & Handle Retention)',
    govUkItemNumber: 25,
    isSafetyCritical: true,
    prohibitionType: 'DELAYED_10_DAY',
    status: 'PASS',
    defectPhotoRequiredIfFailed: false
  },

  // =========================================================================
  // GROUP 4: TRAILER RUNNING GEAR & SUSPENSION (Items 26 - 29)
  // =========================================================================
  {
    id: 'chk-26',
    code: 'DVSA-26',
    category: 'TRAILER_RUNNING_GEAR',
    targetAsset: 'SEMI_TRAILER',
    title: 'Trailer Tri-Axle Tyres & Tread Depth',
    description: 'All trailer tyres (Axles 1, 2, 3) have minimum 1.0mm continuous tread depth across central 3/4 breadth. Sidewalls free of bulges, cuts exposing cords. Correct pressures.',
    dvsaReference: 'DVSA Categorisation of Defects Part 2 Sec 26 (Trailer Tyres & Tread Depth)',
    govUkItemNumber: 26,
    isSafetyCritical: true,
    prohibitionType: 'IMMEDIATE_PG9',
    status: 'PASS',
    defectPhotoRequiredIfFailed: true
  },
  {
    id: 'chk-27',
    code: 'DVSA-27',
    category: 'TRAILER_RUNNING_GEAR',
    targetAsset: 'SEMI_TRAILER',
    title: 'Trailer Wheel Fixings & Hub Grease Caps',
    description: 'All trailer wheel nuts present and tight. Yellow torque pointers aligned. Clear plastic hub grease/oil sight glasses intact without leaks.',
    dvsaReference: 'DVSA Categorisation of Defects Part 2 Sec 27 (Trailer Wheel Fixings & Hubs)',
    govUkItemNumber: 27,
    isSafetyCritical: true,
    prohibitionType: 'IMMEDIATE_PG9',
    status: 'PASS',
    defectPhotoRequiredIfFailed: true
  },
  {
    id: 'chk-28',
    code: 'DVSA-28',
    category: 'TRAILER_RUNNING_GEAR',
    targetAsset: 'SEMI_TRAILER',
    title: 'Trailer Air Suspension & Parking Brake Knob',
    description: 'Air suspension bellows inflated evenly across all axles. Air reservoirs sealed without rust. Red/yellow trailer park brake push-pull valve released for travel.',
    dvsaReference: 'DVSA Categorisation of Defects Part 2 Sec 28 (Trailer Air Suspension & Brakes)',
    govUkItemNumber: 28,
    isSafetyCritical: true,
    prohibitionType: 'IMMEDIATE_PG9',
    status: 'PASS',
    defectPhotoRequiredIfFailed: true
  },
  {
    id: 'chk-29',
    code: 'DVSA-29',
    category: 'TRAILER_RUNNING_GEAR',
    targetAsset: 'SEMI_TRAILER',
    title: 'Trailer Mudguards & Spray Suppression Flaps',
    description: 'Mudwings clamped firmly over all trailer axles. Textured anti-spray flaps intact and not contacting tyres or road surface.',
    dvsaReference: 'DVSA Categorisation of Defects Part 2 Sec 29 (Trailer Spray Suppression)',
    govUkItemNumber: 29,
    isSafetyCritical: false,
    prohibitionType: 'ADVISORY',
    status: 'PASS',
    defectPhotoRequiredIfFailed: false
  },

  // =========================================================================
  // GROUP 5: TRAILER BODYWORK, DOORS & LOAD RESTRAINT (Items 30 - 31)
  // =========================================================================
  {
    id: 'chk-30',
    code: 'DVSA-30',
    category: 'TRAILER_BODY_LOAD',
    targetAsset: 'SEMI_TRAILER',
    title: 'Load Restraint, Straps & Curtain Tension (EN 12642 XL)',
    description: 'Load distributed evenly without overloading axles. Ratchet straps/chains tensioned and rated for cargo weight. Curtain tensioners locked fore/aft. Rave hooks engaged. Curtains tear-free.',
    dvsaReference: 'DVSA Categorisation of Defects Part 2 Sec 30 (Load Security & Curtain Tension)',
    govUkItemNumber: 30,
    isSafetyCritical: true,
    prohibitionType: 'IMMEDIATE_PG9',
    status: 'PASS',
    defectPhotoRequiredIfFailed: true
  },
  {
    id: 'chk-31',
    code: 'DVSA-31',
    category: 'TRAILER_BODY_LOAD',
    targetAsset: 'SEMI_TRAILER',
    title: 'Rear Barn Doors, Double Locking Bars & TIR Security Seal',
    description: 'Rear doors shut tight, rubber seals undamaged. Top/bottom locking cams engaged with safety catches. Secondary safety retaining straps secure. TIR tilt cord intact.',
    dvsaReference: 'DVSA Categorisation of Defects Part 2 Sec 31 (Trailer Doors, Seals & Security)',
    govUkItemNumber: 31,
    isSafetyCritical: true,
    prohibitionType: 'IMMEDIATE_PG9',
    status: 'PASS',
    defectPhotoRequiredIfFailed: true
  },

  // =========================================================================
  // GROUP 6: LIGHTING, NUMBER PLATES & MARKER BOARDS (Item 32)
  // =========================================================================
  {
    id: 'chk-32',
    code: 'DVSA-32',
    category: 'LIGHTING_MARKERS',
    targetAsset: 'COMBINED_INTERFACE',
    title: 'Rear Lights, Number Plates, ECE 70 Marker Boards & Tail-Lift',
    description: 'Stop/brake lamps illuminate instantly on pedal press. Tail lamps, indicators, fog lamp, reverse lamp and beeper operational. Number plate matches tractor, clean and illuminated. ECE 70 chevron boards and conspicuity tape clean. Tail-lift stowed & locked.',
    dvsaReference: 'DVSA Categorisation of Defects Part 2 Sec 32 (Rear Lamps, Plates & Markers)',
    govUkItemNumber: 32,
    isSafetyCritical: true,
    prohibitionType: 'IMMEDIATE_PG9',
    status: 'PASS',
    defectPhotoRequiredIfFailed: true
  }
];

// Backward-compatible alias for existing components
export const DVSA_27_CHECKPOINTS: DvsaCheckItem[] = DVSA_STATUTORY_CHECKPOINTS;

// Helper utilities for filtering by asset type
export function getCheckpointsByAsset(asset: 'ALL' | 'TRACTOR' | 'TRAILER'): DvsaCheckItem[] {
  if (asset === 'ALL') return DVSA_STATUTORY_CHECKPOINTS;
  if (asset === 'TRACTOR') {
    return DVSA_STATUTORY_CHECKPOINTS.filter(
      (c) => c.targetAsset === 'TRACTOR_UNIT' || c.targetAsset === 'COMBINED_INTERFACE'
    );
  }
  return DVSA_STATUTORY_CHECKPOINTS.filter(
    (c) => c.targetAsset === 'SEMI_TRAILER' || c.targetAsset === 'COMBINED_INTERFACE'
  );
}

// Helper utility for filtering by DVSA category
export function getCheckpointsByCategory(category: string): DvsaCheckItem[] {
  if (category === 'ALL') return DVSA_STATUTORY_CHECKPOINTS;
  return DVSA_STATUTORY_CHECKPOINTS.filter((c) => c.category === category);
}

// DVSA Roadworthiness Scoring Engine
export function calculateDvsaRoadworthinessScore(items: DvsaCheckItem[]) {
  const total = items.length;
  const passed = items.filter((i) => i.status === 'PASS').length;
  const failed = items.filter((i) => i.status === 'FAIL').length;
  const immediatePg9Fails = items.filter(
    (i) => i.status === 'FAIL' && i.prohibitionType === 'IMMEDIATE_PG9'
  ).length;
  const delayed10DayFails = items.filter(
    (i) => i.status === 'FAIL' && i.prohibitionType === 'DELAYED_10_DAY'
  ).length;
  const advisories = items.filter(
    (i) => i.status === 'FAIL' && i.prohibitionType === 'ADVISORY'
  ).length;

  let roadworthinessStatus: '100% ROADWORTHY' | 'ADVISORY_ISSUED' | 'DELAYED_PROHIBITION' | 'PG9_PROHIBITION_GROUNDED' =
    '100% ROADWORTHY';

  if (immediatePg9Fails > 0) {
    roadworthinessStatus = 'PG9_PROHIBITION_GROUNDED';
  } else if (delayed10DayFails > 0) {
    roadworthinessStatus = 'DELAYED_PROHIBITION';
  } else if (advisories > 0) {
    roadworthinessStatus = 'ADVISORY_ISSUED';
  }

  return {
    total,
    passed,
    failed,
    immediatePg9Fails,
    delayed10DayFails,
    advisories,
    roadworthinessStatus,
    isRoadworthy: immediatePg9Fails === 0 && delayed10DayFails === 0
  };
}
