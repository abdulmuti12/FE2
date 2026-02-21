'use client'

import { Header } from '@/components/header'
import { Footer } from '@/components/footer'
import { ChevronRight, ChevronLeft, Calendar, Play, Filter, ChevronDown } from 'lucide-react'
import { useState } from 'react'
import { useRouter } from 'next/navigation'

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

export default function EventPage() {
  const router = useRouter()
  const [activeFilter, setActiveFilter] = useState('All')
  const [sortBy, setSortBy] = useState('Latest')

  // Menggabungkan data untuk simulasi grid All Events
  const allEvents = [...upcomingEvents, ...upcomingEvents, ...upcomingEvents]
  const filterOptions = ['All', 'Nonton Bareng', 'Webinar', 'Kelas', 'Seminar']

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
                    onChange={(e) => setSortBy(e.target.value)}
                    className="bg-[#0F172A] text-gray-300 pl-3 pr-8 py-1.5 rounded text-sm appearance-none border border-white/10 focus:outline-none"
                  >
                    <option>Latest</option>
                    <option>Oldest</option>
                    <option>Popular</option>
                  </select>
                  <ChevronDown className="w-4 h-4 text-gray-400 absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none" />
               </div>
            </div>

            {/* Tabs Scrollable (Line Style) */}
            <div className="flex overflow-x-auto scrollbar-hide border-b border-white/10 mt-2">
              {filterOptions.map((filter) => (
                 <button
                 key={filter}
                 onClick={() => setActiveFilter(filter)}
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
                    onChange={(e) => setSortBy(e.target.value)}
                    className="bg-[#0F172A] text-white px-4 py-2 pr-8 rounded-lg text-sm appearance-none border border-white/10 focus:outline-none cursor-pointer"
                    >
                    <option>Latest</option>
                    <option>Oldest</option>
                    <option>Popular</option>
                    </select>
                    <ChevronRight className="w-4 h-4 text-gray-400 absolute right-3 top-1/2 -translate-y-1/2 rotate-90 pointer-events-none" />
                </div>
              </div>

              <div className="flex flex-wrap gap-2">
                {filterOptions.map((filter) => (
                  <button
                    key={filter}
                    onClick={() => setActiveFilter(filter)}
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
            {allEvents.map((event, index) => (
              <div 
                key={`${event.id}-${index}`}
                onClick={() => router.push('/dashboard/event/detail')}
                className="group cursor-pointer flex flex-col hover:opacity-80 transition-opacity"
              >
                {/* Poster Card */}
                <div className="relative w-full aspect-[2/3] bg-gray-800 rounded-lg overflow-hidden mb-3 border border-white/5">
                  <img 
                    src={event.image || "/placeholder.svg"} 
                    alt={event.title}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                   <div className="absolute inset-0 bg-gradient-to-t from-[#020617] via-[#020617]/50 to-transparent"></div>
                   <div className="absolute bottom-0 left-0 w-full p-3 md:p-3 p-5"> 
                        <span className="text-[10px] text-yellow-500 font-bold mb-1 block">[Judul Event]</span>
                        <h3 className="text-white font-bold text-lg md:text-sm leading-tight line-clamp-2 mb-2 group-hover:text-yellow-400 transition-colors">
                            {event.title}
                        </h3>
                   </div>
                </div>
                
                {/* Meta Data */}
                <div className="px-1">
                    <div className="flex items-center gap-2 text-gray-400 text-xs mb-1">
                        <Calendar className="w-3 h-3" />
                        <span>{event.date}</span>
                    </div>
                </div>
              </div>
            ))}
          </div>

          {/* Pagination (New) */}
          <div className="flex items-center justify-center gap-3 mt-12 md:justify-end">
             <button className="flex items-center gap-1 px-4 py-2 rounded-lg bg-[#0F172A] text-sm text-gray-300 hover:text-white border border-white/10 hover:border-yellow-500 transition-colors">
                <ChevronLeft className="w-4 h-4" />
                <span className="hidden sm:inline">Previous</span>
             </button>
             
             <button className="w-9 h-9 rounded-lg bg-[#0F172A] text-white text-sm font-medium border border-yellow-500">
                1
             </button>
             <button className="w-9 h-9 rounded-lg bg-transparent text-gray-400 text-sm font-medium hover:bg-white/5">
                2
             </button>
             <span className="text-gray-500">...</span>
             
             <button className="flex items-center gap-1 px-4 py-2 rounded-lg bg-[#0F172A] text-sm text-gray-300 hover:text-white border border-white/10 hover:border-yellow-500 transition-colors">
                <span className="hidden sm:inline">Next</span>
                <ChevronRight className="w-4 h-4" />
             </button>
          </div>

        </section>
      </div>

      <Footer />
    </div>
  )
}
