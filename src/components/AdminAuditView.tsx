import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { CATEGORIES, CAMPUS_DEPARTMENTS } from '../data/mockData';
import { 
  ShieldCheck, 
  Search, 
  Filter, 
  FileText, 
  CheckCircle2, 
  AlertTriangle, 
  Clock, 
  Tag, 
  Building, 
  User, 
  ArrowRightLeft,
  Settings,
  Scale,
  Download
} from 'lucide-react';

export const AdminAuditView: React.FC = () => {
  const { auditLogs, items, requests, currentRole } = useApp();

  const [searchLog, setSearchLog] = useState('');
  const [selectedActionType, setSelectedActionType] = useState<string>('all');

  const filteredLogs = auditLogs.filter(log => {
    if (selectedActionType !== 'all' && log.actionType !== selectedActionType) {
      return false;
    }
    if (searchLog.trim()) {
      const q = searchLog.toLowerCase();
      return (
        log.actorName.toLowerCase().includes(q) ||
        log.actorDept.toLowerCase().includes(q) ||
        log.actionTitle.toLowerCase().includes(q) ||
        log.details.toLowerCase().includes(q) ||
        log.assetTag?.toLowerCase().includes(q) ||
        log.requestCode?.toLowerCase().includes(q)
      );
    }
    return true;
  });

  return (
    <div className="space-y-6">
      {/* Super Admin Top Banner */}
      <div className="bg-white rounded-xl p-5 border border-slate-200 shadow-2xs flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-slate-900 text-white flex items-center justify-center">
            <ShieldCheck className="w-6 h-6 text-emerald-400" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-base font-bold text-slate-900">Institutional Governance & Audit Trail</h2>
              <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-purple-100 text-purple-800">
                Super-Admin Control
              </span>
            </div>
            <p className="text-xs text-slate-500">
              Campus compliance ledger tracking chain-of-custody, serial registrations, and inter-departmental transfers.
            </p>
          </div>
        </div>

        {/* Quick status counters */}
        <div className="flex items-center gap-3 text-xs">
          <div className="bg-slate-50 p-2.5 px-3 rounded-lg border border-slate-200 text-right">
            <span className="text-[10px] text-slate-400 font-semibold uppercase">Total Audit Events</span>
            <p className="font-extrabold text-slate-900 text-sm">{auditLogs.length}</p>
          </div>
          <div className="bg-slate-50 p-2.5 px-3 rounded-lg border border-slate-200 text-right">
            <span className="text-[10px] text-slate-400 font-semibold uppercase">Departments Active</span>
            <p className="font-extrabold text-emerald-700 text-sm">{CAMPUS_DEPARTMENTS.length}</p>
          </div>
        </div>
      </div>

      {/* Two Column Layout: Audit Log Feed & Policy Governance */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Full Audit Trail (8 cols) */}
        <div className="lg:col-span-8 bg-white rounded-xl border border-slate-200 p-5 shadow-2xs space-y-4">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pb-3 border-b border-slate-100">
            <div>
              <h3 className="font-bold text-slate-900 text-sm">Chain-of-Custody Audit Log</h3>
              <p className="text-[11px] text-slate-500">Chronological immutable transaction record</p>
            </div>

            <div className="flex items-center gap-2 w-full sm:w-auto">
              <div className="relative flex-1 sm:w-48">
                <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={searchLog}
                  onChange={(e) => setSearchLog(e.target.value)}
                  placeholder="Filter logs..."
                  className="w-full pl-8 pr-2.5 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-xs text-slate-900 focus:outline-none focus:ring-1 focus:ring-emerald-500"
                />
              </div>

              <select
                value={selectedActionType}
                onChange={(e) => setSelectedActionType(e.target.value)}
                className="bg-slate-50 border border-slate-200 text-xs rounded-lg p-1.5 text-slate-700"
              >
                <option value="all">All Actions</option>
                <option value="create_item">Resource Listed</option>
                <option value="request_item">Transfer Request</option>
                <option value="approve_request">Approved</option>
                <option value="pickup_item">Picked Up</option>
                <option value="complete_transfer">Completed</option>
              </select>
            </div>
          </div>

          {/* Audit Events List */}
          <div className="space-y-3">
            {filteredLogs.map(log => {
              const getIcon = () => {
                switch (log.actionType) {
                  case 'create_item':
                    return <Tag className="w-4 h-4 text-blue-600" />;
                  case 'request_item':
                    return <ArrowRightLeft className="w-4 h-4 text-amber-600" />;
                  case 'approve_request':
                    return <CheckCircle2 className="w-4 h-4 text-emerald-600" />;
                  case 'pickup_item':
                    return <Clock className="w-4 h-4 text-purple-600" />;
                  case 'complete_transfer':
                    return <ShieldCheck className="w-4 h-4 text-emerald-700" />;
                  default:
                    return <FileText className="w-4 h-4 text-slate-600" />;
                }
              };

              return (
                <div
                  key={log.id}
                  className="p-3.5 rounded-xl border border-slate-100 hover:border-slate-200 bg-slate-50/60 flex items-start gap-3.5 text-xs transition-colors"
                >
                  <div className="p-2 rounded-lg bg-white border border-slate-200 shrink-0 mt-0.5 shadow-2xs">
                    {getIcon()}
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-baseline justify-between gap-2">
                      <span className="font-bold text-slate-900">{log.actionTitle}</span>
                      <span className="text-[11px] text-slate-400 font-mono shrink-0">{log.timestamp}</span>
                    </div>

                    <p className="text-slate-600 mt-0.5 leading-relaxed">{log.details}</p>

                    <div className="mt-2 flex flex-wrap items-center gap-2 text-[11px] text-slate-500">
                      <span className="flex items-center gap-1 font-medium text-slate-700">
                        <User className="w-3 h-3 text-slate-400" />
                        {log.actorName} ({log.actorDept})
                      </span>
                      {log.assetTag && (
                        <span className="font-mono bg-white px-1.5 py-0.2 rounded border border-slate-200 text-slate-700">
                          Asset: {log.assetTag}
                        </span>
                      )}
                      {log.requestCode && (
                        <span className="font-mono bg-white px-1.5 py-0.2 rounded border border-slate-200 text-slate-700">
                          Ref: {log.requestCode}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right Column: Category Management & Institutional Policies (4 cols) */}
        <div className="lg:col-span-4 space-y-5">
          {/* Category Management */}
          <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-2xs space-y-3.5">
            <div className="flex items-center justify-between">
              <h3 className="font-bold text-slate-900 text-sm">Asset Categories</h3>
              <span className="text-xs font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded">
                {CATEGORIES.length} Active
              </span>
            </div>
            <div className="space-y-2 text-xs">
              {CATEGORIES.map(cat => (
                <div key={cat.id} className="p-2.5 rounded-lg border border-slate-100 bg-slate-50 flex items-center justify-between">
                  <div>
                    <p className="font-bold text-slate-900">{cat.name}</p>
                    <p className="text-[10px] text-slate-500">Factor: {cat.co2Factor} kg CO₂ / item</p>
                  </div>
                  <span className="text-[10px] font-semibold text-slate-400">Standardized</span>
                </div>
              ))}
            </div>
          </div>

          {/* Compliance & Inter-Departmental Protocols */}
          <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-2xs space-y-3">
            <div className="flex items-center gap-2">
              <Scale className="w-4 h-4 text-emerald-600" />
              <h3 className="font-bold text-slate-900 text-sm">Campus Property Policies</h3>
            </div>
            <div className="space-y-2 text-xs text-slate-600">
              <div className="p-3 bg-slate-50 rounded-lg border border-slate-100 space-y-1">
                <span className="font-bold text-slate-800">1. Surplus Retention Hierarchy</span>
                <p className="text-[11px] text-slate-500">
                  Surplus property must remain in UniShare for a minimum of 30 days for university departments prior to public auction or certified recycling.
                </p>
              </div>

              <div className="p-3 bg-slate-50 rounded-lg border border-slate-100 space-y-1">
                <span className="font-bold text-slate-800">2. Grant-Funded Asset Clearance</span>
                <p className="text-[11px] text-slate-500">
                  Equipment purchased under NSF, NIH, or DoD grants requires closeout verification before transfer outside the grant PI's department.
                </p>
              </div>

              <div className="p-3 bg-slate-50 rounded-lg border border-slate-100 space-y-1">
                <span className="font-bold text-slate-800">3. Environmental Health & Safety (EHS)</span>
                <p className="text-[11px] text-slate-500">
                  Chemical storage, biosafety cabinets, and spectrometers must be decontaminated with physical signage before facilities transport.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
