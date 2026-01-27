'use client'

import { LanguageProvider } from './contexts/LanguageContext'
import { CustomerProvider } from './utils/customerContext'
import { Toaster } from 'react-hot-toast'

export function Providers({ children }) {
  return (
    <LanguageProvider>
      <CustomerProvider>
        {children}
        <Toaster position="top-right" />
      </CustomerProvider>
    </LanguageProvider>
  )
}
