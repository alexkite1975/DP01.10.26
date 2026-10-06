'use client';
import React from 'react';
import {
  Compass,
  ClipboardCheck,
  Repeat,
  Receipt,
  UserCheck
} from 'lucide-react';

export type MobileTabId = 'COCKPIT' | 'CHECKS' | 'MARKETPLACE' | 'TIMESHEETS' | 'PROFILE';

interface MobileBottomNavProps {
  activeTab: MobileTabId;
  onTabChange: (tab: MobileTabId) => void;
  pendingDefectCount?: number;
  openTendersCount?: number;
}

export const MobileBottomNav: React.FC<MobileBottomNavProps> = ({
  activeTab,
  onTabChange,
  pendingDefectCount = 0,
  openTendersCount = 3
}) => {
  const tabs = [
    {
      id: 'COCKPIT' as MobileTabId,
      label: 'Cockpit',
      subtitle: 'Safe Nav',
      icon: Compass,
      badge: null
    },
    {
      id: 'CHECKS' as MobileTabId,
      label: 'Walkaround',
      subtitle: '27-Pt Check',
      icon: ClipboardCheck,
      badge: pendingDefectCount > 0 ? `${pendingDefectCount} Defect` : 'MOT OK'
    },
    {
      id: 'MARKETPLACE' as MobileTabId,
      label: 'Market',
      subtitle: 'Loads & Shifts',
      icon: Repeat,
      badge: openTendersCount > 0 ? `${openTendersCount} Live` : null
    },
    {
      id: 'TIMESHEETS' as MobileTabId,
      label: 'Timesheets',
      subtitle: 'Demurrage',
      icon: Receipt,
      badge: null
    },
    {
      id: 'PROFILE' as MobileTabId,
      label: 'Hub',
      subtitle: 'CPC & Docs',
      icon: UserCheck,
      badge: '28/35h'
    }
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 bg-slate-950/95 backdrop-blur-md border-t border-slate-800 shadow-[0_-8px_30px_rgba(0,0,0,0.5)] safe-area-bottom">
      <div className="max-w-md mx-auto grid grid-cols-5 h-20 px-1">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => onTabChange(tab.id)}
              className={`relative flex flex-col items-center justify-center py-1.5 transition-all select-none touch-manipulation focus:outline-none ${
                isActive
                  ? 'text-cyan-400 font-bold scale-105'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              {/* Active Tab Glow Pill */}
              {isActive && (
                <div className="absolute top-0 w-12 h-1 bg-gradient-to-r from-cyan-500 to-blue-500 rounded-full shadow-[0_0_12px_rgba(6,182,212,0.8)]" />
              )}

              {/* Icon Container with Glove-Friendly Tap Target */}
              <div className="relative mt-1">
                <div
                  className={`w-10 h-10 rounded-xl flex items-center justify-center transition-colors ${
                    isActive
                      ? 'bg-cyan-500/20 text-cyan-300 ring-1 ring-cyan-500/40'
                      : 'bg-slate-900/60 text-slate-400'
                  }`}
                >
                  <Icon className="w-5 h-5" />
                </div>

                {/* Badge if present */}
                {tab.badge && (
                  <span
                    className={`absolute -top-1 -right-2 text-[9px] font-black px-1.5 py-0.5 rounded-full border shadow-sm ${
                      tab.badge.includes('Defect')
                        ? 'bg-rose-500 text-white border-rose-400 animate-pulse'
                        : isActive
                        ? 'bg-cyan-500 text-slate-950 border-cyan-300'
                        : 'bg-slate-800 text-cyan-300 border-slate-700'
                    }`}
                  >
                    {tab.badge}
                  </span>
                )}
              </div>

              {/* Text Labels */}
              <span className="text-[11px] tracking-tight leading-tight mt-1 truncate max-w-full">
                {tab.label}
              </span>
              <span className="text-[9px] text-slate-500 tracking-tighter truncate leading-none">
                {tab.subtitle}
              </span>
            </button>
          );
        })}
      </div>
    </nav>
  );
};
