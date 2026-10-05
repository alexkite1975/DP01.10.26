export type UserRole = 'driver' | 'fleet' | 'site_admin';

export interface DriverProfile {
  id: string;
  name: string;
  email: string;
  mobile: string;
  licenceNo: string;
  licenceCategories: string;
  licenceExpiry: string;
  cpcCardNo: string;
  cpcHours: string;
  tachoCardNo: string;
  tachoGen: string;
  qualifications: string[];
  units: 'Miles (mph)' | 'Kilometres (km/h)';
  language: string;
  vehicleHeight: string;
  vehicleWeight: string;
  navApp: 'Google Maps' | 'Waze' | 'Apple Maps' | 'TomTom Go';
  role: 'driver';
  vaultSecuredLocally: boolean;
}

export interface FleetProfile {
  id: string;
  companyName: string;
  contactName: string;
  email: string;
  operatingLicenceNo: string;
  fleetSize: string;
  operatingCentre: string;
  role: 'fleet';
}

export interface SiteAdminProfile {
  id: string;
  depotName: string;
  googlePlaceId: string;
  address: string;
  managerName: string;
  managerEmail: string;
  securityGatePhone: string;
  maxCanopyHeight: string;
  speedLimit: string;
  mandatoryPpe: string[];
  reversingPolicy: string;
  overnightParking: boolean;
  facilities: string[];
  role: 'site_admin';
}
