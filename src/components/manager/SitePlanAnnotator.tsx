'use client';
import React, { useState, useRef, useEffect } from 'react';
import {
  AlertTriangle,
  Lock,
  Truck,
  Footprints,
  ShieldCheck,
  ShieldAlert,
  Scale,
  Clock,
  EyeOff,
  Layers,
  Plus,
  Trash2,
  Edit3,
  Download,
  Compass,
  MapPin,
  CheckCircle2,
  X,
  Info,
  Sparkles,
  Maximize2,
  Satellite,
  Radio,
  Camera,
  Video,
  Building2,
  ZoomIn,
  ZoomOut,
  Upload,
  RefreshCw,
  Image as ImageIcon,
  Move,
  Hand,
  ChevronUp,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  RotateCcw,
  Crosshair
} from 'lucide-react';
import {
  SiteRiskAssessment,
  SitePlanData,
  SitePlanAnnotation,
  SitePlanAnnotationType,
  RiskLevel
} from '../types';
import { ANNOTATION_TYPE_CONFIG, getDefaultSitePlanForSite } from '../services/sitePlanService';
import { analyzeSatelliteYard } from '../services/satelliteYardService';
import { getGoogleStaticSatelliteMapUrl } from '../services/googlePlaces';
import { UploadSiteMediaModal } from './UploadSiteMediaModal';

interface SitePlanAnnotatorProps {
  site: SiteRiskAssessment;
  onUpdateSitePlan?: (updatedPlan: SitePlanData) => void;
  readOnly?: boolean;
}

export const SitePlanAnnotator: React.FC<SitePlanAnnotatorProps> = ({
  site,
  onUpdateSitePlan,
  readOnly = false
}) => {
  // Ensure we have a site plan, fallback to generated default
  const planData: SitePlanData = site.businessSection.sitePlan || getDefaultSitePlanForSite(site);

  // Check if custom CAD blueprint was explicitly uploaded by user (data URI)
  const isCustomCad = Boolean(
    planData.backgroundUrl &&
    typeof planData.backgroundUrl === 'string' &&
    planData.backgroundUrl.startsWith('data:image/')
  );

  const [planType, setPlanType] = useState<'BLUEPRINT' | 'SATELLITE'>(
    planData.planType === 'SATELLITE' || isCustomCad ? 'SATELLITE' : 'BLUEPRINT'
  );
  const [annotations, setAnnotations] = useState<SitePlanAnnotation[]>(planData.annotations || []);
  const [selectedAnnotationId, setSelectedAnnotationId] = useState<string | null>(null);
  const [filterCategory, setFilterCategory] = useState<string>('ALL');

  // Sync state when site changes
  useEffect(() => {
    const freshPlan = site.businessSection.sitePlan || getDefaultSitePlanForSite(site);
    setAnnotations(freshPlan.annotations || []);
    if (freshPlan.planType === 'SATELLITE') {
      setPlanType('SATELLITE');
    }
  }, [site.id, site.businessSection.sitePlan]);

  // New annotation creation state
  const [isAddingPin, setIsAddingPin] = useState(false);
  const [tempCoords, setTempCoords] = useState<{ xPercent: number; yPercent: number } | null>(null);
  const [editingAnnotation, setEditingAnnotation] = useState<SitePlanAnnotation | null>(null);

  // Satellite Yard Analysis State
  const [isAnalyzingSatellite, setIsAnalyzingSatellite] = useState(false);
  const [satelliteAnalysisNotice, setSatelliteAnalysisNotice] = useState<string | null>(null);
  const [satelliteZoom, setSatelliteZoom] = useState<number>(18);
  const [satelliteMapType, setSatelliteMapType] = useState<'satellite' | 'hybrid' | 'roadmap'>('hybrid');
  const [isGoogleMapReady, setIsGoogleMapReady] = useState(false);
  const yardImageInputRef = useRef<HTMLInputElement>(null);

  // Google Maps Instance & Marker Refs for Live Explorer Mode
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<any>(null);
  const googleMarkersRef = useRef<any[]>([]);
  const activeInfoWindowRef = useRef<any>(null);

  // Handle custom yard blueprint or drone image upload
  const handleYardImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      const dataUrl = event.target?.result as string;
      if (dataUrl) {
        if (onUpdateSitePlan) {
          onUpdateSitePlan({
            ...planData,
            planType: 'SATELLITE',
            backgroundUrl: dataUrl,
            lastAnnotatedAt: new Date().toISOString()
          });
        }
        setPlanType('SATELLITE');
        setSatelliteAnalysisNotice('Custom site blueprint / drone aerial image loaded.');
      }
    };
    reader.readAsDataURL(file);
  };

  // Revert back to live Google Satellite
  const handleResetToGoogleSatellite = () => {
    if (onUpdateSitePlan) {
      onUpdateSitePlan({
        ...planData,
        backgroundUrl: undefined,
        lastAnnotatedAt: new Date().toISOString()
      });
    }
    setSatelliteAnalysisNotice('Reset to live Google Satellite imagery.');
  };

  // AI Media (Photo / Video) Upload State
  const [isMediaUploadOpen, setIsMediaUploadOpen] = useState(false);
  const [mediaImprovementNotice, setMediaImprovementNotice] = useState<string | null>(null);

  // Form fields for editing/adding
  const [formType, setFormType] = useState<SitePlanAnnotationType>('HAZARD');
  const [formLabel, setFormLabel] = useState('');
  const [formDescription, setFormDescription] = useState('');
  const [formSeverity, setFormSeverity] = useState<RiskLevel>('HIGH');

  const canvasRef = useRef<HTMLDivElement>(null);

  // Yard Plan Viewport Zoom & Move (Pan) State
  const [zoom, setZoom] = useState<number>(1);
  const [pan, setPan] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState<boolean>(false);
  const [activeTool, setActiveTool] = useState<'MOVE' | 'ANNOTATE'>('MOVE');
  const activeToolRef = useRef<'MOVE' | 'ANNOTATE'>('MOVE');
  useEffect(() => {
    activeToolRef.current = activeTool;
  }, [activeTool]);

  const panStartRef = useRef<{ clientX: number; clientY: number; startPanX: number; startPanY: number }>({
    clientX: 0,
    clientY: 0,
    startPanX: 0,
    startPanY: 0
  });
  const dragDistanceRef = useRef<number>(0);
  const touchDistanceRef = useRef<number | null>(null);

  // Geographic conversions between Depot Coordinates and Yard Canvas Percentages
  const YARD_SPAN_METERS_X = 260;
  const YARD_SPAN_METERS_Y = 180;
  const METERS_PER_DEG_LAT = 111139;
  const metersPerDegLng = 111139 * Math.cos((site.coordinates.lat * Math.PI) / 180);

  // Initialize and Sync Google Map for Map Explorer navigation
  useEffect(() => {
    if (planType !== 'SATELLITE' || isCustomCad) {
      if (mapInstanceRef.current) {
        googleMarkersRef.current.forEach((m) => m.setMap(null));
        googleMarkersRef.current = [];
        if (activeInfoWindowRef.current) {
          activeInfoWindowRef.current.close();
        }
        mapInstanceRef.current = null;
      }
      setIsGoogleMapReady(false);
      return;
    }

    let isCancelled = false;
    let timer: NodeJS.Timeout | null = null;

    const initMap = () => {
      if (isCancelled) return false;
      if (typeof window === 'undefined' || !(window as any).google?.maps || !mapContainerRef.current) {
        return false;
      }
      const google = (window as any).google;

      const mapTypeTarget =
        satelliteMapType === 'roadmap'
          ? google.maps.MapTypeId.ROADMAP
          : satelliteMapType === 'satellite'
          ? google.maps.MapTypeId.SATELLITE
          : google.maps.MapTypeId.HYBRID;

      if (!mapInstanceRef.current || mapInstanceRef.current.getDiv() !== mapContainerRef.current) {
        const map = new google.maps.Map(mapContainerRef.current, {
          center: { lat: site.coordinates.lat, lng: site.coordinates.lng },
          zoom: satelliteZoom,
          mapTypeId: mapTypeTarget,
          gestureHandling: 'greedy', // Exact parity with Map Explorer: 1-finger pan, 2-finger pinch
          disableDefaultUI: false,
          zoomControl: true,
          streetViewControl: true,
          mapTypeControl: false,
          fullscreenControl: true,
          tilt: 0,
          internalUsageAttributionIds: ['gmp_git_agentskills_v1']
        });

        map.addListener('zoom_changed', () => {
          const newZoom = map.getZoom();
          if (typeof newZoom === 'number') {
            setSatelliteZoom(newZoom);
          }
        });

        map.addListener('click', (e: any) => {
          if (activeToolRef.current === 'ANNOTATE' && e.latLng) {
            const clickedLat = e.latLng.lat();
            const clickedLng = e.latLng.lng();
            const deltaLat = clickedLat - site.coordinates.lat;
            const deltaLng = clickedLng - site.coordinates.lng;

            const yPct = 50 - (deltaLat / (YARD_SPAN_METERS_Y / METERS_PER_DEG_LAT)) * 100;
            const xPct = 50 + (deltaLng / (YARD_SPAN_METERS_X / metersPerDegLng)) * 100;
            const boundedX = Math.max(5, Math.min(95, Number(xPct.toFixed(1))));
            const boundedY = Math.max(5, Math.min(95, Number(yPct.toFixed(1))));

            setTempCoords({ xPercent: boundedX, yPercent: boundedY });
            setFormType('HAZARD');
            setFormLabel('New Yard Point');
            setFormDescription(`Coordinates: ${clickedLat.toFixed(5)}, ${clickedLng.toFixed(5)}`);
            setFormSeverity('HIGH');
            setEditingAnnotation(null);
            setIsAddingPin(true);
          } else {
            setSelectedAnnotationId(null);
          }
        });

        google.maps.event.addListenerOnce(map, 'idle', () => {
          if (!isCancelled) {
            setIsGoogleMapReady(true);
          }
        });

        mapInstanceRef.current = map;
        return true;
      } else {
        mapInstanceRef.current.setMapTypeId(mapTypeTarget);
        setIsGoogleMapReady(true);
        return true;
      }
    };

    if (!initMap()) {
      timer = setInterval(() => {
        if (initMap() && timer) {
          clearInterval(timer);
        }
      }, 150);
    }

    return () => {
      isCancelled = true;
      if (timer) clearInterval(timer);
    };
  }, [planType, isCustomCad, site.coordinates.lat, site.coordinates.lng, satelliteMapType]);

  // Synchronize Google Map Markers for Annotations
  useEffect(() => {
    if (planType !== 'SATELLITE' || isCustomCad || !mapInstanceRef.current) return;
    if (typeof window === 'undefined' || !(window as any).google?.maps) return;

    const google = (window as any).google;

    // Remove stale markers
    googleMarkersRef.current.forEach((m) => m.setMap(null));
    googleMarkersRef.current = [];

    annotations.forEach((ann) => {
      const isSelected = selectedAnnotationId === ann.id;
      const deltaLat = ((50 - ann.yPercent) / 100) * (YARD_SPAN_METERS_Y / METERS_PER_DEG_LAT);
      const deltaLng = ((ann.xPercent - 50) / 100) * (YARD_SPAN_METERS_X / metersPerDegLng);
      const pos = {
        lat: site.coordinates.lat + deltaLat,
        lng: site.coordinates.lng + deltaLng
      };

      const config = ANNOTATION_TYPE_CONFIG[ann.type] || ANNOTATION_TYPE_CONFIG.HAZARD;
      const color = ann.color || config.pinColor || '#2563eb';
      const size = isSelected ? 40 : 32;
      const letter = ann.bayNumber
        ? ann.bayNumber.slice(0, 3)
        : ann.type === 'LOADING_BAY'
        ? 'BAY'
        : ann.type === 'SECURITY_GATE'
        ? 'GATE'
        : ann.type === 'TRANSPORT_OFFICE'
        ? 'OFC'
        : '!';

      const svg = `
        <svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size + 8}" viewBox="0 0 36 44">
          <path d="M18 0 C8 0 0 8 0 18 C0 30 18 44 18 44 C18 44 36 30 36 18 C36 8 28 0 18 0 Z" fill="${color}" stroke="#ffffff" stroke-width="2.5"/>
          <circle cx="18" cy="18" r="10" fill="#ffffff"/>
          <text x="18" y="21" font-size="8.5" font-weight="bold" fill="${color}" text-anchor="middle" font-family="system-ui, sans-serif">${letter}</text>
        </svg>
      `;

      const marker = new google.maps.Marker({
        position: pos,
        map: mapInstanceRef.current,
        title: ann.label,
        icon: {
          url: 'data:image/svg+xml;charset=UTF-8,' + encodeURIComponent(svg),
          scaledSize: new google.maps.Size(size, size + 8),
          anchor: new google.maps.Point(size / 2, size + 8)
        },
        zIndex: isSelected ? 999 : 100
      });

      const infoContent = `
        <div style="padding: 6px 8px; font-family: system-ui, -apple-system, sans-serif; max-width: 220px; color: #0f172a;">
          <div style="display: flex; align-items: center; gap: 6px; margin-bottom: 2px;">
            <span style="display: inline-block; width: 8px; height: 8px; border-radius: 50%; background-color: ${color};"></span>
            <strong style="font-size: 12px; color: #0f172a;">${ann.label}</strong>
          </div>
          <div style="font-size: 10px; color: #64748b; margin-bottom: 4px; font-weight: 600;">${config.label}</div>
          <div style="font-size: 11px; color: #334155; line-height: 1.35;">${ann.description}</div>
          ${ann.severity ? `<div style="margin-top: 4px; font-size: 10px; font-weight: bold; color: ${color};">Risk: ${ann.severity}</div>` : ''}
        </div>
      `;

      const infoWindow = new google.maps.InfoWindow({
        content: infoContent
      });

      marker.addListener('click', () => {
        setSelectedAnnotationId(ann.id);
        if (activeInfoWindowRef.current) {
          activeInfoWindowRef.current.close();
        }
        infoWindow.open(mapInstanceRef.current, marker);
        activeInfoWindowRef.current = infoWindow;
      });

      if (isSelected) {
        if (activeInfoWindowRef.current) {
          activeInfoWindowRef.current.close();
        }
        infoWindow.open(mapInstanceRef.current, marker);
        activeInfoWindowRef.current = infoWindow;
      }

      googleMarkersRef.current.push(marker);
    });
  }, [annotations, selectedAnnotationId, planType, isCustomCad, site.coordinates.lat, site.coordinates.lng]);

  // Clamp pan based on current zoom so the site plan can be explored freely around the yard and local area
  const clampPan = (x: number, y: number, currentZoom: number) => {
    if (!canvasRef.current) return { x, y };
    const rect = canvasRef.current.getBoundingClientRect();
    const maxPanX = Math.max(360, (currentZoom * rect.width) / 2);
    const maxPanY = Math.max(280, (currentZoom * rect.height) / 2);
    return {
      x: Math.min(maxPanX, Math.max(-maxPanX, x)),
      y: Math.min(maxPanY, Math.max(-maxPanY, y))
    };
  };

  const handleZoomIn = () => {
    if (planType === 'SATELLITE' && !isCustomCad && mapInstanceRef.current) {
      const cur = mapInstanceRef.current.getZoom() || satelliteZoom;
      mapInstanceRef.current.setZoom(Math.min(21, cur + 1));
    } else {
      setZoom((prev) => {
        const next = Math.min(4, Number((prev + 0.35).toFixed(2)));
        setPan((curr) => clampPan(curr.x, curr.y, next));
        return next;
      });
    }
  };

  const handleZoomOut = () => {
    if (planType === 'SATELLITE' && !isCustomCad && mapInstanceRef.current) {
      const cur = mapInstanceRef.current.getZoom() || satelliteZoom;
      mapInstanceRef.current.setZoom(Math.max(12, cur - 1));
    } else {
      setZoom((prev) => {
        const next = Math.max(1, Number((prev - 0.35).toFixed(2)));
        setPan((curr) => clampPan(curr.x, curr.y, next));
        return next;
      });
    }
  };

  const handleResetView = () => {
    if (planType === 'SATELLITE' && !isCustomCad && mapInstanceRef.current) {
      mapInstanceRef.current.panTo({ lat: site.coordinates.lat, lng: site.coordinates.lng });
      mapInstanceRef.current.setZoom(18);
      setSatelliteZoom(18);
    } else {
      setZoom(1);
      setPan({ x: 0, y: 0 });
    }
  };

  const handleMove = (deltaX: number, deltaY: number) => {
    if (planType === 'SATELLITE' && !isCustomCad && mapInstanceRef.current) {
      // Smooth pan on Google Maps (deltaX, deltaY in pixels)
      mapInstanceRef.current.panBy(-deltaX, -deltaY);
    } else {
      setPan((prev) => clampPan(prev.x + deltaX, prev.y + deltaY, zoom));
    }
  };

  const handleSelectAnnotation = (annId: string) => {
    setSelectedAnnotationId(annId);
    const ann = annotations.find((a) => a.id === annId);
    if (!ann) return;

    if (planType === 'SATELLITE' && !isCustomCad && mapInstanceRef.current) {
      const deltaLat = ((50 - ann.yPercent) / 100) * (YARD_SPAN_METERS_Y / METERS_PER_DEG_LAT);
      const deltaLng = ((ann.xPercent - 50) / 100) * (YARD_SPAN_METERS_X / metersPerDegLng);
      mapInstanceRef.current.panTo({
        lat: site.coordinates.lat + deltaLat,
        lng: site.coordinates.lng + deltaLng
      });
      mapInstanceRef.current.setZoom(19);
      setSatelliteZoom(19);
    } else if (canvasRef.current) {
      const effectiveZoom = zoom > 1 ? zoom : 1.5;
      if (zoom <= 1) setZoom(1.5);
      const rect = canvasRef.current.getBoundingClientRect();
      const targetPanX = (0.5 - ann.xPercent / 100) * rect.width * (effectiveZoom - 1);
      const targetPanY = (0.5 - ann.yPercent / 100) * rect.height * (effectiveZoom - 1);
      setPan(clampPan(targetPanX, targetPanY, effectiveZoom));
    }
  };

  // Mouse Drag to Move / Pan
  const handleMouseDown = (e: React.MouseEvent<HTMLDivElement>) => {
    if ((e.target as HTMLElement).closest('.annotation-pin') || (e.target as HTMLElement).closest('.canvas-control')) {
      return;
    }
    if (e.button !== 0) return;

    setIsDragging(true);
    dragDistanceRef.current = 0;
    panStartRef.current = {
      clientX: e.clientX,
      clientY: e.clientY,
      startPanX: pan.x,
      startPanY: pan.y
    };
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!isDragging) return;
    const dx = e.clientX - panStartRef.current.clientX;
    const dy = e.clientY - panStartRef.current.clientY;
    dragDistanceRef.current += Math.hypot(dx, dy);
    setPan(clampPan(panStartRef.current.startPanX + dx, panStartRef.current.startPanY + dy, zoom));
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  // Mouse Wheel Zoom
  const handleWheel = (e: React.WheelEvent<HTMLDivElement>) => {
    e.preventDefault();
    const delta = e.deltaY < 0 ? 0.25 : -0.25;
    setZoom((prev) => {
      const next = Math.min(4, Math.max(1, Number((prev + delta).toFixed(2))));
      setPan((curr) => clampPan(curr.x, curr.y, next));
      return next;
    });
  };

  // Touch Support (1-finger drag to pan, 2-finger pinch to zoom)
  const handleTouchStart = (e: React.TouchEvent<HTMLDivElement>) => {
    if ((e.target as HTMLElement).closest('.annotation-pin') || (e.target as HTMLElement).closest('.canvas-control')) {
      return;
    }
    if (e.touches.length === 1) {
      setIsDragging(true);
      dragDistanceRef.current = 0;
      panStartRef.current = {
        clientX: e.touches[0].clientX,
        clientY: e.touches[0].clientY,
        startPanX: pan.x,
        startPanY: pan.y
      };
      touchDistanceRef.current = null;
    } else if (e.touches.length === 2) {
      setIsDragging(false);
      const dist = Math.hypot(
        e.touches[0].clientX - e.touches[1].clientX,
        e.touches[0].clientY - e.touches[1].clientY
      );
      touchDistanceRef.current = dist;
    }
  };

  const handleTouchMove = (e: React.TouchEvent<HTMLDivElement>) => {
    if (e.touches.length === 1 && isDragging) {
      const dx = e.touches[0].clientX - panStartRef.current.clientX;
      const dy = e.touches[0].clientY - panStartRef.current.clientY;
      dragDistanceRef.current += Math.hypot(dx, dy);
      setPan(clampPan(panStartRef.current.startPanX + dx, panStartRef.current.startPanY + dy, zoom));
    } else if (e.touches.length === 2 && touchDistanceRef.current !== null) {
      const newDist = Math.hypot(
        e.touches[0].clientX - e.touches[1].clientX,
        e.touches[0].clientY - e.touches[1].clientY
      );
      const diff = newDist - touchDistanceRef.current;
      if (Math.abs(diff) > 5) {
        const factor = diff > 0 ? 0.08 : -0.08;
        setZoom((prev) => {
          const next = Math.min(4, Math.max(1, Number((prev + factor).toFixed(2))));
          setPan((curr) => clampPan(curr.x, curr.y, next));
          return next;
        });
        touchDistanceRef.current = newDist;
      }
    }
  };

  const handleTouchEnd = () => {
    setIsDragging(false);
    touchDistanceRef.current = null;
  };

  // Keyboard navigation when canvas is focused
  const handleKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
    if (e.key === 'ArrowLeft') {
      e.preventDefault();
      handleMove(60, 0);
    } else if (e.key === 'ArrowRight') {
      e.preventDefault();
      handleMove(-60, 0);
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      handleMove(0, 60);
    } else if (e.key === 'ArrowDown') {
      e.preventDefault();
      handleMove(0, -60);
    } else if (e.key === '+' || e.key === '=') {
      e.preventDefault();
      handleZoomIn();
    } else if (e.key === '-') {
      e.preventDefault();
      handleZoomOut();
    } else if (e.key === '0' || e.key.toLowerCase() === 'r') {
      e.preventDefault();
      handleResetView();
    }
  };

  const selectedAnnotation = annotations.find((a) => a.id === selectedAnnotationId) || null;

  // Handle canvas click to place a pin or inspect
  const handleCanvasClick = (e: React.MouseEvent<HTMLDivElement>) => {
    // If user dragged to move across the site, ignore click
    if (dragDistanceRef.current > 6) {
      return;
    }

    // If clicking an existing marker button or canvas control, let it manage it
    if ((e.target as HTMLElement).closest('.annotation-pin') || (e.target as HTMLElement).closest('.canvas-control')) {
      return;
    }

    if (readOnly || activeTool === 'MOVE') {
      setSelectedAnnotationId(null);
      return;
    }

    if (!canvasRef.current) return;

    const rect = canvasRef.current.getBoundingClientRect();
    const clickX = e.clientX - rect.left;
    const clickY = e.clientY - rect.top;
    const W = rect.width;
    const H = rect.height;

    // Invert viewport transformation (translate and zoom from center)
    const unscaledX = (clickX - pan.x - W / 2) / zoom + W / 2;
    const unscaledY = (clickY - pan.y - H / 2) / zoom + H / 2;

    const xPercent = Math.min(Math.max(Math.round((unscaledX / W) * 100), 2), 98);
    const yPercent = Math.min(Math.max(Math.round((unscaledY / H) * 100), 2), 98);

    setTempCoords({ xPercent, yPercent });
    setFormType('HAZARD');
    setFormLabel('New Safety Point');
    setFormDescription('');
    setFormSeverity('HIGH');
    setEditingAnnotation(null);
    setIsAddingPin(true);
  };

  const handleSaveAnnotation = () => {
    if (!formLabel.trim()) return;

    let updated: SitePlanAnnotation[];
    const config = ANNOTATION_TYPE_CONFIG[formType];

    if (editingAnnotation) {
      // Edit existing
      updated = annotations.map((a) =>
        a.id === editingAnnotation.id
          ? {
              ...a,
              type: formType,
              label: formLabel,
              description: formDescription,
              severity: formSeverity,
              color: config.pinColor
            }
          : a
      );
    } else if (tempCoords) {
      // Add new
      const newAnn: SitePlanAnnotation = {
        id: `ann-${Date.now()}`,
        xPercent: tempCoords.xPercent,
        yPercent: tempCoords.yPercent,
        type: formType,
        label: formLabel,
        description: formDescription,
        severity: formSeverity,
        color: config.pinColor,
        createdAt: new Date().toISOString(),
        createdBy: 'Driver Safety Team'
      };
      updated = [...annotations, newAnn];
      setSelectedAnnotationId(newAnn.id);
    } else {
      return;
    }

    setAnnotations(updated);
    setIsAddingPin(false);
    setTempCoords(null);
    setEditingAnnotation(null);

    if (onUpdateSitePlan) {
      onUpdateSitePlan({
        ...planData,
        planType,
        annotations: updated,
        lastAnnotatedAt: new Date().toISOString()
      });
    }
  };

  const handleDeleteAnnotation = (id: string) => {
    const updated = annotations.filter((a) => a.id !== id);
    setAnnotations(updated);
    if (selectedAnnotationId === id) setSelectedAnnotationId(null);
    if (onUpdateSitePlan) {
      onUpdateSitePlan({
        ...planData,
        planType,
        annotations: updated,
        lastAnnotatedAt: new Date().toISOString()
      });
    }
  };

  const handleStartEdit = (ann: SitePlanAnnotation) => {
    setEditingAnnotation(ann);
    setFormType(ann.type);
    setFormLabel(ann.label);
    setFormDescription(ann.description);
    setFormSeverity(ann.severity || 'MEDIUM');
    setTempCoords({ xPercent: ann.xPercent, yPercent: ann.yPercent });
    setIsAddingPin(true);
  };

  // Reset to AI baseline layout
  const handleResetToBaseline = () => {
    const freshPlan = getDefaultSitePlanForSite(site);
    setAnnotations(freshPlan.annotations);
    if (onUpdateSitePlan) {
      onUpdateSitePlan(freshPlan);
    }
  };

  // AI Satellite Yard Detection & CAD Pin Auto-Generation
  const handleAnalyzeSatelliteYard = async () => {
    setIsAnalyzingSatellite(true);
    setSatelliteAnalysisNotice(null);
    try {
      const result = await analyzeSatelliteYard(site);
      setAnnotations(result.annotations);
      setPlanType('SATELLITE');
      setSatelliteAnalysisNotice(
        `AI Yard Survey Complete: ${result.annotations.length} CAD pins placed on actual satellite footprint (${result.estimatedApronWidthMeters}m apron • Rec. Speed: ${result.recommendedSpeedLimitMph} mph)`
      );
      if (onUpdateSitePlan) {
        onUpdateSitePlan({
          ...planData,
          planType: 'SATELLITE',
          backgroundUrl: undefined,
          annotations: result.annotations,
          lastAnnotatedAt: new Date().toISOString()
        });
      }
    } catch (err) {
      console.warn('Satellite yard analysis error:', err);
      setSatelliteAnalysisNotice('Using high-resolution CAD yard model pins.');
    } finally {
      setIsAnalyzingSatellite(false);
    }
  };

  // Filtered annotations list
  const filteredAnnotations = annotations.filter((a) => {
    if (filterCategory === 'ALL') return true;
    if (filterCategory === 'HAZARDS') return a.type === 'HAZARD' || a.type === 'CLEARANCE_RESTRICTION' || a.type === 'BLIND_SPOT';
    if (filterCategory === 'ACCESS') return a.type === 'SECURITY_GATE' || a.type === 'WEIGHBRIDGE' || a.type === 'PARKING_WAITING';
    if (filterCategory === 'BAYS') return a.type === 'LOADING_BAY';
    if (filterCategory === 'PEDESTRIAN') return a.type === 'PEDESTRIAN_PATH' || a.type === 'MUSTER_POINT';
    return true;
  });

  const getPinIcon = (type: SitePlanAnnotationType) => {
    switch (type) {
      case 'HAZARD':
        return <AlertTriangle className="h-3.5 w-3.5" />;
      case 'CLEARANCE_RESTRICTION':
        return <ShieldAlert className="h-3.5 w-3.5" />;
      case 'SECURITY_GATE':
        return <Lock className="h-3.5 w-3.5" />;
      case 'LOADING_BAY':
        return <Truck className="h-3.5 w-3.5" />;
      case 'PEDESTRIAN_PATH':
        return <Footprints className="h-3.5 w-3.5" />;
      case 'MUSTER_POINT':
        return <ShieldCheck className="h-3.5 w-3.5" />;
      case 'BLIND_SPOT':
        return <EyeOff className="h-3.5 w-3.5" />;
      case 'WEIGHBRIDGE':
        return <Scale className="h-3.5 w-3.5" />;
      case 'PARKING_WAITING':
        return <Clock className="h-3.5 w-3.5" />;
      case 'TRANSPORT_OFFICE':
        return <Building2 className="h-3.5 w-3.5" />;
      case 'ONE_WAY':
        return <Compass className="h-3.5 w-3.5" />;
      default:
        return <MapPin className="h-3.5 w-3.5" />;
    }
  };

  const handleApplyMediaImprovements = (newPins: SitePlanAnnotation[], summary: string) => {
    const merged = [...annotations, ...newPins];
    setAnnotations(merged);
    setMediaImprovementNotice(summary);
    if (newPins.length > 0) {
      setSelectedAnnotationId(newPins[0].id);
    }
    if (onUpdateSitePlan) {
      onUpdateSitePlan({
        ...planData,
        annotations: merged,
        lastAnnotatedAt: new Date().toISOString()
      });
    }
  };

  return (
    <div className="space-y-4">
      {/* Top Controls Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 bg-white p-3 sm:p-4 rounded-xl border border-slate-200 shadow-sm">
        <div className="flex items-center gap-2">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-blue-600 text-white font-bold shadow">
            <Layers className="h-5 w-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-sm sm:text-base font-bold text-slate-900">
                Interactive Depot Site Plan
              </h3>
              <span className="rounded-full bg-blue-50 px-2 py-0.5 text-[11px] font-semibold text-blue-700 border border-blue-200">
                Driver Design™
              </span>
            </div>
            <p className="text-xs text-slate-500">
              {site.title} • {annotations.length} safety points mapped
            </p>
          </div>
        </div>

        {/* Action Buttons & Style Switcher */}
        <div className="flex flex-wrap items-center gap-2">
          {/* View Mode Toggle: Blueprint vs Satellite */}
          <div className="flex rounded-lg border border-slate-200 bg-slate-100 p-0.5">
            <button
              onClick={() => setPlanType('BLUEPRINT')}
              className={`flex items-center gap-1 rounded-md px-2.5 py-1 text-xs font-semibold transition-all ${
                planType === 'BLUEPRINT'
                  ? 'bg-white text-blue-700 shadow-sm'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <span>Architectural Yard CAD</span>
            </button>
            <button
              onClick={() => setPlanType('SATELLITE')}
              className={`flex items-center gap-1 rounded-md px-2.5 py-1 text-xs font-semibold transition-all ${
                planType === 'SATELLITE'
                  ? 'bg-white text-blue-700 shadow-sm'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <span>Aerial Satellite</span>
            </button>
          </div>

          {!readOnly && (
            <>
              <button
                onClick={() => setIsMediaUploadOpen(true)}
                className="flex items-center gap-1.5 rounded-lg bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 active:scale-95 px-3 py-1.5 text-xs font-bold text-white shadow-sm transition-all"
                title="Upload phone photos or video clips of the yard to let AI identify and map loading bays, transport office, and hazards"
              >
                <Camera className="h-3.5 w-3.5" />
                <span>Upload Photo / Video (AI)</span>
              </button>

              <button
                onClick={handleAnalyzeSatelliteYard}
                disabled={isAnalyzingSatellite}
                className="flex items-center gap-1.5 rounded-lg bg-gradient-to-r from-indigo-600 to-blue-600 hover:from-indigo-700 hover:to-blue-700 active:scale-95 px-3 py-1.5 text-xs font-bold text-white shadow-sm transition-all disabled:opacity-50"
                title="Use Gemini AI to analyze satellite footprint and auto-place precision CAD safety pins"
              >
                <Satellite className={`h-3.5 w-3.5 ${isAnalyzingSatellite ? 'animate-spin' : ''}`} />
                <span>{isAnalyzingSatellite ? 'Analyzing Yard...' : 'AI Satellite Yard Scan'}</span>
              </button>

              <button
                onClick={() => {
                  setTempCoords({ xPercent: 50, yPercent: 50 });
                  setFormType('HAZARD');
                  setFormLabel('New Hazard Point');
                  setFormDescription('');
                  setFormSeverity('HIGH');
                  setEditingAnnotation(null);
                  setIsAddingPin(true);
                }}
                className="flex items-center gap-1.5 rounded-lg bg-blue-600 hover:bg-blue-700 active:scale-95 px-3 py-1.5 text-xs font-semibold text-white shadow-sm transition-all"
              >
                <Plus className="h-3.5 w-3.5" />
                <span>Annotate Point</span>
              </button>

              <button
                onClick={handleResetToBaseline}
                className="flex items-center gap-1 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 px-2.5 py-1.5 text-xs font-medium text-slate-600 hover:text-slate-900 transition-colors"
                title="Reset layout to AI baseline hazard markers"
              >
                <Sparkles className="h-3 w-3 text-amber-500" />
                <span className="hidden sm:inline">Reset Baseline</span>
              </button>
            </>
          )}

          <button
            onClick={() => window.print()}
            className="flex items-center gap-1 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 px-2.5 py-1.5 text-xs font-medium text-slate-600 hover:text-slate-900 transition-colors"
            title="Print or export PDF of this site plan"
          >
            <Download className="h-3 w-3 text-slate-500" />
            <span className="hidden sm:inline">Export Plan</span>
          </button>
        </div>
      </div>

      {/* Main Studio Area: Canvas + Sidebar */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Left 2 Cols: Interactive Canvas Container */}
        <div className="lg:col-span-2 space-y-2">
          {/* Media Improvement AI Feedback Banner */}
          {mediaImprovementNotice && (
            <div className="flex items-center justify-between rounded-xl bg-emerald-50 border border-emerald-200 px-3.5 py-2 text-xs text-emerald-900 shadow-sm animate-in fade-in">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0" />
                <span className="font-semibold">{mediaImprovementNotice}</span>
              </div>
              <button
                onClick={() => setMediaImprovementNotice(null)}
                className="text-emerald-500 hover:text-emerald-800 p-1"
              >
                <X className="h-3.5 w-3.5" />
              </button>
            </div>
          )}

          {/* Satellite Analysis Feedback Banner */}
          {satelliteAnalysisNotice && (
            <div className="flex items-center justify-between rounded-xl bg-indigo-50 border border-indigo-200 px-3.5 py-2 text-xs text-indigo-900 shadow-sm animate-in fade-in">
              <div className="flex items-center gap-2">
                <Satellite className="h-4 w-4 text-indigo-600 shrink-0" />
                <span className="font-semibold">{satelliteAnalysisNotice}</span>
              </div>
              <button
                onClick={() => setSatelliteAnalysisNotice(null)}
                className="text-indigo-500 hover:text-indigo-800 p-1"
              >
                <X className="h-3.5 w-3.5" />
              </button>
            </div>
          )}

          <div className="relative rounded-2xl border-2 border-slate-700 bg-slate-950 shadow-md overflow-hidden select-none">
            {/* VIEWPORT CONTAINER */}
            {planType === 'SATELLITE' && !isCustomCad ? (
              /* LIVE GOOGLE MAP EXPLORER VIEW (Full pinch-to-zoom, move around local area, greedy gestures) */
              <div className="relative w-full aspect-[4/3] sm:aspect-[16/10] overflow-hidden bg-slate-950">
                <div
                  ref={mapContainerRef}
                  className="w-full h-full min-h-[420px] sm:min-h-[500px]"
                />

                {/* Instant fallback satellite layer if Google Maps script is loading or offline */}
                {!isGoogleMapReady && (
                  <div
                    ref={canvasRef}
                    tabIndex={0}
                    onClick={handleCanvasClick}
                    onMouseDown={handleMouseDown}
                    onMouseMove={handleMouseMove}
                    onMouseUp={handleMouseUp}
                    onMouseLeave={handleMouseUp}
                    onWheel={handleWheel}
                    onTouchStart={handleTouchStart}
                    onTouchMove={handleTouchMove}
                    onTouchEnd={handleTouchEnd}
                    onKeyDown={handleKeyDown}
                    className="absolute inset-0 z-10 overflow-hidden cursor-grab active:cursor-grabbing focus:outline-none"
                  >
                    <div
                      className="absolute inset-0 select-none will-change-transform"
                      style={{
                        transform: `translate(${pan.x}px, ${pan.y}px) scale(${zoom})`,
                        transformOrigin: 'center center',
                        transition: isDragging ? 'none' : 'transform 0.12s cubic-bezier(0.2, 0, 0, 1)'
                      }}
                    >
                      <img
                        src={`/api/proxy-satellite-image?lat=${site.coordinates.lat}&lng=${site.coordinates.lng}&zoom=${satelliteZoom}&maptype=${satelliteMapType}`}
                        alt={`Depot satellite view of ${site.title}`}
                        className="w-full h-full object-cover pointer-events-none"
                        loading="eager"
                      />
                      <div className="absolute inset-0 bg-blue-950/20 pointer-events-none" />

                      {/* Pins on fallback satellite layer */}
                      {annotations.map((ann) => {
                        const config = ANNOTATION_TYPE_CONFIG[ann.type] || ANNOTATION_TYPE_CONFIG.HAZARD;
                        const isSelected = selectedAnnotationId === ann.id;
                        return (
                          <button
                            key={ann.id}
                            onClick={(e) => {
                              e.stopPropagation();
                              setSelectedAnnotationId(ann.id);
                            }}
                            style={{
                              left: `${ann.xPercent}%`,
                              top: `${ann.yPercent}%`,
                              transform: 'translate(-50%, -50%)'
                            }}
                            className={`annotation-pin absolute z-20 flex items-center justify-center transition-all duration-200 ${
                              isSelected ? 'scale-125 z-30' : 'hover:scale-110'
                            }`}
                            title={`${ann.label} (${config.label})`}
                          >
                            {(ann.severity === 'CRITICAL' || isSelected) && (
                              <span
                                className="absolute -inset-1.5 rounded-full animate-ping opacity-75"
                                style={{ backgroundColor: ann.color || config.pinColor }}
                              />
                            )}
                            <div
                              className={`relative flex items-center justify-center rounded-full p-1.5 text-white shadow-xl border-2 ${
                                isSelected ? 'border-white ring-4 ring-blue-500/50' : 'border-white/90'
                              }`}
                              style={{ backgroundColor: ann.color || config.pinColor }}
                            >
                              {getPinIcon(ann.type)}
                            </div>
                            <div
                              className={`absolute bottom-full mb-1.5 left-1/2 -translate-x-1/2 whitespace-nowrap rounded-md px-2 py-0.5 text-[10px] font-bold shadow-lg transition-opacity ${
                                isSelected
                                  ? 'opacity-100 bg-slate-900 text-white z-40'
                                  : 'opacity-0 group-hover:opacity-100 bg-slate-900/90 text-white pointer-events-none'
                              }`}
                            >
                              {ann.label}
                            </div>
                          </button>
                        );
                      })}
                    </div>
                  </div>
                )}
              </div>
            ) : (
              /* INTERACTIVE CAD / BLUEPRINT CANVAS VIEWPORT (With 2-finger pinch and drag-to-move) */
              <div
                ref={canvasRef}
                tabIndex={0}
                onClick={handleCanvasClick}
                onMouseDown={handleMouseDown}
                onMouseMove={handleMouseMove}
                onMouseUp={handleMouseUp}
                onMouseLeave={handleMouseUp}
                onWheel={handleWheel}
                onTouchStart={handleTouchStart}
                onTouchMove={handleTouchMove}
                onTouchEnd={handleTouchEnd}
                onKeyDown={handleKeyDown}
                className={`relative w-full aspect-[4/3] sm:aspect-[16/10] overflow-hidden select-none touch-none focus:outline-none bg-slate-950 ${
                  isDragging
                    ? 'cursor-grabbing'
                    : activeTool === 'MOVE'
                    ? 'cursor-grab'
                    : !readOnly
                    ? 'cursor-crosshair'
                    : 'cursor-grab'
                }`}
              >
                {/* TRANSFORMED YARD CANVAS LAYER (Scales & Moves) */}
                <div
                  className="absolute inset-0 select-none will-change-transform"
                  style={{
                    transform: `translate(${pan.x}px, ${pan.y}px) scale(${zoom})`,
                    transformOrigin: 'center center',
                    transition: isDragging ? 'none' : 'transform 0.12s cubic-bezier(0.2, 0, 0, 1)'
                  }}
                >
                  {/* STYLE A: BLUEPRINT / CAD YARD VIEW */}
                  {planType === 'BLUEPRINT' && (
                    <div className="absolute inset-0 bg-slate-900 overflow-hidden pointer-events-none">
                      {/* Grid lines */}
                      <div
                        className="absolute inset-0 opacity-20"
                        style={{
                          backgroundImage: `radial-gradient(#60a5fa 1px, transparent 1px), linear-gradient(to right, #1e293b 1px, transparent 1px), linear-gradient(to bottom, #1e293b 1px, transparent 1px)`,
                          backgroundSize: '20px 20px'
                        }}
                      />

                      {/* SVG Blueprint Yard Graphics */}
                      <svg className="absolute inset-0 w-full h-full" viewBox="0 0 800 500" preserveAspectRatio="none">
                        {/* Site Boundary Fence */}
                        <rect x="20" y="20" width="760" height="460" fill="none" stroke="#3b82f6" strokeWidth="2" strokeDasharray="6,4" />
                        
                        {/* Main Warehouse Footprint */}
                        <rect x="380" y="50" width="370" height="260" fill="#1e293b" stroke="#60a5fa" strokeWidth="2.5" rx="8" />
                        <text x="565" y="160" fill="#93c5fd" fontSize="15" fontWeight="bold" textAnchor="middle" letterSpacing="2">MAIN WAREHOUSE BUILDING</text>
                        <text x="565" y="185" fill="#64748b" fontSize="11" textAnchor="middle">Goods Inwards & Pallet Staging</text>

                        {/* Loading Bay Slots on Warehouse West Edge */}
                        {[0, 1, 2, 3, 4, 5, 6].map((i) => (
                          <g key={i}>
                            <rect x="345" y={75 + i * 32} width="35" height="22" fill="#0f172a" stroke="#10b981" strokeWidth="1.5" rx="2" />
                            <text x="362" y={90 + i * 32} fill="#34d399" fontSize="9" fontWeight="bold" textAnchor="middle">D{i + 1}</text>
                          </g>
                        ))}

                        {/* Central Yard Apron (Concrete Turning Circle) */}
                        <path
                          d="M 160 120 L 340 120 L 340 380 L 160 380 Z"
                          fill="#0f172a"
                          stroke="#475569"
                          strokeWidth="1.5"
                        />
                        <text x="250" y="240" fill="#64748b" fontSize="12" fontWeight="bold" textAnchor="middle" letterSpacing="1">
                          HGVs APRON & TURNING ZONE
                        </text>
                        <text x="250" y="260" fill="#475569" fontSize="10" textAnchor="middle">
                          Counter-clockwise one-way circulation
                        </text>

                        {/* Yellow Directional Road Arrows */}
                        <path d="M 120 440 L 120 200 L 220 140" fill="none" stroke="#eab308" strokeWidth="3" strokeDasharray="8,6" />
                        <polygon points="220,135 235,140 220,148" fill="#eab308" />

                        {/* Inbound Gate & Security Booth */}
                        <rect x="40" y="380" width="80" height="70" fill="#1e293b" stroke="#3b82f6" strokeWidth="2" rx="4" />
                        <text x="80" y="415" fill="#60a5fa" fontSize="10" fontWeight="bold" textAnchor="middle">SECURITY</text>
                        <text x="80" y="430" fill="#94a3b8" fontSize="8" textAnchor="middle">GATEHOUSE</text>
                        {/* Security Barrier Bar */}
                        <line x1="120" y1="415" x2="160" y2="415" stroke="#ef4444" strokeWidth="4" strokeDasharray="6,3" />

                        {/* Weighbridge Platform */}
                        <rect x="180" y="330" width="85" height="35" fill="#1e1b4b" stroke="#a855f7" strokeWidth="2" rx="3" />
                        <text x="222" y="352" fill="#c084fc" fontSize="9" fontWeight="bold" textAnchor="middle">WEIGHBRIDGE</text>

                        {/* Pedestrian Safe Walkway (Green Hatch) */}
                        <path d="M 380 310 L 380 430 L 600 430" fill="none" stroke="#0d9488" strokeWidth="4" strokeDasharray="4,4" />
                        <text x="490" y="445" fill="#2dd4bf" fontSize="9" textAnchor="middle">🚶 GREEN PEDESTRIAN WALKWAY</text>

                        {/* Muster Point Area */}
                        <circle cx="680" cy="380" r="30" fill="#312e81" stroke="#818cf8" strokeWidth="2" strokeDasharray="4,2" />
                        <text x="680" y="383" fill="#c7d2fe" fontSize="9" fontWeight="bold" textAnchor="middle">MUSTER</text>
                        <text x="680" y="396" fill="#818cf8" fontSize="8" textAnchor="middle">POINT A</text>

                        {/* Scale bar indicator */}
                        <line x1="40" y1="465" x2="140" y2="465" stroke="#94a3b8" strokeWidth="2" />
                        <line x1="40" y1="460" x2="40" y2="470" stroke="#94a3b8" strokeWidth="2" />
                        <line x1="140" y1="460" x2="140" y2="470" stroke="#94a3b8" strokeWidth="2" />
                        <text x="90" y="460" fill="#94a3b8" fontSize="9" textAnchor="middle">50 METERS</text>
                      </svg>
                    </div>
                  )}

                  {/* CUSTOM UPLOADED BLUEPRINT / DRONE PHOTO */}
                  {planType === 'SATELLITE' && isCustomCad && (
                    <div className="absolute inset-0 bg-slate-900 overflow-hidden select-none pointer-events-none">
                      <img
                        src={planData.backgroundUrl}
                        alt={`Custom Blueprint for ${site.title}`}
                        className="w-full h-full object-cover pointer-events-none"
                        loading="eager"
                      />
                      <div className="absolute inset-0 bg-blue-950/10 pointer-events-none" />
                    </div>
                  )}

                  {/* Pinned Annotations */}
                  {annotations.map((ann) => {
                    const config = ANNOTATION_TYPE_CONFIG[ann.type] || ANNOTATION_TYPE_CONFIG.HAZARD;
                    const isSelected = selectedAnnotationId === ann.id;

                    return (
                      <button
                        key={ann.id}
                        onClick={(e) => {
                          e.stopPropagation();
                          setSelectedAnnotationId(ann.id);
                        }}
                        style={{
                          left: `${ann.xPercent}%`,
                          top: `${ann.yPercent}%`,
                          transform: 'translate(-50%, -50%)'
                        }}
                        className={`annotation-pin absolute z-10 flex items-center justify-center transition-all duration-200 group ${
                          isSelected ? 'scale-125 z-30' : 'hover:scale-110'
                        }`}
                        title={`${ann.label} (${config.label})`}
                      >
                        {/* Pulsing halo if critical or selected */}
                        {(ann.severity === 'CRITICAL' || isSelected) && (
                          <span
                            className="absolute -inset-1.5 rounded-full animate-ping opacity-75"
                            style={{ backgroundColor: ann.color || config.pinColor }}
                          />
                        )}

                        {/* Pin Marker Circle */}
                        <div
                          className={`relative flex items-center justify-center rounded-full p-1.5 text-white shadow-xl border-2 ${
                            isSelected ? 'border-white ring-4 ring-blue-500/50' : 'border-white/90'
                          }`}
                          style={{ backgroundColor: ann.color || config.pinColor }}
                        >
                          {getPinIcon(ann.type)}
                          {ann.photoUrl && (
                            <span
                              className="absolute -top-1 -right-1 flex h-3.5 w-3.5 items-center justify-center rounded-full bg-emerald-500 text-white ring-1 ring-white"
                              title="Real site photo attached"
                            >
                              <Camera className="h-2 w-2" />
                            </span>
                          )}
                        </div>

                        {/* Label Tag on Hover / Selected */}
                        <div
                          className={`absolute bottom-full mb-1.5 left-1/2 -translate-x-1/2 whitespace-nowrap rounded-md px-2 py-0.5 text-[10px] font-bold shadow-lg transition-opacity ${
                            isSelected
                              ? 'opacity-100 bg-slate-900 text-white z-40'
                              : 'opacity-0 group-hover:opacity-100 bg-slate-900/90 text-white pointer-events-none'
                          }`}
                        >
                          {ann.label}
                        </div>
                      </button>
                    );
                  })}

                  {/* Temporary Placed Pin (before saving) */}
                  {tempCoords && isAddingPin && !editingAnnotation && (
                    <div
                      style={{
                        left: `${tempCoords.xPercent}%`,
                        top: `${tempCoords.yPercent}%`,
                        transform: 'translate(-50%, -50%)'
                      }}
                      className="absolute z-30 flex items-center justify-center pointer-events-none"
                    >
                      <span className="absolute -inset-2 rounded-full bg-blue-500 animate-ping opacity-75" />
                      <div className="flex h-8 w-8 items-center justify-center rounded-full bg-blue-600 text-white shadow-2xl border-2 border-white">
                        <Plus className="h-4 w-4 animate-spin" />
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* NON-TRANSFORMED HUD OVERLAYS & NAVIGATION CONTROLS */}

            {/* Instruction & Interaction Mode Banner (Top Left) */}
            <div className="absolute top-2.5 left-2.5 z-20 flex items-center gap-1.5 rounded-lg bg-slate-900/85 backdrop-blur-md px-2.5 py-1 text-[11px] font-medium text-white border border-white/15 shadow-sm pointer-events-none">
              {planType === 'SATELLITE' && !planData.backgroundUrl ? (
                <>
                  <Move className="h-3.5 w-3.5 text-blue-400" />
                  <span>Map Explorer: Pinch/wheel to zoom • Drag around site</span>
                </>
              ) : activeTool === 'MOVE' ? (
                <>
                  <Move className="h-3.5 w-3.5 text-blue-400" />
                  <span>Drag to move around yard • Wheel/pinch to zoom</span>
                </>
              ) : (
                <>
                  <Crosshair className="h-3.5 w-3.5 text-emerald-400" />
                  <span>Click yard to drop safety point</span>
                </>
              )}
              {planType === 'SATELLITE' && !planData.backgroundUrl ? (
                <span className="ml-1 rounded bg-blue-500/30 px-1.5 py-0.2 text-[10px] font-bold text-blue-200">
                  {satelliteZoom}z
                </span>
              ) : zoom > 1 ? (
                <span className="ml-1 rounded bg-blue-500/30 px-1.5 py-0.2 text-[10px] font-bold text-blue-200">
                  {Math.round(zoom * 100)}%
                </span>
              ) : null}
            </div>

            {/* Compass / North Arrow (Top Right) */}
            <div className="absolute top-2.5 right-2.5 z-20 flex items-center gap-1 rounded-lg bg-slate-900/85 backdrop-blur-md px-2 py-1 text-[10px] font-bold text-white border border-white/15 shadow-sm pointer-events-none">
              <Compass className="h-3.5 w-3.5 text-rose-500" />
              <span>N</span>
            </div>

            {/* Satellite Controls Pill (Top Right, underneath Compass) */}
            {planType === 'SATELLITE' && (
              <div className="canvas-control absolute top-10 right-2.5 z-20 flex items-center gap-1.5 bg-slate-900/90 backdrop-blur-md text-white p-1 rounded-lg border border-white/20 shadow-xl text-xs">
                {/* Map Layer Mode Selection (Hybrid / Satellite / Roadmap) */}
                {!planData.backgroundUrl && (
                  <div className="flex items-center bg-white/10 rounded p-0.5">
                    {(['hybrid', 'satellite', 'roadmap'] as const).map((type) => (
                      <button
                        key={type}
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          setSatelliteMapType(type);
                          if (mapInstanceRef.current && (window as any).google?.maps) {
                            const google = (window as any).google;
                            const target =
                              type === 'roadmap'
                                ? google.maps.MapTypeId.ROADMAP
                                : type === 'satellite'
                                ? google.maps.MapTypeId.SATELLITE
                                : google.maps.MapTypeId.HYBRID;
                            mapInstanceRef.current.setMapTypeId(target);
                          }
                        }}
                        className={`px-1.5 py-0.5 rounded text-[10px] font-medium capitalize transition-colors ${
                          satelliteMapType === type
                            ? 'bg-blue-600 text-white font-bold shadow-xs'
                            : 'text-slate-300 hover:text-white'
                        }`}
                      >
                        {type === 'roadmap' ? 'Street' : type === 'satellite' ? 'Aerial' : 'Hybrid'}
                      </button>
                    ))}
                  </div>
                )}

                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    yardImageInputRef.current?.click();
                  }}
                  className="flex items-center gap-1 px-1.5 py-0.5 rounded bg-blue-600 hover:bg-blue-500 text-[10px] font-semibold text-white transition-colors"
                  title="Upload custom depot CAD drawing or drone photo"
                >
                  <Upload className="h-3 w-3" />
                  <span>{isCustomCad ? 'Replace CAD' : 'Upload CAD'}</span>
                </button>

                {isCustomCad && (
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleResetToGoogleSatellite();
                    }}
                    className="p-1 text-slate-300 hover:text-white"
                    title="Revert back to live Google Satellite"
                  >
                    <RefreshCw className="h-3.5 w-3.5" />
                  </button>
                )}
              </div>
            )}

            {/* Bottom-Left Metadata HUD */}
            <div className="absolute bottom-2.5 left-2.5 z-20 flex items-center gap-2 bg-slate-900/90 backdrop-blur-md text-white px-2.5 py-1 rounded-lg border border-white/20 text-[10px] font-mono shadow-md pointer-events-none">
              <span className="flex h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
              <span className="font-semibold text-emerald-300">
                {planType === 'SATELLITE'
                  ? isCustomCad
                    ? 'CUSTOM DEPOT CAD'
                    : `LIVE MAP EXPLORER (${satelliteMapType.toUpperCase()})`
                  : 'VECTOR CAD YARD BLUEPRINT'}
              </span>
              <span className="text-slate-500">|</span>
              <span className="text-slate-300">
                GPS: {site.coordinates.lat.toFixed(4)}°, {site.coordinates.lng.toFixed(4)}°
              </span>
              <span className="text-slate-500 hidden md:inline">|</span>
              <span className="text-slate-400 hidden md:inline">
                Pinch to zoom • Drag to explore
              </span>
            </div>

            {/* FLOATING VIEWPORT ZOOM & MOVE CONTROLS (Bottom Right) */}
            <div className="canvas-control absolute bottom-2.5 right-2.5 z-30 flex flex-col items-end gap-1.5 pointer-events-auto">
              {/* Tool Mode: Move vs Add Pin */}
              {!readOnly && (
                <div className="flex items-center rounded-lg bg-slate-900/90 backdrop-blur-md p-0.5 border border-white/20 shadow-xl text-white text-[11px]">
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      setActiveTool('MOVE');
                    }}
                    className={`flex items-center gap-1 px-2 py-0.5 rounded-md font-semibold transition-all ${
                      activeTool === 'MOVE'
                        ? 'bg-blue-600 text-white shadow-xs'
                        : 'text-slate-300 hover:text-white hover:bg-white/10'
                    }`}
                    title="Move / Pan Mode: Drag freely across the depot yard and local area"
                  >
                    <Hand className="h-3 w-3" />
                    <span>Move</span>
                  </button>
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      setActiveTool('ANNOTATE');
                    }}
                    className={`flex items-center gap-1 px-2 py-0.5 rounded-md font-semibold transition-all ${
                      activeTool === 'ANNOTATE'
                        ? 'bg-blue-600 text-white shadow-xs'
                        : 'text-slate-300 hover:text-white hover:bg-white/10'
                    }`}
                    title="Annotate Mode: Click map to place safety pins"
                  >
                    <Crosshair className="h-3 w-3" />
                    <span>Pin</span>
                  </button>
                </div>
              )}

              {/* Combined Move D-Pad + Zoom Cluster */}
              <div className="flex items-center gap-1.5 rounded-xl bg-slate-900/90 backdrop-blur-md p-1 border border-white/20 shadow-xl text-white">
                {/* Directional Move D-Pad (Move around the site) */}
                <div className="grid grid-cols-3 gap-0.5 bg-white/10 p-0.5 rounded-lg" title="Move around the yard plan">
                  <div />
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleMove(0, 60);
                    }}
                    title="Move view north / up"
                    className="p-1 hover:bg-white/20 rounded text-slate-200 hover:text-white transition-colors flex items-center justify-center"
                  >
                    <ChevronUp className="h-3 w-3" />
                  </button>
                  <div />
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleMove(60, 0);
                    }}
                    title="Move view west / left"
                    className="p-1 hover:bg-white/20 rounded text-slate-200 hover:text-white transition-colors flex items-center justify-center"
                  >
                    <ChevronLeft className="h-3 w-3" />
                  </button>
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleResetView();
                    }}
                    title="Reset site view to center"
                    className="p-1 hover:bg-white/20 rounded text-blue-300 hover:text-blue-100 transition-colors flex items-center justify-center"
                  >
                    <RotateCcw className="h-2.5 w-2.5" />
                  </button>
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleMove(-60, 0);
                    }}
                    title="Move view east / right"
                    className="p-1 hover:bg-white/20 rounded text-slate-200 hover:text-white transition-colors flex items-center justify-center"
                  >
                    <ChevronRight className="h-3 w-3" />
                  </button>
                  <div />
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleMove(0, -60);
                    }}
                    title="Move view south / down"
                    className="p-1 hover:bg-white/20 rounded text-slate-200 hover:text-white transition-colors flex items-center justify-center"
                  >
                    <ChevronDown className="h-3 w-3" />
                  </button>
                  <div />
                </div>

                <div className="h-6 w-[1px] bg-white/20" />

                {/* Zoom In & Out Controls */}
                <div className="flex items-center gap-0.5 bg-white/10 rounded-lg p-0.5">
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleZoomOut();
                    }}
                    disabled={
                      planType === 'SATELLITE' && !isCustomCad
                        ? satelliteZoom <= 12
                        : zoom <= 1
                    }
                    title="Zoom Out (Wider local area)"
                    className="p-1 rounded hover:bg-white/20 disabled:opacity-30 disabled:hover:bg-transparent text-slate-200 hover:text-white transition-colors"
                  >
                    <ZoomOut className="h-3.5 w-3.5" />
                  </button>

                  <span
                    className="font-mono text-[10px] font-bold text-blue-200 w-10 text-center select-none"
                    title="Current Zoom Level"
                  >
                    {planType === 'SATELLITE' && !isCustomCad
                      ? `${satelliteZoom}z`
                      : `${Math.round(zoom * 100)}%`}
                  </span>

                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleZoomIn();
                    }}
                    disabled={
                      planType === 'SATELLITE' && !isCustomCad
                        ? satelliteZoom >= 21
                        : zoom >= 4
                    }
                    title="Zoom In (Close yard detail)"
                    className="p-1 rounded hover:bg-white/20 disabled:opacity-30 disabled:hover:bg-transparent text-slate-200 hover:text-white transition-colors"
                  >
                    <ZoomIn className="h-3.5 w-3.5" />
                  </button>
                </div>

                {/* Reset view button if zoomed or moved */}
                {((planType === 'SATELLITE' && !isCustomCad && satelliteZoom !== 18) ||
                  ((planType === 'BLUEPRINT' || isCustomCad) && (zoom !== 1 || pan.x !== 0 || pan.y !== 0))) && (
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleResetView();
                    }}
                    className="flex items-center gap-1 px-1.5 py-1 rounded bg-blue-600 hover:bg-blue-500 text-[10px] font-semibold text-white transition-colors shadow-xs"
                    title="Reset to default depot view"
                  >
                    <RotateCcw className="h-2.5 w-2.5" />
                    <span>Reset</span>
                  </button>
                )}
              </div>
            </div>

            {/* Hidden Yard Image Input */}
            <input
              type="file"
              ref={yardImageInputRef}
              onChange={handleYardImageUpload}
              accept="image/*"
              className="hidden"
            />

            {/* AI Satellite Scanning Overlay */}
            {isAnalyzingSatellite && (
              <div className="absolute inset-0 z-40 flex flex-col items-center justify-center bg-slate-950/80 backdrop-blur-sm text-white p-4 animate-in fade-in">
                <div className="relative flex h-24 w-24 items-center justify-center">
                  <span className="absolute inset-0 rounded-full border-2 border-indigo-500/50 animate-ping" />
                  <span className="absolute inset-2 rounded-full border border-indigo-400/70 animate-pulse" />
                  <div className="flex h-14 w-14 items-center justify-center rounded-full bg-gradient-to-tr from-indigo-600 to-blue-500 shadow-xl shadow-indigo-500/40">
                    <Satellite className="h-7 w-7 text-white animate-spin" />
                  </div>
                </div>
                <div className="text-center mt-3 space-y-1">
                  <h4 className="text-sm font-black tracking-wide text-indigo-300">
                    AI SATELLITE YARD ANALYSIS IN PROGRESS
                  </h4>
                  <p className="text-xs text-slate-300 max-w-sm">
                    Gemini Vision analyzing aerial depot footprint... Detecting gates, loading bays, weighbridges & hazards.
                  </p>
                </div>
              </div>
            )}
          </div>

          {/* Selected Pin Detail Banner (if a pin is selected) */}
          {selectedAnnotation && (
            <div className="rounded-xl border border-slate-200 bg-white p-3.5 shadow-sm space-y-2 animate-in fade-in slide-in-from-top-2">
              <div className="flex items-start justify-between gap-2">
                <div className="flex items-center gap-2">
                  <div
                    className="flex h-8 w-8 items-center justify-center rounded-lg text-white font-bold"
                    style={{
                      backgroundColor:
                        selectedAnnotation.color ||
                        ANNOTATION_TYPE_CONFIG[selectedAnnotation.type]?.pinColor ||
                        '#2563EB'
                    }}
                  >
                    {getPinIcon(selectedAnnotation.type)}
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-slate-900">{selectedAnnotation.label}</h4>
                    <span
                      className={`inline-block text-[10px] font-bold px-2 py-0.5 rounded-full border ${
                        ANNOTATION_TYPE_CONFIG[selectedAnnotation.type]?.badgeColor ||
                        'bg-slate-100 text-slate-800 border-slate-200'
                      }`}
                    >
                      {ANNOTATION_TYPE_CONFIG[selectedAnnotation.type]?.label || selectedAnnotation.type}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-1">
                  {!readOnly && (
                    <>
                      <button
                        onClick={() => handleStartEdit(selectedAnnotation)}
                        className="p-1 rounded-lg border border-slate-200 text-slate-600 hover:bg-slate-50 hover:text-slate-900 transition-colors"
                        title="Edit point"
                      >
                        <Edit3 className="h-3.5 w-3.5" />
                      </button>
                      <button
                        onClick={() => handleDeleteAnnotation(selectedAnnotation.id)}
                        className="p-1 rounded-lg border border-rose-200 text-rose-600 hover:bg-rose-50 hover:text-rose-700 transition-colors"
                        title="Delete point"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </button>
                    </>
                  )}
                  <button
                    onClick={() => setSelectedAnnotationId(null)}
                    className="p-1 rounded-lg text-slate-400 hover:text-slate-700"
                    title="Close"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>
              </div>

              {selectedAnnotation.description && (
                <p className="text-xs text-slate-600 bg-slate-50 p-2 rounded-lg border border-slate-100">
                  {selectedAnnotation.description}
                </p>
              )}

              {/* Photo Evidence Thumbnail if attached */}
              {selectedAnnotation.photoUrl && (
                <div className="rounded-xl overflow-hidden border border-slate-200 bg-slate-900 shadow-inner">
                  <div className="relative">
                    <img
                      src={selectedAnnotation.photoUrl}
                      alt={selectedAnnotation.label}
                      className="w-full max-h-48 object-cover"
                    />
                    <div className="absolute bottom-2 left-2 rounded-md bg-slate-900/85 backdrop-blur-xs px-2 py-0.5 text-[10px] font-bold text-white flex items-center gap-1.5 border border-white/10">
                      <Camera className="h-3 w-3 text-emerald-400" />
                      <span>Verified from On-Site Photo/Video</span>
                    </div>
                  </div>
                </div>
              )}

              <div className="flex items-center justify-between text-[11px] text-slate-400 pt-1">
                <span>Location: X: {selectedAnnotation.xPercent}%, Y: {selectedAnnotation.yPercent}%</span>
                {selectedAnnotation.createdBy && <span>By: {selectedAnnotation.createdBy}</span>}
              </div>
            </div>
          )}
        </div>

        {/* Right Col: Annotations List & Quick Filters */}
        <div className="space-y-3">
          {/* Filter Pills */}
          <div className="flex flex-wrap gap-1 bg-white p-2 rounded-xl border border-slate-200 shadow-sm">
            {[
              { id: 'ALL', label: 'All' },
              { id: 'HAZARDS', label: '🛑 Hazards' },
              { id: 'ACCESS', label: '🚪 Gates' },
              { id: 'BAYS', label: '⚓ Docks' },
              { id: 'PEDESTRIAN', label: '🚶 Walkways' }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setFilterCategory(tab.id)}
                className={`rounded-lg px-2 py-1 text-xs font-semibold transition-all ${
                  filterCategory === tab.id
                    ? 'bg-blue-600 text-white shadow-sm'
                    : 'text-slate-600 hover:bg-slate-100'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* Annotations Scroll Area */}
          <div className="rounded-xl border border-slate-200 bg-white p-3 shadow-sm space-y-2 max-h-[460px] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-slate-100 pb-2">
              <span className="text-xs font-bold text-slate-900">
                Mapped Safety Points ({filteredAnnotations.length})
              </span>
              <span className="text-[11px] text-slate-400 font-mono">
                {annotations.filter((a) => a.severity === 'CRITICAL' || a.severity === 'HIGH').length} High/Crit
              </span>
            </div>

            {filteredAnnotations.length === 0 ? (
              <div className="text-center py-6 text-xs text-slate-400">
                No safety points match this filter. Click the map to drop a point!
              </div>
            ) : (
              filteredAnnotations.map((ann) => {
                const config = ANNOTATION_TYPE_CONFIG[ann.type] || ANNOTATION_TYPE_CONFIG.HAZARD;
                const isSelected = selectedAnnotationId === ann.id;

                return (
                  <div
                    key={ann.id}
                    onClick={() => handleSelectAnnotation(ann.id)}
                    className={`flex items-start gap-2.5 p-2 rounded-lg cursor-pointer transition-all border ${
                      isSelected
                        ? 'border-blue-500 bg-blue-50/50 shadow-sm'
                        : 'border-slate-100 bg-slate-50 hover:bg-slate-100 hover:border-slate-200'
                    }`}
                  >
                    <div
                      className="flex h-7 w-7 shrink-0 items-center justify-center rounded-md text-white font-bold mt-0.5"
                      style={{ backgroundColor: ann.color || config.pinColor }}
                    >
                      {getPinIcon(ann.type)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-1">
                        <h5 className="text-xs font-bold text-slate-900 truncate">{ann.label}</h5>
                        {ann.severity && (
                          <span
                            className={`text-[9px] font-bold px-1.5 py-0.2 rounded border ${
                              ann.severity === 'CRITICAL'
                                ? 'bg-rose-100 text-rose-800 border-rose-200'
                                : ann.severity === 'HIGH'
                                ? 'bg-orange-100 text-orange-800 border-orange-200'
                                : 'bg-slate-100 text-slate-700 border-slate-200'
                            }`}
                          >
                            {ann.severity}
                          </span>
                        )}
                      </div>
                      <p className="text-[11px] text-slate-500 line-clamp-2 mt-0.5">
                        {ann.description || config.descriptionPlaceholder}
                      </p>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>
      </div>

      {/* Modal / Dialog for Adding or Editing an Annotation */}
      {isAddingPin && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-sm p-4 animate-in fade-in">
          <div className="w-full max-w-md rounded-2xl bg-white p-5 shadow-2xl border border-slate-200 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-600 text-white font-bold">
                  {editingAnnotation ? <Edit3 className="h-4 w-4" /> : <Plus className="h-4 w-4" />}
                </div>
                <div>
                  <h3 className="text-sm font-bold text-slate-900">
                    {editingAnnotation ? 'Edit Safety Point' : 'Annotate Point on Site Plan'}
                  </h3>
                  <p className="text-xs text-slate-500">
                    Pin positioned at X: {tempCoords?.xPercent}%, Y: {tempCoords?.yPercent}%
                  </p>
                </div>
              </div>
              <button
                onClick={() => {
                  setIsAddingPin(false);
                  setTempCoords(null);
                  setEditingAnnotation(null);
                }}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-700"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Category Selector */}
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">Safety Point Category</label>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-1.5 max-h-36 overflow-y-auto p-1 border border-slate-200 rounded-lg bg-slate-50">
                {(Object.keys(ANNOTATION_TYPE_CONFIG) as SitePlanAnnotationType[]).map((typeKey) => {
                  const cfg = ANNOTATION_TYPE_CONFIG[typeKey];
                  const isCur = formType === typeKey;
                  return (
                    <button
                      key={typeKey}
                      type="button"
                      onClick={() => {
                        setFormType(typeKey);
                        if (!formLabel || formLabel === 'New Safety Point' || formLabel === 'New Hazard Point') {
                          setFormLabel(cfg.label);
                        }
                      }}
                      className={`flex items-center gap-1.5 p-1.5 rounded text-left text-[11px] font-medium transition-all ${
                        isCur
                          ? 'bg-blue-600 text-white shadow-sm'
                          : 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-200'
                      }`}
                    >
                      {getPinIcon(typeKey)}
                      <span className="truncate">{cfg.label}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Label Input */}
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Point Title / Label</label>
              <input
                type="text"
                value={formLabel}
                onChange={(e) => setFormLabel(e.target.value)}
                placeholder="e.g. Low Canopy Overhead (4.2m) or Bay 4 Reverse Guide"
                className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-xs font-medium text-slate-900 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
              />
            </div>

            {/* Severity Level */}
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Risk / Severity Level</label>
              <div className="grid grid-cols-4 gap-2">
                {(['LOW', 'MEDIUM', 'HIGH', 'CRITICAL'] as RiskLevel[]).map((lvl) => (
                  <button
                    key={lvl}
                    type="button"
                    onClick={() => setFormSeverity(lvl)}
                    className={`rounded-lg py-1.5 text-xs font-bold transition-all border ${
                      formSeverity === lvl
                        ? lvl === 'CRITICAL'
                          ? 'bg-rose-600 text-white border-rose-700 shadow-sm'
                          : lvl === 'HIGH'
                          ? 'bg-orange-500 text-white border-orange-600 shadow-sm'
                          : lvl === 'MEDIUM'
                          ? 'bg-amber-500 text-slate-950 border-amber-600 shadow-sm'
                          : 'bg-emerald-600 text-white border-emerald-700 shadow-sm'
                        : 'border-slate-200 bg-slate-50 text-slate-600 hover:bg-slate-100'
                    }`}
                  >
                    {lvl}
                  </button>
                ))}
              </div>
            </div>

            {/* Detailed Instructions / Guidance */}
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Safety Instructions for Driver</label>
              <textarea
                rows={3}
                value={formDescription}
                onChange={(e) => setFormDescription(e.target.value)}
                placeholder={ANNOTATION_TYPE_CONFIG[formType].descriptionPlaceholder}
                className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-xs font-medium text-slate-900 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
              />
            </div>

            {/* Action buttons */}
            <div className="flex items-center justify-end gap-2 border-t border-slate-100 pt-3">
              <button
                type="button"
                onClick={() => {
                  setIsAddingPin(false);
                  setTempCoords(null);
                  setEditingAnnotation(null);
                }}
                className="rounded-lg border border-slate-300 bg-white px-3 py-1.5 text-xs font-semibold text-slate-700 hover:bg-slate-50"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleSaveAnnotation}
                disabled={!formLabel.trim()}
                className="rounded-lg bg-blue-600 hover:bg-blue-700 active:scale-95 px-4 py-1.5 text-xs font-bold text-white shadow transition-all disabled:opacity-50"
              >
                {editingAnnotation ? 'Save Changes' : 'Pin Point on Plan'}
              </button>
            </div>
          </div>
        </div>
      )}
      {/* AI Media (Photo / Video) Upload Modal */}
      <UploadSiteMediaModal
        isOpen={isMediaUploadOpen}
        onClose={() => setIsMediaUploadOpen(false)}
        site={site}
        onApplyImprovements={handleApplyMediaImprovements}
      />
    </div>
  );
};
