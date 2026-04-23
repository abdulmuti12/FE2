'use client'

import { useRef } from 'react'
import Image from 'next/image'
import Link from 'next/link'

interface AwardItem {
  id: string
  title?: string
  name?: string
  description?: string
  description_text?: string
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
  const scrollerRef = useRef<HTMLDivElement | null>(null)

  const scrollByAmount = (dir: 'right') => {
    const el = scrollerRef.current
    if (!el) return
    const amount = Math.round(el.clientWidth * 0.85)
    el.scrollBy({ left: dir === 'right' ? amount : -amount, behavior: 'smooth' })
  }

  return (
    <section className="px-4 py-8 md:px-6 md:py-10 lg:px-12 border-t border-border">
      <div className="mb-8 flex items-center justify-between">
        <h2 className="text-2xl font-bold text-white md:text-3xl">{title}</h2>
        <Link
          href={viewAllLink}
          className="inline-flex items-center gap-2 font-semibold text-white hover:text-white/80 transition-colors"
        >
          <span className="text-xs md:text-base">View All</span>
          <span className="text-white/70">›</span>
        </Link>
      </div>

      <div className="relative">
        <div
          ref={scrollerRef}
          className="flex gap-4 md:gap-6 overflow-x-auto scroll-smooth pb-4"
          style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
        >
          {items.map((award) => (
            <Link key={award.id} href={`/dashboard/awards/detail?id=${award.id}`} className="flex flex-shrink-0 flex-col gap-3">
              <div className="relative h-80 w-60 overflow-hidden rounded-2xl md:h-96 md:w-64 lg:w-80 bg-gray-900">
                <Image
                  src={award.image_url || award.image || '/placeholder.svg'}
                  alt={award.name || award.title || 'Award'}
                  fill
                  className="object-cover"
                />
              </div>
              <div className="flex flex-col gap-2">
                <h3 className="max-w-60 break-words text-sm font-semibold text-white md:max-w-64 lg:max-w-80">
                  {award.name || award.title}
                </h3>
                {(award.genre || award.category || award.cats) && (
                  <span className="text-xs text-white/60">{award.genre || award.category || award.cats}</span>
                )}
              </div>
            </Link>
          ))}
        </div>

        <button
          onClick={() => scrollByAmount('right')}
          className="absolute right-0 top-1/2 flex h-8 w-8 translate-x-2 -translate-y-1/2 items-center justify-center rounded-lg bg-white/95 text-black shadow-md transition-colors hover:bg-white md:h-10 md:w-10 md:translate-x-4 lg:translate-x-6"
          aria-label="Next award"
        >
          <span className="text-lg leading-none md:text-xl">›</span>
        </button>
      </div>
    </section>
  )
}
