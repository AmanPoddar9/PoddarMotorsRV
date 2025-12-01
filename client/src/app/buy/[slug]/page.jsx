import { notFound } from 'next/navigation';
import API_URL from '../../config/api';
import CarListingClient from './CarListingClient';
import { generateCarMetadata } from '../../utils/metadata';
import { generateProductSchema, generateBreadcrumbSchema } from '../../utils/schema';

// Force dynamic rendering since we have dynamic routes and want fresh data
export const dynamic = 'force-dynamic';

async function getCarData(slug) {
  try {
    const isObjectId = /^[0-9a-fA-F]{24}$/.test(slug);
    const url = isObjectId
      ? `${API_URL}/api/listings/${slug}`
      : `${API_URL}/api/listings/slug/${slug}`;

    const res = await fetch(url, { 
      cache: 'no-store',
      headers: {
        'Content-Type': 'application/json',
      }
    });

    if (!res.ok) {
      if (res.status === 404) return null;
      throw new Error('Failed to fetch car data');
    }

    const data = await res.json();
    
    // Filter out null images
    if (data.images) {
      data.images = data.images.filter((img) => img != null);
    }
    
    return data;
  } catch (error) {
    console.error('Error fetching car data:', error);
    return null;
  }
}

async function getSimilarCars(type, currentId) {
  try {
    const res = await fetch(`${API_URL}/api/listings?type=${type}&limit=4`, {
      cache: 'no-store'
    });
    
    if (!res.ok) return [];
    
    const data = await res.json();
    if (data && data.listings) {
      return data.listings.filter((car) => car._id !== currentId);
    }
    return [];
  } catch (error) {
    console.error('Error fetching similar cars:', error);
    return [];
  }
}

async function getTestimonials(model) {
  try {
    if (!model) return [];
    const modelName = model.split(' ')[0];
    const res = await fetch(`${API_URL}/api/testimonials?carModel=${modelName}&limit=3`, {
      next: { revalidate: 3600 } // Cache testimonials for 1 hour
    });
    
    if (!res.ok) return [];
    
    const data = await res.json();
    return data.data || [];
  } catch (error) {
    console.error('Error fetching testimonials:', error);
    return [];
  }
}

export async function generateMetadata({ params }) {
  const car = await getCarData(params.slug);
  
  if (!car) {
    return {
      title: 'Car Not Found | Poddar Motors',
      description: 'The requested car listing could not be found.',
    };
  }
  
  return generateCarMetadata(car);
}

export default async function CarPage({ params }) {
  const carData = await getCarData(params.slug);

  if (!carData) {
    notFound();
  }

  const [similarCars, testimonials] = await Promise.all([
    getSimilarCars(carData.type, carData._id),
    getTestimonials(carData.model)
  ]);

  // Generate Structured Data
  const productSchema = generateProductSchema(carData);
  
  const breadcrumbSchema = generateBreadcrumbSchema([
    { name: 'Home', url: '/' },
    { name: 'Buy Used Cars', url: '/buy' },
    { name: `${carData.year} ${carData.brand || carData.make} ${carData.model}`, url: `/buy/${params.slug}` }
  ]);

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(productSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />

      <CarListingClient 
        carData={carData} 
        similarCars={similarCars} 
        testimonials={testimonials}
        slug={params.slug}
      />
    </>
  );
}
