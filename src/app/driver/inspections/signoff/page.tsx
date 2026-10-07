"use client";
import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { WorkflowLayout } from "@/components/layout/WorkflowLayout";
import { ShieldCheck, CheckCircle2, AlertCircle } from "lucide-react";

export default function SignOffPage() {
  const router = useRouter();
  const [signed, setSigned] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [statusMessage, setStatusMessage] = useState("");
  const [statusType, setStatusType] = useState("");
  const [vehicleId, setVehicleId] = useState("");
  const [items, setItems] = useState([]);

  useEffect(() => {
    const storedVehicleId = localStorage.getItem("active_vehicle_id") || "1";
    const storedItemsRaw = localStorage.getItem("pending_inspection_items") || "[]";
    setVehicleId(storedVehicleId);
    
    try {
      const parsedItems = JSON.parse(storedItemsRaw);
      const formattedItems = parsedItems.map((item: any) => ({
        itemName: item.name,
        isPassed: item.isPassed,
        defectDescription: item.defectDescription || "",
        defectImageUrl: "",
        aiConfidenceScore: null
      }));
      setItems(formattedItems);
    } catch (e) {
      console.error(e);
    }
  }, []);

  const handleSubmit = async () => {
    setIsSubmitting(true);
    setStatusMessage("Submitting compliance checks...");
    setStatusType("");
    try {
      const signatureHash = "sha256-" + btoa(vehicleId + "-signed-" + Date.now()).substring(0, 16);
      const response = await fetch("/api/inspections", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          vehicleId: parseInt(vehicleId, 10),
          driverId: "driver-session",
          signatureHash,
          items,
        }),
      });
      const data = await response.json();
      if (response.ok) {
        setStatusType("success");
        setStatusMessage(data.grounded ? "⚠️ Grounded (VOR)!" : "✅ Cleared!");
        setTimeout(() => {
          localStorage.removeItem("pending_inspection_items");
          router.push("/driver");
        }, 2000);
      } else {
        throw new Error(data.error);
      }
    } catch (err: any) {
      setStatusType("error");
      setStatusMessage(err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <WorkflowLayout
      title="Driver Sign-Off"
      subtitle={`Ready to submit report`}
      currentStep={3}
      totalSteps={4}
      backRoute="/driver/inspections/walkaround"
      nextRoute="/driver"
      footerActions={
        <button
          onClick={handleSubmit}
          disabled={!signed || isSubmitting}
          className={`w-full py-3 rounded-xl font-semibold text-white ${
            signed && !isSubmitting ? "bg-emerald-600" : "bg-slate-800 text-slate-500 cursor-not-allowed"
          }`}
        >
          {isSubmitting ? "Submitting..." : "Submit DVSA Declaration"}
        </button>
      }
    >
      <div className="space-y-4">
        <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 text-center">
          <ShieldCheck className="w-8 h-8 text-cyan-400 mx-auto mb-2" />
          <p className="text-xs text-slate-400">
            I certify that I have checked the vehicle.
          </p>
        </div>
        <div className="p-4 rounded-xl bg-slate-900 border border-slate-800">
          <label className="flex items-center space-x-3 cursor-pointer">
            <input
              type="checkbox"
              checked={signed}
              onChange={(e) => setSigned(e.target.checked)}
              className="rounded text-cyan-600"
            />
            <span className="text-xs text-slate-300">I certify this statement.</span>
          </label>
        </div>
        {statusMessage && (
          <div className="p-4 rounded-xl border text-xs text-center">
            {statusMessage}
          </div>
        )}
      </div>
    </WorkflowLayout>
  );
}
