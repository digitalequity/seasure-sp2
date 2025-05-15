// src/components/knowledge/KnowledgeSearch.tsx

import React, { useState } from 'react';
import { SearchIcon, FilterIcon } from '@heroicons/react/outline';
import { useKnowledge } from '../../hooks/useKnowledge';
import { useAuth } from '../../hooks/useAuth';
import { Link } from 'react-router-dom';
import { formatDate, formatFileSize } from '../../utils/helpers';
import { LoadingSpinner } from '../shared/LoadingSpinner';

export const KnowledgeSearch: React.FC = () => {
  const { searchDocuments } = useKnowledge();
  const { serviceProvider } = useAuth();
  const [searchTerm, setSearchTerm] = useState('');
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [filters, setFilters] = useState({
    type: '',
    category: '',
    dateRange: ''
  });

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchTerm || !serviceProvider) return;

    setIsSearching(true);
    try {
      const results = await searchDocuments(serviceProvider.id, searchTerm);
      setSearchResults(results);
    } catch (error) {
      console.error('Search error:', error);
    } finally {
      setIsSearching(false);
    }
  };

  const filteredResults = searchResults.filter(result => {
    if (filters.type && result.type !== filters.type) return false;
    if (filters.category && result.category !== filters.category) return false;
    // Add date range filtering logic here if needed
    return true;
  });

  return (
    <div className="px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-2xl font-semibold text-gray-900">Search Knowledge Base</h1>
        <p className="mt-2 text-sm text-gray-700">
          Search through technical documents, manuals, and guides
        </p>
      </div>

      <form onSubmit={handleSearch} className="mb-8">
        <div className="max-w-3xl mx-auto">
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <SearchIcon className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="search"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              placeholder="Search for documents, guides, or videos..."
            />
            <button
              type="submit"
              disabled={isSearching}
              className="absolute inset-y-0 right-0 px-4 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-r-md disabled:opacity-50"
            >
              {isSearching ? <LoadingSpinner /> : 'Search'}
            </button>
          </div>
        </div>
      </form>

      {/* Filters */}
      <div className="mb-6">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-medium text-gray-900">Filters</h3>
          <button
            onClick={() => setFilters({ type: '', category: '', dateRange: '' })}
            className="text-sm text-blue-600 hover:text-blue-800"
          >
            Clear filters
          </button>
        </div>
        <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-3">
          <div>
            <label htmlFor="type" className="block text-sm font-medium text-gray-700">
              Document Type
            </label>
            <select
              id="type"
              value={filters.type}
              onChange={(e) => setFilters({ ...filters, type: e.target.value })}
              className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
            >
              <option value="">All Types</option>
              <option value="manual">Manual</option>
              <option value="video">Video</option>
              <option value="guide">Guide</option>
              <option value="other">Other</option>
            </select>
          </div>
          <div>
            <label htmlFor="category" className="block text-sm font-medium text-gray-700">
              Category
            </label>
            <select
              id="category"
              value={filters.category}
              onChange={(e) => setFilters({ ...filters, category: e.target.value })}
              className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
            >
              <option value="">All Categories</option>
              <option value="engine">Engine</option>
              <option value="maintenance">Maintenance</option>
              <option value="safety">Safety</option>
              <option value="electrical">Electrical</option>
            </select>
          </div>
          <div>
            <label htmlFor="dateRange" className="block text-sm font-medium text-gray-700">
              Date Range
            </label>
            <select
              id="dateRange"
              value={filters.dateRange}
              onChange={(e) => setFilters({ ...filters, dateRange: e.target.value })}
              className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
            >
              <option value="">All Time</option>
              <option value="week">Past Week</option>
              <option value="month">Past Month</option>
              <option value="year">Past Year</option>
            </select>
          </div>
        </div>
      </div>

      {/* Search Results */}
      <div>
        {searchResults.length > 0 && (
          <h3 className="text-lg font-medium text-gray-900 mb-4">
            Found {filteredResults.length} results
          </h3>
        )}
        
        <div className="space-y-4">
          {filteredResults.map((result) => (
            <Link
              key={result.id}
              to={`/knowledge/document/${result.id}`}
              className="block bg-white rounded-lg shadow hover:shadow-md transition-shadow"
            >
              <div className="p-6">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <h4 className="text-lg font-medium text-gray-900">
                      {result.title}
                    </h4>
                    <p className="mt-1 text-sm text-gray-500">
                      {result.description}
                    </p>
                    <div className="mt-2 flex items-center text-sm text-gray-500">
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                        {result.type}
                      </span>
                      <span className="mx-2">•</span>
                      <span>{result.category}</span>
                      <span className="mx-2">•</span>
                      <span>{formatDate(result.uploadedAt)}</span>
                      <span className="mx-2">•</span>
                      <span>{formatFileSize(result.size)}</span>
                    </div>
                    {result.tags && result.tags.length > 0 && (
                      <div className="mt-2 flex flex-wrap gap-2">
                        {result.tags.map((tag: string) => (
                          <span
                            key={tag}
                            className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-blue-100 text-blue-800"
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>

        {searchTerm && filteredResults.length === 0 && !isSearching && (
          <div className="text-center py-12">
            <p className="text-gray-500">No documents found matching your search.</p>
          </div>
        )}
      </div>
    </div>
  );
};