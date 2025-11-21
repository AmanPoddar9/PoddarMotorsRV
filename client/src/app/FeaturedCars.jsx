'use client'
import React, { useEffect, useState } from 'react'
import { Swiper, SwiperSlide } from 'swiper/react'
import { Autoplay, Navigation, Pagination } from 'swiper/modules'
import 'swiper/css'
import FeaturedCard from './components/FeaturedCard'

import { Oval } from 'react-loader-spinner'

const FeaturedCars = ({ featuredCarData }) => {
  const [carData, setCarData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    if (featuredCarData) {
      setCarData(featuredCarData)
      setLoading(false)
    } else {
      const fetchFeaturedCars = async () => {
        try {
          const response = await fetch(
            'https://poddar-motors-rv-hkxu.vercel.app/api/listings/featured',
          )
          if (!response.ok) {
            throw new Error('Failed to fetch data')
          }
          const result = await response.json()
          setCarData(result)
        } catch (err) {
          setError(error)
        } finally {
          setLoading(false)
        }
      }

      fetchFeaturedCars()
    }
  }, [])

  return (
    <section className="py-20 bg-custom-black relative overflow-hidden">
      {/* Background Gradient */}
      <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-b from-custom-black via-custom-jet/20 to-custom-black pointer-events-none"></div>
      
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-6 relative z-10">
        <div className="mb-14 text-center">
          <h2 className="text-4xl md:text-5xl font-display font-bold text-white mb-4">
            Featured <span className="text-custom-accent">Cars</span>
          </h2>
          <p className="text-custom-platinum text-lg max-w-2xl mx-auto">
            Handpicked vehicles that offer the best value and performance.
          </p>
        </div>

        {error && <p className="text-red-500 text-center">Error, please try again...</p>}

        {loading ? (
          <div className="flex items-center justify-center p-10">
            <Oval
              color="#F59E0B"
              height={50}
              width={50}
              secondaryColor="#78350f"
            />
          </div>
        ) : (
          <Swiper
            modules={[Navigation, Pagination, Autoplay]}
            className="myfeaturedCarsSwiper !pb-14"
            slidesPerView={1}
            spaceBetween={32}
            navigation
            pagination={{ clickable: true, dynamicBullets: true }}
            autoplay={{
              delay: 3000,
              disableOnInteraction: false,
              pauseOnMouseEnter: true,
            }}
            breakpoints={{
              640: { slidesPerView: 1, spaceBetween: 32 },
              768: { slidesPerView: 2, spaceBetween: 32 },
              1024: { slidesPerView: 3, spaceBetween: 32 },
            }}
          >
            {carData &&
              carData.map((car) => (
                <SwiperSlide
                  key={car._id}
                  className="!h-auto"
                >
                  <FeaturedCard car={car} />
                </SwiperSlide>
              ))}
          </Swiper>
        )}
      </div>
    </section>
  )
}

export default FeaturedCars
