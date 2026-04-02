'use client'

import { useState } from 'react'
import Image from 'next/image'
import { ChevronLeft, ChevronRight, X, Menu } from 'lucide-react'
import { Button } from '@/components/ui/button'
import Link from 'next/link'

const creatorData = [
  { name: 'Creator 1', count: '5 movies' }
]

interface CarouselSectionProps {
  title: string
  viewAllLink?: string
  items?: any[]
  layout?: 'default' | 'category' | 'creator'
}

export function CarouselSection({
  title,
  viewAllLink = '#',
  items = [],
  layout = 'default',
}: CarouselSectionProps) {
  const [currentIndex, setCurrentIndex] = useState(0)
  const itemsPerView = layout === 'creator' ? 7 : layout === 'default' ? 4 : 7
  const maxIndex = Math.max(0, items.length - itemsPerView)

  const handleNext = () => currentIndex < maxIndex && setCurrentIndex(currentIndex + 1)
  const handlePrev = () => currentIndex > 0 && setCurrentIndex(currentIndex - 1)

  return (
    <section className="border-t border-border px-4 py-6 md:px-6 md:py-8 lg:px-12">
      <div className="mb-4 flex items-center justify-between md:mb-6">
        <h2 className="text-sm font-bold text-foreground md:text-2xl">{title}</h2>
        <Link href="/dashboard/film" className="bg-white/10 px-4 py-1.5 rounded-full text-xs text-white hover:bg-white/20 transition-colors">
          View All
        </Link>
      </div>

      {/* TAMPILAN MOBILE */}
      {layout === 'default' && (
        <div className="relative md:hidden">
          <div className="overflow-hidden">
            <div
              className="flex gap-4 transition-transform duration-300"
              style={{ transform: `translateX(-${currentIndex * 88}%)` }}
            >
              {items.map((film) => (
                <div key={film.id} className="w-[88%] flex-shrink-0">
                  <div className="overflow-hidden rounded-xl bg-black">
                    
                    {/* 1. Bungkus Gambar Mobile dengan Link */}
                    <Link href={`/dashboard/film/detail?id=${film.id}`}>
                      <div className="relative h-[170px] w-full">
                        <Image
                          src={film.image || '/placeholder.svg'}
                          alt={film.title}
                          fill
                          className="object-cover"
                        />
                      </div>
                    </Link>

                    <div className="p-3">
                      {/* 2. Judul juga bisa di-klik */}
                      <Link href={`/dashboard/film/detail?id=${film.id}`}>
                        <p className="mb-1 line-clamp-1 text-[15px] font-semibold text-white hover:text-blue-400 transition-colors">
                          {film.title}
                        </p>
                      </Link>

                      {film.year && <p className="mb-2 text-[12px] text-gray-400">{film.year}</p>}

                      <p className="mb-3 line-clamp-2 text-[12px] leading-relaxed text-gray-400">
                        {film.description}
                      </p>

                      <div className="flex flex-wrap gap-2">
                        {film.categories?.filter((cat: string) => cat !== 'AI').slice(0, 2).map((cat: string, idx: number) => (
                          <Button
                            key={idx}
                            size="sm"
                            className="h-auto rounded-full bg-white px-3 py-1 text-[11px] text-black hover:bg-gray-200"
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
              className="absolute left-0 top-1/2 z-10 flex h-8 w-8 -translate-x-3 -translate-y-1/2 items-center justify-center rounded-full bg-[#003B79]"
            >
              <ChevronLeft className="h-4 w-4 text-white" />
            </button>
          )}

          {currentIndex < maxIndex && (
            <button
              onClick={handleNext}
              className="absolute right-0 top-1/2 z-10 flex h-8 w-8 translate-x-3 -translate-y-1/2 items-center justify-center rounded-full bg-[#003B79]"
            >
              <ChevronRight className="h-4 w-4 text-white" />
            </button>
          )}
        </div>
      )}

      {/* TAMPILAN DESKTOP */}
      <div className={`${layout === 'default' ? 'hidden md:block' : 'block'} relative`}>
        <div className="overflow-hidden">
          <div
            className="flex gap-2 transition-transform duration-300 md:gap-4"
            style={{ transform: `translateX(-${currentIndex * (100 / itemsPerView)}%)` }}
          >
            {layout === 'creator'
              ? creatorData.map((item, idx) => (
                  <div key={idx} className="w-1/3 flex-shrink-0 text-center sm:w-1/4 lg:w-1/7 cursor-pointer">
                    <div className="mb-2 flex aspect-square w-full items-center justify-center rounded-full bg-gradient-to-br from-[#7c4c9f] to-[#4a2a6a] md:mb-3">
                      <span className="text-xl text-white md:text-4xl">👤</span>
                    </div>
                    <p className="line-clamp-1 text-xs font-medium text-foreground md:text-sm">
                      {item.name}
                    </p>
                    <p className="text-xs text-muted-foreground">{item.count}</p>
                  </div>
                ))
              : items.map((film) => (
                  <div key={film.id} className="w-1/2 flex-shrink-0 md:w-1/4 lg:w-1/4">
                    
                    {/* 3. Bungkus Gambar Desktop dengan Link */}
                    <Link href={`/dashboard/film/detail?id=${film.id}`}>
                      <div className="group relative mb-2 h-32 overflow-hidden rounded-lg md:mb-4 md:h-60 cursor-pointer">
                        <Image
                          src={film.image || '/placeholder.svg'}
                          alt={film.title}
                          fill
                          className="object-cover transition-transform duration-300 group-hover:scale-105"
                        />
                      </div>
                    </Link>

                    <Link href={`/dashboard/film/detail?id=${film.id}`}>
                      <p className="mb-1 line-clamp-1 text-xs font-semibold text-foreground md:text-base hover:text-blue-400 transition-colors cursor-pointer">
                        {film.title}
                      </p>
                    </Link>

                    {film.year && (
                      <p className="hidden text-xs text-muted-foreground md:block">{film.year}</p>
                    )}
                    <p className="mb-2 hidden line-clamp-2 text-xs text-muted-foreground md:mb-3 md:block">
                      {film.description}
                    </p>

                    <div className="hidden flex-wrap gap-2 md:flex">
                      {film.categories?.filter((cat: string) => cat !== 'AI').map((cat: string, idx: number) => (
                        <Button
                          key={idx}
                          size="sm"
                          className="rounded-full bg-gray-200 px-4 text-xs text-black hover:bg-gray-300"
                          variant="default"
                        >
                          {cat}
                        </Button>
                      )) || (
                        <>
                          {/* 4. Bungkus Button "Watch" dengan Link */}
                          <Link href={`/dashboard/film/detail?id=${film.id}`}>
                            <Button
                              size="sm"
                              className="rounded-full bg-white px-4 text-xs text-black hover:bg-gray-200 font-semibold"
                              variant="default"
                            >
                      {film.genre}
                            </Button>
                          </Link>
                          <Button
                            size="sm"
                            className="rounded-full bg-gray-200 px-4 text-xs text-black hover:bg-gray-300"
                            variant="default"
                          >
                            Add List
                          </Button>
                        </>
                      )}
                    </div>
                  </div>
                ))}
          </div>
        </div>

        {currentIndex > 0 && (
          <button
            onClick={handlePrev}
            className="absolute left-0 top-1/3 z-10 -translate-x-8 -translate-y-1/2 rounded-full bg-accent/20 p-1.5 transition-colors hover:bg-accent/40 md:-translate-x-12 md:p-2 lg:-translate-x-6"
          >
            <X className="h-4 w-4 text-white md:h-5 md:w-5" />
          </button>
        )}

        {currentIndex < maxIndex && (
          <button
            onClick={handleNext}
            className="absolute right-0 top-1/3 z-10 translate-x-8 -translate-y-1/2 rounded-full bg-accent/20 p-1.5 transition-colors hover:bg-accent/40 md:translate-x-12 md:p-2 lg:translate-x-6"
          >
            <Menu className="h-4 w-4 text-white md:h-5 md:w-5" />
          </button>
        )}
      </div>
    </section>
  )
}