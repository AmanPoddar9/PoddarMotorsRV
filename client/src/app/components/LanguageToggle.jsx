'use client'
import React from 'react'
import { useLanguage } from '../contexts/LanguageContext'

export default function LanguageToggle({ className = '' }) {
  const { language, toggleLanguage } = useLanguage()

  return (
    <button
      onClick={toggleLanguage}
      className={`flex items-center gap-1 px-3 py-1.5 rounded-full border transition-all duration-300 ${
        language === 'hi' 
          ? 'bg-orange-100 border-orange-500 text-orange-700' 
          : 'bg-gray-100 border-gray-300 text-gray-700 hover:bg-gray-200'
      } ${className}`}
      aria-label="Switch Language"
    >
      <span className={`font-medium text-sm ${language === 'en' ? 'font-bold' : ''}`}>EN</span>
      <span className="text-gray-400">/</span>
      <span className={`font-medium text-sm font-hindi ${language === 'hi' ? 'font-bold' : ''}`}>हिंदी</span>
    </button>
  )
}
