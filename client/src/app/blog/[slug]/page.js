import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { notFound } from 'next/navigation';

import { FaArrowLeft, FaClock, FaCalendar, FaUser, FaEye } from 'react-icons/fa';
import BlogContent from './BlogContent';
import SocialShare from '../../components/SocialShare';
import API_URL from '../../config/api';

// Generate metadata for SEO
export async function generateMetadata({ params }) {
  try {
    const response = await fetch(`${API_URL}/api/blogs/slug/${params.slug}`, {
      cache: 'no-store'
    });
    
    if (!response.ok) {
      return {
        title: 'Blog Not Found | Poddar Motors',
        description: 'The blog post you are looking for could not be found.'
      };
    }

    const data = await response.json();
    const blog = data.data;

    const baseUrl = 'https://www.poddarmotors.com';
    const url = `${baseUrl}/blog/${params.slug}`;

    return {
      title: blog.metaTitle || `${blog.title} | Poddar Motors Blog`,
      description: blog.metaDescription || blog.excerpt,
      keywords: blog.metaKeywords || `${blog.category}, Poddar Motors, automotive, car news, ${blog.title}`,
      authors: [{ name: blog.author }],
      openGraph: {
        title: blog.metaTitle || blog.title,
        description: blog.metaDescription || blog.excerpt,
        url: url,
        siteName: 'Poddar Motors',
        images: [
          {
            url: blog.featuredImage || `${baseUrl}/default-blog.jpg`,
            width: 1200,
            height: 630,
            alt: blog.title,
          }
        ],
        locale: 'en_IN',
        type: 'article',
        publishedTime: blog.publishedAt || blog.createdAt,
        modifiedTime: blog.updatedAt,
        authors: [blog.author],
        section: blog.category,
        tags: blog.metaKeywords?.split(',').map(k => k.trim()) || [],
      },
      twitter: {
        card: 'summary_large_image',
        title: blog.metaTitle || blog.title,
        description: blog.metaDescription || blog.excerpt,
        images: [blog.featuredImage || `${baseUrl}/default-blog.jpg`],
        creator: '@PoddarMotors',
        site: '@PoddarMotors',
      },
      alternates: {
        canonical: url,
      },
      robots: {
        index: blog.status === 'published',
        follow: true,
        googleBot: {
          index: blog.status === 'published',
          follow: true,
          'max-video-preview': -1,
          'max-image-preview': 'large',
          'max-snippet': -1,
        },
      },
    };
  } catch (error) {
    console.error('Error generating metadata:', error);
    return {
      title: 'Blog | Poddar Motors',
      description: 'Read the latest automotive news and insights from Poddar Motors.'
    };
  }
}

// Fetch blog data server-side
async function getBlogData(slug) {
  try {
    const response = await fetch(`${API_URL}/api/blogs/slug/${slug}`, {
      cache: 'no-store',
    });

    if (!response.ok) {
      return null;
    }

    const data = await response.json();
    return data.data;
  } catch (error) {
    console.error('Error fetching blog:', error);
    return null;
  }
}

// Fetch related blogs
async function getRelatedBlogs(category, currentBlogId) {
  try {
    const response = await fetch(`${API_URL}/api/blogs?category=${category}&limit=3`, {
      cache: 'no-store',
    });

    if (!response.ok) {
      return [];
    }

    const data = await response.json();
    return data.data.filter(b => b._id !== currentBlogId).slice(0, 3);
  } catch (error) {
    console.error('Error fetching related blogs:', error);
    return [];
  }
}

export default async function BlogPost({ params }) {
  const blog = await getBlogData(params.slug);

  if (!blog) {
    notFound();
  }

  const relatedBlogs = await getRelatedBlogs(blog.category, blog._id);
  const baseUrl = 'https://www.poddarmotors.com';
  const shareUrl = `${baseUrl}/blog/${params.slug}`;

  // JSON-LD structured data for article
  const articleSchema = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: blog.title,
    description: blog.excerpt,
    image: blog.featuredImage || `${baseUrl}/default-blog.jpg`,
    datePublished: blog.publishedAt || blog.createdAt,
    dateModified: blog.updatedAt || blog.createdAt,
    author: {
      '@type': 'Person',
      name: blog.author,
    },
    publisher: {
      '@type': 'Organization',
      name: 'Poddar Motors',
      logo: {
        '@type': 'ImageObject',
        url: `${baseUrl}/logo.png`,
      },
    },
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': shareUrl,
    },
    articleSection: blog.category,
    keywords: blog.metaKeywords,
  };

  // Breadcrumb schema
  const breadcrumbSchema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      {
        '@type': 'ListItem',
        position: 1,
        name: 'Home',
        item: baseUrl,
      },
      {
        '@type': 'ListItem',
        position: 2,
        name: 'Blog',
        item: `${baseUrl}/blog`,
      },
      {
        '@type': 'ListItem',
        position: 3,
        name: blog.title,
        item: shareUrl,
      },
    ],
  };

  return (
    <>
      {/* Structured Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(articleSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />

      <div className="min-h-screen bg-gradient-to-b from-custom-black via-custom-jet to-custom-black">
        
        {/* Breadcrumbs */}
        <div className="pt-24 pb-6 bg-custom-jet/50 backdrop-blur-sm border-b border-white/5">
          <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
            <nav className="flex items-center space-x-2 text-sm text-custom-platinum" aria-label="Breadcrumb">
              <Link href="/" className="hover:text-custom-accent transition-colors">
                Home
              </Link>
              <span className="text-custom-platinum/50">/</span>
              <Link href="/blog" className="hover:text-custom-accent transition-colors">
                Blog
              </Link>
              <span className="text-custom-platinum/50">/</span>
              <span className="text-custom-seasalt">{blog.title}</span>
            </nav>
          </div>
        </div>

        {/* Blog Content */}
        <article className="py-12">
          <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
            
            {/* Category Badge */}
            <div className="mb-6 flex items-center justify-between">
              <span className="inline-flex items-center gap-2 bg-gradient-to-r from-custom-accent to-yellow-400 text-custom-black text-sm font-bold px-4 py-2 rounded-full uppercase tracking-wide shadow-lg">
                {blog.category}
              </span>
              <div className="flex items-center gap-2 text-custom-platinum text-sm">
                <FaEye className="text-custom-accent" />
                <span>{blog.views || 0} views</span>
              </div>
            </div>

            {/* Title */}
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-display font-bold text-white mb-6 leading-tight">
              {blog.title}
            </h1>

            {/* Meta Info */}
            <div className="flex flex-wrap items-center gap-6 text-custom-platinum mb-8 pb-8 border-b border-white/10">
              <div className="flex items-center gap-2">
                <FaUser className="text-custom-accent" />
                <span className="font-medium">{blog.author}</span>
              </div>
              <div className="flex items-center gap-2">
                <FaCalendar className="text-custom-accent" />
                <span>
                  {new Date(blog.publishedAt || blog.createdAt).toLocaleDateString('en-US', { 
                    month: 'long', 
                    day: 'numeric', 
                    year: 'numeric' 
                  })}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <FaClock className="text-custom-accent" />
                <span>{blog.readTime}</span>
              </div>
            </div>
            
            {/* Social Share Top */}
            <div className="mb-8">
              <SocialShare 
                url={shareUrl} 
                title={blog.title} 
              />
            </div>

            {/* Featured Image */}
            {blog.featuredImage && (
              <div className="relative w-full h-96 md:h-[500px] mb-12 rounded-2xl overflow-hidden shadow-2xl border border-white/10">
                <Image
                  src={blog.featuredImage}
                  alt={blog.title}
                  fill
                  className="object-cover"
                  priority
                />
                <div className="absolute inset-0 bg-gradient-to-t from-custom-black/50 to-transparent" />
              </div>
            )}

            {/* Content - Pass to client component for interactive features */}
            <BlogContent 
              content={blog.content} 
              shareUrl={shareUrl}
              shareTitle={blog.title}
            />

            {/* Share Buttons */}
            <div className="glass-dark rounded-2xl p-8 my-12 border border-white/10">
              <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
                <span className="w-1 h-6 bg-gradient-to-b from-custom-accent to-yellow-400 rounded-full" />
                Share this article
              </h3>
              <SocialShare 
                url={shareUrl} 
                title={blog.title} 
                className="gap-4"
              />
            </div>

            {/* Back to Blog */}
            <div className="mb-12">
              <Link 
                href="/blog"
                className="inline-flex items-center gap-2 text-custom-accent font-semibold hover:text-yellow-400 transition-colors group"
              >
                <FaArrowLeft className="group-hover:-translate-x-1 transition-transform" /> 
                Back to Blog
              </Link>
            </div>

            {/* Related Posts */}
            {relatedBlogs.length > 0 && (
              <div className="border-t border-white/10 pt-12">
                <h2 className="text-3xl md:text-4xl font-display font-bold text-white mb-8 flex items-center gap-3">
                  <span className="w-2 h-8 bg-gradient-to-b from-custom-accent to-yellow-400 rounded-full" />
                  Related Articles
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {relatedBlogs.map((related) => (
                    <Link 
                      key={related._id}
                      href={`/blog/${related.slug}`}
                      className="group"
                    >
                      <div className="glass-dark rounded-2xl overflow-hidden hover:shadow-2xl transition-all border border-white/10 hover:border-custom-accent/50 h-full flex flex-col">
                        {related.featuredImage ? (
                          <div className="relative h-48 w-full overflow-hidden">
                            <Image
                              src={related.featuredImage}
                              alt={related.title}
                              fill
                              className="object-cover group-hover:scale-110 transition-transform duration-500"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-custom-black to-transparent" />
                          </div>
                        ) : (
                          <div className="h-48 bg-gradient-to-br from-custom-accent to-yellow-400 flex items-center justify-center text-custom-black text-4xl font-bold">
                            {related.title.charAt(0)}
                          </div>
                        )}
                        <div className="p-6 flex-grow flex flex-col">
                          <span className="text-xs text-custom-accent font-bold uppercase tracking-wide mb-2">
                            {related.category}
                          </span>
                          <h3 className="font-bold text-white text-lg mb-2 line-clamp-2 group-hover:text-custom-accent transition-colors">
                            {related.title}
                          </h3>
                          <p className="text-sm text-custom-platinum line-clamp-2 mb-4 flex-grow">
                            {related.excerpt}
                          </p>
                          <div className="flex items-center justify-between text-xs text-custom-platinum/70 pt-4 border-t border-white/5">
                            <span className="flex items-center gap-1">
                              <FaClock /> {related.readTime}
                            </span>
                            <span className="text-custom-accent group-hover:translate-x-1 transition-transform">
                              Read More →
                            </span>
                          </div>
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            )}
          </div>
        </article>

      </div>
    </>
  );
}
