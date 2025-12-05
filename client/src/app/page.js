// import Image from 'next/image';
// import Image from 'next/image';
import LandingHero from './components/LandingHero'
import FeaturedCars from './FeaturedCars'
import Highlights from './Highlights'
import Faq from './components/Faq'
import Contact from './components/Contact'
import { homeFAQ } from './data/homeFAQs'
import ButtonRows from './components/ButtonRows'
import DealsOfTheDay from './components/DealsOfTheDay'
import SocialProof from './components/SocialProof'
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
