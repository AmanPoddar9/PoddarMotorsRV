'use client'

import { useState, useRef } from 'react'
import imageCompression from 'browser-image-compression'
import API_URL from '../../config/api'

export default function ImageUpload({ label, onUpload, onImagesChange, maxFiles = 5, maxImages }) {
  // Support both maxFiles and maxImages prop names
  const max = maxImages || maxFiles
  
  // Support both onUpload and onImagesChange callback names  
  const handleUpload = onImagesChange || onUpload
  
  const [images, setImages] = useState([])
  const [uploading, setUploading] = useState(false)
  const fileInputRef = useRef(null)

  const handleFileSelect = async (e) => {
    const files = Array.from(e.target.files)
    if (files.length === 0) return

    if (images.length + files.length > max) {
      alert(`You can only upload up to ${max} images`)
      return
    }

    setUploading(true)
    
    try {
      // Compression options - optimized for quality vs file size
      const options = {
        maxSizeMB: 1.5, // Target 1.5MB per image (better quality)
        maxWidthOrHeight: 1920, // Max dimension
        useWebWorker: true,
        fileType: 'image/jpeg', // Convert all to JPEG for consistency
        quality: 0.92 // High quality compression (0-1 scale)
      }
      
      // Compress all images
      const compressedFiles = await Promise.all(
        files.map(async (file) => {
          try {
            console.log(`Original size: ${(file.size / 1024 / 1024).toFixed(2)}MB`)
            const compressed = await imageCompression(file, options)
            console.log(`Compressed size: ${(compressed.size / 1024 / 1024).toFixed(2)}MB`)
            return compressed
          } catch (error) {
            console.error('Compression failed for', file.name, error)
            return file // Fallback to original if compression fails
          }
        })
      )
      
      // Upload compressed images
      const formData = new FormData()
      compressedFiles.forEach(file => formData.append('images', file))

      const res = await fetch(`${API_URL}/api/upload`, {
        method: 'POST',
        body: formData
      })
      
      if (!res.ok) {
        const errorData = await res.json()
        alert('Upload failed: ' + (errorData.message || errorData.error || 'Unknown error'))
        return
      }
      
      const data = await res.json()
      const newImages = [...images, ...(data.urls || data.images || [])]
      setImages(newImages)
      if (handleUpload) {
        handleUpload(newImages)
      }
    } catch (error) {
      console.error('Upload error:', error)
      alert('Upload failed: ' + error.message)
    } finally {
      setUploading(false)
      if (fileInputRef.current) fileInputRef.current.value = ''
    }
  }

  const removeImage = (index) => {
    const newImages = images.filter((_, i) => i !== index)
    setImages(newImages)
    if (handleUpload) {
      handleUpload(newImages)
    }
  }

  return (
    <div className="bg-gray-800 p-4 rounded-lg border border-gray-700">
      <label className="block text-gray-300 font-medium mb-3">{label}</label>
      
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
        {images.map((url, index) => (
          <div key={index} className="relative group aspect-square bg-gray-900 rounded-lg overflow-hidden border border-gray-600">
            <img src={url} alt={`Upload ${index + 1}`} className="w-full h-full object-cover" />
            <button
              type="button"
              onClick={() => removeImage(index)}
              className="absolute top-1 right-1 bg-red-600 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
              </svg>
            </button>
          </div>
        ))}
        
        {images.length < max && (
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            disabled={uploading}
            className="aspect-square border-2 border-dashed border-gray-600 rounded-lg flex flex-col items-center justify-center text-gray-400 hover:text-white hover:border-gray-400 transition-colors disabled:opacity-50"
          >
            {uploading ? (
              <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-white"></div>
            ) : (
              <>
                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
                <span className="text-xs">Add Photo</span>
              </>
            )}
          </button>
        )}
      </div>
      
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileSelect}
        className="hidden"
        accept="image/*"
        multiple
      />
      <p className="text-xs text-gray-500">{images.length}/{max} images uploaded</p>
    </div>
  )
}
