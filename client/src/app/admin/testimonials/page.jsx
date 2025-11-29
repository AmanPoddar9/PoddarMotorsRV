'use client'
import { useState, useEffect } from 'react'
import axios from 'axios'
import AdminNavbar from '../../components/AdminNavbar'

const Testimonials = () => {
  const [testimonials, setTestimonials] = useState([])
  const [newTestimonialText, setNewTestimonialText] = useState('')
  const [newTestimonialName, setNewTestimonialName] = useState('')

  useEffect(() => {
    fetchTestimonials()
  }, [])
  let url = 'https://poddar-motors-rv-hkxu.vercel.app/'
  // url = 'http://localhost:5000/'

  const fetchTestimonials = async () => {
    try {
      const response = await axios.get(url + 'api/testimonials')
      // API returns { success: true, data: [...] }
      setTestimonials(response.data.data || [])
    } catch (error) {
      console.error('Error fetching testimonials:', error)
      setTestimonials([]) // Set empty array on error
    }
  }

  const handleDeleteTestimonial = async (id) => {
    try {
      await axios.delete(url + `api/testimonials/${id}`)
      fetchTestimonials()
    } catch (error) {
      console.error('Error deleting testimonial:', error)
    }
  }

  const handleAddTestimonial = async () => {
    try {
      await axios.post(url + 'api/testimonials', {
        text: newTestimonialText,
        name: newTestimonialName,
      })
      setNewTestimonialText('')
      setNewTestimonialName('')
      fetchTestimonials()
    } catch (error) {
      console.error('Error adding testimonial:', error)
    }
  }

  return (
    <div className="min-h-screen bg-custom-black">
      <AdminNavbar />
      <div className="max-w-3xl mx-auto py-8 px-4 min-h-[70vh]">
        <h1 className="text-3xl font-bold mb-6 text-white">Manage Testimonials</h1>
        <div className="mb-6 bg-custom-jet p-6 rounded-lg border border-white/10">
          <input
            type="text"
            value={newTestimonialText}
            onChange={(e) => setNewTestimonialText(e.target.value)}
            className="w-full border border-white/10 rounded-md py-2 px-4 mb-2 bg-custom-black text-white placeholder-gray-500"
            placeholder="Enter new testimonial"
          />
          <input
            type="text"
            value={newTestimonialName}
            onChange={(e) => setNewTestimonialName(e.target.value)}
            className="w-full border border-white/10 rounded-md py-2 px-4 mb-2 bg-custom-black text-white placeholder-gray-500"
            placeholder="Enter name (optional)"
          />
          <button
            onClick={handleAddTestimonial}
            className="bg-custom-accent hover:bg-yellow-400 text-custom-black font-bold py-2 px-4 rounded-md mt-2 transition-colors"
          >
            Add Testimonial
          </button>
        </div>
        <ul className="space-y-4">
          {testimonials.map((testimonial) => (
            <li
              key={testimonial._id}
              className="flex justify-between items-center border border-white/10 bg-custom-jet p-4 rounded-lg"
            >
              <div>
                <p className="text-white">{testimonial.text}</p>
                <p className="text-custom-platinum text-sm mt-1">- {testimonial.name}</p>
              </div>
              <button
                onClick={() => handleDeleteTestimonial(testimonial._id)}
                className="text-red-500 hover:text-red-400 font-semibold ml-4 transition-colors"
              >
                Delete
              </button>
            </li>
          ))}
        </ul>
      </div>
    </div>
  )
}

export default Testimonials
