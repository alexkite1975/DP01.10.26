import { SiteRiskAssessment, DriverVehicleProfile } from '../types';

export interface VoiceCopilotResponse {
  spokenResponse: string;
  highlightedValue: string;
  visualBadge: string;
  category: 'GATE_CODE' | 'CLEARANCE' | 'BAY_GUIDANCE' | 'PPE' | 'MUSTER_POINT' | 'CONTACT' | 'HAZARDS' | 'GENERAL';
  cautionWarning?: string;
}

export async function askInCabVoiceCopilot(
  query: string,
  siteContext: SiteRiskAssessment,
  vehicleProfile: DriverVehicleProfile
): Promise<VoiceCopilotResponse> {
  try {
    const response = await fetch('/api/in-cab-voice-copilot', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        query,
        siteContext,
        vehicleProfile
      })
    });

    if (!response.ok) {
      throw new Error(`HTTP error ${response.status}`);
    }

    const json = await response.json();
    if (json.data) {
      return json.data;
    }
  } catch (err) {
    console.warn('Voice copilot network call failed, falling back to local evaluation:', err);
  }

  // Client-side emergency fallback
  const gateCode = siteContext.businessSection?.gateSecurityCode || '#5820*';
  const vHeight = vehicleProfile.heightMeters;
  const sHeight = siteContext.businessSection?.vehicleConstraints?.maxHeightMeters || 4.5;
  const margin = +(sHeight - vHeight).toFixed(2);
  const qLower = query.toLowerCase();

  if (qLower.includes('height') || qLower.includes('clearance') || qLower.includes('bridge')) {
    return {
      spokenResponse: margin >= 0
        ? `Site clearance is ${sHeight} meters. You have ${margin} meters safe clearance.`
        : `Warning! Your vehicle height is ${vHeight} meters, which exceeds the ${sHeight} meter limit.`,
      highlightedValue: `${sHeight}m (${margin > 0 ? '+' : ''}${margin}m)`,
      visualBadge: 'HEIGHT CLEARANCE',
      category: 'CLEARANCE',
      cautionWarning: margin < 0 ? 'DO NOT ENTER - CRITICAL RESTRICTION' : undefined
    };
  }

  return {
    spokenResponse: `Gate security code is ${gateCode}. Yard speed limit is 10 mph.`,
    highlightedValue: gateCode,
    visualBadge: 'GATE CODE',
    category: 'GATE_CODE'
  };
}
