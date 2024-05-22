import React from 'react'
import BuyCars from './BuyCars'

export default async function Buy() {
  const data = await fetch(
    `https://real-value-server.vercel.app/api/listings/`,
    { cache: 'no-store' },
  ).then((res) => res.json())

  return <BuyCars allListings={data} />
}
