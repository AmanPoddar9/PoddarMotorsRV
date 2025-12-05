'use client'
import React, { useEffect, useState } from 'react'
import FeaturedCard from './components/FeaturedCard'
import Link from 'next/link'
import { useLanguage } from './contexts/LanguageContext'
import { GridSkeleton } from './components/skeletons/LoadingSkeletons'

const FeaturedCars = ({ featuredCarData }) => {
  const [featuredCars, setFeaturedCars] = useState(featuredCarData)
  const [loading, setLoading] = useState(!featuredCarData || featuredCarData.length === 0)
  const { language } = useLanguage()

  useEffect(() => {
    if (!featuredCarData || featuredCarData.length === 0) {
      setLoading(false)
    }
  }, [featuredCarData])

  return (
    <div id="featured" className="max-w-screen-2xl mx-auto px-4 sm:px-6 lg:px-8 py-16 bg-custom-black">
      <div className="text-center mb-12">
        <h2 className="text-4xl font-bold text-custom-seasalt mb-4">
          {language === 'en' ? 'Featured Cars' : 'विशेष कारें'}
        </h2>
        <p className="text-custom-platinum text-lg max-w-2xl mx-auto">
          {language === 'en' 
            ? 'Explore our handpicked selection of quality used cars' 
            : 'गुणवत्ता वाली प्रयुक्त कारों का हमारा चयनित संग्रह देखें'}
        </p>
      </div>

      {loading ? (
        <GridSkeleton count={6} />
      ) : featuredCars && featuredCars.length > 0 ? (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {featuredCars.map((car) => (
              <FeaturedCard key={car._id} car={car} />
            ))}
          </div>
          
          <div className="text-center mt-12">
            <Link
              href="/buy"
              className="inline-block bg-custom-accent hover:bg-yellow-400 text-custom-black font-bold py-3 px-8 rounded-lg transition-all duration-300 transform hover:scale-105 shadow-lg"
            >
              {language === 'en' ? 'View All Cars' : 'सभी कारें देखें'}
            </Link>
          </div>
        </>
      ) : (
        <div className="text-center py-16">
          <p className="text-custom-platinum text-lg">
            {language === 'en' ? 'No featured cars available at the moment.' : 'फिलहाल कोई विशेष कारें उपलब्ध नहीं हैं।'}
          </p>
        </div>
      )}
    </div>
  )
}

export default FeaturedCars
