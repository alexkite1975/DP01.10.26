"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { useSwipeGesture } from "@/hooks/useSwipeGesture";
import { ChevronLeft } from "lucide-react";

interface WorkflowLayoutProps {
  title: string;
  subtitle?: string;
  currentStep?: number;
  totalSteps?: number;
  backRoute?: string;
  nextRoute?: string;
  children: React.ReactNode;
  footerActions?: React.ReactNode;
}

export function WorkflowLayout({
  title,
  subtitle,
  currentStep,
  totalSteps,
  backRoute,
  nextRoute,
  children,
  footerActions,
}: WorkflowLayoutProps) {
  const router = useRouter();

  const handleBack = () => {
    if (backRoute) {
      router.push(backRoute);
    } else {
      router.back();
    }
  };

  const handleNext = () => {
    if (nextRoute) {
      router.push(nextRoute);
    }
  };

  useSwipeGesture({
    onSwipeRight: handleBack,
    onSwipeLeft: nextRoute ? handleNext : undefined,
  });

  return (
    <div className="flex flex-col min-h-dvh bg-slate-950 text-slate-100 select-none">
      {/* Dynamic Header */}
      <header className="sticky top-0 z-30 flex items-center justify-between px-4 py-3.5 bg-slate-900/90 backdrop-blur border-b border-slate-800">
        <div className="flex items-center space-x-3">
          <button
            onClick={handleBack}
            className="p-2 -ml-1 rounded-lg bg-slate-800/80 hover:bg-slate-700 active:scale-95 transition-all text-slate-300 hover:text-white"
            aria-label="Go Back"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          <div>
            <h1 className="text-base font-semibold text-white tracking-tight leading-tight">
              {title}
            </h1>
            {subtitle && (
              <p className="text-xs text-slate-400 font-medium">{subtitle}</p>
            )}
          </div>
        </div>

        {currentStep && totalSteps && (
          <div className="text-right">
            <span className="text-xs font-semibold px-2 py-1 rounded bg-slate-800 text-cyan-400 border border-slate-700">
              {currentStep} / {totalSteps}
            </span>
          </div>
        )}
      </header>

      {/* Single Purpose Body */}
      <main className="flex-1 overflow-y-auto p-4 max-w-lg mx-auto w-full">
        {children}
      </main>

      {/* Bottom Sticky Action Block */}
      {footerActions && (
        <footer className="sticky bottom-0 z-30 p-4 bg-slate-900/95 backdrop-blur border-t border-slate-800 max-w-lg mx-auto w-full">
          {footerActions}
        </footer>
      )}
    </div>
  );
}
