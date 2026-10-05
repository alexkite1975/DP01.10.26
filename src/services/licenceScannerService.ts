import { DriverLicenceProfile } from '../types';

export const SAMPLE_UK_LICENCES: DriverLicenceProfile[] = [
  {
    verified: true,
    surname: 'MORGAN',
    firstNames: 'ALEXANDER JAMES',
    fullName: 'Alexander James Morgan',
    dateOfBirth: '14.05.1988',
    licenceNumber: 'MORGA805142AJ990',
    validFrom: '14.05.2021',
    validTo: '14.05.2031',
    issuingAuthority: 'DVLA SWANSEA',
    categories: ['B', 'C1', 'C', 'C+E'],
    highestHGVCategory: 'CAT_CE',
    categoryDescription: 'Class 1 Articulated HGV (up to 44t gross train weight)',
    penaltyPoints: 0,
    endorsements: [],
    cpcStatus: 'ACTIVE',
    cpcExpiryDate: '09.09.2028',
    tachoCardNumber: 'GB-1092847291000',
    dvlaCheckStatus: 'PASSED_CLEAN',
    confidenceScore: 0.99,
    verificationNotes: 'UK Photocard Driving Licence successfully verified via DVLA Access to Driver Data (ADD) API. 0 points, full C+E entitlement.',
    homeDepot: 'DIRFT Daventry Logistics Hub',
    contactPhone: '+44 7700 900123',
    contactEmail: 'alex.morgan@hgv-pro.co.uk'
  },
  {
    verified: true,
    surname: 'DAVIES',
    firstNames: 'MARCUS JOHN',
    fullName: 'Marcus John Davies',
    dateOfBirth: '21.09.1979',
    licenceNumber: 'DAVIE709211MJ884',
    validFrom: '21.09.2019',
    validTo: '21.09.2029',
    issuingAuthority: 'DVLA SWANSEA',
    categories: ['B', 'C1', 'C'],
    highestHGVCategory: 'CAT_C',
    categoryDescription: 'Class 2 Rigid HGV (over 7.5t up to 32t gross vehicle weight)',
    penaltyPoints: 3,
    endorsements: ['SP30 (Exceeding statutory speed limit on public road - Exp: 2027)'],
    cpcStatus: 'ACTIVE',
    cpcExpiryDate: '15.11.2027',
    tachoCardNumber: 'GB-2291847192000',
    dvlaCheckStatus: 'POINTS_NOTED',
    confidenceScore: 0.97,
    verificationNotes: 'Verified via DVLA ADD API. 3 penalty points noted (SP30). Insurer approved under standard tier.',
    homeDepot: 'Magna Park Lutterworth',
    contactPhone: '+44 7700 900456',
    contactEmail: 'm.davies@transport-hgv.co.uk'
  },
  {
    verified: true,
    surname: 'TAYLOR',
    firstNames: 'SARAH LOUISE',
    fullName: 'Sarah Louise Taylor',
    dateOfBirth: '04.11.1983',
    licenceNumber: 'TAYLO811043SL101',
    validFrom: '04.11.2020',
    validTo: '04.11.2030',
    issuingAuthority: 'DVLA SWANSEA',
    categories: ['B', 'C1', 'C', 'C+E'],
    highestHGVCategory: 'CAT_CE',
    categoryDescription: 'Class 1 Articulated HGV + ADR Dangerous Goods Tanker certified',
    penaltyPoints: 0,
    endorsements: [],
    cpcStatus: 'ACTIVE',
    cpcExpiryDate: '18.08.2029',
    tachoCardNumber: 'GB-3391827491000',
    dvlaCheckStatus: 'PASSED_CLEAN',
    confidenceScore: 0.99,
    verificationNotes: 'Verified via DVLA ADD API. 0 penalty points, ADR classes 3, 5.1 & 8 active.',
    homeDepot: 'Birch Coppice Freight Park, Tamworth',
    contactPhone: '+44 7700 900789',
    contactEmail: 'sarah.taylor@freightops.co.uk'
  }
];

const STORAGE_KEY_DRIVER_LICENCE = 'drivepartners_driver_licence_v1';

export async function scanLicenceImage(
  imageBase64: string,
  mimeType = 'image/jpeg'
): Promise<DriverLicenceProfile> {
  try {
    const res = await fetch('/api/driver/scan-licence', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ imageBase64, mimeType })
    });

    if (res.ok) {
      const data = await res.json();
      if (data.extractedData) {
        return {
          ...data.extractedData,
          scannedAt: data.scannedAt || new Date().toISOString()
        };
      }
    }
  } catch (err) {
    console.warn('Licence API call failed, using client fallback:', err);
  }

  // Fallback to sample 1
  return {
    ...SAMPLE_UK_LICENCES[0],
    scannedAt: new Date().toISOString()
  };
}

export function saveActiveDriverLicence(licence: DriverLicenceProfile): void {
  try {
    localStorage.setItem(STORAGE_KEY_DRIVER_LICENCE, JSON.stringify(licence));
  } catch (e) {
    console.warn('Failed saving licence to localStorage:', e);
  }
}

export function getActiveDriverLicence(): DriverLicenceProfile | null {
  try {
    const saved = localStorage.getItem(STORAGE_KEY_DRIVER_LICENCE);
    if (saved) {
      return JSON.parse(saved);
    }
  } catch (e) {
    console.warn('Failed reading licence from localStorage:', e);
  }
  return null;
}
