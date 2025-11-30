import React from 'react'
import Image from 'next/image'
import logo from '../../images/logo_new.png'
import { MdCopyright } from 'react-icons/md'
import {
  FaFacebook,
  FaInstagram,
  FaClock,
  FaCalendarAlt,
  FaWhatsapp,
} from 'react-icons/fa'
import { SiGmail } from 'react-icons/si'
import { FiMapPin, FiMessageSquare, FiArrowRight } from 'react-icons/fi'
import { useLanguage } from '../contexts/LanguageContext'

const Footer = () => {
  const { t } = useLanguage()
  return (
    <footer className="bg-custom-jet border-t border-white/10 text-custom-seasalt py-12 px-4">
      <div className="container mx-auto max-w-7xl">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
          {/* Logo and Address */}
          <div className="flex flex-col items-center md:items-start">
            <Image src={logo} alt="Poddar Motors Logo" className="w-32 mb-4" />
            <div className="text-center md:text-left">
              <p className="text-custom-platinum text-sm flex items-start gap-2">
                <FiMapPin className="text-custom-accent mt-1 flex-shrink-0" />
                <span>Kokar Industrial Area, Kokar, Ranchi - 834001</span>
              </p>
            </div>
          </div>

          {/* Quick Links */}
          <div className="text-center md:text-left">
            <h3 className="text-lg font-bold mb-4 text-white">Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <a href="/buy" className="text-custom-platinum hover:text-custom-accent transition-colors flex items-center justify-center md:justify-start gap-2 group">
                  <FiArrowRight className="text-xs group-hover:translate-x-1 transition-transform" />
                  {t('nav.buy')}
                </a>
              </li>
              <li>
                <a href="/sell" className="text-custom-platinum hover:text-custom-accent transition-colors flex items-center justify-center md:justify-start gap-2 group">
                  <FiArrowRight className="text-xs group-hover:translate-x-1 transition-transform" />
                  {t('nav.sell')}
                </a>
              </li>
              <li>
                <a href="/finance" className="text-custom-platinum hover:text-custom-accent transition-colors flex items-center justify-center md:justify-start gap-2 group">
                  <FiArrowRight className="text-xs group-hover:translate-x-1 transition-transform" />
                  {t('nav.finance')}
                </a>
              </li>
              <li>
                <a href="/blog" className="text-custom-platinum hover:text-custom-accent transition-colors flex items-center justify-center md:justify-start gap-2 group">
                  <FiArrowRight className="text-xs group-hover:translate-x-1 transition-transform" />
                  {t('nav.blog')}
                </a>
              </li>
              <li>
                <a href="/about" className="text-custom-platinum hover:text-custom-accent transition-colors flex items-center justify-center md:justify-start gap-2 group">
                  <FiArrowRight className="text-xs group-hover:translate-x-1 transition-transform" />
                  {t('nav.about')}
                </a>
              </li>
            </ul>
          </div>

          {/* Contact & Social */}
          <div className="text-center md:text-left">
            <h3 className="text-lg font-bold mb-4 text-white">Connect With Us</h3>
            <div className="flex justify-center md:justify-start gap-3 mb-4">
              <a
                href="https://www.google.com/maps/dir//REAL+VALUE+ranchi+google+business+page/data=!4m6!4m5!1m1!4e2!1m2!1m1!1s0x39f4e17d184b0973:0xbc6d6be675cca0f0?sa=X&ved=1t:3061&ictx=111"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-full bg-custom-black/50 flex items-center justify-center hover:bg-blue-500 transition-all duration-300 hover:scale-110 border border-white/10"
                aria-label="Google Maps"
              >
                <FiMapPin className="text-lg" />
              </a>
              <a
                href="mailto:poddarranchi@gmail.com"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-full bg-custom-black/50 flex items-center justify-center hover:bg-red-500 transition-all duration-300 hover:scale-110 border border-white/10"
                aria-label="Email"
              >
                <SiGmail className="text-lg" />
              </a>
              <a
                href="https://wa.me/+918873002702?text=Hi there looking forward to connecting with you."
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-full bg-custom-black/50 flex items-center justify-center hover:bg-green-500 transition-all duration-300 hover:scale-110 border border-white/10"
                aria-label="WhatsApp"
              >
                <FaWhatsapp className="text-lg" />
              </a>
              <a
                href="https://www.facebook.com/RealValueRanchi/"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-full bg-custom-black/50 flex items-center justify-center hover:bg-blue-600 transition-all duration-300 hover:scale-110 border border-white/10"
                aria-label="Facebook"
              >
                <FaFacebook className="text-lg" />
              </a>
              <a
                href="https://www.instagram.com/pmplrealvalue/"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-full bg-custom-black/50 flex items-center justify-center hover:bg-pink-500 transition-all duration-300 hover:scale-110 border border-white/10"
                aria-label="Instagram"
              >
                <FaInstagram className="text-lg" />
              </a>
            </div>
            <p className="text-custom-platinum text-sm">
              <a href="tel:8873002702" className="hover:text-custom-accent transition-colors">
                +91 8873002702
              </a>
            </p>
          </div>
        </div>

        {/* Copyright */}
        <div className="border-t border-white/10 pt-6 text-center">
          <p className="text-custom-platinum text-sm flex items-center justify-center gap-1">
            <MdCopyright className="text-base" />
            {new Date().getFullYear()} Poddar Motors Pvt. Ltd. All rights reserved
          </p>
        </div>
      </div>
    </footer>
  )
}

export default Footer
