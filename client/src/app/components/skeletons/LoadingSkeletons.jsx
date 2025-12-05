/**
 * Loading Skeleton Components
 * Reusable skeleton components for better loading states
 */

export function CarCardSkeleton() {
  return (
    <div className="bg-custom-jet rounded-xl overflow-hidden border border-white/10 animate-pulse">
      {/* Image skeleton */}
      <div className="w-full h-48 bg-custom-surface" />
      
      <div className="p-4 space-y-3">
        {/* Title */}
        <div className="h-6 bg-custom-surface rounded w-3/4" />
        
        {/* Specs */}
        <div className="flex justify-between">
          <div className="h-4 bg-custom-surface rounded w-20" />
          <div className="h-4 bg-custom-surface rounded w-20" />
          <div className="h-4 bg-custom-surface rounded w-20" />
        </div>
        
        {/* Price */}
        <div className="h-8 bg-custom-surface rounded w-32" />
        
        {/* Button */}
        <div className="h-10 bg-custom-surface rounded w-full" />
      </div>
    </div>
  );
}

export function ListingCardSkeleton() {
  return (
    <div className="bg-custom-jet rounded-lg overflow-hidden border border-white/10 animate-pulse">
      <div className="flex flex-col md:flex-row">
        {/* Image skeleton */}
        <div className="w-full md:w-64 h-48 bg-custom-surface flex-shrink-0" />
        
        <div className="p-6 flex-1 space-y-4">
          {/* Title */}
          <div className="h-7 bg-custom-surface rounded w-2/3" />
          
          {/* Details grid */}
          <div className="grid grid-cols-2 gap-4">
            <div className="h-5 bg-custom-surface rounded w-full" />
            <div className="h-5 bg-custom-surface rounded w-full" />
            <div className="h-5 bg-custom-surface rounded w-full" />
            <div className="h-5 bg-custom-surface rounded w-full" />
          </div>
          
          {/* Price and button */}
          <div className="flex justify-between items-center pt-4">
            <div className="h-8 bg-custom-surface rounded w-32" />
            <div className="h-10 bg-custom-surface rounded w-28" />
          </div>
        </div>
      </div>
    </div>
  );
}

export function GridSkeleton({ count = 6 }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {Array.from({ length: count }).map((_, i) => (
        <CarCardSkeleton key={i} />
      ))}
    </div>
  );
}

export function ListSkeleton({ count = 5 }) {
  return (
    <div className="space-y-4">
      {Array.from({ length: count }).map((_, i) => (
        <ListingCardSkeleton key={i} />
      ))}
    </div>
  );
}
