// app/dashboard/series/detail/SeriesDetailClient.tsx
'use client'

import React, { useState, useEffect, Suspense, useCallback, useRef } from 'react'
import { usePathname, useRouter, useSearchParams } from 'next/navigation'
import Image from 'next/image'
import Link from 'next/link' 
import { Header } from '@/components/header'
import { Footer } from '@/components/footer'
import { Heart, Share2, Play, Star, Plus, Volume2 } from 'lucide-react'
import { ClipShare } from '@/components/clip/clip-share'

interface GroupEpisode {
  id: string
  name: string
  description: string
  run_time: string
  years: string
  video: string
  image: string
  image_landscape: string
  comment: string
  cats: string
  rates: string | null
  favorit: string
  my_favorit: string
  watch_me: string
  image_url: string
  image_landscape_url: string
  video_url: string
  synopsis: string
  run_time_format: string
}

interface SeriesData {
  id: string
  name: string
  folder_groups: string
  description: string
  run_time: string
  years: string
  video: string
  image: string
  image_landscape: string
  comment: string
  cats: string
  rates: string | null
  favorit: string
  my_favorit: string
  watch_me: string
  groups: GroupEpisode[]
  recomen: GroupEpisode[] 
  image_url: string
  image_landscape_url: string
  video_url: string
  cover: string
  cover_url: string
  ipfs: string
  ipfs_url: string
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

const truncateText = (text: string | null | undefined, maxLength: number = 200) => {
  if (!text) return ""
  const plainText = text.replace(/<[^>]+>/g, '').replace(/\n/g, ' ').trim()
  if (plainText.length <= maxLength) return plainText
  return plainText.substring(0, maxLength).trim() + '...'
}

const normalizeRating = (value: string | number | null | undefined): number => {
  const parsed = Number(value)

  if (!Number.isFinite(parsed) || parsed <= 0) return 0
  return Math.min(5, Math.floor(parsed))
}

function SeriesDetailContent() {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const seriesId = searchParams.get('id_group') || searchParams.get('id')

  const [seriesData, setSeriesData] = useState<SeriesData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [isFavorite, setIsFavorite] = useState(false)
  const [isInWatchlist, setIsInWatchlist] = useState(false)
  const [showShare, setShowShare] = useState(false)
  
  const [comments, setComments] = useState<CommentItem[]>([])
  const [loadingComments, setLoadingComments] = useState(true)
  const [newComment, setNewComment] = useState('')
  const [isSubmittingComment, setIsSubmittingComment] = useState(false)
  const [rating, setRating] = useState(0)
  const [isSubmittingRating, setIsSubmittingRating] = useState(false)
  const [showRatingToast, setShowRatingToast] = useState(false)
  const [ratingToastMessage, setRatingToastMessage] = useState('Thank You for your rating')
  const [ratingToastType, setRatingToastType] = useState<'success' | 'error'>('success')
  const ratingToastTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const [showShareToast, setShowShareToast] = useState(false)
  const [shareToastMessage, setShareToastMessage] = useState('Link copied to clipboard!')
  const shareToastTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const playedSeriesIdsRef = useRef<Set<string>>(new Set())

  const [activeVideoId, setActiveVideoId] = useState<string | null>(null)
  const [activeVideo, setActiveVideo] = useState<string | null>(null)
  const [activeVideoPoster, setActiveVideoPoster] = useState<string | null>(null)
  const episodesScrollerRef = useRef<HTMLDivElement | null>(null)

  const fetchSeriesDetail = useCallback(async () => {
    if (!seriesId) return
    try {
      const token = localStorage.getItem('user_token')
      setLoading(true)

      const response = await fetch(`/api/series/series-detail?id_group=${seriesId}`, {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      })

      if (!response.ok) throw new Error('Failed to load series data')
      const json = await response.json()

      if (json.status === true && json.data) {
        setSeriesData(json.data)
        setIsFavorite(json.data.my_favorit === '1')
        
        if (json.data.groups && json.data.groups.length > 0) {
          const firstEpisode = json.data.groups[0]
          setActiveVideoId(firstEpisode.id)
          setActiveVideo(firstEpisode.video_url)
          setActiveVideoPoster(firstEpisode.image_landscape_url || firstEpisode.image_url)
          setIsInWatchlist(firstEpisode.watch_me === '1')
          setRating(normalizeRating(firstEpisode.rates))
        } else {
          setActiveVideoId(json.data.id)
          setActiveVideo(json.data.video_url)
          setActiveVideoPoster(json.data.image_landscape_url || json.data.image_url)
          setIsInWatchlist(json.data.watch_me === '1')
          setRating(normalizeRating(json.data.rates))
        }
      } else {
        setError(json.message || "Series not found")
      }
    } catch (err) {
      setError('Failed to connect to the server')
    } finally {
      setLoading(false)
    }
  }, [seriesId])

  const fetchComments = useCallback(async () => {
    if (!activeVideoId) return
    try {
      setLoadingComments(true)
      const token = localStorage.getItem('user_token') || ''
      const response = await fetch(`/api/series/comment?id=${activeVideoId}`, {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
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
  }, [activeVideoId])

  useEffect(() => {
    fetchSeriesDetail()
  }, [fetchSeriesDetail])

  useEffect(() => {
    fetchComments()
  }, [fetchComments])

  useEffect(() => {
    if (!activeVideoId) return

    const params = new URLSearchParams(searchParams.toString())
    const currentId = params.get('id')
    if (currentId === activeVideoId) return

    params.set('id', activeVideoId)
    if (!params.get('id_group') && seriesId) {
      params.set('id_group', seriesId)
    }

    router.replace(`${pathname}?${params.toString()}`, { scroll: false })
  }, [activeVideoId, pathname, router, searchParams, seriesId])

  useEffect(() => {
    return () => {
      if (ratingToastTimerRef.current) {
        clearTimeout(ratingToastTimerRef.current)
      }
      if (shareToastTimerRef.current) {
        clearTimeout(shareToastTimerRef.current)
      }
    }
  }, [])

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

  const handleSubmitComment = async () => {
    if (!newComment.trim() || !activeVideoId) {
      return;
    }

    try {
      setIsSubmittingComment(true);
      const token = localStorage.getItem('user_token');
      
      if (!token) {
        alert("Please login first to submit a review.");
        return;
      }

      const response = await fetch('/api/series/post-comment', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          id: activeVideoId,
          comment: newComment.trim()
        })
      });

      const json = await response.json();

      if (response.ok && json.status === true) {
        setNewComment('');
        await fetchComments();
      } else {
        throw new Error(json.message || "Failed to submit comment");
      }
    } catch (error: any) {
      // Error handling
    } finally {
      setIsSubmittingComment(false);
    }
  };

  const playEpisode = (episode: GroupEpisode) => {
    setActiveVideoId(episode.id)
    setActiveVideo(episode.video_url)
    setActiveVideoPoster(episode.image_landscape_url || episode.image_url)
    setIsInWatchlist(episode.watch_me === '1')
    setRating(normalizeRating(episode.rates))
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const handleSeriesPlay = async () => {
    if (!activeVideoId || playedSeriesIdsRef.current.has(activeVideoId)) return

    const token = localStorage.getItem('user_token')
    if (!token) return

    playedSeriesIdsRef.current.add(activeVideoId)

    try {
      await fetch('/api/series/play', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          id: activeVideoId,
        }),
      })
    } catch (error) {
      console.error('Error sending series play:', error)
    }
  }

  const handleVideoEnded = () => {
    if (!seriesData || !seriesData.groups) return;

    const currentIndex = seriesData.groups.findIndex((ep) => ep.id === activeVideoId);

    if (currentIndex !== -1 && currentIndex < seriesData.groups.length - 1) {
      const nextEpisode = seriesData.groups[currentIndex + 1];
      playEpisode(nextEpisode);
    }
  }

  const handlePlatformShare = async (platform: string) => {
    const shareUrl = new URL(window.location.href)
    shareUrl.searchParams.delete('id')
    const url = shareUrl.toString()
    const title = seriesData?.name || 'Series'
    const text = `Check out this series: ${title}`

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

    try {
      const token = localStorage.getItem('user_token')
      if (token && activeVideoId) {
        await fetch('/api/series/share', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            id: activeVideoId
          })
        })
      }
    } catch (error) {
      console.error('Error sending share data to API:', error)
    }

    setShowShare(false)
  }

  const handleLoveSeries = async () => {
    try {
      const token = localStorage.getItem('user_token')
      if (!token || !activeVideoId) {
        alert('Please login first to favorite series')
        return
      }

      const response = await fetch('/api/series/love', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          id: activeVideoId
        })
      })

      const data = await response.json()

      if (data.status === true) {
        setIsFavorite(!isFavorite)
      } else {
        alert(data.message || 'Failed to update favorite status')
      }
    } catch (error) {
      console.error('Error favoriting series:', error)
      alert('Failed to update favorite status')
    }
  }

  const handleAddToWatchlist = async () => {
    try {
      const token = localStorage.getItem('user_token')
      if (!token || !activeVideoId) {
        alert('Please login first to add to watchlist')
        return
      }

      const response = await fetch('/api/series/watchlist', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          id: activeVideoId
        })
      })

      const data = await response.json()

      if (data.status === true) {
        setIsInWatchlist(!isInWatchlist)
      } else {
        alert(data.message || 'Failed to update watchlist')
      }
    } catch (error) {
      console.error('Error updating watchlist:', error)
      alert('Failed to update watchlist')
    }
  }

  const handleRateSeries = async (stars: number) => {
    const showToast = (message: string, type: 'success' | 'error' = 'success') => {
      setRatingToastMessage(message)
      setRatingToastType(type)
      setShowRatingToast(true)

      if (ratingToastTimerRef.current) {
        clearTimeout(ratingToastTimerRef.current)
      }

      ratingToastTimerRef.current = setTimeout(() => {
        setShowRatingToast(false)
      }, 2500)
    }

    if (!activeVideoId) {
      showToast('ID episode tidak ditemukan', 'error')
      return
    }

    try {
      const normalizedStars = Number(stars)
      if (!Number.isFinite(normalizedStars) || normalizedStars < 1 || normalizedStars > 5) {
        showToast('Rating harus bernilai 1 sampai 5', 'error')
        return
      }

      const token = localStorage.getItem('user_token')
      if (!token) {
        showToast('Silakan login terlebih dahulu untuk memberikan rating', 'error')
        return
      }

      setIsSubmittingRating(true)

      const response = await fetch('/api/series/rating', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          id: activeVideoId,
          stars: normalizedStars,
        }),
      })

      const data = await response.json()

      if (response.ok && data.status === true) {
        setRating(normalizedStars)
        showToast('Thank You for your rating', 'success')
      } else {
        showToast(data.message || 'Gagal mengirim rating', 'error')
      }
    } catch (error) {
      console.error('Error submitting series rating:', error)
      showToast('Terjadi kesalahan saat mengirim rating', 'error')
    } finally {
      setIsSubmittingRating(false)
    }
  }

  const scrollEpisodesByAmount = (dir: 'left' | 'right') => {
    const el = episodesScrollerRef.current
    if (!el) return
    const amount = Math.round(el.clientWidth * 0.85)
    el.scrollBy({ left: dir === 'right' ? amount : -amount, behavior: 'smooth' })
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-[#050B14] flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-[#D4A84B]/20 border-t-[#D4A84B] rounded-full animate-spin" />
      </div>
    )
  }

  if (error || !seriesData) {
    return (
        <div className="min-h-screen bg-[#050B14]">
          <Header />
          <div className="flex flex-col items-center justify-center py-20">
            <p className="text-gray-400 text-lg mb-4">{error || 'Failed to load series'}</p>
            <Link href="/dashboard" className="text-[#D4A84B] hover:underline">Back to Home</Link>
          </div>
          <Footer />
        </div>
      )
  }

  return (
    <div className="min-h-screen bg-[#050B14] text-white font-sans">
      <Header />

      <div className="max-w-[1920px] mx-auto px-4 sm:px-6 lg:px-10 xl:px-14 py-6 md:py-10">
        <div className="flex flex-col lg:flex-row gap-6 lg:gap-8">
          
          <div className="w-full lg:w-2/3 xl:w-[70%] relative bg-black rounded-2xl overflow-hidden aspect-video border border-white/10 shadow-2xl">
            {activeVideo ? (
              <video
                key={activeVideo} 
                className="w-full h-full object-cover"
                poster={activeVideoPoster || '/placeholder-poster.png'}
                controls
                autoPlay
                onPlay={handleSeriesPlay}
                onEnded={handleVideoEnded} 
              >
                <source src={activeVideo} type="video/mp4" />
              </video>
            ) : (
              <div className="w-full h-full flex items-center justify-center">
                 <p>Select an episode to play</p>
              </div>
            )}
          </div>

     <div className="w-full lg:w-1/3 xl:w-[30%] bg-[#0a1628]/80 backdrop-blur-xl border border-white/5 rounded-2xl p-6 md:p-8 flex flex-col">
            <h1 className="text-2xl md:text-3xl font-bold mb-3">
              {seriesData.groups?.find(ep => ep.id === activeVideoId)?.name || seriesData.name}
            </h1>
            
            <div className="flex items-center gap-3 mb-4 text-xs md:text-sm">
              <span className="bg-white/10 px-2 py-0.5 rounded text-gray-300">{seriesData.cats}</span>
              <div className="flex text-[#D4A84B]">
                <Star className="w-3.5 h-3.5 fill-current" />
                <Star className="w-3.5 h-3.5 fill-current" />
                <Star className="w-3.5 h-3.5 fill-current" />
                <Star className="w-3.5 h-3.5 fill-current" />
                <Star className="w-3.5 h-3.5 text-gray-600" />
              </div>
            </div>
            
            <div 
              className="text-gray-300 text-sm leading-relaxed mb-6 flex-grow overflow-y-auto max-h-[300px] [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]"
              dangerouslySetInnerHTML={{ __html: seriesData.description || "" }}
            />

            <div className="flex items-center gap-3 pt-4 mt-auto">
              <button 
                onClick={() => setShowShare(true)}
                className="flex-1 flex items-center justify-center gap-2 h-11 md:h-12 rounded-full bg-[#02050A] border border-white/10 hover:bg-white/10 transition-colors text-white"
              >
                <Share2 className="w-4 h-4 md:w-5 md:h-5" />
                <span className="font-medium text-sm md:text-base">Share</span>
              </button>

              <button 
                onClick={handleLoveSeries}
                className={`shrink-0 w-11 h-11 md:w-12 md:h-12 flex items-center justify-center rounded-full bg-[#02050A] border transition-colors ${
                  isFavorite 
                    ? 'border-red-500/50 text-red-500 hover:bg-red-500/10' 
                    : 'border-white/10 text-white hover:bg-white/10'
                }`}
                aria-label="Add to favorites"
              >
                <Heart className={`w-4 h-4 md:w-5 md:h-5 ${isFavorite ? 'fill-current' : ''}`} />
              </button>

              <button 
                onClick={handleAddToWatchlist}
                className={`shrink-0 w-11 h-11 md:w-12 md:h-12 flex items-center justify-center rounded-full bg-[#02050A] border transition-colors ${
                  isInWatchlist 
                    ? 'border-red-500/50 text-red-500 hover:bg-red-500/10' 
                    : 'border-white/10 text-white hover:bg-white/10'
                }`}
                aria-label="Add to watchlist"
              >
                <Plus className={`w-4 h-4 md:w-5 md:h-5 ${isInWatchlist ? 'fill-current' : ''}`} />
              </button>

            </div>
          </div>
        </div>
      </div>

      <div className="max-w-[1920px] mx-auto px-4 sm:px-6 lg:px-10 xl:px-14 pb-20">
        <div className="mb-14">
          <h2 className="text-xl md:text-2xl font-bold mb-6">Episodes</h2>
          <div className="relative">
            <div
              ref={episodesScrollerRef}
              className="flex gap-4 md:gap-5 overflow-x-auto pb-2 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]"
            >
              {seriesData.groups?.map((ep) => (
                <div 
                  key={ep.id} 
                  className={`snap-start shrink-0 w-[240px] cursor-pointer p-2 rounded-xl border transition-all ${activeVideoId === ep.id ? 'border-[#D4A84B] bg-white/5' : 'border-transparent'}`}
                  onClick={() => playEpisode(ep)}
                >
                  <div className="relative aspect-video rounded-lg overflow-hidden mb-2">
                    <Image src={ep.image_landscape_url || ep.image_url || '/placeholder-poster.png'} alt={ep.name} fill className="object-cover" />
                    {activeVideoId === ep.id && <div className="absolute inset-0 bg-black/40 flex items-center justify-center"><Play className="text-[#D4A84B]" /></div>}
                  </div>
                  <h4 className="font-bold text-sm truncate">{ep.name}</h4>
                </div>
              ))}
            </div>

            <button
              onClick={() => scrollEpisodesByAmount('left')}
              className="absolute left-0 top-1/2 flex h-8 w-8 -translate-x-2 -translate-y-1/2 items-center justify-center rounded-lg bg-white/95 text-black shadow-md transition-colors hover:bg-white md:h-10 md:w-10 md:-translate-x-4 lg:-translate-x-6"
              aria-label="Previous episode"
            >
              <span className="text-lg leading-none md:text-xl">‹</span>
            </button>

            <button
              onClick={() => scrollEpisodesByAmount('right')}
              className="absolute right-0 top-1/2 flex h-8 w-8 translate-x-2 -translate-y-1/2 items-center justify-center rounded-lg bg-white/95 text-black shadow-md transition-colors hover:bg-white md:h-10 md:w-10 md:translate-x-4 lg:translate-x-6"
              aria-label="Next episode"
            >
              <span className="text-lg leading-none md:text-xl">›</span>
            </button>
          </div>
        </div>

        <div className="flex flex-col lg:flex-row gap-10">
          <div className="w-full lg:w-[65%]">
            <h2 className="text-xl font-bold mb-4">Reviews for {seriesData.groups?.find(e => e.id === activeVideoId)?.name || 'Current Episode'}</h2>
            
            <div className="space-y-4 mb-8">
              {loadingComments ? (
                <p className="text-gray-500">Loading comments...</p>
              ) : comments.length > 0 ? (
                comments.map((item) => (
                  <div key={item.id} className="bg-white/5 p-4 rounded-xl flex gap-4">
                     <div className="relative w-10 h-10 shrink-0">
                        <Image src={item.avatar_url || `https://api.dicebear.com/7.x/avataaars/svg?seed=${item.name}`} alt={item.name} fill className="rounded-full" />
                     </div>
                     <div>
                        <div className="flex justify-between w-full gap-20"><span className="font-bold text-sm">{item.name}</span> <span className="text-xs text-gray-500">{item.time_ago}</span></div>
                        <p className="text-sm text-gray-400 mt-1">{item.comment}</p>
                     </div>
                  </div>
                ))
              ) : <p className="text-gray-500">No reviews yet for this episode.</p>}
            </div>

            <div className="bg-[#0a1628]/50 p-6 rounded-2xl border border-white/5">
              <label className="text-xs sm:text-sm font-semibold mb-3 block">Rating This Series</label>
              <div className="flex items-center gap-2 mb-4">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    onClick={() => handleRateSeries(star)}
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

              <div
                className={`mb-4 rounded-xl border backdrop-blur-md px-4 py-3 text-sm shadow-[0_10px_30px_rgba(0,0,0,0.25)] transition-all duration-300 ${
                  ratingToastType === 'success'
                    ? 'border-emerald-300/30 bg-emerald-500/15 text-emerald-100'
                    : 'border-rose-300/30 bg-rose-500/15 text-rose-100'
                } ${
                  showRatingToast
                    ? 'opacity-100 translate-y-0 scale-100 animate-pulse'
                    : 'opacity-0 -translate-y-2 scale-95 pointer-events-none h-0 p-0 border-0 mb-0'
                }`}
                role="status"
                aria-live="polite"
              >
                {ratingToastMessage}
              </div>

              <textarea 
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                className="w-full bg-transparent border border-gray-700 rounded-xl p-4 text-sm text-white focus:border-[#D4A84B] outline-none h-28 mb-4"
                placeholder="Share your thoughts on this episode..."
              />
              <button 
                onClick={handleSubmitComment}
                disabled={isSubmittingComment || !newComment.trim()}
                className="bg-white text-black px-8 py-2 rounded-full font-bold disabled:opacity-50"
              >
                {isSubmittingComment ? 'Posting...' : 'Post Review'}
              </button>
            </div>
          </div>

          <div className="w-full lg:w-[35%]">
            <h2 className="text-xl font-bold mb-6">Recommended</h2>
            {seriesData.recomen?.map((item) => (
              <Link key={item.id} href={`/dashboard/series/detail?id=${item.id}&id_group=${item.id}`} className="flex gap-4 mb-4 group">
                <div className="relative w-32 aspect-video rounded-lg overflow-hidden shrink-0">
                  <Image src={item.image_url || '/placeholder-poster.png'} alt={item.name} fill className="object-cover" />
                </div>
                <h4 className="font-bold text-sm group-hover:text-[#D4A84B]">{item.name}</h4>
              </Link>
            ))}
          </div>
        </div>
      </div>
      <Footer />

      <ClipShare
        showShare={showShare}
        clipId={seriesId || ''}
        clipName={seriesData?.name || 'Series'}
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
    </div>
  )
}

export default function SeriesDetailClientWrapper() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-[#050B14]" />}>
      <SeriesDetailContent />
    </Suspense>
  )
}
