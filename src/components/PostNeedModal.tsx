import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { CATEGORIES } from '../data/mockData';
import { CategoryId } from '../types';
import { X, Lightbulb, Check, AlertCircle } from 'lucide-react';

export const PostNeedModal: React.FC = () => {
  const { 
    isPostNeedModalOpen, 
    setIsPostNeedModalOpen, 
    postNeededResource, 
    currentUser 
  } = useApp();

  const [title, setTitle] = useState('');
  const [category, setCategory] = useState<CategoryId>('lab-equipment');
  const [urgency, setUrgency] = useState<'low' | 'medium' | 'urgent'>('medium');
  const [quantityNeeded, setQuantityNeeded] = useState(1);
  const [unit, setUnit] = useState('units');
  const [neededBy, setNeededBy] = useState(() => {
    const d = new Date();
    d.setDate(d.getDate() + 21);
    return d.toISOString().split('T')[0];
  });
  const [justification, setJustification] = useState('');
  const [error, setError] = useState('');

  if (!isPostNeedModalOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !justification.trim()) {
      setError('Please fill in the item title and justification.');
      return;
    }

    postNeededResource({
      title,
      category,
      urgency,
      quantityNeeded,
      unit,
      neededBy,
      justification
    });

    setIsPostNeedModalOpen(false);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div 
        className="bg-white rounded-2xl max-w-lg w-full border border-slate-200 shadow-2xl p-6 space-y-4 animate-in fade-in zoom-in-95"
        role="dialog"
        aria-modal="true"
      >
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-lg bg-amber-100 text-amber-800">
              <Lightbulb className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-slate-900 text-sm">Post a Resource Requirement</h3>
              <p className="text-[11px] text-slate-500">Notify other departments of equipment you need</p>
            </div>
          </div>
          <button
            onClick={() => setIsPostNeedModalOpen(false)}
            className="p-1 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {error && (
          <div className="p-3 rounded-lg bg-rose-50 border border-rose-200 text-xs text-rose-700 flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          <div>
            <label className="block font-semibold text-slate-700 mb-1">
              Required Equipment / Material Title *
            </label>
            <input
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g., Benchtop Refrigerated Centrifuge 15,000 RPM"
              className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg text-slate-900 focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block font-semibold text-slate-700 mb-1">Category</label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value as any)}
                className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg text-slate-800"
              >
                {CATEGORIES.map(cat => (
                  <option key={cat.id} value={cat.id}>{cat.name}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">Priority / Urgency</label>
              <select
                value={urgency}
                onChange={(e) => setUrgency(e.target.value as any)}
                className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg text-slate-800"
              >
                <option value="urgent">Urgent / Critical Need</option>
                <option value="medium">Medium Priority</option>
                <option value="low">Standard / Wishlist</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-3">
            <div>
              <label className="block font-semibold text-slate-700 mb-1">Quantity</label>
              <input
                type="number"
                min="1"
                value={quantityNeeded}
                onChange={(e) => setQuantityNeeded(Math.max(1, parseInt(e.target.value) || 1))}
                className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg text-slate-900 font-bold"
              />
            </div>
            <div>
              <label className="block font-semibold text-slate-700 mb-1">Unit</label>
              <input
                type="text"
                value={unit}
                onChange={(e) => setUnit(e.target.value)}
                placeholder="units, boxes"
                className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg text-slate-900"
              />
            </div>
            <div>
              <label className="block font-semibold text-slate-700 mb-1">Needed By Date</label>
              <input
                type="date"
                value={neededBy}
                onChange={(e) => setNeededBy(e.target.value)}
                className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg text-slate-900"
              />
            </div>
          </div>

          <div>
            <label className="block font-semibold text-slate-700 mb-1">
              Academic Justification & Project Context *
            </label>
            <textarea
              rows={3}
              required
              value={justification}
              onChange={(e) => setJustification(e.target.value)}
              placeholder="Explain what lab, experiment, or instructional class requires this equipment..."
              className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg text-slate-900"
            />
          </div>

          <div className="p-3 bg-slate-50 rounded-lg border border-slate-200 text-[11px] text-slate-500">
            Posting from: <strong>{currentUser.department}</strong> ({currentUser.name})
          </div>

          <div className="pt-2 flex items-center justify-end gap-2 border-t border-slate-100">
            <button
              type="button"
              onClick={() => setIsPostNeedModalOpen(false)}
              className="px-3.5 py-2 rounded-lg text-xs font-semibold text-slate-600 hover:bg-slate-100"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 rounded-lg text-xs font-bold text-white bg-slate-900 hover:bg-slate-800 flex items-center gap-1.5 shadow-xs"
            >
              <Check className="w-4 h-4" />
              <span>Post to Campus Wishlist</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
