'use client';

import React from 'react';
import BlogNews from '../components/BlogNews';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

const TestBlogPage = () => {
  return (
    <main className="min-h-screen bg-white">
      <Navbar />
      <div className="pt-20">
        <h1 className="text-center text-2xl font-bold my-8">Blog Component Test</h1>
        <BlogNews />
      </div>
      <Footer />
    </main>
  );
};

export default TestBlogPage;
