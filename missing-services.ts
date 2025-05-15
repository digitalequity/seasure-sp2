import { formatDate, formatDuration } from '../../utils/helpers';
import { 
  ClockIcon, 
  PlayIcon, 
  PauseIcon, 
  CheckIcon,
  CalendarIcon 
} from '@heroicons/react/outline';

export const TimeTracking: React.FC = () => {
  const { user, serviceProvider } = useAuth();
  const { boats } = useBoats();
  const { requests } = useRequests();
  
  const [timeEntries, setTimeEntries] = useState<TimeEntry[]>([]);
  const [activeTimer, setActiveTimer] = useState<Partial<TimeEntry> | null>(null);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadTimeEntries();
  }, [selectedDate, serviceProvider]);

  const loadTimeEntries = async () => {
    if (!serviceProvider) return;
    
    setLoading(true);
    try {
      const startOfDay = new Date(selectedDate);
      startOfDay.setHours(0, 0, 0, 0);
      
      const endOfDay = new Date(selectedDate);
      endOfDay.setHours(23, 59, 59, 999);
      
      const { data } = await paginatedQuery<TimeEntry>(
        'timeEntries',
        [
          { field: 'employeeId', operator: '==', value: user?.uid },
          { field: 'startTime', operator: '>=', value: startOfDay },
          { field: 'startTime', operator: '<=', value: endOfDay }
        ],
        'startTime',
        50
      );
      
      setTimeEntries(data);
    } catch (error) {
      console.error('Error loading time entries:', error);
    } finally {
      setLoading(false);
    }
  };

  const startTimer = (boatId: string, requestId?: string) => {
    const boat = boats.find(b => b.id === boatId);
    const request = requests.find(r => r.id === requestId);
    
    if (!boat || !user || !serviceProvider) return;
    
    const entry: Partial<TimeEntry> = {
      employeeId: user.uid,
      employeeName: user.displayName || 'Unknown',
      boatId,
      boatName: boat.name,
      requestId,
      startTime: new Date(),
      status: 'active',
      isBillable: true,
      hourlyRate: serviceProvider.settings?.defaultHourlyRate || 125,
      description: request ? `Working on: ${request.title}` : `General work on ${boat.name}`
    };
    
    setActiveTimer(entry);
  };

  const stopTimer = async () => {
    if (!activeTimer || !activeTimer.startTime) return;
    
    const endTime = new Date();
    const duration = Math.round((endTime.getTime() - activeTimer.startTime.getTime()) / 60000); // minutes
    const totalCost = ((duration / 60) * (activeTimer.hourlyRate || 0));
    
    const entry: Omit<TimeEntry, 'id' | 'createdAt' | 'updatedAt'> = {
      ...activeTimer as TimeEntry,
      endTime,
      duration,
      totalCost,
      status: 'completed'
    };
    
    try {
      await createDocument('timeEntries', entry);
      setActiveTimer(null);
      loadTimeEntries();
    } catch (error) {
      console.error('Error saving time entry:', error);
    }
  };

  const getTotalHours = () => {
    return timeEntries.reduce((total, entry) => total + (entry.duration || 0), 0) / 60;
  };

  const getTotalEarnings = () => {
    return timeEntries.reduce((total, entry) => total + (entry.totalCost || 0), 0);
  };

  return (
    <div className="px-4 sm:px-6 lg:px-8 py-8">
      <div className="sm:flex sm:items-center">
        <div className="sm:flex-auto">
          <h1 className="text-2xl font-semibold text-gray-900">Time Tracking</h1>
          <p className="mt-2 text-sm text-gray-700">
            Track your time spent on boats and service requests.
          </p>
        </div>
        <div className="mt-4 sm:mt-0 sm:ml-16 sm:flex-none">
          <input
            type="date"
            value={selectedDate.toISOString().split('T')[0]}
            onChange={(e) => setSelectedDate(new Date(e.target.value))}
            className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
          />
        </div>
      </div>

      {/* Active Timer */}
      {activeTimer && (
        <div className="mt-6 bg-blue-50 border border-blue-200 rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <ClockIcon className="h-6 w-6 text-blue-600 mr-3 animate-pulse" />
              <div>
                <p className="text-sm font-medium text-blue-900">Timer Running</p>
                <p className="text-sm text-blue-700">
                  {activeTimer.boatName} - {activeTimer.description}
                </p>
              </div>
            </div>
            <button
              onClick={stopTimer}
              className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
            >
              <PauseIcon className="h-4 w-4 mr-1" />
              Stop Timer
            </button>
          </div>
        </div>
      )}

      {/* Quick Start */}
      <div className="mt-6 bg-white shadow overflow-hidden sm:rounded-md">
        <div className="px-4 py-5 sm:p-6">
          <h3 className="text-lg leading-6 font-medium text-gray-900 mb-4">
            Quick Start Timer
          </h3>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {boats.map((boat) => (
              <div key={boat.id} className="relative rounded-lg border border-gray-300 bg-white px-6 py-5 shadow-sm flex items-center space-x-3 hover:border-gray-400">
                <div className="flex-1 min-w-0">
                  <button
                    onClick={() => startTimer(boat.id)}
                    className="focus:outline-none"
                    disabled={!!activeTimer}
                  >
                    <span className="absolute inset-0" aria-hidden="true" />
                    <p className="text-sm font-medium text-gray-900">
                      {boat.name}
                    </p>
                    <p className="text-sm text-gray-500">
                      {boat.make} {boat.model}
                    </p>
                  </button>
                </div>
                <PlayIcon className="h-5 w-5 text-gray-400" />
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Day Summary */}
      <div className="mt-6 bg-white shadow sm:rounded-lg">
        <div className="px-4 py-5 sm:p-6">
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-3">
            <div>
              <dt className="text-sm font-medium text-gray-500">Total Hours</dt>
              <dd className="mt-1 text-3xl font-semibold text-gray-900">
                {getTotalHours().toFixed(1)}
              </dd>
            </div>
            <div>
              <dt className="text-sm font-medium text-gray-500">Total Earnings</dt>
              <dd className="mt-1 text-3xl font-semibold text-gray-900">
                ${getTotalEarnings().toFixed(2)}
              </dd>
            </div>
            <div>
              <dt className="text-sm font-medium text-gray-500">Entries</dt>
              <dd className="mt-1 text-3xl font-semibold text-gray-900">
                {timeEntries.length}
              </dd>
            </div>
          </div>
        </div>
      </div>

      {/* Time Entries */}
      <div className="mt-6 shadow ring-1 ring-black ring-opacity-5 md:rounded-lg">
        <table className="min-w-full divide-y divide-gray-300">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Boat / Request
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Time
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Duration
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Description
              </th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                Amount
              </th>
              <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                Status
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {timeEntries.length === 0 ? (
              <tr>
                <td colSpan={6} className="px-6 py-4 text-center text-sm text-gray-500">
                  No time entries for this date.
                </td>
              </tr>
            ) : (
              timeEntries.map((entry) => (
                <tr key={entry.id}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {entry.boatName}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {format(entry.startTime, 'h:mm a')} - 
                    {entry.endTime ? format(entry.endTime, 'h:mm a') : 'Active'}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {entry.duration ? formatDuration(entry.duration) : '-'}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-500">
                    {entry.description}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 text-right">
                    {entry.totalCost ? `${entry.totalCost.toFixed(2)}` : '-'}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-center">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      entry.status === 'active'
                        ? 'bg-blue-100 text-blue-800'
                        : entry.status === 'completed'
                        ? 'bg-green-100 text-green-800'
                        : entry.status === 'invoiced'
                        ? 'bg-gray-100 text-gray-800'
                        : 'bg-yellow-100 text-yellow-800'
                    }`}>
                      {entry.status}
                    </span>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

// src/components/business/CustomerRelations.tsx

import React, { useState, useEffect } from 'react';
import { CustomerRelation } from '../../types';
import { useAuth } from '../../hooks/useAuth';
import { paginatedQuery } from '../../services/firebase/firestore';
import { formatCurrency, formatDate } from '../../utils/formatters';
import { 
  UserGroupIcon, 
  MailIcon, 
  PhoneIcon,
  ChartBarIcon 
} from '@heroicons/react/outline';

export const CustomerRelations: React.FC = () => {
  const { serviceProvider } = useAuth();
  const [customers, setCustomers] = useState<CustomerRelation[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedCustomer, setSelectedCustomer] = useState<CustomerRelation | null>(null);

  useEffect(() => {
    if (serviceProvider) {
      loadCustomers();
    }
  }, [serviceProvider]);

  const loadCustomers = async () => {
    if (!serviceProvider) return;
    
    setLoading(true);
    try {
      const { data } = await paginatedQuery<CustomerRelation>(
        'customers',
        [],
        'customerName',
        100
      );
      
      setCustomers(data);
    } catch (error) {
      console.error('Error loading customers:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="px-4 sm:px-6 lg:px-8 py-8">
      <div className="sm:flex sm:items-center">
        <div className="sm:flex-auto">
          <h1 className="text-2xl font-semibold text-gray-900">Customer Relations</h1>
          <p className="mt-2 text-sm text-gray-700">
            Manage your customer relationships and track spending.
          </p>
        </div>
      </div>

      <div className="mt-8 flex flex-col">
        <div className="-my-2 -mx-4 overflow-x-auto sm:-mx-6 lg:-mx-8">
          <div className="inline-block min-w-full py-2 align-middle md:px-6 lg:px-8">
            <div className="overflow-hidden shadow ring-1 ring-black ring-opacity-5 md:rounded-lg">
              <table className="min-w-full divide-y divide-gray-300">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Customer
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Type
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Boats
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Total Spent
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Last Service
                    </th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {customers.map((customer) => (
                    <tr key={customer.id}>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">
                          {customer.customerName}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          customer.customerType === 'seasure'
                            ? 'bg-blue-100 text-blue-800'
                            : 'bg-gray-100 text-gray-800'
                        }`}>
                          {customer.customerType}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {customer.boats.length}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {formatCurrency(customer.totalSpent)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {customer.lastServiceDate 
                          ? formatDate(customer.lastServiceDate)
                          : 'Never'
                        }
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <button
                          onClick={() => setSelectedCustomer(customer)}
                          className="text-blue-600 hover:text-blue-900"
                        >
                          View Details
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>

      {/* Customer Detail Modal */}
      {selectedCustomer && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="px-6 py-4 border-b">
              <h3 className="text-lg font-medium text-gray-900">
                {selectedCustomer.customerName}
              </h3>
            </div>
            <div className="px-6 py-4">
              <dl className="grid grid-cols-1 gap-x-4 gap-y-6 sm:grid-cols-2">
                <div>
                  <dt className="text-sm font-medium text-gray-500">Type</dt>
                  <dd className="mt-1 text-sm text-gray-900">
                    {selectedCustomer.customerType}
                  </dd>
                </div>
                <div>
                  <dt className="text-sm font-medium text-gray-500">Total Spent</dt>
                  <dd className="mt-1 text-sm text-gray-900">
                    {formatCurrency(selectedCustomer.totalSpent)}
                  </dd>
                </div>
                <div>
                  <dt className="text-sm font-medium text-gray-500">Boats</dt>
                  <dd className="mt-1 text-sm text-gray-900">
                    {selectedCustomer.boats.length} boats
                  </dd>
                </div>
                <div>
                  <dt className="text-sm font-medium text-gray-500">Last Service</dt>
                  <dd className="mt-1 text-sm text-gray-900">
                    {selectedCustomer.lastServiceDate 
                      ? formatDate(selectedCustomer.lastServiceDate)
                      : 'Never'
                    }
                  </dd>
                </div>
                {selectedCustomer.preferences && (
                  <>
                    <div className="sm:col-span-2">
                      <dt className="text-sm font-medium text-gray-500">Preferences</dt>
                      <dd className="mt-1 text-sm text-gray-900">
                        {selectedCustomer.preferences.preferredTechnician && 
                          <p>Preferred Technician: {selectedCustomer.preferences.preferredTechnician}</p>
                        }
                        {selectedCustomer.preferences.paymentTerms &&
                          <p>Payment Terms: {selectedCustomer.preferences.paymentTerms}</p>
                        }
                        {selectedCustomer.preferences.communicationPreference &&
                          <p>Communication: {selectedCustomer.preferences.communicationPreference}</p>
                        }
                      </dd>
                    </div>
                  </>
                )}
                {selectedCustomer.notes && (
                  <div className="sm:col-span-2">
                    <dt className="text-sm font-medium text-gray-500">Notes</dt>
                    <dd className="mt-1 text-sm text-gray-900">
                      {selectedCustomer.notes}
                    </dd>
                  </div>
                )}
              </dl>
              
              <div className="mt-6 flex justify-end">
                <button
                  onClick={() => setSelectedCustomer(null)}
                  className="bg-white py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

// src/components/business/PerformanceMetrics.tsx

import React, { useState, useEffect } from 'react';
import { useAuth } from '../../hooks/useAuth';
import { analyticsService } from '../../services/api/analytics';
import { formatCurrency } from '../../utils/formatters';
import {
  ChartBarIcon,
  TrendingUpIcon,
  CashIcon,
  ClockIcon,
  UserGroupIcon
} from '@heroicons/react/outline';

export const PerformanceMetrics: React.FC = () => {
  const { serviceProvider } = useAuth();
  const [metrics, setMetrics] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [dateRange, setDateRange] = useState({
    start: new Date(new Date().setMonth(new Date().getMonth() - 1)),
    end: new Date()
  });

  useEffect(() => {
    if (serviceProvider) {
      loadMetrics();
    }
  }, [serviceProvider, dateRange]);

  const loadMetrics = async () => {
    if (!serviceProvider) return;
    
    setLoading(true);
    try {
      const data = await analyticsService.getPerformanceMetrics(
        serviceProvider.id,
        dateRange.start,
        dateRange.end
      );
      setMetrics(data);
    } catch (error) {
      console.error('Error loading metrics:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading || !metrics) {
    return <div>Loading metrics...</div>;
  }

  return (
    <div className="px-4 sm:px-6 lg:px-8 py-8">
      <div className="sm:flex sm:items-center">
        <div className="sm:flex-auto">
          <h1 className="text-2xl font-semibold text-gray-900">Performance Metrics</h1>
          <p className="mt-2 text-sm text-gray-700">
            Track your business performance and insights.
          </p>
        </div>
        <div className="mt-4 sm:mt-0 sm:ml-16 sm:flex-none">
          <div className="flex space-x-4">
            <input
              type="date"
              value={dateRange.start.toISOString().split('T')[0]}
              onChange={(e) => setDateRange(prev => ({ 
                ...prev, 
                start: new Date(e.target.value) 
              }))}
              className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
            />
            <input
              type="date"
              value={dateRange.end.toISOString().split('T')[0]}
              onChange={(e) => setDateRange(prev => ({ 
                ...prev, 
                end: new Date(e.target.value) 
              }))}
              className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
            />
          </div>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="mt-8 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="px-4 py-5 sm:p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <CashIcon className="h-6 w-6 text-gray-400" />
              </div>
              <div className="ml-5 w-0 flex-1">
                <dt className="text-sm font-medium text-gray-500 truncate">
                  Total Revenue
                </dt>
                <dd className="flex items-baseline">
                  <div className="text-2xl font-semibold text-gray-900">
                    {formatCurrency(metrics.totalRevenue)}
                  </div>
                </dd>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="px-4 py-5 sm:p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <ChartBarIcon className="h-6 w-6 text-gray-400" />
              </div>
              <div className="ml-5 w-0 flex-1">
                <dt className="text-sm font-medium text-gray-500 truncate">
                  Completed Jobs
                </dt>
                <dd className="flex items-baseline">
                  <div className="text-2xl font-semibold text-gray-900">
                    {metrics.completedJobs}
                  </div>
                </dd>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="px-4 py-5 sm:p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <ClockIcon className="h-6 w-6 text-gray-400" />
              </div>
              <div className="ml-5 w-0 flex-1">
                <dt className="text-sm font-medium text-gray-500 truncate">
                  Avg Response Time
                </dt>
                <dd className="flex items-baseline">
                  <div className="text-2xl font-semibold text-gray-900">
                    {metrics.avgResponseTime.toFixed(1)}h
                  </div>
                </dd>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="px-4 py-5 sm:p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <UserGroupIcon className="h-6 w-6 text-gray-400" />
              </div>
              <div className="ml-5 w-0 flex-1">
                <dt className="text-sm font-medium text-gray-500 truncate">
                  Customer Satisfaction
                </dt>
                <dd className="flex items-baseline">
                  <div className="text-2xl font-semibold text-gray-900">
                    {metrics.customerSatisfaction.toFixed(1)}/5
                  </div>
                </dd>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Revenue Chart */}
      <div className="mt-8 bg-white shadow rounded-lg">
        <div className="px-4 py-5 sm:p-6">
          <h3 className="text-lg leading-6 font-medium text-gray-900 mb-4">
            Revenue by Month
          </h3>
          <div className="h-64">
            {/* Chart would go here - using react-chartjs-2 or similar */}
            <div className="flex items-center justify-center h-full bg-gray-50 rounded">
              <p className="text-gray-500">Chart visualization here</p>
            </div>
          </div>
        </div>
      </div>

      {/* Job Types */}
      <div className="mt-8 grid grid-cols-1 gap-6 lg:grid-cols-2">
        <div className="bg-white shadow rounded-lg">
          <div className="px-4 py-5 sm:p-6">
            <h3 className="text-lg leading-6 font-medium text-gray-900 mb-4">
              Jobs by Type
            </h3>
            <dl className="space-y-3">
              {Object.entries(metrics.jobsByType).map(([type, count]) => (
                <div key={type} className="flex justify-between">
                  <dt className="text-sm font-medium text-gray-500">
                    {type.charAt(0).toUpperCase() + type.slice(1)}
                  </dt>
                  <dd className="text-sm text-gray-900">{count as number}</dd>
                </div>
              ))}
            </dl>
          </div>
        </div>

        <div className="bg-white shadow rounded-lg">
          <div className="px-4 py-5 sm:p-6">
            <h3 className="text-lg leading-6 font-medium text-gray-900 mb-4">
              Top Customers
            </h3>
            <dl className="space-y-3">
              {metrics.topCustomers.map((customer: any) => (
                <div key={customer.customerId} className="flex justify-between">
                  <dt className="text-sm font-medium text-gray-500">
                    {customer.customerName}
                  </dt>
                  <dd className="text-sm text-gray-900">
                    {formatCurrency(customer.totalSpent)}
                  </dd>
                </div>
              ))}
            </dl>
          </div>
        </div>
      </div>
    </div>
  );
};// src/services/ai/diagnostic.ts

import { processAIRequest } from '../firebase/functions';

interface DiagnosticData {
  symptoms: string[];
  boatInfo: {
    make: string;
    model: string;
    year: number;
    engineType: string;
  };
  serviceHistory?: any[];
}

export const diagnosticService = {
  async analyzeProblem(data: DiagnosticData): Promise<string> {
    const response = await processAIRequest({
      type: 'diagnostic',
      context: data,
      prompt: `Analyze the following boat issues:
        Symptoms: ${data.symptoms.join(', ')}
        Boat: ${data.boatInfo.year} ${data.boatInfo.make} ${data.boatInfo.model}
        Engine: ${data.boatInfo.engineType}
        
        Provide potential causes and recommended solutions.`
    });
    
    return response.data.result;
  },

  async suggestMaintenance(boatData: any): Promise<string> {
    const response = await processAIRequest({
      type: 'maintenance',
      context: boatData,
      prompt: `Based on the boat specifications and service history, suggest a maintenance schedule.`
    });
    
    return response.data.result;
  },

  async generateReport(requestData: any): Promise<string> {
    const response = await processAIRequest({
      type: 'report',
      context: requestData,
      prompt: `Generate a detailed service report for the completed work.`
    });
    
    return response.data.result;
  }
};

// src/services/ai/maintenance.ts

import { MaintenanceItem, Boat, ServiceRecord } from '../../types';
import { processAIRequest } from '../firebase/functions';

export const maintenanceAI = {
  async predictMaintenanceNeeds(
    boat: Boat,
    serviceHistory: ServiceRecord[]
  ): Promise<MaintenanceItem[]> {
    const response = await processAIRequest({
      type: 'maintenance',
      context: {
        boat,
        serviceHistory,
        currentDate: new Date()
      },
      prompt: `Analyze the boat specifications and service history to predict upcoming maintenance needs.`
    });
    
    return JSON.parse(response.data.result);
  },

  async optimizeSchedule(
    maintenanceItems: MaintenanceItem[],
    constraints: any
  ): Promise<MaintenanceItem[]> {
    const response = await processAIRequest({
      type: 'maintenance',
      context: {
        items: maintenanceItems,
        constraints
      },
      prompt: `Optimize the maintenance schedule based on priorities and constraints.`
    });
    
    return JSON.parse(response.data.result);
  },

  async estimateCosts(
    maintenanceItems: MaintenanceItem[],
    historicalData: any
  ): Promise<Record<string, number>> {
    const response = await processAIRequest({
      type: 'maintenance',
      context: {
        items: maintenanceItems,
        historicalData
      },
      prompt: `Estimate costs for each maintenance item based on historical data.`
    });
    
    return JSON.parse(response.data.result);
  }
};

// src/services/ai/chatbot.ts

import { Message } from '../../types';
import { processAIRequest } from '../firebase/functions';

export const chatbotService = {
  async generateResponse(
    message: string,
    context: {
      chatHistory: Message[];
      boatInfo?: any;
      requestInfo?: any;
    }
  ): Promise<string> {
    const response = await processAIRequest({
      type: 'chat',
      context,
      prompt: message
    });
    
    return response.data.result;
  },

  async suggestQuickReplies(
    context: {
      currentMessage: string;
      chatHistory: Message[];
    }
  ): Promise<string[]> {
    const response = await processAIRequest({
      type: 'chat',
      context,
      prompt: `Suggest 3 relevant quick reply options based on the conversation context.`
    });
    
    return JSON.parse(response.data.result);
  },

  async summarizeConversation(messages: Message[]): Promise<string> {
    const response = await processAIRequest({
      type: 'chat',
      context: { messages },
      prompt: `Summarize this conversation highlighting key points and action items.`
    });
    
    return response.data.result;
  }
};

// src/utils/constants.ts

export const BOAT_MAKES = [
  'Yamaha',
  'Mercury',
  'Honda',
  'Suzuki',
  'Evinrude',
  'Johnson',
  'Tohatsu',
  'Volvo Penta',
  'MerCruiser',
  'Caterpillar'
];

export const ENGINE_TYPES = [
  'Outboard',
  'Inboard',
  'Sterndrive',
  'Jet Drive',
  'Pod Drive'
];

export const SERVICE_TYPES = [
  { value: 'maintenance', label: 'Routine Maintenance' },
  { value: 'repair', label: 'Repair' },
  { value: 'inspection', label: 'Inspection' },
  { value: 'emergency', label: 'Emergency' },
  { value: 'consultation', label: 'Consultation' }
];

export const PRIORITY_LEVELS = [
  { value: 'emergency', label: 'Emergency', color: 'red' },
  { value: 'urgent', label: 'Urgent', color: 'yellow' },
  { value: 'routine', label: 'Routine', color: 'blue' },
  { value: 'low', label: 'Low', color: 'gray' }
];

export const REQUEST_STATUSES = [
  { value: 'new', label: 'New', color: 'blue' },
  { value: 'accepted', label: 'Accepted', color: 'indigo' },
  { value: 'scheduled', label: 'Scheduled', color: 'purple' },
  { value: 'in_progress', label: 'In Progress', color: 'yellow' },
  { value: 'completed', label: 'Completed', color: 'green' },
  { value: 'invoiced', label: 'Invoiced', color: 'gray' },
  { value: 'cancelled', label: 'Cancelled', color: 'red' }
];

export const MAINTENANCE_CATEGORIES = [
  { value: 'engine', label: 'Engine' },
  { value: 'hull', label: 'Hull' },
  { value: 'electrical', label: 'Electrical' },
  { value: 'safety', label: 'Safety' },
  { value: 'other', label: 'Other' }
];

export const DOCUMENT_TYPES = [
  { value: 'manual', label: 'Manual' },
  { value: 'video', label: 'Video' },
  { value: 'guide', label: 'Guide' },
  { value: 'other', label: 'Other' }
];

export const NOTIFICATION_TYPES = {
  NEW_REQUEST: 'new_request',
  STATUS_UPDATE: 'status_update',
  MAINTENANCE_DUE: 'maintenance_due',
  CHAT_MESSAGE: 'chat_message',
  EMERGENCY: 'emergency'
};

export const DATE_FORMAT = 'MMM d, yyyy';
export const TIME_FORMAT = 'h:mm a';
export const DATETIME_FORMAT = 'MMM d, yyyy h:mm a';

// src/utils/helpers.ts

import { format, formatDistance, formatRelative } from 'date-fns';

export const formatDate = (date: Date | string | number): string => {
  if (typeof date === 'string' || typeof date === 'number') {
    date = new Date(date);
  }
  return format(date, 'MMM d, yyyy');
};

export const formatTime = (date: Date | string | number): string => {
  if (typeof date === 'string' || typeof date === 'number') {
    date = new Date(date);
  }
  return format(date, 'h:mm a');
};

export const formatDateTime = (date: Date | string | number): string => {
  if (typeof date === 'string' || typeof date === 'number') {
    date = new Date(date);
  }
  return format(date, 'MMM d, yyyy h:mm a');
};

export const formatRelativeTime = (date: Date | string | number): string => {
  if (typeof date === 'string' || typeof date === 'number') {
    date = new Date(date);
  }
  return formatDistance(date, new Date(), { addSuffix: true });
};

export const formatCurrency = (amount: number): string => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD'
  }).format(amount);
};

export const generateId = (): string => {
  return Date.now().toString(36) + Math.random().toString(36).substr(2);
};

export const debounce = <T extends (...args: any[]) => any>(
  func: T,
  wait: number
): ((...args: Parameters<T>) => void) => {
  let timeout: NodeJS.Timeout;
  
  return (...args: Parameters<T>) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), wait);
  };
};

export const throttle = <T extends (...args: any[]) => any>(
  func: T,
  wait: number
): ((...args: Parameters<T>) => void) => {
  let inThrottle: boolean;
  
  return (...args: Parameters<T>) => {
    if (!inThrottle) {
      func(...args);
      inThrottle = true;
      setTimeout(() => inThrottle = false, wait);
    }
  };
};

export const classNames = (...classes: (string | boolean | undefined)[]): string => {
  return classes.filter(Boolean).join(' ');
};

export const truncate = (text: string, maxLength: number): string => {
  if (text.length <= maxLength) return text;
  return text.substr(0, maxLength) + '...';
};

export const getInitials = (name: string): string => {
  const parts = name.split(' ');
  return parts
    .map(part => part.charAt(0).toUpperCase())
    .slice(0, 2)
    .join('');
};

// src/utils/validators.ts

export const validators = {
  email: (email: string): boolean => {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
  },

  phone: (phone: string): boolean => {
    const re = /^[\+]?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4,6}$/;
    return re.test(phone);
  },

  required: (value: any): boolean => {
    return value !== null && value !== undefined && value !== '';
  },

  minLength: (value: string, min: number): boolean => {
    return value.length >= min;
  },

  maxLength: (value: string, max: number): boolean => {
    return value.length <= max;
  },

  number: (value: any): boolean => {
    return !isNaN(value) && isFinite(value);
  },

  positiveNumber: (value: number): boolean => {
    return validators.number(value) && value > 0;
  },

  url: (url: string): boolean => {
    try {
      new URL(url);
      return true;
    } catch {
      return false;
    }
  },

  date: (date: any): boolean => {
    const parsed = new Date(date);
    return !isNaN(parsed.getTime());
  },

  futureDate: (date: any): boolean => {
    const parsed = new Date(date);
    return validators.date(date) && parsed > new Date();
  },

  password: (password: string): {
    valid: boolean;
    errors: string[];
  } => {
    const errors: string[] = [];
    
    if (password.length < 8) {
      errors.push('Password must be at least 8 characters long');
    }
    
    if (!/[A-Z]/.test(password)) {
      errors.push('Password must contain at least one uppercase letter');
    }
    
    if (!/[a-z]/.test(password)) {
      errors.push('Password must contain at least one lowercase letter');
    }
    
    if (!/[0-9]/.test(password)) {
      errors.push('Password must contain at least one number');
    }
    
    return {
      valid: errors.length === 0,
      errors
    };
  }
};

// src/utils/formatters.ts

export const formatters = {
  phone: (phone: string): string => {
    const cleaned = phone.replace(/\D/g, '');
    const match = cleaned.match(/^(\d{3})(\d{3})(\d{4})$/);
    if (match) {
      return '(' + match[1] + ') ' + match[2] + '-' + match[3];
    }
    return phone;
  },

  currency: (amount: number): string => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
  },

  percent: (value: number): string => {
    return new Intl.NumberFormat('en-US', {
      style: 'percent',
      minimumFractionDigits: 0,
      maximumFractionDigits: 2
    }).format(value / 100);
  },

  fileSize: (bytes: number): string => {
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    if (bytes === 0) return '0 Bytes';
    const i = Math.floor(Math.log(bytes) / Math.log(1024));
    return Math.round(bytes / Math.pow(1024, i) * 100) / 100 + ' ' + sizes[i];
  },

  duration: (minutes: number): string => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    if (hours === 0) return `${mins}m`;
    if (mins === 0) return `${hours}h`;
    return `${hours}h ${mins}m`;
  },

  boatName: (boat: { name: string; year: number; make: string; model: string }): string => {
    return `${boat.name} (${boat.year} ${boat.make} ${boat.model})`;
  },

  address: (address: {
    street: string;
    city: string;
    state: string;
    zip: string;
  }): string => {
    return `${address.street}, ${address.city}, ${address.state} ${address.zip}`;
  }
};