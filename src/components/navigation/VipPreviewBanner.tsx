'use client';

import React, { useState, useEffect } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { Lock, UserCheck, Shield } from 'lucide-react';

export const VipPreviewBanner: React.FC = () => {
  const pathname = usePathname();
  const router = useRouter();
  const [previewUser, setPreviewUser] = useState<string | null>(null);

  useEffect(() => {
    const user = localStorage.getItem('dp_preview_user');
    const hasAccess =
      document.cookie.includes('dp_preview_access=1') ||
      localStorage.getItem('dp_preview_access') === '1';

    if (hasAccess && user) {
      setPreviewUser(user);
    } else {
      setPreviewUser(null);
    }
  }, [pathname]);

  // Don't render on the coming-soon page as it has its own integrated status
  if (!previewUser || pathname === '/coming-soon') {
    return null;
  }

  const handleLock = async () => {
    try {
      await fetch('/api/auth/vip-access', { method: 'DELETE' });
    } catch (e) {
      // ignore
    }
    document.cookie = 'dp_preview_access=; path=/; max-age=0';
    document.cookie = 'dp_preview_user=; path=/; max-age=0';
    localStorage.removeItem('dp_preview_access');
    localStorage.removeItem('dp_preview_user');
    setPreviewUser(null);
    router.push('/coming-soon');
    router.refresh();
  };

  return (
    <div className="bg-emerald-950/95 border-b border-emerald-500/30 px-3 py-1.5 text-xs font-mono flex items-center justify-between sticky top-0 z-50 backdrop-blur-md shadow-md">
      <div className="flex items-center gap-2">
        <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
        <span className="text-emerald-300 font-bold text-[11px] sm:text-xs">
          VIP PREVIEW ACTIVE: <span className="text-white">{previewUser}</span>
        </span>
      </div>

      <div className="flex items-center gap-2">
        <button
          onClick={handleLock}
          className="px-2.5 py-1 rounded-lg bg-slate-900/90 hover:bg-slate-800 border border-slate-700 text-slate-300 hover:text-white text-[11px] font-mono flex items-center gap-1.5 transition cursor-pointer"
          title="Lock site and test public Coming Soon view"
        >
          <Lock className="w-3 h-3 text-amber-400" />
          <span>Lock Site (Public Mode)</span>
        </button>
      </div>
    </div>
  );
};
