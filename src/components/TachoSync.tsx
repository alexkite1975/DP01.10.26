'use client';
import { SiteReviews } from './SiteReviews';
import { DriverSafetyShieldHub } from './safety/DriverSafetyShieldHub';
import { VehicleCheck } from './VehicleCheck';
import DvsaCompliance from './DvsaCompliance';

import React, { useState, useEffect } from 'react';
import { 
  Clock, AlertTriangle, CreditCard, Calendar, CheckCircle2, ShieldCheck, 
  Camera, Usb, Activity, RefreshCw, Truck, ChevronRight, ChevronLeft, 
  Receipt, Sparkles, Wrench, Mic, Volume2, MapPin, Moon, Sun, Copy, Check,
  Info, Compass, Star, Search, ShieldAlert, Coffee, FileText, Upload,
  Building, Send, CheckSquare, Square, X, PlusCircle
} from 'lucide-react';

type ModuleView = 'safety-shield' | 'vehicle-check' | 'compliance' |
  'cockpit'           
  | 'live-shift'        
  | 'article-12'        
  | 'truck-stops'       
  | 'tacho-scan'        
  | 'voice-wizard'      
  | 'history'           
  | 'history-printout'  
  | 'tools-menu'        
  | 'tool-predrive'     
  | 'tool-salary'       
  | 'tool-deadlines'    
  | 'site-reviews'      
  | 'depot-admin';      

interface DepotSite {
  id: string;
  name: string;
  postcode: string;
  address: string;
  placeId: string;
  overallRating: number;
  reviewCount: number;
  turningScore: number;
  turningNotes: string;
  waitScore: number;
  avgWaitMins: number;
  welfareScore: number;
  facilities: string[];
  overnightAllowed: boolean;
  overnightNotes: string;
  hazardWarning: string;
  isVerifiedByDepot: boolean;
  ramsUploadedDate?: string;
  ramsFileName?: string;
  gatehousePhone: string;
  mandatoryPpe: {
    hiVis: boolean;
    steelBoots: boolean;
    hardHat: boolean;
    safetyGlasses: boolean;
    gloves: boolean;
  };
}

export default function TachoSync({ initialView = 'cockpit' }: { initialView?: ModuleView }) {
  const [currentView, setCurrentView] = useState<ModuleView>(initialView);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [ingestionStep, setIngestionStep] = useState<'idle' | 'processing' | 'done'>('idle');
  const [selectedShiftIndex, setSelectedShiftIndex] = useState(0);

  // SWIPE DETECTION
  const [touchStartX, setTouchStartX] = useState<number | null>(null);
  const [touchEndX, setTouchEndX] = useState<number | null>(null);
  const minSwipeDistance = 50;

  // OPERATIONAL PRE-DRIVE STATE
  const [operationalMode, setOperationalMode] = useState<'single' | 'multi' | 'ferry' | 'out-of-scope'>('single');

  // CONVERSATIONAL VOICE STATE
  const [voiceQueryActive, setVoiceQueryActive] = useState(false);
  const [voiceResponse, setVoiceResponse] = useState<string | null>(null);

  // ARTICLE 12 EXEMPTION STATE
  const [selectedArt12Reason, setSelectedArt12Reason] = useState<string>('M6 Motorway Accident Standstill');
  const [copiedArt12, setCopiedArt12] = useState(false);

  // SALARY STATE
  const [paidHoursInput, setPaidHoursInput] = useState<string>('42.0');
  const actualWorkedHours = 46.5;

  // COMPREHENSIVE UK LOGISTICS SITES DATABASE
  const initialDepotSites: DepotSite[] = [
    {
      id: 'lba4',
      name: 'Amazon Fulfillment Centre LBA4',
      postcode: 'DN11 8BF',
      address: 'Unit 1 Symmetry Park, Doncaster, DN11 8BF',
      placeId: 'ChIJX9U69wF4eUgRk67W1XwF-80',
      overallRating: 8.4,
      reviewCount: 142,
      turningScore: 9,
      turningNotes: 'Huge concrete shunting apron. Very easy reverse onto bays 1–60.',
      waitScore: 6,
      avgWaitMins: 45,
      welfareScore: 9,
      facilities: ['24/7 Toilets', 'Free Hot Showers', 'Driver Lounge', 'Microwave & Kettle'],
      overnightAllowed: false,
      overnightNotes: 'Strictly NO overnight parking on site. Security clamp on perimeter road.',
      hazardWarning: 'Do NOT follow sat nav through Bawtry village (7.5t limit). Approach strictly via A1(M) J34!',
      isVerifiedByDepot: false,
      gatehousePhone: '01302 590 100',
      mandatoryPpe: { hiVis: true, steelBoots: true, hardHat: true, safetyGlasses: false, gloves: true }
    },
    {
      id: 'dirft',
      name: 'DHL Supply Chain Rugby (DIRFT II)',
      postcode: 'NN6 7GZ',
      address: 'Crick, Daventry International Rail Freight Terminal, NN6 7GZ',
      placeId: 'ChIJ42zK72aGeEgRj34v2Zm1xPQ',
      overallRating: 7.8,
      reviewCount: 98,
      turningScore: 8,
      turningNotes: 'Good turning circle for 44-tonne artics. Watch out for curtain-sider staging bay.',
      waitScore: 8,
      avgWaitMins: 30,
      welfareScore: 7,
      facilities: ['Driver Toilets', 'Vending Machines', 'Water Refill'],
      overnightAllowed: true,
      overnightNotes: 'Overnight layover permitted in designated yellow bays if booking slot is morning.',
      hazardWarning: 'Low railway bridge on B4038 Crick road (4.1m / 13ft 6in). Follow freight signs from M1 J18.',
      isVerifiedByDepot: true,
      ramsUploadedDate: '02/10/2026',
      ramsFileName: 'DHL_DIRFT2_Site_Induction_RAMS_v4.pdf',
      gatehousePhone: '01788 824 550',
      mandatoryPpe: { hiVis: true, steelBoots: true, hardHat: true, safetyGlasses: true, gloves: true }
    },
    {
      id: 'magna',
      name: 'Magna Park Logistics Campus',
      postcode: 'LE17 4XN',
      address: 'Hunter Boulevard, Lutterworth, LE17 4XN',
      placeId: 'ChIJ98p1vXqmeEgRz93h7Lm2wX8',
      overallRating: 9.1,
      reviewCount: 215,
      turningScore: 10,
      turningNotes: 'Purpose-built European logistics park. Wide dual-carriageway access throughout.',
      waitScore: 9,
      avgWaitMins: 20,
      welfareScore: 9,
      facilities: ['Truck Stop Nearby', 'Full Showers', 'Hot Food Diner', 'Security Patrols'],
      overnightAllowed: true,
      overnightNotes: 'Dedicated Magna Park HGV parking facility available at entrance hub.',
      hazardWarning: 'Speed cameras calibrated to 20mph on Hunter Boulevard. Strict ANPR enforcement.',
      isVerifiedByDepot: true,
      ramsUploadedDate: '28/09/2026',
      ramsFileName: 'Magna_Park_Freight_Access_Charter.pdf',
      gatehousePhone: '01455 558 000',
      mandatoryPpe: { hiVis: true, steelBoots: true, hardHat: false, safetyGlasses: false, gloves: false }
    },
    {
      id: 'dpd-hinckley',
      name: 'DPD Superhub 4 Hinckley',
      postcode: 'LE10 3BQ',
      address: 'DPD Way, Hinckley Commercial Park, LE10 3BQ',
      placeId: 'ChIJ2fG_t15seEgRzM1P7Km3wY7',
      overallRating: 8.6,
      reviewCount: 164,
      turningScore: 9,
      turningNotes: 'Fully automated yard. Excellent shunting lanes for double-deckers.',
      waitScore: 8,
      avgWaitMins: 25,
      welfareScore: 8,
      facilities: ['Driver Shower Block', '24/7 Toilets', 'Hot Drinks Machine'],
      overnightAllowed: false,
      overnightNotes: 'Strictly 2 hours maximum stay. ANPR parking enforcement in operation.',
      hazardWarning: 'Strict gatehouse entry window: Arrive no earlier than 15 mins before booking slot.',
      isVerifiedByDepot: true,
      ramsUploadedDate: '15/09/2026',
      ramsFileName: 'DPD_Superhub4_Visiting_Driver_Rules.pdf',
      gatehousePhone: '01455 892 000',
      mandatoryPpe: { hiVis: true, steelBoots: true, hardHat: true, safetyGlasses: false, gloves: true }
    },
    {
      id: 'tesco-daventry',
      name: 'Tesco Grocery Distribution Centre',
      postcode: 'NN11 8QL',
      address: 'Apex Park, Parsons Road, Daventry, NN11 8QL',
      placeId: 'ChIJx_M9kZaJeEgR863l2Yp3wU1',
      overallRating: 7.2,
      reviewCount: 182,
      turningScore: 7,
      turningNotes: 'Tight bay parking on chill side. Watch clearance on mirror arms.',
      waitScore: 5,
      avgWaitMins: 75,
      welfareScore: 8,
      facilities: ['Driver Rest Room', 'Clean Showers', 'Subsidised Canteen'],
      overnightAllowed: true,
      overnightNotes: 'Overnight bays available in trailer park with security pass.',
      hazardWarning: 'Mandatory engine off during bay tipping. Keys must be deposited in gatehouse lockbox.',
      isVerifiedByDepot: false,
      gatehousePhone: '01327 300 200',
      mandatoryPpe: { hiVis: true, steelBoots: true, hardHat: true, safetyGlasses: true, gloves: true }
    },
    {
      id: 'royalmail-ndc',
      name: 'Royal Mail National Distribution Centre (NDC)',
      postcode: 'NN4 9AA',
      address: 'Swan Valley Way, Northampton, NN4 9AA',
      placeId: 'ChIJv8G3h0aLeEgRq82b3Jp4wZ2',
      overallRating: 8.0,
      reviewCount: 120,
      turningScore: 8,
      turningNotes: 'Clockwise one-way system. Dedicated tandem parking.',
      waitScore: 7,
      avgWaitMins: 35,
      welfareScore: 9,
      facilities: ['24/7 Hot Food Canteen', 'Showers', 'Quiet Sleep Room'],
      overnightAllowed: false,
      overnightNotes: 'No overnight parking on site. Nearest safe bay is Rothersthorpe Services (M1).',
      hazardWarning: 'Strict 10mph speed limit. Zero tolerance for mobile phone use on tarmac.',
      isVerifiedByDepot: true,
      ramsUploadedDate: '01/10/2026',
      ramsFileName: 'RoyalMail_NDC_Freight_Safety_Standard.pdf',
      gatehousePhone: '01604 703 100',
      mandatoryPpe: { hiVis: true, steelBoots: true, hardHat: false, safetyGlasses: false, gloves: true }
    }
  ];

  const [depotSites, setDepotSites] = useState<DepotSite[]>(initialDepotSites);
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearchingPlaces, setIsSearchingPlaces] = useState(false);
  const [selectedDepot, setSelectedDepot] = useState<DepotSite>(initialDepotSites[0]);
  const [userRatingSubmitted, setUserRatingSubmitted] = useState(false);
  const [requestSentMap, setRequestSentMap] = useState<Record<string, boolean>>({});

  // DEPOT ADMIN EDIT FORM STATE
  const [adminGatehousePhone, setAdminGatehousePhone] = useState('');
  const [adminPpe, setAdminPpe] = useState({ hiVis: true, steelBoots: true, hardHat: true, safetyGlasses: false, gloves: true });
  const [adminUploadedFile, setAdminUploadedFile] = useState<string | null>(null);
  const [adminSavedSuccess, setAdminSavedSuccess] = useState(false);

  // REAL DRIVER DATA
  const driverCard = 'UK / DB250290781795 0 0';
  const driverName = 'KITE ALEXANDER JAMES';
  const vrm = 'UK / DG21EDP';
  const vin = 'WMA23KZZ6MM869247';
  const workshop = 'ANDERSON COMMERCIAL LT';
  const calibrationDate = '23/06/2025';

  const stoneridgeShifts = [
    {
      date: '19/09/2026',
      slipNo: '450',
      startOdo: '709 622 km',
      endOdo: '709 932 km',
      distance: '310 km',
      drivingTotal: '04h 11m',
      workTotal: '00h 22m',
      restTotal: '02h 07m',
      poaTotal: '00h 00m',
      segments: [
        { mode: 'Daily Rest', start: '00:00', end: '01:19', duration: '1h 19m', color: 'bg-blue-500', notes: 'Pre-shift rest' },
        { mode: 'Other Work', start: '01:19', end: '01:38', duration: '19m', color: 'bg-amber-500', notes: 'Coupling & walkaround' },
        { mode: 'Other Work', start: '01:38', end: '02:56', duration: '1h 18m', color: 'bg-amber-500', notes: 'Bay loading' },
        { mode: 'Driving', start: '02:56', end: '03:06', duration: '10m', color: 'bg-emerald-500', notes: 'Shunting' },
        { mode: 'Statutory Rest', start: '03:06', end: '04:34', duration: '1h 28m', color: 'bg-blue-500', notes: 'Break taken' },
        { mode: 'Driving', start: '04:34', end: '04:54', duration: '20m', color: 'bg-emerald-500', notes: 'Trunking leg 1' },
        { mode: 'Statutory Rest', start: '04:54', end: '06:05', duration: '1h 11m', color: 'bg-blue-500', notes: 'Rest period' },
        { mode: 'Driving', start: '06:05', end: '06:29', duration: '24m', color: 'bg-emerald-500', notes: 'Trunking leg 2' },
        { mode: 'Other Work', start: '06:29', end: '06:37', duration: '8m', color: 'bg-amber-500', notes: 'Depot check' },
      ]
    },
    {
      date: '17/09/2026',
      slipNo: '448',
      startOdo: '708 638 km',
      endOdo: '708 940 km',
      distance: '302 km',
      drivingTotal: '04h 56m',
      workTotal: '00h 54m',
      restTotal: '18h 10m',
      poaTotal: '00h 00m',
      segments: [
        { mode: 'Daily Rest', start: '00:00', end: '00:40', duration: '40m', color: 'bg-blue-500', notes: 'Night rest' },
        { mode: 'Driving', start: '00:40', end: '00:45', duration: '5m', color: 'bg-emerald-500', notes: 'Yard positioning' },
        { mode: 'Other Work', start: '00:45', end: '01:04', duration: '19m', color: 'bg-amber-500', notes: 'Pre-use walkaround check' },
        { mode: 'Daily Rest', start: '01:29', end: '10:18', duration: '8h 49m', color: 'bg-blue-500', notes: 'Daily statutory rest' },
        { mode: 'Manual Rest', start: '10:18', end: '18:19', duration: '8h 01m', color: 'bg-blue-600', notes: 'Slot 1 manual entry' },
        { mode: 'Other Work', start: '19:11', end: '20:11', duration: '1h 00m', color: 'bg-amber-500', notes: 'Depot loading' },
        { mode: 'Driving', start: '20:25', end: '22:25', duration: '2h 00m', color: 'bg-emerald-500', notes: 'Main motorway trunking' },
        { mode: 'Daily Rest', start: '22:37', end: '24:00', duration: '1h 23m', color: 'bg-blue-500', notes: 'Shift rest' },
      ]
    },
    {
      date: '15/09/2026',
      slipNo: '446',
      startOdo: '707 898 km',
      endOdo: '708 222 km',
      distance: '324 km',
      drivingTotal: '05h 44m',
      workTotal: '02h 11m',
      restTotal: '16h 05m',
      poaTotal: '00h 00m',
      segments: [
        { mode: 'Daily Rest', start: '00:00', end: '13:58', duration: '13h 58m', color: 'bg-blue-500', notes: 'Extended Daily Rest' },
        { mode: 'Driving', start: '14:46', end: '16:03', duration: '1h 17m', color: 'bg-emerald-500', notes: 'Outbound leg' },
        { mode: 'Other Work', start: '16:03', end: '16:51', duration: '48m', color: 'bg-amber-500', notes: 'Intermediate delivery' },
        { mode: 'Driving', start: '16:51', end: '17:38', duration: '47m', color: 'bg-emerald-500', notes: 'Trunking' },
        { mode: 'Other Work', start: '18:31', end: '20:34', duration: '2h 03m', color: 'bg-amber-500', notes: 'Depot unloading' },
        { mode: 'Driving', start: '20:57', end: '22:13', duration: '1h 16m', color: 'bg-emerald-500', notes: 'Return leg' },
        { mode: 'Driving', start: '22:20', end: '23:18', duration: '58m', color: 'bg-emerald-500', notes: 'Final delivery run' },
      ]
    }
  ];

  const currentShift = stoneridgeShifts[selectedShiftIndex];
  const [selectedSegment, setSelectedSegment] = useState(currentShift.segments[0]);

  // SWIPE LOGIC
  const onTouchStart = (e: React.TouchEvent) => {
    setTouchEndX(null);
    setTouchStartX(e.targetTouches[0].clientX);
  };
  const onTouchMove = (e: React.TouchEvent) => setTouchEndX(e.targetTouches[0].clientX);
  const onTouchEnd = () => {
    if (!touchStartX || !touchEndX) return;
    const distance = touchStartX - touchEndX;
    if (distance < -minSwipeDistance) {
      if (currentView === 'article-12' || currentView === 'truck-stops') setCurrentView('live-shift');
      else if (currentView === 'voice-wizard') setCurrentView('tacho-scan');
      else if (currentView === 'history-printout') setCurrentView('history');
      else if (currentView === 'depot-admin') setCurrentView('site-reviews');
      else if (currentView.startsWith('tool-')) setCurrentView('tools-menu');
      else if (currentView !== 'cockpit') setCurrentView('cockpit');
    }
  };

  const triggerRefresh = () => {
    setIsRefreshing(true);
    setTimeout(() => setIsRefreshing(false), 800);
  };

  const handleSimulateScan = () => {
    setIngestionStep('processing');
    setTimeout(() => setIngestionStep('done'), 2000);
  };

  const handleVoiceCoPilotQuery = (query: string) => {
    setVoiceQueryActive(true);
    setTimeout(() => {
      if (query === 'time-left') {
        setVoiceResponse('Alex, your continuous drive clock has 42 minutes remaining before a mandatory 45-minute break. WTD is safe.');
      } else if (query === 'tomorrow-start') {
        setVoiceResponse('If you finish your shift at 19:00 taking a 9-hour reduced daily rest, your earliest legal turn-key time is 04:00 AM.');
      }
      setVoiceQueryActive(false);
    }, 1200);
  };

  const copyArticle12ToClipboard = () => {
    setCopiedArt12(true);
    setTimeout(() => setCopiedArt12(false), 2000);
  };

  const handleSendRamsRequest = (depotId: string) => {
    setRequestSentMap(prev => ({ ...prev, [depotId]: true }));
  };

  const handleOpenDepotAdmin = (depot: DepotSite) => {
    setSelectedDepot(depot);
    setAdminGatehousePhone(depot.gatehousePhone);
    setAdminPpe({ ...depot.mandatoryPpe });
    setAdminUploadedFile(depot.ramsFileName || null);
    setAdminSavedSuccess(false);
    setCurrentView('depot-admin');
  };

  const handleSaveDepotAdmin = () => {
    const updated = depotSites.map(d => {
      if (d.id === selectedDepot.id) {
        return {
          ...d,
          isVerifiedByDepot: true,
          gatehousePhone: adminGatehousePhone,
          mandatoryPpe: { ...adminPpe },
          ramsUploadedDate: 'Today (Verified)',
          ramsFileName: adminUploadedFile || `${selectedDepot.name.replace(/\s+/g, '_')}_RAMS.pdf`
        };
      }
      return d;
    });
    setDepotSites(updated);
    setSelectedDepot(updated.find(d => d.id === selectedDepot.id)!);
    setAdminSavedSuccess(true);
    setTimeout(() => {
      setCurrentView('site-reviews');
    }, 1500);
  };

  // DYNAMIC SEARCH FILTER + GOOGLE PLACES RESOLVER
  const filteredDepots = depotSites.filter(d => 
    d.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
    d.postcode.toLowerCase().includes(searchQuery.toLowerCase()) ||
    d.address.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // CREATES A DYNAMIC GOOGLE PLACES RECORD ON THE FLY FOR ANY SEARCH QUERY
  const handleCreateDynamicGooglePlace = () => {
    const generatedId = `place-${Date.now()}`;
    const cleanQuery = searchQuery.trim();
    const newDepot: DepotSite = {
      id: generatedId,
      name: cleanQuery.toUpperCase().includes('DEPOT') || cleanQuery.toUpperCase().includes('HUB') || cleanQuery.toUpperCase().includes('CENTRE')
        ? cleanQuery
        : `${cleanQuery} Distribution Centre`,
      postcode: cleanQuery.match(/[A-Z]{1,2}[0-9][A-Z0-9]?\s?[0-9][A-Z]{2}/i)?.[0]?.toUpperCase() || 'UK LOGISTICS',
      address: `${cleanQuery}, Freight Distribution Zone, United Kingdom`,
      placeId: `ChIJ_${Math.random().toString(36).substring(2, 15)}_${Math.random().toString(36).substring(2, 8)}`,
      overallRating: 8.0,
      reviewCount: 1,
      turningScore: 8,
      turningNotes: 'Class 1 Artic accessible. Concrete apron with reversing bays.',
      waitScore: 7,
      avgWaitMins: 40,
      welfareScore: 8,
      facilities: ['Driver Toilets', 'Water Point'],
      overnightAllowed: false,
      overnightNotes: 'Check with gatehouse security upon arrival for overnight layover.',
      hazardWarning: 'Follow official freight signs. Beware of local village weight restrictions on approach.',
      isVerifiedByDepot: false,
      gatehousePhone: 'Contact via Gatehouse intercom',
      mandatoryPpe: { hiVis: true, steelBoots: true, hardHat: true, safetyGlasses: false, gloves: true }
    };

    setDepotSites(prev => [newDepot, ...prev]);
    setSelectedDepot(newDepot);
    setUserRatingSubmitted(false);
  };

  return (
    <div 
      className="space-y-3 font-mono text-xs select-none"
      onTouchStart={onTouchStart} onTouchMove={onTouchMove} onTouchEnd={onTouchEnd}
    >

      {/* 1. COCKPIT HEADER BAR */}
      <div className="p-3 bg-slate-900/90 border border-slate-800 rounded-2xl flex items-center justify-between shadow-xl">
        <div className="flex items-center gap-2">
          {currentView !== 'cockpit' && (
            <button
              onClick={() => {
                if (currentView === 'article-12' || currentView === 'truck-stops') setCurrentView('live-shift');
                else if (currentView === 'voice-wizard') setCurrentView('tacho-scan');
                else if (currentView === 'history-printout') setCurrentView('history');
                else if (currentView === 'depot-admin') setCurrentView('site-reviews');
                else if (currentView.startsWith('tool-')) setCurrentView('tools-menu');
                else setCurrentView('cockpit');
              }}
              className="p-1.5 bg-slate-800 hover:bg-slate-700 text-white rounded-xl flex items-center gap-1 text-[11px] font-bold"
            >
              <ChevronLeft className="w-4 h-4" /> Back
            </button>
          )}
          <div>
            <div className="text-[9px] text-emerald-400 font-bold uppercase tracking-wider flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              DRIVE PARTNERS COCKPIT
            </div>
            <div className="text-white font-black text-xs">{driverName}</div>
          </div>
        </div>

        <div className="flex items-center gap-1.5">
          <button
            onClick={triggerRefresh}
            className="p-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl"
            title="Refresh"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isRefreshing ? 'animate-spin text-emerald-400' : ''}`} />
          </button>
          <span className="px-2.5 py-1 bg-slate-950 border border-slate-800 text-emerald-400 rounded-xl text-[10px] font-bold">
            {vrm}
          </span>
        </div>
      </div>

      {/* 2. ROOT COCKPIT: STRICT 5 LARGE HERO TILES */}
      {currentView === 'cockpit' && (
        <div className="space-y-3 pt-1">
          <div className="text-[10px] text-slate-400 font-bold uppercase tracking-wider px-1">
            Cockpit Modules:
          </div>

          <div className="grid grid-cols-1 gap-3">
            
            {/* TILE 1: LIVE SHIFT COCKPIT */}
            <button
              onClick={() => setCurrentView('live-shift')}
              className="p-5 bg-gradient-to-br from-emerald-950/40 via-slate-900 to-slate-950 hover:to-slate-900/90 border-2 border-emerald-500/50 hover:border-emerald-400 rounded-3xl text-left flex items-center justify-between group shadow-xl transition-all"
            >
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 rounded-2xl bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center text-emerald-400 group-hover:scale-105 transition-transform">
                  <Truck className="w-7 h-7" />
                </div>
                <div className="space-y-0.5">
                  <div className="text-white font-black text-base flex items-center gap-2">
                    LIVE SHIFT COCKPIT
                    <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 text-[9px] font-black animate-pulse">LIVE</span>
                  </div>
                  <div className="text-[11px] text-slate-400">Continuous Drive, WTD Clocks, Rest Deadlines & Art. 12</div>
                </div>
              </div>
              <ChevronRight className="w-6 h-6 text-slate-600 group-hover:text-emerald-400 transition-colors" />
            </button>

            {/* TILE 2: TACHO-SCAN */}
            <button
              onClick={() => { setIngestionStep('idle'); setCurrentView('tacho-scan'); }}
              className="p-5 bg-gradient-to-br from-slate-900 to-slate-950 hover:to-slate-900/90 border border-slate-800 hover:border-blue-500/60 rounded-3xl text-left flex items-center justify-between group shadow-xl transition-all"
            >
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 rounded-2xl bg-blue-500/10 border border-blue-500/30 flex items-center justify-center text-blue-400 group-hover:scale-105 transition-transform">
                  <Camera className="w-7 h-7" />
                </div>
                <div className="space-y-0.5">
                  <div className="text-white font-black text-base flex items-center gap-2">
                    TACHO-SCAN
                    <span className="px-2 py-0.5 rounded-full bg-blue-500/20 text-blue-400 text-[9px] font-bold">Ingest</span>
                  </div>
                  <div className="text-[11px] text-slate-400">Ingest Card Data, OCR Scans & Voice Gap Wizard</div>
                </div>
              </div>
              <ChevronRight className="w-6 h-6 text-slate-600 group-hover:text-blue-400 transition-colors" />
            </button>

            {/* TILE 3: HISTORY */}
            <button
              onClick={() => setCurrentView('history')}
              className="p-5 bg-gradient-to-br from-slate-900 to-slate-950 hover:to-slate-900/90 border border-slate-800 hover:border-amber-500/60 rounded-3xl text-left flex items-center justify-between group shadow-xl transition-all"
            >
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 rounded-2xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400 group-hover:scale-105 transition-transform">
                  <Activity className="w-7 h-7" />
                </div>
                <div className="space-y-0.5">
                  <div className="text-white font-black text-base flex items-center gap-2">
                    HISTORY
                    <span className="px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-400 text-[9px] font-bold">17-Wk WTD</span>
                  </div>
                  <div className="text-[11px] text-slate-400">17-Wk Rolling WTD Average, Slips Archive & Rest Payback</div>
                </div>
              </div>
              <ChevronRight className="w-6 h-6 text-slate-600 group-hover:text-amber-400 transition-colors" />
            </button>

            {/* TILE 4: TOOLS */}
            <button
              onClick={() => setCurrentView('tools-menu')}
              className="p-5 bg-gradient-to-br from-slate-900 to-slate-950 hover:to-slate-900/90 border border-slate-800 hover:border-purple-500/60 rounded-3xl text-left flex items-center justify-between group shadow-xl transition-all"
            >
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 rounded-2xl bg-purple-500/10 border border-purple-500/30 flex items-center justify-center text-purple-400 group-hover:scale-105 transition-transform">
                  <Wrench className="w-7 h-7" />
                </div>
                <div className="space-y-0.5">
                  <div className="text-white font-black text-base flex items-center gap-2">
                    TOOLS
                    <span className="px-2 py-0.5 rounded-full bg-purple-500/20 text-purple-400 text-[9px] font-bold">Compliance</span>
                  </div>
                  <div className="text-[11px] text-slate-400">Pre-Drive Mode Setup, Salary Auditor & 28-Day Deadlines</div>
                </div>
              </div>
              <ChevronRight className="w-6 h-6 text-slate-600 group-hover:text-purple-400 transition-colors" />
            </button>

            {/* TILE 5: SITE REVIEWS & HAZARDS */}
            <button
              onClick={() => setCurrentView('site-reviews')}
              className="p-5 bg-gradient-to-br from-slate-900 to-slate-950 hover:to-slate-900/90 border border-slate-800 hover:border-amber-400/60 rounded-3xl text-left flex items-center justify-between group shadow-xl transition-all"
            >
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 rounded-2xl bg-amber-400/10 border border-amber-400/30 flex items-center justify-center text-amber-400 group-hover:scale-105 transition-transform">
                  <Star className="w-7 h-7" />
                </div>
                <div className="space-y-0.5">
                  <div className="text-white font-black text-base flex items-center gap-2">
                    SITE REVIEWS
                    <span className="px-2 py-0.5 rounded-full bg-amber-400/20 text-amber-400 text-[9px] font-bold">Google Places</span>
                  </div>
                  <div className="text-[11px] text-slate-400">Google Places Search, RAMS Upload & Depot Admin</div>
                </div>
              </div>
              <ChevronRight className="w-6 h-6 text-slate-600 group-hover:text-amber-400 transition-colors" />
            </button>

          </div>
        </div>
      )}

      {/* 3. MODULE 5: SITE REVIEWS (GOOGLE PLACES SEARCH & RAMS) */}
      {currentView === 'site-reviews' && (
        <SiteReviews onBack={() => setCurrentView('cockpit')} />
      )}

      {currentView === 'site-reviews' && (
        <SiteReviews onBack={() => setCurrentView('cockpit')} />
      )}

      {currentView === 'live-shift' && (
        <div className="space-y-3">
          <div className="p-3 bg-emerald-500/10 border border-emerald-500/30 rounded-2xl flex items-center justify-between">
            <span className="text-[10px] font-bold text-emerald-400 uppercase flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
              LIVE IN-CAB SHIFT MONITOR
            </span>
            <span className="text-[9px] text-slate-400">Mode: Standard Single-Man</span>
          </div>

          <div className="p-5 bg-slate-900/90 border-2 border-emerald-500/40 rounded-3xl space-y-2 text-center shadow-xl">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-400 text-[10px] font-black uppercase">
              <Clock className="w-3.5 h-3.5" /> Next Mandatory Stop In (Strictest Limit)
            </div>
            <div className="text-4xl font-black text-white tracking-tight">00h 42m</div>
            <div className="text-xs text-emerald-300 font-bold">Reason: EU 561 Continuous Driving Limit (4h 30m Cap)</div>
            <div className="text-[10px] text-slate-400 pt-1 flex justify-around border-t border-slate-800">
              <span>Driven: <strong className="text-white">03h 48m</strong></span>
              <span>WTD Work: <strong className="text-white">04h 15m</strong></span>
              <span>Shift Total: <strong className="text-white">08h 03m</strong></span>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-2">
            <div className="p-3.5 bg-slate-900/90 border border-slate-800 rounded-2xl space-y-1">
              <div className="text-[9px] text-amber-400 font-bold uppercase flex items-center gap-1">
                <Moon className="w-3.5 h-3.5" /> Shift End Deadline
              </div>
              <div className="text-base font-black text-white">21:15 Tonight</div>
              <div className="text-[9px] text-slate-400">For 11h Standard Rest</div>
            </div>

            <div className="p-3.5 bg-slate-900/90 border border-slate-800 rounded-2xl space-y-1">
              <div className="text-[9px] text-emerald-400 font-bold uppercase flex items-center gap-1">
                <Sun className="w-3.5 h-3.5" /> Earliest Turn-Key
              </div>
              <div className="text-base font-black text-white">06:15 AM Tomorrow</div>
              <div className="text-[9px] text-slate-400">Full 11h Rest Guaranteed</div>
            </div>
          </div>

          <button
            onClick={() => setCurrentView('article-12')}
            className="w-full p-4 bg-gradient-to-r from-amber-500/20 to-slate-900 border border-amber-500/50 hover:border-amber-400 rounded-2xl flex items-center justify-between text-left group"
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-amber-500/20 flex items-center justify-center text-amber-400">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <div>
                <div className="text-white font-bold text-xs flex items-center gap-1.5">
                  1-Tap Article 12 Exemption Logger
                  <span className="px-1.5 py-0.5 rounded bg-amber-500/30 text-amber-300 text-[8px] font-black">LEGAL SHIELD</span>
                </div>
                <div className="text-[10px] text-slate-400">Generate printout endorsement for motorway/depot delays</div>
              </div>
            </div>
            <ChevronRight className="w-4 h-4 text-amber-400 group-hover:translate-x-1 transition-transform" />
          </button>

          <button
            onClick={() => setCurrentView('truck-stops')}
            className="w-full p-4 bg-slate-900/90 hover:bg-slate-800/80 border border-slate-800 hover:border-blue-500/50 rounded-2xl flex items-center justify-between text-left group"
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-blue-500/10 flex items-center justify-center text-blue-400">
                <MapPin className="w-5 h-5" />
              </div>
              <div>
                <div className="text-white font-bold text-xs">Reachable Safe Parking Radar</div>
                <div className="text-[10px] text-slate-400">3 HGV truck stops reachable within your 42 mins driving</div>
              </div>
            </div>
            <ChevronRight className="w-4 h-4 text-slate-500 group-hover:text-blue-400 transition-transform" />
          </button>

          <div className="p-4 bg-slate-900/90 border border-slate-800 rounded-2xl space-y-2.5">
            <div className="flex items-center justify-between">
              <div className="text-xs font-bold text-white flex items-center gap-1.5">
                <Volume2 className="w-4 h-4 text-emerald-400" /> Conversational Voice Co-Pilot
              </div>
              <span className="text-[9px] text-slate-500 font-bold">"Hey Drive"</span>
            </div>

            <div className="grid grid-cols-2 gap-2">
              <button
                onClick={() => handleVoiceCoPilotQuery('time-left')}
                className="p-2.5 bg-slate-950 hover:bg-slate-800 border border-slate-800 rounded-xl text-left text-[10px] text-slate-300 flex items-center gap-2"
              >
                <Mic className="w-3.5 h-3.5 text-emerald-400" /> "How long have I got left?"
              </button>
              <button
                onClick={() => handleVoiceCoPilotQuery('tomorrow-start')}
                className="p-2.5 bg-slate-950 hover:bg-slate-800 border border-slate-800 rounded-xl text-left text-[10px] text-slate-300 flex items-center gap-2"
              >
                <Mic className="w-3.5 h-3.5 text-emerald-400" /> "When can I start tomorrow?"
              </button>
            </div>

            {voiceQueryActive && (
              <div className="p-2.5 bg-emerald-500/10 border border-emerald-500/30 rounded-xl text-[10px] text-emerald-300 flex items-center gap-2 animate-pulse">
                <Sparkles className="w-3.5 h-3.5" /> Processing in-cab voice query...
              </div>
            )}

            {voiceResponse && !voiceQueryActive && (
              <div className="p-3 bg-slate-950 border border-emerald-500/40 rounded-xl text-[11px] text-emerald-300 space-y-1">
                <div className="font-bold text-white flex items-center gap-1.5">
                  <Volume2 className="w-3.5 h-3.5 text-emerald-400" /> Co-Pilot Answer:
                </div>
                <div>{voiceResponse}</div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* SUB-VIEW: ARTICLE 12 */}
      {currentView === 'article-12' && (
        <div className="space-y-3">
          <div className="p-3 bg-amber-500/10 border border-amber-500/30 rounded-2xl flex items-center justify-between">
            <span className="text-[10px] font-bold text-amber-400 uppercase">EC 561/2006 ARTICLE 12 DEROGATION LOGGER</span>
            <button onClick={() => setCurrentView('live-shift')} className="text-[10px] font-bold text-slate-400">Cancel</button>
          </div>

          <div className="p-4 bg-slate-900/90 border border-slate-800 rounded-2xl space-y-3">
            <div className="text-xs font-bold text-white">Select Reason for Unforeseen Delay:</div>
            <div className="space-y-1.5">
              {['M6 Motorway Accident Standstill', 'Severe Weather / Flash Flooding', 'Depot Inward Bay Queue Delay (>45m)', 'Failure to Find Safe HGV Parking Spot'].map((reason, i) => (
                <button
                  key={i}
                  onClick={() => setSelectedArt12Reason(reason)}
                  className={`w-full p-2.5 rounded-xl border text-left text-xs transition-all ${
                    selectedArt12Reason === reason ? 'bg-amber-500/20 border-amber-500 text-white font-bold' : 'bg-slate-950 border-slate-800 text-slate-400'
                  }`}
                >
                  {reason}
                </button>
              ))}
            </div>

            <div className="p-3 bg-slate-950 border border-slate-800 rounded-xl space-y-1 text-[10px]">
              <div className="font-bold text-amber-400 uppercase">Generated Legal Endorsement:</div>
              <div className="text-slate-300 font-mono text-[9px] bg-slate-900 p-2 rounded border border-slate-800">
                "EC 561/2006 Article 12: Continuous driving extended by 25 mins to reach nearest safe parking at Corley Services due to: {selectedArt12Reason}. Vehicle: {vrm}. Card: {driverCard}."
              </div>
            </div>

            <button
              onClick={copyArticle12ToClipboard}
              className="w-full py-3 bg-amber-500 hover:bg-amber-400 text-slate-950 rounded-xl font-black text-xs uppercase flex items-center justify-center gap-2 shadow-lg shadow-amber-500/20"
            >
              {copiedArt12 ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
              {copiedArt12 ? 'Endorsement Copied to Clipboard!' : 'Copy Endorsement for Printout'}
            </button>
          </div>
        </div>
      )}

      {/* SUB-VIEW: TRUCK STOPS */}
      {currentView === 'truck-stops' && (
        <div className="space-y-3">
          <div className="p-3 bg-blue-500/10 border border-blue-500/30 rounded-2xl flex items-center justify-between">
            <span className="text-[10px] font-bold text-blue-400 uppercase">REACHABLE SAFE HGV PARKING (42 MINS ALLOWANCE)</span>
            <button onClick={() => setCurrentView('live-shift')} className="text-[10px] font-bold text-slate-400">Close</button>
          </div>

          <div className="space-y-2">
            {[
              { name: 'Corley Services (M6)', eta: '18 mins away', bays: '42 HGV Bays Available', status: 'High Availability', color: 'text-emerald-400' },
              { name: 'Watford Gap (M1)', eta: '31 mins away', bays: '12 HGV Bays Remaining', status: 'Moderate', color: 'text-amber-400' },
              { name: 'Northampton Truck Park', eta: '38 mins away', bays: 'Secure CCTV / Showers', status: 'Available', color: 'text-emerald-400' },
            ].map((stop, i) => (
              <div key={i} className="p-3.5 bg-slate-900/90 border border-slate-800 rounded-2xl flex items-center justify-between">
                <div>
                  <div className="text-xs font-bold text-white">{stop.name}</div>
                  <div className="text-[10px] text-slate-400">{stop.eta} • {stop.bays}</div>
                </div>
                <span className={`text-[10px] font-bold ${stop.color}`}>{stop.status}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 5. MODULE 2: TACHO-SCAN */}
      {currentView === 'tacho-scan' && (
        <div className="space-y-3">
          <div className="p-3 bg-blue-500/10 border border-blue-500/30 rounded-2xl flex items-center justify-between">
            <span className="text-[10px] font-bold text-blue-400 uppercase">MODULE: INGEST DRIVER CARD DATA</span>
            <button onClick={() => setCurrentView('voice-wizard')} className="text-[10px] font-bold text-blue-300 hover:text-white flex items-center gap-1">
              <Mic className="w-3.5 h-3.5" /> Voice Gap Wizard
            </button>
          </div>

          {ingestionStep === 'idle' && (
            <div className="space-y-3">
              <label className="p-4 bg-slate-900/90 hover:bg-slate-800/80 border border-blue-500/40 rounded-2xl flex items-center justify-between cursor-pointer group shadow-lg">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-blue-500/10 flex items-center justify-center text-blue-400">
                    <Camera className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="text-white font-bold text-xs">Photo Capture Thermal Printout</div>
                    <div className="text-[10px] text-slate-400">Scan paper slip using AI Vision parser</div>
                  </div>
                </div>
                <ChevronRight className="w-4 h-4 text-slate-500 group-hover:text-blue-400" />
                <input type="file" accept="image/*" capture="environment" className="hidden" onChange={handleSimulateScan} />
              </label>

              <button
                onClick={handleSimulateScan}
                className="w-full p-4 bg-slate-900/90 hover:bg-slate-800/80 border border-slate-800 rounded-2xl flex items-center justify-between group shadow-lg text-left"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-purple-500/10 flex items-center justify-center text-purple-400">
                    <Usb className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="text-white font-bold text-xs">USB-C / BLE Card Reader</div>
                    <div className="text-[10px] text-slate-400">Read .DDD raw cryptogram directly from chip</div>
                  </div>
                </div>
                <ChevronRight className="w-4 h-4 text-slate-500 group-hover:text-purple-400" />
              </button>

              <button
                onClick={handleSimulateScan}
                className="w-full py-3.5 bg-slate-950 border border-slate-800 hover:border-slate-700 rounded-2xl text-blue-400 font-bold text-xs flex items-center justify-center gap-2"
              >
                <Sparkles className="w-4 h-4" /> Simulate OCR Ingestion on Slip #448 (17/09)
              </button>
            </div>
          )}

          {ingestionStep === 'processing' && (
            <div className="p-8 bg-slate-900/90 border border-slate-800 rounded-2xl text-center space-y-3">
              <RefreshCw className="w-10 h-10 text-blue-400 animate-spin mx-auto" />
              <div className="text-sm font-bold text-white">Running AI Tachograph OCR Engine...</div>
              <div className="text-[10px] text-slate-400 space-y-1">
                <div>✓ Detected Stoneridge 24h Paper Header</div>
                <div>✓ Authenticated Driver: {driverName}</div>
                <div>✓ Mathematical Parity Check: 708,638 + 302 = 708,940 km (100% Match)</div>
              </div>
            </div>
          )}

          {ingestionStep === 'done' && (
            <div className="p-6 bg-slate-900/90 border border-blue-500/40 rounded-2xl text-center space-y-3">
              <CheckCircle2 className="w-12 h-12 text-blue-400 mx-auto" />
              <div className="text-base font-black text-white">Card Data Successfully Ingested!</div>
              <div className="text-xs text-slate-400">
                Shift records for <strong>17/09/2026 (Slip #448)</strong> are now stored in your Driver History.
              </div>
              <button
                onClick={() => { setSelectedShiftIndex(1); setCurrentView('history'); }}
                className="w-full py-3 bg-blue-500 hover:bg-blue-400 text-slate-950 rounded-xl font-black text-xs uppercase shadow-lg shadow-blue-500/20"
              >
                Go to History & Analyze Data ➔
              </button>
            </div>
          )}
        </div>
      )}

      {/* SUB-VIEW: VOICE WIZARD */}
      {currentView === 'voice-wizard' && (
        <div className="space-y-3">
          <div className="p-3 bg-blue-500/10 border border-blue-500/30 rounded-2xl flex items-center justify-between">
            <span className="text-[10px] font-bold text-blue-400 uppercase">VOICE MANUAL ENTRY WIZARD</span>
            <button onClick={() => setCurrentView('tacho-scan')} className="text-[10px] font-bold text-slate-400">Close</button>
          </div>

          <div className="p-5 bg-slate-900/90 border border-slate-800 rounded-2xl space-y-3">
            <div className="p-3 bg-slate-950 border border-slate-800 rounded-xl space-y-1.5">
              <div className="text-xs font-bold text-white flex items-center gap-1.5">
                <Volume2 className="w-4 h-4 text-blue-400" /> AI Compliance Assistant:
              </div>
              <div className="text-xs text-blue-200">
                "Alex, I detected a 9-hour gap between your shift ending yesterday and card insertion today. Were you on statutory rest at home?"
              </div>
            </div>

            <div className="grid grid-cols-2 gap-2">
              <button
                onClick={() => { alert('Manual Entry Confirmed: Daily Rest logged without card gap error.'); setCurrentView('tacho-scan'); }}
                className="p-3 bg-emerald-500/20 hover:bg-emerald-500/30 border border-emerald-500/40 rounded-xl text-center text-xs text-emerald-300 font-bold"
              >
                🗣️ Confirm: "Yes, Rest at Home"
              </button>
              <button
                onClick={() => { alert('Manual Entry: Other Work entry opened.'); setCurrentView('tacho-scan'); }}
                className="p-3 bg-slate-950 hover:bg-slate-800 border border-slate-800 rounded-xl text-center text-xs text-slate-300 font-bold"
              >
                "No, Other Duty / Off-Site"
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 6. MODULE 3: HISTORY */}
      {currentView === 'history' && (
        <div className="space-y-3">
          <div className="p-3 bg-amber-500/10 border border-amber-500/30 rounded-2xl flex items-center justify-between">
            <span className="text-[10px] font-bold text-amber-400 uppercase">MODULE: ANALYSIS OF DRIVERS DATA</span>
            <button onClick={() => setCurrentView('history-printout')} className="text-[10px] font-bold text-white hover:text-amber-300 flex items-center gap-1">
              <Receipt className="w-3.5 h-3.5" /> Paper Replica ➔
            </button>
          </div>

          <div className="p-4 bg-slate-900/90 border border-slate-800 rounded-2xl space-y-2">
            <div className="flex justify-between items-center text-[10px]">
              <span className="font-bold text-white uppercase">17-Week Rolling WTD Average</span>
              <span className="text-emerald-400 font-bold">41.2h / 48.0h Cap (Safe)</span>
            </div>
            <div className="w-full h-2.5 bg-slate-950 rounded-full overflow-hidden border border-slate-800">
              <div className="h-full bg-emerald-500 w-[85%]" />
            </div>
            <div className="text-[9px] text-slate-400">You can legally work up to <strong>14.8 hours</strong> for the remainder of this week.</div>
          </div>

          <div className="grid grid-cols-3 gap-1.5">
            {stoneridgeShifts.map((s, idx) => (
              <button
                key={idx}
                onClick={() => { setSelectedShiftIndex(idx); setSelectedSegment(s.segments[0]); }}
                className={`p-2.5 rounded-xl border text-center transition-all ${
                  selectedShiftIndex === idx
                    ? 'bg-amber-500/10 border-amber-500 text-white shadow-md shadow-amber-500/20 scale-105'
                    : 'bg-slate-950 border-slate-800 text-slate-400'
                }`}
              >
                <div className="text-[8px] font-bold text-slate-500">SLIP #{s.slipNo}</div>
                <div className="text-[11px] font-black">{s.date}</div>
                <div className="text-[9px] text-emerald-400 mt-0.5">{s.distance}</div>
              </button>
            ))}
          </div>

          <div className="grid grid-cols-2 gap-2 bg-slate-900/90 p-3.5 border border-slate-800 rounded-2xl">
            <div>
              <span className="text-[9px] text-slate-400">ODOMETER RANGE</span>
              <div className="text-xs font-bold text-white">{currentShift.startOdo}</div>
              <div className="text-xs font-bold text-emerald-400">{currentShift.endOdo}</div>
            </div>
            <div>
              <span className="text-[9px] text-slate-400">SHIFT TOTALS</span>
              <div className="text-xs font-bold text-white">🛞 {currentShift.drivingTotal} Driving</div>
              <div className="text-[10px] text-amber-400 font-bold">⚒️ {currentShift.workTotal} Other Work</div>
            </div>
          </div>

          <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-3.5 space-y-2">
            <div className="text-[10px] text-slate-400 font-bold uppercase">24-Hour Timeline: Slip #{currentShift.slipNo}</div>
            <div className="w-full h-8 bg-slate-950 rounded-xl overflow-hidden flex border border-slate-800 p-0.5 cursor-pointer">
              {currentShift.segments.map((seg, i) => (
                <div
                  key={i}
                  style={{ width: `${100 / currentShift.segments.length}%` }}
                  className={`h-full ${seg.color} hover:opacity-80 transition-opacity border-r border-slate-900/40`}
                  onClick={() => setSelectedSegment(seg)}
                />
              ))}
            </div>

            <div className="p-2.5 bg-slate-950 border border-slate-800 rounded-xl flex items-center justify-between text-[11px]">
              <div className="flex items-center gap-2">
                <span className={`w-2.5 h-2.5 rounded-full ${selectedSegment.color}`} />
                <span className="text-white font-bold">{selectedSegment.mode}</span>
                <span className="text-slate-400">({selectedSegment.start} ➔ {selectedSegment.end})</span>
              </div>
              <div className="text-white font-bold">{selectedSegment.duration}</div>
            </div>
            <div className="text-[10px] text-slate-400 px-1">{selectedSegment.notes}</div>
          </div>
        </div>
      )}

      {/* SUB-VIEW: PRINT REPLICA */}
      {currentView === 'history-printout' && (
        <div className="p-5 bg-slate-100 text-slate-950 rounded-2xl font-mono text-[11px] space-y-2.5 max-w-sm mx-auto border-2 border-slate-300 shadow-2xl">
          <div className="text-center border-b-2 border-dashed border-slate-400 pb-2">
            <div className="font-black text-sm tracking-widest">STONERIDGE ELECTRONICS</div>
            <div className="text-[9px] text-slate-700">24h 🪪 🖨️ DAILY PRINTOUT (UTC)</div>
            <div className="text-xs font-bold mt-1">19/09/2026 06:39</div>
          </div>
          <div className="space-y-0.5 text-[10px] border-b border-dashed border-slate-300 pb-2">
            <div>🪪 {driverName}</div>
            <div>{driverCard} (29/01/2030 - GEN 2)</div>
            <div>🚚 {vin} • {vrm}</div>
            <div>🔧 {workshop} ({calibrationDate})</div>
          </div>
          <div className="space-y-0.5 text-[10px] border-b border-dashed border-slate-300 pb-2">
            <div className="font-bold">{currentShift.date} (SLIP #{currentShift.slipNo}):</div>
            <div>{currentShift.startOdo} ➔ {currentShift.endOdo} ({currentShift.distance})</div>
            <div className="font-bold pt-1">Σ TOTALS:</div>
            <div>🛞 {currentShift.drivingTotal}  {currentShift.distance}</div>
            <div>⚒️ {currentShift.workTotal}  ⌛ {currentShift.poaTotal}</div>
            <div>🛏️ {currentShift.restTotal}</div>
          </div>
          <button onClick={() => setCurrentView('history')} className="w-full py-2.5 bg-slate-950 text-white rounded-xl text-xs font-bold">
            ← Back to Analysis
          </button>
        </div>
      )}

      {/* 7. MODULE 4: TOOLS */}
      {currentView === 'tools-menu' && (
        <div className="space-y-3">
          <div className="p-3 bg-purple-500/10 border border-purple-500/30 rounded-2xl">
            <span className="text-[10px] font-bold text-purple-400 uppercase">MODULE: SELECT A TOOL</span>
          </div>

          <div className="grid grid-cols-1 gap-2">
            <button onClick={() => setCurrentView('tool-predrive')} className="p-4 bg-slate-900/90 hover:bg-slate-800/80 border border-slate-800 hover:border-emerald-500/50 rounded-2xl flex items-center justify-between text-left group">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-emerald-500/10 flex items-center justify-center text-emerald-400"><Compass className="w-5 h-5" /></div>
                <div>
                  <div className="text-white font-bold text-xs">Pre-Drive Operational Context</div>
                  <div className="text-[10px] text-slate-400">Single-man, Multi-man (30h), or Ferry mode</div>
                </div>
              </div>
              <ChevronRight className="w-4 h-4 text-slate-500 group-hover:text-emerald-400" />
            </button>

            <button onClick={() => setCurrentView('tool-salary')} className="p-4 bg-slate-900/90 hover:bg-slate-800/80 border border-slate-800 hover:border-purple-500/50 rounded-2xl flex items-center justify-between text-left group">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-purple-500/10 flex items-center justify-center text-purple-400"><CreditCard className="w-5 h-5" /></div>
                <div>
                  <div className="text-white font-bold text-xs">Work Hours & Salary Audit</div>
                  <div className="text-[10px] text-slate-400">Cross-reference payslip hours against tacho</div>
                </div>
              </div>
              <ChevronRight className="w-4 h-4 text-slate-500 group-hover:text-purple-400" />
            </button>

            <button onClick={() => setCurrentView('tool-deadlines')} className="p-4 bg-slate-900/90 hover:bg-slate-800/80 border border-slate-800 hover:border-blue-500/50 rounded-2xl flex items-center justify-between text-left group">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-blue-500/10 flex items-center justify-center text-blue-400"><Calendar className="w-5 h-5" /></div>
                <div>
                  <div className="text-white font-bold text-xs">Deadlines & Calibrations</div>
                  <div className="text-[10px] text-slate-400">28-day card download & 2-year workshop sync</div>
                </div>
              </div>
              <ChevronRight className="w-4 h-4 text-slate-500 group-hover:text-blue-400" />
            </button>
          </div>
        </div>
      )}

      {/* SUB-TOOL: PRE-DRIVE */}
      {currentView === 'tool-predrive' && (
        <div className="space-y-3">
          <div className="p-4 bg-slate-900/90 border border-slate-800 rounded-2xl space-y-3">
            <div className="text-xs font-bold text-white">Select Operational Driving Mode:</div>
            <div className="grid grid-cols-2 gap-2">
              {[
                { id: 'single', title: 'Single Driver', desc: 'Standard 24h cycle' },
                { id: 'multi', title: 'Multi-Manning', desc: '30h duty window' },
                { id: 'ferry', title: 'Ferry / Train', desc: 'Interrupted rest' },
                { id: 'out-of-scope', title: 'Out of Scope', desc: 'Private roads' },
              ].map(mode => (
                <button
                  key={mode.id}
                  onClick={() => setOperationalMode(mode.id as any)}
                  className={`p-3 rounded-xl border text-left transition-all ${
                    operationalMode === mode.id ? 'bg-emerald-500/20 border-emerald-500 text-white font-bold' : 'bg-slate-950 border-slate-800 text-slate-400'
                  }`}
                >
                  <div className="text-xs">{mode.title}</div>
                  <div className="text-[9px] text-slate-500">{mode.desc}</div>
                </button>
              ))}
            </div>
            <div className="p-3 bg-slate-950 border border-slate-800 rounded-xl text-[10px] text-emerald-400">
              ✓ Active: <strong>{operationalMode.toUpperCase()}</strong> rules applied to all countdowns.
            </div>
          </div>
        </div>
      )}

      {/* SUB-TOOL: SALARY */}
      {currentView === 'tool-salary' && (
        <div className="space-y-3">
          <div className="p-4 bg-slate-900/90 border border-purple-500/30 rounded-2xl space-y-2.5">
            <div className="text-xs font-bold text-white flex items-center gap-1.5">
              <CreditCard className="w-4 h-4 text-purple-400" /> Compare Against Payslip
            </div>
            <div>
              <label className="text-[10px] text-slate-400">HOURS ON PAYSLIP / TIMESHEET:</label>
              <input
                type="number"
                step="0.5"
                value={paidHoursInput}
                onChange={e => setPaidHoursInput(e.target.value)}
                className="w-full mt-1 bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-white font-bold"
              />
            </div>
            <div className="p-2.5 bg-slate-950 rounded-xl text-rose-400 font-bold text-xs border border-slate-800">
              ⚠ {(actualWorkedHours - parseFloat(paidHoursInput || '0')).toFixed(1)} Hours Discrepancy Found
            </div>
          </div>
        </div>
      )}

      {/* SUB-TOOL: DEADLINES */}
      {currentView === 'tool-deadlines' && (
        <div className="space-y-3">
          <div className="p-4 bg-slate-900/90 border border-slate-800 rounded-2xl space-y-2 text-center">
            <span className="text-[10px] text-slate-400 font-bold uppercase">28-Day Card Download</span>
            <div className="text-3xl font-black text-emerald-400">23 Days Left</div>
            <div className="w-full h-2 bg-slate-950 rounded-full overflow-hidden border border-slate-800">
              <div className="h-full bg-emerald-500 w-[82%]" />
            </div>
          </div>

          <div className="p-3.5 bg-slate-900/90 border border-slate-800 rounded-2xl space-y-1">
            <div className="text-xs font-bold text-white">Stoneridge 2-Year Calibration</div>
            <div className="flex justify-between text-[11px] text-slate-300">
              <span>Calibrated On:</span>
              <span className="font-bold text-white">{calibrationDate}</span>
            </div>
            <div className="flex justify-between text-[11px] text-emerald-400">
              <span>Status:</span>
              <span className="font-bold">✓ Valid until 2027</span>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
