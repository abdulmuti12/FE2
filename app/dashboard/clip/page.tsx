'use client'

import Image from 'next/image'
import { useState, useRef, useEffect } from 'react'
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

const mockClips = [
  {
    id: 1,
    title: 'Cinematic AI Masterpiece',
    video: '/video/clips/1.mp4',
    description:
      'Watch groundbreaking films crafted by human creativity and artificial intelligence. #AI #Future',
    creator: 'Alex Creator',
    creatorAvatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Alex',
    genre: 'Sci-Fi',
    likes: '12.5K',
    comments: '450',
    shares: '1.2K',
    saves: '305',
  },
  {
    id: 2,
    title: 'Fantasy World',
    video: '/video/clips/2.mp4',
    description: 'Exploring the depths of generative AI landscapes. #Fantasy #Art',
    creator: 'Sarah Studio',
    creatorAvatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Sarah',
    genre: 'Fantasy',
    likes: '8.2K',
    comments: '210',
    shares: '800',
    saves: '150',
  },
  {
    id: 3,
    title: 'Cyberpunk City',
    video: '/video/clips/3.mp4',
    description: 'Neon lights and future vibes created with precision. #Cyberpunk',
    creator: 'Neo Vision',
    creatorAvatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Neo',
    genre: 'Cyberpunk',
    likes: '15K',
    comments: '900',
    shares: '2.5K',
    saves: '500',
  },
]

// --- MOCK COMMENTS DATA ---
const mockComments = [
  {
    id: 1,
    author: 'freetheeartist',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=freetheeartist',
    text: '[Comment] Lorem ipsum dolor sit amet consectetur. Volutpat fusce in adipiscing amet et et',
    timestamp: '2 hours ago',
    likes: 12,
  },
  {
    id: 2,
    author: 'freetheeartist',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=freetheeartist2',
    text: '[Comment] Lorem ipsum dolor sit amet consectetur. Volutpat fusce in adipiscing amet et et',
    timestamp: '1 hour ago',
    likes: 8,
  },
  {
    id: 3,
    author: 'freetheeartist',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=freetheeartist3',
    text: '[Comment] Lorem ipsum dolor sit amet consectetur. Volutpat fusce in adipiscing amet et et',
    timestamp: '45 min ago',
    likes: 5,
  },
]

// --- KOMPONEN ITEM VIDEO ---
const VideoItem = ({ clip, index, total }: { clip: any; index: number; total: number }) => {
  const videoRef = useRef<HTMLVideoElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)

  const [isPlaying, setIsPlaying] = useState(false)
  // Default false = Audio nyala (akan dicoba autoplay, lalu fallback ke mute jika diblokir browser)
  const [isMuted, setIsMuted] = useState(false)
  const [showComments, setShowComments] = useState(false)
  const [showShare, setShowShare] = useState(false)

  // Toggle Play/Pause
  const togglePlay = () => {
    if (!videoRef.current) return
    if (isPlaying) {
      videoRef.current.pause()
      setIsPlaying(false)
    } else {
      videoRef.current.play()
      setIsPlaying(true)
    }
  }

  // Toggle Mute
  const toggleMute = (e: React.MouseEvent) => {
    e.stopPropagation()
    setIsMuted((prev) => !prev)
  }

  // Share Handler
  const handleShare = (platform: string) => {
    const url = window.location.href
    const title = clip.title

    switch (platform) {
      case 'copy':
        navigator.clipboard.writeText(url)
        alert('Link copied to clipboard!')
        break
      case 'whatsapp':
        window.open(`https://wa.me/?text=${encodeURIComponent(title + ' ' + url)}`, '_blank')
        break
      case 'facebook':
        window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`, '_blank')
        break
      case 'twitter':
        window.open(
          `https://twitter.com/intent/tweet?url=${encodeURIComponent(url)}&text=${encodeURIComponent(title)}`,
          '_blank'
        )
        break
      case 'telegram':
        window.open(`https://t.me/share/url?url=${encodeURIComponent(url)}&text=${encodeURIComponent(title)}`, '_blank')
        break
      case 'linkedin':
        window.open(`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`, '_blank')
        break
      case 'link':
        navigator.clipboard.writeText(url)
        alert('Link copied to clipboard!')
        break
      default:
        break
    }

    setShowShare(false)
  }

  // Autoplay by scroll
  useEffect(() => {
    const options = {
      root: null,
      rootMargin: '0px',
      threshold: 0.6,
    }

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const playPromise = videoRef.current?.play()
          if (playPromise !== undefined) {
            playPromise
              .then(() => setIsPlaying(true))
              .catch((error) => {
                console.log('Autoplay with sound blocked. Muting to play.', error)
                if (videoRef.current) {
                  videoRef.current.muted = true
                  setIsMuted(true)
                  videoRef.current.play()
                }
              })
          }
        } else {
          if (videoRef.current) {
            videoRef.current.pause()
            videoRef.current.currentTime = 0
          }
          setIsPlaying(false)
        }
      })
    }, options)

    if (containerRef.current) observer.observe(containerRef.current)

    return () => {
      if (containerRef.current) observer.unobserve(containerRef.current)
    }
  }, [])

  return (
    <div ref={containerRef} className="w-full h-full snap-start flex items-center justify-center lg:p-8 relative">
      {/* Navigasi kecil desktop */}
      <div className="hidden lg:flex absolute right-8 top-1/2 -translate-y-1/2 flex-col gap-96 pointer-events-none opacity-20 z-50">
        {index > 0 && <ChevronUp className="w-10 h-10 animate-bounce" />}
        {index < total - 1 && <ChevronDown className="w-10 h-10 animate-bounce" />}
      </div>

      {/* --- DESKTOP LAYOUT --- */}
      <div className="hidden lg:grid grid-cols-12 gap-8 items-center w-full max-w-6xl h-full">
        {/* Kolom kiri: info */}
        <div className="col-span-3 flex flex-col justify-center space-y-6 animate-in slide-in-from-left duration-700 fade-in mt-24">
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
        <div className="col-span-6 h-full flex items-center justify-center px-4 py-4">
          <div className="relative w-full h-full max-h-[85vh] aspect-[9/16] rounded-3xl overflow-hidden border border-white/10 shadow-[0_0_50px_-12px_rgba(0,0,0,0.5)] group bg-black">
            <video
              ref={videoRef}
              src={clip.video}
              className="w-full h-full object-cover cursor-pointer"
              muted={isMuted}
              loop
              autoPlay
              playsInline
              onClick={togglePlay}
            />

            {/* tombol mute desktop */}
            <button
              onClick={toggleMute}
              className="absolute top-4 right-4 z-20 bg-black/40 backdrop-blur-md p-2.5 rounded-full text-white hover:bg-black/60 transition-all border border-white/10"
            >
              {isMuted ? <VolumeX className="w-5 h-5" /> : <Volume2 className="w-5 h-5" />}
            </button>

            {/* play overlay */}
            {!isPlaying && (
              <div className="absolute inset-0 flex items-center justify-center bg-black/20 cursor-pointer" onClick={togglePlay}>
                <div className="w-20 h-20 bg-white/20 backdrop-blur-md rounded-full flex items-center justify-center border border-white/30 hover:scale-110 transition-transform">
                  <Play className="w-8 h-8 text-white fill-white ml-1" />
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Kolom kanan: actions */}
        <div className="col-span-3 flex flex-col justify-center gap-8 pl-8 animate-in slide-in-from-right duration-700 fade-in">
          {[
            { icon: Heart, label: clip.likes, action: null },
            { icon: MessageCircle, label: clip.comments, action: 'comments' },
            { icon: Plus, label: 'Add', action: null },
            { icon: Share2, label: clip.shares, action: 'share' },
          ].map((btn, idx) => (
            <div
              key={idx}
              onClick={() => {
                if (btn.action === 'comments') setShowComments(!showComments)
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
              <span className="text-base font-medium text-gray-300 group-hover:text-white">{btn.label}</span>
            </div>
          ))}
        </div>

        {/* Comments Panel desktop */}
        {showComments && (
          <div className="col-span-12 lg:col-span-3 lg:absolute lg:right-0 lg:top-0 lg:bottom-0 lg:w-80 bg-black/95 backdrop-blur border-l border-white/10 flex flex-col h-full z-50 rounded-tl-2xl rounded-bl-2xl">
            <div className="flex items-center justify-between px-5 py-4 border-b border-white/10">
              <h3 className="text-white font-bold text-lg">Comment</h3>
              <button onClick={() => setShowComments(false)} className="text-gray-400 hover:text-white transition-colors">
                ✕
              </button>
            </div>

            <div className="flex-1 overflow-y-auto py-4 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:'none'] [scrollbar-width:'none']">
              <div className="space-y-4 px-4">
                {mockComments.map((comment) => (
                  <div key={comment.id} className="flex gap-3">
                    <Image src={comment.avatar} alt={comment.author} width={40} height={40} className="w-8 h-8 rounded-full flex-shrink-0" />
                    <div className="flex-1 min-w-0">
                      <p className="text-white text-sm font-semibold">{comment.author}</p>
                      <p className="text-gray-300 text-xs mt-1 leading-relaxed break-words">{comment.text}</p>
                      <div className="flex items-center gap-3 mt-2">
                        <span className="text-gray-500 text-xs">{comment.timestamp}</span>
                        <button className="text-gray-500 hover:text-red-500 transition-colors">
                          <Heart className="w-3 h-3" strokeWidth={2} />
                        </button>
                        <span className="text-gray-500 text-xs">{comment.likes}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="border-t border-white/10 px-4 py-3">
              <input
                type="text"
                placeholder="Write a comment..."
                className="w-full bg-white/10 border border-white/20 rounded-lg px-3 py-2 text-white placeholder-gray-500 text-sm focus:outline-none focus:border-white/40 transition-colors"
              />
            </div>
          </div>
        )}
      </div>

      {/* --- MOBILE LAYOUT (TIKTOK STYLE) --- */}
      <div className="lg:hidden w-full h-full relative bg-black">
        <video
          ref={(el) => {
            if (typeof window !== 'undefined' && window.innerWidth < 1024) videoRef.current = el
          }}
          src={clip.video}
          className="w-full h-full object-cover"
          muted={isMuted}
          loop
          autoPlay
          playsInline
          onClick={togglePlay}
        />

        {/* tombol mute mobile */}
        <button
          onClick={toggleMute}
          className="absolute top-20 right-4 z-30 bg-black/20 backdrop-blur-sm p-2 rounded-full text-white/80 border border-white/10"
        >
          {isMuted ? <VolumeX className="w-6 h-6" /> : <Volume2 className="w-6 h-6" />}
        </button>

        {/* play overlay */}
        {!isPlaying && (
          <div className="absolute inset-0 flex items-center justify-center z-10" onClick={togglePlay}>
            <div className="w-16 h-16 bg-black/40 rounded-full flex items-center justify-center backdrop-blur-sm">
              <Play className="w-8 h-8 text-white fill-white ml-1" />
            </div>
          </div>
        )}

        <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-transparent to-black/90 pointer-events-none" />

        {/* right actions mobile */}
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
            onClick={() => setShowComments(!showComments)}
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

        {/* bottom info */}
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
                <h3 className="text-white font-semibold text-base">Comment</h3>
                <button onClick={() => setShowComments(false)} className="text-gray-400 hover:text-white transition-colors text-xl">
                  ✕
                </button>
              </div>

              <div className="flex-1 overflow-y-auto [&::-webkit-scrollbar]:hidden [-ms-overflow-style:'none'] [scrollbar-width:'none']">
                <div className="space-y-5 px-6 py-5">
                  {mockComments.map((comment) => (
                    <div key={comment.id} className="flex gap-3 pb-4 border-b border-white/5 last:border-b-0">
                      <Image src={comment.avatar} alt={comment.author} width={40} height={40} className="w-10 h-10 rounded-full flex-shrink-0" />
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <p className="text-white text-sm font-medium">{comment.author}</p>
                          <span className="text-gray-500 text-xs">{comment.timestamp}</span>
                        </div>
                        <p className="text-gray-300 text-xs mt-2 leading-relaxed break-words">{comment.text}</p>
                        <button className="text-gray-500 hover:text-red-500 transition-colors mt-2 flex items-center gap-1">
                          <Heart className="w-4 h-4" strokeWidth={2} fill="none" />
                          <span className="text-xs">{comment.likes}</span>
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="border-t border-white/10 px-6 py-4 flex-shrink-0 bg-[#1a1a2e]">
                <input
                  type="text"
                  placeholder="Write a comment..."
                  className="w-full bg-transparent border-0 border-b border-white/20 px-0 py-2 text-white placeholder-gray-600 text-sm focus:outline-none focus:border-white/40 transition-colors"
                />
              </div>
            </div>
          </div>
        )}
      </div>

      {/* ========================= */}
      {/* SHARE MODAL (RESPONSIVE)  */}
      {/* WEB: center modal         */}
      {/* MOBILE: bottom sheet      */}
      {/* ========================= */}
      {showShare && (
        <div className="fixed inset-0 z-[999]">
          {/* Backdrop */}
          <button
            aria-label="Close share modal"
            className="absolute inset-0 bg-black/55 backdrop-blur-[1px]"
            onClick={() => setShowShare(false)}
          />

          {/* Wrapper (mobile bottom, desktop center) */}
          <div
            className="
              absolute left-1/2 w-[92%] -translate-x-1/2
              bottom-0
              lg:bottom-auto lg:top-1/2 lg:-translate-y-1/2
              lg:max-w-[560px]
            "
          >
            <div className="bg-[#0b1220]/95 border border-white/10 shadow-2xl overflow-hidden rounded-t-3xl lg:rounded-2xl">
              {/* Mobile handle */}
              <div className="lg:hidden px-4 pt-3">
                <div className="mx-auto h-1 w-10 rounded-full bg-white/20" />
              </div>

              {/* Header */}
              <div className="flex items-center justify-between px-5 py-4 border-b border-white/10">
                <h2 className="text-white font-semibold text-sm">Bagikan ke</h2>
                <button
                  onClick={() => setShowShare(false)}
                  className="text-gray-400 hover:text-white transition-colors"
                  aria-label="Close"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Options */}
              <div className="px-5 py-5">
                <div className="flex items-center justify-center gap-4 flex-wrap">
                  <button
                    onClick={() => handleShare('copy')}
                    className="flex flex-col items-center gap-2 hover:opacity-90 transition-opacity group"
                  >
                    <div className="w-12 h-12 rounded-full bg-white/10 flex items-center justify-center group-hover:bg-white/20 transition-colors">
                      <Copy className="w-6 h-6 text-white" />
                    </div>
                    <span className="text-[11px] text-white/90 font-medium">Copy</span>
                  </button>

                  <button
                    onClick={() => handleShare('facebook')}
                    className="flex flex-col items-center gap-2 hover:opacity-90 transition-opacity group"
                  >
                    <div className="w-12 h-12 rounded-full bg-[#1877F2]/20 flex items-center justify-center group-hover:bg-[#1877F2]/30 transition-colors">
                      <span className="text-xl text-[#1877F2] font-bold">f</span>
                    </div>
                    <span className="text-[11px] text-white/90 font-medium">Facebook</span>
                  </button>

                  <button
                    onClick={() => handleShare('twitter')}
                    className="flex flex-col items-center gap-2 hover:opacity-90 transition-opacity group"
                  >
                    <div className="w-12 h-12 rounded-full bg-white/10 flex items-center justify-center group-hover:bg-white/20 transition-colors">
                      <span className="text-xl text-white">𝕏</span>
                    </div>
                    <span className="text-[11px] text-white/90 font-medium">X</span>
                  </button>

                  <button
                    onClick={() => handleShare('telegram')}
                    className="flex flex-col items-center gap-2 hover:opacity-90 transition-opacity group"
                  >
                    <div className="w-12 h-12 rounded-full bg-[#0088cc]/20 flex items-center justify-center group-hover:bg-[#0088cc]/30 transition-colors">
                      <span className="text-xl">✈️</span>
                    </div>
                    <span className="text-[11px] text-white/90 font-medium">Telegram</span>
                  </button>

                  <button
                    onClick={() => handleShare('linkedin')}
                    className="flex flex-col items-center gap-2 hover:opacity-90 transition-opacity group"
                  >
                    <div className="w-12 h-12 rounded-full bg-[#0A66C2]/20 flex items-center justify-center group-hover:bg-[#0A66C2]/30 transition-colors">
                      <span className="text-xl text-[#0A66C2] font-bold">in</span>
                    </div>
                    <span className="text-[11px] text-white/90 font-medium">LinkedIn</span>
                  </button>

                  <button
                    onClick={() => handleShare('link')}
                    className="flex flex-col items-center gap-2 hover:opacity-90 transition-opacity group"
                  >
                    <div className="w-12 h-12 rounded-full bg-green-500/20 flex items-center justify-center group-hover:bg-green-500/30 transition-colors">
                      <span className="text-xl">🔗</span>
                    </div>
                    <span className="text-[11px] text-white/90 font-medium">Link</span>
                  </button>
                </div>
              </div>

              {/* Mobile padding bottom biar aman dari gesture bar */}
              <div className="lg:hidden h-4" />
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

// --- KOMPONEN UTAMA ---
export default function ClipsPage() {
  const [activeCategory, setActiveCategory] = useState('All Clips')

  return (
    <div className="h-screen bg-[#020817] text-white flex flex-col font-sans overflow-hidden">
      {/* Header */}
      <div className="flex-none z-50">
        <Header />
      </div>

      <div className="flex flex-1 h-[calc(100vh-80px)]">
        {/* Desktop sidebar */}
        <aside className="hidden lg:block w-64 bg-[#020817] border-r border-white/5 px-4 py-6 h-full overflow-y-auto flex-none [&::-webkit-scrollbar]:hidden [-ms-overflow-style:'none'] [scrollbar-width:'none']">
          <h3 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-4 px-3">Categories</h3>
          <div className="space-y-1">
            {sidebarCategories.map((item) => (
              <button
                key={item.label}
                onClick={() => setActiveCategory(item.label)}
                className={`w-full flex items-center gap-3 px-3 py-3 rounded-lg transition-all duration-200 group ${
                  activeCategory === item.label ? 'bg-blue-600/10 text-blue-400' : 'text-gray-400 hover:bg-white/5 hover:text-white'
                }`}
              >
                <div className={`p-1 rounded ${activeCategory === item.label ? 'bg-blue-600/20' : 'bg-transparent'}`}>
                  <Image
                    src={item.icon}
                    alt={item.label}
                    width={20}
                    height={20}
                    className="w-5 h-5 opacity-80 group-hover:opacity-100 object-contain"
                  />
                </div>
                <span className="text-sm font-medium">{item.label}</span>
              </button>
            ))}
          </div>
        </aside>

        {/* Main feed */}
        <main className="flex-1 h-full overflow-y-scroll snap-y snap-mandatory scroll-smooth no-scrollbar relative [&::-webkit-scrollbar]:hidden [-ms-overflow-style:'none'] [scrollbar-width:'none']">
          {mockClips.map((clip, index) => (
            <VideoItem key={clip.id} clip={clip} index={index} total={mockClips.length} />
          ))}
        </main>
      </div>

      <div className="hidden">
        <Footer />
      </div>
    </div>
  )
}