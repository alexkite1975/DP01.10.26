import { HaulageCompany, LearnedTrailerProfile, TrailerType } from '../types';

export const INITIAL_HAULAGE_COMPANIES: HaulageCompany[] = [
  {
    id: 'stobart',
    name: 'Eddie Stobart Logistics',
    code: 'ESL',
    primaryColor: '#16a34a', // Green
    fleetCount: 2200,
    commonTrailerTypes: ['Curtainsider', 'Refrigerated', 'Walking Floor']
  },
  {
    id: 'dhl',
    name: 'DHL Supply Chain UK',
    code: 'DHL',
    primaryColor: '#eab308', // Yellow
    fleetCount: 3500,
    commonTrailerTypes: ['High-Cube Double Decker', 'Box Van', 'Urban Curtainsider']
  },
  {
    id: 'maritime',
    name: 'Maritime Transport Ltd',
    code: 'MTL',
    primaryColor: '#2563eb', // Blue
    fleetCount: 1800,
    commonTrailerTypes: ['Skeletal Container Chassis', 'Curtainsider']
  },
  {
    id: 'wincanton',
    name: 'Wincanton Logistics',
    code: 'WIN',
    primaryColor: '#0d9488', // Teal
    fleetCount: 2900,
    commonTrailerTypes: ['Multi-Temp Reefer', 'Curtainsider', 'Bulk Tanker']
  },
  {
    id: 'turners',
    name: 'Turners of Soham',
    code: 'TOS',
    primaryColor: '#dc2626', // Red
    fleetCount: 1600,
    commonTrailerTypes: ['Temperature Controlled', 'Tanker', 'Container']
  },
  {
    id: 'culina',
    name: 'Culina Group / Great Bear',
    code: 'CUL',
    primaryColor: '#4f46e5', // Indigo
    fleetCount: 2400,
    commonTrailerTypes: ['Chilled Curtainsider', 'High-Cube Double Decker']
  },
  {
    id: 'dfds',
    name: 'DFDS Logistics',
    code: 'DFDS',
    primaryColor: '#1e293b', // Slate
    fleetCount: 1100,
    commonTrailerTypes: ['Intermodal Box', 'Curtainsider', 'Flatbed']
  },
  {
    id: 'royalmail',
    name: 'Royal Mail Freight Linehaul',
    code: 'RM',
    primaryColor: '#e11d48', // Rose Red
    fleetCount: 1900,
    commonTrailerTypes: ['Double Decker York Box', 'Curtainsider']
  }
];

export const INITIAL_LEARNED_TRAILERS: LearnedTrailerProfile[] = [
  // Example showing identical trailer numbers (1042) having distinct company profiles & heights
  {
    id: 'stobart_1042',
    companyId: 'stobart',
    companyName: 'Eddie Stobart Logistics',
    trailerNumber: '1042',
    trailerType: 'CURTAINSIDER',
    heightMeters: 4.45,
    heightFeetInches: `14' 7"`,
    lengthMeters: 13.6,
    combinationLengthMeters: 16.5,
    widthMeters: 2.55,
    grossWeightTonnes: 44,
    hasTailLift: false,
    isDoubleDecker: false,
    notes: 'Standard 4.45m UK general cargo curtainsider. Suitable for all standard trunking.',
    dateLearned: '2026-03-12T08:30:00Z',
    timesUsed: 14,
    lastUsedAt: '2026-09-18T14:15:00Z',
    bulkheadVerified: true,
    motExpiryDate: '2026-11-20',
    motStatus: 'VALID',
    motCertificateNumber: 'VTG-ESL-94021',
    lastBrakeTestDate: '2026-08-14',
    lastBrakeEfficiencyPercent: 62,
    chassisVinNumber: 'W09SD2720M1094820',
    unladenWeightTonnes: 7.2,
    manufactureYear: 2022,
    operatorDiscNumber: 'OK1092841/004',
    axleCount: 3
  },
  {
    id: 'dhl_1042',
    companyId: 'dhl',
    companyName: 'DHL Supply Chain UK',
    trailerNumber: '1042',
    trailerType: 'BOX_VAN',
    heightMeters: 4.85,
    heightFeetInches: `15' 11"`,
    lengthMeters: 13.6,
    combinationLengthMeters: 16.5,
    widthMeters: 2.55,
    grossWeightTonnes: 44,
    hasTailLift: true,
    isDoubleDecker: true,
    notes: 'HIGH-CUBE DOUBLE DECKER. Strict 4.95m motorway bridge clearance required! Do not enter urban routes.',
    dateLearned: '2026-04-05T10:20:00Z',
    timesUsed: 9,
    lastUsedAt: '2026-09-20T09:45:00Z',
    bulkheadVerified: true,
    motExpiryDate: '2027-02-18',
    motStatus: 'VALID',
    motCertificateNumber: 'VTG-DHL-88412',
    lastBrakeTestDate: '2026-07-29',
    lastBrakeEfficiencyPercent: 66,
    chassisVinNumber: 'SCA284091M4920194',
    unladenWeightTonnes: 8.9,
    manufactureYear: 2023,
    operatorDiscNumber: 'OB2849102/012',
    axleCount: 3
  },
  {
    id: 'maritime_1042',
    companyId: 'maritime',
    companyName: 'Maritime Transport Ltd',
    trailerNumber: '1042',
    trailerType: 'FLATBED',
    heightMeters: 4.20,
    heightFeetInches: `13' 9"`,
    lengthMeters: 13.6,
    combinationLengthMeters: 16.5,
    widthMeters: 2.55,
    grossWeightTonnes: 44,
    hasTailLift: false,
    isDoubleDecker: false,
    notes: 'Skeletal chassis carrying standard 9ft 6in High-Cube ISO shipping container.',
    dateLearned: '2026-05-18T11:00:00Z',
    timesUsed: 6,
    lastUsedAt: '2026-09-15T16:00:00Z',
    bulkheadVerified: true,
    motExpiryDate: '2026-10-05',
    motStatus: 'DUE_SOON',
    motCertificateNumber: 'VTG-MTL-77491',
    lastBrakeTestDate: '2026-06-12',
    lastBrakeEfficiencyPercent: 58,
    chassisVinNumber: 'MER930184M3920184',
    unladenWeightTonnes: 5.1,
    manufactureYear: 2021,
    operatorDiscNumber: 'OL3910294/008',
    axleCount: 3
  },

  // Another example of duplicate trailer number (502) across Wincanton & Turners
  {
    id: 'wincanton_502',
    companyId: 'wincanton',
    companyName: 'Wincanton Logistics',
    trailerNumber: '502',
    trailerType: 'REFRIGERATED_TEMP',
    heightMeters: 4.30,
    heightFeetInches: `14' 1"`,
    lengthMeters: 13.6,
    combinationLengthMeters: 16.5,
    widthMeters: 2.60,
    grossWeightTonnes: 44,
    hasTailLift: true,
    isDoubleDecker: false,
    notes: 'Multi-temperature refrigerated trailer (ThermoKing SLXi). 2.60m width envelope.',
    dateLearned: '2026-02-14T07:15:00Z',
    timesUsed: 19,
    lastUsedAt: '2026-09-19T18:30:00Z',
    bulkheadVerified: true,
    motExpiryDate: '2026-12-14',
    motStatus: 'VALID',
    motCertificateNumber: 'VTG-WIN-66291',
    lastBrakeTestDate: '2026-09-02',
    lastBrakeEfficiencyPercent: 64,
    chassisVinNumber: 'KRONE94012M9402194',
    unladenWeightTonnes: 8.4,
    manufactureYear: 2022,
    operatorDiscNumber: 'OK2940192/015',
    axleCount: 3
  },
  {
    id: 'turners_502',
    companyId: 'turners',
    companyName: 'Turners of Soham',
    trailerNumber: '502',
    trailerType: 'CURTAINSIDER',
    heightMeters: 4.25,
    heightFeetInches: `13' 11"`,
    lengthMeters: 13.6,
    combinationLengthMeters: 16.5,
    widthMeters: 2.55,
    grossWeightTonnes: 44,
    hasTailLift: false,
    isDoubleDecker: false,
    notes: 'Low aerodynamic roof aerofoil curtainsider for East Anglia trunk runs.',
    dateLearned: '2026-06-22T06:40:00Z',
    timesUsed: 4,
    lastUsedAt: '2026-09-08T11:20:00Z',
    bulkheadVerified: true,
    motExpiryDate: '2026-09-10',
    motStatus: 'EXPIRED',
    motCertificateNumber: 'VTG-TOS-55419',
    lastBrakeTestDate: '2026-05-18',
    lastBrakeEfficiencyPercent: 53,
    chassisVinNumber: 'SCH920184M8492014',
    unladenWeightTonnes: 6.9,
    manufactureYear: 2019,
    operatorDiscNumber: 'OE8492014/003',
    axleCount: 3
  },

  // Culina & Royal Mail linehauls
  {
    id: 'culina_881',
    companyId: 'culina',
    companyName: 'Culina Group / Great Bear',
    trailerNumber: '881',
    trailerType: 'CURTAINSIDER',
    heightMeters: 4.50,
    heightFeetInches: `14' 9"`,
    lengthMeters: 13.6,
    combinationLengthMeters: 16.5,
    widthMeters: 2.55,
    grossWeightTonnes: 44,
    hasTailLift: true,
    isDoubleDecker: false,
    notes: 'Chilled ambient high-roof curtainsider with Dhollandia tuckaway tail lift.',
    dateLearned: '2026-05-02T13:10:00Z',
    timesUsed: 8,
    lastUsedAt: '2026-09-12T15:40:00Z',
    bulkheadVerified: true,
    motExpiryDate: '2027-03-24',
    motStatus: 'VALID',
    motCertificateNumber: 'VTG-CUL-44910',
    lastBrakeTestDate: '2026-08-30',
    lastBrakeEfficiencyPercent: 68,
    chassisVinNumber: 'CAR940182M3940184',
    unladenWeightTonnes: 7.6,
    manufactureYear: 2023,
    operatorDiscNumber: 'OM4920184/022',
    axleCount: 3
  },
  {
    id: 'royalmail_881',
    companyId: 'royalmail',
    companyName: 'Royal Mail Freight Linehaul',
    trailerNumber: '881',
    trailerType: 'BOX_VAN',
    heightMeters: 4.80,
    heightFeetInches: `15' 9"`,
    lengthMeters: 13.6,
    combinationLengthMeters: 16.5,
    widthMeters: 2.55,
    grossWeightTonnes: 44,
    hasTailLift: true,
    isDoubleDecker: true,
    notes: 'Double-deck cage carrier. High roof warning mandatory for bridge avoidance.',
    dateLearned: '2026-07-19T21:00:00Z',
    timesUsed: 12,
    lastUsedAt: '2026-09-21T03:15:00Z',
    bulkheadVerified: true,
    motExpiryDate: '2027-01-15',
    motStatus: 'VALID',
    motCertificateNumber: 'VTG-RM-33918',
    lastBrakeTestDate: '2026-07-14',
    lastBrakeEfficiencyPercent: 65,
    chassisVinNumber: 'YORK94021M4910294',
    unladenWeightTonnes: 8.7,
    manufactureYear: 2023,
    operatorDiscNumber: 'OK9402941/007',
    axleCount: 3
  }
];

const STORAGE_KEY_COMPANIES = 'siterisk_haulage_companies_v1';
const STORAGE_KEY_TRAILERS = 'siterisk_learned_trailers_v1';

export function metersToFeetInches(meters: number): string {
  const totalInches = meters * 39.3701;
  const feet = Math.floor(totalInches / 12);
  const inches = Math.round(totalInches % 12);
  return `${feet}' ${inches}"`;
}

export function feetInchesToMeters(feet: number, inches: number): number {
  const totalInches = feet * 12 + inches;
  return Math.round((totalInches * 0.0254) * 100) / 100;
}

class TrailerFleetService {
  private companies: HaulageCompany[] = [];
  private trailers: LearnedTrailerProfile[] = [];

  constructor() {
    this.loadFromStorage();
  }

  private loadFromStorage() {
    try {
      const savedCompanies = localStorage.getItem(STORAGE_KEY_COMPANIES);
      if (savedCompanies) {
        this.companies = JSON.parse(savedCompanies);
      } else {
        this.companies = [...INITIAL_HAULAGE_COMPANIES];
        this.saveCompanies();
      }

      const savedTrailers = localStorage.getItem(STORAGE_KEY_TRAILERS);
      if (savedTrailers) {
        this.trailers = JSON.parse(savedTrailers);
      } else {
        this.trailers = [...INITIAL_LEARNED_TRAILERS];
        this.saveTrailers();
      }
    } catch (e) {
      console.warn('TrailerFleetService storage error, using memory fallback:', e);
      this.companies = [...INITIAL_HAULAGE_COMPANIES];
      this.trailers = [...INITIAL_LEARNED_TRAILERS];
    }
  }

  private saveCompanies() {
    try {
      localStorage.setItem(STORAGE_KEY_COMPANIES, JSON.stringify(this.companies));
    } catch (e) {}
  }

  private saveTrailers() {
    try {
      localStorage.setItem(STORAGE_KEY_TRAILERS, JSON.stringify(this.trailers));
    } catch (e) {}
  }

  public getCompanies(): HaulageCompany[] {
    return this.companies;
  }

  public addCompany(name: string, code?: string, primaryColor?: string): HaulageCompany {
    const cleanName = name.trim();
    const existing = this.companies.find(c => c.name.toLowerCase() === cleanName.toLowerCase());
    if (existing) return existing;

    const id = cleanName.toLowerCase().replace(/[^a-z0-9]/g, '_');
    const newCompany: HaulageCompany = {
      id,
      name: cleanName,
      code: code ? code.toUpperCase() : cleanName.substring(0, 3).toUpperCase(),
      primaryColor: primaryColor || '#3b82f6',
      commonTrailerTypes: ['Curtainsider', 'Box Van']
    };

    this.companies.push(newCompany);
    this.saveCompanies();
    return newCompany;
  }

  public getAllTrailers(): LearnedTrailerProfile[] {
    return [...this.trailers].sort((a, b) => (b.timesUsed || 0) - (a.timesUsed || 0));
  }

  public getTrailersByCompany(companyId: string): LearnedTrailerProfile[] {
    return this.trailers.filter(t => t.companyId === companyId);
  }

  /**
   * Search trailers matching trailer number.
   * Note: May return MULTIPLE trailers across different haulage companies!
   */
  public findTrailersByNumber(trailerNumber: string): LearnedTrailerProfile[] {
    const cleanNum = trailerNumber.trim().toUpperCase();
    return this.trailers.filter(t => t.trailerNumber.toUpperCase().includes(cleanNum));
  }

  /**
   * Exact match using Company + Trailer Number composite key
   */
  public findExactTrailer(companyId: string, trailerNumber: string): LearnedTrailerProfile | undefined {
    const cleanNum = trailerNumber.trim().toUpperCase();
    return this.trailers.find(
      t => t.companyId === companyId && t.trailerNumber.toUpperCase() === cleanNum
    );
  }

  /**
   * Learn or update trailer specification
   */
  public learnOrUpdateTrailer(data: {
    companyId: string;
    companyName: string;
    trailerNumber: string;
    trailerType?: TrailerType;
    heightMeters: number;
    lengthMeters?: number;
    combinationLengthMeters?: number;
    widthMeters?: number;
    grossWeightTonnes?: number;
    hasTailLift?: boolean;
    isDoubleDecker?: boolean;
    notes?: string;
    bulkheadVerified?: boolean;
  }): LearnedTrailerProfile {
    const cleanNum = data.trailerNumber.trim().toUpperCase();
    const compositeId = `${data.companyId}_${cleanNum.toLowerCase().replace(/[^a-z0-9]/g, '_')}`;

    const existingIdx = this.trailers.findIndex(t => t.id === compositeId);
    const heightFtIn = metersToFeetInches(data.heightMeters);

    let profile: LearnedTrailerProfile;

    if (existingIdx >= 0) {
      const existing = this.trailers[existingIdx];
      profile = {
        ...existing,
        ...data,
        id: compositeId,
        trailerNumber: cleanNum,
        heightFeetInches: heightFtIn,
        lengthMeters: data.lengthMeters ?? existing.lengthMeters ?? 13.6,
        combinationLengthMeters: data.combinationLengthMeters ?? existing.combinationLengthMeters ?? 16.5,
        widthMeters: data.widthMeters ?? existing.widthMeters ?? 2.55,
        grossWeightTonnes: data.grossWeightTonnes ?? existing.grossWeightTonnes ?? 44,
        trailerType: data.trailerType ?? existing.trailerType ?? 'CURTAINSIDER',
        hasTailLift: data.hasTailLift ?? existing.hasTailLift ?? false,
        isDoubleDecker: data.isDoubleDecker ?? (data.heightMeters > 4.75),
        timesUsed: existing.timesUsed + 1,
        lastUsedAt: new Date().toISOString(),
        bulkheadVerified: data.bulkheadVerified ?? existing.bulkheadVerified ?? true
      };
      this.trailers[existingIdx] = profile;
    } else {
      profile = {
        id: compositeId,
        companyId: data.companyId,
        companyName: data.companyName,
        trailerNumber: cleanNum,
        trailerType: data.trailerType || 'CURTAINSIDER',
        heightMeters: data.heightMeters,
        heightFeetInches: heightFtIn,
        lengthMeters: data.lengthMeters || 13.6,
        combinationLengthMeters: data.combinationLengthMeters || 16.5,
        widthMeters: data.widthMeters || 2.55,
        grossWeightTonnes: data.grossWeightTonnes || 44,
        hasTailLift: data.hasTailLift || false,
        isDoubleDecker: data.isDoubleDecker || (data.heightMeters > 4.75),
        notes: data.notes || `Learned trailer hitched by driver. Automatically saved to ${data.companyName} fleet memory.`,
        dateLearned: new Date().toISOString(),
        timesUsed: 1,
        lastUsedAt: new Date().toISOString(),
        bulkheadVerified: data.bulkheadVerified ?? true
      };
      this.trailers.push(profile);
    }

    this.saveTrailers();
    return profile;
  }

  public recordTrailerHitch(trailerId: string): void {
    const t = this.trailers.find(item => item.id === trailerId);
    if (t) {
      t.timesUsed = (t.timesUsed || 0) + 1;
      t.lastUsedAt = new Date().toISOString();
      this.saveTrailers();
    }
  }

  public deleteTrailer(trailerId: string): void {
    this.trailers = this.trailers.filter(t => t.id !== trailerId);
    this.saveTrailers();
  }
}

export const trailerFleetService = new TrailerFleetService();
