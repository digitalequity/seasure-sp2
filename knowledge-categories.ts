// src/components/knowledge/KnowledgeCategories.tsx

import React, { useState } from 'react';
import { PlusIcon, FolderIcon, DocumentIcon } from '@heroicons/react/outline';
import { useKnowledge } from '../../hooks/useKnowledge';
import { useAuth } from '../../hooks/useAuth';
import { Link } from 'react-router-dom';

interface Category {
  id: string;
  name: string;
  description?: string;
  documentCount: number;
  icon: any;
  color: string;
}

export const KnowledgeCategories: React.FC = () => {
  const { documents } = useKnowledge();
  const { serviceProvider } = useAuth();
  const [showAddForm, setShowAddForm] = useState(false);
  const [newCategory, setNewCategory] = useState({ name: '', description: '' });

  const categories: Category[] = [
    {
      id: 'engine',
      name: 'Engine Manuals',
      description: 'Technical manuals and guides for various engine types',
      documentCount: documents.filter(d => d.category === 'engine').length,
      icon: DocumentIcon,
      color: 'bg-blue-500'
    },
    {
      id: 'maintenance',
      name: 'Maintenance Guides',
      description: 'Routine maintenance procedures and schedules',
      documentCount: documents.filter(d => d.category === 'maintenance').length,
      icon: FolderIcon,
      color: 'bg-green-500'
    },
    {
      id: 'safety',
      name: 'Safety Protocols',
      description: 'Safety procedures and emergency protocols',
      documentCount: documents.filter(d => d.category === 'safety').length,
      icon: DocumentIcon,
      color: 'bg-red-500'
    },
    {
      id: 'electrical',
      name: 'Electrical Systems',
      description: 'Wiring diagrams and electrical troubleshooting',
      documentCount: documents.filter(d => d.category === 'electrical').length,
      icon: FolderIcon,
      color: 'bg-yellow-500'
    },
    {
      id: 'hull',
      name: 'Hull & Structure',
      description: 'Hull maintenance and structural repairs',
      documentCount: documents.filter(d => d.category === 'hull').length,
      icon: DocumentIcon,
      color: 'bg-purple-500'
    },
    {
      id: 'navigation',
      name: 'Navigation Systems',
      description: 'GPS, radar, and other navigation equipment',
      documentCount: documents.filter(d => d.category === 'navigation').length,
      icon: FolderIcon,
      color: 'bg-indigo-500'
    }
  ];

  const handleAddCategory = async (e: React.FormEvent) => {
    e.preventDefault();
    // In a real app, this would add to the database
    console.log('Adding category:', newCategory);
    setShowAddForm(false);
    setNewCategory({ name: '', description: '' });
  };

  return (
    <div className="px-4 sm:px-6 lg:px-8 py-8">
      <div className="sm:flex sm:items-center">
        <div className="sm:flex-auto">
          <h1 className="text-2xl font-semibold text-gray-900">Knowledge Categories</h1>
          <p className="mt-2 text-sm text-gray-700">
            Organize and browse technical documentation by category
          </p>
        </div>
        <div className="mt-4 sm:mt-0 sm:ml-16 sm:flex-none">
          <button
            onClick={() => setShowAddForm(!showAddForm)}
            className="inline-flex items-center justify-center rounded-md border border-transparent bg-blue-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-blue-700"
          >
            <PlusIcon className="-ml-1 mr-2 h-5 w-5" />
            Add Category
          </button>
        </div>
      </div>

      {showAddForm && (
        <form onSubmit={handleAddCategory} className="mt-6 bg-gray-50 p-4 rounded-lg">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
              <label className="block text-sm font-medium text-gray-700">Category Name</label>
              <input
                type="text"
                value={newCategory.name}
                onChange={(e) => setNewCategory({ ...newCategory, name: e.target.value })}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Description</label>
              <input
                type="text"
                value={newCategory.description}
                onChange={(e) => setNewCategory({ ...newCategory, description: e.target.value })}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
              />
            </div>
          </div>
          <div className="mt-4 flex justify-end space-x-3">
            <button
              type="button"
              onClick={() => setShowAddForm(false)}
              className="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
            >
              Add Category
            </button>
          </div>
        </form>
      )}

      <div className="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {categories.map((category) => (
          <Link
            key={category.id}
            to={`/knowledge/category/${category.id}`}
            className="relative rounded-lg border border-gray-300 bg-white px-6 py-5 shadow-sm flex items-center space-x-3 hover:border-gray-400 focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-blue-500"
          >
            <div className={`flex-shrink-0 rounded-lg ${category.color} p-3`}>
              <category.icon className="h-6 w-6 text-white" aria-hidden="true" />
            </div>
            <div className="flex-1 min-w-0">
              <span className="absolute inset-0" aria-hidden="true" />
              <p className="text-sm font-medium text-gray-900">{category.name}</p>
              <p className="text-sm text-gray-500 truncate">{category.description}</p>
              <p className="text-xs text-gray-400 mt-1">
                {category.documentCount} documents
              </p>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
};