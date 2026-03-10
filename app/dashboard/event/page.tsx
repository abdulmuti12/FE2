'use client'

import { Header } from '@/components/header'
import { Footer } from '@/components/footer'
import { ChevronRight, Calendar, Play } from 'lucide-react'
import { AllEvents } from '@/components/event/all-events'
import { useRouter } from 'next/navigation'
import { useState, useEffect } from 'react'

const upcomingEvents = [
  {
    id: 1,
    title: 'BALAIRUNG UI MOVIE NIGHT',
    subtitle: 'Legacy of Heroes',
    date: '22-11-2025',
    image: '/images/event/example.png',
    price: 'GRATIS!'
  },
  {
    id: 2,
    title: 'AI FILM DAY',
    subtitle: 'Watch, Learn, Create',
    date: '22-11-2025',
    image: '/images/event/example.png',
    price: 'Rp50.000'
  }
]

const recapEvents = [
  {
    id: 1,
    title: 'BALAIRUNG UI RECAP',
    desc: 'Watch groundbreaking films crafted by human creativity.',
    image: '/images/landscape1.jpg',
    type: 'Tipe Event'
  }
]

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

export default function EventPage() {
  const router = useRouter()

  const [allEvents, setAllEvents] = useState<EventItem[]>([])
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [loading, setLoading] = useState(true)

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

    fetchEvents(token, currentPage, idCategory, idPartner, sortBy)
  }, [currentPage, idCategory, idPartner, sortBy])

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

      const url = `/api/events?${params.toString()}`
      console.log('[v0] Client request:', url)

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

      console.log('[v0] API Response:', data)

      if (data.list && Array.isArray(data.list)) {
        setAllEvents(data.list)

        const total = Math.ceil((data.total || 0) / LIMIT)
        setTotalPages(total > 0 ? total : 1)
      }

      else if (data.data && Array.isArray(data.data)) {
        setAllEvents(data.data)

        const total = Math.ceil((data.total || data.pagination?.total || 0) / LIMIT)
        setTotalPages(total > 0 ? total : 1)
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
            {upcomingEvents.map((event) => (
              <div
                key={event.id}
                className="w-[220px] rounded-xl overflow-hidden border border-white/10 cursor-pointer"
                onClick={() => router.push('/dashboard/event/detail')}
              >
                <img src={event.image} className="w-full h-[280px] object-cover" />

                <div className="p-4">
                  <h3 className="font-bold">{event.title}</h3>

                  <div className="flex items-center text-xs text-gray-400 mt-2">
                    <Calendar className="w-3 h-3 mr-1" />
                    {event.date}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        <section className="mb-12">
          <h2 className="text-xl font-bold border-l-4 border-yellow-500 pl-4 mb-6">
            Recaps and Event Replays
          </h2>

          <div className="flex gap-6">
            {recapEvents.map((event) => (
              <div
                key={event.id}
                className="w-[320px] aspect-video rounded-xl overflow-hidden relative"
              >
                <img src={event.image} className="w-full h-full object-cover" />

                <div className="absolute inset-0 flex items-center justify-center">
                  <Play className="text-white w-10 h-10" />
                </div>
              </div>
            ))}
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
        />

      </div>

      <Footer />

    </div>
  )
}