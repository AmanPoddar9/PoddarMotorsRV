'use client'
import Features from '../Features'
import {
  FaCoins,
  FaClipboardCheck,
  FaMoneyCheckAlt,
  FaStar,
  FaStarHalf,
} from 'react-icons/fa'
import Image from 'next/image'
import CountUp from 'react-countup'

import why1 from '../../images/sell/why1.jpeg'
import why2 from '../../images/sell/why2.jpeg'
import why3 from '../../images/sell/why3.jpeg'
import about1 from '../../images/about1.jpeg'
import about2 from '../../images/about2.jpeg'
import about3 from '../../images/about3.jpeg'
import about4 from '../../images/about4.jpeg'
import founder from '../../images/founder.jpeg'
import dayImage from '../../images/about/day.jpg'
import twilightImage from '../../images/about/twilight.jpg'
import night from '../../images/about/night.jpg'
import cars from '../../images/about/cars.jpg'
import Head from 'next/head'

const AboutUs = () => {
  return (
    <main className="bg-custom-black pt-6 min-h-screen">
      <Head>
        <title>
          About Us - Real Value | Your Trusted Used Car Dealer in Ranchi
        </title>
        <meta
          name="description"
          content="Learn about Real Value, the leading used car dealership in Ranchi, dedicated to providing quality vehicles and exceptional service."
        />
        <meta
          name="keywords"
          content="used cars, Ranchi, quality vehicles, car dealership, Real Value"
        />
        <meta
          name="author"
          content="Aman Poddar, Milan Poddar, Parakh Poddar"
        />
        {/* Open Graph tags for social media */}
        <meta property="og:title" content="About Us - Real Value" />
        <meta
          property="og:description"
          content="Discover Real Value, your trusted used car dealer in Ranchi."
        />
        <meta
          property="og:image"
          content="https://www.instagram.com/p/DAXzCSMBzhq/?img_index=1"
        />{' '}
        {/* Add a relevant image URL */}
        <meta property="og:url" content="https://poddarmotors.com/about" />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              '@context': 'https://schema.org',
              '@type': 'Organization',
              name: 'Real Value',
              url: 'https://poddarmotors.com', // Update with your URL
              logo: 'URL to your logo', // Optional: add your logo URL
              description:
                'Leading used car dealership in Ranchi, dedicated to providing quality vehicles and exceptional service.',
              address: {
                '@type': 'PostalAddress',
                addressLocality: 'Ranchi',
                addressRegion: 'Jharkhand',
                postalCode: '834001', // Add your postal code
                streetAddress: 'Real Value Kokar, Ranchi', // Add your street address
              },
              contactPoint: {
                '@type': 'ContactPoint',
                telephone: '+91-8709119090', // Add your contact number
                contactType: 'Company director',
              },
            }),
          }}
        />
      </Head>
      <section className="container mx-auto max-w-screen-xl">
        <header className="container px-6 py-10 max-w-screen-xl mx-auto">
          <h1 className="text-4xl font-display font-bold text-left text-white">
            About <span className="text-custom-accent">Us</span>
          </h1>
          <h2 className="mt-4 text-xl text-custom-platinum">
            Be a part of our journey
          </h2>
        </header>
        <div className="px-6 py-6 text-justify bg-custom-black mb-8 text-2xl flex flex-col md:flex-row justify-evenly gap-x-16">
          <div>
            <p className="text-custom-platinum">
              At Real Value, we believe in transforming the used car market to
              provide our customers with the highest quality vehicles at the
              best prices. With three strategically located showrooms in Ranchi,
              we are here to serve you with dedication and integrity.
            </p>
            <p className="my-4 md:mb-0 mb-10 text-white">
              Google Ratings: 4.7
              <div>
                <FaStar className="text-[#ffd700] inline -translate-y-0.5 ml-1" />
                <FaStar className="text-[#ffd700] inline -translate-y-0.5 mx-0.5" />
                <FaStar className="text-[#ffd700] inline -translate-y-0.5 mx-0.5" />
                <FaStar className="text-[#ffd700] inline -translate-y-0.5 mx-0.5" />
                <FaStarHalf className="text-[#ffd700] inline -translate-y-0.5 mx-0.5" />
              </div>
            </p>
          </div>
          <Image
            src={dayImage}
            alt="Showroom during the day"
            className="mx-auto md:w-[40%] w-[100%] rounded-2xl border border-white/10"
          />
        </div>
      </section>

      <hr className="w-full h-px max-w-6xl mx-auto md:mb-16 my-8 bg-gradient-to-r from-transparent via-custom-accent to-transparent" />

      <section className="container max-w-screen-xl mx-auto py-7 px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-8">
          <div className="bg-custom-jet/50 border border-white/10 rounded-2xl shadow-lg p-5 text-center hover:border-custom-accent/30 transition-all">
            <div className="text-5xl font-bold mb-2 text-custom-accent">
              <CountUp start={0} end={30} duration={3} />+
            </div>
            <div className="text-lg font-semibold text-white">Years of Experience</div>
          </div>
          <div className="bg-custom-jet/50 border border-white/10 rounded-2xl shadow-lg p-5 text-center hover:border-custom-accent/30 transition-all">
            <div className="text-5xl font-bold mb-2 text-custom-accent">
              <CountUp start={0} end={10} duration={3} />+
            </div>
            <div className="text-lg font-semibold text-white">Finance Partners</div>
          </div>
          <div className="bg-custom-jet/50 border border-white/10 rounded-2xl shadow-lg p-5 text-center hover:border-custom-accent/30 transition-all">
            <div className="text-5xl font-bold mb-2 text-custom-accent">
              <CountUp start={0} end={40000} duration={3} />+
            </div>
            <div className="text-lg font-semibold text-white">Satisfied Customers</div>
          </div>
          <div className="bg-custom-jet/50 border border-white/10 rounded-2xl shadow-lg p-5 text-center hover:border-custom-accent/30 transition-all">
            <div className="text-5xl font-bold mb-2 text-custom-accent">
              <CountUp start={0} end={4} duration={2.5} />
            </div>
            <div className="text-lg font-semibold text-white">Showrooms in Ranchi</div>
          </div>
          <div className="bg-custom-jet/50 border border-white/10 rounded-2xl shadow-lg p-5 text-center hover:border-custom-accent/30 transition-all">
            <div style={{ fontSize: '1.4rem' }} className="font-semibold py-2 text-white">
              Post Sales Servicing
            </div>
          </div>
        </div>
      </section>

      <hr className="w-full h-px max-w-6xl mx-auto mt-16 bg-gradient-to-r from-transparent via-custom-accent to-transparent" />

      <section className="container mx-auto max-w-screen-xl flex flex-col md:flex-row justify-center py-16 gap-x-16 px-6">
        <article className="mb-8 md:mb-0">
          <header>
            <h2 className="text-4xl font-display font-bold mb-4 text-white">Our <span className="text-custom-accent">Journey</span></h2>
          </header>
          <p className="text-xl text-custom-platinum">
            At Real Value, a leading used car dealership in Ranchi, we believe
            in transforming the used car market to provide our customers with
            the highest quality vehicles at the best prices.
          </p>
          <header className="mt-8">
            <h2 className="text-4xl font-display font-bold mb-8 text-white">Our <span className="text-custom-accent">Mission</span></h2>
          </header>
          <p className="text-xl text-custom-platinum">
            Our mission is simple: to organize the used cars market in Ranchi
            and offer the best cars to our customers at the most competitive
            prices. Check out our stock{' '}
            <a href="/buy" className="text-custom-accent hover:underline">
              services
            </a>{' '}
            to learn more.
          </p>
        </article>
        <Image
          src={twilightImage}
          alt="Real value showroom in Kokar"
          className="mx-auto w-[100%] h-[100%] md:w-[40%] md:h-[70%] my-auto rounded-2xl border border-white/10"
          objectFit="contain"
          objectPosition="center"
        />
      </section>

      <hr className="w-full h-px max-w-6xl mx-auto bg-gradient-to-r from-transparent via-custom-accent to-transparent" />

      <section className="container mx-auto max-w-screen-xl flex flex-col md:flex-row justify-center py-16 items-center gap-x-16 px-6">
        <article>
          <div className="md:mb-8 mb-4">
            <header>
              <h2 className="text-4xl font-display font-bold mb-4 text-white">Our <span className="text-custom-accent">Values</span></h2>
            </header>
            <p className="text-xl text-custom-platinum">
              At Real Value, we hold honesty, customer service, and quality in
              the highest regard. These values guide everything we do, from the
              cars we select to the way we interact with our customers. We
              believe in creating lasting relationships based on trust and
              transparency.
            </p>
          </div>
          <div className="mb-8">
            <header>
              <h2 className="text-4xl font-display font-bold mb-4 text-white">Our <span className="text-custom-accent">Services</span></h2>
            </header>
            <ul className="text-xl text-custom-platinum">
              <li>
                <b className="text-white">Buying:</b> Find your next car from our extensive inventory
                of quality used vehicles{' '}
                <a href="/buy" className="text-custom-accent hover:underline">
                  click here
                </a>{' '}
                .
              </li>
              <li className="mt-4">
                <b className="text-white">Selling:</b> Sell your car to us with confidence, knowing
                you're getting a fair deal.{' '}
                <a href="/sell" className="text-custom-accent hover:underline">
                  click here
                </a>{' '}
              </li>
              <li className="mt-4">
                <b className="text-white">Financing:</b> Take advantage of our financing options to
                make your purchase more affordable.{' '}
                <a href="/finance" className="text-custom-accent hover:underline">
                  finance
                </a>{' '}
              </li>
            </ul>
          </div>
        </article>
        <Image
          src={cars}
          alt="Showroom with cars"
          className="mx-auto w-[100%] md:w-[40%] h-[70%] rounded-2xl border border-white/10"
        />
      </section>

      <hr className="w-full h-px max-w-6xl mx-auto bg-gradient-to-r from-transparent via-custom-accent to-transparent md:mb-16 mb-0" />

      <section className="container mx-auto max-w-screen-xl px-6">
        <div className="p-6 mb-8">
          <header>
            <h2 className="text-4xl font-display font-bold mb-8 md:mt-0 mt-10 text-white">
              Why Choose <span className="text-custom-accent">Real Value?</span>
            </h2>
          </header>
          <ul className="text-xl text-justify text-custom-platinum">
            <li>
              <b className="text-white">Experience and Trust:</b> With 30 years in the business and
              over 20,000 satisfied customers, we have the experience and trust
              you can rely on.
            </li>
            <li className="mt-4">
              <b className="text-white">Comprehensive Service:</b> From buying and selling to
              financing, we provide a full suite of services under one roof.
            </li>
            <li className="mt-4">
              <b className="text-white">Quality Assurance:</b> Every car we sell goes through a
              rigorous inspection to ensure it meets our high standards of
              quality.
            </li>
          </ul>
        </div>
      </section>

      <hr className="w-full h-px max-w-6xl mx-auto bg-gradient-to-r from-transparent via-custom-accent to-transparent" />

      <section className="container mx-auto max-w-screen-xl flex flex-col md:flex-row justify-center py-16 items-center gap-x-16 px-4">
        <article>
          <header>
            <h2 className="text-4xl font-display font-bold mb-4 text-white">Meet Our <span className="text-custom-accent">Founder</span></h2>
          </header>
          <p className="text-xl mb-6 md:mb-0 text-justify text-custom-platinum">
            Milan Poddar, our CEO and Founder, has been the driving force behind
            Real Value. His vision and dedication have shaped our company into
            what it is today—a leader in the used car market in Ranchi.
          </p>
          <header className="mt-8">
            <h2 className="text-4xl font-display font-bold mb-4 text-white">Our <span className="text-custom-accent">Future</span></h2>
          </header>
          <p className="text-xl text-justify text-custom-platinum">
            Our goal is to become the largest used car dealer in East India. We
            are constantly expanding our inventory, improving our services, and
            exploring new ways to better serve our customers. Thank you for
            choosing Real Value. We look forward to helping you find the perfect
            car!
          </p>
        </article>
        <Image
          src={night}
          alt="Showroom at night"
          className="mx-auto w-[100%] md:w-[45%] h-[60%] rounded-2xl border border-white/10"
        />
      </section>
    </main>
  )
}

export default AboutUs
