'use client'
import React, { useState, useEffect } from 'react'
import { Swiper, SwiperSlide } from 'swiper/react'
import { Navigation, Pagination } from 'swiper/modules'
import 'swiper/css'
import 'swiper/css/pagination'
import 'swiper/css/navigation'
import axios from 'axios'
// import 'swiper/swiper-bundle.css';

import { Oval } from 'react-loader-spinner'
import Link from 'next/link'

const Testimonials = () => {
  const [loading, setLoading] = useState(false)
  const [testimonials, setTestimonials] = useState(false)
  let url = 'https://poddar-motors-rv-hkxu.vercel.app/'
  // url = 'http://localhost:5000/'

  const fetchTestimonials = async () => {
    try {
      setLoading(false)
      const response = await axios.get(url + 'api/testimonials')
      setTestimonials(response.data)
      setLoading(false)
    } catch (e) {
      console.log(e.message)
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchTestimonials()
  }, [])

  return (
    <section className="bg-custom-black text-custom-seasalt pt-16">
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-6">
        <div className="mb-16">
          <h2 className="text-4xl font-bold text-custom-seaslat mb-5">
            Don't believe us?
          </h2>
          <span className="text-lg text-custom-platinum font-medium block mb-2">
            Testimonials from our happy customers!
          </span>
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
        ) : testimonials.length ? (
          <div>
            <Swiper
              modules={[Navigation, Pagination]}
              className="myTestimonialSwiper"
              slidesPerView={1}
              spaceBetween={32}
              navigation
              scrollbar={{ draggable: true }}
              loop={true}
              centeredSlides={false}
              pagination={{ clickable: true }}
              autoplay={{ delay: 2500, disableOnInteraction: false }}
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
              style={{
                height: 'auto',
                '--swiper-pagination-bullet-inactive-color': '#999999',
              }}
            >
              {testimonials.map((item) => (
                <SwiperSlide key={item._id} style={{ paddingBottom: '30px' }}>
                  <div className="max-w-xs mx-auto bg-custom-seasalt rounded-xl p-5 shadow-2xl m-2 flex flex-col h-full">
                    <p className="text-custom-jet flex-grow h-[10rem]">
                      {item.text}
                    </p>
                    <div className="mt-5 flex items-center">
                      <div className="ml-3">
                        <h3 className="font-semibold text-custom-jet">
                          {item.name ? item.name : 'Anonymous'}
                        </h3>
                      </div>
                    </div>
                  </div>
                </SwiperSlide>
              ))}
            </Swiper>
          </div>
        ) : (
          //   To add button to view more testimonials
          <p>No Testimonials to show...</p>
        )}
        <div className="flex justify-center mt-8">
          <Link
            href="https://www.google.com/maps/place/REAL+VALUE/@23.3713196,85.3504478,17z/data=!3m1!4b1!4m6!3m5!1s0x39f4e17d184b0973:0xbc6d6be675cca0f0!8m2!3d23.3713196!4d85.3530281!16s%2Fg%2F1pxq4x774?hl=en-US&entry=ttu"
            target="_blank"
            rel="noopener noreferrer"
          >
            <button className="bg-custom-seasalt hover:bg-custom-yellow text-custom-jet font-semibold py-2 px-4 rounded-md">
              View All
            </button>
          </Link>
        </div>
      </div>
    </section>
  )
}

export default Testimonials
