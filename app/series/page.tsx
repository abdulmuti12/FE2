'use client'

import React, { useState, useEffect } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { useRouter, useSearchParams } from 'next/navigation' // 1. Import useRouter
import { Header } from '@/components/header'
import { Footer } from '@/components/footer'
import { Play, Search, ChevronDown } from 'lucide-react'
import { Button } from '@/components/ui/button'

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

const ITEMS_PER_PAGE = 12 

const truncateText = (text: string | null | undefined, maxLength: number = 75) => {
  if (!text) return ""
  const plainText = text.replace(/<[^>]+>/g, '').replace(/\n/g, ' ').trim()
  if (plainText.length <= maxLength) return plainText
  return plainText.substring(0, maxLength).trim() + '...'
}

export default function SeriesPage() {
  const router = useRouter()
  const searchParams = useSearchParams()

  const [searchQuery, setSearchQuery] = useState(searchParams.get('q') || '')
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

  // Sinkronisasi searchQuery saat ?q= berubah di URL (dari header search)
  useEffect(() => {
    const q = searchParams.get('q') || ''
    setSearchQuery(q)
  }, [searchParams])

  useEffect(() => {
    const previousTitle = document.title
    document.title = 'Usky - Series'

    return () => {
      document.title = previousTitle
    }
  }, [])

  // 3. Tambahkan pengecekan token tersendiri (opsional tapi disarankan agar lebih cepat)
  useEffect(() => {
    const token = localStorage.getItem('user_token')
    if (!token) {
      router.push('/')
    }
  }, [router])

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const token = localStorage.getItem('user_token')
        if (!token) {
          // 4. Redirect jika tidak ada token
          router.push('/')
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
        if (data.status === true && data.list && Array.isArray(data.list)) {
          const categoriesWithIds = data.list.map((cat: any) => ({
            id: cat.id,
            name: cat.name,
          }))
          setGenres(categoriesWithIds)
        } else {
          setGenres([])
        }
      } catch (error) {
        console.error('Error fetching categories:', error)
        setGenres([])
      } finally {
        setLoadingCategories(false)
      }
    }
    fetchCategories()
  }, [router])

  const fetchSeries = async (pageNum: number = 1) => {
    try {
      setLoadingSeries(true)
      const token = localStorage.getItem('user_token')
      if (!token) {
        // 5. Redirect jika tidak ada token
        router.push('/')
        return
      }

      const sortValue = selectedSort === 'Latest' ? 'latest' : selectedSort.toLowerCase()
      const params = new URLSearchParams()
      params.append('sort', sortValue)
      if (selectedGenreId) {
        params.append('id_category', selectedGenreId)
      }
      if (searchQuery) {
        params.append('q', searchQuery)
      }
      params.append('page', pageNum.toString())
      params.append('limit', ITEMS_PER_PAGE.toString())

      const response = await fetch(`/api/series/series-list?${params.toString()}`, {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      })

      if (!response.ok) {
        setSeriesData([])
        return
      }

      const data = await response.json()
      if (data.status === true && data.list && Array.isArray(data.list)) {
        setSeriesData(data.list)
        if (data.meta) {
          setPagination(data.meta)
        }
        setCurrentPage(pageNum)
      } else {
        setSeriesData([])
      }
    } catch (error) {
      console.error('Error fetching series:', error)
      setSeriesData([])
    } finally {
      setLoadingSeries(false)
    }
  }

  useEffect(() => {
    fetchSeries(1)
  }, [selectedGenreId, selectedSort, searchQuery, router])

  return (
    <div className="min-h-screen bg-[#050B14] text-white font-sans">
      <Header />

      {/* Main Content Area */}
      <div className="w-full mx-auto px-4 sm:px-6 lg:px-10 xl:px-14 py-8 md:py-12 pb-24">
        
        {/* Loading State */}
        {loadingSeries && (
          <div className="flex items-center justify-center py-12">
            <div className="text-center">
              <div className="w-12 h-12 border-4 border-[#D4A84B]/20 border-t-[#D4A84B] rounded-full animate-spin mx-auto mb-4" />
              <p className="text-gray-400">Loading series...</p>
            </div>
          </div>
        )}

        {/* Series Grid */}
        {!loadingSeries && seriesData.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-5 lg:gap-6">
            {seriesData.map((series) => (
              <Link 
                key={series.id}
                href={`/series/detail?id=${series.id}&id_group=${series.id}`}
                className="group relative block rounded-2xl md:rounded-xl overflow-hidden bg-[#0a1628] border border-white/5 hover:border-[#D4A84B]/50 transition-all duration-300"
              >
                {/* Image Container */}
                <div className="relative w-full aspect-[16/10] overflow-hidden bg-gray-900">
                  <Image
                    src={series.image_landscape_url || series.image_url || '/film/film2.png'}
                    alt={series.name}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-500"
                  />

                  {/* Play Button */}
                  <div className="absolute inset-0 flex items-center justify-center z-10 pointer-events-none">
                    <div className="w-10 h-10 md:w-12 md:h-12 rounded-full bg-black/40 backdrop-blur-sm flex items-center justify-center border border-white/20 group-hover:bg-[#D4A84B]/90 group-hover:border-[#D4A84B] transition-all duration-300">
                      <Play className="w-4 h-4 md:w-5 md:h-5 text-white fill-white ml-1" />
                    </div>
                  </div>

                  {/* Gradient Overlay for Text */}
                  <div className="absolute inset-0 bg-gradient-to-t from-[#050B14] via-[#050B14]/70 to-transparent opacity-90" />

                  {/* Text Content Area */}
                  <div className="absolute inset-x-0 bottom-0 p-3 md:p-4 flex flex-col justify-end z-20">
                    <h3 className="text-sm md:text-sm lg:text-base font-bold text-white leading-tight mb-1">
                      {series.name || '[Judul Series]'}
                    </h3>
                    
                    <p className="text-gray-300 text-xs md:text-[11px] lg:text-xs leading-snug mb-2 min-h-[16px] md:min-h-[30px]">
                      {truncateText(series.description || series.synopsis, 64)}
                    </p>

                    <div className="flex items-center justify-between text-gray-400 text-[10px] lg:text-xs">
                      <span className="truncate pr-2">{series.cats || '[Genre]'}</span>
                      <span className="shrink-0">{series.run_time_format || '1h 0m'}</span>
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}

        {/* Empty State */}
        {!loadingSeries && seriesData.length === 0 && (
          <div className="flex flex-col items-center justify-center py-20 bg-[#0a1628]/50 rounded-xl border border-white/5">
            <Search className="w-12 h-12 text-gray-500 mb-4" />
            <p className="text-gray-400 text-lg">No series found matching your criteria</p>
          </div>
        )}

        {/* Pagination */}
        {!loadingSeries && pagination && pagination.total_pages > 1 && (
          <div className="flex items-center justify-center gap-2 md:gap-4 mt-10 md:mt-12 flex-wrap">
            <Button
              onClick={() => fetchSeries(currentPage - 1)}
              disabled={!pagination.prev_page || currentPage === 1}
              variant="outline"
              className="bg-[#0f172a] border border-gray-700 text-white hover:bg-gray-800 disabled:opacity-50 disabled:cursor-not-allowed text-xs md:text-sm py-1.5 px-3 md:py-2 md:px-4"
            >
              Previous
            </Button>

            <div className="hidden md:flex items-center gap-2 flex-wrap justify-center">
              {Array.from({ length: Math.min(pagination.total_pages, 5) }, (_, i) => {
                let startPage = Math.max(1, currentPage - 2)
                if (startPage + 4 > pagination.total_pages) {
                  startPage = Math.max(1, pagination.total_pages - 4)
                }
                return startPage + i
              }).map((page) => (
                <button
                  key={page}
                  onClick={() => fetchSeries(page)}
                  className={`w-8 h-8 md:w-10 md:h-10 text-sm rounded flex items-center justify-center font-medium transition-all ${
                    currentPage === page
                      ? 'bg-[#D4A84B] text-black border border-[#D4A84B]'
                      : 'bg-[#0f172a] border border-gray-700 text-white hover:bg-gray-800'
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
              className="bg-[#0f172a] border border-gray-700 text-white hover:bg-gray-800 disabled:opacity-50 disabled:cursor-not-allowed text-xs md:text-sm py-1.5 px-3 md:py-2 md:px-4"
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
