import React from 'react'
import BuyCars from './BuyCars'

export default async function Buy() {
  const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000';
  const data = await fetch(
    `${apiUrl}/api/listings/`,
    { cache: 'no-store' },
  ).then((res) => res.json())

  return <BuyCars allListings={data} />
}
