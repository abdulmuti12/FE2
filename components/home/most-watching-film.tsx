'use client'

import { CarouselSection } from '@/components/home/carousel-section'

interface Film {
  id: string
  title: string
  image?: string
  year?: number
  description?: string
  categories?: string[]
}

interface MostWatchingFilmProps {
  items?: Film[]
}

export function MostWatchingFilm({ items = [] }: MostWatchingFilmProps) {
  return (
    <div className="hidden md:block">
      <CarouselSection title="Most Watching Film" items={items} />
    </div>
  )
}
