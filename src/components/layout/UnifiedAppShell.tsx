'use client';

import React from 'react';
import { NavRail } from './NavRail';
import { WorkspaceHeader } from './WorkspaceHeader';
import { ContextualDrawer } from './ContextualDrawer';
import { useLayout } from '@/context/LayoutContext';

export const UnifiedAppShell: React.FC<{
  title: string;
  breadcrumbs: string[];
  currentPath: string;
  onNavigate: (path: string) => void;
  children: React.ReactNode;
}> = ({ title, breadcrumbs, currentPath, onNavigate, children }) => {
  const {
    isNavExpanded,
    toggleNav,
    isDrawerOpen,
    drawerTitle,
    drawerContent,
    closeDrawer,
    openDrawer,
    setIsSearchOpen,
  } = useLayout();

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans antialiased">
      <NavRail currentPath={currentPath} onNavigate={onNavigate} isExpanded={isNavExpanded} onToggle={toggleNav} />
      <WorkspaceHeader
        title={title}
        breadcrumbs={breadcrumbs}
        isNavExpanded={isNavExpanded}
        onOpenSearch={() => setIsSearchOpen(true)}
        onToggleDrawer={() => {
          if (isDrawerOpen) closeDrawer();
          else openDrawer('Workspace Parameters', <div className="text-xs text-slate-400">Select any vehicle card to inspect live telemetry.</div>);
        }}
        isDrawerOpen={isDrawerOpen}
      />
      <main className={`pt-14 transition-all duration-300 ease-in-out min-h-screen ${isNavExpanded ? 'pl-60' : 'pl-[68px]'}`}>
        <div className="p-6">{children}</div>
      </main>
      <ContextualDrawer isOpen={isDrawerOpen} onClose={closeDrawer} title={drawerTitle}>
        {drawerContent}
      </ContextualDrawer>
    </div>
  );
};
