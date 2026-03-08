'use client'

import { useState } from 'react'
import Image from 'next/image'
import { Button } from '@/components/ui/button'
import { ChevronLeft, ChevronRight } from 'lucide-react'

interface FilmItem {
  id: string | number
  title: string
  year?: string
  image?: string
  description?: string
  categories?: string[]
}

interface LatestFilmsProps {
  items?: FilmItem[]
  loading?: boolean
}

export function LatestFilms({ items = [], loading = false }: LatestFilmsProps) {
  const [currentIndex, setCurrentIndex] = useState(0)
  const itemsPerView = 4
  const maxIndex = Math.max(0, items.length - itemsPerView)

  const handleNext = () => currentIndex < maxIndex && setCurrentIndex(currentIndex + 1)
  const handlePrev = () => currentIndex > 0 && setCurrentIndex(currentIndex - 1)

  return (
    <section className="px-4 md:px-6 lg:px-12 py-6 md:py-8 border-t border-border">
      <div className="flex items-center justify-between mb-4 md:mb-6">
        <h2 className="text-sm md:text-2xl font-bold text-foreground">Latest Films</h2>
        <a
          href="#"
          className="text-white text-xs md:text-sm font-medium hover:text-gray-300 transition-colors border border-white/20 rounded-xl px-4 py-2 md:border-0 md:rounded-none md:px-0 md:py-0"
        >
          View All
        </a>
      </div>

      {/* Mobile carousel */}
      <div className="md:hidden relative">
        <div className="overflow-hidden">
          <div
            className="flex gap-4 transition-transform duration-300"
            style={{ transform: `translateX(-${currentIndex * 88}%)` }}
          >
            {items.map((film) => (
              <div key={film.id} className="w-[88%] flex-shrink-0">
                <div className="rounded-xl overflow-hidden bg-black">
                  <div className="relative h-[170px] w-full">
                    <Image
                      src={film.image || '/placeholder.svg'}
                      alt={film.title}
                      fill
                      className="object-cover"
                    />
                  </div>

                  <div className="p-3">
                    <p className="font-semibold text-white text-[15px] mb-1 line-clamp-1">
                      {film.title}
                    </p>

                    {film.year && (
                      <p className="text-[12px] text-gray-400 mb-2">
                        {film.year}
                      </p>
                    )}

                    <p className="text-[12px] text-gray-400 line-clamp-2 mb-3 leading-relaxed">
                      {film.description}
                    </p>

                    <div className="flex gap-2 flex-wrap">
                      {film.categories?.slice(0, 2).map((cat: string, idx: number) => (
                        <Button
                          key={idx}
                          size="sm"
                          className="h-auto text-[11px] bg-white text-black hover:bg-gray-200 rounded-full px-3 py-1"
                          variant="default"
                        >
                          {cat}
                        </Button>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {currentIndex > 0 && (
          <button
            onClick={handlePrev}
            className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-3 z-10 w-8 h-8 rounded-full bg-[#003B79] flex items-center justify-center"
          >
            <ChevronLeft className="w-4 h-4 text-white" />
          </button>
        )}

        {currentIndex < maxIndex && (
          <button
            onClick={handleNext}
            className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-3 z-10 w-8 h-8 rounded-full bg-[#003B79] flex items-center justify-center"
          >
            <ChevronRight className="w-4 h-4 text-white" />
          </button>
        )}
      </div>

      {/* Desktop grid */}
      <div className="hidden md:block relative">
        <div className="overflow-hidden">
          <div
            className="flex transition-transform duration-300 gap-2 md:gap-4"
            style={{ transform: `translateX(-${currentIndex * (100 / itemsPerView)}%)` }}
          >
            {items.map((film) => (
              <div key={film.id} className="flex-shrink-0 w-1/4 text-center">
                <div className="w-full aspect-video rounded-xl overflow-hidden bg-black mb-3">
                  <Image
                    src={film.image || '/placeholder.svg'}
                    alt={film.title}
                    fill
                    className="object-cover hover:scale-105 transition-transform duration-500"
                  />
                </div>

                <p className="font-semibold text-white text-sm mb-1 line-clamp-2">
                  {film.title}
                </p>

                {film.year && (
                  <p className="text-xs text-gray-400 mb-2">
                    {film.year}
                  </p>
                )}

                <p className="text-xs text-gray-400 line-clamp-2 mb-3 leading-relaxed">
                  {film.description}
                </p>

                <div className="flex gap-2 flex-wrap justify-center">
                  {film.categories?.slice(0, 2).map((cat: string, idx: number) => (
                    <Button
                      key={idx}
                      size="sm"
                      className="h-auto text-[10px] bg-white text-black hover:bg-gray-200 rounded-full px-2 py-1"
                      variant="default"
                    >
                      {cat}
                    </Button>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>

        {currentIndex > 0 && (
          <button
            onClick={handlePrev}
            className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-3 z-10 w-8 h-8 rounded-full bg-[#003B79] flex items-center justify-center"
          >
            <ChevronLeft className="w-4 h-4 text-white" />
          </button>
        )}

        {currentIndex < maxIndex && (
          <button
            onClick={handleNext}
            className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-3 z-10 w-8 h-8 rounded-full bg-[#003B79] flex items-center justify-center"
          >
            <ChevronRight className="w-4 h-4 text-white" />
          </button>
        )}
      </div>
    </section>
  )
}
