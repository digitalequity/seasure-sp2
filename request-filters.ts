// src/components/requests/RequestFilters.tsx

import React from 'react';
import { ServiceRequest, RequestStatus, Priority } from '../../types';
import { REQUEST_STATUSES, PRIORITY_LEVELS, SERVICE_TYPES } from '../../utils/constants';

interface RequestFiltersProps {
  requests: ServiceRequest[];
  onFilterChange: (filtered: ServiceRequest[]) => void;
}

export const RequestFilters: React.FC<RequestFiltersProps> = ({ requests, onFilterChange }) => {
  const [filters, setFilters] = React.useState({
    status: '',
    priority: '',
    type: '',
    search: ''
  });

  React.useEffect(() => {
    let filtered = [...requests];

    if (filters.status) {
      filtered = filtered.filter(r => r.status === filters.status);
    }
    if (filters.priority) {
      filtered = filtered.filter(r => r.priority === filters.priority);
    }
    if (filters.type) {
      filtered = filtered.filter(r => r.type === filters.type);
    }
    if (filters.search) {
      const searchLower = filters.search.toLowerCase();
      filtered = filtered.filter(r => 
        r.title.toLowerCase().includes(searchLower) ||
        r.boatName.toLowerCase().includes(searchLower) ||
        r.ownerName.toLowerCase().includes(searchLower)
      );
    }

    onFilterChange(filtered);
  }, [filters, requests, onFilterChange]);

  const handleReset = () => {
    setFilters({
      status: '',
      priority: '',
      type: '',
      search: ''
    });
  };

  return (
    <div className="bg-white p-4 rounded-lg shadow mb-6">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-5">
        <div>
          <label htmlFor="search" className="block text-sm font-medium text-gray-700">
            Search
          </label>
          <input
            type="text"
            id="search"
            value={filters.search}
            onChange={(e) => setFilters({ ...filters, search: e.target.value })}
            placeholder="Search requests..."
            className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
          />
        </div>

        <div>
          <label htmlFor="status" className="block text-sm font-medium text-gray-700">
            Status
          </label>
          <select
            id="status"
            value={filters.status}
            onChange={(e) => setFilters({ ...filters, status: e.target.value })}
            className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
          >
            <option value="">All Statuses</option>
            {REQUEST_STATUSES.map((status) => (
              <option key={status.value} value={status.value}>
                {status.label}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label htmlFor="priority" className="block text-sm font-medium text-gray-700">
            Priority
          </label>
          <select
            id="priority"
            value={filters.priority}
            onChange={(e) => setFilters({ ...filters, priority: e.target.value })}
            className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
          >
            <option value="">All Priorities</option>
            {PRIORITY_LEVELS.map((priority) => (
              <option key={priority.value} value={priority.value}>
                {priority.label}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label htmlFor="type" className="block text-sm font-medium text-gray-700">
            Type
          </label>
          <select
            id="type"
            value={filters.type}
            onChange={(e) => setFilters({ ...filters, type: e.target.value })}
            className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
          >
            <option value="">All Types</option>
            {SERVICE_TYPES.map((type) => (
              <option key={type.value} value={type.value}>
                {type.label}
              </option>
            ))}
          </select>
        </div>

        <div className="flex items-end">
          <button
            onClick={handleReset}
            className="w-full px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
          >
            Reset
          </button>
        </div>
      </div>
    </div>
  );
};