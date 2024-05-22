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
            'https://real-value-server.vercel.app/api/listings/featured',
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
    <section className="py-10 !bg-custom-platinum">
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-6">
        <div className="mb-14">
          <h2 className="text-4xl font-bold text-custom-black mb-5">
            Featured Cars
          </h2>
        </div>

        {error && <p>Error, please try again...</p>}

        {loading ? (
          <div className="flex items-center justify-center p-2">
            <Oval
              color="#fded03"
              height={50}
              width={50}
              secondaryColor="#b45309"
            />
          </div>
        ) : (
          <Swiper
            modules={[Navigation, Pagination, Autoplay]}
            className="myfeaturedCarsSwiper"
            slidesPerView={1}
            spaceBetween={32}
            navigation
            scrollbar={{ draggable: true }}
            loop={true}
            centeredSlides={true}
            pagination={{ clickable: true }}
            autoplay={{
              delay: 2000,
              disableOnInteraction: true,
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
                  style={{
                    paddingBottom: '60px',
                    paddingLeft: '7px',
                    paddingRight: '7px',
                  }}
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
