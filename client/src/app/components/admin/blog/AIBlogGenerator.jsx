'use client';

import React, { useState } from 'react';
import { FiCpu, FiLoader, FiCheck, FiRefreshCw, FiImage, FiFileText, FiTag } from 'react-icons/fi';
import axios from 'axios';
import { toast } from 'react-hot-toast';
import API_URL from '../../../config/api';

export default function AIBlogGenerator({ onBlogGenerated, onClose }) {
  const [step, setStep] = useState(1); // 1: Input, 2: Select Topic, 3: Metadata, 4: Content, 5: Image
  const [category, setCategory] = useState('General Used Cars');
  const [topics, setTopics] = useState([]);
  const [selectedTopic, setSelectedTopic] = useState('');
  const [loading, setLoading] = useState(false);
  
  const categories = [
    'General Used Cars',
    'Car Maintenance & Service',
    'Financial Advice & Loans',
    'New Launches & Reviews',
    'Company Updates'
  ];

  const handleGenerateTopics = async () => {
    setLoading(true);
    try {
      const response = await axios.post(`${API_URL}/api/blogs/generate-topics`, {
        category
      }, {
        withCredentials: true
      });
      setTopics(response.data.topics);
      setStep(2);
    } catch (error) {
      console.error(error);
      toast.error('Failed to generate topics.');
    } finally {
      setLoading(false);
    }
  };

  const handleGenerateContent = async (topic) => {
    setLoading(true);
    setSelectedTopic(topic);
    
    let blogData = {};

    try {
      // STEP 1: METADATA
      setStep(3); // Researching...
      const metaResponse = await axios.post(`${API_URL}/api/blogs/generate-metadata`, {
        topic
      }, { withCredentials: true });
      
      blogData = { ...metaResponse.data }; // Title, Excerpt, SEO
      
      // STEP 2: BODY TEXT
      setStep(4); // Writing...
      const bodyResponse = await axios.post(`${API_URL}/api/blogs/generate-body`, {
        topic,
        title: blogData.title
      }, { withCredentials: true });
      
      blogData.content = bodyResponse.data.content;
      
      // STEP 3: IMAGE
      setStep(5); // Drawing...
      try {
        const imageResponse = await axios.post(`${API_URL}/api/blogs/generate-image`, {
          title: blogData.title
        }, { withCredentials: true });
        
        if (imageResponse.data.featuredImage) {
          blogData.featuredImage = imageResponse.data.featuredImage;
        } else {
          toast('Image generation skipped (timeout or error).', { icon: '⚠️' });
        }
      } catch (imgError) {
        console.error("Image generation failed:", imgError);
        // Continue without image
      }

      // DONE
      onBlogGenerated(blogData);
      toast.success('Blog created successfully!');
      onClose();

    } catch (error) {
      console.error(error);
      toast.error(error.response?.data?.message || 'Failed to generate content. Please try again.');
      setStep(2); // Go back
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-custom-gray p-6 rounded-lg border border-custom-border shadow-2xl max-w-2xl w-full mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-xl font-bold flex items-center gap-2">
          <FiCpu className="text-custom-orange" />
          AI Blog Wizard
        </h3>
        <button onClick={onClose} className="text-gray-400 hover:text-white">&times;</button>
      </div>

      {/* STEP 1: CATEGORY SELECTION */}
      {step === 1 && (
        <div className="space-y-4">
          <div>
            <label className="block text-sm text-gray-400 mb-2">What do you want to write about?</label>
            <select 
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full bg-custom-dark p-3 rounded border border-custom-border text-white focus:border-custom-orange outline-none"
            >
              {categories.map(cat => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>
          </div>
          
          <div className="pt-2">
            <button 
              onClick={handleGenerateTopics}
              disabled={loading}
              className="w-full bg-custom-orange text-white py-3 rounded font-semibold hover:bg-orange-600 transition flex items-center justify-center gap-2"
            >
              {loading ? <FiLoader className="animate-spin" /> : <FiRefreshCw />}
              Generate Topic Ideas
            </button>
          </div>
        </div>
      )}

      {/* STEP 2: TOPIC SELECTION */}
      {step === 2 && (
        <div className="space-y-4">
          <p className="text-gray-400 text-sm">Select a topic to generate the full blog post:</p>
          <div className="space-y-2 max-h-60 overflow-y-auto pr-2">
            {topics.map((topic, index) => (
              <div 
                key={index}
                onClick={() => handleGenerateContent(topic)}
                className="p-3 bg-custom-dark border border-custom-border rounded cursor-pointer hover:border-custom-orange hover:bg-opacity-50 transition group"
              >
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium text-gray-200 group-hover:text-white">{topic}</span>
                  <span className="text-xs text-custom-orange opacity-0 group-hover:opacity-100 transition">Write &rarr;</span>
                </div>
              </div>
            ))}
          </div>
          <button 
            onClick={() => setStep(1)}
            className="text-xs text-gray-500 hover:text-white mt-4"
          >
            &larr; Back to Categories
          </button>
        </div>
      )}

      {/* STEP 3: METADATA */}
      {step === 3 && (
        <div className="text-center py-12">
          <div className="flex justify-center mb-4">
            <div className="relative">
              <FiTag className="text-4xl text-blue-500 animate-pulse" />
              <FiLoader className="animate-spin absolute -top-2 -right-2 text-custom-orange" />
            </div>
          </div>
          <h4 className="text-lg font-medium text-white mb-2">Researching Topic...</h4>
          <p className="text-gray-400 text-sm">Generating SEO titles, keywords, and summary.</p>
        </div>
      )}

      {/* STEP 4: WRITING CONTENT */}
      {step === 4 && (
        <div className="text-center py-12">
          <div className="flex justify-center mb-4">
            <div className="relative">
              <FiFileText className="text-4xl text-green-500 animate-pulse" />
              <FiLoader className="animate-spin absolute -top-2 -right-2 text-custom-orange" />
            </div>
          </div>
          <h4 className="text-lg font-medium text-white mb-2">Writing Article...</h4>
          <p className="text-gray-400 text-sm">Drafting the main content (~500 words).</p>
        </div>
      )}

      {/* STEP 5: GENERATING IMAGE */}
      {step === 5 && (
        <div className="text-center py-12">
          <div className="flex justify-center mb-4">
            <div className="relative">
              <FiImage className="text-4xl text-purple-500 animate-pulse" />
              <FiLoader className="animate-spin absolute -top-2 -right-2 text-custom-orange" />
            </div>
          </div>
          <h4 className="text-lg font-medium text-white mb-2">Creating Visuals...</h4>
          <p className="text-gray-400 text-sm">Generating a unique DALL-E image.</p>
          <p className="text-gray-500 text-xs mt-4">Note: This may take up to 20 seconds.</p>
        </div>
      )}

    </div>
  );
}
