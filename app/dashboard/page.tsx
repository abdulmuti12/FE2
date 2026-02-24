'use client'

import { Calendar } from "@/components/ui/calendar"
import { User, Ticket, CreditCard, Settings, LogOut, Search, X, Menu, Play, Info } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
import { useState, useRef, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Header } from '@/components/header'
import { Footer } from '@/components/footer'

const mockFilms = [
  { id: 1, title: '[Judul Film]', year: '2025 • 1h 0m', image: '/login-hero.jpg', description: '[Brief Synopsis] Watch groundbreaking films crafted by human creativity and artificial intelligence.', category: 'Action', rating: '8.5/10', categories: ['Films', 'Genre'] },
  { id: 2, title: '[Judul Film]', year: '2025 • 1h 0m', image: '/login-hero.jpg', description: '[Brief Synopsis] Discover amazing cinematic experiences.', category: 'Drama', rating: '9.0/10', categories: ['Films', 'Genre'] },
  { id: 3, title: '[Judul Film]', year: '2025 • 1h 0m', image: '/login-hero.jpg', description: '[Brief Synopsis] Experience AI-powered storytelling.', category: 'Sci-Fi', rating: '8.8/10', categories: ['Films', 'Genre'] },
  { id: 4, title: '[Judul Film]', year: '2025 • 1h 0m', image: '/login-hero.jpg', description: '[Brief Synopsis] Journey through immersive worlds.', category: 'Fantasy', rating: '8.3/10', categories: ['Films', 'Genre'] },
]

const mockAwards = [
  { id: 1, title: '[Judul Film]', image: '/login-hero.jpg', description: '[Brief Synopsis] Watch groundbreaking films crafted by human creativity and artificial intelligence.', category: 'Genre', rating: '8.5/10' },
  { id: 2, title: '[Judul Film]', image: '/login-hero.jpg', description: '[Brief Synopsis] Watch groundbreaking films crafted by human creativity and artificial intelligence.', category: 'Genre', rating: '9.0/10' },
  { id: 3, title: '[Judul Film]', image: '/login-hero.jpg', description: '[Brief Synopsis] Watch groundbreaking films crafted by human creativity and artificial intelligence.', category: 'Genre', rating: '8.8/10' },
  { id: 4, title: '[Judul Film]', image: '/login-hero.jpg', description: '[Brief Synopsis] Watch groundbreaking films crafted by human creativity and artificial intelligence.', category: 'Genre', rating: '8.3/10' },
]

const mockMostWatching = [
  { id: 1, title: '[Judul Film]', year: '2025 • 1h 0m', image: '/login-hero.jpg', description: '[Brief Synopsis] Watch groundbreaking films crafted by human creativity and artificial intelligence.', categories: ['Genre', 'Genre'], viewers: 4 },
  { id: 2, title: '[Judul Film]', year: '2025 • 1h 0m', image: '/login-hero.jpg', description: '[Brief Synopsis] Watch groundbreaking films crafted by human creativity and artificial intelligence.', categories: ['Genre', 'Genre'], viewers: 3 },
  { id: 3, title: '[Judul Film]', year: '2025 • 1h 0m', image: '/login-hero.jpg', description: '[Brief Synopsis] Watch groundbreaking films crafted by human creativity and artificial intelligence.', categories: ['Genre', 'Genre'], viewers: 3 },
  { id: 4, title: '[Judul Film]', year: '2025 • 1h 0m', image: '/login-hero.jpg', description: '[Brief Synopsis] Watch groundbreaking films crafted by human creativity and artificial intelligence.', categories: ['Genre', 'Genre'], viewers: 2 },
]

const mockSeries = [
  { id: 1, title: '[Judul Series]', episode: 'Episode 1', duration: '1h 0m', image: '/images/featured-series.png', featured: true },
  { id: 2, title: '[Judul Series]', episode: 'Episode 2', duration: '1h 0m', image: '/film/film1.png' },
  { id: 3, title: '[Judul Series]', episode: 'Episode 3', duration: '1h 0m', image: '/film/film2.png' },
  { id: 4, title: '[Judul Series]', episode: 'Episode 4', duration: '1h 0m', image: '/images/imageheader.png' },
]

const categoryData = [
  { name: 'Genre', count: '3.2K' },
  { name: 'Drama', count: '2.8K' },
  { name: 'Action', count: '2.1K' },
  { name: 'Sci-Fi', count: '1.9K' },
  { name: 'Comedy', count: '1.5K' },
  { name: 'Horror', count: '1.2K' },
  { name: 'Anime', count: '1.8K' },
]

const mockCreators = [
  { id: 1, name: '[Creator]', movies: '3 Movies', colors: ['cyan', 'white'] },
  { id: 2, name: '[Creator]', movies: '3 Movies', colors: ['pink', 'white'] },
  { id: 3, name: '[Creator]', movies: '3 Movies', colors: ['cyan', 'white'] },
  { id: 4, name: '[Creator]', movies: '3 Movies', colors: ['purple', 'white'] },
  { id: 5, name: '[Creator]', movies: '3 Movies', colors: ['cyan', 'white'] },
  { id: 6, name: '[Creator]', movies: '3 Movies', colors: ['purple', 'white'] },
  { id: 7, name: '[Creator]', movies: '3 Movies', colors: ['pink', 'white'] },
]

const creatorData = [
  { name: 'Creator', count: '1.2K' },
  { name: 'Creator', count: '1.1K' },
  { name: 'Creator', count: '0.9K' },
  { name: 'Creator', count: '0.8K' },
  { name: 'Creator', count: '0.7K' },
  { name: 'Creator', count: '0.6K' },
  { name: 'Creator', count: '0.5K' },
]

function CarouselSection({
  title,
  viewAllLink = '#',
  items = mockFilms,
  layout = 'default',
}: {
  title: string
  viewAllLink?: string
  items?: typeof mockFilms
  layout?: 'default' | 'category' | 'creator'
}) {
  const [currentIndex, setCurrentIndex] = useState(0)
  const itemsPerView = layout === 'creator' ? 7 : layout === 'default' ? 4 : 7
  const maxIndex = Math.max(0, items.length - itemsPerView)
  const handleNext = () => currentIndex < maxIndex && setCurrentIndex(currentIndex + 1)
  const handlePrev = () => currentIndex > 0 && setCurrentIndex(currentIndex - 1)

  return (
    <section className="px-4 md:px-6 lg:px-12 py-6 md:py-8 border-t border-border">
      <div className="flex items-center justify-between mb-4 md:mb-6">
        <h2 className="text-lg md:text-2xl font-bold text-foreground">{title}</h2>
        <a href={viewAllLink} className="text-white text-xs md:text-sm font-medium hover:text-gray-300 transition-colors">
          View All
        </a>
      </div>

      <div className="relative">
        <div className="overflow-hidden">
          <div className="flex transition-transform duration-300 gap-4" style={{ transform: `translateX(-${currentIndex * (100 / itemsPerView)}%)` }}>
            {layout === 'category'
              ? categoryData.map((item, idx) => (
                  <div key={idx} className="flex-shrink-0 w-1/3 sm:w-1/4 lg:w-1/7 text-center">
                    <div className="w-full aspect-square rounded-full bg-gradient-to-br from-[#4c7c3f] to-[#2a4a2a] mb-2 md:mb-3 flex items-center justify-center">
                      <span className="text-2xl md:text-4xl text-white">🎬</span>
                    </div>
                    <p className="text-xs md:text-sm font-medium text-foreground">{item.name}</p>
                    <p className="text-xs text-muted-foreground">{item.count}</p>
                  </div>
                ))
              : layout === 'creator'
              ? creatorData.map((item, idx) => (
                  <div key={idx} className="flex-shrink-0 w-1/3 sm:w-1/4 lg:w-1/7 text-center">
                    <div className="w-full aspect-square rounded-full bg-gradient-to-br from-[#7c4c9f] to-[#4a2a6a] mb-2 md:mb-3 flex items-center justify-center">
                      <span className="text-2xl md:text-4xl text-white">👤</span>
                    </div>
                    <p className="text-xs md:text-sm font-medium text-foreground">{item.name}</p>
                    <p className="text-xs text-muted-foreground">{item.count}</p>
                  </div>
                ))
              : items.map((film) => (
                  <div key={film.id} className="flex-shrink-0 w-1/2 md:w-1/4 lg:w-1/4">
                    <div className="relative h-40 md:h-60 mb-2 md:mb-4 rounded-lg overflow-hidden group">
                      <Image src={film.image || "/placeholder.svg"} alt={film.title} fill className="object-cover hover:scale-105 transition-transform duration-300" />
                    </div>
                    <p className="font-semibold text-sm md:text-base text-foreground mb-1">{film.title}</p>
                    {(film as any).year && <p className="text-xs text-muted-foreground">{(film as any).year}</p>}
                    <p className="text-xs text-muted-foreground mb-2 md:mb-3 line-clamp-2">{film.description}</p>
                    <div className="flex gap-2 flex-wrap">
                      {(film as any).categories?.map((cat: string, idx: number) => (
                        <Button key={idx} size="sm" className="text-xs bg-gray-200 text-black hover:bg-gray-300 rounded-full px-4" variant="default">
                          {cat}
                        </Button>
                      )) || (
                        <>
                          <Button size="sm" className="text-xs bg-gray-200 text-black hover:bg-gray-300 rounded-full px-4" variant="default">
                            Watch
                          </Button>
                          <Button size="sm" className="text-xs bg-gray-200 text-black hover:bg-gray-300 rounded-full px-4" variant="default">
                            Add List
                          </Button>
                        </>
                      )}
                    </div>
                  </div>
                ))}
          </div>
        </div>

        {currentIndex > 0 && (
          <button onClick={handlePrev} className="absolute left-0 top-1/3 -translate-y-1/2 -translate-x-12 lg:-translate-x-6 z-10 bg-accent/20 hover:bg-accent/40 p-2 rounded-full transition-colors">
            <X className="w-5 h-5 text-white" />
          </button>
        )}
        {currentIndex < maxIndex && (
          <button onClick={handleNext} className="absolute right-0 top-1/3 -translate-y-1/2 translate-x-12 lg:translate-x-6 z-10 bg-accent/20 hover:bg-accent/40 p-2 rounded-full transition-colors">
            <Menu className="w-5 h-5 text-white" />
          </button>
        )}
      </div>
    </section>
  )
}

function LatestClipSection({
  title = "Latest Clip",
  viewAllLink = "/dashboard/clips",
  items = mockFilms,
}: {
  title?: string
  viewAllLink?: string
  items?: typeof mockFilms
}) {
  const scrollerRef = useRef<HTMLDivElement | null>(null)

  const scrollByAmount = (dir: "left" | "right") => {
    const el = scrollerRef.current
    if (!el) return
    const amount = Math.round(el.clientWidth * 0.85)
    el.scrollBy({ left: dir === "right" ? amount : -amount, behavior: "smooth" })
  }

  return (
    <section className="px-4 md:px-6 lg:px-12 py-6 md:py-8 border-t border-white/10">
      <div className="flex items-center justify-between mb-4">
        <Link href={viewAllLink} className="inline-flex items-center gap-2 text-white font-semibold">
          <span className="text-sm md:text-base">{title}</span>
          <span className="text-white/70">›</span>
        </Link>

        <div className="flex items-center gap-1">
          <span className="w-3 h-[2px] rounded-full bg-white/80" />
          <span className="w-3 h-[2px] rounded-full bg-white/40" />
          <span className="w-3 h-[2px] rounded-full bg-white/30" />
        </div>
      </div>

      <div className="relative">
        <div
          ref={scrollerRef}
          className="flex gap-6 overflow-x-auto scroll-smooth pb-2 pr-12"
          style={{ scrollbarWidth: "none" }}
        >
          {items.map((film) => (
            <div key={film.id} className="flex-shrink-0 w-[240px] md:w-[260px] lg:w-[280px]">
              <div className="relative rounded-2xl overflow-hidden bg-black group">
                <div className="relative w-full h-[320px] md:h-[360px]">
                  <Image
                    src={film.image || "/placeholder.svg"}
                    alt={film.title}
                    fill
                    className="object-cover object-center group-hover:scale-105 transition-transform duration-500"
                  />

                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-10 h-10 rounded-full bg-black/35 border border-white/20 flex items-center justify-center backdrop-blur-sm">
                      <Play className="w-4 h-4 text-white fill-white" />
                    </div>
                  </div>

                  <div className="absolute inset-x-0 bottom-0 h-44 bg-gradient-to-t from-black/90 via-black/55 to-transparent" />
                </div>

                <div className="absolute left-0 right-0 bottom-0 p-4">
                  <p className="text-white font-semibold text-sm mb-1 line-clamp-1">{film.title}</p>
                  <p className="text-white/70 text-[11px] leading-relaxed line-clamp-2 mb-3">
                    {film.description}
                  </p>

                  <div className="flex items-center justify-between text-[11px] text-white/60">
                    <span>[Genre]</span>
                    <span>1h 0m</span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        <button
          onClick={() => scrollByAmount("right")}
          className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-4 md:translate-x-6 w-10 h-10 rounded-lg bg-white/95 text-black shadow-md hover:bg-white transition-colors flex items-center justify-center"
          aria-label="Next"
        >
          <span className="text-xl leading-none">›</span>
        </button>
      </div>
    </section>
  )
}

export default function DashboardPage() {
  return (
    <div className="min-h-screen bg-[#0a1628] text-foreground dark">
      <Header />

      {/* Hero Section */}
     {/* Hero Section (responsive + turun ~3cm) */}
<section className="relative overflow-hidden min-h-[70vh] md:min-h-screen">
  <Image src="/login-hero.jpg" alt="Hero" fill priority className="object-cover" />

  {/* overlay */}
  <div className="absolute inset-0 bg-gradient-to-t from-background via-black/20 to-transparent" />

  {/* CONTENT: turun ~3cm (≈112px) */}
  <div className="absolute inset-0 flex items-end">
    <div className="w-full px-4 md:px-6 lg:px-12 pb-[112px] md:pb-[112px]">
      <h1 className="text-2xl md:text-4xl lg:text-5xl font-bold text-white mb-3">
        [Judul Film]
      </h1>

      <p className="text-sm md:text-base lg:text-lg text-gray-300 mb-5 max-w-2xl">
        Watch groundbreaking films crafted by human creativity and artificial intelligence.
      </p>

      <Button className="bg-white text-background hover:bg-gray-200">
        ▶ Watch Now
      </Button>
    </div>
  </div>

  {/* INDICATOR: ikut turun ~3cm juga */}
  <div className="absolute left-1/2 -translate-x-1/2 bottom-[112px] md:bottom-[112px]">
    <div className="flex gap-1">
      <div className="w-6 h-1 bg-white rounded-full" />
      <div className="w-1 h-1 bg-gray-400 rounded-full" />
      <div className="w-1 h-1 bg-gray-400 rounded-full" />
      <div className="w-1 h-1 bg-gray-400 rounded-full" />
    </div>
  </div>
</section>

      <CarouselSection title="Latest Films" items={mockFilms} />

      {/* Latest Series Section */}
      <section className="px-4 md:px-6 lg:px-12 py-10 border-t border-white/10">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-base md:text-lg font-semibold text-white">Latest Series</h2>
          <Link href="/dashboard/series" className="text-xs font-medium text-white/90 bg-white/10 hover:bg-white/15 border border-white/10 rounded-full px-4 py-1.5 transition-colors">
            View All
          </Link>
        </div>

        <div className="grid gap-6 lg:grid-cols-[1fr_340px]">
          {mockSeries[0] && (
            <Link href={`/dashboard/series/detail?id=${mockSeries[0].id}`} className="group block">
              <div className="relative w-full aspect-[1066/660] rounded-3xl overflow-hidden bg-black">
                <Image
                  src="/login-hero.jpg"
                  alt={mockSeries[0].title}
                  fill
                  priority
                  sizes="(min-width: 1066px) 65vw, 100vw"
                  className="absolute inset-0 h-full w-full object-cover object-center group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/30 to-transparent" />

                <div className="absolute bottom-6 left-6 right-6">
                  <h3 className="text-white font-semibold text-xl mb-4">{mockSeries[0].title}</h3>
                  <div className="flex items-center gap-3">
                    <button className="inline-flex items-center gap-2 bg-white text-black hover:bg-gray-200 rounded-full px-5 py-2 text-sm font-semibold transition-colors">
                      <Play className="w-4 h-4 fill-black" />
                      Watch Now
                    </button>
                    <button className="w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 border border-white/10 flex items-center justify-center text-white transition-colors">
                      <Info className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              </div>
            </Link>
          )}

          <div className="flex flex-col gap-6">
            {mockSeries.slice(1, 4).map((series) => (
              <Link key={series.id} href={`/dashboard/series/detail?id=${series.id}`} className="relative rounded-2xl overflow-hidden group">
                <div className="relative w-full aspect-[302/160] bg-black">
                  <Image
                    src={series.image || "/placeholder.svg"}
                    alt={series.title}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                </div>

                <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/30 to-transparent" />

                <div className="absolute bottom-4 left-4 right-4">
                  <p className="text-white font-semibold text-sm truncate">{series.title}</p>
                  <p className="text-white/70 text-xs mt-1">
                    {series.episode} • {series.duration}
                  </p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Latest Clip Section (baru, presisi seperti screenshot) */}
      <LatestClipSection title="Latest Clip" items={mockFilms} />

      <CarouselSection title="Latest Awards" items={mockAwards} />
      <CarouselSection title="Category" items={categoryData as any} layout="category" />
      <CarouselSection title="Most Watching Film" items={mockMostWatching as any} />

      {/* Creator Section */}
      <section className="px-6 lg:px-12 py-8 border-t border-border">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-foreground">Creator</h2>
          <div className="flex gap-2">
            <button className="bg-accent/20 hover:bg-accent/40 p-2 rounded-full transition-colors">
              <X className="w-5 h-5 text-white" />
            </button>
            <button className="bg-accent/20 hover:bg-accent/40 p-2 rounded-full transition-colors">
              <Menu className="w-5 h-5 text-white" />
            </button>
          </div>
        </div>

        <div className="flex gap-6 overflow-x-auto pb-4">
          {mockCreators.map((creator) => (
            <div key={creator.id} className="flex-shrink-0 flex flex-col items-center">
              <div className="w-24 h-24 rounded-full mb-4 overflow-hidden">
                <Image src="/images/pngs.png" alt={creator.name} width={100} height={100} className="w-full h-full object-cover" />
              </div>
              <p className="font-semibold text-foreground text-center text-sm">{creator.name}</p>
              <p className="text-xs text-muted-foreground text-center">{creator.movies}</p>
            </div>
          ))}
        </div>

        <div className="flex justify-center mt-8">
          <Button className="bg-transparent border border-white/20 hover:bg-white/10 text-white">View All Creators</Button>
        </div>
      </section>

         {/* Banner Section */}
      <section className="px-4 md:px-6 lg:px-12 py-8 md:py-12 border-t border-border">
        <div className="relative rounded-xl overflow-hidden min-h-96 md:min-h-[500px]">
          {/* Background Image */}
          <div className="absolute inset-0">
            <Image 
              src="/images/design-mode/a.png" 
              alt="Banner Background" 
              fill 
              className="object-cover"
            />
          </div>
          
          {/* Dark Overlay */}
          <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/60 to-transparent" />
          
          {/* Content */}
          <div className="relative flex items-center h-full px-6 md:px-8 lg:px-12 py-8 md:py-12">
            <div className="w-full max-w-2xl">
              {/* Header */}
              <div className="mb-8 md:mb-10">
                <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold text-white mb-2 md:mb-3">
                  The Future of Filmmaking Starts Here
                </h2>
                <p className="text-sm md:text-base text-gray-300">
                  Connect with AI-powered creators. Make short films, promos, or stories in a whole new way.
                </p>
              </div>
              
              {/* Feature Cards Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6 mb-8">
              {/* Card 1 */}
              <div className="bg-black/40 backdrop-blur-sm border border-white/10 rounded-lg p-4 md:p-6 hover:bg-black/60 transition-colors">
                <div className="flex items-start gap-4">
                  <div className="flex-shrink-0 w-10 h-10 md:w-12 md:h-12">
                    <Image 
                      src="/images/design-mode/start.png" 
                      alt="AI Video Icon" 
                      width={48} 
                      height={48}
                      className="w-full h-full object-contain"
                    />
                  </div>
                  <div>
                    <h3 className="text-sm md:text-base font-bold text-white mb-1">Focused on AI Video Only</h3>
                    <p className="text-xs md:text-sm text-gray-400">We specialize in one thing – AI-generated videos. That means better quality, faster delivery, and creators who truly know the tools.</p>
                  </div>
                </div>
              </div>
              
              {/* Card 2 */}
              <div className="bg-black/40 backdrop-blur-sm border border-white/10 rounded-lg p-4 md:p-6 hover:bg-black/60 transition-colors">
                <div className="flex items-start gap-4">
                  <div className="flex-shrink-0 w-10 h-10 md:w-12 md:h-12">
                    <Image 
                      src="/images/design-mode/times.png" 
                      alt="Fast Delivery Icon" 
                      width={48} 
                      height={48}
                      className="w-full h-full object-contain"
                    />
                  </div>
                  <div>
                    <h3 className="text-sm md:text-base font-bold text-white mb-1">Fast & Hassle-Free</h3>
                    <p className="text-xs md:text-sm text-gray-400">No need to hire a full video team. Just send your idea and get a film delivered within days.</p>
                  </div>
                </div>
              </div>
              
              {/* Card 3 */}
              <div className="bg-black/40 backdrop-blur-sm border border-white/10 rounded-lg p-4 md:p-6 hover:bg-black/60 transition-colors">
                <div className="flex items-start gap-4">
                  <div className="flex-shrink-0 w-10 h-10 md:w-12 md:h-12">
                    <Image 
                      src="/images/design-mode/world.png" 
                      alt="Secure Payment Icon" 
                      width={48} 
                      height={48}
                      className="w-full h-full object-contain"
                    />
                  </div>
                  <div>
                    <h3 className="text-sm md:text-base font-bold text-white mb-1">Secure Payment, Always Protected</h3>
                    <p className="text-xs md:text-sm text-gray-400">Your money is held safely until your video is delivered – pay only when you're happy with the result.</p>
                  </div>
                </div>
              </div>
              
              {/* Card 4 */}
              <div className="bg-black/40 backdrop-blur-sm border border-white/10 rounded-lg p-4 md:p-6 hover:bg-black/60 transition-colors">
                <div className="flex items-start gap-4">
                  <div className="flex-shrink-0 w-10 h-10 md:w-12 md:h-12">
                    <Image 
                      src="/images/design-mode/image.png" 
                      alt="Client-Centric Icon" 
                      width={48} 
                      height={48}
                      className="w-full h-full object-contain"
                    />
                  </div>
                  <div>
                    <h3 className="text-sm md:text-base font-bold text-white mb-1">Client-Centric Workflow</h3>
                    <p className="text-xs md:text-sm text-gray-400">Simple briefs, clear delivery timelines, revision options – built for clients who just want great results without back-and-forth.</p>
                  </div>
                </div>
              </div>
            </div>
              
              {/* CTA Button */}
              <Button className="bg-white text-black hover:bg-gray-200 font-semibold text-sm md:text-base">
                Explore Skydio.AI
              </Button>
            </div>
          </div>
        </div>
      </section>


         <section className="mt-8 md:mt-12 mb-6 md:mb-8 mx-4 md:mx-6 lg:mx-12">
        <div className="relative rounded-lg overflow-hidden border border-white/10">
          <div className="absolute inset-0">
            <Image 
              src="/images/usky-tv-bg.png" 
              alt="Background" 
              fill 
              className="object-cover"
            />
          </div>
          <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/60 to-black/40" />
          
          <div className="relative flex flex-col lg:flex-row items-center justify-between px-4 md:px-6 lg:px-12 py-6 md:py-8 lg:py-12 gap-4 md:gap-8">
            <div className="flex-1 max-w-md">
              <div className="inline-block bg-foreground text-background text-xs font-semibold px-3 py-1 rounded-full mb-3 md:mb-4">
                Coming Soon
              </div>
              <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold text-foreground mb-3 md:mb-4 leading-tight">
                Get the USKY TV for free
              </h2>
              <ul className="space-y-1.5 md:space-y-2 text-muted-foreground text-xs md:text-sm">
                <li className="flex items-start gap-2">
                  <span className="text-accent mt-1">•</span>
                  <span>Live events, films and shows</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-accent mt-1">•</span>
                  <span>Offline viewing</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-accent mt-1">•</span>
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
