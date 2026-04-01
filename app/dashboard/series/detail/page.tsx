'use client'

import React, { useState, useEffect, Suspense, useCallback } from 'react'
import { useSearchParams } from 'next/navigation'
import Image from 'next/image'
import Link from 'next/link' 
import { Header } from '@/components/header'
import { Footer } from '@/components/footer'
import { Heart, Share2, Play, Star, Plus, Volume2 } from 'lucide-react'

// ... Interfaces tetap sama ...
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

function SeriesDetailContent() {
  const searchParams = useSearchParams()
  const seriesId = searchParams.get('id_group')

  const [seriesData, setSeriesData] = useState<SeriesData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [isFavorite, setIsFavorite] = useState(false)
  
  // State Komentar
  const [comments, setComments] = useState<CommentItem[]>([])
  const [loadingComments, setLoadingComments] = useState(true)
  const [newComment, setNewComment] = useState('')
  const [isSubmittingComment, setIsSubmittingComment] = useState(false)

  // State Video Aktif
  const [activeVideoId, setActiveVideoId] = useState<string | null>(null) // TRACK ID VIDEO DISINI
  const [activeVideo, setActiveVideo] = useState<string | null>(null)
  const [activeVideoPoster, setActiveVideoPoster] = useState<string | null>(null)

  // 1. Fetch Series Detail & Set Initial Video ID
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
        
        // Set video pertama sebagai default jika belum ada yang dipilih
        if (json.data.groups && json.data.groups.length > 0) {
          const firstEpisode = json.data.groups[0]
          setActiveVideoId(firstEpisode.id) // Simpan ID Video
          setActiveVideo(firstEpisode.video_url)
          setActiveVideoPoster(firstEpisode.image_landscape_url || firstEpisode.image_url)
        } else {
          // Fallback ke data utama jika groups kosong
          setActiveVideoId(json.data.id)
          setActiveVideo(json.data.video_url)
          setActiveVideoPoster(json.data.image_landscape_url || json.data.image_url)
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

  // 2. Fetch Comments berdasarkan activeVideoId
  const fetchComments = useCallback(async () => {
    if (!activeVideoId) return // Gunakan ID Video, bukan Group ID
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

  // Re-fetch komentar setiap kali video yang dipilih berubah
  useEffect(() => {
    fetchComments()
  }, [fetchComments])

  // 3. Submit Comment menggunakan activeVideoId
 // 3. Submit Comment menggunakan activeVideoId (ID Episode/Video)
  const handleSubmitComment = async () => {
    // Validasi: pastikan ada komentar dan pastikan activeVideoId sudah terisi
    if (!newComment.trim() || !activeVideoId) {
      console.error("[v0] Error: Comment or Active Video ID is missing");
      return;
    }

    try {
      setIsSubmittingComment(true);
      const token = localStorage.getItem('user_token');
      
      if (!token) {
        alert("Please login first to submit a review.");
        return;
      }

      console.log("[v0] Submitting comment for Video ID:", activeVideoId);

      const response = await fetch('/api/series/post-comment', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          id: activeVideoId, // Mengirim ID Video (misal: "3", "4", atau "6")
          comment: newComment.trim()
        })
      });

      const json = await response.json();

      if (response.ok && json.status === true) {
        console.log("[v0] Comment posted successfully");
        setNewComment(''); // Kosongkan input
        await fetchComments(); // Refresh daftar komentar untuk video ini
      } else {
        throw new Error(json.message || "Failed to submit comment");
      }
    } catch (error: any) {
      console.error("[v0] Post Comment Error:", error);
      alert(error.message || "An error occurred while submitting your comment.");
    } finally {
      setIsSubmittingComment(false);
    }
  };

  const playEpisode = (episode: GroupEpisode) => {
    setActiveVideoId(episode.id) // Update ID saat episode di klik
    setActiveVideo(episode.video_url)
    setActiveVideoPoster(episode.image_landscape_url || episode.image_url)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  // ... Render Logic (sama seperti sebelumnya) ...
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
            <h1 className="text-2xl md:text-3xl font-bold mb-3">{seriesData.name}</h1>
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
              className="text-gray-300 text-sm leading-relaxed mb-8 flex-grow overflow-y-auto max-h-[300px] scrollbar-hide"
              dangerouslySetInnerHTML={{ __html: seriesData.description || "" }}
            />
          </div>
        </div>
      </div>

      <div className="max-w-[1920px] mx-auto px-4 sm:px-6 lg:px-10 xl:px-14 pb-20">
        <div className="mb-14">
          <h2 className="text-xl md:text-2xl font-bold mb-6">Episodes</h2>
          <div className="flex gap-4 md:gap-5 overflow-x-auto pb-6 scrollbar-hide">
            {seriesData.groups?.map((ep) => (
              <div 
                key={ep.id} 
                className={`snap-start shrink-0 w-[240px] cursor-pointer p-2 rounded-xl border transition-all ${activeVideoId === ep.id ? 'border-[#D4A84B] bg-white/5' : 'border-transparent'}`}
                onClick={() => playEpisode(ep)}
              >
                <div className="relative aspect-video rounded-lg overflow-hidden mb-2">
                  <Image src={ep.image_landscape_url || ep.image_url} alt={ep.name} fill className="object-cover" />
                  {activeVideoId === ep.id && <div className="absolute inset-0 bg-black/40 flex items-center justify-center"><Play className="text-[#D4A84B]" /></div>}
                </div>
                <h4 className="font-bold text-sm truncate">{ep.name}</h4>
              </div>
            ))}
          </div>
        </div>

        <div className="flex flex-col lg:flex-row gap-10">
          {/* REVIEWS */}
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

          {/* RECOMMENDED */}
          <div className="w-full lg:w-[35%]">
            <h2 className="text-xl font-bold mb-6">Recommended</h2>
            {seriesData.recomen?.map((item) => (
              <Link key={item.id} href={`/dashboard/series/detail?id_group=${item.id}`} className="flex gap-4 mb-4 group">
                <div className="relative w-32 aspect-video rounded-lg overflow-hidden shrink-0"><Image src={item.image_url} alt={item.name} fill className="object-cover" /></div>
                <h4 className="font-bold text-sm group-hover:text-[#D4A84B]">{item.name}</h4>
              </Link>
            ))}
          </div>
        </div>
      </div>
      <Footer />
    </div>
  )
}

export default function SeriesDetailPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-[#050B14]" />}>
      <SeriesDetailContent />
    </Suspense>
  )
}