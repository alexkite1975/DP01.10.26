'use client';

import React from 'react';
import { Search, Sliders, Bell } from 'lucide-react';

export const WorkspaceHeader: React.FC<{
  title: string;
  breadcrumbs: string[];
  isNavExpanded: boolean;
  onOpenSearch: () => void;
  onToggleDrawer: () => void;
  isDrawerOpen: boolean;
}> = ({ title, breadcrumbs, isNavExpanded, onOpenSearch, onToggleDrawer, isDrawerOpen }) => {
  return (
    <header
      className={`fixed top-0 right-0 h-14 bg-slate-950/90 backdrop-blur-md border-b border-slate-800 z-30 transition-all duration-300 ease-in-out flex items-center justify-between px-6 ${
        isNavExpanded ? 'left-60' : 'left-[68px]'
      }`}
    >
      <div className="flex items-center space-x-3">
        <div className="flex items-center text-xs text-slate-500 font-mono space-x-1.5">
          {breadcrumbs.map((crumb, idx) => (
            <React.Fragment key={crumb}>
              <span className="hover:text-slate-400 transition-colors cursor-pointer">{crumb}</span>
              {idx < breadcrumbs.length - 1 && <span className="text-slate-700">/</span>}
            </React.Fragment>
          ))}
        </div>
        <span className="text-slate-700">|</span>
        <h1 className="text-sm font-semibold text-slate-100 tracking-tight">{title}</h1>
      </div>

      <div className="flex items-center space-x-3">
        <div className="hidden md:flex items-center space-x-1.5 px-2.5 py-1 rounded-full bg-slate-900 border border-slate-800 text-[11px] font-mono text-slate-300">
          <span className="h-1.5 w-1.5 rounded-full bg-emerald-400"></span>
          <span>PostGIS: 1.8ms</span>
        </div>

        <button
          onClick={onOpenSearch}
          className="flex items-center space-x-2 px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-800 text-slate-400 hover:text-slate-200 transition-all text-xs"
        >
          <Search size={14} />
          <span className="hidden sm:inline">Search vehicles...</span>
          <kbd className="hidden sm:inline-block px-1.5 py-0.5 bg-slate-800 border border-slate-700 rounded text-[10px] font-mono text-slate-400">
            ⌘K
          </kbd>
        </button>

        <button className="p-2 rounded-lg text-slate-400 hover:text-slate-200 hover:bg-slate-900 transition-colors relative">
          <Bell size={16} />
          <span className="absolute top-1.5 right-1.5 h-2 w-2 rounded-full bg-rose-500"></span>
        </button>

        <button
          onClick={onToggleDrawer}
          className={`p-2 rounded-lg transition-colors border ${
            isDrawerOpen
              ? 'bg-slate-800 text-emerald-400 border-slate-700'
              : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900 border-slate-800'
          }`}
          title="Toggle Drawer"
        >
          <Sliders size={16} />
        </button>
      </div>
    </header>
  );
};
