'use client';

import React, { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import axios from 'axios';

import Link from 'next/link';
import Image from 'next/image';
import { FaArrowLeft, FaClock, FaCalendar, FaUser, FaFacebook, FaTwitter, FaLinkedin, FaWhatsapp } from 'react-icons/fa';
import API_URL from '../../config/api';

const BlogPost = () => {
  const params = useParams();
  const [blog, setBlog] = useState(null);
  const [loading, setLoading] = useState(true);
  const [relatedBlogs, setRelatedBlogs] = useState([]);

  useEffect(() => {
    if (params.slug) {
      fetchBlog();
    }
  }, [params.slug]);

  const fetchBlog = async () => {
    try {
      const response = await axios.get(`${API_URL}/api/blogs/slug/${params.slug}`);
      setBlog(response.data.data);
      
      // Fetch related blogs from same category
      const relatedResponse = await axios.get(`${API_URL}/api/blogs?category=${response.data.data.category}&limit=3`);
      setRelatedBlogs(relatedResponse.data.data.filter(b => b._id !== response.data.data._id).slice(0, 3));
      
      setLoading(false);
    } catch (error) {
      console.error('Error fetching blog:', error);
      setLoading(false);
    }
  };

  const shareUrl = typeof window !== 'undefined' ? window.location.href : '';
  const shareTitle = blog?.title || '';

  if (loading) {
    return (
      <div className="min-h-screen bg-white">
        <div className="pt-32 pb-20 flex items-center justify-center">
          <p className="text-gray-500 text-lg">Loading blog post...</p>
        </div>
      </div>
    );
  }

  if (!blog) {
    return (
      <div className="min-h-screen bg-white">
        <div className="pt-32 pb-20 text-center">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Blog Not Found</h1>
          <Link href="/blog" className="text-[#171C8F] hover:underline">
            ← Back to Blog
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      
      {/* Breadcrumbs */}
      <div className="pt-24 pb-6 bg-gray-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <nav className="flex items-center space-x-2 text-sm text-gray-600">
            <Link href="/" className="hover:text-[#171C8F]">Home</Link>
            <span>/</span>
            <Link href="/blog" className="hover:text-[#171C8F]">Blog</Link>
            <span>/</span>
            <span className="text-gray-900">{blog.title}</span>
          </nav>
        </div>
      </div>

      {/* Blog Content */}
      <article className="py-12">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          
          {/* Category Badge */}
          <div className="mb-4">
            <span className="inline-block bg-[#ED1C24] text-white text-xs font-bold px-4 py-2 rounded-full uppercase tracking-wide">
              {blog.category}
            </span>
          </div>

          {/* Title */}
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6 leading-tight">
            {blog.title}
          </h1>

          {/* Meta Info */}
          <div className="flex flex-wrap items-center gap-6 text-gray-600 mb-8 pb-8 border-b border-gray-200">
            <div className="flex items-center">
              <FaUser className="mr-2 text-[#171C8F]" />
              <span>{blog.author}</span>
            </div>
            <div className="flex items-center">
              <FaCalendar className="mr-2 text-[#171C8F]" />
              <span>{new Date(blog.publishedAt || blog.createdAt).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}</span>
            </div>
            <div className="flex items-center">
              <FaClock className="mr-2 text-[#171C8F]" />
              <span>{blog.readTime}</span>
            </div>
            <div className="flex items-center">
              <span className="text-gray-500">{blog.views} views</span>
            </div>
          </div>

          {/* Featured Image */}
          {blog.featuredImage && (
            <div className="relative w-full h-96 mb-12 rounded-2xl overflow-hidden">
              <Image
                src={blog.featuredImage}
                alt={blog.title}
                fill
                className="object-cover"
              />
            </div>
          )}

          {/* Content */}
          <div 
            className="prose prose-lg max-w-none mb-12"
            dangerouslySetInnerHTML={{ __html: blog.content }}
            style={{
              fontFamily: 'inherit',
            }}
          />

          {/* Share Buttons */}
          <div className="border-t border-b border-gray-200 py-6 my-12">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Share this article</h3>
            <div className="flex gap-4">
              <a
                href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                <FaFacebook /> Facebook
              </a>
              <a
                href={`https://twitter.com/intent/tweet?url=${encodeURIComponent(shareUrl)}&text=${encodeURIComponent(shareTitle)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 px-4 py-2 bg-sky-500 text-white rounded-lg hover:bg-sky-600 transition-colors"
              >
                <FaTwitter /> Twitter
              </a>
              <a
                href={`https://www.linkedin.com/shareArticle?mini=true&url=${encodeURIComponent(shareUrl)}&title=${encodeURIComponent(shareTitle)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 px-4 py-2 bg-blue-700 text-white rounded-lg hover:bg-blue-800 transition-colors"
              >
                <FaLinkedin /> LinkedIn
              </a>
              <a
                href={`https://wa.me/?text=${encodeURIComponent(shareTitle + ' ' + shareUrl)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
              >
                <FaWhatsapp /> WhatsApp
              </a>
            </div>
          </div>

          {/* Back to Blog */}
          <div className="mb-12">
            <Link 
              href="/blog"
              className="inline-flex items-center text-[#171C8F] font-semibold hover:text-[#ED1C24] transition-colors"
            >
              <FaArrowLeft className="mr-2" /> Back to Blog
            </Link>
          </div>

          {/* Related Posts */}
          {relatedBlogs.length > 0 && (
            <div className="border-t border-gray-200 pt-12">
              <h2 className="text-3xl font-bold text-gray-900 mb-8">Related Articles</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {relatedBlogs.map((related) => (
                  <Link 
                    key={related._id}
                    href={`/blog/${related.slug}`}
                    className="group"
                  >
                    <div className="bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-lg transition-shadow border border-gray-100">
                      {related.featuredImage ? (
                        <div className="relative h-48 w-full">
                          <Image
                            src={related.featuredImage}
                            alt={related.title}
                            fill
                            className="object-cover group-hover:scale-105 transition-transform duration-300"
                          />
                        </div>
                      ) : (
                        <div className="h-48 bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white text-3xl font-bold">
                          {related.title.charAt(0)}
                        </div>
                      )}
                      <div className="p-4">
                        <h3 className="font-bold text-gray-900 mb-2 line-clamp-2 group-hover:text-[#171C8F] transition-colors">
                          {related.title}
                        </h3>
                        <p className="text-sm text-gray-600 line-clamp-2">{related.excerpt}</p>
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
  );
};

export default BlogPost;
