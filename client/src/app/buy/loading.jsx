'use client'
import React from 'react'
import { CarListSkeleton } from '../components/skeletons/CarCardSkeleton'

export default function Loading() {
  return (
    <div className="bg-custom-black min-h-screen">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <main className="pb-24 pt-24">
          {/* Header Skeleton */}
          <div className="flex items-baseline justify-between border-b border-white/10 pb-6 pt-12 mb-6">
            <div className="h-12 w-64 bg-custom-jet rounded-lg animate-pulse" />
            <div className="h-10 w-32 bg-custom-jet rounded-lg animate-pulse" />
          </div>

          {/* Grid Skeleton */}
          <div className="grid grid-cols-1 gap-x-8 gap-y-10 lg:grid-cols-4">
            {/* Filters Skeleton (Desktop) */}
            <div className="hidden lg:block">
              <div className="sticky top-24 h-fit space-y-6 bg-custom-jet/30 backdrop-blur-md p-6 rounded-2xl border border-white/10">
                <div className="h-6 w-20 bg-custom-jet rounded animate-pulse" />
                {[1, 2, 3, 4].map((i) => (
                  <div key={i} className="space-y-3">
                    <div className="h-5 w-32 bg-custom-jet rounded animate-pulse" />
                    <div className="space-y-2">
                      <div className="h-4 w-full bg-custom-jet rounded animate-pulse" />
                      <div className="h-4 w-3/4 bg-custom-jet rounded animate-pulse" />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Car List Skeleton */}
            <div className="lg:col-span-3">
              <CarListSkeleton count={9} />
            </div>
          </div>
        </main>
      </div>
    </div>
  )
}

