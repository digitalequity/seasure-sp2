// src/components/knowledge/DocumentViewer.tsx

import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { DownloadIcon, ShareIcon, TrashIcon, DocumentTextIcon } from '@heroicons/react/outline';
import { LoadingSpinner } from '../shared/LoadingSpinner';
import { useKnowledge } from '../../hooks/useKnowledge';
import { formatDate, formatFileSize } from '../../utils/helpers';

export const DocumentViewer: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { deleteDocument } = useKnowledge();
  const [document, setDocument] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  useEffect(() => {
    // Load document details
    if (id) {
      loadDocument();
    }
  }, [id]);

  const loadDocument = async () => {
    setIsLoading(true);
    try {
      // In a real app, this would fetch from Firebase
      // For now, using mock data
      setDocument({
        id,
        title: 'Engine Maintenance Manual',
        type: 'manual',
        category: 'engine',
        fileUrl: '/path/to/file.pdf',
        size: 2458624,
        uploadedBy: 'John Doe',
        uploadedAt: new Date(),
        tags: ['engine', 'maintenance', 'yamaha'],
        description: 'Comprehensive maintenance manual for Yamaha outboard engines',
        boatId: null,
        isPublic: true
      });
    } catch (error) {
      console.error('Error loading document:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!document) return;
    
    const success = await deleteDocument(document.id);
    if (success) {
      navigate('/knowledge');
    }
    setShowDeleteModal(false);
  };

  const handleDownload = () => {
    if (document?.fileUrl) {
      window.open(document.fileUrl, '_blank');
    }
  };

  const handleShare = () => {
    // Implement sharing functionality
    console.log('Sharing document:', document);
  };

  if (isLoading) return <LoadingSpinner />;
  if (!document) return <div>Document not found</div>;

  return (
    <div className="px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-semibold text-gray-900">{document.title}</h1>
          <div className="flex items-center space-x-3">
            <button
              onClick={handleShare}
              className="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
            >
              <ShareIcon className="-ml-1 mr-2 h-5 w-5" />
              Share
            </button>
            <button
              onClick={handleDownload}
              className="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
            >
              <DownloadIcon className="-ml-1 mr-2 h-5 w-5" />
              Download
            </button>
            <button
              onClick={() => setShowDeleteModal(true)}
              className="inline-flex items-center px-4 py-2 border border-red-300 text-sm font-medium rounded-md text-red-700 bg-white hover:bg-red-50"
            >
              <TrashIcon className="-ml-1 mr-2 h-5 w-5" />
              Delete
            </button>
          </div>
        </div>
      </div>

      <div className="bg-white shadow overflow-hidden sm:rounded-lg">
        <div className="px-4 py-5 sm:px-6">
          <dl className="grid grid-cols-1 gap-x-4 gap-y-8 sm:grid-cols-2">
            <div className="sm:col-span-1">
              <dt className="text-sm font-medium text-gray-500">Type</dt>
              <dd className="mt-1 text-sm text-gray-900">{document.type}</dd>
            </div>
            <div className="sm:col-span-1">
              <dt className="text-sm font-medium text-gray-500">Category</dt>
              <dd className="mt-1 text-sm text-gray-900">{document.category}</dd>
            </div>
            <div className="sm:col-span-1">
              <dt className="text-sm font-medium text-gray-500">Size</dt>
              <dd className="mt-1 text-sm text-gray-900">{formatFileSize(document.size)}</dd>
            </div>
            <div className="sm:col-span-1">
              <dt className="text-sm font-medium text-gray-500">Uploaded</dt>
              <dd className="mt-1 text-sm text-gray-900">{formatDate(document.uploadedAt)}</dd>
            </div>
            <div className="sm:col-span-1">
              <dt className="text-sm font-medium text-gray-500">Uploaded By</dt>
              <dd className="mt-1 text-sm text-gray-900">{document.uploadedBy}</dd>
            </div>
            <div className="sm:col-span-1">
              <dt className="text-sm font-medium text-gray-500">Visibility</dt>
              <dd className="mt-1 text-sm text-gray-900">
                {document.isPublic ? 'Public' : 'Private'}
              </dd>
            </div>
            <div className="sm:col-span-1">
              <dt className="text-sm font-medium text-gray-500">Tags</dt>
              <dd className="mt-1 text-sm text-gray-900">
                <div className="flex flex-wrap gap-2">
                  {document.tags.map((tag: string) => (
                    <span
                      key={tag}
                      className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </dd>
            </div>
            <div className="sm:col-span-2">
              <dt className="text-sm font-medium text-gray-500">Description</dt>
              <dd className="mt-1 text-sm text-gray-900">{document.description}</dd>
            </div>
          </dl>
        </div>
      </div>

      <div className="mt-8">
        {document.type === 'manual' || document.type === 'guide' ? (
          <iframe
            src={document.fileUrl}
            className="w-full h-screen border rounded-lg"
            title={document.title}
          />
        ) : document.type === 'video' ? (
          <video
            controls
            className="w-full rounded-lg"
            src={document.fileUrl}
          >
            Your browser does not support the video tag.
          </video>
        ) : (
          <div className="bg-gray-50 rounded-lg p-8 text-center">
            <DocumentTextIcon className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-2 text-sm font-medium text-gray-900">Document Preview</h3>
            <p className="mt-1 text-sm text-gray-500">
              Preview not available for this file type
            </p>
            <button
              onClick={handleDownload}
              className="mt-4 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
            >
              Download to view
            </button>
          </div>
        )}
      </div>

      {/* Delete Confirmation Modal */}
      {showDeleteModal && (
        <div className="fixed z-10 inset-0 overflow-y-auto">
          <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
            <div className="fixed inset-0 transition-opacity" aria-hidden="true">
              <div className="absolute inset-0 bg-gray-500 opacity-75"></div>
            </div>
            <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
              <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                <div className="sm:flex sm:items-start">
                  <div className="mx-auto flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full bg-red-100 sm:mx-0 sm:h-10 sm:w-10">
                    <TrashIcon className="h-6 w-6 text-red-600" aria-hidden="true" />
                  </div>
                  <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
                    <h3 className="text-lg leading-6 font-medium text-gray-900">
                      Delete Document
                    </h3>
                    <div className="mt-2">
                      <p className="text-sm text-gray-500">
                        Are you sure you want to delete this document? This action cannot be undone.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
              <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                <button
                  type="button"
                  className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-red-600 text-base font-medium text-white hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 sm:ml-3 sm:w-auto sm:text-sm"
                  onClick={handleDelete}
                >
                  Delete
                </button>
                <button
                  type="button"
                  className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
                  onClick={() => setShowDeleteModal(false)}
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};