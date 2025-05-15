// src/components/requests/RequestForm.tsx

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useRequests } from '../../hooks/useRequests';
import { useBoats } from '../../hooks/useBoats';
import { ServiceRequest, Priority } from '../../types';
import { SERVICE_TYPES, PRIORITY_LEVELS } from '../../utils/constants';
import { LoadingSpinner } from '../shared/LoadingSpinner';

interface RequestFormProps {
  request?: ServiceRequest;
  mode: 'create' | 'edit';
}

export const RequestForm: React.FC<RequestFormProps> = ({ request, mode }) => {
  const navigate = useNavigate();
  const { createRequest, updateRequest } = useRequests();
  const { boats } = useBoats();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const [formData, setFormData] = useState({
    boatId: request?.boatId || '',
    type: request?.type || 'maintenance',
    priority: request?.priority || 'routine',
    title: request?.title || '',
    description: request?.description || '',
    scheduledDate: request?.scheduledDate || '',
    estimatedHours: request?.estimatedHours || '',
    estimatedCost: request?.estimatedCost || ''
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    const selectedBoat = boats.find(b => b.id === formData.boatId);
    if (!selectedBoat) {
      setError('Please select a boat');
      setIsLoading(false);
      return;
    }

    const requestData = {
      ...formData,
      boatName: selectedBoat.name,
      ownerId: selectedBoat.ownerId,
      ownerName: selectedBoat.ownerName,
      status: 'new' as const,
      source: 'external' as const,
      estimatedHours: formData.estimatedHours ? parseFloat(formData.estimatedHours) : undefined,
      estimatedCost: formData.estimatedCost ? parseFloat(formData.estimatedCost) : undefined,
      scheduledDate: formData.scheduledDate ? new Date(formData.scheduledDate) : undefined
    };

    try {
      if (mode === 'create') {
        const id = await createRequest(requestData);
        if (id) {
          navigate(`/requests/${id}`);
        }
      } else if (request) {
        const success = await updateRequest(request.id, requestData);
        if (success) {
          navigate(`/requests/${request.id}`);
        }
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to save request');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-2xl font-semibold text-gray-900">
          {mode === 'create' ? 'Create Service Request' : 'Edit Service Request'}
        </h1>
      </div>

      <form onSubmit={handleSubmit} className="max-w-3xl mx-auto">
        {error && (
          <div className="mb-4 rounded-md bg-red-50 p-4">
            <p className="text-sm text-red-800">{error}</p>
          </div>
        )}

        <div className="space-y-6">
          <div>
            <label htmlFor="boatId" className="block text-sm font-medium text-gray-700">
              Boat
            </label>
            <select
              id="boatId"
              value={formData.boatId}
              onChange={(e) => setFormData({ ...formData, boatId: e.target.value })}
              required
              className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
            >
              <option value="">Select a boat</option>
              {boats.map((boat) => (
                <option key={boat.id} value={boat.id}>
                  {boat.name} - {boat.ownerName}
                </option>
              ))}
            </select>
          </div>

          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
            <div>
              <label htmlFor="type" className="block text-sm font-medium text-gray-700">
                Type
              </label>
              <select
                id="type"
                value={formData.type}
                onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              >
                {SERVICE_TYPES.map((type) => (
                  <option key={type.value} value={type.value}>
                    {type.label}
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
                value={formData.priority}
                onChange={(e) => setFormData({ ...formData, priority: e.target.value as Priority })}
                className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              >
                {PRIORITY_LEVELS.map((priority) => (
                  <option key={priority.value} value={priority.value}>
                    {priority.label}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label htmlFor="title" className="block text-sm font-medium text-gray-700">
              Title
            </label>
            <input
              type="text"
              id="title"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              required
              className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
            />
          </div>

          <div>
            <label htmlFor="description" className="block text-sm font-medium text-gray-700">
              Description
            </label>
            <textarea
              id="description"
              rows={4}
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              required
              className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
            />
          </div>

          <div className="grid grid-cols-1 gap-6 sm:grid-cols-3">
            <div>
              <label htmlFor="scheduledDate" className="block text-sm font-medium text-gray-700">
                Scheduled Date
              </label>
              <input
                type="datetime-local"
                id="scheduledDate"
                value={formData.scheduledDate}
                onChange={(e) => setFormData({ ...formData, scheduledDate: e.target.value })}
                className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              />
            </div>

            <div>
              <label htmlFor="estimatedHours" className="block text-sm font-medium text-gray-700">
                Estimated Hours
              </label>
              <input
                type="number"
                id="estimatedHours"
                step="0.5"
                value={formData.estimatedHours}
                onChange={(e) => setFormData({ ...formData, estimatedHours: e.target.value })}
                className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              />
            </div>

            <div>
              <label htmlFor="estimatedCost" className="block text-sm font-medium text-gray-700">
                Estimated Cost
              </label>
              <input
                type="number"
                id="estimatedCost"
                step="0.01"
                value={formData.estimatedCost}
                onChange={(e) => setFormData({ ...formData, estimatedCost: e.target.value })}
                className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              />
            </div>
          </div>
        </div>

        <div className="mt-8 flex items-center justify-between">
          <button
            type="button"
            onClick={() => navigate('/requests')}
            className="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={isLoading}
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 disabled:opacity-50"
          >
            {isLoading ? <LoadingSpinner /> : mode === 'create' ? 'Create Request' : 'Update Request'}
          </button>
        </div>
      </form>
    </div>
  );
};