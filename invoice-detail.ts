// src/components/business/InvoiceDetail.tsx

import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Invoice, InvoiceItem } from '../../types';
import { formatDate, formatCurrency } from '../../utils/helpers';
import { LoadingSpinner } from '../shared/LoadingSpinner';
import { 
  DownloadIcon, 
  PrinterIcon, 
  MailIcon, 
  CheckCircleIcon,
  XCircleIcon
} from '@heroicons/react/outline';

export const InvoiceDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [invoice, setInvoice] = useState<Invoice | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [showStatusModal, setShowStatusModal] = useState(false);
  const [newStatus, setNewStatus] = useState<Invoice['status']>('sent');

  useEffect(() => {
    if (id) {
      loadInvoice();
    }
  }, [id]);

  const loadInvoice = async () => {
    setIsLoading(true);
    try {
      // In a real app, this would fetch from Firebase
      // Mock data for now
      const mockInvoice: Invoice = {
        id: id || '1',
        invoiceNumber: 'INV-2024-001',
        serviceProviderId: 'sp1',
        customerId: 'cust1',
        customerName: 'John Doe',
        boatId: 'boat1',
        boatName: 'Sea Breeze',
        requestId: 'req1',
        status: 'sent',
        issueDate: new Date('2024-01-15'),
        dueDate: new Date('2024-01-30'),
        items: [
          {
            id: '1',
            type: 'labor',
            description: 'Engine maintenance - 4 hours',
            quantity: 4,
            unitPrice: 150,
            total: 600,
            taxable: true
          },
          {
            id: '2',
            type: 'part',
            description: 'Oil filter',
            quantity: 1,
            unitPrice: 45,
            total: 45,
            taxable: true
          },
          {
            id: '3',
            type: 'part',
            description: 'Spark plugs (4)',
            quantity: 4,
            unitPrice: 15,
            total: 60,
            taxable: true
          }
        ],
        subtotal: 705,
        tax: 70.50,
        taxRate: 0.10,
        total: 775.50,
        currency: 'USD',
        notes: 'Thank you for your business. Payment is due within 15 days.',
        terms: 'Net 15',
        createdAt: new Date('2024-01-15'),
        updatedAt: new Date('2024-01-15')
      };
      setInvoice(mockInvoice);
    } catch (error) {
      console.error('Error loading invoice:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleStatusUpdate = async () => {
    if (!invoice) return;
    
    // Update invoice status in database
    console.log('Updating status to:', newStatus);
    setInvoice({ ...invoice, status: newStatus });
    setShowStatusModal(false);
  };

  const handleDownload = () => {
    // Generate and download PDF
    console.log('Downloading invoice');
  };

  const handlePrint = () => {
    window.print();
  };

  const handleEmail = () => {
    // Send invoice via email
    console.log('Emailing invoice');
  };

  const getStatusBadge = (status: Invoice['status']) => {
    const styles = {
      draft: 'bg-gray-100 text-gray-800',
      sent: 'bg-blue-100 text-blue-800',
      paid: 'bg-green-100 text-green-800',
      overdue: 'bg-red-100 text-red-800',
      cancelled: 'bg-yellow-100 text-yellow-800'
    };
    return styles[status] || 'bg-gray-100 text-gray-800';
  };

  if (isLoading) return <LoadingSpinner />;
  if (!invoice) return <div>Invoice not found</div>;

  return (
    <div className="px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">
            Invoice {invoice.invoiceNumber}
          </h1>
          <p className="mt-1 text-sm text-gray-600">
            Issued on {formatDate(invoice.issueDate)}
          </p>
        </div>
        <div className="flex items-center space-x-3">
          <button
            onClick={handleEmail}
            className="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
          >
            <MailIcon className="-ml-1 mr-2 h-5 w-5" />
            Email
          </button>
          <button
            onClick={handlePrint}
            className="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
          >
            <PrinterIcon className="-ml-1 mr-2 h-5 w-5" />
            Print
          </button>
          <button
            onClick={handleDownload}
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
          >
            <DownloadIcon className="-ml-1 mr-2 h-5 w-5" />
            Download PDF
          </button>
        </div>
      </div>

      <div className="bg-white shadow-lg rounded-lg overflow-hidden">
        {/* Header */}
        <div className="bg-gray-50 px-6 py-4">
          <div className="flex items-center justify-between">
            <span className={`inline-flex items-center px-3 py-0.5 rounded-full text-sm font-medium ${getStatusBadge(invoice.status)}`}>
              {invoice.status}
            </span>
            <button
              onClick={() => setShowStatusModal(true)}
              className="text-sm text-blue-600 hover:text-blue-900"
            >
              Update Status
            </button>
          </div>
        </div>

        <div className="p-6">
          {/* Invoice Info */}
          <div className="grid grid-cols-2 gap-6 mb-8">
            <div>
              <h3 className="text-sm font-medium text-gray-900">Bill To</h3>
              <p className="mt-1 text-sm text-gray-600">{invoice.customerName}</p>
              <p className="text-sm text-gray-600">{invoice.boatName}</p>
            </div>
            <div className="text-right">
              <h3 className="text-sm font-medium text-gray-900">Invoice Details</h3>
              <p className="mt-1 text-sm text-gray-600">Invoice #: {invoice.invoiceNumber}</p>
              <p className="text-sm text-gray-600">Due Date: {formatDate(invoice.dueDate)}</p>
            </div>
          </div>

          {/* Line Items */}
          <table className="min-w-full divide-y divide-gray-200">
            <thead>
              <tr>
                <th className="px-6 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Description
                </th>
                <th className="px-6 py-3 bg-gray-50 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Qty
                </th>
                <th className="px-6 py-3 bg-gray-50 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Unit Price
                </th>
                <th className="px-6 py-3 bg-gray-50 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Total
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {invoice.items.map((item) => (
                <tr key={item.id}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {item.description}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 text-right">
                    {item.quantity}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 text-right">
                    {formatCurrency(item.unitPrice)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 text-right">
                    {formatCurrency(item.total)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {/* Totals */}
          <div className="mt-8">
            <div className="flex justify-end">
              <div className="w-64">
                <div className="flex justify-between py-2">
                  <span className="text-sm text-gray-600">Subtotal</span>
                  <span className="text-sm text-gray-900">{formatCurrency(invoice.subtotal)}</span>
                </div>
                <div className="flex justify-between py-2">
                  <span className="text-sm text-gray-600">Tax ({(invoice.taxRate * 100).toFixed(0)}%)</span>
                  <span className="text-sm text-gray-900">{formatCurrency(invoice.tax)}</span>
                </div>
                <div className="flex justify-between py-2 border-t border-gray-200">
                  <span className="text-base font-medium text-gray-900">Total</span>
                  <span className="text-base font-medium text-gray-900">{formatCurrency(invoice.total)}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Notes */}
          {invoice.notes && (
            <div className="mt-8">
              <h3 className="text-sm font-medium text-gray-900">Notes</h3>
              <p className="mt-1 text-sm text-gray-600">{invoice.notes}</p>
            </div>
          )}

          {/* Terms */}
          {invoice.terms && (
            <div className="mt-4">
              <h3 className="text-sm font-medium text-gray-900">Terms</h3>
              <p className="mt-1 text-sm text-gray-600">{invoice.terms}</p>
            </div>
          )}
        </div>
      </div>

      {/* Status Update Modal */}
      {showStatusModal && (
        <div className="fixed z-10 inset-0 overflow-y-auto">
          <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
            <div className="fixed inset-0 transition-opacity" aria-hidden="true">
              <div className="absolute inset-0 bg-gray-500 opacity-75"></div>
            </div>
            <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
              <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                <h3 className="text-lg leading-6 font-medium text-gray-900">
                  Update Invoice Status
                </h3>
                <div className="mt-4">
                  <select
                    value={newStatus}
                    onChange={(e) => setNewStatus(e.target.value as Invoice['status'])}
                    className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
                  >
                    <option value="draft">Draft</option>
                    <option value="sent">Sent</option>
                    <option value="paid">Paid</option>
                    <option value="overdue">Overdue</option>
                    <option value="cancelled">Cancelled</option>
                  </select>
                </div>
              </div>
              <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                <button
                  type="button"
                  className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-blue-600 text-base font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:ml-3 sm:w-auto sm:text-sm"
                  onClick={handleStatusUpdate}
                >
                  Update
                </button>
                <button
                  type="button"
                  className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
                  onClick={() => setShowStatusModal(false)}
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