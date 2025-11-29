import Head from 'next/head'
      description: 'Second hand Sedans for sale in Ranchi.',
    },
    {
      id: 'dNMn37Ct0OE', // Replace with actual video ID
      title:
        'Customer से कार खरीदने से पहले ऐसे होता है, 242 points quality Check!',
      description:
        'जब आप Real Value से अपनी कार खरीदते हैं, तो आपको सिर्फ एक प्री-ओन्ड कार नहीं मिलती, बल्कि एक सख्त गुणवत्ता जांच से गुजर चुकी कार मिलती है। हम हर कार पर 242 पॉइंट्स क्वालिटी चेक करते हैं ताकि आप पूरी शांति और भरोसे के साथ ड्राइव कर सकें। इंजन से लेकर ब्रेक्स, सस्पेंशन से लेकर इंटीरियर तक, हर छोटे-बड़े पहलू की जाँच की जाती है ताकि आपकी कार हर तरह से Perfect हो।',
    },
    {
      id: 'kOxavW5GrfA', // Replace with actual video ID
      title:
        'Second-Hand Mahindra Bolero for Sale in Ranchi | Best Prices & Financing Options',
      description:
        'Second hand Mahindra Bolero Stock available for sale at real value ranchi jharkhand. Best dealership in jharkhand for used pre owned cars.🚗Why Choose Real Value? Leading and oldest Second-hand car dealer in Jharkhand 0% Down payment Finance Facility (https://www.poddarmotors.com/finance) 🚘More than 100+ Used cars used cars at one place. From Budget Friendly to Luxury second hand used cars available as per requirement and budget. Visit-- https://www.poddarmotors.com/buy ',
    },
    {
      id: 'j6SlTQNeRes', // Replace with actual video ID
      title:
        'Maruti Suzuki Celerio at Real Value! Explore Affordable Second-Hand Cars in Jharkhand',
      description:
```javascript
'use client'
import React, { useState, useEffect } from 'react'
import axios from 'axios'
import API_URL from '../../config/api'
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
      {/* Embed Instagram Reel */}
      <div className="mt-12 max-w-7xl mx-auto">
        <h2 className="text-2xl md:text-3xl font-display font-bold mb-4 text-center text-white">
          Featured <span className="text-custom-accent">Instagram Reel</span>
        </h2>
        <blockquote
          className="instagram-media"
          data-instgrm-captioned
          data-instgrm-permalink="https://www.instagram.com/reel/C_niAI_tvZQ/?utm_source=ig_embed&amp;utm_campaign=loading"
          data-instgrm-version="14"
        >
          <div style={{ padding: '16px' }}>
            <a
              href="https://www.instagram.com/reel/C_niAI_tvZQ/?utm_source=ig_embed&amp;utm_campaign=loading"
              style={{
                background: '#FFFFFF',
                lineHeight: '0',
                padding: '0',
                textAlign: 'center',
                textDecoration: 'none',
                width: '100%',
              }}
              target="_blank"
              rel="noreferrer"
            >
              <div className="border border-gray-200 rounded-lg p-4">
                <div
                  style={{
                    display: 'flex',
                    flexDirection: 'row',
                    alignItems: 'center',
                  }}
                >
                  <div className="bg-gray-200 rounded-full flex-grow-0 h-10 w-10 mr-2"></div>
                  <div className="flex flex-col flex-grow-1 justify-center">
                    <div className="bg-gray-200 rounded h-3 mb-1 w-24"></div>
                    <div className="bg-gray-200 rounded h-3 w-16"></div>
                  </div>
                </div>
                <div style={{ padding: '19% 0' }}></div>
                <div className="flex justify-center items-center mb-3">
                  <svg
                    width="50px"
                    height="50px"
                    viewBox="0 0 60 60"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <g
                      stroke="none"
                      strokeWidth="1"
                      fill="none"
                      fillRule="evenodd"
                    >
                      <g
                        transform="translate(-511.000000, -20.000000)"
                        fill="#000000"
                      >
                        <g>
                          <path d="M556.869,30.41 C554.814,30.41 553.148,32.076 553.148,34.131 C553.148,36.186 554.814,37.852 556.869,37.852 C558.924,37.852 560.59,36.186 560.59,34.131 C560.59,32.076 558.924,30.41 556.869,30.41 M541,60.657 C535.114,60.657 530.342,55.887 530.342,50 C530.342,44.114 535.114,39.342 541,39.342 C546.887,39.342 551.658,44.114 551.658,50 C551.658,55.887 546.887,60.657 541,60.657 M541,33.886 C532.1,33.886 524.886,41.1 524.886,50 C524.886,58.899 532.1,66.113 541,66.113 C549.9,66.113 557.115,58.899 557.115,50 C557.115,41.1 549.9,33.886 541,33.886 M565.378,62.101 C565.244,65.022 564.756,66.606 564.346,67.663 C563.803,69.06 563.154,70.057 562.106,71.106 C561.058,72.155 560.06,72.803 558.662,73.347 C557.607,73.757 556.021,74.244 553.102,74.378 C549.944,74.521 548.997,74.552 541,74.552 C533.003,74.552 532.056,74.521 528.898,74.378 C525.979,74.244 524.393,73.757 523.338,73.347 C521.94,72.803 520.942,72.155 519.894,71.106 C518.846,70.057 518.197,69.06 517.654,67.663 C517.244,66.606 516.755,65.022 516.623,62.101 C516.479,58.943 516.448,57.996 516.448,50 C516.448,42.003 516.479,41.056 516.623,37.899 C516.755,34.978 517.244,33.391 517.654,32.338 C518.197,30.938 518.846,29.942 519.894,28.894 C520.942,27.846 521.94,27.196 523.338,26.654 C524.393,26.244 525.979,25.756 528.898,25.623 C532.057,25.479 533.004,25.448 541,25.448 C548.997,25.448 549.943,25.479 553.102,25.623 C556.021,25.756 557.607,26.244 558.662,26.654 C560.06,27.196 561.058,27.846 562.106,28.894 C563.154,29.942 563.803,30.938 564.346,32.338 C564.756,33.391 565.244,34.978 565.378,37.899 C565.522,41.056 565.552,42.003 565.552,50 C565.552,57.996 565.522,58.943 565.378,62.101 Z" />
                        </g>
                      </g>
                    </g>
                  </svg>
                </div>
              </div>
            </a>
          </div>
        </blockquote>
        <script async src="//www.instagram.com/embed.js"></script>{' '}
      </div>
    </div>
  )
}

export default Videos
