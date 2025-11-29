'use client'
import React, { useState, useEffect } from 'react'
import axios from 'axios'
import API_URL from '../../../../config/api'
import { useRouter } from 'next/navigation'
import { FaYoutube, FaInstagram, FaLink } from 'react-icons/fa'

export default function AddVideoPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [listings, setListings] = useState([])
  
  const [formData, setFormData] = useState({
    title: '',
    videoUrl: '',
    linkedListing: ''
  })

  // Fetch listings for dropdown
  useEffect(() => {
    const fetchListings = async () => {
      try {
        const res = await axios.get(`${API_URL}/api/listings`)
        setListings(res.data)
      } catch (error) {
        console.error('Error fetching listings:', error)
      }
    }
    fetchListings()
  }, [])

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)

    try {
      await axios.post(`${API_URL}/api/videos`, formData, {
        withCredentials: true
      })
      alert('Video added successfully! 🎥')
      router.push('/admin/videos') 
      setFormData({ title: '', videoUrl: '', linkedListing: '' })
    } catch (error) {
      console.error('Error adding video:', error)
      alert('Failed to add video. Please check the URL and try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold text-white mb-8">Add Viral Video 🎥</h1>

      <form onSubmit={handleSubmit} className="space-y-6 bg-custom-jet p-8 rounded-2xl border border-white/10">
        
        {/* Title */}
        <div>
          <label className="block text-custom-platinum mb-2">Video Title</label>
          <input
            type="text"
            name="title"
            value={formData.title}
            onChange={handleInputChange}
            required
            className="w-full bg-black/50 border border-white/10 rounded-lg p-3 text-white focus:border-custom-accent outline-none"
            placeholder="e.g. Customer Delivery Celebration"
          />
        </div>

        {/* Video URL */}
        <div>
          <label className="block text-custom-platinum mb-2">Video Link (YouTube / Instagram)</label>
          <div className="relative">
            <FaLink className="absolute left-3 top-3.5 text-gray-400" />
            <input
              type="url"
              name="videoUrl"
              value={formData.videoUrl}
              onChange={handleInputChange}
              required
              className="w-full bg-black/50 border border-white/10 rounded-lg p-3 pl-10 text-white focus:border-custom-accent outline-none"
              placeholder="Paste YouTube or Instagram link here..."
            />
          </div>
          <p className="text-xs text-gray-500 mt-2 flex gap-2 items-center">
            Supported: <FaYoutube className="text-red-500" /> YouTube Shorts/Videos, <FaInstagram className="text-pink-500" /> Instagram Reels
          </p>
        </div>

        {/* Linked Listing */}
        <div>
          <label className="block text-custom-platinum mb-2">Link to Car (Optional)</label>
          <select
            name="linkedListing"
            value={formData.linkedListing}
            onChange={handleInputChange}
            className="w-full bg-black/50 border border-white/10 rounded-lg p-3 text-white focus:border-custom-accent outline-none"
          >
            <option value="">-- Select a Car to Sell --</option>
            {listings.map(car => (
              <option key={car._id} value={car._id}>
                {car.year} {car.brand} {car.model} - ₹{car.price}
              </option>
            ))}
          </select>
          <p className="text-xs text-custom-accent mt-1">
            If selected, a "Shop This Car" button will appear on the video! 🛍️
          </p>
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={loading}
          className={`w-full py-4 rounded-xl font-bold text-lg transition-all ${
            loading
              ? 'bg-gray-600 text-gray-400 cursor-not-allowed'
              : 'bg-custom-accent text-custom-black hover:bg-yellow-400 shadow-lg shadow-custom-accent/20'
          }`}
        >
          {loading ? 'Adding Video...' : 'Post Video 🚀'}
        </button>

      </form>
    </div>
  )
}
