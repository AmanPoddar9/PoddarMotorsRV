'use client'

import { createContext, useContext, useState, useEffect } from 'react'
import axios from 'axios'
import { useRouter } from 'next/navigation'

const CustomerContext = createContext()

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000'

export const CustomerProvider = ({ children }) => {
  const [customer, setCustomer] = useState(null)
  const [loading, setLoading] = useState(true)
  const router = useRouter()

  // Check auth status on mount
  useEffect(() => {
    checkAuth()
  }, [])

  const checkAuth = async () => {
    try {
      const res = await axios.get(`${API_URL}/api/customer/me`, {
        withCredentials: true
      })
      
      if (res.data.user) {
        // Optimistically set customer with basic info from token
        // Fallback for old tokens that don't have name
        const user = { ...res.data.user, name: res.data.user.name || 'Valued Customer' }
        setCustomer(user)
        
        // Fetch full profile in background - if it fails, we still have basic auth
        try {
          await fetchProfile()
        } catch (err) {
          console.error('Background profile fetch failed:', err)
          // Do NOT logout user here - they are still authenticated
        }
      } else {
        setCustomer(null)
      }
    } catch (error) {
      setCustomer(null)
    } finally {
      setLoading(false)
    }
  }

  const fetchProfile = async () => {
    try {
      const res = await axios.get(`${API_URL}/api/customer/dashboard`, {
        withCredentials: true
      })
      setCustomer(res.data.profile)
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
      setCustomer(res.data.customer)
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
      setCustomer(res.data.customer)
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
      setCustomer(null)
      router.push('/')
    } catch (error) {
      console.error('Logout error:', error)
    }
  }

  return (
    <CustomerContext.Provider value={{ customer, loading, login, signup, logout, fetchProfile }}>
      {children}
    </CustomerContext.Provider>
  )
}

export const useCustomer = () => useContext(CustomerContext)
