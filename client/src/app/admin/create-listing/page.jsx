'use client'
import { useState, useEffect } from 'react'
import axios from 'axios'
import API_URL from '../../config/api'
import ImageUpload from '../components/admin/ImageUpload'

const CreateListing = () => {
  const [features, setFeatures] = useState([])
  const [loading, setLoading] = useState(false)
  const [images, setImages] = useState([])
  const [error, setError] = useState(null)
  // let url = 'https://poddar-motors-rv-hkxu.vercel.app/'

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
    images: [],
  })

  const handleImagesChange = (newImages) => {
    setImages(newImages)
  }

  useEffect(() => {
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

  const transmissionTypes = ['AMT', 'CVT', 'DCT', 'TC', 'iMT', 'MT']

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      setLoading(true)
      const tempData = formData
      tempData['features'] = formData['selectedFeatures']
      tempData['images'] = images
      console.log(tempData['images'])
      setImages([])
      await axios.post(`${API_URL}/api/listings`, tempData, {
        withCredentials: true
      })
      setFormData({
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
      })
      setLoading(false)
      alert('Listing created successfully')
      window.location.reload()
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
        <h1 className="text-3xl font-bold mb-6 text-white">Create Listing</h1>
        <form onSubmit={handleSubmit} className="space-y-4">
          <ImageUpload
            label="Car Images"
            onImagesChange={handleImagesChange}
            maxImages={20}
          />
          {error && <div className="text-red-500">{error}</div>}
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
              <option value="EV">Hybrid</option>
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
          <div>
            <label className="block font-medium text-gray-700">Features</label>
            {features.map((feature) => (
              <div key={feature._id} className="flex items-center">
                <input
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
          <button
            type="submit"
            disabled={loading}
            className="bg-custom-accent hover:bg-yellow-400 text-custom-black font-bold py-2 px-4 rounded-md transition-colors"
          >
            {loading ? 'Creating...' : 'Create Listing'}
          </button>
        </form>
      </div>
    </div>
  )
}

export default CreateListing
