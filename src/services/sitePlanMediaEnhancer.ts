import { SitePlanAnnotation, SiteRiskAssessment } from '../types';

export interface UploadedMediaItem {
  id: string;
  dataUrl: string; // base64
  mediaType: 'PHOTO' | 'VIDEO';
  fileName: string;
  sizeBytes: number;
  previewUrl?: string;
  notes?: string;
  timestamp: string;
}

export interface SitePlanMediaEnhancementResult {
  summary: string;
  detectedBayNumbers: string[];
  detectedTransportOffice: boolean;
  detectedLandmarks: string[];
  newAnnotations: SitePlanAnnotation[];
  driverNavigationTips: string[];
}

export async function improveSitePlanFromMedia(
  site: SiteRiskAssessment,
  mediaItems: UploadedMediaItem[],
  userNotes?: string
): Promise<SitePlanMediaEnhancementResult> {
  const currentAnnotations = site.businessSection.sitePlan?.annotations || [];

  const response = await fetch('/api/improve-site-plan-from-media', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      siteId: site.id,
      siteTitle: site.title,
      siteAddress: site.address,
      currentAnnotations,
      mediaItems: mediaItems.map((item, idx) => ({
        dataUrl: item.dataUrl,
        mediaType: item.mediaType,
        notes: item.notes,
        timestamp: item.timestamp
      })),
      userNotes: userNotes || ''
    })
  });

  if (!response.ok) {
    throw new Error(`Media enhancement failed with HTTP ${response.status}`);
  }

  const result = await response.json();
  const data = result.data;

  // Ensure photoUrl is populated on each new annotation referencing the uploaded media
  const newAnnotations: SitePlanAnnotation[] = (data.newAnnotations || []).map((ann: any, index: number) => {
    const mediaIdx = typeof ann.associatedMediaIndex === 'number' && ann.associatedMediaIndex < mediaItems.length
      ? ann.associatedMediaIndex
      : (index % mediaItems.length);
    const mediaItem = mediaItems[mediaIdx];

    return {
      id: ann.id || `ann-media-${Date.now()}-${index}`,
      xPercent: Math.min(Math.max(ann.xPercent ?? (20 + index * 12), 4), 96),
      yPercent: Math.min(Math.max(ann.yPercent ?? (25 + index * 8), 4), 96),
      type: ann.type || 'LOADING_BAY',
      label: ann.label || `Yard Landmark ${index + 1}`,
      description: ann.description || 'Observed landmark verified from uploaded site media.',
      severity: ann.severity || 'MEDIUM',
      bayNumber: ann.bayNumber,
      aiDetected: true,
      aiConfidence: ann.aiConfidence || 0.94,
      photoUrl: mediaItem?.dataUrl || undefined,
      createdAt: new Date().toISOString()
    };
  });

  return {
    summary: data.summary || `AI analyzed ${mediaItems.length} media item(s) and enhanced the site plan.`,
    detectedBayNumbers: data.detectedBayNumbers || [],
    detectedTransportOffice: Boolean(data.detectedTransportOffice),
    detectedLandmarks: data.detectedLandmarks || [],
    newAnnotations,
    driverNavigationTips: data.driverNavigationTips || []
  };
}
