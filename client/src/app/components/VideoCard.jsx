'use client'
import React from 'react'
import Link from 'next/link'
import { FaShoppingBag, FaExternalLinkAlt } from 'react-icons/fa'
import { motion } from 'framer-motion'

export default function VideoCard({ video }) {
  const { platform, videoId, title, linkedListing } = video

  return (
    <motion.div 
      whileHover={{ y: -5 }}
      className="bg-custom-jet/50 backdrop-blur-sm rounded-2xl md:rounded-3xl overflow-hidden border border-white/5 hover:border-custom-accent/30 transition-all group shadow-xl hover:shadow-custom-accent/10"
    >
      {/* Video Container */}
      <div className="relative aspect-[9/16] bg-black">
        {platform === 'youtube' ? (
          <iframe
            className="w-full h-full"
            src={`https://www.youtube.com/embed/${videoId}?rel=0&modestbranding=1&playsinline=1`}
            title={title}
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          ></iframe>
        ) : platform === 'instagram' ? (
          <iframe 
            className="w-full h-full"
            src={`https://www.instagram.com/reel/${videoId}/embed`}
            allowTransparency="true"
            allowFullScreen
          ></iframe>
        ) : (
          <div className="flex items-center justify-center h-full text-gray-500">
            Unsupported Platform
          </div>
        )}
        
        {/* Overlay Gradient (Subtle) */}
        <div className="absolute inset-0 pointer-events-none bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-60"></div>
      </div>

      {/* Content */}
      <div className="p-4 md:p-5 relative">
        <h3 className="font-bold text-white text-base md:text-lg mb-2 md:mb-3 line-clamp-2 leading-snug group-hover:text-custom-accent transition-colors">
          {title}
        </h3>
        
        {linkedListing ? (
          <div className="mt-2 pt-3 md:pt-4 border-t border-white/10">
            <div className="flex items-center gap-2 md:gap-3 mb-3 md:mb-4">
              <div className="w-10 h-10 md:w-12 md:h-12 rounded-lg md:rounded-xl overflow-hidden border border-white/20 flex-shrink-0">
                <img 
                  src={linkedListing.images?.[0]} 
                  alt={linkedListing.model}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-white font-bold text-sm truncate">{linkedListing.year} {linkedListing.model}</p>
                <p className="text-custom-accent text-xs font-bold">₹{linkedListing.price.toLocaleString()}</p>
              </div>
            </div>
            
            <Link 
              href={`/buy/${linkedListing.slug || linkedListing._id}`}
              className="w-full py-3 md:py-3 bg-custom-accent text-custom-black font-bold rounded-xl flex items-center justify-center gap-2 hover:bg-yellow-400 transition-all shadow-lg shadow-custom-accent/20 group-hover:scale-[1.02] text-sm md:text-base"
            >
              <FaShoppingBag /> Shop This Car
            </Link>
          </div>
        ) : (
          <div className="mt-2 pt-3 md:pt-4 border-t border-white/10">
             <Link 
              href="/buy"
              className="w-full py-3 bg-white/5 text-white font-semibold rounded-xl flex items-center justify-center gap-2 hover:bg-white/10 transition-all border border-white/10 text-sm md:text-base"
            >
              <FaExternalLinkAlt size={12} /> Browse Inventory
            </Link>
          </div>
        )}
      </div>
    </motion.div>
  )
}
