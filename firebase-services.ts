// src/services/firebase/config.ts

import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';
import { getFunctions } from 'firebase/functions';
import { getAnalytics } from 'firebase/analytics';

const firebaseConfig = {
  apiKey: process.env.REACT_APP_FIREBASE_API_KEY,
  authDomain: process.env.REACT_APP_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.REACT_APP_FIREBASE_PROJECT_ID,
  storageBucket: process.env.REACT_APP_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.REACT_APP_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.REACT_APP_FIREBASE_APP_ID,
  measurementId: process.env.REACT_APP_FIREBASE_MEASUREMENT_ID
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize services
export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);
export const functions = getFunctions(app);
export const analytics = getAnalytics(app);

// src/services/firebase/auth.ts

import { 
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  sendPasswordResetEmail,
  updateProfile,
  User
} from 'firebase/auth';
import { auth, db } from './config';
import { doc, setDoc, getDoc } from 'firebase/firestore';
import { ServiceProvider } from '../../types';

export const signIn = async (email: string, password: string): Promise<User> => {
  const userCredential = await signInWithEmailAndPassword(auth, email, password);
  return userCredential.user;
};

export const signUp = async (
  email: string, 
  password: string, 
  displayName: string,
  companyName: string
): Promise<User> => {
  const userCredential = await createUserWithEmailAndPassword(auth, email, password);
  const user = userCredential.user;
  
  // Update display name
  await updateProfile(user, { displayName });
  
  // Create service provider profile
  const serviceProviderData: Partial<ServiceProvider> = {
    email,
    displayName,
    companyName,
    subscription: {
      plan: 'basic',
      status: 'active',
      boatLimit: 10,
      currentBoatCount: 0,
      billingCycle: 'monthly',
      nextBillingDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
      features: ['boat_management', 'chat', 'basic_analytics']
    },
    settings: {
      notifications: {
        email: true,
        push: true,
        sms: false,
        newRequests: true,
        chatMessages: true,
        maintenanceDue: true,
        emergencies: true
      },
      privacy: {
        profileVisibility: 'clients',
        shareLocation: false,
        shareContactInfo: true
      },
      display: {
        theme: 'light',
        dashboardLayout: ['metrics', 'requests', 'boats'],
        defaultView: 'dashboard'
      }
    }
  };
  
  await setDoc(doc(db, 'serviceProviders', user.uid), serviceProviderData);
  
  return user;
};

export const logout = async (): Promise<void> => {
  await signOut(auth);
};

export const resetPassword = async (email: string): Promise<void> => {
  await sendPasswordResetEmail(auth, email);
};

export const getServiceProviderProfile = async (userId: string): Promise<ServiceProvider | null> => {
  const docRef = doc(db, 'serviceProviders', userId);
  const docSnap = await getDoc(docRef);
  
  if (docSnap.exists()) {
    return { id: docSnap.id, ...docSnap.data() } as ServiceProvider;
  }
  
  return null;
};

// src/services/firebase/firestore.ts

import {
  collection,
  doc,
  getDoc,
  setDoc,
  updateDoc,
  deleteDoc,
  query,
  where,
  orderBy,
  limit,
  startAfter,
  getDocs,
  onSnapshot,
  QueryDocumentSnapshot,
  DocumentData,
  Unsubscribe,
  addDoc,
  serverTimestamp,
  increment
} from 'firebase/firestore';
import { db } from './config';

export const COLLECTIONS = {
  SERVICE_PROVIDERS: 'serviceProviders',
  BOATS: 'boats',
  REQUESTS: 'requests',
  CHAT_ROOMS: 'chatRooms',
  MESSAGES: 'messages',
  KNOWLEDGE: 'knowledge',
  INVOICES: 'invoices',
  TIME_ENTRIES: 'timeEntries',
  PARTS: 'parts',
  CUSTOMERS: 'customers'
} as const;

// Generic CRUD operations
export const createDocument = async <T extends DocumentData>(
  collectionPath: string,
  data: Omit<T, 'id' | 'createdAt' | 'updatedAt'>
): Promise<string> => {
  const docRef = await addDoc(collection(db, collectionPath), {
    ...data,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp()
  });
  return docRef.id;
};

export const getDocument = async <T>(
  collectionPath: string,
  documentId: string
): Promise<T | null> => {
  const docRef = doc(db, collectionPath, documentId);
  const docSnap = await getDoc(docRef);
  
  if (docSnap.exists()) {
    return { id: docSnap.id, ...docSnap.data() } as T;
  }
  
  return null;
};

export const updateDocument = async <T extends DocumentData>(
  collectionPath: string,
  documentId: string,
  data: Partial<T>
): Promise<void> => {
  const docRef = doc(db, collectionPath, documentId);
  await updateDoc(docRef, {
    ...data,
    updatedAt: serverTimestamp()
  });
};

export const deleteDocument = async (
  collectionPath: string,
  documentId: string
): Promise<void> => {
  const docRef = doc(db, collectionPath, documentId);
  await deleteDoc(docRef);
};

// Pagination helper
export const paginatedQuery = async <T>(
  collectionPath: string,
  filters: Array<{ field: string; operator: any; value: any }>,
  orderByField: string,
  pageSize: number,
  lastDoc?: QueryDocumentSnapshot<DocumentData>
): Promise<{ data: T[]; lastDoc: QueryDocumentSnapshot<DocumentData> | null }> => {
  let q = query(collection(db, collectionPath));
  
  // Apply filters
  filters.forEach(filter => {
    q = query(q, where(filter.field, filter.operator, filter.value));
  });
  
  // Apply ordering
  q = query(q, orderBy(orderByField), limit(pageSize));
  
  // Apply pagination
  if (lastDoc) {
    q = query(q, startAfter(lastDoc));
  }
  
  const querySnapshot = await getDocs(q);
  const data: T[] = [];
  let lastDocument: QueryDocumentSnapshot<DocumentData> | null = null;
  
  querySnapshot.forEach((doc) => {
    data.push({ id: doc.id, ...doc.data() } as T);
    lastDocument = doc;
  });
  
  return { data, lastDoc: lastDocument };
};

// Real-time subscription
export const subscribeToDocument = <T>(
  collectionPath: string,
  documentId: string,
  callback: (data: T | null) => void
): Unsubscribe => {
  const docRef = doc(db, collectionPath, documentId);
  
  return onSnapshot(docRef, (docSnap) => {
    if (docSnap.exists()) {
      callback({ id: docSnap.id, ...docSnap.data() } as T);
    } else {
      callback(null);
    }
  });
};

export const subscribeToCollection = <T>(
  collectionPath: string,
  filters: Array<{ field: string; operator: any; value: any }>,
  callback: (data: T[]) => void
): Unsubscribe => {
  let q = query(collection(db, collectionPath));
  
  filters.forEach(filter => {
    q = query(q, where(filter.field, filter.operator, filter.value));
  });
  
  return onSnapshot(q, (querySnapshot) => {
    const data: T[] = [];
    querySnapshot.forEach((doc) => {
      data.push({ id: doc.id, ...doc.data() } as T);
    });
    callback(data);
  });
};

// Specific operations for chat
export const incrementUnreadCount = async (
  chatRoomId: string,
  userId: string
): Promise<void> => {
  const docRef = doc(db, COLLECTIONS.CHAT_ROOMS, chatRoomId);
  await updateDoc(docRef, {
    [`unreadCount.${userId}`]: increment(1)
  });
};

export const resetUnreadCount = async (
  chatRoomId: string,
  userId: string
): Promise<void> => {
  const docRef = doc(db, COLLECTIONS.CHAT_ROOMS, chatRoomId);
  await updateDoc(docRef, {
    [`unreadCount.${userId}`]: 0
  });
};

// src/services/firebase/storage.ts

import {
  ref,
  uploadBytes,
  uploadBytesResumable,
  getDownloadURL,
  deleteObject,
  listAll,
  getMetadata
} from 'firebase/storage';
import { storage } from './config';

export const uploadFile = async (
  path: string,
  file: File,
  onProgress?: (progress: number) => void
): Promise<string> => {
  const storageRef = ref(storage, path);
  
  if (onProgress) {
    const uploadTask = uploadBytesResumable(storageRef, file);
    
    return new Promise((resolve, reject) => {
      uploadTask.on(
        'state_changed',
        (snapshot) => {
          const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          onProgress(progress);
        },
        (error) => reject(error),
        async () => {
          const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
          resolve(downloadURL);
        }
      );
    });
  } else {
    const snapshot = await uploadBytes(storageRef, file);
    return getDownloadURL(snapshot.ref);
  }
};

export const deleteFile = async (path: string): Promise<void> => {
  const storageRef = ref(storage, path);
  await deleteObject(storageRef);
};

export const getFileUrl = async (path: string): Promise<string> => {
  const storageRef = ref(storage, path);
  return getDownloadURL(storageRef);
};

export const listFiles = async (path: string): Promise<string[]> => {
  const listRef = ref(storage, path);
  const res = await listAll(listRef);
  
  const urls = await Promise.all(
    res.items.map(itemRef => getDownloadURL(itemRef))
  );
  
  return urls;
};

export const getFileMetadata = async (path: string) => {
  const storageRef = ref(storage, path);
  return getMetadata(storageRef);
};

// src/services/firebase/functions.ts

import { httpsCallable } from 'firebase/functions';
import { functions } from './config';

// Define cloud function interfaces
interface SendNotificationData {
  userId: string;
  type: string;
  title: string;
  body: string;
  data?: Record<string, any>;
}

interface GenerateInvoiceData {
  invoiceId: string;
  format: 'pdf' | 'html';
}

interface ProcessAIRequestData {
  type: 'diagnostic' | 'maintenance' | 'chat';
  context: Record<string, any>;
  prompt: string;
}

// Cloud function wrappers
export const sendNotification = httpsCallable<SendNotificationData, { success: boolean }>(
  functions,
  'sendNotification'
);

export const generateInvoice = httpsCallable<GenerateInvoiceData, { url: string }>(
  functions,
  'generateInvoice'
);

export const processAIRequest = httpsCallable<ProcessAIRequestData, { result: string }>(
  functions,
  'processAIRequest'
);

export const syncWithSeaSure = httpsCallable<{ providerId: string }, { synced: number }>(
  functions,
  'syncWithSeaSure'
);

export const generateReport = httpsCallable<
  { type: string; startDate: string; endDate: string },
  { url: string }
>(functions, 'generateReport');
