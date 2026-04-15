'use client'

import { useRef } from 'react'
import Image from 'next/image'
import { Calendar } from 'lucide-react'

interface EventData {
  id: string
  title: string
  image_url?: string
  tgl_live?: string
}

interface UpcomingEventsSectionProps {
  title?: string
  items?: EventData[]
}

export function UpcomingEventsSection({
  title = 'Upcoming Events',
  items = [],
}: UpcomingEventsSectionProps) {
  const scrollerRef = useRef<HTMLDivElement | null>(null)

  const scrollByAmount = (dir: 'left' | 'right') => {
    const el = scrollerRef.current
    if (!el) return
    const amount = Math.round(el.clientWidth * 0.85)
    el.scrollBy({ left: dir === 'right' ? amount : -amount, behavior: 'smooth' })
  }

  return (
    <section className="px-4 py-8 md:px-6 md:py-10 lg:px-12">
      <div className="mb-8 flex items-center justify-between">
        <h2 className="text-2xl font-bold text-white md:text-3xl">{title}</h2>
        <a href="/dashboard/event" className="inline-flex items-center gap-2 font-semibold text-white hover:text-white/80 transition-colors">
          <span className="text-xs md:text-base">View All</span>
          <span className="text-white/70">›</span>
        </a>
      </div>

      <div className="relative">
        <div
          ref={scrollerRef}
          className="flex gap-4 overflow-x-auto scroll-smooth pb-4 md:gap-6"
          style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
        >
          {items.map((event) => (
            <div key={event.id} className="flex flex-shrink-0 flex-col gap-3">
              <div className="relative h-64 w-48 overflow-hidden rounded-lg md:h-72 md:w-56">
                <Image
                  src={event.image_url || '/images/event/example.png'}
                  alt={event.title}
                  fill
                  className="object-cover"
                />
              </div>
              <div className="flex flex-col gap-2">
                <h3 className="h-10 w-48 break-words text-sm font-semibold leading-5 text-white md:w-56">
                  {event.title}
                </h3>
                <div className="flex items-center gap-2 text-xs text-white/60">
                  <Calendar className="h-4 w-4" />
                  <span>{event.tgl_live || '-'}</span>
                </div>
              </div>
            </div>
          ))}
        </div>

        <button
          onClick={() => scrollByAmount('right')}
          className="absolute right-0 top-1/2 flex h-8 w-8 translate-x-2 -translate-y-1/2 items-center justify-center rounded-lg bg-white/95 text-black shadow-md transition-colors hover:bg-white md:h-10 md:w-10 md:translate-x-4 lg:translate-x-6"
          aria-label="Next upcoming event"
        >
          <span className="text-lg leading-none md:text-xl">›</span>
        </button>
      </div>
    </section>
  )
}
