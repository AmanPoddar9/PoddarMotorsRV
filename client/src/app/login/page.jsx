'use client'

import { useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import { useCustomer } from '../utils/customerContext'
import { FaEnvelope, FaLock, FaSpinner, FaExclamationCircle, FaEye, FaEyeSlash } from 'react-icons/fa'
import { motion } from 'framer-motion'
import HeroImage from '../../images/hero.jpg'

export default function LoginPage() {
  const { login } = useCustomer()
  const router = useRouter()
  const [formData, setFormData] = useState({ email: '', password: '' })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    
    try {
      const result = await login(formData.email, formData.password)
      
      if (!result.success) {
        setError(result.message)
        setLoading(false)
      } else {
        // Successful login will redirect via the context or we can do it here if needed
        // but typically context handles state update and redirection might happen there or in a useEffect
        // For now we assume context handles it or we let it pass.
        // If context doesn't redirect, we might need router.push('/dashboard')
        // Checks result for redirect path if provided
        if (result.redirectUrl) {
           router.push(result.redirectUrl)
        }
      }
    } catch (err) {
      setError('An unexpected error occurred. Please try again.')
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen w-full flex bg-custom-black">
      {/* Left Panel - Image (Hidden on mobile) */}
      <div className="hidden lg:block lg:w-1/2 relative overflow-hidden">
        <div className="absolute inset-0 z-10 bg-gradient-to-r from-custom-black/80 to-transparent mix-blend-multiply"></div>
        <Image
          src={HeroImage}
          alt="Poddar Motors Premium Vehicles"
          fill
          className="object-cover object-center"
          priority
          sizes="50vw"
        />
        <div className="absolute inset-0 z-20 flex flex-col justify-end p-16 bg-gradient-to-t from-custom-black via-custom-black/40 to-transparent">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.8 }}
          >
            <h1 className="text-5xl font-bold text-white mb-6 font-display leading-tight">
              Experience the <span className="text-custom-accent">Extraordinary</span>
            </h1>
            <p className="text-lg text-gray-300 max-w-xl leading-relaxed">
              Join our exclusive community to access premium vehicle listings, schedule inspections, and manage your automotive portfolio with ease.
            </p>
          </motion.div>
        </div>
      </div>

      {/* Right Panel - Form */}
      <div className="w-full lg:w-1/2 flex flex-col justify-center items-center px-6 sm:px-12 lg:px-24 xl:px-32 relative bg-custom-black">
        {/* Decorative elements */}
        <div className="absolute top-0 right-0 p-8">
           {/* Optional: Logo or simplistic branding here if not sticking to standard header */}
        </div>
        
        <div className="w-full max-w-md">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="mb-10"
          >
            <h2 className="text-3xl sm:text-4xl font-bold text-white mb-3 font-display">
              Welcome Back
            </h2>
            <p className="text-custom-platinum text-base">
              Please enter your details to sign in.
            </p>
          </motion.div>

          {error && (
             <motion.div 
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                className="mb-6 bg-red-500/10 border border-red-500/20 rounded-xl p-4 flex items-start gap-3"
             >
                <FaExclamationCircle className="text-red-500 mt-0.5 flex-shrink-0" />
                <p className="text-sm text-red-200">{error}</p>
             </motion.div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-5">
              <div className="space-y-2">
                <label className="text-sm font-medium text-custom-platinum ml-1" htmlFor="email">Email Address</label>
                <div className="relative group">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none z-10">
                    <FaEnvelope className="text-gray-500 group-focus-within:text-custom-accent transition-colors" />
                  </div>
                  <input
                    id="email"
                    type="email"
                    required
                    className="block w-full pl-11 pr-4 py-3.5 bg-custom-surface border border-white/10 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-custom-accent/50 focus:border-custom-accent/50 transition-all duration-300 sm:text-sm"
                    placeholder="name@example.com"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-custom-platinum ml-1" htmlFor="password">Password</label>
                <div className="relative group">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none z-10">
                    <FaLock className="text-gray-500 group-focus-within:text-custom-accent transition-colors" />
                  </div>
                  <input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    required
                    className="block w-full pl-11 pr-12 py-3.5 bg-custom-surface border border-white/10 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-custom-accent/50 focus:border-custom-accent/50 transition-all duration-300 sm:text-sm"
                    placeholder="••••••••"
                    value={formData.password}
                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-0 pr-4 flex items-center text-gray-500 hover:text-white transition-colors focus:outline-none"
                  >
                    {showPassword ? <FaEyeSlash size={18} /> : <FaEye size={18} />}
                  </button>
                </div>
              </div>
            </div>

            <div className="flex items-center justify-between pt-2">
              <div className="flex items-center">
                <input
                  id="remember-me"
                  name="remember-me"
                  type="checkbox"
                  className="h-4 w-4 text-custom-accent focus:ring-custom-accent border-gray-600 rounded bg-custom-surface cursor-pointer"
                />
                <label htmlFor="remember-me" className="ml-2 block text-sm text-custom-platinum cursor-pointer select-none">
                  Remember me
                </label>
              </div>

              <div className="text-sm">
                <Link href="/forgot-password" className="font-medium text-custom-accent hover:text-yellow-400 transition-colors">
                  Forgot password?
                </Link>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full relative flex justify-center py-3.5 px-4 border border-transparent rounded-xl shadow-lg text-sm font-bold text-custom-black bg-custom-accent hover:bg-yellow-400 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-custom-black focus:ring-custom-accent disabled:opacity-70 disabled:cursor-not-allowed transition-all duration-300 transform hover:-translate-y-0.5"
            >
              {loading && (
                <span className="absolute left-4 flex items-center">
                  <FaSpinner className="animate-spin h-5 w-5 text-custom-black/70" />
                </span>
              )}
              {loading ? 'Signing in...' : 'Sign In'}
            </button>
          </form>

          <p className="mt-8 text-center text-sm text-gray-400">
            Don't have an account?{' '}
            <Link href="/signup" className="font-medium text-custom-accent hover:text-yellow-400 transition-colors">
              Create free account
            </Link>
          </p>
        </div>
        
        {/* Footer info or copyright could go here */}
        <div className="absolute bottom-6 text-xs text-gray-600">
           &copy; {new Date().getFullYear()} Poddar Motors Real Value
        </div>
      </div>
    </div>
  )
}
