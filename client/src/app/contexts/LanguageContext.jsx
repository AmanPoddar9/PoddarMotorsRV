'use client'
import React, { createContext, useContext, useState, useEffect } from 'react'

const LanguageContext = createContext()

export function LanguageProvider({ children }) {
  const [language, setLanguage] = useState('en')
  const [mounted, setMounted] = useState(false)
  const [translations, setTranslations] = useState(null)

  useEffect(() => {
    // Only load translations on client side after mount
    import('../translations').then((module) => {
      setTranslations(module.translations)
    })
    
    setMounted(true)
    // Check localStorage for saved preference
    if (typeof window !== 'undefined') {
      const savedLang = localStorage.getItem('language')
      if (savedLang && (savedLang === 'en' || savedLang === 'hi')) {
        setLanguage(savedLang)
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
    // Return empty string if not mounted or translations not loaded
    if (!mounted || !translations) {
      return ''
    }

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
              return ''
            }
            fallback = fallback[k]
          }
          return fallback
        }
        return ''
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
