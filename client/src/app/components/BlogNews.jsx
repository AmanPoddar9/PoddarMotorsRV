'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { FaArrowRight, FaClock, FaCalendar, FaUser } from 'react-icons/fa';
import axios from 'axios';
import API_URL from '../config/api';

const BlogNews = () => {
  const [activeFilter, setActiveFilter] = useState('All');
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);

  const filters = ['All', 'Company', 'New Launches', 'Service Tips'];

  useEffect(() => {
    fetchBlogs();
  }, [activeFilter]);

  const fetchBlogs = async () => {
    try {
      const params = activeFilter === 'All' ? {} : { category: activeFilter };
      const response = await axios.get(`${API_URL}/api/blogs`, { params });
      setArticles(response.data.data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching blogs:', error);
      setLoading(false);
    }
  };

  const filteredArticles = activeFilter === 'All' 
    ? articles 
    : articles.filter(article => article.category === activeFilter);

  return (
    <section className="pm-blog-wrapper w-full bg-[#F8F9FA] py-12 font-sans text-slate-800">
      <div className="max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Hero Section */}
        <div className="pm-hero-section mb-10 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-[#171C8F] mb-3">
            Better Drives, Better Lives
          </h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Stay updated with the latest from the automotive world, maintenance tips, and Poddar Motors news.
          </p>
        </div>

        {/* Sticky Filter Bar */}
        <div className="pm-filter-bar sticky top-0 z-30 bg-[#F8F9FA]/95 backdrop-blur-sm py-4 mb-8 border-b border-gray-200 overflow-x-auto no-scrollbar">
          <div className="flex space-x-2 md:space-x-4 min-w-max px-1">
            {filters.map((filter) => (
              <button
                key={filter}
                onClick={() => setActiveFilter(filter)}
                className={`px-5 py-2 rounded-full text-sm font-semibold transition-all duration-300 border ${
                  activeFilter === filter
                    ? 'bg-[#171C8F] text-white border-[#171C8F] shadow-md transform scale-105'
                    : 'bg-white text-gray-600 border-gray-200 hover:border-[#171C8F] hover:text-[#171C8F]'
                }`}
              >
                {filter}
              </button>
            ))}
          </div>
        </div>

        {/* Masonry Grid */}
        <div className="pm-masonry-grid grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
          {loading ? (
            <div className="col-span-full text-center py-20 text-gray-500">
              Loading blogs...
            </div>
          ) : filteredArticles.length === 0 ? (
            <div className="col-span-full text-center py-20 text-gray-500">
              No blogs found in this category.
            </div>
          ) : (
            filteredArticles.map((article) => (
            <article 
              key={article._id} 
              className="pm-article-card group bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 flex flex-col h-full border border-gray-100"
            >
              {/* Image Container */}
              <div className="relative h-48 w-full overflow-hidden">
                {article.featuredImage ? (
                  <Image
                    src={article.featuredImage}
                    alt={article.title}
                    fill
                    className="object-cover transition-transform duration-500 group-hover:scale-110"
                  />
                ) : (
                  <div className="w-full h-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white text-2xl font-bold">
                    {article.title.charAt(0)}
                  </div>
                )}
                <div className="absolute top-3 left-3 bg-[#ED1C24] text-white text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wide shadow-sm">
                  {article.category}
                </div>
              </div>

              {/* Content */}
              <div className="p-5 flex flex-col flex-grow">
                <div className="flex items-center text-xs text-gray-500 mb-3 space-x-3">
                  <div className="flex items-center">
                    <FaUser size={14} className="mr-1 text-[#171C8F]" />
                    {article.author}
                  </div>
                  <div className="flex items-center">
                    <FaCalendar size={14} className="mr-1 text-[#171C8F]" />
                    {new Date(article.publishedAt || article.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                  </div>
                </div>

                <h3 className="pm-card-title text-xl font-bold text-gray-900 mb-3 leading-tight group-hover:text-[#171C8F] transition-colors">
                  {article.title}
                </h3>

                <p className="text-gray-600 text-sm mb-4 line-clamp-3 flex-grow">
                  {article.excerpt}
                </p>

                <div className="pt-4 border-t border-gray-100 flex items-center justify-between mt-auto">
                  <span className="flex items-center text-xs text-gray-500 font-medium">
                    <FaClock size={14} className="mr-1" />
                    {article.readTime}
                  </span>
                  <Link 
                    href={`/blog/${article.slug}`} 
                    className="text-[#171C8F] text-sm font-bold flex items-center hover:text-[#ED1C24] transition-colors"
                  >
                    Read More <FaArrowRight size={16} className="ml-1" />
                  </Link>
                </div>
              </div>
            </article>
          ))
          )}
        </div>
        
      </div>
    </section>
  );
};

export default BlogNews;
