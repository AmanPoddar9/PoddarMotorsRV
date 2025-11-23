'use client'
import { useState, useEffect } from 'react'
import axios from 'axios'
import AdminNavbar from '../../components/AdminNavbar'

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
    <div className="min-h-screen bg-custom-black">
      <AdminNavbar />
      <div className="max-w-3xl mx-auto py-8 px-4 min-h-[70vh]">
        <h1 className="text-3xl font-bold mb-6 text-white">Manage Offers</h1>
        <div className="mb-6 bg-custom-jet p-6 rounded-lg border border-white/10">
          <input
            type="file"
            onChange={handleImageChange}
            className="border border-white/10 rounded-md py-2 px-4 mb-2 w-full text-custom-platinum bg-custom-black file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-custom-accent file:text-custom-black hover:file:bg-yellow-400"
            id="offer-file"
          />
          <button
            onClick={handleAddOffer}
            disabled={!newOfferImage || uploading}
            className={`bg-custom-accent hover:bg-yellow-400 text-custom-black font-bold py-2 px-4 rounded-md mt-2 transition-colors ${
              uploading ? 'opacity-50 cursor-not-allowed' : ''
            }`}
          >
            {uploading ? 'Uploading...' : 'Add Offer'}
          </button>
        </div>
        <ul className="space-y-4">
          {offers.map((offer) => (
            <li
              key={offer._id}
              className="flex justify-between items-center border border-white/10 bg-custom-jet p-4 rounded-lg"
            >
              <img src={offer.image} alt="Offer" className="h-20 w-auto rounded" />
              <button
                onClick={() => handleDeleteOffer(offer._id)}
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

export default Offers
