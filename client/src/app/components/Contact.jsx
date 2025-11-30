import React from 'react'
import { FaFacebook, FaInstagram, FaClock, FaCalendarAlt } from 'react-icons/fa'
import { FiMapPin, FiMessageSquare, FiArrowRight } from 'react-icons/fi'
// import { Link } from 'react-router-dom';
import contact from '../../images/contact.jpg'

import { FaWhatsapp } from 'react-icons/fa'
import Image from 'next/image'

import { useLanguage } from '../contexts/LanguageContext'

const Contact = () => {
  const { t } = useLanguage()
  return (
    <div className="flex flex-col lg:flex-row">
      <div className="px-4 py-8 sm:px-6 lg:px-8 lg:ml-16 ml-4 mx-auto max-w-screen-xl">
        <h2 className="text-4xl font-bold text-gray-900 mb-5 mt-12">
          {t('contact.title')}
        </h2>
        <div>
          <div className="flex justify-start items-center space-x-4">
            <div className="flex items-center space-x-2">
              <FaFacebook className="text-blue-500 text-2xl" />
              <a
                href="https://www.facebook.com/RealValueRanchi/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-900 hover:underline"
              >
                Facebook
              </a>
            </div>
            <div className="flex items-center space-x-2">
              <FaInstagram className="text-pink-500 text-2xl" />
              <a
                href="https://www.instagram.com/pmplrealvalue/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-900 hover:underline"
              >
                Instagram
              </a>
            </div>
          </div>
          <p className="text-gray-700 mt-6">
            <FaCalendarAlt className="inline text-lg -translate-y-0.5" /> 7 Days
            a Week
            <FaClock
              className="inline ml-2 text-lg mr-0.5 ml-4"
              style={{ transform: 'translateY(-0.05rem)' }}
            />{' '}
            {t('contact.hours')}: 9:30am - 7pm
          </p>
        </div>

        <div className="mt-8 flex space-x-4">
          <a 
            href="https://www.google.com/maps/dir//REAL+VALUE+ranchi+google+business+page/data=!4m6!4m5!1m1!4e2!1m2!1m1!1s0x39f4e17d184b0973:0xbc6d6be675cca0f0?sa=X&ved=1t:3061&ictx=111"
            onClick={() => {
              if (typeof window !== 'undefined' && window.fbq) {
                window.fbq('track', 'Contact', { content_name: 'Get Directions' })
              }
            }}
          >
            <button className="flex items-center bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50">
              <FiMapPin className="text-xl mr-2" />
              Get Directions
            </button>
          </a>
          <a 
            href="https://wa.me/+918873002702?text=Hi there looking forward to connecting with you."
            onClick={() => {
              if (typeof window !== 'undefined' && window.fbq) {
                window.fbq('track', 'Contact', { content_name: 'WhatsApp Chat' })
              }
            }}
          >
            <button className="flex items-center bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-opacity-50">
              <FaWhatsapp className="text-xl mr-2" />
              Chat with us
            </button>
          </a>
        </div>
        <div className="mt-8">
          <a
            href="/contact"
            className="inline-flex items-center justify-center px-5 py-3 text-base font-medium text-center text-gray-900 border rounded-lg focus:ring-4   border-gray-700 bg-slate-100 focus:ring-gray-800 mr-5 hover:!bg-yellow-500"
          >
            More Details <FiArrowRight className="ml-1" />
          </a>
        </div>
      </div>
      <div className="mx-auto py-8 lg:pt-12 lg:pb-0">
        <Image
          src={contactImage}
          alt="contact image"
          className="rounded-md mx-auto"
        />
      </div>
    </div>
  )
}

export default Contact
