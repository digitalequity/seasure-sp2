// src/types/index.ts

export * from './boat';
export * from './request';
export * from './chat';
export * from './user';
export * from './business';

// Common types used across the application
export type Status = 'active' | 'inactive' | 'pending' | 'completed' | 'cancelled';
export type Priority = 'emergency' | 'urgent' | 'routine' | 'low';
export type RequestSource = 'seasure' | 'external' | 'phone' | 'email';

export interface Timestamp {
  seconds: number;
  nanoseconds: number;
}

export interface FirebaseDocument {
  id: string;
  createdAt: Timestamp;
  updatedAt: Timestamp;
}

export interface PaginationParams {
  limit: number;
  offset: number;
  orderBy?: string;
  orderDirection?: 'asc' | 'desc';
}

export interface ApiResponse<T> {
  data: T;
  success: boolean;
  error?: string;
  pagination?: {
    total: number;
    limit: number;
    offset: number;
    hasNext: boolean;
  };
}

// src/types/boat.ts

import { FirebaseDocument, Status } from './index';

export interface Boat extends FirebaseDocument {
  name: string;
  ownerId: string;
  ownerName: string;
  ownerType: 'seasure' | 'external';
  make: string;
  model: string;
  year: number;
  engineType: string;
  engineMake?: string;
  engineModel?: string;
  hullId?: string;
  registration?: string;
  length?: number;
  beam?: number;
  draft?: number;
  location?: {
    marina?: string;
    berth?: string;
    latitude?: number;
    longitude?: number;
  };
  status: Status;
  images: string[];
  documents: string[];
  notes?: string;
  preferences?: {
    communicationMethod?: 'email' | 'sms' | 'app';
    maintenanceReminders?: boolean;
    emergencyContact?: string;
  };
  maintenanceSchedule?: MaintenanceItem[];
  serviceHistory?: ServiceRecord[];
}

export interface MaintenanceItem {
  id: string;
  name: string;
  description?: string;
  intervalHours?: number;
  intervalDays?: number;
  lastCompletedDate?: Date;
  nextDueDate: Date;
  category: 'engine' | 'hull' | 'electrical' | 'safety' | 'other';
  priority: 'high' | 'medium' | 'low';
  estimatedCost?: number;
  notes?: string;
}

export interface ServiceRecord {
  id: string;
  date: Date;
  type: 'maintenance' | 'repair' | 'inspection' | 'upgrade';
  description: string;
  performedBy: string;
  laborHours?: number;
  parts?: PartUsed[];
  totalCost?: number;
  invoiceId?: string;
  notes?: string;
  images?: string[];
}

export interface PartUsed {
  partNumber: string;
  name: string;
  quantity: number;
  unitCost: number;
  supplier?: string;
}

// src/types/request.ts

import { FirebaseDocument, Priority, RequestSource, Status } from './index';

export interface ServiceRequest extends FirebaseDocument {
  boatId: string;
  boatName: string;
  ownerId: string;
  ownerName: string;
  type: 'maintenance' | 'repair' | 'inspection' | 'emergency' | 'consultation';
  priority: Priority;
  status: RequestStatus;
  source: RequestSource;
  title: string;
  description: string;
  requestedDate?: Date;
  scheduledDate?: Date;
  completedDate?: Date;
  assignedTo?: string;
  assignedToName?: string;
  estimatedHours?: number;
  actualHours?: number;
  estimatedCost?: number;
  actualCost?: number;
  parts?: RequestPart[];
  images?: string[];
  documents?: string[];
  notes?: string;
  customerNotes?: string;
}

export type RequestStatus = 
  | 'new'
  | 'accepted'
  | 'scheduled'
  | 'in_progress'
  | 'completed'
  | 'invoiced'
  | 'cancelled';

export interface RequestPart {
  partId: string;
  name: string;
  quantity: number;
  status: 'needed' | 'ordered' | 'received' | 'installed';
  supplier?: string;
  orderDate?: Date;
  receivedDate?: Date;
  cost?: number;
}

// src/types/chat.ts

import { FirebaseDocument } from './index';

export interface ChatRoom extends FirebaseDocument {
  type: 'boat' | 'support' | 'request';
  relatedId: string; // boatId or requestId
  name: string;
  participants: string[];
  lastMessage?: Message;
  unreadCount: { [userId: string]: number };
  isActive: boolean;
}

export interface Message extends FirebaseDocument {
  chatRoomId: string;
  senderId: string;
  senderName: string;
  content: string;
  type: 'text' | 'image' | 'file' | 'system';
  attachments?: Attachment[];
  isRead: boolean;
  readBy: { [userId: string]: Date };
  replyTo?: string;
  metadata?: {
    fileName?: string;
    fileSize?: number;
    mimeType?: string;
  };
}

export interface Attachment {
  id: string;
  url: string;
  name: string;
  type: string;
  size: number;
}

// src/types/user.ts

import { FirebaseDocument } from './index';

export interface ServiceProvider extends FirebaseDocument {
  email: string;
  displayName: string;
  companyName: string;
  phone?: string;
  address?: Address;
  licenseNumber?: string;
  certifications?: string[];
  specializations?: string[];
  serviceAreas?: string[];
  employees?: Employee[];
  businessHours?: BusinessHours;
  subscription: Subscription;
  settings: UserSettings;
  profileImage?: string;
  rating?: number;
  reviewCount?: number;
}

export interface Employee {
  id: string;
  name: string;
  email: string;
  role: 'admin' | 'technician' | 'support';
  permissions: string[];
  isActive: boolean;
}

export interface Address {
  street: string;
  city: string;
  state: string;
  zip: string;
  country: string;
}

export interface BusinessHours {
  [day: string]: {
    isOpen: boolean;
    openTime?: string;
    closeTime?: string;
  };
}

export interface Subscription {
  plan: 'basic' | 'professional' | 'enterprise';
  status: 'active' | 'paused' | 'cancelled';
  boatLimit: number;
  currentBoatCount: number;
  billingCycle: 'monthly' | 'yearly';
  nextBillingDate: Date;
  features: string[];
}

export interface UserSettings {
  notifications: NotificationSettings;
  privacy: PrivacySettings;
  display: DisplaySettings;
}

export interface NotificationSettings {
  email: boolean;
  push: boolean;
  sms: boolean;
  newRequests: boolean;
  chatMessages: boolean;
  maintenanceDue: boolean;
  emergencies: boolean;
}

export interface PrivacySettings {
  profileVisibility: 'public' | 'clients' | 'private';
  shareLocation: boolean;
  shareContactInfo: boolean;
}

export interface DisplaySettings {
  theme: 'light' | 'dark' | 'auto';
  dashboardLayout: string[];
  defaultView: 'dashboard' | 'boats' | 'requests';
}

// src/types/business.ts

import { FirebaseDocument } from './index';

export interface Invoice extends FirebaseDocument {
  invoiceNumber: string;
  serviceProviderId: string;
  customerId: string;
  customerName: string;
  boatId: string;
  boatName: string;
  requestId?: string;
  status: 'draft' | 'sent' | 'paid' | 'overdue' | 'cancelled';
  issueDate: Date;
  dueDate: Date;
  paidDate?: Date;
  items: InvoiceItem[];
  subtotal: number;
  tax: number;
  taxRate: number;
  total: number;
  currency: string;
  notes?: string;
  terms?: string;
  paymentMethod?: string;
  paymentReference?: string;
}

export interface InvoiceItem {
  id: string;
  type: 'labor' | 'part' | 'other';
  description: string;
  quantity: number;
  unitPrice: number;
  total: number;
  taxable: boolean;
}

export interface TimeEntry extends FirebaseDocument {
  employeeId: string;
  employeeName: string;
  boatId: string;
  boatName: string;
  requestId?: string;
  startTime: Date;
  endTime?: Date;
  duration?: number; // in minutes
  description: string;
  isBillable: boolean;
  hourlyRate?: number;
  totalCost?: number;
  status: 'active' | 'completed' | 'approved' | 'invoiced';
}

export interface Part extends FirebaseDocument {
  partNumber: string;
  name: string;
  description?: string;
  category: string;
  manufacturer?: string;
  supplier?: string;
  currentStock: number;
  minStock: number;
  maxStock: number;
  unitCost: number;
  sellingPrice: number;
  location?: string;
  compatibleBoats?: string[];
  images?: string[];
  lastRestocked?: Date;
}

export interface CustomerRelation extends FirebaseDocument {
  customerId: string;
  customerName: string;
  customerType: 'seasure' | 'external';
  boats: string[];
  totalSpent: number;
  lastServiceDate?: Date;
  notes?: string;
  preferences?: {
    preferredTechnician?: string;
    paymentTerms?: string;
    communicationPreference?: string;
  };
}