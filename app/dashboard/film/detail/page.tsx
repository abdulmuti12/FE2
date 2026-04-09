'use client'

import React, { useState, useEffect, Suspense } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { useSearchParams } from 'next/navigation'
import { Header } from '@/components/header'
import { Footer } from '@/components/footer'
import { ClipShare } from '@/components/clip/clip-share'
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
  favorit?: string
  my_favorit?: string
  watch_me?: string
  image_url: string
  video_url: string
  relate: RelatedFilm[]
}

interface CommentItem {
  id: string
  id_customer: string
  id_series: string
  comment: string
  dates: string
  name: string
  avatar: string
  time_ago: string
  heart: string
  avatar_url: string
}

// ============================================================================
// Constants - API
// ============================================================================

const API = {
  ENDPOINTS: {
    FILM_DETAIL: '/api/film/detail',
    FILM_COMMENT: '/api/film/comment',
    FILM_RATING: '/api/film/rating',
  },
  STORAGE_KEY: 'user_token',
} as const

// ============================================================================
// Constants - Data
// ============================================================================

// Removed MOCK_COMMENTS - will use real API data

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

const normalizeRating = (value: string | number | null | undefined): number => {
  const parsed = Number(value)

  if (!Number.isFinite(parsed) || parsed <= 0) return 0
  return Math.min(5, Math.floor(parsed))
}

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
  const [isFavorite, setIsFavorite] = useState(false)
  const [isInWatchlist, setIsInWatchlist] = useState(false)
  const [showShare, setShowShare] = useState(false)
  const [rating, setRating] = useState(0)
  const [reviewText, setReviewText] = useState('')
  const [isSubmittingRating, setIsSubmittingRating] = useState(false)

  // Comment State
  const [comments, setComments] = useState<CommentItem[]>([])
  const [loadingComments, setLoadingComments] = useState(true)
  const [isSubmittingComment, setIsSubmittingComment] = useState(false)

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
          setIsFavorite(result.data.my_favorit === '1')
          setIsInWatchlist(result.data.watch_me === '1')
          setRating(normalizeRating(result.data.rates))
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

  // Effects - Fetch Comments
  const fetchComments = async () => {
    if (!filmId) return
    try {
      setLoadingComments(true)
      const token = localStorage.getItem(API.STORAGE_KEY) || ''
      const response = await fetch(`${API.ENDPOINTS.FILM_COMMENT}?id=${filmId}`, {
        method: 'GET',
        headers: getAuthHeaders(token),
      })
      const json = await response.json()
      if (json.status === true && json.list) {
        setComments(json.list)
      } else {
        setComments([])
      }
    } catch (error) {
      console.error('Error fetching comments:', error)
      setComments([])
    } finally {
      setLoadingComments(false)
    }
  }

  useEffect(() => {
    if (filmId) {
      fetchComments()
    }
  }, [filmId])

  // Comment Submission Handler
  const handleSubmitComment = async () => {
    if (!reviewText.trim() || !filmId) {
      alert('Komentar tidak boleh kosong')
      return
    }

    try {
      setIsSubmittingComment(true)
      const token = localStorage.getItem(API.STORAGE_KEY)
      if (!token) {
        alert('Silakan login terlebih dahulu untuk memberikan komentar')
        return
      }

      const response = await fetch(API.ENDPOINTS.FILM_COMMENT, {
        method: 'POST',
        headers: getAuthHeaders(token),
        body: JSON.stringify({
          id: filmId,
          comment: reviewText.trim()
        })
      })

      const json = await response.json()

      if (response.ok && json.status === true) {
        setReviewText('') // Kosongkan input
        await fetchComments() // Refresh daftar komentar
      } else {
        alert(json.message || 'Gagal mengirim komentar')
      }
    } catch (error) {
      console.error('Error submitting comment:', error)
      alert('Terjadi kesalahan saat mengirim komentar')
    } finally {
      setIsSubmittingComment(false)
    }
  }

  const handlePlatformShare = async (platform: string) => {
    const url = window.location.href
    const title = filmData?.name || 'Film'
    const text = `Check out this film: ${title}`

    switch (platform) {
      case 'copy':
        await navigator.clipboard.writeText(url)
        alert('Link copied to clipboard!')
        break
      case 'whatsapp':
        window.open(`https://wa.me/?text=${encodeURIComponent(text + ' ' + url)}`, '_blank')
        break
      case 'facebook':
        window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`, '_blank')
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

  const handleLoveFilm = async () => {
    try {
      const token = localStorage.getItem(API.STORAGE_KEY)
      if (!token || !filmId) {
        alert('Silakan login terlebih dahulu untuk menambahkan favorit')
        return
      }

      const response = await fetch('/api/film/love', {
        method: 'POST',
        headers: getAuthHeaders(token),
        body: JSON.stringify({
          id: filmId,
        }),
      })

      const data = await response.json()

      if (data.status === true) {
        setIsFavorite((prev) => !prev)
      } else {
        alert(data.message || 'Gagal memperbarui status favorit')
      }
    } catch (error) {
      console.error('Error favoriting film:', error)
      alert('Gagal memperbarui status favorit')
    }
  }

  const handleAddToWatchlist = async () => {
    try {
      const token = localStorage.getItem(API.STORAGE_KEY)
      if (!token || !filmId) {
        // alert('Silakan login terlebih dahulu untuk menambahkan watchlist')
        return
      }

      const response = await fetch('/api/film/watchlist', {
        method: 'POST',
        headers: getAuthHeaders(token),
        body: JSON.stringify({
          id: filmId,
        }),
      })

      const data = await response.json()

      if (data.status === true) {
        setIsInWatchlist((prev) => !prev)
      } else {
        alert(data.message || 'Gagal memperbarui watchlist')
      }
    } catch (error) {
      console.error('Error updating watchlist:', error)
      alert('Gagal memperbarui watchlist')
    }
  }

  const handleRateFilm = async (stars: number) => {
    if (!filmId) {
      alert('ID Film tidak ditemukan di URL')
      return
    }

    try {
      const token = localStorage.getItem(API.STORAGE_KEY)
      if (!token) {
        alert('Silakan login terlebih dahulu untuk memberikan rating')
        return
      }

      setIsSubmittingRating(true)

      const response = await fetch(API.ENDPOINTS.FILM_RATING, {
        method: 'POST',
        headers: getAuthHeaders(token),
        body: JSON.stringify({
          id: filmId,
          stars,
        }),
      })

      const data = await response.json()

      if (response.ok && data.status === true) {
        setRating(stars)
      } else {
        alert(data.message || 'Gagal mengirim rating')
      }
    } catch (error) {
      console.error('Error submitting rating:', error)
      alert('Terjadi kesalahan saat mengirim rating')
    } finally {
      setIsSubmittingRating(false)
    }
  }

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
              <button
                onClick={handleLoveFilm}
                className={`h-9 w-9 md:h-10 md:w-10 rounded-full border transition-colors flex items-center justify-center ${
                  isFavorite
                    ? 'border-red-500/50 text-red-500 bg-red-500/10 hover:bg-red-500/15'
                    : 'border-white/15 text-white bg-white/5 hover:bg-white/10'
                }`}
                title="Favorite"
                aria-label="Add to favorites"
              >
                <Heart className={`w-4 h-4 md:w-5 md:h-5 ${isFavorite ? 'fill-current' : ''}`} />
              </button>
              <button
                onClick={handleAddToWatchlist}
                className={`h-9 w-9 md:h-10 md:w-10 rounded-full border transition-colors flex items-center justify-center ${
                  isInWatchlist
                    ? 'border-red-500/50 text-red-500 bg-red-500/10 hover:bg-red-500/15'
                    : 'border-white/15 text-white bg-white/5 hover:bg-white/10'
                }`}
                title="Add to Watchlist"
                aria-label="Add to watchlist"
              >
                <Plus className={`w-4 h-4 md:w-5 md:h-5 ${isInWatchlist ? 'fill-current' : ''}`} />
              </button>
              <button
                onClick={() => setShowShare(true)}
                className="h-9 w-9 md:h-10 md:w-10 rounded-full border border-white/15 bg-white/5 hover:bg-white/10 transition-colors flex items-center justify-center"
                title="Share"
              >
                <Share2 className="w-4 h-4 md:w-5 md:h-5" />
              </button>
            </div>
          </div>

          {/* Description */}
          <div 
            className="mt-3 md:mt-5 text-white/70 text-xs sm:text-sm leading-relaxed md:max-w-[70%] overflow-hidden [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]"
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
            {loadingComments ? (
              <div className="flex items-center justify-center py-8">
                <div className="w-6 h-6 border-2 border-white/20 border-t-white/60 rounded-full animate-spin"></div>
                <span className="ml-3 text-white/60">Memuat komentar...</span>
              </div>
            ) : comments.length === 0 ? (
              <div className="text-center py-8">
                <p className="text-white/60">Belum ada komentar untuk film ini.</p>
                <p className="text-white/40 text-sm mt-1">Jadilah yang pertama memberikan komentar!</p>
              </div>
            ) : (
              comments.map((comment) => (
                <div key={comment.id} className="flex gap-3 sm:gap-4">
                  <div className="h-9 w-9 sm:h-10 sm:w-10 rounded-full overflow-hidden bg-white/10 border border-white/10 flex-shrink-0">
                    <Image
                      src={convertToSecureUrl(comment.avatar_url)}
                      alt={comment.name}
                      width={40}
                      height={40}
                      className="h-full w-full object-cover"
                    />
                  </div>

                  <div className="flex-1">
                    <div className="flex items-center justify-between gap-3">
                      <p className="text-xs sm:text-sm font-semibold">{comment.name}</p>
                      <p className="text-[10px] sm:text-xs text-white/40">{comment.time_ago}</p>
                    </div>
                    <p className="mt-2 text-xs sm:text-sm text-white/70 leading-relaxed">
                      {comment.comment}
                    </p>
                  </div>
                </div>
              ))
            )}
          </div>

          <div className="h-px bg-white/10" />

          {/* Review Form */}
          <div className="px-4 sm:px-6 py-5 sm:py-6">
            <label className="text-xs sm:text-sm font-semibold mb-3 block">Rating This Film</label>
            <div className="flex items-center gap-2 mb-6">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  onClick={() => handleRateFilm(star)}
                  disabled={isSubmittingRating}
                  className={`text-xl sm:text-2xl transition-colors ${
                    star <= rating ? 'text-yellow-400' : 'text-white/25'
                  } ${isSubmittingRating ? 'opacity-60 cursor-not-allowed' : ''}`}
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
                onClick={handleSubmitComment}
                disabled={isSubmittingComment || !reviewText.trim()}
                className="h-9 sm:h-10 px-5 sm:px-6 rounded-full bg-white text-black font-semibold text-xs sm:text-sm hover:bg-white/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
              >
                {isSubmittingComment ? (
                  <>
                    <div className="w-4 h-4 border-2 border-black/20 border-t-black rounded-full animate-spin"></div>
                    Mengirim...
                  </>
                ) : (
                  'Submit Review'
                )}
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

      <ClipShare
        showShare={showShare}
        clipId={filmId || ''}
        clipName={filmData?.name || 'Film'}
        onClose={() => setShowShare(false)}
        onPlatformShare={handlePlatformShare}
      />
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
