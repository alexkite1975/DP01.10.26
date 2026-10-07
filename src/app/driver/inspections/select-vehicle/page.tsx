"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { WorkflowLayout } from "@/components/layout/WorkflowLayout";
import { Truck, Navigation, ArrowRight } from "lucide-react";

export default function SelectVehiclePage() {
  const router = useRouter();
  const [selectedVehicle, setSelectedVehicle] = useState("");
  const [selectedTrailer, setSelectedTrailer] = useState("");

  const handleNextStep = () => {
    if (selectedVehicle) {
      // Store selected assets in session/localStorage for the next workflow steps
      localStorage.setItem("active_vehicle_id", selectedVehicle);
      localStorage.setItem("active_trailer_id", selectedTrailer);
      
      // Proceed seamlessly to Step 2: Walkaround check
      router.push("/driver/walkaround");
    }
  };

  return (
    <WorkflowLayout
      title="Select Vehicle & Trailer"
      subtitle="Step 1 of 4: Asset Allocation"
      currentStep={1}
      totalSteps={4}
      backRoute="/driver"
      nextRoute={selectedVehicle ? "/driver/walkaround" : undefined}
      footerActions={
        <button
          onClick={handleNextStep}
          disabled={!selectedVehicle}
          className={`w-full flex items-center justify-center space-x-2 py-3 px-4 rounded-xl font-semibold text-white shadow-lg transition-all active:scale-[0.98] ${
            selectedVehicle
              ? "bg-cyan-600 hover:bg-cyan-500 shadow-cyan-900/30"
              : "bg-slate-800 text-slate-500 cursor-not-allowed border border-slate-700"
          }`}
        >
          <span>Begin Walkaround Check</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      }
    >
      <div className="space-y-5">
        <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 space-y-4">
          {/* Active Tractor Selection */}
          <div className="space-y-2">
            <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider block">
              Assign Tractor Unit (HGV)
            </label>
            <div className="relative">
              <span className="absolute left-3 top-3.5 text-slate-500">
                <Truck className="w-5 h-5" />
              </span>
              <select
                value={selectedVehicle}
                onChange={(e) => setSelectedVehicle(e.target.value)}
                className="w-full pl-10 pr-4 py-3 bg-slate-950 border border-slate-700 rounded-xl text-sm text-slate-200 focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 transition-all appearance-none"
              >
                <option value="">-- Choose HGV Tractor Registration --</option>
                <option value="1">Scania R450 (GN21 XRO)</option>
                <option value="2">Volvo FH16 (DK19 FPT)</option>
                <option value="3">DAF XF 530 (LL22 YYK)</option>
              </select>
            </div>
          </div>

          {/* Active Trailer Selection */}
          <div className="space-y-2">
            <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider block">
              Assign Trailer ID (Optional)
            </label>
            <div className="relative">
              <span className="absolute left-3 top-3.5 text-slate-500">
                <Navigation className="w-5 h-5" />
              </span>
              <select
                value={selectedTrailer}
                onChange={(e) => setSelectedTrailer(e.target.value)}
                className="w-full pl-10 pr-4 py-3 bg-slate-950 border border-slate-700 rounded-xl text-sm text-slate-200 focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 transition-all appearance-none"
              >
                <option value="">-- No Trailer (Solo Cab) --</option>
                <option value="T101">Curtainside 45ft (TR-101)</option>
                <option value="T102">Reefer Temp-Controlled (TR-102)</option>
                <option value="T103">Double-Deck Box (TR-103)</option>
              </select>
            </div>
          </div>
        </div>

        <div className="p-4 rounded-xl bg-slate-900/50 border border-slate-800 text-center">
          <p className="text-xs text-slate-500 leading-relaxed">
            By selecting these assets, your walkaround checks and safety reports will be permanently logged against these vehicle records for DVSA auditing.
          </p>
        </div>
      </div>
    </WorkflowLayout>
  );
}
