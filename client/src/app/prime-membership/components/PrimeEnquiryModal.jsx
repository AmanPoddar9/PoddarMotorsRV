'use client';
import { useState } from 'react';
import { FaTimes, FaSpinner } from 'react-icons/fa';
import { message } from 'antd';
import axios from 'axios';

const PrimeEnquiryModal = ({ isOpen, onClose, selectedPlan }) => {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    carModel: '',
    registrationNumber: ''
  });

  if (!isOpen) return null;

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      // Validate required fields
      if (!formData.name || !formData.phone) {
        message.error('Please fill in required fields');
        setLoading(false);
        return;
      }

      // API Call
      const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000';
      const endpoint = `${API_BASE_URL}/api/prime-enquiry`;
      
      await axios.post(endpoint, {
        ...formData,
        selectedPlan: selectedPlan?.name || 'Unknown' 
      });

      message.success('Thank you! We will contact you shortly.');
      onClose();
      setFormData({
        name: '',
        phone: '',
        email: '',
        carModel: '',
        registrationNumber: ''
      });
    } catch (error) {
      console.error(error);
      message.error('Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
      <div className="bg-white rounded-2xl w-full max-w-md overflow-hidden shadow-2xl animate-fade-in relative">
        
        {/* Close Button */}
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors"
        >
          <FaTimes size={20} />
        </button>

        {/* Header */}
        <div className="bg-slate-900 p-6 text-white text-center">
          <h3 className="text-xl font-bold">Join {selectedPlan?.name}</h3>
          <p className="text-gray-300 text-sm mt-1">Complete your request below</p>
        </div>

        {/* Form */}
        <div className="p-6">
          <form onSubmit={handleSubmit} className="space-y-4">
            
            {/* Name */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Full Name *</label>
              <input 
                type="text" 
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
                className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-yellow-500 focus:border-transparent outline-none transition-all"
                placeholder="John Doe"
              />
            </div>

            {/* Mobile */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Mobile Number *</label>
              <input 
                type="tel" 
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                required
                pattern="[0-9]{10}"
                className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-yellow-500 focus:border-transparent outline-none transition-all"
                placeholder="10 digit mobile number"
              />
            </div>

            {/* Email */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Email <span className="text-gray-400 font-normal">(Optional)</span></label>
              <input 
                type="email" 
                name="email"
                value={formData.email}
                onChange={handleChange}
                className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-yellow-500 focus:border-transparent outline-none transition-all"
                placeholder="john@example.com"
              />
            </div>

            {/* Car Model */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Car Model</label>
                <input 
                  type="text" 
                  name="carModel"
                  value={formData.carModel}
                  onChange={handleChange}
                  className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-yellow-500 focus:border-transparent outline-none transition-all"
                  placeholder="e.g. Swift"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Reg. Number</label>
                <input 
                  type="text" 
                  name="registrationNumber"
                  value={formData.registrationNumber}
                  onChange={handleChange}
                  className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-yellow-500 focus:border-transparent outline-none transition-all"
                  placeholder="JH01..."
                />
              </div>
            </div>

            {/* Submit Button */}
            <button 
              type="submit" 
              disabled={loading}
              className="w-full py-3 bg-yellow-500 hover:bg-yellow-600 text-black font-bold rounded-lg transition-colors shadow-lg disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2 mt-4"
            >
              {loading ? <FaSpinner className="animate-spin" /> : 'Submit Request'}
            </button>

            <p className="text-xs text-center text-gray-500 mt-2">
              Our team will call you to confirm your membership.
            </p>
          </form>
        </div>
      </div>
    </div>
  );
};

export default PrimeEnquiryModal;
