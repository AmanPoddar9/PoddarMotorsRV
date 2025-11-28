import { MetadataRoute } from 'next';
import axios from 'axios';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = 'https://www.poddarmotors.com';
  
  // Static pages
  const staticPages = [
    '',
    '/buy',
    '/sell',
    '/scrap',
    '/finance',
    '/blog',
    '/videos',
    '/about',
    '/contact',
    '/workshop',
  ].map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date(),
    changeFrequency: 'weekly' as const,
    priority: route === '' ? 1 : 0.8,
  }));

  // Fetch all published blogs
  let blogPages: MetadataRoute.Sitemap = [];
  try {
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000';
    const response = await axios.get(`${apiUrl}/api/blogs`);
    const blogs = response.data.data;
    
    blogPages = blogs.map((blog: any) => ({
      url: `${baseUrl}/blog/${blog.slug}`,
      lastModified: new Date(blog.updatedAt || blog.publishedAt || blog.createdAt),
      changeFrequency: 'monthly' as const,
      priority: 0.6,
    }));
  } catch (error) {
    console.error('Error fetching blogs for sitemap:', error);
  }

  // Fetch all car listings
  let carPages: MetadataRoute.Sitemap = [];
  try {
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000';
    const response = await axios.get(`${apiUrl}/api/listings`);
    const cars = response.data;
    
    carPages = cars.map((car: any) => ({
      url: `${baseUrl}/buy/${car.slug || car._id}`,
      lastModified: new Date(car.updatedAt || car.createdAt),
      changeFrequency: 'daily' as const,
      priority: 0.9,
    }));
  } catch (error) {
    console.error('Error fetching car listings for sitemap:', error);
  }

  return [...staticPages, ...blogPages, ...carPages];
}
