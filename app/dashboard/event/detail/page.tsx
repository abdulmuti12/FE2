'use client'

import { Header } from '@/components/header'
import { Footer } from '@/components/footer'
// 1. Tambahkan ChevronLeft dan ChevronRight
import { MapPin, Clock, Play, Calendar as CalendarIcon, ChevronLeft, ChevronRight } from 'lucide-react'
// 2. Tambahkan useRef
import { useState, useEffect, Suspense, useRef } from 'react'
import { useSearchParams } from 'next/navigation'
import Link from 'next/link'

interface EventDetailData {
  id: string
  title: string
  description: string
  address: string
  image_url: string
  from_dates: string
  from_times: string
  to_times: string
  total_seat: string
  price: string
  sisa: string
  close?: boolean
  event_category?: {
    id: string
    name: string
  }
}

interface EventCard {
  id: number
  title: string
  subtitle: string
  date: string
  image: string
}

function EventDetailContent() {
  const searchParams = useSearchParams()
  const id = searchParams.get('id')

  const [copied, setCopied] = useState(false)
  const [eventDetail, setEventDetail] = useState<EventDetailData | null>(null)
  const [ongoingEvents, setOngoingEvents] = useState<EventCard[]>([])
  const [relatedEvents, setRelatedEvents] = useState<EventCard[]>([])
  const [loading, setLoading] = useState(true)
  
  const [isClaiming, setIsClaiming] = useState(false)

  // 3. Siapkan Ref untuk container carousel
  const relatedCarouselRef = useRef<HTMLDivElement>(null)

  // Fungsi untuk memanggil ulang data detail
  const fetchEventDetail = async () => {
    if (!id) {
      setLoading(false)
      return
    }

    const token = localStorage.getItem('user_token')

    try {
      const formData = new FormData()
      formData.append('id', id)

      const response = await fetch('https://api.usky.ai/event/detail', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`
        },
        body: formData,
      })

      const result = await response.json()
      
      if (result.status && result.data) {
        setEventDetail(result.data)
        await fetchRelatedEvents(result.data.event_category?.id);
      } else {
        console.error("API Error:", result.message)
      }
    } catch (error) {
      console.error('Error fetching event detail:', error)
    } finally {
      setLoading(false)
    }
  }

  const fetchOngoingEvents = async () => {
    const token = localStorage.getItem('user_token')

    try {
      const response = await fetch('https://api.usky.ai/event/ongoing', {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`
        },
      })

      const result = await response.json()

      if (result.status && result.list) {
        const formattedEvents = result.list.map((event: any) => ({
          id: Number(event.id),
          title: event.title,
          subtitle: event.event_category?.name || "Event",
          date: `${event.from_dates} - ${event.to_dates}`,
          image: event.image_url || "/placeholder.svg"
        }));
        setOngoingEvents(formattedEvents);
      } else {
        console.error("API Error:", result.message)
      }
    } catch (error) {
      console.error('Error fetching ongoing events:', error)
    }
  }

  const fetchRelatedEvents = async (categoryId: string | undefined) => {
    if (!categoryId) return;

    const token = localStorage.getItem('user_token')

    try {
      const response = await fetch(`/api/event/related?id_category=${categoryId}`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`
        },
      })

      const result = await response.json()

      if (result.status && result.list) {
        const formattedEvents = result.list.map((event: any) => ({
          id: Number(event.id),
          title: event.title,
          subtitle: event.event_category?.name || "Event",
          date: `${event.from_dates} - ${event.to_dates}`,
          image: event.image_url || "/placeholder.svg"
        }));
        setRelatedEvents(formattedEvents);
      } else {
        console.error("API Error:", result.message)
      }
    } catch (error) {
      console.error('Error fetching related events:', error)
    }
  }

  useEffect(() => {
    fetchEventDetail();
    fetchOngoingEvents();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id])

  const handleCopyLink = () => {
    navigator.clipboard.writeText(window.location.href)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const handleClaimTicket = async () => {
    if (!eventDetail || !eventDetail.id) {
       alert("Data event belum siap atau tidak ditemukan!");
       return;
    }

    const token = localStorage.getItem('user_token')
    if (!token) {
      alert("Anda harus login terlebih dahulu!")
      return
    }

    setIsClaiming(true)

    try {
      const formData = new FormData()
      formData.append('id_event', eventDetail.id)
      formData.append('id', eventDetail.id)

      const response = await fetch('https://api.usky.ai/event/claim', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`
        },
        body: formData,
      })

      const result = await response.json()
      
      if (result.status) {
        alert("Berhasil claim tiket!")
        fetchEventDetail() 
      } else {
        alert(result.message || "Gagal melakukan claim tiket.")
      }
    } catch (error) {
      console.error('Error claiming ticket:', error)
      alert("Terjadi kesalahan pada saat menghubungi server.")
    } finally {
      setIsClaiming(false)
    }
  }

  // 4. Fungsi untuk Scroll Kiri/Kanan
  const scrollCarousel = (direction: 'left' | 'right') => {
    if (relatedCarouselRef.current) {
      // Geser 300px per klik
      const scrollAmount = direction === 'left' ? -300 : 300
      relatedCarouselRef.current.scrollBy({ left: scrollAmount, behavior: 'smooth' })
    }
  }
  
  if (loading) {
    return (
      <div className="min-h-screen bg-[#050B14] flex items-center justify-center text-white">
        <div className="animate-pulse text-xl font-bold">Loading event detail...</div>
      </div>
    )
  }

  if (!eventDetail) {
    return (
      <div className="min-h-screen bg-[#050B14] flex items-center justify-center text-white">
        <div className="text-xl">Event tidak ditemukan atau ID tidak valid.</div>
      </div>
    )
  }

  const priceValue = parseInt(eventDetail.price || '0')
  const formattedPrice = priceValue === 0 ? "GRATIS" : `Rp${priceValue.toLocaleString('id-ID')}`

  return (
    <div className="min-h-screen bg-[#050B14] text-white font-sans selection:bg-yellow-500 selection:text-black">
      {/* 5. Inject CSS untuk menyembunyikan scrollbar bawaan browser agar rapi */}
      <style dangerouslySetInnerHTML={{__html: `
        .hide-scrollbar::-webkit-scrollbar { display: none; }
        .hide-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
      `}} />

      <Header />

      {/* Hero Banner */}
      <div className="relative w-full min-h-screen overflow-visible">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: `url(${eventDetail.image_url || '/images/privacy-header.jpg'})`, filter: 'brightness(0.3)' }}
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
                  <span className="px-3 py-1 bg-red-600 text-white text-xs font-bold rounded-full uppercase">
                    {eventDetail.event_category?.name || "Event"}
                  </span>
                </div>

                <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white leading-tight">
                  {eventDetail.title}
                </h1>

                <div className="space-y-5">
                  <div className="flex flex-wrap items-center gap-6">
                    <div className="flex items-center gap-2">
                      <CalendarIcon className="w-5 h-5 text-gray-400" />
                      <span className="text-base md:text-lg text-gray-300">{eventDetail.from_dates}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Clock className="w-5 h-5 text-gray-400" />
                      <span className="text-base md:text-lg text-gray-300">{eventDetail.from_times} - {eventDetail.to_times}</span>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <MapPin className="w-5 h-5 text-gray-400 flex-shrink-0 mt-1" />
                    <div>
                      <p className="text-sm text-gray-400">Location</p>
                      <p className="text-base md:text-lg text-white font-medium">{eventDetail.address}</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Right Sidebar Card */}
              <div className="lg:col-span-1">
                <div className="sticky top-24 max-w-sm mx-auto lg:ml-auto w-full">
                  <div className="border-2 border-red-600 rounded-2xl p-1 backdrop-blur shadow-2xl shadow-red-900/20">
                    <div className="bg-[#050B14] rounded-xl p-5 space-y-4">
                      
                      <div className="relative rounded-lg overflow-hidden shadow-lg group">
                        <img
                          src={eventDetail.image_url || "/images/event/example.png"}
                          alt={eventDetail.title}
                          className="w-full h-36 object-cover transform group-hover:scale-105 transition-transform duration-500"
                        />
                      </div>

                      <div className="space-y-2">
                        <h3 className="text-xl md:text-2xl font-bold text-yellow-400 leading-tight">
                          {eventDetail.title}
                        </h3>
                        <p className="text-xs text-gray-300 leading-relaxed italic border-l-2 border-gray-700 pl-3">
                          Sisa Kursi: <span className="font-bold text-white">{eventDetail.sisa || 0}</span> / {eventDetail.total_seat || 0}
                        </p>
                      </div>

                      <div className="space-y-2 py-3 border-y border-gray-800">
                        <div className="flex justify-between items-end">
                          <p className="text-[10px] text-yellow-500/80 uppercase tracking-wider font-bold">Harga Tiket</p>
                          <p className="text-xl font-bold text-yellow-400">{formattedPrice}</p>
                        </div>
                      </div>

                      <button className="w-full bg-yellow-400 hover:bg-yellow-500 text-black font-extrabold py-3 rounded-lg transition-all transform hover:scale-[1.02] text-sm uppercase tracking-wide shadow-[0_0_15px_rgba(250,204,21,0.3)]">
                        Register Now
                      </button>

                      <div className="flex items-center gap-3">
                        <button 
                          onClick={handleClaimTicket}
                          disabled={isClaiming || eventDetail.close}
                          className={`flex-1 ${
                            eventDetail.close 
                              ? 'bg-green-600 text-white cursor-not-allowed'
                              : isClaiming 
                                ? 'bg-gray-400 text-black cursor-not-allowed'
                                : 'bg-gray-300 hover:bg-gray-400 text-black'
                          } py-3 rounded-full text-sm font-semibold transition-colors flex justify-center items-center gap-2`}
                        >
                          {isClaiming ? (
                            <>
                              <svg className="animate-spin h-4 w-4 text-black" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                              </svg>
                              Processing...
                            </>
                          ) : eventDetail.close ? (
                            "Claimed" 
                          ) : (
                            "Claim Your Ticket" 
                          )}
                        </button>

                        <button
                          onClick={handleCopyLink}
                          className={`flex-shrink-0 w-12 h-12 flex items-center justify-center bg-white hover:bg-gray-100 text-black rounded-full transition-colors border-2 ${copied ? 'border-green-500' : 'border-gray-300'}`}
                        >
                          {copied ? (
                             <span className="text-xs font-bold text-green-600">Copied</span>
                          ) : (
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                            </svg>
                          )}
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
      <div className="max-w-7xl mx-auto px-6 md:px-12 py-12 pb-24 space-y-12 overflow-hidden">
        {/* Event Description */}
        <section>
          <h2 className="text-2xl font-bold text-white mb-6">Tentang Event Ini</h2>
          <div 
            className="text-gray-300 leading-relaxed text-base mb-6 prose prose-invert max-w-none"
            dangerouslySetInnerHTML={{ __html: eventDetail.description }} 
          />
        </section>

        {/* 6. Related Events - Diubah Menjadi Carousel Satu Baris Sesuai Gambar */}
        <section className="relative group/section">
          <h2 className="text-2xl font-bold text-white mb-6">Related Event</h2>
          
          <div className="relative">
            {/* Tombol Kiri */}
            <button 
              onClick={() => scrollCarousel('left')}
              className="absolute -left-4 top-1/2 -translate-y-1/2 z-10 w-10 h-10 flex items-center justify-center bg-[#2A303C] hover:bg-gray-600 text-white rounded-full transition-all shadow-lg opacity-0 group-hover/section:opacity-100 disabled:opacity-0"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>

            {/* Container List (Flex Row + Overflow X) */}
            <div 
              ref={relatedCarouselRef}
              className="flex gap-4 overflow-x-auto snap-x snap-mandatory scroll-smooth hide-scrollbar pb-4"
            >
              {relatedEvents.map((event) => (
                // min-w-[200px] atau min-w-[250px] menjaga ukurannya agar tidak mengecil (tetap 1 baris memanjang)
                <Link href={`/dashboard/event/detail?id=${event.id}`} key={event.id} className="group block min-w-[220px] md:min-w-[260px] flex-shrink-0 snap-start">
                  <div className="relative aspect-[3/4] rounded-xl overflow-hidden mb-3">
                    <img
                      src={event.image || "/placeholder.svg"}
                      alt={event.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                      <Play className="w-14 h-14 text-white fill-white" />
                    </div>
                  </div>

                  <h3 className="text-white font-bold mb-1 truncate">{event.title}</h3>
                  <p className="text-gray-400 text-sm mb-2 truncate">{event.subtitle}</p>
                  <p className="text-gray-500 text-xs">{event.date}</p>
                </Link>
              ))}
            </div>

            {/* Tombol Kanan */}
            <button 
              onClick={() => scrollCarousel('right')}
              className="absolute -right-4 top-1/2 -translate-y-1/2 z-10 w-10 h-10 flex items-center justify-center bg-[#2A303C] hover:bg-gray-600 text-white rounded-full transition-all shadow-lg opacity-0 group-hover/section:opacity-100 disabled:opacity-0"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        </section>

        {/* On Going Events (Tetap seperti aslinya / bisa diubah jadi carousel juga nantinya jika mau) */}
        <section>
          <h2 className="text-2xl font-bold text-white mb-8">On Going Events</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {ongoingEvents.map((event) => (
              <Link href={`/dashboard/event/detail?id=${event.id}`} key={event.id} className="group block">
                <div className="relative aspect-[3/4] rounded-xl overflow-hidden mb-4">
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
              </Link>
            ))}
          </div>
        </section>
      </div>

      <Footer />
    </div>
  )
}

export default function EventDetailPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-[#050B14] flex items-center justify-center"><div className="animate-pulse text-white">Loading...</div></div>}>
      <EventDetailContent />
    </Suspense>
  )
}