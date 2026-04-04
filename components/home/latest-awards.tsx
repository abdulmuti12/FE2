'use client'

import { useState } from 'react'
import Image from 'next/image'

interface AwardItem {
  id: string
  title?: string
  name?: string
  description?: string
  image?: string
  image_url?: string
  genre?: string
  synopsis?: string
  category?: string
  cats?: string
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
    <section className="border-t border-border px-4 py-6 md:px-6 md:py-8 lg:px-12">
      <div className="mb-6 flex items-center justify-between md:mb-8">
        <h2 className="text-lg font-bold text-foreground md:text-2xl">{title}</h2>
        <a
          href={viewAllLink}
          className="text-xs font-medium text-white transition-colors hover:text-gray-300 md:text-sm"
        >
          View All
        </a>
      </div>

      <div className="relative">
        <div className="overflow-hidden">
          <div
            className="flex gap-6 transition-transform duration-300"
            style={{ transform: `translateX(-${currentIndex * (100 / itemsPerView)}%)` }}
          >
            {items.map((award) => (
              <div key={award.id} className="w-[240px] flex-shrink-0 md:w-[260px] lg:w-[280px]">
                <div className="flex flex-col items-center">
                  <div className="relative mb-4 h-[320px] w-full overflow-hidden rounded-2xl bg-gray-900 md:h-[360px]">
                    <Image
                      src={award.image_url || award.image || '/placeholder.svg'}
                      alt={award.name || award.title || 'Award'}
                      fill
                      className="object-cover"
                    />
                  </div>

                  <h3 className="mb-2 text-center text-sm font-semibold text-white">
                    {award.name || award.title}
                  </h3>

                  {/* BAGIAN YANG DIUBAH */}
                  <div 
                    className="mb-3 line-clamp-2 px-2 text-center text-xs text-gray-400"
                    dangerouslySetInnerHTML={{ __html: award.description || award.synopsis || '' }}
                  />

                  {(award.genre || award.category || award.cats) && (
                    <button className="inline-block rounded-full bg-white px-4 py-1 text-[11px] font-medium text-black transition-colors hover:bg-gray-200">
                      {award.genre || award.category || award.cats}
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {items.length > itemsPerView && (
          <>
            <button
              onClick={handlePrev}
              disabled={currentIndex === 0}
              className="absolute left-0 top-1/3 -translate-x-6 -translate-y-1/2 rounded-full bg-white/20 p-2 transition-colors hover:bg-white/40 disabled:cursor-not-allowed disabled:opacity-50 md:-translate-x-10"
            >
              <svg className="h-6 w-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </button>

            <button
              onClick={handleNext}
              disabled={currentIndex === maxIndex}
              className="absolute right-0 top-1/3 translate-x-6 -translate-y-1/2 rounded-full bg-white/20 p-2 transition-colors hover:bg-white/40 disabled:cursor-not-allowed disabled:opacity-50 md:translate-x-10"
            >
              <svg className="h-6 w-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </>
        )}
      </div>
    </section>
  )
}