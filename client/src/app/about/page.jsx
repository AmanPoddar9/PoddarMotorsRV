'use client'
import Features from '../Features'
import { FaCoins, FaClipboardCheck, FaMoneyCheckAlt } from 'react-icons/fa'
import { FaStar, FaStarHalf } from 'react-icons/fa'
import why1 from '@/images/sell/why1.jpeg'
import why2 from '@/images/sell/why2.jpeg'
import why3 from '@/images/sell/why3.jpeg'
import Image from 'next/image'
import about1 from '@/images/about1.jpeg'
import about2 from '@/images/about2.jpeg'
import about3 from '@/images/about3.jpeg'
import about4 from '@/images/about4.jpeg'

import founder from '@/images/founder.jpeg'

import dayImage from '@/images/about/day.jpg'
import twilightImage from '@/images/about/twilight.jpg'
import night from '@/images/about/night.jpg'
import cars from '@/images/about/cars.jpg'

import CountUp from 'react-countup'

const AboutUs = () => {
  return (
    <div className="bg-custom-seasalt pt-6">
      <div className="container mx-auto max-w-screen-xl">
        <div className="container px-6 py-10 max-w-screen-xl mx-auto">
          <h1 className="text-4xl font-bold text-left">About Us</h1>
          <p className="mt-4 text-xl text-custom-jet">
            Who we are and what we do
          </p>
        </div>
        <div className="px-6 py-6 text-justify  bg-custom-seasalt mb-8 text-2xl flex flex-col md:flex-row justify-evenly gap-x-16">
          <div>
            <p className="text-gray-700 ">
              At Real Value, we believe in transforming the used car market to
              provide our customers with the highest quality vehicles at the
              best prices. With three strategically located showrooms in Ranchi,
              we are here to serve you with dedication and integrity.
            </p>
            <p className="my-4 md:mb-0 mb-10">
              Google Ratings: 4.7
              <div>
                <FaStar className="text-[#ffd700] inline -translate-y-0.5 ml-1" />
                <FaStar className="text-[#ffd700] inline -translate-y-0.5 mx-0.5" />
                <FaStar className="text-[#ffd700] inline -translate-y-0.5 mx-0.5" />
                <FaStar className="text-[#ffd700] inline -translate-y-0.5 mx-0.5" />
                <FaStarHalf className="text-[#ffd700] inline -translate-y-0.5 mx-0.5" />
              </div>
            </p>
          </div>
          <Image
            src={dayImage}
            alt="showroom"
            className="mx-auto md:w-[40%] w-[100%]"
          />
        </div>
      </div>

      <div
        className="w-full h-px max-w-6xl mx-auto md:mb-16 my-8"
        style={{
          backgroundImage:
            'linear-gradient(90deg, rgba(204, 204, 0, 0) 1.46%, rgba(204, 204, 0, 0.6) 40.83%, rgba(204, 204, 0, 0.3) 65.57%, rgba(204, 204, 0, 0) 107.92%)',
        }}
      ></div>

      <div className="container max-w-screen-xl mx-auto py-7">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-8">
          <div className="bg-custom-seasalt rounded-md shadow-lg p-5 text-center">
            <div className="text-5xl font-bold mb-2">
              <CountUp start={0} end={30} duration={3} />+
            </div>
            <div className="text-lg font-semibold">Years of Experience</div>
          </div>
          <div className="bg-custom-seasalt rounded-md shadow-lg p-5 text-center">
            <div className="text-5xl font-bold mb-2">
              <CountUp start={0} end={10} duration={3} />+
            </div>
            <div className="text-lg font-semibold">Finance Partners</div>
          </div>
          <div className="bg-custom-seasalt rounded-md shadow-lg p-5 text-center">
            <div className="text-5xl font-bold mb-2">
              <CountUp start={0} end={40000} duration={3} />+
            </div>
            <div className="text-lg font-semibold">Satisfied Customers</div>
          </div>
          <div className="bg-custom-seasalt rounded-md shadow-lg p-5 text-center">
            <div className="text-5xl font-bold mb-2">
              <CountUp start={0} end={4} duration={2.5} />
            </div>
            <div className="text-lg font-semibold">Showrooms in Ranchi</div>
          </div>
          <div className="bg-custom-seasalt rounded-md shadow-lg p-5 text-center">
            <div style={{ fontSize: '1.4rem' }} className="font-semibold py-2">
              Post Sales Servicing
            </div>
          </div>
        </div>
      </div>

      <div
        className="w-full h-px max-w-6xl mx-auto mt-16"
        style={{
          backgroundImage:
            'linear-gradient(90deg, rgba(204, 204, 0, 0) 1.46%, rgba(204, 204, 0, 0.6) 40.83%, rgba(204, 204, 0, 0.3) 65.57%, rgba(204, 204, 0, 0) 107.92%)',
        }}
      ></div>

      <div className="container mx-auto max-w-screen-xl flex flex-col md:flex-row justify-center py-16 gap-x-16 px-6">
        <div className="mb-8 md:mb-0">
          <div className="bg-custom-seasalt my-8 text-justify">
            <div className="text-4xl font-bold mb-4">Our Journey</div>
            <div className="text-xl">
              At Real Value, we believe in transforming the used car market to
              provide our customers with the highest quality vehicles at the
              best prices. With three strategically located showrooms in Ranchi,
              we are here to serve you with dedication and integrity.
            </div>
          </div>
          <div className=" bg-custom-seasalt mb-8">
            <div className="text-4xl font-bold mb-8">Our Mission</div>
            <div className="text-xl text-justify">
              Our mission is simple: to organise the used cars market in Ranchi
              and offer the best cars to our customers at the most competitive
              prices. We strive to ensure that every customer finds their
              perfect vehicle and enjoys a seamless buying or selling
              experience.
            </div>
          </div>
        </div>
        <Image
          src={twilightImage}
          alt="showroom"
          className="mx-auto w-[100%] h-[100%] md:w-[40%] md:h-[70%] my-auto"
          objectFit="contain"
          objectPosition="center"
        />
      </div>

      <div
        className="w-full h-px max-w-6xl mx-auto"
        style={{
          backgroundImage:
            'linear-gradient(90deg, rgba(204, 204, 0, 0) 1.46%, rgba(204, 204, 0, 0.6) 40.83%, rgba(204, 204, 0, 0.3) 65.57%, rgba(204, 204, 0, 0) 107.92%)',
        }}
      ></div>

      <div className="container mx-auto max-w-screen-xl flex flex-col md:flex-row justify-center py-16 items-center gap-x-16 px-6">
        <div className="md:mb-0 mb-10">
          <div className="container mx-auto max-w-screen-xl">
            <div className=" bg-custom-seasalt mb-8">
              <div className="text-4xl font-bold mb-8">Our Values</div>
              <div className="text-xl text-justify">
                At Real Value, we hold honesty, customer service, and quality in
                the highest regard. These values guide everything we do, from
                the cars we select to the way we interact with our customers. We
                believe in creating lasting relationships based on trust and
                transparency.
              </div>
            </div>
          </div>

          <div className=" bg-custom-seasalt mb-8">
            <div className="text-4xl font-bold mb-4">Our Services</div>
            <div className="text-xl text-justify">
              We offer a comprehensive range of services to meet all your
              automotive needs:
              <br />
              <br />
              <ul>
                <li>
                  <b>Buying</b>: Find your next car from our extensive inventory
                  of quality used vehicles.
                </li>
                <li>
                  <b>Selling</b>: Sell your car to us with confidence, knowing
                  you're getting a fair deal.
                </li>
                <li>
                  <b>Financing</b>: Take advantage of our financing options to
                  make your purchase more affordable.
                </li>
              </ul>
            </div>
          </div>
        </div>
        <Image
          src={cars}
          alt="showroom"
          className="mx-auto w-[100%] md:w-[40%] h-[70%]"
        />
      </div>

      <div
        className="w-full h-px max-w-6xl mx-auto md:mb-16 mb-0"
        style={{
          backgroundImage:
            'linear-gradient(90deg, rgba(204, 204, 0, 0) 1.46%, rgba(204, 204, 0, 0.6) 40.83%, rgba(204, 204, 0, 0.3) 65.57%, rgba(204, 204, 0, 0) 107.92%)',
        }}
      ></div>

      <div className="container mx-auto max-w-screen-xl">
        <div className="p-6 bg-custom-seasalt mb-8">
          <div className="text-4xl font-bold mb-8 md:mt-0 mt-10">
            Why Choose Real Value?
          </div>
          <div className="text-xl text-justify">
            <ul>
              <li>
                <b>Experience and Trust:</b> With 30 years in the business and
                over 20,000 satisfied customers, we have the experience and
                trust you can rely on.
              </li>
              <br />
              <li>
                <b>Comprehensive Service:</b> From buying and selling to
                financing, we provide a full suite of services under one roof.
              </li>
              <br />
              <li>
                <b>Quality Assurance:</b> Every car we sell goes through a
                rigorous inspection to ensure it meets our high standards of
                quality.
              </li>
            </ul>
          </div>
        </div>
      </div>

      <div
        className="w-full h-px max-w-6xl mx-auto"
        style={{
          backgroundImage:
            'linear-gradient(90deg, rgba(204, 204, 0, 0) 1.46%, rgba(204, 204, 0, 0.6) 40.83%, rgba(204, 204, 0, 0.3) 65.57%, rgba(204, 204, 0, 0) 107.92%)',
        }}
      ></div>

      <div className="container mx-auto max-w-screen-xl flex flex-col md:flex-row justify-center py-16 items-center gap-x-16 px-4">
        <div>
          <div className="bg-custom-seasalt md:mb-8 mb-4">
            <div className="text-4xl font-bold mb-4">Meet Our Founder</div>
            <div className="flex items-center flex-col md:flex-row justify-between">
              <div className="align-top text-xl mb-6 md:mb-0 text-justify">
                Milan Poddar, our CEO and Founder, has been the driving force
                behind Real Value. His vision and dedication have shaped our
                company into what it is today—a leader in the used car market in
                Ranchi.
              </div>
            </div>
          </div>

          <div className="md:py-4 bg-custom-seasalt mb-10 md:mb-0">
            <div className="text-4xl font-bold mb-4">Our Future</div>
            <div className="text-xl text-justify">
              Our goal is to become the largest used car dealer in East India.
              We are constantly expanding our inventory, improving our services,
              and exploring new ways to better serve our customers.
              <br />
              Thank you for choosing Real Value. We look forward to helping you
              find the perfect car!
            </div>
          </div>
        </div>
        <Image
          src={night}
          alt="showroom"
          className="mx-auto w-[100%] md:w-[45%] h-[60%]"
        />
      </div>
    </div>
  )
}

export default AboutUs
