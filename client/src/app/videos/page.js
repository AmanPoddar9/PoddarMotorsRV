import Head from 'next/head'

const Videos = () => {
  const videoData = [
    {
      id: 'JcqdIqcY-Jw', // Replace with actual video IDs
      title: 'Sell Your Car in 30 minutes',
      description: 'Sell your car in 30 minutes in Ranchi and Jharkhand.',
    },
    {
      id: 'nt6Zsosgv-A', // Replace with actual video ID
      title: 'Second hand sedans',
      description: 'Second hand Sedans for sale in Ranchi.',
    },
    {
      id: 'dNMn37Ct0OE', // Replace with actual video ID
      title:
        'Customer से कार खरीदने से पहले ऐसे होता है, 242 points quality Check!',
      description:
        'जब आप Real Value से अपनी कार खरीदते हैं, तो आपको सिर्फ एक प्री-ओन्ड कार नहीं मिलती, बल्कि एक सख्त गुणवत्ता जांच से गुजर चुकी कार मिलती है। हम हर कार पर 242 पॉइंट्स क्वालिटी चेक करते हैं ताकि आप पूरी शांति और भरोसे के साथ ड्राइव कर सकें। इंजन से लेकर ब्रेक्स, सस्पेंशन से लेकर इंटीरियर तक, हर छोटे-बड़े पहलू की जाँच की जाती है ताकि आपकी कार हर तरह से Perfect हो।',
    },
    {
      id: 'kOxavW5GrfA', // Replace with actual video ID
      title:
        'Second-Hand Mahindra Bolero for Sale in Ranchi | Best Prices & Financing Options',
      description:
        'Second hand Mahindra Bolero Stock available for sale at real value ranchi jharkhand. Best dealership in jharkhand for used pre owned cars.🚗Why Choose Real Value? Leading and oldest Second-hand car dealer in Jharkhand 0% Down payment Finance Facility (https://www.poddarmotors.com/finance) 🚘More than 100+ Used cars used cars at one place. From Budget Friendly to Luxury second hand used cars available as per requirement and budget. Visit-- https://www.poddarmotors.com/buy ',
    },
    {
      id: '6SlTQNeRes', // Replace with actual video ID
      title:
        'Maruti Suzuki Celerio at Real Value! Explore Affordable Second-Hand Cars in Jharkhand',
      description:
        'Maruti Suzuki Celerio Stock available for sale at Poddar Motors Real Value Ranchi, Best destination for second hand preowned used cars in Jharkhand! Buy Smart Sell Fast!.',
    },
    {
      id: 'jEgCH2bK16M', // Replace with actual video ID
      title:
        'Maruti Suzuki Swift @ 1.5 Lacs ONLY !! | Used Cars in Ranchi Jharkhand | Real Value Ranchi',
      description: 'Maruti Suzuki swift for sale',
    },
    // Add more video objects as needed
  ]

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <Head>
        <title>Videos | Poddar Motors Real Value</title>
        <meta
          name="description"
          content="Watch our YouTube videos about our used car stock and updates"
        />
        <meta
          name="keywords"
          content="car videos, used cars in Ranchi, Poddar Motors Real value, second hand bolero, second hand scorpio"
        />
      </Head>
      <h1 className="text-4xl font-bold mb-6 text-center text-gray-900">
        YouTube Section
      </h1>
      <p className="mb-8 text-center text-gray-700">
        Welcome to our video gallery! Here, you can watch our latest car
        reviews, test drives, and much more. Stay updated with the latest in the
        automotive world and get insights into your favorite cars.
      </p>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {videoData.map((video) => (
          <div
            key={video.id}
            className="bg-white shadow-md rounded-lg overflow-hidden"
          >
            <iframe
              width="100%"
              height="215"
              src={`https://www.youtube.com/embed/${video.id}`}
              title={video.title}
              frameBorder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            ></iframe>
            <div className="p-4">
              <h2 className="text-lg font-semibold">{video.title}</h2>
              <p className="text-gray-700">{video.description}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Embed Instagram Reel */}
      <div className="mt-12">
        <h2 className="text-2xl font-bold mb-4 text-center text-gray-900">
          Featured Instagram Reel
        </h2>
        <blockquote
          className="instagram-media"
          data-instgrm-captioned
          data-instgrm-permalink="https://www.instagram.com/reel/C_niAI_tvZQ/?utm_source=ig_embed&amp;utm_campaign=loading"
          data-instgrm-version="14"
        >
          <div style={{ padding: '16px' }}>
            <a
              href="https://www.instagram.com/reel/C_niAI_tvZQ/?utm_source=ig_embed&amp;utm_campaign=loading"
              style={{
                background: '#FFFFFF',
                lineHeight: '0',
                padding: '0',
                textAlign: 'center',
                textDecoration: 'none',
                width: '100%',
              }}
              target="_blank"
              rel="noreferrer"
            >
              <div className="border border-gray-200 rounded-lg p-4">
                <div
                  style={{
                    display: 'flex',
                    flexDirection: 'row',
                    alignItems: 'center',
                  }}
                >
                  <div className="bg-gray-200 rounded-full flex-grow-0 h-10 w-10 mr-2"></div>
                  <div className="flex flex-col flex-grow-1 justify-center">
                    <div className="bg-gray-200 rounded h-3 mb-1 w-24"></div>
                    <div className="bg-gray-200 rounded h-3 w-16"></div>
                  </div>
                </div>
                <div style={{ padding: '19% 0' }}></div>
                <div className="flex justify-center items-center mb-3">
                  <svg
                    width="50px"
                    height="50px"
                    viewBox="0 0 60 60"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <g
                      stroke="none"
                      strokeWidth="1"
                      fill="none"
                      fillRule="evenodd"
                    >
                      <g
                        transform="translate(-511.000000, -20.000000)"
                        fill="#000000"
                      >
                        <g>
                          <path d="M556.869,30.41 C554.814,30.41 553.148,32.076 553.148,34.131 C553.148,36.186 554.814,37.852 556.869,37.852 C558.924,37.852 560.59,36.186 560.59,34.131 C560.59,32.076 558.924,30.41 556.869,30.41 M541,60.657 C535.114,60.657 530.342,55.887 530.342,50 C530.342,44.114 535.114,39.342 541,39.342 C546.887,39.342 551.658,44.114 551.658,50 C551.658,55.887 546.887,60.657 541,60.657 M541,33.886 C532.1,33.886 524.886,41.1 524.886,50 C524.886,58.899 532.1,66.113 541,66.113 C549.9,66.113 557.115,58.899 557.115,50 C557.115,41.1 549.9,33.886 541,33.886 M565.378,62.101 C565.244,65.022 564.756,66.606 564.346,67.663 C563.803,69.06 563.154,70.057 562.106,71.106 C561.058,72.155 560.06,72.803 558.662,73.347 C557.607,73.757 556.021,74.244 553.102,74.378 C549.944,74.521 548.997,74.552 541,74.552 C533.003,74.552 532.056,74.521 528.898,74.378 C525.979,74.244 524.393,73.757 523.338,73.347 C521.94,72.803 520.942,72.155 519.894,71.106 C518.846,70.057 518.197,69.06 517.654,67.663 C517.244,66.606 516.755,65.022 516.623,62.101 C516.479,58.943 516.448,57.996 516.448,50 C516.448,42.003 516.479,41.056 516.623,37.899 C516.755,34.978 517.244,33.391 517.654,32.338 C518.197,30.938 518.846,29.942 519.894,28.894 C520.942,27.846 521.94,27.196 523.338,26.654 C524.393,26.244 525.979,25.756 528.898,25.623 C532.057,25.479 533.004,25.448 541,25.448 C548.997,25.448 549.943,25.479 553.102,25.623 C556.021,25.756 557.607,26.244 558.662,26.654 C560.06,27.196 561.058,27.846 562.106,28.894 C563.154,29.942 563.803,30.938 564.346,32.338 C564.756,33.391 565.244,34.978 565.378,37.899 C565.522,41.056 565.552,42.003 565.552,50 C565.552,57.996 565.522,58.943 565.378,62.101 Z" />
                        </g>
                      </g>
                    </g>
                  </svg>
                </div>
              </div>
            </a>
          </div>
        </blockquote>
        <script async src="//www.instagram.com/embed.js"></script>{' '}
      </div>
    </div>
  )
}

export default Videos
