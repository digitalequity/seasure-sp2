// src/components/business/InvoiceList.tsx

import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Invoice } from '../../types';
import { formatDate, formatCurrency } from '../../utils/helpers';
import { PlusIcon, DownloadIcon, PrinterIcon } from '@heroicons/react/outline';
import { LoadingSpinner } from '../shared/LoadingSpinner';

export const InvoiceList: React.FC = () => {
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [filters, setFilters] = useState({
    status: '',
    search: '',
    dateFrom: '',
    dateTo: ''
  });

  useEffect(() => {
    loadInvoices();
  }, []);

  const loadInvoices = async () => {
    setIsLoading(true);
    try {
      // In a real app, this would fetch from Firebase
      // Mock data for now
      const mockInvoices: Invoice[] = [
        {
          id: '1',
          invoiceNumber: 'INV-2024-001',
          serviceProviderId: 'sp1',
          customerId: 'cust1',
          customerName: 'John Doe',
          boatId: 'boat1',
          boatName: 'Sea Breeze',
          status: 'paid',
          issueDate: new Date('2024-01-15'),
          dueDate: new Date('2024-01-30'),
          paidDate: new Date('2024-01-28'),
          items: [],
          subtotal: 1500,
          tax: 150,
          taxRate: 0.10,
          total: 1650,
          currency: 'USD',
          createdAt: new Date('2024-01-15'),
          updatedAt: new Date('2024-01-28')
        },
        {
          id: '2',
          invoiceNumber: 'INV-2024-002',
          serviceProviderId: 'sp1',
          customerId: 'cust2',
          customerName: 'Jane Smith',
          boatId: 'boat2',
          boatName: 'Ocean Dream',
          status: 'sent',
          issueDate: new Date('2024-02-01'),
          dueDate: new Date('2024-02-15'),
          items: [],
          subtotal: 2500,
          tax: 250,
          taxRate: 0.10,
          total: 2750,
          currency: 'USD',
          createdAt: new Date('2024-02-01'),
          updatedAt: new Date('2024-02-01')
        }
      ];
      setInvoices(mockInvoices);
    } catch (error) {
      console.error('Error loading invoices:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const filteredInvoices = invoices.filter(invoice => {
    if (filters.status && invoice.status !== filters.status) return false;
    if (filters.search) {
      const searchLower = filters.search.toLowerCase();
      if (!invoice.invoiceNumber.toLowerCase().includes(searchLower) &&
          !invoice.customerName.toLowerCase().includes(searchLower) &&
          !invoice.boatName.toLowerCase().includes(searchLower)) {
        return false;
      }
    }
    // Add date filtering logic here if needed
    return true;
  });

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

  return (
    <div className="px-4 sm:px-6 lg:px-8 py-8">
      <div className="sm:flex sm:items-center">
        <div className="sm:flex-auto">
          <h1 className="text-2xl font-semibold text-gray-900">Invoices</h1>
          <p className="mt-2 text-sm text-gray-700">
            Manage customer invoices and payment tracking
          </p>
        </div>
        <div className="mt-4 sm:mt-0 sm:ml-16 sm:flex-none">
          <Link
            to="/business/invoices/new"
            className="inline-flex items-center justify-center rounded-md border border-transparent bg-blue-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-blue-700"
          >
            <PlusIcon className="-ml-1 mr-2 h-5 w-5" />
            Create Invoice
          </Link>
        </div>
      </div>

      {/* Filters */}
      <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-4">
        <div>
          <label htmlFor="search" className="block text-sm font-medium text-gray-700">
            Search
          </label>
          <input
            type="text"
            id="search"
            value={filters.search}
            onChange={(e) => setFilters({ ...filters, search: e.target.value })}
            placeholder="Invoice #, customer, boat..."
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
          />
        </div>
        <div>
          <label htmlFor="status" className="block text-sm font-medium text-gray-700">
            Status
          </label>
          <select
            id="status"
            value={filters.status}
            onChange={(e) => setFilters({ ...filters, status: e.target.value })}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
          >
            <option value="">All Statuses</option>
            <option value="draft">Draft</option>
            <option value="sent">Sent</option>
            <option value="paid">Paid</option>
            <option value="overdue">Overdue</option>
            <option value="cancelled">Cancelled</option>
          </select>
        </div>
        <div>
          <label htmlFor="dateFrom" className="block text-sm font-medium text-gray-700">
            From Date
          </label>
          <input
            type="date"
            id="dateFrom"
            value={filters.dateFrom}
            onChange={(e) => setFilters({ ...filters, dateFrom: e.target.value })}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
          />
        </div>
        <div>
          <label htmlFor="dateTo" className="block text-sm font-medium text-gray-700">
            To Date
          </label>
          <input
            type="date"
            id="dateTo"
            value={filters.dateTo}
            onChange={(e) => setFilters({ ...filters, dateTo: e.target.value })}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
          />
        </div>
      </div>

      {/* Invoice List */}
      <div className="mt-8 overflow-hidden shadow ring-1 ring-black ring-opacity-5 md:rounded-lg">
        <table className="min-w-full divide-y divide-gray-300">
          <thead className="bg-gray-50">
            <tr>
              <th className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-6">
                Invoice #
              </th>
              <th className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                Customer
              </th>
              <th className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                Boat
              </th>
              <th className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                Amount
              </th>
              <th className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                Status
              </th>
              <th className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                Due Date
              </th>
              <th className="relative py-3.5 pl-3 pr-4 sm:pr-6">
                <span className="sr-only">Actions</span>
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200 bg-white">
            {filteredInvoices.map((invoice) => (
              <tr key={invoice.id}>
                <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm sm:pl-6">
                  <Link
                    to={`/business/invoices/${invoice.id}`}
                    className="font-medium text-blue-600 hover:text-blue-900"
                  >
                    {invoice.invoiceNumber}
                  </Link>
                </td>
                <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                  {invoice.customerName}
                </td>
                <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                  {invoice.boatName}
                </td>
                <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-900">
                  {formatCurrency(invoice.total)}
                </td>
                <td className="whitespace-nowrap px-3 py-4 text-sm">
                  <span className={`inline-flex rounded-full px-2 text-xs font-semibold leading-5 ${getStatusBadge(invoice.status)}`}>
                    {invoice.status}
                  </span>
                </td>
                <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                  {formatDate(invoice.dueDate)}
                </td>
                <td className="relative whitespace-nowrap py-4 pl-3 pr-4 text-right text-sm font-medium sm:pr-6">
                  <div className="flex items-center justify-end space-x-2">
                    <button
                      onClick={() => console.log('Download:', invoice.id)}
                      className="text-gray-600 hover:text-gray-900"
                    >
                      <DownloadIcon className="h-5 w-5" />
                    </button>
                    <button
                      onClick={() => console.log('Print:', invoice.id)}
                      className="text-gray-600 hover:text-gray-900"
                    >
                      <PrinterIcon className="h-5 w-5" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};