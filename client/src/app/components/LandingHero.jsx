'use client'
import React, { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import carImage2 from '../../images/about4.jpeg'
import Image from 'next/image'
import axios from 'axios'
import Link from 'next/link'
import { FaSearch, FaCar } from 'react-icons/fa'

import { useLanguage } from '../contexts/LanguageContext'

const brandsMapping = {
  'Audi': 'Audi', 'BMW': 'BMW', 'Fiat': 'Fiat', 'Ford': 'Ford',
  'Honda': 'Honda', 'Hyundai': 'Hyundai', 'Jeep': 'Jeep', 'KIA': 'KIA',
  'Land Rover': 'Land Rover', 'Mahindra': 'Mahindra', 'Mercedes': 'Mercedes',
  'MG Motor': 'MG Motor', 'Nissan': 'Nissan', 'Renault': 'Renault',
  'Skoda': 'Skoda', 'Tata': 'Tata', 'Toyota': 'Toyota',
  'Maruti': 'Maruti', 'Maruti Suzuki': 'Maruti Suzuki',
  'Volkswagen': 'Volkswagen', 'Volvo': 'Volvo'
}

const segments = [
  { label: 'SUV', key: '1' },
  { label: 'Sedan', key: '2' },
  { label: 'Hatchback', key: '3' },
  { label: 'MUV', key: '4' },
]

const LandingHero = () => {
  const { t } = useLanguage()
  const [types, setTypes] = useState([])
  const [searchQuery, setSearchQuery] = useState('')
  const [showSuggestions, setShowSuggestions] = useState(false)
  const url = 'https://poddar-motors-rv-hkxu.vercel.app/'

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
      const response = await axios.get(url + 'api/listings/types')
      if (response.data) {
        const arr = response.data.map((type, index) => ({
          label: type,
          key: `${index + 1}`,
        }))
        setTypes(arr)
      }
    } catch (error) {
      console.error('[LandingHero] Failed to fetch types:', error.message)
    }
  }

  useEffect(() => {
    localStorage.removeItem('filters')
    fetchAllTypes()
  }, [])

  return (
    <section className="relative min-h-screen w-full overflow-hidden flex items-center justify-center">
      {/* Background Image with Gradient */}
      <div className="absolute inset-0">
        <Image
          src={carImage2}
          alt="Premium Used Cars"
          fill
          className="object-cover"
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 100vw, 100vw"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-b from-custom-black/70 via-custom-black/50 to-custom-black"></div>
      </div>

      {/* Content */}
      <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center py-20 md:py-32">
        {/* Main Heading */}
        <motion.h1
          initial={{ y: 30, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.8 }}
          className="font-display font-bold text-4xl sm:text-6xl md:text-7xl lg:text-8xl text-white mb-4 md:mb-6 leading-tight"
        >
          {t('landing.hero.title_prefix')}{' '}
          <span className="bg-gradient-to-r from-custom-accent to-yellow-400 bg-clip-text text-transparent">
            {t('landing.hero.title_suffix')}
          </span>
        </motion.h1>
        
        {/* Subtitle */}
        <motion.p
          initial={{ y: 30, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.1 }}
          className="text-lg md:text-2xl text-custom-seasalt mb-8 md:mb-12 max-w-2xl mx-auto"
        >
          {t('landing.hero.subtitle')}
        </motion.p>

        {/* Search Bar */}
        <motion.div
          initial={{ y: 30, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="max-w-3xl mx-auto mb-8"
        >
          <div className="relative">
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 sm:gap-3 bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl sm:rounded-full p-2 shadow-2xl">
              <div className="flex items-center flex-1 px-4 sm:px-6 py-2 sm:py-0">
                <FaSearch className="text-custom-platinum mr-3 text-lg" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => {
                    setSearchQuery(e.target.value)
                    setShowSuggestions(true)
                  }}
                  onBlur={() => setTimeout(() => setShowSuggestions(false), 200)}
                  placeholder={t('landing.search.placeholder')}
                  className="flex-1 bg-transparent text-white placeholder-white/50 outline-none text-base sm:text-lg w-full"
                  onKeyPress={(e) => {
                    if (e.key === 'Enter') {
                      handleSearch()
                    }
                  }}
                />
              </div>
              <button
                onClick={handleSearch}
                className="px-6 py-3 sm:px-8 sm:py-4 bg-gradient-to-r from-custom-accent to-yellow-400 text-custom-black font-bold rounded-xl sm:rounded-full hover:scale-105 transition-all shadow-lg text-sm sm:text-base"
              >
                {t('landing.search.button')}
              </button>
            </div>

            {/* Suggestions Dropdown */}
            {showSuggestions && searchQuery.length > 0 && (
              <div className="absolute top-full left-0 right-0 mt-3 bg-custom-jet/95 backdrop-blur-md border border-white/20 rounded-2xl shadow-2xl overflow-hidden max-h-60 overflow-y-auto">
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
                  <div className="px-6 py-4 text-custom-platinum text-center text-sm">
                    {t('landing.search.no_suggestions')}
                  </div>
                )}
              </div>
            )}
          </div>
        </motion.div>

        {/* CTA Buttons */}
        <motion.div
          initial={{ y: 30, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.3 }}
          className="flex flex-col sm:flex-row gap-4 justify-center items-center"
        >
          <Link
            href="/buy"
            className="group inline-flex items-center gap-2 px-8 py-4 bg-white/10 backdrop-blur-sm border border-white/30 text-white font-bold text-lg rounded-full hover:bg-white hover:text-custom-black transition-all duration-300"
          >
            <FaCar className="group-hover:translate-x-1 transition-transform" />
            {t('landing.hero.cta_browse')}
          </Link>
          <Link
            href="/sell"
            className="inline-flex items-center gap-2 px-8 py-4 text-white font-semibold text-lg hover:text-custom-accent transition-all duration-300"
          >
            {t('landing.hero.cta_sell')} →
          </Link>
        </motion.div>
      </div>

      {/* Scroll Indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1, duration: 1 }}
        className="absolute bottom-10 left-1/2 -translate-x-1/2"
      >
        <div className="w-6 h-10 border-2 border-white/30 rounded-full flex items-start justify-center p-2">
          <motion.div
            animate={{ y: [0, 12, 0] }}
            transition={{ duration: 1.5, repeat: Infinity }}
            className="w-1.5 h-1.5 bg-custom-accent rounded-full"
          />
        </div>
      </motion.div>

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
