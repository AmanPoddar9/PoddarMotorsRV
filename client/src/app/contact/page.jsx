import React from 'react'
import { FaWhatsapp, FaUsers, FaInstagram, FaFacebook, FaPhoneAlt, FaEnvelope } from 'react-icons/fa'
import { TbDeviceLandlinePhone } from 'react-icons/tb'

import Link from 'next/link'

const ContactUsPage = () => {
  return (
    <section className="bg-custom-black">
      <div className="container px-4 py-8 lg:px-6 max-w-screen-xl mx-auto">
        <div>
          <h1 className="mt-2 text-3xl font-semibold  md:text-4xl text-custom-seasalt">
            Get in touch
          </h1>

          <p className="mt-3 text-lg  text-custom-platinum">
            We would love to hear from you.
          </p>
        </div>

        <div
          style={{
            gridTemplateColumns: 'repeat(auto-fit, minmax(100px, 1fr))',
          }}
          className="lg:grid flex gap-x-0 flex-col mt-12"
        >
          <div className="grid grid-cols-1 gap-12 sm:grid-cols-2 lg:grid-cols-1">
            <div>
              <span className="inline-block p-3 text-custom-yellow rounded-full bg-custom-jet">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth="1.5"
                  stroke="currentColor"
                  className="w-5 h-5"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75"
                  />
                </svg>
              </span>

              <h2 className="mt-4 text-xl font-medium  text-custom-seasalt">Email</h2>
              <p className="mt-2 text-base  text-custom-platinum">
                Drop a mail for any queries.
              </p>
              <div className="space-y-2">
                <p className="mt-2 text-base text-custom-seasalt hover:text-custom-yellow">
                 <a href='mailto:poddarranchi@gmail.com'>poddarranchi@gmail.com</a> 
                </p>
                <p className="mt-2 text-base text-custom-seasalt hover:text-custom-yellow">
                <a href='mailto:info@poddarmotors.com'>info@poddarmotors.com</a>
                </p>
                <p className="mt-2 text-base text-custom-seasalt hover:text-custom-yellow">
                <a href='mailto:contact@poddarmotors.com'>contact@poddarmotors.com</a>
                </p>
              </div>
            </div>

            <div>
              <span className="inline-block p-3 text-custom-yellow rounded-full bg-custom-jet">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth="1.5"
                  stroke="currentColor"
                  className="w-5 h-5"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M2.25 6.75c0 8.284 6.716 15 15 15h2.25a2.25 2.25 0 002.25-2.25v-1.372c0-.516-.351-.966-.852-1.091l-4.423-1.106c-.44-.11-.902.055-1.173.417l-.97 1.293c-.282.376-.769.542-1.21.38a12.035 12.035 0 01-7.143-7.143c-.162-.441.004-.928.38-1.21l1.293-.97c.363-.271.527-.734.417-1.173L6.963 3.102a1.125 1.125 0 00-1.091-.852H4.5A2.25 2.25 0 002.25 4.5v2.25z"
                  />
                </svg>
              </span>
              <h2 className="mt-4 text-xl font-medium  text-custom-seasalt">Phone</h2>
              <p className="mt-2 text-base  text-custom-platinum">
                Everyday from 9:30am to 7pm.
              </p>
              <div className="space-y-2">
                <div className="flex items-center space-x-4">
                  <div className="bg-blue-100 p-3 rounded-full">
                    <FaPhoneAlt className="text-blue-600 text-xl" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-500 font-medium">Phone</p>
                    <a className="text-custom-seasalt hover:text-custom-yellow" href={`tel:8709119090`}>8709119090</a>
                  </div>
                </div>

                <div className="flex items-center space-x-4">
                  <div className="bg-blue-100 p-3 rounded-full">
                    <FaEnvelope className="text-blue-600 text-xl" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-500 font-medium">Email</p>
                    <p className="text-custom-seasalt font-semibold">poddarranchi@gmail.com</p>
                  </div>
                </div>
              </div>

              <div className="mt-8 pt-8 border-t border-gray-200">
                <p className="text-sm text-gray-500 font-medium mb-4">Connect with us</p>
                <div className="flex space-x-4">
                  <a
                    href="https://www.facebook.com/RealValueRanchi"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center text-gray-600 hover:bg-blue-600 hover:text-white transition-all duration-300"
                  >
                    <FaFacebook className="text-xl" />
                  </a>
                  <a
                    href="https://www.instagram.com/pmplrealvalue/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center text-gray-600 hover:bg-pink-600 hover:text-white transition-all duration-300"
                  >
                    <FaInstagram className="text-xl" />
                  </a>
                </div>
              </div>
            </div>
          </div>

          <div className="md:mt-0 mt-12">
            <span className="inline-block p-3 text-custom-yellow rounded-full bg-custom-jet">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth="1.5"
                stroke="currentColor"
                className="w-5 h-5"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z"
                />
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z"
                />
              </svg>
            </span>

            <h2 className="mt-4 text-xl font-medium  text-custom-seasalt">Showrooms</h2>
            <p className="mt-2 text-base  text-custom-platinum">
              Browse our exquisite collection of cars.
            </p>
            <div className="space-y-2">
              <p className="mt-2 mb-4 text-base text-custom-seasalt hover:text-custom-yellow">
                1. (Poddar Automart) Real Value, Kokar Industrial Area, Kokar,
                Ranchi - 834001 Landmark: Electricity Sub Station
              </p>
              <p className="mt-2 mb-4 text-base text-custom-seasalt hover:text-custom-yellow">
                2. (Poddar Motors) Poddar Motors Pvt. Ltd. , Kokar Industrial
                Area, Kokar , Ranchi -834001 Landmark: Beside moreish bread
              </p>
              <p className="mt-2 mb-4 text-base text-custom-seasalt hover:text-custom-yellow">
                3. (Tirupati Engicon) Real Value, Kokar Chowk, Kokar, Ranchi -
                834001 Landmark: Kokar Chowk - Kantatoli road
              </p>
              <p className="mt-2 mb-4 text-base text-custom-seasalt hover:text-custom-yellow">
                4. Real Value, Hazaribagh Road ,Mesra , Ranchi - 834001
                Landmark: Near BIT Mesra campus
              </p>
            </div>
            <div className="overflow-hidden rounded-lg h-80 lg:h-50 mt-12">
              <iframe
                width="100%"
                height="100%"
                title="map"
                style={{ border: 0, marginLeft: 'auto', marginRight: 'auto' }}
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3662.466933990794!2d85.3504478093273!3d23.371319578842947!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x39f4e17d184b0973%3A0xbc6d6be675cca0f0!2sREAL%20VALUE!5e0!3m2!1sen!2sin!4v1714636151144!5m2!1sen!2sin"
              ></iframe>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default ContactUsPage
