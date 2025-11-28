'use client'

import { useState, useEffect, useRef } from 'react'
import dynamic from 'next/dynamic'
import Link from 'next/link'
import Image from 'next/image'
import { usePathname } from 'next/navigation'
import { IoMdClose, IoMdMenu, IoMdArrowDropdown } from 'react-icons/io'
import { FaUser, FaCrown } from 'react-icons/fa'
import { useCustomer } from '../utils/customerContext'
import Logo from '../../images/logo_text.png'

const Drawer = dynamic(() => import('antd').then((mod) => mod.Drawer), {
  ssr: false,
})

const Navbar = () => {
  const pathname = usePathname()
  const { customer, logout } = useCustomer()
  const [visible, setVisible] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const [showUserDropdown, setShowUserDropdown] = useState(false)
  const [showMoreDropdown, setShowMoreDropdown] = useState(false)
  
  // Refs for click outside handling
  const userDropdownRef = useRef(null)
  const moreDropdownRef = useRef(null)

  const isWorkshop = pathname?.startsWith('/workshop')

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20)
    }
    
    const handleClickOutside = (event) => {
      if (userDropdownRef.current && !userDropdownRef.current.contains(event.target)) {
        setShowUserDropdown(false)
      }
      if (moreDropdownRef.current && !moreDropdownRef.current.contains(event.target)) {
        setShowMoreDropdown(false)
      }
    }

    window.addEventListener('scroll', handleScroll)
    document.addEventListener('mousedown', handleClickOutside)
    
    return () => {
      window.removeEventListener('scroll', handleScroll)
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [])

  const showDrawer = () => setVisible(true)
  const onClose = () => setVisible(false)

  const NavLink = ({ href, text, isActive }) => (
    <Link href={href} className="relative group py-2">
      <span className={`text-sm font-medium uppercase tracking-wider transition-colors duration-300 ${isActive ? 'text-custom-accent' : 'text-custom-seasalt group-hover:text-custom-accent'}`}>
        {text}
      </span>
      <span className={`absolute bottom-0 left-0 h-0.5 bg-custom-accent transition-all duration-300 ${isActive ? 'w-full' : 'w-0 group-hover:w-full'}`}></span>
    </Link>
  )

  const MobileNavLink = ({ href, text, onClick }) => (
    <Link 
      href={href} 
      onClick={() => {
        onClose()
        if (onClick) onClick()
      }} 
      className="text-xl font-semibold text-white hover:text-custom-accent transition-colors duration-300 w-full text-center py-2"
    >
      {text}
    </Link>
  )

  return (
    <>
      <nav
        className={`fixed top-0 z-50 w-full transition-all duration-300 ${
          scrolled ? 'bg-custom-black/95 backdrop-blur-md border-b border-white/10 shadow-lg' : 'bg-transparent'
        } ${isWorkshop ? 'hidden' : ''}`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-20">
            {/* Logo */}
            <div className="flex-shrink-0 cursor-pointer">
              <Link href="/">
                <Image
                  src={Logo}
                  alt="Poddar Motors"
                  width={160}
                  height={60}
                  className="w-auto h-12 object-contain"
                  priority
                />
              </Link>
            </div>

            {/* Desktop Menu */}
            <div className="hidden lg:flex items-center space-x-8">
              <NavLink href="/buy" text="Buy" isActive={pathname === '/buy'} />
              <NavLink href="/sell" text="Sell" isActive={pathname === '/sell'} />
              
              <Link href="/workshop" className="relative group py-2">
                <span className="text-sm font-bold uppercase tracking-wider text-red-500 transition-colors duration-300 group-hover:text-red-400">
                  Workshop
                </span>
                <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-red-500 transition-all duration-300 group-hover:w-full"></span>
              </Link>

              {/* More Dropdown */}
              <div className="relative" ref={moreDropdownRef}>
                <button
                  onClick={() => setShowMoreDropdown(!showMoreDropdown)}
                  className="flex items-center space-x-1 text-custom-seasalt hover:text-custom-accent transition-colors text-sm font-medium uppercase tracking-wider py-2 group"
                >
                  <span>More</span>
                  <IoMdArrowDropdown className={`text-lg transition-transform duration-300 ${showMoreDropdown ? 'rotate-180' : ''}`} />
                </button>
                
                {showMoreDropdown && (
                  <div className="absolute top-full left-1/2 -translate-x-1/2 mt-2 w-48 bg-custom-jet border border-white/10 rounded-xl shadow-2xl overflow-hidden py-2 animate-fadeIn">
                    <Link href="/buying-guide" className="block px-4 py-2 text-sm text-gray-300 hover:text-white hover:bg-white/10 transition-colors">Buying Guide</Link>
                    <Link href="/finance" className="block px-4 py-2 text-sm text-gray-300 hover:text-white hover:bg-white/10 transition-colors">Finance</Link>
                    <Link href="/scrap" className="block px-4 py-2 text-sm text-gray-300 hover:text-white hover:bg-white/10 transition-colors">Scrap Car</Link>
                    <Link href="/blog" className="block px-4 py-2 text-sm text-gray-300 hover:text-white hover:bg-white/10 transition-colors">Blog</Link>
                    <Link href="/videos" className="block px-4 py-2 text-sm text-gray-300 hover:text-white hover:bg-white/10 transition-colors">Videos</Link>
                    <Link href="/about" className="block px-4 py-2 text-sm text-gray-300 hover:text-white hover:bg-white/10 transition-colors">About Us</Link>
                  </div>
                )}
              </div>

              <Link
                href="/contact"
                className="px-6 py-2 bg-custom-accent text-custom-black font-bold rounded-full hover:bg-yellow-400 transition-all duration-300 shadow-lg shadow-yellow-500/20 text-sm uppercase tracking-wide transform hover:scale-105"
              >
                Contact Us
              </Link>
              
              {/* Customer Auth */}
              {customer ? (
                <div className="relative" ref={userDropdownRef}>
                  <button
                    onClick={() => setShowUserDropdown(!showUserDropdown)}
                    className="flex items-center space-x-2 px-4 py-2 bg-white/5 border border-white/10 rounded-full hover:bg-white/10 transition-all duration-300 group"
                  >
                    <div className="w-8 h-8 rounded-full bg-custom-accent/20 flex items-center justify-center text-custom-accent group-hover:bg-custom-accent group-hover:text-custom-black transition-colors">
                      <FaUser size={14} />
                    </div>
                    <span className="text-white font-medium text-sm truncate max-w-[100px]">{customer.name?.split(' ')[0] || 'User'}</span>
                    {customer.primeStatus?.isActive && (
                      <FaCrown className="text-yellow-400 text-xs" />
                    )}
                  </button>
                  
                  {showUserDropdown && (
                    <div className="absolute right-0 mt-2 w-56 bg-custom-jet border border-white/10 rounded-xl shadow-2xl overflow-hidden z-50 animate-fadeIn">
                      <div className="px-4 py-3 border-b border-white/5">
                        <p className="text-sm text-white font-bold truncate">{customer.name}</p>
                        <p className="text-xs text-gray-400 truncate">{customer.email}</p>
                      </div>
                      <Link
                        href="/profile"
                        onClick={() => setShowUserDropdown(false)}
                        className="block px-4 py-3 text-sm text-gray-300 hover:text-white hover:bg-white/10 transition-colors"
                      >
                        My Profile
                      </Link>
                      <button
                        onClick={() => {
                          logout()
                          setShowUserDropdown(false)
                        }}
                        className="w-full text-left px-4 py-3 text-sm text-red-400 hover:bg-red-500/10 transition-colors"
                      >
                        Logout
                      </button>
                    </div>
                  )}
                </div>
              ) : (
                <Link
                  href="/login"
                  className="px-6 py-2 bg-white/10 text-white font-bold rounded-full hover:bg-white/20 transition-all duration-300 text-sm uppercase tracking-wide border border-white/10"
                >
                  Login
                </Link>
              )}
            </div>

            {/* Mobile Menu Button */}
            <div className="lg:hidden">
              <button
                onClick={showDrawer}
                className="text-white hover:text-custom-accent transition-colors p-2 bg-white/5 rounded-lg border border-white/10"
              >
                <IoMdMenu size={28} />
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Mobile Drawer */}
      <Drawer
        placement="right"
        closable={false}
        onClose={onClose}
        open={visible}
        width="100%"
        className="!bg-custom-black"
        styles={{
          body: { padding: 0, backgroundColor: '#020617' },
          header: { display: 'none' },
        }}
      >
        <div className="flex flex-col h-full bg-custom-black text-white p-6 relative overflow-hidden">
          {/* Background Elements */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-custom-accent/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 pointer-events-none"></div>
          <div className="absolute bottom-0 left-0 w-64 h-64 bg-blue-500/5 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2 pointer-events-none"></div>

          <div className="flex justify-between items-center mb-8 relative z-10">
            <Image src={Logo} alt="Logo" width={140} className="w-auto h-10" />
            <button onClick={onClose} className="text-white hover:text-custom-accent p-2 bg-white/5 rounded-full transition-colors">
              <IoMdClose size={24} />
            </button>
          </div>
          
          <div className="flex flex-col space-y-4 items-center justify-center flex-grow relative z-10 overflow-y-auto">
            <MobileNavLink href="/" text="Home" />
            <MobileNavLink href="/buy" text="Buy Car" />
            <MobileNavLink href="/sell" text="Sell Car" />
            <Link href="/workshop" onClick={onClose} className="text-xl font-bold text-red-500 hover:text-red-400 transition-colors duration-300 w-full text-center py-2">
              Workshop
            </Link>
            
            <div className="w-16 h-px bg-white/10 my-2"></div>
            
            <MobileNavLink href="/buying-guide" text="Buying Guide" />
            <MobileNavLink href="/finance" text="Finance" />
            <MobileNavLink href="/scrap" text="Scrap Car" />
            <MobileNavLink href="/blog" text="Blog" />
            <MobileNavLink href="/videos" text="Videos" />
            <MobileNavLink href="/about" text="About Us" />
            <MobileNavLink href="/contact" text="Contact Us" />
          </div>
          
          <div className="mt-auto pt-8 relative z-10">
            {customer ? (
              <div className="flex flex-col space-y-3">
                <div className="flex items-center justify-center space-x-3 mb-2">
                  <div className="w-10 h-10 rounded-full bg-custom-accent/20 flex items-center justify-center text-custom-accent">
                    <FaUser size={18} />
                  </div>
                  <div className="text-center">
                    <p className="text-white font-bold">{customer.name}</p>
                    <p className="text-xs text-gray-400">{customer.email}</p>
                  </div>
                </div>
                <Link 
                  href="/profile" 
                  onClick={onClose}
                  className="w-full py-3 bg-white/10 text-white font-bold rounded-xl hover:bg-white/20 transition-all text-center border border-white/10"
                >
                  My Profile
                </Link>
                <button 
                  onClick={() => {
                    logout()
                    onClose()
                  }}
                  className="w-full py-3 bg-red-500/10 text-red-400 font-bold rounded-xl hover:bg-red-500/20 transition-all text-center border border-red-500/20"
                >
                  Logout
                </button>
              </div>
            ) : (
              <Link
                href="/login"
                onClick={onClose}
                className="block w-full py-4 bg-custom-accent text-custom-black font-bold text-xl rounded-xl hover:bg-yellow-400 transition-all text-center shadow-lg shadow-yellow-500/20"
              >
                Login / Sign Up
              </Link>
            )}
            
            <div className="mt-6 text-center text-gray-500 text-xs">
              © {new Date().getFullYear()} Poddar Motors
            </div>
          </div>
        </div>
      </Drawer>
    </>
  )
}

export default Navbar
