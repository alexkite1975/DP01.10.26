'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  CalendarDays,
  Package,
  ClipboardCheck,
  Clock,
  ShieldAlert,
  ChevronDown,
  ChevronUp,
  LayoutGrid
} from 'lucide-react';

interface DockItem {
  id: string;
  label: string;
  shortLabel: string;
  href: string;
  icon: React.ComponentType<{ className?: string }>;
  accentColor: string;
  glowColor: string;
  badge?: string;
}

const DOCK_ITEMS: DockItem[] = [
  {
    id: 'shifts',
    label: 'Relief Shifts',
    shortLabel: 'Shifts',
    href: '/driver/shifts',
    icon: CalendarDays,
    accentColor: 'text-amber-400',
    glowColor: 'bg-amber-500/20 border-amber-500/40'
  },
  {
    id: 'freight',
    label: 'HX Freight',
    shortLabel: 'Freight',
    href: '/freight',
    icon: Package,
    accentColor: 'text-blue-400',
    glowColor: 'bg-blue-500/20 border-blue-500/40'
  },
  {
    id: 'walkaround',
    label: 'Walkaround',
    shortLabel: 'Check',
    href: '/driver/walkaround',
    icon: ClipboardCheck,
    accentColor: 'text-emerald-400',
    glowColor: 'bg-emerald-500/20 border-emerald-500/40',
    badge: 'DVSA'
  },
  {
    id: 'tacho',
    label: 'Tacho Horizon',
    shortLabel: 'Tacho',
    href: '/driver/tacho',
    icon: Clock,
    accentColor: 'text-cyan-400',
    glowColor: 'bg-cyan-500/20 border-cyan-500/40'
  },
  {
    id: 'safety',
    label: 'Safety Shield',
    shortLabel: 'Shield',
    href: '/driver/safety',
    icon: ShieldAlert,
    accentColor: 'text-rose-400',
    glowColor: 'bg-rose-500/20 border-rose-500/40'
  }
];

export const CockpitBottomDock: React.FC = () => {
  const pathname = usePathname();
  const [isMinimized, setIsMinimized] = useState(false);

  // If on admin or clean landing, allow discrete presence or toggle
  const isDockApplicable =
    pathname.startsWith('/driver') ||
    pathname.startsWith('/freight') ||
    pathname === '/haulier';

  if (!isDockApplicable) return null;

  return (
    <aside 
      aria-label="In-Cab Quick Access Dock"
      className="fixed bottom-3 sm:bottom-5 left-1/2 -translate-x-1/2 z-40 max-w-[95vw] select-none"
    >
      {isMinimized ? (
        <button
          onClick={() => setIsMinimized(false)}
          className="cockpit-panel px-4 py-2 rounded-full flex items-center gap-2 text-xs font-mono font-bold text-slate-300 hover:text-white shadow-cockpit touch-press transition"
          title="Expand In-Cab Dock"
        >
          <LayoutGrid className="w-3.5 h-3.5 text-blue-400" />
          <span>In-Cab OS Dock</span>
          <ChevronUp className="w-3.5 h-3.5 text-slate-400" />
        </button>
      ) : (
        <nav 
          aria-label="Driver Navigation Dock"
          className="cockpit-panel rounded-full p-1.5 sm:p-2 flex items-center gap-1 sm:gap-2 shadow-cockpit-lg border border-white/10 backdrop-blur-2xl"
        >
          {DOCK_ITEMS.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href;

            return (
              <Link
                key={item.id}
                href={item.href}
                className={`relative flex items-center gap-1.5 px-2.5 sm:px-4 py-2 rounded-full text-xs font-bold transition-all touch-press ${
                  isActive
                    ? `${item.glowColor} ${item.accentColor} border shadow-lg`
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
                }`}
              >
                <Icon className={`w-4 h-4 ${isActive ? item.accentColor : 'text-slate-400'}`} />
                <span className="hidden sm:inline text-xs font-mono">{item.label}</span>
                <span className="sm:hidden text-[11px] font-mono">{item.shortLabel}</span>

                {item.badge && !isActive && (
                  <span className="hidden md:inline-block px-1.5 py-0.2 rounded-full text-[9px] font-mono font-bold bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                    {item.badge}
                  </span>
                )}

                {isActive && (
                  <span className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-1.5 h-1.5 rounded-full bg-current shadow-[0_0_8px_currentColor]" />
                )}
              </Link>
            );
          })}

          <button
            onClick={() => setIsMinimized(true)}
            className="p-2 ml-0.5 text-slate-500 hover:text-slate-300 rounded-full hover:bg-slate-800/40 transition touch-press"
            title="Minimize Dock"
          >
            <ChevronDown className="w-3.5 h-3.5" />
          </button>
        </nav>
      )}
    </aside>
  );
};

export default CockpitBottomDock;
