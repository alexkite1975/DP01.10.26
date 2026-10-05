import { SiteRiskAssessment, SitePlanAnnotation, RiskLevel } from '../types';

export interface SatelliteYardAnalysisResult {
  yardLayoutDescription: string;
  estimatedApronWidthMeters: number;
  recommendedSpeedLimitMph: number;
  annotations: SitePlanAnnotation[];
  satelliteImageUrl?: string;
}

export async function analyzeSatelliteYard(
  site: Partial<SiteRiskAssessment>
): Promise<SatelliteYardAnalysisResult> {
  const response = await fetch('/api/analyze-satellite-yard', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      coordinates: site.coordinates,
      address: site.address,
      title: site.title,
      currentAnnotations: site.businessSection?.sitePlan?.annotations || []
    })
  });

  if (!response.ok) {
    throw new Error(`Failed to analyze satellite yard: ${response.status}`);
  }

  const json = await response.json();
  if (json.data) {
    return json.data;
  }

  throw new Error('No data received from satellite yard analysis');
}
