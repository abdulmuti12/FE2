'use client'

import Image from 'next/image'
import { useState, useRef, useEffect, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import {
  Heart,
  Plus,
  Share2,
  Play,
  MessageCircle,
  ChevronDown,
  ChevronUp,
  Music,
  Bookmark,
  Volume2,
  VolumeX,
  Copy,
  X,
} from 'lucide-react'
import { Header } from '@/components/header'
import { Footer } from '@/components/footer'
import { ClipComments } from '@/components/clip/clip-comments'

// --- INTERFACES ---
interface Movie {
  id: string
  name: string
  video_url: string
  image_url?: string
  synopsis?: string
  cats?: string
  run_time_format?: string
  favorit?: string
  comment?: string
}

interface Comment {
  id: string
  id_customer: string
  id_nft_item: string
  comment: string
  dates: string
  name: string
  avatar: string
  avatar_url: string
  time_ago: string
  heart: string
  isLiked?: boolean // Tambahan state lokal untuk mendeteksi apakah user sudah like
}

// --- DATA DUMMY ---
const sidebarCategories = [
  { icon: '/images/icon/clippp.png', label: 'All Clips' },
  { icon: '/images/icon/action4.png', label: 'Action' },
  { icon: '/images/icon/adventure.png', label: 'Adventure' },
  { icon: '/images/icon/horror.png', label: 'Horror' },
  { icon: '/images/icon/history.png', label: 'History' },
  { icon: '/images/icon/comedy.png', label: 'Comedy' },
  { icon: '/images/icon/mystery.png', label: 'Mystery' },
  { icon: '/images/icon/clipp.png', label: 'Video Clip' },
  { icon: '/images/icon/child.png', label: 'Kids' },
  { icon: '/images/icon/story.png', label: 'Story' },
  { icon: '/images/icon/religi.png', label: 'Religi' },
  { icon: '/images/icon/fantasy.png', label: 'Fantasy' },
]

// --- KOMPONEN ITEM VIDEO ---
const VideoItem = ({
  clip,
  index,
  total,
  isActive,
  onActive,
  isNearEnd,
  onNearEnd,
}: {
  clip: any
  index: number
  total: number
  isActive: boolean
  onActive: () => void
  isNearEnd?: boolean
  onNearEnd?: () => void
}) => {
  const desktopVideoRef = useRef<HTMLVideoElement>(null)
  const mobileVideoRef = useRef<HTMLVideoElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)

  const [isPlaying, setIsPlaying] = useState(false)
  const [isMuted, setIsMuted] = useState(false)
  const [showComments, setShowComments] = useState(false)
  const [showShare, setShowShare] = useState(false)
  const [comments, setComments] = useState<Comment[]>([])
  const [commentsLoading, setCommentsLoading] = useState(false)
  const [commentInput, setCommentInput] = useState('')
  const [isSubmittingComment, setIsSubmittingComment] = useState(false)
  const [showAllComments, setShowAllComments] = useState(false)

  // Auto-close komentar & hentikan video saat ganti slide (tidak active)
  useEffect(() => {
    const vids = [desktopVideoRef.current, mobileVideoRef.current].filter(Boolean) as HTMLVideoElement[]

    if (isActive) {
      vids.forEach((vid) => {
        const playPromise = vid.play()
        if (playPromise !== undefined) {
          playPromise
            .then(() => setIsPlaying(true))
            .catch((error) => {
              console.log('Autoplay blocked, muting.', error)
              vid.muted = true
              setIsMuted(true)
              vid.play().then(() => setIsPlaying(true)).catch(() => setIsPlaying(false))
            })
        }
      })
    } else {
      vids.forEach((vid) => {
        vid.pause()
        vid.currentTime = 0
      })
      setIsPlaying(false)
      setShowComments(false)
      setShowShare(false)
    }
  }, [isActive])

  // Observer HANYA mendeteksi slide aktif & trigger prefetch di background jika isNearEnd
  useEffect(() => {
    const options = {
      root: null,
      rootMargin: '0px',
      threshold: 0.6,
    }

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          onActive()
          if (isNearEnd && onNearEnd) {
            onNearEnd() // Trigger ambil data halaman berikutnya
          }
        }
      })
    }, options)

    if (containerRef.current) observer.observe(containerRef.current)

    return () => {
      if (containerRef.current) observer.unobserve(containerRef.current)
    }
  }, [onActive, isNearEnd, onNearEnd])

  const togglePlay = () => {
    const vids = [desktopVideoRef.current, mobileVideoRef.current].filter(Boolean) as HTMLVideoElement[]
    const currentIsPlaying = isPlaying

    vids.forEach((vid) => {
      if (currentIsPlaying) vid.pause()
      else vid.play()
    })

    setIsPlaying(!currentIsPlaying)
  }

  const toggleMute = (e: React.MouseEvent) => {
    e.stopPropagation()
    const vids = [desktopVideoRef.current, mobileVideoRef.current].filter(Boolean) as HTMLVideoElement[]
    
    vids.forEach((vid) => {
      vid.muted = !vid.muted
    })
    
    setIsMuted(!isMuted)
  }

  const fetchCommentsData = async () => {
    try {
      setCommentsLoading(true)
      const token = localStorage.getItem('user_token')
      if (!token) return

      const response = await fetch(`/api/clip-comments?id=${clip.id}`, {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      })

      if (!response.ok) {
        setComments([])
        return
      }

      const text = await response.text()
      let data
      try {
        data = JSON.parse(text)
      } catch (e) {
        setComments([])
        return
      }

      if (data.status === true && data.list && Array.isArray(data.list)) {
        setComments(data.list)
      } else {
        setComments([])
      }
    } catch (error) {
      console.error('[v0] Error fetching comments:', error)
      setComments([])
    } finally {
      setCommentsLoading(false)
    }
  }

  const handleOpenComments = async () => {
    setShowComments(true)
    if (comments.length === 0) {
      await fetchCommentsData()
    }
  }

  const handleSubmitComment = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!commentInput.trim()) return

    try {
      setIsSubmittingComment(true)
      const token = localStorage.getItem('user_token')
      if (!token) return

      const requestBody = {
        id: clip.id,
        comment: commentInput,
      }

      const response = await fetch('/api/post-comment', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestBody),
      })

      if (!response.ok) return

      const data = await response.json()
      if (data.status === true) {
        setCommentInput('') 
        await fetchCommentsData() 
      }
    } catch (error) {
      console.error('[v0] Error submitting comment:', error)
    } finally {
      setIsSubmittingComment(false)
    }
  }

  // FITUR LIKE / UNLIKE COMMENT
  const handleLikeComment = async (commentId: string) => {
    try {
      const token = localStorage.getItem('user_token')
      if (!token) return

      // Optimistic Update: Toggle state isLiked dan angkanya
      setComments((prevComments) =>
        prevComments.map((c) => {
          if (c.id === commentId) {
            const currentHearts = parseInt(c.heart) || 0
            const isCurrentlyLiked = !!c.isLiked

            return { 
              ...c, 
              // Jika sebelumnya di-like, maka kurangi angkanya. Jika belum, tambah 1.
              heart: isCurrentlyLiked ? Math.max(0, currentHearts - 1).toString() : (currentHearts + 1).toString(),
              // Balikkan status like-nya
              isLiked: !isCurrentlyLiked 
            }
          }
          return c
        })
      )

      // Hit API LOKAL Next.js
      const response = await fetch('/api/like-comment', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ id_comment: commentId }),
      })

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      const data = await response.json()
      
      if (data.status !== true) {
        console.warn("API returned false status:", data)
        await fetchCommentsData()
      }
    } catch (error) {
      console.error('[v0] Error liking comment:', error)
      await fetchCommentsData() 
    }
  }

  const displayedComments = showAllComments ? comments : comments.slice(0, 5)

  return (
    <div ref={containerRef} className="w-full h-full snap-start flex items-center justify-center lg:items-start lg:pt-10 lg:px-8 relative">
      
      {/* Navigasi kecil desktop */}
      <div className="hidden lg:flex absolute right-8 top-1/2 -translate-y-1/2 flex-col gap-96 pointer-events-none opacity-20 z-50">
        {index > 0 && <ChevronUp className="w-10 h-10 animate-bounce" />}
        {/* Hilangkan icon panah bawah jika belum ada data tapi ini akhir video (akan diload otomatis) */}
        {index < total - 1 && <ChevronDown className="w-10 h-10 animate-bounce" />}
      </div>

      {/* --- DESKTOP LAYOUT --- */}
      <div className={`hidden lg:grid grid-cols-12 gap-6 items-center w-full transition-all duration-500 lg:h-[82vh] ${showComments ? 'max-w-[1400px]' : 'max-w-6xl'}`}>
        
        {/* Kolom kiri: info */}
        <div className={`flex flex-col justify-center space-y-6 animate-in slide-in-from-left duration-700 fade-in col-span-3`}>
          <div className="flex items-center gap-3 bg-white/5 p-3 rounded-xl border border-white/10 w-fit backdrop-blur-sm">
            <Image
              src={clip.creatorAvatar}
              alt={clip.creator}
              width={48}
              height={48}
              className="w-10 h-10 rounded-full border border-white/20"
            />
            <div>
              <h4 className="text-sm font-bold text-white leading-tight">{clip.creator}</h4>
              <p className="text-[10px] text-gray-400">Creator</p>
            </div>
          </div>

          <div>
            <h1 className="text-3xl font-bold mb-3 leading-tight text-white drop-shadow-lg">{clip.title}</h1>
            <p className="text-gray-300 text-sm leading-relaxed">{clip.description}</p>
          </div>

          <div className="flex flex-wrap gap-2">
            <span className="px-3 py-1 rounded-full bg-white/5 border border-white/10 text-xs text-gray-300">
              #{clip.genre}
            </span>
            <span className="px-3 py-1 rounded-full bg-white/5 border border-white/10 text-xs text-gray-300">
              #AI_Video
            </span>
          </div>
        </div>

        {/* Kolom tengah: video */}
        <div className={`${showComments ? 'col-span-4' : 'col-span-6'} h-full flex items-center justify-center py-4 transition-all duration-500`}>
          <div className="relative w-full h-full max-h-[82vh] aspect-[9/16] rounded-3xl overflow-hidden border border-white/10 shadow-[0_0_50px_-12px_rgba(0,0,0,0.5)] group bg-black">
            <video
              ref={desktopVideoRef}
              src={clip.video}
              poster={clip.image_url}   // Optimasi Render Thumbnail
              preload="metadata"        // Hemat bandwidth untuk video tidak aktif
              className="w-full h-full object-cover cursor-pointer"
              muted={isMuted}
              loop
              playsInline
              onClick={togglePlay}
            />

            <button
              onClick={toggleMute}
              className="absolute top-4 right-4 z-20 bg-black/40 backdrop-blur-md p-2.5 rounded-full text-white hover:bg-black/60 transition-all border border-white/10"
            >
              {isMuted ? <VolumeX className="w-5 h-5" /> : <Volume2 className="w-5 h-5" />}
            </button>

            {!isPlaying && (
              <div className="absolute inset-0 flex items-center justify-center bg-black/20 cursor-pointer" onClick={togglePlay}>
                <div className="w-20 h-20 bg-white/20 backdrop-blur-md rounded-full flex items-center justify-center border border-white/30 hover:scale-110 transition-transform">
                  <Play className="w-8 h-8 text-white fill-white ml-1" />
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Kolom kanan 1: actions */}
        <div className={`${showComments ? 'col-span-1 items-center justify-end pb-8 pl-0' : 'col-span-3 pl-8 justify-center'} flex flex-col gap-8 h-[82vh] animate-in slide-in-from-right duration-700 fade-in transition-all duration-500`}>
          {[
            { icon: Heart, label: clip.likes, action: null },
            { icon: MessageCircle, label: clip.comments, action: 'comments' },
            { icon: Plus, label: 'Add', action: null },
            { icon: Share2, label: clip.shares, action: 'share' },
          ].map((btn, idx) => (
            <div
              key={idx}
              onClick={() => {
                if (btn.action === 'comments') handleOpenComments()
                if (btn.action === 'share') setShowShare(true)
              }}
              className="flex items-center gap-4 group cursor-pointer"
            >
              <div
                className={`w-14 h-14 rounded-full flex items-center justify-center bg-[#1e293b]/80 backdrop-blur border border-white/10 group-hover:bg-white/10 group-hover:scale-110 transition-all shadow-lg ${
                  showComments && btn.action === 'comments' ? 'bg-white/20' : ''
                }`}
              >
                <btn.icon className={`w-6 h-6 ${btn.label === clip.likes ? 'group-hover:text-red-500' : 'text-white'}`} />
              </div>
              <span className={`text-base font-medium text-gray-300 group-hover:text-white ${showComments ? 'hidden' : 'block'}`}>{btn.label}</span>
            </div>
          ))}
        </div>

        {/* Kolom kanan 2: Comments Panel desktop */}
        {showComments && (
          <div className="col-span-4 bg-[#0b0f19] border border-white/10 flex flex-col h-[82vh] z-50 rounded-2xl shadow-2xl animate-in fade-in zoom-in-95 duration-300 relative">
            <div className="flex items-center justify-between px-5 py-4 border-b border-white/10">
              <h3 className="text-white font-bold text-lg">Komentar</h3>
              <button onClick={() => setShowComments(false)} className="text-gray-400 hover:text-white transition-colors">
                ✕
              </button>
            </div>

            <div className="flex-1 overflow-y-auto py-4 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:'none'] [scrollbar-width:'none']">
              {commentsLoading ? (
                <div className="flex items-center justify-center h-full">
                  <p className="text-gray-400 text-sm">Loading comments...</p>
                </div>
              ) : comments.length > 0 ? (
                <div className="space-y-4 px-4 pb-10">
                  {displayedComments.map((comment) => (
                    <div key={comment.id} className="flex gap-3">
                      <Image src={comment.avatar_url} alt={comment.name} width={40} height={40} className="w-8 h-8 rounded-full flex-shrink-0 object-cover" />
                      <div className="flex-1 min-w-0">
                        <p className="text-white text-sm font-semibold">{comment.name}</p>
                        <p className="text-gray-300 text-xs mt-1 leading-relaxed break-words">{comment.comment}</p>
                        <div className="flex items-center gap-3 mt-2">
                          <span className="text-gray-500 text-xs">{comment.time_ago}</span>
                          <button 
                            type="button"
                            onClick={(e) => {
                              e.preventDefault();
                              e.stopPropagation();
                              handleLikeComment(comment.id);
                            }}
                            className={`flex items-center gap-1 transition-colors active:scale-110 ${
                              comment.isLiked ? 'text-red-500' : 'text-gray-500 hover:text-red-500'
                            }`}
                          >
                            <Heart 
                              className="w-3 h-3" 
                              strokeWidth={2} 
                              fill={comment.isLiked ? "currentColor" : "none"} 
                            />
                            <span className="text-xs">{comment.heart}</span>
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}

                  {/* Tombol Show More / Less */}
                  {comments.length > 5 && !showAllComments && (
                    <button
                      onClick={() => setShowAllComments(true)}
                      className="text-gray-400 hover:text-white text-xs mt-3 w-full text-left transition-colors font-medium"
                    >
                      View more comments ({comments.length - 5})...
                    </button>
                  )}
                  {comments.length > 5 && showAllComments && (
                    <button
                      onClick={() => setShowAllComments(false)}
                      className="text-gray-400 hover:text-white text-xs mt-3 w-full text-left transition-colors font-medium"
                    >
                      Show less
                    </button>
                  )}
                </div>
              ) : (
                <div className="flex items-center justify-center h-full">
                  <p className="text-gray-400 text-sm">No comments yet</p>
                </div>
              )}
            </div>

            <form onSubmit={handleSubmitComment} className="border-t border-white/10 px-4 py-3 bg-[#0b0f19] rounded-b-2xl">
              <div className="flex gap-2">
                <input
                  type="text"
                  placeholder="Tambahkan komentar..."
                  value={commentInput}
                  onChange={(e) => setCommentInput(e.target.value)}
                  className="flex-1 bg-white/10 border border-white/20 rounded-lg px-3 py-2 text-white placeholder-gray-500 text-sm focus:outline-none focus:border-white/40 transition-colors"
                />
                <button
                  type="submit"
                  disabled={isSubmittingComment || !commentInput.trim()}
                  className="px-4 py-2 bg-white/20 hover:bg-white/30 disabled:opacity-50 disabled:cursor-not-allowed rounded-lg text-white text-sm transition-colors"
                >
                  {isSubmittingComment ? 'Sending...' : 'Send'}
                </button>
              </div>
            </form>
          </div>
        )}
      </div>

      {/* --- MOBILE LAYOUT (TIKTOK STYLE) --- */}
      <div className="lg:hidden w-full h-full relative bg-black">
        <video
          ref={mobileVideoRef}
          src={clip.video}
          poster={clip.image_url}     // Optimasi Render Thumbnail
          preload="metadata"          // Hemat bandwidth untuk video tidak aktif
          className="w-full h-full object-cover"
          muted={isMuted}
          loop
          playsInline
          onClick={togglePlay}
        />

        <button
          onClick={toggleMute}
          className="absolute top-20 right-4 z-30 bg-black/20 backdrop-blur-sm p-2 rounded-full text-white/80 border border-white/10"
        >
          {isMuted ? <VolumeX className="w-6 h-6" /> : <Volume2 className="w-6 h-6" />}
        </button>

        {!isPlaying && (
          <div className="absolute inset-0 flex items-center justify-center z-10" onClick={togglePlay}>
            <div className="w-16 h-16 bg-black/40 rounded-full flex items-center justify-center backdrop-blur-sm">
              <Play className="w-8 h-8 text-white fill-white ml-1" />
            </div>
          </div>
        )}

        <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-transparent to-black/90 pointer-events-none" />

        <div className="absolute right-2 bottom-20 flex flex-col items-center gap-5 z-20 pb-4">
          <div className="relative mb-2">
            <div className="w-10 h-10 rounded-full border border-white p-0.5 overflow-hidden">
              <Image src={clip.creatorAvatar} width={40} height={40} alt="Creator" className="rounded-full" />
            </div>
            <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 bg-red-500 rounded-full w-5 h-5 flex items-center justify-center">
              <Plus className="w-3 h-3 text-white" />
            </div>
          </div>

          <div className="flex flex-col items-center gap-1 drop-shadow-md">
            <Heart className="w-8 h-8 text-white" strokeWidth={1.5} />
            <span className="text-xs font-semibold text-white">{clip.likes}</span>
          </div>

          <button
            onClick={handleOpenComments}
            className="flex flex-col items-center gap-1 drop-shadow-md hover:opacity-80 transition-opacity"
          >
            <MessageCircle className="w-8 h-8 text-white" strokeWidth={1.5} />
            <span className="text-xs font-semibold text-white">{clip.comments}</span>
          </button>

          <div className="flex flex-col items-center gap-1 drop-shadow-md">
            <div className="bg-white/10 p-1.5 rounded-full backdrop-blur-sm">
              <Bookmark className="w-6 h-6 text-white fill-white/20" strokeWidth={1.5} />
            </div>
            <span className="text-xs font-semibold text-white">{clip.saves}</span>
          </div>

          <button
            onClick={() => setShowShare(true)}
            className="flex flex-col items-center gap-1 drop-shadow-md hover:opacity-80 transition-opacity"
          >
            <Share2 className="w-8 h-8 text-white" strokeWidth={1.5} />
            <span className="text-xs font-semibold text-white">{clip.shares}</span>
          </button>

          <div className="mt-4 animate-[spin_4s_linear_infinite]">
            <div className="w-10 h-10 rounded-full bg-gray-900 border-4 border-gray-800 flex items-center justify-center overflow-hidden">
              <Image src={clip.creatorAvatar} width={24} height={24} alt="music" className="rounded-full w-6 h-6" />
            </div>
          </div>
        </div>

        <div className="absolute bottom-0 left-0 w-[80%] p-4 z-20 pb-6">
          <div className="flex items-center gap-2 mb-2">
            <h3 className="text-white font-bold text-base shadow-black drop-shadow-md">@{clip.creator.replace(' ', '')}</h3>
            <span className="bg-white/20 backdrop-blur-md px-2 py-0.5 rounded text-[10px] font-semibold text-white">Follow</span>
          </div>
          <p className="text-white text-sm leading-snug mb-3 drop-shadow-md">
            {clip.description} <span className="font-bold ml-1">#fyp #viral</span>
          </p>
          <div className="flex items-center gap-2">
            <Music className="w-3 h-3 text-white" />
            <div className="overflow-hidden w-40">
              <p className="text-xs text-white whitespace-nowrap animate-marquee">
                Original Sound - {clip.genre} Music • {clip.title}
              </p>
            </div>
          </div>
        </div>

        {/* Mobile comments sheet */}
        {showComments && (
          <div className="fixed inset-0 z-50 flex items-end lg:hidden">
            <div className="absolute inset-0 bg-black/50" onClick={() => setShowComments(false)} />
            <div className="relative w-full bg-[#1a1a2e] border-t border-white/20 rounded-t-3xl max-h-[90vh] flex flex-col animate-in slide-in-from-bottom duration-300">
              <div className="flex items-center justify-between px-6 py-4 border-b border-white/10 flex-shrink-0">
                <h3 className="text-white font-semibold text-base">Comments</h3>
                <button onClick={() => setShowComments(false)} className="text-gray-400 hover:text-white transition-colors text-xl">
                  ✕
                </button>
              </div>

              <div className="flex-1 overflow-y-auto [&::-webkit-scrollbar]:hidden [-ms-overflow-style:'none'] [scrollbar-width:'none']">
                {commentsLoading ? (
                  <div className="flex items-center justify-center h-full">
                    <p className="text-gray-400 text-sm">Loading comments...</p>
                  </div>
                ) : comments.length > 0 ? (
                  <div className="space-y-5 px-6 py-5 pb-10">
                    {displayedComments.map((comment) => (
                      <div key={comment.id} className="flex gap-3 pb-4 border-b border-white/5 last:border-b-0">
                        <Image src={comment.avatar_url} alt={comment.name} width={40} height={40} className="w-10 h-10 rounded-full flex-shrink-0 object-cover" />
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2">
                            <p className="text-white text-sm font-medium">{comment.name}</p>
                            <span className="text-gray-500 text-xs">{comment.time_ago}</span>
                          </div>
                          <p className="text-gray-300 text-xs mt-2 leading-relaxed break-words">{comment.comment}</p>
                          <button 
                            type="button"
                            onClick={(e) => {
                              e.preventDefault();
                              e.stopPropagation();
                              handleLikeComment(comment.id);
                            }}
                            className={`mt-2 flex items-center gap-1 transition-colors active:scale-110 ${
                              comment.isLiked ? 'text-red-500' : 'text-gray-500 hover:text-red-500'
                            }`}
                          >
                            <Heart 
                              className="w-4 h-4" 
                              strokeWidth={2} 
                              fill={comment.isLiked ? "currentColor" : "none"} 
                            />
                            <span className="text-xs">{comment.heart}</span>
                          </button>
                        </div>
                      </div>
                    ))}

                    {/* Tombol Show More / Less */}
                    {comments.length > 5 && !showAllComments && (
                      <button
                        onClick={() => setShowAllComments(true)}
                        className="text-gray-400 hover:text-white text-xs mt-3 w-full text-left transition-colors font-medium"
                      >
                        View more comments ({comments.length - 5})...
                      </button>
                    )}
                    {comments.length > 5 && showAllComments && (
                      <button
                        onClick={() => setShowAllComments(false)}
                        className="text-gray-400 hover:text-white text-xs mt-3 w-full text-left transition-colors font-medium"
                      >
                        Show less
                      </button>
                    )}
                  </div>
                ) : (
                  <div className="flex items-center justify-center h-full">
                    <p className="text-gray-400 text-sm">No comments yet</p>
                  </div>
                )}
              </div>

              <form onSubmit={handleSubmitComment} className="border-t border-white/10 px-6 py-4 flex-shrink-0 bg-[#1a1a2e]">
                <div className="flex gap-2">
                  <input
                    type="text"
                    placeholder="Write a comment..."
                    value={commentInput}
                    onChange={(e) => setCommentInput(e.target.value)}
                    className="flex-1 bg-white/10 border border-white/20 rounded-lg px-3 py-2 text-white placeholder-gray-500 text-sm focus:outline-none focus:border-white/40 transition-colors"
                  />
                  <button
                    type="submit"
                    disabled={isSubmittingComment || !commentInput.trim()}
                    className="px-4 py-2 bg-white/20 hover:bg-white/30 disabled:opacity-50 disabled:cursor-not-allowed rounded-lg text-white text-sm transition-colors"
                  >
                    {isSubmittingComment ? 'Sending...' : 'Send'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Share sheet mobile */}
        {showShare && (
          <div className="fixed inset-0 z-50 flex items-end lg:hidden">
            <div className="absolute inset-0 bg-black/50" onClick={() => setShowShare(false)} />
            <div className="relative w-full bg-[#1a1a2e] border-t border-white/20 rounded-t-3xl max-h-[90vh] flex flex-col animate-in slide-in-from-bottom duration-300">
              <div className="flex items-center justify-between px-6 py-4 border-b border-white/10">
                <h3 className="text-white font-semibold text-base">Share</h3>
                <button onClick={() => setShowShare(false)} className="text-gray-400 hover:text-white transition-colors text-xl">
                  ✕
                </button>
              </div>

              <div className="flex-1 p-6 flex flex-col gap-4">
                <button className="w-full px-4 py-3 bg-white/10 hover:bg-white/20 rounded-lg text-white font-medium transition-colors flex items-center gap-3">
                  <Copy className="w-5 h-5" />
                  Copy Link
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

// --- KOMPONEN UTAMA ---
export default function ClipsPage() {
  const router = useRouter()
  const [activeCategory, setActiveCategory] = useState('All Clips')
  const [apiClips, setApiClips] = useState<Movie[]>([])
  
  const [clipsLoading, setClipsLoading] = useState(true)
  const [activeVideoId, setActiveVideoId] = useState<string | null>(null)
  const [currentPage, setCurrentPage] = useState(1)
  const [hasMore, setHasMore] = useState(true)

  const fetchingRef = useRef(false) // Mencegah double fetch saat StrictMode atau multiple triggers

  useEffect(() => {
    const token = localStorage.getItem('user_token')
    if (!token) {
      router.push('/')
      return
    }
    fetchMovies(token, currentPage)
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [router, currentPage])

  const fetchMovies = async (token: string, page: number) => {
    // Abaikan jika sedang proses fetch atau data sudah habis
    if (fetchingRef.current || (!hasMore && page !== 1)) return
    
    fetchingRef.current = true
    if (page === 1) setClipsLoading(true)

    try {
      const params = new URLSearchParams({
        sort: 'latest',
        id_category: '',
        id_creator: '',
        page: page.toString(),
        limit: '5',
      })

      const response = await fetch(`/api/movies?${params}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })

      const data = await response.json()

      if (data && data.list && data.list.length > 0) {
        if (page === 1) {
          setApiClips(data.list)
        } else {
          // APPEND DATA: Mencegah duplikasi id
          setApiClips((prev) => {
            const existingIds = new Set(prev.map((c) => c.id))
            const newClips = data.list.filter((c: Movie) => !existingIds.has(c.id))
            return [...prev, ...newClips]
          })
        }

        // Jika data dari api lebih kecil dari limit(5), berarti ini page terakhir
        if (data.list.length < 5) {
          setHasMore(false)
        }
      } else {
        if (page === 1) setApiClips([])
        setHasMore(false)
      }
    } catch (error) {
      console.error('[v0] Error fetching movies:', error)
      if (page === 1) setApiClips([])
    } finally {
      setClipsLoading(false)
      fetchingRef.current = false
    }
  }

  // Dipanggil ketika user sudah melihat video ke 2 terakhir dari array
  const handleLoadMore = useCallback(() => {
    if (!fetchingRef.current && hasMore) {
      setCurrentPage((prev) => prev + 1)
    }
  }, [hasMore])

  return (
    <>
      <Header />
      <main className="min-h-screen bg-black">
        <div className="flex h-screen">
          {/* Sidebar */}
          <div className="hidden lg:flex lg:w-64 lg:flex-col lg:border-r lg:border-white/10 bg-black overflow-y-auto [&::-webkit-scrollbar]:hidden [-ms-overflow-style:'none'] [scrollbar-width:'none']">
            <div className="p-6 space-y-4">
              {sidebarCategories.map((category) => (
                <button
                  key={category.label}
                  onClick={() => setActiveCategory(category.label)}
                  className={`w-full flex items-center gap-4 px-4 py-3 rounded-lg transition-all ${
                    activeCategory === category.label
                      ? 'bg-white/10 text-white border border-white/20'
                      : 'text-gray-400 hover:text-white hover:bg-white/5'
                  }`}
                >
                  <Image src={category.icon} alt={category.label} width={24} height={24} className="w-6 h-6 flex-shrink-0" />
                  <span className="text-sm font-medium">{category.label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Main content */}
          <div className="flex-1 overflow-hidden relative">
            {clipsLoading && apiClips.length === 0 ? (
              <div className="w-full h-full flex items-center justify-center bg-black">
                <div className="text-center">
                  <div className="w-12 h-12 border-4 border-white/20 border-t-white rounded-full animate-spin mx-auto mb-4" />
                  <p className="text-gray-400 text-sm">Loading clips...</p>
                </div>
              </div>
            ) : apiClips.length > 0 ? (
              <div className="snap-y snap-mandatory overflow-y-scroll h-full scroll-smooth [&::-webkit-scrollbar]:hidden [-ms-overflow-style:'none'] [scrollbar-width:'none']">
                {apiClips.map((clip, index) => {
                  const transformedClip = {
                    id: clip.id,
                    title: clip.name,
                    video: clip.video_url,
                    image_url: clip.image_url, // Poster untuk preload
                    description: clip.synopsis || '',
                    creator: 'Creator',
                    creatorAvatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Creator',
                    genre: clip.cats || 'Video Clip',
                    likes: clip.favorit || '0',
                    comments: clip.comment || '0',
                    shares: '0',
                    saves: '0',
                  }
                  
                  // Trigger prefetch saat video berada di 2 indeks terakhir
                  const isNearEnd = index === apiClips.length - 2;

                  return (
                    <VideoItem
                      key={clip.id}
                      clip={transformedClip}
                      index={index}
                      total={apiClips.length}
                      isActive={activeVideoId === clip.id}
                      onActive={() => setActiveVideoId(clip.id)}
                      isNearEnd={isNearEnd}
                      onNearEnd={handleLoadMore}
                    />
                  )
                })}
              </div>
            ) : (
              <div className="w-full h-full flex items-center justify-center bg-black">
                <p className="text-gray-400">No clips found</p>
              </div>
            )}
          </div>
        </div>
      </main>
      {/* <Footer /> */}
    </>
  )
}