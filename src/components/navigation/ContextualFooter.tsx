'use client';

import React from 'react';

export default function ContextualFooter({ children }: { children: React.ReactNode }) {
  return (
    <div className="sticky bottom-0 z-40 w-full bg-slate-900/90 backdrop-blur-md border-t border-slate-800 p-3 pb-safe">
      <div className="max-w-xl mx-auto flex items-center justify-center gap-3">
        {children}
      </div>
    </div>
  );
}
