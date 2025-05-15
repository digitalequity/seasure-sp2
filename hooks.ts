// src/hooks/useAuth.ts

import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthContext } from '../contexts/AuthContext';
import { signIn, signUp, logout, resetPassword } from '../services/firebase/auth';

export const useAuth = () => {
  const { user, serviceProvider, loading } = useAuthContext();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const login = async (email: string, password: string) => {
    setIsLoading(true);
    setError(null);
    try {
      await signIn(email, password);
      navigate('/dashboard');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Login failed');
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (
    email: string,
    password: string,
    displayName: string,
    companyName: string
  ) => {
    setIsLoading(true);
    setError(null);
    try {
      await signUp(email, password, displayName, companyName);
      navigate('/dashboard');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Registration failed');
    } finally {
      setIsLoading(false);
    }
  };

  const signOut = async () => {
    setIsLoading(true);
    try {
      await logout();
      navigate('/login');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Logout failed');
    } finally {
      setIsLoading(false);
    }
  };

  const requestPasswordReset = async (email: string) => {
    setIsLoading(true);
    setError(null);
    try {
      await resetPassword(email);
      return true;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Password reset failed');
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  return {
    user,
    serviceProvider,
    isAuthenticated: !!user,
    isLoading: loading || isLoading,
    error,
    login,
    register,
    signOut,
    requestPasswordReset
  };
};

// src/hooks/useBoats.ts

import { useState, useCallback } from 'react';
import { useAppContext } from '../contexts/AppContext';
import { boatService } from '../services/api/boats';
import { Boat, ServiceRecord, MaintenanceItem } from '../types';

export const useBoats = () => {
  const { boats, selectedBoat, setSelectedBoat } = useAppContext();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const createBoat = async (boatData: Omit<Boat, 'id' | 'createdAt' | 'updatedAt'>) => {
    setIsLoading(true);
    setError(null);
    try {
      const boatId = await boatService.createBoat(boatData);
      return boatId;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create boat');
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  const updateBoat = async (boatId: string, updates: Partial<Boat>) => {
    setIsLoading(true);
    setError(null);
    try {
      await boatService.updateBoat(boatId, updates);
      return true;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update boat');
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const deleteBoat = async (boatId: string) => {
    setIsLoading(true);
    setError(null);
    try {
      await boatService.deleteBoat(boatId);
      setSelectedBoat(null);
      return true;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete boat');
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const uploadBoatImage = async (boatId: string, file: File) => {
    setIsLoading(true);
    setError(null);
    try {
      const imageUrl = await boatService.uploadBoatImage(boatId, file);
      return imageUrl;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to upload image');
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  const addServiceRecord = async (boatId: string, record: Omit<ServiceRecord, 'id'>) => {
    setIsLoading(true);
    setError(null);
    try {
      await boatService.addServiceRecord(boatId, record);
      return true;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to add service record');
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const updateMaintenanceSchedule = async (boatId: string, schedule: MaintenanceItem[]) => {
    setIsLoading(true);
    setError(null);
    try {
      await boatService.updateMaintenanceSchedule(boatId, schedule);
      return true;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update maintenance schedule');
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const searchBoats = useCallback(async (searchTerm: string) => {
    if (!searchTerm) return boats;
    
    setIsLoading(true);
    try {
      const results = await boatService.searchBoats(
        boats[0]?.serviceProviderId || '',
        searchTerm
      );
      return results;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Search failed');
      return [];
    } finally {
      setIsLoading(false);
    }
  }, [boats]);

  return {
    boats,
    selectedBoat,
    setSelectedBoat,
    isLoading,
    error,
    createBoat,
    updateBoat,
    deleteBoat,
    uploadBoatImage,
    addServiceRecord,
    updateMaintenanceSchedule,
    searchBoats
  };
};

// src/hooks/useRequests.ts

import { useState, useCallback } from 'react';
import { useAppContext } from '../contexts/AppContext';
import { requestService } from '../services/api/requests';
import { ServiceRequest, RequestStatus } from '../types';

export const useRequests = () => {
  const { requests, selectedRequest, setSelectedRequest } = useAppContext();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const createRequest = async (
    requestData: Omit<ServiceRequest, 'id' | 'createdAt' | 'updatedAt'>
  ) => {
    setIsLoading(true);
    setError(null);
    try {
      const requestId = await requestService.createRequest(requestData);
      return requestId;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create request');
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  const updateRequest = async (requestId: string, updates: Partial<ServiceRequest>) => {
    setIsLoading(true);
    setError(null);
    try {
      await requestService.updateRequest(requestId, updates);
      return true;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update request');
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const updateRequestStatus = async (requestId: string, status: RequestStatus) => {
    setIsLoading(true);
    setError(null);
    try {
      await requestService.updateStatus(requestId, status);
      return true;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update status');
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const assignRequest = async (
    requestId: string,
    technicianId: string,
    technicianName: string
  ) => {
    setIsLoading(true);
    setError(null);
    try {
      await requestService.assignRequest(requestId, technicianId, technicianName);
      return true;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to assign request');
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const getRequestsByStatus = useCallback((status: RequestStatus) => {
    return requests.filter(request => request.status === status);
  }, [requests]);

  const getRequestsByBoat = useCallback((boatId: string) => {
    return requests.filter(request => request.boatId === boatId);
  }, [requests]);

  const getRequestsByPriority = useCallback((priority: string) => {
    return requests.filter(request => request.priority === priority);
  }, [requests]);

  const getUpcomingRequests = useCallback(() => {
    return requests
      .filter(request => request.scheduledDate && new Date(request.scheduledDate) > new Date())
      .sort((a, b) => 
        new Date(a.scheduledDate!).getTime() - new Date(b.scheduledDate!).getTime()
      );
  }, [requests]);

  return {
    requests,
    selectedRequest,
    setSelectedRequest,
    isLoading,
    error,
    createRequest,
    updateRequest,
    updateRequestStatus,
    assignRequest,
    getRequestsByStatus,
    getRequestsByBoat,
    getRequestsByPriority,
    getUpcomingRequests
  };
};

// src/hooks/useChat.ts

import { useState, useEffect, useCallback } from 'react';
import { useAppContext } from '../contexts/AppContext';
import { useAuthContext } from '../contexts/AuthContext';
import { chatService } from '../services/api/chat';
import { Message, ChatRoom } from '../types';

export const useChat = (chatRoomId?: string) => {
  const { user } = useAuthContext();
  const { chatRooms, activeChatRoom, setActiveChatRoom } = useAppContext();
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [hasMore, setHasMore] = useState(true);
  const [lastDoc, setLastDoc] = useState<any>(null);

  // Subscribe to messages when chat room changes
  useEffect(() => {
    if (!chatRoomId) return;

    const unsubscribe = chatService.subscribeToMessages(chatRoomId, (newMessages) => {
      setMessages(newMessages);
    });

    // Load initial messages
    loadMessages();

    return () => unsubscribe();
  }, [chatRoomId]);

  const loadMessages = async (loadMore = false) => {
    if (!chatRoomId || isLoading) return;

    setIsLoading(true);
    setError(null);
    try {
      const { messages: newMessages, lastDoc: newLastDoc } = await chatService.getMessages(
        chatRoomId,
        50,
        loadMore ? lastDoc : undefined
      );

      if (loadMore) {
        setMessages(prev => [...prev, ...newMessages]);
      } else {
        setMessages(newMessages);
      }

      setLastDoc(newLastDoc);
      setHasMore(newMessages.length === 50);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load messages');
    } finally {
      setIsLoading(false);
    }
  };

  const sendMessage = async (content: string, replyTo?: string) => {
    if (!chatRoomId || !user) return false;

    setError(null);
    try {
      await chatService.sendMessage({
        chatRoomId,
        senderId: user.uid,
        senderName: user.displayName || 'Unknown',
        content,
        type: 'text',
        isRead: false,
        readBy: { [user.uid]: new Date() },
        replyTo
      });
      return true;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to send message');
      return false;
    }
  };

  const sendFile = async (file: File) => {
    if (!chatRoomId || !user) return false;

    setIsLoading(true);
    setError(null);
    try {
      await chatService.sendFileAttachment(
        chatRoomId,
        file,
        user.uid,
        user.displayName || 'Unknown'
      );
      return true;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to send file');
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const markAsRead = useCallback(async () => {
    if (!chatRoomId || !user) return;

    try {
      await chatService.markAsRead(chatRoomId, user.uid);
    } catch (err) {
      console.error('Failed to mark messages as read:', err);
    }
  }, [chatRoomId, user]);

  const searchMessages = async (searchTerm: string) => {
    if (!chatRoomId) return [];

    setIsLoading(true);
    try {
      const results = await chatService.searchMessages(chatRoomId, searchTerm);
      return results;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Search failed');
      return [];
    } finally {
      setIsLoading(false);
    }
  };

  const createOrGetBoatChat = async (boatId: string, boatName: string) => {
    if (!user) return null;

    setIsLoading(true);
    setError(null);
    try {
      const chatRoom = await chatService.getOrCreateBoatChatRoom(
        boatId,
        boatName,
        [user.uid]
      );
      setActiveChatRoom(chatRoom);
      return chatRoom;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create chat room');
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  return {
    messages,
    chatRooms,
    activeChatRoom,
    isLoading,
    error,
    hasMore,
    sendMessage,
    sendFile,
    loadMoreMessages: () => loadMessages(true),
    markAsRead,
    searchMessages,
    createOrGetBoatChat,
    setActiveChatRoom
  };
};

// src/hooks/useKnowledge.ts

import { useState, useCallback } from 'react';
import { knowledgeService } from '../services/api/knowledge';

export const useKnowledge = () => {
  const [documents, setDocuments] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [hasMore, setHasMore] = useState(true);
  const [lastDoc, setLastDoc] = useState<any>(null);

  const uploadDocument = async (
    file: File,
    metadata: {
      title: string;
      type: 'manual' | 'video' | 'guide' | 'other';
      category: string;
      tags: string[];
      description?: string;
      boatId?: string;
      isPublic: boolean;
      createdBy: string;
    }
  ) => {
    setIsLoading(true);
    setError(null);
    try {
      const docId = await knowledgeService.uploadDocument(file, metadata);
      return docId;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to upload document');
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  const loadDocuments = async (
    providerId: string,
    filters?: {
      boatId?: string;
      category?: string;
      tags?: string[];
    },
    loadMore = false
  ) => {
    if (isLoading) return;

    setIsLoading(true);
    setError(null);
    try {
      const { documents: newDocs, lastDoc: newLastDoc } = await knowledgeService.getDocuments(
        providerId,
        filters,
        20,
        loadMore ? lastDoc : undefined
      );

      if (loadMore) {
        setDocuments(prev => [...prev, ...newDocs]);
      } else {
        setDocuments(newDocs);
      }

      setLastDoc(newLastDoc);
      setHasMore(newDocs.length === 20);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load documents');
    } finally {
      setIsLoading(false);
    }
  };

  const searchDocuments = async (providerId: string, searchTerm: string) => {
    setIsLoading(true);
    setError(null);
    try {
      const results = await knowledgeService.searchDocuments(providerId, searchTerm);
      return results;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Search failed');
      return [];
    } finally {
      setIsLoading(false);
    }
  };

  const deleteDocument = async (documentId: string) => {
    setIsLoading(true);
    setError(null);
    try {
      await knowledgeService.deleteDocument(documentId);
      setDocuments(prev => prev.filter(doc => doc.id !== documentId));
      return true;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete document');
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  return {
    documents,
    isLoading,
    error,
    hasMore,
    uploadDocument,
    loadDocuments,
    searchDocuments,
    deleteDocument,
    loadMore: (providerId: string, filters?: any) => loadDocuments(providerId, filters, true)
  };
};

// src/hooks/useNotifications.ts

export { useNotifications } from '../contexts/NotificationContext';