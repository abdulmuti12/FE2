'use client'

import { Header } from '@/components/header'
import { Footer } from '@/components/footer'
import { ChevronRight, Calendar, Play } from 'lucide-react'
import { AllEvents } from '@/components/event/all-events'
import { useRouter } from 'next/navigation'
import { useState, useEffect } from 'react'

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
  image?: string
  image_url?: string
  from_dates?: string
  to_dates?: string
  event_category?: {
    name: string
  }
}

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

  const LIMIT = 20

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
        id_category: '',
        page: '0',
      })

      const response = await fetch(`/api/completed-events?${params.toString()}`, {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      })

      const data = await response.json()

      if (data.status && data.list && Array.isArray(data.list)) {
        setCompletedEventsList(data.list.slice(0, 3))
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

      <div className="relative w-full h-[450px] overflow-hidden">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: 'url(/images/imageheader.png)' }}
        />
      </div>

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
                  onClick={() => router.push(`/dashboard/event/detail?id=${event.id}`)}
                >
                  <img src={event.image_url || event.image} className="w-full h-[280px] object-cover" />

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

          <div className="flex gap-4">
            {completedLoading ? (
              <div className="text-gray-400">Loading recaps...</div>
            ) : completedEventsList.length > 0 ? (
              completedEventsList.map((event) => (
                <div
                  key={event.id}
                  className="w-[220px] rounded-xl overflow-hidden border border-white/10 cursor-pointer relative"
                  onClick={() => router.push(`/dashboard/event/detail?id=${event.id}`)}
                >
                  <div className="relative h-[280px]">
                    <img src={event.image_url || event.image} className="w-full h-full object-cover" />

                    <div className="absolute inset-0 flex items-center justify-center">
                      <Play className="text-white w-10 h-10" />
                    </div>
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
              <div className="text-gray-400">No completed events available</div>
            )}
          </div>
        </section>

        {/* Ingat pastikan onClick di dalam AllEvents juga diubah menjadi push router dengan ID jika memungkinkan */}
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

