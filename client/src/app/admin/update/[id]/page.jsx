'use client'
import { useState, useEffect } from 'react'
import axios from 'axios'
import API_URL from '../../../config/api'
import ImageUpload from '../../../components/admin/ImageUpload'

const CreateListing = () => {
  const [features, setFeatures] = useState([])
  const [loading, setLoading] = useState(false)
  const [images, setImages] = useState([])
  const [currListing, setCurrListing] = useState({})

  const [formData, setFormData] = useState({
    brand: '',
    model: '',
    variant: '',
    vehicleNumber: '',
    fuelType: '',
    year: '',
    color: '',
    ownership: '',
    kmDriven: '',
    price: '',
    type: '',
    transmissionType: '',
    seats: '',
    displacement: '',
    cylinders: '',
    maxPower: '',
    bootspace: '',
    fuelTank: '',
    gears: '',
    mileage: '',
    location: '',
    featured: false,
    selectedFeatures: [],
    isFeaturedDeal: false,
    dealEndDate: '',
    originalPrice: '',
    emiStarting: '',
  })
  
  const transmissionTypes = ['AMT', 'CVT', 'DCT', 'TC', 'iMT', 'MT']
  useEffect(() => {
    if (Object.keys(currListing).length) {
      setFormData({
        brand: currListing.brand,
        model: currListing.model,
        variant: currListing.variant,
        vehicleNumber: currListing.vehicleNumber,
        fuelType: currListing.fuelType,
        year: currListing.year,
        color: currListing.color,
        ownership: currListing.ownership,
        kmDriven: currListing.kmDriven,
        price: currListing.price,
        type: currListing.type,
        transmissionType: currListing.transmissionType,
        seats: currListing.seats,
        displacement: currListing.displacement,
        cylinders: currListing.cylinders,
        maxPower: currListing.maxPower,
        bootspace: currListing.bootspace,
        fuelTank: currListing.fuelTank,
        gears: currListing.gears,
        mileage: currListing.mileage,
        location: currListing.location,
        featured: currListing.featured,
        selectedFeatures: currListing.features,
        isFeaturedDeal: currListing.isFeaturedDeal || false,
        dealEndDate: currListing.dealEndDate ? new Date(currListing.dealEndDate).toISOString().slice(0, 16) : '',
        originalPrice: currListing.originalPrice || '',
        emiStarting: currListing.emiStarting || '',
      })
    }
  }, [currListing])
  const getSingleListing = async () => {
    const tempArr = window.location.href.split('/')
    const id = tempArr[tempArr.length - 1]
    const response = await axios.get(`${API_URL}/api/listings/${id}`)
    setCurrListing(response.data)
  }

  const handleImagesChange = (newImages) => {
    setImages(newImages)
  }

  useEffect(() => {
    getSingleListing()
    fetchFeatures()
  }, [])

  const fetchFeatures = async () => {
    try {
      const response = await axios.get(`${API_URL}/api/features`)
      setFeatures(response.data)
    } catch (error) {
      console.error('Error fetching features:', error)
    }
  }

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData({ ...formData, [name]: value })
  }

  const handleCheckboxChange = (e) => {
    const { value, checked } = e.target
    if (checked) {
      setFormData({
        ...formData,
        selectedFeatures: [...formData.selectedFeatures, value],
      })
    } else {
      setFormData({
        ...formData,
        selectedFeatures: formData.selectedFeatures.filter(
          (item) => item !== value,
        ),
      })
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      setLoading(true)
      const tempData = formData
      tempData['features'] = formData['selectedFeatures']
      if (images.length) {
        tempData['images'] = images
      }
      console.log(images)
      setImages([])
      const tempArr = window.location.href.split('/')
      const id = tempArr[tempArr.length - 1]

      await axios.put(`${API_URL}/api/listings/${id}`, tempData, {
        withCredentials: true
      })
      // setFormData({
      //   brand: '',
      //   model: '',
      //   variant: '',
      //   vehicleNumber: '',
      //   fuelType: '',
      //   year: '',
      //   color: '',
      //   ownership: '',
      //   kmDriven: '',
      //   price: '',
      //   type: '',
      //   transmissionType: '',
      //   location: '',
      //   featured: false,
      //   selectedFeatures: []
      // });
      setLoading(false)
      alert('Listing updated successfully')
    } catch (error) {
      setLoading(false)
      console.error('Error creating listing:', error)
    }
  }
  const carTypes = [
    'Micro Car',
    'Hatchback',
    'Compact Sedan',
    'Mid Size Sedan',
    'Full Size Sedan',
    'Compact SUV',
    'Mid Size SUV',
    'Full Size SUV',
    'MUV/MPV',
    'Luxury',
  ]

  return (
    <div className="min-h-screen bg-custom-black text-white">
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-6 text-white">Update Listing</h1>
        <form onSubmit={handleSubmit} className="space-y-4">
          <ImageUpload
            label="Car Images (Optional - only upload if you want to replace current images)"
            onImagesChange={handleImagesChange}
            maxImages={20}
          />
          <div>
            <label htmlFor="brand" className="block font-medium text-gray-700">
              Brand
            </label>
            <input
              type="text"
              id="brand"
              name="brand"
              value={formData.brand}
              onChange={handleInputChange}
              className="mt-1 p-2 w-full border border-white/10 rounded-md bg-custom-jet text-white focus:ring-custom-accent focus:border-custom-accent"
            />
          </div>
          <div>
            <label htmlFor="model" className="block font-medium text-gray-700">
              Model
            </label>
            <input
              type="text"
              id="model"
              name="model"
              value={formData.model}
              onChange={handleInputChange}
              className="mt-1 p-2 w-full border border-white/10 rounded-md bg-custom-jet text-white focus:ring-custom-accent focus:border-custom-accent"
            />
          </div>
          <div>
            <label
              htmlFor="variant"
              className="block font-medium text-custom-platinum"
            >
              Variant
            </label>
            <input
              type="text"
              id="variant"
              name="variant"
              value={formData.variant}
              onChange={handleInputChange}
              className="mt-1 p-2 w-full border border-white/10 rounded-md bg-custom-jet text-white focus:ring-custom-accent focus:border-custom-accent"
            />
          </div>
          <div>
            <label
              htmlFor="vehicleNumber"
              className="block font-medium text-custom-platinum"
            >
              Vehicle Number
            </label>
            <input
              type="text"
              id="vehicleNumber"
              name="vehicleNumber"
              value={formData.vehicleNumber}
              onChange={handleInputChange}
              className="mt-1 p-2 w-full border border-white/10 rounded-md bg-custom-jet text-white focus:ring-custom-accent focus:border-custom-accent"
            />
          </div>
          <div>
            <label
              htmlFor="fuelType"
              className="block font-medium text-custom-platinum"
            >
              Fuel Type
            </label>
            <select
              id="fuelType"
              name="fuelType"
              value={formData.fuelType}
              onChange={handleInputChange}
              className="mt-1 p-2 w-full border border-white/10 rounded-md bg-custom-jet text-white focus:ring-custom-accent focus:border-custom-accent"
            >
              <option value="">Select Fuel Type</option>
              <option value="Petrol">Petrol</option>
              <option value="Diesel">Diesel</option>
              <option value="CNG">CNG</option>
              <option value="EV">EV</option>
              <option value="Hybrid">Hybrid</option>
            </select>
          </div>
          <div>
            <label htmlFor="year" className="block font-medium text-gray-700">
              Year
            </label>
            <input
              type="number"
              id="year"
              name="year"
              min={2000}
              value={formData.year}
              onChange={handleInputChange}
              className="mt-1 p-2 w-full border border-white/10 rounded-md bg-custom-jet text-white focus:ring-custom-accent focus:border-custom-accent"
            />
          </div>
          <div>
            <label htmlFor="color" className="block font-medium text-gray-700">
              Color
            </label>
            <input
              type="text"
              id="color"
              name="color"
              value={formData.color}
              onChange={handleInputChange}
              className="mt-1 p-2 w-full border border-white/10 rounded-md bg-custom-jet text-white focus:ring-custom-accent focus:border-custom-accent"
            />
          </div>
          <div>
            <label
              htmlFor="ownership"
              className="block font-medium text-custom-platinum"
            >
              Ownership
            </label>
            <input
              type="number"
              id="ownership"
              name="ownership"
              min={1}
              value={formData.ownership}
              onChange={handleInputChange}
              className="mt-1 p-2 w-full border border-white/10 rounded-md bg-custom-jet text-white focus:ring-custom-accent focus:border-custom-accent"
            />
          </div>
          <div>
            <label
              htmlFor="kmDriven"
              className="block font-medium text-custom-platinum"
            >
              Kilometers Driven
            </label>
            <input
              type="number"
              id="kmDriven"
              name="kmDriven"
              min={1}
              value={formData.kmDriven}
              onChange={handleInputChange}
              className="mt-1 p-2 w-full border border-white/10 rounded-md bg-custom-jet text-white focus:ring-custom-accent focus:border-custom-accent"
            />
          </div>
          <div>
            <label htmlFor="price" className="block font-medium text-gray-700">
              Price
            </label>
            <input
              type="number"
              id="price"
              name="price"
              min={1}
              value={formData.price}
              onChange={handleInputChange}
              className="mt-1 p-2 w-full border border-white/10 rounded-md bg-custom-jet text-white focus:ring-custom-accent focus:border-custom-accent"
            />
          </div>
          <div>
            <label htmlFor="type" className="block font-medium text-gray-700">
              Type
            </label>
            <select
              id="type"
              name="type"
              value={formData.type}
              onChange={handleInputChange}
              className="mt-1 p-2 w-full border border-white/10 rounded-md bg-custom-jet text-white focus:ring-custom-accent focus:border-custom-accent"
            >
              <option value="">Select Type</option>
              {carTypes.map((type, i) => (
                <option value={type} key={i}>
                  {type}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label
              htmlFor="transmissionType"
              className="block font-medium text-custom-platinum"
            >
              Transmission Type
            </label>
            <select
              id="transmissionType"
              name="transmissionType"
              value={formData.transmissionType}
              onChange={handleInputChange}
              className="mt-1 p-2 w-full border border-white/10 rounded-md bg-custom-jet text-white focus:ring-custom-accent focus:border-custom-accent"
            >
              <option value="">Select Transmission Type</option>
              {transmissionTypes.map((type, i) => (
                <option value={type} key={i}>
                  {type}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label htmlFor="seats" className="block font-medium text-gray-700">
              No. of seats
            </label>
            <input
              type="number"
              id="seats"
              name="seats"
              min={1}
              value={formData.seats}
              onChange={handleInputChange}
              className="mt-1 p-2 w-full border border-white/10 rounded-md bg-custom-jet text-white focus:ring-custom-accent focus:border-custom-accent"
            />
          </div>
          <div>
            <label
              htmlFor="displacement"
              className="block font-medium text-custom-platinum"
            >
              Displacement (CC):
            </label>
            <input
              type="number"
              id="displacement"
              name="displacement"
              min={1}
              value={formData.displacement}
              onChange={handleInputChange}
              className="mt-1 p-2 w-full border border-white/10 rounded-md bg-custom-jet text-white focus:ring-custom-accent focus:border-custom-accent"
            />
          </div>
          <div>
            <label
              htmlFor="cylinders"
              className="block font-medium text-custom-platinum"
            >
              No. of Cylinders:
            </label>
            <input
              type="number"
              id="cylinders"
              name="cylinders"
              min={1}
              value={formData.cylinders}
              onChange={handleInputChange}
              className="mt-1 p-2 w-full border border-white/10 rounded-md bg-custom-jet text-white focus:ring-custom-accent focus:border-custom-accent"
            />
          </div>
          <div>
            <label
              htmlFor="maxPower"
              className="block font-medium text-custom-platinum"
            >
              Max Power (BHP):
            </label>
            <input
              type="number"
              id="maxPower"
              name="maxPower"
              min={1}
              value={formData.maxPower}
              onChange={handleInputChange}
              className="mt-1 p-2 w-full border border-white/10 rounded-md bg-custom-jet text-white focus:ring-custom-accent focus:border-custom-accent"
            />
          </div>
          <div>
            <label
              htmlFor="bootspace"
              className="block font-medium text-custom-platinum"
            >
              Bootspace (Litres):
            </label>
            <input
              type="number"
              id="bootspace"
              name="bootspace"
              min={1}
              value={formData.bootspace}
              onChange={handleInputChange}
              className="mt-1 p-2 w-full border border-white/10 rounded-md bg-custom-jet text-white focus:ring-custom-accent focus:border-custom-accent"
            />
          </div>
          <div>
            <label
              htmlFor="fuelTank"
              className="block font-medium text-custom-platinum"
            >
              Fuel Tank (Litres):
            </label>
            <input
              type="number"
              id="fuelTank"
              name="fuelTank"
              min={1}
              value={formData.fuelTank}
              onChange={handleInputChange}
              className="mt-1 p-2 w-full border border-white/10 rounded-md bg-custom-jet text-white focus:ring-custom-accent focus:border-custom-accent"
            />
          </div>
          <div>
            <label htmlFor="gears" className="block font-medium text-gray-700">
              No. of Gears:
            </label>
            <input
              type="number"
              id="gears"
              name="gears"
              min={1}
              value={formData.gears}
              onChange={handleInputChange}
              className="mt-1 p-2 w-full border border-white/10 rounded-md bg-custom-jet text-white focus:ring-custom-accent focus:border-custom-accent"
            />
          </div>
          <div>
            <label
              htmlFor="mileage"
              className="block font-medium text-custom-platinum"
            >
              Mileage (KMPL):
            </label>
            <input
              type="number"
              id="mileage"
              name="mileage"
              min={1}
              step={0.1}
              value={formData.mileage}
              onChange={handleInputChange}
              className="mt-1 p-2 w-full border border-white/10 rounded-md bg-custom-jet text-white focus:ring-custom-accent focus:border-custom-accent"
            />
          </div>
          <div>
            <label
              htmlFor="location"
              className="block font-medium text-custom-platinum"
            >
              Location
            </label>
            <input
              type="text"
              id="location"
              name="location"
              value={formData.location}
              onChange={handleInputChange}
              className="mt-1 p-2 w-full border border-white/10 rounded-md bg-custom-jet text-white focus:ring-custom-accent focus:border-custom-accent"
            />
          </div>
          <div>
            <label htmlFor="featured" className="flex items-center">
              <input
                type="checkbox"
                id="featured"
                name="featured"
                checked={formData.featured}
                onChange={() =>
                  setFormData({ ...formData, featured: !formData.featured })
                }
                className="mr-2"
              />
              <span className="text-custom-platinum">Featured</span>
            </label>
          </div>
          
          {/* Deal of the Day Section */}
          <div className="border-t border-white/10 pt-6 mt-6">
            <h2 className="text-xl font-semibold text-white mb-4">Deal of the Day Settings</h2>
            
            <div className="mb-4">
              <label htmlFor="isFeaturedDeal" className="flex items-center">
                <input
                  type="checkbox"
                  id="isFeaturedDeal"
                  name="isFeaturedDeal"
                  checked={formData.isFeaturedDeal}
                  onChange={() =>
                    setFormData({ ...formData, isFeaturedDeal: !formData.isFeaturedDeal })
                  }
                  className="mr-2"
                />
                <span className="text-custom-platinum font-medium">Mark as Deal of the Day</span>
              </label>
              <p className="text-sm text-custom-platinum/70 ml-6">This car will appear in the "Deals of the Day" section</p>
            </div>
            
            {formData.isFeaturedDeal && (
              <div className="space-y-4 ml-6 p-4 bg-custom-accent/10 rounded-md border border-custom-accent/20">
                <div>
                  <label htmlFor="dealEndDate" className="block font-medium text-gray-700">
                    Deal End Date & Time
                  </label>
                  <input
                    type="datetime-local"
                    id="dealEndDate"
                    name="dealEndDate"
                    value={formData.dealEndDate}
                    onChange={handleInputChange}
                    className="mt-1 p-2 w-full border border-white/10 rounded-md bg-custom-jet text-white focus:ring-custom-accent focus:border-custom-accent"
                  />
                  <p className="text-sm text-custom-platinum/70 mt-1">Leave empty for 24-hour countdown</p>
                </div>
                
                <div>
                  <label htmlFor="originalPrice" className="block font-medium text-gray-700">
                    Original Price (for discount calculation)
                  </label>
                  <input
                    type="number"
                    id="originalPrice"
                    name="originalPrice"
                    min="0"
                    value={formData.originalPrice}
                    onChange={handleInputChange}
                    placeholder="e.g., 550000"
                    className="mt-1 p-2 w-full border border-white/10 rounded-md bg-custom-jet text-white focus:ring-custom-accent focus:border-custom-accent"
                  />
                  <p className="text-sm text-custom-platinum/70 mt-1">Used to show discount percentage (leave empty to hide)</p>
                </div>
                
                <div>
                  <label htmlFor="emiStarting" className="block font-medium text-gray-700">
                    EMI Starting From
                  </label>
                  <input
                    type="number"
                    id="emiStarting"
                    name="emiStarting"
                    min="0"
                    value={formData.emiStarting}
                    onChange={handleInputChange}
                    placeholder="e.g., 12000"
                    className="mt-1 p-2 w-full border border-white/10 rounded-md bg-custom-jet text-white focus:ring-custom-accent focus:border-custom-accent"
                  />
                  <p className="text-sm text-custom-platinum/70 mt-1">Monthly EMI amount (optional)</p>
                </div>
              </div>
            )}
          </div>
          {formData && (
            <div>
              <label className="block font-medium text-gray-700">
                Features
              </label>
              {features.map((feature, i) => (
                <div key={feature._id} className="flex items-center">
                  <input
                    checked={formData.selectedFeatures.includes(feature.text)}
                    type="checkbox"
                    id={feature._id}
                    name={feature._id}
                    value={feature.text}
                    onChange={handleCheckboxChange}
                    className="mr-2"
                  />
                  <label htmlFor={feature._id} className="text-custom-platinum">
                    {feature.text}
                  </label>
                </div>
              ))}
            </div>
          )}
          <button
            type="submit"
            disabled={loading}
            className="bg-custom-accent hover:bg-yellow-400 text-custom-black font-bold py-2 px-4 rounded-md transition-colors"
          >
            {loading ? 'Updating...' : 'Update Listing'}
          </button>
        </form>
      </div>
    </div>
  )
}

export default CreateListing
