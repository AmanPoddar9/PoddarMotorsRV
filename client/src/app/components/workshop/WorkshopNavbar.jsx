'use client'

import { useState, useRef, useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { IoMdMenu, IoMdClose } from 'react-icons/io'
import { FiArrowLeft } from 'react-icons/fi'
import { FaUser, FaCrown } from 'react-icons/fa'
import { useCustomer } from '../../utils/customerContext'
import Logo from '../../../images/workshop_logo.png'

const WorkshopNavbar = () => {
  const [isOpen, setIsOpen] = useState(false)
  const [showUserDropdown, setShowUserDropdown] = useState(false)
  const { customer, logout } = useCustomer()
  const userDropdownRef = useRef(null)

  const toggleMenu = () => setIsOpen(!isOpen)

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (userDropdownRef.current && !userDropdownRef.current.contains(event.target)) {
        setShowUserDropdown(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

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
            
            {/* Customer Auth */}
            {customer ? (
              <div className="relative" ref={userDropdownRef}>
                <button
                  onClick={() => setShowUserDropdown(!showUserDropdown)}
                  className="flex items-center space-x-2 px-4 py-2 bg-blue-50 border border-blue-200 rounded-full hover:bg-blue-100 transition-all duration-300 group"
                >
                  <div className="w-8 h-8 rounded-full bg-workshop-blue/20 flex items-center justify-center text-workshop-blue group-hover:bg-workshop-blue group-hover:text-white transition-colors">
                    <FaUser size={14} />
                  </div>
                  <span className="text-gray-800 font-medium text-sm truncate max-w-[100px]">{customer.name.split(' ')[0]}</span>
                  {customer.primeStatus?.isActive && (
                    <FaCrown className="text-yellow-500 text-xs" />
                  )}
                </button>
                
                {showUserDropdown && (
                  <div className="absolute right-0 mt-2 w-56 bg-white border border-gray-200 rounded-xl shadow-2xl overflow-hidden z-50 animate-fadeIn">
                    <div className="px-4 py-3 border-b border-gray-100">
                      <p className="text-sm text-gray-800 font-bold truncate">{customer.name}</p>
                      <p className="text-xs text-gray-500 truncate">{customer.email}</p>
                    </div>
                    <Link
                      href="/profile"
                      onClick={() => setShowUserDropdown(false)}
                      className="block px-4 py-3 text-sm text-gray-700 hover:text-workshop-blue hover:bg-blue-50 transition-colors"
                    >
                      My Profile
                    </Link>
                    <button
                      onClick={() => {
                        logout()
                        setShowUserDropdown(false)
                      }}
                      className="w-full text-left px-4 py-3 text-sm text-red-600 hover:bg-red-50 transition-colors"
                    >
                      Logout
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <Link
                href="/login"
                className="px-6 py-2 bg-blue-50 text-workshop-blue font-bold rounded-full hover:bg-blue-100 transition-all duration-300 text-sm uppercase tracking-wide border border-blue-200"
              >
                Login
              </Link>
            )}
            
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
            
            {/* Mobile Auth Section */}
            {customer ? (
              <div className="flex flex-col space-y-3 pt-4 border-t border-gray-200">
                <div className="flex items-center space-x-3 px-3">
                  <div className="w-10 h-10 rounded-full bg-workshop-blue/20 flex items-center justify-center text-workshop-blue">
                    <FaUser size={18} />
                  </div>
                  <div>
                    <p className="text-gray-800 font-bold text-sm">{customer.name}</p>
                    <p className="text-xs text-gray-500">{customer.email}</p>
                  </div>
                </div>
                <Link 
                  href="/profile" 
                  onClick={() => setIsOpen(false)}
                  className="w-full py-3 bg-blue-50 text-workshop-blue font-bold rounded-lg hover:bg-blue-100 transition-all text-center border border-blue-200"
                >
                  My Profile
                </Link>
                <button 
                  onClick={() => {
                    logout()
                    setIsOpen(false)
                  }}
                  className="w-full py-3 bg-red-50 text-red-600 font-bold rounded-lg hover:bg-red-100 transition-all text-center border border-red-200"
                >
                  Logout
                </button>
              </div>
            ) : (
              <Link
                href="/login"
                onClick={() => setIsOpen(false)}
                className="block w-full py-3 bg-workshop-blue text-white font-bold text-center rounded-lg hover:bg-blue-800 transition-all shadow-lg"
              >
                Login / Sign Up
              </Link>
            )}
            
            <Link
              href="/"
              className="flex items-center justify-center gap-2 px-5 py-3 bg-gray-100 text-gray-700 rounded-lg font-semibold hover:bg-gray-200 transition-all duration-300"
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
