'use client'

import React, { useMemo, useState } from 'react'
import { Header } from '@/components/header'
import { Footer } from '@/components/footer'
import { ChevronRight, Play, Info } from 'lucide-react'
import Image from 'next/image'

interface FilmCard {
  id: number
  title: string
  year: number
  duration: string
  description: string
  genres: string[]
  image: string
  type: 'film' | 'clip'
  category: string
}

const CATEGORIES = ['All', 'Action', 'Adventure', 'Horror', 'Comedy', 'Mystery','Video Clip','Kids','Story','Music','Fantasy']

const filmData: FilmCard[] = [
  {
    id: 1,
    title: '[Judul Film]',
    year: 2025,
    duration: '1h 0m',
    description:
      'Watch groundbreaking films crafted by human creativity and artificial intelligence.',
    genres: ['Action'],
    image: '/film/film1.png',
    type: 'film',
    category: 'Action',
  },
  {
    id: 2,
    title: '[Judul Film]',
    year: 2025,
    duration: '1h 0m',
    description:
      'Watch groundbreaking films crafted by human creativity and artificial intelligence.',
    genres: ['Action'],
    image: '/film/film2.png',
    type: 'film',
    category: 'Action',
  },
  {
    id: 3,
    title: '[Judul Film]',
    year: 2025,
    duration: '1h 0m',
    description:
      'Watch groundbreaking films crafted by human creativity and artificial intelligence.',
    genres: ['Action'],
    image: '/images/icon/action4.png',
    type: 'film',
    category: 'Action',
  },
  {
    id: 4,
    title: '[Judul Film]',
    year: 2025,
    duration: '1h 0m',
    description:
      'Watch groundbreaking films crafted by human creativity and artificial intelligence.',
    genres: ['Action'],
    image: '/images/icon/fantasy.png',
    type: 'film',
    category: 'Action',
  },
  {
    id: 5,
    title: '[Judul Film]',
    year: 2025,
    duration: '1h 0m',
    description:
      'Watch groundbreaking films crafted by human creativity and artificial intelligence.',
    genres: ['Adventure'],
    image: '/film/film1.png',
    type: 'film',
    category: 'Adventure',
  },
  {
    id: 6,
    title: '[Judul Film]',
    year: 2025,
    duration: '1h 0m',
    description:
      'Watch groundbreaking films crafted by human creativity and artificial intelligence.',
    genres: ['Adventure'],
    image: '/film/film2.png',
    type: 'film',
    category: 'Adventure',
  },
  {
    id: 7,
    title: '[Judul Film]',
    year: 2025,
    duration: '1h 0m',
    description:
      'Watch groundbreaking films crafted by human creativity and artificial intelligence.',
    genres: ['Adventure'],
    image: '/images/icon/adventure.png',
    type: 'film',
    category: 'Adventure',
  },
  {
    id: 8,
    title: '[Judul Film]',
    year: 2025,
    duration: '1h 0m',
    description:
      'Watch groundbreaking films crafted by human creativity and artificial intelligence.',
    genres: ['Adventure'],
    image: '/images/icon/horror.png',
    type: 'film',
    category: 'Adventure',
  },
  {
    id: 9,
    title: '[Judul Film]',
    year: 2025,
    duration: '1h 0m',
    description:
      'Watch groundbreaking films crafted by human creativity and artificial intelligence.',
    genres: ['Adventure'],
    image: '/images/icon/mystery.png',
    type: 'film',
    category: 'Adventure',
  },
  {
    id: 10,
    title: '[Judul Film]',
    year: 2025,
    duration: '1h 0m',
    description:
      'Watch groundbreaking films crafted by human creativity and artificial intelligence.',
    genres: ['Adventure'],
    image: '/images/icon/comedy.png',
    type: 'film',
    category: 'Adventure',
  },
]

export default function FilmPage() {
  const [selectedCategory, setSelectedCategory] = useState('All')
  const [hoveredFilmId, setHoveredFilmId] = useState<number | null>(null)

  const groupedByCategory = useMemo(() => {
    return CATEGORIES.reduce((acc, category) => {
      if (category === 'All') {
        acc[category] = filmData
      } else {
        acc[category] = filmData.filter((f) => f.category === category)
      }
      return acc
    }, {} as Record<string, FilmCard[]>)
  }, [])

  const categoriesWithContent = CATEGORIES.filter(
    (cat) => groupedByCategory[cat]?.length > 0
  )

  return (
    <div className="min-h-screen bg-[#020817] text-white font-sans">
      <Header />

      <div className="px-6 md:px-12 pb-20 pt-8">
        {/* Category Filter */}
        <div className="mb-12">
          <p className="text-sm text-gray-400 mb-4">Category</p>
          <div className="flex gap-2">
            {CATEGORIES.map((category) => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`px-4 py-2 rounded-lg text-sm ${
                  selectedCategory === category
                    ? 'bg-blue-600 text-white'
                    : 'bg-transparent text-gray-300 hover:bg-[#1e293b]'
                }`}
              >
                {category}
              </button>
            ))}
          </div>
        </div>

        {/* Film List */}
        <div className="space-y-12">
          {categoriesWithContent
            .filter((category) =>
              selectedCategory === 'All' ? true : category === selectedCategory
            )
            .map((category) => (
              <div key={category}>
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-lg font-bold text-white">{category}</h2>
                  <button className="text-sm text-blue-400 flex items-center gap-1">
                    View Categories
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>

                <div className="overflow-x-auto pb-8">
                  <div className="flex gap-6 min-w-max items-end">
                    {groupedByCategory[category].map((film) => {
                      const isHovered = hoveredFilmId === film.id

                      return (
                        <div
                          key={film.id}
                          className="relative transition-all duration-300 ease-out"
                          onMouseEnter={() => setHoveredFilmId(film.id)}
                          onMouseLeave={() => setHoveredFilmId(null)}
                        >
                          {/* CARD */}
                          <div
                            className={`
                              relative rounded-2xl overflow-hidden bg-[#0f172a]
                              transition-all duration-300 ease-out
                              ${isHovered ? 'w-[520px] h-[300px] z-30' : 'w-[260px] h-[300px]'}
                            `}
                          >
                            <Image
                              src={film.image}
                              alt={film.title}
                              fill
                              className="object-cover"
                            />

                            {isHovered && (
                              <>
                                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent" />

                                <div className="absolute left-6 right-6 bottom-6">
                                  <h3 className="text-white text-xl font-semibold mb-3">
                                    {film.title}
                                  </h3>

                                  <div className="flex items-center gap-3 mb-3">
                                    <button className="flex items-center gap-2 bg-white text-black px-5 py-2 rounded-full text-sm font-semibold">
                                      <Play className="w-4 h-4 fill-black" />
                                      Watch Now
                                    </button>

                                    <button className="w-10 h-10 rounded-full border border-white/30 bg-white/10 flex items-center justify-center">
                                      <Info className="w-5 h-5 text-white" />
                                    </button>
                                  </div>

                                  <p className="text-sm text-white/70 line-clamp-2 max-w-[440px]">
                                    {film.description}
                                  </p>
                                </div>
                              </>
                            )}
                          </div>
                        </div>
                      )
                    })}
                  </div>
                </div>
              </div>
            ))}
        </div>
      </div>

      <Footer />
    </div>
  )
}
