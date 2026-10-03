import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { CATEGORIES, CAMPUS_DEPARTMENTS } from '../data/mockData';
import { CategoryId, Condition, Availability } from '../types';
import { 
  X, 
  Package, 
  MapPin, 
  Tag, 
  DollarSign, 
  Leaf, 
  AlertTriangle, 
  Check, 
  Upload, 
  Image as ImageIcon,
  ChevronRight,
  ChevronLeft,
  Sparkles
} from 'lucide-react';

export const ListItemModal: React.FC = () => {
  const { 
    isListItemModalOpen, 
    setIsListItemModalOpen, 
    addItem, 
    currentUser, 
    currentRole 
  } = useApp();

  const [step, setStep] = useState<1 | 2 | 3>(1);

  // Form states
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState<CategoryId>('lab-equipment');
  const [quantity, setQuantity] = useState(1);
  const [unit, setUnit] = useState('units');
  const [condition, setCondition] = useState<Condition>('excellent');
  const [estValue, setEstValue] = useState(1200);
  const [modelSerial, setModelSerial] = useState('');
  const [description, setDescription] = useState('');
  
  // Location & Logistics
  const [departmentName, setDepartmentName] = useState(currentUser.department);
  const [building, setBuilding] = useState('Science Building');
  const [room, setRoom] = useState('Room 102');
  const [campusArea, setCampusArea] = useState('North Quad');
  const [availability, setAvailability] = useState<Availability>('immediate');
  const [handlingNotes, setHandlingNotes] = useState('');
  const [safetyHazard, setSafetyHazard] = useState('');

  // Media
  const [imageUrl, setImageUrl] = useState('');

  if (!isListItemModalOpen) return null;

  // Auto-calculate CO2 savings based on category factor
  const catObj = CATEGORIES.find(c => c.id === category);
  const calculatedCO2 = Math.round((catObj?.co2Factor || 100) * quantity);

  // Presets for quick images
  const sampleImages: Record<CategoryId, string[]> = {
    'lab-equipment': [
      'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=800&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1582719508461-905c673771fd?w=800&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1581092160607-ee22621dd758?w=800&auto=format&fit=crop&q=80'
    ],
    'it-electronics': [
      'https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?w=800&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1611186871348-b1ce696e52c9?w=800&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1547394765-185e1317ac14?w=800&auto=format&fit=crop&q=80'
    ],
    'office-furniture': [
      'https://images.unsplash.com/photo-1580481077195-c3a821a58875?w=800&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1531403009284-440f080d1e12?w=800&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1518455027359-f3f8164ba6bd?w=800&auto=format&fit=crop&q=80'
    ],
    'books-media': [
      'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=800&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1497633762265-9d179a990aa6?w=800&auto=format&fit=crop&q=80'
    ],
    'raw-materials': [
      'https://images.unsplash.com/photo-1581092335397-9583fe92d232?w=800&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1504917599217-d4dc5ebe6122?w=800&auto=format&fit=crop&q=80'
    ],
    'consumables': [
      'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=800&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1583947215259-38e31be8751f?w=800&auto=format&fit=crop&q=80'
    ]
  };

  const handleFinish = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    addItem({
      title,
      category,
      departmentId: departmentName.toLowerCase().replace(/[^a-z0-9]/g, '-'),
      departmentName,
      location: {
        building,
        room,
        campusArea
      },
      quantity,
      unit,
      condition,
      estValue,
      co2SavingsKg: calculatedCO2,
      availability,
      description: description || 'Departmental surplus equipment in certified operational state, ready for campus reallocation.',
      modelSerial: modelSerial || undefined,
      handlingNotes: handlingNotes || undefined,
      safetyHazard: safetyHazard || undefined,
      imageUrl: imageUrl || sampleImages[category][0],
      custodianName: currentUser.name,
      custodianEmail: currentUser.email,
      custodianPhone: 'x4100'
    });

    setIsListItemModalOpen(false);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div 
        className="bg-white rounded-2xl max-w-2xl w-full border border-slate-200 shadow-2xl overflow-hidden animate-in fade-in zoom-in-95"
        role="dialog"
        aria-modal="true"
      >
        {/* Header */}
        <div className="flex items-center justify-between p-4 px-6 border-b border-slate-100 bg-slate-50/70">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-lg bg-emerald-100 text-emerald-800">
              <Package className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-slate-900 text-sm">List Department Surplus Equipment</h3>
              <p className="text-[11px] text-slate-500">Make idle inventory available across campus departments</p>
            </div>
          </div>
          <button
            onClick={() => setIsListItemModalOpen(false)}
            className="p-1 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-200 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Wizard Step Indicators */}
        <div className="px-6 py-3 bg-white border-b border-slate-100 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${
              step >= 1 ? 'bg-emerald-600 text-white' : 'bg-slate-100 text-slate-500'
            }`}>
              1
            </div>
            <span className={`text-xs font-semibold ${step >= 1 ? 'text-slate-900' : 'text-slate-400'}`}>
              Item Specifications
            </span>
          </div>
          <div className="h-0.5 w-12 bg-slate-200"></div>
          <div className="flex items-center gap-2">
            <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${
              step >= 2 ? 'bg-emerald-600 text-white' : 'bg-slate-100 text-slate-500'
            }`}>
              2
            </div>
            <span className={`text-xs font-semibold ${step >= 2 ? 'text-slate-900' : 'text-slate-400'}`}>
              Location & Logistics
            </span>
          </div>
          <div className="h-0.5 w-12 bg-slate-200"></div>
          <div className="flex items-center gap-2">
            <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${
              step === 3 ? 'bg-emerald-600 text-white' : 'bg-slate-100 text-slate-500'
            }`}>
              3
            </div>
            <span className={`text-xs font-semibold ${step === 3 ? 'text-slate-900' : 'text-slate-400'}`}>
              Media & Safety
            </span>
          </div>
        </div>

        {/* Form Body */}
        <div className="p-6 max-h-[65vh] overflow-y-auto">
          {/* STEP 1: Basic Specifications */}
          {step === 1 && (
            <div className="space-y-4 animate-in fade-in">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Item / Equipment Title *
                </label>
                <input
                  type="text"
                  required
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g., Eppendorf 5424 Microcentrifuge or Dell 27 4K Monitor"
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg text-xs sm:text-sm text-slate-900 focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Resource Category *
                  </label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value as any)}
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg text-xs text-slate-800 focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
                  >
                    {CATEGORIES.map(cat => (
                      <option key={cat.id} value={cat.id}>{cat.name}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Equipment Condition *
                  </label>
                  <select
                    value={condition}
                    onChange={(e) => setCondition(e.target.value as any)}
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg text-xs text-slate-800 focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
                  >
                    <option value="new">New / Unopened in Packaging</option>
                    <option value="excellent">Excellent (Like-New, Fully Tested)</option>
                    <option value="good">Good (Normal Operational Wear)</option>
                    <option value="fair">Fair (Functional with Cosmetic Wear)</option>
                    <option value="needs-repair">Needs Minor Service / Refurbishment</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Quantity
                  </label>
                  <input
                    type="number"
                    min="1"
                    value={quantity}
                    onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value) || 1))}
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg text-xs font-bold text-slate-900 focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Unit Type
                  </label>
                  <input
                    type="text"
                    value={unit}
                    onChange={(e) => setUnit(e.target.value)}
                    placeholder="units, chairs, boxes"
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg text-xs text-slate-900 focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Est. Value ($)
                  </label>
                  <input
                    type="number"
                    min="0"
                    value={estValue}
                    onChange={(e) => setEstValue(Math.max(0, parseInt(e.target.value) || 0))}
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg text-xs font-bold text-emerald-700 focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Model & Serial Number (Optional)
                </label>
                <input
                  type="text"
                  value={modelSerial}
                  onChange={(e) => setModelSerial(e.target.value)}
                  placeholder="e.g., SN-984128-B, Model #A2109"
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg text-xs font-mono text-slate-900 focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Item Description & Included Accessories
                </label>
                <textarea
                  rows={3}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Include accessories, power adapters, software calibration state, or reason for surplus..."
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg text-xs text-slate-900 focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
                />
              </div>
            </div>
          )}

          {/* STEP 2: Location & Logistics */}
          {step === 2 && (
            <div className="space-y-4 animate-in fade-in">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Donor Department *
                </label>
                <select
                  value={departmentName}
                  onChange={(e) => setDepartmentName(e.target.value)}
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg text-xs text-slate-800 focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
                >
                  {CAMPUS_DEPARTMENTS.map(dept => (
                    <option key={dept} value={dept}>{dept}</option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Building *
                  </label>
                  <input
                    type="text"
                    required
                    value={building}
                    onChange={(e) => setBuilding(e.target.value)}
                    placeholder="e.g., Turing Hall or Curie Complex"
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg text-xs text-slate-900 focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Room / Lab Suite Number *
                  </label>
                  <input
                    type="text"
                    required
                    value={room}
                    onChange={(e) => setRoom(e.target.value)}
                    placeholder="e.g., Room 312 or Basement Bay B"
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg text-xs text-slate-900 focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Campus Sector
                  </label>
                  <select
                    value={campusArea}
                    onChange={(e) => setCampusArea(e.target.value)}
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg text-xs text-slate-800 focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
                  >
                    <option value="North Quad">North Quad</option>
                    <option value="Science Hill">Science Hill</option>
                    <option value="South Arts Plaza">South Arts Plaza</option>
                    <option value="Central Mall">Central Mall</option>
                    <option value="West Engineering Quad">West Engineering Quad</option>
                    <option value="Medical Campus">Medical Campus</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Transfer Availability
                  </label>
                  <select
                    value={availability}
                    onChange={(e) => setAvailability(e.target.value as any)}
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg text-xs text-slate-800 focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
                  >
                    <option value="immediate">Immediate Transfer</option>
                    <option value="next-month">Available Next Month (Upcoming Surplus)</option>
                    <option value="reserve-only">Reserve Only (Pending grant signoff)</option>
                  </select>
                </div>
              </div>

              {/* Custodian identity */}
              <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200 text-xs">
                <span className="font-semibold text-slate-700">Designated Department Custodian:</span>
                <p className="text-slate-900 font-bold mt-0.5">{currentUser.name} ({currentUser.email})</p>
                <p className="text-[11px] text-slate-500">Authorized by {currentUser.department}</p>
              </div>
            </div>
          )}

          {/* STEP 3: Media & Safety */}
          {step === 3 && (
            <div className="space-y-4 animate-in fade-in">
              {/* Image Selection Presets */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                  Select Item Image or Enter Custom URL
                </label>
                <div className="grid grid-cols-3 gap-2 mb-3">
                  {sampleImages[category]?.map((img, i) => (
                    <button
                      type="button"
                      key={i}
                      onClick={() => setImageUrl(img)}
                      className={`h-20 rounded-lg overflow-hidden border-2 transition-all relative ${
                        imageUrl === img ? 'border-emerald-600 ring-2 ring-emerald-500/20' : 'border-slate-200 hover:border-slate-300'
                      }`}
                    >
                      <img src={img} alt="Preset preview" className="w-full h-full object-cover" />
                      {imageUrl === img && (
                        <div className="absolute top-1 right-1 bg-emerald-600 text-white rounded-full p-0.5">
                          <Check className="w-3 h-3" />
                        </div>
                      )}
                    </button>
                  ))}
                </div>

                <div className="relative">
                  <ImageIcon className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="url"
                    value={imageUrl}
                    onChange={(e) => setImageUrl(e.target.value)}
                    placeholder="Or paste direct image URL (https://...)"
                    className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs text-slate-900 focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
                  />
                </div>
              </div>

              {/* Handling Notes & Safety */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Logistics & Handling Instructions (Optional)
                </label>
                <input
                  type="text"
                  value={handlingNotes}
                  onChange={(e) => setHandlingNotes(e.target.value)}
                  placeholder="e.g., Heavy (>50kg) requires 2 people, ESD sensitive, or fragile optics"
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg text-xs text-slate-900 focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Environmental Health & Safety (EHS) / Hazard Notes (Optional)
                </label>
                <input
                  type="text"
                  value={safetyHazard}
                  onChange={(e) => setSafetyHazard(e.target.value)}
                  placeholder="e.g., Flammable solvent storage certified flushed and vented"
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg text-xs text-slate-900 focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
                />
              </div>

              {/* Environmental Impact preview */}
              <div className="p-3.5 bg-emerald-50/70 border border-emerald-200 rounded-xl flex items-center justify-between text-xs">
                <div className="flex items-center gap-2 text-emerald-950">
                  <Leaf className="w-4 h-4 text-emerald-600" />
                  <div>
                    <span className="font-bold">Calculated Embodied Carbon Saved:</span>
                    <p className="text-[11px] text-emerald-800">By reallocating this surplus instead of buying new</p>
                  </div>
                </div>
                <span className="font-extrabold text-sm text-emerald-700 bg-white px-2.5 py-1 rounded-lg border border-emerald-200">
                  ~{calculatedCO2} kg CO₂e
                </span>
              </div>
            </div>
          )}
        </div>

        {/* Footer Navigation */}
        <div className="p-4 px-6 border-t border-slate-100 bg-slate-50 flex items-center justify-between">
          {step > 1 ? (
            <button
              type="button"
              onClick={() => setStep((step - 1) as any)}
              className="px-3.5 py-2 rounded-lg text-xs font-semibold text-slate-700 hover:bg-slate-200 transition-colors flex items-center gap-1"
            >
              <ChevronLeft className="w-4 h-4" />
              <span>Back</span>
            </button>
          ) : (
            <button
              type="button"
              onClick={() => setIsListItemModalOpen(false)}
              className="px-3.5 py-2 rounded-lg text-xs font-semibold text-slate-500 hover:text-slate-700 transition-colors"
            >
              Cancel
            </button>
          )}

          {step < 3 ? (
            <button
              type="button"
              disabled={step === 1 && !title.trim()}
              onClick={() => setStep((step + 1) as any)}
              className="px-4 py-2 rounded-lg text-xs font-bold text-white bg-slate-900 hover:bg-slate-800 disabled:opacity-50 transition-colors flex items-center gap-1.5"
            >
              <span>Continue</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          ) : (
            <button
              type="button"
              onClick={handleFinish}
              className="px-5 py-2 rounded-lg text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-700 transition-colors flex items-center gap-1.5 shadow-sm shadow-emerald-700/20"
            >
              <Check className="w-4 h-4" />
              <span>Publish Surplus Listing</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
