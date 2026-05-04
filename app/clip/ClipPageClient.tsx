'use client'

import Image from 'next/image'
import { Suspense, useState, useRef, useEffect, useCallback, memo, lazy, useMemo } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
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
  Smartphone,
  Monitor,
} from 'lucide-react'
import { Header } from '@/components/header'

// Lazy load non-critical components (named export → wrapped as default)
const ClipComments = lazy(() => import('@/components/clip/clip-comments').then(m => ({ default: m.ClipComments })))
const ClipShare = lazy(() => import('@/components/clip/clip-share').then(m => ({ default: m.ClipShare })))

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
  isWatchlisted?: boolean 
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

type MetaTagMap = Record<string, string>

const parseMetaContent = (metaHtml: string): MetaTagMap => {
  const map: MetaTagMap = {}
  const metaTagRegex = /<meta\s+([^>]*?)\/?\s*>/gi

  let tagMatch: RegExpExecArray | null
  while ((tagMatch = metaTagRegex.exec(metaHtml)) !== null) {
    const attrs = tagMatch[1]
    const attrMap: Record<string, string> = {}
    const attrRegex = /([:\w-]+)\s*=\s*"([^"]*)"/g

    let attrMatch: RegExpExecArray | null
    while ((attrMatch = attrRegex.exec(attrs)) !== null) {
      attrMap[attrMatch[1].toLowerCase()] = attrMatch[2]
    }

    const key = attrMap.property || attrMap.name
    const value = attrMap.content

    if (key && value !== undefined) {
      map[key] = value
    }
  }

  return map
}

const toSecureUrl = (url?: string): string => {
  if (!url) return ''
  return url.replace(/^http:\/\//i, 'https://')
}

const toShareUrl = (url?: string): string => {
  if (!url) return ''
  const secureUrl = toSecureUrl(url).trim()
  if (!secureUrl) return ''
  try {
    return encodeURI(secureUrl)
  } catch {
    return secureUrl
  }
}

const upsertMetaTag = (attr: 'name' | 'property', key: string, content: string) => {
  const selector = `meta[${attr}="${key}"]`
  let tag = document.head.querySelector(selector) as HTMLMetaElement | null

  if (!tag) {
    tag = document.createElement('meta')
    tag.setAttribute(attr, key)
    document.head.appendChild(tag)
  }

  tag.setAttribute('content', content)
}

const applyClipMetaToHead = (meta: MetaTagMap) => {
  const title = meta['og:title'] || meta['twitter:title'] || 'Clip | USKY'
  const description =
    meta['og:description'] ||
    meta['twitter:description'] ||
    meta['description'] ||
    meta['Description'] ||
    meta['keywords'] ||
    ''
  const image = toShareUrl(meta['og:image'] || meta['twitter:image'] || '')
  const video = toShareUrl(meta['og:video'] || meta['twitter:url'] || '')
  const secureVideo = toShareUrl(meta['og:video:secure_url'] || video)

  document.title = title

  upsertMetaTag('name', 'description', description)
  if (description) {
    upsertMetaTag('name', 'Description', description)
  }
  if (meta['author'] || meta['Author']) {
    upsertMetaTag('name', 'Author', meta['author'] || meta['Author'] || '')
  }
  if (meta['keywords']) {
    upsertMetaTag('name', 'keywords', meta['keywords'])
  }

  upsertMetaTag('property', 'og:site_name', meta['og:site_name'] || 'USKY')
  upsertMetaTag('property', 'og:title', title)
  upsertMetaTag('property', 'og:description', description)
  if (image) upsertMetaTag('property', 'og:image', image)
  if (video) upsertMetaTag('property', 'og:video', video)
  if (secureVideo) upsertMetaTag('property', 'og:video:secure_url', secureVideo)
  if (meta['og:video:type']) upsertMetaTag('property', 'og:video:type', meta['og:video:type'])
  if (meta['og:video:width']) upsertMetaTag('property', 'og:video:width', meta['og:video:width'])
  if (meta['og:video:height']) upsertMetaTag('property', 'og:video:height', meta['og:video:height'])

  upsertMetaTag('name', 'twitter:card', image ? 'summary_large_image' : (meta['twitter:card'] || 'summary'))
  upsertMetaTag('name', 'twitter:site', meta['twitter:site'] || '@usky')
  upsertMetaTag('name', 'twitter:title', title)
  upsertMetaTag('name', 'twitter:description', description)
  if (image) upsertMetaTag('name', 'twitter:image', image)
  if (video) upsertMetaTag('name', 'twitter:url', video)
}

// --- KOMPONEN ITEM VIDEO ---
const VideoItem = memo(function VideoItem({
  clip,
  index,
  total,
  isActive,
  onActive,
  isNearEnd,
  onNearEnd,
  videoOrientation,
  setVideoOrientation,
}: {
  clip: Movie
  index: number
  total: number
  isActive: boolean
  onActive: () => void
  isNearEnd?: boolean
  onNearEnd?: () => void
  videoOrientation: 'portrait' | 'landscape'
  setVideoOrientation: (o: 'portrait' | 'landscape') => void
}) {
  const desktopVideoRef = useRef<HTMLVideoElement>(null)
  const mobileVideoRef = useRef<HTMLVideoElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)

  const [isPlaying, setIsPlaying] = useState(false)
  // Default isMuted adalah FALSE agar suara langsung nyala
  const [isMuted, setIsMuted] = useState(false)
  
  const [showComments, setShowComments] = useState(false)
  const [showShare, setShowShare] = useState(false)
  const [showShareToast, setShowShareToast] = useState(false)
  const [shareToastMessage, setShareToastMessage] = useState('Link berhasil disalin!')
  const [comments, setComments] = useState<Comment[]>([])
  const [commentsLoading, setCommentsLoading] = useState(false)
  const [commentInput, setCommentInput] = useState('')
  const [isSubmittingComment, setIsSubmittingComment] = useState(false)
  const [showAllComments, setShowAllComments] = useState(false)
  const shareToastTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  // --- STATE UNTUK WATCHLIST ---
  const [isAddingWatchlist, setIsAddingWatchlist] = useState(false)
  const [isWatchlisted, setIsWatchlisted] = useState(clip.isWatchlisted || false)

  // --- STATE UNTUK VIDEO LIKE ---
  const [videoLikes, setVideoLikes] = useState(parseInt(clip.favorit || '0'))
  const [isVideoLiked, setIsVideoLiked] = useState(clip.isLiked || false)
  const [isLiking, setIsLiking] = useState(false)

  useEffect(() => {
    const vids = [desktopVideoRef.current, mobileVideoRef.current].filter(Boolean) as HTMLVideoElement[]

    if (isActive) {
      vids.forEach((vid) => {
        // Memastikan video mencoba untuk play tanpa di-mute
        vid.muted = false
        const playPromise = vid.play()
        
        if (playPromise !== undefined) {
          playPromise
            .then(() => {
              setIsPlaying(true)
              setIsMuted(false)
            })
            .catch((error) => {
              console.log('Autoplay with sound blocked by browser.', error)
              // Jika browser menolak autoplay dengan suara, kita biarkan video pause (tidak memaksa mute)
              // Pengguna hanya perlu tap sekali dan video akan main beserta suaranya
              setIsPlaying(false)
              setIsMuted(false) 
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

  useEffect(() => {
    return () => {
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

  // --- FUNGSI ADD TO WATCHLIST ---
  const handleAddToWatchlist = async (e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    if (isAddingWatchlist) return;

    try {
      setIsAddingWatchlist(true);
      const token = localStorage.getItem('user_token');
      if (!token) return;

      const newWatchlistState = !isWatchlisted;
      const storedWatchlists = JSON.parse(localStorage.getItem('watchlisted_videos') || '[]');

      setIsWatchlisted(newWatchlistState);

      if (newWatchlistState) {
        localStorage.setItem('watchlisted_videos', JSON.stringify([...new Set([...storedWatchlists, clip.id])]));
      } else {
        localStorage.setItem('watchlisted_videos', JSON.stringify(storedWatchlists.filter((id: string) => id !== clip.id)));
      }

      const response = await fetch('/api/watchlist', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ id: clip.id }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      
      if (data.status !== true) {
        setIsWatchlisted(!newWatchlistState); 
        if (!newWatchlistState) {
          localStorage.setItem('watchlisted_videos', JSON.stringify([...new Set([...storedWatchlists, clip.id])]));
        } else {
          localStorage.setItem('watchlisted_videos', JSON.stringify(storedWatchlists.filter((id: string) => id !== clip.id)));
        }
      }

    } catch (error) {
      console.error('[v0] Error adding to watchlist:', error);
      const newWatchlistState = !isWatchlisted;
      const storedWatchlists = JSON.parse(localStorage.getItem('watchlisted_videos') || '[]');
      setIsWatchlisted(!newWatchlistState); 
      if (!newWatchlistState) {
        localStorage.setItem('watchlisted_videos', JSON.stringify([...new Set([...storedWatchlists, clip.id])]));
      } else {
        localStorage.setItem('watchlisted_videos', JSON.stringify(storedWatchlists.filter((id: string) => id !== clip.id)));
      }
    } finally {
      setIsAddingWatchlist(false);
    }
  };

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

  // --- FUNGSI SHARE DENGAN HIT API PROXY SETELAH CLICK PLATFORM ---
  const handlePlatformShare = async (platform: string) => {
    try {
      const token = localStorage.getItem('user_token')
      const shareUrl = encodeURIComponent(`${window.location.origin}/clip?id=${clip.id}`)
      const shareText = encodeURIComponent(`Tonton video keren ini: ${clip.name}`)

      switch (platform) {
        case 'copy':
          try {
            await navigator.clipboard.writeText(`${window.location.origin}/clip?id=${clip.id}`)
            showShareToastCard('Link berhasil disalin!')
          } catch {
            showShareToastCard('Gagal menyalin link')
          }
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
      
      // Hit API Proxy share di background SETELAH action platform dilakukan
      if (token) {
        fetch('/api/share', {
          method: 'POST',
          headers: { 
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json' 
          },
          body: JSON.stringify({ id: clip.id })
        })
        .catch(() => {})
      }

      setShowShare(false)
    } catch (error) {
      console.error('[v0] Error sharing platform:', error)
    }
  }

  return (
    <div
      ref={containerRef}
      id={`clip-${clip.id}`}
      data-clip-id={clip.id}
      className="w-full h-full snap-start flex items-center justify-center lg:px-8 relative"
    >
      
      {/* Navigasi kecil desktop */}
      <div className="hidden lg:flex absolute right-8 top-1/2 -translate-y-1/2 flex-col gap-96 pointer-events-none opacity-20 z-50">
        {index > 0 && <ChevronUp className="w-10 h-10 animate-bounce" />}
        {index < total - 1 && <ChevronDown className="w-10 h-10 animate-bounce" />}
      </div>

      {/* --- DESKTOP LAYOUT --- */}
      <div className={`hidden lg:grid grid-cols-12 gap-6 items-center w-full transition-all duration-500 h-full ${showComments ? 'max-w-[1400px]' : 'max-w-6xl'}`}>
        
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
          <div className={`relative flex items-center justify-center h-full max-h-full ${videoOrientation === 'portrait' ? 'aspect-[9/16] w-auto' : 'aspect-video w-full'} rounded-3xl overflow-hidden border border-white/10 shadow-[0_0_50px_-12px_rgba(0,0,0,0.5)] group bg-black transition-all duration-500`}>
            
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
        <div className={`${showComments ? 'col-span-1 items-center justify-end pb-8 pl-0' : 'col-span-3 pl-8 justify-center'} flex flex-col gap-8 h-full animate-in slide-in-from-right duration-700 fade-in transition-all duration-500`}>
          
          <div onClick={handleLikeVideo} className={`flex items-center gap-4 group ${isLiking ? 'cursor-not-allowed opacity-80' : 'cursor-pointer'}`}>
            <div className={`w-14 h-14 rounded-full flex items-center justify-center backdrop-blur border border-white/10 group-hover:scale-110 transition-all shadow-lg ${isVideoLiked ? 'bg-white/10' : 'bg-[#1e293b]/80 group-hover:bg-white/10'}`}>
              <Heart className={`w-6 h-6 ${isVideoLiked ? 'text-red-500' : 'text-white group-hover:text-red-500'} ${isLiking ? 'animate-pulse' : ''}`} fill={isVideoLiked ? "currentColor" : "none"}/>
            </div>
            <span className={`text-base font-medium text-gray-300 group-hover:text-white ${showComments ? 'hidden' : 'block'}`}>{videoLikes}</span>
          </div>

          {[
            { icon: MessageCircle, label: clip.comment, action: 'comments' },
            { icon: Plus, label: 'Add', action: 'watchlist' },
            { icon: Share2, label: 'Share', action: 'share' },
          ].map((btn, idx) => (
            <div
              key={idx}
              onClick={(e) => {
                if (btn.action === 'comments') handleOpenComments()
                if (btn.action === 'share') setShowShare(true)
                if (btn.action === 'watchlist') handleAddToWatchlist(e)
              }}
              className={`flex items-center gap-4 group cursor-pointer ${isAddingWatchlist && btn.action === 'watchlist' ? 'opacity-50 pointer-events-none' : ''}`}
            >
              <div className={`w-14 h-14 rounded-full flex items-center justify-center bg-[#1e293b]/80 backdrop-blur border border-white/10 group-hover:bg-white/10 group-hover:scale-110 transition-all shadow-lg ${showComments && btn.action === 'comments' ? 'bg-white/20' : ''}`}>
                <btn.icon className={`w-6 h-6 ${btn.action === 'watchlist' && isWatchlisted ? 'text-red-500' : 'text-white'} ${isAddingWatchlist && btn.action === 'watchlist' ? 'animate-pulse' : ''}`} />
              </div>
              <span className={`text-base font-medium text-gray-300 group-hover:text-white ${showComments ? 'hidden' : 'block'}`}>{btn.label}</span>
            </div>
          ))}
        </div>

        {/* --- PANGGIL KOMPONEN COMMENTS DESKTOP --- */}
        <Suspense fallback={null}>
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
        </Suspense>

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

        <div className="absolute right-2 bottom-32 flex flex-col items-center gap-5 z-20 pb-4">
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

          <div 
            onClick={handleAddToWatchlist} 
            className={`flex flex-col items-center gap-1 drop-shadow-md cursor-pointer transition-opacity ${isAddingWatchlist ? 'opacity-50 pointer-events-none' : 'hover:opacity-80'}`}
          >
            <div className="bg-white/10 p-1.5 rounded-full backdrop-blur-sm">
              <Bookmark className={`w-6 h-6 ${isWatchlisted ? 'text-red-500 fill-red-500' : 'text-white fill-white/20'} ${isAddingWatchlist ? 'animate-pulse' : ''}`} strokeWidth={1.5} />
            </div>
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

        <div className="absolute bottom-24 left-0 w-[75%] px-4 z-20 pb-4">
          <div className="flex items-center gap-2 mb-2">
            <h3 className="text-white font-bold text-base shadow-black drop-shadow-md">@{(clip as any).creator.replace(' ', '')}</h3>
            <span className="bg-white/20 backdrop-blur-md px-2 py-0.5 rounded text-[10px] font-semibold text-white">Follow</span>
          </div>
          
          {/* DIUBAH: Menghilangkan 'line-clamp-2' dan menggantinya dengan max-height yang bisa discroll jika teksnya sangat panjang */}
          <div className="max-h-[140px] overflow-y-auto mb-3 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:'none'] [scrollbar-width:'none']">
            <p className="text-white text-sm leading-snug drop-shadow-md">
              {clip.synopsis} <span className="font-bold ml-1 block mt-1">#fyp #viral</span>
            </p>
          </div>

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
        <Suspense fallback={null}>
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
        </Suspense>
      </div>

      {/* --- GLOBAL SHARE MODAL (Tampil untuk Desktop & Mobile) --- */}
      <Suspense fallback={null}>
        <ClipShare
          showShare={showShare}
          clipId={clip.id}
          clipName={clip.name}
          onClose={() => setShowShare(false)}
          onPlatformShare={handlePlatformShare}
        />
      </Suspense>

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
})

// --- KOMPONEN UTAMA ---
function ClipsContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const initialClipId = searchParams.get('id') || ''
  const initialCategoryId = searchParams.get('category') || ''
  
  const [activeCategoryId, setActiveCategoryId] = useState<string>(initialCategoryId) 
  const [activeCategoryName, setActiveCategoryName] = useState('All Clips')
  const [categories, setCategories] = useState<any[]>([]) 
  const [apiClips, setApiClips] = useState<Movie[]>([])
  const [clipsLoading, setClipsLoading] = useState(true)
  const [activeVideoId, setActiveVideoId] = useState<string | null>(null)
  const [currentPage, setCurrentPage] = useState(1)
  const [hasMore, setHasMore] = useState(true)
  const [pendingClipId, setPendingClipId] = useState<string | null>(initialClipId || null)
  const [videoOrientation, setVideoOrientation] = useState<'portrait' | 'landscape'>('portrait')

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
          const nextCategories = [allClipsCategory, ...data.category]
          setCategories(nextCategories)

          if (initialCategoryId) {
            const matched = nextCategories.find((category: any) => category.id === initialCategoryId)
            if (matched) {
              setActiveCategoryName(matched.name)
            }
          }
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
      router.push('/login?redirect=/clip')
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
        const storedWatchlists = JSON.parse(localStorage.getItem('watchlisted_videos') || '[]')
        
        const mappedData = data.list.map((clip: Movie) => ({
          ...clip,
          isLiked: storedLikes.includes(clip.id),
          isWatchlisted: storedWatchlists.includes(clip.id)
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
    setPendingClipId(null)
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

  useEffect(() => {
    if (!pendingClipId) return

    const found = apiClips.some((clip) => clip.id === pendingClipId)
    if (found) {
      setActiveVideoId(pendingClipId)

      const targetClipId = pendingClipId
      setTimeout(() => {
        const targetEl = document.getElementById(`clip-${targetClipId}`)
        targetEl?.scrollIntoView({ behavior: 'smooth', block: 'start' })
      }, 120)

      setPendingClipId(null)
      return
    }

    if (!clipsLoading && !fetchingRef.current && hasMore) {
      setCurrentPage((prev) => prev + 1)
    }
  }, [pendingClipId, apiClips, hasMore, clipsLoading])

  useEffect(() => {
    if (activeVideoId || pendingClipId || apiClips.length === 0) return
    setActiveVideoId(apiClips[0].id)
  }, [activeVideoId, pendingClipId, apiClips])

  // Deferred metadata fetch — doesn't block initial paint
  const fetchedMetaRef = useRef<Set<string>>(new Set())
  useEffect(() => {
    if (!activeVideoId) return
    if (fetchedMetaRef.current.has(activeVideoId)) return

    const timer = setTimeout(async () => {
      try {
        const response = await fetch(`/api/movie/meta?id=${encodeURIComponent(activeVideoId)}`, {
          method: 'GET',
          cache: 'no-store',
        })
        const json = await response.json()
        if (json?.status === true && typeof json?.data === 'string') {
          applyClipMetaToHead(parseMetaContent(json.data))
          fetchedMetaRef.current.add(activeVideoId)
        }
      } catch (error) {
        console.error('[clip/meta] Error fetching clip metadata:', error)
      }
    }, 600)

    return () => clearTimeout(timer)
  }, [activeVideoId])

  return (
    <>
      <Header />
      <main className="min-h-screen bg-black pt-16 lg:pt-[64px]">
        <div className="flex h-[calc(100dvh-64px)]">
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
          <div className="flex-1 overflow-hidden relative h-full">
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
                    creator: clip.creator?.name ||'',
                    creatorAvatar: clip.creator?.avatar_url || creatorAvatarUrl,
                    cats: clip.cats || 'Video Clip',
                    favorit: clip.favorit || '0',
                    comment: clip.comment || '0',
                    isLiked: clip.isLiked || false, 
                    isWatchlisted: clip.isWatchlisted || false, 
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
                      videoOrientation={videoOrientation}
                      setVideoOrientation={setVideoOrientation}
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

export default function ClipsPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-black flex items-center justify-center">
          <div className="w-10 h-10 border-4 border-white/20 border-t-white rounded-full animate-spin" />
        </div>
      }
    >
      <ClipsContent />
    </Suspense>
  )
}
