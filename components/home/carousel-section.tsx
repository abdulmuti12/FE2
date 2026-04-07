'use client'

import { useRef } from 'react'
import Image from 'next/image'
import { ChevronLeft, ChevronRight } from 'lucide-react'
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
  viewAllLink = '/dashboard/film',
  items = [],
  layout = 'default',
}: CarouselSectionProps) {
  
  // Referensi untuk container scroll
  const scrollContainerRef = useRef<HTMLDivElement>(null)

  // Fungsi untuk menggeser card saat tombol diklik
  const scroll = (direction: 'left' | 'right') => {
    if (scrollContainerRef.current) {
      const scrollAmount = direction === 'left' ? -300 : 300
      scrollContainerRef.current.scrollBy({ left: scrollAmount, behavior: 'smooth' })
    }
  }

  const hasItems = layout === 'creator' ? creatorData.length > 0 : items.length > 0

  return (
    <section className="border-t border-border px-4 py-6 md:px-6 md:py-8 lg:px-12">
      <div className="mb-4 flex items-center justify-between md:mb-6">
        <h2 className="text-sm font-bold text-foreground md:text-2xl">{title}</h2>
        <Link 
          href={viewAllLink} 
          className="bg-white/10 px-4 py-1.5 rounded-full text-xs text-white hover:bg-white/20 transition-colors"
        >
          View All
        </Link>
      </div>

      <div className="relative group">
        
        {/* Tombol Kiri */}
        {hasItems && (
          <button
            onClick={() => scroll('left')}
            className="absolute -left-2 top-1/2 z-10 flex h-8 w-8 md:h-10 md:w-10 -translate-y-1/2 items-center justify-center rounded-full bg-[#003B79] md:bg-white/20 text-white backdrop-blur-md transition-colors hover:bg-white/40 shadow-lg md:-left-4"
            aria-label="Scroll left"
          >
            <ChevronLeft className="h-4 w-4 md:h-6 md:w-6" />
          </button>
        )}

        {/* CONTAINER SCROLL NATIVE */}
        <div 
          ref={scrollContainerRef}
          className="flex gap-4 md:gap-6 overflow-x-auto overflow-y-hidden snap-x snap-mandatory pb-4 scrollbar-hide [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]"
        >
          {layout === 'creator' ? (
            // LAYOUT CREATOR
            creatorData.map((item, idx) => (
              <div key={idx} className="w-[40vw] md:w-[150px] lg:w-[180px] flex-shrink-0 snap-center md:snap-start text-center cursor-pointer">
                <div className="mb-2 flex aspect-square w-full items-center justify-center rounded-full bg-gradient-to-br from-[#7c4c9f] to-[#4a2a6a] md:mb-3">
                  <span className="text-xl text-white md:text-4xl">👤</span>
                </div>
                <p className="line-clamp-1 text-xs font-medium text-foreground md:text-sm">
                  {item.name}
                </p>
                <p className="text-xs text-muted-foreground">{item.count}</p>
              </div>
            ))
          ) : (
            // LAYOUT DEFAULT (FILM)
            items.map((film) => (
              <div key={film.id} className="w-[90vw] flex-shrink-0 snap-center md:w-[240px] lg:w-[280px] md:snap-start">
                
                {/* =========================================
                    TAMPILAN KHUSUS MOBILE (SESUAI REFERENSI GAMBAR)
                    ========================================= */}
                <div className="overflow-hidden rounded-2xl bg-[#0a1122] md:hidden shadow-lg border border-white/5">
                  <Link href={`/dashboard/film/detail?id=${film.id}`}>
                    {/* Menggunakan aspect-[4/3] agar gambar lebih tinggi dan proporsional seperti di web */}
                    <div className="relative aspect-[4/3] w-full">
                      <Image
                        src={film.image || '/placeholder.svg'}
                        alt={film.title}
                        fill
                        className="object-cover" 
                      />
                    </div>
                  </Link>

                  <div className="p-4 md:p-5">
                    <div className="mb-2">
                      <Link href={`/dashboard/film/detail?id=${film.id}`}>
                        {/* Judul lebih besar dan tebal */}
                        <p className="line-clamp-1 text-[22px] font-bold tracking-wide text-white hover:text-blue-400 transition-colors">
                          {film.title}
                        </p>
                      </Link>
                    </div>

                    {/* Tahun dan deskripsi disejajarkan dan lebih terbaca */}
                    {film.year && (
                      <p className="text-[14px] text-gray-300">
                        {film.year}
                      </p>
                    )}

                    <p className="mb-4 line-clamp-2 text-[14px] leading-relaxed text-gray-300">
                      {film.description || "Watch groundbreaking films."}
                    </p>

                    {/* Tombol kategori diubah ukurannya agar sama dengan referensi */}
                    <div className="flex flex-wrap gap-2.5">
                      {film.categories?.filter((cat: string) => cat !== 'AI').length ? (
                        film.categories.filter((cat: string) => cat !== 'AI').slice(0, 2).map((cat: string, idx: number) => (
                          <Button
                            key={idx}
                            size="sm"
                            className="h-auto rounded-full bg-white px-5 py-1.5 text-[14px] font-semibold text-black hover:bg-gray-200"
                            variant="default"
                          >
                            {cat}
                          </Button>
                        ))
                      ) : film.cats ? (
                        <Button
                          size="sm"
                          className="h-auto rounded-full bg-white px-5 py-1.5 text-[14px] font-semibold text-black hover:bg-gray-200"
                          variant="default"
                        >
                          {film.cats}
                        </Button>
                      ) : (
                        <>
                          <Button
                            size="sm"
                            className="h-auto rounded-full bg-white px-5 py-1.5 text-[14px] font-semibold text-black hover:bg-gray-200"
                            variant="default"
                          >
                            Film
                          </Button>
                          <Button
                            size="sm"
                            className="h-auto rounded-full bg-white px-5 py-1.5 text-[14px] font-semibold text-black hover:bg-gray-200"
                            variant="default"
                          >
                            Adventure
                          </Button>
                        </>
                      )}
                    </div>
                  </div>
                </div>

                {/* =========================================
                    TAMPILAN KHUSUS DESKTOP 
                    ========================================= */}
                <div className="hidden md:block">
                  <Link href={`/dashboard/film/detail?id=${film.id}`}>
                    <div className="group relative mb-2 h-60 overflow-hidden rounded-lg md:mb-4 cursor-pointer">
                      <Image
                        src={film.image || '/placeholder.svg'}
                        alt={film.title}
                        fill
                        className="object-cover transition-transform duration-300 group-hover:scale-105"
                      />
                    </div>
                  </Link>

                  <div className="mb-1">
                    <Link href={`/dashboard/film/detail?id=${film.id}`}>
                      <p className="line-clamp-1 text-base font-semibold text-foreground hover:text-blue-400 transition-colors cursor-pointer">
                        {film.title}
                      </p>
                    </Link>
                  </div>

                  {film.year && (
                    <p className="text-xs text-muted-foreground">{film.year}</p>
                  )}
                  
                  <p className="mb-3 line-clamp-2 text-xs text-muted-foreground">
                    {film.description}
                  </p>

                  <div className="flex flex-wrap gap-2">
                    {film.categories?.filter((cat: string) => cat !== 'AI').length ? (
                      film.categories.filter((cat: string) => cat !== 'AI').map((cat: string, idx: number) => (
                        <Button
                          key={idx}
                          size="sm"
                          className="rounded-full bg-gray-200 px-4 text-xs text-black hover:bg-gray-300"
                          variant="default"
                        >
                          {cat}
                        </Button>
                      ))
                    ) : film.cats ? (
                      <Button
                        size="sm"
                        className="rounded-full bg-gray-200 px-4 text-xs text-black hover:bg-gray-300"
                        variant="default"
                      >
                        {film.cats}
                      </Button>
                    ) : (
                      <>
                        <Link href={`/dashboard/film/detail?id=${film.id}`}>
                          <Button
                            size="sm"
                            className="rounded-full bg-white px-4 text-xs text-black hover:bg-gray-200 font-semibold"
                            variant="default"
                          >
                            Film
                          </Button>
                        </Link>
                        <Button
                          size="sm"
                          className="rounded-full bg-gray-200 px-4 text-xs text-black hover:bg-gray-300"
                          variant="default"
                        >
                          Adventure
                        </Button>
                      </>
                    )}
                  </div>
                </div>

              </div>
            ))
          )}
        </div>

        {/* Tombol Kanan */}
        {hasItems && (
          <button
            onClick={() => scroll('right')}
            className="absolute -right-2 top-1/2 z-10 flex h-8 w-8 md:h-10 md:w-10 -translate-y-1/2 items-center justify-center rounded-full bg-[#003B79] md:bg-white/20 text-white backdrop-blur-md transition-colors hover:bg-white/40 shadow-lg md:-right-4"
            aria-label="Scroll right"
          >
            <ChevronRight className="h-4 w-4 md:h-6 md:w-6" />
          </button>
        )}

      </div>
    </section>
  )
}