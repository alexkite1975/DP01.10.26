"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { WorkflowLayout } from "@/components/layout/WorkflowLayout";
import { Camera, ArrowRight } from "lucide-react";

export default function WalkaroundInspectionPage() {
  const router = useRouter();

  return (
    <WorkflowLayout
      title="DVSA Walkaround Check"
      subtitle="Vehicle: Scania R450 (GN21 XRO)"
      currentStep={2}
      totalSteps={4}
      backRoute="/driver"
      nextRoute="/driver/inspections/signoff"
      footerActions={
        <button
          onClick={() => router.push("/driver/inspections/signoff")}
          className="w-full flex items-center justify-center space-x-2 py-3 px-4 rounded-xl bg-cyan-600 hover:bg-cyan-500 font-semibold text-white shadow-lg shadow-cyan-900/30 transition-all active:scale-[0.98]"
        >
          <span>Continue to Sign-Off</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      }
    >
      <div className="space-y-4">
        {/* Defect AI Camera Module */}
        <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-slate-300">Camera AI Defect Scan</span>
            <span className="text-xs px-2 py-0.5 rounded bg-emerald-950 text-emerald-400 border border-emerald-800">
              AI Ready
            </span>
          </div>
          <button className="w-full py-8 border-2 border-dashed border-slate-700 hover:border-cyan-500 rounded-xl flex flex-col items-center justify-center space-y-2 text-slate-400 hover:text-cyan-400 bg-slate-950/50 transition-colors">
            <Camera className="w-8 h-8" />
            <span className="text-xs font-medium">Tap to capture tyres, lights, or body defects</span>
          </button>
        </div>

        {/* Dynamic Checklist */}
        <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 space-y-3">
          <h3 className="text-sm font-medium text-slate-200">Mandatory Checks</h3>
          <div className="space-y-2">
            {[
              "Tyres & Wheels (Condition & Tread Depth)",
              "Brakes & Air Lines",
              "Lights, Indicators & Reflectors",
              "Mirrors, Glass & Cab Visibility",
            ].map((check, idx) => (
              <label
                key={idx}
                className="flex items-center justify-between p-3 rounded-lg bg-slate-800/60 border border-slate-700/60 hover:bg-slate-800 transition-colors cursor-pointer"
              >
                <span className="text-xs text-slate-300">{check}</span>
                <input
                  type="checkbox"
                  defaultChecked
                  className="rounded border-slate-600 text-cyan-600 focus:ring-cyan-500 w-4 h-4"
                />
              </label>
            ))}
          </div>
        </div>
      </div>
    </WorkflowLayout>
  );
}
