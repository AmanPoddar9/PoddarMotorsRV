'use client'

import { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000'

export default function TemplateEditorPage() {
  const router = useRouter()
  const { id } = useParams()
  const isNew = id === 'create'
  
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    isDefault: false,
    categories: [], // Implementation for later
    photoRequirements: []
  })
  
  const [loading, setLoading] = useState(!isNew)
  const [saving, setSaving] = useState(false)

  // Fetch template if editing
  useEffect(() => {
    if (!isNew) {
      fetchTemplate()
    } else {
      // Initialize with some default value? Or empty.
      setLoading(false)
    }
  }, [id])

  const fetchTemplate = async () => {
    try {
      const res = await fetch(`${API_BASE_URL}/api/templates/${id}`)
      if (!res.ok) throw new Error('Failed to load template')
      const data = await res.json()
      setFormData(data)
    } catch (error) {
      alert(error.message)
      router.push('/admin/templates')
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setSaving(true)
    
    try {
      const url = isNew 
        ? `${API_BASE_URL}/api/templates` 
        : `${API_BASE_URL}/api/templates/${id}`
        
      const method = isNew ? 'POST' : 'PUT'
      
      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      })
      
      if (!res.ok) {
        const err = await res.json()
        throw new Error(err.message || 'Failed to save')
      }
      
      router.push('/admin/templates')
    } catch (error) {
      alert(error.message)
    } finally {
      setSaving(false)
    }
  }

  // --- Photo Manager Helpers ---

  const addPhoto = () => {
    setFormData(prev => ({
      ...prev,
      photoRequirements: [
        ...prev.photoRequirements,
        { 
          key: `custom_${Date.now()}`, 
          label: 'New Photo Requirement', 
          required: true,
          category: 'General',
          minCount: 1,
          maxCount: 1
        }
      ]
    }))
  }

  const removePhoto = (idx) => {
    if (!confirm('Remove this photo requirement?')) return
    setFormData(prev => ({
      ...prev,
      photoRequirements: prev.photoRequirements.filter((_, i) => i !== idx)
    }))
  }

  const updatePhoto = (idx, field, value) => {
    const newPhotos = [...formData.photoRequirements]
    newPhotos[idx] = { ...newPhotos[idx], [field]: value }
    
    // Auto-update key if label changes (optional, but helpful)
    if (field === 'label' && newPhotos[idx].key.startsWith('custom_')) {
      // Keep custom prefix but make it readable? 
      // Actually keeping a stable key is better. 
      // Only user explicitly editing key should change it.
    }
    
    setFormData(prev => ({ ...prev, photoRequirements: newPhotos }))
  }

  if (loading) return <div className="p-10 text-white">Loading...</div>

  return (
    <div className="min-h-screen bg-gray-900 text-white p-6 md:p-10">
      <div className="max-w-4xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">{isNew ? 'Create Template' : 'Edit Template'}</h1>
          <button
            type="button"
            onClick={() => router.push('/admin/templates')}
            className="text-gray-400 hover:text-white"
          >
            Cancel
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-8">
          {/* General Info */}
          <div className="bg-gray-800 p-6 rounded-lg border border-gray-700 space-y-4">
            <h2 className="text-xl font-semibold mb-4">General Information</h2>
            
            <div>
              <label className="block text-sm font-medium text-gray-400 mb-1">Template Name</label>
              <input
                type="text"
                required
                value={formData.name}
                onChange={e => setFormData({...formData, name: e.target.value})}
                className="w-full bg-gray-700 border border-gray-600 rounded px-4 py-2 text-white focus:border-blue-500 outline-none"
                placeholder="e.g. Standard Car Inspection"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-400 mb-1">Description</label>
              <textarea
                value={formData.description}
                onChange={e => setFormData({...formData, description: e.target.value})}
                className="w-full bg-gray-700 border border-gray-600 rounded px-4 py-2 text-white focus:border-blue-500 outline-none h-24"
                placeholder="Describe this template..."
              />
            </div>
            
            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                id="isDefault"
                checked={formData.isDefault}
                onChange={e => setFormData({...formData, isDefault: e.target.checked})}
                className="w-4 h-4 rounded bg-gray-700 border-gray-600 text-blue-600"
              />
              <label htmlFor="isDefault" className="text-sm font-medium text-gray-300">
                Set as Default Template
              </label>
            </div>
          </div>

          {/* Photo Requirements Manager */}
          <div className="bg-gray-800 p-6 rounded-lg border border-gray-700">
            <div className="flex justify-between items-center mb-6">
              <div>
                <h2 className="text-xl font-semibold">Photo Requirements</h2>
                <p className="text-sm text-gray-400">Define which photos are required for this inspection.</p>
              </div>
              <button
                type="button"
                onClick={addPhoto}
                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded text-sm font-semibold"
              >
                + Add Photo Slot
              </button>
            </div>

            <div className="space-y-3">
              {formData.photoRequirements.length === 0 && (
                <div className="text-center py-8 text-gray-500 border border-dashed border-gray-700 rounded">
                  No photos defined. Add one to get started.
                </div>
              )}
              
              {formData.photoRequirements.map((photo, idx) => (
                <div key={idx} className="bg-gray-700/50 p-4 rounded border border-gray-700 flex gap-4 items-start">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 flex-1">
                    <div>
                      <label className="block text-xs text-gray-400 mb-1">Label</label>
                      <input
                        type="text"
                        value={photo.label}
                        onChange={e => updatePhoto(idx, 'label', e.target.value)}
                        className="w-full bg-gray-800 border border-gray-600 rounded px-3 py-1.5 text-sm"
                        placeholder="e.g. Front View"
                      />
                    </div>
                    <div>
                      <label className="block text-xs text-gray-400 mb-1">Database Key (Unique)</label>
                      <input
                        type="text"
                        value={photo.key}
                        onChange={e => updatePhoto(idx, 'key', e.target.value)}
                        className="w-full bg-gray-800 border border-gray-600 rounded px-3 py-1.5 text-sm font-mono text-yellow-500"
                        placeholder="e.g. frontView"
                      />
                    </div>
                    <div className="flex gap-4">
                      <div className="flex-1">
                        <label className="block text-xs text-gray-400 mb-1">Category</label>
                        <select
                           value={photo.category}
                           onChange={e => updatePhoto(idx, 'category', e.target.value)}
                           className="w-full bg-gray-800 border border-gray-600 rounded px-3 py-1.5 text-sm"
                        >
                          <option value="General">General</option>
                          <option value="Exterior">Exterior</option>
                          <option value="Interior">Interior</option>
                          <option value="Engine">Engine</option>
                          <option value="Tyres">Tyres</option>
                          <option value="Undercarriage">Undercarriage</option>
                          <option value="Documents">Documents</option>
                          <option value="Damages">Damages</option>
                        </select>
                      </div>
                      <div className="flex items-center pt-6">
                        <input
                          type="checkbox"
                          checked={photo.required}
                          onChange={e => updatePhoto(idx, 'required', e.target.checked)}
                          className="mr-2"
                        />
                        <span className="text-sm">Required</span>
                      </div>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => removePhoto(idx)}
                    className="text-red-400 hover:text-red-300 p-2 hover:bg-gray-700 rounded"
                    title="Remove"
                  >
                    ✕
                  </button>
                </div>
              ))}
            </div>
          </div>

          <div className="flex justify-end gap-4 pt-4 border-t border-gray-700">
            <button
              type="button"
              onClick={() => router.push('/admin/templates')}
              className="px-6 py-3 rounded-lg text-gray-300 hover:bg-gray-800"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={saving}
              className="bg-green-600 hover:bg-green-700 text-white px-8 py-3 rounded-lg font-bold disabled:opacity-50"
            >
              {saving ? 'Saving...' : 'Save Template'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
