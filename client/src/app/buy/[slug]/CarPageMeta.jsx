import Head from 'next/head'

export default function CarPageMeta({ carData, slug }) {
  if (!carData) return null

  const carTitle = `${carData.year} ${carData.brand} ${carData.model} ${carData.variant} - ₹${carData.price?.toLocaleString()}`
  const carDescription = `Buy ${carData.year} ${carData.brand} ${carData.model} in Ranchi. ${carData.fuelType}, ${carData.transmissionType}, ${carData.kmDriven}km driven. Best price guaranteed!`
  const carImage = carData.images?.[0] || 'https://poddarmotors.com/logo.png'
  const carUrl = `https://poddarmotors.com/buy/${slug}`

  return (
    <>
      {/* Canonical URL */}
      <link rel="canonical" href={carUrl} />
      
      {/* Open Graph / Facebook */}
      <meta property="og:type" content="product" />
      <meta property="og:url" content={carUrl} />
      <meta property="og:title" content={carTitle} />
      <meta property="og:description" content={carDescription} />
      <meta property="og:image" content={carImage} />
      <meta property="og:image:width" content="1200" />
      <meta property="og:image:height" content="630" />
      <meta property="og:site_name" content="Poddar Motors Real Value" />
      <meta property="product:price:amount" content={carData.price} />
      <meta property="product:price:currency" content="INR" />
      
      {/* Twitter Card */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:url" content={carUrl} />
      <meta name="twitter:title" content={carTitle} />
      <meta name="twitter:description" content={carDescription} />
      <meta name="twitter:image" content={carImage} />
      
      {/* WhatsApp sharing optimization */}
      <meta property="og:image:alt" content={`${carData.brand} ${carData.model}`} />
      
      {/* Breadcrumb Schema */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'BreadcrumbList',
            itemListElement: [
              {
                '@type': 'ListItem',
                position: 1,
                name: 'Home',
                item: 'https://poddarmotors.com',
              },
              {
                '@type': 'ListItem',
                position: 2,
                name: 'Buy Cars',
                item: 'https://poddarmotors.com/buy',
              },
              {
                '@type': 'ListItem',
                position: 3,
                name: `${carData.brand} ${carData.model}`,
                item: carUrl,
              },
            ],
          }),
        }}
      />
    </>
  )
}
