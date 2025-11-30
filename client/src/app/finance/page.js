'use client'
import React, { useState } from 'react'
import { motion } from 'framer-motion'
import EMICalculator from '../components/EMICalculator'
import Brands from '../components/Brands'
import { financeFAQs } from '../data/financeFAQs'
import {
  FaAddressCard,
  FaFileAlt,
  FaHandshake,
  FaMoneyCheckAlt,
  FaCheckCircle,
  FaClock,
  FaShieldAlt,
  FaPercent,
  FaChevronDown
} from 'react-icons/fa'

export default function FinancePage() {
  const [openFaq, setOpenFaq] = useState(null)

  const benefits = [
    {
      icon: FaCheckCircle,
      title: 'Quick Approval',
      description: 'Get loan approval in as little as 30 minutes'
    },
    {
      icon: FaPercent,
      title: 'Low Interest Rates',
      description: 'Competitive rates starting from 8.5% p.a.'
    },
    {
      icon: FaClock,
      title: 'Fast Disbursal',
      description: 'Loan amount credited in 3-4 business days'
    },
    {
      icon: FaShieldAlt,
      title: 'Secure Process',
      description: '100% safe and transparent documentation'
    }
  ]

  const steps = [
    {
      icon: FaAddressCard,
      number: '1',
      title: 'Share Basic Details',
      items: [
        'Aadhar Card',
        'PAN Card',
        'Electricity Bill (if applicable)',
        'Rent Agreement (if applicable)',
        'Cheque Book',
        'Passport-sized Photo',
        'ITR (2 years)'
      ]
    },
    {
      icon: FaFileAlt,
      number: '2',
      title: 'Pre-Approval of Loan',
      items: [
        'Book the car of your choice',
        'Share bank statement up to 6 months'
      ]
    },
    {
      icon: FaHandshake,
      number: '3',
      title: 'Loan Offer',
      items: [
        'Customize EMI',
        'Physical Verification and KYC',
        'Loan Agreement'
      ]
    },
    {
      icon: FaMoneyCheckAlt,
      number: '4',
      title: 'Loan Disbursement',
      items: [
        'We contact our finance partners',
        'Loan credited in 3-4 business days'
      ]
    }
  ]

  return (
    <div className="bg-custom-black min-h-screen">
      {/* Hero Section */}
      <section className="relative pt-32 pb-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ y: 30, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.8 }}
            className="text-center"
          >
            <h1 className="text-5xl md:text-7xl font-display font-bold text-white mb-6">
              Quick & Easy <span className="text-custom-accent">Car Loans</span>
            </h1>
            <p className="text-xl md:text-2xl text-custom-platinum max-w-3xl mx-auto mb-12">
              Get your dream car with hassle-free financing. Low interest rates, 
              quick approval, and flexible EMI options.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Benefits Grid */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-custom-jet/20">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {benefits.map((benefit, index) => (
              <motion.div
                key={benefit.title}
                initial={{ y: 50, opacity: 0 }}
                whileInView={{ y: 0, opacity: 1 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1, duration: 0.6 }}
                className="bg-custom-jet/50 border border-white/10 rounded-2xl p-6 hover:border-custom-accent/50 transition-all text-center"
              >
                <div className="w-16 h-16 bg-custom-accent/20 rounded-full flex items-center justify-center mx-auto mb-4">
                  <benefit.icon className="text-3xl text-custom-accent" />
                </div>
                <h3 className="text-lg font-bold text-white mb-2">{benefit.title}</h3>
                <p className="text-custom-platinum text-sm">{benefit.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* EMI Calculator */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-4xl md:text-5xl font-display font-bold text-white mb-4">
              Calculate Your <span className="text-custom-accent">EMI</span>
            </h2>
            <p className="text-xl text-custom-platinum">
              Plan your budget with our easy EMI calculator
            </p>
          </motion.div>
          <EMICalculator />
        </div>
      </section>

      {/* Finance Partners */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-custom-jet/20">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-4xl md:text-5xl font-display font-bold text-white mb-4">
              Our <span className="text-custom-accent">Finance Partners</span>
            </h2>
            <p className="text-xl text-custom-platinum">
              Partnered with leading banks and NBFCs for the best deals
            </p>
          </motion.div>
          <Brands />
        </div>
      </section>

      {/* Loan Process Steps */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-display font-bold text-white mb-4">
              4-Step <span className="text-custom-accent">Loan Process</span>
            </h2>
            <p className="text-xl text-custom-platinum">
              Simple, fast, and hassle-free financing
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
                className="relative"
              >
                <div className="bg-custom-jet/50 border border-white/10 rounded-2xl p-6 hover:border-custom-accent/50 transition-all h-full">
                  {/* Step Number Badge */}
                  <div className="absolute -top-4 -right-4 w-12 h-12 bg-custom-accent rounded-full flex items-center justify-center text-custom-black font-bold text-xl shadow-lg">
                    {step.number}
                  </div>

                  {/* Icon */}
                  <div className="w-16 h-16 bg-custom-accent/20 rounded-full flex items-center justify-center mb-4">
                    <step.icon className="text-3xl text-custom-accent" />
                  </div>

                  {/* Title */}
                  <h3 className="text-xl font-bold text-white mb-4">{step.title}</h3>

                  {/* Items List */}
                  <ul className="space-y-2">
                    {step.items.map((item, i) => (
                      <li key={i} className="flex items-start gap-2 text-custom-platinum text-sm">
                        <span className="text-custom-accent mt-1">•</span>
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
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-custom-jet/20">
        <div className="max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-4xl md:text-5xl font-display font-bold text-white mb-4">
              Frequently Asked <span className="text-custom-accent">Questions</span>
            </h2>
            <p className="text-xl text-custom-platinum">
              Everything you need to know about car financing
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
                className="bg-custom-jet/50 border border-white/10 rounded-2xl overflow-hidden hover:border-custom-accent/50 transition-all"
              >
                <button
                  onClick={() => setOpenFaq(openFaq === index ? null : index)}
                  className="w-full flex items-center justify-between p-6 text-left"
                >
                  <h3 className="text-lg font-semibold text-white pr-4">
                    {faq.question}
                  </h3>
                  <FaChevronDown
                    className={`text-custom-accent transition-transform flex-shrink-0 ${
                      openFaq === index ? 'rotate-180' : ''
                    }`}
                  />
                </button>
                {openFaq === index && (
                  <div className="px-6 pb-6">
                    <p className="text-custom-platinum leading-relaxed">
                      {faq.answer}
                    </p>
                  </div>
                )}
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <motion.div
            initial={{ y: 50, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="bg-custom-jet/50 border border-white/10 rounded-3xl p-12 text-center"
          >
            <h2 className="text-4xl font-bold text-white mb-6">
              Ready to Drive Your Dream Car?
            </h2>
            <p className="text-xl text-custom-platinum mb-8">
              Get pre-approved for a loan today. Our team is here to help!
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <a
                href="/buy"
                className="px-8 py-4 bg-custom-accent text-custom-black font-bold rounded-full hover:bg-yellow-400 transition-all"
              >
                Browse Cars
              </a>
              <a
                href="/contact"
                className="px-8 py-4 bg-white/10 text-white font-bold rounded-full hover:bg-white/20 transition-all border border-white/20"
              >
                Contact Us
              </a>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  )
}
