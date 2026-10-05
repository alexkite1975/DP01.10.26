'use client';

import React from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { useSwipeable } from 'react-swipeable';
import { motion, AnimatePresence } from 'framer-motion';

export default function SwipeBackWrapper({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const isRoot = pathname === '/';

  const handlers = useSwipeable({
    onSwipedRight: (eventData) => {
      // Trigger navigation if not on root and swipe moves >60px to the right starting near the edge
      if (!isRoot && eventData.deltaX > 60 && (eventData.initial[0] < 80 || eventData.velocity > 0.35)) {
        if (typeof window !== 'undefined' && window.navigator?.vibrate) {
          window.navigator.vibrate(15);
        }
        router.back();
      }
    },
    trackMouse: false,
    preventScrollOnSwipe: false,
  });

  return (
    <div {...handlers} className="min-h-screen flex flex-col bg-slate-950 text-slate-100">
      <AnimatePresence mode="wait">
        <motion.main
          key={pathname}
          initial={{ opacity: 0, x: 12 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -12 }}
          transition={{ duration: 0.16, ease: 'easeOut' }}
          className="flex-1 flex flex-col w-full"
        >
          {children}
        </motion.main>
      </AnimatePresence>
    </div>
  );
}
