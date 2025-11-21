'use client'
import Image from 'next/image'
import React, { useState, useEffect } from 'react'
import { Swiper, SwiperSlide } from 'swiper/react'
import { Navigation, Pagination } from 'swiper/modules'
import 'swiper/css'
import axios from 'axios'

// Loader
import { Oval } from 'react-loader-spinner'

const Offers = () => {
  const [loading, setLoading] = useState(true)
  const [offers, setOffers] = useState([])
  let url = 'https://poddar-motors-rv-hkxu.vercel.app/'
  // url = 'http://localhost:5000/'

  const fetchOffers = async () => {
    try {
      setLoading(true)

      const response = await axios.get(url + 'api/offers')
      setOffers(response.data)
      if (response.data) {
        setLoading(false)
      }
    } catch (e) {
      setLoading(false)
      console.log(e.message)
    }
  }
  useEffect(() => {
    fetchOffers()
  }, [])
  return (
    <section className="py-20 bg-custom-black text-white relative overflow-hidden">
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-to-b from-custom-black via-custom-jet/20 to-custom-black pointer-events-none"></div>
      
      <div className="mx-auto max-w-7xl sm:px-6 px-4 lg:px-6 relative z-10">
        <div className="mb-16 text-center">
          <h2 className="text-4xl md:text-5xl font-display font-bold text-white mb-4">
            Special <span className="text-custom-accent">Offers</span>
          </h2>
          <p className="text-custom-platinum text-lg">Don't miss out on our exclusive deals</p>
        </div>

        {loading ? (
          <div className="flex items-center justify-center p-10">
            <Oval
              color="#F59E0B"
              height={50}
              width={50}
              secondaryColor="#78350f"
            />
          </div>
        ) : offers.length ? (
          <Swiper
            modules={[Navigation, Pagination]}
            className="myOfferSwiper !pb-14"
            slidesPerView={1}
            spaceBetween={24}
            navigation
            loop={offers.length > 3}
            centeredSlides={false}
            pagination={{ clickable: true, dynamicBullets: true }}
            breakpoints={{
              640: {
                slidesPerView: 1,
                spaceBetween: 24,
              },
              768: { slidesPerView: 2, spaceBetween: 24 },
              1024: { slidesPerView: 3, spaceBetween: 32 },
            }}
          >
            {offers.map((offer) => (
              <SwiperSlide key={offer._id}>
                <div className="rounded-2xl shadow-lg overflow-hidden border border-white/10 hover:border-custom-accent/30 transition-all duration-300 hover:scale-105">
                  <Image
                    className="object-cover w-full h-64"
                    src={offer.image}
                    alt="Special offer"
                    width={400}
                    height={256}
                  />
                </div>
              </SwiperSlide>
            ))}
          </Swiper>
        ) : (
          <p className="text-center text-custom-platinum text-lg">No offers available at the moment...</p>
        )}
      </div>
    </section>
  )
}

export default Offers
