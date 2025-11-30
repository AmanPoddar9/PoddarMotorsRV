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
  FaRocket,
  FaHeart,
  FaShieldAlt,
  FaStar
} from 'react-icons/fa'

import dayImage from '../../images/about/day.jpg'
import twilightImage from '../../images/about/twilight.jpg'
import night from '../../images/about/night.jpg'
import cars from '../../images/about/cars.jpg'
import founder from '../../images/founder.jpeg'

const AboutUs = () => {
  const stats = [
    { number: 30, suffix: '+', label: 'Years of Excellence', icon: FaAward, delay: 0 },
    { number: 40000, suffix: '+', label: 'Happy Customers', icon: FaUsers, delay: 0.1 },
    { number: 10, suffix: '+', label: 'Finance Partners', icon: FaHandshake, delay: 0.2 },
    { number: 4, suffix: '', label: 'Showrooms', icon: FaCar, delay: 0.3 },
  ]

  const values = [
    {
      icon: FaShieldAlt,
      title: 'Trust & Transparency',
      description: 'Every vehicle comes with complete documentation and transparent pricing',
      color: 'from-blue-500 to-cyan-500'
    },
    {
      icon: FaHeart,
      title: 'Customer First',
      description: 'Your satisfaction is our top priority, always',
      color: 'from-pink-500 to-red-500'
    },
    {
      icon: FaCheckCircle,
      title: 'Quality Assured',
      description: 'Rigorous 200-point inspection for every car we sell',
      color: 'from-green-500 to-emerald-500'
    },
    {
      icon: FaRocket,
      title: 'Innovation',
      description: 'Leveraging technology to deliver the best car buying experience',
      color: 'from-purple-500 to-pink-500'
    }
  ]

  const timeline = [
    { year: '1994', title: 'The Beginning', description: 'Started with a vision to transform the used car market in Ranchi' },
    { year: '2005', title: 'Expansion', description: 'Opened our second showroom and introduced financing options' },
    { year: '2015', title: 'Digital Transformation', description: 'Launched online platform for seamless car buying' },
    { year: '2024', title: 'Leading the Market', description: 'Became the most trusted used car dealer in Jharkhand' }
  ]

  return (
    <main className="bg-custom-black min-h-screen overflow-hidden">
      <Head>
        <title>About Us - Real Value | Your Trusted Used Car Dealer in Ranchi</title>
        <meta name="description" content="Learn about Real Value, the leading used car dealership in Ranchi, dedicated to providing quality vehicles and exceptional service." />
      </Head>

      {/* Animated Background */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 -left-40 w-96 h-96 bg-custom-accent/5 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-0 -right-40 w-96 h-96 bg-blue-500/5 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>
        <div className="absolute top-1/2 left-1/2 w-96 h-96 bg-purple-500/5 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '2s' }}></div>
      </div>

      <div className="relative z-10">
        {/* Hero Section */}
        <motion.section 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="relative pt-32 pb-20 px-4 sm:px-6 lg:px-8"
        >
          <div className="max-w-7xl mx-auto">
            <motion.div
              initial={{ y: 30, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.2, duration: 0.8 }}
              className="text-center"
            >
              <h1 className="text-5xl md:text-7xl font-display font-bold text-white mb-6">
                Our <span className="bg-gradient-to-r from-custom-accent to-yellow-400 bg-clip-text text-transparent">Story</span>
              </h1>
              <p className="text-xl md:text-2xl text-custom-platinum max-w-4xl mx-auto mb-12">
                30 years of trust, 40,000+ happy customers, and counting. 
                Discover the journey that made us Ranchi's most trusted car dealership.
              </p>
            </motion.div>

            {/* Hero Image Grid */}
            <motion.div
              initial={{ y: 50, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.4, duration: 0.8 }}
              className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-16"
            >
              <div className="group relative overflow-hidden rounded-3xl border border-white/10">
                <Image src={dayImage} alt="Showroom" className="w-full h-64 object-cover transition-transform duration-500 group-hover:scale-110" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-6">
                  <p className="text-white font-bold">Our Modern Showrooms</p>
                </div>
              </div>
              <div className="group relative overflow-hidden rounded-3xl border border-white/10">
                <Image src={twilightImage} alt="Inventory" className="w-full h-64 object-cover transition-transform duration-500 group-hover:scale-110" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-6">
                  <p className="text-white font-bold">Premium Collection</p>
                </div>
              </div>
              <div className="group relative overflow-hidden rounded-3xl border border-white/10">
                <Image src={night} alt="Night View" className="w-full h-64 object-cover transition-transform duration-500 group-hover:scale-110" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-6">
                  <p className="text-white font-bold">Always Open For You</p>
                </div>
              </div>
            </motion.div>
          </div>
        </motion.section>

        {/* Stats Section */}
        <section className="py-16 px-4 sm:px-6 lg:px-8">
          <div className="max-w-7xl mx-auto">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              {stats.map((stat, index) => (
                <motion.div
                  key={stat.label}
                  initial={{ y: 50, opacity: 0 }}
                  whileInView={{ y: 0, opacity: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: stat.delay, duration: 0.6 }}
                  className="group relative"
                >
                  <div className={`absolute inset-0 bg-gradient-to-r ${index === 0 ? 'from-yellow-500 to-orange-500' : index === 1 ? 'from-blue-500 to-cyan-500' : index === 2 ? 'from-green-500 to-emerald-500' : 'from-purple-500 to-pink-500'} opacity-0 group-hover:opacity-100 blur-xl transition-opacity duration-500`}></div>
                  <div className="relative bg-custom-jet/50 backdrop-blur-md border border-white/10 rounded-2xl p-8 hover:border-white/20 transition-all duration-300 text-center">
                    <stat.icon className="text-4xl text-custom-accent mx-auto mb-4 group-hover:scale-110 transition-transform" />
                    <div className="text-4xl md:text-5xl font-bold text-white mb-2">
                      <CountUp start={0} end={stat.number} duration={3} />
                      {stat.suffix}
                    </div>
                    <div className="text-custom-platinum font-medium">{stat.label}</div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Mission & Vision */}
        <section className="py-20 px-4 sm:px-6 lg:px-8">
          <div className="max-w-7xl mx-auto">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              <motion.div
                initial={{ x: -50, opacity: 0 }}
                whileInView={{ x: 0, opacity: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8 }}
              >
                <div className="relative">
                  <FaQuoteLeft className="absolute -top-4 -left-4 text-6xl text-custom-accent/20" />
                  <div className="bg-custom-jet/30 backdrop-blur-md border border-white/10 rounded-3xl p-8 relative z-10">
                    <h2 className="text-3xl font-bold text-white mb-4">
                      Our <span className="text-custom-accent">Mission</span>
                    </h2>
                    <p className="text-lg text-custom-platinum leading-relaxed">
                      To revolutionize the used car market in Ranchi by providing transparent, 
                      quality-assured vehicles at the best prices. We're committed to making 
                      car ownership accessible to everyone while maintaining the highest 
                      standards of service excellence.
                    </p>
                  </div>
                </div>
              </motion.div>

              <motion.div
                initial={{ x: 50, opacity: 0 }}
                whileInView={{ x: 0, opacity: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8 }}
              >
                <div className="bg-custom-jet/30 backdrop-blur-md border border-white/10 rounded-3xl p-8">
                  <h2 className="text-3xl font-bold text-white mb-4">
                    Our <span className="text-custom-accent">Vision</span>
                  </h2>
                  <p className="text-lg text-custom-platinum leading-relaxed mb-6">
                    To become the most trusted and largest used car dealership in East India, 
                    setting new benchmarks in customer satisfaction, transparency, and innovation.
                  </p>
                  <div className="flex items-center gap-2">
                    <FaStar className="text-yellow-400 text-xl" />
                    <span className="text-white font-semibold">4.7/5 Google Rating</span>
                    <span className="text-custom-platinum text-sm">(2000+ reviews)</span>
                  </div>
                </div>
              </motion.div>
            </div>
          </div>
        </section>

        {/* Timeline */}
        <section className="py-20 px-4 sm:px-6 lg:px-8 bg-custom-jet/20">
          <div className="max-w-7xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-center mb-16"
            >
              <h2 className="text-4xl font-bold text-white mb-4">
                Our <span className="text-custom-accent">Journey</span>
              </h2>
              <p className="text-xl text-custom-platinum">Three decades of growth and excellence</p>
            </motion.div>

            <div className="relative">
              {/* Timeline Line */}
              <div className="absolute left-1/2 transform -translate-x-1/2 h-full w-1 bg-gradient-to-b from-custom-accent to-transparent hidden md:block"></div>

              {timeline.map((item, index) => (
                <motion.div
                  key={item.year}
                  initial={{ opacity: 0, y: 50 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.2, duration: 0.6 }}
                  className={`flex items-center mb-12 ${index % 2 === 0 ? 'md:flex-row' : 'md:flex-row-reverse'}`}
                >
                  <div className={`w-full md:w-5/12 ${index % 2 === 0 ? 'md:text-right md:pr-12' : 'md:pl-12'}`}>
                    <div className="bg-custom-jet/50 backdrop-blur-md border border-white/10 rounded-2xl p-6 hover:border-custom-accent/50 transition-all">
                      <div className="text-3xl font-bold text-custom-accent mb-2">{item.year}</div>
                      <h3 className="text-xl font-bold text-white mb-2">{item.title}</h3>
                      <p className="text-custom-platinum">{item.description}</p>
                    </div>
                  </div>
                  <div className="hidden md:flex w-2/12 justify-center">
                    <div className="w-8 h-8 bg-custom-accent rounded-full border-4 border-custom-black"></div>
                  </div>
                  <div className="hidden md:block w-5/12"></div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Values */}
        <section className="py-20 px-4 sm:px-6 lg:px-8">
          <div className="max-w-7xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-center mb-16"
            >
              <h2 className="text-4xl font-bold text-white mb-4">
                Our <span className="text-custom-accent">Values</span>
              </h2>
              <p className="text-xl text-custom-platinum">The principles that drive us forward</p>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {values.map((value, index) => (
                <motion.div
                  key={value.title}
                  initial={{ y: 50, opacity: 0 }}
                  whileInView={{ y: 0, opacity: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1, duration: 0.6 }}
                  className="group"
                >
                  <div className={`absolute inset-0 bg-gradient-to-r ${value.color} opacity-0 group-hover:opacity-100 blur-xl transition-opacity duration-500`}></div>
                  <div className="relative bg-custom-jet/30 backdrop-blur-md border border-white/10 rounded-2xl p-8 hover:border-white/20 transition-all duration-300 h-full">
                    <div className={`w-16 h-16 bg-gradient-to-r ${value.color} rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform`}>
                      <value.icon className="text-3xl text-white" />
                    </div>
                    <h3 className="text-xl font-bold text-white mb-3">{value.title}</h3>
                    <p className="text-custom-platinum">{value.description}</p>
                  </div>
                </motion.div>
              ))}
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
                className="order-2 lg:order-1"
              >
                <div className="bg-custom-jet/30 backdrop-blur-md border border-white/10 rounded-3xl p-8">
                  <h2 className="text-4xl font-bold text-white mb-6">
                    Meet Our <span className="text-custom-accent">Founder</span>
                  </h2>
                  <p className="text-lg text-custom-platinum leading-relaxed mb-6">
                    <span className="text-white font-bold">Milan Poddar</span>, our CEO and Founder, 
                    envisioned a transparent and customer-centric used car market 30 years ago. 
                    His dedication to quality and service has transformed Real Value into 
                    Ranchi's most trusted car dealership.
                  </p>
                  <blockquote className="border-l-4 border-custom-accent pl-4 italic text-custom-platinum">
                    "Our success is measured by the smiles on our customers' faces and the 
                    trust they place in us. Every car we sell carries our promise of quality 
                    and transparency."
                  </blockquote>
                  <p className="text-white font-semibold mt-4">- Milan Poddar, Founder & CEO</p>
                </div>
              </motion.div>

              <motion.div
                initial={{ x: 50, opacity: 0 }}
                whileInView={{ x: 0, opacity: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8 }}
                className="order-1 lg:order-2"
              >
                <div className="relative group">
                  <div className="absolute inset-0 bg-gradient-to-r from-custom-accent to-yellow-400 rounded-3xl blur-xl opacity-20 group-hover:opacity-40 transition-opacity"></div>
                  <Image 
                    src={founder} 
                    alt="Milan Poddar - Founder" 
                    className="relative rounded-3xl border-2 border-white/10 w-full shadow-2xl"
                  />
                </div>
              </motion.div>
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
              className="relative"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-custom-accent to-yellow-400 rounded-3xl blur-2xl opacity-20"></div>
              <div className="relative bg-custom-jet/50 backdrop-blur-md border border-white/10 rounded-3xl p-12 text-center">
                <h2 className="text-4xl font-bold text-white mb-6">
                  Ready to Find Your Perfect Car?
                </h2>
                <p className="text-xl text-custom-platinum mb-8">
                  Join 40,000+ satisfied customers who trusted us with their car journey
                </p>
                <div className="flex flex-wrap justify-center gap-4">
                  <a
                    href="/buy"
                    className="px-8 py-4 bg-gradient-to-r from-custom-accent to-yellow-400 text-custom-black font-bold rounded-full hover:scale-105 transition-all shadow-lg shadow-custom-accent/30"
                  >
                    Browse Our Collection
                  </a>
                  <a
                    href="/contact"
                    className="px-8 py-4 bg-white/10 text-white font-bold rounded-full hover:bg-white/20 transition-all border border-white/20"
                  >
                    Contact Us
                  </a>
                </div>
              </div>
            </motion.div>
          </div>
        </section>
      </div>
    </main>
  )
}

export default AboutUs
