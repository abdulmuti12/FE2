'use client'

import { Header } from '@/components/header'
import { Footer } from '@/components/footer'
import { ChevronRight, Calendar, Play } from 'lucide-react'
import { AllEvents } from '@/components/event/all-events'
import { useRouter } from 'next/navigation'
import { useState, useEffect } from 'react'

// Mock Data
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
  },
  {
    id: 3,
    title: 'AI MASTERPLAY 2025',
    subtitle: 'Yang Telah Belajar AI',
    date: '22-11-2025',
    image: '/images/event/example.png',
    price: 'Rp2.000.000'
  },
  {
    id: 4,
    title: 'DIPONEGORO HERO',
    subtitle: '200 Tahun Perang Jawa',
    date: '22-11-2025',
    image: '/images/event/example.png',
    price: 'GRATIS!'
  },
  {
    id: 5,
    title: 'DIPONEGORO FESTIVAL',
    subtitle: 'Festival Budaya',
    date: '22-11-2025',
    image: '/images/event/example.png',
    price: 'Coming Soon'
  }
]

const recapEvents = [
  {
    id: 1,
    title: 'BALAIRUNG UI RECAP',
    desc: 'Watch groundbreaking films crafted by human creativity.',
    image: '/images/landscape1.jpg',
    type: 'Tipe Event'
  },
  {
    id: 2,
    title: 'AI FILM DAY HIGHLIGHTS',
    desc: 'Highlights from the AI Film Day event.',
    image: '/images/landscape2.jpg',
    type: 'Tipe Event'
  },
  {
    id: 3,
    title: 'MASTERPLAY SESSION',
    desc: 'Deep dive into AI technology.',
    image: '/images/landscape3.jpg',
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
  const LIMIT = 15

  useEffect(() => {
    const token = localStorage.getItem('user_token')
    console.log('[v0] Token from localStorage:', token ? 'Found' : 'Not found')
    if (!token) {
      console.log('[v0] No token, redirecting to home')
      router.push('/')
      return
    }

    console.log('[v0] Fetching events with token, page:', currentPage)
    fetchEvents(token, currentPage, idCategory, idPartner, sortBy)
  }, [currentPage, idCategory, idPartner, sortBy, router])

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

      const response = await fetch(
        `/api/events?${params.toString()}`,
        {
          method: 'GET',
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        }
      )

      const data = await response.json()
      console.log('[v0] API Response:', data)
      console.log('[v0] Response keys:', Object.keys(data))

      if (data.list && Array.isArray(data.list)) {
        console.log('[v0] Events found:', data.list.length)
        setAllEvents(data.list)
        const total = Math.ceil((data.total || 0) / LIMIT)
        setTotalPages(total > 0 ? total : 1)
      } else if (data.data && Array.isArray(data.data)) {
        console.log('[v0] Events in data.data:', data.data.length)
        setAllEvents(data.data)
        const total = Math.ceil((data.total || data.pagination?.total || 0) / LIMIT)
        setTotalPages(total > 0 ? total : 1)
      } else if (Array.isArray(data)) {
        console.log('[v0] Events is array directly:', data.length)
        setAllEvents(data)
        setTotalPages(1)
      } else {
        console.log('[v0] No events found in response structure')
      }
    } catch (error) {
      console.error('[v0] Error fetching events:', error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-[#050B14] text-white font-sans selection:bg-yellow-500 selection:text-black">
      <Header />

      {/* Hero Section */}
      <div className="relative w-full h-[450px] md:h-[400px] overflow-hidden">
        <div 
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: 'url(/images/imageheader.png)' }}
        >
          <div className="absolute inset-0 bg-gradient-to-r from-[#050B14] via-[#050B14]/80 to-transparent"></div>
          <div className="absolute inset-0 bg-gradient-to-t from-[#050B14] via-transparent to-transparent"></div>
        </div>

        <div className="relative h-full max-w-7xl mx-auto px-6 md:px-12 flex flex-col justify-center pt-16 md:pt-20">
          <h1 className="text-4xl md:text-6xl font-bold text-white mb-4 tracking-tight">Event</h1>
          <p className="text-gray-400 text-sm md:text-base max-w-xl leading-relaxed">
            Watch groundbreaking films crafted by human creativity and artificial intelligence.
            Join us for upcoming sessions and screenings.
          </p>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-[1400px] mx-auto px-6 md:px-12 py-8 pb-24 space-y-12 md:space-y-16">
        
        {/* === SECTION 1: UPCOMING EVENTS === */}
        <section>
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl md:text-2xl font-bold text-white border-l-4 border-yellow-500 pl-4">
              Upcoming Events
            </h2>
          </div>
          
          <div className="relative group">
            <div className="overflow-x-auto pb-6 scrollbar-hide -mx-6 px-6 md:mx-0 md:px-0">
              <div className="flex gap-4 md:gap-5 min-w-max">
                {upcomingEvents.map((event) => (
                  <div 
                    key={event.id} 
                    onClick={() => router.push('/dashboard/event/detail')}
                    className="relative w-[220px] md:w-[240px] aspect-[2/3] rounded-xl overflow-hidden cursor-pointer border border-white/10 group/card hover:border-yellow-500 transition-colors"
                  >
                    <img 
                      src={event.image || "/placeholder.svg"} 
                      alt={event.title}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#020617] via-[#020617]/70 to-transparent opacity-90"></div>

                    <div className="absolute bottom-0 left-0 w-full p-4 flex flex-col justify-end h-full">
                      <span className="text-[10px] uppercase tracking-wider text-yellow-500 font-semibold mb-1">
                        [Tipe Event]
                      </span>
                      <h3 className="text-white font-bold text-lg leading-tight mb-1 line-clamp-2">
                        {event.title}
                      </h3>
                      <p className="text-gray-300 text-xs mb-3 line-clamp-1">{event.subtitle}</p>
                      
                      <div className="flex items-center justify-between border-t border-white/20 pt-3 mt-1">
                        <div className="flex items-center gap-1.5 text-gray-400 text-xs">
                          <Calendar className="w-3 h-3" />
                          <span>{event.date}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            {/* Desktop Nav Button */}
            <button className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-4 bg-white text-black p-3 rounded-full shadow-lg hidden md:flex items-center justify-center z-10 hover:bg-yellow-400 transition-colors">
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        </section>

        {/* === SECTION 2: RECAPS === */}
        <section>
          <h2 className="text-xl md:text-2xl font-bold text-white border-l-4 border-yellow-500 pl-4 mb-6">
            Recaps and Event Replays
          </h2>
          
          <div className="overflow-x-auto pb-6 scrollbar-hide -mx-6 px-6 md:mx-0 md:px-0">
            <div className="flex gap-4 md:gap-6 min-w-max">
              {recapEvents.map((event) => (
                <div 
                  key={event.id} 
                  className="relative w-[300px] md:w-[380px] aspect-video rounded-xl overflow-hidden cursor-pointer group/video border border-white/10"
                >
                  <img 
                    src={event.image || "/placeholder.svg"} 
                    alt={event.title}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-black/40 group-hover/video:bg-black/50 transition-colors"></div>

                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-10 h-10 md:w-12 md:h-12 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center">
                      <Play className="w-4 h-4 md:w-5 md:h-5 text-white fill-current ml-1" />
                    </div>
                  </div>

                  <div className="absolute bottom-0 left-0 w-full p-4 bg-gradient-to-t from-black via-black/80 to-transparent">
                    <div className="inline-block px-2 py-0.5 bg-white/10 backdrop-blur-md rounded text-[10px] text-white mb-2 border border-white/20">
                      {event.type}
                    </div>
                    <h3 className="text-white font-bold text-sm md:text-base mb-1">{event.title}</h3>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* === SECTION 3: ALL EVENT (MOBILE & DESKTOP DIFFERENT LAYOUTS) === */}
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
