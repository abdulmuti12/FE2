'use client'

import { useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { ChevronLeft, ChevronRight } from 'lucide-react'

interface CategoryItem {
  id?: string
  name: string
  count: string
  image?: string
}

interface CategorySectionProps {
  title: string
  viewAllLink?: string
  items: CategoryItem[]
}

export function CategorySection({
  title,
  viewAllLink = '#',
  items = [],
}: CategorySectionProps) {
  const [currentIndex, setCurrentIndex] = useState(0)

  const itemsPerView = 7
  const maxIndex = Math.max(0, items.length - itemsPerView)

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
    <section className="px-4 md:px-6 lg:px-12 py-6 md:py-8 border-t border-border">

      {/* HEADER */}
      <div className="flex items-center justify-between mb-4 md:mb-6">

        <h2 className="text-lg md:text-2xl font-bold text-foreground">
          {title}
        </h2>

        <div className="flex items-center gap-4">


          {items.length > itemsPerView && (
            <div className="flex overflow-hidden rounded-sm border border-white/10 bg-[#0a2342]">
              <button
                onClick={handlePrev}
                disabled={currentIndex === 0}
                className="flex h-10 w-10 items-center justify-center border-r border-white/10 text-white transition-colors hover:bg-white/10 disabled:opacity-40"
              >
                <ChevronLeft className="h-4 w-4" />
              </button>

              <button
                onClick={handleNext}
                disabled={currentIndex === maxIndex}
                className="flex h-10 w-10 items-center justify-center text-white transition-colors hover:bg-white/10 disabled:opacity-40"
              >
                <ChevronRight className="h-4 w-4" />
              </button>
            </div>
          )}

        </div>
      </div>


      {/* CATEGORY LIST */}
      <div className="relative">
        <div className="overflow-hidden">
          <div
            className="flex transition-transform duration-300 gap-4 md:gap-6"
            style={{ transform: `translateX(-${currentIndex * (100 / itemsPerView)}%)` }}
          >
            {items.map((item, idx) => (
              <div
                key={item.id || idx}
                className="flex-shrink-0 w-1/3 sm:w-1/4 md:w-1/6 lg:w-1/7 text-center"
              >

                <div className="relative w-32 md:w-40 mx-auto mt-4 aspect-square rounded-full overflow-hidden mb-2 md:mb-3 bg-gradient-to-br from-[#4c7c3f] to-[#2a4a2a]">
                  <Image
                    src={item.image || '/placeholder.svg'}
                    alt={item.name}
                    fill
                    className="object-cover"
                  />
                </div>

                <p className="text-xs md:text-sm font-medium text-foreground line-clamp-1">
                  {item.name}
                </p>

                <p className="text-xs text-muted-foreground">
                  {item.count}
                </p>

              </div>
            ))}
          </div>
        </div>
      </div>

    </section>
  )
}