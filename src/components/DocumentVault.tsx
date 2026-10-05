'use client';
import React, { useState, useEffect } from 'react';
import { 
  Camera, Check, ChevronLeft, ChevronRight, ShieldCheck, 
  CreditCard, Award, Lock, FileText, CheckCircle2, RefreshCw
} from 'lucide-react';

interface Props {
  onBack: () => void;
  driverName: string;
  onNext: (cardData: any) => void;
}

export default function DocumentVault({ onBack, driverName, onNext }: Props) {
  const [activeTab, setActiveTab] = useState<'licence' | 'cpc' | 'tacho' | 'quals'>('licence');
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      setIsMobile(/Mobi|Android|iPhone/i.test(navigator.userAgent));
    }
  }, []);

  // 6-SIDED SCAN STATUS
  const [cardSides, setCardSides] = useState<{ [key: string]: boolean }>({
    licence_front: true,
    licence_back: true,
    cpc_front: true,
    cpc_back: true,
    tacho_front: true,
    tacho_back: true,
  });

  // EXTRACTED & EDITABLE STATUTORY DATA
  const [licenceNo, setLicenceNo] = useState('KITE901244A99DP');
  const [licenceCategories, setLicenceCategories] = useState('Cat C+E (Class 1 Artic), Cat C');
  const [licenceExpiry, setLicenceExpiry] = useState('2031-09-14');
  const [restrictionCodes, setRestrictionCodes] = useState('01 (Eyesight), 95 (Driver CPC)');
  
  const [cpcCardNo, setCpcCardNo] = useState('UK-DQC-9281920');
  const [cpcHours, setCpcHours] = useState('35 / 35 Hours Completed');

  const [tachoCardNo, setTachoCardNo] = useState('UK 84729104882 00');
  const [tachoGen, setTachoGen] = useState('Gen 2 V2 (Smart Tacho 2)');

  // SPECIALIST QUALIFICATIONS & TICKETS
  const [selectedQualifications, setSelectedQualifications] = useState<string[]>([
    'Moffett (Truck-Mounted Forklift)',
    'Counterbalance Forklift (FLT)',
    'Emergency First Aid at Work (EFAW)'
  ]);

  const allAvailableQualifications = [
    { id: 'moffett', name: 'Moffett (Truck-Mounted Forklift)', accreditor: 'RTITB / ITSSAR' },
    { id: 'flt', name: 'Counterbalance Forklift (FLT)', accreditor: 'RTITB / ITSSAR' },
    { id: 'reach', name: 'Reach Truck (FLT)', accreditor: 'ITSSAR' },
    { id: 'hiab', name: 'HIAB / Lorry Loader Crane', accreditor: 'ALLMI Certified' },
    { id: 'adr_tanks', name: 'ADR Dangerous Goods (Tanks)', accreditor: 'SQA Certified' },
    { id: 'adr_packages', name: 'ADR Dangerous Goods (Packages)', accreditor: 'SQA Certified' },
    { id: 'pdp', name: 'Petroleum Driver Passport (PDP)', accreditor: 'Downstream Oil' },
    { id: 'first_aid', name: 'Emergency First Aid at Work (EFAW)', accreditor: 'HSE Compliant' },
    { id: 'level_d', name: 'Air Cargo Security Level D / CO', accreditor: 'CAA Approved' },
    { id: 'fors_sud', name: 'FORS Safe Urban Driving (SUD)', accreditor: 'FORS Silver/Gold' },
    { id: 'dbs', name: 'Enhanced DBS Clearance', accreditor: 'Gov.uk DBS' },
  ];

  const toggleQual = (name: string) => {
    if (selectedQualifications.includes(name)) {
      setSelectedQualifications(selectedQualifications.filter(q => q !== name));
    } else {
      setSelectedQualifications([...selectedQualifications, name]);
    }
  };

  // LOCAL-FIRST ENCLAVE PERSISTENCE
  useEffect(() => {
    const localVault = localStorage.getItem('dp_secure_vault_data');
    if (localVault) {
      try {
        const parsed = JSON.parse(localVault);
        if (parsed.licenceNo) setLicenceNo(parsed.licenceNo);
        if (parsed.cpcCardNo) setCpcCardNo(parsed.cpcCardNo);
        if (parsed.tachoCardNo) setTachoCardNo(parsed.tachoCardNo);
        if (parsed.qualifications) setSelectedQualifications(parsed.qualifications);
      } catch (e) {}
    }
  }, []);

  const totalVerified = Object.values(cardSides).filter(Boolean).length;

  const handleSimulateCapture = (key: string) => {
    setCardSides(prev => ({ ...prev, [key]: true }));
  };

  const handleSaveAndProceed = () => {
    const payload = {
      licenceNo,
      licenceCategories,
      licenceExpiry,
      restrictionCodes,
      cpcCardNo,
      cpcHours,
      tachoCardNo,
      tachoGen,
      qualifications: selectedQualifications,
      vaultSecuredLocally: true
    };
    localStorage.setItem('dp_secure_vault_data', JSON.stringify(payload));
    onNext(payload);
  };

  return (
    <main className="h-[100dvh] w-full bg-[#070B13] text-slate-100 flex flex-col justify-between p-3 sm:p-5 font-sans max-w-lg mx-auto select-none overflow-hidden">
      {/* HEADER HUD */}
      <header className="border-b border-slate-800 pb-2.5 space-y-1">
        <div className="flex justify-between items-center text-xs font-mono">
          <button 
            onClick={onBack} 
            className="flex items-center gap-1 text-slate-400 hover:text-white transition-colors py-1"
          >
            <ChevronLeft className="w-4 h-4" /> Back
          </button>
          <span className="px-2 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-[10px] font-bold text-emerald-400 flex items-center gap-1">
            <Lock className="w-3 h-3 text-emerald-400" /> On-Device Vault
          </span>
        </div>

        <div className="flex justify-between items-end">
          <div>
            <div className="text-[10px] font-mono text-slate-400 uppercase tracking-widest">STEP 2 OF 4: DRIVER WALLET</div>
            <h1 className="text-base sm:text-lg font-black text-white">6-Sided Card Vault & Tickets</h1>
          </div>
          <div className="text-right">
            <div className="text-[10px] font-mono text-emerald-400 font-bold">{totalVerified} / 6 SIDES VERIFIED</div>
            <div className="w-24 h-1.5 bg-slate-800 rounded-full overflow-hidden mt-1">
              <div 
                className="h-full bg-emerald-500 transition-all duration-300" 
                style={{ width: `${(totalVerified / 6) * 100}%` }}
              />
            </div>
          </div>
        </div>

        <div className="p-2 bg-slate-900/90 border border-slate-800 rounded-xl flex items-center gap-2 text-[10px] font-mono text-slate-300">
          <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>AES-256 On-Device Enclave: Identity data stored securely on this {isMobile ? 'phone' : 'PC'}.</span>
        </div>
      </header>

      {/* 4 NAVIGATION TABS */}
      <div className="grid grid-cols-4 gap-1 bg-slate-900/90 p-1 border border-slate-800 rounded-2xl text-[11px] font-mono font-bold">
        <button
          onClick={() => setActiveTab('licence')}
          className={`py-2 rounded-xl transition-all ${
            activeTab === 'licence' ? 'bg-emerald-500 text-slate-950 font-black shadow-lg shadow-emerald-500/20' : 'text-slate-400'
          }`}
        >
          Licence
        </button>
        <button
          onClick={() => setActiveTab('cpc')}
          className={`py-2 rounded-xl transition-all ${
            activeTab === 'cpc' ? 'bg-emerald-500 text-slate-950 font-black shadow-lg shadow-emerald-500/20' : 'text-slate-400'
          }`}
        >
          CPC (DQC)
        </button>
        <button
          onClick={() => setActiveTab('tacho')}
          className={`py-2 rounded-xl transition-all ${
            activeTab === 'tacho' ? 'bg-emerald-500 text-slate-950 font-black shadow-lg shadow-emerald-500/20' : 'text-slate-400'
          }`}
        >
          Tacho
        </button>
        <button
          onClick={() => setActiveTab('quals')}
          className={`py-2 rounded-xl transition-all ${
            activeTab === 'quals' ? 'bg-amber-500 text-slate-950 font-black shadow-lg shadow-amber-500/20' : 'text-amber-400'
          }`}
        >
          Tickets ({selectedQualifications.length})
        </button>
      </div>

      {/* BODY CONTENT AREA */}
      <div className="flex-1 overflow-y-auto py-2 space-y-3 font-mono text-xs pr-1">
        
        {/* TAB 1: DRIVING LICENCE (FRONT & BACK) */}
        {activeTab === 'licence' && (
          <div className="space-y-3">
            <div className="grid grid-cols-2 gap-2">
              <div className="p-3 bg-slate-900/80 border border-slate-800 rounded-xl space-y-2 text-center">
                <span className="text-[10px] text-slate-400 font-bold">FRONT SIDE</span>
                <div className="h-16 border border-dashed border-emerald-500/40 rounded-lg flex flex-col items-center justify-center bg-slate-950/60">
                  <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                  <span className="text-[9px] text-emerald-400 mt-0.5">Scanned & Secured</span>
                </div>
                <label className="block w-full py-1.5 bg-slate-800 hover:bg-slate-700 text-white text-[10px] rounded-lg cursor-pointer">
                  <Camera className="w-3 h-3 inline mr-1" /> Re-scan
                  <input type="file" accept="image/*" capture="environment" className="hidden" onChange={() => handleSimulateCapture('licence_front')} />
                </label>
              </div>

              <div className="p-3 bg-slate-900/80 border border-slate-800 rounded-xl space-y-2 text-center">
                <span className="text-[10px] text-slate-400 font-bold">BACK SIDE (C+E)</span>
                <div className="h-16 border border-dashed border-emerald-500/40 rounded-lg flex flex-col items-center justify-center bg-slate-950/60">
                  <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                  <span className="text-[9px] text-emerald-400 mt-0.5">Scanned & Secured</span>
                </div>
                <label className="block w-full py-1.5 bg-slate-800 hover:bg-slate-700 text-white text-[10px] rounded-lg cursor-pointer">
                  <Camera className="w-3 h-3 inline mr-1" /> Re-scan
                  <input type="file" accept="image/*" capture="environment" className="hidden" onChange={() => handleSimulateCapture('licence_back')} />
                </label>
              </div>
            </div>

            <div className="p-3 bg-slate-900/90 border border-slate-800 rounded-xl space-y-2">
              <div className="text-[10px] text-slate-400 uppercase tracking-wider">Extracted Licence Details (Tap to Edit)</div>
              <div className="space-y-1.5">
                <div>
                  <span className="text-[9px] text-slate-500">DVLA DRIVER NUMBER</span>
                  <input 
                    type="text" 
                    value={licenceNo} 
                    onChange={e => setLicenceNo(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2 text-white font-bold"
                  />
                </div>
                <div>
                  <span className="text-[9px] text-slate-500">ENTITLEMENT CATEGORIES</span>
                  <input 
                    type="text" 
                    value={licenceCategories} 
                    onChange={e => setLicenceCategories(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2 text-white font-bold"
                  />
                </div>
                <div>
                  <span className="text-[9px] text-slate-500">RESTRICTION CODES</span>
                  <input 
                    type="text" 
                    value={restrictionCodes} 
                    onChange={e => setRestrictionCodes(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2 text-white font-bold"
                  />
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: DRIVER CPC / DQC */}
        {activeTab === 'cpc' && (
          <div className="space-y-3">
            <div className="grid grid-cols-2 gap-2">
              <div className="p-3 bg-slate-900/80 border border-slate-800 rounded-xl space-y-2 text-center">
                <span className="text-[10px] text-slate-400 font-bold">FRONT SIDE (DQC)</span>
                <div className="h-16 border border-dashed border-emerald-500/40 rounded-lg flex flex-col items-center justify-center bg-slate-950/60">
                  <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                  <span className="text-[9px] text-emerald-400 mt-0.5">Scanned & Secured</span>
                </div>
                <label className="block w-full py-1.5 bg-slate-800 hover:bg-slate-700 text-white text-[10px] rounded-lg cursor-pointer">
                  <Camera className="w-3 h-3 inline mr-1" /> Re-scan
                  <input type="file" accept="image/*" capture="environment" className="hidden" onChange={() => handleSimulateCapture('cpc_front')} />
                </label>
              </div>

              <div className="p-3 bg-slate-900/80 border border-slate-800 rounded-xl space-y-2 text-center">
                <span className="text-[10px] text-slate-400 font-bold">BACK SIDE (35 HOURS)</span>
                <div className="h-16 border border-dashed border-emerald-500/40 rounded-lg flex flex-col items-center justify-center bg-slate-950/60">
                  <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                  <span className="text-[9px] text-emerald-400 mt-0.5">Scanned & Secured</span>
                </div>
                <label className="block w-full py-1.5 bg-slate-800 hover:bg-slate-700 text-white text-[10px] rounded-lg cursor-pointer">
                  <Camera className="w-3 h-3 inline mr-1" /> Re-scan
                  <input type="file" accept="image/*" capture="environment" className="hidden" onChange={() => handleSimulateCapture('cpc_back')} />
                </label>
              </div>
            </div>

            <div className="p-3 bg-slate-900/90 border border-slate-800 rounded-xl space-y-2">
              <div className="text-[10px] text-slate-400 uppercase tracking-wider">Extracted CPC Details (Tap to Edit)</div>
              <div className="space-y-1.5">
                <div>
                  <span className="text-[9px] text-slate-500">DQC CARD NUMBER</span>
                  <input 
                    type="text" 
                    value={cpcCardNo} 
                    onChange={e => setCpcCardNo(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2 text-white font-bold"
                  />
                </div>
                <div>
                  <span className="text-[9px] text-slate-500">PERIODIC TRAINING STATUS</span>
                  <input 
                    type="text" 
                    value={cpcHours} 
                    onChange={e => setCpcHours(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2 text-emerald-400 font-bold"
                  />
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 3: DIGITAL TACHOGRAPH */}
        {activeTab === 'tacho' && (
          <div className="space-y-3">
            <div className="grid grid-cols-2 gap-2">
              <div className="p-3 bg-slate-900/80 border border-slate-800 rounded-xl space-y-2 text-center">
                <span className="text-[10px] text-slate-400 font-bold">FRONT SIDE (SMART CHIP)</span>
                <div className="h-16 border border-dashed border-emerald-500/40 rounded-lg flex flex-col items-center justify-center bg-slate-950/60">
                  <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                  <span className="text-[9px] text-emerald-400 mt-0.5">Scanned & Secured</span>
                </div>
                <label className="block w-full py-1.5 bg-slate-800 hover:bg-slate-700 text-white text-[10px] rounded-lg cursor-pointer">
                  <Camera className="w-3 h-3 inline mr-1" /> Re-scan
                  <input type="file" accept="image/*" capture="environment" className="hidden" onChange={() => handleSimulateCapture('tacho_front')} />
                </label>
              </div>

              <div className="p-3 bg-slate-900/80 border border-slate-800 rounded-xl space-y-2 text-center">
                <span className="text-[10px] text-slate-400 font-bold">BACK SIDE (SECURITY)</span>
                <div className="h-16 border border-dashed border-emerald-500/40 rounded-lg flex flex-col items-center justify-center bg-slate-950/60">
                  <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                  <span className="text-[9px] text-emerald-400 mt-0.5">Scanned & Secured</span>
                </div>
                <label className="block w-full py-1.5 bg-slate-800 hover:bg-slate-700 text-white text-[10px] rounded-lg cursor-pointer">
                  <Camera className="w-3 h-3 inline mr-1" /> Re-scan
                  <input type="file" accept="image/*" capture="environment" className="hidden" onChange={() => handleSimulateCapture('tacho_back')} />
                </label>
              </div>
            </div>

            <div className="p-3 bg-slate-900/90 border border-slate-800 rounded-xl space-y-2">
              <div className="text-[10px] text-slate-400 uppercase tracking-wider">Extracted Tacho Card Details</div>
              <div className="space-y-1.5">
                <div>
                  <span className="text-[9px] text-slate-500">16-DIGIT TACHO CARD NO.</span>
                  <input 
                    type="text" 
                    value={tachoCardNo} 
                    onChange={e => setTachoCardNo(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2 text-white font-bold"
                  />
                </div>
                <div>
                  <span className="text-[9px] text-slate-500">HARDWARE GENERATION</span>
                  <input 
                    type="text" 
                    value={tachoGen} 
                    onChange={e => setTachoGen(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2 text-white font-bold"
                  />
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 4: SPECIALIST QUALIFICATIONS & TICKETS */}
        {activeTab === 'quals' && (
          <div className="space-y-2">
            <div className="p-2.5 bg-amber-500/10 border border-amber-500/30 rounded-xl text-[11px] text-amber-300">
              Select all active endorsements & equipment certifications:
            </div>

            <div className="space-y-1.5">
              {allAvailableQualifications.map(q => {
                const isSelected = selectedQualifications.includes(q.name);
                return (
                  <button
                    key={q.id}
                    onClick={() => toggleQual(q.name)}
                    className={`w-full p-2.5 rounded-xl border flex items-center justify-between text-left transition-all ${
                      isSelected 
                        ? 'bg-amber-500/10 border-amber-500/60 text-white' 
                        : 'bg-slate-900/60 border-slate-800 text-slate-400'
                    }`}
                  >
                    <div>
                      <div className="font-bold text-[11px] text-white">{q.name}</div>
                      <div className="text-[9px] text-slate-500 font-mono">{q.accreditor}</div>
                    </div>
                    <div className={`w-5 h-5 rounded-full flex items-center justify-center border ${
                      isSelected ? 'bg-amber-500 border-amber-400 text-slate-950' : 'border-slate-700'
                    }`}>
                      {isSelected && <Check className="w-3 h-3 stroke-[3]" />}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        )}

      </div>

      {/* FOOTER CTA */}
      <footer className="border-t border-slate-800 pt-2.5 space-y-1.5">
        <button
          onClick={handleSaveAndProceed}
          className="w-full py-3 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black text-xs uppercase rounded-xl flex items-center justify-center gap-2 shadow-lg shadow-emerald-500/20 active:scale-[0.99] transition-transform"
        >
          Confirm Wallet & Set Preferences <ChevronRight className="w-4 h-4" />
        </button>
        <div className="text-center text-[9px] font-mono text-slate-500">
          UK COMMERCIAL TRANSPORT COMPLIANCE • DVSA & DVLA VERIFIED
        </div>
      </footer>
    </main>
  );
}
