import React from 'react'
import SellPageClient from './SellPageClient'
import { generateServiceSchema, generateBreadcrumbSchema } from '../utils/schema'

export const metadata = {
  title: 'Sell Your Car in Ranchi | Best Price & Instant Payment | Poddar Motors',
  description: 'Sell your used car in Ranchi at the best market price. Get instant payment, free RC transfer, and doorstep inspection. Poddar Motors ensures a hassle-free selling experience.',
  keywords: 'sell used car Ranchi, sell car online Jharkhand, best price for old car, sell second hand car Ranchi, car valuation Ranchi, sell car for cash, instant car payment',
  alternates: {
    canonical: 'https://www.poddarmotors.com/sell',
  },
  openGraph: {
    title: 'Sell Your Car in Ranchi | Best Price Guarantee',
    description: 'Get the best market price for your used car. Instant payment and free RC transfer. Sell your car to Poddar Motors today.',
    url: 'https://www.poddarmotors.com/sell',
    siteName: 'Poddar Motors Real Value',
    type: 'website',
    locale: 'en_IN',
    images: [
      {
        url: 'https://www.poddarmotors.com/sell-og.jpg',
        width: 1200,
        height: 630,
        alt: 'Sell Your Car - Poddar Motors',
      }
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Sell Your Car in Ranchi | Instant Payment',
    description: 'Get the best price for your old car. Free RC transfer and doorstep inspection.',
    images: ['https://www.poddarmotors.com/sell-og.jpg'],
  },
}

export default function SellPage() {
  const serviceSchema = generateServiceSchema();
  const breadcrumbSchema = generateBreadcrumbSchema([
    { name: 'Home', url: '/' },
    { name: 'Sell Your Car', url: '/sell' },
  ]);

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(serviceSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />
      <SellPageClient />
    </>
  )
}
