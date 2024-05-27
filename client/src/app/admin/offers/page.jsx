'use client'
import { useState, useEffect } from 'react'
import axios from 'axios'
import AdminNavbar from '@/app/components/AdminNavbar'

const Offers = () => {
  const [offers, setOffers] = useState([])
  const [newOfferImage, setNewOfferImage] = useState(null)
  const [uploading, setUploading] = useState(false)
  let url = 'https://poddar-motors-rv-hkxu.vercel.app/'
  // url = 'http://localhost:5000/'

  useEffect(() => {
    fetchOffers()
  }, [])

  const fetchOffers = async () => {
    try {
      const response = await axios.get(url + 'api/offers')
      setOffers(response.data)
    } catch (error) {
      console.error('Error fetching offers:', error)
    }
  }

  const handleDeleteOffer = async (id) => {
    try {
      await axios.delete(url + `api/offers/${id}`)
      fetchOffers()
    } catch (error) {
      console.error('Error deleting offer:', error)
    }
  }

  const handleImageChange = (e) => {
    setNewOfferImage(e.target.files[0])
  }

  const handleAddOffer = async () => {
    if (!newOfferImage) return
    try {
      setUploading(true)
      const formData = new FormData()
      formData.append('image', newOfferImage)
      await axios.post(url + 'api/offers', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      })
      setNewOfferImage(null)
      fetchOffers()
      window.location.reload()
    } catch (error) {
      console.error('Error adding offer:', error)
    } finally {
      setUploading(false)
    }
  }

  return (
    <div>
      <AdminNavbar />
      <div className="max-w-3xl mx-auto py-8 px-4 min-h-[70vh]">
        <h1 className="text-3xl font-bold mb-6">Manage Offers</h1>
        <div className="mb-6">
          <input
            type="file"
            onChange={handleImageChange}
            className="border border-gray-300 rounded-md py-2 px-4 mb-2"
            id="offer-file"
          />
          <button
            onClick={handleAddOffer}
            disabled={!newOfferImage || uploading}
            className={`bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-4 rounded-md ${
              uploading ? 'opacity-50 cursor-not-allowed' : ''
            }`}
          >
            {uploading ? 'Uploading...' : 'Add Offer'}
          </button>
        </div>
        <ul>
          {offers.map((offer) => (
            <li
              key={offer._id}
              className="flex justify-between items-center border-b border-gray-300 py-2"
            >
              <img src={offer.image} alt="Offer" className="h-20 w-auto" />
              <button
                onClick={() => handleDeleteOffer(offer._id)}
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

export default Offers
