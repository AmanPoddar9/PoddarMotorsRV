'use client'
import { useState, useEffect } from 'react'
import styles from '../styles/Sell.module.css'
import axios from 'axios'
import Head from 'next/head'
import { FaChevronDown, FaChevronUp } from 'react-icons/fa'
import { XMarkIcon } from '@heroicons/react/24/outline'
import FaqCard from '../components/FaqCard'
import {
  FaCheckCircle,
  FaPhone,
  FaMapMarkerAlt,
  FaCarSide,
  FaFileAlt,
  FaHandshake,
} from 'react-icons/fa'
import { FaCoins, FaClipboardCheck, FaMoneyCheckAlt } from 'react-icons/fa'
import FeaturedCars from '../FeaturedCars'
import { sellFAQData } from '../data/sellFAQs'
import Faq from '../components/Faq'
import landing from '@/images/sell/landing.jpeg'
import steps1 from '@/images/sell/steps1.jpeg'
import steps2 from '@/images/sell/steps2.jpeg'
import steps3 from '@/images/sell/steps3.jpeg'
import steps4 from '@/images/sell/steps4.jpeg'
import why1 from '@/images/sell/why1.jpeg'
import why2 from '@/images/sell/why2.jpeg'
import why3 from '@/images/sell/why3.jpeg'
import Image from 'next/image'

const SellRequestForm = () => {
  let url = 'https://poddar-motors-rv-hkxu.vercel.app/'
  // url = "http://localhost:5000/";
  const [showForm, setShowForm] = useState(false)
  const [showModal, setShowModal] = useState(false)
  const [formData, setFormData] = useState({
    name: '',
    phoneNumber: '',
    email: '',
    location: '',
    registrationNumber: '',
    brand: '',
    model: '',
    variant: '',
    manufactureYear: '',
    kilometers: '',
    price: '',
  })

  useEffect(() => {
    if (showForm) {
      document.body.classList.add('no-scroll')
    } else {
      document.body.classList.remove('no-scroll')
    }

    return () => {
      document.body.classList.remove('no-scroll')
    }
  }, [showForm])

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    // Check for compulsory fields
    const compulsoryFields = [
      'name',
      'phoneNumber',
      'location',
      'registrationNumber',
      'brand',
      'model',
      'manufactureYear',
      'kilometers',
    ]
    const missingFields = compulsoryFields.filter((field) => !formData[field])

    if (missingFields.length > 0) {
      alert(`Please fill in the following fields: ${missingFields.join(', ')}`)
      return
    }

    try {
      await axios.post(url + 'api/sellRequests', formData)
      // Clear form after submission
      setShowForm(false)
      setShowModal(true)
      setTimeout(() => {
        setShowModal(false)
      }, 2000)
      setFormData({
        name: '',
        phoneNumber: '',
        email: '',
        location: '',
        registrationNumber: '',
        brand: '',
        model: '',
        variant: '',
        manufactureYear: '',
        kilometers: '',
        price: '',
      })
    } catch (error) {
      console.error('Error submitting sell request:', error)
      alert('Error submitting sell request. Please try again later.')
    }
  }

  const stepsToSell = [
    {
      title: 'Digital Verification',
      subTitle: 'Submit the above form',
      image: steps1,
      description: 'Step 1: Submit the above form.',
    },
    {
      title: 'Call Our Purchase Expert',
      subTitle: 'Get valuation instantly',
      image: steps2,
      description: 'Step 2: Our Purchase team will call you',
    },
    {
      title: 'Physical Inspection',
      subTitle: '',
      image: steps3,
      description: 'Step 3: Bring your car for physical inspection',
    },
    {
      title: 'Car Pickup and Payment',
      subTitle: '',
      image: steps4,
      description: 'Step 4: Instant payment and Paperwork.',
    },
  ]

  const whySellToUs = [
    {
      title: 'Best Price',
      image: why1,
      description: 'Get the maximum price for your car GUARANTEED',
    },
    {
      title: 'Hassle Free',
      image: why2,
      description:
        'All paperwork and transfer regulations will be taken care of by us',
    },
    {
      title: 'Instant Payment',
      image: why3,
      description:
        'No hidden charges and complete payment will be made upfront and instantly',
    },
  ]

  return (
    <>
      <Head>
        <title>
          Sell Your Car Fast | Get the Best Price Instantly | Real Value
        </title>
        <meta
          name="description"
          content="Quickly sell your car with Poddar Motors. Get the best price and enjoy a hassle-free process. Submit your details for an instant valuation!"
        />

        <meta
          name="keywords"
          content="sell used car, car valuation, fast car sale, best car price, instant payment for cars, hassle-free car selling , sell car in ranchi, get car valuation, car for sale, sell my car, get car valuation, car dealerships in ranchi, sell car in Ranchi, sell car in Bokaro, Sell car in Jamshedpur, car sales"
        />

        <meta
          property="og:title"
          content="Sell Your Car | Best Price & Instant Payment | Poddar Motors Real Value"
        />
        <meta
          property="og:description"
          content="Sell your car quickly and easily with Real Value. Get the best price, hassle-free process, and instant payment."
        />
        <meta property="og:image" content="/path-to-your-image.jpg" />
        <meta
          property="og:url"
          content="https://poddar-motors-rv-hkxu.vercel.app/sell"
        />
        <meta name="twitter:card" content="summary_large_image" />
        <meta
          name="twitter:title"
          content="Sell Your Car | Best Price & Instant Payment | Real Value"
        />
        <meta
          name="twitter:description"
          content="Sell your car quickly and easily with Real Value. Get the best price, hassle-free process, and instant payment."
        />
        <meta name="twitter:image" content="/path-to-your-image.jpg" />
        <link
          rel="canonical"
          href="https://poddar-motors-rv-hkxu.vercel.app/sell"
        />
      </Head>
      <div className="text-left md:px-6 bg-custom-black text-custom-seasalt overflow-x-hidden py-16 pt-8">
        <div className="flex flex-col md:flex-row max-w-screen-xl mx-auto md:space-x-8">
          {/* Left Section - Heading */}
          <div className="md:w-1/2 mb-8 md:mb-0">
            <h1 className="text-left mb-4 pt-4 text-4xl font-bold text-custom-yellow md:text-5xl">
              Sell Quick With Poddar Motors Real Value & get instant valuation
            </h1>
          </div>

          {/* Right Section - Image and Button */}
          <div className="md:w-1/2 flex items-center justify-center">
            <div className="flex flex-col items-center justify-center border-2 border-opacity-30 border-custom-seasalt rounded-md relative w-full">
              <Image
                src={landing}
                alt="Landing image for selling cars"
                className="md:h-[60vh] md:w-auto w-[90vw] h-auto"
              />

              <button
                onClick={() => setShowForm(!showForm)}
                className="bg-custom-yellow text-custom-black hover:bg-custom-black hover:text-white text-xl 
  border border-transparent md:px-16 md:py-4 px-10 py-2 rounded transition duration-300"
              >
                Get Valuation!
              </button>
            </div>
          </div>
        </div>

        {/* Modal Form */}
        {showForm && (
          <div className="modal">
            <form
              className="grid grid-cols-1 gap-4 p-4 bg-custom-gray rounded-lg shadow-lg"
              onSubmit={handleSubmit}
            >
              <div className="flex items-center justify-between">
                <h3 className="font-bold text-2xl text-custom-seasalt">
                  Valuation Form
                </h3>
                <button onClick={() => setShowForm(false)}>
                  <XMarkIcon
                    className="h-6 w-6 text-custom-seasalt"
                    aria-hidden="true"
                  />
                </button>
              </div>
              <div>
                <div className="md:inline-block md:w-[50%] md:px-2 md:py-0 py-3">
                  <label className="font-normal text-sm">Name *</label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    className="p-2 border border-custom-jet rounded text-black w-full"
                    required
                  />
                </div>
                <div className="md:inline-block md:w-[50%] md:px-2 md:py-0 py-3">
                  <label className="font-normal text-sm">Phone Number *</label>
                  <input
                    type="text"
                    name="phoneNumber"
                    value={formData.phoneNumber}
                    onChange={handleChange}
                    className="w-full p-2 border border-custom-jet rounded text-black"
                    pattern="^(?:\+?91\s?)?0?[0-9]{10}$"
                    title="8709119090"
                    required
                  />
                </div>
              </div>

              <div>
                <div className="md:inline-block md:w-[50%] md:px-2 md:py-0 py-3">
                  <label className="font-normal text-sm">Email</label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    className="w-full p-2 border border-custom-jet rounded text-black"
                  />
                </div>
                <div className="md:inline-block md:w-[50%] md:px-2 md:py-0 py-3">
                  <label className="font-normal text-sm">Location *</label>
                  <input
                    type="text"
                    name="location"
                    value={formData.location}
                    onChange={handleChange}
                    className="w-full p-2 border border-custom-jet rounded text-black"
                    required
                  />
                </div>
              </div>

              <div>
                <div className="md:inline-block md:w-[50%] md:px-2 md:py-0 py-3">
                  <label className="font-normal text-sm">
                    Registration Number *
                  </label>
                  <input
                    type="text"
                    name="registrationNumber"
                    value={formData.registrationNumber}
                    onChange={handleChange}
                    className="w-full p-2 border border-custom-jet rounded text-black"
                    required
                    maxLength={10}
                  />
                </div>

                <div className="md:inline-block md:w-[50%] md:px-2 md:py-0 py-3">
                  <label className="font-normal text-sm">Brand *</label>
                  <input
                    type="text"
                    name="brand"
                    value={formData.brand}
                    onChange={handleChange}
                    className="w-full p-2 border border-custom-jet rounded text-black"
                    required
                  />
                </div>
              </div>

              <div>
                <div className="md:inline-block md:w-[50%] md:px-2 md:py-0 py-3">
                  <label className="font-normal text-sm">Model *</label>
                  <input
                    type="text"
                    name="model"
                    value={formData.model}
                    onChange={handleChange}
                    className="w-full p-2 border border-custom-jet rounded text-black"
                    required
                  />
                </div>
                <div className="md:inline-block md:w-[50%] md:px-2 md:py-0 py-3">
                  <label className="font-normal text-sm">Variant</label>
                  <input
                    type="text"
                    name="variant"
                    value={formData.variant}
                    onChange={handleChange}
                    className="w-full p-2 border border-custom-jet rounded text-black"
                  />
                </div>
              </div>

              <div>
                <div className="md:inline-block md:w-[50%] md:px-2 md:py-0 py-3">
                  <label className="font-normal text-sm">
                    Manufacture Year *
                  </label>
                  <input
                    type="number"
                    name="manufactureYear"
                    value={formData.manufactureYear}
                    onChange={handleChange}
                    className="w-full p-2 border border-custom-jet rounded text-black"
                    required
                  />
                </div>
                <div className="md:inline-block md:w-[50%] md:px-2 md:py-0 py-3">
                  <label className="font-normal text-sm">Kilometers *</label>
                  <input
                    type="number"
                    name="kilometers"
                    value={formData.kilometers}
                    onChange={handleChange}
                    className="w-full p-2 border border-custom-jet rounded text-black"
                    required
                  />
                </div>
              </div>

              <label className="font-normal text-sm">Expected Price</label>
              <input
                type="number"
                name="price"
                value={formData.price}
                onChange={handleChange}
                className="w-full p-2 border border-custom-jet rounded text-black"
              />
              <button
                type="submit"
                className="bg-custom-jet text-custom-seasalt hover:bg-custom-yellow hover:text-custom-jet  px-6 py-2 rounded"
              >
                Get Valuation
              </button>
            </form>
          </div>
        )}
      </div>

      <div className="text-left md:px-6 bg-custom-seasalt text-custom-black overflow-x-hidden pb-16 pt-0">
        <div className="max-w-screen-xl mx-auto">
          <div className="font-semibold text-3xl my-8  mt-20 md:px-0 px-4">
            Steps To Sell Your Car
          </div>
          <div className="">
            {stepsToSell.map((step, index) => (
              <div
                key={index}
                className="
              md:inline-block 
              block w-[17rem] bg-custom-seasalt p-4 rounded-lg 
              shadow-md align-top mr-8 md:my-2 my-4 hover:scale-105  
              hover:shadow-xl  transition-transform duration-200
              md:ml-0 md:translate-x-0 
              ml-[50%] -translate-x-[50%]
              "
              >
                <div className="">
                  <Image
                    src={step.image}
                    alt="Car selling process, how to sell car?"
                  />
                  <p className="mt-2 text-center text-sm text-custom-black">
                    {step.description}{' '}
                    {/* This is where the description goes */}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="text-left md:px-6 bg-white text-custom-black overflow-x-hidden pb-16 pt-0">
        <div className="mt-20 max-w-screen-xl mx-auto">
          <div className="font-semibold text-3xl my-8 md:px-0 px-4">
            Why Sell Your Car To Us
          </div>
          <div className="">
            {whySellToUs.map((step, index) => (
              <div
                key={index}
                className="
              md:inline-block block  w-[20rem]
              bg-custom-seasalt p-4 rounded-lg shadow-md 
              align-top mr-8 md:my-2 my-4 
              hover:scale-105  hover:shadow-xl  transition-transform duration-200 
              md:ml-0 md:translate-x-0 
              ml-[50%] -translate-x-[50%]
              "
              >
                <Image src={step.image} />
                <p className="mt-2 text-center text-sm text-custom-black">
                  {step.description} {/* This is where the description goes */}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>

      <Faq FAQs={sellFAQData} title="Sell related" />

      {(showForm || showModal) && (
        <div className="fixed inset-0 text-lg bg-custom-black bg-opacity-50 z-10"></div>
      )}
      {showModal && (
        <>
          <div className="fixed top-1/4 left-1/2 transform text-black -translate-x-1/2 bg-custom-seasalt z-20 p-8 rounded text-center">
            <h4 className="font-semibold">
              Thank You for submitting your car details!
            </h4>
            <p className="text-sm">Our executive will reach out to you soon!</p>
          </div>
        </>
      )}
    </>
  )
}

export default SellRequestForm
