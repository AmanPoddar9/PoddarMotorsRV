'use client'
import React, { useState } from 'react'
import ProductCard from './ProductCard'
import { FaFilter, FaSearch } from 'react-icons/fa'

const dummyProducts = [
  {
    id: 1,
    name: "Poddar Premium Car Care Kit",
    category: "Care & Maintenance",
    price: 1499,
    originalPrice: 2499,
    image: "https://images.unsplash.com/photo-1601362840469-51e4d8d58785?q=80&w=2670&auto=format&fit=crop",
    description: "Complete 7-piece kit including microfiber cloths, dashboard polish, wax, and tire cleaner.",
    rating: 4.8,
    badge: "Best Seller"
  },
  {
    id: 2,
    name: "4K Dashcam with GPS & WiFi",
    category: "Electronics",
    price: 5999,
    originalPrice: 8999,
    image: "https://images.unsplash.com/photo-1596726663248-12c589b9643d?q=80&w=2574&auto=format&fit=crop",
    description: "Capture every moment with ultra-clear 4K recording. Includes night vision and parking mode.",
    rating: 4.9,
    badge: "Must Have"
  },
  {
    id: 3,
    name: "Ergonomic Memory Foam Neck Pillow",
    category: "Comfort",
    price: 899,
    originalPrice: 1299,
    image: "https://images.unsplash.com/photo-1634543760430-804791db727f?q=80&w=2574&auto=format&fit=crop",
    description: "Say goodbye to neck pain on long drives. Premium memory foam with breathable mesh cover.",
    rating: 4.6
  },
  {
    id: 4,
    name: "High-Power Car Vacuum Cleaner",
    category: "Cleaning",
    price: 1999,
    originalPrice: 3499,
    image: "https://images.unsplash.com/photo-1605809703498-8446b42b1029?q=80&w=2670&auto=format&fit=crop",
    description: "Keep your car spotless with this compact yet powerful vacuum. Plugs directly into 12V socket.",
    rating: 4.5
  },
  {
    id: 5,
    name: "Universal Magnetic Phone Mount",
    category: "Accessories",
    price: 499,
    originalPrice: 999,
    image: "https://images.unsplash.com/photo-1583574932621-0dc55ea65bb8?q=80&w=2669&auto=format&fit=crop",
    description: "Strong magnet ensures your phone stays in place even on bumpy roads. 360-degree rotation.",
    rating: 4.7
  },
  {
    id: 6,
    name: "Luxury Leather Key Fob Cover",
    category: "Accessories",
    price: 799,
    originalPrice: 1499,
    image: "https://images.unsplash.com/photo-1622359556880-b2b52834b6e5?q=80&w=2670&auto=format&fit=crop",
    description: "Protect your key in style. Hand-stitched premium leather compatible with most major brands.",
    rating: 4.8,
     badge: "New"
  }
]

const ShopPage = () => {
  const [filter, setFilter] = useState('All')

  const categories = ['All', 'Care & Maintenance', 'Electronics', 'Comfort', 'Accessories', 'Cleaning']
  
  const filteredProducts = filter === 'All' 
    ? dummyProducts 
    : dummyProducts.filter(p => p.category === filter)

  return (
    <div className="min-h-screen bg-custom-black py-20 px-4 sm:px-6 lg:px-8">
      {/* Header / Hero */}
      <div className="max-w-7xl mx-auto mb-12 text-center">
        <h1 className="text-4xl md:text-5xl font-extrabold text-white mb-4">
          Poddar <span className="text-custom-accent">Select</span>
        </h1>
        <p className="text-custom-platinum text-lg max-w-2xl mx-auto">
          Handpicked accessories to upgrade your driving experience. Quality tested and Poddar approved.
        </p>
      </div>

      {/* Filters & Search */}
      <div className="max-w-7xl mx-auto mb-10 flex flex-col md:flex-row justify-between items-center gap-4">
        <div className="flex overflow-x-auto pb-2 md:pb-0 gap-2 w-full md:w-auto text-sm no-scrollbar">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setFilter(cat)}
              className={`px-4 py-2 rounded-full whitespace-nowrap transition-all ${
                filter === cat 
                  ? 'bg-custom-accent text-custom-black font-bold' 
                  : 'bg-custom-jet text-custom-platinum hover:bg-white/10'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
        
        <div className="relative w-full md:w-64">
           <input 
             type="text" 
             placeholder="Search products..." 
             className="w-full bg-custom-jet border border-white/10 rounded-full py-2 pl-10 pr-4 text-white focus:outline-none focus:border-custom-accent/50"
           />
           <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-custom-platinum/50" />
        </div>
      </div>

      {/* Product Grid */}
      <div className="max-w-7xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {filteredProducts.map(product => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
      
      {/* Empty State */}
      {filteredProducts.length === 0 && (
         <div className="text-center py-20 text-custom-platinum/50">
            No products found in this category.
         </div>
      )}
    </div>
  )
}

export default ShopPage
