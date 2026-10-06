/**
 * Drive Partners 2.0 & ReliefHGV - Freight Exchange & Cascading Tendering Dataset
 * Phase 2: Feature 1 (Cascading Load Tendering Engine) & Feature 4 (Multi-Leg Cross Dock)
 */

export interface FreightLoadItem {
  id: string;
  loadNumber: string;
  shipperName: string;
  originHub: string;
  originPostcode: string;
  destinationHub: string;
  destinationPostcode: string;
  pickupWindow: string;
  deliveryWindow: string;
  distanceMiles: number;
  weightTonnes: number;
  palletCount: number;
  requiredTrailerType: string;
  baseRateGbp: number;
  currentRateGbp: number;
  tierLevel: 1 | 2 | 3;
  tierLabel: 'TIER 1 (Private Fleet)' | 'TIER 2 (Preferred Hauliers)' | 'TIER 3 (Open Spot Exchange)';
  minutesUntilNextTier: number;
  isCrossDockMultiLeg: boolean;
  hubTransferLocation?: string;
  isHazmat: boolean;
  status: 'OPEN_TENDER' | 'BID_SUBMITTED' | 'BOOKED_CONFIRMED' | 'IN_TRANSIT';
  deadheadSavingsCo2Kg: number;
}

export const MOCK_FREIGHT_LOADS: FreightLoadItem[] = [
  {
    id: 'ld-801',
    loadNumber: 'FL-2026-8801',
    shipperName: 'Unilever Logistics Gateway',
    originHub: 'Burton-on-Trent DC',
    originPostcode: 'DE14 2WW',
    destinationHub: 'Eurocentral MegaHub (Scotland)',
    destinationPostcode: 'ML1 4WQ',
    pickupWindow: 'Today 21:30 - 22:30',
    deliveryWindow: 'Tomorrow 05:00 - 06:30',
    distanceMiles: 278,
    weightTonnes: 24.5,
    palletCount: 26,
    requiredTrailerType: '44t Curtain / Tail-lift',
    baseRateGbp: 720.00,
    currentRateGbp: 785.00,
    tierLevel: 1,
    tierLabel: 'TIER 1 (Private Fleet)',
    minutesUntilNextTier: 14,
    isCrossDockMultiLeg: true,
    hubTransferLocation: 'Carlisle Cross-Dock Hub',
    isHazmat: false,
    status: 'OPEN_TENDER',
    deadheadSavingsCo2Kg: 84.2
  },
  {
    id: 'ld-802',
    loadNumber: 'FL-2026-8802',
    shipperName: 'Tesco Central Distribution',
    originHub: 'DIRFT Daventry (A428)',
    originPostcode: 'NN6 7GZ',
    destinationHub: 'Tesco Avonmouth RDC',
    destinationPostcode: 'BS11 9FG',
    pickupWindow: 'Tonight 22:00 - 23:00',
    deliveryWindow: 'Tomorrow 02:30 - 03:30',
    distanceMiles: 112,
    weightTonnes: 21.0,
    palletCount: 24,
    requiredTrailerType: '44t Dual-Temp Fridge',
    baseRateGbp: 380.00,
    currentRateGbp: 415.00,
    tierLevel: 2,
    tierLabel: 'TIER 2 (Preferred Hauliers)',
    minutesUntilNextTier: 38,
    isCrossDockMultiLeg: false,
    isHazmat: false,
    status: 'OPEN_TENDER',
    deadheadSavingsCo2Kg: 36.8
  },
  {
    id: 'ld-803',
    loadNumber: 'FL-2026-8803',
    shipperName: 'DP World London Gateway',
    originHub: 'London Gateway Port Berth 4',
    originPostcode: 'SS17 9DY',
    destinationHub: 'Trafford Park Logistics Base',
    destinationPostcode: 'M17 1EH',
    pickupWindow: 'Tomorrow 06:00 - 07:30',
    deliveryWindow: 'Tomorrow 13:00 - 14:30',
    distanceMiles: 224,
    weightTonnes: 26.0,
    palletCount: 26,
    requiredTrailerType: '44t Skeletal Container Pin',
    baseRateGbp: 610.00,
    currentRateGbp: 645.00,
    tierLevel: 3,
    tierLabel: 'TIER 3 (Open Spot Exchange)',
    minutesUntilNextTier: 0,
    isCrossDockMultiLeg: false,
    isHazmat: true,
    status: 'OPEN_TENDER',
    deadheadSavingsCo2Kg: 71.5
  }
];
