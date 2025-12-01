import React, { useState, useEffect } from 'react'
import Image from 'next/image'
import { formatAmount, AmountWithCommas, EMICalcLite } from '../utils'
import { toTitleCase } from '../utils'
import { FaHeart, FaRegHeart } from 'react-icons/fa'
import { useCustomer } from '../utils/customerContext'
import axios from 'axios'

import Link from 'next/link'
import API_URL from '../config/api'
import { useLanguage } from '../contexts/LanguageContext'
import { trackCarView } from '../utils/analytics'

const FeaturedCard = ({ car }) => {
  const { t } = useLanguage()
  const { customer, fetchProfile } = useCustomer()
  const [inWishlist, setInWishlist] = useState(false)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (customer && customer.wishlist) {
      // Check if car is in wishlist (handle both populated objects and IDs)
      const isWishlisted = customer.wishlist.some(item => 
        (item._id === car._id) || (item === car._id)
      )
      setInWishlist(isWishlisted)
    }
  }, [customer, car._id])

  const toggleWishlist = async (e) => {
    e.preventDefault() // Prevent navigation
    e.stopPropagation()
    
    if (!customer) {
      alert('Please login to add to wishlist')
      return
    }

    try {
      setLoading(true)
      await axios.post(`${API_URL}/api/customer/wishlist`, 
        { listingId: car._id },
        { withCredentials: true }
      )
      setInWishlist(!inWishlist)
      fetchProfile() // Refresh profile to update global state
    } catch (error) {
      console.error('Error toggling wishlist:', error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="relative group">
      <Link 
        href={car.slug ? `/buy/${car.slug}` : `/buy/${car._id}`}
        onClick={() => trackCarView(car)}
      >
        <div className="w-full rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl hover:scale-105 transition-all duration-300 bg-custom-jet border border-white/10">
          <div className="relative overflow-hidden h-[20rem]">
            {car.images[0] ? (
              <Image
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                src={car.images[0]}
                width={300}
                height={300}
                alt={`${car.brand} ${car.model}`}
              />
            ) : (
              <div className="w-full h-full bg-custom-black flex items-center justify-center">
                <div className="text-white/50 text-center px-4">
                  Image not available
                </div>
              </div>
            )}
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
          </div>

          <div className="p-6">
            <div className="flex justify-between items-start mb-4">
              <div>
                <h3 className="font-bold text-xl text-white mb-1">
                  {car.brand} {car.model}
                </h3>
                <p className="text-custom-platinum text-sm font-medium">
                  {car.variant}
                </p>
              </div>
              <div className="bg-custom-black/50 px-3 py-1 rounded-full text-custom-accent font-bold text-sm border border-custom-accent/20">
                {car.year}
              </div>
            </div>

            <div className="flex flex-wrap gap-2 mb-6">
              <span className="bg-custom-black/50 text-custom-platinum px-3 py-1 rounded-full text-xs font-medium border border-white/5">
                {car.kmDriven} {t('buy.card.km')}
              </span>
              <span className="bg-custom-black/50 text-custom-platinum px-3 py-1 rounded-full text-xs font-medium border border-white/5">
                {t(`buy.card.${car.fuelType.toLowerCase()}`) || car.fuelType}
              </span>
              <span className="bg-custom-black/50 text-custom-platinum px-3 py-1 rounded-full text-xs font-medium border border-white/5">
                {t(`buy.card.${car.transmissionType.toLowerCase()}`) || car.transmissionType}
              </span>
            </div>

            <div className="flex justify-between items-end border-t border-white/10 pt-4">
              <div>
                <p className="text-custom-platinum text-xs mb-1">Price</p>
                <div className="text-2xl font-bold text-white">
                  {formatAmount(car.price)}
                </div>
              </div>
              <div className="text-right">
                <p className="text-custom-platinum text-xs mb-1">EMI starts at</p>
                <div className="text-custom-accent font-bold text-lg">
                  ₹{AmountWithCommas(EMICalcLite(car.price, 10, 36))}
                  <span className="text-xs font-normal text-custom-platinum">/mo</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </Link>
      
      {/* Wishlist Button */}
      <button
        onClick={toggleWishlist}
        disabled={loading}
        className="absolute top-4 right-4 z-20 p-3 rounded-full bg-black/50 hover:bg-black/70 text-white transition-all duration-300 backdrop-blur-sm border border-white/10"
      >
        {inWishlist ? (
          <FaHeart className="text-red-500 text-xl" />
        ) : (
          <FaRegHeart className="text-white text-xl hover:text-red-500" />
        )}
      </button>
    </div>
  )
}

export default FeaturedCard
