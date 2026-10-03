import React, { createContext, useContext, useState, useEffect, useMemo, ReactNode } from 'react';
import { 
  Role, 
  UserProfile, 
  ResourceItem, 
  TransferRequest, 
  NeededResource, 
  AuditLogEntry, 
  ToastMessage, 
  Condition 
} from '../types';
import { 
  USER_PROFILES, 
  INITIAL_RESOURCE_ITEMS, 
  INITIAL_TRANSFER_REQUESTS, 
  INITIAL_NEEDED_RESOURCES, 
  INITIAL_AUDIT_LOGS 
} from '../data/mockData';

interface AppContextType {
  currentRole: Role;
  currentUser: UserProfile;
  setRole: (role: Role) => void;
  activeTab: 'catalog' | 'pipeline' | 'wishlist' | 'analytics' | 'admin';
  setActiveTab: (tab: 'catalog' | 'pipeline' | 'wishlist' | 'analytics' | 'admin') => void;
  
  // Data states
  items: ResourceItem[];
  requests: TransferRequest[];
  neededResources: NeededResource[];
  auditLogs: AuditLogEntry[];
  
  // Handlers for Items
  addItem: (item: Omit<ResourceItem, 'id' | 'assetTag' | 'dateListed' | 'status' | 'viewsCount' | 'requestsCount'>) => ResourceItem;
  updateItem: (id: string, updates: Partial<ResourceItem>) => void;
  deleteItem: (id: string) => void;
  
  // Handlers for Requests
  submitRequest: (data: {
    resourceId: string;
    quantityRequested: number;
    reason: string;
    academicPurpose: string;
    urgency: 'low' | 'medium' | 'urgent';
    requiredByDate: string;
    pickupPreference: 'self-pickup' | 'campus-courier' | 'custodian-delivery';
    intendedLocation: string;
  }) => TransferRequest;
  approveRequest: (requestId: string, notes?: string, scheduledPickup?: string) => void;
  rejectRequest: (requestId: string, reason: string) => void;
  markPickedUp: (requestId: string, carrierOrPerson?: string) => void;
  completeTransfer: (requestId: string, condition: Condition, notes?: string) => void;
  
  // Handlers for Wishlist / Needed Resources
  postNeededResource: (data: {
    title: string;
    category: any;
    urgency: 'low' | 'medium' | 'urgent';
    quantityNeeded: number;
    unit: string;
    neededBy: string;
    justification: string;
  }) => void;
  matchNeededResource: (needId: string, resourceId: string) => void;

  // Modals & UI controls
  selectedGatePassRequest: TransferRequest | null;
  setSelectedGatePassRequest: (req: TransferRequest | null) => void;
  selectedDetailItem: ResourceItem | null;
  setSelectedDetailItem: (item: ResourceItem | null) => void;
  requestModalItem: ResourceItem | null;
  setRequestModalItem: (item: ResourceItem | null) => void;
  isListItemModalOpen: boolean;
  setIsListItemModalOpen: (open: boolean) => void;
  isPostNeedModalOpen: boolean;
  setIsPostNeedModalOpen: (open: boolean) => void;

  // Impact & Stats
  kpiStats: {
    totalAvailable: number;
    fundsSaved: number;
    co2SavedKg: number;
    completedTransfers: number;
    pendingTransfers: number;
  };

  // Toast System
  toasts: ToastMessage[];
  addToast: (type: 'success' | 'info' | 'warning' | 'error', title: string, message: string) => void;
  removeToast: (id: string) => void;
  
  // Reset
  resetToDefaults: () => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

const STORAGE_KEYS = {
  ROLE: 'unishare_user_role_v1',
  ITEMS: 'unishare_items_v1',
  REQUESTS: 'unishare_requests_v1',
  NEEDS: 'unishare_needs_v1',
  LOGS: 'unishare_logs_v1',
};

export const AppProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  // Role state
  const [currentRole, setCurrentRoleState] = useState<Role>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.ROLE);
    return (saved as Role) || 'custodian';
  });

  const currentUser = useMemo(() => USER_PROFILES[currentRole] || USER_PROFILES.custodian, [currentRole]);

  const setRole = (role: Role) => {
    setCurrentRoleState(role);
    localStorage.setItem(STORAGE_KEYS.ROLE, role);
    addToast('info', 'Switched Persona', `Active view changed to ${USER_PROFILES[role].name} (${USER_PROFILES[role].roleTitle})`);
  };

  // Navigation tab
  const [activeTab, setActiveTab] = useState<'catalog' | 'pipeline' | 'wishlist' | 'analytics' | 'admin'>('catalog');

  // Items State
  const [items, setItems] = useState<ResourceItem[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.ITEMS);
      return saved ? JSON.parse(saved) : INITIAL_RESOURCE_ITEMS;
    } catch {
      return INITIAL_RESOURCE_ITEMS;
    }
  });

  // Requests State
  const [requests, setRequests] = useState<TransferRequest[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.REQUESTS);
      return saved ? JSON.parse(saved) : INITIAL_TRANSFER_REQUESTS;
    } catch {
      return INITIAL_TRANSFER_REQUESTS;
    }
  });

  // Needed Resources State
  const [neededResources, setNeededResources] = useState<NeededResource[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.NEEDS);
      return saved ? JSON.parse(saved) : INITIAL_NEEDED_RESOURCES;
    } catch {
      return INITIAL_NEEDED_RESOURCES;
    }
  });

  // Audit Logs State
  const [auditLogs, setAuditLogs] = useState<AuditLogEntry[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.LOGS);
      return saved ? JSON.parse(saved) : INITIAL_AUDIT_LOGS;
    } catch {
      return INITIAL_AUDIT_LOGS;
    }
  });

  // Toasts
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  // Modals state
  const [selectedGatePassRequest, setSelectedGatePassRequest] = useState<TransferRequest | null>(null);
  const [selectedDetailItem, setSelectedDetailItem] = useState<ResourceItem | null>(null);
  const [requestModalItem, setRequestModalItem] = useState<ResourceItem | null>(null);
  const [isListItemModalOpen, setIsListItemModalOpen] = useState(false);
  const [isPostNeedModalOpen, setIsPostNeedModalOpen] = useState(false);

  // Sync to LocalStorage
  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.ITEMS, JSON.stringify(items));
  }, [items]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.REQUESTS, JSON.stringify(requests));
  }, [requests]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.NEEDS, JSON.stringify(neededResources));
  }, [neededResources]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.LOGS, JSON.stringify(auditLogs));
  }, [auditLogs]);

  // Toast Helpers
  const addToast = (type: 'success' | 'info' | 'warning' | 'error', title: string, message: string) => {
    const id = 'toast_' + Date.now() + '_' + Math.random().toString(36).substring(2, 6);
    setToasts(prev => [...prev.slice(-3), { id, type, title, message, timestamp: Date.now() }]);
  };

  const removeToast = (id: string) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  };

  const addAuditLog = (
    actionType: AuditLogEntry['actionType'],
    actionTitle: string,
    details: string,
    assetTag?: string,
    requestCode?: string
  ) => {
    const now = new Date();
    const formattedDate = `${now.toISOString().split('T')[0]} ${now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`;
    const newLog: AuditLogEntry = {
      id: 'log-' + Date.now(),
      timestamp: formattedDate,
      actorName: currentUser.name,
      actorDept: currentUser.department,
      actorRole: currentUser.roleTitle,
      actionType,
      actionTitle,
      details,
      assetTag,
      requestCode
    };
    setAuditLogs(prev => [newLog, ...prev]);
  };

  // Add Item
  const addItem = (itemData: Omit<ResourceItem, 'id' | 'assetTag' | 'dateListed' | 'status' | 'viewsCount' | 'requestsCount'>): ResourceItem => {
    const randomTagNum = Math.floor(100 + Math.random() * 900);
    const deptPrefix = currentUser.departmentCode.replace(/[^A-Z]/g, '').substring(0, 4) || 'ASSET';
    const assetTag = `${deptPrefix}-${randomTagNum}-2026`;
    const nowStr = new Date().toISOString().split('T')[0];

    const newItem: ResourceItem = {
      ...itemData,
      id: 'item-' + Date.now(),
      assetTag,
      dateListed: nowStr,
      status: 'available',
      viewsCount: 0,
      requestsCount: 0
    };

    setItems(prev => [newItem, ...prev]);
    addAuditLog('create_item', 'New Resource Listed', `Listed "${newItem.title}" (${newItem.quantity} ${newItem.unit}) for campus sharing.`, assetTag);
    addToast('success', 'Resource Listed Successfully!', `"${newItem.title}" is now available in the campus surplus directory.`);
    return newItem;
  };

  // Update Item
  const updateItem = (id: string, updates: Partial<ResourceItem>) => {
    setItems(prev => prev.map(item => item.id === id ? { ...item, ...updates } : item));
    addToast('info', 'Item Updated', 'The resource details have been updated.');
  };

  // Delete Item
  const deleteItem = (id: string) => {
    const target = items.find(i => i.id === id);
    if (!target) return;
    setItems(prev => prev.filter(i => i.id !== id));
    addToast('warning', 'Resource Delisted', `"${target.title}" was removed from the active catalog.`);
  };

  // Submit Request
  const submitRequest = (data: {
    resourceId: string;
    quantityRequested: number;
    reason: string;
    academicPurpose: string;
    urgency: 'low' | 'medium' | 'urgent';
    requiredByDate: string;
    pickupPreference: 'self-pickup' | 'campus-courier' | 'custodian-delivery';
    intendedLocation: string;
  }): TransferRequest => {
    const resource = items.find(i => i.id === data.resourceId);
    if (!resource) throw new Error('Resource not found');

    const reqNum = Math.floor(100 + Math.random() * 900);
    const requestCode = `TR-2026-${reqNum}`;
    const now = new Date();
    const formattedDate = `${now.toISOString().split('T')[0]} ${now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`;

    const newRequest: TransferRequest = {
      id: 'req-' + Date.now(),
      requestCode,
      resourceId: resource.id,
      resourceTitle: resource.title,
      resourceAssetTag: resource.assetTag,
      category: resource.category,
      quantityRequested: data.quantityRequested,
      unit: resource.unit,
      donorDept: resource.departmentName,
      donorCustodian: resource.custodianName,
      donorEmail: resource.custodianEmail,
      donorLocation: `${resource.location.building}, ${resource.location.room}`,
      requesterId: currentUser.id,
      requesterName: currentUser.name,
      requesterDept: currentUser.department,
      requesterEmail: currentUser.email,
      intendedLocation: data.intendedLocation,
      reason: data.reason,
      academicPurpose: data.academicPurpose,
      urgency: data.urgency,
      requiredByDate: data.requiredByDate,
      pickupPreference: data.pickupPreference,
      status: 'pending',
      requestedAt: formattedDate
    };

    setRequests(prev => [newRequest, ...prev]);

    // Increment request count on resource
    setItems(prev => prev.map(item => item.id === resource.id ? { ...item, requestsCount: (item.requestsCount || 0) + 1 } : item));

    addAuditLog('request_item', 'New Transfer Request', `Requested ${data.quantityRequested}x "${resource.title}" from ${resource.departmentName}.`, resource.assetTag, requestCode);
    addToast('success', 'Transfer Request Submitted!', `Reference Code: ${requestCode}. Sent to ${resource.custodianName} for approval.`);

    return newRequest;
  };

  // Approve Request
  const approveRequest = (requestId: string, notes?: string, scheduledPickup?: string) => {
    const req = requests.find(r => r.id === requestId);
    if (!req) return;

    const gatePassId = `GP-2026-${Math.floor(100 + Math.random() * 900)}`;
    const now = new Date();
    const formattedDate = `${now.toISOString().split('T')[0]} ${now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`;

    setRequests(prev => prev.map(r => {
      if (r.id === requestId) {
        return {
          ...r,
          status: 'approved',
          reviewedAt: formattedDate,
          reviewedBy: currentUser.name,
          approvalNotes: notes || 'Transfer approved by department custodian.',
          pickupScheduledFor: scheduledPickup || 'Available for immediate pickup',
          gatePassId
        };
      }
      return r;
    }));

    // Mark item status if quantity is fully reserved
    setItems(prev => prev.map(item => {
      if (item.id === req.resourceId) {
        const remaining = Math.max(0, item.quantity - req.quantityRequested);
        return {
          ...item,
          quantity: remaining,
          status: remaining === 0 ? 'reserved' : item.status
        };
      }
      return item;
    }));

    addAuditLog('approve_request', 'Transfer Approved & Gate Pass Issued', `Approved transfer request ${req.requestCode} for "${req.resourceTitle}". Gate Pass: ${gatePassId}`, req.resourceAssetTag, req.requestCode);
    addToast('success', 'Transfer Approved!', `Official Gate Pass ${gatePassId} generated for pickup.`);
  };

  // Reject Request
  const rejectRequest = (requestId: string, reason: string) => {
    const req = requests.find(r => r.id === requestId);
    if (!req) return;

    const now = new Date();
    const formattedDate = `${now.toISOString().split('T')[0]} ${now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`;

    setRequests(prev => prev.map(r => {
      if (r.id === requestId) {
        return {
          ...r,
          status: 'rejected',
          reviewedAt: formattedDate,
          reviewedBy: currentUser.name,
          rejectionReason: reason
        };
      }
      return r;
    }));

    addAuditLog('reject_request', 'Transfer Request Rejected', `Rejected request ${req.requestCode}. Reason: ${reason}`, req.resourceAssetTag, req.requestCode);
    addToast('warning', 'Request Rejected', `Request ${req.requestCode} marked as rejected.`);
  };

  // Mark Picked Up
  const markPickedUp = (requestId: string, carrierOrPerson?: string) => {
    const req = requests.find(r => r.id === requestId);
    if (!req) return;

    const now = new Date();
    const formattedDate = `${now.toISOString().split('T')[0]} ${now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`;

    setRequests(prev => prev.map(r => {
      if (r.id === requestId) {
        return {
          ...r,
          status: 'in-transit',
          pickedUpAt: formattedDate,
          pickedUpBy: carrierOrPerson || currentUser.name
        };
      }
      return r;
    }));

    addAuditLog('pickup_item', 'Resource Picked Up & In Transit', `${req.resourceTitle} picked up from ${req.donorLocation}. Status changed to In-Transit.`, req.resourceAssetTag, req.requestCode);
    addToast('info', 'Status Updated: In-Transit', `Item is on its way to ${req.intendedLocation}.`);
  };

  // Complete Transfer
  const completeTransfer = (requestId: string, condition: Condition, notes?: string) => {
    const req = requests.find(r => r.id === requestId);
    if (!req) return;

    const now = new Date();
    const formattedDate = `${now.toISOString().split('T')[0]} ${now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`;

    setRequests(prev => prev.map(r => {
      if (r.id === requestId) {
        return {
          ...r,
          status: 'completed',
          completedAt: formattedDate,
          recipientSignoffCondition: condition,
          recipientNotes: notes || 'Resource safely received and verified.'
        };
      }
      return r;
    }));

    // Update item status
    setItems(prev => prev.map(item => {
      if (item.id === req.resourceId) {
        return {
          ...item,
          status: item.quantity === 0 ? 'transferred' : 'available'
        };
      }
      return item;
    }));

    addAuditLog('complete_transfer', 'Transfer Successfully Completed', `Recipient ${req.requesterName} signed off handover in ${condition} condition.`, req.resourceAssetTag, req.requestCode);
    addToast('success', 'Transfer Completed!', `Handover confirmed! Impact analytics have been credited to both departments.`);
  };

  // Post Needed Resource
  const postNeededResource = (data: {
    title: string;
    category: any;
    urgency: 'low' | 'medium' | 'urgent';
    quantityNeeded: number;
    unit: string;
    neededBy: string;
    justification: string;
  }) => {
    const newNeed: NeededResource = {
      id: 'need-' + Date.now(),
      title: data.title,
      category: data.category,
      requestingDept: currentUser.department,
      requesterName: currentUser.name,
      requesterEmail: currentUser.email,
      urgency: data.urgency,
      quantityNeeded: data.quantityNeeded,
      unit: data.unit,
      neededBy: data.neededBy,
      justification: data.justification,
      createdAt: new Date().toISOString().split('T')[0],
      status: 'open'
    };

    setNeededResources(prev => [newNeed, ...prev]);
    addAuditLog('create_need', 'Urgent Campus Need Posted', `Posted wishlist requirement for "${newNeed.title}" (${newNeed.quantityNeeded} ${newNeed.unit}).`);
    addToast('success', 'Need Posted to Campus Board', 'Other departments have been notified of your equipment request.');
  };

  // Match Needed Resource with an existing surplus item
  const matchNeededResource = (needId: string, resourceId: string) => {
    const need = neededResources.find(n => n.id === needId);
    const item = items.find(i => i.id === resourceId);
    if (!need || !item) return;

    setNeededResources(prev => prev.map(n => {
      if (n.id === needId) {
        return {
          ...n,
          status: 'matched',
          matchedResourceId: item.id,
          matchedResourceTitle: item.title,
          matchedFromDept: item.departmentName
        };
      }
      return n;
    }));

    addAuditLog('match_need', 'Requirement Matched with Surplus Item', `Matched requirement "${need.title}" with surplus item "${item.title}" from ${item.departmentName}.`, item.assetTag);
    addToast('success', 'Resource Match Proposed!', `Matched "${item.title}" with ${need.requestingDept}'s need. A transfer request can now proceed.`);
  };

  // Reset to Defaults
  const resetToDefaults = () => {
    localStorage.removeItem(STORAGE_KEYS.ROLE);
    localStorage.removeItem(STORAGE_KEYS.ITEMS);
    localStorage.removeItem(STORAGE_KEYS.REQUESTS);
    localStorage.removeItem(STORAGE_KEYS.NEEDS);
    localStorage.removeItem(STORAGE_KEYS.LOGS);

    setCurrentRoleState('custodian');
    setItems(INITIAL_RESOURCE_ITEMS);
    setRequests(INITIAL_TRANSFER_REQUESTS);
    setNeededResources(INITIAL_NEEDED_RESOURCES);
    setAuditLogs(INITIAL_AUDIT_LOGS);
    addToast('info', 'Demo Data Reset', 'Platform restored to initial sample state.');
  };

  // KPI Calculations
  const kpiStats = useMemo(() => {
    // Total available items count
    const totalAvailable = items.reduce((acc, curr) => acc + (curr.status === 'available' ? curr.quantity : 0), 0);

    // Completed transfers savings & CO2
    const completedReqs = requests.filter(r => r.status === 'completed');
    
    // Calculate total funds saved: from completed transfers + estimated value of active pool
    const completedSavings = completedReqs.reduce((sum, req) => {
      const item = items.find(i => i.id === req.resourceId);
      if (item && item.quantity > 0) {
        return sum + (item.estValue / (item.quantity + req.quantityRequested)) * req.quantityRequested;
      }
      return sum + 2850 * req.quantityRequested; // fallback sensible average
    }, 0);

    // Baseline saved from all historic items repurposed + completed
    const baselineSaved = 148200;
    const totalFundsSaved = Math.round(baselineSaved + completedSavings);

    // CO2 calculation: ~120kg per completed transfer item + baseline
    const completedCO2 = completedReqs.reduce((sum, req) => {
      return sum + (req.quantityRequested * 180);
    }, 0);
    const totalCo2SavedKg = 8450 + completedCO2;

    const completedTransfers = completedReqs.length;
    const pendingTransfers = requests.filter(r => r.status === 'pending' || r.status === 'approved' || r.status === 'in-transit').length;

    return {
      totalAvailable,
      fundsSaved: totalFundsSaved,
      co2SavedKg: totalCo2SavedKg,
      completedTransfers: 42 + completedTransfers, // cumulative academic year
      pendingTransfers
    };
  }, [items, requests]);

  return (
    <AppContext.Provider
      value={{
        currentRole,
        currentUser,
        setRole,
        activeTab,
        setActiveTab,
        items,
        requests,
        neededResources,
        auditLogs,
        addItem,
        updateItem,
        deleteItem,
        submitRequest,
        approveRequest,
        rejectRequest,
        markPickedUp,
        completeTransfer,
        postNeededResource,
        matchNeededResource,
        selectedGatePassRequest,
        setSelectedGatePassRequest,
        selectedDetailItem,
        setSelectedDetailItem,
        requestModalItem,
        setRequestModalItem,
        isListItemModalOpen,
        setIsListItemModalOpen,
        isPostNeedModalOpen,
        setIsPostNeedModalOpen,
        kpiStats,
        toasts,
        addToast,
        removeToast,
        resetToDefaults
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
