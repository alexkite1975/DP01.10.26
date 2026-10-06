'use client';
import React, { useState, useEffect, useRef } from 'react';
import {
  Search,
  MapPin,
  Compass,
  Navigation,
  Sparkles,
  Truck,
  ShieldAlert,
  ShieldCheck,
  Building2,
  ExternalLink,
  Layers,
  CheckCircle2,
  AlertTriangle,
  X,
  Plus,
  Eye,
  Clock,
  Volume2,
  VolumeX,
  Phone,
  Camera,
  AlertCircle,
  History,
  Trash2
} from 'lucide-react';
import {
  SiteRiskAssessment,
  DriverVehicleProfile,
  RiskLevel
} from '../types';
import {
  searchPlacesAutocomplete,
  getPlaceDetails,
  PlacePrediction,
  PlaceResultDetails,
  calculateDistanceMiles,
  scanNearbySensitivities
} from '../services/googlePlaces';
import { StreetViewGateModal } from './StreetViewGateModal';
import { tts } from '../services/ttsService';
import { generateNavUrl, NAV_APP_OPTIONS } from '../services/navigationService';

export interface SearchedHub {
  name: string;
  address: string;
  lat: number;
  lng: number;
  placeId?: string;
  category?: string;
  searchedAt?: string;
}

const DEFAULT_RECENT_HUBS: SearchedHub[] = [
  {
    name: 'Magna Park Logistics Park',
    address: 'Hunter Boulevard, Magna Park, Lutterworth LE17 4XN, UK',
    lat: 52.4578,
    lng: -1.2467,
    category: 'Distribution Center',
    searchedAt: '10m ago'
  },
  {
    name: 'DIRFT Daventry Rail Freight Terminal',
    address: 'Crick, Daventry NN6 7GZ, UK',
    lat: 52.3705,
    lng: -1.1895,
    category: 'Rail Freight',
    searchedAt: '1h ago'
  },
  {
    name: 'DP World London Gateway Port',
    address: 'North Sea Avenue, Stanford-le-Hope SS17 9DY, UK',
    lat: 51.5034,
    lng: 0.4682,
    category: 'Maritime Port',
    searchedAt: 'Yesterday'
  },
  {
    name: 'East Midlands Gateway Logistics Park',
    address: 'Castle Donington, Derby DE74 2SA, UK',
    lat: 52.8315,
    lng: -1.3021,
    category: 'Air Cargo Hub',
    searchedAt: '3d ago'
  },
  {
    name: 'Trafford Park Industrial Estate',
    address: 'Trafford Park, Stretford, Manchester M17 1EH, UK',
    lat: 53.4688,
    lng: -2.3168,
    category: 'Industrial Estate',
    searchedAt: '5d ago'
  }
];

interface PlaceSearchPageProps {
  sites: SiteRiskAssessment[];
  driverVehicle: DriverVehicleProfile;
  onSelectSite: (site: SiteRiskAssessment) => void;
  onSelectSitePlan?: (site: SiteRiskAssessment) => void;
  onGenerateRiskAssessmentForPlace: (placeDetails: {
    title: string;
    address: string;
    lat: number;
    lng: number;
    placeId?: string;
  }) => void;
}

export const PlaceSearchPage: React.FC<PlaceSearchPageProps> = ({
  sites,
  driverVehicle,
  onSelectSite,
  onSelectSitePlan,
  onGenerateRiskAssessmentForPlace
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [predictions, setPredictions] = useState<PlacePrediction[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [selectedPlace, setSelectedPlace] = useState<PlaceResultDetails>({
    name: 'Magna Park Logistics Park',
    formattedAddress: 'Hunter Boulevard, Magna Park, Lutterworth LE17 4XN, UK',
    lat: 52.4578,
    lng: -1.2467,
    placeId: 'ChIJb6eBf30Vd0gReZ5Bv_0cEAg',
    photos: [
      'https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1590674899484-d5640e854abe?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1587293852726-70cdb56c2866?auto=format&fit=crop&w=800&q=80'
    ],
    openingHours: {
      isOpen: true,
      weekdayText: [
        'Monday: 24 Hours (Gatehouse Staffed)',
        'Tuesday: 24 Hours',
        'Wednesday: 24 Hours',
        'Thursday: 24 Hours',
        'Friday: 24 Hours',
        'Saturday: 06:00 – 20:00',
        'Sunday: 08:00 – 18:00'
      ]
    },
    phoneNumber: '+44 (0) 1455 892 000',
    rating: 4.7,
    userRatingsTotal: 320,
    plusCode: '9C4VFR54+9Q',
    nearbySensitivities: scanNearbySensitivities(52.4578, -1.2467, 'Magna Park')
  });

  const [showStreetView, setShowStreetView] = useState(false);
  const [isPlayingCabAlert, setIsPlayingCabAlert] = useState(false);
  const [activePhotoIndex, setActivePhotoIndex] = useState(0);

  const [mapType, setMapType] = useState<'roadmap' | 'satellite' | 'hybrid'>('roadmap');
  const [activeCategoryFilter, setActiveCategoryFilter] = useState('ALL');

  // Driver Recent Searched Hubs State (persisted to localStorage)
  const [recentSearches, setRecentSearches] = useState<SearchedHub[]>(() => {
    try {
      const saved = localStorage.getItem('siterisk_driver_recent_searches_v1');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          return parsed;
        }
      }
    } catch (e) {
      console.warn('Could not read recent searches from localStorage:', e);
    }
    return DEFAULT_RECENT_HUBS;
  });

  // Record a hub into recent search history
  const recordRecentSearch = (hub: {
    name: string;
    address: string;
    lat: number;
    lng: number;
    placeId?: string;
    category?: string;
  }) => {
    setRecentSearches((prev) => {
      const withoutDuplicate = prev.filter(
        (item) =>
          item.name.toLowerCase() !== hub.name.toLowerCase() &&
          (!hub.placeId || item.placeId !== hub.placeId)
      );
      const updated: SearchedHub[] = [
        {
          name: hub.name,
          address: hub.address,
          lat: hub.lat,
          lng: hub.lng,
          placeId: hub.placeId,
          category: hub.category,
          searchedAt: 'Just now'
        },
        ...withoutDuplicate
      ].slice(0, 10);

      try {
        localStorage.setItem('siterisk_driver_recent_searches_v1', JSON.stringify(updated));
      } catch (e) {
        console.warn('Could not persist recent searches to localStorage:', e);
      }
      return updated;
    });
  };

  // Clear search history
  const handleClearRecentSearches = () => {
    setRecentSearches([]);
    try {
      localStorage.removeItem('siterisk_driver_recent_searches_v1');
    } catch (e) {
      console.warn('Could not clear recent searches:', e);
    }
  };

  // Handle selecting a recent hub
  const handleSelectRecentHub = async (hub: SearchedHub) => {
    setSearchQuery(hub.name);
    setPredictions([]);

    if (hub.placeId) {
      const details = await getPlaceDetails(hub.placeId);
      if (details) {
        setSelectedPlace(details);
        recordRecentSearch({
          name: details.name,
          address: details.formattedAddress,
          lat: details.lat,
          lng: details.lng,
          placeId: details.placeId
        });
        if (mapInstanceRef.current) {
          mapInstanceRef.current.panTo({ lat: details.lat, lng: details.lng });
          mapInstanceRef.current.setZoom(17);
        }
        return;
      }
    }

    const fallbackDetails: PlaceResultDetails = {
      name: hub.name,
      formattedAddress: hub.address,
      lat: hub.lat,
      lng: hub.lng,
      placeId: hub.placeId || `hub-${hub.name.toLowerCase().replace(/\s+/g, '-')}`,
      photos: [
        'https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?auto=format&fit=crop&w=800&q=80',
        'https://images.unsplash.com/photo-1590674899484-d5640e854abe?auto=format&fit=crop&w=800&q=80'
      ],
      plusCode: '9C4VFR54+9Q',
      nearbySensitivities: scanNearbySensitivities(hub.lat, hub.lng, hub.name)
    };

    setSelectedPlace(fallbackDetails);
    recordRecentSearch(hub);
    if (mapInstanceRef.current) {
      mapInstanceRef.current.panTo({ lat: hub.lat, lng: hub.lng });
      mapInstanceRef.current.setZoom(17);
    }
  };

  // Simulated driver coordinates (Midlands corridor: 52.4200, -1.2500)
  const driverLat = 52.42;
  const driverLng = -1.25;

  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<any>(null);
  const markersRef = useRef<any[]>([]);

  // Search input debounced autocomplete
  useEffect(() => {
    if (!searchQuery.trim() || searchQuery.length < 2) {
      setPredictions([]);
      return;
    }

    const timer = setTimeout(async () => {
      setIsSearching(true);
      try {
        const results = await searchPlacesAutocomplete(searchQuery);
        setPredictions(results);
      } catch (err) {
        console.warn('Place autocomplete error:', err);
      } finally {
        setIsSearching(false);
      }
    }, 250);

    return () => clearTimeout(timer);
  }, [searchQuery]);

  // Initialize or update Google Map
  useEffect(() => {
    if (!mapContainerRef.current) return;

    // Check if Google Maps JS API is loaded
    if (typeof window !== 'undefined' && (window as any).google?.maps) {
      const google = (window as any).google;

      if (!mapInstanceRef.current) {
        const mapOptions = {
          center: { lat: selectedPlace.lat, lng: selectedPlace.lng },
          zoom: 14,
          mapTypeId: mapType,
          gestureHandling: 'greedy',
          disableDefaultUI: false,
          zoomControl: true,
          streetViewControl: true,
          mapTypeControl: false,
          fullscreenControl: true,
          internalUsageAttributionIds: ['gmp_git_agentskills_v1']
        };

        mapInstanceRef.current = new google.maps.Map(mapContainerRef.current, mapOptions);
      } else {
        mapInstanceRef.current.setMapTypeId(mapType);
        mapInstanceRef.current.panTo({ lat: selectedPlace.lat, lng: selectedPlace.lng });
      }

      // Clear old markers
      markersRef.current.forEach((m) => m.setMap(null));
      markersRef.current = [];

      // Add marker for currently selected searched place
      const searchMarker = new google.maps.Marker({
        position: { lat: selectedPlace.lat, lng: selectedPlace.lng },
        map: mapInstanceRef.current,
        title: selectedPlace.name,
        animation: google.maps.Animation.DROP,
        icon: {
          path: google.maps.SymbolPath.CIRCLE,
          scale: 12,
          fillColor: '#2563EB',
          fillOpacity: 1,
          strokeColor: '#FFFFFF',
          strokeWeight: 3
        }
      });

      const infoWindow = new google.maps.InfoWindow({
        content: `
          <div style="padding: 6px; font-family: sans-serif; max-width: 220px; color: #0f172a;">
            <div style="font-weight: bold; font-size: 13px; margin-bottom: 3px;">${selectedPlace.name}</div>
            <div style="font-size: 11px; color: #475569; margin-bottom: 6px;">${selectedPlace.formattedAddress}</div>
            <div style="font-size: 10px; color: #2563eb; font-weight: 600;">Selected Location</div>
          </div>
        `
      });

      searchMarker.addListener('click', () => {
        infoWindow.open(mapInstanceRef.current, searchMarker);
      });

      markersRef.current.push(searchMarker);

      // Add markers for all existing assessed sites in the system
      sites.forEach((site) => {
        const pinColor =
          site.overallRiskLevel === 'CRITICAL'
            ? '#EF4444'
            : site.overallRiskLevel === 'HIGH'
            ? '#F97316'
            : site.overallRiskLevel === 'MEDIUM'
            ? '#F59E0B'
            : '#10B981';

        const siteMarker = new google.maps.Marker({
          position: { lat: site.coordinates.lat, lng: site.coordinates.lng },
          map: mapInstanceRef.current,
          title: `${site.title} (${site.overallRiskLevel} Risk)`,
          icon: {
            path: 'M 0,0 C -2,-20 -10,-22 -10,-30 A 10,10 0 1,1 10,-30 C 10,-22 2,-20 0,0 z',
            fillColor: pinColor,
            fillOpacity: 1,
            strokeColor: '#FFFFFF',
            strokeWeight: 1.5,
            scale: 0.9
          }
        });

        const siteInfoWindow = new google.maps.InfoWindow({
          content: `
            <div style="padding: 6px; font-family: sans-serif; max-width: 240px; color: #0f172a;">
              <div style="font-weight: bold; font-size: 13px;">${site.title}</div>
              <div style="font-size: 10px; font-weight: bold; color: ${pinColor}; margin: 2px 0;">Risk: ${site.overallRiskLevel} • Score ${site.overallScore}/25</div>
              <div style="font-size: 11px; color: #475569; margin-bottom: 6px;">Gate Code: ${site.businessSection.gateSecurityCode}</div>
              <div style="font-size: 10px; color: #059669; font-weight: bold;">Click to view assessment</div>
            </div>
          `
        });

        siteMarker.addListener('click', () => {
          siteInfoWindow.open(mapInstanceRef.current, siteMarker);
          onSelectSite(site);
        });

        markersRef.current.push(siteMarker);
      });
    }
  }, [selectedPlace, mapType, sites]);

  // Handle selecting a prediction from Google Places
  const handleSelectPrediction = async (prediction: PlacePrediction) => {
    setSearchQuery(prediction.description);
    setPredictions([]);

    const details = await getPlaceDetails(prediction.placeId);
    if (details) {
      setSelectedPlace(details);
      recordRecentSearch({
        name: details.name,
        address: details.formattedAddress,
        lat: details.lat,
        lng: details.lng,
        placeId: prediction.placeId
      });
      if (mapInstanceRef.current) {
        mapInstanceRef.current.panTo({ lat: details.lat, lng: details.lng });
        mapInstanceRef.current.setZoom(17);
      }
    } else {
      const fallbackPlace = {
        name: prediction.mainText,
        formattedAddress: prediction.description,
        lat: 52.4578,
        lng: -1.2467,
        placeId: prediction.placeId,
        photos: [
          'https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?auto=format&fit=crop&w=800&q=80',
          'https://images.unsplash.com/photo-1590674899484-d5640e854abe?auto=format&fit=crop&w=800&q=80'
        ],
        plusCode: '9C4VFR54+9Q',
        nearbySensitivities: scanNearbySensitivities(52.4578, -1.2467, prediction.description)
      };
      setSelectedPlace(fallbackPlace);
      recordRecentSearch({
        name: fallbackPlace.name,
        address: fallbackPlace.formattedAddress,
        lat: fallbackPlace.lat,
        lng: fallbackPlace.lng,
        placeId: prediction.placeId
      });
      if (mapInstanceRef.current) {
        mapInstanceRef.current.panTo({ lat: fallbackPlace.lat, lng: fallbackPlace.lng });
        mapInstanceRef.current.setZoom(17);
      }
    }
  };

  // Cab Arrival Geofence Audio Alert Simulator
  const handlePlayCabArrivalAlert = () => {
    if (isPlayingCabAlert) {
      tts.stop();
      setIsPlayingCabAlert(false);
      return;
    }

    const script = `In-cab arrival alert for ${selectedPlace.name}. You are approaching the commercial delivery entrance. Maintain a strict 10 miles per hour yard speed limit. Stop at the security gatehouse barrier, turn off engine, and sound horn before blind reversing corners. Hard hat, hi-vis class 3, and steel toe boots are required outside your vehicle cab.`;

    setIsPlayingCabAlert(true);
    tts.speak(script, 1.05).then(() => {
      setIsPlayingCabAlert(false);
    });
  };

  // Center on driver GPS
  const handleCenterDriverGPS = () => {
    if (mapInstanceRef.current) {
      mapInstanceRef.current.panTo({ lat: driverLat, lng: driverLng });
      mapInstanceRef.current.setZoom(13);
    }
  };

  // Check if selected place matches any existing site
  const existingSiteMatch = sites.find((s) => {
    if (s.title.toLowerCase() === selectedPlace.name.toLowerCase()) return true;
    if (
      s.title.toLowerCase().includes(selectedPlace.name.toLowerCase()) ||
      selectedPlace.name.toLowerCase().includes(s.title.toLowerCase())
    ) {
      return true;
    }
    if (
      selectedPlace.formattedAddress &&
      s.address.toLowerCase().includes(selectedPlace.formattedAddress.toLowerCase().slice(0, 20))
    ) {
      return true;
    }
    if (s.placeId && selectedPlace.placeId && s.placeId === selectedPlace.placeId) {
      return true;
    }
    const dist = calculateDistanceMiles(
      s.coordinates.lat,
      s.coordinates.lng,
      selectedPlace.lat,
      selectedPlace.lng
    );
    return dist < 0.35;
  });

  const distanceFromDriver = calculateDistanceMiles(
    driverLat,
    driverLng,
    selectedPlace.lat,
    selectedPlace.lng
  );

  const matchingExistingSites = searchQuery.trim().length > 1
    ? sites.filter(
        (s) =>
          s.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          s.address.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : [];

  return (
    <div className="space-y-4">
      {/* DELIVERY SITE RISK DIRECTORY - HEADER BANNER */}
      <div className="flex flex-wrap items-center justify-between gap-3 bg-white p-4 sm:p-5 rounded-2xl border border-slate-200 shadow-sm">
        <div className="flex items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-600 text-white font-bold shadow-md shadow-blue-600/20">
            <Compass className="h-6 w-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-base sm:text-xl font-bold text-slate-900">
                Delivery Site Risk Directory
              </h1>
              <span className="rounded-full bg-blue-50 px-2.5 py-0.5 text-xs font-bold text-blue-700 border border-blue-200">
                Site Search &amp; RAMS
              </span>
            </div>
            <p className="text-xs text-slate-500">
              Search commercial depots, industrial parks, or addresses with live clearance checks, site plans &amp; risk assessments
            </p>
          </div>
        </div>

        {/* Quick Location Stats */}
        <div className="flex items-center gap-3 text-xs font-medium text-slate-600">
          <div className="flex items-center gap-1.5 bg-slate-50 px-3 py-1.5 rounded-lg border border-slate-200">
            <Truck className="h-4 w-4 text-blue-600" />
            <span>Vehicle: <strong>{driverVehicle.vehicleReg}</strong> ({driverVehicle.heightMeters}m)</span>
          </div>
          <div className="hidden sm:flex items-center gap-1.5 bg-slate-50 px-3 py-1.5 rounded-lg border border-slate-200">
            <ShieldCheck className="h-4 w-4 text-emerald-600" />
            <span>{sites.length} Assessed Sites in Directory</span>
          </div>
        </div>
      </div>

      {/* PROMINENT LARGER SEARCH BAR */}
      <div className="relative z-30">
        <div className="flex items-center rounded-2xl border-2 border-blue-500/40 bg-white p-2 shadow-lg focus-within:border-blue-600 focus-within:ring-4 focus-within:ring-blue-500/10 transition-all">
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
            <Search className="h-6 w-6" />
          </div>
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                if (matchingExistingSites.length > 0) {
                  const match = matchingExistingSites[0];
                  handleSelectRecentHub({
                    name: match.title,
                    address: match.address,
                    lat: match.coordinates.lat,
                    lng: match.coordinates.lng,
                    placeId: match.placeId
                  });
                  setSearchQuery('');
                } else if (predictions.length > 0) {
                  handleSelectPrediction(predictions[0]);
                } else if (searchQuery.trim()) {
                  const match = sites.find(
                    (s) =>
                      s.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                      s.address.toLowerCase().includes(searchQuery.toLowerCase())
                  );
                  if (match) {
                    handleSelectRecentHub({
                      name: match.title,
                      address: match.address,
                      lat: match.coordinates.lat,
                      lng: match.coordinates.lng,
                      placeId: match.placeId
                    });
                  }
                }
              }
            }}
            placeholder="Search any commercial depot, industrial park, port, postal code or place (e.g. Magna Park, Heathrow Cargo, LE17 4XN)..."
            className="flex-1 px-3 py-2 text-sm sm:text-base font-medium text-slate-900 placeholder:text-slate-400 focus:outline-none bg-transparent"
          />
          {searchQuery && (
            <button
              onClick={() => {
                setSearchQuery('');
                setPredictions([]);
              }}
              className="p-2 text-slate-400 hover:text-slate-700"
              title="Clear search"
            >
              <X className="h-5 w-5" />
            </button>
          )}
          <div className="hidden sm:flex items-center gap-1.5 rounded-lg bg-slate-100 px-2.5 py-1 text-[11px] font-bold text-slate-600 border border-slate-200 mr-1">
            <span>Google Places API</span>
          </div>
        </div>

        {/* Autocomplete Predictions & Existing Directory Sites Dropdown */}
        {(predictions.length > 0 || matchingExistingSites.length > 0) && (
          <div className="absolute top-full mt-2 w-full rounded-2xl border border-slate-200 bg-white shadow-2xl overflow-hidden z-40 animate-in fade-in slide-in-from-top-2">
            {matchingExistingSites.length > 0 && (
              <div>
                <div className="px-3 py-1.5 bg-emerald-50 border-b border-emerald-100 text-[11px] font-bold text-emerald-800 uppercase tracking-wider flex items-center justify-between">
                  <span>Assessed Sites in Directory</span>
                  <span className="text-[10px] bg-emerald-200/60 px-1.5 py-0.5 rounded font-bold">Existing RAMS</span>
                </div>
                <div className="divide-y divide-slate-100">
                  {matchingExistingSites.map((site) => (
                    <div
                      key={site.id}
                      onClick={() => {
                        handleSelectRecentHub({
                          name: site.title,
                          address: site.address,
                          lat: site.coordinates.lat,
                          lng: site.coordinates.lng,
                          placeId: site.placeId
                        });
                        setSearchQuery('');
                        setPredictions([]);
                      }}
                      className="flex items-start gap-3 p-3 hover:bg-emerald-50/60 cursor-pointer transition-colors"
                    >
                      <ShieldCheck className="h-5 w-5 text-emerald-600 shrink-0 mt-0.5" />
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <p className="text-sm font-bold text-slate-900 truncate">{site.title}</p>
                          <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-blue-100 text-blue-700">
                            Gate: {site.businessSection.gateSecurityCode}
                          </span>
                        </div>
                        <p className="text-xs text-slate-500 truncate">{site.address}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {predictions.length > 0 && (
              <div>
                <div className="px-3 py-1.5 bg-slate-50 border-b border-slate-100 text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                  Google Places Suggestions
                </div>
                <div className="max-h-64 overflow-y-auto divide-y divide-slate-100">
                  {predictions.map((p) => (
                    <div
                      key={p.placeId}
                      onClick={() => handleSelectPrediction(p)}
                      className="flex items-start gap-3 p-3 hover:bg-blue-50 cursor-pointer transition-colors"
                    >
                      <MapPin className="h-5 w-5 text-blue-600 shrink-0 mt-0.5" />
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-bold text-slate-900 truncate">{p.mainText}</p>
                        <p className="text-xs text-slate-500 truncate">{p.secondaryText || p.description}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {/* RECENTLY SEARCHED HUBS (Targeted element: div:nth-of-type(3)) */}
      <div id="driver-recent-searched-hubs" className="flex items-center gap-2 overflow-x-auto pb-1 text-xs">
        <div className="flex items-center gap-1.5 text-xs font-bold text-slate-700 whitespace-nowrap bg-slate-100 px-2.5 py-1.5 rounded-xl border border-slate-200 shrink-0 shadow-xs">
          <History className="h-3.5 w-3.5 text-blue-600" />
          <span>Last Searched Hubs:</span>
          {recentSearches.length > 0 && (
            <span className="ml-0.5 rounded-full bg-blue-100 text-blue-700 px-1.5 py-0.2 text-[10px] font-extrabold">
              {recentSearches.length}
            </span>
          )}
        </div>

        {recentSearches.map((hub) => {
          const isSelected = selectedPlace.name.toLowerCase() === hub.name.toLowerCase();
          return (
            <button
              key={`${hub.name}-${hub.lat}-${hub.lng}`}
              onClick={() => handleSelectRecentHub(hub)}
              className={`group flex items-center gap-1.5 whitespace-nowrap rounded-xl border px-3 py-1.5 font-semibold transition-all shadow-sm active:scale-95 shrink-0 ${
                isSelected
                  ? 'border-blue-600 bg-blue-50 text-blue-800 ring-2 ring-blue-500/20 shadow-blue-500/10'
                  : 'border-slate-200 bg-white hover:border-blue-400 hover:bg-slate-50 text-slate-700'
              }`}
              title={`Inspect ${hub.name} (${hub.address})`}
            >
              <MapPin className={`h-3.5 w-3.5 ${isSelected ? 'text-blue-600' : 'text-slate-400 group-hover:text-blue-600'}`} />
              <span className="text-xs">{hub.name}</span>
              {hub.searchedAt && (
                <span className={`text-[10px] font-normal ml-0.5 px-1.5 py-0.5 rounded ${
                  isSelected ? 'bg-blue-200/60 text-blue-900' : 'bg-slate-100 text-slate-500'
                }`}>
                  {hub.searchedAt}
                </span>
              )}
            </button>
          );
        })}

        {recentSearches.length > 0 && (
          <button
            onClick={handleClearRecentSearches}
            className="flex items-center gap-1 text-[11px] font-semibold text-slate-400 hover:text-rose-600 whitespace-nowrap px-2 py-1 transition-colors shrink-0 ml-auto"
            title="Clear recent searches history"
          >
            <Trash2 className="h-3 w-3" />
            <span>Clear</span>
          </button>
        )}
      </div>

      {/* MAIN CONTENT AREA: INTERACTIVE MAP UNDERNEATH + PLACE ACTION CARD */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* MAP CONTAINER (Col 2) */}
        <div className="lg:col-span-2 space-y-2">
          <div className="relative rounded-2xl border-2 border-slate-200 bg-white shadow-md overflow-hidden">
            {/* Map Style & Action Floating Bar */}
            <div className="absolute top-3 left-3 z-10 flex flex-wrap items-center gap-2">
              <div className="flex rounded-lg border border-slate-200 bg-white/95 backdrop-blur-sm p-0.5 shadow-sm">
                {(['roadmap', 'satellite', 'hybrid'] as const).map((m) => (
                  <button
                    key={m}
                    onClick={() => setMapType(m)}
                    className={`rounded-md px-2.5 py-1 text-xs font-bold capitalize transition-all ${
                      mapType === m
                        ? 'bg-blue-600 text-white shadow-sm'
                        : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    {m}
                  </button>
                ))}
              </div>

              <button
                onClick={handleCenterDriverGPS}
                className="flex items-center gap-1.5 rounded-lg border border-slate-200 bg-white/95 backdrop-blur-sm px-2.5 py-1 text-xs font-bold text-slate-700 hover:bg-white shadow-sm transition-colors"
                title="Center map on my truck's GPS coordinates"
              >
                <Navigation className="h-3.5 w-3.5 text-blue-600" />
                <span>My Location</span>
              </button>
            </div>

            {/* Google Map Canvas */}
            <div
              ref={mapContainerRef}
              className="w-full h-[420px] sm:h-[480px] bg-slate-100"
            />

            {/* Map Legend Overlay */}
            <div className="absolute bottom-3 left-3 z-10 flex items-center gap-3 rounded-xl bg-white/95 backdrop-blur-sm px-3 py-1.5 text-[11px] font-bold text-slate-700 border border-slate-200 shadow-sm pointer-events-none">
              <div className="flex items-center gap-1">
                <span className="h-2.5 w-2.5 rounded-full bg-blue-600 inline-block" />
                <span>Searched Place</span>
              </div>
              <div className="flex items-center gap-1">
                <span className="h-2.5 w-2.5 rounded-full bg-emerald-500 inline-block" />
                <span>Low Risk Site</span>
              </div>
              <div className="flex items-center gap-1">
                <span className="h-2.5 w-2.5 rounded-full bg-rose-500 inline-block" />
                <span>High Risk Site</span>
              </div>
            </div>
          </div>
        </div>

        {/* SELECTED PLACE DETAILS & GENERATE ACTION CARD (Col 1) */}
        <div className="space-y-4">
          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm space-y-4">
            <div className="flex items-start justify-between gap-2 border-b border-slate-100 pb-3">
              <div>
                <span className="text-[10px] font-bold text-blue-600 uppercase tracking-wider">
                  Location Intelligence
                </span>
                <h3 className="text-base font-bold text-slate-900 mt-0.5">{selectedPlace.name}</h3>
              </div>
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-blue-50 text-blue-600 shrink-0">
                <MapPin className="h-5 w-5" />
              </div>
            </div>

            {/* Google Places Photos Carousel */}
            {selectedPlace.photos && selectedPlace.photos.length > 0 && (
              <div className="relative rounded-xl overflow-hidden border border-slate-200 bg-slate-100">
                <img
                  src={selectedPlace.photos[activePhotoIndex] || selectedPlace.photos[0]}
                  alt={selectedPlace.name}
                  className="w-full h-36 object-cover"
                />
                <div className="absolute top-2 left-2 bg-slate-900/80 backdrop-blur-md px-2 py-0.5 rounded text-[10px] font-bold text-white flex items-center gap-1">
                  <Camera className="h-3 w-3 text-blue-400" />
                  <span>Google Places Photo {activePhotoIndex + 1}/{selectedPlace.photos.length}</span>
                </div>
                {selectedPlace.photos.length > 1 && (
                  <div className="absolute bottom-2 right-2 flex items-center gap-1 bg-slate-900/80 backdrop-blur-sm p-1 rounded-lg">
                    {selectedPlace.photos.map((_, i) => (
                      <button
                        key={i}
                        onClick={() => setActivePhotoIndex(i)}
                        className={`h-2 rounded-full transition-all ${
                          activePhotoIndex === i ? 'w-4 bg-blue-500' : 'w-2 bg-white/60'
                        }`}
                      />
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* Address & Coordinates */}
            <div className="space-y-2 text-xs">
              <div>
                <span className="font-semibold text-slate-500 block">Full Address:</span>
                <p className="text-slate-800 font-medium">{selectedPlace.formattedAddress}</p>
              </div>

              {/* Plus Code & Phone */}
              <div className="grid grid-cols-2 gap-2 pt-1">
                <div className="bg-slate-50 p-2 rounded-lg border border-slate-100">
                  <span className="text-slate-400 block text-[10px] uppercase font-bold">Google Plus Code</span>
                  <strong className="text-blue-700 font-mono text-[11px]">{selectedPlace.plusCode || '9C4VFR54+9Q'}</strong>
                </div>
                <div className="bg-slate-50 p-2 rounded-lg border border-slate-100">
                  <span className="text-slate-400 block text-[10px] uppercase font-bold">Gatehouse Phone</span>
                  <a
                    href={`tel:${selectedPlace.phoneNumber || '+441455892000'}`}
                    className="text-slate-800 font-mono text-[11px] hover:text-blue-600 truncate block"
                  >
                    {selectedPlace.phoneNumber || '+44 1455 892000'}
                  </a>
                </div>
              </div>

              {/* Operating Hours */}
              {selectedPlace.openingHours && (
                <div className="flex items-center justify-between p-2 rounded-lg bg-slate-50 border border-slate-200">
                  <div className="flex items-center gap-1.5">
                    <Clock className="h-3.5 w-3.5 text-blue-600" />
                    <span className="text-[11px] font-bold text-slate-800">
                      {selectedPlace.openingHours.isOpen ? '🟢 Gate Open Now' : '🔴 Gate Restricted'}
                    </span>
                  </div>
                  <span className="text-[10px] text-slate-500 font-medium">
                    {selectedPlace.openingHours.weekdayText[0] || '24h Delivery Access'}
                  </span>
                </div>
              )}

              {/* Distance from Driver */}
              <div className="flex items-center justify-between p-2.5 rounded-lg bg-blue-50/60 border border-blue-100">
                <div className="flex items-center gap-2">
                  <Compass className="h-4 w-4 text-blue-600" />
                  <div>
                    <div className="text-[11px] text-slate-500">Distance from Current Location</div>
                    <div className="font-bold text-slate-900">{distanceFromDriver} miles (~{Math.round((distanceFromDriver / 45) * 60)} mins driving)</div>
                  </div>
                </div>
              </div>

              {/* Nearby Sensitive Zones Scanner */}
              {selectedPlace.nearbySensitivities && selectedPlace.nearbySensitivities.length > 0 && (
                <div className="p-2.5 rounded-xl bg-amber-50/80 border border-amber-200 space-y-1.5">
                  <div className="flex items-center gap-1.5 font-bold text-amber-900 text-xs">
                    <AlertCircle className="h-3.5 w-3.5 text-amber-600" />
                    <span>Nearby Sensitive Infrastructure ({selectedPlace.nearbySensitivities.length} detected)</span>
                  </div>
                  <div className="space-y-1">
                    {selectedPlace.nearbySensitivities.map((s, idx) => (
                      <div key={idx} className="text-[11px] text-amber-950 flex items-start gap-1">
                        <span className="font-bold">• {s.name} ({s.distanceMeters}m):</span>
                        <span className="text-amber-800 line-clamp-1">{s.riskReason}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* STREET VIEW & AUDIO ALERT ACTION BUTTONS */}
            <div className="grid grid-cols-2 gap-2 pt-1">
              <button
                onClick={() => setShowStreetView(true)}
                className="flex items-center justify-center gap-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white py-2 text-xs font-bold transition-all shadow-sm"
              >
                <Eye className="h-3.5 w-3.5 text-blue-400" />
                <span>360° Street View</span>
              </button>

              <button
                onClick={handlePlayCabArrivalAlert}
                className={`flex items-center justify-center gap-1.5 rounded-xl py-2 text-xs font-bold transition-all border ${
                  isPlayingCabAlert
                    ? 'bg-rose-50 border-rose-300 text-rose-700 animate-pulse'
                    : 'bg-blue-50 border-blue-200 text-blue-700 hover:bg-blue-100'
                }`}
              >
                {isPlayingCabAlert ? (
                  <>
                    <VolumeX className="h-3.5 w-3.5 text-rose-600" />
                    <span>Stop Audio</span>
                  </>
                ) : (
                  <>
                    <Volume2 className="h-3.5 w-3.5 text-blue-600" />
                    <span>Cab Arrival Alert</span>
                  </>
                )}
              </button>
            </div>

            {/* PRIMARY ACTION BUTTONS - EASY NEXT OPTIONS */}
            <div className="space-y-2 pt-2 border-t border-slate-100">
              {existingSiteMatch ? (
                <div className="rounded-xl border border-emerald-300 bg-gradient-to-br from-emerald-50/70 via-teal-50/40 to-white p-4 space-y-3 shadow-xs">
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex items-center gap-2">
                      <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-emerald-600 text-white shadow-2xs">
                        <ShieldCheck className="h-4 w-4" />
                      </span>
                      <div>
                        <span className="text-[10px] font-extrabold text-emerald-900 uppercase tracking-wide">
                          Existing Risk Assessment Available
                        </span>
                        <h4 className="text-sm font-bold text-slate-900 leading-tight">
                          {existingSiteMatch.title}
                        </h4>
                      </div>
                    </div>
                    <span
                      className={`px-2 py-0.5 rounded-full text-[10px] font-extrabold uppercase border ${
                        existingSiteMatch.overallRiskLevel === 'CRITICAL'
                          ? 'bg-rose-100 text-rose-800 border-rose-200'
                          : existingSiteMatch.overallRiskLevel === 'HIGH'
                          ? 'bg-amber-100 text-amber-800 border-amber-200'
                          : 'bg-emerald-100 text-emerald-800 border-emerald-200'
                      }`}
                    >
                      {existingSiteMatch.overallRiskLevel} Risk ({existingSiteMatch.overallScore}/25)
                    </span>
                  </div>

                  {/* Quick Specs summary */}
                  <div className="grid grid-cols-2 gap-2 text-[11px] text-slate-600 bg-white/80 p-2 rounded-lg border border-slate-200/60">
                    <div>
                      <span className="text-slate-400">Gate Code: </span>
                      <strong className="font-mono text-slate-900">{existingSiteMatch.businessSection.gateSecurityCode}</strong>
                    </div>
                    <div>
                      <span className="text-slate-400">Clearance: </span>
                      <strong className="text-slate-900">{existingSiteMatch.businessSection.vehicleConstraints.maxHeightMeters}m</strong>
                    </div>
                  </div>

                  {/* Easy Next Options */}
                  <div className="space-y-2 pt-1">
                    <button
                      type="button"
                      onClick={() => onSelectSite(existingSiteMatch)}
                      className="w-full flex items-center justify-center gap-2 rounded-xl bg-blue-600 hover:bg-blue-700 active:scale-95 py-2.5 text-xs font-bold text-white shadow-md shadow-blue-600/20 transition-all"
                    >
                      <ShieldCheck className="h-4 w-4" />
                      <span>View Risk Assessment</span>
                    </button>

                    {existingSiteMatch.businessSection?.sitePlan && onSelectSitePlan && (
                      <button
                        type="button"
                        onClick={() => onSelectSitePlan(existingSiteMatch)}
                        className="w-full flex items-center justify-center gap-2 rounded-xl border border-blue-200 bg-blue-50 hover:bg-blue-100 active:scale-95 py-2.5 text-xs font-bold text-blue-700 transition-all"
                      >
                        <Layers className="h-4 w-4 text-blue-600" />
                        <span>View Site Plan</span>
                      </button>
                    )}
                  </div>
                </div>
              ) : (
                <div className="rounded-xl border border-blue-200 bg-gradient-to-br from-blue-50/50 via-slate-50 to-white p-4 space-y-3 shadow-xs">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-blue-600 text-white shadow-2xs">
                        <Sparkles className="h-4 w-4 text-amber-300" />
                      </span>
                      <span className="text-xs font-bold text-slate-700">
                        No Existing Risk Assessment
                      </span>
                    </div>
                    <p className="text-xs text-slate-600">
                      Would you like to create a new Risk Assessment for <strong>{selectedPlace.name}</strong>?
                    </p>
                  </div>

                  {/* Easy Next Options */}
                  <div className="space-y-2 pt-1">
                    <button
                      type="button"
                      onClick={() =>
                        onGenerateRiskAssessmentForPlace({
                          title: selectedPlace.name,
                          address: selectedPlace.formattedAddress,
                          lat: selectedPlace.lat,
                          lng: selectedPlace.lng,
                          placeId: selectedPlace.placeId
                        })
                      }
                      className="w-full flex items-center justify-center gap-2 rounded-xl bg-blue-600 hover:bg-blue-700 active:scale-95 py-2.5 text-xs font-bold text-white shadow-md shadow-blue-600/20 transition-all"
                    >
                      <Plus className="h-4 w-4" />
                      <span>Create Risk Assessment for this Site</span>
                    </button>

                    <button
                      type="button"
                      onClick={() =>
                        onGenerateRiskAssessmentForPlace({
                          title: selectedPlace.name,
                          address: selectedPlace.formattedAddress,
                          lat: selectedPlace.lat,
                          lng: selectedPlace.lng,
                          placeId: selectedPlace.placeId
                        })
                      }
                      className="w-full flex items-center justify-center gap-2 rounded-xl border border-indigo-200 bg-indigo-50 hover:bg-indigo-100 active:scale-95 py-2 text-xs font-bold text-indigo-700 transition-all"
                    >
                      <Sparkles className="h-3.5 w-3.5 text-amber-500" />
                      <span>AI Auto-Generate Baseline RAMS &amp; Yard CAD</span>
                    </button>
                  </div>
                </div>
              )}

              {(() => {
                const navAppKey = driverVehicle?.preferredNavApp || 'GOOGLE_MAPS';
                const navApp = NAV_APP_OPTIONS[navAppKey];
                const navUrl = generateNavUrl(selectedPlace.lat, selectedPlace.lng, navAppKey, selectedPlace.formattedAddress);

                return (
                  <div className="space-y-1.5">
                    <button
                      onClick={() => {
                        window.open(navUrl, '_blank');
                      }}
                      className="w-full flex items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 py-2.5 px-3 text-xs font-semibold text-slate-800 transition-colors shadow-sm"
                    >
                      <Navigation className="h-3.5 w-3.5 text-blue-600" />
                      <span>Open in {navApp.name}</span>
                      <ExternalLink className="h-3 w-3 text-slate-400 ml-auto" />
                    </button>

                    <div className="flex items-center justify-between text-[10px] text-slate-500 px-1">
                      <span>Vehicle: {driverVehicle?.heightMeters}m H • {driverVehicle?.weightTonnes}t • {driverVehicle?.widthMeters || 2.55}m W</span>
                      <span className={navApp.isTruckSpecific ? 'text-emerald-600 font-semibold' : 'text-blue-600'}>
                        {navApp.isTruckSpecific ? 'HGV Auto-Detour' : 'Default Navigation'}
                      </span>
                    </div>
                  </div>
                );
              })()}
            </div>
          </div>

          {/* Quick Tip Banner */}
          <div className="rounded-xl border border-slate-200 bg-slate-50 p-3.5 text-xs text-slate-600 space-y-1">
            <div className="font-bold text-slate-800 flex items-center gap-1.5">
              <Compass className="h-3.5 w-3.5 text-blue-600" />
              <span>Driver Design™ Navigation System</span>
            </div>
            <p className="text-[11px] leading-relaxed">
              Use the top Quick Navigation dock to switch between Place Search, Site Directory, Interactive Yard Plans, Approach Video, and Hazard Snapshots anytime.
            </p>
          </div>
        </div>
      </div>

      {/* Google Street View 360° Gate Inspection Modal */}
      {showStreetView && (
        <StreetViewGateModal
          siteTitle={selectedPlace.name}
          address={selectedPlace.formattedAddress}
          lat={selectedPlace.lat}
          lng={selectedPlace.lng}
          onClose={() => setShowStreetView(false)}
        />
      )}
    </div>
  );
};
