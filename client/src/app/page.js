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
      <ButtonRows />
      <FeaturedCars featuredCarData={data} />
      <Features />
      <Offers />
      <Highlights />
      <Testimonials />
      <Faq FAQs={homeFAQ} title="Buy related" />
      {/* <Contact /> */}
    </div>
  )
}
