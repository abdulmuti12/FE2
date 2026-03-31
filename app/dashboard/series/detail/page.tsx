'use client'

import React, { useState, useEffect, Suspense } from 'react'
import { useSearchParams } from 'next/navigation'
import Image from 'next/image'
import Link from 'next/link' 
import { Header } from '@/components/header'
import { Footer } from '@/components/footer'
import { Heart, Share2, Play, Star, Plus, Volume2 } from 'lucide-react'

// --- Interfaces ---
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

// Interface baru untuk data Komentar dari API
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

// Fungsi bantu untuk memotong dan membersihkan teks HTML
const truncateText = (text: string | null | undefined, maxLength: number = 200) => {
  if (!text) return ""
  const plainText = text.replace(/<[^>]+>/g, '').replace(/\n/g, ' ').trim()
  if (plainText.length <= maxLength) return plainText
  return plainText.substring(0, maxLength).trim() + '...'
}

function SeriesDetailContent() {
  const searchParams = useSearchParams()
  const seriesId = searchParams.get('id')

  const [seriesData, setSeriesData] = useState<SeriesData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [isFavorite, setIsFavorite] = useState(false)
  
  // State for comments
  const [comments, setComments] = useState<CommentItem[]>([])
  const [loadingComments, setLoadingComments] = useState(true)

  // State for active video
  const [activeVideo, setActiveVideo] = useState<string | null>(null)
  const [activeVideoPoster, setActiveVideoPoster] = useState<string | null>(null)

  // Fetch Series Detail
  useEffect(() => {
    const fetchSeriesDetail = async () => {
      try {
        if (!seriesId) {
          setError('No series ID provided')
          setLoading(false)
          return
        }

        const token = localStorage.getItem('user_token')
        if (!token) {
          setError('Authentication required')
          setLoading(false)
          return
        }

        setLoading(true)

        const response = await fetch(`/api/series/series-detail?id=${seriesId}`, {
          method: 'GET',
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        })

        if (!response.ok) {
          setError('Failed to load series')
          setLoading(false)
          return
        }

        const json = await response.json()

        if (json.status === true && json.data) {
          const data = json.data
          setSeriesData(data)
          setIsFavorite(data.my_favorit === '1')
          setActiveVideo(data.video_url)
          setActiveVideoPoster(data.image_landscape_url || data.image_url)
          window.scrollTo({ top: 0, behavior: 'smooth' })
        } else {
          setError('Failed to load series data')
        }
      } catch (error) {
        console.error('Error fetching series detail:', error)
        setError('Failed to load series')
      } finally {
        setLoading(false)
      }
    }

    fetchSeriesDetail()
  }, [seriesId])

  // Fetch Comments
  useEffect(() => {
    const fetchComments = async () => {
      if (!seriesId) return

      try {
        setLoadingComments(true)
        const token = localStorage.getItem('user_token') || ''
        
        // Memanggil endpoint asli uSky
// SESUDAH (Menggunakan Proxy Lokal Next.js)
        const response = await fetch(`/api/series/comment?id=${seriesId}`, {
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
    }

    fetchComments()
  }, [seriesId])

  const playEpisode = (episode: GroupEpisode) => {
    setActiveVideo(episode.video_url)
    setActiveVideoPoster(episode.image_landscape_url || episode.image_url)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-[#050B14] flex items-center justify-center">
        <Header />
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-[#D4A84B]/20 border-t-[#D4A84B] rounded-full animate-spin mx-auto mb-4" />
          <p className="text-gray-400">Loading series...</p>
        </div>
      </div>
    )
  }

  if (error || !seriesData) {
    return (
      <div className="min-h-screen bg-[#050B14]">
        <Header />
        <div className="flex items-center justify-center py-20">
          <p className="text-gray-400 text-lg">{error || 'Failed to load series'}</p>
        </div>
        <Footer />
      </div>
    )
  }

  const mainSynopsis = seriesData.description || seriesData.synopsis || "Synopsis not available."

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
                poster={activeVideoPoster || '/film/film2.png'}
                controls
                controlsList="nodownload"
              >
                <source src={activeVideo} type="video/mp4" />
                Your browser does not support the video tag.
              </video>
            ) : (
              <div className="w-full h-full flex items-center justify-center">
                 <Image
                    src={activeVideoPoster || '/film/film2.png'}
                    alt="Video Poster"
                    fill
                    className="object-cover opacity-50"
                  />
                  <div className="absolute z-10 w-16 h-16 rounded-full bg-black/50 border border-white/20 flex items-center justify-center backdrop-blur-sm">
                    <Play className="w-6 h-6 ml-1 text-white" />
                  </div>
              </div>
            )}

            <div className="absolute top-4 left-6 right-6 flex justify-between items-center pointer-events-none opacity-0 hover:opacity-100 transition-opacity">
               <h2 className="text-xl font-bold drop-shadow-md">{seriesData.name}</h2>
               <div className="flex items-center gap-2">
                 <Volume2 className="w-5 h-5 text-white drop-shadow-md" />
                 <div className="w-24 h-1 bg-white/30 rounded-full overflow-hidden">
                   <div className="w-2/3 h-full bg-white rounded-full"></div>
                 </div>
               </div>
            </div>
          </div>

          <div className="w-full lg:w-1/3 xl:w-[30%] bg-[#0a1628]/80 backdrop-blur-xl border border-white/5 rounded-2xl p-6 md:p-8 flex flex-col">
            <h1 className="text-2xl md:text-3xl font-bold mb-3">{seriesData.name}</h1>
            
            <div className="flex items-center gap-3 mb-4 text-xs md:text-sm">
              <span className="bg-white/10 px-2 py-0.5 rounded text-gray-300">{seriesData.cats || 'Genre'}</span>
              <div className="flex text-[#D4A84B]">
                <Star className="w-3.5 h-3.5 fill-current" />
                <Star className="w-3.5 h-3.5 fill-current" />
                <Star className="w-3.5 h-3.5 fill-current" />
                <Star className="w-3.5 h-3.5 fill-current" />
                <Star className="w-3.5 h-3.5 text-gray-600" />
              </div>
              <span className="text-gray-400">{seriesData.comment || '0'} 👥</span>
            </div>

            <div className="flex items-center gap-2 text-gray-400 text-sm mb-6">
              <span>{seriesData.years}</span>
              <span>•</span>
              <span>{seriesData.run_time_format || '1h 0m'}</span>
            </div>

            <p className="text-gray-300 text-sm leading-relaxed mb-8 flex-grow">
              {truncateText(mainSynopsis, 350)}
            </p>

            <div className="flex items-center gap-3 mt-auto">
              <button className="flex-grow flex items-center justify-center gap-2 bg-transparent border border-white/20 hover:bg-white/10 transition-colors py-2.5 rounded-lg font-medium text-sm">
                <Share2 className="w-4 h-4" />
                Share
              </button>
              <button 
                onClick={() => setIsFavorite(!isFavorite)}
                className={`p-2.5 rounded-lg border transition-colors ${
                  isFavorite ? 'bg-red-500/10 border-red-500/30 text-red-500' : 'bg-transparent border-white/20 hover:bg-white/10 text-white'
                }`}
              >
                <Heart className="w-5 h-5" fill={isFavorite ? 'currentColor' : 'none'} />
              </button>
              <button className="p-2.5 rounded-lg border border-white/20 bg-transparent hover:bg-white/10 transition-colors">
                <Plus className="w-5 h-5" />
              </button>
            </div>
          </div>

        </div>
      </div>

      <div className="max-w-[1920px] mx-auto px-4 sm:px-6 lg:px-10 xl:px-14 pb-20">
        
        <div className="mb-14">
          <div className="flex items-center justify-between mb-6">
             <h2 className="text-xl md:text-2xl font-bold">Episode</h2>
             <div className="flex gap-1.5 opacity-50">
               <div className="w-6 h-1 bg-white rounded-full"></div>
               <div className="w-2 h-1 bg-white rounded-full"></div>
               <div className="w-2 h-1 bg-white rounded-full"></div>
             </div>
          </div>
          
          <div className="flex gap-4 md:gap-5 overflow-x-auto pb-6 scrollbar-hide snap-x">
            {seriesData.groups && seriesData.groups.length > 0 ? (
              seriesData.groups.map((ep) => (
                <div 
                  key={ep.id} 
                  className="snap-start shrink-0 w-[240px] sm:w-[280px] md:w-[320px] group cursor-pointer"
                  onClick={() => playEpisode(ep)}
                >
                  <div className="relative aspect-video rounded-xl overflow-hidden mb-3 border border-white/5 group-hover:border-[#D4A84B]/50 transition-colors">
                    <Image
                      src={ep.image_landscape_url || ep.image_url || '/film/film2.png'}
                      alt={ep.name}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                    
                    <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                      <div className="w-12 h-12 rounded-full bg-black/60 backdrop-blur-sm border border-white/20 flex items-center justify-center">
                         <Play className="w-5 h-5 ml-1 text-white fill-white" />
                      </div>
                    </div>

                    <div className="absolute bottom-3 left-3 right-3">
                      <h4 className="font-bold text-sm md:text-base mb-1 truncate">{ep.name}</h4>
                      <p className="text-xs text-gray-400 line-clamp-1">
                         {truncateText(ep.description || ep.synopsis || "Watch groundbreaking films crafted by...", 50)}
                      </p>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-gray-500">No episodes available.</p>
            )}
          </div>
        </div>

        <div className="flex flex-col lg:flex-row gap-10 lg:gap-16">
          
          {/* Left Column: Reviews (MENGGUNAKAN DATA API) */}
          <div className="w-full lg:w-[60%] xl:w-[65%]">
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-xl md:text-2xl font-bold">Review</h2>
              <div className="flex gap-3">
                <button className="flex items-center gap-2 px-4 py-1.5 rounded-full border border-white/20 text-sm hover:bg-white/5 transition-colors">
                  <Plus className="w-4 h-4" /> Add Comment
                </button>
                <button className="flex items-center gap-2 px-4 py-1.5 rounded-full border border-white/20 text-sm hover:bg-white/5 transition-colors">
                  Newest
                </button>
              </div>
            </div>

            {/* Review List */}
            <div className="space-y-6 mb-10">
              {loadingComments ? (
                <p className="text-gray-500 text-sm">Loading comments...</p>
              ) : comments.length > 0 ? (
                comments.map((item) => (
                  <div key={item.id} className="flex gap-4 items-start">
                    <div className="relative w-10 h-10 shrink-0">
                      <Image 
                        src={item.avatar_url || `https://api.dicebear.com/7.x/avataaars/svg?seed=${item.name}`} 
                        alt={item.name} 
                        fill
                        className="rounded-full bg-white/10 object-cover" 
                      />
                    </div>
                    <div className="flex-grow">
                      <div className="flex justify-between items-center mb-1">
                        <span className="font-semibold text-sm">{item.name}</span>
                        <span className="text-xs text-gray-500">{item.time_ago}</span>
                      </div>
                      <p className="text-sm text-gray-400 leading-relaxed">
                        {item.comment}
                      </p>
                      <div className="flex items-center gap-1.5 mt-2">
                        <button className="text-gray-500 hover:text-red-500 transition-colors flex items-center gap-1 text-xs">
                          <Heart className="w-3.5 h-3.5" /> 
                          {item.heart !== "0" && item.heart}
                        </button>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-gray-500 text-sm">No reviews yet. Be the first to review!</p>
              )}
            </div>

            {/* Review Input Box */}
            <div className="bg-[#0a1628]/50 border border-white/5 rounded-2xl p-6">
              <p className="text-sm font-semibold mb-3">Rating This Film</p>
              <div className="flex gap-2 mb-6">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-6 h-6 text-gray-600 hover:text-yellow-500 cursor-pointer transition-colors" />
                ))}
              </div>
              <p className="text-sm font-semibold mb-3">Your Review</p>
              <textarea 
                className="w-full bg-transparent border border-gray-700 rounded-xl p-4 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-[#D4A84B] resize-none h-32 mb-4"
                placeholder="Write your review here..."
              ></textarea>
              <div className="flex justify-between items-center">
                <button 
                  onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
                  className="flex items-center gap-2 text-sm text-gray-400 hover:text-white transition-colors bg-white/5 px-4 py-2 rounded-full border border-white/10"
                >
                  ↑ Scroll to Top
                </button>
                <button className="bg-white text-black px-6 py-2 rounded-full text-sm font-semibold hover:bg-gray-200 transition-colors">
                  Submit Review
                </button>
              </div>
            </div>
          </div>

          {/* Right Column: Recommended */}
          <div className="w-full lg:w-[40%] xl:w-[35%]">
            <h2 className="text-xl md:text-2xl font-bold mb-8">Recommended</h2>
            <div className="flex flex-col gap-4">
              {seriesData.recomen && seriesData.recomen.length > 0 ? (
                seriesData.recomen.map((item) => (
                  <Link key={item.id} href={`/dashboard/series/detail?id=${item.id}`} className="flex gap-4 group items-center">
                    <div className="relative w-32 md:w-40 aspect-video rounded-lg overflow-hidden shrink-0 border border-white/5 group-hover:border-[#D4A84B]/50 transition-colors">
                      <Image
                        src={item.image_landscape_url || item.image_url || '/film/film2.png'}
                        alt={item.name}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                      <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity bg-black/40">
                        <Play className="w-6 h-6 text-white fill-white" />
                      </div>
                    </div>
                    <div className="flex flex-col justify-center">
                      <h4 className="font-bold text-sm md:text-base mb-1 group-hover:text-[#D4A84B] transition-colors">{item.name}</h4>
                      <p className="text-xs text-gray-400 line-clamp-2 leading-snug">
                        {truncateText(item.description || item.synopsis || "Watch groundbreaking films crafted by...", 80)}
                      </p>
                    </div>
                  </Link>
                ))
              ) : (
                <p className="text-gray-500">No recommendations available.</p>
              )}
            </div>
          </div>

        </div>
      </div>

      <Footer />
    </div>
  )
}

export default function SeriesDetailPage() {
  return (
    <Suspense 
      fallback={
        <div className="min-h-screen bg-[#050B14] flex items-center justify-center">
          <div className="text-center">
            <div className="w-12 h-12 border-4 border-[#D4A84B]/20 border-t-[#D4A84B] rounded-full animate-spin mx-auto mb-4" />
            <p className="text-gray-400">Loading...</p>
          </div>
        </div>
      }
    >
      <SeriesDetailContent />
    </Suspense>
  )
}