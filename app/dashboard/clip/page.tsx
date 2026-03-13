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
  ChevronLeft,
  ChevronRight,
  Music,
  Bookmark,
  Volume2,
  VolumeX,
  Copy,
  X,
  Smartphone, // <-- Icon Portrait
  Monitor,    // <-- Icon Landscape
} from 'lucide-react'
import { Header } from '@/components/header'
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
  isLiked?: boolean 
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
  isLiked?: boolean
}

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
  clip: Movie
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

  // --- STATE UNTUK ORIENTASI VIDEO ---
  const [videoOrientation, setVideoOrientation] = useState<'portrait' | 'landscape'>('portrait')

  // --- STATE UNTUK VIDEO LIKE ---
  const [videoLikes, setVideoLikes] = useState(parseInt(clip.favorit || '0'))
  const [isVideoLiked, setIsVideoLiked] = useState(clip.isLiked || false)
  const [isLiking, setIsLiking] = useState(false)

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
            onNearEnd() 
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

  const handleLikeVideo = async (e: React.MouseEvent) => {
    e.stopPropagation()
    if (isLiking) return
    
    try {
      setIsLiking(true)
      const token = localStorage.getItem('user_token')
      if (!token) return

      const newLikedState = !isVideoLiked
      const storedLikes = JSON.parse(localStorage.getItem('liked_videos') || '[]')

      setIsVideoLiked(newLikedState)
      setVideoLikes((prev) => (newLikedState ? prev + 1 : Math.max(0, prev - 1)))
      
      if (newLikedState) {
        localStorage.setItem('liked_videos', JSON.stringify([...new Set([...storedLikes, clip.id])]))
      } else {
        localStorage.setItem('liked_videos', JSON.stringify(storedLikes.filter((id: string) => id !== clip.id)))
      }

      const response = await fetch('/api/like-video', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ id: clip.id }),
      })

      if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`)
      const data = await response.json()
      
      if (data.status !== true) {
        setIsVideoLiked(!newLikedState)
        setVideoLikes((prev) => (!newLikedState ? prev + 1 : Math.max(0, prev - 1)))
        
        if (!newLikedState) {
          localStorage.setItem('liked_videos', JSON.stringify([...new Set([...storedLikes, clip.id])]))
        } else {
          localStorage.setItem('liked_videos', JSON.stringify(storedLikes.filter((id: string) => id !== clip.id)))
        }
      }
    } catch (error) {
      console.error('[v0] Error liking video:', error)
      const newLikedState = !isVideoLiked
      setIsVideoLiked(!newLikedState)
      setVideoLikes((prev) => (!newLikedState ? prev + 1 : Math.max(0, prev - 1)))
      
      const storedLikes = JSON.parse(localStorage.getItem('liked_videos') || '[]')
      if (!newLikedState) {
        localStorage.setItem('liked_videos', JSON.stringify([...new Set([...storedLikes, clip.id])]))
      } else {
        localStorage.setItem('liked_videos', JSON.stringify(storedLikes.filter((id: string) => id !== clip.id)))
      }
    } finally {
      setIsLiking(false)
    }
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

  const handleLikeComment = async (commentId: string) => {
    try {
      const token = localStorage.getItem('user_token')
      if (!token) return

      setComments((prevComments) =>
        prevComments.map((c) => {
          if (c.id === commentId) {
            const currentHearts = parseInt(c.heart) || 0
            const isCurrentlyLiked = !!c.isLiked

            return { 
              ...c, 
              heart: isCurrentlyLiked ? Math.max(0, currentHearts - 1).toString() : (currentHearts + 1).toString(),
              isLiked: !isCurrentlyLiked 
            }
          }
          return c
        })
      )

      const response = await fetch('/api/like-comment', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ id_comment: commentId }),
      })

      if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`)
      
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

  const handlePlatformShare = async (platform: string) => {
    try {
      const token = localStorage.getItem('user_token')
      
      if (token) {
        fetch(`/api/share-video?id=${clip.id}`, {
          method: 'GET',
          headers: { Authorization: `Bearer ${token}` }
        }).catch(err => console.error("[v0] Background Share API Error:", err))
      }

      const shareUrl = encodeURIComponent(`${window.location.origin}/clip?id=${clip.id}`)
      const shareText = encodeURIComponent(`Tonton video keren ini: ${clip.name}`)

      switch (platform) {
        case 'copy':
          await navigator.clipboard.writeText(`${window.location.origin}/clip?id=${clip.id}`)
          alert('Link berhasil disalin!')
          break
        case 'whatsapp':
          window.open(`https://api.whatsapp.com/send?text=${shareText}%20${shareUrl}`, '_blank')
          break
        case 'facebook':
          window.open(`https://www.facebook.com/sharer/sharer.php?u=${shareUrl}`, '_blank')
          break
        case 'x':
          window.open(`https://twitter.com/intent/tweet?text=${shareText}&url=${shareUrl}`, '_blank')
          break
        case 'telegram':
          window.open(`https://t.me/share/url?url=${shareUrl}&text=${shareText}`, '_blank')
          break
        case 'linkedin':
          window.open(`https://www.linkedin.com/sharing/share-offsite/?url=${shareUrl}`, '_blank')
          break
      }
      
      setShowShare(false)
    } catch (error) {
      console.error('[v0] Error sharing platform:', error)
    }
  }

  return (
    <div ref={containerRef} className="w-full h-[100dvh] lg:h-full snap-start flex items-center justify-center lg:items-start lg:pt-10 lg:px-8 relative">
      
      {/* Navigasi kecil desktop */}
      <div className="hidden lg:flex absolute right-8 top-1/2 -translate-y-1/2 flex-col gap-96 pointer-events-none opacity-20 z-50">
        {index > 0 && <ChevronUp className="w-10 h-10 animate-bounce" />}
        {index < total - 1 && <ChevronDown className="w-10 h-10 animate-bounce" />}
      </div>

      {/* --- DESKTOP LAYOUT --- */}
      <div className={`hidden lg:grid grid-cols-12 gap-6 items-center w-full transition-all duration-500 lg:h-[82vh] ${showComments ? 'max-w-[1400px]' : 'max-w-6xl'}`}>
        
        {/* Kolom kiri: info */}
        <div className={`flex flex-col justify-center space-y-6 animate-in slide-in-from-left duration-700 fade-in col-span-3`}>
          <div className="flex items-center gap-3 bg-white/5 p-3 rounded-xl border border-white/10 w-fit backdrop-blur-sm">
            <Image
              src={(clip as any).creatorAvatar}
              alt={(clip as any).creator}
              width={48}
              height={48}
              className="w-10 h-10 rounded-full border border-white/20 object-cover"
            />
            <div>
              <h4 className="text-sm font-bold text-white leading-tight">{(clip as any).creator}</h4>
              <p className="text-[10px] text-gray-400">Creator</p>
            </div>
          </div>

          <div>
            <h1 className="text-3xl font-bold mb-3 leading-tight text-white drop-shadow-lg">{clip.name}</h1>
            <p className="text-gray-300 text-sm leading-relaxed">{clip.synopsis}</p>
          </div>

          <div className="flex flex-wrap gap-2">
            <span className="px-3 py-1 rounded-full bg-white/5 border border-white/10 text-xs text-gray-300">
              #{clip.cats}
            </span>
            <span className="px-3 py-1 rounded-full bg-white/5 border border-white/10 text-xs text-gray-300">
              #AI_Video
            </span>
          </div>
        </div>

        {/* Kolom tengah: video dengan class responsif orientasi */}
        <div className={`${showComments ? 'col-span-4' : 'col-span-6'} h-full flex items-center justify-center py-4 transition-all duration-500`}>
          <div className={`relative flex items-center justify-center h-full max-h-[82vh] ${videoOrientation === 'portrait' ? 'aspect-[9/16] w-auto' : 'aspect-video w-full'} rounded-3xl overflow-hidden border border-white/10 shadow-[0_0_50px_-12px_rgba(0,0,0,0.5)] group bg-black transition-all duration-500`}>
            
            {/* --- TOMBOL TOGGLE ORIENTASI (DESKTOP) --- */}
            <div className="absolute top-4 left-4 z-30 flex bg-black/40 backdrop-blur-md rounded-lg p-1 border border-white/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
              <button
                onClick={(e) => { e.stopPropagation(); setVideoOrientation('portrait'); }}
                className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-md transition-colors text-xs font-medium ${videoOrientation === 'portrait' ? 'bg-white/20 text-white' : 'text-gray-400 hover:text-white'}`}
                title="Tampilan Portrait"
              >
                <Smartphone className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={(e) => { e.stopPropagation(); setVideoOrientation('landscape'); }}
                className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-md transition-colors text-xs font-medium ${videoOrientation === 'landscape' ? 'bg-white/20 text-white' : 'text-gray-400 hover:text-white'}`}
                title="Tampilan Landscape"
              >
                <Monitor className="w-3.5 h-3.5" />
              </button>
            </div>

            <video
              ref={desktopVideoRef}
              src={clip.video_url}
              poster={clip.image_url}   
              preload="metadata"        
              className={`w-full h-full ${videoOrientation === 'portrait' ? 'object-cover' : 'object-contain bg-black'} object-center cursor-pointer`}
              muted={isMuted}
              loop
              playsInline
              onClick={togglePlay}
            />

            <button
              onClick={toggleMute}
              className="absolute top-4 right-4 z-20 bg-black/40 backdrop-blur-md p-2.5 rounded-full text-white hover:bg-black/60 transition-all border border-white/10 opacity-0 group-hover:opacity-100"
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
          
          <div onClick={handleLikeVideo} className={`flex items-center gap-4 group ${isLiking ? 'cursor-not-allowed opacity-80' : 'cursor-pointer'}`}>
            <div className={`w-14 h-14 rounded-full flex items-center justify-center backdrop-blur border border-white/10 group-hover:scale-110 transition-all shadow-lg ${isVideoLiked ? 'bg-white/10' : 'bg-[#1e293b]/80 group-hover:bg-white/10'}`}>
              <Heart className={`w-6 h-6 ${isVideoLiked ? 'text-red-500' : 'text-white group-hover:text-red-500'} ${isLiking ? 'animate-pulse' : ''}`} fill={isVideoLiked ? "currentColor" : "none"}/>
            </div>
            <span className={`text-base font-medium text-gray-300 group-hover:text-white ${showComments ? 'hidden' : 'block'}`}>{videoLikes}</span>
          </div>

          {[
            { icon: MessageCircle, label: clip.comment, action: 'comments' },
            { icon: Plus, label: 'Add', action: null },
            { icon: Share2, label: 'Share', action: 'share' },
          ].map((btn, idx) => (
            <div
              key={idx}
              onClick={() => {
                if (btn.action === 'comments') handleOpenComments()
                if (btn.action === 'share') setShowShare(true)
              }}
              className="flex items-center gap-4 group cursor-pointer"
            >
              <div className={`w-14 h-14 rounded-full flex items-center justify-center bg-[#1e293b]/80 backdrop-blur border border-white/10 group-hover:bg-white/10 group-hover:scale-110 transition-all shadow-lg ${showComments && btn.action === 'comments' ? 'bg-white/20' : ''}`}>
                <btn.icon className={`w-6 h-6 text-white`} />
              </div>
              <span className={`text-base font-medium text-gray-300 group-hover:text-white ${showComments ? 'hidden' : 'block'}`}>{btn.label}</span>
            </div>
          ))}
        </div>

        {/* --- PANGGIL KOMPONEN COMMENTS DESKTOP --- */}
        <ClipComments 
          showComments={showComments}
          comments={comments}
          commentsLoading={commentsLoading}
          commentInput={commentInput}
          isSubmittingComment={isSubmittingComment}
          showAllComments={showAllComments}
          onClose={() => setShowComments(false)}
          onCommentInputChange={setCommentInput}
          onSubmitComment={handleSubmitComment}
          onShowAllComments={setShowAllComments}
          onLikeComment={handleLikeComment}
          isMobile={false}
          videoOrientation={videoOrientation}
          onChangeOrientation={setVideoOrientation}
        />

      </div>

      {/* --- MOBILE LAYOUT (TIKTOK STYLE) --- */}
      <div className="lg:hidden w-full h-full relative bg-black flex items-center justify-center group">
        
        {/* --- TOMBOL TOGGLE ORIENTASI (MOBILE) --- */}
        <div className="absolute top-20 left-4 z-30 flex bg-black/20 backdrop-blur-sm rounded-lg p-1 border border-white/10">
          <button
            onClick={(e) => { e.stopPropagation(); setVideoOrientation('portrait'); }}
            className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-md transition-colors ${videoOrientation === 'portrait' ? 'bg-white/20 text-white' : 'text-gray-400 hover:text-white'}`}
          >
            <Smartphone className="w-4 h-4" />
          </button>
          <button
            onClick={(e) => { e.stopPropagation(); setVideoOrientation('landscape'); }}
            className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-md transition-colors ${videoOrientation === 'landscape' ? 'bg-white/20 text-white' : 'text-gray-400 hover:text-white'}`}
          >
            <Monitor className="w-4 h-4" />
          </button>
        </div>

        <video
          ref={mobileVideoRef}
          src={clip.video_url}
          poster={clip.image_url}     
          preload="metadata"          
          className={`w-full h-full ${videoOrientation === 'portrait' ? 'object-cover' : 'object-contain'} object-center transition-all duration-300`}
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
              <Image src={(clip as any).creatorAvatar} width={40} height={40} alt="Creator" className="rounded-full object-cover" />
            </div>
            <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 bg-red-500 rounded-full w-5 h-5 flex items-center justify-center">
              <Plus className="w-3 h-3 text-white" />
            </div>
          </div>

          <button onClick={handleLikeVideo} className={`flex flex-col items-center gap-1 drop-shadow-md transition-opacity ${isLiking ? 'opacity-50' : 'hover:opacity-80'}`}>
            <Heart className={`w-8 h-8 ${isVideoLiked ? 'text-red-500' : 'text-white'} ${isLiking ? 'animate-pulse' : ''}`} strokeWidth={1.5} fill={isVideoLiked ? "currentColor" : "none"}/>
            <span className="text-xs font-semibold text-white">{videoLikes}</span>
          </button>

          <button onClick={handleOpenComments} className="flex flex-col items-center gap-1 drop-shadow-md hover:opacity-80 transition-opacity">
            <MessageCircle className="w-8 h-8 text-white" strokeWidth={1.5} />
            <span className="text-xs font-semibold text-white">{clip.comment}</span>
          </button>

          <div className="flex flex-col items-center gap-1 drop-shadow-md">
            <div className="bg-white/10 p-1.5 rounded-full backdrop-blur-sm">
              <Bookmark className="w-6 h-6 text-white fill-white/20" strokeWidth={1.5} />
            </div>
            <span className="text-xs font-semibold text-white">0</span>
          </div>

          <button onClick={() => setShowShare(true)} className="flex flex-col items-center gap-1 drop-shadow-md hover:opacity-80 transition-opacity">
            <Share2 className="w-8 h-8 text-white" strokeWidth={1.5} />
            <span className="text-xs font-semibold text-white">Share</span>
          </button>

          <div className="mt-4 animate-[spin_4s_linear_infinite]">
            <div className="w-10 h-10 rounded-full bg-gray-900 border-4 border-gray-800 flex items-center justify-center overflow-hidden">
              <Image src={(clip as any).creatorAvatar} width={24} height={24} alt="music" className="rounded-full w-6 h-6 object-cover" />
            </div>
          </div>
        </div>

        <div className="absolute bottom-0 left-0 w-[80%] p-4 z-20 pb-6">
          <div className="flex items-center gap-2 mb-2">
            <h3 className="text-white font-bold text-base shadow-black drop-shadow-md">@{(clip as any).creator.replace(' ', '')}</h3>
            <span className="bg-white/20 backdrop-blur-md px-2 py-0.5 rounded text-[10px] font-semibold text-white">Follow</span>
          </div>
          <p className="text-white text-sm leading-snug mb-3 drop-shadow-md">
            {clip.synopsis} <span className="font-bold ml-1">#fyp #viral</span>
          </p>
          <div className="flex items-center gap-2">
            <Music className="w-3 h-3 text-white" />
            <div className="overflow-hidden w-40">
              <p className="text-xs text-white whitespace-nowrap animate-marquee">
                Original Sound - {clip.cats} Music • {clip.name}
              </p>
            </div>
          </div>
        </div>

        {/* --- PANGGIL KOMPONEN COMMENTS MOBILE --- */}
        <ClipComments 
          showComments={showComments}
          comments={comments}
          commentsLoading={commentsLoading}
          commentInput={commentInput}
          isSubmittingComment={isSubmittingComment}
          showAllComments={showAllComments}
          onClose={() => setShowComments(false)}
          onCommentInputChange={setCommentInput}
          onSubmitComment={handleSubmitComment}
          onShowAllComments={setShowAllComments}
          onLikeComment={handleLikeComment}
          isMobile={true}
          videoOrientation={videoOrientation}
          onChangeOrientation={setVideoOrientation}
        />
      </div>

      {/* --- GLOBAL SHARE MODAL (Tampil untuk Desktop & Mobile) --- */}
      {showShare && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={() => setShowShare(false)} />
          <div className="relative w-full max-w-sm bg-[#18181b] border border-white/10 rounded-2xl shadow-2xl flex flex-col animate-in fade-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between px-6 py-4 border-b border-white/10">
              <h3 className="text-white font-semibold text-base">Bagikan ke</h3>
              <button onClick={() => setShowShare(false)} className="text-gray-400 hover:text-white transition-colors">
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <div className="p-6 relative group/share">
              <div className="flex items-start gap-5 overflow-x-auto pb-2 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:'none'] [scrollbar-width:'none']">
                
                {/* Copy */}
                <button onClick={() => handlePlatformShare('copy')} className="flex flex-col items-center gap-2 min-w-[64px] flex-shrink-0 group">
                  <div className="w-14 h-14 rounded-full bg-white/10 flex items-center justify-center group-hover:bg-white/20 transition-colors border border-white/10">
                    <Copy className="w-6 h-6 text-white" />
                  </div>
                  <span className="text-xs text-gray-300 font-medium">Copy</span>
                </button>

                {/* WhatsApp */}
                <button onClick={() => handlePlatformShare('whatsapp')} className="flex flex-col items-center gap-2 min-w-[64px] flex-shrink-0 group">
                  <div className="w-14 h-14 rounded-full bg-[#25D366]/20 flex items-center justify-center group-hover:bg-[#25D366]/30 transition-colors border border-[#25D366]/30">
                    <svg className="w-6 h-6 text-[#25D366]" viewBox="0 0 24 24" fill="currentColor"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51a12.8 12.8 0 0 0-.57-.01c-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413Z"/></svg>
                  </div>
                  <span className="text-xs text-gray-300 font-medium">WhatsApp</span>
                </button>

                {/* Facebook */}
                <button onClick={() => handlePlatformShare('facebook')} className="flex flex-col items-center gap-2 min-w-[64px] flex-shrink-0 group">
                  <div className="w-14 h-14 rounded-full bg-[#1877F2]/20 flex items-center justify-center group-hover:bg-[#1877F2]/30 transition-colors border border-[#1877F2]/30">
                    <svg className="w-6 h-6 text-[#1877F2]" viewBox="0 0 24 24" fill="currentColor"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.469h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.469h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg>
                  </div>
                  <span className="text-xs text-gray-300 font-medium">Facebook</span>
                </button>

                {/* X */}
                <button onClick={() => handlePlatformShare('x')} className="flex flex-col items-center gap-2 min-w-[64px] flex-shrink-0 group">
                  <div className="w-14 h-14 rounded-full bg-white/10 flex items-center justify-center group-hover:bg-white/20 transition-colors border border-white/10">
                    <svg className="w-5 h-5 text-white" viewBox="0 0 24 24" fill="currentColor"><path d="M18.901 1.153h3.68l-8.04 9.19L24 22.846h-7.406l-5.8-7.584-6.638 7.584H.474l8.6-9.83L0 1.154h7.594l5.243 6.932ZM17.61 20.644h2.039L6.486 3.24H4.298Z"/></svg>
                  </div>
                  <span className="text-xs text-gray-300 font-medium">X</span>
                </button>

                {/* Telegram */}
                <button onClick={() => handlePlatformShare('telegram')} className="flex flex-col items-center gap-2 min-w-[64px] flex-shrink-0 group">
                  <div className="w-14 h-14 rounded-full bg-[#0088cc]/20 flex items-center justify-center group-hover:bg-[#0088cc]/30 transition-colors border border-[#0088cc]/30">
                    <svg className="w-6 h-6 text-[#0088cc]" viewBox="0 0 24 24" fill="currentColor"><path d="M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.48.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.888-.666 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z"/></svg>
                  </div>
                  <span className="text-xs text-gray-300 font-medium">Telegram</span>
                </button>

                {/* LinkedIn */}
                <button onClick={() => handlePlatformShare('linkedin')} className="flex flex-col items-center gap-2 min-w-[64px] flex-shrink-0 group">
                  <div className="w-14 h-14 rounded-full bg-[#0A66C2]/20 flex items-center justify-center group-hover:bg-[#0A66C2]/30 transition-colors border border-[#0A66C2]/30">
                    <svg className="w-6 h-6 text-[#0A66C2]" viewBox="0 0 24 24" fill="currentColor"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/></svg>
                  </div>
                  <span className="text-xs text-gray-300 font-medium">LinkedIn</span>
                </button>

              </div>

              {/* Panah Indikator Kiri & Kanan */}
              <div className="absolute left-1 top-[40%] -translate-y-1/2 w-8 h-8 rounded-full bg-black/60 flex items-center justify-center pointer-events-none opacity-0 group-hover/share:opacity-100 transition-opacity">
                  <ChevronLeft className="w-4 h-4 text-white" />
              </div>
              <div className="absolute right-1 top-[40%] -translate-y-1/2 w-8 h-8 rounded-full bg-black/60 flex items-center justify-center pointer-events-none opacity-0 group-hover/share:opacity-100 transition-opacity">
                  <ChevronRight className="w-4 h-4 text-white" />
              </div>

            </div>
          </div>
        </div>
      )}
    </div>
  )
}

// --- KOMPONEN UTAMA ---
export default function ClipsPage() {
  const router = useRouter()
  
  const [activeCategoryId, setActiveCategoryId] = useState<string>('') 
  const [activeCategoryName, setActiveCategoryName] = useState('All Clips')
  const [categories, setCategories] = useState<any[]>([]) 
  const [apiClips, setApiClips] = useState<Movie[]>([])
  const [clipsLoading, setClipsLoading] = useState(true)
  const [activeVideoId, setActiveVideoId] = useState<string | null>(null)
  const [currentPage, setCurrentPage] = useState(1)
  const [hasMore, setHasMore] = useState(true)

  const fetchingRef = useRef(false) 

  useEffect(() => {
    const fetchCategories = async (token: string) => {
      try {
        const response = await fetch('/api/categories', {
          headers: { Authorization: `Bearer ${token}` }
        })
        const data = await response.json()
        
        if (data.status === true && data.category) {
          const allClipsCategory = {
            id: '',
            name: 'All Clips',
            images_url: '/images/icon/clippp.png' 
          }
          setCategories([allClipsCategory, ...data.category])
        }
      } catch (error) {
        console.error('[v0] Error fetching categories:', error)
      }
    }

    const token = localStorage.getItem('user_token')
    if (token) {
      fetchCategories(token)
    }
  }, [])

  useEffect(() => {
    const token = localStorage.getItem('user_token')
    if (!token) {
      router.push('/')
      return
    }
    fetchMovies(token, currentPage, activeCategoryId)
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [router, currentPage, activeCategoryId])

  const fetchMovies = async (token: string, page: number, categoryId: string) => {
    if (fetchingRef.current || (!hasMore && page !== 1)) return
    
    fetchingRef.current = true
    if (page === 1) setClipsLoading(true)

    try {
      const params = new URLSearchParams({
        sort: 'latest',
        id_category: categoryId, 
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
        const storedLikes = JSON.parse(localStorage.getItem('liked_videos') || '[]')
        
        const mappedData = data.list.map((clip: Movie) => ({
          ...clip,
          isLiked: storedLikes.includes(clip.id)
        }))

        if (page === 1) {
          setApiClips(mappedData)
        } else {
          setApiClips((prev) => {
            const existingIds = new Set(prev.map((c) => c.id))
            const newClips = mappedData.filter((c: Movie) => !existingIds.has(c.id))
            return [...prev, ...newClips]
          })
        }

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

  const handleCategoryClick = (categoryId: string, categoryName: string) => {
    if (activeCategoryId === categoryId) return

    setActiveCategoryId(categoryId)
    setActiveCategoryName(categoryName)
    setApiClips([])
    setCurrentPage(1)
    setHasMore(true)
    setActiveVideoId(null)
  }

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
              {categories.length > 0 ? (
                categories.map((category) => (
                  <button
                    key={category.name}
                    onClick={() => handleCategoryClick(category.id, category.name)}
                    className={`w-full flex items-center gap-4 px-4 py-3 rounded-lg transition-all ${
                      activeCategoryId === category.id
                        ? 'bg-white/10 text-white border border-white/20'
                        : 'text-gray-400 hover:text-white hover:bg-white/5'
                    }`}
                  >
                    <Image 
                      src={category.images_url} 
                      alt={category.name} 
                      width={24} 
                      height={24} 
                      className="w-6 h-6 flex-shrink-0 object-cover rounded-md bg-white/5" 
                    />
                    <span className="text-sm font-medium">{category.name}</span>
                  </button>
                ))
              ) : (
                <div className="text-center text-gray-500 text-sm mt-10 animate-pulse">
                  Loading categories...
                </div>
              )}
            </div>
          </div>

          {/* Main content */}
          <div className="flex-1 overflow-hidden relative">
            {clipsLoading && apiClips.length === 0 ? (
              <div className="w-full h-full flex items-center justify-center bg-black">
                <div className="text-center">
                  <div className="w-12 h-12 border-4 border-white/20 border-t-white rounded-full animate-spin mx-auto mb-4" />
                  <p className="text-gray-400 text-sm">Loading {activeCategoryName} clips...</p>
                </div>
              </div>
            ) : apiClips.length > 0 ? (
              <div className="snap-y snap-mandatory overflow-y-scroll h-full scroll-smooth [&::-webkit-scrollbar]:hidden [-ms-overflow-style:'none'] [scrollbar-width:'none']">
             {apiClips.map((clip: any, index) => {
                  const creatorName = clip.customer?.name || 'Unknown Creator'
                  const creatorAvatarUrl = clip.customer?.avatar_url || 'https://api.dicebear.com/7.x/avataaars/svg?seed=Creator'

                  const transformedClip = {
                    id: clip.id,
                    name: clip.name,
                    video_url: clip.video_url,
                    image_url: clip.image_url,
                    synopsis: clip.synopsis || '',
                    creator: clip.creator.name ||'',
                    creatorAvatar: clip.creator.avatar_url || creatorAvatarUrl,
                    cats: clip.cats || 'Video Clip',
                    favorit: clip.favorit || '0',
                    comment: clip.comment || '0',
                    isLiked: clip.isLiked || false, 
                  }
                  
                  const isNearEnd = index === apiClips.length - 2;

                  return (
                    <VideoItem
                      key={clip.id}
                      clip={transformedClip as any}
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
                <p className="text-gray-400">No {activeCategoryName} clips found</p>
              </div>
            )}
          </div>
        </div>
      </main>
    </>
  )
}