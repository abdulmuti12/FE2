'use client'

import {
  AlertCircle,
  ChevronLeft,
  ChevronRight,
  Info,
  Menu,
  Pause,
  Play,
  X,
  Volume2,
  VolumeX,
} from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useState, useRef, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Header } from '@/components/header'
import { Footer } from '@/components/footer'
import { LatestAwards } from '@/components/home/latest-awards'
import { FutureFilmmaking } from '@/components/home/future-filmmaking'
import { CategorySection } from '@/components/home/category-section'
import { MostWatchingFilm } from '@/components/home/most-watching-film'
import { LatestFilm } from '@/components/home/latest-film'
import { UpcomingEventsSection } from '@/components/home/upcoming-events-section'

import {
  FeaturedSkeleton,
  SeriesSkeleton,
  AwardSkeleton,
} from '@/components/skeleton-loaders'

// --- Interfaces ---
interface TrailerData {
  id: string
  name?: string
  description?: string
  description_text?: string
  image?: string
  image_url?: string
  video?: string
  id_films?: string
  video_url?: string
}

interface EventData {
  id: string
  title: string
  image_url?: string
  tgl_live?: string
}

interface FilmData {
  id: string
  name: string
  image_url?: string
  image?: string
  synopsis?: string
  description?: string
  cats?: string
  run_time_format?: string
  years?: string
  rates?: string | null
}

interface LatestClipData {
  id: string
  name: string
  short_desc?: string | null
  description?: string
  description_text?: string
  image_url?: string
  cats?: string
  run_time_format?: string
}

interface AwardData {
  id: string
  name: string
  image_url?: string
  description?: string
  type?: string
  synopsis?: string
}

interface SeriesData {
  id: string
  name: string
    description: string
  asset_name?: string
  run_time_format?: string
  image_url?: string
  image_landscape_url?: string
}

interface CategoryApiData {
  id: string
  name: string
  images_url?: string
  total_movie?: string
}

interface CreatorData {
  id: string
  name: string
  avatar_url?: string
  total_video?: string
}

// --- Helper Functions ---
function stripHtml(html?: string) {
  if (!html) return ''
  return html
    .replace(/<[^>]*>/g, ' ')
    .replace(/&nbsp;/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()
}

// --- Components ---
function LatestClipSection({ items = [] }: { items?: any[] }) {
  const scrollerRef = useRef<HTMLDivElement | null>(null)

  const scroll = (dir: 'left' | 'right') => {
    if (!scrollerRef.current) return
    const amount = scrollerRef.current.clientWidth * 0.8
    scrollerRef.current.scrollBy({ left: dir === 'right' ? amount : -amount, behavior: 'smooth' })
  }


 

  if (items.length === 0) return null

  return (
    <section className="border-t border-white/10 px-4 py-8 md:px-6 md:py-10 lg:px-12">
      <div className="mb-8 flex items-center justify-between">
        <h2 className="text-2xl font-bold text-white md:text-3xl">Latest Clip</h2>
        <Link href="/home/clip/list" className="inline-flex items-center gap-2 font-semibold text-white hover:text-white/80 transition-colors">
          <span className="text-xs md:text-base">View All</span>
          <span className="text-white/70">›</span>
        </Link>
      </div>

      <div className="relative">
        <div
          ref={scrollerRef}
          className="flex gap-4 overflow-x-auto scroll-smooth pb-4 md:gap-6"
          style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
        >
          {items.map((clip) => (
            <div key={clip.id} className="w-[200px] md:w-[280px] flex-shrink-0">
              <Link href={`/home/clip?id=${clip.id}`} className="block">
                <div className="group relative aspect-[3/4] overflow-hidden rounded-2xl bg-black">
                  <Image src={clip.image || '/placeholder.svg'} alt={clip.title} fill className="object-cover transition-transform group-hover:scale-105" />
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="h-10 w-10 flex items-center justify-center rounded-full bg-black/40 backdrop-blur-sm border border-white/20">
                      <Play className="h-4 w-4 fill-white text-white" />
                    </div>
                  </div>
                  <div className="absolute inset-x-0 bottom-0 p-4 bg-gradient-to-t from-black via-black/60 to-transparent">
                    <p className="font-semibold text-sm text-white line-clamp-1">{clip.title}</p>
                    <p className="text-[11px] text-white/70 line-clamp-2 mt-1">
                      {clip.description_text || clip.description}
                    </p>
                  </div>
                </div>
              </Link>
            </div>
          ))}
        </div>
        <button onClick={() => scroll('right')} className="absolute right-0 top-1/2 flex h-8 w-8 translate-x-2 -translate-y-1/2 items-center justify-center rounded-lg bg-white/95 text-black shadow-md transition-colors hover:bg-white md:h-10 md:w-10 md:translate-x-4 lg:translate-x-6">
          <span className="text-lg leading-none md:text-xl">›</span>
        </button>
      </div>
    </section>
  )
}

// --- Main Page ---
export default function DashboardPage() {
  const router = useRouter()
  const videoRef = useRef<HTMLVideoElement | null>(null)
  
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [isMuted, setIsMuted] = useState(false)
  const [isPaused, setIsPaused] = useState(false)

  const [trailers, setTrailers] = useState<TrailerData[]>([])
  const [currentTrailerIndex, setCurrentTrailerIndex] = useState(0)
  
  const [latestFilms, setLatestFilms] = useState<FilmData[]>([])
  const [latestClips, setLatestClips] = useState<LatestClipData[]>([])
  const [latestAwards, setLatestAwards] = useState<AwardData[]>([])
  const [mostWatchingFilms, setMostWatchingFilms] = useState<FilmData[]>([])
  const [seriesData, setSeriesData] = useState<SeriesData[]>([])
  const [categoryApiData, setCategoryApiData] = useState<CategoryApiData[]>([])
  const [creatorApiData, setCreatorApiData] = useState<CreatorData[]>([])
  const [eventData, setEventData] = useState<EventData[]>([])

  const seriesScrollRef = useRef<HTMLDivElement>(null)

  const [currentIndex, setCurrentIndex] = useState(0)
  
  // Tentukan berapa item yang tampil di layar (sesuaikan dengan desain)
  const itemsPerView = 10
  const maxIndex = Math.max(0, creatorApiData.length - itemsPerView)

  const handleNext = () => {
    if (currentIndex < maxIndex) setCurrentIndex((prev) => prev + 1)
  }

  const handlePrev = () => {
    if (currentIndex > 0) setCurrentIndex((prev) => prev - 1)
  }

   const truncateText = (text: string | null | undefined, maxLength: number = 75) => {
  if (!text) return ""
  const plainText = text.replace(/<[^>]+>/g, '').replace(/\n/g, ' ').trim()
  if (plainText.length <= maxLength) return plainText
  return plainText.substring(0, maxLength).trim() + '...'
}

  const scrollSeries = (direction: 'left' | 'right') => {
    if (seriesScrollRef.current) {
      const scrollAmount = direction === 'left' ? -300 : 300
      seriesScrollRef.current.scrollBy({ left: scrollAmount, behavior: 'smooth' })
    }
  }

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true)
        const token = localStorage.getItem('user_token')
        if (!token) { router.push('/'); return }

        const res = await fetch('/api/home', {
          headers: { Authorization: `Bearer ${token}` },
          cache: 'no-store'
        })
        const json = await res.json()

        if (json.status === true) {
          const list = json.list
          setTrailers(list.trailer || [])
          setLatestFilms(list.films || [])
          setLatestClips(list.latest || [])
          setLatestAwards(list.award || [])
          setMostWatchingFilms(list.watchs || [])
          setSeriesData(list.series || [])
          setCategoryApiData(list.category || [])
          setCreatorApiData(list.creator || [])
          setEventData(list.event || [])
        }
      } catch (err) {
        setError('Failed to load dashboard')
      } finally {
        setLoading(false)
      }
    }
    fetchData()
  }, [router])

  const toggleMute = () => {
    if (videoRef.current) {
      videoRef.current.muted = !videoRef.current.muted
      setIsMuted(videoRef.current.muted)
    }
  }

  const togglePauseTrailer = async () => {
    if (!videoRef.current) return

    if (videoRef.current.paused) {
      try {
        await videoRef.current.play()
        setIsPaused(false)
      } catch {
        setIsPaused(true)
      }
    } else {
      videoRef.current.pause()
      setIsPaused(true)
    }
  }

  const handleVideoEnded = () => {
    if (trailers.length > 1) {
      setCurrentTrailerIndex((prevIndex) => (prevIndex + 1) % trailers.length)
    }
  }

  // --- Transformers ---
  const displayFilms = latestFilms.map(f => ({
    id: f.id,
    title: f.name,
    image: f.image_url ,
    description: f.synopsis || stripHtml(f.description) || 'Watch groundbreaking films.',
    category: f.cats || 'Films',
    rating: f.rates ? `${f.rates}/10` : '8.5/10',
    year: 2025,
    duration: '1h 0m',
    genre: f.cats || 'Films',
  }))

  const displayClips = latestClips.map(c => ({
    id: c.id,
    title: c.name,
    image: c.image_url || '/placeholder.svg',
    description: stripHtml(c.short_desc || c.description).substring(0, 70) + '...',
  }))

  const currentTrailer = trailers[currentTrailerIndex]
  const heroVideo = currentTrailer?.video_url || (currentTrailer?.video ? `https://api.usky.ai/uploads/${currentTrailer.video}` : '')
  const heroImage = currentTrailer?.image_url 

  useEffect(() => {
    if (!heroVideo || !videoRef.current) return

    const playPromise = videoRef.current.play()
    if (playPromise && typeof playPromise.then === 'function') {
      playPromise
        .then(() => setIsPaused(false))
        .catch(() => {
          setIsPaused(true)
          // Ignore autoplay restrictions; video should continue when possible.
        })
    }
  }, [heroVideo])

  return (
    <div className="min-h-screen bg-[#0a1628] text-foreground dark">
      <Header />

      {/* Hero Section with Autoplay & Audio Toggle */}
    <section className="relative min-h-[60vh] lg:min-h-screen overflow-hidden bg-black">
  {heroVideo ? (
    <div className="absolute inset-0 w-full h-full">
      {/* Atribut poster telah dihapus agar langsung memutar video */}
      <video
        ref={videoRef}
        key={heroVideo}
        autoPlay
        muted={isMuted}
        playsInline
        preload="auto" // Tambahkan ini agar buffering video lebih agresif/cepat
        onEnded={handleVideoEnded}
        onPause={() => setIsPaused(true)}
        onPlay={() => setIsPaused(false)}
        onClick={togglePauseTrailer}
        loop={trailers.length <= 1}
        className="w-full h-full object-cover cursor-pointer"
      >
        <source src={heroVideo} type="video/mp4" />
      </video>

      {/* Tombol play di tengah saat video pause */}
      {isPaused && (
        <div className="pointer-events-none absolute inset-0 z-30 flex items-center justify-center">
          <button
            onClick={togglePauseTrailer}
            className="pointer-events-auto h-16 w-16 flex items-center justify-center rounded-full bg-black/45 backdrop-blur-md border border-white/20 text-white transition-all"
            aria-label="Play trailer"
          >
            <Play className="h-8 w-8 fill-white text-white" />
          </button>
        </div>
      )}

      {/* Trailer Controls (Bottom Right) */}
      <div className="absolute bottom-20 right-6 md:bottom-32 lg:right-12 z-30 flex gap-2">
        <button
          onClick={togglePauseTrailer}
          className="h-10 w-10 flex items-center justify-center rounded-full bg-black/40 backdrop-blur-md border border-white/20 text-white transition-all"
          aria-label={isPaused ? 'Play trailer' : 'Pause trailer'}
        >
          {isPaused ? <Play className="h-5 w-5 fill-white" /> : <Pause className="h-5 w-5" />}
        </button>
        <button onClick={toggleMute} className="h-10 w-10 flex items-center justify-center rounded-full bg-black/40 backdrop-blur-md border border-white/20 text-white transition-all">
          {isMuted ? <VolumeX className="h-5 w-5" /> : <Volume2 className="h-5 w-5" />}
        </button>
      </div>
    </div>
  ) : (
    /* DIUBAH: Gambar dihapus dan diganti dengan div kosong berwarna hitam. 
       Ini mencegah gambar muncul sekilas saat menunggu data API heroVideo. */
    <div className="absolute inset-0 w-full h-full bg-black" />
  )}

  <div className="absolute inset-0 bg-gradient-to-t from-[#0a1628] via-black/10 to-transparent" />
  
  <div className="absolute inset-0 flex items-end">
    <div className="w-full px-4 pb-16 md:px-12 md:pb-28 z-20">
      <h1 className="text-2xl md:text-5xl font-bold text-white mb-4">
        {currentTrailer?.name}
      </h1>
      <p className="max-w-xl text-sm md:text-lg text-gray-300 mb-6 line-clamp-2">
        { currentTrailer?.description_text }
      </p>
      <div className="flex gap-4">
        {/* Tampilkan tombol hanya jika id_films valid dan bukan 0 */}
        {currentTrailer?.id_films &&
          String(currentTrailer.id_films).trim() !== '0' && (
          <Button 
            onClick={() => router.push(`/film/detail?id=${currentTrailer.id_films}`)}
            className="bg-white text-black hover:bg-gray-200 px-8 py-6 rounded-md font-bold flex items-center gap-2"
          >
            <Play className="h-5 w-5 fill-black" /> Watch Now
          </Button>
        )}
      </div>
    </div>
  </div>
</section>

      {/* Content Sections */}
      <div className="relative z-10 -mt-10">
        <LatestFilm items={displayFilms} />
        
        {/* Latest Series */}
      <section className="px-4 py-10 md:px-12 border-t border-white/10">
  <div className="flex justify-between items-center mb-6">
    <h2 className="text-xl font-bold text-white">Latest Series</h2>
    <Link href="/series" className="bg-white/10 px-4 py-1.5 rounded-full text-xs text-white hover:bg-white/20 transition-colors">
      View All
    </Link>
  </div>

  {/* =========================================
      TAMPILAN MOBILE (SLIDER HORIZONTAL)
      ========================================= */}
  <div className="relative group lg:hidden">
    {/* Tombol Kiri Mobile */}
    <button
      onClick={() => scrollSeries('left')}
      className="absolute -left-2 top-1/2 z-10 flex h-8 w-8 -translate-y-1/2 items-center justify-center rounded-full bg-[#003B79] text-white shadow-lg backdrop-blur-md"
      aria-label="Scroll left"
    >
      <ChevronLeft className="h-4 w-4" />
    </button>

    {/* Kontainer Scroll Mobile */}
    <div 
      ref={seriesScrollRef}
      className="flex gap-4 overflow-x-auto snap-x snap-mandatory pb-4 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]"
    >
      {loading ? (
        <div className="w-[85vw] flex-shrink-0 snap-center">
          <FeaturedSkeleton />
        </div>
      ) : (
        seriesData.map((s) => (
          <Link 
            key={s.id} 
            href={`/series/detail?id=${s.id}&id_group=${s.id}`} 
            className="w-[85vw] flex-shrink-0 snap-center group relative aspect-video rounded-2xl overflow-hidden block border border-white/5"
          >
            <Image 
              src={s.image_landscape_url || s.image_url || '/placeholder.svg'} 
              alt={s.name} 
              fill 
              className="object-cover transition-transform duration-300 group-hover:scale-105" 
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent" />
            <div className="absolute bottom-4 left-4 right-4">
              <h3 className="text-lg font-bold text-white line-clamp-1">{s.name}</h3>
              {/* --- TAMBAHAN DESKRIPSI MOBILE --- */}
              <p className="text-gray-300 text-xs mt-1 line-clamp-2">
                {s.description ? truncateText(s.description, 100) : ''}
              </p>
            </div>
          </Link>
        ))
      )}
    </div>

    {/* Tombol Kanan Mobile */}
    <button
      onClick={() => scrollSeries('right')}
      className="absolute -right-2 top-1/2 z-10 flex h-8 w-8 -translate-y-1/2 items-center justify-center rounded-full bg-[#003B79] text-white shadow-lg backdrop-blur-md"
      aria-label="Scroll right"
    >
      <ChevronRight className="h-4 w-4" />
    </button>
  </div>

  {/* =========================================
      TAMPILAN DESKTOP (GRID LAMA)
      ========================================= */}
  <div className="hidden lg:grid lg:grid-cols-[1.5fr_1fr] gap-6">
    {loading ? <FeaturedSkeleton /> : seriesData[0] && (
      <Link href={`/series/detail?id=${seriesData[0].id}&id_group=${seriesData[0].id}`} className="group relative aspect-video rounded-3xl overflow-hidden block">
        <Image src={seriesData[0].image_landscape_url || seriesData[0].image_url || ''} alt={seriesData[0].name} fill className="object-cover transition-transform group-hover:scale-105" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent" />
        <div className="absolute bottom-6 left-6 right-6">
          <h3 className="text-2xl font-bold text-white">{seriesData[0].name}</h3>
          {/* --- TAMBAHAN DESKRIPSI DESKTOP KIRI --- */}
          <p className="text-gray-300 text-sm mt-2 line-clamp-2 max-w-xl">
             {seriesData[0].description ? truncateText(seriesData[0].description, 120) : ''}
          </p>
        </div>
      </Link>
    )}
    
    <div className="flex flex-col gap-4">
      {seriesData.slice(1, 4).map(s => (
        <Link key={s.id} href={`/series/detail?id=${s.id}&id_group=${s.id}`} className="group relative h-32 rounded-2xl overflow-hidden flex items-center bg-white/5 border border-white/5 hover:bg-white/10 transition-colors">
          <div className="relative h-full aspect-video">
            <Image src={s.image_landscape_url || s.image_url || ''} alt={s.name} fill className="object-cover" />
          </div>
          <div className="px-4 py-2 flex flex-col justify-center">
            <p className="font-bold text-white text-sm line-clamp-1 mb-1">{s.name}</p>
            {/* Deskripsi List Kanan Desktop (Sudah ada, saya rapikan spacing-nya) */}
            <p className="text-gray-300 text-xs leading-snug line-clamp-2">
              {s.description ? truncateText(s.description, 100) : ''}
            </p>
          </div>
        </Link>
      ))}
    </div>
  </div>
</section>

        <LatestClipSection items={displayClips} />
        <UpcomingEventsSection items={eventData} />
        
        {latestAwards.length > 0 && (
          <LatestAwards title="Latest Awards" items={latestAwards.map(a => ({ ...a, id: String(a.id), image_url: a.image_url || '' }))} />
        )}

        <CategorySection 
          title="Categories"
          items={categoryApiData.map(c => ({ id: c.id, name: c.name, count: c.total_movie || '0', image: c.images_url || '/placeholder.svg' }))} 
        />

        {/* <MostWatchingFilm items={transformFilmData(mostWatchingFilms)} /> */}

        {/* Creators */}
     <section className="px-4 py-12 lg:px-12 border-t border-white/10">
      
      {/* ===== HEADER: Judul Kiri, Tombol Kanan ===== */}
      <div className="flex items-center justify-between mb-8">
        <h2 className="text-2xl font-bold text-white">Creators</h2>
        
        {/* Tombol Kanan Atas */}
        <div className="flex overflow-hidden rounded-sm border border-white/10 bg-[#0a2342]">
          <button
            onClick={handlePrev}
            disabled={currentIndex === 0}
            className="flex h-10 w-10 items-center justify-center border-r border-white/10 text-white transition-colors hover:bg-white/10 disabled:opacity-30 disabled:cursor-not-allowed"
            aria-label="Previous creators"
          >
            <ChevronLeft className="h-4 w-4" />
          </button>
          <button
            onClick={handleNext}
            disabled={currentIndex === maxIndex}
            className="flex h-10 w-10 items-center justify-center text-white transition-colors hover:bg-white/10 disabled:opacity-30 disabled:cursor-not-allowed"
            aria-label="Next creators"
          >
            <ChevronRight className="h-4 w-4" />
          </button>
        </div>
      </div>

      {/* ===== CREATOR LIST (Slider Logic) ===== */}
      <div className="relative overflow-hidden">
        {/* PERUBAHAN 1: gap-8 diubah menjadi gap-4 agar jarak antar kreator lebih kecil (rapat) */}
        <div 
          className="flex transition-transform duration-500 ease-in-out gap-4"
          style={{ transform: `translateX(-${currentIndex * (100 / itemsPerView)}%)` }}
        >
          {creatorApiData.map(creator => (
            /* PERUBAHAN 2: 2rem diubah menjadi 1rem karena mengikuti ukuran gap-4 yang baru */
            <div 
              key={creator.id} 
              className="flex flex-col items-center flex-shrink-0 w-32 md:w-40 lg:w-[calc(100%/10-0.9rem)]"
            >
              <div className="relative h-24 w-24 rounded-full overflow-hidden mb-3 border-2 border-white/10">
                <Image 
                  src={creator.avatar_url || '/images/pngs.png'} 
                  alt={creator.name} 
                  fill 
                  className="object-cover" 
                />
              </div>
              <p className="font-semibold text-sm text-center line-clamp-1">{creator.name}</p>
              <p className="text-xs text-gray-500">{creator.total_video} movies</p>
            </div>
          ))}
        </div>
      </div>

      {/* ===== VIEW ALL BUTTON ===== */}
      <div className="mt-8 flex justify-center">
        <Link href="/home/creator" className="inline-block">
          <button className="px-6 py-2 rounded-md border border-white/20 bg-transparent text-white hover:bg-white/10 transition-colors">
            View All Creators
          </button>
        </Link>
      </div>
    </section>

         <section className="border-t border-border px-4 py-8 md:px-6 md:py-12 lg:px-12">
        <div className="relative min-h-96 overflow-hidden rounded-xl md:min-h-[500px]">
          <div className="absolute inset-0">
            <Image src="/images/design-mode/a.png" alt="Banner Background" fill className="object-cover" />
          </div>

          <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/60 to-transparent" />

          <FutureFilmmaking />
        </div>
      </section>

      </div>

      <Footer />
    </div>
  )
}

function transformFilmData(films: FilmData[]) {
  return films.map(f => ({
    id: f.id,
    title: f.name,
    image: f.image_url,
    description: f.synopsis || 'Watch groundbreaking films.',
    category: f.cats || 'Films',
    rating: f.rates ? `${f.rates}/10` : '8.5/10',
    year: 2025,
    duration: '1h 0m',
    genre: f.cats || 'Films',
  }))
}
