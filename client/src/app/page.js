// import Image from 'next/image';
// import Image from 'next/image';
import LandingHero from './components/LandingHero'
import dynamic from 'next/dynamic'

// Code splitting: Load non-critical components dynamically
const FeaturedCars = dynamic(() => import('./FeaturedCars'), {
  loading: () => <div className="h-96 bg-custom-jet animate-pulse rounded-lg" />
})
const Highlights = dynamic(() => import('./Highlights'))
const Faq = dynamic(() => import('./components/Faq'))
const ButtonRows = dynamic(() => import('./components/ButtonRows'))
const DealsOfTheDay = dynamic(() => import('./components/DealsOfTheDay'))
const SocialProof = dynamic(() => import('./components/SocialProof'))

import Contact from './components/Contact'
import { homeFAQ } from './data/homeFAQs'
import API_URL from './config/api'


export const metadata = {
  title: 'Home',
  description:
    'Discover the best deals on used cars with Poddar Motors Real Value. Browse our featured cars and enjoy top-notch services.',
  keywords: [
    'used cars',
    'best car deals',
    'car sales',
    'car services',
    'Poddar Motors Real Value',
    'Ranchi',
    'Jharkhand',
  ],
}

export default async function Home() {
  let data
  try {
    data = await fetch(
      `${API_URL}/api/listings/featured`,
      { next: { revalidate: 300 } }, // Cache for 5 minutes
    ).then((res) => res.json())
  } catch (e) {
    console.error('[HomePage]', 'Failed to fetch featured listings:', e.message)
    data = []
  }

  return (
    <div style={{ overflow: 'hidden !important' }}>

      <LandingHero />
      <FeaturedCars featuredCarData={data} />
      <DealsOfTheDay />
      <ButtonRows />
      <Highlights />
      <Faq FAQs={homeFAQ} title="FAQs while buying a used car" />
      {/* <Contact /> */}
      <SocialProof />
    </div>
  )
}
