'use client'
import { useState, useEffect } from 'react'
import axios from 'axios'
import AdminNavbar from '@/app/components/AdminNavbar'

const Features = () => {
  const [features, setFeatures] = useState([])
  const [newFeatureText, setNewFeatureText] = useState('')
  let url = 'https://poddar-motors-rv-hkxu.vercel.app/'

  useEffect(() => {
    fetchFeatures()
  }, [])

  const fetchFeatures = async () => {
    try {
      const response = await axios.get(url + 'api/features')
      setFeatures(response.data)
    } catch (error) {
      console.error('Error fetching features:', error)
    }
  }

  const handleDeleteFeature = async (id) => {
    try {
      await axios.delete(url + `api/features/${id}`)
      fetchFeatures()
    } catch (error) {
      console.error('Error deleting feature:', error)
    }
  }

  const handleAddFeature = async () => {
    try {
      await axios.post(url + 'api/features', {
        text: newFeatureText,
      })
      setNewFeatureText('')
      fetchFeatures()
    } catch (error) {
      console.error('Error adding feature:', error)
    }
  }

  return (
    <div>
      <AdminNavbar />
      <div className="max-w-3xl mx-auto py-8 px-4 min-h-[70vh]">
        <h1 className="text-3xl font-bold mb-6">Manage Features</h1>
        <div className="mb-6">
          <input
            type="text"
            value={newFeatureText}
            onChange={(e) => setNewFeatureText(e.target.value)}
            className="w-full border border-gray-300 rounded-md py-2 px-4"
            placeholder="Enter new feature"
          />
          <button
            onClick={handleAddFeature}
            className="mt-2 bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-4 rounded-md"
          >
            Add Feature
          </button>
        </div>
        <ul>
          {features.map((feature) => (
            <li
              key={feature._id}
              className="flex justify-between items-center border-b border-gray-300 py-2"
            >
              <span>{feature.text}</span>
              <button
                onClick={() => handleDeleteFeature(feature._id)}
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

export default Features
