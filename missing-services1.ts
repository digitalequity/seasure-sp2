// src/services/ai/diagnostic.ts

import { processAIRequest } from '../firebase/functions';

interface DiagnosticData {
  symptoms: string[];
  boatInfo: {
    make: string;
    model: string;
    year: number;
    engineType: string;
  };
  serviceHistory?: any[];
}

export const diagnosticService = {
  async analyzeProblem(data: DiagnosticData): Promise<string> {
    const response = await processAIRequest({
      type: 'diagnostic',
      context: data,
      prompt: `Analyze the following boat issues:
        Symptoms: ${data.symptoms.join(', ')}
        Boat: ${data.boatInfo.year} ${data.boatInfo.make} ${data.boatInfo.model}
        Engine: ${data.boatInfo.engineType}
        
        Provide potential causes and recommended solutions.`
    });
    
    return response.data.result;
  },

  async suggestMaintenance(boatData: any): Promise<string> {
    const response = await processAIRequest({
      type: 'maintenance',
      context: boatData,
      prompt: `Based on the boat specifications and service history, suggest a maintenance schedule.`
    });
    
    return response.data.result;
  },

  async generateReport(requestData: any): Promise<string> {
    const response = await processAIRequest({
      type: 'report',
      context: requestData,
      prompt: `Generate a detailed service report for the completed work.`
    });
    
    return response.data.result;
  }
};

// src/services/ai/maintenance.ts

import { MaintenanceItem, Boat, ServiceRecord } from '../../types';
import { processAIRequest } from '../firebase/functions';

export const maintenanceAI = {
  async predictMaintenanceNeeds(
    boat: Boat,
    serviceHistory: ServiceRecord[]
  ): Promise<MaintenanceItem[]> {
    const response = await processAIRequest({
      type: 'maintenance',
      context: {
        boat,
        serviceHistory,
        currentDate: new Date()
      },
      prompt: `Analyze the boat specifications and service history to predict upcoming maintenance needs.`
    });
    
    return JSON.parse(response.data.result);
  },

  async optimizeSchedule(
    maintenanceItems: MaintenanceItem[],
    constraints: any
  ): Promise<MaintenanceItem[]> {
    const response = await processAIRequest({
      type: 'maintenance',
      context: {
        items: maintenanceItems,
        constraints
      },
      prompt: `Optimize the maintenance schedule based on priorities and constraints.`
    });
    
    return JSON.parse(response.data.result);
  },

  async estimateCosts(
    maintenanceItems: MaintenanceItem[],
    historicalData: any
  ): Promise<Record<string, number>> {
    const response = await processAIRequest({
      type: 'maintenance',
      context: {
        items: maintenanceItems,
        historicalData
      },
      prompt: `Estimate costs for each maintenance item based on historical data.`
    });
    
    return JSON.parse(response.data.result);
  }
};

// src/services/ai/chatbot.ts

import { Message } from '../../types';
import { processAIRequest } from '../firebase/functions';

export const chatbotService = {
  async generateResponse(
    message: string,
    context: {
      chatHistory: Message[];
      boatInfo?: any;
      requestInfo?: any;
    }
  ): Promise<string> {
    const response = await processAIRequest({
      type: 'chat',
      context,
      prompt: message
    });
    
    return response.data.result;
  },

  async suggestQuickReplies(
    context: {
      currentMessage: string;
      chatHistory: Message[];
    }
  ): Promise<string[]> {
    const response = await processAIRequest({
      type: 'chat',
      context,
      prompt: `Suggest 3 relevant quick reply options based on the conversation context.`
    });
    
    return JSON.parse(response.data.result);
  },

  async summarizeConversation(messages: Message[]): Promise<string> {
    const response = await processAIRequest({
      type: 'chat',
      context: { messages },
      prompt: `Summarize this conversation highlighting key points and action items.`
    });
    
    return response.data.result;
  }
};

// src/utils/constants.ts

export const BOAT_MAKES = [
  'Yamaha',
  'Mercury',
  'Honda',
  'Suzuki',
  'Evinrude',
  'Johnson',
  'Tohatsu',
  'Volvo Penta',
  'MerCruiser',
  'Caterpillar'
];

export const ENGINE_TYPES = [
  'Outboard',
  'Inboard',
  'Sterndrive',
  'Jet Drive',
  'Pod Drive'
];

export const SERVICE_TYPES = [
  { value: 'maintenance', label: 'Routine Maintenance' },
  { value: 'repair', label: 'Repair' },
  { value: 'inspection', label: 'Inspection' },
  { value: 'emergency', label: 'Emergency' },
  { value: 'consultation', label: 'Consultation' }
];

export const PRIORITY_LEVELS = [
  { value: 'emergency', label: 'Emergency', color: 'red' },
  { value: 'urgent', label: 'Urgent', color: 'yellow' },
  { value: 'routine', label: 'Routine', color: 'blue' },
  { value: 'low', label: 'Low', color: 'gray' }
];

export const REQUEST_STATUSES = [
  { value: 'new', label: 'New', color: 'blue' },
  { value: 'accepted', label: 'Accepted', color: 'indigo' },
  { value: 'scheduled', label: 'Scheduled', color: 'purple' },
  { value: 'in_progress', label: 'In Progress', color: 'yellow' },
  { value: 'completed', label: 'Completed', color: 'green' },
  { value: 'invoiced', label: 'Invoiced', color: 'gray' },
  { value: 'cancelled', label: 'Cancelled', color: 'red' }
];

export const MAINTENANCE_CATEGORIES = [
  { value: 'engine', label: 'Engine' },
  { value: 'hull', label: 'Hull' },
  { value: 'electrical', label: 'Electrical' },
  { value: 'safety', label: 'Safety' },
  { value: 'other', label: 'Other' }
];

export const DOCUMENT_TYPES = [
  { value: 'manual', label: 'Manual' },
  { value: 'video', label: 'Video' },
  { value: 'guide', label: 'Guide' },
  { value: 'other', label: 'Other' }
];

export const NOTIFICATION_TYPES = {
  NEW_REQUEST: 'new_request',
  STATUS_UPDATE: 'status_update',
  MAINTENANCE_DUE: 'maintenance_due',
  CHAT_MESSAGE: 'chat_message',
  EMERGENCY: 'emergency'
};

export const DATE_FORMAT = 'MMM d, yyyy';
export const TIME_FORMAT = 'h:mm a';
export const DATETIME_FORMAT = 'MMM d, yyyy h:mm a';

// src/utils/helpers.ts

import { format, formatDistance, formatRelative } from 'date-fns';

export const formatDate = (date: Date | string | number): string => {
  if (typeof date === 'string' || typeof date === 'number') {
    date = new Date(date);
  }
  return format(date, 'MMM d, yyyy');
};

export const formatTime = (date: Date | string | number): string => {
  if (typeof date === 'string' || typeof date === 'number') {
    date = new Date(date);
  }
  return format(date, 'h:mm a');
};

export const formatDateTime = (date: Date | string | number): string => {
  if (typeof date === 'string' || typeof date === 'number') {
    date = new Date(date);
  }
  return format(date, 'MMM d, yyyy h:mm a');
};

export const formatRelativeTime = (date: Date | string | number): string => {
  if (typeof date === 'string' || typeof date === 'number') {
    date = new Date(date);
  }
  return formatDistance(date, new Date(), { addSuffix: true });
};

export const formatCurrency = (amount: number): string => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD'
  }).format(amount);
};

export const generateId = (): string => {
  return Date.now().toString(36) + Math.random().toString(36).substr(2);
};

export const debounce = <T extends (...args: any[]) => any>(
  func: T,
  wait: number
): ((...args: Parameters<T>) => void) => {
  let timeout: NodeJS.Timeout;
  
  return (...args: Parameters<T>) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), wait);
  };
};

export const throttle = <T extends (...args: any[]) => any>(
  func: T,
  wait: number
): ((...args: Parameters<T>) => void) => {
  let inThrottle: boolean;
  
  return (...args: Parameters<T>) => {
    if (!inThrottle) {
      func(...args);
      inThrottle = true;
      setTimeout(() => inThrottle = false, wait);
    }
  };
};

export const classNames = (...classes: (string | boolean | undefined)[]): string => {
  return classes.filter(Boolean).join(' ');
};

export const truncate = (text: string, maxLength: number): string => {
  if (text.length <= maxLength) return text;
  return text.substr(0, maxLength) + '...';
};

export const getInitials = (name: string): string => {
  const parts = name.split(' ');
  return parts
    .map(part => part.charAt(0).toUpperCase())
    .slice(0, 2)
    .join('');
};

// src/utils/validators.ts

export const validators = {
  email: (email: string): boolean => {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
  },

  phone: (phone: string): boolean => {
    const re = /^[\+]?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4,6}$/;
    return re.test(phone);
  },

  required: (value: any): boolean => {
    return value !== null && value !== undefined && value !== '';
  },

  minLength: (value: string, min: number): boolean => {
    return value.length >= min;
  },

  maxLength: (value: string, max: number): boolean => {
    return value.length <= max;
  },

  number: (value: any): boolean => {
    return !isNaN(value) && isFinite(value);
  },

  positiveNumber: (value: number): boolean => {
    return validators.number(value) && value > 0;
  },

  url: (url: string): boolean => {
    try {
      new URL(url);
      return true;
    } catch {
      return false;
    }
  },

  date: (date: any): boolean => {
    const parsed = new Date(date);
    return !isNaN(parsed.getTime());
  },

  futureDate: (date: any): boolean => {
    const parsed = new Date(date);
    return validators.date(date) && parsed > new Date();
  },

  password: (password: string): {
    valid: boolean;
    errors: string[];
  } => {
    const errors: string[] = [];
    
    if (password.length < 8) {
      errors.push('Password must be at least 8 characters long');
    }
    
    if (!/[A-Z]/.test(password)) {
      errors.push('Password must contain at least one uppercase letter');
    }
    
    if (!/[a-z]/.test(password)) {
      errors.push('Password must contain at least one lowercase letter');
    }
    
    if (!/[0-9]/.test(password)) {
      errors.push('Password must contain at least one number');
    }
    
    return {
      valid: errors.length === 0,
      errors
    };
  }
};

// src/utils/formatters.ts

export const formatters = {
  phone: (phone: string): string => {
    const cleaned = phone.replace(/\D/g, '');
    const match = cleaned.match(/^(\d{3})(\d{3})(\d{4})$/);
    if (match) {
      return '(' + match[1] + ') ' + match[2] + '-' + match[3];
    }
    return phone;
  },

  currency: (amount: number): string => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
  },

  percent: (value: number): string => {
    return new Intl.NumberFormat('en-US', {
      style: 'percent',
      minimumFractionDigits: 0,
      maximumFractionDigits: 2
    }).format(value / 100);
  },

  fileSize: (bytes: number): string => {
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    if (bytes === 0) return '0 Bytes';
    const i = Math.floor(Math.log(bytes) / Math.log(1024));
    return Math.round(bytes / Math.pow(1024, i) * 100) / 100 + ' ' + sizes[i];
  },

  duration: (minutes: number): string => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    if (hours === 0) return `${mins}m`;
    if (mins === 0) return `${hours}h`;
    return `${hours}h ${mins}m`;
  },

  boatName: (boat: { name: string; year: number; make: string; model: string }): string => {
    return `${boat.name} (${boat.year} ${boat.make} ${boat.model})`;
  },

  address: (address: {
    street: string;
    city: string;
    state: string;
    zip: string;
  }): string => {
    return `${address.street}, ${address.city}, ${address.state} ${address.zip}`;
  }
};