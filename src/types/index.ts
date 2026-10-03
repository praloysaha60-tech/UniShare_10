export type Role = 'custodian' | 'requester' | 'admin';

export interface UserProfile {
  id: string;
  name: string;
  role: Role;
  roleTitle: string;
  department: string;
  departmentCode: string;
  email: string;
  avatar: string;
  location: string;
}

export type CategoryId = 
  | 'lab-equipment' 
  | 'it-electronics' 
  | 'office-furniture' 
  | 'books-media' 
  | 'raw-materials' 
  | 'consumables';

export interface CategoryInfo {
  id: CategoryId;
  name: string;
  iconName: string;
  color: string;
  bgLight: string;
  description: string;
  co2Factor: number; // kg CO2 saved per item on average
}

export type Condition = 'new' | 'excellent' | 'good' | 'fair' | 'needs-repair';
export type Availability = 'immediate' | 'next-month' | 'reserve-only';

export interface ResourceItem {
  id: string;
  assetTag: string;
  title: string;
  category: CategoryId;
  departmentId: string;
  departmentName: string;
  location: {
    building: string;
    room: string;
    campusArea?: string;
  };
  quantity: number;
  unit: string; // e.g. "units", "sets", "boxes", "licenses"
  condition: Condition;
  estValue: number; // estimated replacement cost in USD
  co2SavingsKg: number; // estimated embodied carbon prevented
  availability: Availability;
  description: string;
  modelSerial?: string;
  handlingNotes?: string;
  safetyHazard?: string;
  imageUrl?: string;
  manualUrl?: string;
  dateListed: string;
  custodianName: string;
  custodianEmail: string;
  custodianPhone?: string;
  status: 'available' | 'reserved' | 'transferred';
  viewsCount?: number;
  requestsCount?: number;
}

export type TransferStatus = 
  | 'pending' 
  | 'approved' 
  | 'in-transit' 
  | 'completed' 
  | 'rejected';

export interface TransferRequest {
  id: string;
  requestCode: string; // e.g. "TR-2026-084"
  resourceId: string;
  resourceTitle: string;
  resourceAssetTag: string;
  category: CategoryId;
  quantityRequested: number;
  unit: string;
  
  // Donor details
  donorDept: string;
  donorCustodian: string;
  donorEmail: string;
  donorLocation: string;

  // Requester details
  requesterId: string;
  requesterName: string;
  requesterDept: string;
  requesterEmail: string;
  intendedLocation: string; // building & room
  
  // Logistics & notes
  reason: string;
  academicPurpose: string;
  urgency: 'low' | 'medium' | 'urgent';
  requiredByDate: string;
  pickupPreference: 'self-pickup' | 'campus-courier' | 'custodian-delivery';
  
  // Workflow progress
  status: TransferStatus;
  requestedAt: string;
  
  reviewedAt?: string;
  reviewedBy?: string;
  rejectionReason?: string;
  approvalNotes?: string;

  pickupScheduledFor?: string;
  pickedUpAt?: string;
  pickedUpBy?: string;

  completedAt?: string;
  recipientSignoffCondition?: Condition;
  recipientNotes?: string;

  gatePassId?: string;
}

export interface NeededResource {
  id: string;
  title: string;
  category: CategoryId;
  requestingDept: string;
  requesterName: string;
  requesterEmail: string;
  urgency: 'low' | 'medium' | 'urgent';
  quantityNeeded: number;
  unit: string;
  neededBy: string;
  justification: string;
  createdAt: string;
  status: 'open' | 'matched' | 'fulfilled';
  matchedResourceId?: string;
  matchedResourceTitle?: string;
  matchedFromDept?: string;
}

export interface AuditLogEntry {
  id: string;
  timestamp: string;
  actorName: string;
  actorDept: string;
  actorRole: string;
  actionType: 
    | 'create_item' 
    | 'request_item' 
    | 'approve_request' 
    | 'reject_request' 
    | 'schedule_pickup'
    | 'pickup_item' 
    | 'complete_transfer' 
    | 'match_need' 
    | 'create_need';
  actionTitle: string;
  details: string;
  assetTag?: string;
  requestCode?: string;
}

export interface ToastMessage {
  id: string;
  type: 'success' | 'info' | 'warning' | 'error';
  title: string;
  message: string;
  timestamp: number;
}
