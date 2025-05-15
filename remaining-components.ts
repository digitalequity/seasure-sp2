// src/components/knowledge/VideoLibrary.tsx

import React, { useState, useEffect } from 'react';
import { useKnowledge } from '../../hooks/useKnowledge';
import { useAuth } from '../../hooks/useAuth';
import { PlayIcon, DownloadIcon } from '@heroicons/react/outline';

export const VideoLibrary: React.FC = () => {
  const { serviceProvider } = useAuth();
  const { documents, loadDocuments, searchDocuments } = useKnowledge();
  const [videos, setVideos] = useState<any[]>([]);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    if (serviceProvider) {
      loadVideos();
    }
  }, [serviceProvider]);

  const loadVideos = async () => {
    if (!serviceProvider) return;
    
    await loadDocuments(serviceProvider.id, { type: ['video'] });
    const videoDocuments = documents.filter(doc => doc.type === 'video');
    setVideos(videoDocuments);
  };

  const handleSearch = async () => {
    if (!searchTerm || !serviceProvider) return;
    
    const results = await searchDocuments(serviceProvider.id, searchTerm);
    const videoResults = results.filter(doc => doc.type === 'video');
    setVideos(videoResults);
  };

  return (
    <div className="px-4 sm:px-6 lg:px-8 py-8">
      <h2 className="text-xl font-semibold text-gray-900 mb-6">Video Library</h2>
      
      {/* Search Bar */}
      <div className="mb-6">
        <div className="flex space-x-2">
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search videos..."
            className="flex-1 px-3 py-2 border border-gray-300 rounded-md"
          />
          <button
            onClick={handleSearch}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
          >
            Search
          </button>
        </div>
      </div>

      {/* Video Grid */}
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {videos.map((video) => (
          <div key={video.id} className="bg-white rounded-lg shadow overflow-hidden">
            <div className="relative aspect-w-16 aspect-h-9 bg-gray-200">
              <div className="absolute inset-0 flex items-center justify-center">
                <PlayIcon className="h-16 w-16 text-gray-400" />
              </div>
            </div>
            <div className="p-4">
              <h3 className="font-medium text-gray-900">{video.title}</h3>
              {video.description && (
                <p className="mt-1 text-sm text-gray-500">{video.description}</p>
              )}
              <div className="mt-3 flex items-center justify-between">
                <div className="flex flex-wrap gap-1">
                  {video.tags.map((tag: string) => (
                    <span key={tag} className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-gray-100 text-gray-800">
                      {tag}
                    </span>
                  ))}
                </div>
                <a
                  href={video.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 hover:text-blue-800"
                >
                  <DownloadIcon className="h-5 w-5" />
                </a>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

// src/components/knowledge/PartsInventory.tsx

import React, { useState, useEffect } from 'react';
import { Part } from '../../types';
import { paginatedQuery, createDocument, updateDocument } from '../../services/firebase/firestore';
import { formatCurrency } from '../../utils/formatters';
import { PlusIcon, MinusIcon } from '@heroicons/react/outline';

export const PartsInventory: React.FC = () => {
  const [parts, setParts] = useState<Part[]>([]);
  const [showAddForm, setShowAddForm] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(false);
  const [newPart, setNewPart] = useState<Partial<Part>>({
    partNumber: '',
    name: '',
    description: '',
    category: '',
    manufacturer: '',
    currentStock: 0,
    minStock: 0,
    maxStock: 0,
    unitCost: 0,
    sellingPrice: 0,
  });

  useEffect(() => {
    loadParts();
  }, []);

  const loadParts = async () => {
    setLoading(true);
    try {
      const { data } = await paginatedQuery<Part>(
        'parts',
        [],
        'name',
        100
      );
      setParts(data);
    } catch (error) {
      console.error('Error loading parts:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddPart = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await createDocument('parts', newPart);
      setShowAddForm(false);
      setNewPart({
        partNumber: '',
        name: '',
        description: '',
        category: '',
        manufacturer: '',
        currentStock: 0,
        minStock: 0,
        maxStock: 0,
        unitCost: 0,
        sellingPrice: 0,
      });
      loadParts();
    } catch (error) {
      console.error('Error adding part:', error);
    }
  };

  const updateStock = async (partId: string, change: number) => {
    const part = parts.find(p => p.id === partId);
    if (!part) return;
    
    const newStock = Math.max(0, part.currentStock + change);
    await updateDocument('parts', partId, { currentStock: newStock });
    loadParts();
  };

  const filteredParts = parts.filter(part => 
    part.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    part.partNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
    part.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="px-4 sm:px-6 lg:px-8 py-8">
      <div className="sm:flex sm:items-center">
        <div className="sm:flex-auto">
          <h1 className="text-2xl font-semibold text-gray-900">Parts Inventory</h1>
          <p className="mt-2 text-sm text-gray-700">
            Manage your parts inventory and stock levels.
          </p>
        </div>
        <div className="mt-4 sm:mt-0 sm:ml-16 sm:flex-none">
          <button
            onClick={() => setShowAddForm(!showAddForm)}
            className="inline-flex items-center justify-center rounded-md border border-transparent bg-blue-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-blue-700"
          >
            <PlusIcon className="-ml-1 mr-2 h-5 w-5" />
            Add Part
          </button>
        </div>
      </div>

      {/* Search */}
      <div className="mt-6">
        <input
          type="text"
          placeholder="Search parts..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
        />
      </div>

      {/* Add Part Form */}
      {showAddForm && (
        <form onSubmit={handleAddPart} className="mt-6 bg-gray-50 p-4 rounded-lg">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
              <label className="block text-sm font-medium text-gray-700">Part Number</label>
              <input
                type="text"
                value={newPart.partNumber}
                onChange={(e) => setNewPart({ ...newPart, partNumber: e.target.value })}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Name</label>
              <input
                type="text"
                value={newPart.name}
                onChange={(e) => setNewPart({ ...newPart, name: e.target.value })}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Category</label>
              <input
                type="text"
                value={newPart.category}
                onChange={(e) => setNewPart({ ...newPart, category: e.target.value })}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Manufacturer</label>
              <input
                type="text"
                value={newPart.manufacturer}
                onChange={(e) => setNewPart({ ...newPart, manufacturer: e.target.value })}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Unit Cost</label>
              <input
                type="number"
                step="0.01"
                value={newPart.unitCost}
                onChange={(e) => setNewPart({ ...newPart, unitCost: parseFloat(e.target.value) })}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Selling Price</label>
              <input
                type="number"
                step="0.01"
                value={newPart.sellingPrice}
                onChange={(e) => setNewPart({ ...newPart, sellingPrice: parseFloat(e.target.value) })}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Current Stock</label>
              <input
                type="number"
                value={newPart.currentStock}
                onChange={(e) => setNewPart({ ...newPart, currentStock: parseInt(e.target.value) })}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Min Stock</label>
              <input
                type="number"
                value={newPart.minStock}
                onChange={(e) => setNewPart({ ...newPart, minStock: parseInt(e.target.value) })}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                required
              />
            </div>
          </div>
          <div className="mt-4 flex gap-2">
            <button
              type="submit"
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
            >
              Add Part
            </button>
            <button
              type="button"
              onClick={() => setShowAddForm(false)}
              className="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
            >
              Cancel
            </button>
          </div>
        </form>
      )}

      {/* Parts Table */}
      <div className="mt-8 overflow-hidden shadow ring-1 ring-black ring-opacity-5 md:rounded-lg">
        <table className="min-w-full divide-y divide-gray-300">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Part
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Category
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Stock
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Cost
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Price
              </th>
              <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {filteredParts.map((part) => (
              <tr key={part.id}>
                <td className="px-6 py-4">
                  <div>
                    <div className="text-sm font-medium text-gray-900">
                      {part.name}
                    </div>
                    <div className="text-sm text-gray-500">
                      {part.partNumber}
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 text-sm text-gray-900">
                  {part.category}
                </td>
                <td className="px-6 py-4">
                  <div className="text-sm text-gray-900">
                    {part.currentStock}
                    {part.currentStock <= part.minStock && (
                      <span className="ml-2 text-xs text-red-600">Low</span>
                    )}
                  </div>
                  <div className="text-xs text-gray-500">
                    Min: {part.minStock} / Max: {part.maxStock}
                  </div>
                </td>
                <td className="px-6 py-4 text-sm text-gray-900">
                  {formatCurrency(part.unitCost)}
                </td>
                <td className="px-6 py-4 text-sm text-gray-900">
                  {formatCurrency(part.sellingPrice)}
                </td>
                <td className="px-6 py-4 text-center">
                  <div className="flex items-center justify-center space-x-2">
                    <button
                      onClick={() => updateStock(part.id, -1)}
                      className="inline-flex items-center p-1 border border-transparent rounded-full text-white bg-red-600 hover:bg-red-700"
                    >
                      <MinusIcon className="h-4 w-4" />
                    </button>
                    <span className="text-sm text-gray-900">{part.currentStock}</span>
                    <button
                      onClick={() => updateStock(part.id, 1)}
                      className="inline-flex items-center p-1 border border-transparent rounded-full text-white bg-green-600 hover:bg-green-700"
                    >
                      <PlusIcon className="h-4 w-4" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

// src/components/dashboard/NotificationCenter.tsx

import React from 'react';
import { useNotifications } from '../../hooks/useNotifications';
import { formatRelativeTime } from '../../utils/helpers';
import { XIcon, CheckIcon } from '@heroicons/react/outline';

export const NotificationCenter: React.FC<{ isOpen: boolean; onClose: () => void }> = ({ isOpen, onClose }) => {
  const { notifications, markAsRead, markAllAsRead, removeNotification } = useNotifications();

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      <div className="absolute inset-0 bg-black bg-opacity-50" onClick={onClose} />
      
      <div className="absolute right-0 top-0 h-full w-96 bg-white shadow-xl">
        <div className="flex items-center justify-between p-4 border-b">
          <h2 className="text-lg font-medium text-gray-900">Notifications</h2>
          <div className="flex items-center space-x-2">
            <button
              onClick={markAllAsRead}
              className="text-sm text-blue-600 hover:text-blue-800"
            >
              Mark all as read
            </button>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-500"
            >
              <XIcon className="h-5 w-5" />
            </button>
          </div>
        </div>
        
        <div className="overflow-y-auto h-full pb-20">
          {notifications.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-500">No notifications</p>
            </div>
          ) : (
            <div className="divide-y divide-gray-200">
              {notifications.map((notification) => (
                <div
                  key={notification.id}
                  className={`p-4 hover:bg-gray-50 ${
                    !notification.read ? 'bg-blue-50' : ''
                  }`}
                >
                  <div className="flex justify-between">
                    <div className="flex-1">
                      <h4 className="text-sm font-medium text-gray-900">
                        {notification.title}
                      </h4>
                      <p className="text-sm text-gray-500 mt-1">
                        {notification.message}
                      </p>
                      <p className="text-xs text-gray-400 mt-2">
                        {formatRelativeTime(notification.timestamp)}
                      </p>
                    </div>
                    <div className="ml-4 flex-shrink-0 flex">
                      {!notification.read && (
                        <button
                          onClick={() => markAsRead(notification.id)}
                          className="text-blue-600 hover:text-blue-800"
                        >
                          <CheckIcon className="h-4 w-4" />
                        </button>
                      )}
                      <button
                        onClick={() => removeNotification(notification.id)}
                        className="ml-2 text-gray-400 hover:text-gray-500"
                      >
                        <XIcon className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                  {notification.action && (
                    <button
                      onClick={notification.action.handler}
                      className="mt-3 text-sm text-blue-600 hover:text-blue-800"
                    >
                      {notification.action.label}
                    </button>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

// src/components/shared/SearchBar.tsx

import React, { useState } from 'react';
import { SearchIcon } from '@heroicons/react/outline';
import { debounce } from '../../utils/helpers';

interface SearchBarProps {
  onSearch: (query: string) => void;
  placeholder?: string;
  className?: string;
}

export const SearchBar: React.FC<SearchBarProps> = ({ 
  onSearch, 
  placeholder = "Search...", 
  className = "" 
}) => {
  const [query, setQuery] = useState('');
  
  const debouncedSearch = debounce(onSearch, 300);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setQuery(value);
    debouncedSearch(value);
  };

  return (
    <div className={`relative ${className}`}>
      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
        <SearchIcon className="h-5 w-5 text-gray-400" />
      </div>
      <input
        type="text"
        value={query}
        onChange={handleChange}
        className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
        placeholder={placeholder}
      />
    </div>
  );
};