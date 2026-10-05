'use client';

import React from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { ChevronLeft, ShieldCheck } from 'lucide-react';

interface ContextualHeaderProps {
  title?: string;
  subtitle?: string;
  rightAction?: React.ReactNode;
}

export default function ContextualHeader({ title, subtitle, rightAction }: ContextualHeaderProps) {
  const router = useRouter();
  const pathname = usePathname();

  const isRoot = pathname === '/';

  const getRouteTitle = () => {
    if (title) return title;
    if (isRoot) return 'SmartHaul & FleetOps Command';
    
    const segments = pathname.split('/').filter(Boolean);
    const last = segments[segments.length - 1] || '';
    return last
      .split('-')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  };

  const handleBack = () => {
    if (typeof window !== 'undefined' && window.navigator?.vibrate) {
      window.navigator.vibrate(10);
    }
    router.back();
  };

  return (
    <header className="sticky top-0 z-50 w-full bg-slate-900/90 backdrop-blur-md border-b border-slate-800 text-slate-100 transition-colors">
      <div className="max-w-7xl mx-auto px-4 h-14 flex items-center justify-between">
        
        {/* Left: Back button or Logo badge */}
        <div className="flex items-center gap-3">
          {!isRoot ? (
            <button
              onClick={handleBack}
              aria-label="Go back"
              className="flex items-center justify-center w-10 h-10 rounded-full hover:bg-slate-800 active:scale-95 transition-all text-slate-300 hover:text-white"
            >
              <ChevronLeft className="w-6 h-6 stroke-[2.5]" />
            </button>
          ) : (
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
                <ShieldCheck className="w-5 h-5" />
              </div>
            </div>
          )}

          {/* Center: Contextual Title & Subtitle */}
          <div className="flex flex-col">
            <h1 className="text-base font-bold text-white leading-tight truncate">
              {getRouteTitle()}
            </h1>
            {subtitle && (
              <span className="text-xs text-slate-400 truncate">
                {subtitle}
              </span>
            )}
          </div>
        </div>

        {/* Right: Contextual Action */}
        <div className="flex items-center gap-2">
          {rightAction}
        </div>

      </div>
    </header>
  );
}
