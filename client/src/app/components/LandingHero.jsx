'use client'
import React, { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import carImage2 from '../../images/about4.jpeg'
import Image from 'next/image'
import axios from 'axios'
import Link from 'next/link'
import { 
  FaSearch, 
  FaCar, 
  FaCheckCircle, 
  FaAward, 
  FaShieldAlt,
  FaHandshake 
} from 'react-icons/fa'

import audi from '../../images/brands/audi.png'
import bmw from '../../images/brands/bmw.png'
import fiat from '../../images/brands/fiat.png'
import ford from '../../images/brands/ford.png'
import honda from '../../images/brands/honda.png'
import hyundai from '../../images/brands/hyundai.png'
import jeep from '../../images/brands/jeep.png'
import kia from '../../images/brands/kia.png'
import land_rover from '../../images/brands/land_rover.png'
import mahindra from '../../images/brands/mahindra.png'
import mercedes from '../../images/brands/mercedes.png'
import mg from '../../images/brands/mg.png'
import nissan from '../../images/brands/nissan.png'
import renault from '../../images/brands/renault.png'
import skoda from '../../images/brands/skoda.png'
import suzuki from '../../images/brands/suzuki.png'
import tata from '../../images/brands/tata.png'
import toyota from '../../images/brands/toyota.png'
import volkswagen from '../../images/brands/volkswagen.png'
import volvo from '../../images/brands/volvo.png'

import { useLanguage } from '../contexts/LanguageContext'

const brandsMapping = {
  Audi: audi,
  BMW: bmw,
  Fiat: fiat,
  Ford: ford,
  Honda: honda,
  Hyundai: hyundai,
  Jeep: jeep,
  KIA: kia,
  'Land Rover': land_rover,
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
  Volkswagen: volkswagen,
  Volvo: volvo,
}

const segments = [
  { label: 'SUV', key: '1' },
  { label: 'Sedan', key: '2' },
  { label: 'Hatchback', key: '3' },
  { label: 'MUV', key: '4' },
]

const LandingHero = () => {
  const { t } = useLanguage()
  const [loading, setLoading] = useState(true)
  const [types, setTypes] = useState([])
  const [brands, setBrands] = useState([])
  const [searchQuery, setSearchQuery] = useState('')
  const [showSuggestions, setShowSuggestions] = useState(false)
  const url = 'https://poddar-motors-rv-hkxu.vercel.app/'

  const highlights = [
    { icon: FaCheckCircle, text: '200+ Quality Checks' },
    { icon: FaAward, text: '30 Years of Trust' },
    { icon: FaShieldAlt, text: 'Certified Pre-Owned' },
    { icon: FaHandshake, text: '40,000+ Happy Customers' }
  ]

  const handleSearch = () => {
    if (searchQuery.trim()) {
      window.location.href = `/buy?search=${encodeURIComponent(searchQuery)}`
    }
  }

  const getSuggestions = () => {
    if (!searchQuery) return []
    const query = searchQuery.toLowerCase()
    
    const brandSuggestions = Object.keys(brandsMapping).filter(brand => 
      brand.toLowerCase().includes(query)
    )

    const typeSuggestions = types.map(t => t.label).filter(type => 
      type.toLowerCase().includes(query)
    )

    const segmentSuggestions = segments.map(s => s.label).filter(segment =>
      segment.toLowerCase().includes(query)
    )

    return [...new Set([...brandSuggestions, ...typeSuggestions, ...segmentSuggestions])].slice(0, 5)
  }

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
        setBrands(response.data)
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
    <section className="relative min-h-screen w-full overflow-hidden flex flex-col justify-center items-center">
      {/* Background Image with Gradient Overlay */}
      <div className="absolute inset-0 -z-10">
        <Image
          src={carImage2}
          alt="Premium Used Cars"
          fill
          className="object-cover"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-b from-custom-black/80 via-custom-black/60 to-custom-black/90"></div>
      </div>

      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none -z-5">
        <div className="absolute top-20 right-0 w-96 h-96 bg-custom-accent/5 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-20 left-0 w-96 h-96 bg-blue-500/5 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>
      </div>

      <div className="relative z-10 max-w-7xl px-4 sm:px-6 lg:px-8 w-full py-20">
        <div className="text-center">
          {/* Trust Badge */}
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.6 }}
            className="inline-flex items-center gap-2 bg-custom-accent/20 border border-custom-accent/30 rounded-full px-4 py-2 mb-6"
          >
            <FaAward className="text-custom-accent" />
            <span className="text-custom-accent font-semibold text-sm">
              Ranchi's Most Trusted Used Car Dealership
            </span>
          </motion.div>

          {/* Main Heading */}
          <motion.h1
            initial={{ y: 30, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.1 }}
            className="font-display font-bold text-4xl sm:text-5xl md:text-6xl lg:text-7xl text-white mb-6 tracking-tight leading-tight"
          >
            {t('home.hero.title')}
          </motion.h1>
          
          {/* Subtitle - No Typewriter */}
          <motion.div
            initial={{ y: 30, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="mb-8"
          >
            <p className="text-2xl md:text-4xl font-semibold">
              <span className="text-custom-platinum">Premium </span>
              <span className="text-custom-platinum">Used Cars </span>
              <span className="bg-gradient-to-r from-custom-accent to-yellow-400 bg-clip-text text-transparent">
                For You
              </span>
            </p>
          </motion.div>

          <motion.p
            initial={{ y: 30, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="max-w-3xl mx-auto mb-10 text-lg md:text-xl text-custom-seasalt font-normal"
          >
            {t('home.hero.subtitle')}
          </motion.p>

          {/* CTA Buttons */}
          <motion.div
            initial={{ y: 30, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="flex flex-col sm:flex-row gap-4 justify-center mb-12"
          >
            <Link
              href="/buy"
              className="group px-8 py-4 bg-gradient-to-r from-custom-accent to-yellow-400 text-custom-black font-bold text-lg rounded-full hover:scale-105 transition-all duration-300 shadow-lg shadow-custom-accent/30 flex items-center justify-center gap-2"
            >
              <FaCar className="group-hover:translate-x-1 transition-transform" />
              {t('home.hero.cta_buy')}
            </Link>
            <Link
              href="/sell"
              className="px-8 py-4 bg-white/10 backdrop-blur-sm border-2 border-white/30 text-white font-bold text-lg rounded-full hover:bg-white hover:text-custom-black transition-all duration-300"
            >
              {t('home.hero.cta_sell')}
            </Link>
          </motion.div>

          {/* Search Bar */}
          <motion.div
            initial={{ y: 30, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.5 }}
            className="w-full max-w-3xl mx-auto relative"
          >
            <div className="bg-white/10 backdrop-blur-md border border-white/20 p-2 rounded-full flex items-center gap-3">
              <div className="flex items-center flex-1 px-4">
                <FaSearch className="text-custom-platinum mr-3" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => {
                    setSearchQuery(e.target.value)
                    setShowSuggestions(true)
                  }}
                  onBlur={() => setTimeout(() => setShowSuggestions(false), 200)}
                  placeholder="Search by brand, model, or type..."
                  className="flex-1 bg-transparent text-white placeholder-white/60 outline-none text-base md:text-lg"
                  onKeyPress={(e) => {
                    if (e.key === 'Enter') {
                      handleSearch()
                    }
                  }}
                />
              </div>
              <button
                onClick={handleSearch}
                className="px-6 md:px-8 py-3 bg-custom-accent text-custom-black font-bold rounded-full hover:bg-yellow-400 transition-all duration-300"
              >
                Search
              </button>
            </div>

            {/* Predictive Search Suggestions */}
            {showSuggestions && searchQuery.length > 0 && (
              <div className="absolute top-full left-0 right-0 mt-2 bg-custom-jet/95 backdrop-blur-md border border-white/20 rounded-2xl shadow-2xl overflow-hidden max-h-60 overflow-y-auto">
                {getSuggestions().length > 0 ? (
                  getSuggestions().map((suggestion, index) => (
                    <div
                      key={index}
                      onClick={() => {
                        setSearchQuery(suggestion)
                        setShowSuggestions(false)
                        window.location.href = `/buy?search=${suggestion}`
                      }}
                      className="px-6 py-3 text-white hover:bg-white/10 cursor-pointer transition-colors border-b border-white/5 last:border-none flex items-center gap-3"
                    >
                      <FaSearch className="text-custom-accent text-sm" />
                      {suggestion}
                    </div>
                  ))
                ) : (
                  <div className="px-6 py-4 text-custom-platinum text-center">
                    No suggestions found
                  </div>
                )}
              </div>
            )}
          </motion.div>

          {/* Highlights */}
          <motion.div
            initial={{ y: 30, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.6 }}
            className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl mx-auto mt-16"
          >
            {highlights.map((item, index) => (
              <div
                key={index}
                className="flex flex-col items-center gap-2 p-4 bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl hover:border-custom-accent/50 transition-all"
              >
                <item.icon className="text-3xl text-custom-accent" />
                <span className="text-white text-sm font-semibold text-center">
                  {item.text}
                </span>
              </div>
            ))}
          </motion.div>
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

export default LandingHero
