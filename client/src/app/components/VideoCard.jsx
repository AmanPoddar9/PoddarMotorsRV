'use client'
import React from 'react'
import Link from 'next/link'
import { FaPlay, FaShoppingBag } from 'react-icons/fa'

export default function VideoCard({ video }) {
  const { platform, videoId, title, linkedListing } = video

  return (
    <div className="bg-custom-jet rounded-2xl overflow-hidden border border-white/10 hover:border-custom-accent/50 transition-all group h-full flex flex-col">
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
      </div>

      {/* Content */}
      <div className="p-4 flex-1 flex flex-col">
        <h3 className="font-bold text-white text-lg mb-2 line-clamp-2">{title}</h3>
        
        {linkedListing ? (
          <div className="mt-auto pt-4 border-t border-white/10">
            <div className="flex items-center gap-3 mb-3">
              <img 
                src={linkedListing.images?.[0]} 
                alt={linkedListing.model}
                className="w-12 h-12 rounded-lg object-cover border border-white/20"
              />
              <div>
                <p className="text-white font-bold text-sm">{linkedListing.year} {linkedListing.model}</p>
                <p className="text-custom-accent text-xs font-bold">₹{linkedListing.price.toLocaleString()}</p>
              </div>
            </div>
            
            <Link 
              href={`/buy/${linkedListing.slug || linkedListing._id}`}
              className="w-full py-3 bg-custom-accent text-custom-black font-bold rounded-xl flex items-center justify-center gap-2 hover:bg-yellow-400 transition-all shadow-lg shadow-custom-accent/20"
            >
              <FaShoppingBag /> Shop This Car
            </Link>
          </div>
        ) : (
          <div className="mt-auto pt-4">
             <Link 
              href="/buy"
              className="w-full py-3 bg-white/10 text-white font-bold rounded-xl flex items-center justify-center gap-2 hover:bg-white/20 transition-all"
            >
              Browse All Cars
            </Link>
          </div>
        )}
      </div>
    </div>
  )
}
