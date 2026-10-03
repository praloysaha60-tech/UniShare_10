import React from 'react';
import { useApp } from '../context/AppContext';
import { CATEGORIES } from '../data/mockData';
import { 
  X, 
  MapPin, 
  Building, 
  Mail, 
  Phone, 
  DollarSign, 
  Leaf, 
  AlertTriangle, 
  ArrowRight
} from 'lucide-react';

export const ItemDetailModal: React.FC = () => {
  const { 
    selectedDetailItem, 
    setSelectedDetailItem, 
    setRequestModalItem, 
    currentUser 
  } = useApp();

  if (!selectedDetailItem) return null;

  const item = selectedDetailItem;
  const isOwner = currentUser.department === item.departmentName;
  const categoryObj = CATEGORIES.find(c => c.id === item.category);

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div 
        className="bg-white rounded-2xl max-w-2xl w-full border border-slate-200 shadow-2xl overflow-hidden animate-in fade-in zoom-in-95"
        role="dialog"
        aria-modal="true"
      >
        {/* Modal Header */}
        <div className="flex items-center justify-between p-4 px-6 border-b border-slate-100 bg-slate-50">
          <div className="flex items-center gap-2 text-xs text-slate-500">
            <span className="font-mono font-bold text-slate-900 bg-slate-200 px-2 py-0.5 rounded">
              {item.assetTag}
            </span>
            <span aria-hidden="true">·</span>
            <span className="font-semibold text-slate-700">{categoryObj?.name}</span>
          </div>
          <button
            onClick={() => setSelectedDetailItem(null)}
            className="p-1 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-200 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 space-y-5 max-h-[75vh] overflow-y-auto">
          {/* Main Media & Header */}
          <div className="space-y-3">
            {item.imageUrl && (
              <div className="w-full h-60 rounded-xl overflow-hidden bg-slate-100 border border-slate-200">
                <img 
                  src={item.imageUrl} 
                  alt={item.title} 
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover" 
                />
              </div>
            )}

            <div>
              <div className="flex items-center gap-2 text-xs text-slate-500 mb-1">
                <span className="font-bold text-slate-800 capitalize">Condition: {item.condition}</span>
                <span aria-hidden="true">·</span>
                <span>{item.availability === 'immediate' ? 'Available Immediately' : 'Available Next Month'}</span>
                <span aria-hidden="true">·</span>
                <span className="font-mono text-slate-400">Listed {item.dateListed}</span>
              </div>
              <h2 className="text-xl font-black text-slate-900 tracking-tight">{item.title}</h2>
            </div>
          </div>

          {/* Quick Metrics Grid */}
          <div className="grid grid-cols-3 gap-3 p-3.5 rounded-xl bg-slate-50 border border-slate-200">
            <div>
              <span className="text-[11px] text-slate-500 font-medium block">Quantity Available</span>
              <p className="text-lg font-bold text-slate-900 font-mono tabular-nums mt-0.5">
                {item.quantity} <span className="text-xs font-normal text-slate-500">{item.unit}</span>
              </p>
            </div>
            <div>
              <span className="text-[11px] text-slate-500 font-medium block">Replacement Value</span>
              <p className="text-lg font-bold text-slate-900 font-mono tabular-nums mt-0.5">
                ${item.estValue.toLocaleString()}
              </p>
            </div>
            <div>
              <span className="text-[11px] text-slate-500 font-medium block">Embodied CO₂ Avoided</span>
              <p className="text-lg font-bold text-teal-700 font-mono tabular-nums mt-0.5">
                {item.co2SavingsKg} kg
              </p>
            </div>
          </div>

          {/* Specifications Description */}
          <div className="space-y-1.5">
            <h4 className="text-xs font-bold text-slate-800">Description & Equipment Scope</h4>
            <p className="text-xs text-slate-700 leading-relaxed bg-slate-50 p-3.5 rounded-lg border border-slate-200">
              {item.description}
            </p>
          </div>

          {/* Serial Number */}
          {item.modelSerial && (
            <div className="flex items-center gap-2 text-xs">
              <span className="font-semibold text-slate-600">Model / Serial Number:</span>
              <span className="font-mono font-bold bg-slate-100 text-slate-800 px-2 py-0.5 rounded border border-slate-200">
                {item.modelSerial}
              </span>
            </div>
          )}

          {/* Handling & Safety Notes */}
          {(item.handlingNotes || item.safetyHazard) && (
            <div className="space-y-2">
              <h4 className="text-xs font-bold text-amber-900 flex items-center gap-1.5">
                <AlertTriangle className="w-4 h-4 text-amber-600" />
                Handling, Transport & Safety Notes
              </h4>
              <div className="p-3 rounded-lg bg-amber-50 border border-amber-200 text-xs text-amber-950 space-y-1">
                {item.handlingNotes && <p>• <strong>Transport:</strong> {item.handlingNotes}</p>}
                {item.safetyHazard && <p>• <strong>Safety / EHS:</strong> {item.safetyHazard}</p>}
              </div>
            </div>
          )}

          {/* Location & Custodian */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2 border-t border-slate-100">
            <div className="space-y-1 text-xs">
              <span className="font-bold text-slate-500 uppercase tracking-wider text-[10px]">Location</span>
              <p className="font-bold text-slate-900 flex items-center gap-1">
                <Building className="w-3.5 h-3.5 text-slate-400" />
                {item.departmentName}
              </p>
              <p className="text-slate-600 flex items-center gap-1">
                <MapPin className="w-3.5 h-3.5 text-slate-400" />
                {item.location.building} · {item.location.room}
              </p>
            </div>

            <div className="space-y-1 text-xs">
              <span className="font-bold text-slate-500 uppercase tracking-wider text-[10px]">Custodian</span>
              <p className="font-bold text-slate-900">{item.custodianName}</p>
              <p className="text-slate-600 flex items-center gap-1">
                <Mail className="w-3.5 h-3.5 text-slate-400" />
                {item.custodianEmail}
              </p>
            </div>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="p-4 px-6 border-t border-slate-100 bg-slate-50 flex items-center justify-between">
          <button
            onClick={() => setSelectedDetailItem(null)}
            className="px-4 py-2 rounded-lg text-xs font-semibold text-slate-600 hover:text-slate-800 hover:bg-slate-200 transition-colors"
          >
            Close
          </button>

          {item.status === 'available' ? (
            <button
              onClick={() => {
                setSelectedDetailItem(null);
                setRequestModalItem(item);
              }}
              disabled={isOwner}
              className={`px-5 py-2.5 rounded-lg text-xs font-bold flex items-center gap-2 transition-colors ${
                isOwner
                  ? 'bg-slate-200 text-slate-500 cursor-not-allowed'
                  : 'bg-emerald-600 hover:bg-emerald-700 text-white shadow-xs'
              }`}
            >
              <span>{isOwner ? "Surplus From Your Department" : "Request Inter-Dept Transfer"}</span>
              {!isOwner && <ArrowRight className="w-4 h-4" />}
            </button>
          ) : (
            <span className="text-xs text-slate-500 font-semibold px-3 py-1.5 bg-slate-200 rounded-lg">
              Currently Reserved
            </span>
          )}
        </div>
      </div>
    </div>
  );
};
