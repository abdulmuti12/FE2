'use client'

import { useState } from 'react'
import Image from 'next/image'

interface AwardItem {
  id: string
  title: string
  description?: string
  image?: string
  genre?: string
}

interface LatestAwardsProps {
  title: string
  viewAllLink?: string
  items: AwardItem[]
}

export function LatestAwards({ title, viewAllLink = '#', items = [] }: LatestAwardsProps) {
  const [currentIndex, setCurrentIndex] = useState(0)
  const itemsPerView = 4
  const maxIndex = Math.max(0, items.length - itemsPerView)
  const handleNext = () => currentIndex < maxIndex && setCurrentIndex(currentIndex + 1)
  const handlePrev = () => currentIndex > 0 && setCurrentIndex(currentIndex - 1)

  return (
    <section className="px-4 md:px-6 lg:px-12 py-6 md:py-8 border-t border-border">
      <div className="flex items-center justify-between mb-6 md:mb-8">
        <h2 className="text-lg md:text-2xl font-bold text-foreground">{title}</h2>
        <a href={viewAllLink} className="text-white text-xs md:text-sm font-medium hover:text-gray-300 transition-colors">
          View All
        </a>
      </div>

      <div className="relative">
        <div className="overflow-hidden">
          <div className="flex transition-transform duration-300 gap-6" style={{ transform: `translateX(-${currentIndex * (100 / itemsPerView)}%)` }}>
           {items.map((film) => (
  <div key={film.id} className="flex-shrink-0 w-[240px] md:w-[260px] lg:w-[280px]">
    <div className="flex flex-col items-center">

      {/* Poster */}
      <div className="relative w-full h-[320px] md:h-[360px] bg-gray-900 rounded-2xl overflow-hidden mb-4">
        <Image
          src={film.image || '/placeholder.svg'}
          alt={film.title}
          fill
          className="object-cover"
        />
      </div>

      {/* Title */}
      <h3 className="text-white font-semibold text-sm text-center mb-2">
        {film.title}
      </h3>

      {/* Description */}
      <p className="text-gray-400 text-xs text-center line-clamp-2 mb-3 px-2">
        {film.description}
      </p>

      {/* Genre Button - DI BAWAH DESCRIPTION */}
    {(film.genre || (film as any).category) && (
  <button className="inline-block bg-white text-black text-[11px] px-4 py-1 rounded-full font-medium hover:bg-gray-200 transition-colors">
    {film.genre || (film as any).category}
  </button>
)}

    </div>
  </div>
))}
          </div>
        </div>

        {/* Navigation Buttons */}
        {items.length > itemsPerView && (
          <>
            <button onClick={handlePrev} disabled={currentIndex === 0} className="absolute left-0 top-1/3 -translate-y-1/2 -translate-x-6 md:-translate-x-10 bg-white/20 hover:bg-white/40 disabled:opacity-50 disabled:cursor-not-allowed p-2 rounded-full transition-colors">
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </button>
            <button onClick={handleNext} disabled={currentIndex === maxIndex} className="absolute right-0 top-1/3 -translate-y-1/2 translate-x-6 md:translate-x-10 bg-white/20 hover:bg-white/40 disabled:opacity-50 disabled:cursor-not-allowed p-2 rounded-full transition-colors">
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </>
        )}
      </div>
    </section>
  )
}
