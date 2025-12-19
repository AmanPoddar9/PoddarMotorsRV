'use client';
import React, { useState } from 'react';
import axios from 'axios';
import { toast } from 'react-hot-toast';

export default function BulkImportPage() {
  const [file, setFile] = useState(null);
  const [importType, setImportType] = useState('general');
  const [loading, setLoading] = useState(false);
  const [summary, setSummary] = useState(null);
  const [errors, setErrors] = useState([]);

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
    setSummary(null);
    setErrors([]);
  };

  const handleUpload = async () => {
    if (!file) return toast.error('Please select a file');

    const formData = new FormData();
    formData.append('file', file);
    formData.append('importType', importType);
    formData.append('defaultSource', 'Bulk Import Tool');

    setLoading(true);
    try {
      const { data } = await axios.post(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000'}/api/import/bulk`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });

      if (data.success) {
        toast.success(`Imported ${data.summary.imported} records successfully!`);
        setSummary(data.summary);
        setErrors(data.errors);
      }
    } catch (error) {
      console.error('Frontend Import Error:', error);
      const msg = error.response?.data?.error || error.message || 'Import failed';
      const status = error.response?.status ? ` (Status: ${error.response.status})` : '';
      toast.error(`Error: ${msg}${status}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-8 max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold text-gray-800 mb-6">Unified Data Import Tool</h1>
      
      <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">Select Data Type (Spoke)</label>
          <select 
            value={importType} 
            onChange={(e) => setImportType(e.target.value)}
            className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
          >
            <option value="general">General Customer Data (Hub Only)</option>
            {/* <option value="workshop">Workshop History (Managed by DMS)</option> */}
            <option value="sell_request">Sell Requests (Purchase Dept)</option>
            <option value="car_requirement">Customer Requirements (Sales Dept)</option>
            <option value="test_drive">Test Drive Bookings (Sales Dept)</option>
            <option value="inspection">Inspection Bookings (Evaluation Dept)</option>
            <option value="insurance">Insurance Policies (Create Policies & Enrich Profile)</option>
          </select>
          <p className="text-xs text-gray-500 mt-2">
            * All imports automatically create or link to a central Customer Profile based on Mobile Number.
          </p>
        </div>

        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">Upload CSV File</label>
          <input 
            type="file" 
            accept=".csv"
            onChange={handleFileChange}
            className="block w-full text-sm text-slate-500
              file:mr-4 file:py-2 file:px-4
              file:rounded-full file:border-0
              file:text-sm file:font-semibold
              file:bg-blue-50 file:text-blue-700
              hover:file:bg-blue-100"
          />
        </div>

        <button 
          onClick={handleUpload} 
          disabled={loading || !file}
          className={`w-full py-3 rounded-lg font-semibold text-white transition-all
            ${loading ? 'bg-gray-400 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700 shadow-md hover:shadow-lg'}`}
        >
          {loading ? 'Processing...' : 'Start Import'}
        </button>
      </div>

      {summary && (
        <div className="mt-8 bg-green-50 p-6 rounded-xl border border-green-100">
          <h3 className="text-lg font-semibold text-green-800 mb-4">Import Summary</h3>
          <div className="grid grid-cols-3 gap-4 text-center">
            <div className="bg-white p-4 rounded-lg shadow-sm">
              <div className="text-sm text-gray-500">Total Rows</div>
              <div className="text-2xl font-bold text-gray-800">{summary.total}</div>
            </div>
            <div className="bg-white p-4 rounded-lg shadow-sm">
              <div className="text-sm text-gray-500">Successfully Imported</div>
              <div className="text-2xl font-bold text-green-600">{summary.imported}</div>
            </div>
            <div className="bg-white p-4 rounded-lg shadow-sm">
              <div className="text-sm text-gray-500">Failed</div>
              <div className="text-2xl font-bold text-red-500">{summary.failed}</div>
            </div>
          </div>
        </div>
      )}

      {errors.length > 0 && (
        <div className="mt-8 bg-red-50 p-6 rounded-xl border border-red-100">
          <h3 className="text-lg font-semibold text-red-800 mb-4">Error Log</h3>
          <div className="max-h-60 overflow-y-auto bg-white rounded-lg border border-red-100 p-4 text-sm">
            {errors.map((err, idx) => (
              <div key={idx} className="mb-2 pb-2 border-b border-gray-100 last:border-0">
                <span className="font-mono text-red-600">Row {idx + 1}:</span> {err.error}
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="mt-8 text-sm text-gray-400 text-center">
        Poddar Motors RV - Admin System
      </div>
    </div>
  );
}
