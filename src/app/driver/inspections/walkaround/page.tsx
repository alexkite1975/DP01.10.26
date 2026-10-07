"use client";
import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { WorkflowLayout } from "@/components/layout/WorkflowLayout";
import { Camera, AlertTriangle, ArrowRight } from "lucide-react";

export default function WalkaroundPage() {
  const router = useRouter();
  const [vehicleId, setVehicleId] = useState("");
  const [checklist, setChecklist] = useState([
    { id: "tyres", name: "Tyres & Wheels Check", isPassed: true },
    { id: "brakes", name: "Brakes & Air Pressure", isPassed: true },
    { id: "lights", name: "Lights & Indicators", isPassed: true },
    { id: "mirrors", name: "Mirrors & Visibility", isPassed: true }
  ]);

  useEffect(() => {
    setVehicleId(localStorage.getItem("active_vehicle_id") || "1");
  }, []);

  const handleToggle = (id) => {
    setChecklist(p => p.map(item => item.id === id ? { ...item, isPassed: !item.isPassed } : item));
  };

  const handleDescChange = (id, text) => {
    setChecklist(p => p.map(item => item.id === id ? { ...item, defectDescription: text } : item));
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
        <button onClick={() => {
          localStorage.setItem("pending_inspection_items", JSON.stringify(checklist));
          router.push("/driver/inspections/signoff");
        }} className="w-full py-3 rounded-xl bg-cyan-600 hover:bg-cyan-500 font-semibold text-white text-xs">
          Continue to Sign-Off
        </button>
      }
    >
      <div className="space-y-4">
        <div className="p-4 rounded-xl bg-slate-900 border border-slate-800">
          <button type="button" className="w-full py-8 border-2 border-dashed border-slate-700 hover:border-cyan-500 rounded-xl flex flex-col items-center justify-center space-y-2 text-slate-400 bg-slate-950/50">
            <Camera className="w-8 h-8" />
            <span className="text-xs font-medium">Capture Defect Image</span>
          </button>
        </div>
        <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 space-y-3">
          <h3 className="text-sm font-medium text-slate-200">Checks Checklist</h3>
          <div className="space-y-3">
            {checklist.map(item => (
              <div key={item.id} className="p-3 rounded-lg bg-slate-800/60 border border-slate-700/60 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold text-slate-200">{item.name}</span>
                  <button type="button" onClick={() => handleToggle(item.id)} className={`text-xs px-3 py-1.5 rounded-lg font-medium ${item.isPassed ? "bg-emerald-950 text-emerald-400" : "bg-red-950 text-red-400"}`}>
                    {item.isPassed ? "Pass ✅" : "Fail ❌"}
                  </button>
                </div>
                {!item.isPassed && (
                  <textarea value={item.defectDescription || ""} onChange={e => handleDescChange(item.id, e.target.value)} placeholder="Describe the defect..." className="w-full p-2 bg-slate-950 border border-red-900/60 rounded-lg text-xs text-slate-300" rows={2} />
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </WorkflowLayout>
  );
}
