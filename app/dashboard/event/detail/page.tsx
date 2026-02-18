'use client'

import { Header } from '@/components/header'
import { Footer } from '@/components/footer'
import { MapPin, Clock, Play } from 'lucide-react'
import { useState } from 'react'

interface EventCard {
  id: number
  title: string
  subtitle: string
  date: string
  image: string
  type: string
}

const relatedEvents: EventCard[] = [
  {
    id: 1,
    title: '[Uduul Event]',
    subtitle: '[Tipe Event]',
    date: '22-11-2025',
    image: '/images/event/example.png',
    type: 'Tipe Event'
  },
  {
    id: 2,
    title: '[Uduul Event]',
    subtitle: '[Tipe Event]',
    date: '22-11-2025',
    image: '/images/event/example.png',
    type: 'Tipe Event'
  },
  {
    id: 3,
    title: '[Uduul Event]',
    subtitle: '[Tipe Event]',
    date: '22-11-2025',
    image: '/images/event/example.png',
    type: 'Tipe Event'
  },
  {
    id: 4,
    title: '[Uduul Event]',
    subtitle: '[Tipe Event]',
    date: '22-11-2025',
    image: '/images/event/example.png',
    type: 'Tipe Event'
  }
]

const ongoingEvents: EventCard[] = [
  {
    id: 1,
    title: '[Uduul Event]',
    subtitle: '[Tipe Event]',
    date: '22-11-2025',
    image: '/images/event/example.png',
    type: 'Tipe Event'
  },
  {
    id: 2,
    title: '[Uduul Event]',
    subtitle: '[Tipe Event]',
    date: '22-11-2025',
    image: '/images/event/example.png',
    type: 'Tipe Event'
  },
  {
    id: 3,
    title: '[Uduul Event]',
    subtitle: '[Tipe Event]',
    date: '22-11-2025',
    image: '/images/event/example.png',
    type: 'Tipe Event'
  },
  {
    id: 4,
    title: '[Uduul Event]',
    subtitle: '[Tipe Event]',
    date: '22-11-2025',
    image: '/images/event/example.png',
    type: 'Tipe Event'
  }
]

export default function EventDetailPage() {
  const [copied, setCopied] = useState(false)

  const handleCopyLink = () => {
    navigator.clipboard.writeText(window.location.href)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div className="min-h-screen bg-[#050B14] text-white font-sans selection:bg-yellow-500 selection:text-black">
      <Header />

      {/* Hero Banner */}
      <div className="relative w-full min-h-screen overflow-visible">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: 'url(/images/privacy-header.jpg)' }}
        >
          <div className="absolute inset-0 bg-gradient-to-r from-[#050B14] via-[#050B14]/60 to-[#050B14]/40"></div>
          <div className="absolute inset-0 bg-gradient-to-t from-[#050B14] via-transparent to-transparent"></div>
        </div>

        <div className="relative min-h-screen flex items-center py-12">
          <div className="max-w-7xl mx-auto w-full px-6 md:px-12">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start lg:items-center">
              {/* Left Content */}
              <div className="lg:col-span-2 space-y-6 pr-8">
                <div className="flex items-center gap-2">
                  <span className="px-3 py-1 bg-red-600 text-white text-xs font-bold rounded-full">
                    LIVE SOON
                  </span>
                </div>

                <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white leading-tight">
                  [Judul Event]
                </h1>

                <div className="space-y-5">
                  <div className="flex flex-wrap items-center gap-6">
                    <div className="flex items-center gap-2">
                      <Calendar className="w-5 h-5 text-gray-400" />
                      <span className="text-base md:text-lg text-gray-300">Jun 12</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Clock className="w-5 h-5 text-gray-400" />
                      <span className="text-base md:text-lg text-gray-300">10:30 PM - 10:30 PM</span>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <MapPin className="w-5 h-5 text-gray-400 flex-shrink-0 mt-1" />
                    <div>
                      <p className="text-sm text-gray-400">Online</p>
                      <p className="text-base md:text-lg text-white font-medium">Zoom Meeting</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Right Sidebar Card */}
             {/* Right Sidebar Card */}
              <div className="lg:col-span-1">
                {/* Tambahkan max-w agar tidak terlalu lebar di layar besar */}
                <div className="sticky top-24 max-w-sm mx-auto lg:ml-auto w-full">
                  
                  {/* Container Border - dikurangi jadi border-2 */}
                  <div className="border-2 border-red-600 rounded-2xl p-1 backdrop-blur shadow-2xl shadow-red-900/20">
                    
                    {/* Inner Card - padding diperkecil (p-5) & spacing diperkecil (space-y-4) */}
                    <div className="bg-[#050B14] rounded-xl p-5 space-y-4">
                      
                      {/* Image */}
                      <div className="relative rounded-lg overflow-hidden shadow-lg group">
                        <img
                          src="/images/event/example.png"
                          alt="AI MASTERPLAY 2025"
                          className="w-full h-36 object-cover transform group-hover:scale-105 transition-transform duration-500"
                        />
                      </div>

                      {/* Title & Quote */}
                      <div className="space-y-2">
                        <h3 className="text-xl md:text-2xl font-bold text-yellow-400 leading-tight">
                          AI MASTERPLAY 2025
                        </h3>
                        <p className="text-xs text-gray-300 leading-relaxed italic border-l-2 border-gray-700 pl-3">
                          "Yang Telah Belajar AI, Akan Berpikir Ulang."
                        </p>
                      </div>

                      {/* Pricing Section - Compact */}
                      <div className="space-y-2 py-3 border-y border-gray-800">
                        <div className="flex justify-between items-end">
                          <p className="text-[10px] text-gray-500 uppercase tracking-wider">Normal</p>
                          <p className="text-sm font-semibold text-gray-400 line-through decoration-red-500">Rp20,000</p>
                        </div>
                        <div className="flex justify-between items-end">
                          <p className="text-[10px] text-yellow-500/80 uppercase tracking-wider font-bold">Launch Price</p>
                          <p className="text-xl font-bold text-yellow-400">Rp20.000</p>
                        </div>
                      </div>

                      {/* Main Button - Padding dikurangi (py-3) */}
                      <button className="w-full bg-yellow-400 hover:bg-yellow-500 text-black font-extrabold py-3 rounded-lg transition-all transform hover:scale-[1.02] text-sm uppercase tracking-wide shadow-[0_0_15px_rgba(250,204,21,0.3)]">
                        Register Now
                      </button>

                      {/* Countdown - Lebih tipis */}
                      <div className="flex items-center justify-between bg-black/60 rounded-lg px-3 py-2 border border-white/5">
                        <div className="flex items-center gap-2">
                          <span className="relative flex h-2 w-2">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                            <span className="relative inline-flex rounded-full h-2 w-2 bg-red-500"></span>
                          </span>
                          <span className="text-[10px] text-gray-400 uppercase">Starts in</span>
                        </div>
                        <span className="text-xs font-mono font-bold text-red-400">02d : 14h : 23m</span>
                      </div>

                      {/* Secondary Buttons - Horizontal Layout */}
                      <div className="flex items-center gap-3">
                        <button className="flex-1 bg-gray-300 hover:bg-gray-400 text-black py-3 rounded-full text-sm font-semibold transition-colors">
                          Claim Your Ticket
                        </button>

                        <button
                          onClick={handleCopyLink}
                          className="flex-shrink-0 w-12 h-12 flex items-center justify-center bg-white hover:bg-gray-100 text-black rounded-full transition-colors border-2 border-gray-300"
                        >
                          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                          </svg>
                        </button>
                      </div>

                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-6 md:px-12 py-12 pb-24 space-y-12">
        {/* Event Description */}
        <section>
          <p className="text-gray-300 leading-relaxed text-base mb-6">
            [Brief of Event] Lorem ipsum dolor sit amet consectetur. Volupatate Lorem isl slit paxabui ui incidunt. Facilisis quam acdilend eisquise or Airiel faugal na soude well. Et time feugue molies non wilt. Simase wil eu et excepteur. Excepteur tempor wisi auris quil di au rerum felit. Velit esequate opsem dolor id at afet dolorem.
          </p>

          <p className="text-gray-300 leading-relaxed text-base mb-6">
            [Brief of Event] Lorem ipsum dolor sit amet consectetur. Volupatate Lorem isl slit paxabui ui incidunt. Facilisis quam acdilend eisquise or Airiel faugal na soude well. Et time feugue molies non wilt. Simase wil eu et excepteur. Excepteur tempor wisi auris quil di au rerum felit.
          </p>

          <p className="text-gray-300 leading-relaxed text-base mb-6">
            [Brief of Event] Lorem ipsum dolor sit amet consectetur. Volupatate Lorem isl slit paxabui ui incidunt. Facilisis quam acdilend eisquise or Airiel faugal na soude well.
          </p>

          <p className="text-gray-300 leading-relaxed text-base">
            [Brief of Event] Lorem ipsum dolor sit amet consectetur. Volupatate Lorem isl slit paxabui ui incidunt. Facilisis quam acdilend eisquise or Airiel faugal na soude well. Et time feugue molies non wilt. Simase wil eu et excepteur.
          </p>
        </section>

        {/* Related Events */}
        <section>
          <h2 className="text-2xl font-bold text-white mb-8">Related Event</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {relatedEvents.map((event) => (
              <div key={event.id} className="group">
                <div className="relative aspect-[3/4] rounded-xl overflow-hidden mb-4 cursor-pointer">
                  <img
                    src={event.image || "/placeholder.svg"}
                    alt={event.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                    <Play className="w-16 h-16 text-white fill-white" />
                  </div>
                </div>

                <h3 className="text-white font-bold mb-2">{event.title}</h3>
                <p className="text-gray-400 text-sm mb-3">{event.subtitle}</p>
                <p className="text-gray-500 text-xs">{event.date}</p>
              </div>
            ))}
          </div>
        </section>

        {/* On Going Events */}
        <section>
          <h2 className="text-2xl font-bold text-white mb-8">On Going Events</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {ongoingEvents.map((event) => (
              <div key={event.id} className="group">
                <div className="relative aspect-[3/4] rounded-xl overflow-hidden mb-4 cursor-pointer">
                  <img
                    src={event.image || "/placeholder.svg"}
                    alt={event.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                    <Play className="w-16 h-16 text-white fill-white" />
                  </div>
                </div>

                <h3 className="text-white font-bold mb-2">{event.title}</h3>
                <p className="text-gray-400 text-sm mb-3">{event.subtitle}</p>
                <p className="text-gray-500 text-xs">{event.date}</p>
              </div>
            ))}
          </div>
        </section>
      </div>

      <Footer />
    </div>
  )
}

function Calendar(props: any) {
  return (
    <svg {...props} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
      <path d="M16 2v4M8 2v4M3 10h18" />
    </svg>
  )
}
