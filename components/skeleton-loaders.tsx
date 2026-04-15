export function FilmSkeleton() {
  return (
    <div className="relative rounded-lg md:rounded-2xl overflow-hidden bg-gray-800/50 animate-pulse">
      <div className="relative w-full aspect-[16/9] md:aspect-[302/160] bg-gray-700" />
      <div className="absolute bottom-3 left-3 right-3 md:bottom-4 md:left-4 md:right-4">
        <div className="h-4 bg-gray-700 rounded mb-2" />
        <div className="h-3 bg-gray-700 rounded w-2/3" />
      </div>
    </div>
  )
}

export function CarouselSkeleton() {
  return (
    <div className="flex gap-4 overflow-x-auto pb-4 scrollbar-hide">
      {[1, 2, 3, 4].map((i) => (
        <div key={i} className="flex-shrink-0 w-48">
          <FilmSkeleton />
        </div>
      ))}
    </div>
  )
}

export function SeriesSkeleton() {
  return (
    <div className="relative rounded-lg md:rounded-2xl overflow-hidden bg-gray-800/50 animate-pulse">
      <div className="relative w-full aspect-[16/9] md:aspect-[302/160] bg-gray-700" />
      <div className="absolute bottom-3 left-3 right-3 md:bottom-4 md:left-4 md:right-4">
        <div className="h-4 bg-gray-700 rounded mb-2" />
        <div className="h-3 bg-gray-700 rounded w-2/3" />
      </div>
    </div>
  )
}

export function FeaturedSkeleton() {
  return (
    <div className="relative w-full aspect-[16/10] md:aspect-[1066/660] rounded-xl md:rounded-3xl overflow-hidden bg-gray-800/50 animate-pulse">
      <div className="absolute inset-0 bg-gray-700" />
      <div className="absolute bottom-4 md:bottom-6 left-4 md:left-6 right-4 md:right-6">
        <div className="h-6 bg-gray-700 rounded mb-3 w-1/3" />
        <div className="h-4 bg-gray-700 rounded w-1/2 mb-4" />
        <div className="h-10 bg-gray-700 rounded w-32" />
      </div>
    </div>
  )
}

export function AwardSkeleton() {
  return (
    <div className="rounded-lg md:rounded-xl overflow-hidden bg-gray-800/50 animate-pulse">
      <div className="relative w-full aspect-[16/9] bg-gray-700 mb-3 md:mb-4" />
      <div className="px-3 md:px-4 pb-3 md:pb-4">
        <div className="h-4 bg-gray-700 rounded mb-2" />
        <div className="h-3 bg-gray-700 rounded w-2/3 mb-2" />
        <div className="h-3 bg-gray-700 rounded w-1/3" />
      </div>
    </div>
  )
}
