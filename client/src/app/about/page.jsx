'use client'
import { motion } from 'framer-motion'
import Image from 'next/image'
import CountUp from 'react-countup'
import Head from 'next/head'
import { 
  FaAward, 
  FaUsers, 
  FaCar, 
  FaHandshake,
  FaQuoteLeft,
  FaCheckCircle,
  FaShieldAlt,
  FaStar,
  FaHeart
} from 'react-icons/fa'

import dayImage from '../../images/about/day.jpg'
import twilightImage from '../../images/about/twilight.jpg'
import night from '../../images/about/night.jpg'
import cars from '../../images/about/cars.jpg'
import founder from '../../images/founder.jpeg'

const AboutUs = () => {
  const stats = [
    { number: 30, suffix: '+', label: 'Years of Excellence' },
    { number: 40000, suffix: '+', label: 'Happy Customers' },
    { number: 10, suffix: '+', label: 'Finance Partners' },
    { number: 4, suffix: '', label: 'Showrooms' },
  ]

  const values = [
    {
      icon: FaShieldAlt,
      title: 'Trust & Transparency',
      description: 'Every vehicle comes with complete documentation and transparent pricing'
    },
    {
      icon: FaHeart,
      title: 'Customer First',
      description: 'Your satisfaction is our top priority, always'
    },
    {
      icon: FaCheckCircle,
      title: 'Quality Assured',
      description: 'Rigorous 200-point inspection for every car we sell'
    },
    {
      icon: FaAward,
      title: 'Industry Leaders',
      description: 'Setting benchmarks in service excellence and innovation'
    }
  ]

  return (
    <main className="bg-custom-black min-h-screen">
      <Head>
        <title>About Us - Real Value | Your Trusted Used Car Dealer in Ranchi</title>
        <meta name="description" content="Learn about Real Value, the leading used car dealership in Ranchi, dedicated to providing quality vehicles and exceptional service." />
      </Head>

      {/* Hero Section with Large Image */}
      <section className="relative pt-24 pb-0">
        <div className="relative h-[60vh] md:h-[70vh]">
          <Image 
            src={dayImage} 
            alt="Real Value Showroom" 
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-custom-black via-custom-black/60 to-transparent"></div>
          
          <div className="absolute inset-0 flex items-end">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-16 w-full">
              <motion.div
                initial={{ y: 30, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.8 }}
              >
                <h1 className="text-5xl md:text-7xl font-display font-bold text-white mb-4">
                  Trusted for <span className="text-custom-accent">30 Years</span>
                </h1>
                <p className="text-xl md:text-2xl text-custom-seasalt max-w-3xl">
                  Ranchi's most trusted used car dealership with 40,000+ satisfied customers
                </p>
              </motion.div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-custom-black">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {stats.map((stat, index) => (
              <motion.div
                key={stat.label}
                initial={{ y: 50, opacity: 0 }}
                whileInView={{ y: 0, opacity: 1 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1, duration: 0.6 }}
                className="text-center p-6 bg-custom-jet/50 border border-white/10 rounded-2xl hover:border-custom-accent/50 transition-all"
              >
                <div className="text-4xl md:text-5xl font-bold text-custom-accent mb-2">
                  <CountUp start={0} end={stat.number} duration={3} />
                  {stat.suffix}
                </div>
                <div className="text-custom-platinum font-medium">{stat.label}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Story Section with Image */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ x: -50, opacity: 0 }}
              whileInView={{ x: 0, opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
            >
              <h2 className="text-4xl md:text-5xl font-display font-bold text-white mb-6">
                Our <span className="text-custom-accent">Story</span>
              </h2>
              <div className="space-y-4 text-lg text-custom-platinum">
                <p>
                  Founded in 1994, Real Value has been transforming the used car market in Ranchi 
                  for three decades. What started as a small venture has grown into the region's 
                  most trusted automotive dealership.
                </p>
                <p>
                  With four strategically located showrooms across Ranchi, we've helped over 40,000 
                  families find their perfect vehicle. Our commitment to quality, transparency, and 
                  customer satisfaction has made us the preferred choice for used cars in Jharkhand.
                </p>
                <div className="flex items-center gap-2 pt-4">
                  <div className="flex">
                    {[1,2,3,4].map(i => <FaStar key={i} className="text-yellow-400 text-xl" />)}
                    <FaStar className="text-yellow-400 text-xl opacity-50" />
                  </div>
                  <span className="text-white font-semibold">4.7/5</span>
                  <span className="text-custom-platinum">• 2000+ Google Reviews</span>
                </div>
              </div>
            </motion.div>

            <motion.div
              initial={{ x: 50, opacity: 0 }}
              whileInView={{ x: 0, opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
              className="relative"
            >
              <div className="relative rounded-3xl overflow-hidden border-2 border-white/10">
                <Image 
                  src={twilightImage} 
                  alt="Real Value Showroom at Twilight" 
                  className="w-full h-auto"
                />
              </div>
              <div className="absolute -bottom-6 -right-6 w-32 h-32 bg-custom-accent/20 rounded-full blur-3xl"></div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-custom-jet/20">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-display font-bold text-white mb-4">
              Why Choose <span className="text-custom-accent">Real Value</span>
            </h2>
            <p className="text-xl text-custom-platinum">The principles that make us different</p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {values.map((value, index) => (
              <motion.div
                key={value.title}
                initial={{ y: 50, opacity: 0 }}
                whileInView={{ y: 0, opacity: 1 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1, duration: 0.6 }}
                className="bg-custom-jet/50 border border-white/10 rounded-2xl p-8 hover:border-custom-accent/50 transition-all text-center"
              >
                <div className="w-16 h-16 bg-custom-accent/20 rounded-full flex items-center justify-center mx-auto mb-6">
                  <value.icon className="text-3xl text-custom-accent" />
                </div>
                <h3 className="text-xl font-bold text-white mb-3">{value.title}</h3>
                <p className="text-custom-platinum">{value.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Mission & Vision with Image Grid */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center mb-20">
            <motion.div
              initial={{ x: -50, opacity: 0 }}
              whileInView={{ x: 0, opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
              className="relative rounded-3xl overflow-hidden border-2 border-white/10"
            >
              <Image 
                src={cars} 
                alt="Our Vehicle Collection" 
                className="w-full h-auto"
              />
            </motion.div>

            <motion.div
              initial={{ x: 50, opacity: 0 }}
              whileInView={{ x: 0, opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
            >
              <div className="mb-12">
                <h2 className="text-3xl font-bold text-white mb-4">
                  Our <span className="text-custom-accent">Mission</span>
                </h2>
                <p className="text-lg text-custom-platinum leading-relaxed">
                  To revolutionize the used car market by providing transparent, quality-assured 
                  vehicles at competitive prices. We make car ownership accessible while maintaining 
                  the highest standards of service.
                </p>
              </div>

              <div>
                <h2 className="text-3xl font-bold text-white mb-4">
                  Our <span className="text-custom-accent">Vision</span>
                </h2>
                <p className="text-lg text-custom-platinum leading-relaxed">
                  To become East India's most trusted and largest used car dealership, setting 
                  new benchmarks in transparency, customer satisfaction, and innovation.
                </p>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Founder Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-custom-jet/20">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ x: -50, opacity: 0 }}
              whileInView={{ x: 0, opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
            >
              <div className="relative rounded-3xl overflow-hidden border-2 border-white/10 max-w-md mx-auto lg:mx-0">
                <Image 
                  src={founder} 
                  alt="Milan Poddar - Founder & CEO" 
                  className="w-full h-auto"
                />
              </div>
            </motion.div>

            <motion.div
              initial={{ x: 50, opacity: 0 }}
              whileInView={{ x: 0, opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
            >
              <h2 className="text-4xl font-display font-bold text-white mb-6">
                Meet Our <span className="text-custom-accent">Founder</span>
              </h2>
              <p className="text-lg text-custom-platinum leading-relaxed mb-6">
                <span className="text-white font-bold">Milan Poddar</span>, our CEO and Founder, 
                has been the driving force behind Real Value since 1994. His vision of creating 
                a transparent and customer-centric used car market has shaped the company into 
                what it is today.
              </p>
              
              <div className="border-l-4 border-custom-accent pl-6 bg-custom-jet/30 p-6 rounded-r-2xl">
                <FaQuoteLeft className="text-3xl text-custom-accent/30 mb-4" />
                <p className="text-lg text-custom-platinum italic leading-relaxed">
                  "Our success is measured by the trust our customers place in us and the 
                  quality of service we deliver. Every car we sell carries our commitment 
                  to excellence and transparency."
                </p>
                <p className="text-white font-semibold mt-4">- Milan Poddar</p>
                <p className="text-custom-platinum text-sm">Founder & CEO, Real Value</p>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-display font-bold text-white mb-4">
              Our <span className="text-custom-accent">Services</span>
            </h2>
            <p className="text-xl text-custom-platinum">Everything you need under one roof</p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { title: 'Buy', desc: 'Browse our extensive inventory of quality-assured vehicles', link: '/buy' },
              { title: 'Sell', desc: 'Get the best price for your car with our transparent process', link: '/sell' },
              { title: 'Finance', desc: 'Flexible financing options with 10+ banking partners', link: '/finance' }
            ].map((service, index) => (
              <motion.a
                key={service.title}
                href={service.link}
                initial={{ y: 50, opacity: 0 }}
                whileInView={{ y: 0, opacity: 1 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1, duration: 0.6 }}
                className="group bg-custom-jet/50 border border-white/10 rounded-2xl p-8 hover:border-custom-accent transition-all text-center"
              >
                <h3 className="text-2xl font-bold text-white mb-3 group-hover:text-custom-accent transition-colors">
                  {service.title}
                </h3>
                <p className="text-custom-platinum mb-4">{service.desc}</p>
                <span className="text-custom-accent font-semibold group-hover:underline">
                  Learn More →
                </span>
              </motion.a>
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA with Night Image */}
      <section className="relative py-0">
        <div className="relative h-[50vh]">
          <Image 
            src={night} 
            alt="Real Value at Night" 
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-custom-black/70"></div>
          
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="max-w-4xl mx-auto px-4 text-center">
              <motion.div
                initial={{ y: 30, opacity: 0 }}
                whileInView={{ y: 0, opacity: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8 }}
              >
                <h2 className="text-4xl md:text-5xl font-display font-bold text-white mb-6">
                  Ready to Find Your Perfect Car?
                </h2>
                <p className="text-xl text-custom-seasalt mb-8">
                  Join 40,000+ satisfied customers who chose Real Value
                </p>
                <div className="flex flex-wrap justify-center gap-4">
                  <a
                    href="/buy"
                    className="px-8 py-4 bg-custom-accent text-custom-black font-bold rounded-full hover:bg-yellow-400 transition-all"
                  >
                    Browse Collection
                  </a>
                  <a
                    href="/contact"
                    className="px-8 py-4 bg-white/10 backdrop-blur-sm text-white font-bold rounded-full hover:bg-white/20 transition-all border border-white/20"
                  >
                    Visit Showroom
                  </a>
                </div>
              </motion.div>
            </div>
          </div>
        </div>
      </section>
    </main>
  )
}

export default AboutUs
