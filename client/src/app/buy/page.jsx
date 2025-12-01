import React from 'react'
import BuyCars from './BuyCars'

export const metadata = {
  title: 'Buy Used Cars in Ranchi | Certified Pre-Owned Vehicles',
  description: 'Browse our wide selection of quality used cars in Ranchi. All vehicles are certified, inspected, and come with warranty. Best prices on second-hand cars with easy financing options.',
  keywords: 'buy used cars Ranchi, second hand cars, pre-owned cars Ranchi, certified used cars, car dealership Ranchi',
  openGraph: {
    title: 'Buy Used Cars in Ranchi | Poddar Motors',
    description: 'Quality certified used cars with warranty. Best prices and easy financing.',
    type: 'website',
    url: 'https://www.poddarmotors.com/buy',
  },
  alternates: {
    canonical: 'https://www.poddarmotors.com/buy',
  },
}


import API_URL from '../config/api';

export default async function Buy() {
  const data = await fetch(
    `${API_URL}/api/listings/`,
    { cache: 'no-store' },
  ).then((res) => res.json())

  return <BuyCars allListings={data} />
}
