'use client'

import React, { useState, useEffect, Suspense } from 'react'
import { useSearchParams } from 'next/navigation'
import Image from 'next/image'
import { Header } from '@/components/header'
import { Footer } from '@/components/footer'
import { Heart, Share2, MessageCircle, Play, Star, ChevronRight } from 'lucide-react'

// ... Keep your SeriesData, Episode, and Review interfaces here ...
interface SeriesData {
  id: string
  name: string
  description: string
  run_time: string
  run_time_format: string
  years: string
  video_url: string
  image_url: string
  image_landscape_url: string
  synopsis: string
  comment: string
  cats: string
  rates: string
  favorit: string
  my_favorit: string
  watch_me: string
  relate: SeriesData[]
}

interface Episode {
  id: string
  number: number
  title: string
  image: string
  duration: string
}

interface Review {
  id: string
  author: string
  avatar: string
  date: string
  content: string
  rating: number
}

// 1. Rename your original component to something like `SeriesDetailContent`
function SeriesDetailContent() {
  const searchParams = useSearchParams()
  const seriesId = searchParams.get('id')

  const [seriesData, setSeriesData] = useState<SeriesData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [isFavorite, setIsFavorite] = useState(false)
  const [userRating, setUserRating] = useState(0)

  // Dummy episodes data
  const episodes: Episode[] = [
    {
      id: '1',
      number: 1,
      title: '[Judul Series] Episode 1',
      image: 'https://hebbkx1anhila5yf.public.blob.vercel-storage.com/0938af323a7fb3c821e2c95b6766a49090cd1e0b-M2XYI31in3J9xgYB1jeAqN6qUyAvW6.png',
      duration: '45 min',
    },
    {
      id: '2',
      number: 2,
      title: '[Judul Series] Episode 2',
      image: 'https://hebbkx1anhila5yf.public.blob.vercel-storage.com/0938af323a7fb3c821e2c95b6766a49090cd1e0b-M2XYI31in3J9xgYB1jeAqN6qUyAvW6.png',
      duration: '48 min',
    },
    {
      id: '3',
      number: 3,
      title: '[Judul Series] Episode 3',
      image: 'https://hebbkx1anhila5yf.public.blob.vercel-storage.com/0938af323a7fb3c821e2c95b6766a49090cd1e0b-M2XYI31in3J9xgYB1jeAqN6qUyAvW6.png',
      duration: '50 min',
    },
    {
      id: '4',
      number: 4,
      title: '[Judul Series] Episode 4',
      image: 'https://hebbkx1anhila5yf.public.blob.vercel-storage.com/0938af323a7fb3c821e2c95b6766a49090cd1e0b-M2XYI31in3J9xgYB1jeAqN6qUyAvW6.png',
      duration: '46 min',
    },
  ]

  // Dummy reviews data
  const reviews: Review[] = [
    {
      id: '1',
      author: 'thesubraupi',
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=thesubraupi',
      date: '08/09/2025',
      content: '[Comment] Lorem ipsum dolor sit amet consectetur. Vivarium turris in adipisem perternatur quis vehicula et impermatt. Paciena auan ultriciid qjastas et amet secta sed.',
      rating: 5,
    },
    // ... remaining dummy reviews ...
  ]

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

        const data = await response.json()

        if (data.status === true && data.data) {
          setSeriesData(data.data)
          setIsFavorite(data.data.my_favorit === '1')
        } else {
          setError('Failed to load series data')
        }
      } catch (error) {
        console.error('[v0] Error fetching series detail:', error)
        setError('Failed to load series')
      } finally {
        setLoading(false)
      }
    }

    fetchSeriesDetail()
  }, [seriesId])

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0f172a] flex items-center justify-center">
        <Header />
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-white/20 border-t-white rounded-full animate-spin mx-auto mb-4" />
          <p className="text-gray-400">Loading series...</p>
        </div>
      </div>
    )
  }

  if (error || !seriesData) {
    return (
      <div className="min-h-screen bg-[#0f172a]">
        <Header />
        <div className="flex items-center justify-center py-20">
          <p className="text-gray-400 text-lg">{error || 'Failed to load series'}</p>
        </div>
        <Footer />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[#0f172a] text-white">
      <Header />

      {/* Video Player Section */}
      <div className="relative w-full bg-black aspect-video">
        {seriesData.video_url ? (
          <video
            className="w-full h-full object-cover"
            poster={seriesData.image_landscape_url || seriesData.image_url}
            controls
          >
            <source src={seriesData.video_url} type="video/mp4" />
            Your browser does not support the video tag.
          </video>
        ) : (
          <Image
            src={seriesData.image_landscape_url || seriesData.image_url || '/film/film2.png'}
            alt={seriesData.name}
            fill
            className="object-cover"
          />
        )}

        {/* Video Overlay Title */}
        <div className="absolute top-6 left-6 text-lg font-semibold">{seriesData.name}</div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Action Buttons */}
        <div className="flex gap-3 mb-8">
          <button className="bg-white text-black hover:bg-gray-200 px-6 py-2 rounded-lg font-semibold flex items-center gap-2 transition">
            <Play className="w-4 h-4" />
            Continue Watching
          </button>
        </div>

        {/* Series Info */}
        <div className="mb-12">
          <div className="flex items-center justify-between mb-4">
            <h1 className="text-3xl font-bold">{seriesData.name}</h1>
            <div className="flex gap-4">
              <button
                onClick={() => setIsFavorite(!isFavorite)}
                className={`p-2 rounded-lg transition-colors ${
                  isFavorite ? 'bg-red-600/20 text-red-500' : 'bg-gray-700/50 text-gray-400 hover:text-white'
                }`}
              >
                <Heart className="w-6 h-6" fill={isFavorite ? 'currentColor' : 'none'} />
              </button>
              <button className="p-2 rounded-lg bg-gray-700/50 text-gray-400 hover:text-white transition-colors">
                <Share2 className="w-6 h-6" />
              </button>
              <button className="p-2 rounded-lg bg-gray-700/50 text-gray-400 hover:text-white transition-colors">
                <MessageCircle className="w-6 h-6" />
              </button>
            </div>
          </div>

          {/* Rating and Info */}
          <div className="flex items-center gap-4 mb-4 flex-wrap">
            <div className="flex gap-1">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="w-5 h-5 text-yellow-400 fill-yellow-400" />
              ))}
            </div>
            <span className="text-gray-400">★★★★★ {seriesData.rates}</span>
            <span className="text-gray-400">•</span>
            <span className="text-gray-400">{seriesData.years}</span>
            <span className="text-gray-400">•</span>
            <span className="text-gray-400">{seriesData.run_time_format}</span>
          </div>

          {/* Synopsis */}
          <p className="text-gray-300 leading-relaxed mb-2">
            {(seriesData.synopsis || seriesData.description)?.replace(/<\/?[^>]+(>|$)/g, "")}
          </p>
          <button className="text-orange-500 hover:text-orange-400 text-sm font-medium">Read More</button>        
        </div>

        {/* Episodes Section */}
        <div className="mb-12">
          {/* ... Rest of your UI code stays exactly the same ... */}
        </div>
      </div>

      <Footer />
    </div>
  )
}

// 2. Create the new default export that wraps the content in Suspense
export default function SeriesDetailPage() {
  return (
    <Suspense 
      fallback={
        <div className="min-h-screen bg-[#0f172a] flex items-center justify-center">
          <div className="text-center">
            <div className="w-12 h-12 border-4 border-white/20 border-t-white rounded-full animate-spin mx-auto mb-4" />
            <p className="text-gray-400">Loading...</p>
          </div>
        </div>
      }
    >
      <SeriesDetailContent />
    </Suspense>
  )
}