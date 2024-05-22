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

const Footer = () => {
  return (
    <footer className="bg-custom-black text-custom-seasalt py-4 px-4">
      <div className="container mx-auto max-w-screen-xl flex flex-col lg:flex-row justify-between items-center">
        <div className="flex flex-col md:text-left !text-center !itenm-center mb-4 lg:mb-0">
          <Image src={logo} alt="Logo" className="w-[8rem]  mr-2" />
          <div className="pl-2 mt-2">
            <p className="text-sm sm:text-xs">
              Kokar Industrial Area, Kokar, Ranchi - 834001
            </p>
          </div>
        </div>
        <div className="flex flex-col lg:flex-row items-center">
          {/* <p className="mr-0 lg:mr-4 font-semibold mb-2 lg:mb-0">
            <a href="tel:8873002702">+91 8873002702</a>
          </p>
          <p className="mr-0 lg:mr-4 font-semibold ">
            <a href="mailto:aman@poddarmotors.com">aman@poddarmotors.com</a>
          </p> */}
          <div className="flex mr-0 my-2  lg:my-0 lg:mr-4 font-semibold">
            <a
              href="https://www.google.com/maps/dir//REAL+VALUE+ranchi+google+business+page/data=!4m6!4m5!1m1!4e2!1m2!1m1!1s0x39f4e17d184b0973:0xbc6d6be675cca0f0?sa=X&ved=1t:3061&ictx=111"
              target="_blank"
              rel="noopener noreferrer"
              className="mx-2"
            >
              <FiMapPin className="text-blue-500 text-2xl" />
            </a>
            <a
              href="mailto:poddarranchi@gmail.com"
              target="_blank"
              rel="noopener noreferrer"
              className="mx-2"
            >
              <SiGmail className="text-red-500 text-2xl" />
            </a>
            <a
              href="https://wa.me/+918873002702?text=Hi there looking forward to connecting with you."
              target="_blank"
              rel="noopener noreferrer"
              className="mx-2"
            >
              <FaWhatsapp className="text-green-500 text-2xl" />
            </a>
            <a
              href="https://www.facebook.com/RealValueRanchi/"
              target="_blank"
              rel="noopener noreferrer"
              className="mx-2"
            >
              <FaFacebook className="text-blue-500 text-2xl" />
            </a>
            <a
              href="https://www.instagram.com/pmplrealvalue/"
              target="_blank"
              rel="noopener noreferrer"
              className="mx-2"
            >
              <FaInstagram className="text-pink-500 text-2xl" />
            </a>
          </div>
        </div>
      </div>
      <div className="w-[100vw] text-sm mt-2">
        <div className="ml-[50%] md:w-max w-[80vw] text-center -translate-x-[50%] ">
          <MdCopyright className="inline text-lg" /> Copyright{' '}
          {new Date().getFullYear()} Poddar Motors Pvt. Ltd. All rights reserved
        </div>
      </div>
    </footer>
  )
}

export default Footer
