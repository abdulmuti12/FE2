'use client'

import { useRef } from 'react'
import Image from 'next/image'
import Link from 'next/link'

interface Film {
  id: string
  title: string
  image?: string
  year?: number
  description?: string
  categories?: string[]
  category?: string
  rating?: string
  duration?: string
  genre?: string
}

interface MostWatchingFilmProps {
  items?: Film[]
}

export function MostWatchingFilm({ items = [] }: MostWatchingFilmProps) {
  const scrollerRef = useRef<HTMLDivElement | null>(null)

  const scrollByAmount = (dir: 'right') => {
    const el = scrollerRef.current
    if (!el) return
    const amount = Math.round(el.clientWidth * 0.8)
    el.scrollBy({ left: dir === 'right' ? amount : -amount, behavior: 'smooth' })
  }

  if (!items.length) return null

  return (
    <section className="px-4 py-8 md:px-6 md:py-10 lg:px-12 border-t border-white/10">
      <div className="mb-8 flex items-center justify-between">
        <h2 className="text-2xl font-bold text-white md:text-3xl">Most Watching Film</h2>
        <Link
          href="/film"
          className="inline-flex items-center gap-2 font-semibold text-white hover:text-white/80 transition-colors"
        >
          <span className="text-xs md:text-base">View All</span>
          <span className="text-white/70">›</span>
        </Link>
      </div>

      <div className="relative">
        <div
          ref={scrollerRef}
          className="flex gap-4 overflow-x-auto scroll-smooth pb-4 md:gap-6"
          style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
        >
          {items.map((film) => (
            <Link
              key={film.id}
              href={`/film/detail?id=${film.id}`}
              className="flex flex-shrink-0 flex-col gap-3"
            >
              <div className="relative h-64 w-48 overflow-hidden rounded-lg md:h-72 md:w-56">
                <Image
                  src={film.image || '/placeholder.svg'}
                  alt={film.title}
                  fill
                  className="object-cover transition-transform hover:scale-105"
                />
              </div>
              <div className="flex flex-col gap-2">
                <h3 className="h-10 w-48 break-words text-sm font-semibold leading-5 text-white md:w-56">
                  {film.title}
                </h3>
                <p className="text-xs text-white/60">{film.rating || '8.5/10'}</p>
              </div>
            </Link>
          ))}
        </div>

        <button
          onClick={() => scrollByAmount('right')}
          className="absolute right-0 top-1/2 flex h-8 w-8 translate-x-2 -translate-y-1/2 items-center justify-center rounded-lg bg-white/95 text-black shadow-md transition-colors hover:bg-white md:h-10 md:w-10 md:translate-x-4 lg:translate-x-6"
          aria-label="Next film"
        >
          <span className="text-lg leading-none md:text-xl">›</span>
        </button>
      </div>
    </section>
  )
}
