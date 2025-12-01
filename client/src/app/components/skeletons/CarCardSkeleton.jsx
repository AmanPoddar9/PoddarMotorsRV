export default function CarCardSkeleton() {
  return (
    <div className="glass-dark rounded-2xl overflow-hidden border border-white/10 animate-pulse">
      {/* Image Skeleton */}
      <div className="relative h-48 bg-custom-jet">
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent animate-shimmer" />
      </div>

      {/* Content Skeleton */}
      <div className="p-5 space-y-3">
        {/* Title */}
        <div className="h-6 bg-custom-jet rounded-lg w-3/4" />
        
        {/* Subtitle */}
        <div className="h-4 bg-custom-jet rounded-lg w-1/2" />

        {/* Features */}
        <div className="flex gap-2">
          <div className="h-8 bg-custom-jet rounded-lg w-16" />
          <div className="h-8 bg-custom-jet rounded-lg w-16" />
          <div className="h-8 bg-custom-jet rounded-lg w-16" />
        </div>

        {/* Price */}
        <div className="h-8 bg-custom-jet rounded-lg w-2/3" />

        {/* Button */}
        <div className="h-12 bg-custom-jet rounded-xl w-full" />
      </div>
    </div>
  );
}

export function CarListSkeleton({ count = 6 }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {Array.from({ length: count }).map((_, index) => (
        <CarCardSkeleton key={index} />
      ))}
    </div>
  );
}
