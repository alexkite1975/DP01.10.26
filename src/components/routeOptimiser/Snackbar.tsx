'use client';
import React, { useEffect, useState } from 'react';
import { SnackbarMessage } from '../../types/routeOptimiserTypes';
import { X } from 'lucide-react';

interface Props {
  messages: SnackbarMessage[];
  onDismiss: (id: string) => void;
}

const DURATION_MS = 6000;

export const Snackbar: React.FC<Props> = ({ messages, onDismiss }) => {
  const [exiting, setExiting] = useState<Set<string>>(new Set());

  const dismiss = (id: string) => {
    setExiting((prev) => new Set([...prev, id]));
    setTimeout(() => {
      onDismiss(id);
      setExiting((prev) => {
        const next = new Set(prev);
        next.delete(id);
        return next;
      });
    }, 220);
  };

  return (
    <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 flex flex-col gap-2 items-center min-w-72 max-w-md w-full px-4 pointer-events-none">
      {messages.map((msg) => (
        <SnackbarItem
          key={msg.id}
          msg={msg}
          isExiting={exiting.has(msg.id)}
          onDismiss={() => dismiss(msg.id)}
          duration={DURATION_MS}
        />
      ))}
    </div>
  );
};

const SnackbarItem: React.FC<{
  msg: SnackbarMessage;
  isExiting: boolean;
  onDismiss: () => void;
  duration: number;
}> = ({ msg, isExiting, onDismiss, duration }) => {
  useEffect(() => {
    const timer = setTimeout(onDismiss, duration);
    return () => clearTimeout(timer);
  }, [onDismiss, duration]);

  return (
    <div
      className={`pointer-events-auto flex items-center justify-between gap-3 bg-slate-900/95 border border-slate-700 rounded-xl px-4 py-3 shadow-2xl w-full text-slate-100 backdrop-blur-md transition-all duration-200 ${
        isExiting ? 'opacity-0 translate-y-2' : 'opacity-100 translate-y-0 animate-in fade-in slide-in-from-bottom-3'
      }`}
      role="status"
    >
      <p className="flex-1 text-xs sm:text-sm font-medium text-slate-200">{msg.text}</p>
      {msg.action && (
        <button
          onClick={() => {
            msg.action!.onClick();
            onDismiss();
          }}
          className="text-xs sm:text-sm font-bold text-amber-400 hover:text-amber-300 transition-colors shrink-0 px-2.5 py-1 rounded bg-amber-500/10 border border-amber-500/30 cursor-pointer active:scale-95"
        >
          {msg.action.label}
        </button>
      )}
      <button
        onClick={onDismiss}
        className="text-slate-400 hover:text-slate-200 transition-colors shrink-0 p-1 rounded-lg hover:bg-slate-800 cursor-pointer"
        title="Dismiss notice"
      >
        <X className="w-4 h-4" />
      </button>
    </div>
  );
};
