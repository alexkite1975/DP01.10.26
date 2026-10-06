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
  const [statusType, setStatusType] = useState<"success" | "error" | "">("");

  const [vehicleId, setVehicleId] = useState("");
  const [items, setItems] = useState([]);

  useEffect(() => {
    // 1. Retrieve the session state prepared in Step 1 and Step 2
    const storedVehicleId = localStorage.getItem("active_vehicle_id") || "1";
    const storedItemsRaw = localStorage.getItem("pending_inspection_items") || "[]";

    setVehicleId(storedVehicleId);
    
    try {
      const parsedItems = JSON.parse(storedItemsRaw);
      // Format the items structure to match what our Postgres API route expects
      const formattedItems = parsedItems.map((item: any) => ({
        itemName: item.name,
        isPassed: item.isPassed,
        defectDescription: item.defectDescription || "",
        defectImageUrl: "", // Can link to GCS URLs later
        aiConfidenceScore: null
      }));
      setItems(formattedItems);
    } catch (e) {
      console.error("Error parsing checklist items: ", e);
    }
  }, []);

  const handleSubmit = async () => {
    setIsSubmitting(true);
    setStatusMessage("Verifying O-License compliance and saving to database...");
    setStatusType("");

    try {
      // Mock SHA-256 signature hash generation for O-License tampering audits
      const signatureHash = "sha256-" + btoa(vehicleId + "-driver-signed-" + Date.now()).substring(0, 32);

      const payload = {
        vehicleId: parseInt(vehicleId, 10),
        driverId: "driver-current-session", // Replace with auth session data in production
        signatureHash,
        items,
      };

      const response = await fetch("/api/inspections", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      const data = await response.json();

      if (response.ok) {
        setStatusType("success");
        if (data.grounded) {
          setStatusMessage("⚠️ Inspection Submitted. Critical defects detected! Vehicle has been grounded as VOR (Vehicle Off Road).");
        } else {
          setStatusMessage("✅ Inspection submitted successfully. Vehicle is fully cleared for transport.");
        }

        // Clean local state and return to dashboard after 3 seconds
        setTimeout(() => {
          localStorage.removeItem("pending_inspection_items");
          router.push("/driver");
        }, 3500);

      } else {
        throw new Error(data.error || "Failed to submit report.");
      }
    } catch (err: any) {
      setStatusType("error");
      setStatusMessage(`Error saving report: ${err.message}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <WorkflowLayout
      title="Driver Sign-Off"
      subtitle={`Ready to submit report for Vehicle ID: ${vehicleId}`}
      currentStep={3}
      totalSteps={4}
      backRoute="/driver/inspections/walkaround"
      nextRoute="/driver"
      footerActions={
        <button
          onClick={handleSubmit}
          disabled={!signed || isSubmitting}
          className={`w-full py-3 px-4 rounded-xl font-semibold text-white shadow-lg transition-all active:scale-[0.98] ${
            signed && !isSubmitting
              ? "bg-emerald-600 hover:bg-emerald-500 shadow-emerald-900/30"
              : "bg-slate-800 text-slate-500 cursor-not-allowed border border-slate-700"
          }`}
        >
          {isSubmitting ? "Submitting Report..." : "Submit DVSA Declaration & Start Shift"}
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
            I confirm that I have carried out a full walkaround check of vehicle in accordance with DVSA guidelines. No unaddressed safety-critical defects exist.
          </p>
        </div>

        {/* Declaration Checkbox */}
        <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 space-y-3">
          <label className="flex items-center space-x-3 cursor-pointer">
            <input
              type="checkbox"
              checked={signed}
              onChange={(e) => setSigned(e.target.checked)}
              disabled={isSubmitting}
              className="rounded border-slate-600 text-cyan-600 focus:ring-cyan-500 w-5 h-5"
            />
            <span className="text-xs text-slate-300 font-medium">
              I certify this report as a true statement and record my digital signature.
            </span>
          </label>
        </div>

        {/* Real-time Submission Status Message Banner */}
        {statusMessage && (
          <div
            className={`p-4 rounded-xl border flex items-start space-x-3 animate-in fade-in slide-in-from-bottom-1 duration-150 ${
              statusType === "success"
                ? "bg-emerald-950/60 border-emerald-800 text-emerald-400"
                : statusType === "error"
                ? "bg-red-950/60 border-red-950 text-red-400"
                : "bg-slate-900 border-slate-800 text-cyan-400"
            }`}
          >
            {statusType === "success" ? (
              <CheckCircle2 className="w-5 h-5 mt-0.5 flex-shrink-0" />
            ) : statusType === "error" ? (
              <AlertCircle className="w-5 h-5 mt-0.5 flex-shrink-0" />
            ) : (
              <div className="animate-spin w-5 h-5 border-2 border-cyan-500 border-t-transparent rounded-full flex-shrink-0" />
            )}
            <p className="text-xs font-medium leading-relaxed">{statusMessage}</p>
          </div>
        )}
      </div>
    </WorkflowLayout>
  );
}
