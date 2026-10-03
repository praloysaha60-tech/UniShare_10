import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Role } from '../types';
import { USER_PROFILES } from '../data/mockData';
import { 
  ArrowRightLeft, 
  Package, 
  Lightbulb, 
  BarChart3, 
  ShieldCheck, 
  Check, 
  ChevronDown, 
  RotateCcw, 
  Plus, 
  MapPin, 
  Bell, 
  Sparkles,
  ArrowRight
} from 'lucide-react';

export const Header: React.FC = () => {
  const { 
    currentRole, 
    currentUser, 
    setRole, 
    activeTab, 
    setActiveTab,
    requests,
    neededResources,
    items,
    setIsListItemModalOpen,
    setIsPostNeedModalOpen,
    resetToDefaults
  } = useApp();

  const [roleDropdownOpen, setRoleDropdownOpen] = useState(false);

  // Counts for tabs
  const availableItemsCount = items.filter(i => i.status === 'available').length;
  const activeRequestsCount = requests.filter(r => r.status === 'pending' || r.status === 'approved' || r.status === 'in-transit').length;
  const openNeedsCount = neededResources.filter(n => n.status === 'open').length;

  // Contextual pending prompt for current user
  const pendingForCurrentUser = requests.filter(r => {
    if (currentRole === 'custodian') {
      return r.status === 'pending' && r.donorDept === currentUser.department;
    }
    if (currentRole === 'requester') {
      return r.status === 'in-transit' && r.requesterDept === currentUser.department;
    }
    return r.status === 'pending';
  }).length;

  return (
    <header className="bg-white border-b border-slate-200 sticky top-0 z-40">
      {/* Primary Top Bar (Strict 3-zone contract) */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-4">
        {/* Zone 1: Single text element wordmark */}
        <div className="flex items-center gap-3">
          <a 
            href="#" 
            onClick={(e) => { e.preventDefault(); setActiveTab('catalog'); }}
            className="flex items-center gap-2.5 text-lg font-black tracking-tight text-slate-900 group"
          >
            <div className="w-8 h-8 rounded-lg bg-emerald-600 text-white flex items-center justify-center shadow-xs group-hover:bg-emerald-700 transition-colors">
              <ArrowRightLeft className="w-4 h-4 stroke-[2.5]" />
            </div>
            <span>
              Uni<span className="text-emerald-600">Share</span>
            </span>
          </a>
          <span className="hidden md:inline text-xs text-slate-400">·</span>
          <span className="hidden md:inline text-xs font-medium text-slate-500">
            Campus Surplus Exchange
          </span>
        </div>

        {/* Zone 2: Clean text navigation links */}
        <nav className="hidden lg:flex items-center gap-1 xl:gap-2 text-xs font-semibold text-slate-600">
          <button
            onClick={() => setActiveTab('catalog')}
            className={`px-3 py-2 rounded-lg transition-colors flex items-center gap-1.5 ${
              activeTab === 'catalog' 
                ? 'text-slate-900 bg-slate-100 font-bold' 
                : 'hover:text-slate-900 hover:bg-slate-50'
            }`}
          >
            <Package className="w-3.5 h-3.5 text-slate-400" />
            <span>Surplus Catalog</span>
            <span className="font-mono text-[10px] text-slate-400 font-normal">({availableItemsCount})</span>
          </button>

          <button
            onClick={() => setActiveTab('pipeline')}
            className={`px-3 py-2 rounded-lg transition-colors flex items-center gap-1.5 ${
              activeTab === 'pipeline' 
                ? 'text-slate-900 bg-slate-100 font-bold' 
                : 'hover:text-slate-900 hover:bg-slate-50'
            }`}
          >
            <ArrowRightLeft className="w-3.5 h-3.5 text-slate-400" />
            <span>Transfer Pipeline</span>
            {activeRequestsCount > 0 && (
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
            )}
          </button>

          <button
            onClick={() => setActiveTab('wishlist')}
            className={`px-3 py-2 rounded-lg transition-colors flex items-center gap-1.5 ${
              activeTab === 'wishlist' 
                ? 'text-slate-900 bg-slate-100 font-bold' 
                : 'hover:text-slate-900 hover:bg-slate-50'
            }`}
          >
            <Lightbulb className="w-3.5 h-3.5 text-amber-500" />
            <span>Needed Wishlist</span>
            <span className="font-mono text-[10px] text-slate-400 font-normal">({openNeedsCount})</span>
          </button>

          <button
            onClick={() => setActiveTab('analytics')}
            className={`px-3 py-2 rounded-lg transition-colors flex items-center gap-1.5 ${
              activeTab === 'analytics' 
                ? 'text-slate-900 bg-slate-100 font-bold' 
                : 'hover:text-slate-900 hover:bg-slate-50'
            }`}
          >
            <BarChart3 className="w-3.5 h-3.5 text-slate-400" />
            <span>Savings & Impact</span>
          </button>

          <button
            onClick={() => setActiveTab('admin')}
            className={`px-3 py-2 rounded-lg transition-colors flex items-center gap-1.5 ${
              activeTab === 'admin' 
                ? 'text-slate-900 bg-slate-100 font-bold' 
                : 'hover:text-slate-900 hover:bg-slate-50'
            }`}
          >
            <ShieldCheck className="w-3.5 h-3.5 text-slate-400" />
            <span>Audit & Governance</span>
          </button>
        </nav>

        {/* Zone 3: Primary Actions + Role Switcher */}
        <div className="flex items-center gap-2.5">
          {/* Action CTAs */}
          <button
            onClick={() => setIsPostNeedModalOpen(true)}
            className="hidden sm:inline-flex items-center gap-1 px-3 py-1.5 text-xs font-semibold text-slate-700 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition-colors"
          >
            <Lightbulb className="w-3.5 h-3.5 text-amber-500" />
            <span>Post Need</span>
          </button>

          <a
            href="/UniShare-SourceCode.zip"
            download="UniShare-SourceCode.zip"
            className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-slate-700 hover:text-slate-900 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors border border-slate-200"
            title="Download full project source code as a ZIP archive"
          >
            <span>📦 Download ZIP</span>
          </a>

          <button
            onClick={() => setIsListItemModalOpen(true)}
            className="inline-flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-bold text-white bg-slate-900 hover:bg-slate-800 rounded-lg transition-colors shadow-xs"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>List Surplus</span>
          </button>

          {/* Interactive Role Switcher */}
          <div className="relative border-l border-slate-200 pl-2.5 ml-1">
            <button
              onClick={() => setRoleDropdownOpen(!roleDropdownOpen)}
              className="flex items-center gap-2 p-1.5 hover:bg-slate-100 rounded-lg transition-colors text-left"
              aria-label="Switch campus persona"
            >
              <img
                src={currentUser.avatar}
                alt={currentUser.name}
                className="w-7 h-7 rounded-full object-cover ring-1 ring-slate-300"
              />
              <div className="hidden xl:block">
                <p className="text-xs font-bold text-slate-900 leading-tight">{currentUser.name}</p>
                <p className="text-[10px] text-slate-500">{currentUser.departmentCode} Custodian</p>
              </div>
              <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
            </button>

            {roleDropdownOpen && (
              <div 
                className="absolute right-0 mt-2 w-80 bg-white text-slate-800 rounded-xl shadow-xl border border-slate-200 p-2 z-50 animate-in fade-in zoom-in-95"
                onMouseLeave={() => setRoleDropdownOpen(false)}
              >
                <div className="px-3 py-2 border-b border-slate-100">
                  <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Campus Role Simulator</p>
                  <p className="text-xs text-slate-500 mt-0.5">Switch personas to test approvals, permissions, and sign-offs</p>
                </div>

                <div className="space-y-1 mt-1">
                  {[
                    { role: 'custodian', label: 'Dept Resource Custodian', name: 'Dr. Marcus Vance', dept: 'CS & Engineering (Alan Turing Hall)', desc: 'Can approve requests, list surplus & issue gate passes' },
                    { role: 'requester', label: 'Faculty & Lab Requester', name: 'Elena Rostova, M.Sc.', dept: 'Chemistry Dept (Curie Complex)', desc: 'Can submit transfer requests & confirm delivery' },
                    { role: 'admin', label: 'Campus Super-Admin', name: 'Director Sarah Jenkins', dept: 'Procurement & Sustainability (Founder Hall)', desc: 'Campus-wide analytics, audit logs & governance' },
                  ].map((p) => {
                    const isSelected = currentRole === p.role;
                    return (
                      <button
                        key={p.role}
                        onClick={() => {
                          setRole(p.role as Role);
                          setRoleDropdownOpen(false);
                        }}
                        className={`w-full text-left p-2.5 rounded-lg text-xs transition-colors flex items-start gap-2.5 ${
                          isSelected ? 'bg-emerald-50 text-emerald-950 font-medium' : 'hover:bg-slate-50 text-slate-700'
                        }`}
                      >
                        <div className={`w-2 h-2 rounded-full mt-1.5 shrink-0 ${isSelected ? 'bg-emerald-600' : 'bg-slate-300'}`}></div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between">
                            <span className="font-bold text-slate-900">{p.name}</span>
                            {isSelected && <Check className="w-3.5 h-3.5 text-emerald-600" />}
                          </div>
                          <p className="text-[11px] text-emerald-700 font-medium">{p.label}</p>
                          <p className="text-[10px] text-slate-500 truncate">{p.dept}</p>
                        </div>
                      </button>
                    );
                  })}
                </div>

                <div className="mt-2 pt-2 border-t border-slate-100 px-2 flex items-center justify-between">
                  <span className="text-[10px] text-slate-400">Sample testing data</span>
                  <button
                    onClick={() => {
                      resetToDefaults();
                      setRoleDropdownOpen(false);
                    }}
                    className="text-[10px] font-semibold text-rose-600 hover:text-rose-700 flex items-center gap-1"
                  >
                    <RotateCcw className="w-3 h-3" />
                    Reset Initial State
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Role Context & Notification Sub-Bar (Ultra-helpful for reviewers) */}
      <div className="bg-slate-900 text-slate-200 text-xs px-4 sm:px-6 py-2 border-t border-slate-800 flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-3 flex-wrap">
          <div className="flex items-center gap-1.5 font-medium text-slate-300">
            <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
            <span>Active View:</span>
            <strong className="text-white font-bold">{currentUser.name}</strong>
            <span className="text-slate-400 font-normal">({currentUser.roleTitle} · {currentUser.department})</span>
          </div>

          {pendingForCurrentUser > 0 && (
            <button
              onClick={() => setActiveTab('pipeline')}
              className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded bg-amber-500/20 text-amber-300 font-semibold border border-amber-500/30 text-[11px] hover:bg-amber-500/30 transition-colors"
            >
              <span>{pendingForCurrentUser} action awaiting review</span>
              <ArrowRight className="w-3 h-3" />
            </button>
          )}
        </div>

        {/* Quick Role Switch Buttons (For fast demoing) */}
        <div className="flex items-center gap-1 text-[11px]">
          <span className="text-slate-400 hidden sm:inline mr-1">Switch persona:</span>
          {(['custodian', 'requester', 'admin'] as Role[]).map(r => (
            <button
              key={r}
              onClick={() => setRole(r)}
              className={`px-2 py-0.5 rounded transition-colors ${
                currentRole === r
                  ? 'bg-emerald-600 text-white font-bold'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800'
              }`}
            >
              {r === 'custodian' ? 'CS Custodian' : r === 'requester' ? 'Chemistry Requester' : 'Procurement Admin'}
            </button>
          ))}
        </div>
      </div>

      {/* Mobile Navigation Tabs (when viewport is small) */}
      <div className="lg:hidden flex items-center gap-1 overflow-x-auto px-4 py-2 bg-slate-50 border-t border-slate-200 text-xs font-semibold">
        <button
          onClick={() => setActiveTab('catalog')}
          className={`px-3 py-1.5 rounded-lg whitespace-nowrap ${activeTab === 'catalog' ? 'bg-slate-900 text-white' : 'text-slate-600'}`}
        >
          Catalog ({availableItemsCount})
        </button>
        <button
          onClick={() => setActiveTab('pipeline')}
          className={`px-3 py-1.5 rounded-lg whitespace-nowrap ${activeTab === 'pipeline' ? 'bg-slate-900 text-white' : 'text-slate-600'}`}
        >
          Pipeline ({activeRequestsCount})
        </button>
        <button
          onClick={() => setActiveTab('wishlist')}
          className={`px-3 py-1.5 rounded-lg whitespace-nowrap ${activeTab === 'wishlist' ? 'bg-slate-900 text-white' : 'text-slate-600'}`}
        >
          Wishlist ({openNeedsCount})
        </button>
        <button
          onClick={() => setActiveTab('analytics')}
          className={`px-3 py-1.5 rounded-lg whitespace-nowrap ${activeTab === 'analytics' ? 'bg-slate-900 text-white' : 'text-slate-600'}`}
        >
          Impact
        </button>
        <button
          onClick={() => setActiveTab('admin')}
          className={`px-3 py-1.5 rounded-lg whitespace-nowrap ${activeTab === 'admin' ? 'bg-slate-900 text-white' : 'text-slate-600'}`}
        >
          Audit
        </button>
      </div>
    </header>
  );
};
