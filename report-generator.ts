// src/components/business/ReportGenerator.tsx

import React, { useState } from 'react';
import { formatDate, formatCurrency } from '../../utils/helpers';
import { DownloadIcon, DocumentReportIcon, ChartBarIcon } from '@heroicons/react/outline';
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

interface ReportData {
  revenue: number;
  expenses: number;
  profit: number;
  completedRequests: number;
  activeClients: number;
  monthlyData: Array<{
    month: string;
    revenue: number;
    expenses: number;
    profit: number;
  }>;
  categoryBreakdown: Array<{
    category: string;
    value: number;
  }>;
}

export const ReportGenerator: React.FC = () => {
  const [reportType, setReportType] = useState('monthly');
  const [dateRange, setDateRange] = useState({
    from: new Date(new Date().setMonth(new Date().getMonth() - 3)).toISOString().split('T')[0],
    to: new Date().toISOString().split('T')[0]
  });
  const [isGenerating, setIsGenerating] = useState(false);
  const [reportData, setReportData] = useState<ReportData | null>(null);

  const reportTypes = [
    { value: 'monthly', label: 'Monthly Summary' },
    { value: 'quarterly', label: 'Quarterly Report' },
    { value: 'yearly', label: 'Yearly Overview' },
    { value: 'custom', label: 'Custom Report' }
  ];

  const generateReport = async () => {
    setIsGenerating(true);
    
    // Simulate API call to generate report
    setTimeout(() => {
      const mockData: ReportData = {
        revenue: 45670,
        expenses: 12340,
        profit: 33330,
        completedRequests: 127,
        activeClients: 42,
        monthlyData: [
          { month: 'Jan', revenue: 12000, expenses: 3500, profit: 8500 },
          { month: 'Feb', revenue: 14500, expenses: 4200, profit: 10300 },
          { month: 'Mar', revenue: 19170, expenses: 4640, profit: 14530 }
        ],
        categoryBreakdown: [
          { category: 'Maintenance', value: 25000 },
          { category: 'Repairs', value: 15000 },
          { category: 'Inspections', value: 3670 },
          { category: 'Consultation', value: 2000 }
        ]
      };
      
      setReportData(mockData);
      setIsGenerating(false);
    }, 2000);
  };

  const downloadReport = (format: 'pdf' | 'excel' | 'csv') => {
    console.log(`Downloading report in ${format} format`);
    // Implement download functionality
  };

  return (
    <div className="px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-2xl font-semibold text-gray-900">Business Reports</h1>
        <p className="mt-2 text-sm text-gray-700">
          Generate comprehensive business reports and analytics
        </p>
      </div>

      <div className="bg-white shadow rounded-lg p-6">
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-3">
          <div>
            <label htmlFor="reportType" className="block text-sm font-medium text-gray-700">
              Report Type
            </label>
            <select
              id="reportType"
              value={reportType}
              onChange={(e) => setReportType(e.target.value)}
              className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
            >
              {reportTypes.map((type) => (
                <option key={type.value} value={type.value}>
                  {type.label}
                </option>
              ))}
            </select>
          </div>
          
          <div>
            <label htmlFor="dateFrom" className="block text-sm font-medium text-gray-700">
              From Date
            </label>
            <input
              type="date"
              id="dateFrom"
              value={dateRange.from}
              onChange={(e) => setDateRange({ ...dateRange, from: e.target.value })}
              className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
            />
          </div>
          
          <div>
            <label htmlFor="dateTo" className="block text-sm font-medium text-gray-700">
              To Date
            </label>
            <input
              type="date"
              id="dateTo"
              value={dateRange.to}
              onChange={(e) => setDateRange({ ...dateRange, to: e.target.value })}
              className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
            />
          </div>
        </div>

        <div className="mt-6">
          <button
            onClick={generateReport}
            disabled={isGenerating}
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 disabled:opacity-50"
          >
            <ChartBarIcon className="-ml-1 mr-2 h-5 w-5" />
            {isGenerating ? 'Generating...' : 'Generate Report'}
          </button>
        </div>
      </div>

      {reportData && (
        <div className="mt-8">
          {/* Summary Cards */}
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
            <div className="bg-white overflow-hidden shadow rounded-lg">
              <div className="px-4 py-5 sm:p-6">
                <dt className="text-sm font-medium text-gray-500 truncate">Total Revenue</dt>
                <dd className="mt-1 text-3xl font-semibold text-gray-900">
                  {formatCurrency(reportData.revenue)}
                </dd>
              </div>
            </div>
            <div className="bg-white overflow-hidden shadow rounded-lg">
              <div className="px-4 py-5 sm:p-6">
                <dt className="text-sm font-medium text-gray-500 truncate">Total Expenses</dt>
                <dd className="mt-1 text-3xl font-semibold text-gray-900">
                  {formatCurrency(reportData.expenses)}
                </dd>
              </div>
            </div>
            <div className="bg-white overflow-hidden shadow rounded-lg">
              <div className="px-4 py-5 sm:p-6">
                <dt className="text-sm font-medium text-gray-500 truncate">Net Profit</dt>
                <dd className="mt-1 text-3xl font-semibold text-gray-900">
                  {formatCurrency(reportData.profit)}
                </dd>
              </div>
            </div>
            <div className="bg-white overflow-hidden shadow rounded-lg">
              <div className="px-4 py-5 sm:p-6">
                <dt className="text-sm font-medium text-gray-500 truncate">Completed Jobs</dt>
                <dd className="mt-1 text-3xl font-semibold text-gray-900">
                  {reportData.completedRequests}
                </dd>
              </div>
            </div>
          </div>

          {/* Charts */}
          <div className="mt-8 grid grid-cols-1 gap-8 lg:grid-cols-2">
            <div className="bg-white shadow rounded-lg p-6">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Revenue vs Expenses</h3>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={reportData.monthlyData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Line type="monotone" dataKey="revenue" stroke="#3B82F6" />
                    <Line type="monotone" dataKey="expenses" stroke="#EF4444" />
                    <Line type="monotone" dataKey="profit" stroke="#10B981" />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>

            <div className="bg-white shadow rounded-lg p-6">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Revenue by Category</h3>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={reportData.categoryBreakdown}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="category" />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="value" fill="#3B82F6" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>

          {/* Download Options */}
          <div className="mt-8 bg-white shadow rounded-lg p-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Download Report</h3>
            <div className="flex space-x-4">
              <button
                onClick={() => downloadReport('pdf')}
                className="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
              >
                <DownloadIcon className="-ml-1 mr-2 h-5 w-5" />
                PDF
              </button>
              <button
                onClick={() => downloadReport('excel')}
                className="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
              >
                <DownloadIcon className="-ml-1 mr-2 h-5 w-5" />
                Excel
              </button>
              <button
                onClick={() => downloadReport('csv')}
                className="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
              >
                <DownloadIcon className="-ml-1 mr-2 h-5 w-5" />
                CSV
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};