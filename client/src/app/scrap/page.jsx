'use client'

import { useState } from 'react'
import ScrapHero from '../components/ScrapHero'
import ScrapBenefits from '../components/ScrapBenefits'
import ScrapProcess from '../components/ScrapProcess'
import ScrapCalculator from '../components/ScrapCalculator'
import EnvironmentalImpact from '../components/EnvironmentalImpact'
import ScrapFormModal from '../components/ScrapFormModal'
import Faq from '../components/Faq'
import { scrapFAQData } from '../data/scrapFAQs'
import Head from 'next/head'

const ScrapPage = () => {
  const [showForm, setShowForm] = useState(false)
  const [showModal, setShowModal] = useState(false)

  const handleGetQuoteClick = () => {
    setShowForm(true)
  }

  return (
    <>
      <Head>
        <title>
          Car Scrapping in Jharkhand | Eco-Friendly Vehicle Recycling | Poddar
          Motors Real Value
        </title>
        <meta
          name="description"
          content="Scrap your old car in Ranchi, Bokaro, Jamshedpur. Get instant cash, free pickup, and hassle-free paperwork. Eco-friendly car scrapping facility in Jharkhand."
        />
        <meta
          name="keywords"
          content="car scrapping, vehicle recycling, scrap car Ranchi, scrap car Jharkhand, end-of-life vehicle, car recycling, eco-friendly scrapping, instant cash for old car, free car pickup, vehicle deregistration, scrap value calculator"
        />
        <meta
          property="og:title"
          content="Car Scrapping in Jharkhand | Get Instant Cash for Your Old Car"
        />
        <meta
          property="og:description"
          content="Environmentally responsible car scrapping with free pickup and instant payment. Best scrap value guaranteed in Jharkhand."
        />
        <meta
          property="og:url"
          content="https://poddar-motors-rv-hkxu.vercel.app/scrap"
        />
        <meta name="twitter:card" content="summary_large_image" />
        <meta
          name="twitter:title"
          content="Car Scrapping in Jharkhand | Poddar Motors"
        />
        <meta
          name="twitter:description"
          content="Scrap your old car with free pickup and instant payment in Jharkhand."
        />
        <link
          rel="canonical"
          href="https://poddar-motors-rv-hkxu.vercel.app/scrap"
        />
      </Head>

      <div className="overflow-x-hidden">
        <ScrapHero onGetQuoteClick={handleGetQuoteClick} />
        <ScrapBenefits />
        <ScrapProcess />
        <ScrapCalculator onGetAccurateQuote={handleGetQuoteClick} />
        <EnvironmentalImpact />
        <Faq FAQs={scrapFAQData} title="Car Scrapping FAQs" />

        <ScrapFormModal
          showForm={showForm}
          setShowForm={setShowForm}
          setShowModal={setShowModal}
        />

        {/* Backdrop for modal */}
        {(showForm || showModal) && (
          <div className="fixed inset-0 text-lg bg-custom-black bg-opacity-50 z-10"></div>
        )}

        {/* Success Modal */}
        {showModal && (
          <div className="fixed top-1/4 left-1/2 transform text-black -translate-x-1/2 bg-custom-seasalt z-20 p-8 rounded text-center">
            <h4 className="font-semibold text-xl mb-2">
              Thank You for Your Request!
            </h4>
            <p className="text-sm">
              Our scrap expert will contact you within 24 hours with a
              valuation.
            </p>
          </div>
        )}
      </div>
    </>
  )
}

export default ScrapPage
