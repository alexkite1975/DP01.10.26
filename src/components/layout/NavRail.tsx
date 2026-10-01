'use client';

import React from 'react';
import { Truck, ShieldAlert, MapPin, Building2, Clock, ChevronRight, ChevronLeft, Activity } from 'lucide-react';

interface NavItem {
  id: string;
  label: string;
  path: string;
  icon: React.ElementType;
  badge?: string;
  badgeVariant?: 'emerald' | 'amber' | 'rose';
}

const NAV_ITEMS: NavItem[] = [
  { id: 'fleet', label: 'Fleet Control Tower', path: '/fleet', icon: Truck },
  { id: 'bridges', label: 'Bridge Clearance Radar', path: '/radar', icon: ShieldAlert, badge: 'LIVE', badgeVariant: 'emerald' },
  { id: 'siterisk', label: 'SiteRiskPro Yards', path: '/siterisk', icon: Building2 },
  { id: 'geofence', label: 'Geofence Tracking', path: '/geofence', icon: MapPin },
  { id: 'tacho', label: 'Tacho Hours & Breaks', path: '/compliance', icon: Clock, badge: '2 Breaches', badgeVariant: 'rose' },
];

export const NavRail: React.FC<{
  currentPath: string;
  onNavigate: (path: string) => void;
  isExpanded: boolean;
  onToggle: () => void;
}> = ({ currentPath, onNavigate, isExpanded, onToggle }) => {
  return (
    <aside
      className={`fixed top-0 left-0 h-screen z-40 bg-slate-900 border-r border-slate-800 transition-all duration-300 ease-in-out flex flex-col justify-between ${
        isExpanded ? 'w-60' : 'w-[68px]'
      }`}
    >
      <div>
        <div className="h-14 flex items-center justify-between px-3.5 border-b border-slate-800">
          <div className="flex items-center space-x-3 overflow-hidden">
            <div className="w-8 h-8 rounded-lg bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center flex-shrink-0 text-emerald-400 font-bold font-mono">
              SH
            </div>
            {isExpanded && (
              <span className="font-semibold text-slate-100 tracking-tight text-sm whitespace-nowrap">
                SmartHaul <span className="text-emerald-400">OS</span>
              </span>
            )}
          </div>
          <button
            onClick={onToggle}
            className="p-1 rounded hover:bg-slate-800 text-slate-400 hover:text-slate-200 transition-colors"
          >
            {isExpanded ? <ChevronLeft size={16} /> : <ChevronRight size={16} />}
          </button>
        </div>

        <nav className="p-2 space-y-1">
          {NAV_ITEMS.map((item) => {
            const Icon = item.icon;
            const isActive = currentPath === item.path || currentPath.startsWith(`${item.path}/`);

            return (
              <button
                key={item.id}
                onClick={() => onNavigate(item.path)}
                className={`w-full flex items-center h-10 rounded-lg px-2.5 transition-all text-xs font-medium group relative ${
                  isActive
                    ? 'bg-slate-800 text-emerald-400 font-semibold'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
                }`}
              >
                <Icon size={18} className={`flex-shrink-0 ${isActive ? 'text-emerald-400' : 'text-slate-400'}`} />
                {isExpanded && (
                  <div className="ml-3 flex items-center justify-between flex-1 overflow-hidden">
                    <span className="truncate">{item.label}</span>
                    {item.badge && (
                      <span className={`text-[10px] px-1.5 py-0.5 rounded font-mono font-bold ${
                        item.badgeVariant === 'rose'
                          ? 'bg-rose-500/20 text-rose-400 border border-rose-500/30'
                          : 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                      }`}>
                        {item.badge}
                      </span>
                    )}
                  </div>
                )}
              </button>
            );
          })}
        </nav>
      </div>

      <div className="p-2 border-t border-slate-800">
        <div className={`flex items-center px-2 py-1.5 rounded bg-slate-950/60 border border-slate-800/80 ${isExpanded ? 'justify-between' : 'justify-center'}`}>
          <div className="flex items-center space-x-2">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
            </span>
            {isExpanded && <span className="text-[11px] text-slate-400 font-mono">25.4k msg/s</span>}
          </div>
          {isExpanded && <Activity size={14} className="text-slate-500" />}
        </div>
      </div>
    </aside>
  );
};
