"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { WorkflowLayout } from "@/components/layout/WorkflowLayout";
import { Camera, AlertTriangle, ArrowRight } from "lucide-react";

interface CheckItem {
  id: string;
  name: string;
  isPassed: boolean;
  defectDescription?: string;
}

export default function WalkaroundInspectionPage() {
  const router = useRouter();
  const [vehicleId, setVehicleId] = useState("");
  const [checklist, setChecklist] = useState<CheckItem[]>([
    { id: "tyres", name: "Tyres & Wheels (Condition & Tread)", isPassed: true },
    { id: "brakes", name: "Brakes & Air Pressure Lines", isPassed: true },
    { id: "lights", name: "Lights, Reflectors & Indicators", isPassed: true },
    { id: "mirrors", name: "Mirrors, Glass & Cab Visibility", isPassed: true },
  ]);

  useEffect(() => {
    // Read the active vehicle ID selected in Step 1
    const storedVehicle = localStorage.getItem("active_vehicle_id") || "1";
    setVehicleId(storedVehicle);
  }, []);

  const handleToggle = (id: string) => {
    setChecklist((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, isPassed: !item.isPassed } : item
      )
    );
  };

  const handleDescriptionChange = (id: string, text: string) => {
    setChecklist((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, defectDescription: text } : item
      )
    );
  };

  const handleContinue = () => {
    // Package and store the state in localStorage so the Sign-off screen can retrieve it
    localStorage.setItem("pending_inspection_items", JSON.stringify(checklist));
    router.push("/driver/inspections/signoff");
  };

  return (
    <WorkflowLayout
      title="DVSA Walkaround Check"
      subtitle={`Vehicle ID: ${vehicleId}`}
      currentStep={2}
      totalSteps={4}
      backRoute="/driver/inspections/select-vehicle"
      nextRoute="/driver/inspections/signoff"
      footerActions={
        <button
          onClick={handleContinue}
          className="w-full flex items-center justify-center space-x-2 py-3 px-4 rounded-xl bg-cyan-600 hover:bg-cyan-500 font-semibold text-white shadow-lg shadow-cyan-900/30 transition-all active:scale-[0.98]"
        >
          <span>Continue to Sign-Off</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      }
    >
      <div className="space-y-4">
        {/* AI Camera defect scanning tool */}
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

        {/* Dynamic Itemized Checklist */}
        <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 space-y-3">
          <h3 className="text-sm font-medium text-slate-200">Interactive Inspections</h3>
          <div className="space-y-3">
            {checklist.map((item) => (
              <div
                key={item.id}
                className="p-3 rounded-lg bg-slate-800/60 border border-slate-700/60 space-y-2"
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold text-slate-200">{item.name}</span>
                  <button
                    onClick={() => handleToggle(item.id)}
                    className={`text-xs px-3 py-1.5 rounded-lg font-medium transition-all ${
                      item.isPassed
                        ? "bg-emerald-950 text-emerald-400 border border-emerald-800"
                        : "bg-red-950 text-red-400 border border-red-800"
                    }`}
                  >
                    {item.isPassed ? "Pass ✅" : "Fail / Defect ❌"}
                  </button>
                </div>

                {/* If the user marked the item as Failed, render a text description form for the defect */}
                {!item.isPassed && (
                  <div className="mt-2 space-y-1.5 animate-in fade-in slide-in-from-top-1 duration-150">
                    <div className="flex items-center space-x-1.5 text-red-400">
                      <AlertTriangle className="w-3.5 h-3.5" />
                      <span className="text-[10px] font-semibold uppercase tracking-wider">
                        VOR Critical Defect Detected
                      </span>
                    </div>
                    <textarea
                      value={item.defectDescription || ""}
                      onChange={(e) => handleDescriptionChange(item.id, e.target.value)}
                      placeholder="Please detail the issue (e.g., Tread depth below 1.6mm, nail in left outer wall)..."
                      className="w-full p-2 bg-slate-950 border border-red-900/60 focus:border-red-500 rounded-lg text-xs text-slate-300 focus:outline-none focus:ring-1 focus:ring-red-500"
                      rows={2}
                    />
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </WorkflowLayout>
  );
}
