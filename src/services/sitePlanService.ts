import { SitePlanData, SitePlanAnnotation, SitePlanAnnotationType, SiteRiskAssessment } from '../types';

export const ANNOTATION_TYPE_CONFIG: Record<
  SitePlanAnnotationType,
  {
    label: string;
    iconName: string;
    badgeColor: string;
    pinColor: string;
    defaultSeverity: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
    descriptionPlaceholder: string;
  }
> = {
  HAZARD: {
    label: 'Critical Hazard',
    iconName: 'AlertTriangle',
    badgeColor: 'bg-rose-100 text-rose-800 border-rose-300',
    pinColor: '#EF4444',
    defaultSeverity: 'HIGH',
    descriptionPlaceholder: 'e.g. Blind spot reversing zone, oil slick risk, or uneven apron asphalt.'
  },
  CLEARANCE_RESTRICTION: {
    label: 'Clearance / Height Restriction',
    iconName: 'ShieldAlert',
    badgeColor: 'bg-amber-100 text-amber-800 border-amber-300',
    pinColor: '#F59E0B',
    defaultSeverity: 'CRITICAL',
    descriptionPlaceholder: 'e.g. Low overhead canopy, bridge arch (4.2m), or pipe rack obstruction.'
  },
  SECURITY_GATE: {
    label: 'Security Inbound Gate',
    iconName: 'Lock',
    badgeColor: 'bg-blue-100 text-blue-800 border-blue-300',
    pinColor: '#2563EB',
    defaultSeverity: 'LOW',
    descriptionPlaceholder: 'e.g. Inbound security barrier, intercom pillar, and driver sign-in cabin.'
  },
  LOADING_BAY: {
    label: 'Loading Bay / Dock',
    iconName: 'Truck',
    badgeColor: 'bg-emerald-100 text-emerald-800 border-emerald-300',
    pinColor: '#10B981',
    defaultSeverity: 'MEDIUM',
    descriptionPlaceholder: 'e.g. Bay 1-6 scissor-lift docks. Wheel chocking mandatory before opening rear doors.'
  },
  TRANSPORT_OFFICE: {
    label: 'Transport Office / Driver Reception',
    iconName: 'Building2',
    badgeColor: 'bg-cyan-100 text-cyan-800 border-cyan-300',
    pinColor: '#06B6D4',
    defaultSeverity: 'LOW',
    descriptionPlaceholder: 'e.g. Driver check-in window, paperwork sign-in, welfare facilities, and keys handover.'
  },
  PEDESTRIAN_PATH: {
    label: 'Pedestrian Walkway / Crossing',
    iconName: 'Footprints',
    badgeColor: 'bg-teal-100 text-teal-800 border-teal-300',
    pinColor: '#0D9488',
    defaultSeverity: 'HIGH',
    descriptionPlaceholder: 'e.g. High pedestrian footfall during warehouse shift changes. Sound horn.'
  },
  MUSTER_POINT: {
    label: 'Emergency Assembly Point',
    iconName: 'ShieldCheck',
    badgeColor: 'bg-indigo-100 text-indigo-800 border-indigo-300',
    pinColor: '#6366F1',
    defaultSeverity: 'LOW',
    descriptionPlaceholder: 'e.g. Designated safety evacuation muster point outside North perimeter fence.'
  },
  BLIND_SPOT: {
    label: 'Blind Reversing Corner',
    iconName: 'EyeOff',
    badgeColor: 'bg-orange-100 text-orange-800 border-orange-300',
    pinColor: '#F97316',
    defaultSeverity: 'HIGH',
    descriptionPlaceholder: 'e.g. 90-degree tight corner requiring yard banksman assistance.'
  },
  WEIGHBRIDGE: {
    label: 'Vehicle Weighbridge',
    iconName: 'Scale',
    badgeColor: 'bg-purple-100 text-purple-800 border-purple-300',
    pinColor: '#9333EA',
    defaultSeverity: 'LOW',
    descriptionPlaceholder: 'e.g. Drive-on gross weighbridge plate. Max speed 5mph.'
  },
  PARKING_WAITING: {
    label: 'Driver Holding / Waiting Bay',
    iconName: 'Clock',
    badgeColor: 'bg-slate-100 text-slate-800 border-slate-300',
    pinColor: '#64748B',
    defaultSeverity: 'LOW',
    descriptionPlaceholder: 'e.g. Holding area for early arrivals with toilet & rest facilities.'
  },
  ONE_WAY: {
    label: 'One-Way Yard Flow System',
    iconName: 'Compass',
    badgeColor: 'bg-sky-100 text-sky-800 border-sky-300',
    pinColor: '#0284C7',
    defaultSeverity: 'MEDIUM',
    descriptionPlaceholder: 'e.g. Clockwise one-way circulation. Reversing against flow strictly prohibited.'
  }
};

export function getDefaultSitePlanForSite(site: Partial<SiteRiskAssessment>): SitePlanData {
  const title = site.title || 'Delivery Site';
  const gateCode = site.businessSection?.gateSecurityCode || '#5820*';
  const heightLimit = site.businessSection?.vehicleConstraints?.maxHeightMeters || 4.5;
  const musterPoint = site.businessSection?.emergencyMusterPoint || 'Assembly Point A';

  const defaultAnnotations: SitePlanAnnotation[] = [
    {
      id: `ann-${Date.now()}-1`,
      xPercent: 18,
      yPercent: 78,
      type: 'SECURITY_GATE',
      label: 'Main Inbound Barrier & Gatehouse',
      description: `Security barrier stop line. Gate code: ${gateCode}. Drivers must present delivery reference before proceeding.`,
      severity: 'LOW',
      color: '#2563EB',
      createdAt: new Date().toISOString(),
      createdBy: 'Auto-Generated Baseline'
    },
    {
      id: `ann-${Date.now()}-2`,
      xPercent: 32,
      yPercent: 68,
      type: 'WEIGHBRIDGE',
      label: 'Gross Axle Weighbridge',
      description: 'Stop on vehicle scale plate for gross weight recording. Max speed 5mph strictly enforced.',
      severity: 'LOW',
      color: '#9333EA',
      createdAt: new Date().toISOString(),
      createdBy: 'Auto-Generated Baseline'
    },
    {
      id: `ann-${Date.now()}-3`,
      xPercent: 68,
      yPercent: 35,
      type: 'LOADING_BAY',
      label: 'Main Logistics Docks (Bays 1-8)',
      description: 'Flush hydraulic dock levelers. Straight reversing guidance. Red wheel chocks must be positioned immediately.',
      severity: 'MEDIUM',
      color: '#10B981',
      createdAt: new Date().toISOString(),
      createdBy: 'Auto-Generated Baseline'
    },
    {
      id: `ann-${Date.now()}-4`,
      xPercent: 54,
      yPercent: 52,
      type: 'PEDESTRIAN_PATH',
      label: 'Warehouse Shift Walkway',
      description: 'Green painted pedestrian corridor. Forklift and pedestrian cross-traffic interaction. Yield right of way.',
      severity: 'HIGH',
      color: '#0D9488',
      createdAt: new Date().toISOString(),
      createdBy: 'Auto-Generated Baseline'
    },
    {
      id: `ann-${Date.now()}-5`,
      xPercent: 82,
      yPercent: 72,
      type: 'MUSTER_POINT',
      label: musterPoint,
      description: 'Primary emergency evacuation assembly zone outside the perimeter fence.',
      severity: 'LOW',
      color: '#6366F1',
      createdAt: new Date().toISOString(),
      createdBy: 'Auto-Generated Baseline'
    },
    {
      id: `ann-${Date.now()}-6`,
      xPercent: 45,
      yPercent: 28,
      type: 'CLEARANCE_RESTRICTION',
      label: `Overhead Canopy Clearance (${heightLimit}m)`,
      description: `Maximum overhead vehicle clearance is ${heightLimit}m. High trailers must strictly use central apron path.`,
      severity: 'CRITICAL',
      color: '#F59E0B',
      createdAt: new Date().toISOString(),
      createdBy: 'Auto-Generated Baseline'
    }
  ];

  return {
    planType: 'BLUEPRINT',
    widthMeters: 220,
    lengthMeters: 160,
    annotations: defaultAnnotations,
    lastAnnotatedAt: new Date().toISOString()
  };
}
