'use client'

import { useState, useEffect } from 'react'
import dynamic from 'next/dynamic'
import Link from 'next/link'
import Image from 'next/image'
import { usePathname } from 'next/navigation'
import { IoMdClose, IoMdMenu } from 'react-icons/io'
import Logo from '../../images/logo_text.png'

const Drawer = dynamic(() => import('antd').then((mod) => mod.Drawer), {
  ssr: false,
})

const Navbar = () => {
  const pathname = usePathname()
  const [visible, setVisible] = useState(false)
  const [scrolled, setScrolled] = useState(false)

  const isWorkshop = pathname?.startsWith('/workshop')

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20)
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const showDrawer = () => setVisible(true)
  const onClose = () => setVisible(false)

  const NavLink = ({ href, text }) => (
    <Link href={href} className="relative group py-2">
      <span className="text-custom-seasalt font-medium text-sm uppercase tracking-wider transition-colors duration-300 group-hover:text-custom-accent">
        {text}
      </span>
      <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-custom-accent transition-all duration-300 group-hover:w-full"></span>
    </Link>
  )

  const MobileNavLink = ({ href, text }) => (
    <Link href={href} onClick={onClose} className="text-2xl font-bold text-white hover:text-custom-accent transition-colors duration-300">
      {text}
    </Link>
  )

  return (
    <>
      <nav
        className={`fixed top-0 z-50 w-full bg-custom-black/95 backdrop-blur-md border-b border-white/10 transition-all duration-300 ${isWorkshop ? 'hidden' : ''}`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <div className="flex-shrink-0 cursor-pointer">
              <Link href="/">
                <Image
                  src={Logo}
                  alt="Poddar Motors"
                  width={140}
                  height={50}
                  className="w-auto h-10 object-contain"
                  priority
                />
              </Link>
            </div>

            {/* Desktop Menu */}
            <div className="hidden lg:flex items-center space-x-8">
              <NavLink href="/buy" text="Buy" />
              <NavLink href="/sell" text="Sell" />
              <NavLink href="/scrap" text="Scrap Car" />
              <NavLink href="/finance" text="Finance" />
              <NavLink href="/videos" text="Videos" />
              <NavLink href="/about" text="About Us" />
              <Link href="/workshop" className="relative group py-2">
                <span className="text-custom-seasalt font-medium text-sm uppercase tracking-wider transition-colors duration-300 group-hover:text-custom-accent text-red-500 font-bold">
                  Workshop
                </span>
                <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-custom-accent transition-all duration-300 group-hover:w-full"></span>
              </Link>
              <Link
                href="/contact"
                className="px-6 py-2 bg-custom-accent text-custom-black font-bold rounded-full hover:bg-yellow-400 transition-all duration-300 shadow-lg shadow-yellow-500/20"
              >
                Contact Us
              </Link>
            </div>

            {/* Mobile Menu Button */}
            <div className="lg:hidden">
              <button
                onClick={showDrawer}
                className="text-white hover:text-custom-accent transition-colors p-2"
              >
                <IoMdMenu size={30} />
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
        <div className="flex flex-col h-full bg-custom-black text-white p-6">
          <div className="flex justify-between items-center mb-10">
            <Image src={Logo} alt="Logo" width={120} className="w-auto h-8" />
            <button onClick={onClose} className="text-white hover:text-custom-accent">
              <IoMdClose size={30} />
            </button>
          </div>
          
          <div className="flex flex-col space-y-6 items-center justify-center flex-grow">
            <MobileNavLink href="/" text="Home" />
            <MobileNavLink href="/buy" text="Buy Car" />
            <MobileNavLink href="/sell" text="Sell Car" />
            <MobileNavLink href="/scrap" text="Scrap Car" />
            <MobileNavLink href="/finance" text="Finance" />
            <MobileNavLink href="/videos" text="Videos" />
            <MobileNavLink href="/about" text="About Us" />
            <Link href="/workshop" onClick={onClose} className="text-2xl font-bold text-red-500 hover:text-custom-accent transition-colors duration-300">
              Workshop
            </Link>
            <MobileNavLink href="/contact" text="Contact Us" />
          </div>
          
          <div className="mt-auto text-center text-custom-platinum text-sm">
            © {new Date().getFullYear()} Poddar Motors
          </div>
        </div>
      </Drawer>
    </>
  )
}

export default Navbar
