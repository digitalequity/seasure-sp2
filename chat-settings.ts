// src/components/chat/ChatSettings.tsx

import React, { useState } from 'react';
import { Switch } from '@headlessui/react';
import { BellIcon, VolumeUpIcon, ArchiveIcon, TrashIcon } from '@heroicons/react/outline';

interface ChatSettingsProps {
  chatRoomId: string;
  isOpen: boolean;
  onClose: () => void;
}

interface ChatPreferences {
  notifications: {
    desktop: boolean;
    sound: boolean;
    email: boolean;
  };
  display: {
    showTimestamps: boolean;
    compactMode: boolean;
    showOnlineStatus: boolean;
  };
  privacy: {
    readReceipts: boolean;
    typingIndicators: boolean;
  };
}

export const ChatSettings: React.FC<ChatSettingsProps> = ({ chatRoomId, isOpen, onClose }) => {
  const [preferences, setPreferences] = useState<ChatPreferences>({
    notifications: {
      desktop: true,
      sound: true,
      email: false
    },
    display: {
      showTimestamps: true,
      compactMode: false,
      showOnlineStatus: true
    },
    privacy: {
      readReceipts: true,
      typingIndicators: true
    }
  });

  const [showDeleteModal, setShowDeleteModal] = useState(false);

  const updatePreference = (category: keyof ChatPreferences, setting: string, value: boolean) => {
    setPreferences(prev => ({
      ...prev,
      [category]: {
        ...prev[category],
        [setting]: value
      }
    }));
  };

  const handleArchiveChat = () => {
    console.log('Archiving chat:', chatRoomId);
    onClose();
  };

  const handleDeleteChat = () => {
    console.log('Deleting chat:', chatRoomId);
    setShowDeleteModal(false);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <>
      <div className="fixed inset-0 z-50 overflow-hidden">
        <div className="absolute inset-0 bg-black bg-opacity-50" onClick={onClose} />
        
        <div className="absolute right-0 top-0 h-full w-96 bg-white shadow-xl">
          <div className="flex items-center justify-between p-4 border-b">
            <h2 className="text-lg font-medium text-gray-900">Chat Settings</h2>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-500"
            >
              <span className="sr-only">Close</span>
              ×
            </button>
          </div>

          <div className="p-4 space-y-6">
            {/* Notifications */}
            <div>
              <h3 className="text-sm font-medium text-gray-900 mb-4">Notifications</h3>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <BellIcon className="h-5 w-5 text-gray-400 mr-3" />
                    <span className="text-sm text-gray-700">Desktop Notifications</span>
                  </div>
                  <Switch
                    checked={preferences.notifications.desktop}
                    onChange={(value) => updatePreference('notifications', 'desktop', value)}
                    className={`${
                      preferences.notifications.desktop ? 'bg-blue-600' : 'bg-gray-200'
                    } relative inline-flex h-6 w-11 items-center rounded-full`}
                  >
                    <span className="sr-only">Enable desktop notifications</span>
                    <span
                      className={`${
                        preferences.notifications.desktop ? 'translate-x-6' : 'translate-x-1'
                      } inline-block h-4 w-4 transform rounded-full bg-white transition`}
                    />
                  </Switch>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <VolumeUpIcon className="h-5 w-5 text-gray-400 mr-3" />
                    <span className="text-sm text-gray-700">Sound Notifications</span>
                  </div>
                  <Switch
                    checked={preferences.notifications.sound}
                    onChange={(value) => updatePreference('notifications', 'sound', value)}
                    className={`${
                      preferences.notifications.sound ? 'bg-blue-600' : 'bg-gray-200'
                    } relative inline-flex h-6 w-11 items-center rounded-full`}
                  >
                    <span className="sr-only">Enable sound notifications</span>
                    <span
                      className={`${
                        preferences.notifications.sound ? 'translate-x-6' : 'translate-x-1'
                      } inline-block h-4 w-4 transform rounded-full bg-white transition`}
                    />
                  </Switch>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <svg className="h-5 w-5 text-gray-400 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                    <span className="text-sm text-gray-700">Email Notifications</span>
                  </div>
                  <Switch
                    checked={preferences.notifications.email}
                    onChange={(value) => updatePreference('notifications', 'email', value)}
                    className={`${
                      preferences.notifications.email ? 'bg-blue-600' : 'bg-gray-200'
                    } relative inline-flex h-6 w-11 items-center rounded-full`}
                  >
                    <span className="sr-only">Enable email notifications</span>
                    <span
                      className={`${
                        preferences.notifications.email ? 'translate-x-6' : 'translate-x-1'
                      } inline-block h-4 w-4 transform rounded-full bg-white transition`}
                    />
                  </Switch>
                </div>
              </div>
            </div>

            {/* Display */}
            <div>
              <h3 className="text-sm font-medium text-gray-900 mb-4">Display</h3>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-700">Show Timestamps</span>
                  <Switch
                    checked={preferences.display.showTimestamps}
                    onChange={(value) => updatePreference('display', 'showTimestamps', value)}
                    className={`${
                      preferences.display.showTimestamps ? 'bg-blue-600' : 'bg-gray-200'
                    } relative inline-flex h-6 w-11 items-center rounded-full`}
                  >
                    <span className="sr-only">Show timestamps</span>
                    <span
                      className={`${
                        preferences.display.showTimestamps ? 'translate-x-6' : 'translate-x-1'
                      } inline-block h-4 w-4 transform rounded-full bg-white transition`}
                    />
                  </Switch>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-700">Compact Mode</span>
                  <Switch
                    checked={preferences.display.compactMode}
                    onChange={(value) => updatePreference('display', 'compactMode', value)}
                    className={`${
                      preferences.display.compactMode ? 'bg-blue-600' : 'bg-gray-200'
                    } relative inline-flex h-6 w-11 items-center rounded-full`}
                  >
                    <span className="sr-only">Enable compact mode</span>
                    <span
                      className={`${
                        preferences.display.compactMode ? 'translate-x-6' : 'translate-x-1'
                      } inline-block h-4 w-4 transform rounded-full bg-white transition`}
                    />
                  </Switch>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-700">Show Online Status</span>
                  <Switch
                    checked={preferences.display.showOnlineStatus}
                    onChange={(value) => updatePreference('display', 'showOnlineStatus', value)}
                    className={`${
                      preferences.display.showOnlineStatus ? 'bg-blue-600' : 'bg-gray-200'
                    } relative inline-flex h-6 w-11 items-center rounded-full`}
                  >
                    <span className="sr-only">Show online status</span>
                    <span
                      className={`${
                        preferences.display.showOnlineStatus ? 'translate-x-6' : 'translate-x-1'
                      } inline-block h-4 w-4 transform rounded-full bg-white transition`}
                    />
                  </Switch>
                </div>
              </div>
            </div>

            {/* Privacy */}
            <div>
              <h3 className="text-sm font-medium text-gray-900 mb-4">Privacy</h3>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-700">Read Receipts</span>
                  <Switch
                    checked={preferences.privacy.readReceipts}
                    onChange={(value) => updatePreference('privacy', 'readReceipts', value)}
                    className={`${
                      preferences.privacy.readReceipts ? 'bg-blue-600' : 'bg-gray-200'
                    } relative inline-flex h-6 w-11 items-center rounded-full`}
                  >
                    <span className="sr-only">Enable read receipts</span>
                    <span
                      className={`${
                        preferences.privacy.readReceipts ? 'translate-x-6' : 'translate-x-1'
                      } inline-block h-4 w-4 transform rounded-full bg-white transition`}
                    />
                  </Switch>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-700">Typing Indicators</span>
                  <Switch
                    checked={preferences.privacy.typingIndicators}
                    onChange={(value) => updatePreference('privacy', 'typingIndicators', value)}
                    className={`${
                      preferences.privacy.typingIndicators ? 'bg-blue-600' : 'bg-gray-200'
                    } relative inline-flex h-6 w-11 items-center rounded-full`}
                  >
                    <span className="sr-only">Show typing indicators</span>
                    <span
                      className={`${
                        preferences.privacy.typingIndicators ? 'translate-x-6' : 'translate-x-1'
                      } inline-block h-4 w-4 transform rounded-full bg-white transition`}
                    />
                  </Switch>
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="pt-6 border-t space-y-3">
              <button
                onClick={handleArchiveChat}
                className="w-full flex items-center justify-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
              >
                <ArchiveIcon className="h-5 w-5 mr-2" />
                Archive Chat
              </button>
              <button
                onClick={() => setShowDeleteModal(true)}
                className="w-full flex items-center justify-center px-4 py-2 border border-red-300 text-sm font-medium rounded-md text-red-700 bg-white hover:bg-red-50"
              >
                <TrashIcon className="h-5 w-5 mr-2" />
                Delete Chat
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      {showDeleteModal && (
        <div className="fixed z-60 inset-0 overflow-y-auto">
          <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
            <div className="fixed inset-0 transition-opacity" aria-hidden="true">
              <div className="absolute inset-0 bg-gray-500 opacity-75"></div>
            </div>
            <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
              <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                <div className="sm:flex sm:items-start">
                  <div className="mx-auto flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full bg-red-100 sm:mx-0 sm:h-10 sm:w-10">
                    <TrashIcon className="h-6 w-6 text-red-600" aria-hidden="true" />
                  </div>
                  <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
                    <h3 className="text-lg leading-6 font-medium text-gray-900">
                      Delete Chat
                    </h3>
                    <div className="mt-2">
                      <p className="text-sm text-gray-500">
                        Are you sure you want to delete this chat? All messages and files will be permanently deleted. This action cannot be undone.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
              <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                <button
                  type="button"
                  className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-red-600 text-base font-medium text-white hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 sm:ml-3 sm:w-auto sm:text-sm"
                  onClick={handleDeleteChat}
                >
                  Delete
                </button>
                <button
                  type="button"
                  className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
                  onClick={() => setShowDeleteModal(false)}
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};