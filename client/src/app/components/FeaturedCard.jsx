import React from 'react'
import Image from 'next/image'
import { formatAmount, AmountWithCommas, EMICalcLite } from '../utils'

import { toTitleCase } from '../utils'

const FeaturedCard = ({ car }) => {
  return (
    <a href={car.slug ? `/buy/${car.slug}` : `/buy/${car._id}`}>
      <div className="max-w-sm rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl hover:scale-105 transition-all duration-300 bg-custom-jet border border-white/10 group">
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
              {car.kmDriven} km
            </span>
            <span className="bg-custom-black/50 text-custom-platinum px-3 py-1 rounded-full text-xs font-medium border border-white/5">
              {car.fuelType}
            </span>
            <span className="bg-custom-black/50 text-custom-platinum px-3 py-1 rounded-full text-xs font-medium border border-white/5">
              {car.transmissionType}
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
    </a>
  )
}

export default FeaturedCard
