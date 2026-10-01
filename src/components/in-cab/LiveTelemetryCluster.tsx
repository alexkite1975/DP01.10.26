'use client';

import React, { useState, useEffect } from 'react';
import { Gauge, Compass, Fuel, Radio, Activity } from 'lucide-react';
import { VehicleTelemetryPing } from '@/types/telematics';

export default function LiveTelemetryCluster() {
  const [telemetry, setTelemetry] = useState<VehicleTelemetryPing>({
    vehicleId: 'DG21EDP',
    driverId: 'DRV-8492',
    timestamp: new Date().toISOString(),
    latitude: 52.3025,
    longitude: -1.1561,
    speedKmh: 88,
    headingDegrees: 164,
    ignition: 'ON',
    odometerKm: 142850,
    fuelLevelPercent: 78
  });

  const [isLiveStreaming, setIsLiveStreaming] = useState(true);

  useEffect(() => {
    if (!isLiveStreaming) return;
    const interval = setInterval(() => {
      setTelemetry(prev => {
        const speedDelta = (Math.random() - 0.48) * 2;
        const newSpeed = Math.max(0, Math.min(90, Math.round(prev.speedKmh + speedDelta)));
        const newHeading = (prev.headingDegrees + Math.round((Math.random() - 0.5) * 3) + 360) % 360;
        return {
          ...prev,
          speedKmh: newSpeed,
          headingDegrees: newHeading,
          latitude: prev.latitude + 0.0001,
          longitude: prev.longitude + 0.00008,
          timestamp: new Date().toISOString()
        };
      });
    }, 1000);
    return () => clearInterval(interval);
  }, [isLiveStreaming]);

  const speedMph = Math.round(telemetry.speedKmh * 0.621371);

  return (
    <div className="bg-[#0B101D] border border-slate-800 rounded-2xl p-4 sm:p-5 shadow-2xl space-y-4">
      <div className="flex items-center justify-between border-b border-slate-800 pb-3">
        <div className="flex items-center gap-2">
          <Activity className="w-5 h-5 text-emerald-400 animate-pulse" />
          <span className="font-mono text-xs font-bold text-slate-300 uppercase tracking-wider">
            1Hz High-Speed CAN Telematics Telemetry
          </span>
        </div>
        <button
          onClick={() => setIsLiveStreaming(!isLiveStreaming)}
          className={`px-3 py-1 rounded-full text-xs font-mono font-bold flex items-center gap-1.5 transition-colors ${
            isLiveStreaming ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40' : 'bg-slate-800 text-slate-400'
          }`}
        >
          <Radio className="w-3 h-3" />
          {isLiveStreaming ? '1Hz LIVE STREAM' : 'PAUSED'}
        </button>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="bg-slate-900/80 border border-slate-800/80 rounded-xl p-3 flex flex-col justify-between">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-[11px] font-mono uppercase">Road Speed</span>
            <Gauge className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="mt-2 text-center">
            <span className="text-3xl font-extrabold font-mono text-white tracking-tight">{speedMph}</span>
            <span className="text-xs text-slate-400 font-mono ml-1">MPH</span>
            <div className="text-[10px] text-slate-500 font-mono">({telemetry.speedKmh} km/h)</div>
          </div>
        </div>

        <div className="bg-slate-900/80 border border-slate-800/80 rounded-xl p-3 flex flex-col justify-between">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-[11px] font-mono uppercase">Heading</span>
            <Compass className="w-4 h-4 text-blue-400" />
          </div>
          <div className="mt-2 text-center">
            <span className="text-3xl font-extrabold font-mono text-white tracking-tight">{telemetry.headingDegrees}°</span>
            <div className="text-[10px] text-blue-400 font-mono font-bold">SOUTH (M1 London)</div>
          </div>
        </div>

        <div className="bg-slate-900/80 border border-slate-800/80 rounded-xl p-3 flex flex-col justify-between">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-[11px] font-mono uppercase">Diesel</span>
            <Fuel className="w-4 h-4 text-amber-400" />
          </div>
          <div className="mt-2 text-center">
            <span className="text-3xl font-extrabold font-mono text-white tracking-tight">{telemetry.fuelLevelPercent}%</span>
            <div className="w-full bg-slate-800 h-1.5 rounded-full mt-1.5 overflow-hidden">
              <div className="bg-amber-400 h-full rounded-full" style={{ width: `${telemetry.fuelLevelPercent}%` }} />
            </div>
          </div>
        </div>

        <div className="bg-slate-900/80 border border-slate-800/80 rounded-xl p-3 flex flex-col justify-between">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-[11px] font-mono uppercase">GPS Telemetry</span>
            <span className="inline-block w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
          </div>
          <div className="mt-2 font-mono text-[11px] text-slate-300 space-y-0.5">
            <div>Lat: <span className="text-emerald-400 font-bold">{telemetry.latitude.toFixed(4)}</span></div>
            <div>Lon: <span className="text-emerald-400 font-bold">{telemetry.longitude.toFixed(4)}</span></div>
            <div className="text-[10px] text-slate-500">{telemetry.odometerKm.toLocaleString()} km</div>
          </div>
        </div>
      </div>
    </div>
  );
}
