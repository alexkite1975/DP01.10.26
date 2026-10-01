'use client';

import React from 'react';
import { X } from 'lucide-react';

export const ContextualDrawer: React.FC<{
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
}> = ({ isOpen, onClose, title, children }) => {
  return (
    <>
      {isOpen && (
        <div onClick={onClose} className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40 lg:hidden" />
      )}
      <aside
        className={`fixed top-0 right-0 h-screen w-[420px] max-w-full bg-slate-900 border-l border-slate-800 shadow-drawer z-50 transform transition-transform duration-300 ease-in-out flex flex-col ${
          isOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        <div className="h-14 flex items-center justify-between px-6 border-b border-slate-800">
          <h2 className="text-sm font-semibold text-slate-100 tracking-tight truncate">
            {title || 'Inspection Details'}
          </h2>
          <button onClick={onClose} className="p-1.5 rounded-lg text-slate-400 hover:text-slate-200 hover:bg-slate-800">
            <X size={16} />
          </button>
        </div>
        <div className="flex-1 overflow-y-auto p-6 space-y-6">{children}</div>
      </aside>
    </>
  );
};
