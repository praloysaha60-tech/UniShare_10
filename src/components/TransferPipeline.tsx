import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { TransferRequest, TransferStatus, Condition } from '../types';
import { 
  ArrowRightLeft, 
  Clock, 
  CheckCircle2, 
  Truck, 
  XCircle, 
  Printer, 
  QrCode, 
  ShieldCheck, 
  Check, 
  Search, 
  AlertCircle,
  Building,
  User,
  ArrowRight,
  FileText
} from 'lucide-react';

export const TransferPipeline: React.FC = () => {
  const { 
    requests, 
    approveRequest, 
    rejectRequest, 
    markPickedUp, 
    completeTransfer, 
    setSelectedGatePassRequest,
    currentUser,
    currentRole 
  } = useApp();

  const [activeStatusTab, setActiveStatusTab] = useState<TransferStatus | 'all'>('all');
  const [pipelineSearch, setPipelineSearch] = useState('');
  
  // Interactive action modal states
  const [actionModal, setActionModal] = useState<{
    type: 'approve' | 'reject' | 'pickup' | 'complete' | null;
    request: TransferRequest | null;
  }>({ type: null, request: null });

  const [actionNotes, setActionNotes] = useState('');
  const [scheduledPickupDate, setScheduledPickupDate] = useState('');
  const [pickupCarrier, setPickupCarrier] = useState('');
  const [receiptCondition, setReceiptCondition] = useState<Condition>('good');

  // Filter requests
  const filteredRequests = requests.filter(req => {
    if (activeStatusTab !== 'all' && req.status !== activeStatusTab) {
      return false;
    }
    if (pipelineSearch.trim()) {
      const q = pipelineSearch.toLowerCase();
      return (
        req.requestCode.toLowerCase().includes(q) ||
        req.resourceTitle.toLowerCase().includes(q) ||
        req.donorDept.toLowerCase().includes(q) ||
        req.requesterDept.toLowerCase().includes(q) ||
        req.requesterName.toLowerCase().includes(q) ||
        req.resourceAssetTag.toLowerCase().includes(q)
      );
    }
    return true;
  });

  const counts = {
    all: requests.length,
    pending: requests.filter(r => r.status === 'pending').length,
    approved: requests.filter(r => r.status === 'approved').length,
    'in-transit': requests.filter(r => r.status === 'in-transit').length,
    completed: requests.filter(r => r.status === 'completed').length,
    rejected: requests.filter(r => r.status === 'rejected').length
  };

  const getStepIndex = (status: TransferStatus) => {
    switch (status) {
      case 'pending': return 1;
      case 'approved': return 2;
      case 'in-transit': return 3;
      case 'completed': return 4;
      case 'rejected': return -1;
    }
  };

  const handleExecuteAction = () => {
    if (!actionModal.request) return;
    const req = actionModal.request;

    if (actionModal.type === 'approve') {
      approveRequest(req.id, actionNotes, scheduledPickupDate);
    } else if (actionModal.type === 'reject') {
      rejectRequest(req.id, actionNotes || 'Transfer request declined by donor department custodian.');
    } else if (actionModal.type === 'pickup') {
      markPickedUp(req.id, pickupCarrier || currentUser.name);
    } else if (actionModal.type === 'complete') {
      completeTransfer(req.id, receiptCondition, actionNotes);
    }

    setActionModal({ type: null, request: null });
    setActionNotes('');
    setScheduledPickupDate('');
    setPickupCarrier('');
  };

  return (
    <div className="space-y-5">
      {/* Pipeline Header */}
      <div className="bg-white rounded-xl p-5 border border-slate-200 shadow-2xs flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-lg bg-emerald-50 text-emerald-700">
              <ArrowRightLeft className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-slate-900">Transfer & Custody Management Pipeline</h2>
              <p className="text-xs text-slate-500">
                Live lifecycle tracking from custodian approval to physical transit and recipient inspection sign-off.
              </p>
            </div>
          </div>
        </div>

        {/* Search */}
        <div className="relative w-full md:w-72">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={pipelineSearch}
            onChange={(e) => setPipelineSearch(e.target.value)}
            placeholder="Search code, asset tag, department..."
            className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
          />
        </div>
      </div>

      {/* Pipeline Status Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto scrollbar-none pb-1">
        {[
          { id: 'all', label: 'All Transfers', count: counts.all },
          { id: 'pending', label: '1. Pending Approval', count: counts.pending },
          { id: 'approved', label: '2. Approved & Scheduled', count: counts.approved },
          { id: 'in-transit', label: '3. In-Transit', count: counts['in-transit'] },
          { id: 'completed', label: '4. Handover Complete', count: counts.completed },
          { id: 'rejected', label: 'Declined', count: counts.rejected },
        ].map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveStatusTab(tab.id as any)}
            className={`inline-flex items-center gap-2 px-3.5 py-2 rounded-lg text-xs font-semibold whitespace-nowrap transition-all ${
              activeStatusTab === tab.id
                ? 'bg-slate-900 text-white shadow-xs'
                : 'bg-white text-slate-600 hover:bg-slate-50 border border-slate-200'
            }`}
          >
            <span>{tab.label}</span>
            <span className={`px-1.5 py-0.2 rounded-full text-[10px] font-mono font-bold ${
              activeStatusTab === tab.id ? 'bg-slate-700 text-white' : 'bg-slate-100 text-slate-700'
            }`}>
              {tab.count}
            </span>
          </button>
        ))}
      </div>

      {/* Transfer Requests List */}
      <div className="space-y-4">
        {filteredRequests.length === 0 ? (
          <div className="bg-white rounded-xl p-10 text-center border border-slate-200">
            <Clock className="w-8 h-8 text-slate-300 mx-auto mb-2" />
            <p className="text-sm font-semibold text-slate-700">No transfer requests in this stage.</p>
            <p className="text-xs text-slate-400 mt-0.5">Switch tabs or request an item from the surplus catalog.</p>
          </div>
        ) : (
          filteredRequests.map(req => {
            const stepIdx = getStepIndex(req.status);
            const isDonorCustodian = currentUser.department === req.donorDept || currentRole === 'custodian' || currentRole === 'admin';
            const isRecipient = currentUser.name === req.requesterName || currentUser.department === req.requesterDept || currentRole === 'requester' || currentRole === 'admin';

            return (
              <div
                key={req.id}
                className="bg-white rounded-xl border border-slate-200 shadow-2xs hover:border-slate-300 transition-all p-5 space-y-4"
              >
                {/* Header Row: Codes & Visual Status */}
                <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-slate-100">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="font-mono text-xs font-black bg-slate-900 text-white px-2.5 py-1 rounded">
                      {req.requestCode}
                    </span>
                    <span className="font-mono text-xs font-semibold text-slate-600 bg-slate-100 px-2 py-1 rounded border border-slate-200">
                      Asset Tag: {req.resourceAssetTag}
                    </span>
                    {req.gatePassId && (
                      <button
                        onClick={() => setSelectedGatePassRequest(req)}
                        className="font-mono text-xs font-bold text-emerald-800 bg-emerald-50 hover:bg-emerald-100 px-2.5 py-1 rounded border border-emerald-200 flex items-center gap-1.5 transition-colors"
                      >
                        <QrCode className="w-3.5 h-3.5 text-emerald-600" />
                        <span>Pass: {req.gatePassId}</span>
                        <Printer className="w-3 h-3 text-emerald-700 ml-1" />
                      </button>
                    )}
                  </div>

                  <div className="text-xs font-semibold text-slate-500">
                    Required by: <strong className="text-slate-800 font-mono">{req.requiredByDate}</strong>
                  </div>
                </div>

                {/* Progress Stepper Visualizer */}
                {req.status !== 'rejected' && (
                  <div className="py-2 px-1">
                    <div className="flex items-center justify-between text-xs">
                      {[
                        { label: '1. Request', done: stepIdx >= 1 },
                        { label: '2. Approved', done: stepIdx >= 2 },
                        { label: '3. In-Transit', done: stepIdx >= 3 },
                        { label: '4. Received', done: stepIdx >= 4 },
                      ].map((step, i, arr) => (
                        <React.Fragment key={step.label}>
                          <div className="flex items-center gap-1.5">
                            <div className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold ${
                              step.done ? 'bg-emerald-600 text-white' : 'bg-slate-200 text-slate-500'
                            }`}>
                              {step.done ? '✓' : i + 1}
                            </div>
                            <span className={`text-[11px] font-medium hidden sm:inline ${
                              step.done ? 'text-slate-900 font-bold' : 'text-slate-400'
                            }`}>
                              {step.label}
                            </span>
                          </div>
                          {i < arr.length - 1 && (
                            <div className={`flex-1 h-0.5 mx-2 ${
                              arr[i + 1].done ? 'bg-emerald-600' : 'bg-slate-200'
                            }`}></div>
                          )}
                        </React.Fragment>
                      ))}
                    </div>
                  </div>
                )}

                {/* Main Transfer Flow Card */}
                <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-start">
                  {/* Item Description */}
                  <div className="md:col-span-5 space-y-1.5">
                    <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">Item Details</span>
                    <h3 className="font-bold text-slate-900 text-sm">{req.resourceTitle}</h3>
                    <p className="text-xs text-emerald-700 font-bold font-mono">
                      Quantity: {req.quantityRequested} {req.unit}
                    </p>
                    <p className="text-xs text-slate-600 leading-relaxed bg-slate-50 p-2.5 rounded-lg border border-slate-100">
                      "{req.reason}"
                    </p>
                  </div>

                  {/* Route & Custody */}
                  <div className="md:col-span-4 bg-slate-50 p-3 rounded-xl border border-slate-200/80 space-y-2 text-xs">
                    <div>
                      <span className="text-[10px] uppercase font-bold text-slate-400">Releasing (Donor Dept)</span>
                      <p className="font-bold text-slate-900">{req.donorDept}</p>
                      <p className="text-[11px] text-slate-500">{req.donorLocation} · Custodian: {req.donorCustodian}</p>
                    </div>

                    <div className="border-t border-slate-200/60 pt-1.5">
                      <span className="text-[10px] uppercase font-bold text-slate-400">Receiving (Recipient)</span>
                      <p className="font-bold text-slate-900">{req.requesterDept}</p>
                      <p className="text-[11px] text-slate-500">{req.intendedLocation} · {req.requesterName}</p>
                    </div>
                  </div>

                  {/* Logistics & Timestamps */}
                  <div className="md:col-span-3 text-xs text-slate-600 space-y-2 border-t md:border-t-0 md:border-l md:border-slate-100 md:pl-4 pt-2 md:pt-0">
                    <div>
                      <span className="text-[10px] text-slate-400 block font-semibold">Logistics Mode:</span>
                      <strong className="text-slate-800 capitalize font-medium">{req.pickupPreference.replace('-', ' ')}</strong>
                    </div>

                    {req.pickupScheduledFor && (
                      <div>
                        <span className="text-[10px] text-blue-700 block font-bold">Scheduled Pickup:</span>
                        <strong className="text-blue-950 font-semibold">{req.pickupScheduledFor}</strong>
                      </div>
                    )}

                    {req.completedAt && (
                      <div>
                        <span className="text-[10px] text-emerald-700 block font-bold">Delivery Signed Off:</span>
                        <strong className="text-emerald-950 font-semibold">{req.completedAt}</strong>
                      </div>
                    )}
                  </div>
                </div>

                {/* Custodian Notes / Rejection Notes */}
                {req.approvalNotes && (
                  <div className="p-3 bg-blue-50/80 border border-blue-200 rounded-lg text-xs text-blue-950 flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
                    <div>
                      <span className="font-bold">Custodian Pickup Instructions:</span>
                      <p className="mt-0.5">{req.approvalNotes}</p>
                    </div>
                  </div>
                )}

                {req.rejectionReason && (
                  <div className="p-3 bg-rose-50 border border-rose-200 rounded-lg text-xs text-rose-950 flex items-start gap-2">
                    <XCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
                    <div>
                      <span className="font-bold">Declined by Custodian ({req.reviewedBy}):</span>
                      <p className="mt-0.5">{req.rejectionReason}</p>
                    </div>
                  </div>
                )}

                {req.recipientNotes && (
                  <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-lg text-xs text-emerald-950 flex items-start gap-2">
                    <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                    <div>
                      <span className="font-bold">Inspection Sign-off ({req.recipientSignoffCondition} condition):</span>
                      <p className="mt-0.5">{req.recipientNotes}</p>
                    </div>
                  </div>
                )}

                {/* Primary Action Bar */}
                <div className="pt-2 flex flex-wrap items-center justify-between gap-3 border-t border-slate-100">
                  {/* Gate pass button */}
                  {(req.status === 'approved' || req.status === 'in-transit' || req.status === 'completed') ? (
                    <button
                      onClick={() => setSelectedGatePassRequest(req)}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold text-slate-800 bg-slate-100 hover:bg-slate-200 border border-slate-300 transition-colors"
                    >
                      <Printer className="w-3.5 h-3.5 text-slate-700" />
                      <span>Print Gate Pass ({req.gatePassId || 'GP-2026'})</span>
                    </button>
                  ) : <div />}

                  <div className="flex flex-wrap items-center gap-2">
                    {/* Stage 1: Pending -> Custodian can Approve or Reject */}
                    {req.status === 'pending' && (
                      <>
                        <button
                          onClick={() => setActionModal({ type: 'reject', request: req })}
                          className="px-3 py-1.5 rounded-lg text-xs font-semibold text-rose-700 hover:bg-rose-50 border border-rose-200 transition-colors"
                        >
                          Decline Request
                        </button>
                        <button
                          onClick={() => {
                            setActionModal({ type: 'approve', request: req });
                            setScheduledPickupDate(new Date(Date.now() + 86400000 * 3).toISOString().split('T')[0] + ' 10:00 AM');
                          }}
                          className="px-4 py-1.5 rounded-lg text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-700 shadow-xs transition-colors flex items-center gap-1.5"
                        >
                          <Check className="w-3.5 h-3.5" />
                          <span>Approve & Issue Gate Pass</span>
                        </button>
                      </>
                    )}

                    {/* Stage 2: Approved -> Pickup */}
                    {req.status === 'approved' && (
                      <button
                        onClick={() => {
                          setActionModal({ type: 'pickup', request: req });
                          setPickupCarrier(req.requesterName);
                        }}
                        className="px-4 py-1.5 rounded-lg text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 shadow-xs transition-colors flex items-center gap-1.5"
                      >
                        <Truck className="w-3.5 h-3.5" />
                        <span>Confirm Pickup / Mark In-Transit</span>
                      </button>
                    )}

                    {/* Stage 3: In-Transit -> Confirm Receipt */}
                    {req.status === 'in-transit' && (
                      <button
                        onClick={() => setActionModal({ type: 'complete', request: req })}
                        className="px-4 py-1.5 rounded-lg text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-700 shadow-xs transition-colors flex items-center gap-1.5"
                      >
                        <ShieldCheck className="w-3.5 h-3.5" />
                        <span>Confirm Receipt & Sign-off</span>
                      </button>
                    )}

                    {/* Stage 4: Completed */}
                    {req.status === 'completed' && (
                      <span className="text-xs font-semibold text-emerald-800 bg-emerald-50 px-3 py-1 rounded-md border border-emerald-200 flex items-center gap-1">
                        <Check className="w-3.5 h-3.5" /> Handover Complete
                      </span>
                    )}
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Interactive Action Transition Modal */}
      {actionModal.type && actionModal.request && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full border border-slate-200 shadow-2xl p-6 space-y-4 animate-in fade-in zoom-in-95">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="font-bold text-slate-900 text-sm">
                {actionModal.type === 'approve' && 'Approve Transfer & Issue Official Gate Pass'}
                {actionModal.type === 'reject' && 'Decline Transfer Request'}
                {actionModal.type === 'pickup' && 'Confirm Custody Pickup'}
                {actionModal.type === 'complete' && 'Recipient Delivery Inspection & Sign-off'}
              </h3>
              <button
                onClick={() => setActionModal({ type: null, request: null })}
                className="text-slate-400 hover:text-slate-700 text-xs font-bold"
              >
                ✕
              </button>
            </div>

            <div className="text-xs text-slate-600 bg-slate-50 p-3 rounded-lg border border-slate-200">
              <p className="font-bold text-slate-900">{actionModal.request.resourceTitle}</p>
              <p>Reference: {actionModal.request.requestCode} · {actionModal.request.quantityRequested} {actionModal.request.unit}</p>
            </div>

            {actionModal.type === 'approve' && (
              <div className="space-y-3 text-xs">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Pickup Scheduled Window</label>
                  <input
                    type="text"
                    value={scheduledPickupDate}
                    onChange={(e) => setScheduledPickupDate(e.target.value)}
                    placeholder="e.g., 2026-10-05 10:00 AM - 12:00 PM"
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg text-slate-900 font-medium"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Custodian Handling / Pickup Location Instructions</label>
                  <textarea
                    rows={3}
                    value={actionNotes}
                    onChange={(e) => setActionNotes(e.target.value)}
                    placeholder="Specify staging area, loading dock access, or packaging notes for recipient..."
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg text-slate-900"
                  />
                </div>
              </div>
            )}

            {actionModal.type === 'reject' && (
              <div className="space-y-3 text-xs">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Reason for Rejection *</label>
                  <textarea
                    rows={3}
                    required
                    value={actionNotes}
                    onChange={(e) => setActionNotes(e.target.value)}
                    placeholder="State reason (e.g., item already committed to lab, requested quantity exceeds surplus, etc.)..."
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg text-slate-900"
                  />
                </div>
              </div>
            )}

            {actionModal.type === 'pickup' && (
              <div className="space-y-3 text-xs">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Person / Courier Transporting Item</label>
                  <input
                    type="text"
                    value={pickupCarrier}
                    onChange={(e) => setPickupCarrier(e.target.value)}
                    placeholder="e.g., Campus Logistics Team or Elena Rostova (Chemistry)"
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg text-slate-900"
                  />
                </div>
              </div>
            )}

            {actionModal.type === 'complete' && (
              <div className="space-y-3 text-xs">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Received Condition Verification</label>
                  <select
                    value={receiptCondition}
                    onChange={(e) => setReceiptCondition(e.target.value as any)}
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg text-slate-800 font-medium"
                  >
                    <option value="new">New / Factory Condition</option>
                    <option value="excellent">Excellent Condition</option>
                    <option value="good">Good (As Described)</option>
                    <option value="fair">Fair (Usable with Wear)</option>
                  </select>
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Recipient Inspection Sign-off Notes</label>
                  <textarea
                    rows={3}
                    value={actionNotes}
                    onChange={(e) => setActionNotes(e.target.value)}
                    placeholder="Confirm item arrived intact, tested, and placed in target lab/room..."
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg text-slate-900"
                  />
                </div>
              </div>
            )}

            <div className="pt-3 flex items-center justify-end gap-2 border-t border-slate-100">
              <button
                onClick={() => setActionModal({ type: null, request: null })}
                className="px-3.5 py-2 rounded-lg text-xs font-semibold text-slate-600 hover:bg-slate-100"
              >
                Cancel
              </button>
              <button
                onClick={handleExecuteAction}
                className="px-4 py-2 rounded-lg text-xs font-bold text-white bg-slate-900 hover:bg-slate-800"
              >
                Confirm Action
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
