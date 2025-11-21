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
    <section className="bg-custom-black text-custom-seasalt py-20 relative overflow-hidden">
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-to-b from-custom-black via-custom-jet/20 to-custom-black pointer-events-none"></div>
      
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-6 relative z-10">
        <div className="mb-16 text-center">
          <h2 className="text-4xl md:text-5xl font-display font-bold text-white mb-4">
            Don't Just Take <span className="text-custom-accent">Our Word</span>
          </h2>
          <p className="text-lg text-custom-platinum font-medium">
            Hear what our happy <a href="/about" className="text-custom-accent hover:underline">customers</a> have to say!
          </p>
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
        ) : testimonials.length ? (
          <div>
            <Swiper
              modules={[Navigation, Pagination]}
              className="myTestimonialSwiper !pb-14"
              slidesPerView={1}
              spaceBetween={32}
              navigation
              loop={true}
              centeredSlides={false}
              pagination={{ clickable: true, dynamicBullets: true }}
              autoplay={{ delay: 3500, disableOnInteraction: false }}
              breakpoints={{
                640: {
                  slidesPerView: 1,
                  spaceBetween: 32,
                },
                768: { slidesPerView: 2, spaceBetween: 32 },
                1024: { slidesPerView: 3, spaceBetween: 32 },
              }}
            >
              {testimonials.map((item) => (
                <SwiperSlide key={item._id}>
                  <div className="bg-custom-jet/50 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-white/10 flex flex-col h-full hover:border-custom-accent/30 transition-all duration-300 group">
                    {/* Quote Icon */}
                    <div className="text-custom-accent mb-4">
                      <svg className="w-10 h-10 opacity-50" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-9.983zm-14.017 0v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151c-2.433.917-3.996 3.638-3.996 5.849h3.983v10h-9.983z" />
                      </svg>
                    </div>
                    
                    {/* Star Rating */}
                    <div className="flex gap-1 mb-4">
                      {[...Array(5)].map((_, i) => (
                        <svg key={i} className="w-5 h-5 text-custom-accent" fill="currentColor" viewBox="0 0 20 20">
                          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                        </svg>
                      ))}
                    </div>
                    
                    {/* Testimonial Text */}
                    <p className="text-custom-seasalt flex-grow mb-6 text-base leading-relaxed min-h-[8rem]">
                      "{item.text}"
                    </p>
                    
                    {/* Customer Name */}
                    <div className="mt-auto pt-4 border-t border-white/10">
                      <h3 className="font-bold text-white text-lg">
                        {item.name ? item.name : 'Anonymous'}
                      </h3>
                      <p className="text-custom-platinum text-sm">Verified Customer</p>
                    </div>
                  </div>
                </SwiperSlide>
              ))}
            </Swiper>
          </div>
        ) : (
          <p className="text-center text-custom-platinum">No Testimonials to show...</p>
        )}
        
        <div className="flex justify-center mt-12">
          <Link
            href="https://www.google.com/maps/place/REAL+VALUE/@23.3713196,85.3504478,17z/data=!3m1!4b1!4m6!3m5!1s0x39f4e17d184b0973:0xbc6d6be675cca0f0!8m2!3d23.3713196!4d85.3530281!16s%2Fg%2F1pxq4x774?hl=en-US&entry=ttu"
            target="_blank"
            rel="noopener noreferrer"
          >
            <button className="bg-custom-accent hover:bg-yellow-400 text-custom-black font-bold py-3 px-8 rounded-full transition-all duration-300 shadow-lg shadow-yellow-500/20 transform hover:-translate-y-1">
              View All Reviews
            </button>
          </Link>
        </div>
      </div>
    </section>
  )
}

export default Testimonials
