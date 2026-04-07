'use client'

import React, { useState, useEffect, Suspense } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { useSearchParams } from 'next/navigation'
import { Header } from '@/components/header'
import { Footer } from '@/components/footer'
import {
  Heart,
  Plus,
  Share2,
  ChevronRight,
} from 'lucide-react'

// ============================================================================
// Types
// ============================================================================

interface RelatedFilm {
  id: string
  name: string
  description: string
  run_time: string
  years: string
  cats: string
  image_url: string
  video_url: string
  run_time_format: string
}

interface FilmData {
  id: string
  name: string
  description: string
  run_time: string
  years: string
  cats: string
  rates: string | null
  image_url: string
  video_url: string
  relate: RelatedFilm[]
}

interface Comment {
  id: number
  author: string
  avatar: string
  text: string
  date: string
}

// ============================================================================
// Constants - API
// ============================================================================

const API = {
  ENDPOINTS: {
    FILM_DETAIL: '/api/film/detail',
  },
  STORAGE_KEY: 'user_token',
} as const

// ============================================================================
// Constants - Data
// ============================================================================

const MOCK_COMMENTS: Comment[] = [
  
]

// ============================================================================
// Helper Functions
// ============================================================================

const convertToSecureUrl = (url: string): string => {
  if (!url) return ''
  return url.replace('http://', 'https://')
}

const getAuthHeaders = (token: string) => ({
  Authorization: `Bearer ${token}`,
  'Content-Type': 'application/json',
})

// ============================================================================
// Component
// ============================================================================

function DetailContent() {
  const searchParams = useSearchParams()
  const filmId = searchParams.get('id')

  // State
  const [filmData, setFilmData] = useState<FilmData | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [rating, setRating] = useState(0)
  const [reviewText, setReviewText] = useState('')

  // Effects - Fetch Film Detail
  useEffect(() => {
    const fetchFilmDetail = async () => {
      if (!filmId) {
        setError('ID Film tidak ditemukan di URL')
        setIsLoading(false)
        return
      }

      try {
        setIsLoading(true)
        const token = localStorage.getItem(API.STORAGE_KEY)

        const url = new URL(API.ENDPOINTS.FILM_DETAIL, window.location.origin)
        url.searchParams.set('id', filmId)

        const response = await fetch(url.toString(), {
          method: 'GET',
          headers: getAuthHeaders(token || ''),
        })

        const result = await response.json()

        if (result.status === true && result.data) {
          setFilmData(result.data)
        } else {
          setError(result.message || 'Gagal mengambil data film')
        }
      } catch (err) {
        console.error('Error fetching detail:', err)
        setError('Terjadi kesalahan saat menghubungi server')
      } finally {
        setIsLoading(false)
      }
    }

    fetchFilmDetail()
  }, [filmId])

  // State Loading
  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#020817] flex flex-col items-center justify-center text-white font-sans">
        <div className="w-10 h-10 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mb-4"></div>
        <p>Memuat Film...</p>
      </div>
    )
  }

  // State Error
  if (error || !filmData) {
    return (
      <div className="min-h-screen bg-[#020817] flex flex-col items-center justify-center text-white font-sans gap-4">
        <p className="text-xl font-bold">Oops!</p>
        <p className="text-gray-400">{error || 'Data film tidak ditemukan.'}</p>
        <Link href="/dashboard/film" className="px-6 py-2 bg-blue-600 hover:bg-blue-700 rounded-full transition-colors">
          Kembali ke List Film
        </Link>
      </div>
    )
  }

  return (
    <>
      <Header />

      {/* Top Player Area */}
      <div className="bg-gradient-to-b from-[#0b1222] via-[#020817] to-[#020817] pb-8 md:pb-10">
        <div className="w-full px-4 md:px-8 lg:px-12 pt-4 md:pt-6">
          
          <div className="relative w-full rounded-xl md:rounded-2xl overflow-hidden bg-black shadow-[0_20px_60px_rgba(0,0,0,0.6)]">
            <div className="relative w-full aspect-video md:max-h-[85vh] bg-black mx-auto">
              {filmData.video_url ? (
                <video
                  key={filmData.video_url}
                  controls
                  controlsList="nodownload"
                  className="w-full h-full object-contain"
                  poster={convertToSecureUrl(filmData.image_url)}
                >
                  <source src={convertToSecureUrl(filmData.video_url)} type="video/mp4" />
                  Browser Anda tidak mendukung pemutar video ini.
                </video>
              ) : (
                <div className="w-full h-full flex items-center justify-center text-white/50">
                  Video tidak tersedia
                </div>
              )}
            </div>
          </div>

          {/* Info Bar under player */}
          <div className="mt-5 md:mt-8 flex flex-col md:flex-row md:items-start md:justify-between gap-4 md:gap-6">
            <div className="space-y-2 md:space-y-3">
              <h1 className="text-lg sm:text-xl md:text-3xl font-bold">
                {filmData.name}
              </h1>

              <div className="flex flex-wrap items-center gap-2 md:gap-3 text-xs md:text-sm">
                <span className="px-2.5 py-1 rounded-full bg-white/10 border border-white/10">
                  {filmData.cats || 'Uncategorized'}
                </span>

                <div className="flex items-center gap-1 text-yellow-400">
                  <span>★</span>
                  <span>★</span>
                  <span>★</span>
                  <span className="text-white/70 ml-1">{filmData.rates || '0.0'}</span>
                </div>

                <span className="text-white/60">{filmData.years}</span>
                <span className="text-white/60">{filmData.run_time}m</span>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex items-center gap-2 md:gap-3">
              <button className="h-9 w-9 md:h-10 md:w-10 rounded-full border border-white/15 bg-white/5 hover:bg-white/10 transition-colors flex items-center justify-center" title="Favorite">
                <Heart className="w-4 h-4 md:w-5 md:h-5" />
              </button>
              <button className="h-9 w-9 md:h-10 md:w-10 rounded-full border border-white/15 bg-white/5 hover:bg-white/10 transition-colors flex items-center justify-center" title="Add to Watchlist">
                <Plus className="w-4 h-4 md:w-5 md:h-5" />
              </button>
              <button className="h-9 w-9 md:h-10 md:w-10 rounded-full border border-white/15 bg-white/5 hover:bg-white/10 transition-colors flex items-center justify-center" title="Share">
                <Share2 className="w-4 h-4 md:w-5 md:h-5" />
              </button>
            </div>
          </div>

          {/* Description */}
          <div 
            className="mt-3 md:mt-5 text-white/70 text-xs sm:text-sm leading-relaxed md:max-w-[70%]"
            dangerouslySetInnerHTML={{ __html: filmData.description || 'Tidak ada sinopsis tersedia untuk film ini.' }}
          />
        </div>
      </div>

      {/* Main Content */}
      <div className="w-full px-4 md:px-8 lg:px-12 pb-14 md:pb-16">
        
        {/* Review Section */}
        <section className="mt-8 md:mt-10 rounded-2xl bg-white/5 border border-white/10 overflow-hidden">
          {/* Review Header */}
          <div className="px-4 sm:px-6 py-4 sm:py-5 flex items-center justify-between gap-3 border-b border-white/10">
            <h2 className="text-base sm:text-lg md:text-xl font-bold">Review</h2>

            <div className="flex items-center gap-2 sm:gap-3">
              <button className="h-9 sm:h-10 px-3 sm:px-4 rounded-full bg-white/10 border border-white/15 hover:bg-white/15 transition-colors text-xs sm:text-sm inline-flex items-center gap-2">
                <Plus className="w-4 h-4" />
                Add Comment
              </button>

              <button className="h-9 sm:h-10 px-3 sm:px-4 rounded-full bg-white/10 border border-white/15 hover:bg-white/15 transition-colors text-xs sm:text-sm inline-flex items-center gap-2">
                Newest
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Comments List */}
          <div className="px-4 sm:px-6 py-5 sm:py-6 space-y-5 sm:space-y-6">
            {MOCK_COMMENTS.map((comment) => (
              <div key={comment.id} className="flex gap-3 sm:gap-4">
                <div className="h-9 w-9 sm:h-10 sm:w-10 rounded-full overflow-hidden bg-white/10 border border-white/10 flex-shrink-0">
                  <Image
                    src={comment.avatar}
                    alt={comment.author}
                    width={40}
                    height={40}
                    className="h-full w-full object-cover"
                  />
                </div>

                <div className="flex-1">
                  <div className="flex items-center justify-between gap-3">
                    <p className="text-xs sm:text-sm font-semibold">{comment.author}</p>
                    <p className="text-[10px] sm:text-xs text-white/40">{comment.date}</p>
                  </div>
                  <p className="mt-2 text-xs sm:text-sm text-white/70 leading-relaxed">
                    {comment.text}
                  </p>
                </div>
              </div>
            ))}
          </div>

          <div className="h-px bg-white/10" />

          {/* Review Form */}
          <div className="px-4 sm:px-6 py-5 sm:py-6">
            <label className="text-xs sm:text-sm font-semibold mb-3 block">Rating This Film</label>
            <div className="flex items-center gap-2 mb-6">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  onClick={() => setRating(star)}
                  className={`text-xl sm:text-2xl transition-colors ${
                    star <= rating ? 'text-yellow-400' : 'text-white/25'
                  }`}
                  aria-label={`Rate ${star} stars`}
                >
                  ★
                </button>
              ))}
            </div>

            <label className="text-xs sm:text-sm font-semibold mb-3 block">Your Review</label>
            <textarea
              value={reviewText}
              onChange={(e) => setReviewText(e.target.value)}
              placeholder="Tulis ulasan Anda di sini..."
              className="w-full min-h-[100px] rounded-xl bg-[#0b1222] border border-white/10 px-4 py-3 text-xs sm:text-sm text-white placeholder:text-white/35 outline-none focus:border-white/20"
            />

            <div className="flex justify-end mt-4">
              <button 
                onClick={() => alert("Fitur submit belum diimplementasikan.")}
                className="h-9 sm:h-10 px-5 sm:px-6 rounded-full bg-white text-black font-semibold text-xs sm:text-sm hover:bg-white/90 transition-colors"
              >
                Submit Review
              </button>
            </div>
          </div>

          {/* Footer */}
          <div className="px-4 sm:px-6 py-4 border-t border-white/10">
            <button 
              onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
              className="text-xs sm:text-sm text-white/60 hover:text-white transition-colors"
            >
              ↑ Scroll to Top
            </button>
          </div>
        </section>
      </div>

      <Footer />
    </>
  )
}

// Wrapper dengan Suspense untuk useSearchParams() support
export default function FilmDetailPage() {
  return (
    <div className="min-h-screen bg-[#020817] text-white font-sans">
      <Suspense fallback={
        <div className="min-h-screen flex items-center justify-center">
          <div className="w-10 h-10 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
        </div>
      }>
        <DetailContent />
      </Suspense>
    </div>
  )
}