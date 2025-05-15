// src/components/settings/CompanySettings.tsx

import React, { useState } from 'react';
import { useAuth } from '../../hooks/useAuth';
import { LoadingSpinner } from '../shared/LoadingSpinner';
import { PlusIcon, TrashIcon } from '@heroicons/react/outline';

export const CompanySettings: React.FC = () => {
  const { serviceProvider } = useAuth();
  const [isSaving, setIsSaving] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  
  const [formData, setFormData] = useState({
    companyName: serviceProvider?.companyName || '',
    address: {
      street: serviceProvider?.address?.street || '',
      city: serviceProvider?.address?.city || '',
      state: serviceProvider?.address?.state || '',
      zip: serviceProvider?.address?.zip || '',
      country: serviceProvider?.address?.country || 'United States'
    },
    businessHours: serviceProvider?.businessHours || {
      monday: { isOpen: true, openTime: '09:00', closeTime: '17:00' },
      tuesday: { isOpen: true, openTime: '09:00', closeTime: '17:00' },
      wednesday: { isOpen: true, openTime: '09:00', closeTime: '17:00' },
      thursday: { isOpen: true, openTime: '09:00', closeTime: '17:00' },
      friday: { isOpen: true, openTime: '09:00', closeTime: '17:00' },
      saturday: { isOpen: false, openTime: '09:00', closeTime: '17:00' },
      sunday: { isOpen: false, openTime: '09:00', closeTime: '17:00' }
    }
  });

  const [employees, setEmployees] = useState(serviceProvider?.employees || []);
  const [showAddEmployee, setShowAddEmployee] = useState(false);
  const [newEmployee, setNewEmployee] = useState({
    name: '',
    email: '',
    role: 'technician' as const
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    setSuccessMessage('');
    
    try {
      // Save company settings
      console.log('Saving company settings:', formData);
      await new Promise(resolve => setTimeout(resolve, 1500)); // Simulate API call
      setSuccessMessage('Company settings updated successfully!');
    } catch (error) {
      console.error('Error saving settings:', error);
    } finally {
      setIsSaving(false);
    }
  };

  const handleAddEmployee = () => {
    const employee = {
      id: Date.now().toString(),
      ...newEmployee,
      permissions: ['basic'],
      isActive: true
    };
    setEmployees([...employees, employee]);
    setNewEmployee({ name: '', email: '', role: 'technician' });
    setShowAddEmployee(false);
  };

  const handleRemoveEmployee = (id: string) => {
    setEmployees(employees.filter(emp => emp.id !== id));
  };

  const handleBusinessHoursChange = (day: string, field: string, value: any) => {
    setFormData({
      ...formData,
      businessHours: {
        ...formData.businessHours,
        [day]: {
          ...formData.businessHours[day],
          [field]: value
        }
      }
    });
  };

  const daysOfWeek = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'];

  return (
    <div>
      <div className="mb-8">
        <h2 className="text-2xl font-semibold text-gray-900">Company Settings</h2>
        <p className="mt-1 text-sm text-gray-600">
          Manage your company information and team members
        </p>
      </div>

      {successMessage && (
        <div className="mb-4 rounded-md bg-green-50 p-4">
          <p className="text-sm text-green-800">{successMessage}</p>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-8">
        {/* Company Information */}
        <div>
          <h3 className="text-lg font-medium text-gray-900 mb-4">Company Information</h3>
          
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
            <div className="sm:col-span-2">
              <label htmlFor="companyName" className="block text-sm font-medium text-gray-700">
                Company Name
              </label>
              <input
                type="text"
                id="companyName"
                value={formData.companyName}
                onChange={(e) => setFormData({ ...formData, companyName: e.target.value })}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
              />
            </div>

            <div className="sm:col-span-2">
              <label htmlFor="street" className="block text-sm font-medium text-gray-700">
                Street Address
              </label>
              <input
                type="text"
                id="street"
                value={formData.address.street}
                onChange={(e) => setFormData({
                  ...formData,
                  address: { ...formData.address, street: e.target.value }
                })}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
              />
            </div>

            <div>
              <label htmlFor="city" className="block text-sm font-medium text-gray-700">
                City
              </label>
              <input
                type="text"
                id="city"
                value={formData.address.city}
                onChange={(e) => setFormData({
                  ...formData,
                  address: { ...formData.address, city: e.target.value }
                })}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
              />
            </div>

            <div>
              <label htmlFor="state" className="block text-sm font-medium text-gray-700">
                State/Province
              </label>
              <input
                type="text"
                id="state"
                value={formData.address.state}
                onChange={(e) => setFormData({
                  ...formData,
                  address: { ...formData.address, state: e.target.value }
                })}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
              />
            </div>

            <div>
              <label htmlFor="zip" className="block text-sm font-medium text-gray-700">
                ZIP/Postal Code
              </label>
              <input
                type="text"
                id="zip"
                value={formData.address.zip}
                onChange={(e) => setFormData({
                  ...formData,
                  address: { ...formData.address, zip: e.target.value }
                })}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
              />
            </div>

            <div>
              <label htmlFor="country" className="block text-sm font-medium text-gray-700">
                Country
              </label>
              <select
                id="country"
                value={formData.address.country}
                onChange={(e) => setFormData({
                  ...formData,
                  address: { ...formData.address, country: e.target.value }
                })}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
              >
                <option value="United States">United States</option>
                <option value="Canada">Canada</option>
                <option value="Mexico">Mexico</option>
                <option value="United Kingdom">United Kingdom</option>
                <option value="Australia">Australia</option>
              </select>
            </div>
          </div>
        </div>

        {/* Business Hours */}
        <div>
          <h3 className="text-lg font-medium text-gray-900 mb-4">Business Hours</h3>
          
          <div className="space-y-3">
            {daysOfWeek.map((day) => (
              <div key={day} className="flex items-center">
                <div className="w-32">
                  <label className="text-sm font-medium text-gray-700 capitalize">
                    {day}
                  </label>
                </div>
                <div className="flex items-center space-x-3">
                  <input
                    type="checkbox"
                    checked={formData.businessHours[day].isOpen}
                    onChange={(e) => handleBusinessHoursChange(day, 'isOpen', e.target.checked)}
                    className="h-4 w-4 text-blue-600 border-gray-300 rounded"
                  />
                  <span className="text-sm text-gray-500">Open</span>
                  <input
                    type="time"
                    value={formData.businessHours[day].openTime}
                    onChange={(e) => handleBusinessHoursChange(day, 'openTime', e.target.value)}
                    disabled={!formData.businessHours[day].isOpen}
                    className="rounded-md border-gray-300 text-sm disabled:bg-gray-100"
                  />
                  <span className="text-sm text-gray-500">to</span>
                  <input
                    type="time"
                    value={formData.businessHours[day].closeTime}
                    onChange={(e) => handleBusinessHoursChange(day, 'closeTime', e.target.value)}
                    disabled={!formData.businessHours[day].isOpen}
                    className="rounded-md border-gray-300 text-sm disabled:bg-gray-100"
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Team Members */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-medium text-gray-900">Team Members</h3>
            <button
              type="button"
              onClick={() => setShowAddEmployee(true)}
              className="inline-flex items-center px-3 py-1 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
            >
              <PlusIcon className="-ml-1 mr-2 h-4 w-4" />
              Add Employee
            </button>
          </div>

          <div className="space-y-3">
            {employees.map((employee) => (
              <div key={employee.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div>
                  <p className="text-sm font-medium text-gray-900">{employee.name}</p>
                  <p className="text-sm text-gray-500">{employee.email}</p>
                </div>
                <div className="flex items-center space-x-3">
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                    {employee.role}
                  </span>
                  <button
                    type="button"
                    onClick={() => handleRemoveEmployee(employee.id)}
                    className="text-red-600 hover:text-red-800"
                  >
                    <TrashIcon className="h-5 w-5" />
                  </button>
                </div>
              </div>
            ))}
          </div>

          {showAddEmployee && (
            <div className="mt-4 p-4 bg-gray-50 rounded-lg">
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                <input
                  type="text"
                  placeholder="Name"
                  value={newEmployee.name}
                  onChange={(e) => setNewEmployee({ ...newEmployee, name: e.target.value })}
                  className="rounded-md border-gray-300 text-sm"
                />
                <input
                  type="email"
                  placeholder="Email"
                  value={newEmployee.email}
                  onChange={(e) => setNewEmployee({ ...newEmployee, email: e.target.value })}
                  className="rounded-md border-gray-300 text-sm"
                />
                <select
                  value={newEmployee.role}
                  onChange={(e) => setNewEmployee({ ...newEmployee, role: e.target.value as any })}
                  className="rounded-md border-gray-300 text-sm"
                >
                  <option value="technician">Technician</option>
                  <option value="admin">Admin</option>
                  <option value="support">Support</option>
                </select>
              </div>
              <div className="mt-3 flex justify-end space-x-3">
                <button
                  type="button"
                  onClick={() => setShowAddEmployee(false)}
                  className="px-3 py-1 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleAddEmployee}
                  className="px-3 py-1 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
                >
                  Add
                </button>
              </div>
            </div>
          )}
        </div>

        <div className="flex justify-end">
          <button
            type="submit"
            disabled={isSaving}
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
          >
            {isSaving ? <LoadingSpinner /> : 'Save Changes'}
          </button>
        </div>
      </form>
    </div>
  );
};