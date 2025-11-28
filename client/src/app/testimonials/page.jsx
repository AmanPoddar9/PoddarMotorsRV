'use client'
import React, { useState, useEffect } from 'react'
import axios from 'axios'
import API_URL from '../config/api'
import TestimonialCard from '../components/TestimonialCard'
import Link from 'next/link'

export default function TestimonialsPage() {
  const [testimonials, setTestimonials] = useState([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState('All')
  const [carModels, setCarModels] = useState([])

  useEffect(() => {
    fetchTestimonials()
  }, [])

  const fetchTestimonials = async () => {
    try {
      const response = await axios.get(`${API_URL}/api/testimonials`)
      setTestimonials(response.data.data)
      
      // Extract unique car models for filter
      const models = [...new Set(response.data.data.map(t => t.carModel))]
      setCarModels(models)
      
      setLoading(false)
    } catch (error) {
      console.error('Error fetching testimonials:', error)
      setLoading(false)
    }
  }

  const filteredTestimonials = filter === 'All' 
    ? testimonials 
    : testimonials.filter(t => t.carModel === filter)

  return (
    <div className="min-h-screen bg-custom-black">
      {/* Hero Section */}
      <section className="relative py-20 bg-gradient-to-b from-custom-jet to-custom-black border-b border-white/10">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="font-display font-bold text-4xl md:text-6xl text-white mb-6">
              Wall of <span className="text-custom-accent">Love</span> ❤️
            </h1>
            <p className="text-xl text-custom-platinum mb-8 max-w-2xl mx-auto">
              Real stories from our happy families. Join 10,000+ satisfied customers who found their dream car at Poddar Motors.
            </p>
          </div>
        </div>
      </section>

      {/* Filter Section */}
      <section className="py-8 sticky top-20 z-30 bg-custom-black/95 backdrop-blur-md border-b border-white/10">
        <div className="container mx-auto px-4 overflow-x-auto">
          <div className="flex gap-3 min-w-max md:justify-center">
            <button
              onClick={() => setFilter('All')}
              className={`px-6 py-2 rounded-full font-bold transition-all ${
                filter === 'All'
                  ? 'bg-custom-accent text-custom-black shadow-lg shadow-custom-accent/20'
                  : 'bg-white/5 text-white hover:bg-white/10 border border-white/10'
              }`}
            >
              All Stories
            </button>
            {carModels.map(model => (
              <button
                key={model}
                onClick={() => setFilter(model)}
                className={`px-6 py-2 rounded-full font-bold transition-all ${
                  filter === model
                    ? 'bg-custom-accent text-custom-black shadow-lg shadow-custom-accent/20'
                    : 'bg-white/5 text-white hover:bg-white/10 border border-white/10'
                }`}
              >
                {model}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Grid Section */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          {loading ? (
            <div className="flex justify-center py-20">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-custom-accent"></div>
            </div>
          ) : filteredTestimonials.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredTestimonials.map(testimonial => (
                <div key={testimonial._id} className="h-full">
                  <TestimonialCard testimonial={testimonial} />
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-20">
              <p className="text-custom-platinum text-xl">No stories found for this category yet.</p>
              <button 
                onClick={() => setFilter('All')}
                className="mt-4 text-custom-accent hover:underline"
              >
                View all stories
              </button>
            </div>
          )}
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-custom-jet border-t border-white/10">
        <div className="container mx-auto px-4 text-center">
          <h2 className="font-display font-bold text-3xl md:text-4xl text-white mb-6">
            Ready to start your own story?
          </h2>
          <Link
            href="/buy"
            className="px-8 py-4 bg-custom-accent text-custom-black font-bold rounded-full hover:bg-yellow-400 transition-all shadow-lg shadow-custom-accent/20 inline-block"
          >
            Find Your Dream Car
          </Link>
        </div>
      </section>
    </div>
  )
}
