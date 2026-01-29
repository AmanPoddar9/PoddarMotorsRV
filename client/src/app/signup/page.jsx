'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { useCustomer } from '../utils/customerContext'
import { FaUser, FaEnvelope, FaPhone, FaLock, FaSpinner, FaCheckCircle, FaExclamationCircle, FaEye, FaEyeSlash } from 'react-icons/fa'
import { motion } from 'framer-motion'

export default function SignupPage() {
  const { signup } = useCustomer()
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    mobile: '',
    password: ''
  })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [passwordStrength, setPasswordStrength] = useState(0)

  useEffect(() => {
    // Simple password strength calculation
    const pass = formData.password
    let strength = 0
    if (pass.length > 5) strength += 1
    if (pass.length > 8) strength += 1
    if (/[A-Z]/.test(pass)) strength += 1
    if (/[0-9]/.test(pass)) strength += 1
    if (/[^A-Za-z0-9]/.test(pass)) strength += 1
    setPasswordStrength(strength)
  }, [formData.password])

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    // Basic validation
    if (passwordStrength < 2) {
        setError('Password is too weak. Please use a stronger password.')
        setLoading(false)
        return
    }
    
    const result = await signup(formData)
    
    if (!result.success) {
      setError(result.message)
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex bg-custom-black">
      {/* Left Panel - Hero/Branding (Hidden on mobile) */}
      <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden">
        <Image
          src="/signup_hero.png"
          alt="Poddar Motors Premium Experience"
          fill
          className="object-cover"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/50 to-transparent flex flex-col justify-end p-12">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <h1 className="text-4xl font-bold text-white mb-4">
              Welcome to the <span className="text-custom-accent">Poddar Ecosystem</span>
            </h1>
            <p className="text-lg text-gray-300 max-w-md">
              Join our exclusive community for premium vehicle services, seamless auctions, and personalized automotive care.
            </p>
            <div className="mt-8 flex gap-4">
                <div className="flex items-center gap-2 text-sm text-gray-400">
                    <FaCheckCircle className="text-custom-accent" /> Premium Access
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-400">
                    <FaCheckCircle className="text-custom-accent" /> Verified Dealers
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-400">
                    <FaCheckCircle className="text-custom-accent" /> 24/7 Support
                </div>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Right Panel - Form */}
      <div className="w-full lg:w-1/2 flex flex-col justify-center px-4 sm:px-6 lg:px-20 xl:px-24 bg-custom-black relative">
        {/* Background blobs for visual interest */}
        <div className="absolute top-0 right-0 -mt-20 -mr-20 w-80 h-80 bg-custom-accent/10 rounded-full blur-3xl pointer-events-none"></div>
        <div className="absolute bottom-0 left-0 -mb-20 -ml-20 w-80 h-80 bg-blue-500/10 rounded-full blur-3xl pointer-events-none"></div>

        <div className="w-full max-w-md mx-auto relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <h2 className="text-3xl font-extrabold text-white tracking-tight">
              Create your account
            </h2>
            <p className="mt-2 text-sm text-gray-400">
              Already a member?{' '}
              <Link href="/login" className="font-medium text-custom-accent hover:text-yellow-400 transition-colors">
                Sign in to your account
              </Link>
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="mt-8"
          >
            <form className="space-y-6" onSubmit={handleSubmit}>
              {error && (
                <div className="bg-red-500/10 border border-red-500/50 rounded-lg p-4 flex items-center gap-3">
                  <FaExclamationCircle className="text-red-400 flex-shrink-0" />
                  <p className="text-sm text-red-400">{error}</p>
                </div>
              )}

              <div className="space-y-5">
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-gray-300">
                    Full Name
                  </label>
                  <div className="mt-1 relative rounded-lg shadow-sm group">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <FaUser className="text-gray-500 group-focus-within:text-custom-accent transition-colors" />
                    </div>
                    <input
                      id="name"
                      name="name"
                      type="text"
                      required
                      className="block w-full pl-10 bg-white/5 border border-white/10 rounded-lg py-3 text-white placeholder-gray-500 focus:ring-2 focus:ring-custom-accent/50 focus:border-custom-accent sm:text-sm transition-all"
                      placeholder="John Doe"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-300">
                    Email address
                  </label>
                  <div className="mt-1 relative rounded-lg shadow-sm group">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <FaEnvelope className="text-gray-500 group-focus-within:text-custom-accent transition-colors" />
                    </div>
                    <input
                      id="email"
                      name="email"
                      type="email"
                      required
                      className="block w-full pl-10 bg-white/5 border border-white/10 rounded-lg py-3 text-white placeholder-gray-500 focus:ring-2 focus:ring-custom-accent/50 focus:border-custom-accent sm:text-sm transition-all"
                      placeholder="you@example.com"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="mobile" className="block text-sm font-medium text-gray-300">
                    Mobile Number
                  </label>
                  <div className="mt-1 relative rounded-lg shadow-sm group">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <FaPhone className="text-gray-500 group-focus-within:text-custom-accent transition-colors" />
                    </div>
                    <input
                      id="mobile"
                      name="mobile"
                      type="tel"
                      required
                      className="block w-full pl-10 bg-white/5 border border-white/10 rounded-lg py-3 text-white placeholder-gray-500 focus:ring-2 focus:ring-custom-accent/50 focus:border-custom-accent sm:text-sm transition-all"
                      placeholder="9876543210"
                      value={formData.mobile}
                      onChange={(e) => setFormData({ ...formData, mobile: e.target.value })}
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="password" className="block text-sm font-medium text-gray-300">
                    Password
                  </label>
                  <div className="mt-1 relative rounded-lg shadow-sm group">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <FaLock className="text-gray-500 group-focus-within:text-custom-accent transition-colors" />
                    </div>
                    <input
                      id="password"
                      name="password"
                      type={showPassword ? "text" : "password"}
                      required
                      className="block w-full pl-10 pr-10 bg-white/5 border border-white/10 rounded-lg py-3 text-white placeholder-gray-500 focus:ring-2 focus:ring-custom-accent/50 focus:border-custom-accent sm:text-sm transition-all"
                      placeholder="••••••••"
                      value={formData.password}
                      onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                    />
                    <button
                        type="button"
                        className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-500 hover:text-white transition-colors"
                        onClick={() => setShowPassword(!showPassword)}
                    >
                        {showPassword ? <FaEyeSlash /> : <FaEye />}
                    </button>
                  </div>
                  {/* Password Strength Indicator */}
                   {formData.password && (
                    <div className="mt-2 flex gap-1 h-1">
                        {[1, 2, 3, 4, 5].map((i) => (
                            <div 
                                key={i} 
                                className={`flex-1 rounded-full transition-all duration-300 ${i <= passwordStrength ? 'bg-custom-accent' : 'bg-white/10'}`}
                            ></div>
                        ))}
                    </div>
                  )}
                </div>
              </div>

              <div className="flex items-center">
                <input
                  id="terms"
                  name="terms"
                  type="checkbox"
                  required
                  className="h-4 w-4 text-custom-accent focus:ring-custom-accent border-gray-600 rounded bg-white/10"
                />
                <label htmlFor="terms" className="ml-2 block text-sm text-gray-400">
                  I agree to the{' '}
                  <a href="#" className="font-medium text-custom-accent hover:text-yellow-400">
                    Terms
                  </a>{' '}
                  and{' '}
                  <a href="#" className="font-medium text-custom-accent hover:text-yellow-400">
                    Privacy Policy
                  </a>
                </label>
              </div>

              <div>
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full flex justify-center py-3 px-4 border border-transparent rounded-lg shadow-lg text-sm font-bold text-custom-black bg-custom-accent hover:bg-yellow-400 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-custom-accent disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 transform hover:scale-[1.01] hover:shadow-custom-accent/20"
                >
                  {loading ? (
                    <FaSpinner className="animate-spin h-5 w-5" />
                  ) : (
                    'Create Account'
                  )}
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      </div>
    </div>
  )
}
