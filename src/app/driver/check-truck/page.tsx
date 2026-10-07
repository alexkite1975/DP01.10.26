'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function CheckTruckRedirect() {
  const router = useRouter();

  useEffect(() => {
    // Check truck is deprecated; seamlessly redirect to the dedicated Driver Walkaround page
    router.replace('/driver/walkaround');
  }, [router]);

  return (
    <div className="flex items-center justify-center min-h-dvh bg-slate-950 text-slate-400 font-mono text-xs">
      Loading Driver Walkaround...
    </div>
  );
}
