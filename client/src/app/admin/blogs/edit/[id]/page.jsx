'use client';

import React, { useState, useEffect } from 'react';
import AdminNavbar from '../../../../components/AdminNavbar';
import { useRouter, useParams } from 'next/navigation';
import axios from 'axios';
import dynamic from 'next/dynamic';
import 'react-quill/dist/quill.snow.css';
import API_URL from '../../../../config/api';

const ReactQuill = dynamic(() => import('react-quill'), { ssr: false });

const EditBlog = () => {
  const router = useRouter();
  const params = useParams();
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    excerpt: '',
    author: 'Poddar Motors',
    category: 'Company',
    featuredImage: '',
    metaTitle: '',
    metaDescription: '',
    metaKeywords: '',
    status: 'draft',
    readTime: '5 min read',
  });

  useEffect(() => {
    fetchBlog();
  }, []);

  const fetchBlog = async () => {
    try {
      const response = await axios.get(`${API_URL}/api/blogs/${params.id}`);
      setFormData(response.data.data);
      setFetching(false);
    } catch (error) {
      console.error('Error fetching blog:', error);
      alert('Failed to load blog');
      router.push('/admin/blogs');
    }
  };

  const quillModules = {
    toolbar: [
      [{ header: [1, 2, 3, false] }],
      ['bold', 'italic', 'underline', 'strike'],
      [{ list: 'ordered' }, { list: 'bullet' }],
      [{ color: [] }, { background: [] }],
      ['link', 'image'],
      ['clean'],
    ],
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleContentChange = (value) => {
    setFormData(prev => ({ ...prev, content: value }));
  };

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setUploading(true);
    try {
      const uploadFormData = new FormData();
      uploadFormData.append('image', file);
      
      const response = await axios.post(`${API_URL}/api/upload`, uploadFormData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      
      setFormData(prev => ({ ...prev, featuredImage: response.data.url }));
    } catch (error) {
      console.error('Image upload error:', error);
      alert('Failed to upload image: ' + (error.response?.data?.message || error.message));
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      await axios.put(`${API_URL}/api/blogs/${params.id}`, formData);
      alert('Blog updated successfully!');
      router.push('/admin/blogs');
    } catch (error) {
      console.error('Error updating blog:', error);
      alert('Failed to update blog: ' + (error.response?.data?.message || error.message));
    } finally {
      setLoading(false);
    }
  };

  if (fetching) {
    return (
      <div className="min-h-screen bg-custom-black">
        <AdminNavbar />
        <div className="flex items-center justify-center h-96">
          <p className="text-custom-platinum">Loading blog...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-custom-black">
      <AdminNavbar />
      <main className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-white mb-2">Edit Blog</h1>
          <p className="text-lg text-custom-platinum">Update your blog post</p>
        </div>

        <form onSubmit={handleSubmit} className="bg-custom-jet rounded-lg shadow-md p-8 space-y-6 border border-white/10">
          {/* Title */}
          <div>
            <label className="block text-sm font-medium text-custom-platinum mb-2">
              Title <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleChange}
              required
              className="w-full px-4 py-2 bg-custom-black border border-white/10 rounded-lg focus:ring-2 focus:ring-custom-accent focus:border-transparent text-white placeholder-gray-500"
            />
          </div>

          {/* Category & Author */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-custom-platinum mb-2">Category</label>
              <select
                name="category"
                value={formData.category}
                onChange={handleChange}
                className="w-full px-4 py-2 bg-custom-black border border-white/10 rounded-lg focus:ring-2 focus:ring-custom-accent focus:border-transparent text-white"
              >
                <option value="Company">Company</option>
                <option value="New Launches">New Launches</option>
                <option value="Service Tips">Service Tips</option>
                <option value="Industry News">Industry News</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-custom-platinum mb-2">Author</label>
              <input
                type="text"
                name="author"
                value={formData.author}
                onChange={handleChange}
                className="w-full px-4 py-2 bg-custom-black border border-white/10 rounded-lg focus:ring-2 focus:ring-custom-accent focus:border-transparent text-white"
              />
            </div>
          </div>

          {/* Featured Image */}
          <div>
            <label className="block text-sm font-medium text-custom-platinum mb-2">Featured Image</label>
            <input
              type="file"
              accept="image/*"
              onChange={handleImageUpload}
              disabled={uploading}
              className="w-full px-4 py-2 bg-custom-black border border-white/10 rounded-lg focus:ring-2 focus:ring-custom-accent focus:border-transparent text-white file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-custom-accent file:text-custom-black hover:file:bg-yellow-400 disabled:opacity-50"
            />
            {uploading && <p className="text-sm text-custom-accent mt-2">Uploading image...</p>}
            {formData.featuredImage && (
              <img src={formData.featuredImage} alt="Preview" className="mt-4 h-48 object-cover rounded-lg border border-white/10" />
            )}
          </div>

          {/* Excerpt */}
          <div>
            <label className="block text-sm font-medium text-custom-platinum mb-2">
              Excerpt <span className="text-red-500">*</span>
            </label>
            <textarea
              name="excerpt"
              value={formData.excerpt}
              onChange={handleChange}
              required
              maxLength={300}
              rows={3}
              className="w-full px-4 py-2 bg-custom-black border border-white/10 rounded-lg focus:ring-2 focus:ring-custom-accent focus:border-transparent text-white placeholder-gray-500"
            />
            <p className="text-sm text-gray-500 mt-1">{formData.excerpt.length}/300 characters</p>
          </div>

          {/* Content */}
          <div>
            <label className="block text-sm font-medium text-custom-platinum mb-2">
              Content <span className="text-red-500">*</span>
            </label>
            <div className="bg-white rounded-lg overflow-hidden text-black">
              <ReactQuill
                theme="snow"
                value={formData.content}
                onChange={handleContentChange}
                modules={quillModules}
                className="h-64 mb-12"
              />
            </div>
          </div>

          {/* SEO Section */}
          <div className="border-t border-white/10 pt-6">
            <h3 className="text-lg font-semibold text-white mb-4">SEO Settings</h3>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-custom-platinum mb-2">Meta Title</label>
                <input
                  type="text"
                  name="metaTitle"
                  value={formData.metaTitle}
                  onChange={handleChange}
                  className="w-full px-4 py-2 bg-custom-black border border-white/10 rounded-lg focus:ring-2 focus:ring-custom-accent focus:border-transparent text-white placeholder-gray-500"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-custom-platinum mb-2">Meta Description</label>
                <textarea
                  name="metaDescription"
                  value={formData.metaDescription}
                  onChange={handleChange}
                  rows={2}
                  className="w-full px-4 py-2 bg-custom-black border border-white/10 rounded-lg focus:ring-2 focus:ring-custom-accent focus:border-transparent text-white placeholder-gray-500"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-custom-platinum mb-2">Keywords</label>
                <input
                  type="text"
                  name="metaKeywords"
                  value={formData.metaKeywords}
                  onChange={handleChange}
                  className="w-full px-4 py-2 bg-custom-black border border-white/10 rounded-lg focus:ring-2 focus:ring-custom-accent focus:border-transparent text-white placeholder-gray-500"
                />
              </div>
            </div>
          </div>

          {/* Read Time & Status */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-custom-platinum mb-2">Read Time</label>
              <input
                type="text"
                name="readTime"
                value={formData.readTime}
                onChange={handleChange}
                className="w-full px-4 py-2 bg-custom-black border border-white/10 rounded-lg focus:ring-2 focus:ring-custom-accent focus:border-transparent text-white placeholder-gray-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-custom-platinum mb-2">Status</label>
              <select
                name="status"
                value={formData.status}
                onChange={handleChange}
                className="w-full px-4 py-2 bg-custom-black border border-white/10 rounded-lg focus:ring-2 focus:ring-custom-accent focus:border-transparent text-white"
              >
                <option value="draft">Draft</option>
                <option value="published">Published</option>
              </select>
            </div>
          </div>

          {/* Submit Buttons */}
          <div className="flex gap-4 pt-6 border-t border-white/10">
            <button
              type="submit"
              disabled={loading}
              className="flex-1 bg-custom-accent hover:bg-yellow-400 text-custom-black px-6 py-3 rounded-lg font-bold disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {loading ? 'Updating...' : 'Update Blog'}
            </button>
            <button
              type="button"
              onClick={() => router.push('/admin/blogs')}
              className="px-6 py-3 border border-white/10 rounded-lg font-semibold text-custom-platinum hover:bg-white/5 transition-colors"
            >
              Cancel
            </button>
          </div>
        </form>
      </main>
    </div>
  );
};

export default EditBlog;
