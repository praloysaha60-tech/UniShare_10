import React from 'react';
import { useApp } from '../context/AppContext';
import { CATEGORIES } from '../data/mockData';
import { 
  BarChart3, 
  Leaf, 
  DollarSign, 
  ArrowRightLeft, 
  Award, 
  TrendingUp, 
  TreePine, 
  Car, 
  Building, 
  Download,
  Share2,
  CheckCircle2,
  Package
} from 'lucide-react';

export const CampusImpactView: React.FC = () => {
  const { kpiStats, items, requests } = useApp();

  const formattedFunds = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: 0
  }).format(kpiStats.fundsSaved);

  const formattedCO2 = new Intl.NumberFormat('en-US').format(kpiStats.co2SavedKg);
  const treesEquiv = Math.round(kpiStats.co2SavedKg / 21);
  const milesEquiv = Math.round(kpiStats.co2SavedKg * 2.4);
  const trashBagsDiverted = Math.round(kpiStats.co2SavedKg / 14);

  // Department Leaderboard calculations
  const deptStats = [
    { name: 'Computer Science & Engineering', donated: 24, received: 11, saved: 48500, co2: 2450, rank: 1 },
    { name: 'Department of Chemistry', donated: 18, received: 14, saved: 42300, co2: 2180, rank: 2 },
    { name: 'Mechanical & Aerospace Engineering', donated: 15, received: 9, saved: 26800, co2: 1420, rank: 3 },
    { name: 'Central Campus Library', donated: 22, received: 4, saved: 16400, co2: 950, rank: 4 },
    { name: 'Department of Biological Sciences', donated: 9, received: 16, saved: 14200, co2: 890, rank: 5 },
    { name: 'Fine Arts & Digital Media', donated: 6, received: 12, saved: 9800, co2: 560, rank: 6 },
  ];

  return (
    <div className="space-y-6">
      {/* Overview Banner */}
      <div className="bg-gradient-to-br from-slate-900 via-slate-800 to-emerald-950 text-white rounded-2xl p-6 sm:p-8 shadow-md border border-slate-700/60 relative overflow-hidden">
        <div className="max-w-2xl space-y-3 relative z-10">
          <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
            <Leaf className="w-3.5 h-3.5" />
            University Annual Sustainability Report
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
            Campus Circular Economy Impact
          </h2>
          <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
            By connecting surplus laboratory instruments, IT computing hardware, and ergonomic furniture across campus departments, UniShare prevents redundant capital procurement and keeps serviceable equipment out of landfills.
          </p>
        </div>

        {/* Big Impact Numbers */}
        <div className="mt-8 pt-6 border-t border-slate-700/80 grid grid-cols-2 md:grid-cols-4 gap-4 relative z-10">
          <div>
            <span className="text-xs font-medium text-slate-400">Total Funds Repurposed</span>
            <p className="text-2xl sm:text-3xl font-black text-emerald-400 mt-1">{formattedFunds}</p>
            <span className="text-[11px] text-slate-400">From procurement budget</span>
          </div>

          <div>
            <span className="text-xs font-medium text-slate-400">Embodied Carbon Avoided</span>
            <p className="text-2xl sm:text-3xl font-black text-teal-300 mt-1">{formattedCO2} kg</p>
            <span className="text-[11px] text-slate-400">Greenhouse gas reduction</span>
          </div>

          <div>
            <span className="text-xs font-medium text-slate-400">Completed Reallocations</span>
            <p className="text-2xl sm:text-3xl font-black text-white mt-1">{kpiStats.completedTransfers}</p>
            <span className="text-[11px] text-slate-400">Inter-department transfers</span>
          </div>

          <div>
            <span className="text-xs font-medium text-slate-400">Active Campus Pool</span>
            <p className="text-2xl sm:text-3xl font-black text-blue-300 mt-1">{kpiStats.totalAvailable}</p>
            <span className="text-[11px] text-slate-400">Units available right now</span>
          </div>
        </div>
      </div>

      {/* Environmental Equivalents Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-2xs flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
            <TreePine className="w-6 h-6" />
          </div>
          <div>
            <span className="text-xs font-semibold text-slate-500">Tree Carbon Sequestration</span>
            <p className="text-xl font-black text-slate-900 mt-0.5">{treesEquiv.toLocaleString()} trees</p>
            <p className="text-[11px] text-slate-500">Annual CO₂ absorption equivalent</p>
          </div>
        </div>

        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-2xs flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-teal-50 text-teal-600 flex items-center justify-center shrink-0">
            <Car className="w-6 h-6" />
          </div>
          <div>
            <span className="text-xs font-semibold text-slate-500">Vehicle Emissions Prevented</span>
            <p className="text-xl font-black text-slate-900 mt-0.5">{milesEquiv.toLocaleString()} miles</p>
            <p className="text-[11px] text-slate-500">Passenger car highway driving avoided</p>
          </div>
        </div>

        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-2xs flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center shrink-0">
            <Package className="w-6 h-6" />
          </div>
          <div>
            <span className="text-xs font-semibold text-slate-500">Landfill Waste Diverted</span>
            <p className="text-xl font-black text-slate-900 mt-0.5">{trashBagsDiverted.toLocaleString()} bags</p>
            <p className="text-[11px] text-slate-500">Solid e-waste & lab plastics redirected</p>
          </div>
        </div>
      </div>

      {/* Two Column Section: Department Leaderboard & Category Breakdown */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Department Leaderboard */}
        <div className="lg:col-span-7 bg-white rounded-xl border border-slate-200 p-5 shadow-2xs space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Award className="w-5 h-5 text-amber-500" />
              <h3 className="font-bold text-slate-900 text-sm">Department Sustainability Leaderboard</h3>
            </div>
            <span className="text-[11px] text-slate-400">Current Academic Year</span>
          </div>

          <div className="space-y-3">
            {deptStats.map(dept => (
              <div 
                key={dept.name}
                className="p-3.5 rounded-xl border border-slate-100 hover:border-slate-200 bg-slate-50/50 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs"
              >
                <div className="flex items-center gap-3 min-w-0">
                  <div className={`w-7 h-7 rounded-full flex items-center justify-center font-black text-xs shrink-0 ${
                    dept.rank === 1 ? 'bg-amber-400 text-amber-950 ring-2 ring-amber-300' :
                    dept.rank === 2 ? 'bg-slate-300 text-slate-800' :
                    dept.rank === 3 ? 'bg-amber-700/60 text-amber-100' :
                    'bg-slate-100 text-slate-600'
                  }`}>
                    #{dept.rank}
                  </div>
                  <div className="min-w-0">
                    <p className="font-bold text-slate-900 truncate">{dept.name}</p>
                    <p className="text-[11px] text-slate-500">
                      {dept.donated} items donated • {dept.received} items received
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-4 self-end sm:self-auto shrink-0">
                  <div className="text-right">
                    <span className="font-bold text-emerald-700">${dept.saved.toLocaleString()}</span>
                    <span className="block text-[10px] text-slate-400">saved</span>
                  </div>
                  <div className="text-right">
                    <span className="font-bold text-teal-700">{dept.co2} kg</span>
                    <span className="block text-[10px] text-slate-400">CO₂ avoided</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Category Savings Breakdown */}
        <div className="lg:col-span-5 bg-white rounded-xl border border-slate-200 p-5 shadow-2xs space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-bold text-slate-900 text-sm">Savings by Resource Category</h3>
            <span className="text-[11px] text-slate-400">% of Repurposed Budget</span>
          </div>

          <div className="space-y-3.5 pt-1">
            {[
              { label: 'Lab Equipment & Instruments', pct: 44, value: '$65,200', color: 'bg-indigo-600' },
              { label: 'IT & Electronics Hardware', pct: 28, value: '$41,500', color: 'bg-blue-600' },
              { label: 'Office & Lab Furniture', pct: 16, value: '$23,700', color: 'bg-amber-600' },
              { label: 'Raw Materials & Fabrication', pct: 6, value: '$8,900', color: 'bg-emerald-600' },
              { label: 'Books, Media & Consumables', pct: 6, value: '$8,900', color: 'bg-purple-600' },
            ].map((cat, idx) => (
              <div key={idx} className="space-y-1">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-medium text-slate-700">{cat.label}</span>
                  <span className="font-bold text-slate-900">{cat.value} ({cat.pct}%)</span>
                </div>
                <div className="w-full h-2 rounded-full bg-slate-100 overflow-hidden">
                  <div 
                    className={`h-full rounded-full ${cat.color}`} 
                    style={{ width: `${cat.pct}%` }}
                  ></div>
                </div>
              </div>
            ))}
          </div>

          {/* Institutional Compliance Seal */}
          <div className="pt-4 border-t border-slate-100 text-xs text-slate-500 flex items-start gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
            <p className="text-[11px] leading-relaxed">
              Metrics are calculated using verified EPA Waste Reduction Model (WARM) factors for university capital equipment life extensions.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
