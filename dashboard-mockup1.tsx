import React from 'react';
import { 
  AnchorIcon, 
  ClipboardListIcon, 
  ChatIcon, 
  ChartBarIcon,
  ClockIcon,
  ExclamationIcon,
  TrendingUpIcon,
  CalendarIcon,
  UserGroupIcon,
  CurrencyDollarIcon
} from '@heroicons/react/outline';

export const DashboardMockup = () => {
  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center">
              <h1 className="text-xl font-semibold text-gray-900">Marine Service Pro</h1>
            </div>
            <div className="flex items-center space-x-4">
              <button className="relative p-2 text-gray-400 hover:text-gray-500">
                <span className="sr-only">Notifications</span>
                <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                </svg>
                <span className="absolute top-0 right-0 block h-2 w-2 rounded-full bg-red-400 ring-2 ring-white" />
              </button>
              <div className="flex items-center">
                <img className="h-8 w-8 rounded-full" src="/api/placeholder/32/32" alt="Profile" />
                <span className="ml-2 text-sm font-medium text-gray-700">John Smith</span>
              </div>
            </div>
          </div>
        </div>
      </header>

      <div className="flex h-[calc(100vh-4rem)]">
        {/* Sidebar */}
        <nav className="w-64 bg-gray-800 text-white">
          <div className="p-4">
            <ul className="space-y-2">
              <li>
                <a href="#" className="flex items-center space-x-3 p-3 rounded-lg bg-gray-700">
                  <ChartBarIcon className="h-5 w-5" />
                  <span>Dashboard</span>
                </a>
              </li>
              <li>
                <a href="#" className="flex items-center space-x-3 p-3 rounded-lg hover:bg-gray-700">
                  <AnchorIcon className="h-5 w-5" />
                  <span>Boats</span>
                </a>
              </li>
              <li>
                <a href="#" className="flex items-center space-x-3 p-3 rounded-lg hover:bg-gray-700">
                  <ClipboardListIcon className="h-5 w-5" />
                  <span>Service Requests</span>
                </a>
              </li>
              <li>
                <a href="#" className="flex items-center space-x-3 p-3 rounded-lg hover:bg-gray-700">
                  <ChatIcon className="h-5 w-5" />
                  <span>Messages</span>
                  <span className="ml-auto bg-blue-600 text-white text-xs rounded-full px-2 py-1">3</span>
                </a>
              </li>
            </ul>
          </div>
        </nav>

        {/* Main Content */}
        <main className="flex-1 overflow-y-auto">
          <div className="p-6">
            <h2 className="text-2xl font-semibold text-gray-900 mb-6">Dashboard</h2>

            {/* Metrics Grid */}
            <div className="grid grid-cols-1 gap-6 mb-8 sm:grid-cols-2 lg:grid-cols-4">
              <div className="bg-white overflow-hidden shadow rounded-lg">
                <div className="p-5">
                  <div className="flex items-center">
                    <div className="flex-shrink-0">
                      <CurrencyDollarIcon className="h-6 w-6 text-gray-400" />
                    </div>
                    <div className="ml-5 w-0 flex-1">
                      <dl>
                        <dt className="text-sm font-medium text-gray-500 truncate">Monthly Revenue</dt>
                        <dd className="flex items-baseline">
                          <div className="text-2xl font-semibold text-gray-900">$124,500</div>
                          <div className="ml-2 flex items-baseline text-sm font-semibold text-green-600">
                            <TrendingUpIcon className="self-center flex-shrink-0 h-5 w-5 text-green-500" aria-hidden="true" />
                            <span className="ml-1">12%</span>
                          </div>
                        </dd>
                      </dl>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-white overflow-hidden shadow rounded-lg">
                <div className="p-5">
                  <div className="flex items-center">
                    <div className="flex-shrink-0">
                      <AnchorIcon className="h-6 w-6 text-gray-400" />
                    </div>
                    <div className="ml-5 w-0 flex-1">
                      <dl>
                        <dt className="text-sm font-medium text-gray-500 truncate">Total Boats</dt>
                        <dd className="flex items-baseline">
                          <div className="text-2xl font-semibold text-gray-900">48</div>
                          <span className="ml-2 text-sm text-gray-600">active</span>
                        </dd>
                      </dl>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-white overflow-hidden shadow rounded-lg">
                <div className="p-5">
                  <div className="flex items-center">
                    <div className="flex-shrink-0">
                      <ClipboardListIcon className="h-6 w-6 text-gray-400" />
                    </div>
                    <div className="ml-5 w-0 flex-1">
                      <dl>
                        <dt className="text-sm font-medium text-gray-500 truncate">Active Requests</dt>
                        <dd className="flex items-baseline">
                          <div className="text-2xl font-semibold text-gray-900">12</div>
                          <span className="ml-2 px-2 py-1 text-xs bg-yellow-100 text-yellow-800 rounded-full">3 urgent</span>
                        </dd>
                      </dl>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-white overflow-hidden shadow rounded-lg">
                <div className="p-5">
                  <div className="flex items-center">
                    <div className="flex-shrink-0">
                      <UserGroupIcon className="h-6 w-6 text-gray-400" />
                    </div>
                    <div className="ml-5 w-0 flex-1">
                      <dl>
                        <dt className="text-sm font-medium text-gray-500 truncate">Customers</dt>
                        <dd className="flex items-baseline">
                          <div className="text-2xl font-semibold text-gray-900">156</div>
                          <span className="ml-2 text-sm text-gray-600">total</span>
                        </dd>
                      </dl>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="mb-8">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Quick Actions</h3>
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
                <button className="relative rounded-lg border border-gray-300 bg-white px-6 py-4 shadow-sm flex items-center space-x-3 hover:border-gray-400 focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-blue-500">
                  <div className="flex-shrink-0 rounded-lg bg-blue-600 p-3 text-white">
                    <AnchorIcon className="h-6 w-6" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <span className="absolute inset-0" aria-hidden="true" />
                    <p className="text-sm font-medium text-gray-900">Add New Boat</p>
                  </div>
                </button>

                <button className="relative rounded-lg border border-gray-300 bg-white px-6 py-4 shadow-sm flex items-center space-x-3 hover:border-gray-400 focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-blue-500">
                  <div className="flex-shrink-0 rounded-lg bg-green-600 p-3 text-white">
                    <ClipboardListIcon className="h-6 w-6" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <span className="absolute inset-0" aria-hidden="true" />
                    <p className="text-sm font-medium text-gray-900">Create Request</p>
                  </div>
                </button>

                <button className="relative rounded-lg border border-gray-300 bg-white px-6 py-4 shadow-sm flex items-center space-x-3 hover:border-gray-400 focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-blue-500">
                  <div className="flex-shrink-0 rounded-lg bg-purple-600 p-3 text-white">
                    <ChatIcon className="h-6 w-6" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <span className="absolute inset-0" aria-hidden="true" />
                    <p className="text-sm font-medium text-gray-900">Start Chat</p>
                  </div>
                </button>

                <button className="relative rounded-lg border border-gray-300 bg-white px-6 py-4 shadow-sm flex items-center space-x-3 hover:border-gray-400 focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-blue-500">
                  <div className="flex-shrink-0 rounded-lg bg-yellow-600 p-3 text-white">
                    <CalendarIcon className="h-6 w-6" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <span className="absolute inset-0" aria-hidden="true" />
                    <p className="text-sm font-medium text-gray-900">Schedule Service</p>
                  </div>
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
              {/* Upcoming Tasks */}
              <div className="bg-white overflow-hidden shadow rounded-lg">
                <div className="px-4 py-5 sm:px-6 flex items-center justify-between">
                  <h3 className="text-lg leading-6 font-medium text-gray-900">Upcoming Tasks</h3>
                  <CalendarIcon className="h-6 w-6 text-gray-400" />
                </div>
                <div className="border-t border-gray-200">
                  <ul className="divide-y divide-gray-200">
                    <li className="px-4 py-4 hover:bg-gray-50">
                      <div className="flex items-center space-x-4">
                        <div className="flex-shrink-0">
                          <span className="inline-flex items-center justify-center h-8 w-8 rounded-full bg-blue-500">
                            <ClockIcon className="h-5 w-5 text-white" />
                          </span>
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-gray-900 truncate">
                            Engine Service - Sea Breeze
                          </p>
                          <p className="text-sm text-gray-500">Tomorrow at 10:00 AM</p>
                        </div>
                        <div>
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                            Scheduled
                          </span>
                        </div>
                      </div>
                    </li>
                    <li className="px-4 py-4 hover:bg-gray-50">
                      <div className="flex items-center space-x-4">
                        <div className="flex-shrink-0">
                          <span className="inline-flex items-center justify-center h-8 w-8 rounded-full bg-yellow-500">
                            <ExclamationIcon className="h-5 w-5 text-white" />
                          </span>
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-gray-900 truncate">
                            Hull Inspection - Wave Runner
                          </p>
                          <p className="text-sm text-gray-500">Friday at 2:00 PM</p>
                        </div>
                        <div>
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                            Priority
                          </span>
                        </div>
                      </div>
                    </li>
                    <li className="px-4 py-4 hover:bg-gray-50">
                      <div className="flex items-center space-x-4">
                        <div className="flex-shrink-0">
                          <span className="inline-flex items-center justify-center h-8 w-8 rounded-full bg-green-500">
                            <ClockIcon className="h-5 w-5 text-white" />
                          </span>
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-gray-900 truncate">
                            Oil Change - Blue Horizon
                          </p>
                          <p className="text-sm text-gray-500">Monday at 9:00 AM</p>
                        </div>
                        <div>
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                            Routine
                          </span>
                        </div>
                      </div>
                    </li>
                  </ul>
                </div>
              </div>

              {/* Recent Requests */}
              <div className="bg-white overflow-hidden shadow rounded-lg">
                <div className="px-4 py-5 sm:px-6 flex items-center justify-between">
                  <h3 className="text-lg leading-6 font-medium text-gray-900">Recent Requests</h3>
                  <ClipboardListIcon className="h-6 w-6 text-gray-400" />
                </div>
                <div className="border-t border-gray-200">
                  <ul className="divide-y divide-gray-200">
                    <li className="px-4 py-4 hover:bg-gray-50">
                      <div className="flex items-center space-x-4">
                        <div className="flex-shrink-0">
                          <span className="inline-flex items-center justify-center h-8 w-8 rounded-full bg-red-500">
                            <ExclamationIcon className="h-5 w-5 text-white" />
                          </span>
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-gray-900 truncate">
                            Emergency - Engine Won't Start
                          </p>
                          <p className="text-sm text-gray-500">Ocean Dream • Just now</p>
                        </div>
                        <div>
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
                            New
                          </span>
                        </div>
                      </div>
                    </li>
                    <li className="px-4 py-4 hover:bg-gray-50">
                      <div className="flex items-center space-x-4">
                        <div className="flex-shrink-0">
                          <span className="inline-flex items-center justify-center h-8 w-8 rounded-full bg-blue-500">
                            <ClipboardListIcon className="h-5 w-5 text-white" />
                          </span>
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-gray-900 truncate">
                            Annual Service Due
                          </p>
                          <p className="text-sm text-gray-500">Marina Star • 1 hour ago</p>
                        </div>
                        <div>
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                            New
                          </span>
                        </div>
                      </div>
                    </li>
                    <li className="px-4 py-4 hover:bg-gray-50">
                      <div className="flex items-center space-x-4">
                        <div className="flex-shrink-0">
                          <span className="inline-flex items-center justify-center h-8 w-8 rounded-full bg-gray-500">
                            <ClipboardListIcon className="h-5 w-5 text-white" />
                          </span>
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-gray-900 truncate">
                            GPS Installation
                          </p>
                          <p className="text-sm text-gray-500">Sunset Sailor • 3 hours ago</p>
                        </div>
                        <div>
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                            Accepted
                          </span>
                        </div>
                      </div>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};