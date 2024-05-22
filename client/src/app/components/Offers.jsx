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
  let url = 'https://real-value-server.vercel.app/'
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
    <section className="py-20 bg-white text-custom-black relative">
      <div className="mx-auto max-w-7xl sm:px-6 px-4 lg:px-6">
        <div className="mb-16">
          <h2
            className="text-4xl font-bold text-custom-black mb-5 z-10"
            style={{ zIndex: 20 }}
          >
            Offers
          </h2>
        </div>

        {loading ? (
          <div className="flex items-center justify-center p-10">
            <Oval
              color="#fded03"
              height={50}
              width={50}
              secondaryColor="#b45309"
            />
          </div>
        ) : offers.length ? (
          <Swiper
            modules={[Navigation, Pagination]}
            className="myOfferSwiper"
            slidesPerView={1}
            spaceBetween={10}
            navigation
            scrollbar={{ draggable: true }}
            loop={false}
            centeredSlides={false}
            pagination={{ clickable: true }}
            breakpoints={{
              640: {
                slidesPerView: 1,
                spaceBetween: 32,
                loop: true,
                autoplay: {
                  delay: 2500,
                  disableOnInteraction: false,
                  pauseOnMouseEnter: true,
                },
              },
              768: { slidesPerView: 2, spaceBetween: 32 },
              1024: { slidesPerView: 3, spaceBetween: 32 },
            }}
          >
            {offers.map((offer) => (
              <SwiperSlide key={offer._id} style={{ paddingBottom: '40px' }}>
                <div className="max-w-s rounded-lg shadow">
                  <Image
                    className="rounded-t-lg object-cover w-full"
                    src={offer.image}
                    alt="Offer image"
                    width={200}
                    height={200}
                  />
                </div>
              </SwiperSlide>
            ))}
          </Swiper>
        ) : (
          <p className="text-semibold text-lg -mt-4">No offers to show...</p>
        )}
      </div>
    </section>
  )
}

export default Offers
