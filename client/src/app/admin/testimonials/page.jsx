'use client'
import { useState, useEffect } from 'react'
import axios from 'axios'
import API_URL from '../../config/api'
import Link from 'next/link'
import { FaPlus, FaTrash, FaStar, FaImage, FaVideo } from 'react-icons/fa'

const SuccessStoriesManage = () => {
  const [testimonials, setTestimonials] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchTestimonials()
  }, [])

  const fetchTestimonials = async () => {
    try {
      const response = await axios.get(`${API_URL}/api/testimonials`)
      setTestimonials(response.data.data || [])
    } catch (error) {
      console.error('Error fetching testimonials:', error)
      setTestimonials([])
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (id) => {
    if (!confirm('Are you sure you want to delete this success story?')) return
    
    try {
      await axios.delete(`${API_URL}/api/testimonials/${id}`, {
        withCredentials: true
      })
      alert('Success story deleted!')
      fetchTestimonials()
    } catch (error) {
      console.error('Error deleting testimonial:', error)
      alert('Failed to delete story')
    }
  }

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-white">Success Stories 🌟</h1>
        <Link 
          href="/admin/testimonials/add"
          className="flex items-center gap-2 bg-custom-accent text-custom-black font-bold px-6 py-3 rounded-xl hover:bg-yellow-400 transition-all"
        >
          <FaPlus /> Add New Story
        </Link>
      </div>

      {loading ? (
        <div className="text-center py-20">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-custom-accent mx-auto"></div>
        </div>
      ) : testimonials.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {testimonials.map((story) => (
            <div 
              key={story._id}
              className="bg-custom-jet border border-white/10 rounded-2xl p-6 hover:border-custom-accent/30 transition-all"
            >
              {/* Media Preview */}
              {story.mediaUrl && (
                <div className="relative aspect-video bg-black rounded-xl overflow-hidden mb-4">
                  {story.type === 'video' ? (
                    <div className="flex items-center justify-center h-full">
                      <FaVideo className="text-4xl text-custom-accent" />
                    </div>
                  ) : (
                    <img 
                      src={story.mediaUrl} 
                      alt={story.name}
                      className="w-full h-full object-cover"
                    />
                  )}
                </div>
              )}

              {/* Customer Info */}
              <div className="mb-4">
                <h3 className="text-white font-bold text-lg">{story.name}</h3>
                <p className="text-custom-platinum text-sm">{story.location}</p>
                <p className="text-custom-accent text-sm font-semibold mt-1">{story.carModel}</p>
              </div>

              {/* Rating */}
              <div className="flex items-center gap-1 mb-3">
                {[...Array(5)].map((_, i) => (
                  <FaStar 
                    key={i} 
                    className={i < story.rating ? 'text-custom-accent' : 'text-gray-600'} 
                  />
                ))}
              </div>

              {/* Review Text */}
              <p className="text-custom-platinum text-sm line-clamp-3 mb-4">
                {story.text}
              </p>

              {/* Featured Badge */}
              {story.isFeatured && (
                <span className="inline-block bg-custom-accent/20 text-custom-accent text-xs font-bold px-3 py-1 rounded-full mb-4">
                  Featured
                </span>
              )}

              {/* Actions */}
              <div className="flex gap-2 mt-4">
                <button
                  onClick={() => handleDelete(story._id)}
                  className="flex-1 bg-red-600/20 text-red-500 font-semibold py-2 px-4 rounded-lg hover:bg-red-600/30 transition-all flex items-center justify-center gap-2"
                >
                  <FaTrash /> Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-20 bg-white/5 rounded-3xl border border-white/10">
          <p className="text-custom-platinum text-xl mb-4">No success stories yet</p>
          <Link 
            href="/admin/testimonials/add"
            className="inline-flex items-center gap-2 bg-custom-accent text-custom-black font-bold px-6 py-3 rounded-xl hover:bg-yellow-400 transition-all"
          >
            <FaPlus /> Add Your First Story
          </Link>
        </div>
      )}
    </div>
  )
}

export default SuccessStoriesManage
