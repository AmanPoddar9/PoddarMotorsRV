'use client'

import { useState } from 'react'
import Image from 'next/image'

export default function ImageGallery({ photos }) {
  // Flatten all photos into a single array with categories
  const allPhotos = [
    { url: photos.front, category: 'Exterior' },
    { url: photos.rear, category: 'Exterior' },
    { url: photos.left, category: 'Exterior' },
    { url: photos.right, category: 'Exterior' },
    ...(photos.interior || []).map(url => ({ url, category: 'Interior' })),
    ...(photos.engine || []).map(url => ({ url, category: 'Engine' })),
    ...(photos.damages || []).map(url => ({ url, category: 'Defects' }))
  ].filter(p => p.url) // Remove empty URLs

  const [currentIndex, setCurrentIndex] = useState(0)

  if (allPhotos.length === 0) {
    return (
      <div className="bg-gray-800 rounded-xl h-64 flex items-center justify-center text-gray-500">
        No images available
      </div>
    )
  }

  return (
    <div className="space-y-4">
      {/* Main Image */}
      <div className="relative aspect-video bg-gray-900 rounded-xl overflow-hidden border border-gray-700 group">
        <Image 
          src={allPhotos[currentIndex].url} 
          alt="Car View"
          fill
          className="object-contain"
          priority={true}
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 80vw, 70vw"
        />
        
        {/* Category Badge */}
        <div className="absolute top-4 left-4 bg-black/70 text-white px-3 py-1 rounded-full text-sm backdrop-blur-sm z-10">
          {allPhotos[currentIndex].category}
        </div>

        {/* Navigation Arrows */}
        <button 
          onClick={() => setCurrentIndex(prev => (prev === 0 ? allPhotos.length - 1 : prev - 1))}
          className="absolute left-4 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/80 text-white p-2 rounded-full opacity-0 group-hover:opacity-100 transition-all z-10"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </button>
        <button 
          onClick={() => setCurrentIndex(prev => (prev === allPhotos.length - 1 ? 0 : prev + 1))}
          className="absolute right-4 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/80 text-white p-2 rounded-full opacity-0 group-hover:opacity-100 transition-all z-10"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </button>
      </div>

      {/* Thumbnails */}
      <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
        {allPhotos.map((photo, index) => (
          <button
            key={index}
            onClick={() => setCurrentIndex(index)}
            className={`flex-shrink-0 w-20 h-20 relative rounded-lg overflow-hidden border-2 transition-all ${
              currentIndex === index ? 'border-blue-500 opacity-100' : 'border-transparent opacity-60 hover:opacity-100'
            }`}
          >
            <Image 
              src={photo.url} 
              alt={`Thumbnail ${index}`} 
              fill
              className="object-cover"
              sizes="80px"
            />
          </button>
        ))}
      </div>
    </div>
  )
}
