'use client';

import React from 'react';
import dynamic from 'next/dynamic';

const BusinessDashboard = dynamic(() => import('@/components/manager/BusinessDashboard'), { ssr: false });

export default function HaulierMasterCommand() {
  return (
    <div className="min-h-screen bg-slate-950 text-white">
      <BusinessDashboard />
    </div>
  );
}
