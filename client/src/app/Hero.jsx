'use client'
import React, { useEffect, useState } from 'react'
import carImage2 from '../images/about4.jpeg'
import Image from 'next/image'
import ButtonCloud from './components/ButtonCloud'

import audi from '@/images/brands/audi.png'
import bmw from '@/images/brands/bmw.png'
import fiat from '@/images/brands/fiat.png'
import ford from '@/images/brands/ford.png'
import honda from '@/images/brands/honda.png'
import hyundai from '@/images/brands/hyundai.png'
import jeep from '@/images/brands/jeep.png'
import kia from '@/images/brands/kia.png'
import land_rover from '@/images/brands/land_rover.png'
import mahindra from '@/images/brands/mahindra.png'
import mercedes from '@/images/brands/mercedes.png'
import mg from '@/images/brands/mg.png'
import nissan from '@/images/brands/nissan.png'
import renault from '@/images/brands/renault.png'
import skoda from '@/images/brands/skoda.png'
import suzuki from '@/images/brands/suzuki.png'
import tata from '@/images/brands/tata.png'
import toyota from '@/images/brands/toyota.png'
import volkswagen from '@/images/brands/volkswagen.png'
import volvo from '@/images/brands/volvo.png'

import axios from 'axios'
import { TypewriterEffectSmooth } from '@/app/components/ui/typewriter-effect'
import { FaSearch } from 'react-icons/fa'

const imageStyles = {
  width: '2.5rem',
  height: '2.5rem',
  display: 'inline',
}

const brandsMapping = {
  Audi: audi,
  BMW: bmw,
  Fiat: fiat,
  Ford: ford,
  Honda: honda,
  Hyundai: hyundai,
  Jeep: jeep,
  KIA: kia,
  Mahindra: mahindra,
  Mercedes: mercedes,
  'MG Motor': mg,
  Nissan: nissan,
  Renault: renault,
  Skoda: skoda,
  Tata: tata,
  Toyota: toyota,
  Maruti: suzuki,
  'Maruti Suzuki': suzuki,
}

const segments = [
  {
    label: 'SUV',
    key: '1',
  },
  {
    label: 'Sedan',
    key: '2',
  },
  {
    label: 'Hatchback',
    key: '3',
  },
  {
    label: 'MUV',
    key: '3',
  },
]

const budgets = [
  {
    label: 'Under 4 Lakh',
    key: '1',
    range: '0-400000',
  },
  {
    label: '4-8 Lakh',
    key: '2',
    range: '400000-800000',
  },
  {
    label: 'Above 8 Lakh',
    key: '3',
    range: '800000',
  },
]

const Hero = () => {
  const [loading, setLoading] = useState(true)
  const [types, setTypes] = useState([])
  const [brands, setBrands] = useState([])
  const url = 'https://poddar-motors-rv-hkxu.vercel.app/'

  const fetchAllTypes = async () => {
    try {
      setLoading(true)
      const response = await axios.get(url + 'api/listings/types')
      if (response.data) {
        const arr = response.data.map((type, index) => {
          return {
            label: type,
            key: `${index + 1}`,
          }
        })
        setTypes(arr)
        setLoading(false)
      }
    } catch (e) {
      console.log(e.message)
    }
  }

  const fetchAllBrands = async () => {
    try {
      const response = await axios.get(url + 'api/listings/brands')
      if (response.data) {
        const arr = response.data.map((b, index) => {
          return {
            label: (
              <div>
                {/* Added alt text for better SEO */}
                <Image
                  style={imageStyles}
                  src={brandsMapping[b]}
                  alt={`${b} car brand logo`}
                />{' '}
                {b}
              </div>
            ),
            key: `${index + 1}`,
          }
        })
        setBrands(arr)
        setLoading(false)
      }
    } catch (e) {
      console.log(e.message)
    }
  }

  useEffect(() => {
    localStorage.removeItem('filters')
    fetchAllBrands()
    fetchAllTypes()
  }, [])

  return (
    <section className="relative bg-custom-black mx-auto overflow-hidden">
      {/* Background Image with reduced opacity */}
      <div
        className="absolute inset-0 bg-cover bg-center opacity-30" // Set the opacity for the background
        style={{ backgroundImage: `url(${carImage2.src})` }}
      />

      <div className="grid max-w-screen-xl pb-10 pt-9 mx-auto lg:gap-8 xl:gap-0 lg:py-16 lg:grid-cols-12 lg:px-6 px-4 relative z-10">
        <div className="mr-auto place-self-center lg:col-span-7">
          <h1 className="max-w-2xl">
            <TypewriterEffectSmooth
              words={'Buy Smart With Real Value'
                .split(' ')
                .map((word, index) => {
                  if (index <= 2) {
                    return {
                      text: word,
                      className:
                        'mb-4 text-3xl font-extrabold tracking-tight leading-none md:text-5xl xl:text-5xl text-custom-seasalt',
                    }
                  }
                  return {
                    text: word,
                    className:
                      'mb-4 text-3xl font-extrabold tracking-tight leading-none md:text-5xl xl:text-5xl !text-custom-yellow',
                  }
                })}
            />
          </h1>
          <p className="max-w-2xl mb-6 font-light lg:mb-8 text-sm md:text-lg lg:text-xl text-custom-platinum">
            {/* Added a link to financing options */}
            Your one-stop-shop for buying, selling, and financing cars.
            <a href="/  " className="text-custom-yellow hover:underline">
              {' '}
              Learn more about our financing options.
            </a>
            We offer the best prices and the best deals on all types of cars.
          </p>
          <a
            href="/buy"
            className="inline-flex items-center justify-center px-6 py-4 text-lg font-medium text-center border rounded-lg focus:ring-4 focus:ring-custom-black text-custom-black border-custom-black bg-custom-platinum mr-5 hover:!bg-custom-yellow" // Increased padding and font size
          >
            Buy Car
          </a>
          <a
            href="/sell"
            className="inline-flex items-center justify-center px-6 py-4 text-lg font-medium border text-center rounded-lg hover:!text-custom-yellow text-custom-seasalt focus:ring-custom-yellow !border-custom-yellow" // Increased padding and font size
            style={{
              textDecoration: 'underline',
              textDecorationColor: 'transparent',
            }}
          >
            Sell Car
            <span
              className="ml-2"
              style={{ textDecoration: 'none', fontSize: '1.2rem' }}
            >
              &#8594; {/* Unicode arrow character pointing right */}
            </span>
          </a>
        </div>
        {/* <div className="mt-10 lg:mt-0 lg:col-span-5 lg:flex">
          <Image src={carImage2} alt="Second hand cars in Ranchi" priority />
        </div> */}
      </div>

      <div className="max-w-screen-xl pt-10 mx-auto pb-16 lg:pb-24 lg:pt-0 lg:px-6 px-4">
        <div className="mr-auto place-self-center lg:col-span-7">
          <p className="max-w-2xl mb-12 font-light text-custom-platinum md:text-lg lg:mb-0 lg:text-xl ">
            Or get started directly by...
          </p>
          <div className="button-container -mt-4">
            <span className="button-wrapper mr-3">
              <ButtonCloud options={brands} label="Brand" />
            </span>
            <span className="button-wrapper mr-3">
              <ButtonCloud options={types} label="Segment" />
            </span>
            <span className="button-wrapper mr-3">
              <ButtonCloud options={budgets} label="Budget" />
            </span>
            <span className="button-wrapper mr-3 md:mt-9">
              <a
                href="/buy"
                className="inline-flex items-center 
                justify-center px-6 py-4 text-lg
                translate-y-[0.2rem]
                 font-medium text-center border rounded-lg 
                 text-custom-seasalt hover:text-custom-jet focus:ring-4  border-custom-jet hover:!bg-custom-yellow focus:ring-custom-jet md:mt-10" // Increased padding and font size
              >
                View All Cars
              </a>
            </span>
          </div>
        </div>
      </div>

      <script type="application/ld+json">
        {`{
          "@context": "https://schema.org",
          "@type": "WebSite",
          "name": "Poddar Motors",
          "url": "https://poddarmotors.com",
          "potentialAction": {
            "@type": "SearchAction",
            "target": "https://poddarmotors.com/?s={search_term_string}",
            "query-input": "required name=search_term_string"
          }
        }`}
      </script>

      <script type="application/ld+json">
        {`{
          "@context": "https://schema.org",
          "@type": "Product",
          "name": "Cars",
          "brand": ${JSON.stringify([
            'Audi',
            'BMW',
            'Fiat',
            'Ford',
            'Honda',
            'Hyundai',
            'Jeep',
            'KIA',
            'Mahindra',
            'Mercedes',
            'MG Motor',
            'Nissan',
            'Renault',
            'Skoda',
            'Tata',
            'Toyota',
            'Maruti',
            'Maruti Suzuki',
            'Volkswagen',
            'Volvo',
          ])}
        }`}
      </script>
    </section>
  )
}

export default Hero
