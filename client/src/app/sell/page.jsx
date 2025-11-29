'use client'
import { useState, useEffect } from 'react'
import axios from 'axios'
import Head from 'next/head'
import Image from 'next/image'
import { motion, AnimatePresence } from 'framer-motion'
import {
  FaCheckCircle,
  FaCar,
  FaMoneyBillWave,
  FaFileContract,
  FaChevronDown,
  FaChevronUp,
  FaPlus,
  FaMinus
} from 'react-icons/fa'
import { sellFAQData } from '../data/sellFAQs'

// Images
import landing from '../../images/sell/landing.jpeg'
import steps1 from '../../images/sell/steps1.jpeg'
import steps2 from '../../images/sell/steps2.jpeg'
import steps3 from '../../images/sell/steps3.jpeg'
import steps4 from '../../images/sell/steps4.jpeg'
import why1 from '../../images/sell/why1.jpeg'
import why2 from '../../images/sell/why2.jpeg'
import why3 from '../../images/sell/why3.jpeg'

const SellRequestForm = () => {
  const url = 'https://poddar-motors-rv-hkxu.vercel.app/'
  // const url = "http://localhost:5000/";

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

  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitSuccess, setSubmitSuccess] = useState(false)
  const [openFaqIndex, setOpenFaqIndex] = useState(null)

  const toggleFaq = (index) => {
    setOpenFaqIndex(openFaqIndex === index ? null : index)
  }

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setIsSubmitting(true)

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
      setIsSubmitting(false)
      return
    }

    try {
      await axios.post(url + 'api/sellRequests', formData)
      setSubmitSuccess(true)
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
      // Reset success message after 5 seconds
      setTimeout(() => setSubmitSuccess(false), 5000)
    } catch (error) {
      console.error('Error submitting sell request:', error)
      alert('Error submitting sell request. Please try again later.')
    } finally {
      setIsSubmitting(false)
    }
  }

  const stepsToSell = [
    {
      title: 'Digital Verification',
      subTitle: 'Submit details',
      image: steps1,
      description: 'Fill out the form to get started instantly.',
    },
    {
      title: 'Expert Valuation',
      subTitle: 'Get a quote',
      image: steps2,
      description: 'Our experts will call you with a fair estimate.',
    },
    {
      title: 'Inspection',
      subTitle: 'Physical check',
      image: steps3,
      description: 'Quick inspection at your doorstep or our hub.',
    },
    {
      title: 'Instant Payment',
      subTitle: 'Seal the deal',
      image: steps4,
      description: 'Receive payment instantly and we handle the paperwork.',
    },
  ]

  const whySellToUs = [
    {
      title: 'Best Price Guarantee',
      icon: <FaMoneyBillWave className="text-4xl text-custom-yellow mb-4" />,
      description: 'We ensure you get the highest market value for your car.',
    },
    {
      title: 'Hassle-Free Process',
      icon: <FaFileContract className="text-4xl text-custom-yellow mb-4" />,
      description: 'We handle all RC transfers and paperwork for you.',
    },
    {
      title: 'Instant Payment',
      icon: <FaCheckCircle className="text-4xl text-custom-yellow mb-4" />,
      description: 'Get paid immediately once the deal is finalized.',
    },
  ]

  return (
    <>
      <Head>
        <title>Sell Your Car | Best Price & Instant Payment | Poddar Motors</title>
        <meta
          name="description"
          content="Sell your car fast with Poddar Motors. Best price guaranteed, instant payment, and hassle-free paperwork."
        />
      </Head>

      <div className="bg-custom-black min-h-screen text-custom-seasalt font-sans overflow-x-hidden">
        {/* Hero Section */}
        <div className="relative min-h-[90vh] flex items-center justify-center py-20 px-4 sm:px-6 lg:px-8 overflow-hidden">
          {/* Background Elements */}
          <div className="absolute inset-0 z-0">
            <Image
              src={landing}
              alt="Sell your car background"
              layout="fill"
              objectFit="cover"
              className="opacity-20 blur-sm"
              priority
            />
            <div className="absolute inset-0 bg-gradient-to-b from-custom-black/80 via-custom-black/60 to-custom-black" />
          </div>

          <div className="relative z-10 max-w-7xl w-full mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            {/* Left Content */}
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              className="text-center lg:text-left"
            >
              <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight text-white mb-6 leading-tight">
                Sell Your Car <br />
                <span className="text-custom-yellow">In Minutes</span>
              </h1>
              <p className="text-lg md:text-xl text-gray-300 mb-8 max-w-2xl mx-auto lg:mx-0">
                Get the best market price, instant payment, and free RC transfer. 
                Experience the easiest way to sell your car today.
              </p>
              
              <div className="flex flex-wrap justify-center lg:justify-start gap-4 mb-8">
                {['Best Price', 'Instant Payment', 'Free RC Transfer'].map((item, index) => (
                  <div key={index} className="flex items-center bg-white/10 backdrop-blur-md px-4 py-2 rounded-full border border-white/20">
                    <FaCheckCircle className="text-custom-yellow mr-2" />
                    <span className="text-sm font-medium">{item}</span>
                  </div>
                ))}
              </div>
            </motion.div>

            {/* Right Form - Glassmorphism */}
            <motion.div
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="bg-white/10 backdrop-blur-lg border border-white/20 rounded-2xl p-6 md:p-8 shadow-2xl"
            >
              <div className="mb-6">
                <h2 className="text-2xl font-bold text-white mb-2">Get Instant Valuation</h2>
                <p className="text-gray-400 text-sm">Fill in the details to get started</p>
              </div>

              {submitSuccess ? (
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="bg-green-500/20 border border-green-500/50 rounded-xl p-8 text-center"
                >
                  <FaCheckCircle className="text-5xl text-green-400 mx-auto mb-4" />
                  <h3 className="text-2xl font-bold text-white mb-2">Request Submitted!</h3>
                  <p className="text-gray-200">
                    Thank you for choosing us. Our purchase expert will contact you shortly with the best offer.
                  </p>
                  <button 
                    onClick={() => setSubmitSuccess(false)}
                    className="mt-6 text-sm text-green-400 hover:text-green-300 underline"
                  >
                    Submit another request
                  </button>
                </motion.div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <input
                      type="text"
                      name="name"
                      placeholder="Your Name *"
                      value={formData.name}
                      onChange={handleChange}
                      className="w-full bg-custom-black/50 border border-gray-600 rounded-lg px-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:border-custom-yellow transition-colors"
                      required
                    />
                    <input
                      type="tel"
                      name="phoneNumber"
                      placeholder="Phone Number *"
                      value={formData.phoneNumber}
                      onChange={handleChange}
                      pattern="^(?:\+?91\s?)?0?[0-9]{10}$"
                      className="w-full bg-custom-black/50 border border-gray-600 rounded-lg px-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:border-custom-yellow transition-colors"
                      required
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <input
                      type="text"
                      name="brand"
                      placeholder="Car Brand (e.g. Maruti) *"
                      value={formData.brand}
                      onChange={handleChange}
                      className="w-full bg-custom-black/50 border border-gray-600 rounded-lg px-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:border-custom-yellow transition-colors"
                      required
                    />
                    <input
                      type="text"
                      name="model"
                      placeholder="Car Model (e.g. Swift) *"
                      value={formData.model}
                      onChange={handleChange}
                      className="w-full bg-custom-black/50 border border-gray-600 rounded-lg px-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:border-custom-yellow transition-colors"
                      required
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <input
                      type="number"
                      name="manufactureYear"
                      placeholder="Year (e.g. 2018) *"
                      value={formData.manufactureYear}
                      onChange={handleChange}
                      className="w-full bg-custom-black/50 border border-gray-600 rounded-lg px-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:border-custom-yellow transition-colors"
                      required
                    />
                    <input
                      type="text"
                      name="registrationNumber"
                      placeholder="Reg. Number (e.g. JH01...) *"
                      value={formData.registrationNumber}
                      onChange={handleChange}
                      className="w-full bg-custom-black/50 border border-gray-600 rounded-lg px-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:border-custom-yellow transition-colors"
                      required
                    />
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                     <input
                      type="text"
                      name="location"
                      placeholder="Location *"
                      value={formData.location}
                      onChange={handleChange}
                      className="w-full bg-custom-black/50 border border-gray-600 rounded-lg px-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:border-custom-yellow transition-colors"
                      required
                    />
                     <input
                      type="number"
                      name="kilometers"
                      placeholder="Kilometers Driven *"
                      value={formData.kilometers}
                      onChange={handleChange}
                      className="w-full bg-custom-black/50 border border-gray-600 rounded-lg px-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:border-custom-yellow transition-colors"
                      required
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full bg-custom-yellow text-custom-black font-bold text-lg py-4 rounded-lg hover:bg-yellow-400 transform hover:scale-[1.02] transition-all duration-200 shadow-lg disabled:opacity-70 disabled:cursor-not-allowed"
                  >
                    {isSubmitting ? 'Submitting...' : 'Get Valuation Now'}
                  </button>
                </form>
              )}
            </motion.div>
          </div>
        </div>

        {/* How It Works Section */}
        <div className="py-20 bg-custom-seasalt text-custom-black">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold mb-4">How It Works</h2>
              <p className="text-gray-600 max-w-2xl mx-auto">
                Selling your car has never been easier. Follow these simple steps to get the best deal.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {stepsToSell.map((step, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-2xl transition-shadow duration-300"
                >
                  <div className="h-48 relative">
                    <Image
                      src={step.image}
                      alt={step.title}
                      layout="fill"
                      objectFit="cover"
                    />
                  </div>
                  <div className="p-6">
                    <div className="text-custom-yellow font-bold text-xl mb-2">0{index + 1}</div>
                    <h3 className="text-xl font-bold mb-2">{step.title}</h3>
                    <p className="text-gray-600 text-sm">{step.description}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>

        {/* Why Sell To Us Section */}
        <div className="py-20 bg-custom-black text-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold mb-4">Why Sell To Poddar Motors?</h2>
              <div className="w-20 h-1 bg-custom-yellow mx-auto rounded-full"></div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
              {whySellToUs.map((item, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, scale: 0.9 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  className="bg-white/5 border border-white/10 rounded-xl p-8 text-center hover:bg-white/10 transition-colors duration-300"
                >
                  <div className="flex justify-center">{item.icon}</div>
                  <h3 className="text-xl font-bold mb-3">{item.title}</h3>
                  <p className="text-gray-400">{item.description}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </div>

        {/* FAQ Section */}
        <div className="py-20 bg-custom-seasalt">
          <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-3xl md:text-4xl font-bold text-center text-custom-black mb-12">
              Frequently Asked Questions
            </h2>
            <div className="space-y-4">
              {sellFAQData.map((faq, index) => (
                <div
                  key={index}
                  className="bg-white rounded-lg shadow-md overflow-hidden"
                >
                  <button
                    onClick={() => toggleFaq(index)}
                    className="w-full flex justify-between items-center p-6 text-left focus:outline-none"
                  >
                    <span className="text-lg font-semibold text-custom-black">
                      {faq.question}
                    </span>
                    {openFaqIndex === index ? (
                      <FaMinus className="text-custom-yellow" />
                    ) : (
                      <FaPlus className="text-custom-yellow" />
                    )}
                  </button>
                  <AnimatePresence>
                    {openFaqIndex === index && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.3 }}
                      >
                        <div className="px-6 pb-6 text-gray-600">
                          {faq.answer}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

export default SellRequestForm
