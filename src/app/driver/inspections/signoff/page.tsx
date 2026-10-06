"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { WorkflowLayout } from "@/components/layout/WorkflowLayout";
import { ShieldCheck } from "lucide-react";

export default function SignOffPage() {
  const router = useRouter();
  const [signed, setSigned] = useState(false);

  return (
    <WorkflowLayout
      title="Driver Sign-Off"
      subtitle="Step 3 of 4: Declaration"
      currentStep={3}
      totalSteps={4}
      backRoute="/driver/inspections/walkaround"
      nextRoute="/driver"
      footerActions={
        <button
          onClick={() => router.push("/driver")}
          disabled={!signed}
          className={`w-full py-3 px-4 rounded-xl font-semibold text-white shadow-lg transition-all active:scale-[0.98] ${
            signed
              ? "bg-emerald-600 hover:bg-emerald-500 shadow-emerald-900/30"
              : "bg-slate-800 text-slate-500 cursor-not-allowed border border-slate-700"
          }`}
        >
          Submit DVSA Declaration & Start Shift
        </button>
      }
    >
      <div className="space-y-4">
        {/* Legal Signoff Block */}
        <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 space-y-3 text-center">
          <div className="w-12 h-12 rounded-full bg-cyan-950 border border-cyan-800 flex items-center justify-center mx-auto text-cyan-400">
            <ShieldCheck className="w-6 h-6" />
          </div>
          <h2 className="text-base font-semibold text-white">Legal DVSA Statement</h2>
          <p className="text-xs text-slate-400 leading-relaxed">
            I confirm that I have carried out a full walkaround check of vehicle GN21 XRO in accordance with DVSA guidelines. No unaddressed safety-critical defects exist.
          </p>
        </div>

        {/* Checkbox Trigger */}
        <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 space-y-3">
          <label className="flex items-center space-x-3 cursor-pointer">
            <input
              type="checkbox"
              checked={signed}
              onChange={(e) => setSigned(e.target.checked)}
              className="rounded border-slate-600 text-cyan-600 focus:ring-cyan-500 w-5 h-5"
            />
            <span className="text-xs text-slate-300 font-medium">
              I certify this report as a true statement and record my digital signature.
            </span>
          </label>
        </div>
      </div>
    </WorkflowLayout>
  );
}
