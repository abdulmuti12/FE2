'use client'

import React, { useMemo, useState, useEffect } from 'react'
import { Header } from '@/components/header'
import { Footer } from '@/components/footer'
import { ChevronRight, Play, Info } from 'lucide-react'
import Image from 'next/image'

interface Film {
  id: string
  name: string
  image_url: string
  image_landscape_url: string
  years: string
  run_time_format: string
  synopsis: string
  cats: string
}

interface Category {
  id: string
  name: string
}

export default function FilmPage() {
  const [films, setFilms] = useState<Film[]>([])
  const [categories, setCategories] = useState<Category[]>([])
  const [selectedCategory, setSelectedCategory] = useState('All')
  const [hoveredFilmId, setHoveredFilmId] = useState<string | null>(null)
  const [expandedCategories, setExpandedCategories] = useState<Record<string, boolean>>({})
  const [loading, setLoading] = useState(true)
  const [page, setPage] = useState(1)

  // Fetch films from API
  useEffect(() => {
    const fetchFilms = async () => {
      try {
        const token = localStorage.getItem('user_token')
        
        if (!token) {
          setFilms([])
          setLoading(false)
          return
        }

        const categoryId = selectedCategory === 'All' ? '' : selectedCategory
        const response = await fetch(`/api/film/list?sort=latest&id_category=${categoryId}&page=${page}&limit=10&view_type=portrait`, {
          method: 'GET',
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        })

        const data = await response.json()

        if (data.status === true && data.list && Array.isArray(data.list)) {
          setFilms(data.list)
        } else {
          setFilms([])
        }
      } catch (error) {
        console.error('[v0] Error fetching films:', error)
        setFilms([])
      } finally {
        setLoading(false)
      }
    }

    fetchFilms()
  }, [selectedCategory, page])

  // Fetch categories from API
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const token = localStorage.getItem('user_token')
        
        if (!token) {
          setCategories([])
          return
        }

        const response = await fetch('/api/film/category', {
          method: 'GET',
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        })

        const data = await response.json()

        if (data.status === true && data.list && Array.isArray(data.list)) {
          setCategories(data.list)
        } else {
          setCategories([])
        }
      } catch (error) {
        console.error('[v0] Error fetching categories:', error)
        setCategories([])
      }
    }

    fetchCategories()
  }, [])

  // Build categories array with 'All' option
  const displayCategories = ['All', ...categories.map(c => c.name)]

  const groupedByCategory = useMemo(() => {
    const acc: Record<string, Film[]> = {}
    
    if (!films || films.length === 0) {
      return acc
    }

    displayCategories.forEach(category => {
      if (category === 'All') {
        acc[category] = films
      } else {
        acc[category] = films.filter((f) => f.cats === category)
      }
    })
    
    return acc
  }, [films, displayCategories])

  const categoriesWithContent = displayCategories.filter(
    (cat) => groupedByCategory[cat]?.length > 0
  )

  const toggleExpand = (category: string) => {
    setExpandedCategories((prev) => ({
      ...prev,
      [category]: !prev[category],
    }))
  }

  return (
    <div className="min-h-screen bg-[#020817] text-white font-sans">
      <Header />

      <div className="px-6 md:px-12 pb-20 pt-8">
        {/* Category Filter */}
        <div className="mb-12">
          <p className="text-sm text-gray-400 mb-4">Category</p>
          {loading && films.length === 0 ? (
            <div className="text-gray-400 text-sm">Loading films...</div>
          ) : (
            <div className="flex gap-2 flex-wrap">
              {displayCategories.map((category) => (
                <button
                  key={category}
                  onClick={() => {
                    setSelectedCategory(category)
                    setPage(1)
                  }}
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
          )}
        </div>

        {/* Film List */}
        {loading ? (
          <div className="text-gray-400 text-center py-12">Loading films...</div>
        ) : films.length === 0 ? (
          <div className="text-gray-400 text-center py-12">No films available</div>
        ) : (
          <div className="space-y-12">
            {categoriesWithContent
              .filter((category) =>
                selectedCategory === 'All' ? true : category === selectedCategory
              )
              .map((category) => {
                const isExpanded = expandedCategories[category] || false
                const filmsToShow = isExpanded
                  ? groupedByCategory[category]
                  : groupedByCategory[category].slice(0, 5)

                return (
                  <div key={category}>
                    <div className="flex items-center justify-between mb-6">
                      <h2 className="text-lg font-bold text-white">{category}</h2>
                      
                      {groupedByCategory[category].length > 5 && (
                        <button 
                          onClick={() => toggleExpand(category)}
                          className="text-sm text-blue-400 flex items-center gap-1 hover:text-blue-300 transition-colors"
                        >
                          {isExpanded ? 'Show Less' : 'View All'}
                          <ChevronRight 
                            className={`w-4 h-4 transition-transform duration-300 ${isExpanded ? 'rotate-90' : ''}`} 
                          />
                        </button>
                      )}
                    </div>

                    <div className="pb-8">
                      <div className="flex flex-wrap gap-6 items-end transition-all duration-500">
                        {filmsToShow.map((film) => {
                          const isHovered = hoveredFilmId === film.id

                          return (
                            <div
                              key={film.id}
                              className="relative transition-all duration-300 ease-out"
                              onMouseEnter={() => setHoveredFilmId(film.id)}
                              onMouseLeave={() => setHoveredFilmId(null)}
                            >
                              <div
                                className={`
                                  relative rounded-2xl overflow-hidden bg-[#0f172a]
                                  transition-all duration-300 ease-out
                                  ${isHovered ? 'w-[520px] h-[300px] z-30' : 'w-[260px] h-[300px]'}
                                `}
                              >
                                <Image
                                  src={film.image_url}
                                  alt={film.name}
                                  fill
                                  className="object-cover"
                                  unoptimized
                                />

                                {isHovered && (
                                  <>
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent" />
                                    <div className="absolute left-6 right-6 bottom-6">
                                      <h3 className="text-white text-xl font-semibold mb-3">
                                        {film.name}
                                      </h3>
                                      <div className="flex items-center gap-3 mb-3">
                                        <button className="flex items-center gap-2 bg-white text-black px-5 py-2 rounded-full text-sm font-semibold hover:bg-gray-100 transition-colors">
                                          <Play className="w-4 h-4 fill-black" />
                                          Watch Now
                                        </button>
                                        <button className="w-10 h-10 rounded-full border border-white/30 bg-white/10 flex items-center justify-center hover:bg-white/20 transition-colors">
                                          <Info className="w-5 h-5 text-white" />
                                        </button>
                                      </div>
                                      <p className="text-sm text-white/70 line-clamp-2 max-w-[440px]">
                                        {film.synopsis || `${film.name} • ${film.years} • ${film.run_time_format}`}
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
                )
              })}
          </div>
        )}
      </div>

      <Footer />
    </div>
  )
}
