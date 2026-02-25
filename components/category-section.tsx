'use client'

import { useState } from 'react'
import Image from 'next/image'

type CategoryItem = {
  name: string
  count: string
  icon?: string
}

type CategorySectionProps = {
  title?: string
  viewAllLink?: string
  items: CategoryItem[]
}

export function CategorySection({
  title = 'Category',
  viewAllLink = '#',
  items,
}: CategorySectionProps) {
  const [currentIndex, setCurrentIndex] = useState(0)

  // Mobile: show 3 items, Desktop: show 7 items
  const itemsPerView = 3
  const desktopItemsPerView = 7
  const maxIndex = Math.max(0, items.length - itemsPerView)
  const desktopMaxIndex = Math.max(0, items.length - desktopItemsPerView)

  const handleNext = () => {
    if (currentIndex < maxIndex) {
      setCurrentIndex(currentIndex + 1)
    }
  }

  const handlePrev = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1)
    }
  }

  return (
    <section className="px-4 md:px-6 lg:px-12 py-6 md:py-8 border-t border-white/10">
      {/* Header */}
      <div className="flex items-center justify-between mb-4 md:mb-6">
        <h2 className="text-sm md:text-2xl font-bold text-white">
          {title}
        </h2>

        <div className="flex items-center gap-3 md:gap-0">
          {/* Mobile: Show arrows inline, Desktop: Show View All link */}
          <div className="flex md:hidden gap-2">
            {currentIndex > 0 && (
              <button
                onClick={handlePrev}
                className="bg-white/10 hover:bg-white/20 backdrop-blur-sm p-1.5 rounded-full transition"
                aria-label="Prev"
              >
                <span className="text-white text-sm">‹</span>
              </button>
            )}
            {currentIndex < maxIndex && (
              <button
                onClick={handleNext}
                className="bg-white/10 hover:bg-white/20 backdrop-blur-sm p-1.5 rounded-full transition"
                aria-label="Next"
              >
                <span className="text-white text-sm">›</span>
              </button>
            )}
          </div>

          <a
            href={viewAllLink}
            className="hidden md:inline-block text-white/80 text-xs md:text-sm font-medium hover:text-white transition-colors"
          >
            View All
          </a>
        </div>
      </div>

      {/* Slider */}
      <div className="relative">
        <div className="overflow-hidden">
          <div
            className="flex transition-transform duration-500 ease-out gap-3 md:gap-6"
            style={{
              transform: `translateX(-${currentIndex * (100 / itemsPerView)}%)`,
            }}
          >
            {items.map((item, idx) => (
              <div
                key={idx}
                className="flex-shrink-0 w-1/3 md:w-[140px] lg:w-[160px] text-center"
              >
                {/* Bulatan Image - Larger on mobile */}
                <div className="relative w-full aspect-square rounded-full overflow-hidden mb-2 md:mb-3 bg-black/30 shadow-lg">
                  {item.icon ? (
                    <Image
                      src={item.icon}
                      alt={item.name}
                      fill
                      sizes="(min-width: 1024px) 160px, (min-width: 768px) 140px, 120px"
                      className="object-cover rounded-full"
                      priority={idx < 3}
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <span className="text-3xl md:text-2xl text-white">🎬</span>
                    </div>
                  )}
                </div>

                {/* Title */}
                <p className="text-xs md:text-sm font-semibold text-white line-clamp-1">
                  {item.name}
                </p>

                {/* Count */}
                <p className="text-[10px] md:text-xs text-white/60 mt-0.5 md:mt-1">
                  {item.count}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Desktop Arrows - Hidden on mobile, shown on md+ */}
        {currentIndex > 0 && (
          <button
            onClick={handlePrev}
            className="hidden md:flex absolute left-0 top-1/2 -translate-y-1/2 -translate-x-8 bg-white/10 hover:bg-white/20 backdrop-blur-sm p-2 rounded-full transition"
            aria-label="Prev"
          >
            <span className="text-white text-lg">‹</span>
          </button>
        )}

        {currentIndex < desktopMaxIndex && (
          <button
            onClick={() => {
              if (currentIndex < desktopMaxIndex) {
                setCurrentIndex(currentIndex + 1)
              }
            }}
            className="hidden md:flex absolute right-0 top-1/2 -translate-y-1/2 translate-x-8 bg-white/10 hover:bg-white/20 backdrop-blur-sm p-2 rounded-full transition"
            aria-label="Next"
          >
            <span className="text-white text-lg">›</span>
          </button>
        )}
      </div>
    </section>
  )
}
