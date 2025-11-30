'use client'
import React from 'react'
import { motion } from 'framer-motion'
import CountUp from 'react-countup'
import { FaCertificate, FaCar, FaUsers, FaStar, FaShieldAlt, FaHandshake, FaYoutube } from 'react-icons/fa'

const Highlights = () => {
  const stats = [
    { icon: FaCar, label: 'Cars Sold', value: 5000, suffix: '+', color: 'from-custom-accent to-yellow-400' },
    { icon: FaUsers, label: 'Happy Customers', value: 4500, suffix: '+', color: 'from-blue-400 to-cyan-400' },
    { icon: FaStar, label: 'Customer Rating', value: 4.8, decimals: 1, suffix: '/5', color: 'from-orange-400 to-red-400' },
    { icon: FaCertificate, label: 'Years in Business', value: 15, suffix: '+', color: 'from-purple-400 to-pink-400' }
  ]

  const highlights = [
    {
      icon: FaShieldAlt,
      title: '242-Point Quality Check',
      description: 'Every car undergoes rigorous inspection',
      gradient: 'from-emerald-500 to-teal-500'
    },
    {
      icon: FaHandshake,
      title: 'Transparent Pricing',
      description: 'No hidden costs, fair market value',
      gradient: 'from-blue-500 to-cyan-500'
    },
    {
      icon: FaCertificate,
      title: 'Certified Pre-Owned',
      description: 'Verified documentation & history',
      gradient: 'from-purple-500 to-pink-500'
    }
  ]

  return (
    <section className="py-20 bg-gradient-to-b from-custom-black via-custom-jet to-custom-black relative overflow-hidden">
      {/* Animated Background Blobs */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -left-40 w-96 h-96 bg-custom-accent/5 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute top-1/2 -right-40 w-96 h-96 bg-purple-500/5 rounded-full blur-3xl animate-pulse delay-1000"></div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-display font-bold text-white mb-4">
            Why Choose <span className="text-transparent bg-clip-text bg-gradient-to-r from-custom-accent to-yellow-200">Poddar Motors?</span>
          </h2>
          <p className="text-lg text-custom-platinum max-w-2xl mx-auto">
            Jharkhand's most trusted name in pre-owned cars. Quality, transparency, and customer satisfaction guaranteed.
          </p>
        </motion.div>

        {/* Stats Grid - Optimized for Mobile */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-6 mb-12 md:mb-16">
          {stats.map((stat, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1, duration: 0.5 }}
              whileHover={{ y: -5 }}
              className="relative group"
            >
              <div className="bg-custom-jet/50 backdrop-blur-sm border border-white/10 rounded-2xl p-4 md:p-6 hover:border-custom-accent/30 transition-all">
                <div className={`w-10 h-10 md:w-12 md:h-12 rounded-xl bg-gradient-to-br ${stat.color} p-2.5 md:p-3 mb-3 md:mb-4 group-hover:scale-110 transition-transform`}>
                  <stat.icon className="w-full h-full text-white" />
                </div>
                <div className="text-2xl md:text-3xl lg:text-4xl font-bold text-white mb-1">
                  <CountUp end={stat.value} decimals={stat.decimals || 0} duration={2.5} suffix={stat.suffix} />
                </div>
                <p className="text-custom-platinum text-xs md:text-sm font-medium">{stat.label}</p>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Bento Grid Layout - Mobile Optimized */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6 mb-12 md:mb-16">
          {highlights.map((item, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.15, duration: 0.5 }}
              whileHover={{ y: -8 }}
              className="relative group"
            >
              <div className="bg-custom-jet/50 backdrop-blur-sm border border-white/10 rounded-3xl p-6 md:p-8 hover:border-custom-accent/30 transition-all h-full">
                <div className={`w-12 h-12 md:w-14 md:h-14 rounded-2xl bg-gradient-to-br ${item.gradient} p-3 md:p-3.5 mb-4 md:mb-5 group-hover:scale-110 group-hover:rotate-3 transition-all`}>
                  <item.icon className="w-full h-full text-white" />
                </div>
                <h3 className="text-lg md:text-xl font-bold text-white mb-2 md:mb-3 group-hover:text-custom-accent transition-colors">
                  {item.title}
                </h3>
                <p className="text-custom-platinum leading-relaxed text-sm md:text-base">
                  {item.description}
                </p>
              </div>
            </motion.div>
          ))}
        </div>

        {/* YouTube CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="relative"
        >
          <div className="bg-gradient-to-r from-red-600/10 via-red-500/10 to-pink-600/10 backdrop-blur-sm border border-red-500/20 rounded-3xl p-8 md:p-12 text-center overflow-hidden">
            {/* Background Pattern */}
            <div className="absolute inset-0 opacity-5">
              <div className="absolute top-0 left-0 w-full h-full" style={{
                backgroundImage: 'radial-gradient(circle, white 1px, transparent 1px)',
                backgroundSize: '30px 30px'
              }}></div>
            </div>

            <div className="relative z-10">
              <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-gradient-to-br from-red-600 to-pink-600 mb-6 shadow-lg shadow-red-600/30">
                <FaYoutube className="text-4xl text-white" />
              </div>
              <h3 className="text-3xl md:text-4xl font-display font-bold text-white mb-4">
                Learn More on <span className="text-red-500">YouTube</span>
              </h3>
              <p className="text-custom-platinum text-lg max-w-2xl mx-auto mb-8">
                Watch expert tips on buying used cars, maintenance guides, and real customer stories on our YouTube channel.
              </p>
              <a
                href="https://www.youtube.com/@RealValueRanchi"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-3 bg-gradient-to-r from-red-600 to-pink-600 text-white font-bold px-8 py-4 rounded-full hover:from-red-700 hover:to-pink-700 transition-all shadow-lg shadow-red-600/30 hover:shadow-red-600/50 hover:scale-105"
              >
                <FaYoutube className="text-2xl" />
                <span>Subscribe Now</span>
              </a>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  )
}

export default Highlights
