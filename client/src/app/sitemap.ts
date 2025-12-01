import { MetadataRoute } from 'next';
import axios from 'axios';
import API_URL from './config/api';

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
    '/testimonials',
    '/buying-guide',
  ].map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date(),
    changeFrequency: 'weekly' as const,
    priority: route === '' ? 1 : 0.8,
  }));

  // Fetch all published blogs
  let blogPages: MetadataRoute.Sitemap = [];
  try {
    const response = await axios.get(`${API_URL}/api/blogs`);
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
    const response = await axios.get(`${API_URL}/api/listings`);
    const cars = response.data;
    
    carPages = cars.map((car: any) => ({
      url: `${baseUrl}/buy/${car.slug || car._id}`,
      lastModified: new Date(), // Car listings don't have updatedAt/createdAt, use current date
      changeFrequency: 'daily' as const,
      priority: 0.9,
    }));
  } catch (error) {
    console.error('Error fetching car listings for sitemap:', error);
  }

  return [...staticPages, ...blogPages, ...carPages];
}
