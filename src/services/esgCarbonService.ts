/**
 * Drive Partners 2.0 & ReliefHGV - Scope 3 ESG Carbon Accounting Service
 * Implements GHG Protocol Corporate Value Chain (Scope 3) Standard
 * Category 4: Upstream Transportation & Distribution
 */

export interface CarbonTripRecord {
  id: string;
  date: string;
  loadReference: string;
  origin: string;
  destination: string;
  loadedMiles: number;
  emptyDeadheadMiles: number;
  grossWeightTonnes: number;
  fuelType: 'DIESEL_EURO_6' | 'HVO_BIOFUEL' | 'BATTERY_ELECTRIC' | 'CNG_LNG';
  co2EmittedKg: number;
  co2SavedFromMatchingKg: number;
  deadheadAvoidedPct: number;
}

export interface EsgSummaryReport {
  period: string;
  totalTrips: number;
  totalLoadedMiles: number;
  totalEmptyMiles: number;
  fleetAverageDeadheadPct: number;
  industryBenchmarkDeadheadPct: number; // UK average is ~29% empty running
  totalGrossCo2Kg: number;
  totalSavedCo2Kg: number;
  scopeCategory: string;
  reportingStandard: string;
  verifiedByAuditor: boolean;
  trips: CarbonTripRecord[];
}

// UK Government DEFRA / BEIS 2024-2026 GHG conversion factors (kg CO2e per vehicle-km)
const EMISSION_FACTORS_KG_PER_MILE: Record<string, number> = {
  DIESEL_EURO_6: 1.48, // 44t Artic laden
  HVO_BIOFUEL: 0.16,   // 88-90% well-to-wheel reduction
  BATTERY_ELECTRIC: 0.22, // UK Grid mix
  CNG_LNG: 1.15
};

export function calculateTripEmissions(
  loadedMiles: number,
  emptyMiles: number,
  fuelType: CarbonTripRecord['fuelType'] = 'DIESEL_EURO_6'
): { co2EmittedKg: number; co2SavedKg: number; deadheadPct: number } {
  const factor = EMISSION_FACTORS_KG_PER_MILE[fuelType] || 1.48;
  const totalMiles = loadedMiles + emptyMiles;
  const deadheadPct = totalMiles > 0 ? +((emptyMiles / totalMiles) * 100).toFixed(1) : 0;

  // Actual emissions
  const co2EmittedKg = +(totalMiles * factor).toFixed(2);

  // UK standard deadhead benchmark is 29%.
  // If platform achieved lower empty miles (e.g. 8%), compute saved CO2:
  const baselineEmptyMiles = totalMiles * 0.29;
  const savedMiles = Math.max(0, baselineEmptyMiles - emptyMiles);
  const co2SavedKg = +(savedMiles * factor).toFixed(2);

  return {
    co2EmittedKg,
    co2SavedKg,
    deadheadPct
  };
}

export const SAMPLE_ESG_DATA: EsgSummaryReport = {
  period: 'Q3 2026 (July - September)',
  totalTrips: 142,
  totalLoadedMiles: 28450,
  totalEmptyMiles: 2510,
  fleetAverageDeadheadPct: 8.1,
  industryBenchmarkDeadheadPct: 29.0,
  totalGrossCo2Kg: 45820.8,
  totalSavedCo2Kg: 10240.5,
  scopeCategory: 'GHG Protocol Scope 3 - Category 4 (Upstream Freight)',
  reportingStandard: 'GLEC Framework v3.0 / ISO 14083 Compliant',
  verifiedByAuditor: true,
  trips: [
    {
      id: 'carb-001',
      date: '2026-09-26',
      loadReference: 'LD-99120',
      origin: 'DIRFT Daventry',
      destination: 'Tesco Magor RDC',
      loadedMiles: 142,
      emptyDeadheadMiles: 12,
      grossWeightTonnes: 44.0,
      fuelType: 'DIESEL_EURO_6',
      co2EmittedKg: 227.92,
      co2SavedFromMatchingKg: 48.84,
      deadheadAvoidedPct: 7.8
    },
    {
      id: 'carb-002',
      date: '2026-09-25',
      loadReference: 'LD-99088',
      origin: 'Amazon Doncaster LBA4',
      destination: 'Amazon Tilbury LCY2',
      loadedMiles: 185,
      emptyDeadheadMiles: 18,
      grossWeightTonnes: 38.5,
      fuelType: 'HVO_BIOFUEL',
      co2EmittedKg: 32.48,
      co2SavedFromMatchingKg: 94.12,
      deadheadAvoidedPct: 8.9
    },
    {
      id: 'carb-003',
      date: '2026-09-24',
      loadReference: 'LD-99014',
      origin: 'Port of Felixstowe',
      destination: 'Bardon Hill Hub',
      loadedMiles: 135,
      emptyDeadheadMiles: 9,
      grossWeightTonnes: 42.0,
      fuelType: 'DIESEL_EURO_6',
      co2EmittedKg: 213.12,
      co2SavedFromMatchingKg: 48.50,
      deadheadAvoidedPct: 6.2
    }
  ]
};
