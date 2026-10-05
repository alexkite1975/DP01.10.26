import { ScannedDocumentItem, DocumentExtractionDetails, HazardMatrixItem, SitePlanData } from '../types';

/**
 * Creates an SVG Data URL representing a realistic scanned physical risk assessment document / safety notice
 */
export function generateSampleDocumentDataUrl(
  company: string,
  siteName: string,
  refNumber: string,
  clearanceHeight: string,
  gateCode: string,
  hazards: string[]
): string {
  const svg = `
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 1130" width="800" height="1130" style="background:#fefefe; font-family: Arial, Helvetica, sans-serif;">
    <!-- Paper texture & border -->
    <rect width="800" height="1130" fill="#fcfbf9" />
    <rect x="25" y="25" width="750" height="1080" fill="#ffffff" stroke="#cbd5e1" stroke-width="2" rx="4" />
    
    <!-- Top Header Bar -->
    <rect x="35" y="35" width="730" height="75" fill="#0f172a" rx="2" />
    <text x="55" y="65" fill="#38bdf8" font-size="14" font-weight="bold" letter-spacing="1.5">SITE HEALTH &amp; SAFETY RISK ASSESSMENT (RAMS)</text>
    <text x="55" y="90" fill="#ffffff" font-size="22" font-weight="bold">${company}</text>
    <text x="745" y="65" fill="#94a3b8" font-size="12" text-anchor="end">DOC REF: ${refNumber}</text>
    <text x="745" y="88" fill="#22c55e" font-size="13" font-weight="bold" text-anchor="end">STATUS: ACTIVE / VERIFIED</text>
    
    <!-- Site Profile Box -->
    <rect x="35" y="125" width="730" height="135" fill="#f8fafc" stroke="#e2e8f0" stroke-width="1.5" rx="3" />
    <text x="55" y="152" fill="#475569" font-size="11" font-weight="bold">FACILITY / DEPOT NAME:</text>
    <text x="55" y="174" fill="#0f172a" font-size="16" font-weight="bold">${siteName}</text>
    <text x="55" y="196" fill="#64748b" font-size="13">Highlands Industrial Zone, Logistics Gateway Central, UK</text>
    <text x="55" y="218" fill="#2563eb" font-size="12" font-weight="bold">Access Coordinates: 52.4182° N, 1.7761° W • What3words: ///safe.truck.entry</text>

    <!-- Keypad & Clearance Warning Badge -->
    <rect x="520" y="140" width="225" height="105" fill="#fef2f2" stroke="#f87171" stroke-width="1.5" rx="4" />
    <text x="535" y="165" fill="#991b1b" font-size="12" font-weight="bold">CRITICAL VEHICLE LIMITS</text>
    <text x="535" y="190" fill="#7f1d1d" font-size="18" font-weight="bold">MAX HEIGHT: ${clearanceHeight}</text>
    <text x="535" y="210" fill="#0f172a" font-size="12">GATE KEYPAD PIN: <tspan font-weight="bold" fill="#dc2626">${gateCode}</tspan></text>
    <text x="535" y="230" fill="#475569" font-size="11">MAX WEIGHT: 44 TONNES</text>

    <!-- Section 1: Inbound Procedures & Rules -->
    <text x="45" y="285" fill="#0f172a" font-size="14" font-weight="bold">SECTION 1: INBOUND GATEHOUSE &amp; ACCESS PROCEDURES</text>
    <line x1="45" y1="295" x2="755" y2="295" stroke="#0f172a" stroke-width="2" />
    <rect x="45" y="305" width="710" height="90" fill="#ffffff" stroke="#e2e8f0" rx="3" />
    <text x="60" y="328" fill="#334155" font-size="12">• Inbound HGVs must halt at the red barrier stop line before entering the yard apron.</text>
    <text x="60" y="348" fill="#334155" font-size="12">• Report to Security Gatehouse Intercom (Channel 1). Quote booking reference and trailer number.</text>
    <text x="60" y="368" fill="#334155" font-size="12">• Site speed limit is strictly 10 MPH. Reverse lights and hazards must be engaged inside the yard.</text>
    <text x="60" y="388" fill="#334155" font-size="12">• Out-of-hours deliveries permitted only at designated Night Drop Bays 1-3 with gate key code ${gateCode}.</text>

    <!-- Section 2: PPE Requirements -->
    <text x="45" y="420" fill="#0f172a" font-size="14" font-weight="bold">SECTION 2: MANDATORY PPE ON SITE</text>
    <line x1="45" y1="430" x2="755" y2="430" stroke="#0f172a" stroke-width="1.5" />
    <g transform="translate(45, 440)">
      <rect x="0" y="0" width="165" height="40" fill="#eff6ff" stroke="#bfdbfe" rx="3" />
      <text x="12" y="25" fill="#1e40af" font-size="12" font-weight="bold">✓ Hi-Vis Vest Class 3</text>
      
      <rect x="180" y="0" width="165" height="40" fill="#eff6ff" stroke="#bfdbfe" rx="3" />
      <text x="192" y="25" fill="#1e40af" font-size="12" font-weight="bold">✓ Safety Boots S3</text>
      
      <rect x="360" y="0" width="165" height="40" fill="#eff6ff" stroke="#bfdbfe" rx="3" />
      <text x="372" y="25" fill="#1e40af" font-size="12" font-weight="bold">✓ Hard Hat EN397</text>

      <rect x="540" y="0" width="170" height="40" fill="#eff6ff" stroke="#bfdbfe" rx="3" />
      <text x="552" y="25" fill="#1e40af" font-size="12" font-weight="bold">✓ Safety Glasses / Gloves</text>
    </g>

    <!-- Section 3: Hazard Matrix Table -->
    <text x="45" y="515" fill="#0f172a" font-size="14" font-weight="bold">SECTION 3: IDENTIFIED SITE HAZARDS &amp; CONTROL MEASURES</text>
    <line x1="45" y1="525" x2="755" y2="525" stroke="#0f172a" stroke-width="1.5" />
    
    <!-- Table Header -->
    <rect x="45" y="535" width="710" height="30" fill="#e2e8f0" />
    <text x="55" y="555" fill="#1e293b" font-size="11" font-weight="bold">ID</text>
    <text x="90" y="555" fill="#1e293b" font-size="11" font-weight="bold">HAZARD DESCRIPTION</text>
    <text x="410" y="555" fill="#1e293b" font-size="11" font-weight="bold">SEV x LIK</text>
    <text x="490" y="555" fill="#1e293b" font-size="11" font-weight="bold">MANDATORY CONTROL MEASURE</text>

    <!-- Table Rows -->
    <rect x="45" y="565" width="710" height="48" fill="#ffffff" stroke="#e2e8f0" stroke-width="0.5" />
    <text x="55" y="594" fill="#0f172a" font-size="11" font-weight="bold">H-01</text>
    <text x="90" y="586" fill="#0f172a" font-size="11" font-weight="bold">${hazards[0] || 'Blind-side reverse onto loading bays'}</text>
    <text x="90" y="602" fill="#64748b" font-size="10">High risk of trailer damage or collision</text>
    <rect x="410" y="575" width="55" height="24" fill="#fee2e2" rx="3" />
    <text x="437" y="591" fill="#991b1b" font-size="11" font-weight="bold" text-anchor="middle">4 x 3 (12)</text>
    <text x="490" y="586" fill="#334155" font-size="10">Banksman assistance required during peak hours.</text>
    <text x="490" y="602" fill="#334155" font-size="10">Sound horn twice before reversing. Guide mirrors engaged.</text>

    <rect x="45" y="613" width="710" height="48" fill="#f8fafc" stroke="#e2e8f0" stroke-width="0.5" />
    <text x="55" y="642" fill="#0f172a" font-size="11" font-weight="bold">H-02</text>
    <text x="90" y="634" fill="#0f172a" font-size="11" font-weight="bold">${hazards[1] || 'Forklift & pedestrian crossing corridor'}</text>
    <text x="90" y="650" fill="#64748b" font-size="10">Counterbalance FLTs crossing apron to waste skips</text>
    <rect x="410" y="623" width="55" height="24" fill="#fef3c7" rx="3" />
    <text x="437" y="639" fill="#92400e" font-size="11" font-weight="bold" text-anchor="middle">3 x 3 (9)</text>
    <text x="490" y="634" fill="#334155" font-size="10">Drivers must remain inside vehicle cab or marked green</text>
    <text x="490" y="650" fill="#334155" font-size="10">walkway. FLT blue safety ground spotlights fitted.</text>

    <rect x="45" y="661" width="710" height="48" fill="#ffffff" stroke="#e2e8f0" stroke-width="0.5" />
    <text x="55" y="690" fill="#0f172a" font-size="11" font-weight="bold">H-03</text>
    <text x="90" y="682" fill="#0f172a" font-size="11" font-weight="bold">${hazards[2] || 'Canopy overhead clearance limit (' + clearanceHeight + ')'}</text>
    <text x="90" y="698" fill="#64748b" font-size="10">Overhead sprinklers and structural steelwork</text>
    <rect x="410" y="671" width="55" height="24" fill="#fee2e2" rx="3" />
    <text x="437" y="687" fill="#991b1b" font-size="11" font-weight="bold" text-anchor="middle">5 x 2 (10)</text>
    <text x="490" y="682" fill="#334155" font-size="10">Height gauge banner suspended at 4.45m.</text>
    <text x="490" y="698" fill="#334155" font-size="10">Check GPS vehicle profile and radio aerials before docking.</text>

    <!-- Section 4: Loading Bay & Evacuation Muster Details -->
    <text x="45" y="745" fill="#0f172a" font-size="14" font-weight="bold">SECTION 4: LOADING BAYS &amp; EMERGENCY MUSTER</text>
    <line x1="45" y1="755" x2="755" y2="755" stroke="#0f172a" stroke-width="1.5" />
    <rect x="45" y="765" width="345" height="110" fill="#ffffff" stroke="#e2e8f0" rx="3" />
    <text x="60" y="790" fill="#0f172a" font-size="12" font-weight="bold">Loading Bay Specifications:</text>
    <text x="60" y="812" fill="#334155" font-size="11">• Total Bays: 12 Flush Dock levellers</text>
    <text x="60" y="830" fill="#334155" font-size="11">• Wheel Chocking: Dual rubber chocks MANDATORY</text>
    <text x="60" y="848" fill="#334155" font-size="11">• Trailer Ignition Keys: Hand into Goods In office</text>
    <text x="60" y="866" fill="#334155" font-size="11">• Reversing: Sound horn twice before entering bay apron</text>

    <rect x="410" y="765" width="345" height="110" fill="#f0fdf4" stroke="#86efac" rx="3" />
    <text x="425" y="790" fill="#166534" font-size="12" font-weight="bold">Emergency Evacuation Protocol:</text>
    <text x="425" y="812" fill="#166534" font-size="11">• Primary Muster Point: Muster Point B (North-East Perimeter)</text>
    <text x="425" y="830" fill="#166534" font-size="11">• Fire Alarm Signal: Continuous siren tone</text>
    <text x="425" y="848" fill="#166534" font-size="11">• Site Manager: Robert Hayes (+44 7700 900331)</text>
    <text x="425" y="866" fill="#166534" font-size="11">• First Aid Post: Gatehouse &amp; Bay 1 Office</text>

    <!-- Sign-off & Stamp -->
    <rect x="45" y="900" width="710" height="110" fill="#f8fafc" stroke="#cbd5e1" stroke-dasharray="4 2" rx="4" />
    <text x="65" y="930" fill="#475569" font-size="12" font-weight="bold">H&amp;S COMPETENT PERSON SIGN-OFF:</text>
    <text x="65" y="955" fill="#0f172a" font-size="13">Assessed by: Capt. Alan Thornton (Chartered CMIOSH Assessor)</text>
    <text x="65" y="975" fill="#64748b" font-size="11">Next Annual Review Date: September 2027 • Standard: ISO 45001 / HSE GS6</text>

    <!-- Stamp Emblem -->
    <g transform="translate(560, 915)">
      <circle cx="70" cy="40" r="38" fill="none" stroke="#dc2626" stroke-width="2.5" stroke-dasharray="4 2" />
      <text x="70" y="32" fill="#dc2626" font-size="9" font-weight="bold" text-anchor="middle" letter-spacing="1">APPROVED</text>
      <text x="70" y="44" fill="#dc2626" font-size="11" font-weight="bold" text-anchor="middle">FLEET H&amp;S</text>
      <text x="70" y="55" fill="#dc2626" font-size="8" text-anchor="middle">AUDITED 2026</text>
    </g>

    <!-- Footer Bar -->
    <text x="400" y="1060" fill="#94a3b8" font-size="10" text-anchor="middle">Page 1 of 1 • Official Logistics Site Risk Assessment • Confidential Driver Guidance Document</text>
  </svg>`;

  return `data:image/svg+xml;charset=utf-8,${encodeURIComponent(svg.trim())}`;
}

export interface SampleAssessmentDoc {
  id: string;
  name: string;
  subtitle: string;
  company: string;
  siteName: string;
  refNumber: string;
  clearanceHeight: string;
  gateCode: string;
  hazards: string[];
  dataUrl: string;
}

export const SAMPLE_ASSESSMENT_DOCS: SampleAssessmentDoc[] = [
  {
    id: 'sample-dhl',
    name: 'DHL Supply Chain RAMS Sheet',
    subtitle: 'Printed Site Safety Sheet (Highlands Logistics Park)',
    company: 'DHL Supply Chain UK & Ireland',
    siteName: 'DHL Solihull Express Superhub',
    refNumber: 'DHL-RAMS-2026-44B',
    clearanceHeight: '4.40m',
    gateCode: '#6140*',
    hazards: [
      'Blind-side reversing onto loading bays',
      'Forklift and pedestrian cross-traffic corridor',
      'Canopy overhead clearance limit (4.40m)'
    ],
    dataUrl: generateSampleDocumentDataUrl(
      'DHL Supply Chain UK & Ireland',
      'DHL Solihull Express Superhub',
      'DHL-RAMS-2026-44B',
      '4.40m',
      '#6140*',
      [
        'Blind-side reversing onto loading bays',
        'Forklift and pedestrian cross-traffic corridor',
        'Canopy overhead clearance limit (4.40m)'
      ]
    )
  },
  {
    id: 'sample-royal-mail',
    name: 'Royal Mail Inbound Logistics Audit',
    subtitle: 'Official Fleet Inbound Delivery Protocol',
    company: 'Royal Mail Operations Ltd',
    siteName: 'Royal Mail Farringdon Mail Terminal',
    refNumber: 'RM-SAFETY-8891-LON',
    clearanceHeight: '4.15m',
    gateCode: '#8920*',
    hazards: [
      'Low rail arch clearance (4.15m max)',
      'Tight 90° access turn off public highway',
      'Heavy pedestrian foot traffic during shift changes'
    ],
    dataUrl: generateSampleDocumentDataUrl(
      'Royal Mail Operations Ltd',
      'Royal Mail Farringdon Mail Terminal',
      'RM-SAFETY-8891-LON',
      '4.15m',
      '#8920*',
      [
        'Low rail arch clearance (4.15m max)',
        'Tight 90° access turn off public highway',
        'Heavy pedestrian foot traffic during shift changes'
      ]
    )
  },
  {
    id: 'sample-dpd',
    name: 'DPD Hinckley Superhub Assessment',
    subtitle: 'Cross-Dock Depot Operating Safety Standard',
    company: 'DPD Group UK Logistics',
    siteName: 'DPD Hinckley Superhub 4',
    refNumber: 'DPD-HS-HUB4-2026',
    clearanceHeight: '4.65m',
    gateCode: '#4910*',
    hazards: [
      'Fast-moving yard shunter vehicles (15mph)',
      'High-bay dock leveller lip trip hazards',
      'Inbound weighbridge congestion spillover'
    ],
    dataUrl: generateSampleDocumentDataUrl(
      'DPD Group UK Logistics',
      'DPD Hinckley Superhub 4',
      'DPD-HS-HUB4-2026',
      '4.65m',
      '#4910*',
      [
        'Fast-moving yard shunter vehicles (15mph)',
        'High-bay dock leveller lip trip hazards',
        'Inbound weighbridge congestion spillover'
      ]
    )
  }
];

/**
 * Reads a user-uploaded File into a ScannedDocumentItem
 */
export function readUploadedFile(file: File): Promise<ScannedDocumentItem> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const dataUrl = e.target?.result as string;
      if (!dataUrl) {
        reject(new Error('Failed reading file data'));
        return;
      }

      resolve({
        id: `doc-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
        name: file.name,
        dataUrl,
        mimeType: file.type || (file.name.endsWith('.pdf') ? 'application/pdf' : 'image/jpeg'),
        sizeBytes: file.size,
        uploadedAt: new Date().toISOString()
      });
    };
    reader.onerror = () => reject(new Error('Failed reading file'));
    reader.readAsDataURL(file);
  });
}

/**
 * API call to AI Risk Assessment Generator passing the scanned documents
 */
export async function processScannedRiskAssessment(params: {
  scannedDocuments: ScannedDocumentItem[];
  fallbackTitle?: string;
  fallbackAddress?: string;
  promptNotes?: string;
}): Promise<any> {
  const payload = {
    title: params.fallbackTitle || 'Scanned Site Risk Assessment',
    address: params.fallbackAddress || '',
    scannedDocuments: params.scannedDocuments.map((d) => d.dataUrl),
    isExistingDocumentScan: true,
    promptNotes: params.promptNotes || 'Transcribe and digitize existing risk assessment document'
  };

  const res = await fetch('/api/ai-risk-assessment', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload)
  });

  if (!res.ok) {
    throw new Error(`AI processing failed with status ${res.status}`);
  }

  const json = await res.json();
  return json;
}
