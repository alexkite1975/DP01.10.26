'use client';
import React, { useState } from 'react';
import {
  X,
  Shield,
  CheckCircle2,
  Lock,
  Globe,
  Key,
  Download,
  Building2,
  FileCheck
} from 'lucide-react';

interface EnterpriseSsoModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const EnterpriseSsoModal: React.FC<EnterpriseSsoModalProps> = ({ isOpen, onClose }) => {
  const [ssoProvider, setSsoProvider] = useState<'OKTA' | 'AZURE_AD' | 'GOOGLE_WORKSPACE'>('GOOGLE_WORKSPACE');
  const [googleOAuthConnected, setGoogleOAuthConnected] = useState<boolean>(true);
  const [dsarRequested, setDsarRequested] = useState<boolean>(false);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm overflow-y-auto">
      <div className="relative w-full max-w-2xl bg-slate-900 border border-slate-800 rounded-3xl shadow-2xl p-6 text-slate-100 max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-800">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-indigo-500/20 text-indigo-400 flex items-center justify-center">
              <Shield className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-white">Enterprise Identity &amp; Compliance</h2>
              <p className="text-xs text-slate-400">SAML 2.0, Google Business Profile OAuth &amp; GDPR DSAR</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-9 h-9 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white flex items-center justify-center transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* 1. Google Business Profile & OAuth Layer */}
        <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800 my-4 space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-blue-500/20 text-blue-400 flex items-center justify-center font-bold text-xs">
                G
              </div>
              <div>
                <h4 className="text-sm font-bold text-white">Google Business Profile OAuth 2.0</h4>
                <p className="text-xs text-slate-400">Verifies depot ownership &amp; synchronizes Places API hours</p>
              </div>
            </div>

            <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/40">
              {googleOAuthConnected ? 'VERIFIED OAUTH 2.0' : 'DISCONNECTED'}
            </span>
          </div>

          <div className="text-xs text-slate-400 bg-slate-900/60 p-2.5 rounded-xl border border-slate-800/80 font-mono">
            Connected Project: <strong className="text-cyan-300">drive-partners2</strong> (alexkite1975@gmail.com)
            <br />
            Scopes: business.manage, places.read, cloud-platform
          </div>
        </div>

        {/* 2. SAML 2.0 / OIDC Enterprise Single Sign-On */}
        <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800 my-4 space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <Key className="w-5 h-5 text-indigo-400" />
              <div>
                <h4 className="text-sm font-bold text-white">SAML 2.0 / OIDC Enterprise SSO</h4>
                <p className="text-xs text-slate-400">Corporate IdP login for hauliers, dispatchers &amp; drivers</p>
              </div>
            </div>
            <span className="text-[10px] font-mono text-indigo-300 bg-indigo-500/10 px-2 py-0.5 rounded border border-indigo-500/30">
              Active: Okta / Google
            </span>
          </div>

          <div className="grid grid-cols-2 gap-2 text-xs">
            <div className="p-2.5 bg-slate-900 rounded-xl border border-slate-800">
              <span className="text-slate-500 block text-[10px] font-mono">SAML ACS URL</span>
              <span className="text-slate-200 font-mono text-[10px] truncate block">
                https://drivepartners.app/auth/saml/acs
              </span>
            </div>
            <div className="p-2.5 bg-slate-900 rounded-xl border border-slate-800">
              <span className="text-slate-500 block text-[10px] font-mono">ENTITY ID / AUDIENCE</span>
              <span className="text-slate-200 font-mono text-[10px] truncate block">
                urn:drivepartners:sp:prod
              </span>
            </div>
          </div>
        </div>

        {/* 3. GDPR Data Subject Access Request (DSAR) */}
        <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800 my-4 flex items-center justify-between">
          <div>
            <div className="flex items-center gap-2">
              <FileCheck className="w-4 h-4 text-emerald-400" />
              <h4 className="text-xs font-bold text-white">GDPR DSAR Workflow</h4>
            </div>
            <p className="text-[11px] text-slate-400 mt-0.5">
              Download complete digital audit trail: GPS breadcrumbs, tacho logs &amp; claims.
            </p>
          </div>

          <button
            onClick={() => setDsarRequested(true)}
            className="px-3.5 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold rounded-xl transition-colors flex items-center gap-1.5"
          >
            <Download className="w-3.5 h-3.5" />
            {dsarRequested ? 'Archive Generating...' : 'Request DSAR Archive'}
          </button>
        </div>

        {/* Footer */}
        <div className="pt-4 border-t border-slate-800 flex justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl transition-colors font-bold text-xs"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
};
