'use client'
import React, { useState, useEffect } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import axios from 'axios'
import API_URL from '../config/api'

const DealsOfTheDay = () => {
  const [deals, setDeals] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchDeals()
  }, [])

  const fetchDeals = async () => {
    try {
      const response = await axios.get(`${API_URL}/api/listings/deals`)
      setDeals(response.data)
      setLoading(false)
    } catch (error) {
      console.error('Error fetching deals:', error)
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <section className="py-20 bg-gradient-to-b from-custom-black to-custom-jet">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <div className="h-10 w-64 bg-white/10 rounded-lg mx-auto animate-pulse"></div>
          </div>
        </div>
      </section>
    )
  }

  if (!deals || deals.length === 0) {
    return null // Don't show section if no deals
  }

  return (
    <section className="py-20 bg-gradient-to-b from-custom-black to-custom-jet relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute inset-0" style={{
          backgroundImage: 'radial-gradient(circle, white 1px, transparent 1px)',
          backgroundSize: '50px 50px'
        }}></div>
      </div>

      <div className="container mx-auto px-4 relative z-10">
        {/* Section Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-3 mb-4">
            <span className="inline-block w-12 h-1 bg-custom-accent rounded-full"></span>
            <h2 className="font-display font-bold text-4xl md:text-5xl text-white">
              Deals of the <span className="text-custom-accent">Day</span>
            </h2>
            <span className="inline-block w-12 h-1 bg-custom-accent rounded-full"></span>
          </div>
          <p className="text-custom-platinum text-lg max-w-2xl mx-auto">
            Limited time offers on handpicked premium vehicles. Don't miss out!
          </p>
        </div>

        {/* Deals Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {deals.map((car, index) => (
            <DealCard key={car._id} car={car} index={index} />
          ))}
        </div>
      </div>
    </section>
  )
}

const DealCard = ({ car, index }) => {
  const [timeLeft, setTimeLeft] = useState('')

  useEffect(() => {
    // Calculate time left for the deal (24 hours from now for demo, you can use car.dealEndDate)
    const calculateTimeLeft = () => {
      const endTime = car.dealEndDate ? new Date(car.dealEndDate) : new Date(Date.now() + 24 * 60 * 60 * 1000)
      const now = new Date()
      const difference = endTime - now

      if (difference > 0) {
        const hours = Math.floor(difference / (1000 * 60 * 60))
        const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60))
        const seconds = Math.floor((difference % (1000 * 60)) / 1000)
        
        setTimeLeft(`${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`)
      } else {
        setTimeLeft('EXPIRED')
      }
    }

    calculateTimeLeft()
    const timer = setInterval(calculateTimeLeft, 1000)

    return () => clearInterval(timer)
  }, [car.dealEndDate])

  const originalPrice = car.originalPrice || car.price * 1.1 // 10% higher as original
  const discount = Math.round(((originalPrice - car.price) / originalPrice) * 100)

  return (
    <div
      className="group relative bg-custom-jet rounded-2xl overflow-hidden border border-white/10 hover:border-custom-accent/50 transition-all duration-300 hover:shadow-2xl hover:shadow-custom-accent/20 animate-slide-up"
      style={{ animationDelay: `${index * 100}ms` }}
    >
      {/* Hot Deal Badge */}
      <div className="absolute top-4 left-4 z-20">
        <div className="flex items-center gap-2 bg-gradient-to-r from-red-600 to-orange-500 px-4 py-2 rounded-full shadow-lg animate-pulse">
          <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M12.395 2.553a1 1 0 00-1.45-.385c-.345.23-.614.558-.822.88-.214.33-.403.713-.57 1.116-.334.804-.614 1.768-.84 2.734a31.365 31.365 0 00-.613 3.58 2.64 2.64 0 01-.945-1.067c-.328-.68-.398-1.534-.398-2.654A1 1 0 005.05 6.05 6.981 6.981 0 003 11a7 7 0 1011.95-4.95c-.592-.591-.98-.985-1.348-1.467-.363-.476-.724-1.063-1.207-2.03zM12.12 15.12A3 3 0 017 13s.879.5 2.5.5c0-1 .5-4 1.25-4.5.5 1 .786 1.293 1.371 1.879A2.99 2.99 0 0113 13a2.99 2.99 0 01-.879 2.121z" clipRule="evenodd" />
          </svg>
          <span className="text-white font-bold text-sm">HOT DEAL</span>
        </div>
      </div>

      {/* Discount Badge */}
      {discount > 0 && (
        <div className="absolute top-4 right-4 z-20">
          <div className="bg-custom-accent text-custom-black px-3 py-1 rounded-full font-bold text-sm shadow-lg">
            {discount}% OFF
          </div>
        </div>
      )}

      {/* Image */}
      <Link href={`/buy/${car.slug}`} className="block relative h-64 overflow-hidden">
        <Image
          src={car.images?.[0] || '/placeholder-car.jpg'}
          alt={`${car.brand} ${car.model}`}
          fill
          className="object-cover group-hover:scale-110 transition-transform duration-500"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
      </Link>

      {/* Content */}
      <div className="p-6">
        {/* Car Details */}
        <Link href={`/buy/${car.slug}`}>
          <h3 className="font-display font-bold text-2xl text-white mb-2 group-hover:text-custom-accent transition-colors">
            {car.brand} {car.model}
          </h3>
          <p className="text-custom-platinum text-sm mb-4">{car.variant}</p>
        </Link>

        {/* Specs */}
        <div className="flex items-center gap-4 mb-4 text-sm text-custom-platinum">
          <div className="flex items-center gap-1">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            <span>{car.year}</span>
          </div>
          <div className="flex items-center gap-1">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
            <span>{car.fuelType}</span>
          </div>
          <div className="flex items-center gap-1">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span>{car.kmDriven?.toLocaleString()} km</span>
          </div>
        </div>

        {/* Price */}
        <div className="mb-4">
          {originalPrice > car.price && (
            <div className="text-custom-platinum line-through text-sm mb-1">
              ₹{originalPrice.toLocaleString()}
            </div>
          )}
          <div className="flex items-baseline gap-2">
            <span className="text-custom-accent font-bold text-3xl">
              ₹{car.price.toLocaleString()}
            </span>
          </div>
          {car.emiStarting && (
            <div className="text-custom-platinum text-sm mt-1">
              EMI from ₹{car.emiStarting.toLocaleString()}/month
            </div>
          )}
        </div>

        {/* Countdown Timer */}
        <div className="bg-gradient-to-r from-custom-accent/20 to-transparent border border-custom-accent/30 rounded-lg p-3 mb-4">
          <div className="flex items-center justify-between">
            <span className="text-white text-sm font-medium">Deal ends in:</span>
            <div className="flex items-center gap-1">
              <svg className="w-4 h-4 text-custom-accent" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span className="text-custom-accent font-bold font-mono text-lg">
                {timeLeft}
              </span>
            </div>
          </div>
        </div>

        {/* CTA Button */}
        <Link
          href={`/buy/${car.slug}`}
          className="block w-full text-center bg-custom-accent text-custom-black font-bold py-3 rounded-full hover:bg-yellow-400 transition-all duration-300 shadow-lg shadow-custom-accent/20 group-hover:shadow-custom-accent/40 transform hover:-translate-y-1"
        >
          View Details
        </Link>
      </div>
    </div>
  )
}

export default DealsOfTheDay
