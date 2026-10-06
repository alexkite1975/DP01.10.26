'use client';

import React from 'react';
import dynamic from 'next/dynamic';

const UserAccessControlPortal = dynamic(() => import('@/components/manager/UserAccessControlPortal'), { ssr: false });

export default function AdminControlPlane() {
  return (
    <div className="min-h-screen bg-slate-950 text-white">
      <UserAccessControlPortal />
    </div>
  );
}
