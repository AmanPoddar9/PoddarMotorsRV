'use client'
import React, { useState } from 'react'
import { motion } from 'framer-motion'
import Image from 'next/image'
import EMICalculator from '../components/EMICalculator'
import Brands from '../components/Brands'
import { financeFAQs } from '../data/financeFAQs'
import {
  FaCheckCircle,
  FaClock,
  FaShieldAlt,
  FaPercent,
  FaChevronDown,
  FaRocket,
  FaHandshake,
  FaFileAlt,
  FaMoneyCheckAlt,
  FaAddressCard,
  FaCar,
  FaCalculator
} from 'react-icons/fa'

export default function FinancePage() {
  const [openFaq, setOpenFaq] = useState(null)

  const benefits = [
    {
      icon: FaClock,
      title: 'Quick Approval',
      description: 'Get loan approval in as little as 30 minutes',
      gradient: 'from-blue-500 to-cyan-500'
    },
    {
      icon: FaPercent,
      title: 'Low Interest Rates',
      description: 'Competitive rates starting from 8.5% p.a.',
      gradient: 'from-green-500 to-emerald-500'
    },
    {
      icon: FaRocket,
      title: 'Fast Disbursal',
      description: 'Loan amount credited in 3-4 business days',
      gradient: 'from-orange-500 to-yellow-500'
    },
    {
      icon: FaShieldAlt,
      title: 'Secure Process',
      description: '100% safe and transparent documentation',
      gradient: 'from-purple-500 to-pink-500'
    }
  ]

  const steps = [
    {
      icon: FaAddressCard,
      number: '01',
      title: 'Share Documents',
      description: 'Submit basic KYC documents',
      items: ['Aadhar Card', 'PAN Card', 'ITR (2 years)', 'Passport Photo'],
      color: 'from-blue-500 to-cyan-500'
    },
    {
      icon: FaFileAlt,
      number: '02',
      title: 'Pre-Approval',
      description: 'Quick loan pre-approval',
      items: ['Book your car', 'Share bank statement', 'Get pre-approved'],
      color: 'from-green-500 to-emerald-500'
    },
    {
      icon: FaHandshake,
      number: '03',
      title: 'Loan Offer',
      description: 'Customize your loan',
      items: ['Choose EMI plan', 'Physical verification', 'Sign agreement'],
      color: 'from-orange-500 to-yellow-500'
    },
    {
      icon: FaMoneyCheckAlt,
      number: '04',
      title: 'Disbursement',
      description: 'Get your loan amount',
      items: ['Finance partner allocation', 'Amount credited in 3-4 days'],
      color: 'from-purple-500 to-pink-500'
    }
  ]

  return (
    <div className="bg-custom-black min-h-screen">
      {/* Hero Section with Custom Illustration */}
      <section className="relative pt-32 pb-20 px-4 sm:px-6 lg:px-8 overflow-hidden">
        {/* Animated Background Elements */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-20 right-0 w-96 h-96 bg-custom-accent/10 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute bottom-0 left-0 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>
        </div>

        <div className="max-w-7xl mx-auto relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ x: -50, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ duration: 0.8 }}
            >
              <div className="inline-flex items-center gap-2 bg-custom-accent/20 border border-custom-accent/30 rounded-full px-4 py-2 mb-6">
                <FaCheckCircle className="text-custom-accent" />
                <span className="text-custom-accent font-semibold text-sm">Trusted by 40,000+ Customers</span>
              </div>
              <h1 className="text-5xl md:text-7xl font-display font-bold text-white mb-6 leading-tight">
                Drive Your <span className="bg-gradient-to-r from-custom-accent to-yellow-400 bg-clip-text text-transparent">Dream Car</span> Today
              </h1>
              <p className="text-xl md:text-2xl text-custom-platinum mb-8 leading-relaxed">
                Get instant car loans with low interest rates, quick approval, and flexible EMI options. 
                Your journey to car ownership starts here.
              </p>
              <div className="flex flex-wrap gap-4">
                <a
                  href="#calculator"
                  className="group flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-custom-accent to-yellow-400 text-custom-black font-bold rounded-full hover:scale-105 transition-all shadow-lg shadow-custom-accent/30"
                >
                  <FaCalculator className="group-hover:rotate-12 transition-transform" />
                  Calculate EMI
                </a>
                <a
                  href="/buy"
                  className="flex items-center gap-2 px-8 py-4 bg-white/10 backdrop-blur-sm text-white font-bold rounded-full hover:bg-white/20 transition-all border border-white/20"
                >
                  <FaCar />
                  Browse Cars
                </a>
              </div>
            </motion.div>

            <motion.div
              initial={{ x: 50, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="relative"
            >
              <div className="relative">
                {/* Custom Generated Illustration */}
                <div className="absolute -inset-4 bg-gradient-to-r from-custom-accent/20 to-blue-500/20 rounded-3xl blur-2xl"></div>
                <Image
                  src="/Users/amanpoddar/.gemini/antigravity/brain/96f56e54-126a-46da-b825-138bda6b924f/finance_hero_illustration_1764527475786.png"
                  alt="Finance Hero"
                  width={600}
                  height={600}
                  className="relative rounded-3xl"
                />
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Benefits Carousel */}
      <section className="py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {benefits.map((benefit, index) => (
              <motion.div
                key={benefit.title}
                initial={{ y: 50, opacity: 0 }}
                whileInView={{ y: 0, opacity: 1 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1, duration: 0.6 }}
                className="group relative"
              >
                <div className={`absolute inset-0 bg-gradient-to-r ${benefit.gradient} opacity-0 group-hover:opacity-20 blur-xl transition-opacity duration-500`}></div>
                <div className="relative bg-custom-jet/50 backdrop-blur-md border border-white/10 rounded-2xl p-6 hover:border-custom-accent/50 transition-all text-center h-full">
                  <div className={`w-16 h-16 bg-gradient-to-r ${benefit.gradient} rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform shadow-lg`}>
                    <benefit.icon className="text-3xl text-white" />
                  </div>
                  <h3 className="text-lg font-bold text-white mb-2">{benefit.title}</h3>
                  <p className="text-custom-platinum text-sm">{benefit.description}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* EMI Calculator */}
      <section id="calculator" className="py-20 px-4 sm:px-6 lg:px-8 bg-custom-jet/20">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-6xl font-display font-bold text-white mb-4">
              Calculate Your <span className="text-custom-accent">EMI</span>
            </h2>
            <p className="text-xl text-custom-platinum max-w-2xl mx-auto">
              Plan your budget with our interactive EMI calculator
            </p>
          </motion.div>
          <EMICalculator />
        </div>
      </section>

      {/* Finance Partners */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-4xl md:text-5xl font-display font-bold text-white mb-4">
              Trusted <span className="text-custom-accent">Finance Partners</span>
            </h2>
            <p className="text-xl text-custom-platinum">
              Partnered with 10+ leading banks and NBFCs  for the best deals
            </p>
          </motion.div>
          <Brands />
        </div>
      </section>

      {/* Loan Process Steps */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-custom-jet/20">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-6xl font-display font-bold text-white mb-4">
              Simple <span className="text-custom-accent">4-Step</span> Process
            </h2>
            <p className="text-xl text-custom-platinum">
              From application to approval in minutes
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {steps.map((step, index) => (
              <motion.div
                key={step.title}
                initial={{ y: 50, opacity: 0 }}
                whileInView={{ y: 0, opacity: 1 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1, duration: 0.6 }}
                className="group relative"
              >
                <div className={`absolute inset-0 bg-gradient-to-r ${step.color} opacity-0 group-hover:opacity-20 blur-xl transition-opacity duration-500`}></div>
                
                <div className="relative bg-custom-jet/50 backdrop-blur-md border border-white/10 rounded-3xl p-8 hover:border-white/30 transition-all h-full">
                  {/* Large Step Number */}
                  <div className="absolute -top-6 -right-6">
                    <div className={`w-16 h-16 bg-gradient-to-r ${step.color} rounded-full flex items-center justify-center shadow-2xl`}>
                      <span className="text-white font-bold text-xl">{step.number}</span>
                    </div>
                  </div>

                  {/* Icon */}
                  <div className={`w-20 h-20 bg-gradient-to-r ${step.color} rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform shadow-lg`}>
                    <step.icon className="text-4xl text-white" />
                  </div>

                  {/* Content */}
                  <h3 className="text-2xl font-bold text-white mb-2">{step.title}</h3>
                  <p className="text-custom-platinum text-sm mb-4">{step.description}</p>

                  {/* Items List */}
                  <ul className="space-y-2">
                    {step.items.map((item, i) => (
                      <li key={i} className="flex items-start gap-2 text-custom-platinum text-sm">
                        <span className="text-custom-accent mt-1">✓</span>
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQs */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-4xl md:text-5xl font-display font-bold text-white mb-4">
              Got <span className="text-custom-accent">Questions?</span>
            </h2>
            <p className="text-xl text-custom-platinum">
              Find answers to common queries about car financing
            </p>
          </motion.div>

          <div className="space-y-4">
            {financeFAQs.map((faq, index) => (
              <motion.div
                key={index}
                initial={{ y: 20, opacity: 0 }}
                whileInView={{ y: 0, opacity: 1 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.05, duration: 0.4 }}
                className="bg-custom-jet/50 backdrop-blur-md border border-white/10 rounded-2xl overflow-hidden hover:border-custom-accent/50 transition-all"
              >
                <button
                  onClick={() => setOpenFaq(openFaq === index ? null : index)}
                  className="w-full flex items-center justify-between p-6 text-left group"
                >
                  <h3 className="text-lg font-semibold text-white pr-4 group-hover:text-custom-accent transition-colors">
                    {faq.question}
                  </h3>
                  <FaChevronDown
                    className={`text-custom-accent transition-transform flex-shrink-0 ${
                      openFaq === index ? 'rotate-180' : ''
                    }`}
                  />
                </button>
                {openFaq === index && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    className="px-6 pb-6"
                  >
                    <p className="text-custom-platinum leading-relaxed">
                      {faq.answer}
                    </p>
                  </motion.div>
                )}
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-custom-jet/20">
        <div className="max-w-4xl mx-auto">
          <motion.div
            initial={{ y: 50, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="relative overflow-hidden"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-custom-accent to-yellow-400 rounded-3xl blur-2xl opacity-20"></div>
            <div className="relative bg-custom-jet/50 backdrop-blur-md border border-white/10 rounded-3xl p-12 text-center">
              <h2 className="text-4xl font-bold text-white mb-6">
                Ready to Drive Home?
              </h2>
              <p className="text-xl text-custom-platinum mb-8">
                Get pre-approved for a loan in minutes. Our finance experts are ready to help!
              </p>
              <div className="flex flex-wrap justify-center gap-4">
                <a
                  href="/buy"
                  className="px-8 py-4 bg-gradient-to-r from-custom-accent to-yellow-400 text-custom-black font-bold rounded-full hover:scale-105 transition-all shadow-lg shadow-custom-accent/30"
                >
                  Browse Cars
                </a>
                <a
                  href="/contact"
                  className="px-8 py-4 bg-white/10 backdrop-blur-sm text-white font-bold rounded-full hover:bg-white/20 transition-all border border-white/20"
                >
                  Contact Us
                </a>
              </div>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  )
}
