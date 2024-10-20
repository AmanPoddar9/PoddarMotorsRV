import React from 'react'

const Highlights = () => {
  return (
    <section className="py-16 bg-custom-platinum">
      <div className="mx-auto max-w-7xl sm:px-6 lg:px-6 px-4">
        <header>
          <h2 className="text-4xl font-bold text-custom-black mb-5 pt-7">
            Learn More from our YouTube Channel
          </h2>
          <p className="text-lg text-gray-600 mb-8">
            Explore our YouTube channel where we share expert insights on{' '}
            <strong>used cars</strong>,<strong> car maintenance</strong>,{' '}
            <strong>auto financing</strong>, and much more. Stay updated with
            our latest tips and tutorials.
          </p>
        </header>

        <div
          className="gap-2 md:gap-12 items-center py-10"
          style={{
            maxWidth: '1200px',
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
          }}
        >
          <div className="mb-5">
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
            ></iframe>
            <p className="text-sm mt-2">
              Get top tips on buying used cars from our experts in this video.
            </p>
          </div>

          <div className="mb-5">
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
            ></iframe>
            <p className="text-sm mt-2">
              Learn essential car maintenance tips to keep your vehicle in top
              shape.
            </p>
          </div>

          <div className="mb-5">
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
            ></iframe>
            <p className="text-sm mt-2">
              Understand the ins and outs of financing your car purchase in this
              video.
            </p>
          </div>

          <div className="mb-5">
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
            ></iframe>
            <p className="text-sm mt-2">
              Watch our expert reviews of the latest car models in the market.
            </p>
          </div>

          <div className="mb-5">
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
            ></iframe>
            <p className="text-sm mt-2">
              Gain valuable insights into the used car market trends and
              opportunities.
            </p>
          </div>

          <div className="mb-5">
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
            ></iframe>
            <p className="text-sm mt-2">
              Learn how to care for your car and maintain long-term performance.
            </p>
          </div>
        </div>

        {/* Structured Data */}
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
      </div>
    </section>
  )
}

export default Highlights
