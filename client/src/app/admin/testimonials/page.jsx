'use client'
import { useState, useEffect } from 'react'
import axios from 'axios'
import AdminNavbar from '@/app/components/AdminNavbar'

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
      setTestimonials(response.data)
    } catch (error) {
      console.error('Error fetching testimonials:', error)
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
    <div>
      <AdminNavbar />
      <div className="max-w-3xl mx-auto py-8 px-4 min-h-[70vh]">
        <h1 className="text-3xl font-bold mb-6">Manage Testimonials</h1>
        <div className="mb-6">
          <input
            type="text"
            value={newTestimonialText}
            onChange={(e) => setNewTestimonialText(e.target.value)}
            className="w-full border border-gray-300 rounded-md py-2 px-4 mb-2"
            placeholder="Enter new testimonial"
          />
          <input
            type="text"
            value={newTestimonialName}
            onChange={(e) => setNewTestimonialName(e.target.value)}
            className="w-full border border-gray-300 rounded-md py-2 px-4 mb-2"
            placeholder="Enter name (optional)"
          />
          <button
            onClick={handleAddTestimonial}
            className="bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-4 rounded-md"
          >
            Add Testimonial
          </button>
        </div>
        <ul>
          {testimonials.map((testimonial) => (
            <li
              key={testimonial._id}
              className="flex justify-between items-center border-b border-gray-300 py-2"
            >
              <div>
                <p>{testimonial.text}</p>
                <p className="text-gray-500">{testimonial.name}</p>
              </div>
              <button
                onClick={() => handleDeleteTestimonial(testimonial._id)}
                className="text-red-500 hover:text-red-600"
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
