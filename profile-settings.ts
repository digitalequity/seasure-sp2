// src/components/settings/ProfileSettings.tsx

import React, { useState } from 'react';
import { useAuth } from '../../hooks/useAuth';
import { CameraIcon } from '@heroicons/react/outline';
import { LoadingSpinner } from '../shared/LoadingSpinner';

export const ProfileSettings: React.FC = () => {
  const { user, serviceProvider } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  
  const [formData, setFormData] = useState({
    displayName: serviceProvider?.displayName || '',
    email: serviceProvider?.email || '',
    phone: serviceProvider?.phone || '',
    licenseNumber: serviceProvider?.licenseNumber || '',
    certifications: serviceProvider?.certifications?.join(', ') || '',
    specializations: serviceProvider?.specializations?.join(', ') || '',
    serviceAreas: serviceProvider?.serviceAreas?.join(', ') || ''
  });

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setIsLoading(true);
      try {
        // Handle image upload
        console.log('Uploading image:', file.name);
        // In a real app, upload to storage and update profile
      } catch (error) {
        console.error('Error uploading image:', error);
      } finally {
        setIsLoading(false);
      }
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    setSuccessMessage('');
    
    try {
      // Save profile updates
      console.log('Saving profile:', formData);
      await new Promise(resolve => setTimeout(resolve, 1500)); // Simulate API call
      setSuccessMessage('Profile updated successfully!');
    } catch (error) {
      console.error('Error saving profile:', error);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div>
      <div className="mb-8">
        <h2 className="text-2xl font-semibold text-gray-900">Profile Settings</h2>
        <p className="mt-1 text-sm text-gray-600">
          Update your personal information and preferences
        </p>
      </div>

      {successMessage && (
        <div className="mb-4 rounded-md bg-green-50 p-4">
          <p className="text-sm text-green-800">{successMessage}</p>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Profile Picture */}
        <div>
          <label className="block text-sm font-medium text-gray-700">Profile Picture</label>
          <div className="mt-2 flex items-center">
            <div className="relative">
              {serviceProvider?.profileImage ? (
                <img
                  src={serviceProvider.profileImage}
                  alt="Profile"
                  className="h-24 w-24 rounded-full object-cover"
                />
              ) : (
                <div className="h-24 w-24 rounded-full bg-gray-200 flex items-center justify-center">
                  <span className="text-2xl font-medium text-gray-600">
                    {serviceProvider?.displayName?.charAt(0).toUpperCase()}
                  </span>
                </div>
              )}
              <label className="absolute bottom-0 right-0 rounded-full bg-white shadow-lg p-2 cursor-pointer hover:bg-gray-50">
                <CameraIcon className="h-5 w-5 text-gray-600" />
                <input
                  type="file"
                  className="sr-only"
                  accept="image/*"
                  onChange={handleImageUpload}
                  disabled={isLoading}
                />
              </label>
            </div>
            <div className="ml-5">
              <p className="text-sm text-gray-600">
                Upload a new profile picture. Maximum file size is 5MB.
              </p>
            </div>
          </div>
        </div>

        {/* Personal Information */}
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
          <div>
            <label htmlFor="displayName" className="block text-sm font-medium text-gray-700">
              Display Name
            </label>
            <input
              type="text"
              id="displayName"
              value={formData.displayName}
              onChange={(e) => setFormData({ ...formData, displayName: e.target.value })}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
            />
          </div>

          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700">
              Email Address
            </label>
            <input
              type="email"
              id="email"
              value={formData.email}
              disabled
              className="mt-1 block w-full rounded-md border-gray-300 bg-gray-50 shadow-sm sm:text-sm"
            />
            <p className="mt-1 text-xs text-gray-500">Email cannot be changed</p>
          </div>

          <div>
            <label htmlFor="phone" className="block text-sm font-medium text-gray-700">
              Phone Number
            </label>
            <input
              type="tel"
              id="phone"
              value={formData.phone}
              onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
            />
          </div>

          <div>
            <label htmlFor="licenseNumber" className="block text-sm font-medium text-gray-700">
              License Number
            </label>
            <input
              type="text"
              id="licenseNumber"
              value={formData.licenseNumber}
              onChange={(e) => setFormData({ ...formData, licenseNumber: e.target.value })}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
            />
          </div>
        </div>

        {/* Professional Information */}
        <div>
          <h3 className="text-lg font-medium text-gray-900 mb-4">Professional Information</h3>
          
          <div className="space-y-4">
            <div>
              <label htmlFor="certifications" className="block text-sm font-medium text-gray-700">
                Certifications
              </label>
              <input
                type="text"
                id="certifications"
                value={formData.certifications}
                onChange={(e) => setFormData({ ...formData, certifications: e.target.value })}
                placeholder="Separate multiple certifications with commas"
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
              />
              <p className="mt-1 text-xs text-gray-500">e.g., ABYC Certified, NMEA Installer</p>
            </div>

            <div>
              <label htmlFor="specializations" className="block text-sm font-medium text-gray-700">
                Specializations
              </label>
              <input
                type="text"
                id="specializations"
                value={formData.specializations}
                onChange={(e) => setFormData({ ...formData, specializations: e.target.value })}
                placeholder="Separate multiple specializations with commas"
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
              />
              <p className="mt-1 text-xs text-gray-500">e.g., Outboard Motors, Electrical Systems</p>
            </div>

            <div>
              <label htmlFor="serviceAreas" className="block text-sm font-medium text-gray-700">
                Service Areas
              </label>
              <input
                type="text"
                id="serviceAreas"
                value={formData.serviceAreas}
                onChange={(e) => setFormData({ ...formData, serviceAreas: e.target.value })}
                placeholder="Separate multiple areas with commas"
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
              />
              <p className="mt-1 text-xs text-gray-500">e.g., Miami, Fort Lauderdale, Key West</p>
            </div>
          </div>
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