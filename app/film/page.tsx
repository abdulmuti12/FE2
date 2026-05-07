'use client'

import React, { useMemo, useState, useEffect } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { Header } from '@/components/header'
import { Footer } from '@/components/footer'
import { ChevronRight, Play, Info } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'

// ============================================================================
// Types
// ============================================================================

interface Film {
  id: string
  name: string
  image_url: string
  image_landscape_url: string
  years: string
  run_time_format: string
  synopsis: string
  genre: string
  cats?: string
  jud_url?: string
}

interface Category {
  id: string
  name: string
}

// ============================================================================
// Constants - API
// ============================================================================

const API_ENDPOINTS = {
  FILMS_LIST: '/api/film/list',
  FILMS_CATEGORY: '/api/film/category',
} as const

const API_PARAMS = {
  FILMS_LIMIT: 10,
  FILMS_SORT: 'latest',
  FILMS_VIEW_TYPE: 'portrait',
} as const

// ============================================================================
// Constants - UI
// ============================================================================

const UI = {
  CATEGORY_ALL: 'All',
  FILMS_PER_SECTION: 5,
  STORAGE_KEY: 'user_token',
} as const

// ============================================================================
// Helper Functions - API
// ============================================================================

const getAuthHeaders = (token: string) => ({
  Authorization: `Bearer ${token}`,
  'Content-Type': 'application/json',
})

const buildFilmsUrl = (
  categoryId: string,
  page: number,
  q?: string
): string => {
  const params = new URLSearchParams({
    sort: API_PARAMS.FILMS_SORT,
    id_category: categoryId,
    page: page.toString(),
    limit: API_PARAMS.FILMS_LIMIT.toString(),
    view_type: API_PARAMS.FILMS_VIEW_TYPE,
  })
  if (q) {
    params.append('q', q)
  }
  return `${API_ENDPOINTS.FILMS_LIST}?${params}`
}

// ============================================================================
// Helper Functions - Data Processing
// ============================================================================

const buildDisplayCategories = (categories: Category[]): string[] => {
  return [UI.CATEGORY_ALL, ...categories.map(c => c.name)]
}

const groupFilmsByCategory = (
  films: Film[],
  categories: string[]
): Record<string, Film[]> => {
  const acc: Record<string, Film[]> = {}

  if (!films || films.length === 0) {
    return acc
  }

  categories.forEach(category => {
    if (category === UI.CATEGORY_ALL) {
      acc[category] = films
    } else {
      acc[category] = films.filter((f) => f.cats === category)
    }
  })

  return acc
}

// ============================================================================
// Component
// ============================================================================

export default function FilmPage() {
  const router = useRouter()
  const searchParams = useSearchParams()

  const [searchQuery, setSearchQuery] = useState(searchParams.get('q') || '')
  const [films, setFilms] = useState<Film[]>([])
  const [categories, setCategories] = useState<Category[]>([])
  const [selectedCategory, setSelectedCategory] = useState<string>(UI.CATEGORY_ALL)
  const [hoveredFilmId, setHoveredFilmId] = useState<string | null>(null)
  const [expandedCategories, setExpandedCategories] = useState<Record<string, boolean>>({})
  const [loading, setLoading] = useState(true)
  const [page, setPage] = useState(1)

  // Sinkronisasi searchQuery saat ?q= berubah di URL (dari header search)
  useEffect(() => {
    const q = searchParams.get('q') || ''
    setSearchQuery(q)
  }, [searchParams])

  useEffect(() => {
    const previousTitle = document.title
    document.title = 'Usky - Film'

    return () => {
      document.title = previousTitle
    }
  }, [])

  // Effects - Fetch Films
  useEffect(() => {
    const fetchFilms = async () => {
      try {
        const token = localStorage.getItem(UI.STORAGE_KEY)

        if (!token) {
          setFilms([])
          setLoading(false)
          return
        }

        const categoryId = selectedCategory === UI.CATEGORY_ALL ? '' : selectedCategory
        const url = buildFilmsUrl(categoryId, page, searchQuery)

        const response = await fetch(url, {
          method: 'GET',
          headers: getAuthHeaders(token),
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
  }, [selectedCategory, page, searchQuery])

  // Effects - Fetch Categories
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const token = localStorage.getItem(UI.STORAGE_KEY)

        if (!token) {
          setCategories([])
          return
        }

        const response = await fetch(API_ENDPOINTS.FILMS_CATEGORY, {
          method: 'GET',
          headers: getAuthHeaders(token),
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

  // Computed Values
  const displayCategories = buildDisplayCategories(categories)

  const groupedByCategory = useMemo(() => {
    return groupFilmsByCategory(films, displayCategories)
  }, [films, displayCategories])

  const categoriesWithContent = displayCategories.filter(
    (cat) => groupedByCategory[cat]?.length > 0
  )

  // Handlers
  const handleCategorySelect = (category: string) => {
    setSelectedCategory(category)
    setPage(1)
  }

  const handleToggleExpand = (category: string) => {
    setExpandedCategories((prev) => ({
      ...prev,
      [category]: !prev[category],
    }))
  }

  return (
    <div className="min-h-screen bg-[#020817] text-white font-sans">
      <Header />

      <div className="px-4 md:px-12 pb-20 pt-8">
        {/* Category Filter - Scrollable on mobile */}
        <div className="mb-8 md:mb-12">
          <p className="text-sm text-gray-400 mb-3 md:mb-4">Category</p>
          {loading && films.length === 0 ? (
            <div className="text-gray-400 text-sm">Loading films...</div>
          ) : (
            <div className="flex gap-2 overflow-x-auto whitespace-nowrap pb-2 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:'none'] [scrollbar-width:'none']">
              {displayCategories.map((category) => (
                <button
                  key={category}
                  onClick={() => handleCategorySelect(category)}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
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
        ) : selectedCategory === UI.CATEGORY_ALL ? (
          // All Category View - No grouping headers
          <div className="pb-4 md:pb-8">
            <div className="grid grid-cols-2 gap-2 sm:grid-cols-3 md:grid-cols-5 gap-3 md:gap-4 transition-all duration-500">
              {films.map((film) => {
                const isHovered = hoveredFilmId === film.id

                return (
                  <div
                    key={film.id}
                    className="relative transition-all duration-300 ease-out cursor-pointer group"
                    onMouseEnter={() => setHoveredFilmId(film.id)}
                    onMouseLeave={() => setHoveredFilmId(null)}
                  >
                    <Link href={`/film/detail?judul=${film.jud_url || film.id}`} className="block">
                      <div
                        className="relative rounded-xl overflow-hidden bg-[#0f172a] transition-all duration-300 ease-out w-full aspect-[2/3]"
                      >
                        <Image
                          src={film.image_url}
                          alt={film.name}
                          fill
                          className="object-cover transition-transform duration-500 group-hover:scale-110"
                          unoptimized
                        />

                        {/* Mobile Info - Always visible with gradient */}
                        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent md:hidden" />
                        <div className="absolute left-3 right-3 bottom-3 md:hidden">
                          <h3 className="text-white text-xs font-semibold line-clamp-1 mb-1">
                            {film.name}
                          </h3>
                          <p className="text-[9px] text-gray-400">
                            {film.years} • {film.run_time_format}
                          </p>
                        </div>

                        {/* Desktop Hover Effect */}
                        <div className="hidden md:block">
                          {isHovered && (
                            <>
                              <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent" />
                              <div className="absolute inset-0 flex flex-col justify-end p-4">
                                <h3 className="text-white text-sm font-semibold mb-2 line-clamp-2">
                                  {film.name}
                                </h3>
                                <div className="flex items-center gap-2 mb-2">
                                  <div className="flex items-center gap-1 bg-white text-black px-3 py-1 rounded-full text-xs font-semibold hover:bg-gray-100 transition-colors">
                                    <Play className="w-3 h-3 fill-black" />
                                    Watch
                                  </div>
                                  <div className="w-7 h-7 rounded-full border border-white/30 bg-white/10 flex items-center justify-center hover:bg-white/20 transition-colors text-xs">
                                    <Info className="w-4 h-4 text-white" />
                                  </div>
                                </div>
                                <p className="text-xs text-white/70 line-clamp-1">
                                  {film.years}
                                </p>
                              </div>
                            </>
                          )}
                        </div>
                      </div>
                    </Link>
                  </div>
                )
              })}
            </div>
          </div>
        ) : (
          // Category Specific View - With grouping headers
          <div className="space-y-10 md:space-y-12">
            {categoriesWithContent
              .filter((category) => category === selectedCategory)
              .map((category) => {
                const isExpanded = expandedCategories[category] || false
                const filmsToShow = isExpanded
                  ? groupedByCategory[category]
                  : groupedByCategory[category].slice(0, UI.FILMS_PER_SECTION)

                return (
                  <div key={category}>
                    <div className="flex items-center justify-between mb-4 md:mb-6">
                      <h2 className="text-base md:text-lg font-bold text-white">{category}</h2>

                      {groupedByCategory[category].length > UI.FILMS_PER_SECTION && (
                        <button
                          onClick={() => handleToggleExpand(category)}
                          className="text-xs md:text-sm text-blue-400 flex items-center gap-1 hover:text-blue-300 transition-colors"
                        >
                          {isExpanded ? 'Show Less' : 'View All'}
                          <ChevronRight
                            className={`w-3 h-3 md:w-4 md:h-4 transition-transform duration-300 ${isExpanded ? 'rotate-90' : ''}`}
                          />
                        </button>
                      )}
                    </div>

                    <div className="pb-4 md:pb-8">
                      <div className="grid grid-cols-2 gap-2 sm:grid-cols-3 md:grid-cols-5 gap-3 md:gap-4 transition-all duration-500">
                        {filmsToShow.map((film) => {
                          const isHovered = hoveredFilmId === film.id

                          return (
                            <div
                              key={film.id}
                              className="relative transition-all duration-300 ease-out cursor-pointer group"
                              onMouseEnter={() => setHoveredFilmId(film.id)}
                              onMouseLeave={() => setHoveredFilmId(null)}
                            >
                              <Link href={`/film/detail?judul=${film.jud_url || film.id}`} className="block">
                                <div
                                  className="relative rounded-xl overflow-hidden bg-[#0f172a] transition-all duration-300 ease-out w-full aspect-[2/3]"
                                >
                                  <Image
                                    src={film.image_url}
                                    alt={film.name}
                                    fill
                                    className="object-cover transition-transform duration-500 group-hover:scale-110"
                                    unoptimized
                                  />

                                  {/* Mobile Info - Always visible with gradient */}
                                  <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent md:hidden" />
                                  <div className="absolute left-3 right-3 bottom-3 md:hidden">
                                    <h3 className="text-white text-xs font-semibold line-clamp-1 mb-1">
                                      {film.name}
                                    </h3>
                                    <p className="text-[9px] text-gray-400">
                                      {film.years} • {film.run_time_format}
                                    </p>
                                  </div>

                                  {/* Desktop Hover Effect */}
                                  <div className="hidden md:block">
                                    {isHovered && (
                                      <>
                                        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent" />
                                        <div className="absolute inset-0 flex flex-col justify-end p-4">
                                          <h3 className="text-white text-sm font-semibold mb-2 line-clamp-2">
                                            {film.name}
                                          </h3>
                                          <div className="flex items-center gap-2 mb-2">
                                            <div className="flex items-center gap-1 bg-white text-black px-3 py-1 rounded-full text-xs font-semibold hover:bg-gray-100 transition-colors">
                                              <Play className="w-3 h-3 fill-black" />
                                              Watch
                                            </div>
                                            <div className="w-7 h-7 rounded-full border border-white/30 bg-white/10 flex items-center justify-center hover:bg-white/20 transition-colors text-xs">
                                              <Info className="w-4 h-4 text-white" />
                                            </div>
                                          </div>
                                          <p className="text-xs text-white/70 line-clamp-1">
                                            {film.years}
                                          </p>
                                        </div>
                                      </>
                                    )}
                                  </div>
                                </div>
                              </Link>
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
