'use client'

import { Suspense, useEffect, useState } from 'react'
import Image from 'next/image'
import { useRouter, useSearchParams } from 'next/navigation'
import { Header } from '@/components/header'
import { Footer } from '@/components/footer'
import { ClipShare } from '@/components/clip/clip-share'
import { Calendar, MapPin, Play, Clock, Share2 } from 'lucide-react'
import { useRef } from 'react'

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

type MetaEntry = {
  attr: 'name' | 'property'
  key: string
  content: string
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
  const [showShare, setShowShare] = useState(false)
  const [showShareToast, setShowShareToast] = useState(false)
  const [shareToastMessage, setShareToastMessage] = useState('Link copied to clipboard!')
  const shareToastTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const createdMetaNodesRef = useRef<HTMLMetaElement[]>([])
  const updatedMetaNodesRef = useRef<Array<{ element: HTMLMetaElement; previousContent: string | null }>>([])
  const previousTitleRef = useRef<string | null>(null)

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

  useEffect(() => {
    return () => {
      if (shareToastTimerRef.current) {
        clearTimeout(shareToastTimerRef.current)
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

  const handlePlatformShare = async (platform: string) => {
    const url = window.location.href
    const title = eventDetail?.title || 'Event Recap'
    const rawDescription = stripHtml(eventDetail?.description || '')
    const shortDescription = truncateText(rawDescription, 180)
    const text = shortDescription
      ? `${title}\n${shortDescription}`
      : `Check out this event recap: ${title}`

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
      default:
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
      } catch (metaError) {
        console.error('Error applying event recap meta tags:', metaError)
      }
    }

    applyEventMeta()

    return () => {
      cleanupAppliedMeta()
    }
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

            <button
              onClick={() => setShowShare(true)}
              className="w-full mt-3 h-10 rounded-full border border-white/15 bg-white/5 hover:bg-white/10 transition-colors flex items-center justify-center gap-2"
              title="Share"
              aria-label="Share recap event"
            >
              <Share2 className="w-4 h-4" />
              Share
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
