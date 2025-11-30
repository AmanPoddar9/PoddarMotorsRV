'use client'
import React, { useEffect, useState } from 'react'
import { Oval } from 'react-loader-spinner'
import axios from 'axios'

import { Swiper, SwiperSlide } from 'swiper/react'
import { FreeMode } from 'swiper/modules'
import 'swiper/css'

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
import volkswagen from '../../images/brands/volkswagen.png'
import volvo from '../../images/brands/volvo.png'

import Image from 'next/image'

const budgetsMapping = {
  'Under 4 Lakh': '0-400000',
  '4-8 Lakh': '400000-800000',
  'Above 8 Lakh': '800000',
}
const handleBtnClick = (item, type) => {
  let tempObj = {}
  if (type == 'Budget') {
    tempObj = {
      [type]: budgetsMapping[item.trim()],
    }
  } else {
    tempObj = {
      [type]: item,
    }
  }
  localStorage.setItem('filters', JSON.stringify(tempObj))
  if (item == '') {
    localStorage.removeItem('filters')
  }

  window.location.href = '/buy'
}

const handleBrandClick = (item) => {
  const tempObj = {
    Brand: item,
  }
  localStorage.setItem('filters', JSON.stringify(tempObj))
  if (item == '') {
    localStorage.removeItem('filters')
  }
  window.location.href = '/buy'
}

const ButtonCard = ({ item, type }) => (
  <div
    className="bg-custom-jet/50 text-white shadow-lg rounded-xl p-5 w-44 hover:bg-custom-jet hover:scale-105 cursor-pointer transition-all duration-300 border border-white/10 backdrop-blur-sm"
    onClick={() => handleBtnClick(item, type)}
  >
    <div className="text-center font-medium">{item}</div>
  </div>
)

export const BrandCard = ({ logoUrl, name }) => (
  <div
    className="flex flex-col md:inline-block items-center justify-center bg-custom-jet/50 cursor-pointer shadow-lg rounded-xl p-4 hover:bg-custom-jet hover:scale-105 transition-all duration-300 border border-white/10 backdrop-blur-sm"
    onClick={() => handleBrandClick(name)}
  >
    <Image
      src={logoUrl}
      alt={`${name} logo`}
      className="h-16 w-16 object-contain filter brightness-0 invert"
      width={60}
      height={60}
    />
  </div>
)

const BrandScrollContainer = ({ brands, brandsMapping }) => {
  return (
    <span className="flex overflow-x-auto py-2 gap-x-5 scrollbar-hide">
      {brands.map(
        (brand, i) =>
          brandsMapping[brand] && (
            <BrandCard logoUrl={brandsMapping[brand]} key={i} name={brand} />
          ),
      )}
      <div
        className="flex flex-col md:inline-block align-top bg-custom-accent hover:bg-yellow-400 md:py-8 md:mx-4 items-center justify-center cursor-pointer shadow-lg rounded-xl p-4 transition-all duration-300 text-custom-black font-bold"
        onClick={() => handleBrandClick('')}
      >
        View All
      </div>
    </span>
  )
}

const ButtonRows = () => {
  const [loading, setLoading] = useState(true)
  const [brands, setBrands] = useState([])

  const types = ['Hatchback', 'Compact SUV', 'Full Size Sedan', 'MUV/MPV']
  const brandsMapping = {
    'Maruti Suzuki': suzuki,
    Mahindra: mahindra,
    Hyundai: hyundai,
    Tata: tata,
    Honda: honda,
    Volkswagen: volkswagen,
    Audi: audi,
  }

  const url = 'https://poddar-motors-rv-hkxu.vercel.app/'
  const [isDesktop, setDesktop] = useState(false)

  const updateComponent = () => {
    setDesktop(window.innerWidth > 1024)
  }

  useEffect(() => {
    if (window.innerWidth > 1024) {
      setDesktop(true)
    }
  }, [])

  useEffect(() => {
    window.addEventListener('resize', updateComponent)
    return () => window.removeEventListener('resize', updateComponent)
  })

  // const fetchAllTypes = async () => {
  //   try {
  //     setLoading(true)
  //     const response = await axios.get(url + 'api/listings/types')
  //     if (response.data) {
  //       setTypes(response.data)
  //       setLoading(false)
  //     }
  //   } catch (e) {
  //     console.log(e.message)
  //   }
  // }

  const fetchAllBrands = async () => {
    try {
      setLoading(true)
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
    // fetchAllTypes()
    fetchAllBrands()
  }, [])

  return (
    <section className="py-20 bg-gradient-to-b from-custom-black via-custom-jet to-custom-black relative overflow-hidden">
      {/* Animated Background Blobs */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -left-40 w-96 h-96 bg-custom-accent/5 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute top-1/2 -right-40 w-96 h-96 bg-purple-500/5 rounded-full blur-3xl animate-pulse delay-1000"></div>
      </div>
      
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-6 relative z-10">
        <div className="mb-10 text-center">
          <h2 className="text-4xl md:text-5xl font-display font-bold mb-3 text-white">
            <a href="/buy" className="hover:text-custom-accent transition-colors">Find Your <span className="text-transparent bg-clip-text bg-gradient-to-r from-custom-accent to-yellow-200">Dream Car</span></a>
          </h2>
          <p className="text-custom-platinum text-lg">Browse by brand, type, or budget</p>
        </div>
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
      ) : (
        <>
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-6 relative z-10">
            <h3 className="text-2xl font-bold mb-5 text-white flex items-center gap-2">
              <span className="w-1 h-6 bg-custom-accent rounded-full"></span>
              Popular Brands
            </h3>
            {isDesktop ? (
              <BrandScrollContainer
                brands={Object.keys(brandsMapping)}
                brandsMapping={brandsMapping}
              />
            ) : (
              <Swiper
                slidesPerView={3.5}
                spaceBetween={20}
                freeMode={true}
                modules={[FreeMode]}
                className="mySwiperCloudBrands !pb-10"
              >
                {Object.keys(brandsMapping).map(
                  (brand, i) =>
                    brandsMapping[brand] && (
                      <SwiperSlide key={i}>
                        <BrandCard
                          logoUrl={brandsMapping[brand]}
                          name={brand}
                        />
                      </SwiperSlide>
                    ),
                )}
                <SwiperSlide>
                  <div
                    className="flex flex-col items-center justify-center py-8 px-4 cursor-pointer shadow-lg rounded-xl bg-custom-accent hover:bg-yellow-400 transition-all text-custom-black font-bold"
                    onClick={() => handleBrandClick('')}
                  >
                    View All
                  </div>
                </SwiperSlide>
              </Swiper>
            )}
            
            <h3 className="text-2xl font-bold mb-5 mt-12 text-white flex items-center gap-2">
              <span className="w-1 h-6 bg-custom-accent rounded-full"></span>
              Body Types
            </h3>
            <div className="flex flex-wrap gap-4">
              {isDesktop ? (
                <>
                  {types.map((type, index) => (
                    <ButtonCard key={index} item={type} type={'Segment'} />
                  ))}
                  <div
                    className="bg-custom-accent hover:bg-yellow-400 shadow-lg rounded-xl p-5 w-44 cursor-pointer transition-all duration-300 text-custom-black font-bold"
                    onClick={() => handleBtnClick('', 'Segment')}
                  >
                    <div className="text-center">View All</div>
                  </div>
                </>
              ) : (
                <Swiper
                  slidesPerView={2.2}
                  spaceBetween={20}
                  freeMode={true}
                  modules={[FreeMode]}
                  className="mySwiperCloud !pb-10"
                >
                  {types.map((type, index) => (
                    <SwiperSlide key={index}>
                      <ButtonCard item={type} type={'Segment'} />
                    </SwiperSlide>
                  ))}
                  <SwiperSlide key={'all'}>
                    <div
                      className="bg-custom-accent shadow-lg rounded-xl p-5 w-40 cursor-pointer text-custom-black font-bold"
                      onClick={() => handleBtnClick('', 'type')}
                    >
                      <div className="text-center">View All</div>
                    </div>
                  </SwiperSlide>
                </Swiper>
              )}
            </div>
            
            <h3 className="text-2xl font-bold mb-5 mt-12 text-white flex items-center gap-2">
              <span className="w-1 h-6 bg-custom-accent rounded-full"></span>
              Price Range
            </h3>
            <div className="flex flex-wrap gap-4">
              {isDesktop ? (
                <>
                  <ButtonCard item="Under 4 Lakh" type={'Budget'} />
                  <ButtonCard item="4-8 Lakh" type={'Budget'} />
                  <ButtonCard item="Above 8 Lakh" type={'Budget'} />
                </>
              ) : (
                <Swiper
                  slidesPerView={2.2}
                  spaceBetween={20}
                  freeMode={true}
                  modules={[FreeMode]}
                  className="mySwiperCloudPrice !pb-10"
                >
                  <SwiperSlide>
                    <ButtonCard item="Under 4 Lakh" type={'Budget'} />
                  </SwiperSlide>
                  <SwiperSlide>
                    <ButtonCard item="4-8 Lakh" type={'Budget'} />
                  </SwiperSlide>
                  <SwiperSlide>
                    <ButtonCard item="Above 8 Lakh" type={'Budget'} />
                  </SwiperSlide>
                </Swiper>
              )}
            </div>
          </div>
        </>
      )}
    </section>
  )
}

export default ButtonRows
