'use client'
import React, { createContext, useContext, useState, useEffect } from 'react'

const LanguageContext = createContext()

export function LanguageProvider({ children }) {
  const [language, setLanguage] = useState('en')
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
    if (typeof window !== 'undefined') {
      const savedLang = localStorage.getItem('language')
      if (savedLang) setLanguage(savedLang)
    }
  }, [])

  const toggleLanguage = () => {
    const newLang = language === 'en' ? 'hi' : 'en'
    setLanguage(newLang)
    if (typeof window !== 'undefined') {
      localStorage.setItem('language', newLang)
    }
  }

  // Simplified t function for debugging
  const t = (path) => {
    return path
  }

  const value = {
    language,
    toggleLanguage,
    t,
    mounted
  }

  return (
    <LanguageContext.Provider value={value}>
      {children}
    </LanguageContext.Provider>
  )
}

export function useLanguage() {
  const context = useContext(LanguageContext)
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider')
  }
  return context
}
