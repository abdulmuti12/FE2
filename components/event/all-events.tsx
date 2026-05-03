'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { ChevronRight, ChevronLeft, Calendar, Filter, ChevronDown } from 'lucide-react'

interface EventItem {
  id: string
  title: string
  image?: string
  image_url?: string
  tgl_live?: string
  from_dates?: string
  start_date?: string
  event_category?: {
    name: string
  }
}

interface Category {
  id: string
  name: string
}

interface AllEventsProps {
  allEvents: EventItem[]
  currentPage: number
  totalPages: number
  onPageChange: (page: number) => void
  loading?: boolean
  onSortChange?: (sort: string) => void
  onCategoryChange?: (category: string) => void
  onPartnerChange?: (partner: string) => void
  currentSort?: string
  categories?: Category[]
  categoriesLoading?: boolean
  paginationHtml?: string
}

const EVENT_ID_STORAGE_KEY = 'selected_event_id'

export function AllEvents({
  allEvents,
  currentPage,
  totalPages,
  onPageChange,
  loading = false,
  onSortChange,
  onCategoryChange,
  onPartnerChange,
  currentSort = 'oldest',
  categories = [],
  categoriesLoading = false,
  paginationHtml = '',
}: AllEventsProps) {
  const router = useRouter()
  const [activeFilter, setActiveFilter] = useState('All')
  const [sortBy, setSortBy] = useState(currentSort)

  // Debug logging
  console.log('[v0] AllEvents received paginationHtml:', paginationHtml ? 'YES' : 'NO')
  if (paginationHtml) {
    console.log('[v0] Pagination HTML content:', paginationHtml)
  }

  // Build filter options with "All" as default + dynamic categories
  const filterOptions = ['All', ...categories.map(cat => cat.name)]

  // Map category name to ID for API call
  const getCategoryIdByName = (name: string): string => {
    if (name === 'All') return ''
    const category = categories.find(cat => cat.name === name)
    return category?.id || ''
  }

  const handleSortChange = (value: string) => {
    setSortBy(value)
    if (onSortChange) {
      onSortChange(value)
    }
  }

  const handleFilterChange = (filter: string) => {
    setActiveFilter(filter)
    if (onCategoryChange) {
      const categoryId = getCategoryIdByName(filter)
      onCategoryChange(categoryId)
    }
  }

  const getEventDate = (event: EventItem) => {
    return event.tgl_live || event.from_dates || event.start_date || 'N/A'
  }

  const getEventImage = (event: EventItem) => {
    if (event.image_url) return event.image_url
    if (event.image) return `https://api.usky.ai/uploads/${event.image}`
    return '/images/event/example.png'
  }

  const openEventDetail = (eventId: string) => {
    sessionStorage.setItem(EVENT_ID_STORAGE_KEY, eventId)
    router.push(`/event/detail?id=${encodeURIComponent(eventId)}`)
  }

  return (
    <section>
      {/* Header Title */}
      <div className="mb-6">
        <h2 className="text-xl md:text-2xl font-bold text-white md:border-l-4 md:border-yellow-500 md:pl-4">
          Event
        </h2>
      </div>

      {/* --- MOBILE FILTER LAYOUT (Sesuai Gambar 2) --- */}
      <div className="md:hidden flex flex-col gap-4 mb-8">
        {/* Filter By Toggle */}
        <div className="flex items-center justify-between py-2 border-b border-white/10">
          <span className="text-sm text-gray-300 font-medium tracking-wide">FILTER BY</span>
          <Filter className="w-4 h-4 text-white" />
        </div>

        {/* Sort By Dropdown */}
        <div className="flex items-center justify-between">
          <span className="text-sm text-gray-300 font-medium tracking-wide">SORT BY</span>
          <div className="relative">
            <select 
              value={sortBy}
              onChange={(e) => handleSortChange(e.target.value)}
              className="bg-[#0F172A] text-gray-300 pl-3 pr-8 py-1.5 rounded text-sm appearance-none border border-white/10 focus:outline-none"
            >
              <option value="latest">Latest</option>
              <option value="oldest">Oldest</option>
              <option value="popular">Popular</option>
            </select>
            <ChevronDown className="w-4 h-4 text-gray-400 absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none" />
          </div>
        </div>

        {/* Tabs Scrollable (Line Style) */}
        <div className="flex overflow-x-auto scrollbar-hide border-b border-white/10 mt-2">
          {filterOptions.map((filter) => (
            <button
              key={filter}
              onClick={() => handleFilterChange(filter)}
              className={`px-4 py-3 text-sm font-medium whitespace-nowrap transition-colors relative ${
                activeFilter === filter
                  ? 'text-white'
                  : 'text-gray-400'
              }`}
            >
              {filter}
              {/* Yellow Underline for Active */}
              {activeFilter === filter && (
                <span className="absolute bottom-0 left-0 w-full h-[2px] bg-yellow-500"></span>
              )}
            </button>
          ))}
        </div>
      </div>

      {/* --- DESKTOP FILTER LAYOUT (Original) --- */}
      <div className="hidden md:flex flex-col gap-6 mb-8">
        <div className="flex items-center justify-between gap-4 border-b border-white/10 pb-4">
          <div className="flex items-center gap-3">
            <span className="text-gray-400 text-xs uppercase font-semibold tracking-wide">Sort By</span>
            <div className="relative">
              <select 
                value={sortBy}
                onChange={(e) => handleSortChange(e.target.value)}
                className="bg-[#0F172A] text-white px-4 py-2 pr-8 rounded-lg text-sm appearance-none border border-white/10 focus:outline-none cursor-pointer"
              >
                <option value="latest">Latest</option>
                <option value="oldest">Oldest</option>
                <option value="popular">Popular</option>
              </select>
              <ChevronRight className="w-4 h-4 text-gray-400 absolute right-3 top-1/2 -translate-y-1/2 rotate-90 pointer-events-none" />
            </div>
          </div>

          <div className="flex flex-wrap gap-2">
            {filterOptions.map((filter) => (
              <button
                key={filter}
                onClick={() => handleFilterChange(filter)}
                className={`px-4 py-1.5 rounded-full text-sm font-medium transition-all ${
                  activeFilter === filter
                    ? 'bg-transparent text-white border border-yellow-500'
                    : 'text-gray-400 hover:text-white hover:bg-white/5 border border-transparent'
                }`}
              >
                {filter}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Grid Layout (1 Col Mobile, 5 Col Desktop) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-x-4 gap-y-8">
        {loading ? (
          // Skeleton Loaders
          Array.from({ length: LIMIT }).map((_, index) => (
            <div key={index} className="group cursor-pointer flex flex-col hover:opacity-80 transition-opacity">
              <div className="relative w-full aspect-[2/3] bg-gray-700/30 rounded-lg overflow-hidden mb-3 border border-white/5 animate-pulse"></div>
              <div className="px-1 space-y-2">
                <div className="h-4 bg-gray-700/30 rounded animate-pulse"></div>
                <div className="h-3 bg-gray-700/30 rounded animate-pulse w-20"></div>
              </div>
            </div>
          ))
        ) : allEvents.length > 0 ? (
          allEvents.map((event) => (
            <div 
              key={event.id}
              onClick={() => openEventDetail(event.id)}
              className="group cursor-pointer flex flex-col hover:opacity-80 transition-opacity"
            >
              {/* Poster Card */}
              <div className="relative w-full aspect-[2/3] bg-gray-800 rounded-lg overflow-hidden mb-3 border border-white/5">
                <img 
                  src={getEventImage(event)} 
                  alt={event.title}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#020617] via-[#020617]/50 to-transparent"></div>
                <div className="absolute bottom-0 left-0 w-full p-3 md:p-3 p-5"> 
                  <span className="text-[10px] text-yellow-500 font-bold mb-1 block">
                    {event.event_category?.name || '[Kategori Event]'}
                  </span>
                  <h3 className="text-white font-bold text-lg md:text-sm leading-tight line-clamp-2 mb-2 group-hover:text-yellow-400 transition-colors">
                    {event.title}
                  </h3>
                </div>
              </div>
              
              {/* Meta Data */}
              <div className="px-1">
                <div className="flex items-center gap-2 text-gray-400 text-xs mb-1">
                  <Calendar className="w-3 h-3" />
                  <span>{getEventDate(event)}</span>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="col-span-full text-center py-12">
            <p className="text-gray-400">Tidak ada event tersedia</p>
          </div>
        )}
      </div>

      {/* Pagination - Parse from HTML */}
      {paginationHtml && (
        <PaginationRenderer 
          htmlString={paginationHtml} 
          onPageClick={(page) => {
            console.log('[v0] Pagination clicked:', page)
            onPageChange(page)
          }}
          currentPage={currentPage}
        />
      )}
    </section>
  )
}

// Pagination Renderer Component
interface PaginationRendererProps {
  htmlString: string
  onPageClick: (page: number) => void
  currentPage: number
}

function PaginationRenderer({ htmlString, onPageClick, currentPage }: PaginationRendererProps) {
  console.log('[v0] PaginationRenderer - Input HTML:', htmlString)
  
  // Parse HTML string to extract page numbers and links
  const parsePages = () => {
    const pages: Array<{ page: number; isActive: boolean; isEllipsis: boolean }> = []
    const linkRegex = /href="\/(\d+)"|<strong>(\d+)<\/strong>/g
    let match

    const uniquePages = new Set<number>()

    // Extract all page numbers from links
    const tempRegex = /data-ci-pagination-page="(\d+)"/g
    let tempMatch
    while ((tempMatch = tempRegex.exec(htmlString))) {
      uniquePages.add(parseInt(tempMatch[1]))
    }

    // Also check for strong tags (current page)
    const strongRegex = /<strong>(\d+)<\/strong>/g
    let strongMatch
    while ((strongMatch = strongRegex.exec(htmlString))) {
      uniquePages.add(parseInt(strongMatch[1]))
    }

    // Sort and create button data
    const sortedPages = Array.from(uniquePages).sort((a, b) => a - b)
    console.log('[v0] Parsed pages:', sortedPages)

    return sortedPages.map((page) => ({
      page,
      isActive: page === currentPage,
      isEllipsis: false,
    }))
  }

  const pages = parsePages()

  // Check if Previous/Next buttons should be enabled
  const hasPrevious = htmlString.includes('rel="prev"')
  const hasNext = htmlString.includes('rel="next"')

  // Extract previous and next page numbers
  const getPrevPage = (): number | null => {
    const match = htmlString.match(/rel="prev">.*?href="\/(\d+)"/)
    return match ? parseInt(match[1]) : null
  }

  const getNextPage = (): number | null => {
    const match = htmlString.match(/rel="next">.*?href="\/(\d+)"/)
    return match ? parseInt(match[1]) : null
  }

  const prevPage = getPrevPage()
  const nextPage = getNextPage()

  return (
    <div className="flex items-center justify-center gap-3 mt-12 md:justify-end flex-wrap">
      {/* Previous Button */}
      <button
        onClick={() => prevPage && onPageClick(prevPage)}
        disabled={!hasPrevious}
        className="flex items-center gap-1 px-4 py-2 rounded-lg bg-[#0F172A] text-sm text-gray-300 hover:text-white border border-white/10 hover:border-yellow-500 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
      >
        <ChevronLeft className="w-4 h-4" />
        <span className="hidden sm:inline">Previous</span>
      </button>

      {/* Page Numbers */}
      <div className="flex items-center gap-2">
        {pages.map((item) => (
          <button
            key={item.page}
            onClick={() => onPageClick(item.page)}
            className={`w-9 h-9 rounded-lg text-sm font-medium transition-all ${
              item.isActive
                ? 'bg-[#0F172A] text-white border border-yellow-500'
                : 'bg-transparent text-gray-400 hover:bg-white/5'
            }`}
          >
            {item.page}
          </button>
        ))}
      </div>

      {/* Next Button */}
      <button
        onClick={() => nextPage && onPageClick(nextPage)}
        disabled={!hasNext}
        className="flex items-center gap-1 px-4 py-2 rounded-lg bg-[#0F172A] text-sm text-gray-300 hover:text-white border border-white/10 hover:border-yellow-500 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
      >
        <span className="hidden sm:inline">Next</span>
        <ChevronRight className="w-4 h-4" />
      </button>
    </div>
  )
}

const LIMIT = 15
