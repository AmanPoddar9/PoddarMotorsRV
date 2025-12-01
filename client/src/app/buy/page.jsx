import React from 'react'
import BuyCars from './BuyCars'

export const metadata = {
  title: 'Buy Used Cars in Ranchi | Certified Pre-Owned Vehicles',
  description: 'Browse our wide selection of quality used cars in Ranchi. All vehicles are certified, inspected, and come with warranty. Best prices on second-hand cars with easy financing options.',
  keywords: 'buy used cars Ranchi, second hand cars Ranchi, pre-owned cars Ranchi, certified used cars Jharkhand, car dealership Ranchi, Maruti Suzuki used cars, Hyundai used cars, SUV Ranchi, sedan Ranchi, hatchback Ranchi, car finance Ranchi, cheap used cars',
  authors: [{ name: 'Poddar Motors Real Value' }],
  openGraph: {
    title: 'Buy Quality Used Cars in Ranchi | Poddar Motors',
    description: 'Quality certified used cars with warranty. Best prices and easy financing. Browse our extensive collection of pre-owned vehicles in Ranchi, Jharkhand.',
    url: 'https://www.poddarmotors.com/buy',
    siteName: 'Poddar Motors Real Value',
    type: 'website',
    locale: 'en_IN',
    images: [
      {
        url: 'https://www.poddarmotors.com/buy-og.jpg',
        width: 1200,
        height: 630,
        alt: 'Buy Used Cars in Ranchi - Poddar Motors',
      }
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Buy Quality Used Cars in Ranchi | Poddar Motors',
    description: 'Quality certified used cars with warranty. Best prices and easy financing.',
    images: ['https://www.poddarmotors.com/buy-og.jpg'],
    creator: '@PoddarMotors',
    site: '@PoddarMotors',
  },
  alternates: {
    canonical: 'https://www.poddarmotors.com/buy',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
}


import API_URL from '../config/api';
import { generateItemListSchema } from '../utils/schema';

export default async function Buy() {
  const data = await fetch(
    `${API_URL}/api/listings/`,
    { cache: 'no-store' },
  ).then((res) => res.json())

  // Generate ItemList schema for SEO
  const itemListSchema = generateItemListSchema(data || []);

  return (
    <>
      {/* ItemList Structured Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(itemListSchema) }}
      />
      <BuyCars allListings={data} />
    </>
  );
}
