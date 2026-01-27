'use client'
import React, { createContext, useContext, useState, useEffect } from 'react'
import { translations } from '../translations'

const LanguageContext = createContext()

export function LanguageProvider({ children }) {
  const [language, setLanguage] = useState('en')
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
    if (typeof window !== 'undefined') {
      const savedLang = localStorage.getItem('language')
      
      if (savedLang && (savedLang === 'en' || savedLang === 'hi')) {
        setLanguage(savedLang)
      } else {
        // Auto-detect browser language if no preference saved
        // Check if browser language starts with 'hi' (Hindi)
        const browserLang = navigator.language || navigator.userLanguage
        if (browserLang && browserLang.toLowerCase().startsWith('hi')) {
          setLanguage('hi')
        }
      }
    }
  }, [])

  const toggleLanguage = () => {
    const newLang = language === 'en' ? 'hi' : 'en'
    setLanguage(newLang)
    if (typeof window !== 'undefined') {
      localStorage.setItem('language', newLang)
    }
  }

  // Translation helper function
  const t = (path) => {
    // Safely access translations
    if (!path || typeof path !== 'string') {
      return ''
    }

    const keys = path.split('.')
    let current = translations[language]
    
    for (const key of keys) {
      if (current === undefined || current[key] === undefined) {
        // Fallback to English if Hindi translation is missing
        if (language === 'hi') {
          let fallback = translations['en']
          for (const k of keys) {
            if (fallback === undefined || fallback[k] === undefined) {
              return path
            }
            fallback = fallback[k]
          }
          return fallback
        }
        return path
      }
      current = current[key]
    }
    
    return current
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
