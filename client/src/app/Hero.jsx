'use client'
import React, { useEffect, useState } from 'react'
import carImage2 from '../images/about4.jpeg'
import Image from 'next/image'
import ButtonCloud from './components/ButtonCloud'

import audi from '@/images/brands/audi.png'
import bmw from '@/images/brands/bmw.png'
import fiat from '@/images/brands/fiat.png'
import ford from '@/images/brands/ford.png'
import honda from '@/images/brands/honda.png'
import hyundai from '@/images/brands/hyundai.png'
import jeep from '@/images/brands/jeep.png'
import kia from '@/images/brands/kia.png'
import land_rover from '@/images/brands/land_rover.png'
import mahindra from '@/images/brands/mahindra.png'
import mercedes from '@/images/brands/mercedes.png'
import mg from '@/images/brands/mg.png'
import nissan from '@/images/brands/nissan.png'
import renault from '@/images/brands/renault.png'
import skoda from '@/images/brands/skoda.png'
import suzuki from '@/images/brands/suzuki.png'
import tata from '@/images/brands/tata.png'
import toyota from '@/images/brands/toyota.png'
import volkswagen from '@/images/brands/volkswagen.png'
import volvo from '@/images/brands/volvo.png'

import axios from 'axios'
import { TypewriterEffectSmooth } from '@/app/components/ui/typewriter-effect'
import Link from 'next/link'

const imageStyles = {
  width: '1.5rem',
  height: '1.5rem',
  display: 'inline',
  marginRight: '0.5rem',
}

const brandsMapping = {
  Audi: audi,
  BMW: bmw,
  Fiat: fiat,
  Ford: ford,
  Honda: honda,
  Hyundai: hyundai,
  Jeep: jeep,
  KIA: kia,
  Mahindra: mahindra,
  Mercedes: mercedes,
  'MG Motor': mg,
  Nissan: nissan,
  Renault: renault,
  Skoda: skoda,
  Tata: tata,
  Toyota: toyota,
  Maruti: suzuki,
  'Maruti Suzuki': suzuki,
}

const segments = [
  { label: 'SUV', key: '1' },
  { label: 'Sedan', key: '2' },
  { label: 'Hatchback', key: '3' },
  { label: 'MUV', key: '4' },
]

const budgets = [
  { label: 'Under 4 Lakh', key: '1', range: '0-400000' },
  { label: '4-8 Lakh', key: '2', range: '400000-800000' },
  { label: 'Above 8 Lakh', key: '3', range: '800000' },
]

const Hero = () => {
  const [loading, setLoading] = useState(true)
  const [types, setTypes] = useState([])
  const [brands, setBrands] = useState([])
  const url = 'https://poddar-motors-rv-hkxu.vercel.app/'

  const fetchAllTypes = async () => {
    try {
      setLoading(true)
      const response = await axios.get(url + 'api/listings/types')
      if (response.data) {
        const arr = response.data.map((type, index) => ({
          label: type,
          key: `${index + 1}`,
        }))
        setTypes(arr)
        setLoading(false)
      }
    } catch (e) {
      console.log(e.message)
    }
  }

  const fetchAllBrands = async () => {
    try {
      const response = await axios.get(url + 'api/listings/brands')
      if (response.data) {
        const arr = response.data.map((b, index) => ({
          label: (
            <div className="flex items-center">
              <Image
                style={imageStyles}
                src={brandsMapping[b]}
                alt={`${b} car brand logo`}
              />
              {b}
            </div>
          ),
          key: `${index + 1}`,
        }))
        setBrands(arr)
        setLoading(false)
      }
    } catch (e) {
      console.log(e.message)
    }
  }

  useEffect(() => {
    localStorage.removeItem('filters')
    fetchAllBrands()
    fetchAllTypes()
  }, [])

  return (
    <section className="relative h-screen w-full overflow-hidden flex flex-col justify-center items-center text-center">
      {/* Background Image with Gradient Overlay */}
      <div className="absolute inset-0 -z-10">
        <Image
          src={carImage2}
          alt="Background"
          fill
          className="object-cover"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-b from-custom-black/70 via-custom-black/50 to-custom-black/90"></div>
      </div>

      <div className="relative z-10 max-w-5xl px-4 sm:px-6 lg:px-8 flex flex-col items-center">
        <h1 className="font-display font-bold text-4xl md:text-6xl lg:text-7xl text-white mb-6 tracking-tight">
          Experience the <span className="text-custom-accent">Real Value</span>
        </h1>
        
        <div className="mb-8">
          <TypewriterEffectSmooth
            words={[
              { text: 'Premium', className: 'text-custom-platinum text-xl md:text-3xl' },
              { text: 'Used', className: 'text-custom-platinum text-xl md:text-3xl' },
              { text: 'Cars', className: 'text-custom-platinum text-xl md:text-3xl' },
              { text: 'For', className: 'text-custom-platinum text-xl md:text-3xl' },
              { text: 'You.', className: 'text-custom-accent text-xl md:text-3xl font-bold' },
            ]}
          />
        </div>

        <p className="max-w-2xl mb-10 text-lg md:text-xl text-white font-normal">
          Your trusted partner for buying, selling, and financing pre-owned vehicles in Ranchi.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 mb-16">
          <Link
            href="/buy"
            className="px-8 py-4 bg-custom-accent text-custom-black font-bold text-lg rounded-full hover:bg-yellow-400 transition-all duration-300 shadow-lg shadow-yellow-500/20 transform hover:-translate-y-1"
          >
            Find Your Car
          </Link>
          <Link
            href="/sell"
            className="px-8 py-4 bg-transparent border-2 border-white text-white font-bold text-lg rounded-full hover:bg-white hover:text-custom-black transition-all duration-300 transform hover:-translate-y-1"
          >
            Sell Your Car
          </Link>
        </div>

        {/* Search Bar */}
        <div className="w-full max-w-2xl glass p-2 rounded-full flex items-center gap-3 animate-slide-up">
          <input
            type="text"
            placeholder="Search for your dream car..."
            className="flex-1 bg-transparent text-white placeholder-white/60 px-6 py-3 outline-none text-lg"
            onKeyPress={(e) => {
              if (e.key === 'Enter') {
                window.location.href = '/buy';
              }
            }}
          />
          <Link
            href="/buy"
            className="px-8 py-3 bg-custom-accent text-custom-black font-bold rounded-full hover:bg-yellow-400 transition-all duration-300 flex items-center gap-2"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            Search
          </Link>
        </div>
      </div>

      {/* Structured Data */}
      <script type="application/ld+json">
        {`{
          "@context": "https://schema.org",
          "@type": "WebSite",
          "name": "Poddar Motors",
          "url": "https://poddarmotors.com",
          "potentialAction": {
            "@type": "SearchAction",
            "target": "https://poddarmotors.com/?s={search_term_string}",
            "query-input": "required name=search_term_string"
          }
        }`}
      </script>
    </section>
  )
}

export default Hero
