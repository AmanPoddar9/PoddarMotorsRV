'use client'
import React, { createContext, useContext, useState, useEffect } from 'react'

const LanguageContext = createContext()

export function LanguageProvider({ children }) {
  const [language, setLanguage] = useState('en')
  const [mounted, setMounted] = useState(false)
  const [translations, setTranslations] = useState(null)

  useEffect(() => {
    // Load translations only on client side
    import('../translations').then((module) => {
      setTranslations(module.translations)
    })
    
    // Check localStorage for saved preference
    const savedLang = localStorage.getItem('language')
    if (savedLang && (savedLang === 'en' || savedLang === 'hi')) {
      setLanguage(savedLang)
    }
    setMounted(true)
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
    // If translations not loaded yet or not mounted, return the path as fallback
    if (!mounted || !translations) {
      return path
    }

    const keys = path.split('.')
    let current = translations[language]
    
    for (const key of keys) {
      if (current === undefined || current[key] === undefined) {
        console.warn(`Translation missing for key: ${path} in language: ${language}`)
        return path // Fallback to key if translation missing
      }
      current = current[key]
    }
    
    return current
  }

  // Provide safe context even before mount
  const value = {
    language,
    toggleLanguage,
    t
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
