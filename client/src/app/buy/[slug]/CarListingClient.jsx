'use client'
import React, { useState, useEffect, useRef } from 'react'
import axios from 'axios'
import { AmountWithCommas } from '../../utils'
import { Swiper, SwiperSlide } from 'swiper/react'
import {
  Autoplay,
  Navigation,
  Pagination,
  Thumbs,
  Controller,
  FreeMode,
} from 'swiper/modules'
import 'swiper/css'
import 'swiper/css/navigation'
import 'swiper/css/pagination'
import 'swiper/css/thumbs'
import 'swiper/css/free-mode'
import Image from 'next/image'
import Link from 'next/link'
import Head from 'next/head'

// Icons
import { BiCylinder } from 'react-icons/bi'
import { FaBoltLightning } from 'react-icons/fa6'
import { MdAirlineSeatReclineNormal } from 'react-icons/md'
import { BsFuelPumpFill } from 'react-icons/bs'
import { PiGearSixFill } from 'react-icons/pi'
import mileage from '../../../images/specs/mileage.png'
import disp from '../../../images/specs/disp.png'
import trunk from '../../../images/specs/trunk.png'

// EMI Calculator
import EMICalculator from '../../components/EMICalculator'

import { Oval } from 'react-loader-spinner'
import { toTitleCase, getOwnerShipSuffix, EMICalcLite } from '../../utils'

// BookingCard imports
import { Tabs, Modal } from 'antd'
import BookingCard from '../../components/BookingCard'

// import { BsFillFuelPumpFill } from "react-icons/bs";
import { FaHeart, FaRegHeart } from 'react-icons/fa'
import { useCustomer } from '../../utils/customerContext'
// import { CiCreditCard1 } from "react-icons/ci";
import API_URL from '../../config/api'
import { ViewCounter } from '../../components/SocialProof'
import PriceAlerts from '../../components/PriceAlerts'
import TestimonialCard from '../../components/TestimonialCard'
import CertifiedBadge from '../../components/CertifiedBadge'
import PriceBreakdown from '../../components/PriceBreakdown'
import SocialShare from '../../components/SocialShare'

const CarListingClient = ({ carData, similarCars, testimonials, slug }) => {
  // API call to this route: 662bed523ec1ae8416673630
  // const [loading, setLoading] = useState(true) // No longer needed
  // const [carData, setCarData] = useState(null) // Passed as prop
  // const [similarCars, setSimilarCars] = useState([]) // Passed as prop
  // const [testimonials, setTestimonials] = useState([]) // Passed as prop
  const [open, setOpen] = useState(false)
  // const [error, setError] = useState(null) // Handled by server component or error boundary
  const [isDesktop, setDesktop] = useState(false)

  const [thumbsSwiper, setThumbsSwiper] = useState(null)
  const [mainSwiper, setMainSwiper] = useState(null)

  const bookingPOSTURL = `${API_URL}/api/test-drive-bookings`
  const [confirmLoading, setConfirmLoading] = useState(false)
  const [success, setSuccess] = useState(false)

  // Make Offer State
  const [offerOpen, setOfferOpen] = useState(false)
  const [offerPrice, setOfferPrice] = useState('')
  const [offerSuccess, setOfferSuccess] = useState(false)
  const [viewers, setViewers] = useState(0)
  const [debugStats, setDebugStats] = useState(null)

  const { customer, fetchProfile } = useCustomer()
  const [inWishlist, setInWishlist] = useState(false)
  const [wishlistLoading, setWishlistLoading] = useState(false)

  useEffect(() => {
    if (customer && customer.wishlist && carData) {
      const isWishlisted = customer.wishlist.some(item => 
        (item._id === carData._id) || (item === carData._id)
      )
      setInWishlist(isWishlisted)
    }
  }, [customer, carData])

  const toggleWishlist = async (e) => {
    e.stopPropagation()
    if (!customer) {
      alert('Please login to add to wishlist')
      return
    }

    try {
      setWishlistLoading(true)
      await axios.post(`${API_URL}/api/customer/wishlist`, 
        { listingId: carData._id },
        { withCredentials: true }
      )
      setInWishlist(!inWishlist)
      fetchProfile()
      
      // Facebook Pixel: AddToWishlist event
      if (!inWishlist && typeof window !== 'undefined' && window.fbq && carData) {
        window.fbq('track', 'AddToWishlist', {
          content_name: `${carData.brand} ${carData.model}`,
          content_ids: [carData._id],
          content_type: 'vehicle',
          value: carData.price,
          currency: 'INR',
        })
      }
    } catch (error) {
      console.error('Error toggling wishlist:', error)
    } finally {
      setWishlistLoading(false)
    }
  }

  // Urgency Effect
  useEffect(() => {
    // Random number between 2 and 8
    setViewers(Math.floor(Math.random() * 7) + 2)
  }, [])

  const handleOfferSubmit = async (data) => {
    setConfirmLoading(true)
    
    try {
        const apiUrl = API_URL
        await axios.post(`${apiUrl}/api/customer-offers`, {
            name: data.name,
            mobile: data.mobile,
            email: data.email || '',
            offerPrice: data.offerPrice,
            listingId: carData._id,
        })
        setOfferSuccess(true)
        setTimeout(() => {
            setOfferOpen(false)
            setOfferSuccess(false)
        }, 3000)
        
        if (typeof window !== 'undefined' && window.fbq) {
            window.fbq('track', 'Lead', {
                content_name: 'Make Offer',
                content_category: 'Offer',
                content_type: 'vehicle',
                content_ids: [carData._id],
                value: data.offerPrice,
                currency: 'INR'
            })
        }
    } catch (err) {
        console.error(err)
        setError(err)
    } finally {
        setConfirmLoading(false)
    }
  }

  //   Booking Modal
  const showModal = () => {
    setOpen(true)
  }

  const handleCancel = () => {
    setOpen(false)
  }

  const updateComponent = () => {
    setDesktop(window.innerWidth > 960)
  }

  useEffect(() => {
    if (window.innerWidth > 960) {
      setDesktop(true)
    }
  }, [])

  useEffect(() => {
    window.addEventListener('resize', updateComponent)
    return () => window.removeEventListener('resize', updateComponent)
  })

  const handleChildData = (data) => {
    setConfirmLoading(true)
    axios
      .post(bookingPOSTURL, {
        listingId: carData._id,
        date: data.formattedDate,
        time: data.formattedTime,
        name: data.name,
        mobileNumber: data.mobile,
        email: data.email,
      })
      .then((res) => {
        setSuccess(true)
        setConfirmLoading(false)
        setTimeout(() => {
          setOpen(false)
        }, 2500)
        
        if (typeof window !== 'undefined' && window.fbq) {
            window.fbq('track', 'Lead', {
                content_name: 'Test Drive Booking',
                content_category: 'Test Drive',
                content_type: 'vehicle',
                content_ids: [carData._id],
                value: 0,
                currency: 'INR'
            })
        }
      })
      .catch((err) => {
        console.log(err)
        setError(err)
        setConfirmLoading(false)
      })
  }

  // Data fetching moved to Server Component
  // useEffect(() => { 
  //   const fetchData = async () => { ... }
  //   fetchData()
  // }, [getListingURL])

  // Facebook Pixel ViewContent
  useEffect(() => {
    if (carData && typeof window !== 'undefined' && window.fbq) {
      window.fbq('track', 'ViewContent', {
        content_name: `${carData.brand} ${carData.model} ${carData.variant}`,
        content_ids: [carData._id],
        content_type: 'vehicle',
        value: carData.price,
        currency: 'INR',
      })
    }
  }, [carData])

  // Loading and Error states handled by parent or Next.js loading/error.js
  if (!carData) return null;

  return (
    <div className="bg-custom-black overflow-x-hidden individual-buy-section min-h-screen">
      {carData && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              '@context': 'https://schema.org',
              '@type': 'Vehicle',
              name: `${carData.year} ${carData.brand} ${carData.model} ${carData.variant}`,
              image: carData.images,
              description: `Buy used ${carData.year} ${carData.brand} ${carData.model} in Ranchi. ${carData.fuelType}, ${carData.kmDriven}km driven.`,
              brand: {
                '@type': 'Brand',
                name: carData.brand,
              },
              model: carData.model,
              vehicleConfiguration: carData.variant,
              productionDate: carData.year,
              fuelType: carData.fuelType,
              mileageFromOdometer: {
                '@type': 'QuantitativeValue',
                value: carData.kmDriven,
                unitCode: 'KMT',
              },
              offers: {
                '@type': 'Offer',
                url: `https://poddarmotors.com/buy/${slug}`,
                priceCurrency: 'INR',
                price: carData.price,
                itemCondition: 'https://schema.org/UsedCondition',
                availability: 'https://schema.org/InStock',
                seller: {
                  '@type': 'AutoDealer',
                  name: 'Poddar Motors Real Value',
                },
              },
            }),
          }}
        />
      )}
      
      {/* Enhanced Meta Tags & Breadcrumb Schema */}
      {carData && (
        <Head>
          <title>{`${carData.year} ${carData.brand} ${carData.model} ${carData.variant} - ₹${AmountWithCommas(carData.price)} | Poddar Motors`}</title>
          <meta name="description" content={`Buy ${carData.year} ${carData.brand} ${carData.model} in Ranchi. ${carData.fuelType}, ${carData.transmissionType}, ${carData.kmDriven}km driven. Best price guaranteed!`} />
          <link rel="canonical" href={`https://poddarmotors.com/buy/${slug}`} />
          
          {/* Open Graph */}
          <meta property="og:type" content="product" />
          <meta property="og:url" content={`https://poddarmotors.com/buy/${slug}`} />
          <meta property="og:title" content={`${carData.year} ${carData.brand} ${carData.model} - ₹${AmountWithCommas(carData.price)}`} />
          <meta property="og:description" content={`Buy ${carData.year} ${carData.brand} ${carData.model} in Ranchi. ${carData.fuelType}, ${carData.kmDriven}km. Book test drive now!`} />
          <meta property="og:image" content={carData.images?.[0] || 'https://poddarmotors.com/logo.png'} />
          <meta property="og:image:width" content="1200" />
          <meta property="og:image:height" content="630" />
          <meta property="product:price:amount" content={carData.price} />
          <meta property="product:price:currency" content="INR" />
          
          {/* Twitter Card */}
          <meta name="twitter:card" content="summary_large_image" />
          <meta name="twitter:title" content={`${carData.year} ${carData.brand} ${carData.model} - ₹${AmountWithCommas(carData.price)}`} />
          <meta name="twitter:description" content={`Buy ${carData.year} ${carData.brand} ${carData.model} in Ranchi. Book test drive!`} />
          <meta name="twitter:image" content={carData.images?.[0] || 'https://poddarmotors.com/logo.png'} />
          
          {/* Breadcrumb Schema */}
          <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{
              __html: JSON.stringify({
                '@context': 'https://schema.org',
                '@type': 'BreadcrumbList',
                itemListElement: [
                  {
                    '@type': 'ListItem',
                    position: 1,
                    name: 'Home',
                    item: 'https://poddarmotors.com',
                  },
                  {
                    '@type': 'ListItem',
                    position: 2,
                    name: 'Buy Cars',
                    item: 'https://poddarmotors.com/buy',
                  },
                  {
                    '@type': 'ListItem',
                    position: 3,
                    name: `${carData.brand} ${carData.model}`,
                    item: `https://poddarmotors.com/buy/${slug}`,
                  },
                ],
              }),
            }}
          />
        </Head>
      )}
      <div className="pt-24 mx-auto max-w-screen-xl">
        <nav aria-label="Breadcrumb" className="mb-5">
          <ol
            role="list"
            className="mx-auto flex max-w-2xl items-center space-x-2 px-4 sm:px-6 lg:max-w-7xl lg:px-8"
          >
            <li>
              <div className="flex items-center">
                <Link href="/" className="mr-2 text-sm font-medium text-custom-platinum hover:text-white">
                  Cars
                </Link>
                <svg
                  width="16"
                  height="20"
                  viewBox="0 0 16 20"
                  fill="currentColor"
                  aria-hidden="true"
                  className="h-5 w-4 text-custom-platinum/50"
                >
                  <path d="M5.697 4.34L8.98 16.532h1.327L7.025 4.341H5.697z" />
                </svg>
              </div>
            </li>
            <li>
              <div className="flex items-center">
                <Link
                  href="/buy"
                  className="mr-2 text-sm font-medium text-custom-platinum hover:text-white"
                >
                  Buy
                </Link>
                <svg
                  width="16"
                  height="20"
                  viewBox="0 0 16 20"
                  fill="currentColor"
                  aria-hidden="true"
                  className="h-5 w-4 text-gray-300"
                >
                  <path d="M5.697 4.34L8.98 16.532h1.327L7.025 4.341H5.697z" />
                </svg>
              </div>
            </li>

            <li className="text-sm">
              <a
                href="#"
                aria-current="page"
                className="font-medium text-custom-accent hover:text-yellow-400"
              >
                {carData.brand + ' ' + carData.model}
              </a>
            </li>
          </ol>
        </nav>

        <div className="mb-8 select-none">
          <Swiper
            style={{
              '--swiper-navigation-color': '#fff',
              '--swiper-pagination-color': '#fff',
            }}
            loop={true}
            spaceBetween={10}
            navigation={true}
            thumbs={{ swiper: thumbsSwiper && !thumbsSwiper.destroyed ? thumbsSwiper : null }}
            modules={[FreeMode, Navigation, Thumbs, Autoplay]}
            className="myCarSwiper2 w-full rounded-2xl mb-4"
            autoplay={{ delay: 3000, disableOnInteraction: false }}
          >
            {carData.images &&
              carData.images.map((carImage, i) => (
                <SwiperSlide key={i}>
                  <div className="relative w-full aspect-video bg-custom-jet/50 rounded-2xl overflow-hidden">
                    {carImage && (
                      <Image
                        src={carImage}
                        alt={`${carData.brand} ${carData.model} - View ${i + 1}`}
                        fill
                        className="object-cover"
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 80vw, 70vw"
                        priority={i === 0}
                      />
                    )}
                  </div>
                </SwiperSlide>
              ))}
          </Swiper>

          <Swiper
            onSwiper={setThumbsSwiper}
            loop={true}
            spaceBetween={10}
            slidesPerView={4}
            freeMode={true}
            watchSlidesProgress={true}
            modules={[FreeMode, Navigation, Thumbs]}
            className="myCarSwiperThumbs thumbs-gallery"
            breakpoints={{
              320: { slidesPerView: 3, spaceBetween: 8 },
              640: { slidesPerView: 4, spaceBetween: 10 },
              1024: { slidesPerView: 5, spaceBetween: 12 },
            }}
          >
            {carData.images &&
              carData.images.map((carImage, i) => (
                <SwiperSlide key={i}>
                  {({ isActive }) => (
                    <div
                      className={`relative w-full aspect-video bg-custom-jet/50 rounded-xl overflow-hidden cursor-pointer transition-all duration-300 ${
                        isActive
                          ? 'opacity-100 ring-2 ring-custom-accent scale-95'
                          : 'opacity-50 hover:opacity-100'
                      }`}
                    >
                      {carImage && (
                        <Image
                          src={carImage}
                          alt={`Thumbnail ${i + 1}`}
                          fill
                          className="object-cover"
                          sizes="160px"
                        />
                      )}
                    </div>
                  )}
                </SwiperSlide>
              ))}
          </Swiper>
        </div>


        {/* <!-- Product info --> */}
        <div className="mx-auto max-w-2xl px-4 pb-16 pt-10 sm:px-6 lg:grid lg:max-w-7xl lg:grid-cols-3 lg:grid-rows-[auto,auto,1fr] lg:gap-x-8 lg:px-8 lg:pb-24 lg:pt-16">
          <div className="lg:col-span-2 lg:border-r lg:border-white/10 lg:pr-8">
            <div className="flex justify-between items-start">
              <h1 className="text-2xl font-display font-bold tracking-tight text-white sm:text-3xl mb-5">
                {`${carData.year}
                  ${carData.brand} 
                  ${carData.model}
                  ${carData.variant}`}
              </h1>
              <div className="flex gap-2">
                <SocialShare 
                  url={`/buy/${slug}`} 
                  title={`${carData.year} ${carData.brand} ${carData.model}`}
                  className="mr-2"
                />
                <button
                  onClick={toggleWishlist}
                  disabled={wishlistLoading}
                  className="p-3 rounded-full bg-custom-jet border border-white/10 hover:bg-white/5 transition"
                >
                  {inWishlist ? (
                    <FaHeart className="text-red-500 text-2xl" />
                  ) : (
                    <FaRegHeart className="text-white text-2xl hover:text-red-500" />
                  )}
                </button>
              </div>
            </div>
            <div
              className="mt-2"
              style={{
                display: 'grid',
                gap: '5px',
                gridTemplateColumns: 'repeat(auto-fit, minmax(100px, 1fr)',
              }}
            >
              <span className="flex items-center justify-center bg-custom-jet/50 border border-white/10 rounded-full px-3 py-1 text-sm font-semibold text-custom-platinum mr-2">
                {carData.fuelType}
              </span>
              <span className="flex items-center justify-center bg-custom-jet/50 border border-white/10 rounded-full px-3 py-1 text-sm font-semibold text-custom-platinum mr-2">
                {carData.vehicleNumber}
              </span>
              <span className="flex items-center justify-center bg-custom-jet/50 border border-white/10 rounded-full px-3 py-1 text-sm font-semibold text-custom-platinum mr-2">
                {toTitleCase(carData.transmissionType)}
              </span>
              <span className="flex items-center justify-center bg-custom-jet/50 border border-white/10 rounded-full px-3 py-1 text-sm font-semibold text-custom-platinum mr-2">
                {getOwnerShipSuffix(carData.ownership)}
              </span>
              <div className="flex items-center justify-center bg-custom-jet/50 border border-white/10 rounded-full px-3 py-1 text-sm font-semibold text-custom-platinum mr-2 text-center">
                {`${carData.type}`}
              </div>
              <span className="flex items-center justify-center bg-custom-jet/50 border border-white/10 rounded-full px-3 py-1 text-sm font-semibold text-custom-platinum mr-2">
                {`${carData.kmDriven}km`}
              </span>
            </div>
          </div>

          <div className="mt-8 lg:row-span-3 lg:mt-0">
            {/* Certified Badge */}
            <CertifiedBadge />
            
            <p className="text-3xl tracking-tight text-white">
              <span className="font-light">Price: </span>
              <span className="font-semibold">
                ₹{AmountWithCommas(carData.price)}
              </span>
            </p>
            
            {/* Price Breakdown */}
            <PriceBreakdown basePrice={carData.price} />
            
            {/* Real-time View Counter */}
            <div className="mt-4">
              <ViewCounter listingId={carData._id} initialCount={carData.viewCount || 0} />
            </div>

            <div className="flex justify-between text-base mt-8">
              <p className="text-lg font-bold text-custom-accent">
                EMI starts at ₹
                {AmountWithCommas(EMICalcLite(carData.price * 0.7, 10, 60))}/month
              </p>
              <a
                href="#emiSection"
                className="text-md font-light text-custom-accent hover:text-yellow-400 underline pb-1"
              >
                Learn More
              </a>
            </div>

            {/* Zero downpayment with yelllow underline */}
            <p className="text-lg font-semibold text-custom-platinum">
              Zero downpayment
            </p>

            {/* Desktop Buttons */}
            <div className="hidden md:block space-y-4 mt-10">
              <button
                className="flex w-full items-center justify-center rounded-md border border-custom-accent text-custom-black bg-custom-accent px-8 py-3 text-base font-bold hover:bg-yellow-400 hover:border-transparent focus:outline-none focus:ring-2 focus:!ring-yellow-500 focus:ring-transparent"
                onClick={showModal}
              >
                Book Test Drive
              </button>
              
              <button
                className="flex w-full items-center gap-2 justify-center rounded-md border border-white/20 text-white bg-custom-jet/50 px-8 py-3 text-base font-bold hover:bg-custom-jet hover:border-white/40 focus:outline-none focus:ring-2 focus:ring-white/50"
                onClick={() => setOfferOpen(true)}
              >
                Make an Offer
              </button>
            </div>

            {/* Mobile Sticky Bottom Bar */}
            <div className="fixed bottom-0 left-0 right-0 z-50 md:hidden flex">
              <button
                className="flex-1 items-center justify-center border-t border-white/10 bg-custom-jet text-white px-4 py-4 text-base font-bold hover:bg-custom-jet/80 active:bg-custom-jet/60 transition-colors"
                onClick={() => setOfferOpen(true)}
              >
                Make Offer
              </button>
              <button
                className="flex-1 items-center justify-center bg-custom-accent text-custom-black px-4 py-4 text-base font-bold hover:bg-yellow-400 active:bg-yellow-500 transition-colors"
                onClick={showModal}
              >
                Book Test Drive
              </button>
            </div>

            {/* Price Alerts */}
            <div className="mt-4">
              <PriceAlerts 
                listingId={carData._id} 
                currentPrice={carData.price}
                carName={`${carData.brand} ${carData.model} ${carData.variant}`}
              />
            </div>

            {/* Make Offer Modal */}
            <Modal
              title="Make an Offer"
              open={offerOpen}
              confirmLoading={confirmLoading}
              onCancel={() => setOfferOpen(false)}
              footer={null}
            >
               {confirmLoading ? (
                <div className="p-10 flex flex-col items-center justify-center">
                  <Oval color="#F59E0B" height={50} width={50} secondaryColor="#78350f" />
                  <p className="mt-4 text-gray-500">Submitting your offer...</p>
                </div>
              ) : offerSuccess ? (
                <div className="text-center p-10">
                  <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-green-100 mb-4">
                    <svg className="h-6 w-6 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <h3 className="text-lg leading-6 font-medium text-gray-900">Offer Sent!</h3>
                  <p className="mt-2 text-sm text-gray-500">
                    We've received your offer. Our team will review it and get back to you shortly!
                  </p>
                </div>
              ) : (
                  <form
                    onSubmit={(e) => {
                        e.preventDefault()
                        const formData = new FormData(e.target)
                        handleOfferSubmit({
                            name: formData.get('name'),
                            mobile: formData.get('mobile'),
                            offerPrice: formData.get('offerPrice')
                        })
                    }}
                    className="space-y-4 pt-4"
                  >
                    <div>
                        <label htmlFor="name" className="block text-sm font-medium text-gray-700">Name</label>
                        <input type="text" name="name" id="offer-name" required className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-custom-accent focus:ring-custom-accent sm:text-sm p-2 border" />
                    </div>
                    <div>
                        <label htmlFor="mobile" className="block text-sm font-medium text-gray-700">Mobile Number</label>
                        <input type="tel" name="mobile" id="offer-mobile" required pattern="[0-9]{10}" title="10 digit mobile number" className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-custom-accent focus:ring-custom-accent sm:text-sm p-2 border" />
                    </div>
                    <div>
                        <label htmlFor="offerPrice" className="block text-sm font-medium text-gray-700">Your Offer (₹)</label>
                        <input type="number" name="offerPrice" id="offer-price" required min="10000" className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-custom-accent focus:ring-custom-accent sm:text-sm p-2 border" placeholder="e.g. 450000" />
                    </div>
                    <button
                        type="submit"
                        id="offer-submit-btn"
                        className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-custom-black bg-custom-accent hover:bg-yellow-400 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-custom-accent"
                    >
                        Submit Offer
                    </button>
                  </form>
              )}
            </Modal>

            <Modal
              title="Book Test Drive"
              open={open}
              confirmLoading={confirmLoading}
              onCancel={handleCancel}
              footer={null}
            >
              {confirmLoading ? (
                <>
                  <BookingCard sendDataToParent={handleChildData} />
                  <div className="p-5 flex items-center justify-center">
                    <Oval
                      color="#F59E0B"
                      height={50}
                      width={50}
                      secondaryColor="#78350f"
                    />
                  </div>
                </>
              ) : success ? (
                <div className="text-center">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    className="h-10 w-10 text-green-500 mx-auto"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                  <p className="mt-3 font-bold text-lg">Booking successful!</p>
                  <p className="mt-3 font-normal text-lg">
                    Our exec will contact you! 🚀
                  </p>
                </div>
              ) : (
                <BookingCard sendDataToParent={handleChildData} />
              )}
            </Modal>
          </div>

          <div className="py-10 lg:col-span-2 lg:col-start-1 lg:border-r lg:border-white/10 lg:pb-16 lg:pr-8 lg:pt-6">
            <div className="mt-2">
              <div className="bg-custom-jet/30 border border-white/10 p-4 rounded-lg mt-4">
                <h2 className="text-lg font-semibold text-white mb-2">
                  Features
                </h2>
                <ul>
                  {carData.features &&
                    carData.features.map((feature, i) => (
                      <li
                        key={i}
                        className="
                        md:inline-block md:mr-4 md:w-max md:ml-0 md:translate-x-0
                        block w-[80%] my-2 ml-[50%] -translate-x-[50%] py-2
                        text-white inline-block bg-custom-jet border border-white/10 rounded-full px-3 md:py-1 text-sm font-semibold text-center"
                      >
                        {feature}
                      </li>
                    ))}
                </ul>
              </div>
            </div>

            <div className="mt-8">
              <div className="bg-custom-jet/30 border border-white/10 p-4 rounded-lg mt-4">
                <h2 className="text-lg font-semibold text-white mb-2">
                  Specifications
                </h2>
                <div>
                  {carData.displacement && (
                    <div className="items-center block lg:inline-block my-3 md:w-[45%] ">
                      <div className="px-2 inline">
                        <Image
                          src={disp}
                          alt="disp"
                          width={30}
                          height={30}
                          className="inline  mr-2"
                        />
                        <span className="text-white inline text-md">
                          <span className="font-bold">Displacement</span>:{' '}
                          <span className="text-custom-platinum font-semibold">
                            {carData.displacement} cc
                          </span>
                        </span>
                      </div>
                    </div>
                  )}

                  {carData.cylinders && (
                    <div className="items-center block lg:inline-block my-3 md:w-[45%] ">
                      <div className="px-2 inline">
                        <BiCylinder
                          size={20}
                          className="text-custom-platinum mx-1 mr-4 inline"
                        />
                        <span className="text-white inline text-md">
                          <span className="font-bold">No. of cylinders: </span>
                          <span className="text-custom-platinum font-semibold">
                            {carData.cylinders}
                          </span>
                        </span>
                      </div>
                    </div>
                  )}

                  {carData.maxPower && (
                    <div className="items-center block lg:inline-block my-3 md:w-[45%] ">
                      <div className="px-2 inline">
                        <FaBoltLightning
                          size={20}
                          className="text-custom-platinum mx-1 mr-4 inline"
                        />
                        <span className="text-white inline text-md">
                          <span className="font-bold">Max Power</span>:{' '}
                          <span className="text-custom-platinum font-semibold">
                            {' '}
                            {carData.maxPower} BHP
                          </span>
                        </span>
                      </div>
                    </div>
                  )}

                  {carData.seats && (
                    <div className="items-center block lg:inline-block my-3 md:w-[45%] ">
                      <div className="px-2 inline">
                        <MdAirlineSeatReclineNormal
                          size={30}
                          className="text-custom-platinum mx-1 mr-2 inline"
                        />
                        <span className="text-white inline text-md">
                          <span className="font-bold">Seats</span>:{' '}
                          <span className="text-custom-platinum font-semibold">
                            {carData.seats}
                          </span>
                        </span>
                      </div>
                    </div>
                  )}

                  {carData.bootspace && (
                    <div className="items-center block lg:inline-block my-3 md:w-[45%] ">
                      <div className="px-2 inline">
                        <Image
                          src={trunk}
                          alt="trunk"
                          className="inline mx-2 mr-4"
                          width={20}
                          height={20}
                        />
                        <span className="text-white inline text-md">
                          <span className="font-bold">Bootspace</span>:{' '}
                          <span className="text-custom-platinum font-semibold">
                            {' '}
                            {carData.bootspace} L
                          </span>
                        </span>
                      </div>
                    </div>
                  )}

                  {carData.fuelTank && (
                    <div className="items-center block lg:inline-block my-3 md:w-[45%] ">
                      <div className="px-2 inline">
                        <BsFuelPumpFill
                          size={20}
                          className="text-custom-platinum mx-2 mr-4 inline"
                        />
                        <span className="text-white inline text-md">
                          <span className="font-bold">Fuel-Tank</span>:{' '}
                          <span className="text-custom-platinum font-semibold">
                            {carData.fuelTank} L
                          </span>
                        </span>
                      </div>
                    </div>
                  )}

                  {carData.gears && (
                    <div
                      className="items-center block lg:inline-block my-3 md:w-[45%]"
                      id="emiSection"
                    >
                      <div className="px-2 inline">
                        <PiGearSixFill
                          size={20}
                          className="text-custom-platinum inline mx-2 mr-4"
                        />
                        <span className="text-white inline text-md">
                          <span className="font-bold">No. of Gears</span>:{' '}
                          <span className="text-custom-platinum font-semibold">
                            {carData.gears}
                          </span>
                        </span>
                      </div>
                    </div>
                  )}

                  {carData.mileage && (
                    <div className="items-center block lg:inline-block my-3 md:w-[45%] ">
                      <div className="px-2 inline">
                        <Image
                          src={mileage}
                          alt="mileage"
                          width={30}
                          height={30}
                          className="inline mx-1 mr-2"
                        />
                        <span className="text-white inline text-md">
                          <span className="font-bold">Mileage</span>:{' '}
                          <span className="text-custom-platinum font-semibold">
                            {carData.mileage} kmpl
                          </span>
                        </span>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* <div>
              <Tabs
                defaultActiveKey="1"
                type="card"
                size="middle"
                items={new Array(3).fill(null).map((_, i) => {
                  const id = String(i + 1)
                  return {
                    label: `Card Tab ${id}`,
                    key: id,
                    children: `Content of card tab ${id}`,
                  }
                })}
              />
            </div> */}
            <h1 className="text-2xl font-display font-bold tracking-tight text-white sm:text-3xl mt-10 mb-2">
              Customize your <span className="text-custom-accent">EMI</span>
            </h1>
            <div className="w-[100%]">
              <EMICalculator indiPrincipal={carData.price} />
            </div>

            {/* Exchange Widget */}
            <div className="mt-10 rounded-2xl bg-gradient-to-r from-custom-jet to-custom-jet/50 border border-white/10 p-6 relative overflow-hidden group">
              <div className="absolute top-0 right-0 w-32 h-32 bg-custom-accent/10 rounded-full blur-3xl -mr-10 -mt-10 transition-all group-hover:bg-custom-accent/20"></div>
              
              <div className="relative z-10">
                <div className="flex items-start justify-between sm:items-center flex-col sm:flex-row gap-4">
                  <div>
                    <h3 className="text-xl font-bold text-white flex items-center gap-2">
                       <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6 text-custom-accent">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 12c0-1.232-.046-2.453-.138-3.662a4.006 4.006 0 00-3.7-3.7 48.678 48.678 0 00-7.324 0 4.006 4.006 0 00-3.7 3.7c-.017.22-.032.441-.046.662M19.5 12l3-3m-3 3l-3-3m-12 3c0 1.232.046 2.453.138 3.662a4.006 4.006 0 003.7 3.7 48.656 48.656 0 007.324 0 4.006 4.006 0 003.7-3.7c.017-.22.032-.441.046-.662M4.5 12l3 3m-3-3l-3 3" />
                      </svg>
                      Exchange Your Old Car
                    </h3>
                    <p className="text-gray-300 mt-2 max-w-md">
                      Upgrade to this {carData.model} easily! Get the best market price for your existing car with our hassle-free exchange process.
                    </p>
                  </div>
                  <Link href="/sell" className="shrink-0">
                    <button className="px-6 py-2.5 bg-white text-custom-black font-bold rounded-lg hover:bg-gray-100 transition shadow-lg whitespace-nowrap">
                      Check Exchange Value
                    </button>
                  </Link>
                </div>
              </div>
            </div>

            {/* FAQ Section */}
            <div className="mt-12">
               <h2 className="text-2xl font-display font-bold text-white mb-6">Frequently Asked Questions</h2>
               <div className="space-y-4">
                  {[
                    {
                      q: "Is the price negotiable?",
                      a: "We believe in transparency. While our prices are competitive, we are open to reasonable discussions. You can use the 'Make Offer' button to submit your best price!"
                    },
                    {
                      q: "Do you facilitate financing/Old Car Exchange?",
                      a: "Yes! We offer up to 90% financing through our banking partners with flexible EMI options. We also offer the best exchange value for your old car."
                    },
                    {
                      q: "Is there a warranty on this car?",
                      a: "Absolutely. Every Poddar Motors certified car comes with a comprehensive warranty (engine & gearbox) for your peace of mind."
                    },
                    {
                      q: "How long does RC transfer take?",
                      a: "The RC transfer process generally takes 25-30 working days, handled entirely by our team."
                    }
                  ].map((faq, idx) => (
                     <details key={idx} className="group bg-custom-jet/30 border border-white/10 rounded-xl overflow-hidden [&_summary::-webkit-details-marker]:hidden">
                        <summary className="flex cursor-pointer items-center justify-between p-4 text-white group-hover:bg-custom-jet/50 transition">
                          <h3 className="font-semibold">{faq.q}</h3>
                          <span className="shrink-0 ml-1.5 p-1.5 text-gray-400 bg-white/5 rounded-full group-open:bg-white/10 transition">
                             <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 shrink-0 transition duration-300 group-open:-rotate-180" viewBox="0 0 20 20" fill="currentColor">
                                <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                              </svg>
                          </span>
                        </summary>
                        <div className="px-4 pb-4 pt-2 text-gray-300 border-t border-white/5">
                           <p>{faq.a}</p>
                        </div>
                     </details>
                  ))}
               </div>
            </div>
          </div>
        </div>

      {/* Happy Customers Section */}
      {testimonials.length > 0 && (
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-16 border-t border-white/10">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-2xl font-display font-bold text-white">
                Happy {carData.brand} {carData.model} Owners
              </h2>
              <p className="text-custom-platinum mt-2">
                See what others are saying about their experience
              </p>
            </div>
            <Link 
              href="/testimonials"
              className="text-custom-accent hover:text-yellow-400 font-medium flex items-center gap-2"
            >
              View All Stories <span aria-hidden="true">&rarr;</span>
            </Link>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {testimonials.slice(0, 3).map(testimonial => (
              <div key={testimonial._id} className="h-full">
                <TestimonialCard testimonial={testimonial} />
              </div>
            ))}
          </div>
        </div>
      )}

        {/* Similar Cars Section */}
        {similarCars.length > 0 && (
            <div className="mx-auto max-w-2xl px-4 pb-16 sm:px-6 lg:max-w-7xl lg:px-8 border-t border-white/10 pt-10">
                <h2 className="text-2xl font-bold tracking-tight text-white mb-6">Similar Cars You Might Like</h2>
                <div className="grid grid-cols-1 gap-x-6 gap-y-10 sm:grid-cols-2 lg:grid-cols-4 xl:gap-x-8">
                    {similarCars.map((car) => (
                         // Reusing FeaturedCard logic but simplified or importing it if possible.
                         // Since FeaturedCard is in components, let's try to import it at the top.
                         // Oh wait, I need to import FeaturedCard first.
                         // Let's assume I'll add the import in a separate chunk.
                         // Actually, I can just inline a simple card or use FeaturedCard if I import it.
                         // I will add the import in another chunk to be safe.
                         <div key={car._id} className="group relative">
                            <div className="aspect-h-1 aspect-w-1 w-full overflow-hidden rounded-md bg-gray-200 lg:aspect-none group-hover:opacity-75 lg:h-80">
                                {car.images && car.images[0] ? (
                                    <Image
                                        src={car.images[0]}
                                        alt={car.model}
                                        fill
                                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
                                        className="object-cover object-center"
                                    />
                                ) : (
                                    <div className="h-full w-full flex items-center justify-center bg-gray-800 text-gray-500">
                                        No Image
                                    </div>
                                )}
                            </div>
                            <div className="mt-4 flex justify-between">
                                <div>
                                    <h3 className="text-sm text-white">
                                        <Link href={`/buy/${car.slug || car._id}`}>
                                            <span aria-hidden="true" className="absolute inset-0" />
                                            {car.brand} {car.model}
                                        </Link>
                                    </h3>
                                    <p className="mt-1 text-sm text-gray-400">{car.variant}</p>
                                </div>
                                <p className="text-sm font-medium text-custom-accent">₹{AmountWithCommas(car.price)}</p>
                            </div>
                         </div>
                    ))}
                </div>
            </div>
        )}
      </div>
      {debugStats && (
        <div className="fixed bottom-0 left-0 bg-black text-white p-2 text-xs z-50 opacity-90 border border-red-500">
            Debug: All: {debugStats.allListings}, Similar: {debugStats.similarCars}, Err: {debugStats.error}
        </div>
      )}
    </div>
  )
}

export default CarListingClient
