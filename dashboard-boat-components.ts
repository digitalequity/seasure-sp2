// src/components/dashboard/Dashboard.tsx

import React from 'react';
import { useAppContext } from '../../contexts/AppContext';
import { useRequests } from '../../hooks/useRequests';
import { MetricsWidget } from './MetricsWidget';
import { QuickActions } from './QuickActions';
import { Link } from 'react-router-dom';
import { CalendarIcon, ClockIcon, ExclamationIcon } from '@heroicons/react/outline';

export const Dashboard: React.FC = () => {
  const { boats, requests } = useAppContext();
  const { getRequestsByStatus, getUpcomingRequests } = useRequests();

  const metrics = [
    {
      name: 'Total Boats',
      value: boats.length,
      change: '+4.75%',
      changeType: 'positive' as const,
    },
    {
      name: 'Active Requests',
      value: getRequestsByStatus('in_progress').length,
      change: '+54.02%',
      changeType: 'positive' as const,
    },
    {
      name: 'Pending Requests',
      value: getRequestsByStatus('new').length,
      change: '-1.39%',
      changeType: 'negative' as const,
    },
    {
      name: 'Completed This Month',
      value: getRequestsByStatus('completed').length,
      change: '+10.18%',
      changeType: 'positive' as const,
    },
  ];

  const upcomingRequests = getUpcomingRequests().slice(0, 5);
  const urgentRequests = requests
    .filter(r => r.priority === 'emergency' || r.priority === 'urgent')
    .filter(r => r.status !== 'completed')
    .slice(0, 5);

  return (
    <div className="px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-2xl font-semibold text-gray-900">Dashboard</h1>
      
      {/* Metrics */}
      <div className="mt-8 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {metrics.map((metric) => (
          <MetricsWidget key={metric.name} {...metric} />
        ))}
      </div>

      {/* Quick Actions */}
      <div className="mt-8">
        <QuickActions />
      </div>

      {/* Recent Activity */}
      <div className="mt-8 grid grid-cols-1 gap-5 lg:grid-cols-2">
        {/* Upcoming Requests */}
        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="px-4 py-5 sm:p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg leading-6 font-medium text-gray-900">
                Upcoming Requests
              </h3>
              <CalendarIcon className="h-6 w-6 text-gray-400" />
            </div>
            <div className="flow-root">
              <ul className="-mb-8">
                {upcomingRequests.map((request, idx) => (
                  <li key={request.id}>
                    <div className="relative pb-8">
                      {idx !== upcomingRequests.length - 1 ? (
                        <span
                          className="absolute top-4 left-4 -ml-px h-full w-0.5 bg-gray-200"
                          aria-hidden="true"
                        />
                      ) : null}
                      <div className="relative flex space-x-3">
                        <div>
                          <span className="h-8 w-8 rounded-full bg-blue-500 flex items-center justify-center ring-8 ring-white">
                            <ClockIcon className="h-5 w-5 text-white" />
                          </span>
                        </div>
                        <div className="min-w-0 flex-1 pt-1.5 flex justify-between space-x-4">
                          <div>
                            <p className="text-sm text-gray-500">
                              {request.type} for{' '}
                              <Link
                                to={`/boats/${request.boatId}`}
                                className="font-medium text-gray-900 hover:text-blue-600"
                              >
                                {request.boatName}
                              </Link>
                            </p>
                          </div>
                          <div className="text-right text-sm whitespace-nowrap text-gray-500">
                            <time dateTime={request.scheduledDate?.toString()}>
                              {new Date(request.scheduledDate!).toLocaleDateString()}
                            </time>
                          </div>
                        </div>
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
            {upcomingRequests.length === 0 && (
              <p className="text-sm text-gray-500">No upcoming requests</p>
            )}
          </div>
        </div>

        {/* Urgent Requests */}
        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="px-4 py-5 sm:p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg leading-6 font-medium text-gray-900">
                Urgent Requests
              </h3>
              <ExclamationIcon className="h-6 w-6 text-red-400" />
            </div>
            <div className="flow-root">
              <ul className="-mb-8">
                {urgentRequests.map((request, idx) => (
                  <li key={request.id}>
                    <div className="relative pb-8">
                      {idx !== urgentRequests.length - 1 ? (
                        <span
                          className="absolute top-4 left-4 -ml-px h-full w-0.5 bg-gray-200"
                          aria-hidden="true"
                        />
                      ) : null}
                      <div className="relative flex space-x-3">
                        <div>
                          <span
                            className={`h-8 w-8 rounded-full flex items-center justify-center ring-8 ring-white ${
                              request.priority === 'emergency'
                                ? 'bg-red-500'
                                : 'bg-yellow-500'
                            }`}
                          >
                            <ExclamationIcon className="h-5 w-5 text-white" />
                          </span>
                        </div>
                        <div className="min-w-0 flex-1 pt-1.5 flex justify-between space-x-4">
                          <div>
                            <p className="text-sm text-gray-500">
                              {request.priority} - {request.type}
                            </p>
                            <p className="text-sm font-medium text-gray-900">
                              <Link
                                to={`/requests/${request.id}`}
                                className="hover:text-blue-600"
                              >
                                {request.title}
                              </Link>
                            </p>
                          </div>
                          <div className="text-right text-sm whitespace-nowrap text-gray-500">
                            {request.boatName}
                          </div>
                        </div>
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
            {urgentRequests.length === 0 && (
              <p className="text-sm text-gray-500">No urgent requests</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

// src/components/dashboard/MetricsWidget.tsx

import React from 'react';
import { ArrowSmDownIcon, ArrowSmUpIcon } from '@heroicons/react/solid';

interface MetricsWidgetProps {
  name: string;
  value: number;
  change: string;
  changeType: 'positive' | 'negative';
}

export const MetricsWidget: React.FC<MetricsWidgetProps> = ({
  name,
  value,
  change,
  changeType,
}) => {
  return (
    <div className="bg-white overflow-hidden shadow rounded-lg">
      <div className="px-4 py-5 sm:p-6">
        <dt className="text-sm font-medium text-gray-500 truncate">{name}</dt>
        <dd className="mt-1 flex justify-between items-baseline">
          <div className="flex items-baseline text-2xl font-semibold text-gray-900">
            {value}
          </div>
          <div
            className={`ml-2 flex items-baseline text-sm font-semibold ${
              changeType === 'positive' ? 'text-green-600' : 'text-red-600'
            }`}
          >
            {changeType === 'positive' ? (
              <ArrowSmUpIcon className="h-5 w-5 flex-shrink-0 self-center text-green-500" />
            ) : (
              <ArrowSmDownIcon className="h-5 w-5 flex-shrink-0 self-center text-red-500" />
            )}
            <span className="sr-only">
              {changeType === 'positive' ? 'Increased' : 'Decreased'} by
            </span>
            {change}
          </div>
        </dd>
      </div>
    </div>
  );
};

// src/components/dashboard/QuickActions.tsx

import React from 'react';
import { Link } from 'react-router-dom';
import {
  PlusIcon,
  ClipboardListIcon,
  ChatIcon,
  DocumentAddIcon
} from '@heroicons/react/outline';

export const QuickActions: React.FC = () => {
  const actions = [
    {
      name: 'Add New Boat',
      href: '/boats/new',
      icon: PlusIcon,
      bgColor: 'bg-blue-500',
    },
    {
      name: 'Create Request',
      href: '/requests/new',
      icon: ClipboardListIcon,
      bgColor: 'bg-green-500',
    },
    {
      name: 'Start Chat',
      href: '/chat',
      icon: ChatIcon,
      bgColor: 'bg-purple-500',
    },
    {
      name: 'Upload Document',
      href: '/knowledge/upload',
      icon: DocumentAddIcon,
      bgColor: 'bg-yellow-500',
    },
  ];

  return (
    <div>
      <h2 className="text-lg font-medium text-gray-900">Quick Actions</h2>
      <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {actions.map((action) => (
          <Link
            key={action.name}
            to={action.href}
            className="relative rounded-lg border border-gray-300 bg-white px-6 py-5 shadow-sm flex items-center space-x-3 hover:border-gray-400 focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-blue-500"
          >
            <div
              className={`flex-shrink-0 rounded-lg ${action.bgColor} p-3 text-white`}
            >
              <action.icon className="h-6 w-6" />
            </div>
            <div className="flex-1 min-w-0">
              <span className="absolute inset-0" aria-hidden="true" />
              <p className="text-sm font-medium text-gray-900">{action.name}</p>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
};

// src/components/boats/BoatList.tsx

import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useBoats } from '../../hooks/useBoats';
import { BoatCard } from './BoatCard';
import { PlusIcon, SearchIcon } from '@heroicons/react/outline';

export const BoatList: React.FC = () => {
  const { boats, searchBoats, isLoading } = useBoats();
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredBoats, setFilteredBoats] = useState(boats);

  useEffect(() => {
    if (searchTerm) {
      searchBoats(searchTerm).then(setFilteredBoats);
    } else {
      setFilteredBoats(boats);
    }
  }, [searchTerm, boats]);

  return (
    <div className="px-4 sm:px-6 lg:px-8 py-8">
      <div className="sm:flex sm:items-center">
        <div className="sm:flex-auto">
          <h1 className="text-2xl font-semibold text-gray-900">Boats</h1>
          <p className="mt-2 text-sm text-gray-700">
            A list of all boats you manage including their owners and current status.
          </p>
        </div>
        <div className="mt-4 sm:mt-0 sm:ml-16 sm:flex-none">
          <Link
            to="/boats/new"
            className="inline-flex items-center justify-center rounded-md border border-transparent bg-blue-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 sm:w-auto"
          >
            <PlusIcon className="-ml-1 mr-2 h-5 w-5" />
            Add Boat
          </Link>
        </div>
      </div>

      {/* Search Bar */}
      <div className="mt-6">
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <SearchIcon className="h-5 w-5 text-gray-400" />
          </div>
          <input
            type="text"
            className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
            placeholder="Search boats..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      {/* Boat Grid */}
      <div className="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {isLoading ? (
          <div className="col-span-full text-center py-12">
            <div className="inline-flex items-center px-4 py-2 font-semibold leading-6 text-sm shadow rounded-md text-white bg-blue-500 hover:bg-blue-400 transition ease-in-out duration-150">
              <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Loading boats...
            </div>
          </div>
        ) : filteredBoats.length === 0 ? (
          <div className="col-span-full text-center py-12">
            <p className="text-gray-500">
              {searchTerm
                ? 'No boats found matching your search.'
                : 'No boats yet. Add your first boat to get started!'}
            </p>
          </div>
        ) : (
          filteredBoats.map((boat) => (
            <BoatCard key={boat.id} boat={boat} />
          ))
        )}
      </div>
    </div>
  );
};

// src/components/boats/BoatCard.tsx

import React from 'react';
import { Link } from 'react-router-dom';
import { Boat } from '../../types';
import { LocationMarkerIcon, UserIcon } from '@heroicons/react/outline';

interface BoatCardProps {
  boat: Boat;
}

export const BoatCard: React.FC<BoatCardProps> = ({ boat }) => {
  const imageUrl = boat.images?.[0] || '/api/placeholder/400/300';
  
  return (
    <Link
      to={`/boats/${boat.id}`}
      className="group relative bg-white rounded-lg shadow-sm overflow-hidden hover:shadow-md transition-shadow duration-200"
    >
      <div className="aspect-w-16 aspect-h-12">
        <img
          src={imageUrl}
          alt={boat.name}
          className="w-full h-48 object-cover group-hover:opacity-90 transition-opacity duration-200"
        />
      </div>
      <div className="p-4">
        <h3 className="text-lg font-medium text-gray-900 group-hover:text-blue-600">
          {boat.name}
        </h3>
        <p className="mt-1 text-sm text-gray-500">
          {boat.year} {boat.make} {boat.model}
        </p>
        <div className="mt-3 flex items-center text-sm text-gray-500">
          <UserIcon className="flex-shrink-0 mr-1.5 h-4 w-4" />
          <p>{boat.ownerName}</p>
        </div>
        {boat.location?.marina && (
          <div className="mt-2 flex items-center text-sm text-gray-500">
            <LocationMarkerIcon className="flex-shrink-0 mr-1.5 h-4 w-4" />
            <p>{boat.location.marina}</p>
          </div>
        )}
        <div className="mt-3">
          <span
            className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
              boat.status === 'active'
                ? 'bg-green-100 text-green-800'
                : 'bg-gray-100 text-gray-800'
            }`}
          >
            {boat.status}
          </span>
        </div>
      </div>
    </Link>
  );
};