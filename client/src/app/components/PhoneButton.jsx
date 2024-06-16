'use client'
import React from 'react'
import { FaPhone, FaPhoneAlt } from 'react-icons/fa'
import Link from 'next/link'
import { usePathname, useSearchParams } from 'next/navigation'

const PhoneButton = () => {
  const phoneNumber = '8709119090'

  const pathname = usePathname()
  const isBuyPage = /^\/buy\/[a-zA-Z0-9-_]+$/.test(pathname)

  if (isBuyPage) {
    return null
  }

  return (
    <Link
      href={`tel:${phoneNumber}`}
      className="fixed bottom-4 right-4 z-10 bg-blue-500 text-white py-2.5 px-4 rounded-full shadow-lg hover:bg-blue-600 transition duration-300 ease-in-out md:text-lg"
    >
      <FaPhoneAlt className="inline-block mr-2" />
      Call Us
    </Link>
  )
}

export default PhoneButton
