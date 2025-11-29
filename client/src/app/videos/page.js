'use client'
import React, { useState, useEffect } from 'react'
import axios from 'axios'
import API_URL from '../config/api'
import VideoCard from '../components/VideoCard'
import { FaYoutube, FaInstagram, FaPlayCircle } from 'react-icons/fa'
import { motion } from 'framer-motion'

export default function VideosPage() {
  const [videos, setVideos] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchVideos = async () => {
      try {
        const res = await axios.get(`${API_URL}/api/videos`)
        setVideos(res.data)
      } catch (error) {
        console.error('Error fetching videos:', error)
      } finally {
        setLoading(false)
      }
    }
    fetchVideos()
  }, [])

  // Animation Variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  }

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        type: 'spring',
        stiffness: 100
      }
    }
  }

  return (
    <div className="min-h-screen bg-custom-black selection:bg-custom-accent selection:text-custom-black">
      {/* Hero Section with Animated Background */}
      <section className="relative py-24 overflow-hidden">
        {/* Background Elements */}
        <div className="absolute top-0 left-0 w-full h-full overflow-hidden z-0">
          <div className="absolute -top-[20%] -left-[10%] w-[50%] h-[50%] bg-custom-accent/10 rounded-full blur-[120px] animate-pulse"></div>
          <div className="absolute top-[40%] -right-[10%] w-[40%] h-[40%] bg-purple-500/10 rounded-full blur-[120px] animate-pulse delay-1000"></div>
        </div>

        <div className="container mx-auto px-4 text-center relative z-10">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <h1 className="font-display font-bold text-5xl md:text-7xl text-white mb-6 tracking-tight">
              Poddar Motors <span className="text-transparent bg-clip-text bg-gradient-to-r from-custom-accent to-yellow-200">TV</span>
            </h1>
            <p className="text-xl text-custom-platinum mb-10 max-w-2xl mx-auto leading-relaxed">
              Experience the thrill of our cars through short, engaging stories. 
              Watch reviews, deliveries, and viral moments.
            </p>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2, duration: 0.5 }}
            className="flex flex-wrap justify-center gap-4"
          >
            <a href="https://youtube.com/@poddarmotors" target="_blank" className="group flex items-center gap-3 px-8 py-3 bg-white/5 backdrop-blur-md border border-white/10 text-white rounded-full hover:bg-red-600 hover:border-red-600 transition-all duration-300">
              <FaYoutube className="text-xl text-red-500 group-hover:text-white transition-colors" /> 
              <span className="font-semibold">Subscribe</span>
            </a>
            <a href="https://instagram.com/poddarmotors" target="_blank" className="group flex items-center gap-3 px-8 py-3 bg-white/5 backdrop-blur-md border border-white/10 text-white rounded-full hover:bg-pink-600 hover:border-pink-600 transition-all duration-300">
              <FaInstagram className="text-xl text-pink-500 group-hover:text-white transition-colors" /> 
              <span className="font-semibold">Follow</span>
            </a>
          </motion.div>
        </div>
      </section>

      {/* Video Feed - Masonry Layout */}
      <section className="pb-20 px-4">
        <div className="container mx-auto">
          {loading ? (
            <div className="flex flex-col items-center justify-center py-20">
              <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-custom-accent mb-4"></div>
              <p className="text-custom-platinum animate-pulse">Loading viral content...</p>
            </div>
          ) : videos.length > 0 ? (
            <motion.div 
              variants={containerVariants}
              initial="hidden"
              animate="visible"
              className="columns-1 md:columns-2 lg:columns-3 xl:columns-4 gap-6 space-y-6"
            >
              {videos.map(video => (
                <motion.div key={video._id} variants={itemVariants} className="break-inside-avoid">
                  <VideoCard video={video} />
                </motion.div>
              ))}
            </motion.div>
          ) : (
            <div className="text-center py-20 bg-white/5 rounded-3xl border border-white/10 backdrop-blur-sm">
              <FaPlayCircle className="text-6xl text-white/20 mx-auto mb-4" />
              <p className="text-custom-platinum text-xl font-light">No videos uploaded yet.</p>
              <p className="text-gray-500 mt-2">Check back soon for fresh content!</p>
            </div>
          )}
        </div>
      </section>
    </div>
  )
}
