'use client'

import { useState } from 'react'
import axios from 'axios'
import API_URL from '@/app/config/api'
import { FaFileUpload, FaTimes, FaSpinner, FaCheckCircle, FaExclamationTriangle } from 'react-icons/fa'
import Papa from 'papaparse'

export default function ImportModal({ isOpen, onClose }) {
  const [file, setFile] = useState(null)
  const [previewData, setPreviewData] = useState([])
  const [isCommitReady, setIsCommitReady] = useState(false)
  const [stats, setStats] = useState({ total: 0, valid: 0, duplicates: 0, errors: 0 })
  const [uploading, setUploading] = useState(false)
  const [error, setError] = useState('')
  const [result, setResult] = useState(null)

  // Helper: robust mobile extraction
  const cleanMobile = (val) => {
    if (!val) return '';
    const str = String(val).replace(/\D/g, ''); // Remove non-digits
    return str.slice(-10); // Take last 10
  };

  // Helper: Smart Column Finder
  // If specific header is missing, search ALL columns for a value that looks like a mobile number (10 digits starting with 6-9)
  const findMobileInRow = (row) => {
     // 1. Try explicit columns first
     const explicit = row['mobile'] || row['phone'] || row['contact'];
     if (explicit) return cleanMobile(explicit);
     
     // 2. Fallback: Search all values
     for (const key in row) {
         const val = row[key];
         if (!val) continue;
         const str = String(val).replace(/\D/g, '');
         if (str.length === 10 && ['6','7','8','9'].includes(str[0])) {
             return str;
         }
     }
     return '';
  };

  const handleFileChange = (e) => {
    const selected = e.target.files[0]
    if (selected) {
        setFile(selected)
        setResult(null)
        setError('')
        setPreviewData([])
        setIsCommitReady(false)
        setStats({ total: 0, valid: 0, duplicates: 0, errors: 0 })
    }
  }

  const handlePreview = async () => {
    if (!file) return
    setUploading(true)
    setError('')

    Papa.parse(file, {
        header: true,
        skipEmptyLines: true,
        transformHeader: (h) => h.trim().toLowerCase(), // normalize headers
        complete: async (results) => {
            const policies = results.data.map(row => ({
                // Keys are now guaranteed lowercase and trimmed
                policyNumber: row['policynumber'] || row['policy number'] || row['policy_no'],
                insurer: row['insurer'],
                expiryDate: row['expirydate'] || row['expiry date'] || row['expiry'], // Added 'expiry'
                policyStartDate: row['policystartdate'] || row['policy start date'],
                
                customerName: row['customername'] || row['customer name'] || row['name'],
                
                // ROBUST Mobile Extraction
                mobile: findMobileInRow(row),

                email: row['email'],
                areaCity: row['city'] || row['areacity'] || row['area city'],
                
                regNumber: row['regnumber'] || row['reg number'],
                make: row['make'],
                model: row['model'],
                variant: row['variant'],
                fuelType: row['fueltype'] || row['fuel type'],
                year: row['year'] || row['yearofmanufacture'] || row['year of manufacture'],
                registrationDate: row['registrationdate'] || row['registration date'],
                
                premiumAmount: row['totalpremium'] || row['total premium'] || row['premium'] || row['premiumamount'],
                ownDamagePremium: row['odpremium'] || row['od premium'] || row['owndhamagepremium'],
                tpPremium: row['tppremium'] || row['tp premium'],
                addonPremium: row['addonpremium'] || row['addon premium'],
                idvCurrent: row['idv'] || row['idvcurrent'],
                ncb: row['ncb']
            })).filter(p => p.policyNumber && p.expiryDate && p.mobile)

            if (policies.length === 0) {
                setError('No valid rows found. Check column headers.')
                setUploading(false)
                return
            }

            try {
                // Send for Preview
                const res = await axios.post(`${API_URL}/api/insurance/import`, { 
                    policies, 
                    preview: true 
                }, { withCredentials: true })
                
                const pData = res.data.results.previewData;
                setPreviewData(pData)
                
                // Calc stats
                const valid = pData.filter(r => r.status === 'Ready').length
                const duplicates = pData.filter(r => r.reason.includes('exist')).length
                const errs = pData.filter(r => r.status === 'Error').length
                
                setStats({ total: policies.length, valid, duplicates, errors: errs })
                setIsCommitReady(true)

            } catch (err) {
                setError(err.response?.data?.message || 'Preview failed')
            } finally {
                setUploading(false)
            }
        }
    })
  }

  const handleCommit = async () => {
    if (!file || !isCommitReady) return
    setUploading(true)
    
    Papa.parse(file, {
        header: true,
        skipEmptyLines: true,
        transformHeader: (h) => h.trim().toLowerCase(), // normalize headers
        complete: async (results) => {
            const policies = results.data.map(row => ({
                // Keys are now guaranteed lowercase and trimmed
                policyNumber: row['policynumber'] || row['policy number'] || row['policy_no'],
                insurer: row['insurer'],
                expiryDate: row['expirydate'] || row['expiry date'] || row['expiry'],
                policyStartDate: row['policystartdate'] || row['policy start date'],
                
                customerName: row['customername'] || row['customer name'] || row['name'],
                
                // ROBUST Mobile Extraction
                mobile: findMobileInRow(row), // Use same smart logic

                email: row['email'],
                areaCity: row['city'] || row['areacity'] || row['area city'],
                
                regNumber: row['regnumber'] || row['reg number'],
                make: row['make'],
                model: row['model'],
                variant: row['variant'],
                fuelType: row['fueltype'] || row['fuel type'],
                year: row['year'] || row['yearofmanufacture'] || row['year of manufacture'],
                registrationDate: row['registrationdate'] || row['registration date'],
                
                premiumAmount: row['totalpremium'] || row['total premium'] || row['premium'] || row['premiumamount'],
                ownDamagePremium: row['odpremium'] || row['od premium'] || row['owndhamagepremium'],
                tpPremium: row['tppremium'] || row['tp premium'],
                addonPremium: row['addonpremium'] || row['addon premium'],
                idvCurrent: row['idv'] || row['idvcurrent'],
                ncb: row['ncb']
            })).filter(p => p.policyNumber && p.expiryDate && p.mobile)

            try {
                const res = await axios.post(`${API_URL}/api/insurance/import`, { 
                    policies, 
                    preview: false 
                }, { withCredentials: true })
                setResult(res.data.results)
                setFile(null)
                setPreviewData([])
                setIsCommitReady(false)
            } catch (err) {
                 setError(err.response?.data?.message || 'Upload failed')
            } finally {
                setUploading(false)
            }
        }
     })
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
      <div className="bg-gray-800 rounded-2xl w-full max-w-3xl max-h-[90vh] overflow-y-auto border border-gray-700 shadow-2xl">
        <div className="p-6 border-b border-gray-700 flex justify-between items-center bg-gray-800 sticky top-0">
          <h2 className="text-xl font-bold text-white">Import Policies</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-white">
            <FaTimes size={20} />
          </button>
        </div>

        <div className="p-6 space-y-6">
            {!result ? (
                <>
                    <div className="border-2 border-dashed border-gray-600 rounded-xl p-8 text-center bg-gray-900/50 hover:bg-gray-900 transition">
                        <FaFileUpload className="mx-auto text-4xl text-gray-500 mb-4" />
                        <p className="text-gray-300 mb-2">Drag and drop your CSV file here</p>
                        <p className="text-sm text-gray-500 mb-4">Required Headers: Policy Number, Mobile, Expiry Date</p>
                        <input 
                            type="file" 
                            accept=".csv"
                            onChange={handleFileChange}
                            className="text-sm text-gray-400 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-600 file:text-white hover:file:bg-blue-700"
                        />
                    </div>

                    {error && (
                        <div className="p-4 bg-red-500/20 text-red-400 rounded-lg flex items-center gap-2">
                            <FaExclamationTriangle /> {error}
                        </div>
                    )}

                    {previewData.length > 0 && (
                        <div>
                            <div className="flex gap-4 mb-4 text-sm font-bold">
                                <span className="text-gray-400">Total: {stats.total}</span>
                                <span className="text-green-400">Ready: {stats.valid}</span>
                                <span className="text-yellow-400">Updates/Duplicates: {stats.duplicates}</span>
                                <span className="text-red-400">Errors: {stats.errors}</span>
                            </div>

                            <div className="overflow-x-auto max-h-60 border border-gray-700 rounded-lg">
                                <table className="w-full text-xs text-left text-gray-400">
                                    <thead className="bg-gray-900 text-gray-300 uppercase sticky top-0 z-10">
                                        <tr>
                                            <th className="px-3 py-2">Row</th>
                                            <th className="px-3 py-2">Customer</th>
                                            <th className="px-3 py-2">Policy No</th>
                                            <th className="px-3 py-2">Status</th>
                                            <th className="px-3 py-2">Reason</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-gray-700 bg-gray-800">
                                        {previewData.slice(0, 50).map((row, i) => (
                                            <tr key={i} className={row.status === 'Error' ? 'bg-red-900/10' : row.status === 'Duplicate' ? 'bg-yellow-900/10' : ''}>
                                                <td className="px-3 py-1 border-r border-gray-700">{row.row}</td>
                                                <td className="px-3 py-1">{row.customer}</td>
                                                <td className="px-3 py-1 font-mono">{row.policyNumber}</td>
                                                <td className="px-3 py-1">
                                                    <span className={`px-1 rounded ${row.status === 'Ready' ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'}`}>
                                                        {row.status}
                                                    </span>
                                                </td>
                                                <td className="px-3 py-1 text-gray-500">{row.reason}</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                                {previewData.length > 50 && <p className="text-center text-xs p-2 bg-gray-900 text-gray-500">Showing first 50 of {previewData.length} records...</p>}
                            </div>
                        </div>
                    )}

                    <div className="flex justify-end gap-3 pt-4 border-t border-gray-700">
                        <button onClick={onClose} className="px-4 py-2 text-gray-400 hover:text-white">Cancel</button>
                        {!isCommitReady ? (
                             <button 
                                onClick={handlePreview}
                                disabled={!file || uploading}
                                className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg font-bold flex items-center gap-2 disabled:opacity-50"
                            >
                                {uploading ? <FaSpinner className="animate-spin" /> : 'Analyze File'}
                            </button>
                        ) : (
                            <button 
                                onClick={handleCommit}
                                disabled={!isCommitReady || uploading}
                                className="bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded-lg font-bold flex items-center gap-2 disabled:opacity-50"
                            >
                                {uploading ? <FaSpinner className="animate-spin" /> : `Import ${stats.valid} Records`}
                            </button>
                        )}
                    </div>
                </>
            ) : (
                <div className="text-center py-8">
                    <FaCheckCircle className="mx-auto text-5xl text-green-500 mb-4" />
                    <h3 className="text-2xl font-bold text-white mb-2">Import Completed</h3>
                    <p className="text-gray-400 mb-6">
                        Successfully imported <span className="text-green-400 font-bold">{result.success}</span> records.
                        <br />
                        Failed: <span className="text-red-400 font-bold">{result.failed}</span>
                    </p>
                    
                    {result.errors.length > 0 && (
                        <div className="text-left bg-gray-900 p-4 rounded-lg max-h-60 overflow-y-auto mb-6 border border-gray-700">
                            <h4 className="font-bold text-red-400 mb-2 sticky top-0 bg-gray-900">Errors:</h4>
                            <ul className="list-disc list-inside text-sm text-gray-400 space-y-1">
                                {result.errors.map((e, i) => <li key={i}>{e}</li>)}
                            </ul>
                        </div>
                    )}

                    <button 
                        onClick={() => { onClose(); window.location.reload(); }}
                        className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-lg font-bold"
                    >
                        Done
                    </button>
                </div>
            )}
        </div>
      </div>
    </div>
  )
}
