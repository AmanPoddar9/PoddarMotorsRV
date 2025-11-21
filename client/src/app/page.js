// import Image from 'next/image';
import Hero from './Hero'
import FeaturedCars from './FeaturedCars'
import Highlights from './Highlights'
import Offers from './components/Offers'
import Testimonials from './components/Testimonials'
import Features from './Features'
import Faq from './components/Faq'
import Contact from './components/Contact'
import { homeFAQ } from './data/homeFAQs'
import ButtonRows from './components/ButtonRows'


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
      `https://poddar-motors-rv-hkxu.vercel.app/api/listings/featured`,
      { cache: 'no-store' },
    ).then((res) => res.json())
  } catch (e) {
    console.log(e.message)
    data = []
  }

  return (
    <div style={{ overflow: 'hidden !important' }}>

      <Hero />
      <FeaturedCars featuredCarData={data} />
      <ButtonRows />
      <Features />
      <Offers />
      <Highlights />
      <Testimonials />
      <Faq FAQs={homeFAQ} title="FAQs while buying a used car" />
      {/* <Contact /> */}
    </div>
  )
}
