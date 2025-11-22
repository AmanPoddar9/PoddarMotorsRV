'use client'

import { useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { IoMdMenu, IoMdClose } from 'react-icons/io'
import { FiArrowLeft } from 'react-icons/fi'
import Logo from '../../../images/workshop_logo.png'

const WorkshopNavbar = () => {
  const [isOpen, setIsOpen] = useState(false)

  const toggleMenu = () => setIsOpen(!isOpen)

  const NavLink = ({ href, text }) => (
    <Link
      href={href}
      className="text-gray-700 hover:text-workshop-blue font-medium transition-colors duration-300"
      onClick={() => setIsOpen(false)}
    >
      {text}
    </Link>
  )

  return (
    <nav className="bg-white shadow-md sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-20">
          {/* Logo Section */}
          <div className="flex-shrink-0 flex items-center gap-4">
            <Link href="/workshop" className="flex items-center gap-2">
              <Image
                src={Logo}
                alt="Poddar Motors Workshop"
                width={180}
                height={60}
                className="w-auto h-12 object-contain"
              />
            </Link>
          </div>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center space-x-8">
            <NavLink href="#services" text="Services" />
            <NavLink href="#highlights" text="Highlights" />
            <NavLink href="#testimonials" text="Testimonials" />
            <NavLink href="#contact" text="Contact" />
            
            <Link
              href="/"
              className="flex items-center gap-2 px-5 py-2.5 bg-workshop-blue text-white rounded-full font-semibold hover:bg-blue-800 transition-all duration-300 shadow-lg shadow-blue-900/20"
            >
              <FiArrowLeft />
              Back to Real Value
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <div className="flex items-center md:hidden">
            <button
              onClick={toggleMenu}
              className="text-gray-700 hover:text-workshop-blue p-2"
            >
              {isOpen ? <IoMdClose size={28} /> : <IoMdMenu size={28} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="md:hidden bg-white border-t border-gray-100 absolute w-full shadow-lg">
          <div className="px-4 pt-2 pb-6 space-y-4 flex flex-col">
            <NavLink href="#services" text="Services" />
            <NavLink href="#highlights" text="Highlights" />
            <NavLink href="#testimonials" text="Testimonials" />
            <NavLink href="#contact" text="Contact" />
            <Link
              href="/"
              className="flex items-center justify-center gap-2 px-5 py-3 bg-workshop-blue text-white rounded-lg font-semibold hover:bg-blue-800 transition-all duration-300"
              onClick={() => setIsOpen(false)}
            >
              <FiArrowLeft />
              Back to Real Value
            </Link>
          </div>
        </div>
      )}
    </nav>
  )
}

export default WorkshopNavbar
