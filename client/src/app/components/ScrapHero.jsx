'use client'

import Image from 'next/image'
import scrapHeroImage from '@/images/scrap_hero.png'

const ScrapHero = ({ onGetQuoteClick }) => {
  return (
    <section className="relative bg-custom-black mx-auto overflow-hidden">
      {/* Background Image with reduced opacity */}
      <div
        className="absolute inset-0 bg-cover bg-center opacity-20"
        style={{ backgroundImage: `url(${scrapHeroImage.src})` }}
      />

      <div className="grid max-w-screen-xl pb-10 pt-16 mx-auto lg:gap-8 xl:gap-0 lg:py-20 lg:grid-cols-12 lg:px-6 px-4 relative z-10">
        <div className="mr-auto place-self-center lg:col-span-7">
          <h1 className="max-w-2xl mb-4 text-4xl font-extrabold tracking-tight leading-none md:text-5xl xl:text-6xl text-custom-seasalt">
            Turn Your Old Car Into{' '}
            <span className="text-custom-yellow">Cash</span>
          </h1>
          <h2 className="max-w-2xl mb-6 text-2xl font-bold md:text-3xl text-custom-yellow">
            Eco-Friendly Car Scrapping in Jharkhand
          </h2>
          <p className="max-w-2xl mb-6 font-light lg:mb-8 text-sm md:text-lg lg:text-xl text-custom-platinum">
            Get the best value for your old, damaged, or end-of-life vehicle.
            Free pickup, instant payment, and hassle-free paperwork.
          </p>
          <div className="flex flex-col sm:flex-row gap-4">
            <button
              onClick={onGetQuoteClick}
              className="inline-flex items-center justify-center px-8 py-4 text-lg font-bold text-center border-2 rounded-lg focus:ring-4 focus:ring-custom-yellow text-custom-black border-custom-yellow bg-custom-yellow hover:bg-custom-black hover:text-custom-yellow transition duration-300"
            >
              Get Free Quote
            </button>
            <a
              href="tel:+918709119090"
              className="inline-flex items-center justify-center px-8 py-4 text-lg font-bold border-2 text-center rounded-lg text-custom-seasalt hover:text-custom-yellow border-custom-seasalt hover:border-custom-yellow transition duration-300"
            >
              📞 Call Now
            </a>
          </div>
          <div className="mt-8 flex flex-wrap gap-6 text-custom-platinum">
            <div className="flex items-center gap-2">
              <span className="text-custom-yellow text-2xl">✓</span>
              <span className="text-sm md:text-base">Free Pickup</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-custom-yellow text-2xl">✓</span>
              <span className="text-sm md:text-base">Instant Payment</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-custom-yellow text-2xl">✓</span>
              <span className="text-sm md:text-base">Eco-Friendly</span>
            </div>
          </div>
        </div>
        <div className="hidden lg:mt-0 lg:col-span-5 lg:flex items-center justify-center">
          <Image
            src={scrapHeroImage}
            alt="Car scrapping facility in Jharkhand"
            priority
            className="rounded-lg shadow-2xl"
          />
        </div>
      </div>
    </section>
  )
}

export default ScrapHero
