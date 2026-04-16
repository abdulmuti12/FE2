'use client'

import { Suspense, useCallback, useEffect, useRef, useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { useSearchParams } from 'next/navigation'
import { Header } from '@/components/header'
import { Footer } from '@/components/footer'
import { ClipShare } from '@/components/clip/clip-share'
import { Eye, Heart, Play, Share2, Star, Plus, ThumbsUp, User } from 'lucide-react'

interface RelatedAward {
  id: string
  name: string
  image_url?: string | null
  image_landscape_url?: string | null
  video_url?: string | null
  likes?: string | number
  views?: string | number
  description?: string
}

interface AwardDetailData {
  id: string
  name: string
  dates?: string
  description?: string
  type?: string
  run_time_format?: string
  likes?: string | number
  views?: string | number
  play?: string | number
  my_favorit?: string
  image_url?: string
  image_landscape_url?: string
  video_url?: string
  relate?: RelatedAward[]
}

interface AwardCommentItem {
  id: string
  comment: string
  name: string
  time_ago: string
  avatar_url?: string
}

const convertToSecureUrl = (url: string | null | undefined): string => {
  if (!url) return ''
  return url.replace('http://', 'https://')
}

function AwardsDetailContent() {
  const searchParams = useSearchParams()
  const awardId = searchParams.get('id')

  const [awardData, setAwardData] = useState<AwardDetailData | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const relatedScrollerRef = useRef<HTMLDivElement | null>(null)
  const [relatedIndex, setRelatedIndex] = useState(0)
  const [showAllMobileComments, setShowAllMobileComments] = useState(false)
  const [comments, setComments] = useState<AwardCommentItem[]>([])
  const [loadingComments, setLoadingComments] = useState(true)
  const [newComment, setNewComment] = useState('')
  const [isSubmittingComment, setIsSubmittingComment] = useState(false)
  const [rating, setRating] = useState(0)
  const [isSubmittingRating, setIsSubmittingRating] = useState(false)
  const [showShare, setShowShare] = useState(false)
  const [isSubmittingVote, setIsSubmittingVote] = useState(false)
  const [isSubmittingLove, setIsSubmittingLove] = useState(false)
  const [isLoved, setIsLoved] = useState(false)
  const [showShareToast, setShowShareToast] = useState(false)
  const [shareToastMessage, setShareToastMessage] = useState('Success share')
  const [shareToastType, setShareToastType] = useState<'success' | 'error'>('success')
  const shareToastTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  useEffect(() => {
    const fetchAwardDetail = async () => {
      if (!awardId) {
        setError('ID award tidak ditemukan di URL')
        setIsLoading(false)
        return
      }

      try {
        setIsLoading(true)
        const token = localStorage.getItem('user_token') || ''

        if (!token) {
          setError('Silakan login terlebih dahulu')
          return
        }

        const url = new URL('/api/awards/detail', window.location.origin)
        url.searchParams.set('id', awardId)

        const response = await fetch(url.toString(), {
          method: 'GET',
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        })

        const raw = await response.text()
        let result: any = null

        try {
          result = raw ? JSON.parse(raw) : null
        } catch {
          result = null
        }

        if (response.ok && result?.status === true && result?.list) {
          setAwardData(result.list)
        } else {
          setError(result?.message || raw || 'Gagal mengambil detail award')
        }
      } catch (err) {
        console.error('Error fetching award detail:', err)
        setError('Terjadi kesalahan saat menghubungi server')
      } finally {
        setIsLoading(false)
      }
    }

    fetchAwardDetail()
  }, [awardId])

  const fetchComments = useCallback(async () => {
    if (!awardId) return

    try {
      setLoadingComments(true)
      const token = localStorage.getItem('user_token') || ''

      if (!token) {
        setComments([])
        return
      }

      const url = new URL('/api/awards/comment', window.location.origin)
      url.searchParams.set('id', awardId)

      const response = await fetch(url.toString(), {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      })

      const raw = await response.text()
      let result: any = null
      try {
        result = raw ? JSON.parse(raw) : null
      } catch {
        result = null
      }

      if (response.ok && result?.status === true && Array.isArray(result?.list)) {
        setComments(result.list as AwardCommentItem[])
      } else {
        setComments([])
      }
    } catch (error) {
      console.error('Error fetching award comments:', error)
      setComments([])
    } finally {
      setLoadingComments(false)
    }
  }, [awardId])

  useEffect(() => {
    fetchComments()
  }, [fetchComments])

  useEffect(() => {
    setRelatedIndex(0)
    setShowAllMobileComments(false)
  }, [awardId])

  useEffect(() => {
    setIsLoved(awardData?.my_favorit === '1')
  }, [awardData])

  useEffect(() => {
    return () => {
      if (shareToastTimerRef.current) {
        clearTimeout(shareToastTimerRef.current)
      }
    }
  }, [])

  const handlePlatformShare = async (platform: string) => {
    const showToast = (message: string, type: 'success' | 'error' = 'success') => {
      setShareToastMessage(message)
      setShareToastType(type)
      setShowShareToast(true)

      if (shareToastTimerRef.current) {
        clearTimeout(shareToastTimerRef.current)
      }

      shareToastTimerRef.current = setTimeout(() => {
        setShowShareToast(false)
      }, 2500)
    }

    const url = window.location.href
    const title = awardData?.name || 'Award'
    const text = `Check out this award: ${title}`

    switch (platform) {
      case 'copy':
        await navigator.clipboard.writeText(url)
        showToast('Link copied to clipboard!', 'success')
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
      default:
        break
    }

    try {
      const token = localStorage.getItem('user_token') || ''
      if (token && awardId) {
        const response = await fetch('/api/awards/share', {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            id: awardId,
          }),
        })

        const raw = await response.text()
        let result: any = null
        try {
          result = raw ? JSON.parse(raw) : null
        } catch {
          result = null
        }

        if (response.ok && result?.status === true) {
          showToast('Success share', 'success')
        } else {
          showToast(result?.message || raw || 'Gagal share', 'error')
        }
      }
    } catch (error) {
      console.error('Error submitting award share:', error)
      showToast('Terjadi kesalahan saat share', 'error')
    }

    setShowShare(false)
  }

  const scrollRelatedByAmount = (dir: 'left' | 'right') => {
    const el = relatedScrollerRef.current
    if (!el) return
    const totalItems = awardData?.relate?.length || 0
    if (totalItems === 0) return

    const nextIndex =
      dir === 'right'
        ? Math.min(relatedIndex + 1, totalItems - 1)
        : Math.max(relatedIndex - 1, 0)

    const target = el.children[nextIndex] as HTMLElement | undefined
    if (target) {
      target.scrollIntoView({ behavior: 'smooth', inline: 'start', block: 'nearest' })
      setRelatedIndex(nextIndex)
    }
  }

  const handleSubmitComment = async () => {
    if (!awardId || !newComment.trim()) return

    try {
      setIsSubmittingComment(true)
      const token = localStorage.getItem('user_token') || ''

      if (!token) {
        alert('Silakan login terlebih dahulu untuk memberikan komentar')
        return
      }

      const response = await fetch('/api/awards/comment', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          id: awardId,
          comment: newComment.trim(),
        }),
      })

      const raw = await response.text()
      let result: any = null
      try {
        result = raw ? JSON.parse(raw) : null
      } catch {
        result = null
      }

      if (response.ok && result?.status === true) {
        setNewComment('')
        await fetchComments()
      } else {
        alert(result?.message || raw || 'Gagal mengirim komentar')
      }
    } catch (error) {
      console.error('Error posting award comment:', error)
      alert('Terjadi kesalahan saat mengirim komentar')
    } finally {
      setIsSubmittingComment(false)
    }
  }

  const handleRateAward = async (stars: number) => {
    if (!awardId) return

    const normalizedStars = Number(stars)
    if (!Number.isFinite(normalizedStars) || normalizedStars < 1 || normalizedStars > 5) {
      return
    }

    try {
      setIsSubmittingRating(true)
      const token = localStorage.getItem('user_token') || ''

      if (!token) {
        alert('Silakan login terlebih dahulu untuk memberikan rating')
        return
      }

      const response = await fetch('/api/awards/rating', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          id: awardId,
          stars: normalizedStars,
        }),
      })

      const raw = await response.text()
      let result: any = null
      try {
        result = raw ? JSON.parse(raw) : null
      } catch {
        result = null
      }

      if (response.ok && result?.status === true) {
        setRating(normalizedStars)
      } else {
        alert(result?.message || raw || 'Gagal mengirim rating')
      }
    } catch (error) {
      console.error('Error posting award rating:', error)
      alert('Terjadi kesalahan saat mengirim rating')
    } finally {
      setIsSubmittingRating(false)
    }
  }

  const handleLoveAward = async () => {
    if (!awardId) return

    try {
      setIsSubmittingLove(true)
      const token = localStorage.getItem('user_token') || ''

      if (!token) {
        alert('Silakan login terlebih dahulu untuk favorit')
        return
      }

      const response = await fetch('/api/awards/love', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          id: awardId,
        }),
      })

      const raw = await response.text()
      let result: any = null
      try {
        result = raw ? JSON.parse(raw) : null
      } catch {
        result = null
      }

      if (response.ok && result?.status === true) {
        setIsLoved((prev) => !prev)
      } else {
        alert(result?.message || raw || 'Gagal memperbarui favorit')
      }
    } catch (error) {
      console.error('Error submitting award favorit:', error)
      alert('Terjadi kesalahan saat memperbarui favorit')
    } finally {
      setIsSubmittingLove(false)
    }
  }

  const handleVoteAward = async () => {
    if (!awardId) return

    try {
      setIsSubmittingVote(true)
      const token = localStorage.getItem('user_token') || ''

      if (!token) {
        alert('Silakan login terlebih dahulu untuk melakukan vote')
        return
      }

      const response = await fetch('/api/awards/vote', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          id: awardId,
        }),
      })

      const raw = await response.text()
      let result: any = null
      try {
        result = raw ? JSON.parse(raw) : null
      } catch {
        result = null
      }

      if (!(response.ok && result?.status === true)) {
        alert(result?.message || raw || 'Gagal mengirim vote')
      }
    } catch (error) {
      console.error('Error submitting award vote:', error)
      alert('Terjadi kesalahan saat mengirim vote')
    } finally {
      setIsSubmittingVote(false)
    }
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#050B14] flex flex-col items-center justify-center text-white font-sans">
        <div className="w-10 h-10 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mb-4"></div>
        <p>Memuat Award...</p>
      </div>
    )
  }

  if (error || !awardData) {
    return (
      <div className="min-h-screen bg-[#050B14] flex flex-col items-center justify-center text-white font-sans gap-4">
        <p className="text-xl font-bold">Oops!</p>
        <p className="text-gray-400">{error || 'Data award tidak ditemukan.'}</p>
        <Link href="/dashboard/awards" className="px-6 py-2 bg-blue-600 hover:bg-blue-700 rounded-full transition-colors">
          Kembali ke Awards
        </Link>
      </div>
    )
  }

  return (
    <>
      <Header />

      <main className="max-w-[1920px] mx-auto px-4 sm:px-6 lg:px-10 xl:px-14 py-6 md:py-10">
        
        {/* ========================================================= */}
        {/* TOP SECTION: Video Player (Left) & Comments (Right)       */}
        {/* ========================================================= */}
        <div className="flex flex-col lg:flex-row gap-6 lg:gap-8">
          
          {/* LEFT: Video Player */}
          <div className="w-full lg:w-2/3 xl:w-[70%] relative bg-black rounded-xl overflow-hidden aspect-[16/9] border border-white/10 shadow-2xl">
            {awardData.video_url ? (
              <video
                key={awardData.video_url}
                controls
                controlsList="nodownload"
                className="w-full h-full object-contain"
                poster={convertToSecureUrl(awardData.image_landscape_url || awardData.image_url)}
              >
                <source src={convertToSecureUrl(awardData.video_url)} type="video/mp4" />
                Browser Anda tidak mendukung pemutar video ini.
              </video>
            ) : (
              <div className="w-full h-full flex flex-col items-center justify-center bg-[#111] text-white/50 relative">
                 <Image
                    src={convertToSecureUrl(awardData.image_landscape_url || awardData.image_url) || '/placeholder.jpg'}
                    alt={awardData.name}
                    fill
                    className="object-cover opacity-50"
                  />
                  <Play className="w-16 h-16 text-white/80 z-10 absolute" />
              </div>
            )}
          </div>

          {/* RIGHT: Comment & Review Section */}
          <div className="hidden lg:flex w-full lg:w-1/3 xl:w-[30%] bg-[#12161E] border border-white/5 rounded-xl p-5 md:p-6 flex-col">
            <h2 className="text-lg font-bold mb-4">Comment</h2>
            
            {/* Comment List */}
            <div className="flex-1 overflow-y-auto max-h-[250px] md:max-h-[350px] pr-2 space-y-4 [&::-webkit-scrollbar]:w-1.5 [&::-webkit-scrollbar-thumb]:bg-white/20 [&::-webkit-scrollbar-track]:bg-transparent">
              {loadingComments ? (
                <p className="text-sm text-white/50">Loading comments...</p>
              ) : comments.length === 0 ? (
                <p className="text-sm text-white/50">Belum ada komentar.</p>
              ) : (
                comments.map((comment) => (
                  <div key={comment.id} className="flex gap-3">
                    <div className="w-8 h-8 rounded-full bg-gray-500 shrink-0 flex items-center justify-center overflow-hidden">
                      {comment.avatar_url ? (
                        <Image
                          src={convertToSecureUrl(comment.avatar_url)}
                          alt={comment.name}
                          width={32}
                          height={32}
                          className="w-8 h-8 object-cover"
                        />
                      ) : (
                        <User className="w-5 h-5 text-white/80" />
                      )}
                    </div>
                    <div className="flex-1">
                      <div className="flex justify-between items-center mb-1">
                        <span className="text-sm font-semibold">{comment.name}</span>
                        <span className="text-xs text-white/40">{comment.time_ago}</span>
                      </div>
                      <p className="text-xs text-white/60 leading-relaxed line-clamp-2">
                        {comment.comment}
                      </p>
                    </div>
                  </div>
                ))
              )}
            </div>

            {/* Rating Section */}
            <div className="mt-6 border-t border-white/10 pt-4">
              <p className="text-sm font-semibold mb-2">Rating This Film</p>
              <div className="flex gap-1 mb-6">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    onClick={() => handleRateAward(star)}
                    disabled={isSubmittingRating}
                    className={`transition-colors ${isSubmittingRating ? 'opacity-60 cursor-not-allowed' : ''}`}
                    aria-label={`Rate ${star} stars`}
                  >
                    <Star
                      className={`w-6 h-6 fill-current ${
                        star <= rating ? 'text-yellow-500' : 'text-white/10 hover:text-yellow-500'
                      }`}
                    />
                  </button>
                ))}
              </div>

              {/* Review Input */}
              <p className="text-sm font-semibold mb-2">Your Review</p>
              <input 
                type="text" 
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                placeholder="Tulis komentar Anda..."
                className="w-full bg-[#1A1F29] border border-white/10 rounded-md px-4 py-3 text-sm text-white placeholder-white/30 focus:outline-none focus:border-white/30 mb-4"
              />
              <button
                onClick={handleSubmitComment}
                disabled={isSubmittingComment || !newComment.trim()}
                className="w-full bg-white text-black font-semibold rounded-full py-3 text-sm hover:bg-gray-200 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSubmittingComment ? 'Submitting...' : 'Submit Review'}
              </button>
            </div>
          </div>
        </div>

        {/* ========================================================= */}
        {/* MIDDLE SECTION: Movie Details & Actions                   */}
        {/* ========================================================= */}
        <div className="mt-8 mb-12">
          <div className="flex flex-col md:flex-row justify-between items-start gap-6">
            
            {/* Title & Metadata */}
            <div>
              <h1 className="text-2xl md:text-4xl font-bold mb-3">{awardData.name}</h1>
              <div className="flex flex-wrap items-center gap-3 text-sm">
                <span className="bg-white text-black font-semibold px-2 py-0.5 rounded text-xs">
                  {awardData.type || 'Genre'}
                </span>
                
                {/* Stars */}
                <div className="flex items-center gap-1 text-yellow-500">
                  <Star className="w-4 h-4 fill-current" />
                  <Star className="w-4 h-4 fill-current" />
                  <Star className="w-4 h-4 fill-current" />
                  <Star className="w-4 h-4 text-white/20 fill-current" />
                  <Star className="w-4 h-4 text-white/20 fill-current" />
                </div>
                <span className="text-white">8</span>
                <span className="text-white/60 mx-1 flex items-center"><User className="w-4 h-4 mr-1"/></span>

                <span className="text-white/60">
                  {awardData.dates ? new Date(awardData.dates).getFullYear() : '2025'}
                </span>
                <span className="text-white/60">•</span>
                <span className="text-white/60">{awardData.run_time_format || '1h 0m'}</span>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-wrap gap-3">
              <button
                onClick={handleLoveAward}
                disabled={isSubmittingLove}
                className={`flex items-center gap-2 px-5 py-2 rounded-full border transition-colors text-sm disabled:opacity-50 disabled:cursor-not-allowed ${
                  isLoved
                    ? 'border-red-500/50 text-red-400 bg-red-500/10 hover:bg-red-500/15'
                    : 'border-white/20 hover:bg-white/10'
                }`}
              >
                <Heart className={`w-4 h-4 ${isLoved ? 'fill-current' : ''}`} /> Like
              </button>
              <button className="flex items-center gap-2 px-5 py-2 rounded-full border border-white/20 hover:bg-white/10 transition-colors text-sm">
                <Plus className="w-4 h-4" /> Add to Watch
              </button>
              <button
                onClick={handleVoteAward}
                disabled={isSubmittingVote}
                className="flex items-center gap-2 px-5 py-2 rounded-full border border-white/20 hover:bg-white/10 transition-colors text-sm disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <ThumbsUp className="w-4 h-4" /> Vote
              </button>
              <button onClick={() => setShowShare(true)} className="flex items-center justify-center w-10 h-10 rounded-full border border-white/20 hover:bg-white/10 transition-colors">
                <Share2 className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Synopsis / Description */}
          <div className="mt-6 text-white/60 text-sm leading-relaxed max-w-5xl">
            <p dangerouslySetInnerHTML={{ __html: awardData.description || '[Brief Synopsis] Lorem ipsum dolor sit amet consectetur. Volutpat turpis in aliquam pellentesque quis vulputate et imperdiet. Faucibus quam eleifend egestas ac amet sociis velit. Et cras tristique montes nec velit.' }} />
          </div>
        </div>

        {/* ========================================================= */}
        {/* MOBILE/TABLET: Comment Section (below movie info/actions) */}
        {/* ========================================================= */}
        <div className="mb-12 lg:hidden">
          <div className="w-full bg-[#12161E] border border-white/5 rounded-xl p-5 md:p-6 flex flex-col">
            <h2 className="text-lg font-bold mb-4">Comment</h2>

            <div className="space-y-4">
              {loadingComments ? (
                <p className="text-sm text-white/50">Loading comments...</p>
              ) : comments.length === 0 ? (
                <p className="text-sm text-white/50">Belum ada komentar.</p>
              ) : (
                (showAllMobileComments ? comments : comments.slice(-1)).map((comment) => (
                  <div key={comment.id} className="flex gap-3">
                    <div className="w-8 h-8 rounded-full bg-gray-500 shrink-0 flex items-center justify-center overflow-hidden">
                      {comment.avatar_url ? (
                        <Image
                          src={convertToSecureUrl(comment.avatar_url)}
                          alt={comment.name}
                          width={32}
                          height={32}
                          className="w-8 h-8 object-cover"
                        />
                      ) : (
                        <User className="w-5 h-5 text-white/80" />
                      )}
                    </div>
                    <div className="flex-1">
                      <div className="flex justify-between items-center mb-1">
                        <span className="text-sm font-semibold">{comment.name}</span>
                        <span className="text-xs text-white/40">{comment.time_ago}</span>
                      </div>
                      <p className="text-xs text-white/60 leading-relaxed line-clamp-2">
                        {comment.comment}
                      </p>
                    </div>
                  </div>
                ))
              )}

              {comments.length > 1 && (
                <button
                  onClick={() => setShowAllMobileComments((prev) => !prev)}
                  className="text-xs text-[#D4A84B] hover:text-[#E2C57A] transition-colors"
                >
                  {showAllMobileComments ? 'Tampilkan 1 komentar terakhir' : 'Lihat semua komentar'}
                </button>
              )}
            </div>

            <div className="mt-6 border-t border-white/10 pt-4">
              <p className="text-sm font-semibold mb-2">Rating This Film</p>
              <div className="flex gap-1 mb-6">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    onClick={() => handleRateAward(star)}
                    disabled={isSubmittingRating}
                    className={`transition-colors ${isSubmittingRating ? 'opacity-60 cursor-not-allowed' : ''}`}
                    aria-label={`Rate ${star} stars`}
                  >
                    <Star
                      className={`w-6 h-6 fill-current ${
                        star <= rating ? 'text-yellow-500' : 'text-white/10 hover:text-yellow-500'
                      }`}
                    />
                  </button>
                ))}
              </div>

              <p className="text-sm font-semibold mb-2">Your Review</p>
              <input
                type="text"
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                placeholder="Tulis komentar Anda..."
                className="w-full bg-[#1A1F29] border border-white/10 rounded-md px-4 py-3 text-sm text-white placeholder-white/30 focus:outline-none focus:border-white/30 mb-4"
              />
              <button
                onClick={handleSubmitComment}
                disabled={isSubmittingComment || !newComment.trim()}
                className="w-full bg-white text-black font-semibold rounded-full py-3 text-sm hover:bg-gray-200 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSubmittingComment ? 'Submitting...' : 'Submit Review'}
              </button>
            </div>
          </div>
        </div>

        {/* ========================================================= */}
        {/* BOTTOM SECTION: Other Awards Carousel                     */}
        {/* ========================================================= */}
        <div className="mb-20">
          <div className="flex items-center justify-between mb-6">
             <h2 className="text-xl md:text-2xl font-bold">Other Awards</h2>
             <div className="flex gap-1">
                <div className="w-8 border-b-2 border-white"></div>
                <div className="w-8 border-b-2 border-white/30"></div>
                <div className="w-8 border-b-2 border-white/30"></div>
             </div>
          </div>
          
          {!awardData.relate || awardData.relate.length === 0 ? (
            <p className="text-white/60 text-sm">Belum ada related awards.</p>
          ) : (
            <div className="relative group">
               <div
                 ref={relatedScrollerRef}
                 className="flex gap-4 md:gap-5 overflow-x-auto pb-4 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none] snap-x snap-mandatory"
               >
                 {awardData.relate.map((related) => (
                   <Link
                     key={related.id}
                     href={`/dashboard/awards/detail?id=${related.id}`}
                     className="snap-start shrink-0 w-[280px] md:w-[320px] aspect-[16/9] relative rounded-xl overflow-hidden group/card block cursor-pointer bg-gray-800"
                   >
                     {/* Image */}
                     <Image
                       src={convertToSecureUrl(related.image_landscape_url || related.image_url) || '/placeholder.jpg'}
                       alt={related.name}
                       fill
                       className="object-cover transition-transform duration-300 group-hover/card:scale-105"
                     />
                     
                     {/* Dark Gradient Overlay */}
                     <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent"></div>
                     
                     {/* Play Icon Center */}
                     <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover/card:opacity-100 transition-opacity">
                       <div className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center">
                          <Play className="text-white w-6 h-6 ml-1" />
                       </div>
                     </div>

                     {/* Text Content at Bottom */}
                     <div className="absolute bottom-0 left-0 w-full p-4">
                       <h3 className="font-bold text-base text-white mb-1 drop-shadow-md">{related.name}</h3>
                       <p className="text-xs text-white/70 line-clamp-1 drop-shadow-md">
                         [Brief Synopsis] {related.description || 'Watch groundbreaking films...'}
                       </p>
                     </div>
                   </Link>
                 ))}
               </div>
               
               <button
                 onClick={() => scrollRelatedByAmount('left')}
                 disabled={relatedIndex === 0}
                 className="absolute -left-3 md:-left-4 top-1/2 -translate-y-1/2 bg-white/95 text-black w-8 h-8 md:w-10 md:h-10 flex items-center justify-center rounded-lg shadow-xl z-10 hover:bg-white disabled:opacity-50 disabled:cursor-not-allowed"
                 aria-label="Previous related awards"
               >
                  <span className="font-bold text-lg md:text-xl">‹</span>
               </button>
               <button
                 onClick={() => scrollRelatedByAmount('right')}
                 disabled={relatedIndex >= (awardData.relate?.length || 1) - 1}
                 className="absolute -right-3 md:-right-4 top-1/2 -translate-y-1/2 bg-white/95 text-black w-8 h-8 md:w-10 md:h-10 flex items-center justify-center rounded-lg shadow-xl z-10 hover:bg-white disabled:opacity-50 disabled:cursor-not-allowed"
                 aria-label="Next related awards"
               >
                  <span className="font-bold text-lg md:text-xl">›</span>
               </button>
            </div>
          )}
        </div>

      </main>

      <Footer />

      <div
        className={`fixed left-1/2 top-6 z-[120] -translate-x-1/2 rounded-xl border backdrop-blur-md px-4 py-3 text-sm shadow-[0_10px_30px_rgba(0,0,0,0.25)] transition-all duration-300 ${
          shareToastType === 'success'
            ? 'border-emerald-300/30 bg-emerald-500/15 text-emerald-100'
            : 'border-rose-300/30 bg-rose-500/15 text-rose-100'
        } ${
          showShareToast
            ? 'opacity-100 translate-y-0 scale-100 animate-pulse'
            : 'opacity-0 -translate-y-2 scale-95 pointer-events-none'
        }`}
        role="status"
        aria-live="polite"
      >
        {shareToastMessage}
      </div>

      <ClipShare
        showShare={showShare}
        clipId={awardId || ''}
        clipName={awardData?.name || 'Award'}
        onClose={() => setShowShare(false)}
        onPlatformShare={handlePlatformShare}
      />
    </>
  )
}

export default function AwardsDetailPage() {
  return (
    <div className="min-h-screen bg-[#050B14] text-white font-sans overflow-x-hidden">
      <Suspense
        fallback={
          <div className="min-h-screen flex items-center justify-center">
            <div className="w-10 h-10 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
          </div>
        }
      >
        <AwardsDetailContent />
      </Suspense>
    </div>
  )
}
