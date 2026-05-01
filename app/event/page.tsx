'use client'

import { Header } from '@/components/header'
import { Footer } from '@/components/footer'
// import { ChevronRight, Calendar, Play } from 'lucide-react'
import { AllEvents } from '@/components/event/all-events'
import { useRouter } from 'next/navigation'
// import { useState, useEffect } from 'react'
import { useState, useEffect, useRef } from 'react'
import { ChevronRight, ChevronLeft, Calendar, Play } from 'lucide-react'
import Image from 'next/image'

const upcomingEvents = []

const recapEvents = []

interface EventItem {
  id: string
  title: string
  image?: string
  image_url?: string
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

interface UpcomingEvent {
  id: string
  title: string
  image?: string
  image_url?: string
  from_dates?: string
  price?: string
  event_category?: {
    name: string
  }
}

interface CompletedEvent {
  id: string
  title: string
  image_url?: string
  video_url?: string
  start_date?: string
  end_date?: string
}

const EVENT_ID_STORAGE_KEY = 'selected_event_id'

export default function EventPage() {
  const router = useRouter()

  const [upcomingEventsList, setUpcomingEventsList] = useState<UpcomingEvent[]>([])
  const [completedEventsList, setCompletedEventsList] = useState<CompletedEvent[]>([])
  const [allEvents, setAllEvents] = useState<EventItem[]>([])
  const [categories, setCategories] = useState<Category[]>([])
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [loading, setLoading] = useState(true)
  const [upcomingLoading, setUpcomingLoading] = useState(true)
  const [completedLoading, setCompletedLoading] = useState(true)
  const [categoriesLoading, setCategoriesLoading] = useState(true)
  const [paginationHtml, setPaginationHtml] = useState<string>('')

  const [idCategory, setIdCategory] = useState('')
  const [idPartner, setIdPartner] = useState('')
  const [sortBy, setSortBy] = useState('latest')

  // Referensi untuk membidik container scroll
  const scrollContainerRef = useRef<HTMLDivElement>(null)

  // Fungsi untuk menggeser card saat tombol diklik
  const scroll = (direction: 'left' | 'right') => {
    if (scrollContainerRef.current) {
      // Menentukan seberapa jauh jarak gesernya (300px, bisa disesuaikan)
      const scrollAmount = direction === 'left' ? -300 : 300
      scrollContainerRef.current.scrollBy({ left: scrollAmount, behavior: 'smooth' })
    }
  }

  const LIMIT = 20

  const formatRecapDateTime = (value?: string) => {
    if (!value) return 'N/A'

    const isoLike = value.includes('T') ? value : value.replace(' ', 'T')
    const date = new Date(isoLike)
    if (Number.isNaN(date.getTime())) return value

    const day = String(date.getDate()).padStart(2, '0')
    const month = String(date.getMonth() + 1).padStart(2, '0')
    const year = String(date.getFullYear())
    return `${year}-${month}-${day}`
  }

  const openEventDetail = (eventId: string) => {
    sessionStorage.setItem(EVENT_ID_STORAGE_KEY, eventId)
    router.push(`/event/detail?id=${encodeURIComponent(eventId)}`)
  }

  const openEventRecapDetail = (eventId: string) => {
    sessionStorage.setItem(EVENT_ID_STORAGE_KEY, eventId)
    router.push(`/event/detail-recap?id=${encodeURIComponent(eventId)}`)
  }

  useEffect(() => {
    const token = localStorage.getItem('user_token')

    console.log('[v0] Token from localStorage:', token ? 'Found' : 'Not found')

    if (!token) {
      router.push('/')
      return
    }

    fetchCategories(token)
    fetchUpcomingEvents(token)
    fetchCompletedEvents(token)
    fetchEvents(token, currentPage, idCategory, idPartner, sortBy)
  }, [currentPage, idCategory, idPartner, sortBy, router])

  const fetchCategories = async (token: string) => {
    try {
      setCategoriesLoading(true)
      const response = await fetch('/api/event/event-categories', {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      })

      const data = await response.json()

      if (data.list && Array.isArray(data.list)) {
        setCategories(data.list)
      }
    } catch (error) {
      console.error('[v0] Error fetching categories:', error)
    } finally {
      setCategoriesLoading(false)
    }
  }

  const fetchUpcomingEvents = async (token: string) => {
    try {
      setUpcomingLoading(true)
      const params = new URLSearchParams({
        id_category: '',
        page: '1',
      })

      const response = await fetch(`/api/event/upcoming-events?${params.toString()}`, {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      })

      const data = await response.json()

      if (data.list && Array.isArray(data.list)) {
        setUpcomingEventsList(data.list.slice(0, 2))
      }
    } catch (error) {
      console.error('[v0] Error fetching upcoming events:', error)
    } finally {
      setUpcomingLoading(false)
    }
  }

  const fetchCompletedEvents = async (token: string) => {
    try {
      setCompletedLoading(true)
      const params = new URLSearchParams({
        sort: 'latest',
        id_category: '',
        id_partner: '',
        page: '1',
        limit: '15',
      })

      const response = await fetch(`/api/event/recap?${params.toString()}`, {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      })

      const data = await response.json()

      if (data.status && data.list && Array.isArray(data.list)) {
        const recaps = data.list.map((item: any) => ({
          id: String(item.id || ''),
          title: item.title || '',
          image_url: item.image_url || '',
          video_url: item.video_url || '',
          start_date: item.start_date || '',
          end_date: item.end_date || '',
        }))
        setCompletedEventsList(recaps)
      }
    } catch (error) {
      console.error('[v0] Error fetching completed events:', error)
    } finally {
      setCompletedLoading(false)
    }
  }

  const fetchEvents = async (
    token: string,
    page: number,
    category: string,
    partner: string,
    sort: string
  ) => {
    try {
      setLoading(true)

      const params = new URLSearchParams({
        sort,
        id_category: category,
        id_partner: partner,
        page: page.toString(),
        limit: LIMIT.toString(),
      })

      const url = `/api/event/events?${params.toString()}`

      const response = await fetch(url, {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${token}`,
        },
        cache: 'no-store',
      })

      if (!response.ok) {
        throw new Error('API request failed')
      }

      const data = await response.json()

      if (data.list && Array.isArray(data.list)) {
        setAllEvents(data.list)
        
        if (data.pagination) {
          setPaginationHtml(data.pagination)
          const pageMatches = data.pagination.match(/data-ci-pagination-page="(\d+)"/g)
          if (pageMatches && pageMatches.length > 0) {
            const pages = pageMatches.map((match: string) => parseInt(match.match(/\d+/)?.[0] || '1'))
            const maxPage = Math.max(...pages)
            setTotalPages(maxPage)
          }
        } else {
          const total = Math.ceil((data.total || 0) / LIMIT)
          setTotalPages(total > 0 ? total : 1)
        }
      }

      else if (data.data && Array.isArray(data.data)) {
        setAllEvents(data.data)

        if (data.pagination) {
          setPaginationHtml(data.pagination)
          const pageMatches = data.pagination.match(/data-ci-pagination-page="(\d+)"/g)
          if (pageMatches && pageMatches.length > 0) {
            const pages = pageMatches.map((match: string) => parseInt(match.match(/\d+/)?.[0] || '1'))
            const maxPage = Math.max(...pages)
            setTotalPages(maxPage)
          }
        } else {
          const total = Math.ceil((data.total || data.pagination?.total || 0) / LIMIT)
          setTotalPages(total > 0 ? total : 1)
        }
      }

      else if (Array.isArray(data)) {
        setAllEvents(data)
        setTotalPages(1)
      }

      else {
        setAllEvents([])
      }

    } catch (error) {
      console.error('[v0] Error fetching events:', error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-[#050B14] text-white">

      <Header />

      {/* <div className="relative w-full h-[450px] overflow-hidden">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: 'url(/images/imageheader.png)' }}
        />
      </div> */}

      <div className="max-w-[1400px] mx-auto px-6 py-8">

        <section className="mb-12">
          <h2 className="text-xl font-bold border-l-4 border-yellow-500 pl-4 mb-6">
            Upcoming Events
          </h2>

          <div className="flex gap-4">
            {upcomingLoading ? (
              <div className="text-gray-400">Loading events...</div>
            ) : upcomingEventsList.length > 0 ? (
              upcomingEventsList.map((event) => (
                <div
                  key={event.id}
                  className="w-[220px] rounded-xl overflow-hidden border border-white/10 cursor-pointer"
                  onClick={() => openEventDetail(event.id)}
                >
                  <div className="relative w-full h-[280px]">
                    <Image
                      src={event.image_url || event.image || '/placeholder.jpg'}
                      alt={event.title}
                      fill
                      sizes="220px"
                      className="object-cover"
                    />
                  </div>

                  <div className="p-4">
                    <h3 className="font-bold">{event.title}</h3>

                    <div className="flex items-center text-xs text-gray-400 mt-2">
                      <Calendar className="w-3 h-3 mr-1" />
                      {event.from_dates}
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-gray-400">No upcoming events</div>
            )}
          </div>
        </section>

<section className="mb-12">
          <h2 className="text-xl font-bold border-l-4 border-yellow-500 pl-4 mb-6">
            Recaps and Event Replays
          </h2>

          {/* Wrapper relative agar tombol panah bisa melayang di atas card */}
          <div className="relative group">
            
            {/* Tombol Kiri */}
            {completedEventsList.length > 0 && (
              <button
                onClick={() => scroll('left')}
                className="absolute left-2 top-1/2 z-10 -translate-y-1/2 flex h-10 w-10 items-center justify-center rounded-full bg-black/60 border border-white/20 text-white backdrop-blur-md shadow-lg transition-transform hover:scale-110 active:scale-95 md:-left-5"
                aria-label="Scroll left"
              >
                <ChevronLeft className="h-6 w-6" />
              </button>
            )}

            {/* Container yang sudah ditambahkan ref={scrollContainerRef} */}
            <div 
              ref={scrollContainerRef}
              className="flex gap-4 overflow-x-auto snap-x snap-mandatory pb-6 md:pb-0 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]"
            >
              {completedLoading ? (
                <div className="text-gray-400">Loading recaps...</div>
              ) : completedEventsList.length > 0 ? (
                completedEventsList.map((event) => (
                  <div
                    key={event.id}
                    className="w-[85vw] md:w-[220px] flex-shrink-0 snap-center md:snap-align-none rounded-xl overflow-hidden border border-white/10 cursor-pointer relative bg-[#0a1424]"
                    onClick={() => openEventRecapDetail(event.id)}
                  >
                    <div className="relative h-[420px] md:h-[280px] bg-black">
                      {event.video_url ? (
                        <video
                          src={event.video_url}
                          className="h-full w-full object-cover"
                          muted
                          loop
                          playsInline
                          preload="metadata"
                        />
                      ) : (
                        <div className="h-full w-full bg-[#0b1222]" />
                      )}

                      <div className="absolute inset-0 flex items-center justify-center bg-black/10 hover:bg-black/20 transition-colors">
                        <Play className="text-white w-14 h-14 md:w-10 md:h-10 opacity-90 drop-shadow-lg" />
                      </div>
                    </div>

                    <div className="p-4 md:p-4 p-5">
                      <h3 className="font-bold text-lg md:text-base line-clamp-2 leading-snug">{event.title}</h3>

                      <div className="flex items-center text-sm md:text-xs text-gray-400 mt-3 md:mt-2">
                        <Calendar className="w-4 h-4 md:w-3 md:h-3 mr-2 md:mr-1" />
                        {formatRecapDateTime(event.start_date)}
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-gray-400">No completed events available</div>
              )}
            </div>

            {/* Tombol Kanan */}
            {completedEventsList.length > 0 && (
              <button
                onClick={() => scroll('right')}
                className="absolute right-2 top-1/2 z-10 -translate-y-1/2 flex h-10 w-10 items-center justify-center rounded-full bg-black/60 border border-white/20 text-white backdrop-blur-md shadow-lg transition-transform hover:scale-110 active:scale-95 md:-right-5"
                aria-label="Scroll right"
              >
                <ChevronRight className="h-6 w-6" />
              </button>
            )}

          </div>
        </section>

        <AllEvents
          allEvents={allEvents}
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={setCurrentPage}
          loading={loading}
          onSortChange={setSortBy}
          onCategoryChange={setIdCategory}
          onPartnerChange={setIdPartner}
          currentSort={sortBy}
          categories={categories}
          categoriesLoading={categoriesLoading}
          paginationHtml={paginationHtml}
        />

      </div>

      <Footer />

    </div>
  )
}
