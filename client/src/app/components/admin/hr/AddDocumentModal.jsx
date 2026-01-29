'use client'

import { useState } from 'react'
import axios from 'axios'
import { FiX, FiUpload } from 'react-icons/fi'
import { motion } from 'framer-motion'
import API_URL from '../../../config/api'

const AddDocumentModal = ({ employeeId, onClose, onSuccess }) => {
  const [formData, setFormData] = useState({
    title: '',
    url: ''
  })
  const [file, setFile] = useState(null)
  const [uploading, setUploading] = useState(false)
  const [error, setError] = useState(null)

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0]
    if (!selectedFile) return

    // Check file size (5MB = 5 * 1024 * 1024 bytes)
    const maxSize = 5 * 1024 * 1024
    if (selectedFile.size > maxSize) {
      setError('File size must be less than 5MB')
      e.target.value = '' // Clear the input
      return
    }

    setFile(selectedFile)
    setError(null) // Clear any previous errors
  }

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  const uploadToS3 = async () => {
    if (!file) return null

    const fileFormData = new FormData()
    fileFormData.append('file', file)
    fileFormData.append('folder', 'employee-documents')

    try {
      const uploadRes = await axios.post(`${API_URL}/api/upload/documents`, fileFormData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      })
      return uploadRes.data.url
    } catch (err) {
      throw new Error('File upload failed')
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setUploading(true)
    setError(null)

    try {
      let documentUrl = formData.url

      // If file is selected, upload it first
      if (file) {
        documentUrl = await uploadToS3()
      }

      if (!documentUrl) {
        throw new Error('Please provide a document URL or upload a file')
      }

      await axios.post(`${API_URL}/api/employees/${employeeId}/documents`, {
        title: formData.title,
        url: documentUrl
      })

      onSuccess()
    } catch (err) {
      console.error('Error adding document:', err)
      setError(err.response?.data?.message || err.message || 'Failed to add document')
    } finally {
      setUploading(false)
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-custom-jet border border-white/10 w-full max-w-md rounded-2xl overflow-hidden shadow-2xl"
      >
        <div className="flex justify-between items-center p-6 border-b border-white/10">
          <h2 className="text-xl font-bold text-white">Upload Document</h2>
          <button onClick={onClose} className="p-2 hover:bg-white/10 rounded-lg text-gray-400 hover:text-white transition-colors">
            <FiX size={24} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {error && (
            <div className="bg-red-500/10 border border-red-500/20 text-red-400 p-4 rounded-xl text-sm">
              {error}
            </div>
          )}

          <div className="space-y-2">
            <label className="text-sm text-gray-400">Document Title *</label>
            <input 
              required 
              name="title" 
              value={formData.title} 
              onChange={handleChange} 
              className="w-full bg-black/50 border border-white/10 rounded-lg p-3 text-white focus:border-custom-accent outline-none" 
              placeholder="e.g., Aadhar Card, PAN Card, Employment Contract"
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm text-gray-400">Upload File</label>
            <div className="relative">
              <input 
                type="file" 
                onChange={handleFileChange}
                accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
                className="w-full bg-black/50 border border-white/10 rounded-lg p-3 text-white focus:border-custom-accent outline-none file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:bg-custom-accent file:text-black file:font-medium hover:file:bg-custom-accent/80"
              />
            </div>
            <p className="text-xs text-gray-500">Max 5MB. Or provide URL below (if already uploaded)</p>
          </div>

          <div className="space-y-2">
            <label className="text-sm text-gray-400">Document URL (Optional)</label>
            <input 
              name="url" 
              type="url"
              value={formData.url} 
              onChange={handleChange} 
              className="w-full bg-black/50 border border-white/10 rounded-lg p-3 text-white focus:border-custom-accent outline-none" 
              placeholder="https://..."
            />
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t border-white/10">
            <button type="button" onClick={onClose} className="px-6 py-2 rounded-lg text-gray-400 hover:text-white hover:bg-white/10 transition-colors">
              Cancel
            </button>
            <button type="submit" disabled={uploading} className="bg-custom-accent text-black px-6 py-2 rounded-lg font-bold hover:bg-custom-accent/80 transition-colors disabled:opacity-50 flex items-center gap-2">
              {uploading ? (
                <>Uploading...</>
              ) : (
                <>
                  <FiUpload /> Add Document
                </>
              )}
            </button>
          </div>
        </form>
      </motion.div>
    </div>
  )
}

export default AddDocumentModal
