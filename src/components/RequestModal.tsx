import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { 
  X, 
  ArrowRightLeft, 
  MapPin, 
  Calendar, 
  Check, 
  Sparkles,
  Building,
  Minus,
  Plus
} from 'lucide-react';

export const RequestModal: React.FC = () => {
  const { 
    requestModalItem, 
    setRequestModalItem, 
    submitRequest, 
    currentUser, 
    setActiveTab 
  } = useApp();

  const [quantity, setQuantity] = useState(1);
  const [reason, setReason] = useState('Setting up research workstations for graduate teaching assistants.');
  const [academicPurpose, setAcademicPurpose] = useState('Department Instructional & Grant Research Lab');
  const [urgency, setUrgency] = useState<'low' | 'medium' | 'urgent'>('medium');
  const [requiredByDate, setRequiredByDate] = useState(() => {
    const d = new Date();
    d.setDate(d.getDate() + 14);
    return d.toISOString().split('T')[0];
  });
  const [pickupPreference, setPickupPreference] = useState<'self-pickup' | 'campus-courier' | 'custodian-delivery'>('self-pickup');
  const [intendedLocation, setIntendedLocation] = useState(currentUser.location || 'Curie Science Complex, Lab 218');
  const [errors, setErrors] = useState<Record<string, string>>({});

  if (!requestModalItem) return null;

  const item = requestModalItem;

  const quickTemplates = [
    { label: 'Research Workstation', text: 'Setting up computing workstations for graduate researchers analyzing crystal structures.' },
    { label: 'Broken Equipment Replacement', text: 'Replacing defective equipment to resume scheduled undergraduate lab experiments.' },
    { label: 'Grant Project Setup', text: 'Equipping new bio-imaging experimental station for sponsored grant research.' }
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newErrors: Record<string, string> = {};

    if (!reason.trim()) {
      newErrors.reason = 'Please specify how your department will use this resource.';
    }
    if (!intendedLocation.trim()) {
      newErrors.intendedLocation = 'Destination building & room are required.';
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    submitRequest({
      resourceId: item.id,
      quantityRequested: quantity,
      reason,
      academicPurpose: academicPurpose || 'Departmental Teaching & Research',
      urgency,
      requiredByDate,
      pickupPreference,
      intendedLocation
    });

    setRequestModalItem(null);
    setActiveTab('pipeline');
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div 
        className="bg-white rounded-2xl max-w-xl w-full border border-slate-200 shadow-2xl overflow-hidden animate-in fade-in zoom-in-95"
        role="dialog"
        aria-modal="true"
      >
        {/* Header */}
        <div className="flex items-center justify-between p-4 px-6 border-b border-slate-100 bg-slate-50">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-lg bg-emerald-100 text-emerald-800">
              <ArrowRightLeft className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-bold text-slate-900 text-sm">Request Inter-Departmental Transfer</h3>
              <p className="text-[11px] text-slate-500">Initiate formal custody transfer from {item.departmentName}</p>
            </div>
          </div>
          <button
            onClick={() => setRequestModalItem(null)}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-200 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Selected Resource Summary */}
        <div className="p-4 px-6 bg-slate-50/70 border-b border-slate-100 flex items-center justify-between gap-4">
          <div className="min-w-0">
            <div className="flex items-center gap-2 text-xs text-slate-500">
              <span className="font-mono font-bold text-slate-700">{item.assetTag}</span>
              <span aria-hidden="true">·</span>
              <span>{item.departmentName}</span>
            </div>
            <h4 className="font-bold text-slate-900 text-sm truncate mt-0.5">{item.title}</h4>
          </div>
          <div className="text-right shrink-0">
            <span className="text-[10px] text-slate-400 block font-medium">Available</span>
            <strong className="text-sm font-black text-emerald-700 font-mono tabular-nums">{item.quantity} {item.unit}</strong>
          </div>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4 max-h-[70vh] overflow-y-auto">
          {/* User Persona Header */}
          <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 text-xs flex items-center justify-between">
            <div>
              <span className="text-[10px] uppercase font-bold text-slate-400">Requesting As:</span>
              <p className="font-bold text-slate-900">{currentUser.name}</p>
              <p className="text-[11px] text-slate-500">{currentUser.department}</p>
            </div>
            <span className="text-[10px] font-semibold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
              Verified Staff
            </span>
          </div>

          {/* Quantity Stepper & Urgency */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Requested Quantity
              </label>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="w-9 h-9 rounded-lg border border-slate-200 bg-slate-50 hover:bg-slate-100 flex items-center justify-center font-bold text-slate-700"
                >
                  <Minus className="w-3.5 h-3.5" />
                </button>
                <div className="flex-1 text-center font-mono font-bold text-sm text-slate-900 py-1.5 px-3 bg-slate-50 border border-slate-200 rounded-lg">
                  {quantity} <span className="text-xs font-normal text-slate-500">{item.unit}</span>
                </div>
                <button
                  type="button"
                  onClick={() => setQuantity(Math.min(item.quantity, quantity + 1))}
                  className="w-9 h-9 rounded-lg border border-slate-200 bg-slate-50 hover:bg-slate-100 flex items-center justify-center font-bold text-slate-700"
                >
                  <Plus className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Urgency Priority
              </label>
              <select
                value={urgency}
                onChange={(e) => setUrgency(e.target.value as any)}
                className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2.5 text-xs text-slate-800 font-medium"
              >
                <option value="low">Standard / Low (Within 30 Days)</option>
                <option value="medium">Medium Priority (Within 2 Weeks)</option>
                <option value="urgent">Urgent / Critical Need (Immediate)</option>
              </select>
            </div>
          </div>

          {/* Quick Justification Templates */}
          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="block text-xs font-semibold text-slate-700">
                Academic Justification & Intended Use *
              </label>
              <span className="text-[10px] text-slate-400">Click quick template:</span>
            </div>
            <div className="flex items-center gap-1.5 overflow-x-auto pb-1 mb-2">
              {quickTemplates.map((t, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => setReason(t.text)}
                  className="px-2 py-0.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded text-[10px] font-medium whitespace-nowrap transition-colors"
                >
                  {t.label}
                </button>
              ))}
            </div>
            <textarea
              rows={3}
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg text-xs text-slate-900 focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
            />
            {errors.reason && <p className="text-[11px] text-rose-600 mt-1">{errors.reason}</p>}
          </div>

          {/* Destination Building & Room */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Destination Location (Building & Lab/Room) *
            </label>
            <div className="relative">
              <MapPin className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={intendedLocation}
                onChange={(e) => setIntendedLocation(e.target.value)}
                placeholder="e.g., Curie Science Complex, Lab 218"
                className="w-full pl-9 pr-3 py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-xs text-slate-900 focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
              />
            </div>
            {errors.intendedLocation && <p className="text-[11px] text-rose-600 mt-1">{errors.intendedLocation}</p>}
          </div>

          {/* Logistics & Date */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Required By Date
              </label>
              <input
                type="date"
                value={requiredByDate}
                onChange={(e) => setRequiredByDate(e.target.value)}
                className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg text-xs text-slate-900 font-mono"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Logistics Preference
              </label>
              <select
                value={pickupPreference}
                onChange={(e) => setPickupPreference(e.target.value as any)}
                className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg text-xs text-slate-800"
              >
                <option value="self-pickup">Self-Pickup by Recipient Dept</option>
                <option value="campus-courier">Campus Internal Logistics Team</option>
                <option value="custodian-delivery">Donor Custodian Drop-off</option>
              </select>
            </div>
          </div>

          {/* Modal Action Buttons */}
          <div className="pt-2 flex items-center justify-end gap-3 border-t border-slate-100">
            <button
              type="button"
              onClick={() => setRequestModalItem(null)}
              className="px-4 py-2 rounded-lg text-xs font-semibold text-slate-600 hover:bg-slate-100 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2.5 rounded-lg text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-700 transition-colors shadow-sm shadow-emerald-700/20 flex items-center gap-1.5"
            >
              <ArrowRightLeft className="w-4 h-4" />
              <span>Submit Request for Custodian Approval</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
