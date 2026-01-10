'use client';

import React, { useState } from 'react';
import { FiCpu, FiLoader, FiCheck, FiRefreshCw, FiImage } from 'react-icons/fi';
import axios from 'axios';
import { toast } from 'react-hot-toast';

export default function AIBlogGenerator({ onBlogGenerated, onClose }) {
  const [step, setStep] = useState(1); // 1: Input, 2: Select Topic, 3: Writing Text, 4: Generating Image
  const [category, setCategory] = useState('General Used Cars');
  const [topics, setTopics] = useState([]);
  const [selectedTopic, setSelectedTopic] = useState('');
  const [loading, setLoading] = useState(false);
  
  // New state to hold partial results
  const [partialBlogData, setPartialBlogData] = useState(null);

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
      const response = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/api/blogs/generate-topics`, {
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
    setStep(3); // Start with Text Generation
    
    try {
      // 1. Generate Text (Fast)
      const textResponse = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/api/blogs/generate-text`, {
        topic
      }, {
        withCredentials: true
      });
      
      const blogData = textResponse.data;
      setPartialBlogData(blogData);
      
      // 2. Move to Image Generation
      setStep(4);
      
      // 3. Generate Image (Slow)
      try {
        const imageResponse = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/api/blogs/generate-image`, {
          title: blogData.title // Use the generated title for better context
        }, {
          withCredentials: true
        });
        
        // Success: Add image to data
        blogData.featuredImage = imageResponse.data.featuredImage;
        
      } catch (imgError) {
        console.error("Image generation failed:", imgError);
        toast.error("Image generation failed, but content is ready.");
        // Continue without image
      }

      // 4. Finalize
      onBlogGenerated(blogData);
      toast.success('Blog content generated successfully!');
      onClose();

    } catch (error) {
      console.error(error);
      toast.error(error.response?.data?.message || 'Failed to generate content. Please try again.');
      setStep(2); // Go back on critical failure
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

      {/* STEP 3: WRITING TEXT */}
      {step === 3 && (
        <div className="text-center py-12">
          <div className="flex justify-center mb-4">
            <FiLoader className="animate-spin text-4xl text-custom-orange" />
          </div>
          <h4 className="text-lg font-medium text-white mb-2">Writing article...</h4>
          <p className="text-gray-400 text-sm">The AI is researching "{selectedTopic}" and writing the content.</p>
        </div>
      )}

      {/* STEP 4: GENERATING IMAGE */}
      {step === 4 && (
        <div className="text-center py-12">
          <div className="flex justify-center mb-4">
            <div className="relative">
              <FiImage className="text-4xl text-purple-500 animate-pulse" />
              <FiLoader className="animate-spin absolute -top-2 -right-2 text-custom-orange" />
            </div>
          </div>
          <h4 className="text-lg font-medium text-white mb-2">Designing visual...</h4>
          <p className="text-gray-400 text-sm">Generating a unique, copyright-free image for your blog.</p>
          <p className="text-gray-500 text-xs mt-4">This takes about 20-30 seconds.</p>
        </div>
      )}

    </div>
  );
}
