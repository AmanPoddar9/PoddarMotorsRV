'use client'

import { LanguageProvider } from './contexts/LanguageContext'
import { CustomerProvider } from './utils/customerContext'

export function Providers({ children }) {
  return (
    <LanguageProvider>
      <CustomerProvider>
        {children}
      </CustomerProvider>
    </LanguageProvider>
  )
}
