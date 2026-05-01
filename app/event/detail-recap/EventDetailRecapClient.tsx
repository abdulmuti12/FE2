'use client'

import { Suspense, useEffect, useState } from 'react'
import Image from 'next/image'
import { useRouter, useSearchParams } from 'next/navigation'
import { Header } from '@/components/header'
import { Footer } from '@/components/footer'
import { Calendar, MapPin, Play, Clock } from 'lucide-react'

interface EventDetailData {
  id: string
  title: string
  description?: string
  address?: string
  image_url?: string
  video_url?: string
  from_dates?: string
  from_times?: string
  to_times?: string
  event_category?: {
    id: string
    name: string
  }
}

const EVENT_ID_STORAGE_KEY = 'selected_event_id'

const toSecureUrl = (url?: string) => {
  if (!url) return ''
  return url.replace(/^http:\/\//i, 'https://')
}

const formatDateLabel = (value?: string) => {
  if (!value) return '-'
  const isoLike = value.includes('T') ? value : value.replace(' ', 'T')
  const date = new Date(isoLike)
  if (Number.isNaN(date.getTime())) return value
  return date.toLocaleDateString('id-ID', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  })
}

function EventDetailRecapContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [eventId, setEventId] = useState<string | null>(null)
  const [eventDetail, setEventDetail] = useState<EventDetailData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

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
    if (!eventId) {
      setError('ID event tidak ditemukan di URL')
      setLoading(false)
      return
    }

    const fetchEventDetail = async () => {
      try {
        setLoading(true)
        setError(null)
        const token = localStorage.getItem('user_token') || ''

        if (!token) {
          setError('Silakan login terlebih dahulu')
          return
        }

        const response = await fetch('/api/event/event-detail', {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ id: eventId }),
        })

        const result = await response.json()
        if (response.ok && result?.status === true && result?.data) {
          setEventDetail(result.data as EventDetailData)
        } else {
          setError(result?.message || 'Gagal mengambil detail recap event')
        }
      } catch (fetchError) {
        console.error('Error fetching recap event detail:', fetchError)
        setError('Terjadi kesalahan saat menghubungi server')
      } finally {
        setLoading(false)
      }
    }

    fetchEventDetail()
  }, [eventId])

  if (loading) {
    return (
      <div className="min-h-screen bg-[#050B14] flex items-center justify-center text-white">
        <div className="w-10 h-10 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mr-3" />
        <p>Memuat Recap Event...</p>
      </div>
    )
  }

  if (error || !eventDetail) {
    return (
      <div className="min-h-screen bg-[#050B14] flex flex-col items-center justify-center text-white px-4">
        <p className="text-red-400 mb-4 text-center">{error || 'Data event tidak ditemukan'}</p>
        <button
          onClick={() => router.push('/event')}
          className="px-6 py-2 bg-blue-600 hover:bg-blue-700 rounded-full transition-colors"
        >
          Kembali ke Event
        </button>
      </div>
    )
  }

  const imageUrl = toSecureUrl(eventDetail.image_url) || '/placeholder.jpg'
  const videoUrl = toSecureUrl(eventDetail.video_url)

  return (
    <>
      <Header />
      <main className="max-w-[1920px] mx-auto px-4 sm:px-6 lg:px-10 xl:px-14 py-6 md:py-10 text-white">
        <div className="flex flex-col lg:flex-row gap-6 lg:gap-8">
          <div className="w-full lg:w-2/3 xl:w-[70%] relative bg-black rounded-xl overflow-hidden aspect-[16/9] border border-white/10 shadow-2xl">
            {videoUrl ? (
              <video
                key={videoUrl}
                controls
                controlsList="nodownload"
                className="w-full h-full object-contain"
                poster={imageUrl}
              >
                <source src={videoUrl} type="video/mp4" />
                Browser Anda tidak mendukung pemutar video ini.
              </video>
            ) : (
              <div className="w-full h-full flex flex-col items-center justify-center bg-[#111] text-white/50 relative">
                <Image src={imageUrl} alt={eventDetail.title} fill className="object-cover opacity-60" />
                <Play className="w-16 h-16 text-white/80 z-10 absolute" />
              </div>
            )}
          </div>

          <aside className="w-full lg:w-1/3 xl:w-[30%] bg-[#12161E] border border-white/5 rounded-xl p-5 md:p-6">
            <p className="text-xs uppercase tracking-wide text-blue-300 mb-2">
              {eventDetail.event_category?.name || 'Recap Event'}
            </p>
            <h1 className="text-2xl font-bold leading-tight mb-5">{eventDetail.title}</h1>

            <div className="space-y-3 text-sm text-white/80">
              <div className="flex items-start gap-2">
                <Calendar className="w-4 h-4 mt-0.5 text-blue-300" />
                <span>{formatDateLabel(eventDetail.from_dates)}</span>
              </div>
              <div className="flex items-start gap-2">
                <Clock className="w-4 h-4 mt-0.5 text-blue-300" />
                <span>
                  {eventDetail.from_times || '-'} {eventDetail.to_times ? `- ${eventDetail.to_times}` : ''}
                </span>
              </div>
              <div className="flex items-start gap-2">
                <MapPin className="w-4 h-4 mt-0.5 text-blue-300" />
                <span>{eventDetail.address || '-'}</span>
              </div>
            </div>

            <button
              onClick={() => router.push('/event')}
              className="w-full mt-6 px-4 py-2 rounded-full bg-blue-600 hover:bg-blue-700 transition-colors"
            >
              Kembali ke Event
            </button>
          </aside>
        </div>

        <section className="mt-8 bg-[#12161E] border border-white/5 rounded-xl p-5 md:p-6">
          <h2 className="text-lg font-bold mb-3">Deskripsi</h2>
          <p
            className="text-sm text-white/80 leading-relaxed"
            dangerouslySetInnerHTML={{ __html: eventDetail.description || '-' }}
          />
        </section>
      </main>
      <Footer />
    </>
  )
}

export default function EventDetailRecapClient() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-[#050B14] flex items-center justify-center text-white">
          <div className="animate-pulse text-xl font-bold">Loading recap event...</div>
        </div>
      }
    >
      <EventDetailRecapContent />
    </Suspense>
  )
}

