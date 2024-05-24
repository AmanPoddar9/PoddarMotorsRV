'use client'
import { useState, useEffect } from 'react'
import axios from 'axios'
import AdminNavbar from '@/app/components/AdminNavbar'
import JSZip from 'jszip'
import { Spin } from 'antd'

const CreateListing = () => {
  const [features, setFeatures] = useState([])
  const [imageFile, setImageFile] = useState(null)
  const [loading, setLoading] = useState(false)
  const [uploading, setUploading] = useState(false)
  const [images, setImages] = useState([])
  const [imagesLength, setImagesLength] = useState(null)
  const [imagesDone, setImagesDone] = useState(0)
  let url = 'https://poddar-motors-rv-hkxu.vercel.app/'
  // url = 'http://localhost:5000/'

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
  })

  const uploadImagesToCloudinary = async (images) => {
    let tempArr = []
    const NAME_OF_UPLOAD_PRESET = 'hnm31bqf'
    const YOUR_ID = 'djyvxi14o'
    const API_KEY = '969818645141645'

    // Loop through each extracted image and upload to Cloudinary
    for (let i = 0; i < images.length; i++) {
      let image = images[i]
      const data = new FormData()
      data.append('file', image)
      data.append('upload_preset', NAME_OF_UPLOAD_PRESET)
      data.append('api_key', API_KEY)
      const res = await fetch(
        `https://api.cloudinary.com/v1_1/${YOUR_ID}/image/upload`,
        {
          method: 'POST',
          body: data,
        },
      )
      const img = await res.json()
      // You can handle the Cloudinary response here as needed
      tempArr.push(img.secure_url)
      setImages(tempArr)
      console.log('Uploaded image:', img.secure_url)
    }
  }

  const handleImageChange = async (e) => {
    setImageFile(e.target.files[0])
    const form = new FormData()
    const file = e.target.files[0]
    if (
      file.type !== 'application/zip' &&
      file.type !== 'zip' &&
      file.type !== 'application/x-zip-compressed' &&
      file.type !== 'application/x-zip'
    ) {
      alert('Please upload zip file only')
      return
    }
    try {
      setUploading(true)
      const file = e.target.files[0]
      const zip = new JSZip()

      // Read the uploaded file
      const zipData = await file.arrayBuffer()

      // Load the ZIP file
      await zip.loadAsync(zipData)

      const extractedImages = []

      // Extract images from the ZIP file
      await Promise.all(
        Object.keys(zip.files).map(async (filename) => {
          const file = zip.files[filename]
          if (
            file.dir ||
            !file.name.match(/\.(jpg|jpeg|png)$/i) ||
            filename.includes('__MACOSX')
          )
            return

          // Read the image file
          const imageData = await file.async('blob')

          // Convert the Blob to a data URL
          const imageFile = new File([imageData], filename)

          extractedImages.push(imageFile)
        }),
      )

      const getFileName = (path) => {
        return path.split('/').pop()
      }

      // Sort the files based on the filename
      extractedImages.sort((a, b) => {
        const fileNameA = getFileName(a.name)
        const fileNameB = getFileName(b.name)
        return fileNameA.localeCompare(fileNameB)
      })

      setImagesLength(extractedImages.length)
      await uploadImagesToCloudinary(extractedImages)

      setUploading(false)
    } catch (error) {
      setUploading(false)
      console.error('Error uploading image:', error.message)
    }
  }

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
      setImages([])
      await axios.post(url + 'api/listings', tempData)
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
    <div>
      <AdminNavbar />
      <div className="max-w-3xl mx-auto py-8 px-4">
        <h1 className="text-3xl font-bold mb-6">Create Listing</h1>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="mb-6">
            <input
              type="file"
              onChange={handleImageChange}
              className="border border-gray-300 rounded-md py-2 px-4 mb-2"
            />
            {uploading && imagesLength && (
              <div>
                <Spin size="small" /> Uploading...
              </div>
            )}
          </div>
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
              className="mt-1 p-2 w-full border rounded-md"
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
              className="mt-1 p-2 w-full border rounded-md"
            />
          </div>
          <div>
            <label
              htmlFor="variant"
              className="block font-medium text-gray-700"
            >
              Variant
            </label>
            <input
              type="text"
              id="variant"
              name="variant"
              value={formData.variant}
              onChange={handleInputChange}
              className="mt-1 p-2 w-full border rounded-md"
            />
          </div>
          <div>
            <label
              htmlFor="vehicleNumber"
              className="block font-medium text-gray-700"
            >
              Vehicle Number
            </label>
            <input
              type="text"
              id="vehicleNumber"
              name="vehicleNumber"
              value={formData.vehicleNumber}
              onChange={handleInputChange}
              className="mt-1 p-2 w-full border rounded-md"
            />
          </div>
          <div>
            <label
              htmlFor="fuelType"
              className="block font-medium text-gray-700"
            >
              Fuel Type
            </label>
            <select
              id="fuelType"
              name="fuelType"
              value={formData.fuelType}
              onChange={handleInputChange}
              className="mt-1 p-2 w-full border rounded-md"
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
              value={formData.year}
              onChange={handleInputChange}
              className="mt-1 p-2 w-full border rounded-md"
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
              className="mt-1 p-2 w-full border rounded-md"
            />
          </div>
          <div>
            <label
              htmlFor="ownership"
              className="block font-medium text-gray-700"
            >
              Ownership
            </label>
            <input
              type="number"
              id="ownership"
              name="ownership"
              value={formData.ownership}
              onChange={handleInputChange}
              className="mt-1 p-2 w-full border rounded-md"
            />
          </div>
          <div>
            <label
              htmlFor="kmDriven"
              className="block font-medium text-gray-700"
            >
              Kilometers Driven
            </label>
            <input
              type="number"
              id="kmDriven"
              name="kmDriven"
              value={formData.kmDriven}
              onChange={handleInputChange}
              className="mt-1 p-2 w-full border rounded-md"
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
              value={formData.price}
              onChange={handleInputChange}
              className="mt-1 p-2 w-full border rounded-md"
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
              className="mt-1 p-2 w-full border rounded-md"
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
              className="block font-medium text-gray-700"
            >
              Transmission Type
            </label>
            <select
              id="transmissionType"
              name="transmissionType"
              value={formData.transmissionType}
              onChange={handleInputChange}
              className="mt-1 p-2 w-full border rounded-md"
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
              value={formData.seats}
              onChange={handleInputChange}
              className="mt-1 p-2 w-full border rounded-md"
            />
          </div>
          <div>
            <label
              htmlFor="displacement"
              className="block font-medium text-gray-700"
            >
              Displacement (CC):
            </label>
            <input
              type="number"
              id="displacement"
              name="displacement"
              value={formData.displacement}
              onChange={handleInputChange}
              className="mt-1 p-2 w-full border rounded-md"
            />
          </div>
          <div>
            <label
              htmlFor="cylinders"
              className="block font-medium text-gray-700"
            >
              No. of Cylinders:
            </label>
            <input
              type="number"
              id="cylinders"
              name="cylinders"
              value={formData.cylinders}
              onChange={handleInputChange}
              className="mt-1 p-2 w-full border rounded-md"
            />
          </div>
          <div>
            <label
              htmlFor="maxPower"
              className="block font-medium text-gray-700"
            >
              Max Power (BHP):
            </label>
            <input
              type="number"
              id="maxPower"
              name="maxPower"
              value={formData.maxPower}
              onChange={handleInputChange}
              className="mt-1 p-2 w-full border rounded-md"
            />
          </div>
          <div>
            <label
              htmlFor="bootspace"
              className="block font-medium text-gray-700"
            >
              Bootspace (Litres):
            </label>
            <input
              type="number"
              id="bootspace"
              name="bootspace"
              value={formData.bootspace}
              onChange={handleInputChange}
              className="mt-1 p-2 w-full border rounded-md"
            />
          </div>
          <div>
            <label
              htmlFor="fuelTank"
              className="block font-medium text-gray-700"
            >
              Fuel Tank (Litres):
            </label>
            <input
              type="number"
              id="fuelTank"
              name="fuelTank"
              value={formData.fuelTank}
              onChange={handleInputChange}
              className="mt-1 p-2 w-full border rounded-md"
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
              value={formData.gears}
              onChange={handleInputChange}
              className="mt-1 p-2 w-full border rounded-md"
            />
          </div>
          <div>
            <label
              htmlFor="mileage"
              className="block font-medium text-gray-700"
            >
              Mileage (KMPL):
            </label>
            <input
              type="number"
              id="mileage"
              name="mileage"
              value={formData.mileage}
              onChange={handleInputChange}
              className="mt-1 p-2 w-full border rounded-md"
            />
          </div>
          <div>
            <label
              htmlFor="location"
              className="block font-medium text-gray-700"
            >
              Location
            </label>
            <input
              type="text"
              id="location"
              name="location"
              value={formData.location}
              onChange={handleInputChange}
              className="mt-1 p-2 w-full border rounded-md"
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
              <span className="text-gray-700">Featured</span>
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
                <label htmlFor={feature._id} className="text-gray-700">
                  {feature.text}
                </label>
              </div>
            ))}
          </div>
          <button
            type="submit"
            disabled={loading || uploading}
            className="bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-4 rounded-md"
          >
            {loading ? 'Creating...' : 'Create Listing'}
          </button>
        </form>
      </div>
    </div>
  )
}

export default CreateListing
