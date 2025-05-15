// src/components/requests/RequestDetail.tsx

import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useRequests } from '../../hooks/useRequests';
import { ServiceRequest, RequestStatus } from '../../types';
import { formatDate, formatCurrency } from '../../utils/helpers';
import { LoadingSpinner } from '../shared/LoadingSpinner';
import { 
  CalendarIcon, 
  ClockIcon, 
  UserIcon, 
  CurrencyDollarIcon,
  PaperClipIcon,
  ChatIcon
} from '@heroicons/react/outline';
import { REQUEST_STATUSES } from '../../utils/constants';

export const RequestDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { selectedRequest, setSelectedRequest, updateRequestStatus, isLoading, error } = useRequests();
  const [updating, setUpdating] = useState(false);

  useEffect(() => {
    if (id && !selectedRequest) {
      // Load request from database if not already selected
      // This would be implemented with the actual API call
    }
  }, [id]);

  const handleStatusChange = async (newStatus: RequestStatus) => {
    if (!selectedRequest) return;
    
    setUpdating(true);
    const success = await updateRequestStatus(selectedRequest.id, newStatus);
    if (success) {
      // Update local state
      setSelectedRequest({ ...selectedRequest, status: newStatus });
    }
    setUpdating(false);
  };

  if (isLoading) return <LoadingSpinner />;
  if (error) return <div className="text-red-600">Error: {error}</div>;
  if (!selectedRequest) return <div>Request not found</div>;

  return (
    <div className="px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-2xl font-semibold text-gray-900">{selectedRequest.title}</h1>
        <p className="mt-2 text-sm text-gray-600">
          Request ID: {selectedRequest.id}
        </p>
      </div>

      <div className="bg-white shadow overflow-hidden sm:rounded-lg">
        <div className="px-4 py-5 sm:px-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg leading-6 font-medium text-gray-900">
                Request Details
              </h3>
              <p className="mt-1 max-w-2xl text-sm text-gray-500">
                Service request information and status
              </p>
            </div>
            <div className="flex items-center space-x-3">
              <span className={`inline-flex items-center px-3 py-0.5 rounded-full text-sm font-medium bg-${
                REQUEST_STATUSES.find(s => s.value === selectedRequest.status)?.color || 'gray'
              }-100 text-${
                REQUEST_STATUSES.find(s => s.value === selectedRequest.status)?.color || 'gray'
              }-800`}>
                {selectedRequest.status}
              </span>
              <select
                value={selectedRequest.status}
                onChange={(e) => handleStatusChange(e.target.value as RequestStatus)}
                disabled={updating}
                className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
              >
                {REQUEST_STATUSES.map((status) => (
                  <option key={status.value} value={status.value}>
                    {status.label}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>
        
        <div className="border-t border-gray-200">
          <dl>
            <div className="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
              <dt className="text-sm font-medium text-gray-500">Boat</dt>
              <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                {selectedRequest.boatName}
              </dd>
            </div>
            <div className="bg-white px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
              <dt className="text-sm font-medium text-gray-500">Owner</dt>
              <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                {selectedRequest.ownerName}
              </dd>
            </div>
            <div className="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
              <dt className="text-sm font-medium text-gray-500">Type</dt>
              <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                {selectedRequest.type}
              </dd>
            </div>
            <div className="bg-white px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
              <dt className="text-sm font-medium text-gray-500">Priority</dt>
              <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                  selectedRequest.priority === 'emergency' ? 'bg-red-100 text-red-800' :
                  selectedRequest.priority === 'urgent' ? 'bg-yellow-100 text-yellow-800' :
                  'bg-blue-100 text-blue-800'
                }`}>
                  {selectedRequest.priority}
                </span>
              </dd>
            </div>
            <div className="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
              <dt className="text-sm font-medium text-gray-500">Description</dt>
              <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                {selectedRequest.description}
              </dd>
            </div>
            {selectedRequest.scheduledDate && (
              <div className="bg-white px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                <dt className="text-sm font-medium text-gray-500">Scheduled Date</dt>
                <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                  {formatDate(selectedRequest.scheduledDate)}
                </dd>
              </div>
            )}
            {selectedRequest.estimatedCost && (
              <div className="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                <dt className="text-sm font-medium text-gray-500">Estimated Cost</dt>
                <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                  {formatCurrency(selectedRequest.estimatedCost)}
                </dd>
              </div>
            )}
          </dl>
        </div>
      </div>

      <div className="mt-6 flex items-center justify-between">
        <button
          onClick={() => navigate('/requests')}
          className="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
        >
          Back to Requests
        </button>
        <div className="space-x-3">
          <button
            onClick={() => navigate(`/chat?boatId=${selectedRequest.boatId}`)}
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
          >
            <ChatIcon className="-ml-1 mr-2 h-5 w-5" />
            Start Chat
          </button>
          <button
            onClick={() => navigate(`/requests/${selectedRequest.id}/edit`)}
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-green-600 hover:bg-green-700"
          >
            Edit Request
          </button>
        </div>
      </div>
    </div>
  );
};