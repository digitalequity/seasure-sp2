// src/components/chat/ChatInterface.tsx

import React, { useState } from 'react';
import { useChat } from '../../hooks/useChat';
import { ChatSidebar } from './ChatSidebar';
import { MessageList } from './MessageList';
import { MessageInput } from './MessageInput';
import { UserGroupIcon } from '@heroicons/react/outline';

export const ChatInterface: React.FC = () => {
  const { chatRooms, activeChatRoom, setActiveChatRoom } = useChat();
  const [sidebarOpen, setSidebarOpen] = useState(true);

  return (
    <div className="flex h-full">
      {/* Sidebar */}
      <div className={`${sidebarOpen ? 'w-64' : 'w-0'} transition-all duration-300 overflow-hidden`}>
        <ChatSidebar
          chatRooms={chatRooms}
          activeRoom={activeChatRoom}
          onRoomSelect={setActiveChatRoom}
        />
      </div>

      {/* Main Chat Area */}
      <div className="flex-1 flex flex-col">
        {activeChatRoom ? (
          <>
            {/* Chat Header */}
            <div className="bg-white border-b px-6 py-4 flex items-center justify-between">
              <div className="flex items-center">
                <button
                  onClick={() => setSidebarOpen(!sidebarOpen)}
                  className="mr-4 p-2 rounded-lg hover:bg-gray-100"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                  </svg>
                </button>
                <div>
                  <h2 className="text-lg font-semibold text-gray-900">
                    {activeChatRoom.name}
                  </h2>
                  <p className="text-sm text-gray-500">
                    {activeChatRoom.participants.length} participants
                  </p>
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <button className="p-2 rounded-lg hover:bg-gray-100">
                  <UserGroupIcon className="w-5 h-5 text-gray-500" />
                </button>
              </div>
            </div>

            {/* Messages Area */}
            <div className="flex-1 overflow-hidden">
              <MessageList chatRoomId={activeChatRoom.id} />
            </div>

            {/* Message Input */}
            <div className="border-t bg-white px-6 py-4">
              <MessageInput chatRoomId={activeChatRoom.id} />
            </div>
          </>
        ) : (
          <div className="flex-1 flex items-center justify-center">
            <div className="text-center">
              <p className="text-gray-500">Select a conversation to start chatting</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

// src/components/chat/ChatSidebar.tsx

import React from 'react';
import { ChatRoom } from '../../types';
import { ChatIcon, UserGroupIcon } from '@heroicons/react/outline';

interface ChatSidebarProps {
  chatRooms: ChatRoom[];
  activeRoom: ChatRoom | null;
  onRoomSelect: (room: ChatRoom) => void;
}

export const ChatSidebar: React.FC<ChatSidebarProps> = ({
  chatRooms,
  activeRoom,
  onRoomSelect,
}) => {
  return (
    <div className="bg-gray-50 h-full border-r overflow-y-auto">
      <div className="px-4 py-4">
        <h3 className="text-lg font-semibold text-gray-900">Messages</h3>
      </div>
      
      <div className="space-y-1 px-2">
        {chatRooms.map((room) => {
          const isActive = activeRoom?.id === room.id;
          const unreadCount = room.unreadCount?.[room.id] || 0;
          
          return (
            <button
              key={room.id}
              onClick={() => onRoomSelect(room)}
              className={`w-full flex items-center px-3 py-3 rounded-lg transition-colors ${
                isActive
                  ? 'bg-blue-50 text-blue-700'
                  : 'hover:bg-gray-100 text-gray-700'
              }`}
            >
              <div className="flex-shrink-0">
                {room.type === 'boat' ? (
                  <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                    <span className="text-blue-600 font-medium">
                      {room.name.charAt(0).toUpperCase()}
                    </span>
                  </div>
                ) : (
                  <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center">
                    <UserGroupIcon className="w-5 h-5 text-gray-600" />
                  </div>
                )}
              </div>
              
              <div className="ml-3 flex-1 text-left">
                <div className="flex items-center justify-between">
                  <p className={`text-sm font-medium ${
                    isActive ? 'text-blue-700' : 'text-gray-900'
                  }`}>
                    {room.name}
                  </p>
                  {unreadCount > 0 && (
                    <span className="inline-flex items-center justify-center px-2 py-1 text-xs font-bold leading-none text-white bg-blue-600 rounded-full">
                      {unreadCount}
                    </span>
                  )}
                </div>
                {room.lastMessage && (
                  <p className="text-sm text-gray-500 truncate">
                    {room.lastMessage.content}
                  </p>
                )}
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
};

// src/components/chat/MessageList.tsx

import React, { useEffect, useRef } from 'react';
import { useChat } from '../../hooks/useChat';
import { useAuth } from '../../hooks/useAuth';
import { Message } from '../../types';
import { format } from 'date-fns';

interface MessageListProps {
  chatRoomId: string;
}

export const MessageList: React.FC<MessageListProps> = ({ chatRoomId }) => {
  const { user } = useAuth();
  const { messages, loadMoreMessages, hasMore, markAsRead } = useChat(chatRoomId);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    scrollToBottom();
    markAsRead();
  }, [messages, markAsRead]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleScroll = () => {
    if (scrollContainerRef.current) {
      const { scrollTop } = scrollContainerRef.current;
      if (scrollTop === 0 && hasMore) {
        loadMoreMessages();
      }
    }
  };

  const groupMessagesByDate = (messages: Message[]) => {
    const groups: Record<string, Message[]> = {};
    
    messages.forEach((message) => {
      const date = format(new Date(message.createdAt.seconds * 1000), 'yyyy-MM-dd');
      if (!groups[date]) {
        groups[date] = [];
      }
      groups[date].push(message);
    });
    
    return groups;
  };

  const messageGroups = groupMessagesByDate(messages);

  return (
    <div
      ref={scrollContainerRef}
      onScroll={handleScroll}
      className="flex-1 overflow-y-auto px-6 py-4"
    >
      {Object.entries(messageGroups).map(([date, dayMessages]) => (
        <div key={date}>
          <div className="flex items-center justify-center my-4">
            <div className="bg-gray-200 rounded-full px-3 py-1">
              <p className="text-xs text-gray-600">
                {format(new Date(date), 'MMMM d, yyyy')}
              </p>
            </div>
          </div>
          
          {dayMessages.map((message) => {
            const isOwnMessage = message.senderId === user?.uid;
            
            return (
              <div
                key={message.id}
                className={`flex mb-4 ${isOwnMessage ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-xs px-4 py-2 rounded-lg ${
                    isOwnMessage
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-100 text-gray-900'
                  }`}
                >
                  {!isOwnMessage && (
                    <p className="text-xs font-semibold mb-1">
                      {message.senderName}
                    </p>
                  )}
                  <p className="text-sm">{message.content}</p>
                  <p className={`text-xs mt-1 ${
                    isOwnMessage ? 'text-blue-200' : 'text-gray-500'
                  }`}>
                    {format(new Date(message.createdAt.seconds * 1000), 'h:mm a')}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      ))}
      <div ref={messagesEndRef} />
    </div>
  );
};

// src/components/chat/MessageInput.tsx

import React, { useState, useRef } from 'react';
import { useChat } from '../../hooks/useChat';
import { PaperClipIcon, PhotographIcon, EmojiHappyIcon } from '@heroicons/react/outline';

interface MessageInputProps {
  chatRoomId: string;
}

export const MessageInput: React.FC<MessageInputProps> = ({ chatRoomId }) => {
  const { sendMessage, sendFile } = useChat(chatRoomId);
  const [message, setMessage] = useState('');
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (message.trim()) {
      await sendMessage(message.trim());
      setMessage('');
    }
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setIsUploading(true);
      await sendFile(file);
      setIsUploading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e as any);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex items-end space-x-2">
      <div className="flex-1 relative">
        <textarea
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          onKeyPress={handleKeyPress}
          placeholder="Type a message..."
          rows={1}
          className="w-full px-4 py-2 pr-10 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
          disabled={isUploading}
        />
        <button
          type="button"
          onClick={() => {}}
          className="absolute right-2 bottom-2 p-1 text-gray-400 hover:text-gray-600"
        >
          <EmojiHappyIcon className="w-5 h-5" />
        </button>
      </div>
      
      <input
        ref={fileInputRef}
        type="file"
        onChange={handleFileUpload}
        className="hidden"
        accept="image/*,.pdf,.doc,.docx"
      />
      
      <button
        type="button"
        onClick={() => fileInputRef.current?.click()}
        className="p-2 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100"
        disabled={isUploading}
      >
        <PaperClipIcon className="w-5 h-5" />
      </button>
      
      <button
        type="submit"
        className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50"
        disabled={!message.trim() || isUploading}
      >
        Send
      </button>
    </form>
  );
};