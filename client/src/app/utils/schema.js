/**
 * Schema.org structured data generators for SEO
 */

const BASE_URL = 'https://www.poddarmotors.com';

/**
 * Generate Product schema for a car listing
 * @param {Object} car - Car listing data
 * @returns {Object} Product schema JSON-LD
 */
export function generateProductSchema(car) {
  const brand = car.brand || car.make || 'Unknown Brand';
  const model = car.model || 'Unknown Model';
  
  return {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: `${car.year} ${brand} ${model}`,
    description: car.description || `${car.year} ${brand} ${model} - ${car.kmDriven} km driven, ${car.fuelType} fuel, ${car.transmissionType} transmission. Available at Poddar Motors, Ranchi.`,
    image: car.images?.[0] || car.imageUrl || `${BASE_URL}/default-car.jpg`,
    brand: {
      '@type': 'Brand',
      name: brand,
    },
    manufacturer: {
      '@type': 'Organization',
      name: brand,
    },
    offers: {
      '@type': 'Offer',
      url: `${BASE_URL}/buy/${car.slug || car._id}`,
      priceCurrency: 'INR',
      price: car.price,
      priceValidUntil: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], // 30 days
      itemCondition: 'https://schema.org/UsedCondition',
      availability: car.sold ? 'https://schema.org/OutOfStock' : 'https://schema.org/InStock',
      seller: {
        '@type': 'AutoDealer',
        name: 'Poddar Motors Real Value',
        url: BASE_URL,
      },
    },
    vehicleIdentificationNumber: car.vin || undefined,
    mileageFromOdometer: {
      '@type': 'QuantitativeValue',
      value: car.kmDriven,
      unitCode: 'KMT',
    },
    productionDate: car.year?.toString(),
    vehicleEngine: {
      '@type': 'EngineSpecification',
      fuelType: car.fuelType,
    },
    vehicleTransmission: car.transmissionType,
    numberOfPreviousOwners: car.ownership || 1,
    aggregateRating: car.rating ? {
      '@type': 'AggregateRating',
      ratingValue: car.rating,
      reviewCount: car.reviewCount || 1,
    } : undefined,
  };
}

/**
 * Generate ItemList schema for car listings page
 * @param {Array} cars - Array of car listings
 * @returns {Object} ItemList schema JSON-LD
 */
export function generateItemListSchema(cars) {
  return {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    name: 'Used Cars for Sale in Ranchi',
    description: 'Browse quality certified used cars at Poddar Motors Real Value, Ranchi',
    numberOfItems: cars.length,
    itemListElement: cars.slice(0, 10).map((car, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      url: `${BASE_URL}/buy/${car.slug || car._id}`,
      item: {
        '@type': 'Product',
        name: `${car.year} ${car.make} ${car.model}`,
        image: car.images?.[0] || car.imageUrl,
        offers: {
          '@type': 'Offer',
          price: car.price,
          priceCurrency: 'INR',
        },
      },
    })),
  };
}

/**
 * Generate Breadcrumb schema
 * @param {Array} breadcrumbs - Array of breadcrumb items {name, url}
 * @returns {Object} BreadcrumbList schema JSON-LD
 */
export function generateBreadcrumbSchema(breadcrumbs) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: breadcrumbs.map((crumb, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: crumb.name,
      item: crumb.url ? `${BASE_URL}${crumb.url}` : undefined,
    })),
  };
}

/**
 * Generate Organization schema for Poddar Motors
 * @returns {Object} Organization schema JSON-LD
 */
export function generateOrganizationSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': 'AutoDealer',
    name: 'Poddar Motors Real Value',
    description: 'Trusted used car dealer in Ranchi, Jharkhand. Best prices for second hand cars.',
    url: BASE_URL,
    telephone: '+918709119090',
    address: {
      '@type': 'PostalAddress',
      streetAddress: 'Near Oxford School, Pragati Path, Upper Chutia',
      addressLocality: 'Ranchi',
      addressRegion: 'Jharkhand',
      postalCode: '834001',
      addressCountry: 'IN',
    },
    geo: {
      '@type': 'GeoCoordinates',
      latitude: '23.36',
      longitude: '85.33',
    },
    openingHoursSpecification: {
      '@type': 'OpeningHoursSpecification',
      dayOfWeek: [
        'Monday',
        'Tuesday',
        'Wednesday',
        'Thursday',
        'Friday',
        'Saturday',
        'Sunday',
      ],
      opens: '09:30',
      closes: '19:00',
    },
    sameAs: [
      'https://www.facebook.com/RealValueRanchi',
      'https://www.instagram.com/pmplrealvalue/',
    ],
    priceRange: '₹₹',
  };
}
