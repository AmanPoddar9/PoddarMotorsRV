'use client'

import { createContext, useContext, useState, useEffect } from 'react'
import axios from 'axios'
import { useRouter } from 'next/navigation'
import API_URL from '../config/api'

const CustomerContext = createContext()

export const CustomerProvider = ({ children }) => {
  const [customer, setCustomer] = useState(null)
  const [loading, setLoading] = useState(true)
  const router = useRouter()

  const persistCustomer = (data) => {
    setCustomer(data)

    if (typeof window === 'undefined') return

    if (data) {
      localStorage.setItem('customer', JSON.stringify(data))
    } else {
      localStorage.removeItem('customer')
    }
  }

  // Check auth status on mount
  useEffect(() => {
    // Seed initial state from persisted profile to avoid flicker on reloads
    if (typeof window !== 'undefined') {
      const storedCustomer = localStorage.getItem('customer')
      if (storedCustomer) {
        setCustomer(JSON.parse(storedCustomer))
      }
    }

    checkAuth()
  }, [])

  const checkAuth = async () => {
    try {
      const res = await axios.get(`${API_URL}/api/customer/me`, {
        withCredentials: true
      })

      if (res.data.user) {
        // Optimistically set customer with fresh data from DB
        persistCustomer(res.data.user)

        // Fetch full profile in background - if it fails, we still have basic auth
        try {
          await fetchProfile()
        } catch (err) {
          console.error('Background profile fetch failed:', err)
          // Do NOT logout user here - they are still authenticated
        }
      } else {
        persistCustomer(null)
      }
    } catch (error) {
      if (error.response?.status === 401) {
        persistCustomer(null)
      } else {
        // Network/server errors should not immediately log the user out
        // Keep any cached profile so the UI remains stable
        console.error('Auth check failed, using cached profile if available:', error)
      }
    } finally {
      setLoading(false)
    }
  }

  const fetchProfile = async () => {
    try {
      const res = await axios.get(`${API_URL}/api/customer/dashboard`, {
        withCredentials: true
      })
      persistCustomer(res.data.profile)
    } catch (error) {
      console.error('Error fetching profile:', error)
    } finally {
      setLoading(false)
    }
  }

  const login = async (email, password) => {
    try {
      const res = await axios.post(`${API_URL}/api/customer/login`, 
        { email, password },
        { withCredentials: true }
      )
      persistCustomer(res.data.customer)
      router.push('/profile')
      return { success: true }
    } catch (error) {
      return { 
        success: false, 
        message: error.response?.data?.message || 'Login failed' 
      }
    }
  }

  const signup = async (data) => {
    try {
      const res = await axios.post(`${API_URL}/api/customer/signup`, 
        data,
        { withCredentials: true }
      )
      persistCustomer(res.data.customer)
      router.push('/profile')
      return { success: true }
    } catch (error) {
      return { 
        success: false, 
        message: error.response?.data?.message || 'Signup failed' 
      }
    }
  }

  const logout = async () => {
    try {
      await axios.post(`${API_URL}/api/customer/logout`, {}, {
        withCredentials: true
      })
      persistCustomer(null)
      router.push('/')
    } catch (error) {
      console.error('Logout error:', error)
    }
  }

  const updateWishlist = (wishlist) => {
    setCustomer(prev => {
      const updated = prev ? { ...prev, wishlist } : prev
      if (updated) {
        persistCustomer(updated)
      }
      return updated
    })
  }

  return (
    <CustomerContext.Provider value={{ customer, loading, login, signup, logout, fetchProfile, updateWishlist }}>
      {children}
    </CustomerContext.Provider>
  )
}

export const useCustomer = () => useContext(CustomerContext)
