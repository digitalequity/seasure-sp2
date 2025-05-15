// src/components/chat/ChatUserList.tsx

import React, { useState } from 'react';
import { UserIcon, StatusOfflineIcon, StatusOnlineIcon } from '@heroicons/react/solid';
import { XIcon } from '@heroicons/react/outline';

interface ChatUser {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  role: 'owner' | 'provider' | 'technician';
  isOnline: boolean;
  lastSeen?: Date;
}

interface ChatUserListProps {
  chatRoomId: string;
  participants: string[];
  isOpen: boolean;
  onClose: () => void;
}

export const ChatUserList: React.FC<ChatUserListProps> = ({
  chatRoomId,
  participants,
  isOpen,
  onClose
}) => {
  const [users, setUsers] = useState<ChatUser[]>([
    {
      id: '1',
      name: 'John Doe',
      email: 'john@example.com',
      role: 'owner',
      isOnline: true
    },
    {
      id: '2',
      name: 'Service Provider',
      email: 'provider@example.com',
      role: 'provider',
      isOnline: true
    },
    {
      id: '3',
      name: 'Mike Tech',
      email: 'mike@example.com',
      role: 'technician',
      isOnline: false,
      lastSeen: new Date(Date.now() - 3600000) // 1 hour ago
    }
  ]);

  const getRoleBadgeColor = (role: ChatUser['role']) => {
    switch (role) {
      case 'owner':
        return 'bg-blue-100 text-blue-800';
      case 'provider':
        return 'bg-green-100 text-green-800';
      case 'technician':
        return 'bg-yellow-100 text-yellow-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const formatLastSeen = (date: Date) => {
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);

    if (days > 0) return `${days}d ago`;
    if (hours > 0) return `${hours}h ago`;
    if (minutes > 0) return `${minutes}m ago`;
    return 'Just now';
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      <div className="absolute inset-0 bg-black bg-opacity-50" onClick={onClose} />
      
      <div className="absolute right-0 top-0 h-full w-80 bg-white shadow-xl">
        <div className="flex items-center justify-between p-4 border-b">
          <h2 className="text-lg font-medium text-gray-900">Chat Participants</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-500"
          >
            <XIcon className="h-5 w-5" />
          </button>
        </div>

        <div className="p-4">
          <div className="mb-4">
            <p className="text-sm text-gray-600">{users.length} participants</p>
          </div>

          <div className="space-y-3">
            {users.map((user) => (
              <div key={user.id} className="flex items-start space-x-3">
                <div className="relative">
                  {user.avatar ? (
                    <img
                      src={user.avatar}
                      alt={user.name}
                      className="h-10 w-10 rounded-full"
                    />
                  ) : (
                    <div className="h-10 w-10 rounded-full bg-gray-200 flex items-center justify-center">
                      <UserIcon className="h-6 w-6 text-gray-500" />
                    </div>
                  )}
                  {user.isOnline ? (
                    <StatusOnlineIcon className="absolute bottom-0 right-0 h-3 w-3 text-green-500" />
                  ) : (
                    <StatusOfflineIcon className="absolute bottom-0 right-0 h-3 w-3 text-gray-400" />
                  )}
                </div>
                
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <p className="text-sm font-medium text-gray-900">{user.name}</p>
                    <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${getRoleBadgeColor(user.role)}`}>
                      {user.role}
                    </span>
                  </div>
                  <p className="text-sm text-gray-500">{user.email}</p>
                  {!user.isOnline && user.lastSeen && (
                    <p className="text-xs text-gray-400 mt-1">
                      Last seen {formatLastSeen(user.lastSeen)}
                    </p>
                  )}
                </div>
              </div>
            ))}
          </div>

          <div className="mt-6">
            <button className="w-full px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 text-sm font-medium">
              Add Participant
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};