'use client'
import React, { useState, useEffect } from 'react'
import axios from 'axios'
import API_URL from '../../config/api'
import Link from 'next/link'
import { FaPlus, FaTrash, FaYoutube, FaInstagram, FaExternalLinkAlt } from 'react-icons/fa'

export default function AdminVideosPage() {
  const [videos, setVideos] = useState([])
  const [loading, setLoading] = useState(true)

  const fetchVideos = async () => {
    try {
      const res = await axios.get(`${API_URL}/api/videos`)
      setVideos(res.data)
      setLoading(false)
    } catch (error) {
      console.error('Error fetching videos:', error)
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchVideos()
  }, [])

  const handleDelete = async (id) => {
    if (!confirm('Are you sure you want to delete this video?')) return

    try {
      await axios.delete(`${API_URL}/api/videos/${id}`, { withCredentials: true })
      setVideos(videos.filter(v => v._id !== id))
    } catch (error) {
      alert('Failed to delete video')
    }
  }

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-white">Viral Videos Manager 🎬</h1>
        <Link
          href="/admin/videos/add"
          className="bg-custom-accent text-custom-black px-6 py-3 rounded-full font-bold flex items-center gap-2 hover:bg-yellow-400 transition-all"
        >
          <FaPlus /> Add New Video
        </Link>
      </div>

      {loading ? (
        <div className="text-white text-center">Loading...</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {videos.map(video => (
            <div key={video._id} className="bg-custom-jet border border-white/10 rounded-xl overflow-hidden">
              <div className="p-4">
                <div className="flex items-center gap-2 mb-2 text-custom-platinum text-sm">
                  {video.platform === 'youtube' ? <FaYoutube className="text-red-500" /> : <FaInstagram className="text-pink-500" />}
                  <span className="capitalize">{video.platform}</span>
                </div>
                
                <h3 className="text-white font-bold text-lg mb-2 truncate">{video.title}</h3>
                
                <a 
                  href={video.videoUrl} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-custom-accent text-sm flex items-center gap-1 hover:underline mb-4"
                >
                  View Original <FaExternalLinkAlt size={12} />
                </a>

                {video.linkedListing ? (
                  <div className="bg-black/30 p-3 rounded-lg mb-4 border border-white/5">
                    <p className="text-xs text-gray-400">Linked Car:</p>
                    <p className="text-white font-semibold text-sm">
                      {video.linkedListing.year} {video.linkedListing.brand} {video.linkedListing.model}
                    </p>
                  </div>
                ) : (
                  <div className="bg-black/30 p-3 rounded-lg mb-4 border border-white/5">
                    <p className="text-xs text-gray-500 italic">No car linked</p>
                  </div>
                )}

                <button
                  onClick={() => handleDelete(video._id)}
                  className="w-full py-2 bg-red-500/10 text-red-500 rounded-lg hover:bg-red-500/20 transition-colors flex items-center justify-center gap-2"
                >
                  <FaTrash /> Delete Video
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
