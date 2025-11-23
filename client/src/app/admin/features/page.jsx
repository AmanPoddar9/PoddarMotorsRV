'use client'
import { useState, useEffect } from 'react'
import axios from 'axios'
import AdminNavbar from '../../components/AdminNavbar'

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
    <div className="min-h-screen bg-custom-black">
      <AdminNavbar />
      <div className="max-w-3xl mx-auto py-8 px-4 min-h-[70vh]">
        <h1 className="text-3xl font-bold mb-6 text-white">Manage Features</h1>
        <div className="mb-6 bg-custom-jet p-6 rounded-lg border border-white/10">
          <input
            type="text"
            value={newFeatureText}
            onChange={(e) => setNewFeatureText(e.target.value)}
            className="w-full border border-white/10 rounded-md py-2 px-4 bg-custom-black text-white placeholder-gray-500"
            placeholder="Enter new feature"
          />
          <button
            onClick={handleAddFeature}
            className="mt-2 bg-custom-accent hover:bg-yellow-400 text-custom-black font-semibold py-2 px-4 rounded-md transition-colors"
          >
            Add Feature
          </button>
        </div>
        <ul className="space-y-4">
          {features.map((feature) => (
            <li
              key={feature._id}
              className="flex justify-between items-center border border-white/10 bg-custom-jet p-4 rounded-lg"
            >
              <span className="text-white">{feature.text}</span>
              <button
                onClick={() => handleDeleteFeature(feature._id)}
                className="text-red-500 hover:text-red-400 font-semibold transition-colors"
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
