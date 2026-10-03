import React from 'react';
import { useApp } from '../context/AppContext';
import { 
  X, 
  Printer, 
  Download, 
  QrCode, 
  ShieldCheck, 
  Building, 
  MapPin, 
  Clock, 
  FileText, 
  Check, 
  ArrowRight,
  Stamp
} from 'lucide-react';

export const GatePassModal: React.FC = () => {
  const { selectedGatePassRequest, setSelectedGatePassRequest } = useApp();

  if (!selectedGatePassRequest) return null;

  const req = selectedGatePassRequest;
  const gatePassNum = req.gatePassId || 'GP-2026-088';

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/70 backdrop-blur-xs flex items-center justify-center p-4">
      <div 
        className="bg-white rounded-2xl max-w-2xl w-full border border-slate-200 shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 my-8"
        role="dialog"
        aria-modal="true"
      >
        {/* Top Control Bar (Hidden when printing) */}
        <div className="no-print flex items-center justify-between p-4 px-6 border-b border-slate-200 bg-slate-900 text-white">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-5 h-5 text-emerald-400" />
            <div>
              <span className="font-bold text-xs uppercase tracking-wider text-emerald-400">Official Campus Gate Pass</span>
              <p className="text-xs text-slate-300">Authorization for inter-facility asset movement</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="px-3.5 py-1.5 rounded-lg text-xs font-bold bg-emerald-600 hover:bg-emerald-500 text-white flex items-center gap-1.5 transition-colors shadow-xs"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Print Gate Pass</span>
            </button>
            <button
              onClick={() => setSelectedGatePassRequest(null)}
              className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Printable Certificate / Voucher Container */}
        <div id="printable-gate-pass" className="p-8 bg-white text-slate-900 space-y-6">
          {/* Institutional Document Header */}
          <div className="border-b-2 border-slate-900 pb-5 flex items-start justify-between">
            <div className="space-y-1">
              <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-slate-500">
                <span>University Campus Facilities & Property Management</span>
              </div>
              <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
                SURPLUS PROPERTY TRANSFER GATE PASS
              </h1>
              <p className="text-xs text-slate-600">
                Authorization for Inter-Departmental Custody Handover & Transit
              </p>
            </div>

            {/* Document Badges */}
            <div className="text-right shrink-0">
              <span className="font-mono text-xs font-extrabold bg-slate-900 text-white px-2.5 py-1 rounded block mb-1">
                PASS #{gatePassNum}
              </span>
              <span className="font-mono text-[11px] text-slate-500">
                Ref: {req.requestCode}
              </span>
            </div>
          </div>

          {/* QR Code and Security Verification Row */}
          <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              {/* Mock QR Matrix */}
              <div className="w-20 h-20 bg-white p-2 border-2 border-slate-900 rounded-lg shrink-0 flex flex-col items-center justify-center">
                <QrCode className="w-14 h-14 text-slate-900" />
                <span className="text-[8px] font-mono text-slate-400 mt-0.5">VERIFIED</span>
              </div>
              <div className="text-xs space-y-0.5">
                <p className="font-bold text-slate-900">Campus Security Transit Clearance</p>
                <p className="text-slate-600">Scan at facility gate or loading dock inspection point.</p>
                <p className="text-[11px] text-emerald-800 font-semibold mt-1">
                  ✓ Pre-Approved by Department Resource Custodian
                </p>
              </div>
            </div>

            <div className="text-center sm:text-right border-t sm:border-t-0 pt-2 sm:pt-0 border-slate-200 shrink-0">
              <span className="text-[10px] uppercase font-bold text-slate-400">Scheduled Transit Window:</span>
              <p className="text-xs font-bold text-slate-900">{req.pickupScheduledFor || 'Immediate Transit'}</p>
              <span className="text-[10px] text-slate-500">Authorized Carrier: {req.pickedUpBy || req.pickupPreference}</span>
            </div>
          </div>

          {/* Transfer Origin and Destination Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div className="p-4 rounded-xl border border-slate-200 bg-slate-50/50 space-y-1.5">
              <span className="text-[10px] uppercase font-bold text-blue-800 tracking-wider">
                1. RELEASING FACILITY (DONOR)
              </span>
              <p className="font-bold text-sm text-slate-900">{req.donorDept}</p>
              <p className="text-slate-600">Location: {req.donorLocation}</p>
              <p className="text-slate-600">Custodian: <strong className="text-slate-800">{req.donorCustodian}</strong></p>
              <p className="text-slate-500">{req.donorEmail}</p>
            </div>

            <div className="p-4 rounded-xl border border-slate-200 bg-slate-50/50 space-y-1.5">
              <span className="text-[10px] uppercase font-bold text-emerald-800 tracking-wider">
                2. RECEIVING FACILITY (RECIPIENT)
              </span>
              <p className="font-bold text-sm text-slate-900">{req.requesterDept}</p>
              <p className="text-slate-600">Location: {req.intendedLocation}</p>
              <p className="text-slate-600">Recipient: <strong className="text-slate-800">{req.requesterName}</strong></p>
              <p className="text-slate-500">{req.requesterEmail}</p>
            </div>
          </div>

          {/* Asset Specifications Table */}
          <div>
            <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider block mb-1.5">
              Authorized Equipment Specifications
            </span>
            <table className="w-full text-xs border border-slate-200 rounded-lg overflow-hidden">
              <thead className="bg-slate-100 text-slate-700 font-bold border-b border-slate-200">
                <tr>
                  <th className="p-2.5 text-left">Asset Tag / Barcode</th>
                  <th className="p-2.5 text-left">Description / Equipment Title</th>
                  <th className="p-2.5 text-center">Quantity</th>
                  <th className="p-2.5 text-left">Category</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                <tr className="bg-white">
                  <td className="p-2.5 font-mono font-bold text-slate-900">{req.resourceAssetTag}</td>
                  <td className="p-2.5 font-medium text-slate-800">
                    {req.resourceTitle}
                    <div className="text-[10px] text-slate-500 mt-0.5">Purpose: {req.academicPurpose}</div>
                  </td>
                  <td className="p-2.5 text-center font-bold text-slate-900">{req.quantityRequested} {req.unit}</td>
                  <td className="p-2.5 text-slate-600 capitalize">{req.category.replace('-', ' ')}</td>
                </tr>
              </tbody>
            </table>
          </div>

          {/* Compliance & Handling Guidelines */}
          <div className="p-3 bg-slate-50 rounded-lg border border-slate-200 text-[11px] text-slate-600 space-y-1">
            <span className="font-bold text-slate-800">Campus Logistics Compliance & Liability Notice:</span>
            <p>
              This document serves as physical permission to transport the above-listed university surplus items between campus facilities. Reallocated items remain university property and are transferred to the recipient department's capital inventory ledger upon final inspection sign-off.
            </p>
          </div>

          {/* Official Signatures Row */}
          <div className="pt-6 border-t border-slate-200 grid grid-cols-3 gap-6 text-xs text-slate-600">
            <div className="border-t border-slate-900 pt-2">
              <span className="font-semibold text-slate-800 block">Donor Custodian Sign-off</span>
              <p className="text-[11px] text-slate-500 mt-0.5">{req.donorCustodian}</p>
              <p className="text-[10px] font-mono text-slate-400">Date: {req.reviewedAt || 'Approved'}</p>
            </div>

            <div className="border-t border-slate-900 pt-2">
              <span className="font-semibold text-slate-800 block">Transport Carrier Signature</span>
              <p className="text-[11px] text-slate-500 mt-0.5">{req.pickedUpBy || 'Authorized Courier'}</p>
              <p className="text-[10px] font-mono text-slate-400">Date: {req.pickedUpAt || 'In Transit'}</p>
            </div>

            <div className="border-t border-slate-900 pt-2">
              <span className="font-semibold text-slate-800 block">Recipient Inspection & Acceptance</span>
              <p className="text-[11px] text-slate-500 mt-0.5">{req.requesterName}</p>
              <p className="text-[10px] font-mono text-slate-400">Condition Verified: {req.recipientSignoffCondition || 'Pending'}</p>
            </div>
          </div>
        </div>

        {/* Modal Footer Controls (Hidden when printing) */}
        <div className="no-print p-4 px-6 border-t border-slate-200 bg-slate-50 flex items-center justify-between">
          <span className="text-xs text-slate-500">
            Certified tamper-evident digital gate pass generated by UniShare
          </span>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setSelectedGatePassRequest(null)}
              className="px-4 py-2 rounded-lg text-xs font-semibold text-slate-600 hover:bg-slate-200 transition-colors"
            >
              Close
            </button>
            <button
              onClick={handlePrint}
              className="px-4 py-2 rounded-lg text-xs font-bold text-white bg-slate-900 hover:bg-slate-800 transition-colors flex items-center gap-1.5"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Print / Save as PDF</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
