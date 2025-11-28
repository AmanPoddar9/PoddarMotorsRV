'use client'
import React, { useState } from 'react'
import { FaPlay, FaStar, FaQuoteLeft } from 'react-icons/fa'

const TestimonialCard = ({ testimonial }) => {
  const [isPlaying, setIsPlaying] = useState(false)

  return (
    <div className="glass-dark border border-white/10 rounded-2xl overflow-hidden hover:border-custom-accent/50 transition-all duration-300 group h-full flex flex-col">
      {/* Media Section */}
      <div className="relative aspect-video bg-black">
        {testimonial.type === 'video' ? (
          isPlaying ? (
            <video
              src={testimonial.mediaUrl}
              controls
              autoPlay
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full relative cursor-pointer" onClick={() => setIsPlaying(true)}>
              <img
                src={testimonial.thumbnailUrl || testimonial.mediaUrl.replace(/\.[^/.]+$/, ".jpg")}
                alt={`Testimonial from ${testimonial.name}`}
                className="w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-opacity"
              />
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-16 h-16 rounded-full bg-custom-accent/90 flex items-center justify-center text-custom-black pl-1 shadow-lg shadow-custom-accent/20 transform group-hover:scale-110 transition-transform">
                  <FaPlay size={24} />
                </div>
              </div>
            </div>
          )
        ) : (
          <img
            src={testimonial.mediaUrl}
            alt={`Testimonial from ${testimonial.name}`}
            className="w-full h-full object-cover hover:scale-105 transition-transform duration-700"
          />
        )}
        
        {/* Car Badge */}
        <div className="absolute bottom-4 left-4">
          <span className="px-3 py-1 bg-black/60 backdrop-blur-md text-white text-xs font-bold rounded-full border border-white/20">
            Purchased {testimonial.carModel}
          </span>
        </div>
      </div>

      {/* Content Section */}
      <div className="p-6 flex-1 flex flex-col">
        <div className="flex items-start justify-between mb-4">
          <div>
            <h3 className="text-white font-bold text-lg">{testimonial.name}</h3>
            <p className="text-custom-platinum text-sm flex items-center gap-1">
              📍 {testimonial.location}
            </p>
          </div>
          <div className="flex gap-0.5">
            {[...Array(5)].map((_, i) => (
              <FaStar
                key={i}
                className={`w-4 h-4 ${
                  i < testimonial.rating ? 'text-yellow-400' : 'text-gray-600'
                }`}
              />
            ))}
          </div>
        </div>

        <div className="relative flex-1">
          <FaQuoteLeft className="absolute -top-2 -left-2 text-custom-accent/20 text-4xl" />
          <p className="text-custom-platinum text-sm leading-relaxed relative z-10 pl-4">
            {testimonial.text}
          </p>
        </div>
      </div>
    </div>
  )
}

export default TestimonialCard
