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
import Head from 'next/head'

export const metadata = {
  title: 'Poddar Motors Real Value home page',
  description:
    'Second hand car dealership in Ranchi Jharkhand, Used car finance, used cars for sale, Maruti suzuki, Mahindra , Hyundai',
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
      <Head>
        <title>Home | Poddar Motors Real Value</title>
        <meta
          name="description"
          content="Discover the best deals on used cars with Poddar Motors Real Value. Browse our featured cars and enjoy top-notch services."
        />
        <meta
          name="keywords"
          content="used cars, best car deals, car sales, car services, Poddar Motors Real Value"
        />
        <meta property="og:title" content="Home | Poddar Motors Real Value" />
        <meta
          property="og:description"
          content="Discover the best deals on used cars with Poddar Motors Real Value. Browse our featured cars and enjoy top-notch services."
        />
        <meta property="og:image" content="/path-to-your-og-image.jpg" />
        <meta
          property="og:url"
          content="https://poddar-motors-rv-hkxu.vercel.app"
        />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Home | Poddar Motors Real Value" />
        <meta
          name="twitter:description"
          content="Discover the best deals on used cars with Poddar Motors Real Value."
        />
        <meta name="twitter:image" content="/path-to-your-twitter-image.jpg" />
        <link rel="canonical" href="https://poddar-motors-rv-hkxu.vercel.app" />
      </Head>
      <Hero />
      <ButtonRows />
      <FeaturedCars featuredCarData={data} />
      <Features />
      <Offers />
      <Highlights />
      <Testimonials />
      <Faq FAQs={homeFAQ} title="FAQs while buying a used car" />
      {/* <Contact /> */}
    </div>
  )
}
