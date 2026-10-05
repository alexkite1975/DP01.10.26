'use client';
import React, { useState } from 'react';
import { ChevronLeft, ChevronRight, Building2 } from 'lucide-react';

interface Props {
  onBack: () => void;
  onComplete: (fleetData: any) => void;
}

export default function FleetRegistration({ onBack, onComplete }: Props) {
  const [companyName, setCompanyName] = useState('Apex National Logistics Ltd');
  const [contactName, setContactName] = useState('Sarah Jenkins (Transport Manager)');
  const [email, setEmail] = useState('compliance@apexlogistics.co.uk');
  const [operatingLicenceNo, setOperatingLicenceNo] = useState('OF2039182');
  const [fleetSize, setFleetSize] = useState('25-50 HGVs');
  const [operatingCentre, setOperatingCentre] = useState('DIRFT North Hub (NN6 7GZ)');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onComplete({
      companyName,
      contactName,
      email,
      operatingLicenceNo,
      fleetSize,
      operatingCentre,
      role: 'fleet'
    });
  };

  return (
    <main className="h-[100dvh] w-full bg-[#070B13] text-slate-100 flex flex-col justify-between p-4 sm:p-6 font-sans max-w-md mx-auto select-none">
      <header className="flex justify-between items-center border-b border-slate-800 pb-3 text-xs font-mono shrink-0">
        <button onClick={onBack} className="text-slate-400 flex items-center gap-1">
          <ChevronLeft className="w-4 h-4" /> Back
        </button>
        <span className="font-bold text-blue-400">FLEET SETUP</span>
        <span className="text-slate-500 text-[10px]">O-Licence Reg</span>
      </header>

      <form onSubmit={handleSubmit} className="space-y-4 my-auto overflow-y-auto max-h-[82vh] pr-1 font-mono text-xs">
        <div>
          <h2 className="text-xl font-black text-white font-sans flex items-center gap-2">
            <Building2 className="w-5 h-5 text-blue-400" /> Register Fleet
          </h2>
          <p className="text-xs text-slate-400">Company profile & Operator Licence verification</p>
        </div>

        <div className="space-y-3 bg-slate-900 border border-slate-800 p-4 rounded-2xl">
          <div className="space-y-1">
            <label className="text-[10px] text-slate-400">COMPANY LEGAL NAME</label>
            <input
              type="text"
              value={companyName}
              onChange={e => setCompanyName(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-white"
              required
            />
          </div>

          <div className="space-y-1">
            <label className="text-[10px] text-slate-400">TRANSPORT MANAGER NAME</label>
            <input
              type="text"
              value={contactName}
              onChange={e => setContactName(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-white"
              required
            />
          </div>

          <div className="space-y-1">
            <label className="text-[10px] text-slate-400">OPERATING LICENCE NUMBER (O-LICENCE)</label>
            <input
              type="text"
              value={operatingLicenceNo}
              onChange={e => setOperatingLicenceNo(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-emerald-400 font-bold"
              required
            />
          </div>

          <div className="space-y-1">
            <label className="text-[10px] text-slate-400">FLEET SIZE</label>
            <select
              value={fleetSize}
              onChange={e => setFleetSize(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-white"
            >
              <option value="1-5 HGVs">1 - 5 Vehicles (Owner Driver / Small Fleet)</option>
              <option value="6-20 HGVs">6 - 20 Vehicles (Medium Fleet)</option>
              <option value="25-50 HGVs">25 - 50 Vehicles (National Haulier)</option>
              <option value="50+ HGVs">50+ Vehicles (Enterprise Logistics)</option>
            </select>
          </div>
        </div>

        <button
          type="submit"
          className="w-full py-4 bg-blue-500 hover:bg-blue-400 text-slate-950 font-black text-xs uppercase rounded-xl flex items-center justify-center gap-1.5 shadow-lg shadow-blue-500/20"
        >
          Verify O-Licence & Access Dashboard <ChevronRight className="w-4 h-4" />
        </button>
      </form>

      <footer className="text-center text-[10px] font-mono text-slate-600">HAULIER COMPLIANCE PORTAL</footer>
    </main>
  );
}
