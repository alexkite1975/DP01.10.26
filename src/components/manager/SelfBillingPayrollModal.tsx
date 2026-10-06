'use client';
import React, { useState, useEffect } from 'react';
import {
  CreditCard,
  Calendar,
  Clock,
  Shield,
  FileText,
  AlertTriangle,
  CheckCircle2,
  DollarSign,
  Download,
  Printer,
  X,
  ChevronRight,
  Zap,
  Info,
  Building,
  User,
  Percent
} from 'lucide-react';
import {
  SelfBillingInvoice,
  PaymentMethod,
  TimesheetShiftRecord,
  IR35Status
} from '../types';
import { initialPayrollInvoices } from '../data/mockMarketplaceData';

interface SelfBillingPayrollModalProps {
  isOpen: boolean;
  onClose: () => void;
  userRole?: 'driver' | 'business' | 'admin';
}

export const SelfBillingPayrollModal: React.FC<SelfBillingPayrollModalProps> = ({
  isOpen,
  onClose,
  userRole = 'business'
}) => {
  const [invoices, setInvoices] = useState<SelfBillingInvoice[]>(initialPayrollInvoices);
  const [selectedInvoice, setSelectedInvoice] = useState<SelfBillingInvoice | null>(
    initialPayrollInvoices[0]
  );
  const [showPrintModal, setShowPrintModal] = useState<boolean>(false);
  const [invoiceToPrint, setInvoiceToPrint] = useState<SelfBillingInvoice | null>(null);

  // Tuesday 17:00 cut-off countdown simulation
  const [cutoffTimeRemaining, setCutoffTimeRemaining] = useState<string>('31h 14m 20s');

  useEffect(() => {
    const timer = setInterval(() => {
      // Calculate countdown to next Tuesday 17:00
      const now = new Date();
      const target = new Date();
      // compute days until next Tuesday (day 2)
      const day = now.getDay();
      let daysUntilTuesday = (2 - day + 7) % 7;
      if (daysUntilTuesday === 0 && now.getHours() >= 17) {
        daysUntilTuesday = 7;
      }
      target.setDate(now.getDate() + daysUntilTuesday);
      target.setHours(17, 0, 0, 0);

      const diff = Math.max(0, target.getTime() - now.getTime());
      const hours = Math.floor(diff / (1000 * 60 * 60));
      const mins = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
      const secs = Math.floor((diff % (1000 * 60)) / 1000);
      setCutoffTimeRemaining(`${hours}h ${mins}m ${secs}s`);
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  if (!isOpen) return null;

  // Toggle payment method for an invoice (Direct Debit vs Net-30 Factoring)
  const handleTogglePaymentMethod = (invoiceNumber: string, method: PaymentMethod) => {
    setInvoices((prev) =>
      prev.map((inv) => {
        if (inv.invoiceNumber === invoiceNumber) {
          const isFactoring = method === 'NET_30_FACTORING';
          const factoringFee = isFactoring ? Number((inv.grossTotal * 0.035).toFixed(2)) : 0;
          const tax = inv.taxDeductionPAYE ? inv.taxDeductionPAYE + (inv.nicEmployeeDeduction || 0) : 0;
          const net = Number((inv.grossTotal - inv.agencyPlatformFee - tax - factoringFee).toFixed(2));
          return {
            ...inv,
            paymentMethod: method,
            factoringSurcharge: factoringFee,
            netPayable: net,
            status: isFactoring ? 'FUNDED_FACTORING' : 'APPROVED_FOR_PAYROLL'
          };
        }
        return inv;
      })
    );

    if (selectedInvoice && selectedInvoice.invoiceNumber === invoiceNumber) {
      setSelectedInvoice((prev) => {
        if (!prev) return null;
        const isFactoring = method === 'NET_30_FACTORING';
        const factoringFee = isFactoring ? Number((prev.grossTotal * 0.035).toFixed(2)) : 0;
        const tax = prev.taxDeductionPAYE ? prev.taxDeductionPAYE + (prev.nicEmployeeDeduction || 0) : 0;
        const net = Number((prev.grossTotal - prev.agencyPlatformFee - tax - factoringFee).toFixed(2));
        return {
          ...prev,
          paymentMethod: method,
          factoringSurcharge: factoringFee,
          netPayable: net,
          status: isFactoring ? 'FUNDED_FACTORING' : 'APPROVED_FOR_PAYROLL'
        };
      });
    }
  };

  const handleResolveDispute = (invoiceNumber: string) => {
    setInvoices((prev) =>
      prev.map((inv) =>
        inv.invoiceNumber === invoiceNumber
          ? {
              ...inv,
              status: 'APPROVED_FOR_PAYROLL',
              tuesdayDisputeCutoffMet: true,
              timesheets: inv.timesheets.map((ts) => ({
                ...ts,
                disputed: false,
                hoursApproved: ts.hoursClaimed,
                grossPay: ts.hoursClaimed * ts.hourlyRate
              }))
            }
          : inv
      )
    );
    if (selectedInvoice && selectedInvoice.invoiceNumber === invoiceNumber) {
      setSelectedInvoice((prev) =>
        prev
          ? {
              ...prev,
              status: 'APPROVED_FOR_PAYROLL',
              tuesdayDisputeCutoffMet: true,
              timesheets: prev.timesheets.map((ts) => ({
                ...ts,
                disputed: false,
                hoursApproved: ts.hoursClaimed,
                grossPay: ts.hoursClaimed * ts.hourlyRate
              }))
            }
          : null
      );
    }
  };

  const openPrintInvoice = (inv: SelfBillingInvoice) => {
    setInvoiceToPrint(inv);
    setShowPrintModal(true);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur-md p-3 sm:p-5 overflow-y-auto">
      <div className="relative w-full max-w-5xl rounded-2xl border border-slate-700 bg-slate-900 text-slate-100 shadow-2xl flex flex-col max-h-[92vh] overflow-hidden">
        
        {/* MODAL HEADER */}
        <div className="flex items-center justify-between border-b border-slate-800 bg-slate-950/80 px-5 py-4">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
              <CreditCard className="h-5 w-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base sm:text-lg font-bold text-white tracking-wide">
                  Friday Self-Billing Payroll & Factoring Surcharge Console
                </h2>
                <span className="rounded-full bg-emerald-500/20 px-2.5 py-0.5 text-xs font-semibold text-emerald-400 border border-emerald-500/30">
                  HMRC VAT Notice 700/62 Compliant
                </span>
              </div>
              <p className="text-xs text-slate-400">
                Automated Self-Billing Invoices • Tuesday 17:00 Dispute Window • Instant Factoring Payouts
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="rounded-lg p-2 text-slate-400 hover:bg-slate-800 hover:text-white transition"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* TUESDAY 17:00 CUT-OFF & METRICS BAR */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 p-4 bg-slate-950/40 border-b border-slate-800 text-xs">
          
          {/* Dispute Cut-Off Clock */}
          <div className="rounded-xl border border-amber-900/60 bg-amber-950/20 p-3 flex items-center justify-between">
            <div>
              <div className="text-amber-400 font-bold flex items-center gap-1.5">
                <Clock className="h-4 w-4 text-amber-400" /> Tuesday 17:00 Dispute Cut-Off
              </div>
              <div className="text-lg font-black font-mono text-white mt-1">
                {cutoffTimeRemaining}
              </div>
              <div className="text-[10px] text-slate-400">Uncontested hours auto-advance to Friday BACS</div>
            </div>
          </div>

          {/* Direct Debit vs Factoring Stats */}
          <div className="rounded-xl border border-slate-800 bg-slate-900/90 p-3">
            <div className="text-slate-400 font-medium">BACS Direct Debit Payroll</div>
            <div className="text-lg font-black text-white mt-1">Friday 11:00 GMT</div>
            <div className="text-[10px] text-slate-400">Standard 0% Surcharge BACS Run</div>
          </div>

          <div className="rounded-xl border border-blue-900/60 bg-blue-950/20 p-3">
            <div className="text-blue-400 font-bold flex items-center gap-1.5">
              <Zap className="h-4 w-4 text-blue-400" /> Net-30 Factoring Advance
            </div>
            <div className="text-lg font-black text-blue-300 mt-1">2-Hour Liquidity (3.5%)</div>
            <div className="text-[10px] text-blue-400">Immediate Working Capital Disbursal</div>
          </div>
        </div>

        {/* MAIN BODY: 2 COLUMN SPLIT */}
        <div className="flex-1 overflow-y-auto grid grid-cols-1 lg:grid-cols-12 divide-y lg:divide-y-0 lg:divide-x divide-slate-800">
          
          {/* INVOICE LIST (5 COLS) */}
          <div className="lg:col-span-5 p-4 space-y-3 overflow-y-auto max-h-[60vh] lg:max-h-none">
            <div className="flex items-center justify-between text-xs text-slate-400 pb-1">
              <span>Weekly Self-Billing Invoices ({invoices.length})</span>
              <span>Week Ending 25 Sep 2026</span>
            </div>

            {invoices.map((inv) => {
              const isSelected = selectedInvoice?.invoiceNumber === inv.invoiceNumber;
              const isDisputed = inv.status === 'DISPUTED' || !inv.tuesdayDisputeCutoffMet;

              return (
                <div
                  key={inv.invoiceNumber}
                  onClick={() => setSelectedInvoice(inv)}
                  className={`rounded-xl border p-3.5 transition-all cursor-pointer ${
                    isSelected
                      ? 'border-emerald-500 bg-slate-800/90 shadow-md'
                      : 'border-slate-800 bg-slate-900/80 hover:border-slate-700'
                  }`}
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-xs font-bold text-amber-400">
                          {inv.invoiceNumber}
                        </span>
                        <span
                          className={`rounded px-1.5 py-0.5 text-[10px] font-bold ${
                            inv.paymentMethod === 'NET_30_FACTORING'
                              ? 'bg-blue-500/20 text-blue-300 border border-blue-500/30'
                              : 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                          }`}
                        >
                          {inv.paymentMethod === 'NET_30_FACTORING' ? 'FACTORING (3.5%)' : 'DIRECT DEBIT'}
                        </span>
                      </div>
                      <div className="mt-1 text-xs font-bold text-white">{inv.driverName}</div>
                      <div className="text-[11px] text-slate-400">{inv.haulierName}</div>
                    </div>

                    <div className="text-right">
                      <div className="text-sm font-black text-emerald-400 font-mono">
                        £{inv.netPayable.toFixed(2)}
                      </div>
                      <div className="text-[10px] text-slate-400">
                        Gross: £{inv.grossTotal.toFixed(2)}
                      </div>
                      <div className="mt-1">
                        {inv.status === 'APPROVED_FOR_PAYROLL' ? (
                          <span className="text-[10px] font-bold text-emerald-400 flex items-center justify-end gap-1">
                            <CheckCircle2 className="h-3 w-3" /> Ready for BACS
                          </span>
                        ) : inv.status === 'FUNDED_FACTORING' ? (
                          <span className="text-[10px] font-bold text-blue-400 flex items-center justify-end gap-1">
                            <Zap className="h-3 w-3" /> Funded (Advance)
                          </span>
                        ) : (
                          <span className="text-[10px] font-bold text-amber-400 flex items-center justify-end gap-1">
                            <AlertTriangle className="h-3 w-3" /> Dispute Window
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                  {inv.timesheets.some((t) => t.disputed) && (
                    <div className="mt-2.5 rounded bg-amber-950/40 border border-amber-800/60 p-2 text-[11px] text-amber-200">
                      <div className="font-bold flex items-center gap-1 text-amber-300">
                        <AlertTriangle className="h-3 w-3 text-amber-400" /> Pending Timesheet Adjustment
                      </div>
                      <div className="text-[10px] text-slate-300 mt-0.5">
                        {inv.timesheets.find((t) => t.disputed)?.disputeReason}
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {/* INVOICE DETAILS & REMUNERATION CALCULATOR (7 COLS) */}
          <div className="lg:col-span-7 p-4 bg-slate-950/60 space-y-4 overflow-y-auto">
            {selectedInvoice ? (
              <div className="space-y-4">
                
                {/* HEADER ROW */}
                <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-sm font-bold text-amber-400">
                        {selectedInvoice.invoiceNumber}
                      </span>
                      <span className="rounded bg-slate-800 px-2 py-0.5 text-[10px] text-slate-300 font-mono">
                        Week Ending: {selectedInvoice.weekEnding}
                      </span>
                    </div>
                    <h3 className="text-base font-bold text-white mt-1">
                      {selectedInvoice.driverName}
                    </h3>
                    <p className="text-xs text-slate-400">
                      Client Haulier: {selectedInvoice.haulierName} (VAT: {selectedInvoice.haulierVatNumber})
                    </p>
                  </div>

                  <button
                    onClick={() => openPrintInvoice(selectedInvoice)}
                    className="rounded-lg bg-slate-800 hover:bg-slate-700 text-white font-bold px-3 py-1.5 text-xs transition border border-slate-700 flex items-center gap-1.5"
                  >
                    <FileText className="h-4 w-4 text-emerald-400" /> View HMRC Self-Bill
                  </button>
                </div>

                {/* PAYMENT METHOD / FACTORING TOGGLE */}
                <div className="rounded-xl border border-slate-800 bg-slate-900 p-3.5 space-y-2.5">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-white flex items-center gap-1.5">
                      <CreditCard className="h-4 w-4 text-amber-400" /> Settlement Rails & Liquidity
                    </span>
                    <span className="text-[10px] text-slate-400">Instant Switch Allowed Prior to Cut-Off</span>
                  </div>

                  <div className="grid grid-cols-2 gap-2 text-xs">
                    <button
                      onClick={() =>
                        handleTogglePaymentMethod(selectedInvoice.invoiceNumber, 'AUTOMATED_DIRECT_DEBIT')
                      }
                      className={`p-2.5 rounded-lg border text-left transition ${
                        selectedInvoice.paymentMethod === 'AUTOMATED_DIRECT_DEBIT'
                          ? 'border-emerald-500 bg-emerald-950/30 text-emerald-300'
                          : 'border-slate-800 bg-slate-950/60 text-slate-400 hover:bg-slate-800'
                      }`}
                    >
                      <div className="font-bold flex items-center gap-1 text-white">
                        <CheckCircle2 className="h-3.5 w-3.5 text-emerald-400" /> Automated Direct Debit
                      </div>
                      <div className="text-[10px] mt-1 text-slate-300">
                        Standard Friday BACS • 0% Surcharge
                      </div>
                    </button>

                    <button
                      onClick={() =>
                        handleTogglePaymentMethod(selectedInvoice.invoiceNumber, 'NET_30_FACTORING')
                      }
                      className={`p-2.5 rounded-lg border text-left transition ${
                        selectedInvoice.paymentMethod === 'NET_30_FACTORING'
                          ? 'border-blue-500 bg-blue-950/30 text-blue-300'
                          : 'border-slate-800 bg-slate-950/60 text-slate-400 hover:bg-slate-800'
                      }`}
                    >
                      <div className="font-bold flex items-center gap-1 text-white">
                        <Zap className="h-3.5 w-3.5 text-blue-400" /> Net-30 Factoring Advance
                      </div>
                      <div className="text-[10px] mt-1 text-slate-300">
                        Immediate 2h Payout • 3.5% Factoring Fee
                      </div>
                    </button>
                  </div>
                </div>

                {/* DISPUTE RESOLUTION BANNER IF ACTIVE */}
                {selectedInvoice.timesheets.some((t) => t.disputed) && (
                  <div className="rounded-xl border border-amber-700/60 bg-amber-950/30 p-3.5 space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="font-bold text-amber-300 text-xs flex items-center gap-1.5">
                        <AlertTriangle className="h-4 w-4 text-amber-400" /> Active Timesheet Dispute Logged
                      </div>
                      <button
                        onClick={() => handleResolveDispute(selectedInvoice.invoiceNumber)}
                        className="rounded bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold px-2.5 py-1 text-xs transition"
                      >
                        Approve & Settle All Hours
                      </button>
                    </div>
                    <p className="text-[11px] text-slate-300">
                      Haulier requested meal break adjustment. If not resolved before Tuesday 17:00,
                      uncontested hours will disburse on Friday automatically.
                    </p>
                  </div>
                )}

                {/* REMUNERATION FINANCIAL BREAKDOWN */}
                <div className="rounded-xl border border-slate-800 bg-slate-900 p-3.5 space-y-2 text-xs">
                  <h4 className="font-bold text-slate-200">
                    Self-Billing Remuneration Statement & Statutory Deductions
                  </h4>

                  <div className="divide-y divide-slate-800">
                    <div className="flex justify-between py-1.5 text-slate-300">
                      <span>Gross Timesheet Earnings:</span>
                      <span className="font-mono font-semibold">
                        £{selectedInvoice.grossTotal.toFixed(2)}
                      </span>
                    </div>

                    <div className="flex justify-between py-1.5 text-slate-300">
                      <span>Agency Platform Fee (10%):</span>
                      <span className="font-mono text-slate-400">
                        -£{selectedInvoice.agencyPlatformFee.toFixed(2)}
                      </span>
                    </div>

                    {selectedInvoice.ir35Status === 'INSIDE_IR35' && (
                      <div className="flex justify-between py-1.5 text-slate-300">
                        <span>Section 44 ITEPA Safe-Harbour PAYE/NIC Shield:</span>
                        <span className="font-mono text-slate-400">
                          -£{((selectedInvoice.taxDeductionPAYE || 0) + (selectedInvoice.nicEmployeeDeduction || 0)).toFixed(2)}
                        </span>
                      </div>
                    )}

                    {selectedInvoice.paymentMethod === 'NET_30_FACTORING' && (
                      <div className="flex justify-between py-1.5 text-blue-300 font-medium">
                        <span className="flex items-center gap-1">
                          <Zap className="h-3 w-3 text-blue-400" /> Net-30 Early Factoring Surcharge (3.5%):
                        </span>
                        <span className="font-mono text-blue-300">
                          -£{selectedInvoice.factoringSurcharge.toFixed(2)}
                        </span>
                      </div>
                    )}

                    <div className="flex justify-between py-1.5 text-slate-400 text-[11px]">
                      <span>HMRC VAT (20% Reverse Charge / Accounting):</span>
                      <span className="font-mono">£{selectedInvoice.vatAmount.toFixed(2)}</span>
                    </div>

                    <div className="flex justify-between py-2 text-white font-bold text-sm bg-slate-950/60 px-2 rounded mt-1.5">
                      <span>Net Disbursable Amount:</span>
                      <span className="text-emerald-400 font-mono text-base">
                        £{selectedInvoice.netPayable.toFixed(2)}
                      </span>
                    </div>
                  </div>
                </div>

                {/* SHIFT TIMESHEETS BREAKDOWN TABLE */}
                <div className="rounded-xl border border-slate-800 bg-slate-900 p-3.5 space-y-2">
                  <h4 className="text-xs font-bold text-slate-200">
                    Logged Shifts in this Billing Period
                  </h4>

                  <div className="divide-y divide-slate-800 text-xs">
                    {selectedInvoice.timesheets.map((ts) => (
                      <div key={ts.shiftId} className="py-2 flex items-center justify-between">
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="font-mono text-amber-400 font-bold">{ts.shiftRef}</span>
                            <span className="text-slate-400 text-[11px] font-mono">{ts.date}</span>
                            <span className="text-[10px] bg-slate-800 px-1.5 py-0.5 rounded text-slate-300 font-mono">
                              {ts.vehicleReg}
                            </span>
                          </div>
                          <div className="text-[11px] text-slate-400 mt-0.5">
                            {ts.hoursClaimed} hrs claimed • Rate: £{ts.hourlyRate.toFixed(2)}/hr
                          </div>
                        </div>

                        <div className="text-right">
                          <div className="font-mono font-bold text-emerald-400">
                            £{ts.grossPay.toFixed(2)}
                          </div>
                          {ts.disputed && (
                            <span className="text-[10px] font-bold text-amber-400">DISPUTED</span>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ) : (
              <div className="text-center py-20 text-slate-500">
                <CreditCard className="h-10 w-10 mx-auto text-slate-600 mb-2" />
                <p>Select an invoice to inspect self-billing remuneration</p>
              </div>
            )}
          </div>
        </div>

        {/* PRINTABLE HMRC SELF-BILLING INVOICE MODAL */}
        {showPrintModal && invoiceToPrint && (
          <div className="fixed inset-0 z-60 flex items-center justify-center bg-black/90 p-4">
            <div className="relative w-full max-w-3xl rounded-2xl border border-slate-600 bg-white text-slate-900 p-6 shadow-2xl max-h-[90vh] overflow-y-auto">
              
              {/* HEADER WITH PRINT ACTION */}
              <div className="flex items-center justify-between border-b-2 border-slate-900 pb-3 mb-4">
                <div>
                  <div className="text-[10px] font-black uppercase tracking-widest text-emerald-700">
                    HMRC VAT NOTICE 700/62 SELF-BILLING DOCUMENT
                  </div>
                  <h2 className="text-xl font-black text-slate-950 tracking-tight">
                    SELF-BILLED TAX INVOICE
                  </h2>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => window.print()}
                    className="rounded bg-slate-900 text-white px-3 py-1.5 text-xs font-bold hover:bg-slate-800 flex items-center gap-1"
                  >
                    <Printer className="h-3.5 w-3.5" /> Print Invoice
                  </button>
                  <button
                    onClick={() => setShowPrintModal(false)}
                    className="rounded p-1 text-slate-500 hover:text-slate-900"
                  >
                    <X className="h-5 w-5" />
                  </button>
                </div>
              </div>

              {/* STATUTORY HMRC SELF-BILLING DECLARATION */}
              <div className="rounded border border-slate-300 bg-slate-50 p-2.5 text-[10px] text-slate-700 mb-4 leading-relaxed">
                <strong>SELF-BILLING STATEMENT:</strong> The self-billee (Driver/Subcontractor) agrees to
                accept invoices raised on their behalf by the customer (Drive Partners / ReliefHGV
                Platform). The self-billee confirms they will not raise independent sales invoices for
                these services.
              </div>

              {/* INVOICE & ENTITY DATA */}
              <div className="grid grid-cols-2 gap-4 border border-slate-300 rounded p-4 text-xs mb-4">
                <div>
                  <div className="text-slate-500 text-[10px] font-bold uppercase">SUPPLIER (SELF-BILLEE)</div>
                  <div className="text-sm font-bold text-slate-900 mt-0.5">{invoiceToPrint.driverName}</div>
                  <div className="text-slate-600">NI Number: {invoiceToPrint.driverNiNumber}</div>
                  {invoiceToPrint.driverUtrOrCompany && (
                    <div className="text-slate-600">{invoiceToPrint.driverUtrOrCompany}</div>
                  )}
                  <div className="text-slate-600">
                    Tax Treatment: {invoiceToPrint.ir35Status === 'INSIDE_IR35' ? 'Section 44 PAYE Shield' : 'B2B Gross Subcontractor'}
                  </div>
                </div>

                <div>
                  <div className="text-slate-500 text-[10px] font-bold uppercase">CUSTOMER (HAULIER)</div>
                  <div className="text-sm font-bold text-slate-900 mt-0.5">{invoiceToPrint.haulierName}</div>
                  <div className="text-slate-600">VAT Registration: {invoiceToPrint.haulierVatNumber}</div>
                  <div className="mt-2 text-slate-500 text-[10px] font-bold uppercase">INVOICE METADATA</div>
                  <div className="font-mono text-slate-900 font-bold">
                    Invoice No: {invoiceToPrint.invoiceNumber}
                  </div>
                  <div className="text-slate-600">Week Ending: {invoiceToPrint.weekEnding}</div>
                </div>
              </div>

              {/* ITEMIZED SHIFTS TABLE */}
              <div className="border border-slate-300 rounded overflow-hidden text-xs mb-4">
                <table className="w-full text-left border-collapse">
                  <thead className="bg-slate-100 text-slate-800 text-[10px] uppercase font-bold">
                    <tr>
                      <th className="p-2 border-b border-slate-300">Shift Ref</th>
                      <th className="p-2 border-b border-slate-300">Date</th>
                      <th className="p-2 border-b border-slate-300">Vehicle</th>
                      <th className="p-2 border-b border-slate-300 text-right">Hours</th>
                      <th className="p-2 border-b border-slate-300 text-right">Rate</th>
                      <th className="p-2 border-b border-slate-300 text-right">Total (£)</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-200">
                    {invoiceToPrint.timesheets.map((ts) => (
                      <tr key={ts.shiftId}>
                        <td className="p-2 font-mono font-bold text-slate-800">{ts.shiftRef}</td>
                        <td className="p-2 text-slate-600 font-mono">{ts.date}</td>
                        <td className="p-2 font-mono text-slate-600">{ts.vehicleReg}</td>
                        <td className="p-2 text-right font-mono">{ts.hoursApproved}</td>
                        <td className="p-2 text-right font-mono">£{ts.hourlyRate.toFixed(2)}</td>
                        <td className="p-2 text-right font-mono font-bold">£{ts.grossPay.toFixed(2)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* TOTALS & TAX WITHHOLDING */}
              <div className="flex justify-end mb-4">
                <div className="w-72 space-y-1 text-xs border border-slate-300 rounded p-3 bg-slate-50">
                  <div className="flex justify-between">
                    <span className="text-slate-600">Gross Remuneration:</span>
                    <span className="font-mono font-bold">£{invoiceToPrint.grossTotal.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-slate-600">
                    <span>Platform Admin Fee:</span>
                    <span className="font-mono">-£{invoiceToPrint.agencyPlatformFee.toFixed(2)}</span>
                  </div>
                  {invoiceToPrint.paymentMethod === 'NET_30_FACTORING' && (
                    <div className="flex justify-between text-blue-700">
                      <span>Factoring Surcharge (3.5%):</span>
                      <span className="font-mono">-£{invoiceToPrint.factoringSurcharge.toFixed(2)}</span>
                    </div>
                  )}
                  <div className="flex justify-between text-slate-600">
                    <span>VAT (20% Reverse Charge):</span>
                    <span className="font-mono">£{invoiceToPrint.vatAmount.toFixed(2)}</span>
                  </div>
                  <div className="border-t border-slate-300 pt-1.5 flex justify-between text-sm font-black text-slate-900">
                    <span>Net Paid to Driver:</span>
                    <span className="text-emerald-700 font-mono">
                      £{invoiceToPrint.netPayable.toFixed(2)}
                    </span>
                  </div>
                </div>
              </div>

              <div className="border-t border-slate-300 pt-2 text-[10px] text-slate-500 font-mono flex justify-between">
                <span>HMRC VALIDATED • ELECTRONIC SETTLEMENT SYSTEM</span>
                <span>DISBURSAL STATUS: {invoiceToPrint.status}</span>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
