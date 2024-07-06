import React from 'react'

const Highlights = () => {
  return (
    <div className="py-16 bg-custom-platinum">
      <div className="mx-auto max-w-7xl sm:px-6 lg:px-6 px-4">
        <h2 className="text-4xl font-bold text-custom-black mb-5 pt-7">
          Why Choose Us?
        </h2>

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
              src="https://www.youtube.com/shorts/JcqdIqcY-Jw"
              title="YouTube video player"
              frameBorder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
              referrerPolicy="strict-origin-when-cross-origin"
              allowFullScreen
            ></iframe>
          </div>
          <div className="mb-5">
            <iframe
              width="100%"
              height="250"
              src="https://www.youtube.com/shorts/zKMXCnvbOTo"
              title="YouTube video player"
              frameBorder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
              referrerPolicy="strict-origin-when-cross-origin"
              allowFullScreen
            ></iframe>
          </div>
          <div className="mb-5">
            <iframe
              width="100%"
              height="250"
              src="https://www.youtube.com/embed/bpGkFT4VUko?enablejsapi=1"
              title="YouTube video player"
              frameBorder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
              referrerPolicy="strict-origin-when-cross-origin"
              allowFullScreen
            ></iframe>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Highlights
