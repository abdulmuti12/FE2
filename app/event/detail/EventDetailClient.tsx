'use client'

import { Header } from '@/components/header'
import { Footer } from '@/components/footer'
import { ClipShare } from '@/components/clip/clip-share'
import { MapPin, Clock, Play, Calendar as CalendarIcon, Share2 } from 'lucide-react'
import { useState, useEffect, Suspense, useRef } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'

interface EventDetailData {
  id: string
  title: string
  description: string
  address: string
  image_url: string
  tgl_live?: string
  from_dates: string
  from_times_format?: string
  to_times_format?: string
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

type MetaEntry = {
  attr: 'name' | 'property'
  key: string
  content: string
}

const EVENT_ID_STORAGE_KEY = 'selected_event_id'

function EventDetailContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [eventId, setEventId] = useState<string | null>(null)

  const [eventDetail, setEventDetail] = useState<EventDetailData | null>(null)
  const [ongoingEvents, setOngoingEvents] = useState<EventCard[]>([])
  const [relatedEvents, setRelatedEvents] = useState<EventCard[]>([])
  const [loading, setLoading] = useState(true)
  const [showShare, setShowShare] = useState(false)
  const [showShareToast, setShowShareToast] = useState(false)
  const [shareToastMessage, setShareToastMessage] = useState('Link copied to clipboard!')
  const shareToastTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const [showClaimToast, setShowClaimToast] = useState(false)
  const [claimToastMessage, setClaimToastMessage] = useState('')
  const [claimToastType, setClaimToastType] = useState<'success' | 'error'>('success')
  const claimToastTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const createdMetaNodesRef = useRef<HTMLMetaElement[]>([])
  const updatedMetaNodesRef = useRef<Array<{ element: HTMLMetaElement; previousContent: string | null }>>([])
  const previousTitleRef = useRef<string | null>(null)

  const [isClaiming, setIsClaiming] = useState(false)

  useEffect(() => {
    const idFromQuery = searchParams.get('id')
    const storedId = sessionStorage.getItem(EVENT_ID_STORAGE_KEY)
    const resolvedId = idFromQuery || storedId || null

    setEventId(resolvedId)
    if (resolvedId) {
      sessionStorage.setItem(EVENT_ID_STORAGE_KEY, resolvedId)
    }
  }, [searchParams])

  useEffect(() => {
    if (!eventId) return
    const currentIdInQuery = searchParams.get('id')
    if (currentIdInQuery === eventId) return
    router.replace(`/event/detail?id=${encodeURIComponent(eventId)}`)
  }, [eventId, router, searchParams])

  const openEventDetail = (id: string | number) => {
    const nextId = String(id)
    sessionStorage.setItem(EVENT_ID_STORAGE_KEY, nextId)
    setEventId(nextId)
    router.push(`/event/detail?id=${encodeURIComponent(nextId)}`)
  }

  const fetchEventDetail = async () => {
    if (!eventId) {
      setLoading(false)
      return
    }

    const token = localStorage.getItem('user_token')

    try {
      const response = await fetch('/api/event/event-detail', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ id: eventId }),
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
      const response = await fetch('/api/event/ongoing', {
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
      const response = await fetch(`/api/event/events/related?id_category=${categoryId}`, {
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
    if (!eventId) return
    setLoading(true)
    fetchEventDetail();
    fetchOngoingEvents();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [eventId])

  useEffect(() => {
    return () => {
      if (shareToastTimerRef.current) {
        clearTimeout(shareToastTimerRef.current)
      }
      if (claimToastTimerRef.current) {
        clearTimeout(claimToastTimerRef.current)
      }
    }
  }, [])

  const stripHtml = (value: string): string =>
    value.replace(/<[^>]+>/g, ' ').replace(/&nbsp;/gi, ' ').replace(/\s+/g, ' ').trim()

  const decodeHtmlEntities = (text: string): string => {
    const textarea = document.createElement('textarea')
    textarea.innerHTML = text
    return textarea.value
  }

  const parseMetaEntries = (metaBlob: string): MetaEntry[] => {
    const normalized = metaBlob.replace(/\\\//g, '/').replace(/\\"/g, '"')
    const regex = /<meta\s+(property|name)=["']([^"']+)["']\s+content=["']([^"']*)["'][^>]*>/gi
    const entries: MetaEntry[] = []

    let match: RegExpExecArray | null
    while ((match = regex.exec(normalized)) !== null) {
      const attrType = match[1]?.toLowerCase() as 'name' | 'property'
      const key = match[2]?.trim()
      const content = decodeHtmlEntities((match[3] || '').replace(/\s+/g, ' ').trim())

      if (attrType && key && content) {
        entries.push({ attr: attrType, key, content })
      }
    }

    return entries
  }

  const truncateText = (value: string, maxLength: number): string => {
    if (value.length <= maxLength) return value
    return `${value.slice(0, maxLength).trim()}...`
  }

  const showShareToastCard = (message: string) => {
    setShareToastMessage(message)
    setShowShareToast(true)

    if (shareToastTimerRef.current) {
      clearTimeout(shareToastTimerRef.current)
    }

    shareToastTimerRef.current = setTimeout(() => {
      setShowShareToast(false)
    }, 2200)
  }

  const showClaimToastCard = (message: string, type: 'success' | 'error') => {
    setClaimToastMessage(message)
    setClaimToastType(type)
    setShowClaimToast(true)

    if (claimToastTimerRef.current) {
      clearTimeout(claimToastTimerRef.current)
    }

    claimToastTimerRef.current = setTimeout(() => {
      setShowClaimToast(false)
    }, 2200)
  }

  const handlePlatformShare = async (platform: string) => {
    const url = window.location.href
    const title = eventDetail?.title || 'Event'
    const rawDescription = stripHtml(eventDetail?.description || '')
    const shortDescription = truncateText(rawDescription, 180)
    const text = shortDescription
      ? `${title}\n${shortDescription}`
      : `Check out this event: ${title}`

    switch (platform) {
      case 'copy':
        try {
          await navigator.clipboard.writeText(url)
          showShareToastCard('Link copied to clipboard!')
        } catch {
          showShareToastCard('Gagal menyalin link')
        }
        break
      case 'whatsapp':
        window.open(`https://wa.me/?text=${encodeURIComponent(text + ' ' + url)}`, '_blank')
        break
      case 'facebook':
        window.open(
          `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}&quote=${encodeURIComponent(text)}`,
          '_blank'
        )
        break
      case 'x':
        window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(url)}`, '_blank')
        break
      case 'telegram':
        window.open(`https://t.me/share/url?url=${encodeURIComponent(url)}&text=${encodeURIComponent(text)}`, '_blank')
        break
      case 'linkedin':
        window.open(`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`, '_blank')
        break
    }

    setShowShare(false)
  }

  useEffect(() => {
    const cleanupAppliedMeta = () => {
      createdMetaNodesRef.current.forEach((node) => node.remove())
      createdMetaNodesRef.current = []

      updatedMetaNodesRef.current.forEach(({ element, previousContent }) => {
        if (previousContent === null) {
          element.removeAttribute('content')
        } else {
          element.setAttribute('content', previousContent)
        }
      })
      updatedMetaNodesRef.current = []

      if (previousTitleRef.current !== null) {
        document.title = previousTitleRef.current
        previousTitleRef.current = null
      }
    }

    // Injeksi manual di client ini tetap dibiarkan agar saat user pindah-pindah halaman secara SPA,
    // title browser dan meta-nya tetap berubah secara dinamis.
    const applyEventMeta = async () => {
      if (!eventId) return

      try {
        cleanupAppliedMeta()

        const token = localStorage.getItem('user_token')
        const url = new URL('/api/event/meta', window.location.origin)
        url.searchParams.set('id', eventId)

        const response = await fetch(url.toString(), {
          method: 'GET',
          headers: token
            ? {
                Authorization: `Bearer ${token}`,
                'Content-Type': 'application/json',
              }
            : undefined,
        })

        const result = await response.json()
        if (!response.ok || result?.status !== true || typeof result?.data !== 'string') {
          return
        }

        const entries = parseMetaEntries(result.data)

        if (previousTitleRef.current === null) {
          previousTitleRef.current = document.title
        }

        for (const entry of entries) {
          const existing = Array.from(document.head.querySelectorAll(`meta[${entry.attr}]`)).find((node) => {
            const value = node.getAttribute(entry.attr)
            return typeof value === 'string' && value.toLowerCase() === entry.key.toLowerCase()
          }) as HTMLMetaElement | undefined

          if (existing) {
            const alreadyTracked = updatedMetaNodesRef.current.some((item) => item.element === existing)
            if (!alreadyTracked) {
              updatedMetaNodesRef.current.push({
                element: existing,
                previousContent: existing.getAttribute('content'),
              })
            }
            existing.setAttribute('content', entry.content)
          } else {
            const meta = document.createElement('meta')
            meta.setAttribute(entry.attr, entry.key)
            meta.setAttribute('content', entry.content)
            meta.setAttribute('data-event-meta', '1')
            document.head.appendChild(meta)
            createdMetaNodesRef.current.push(meta)
          }
        }

        const ogTitle = entries.find((e) => e.attr === 'property' && e.key.toLowerCase() === 'og:title')?.content
        const twitterTitle = entries.find((e) => e.attr === 'name' && e.key.toLowerCase() === 'twitter:title')?.content
        if (ogTitle || twitterTitle) {
          document.title = ogTitle || twitterTitle || document.title
        }
      } catch (error) {
        console.error('Error applying event meta tags:', error)
      }
    }

    applyEventMeta()

    return () => {
      cleanupAppliedMeta()
    }
  }, [eventId])

  const handleClaimTicket = async () => {
    if (!eventDetail || !eventDetail.id) {
      showClaimToastCard('Data event belum siap atau tidak ditemukan', 'error')
      return
    }

    const token = localStorage.getItem('user_token')
    if (!token) {
      showClaimToastCard('Anda harus login terlebih dahulu', 'error')
      return
    }

    setIsClaiming(true)

    try {
      const response = await fetch('/api/event/events/claim', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ id: eventDetail.id }),
      })

      const result = await response.json()

      if (response.ok && result.status) {
        showClaimToastCard('Berhasil claim tiket', 'success')
        fetchEventDetail()
      } else {
        showClaimToastCard(result.message || 'Gagal melakukan claim tiket', 'error')
      }
    } catch (error) {
      console.error('Error claiming ticket:', error)
      showClaimToastCard('Terjadi kesalahan pada saat menghubungi server', 'error')
    } finally {
      setIsClaiming(false)
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
      <Header />

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
                      <span className="text-base md:text-lg text-gray-300">{eventDetail.tgl_live || eventDetail.from_dates}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Clock className="w-5 h-5 text-gray-400" />
                      <span className="text-base md:text-lg text-gray-300">
                        {eventDetail.from_times_format || eventDetail.from_times} - {eventDetail.to_times_format || eventDetail.to_times}
                      </span>
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
                          onClick={() => setShowShare(true)}
                          className="h-12 w-12 rounded-full border border-white/15 bg-white/5 hover:bg-white/10 transition-colors flex items-center justify-center"
                          title="Share"
                          aria-label="Share event"
                        >
                          <Share2 className="w-5 h-5" />
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

      <div className="max-w-7xl mx-auto px-6 md:px-12 py-12 pb-24 space-y-12">
        <section>
          <h2 className="text-2xl font-bold text-white mb-6">Tentang Event Ini</h2>
          <div 
            className="text-gray-300 leading-relaxed text-base mb-6 prose prose-invert max-w-none"
            dangerouslySetInnerHTML={{ __html: eventDetail.description }} 
          />
        </section>

        <section>
          <h2 className="text-2xl font-bold text-white mb-8">Related Event</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {relatedEvents.map((event) => (
              <button
                key={event.id}
                onClick={() => openEventDetail(event.id)}
                className="group block text-left"
              >
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
              </button>
            ))}
          </div>
        </section>

        <section>
          <h2 className="text-2xl font-bold text-white mb-8">On Going Events</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {ongoingEvents.map((event) => (
              <button
                key={event.id}
                onClick={() => openEventDetail(event.id)}
                className="group block text-left"
              >
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
              </button>
            ))}
          </div>
        </section>
      </div>

      <Footer />

      <ClipShare
        showShare={showShare}
        clipId={eventDetail.id}
        clipName={eventDetail.title}
        onClose={() => setShowShare(false)}
        onPlatformShare={handlePlatformShare}
      />

      <div
        className={`fixed top-4 left-1/2 z-[120] -translate-x-1/2 rounded-xl border border-blue-300/40 bg-blue-600 px-4 py-2 text-sm font-medium text-white shadow-lg transition-all duration-300 ${
          showShareToast ? 'opacity-100 translate-y-0' : 'pointer-events-none opacity-0 -translate-y-2'
        }`}
        role="status"
        aria-live="polite"
      >
        {shareToastMessage}
      </div>

      <div
        className={`fixed top-16 left-1/2 z-[120] -translate-x-1/2 rounded-xl px-4 py-2 text-sm font-medium text-white shadow-lg transition-all duration-300 ${
          claimToastType === 'success'
            ? 'border border-green-300/40 bg-green-600'
            : 'border border-red-300/40 bg-red-600'
        } ${showClaimToast ? 'opacity-100 translate-y-0' : 'pointer-events-none opacity-0 -translate-y-2'}`}
        role="status"
        aria-live="polite"
      >
        {claimToastMessage}
      </div>
    </div>
  )
}

export default function EventDetailClient() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-[#050B14] flex items-center justify-center"><div className="animate-pulse text-white">Loading...</div></div>}>
      <EventDetailContent />
    </Suspense>
  )
}
