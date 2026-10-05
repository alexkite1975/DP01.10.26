export interface CargoCrimeIncident {
  id: string;
  date: string;
  corridor: string;
  road: string;
  location: string;
  latitude: number;
  longitude: number;
  incidentType: 'CURTAIN_SLASH' | 'DIESEL_SIPHON' | 'SEAL_TAMPER' | 'FULL_TRAILER_THEFT' | 'ROADSIDE_DECEPTION';
  severity: 'HIGH' | 'MEDIUM' | 'LOW';
  description: string;
  preventativeTip: string;
  recommendedSecureAlternative: string;
}

export const CARGO_CRIME_INCIDENTS: CargoCrimeIncident[] = [
  {
    id: 'crime-001',
    date: '3 nights ago',
    corridor: 'M1 Golden Triangle',
    road: 'M1 J18 / A5 Layby',
    location: 'Crick, Northamptonshire',
    latitude: 52.3481,
    longitude: -1.1392,
    incidentType: 'CURTAIN_SLASH',
    severity: 'HIGH',
    description: 'Multiple curtain-side cuts reported between 02:00 and 04:30. Gang targetted consumer electronics pallets.',
    preventativeTip: 'Never park in unlit A5 laybys with high-value consumer goods. Park trailer tight against sound barriers or fences.',
    recommendedSecureAlternative: 'Watford Gap Moto (guarded) or Rugby Services M6 J1 (CCTV barrier)'
  },
  {
    id: 'crime-002',
    date: '5 nights ago',
    corridor: 'A14 Freight Spine',
    road: 'A14 J11 Layby',
    location: 'Cranford, Northamptonshire',
    latitude: 52.3845,
    longitude: -0.6382,
    incidentType: 'DIESEL_SIPHON',
    severity: 'HIGH',
    description: 'Over 400 litres of diesel siphoned from 3 tractor units while drivers slept. Anti-siphon caps pried off with crowbars.',
    preventativeTip: 'Avoid secluded A14 slip-road laybys. Park with fuel tank visible under bright LED floodlights.',
    recommendedSecureAlternative: 'Rothwell Truckstop A14 J13 (10ft fenced, razor wire, guard dog patrol)'
  },
  {
    id: 'crime-003',
    date: 'Last week',
    corridor: 'M6 North West',
    road: 'M6 J21A Layby',
    location: 'Warrington, Cheshire',
    latitude: 53.4210,
    longitude: -2.5298,
    incidentType: 'SEAL_TAMPER',
    severity: 'MEDIUM',
    description: 'Bolt seal cut on refrigerated container. Doors opened, driver awakened by cab rocker movement.',
    preventativeTip: 'Check ISO 17712 bolt seals during pre-trip. Back doors flush against warehouse dock walls or adjacent trailer.',
    recommendedSecureAlternative: 'Formula Services Ellesmere Port (M53 J8 - 24/7 manned gatehouse & security dogs)'
  },
  {
    id: 'crime-004',
    date: '2 weeks ago',
    corridor: 'M25 London Orbital',
    road: 'A13 / M25 J30 Approach',
    location: 'Thurrock, Essex',
    latitude: 51.4891,
    longitude: 0.2812,
    incidentType: 'CURTAIN_SLASH',
    severity: 'HIGH',
    description: 'Peak slash attempts on trailers hauling branded spirits and clothing from London Gateway / Tilbury port.',
    preventativeTip: 'Avoid overnight laybys on A13 / A1089 corridors.',
    recommendedSecureAlternative: 'Cobham Services M25 J9/10 or secure Thurrock truck parks'
  }
];
