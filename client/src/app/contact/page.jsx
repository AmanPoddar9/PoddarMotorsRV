'use client'
import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { 
  FaWhatsapp, 
  FaInstagram, 
  FaFacebook, 
  FaPhoneAlt, 
  FaEnvelope, 
  FaMapMarkerAlt,
  FaCopy,
  FaCheck,
  FaPaperPlane
} from 'react-icons/fa'

const ContactUsPage = () => {
  const [copiedEmail, setCopiedEmail] = useState(false)
  const [copiedPhone, setCopiedPhone] = useState(false)
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    message: ''
  })
  const [formStatus, setFormStatus] = useState({ type: '', message: '' })

  const copyToClipboard = (text, type) => {
    navigator.clipboard.writeText(text)
    if (type === 'email') {
      setCopiedEmail(true)
      setTimeout(() => setCopiedEmail(false), 2000)
    } else {
      setCopiedPhone(true)
      setTimeout(() => setCopiedPhone(false), 2000)
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setFormStatus({ type: 'loading', message: 'Sending...' })
    
    // Simulate form submission
    setTimeout(() => {
      setFormStatus({ type: 'success', message: 'Message sent successfully!' })
      setFormData({ name: '', email: '', phone: '', message: '' })
      setTimeout(() => setFormStatus({ type: '', message: '' }), 3000)
    }, 1500)
  }

  const contactMethods = [
    {
      icon: FaPhoneAlt,
      title: 'Call Us',
      value: '8709119090',
      link: 'tel:8709119090',
      description: 'Mon-Sun: 9:30 AM - 7:00 PM',
      color: 'from-blue-500 to-cyan-500',
      bgColor: 'bg-blue-500/10',
      action: () => copyToClipboard('8709119090', 'phone')
    },
    {
      icon: FaEnvelope,
      title: 'Email Us',
      value: 'poddarranchi@gmail.com',
      link: 'mailto:poddarranchi@gmail.com',
      description: 'We reply within 24 hours',
      color: 'from-purple-500 to-pink-500',
      bgColor: 'bg-purple-500/10',
      action: () => copyToClipboard('poddarranchi@gmail.com', 'email')
    },
    {
      icon: FaWhatsapp,
      title: 'WhatsApp',
      value: '8709119090',
      link: 'https://wa.me/918709119090?text=Hi there looking forward to connecting with you.',
      description: 'Chat with us instantly',
      color: 'from-green-500 to-emerald-500',
      bgColor: 'bg-green-500/10'
    }
  ]

  const showrooms = [
    {
      name: 'Real Value - Kokar',
      address: 'Poddar Automart, Kokar Industrial Area, Ranchi - 834001',
      landmark: 'Near Electricity Sub Station',
      mapLink: 'https://maps.google.com/?q=Real+Value+Kokar+Ranchi'
    },
    {
      name: 'Poddar Motors',
      address: 'Poddar Motors Pvt. Ltd., Kokar Industrial Area, Ranchi - 834001',
      landmark: 'Beside Moreish Bread',
      mapLink: 'https://maps.google.com/?q=Poddar+Motors+Kokar+Ranchi'
    },
    {
      name: 'Real Value - Kokar Chowk',
      address: 'Tirupati Engicon, Kokar Chowk, Ranchi - 834001',
      landmark: 'Kokar Chowk - Kantatoli Road',
      mapLink: 'https://maps.google.com/?q=Real+Value+Kokar+Chowk+Ranchi'
    },
    {
      name: 'Real Value - Mesra',
      address: 'Hazaribagh Road, Mesra, Ranchi - 834001',
      landmark: 'Near BIT Mesra Campus',
      mapLink: 'https://maps.google.com/?q=Real+Value+Mesra+Ranchi'
    }
  ]

  return (
    <div className="bg-custom-black min-h-screen overflow-hidden">
      {/* Animated Background */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 -left-40 w-96 h-96 bg-custom-accent/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-0 -right-40 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
      </div>

      <div className="relative z-10">
        {/* Hero Section */}
        <motion.section 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="relative pt-32 pb-16 px-4 sm:px-6 lg:px-8"
        >
          <div className="max-w-7xl mx-auto text-center">
            <motion.div
              initial={{ y: 30, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.2, duration: 0.8 }}
            >
              <h1 className="text-5xl md:text-7xl font-display font-bold text-white mb-6">
                Let's <span className="bg-gradient-to-r from-custom-accent to-yellow-400 bg-clip-text text-transparent">Connect</span>
              </h1>
              <p className="text-xl md:text-2xl text-custom-platinum max-w-3xl mx-auto mb-12">
                We're here to help you find your perfect car. Reach out to us anytime!
              </p>
            </motion.div>

            {/* Quick Action Buttons */}
            <motion.div 
              initial={{ y: 30, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.4, duration: 0.8 }}
              className="flex flex-wrap justify-center gap-4 mb-16"
            >
              <a
                href="tel:8709119090"
                className="group flex items-center gap-3 px-8 py-4 bg-gradient-to-r from-blue-600 to-cyan-600 text-white rounded-full font-bold hover:scale-105 transition-all shadow-lg shadow-blue-600/30"
              >
                <FaPhoneAlt className="text-xl group-hover:rotate-12 transition-transform" />
                Call Now
              </a>
              <a
                href="https://wa.me/918709119090"
                target="_blank"
                rel="noopener noreferrer"
                className="group flex items-center gap-3 px-8 py-4 bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-full font-bold hover:scale-105 transition-all shadow-lg shadow-green-600/30"
              >
                <FaWhatsapp className="text-xl group-hover:scale-110 transition-transform" />
                WhatsApp
              </a>
              <a
                href="mailto:poddarranchi@gmail.com"
                className="group flex items-center gap-3 px-8 py-4 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-full font-bold hover:scale-105 transition-all shadow-lg shadow-purple-600/30"
              >
                <FaEnvelope className="text-xl group-hover:rotate-12 transition-transform" />
                Email Us
              </a>
            </motion.div>
          </div>
        </motion.section>

        {/* Contact Methods */}
        <section className="py-16 px-4 sm:px-6 lg:px-8">
          <div className="max-w-7xl mx-auto">
            <motion.div 
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              className="grid grid-cols-1 md:grid-cols-3 gap-8"
            >
              {contactMethods.map((method, index) => (
                <motion.div
                  key={method.title}
                  initial={{ y: 50, opacity: 0 }}
                  whileInView={{ y: 0, opacity: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1, duration: 0.6 }}
                  className="group relative"
                >
                  <div className={`absolute inset-0 bg-gradient-to-r ${method.color} opacity-0 group-hover:opacity-100 blur-xl transition-opacity duration-500`}></div>
                  <div className="relative bg-custom-jet/50 backdrop-blur-md border border-white/10 rounded-2xl p-8 hover:border-white/20 transition-all duration-300">
                    <div className={`w-16 h-16 ${method.bgColor} rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300`}>
                      <method.icon className={`text-3xl bg-gradient-to-r ${method.color} bg-clip-text text-transparent`} />
                    </div>
                    
                    <h3 className="text-2xl font-bold text-white mb-2">{method.title}</h3>
                    <p className="text-custom-platinum text-sm mb-4">{method.description}</p>
                    
                    <div className="flex items-center gap-2 mb-4">
                      <a 
                        href={method.link}
                        className="text-white font-medium hover:text-custom-accent transition-colors flex-1"
                        target={method.title === 'WhatsApp' ? '_blank' : undefined}
                        rel={method.title === 'WhatsApp' ? 'noopener noreferrer' : undefined}
                      >
                        {method.value}
                      </a>
                      {method.action && (
                        <button
                          onClick={method.action}
                          className="p-2 bg-white/5 hover:bg-white/10 rounded-lg transition-colors"
                          title="Copy to clipboard"
                        >
                          {(method.title === 'Email Us' && copiedEmail) || (method.title === 'Call Us' && copiedPhone) ? (
                            <FaCheck className="text-green-500" />
                          ) : (
                            <FaCopy className="text-custom-platinum" />
                          )}
                        </button>
                      )}
                    </div>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </section>

        {/* Contact Form & Map Section */}
        <section className="py-16 px-4 sm:px-6 lg:px-8">
          <div className="max-w-7xl mx-auto">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
              {/* Contact Form */}
              <motion.div
                initial={{ x: -50, opacity: 0 }}
                whileInView={{ x: 0, opacity: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8 }}
              >
                <div className="bg-custom-jet/30 backdrop-blur-md border border-white/10 rounded-3xl p-8">
                  <h2 className="text-3xl font-bold text-white mb-2">Send us a Message</h2>
                  <p className="text-custom-platinum mb-8">We'll get back to you within 24 hours</p>
                  
                  <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="relative">
                      <input
                        type="text"
                        value={formData.name}
                        onChange={(e) => setFormData({...formData, name: e.target.value})}
                        required
                        className="peer w-full bg-custom-black/50 border border-white/10 rounded-xl px-4 py-4 text-white placeholder-transparent focus:border-custom-accent focus:outline-none focus:ring-2 focus:ring-custom-accent/20 transition-all"
                        placeholder="Your Name"
                      />
                      <label className="absolute left-4 -top-2.5 bg-custom-jet px-2 text-sm text-custom-platinum peer-placeholder-shown:text-base peer-placeholder-shown:top-4 peer-placeholder-shown:bg-transparent peer-focus:-top-2.5 peer-focus:text-sm peer-focus:text-custom-accent peer-focus:bg-custom-jet transition-all">
                        Your Name
                      </label>
                    </div>

                    <div className="relative">
                      <input
                        type="email"
                        value={formData.email}
                        onChange={(e) => setFormData({...formData, email: e.target.value})}
                        required
                        className="peer w-full bg-custom-black/50 border border-white/10 rounded-xl px-4 py-4 text-white placeholder-transparent focus:border-custom-accent focus:outline-none focus:ring-2 focus:ring-custom-accent/20 transition-all"
                        placeholder="Email Address"
                      />
                      <label className="absolute left-4 -top-2.5 bg-custom-jet px-2 text-sm text-custom-platinum peer-placeholder-shown:text-base peer-placeholder-shown:top-4 peer-placeholder-shown:bg-transparent peer-focus:-top-2.5 peer-focus:text-sm peer-focus:text-custom-accent peer-focus:bg-custom-jet transition-all">
                        Email Address
                      </label>
                    </div>

                    <div className="relative">
                      <input
                        type="tel"
                        value={formData.phone}
                        onChange={(e) => setFormData({...formData, phone: e.target.value})}
                        required
                        className="peer w-full bg-custom-black/50 border border-white/10 rounded-xl px-4 py-4 text-white placeholder-transparent focus:border-custom-accent focus:outline-none focus:ring-2 focus:ring-custom-accent/20 transition-all"
                        placeholder="Phone Number"
                      />
                      <label className="absolute left-4 -top-2.5 bg-custom-jet px-2 text-sm text-custom-platinum peer-placeholder-shown:text-base peer-placeholder-shown:top-4 peer-placeholder-shown:bg-transparent peer-focus:-top-2.5 peer-focus:text-sm peer-focus:text-custom-accent peer-focus:bg-custom-jet transition-all">
                        Phone Number
                      </label>
                    </div>

                    <div className="relative">
                      <textarea
                        value={formData.message}
                        onChange={(e) => setFormData({...formData, message: e.target.value})}
                        required
                        rows={4}
                        className="peer w-full bg-custom-black/50 border border-white/10 rounded-xl px-4 py-4 text-white placeholder-transparent focus:border-custom-accent focus:outline-none focus:ring-2 focus:ring-custom-accent/20 transition-all resize-none"
                        placeholder="Your Message"
                      />
                      <label className="absolute left-4 -top-2.5 bg-custom-jet px-2 text-sm text-custom-platinum peer-placeholder-shown:text-base peer-placeholder-shown:top-4 peer-placeholder-shown:bg-transparent peer-focus:-top-2.5 peer-focus:text-sm peer-focus:text-custom-accent peer-focus:bg-custom-jet transition-all">
                        Your Message
                      </label>
                    </div>

                    <button
                      type="submit"
                      disabled={formStatus.type === 'loading'}
                      className="group w-full bg-gradient-to-r from-custom-accent to-yellow-400 text-custom-black font-bold py-4 rounded-xl hover:scale-[1.02] transition-all shadow-lg shadow-custom-accent/30 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-3"
                    >
                      {formStatus.type === 'loading' ? (
                        <>
                          <div className="w-5 h-5 border-2 border-custom-black/30 border-t-custom-black rounded-full animate-spin"></div>
                          Sending...
                        </>
                      ) : (
                        <>
                          <FaPaperPlane className="group-hover:translate-x-1 transition-transform" />
                          Send Message
                        </>
                      )}
                    </button>

                    {formStatus.message && (
                      <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className={`p-4 rounded-xl ${
                          formStatus.type === 'success' 
                            ? 'bg-green-500/20 border border-green-500/50 text-green-400' 
                            : 'bg-red-500/20 border border-red-500/50 text-red-400'
                        }`}
                      >
                        {formStatus.message}
                      </motion.div>
                    )}
                  </form>
                </div>
              </motion.div>

              {/* Social Links */}
              <motion.div
                initial={{ x: 50, opacity: 0 }}
                whileInView={{ x: 0, opacity: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8 }}
                className="space-y-8"
              >
                <div className="bg-custom-jet/30 backdrop-blur-md border border-white/10 rounded-3xl p-8">
                  <h2 className="text-3xl font-bold text-white mb-6">Follow Us</h2>
                  <p className="text-custom-platinum mb-8">Stay updated with our latest inventory and offers</p>
                  
                  <div className="space-y-4">
                    <a
                      href="https://www.facebook.com/RealValueRanchi"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="group flex items-center gap-4 p-4 bg-custom-black/50 border border-white/10 rounded-xl hover:border-blue-500/50 hover:bg-blue-500/10 transition-all"
                    >
                      <div className="w-12 h-12 bg-blue-500/20 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
                        <FaFacebook className="text-2xl text-blue-500" />
                      </div>
                      <div className="flex-1">
                        <h3 className="text-white font-bold">Facebook</h3>
                        <p className="text-custom-platinum text-sm">@RealValueRanchi</p>
                      </div>
                      <div className="text-custom-platinum group-hover:translate-x-1 transition-transform">→</div>
                    </a>

                    <a
                      href="https://www.instagram.com/pmplrealvalue/"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="group flex items-center gap-4 p-4 bg-custom-black/50 border border-white/10 rounded-xl hover:border-pink-500/50 hover:bg-pink-500/10 transition-all"
                    >
                      <div className="w-12 h-12 bg-pink-500/20 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
                        <FaInstagram className="text-2xl text-pink-500" />
                      </div>
                      <div className="flex-1">
                        <h3 className="text-white font-bold">Instagram</h3>
                        <p className="text-custom-platinum text-sm">@pmplrealvalue</p>
                      </div>
                      <div className="text-custom-platinum group-hover:translate-x-1 transition-transform">→</div>
                    </a>
                  </div>
                </div>

                {/* Map */}
                <motion.div
                  initial={{ y: 50, opacity: 0 }}
                  whileInView={{ y: 0, opacity: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.2, duration: 0.8 }}
                  className="bg-custom-jet/30 backdrop-blur-md border border-white/10 rounded-3xl overflow-hidden"
                >
                  <iframe
                    width="100%"
                    height="300"
                    title="map"
                    style={{ border: 0 }}
                    loading="lazy"
                    referrerPolicy="no-referrer-when-downgrade"
                    src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3662.466933990794!2d85.3504478093273!3d23.371319578842947!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x39f4e17d184b0973%3A0xbc6d6be675cca0f0!2sREAL%20VALUE!5e0!3m2!1sen!2sin!4v1714636151144!5m2!1sen!2sin"
                  ></iframe>
                </motion.div>
              </motion.div>
            </div>
          </div>
        </section>

        {/* Showrooms Section */}
        <section className="py-16 px-4 sm:px-6 lg:px-8">
          <div className="max-w-7xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-center mb-12"
            >
              <h2 className="text-4xl font-bold text-white mb-4">Visit Our Showrooms</h2>
              <p className="text-xl text-custom-platinum">Experience our collection in person</p>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {showrooms.map((showroom, index) => (
                <motion.div
                  key={showroom.name}
                  initial={{ y: 50, opacity: 0 }}
                  whileInView={{ y: 0, opacity: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1, duration: 0.6 }}
                  className="group relative"
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-custom-accent/20 to-yellow-400/20 opacity-0 group-hover:opacity-100 blur-xl transition-opacity duration-500"></div>
                  <div className="relative bg-custom-jet/30 backdrop-blur-md border border-white/10 rounded-2xl p-6 hover:border-custom-accent/50 transition-all duration-300">
                    <div className="flex items-start gap-4">
                      <div className="w-12 h-12 bg-custom-accent/20 rounded-xl flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform">
                        <FaMapMarkerAlt className="text-2xl text-custom-accent" />
                      </div>
                      <div className="flex-1">
                        <h3 className="text-xl font-bold text-white mb-2">{showroom.name}</h3>
                        <p className="text-custom-platinum text-sm mb-1">{showroom.address}</p>
                        <p className="text-custom-accent text-xs mb-4">Landmark: {showroom.landmark}</p>
                        <a
                          href={showroom.mapLink}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-2 text-white bg-white/5 hover:bg-custom-accent hover:text-custom-black px-4 py-2 rounded-lg transition-all text-sm font-medium"
                        >
                          <FaMapMarkerAlt />
                          Get Directions
                        </a>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>
      </div>
    </div>
  )
}

export default ContactUsPage
