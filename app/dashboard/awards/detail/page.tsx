'use client'

import { Suspense, useEffect, useRef, useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { useSearchParams } from 'next/navigation'
import { Header } from '@/components/header'
import { Footer } from '@/components/footer'
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
  image_url?: string
  image_landscape_url?: string
  video_url?: string
  relate?: RelatedAward[]
}

const convertToSecureUrl = (url: string | null | undefined): string => {
  if (!url) return ''
  return url.replace('http://', 'https://')
}

// Dummy data untuk komentar (Menyesuaikan dengan gambar)
const DUMMY_COMMENTS = [
  { id: 1, user: 'fredthegreat', date: '09/05/2025', text: '[Comment] Lorem ipsum dolor sit amet consectetur...' },
  { id: 2, user: 'fredthegreat', date: '09/05/2025', text: '[Comment] Lorem ipsum dolor sit amet consectetur...' },
  { id: 3, user: 'fredthegreat', date: '09/05/2025', text: '[Comment] Lorem ipsum dolor sit amet consectetur...' },
  { id: 4, user: 'fredthegreat', date: '09/05/2025', text: '[Comment] Lorem ipsum dolor sit amet consectetur...' },
]

function AwardsDetailContent() {
  const searchParams = useSearchParams()
  const awardId = searchParams.get('id')

  const [awardData, setAwardData] = useState<AwardDetailData | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const relatedScrollerRef = useRef<HTMLDivElement | null>(null)
  const [relatedIndex, setRelatedIndex] = useState(0)

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

        const result = await response.json()

        if (response.ok && result.status === true && result.list) {
          setAwardData(result.list)
        } else {
          setError(result.message || 'Gagal mengambil detail award')
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

  useEffect(() => {
    setRelatedIndex(0)
  }, [awardId])

  const handleShare = async () => {
    const url = window.location.href
    try {
      await navigator.clipboard.writeText(url)
      alert('Link copied to clipboard!')
    } catch {
      alert('Gagal menyalin link')
    }
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
          <div className="w-full lg:w-1/3 xl:w-[30%] bg-[#12161E] border border-white/5 rounded-xl p-5 md:p-6 flex flex-col">
            <h2 className="text-lg font-bold mb-4">Comment</h2>
            
            {/* Comment List */}
            <div className="flex-1 overflow-y-auto max-h-[250px] md:max-h-[350px] pr-2 space-y-4 [&::-webkit-scrollbar]:w-1.5 [&::-webkit-scrollbar-thumb]:bg-white/20 [&::-webkit-scrollbar-track]:bg-transparent">
              {DUMMY_COMMENTS.map((comment) => (
                <div key={comment.id} className="flex gap-3">
                  <div className="w-8 h-8 rounded-full bg-gray-500 shrink-0 flex items-center justify-center overflow-hidden">
                    <User className="w-5 h-5 text-white/80" />
                  </div>
                  <div className="flex-1">
                    <div className="flex justify-between items-center mb-1">
                      <span className="text-sm font-semibold">{comment.user}</span>
                      <span className="text-xs text-white/40">{comment.date}</span>
                    </div>
                    <p className="text-xs text-white/60 leading-relaxed line-clamp-2">
                      {comment.text}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            {/* Rating Section */}
            <div className="mt-6 border-t border-white/10 pt-4">
              <p className="text-sm font-semibold mb-2">Rating This Film</p>
              <div className="flex gap-1 mb-6 text-white/10">
                {[1, 2, 3, 4, 5].map((star) => (
                  <Star key={star} className="w-6 h-6 fill-current cursor-pointer hover:text-yellow-500 transition-colors" />
                ))}
              </div>

              {/* Review Input */}
              <p className="text-sm font-semibold mb-2">Your Review</p>
              <input 
                type="text" 
                placeholder="Placeholder"
                className="w-full bg-[#1A1F29] border border-white/10 rounded-md px-4 py-3 text-sm text-white placeholder-white/30 focus:outline-none focus:border-white/30 mb-4"
              />
              <button className="w-full bg-white text-black font-semibold rounded-full py-3 text-sm hover:bg-gray-200 transition-colors">
                Submit Review
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
              <button className="flex items-center gap-2 px-5 py-2 rounded-full border border-white/20 hover:bg-white/10 transition-colors text-sm">
                <Heart className="w-4 h-4" /> Like
              </button>
              <button className="flex items-center gap-2 px-5 py-2 rounded-full border border-white/20 hover:bg-white/10 transition-colors text-sm">
                <Plus className="w-4 h-4" /> Add to Watch
              </button>
              <button className="flex items-center gap-2 px-5 py-2 rounded-full border border-white/20 hover:bg-white/10 transition-colors text-sm">
                <ThumbsUp className="w-4 h-4" /> Vote
              </button>
              <button onClick={handleShare} className="flex items-center justify-center w-10 h-10 rounded-full border border-white/20 hover:bg-white/10 transition-colors">
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
