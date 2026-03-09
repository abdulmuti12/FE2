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

interface LatestFilmProps {
  items?: Film[]
}

export function LatestFilm({ items = [] }: LatestFilmProps) {
  return (
    <div className="block">
      <CarouselSection title="Latest Films" items={items} />
    </div>
  )
}
