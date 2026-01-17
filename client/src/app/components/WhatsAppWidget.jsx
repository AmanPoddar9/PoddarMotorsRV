'use client'
import React from 'react'
import { FaWhatsapp } from 'react-icons/fa'
import Link from 'next/link'
import { usePathname } from 'next/navigation'

const WhatsAppWidget = () => {
  const pathname = usePathname()
  const phoneNumber = '15558769313' // Added country code
  const message = "Hi, I'm interested in buying a car from Poddar Motors."

  // Don't show on sell page or admin pages
  if (pathname === '/sell' || pathname?.startsWith('/admin')) return null

  return (
    <Link
      href={`https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`}
      target="_blank"
      rel="noopener noreferrer"
      className="fixed bottom-20 right-4 z-50 bg-[#25D366] text-white p-3 rounded-full shadow-lg hover:bg-[#20bd5a] transition duration-300 ease-in-out flex items-center justify-center group"
      aria-label="Chat on WhatsApp"
    >
      <FaWhatsapp className="text-3xl" />
      <span className="max-w-0 overflow-hidden group-hover:max-w-xs transition-all duration-500 ease-in-out whitespace-nowrap ml-0 group-hover:ml-2 font-medium">
        Chat with us
      </span>
    </Link>
  )
}

export default WhatsAppWidget
