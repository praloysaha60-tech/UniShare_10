import React from 'react';
import { useApp } from '../context/AppContext';
import { 
  Package, 
  DollarSign, 
  Leaf, 
  ArrowRightLeft, 
  TrendingUp, 
  CheckCircle2, 
  TreePine, 
  Car, 
  Sparkles,
  ArrowRight,
  ShieldCheck
} from 'lucide-react';

export const DashboardKPIs: React.FC = () => {
  const { kpiStats, items, setActiveTab } = useApp();

  const formattedFunds = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: 0
  }).format(kpiStats.fundsSaved);

  const formattedCO2 = new Intl.NumberFormat('en-US').format(kpiStats.co2SavedKg);
  const treesPlantedEquiv = Math.round(kpiStats.co2SavedKg / 21);
  const carMilesPrevented = Math.round(kpiStats.co2SavedKg * 2.4);

  return (
    <div className="space-y-4 mb-6">
      {/* 4 Primary KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Card 1: Available Surplus */}
        <div 
          onClick={() => setActiveTab('catalog')}
          className="bg-white rounded-xl p-4.5 border border-slate-200/90 shadow-2xs hover:border-slate-300 hover:shadow-xs transition-all cursor-pointer group"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500">Available Surplus</span>
            <div className="w-8 h-8 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center group-hover:scale-105 transition-transform">
              <Package className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-2xl font-black tracking-tight text-slate-900 font-mono tabular-nums">{kpiStats.totalAvailable}</span>
            <span className="text-xs font-medium text-slate-500">items ready</span>
          </div>
          <div className="mt-2.5 flex items-center justify-between text-xs text-slate-500 border-t border-slate-100 pt-2">
            <span className="text-slate-600 font-medium">
              Across 8 campus departments
            </span>
            <span className="text-blue-600 font-bold group-hover:translate-x-0.5 transition-transform inline-flex items-center gap-0.5">
              Browse <ArrowRight className="w-3 h-3" />
            </span>
          </div>
        </div>

        {/* Card 2: Campus Funds Saved */}
        <div 
          onClick={() => setActiveTab('analytics')}
          className="bg-white rounded-xl p-4.5 border border-slate-200/90 shadow-2xs hover:border-slate-300 hover:shadow-xs transition-all cursor-pointer group"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500">Procurement Saved</span>
            <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center group-hover:scale-105 transition-transform">
              <DollarSign className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-2xl font-black tracking-tight text-emerald-700 font-mono tabular-nums">{formattedFunds}</span>
            <span className="text-xs font-medium text-emerald-700 bg-emerald-50 px-1.5 py-0.2 rounded">
              Saved
            </span>
          </div>
          <div className="mt-2.5 flex items-center justify-between text-xs text-slate-500 border-t border-slate-100 pt-2">
            <span className="flex items-center gap-1 text-slate-600">
              <TrendingUp className="w-3 h-3 text-emerald-600" />
              Capital budget repurposed
            </span>
            <span className="text-emerald-700 font-bold group-hover:translate-x-0.5 transition-transform inline-flex items-center gap-0.5">
              Breakdown <ArrowRight className="w-3 h-3" />
            </span>
          </div>
        </div>

        {/* Card 3: Environmental / CO2 Impact */}
        <div 
          onClick={() => setActiveTab('analytics')}
          className="bg-white rounded-xl p-4.5 border border-slate-200/90 shadow-2xs hover:border-slate-300 hover:shadow-xs transition-all cursor-pointer group"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500">Embodied CO₂ Prevented</span>
            <div className="w-8 h-8 rounded-lg bg-teal-50 text-teal-600 flex items-center justify-center group-hover:scale-105 transition-transform">
              <Leaf className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-2xl font-black tracking-tight text-slate-900 font-mono tabular-nums">{formattedCO2}</span>
            <span className="text-xs font-medium text-slate-500">kg CO₂e</span>
          </div>
          <div className="mt-2.5 flex items-center justify-between text-xs text-slate-500 border-t border-slate-100 pt-2">
            <span className="flex items-center gap-1 text-teal-700 font-medium">
              <TreePine className="w-3 h-3 text-teal-600" />
              ~{treesPlantedEquiv} trees absorption
            </span>
            <span className="text-teal-700 font-bold group-hover:translate-x-0.5 transition-transform inline-flex items-center gap-0.5">
              Impact <ArrowRight className="w-3 h-3" />
            </span>
          </div>
        </div>

        {/* Card 4: Inter-Dept Transfers */}
        <div 
          onClick={() => setActiveTab('pipeline')}
          className="bg-white rounded-xl p-4.5 border border-slate-200/90 shadow-2xs hover:border-slate-300 hover:shadow-xs transition-all cursor-pointer group"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500">Completed Transfers</span>
            <div className="w-8 h-8 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center group-hover:scale-105 transition-transform">
              <ArrowRightLeft className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-2xl font-black tracking-tight text-slate-900 font-mono tabular-nums">{kpiStats.completedTransfers}</span>
            <span className="text-xs font-medium text-indigo-700 bg-indigo-50 px-1.5 py-0.2 rounded">
              Verified
            </span>
          </div>
          <div className="mt-2.5 flex items-center justify-between text-xs text-slate-500 border-t border-slate-100 pt-2">
            <span className="text-slate-600">
              {kpiStats.pendingTransfers} active in pipeline
            </span>
            <span className="text-indigo-700 font-bold group-hover:translate-x-0.5 transition-transform inline-flex items-center gap-0.5">
              Pipeline <ArrowRight className="w-3 h-3" />
            </span>
          </div>
        </div>
      </div>

      {/* Sustainable Campus Micro-Banner with Quick Guide */}
      <div className="bg-slate-900 text-slate-200 rounded-xl p-3.5 px-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 border border-slate-800">
        <div className="flex items-center gap-2.5">
          <div className="p-1.5 rounded-md bg-emerald-500/20 text-emerald-400">
            <Sparkles className="w-4 h-4" />
          </div>
          <div className="text-xs">
            <span className="font-bold text-white">How UniShare Works:</span>
            <span className="text-slate-300 ml-1.5">
              1. Browse or post surplus ➔ 2. Request transfer ➔ 3. Custodian approves & issues Gate Pass ➔ 4. Pick up & confirm condition.
            </span>
          </div>
        </div>

        <div className="flex items-center gap-3 text-xs text-slate-400 shrink-0">
          <span className="flex items-center gap-1 text-emerald-300 font-medium">
            <Car className="w-3 h-3" /> {carMilesPrevented.toLocaleString()} miles avoided
          </span>
          <span>·</span>
          <button 
            onClick={() => setActiveTab('analytics')}
            className="text-white hover:text-emerald-300 underline font-semibold transition-colors"
          >
            Annual Report &rarr;
          </button>
        </div>
      </div>
    </div>
  );
};
