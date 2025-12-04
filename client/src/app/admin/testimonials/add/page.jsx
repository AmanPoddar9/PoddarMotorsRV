'use client'
import React, { useState } from 'react'
import axios from 'axios'
import API_URL from '../../../config/api'
import { useRouter } from 'next/navigation'
import { FaCloudUploadAlt, FaStar } from 'react-icons/fa'

export default function AddTestimonialPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [uploading, setUploading] = useState(false)
  
  const [formData, setFormData] = useState({
    name: '',
    location: 'Ranchi',
    carModel: '',
    rating: 5,
    text: '',
    type: 'photo',
    mediaUrl: '',
    thumbnailUrl: '',
    isFeatured: false
  })

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }))
  }

  const handleFileUpload = async (e) => {
    const file = e.target.files[0]
    if (!file) return

    setUploading(true)
    const uploadData = new FormData()
    uploadData.append('image', file)
    
    // Determine if video or image
    const isVideo = file.type.startsWith('video/')
    setFormData(prev => ({ ...prev, type: isVideo ? 'video' : 'photo' }))

    try {
      const res = await axios.post(`${API_URL}/api/upload/single`, uploadData, {
        headers: { 'Content-Type': 'multipart/form-data' },
        withCredentials: true
      })
      
      setFormData(prev => ({
        ...prev,
        mediaUrl: res.data.url
      }))
    } catch (error) {
      console.error('Upload failed:', error)
      const errorMessage = error.response?.data?.error || 'File upload failed. Please try again.'
      alert(errorMessage)
    } finally {
      setUploading(false)
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)

    try {
      await axios.post(`${API_URL}/api/testimonials`, formData, {
        withCredentials: true
      })
      alert('Success Story added successfully! 🎉')
      router.push('/admin/testimonials') // Assuming we'll make a list page later, or just redirect to add again
      // For now, let's just reset form or redirect to home
      setFormData({
        name: '',
        location: 'Ranchi',
        carModel: '',
        rating: 5,
        text: '',
        type: 'photo',
        mediaUrl: '',
        thumbnailUrl: '',
        isFeatured: false
      })
    } catch (error) {
      console.error('Error adding testimonial:', error)
      const errorMessage = error.response?.data?.error || error.response?.data?.message || 'Failed to add story. Please try again.'
      alert(errorMessage)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold text-white mb-8">Add New Success Story 🌟</h1>

      <form onSubmit={handleSubmit} className="space-y-6 bg-custom-jet p-8 rounded-2xl border border-white/10">
        
        {/* Name & Location */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-custom-platinum mb-2">Customer Name</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              required
              className="w-full bg-black/50 border border-white/10 rounded-lg p-3 text-white focus:border-custom-accent outline-none"
              placeholder="e.g. Rahul Sharma"
            />
          </div>
          <div>
            <label className="block text-custom-platinum mb-2">Location</label>
            <input
              type="text"
              name="location"
              value={formData.location}
              onChange={handleInputChange}
              className="w-full bg-black/50 border border-white/10 rounded-lg p-3 text-white focus:border-custom-accent outline-none"
              placeholder="e.g. Ranchi"
            />
          </div>
        </div>

        {/* Car Model & Rating */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-custom-platinum mb-2">Car Model Purchased</label>
            <input
              type="text"
              name="carModel"
              value={formData.carModel}
              onChange={handleInputChange}
              required
              className="w-full bg-black/50 border border-white/10 rounded-lg p-3 text-white focus:border-custom-accent outline-none"
              placeholder="e.g. Swift, Creta, City"
            />
            <p className="text-xs text-gray-500 mt-1">Used for filtering on the website. Keep it simple (e.g. "Swift" not "Maruti Swift VXI").</p>
          </div>
          <div>
            <label className="block text-custom-platinum mb-2">Rating</label>
            <div className="flex gap-4 items-center h-[50px]">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  type="button"
                  onClick={() => setFormData(prev => ({ ...prev, rating: star }))}
                  className={`text-2xl transition-colors ${
                    star <= formData.rating ? 'text-yellow-400' : 'text-gray-600'
                  }`}
                >
                  <FaStar />
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Review Text */}
        <div>
          <label className="block text-custom-platinum mb-2">Customer Review</label>
          <textarea
            name="text"
            value={formData.text}
            onChange={handleInputChange}
            required
            rows="4"
            className="w-full bg-black/50 border border-white/10 rounded-lg p-3 text-white focus:border-custom-accent outline-none"
            placeholder="What did they say about their experience?"
          ></textarea>
        </div>

        {/* Media Upload */}
        <div>
          <label className="block text-custom-platinum mb-2">Upload Photo or Video</label>
          <div className="border-2 border-dashed border-white/20 rounded-xl p-8 text-center hover:border-custom-accent/50 transition-colors relative">
            <input
              type="file"
              onChange={handleFileUpload}
              accept="image/*,video/*"
              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
            />
            {uploading ? (
              <div className="text-custom-accent">Uploading... Please wait...</div>
            ) : formData.mediaUrl ? (
              <div className="relative h-48 w-full max-w-md mx-auto">
                {formData.type === 'video' ? (
                  <video src={formData.mediaUrl} className="w-full h-full object-cover rounded-lg" controls />
                ) : (
                  <img src={formData.mediaUrl} alt="Preview" className="w-full h-full object-cover rounded-lg" />
                )}
                <p className="text-sm text-green-400 mt-2">File uploaded successfully! Click to change.</p>
              </div>
            ) : (
              <div className="text-gray-400">
                <FaCloudUploadAlt className="mx-auto text-4xl mb-2" />
                <p>Click or drag to upload photo/video</p>
              </div>
            )}
          </div>
        </div>

        {/* Featured Checkbox */}
        <div className="flex items-center gap-3">
          <input
            type="checkbox"
            name="isFeatured"
            checked={formData.isFeatured}
            onChange={handleInputChange}
            id="featured"
            className="w-5 h-5 rounded border-gray-600 text-custom-accent focus:ring-custom-accent bg-gray-700"
          />
          <label htmlFor="featured" className="text-white">Feature on Homepage (Coming Soon)</label>
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={loading || uploading}
          className={`w-full py-4 rounded-xl font-bold text-lg transition-all ${
            loading || uploading
              ? 'bg-gray-600 text-gray-400 cursor-not-allowed'
              : 'bg-custom-accent text-custom-black hover:bg-yellow-400 shadow-lg shadow-custom-accent/20'
          }`}
        >
          {loading ? 'Saving...' : 'Publish Success Story ✨'}
        </button>

      </form>
    </div>
  )
}
