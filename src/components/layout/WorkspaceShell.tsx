'use client';

import React from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { UnifiedAppShell } from './UnifiedAppShell';

export const WorkspaceShell: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const pathname = usePathname();
  const router = useRouter();

  const getMetadata = (path: string) => {
    if (path.startsWith('/radar')) return { title: 'Low-Bridge Clearance Radar', breadcrumbs: ['FleetOps', 'Safety', 'Radar'] };
    if (path.startsWith('/siterisk')) return { title: 'SiteRiskPro Depot Management', breadcrumbs: ['FleetOps', 'Depots', 'Audits'] };
    if (path.startsWith('/compliance')) return { title: 'Drivers Hours & Compliance', breadcrumbs: ['FleetOps', 'DVSA', 'Tachograph'] };
    if (path.startsWith('/geofence')) return { title: 'Geofence Tracking Console', breadcrumbs: ['FleetOps', 'Spatial', 'Geofence'] };
    return { title: 'Live Fleet Control Tower', breadcrumbs: ['FleetOps', 'Control Tower'] };
  };

  const { title, breadcrumbs } = getMetadata(pathname);

  return (
    <UnifiedAppShell title={title} breadcrumbs={breadcrumbs} currentPath={pathname} onNavigate={(p) => router.push(p)}>
      {children}
    </UnifiedAppShell>
  );
};
