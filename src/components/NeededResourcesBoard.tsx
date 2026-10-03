import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { CATEGORIES } from '../data/mockData';
import { NeededResource, ResourceItem } from '../types';
import { 
  Lightbulb, 
  Plus, 
  Building, 
  Calendar, 
  AlertTriangle, 
  Check, 
  Sparkles, 
  Link, 
  Search, 
  PackageCheck,
  CheckCircle2,
  Clock,
  ArrowRight
} from 'lucide-react';

export const NeededResourcesBoard: React.FC = () => {
  const { 
    neededResources, 
    items, 
    matchNeededResource, 
    setIsPostNeedModalOpen, 
    currentUser, 
    currentRole,
    setRequestModalItem,
    setActiveTab
  } = useApp();

  const [searchNeed, setSearchNeed] = useState('');
  const [matchModalNeed, setMatchModalNeed] = useState<NeededResource | null>(null);
  const [selectedMatchingItemId, setSelectedMatchingItemId] = useState<string>('');

  const filteredNeeds = neededResources.filter(need => {
    if (searchNeed.trim()) {
      const q = searchNeed.toLowerCase();
      return (
        need.title.toLowerCase().includes(q) ||
        need.requestingDept.toLowerCase().includes(q) ||
        need.justification.toLowerCase().includes(q)
      );
    }
    return true;
  });

  // Items from current user's department or available surplus that could match
  const eligibleSurplusItems = items.filter(i => i.status === 'available');

  const handleConfirmMatch = () => {
    if (!matchModalNeed || !selectedMatchingItemId) return;
    matchNeededResource(matchModalNeed.id, selectedMatchingItemId);
    setMatchModalNeed(null);
    setSelectedMatchingItemId('');
  };

  const getUrgencyBadge = (urgency: NeededResource['urgency']) => {
    switch (urgency) {
      case 'urgent':
        return (
          <span className="px-2 py-0.5 rounded text-[11px] font-bold bg-rose-100 text-rose-800 border border-rose-200 flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-rose-600 animate-pulse"></span>
            Critical Need (ASAP)
          </span>
        );
      case 'medium':
        return (
          <span className="px-2 py-0.5 rounded text-[11px] font-medium bg-amber-100 text-amber-800 border border-amber-200">
            Medium Priority
          </span>
        );
      case 'low':
        return (
          <span className="px-2 py-0.5 rounded text-[11px] font-medium bg-slate-100 text-slate-700 border border-slate-200">
            Standard Need
          </span>
        );
    }
  };

  return (
    <div className="space-y-5">
      {/* Header & Description */}
      <div className="bg-white rounded-xl p-5 border border-slate-200 shadow-2xs flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-lg bg-amber-50 text-amber-600">
              <Lightbulb className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-slate-900">Campus "Needed Resources" Wishlist Board</h2>
              <p className="text-xs text-slate-500">
                Departments post urgent equipment requirements before issuing commercial purchase orders. If your lab has idle gear, match it here!
              </p>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3 w-full md:w-auto">
          <div className="relative flex-1 md:w-64">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchNeed}
              onChange={(e) => setSearchNeed(e.target.value)}
              placeholder="Search wishlist items..."
              className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs text-slate-900 focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
            />
          </div>

          <button
            onClick={() => setIsPostNeedModalOpen(true)}
            className="px-3.5 py-2 rounded-lg text-xs font-bold text-white bg-slate-900 hover:bg-slate-800 transition-colors shrink-0 flex items-center gap-1.5 shadow-xs"
          >
            <Plus className="w-4 h-4" />
            <span>Post Requirement</span>
          </button>
        </div>
      </div>

      {/* Grid of Needed Resources */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filteredNeeds.map(need => {
          const isRequesterOwner = currentUser.department === need.requestingDept;
          const isMatched = need.status === 'matched';

          return (
            <div
              key={need.id}
              className={`bg-white rounded-xl border p-5 transition-all flex flex-col justify-between space-y-4 shadow-2xs ${
                isMatched ? 'border-emerald-300 bg-emerald-50/20' : 'border-slate-200 hover:border-slate-300'
              }`}
            >
              <div className="space-y-2.5">
                <div className="flex items-start justify-between gap-2">
                  <div className="flex flex-wrap items-center gap-2">
                    {getUrgencyBadge(need.urgency)}
                    <span className="text-[11px] font-semibold text-slate-500 capitalize">
                      {need.category.replace('-', ' ')}
                    </span>
                  </div>

                  <span className="text-[11px] text-slate-400">
                    Posted {need.createdAt}
                  </span>
                </div>

                <div>
                  <h3 className="text-sm font-bold text-slate-900 leading-snug">
                    {need.title}
                  </h3>
                  <div className="mt-1 flex items-center gap-1.5 text-xs text-slate-600">
                    <Building className="w-3.5 h-3.5 text-slate-400" />
                    <span className="font-semibold text-slate-800">{need.requestingDept}</span>
                    <span className="text-slate-400">• Requested by {need.requesterName}</span>
                  </div>
                </div>

                {/* Justification quote */}
                <div className="p-3 rounded-lg bg-slate-50 text-xs text-slate-700 leading-relaxed border border-slate-100">
                  <span className="font-bold text-slate-900">Academic Need:</span> {need.justification}
                </div>

                {/* Requirements info row */}
                <div className="flex items-center justify-between text-xs pt-1">
                  <div className="text-slate-600">
                    <span className="text-slate-400 font-medium">Quantity Needed: </span>
                    <strong className="text-slate-900 font-bold">{need.quantityNeeded} {need.unit}</strong>
                  </div>
                  <div className="text-slate-600 flex items-center gap-1">
                    <Calendar className="w-3.5 h-3.5 text-slate-400" />
                    <span>Needed by: <strong>{need.neededBy}</strong></span>
                  </div>
                </div>

                {/* Matched state if already linked */}
                {isMatched && (
                  <div className="p-3 bg-emerald-100/70 border border-emerald-300 rounded-lg text-xs text-emerald-950 flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-700 shrink-0 mt-0.5" />
                    <div className="flex-1">
                      <span className="font-bold text-emerald-900">Match Proposed:</span>
                      <p className="mt-0.5">
                        Matched with <strong>"{need.matchedResourceTitle}"</strong> from <strong>{need.matchedFromDept}</strong>!
                      </p>
                    </div>
                  </div>
                )}
              </div>

              {/* Action row */}
              <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
                <span className="text-[11px] text-slate-400">
                  Contact: {need.requesterEmail}
                </span>

                {!isMatched ? (
                  <button
                    onClick={() => {
                      setMatchModalNeed(need);
                      if (eligibleSurplusItems.length > 0) {
                        setSelectedMatchingItemId(eligibleSurplusItems[0].id);
                      }
                    }}
                    disabled={isRequesterOwner}
                    className={`inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-bold transition-colors ${
                      isRequesterOwner
                        ? 'bg-slate-100 text-slate-400 cursor-not-allowed'
                        : 'bg-emerald-600 hover:bg-emerald-700 text-white shadow-xs'
                    }`}
                  >
                    <PackageCheck className="w-3.5 h-3.5" />
                    <span>{isRequesterOwner ? "Your Department's Post" : "I Have This Item"}</span>
                  </button>
                ) : (
                  <span className="text-xs font-semibold text-emerald-800 bg-emerald-50 px-2.5 py-1 rounded-md border border-emerald-200">
                    Match Proposed ✓
                  </span>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* "I Have This Item" Match Drawer/Modal */}
      {matchModalNeed && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full border border-slate-200 shadow-2xl p-6 space-y-4 animate-in fade-in zoom-in-95">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <div className="p-2 rounded-lg bg-emerald-100 text-emerald-800">
                  <Sparkles className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="font-bold text-slate-900 text-sm">Match Surplus Resource to Need</h3>
                  <p className="text-[11px] text-slate-500">Connect your department's equipment to {matchModalNeed.requestingDept}</p>
                </div>
              </div>
              <button
                onClick={() => setMatchModalNeed(null)}
                className="text-slate-400 hover:text-slate-700 text-xs font-bold"
              >
                ✕
              </button>
            </div>

            <div className="p-3 bg-slate-50 rounded-lg border border-slate-200 text-xs text-slate-700">
              <span className="font-bold text-slate-900">Target Wishlist Item:</span>
              <p className="font-medium text-slate-800">{matchModalNeed.title}</p>
              <p className="text-[11px] text-slate-500 mt-0.5">Required Quantity: {matchModalNeed.quantityNeeded} {matchModalNeed.unit}</p>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                Select Available Surplus from Campus Directory to Fulfill:
              </label>
              <div className="space-y-2 max-h-56 overflow-y-auto pr-1">
                {eligibleSurplusItems.map(item => (
                  <label
                    key={item.id}
                    className={`flex items-start gap-3 p-3 rounded-xl border text-xs cursor-pointer transition-colors ${
                      selectedMatchingItemId === item.id 
                        ? 'bg-emerald-50 border-emerald-300 text-emerald-950' 
                        : 'bg-white border-slate-200 hover:bg-slate-50 text-slate-800'
                    }`}
                  >
                    <input
                      type="radio"
                      name="matchingItem"
                      checked={selectedMatchingItemId === item.id}
                      onChange={() => setSelectedMatchingItemId(item.id)}
                      className="mt-0.5 text-emerald-600 focus:ring-emerald-500"
                    />
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-slate-900 truncate">{item.title}</span>
                        <span className="font-mono text-[10px] text-slate-500">{item.assetTag}</span>
                      </div>
                      <p className="text-[11px] text-slate-500">
                        {item.departmentName} • {item.quantity} {item.unit} available
                      </p>
                    </div>
                  </label>
                ))}
              </div>
            </div>

            <div className="pt-2 flex items-center justify-end gap-2 border-t border-slate-100">
              <button
                onClick={() => setMatchModalNeed(null)}
                className="px-3.5 py-2 rounded-lg text-xs font-semibold text-slate-600 hover:bg-slate-100"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmMatch}
                disabled={!selectedMatchingItemId}
                className="px-4 py-2 rounded-lg text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 flex items-center gap-1.5 shadow-xs"
              >
                <Check className="w-4 h-4" />
                <span>Confirm Resource Match</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
