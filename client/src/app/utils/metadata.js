// Metadata utility functions for consistent SEO across the site

/**
 * Generates base metadata for a page
 */
export function generateBaseMetadata({ title, description, keywords, canonical }) {
  const baseUrl = 'https://www.poddarmotors.com';
  
  return {
    title,
    description,
    keywords,
    alternates: {
      canonical: canonical || baseUrl,
    },
    openGraph: {
      title,
      description,
      url: canonical || baseUrl,
      siteName: 'Poddar Motors Real Value',
      locale: 'en_US',
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
    },
  };
}

/**
 * Generates metadata for car listing pages
 */
export function generateCarMetadata(car) {
  const price = car.price ? `₹${car.price.toLocaleString('en-IN')}` : 'Price On Request';
  const title = `${car.year || ''} ${car.brand || ''} ${car.model || ''} ${car.variant || ''} - ${price} | Poddar Motors`;
  const description = `Buy ${car.year} ${car.brand} ${car.model} in Ranchi. ${car.fuelType}, ${car.transmissionType}, ${car.kmDriven}km driven. Best price guaranteed! Book test drive now.`;
  const url = `https://www.poddarmotors.com/buy/${car.slug || car._id}`;
  
  return {
    title,
    description,
    keywords: `${car.brand} ${car.model}, used ${car.brand} ${car.model}, ${car.brand} ${car.model} ${car.year}, second hand ${car.brand} ${car.model} Ranchi, pre-owned ${car.brand} ${car.model}`,
    alternates: {
      canonical: url,
    },
    openGraph: {
      title,
      description,
      url,
      siteName: 'Poddar Motors Real Value',
      locale: 'en_US',
      type: 'website',
      images: car.images && car.images.length > 0 ? [
        {
          url: car.images[0],
          width: 1200,
          height: 630,
          alt: `${car.year} ${car.brand} ${car.model}`,
        }
      ] : [],
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: car.images && car.images.length > 0 ? [car.images[0]] : [],
    },
  };
}

/**
 * Generates metadata for blog post pages
 */
export function generateBlogMetadata(blog) {
  const title = `${blog.title} | Poddar Motors Blog`;
  const description = blog.excerpt || blog.description || `Read ${blog.title} on Poddar Motors blog`;
  const url = `https://www.poddarmotors.com/blog/${blog.slug}`;
  
  return {
    title,
    description,
    keywords: blog.tags ? blog.tags.join(', ') : '',
    alternates: {
      canonical: url,
    },
    openGraph: {
      title,
      description,
      url,
      siteName: 'Poddar Motors Real Value',
      locale: 'en_US',
      type: 'article',
      publishedTime: blog.publishedAt || blog.createdAt,
      modifiedTime: blog.updatedAt,
      authors: [blog.author || 'Poddar Motors'],
      images: blog.featuredImage ? [
        {
          url: blog.featuredImage,
          width: 1200,
          height: 630,
          alt: blog.title,
        }
      ] : [],
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: blog.featuredImage ? [blog.featuredImage] : [],
    },
  };
}

/**
 * Generates structured data for car listings (JSON-LD)
 */
export function generateCarStructuredData(car, slug) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Vehicle',
    name: `${car.year} ${car.brand} ${car.model} ${car.variant}`,
    image: car.images || [],
    description: `Buy used ${car.year} ${car.brand} ${car.model} in Ranchi. ${car.fuelType}, ${car.kmDriven}km driven.`,
    brand: {
      '@type': 'Brand',
      name: car.brand,
    },
    model: car.model,
    vehicleConfiguration: car.variant,
    productionDate: car.year,
    fuelType: car.fuelType,
    mileageFromOdometer: {
      '@type': 'QuantitativeValue',
      value: car.kmDriven,
      unitCode: 'KMT',
    },
    offers: {
      '@type': 'Offer',
      url: `https://www.poddarmotors.com/buy/${slug}`,
      priceCurrency: 'INR',
      price: car.price,
      itemCondition: 'https://schema.org/UsedCondition',
      availability: 'https://schema.org/InStock',
      seller: {
        '@type': 'AutoDealer',
        name: 'Poddar Motors Real Value',
      },
    },
  };
}

/**
 * Generates breadcrumb structured data
 */
export function generateBreadcrumbStructuredData(items) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      item: item.url,
    })),
  };
}
