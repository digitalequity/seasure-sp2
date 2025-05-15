// src/components/chat/FilePreview.tsx

import React, { useState } from 'react';
import { DownloadIcon, XIcon, DocumentTextIcon, PhotographIcon, FilmIcon } from '@heroicons/react/outline';
import { formatFileSize } from '../../utils/helpers';

interface FilePreviewProps {
  file: {
    id: string;
    name: string;
    url: string;
    type: string;
    size: number;
  };
  onClose: () => void;
}

export const FilePreview: React.FC<FilePreviewProps> = ({ file, onClose }) => {
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const getFileIcon = (type: string) => {
    if (type.startsWith('image/')) return PhotographIcon;
    if (type.startsWith('video/')) return FilmIcon;
    if (type.includes('pdf')) return DocumentTextIcon;
    return DocumentTextIcon;
  };

  const FileIcon = getFileIcon(file.type);

  const handleDownload = () => {
    // Create a temporary anchor element to trigger download
    const a = document.createElement('a');
    a.href = file.url;
    a.download = file.name;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  const renderPreview = () => {
    if (file.type.startsWith('image/')) {
      return (
        <img
          src={file.url}
          alt={file.name}
          className="max-w-full max-h-full object-contain"
          onLoad={() => setIsLoading(false)}
          onError={() => {
            setIsLoading(false);
            setError('Failed to load image');
          }}
        />
      );
    }

    if (file.type.startsWith('video/')) {
      return (
        <video
          controls
          className="max-w-full max-h-full"
          onLoadedData={() => setIsLoading(false)}
          onError={() => {
            setIsLoading(false);
            setError('Failed to load video');
          }}
        >
          <source src={file.url} type={file.type} />
          Your browser does not support the video tag.
        </video>
      );
    }

    if (file.type === 'application/pdf') {
      return (
        <iframe
          src={file.url}
          className="w-full h-full"
          title={file.name}
          onLoad={() => setIsLoading(false)}
          onError={() => {
            setIsLoading(false);
            setError('Failed to load PDF');
          }}
        />
      );
    }

    // For other file types, show a placeholder
    setIsLoading(false);
    return (
      <div className="flex flex-col items-center justify-center h-full">
        <FileIcon className="h-32 w-32 text-gray-400 mb-4" />
        <p className="text-lg font-medium text-gray-900">{file.name}</p>
        <p className="text-sm text-gray-500 mb-6">{formatFileSize(file.size)}</p>
        <button
          onClick={handleDownload}
          className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
        >
          <DownloadIcon className="h-5 w-5 mr-2" />
          Download File
        </button>
      </div>
    );
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      <div className="absolute inset-0 bg-black bg-opacity-75" onClick={onClose} />
      
      <div className="absolute inset-4 sm:inset-8 md:inset-16 flex flex-col">
        <div className="bg-white rounded-t-lg shadow-xl p-4 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <FileIcon className="h-6 w-6 text-gray-400" />
            <div>
              <h3 className="text-lg font-medium text-gray-900">{file.name}</h3>
              <p className="text-sm text-gray-500">{formatFileSize(file.size)}</p>
            </div>
          </div>
          <div className="flex items-center space-x-3">
            <button
              onClick={handleDownload}
              className="inline-flex items-center px-3 py-1 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
            >
              <DownloadIcon className="h-4 w-4 mr-1" />
              Download
            </button>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-500"
            >
              <XIcon className="h-6 w-6" />
            </button>
          </div>
        </div>
        
        <div className="flex-1 bg-gray-100 rounded-b-lg overflow-hidden relative">
          {isLoading && (
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            </div>
          )}
          
          {error && (
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <p className="text-red-600 mb-4">{error}</p>
              <button
                onClick={handleDownload}
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
              >
                <DownloadIcon className="h-5 w-5 mr-2" />
                Download Instead
              </button>
            </div>
          )}
          
          <div className="h-full flex items-center justify-center p-4">
            {renderPreview()}
          </div>
        </div>
      </div>
    </div>
  );
};