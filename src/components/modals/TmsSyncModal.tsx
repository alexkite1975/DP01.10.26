'use client';
import React, { useState } from 'react';
import {
  X,
  RefreshCw,
  CheckCircle2,
  Server,
  Layers,
  ArrowRightLeft,
  ExternalLink,
  ShieldCheck,
  Clock
} from 'lucide-react';
import {
  INITIAL_TMS_CONNECTORS,
  TmsConnectorConfig,
  triggerTmsSync
} from '../../services/tmsIntegrationService';

interface TmsSyncModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const TmsSyncModal: React.FC<TmsSyncModalProps> = ({ isOpen, onClose }) => {
  const [connectors, setConnectors] = useState<TmsConnectorConfig[]>(INITIAL_TMS_CONNECTORS);
  const [syncingId, setSyncingId] = useState<string | null>(null);
  const [lastMessage, setLastMessage] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleSync = async (id: string) => {
    setSyncingId(id);
    const result = await triggerTmsSync(id);
    setConnectors((prev) =>
      prev.map((c) =>
        c.id === id ? { ...c, lastSyncTimestamp: result.timestamp, pendingInboundLoads: 0 } : c
      )
    );
    setLastMessage(result.message);
    setSyncingId(null);
    setTimeout(() => setLastMessage(null), 4000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm overflow-y-auto">
      <div className="relative w-full max-w-2xl bg-slate-900 border border-slate-800 rounded-3xl shadow-2xl p-6 text-slate-100 max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-800">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-blue-500/20 text-blue-400 flex items-center justify-center">
              <RefreshCw className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-white">ERP &amp; TMS Integrations</h2>
              <p className="text-xs text-slate-400">Pre-built connectors for SAP, Oracle &amp; Mandata</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-9 h-9 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white flex items-center justify-center transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {lastMessage && (
          <div className="my-4 p-3 bg-emerald-950/40 border border-emerald-800/60 rounded-xl text-emerald-300 text-xs flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 shrink-0" />
            <span>{lastMessage}</span>
          </div>
        )}

        {/* Connectors List */}
        <div className="space-y-3 my-5">
          {connectors.map((c) => {
            const isSyncing = syncingId === c.id;
            const isConnected = c.status === 'CONNECTED';

            return (
              <div
                key={c.id}
                className="bg-slate-950/80 p-4 rounded-2xl border border-slate-800 space-y-3"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-center text-slate-200">
                      <Server className="w-5 h-5 text-blue-400" />
                    </div>
                    <div>
                      <h3 className="text-sm font-bold text-white">{c.name}</h3>
                      <p className="text-xs text-slate-400 font-mono">{c.endpointUrl}</p>
                    </div>
                  </div>

                  <span
                    className={`text-[10px] font-black px-2 py-0.5 rounded font-mono ${
                      isConnected
                        ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                        : 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
                    }`}
                  >
                    {c.status}
                  </span>
                </div>

                <div className="grid grid-cols-3 gap-2 bg-slate-900/60 p-2.5 rounded-xl border border-slate-800/60 text-xs">
                  <div>
                    <span className="text-[10px] text-slate-500 block">PENDING INBOUND</span>
                    <strong className="text-white">{c.pendingInboundLoads} Loads</strong>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-500 block">OUTBOUND e-PODs</span>
                    <strong className="text-cyan-300">{c.syncedOutboundEpods} Synced</strong>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-500 block">AUTH METHOD</span>
                    <strong className="text-slate-300 font-mono text-[10px]">{c.authMethod}</strong>
                  </div>
                </div>

                <div className="flex items-center justify-between pt-1">
                  <div className="text-[11px] text-slate-500 flex items-center gap-1 font-mono">
                    <Clock className="w-3.5 h-3.5" />
                    Sync cycle: Every {c.syncFrequencyMinutes}m
                  </div>

                  <button
                    onClick={() => handleSync(c.id)}
                    disabled={isSyncing}
                    className="px-3.5 py-1.5 bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs rounded-xl flex items-center gap-1.5 transition-colors shadow-md shadow-blue-600/20"
                  >
                    <RefreshCw className={`w-3.5 h-3.5 ${isSyncing ? 'animate-spin' : ''}`} />
                    {isSyncing ? 'Syncing...' : 'Sync Now'}
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        {/* Footer */}
        <div className="pt-4 border-t border-slate-800 flex items-center justify-between text-xs text-slate-400">
          <span>Bi-directional REST &amp; EDIFACT AS2 Compatible</span>
          <button
            onClick={onClose}
            className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-xl transition-colors font-semibold"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
