'use client'

import React, { useState, useEffect, Suspense } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { useSearchParams } from 'next/navigation'
import { Header } from '@/components/header'
import { Footer } from '@/components/footer'
import {
  Heart,
  Plus,
  Share2,
  ChevronRight,
} from 'lucide-react'

interface RelatedFilm {
  id: string
  name: string
  description: string
  run_time: string
  years: string
  cats: string
  image_url: string
  video_url: string
  run_time_format: string
}

interface FilmData {
  id: string
  name: string
  description: string
  run_time: string
  years: string
  cats: string
  rates: string | null
  image_url: string
  video_url: string
  relate: RelatedFilm[]
}

interface Comment {
  id: number
  author: string
  avatar: string
  text: string
  date: string
}

const comments: Comment[] = [
  {
    id: 1,
    author: 'fredthegreat',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=fredthegreat',
    text: 'Film yang sangat luar biasa, sangat menginspirasi!',
    date: '09/05/2025',
  },
  {
    id: 2,
    author: 'johndoe',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=johndoe',
    text: 'Visualnya memukau dan ceritanya sangat dalam.',
    date: '10/05/2025',
  }
]

// Komponen Utama Detail Film
function DetailContent() {
  const searchParams = useSearchParams()
  const id_film = searchParams.get('id')

  const [filmData, setFilmData] = useState<FilmData | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const [rating, setRating] = useState(0)
  const [reviewText, setReviewText] = useState('')
  const [sortBy] = useState('Newest')

  // Fetch API
  useEffect(() => {
    const fetchFilmDetail = async () => {
      if (!id_film) {
        setError('ID Film tidak ditemukan di URL')
        setIsLoading(false)
        return
      }

      try {
        setIsLoading(true)
        const token = localStorage.getItem('user_token')
        
        // Gunakan API Route internal Next.js
        const response = await fetch(`/api/film/detail?id=${id_film}`, {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        })

        const result = await response.json()

        if (result.status === true && result.data) {
          setFilmData(result.data)
        } else {
          setError(result.message || 'Gagal mengambil data film')
        }
      } catch (err) {
        console.error('Error fetching detail:', err)
        setError('Terjadi kesalahan saat menghubungi server')
      } finally {
        setIsLoading(false)
      }
    }

    fetchFilmDetail()
  }, [id_film])

  // Helper untuk konversi URL HTTP ke HTTPS
  const secureUrl = (url: string) => {
    if (!url) return '';
    return url.replace('http://', 'https://');
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#020817] flex flex-col items-center justify-center text-white font-sans">
        <div className="w-10 h-10 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mb-4"></div>
        <p>Memuat Film...</p>
      </div>
    )
  }

  if (error || !filmData) {
    return (
      <div className="min-h-screen bg-[#020817] flex flex-col items-center justify-center text-white font-sans gap-4">
        <p className="text-xl font-bold">Oops!</p>
        <p className="text-gray-400">{error || 'Data film tidak ditemukan.'}</p>
        <Link href="/dashboard/film" className="px-6 py-2 bg-blue-600 hover:bg-blue-700 rounded-full transition-colors">
          Kembali ke List Film
        </Link>
      </div>
    )
  }

  return (
    <>
      <Header />

      {/* ===== TOP PLAYER AREA ===== */}
      <div className="bg-gradient-to-b from-[#0b1222] via-[#020817] to-[#020817] pb-8 md:pb-10">
        {/* DIUBAH: Menghapus max-w-[1400px] dan mx-auto, menggantinya dengan w-full */}
        <div className="w-full px-4 md:px-8 lg:px-12 pt-4 md:pt-6">
          
          <div className="relative w-full rounded-xl md:rounded-2xl overflow-hidden bg-black shadow-[0_20px_60px_rgba(0,0,0,0.6)]">
            {/* DIUBAH: Menghapus max-h-[648px] dan menggantinya dengan md:max-h-[85vh] agar bisa membesar secara horizontal */}
            <div className="relative w-full aspect-video md:max-h-[85vh] bg-black mx-auto">
              {filmData.video_url ? (
                <video
                  key={filmData.video_url}
                  controls
                  controlsList="nodownload"
                  className="w-full h-full object-contain"
                  poster={secureUrl(filmData.image_url)}
                >
                  <source src={secureUrl(filmData.video_url)} type="video/mp4" />
                  Browser Anda tidak mendukung pemutar video ini.
                </video>
              ) : (
                <div className="w-full h-full flex items-center justify-center text-white/50">
                  Video tidak tersedia
                </div>
              )}
            </div>
          </div>

          {/* ===== INFO BAR under player ===== */}
          <div className="mt-5 md:mt-8 flex flex-col md:flex-row md:items-start md:justify-between gap-4 md:gap-6">
            <div className="space-y-2 md:space-y-3">
              <h1 className="text-lg sm:text-xl md:text-3xl font-bold">
                {filmData.name}
              </h1>

              <div className="flex flex-wrap items-center gap-2 md:gap-3 text-xs md:text-sm">
                <span className="px-2.5 py-1 rounded-full bg-white/10 border border-white/10">
                  {filmData.cats || 'Uncategorized'}
                </span>

                <div className="flex items-center gap-1 text-yellow-400">
                  <span>★</span>
                  <span>★</span>
                  <span>★</span>
                  <span className="text-white/70 ml-1">{filmData.rates || '0.0'}</span>
                </div>

                <span className="text-white/60">{filmData.years}</span>
                <span className="text-white/60">{filmData.run_time}m</span>
              </div>
            </div>

            {/* ACTION BUTTONS */}
            <div className="flex items-center gap-2 md:gap-3">
              <button className="h-9 w-9 md:h-10 md:w-10 rounded-full border border-white/15 bg-white/5 hover:bg-white/10 transition-colors flex items-center justify-center">
                <Heart className="w-4 h-4 md:w-5 md:h-5" />
              </button>
              <button className="h-9 w-9 md:h-10 md:w-10 rounded-full border border-white/15 bg-white/5 hover:bg-white/10 transition-colors flex items-center justify-center">
                <Plus className="w-4 h-4 md:w-5 md:h-5" />
              </button>
              <button className="h-9 w-9 md:h-10 md:w-10 rounded-full border border-white/15 bg-white/5 hover:bg-white/10 transition-colors flex items-center justify-center">
                <Share2 className="w-4 h-4 md:w-5 md:h-5" />
              </button>
            </div>
          </div>

          {/* Description */}
          {/* DIUBAH: max-w-4xl dihapus agar teks deskripsi tidak kerdil di layar besar */}
          <p className="mt-3 md:mt-5 text-white/70 text-xs sm:text-sm leading-relaxed md:max-w-[70%]">
            {filmData.description || 'Tidak ada sinopsis tersedia untuk film ini.'}
          </p>
        </div>
      </div>

      {/* ===== MAIN CONTENT ===== */}
      {/* DIUBAH: Menyesuaikan kontainer bawah agar lebarnya sama persis (full) dengan atasnya */}
      <div className="w-full px-4 md:px-8 lg:px-12 pb-14 md:pb-16">
        
        {/* ===== EPISODES (Related Films) ===== */}
        {/* (Kode episode Anda ada di sini jika ada) */}

        {/* ===== REVIEW PANEL ===== */}
        <section className="mt-8 md:mt-10 rounded-2xl bg-white/5 border border-white/10 overflow-hidden">
          <div className="px-4 sm:px-6 py-4 sm:py-5 flex items-center justify-between gap-3 border-b border-white/10">
            <h2 className="text-base sm:text-lg md:text-xl font-bold">Review</h2>

            <div className="flex items-center gap-2 sm:gap-3">
              <button className="h-9 sm:h-10 px-3 sm:px-4 rounded-full bg-white/10 border border-white/15 hover:bg-white/15 transition-colors text-xs sm:text-sm inline-flex items-center gap-2">
                <Plus className="w-4 h-4" />
                Add Comment
              </button>

              <button className="h-9 sm:h-10 px-3 sm:px-4 rounded-full bg-white/10 border border-white/15 hover:bg-white/15 transition-colors text-xs sm:text-sm inline-flex items-center gap-2">
                {sortBy}
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>

          <div className="px-4 sm:px-6 py-5 sm:py-6 space-y-5 sm:space-y-6">
            {comments.map((c) => (
              <div key={c.id} className="flex gap-3 sm:gap-4">
                <div className="h-9 w-9 sm:h-10 sm:w-10 rounded-full overflow-hidden bg-white/10 border border-white/10 flex-shrink-0">
                  <Image
                    src={c.avatar}
                    alt={c.author}
                    width={40}
                    height={40}
                    className="h-full w-full object-cover"
                  />
                </div>

                <div className="flex-1">
                  <div className="flex items-center justify-between gap-3">
                    <p className="text-xs sm:text-sm font-semibold">{c.author}</p>
                    <p className="text-[10px] sm:text-xs text-white/40">{c.date}</p>
                  </div>
                  <p className="mt-2 text-xs sm:text-sm text-white/70 leading-relaxed">
                    {c.text}
                  </p>
                </div>
              </div>
            ))}
          </div>

          <div className="h-px bg-white/10" />

          <div className="px-4 sm:px-6 py-5 sm:py-6">
            <p className="text-xs sm:text-sm font-semibold mb-3">Rating This Film</p>
            <div className="flex items-center gap-2 mb-6">
              {[1, 2, 3, 4, 5].map((s) => (
                <button
                  key={s}
                  onClick={() => setRating(s)}
                  className={`text-xl sm:text-2xl transition-colors ${
                    s <= rating ? 'text-yellow-400' : 'text-white/25'
                  }`}
                  aria-label={`Rate ${s}`}
                >
                  ★
                </button>
              ))}
            </div>

            <p className="text-xs sm:text-sm font-semibold mb-3">Your Review</p>
            <textarea
              value={reviewText}
              onChange={(e) => setReviewText(e.target.value)}
              placeholder="Tulis ulasan Anda di sini..."
              className="w-full min-h-[100px] rounded-xl bg-[#0b1222] border border-white/10 px-4 py-3 text-xs sm:text-sm text-white placeholder:text-white/35 outline-none focus:border-white/20"
            />

            <div className="flex justify-end mt-4">
              <button 
                onClick={() => alert("Fitur submit belum diimplementasikan.")}
                className="h-9 sm:h-10 px-5 sm:px-6 rounded-full bg-white text-black font-semibold text-xs sm:text-sm hover:bg-white/90 transition-colors"
              >
                Submit Review
              </button>
            </div>
          </div>

          <div className="px-4 sm:px-6 py-4 border-t border-white/10 flex items-center justify-between">
            <button 
              onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
              className="text-xs sm:text-sm text-white/60 hover:text-white transition-colors"
            >
              ↑ Scroll to Top
            </button>
          </div>
        </section>
      </div>

      <Footer />
    </>
  )
}

// WAJIB: Bungkus dengan Suspense karena menggunakan useSearchParams()
export default function SeriesDetailPage() {
  return (
    <div className="min-h-screen bg-[#020817] text-white font-sans">
      <Suspense fallback={
        <div className="min-h-screen flex items-center justify-center">
          <div className="w-10 h-10 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
        </div>
      }>
        <DetailContent />
      </Suspense>
    </div>
  )
}