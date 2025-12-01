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
    <section className="pm-blog-wrapper w-full py-12 font-sans">
      <div className="max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Hero Section */}
        <div className="pm-hero-section mb-10 text-center">
          <h2 className="text-4xl md:text-5xl font-display font-bold bg-gradient-to-r from-custom-accent to-yellow-400 bg-clip-text text-transparent mb-4">
            Better Drives, Better Lives
          </h2>
          <p className="text-custom-seasalt text-lg max-w-2xl mx-auto">
            Stay updated with the latest from the automotive world, maintenance tips, and Poddar Motors news.
          </p>
        </div>

        {/* Sticky Filter Bar */}
        <div className="pm-filter-bar sticky top-16 z-30 backdrop-blur-xl py-4 mb-8 border-b border-white/10 overflow-x-auto no-scrollbar">
          <div className="flex space-x-2 md:space-x-4 min-w-max px-1">
            {filters.map((filter) => (
              <button
                key={filter}
                onClick={() => setActiveFilter(filter)}
                className={`px-5 py-2 rounded-full text-sm font-semibold transition-all duration-300 ${
                  activeFilter === filter
                    ? 'bg-gradient-to-r from-custom-accent to-yellow-400 text-custom-black shadow-lg transform scale-105'
                    : 'glass-dark border border-white/20 text-custom-seasalt hover:border-custom-accent hover:text-custom-accent'
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
            <div className="col-span-full text-center py-20 text-custom-platinum">
              <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-custom-accent border-t-transparent"></div>
              <p className="mt-4">Loading blogs...</p>
            </div>
          ) : filteredArticles.length === 0 ? (
            <div className="col-span-full text-center py-20">
              <div className="glass-dark rounded-2xl p-12 border border-white/10 max-w-md mx-auto">
                <p className="text-custom-platinum text-lg">No blogs found in this category.</p>
              </div>
            </div>
          ) : (
            filteredArticles.map((article) => (
            <article 
              key={article._id} 
              className="pm-article-card group glass-dark rounded-2xl overflow-hidden hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 flex flex-col h-full border border-white/10 hover:border-custom-accent/50"
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
                  <div className="w-full h-full bg-gradient-to-br from-custom-accent to-yellow-400 flex items-center justify-center text-custom-black text-3xl font-bold">
                    {article.title.charAt(0)}
                  </div>
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-custom-black via-transparent to-transparent opacity-60 group-hover:opacity-40 transition-opacity" />
                <div className="absolute top-3 left-3 bg-gradient-to-r from-custom-accent to-yellow-400 text-custom-black text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wide shadow-lg">
                  {article.category}
                </div>
              </div>

              {/* Content */}
              <div className="p-5 flex flex-col flex-grow">
                <div className="flex items-center text-xs text-custom-platinum mb-3 space-x-3">
                  <div className="flex items-center gap-1">
                    <FaUser size={12} className="text-custom-accent" />
                    {article.author}
                  </div>
                  <div className="flex items-center gap-1">
                    <FaCalendar size={12} className="text-custom-accent" />
                    {new Date(article.publishedAt || article.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                  </div>
                </div>

                <h3 className="pm-card-title text-xl font-bold text-white mb-3 leading-tight group-hover:text-custom-accent transition-colors">
                  {article.title}
                </h3>

                <p className="text-custom-seasalt text-sm mb-4 line-clamp-3 flex-grow">
                  {article.excerpt}
                </p>

                <div className="pt-4 border-t border-white/5 flex items-center justify-between mt-auto">
                  <span className="flex items-center gap-1 text-xs text-custom-platinum/70 font-medium">
                    <FaClock size={12} />
                    {article.readTime}
                  </span>
                  <Link 
                    href={`/blog/${article.slug}`} 
                    className="text-custom-accent text-sm font-bold flex items-center hover:text-yellow-400 transition-colors group-hover:translate-x-1"
                  >
                    Read More <FaArrowRight size={14} className="ml-1" />
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
