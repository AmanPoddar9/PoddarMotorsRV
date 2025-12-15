'use client'
import { useState } from 'react'
import Image from 'next/image'
import { motion, AnimatePresence } from 'framer-motion'
import {
  FaCheckCircle,
  FaMoneyBillWave,
  FaFileContract,
  FaPlus,
  FaMinus,
  FaWhatsapp,
  FaCheck,
  FaTimes,
  FaIdCard,
  FaFileAlt,
  FaKey,
  FaShieldAlt
} from 'react-icons/fa'
import { sellFAQData } from '../data/sellFAQs'
import SellTestimonials from '../components/SellTestimonials'
import { trackWhatsAppClick } from '../utils/analytics'
import SellRequestForm from '../components/SellRequestForm'

// Images
import landing from '../../images/sell/landing.jpeg'
import steps1 from '../../images/sell/steps1.jpeg'
import steps2 from '../../images/sell/steps2.jpeg'
import steps3 from '../../images/sell/steps3.jpeg'
import steps4 from '../../images/sell/steps4.jpeg'

const SellPageClient = () => {
  const [openFaqIndex, setOpenFaqIndex] = useState(null)

  const toggleFaq = (index) => {
    setOpenFaqIndex(openFaqIndex === index ? null : index)
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
                <SellRequestForm />
              )}
            </motion.div>
          </div>
        </div>

        {/* Choose Your Selling Plan Section */}
        <div className="py-20 bg-gradient-to-b from-custom-black to-gray-900">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">Choose Your Selling Plan</h2>
              <p className="text-gray-400 text-lg max-w-2xl mx-auto">
                Select the service that best fits your needs. From instant cash offers to premium auction listings.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {/* Plan 1: Instant Payment */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl p-6 hover:bg-white/10 hover:border-custom-yellow/50 transition-all duration-300"
              >
                <div className="text-center mb-4">
                  <div className="inline-block bg-green-500/20 text-green-400 px-4 py-1 rounded-full text-sm font-semibold mb-4">
                    FASTEST
                  </div>
                  <h3 className="text-xl font-bold text-white mb-2">Instant Payment</h3>
                  <div className="text-4xl font-bold text-custom-yellow mb-2">FREE</div>
                  <p className="text-gray-400 text-sm">Our Direct Quote</p>
                </div>

                <ul className="space-y-3 mb-6">
                  {[
                    'Get quote in 30 minutes',
                    'Instant cash payment',
                    'Free RC transfer',
                    'Zero commission',
                    'Quick doorstep pickup'
                  ].map((item, idx) => (
                    <li key={idx} className="flex items-start gap-2 text-gray-300 text-sm">
                      <FaCheck className="text-green-400 mt-1 flex-shrink-0" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>

                <a
                  href="https://wa.me/918709119090?text=Hi,%20I%20want%20an%20instant%20quote%20for%20my%20car."
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block w-full bg-custom-yellow text-custom-black font-bold py-3 rounded-lg text-center hover:bg-yellow-400 transition-colors"
                >
                  Get Instant Quote
                </a>
              </motion.div>

              {/* Plan 2: Inspection & Dealer Connection */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.1 }}
                className="bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl p-6 hover:bg-white/10 hover:border-custom-yellow/50 transition-all duration-300"
              >
                <div className="text-center mb-4">
                  <div className="inline-block bg-blue-500/20 text-blue-400 px-4 py-1 rounded-full text-sm font-semibold mb-4">
                    POPULAR
                  </div>
                  <h3 className="text-xl font-bold text-white mb-2">Inspection & Dealer</h3>
                  <div className="text-4xl font-bold text-custom-yellow mb-2">₹500</div>
                  <p className="text-gray-400 text-sm">Connect with Buyers</p>
                </div>

                <ul className="space-y-3 mb-6">
                  {[
                    '145-point inspection',
                    'Digital inspection report',
                    'Connect with 2-3 dealers',
                    'Best price comparison',
                    'Negotiation support'
                  ].map((item, idx) => (
                    <li key={idx} className="flex items-start gap-2 text-gray-300 text-sm">
                      <FaCheck className="text-blue-400 mt-1 flex-shrink-0" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>

                <a
                  href="/inspection/book"
                  className="block w-full bg-blue-600 text-white font-bold py-3 rounded-lg text-center hover:bg-blue-700 transition-colors"
                >
                  Book Inspection
                </a>
              </motion.div>

              {/* Plan 3: Inspection Report & Bidding */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.2 }}
                className="bg-white/5 backdrop-blur-md border-2 border-custom-yellow rounded-2xl p-6 hover:bg-white/10 transition-all duration-300 relative"
              >
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-custom-yellow text-custom-black px-4 py-1 rounded-full text-xs font-bold">
                  RECOMMENDED
                </div>
                
                <div className="text-center mb-4 mt-2">
                  <h3 className="text-xl font-bold text-white mb-2">Inspection & Bidding</h3>
                  <div className="text-4xl font-bold text-custom-yellow mb-2">₹999</div>
                  <p className="text-gray-400 text-sm">Live Auction Access</p>
                </div>

                <ul className="space-y-3 mb-6">
                  {[
                    '145-point inspection',
                    'Professional photo shoot',
                    'Live auction listing',
                    'Multiple dealer bids',
                    'Best market price guarantee',
                    'Full transparency'
                  ].map((item, idx) => (
                    <li key={idx} className="flex items-start gap-2 text-gray-300 text-sm">
                      <FaCheck className="text-custom-yellow mt-1 flex-shrink-0" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>

                <a
                  href="/inspection/book"
                  className="block w-full bg-custom-yellow text-custom-black font-bold py-3 rounded-lg text-center hover:bg-yellow-400 transition-colors"
                >
                  Start Auction Process
                </a>
              </motion.div>

              {/* Plan 4: Premium Listing */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.3 }}
                className="bg-gradient-to-br from-purple-900/40 to-pink-900/40 backdrop-blur-md border border-purple-500/30 rounded-2xl p-6 hover:border-purple-500/60 transition-all duration-300"
              >
                <div className="text-center mb-4">
                  <div className="inline-block bg-purple-500/20 text-purple-400 px-4 py-1 rounded-full text-sm font-semibold mb-4">
                    PREMIUM
                  </div>
                  <h3 className="text-xl font-bold text-white mb-2">Premium Listing</h3>
                  <div className="text-4xl font-bold text-custom-yellow mb-2">₹1,500</div>
                  <p className="text-gray-400 text-sm">Maximum Exposure</p>
                </div>

                <ul className="space-y-3 mb-6">
                  {[
                    'Everything in ₹999 plan',
                    'Website listing featured',
                    'Social media promotion',
                    'WhatsApp dealer broadcast',
                    'Priority auction slot',
                    'Dedicated sales manager',
                    'Extended listing (30 days)'
                  ].map((item, idx) => (
                    <li key={idx} className="flex items-start gap-2 text-gray-300 text-sm">
                      <FaCheck className="text-purple-400 mt-1 flex-shrink-0" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>

                <a
                  href="https://wa.me/918709119090?text=Hi,%20I%20want%20the%20Premium%20Listing%20service%20for%20my%20car."
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block w-full bg-gradient-to-r from-purple-600 to-pink-600 text-white font-bold py-3 rounded-lg text-center hover:from-purple-700 hover:to-pink-700 transition-colors"
                >
                  Get Premium Service
                </a>
              </motion.div>
            </div>

            <div className="mt-12 bg-white/5 border border-white/10 rounded-xl p-6 text-center">
              <p className="text-gray-300 text-sm">
                💡 <span className="font-semibold">Not sure which plan to choose?</span> Contact our sales team and we'll help you select the best option for your car.
              </p>
              <a
                href="tel:+918709119090"
                className="inline-block mt-4 text-custom-yellow hover:text-yellow-400 font-semibold"
              >
                Call us: +91 87091 19090
              </a>
            </div>
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

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-20">
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

            {/* Documents Required Section */}
            <div className="bg-white rounded-2xl shadow-xl p-8 md:p-12">
              <div className="text-center mb-12">
                <h3 className="text-2xl md:text-3xl font-bold mb-4">Documents Required</h3>
                <p className="text-gray-600">Keep these documents handy for a smooth selling experience.</p>
              </div>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
                {[
                  { icon: <FaIdCard />, title: 'RC Book', desc: 'Original Registration Certificate' },
                  { icon: <FaShieldAlt />, title: 'Insurance', desc: 'Valid Insurance Policy' },
                  { icon: <FaIdCard />, title: 'ID Proof', desc: 'Aadhar Card / PAN Card' },
                  { icon: <FaKey />, title: 'Keys', desc: 'Both sets of keys (if available)' },
                  { icon: <FaFileAlt />, title: 'Service History', desc: 'Service Record (Optional)' },
                ].map((doc, idx) => (
                  <div key={idx} className="flex flex-col items-center text-center">
                    <div className="w-16 h-16 bg-custom-gray rounded-full flex items-center justify-center text-custom-yellow text-2xl mb-4">
                      {doc.icon}
                    </div>
                    <h4 className="font-bold text-lg mb-1">{doc.title}</h4>
                    <p className="text-sm text-gray-500">{doc.desc}</p>
                  </div>
                ))}
              </div>
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

            <div className="grid grid-cols-1 md:grid-cols-3 gap-10 mb-20">
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

            {/* Comparison Table */}
            <div className="max-w-5xl mx-auto bg-white/5 border border-white/10 rounded-2xl overflow-hidden">
              <div className="p-6 md:p-8">
                <h3 className="text-2xl font-bold text-center mb-8">Why We Are Better</h3>
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="border-b border-white/10 text-gray-400 text-sm uppercase tracking-wider">
                        <th className="py-4 px-4">Feature</th>
                        <th className="py-4 px-4 text-custom-yellow font-bold text-lg">Poddar Motors</th>
                        <th className="py-4 px-4">Local Dealer</th>
                        <th className="py-4 px-4">Private Sale</th>
                      </tr>
                    </thead>
                    <tbody className="text-gray-300">
                      {[
                        { feature: 'Best Price Guarantee', us: true, dealer: false, private: true },
                        { feature: 'Instant Payment', us: true, dealer: false, private: false },
                        { feature: 'Free RC Transfer', us: true, dealer: false, private: false },
                        { feature: 'Doorstep Inspection', us: true, dealer: false, private: false },
                        { feature: 'Zero Commission', us: true, dealer: false, private: true },
                        { feature: 'Hassle-Free Paperwork', us: true, dealer: false, private: false },
                      ].map((row, idx) => (
                        <tr key={idx} className="border-b border-white/5 hover:bg-white/5 transition-colors">
                          <td className="py-4 px-4 font-medium">{row.feature}</td>
                          <td className="py-4 px-4">
                            {row.us ? <FaCheck className="text-green-500 text-xl" /> : <FaTimes className="text-red-500" />}
                          </td>
                          <td className="py-4 px-4">
                            {row.dealer ? <FaCheck className="text-green-500" /> : <FaTimes className="text-red-500" />}
                          </td>
                          <td className="py-4 px-4">
                            {row.private ? <FaCheck className="text-green-500" /> : <FaTimes className="text-red-500" />}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Video Walkthrough Section */}
        <div className="py-20 bg-custom-seasalt">
          <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h2 className="text-3xl md:text-4xl font-bold text-custom-black mb-4">See How Easy It Is</h2>
            <p className="text-gray-600 mb-12">Watch our step-by-step guide on how to sell your car.</p>
            
            <div className="relative pt-[56.25%] rounded-2xl overflow-hidden shadow-2xl bg-black">
              {/* Placeholder for YouTube Video - Replace 'VIDEO_ID' with actual ID */}
              <iframe 
                className="absolute top-0 left-0 w-full h-full"
                src="https://www.youtube.com/embed/dQw4w9WgXcQ?si=adk123" 
                title="How to Sell Your Car"
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                allowFullScreen
              ></iframe>
            </div>
          </div>
        </div>

        {/* Testimonials Section */}
        <SellTestimonials />

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

      {/* Floating WhatsApp Button */}
      <a
        href="https://wa.me/918709119090?text=Hi,%20I%20want%20to%20sell%20my%20car.%20Please%20give%20me%20a%20valuation."
        target="_blank"
        rel="noopener noreferrer"
        onClick={() => trackWhatsAppClick('Sell Page Floating Button')}
        className="fixed bottom-6 right-6 bg-[#25D366] text-white p-4 rounded-full shadow-lg hover:scale-110 transition-transform duration-300 z-50 flex items-center gap-2 group"
      >
        <FaWhatsapp className="text-3xl" />
        <span className="max-w-0 overflow-hidden group-hover:max-w-xs transition-all duration-300 whitespace-nowrap font-bold">
          Get Valuation
        </span>
      </a>
    </>
  )
}

export default SellPageClient
