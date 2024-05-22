import React from 'react'
import {
  FaAward,
  FaHandshake,
  FaRecycle,
  FaCar,
  FaRupeeSign,
} from 'react-icons/fa'
import { BiHappyBeaming } from 'react-icons/bi'

const Features = () => {
  return (
    <section className="bg-custom-black mx-auto">
      <div className="pb-14 pt-20 px-4 mx-auto max-w-screen-xl lg:px-6">
        <div className="max-w-screen-md mb-16 lg:mb-16">
          <h2 className="mb-4 text-4xl tracking-tight font-extrabold text-custom-seasalt">
            Our Highlights
          </h2>
        </div>
        <div className="md:space-y-8 md:grid md:grid-cols-2 lg:grid-cols-3 md:gap-12 md:text-left text-center items-center">
          <div
            style={{ marginTop: '32px' }}
            className="flex flex-col md:block justify-center items-center pb-10"
          >
            <div className="flex justify-center items-center mb-4 w-10 h-10 rounded-full bg-primary-100 lg:h-12 lg:w-12">
              <FaAward  className='text-custom-seasalt' size={50} />
            </div>
            <h3 className="mb-2 text-lg font-bold text-custom-seasalt">
              Quality Selection
            </h3>
          </div>
          <div className="flex flex-col md:block justify-center items-center pb-10">
            <div className="flex justify-center items-center mb-4 w-10 h-10 rounded-full bg-primary-100 lg:h-12 lg:w-12">
              <FaRupeeSign  className='text-custom-seasalt' size={50} />
            </div>
            <h3 className="mb-2 text-lg font-bold text-custom-seasalt">
              Competitive Pricing
            </h3>
          </div>
          <div className="flex flex-col md:block justify-center items-center pb-10">
            <div className="flex justify-center items-center mb-4 w-10 h-10 rounded-full bg-primary-100 lg:h-12 lg:w-12">
              <FaCar  className='text-custom-seasalt' size={50} />
            </div>
            <h3 className="mb-2 text-lg font-bold text-custom-seasalt">
              Certified Pre-owned Program
            </h3>
          </div>
          <div className="flex flex-col md:block justify-center items-center pb-10">
            <div className="flex justify-center items-center mb-4 w-10 h-10 rounded-full bg-primary-100 lg:h-12 lg:w-12">
              <FaHandshake  className='text-custom-seasalt' size={50} />
            </div>
            <h3 className="mb-2 text-lg font-bold text-custom-seasalt">
              Easy Financing Options
            </h3>
          </div>
          <div className="flex flex-col md:block justify-center items-center pb-10">
            <div className="flex justify-center items-center mb-4 w-10 h-10 rounded-full bg-primary-100 lg:h-12 lg:w-12">
              <BiHappyBeaming  className='text-custom-seasalt' size={50} />
            </div>
            <h3 className="mb-2 text-lg font-bold text-custom-seasalt">
              Customer Satisfaction
            </h3>
          </div>
          <div className="flex flex-col md:block justify-center items-center pb-10">
            <div className="flex justify-center items-center mb-4 w-10 h-10 rounded-full bg-primary-100 lg:h-12 lg:w-12 ">
              <FaRecycle  className='text-custom-seasalt' size={50} />
            </div>
            <h3 className="mb-2 text-lg font-bold text-custom-seasalt">
              Refurbished to the best
            </h3>
          </div>
        </div>
      </div>
    </section>
  )
}

export default Features
