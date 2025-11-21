import Head from 'next/head'
import React from 'react'

const Highlights = () => {
  return (
    <>
      {/* SEO-optimized head section */}
      <Head>
        <title>Learn More from our YouTube Channel | Poddar Motors</title>
        <meta
          name="description"
          content="Explore our YouTube channel for expert insights on used cars, maintenance, and auto financing. Learn tips and tricks to make informed decisions."
        />
        <meta property="og:type" content="video" />
        <meta
          property="og:title"
          content="Learn More from our YouTube Channel"
        />
        <meta
          property="og:description"
          content="Expert insights on used cars, car maintenance, auto financing, and more."
        />
        <meta
          property="og:image"
          content="https://img.youtube.com/vi/JcqdIqcY-Jw/maxresdefault.jpg"
        />
        <meta property="og:url" content="https://www.poddarmotors.com" />
        <meta name="robots" content="index, follow" />
      </Head>

      {/* Video Section */}
      <section className="py-20 bg-custom-black relative overflow-hidden">
        {/* Background gradient */}
        <div className="absolute inset-0 bg-gradient-to-b from-custom-black via-custom-jet/20 to-custom-black pointer-events-none"></div>
        
        <div className="mx-auto max-w-7xl sm:px-6 lg:px-6 px-4 relative z-10">
          <header className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-display font-bold text-white mb-4">
              Learn From Our <span className="text-custom-accent">YouTube Channel</span>
            </h2>
            <p className="text-lg text-custom-platinum max-w-3xl mx-auto">
              Explore our YouTube channel where we share expert insights on{' '}
              <strong className="text-white">used cars</strong>, <strong className="text-white">car maintenance</strong>,{' '}
              <strong className="text-white">auto financing</strong>, and much more. Stay updated with
              our latest tips and tutorials.
            </p>
          </header>

          {/* Video Grid */}
          <div
            className="gap-6 md:gap-8 items-start"
            style={{
              maxWidth: '1200px',
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
            }}
          >
            <div className="bg-custom-jet/50 rounded-2xl overflow-hidden border border-white/10 hover:border-custom-accent/30 transition-all duration-300 group">
              <iframe
                width="100%"
                height="250"
                src="https://www.youtube.com/embed/JcqdIqcY-Jw?enablejsapi=1"
                title="Used Cars Buying Tips"
                loading="lazy"
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                referrerPolicy="strict-origin-when-cross-origin"
                allowFullScreen
                className="w-full"
              ></iframe>
              <div className="p-4">
                <p className="text-custom-platinum text-sm">
                  Get top tips on buying used cars from our experts in this video.
                </p>
              </div>
            </div>

            <div className="bg-custom-jet/50 rounded-2xl overflow-hidden border border-white/10 hover:border-custom-accent/30 transition-all duration-300 group">
              <iframe
                width="100%"
                height="250"
                src="https://www.youtube.com/embed/SoUEdK_yIqI?enablejsapi=1"
                title="Car Maintenance Tips"
                loading="lazy"
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                referrerPolicy="strict-origin-when-cross-origin"
                allowFullScreen
                className="w-full"
              ></iframe>
              <div className="p-4">
                <p className="text-custom-platinum text-sm">
                  Learn essential car maintenance tips to keep your vehicle in top
                  shape.
                </p>
              </div>
            </div>

            <div className="bg-custom-jet/50 rounded-2xl overflow-hidden border border-white/10 hover:border-custom-accent/30 transition-all duration-300 group">
              <iframe
                width="100%"
                height="250"
                src="https://www.youtube.com/embed/bpGkFT4VUko?enablejsapi=1"
                title="Auto Financing Explained"
                loading="lazy"
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                referrerPolicy="strict-origin-when-cross-origin"
                allowFullScreen
                className="w-full"
              ></iframe>
              <div className="p-4">
                <p className="text-custom-platinum text-sm">
                  Understand the ins and outs of financing your car purchase in
                  this video.
                </p>
              </div>
            </div>

            <div className="bg-custom-jet/50 rounded-2xl overflow-hidden border border-white/10 hover:border-custom-accent/30 transition-all duration-300 group">
              <iframe
                width="100%"
                height="250"
                src="https://www.youtube.com/embed/3kIJQBe0UPs?si=qUDDIZRAdlCb09G1"
                title="Car Reviews - Latest Models"
                loading="lazy"
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                referrerPolicy="strict-origin-when-cross-origin"
                allowFullScreen
                className="w-full"
              ></iframe>
              <div className="p-4">
                <p className="text-custom-platinum text-sm">
                  Watch our expert reviews of the latest car models in the market.
                </p>
              </div>
            </div>

            <div className="bg-custom-jet/50 rounded-2xl overflow-hidden border border-white/10 hover:border-custom-accent/30 transition-all duration-300 group">
              <iframe
                width="100%"
                height="250"
                src="https://www.youtube.com/embed/3itLjzY3EV4?si=C8zXOEkEOXoUh8y6"
                title="Used Cars Market Insights"
                loading="lazy"
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                referrerPolicy="strict-origin-when-cross-origin"
                allowFullScreen
                className="w-full"
              ></iframe>
              <div className="p-4">
                <p className="text-custom-platinum text-sm">
                  Gain valuable insights into the used car market trends and
                  opportunities.
                </p>
              </div>
            </div>

            <div className="bg-custom-jet/50 rounded-2xl overflow-hidden border border-white/10 hover:border-custom-accent/30 transition-all duration-300 group">
              <iframe
                width="100%"
                height="250"
                src="https://www.youtube.com/embed/UKZyllAkv_w?si=6B8qDMdEzwJiFiPM"
                title="Car Care Tips for Long-Term Performance"
                loading="lazy"
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                referrerPolicy="strict-origin-when-cross-origin"
                allowFullScreen
                className="w-full"
              ></iframe>
              <div className="p-4">
                <p className="text-custom-platinum text-sm">
                  Learn how to care for your car and maintain long-term
                  performance.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Structured Data for SEO */}
        <script type="application/ld+json">
          {`{
            "@context": "https://schema.org",
            "@type": "VideoObject",
            "name": "Learn More from our YouTube Channel",
            "description": "Explore our YouTube channel for expert insights on used cars, maintenance, and auto financing.",
            "thumbnailUrl": "https://img.youtube.com/vi/JcqdIqcY-Jw/maxresdefault.jpg",
            "uploadDate": "2023-10-10",
            "duration": "PT2M30S",
            "contentUrl": "https://www.youtube.com/embed/JcqdIqcY-Jw",
            "embedUrl": "https://www.youtube.com/embed/JcqdIqcY-Jw"
          }`}
        </script>
      </section>
    </>
  )
}

export default Highlights
