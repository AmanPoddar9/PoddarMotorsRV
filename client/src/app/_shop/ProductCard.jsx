import React from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { formatAmount } from '../utils'
import { FaShoppingCart, FaStar } from 'react-icons/fa'

const ProductCard = ({ product }) => {
  return (
    <div className="relative group">
      <div className="w-full rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl hover:scale-105 transition-all duration-300 bg-custom-jet border border-white/10 flex flex-col h-full">
        {/* Image Container */}
        <div className="relative overflow-hidden h-48 sm:h-56 w-full bg-white/5">
          {product.image ? (
            <Image
              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
              src={product.image}
              width={300}
              height={300}
              alt={product.name}
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-white/30">
              No Image
            </div>
          )}
          
          {/* Badge (Optional) */}
          {product.badge && (
            <div className="absolute top-3 left-3 bg-custom-accent text-custom-black px-2 py-1 text-xs font-bold rounded-md uppercase tracking-wide">
              {product.badge}
            </div>
          )}
        </div>

        {/* Content */}
        <div className="p-5 flex flex-col flex-grow">
          <div className="flex justify-between items-start mb-2">
             <div className="text-xs text-custom-platinum/70 uppercase tracking-wider font-semibold">
              {product.category}
            </div>
            <div className="flex items-center gap-1 text-yellow-400 text-xs font-bold">
               <FaStar /> <span>{product.rating}</span>
            </div>
          </div>

          <h3 className="font-bold text-lg text-white mb-2 line-clamp-2 leading-tight group-hover:text-custom-accent transition-colors">
            {product.name}
          </h3>

          <p className="text-custom-platinum text-sm mb-4 line-clamp-2 flex-grow">
            {product.description}
          </p>

          <div className="mt-auto pt-4 border-t border-white/10 flex items-center justify-between">
            <div>
               {product.originalPrice && (
                  <span className="text-xs text-white/40 line-through block">
                    {formatAmount(product.originalPrice)}
                  </span>
               )}
              <div className="text-xl font-bold text-white">
                {formatAmount(product.price)}
              </div>
            </div>
            
            <button className="bg-white text-custom-black hover:bg-custom-accent transition-colors p-3 rounded-full flex items-center justify-center shadow-lg transform active:scale-95">
              <FaShoppingCart className="text-lg" />
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ProductCard
