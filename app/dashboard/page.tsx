'use client'

import {
  AlertCircle,
  Calendar,
  ChevronRight,
  Info,
  Menu,
  Play,
  X,
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

interface TrailerData {
  id: string
  name?: string
  description?: string
  image?: string
  image_url?: string
  video?: string
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
  favorit?: string
  my_favorit?: string
}

interface AwardData {
  id: string
  name: string
  image_url?: string
  image?: string
  video_url?: string
  description?: string
  type?: string
  synopsis?: string
}

interface SeriesData {
  id: string
  name: string
  asset_name?: string
  run_time_format?: string
  image?: string
  image_url?: string
  image_landscape?: string
  image_landscape_url?: string
  title?: string
  episode?: string
  duration?: string
}

interface CategoryApiData {
  id: string
  name: string
  images?: string
  images_url?: string
  total_movie?: string
}

interface CreatorData {
  id: string
  sid?: string
  name: string
  email?: string
  avatar?: string
  avatar_url?: string
  total_video?: string
}

// FIX: id string, pakai field name/image_url/genre sesuai AwardItem interface
const mockAwards = [
  {
    id: '1',
    name: '[Judul Film]',
    image_url: '/login-hero.jpg',
    description:
      '[Brief Synopsis] Watch groundbreaking films crafted by human creativity and artificial intelligence.',
    genre: 'Genre',
  },
  {
    id: '2',
    name: '[Judul Film]',
    image_url: '/login-hero.jpg',
    description:
      '[Brief Synopsis] Watch groundbreaking films crafted by human creativity and artificial intelligence.',
    genre: 'Genre',
  },
  {
    id: '3',
    name: '[Judul Film]',
    image_url: '/login-hero.jpg',
    description:
      '[Brief Synopsis] Watch groundbreaking films crafted by human creativity and artificial intelligence.',
    genre: 'Genre',
  },
  {
    id: '4',
    name: '[Judul Film]',
    image_url: '/login-hero.jpg',
    description:
      '[Brief Synopsis] Watch groundbreaking films crafted by human creativity and artificial intelligence.',
    genre: 'Genre',
  },
]

const mockSeries: SeriesData[] = []

const fallbackCategoryData = [
  { id: '1', name: 'Genre', count: '3.2K', image: '/placeholder.svg' },
  { id: '2', name: 'Drama', count: '2.8K', image: '/placeholder.svg' },
  { id: '3', name: 'Action', count: '2.1K', image: '/placeholder.svg' },
  { id: '4', name: 'Sci-Fi', count: '1.9K', image: '/placeholder.svg' },
  { id: '5', name: 'Comedy', count: '1.5K', image: '/placeholder.svg' },
  { id: '6', name: 'Horror', count: '1.2K', image: '/placeholder.svg' },
  { id: '7', name: 'Anime', count: '1.8K', image: '/placeholder.svg' },
]

const mockCreators: CreatorData[] = [
  { id: '1', name: '[Creator]', avatar_url: '/images/pngs.png', total_video: '3' },
  { id: '2', name: '[Creator]', avatar_url: '/images/pngs.png', total_video: '3' },
  { id: '3', name: '[Creator]', avatar_url: '/images/pngs.png', total_video: '3' },
  { id: '4', name: '[Creator]', avatar_url: '/images/pngs.png', total_video: '3' },
  { id: '5', name: '[Creator]', avatar_url: '/images/pngs.png', total_video: '3' },
  { id: '6', name: '[Creator]', avatar_url: '/images/pngs.png', total_video: '3' },
  { id: '7', name: '[Creator]', avatar_url: '/images/pngs.png', total_video: '3' },
]

function LatestClipSection({
  title = 'Latest Clip',
  viewAllLink = '/dashboard/clip',
  items = [],
}: {
  title?: string
  viewAllLink?: string
  items?: any[]
}) {
  const scrollerRef = useRef<HTMLDivElement | null>(null)

  const scrollByAmount = (dir: 'left' | 'right') => {
    const el = scrollerRef.current
    if (!el) return
    const amount = Math.round(el.clientWidth * 0.85)
    el.scrollBy({ left: dir === 'right' ? amount : -amount, behavior: 'smooth' })
  }

  return (
    <section className="border-t border-white/10 px-4 py-6 md:px-6 md:py-8 lg:px-12">
      <div className="mb-4 flex items-center justify-between md:mb-6">
        <Link href={viewAllLink} className="inline-flex items-center gap-2 font-semibold text-white">
          <span className="text-xs md:text-base">{title}</span>
          <span className="text-white/70">›</span>
        </Link>

        <div className="flex items-center gap-1">
          <span className="h-[2px] w-2 rounded-full bg-white/80 md:w-3" />
          <span className="h-[2px] w-2 rounded-full bg-white/40 md:w-3" />
          <span className="h-[2px] w-2 rounded-full bg-white/30 md:w-3" />
        </div>
      </div>

      <div className="relative">
        <div
          ref={scrollerRef}
          className="flex gap-3 overflow-x-auto scroll-smooth pb-2 pr-8 md:gap-6 md:pr-12"
          style={{ scrollbarWidth: 'none' }}
        >
          {items.map((film) => (
            <div key={film.id} className="w-[200px] flex-shrink-0 md:w-[260px] lg:w-[280px]">
              <div className="group relative overflow-hidden rounded-xl bg-black md:rounded-2xl">
                <div className="relative h-[260px] w-full md:h-[360px]">
                  <Image
                    src={film.image || '/placeholder.svg'}
                    alt={film.title}
                    fill
                    className="object-cover object-center transition-transform duration-500 group-hover:scale-105"
                  />

                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="flex h-8 w-8 items-center justify-center rounded-full border border-white/20 bg-black/35 backdrop-blur-sm md:h-10 md:w-10">
                      <Play className="h-3 w-3 fill-white text-white md:h-4 md:w-4" />
                    </div>
                  </div>

                  <div className="absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t from-black/90 via-black/55 to-transparent md:h-44" />
                </div>

                <div className="absolute bottom-0 left-0 right-0 p-3 md:p-4">
                  <p className="mb-1 line-clamp-1 text-xs font-semibold text-white md:text-sm">
                    {film.title}
                  </p>
                  <p className="mb-2 hidden line-clamp-2 text-[10px] leading-relaxed text-white/70 md:mb-3 md:block md:text-[11px]">
                    {film.description}
                  </p>

                  <div className="flex items-center justify-between text-[10px] text-white/60 md:text-[11px]">
                    <span>{film.genre || '[Genre]'}</span>
                    <span>{film.duration || '1h 0m'}</span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        <button
          onClick={() => scrollByAmount('right')}
          className="absolute right-0 top-1/2 flex h-8 w-8 translate-x-2 -translate-y-1/2 items-center justify-center rounded-lg bg-white/95 text-black shadow-md transition-colors hover:bg-white md:h-10 md:w-10 md:translate-x-4 lg:translate-x-6"
          aria-label="Next"
        >
          <span className="text-lg leading-none md:text-xl">›</span>
        </button>
      </div>
    </section>
  )
}

export default function DashboardPage() {
  const [trailerData, setTrailerData] = useState<TrailerData | null>(null)
  const [latestFilms, setLatestFilms] = useState<FilmData[]>([])
  const [latestAwards, setLatestAwards] = useState<AwardData[]>([])
  const [mostWatchingFilms, setMostWatchingFilms] = useState<FilmData[]>([])
  const [seriesData, setSeriesData] = useState<SeriesData[]>([])
  const [categoryApiData, setCategoryApiData] = useState<CategoryApiData[]>([])
  const [creatorApiData, setCreatorApiData] = useState<CreatorData[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const router = useRouter()
  const heroTitle = trailerData?.name || '[Judul Film]'
  const [isTrailerPlaying, setIsTrailerPlaying] = useState(false)
  const [eventData, setEventData] = useState<EventData[]>([])

  const heroImage =
    trailerData?.image_url ||
    (trailerData?.image
      ? `https://api.usky.ai/uploads/${trailerData.image}`
      : '/login-hero.jpg')

  const heroVideo =
    trailerData?.video_url ||
    (trailerData?.video
      ? `https://api.usky.ai/uploads/${trailerData.video}`
      : '')

  const handleWatchTrailer = () => {
    if (!heroVideo) return
    setIsTrailerPlaying(true)
  }

  const handleCloseTrailer = () => {
    setIsTrailerPlaying(false)
  }

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true)
        const token = localStorage.getItem('user_token')

        if (!token) {
          router.push('/')
          return
        }

        const response = await fetch('/api/home', {
          method: 'GET',
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
          cache: 'no-store',
        })

        const data = await response.json()

        if (data.status === true || data.status !== false) {
          if (data.list?.trailer && Array.isArray(data.list.trailer)) {
            setTrailerData(data.list.trailer[0] ?? null)
          }
          if (data.list?.latest && Array.isArray(data.list.latest)) {
            setLatestFilms(data.list.latest)
          }
          if (data.list?.award && Array.isArray(data.list.award)) {
            setLatestAwards(data.list.award)
          }
          if (data.list?.watchs && Array.isArray(data.list.watchs)) {
            setMostWatchingFilms(data.list.watchs)
          }
          if (data.list?.series && Array.isArray(data.list.series)) {
            setSeriesData(data.list.series)
          }
          if (data.list?.category && Array.isArray(data.list.category)) {
            setCategoryApiData(data.list.category)
          }
          if (data.list?.creator && Array.isArray(data.list.creator)) {
            setCreatorApiData(data.list.creator)
          }
          if (data.list?.event && Array.isArray(data.list.event)) {
            setEventData(data.list.event)
          }
          setError(null)
        } else {
          setError(data.message || 'Failed to fetch data')
        }
      } catch (err) {
        console.error('[v0] Dashboard fetch error:', err)
        setError('Failed to fetch dashboard data')
      } finally {
        setLoading(false)
      }
    }

    fetchDashboardData()
  }, [router])

  function stripHtml(html?: string) {
    if (!html) return ''
    return html
      .replace(/<[^>]*>/g, ' ')
      .replace(/&nbsp;/g, ' ')
      .replace(/&amp;/g, '&')
      .replace(/&quot;/g, '"')
      .replace(/&#39;/g, "'")
      .replace(/&ldquo;|&rdquo;/g, '"')
      .replace(/&lsquo;|&rsquo;/g, "'")
      .replace(/&mdash;/g, '—')
      .replace(/&bull;/g, '•')
      .replace(/\s+/g, ' ')
      .trim()
  }

  // FIX 1 & 3: year harus number (parseInt), bukan string
  const transformFilmData = (films: FilmData[]) => {
    return films.map((film) => ({
      id: film.id,
      title: film.name,
      image: film.image_url || '/login-hero.jpg',
      description:
        film.synopsis ||
        stripHtml(film.description) ||
        'Watch groundbreaking films crafted by human creativity and artificial intelligence.',
      category: film.cats || 'Films',
      rating: film.rates ? `${film.rates}/10` : '8.5/10',
      year: parseInt(film.years || '2025', 10), // ← number, bukan string
      duration: film.run_time_format || '1h 0m',
      categories: [film.cats || 'Genre', 'AI'],
      genre: film.cats || 'Films',
    }))
  }

  // FIX 2: id di-cast ke string agar cocok dengan AwardItem
  const transformAwardData = (awards: AwardData[]) => {
    return awards.map((award) => ({
      id: String(award.id), // ← string, bukan number
      name: award.name,
      image_url: award.image_url || award.image || '/placeholder.svg',
      description: stripHtml(award.description || award.synopsis || ''),
      genre: award.type || '',
    }))
  }

  const displayFilms = latestFilms.length > 0 ? transformFilmData(latestFilms) : []
  const displayAwards = latestAwards.length > 0 ? transformAwardData(latestAwards) : []
  const displayMostWatching =
    mostWatchingFilms.length > 0 ? transformFilmData(mostWatchingFilms) : []
  const displaySeries = seriesData.length > 0 ? seriesData : mockSeries
  const displayCategories =
    categoryApiData.length > 0
      ? categoryApiData.map((item) => ({
          id: item.id,
          name: item.name,
          count: item.total_movie || '0',
          image: item.images_url || '/placeholder.svg',
        }))
      : fallbackCategoryData
  const displayCreators = creatorApiData.length > 0 ? creatorApiData : mockCreators

  return (
    <div className="min-h-screen bg-[#0a1628] text-foreground dark">
      <Header />

      {error && (
        <div className="mx-4 mt-4 flex items-center gap-3 rounded-lg border border-red-500/30 bg-red-950/30 px-4 py-4 md:mx-6 lg:mx-12">
          <AlertCircle className="h-5 w-5 text-red-500" />
          <p className="text-sm text-red-300">{error}</p>
        </div>
      )}

      <section className="relative min-h-[50vh] overflow-hidden md:min-h-[70vh] lg:min-h-screen">
        {isTrailerPlaying && heroVideo ? (
          <video
            key={heroVideo}
            autoPlay
            muted
            loop
            playsInline
            controls={false}
            className="absolute inset-0 h-full w-full object-cover"
          >
            <source src={heroVideo} type="video/mp4" />
            Browser Anda tidak mendukung video.
          </video>
        ) : (
          <Image
            src={heroImage}
            alt={heroTitle}
            fill
            priority
            className="object-cover"
          />
        )}

        <div className="absolute inset-0 bg-gradient-to-t from-background via-black/20 to-transparent" />

        <div className="absolute inset-0 flex items-end">
          <div className="w-full px-4 pb-[60px] md:px-6 md:pb-[112px] lg:px-12 lg:pb-[112px]">
            <h1 className="mb-2 text-xl font-bold text-white md:mb-3 md:text-4xl lg:text-5xl">
              {heroTitle}
            </h1>

            <p className="mb-4 max-w-2xl line-clamp-2 text-xs text-gray-300 md:mb-5 md:line-clamp-none md:text-base lg:text-lg">
              Watch groundbreaking films crafted by human creativity and artificial intelligence.
            </p>

            <div className="flex gap-3">
              <Button
                onClick={handleWatchTrailer}
                disabled={!heroVideo}
                className="bg-white py-2 text-sm text-background hover:bg-gray-200 disabled:opacity-50 md:py-2.5 md:text-base"
              >
                ▶ Watch Now
              </Button>

              {isTrailerPlaying && (
                <Button
                  onClick={handleCloseTrailer}
                  className="border border-white/20 bg-black/30 py-2 text-sm text-white hover:bg-black/50 md:py-2.5 md:text-base"
                >
                  ✕ Close
                </Button>
              )}
            </div>
          </div>
        </div>

        <div className="absolute bottom-[60px] left-1/2 -translate-x-1/2 md:bottom-[112px] lg:bottom-[112px]">
          <div className="flex gap-1">
            <div className="h-1 w-6 rounded-full bg-white" />
            <div className="h-1 w-1 rounded-full bg-gray-400" />
            <div className="h-1 w-1 rounded-full bg-gray-400" />
            <div className="h-1 w-1 rounded-full bg-gray-400" />
          </div>
        </div>
      </section>

      <LatestFilm items={displayFilms} />

      <section className="border-t border-white/10 px-4 py-6 md:px-6 md:py-10 lg:px-12">
        <div className="mb-4 flex items-center justify-between md:mb-6">
          <h2 className="text-sm font-semibold text-white md:text-lg">Latest Series</h2>
          <Link
            href="/dashboard/series"
            className="rounded-full border border-white/10 bg-white/10 px-3 py-1 text-xs font-medium text-white/90 transition-colors hover:bg-white/15 md:px-4 md:py-1.5"
          >
            View All
          </Link>
        </div>

        <div className="grid grid-cols-1 gap-4 md:gap-6 lg:grid-cols-[1fr_340px]">
          {loading ? (
            <FeaturedSkeleton />
          ) : displaySeries[0] ? (
            <Link href={`/dashboard/series/detail?id=${displaySeries[0].id}`} className="group block">
              <div className="relative aspect-[16/10] w-full overflow-hidden rounded-xl bg-black md:aspect-[1066/660] md:rounded-3xl">
                <Image
                  src={
                    displaySeries[0].image_landscape_url ||
                    displaySeries[0].image_url ||
                    displaySeries[0].image ||
                    '/login-hero.jpg'
                  }
                  alt={displaySeries[0].name}
                  fill
                  priority
                  sizes="(min-width: 1066px) 65vw, 100vw"
                  className="absolute inset-0 h-full w-full object-cover object-center transition-transform duration-500 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/30 to-transparent" />

                <div className="absolute bottom-4 left-4 right-4 md:bottom-6 md:left-6 md:right-6">
                  <h3 className="mb-3 text-base font-semibold text-white md:mb-4 md:text-xl">
                    {displaySeries[0].name}
                  </h3>

                  <p className="mb-3 text-xs text-white/70 md:mb-4 md:text-sm">
                    {displaySeries[0].asset_name} • {displaySeries[0].run_time_format}
                  </p>

                  <div className="flex items-center gap-2 md:gap-3">
                    <button className="inline-flex items-center gap-2 rounded-full bg-white px-4 py-1.5 text-xs font-semibold text-black transition-colors hover:bg-gray-200 md:px-5 md:py-2 md:text-sm">
                      <Play className="h-3 w-3 fill-black md:h-4 md:w-4" />
                      Watch Now
                    </button>
                    <button className="flex h-9 w-9 items-center justify-center rounded-full border border-white/10 bg-white/10 text-white transition-colors hover:bg-white/20 md:h-10 md:w-10">
                      <Info className="h-4 w-4 md:h-5 md:w-5" />
                    </button>
                  </div>
                </div>
              </div>
            </Link>
          ) : null}

          <div className="flex flex-col gap-3 md:gap-6">
            {loading ? (
              <>
                <SeriesSkeleton />
                <SeriesSkeleton />
                <SeriesSkeleton />
              </>
            ) : (
              displaySeries.slice(1, 4).map((series) => (
                <Link
                  key={series.id}
                  href={`/dashboard/series/detail?id=${series.id}`}
                  className="group relative overflow-hidden rounded-lg md:rounded-2xl"
                >
                  <div className="relative aspect-[16/9] w-full bg-black md:aspect-[302/160]">
                    <Image
                      src={
                        series.image_landscape_url ||
                        series.image_url ||
                        series.image ||
                        '/placeholder.svg'
                      }
                      alt={series.name}
                      fill
                      className="object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                  </div>

                  <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/30 to-transparent" />

                  <div className="absolute bottom-3 left-3 right-3 md:bottom-4 md:left-4 md:right-4">
                    <p className="truncate text-xs font-semibold text-white md:text-sm">
                      {series.name}
                    </p>
                    <p className="mt-0.5 text-[10px] text-white/70 md:mt-1 md:text-xs">
                      {series.asset_name} • {series.run_time_format}
                    </p>
                  </div>
                </Link>
              ))
            )}
          </div>
        </div>
      </section>

      <LatestClipSection title="Latest Clip" items={loading ? [] : displayFilms} />

      <UpcomingEventsSection title="Upcoming Events" items={eventData} />

      {loading ? (
        <section className="px-4 py-6 md:px-6 md:py-8 lg:px-12">
          <div className="mb-4 flex items-center justify-between md:mb-6">
            <h2 className="text-lg font-bold text-foreground md:text-2xl">Latest Awards</h2>
          </div>
          <div className="grid grid-cols-1 gap-4 md:gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {[1, 2, 3, 4].map((i) => (
              <AwardSkeleton key={i} />
            ))}
          </div>
        </section>
      ) : (
        <LatestAwards
          title="Latest Awards"
          viewAllLink="/dashboard/awards"
          items={displayAwards.length > 0 ? displayAwards : mockAwards}
        />
      )}

      <CategorySection title="Category" viewAllLink="/dashboard/film" items={displayCategories} />

      <MostWatchingFilm items={displayMostWatching} />

      <section className="border-t border-border px-4 py-6 md:px-6 md:py-8 lg:px-12">
        <div className="mb-4 flex items-center justify-between md:mb-6">
          <h2 className="text-lg font-bold text-foreground md:text-2xl">Creator</h2>
          <div className="flex gap-2">
            <button className="rounded-full bg-accent/20 p-1.5 transition-colors hover:bg-accent/40 md:p-2">
              <X className="h-4 w-4 text-white md:h-5 md:w-5" />
            </button>
            <button className="rounded-full bg-accent/20 p-1.5 transition-colors hover:bg-accent/40 md:p-2">
              <Menu className="h-4 w-4 text-white md:h-5 md:w-5" />
            </button>
          </div>
        </div>

        <div className="flex gap-3 overflow-x-auto pb-4 md:gap-6">
          {displayCreators.map((creator) => (
            <div key={creator.id} className="flex flex-shrink-0 flex-col items-center">
              <div className="relative mb-2 h-16 w-16 overflow-hidden rounded-full bg-white/10 md:mb-4 md:h-24 md:w-24">
                <Image
                  src={creator.avatar_url || '/images/pngs.png'}
                  alt={creator.name}
                  fill
                  className="object-cover"
                />
              </div>
              <p className="text-center text-sm font-semibold text-foreground">{creator.name}</p>
              <p className="text-center text-xs text-muted-foreground">
                {creator.total_video || '0'} movies
              </p>
            </div>
          ))}
        </div>

        <div className="mt-8 flex justify-center">
          <Link
            href="/dashboard/creator"
            className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/10 px-4 py-1.5 text-xs font-medium text-white/90 transition-colors hover:bg-white/15 md:px-5 md:py-2 md:text-sm"
          >
            <span>View all creator</span>
            <ChevronRight className="h-4 w-4" />
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

      <section className="mx-4 mb-6 mt-8 md:mx-6 md:mb-8 md:mt-12 lg:mx-12">
        <div className="relative overflow-hidden rounded-lg border border-white/10">
          <div className="absolute inset-0">
            <Image src="/images/usky-tv-bg.png" alt="Background" fill className="object-cover" />
          </div>
          <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/60 to-black/40" />

          <div className="relative flex flex-col items-center justify-between gap-4 px-4 py-6 md:gap-8 md:px-6 md:py-8 lg:flex-row lg:px-12 lg:py-12">
            <div className="max-w-md flex-1">
              <div className="mb-3 inline-block rounded-full bg-foreground px-3 py-1 text-xs font-semibold text-background md:mb-4">
                Coming Soon
              </div>
              <h2 className="mb-3 text-2xl font-bold leading-tight text-foreground md:mb-4 md:text-3xl lg:text-4xl">
                Get the USKY TV for free
              </h2>
              <ul className="space-y-1.5 text-xs text-muted-foreground md:space-y-2 md:text-sm">
                <li className="flex items-start gap-2">
                  <span className="mt-1 text-accent">•</span>
                  <span>Live events, films and shows</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="mt-1 text-accent">•</span>
                  <span>Offline viewing</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="mt-1 text-accent">•</span>
                  <span>Event reminders</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  )
}