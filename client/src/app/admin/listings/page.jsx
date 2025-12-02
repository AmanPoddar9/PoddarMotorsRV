'use client'
import React, { useState, useEffect } from 'react'
import Link from 'next/link'
import axios from 'axios'
import API_URL from '../../config/api'
import AdminNavbar from '../../components/AdminNavbar'
import { Oval } from 'react-loader-spinner'
import { Button, Input, Spin, Select, Slider } from 'antd'
import { FiFilter, FiX } from 'react-icons/fi'

const { Option } = Select

const Listings = () => {
  const [listings, setListings] = useState([])
  const [filteredListings, setFilteredListings] = useState([])
  const [loading, setLoading] = useState(false)
  const [deleting, setDeleting] = useState(null)
  
  // Filter states
  const [searchQuery, setSearchQuery] = useState('')
  const [priceRange, setPriceRange] = useState([0, 3000000])
  const [yearRange, setYearRange] = useState([2010, 2025])
  const [kmRange, setKmRange] = useState([0, 200000])
  const [fuelType, setFuelType] = useState('all')
  const [transmission, setTransmission] = useState('all')
  const [bodyType, setBodyType] = useState('all')
  
  // Sorting & Pagination
  const [sortBy, setSortBy] = useState('dateNewest')
  const [currentPage, setCurrentPage] = useState(1)
  const [showFilters, setShowFilters] = useState(true)
  const itemsPerPage = 20

  useEffect(() => {
    fetchListings()
  }, [])

  useEffect(() => {
    applyFiltersAndSort()
  }, [listings, searchQuery, priceRange, yearRange, kmRange, fuelType, transmission, bodyType, sortBy])

  const fetchListings = async () => {
    try {
      setLoading(true)
      const response = await axios.get(`${API_URL}/api/listings`)
      setListings(response.data)
      setLoading(false)
    } catch (error) {
      console.error('Error fetching listings:', error)
      setLoading(false)
    }
  }

  const applyFiltersAndSort = () => {
    let filtered = [...listings]

    // Search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase()
      filtered = filtered.filter(
        (item) =>
          item.brand?.toLowerCase().includes(query) ||
          item.model?.toLowerCase().includes(query) ||
          item.vehicleNumber?.toLowerCase().includes(query)
      )
    }

    // Price filter
    filtered = filtered.filter(
      (item) => item.price >= priceRange[0] && item.price <= priceRange[1]
    )

    // Year filter
    filtered = filtered.filter(
      (item) => item.year >= yearRange[0] && item.year <= yearRange[1]
    )

    // Kilometers filter
    filtered = filtered.filter(
      (item) => item.kmDriven >= kmRange[0] && item.kmDriven <= kmRange[1]
    )

    // Fuel type filter
    if (fuelType !== 'all') {
      filtered = filtered.filter((item) => item.fuelType?.toLowerCase() === fuelType.toLowerCase())
    }

    // Transmission filter
    if (transmission !== 'all') {
      filtered = filtered.filter((item) => item.transmissionType?.toLowerCase() === transmission.toLowerCase())
    }

    // Body type filter
    if (bodyType !== 'all') {
      filtered = filtered.filter((item) => item.type?.toLowerCase() === bodyType.toLowerCase())
    }

    // Sorting
    switch (sortBy) {
      case 'dateNewest':
        filtered.sort((a, b) => new Date(b.createdAt || 0) - new Date(a.createdAt || 0))
        break
      case 'dateOldest':
        filtered.sort((a, b) => new Date(a.createdAt || 0) - new Date(b.createdAt || 0))
        break
      case 'priceLow':
        filtered.sort((a, b) => a.price - b.price)
        break
      case 'priceHigh':
        filtered.sort((a, b) => b.price - a.price)
        break
      case 'yearNew':
        filtered.sort((a, b) => b.year - a.year)
        break
      case 'yearOld':
        filtered.sort((a, b) => a.year - b.year)
        break
      case 'kmLow':
        filtered.sort((a, b) => a.kmDriven - b.kmDriven)
        break
      case 'kmHigh':
        filtered.sort((a, b) => b.kmDriven - a.kmDriven)
        break
      case 'brandAZ':
        filtered.sort((a, b) => a.brand?.localeCompare(b.brand))
        break
      case 'brandZA':
        filtered.sort((a, b) => b.brand?.localeCompare(a.brand))
        break
      default:
        break
    }

    setFilteredListings(filtered)
    setCurrentPage(1) // Reset to first page when filters change
  }

  const clearAllFilters = () => {
    setSearchQuery('')
    setPriceRange([0, 3000000])
    setYearRange([2010, 2025])
    setKmRange([0, 200000])
    setFuelType('all')
    setTransmission('all')
    setBodyType('all')
  }

  const deleteListing = async (id) => {
    try {
      setDeleting(id)
      await axios.delete(`${API_URL}/api/listings/${id}`)
      fetchListings()
    } catch (error) {
      console.error('Error deleting listing:', error)
      setDeleting(null)
    }
  }

  const goToUpdate = (id) => {
    window.location.href = './update/' + id
  }

  // Pagination
  const totalPages = Math.ceil(filteredListings.length / itemsPerPage)
  const paginatedListings = filteredListings.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  )

  const formatPrice = (price) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0,
    }).format(price)
  }

  return (
    <div className="min-h-screen bg-custom-black">
      <AdminNavbar />

      <div className="container mx-auto mt-8 px-4 pb-8">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold text-white">Listings</h1>
          <Link
            className="bg-custom-accent hover:bg-yellow-400 text-custom-black font-bold py-2 px-4 rounded transition-colors"
            href="/admin/create-listing"
          >
            + Create New Listing
          </Link>
        </div>

        {/* Summary Bar */}
        <div className="bg-custom-jet rounded-lg p-4 mb-6 flex flex-wrap gap-4 items-center justify-between border border-white/10">
          <div className="flex gap-6 text-custom-platinum">
            <span>
              Total: <span className="text-white font-bold">{listings.length}</span>
            </span>
            <span>
              Filtered: <span className="text-custom-yellow font-bold">{filteredListings.length}</span>
            </span>
          </div>
          
          <div className="flex gap-4 items-center flex-wrap">
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="md:hidden bg-custom-accent hover:bg-yellow-400 text-custom-black font-bold py-2 px-4 rounded transition-colors flex items-center gap-2"
            >
              <FiFilter /> {showFilters ? 'Hide' : 'Show'} Filters
            </button>
            
            <Select
              value={sortBy}
              onChange={setSortBy}
              style={{ width: 220 }}
              className="custom-select"
            >
              <Option value="dateNewest">Date Added (Newest)</Option>
              <Option value="dateOldest">Date Added (Oldest)</Option>
              <Option value="priceLow">Price (Low to High)</Option>
              <Option value="priceHigh">Price (High to Low)</Option>
              <Option value="yearNew">Year (Newest)</Option>
              <Option value="yearOld">Year (Oldest)</Option>
              <Option value="kmLow">Kilometers (Low to High)</Option>
              <Option value="kmHigh">Kilometers (High to Low)</Option>
              <Option value="brandAZ">Brand (A-Z)</Option>
              <Option value="brandZA">Brand (Z-A)</Option>
            </Select>
          </div>
        </div>

        <div className="flex gap-6">
          {/* Filter Sidebar */}
          <div className={`${showFilters ? 'block' : 'hidden'} md:block w-full md:w-80 flex-shrink-0`}>
            <div className="bg-custom-jet rounded-lg p-6 border border-white/10 sticky top-4">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-bold text-white">Filters</h2>
                <button
                  onClick={clearAllFilters}
                  className="text-sm text-custom-accent hover:text-yellow-400 transition-colors flex items-center gap-1"
                >
                  <FiX /> Clear All
                </button>
              </div>

              <div className="space-y-6">
                {/* Search */}
                <div>
                  <label className="block text-custom-platinum mb-2 text-sm">Search</label>
                  <Input
                    placeholder="Brand, model, reg. no."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    style={{ backgroundColor: '#1a1a1a', color: 'white', borderColor: 'rgba(255,255,255,0.1)' }}
                  />
                </div>

                {/* Price Range */}
                <div>
                  <label className="block text-custom-platinum mb-2 text-sm">
                    Price Range: {formatPrice(priceRange[0])} - {formatPrice(priceRange[1])}
                  </label>
                  <Slider
                    range
                    min={0}
                    max={3000000}
                    step={50000}
                    value={priceRange}
                    onChange={setPriceRange}
                  />
                </div>

                {/* Year Range */}
                <div>
                  <label className="block text-custom-platinum mb-2 text-sm">
                    Year: {yearRange[0]} - {yearRange[1]}
                  </label>
                  <Slider
                    range
                    min={2010}
                    max={2025}
                    value={yearRange}
                    onChange={setYearRange}
                  />
                </div>

                {/* Kilometers Range */}
                <div>
                  <label className="block text-custom-platinum mb-2 text-sm">
                    Kilometers: {kmRange[0].toLocaleString()} - {kmRange[1].toLocaleString()} km
                  </label>
                  <Slider
                    range
                    min={0}
                    max={200000}
                    step={5000}
                    value={kmRange}
                    onChange={setKmRange}
                  />
                </div>

                {/* Fuel Type */}
                <div>
                  <label className="block text-custom-platinum mb-2 text-sm">Fuel Type</label>
                  <Select
                    value={fuelType}
                    onChange={setFuelType}
                    style={{ width: '100%' }}
                  >
                    <Option value="all">All</Option>
                    <Option value="petrol">Petrol</Option>
                    <Option value="diesel">Diesel</Option>
                    <Option value="cng">CNG</Option>
                    <Option value="electric">Electric</Option>
                  </Select>
                </div>

                {/* Transmission */}
                <div>
                  <label className="block text-custom-platinum mb-2 text-sm">Transmission</label>
                  <Select
                    value={transmission}
                    onChange={setTransmission}
                    style={{ width: '100%' }}
                  >
                    <Option value="all">All</Option>
                    <Option value="manual">Manual</Option>
                    <Option value="automatic">Automatic</Option>
                  </Select>
                </div>

                {/* Body Type */}
                <div>
                  <label className="block text-custom-platinum mb-2 text-sm">Body Type</label>
                  <Select
                    value={bodyType}
                    onChange={setBodyType}
                    style={{ width: '100%' }}
                  >
                    <Option value="all">All</Option>
                    <Option value="hatchback">Hatchback</Option>
                    <Option value="sedan">Sedan</Option>
                    <Option value="suv">SUV</Option>
                    <Option value="muv">MUV</Option>
                  </Select>
                </div>
              </div>
            </div>
          </div>

          {/* Listings Grid */}
          <div className="flex-1">
            {loading ? (
              <div className="flex items-center justify-center p-10">
                <Oval color="#F59E0B" height={50} width={50} secondaryColor="#78350f" />
              </div>
            ) : paginatedListings.length === 0 ? (
              <div className="bg-custom-jet rounded-lg p-12 text-center border border-white/10">
                <p className="text-custom-platinum text-lg">No listings found matching your filters.</p>
                <button
                  onClick={clearAllFilters}
                  className="mt-4 text-custom-accent hover:text-yellow-400 transition-colors"
                >
                  Clear all filters
                </button>
              </div>
            ) : (
              <>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {paginatedListings.map((listing) => (
                    <div key={listing._id} className="bg-custom-jet rounded-lg overflow-hidden border border-white/10 hover:border-white/30 transition-all">
                      <img
                        src={listing.images?.[0]}
                        alt={`${listing.brand} ${listing.model}`}
                        className="w-full h-48 object-cover"
                      />
                      <div className="p-4">
                        <h3 className="text-lg font-bold text-white mb-2">
                          {listing.brand} {listing.model}
                        </h3>
                        <div className="text-sm text-custom-platinum space-y-1 mb-3">
                          <p>{listing.year} | {listing.kmDriven?.toLocaleString()} km | {listing.fuelType}</p>
                          <p>{listing.transmissionType} | {listing.type}</p>
                          <p className="text-custom-accent font-mono">{listing.vehicleNumber}</p>
                        </div>
                        <p className="text-2xl font-bold text-custom-yellow mb-4">
                          {formatPrice(listing.price)}
                        </p>
                        <div className="flex gap-2">
                          <button
                            onClick={() => goToUpdate(listing._id)}
                            className="flex-1 bg-custom-accent hover:bg-yellow-400 text-custom-black font-bold py-2 px-4 rounded transition-colors"
                          >
                            Update
                          </button>
                          <button
                            onClick={() => deleteListing(listing._id)}
                            className="flex-1 bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-4 rounded transition-colors"
                            disabled={deleting === listing._id}
                          >
                            {deleting === listing._id ? <Spin size="small" /> : 'Delete'}
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Pagination */}
                {totalPages > 1 && (
                  <div className="mt-8 flex justify-center gap-2">
                    <button
                      onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                      disabled={currentPage === 1}
                      className="px-4 py-2 bg-custom-jet text-white rounded border border-white/10 hover:border-white/30 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                    >
                      Previous
                    </button>
                    <span className="px-4 py-2 bg-custom-jet text-white rounded border border-white/10">
                      Page {currentPage} of {totalPages}
                    </span>
                    <button
                      onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
                      disabled={currentPage === totalPages}
                      className="px-4 py-2 bg-custom-jet text-white rounded border border-white/10 hover:border-white/30 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                    >
                      Next
                    </button>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default Listings
