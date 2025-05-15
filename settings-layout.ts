// src/components/settings/SettingsLayout.tsx

import React from 'react';
import { NavLink, Outlet } from 'react-router-dom';
import { 
  UserIcon, 
  OfficeBuildingIcon, 
  BellIcon, 
  LinkIcon, 
  ShieldCheckIcon,
  CogIcon
} from '@heroicons/react/outline';

export const SettingsLayout: React.FC = () => {
  const navigation = [
    { name: 'Profile', href: '/settings/profile', icon: UserIcon },
    { name: 'Company', href: '/settings/company', icon: OfficeBuildingIcon },
    { name: 'Notifications', href: '/settings/notifications', icon: BellIcon },
    { name: 'Integrations', href: '/settings/integrations', icon: LinkIcon },
    { name: 'Security', href: '/settings/security', icon: ShieldCheckIcon },
  ];

  return (
    <div className="flex h-full">
      <div className="w-64 bg-white shadow-sm border-r border-gray-200">
        <div className="p-6">
          <div className="flex items-center">
            <CogIcon className="h-8 w-8 text-gray-400" />
            <h1 className="ml-3 text-2xl font-semibold text-gray-900">Settings</h1>
          </div>
        </div>
        
        <nav className="px-4 pb-6">
          {navigation.map((item) => (
            <NavLink
              key={item.name}
              to={item.href}
              className={({ isActive }) =>
                `group flex items-center px-4 py-3 text-sm font-medium rounded-md mb-1 ${
                  isActive
                    ? 'bg-blue-50 text-blue-700'
                    : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                }`
              }
            >
              <item.icon
                className={({ isActive }) =>
                  `mr-3 h-5 w-5 ${
                    isActive ? 'text-blue-700' : 'text-gray-400 group-hover:text-gray-500'
                  }`
                }
              />
              {item.name}
            </NavLink>
          ))}
        </nav>
      </div>
      
      <div className="flex-1 overflow-auto">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <Outlet />
        </div>
      </div>
    </div>
  );
};