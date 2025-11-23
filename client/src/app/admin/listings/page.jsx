'use client'
import React, { useState, useEffect } from 'react'
import Link from 'next/link'
import axios from 'axios'
import AdminNavbar from '../../components/AdminNavbar'
import { Oval } from 'react-loader-spinner'
import { Button, Input, Spin } from 'antd'

const Listings = () => {
  const [listings, setListings] = useState([])
  const [filteredListings, setFilteredListings] = useState([])
  const [loading, setLoading] = useState(false)
  const [filterString, setFilterString] = useState([])
  const [deleting, setDeleting] = useState(null)

  let url = 'https://poddar-motors-rv-hkxu.vercel.app/'
  // url = 'http://localhost:5000/'
  useEffect(() => {
    fetchListings()
  }, [])

  const fetchListings = async () => {
    try {
      setLoading(true)
      const response = await axios.get(url + 'api/listings')
      setListings(response.data)
      setFilteredListings(response.data)
      setLoading(false)
    } catch (error) {
      console.error('Error fetching listings:', error)
    }
  }

  const deleteListing = async (id) => {
    try {
      setDeleting(id)
      await axios.delete(url + `api/listings/${id}`)
      fetchListings()
    } catch (error) {
      console.error('Error deleting listing:', error)
    }
  }
  const goToUpdate = (id) => {
    window.location.href = './update/' + id
  }
  const filterSearch = () => {
    if (filterString.length == 0) {
      setFilteredListings(listings)
      return
    }
    let tempArr = [...listings]
    const tempFilterString = filterString.toLowerCase()
    tempArr = tempArr.filter(
      (item) =>
        item.brand.toLowerCase().includes(tempFilterString) ||
        item.model.toLowerCase().includes(tempFilterString) ||
        item.vehicleNumber.toLowerCase().includes(tempFilterString),
    )
    setFilteredListings(tempArr)
  }
  return (
    <div className="min-h-screen bg-custom-black">
      <AdminNavbar />

      <div className="container mx-auto mt-8 min-h-[70vh] px-4">
        <h1 className="text-3xl font-bold mb-4 text-white">Listings</h1>
        <Link
          className="bg-custom-accent hover:bg-yellow-400 text-custom-black font-bold py-2 px-4 mb-4 rounded inline-block transition-colors"
          href="/admin/create-listing"
        >
          Create New Listing
        </Link>
        <div className="mb-4 flex flex-wrap gap-4">
          <Input
            placeholder="Search by brand, model, reg. no."
            style={{ width: '70%', backgroundColor: '#1a1a1a', color: 'white', borderColor: 'rgba(255,255,255,0.1)' }}
            onChange={(e) => setFilterString(e.target.value)}
            value={filterString}
            className="hover:border-custom-accent focus:border-custom-accent"
          />
          <button
            onClick={() => filterSearch()}
            className="bg-custom-accent hover:bg-yellow-400 text-custom-black font-bold py-2 px-4 rounded inline-block transition-colors"
          >
            Search
          </button>
          <button
            onClick={() => {
              setFilteredListings(listings)
              setFilterString('')
            }}
            className="bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-4 rounded inline-block transition-colors"
          >
            Clear
          </button>
        </div>
        <div className="my-4 text-custom-platinum">Total Listings: {filteredListings.length}</div>

        {loading ? (
          <div className="flex items-center justify-center p-10">
            <Oval
              color="#F59E0B"
              height={50}
              width={50}
              secondaryColor="#78350f"
            />
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredListings.map((listing) => (
              <div key={listing._id} className="bg-custom-jet p-4 rounded-lg border border-white/10">
                <img
                  src={listing.images[0]}
                  alt={listing.brand}
                  className="w-full h-32 object-cover mb-4 rounded"
                />
                <p className="text-lg font-semibold text-white">
                  {listing.brand} {listing.model}
                </p>
                <p className="text-custom-platinum">{listing.vehicleNumber}</p>
                <div className="flex gap-4 mt-4">
                  <button
                    onClick={() => deleteListing(listing._id)}
                    className="bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-4 rounded inline-block transition-colors"
                  >
                    {deleting == listing._id ? (
                      <>
                        <Spin size="small" />
                      </>
                    ) : (
                      'Delete'
                    )}
                  </button>

                  <button
                    onClick={() => goToUpdate(listing._id)}
                    className="bg-custom-accent hover:bg-yellow-400 text-custom-black font-bold py-2 px-4 rounded inline-block transition-colors"
                  >
                    Update
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

export default Listings
