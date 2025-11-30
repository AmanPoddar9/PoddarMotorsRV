'use client'
import React, { createContext, useContext, useState, useEffect } from 'react'
import { translations } from '../translations'

const LanguageContext = createContext()

export function LanguageProvider({ children }) {
  const [language, setLanguage] = useState('en')
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
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
    localStorage.setItem('language', newLang)
  }

  // Translation helper function
  // Usage: t('path.to.key') -> "Value" or "मान"
  const t = (path) => {
    const keys = path.split('.')
    let current = translations[language]
    
    for (const key of keys) {
      if (current[key] === undefined) {
        console.warn(`Translation missing for key: ${path} in language: ${language}`)
        return path // Fallback to key if translation missing
      }
      current = current[key]
    }
    
    return current
  }

  // Provide default context even before mount to prevent SSR errors
  const value = {
    language: mounted ? language : 'en',
    toggleLanguage: mounted ? toggleLanguage : () => {},
    t: mounted ? t : (path) => path // Fallback to key during SSR
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
