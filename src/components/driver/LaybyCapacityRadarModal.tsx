'use client';
import React, { useState } from 'react';
import {
  X,
  Compass,
  MapPin,
  Truck,
  CheckCircle2,
  AlertTriangle,
  Clock,
  Navigation,
  Coffee,
  Shield,
  Filter,
  Plus,
  Radio
} from 'lucide-react';
import { LaybyParkingLocation, LaybyStatus } from '../types';

interface LaybyCapacityRadarModalProps {
  isOpen: boolean;
  onClose: () => void;
  driverReg: string;
}

export const INITIAL_LAYBYS: LaybyParkingLocation[] = [
  {
    id: 'layby-1',
    name: 'M1 J18 Watford Gap Northbound Truck Layby',
    road: 'M1',
    markerPost: 'MP 74/2',
    direction: 'NORTHBOUND',
    distanceMiles: 4.2,
    capacityStatus: 'OPEN',
    totalSpaces: 8,
    openSpacesEstimated: 4,
    facilities: ['Lit', 'CCTV Protected', 'Flat Hardstanding', 'Hot Food Van (06:00-20:00)'],
    lastReportedAt: '12 mins ago',
    reportedBy: 'Kev H. (Scania R500)'
  },
  {
    id: 'layby-2',
    name: 'A14 Rothwell Services / Truck Stop Layby',
    road: 'A14',
    markerPost: 'MP 28/4',
    direction: 'EASTBOUND',
    distanceMiles: 8.7,
    capacityStatus: 'BUSY',
    totalSpaces: 6,
    openSpacesEstimated: 1,
    facilities: ['24h Toilets', 'Lit', 'Snack Bar'],
    lastReportedAt: '24 mins ago',
    reportedBy: 'Dave M. (Volvo FH)'
  },
  {
    id: 'layby-3',
    name: 'M6 Corley Services HGV Apron & Layby',
    road: 'M6',
    markerPost: 'MP 12/8',
    direction: 'NORTHBOUND',
    distanceMiles: 14.1,
    capacityStatus: 'FULL',
    totalSpaces: 12,
    openSpacesEstimated: 0,
    facilities: ['24h Fuel', 'Showers', 'CCTV', 'Security Barrier'],
    lastReportedAt: '5 mins ago',
    reportedBy: 'Alex Morgan (KX72 WYZ)'
  },
  {
    id: 'layby-4',
    name: 'M1 J16 Kislingbury Emergency Layby',
    road: 'M1',
    markerPost: 'MP 62/1',
    direction: 'SOUTHBOUND',
    distanceMiles: 18.5,
    capacityStatus: 'OPEN',
    totalSpaces: 5,
    openSpacesEstimated: 3,
    facilities: ['Emergency Phone', 'Deep Bay (Artic Compatible)'],
    lastReportedAt: '41 mins ago',
    reportedBy: 'Stefan R. (DAF XF)'
  },
  {
    id: 'layby-5',
    name: 'A5 Magna Park Logistics Corridor Layby',
    road: 'A5',
    markerPost: 'MP 19/3',
    direction: 'WESTBOUND',
    distanceMiles: 2.1,
    capacityStatus: 'OPEN',
    totalSpaces: 4,
    openSpacesEstimated: 2,
    facilities: ['Lit', 'Wide Turning Mouth', 'Paved'],
    lastReportedAt: '8 mins ago',
    reportedBy: 'Marcus Vance (WP70 LLZ)'
  }
];

export const LaybyCapacityRadarModal: React.FC<LaybyCapacityRadarModalProps> = ({
  isOpen,
  onClose,
  driverReg
}) => {
  const [laybys, setLaybys] = useState<LaybyParkingLocation[]>(INITIAL_LAYBYS);
  const [filterRoad, setFilterRoad] = useState<string>('ALL');
  const [reportingLaybyId, setReportingLaybyId] = useState<string | null>(null);

  if (!isOpen) return null;

  const filteredLaybys =
    filterRoad === 'ALL' ? laybys : laybys.filter((l) => l.road === filterRoad);

  const handleUpdateStatus = (id: string, newStatus: LaybyStatus) => {
    setLaybys((prev) =>
      prev.map((l) => {
        if (l.id !== id) return l;
        const newEstimated =
          newStatus === 'OPEN' ? Math.max(3, l.totalSpaces - 2) : newStatus === 'BUSY' ? 1 : 0;
        return {
          ...l,
          capacityStatus: newStatus,
          openSpacesEstimated: newEstimated,
          lastReportedAt: 'Just now',
          reportedBy: 'You (' + driverReg + ')'
        };
      })
    );
    setReportingLaybyId(null);
  };

  const getStatusBadge = (status: LaybyStatus, count: number) => {
    switch (status) {
      case 'OPEN':
        return (
          <span className="flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-black bg-emerald-500/20 text-emerald-300 border border-emerald-500/40">
            <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
            <span>OPEN ({count} spaces)</span>
          </span>
        );
      case 'BUSY':
        return (
          <span className="flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-black bg-amber-500/20 text-amber-300 border border-amber-500/40">
            <span className="h-2 w-2 rounded-full bg-amber-400" />
            <span>BUSY (1 space left)</span>
          </span>
        );
      case 'FULL':
        return (
          <span className="flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-black bg-rose-500/20 text-rose-300 border border-rose-500/40">
            <span className="h-2 w-2 rounded-full bg-rose-400" />
            <span>FULL (0 spaces)</span>
          </span>
        );
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur-md p-3 sm:p-4 overflow-y-auto animate-in fade-in duration-200">
      <div className="relative w-full max-w-2xl rounded-3xl bg-slate-900 border border-slate-800 text-white shadow-2xl overflow-hidden flex flex-col max-h-[92vh]">
        {/* Header */}
        <div className="px-5 py-4 border-b border-slate-800 flex items-center justify-between bg-slate-950">
          <div className="flex items-center gap-2.5">
            <div className="h-9 w-9 rounded-2xl bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center text-emerald-400">
              <Compass className="h-5 w-5 animate-spin-slow" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-black tracking-wider text-emerald-400 uppercase">
                  Crowdsourced Telematics
                </span>
                <span className="text-[10px] rounded-full bg-slate-800 px-2 py-0.5 text-slate-400">
                  Spec Page 6 Utility
                </span>
              </div>
              <h3 className="text-sm font-bold text-white">Layby & Truckstop Capacity Radar</h3>
            </div>
          </div>
          <button
            onClick={onClose}
            className="rounded-xl p-2 text-slate-400 hover:bg-slate-800 hover:text-white transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Filter Bar */}
        <div className="px-5 py-3 border-b border-slate-800 bg-slate-950/60 flex items-center justify-between gap-2 overflow-x-auto">
          <div className="flex items-center gap-1.5">
            <Filter className="h-3.5 w-3.5 text-slate-400" />
            <span className="text-xs font-bold text-slate-300">Route Filter:</span>
            {['ALL', 'M1', 'M6', 'A14', 'A5'].map((r) => (
              <button
                key={r}
                onClick={() => setFilterRoad(r)}
                className={'px-2.5 py-1 rounded-lg text-xs font-bold transition-all ' + (
                  filterRoad === r
                    ? 'bg-emerald-500 text-slate-950 font-black'
                    : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                )}
              >
                {r}
              </button>
            ))}
          </div>

          <span className="text-[11px] text-slate-400 font-mono hidden sm:inline">
            5-Mile Auto-Radius
          </span>
        </div>

        {/* Layby Cards List */}
        <div className="p-4 overflow-y-auto space-y-3">
          {filteredLaybys.map((layby) => (
            <div
              key={layby.id}
              className="rounded-2xl bg-slate-950 border border-slate-800 p-4 space-y-3 hover:border-slate-700 transition-all shadow-sm"
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="px-2 py-0.5 rounded-md font-black text-[10px] bg-blue-950 text-blue-300 border border-blue-500/40">
                      {layby.road} {layby.direction}
                    </span>
                    <span className="text-xs font-bold text-slate-200">{layby.name}</span>
                  </div>
                  <div className="text-[11px] text-slate-400 mt-1 flex items-center gap-2">
                    <span className="font-mono text-cyan-300 font-bold">{layby.distanceMiles} miles away</span>
                    <span>•</span>
                    <span>Reported: {layby.lastReportedAt} by {layby.reportedBy}</span>
                  </div>
                </div>

                <div className="flex items-center gap-2 self-end sm:self-center">
                  {getStatusBadge(layby.capacityStatus, layby.openSpacesEstimated)}
                </div>
              </div>

              {/* Facilities tags */}
              <div className="flex flex-wrap items-center gap-1.5 pt-1">
                {layby.facilities.map((fac, i) => (
                  <span
                    key={i}
                    className="text-[10px] px-2 py-0.5 rounded-md bg-slate-900 border border-slate-800 text-slate-300"
                  >
                    {fac}
                  </span>
                ))}
              </div>

              {/* Action Bar */}
              <div className="flex items-center justify-between pt-2 border-t border-slate-800/80 text-xs">
                <button
                  onClick={() => setReportingLaybyId(reportingLaybyId === layby.id ? null : layby.id)}
                  className="text-cyan-400 hover:text-cyan-300 font-bold flex items-center gap-1"
                >
                  <Radio className="h-3.5 w-3.5" />
                  <span>Update Parking Status</span>
                </button>

                <a
                  href={'https://www.google.com/maps/search/?api=1&query=' + encodeURIComponent(layby.name)}
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center gap-1 text-slate-300 hover:text-white font-bold"
                >
                  <Navigation className="h-3.5 w-3.5 text-blue-400" />
                  <span>Navigate</span>
                </a>
              </div>

              {/* Inline Driver Reporting Drawer */}
              {reportingLaybyId === layby.id && (
                <div className="p-3 rounded-xl bg-slate-900 border border-slate-700 space-y-2 animate-in fade-in">
                  <div className="text-xs font-bold text-slate-300">
                    What is the capacity right now?
                  </div>
                  <div className="grid grid-cols-3 gap-2">
                    <button
                      onClick={() => handleUpdateStatus(layby.id, 'OPEN')}
                      className="py-1.5 rounded-lg bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-300 border border-emerald-500/40 text-xs font-bold"
                    >
                      Open (Spaces Free)
                    </button>
                    <button
                      onClick={() => handleUpdateStatus(layby.id, 'BUSY')}
                      className="py-1.5 rounded-lg bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 border border-amber-500/40 text-xs font-bold"
                    >
                      Busy (1 Space Left)
                    </button>
                    <button
                      onClick={() => handleUpdateStatus(layby.id, 'FULL')}
                      className="py-1.5 rounded-lg bg-rose-500/20 hover:bg-rose-500/30 text-rose-300 border border-rose-500/40 text-xs font-bold"
                    >
                      Full / Blocked
                    </button>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-slate-800 bg-slate-950 flex items-center justify-between text-xs text-slate-400">
          <span>Updates instantly sync with all nearby drivers on relief assignments</span>
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-bold transition-colors"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
};
