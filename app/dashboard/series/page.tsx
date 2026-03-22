'use client'

import React, { useState, useEffect } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { Header } from '@/components/header'
import { Footer } from '@/components/footer'
import { Play, Search, ChevronDown } from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'

interface Category {
  id: string
  name: string
}

interface SeriesItem {
  id: string
  name: string
  description: string
  run_time: string
  run_time_format: string
  years: string
  image_url: string
  image_landscape_url: string
  video_url: string
  synopsis: string
  rates: string
  favorit: string
  cats: string
}

interface PaginationMeta {
  prev_page: number
  next_page: number
  total_rows: number
  per_page: number
  current_page: number
  total_pages: number
  html_links: string
}

const CREATORS = ['All Creator', 'Creator A', 'Creator B', 'Creator C']
const SORT_OPTIONS = ['Latest', 'Oldest', 'Popular', 'A-Z']
const ITEMS_PER_PAGE = 8

export default function SeriesPage() {
  const [genres, setGenres] = useState<Category[]>([])
  const [selectedGenre, setSelectedGenre] = useState('All Genre')
  const [selectedGenreId, setSelectedGenreId] = useState('')
  const [selectedCreator, setSelectedCreator] = useState('All Creator')
  const [selectedSort, setSelectedSort] = useState('Latest')
  const [searchGenre, setSearchGenre] = useState('')
  const [isGenreDropdownOpen, setIsGenreDropdownOpen] = useState(false)
  const [loadingCategories, setLoadingCategories] = useState(true)
  
  const [seriesData, setSeriesData] = useState<SeriesItem[]>([])
  const [loadingSeries, setLoadingSeries] = useState(false)
  const [currentPage, setCurrentPage] = useState(1)
  const [pagination, setPagination] = useState<PaginationMeta | null>(null)

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const token = localStorage.getItem('user_token')
        
        if (!token) {
          setGenres([])
          setLoadingCategories(false)
          return
        }

        const response = await fetch('/api/series/series-categories', {
          method: 'GET',
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        })

        const data = await response.json()
        console.log('[v0] Categories response:', data)

        if (data.status === true && data.list && Array.isArray(data.list)) {
          const categoriesWithIds = data.list.map((cat: any) => ({
            id: cat.id,
            name: cat.name,
          }))
          console.log('[v0] Categories loaded:', categoriesWithIds.length)
          setGenres(categoriesWithIds)
        } else {
          console.error('[v0] Invalid categories response format')
          setGenres([])
        }
      } catch (error) {
        console.error('[v0] Error fetching categories:', error)
        setGenres([])
      } finally {
        setLoadingCategories(false)
      }
    }

    fetchCategories()
  }, [])

  const fetchSeries = async (pageNum: number = 1) => {
    try {
      setLoadingSeries(true)
      console.log('[v0] Fetching series list - Page:', pageNum, 'Category:', selectedGenreId)

      const token = localStorage.getItem('user_token')
      if (!token) {
        console.log('[v0] No token found')
        setSeriesData([])
        setLoadingSeries(false)
        return
      }

      const sortValue = selectedSort === 'Latest' ? 'latest' : selectedSort.toLowerCase()
      const params = new URLSearchParams()
      params.append('sort', sortValue)
      if (selectedGenreId) {
        params.append('id_category', selectedGenreId)
      }
      params.append('page', pageNum.toString())
      params.append('limit', ITEMS_PER_PAGE.toString())

      console.log('[v0] Request params:', Object.fromEntries(params))

      const response = await fetch(`/api/series/series-list?${params.toString()}`, {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      })


      if (!response.ok) {
        console.error('[v0] API request failed with status:', response.status)
        const errorData = await response.json().catch(() => ({}))
        console.error('[v0] Error details:', errorData)
        setSeriesData([])
        return
      }

      const data = await response.json()
      console.log('[v0] Series list response:', {
        status: data.status,
        listCount: data.list?.length || 0,
        meta: data.meta,
      })

      if (data.status === true && data.list && Array.isArray(data.list)) {
        console.log('[v0] Series data loaded successfully')
        setSeriesData(data.list)
        if (data.meta) {
          setPagination(data.meta)
        }
        setCurrentPage(pageNum)
      } else {
        console.error('[v0] Invalid response format:', {
          hasStatus: !!data.status,
          hasList: !!data.list,
          isArray: Array.isArray(data.list),
        })
        setSeriesData([])
      }
    } catch (error) {
      console.error('[v0] Error fetching series:', error)
      setSeriesData([])
    } finally {
      setLoadingSeries(false)
    }
  }

  // Fetch series when genre or sort changes
  useEffect(() => {
    fetchSeries(1)
  }, [selectedGenreId, selectedSort])

  const filteredGenres = genres.filter((genre) =>
    genre.name.toLowerCase().includes(searchGenre.toLowerCase())
  )

  return (
    <div className="min-h-screen bg-[#050B14] text-white font-sans">
      <Header />

      <div className="max-w-7xl mx-auto px-6 md:px-12 py-12 pb-24">
        {/* Filter Section */}
        <div className="mb-8">
          {/* Title */}
          <h1 className="text-4xl md:text-5xl font-bold mb-8">Series</h1>

          {/* Filter Controls */}
          <div className="flex flex-wrap items-center justify-between gap-4 md:gap-6">
            {/* Left Filter Group */}
            <div className="flex flex-wrap items-center gap-4 md:gap-6">
              {/* Genre Dropdown */}
              <div className="relative w-full md:w-48">
              <DropdownMenu open={isGenreDropdownOpen} onOpenChange={setIsGenreDropdownOpen}>
                <DropdownMenuTrigger asChild>
                  <button className="w-full flex items-center justify-between px-4 py-2 bg-[#0f172a] border border-gray-700 rounded-lg text-white hover:bg-gray-900 transition-colors">
                    <span className="truncate">{selectedGenre}</span>
                    <ChevronDown className="w-4 h-4 ml-2 flex-shrink-0" />
                  </button>
                </DropdownMenuTrigger>

                <DropdownMenuContent className="w-48 bg-[#0f172a] border border-gray-700 rounded-lg">
                  {/* Search Input */}
                  {genres.length > 0 && (
                    <div className="px-3 py-2 border-b border-gray-700">
                      <div className="flex items-center gap-2 bg-[#1a1a2e] rounded px-2 py-1">
                        <Search className="w-4 h-4 text-gray-500" />
                        <input
                          type="text"
                          placeholder="Search genre..."
                          value={searchGenre}
                          onChange={(e) => setSearchGenre(e.target.value)}
                          className="flex-1 bg-transparent outline-none text-white text-sm placeholder-gray-500"
                        />
                      </div>
                    </div>
                  )}

                  {/* Genre Options */}
                  <DropdownMenuItem
                    onClick={() => {
                      setSelectedGenre('All Genre')
                      setSelectedGenreId('')
                      setIsGenreDropdownOpen(false)
                      setSearchGenre('')
                    }}
                    className="px-4 py-2 text-white hover:bg-[#1e293b] cursor-pointer"
                  >
                    All Genre
                  </DropdownMenuItem>
                  {filteredGenres.map((genre) => (
                    <DropdownMenuItem
                      key={genre.id}
                      onClick={() => {
                        setSelectedGenre(genre.name)
                        setSelectedGenreId(genre.id)
                        setIsGenreDropdownOpen(false)
                        setSearchGenre('')
                      }}
                      className="px-4 py-2 text-white hover:bg-[#1e293b] cursor-pointer"
                    >
                      {genre.name}
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>
            </div>

              {/* Sort Dropdown */}
              <div className="relative w-full md:w-48">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <button className="w-full flex items-center justify-between px-4 py-2 bg-[#0f172a] border border-gray-700 rounded-lg text-white hover:bg-gray-900 transition-colors">
                      <span>{selectedSort}</span>
                      <ChevronDown className="w-4 h-4 ml-2" />
                    </button>
                  </DropdownMenuTrigger>

                  <DropdownMenuContent className="w-48 bg-[#0f172a] border border-gray-700 rounded-lg">
                    {SORT_OPTIONS.map((sort) => (
                      <DropdownMenuItem
                        key={sort}
                        onClick={() => setSelectedSort(sort)}
                        className="px-4 py-2 text-white hover:bg-[#1e293b] cursor-pointer"
                      >
                        {sort}
                      </DropdownMenuItem>
                    ))}
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </div>

            {/* Creator Dropdown - Right Side */}
            <div className="w-full md:w-48">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <button className="w-full flex items-center justify-between px-4 py-2 bg-[#0f172a] border border-gray-700 rounded-lg text-white hover:bg-gray-900 transition-colors">
                    <span>{selectedCreator}</span>
                    <ChevronDown className="w-4 h-4 ml-2" />
                  </button>
                </DropdownMenuTrigger>

                <DropdownMenuContent className="w-48 bg-[#0f172a] border border-gray-700 rounded-lg">
                  {CREATORS.map((creator) => (
                    <DropdownMenuItem
                      key={creator}
                      onClick={() => setSelectedCreator(creator)}
                      className="px-4 py-2 text-white hover:bg-[#1e293b] cursor-pointer"
                    >
                      {creator}
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </div>

        {/* Loading State */}
        {loadingSeries && (
          <div className="flex items-center justify-center py-12">
            <div className="text-center">
              <div className="w-12 h-12 border-4 border-white/20 border-t-white rounded-full animate-spin mx-auto mb-4" />
              <p className="text-gray-400">Loading series...</p>
            </div>
          </div>
        )}

        {/* Series Grid */}
        {!loadingSeries && seriesData.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 md:gap-6">
            {seriesData.map((series) => (
              <Link 
                key={series.id}
                href={`/dashboard/series/detail?id=${series.id}`}
                className="group relative overflow-hidden rounded-2xl md:rounded-lg bg-[#1e293b] hover:shadow-lg transition-all duration-300"
              >
                {/* Image Container */}
                <div className="relative w-full aspect-[3/4] overflow-hidden bg-gray-800">
                  <Image
                    src={series.image_landscape_url || series.image_url || '/film/film2.png'}
                    alt={series.name}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-300"
                  />

                  {/* Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/35 to-transparent" />

                  {/* Text overlay */}
                  <div className="absolute inset-0 flex flex-col justify-end p-4">
                    <h3 className="text-2xl font-bold text-white leading-tight mb-2 line-clamp-2">
                      {series.name}
                    </h3>

                    <p className="text-white/75 text-base leading-snug mb-6 line-clamp-3">
                      {series.synopsis}
                    </p>

                    <div className="flex items-end justify-between text-white/70">
                      <span className="text-sm font-medium">{series.cats}</span>
                      <span className="text-sm font-medium">{series.run_time_format}</span>
                    </div>
                  </div>

                  {/* Hover Play */}
                  <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                    <button className="w-12 h-12 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center hover:bg-white/30 transition-colors">
                      <Play className="w-6 h-6 text-white fill-white" />
                    </button>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}

        {/* Empty State */}
        {!loadingSeries && seriesData.length === 0 && (
          <div className="flex items-center justify-center py-12">
            <p className="text-gray-400 text-lg">No series found</p>
          </div>
        )}

        {/* Pagination */}
        {!loadingSeries && pagination && pagination.total_pages > 1 && (
          <div className="flex items-center justify-center gap-4 mt-12 flex-wrap">
            <Button
              onClick={() => fetchSeries(currentPage - 1)}
              disabled={!pagination.prev_page || currentPage === 1}
              variant="outline"
              className="bg-[#0f172a] border border-gray-700 text-white hover:bg-gray-900 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Previous
            </Button>

            <div className="flex items-center gap-2 flex-wrap justify-center">
              {Array.from({ length: Math.min(pagination.total_pages, 5) }, (_, i) => {
                const startPage = Math.max(1, currentPage - 2)
                return startPage + i
              }).map((page) => (
                <button
                  key={page}
                  onClick={() => fetchSeries(page)}
                  className={`w-10 h-10 rounded flex items-center justify-center font-medium transition-all ${
                    currentPage === page
                      ? 'bg-white text-black'
                      : 'bg-[#0f172a] border border-gray-700 text-white hover:bg-gray-900'
                  }`}
                >
                  {page}
                </button>
              ))}
            </div>

            <Button
              onClick={() => fetchSeries(currentPage + 1)}
              disabled={!pagination.next_page || currentPage === pagination.total_pages}
              variant="outline"
              className="bg-[#0f172a] border border-gray-700 text-white hover:bg-gray-900 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Next
            </Button>
          </div>
        )}
      </div>

      <Footer />
    </div>
  )
}
