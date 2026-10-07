/**
 * Drive Partners - Component Registry & Dynamic Area Map
 * 
 * Provides centralized metadata, routes, and dynamic imports for all primary 
 * subsystems. Use this registry or `node scripts/move-component.js` to reorganize
 * components across pages and areas.
 */

export interface RegisteredComponent {
  id: string;
  name: string;
  title: string;
  category: 'walkaround' | 'tacho' | 'safety' | 'routing' | 'siterisk' | 'fleetops' | 'cms' | 'governance';
  currentPath: string;
  dedicatedRoute: string;
  description: string;
  dvsaStandard?: string;
}

export const COMPONENT_REGISTRY: Record<string, RegisteredComponent> = {
  VehicleCheckApp: {
    id: 'vehicle-check-app',
    name: 'VehicleCheckApp',
    title: 'Driver Walkaround',
    category: 'walkaround',
    currentPath: '@/components/vehicleCheck/VehicleCheckApp',
    dedicatedRoute: '/driver/walkaround',
    description: 'Full 32-point DVSA statutory roadworthiness inspection, Acoustic Air Leak FFT, and AR 360 Vision HUD.',
    dvsaStandard: 'DVSA Guide to Maintaining Roadworthiness 2026'
  },
  TachoScanApp: {
    id: 'tacho-scan-app',
    name: 'TachoScanApp',
    title: 'Tacho AI & .DDD',
    category: 'tacho',
    currentPath: '@/components/tacho/TachoScanApp',
    dedicatedRoute: '/driver/tacho',
    description: 'SE5000 / VDO thermal printout OCR, binary cryptographic .DDD builder, and EU 561 compliance engine.',
    dvsaStandard: 'EU Regulation 561/2006 & UK WTD'
  },
  DriverSafetyShieldHub: {
    id: 'driver-safety-shield-hub',
    name: 'DriverSafetyShieldHub',
    title: 'Bridge & Safety Shield',
    category: 'safety',
    currentPath: '@/components/safety/DriverSafetyShieldHub',
    dedicatedRoute: '/driver/safety',
    description: 'Network Rail low bridge radar, arch crown geometry calculator, and HMRC £34.90 subsistence logger.',
    dvsaStandard: 'Network Rail Low Bridge Strike Prevention'
  },
  RouteOptimiserApp: {
    id: 'route-optimiser-app',
    name: 'RouteOptimiserApp',
    title: 'HGV Routing & Tours',
    category: 'routing',
    currentPath: '@/components/routeOptimiser/RouteOptimiserApp',
    dedicatedRoute: '/driver/route',
    description: '44t commercial TomTom truck routing, trailer clearance diff alerts, and Amazon Relay 5-day tour navigator.',
    dvsaStandard: 'TomTom Commercial Truck Routing SDK'
  },
  SiteRiskApp: {
    id: 'site-risk-app',
    name: 'SiteRiskApp',
    title: 'Site Risk & Services',
    category: 'siterisk',
    currentPath: '@/components/siterisk/SiteRiskApp',
    dedicatedRoute: '/driver/sites',
    description: 'Motorway services directory, live crowd bay occupancy, SNAP billing, and DC gate approach guides.',
    dvsaStandard: 'Highways England & Logistics UK Yard Safety'
  },
  BusinessDashboard: {
    id: 'business-dashboard',
    name: 'BusinessDashboard',
    title: 'Haulier Master Command',
    category: 'fleetops',
    currentPath: '@/components/manager/BusinessDashboard',
    dedicatedRoute: '/haulier',
    description: 'Transport manager compliance dashboard, fleet VOR lockout, and automated self-billing payroll.',
    dvsaStandard: 'DVSA Earned Recognition & Goods Vehicles Act 1995'
  },
  CreateSiteModal: {
    id: 'create-site-modal',
    name: 'CreateSiteModal',
    title: 'Depot & Yard Risk CMS',
    category: 'cms',
    currentPath: '@/components/manager/CreateSiteModal',
    dedicatedRoute: '/admin/sites',
    description: 'Enterprise 1,502 LOC site creation wizard with Google Places lookup, AI Risk Assessment OCR, and 5x5 hazard matrix.',
    dvsaStandard: 'ISO 45001 & Health and Safety at Work Act 1974'
  },
  SitePlanAnnotator: {
    id: 'site-plan-annotator',
    name: 'SitePlanAnnotator',
    title: 'Visual Yard CAD Blueprint',
    category: 'cms',
    currentPath: '@/components/manager/SitePlanAnnotator',
    dedicatedRoute: '/admin/sites',
    description: '1,892 LOC 2D satellite blueprint annotator for gates, bays, hazards, muster points, and weighbridges.',
    dvsaStandard: 'HSE Workplace Transport Safety HSG136'
  },
  PlaceSearchPage: {
    id: 'place-search-page',
    name: 'PlaceSearchPage',
    title: 'UK Logistics Hub Directory',
    category: 'cms',
    currentPath: '@/components/shared/PlaceSearchPage',
    dedicatedRoute: '/admin/sites',
    description: 'Nationwide UK distribution center directory with Google Street View gate entrance preview.',
    dvsaStandard: 'Logistics UK Freight Directory'
  },
  SiteReviews: {
    id: 'site-reviews',
    name: 'SiteReviews',
    title: 'Whistleblower Hazard Moderation',
    category: 'governance',
    currentPath: '@/components/SiteReviews',
    dedicatedRoute: '/admin/reviews',
    description: 'Driver whistleblower reviews queue with Vertex AI toxicity scoring and 48-hour Amber notice escalations.',
    dvsaStandard: 'Public Interest Disclosure Act 1998'
  },
  UserAccessControlPortal: {
    id: 'user-access-control-portal',
    name: 'UserAccessControlPortal',
    title: 'RBAC User Access Control',
    category: 'governance',
    currentPath: '@/components/manager/UserAccessControlPortal',
    dedicatedRoute: '/admin/users',
    description: 'Role-based access permissions, team invites, and enterprise security governance.',
    dvsaStandard: 'UK GDPR & ISO 27001'
  },
  ReliefDriverShifts: {
    id: 'relief-driver-shifts',
    name: 'ReliefDriverShifts',
    title: 'Relief Driver Shifts',
    category: 'fleetops',
    currentPath: '@/data/mockMarketplaceData',
    dedicatedRoute: '/driver/shifts',
    description: 'HGV relief driver shift marketplace for Class 1 & 2 agency cover, night trunks, and IR35 safe harbour protection.',
    dvsaStandard: 'Section 44 ITEPA 2003 & Conduct of Employment Agencies Regulations'
  },
  HaulageFreightExchange: {
    id: 'haulage-freight-exchange',
    name: 'HaulageFreightExchange',
    title: 'Haulage & Freight Exchange',
    category: 'routing',
    currentPath: '@/components/modals/HxFreightWorkflowModal',
    dedicatedRoute: '/freight',
    description: 'B2B commercial freight cargo marketplace for Shippers to broadcast 44t loads and Hauliers to tender and eliminate deadhead miles.',
    dvsaStandard: 'RHA Conditions of Carriage 2024 & CMR Convention'
  }
};
