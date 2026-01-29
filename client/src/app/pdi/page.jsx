'use client'

import React from 'react'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { FaCheckCircle, FaCar, FaSearch, FaShieldAlt, FaCommentsDollar } from 'react-icons/fa'

export default function PdiLandingPage() {
  return (
    <div className="min-h-screen bg-slate-900 text-white">
      {/* Hero Section */}
      <section className="relative h-[80vh] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 z-0">
          <div className="absolute inset-0 bg-gradient-to-b from-transparent to-slate-900 z-10"></div>
          {/* Placeholder for Hero Image - Ideally using a generated image or stock photo of a shiny new car in a showroom */}
          <div className="w-full h-full bg-[url('https://images.unsplash.com/photo-1552519507-da3b142c6e3d?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80')] bg-cover bg-center opacity-40"></div>
        </div>

        <div className="container mx-auto px-4 z-20 text-center">
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-5xl md:text-7xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-500"
          >
            Buying a New Car?
          </motion.h1>
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-3xl md:text-4xl font-semibold mb-8 text-gray-200"
          >
            Don't Register a Lemon.
          </motion.h2>
          <motion.p 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="text-xl md:text-2xl text-gray-400 mb-10 max-w-2xl mx-auto"
          >
            Get a professional Pre-Delivery Inspection (PDI) at the showroom before you pay the final amount.
          </motion.p>
          
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.6 }}
          >
            <Link 
              href="/pdi/book"
              className="px-8 py-4 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white text-lg font-bold rounded-full shadow-lg transform transition hover:scale-105"
            >
              Book PDI Now
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Why PDI Section */}
      <section className="py-20 bg-slate-800">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Why Do You Need PDI?</h2>
            <p className="text-gray-400 max-w-2xl mx-auto">
              New cars can be damaged during transit or storage. Once registered, you cannot return it. Our inspection catches issues before they become your problem.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <FeatureCard 
              icon={<FaCar className="text-4xl text-blue-400" />}
              title="Paint & Body Check"
              description="We check for repainted panels, scratches, and dents that dealers might try to hide."
            />
            <FeatureCard 
              icon={<FaShieldAlt className="text-4xl text-purple-400" />}
              title="Electrical & Electronics"
              description="Full functionality test of AC, Infotainment, Lights, and all electronic features."
            />
            <FeatureCard 
              icon={<FaSearch className="text-4xl text-green-400" />}
              title="VIN & Odometer Verification"
              description="Ensure you aren't getting a demo car or year-old stock. We verify the VIN and Odometer."
            />
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-20 bg-slate-900">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">How It Works</h2>
          </div>

          <div className="flex flex-col md:flex-row justify-center items-center space-y-8 md:space-y-0 md:space-x-8">
            <StepCard number="1" title="Book Online" desc="Provide car details and dealer location." />
            <div className="hidden md:block w-16 h-1 bg-gray-700"></div>
            <StepCard number="2" title="We Inspect" desc="Our expert visits the showroom." />
            <div className="hidden md:block w-16 h-1 bg-gray-700"></div>
            <StepCard number="3" title="Report" desc="Get a 'Go/No-Go' report instantly." />
          </div>
        </div>
      </section>
      
      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-blue-900 to-slate-900 text-center">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">Ready to take delivery?</h2>
          <p className="text-xl text-gray-300 mb-8">Ensure your new car is perfect.</p>
          <Link 
            href="/pdi/book"
            className="px-10 py-4 bg-white text-slate-900 text-lg font-bold rounded-full shadow-lg hover:bg-gray-100 transition"
          >
            Book PDI Inspection
          </Link>
        </div>
      </section>
    </div>
  )
}

function FeatureCard({ icon, title, description }) {
  return (
    <div className="bg-slate-700 p-8 rounded-2xl shadow-xl hover:bg-slate-600 transition duration-300">
      <div className="mb-6">{icon}</div>
      <h3 className="text-xl font-bold mb-3 text-white">{title}</h3>
      <p className="text-gray-300">{description}</p>
    </div>
  )
}

function StepCard({ number, title, desc }) {
  return (
    <div className="flex flex-col items-center p-6 bg-slate-800 rounded-xl w-64 border border-slate-700">
      <div className="w-12 h-12 rounded-full bg-blue-600 flex items-center justify-center text-xl font-bold mb-4">
        {number}
      </div>
      <h3 className="text-xl font-bold mb-2">{title}</h3>
      <p className="text-center text-gray-400">{desc}</p>
    </div>
  )
}
