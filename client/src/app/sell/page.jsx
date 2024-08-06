'use client'
import { useState, useEffect } from 'react'
import Head from 'next/head' // Importing Head component
import styles from '../styles/Sell.module.css'
import axios from 'axios'
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
    },
    {
      title: 'Call Our Purchase Expert',
      subTitle: 'Get valuation instantly',
      image: steps2,
    },
    {
      title: 'Physical Inspection',
      subTitle: '',
      image: steps3,
    },
    {
      title: 'Car Pickup and Payment',
      subTitle: '',
      image: steps4,
    },
  ]

  const whySellToUs = [
    {
      title: 'Best Price',
      image: why1,
    },
    {
      title: 'Hassle Free',
      image: why2,
    },
    {
      title: 'Instant Payment',
      image: why3,
    },
  ]

  return (
    <>
      <Head>
        <title>Sell Your Car - Poddar Motors</title>
        <meta
          name="description"
          content="Sell your car quickly and easily with Poddar Motors. Get the best price for your used car in Ranchi and Dhanbad."
        />
        <meta
          name="keywords"
          content="sell car, used car, car valuation, best price for car, Poddar Motors, Ranchi, Dhanbad"
        />
        <meta name="author" content="Poddar Motors" />
        <meta property="og:title" content="Sell Your Car - Poddar Motors" />
        <meta
          property="og:description"
          content="Sell your car quickly and easily with Poddar Motors. Get the best price for your used car in Ranchi and Dhanbad."
        />
        <meta property="og:image" content={landing.src} />
        <meta
          property="og:url"
          content="https://poddar-motors-rv-hkxu.vercel.app/sell"
        />
        <meta name="twitter:title" content="Sell Your Car - Poddar Motors" />
        <meta
          name="twitter:description"
          content="Sell your car quickly and easily with Poddar Motors. Get the best price for your used car in Ranchi and Dhanbad."
        />
        <meta name="twitter:image" content={landing.src} />
        <meta name="twitter:card" content="summary_large_image" />
      </Head>

      <div className="text-left md:px-6 bg-custom-black text-custom-seasalt overflow-x-hidden py-16 pt-8">
        <div>
          <div className="text-left max-w-screen-xl mx-auto mb-4 pt-4 md:text-5xl text-3xl font-bold md:px-0 px-4">
            Sell Quick With Real Value
          </div>
          <div className="max-w-screen-xl mx-auto md:px-0 pl-[5vw]">
            <div className="flex flex-col items-center justify-center border-2 border-opacity-30 border-custom-seasalt rounded-md relative  mt-8 w-max">
              <Image
                src={landing}
                className="md:h-[60vh] md:w-auto w-[90vw] h-auto"
              />
              <button
                onClick={() => setShowForm(!showForm)}
                className="
            hover:bg-custom-yellow hover:text-custom-black text-xl 
            border-1 border-opacity-45 text-custom-seasalt md:px-16 md:py-4 px-10 py-2 w-[100%] h-[100%] 
            "
              >
                Get Valuation!
              </button>
            </div>
          </div>
        </div>

        {showForm && (
          <div className="modal">
            <form className="grid grid-cols-1 gap-4" onSubmit={handleSubmit}>
              <div className="flex items-center justify-between">
                <h3 className="font-bold text-2xl text-custom-seasalt">
                  Valuation Form
                </h3>
                <button onClick={() => setShowForm(false)}>
                  <XMarkIcon className="h-6 w-6 text-custom-seasalt" />
                </button>
              </div>
              <div>
                <label className="text-custom-seasalt" htmlFor="name">
                  Name
                </label>
                <input
                  className="border rounded p-2 w-full"
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                />
              </div>
              <div>
                <label className="text-custom-seasalt" htmlFor="phoneNumber">
                  Phone Number
                </label>
                <input
                  className="border rounded p-2 w-full"
                  type="tel"
                  id="phoneNumber"
                  name="phoneNumber"
                  value={formData.phoneNumber}
                  onChange={handleChange}
                  required
                />
              </div>
              <div>
                <label className="text-custom-seasalt" htmlFor="email">
                  Email
                </label>
                <input
                  className="border rounded p-2 w-full"
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                />
              </div>
              <div>
                <label className="text-custom-seasalt" htmlFor="location">
                  Location
                </label>
                <input
                  className="border rounded p-2 w-full"
                  type="text"
                  id="location"
                  name="location"
                  value={formData.location}
                  onChange={handleChange}
                  required
                />
              </div>
              <div>
                <label
                  className="text-custom-seasalt"
                  htmlFor="registrationNumber"
                >
                  Registration Number
                </label>
                <input
                  className="border rounded p-2 w-full"
                  type="text"
                  id="registrationNumber"
                  name="registrationNumber"
                  value={formData.registrationNumber}
                  onChange={handleChange}
                  required
                />
              </div>
              <div>
                <label className="text-custom-seasalt" htmlFor="brand">
                  Brand
                </label>
                <input
                  className="border rounded p-2 w-full"
                  type="text"
                  id="brand"
                  name="brand"
                  value={formData.brand}
                  onChange={handleChange}
                  required
                />
              </div>
              <div>
                <label className="text-custom-seasalt" htmlFor="model">
                  Model
                </label>
                <input
                  className="border rounded p-2 w-full"
                  type="text"
                  id="model"
                  name="model"
                  value={formData.model}
                  onChange={handleChange}
                  required
                />
              </div>
              <div>
                <label className="text-custom-seasalt" htmlFor="variant">
                  Variant
                </label>
                <input
                  className="border rounded p-2 w-full"
                  type="text"
                  id="variant"
                  name="variant"
                  value={formData.variant}
                  onChange={handleChange}
                />
              </div>
              <div>
                <label
                  className="text-custom-seasalt"
                  htmlFor="manufactureYear"
                >
                  Manufacture Year
                </label>
                <input
                  className="border rounded p-2 w-full"
                  type="number"
                  id="manufactureYear"
                  name="manufactureYear"
                  value={formData.manufactureYear}
                  onChange={handleChange}
                  required
                />
              </div>
              <div>
                <label className="text-custom-seasalt" htmlFor="kilometers">
                  Kilometers
                </label>
                <input
                  className="border rounded p-2 w-full"
                  type="number"
                  id="kilometers"
                  name="kilometers"
                  value={formData.kilometers}
                  onChange={handleChange}
                  required
                />
              </div>
              <div>
                <label className="text-custom-seasalt" htmlFor="price">
                  Expected Price (Optional)
                </label>
                <input
                  className="border rounded p-2 w-full"
                  type="number"
                  id="price"
                  name="price"
                  value={formData.price}
                  onChange={handleChange}
                />
              </div>
              <button
                type="submit"
                className="bg-custom-yellow text-custom-black py-2 px-4 rounded mt-4"
              >
                Submit
              </button>
            </form>
          </div>
        )}

        {showModal && (
          <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-75">
            <div className="bg-white p-8 rounded">
              <h2 className="text-2xl font-bold mb-4">
                Thank you for your submission!
              </h2>
              <p>We will get back to you shortly.</p>
            </div>
          </div>
        )}

        <div className="max-w-screen-xl mx-auto mt-16 text-left md:px-0 px-4">
          <div className="md:grid md:grid-cols-3 md:gap-8">
            {stepsToSell.map((step, index) => (
              <div
                key={index}
                className="flex flex-col items-center mb-8 md:mb-0"
              >
                <Image
                  src={step.image}
                  alt={`Step ${index + 1}`}
                  className="h-32 w-32 mb-4"
                />
                <h3 className="text-xl font-bold">{step.title}</h3>
                <p>{step.subTitle}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="max-w-screen-xl mx-auto mt-16 text-left md:px-0 px-4">
          <h2 className="text-2xl font-bold mb-8">Why Sell To Us?</h2>
          <div className="md:grid md:grid-cols-3 md:gap-8">
            {whySellToUs.map((reason, index) => (
              <div
                key={index}
                className="flex flex-col items-center mb-8 md:mb-0"
              >
                <Image
                  src={reason.image}
                  alt={`Why ${index + 1}`}
                  className="h-32 w-32 mb-4"
                />
                <h3 className="text-xl font-bold">{reason.title}</h3>
              </div>
            ))}
          </div>
        </div>

        <div className="max-w-screen-xl mx-auto mt-16 text-left md:px-0 px-4">
          <h2 className="text-2xl font-bold mb-8">
            Frequently Asked Questions
          </h2>
          <Faq faqs={sellFAQData} />
        </div>

        <div className="max-w-screen-xl mx-auto mt-16 text-left md:px-0 px-4">
          <FeaturedCars />
        </div>
      </div>
    </>
  )
}

export default SellRequestForm
