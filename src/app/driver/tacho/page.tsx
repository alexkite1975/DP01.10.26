"use client";
import React, { useState } from "react";
import { WorkflowLayout } from "@/components/layout/WorkflowLayout";
import { FileText, Camera, UploadCloud, CheckCircle2 } from "lucide-react";

export default function TachographPage() {
  const [fileUploaded, setFileUploaded] = useState(false);
  const [scanComplete, setScanComplete] = useState(false);

  return (
    <WorkflowLayout
      title="TachoScan AI & .DDD"
      subtitle="Compliance & hours of service logs"
      backRoute="/driver"
    >
      <div className="space-y-4">
        <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 space-y-4">
          <h2 className="text-sm font-semibold text-white">Digital Driver Card (.DDD)</h2>
          <div className="border-2 border-dashed border-slate-700 p-6 rounded-xl text-center bg-slate-950/50">
            <UploadCloud className="w-8 h-8 text-slate-500 mx-auto mb-2" />
            <p className="text-xs text-slate-400 mb-2">Drag and drop raw .DDD file here</p>
            <button
              onClick={() => setFileUploaded(true)}
              className="px-3 py-1.5 bg-slate-800 text-xs rounded-lg hover:bg-slate-700"
            >
              Select File
            </button>
          </div>
          {fileUploaded && (
            <p className="text-xs text-emerald-400 font-medium">✓ Card file uploaded successfully!</p>
          )}
        </div>
        <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 space-y-4">
          <h2 className="text-sm font-semibold text-white">Scan Thermal Printout</h2>
          <button
            onClick={() => setScanComplete(true)}
            className="w-full py-6 border-2 border-dashed border-slate-700 hover:border-cyan-500 rounded-xl flex flex-col items-center justify-center space-y-2 text-slate-400 bg-slate-950/50"
          >
            <Camera className="w-6 h-6" />
            <span className="text-xs font-medium">Capture Thermal Printout OCR</span>
          </button>
          {scanComplete && (
            <p className="text-xs text-emerald-400 font-medium">✓ OCR scan complete. Hours analyzed.</p>
          )}
        </div>
      </div>
    </WorkflowLayout>
  );
}
