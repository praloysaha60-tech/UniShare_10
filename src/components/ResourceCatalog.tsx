import React, { useState, useMemo } from 'react';
import { useApp } from '../context/AppContext';
import { CATEGORIES } from '../data/mockData';
import { ResourceItem, CategoryId, Condition, Availability } from '../types';
import { 
  Search, 
  MapPin, 
  DollarSign, 
  Leaf, 
  Grid, 
  List, 
  SlidersHorizontal, 
  Building, 
  AlertTriangle, 
  ArrowRight, 
  RotateCcw,
  Sparkles,
  FlaskConical,
  Monitor,
  Armchair,
  BookOpen,
  Wrench,
  Boxes,
  CheckCircle2,
  Check
} from 'lucide-react';

export const ResourceCatalog: React.FC = () => {
  const { 
    items, 
    setSelectedDetailItem, 
    setRequestModalItem, 
    setIsListItemModalOpen,
    currentUser 
  } = useApp();

  // Filter states
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<CategoryId | 'all'>('all');
  const [selectedDept, setSelectedDept] = useState<string>('all');
  const [selectedCondition, setSelectedCondition] = useState<Condition | 'all'>('all');
  const [selectedAvailability, setSelectedAvailability] = useState<Availability | 'all'>('all');
  const [onlyHighValue, setOnlyHighValue] = useState(false);
  const [sortBy, setSortBy] = useState<'newest' | 'value-high' | 'co2-high' | 'quantity'>('newest');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [showFiltersPanel, setShowFiltersPanel] = useState(false);

  // Quick search suggestions
  const searchSuggestions = ['Dell Monitors', 'Spectrometer', 'Aeron Chairs', 'Oscilloscope', '3D Printer', 'Nitrile Gloves', 'Microscope'];

  // Distinct departments from items
  const departments = useMemo(() => {
    const set = new Set(items.map(i => i.departmentName));
    return Array.from(set).sort();
  }, [items]);

  // Filtered and sorted items
  const filteredItems = useMemo(() => {
    return items.filter(item => {
      // Search keyword
      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase();
        const matchesTitle = item.title.toLowerCase().includes(query);
        const matchesTag = item.assetTag.toLowerCase().includes(query);
        const matchesDept = item.departmentName.toLowerCase().includes(query);
        const matchesDesc = item.description.toLowerCase().includes(query);
        const matchesModel = item.modelSerial?.toLowerCase().includes(query);
        if (!matchesTitle && !matchesTag && !matchesDept && !matchesDesc && !matchesModel) {
          return false;
        }
      }

      // High value filter
      if (onlyHighValue && item.estValue < 5000) {
        return false;
      }

      // Category
      if (selectedCategory !== 'all' && item.category !== selectedCategory) {
        return false;
      }

      // Department
      if (selectedDept !== 'all' && item.departmentName !== selectedDept) {
        return false;
      }

      // Condition
      if (selectedCondition !== 'all' && item.condition !== selectedCondition) {
        return false;
      }

      // Availability
      if (selectedAvailability !== 'all' && item.availability !== selectedAvailability) {
        return false;
      }

      return true;
    }).sort((a, b) => {
      if (sortBy === 'newest') {
        return new Date(b.dateListed).getTime() - new Date(a.dateListed).getTime();
      }
      if (sortBy === 'value-high') {
        return b.estValue - a.estValue;
      }
      if (sortBy === 'co2-high') {
        return b.co2SavingsKg - a.co2SavingsKg;
      }
      if (sortBy === 'quantity') {
        return b.quantity - a.quantity;
      }
      return 0;
    });
  }, [items, searchQuery, selectedCategory, selectedDept, selectedCondition, selectedAvailability, onlyHighValue, sortBy]);

  // Active filters count
  const activeFiltersCount = (selectedCategory !== 'all' ? 1 : 0) +
    (selectedDept !== 'all' ? 1 : 0) +
    (selectedCondition !== 'all' ? 1 : 0) +
    (selectedAvailability !== 'all' ? 1 : 0) +
    (onlyHighValue ? 1 : 0) +
    (searchQuery.trim() ? 1 : 0);

  const resetFilters = () => {
    setSearchQuery('');
    setSelectedCategory('all');
    setSelectedDept('all');
    setSelectedCondition('all');
    setSelectedAvailability('all');
    setOnlyHighValue(false);
    setSortBy('newest');
  };

  const getCategoryIcon = (catId: CategoryId) => {
    switch (catId) {
      case 'lab-equipment': return <FlaskConical className="w-3.5 h-3.5" />;
      case 'it-electronics': return <Monitor className="w-3.5 h-3.5" />;
      case 'office-furniture': return <Armchair className="w-3.5 h-3.5" />;
      case 'books-media': return <BookOpen className="w-3.5 h-3.5" />;
      case 'raw-materials': return <Wrench className="w-3.5 h-3.5" />;
      case 'consumables': return <Boxes className="w-3.5 h-3.5" />;
    }
  };

  return (
    <div className="space-y-5">
      {/* Search & Top Action Bar */}
      <div className="bg-white rounded-xl p-4 sm:p-5 border border-slate-200 shadow-2xs space-y-4">
        {/* Main Search Bar & Primary Actions */}
        <div className="flex flex-col md:flex-row items-stretch md:items-center gap-3">
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by keyword, asset tag (e.g. CS-MON), model serial, or equipment name..."
              className="w-full pl-10 pr-10 py-2.5 bg-slate-50 hover:bg-slate-100/60 focus:bg-white text-xs sm:text-sm text-slate-900 placeholder-slate-400 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-slate-400 hover:text-slate-600 bg-slate-200/80 rounded-full w-5 h-5 flex items-center justify-center"
              >
                ✕
              </button>
            )}
          </div>

          {/* Quick Controls */}
          <div className="flex items-center gap-2 shrink-0">
            <button
              onClick={() => setShowFiltersPanel(!showFiltersPanel)}
              className={`inline-flex items-center gap-1.5 px-3 py-2.5 rounded-lg text-xs font-semibold border transition-all ${
                showFiltersPanel || activeFiltersCount > 0
                  ? 'bg-emerald-50 border-emerald-300 text-emerald-900 shadow-2xs'
                  : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50'
              }`}
            >
              <SlidersHorizontal className="w-3.5 h-3.5 text-emerald-600" />
              <span>Filters</span>
              {activeFiltersCount > 0 && (
                <span className="w-4 h-4 rounded-full bg-emerald-600 text-white text-[10px] font-bold flex items-center justify-center font-mono">
                  {activeFiltersCount}
                </span>
              )}
            </button>

            {/* Sort Dropdown */}
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              aria-label="Sort resources by"
              className="bg-white border border-slate-200 text-xs font-medium text-slate-700 py-2.5 px-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 cursor-pointer"
            >
              <option value="newest">Sort: Newly Listed</option>
              <option value="value-high">Sort: Highest Value ($)</option>
              <option value="co2-high">Sort: Top CO₂ Savings</option>
              <option value="quantity">Sort: Available Quantity</option>
            </select>

            {/* View Mode Toggle */}
            <div className="hidden sm:flex items-center bg-slate-100 p-0.5 rounded-lg border border-slate-200 text-slate-500">
              <button
                onClick={() => setViewMode('grid')}
                className={`p-1.5 rounded-md transition-colors ${viewMode === 'grid' ? 'bg-white text-slate-900 shadow-2xs' : 'hover:text-slate-900'}`}
                title="Grid View"
              >
                <Grid className="w-4 h-4" />
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`p-1.5 rounded-md transition-colors ${viewMode === 'list' ? 'bg-white text-slate-900 shadow-2xs' : 'hover:text-slate-900'}`}
                title="List View"
              >
                <List className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        {/* Quick Search Tag Suggestions */}
        <div className="flex items-center gap-1.5 overflow-x-auto scrollbar-none text-xs">
          <span className="text-slate-400 font-medium shrink-0">Popular:</span>
          {searchSuggestions.map((tag) => (
            <button
              key={tag}
              onClick={() => setSearchQuery(tag)}
              className="px-2 py-0.5 bg-slate-100 hover:bg-slate-200 text-slate-600 rounded-md transition-colors whitespace-nowrap text-[11px]"
            >
              {tag}
            </button>
          ))}
        </div>

        {/* Quick Curated Category Bar */}
        <div className="flex items-center gap-1.5 overflow-x-auto scrollbar-none pt-2 border-t border-slate-100">
          <button
            onClick={() => { setSelectedCategory('all'); setOnlyHighValue(false); }}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors ${
              selectedCategory === 'all' && !onlyHighValue
                ? 'bg-slate-900 text-white'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            All Surplus ({items.length})
          </button>

          <button
            onClick={() => setOnlyHighValue(!onlyHighValue)}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors flex items-center gap-1 ${
              onlyHighValue
                ? 'bg-amber-600 text-white shadow-2xs'
                : 'bg-slate-50 text-slate-700 hover:bg-slate-100 border border-slate-200'
            }`}
          >
            <span>💎 High Value (&gt;$5k)</span>
          </button>

          {CATEGORIES.map(cat => {
            const count = items.filter(i => i.category === cat.id).length;
            const isSelected = selectedCategory === cat.id;
            return (
              <button
                key={cat.id}
                onClick={() => { setSelectedCategory(cat.id); setOnlyHighValue(false); }}
                className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors ${
                  isSelected
                    ? 'bg-emerald-700 text-white shadow-2xs'
                    : 'bg-slate-50 text-slate-700 hover:bg-slate-100 border border-slate-200'
                }`}
              >
                {getCategoryIcon(cat.id)}
                <span>{cat.name.split('&')[0]}</span>
                <span className="font-mono text-[10px] opacity-75">({count})</span>
              </button>
            );
          })}
        </div>

        {/* Collapsible Advanced Filters Row */}
        {showFiltersPanel && (
          <div className="pt-3 border-t border-slate-100 grid grid-cols-1 sm:grid-cols-3 gap-3 animate-in fade-in">
            <div>
              <label className="block text-[11px] font-semibold text-slate-500 uppercase tracking-wider mb-1">
                Donor Department
              </label>
              <select
                value={selectedDept}
                onChange={(e) => setSelectedDept(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 text-xs text-slate-800 rounded-lg p-2 focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
              >
                <option value="all">All Departments ({departments.length})</option>
                {departments.map(dept => (
                  <option key={dept} value={dept}>{dept}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-[11px] font-semibold text-slate-500 uppercase tracking-wider mb-1">
                Equipment Condition
              </label>
              <select
                value={selectedCondition}
                onChange={(e) => setSelectedCondition(e.target.value as any)}
                className="w-full bg-slate-50 border border-slate-200 text-xs text-slate-800 rounded-lg p-2 focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
              >
                <option value="all">All Conditions</option>
                <option value="new">New / Factory Sealed</option>
                <option value="excellent">Excellent (Like New)</option>
                <option value="good">Good (Normal Operational)</option>
                <option value="fair">Fair (Usable with Wear)</option>
                <option value="needs-repair">Needs Service / Repair</option>
              </select>
            </div>

            <div>
              <label className="block text-[11px] font-semibold text-slate-500 uppercase tracking-wider mb-1">
                Availability Window
              </label>
              <select
                value={selectedAvailability}
                onChange={(e) => setSelectedAvailability(e.target.value as any)}
                className="w-full bg-slate-50 border border-slate-200 text-xs text-slate-800 rounded-lg p-2 focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
              >
                <option value="all">All Availability</option>
                <option value="immediate">Immediate Transfer</option>
                <option value="next-month">Available Next Month</option>
                <option value="reserve-only">Reserve Only</option>
              </select>
            </div>
          </div>
        )}

        {/* Active Filters Pill Bar */}
        {activeFiltersCount > 0 && (
          <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-slate-100 text-xs text-slate-500">
            <span className="font-semibold text-slate-700">Filters:</span>
            {searchQuery && (
              <span className="bg-slate-100 text-slate-700 px-2 py-0.5 rounded border border-slate-200 flex items-center gap-1">
                "{searchQuery}"
                <button onClick={() => setSearchQuery('')} className="hover:text-rose-600">✕</button>
              </span>
            )}
            {onlyHighValue && (
              <span className="bg-amber-50 text-amber-900 px-2 py-0.5 rounded border border-amber-200 flex items-center gap-1">
                High Value (&gt;$5k)
                <button onClick={() => setOnlyHighValue(false)} className="hover:text-rose-600">✕</button>
              </span>
            )}
            {selectedCategory !== 'all' && (
              <span className="bg-slate-100 text-slate-700 px-2 py-0.5 rounded border border-slate-200 flex items-center gap-1">
                {CATEGORIES.find(c => c.id === selectedCategory)?.name.split('&')[0]}
                <button onClick={() => setSelectedCategory('all')} className="hover:text-rose-600">✕</button>
              </span>
            )}
            {selectedDept !== 'all' && (
              <span className="bg-slate-100 text-slate-700 px-2 py-0.5 rounded border border-slate-200 flex items-center gap-1">
                {selectedDept}
                <button onClick={() => setSelectedDept('all')} className="hover:text-rose-600">✕</button>
              </span>
            )}
            <button
              onClick={resetFilters}
              className="text-emerald-700 hover:text-emerald-800 font-semibold text-xs ml-auto flex items-center gap-1"
            >
              <RotateCcw className="w-3 h-3" /> Clear Filters
            </button>
          </div>
        )}
      </div>

      {/* Catalog Results Header */}
      <div className="flex items-center justify-between text-xs text-slate-500 px-1">
        <p>
          Showing <span className="font-bold text-slate-900 font-mono tabular-nums">{filteredItems.length}</span> of {items.length} campus surplus resources
        </p>
        <span className="hidden sm:inline text-slate-400">
          Click any card to inspect technical specifications or initiate transfer request
        </span>
      </div>

      {/* Empty State */}
      {filteredItems.length === 0 && (
        <div className="bg-white rounded-xl p-12 text-center border border-slate-200 shadow-xs max-w-lg mx-auto my-8">
          <div className="w-12 h-12 rounded-full bg-slate-100 text-slate-400 mx-auto flex items-center justify-center mb-3">
            <Search className="w-6 h-6" />
          </div>
          <h3 className="text-base font-bold text-slate-900">No surplus equipment matches your criteria</h3>
          <p className="text-xs text-slate-500 mt-1">Try clearing filters or search terms.</p>
          <button
            onClick={resetFilters}
            className="mt-4 px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-lg text-xs font-semibold transition-colors"
          >
            Reset Filters
          </button>
        </div>
      )}

      {/* Grid View */}
      {viewMode === 'grid' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredItems.map((item) => {
            const isOwner = currentUser.department === item.departmentName;
            const categoryObj = CATEGORIES.find(c => c.id === item.category);

            return (
              <div
                key={item.id}
                className="bg-white rounded-xl border border-slate-200/90 shadow-2xs hover:shadow-md hover:border-slate-300 transition-all flex flex-col overflow-hidden group"
              >
                {/* Photo Preview Container with Zero-Broken-Image Policy */}
                <div 
                  onClick={() => setSelectedDetailItem(item)}
                  className="relative h-48 w-full bg-slate-100 overflow-hidden cursor-pointer"
                >
                  {item.imageUrl ? (
                    <img
                      src={item.imageUrl}
                      alt={item.title}
                      referrerPolicy="no-referrer"
                      className="w-full h-full object-cover group-hover:scale-103 transition-transform duration-300"
                    />
                  ) : (
                    <div className="w-full h-full flex flex-col items-center justify-center text-slate-400 bg-slate-50">
                      {getCategoryIcon(item.category)}
                      <span className="text-xs font-medium mt-1">Surplus Inventory</span>
                    </div>
                  )}

                  {/* Overlaid Badges */}
                  <div className="absolute top-2.5 left-2.5">
                    <span className="font-mono text-[10px] font-bold bg-slate-900/85 text-white px-2 py-0.5 rounded shadow-xs">
                      {item.assetTag}
                    </span>
                  </div>

                  <div className="absolute bottom-2.5 right-2.5">
                    <span className="font-mono text-xs font-bold bg-white/95 text-slate-900 px-2 py-0.5 rounded shadow-sm backdrop-blur-xs">
                      <strong className="text-emerald-700 font-extrabold">{item.quantity}</strong> {item.unit}
                    </span>
                  </div>
                </div>

                {/* Card Body */}
                <div className="p-4 flex-1 flex flex-col justify-between space-y-3">
                  <div>
                    {/* Metadata Header (Zero-Pill Discipline with · separators) */}
                    <div className="flex items-center gap-1.5 text-xs text-slate-500 mb-1">
                      <span className="font-semibold text-slate-700">{categoryObj?.name.split('&')[0]}</span>
                      <span aria-hidden="true">·</span>
                      <span className="capitalize">{item.condition}</span>
                      <span aria-hidden="true">·</span>
                      <span className="text-slate-400 font-mono text-[11px]">{item.dateListed}</span>
                    </div>

                    <h4 
                      onClick={() => setSelectedDetailItem(item)}
                      className="font-bold text-sm text-slate-900 line-clamp-2 hover:text-emerald-700 cursor-pointer transition-colors leading-snug"
                    >
                      {item.title}
                    </h4>

                    {/* Department & Location */}
                    <div className="mt-2 text-xs text-slate-600 space-y-0.5">
                      <p className="font-medium text-slate-800 truncate flex items-center gap-1">
                        <Building className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                        {item.departmentName}
                      </p>
                      <p className="text-[11px] text-slate-500 truncate flex items-center gap-1">
                        <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                        {item.location.building} · {item.location.room}
                      </p>
                    </div>

                    {/* Logistics or Hazard alert */}
                    {item.handlingNotes && (
                      <p className="mt-2 text-[11px] text-amber-800 bg-amber-50 p-1.5 px-2 rounded border border-amber-200/80 truncate flex items-center gap-1">
                        <AlertTriangle className="w-3 h-3 text-amber-600 shrink-0" />
                        {item.handlingNotes}
                      </p>
                    )}
                  </div>

                  {/* Pricing & Impact Metrics */}
                  <div className="pt-2.5 border-t border-slate-100 flex items-center justify-between text-xs">
                    <div>
                      <span className="text-[10px] text-slate-400 block font-medium">Replacement Value</span>
                      <span className="font-bold text-slate-900 font-mono tabular-nums">
                        ${item.estValue.toLocaleString()}
                      </span>
                    </div>

                    <div className="text-right">
                      <span className="text-[10px] text-slate-400 block font-medium">CO₂ Prevented</span>
                      <span className="font-bold text-teal-700 font-mono tabular-nums flex items-center justify-end gap-0.5">
                        <Leaf className="w-3 h-3 text-teal-600" />
                        {item.co2SavingsKg} kg
                      </span>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="pt-1 flex items-center gap-2">
                    <button
                      onClick={() => setSelectedDetailItem(item)}
                      className="flex-1 py-2 px-2.5 rounded-lg border border-slate-200 hover:bg-slate-50 text-slate-700 font-semibold text-xs transition-colors text-center"
                    >
                      Specifications
                    </button>

                    {item.status === 'available' ? (
                      <button
                        onClick={() => setRequestModalItem(item)}
                        disabled={isOwner}
                        className={`flex-1 py-2 px-2.5 rounded-lg font-bold text-xs transition-colors flex items-center justify-center gap-1 shadow-2xs ${
                          isOwner 
                            ? 'bg-slate-100 text-slate-400 cursor-not-allowed'
                            : 'bg-emerald-600 hover:bg-emerald-700 text-white'
                        }`}
                        title={isOwner ? "Surplus from your department" : "Submit transfer request"}
                      >
                        <span>{isOwner ? "Your Department" : "Request"}</span>
                        {!isOwner && <ArrowRight className="w-3.5 h-3.5" />}
                      </button>
                    ) : (
                      <span className="flex-1 py-2 px-2.5 rounded-lg bg-slate-100 text-slate-400 font-medium text-xs text-center">
                        Reserved
                      </span>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* List View */}
      {viewMode === 'list' && (
        <div className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-2xs divide-y divide-slate-100">
          {filteredItems.map((item) => {
            const isOwner = currentUser.department === item.departmentName;
            return (
              <div 
                key={item.id}
                className="p-4 hover:bg-slate-50/70 transition-colors flex flex-col md:flex-row items-start md:items-center justify-between gap-4"
              >
                <div className="flex items-start gap-3.5 flex-1 min-w-0">
                  <div className="w-16 h-16 rounded-lg bg-slate-100 overflow-hidden shrink-0 border border-slate-200">
                    {item.imageUrl ? (
                      <img src={item.imageUrl} alt={item.title} className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-slate-400">
                        {getCategoryIcon(item.category)}
                      </div>
                    )}
                  </div>

                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2 text-xs text-slate-500 mb-0.5">
                      <span className="font-mono font-bold text-slate-700">{item.assetTag}</span>
                      <span aria-hidden="true">·</span>
                      <span className="capitalize">{item.condition}</span>
                      <span aria-hidden="true">·</span>
                      <span className="truncate">{item.departmentName}</span>
                    </div>

                    <h4 
                      onClick={() => setSelectedDetailItem(item)}
                      className="font-bold text-sm text-slate-900 hover:text-emerald-700 cursor-pointer truncate"
                    >
                      {item.title}
                    </h4>

                    <p className="text-xs text-slate-500 truncate mt-0.5">
                      {item.location.building} · Custodian: {item.custodianName}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-6 self-stretch md:self-auto justify-between md:justify-end border-t md:border-t-0 pt-3 md:pt-0 border-slate-100">
                  <div className="text-right">
                    <span className="text-xs text-slate-500 block">Available</span>
                    <strong className="text-sm font-bold text-slate-900 font-mono tabular-nums">
                      {item.quantity} {item.unit}
                    </strong>
                  </div>

                  <div className="text-right">
                    <span className="text-xs text-slate-500 block">Value</span>
                    <span className="text-sm font-bold text-emerald-700 font-mono tabular-nums">
                      ${item.estValue.toLocaleString()}
                    </span>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => setSelectedDetailItem(item)}
                      className="px-3 py-1.5 rounded-lg border border-slate-200 hover:bg-slate-100 text-slate-700 text-xs font-semibold"
                    >
                      Specs
                    </button>
                    <button
                      onClick={() => setRequestModalItem(item)}
                      disabled={isOwner || item.status !== 'available'}
                      className={`px-3.5 py-1.5 rounded-lg text-xs font-bold ${
                        isOwner || item.status !== 'available'
                          ? 'bg-slate-100 text-slate-400 cursor-not-allowed'
                          : 'bg-emerald-600 hover:bg-emerald-700 text-white'
                      }`}
                    >
                      {isOwner ? "My Dept" : "Request"}
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
