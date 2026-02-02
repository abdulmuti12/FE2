'use client'

import Image from 'next/image'
import { useState, useRef, useEffect } from 'react'
import { ChevronLeft, ChevronRight, Menu, X, Search, Settings, User, Calendar, Ticket, CreditCard, LogOut } from 'lucide-react'
import { Button } from '@/components/ui/button'

const mockFilms = [
  { id: 1, title: '[Judul Film]', image: '/login-hero.jpg', description: 'Watch groundbreaking films crafted by human creativity and artificial intelligence.', category: 'Action', rating: '8.5/10' },
  { id: 2, title: '[Judul Film]', image: '/login-hero.jpg', description: 'Discover amazing cinematic experiences.', category: 'Drama', rating: '9.0/10' },
  { id: 3, title: '[Judul Film]', image: '/login-hero.jpg', description: 'Experience AI-powered storytelling.', category: 'Sci-Fi', rating: '8.8/10' },
  { id: 4, title: '[Judul Film]', image: '/login-hero.jpg', description: 'Journey through immersive worlds.', category: 'Fantasy', rating: '8.3/10' },
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

function CarouselSection({ title, viewAllLink = '#', items = mockFilms, layout = 'default' }: { title: string, viewAllLink?: string, items?: typeof mockFilms, layout?: 'default' | 'category' | 'creator' }) {
  const [currentIndex, setCurrentIndex] = useState(0)
  const itemsPerView = layout === 'creator' ? 7 : layout === 'default' ? 4 : 7
  const maxIndex = Math.max(0, items.length - itemsPerView)
  const handleNext = () => currentIndex < maxIndex && setCurrentIndex(currentIndex + 1)
  const handlePrev = () => currentIndex > 0 && setCurrentIndex(currentIndex - 1)

  return (
    <section className="px-6 lg:px-12 py-8 border-t border-border">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-foreground">{title}</h2>
        <a href={viewAllLink} className="text-accent text-sm hover:opacity-80">View All</a>
      </div>
      <div className="relative">
        <div className="overflow-hidden">
          <div className="flex transition-transform duration-300 gap-4" style={{ transform: `translateX(-${currentIndex * (100 / itemsPerView)}%)` }}>
            {layout === 'category' ? categoryData.map((item, idx) => (
              <div key={idx} className="flex-shrink-0 w-1/4 lg:w-1/7 text-center">
                <div className="w-full aspect-square rounded-full bg-gradient-to-br from-[#4c7c3f] to-[#2a4a2a] mb-3 flex items-center justify-center"><span className="text-4xl text-white">🎬</span></div>
                <p className="text-sm font-medium text-foreground">{item.name}</p>
                <p className="text-xs text-muted-foreground">{item.count} Movies</p>
              </div>
            )) : layout === 'creator' ? creatorData.map((item, idx) => (
              <div key={idx} className="flex-shrink-0 w-1/4 lg:w-1/7 text-center">
                <div className="w-full aspect-square rounded-full bg-gradient-to-br from-[#7c4c9f] to-[#4a2a6a] mb-3 flex items-center justify-center"><span className="text-4xl text-white">👤</span></div>
                <p className="text-sm font-medium text-foreground">{item.name}</p>
                <p className="text-xs text-muted-foreground">{item.count} Movies</p>
              </div>
            )) : items.map((film) => (
              <div key={film.id} className="flex-shrink-0 w-1/4 lg:w-1/4">
                <div className="relative h-60 mb-4 rounded-lg overflow-hidden group">
                  <Image src={film.image || "/placeholder.svg"} alt={film.title} fill className="object-cover hover:scale-105 transition-transform duration-300" />
                </div>
                <p className="font-semibold text-foreground mb-1">{film.title}</p>
                {(film as any).year && <p className="text-xs text-muted-foreground">{(film as any).year}</p>}
                <p className="text-xs text-muted-foreground mb-3 line-clamp-2">{film.description}</p>
                <div className="flex gap-2 flex-wrap">
                  {(film as any).categories?.map((cat: string, idx: number) => (
                    <Button key={idx} size="sm" className="text-xs bg-transparent" variant="outline">{cat}</Button>
                  )) || (
                    <>
                      <Button size="sm" className="text-xs bg-transparent" variant="outline">Watch</Button>
                      <Button size="sm" className="text-xs bg-transparent" variant="outline">Add List</Button>
                    </>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
        {currentIndex > 0 && <button onClick={handlePrev} className="absolute left-0 top-1/3 -translate-y-1/2 -translate-x-12 lg:-translate-x-6 z-10 bg-accent/20 hover:bg-accent/40 p-2 rounded-full transition-colors"><ChevronLeft className="w-5 h-5 text-white" /></button>}
        {currentIndex < maxIndex && <button onClick={handleNext} className="absolute right-0 top-1/3 -translate-y-1/2 translate-x-12 lg:translate-x-6 z-10 bg-accent/20 hover:bg-accent/40 p-2 rounded-full transition-colors"><ChevronRight className="w-5 h-5 text-white" /></button>}
      </div>
    </section>
  )
}

export default function DashboardPage() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [userDropdownOpen, setUserDropdownOpen] = useState(false)
  const [isSearchActive, setIsSearchActive] = useState(false) // State untuk mode search
  const dropdownRef = useRef<HTMLDivElement>(null)
  const searchInputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setUserDropdownOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  // Fokus otomatis ke input saat search aktif
  useEffect(() => {
    if (isSearchActive && searchInputRef.current) {
      searchInputRef.current.focus()
    }
  }, [isSearchActive])

  return (
    <div className="min-h-screen bg-background text-foreground dark">
      <nav className="sticky top-0 z-50 bg-[#020817]/95 backdrop-blur-md border-b border-white/5 h-20 flex items-center">
        <div className="w-full px-6 lg:px-12">
          {!isSearchActive ? (
            // TAMPILAN NORMAL (Figma / fe.png style)
            <div className="flex items-center justify-between animate-in fade-in duration-300">
              <div className="flex items-center">
                <Image src="/usky-logo.png" alt="USKY Logo" width={70} height={30} className="h-7 w-auto object-contain" />
              </div>

              <div className="flex items-center gap-6">
                <div className="hidden lg:flex items-center bg-[#111827] border border-white/5 rounded-full px-8 py-2.5 gap-10 shadow-lg">
                  <a href="#" className="text-sm font-semibold text-white hover:text-blue-400 transition-colors">Films</a>
                  <a href="#" className="text-sm font-semibold text-white hover:text-blue-400 transition-colors">Clips</a>
                  <a href="#" className="text-sm font-semibold text-white hover:text-blue-400 transition-colors">Events</a>
                  <a href="#" className="text-sm font-semibold text-white hover:text-blue-400 transition-colors">Awards</a>
                </div>

                <div className="flex items-center gap-3 relative">
                  <div ref={dropdownRef} className="relative">
                    <button onClick={() => setUserDropdownOpen(!userDropdownOpen)} className="flex items-center justify-center w-10 h-10 bg-[#D9D9D9] hover:bg-white transition-all rounded-full border border-white/20">
                      <User className="w-6 h-6 text-black" />
                    </button>
                    {userDropdownOpen && (
                      <div className="absolute right-0 mt-2 w-64 bg-[#1a1a2e] border border-white/10 rounded-lg shadow-2xl overflow-hidden animate-in fade-in slide-in-from-top-2 duration-200">
                        <div className="px-6 py-4 border-b border-white/10">
                          <div className="flex items-center gap-4">
                            <div className="w-12 h-12 bg-gradient-to-br from-gray-300 to-gray-400 rounded-full flex items-center justify-center"><User className="w-6 h-6 text-gray-700" /></div>
                            <div><p className="font-semibold text-white text-sm">leerob</p><p className="text-xs text-gray-400">leerob@example.com</p></div>
                          </div>
                        </div>
                        <div className="py-2">
                          <button className="w-full flex items-center gap-4 px-6 py-3 text-sm text-gray-300 hover:bg-white/5 transition-colors"><Calendar className="w-5 h-5 text-gray-500" />My Event</button>
                          <button className="w-full flex items-center gap-4 px-6 py-3 text-sm text-gray-300 hover:bg-white/5 transition-colors"><Ticket className="w-5 h-5 text-gray-500" />My Referral</button>
                          <button className="w-full flex items-center gap-4 px-6 py-3 text-sm text-gray-300 hover:bg-white/5 transition-colors"><CreditCard className="w-5 h-5 text-gray-500" />My Account</button>
                          <button className="w-full flex items-center gap-4 px-6 py-3 text-sm text-gray-300 hover:bg-white/5 transition-colors"><User className="w-5 h-5 text-gray-500" />Profile</button>
                          <button className="w-full flex items-center gap-4 px-6 py-3 text-sm text-gray-300 hover:bg-white/5 transition-colors"><Settings className="w-5 h-5 text-gray-500" />Change Password</button>
                        </div>
                        <div className="border-t border-white/10 py-2">
                          <button className="w-full flex items-center gap-4 px-6 py-3 text-sm text-gray-300 hover:bg-white/5 transition-colors"><LogOut className="w-5 h-5 text-gray-500" />Sign Out</button>
                        </div>
                      </div>
                    )}
                  </div>

                  <button onClick={() => setIsSearchActive(true)} className="flex items-center justify-center p-2 text-white/70 hover:text-white transition-colors">
                    <Search className="w-5 h-5" />
                  </button>

                  <button onClick={() => setMobileMenuOpen(!mobileMenuOpen)} className="lg:hidden flex items-center justify-center p-2 text-white">
                    {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
                  </button>
                </div>
              </div>
            </div>
          ) : (
            // TAMPILAN SEARCH AKTIF (Sesuai research.png)
            <div className="flex items-center gap-4 animate-in slide-in-from-right duration-300">
              <div className="flex items-center flex-shrink-0">
                <Image src="/usky-logo.png" alt="USKY Logo" width={70} height={30} className="h-7 w-auto object-contain" />
              </div>
              
              <div className="hidden lg:flex items-center bg-[#111827] border border-white/5 rounded-full px-8 py-2.5 gap-10 shadow-lg flex-shrink-0">
                <a href="#" className="text-sm font-semibold text-white/40 cursor-default">Films</a>
                <a href="#" className="text-sm font-semibold text-white/40 cursor-default">Clips</a>
                <a href="#" className="text-sm font-semibold text-white/40 cursor-default">Events</a>
                <a href="#" className="text-sm font-semibold text-white/40 cursor-default">Awards</a>
              </div>

              <div className="flex items-center justify-center w-10 h-10 bg-[#D9D9D9] rounded-full flex-shrink-0">
                <User className="w-6 h-6 text-black" />
              </div>

              {/* SEARCH INPUT FIELD (research.png style) */}
              <div className="flex-1 relative flex items-center bg-[#0d121f] border border-white/10 rounded-lg px-4 h-11">
                <Search className="w-5 h-5 text-gray-500 mr-3" />
                <input 
                  ref={searchInputRef}
                  type="text" 
                  placeholder="Search..." 
                  className="bg-transparent border-none outline-none text-white w-full text-sm placeholder:text-gray-500"
                />
              </div>

              {/* TOMBOL CLOSE SEARCH */}
              <button 
                onClick={() => setIsSearchActive(false)}
                className="w-10 h-10 bg-white/5 hover:bg-white/10 rounded-full flex items-center justify-center transition-colors flex-shrink-0"
              >
                <X className="w-5 h-5 text-white" />
              </button>
            </div>
          )}
        </div>

        {/* Mobile Menu Dropdown */}
        {mobileMenuOpen && !isSearchActive && (
          <div className="absolute top-20 left-0 w-full lg:hidden bg-[#020817] border-t border-white/5 px-6 py-8 flex flex-col gap-6 animate-in slide-in-from-top duration-300">
            {['Films', 'Clips', 'Events', 'Awards'].map((item) => (
              <a key={item} href="#" className="text-lg font-medium text-white/90 hover:text-white">{item}</a>
            ))}
          </div>
        )}
      </nav>

      {/* Hero Section */}
      <section className="relative h-96 lg:h-[500px] overflow-hidden">
        <Image src="/login-hero.jpg" alt="Hero" fill className="object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-transparent" />
        <div className="absolute bottom-8 left-6 lg:left-12 right-6 lg:right-12">
          <h1 className="text-3xl lg:text-4xl font-bold text-white mb-2">[Judul Film]</h1>
          <p className="text-sm lg:text-base text-gray-300 mb-4 max-w-2xl">Watch groundbreaking films crafted by human creativity and artificial intelligence.</p>
          <Button className="bg-white text-background hover:bg-gray-200">▶ Watch Now</Button>
          <div className="flex gap-1 mt-4">
            <div className="w-6 h-1 bg-white rounded-full" /><div className="w-1 h-1 bg-gray-400 rounded-full" /><div className="w-1 h-1 bg-gray-400 rounded-full" /><div className="w-1 h-1 bg-gray-400 rounded-full" />
          </div>
        </div>
      </section>

      <CarouselSection title="Latest Movies" items={mockFilms} />
      <CarouselSection title="Latest Clips" items={mockFilms} />
      <CarouselSection title="Latest Awards" items={mockAwards} />
      <CarouselSection title="Category" items={categoryData as any} layout="category" />
      <CarouselSection title="Most Watching Film" items={mockMostWatching as any} />
      
      {/* Creator Section */}
      <section className="px-6 lg:px-12 py-8 border-t border-border">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-foreground">Creator</h2>
          <div className="flex gap-2">
            <button className="bg-accent/20 hover:bg-accent/40 p-2 rounded-full transition-colors"><ChevronLeft className="w-5 h-5 text-white" /></button>
            <button className="bg-accent/20 hover:bg-accent/40 p-2 rounded-full transition-colors"><ChevronRight className="w-5 h-5 text-white" /></button>
          </div>
        </div>

        <div className="flex gap-6 overflow-x-auto pb-4">
          {mockCreators.map((creator) => (
            <div key={creator.id} className="flex-shrink-0 flex flex-col items-center">
              <div className="w-24 h-24 rounded-full mb-4 overflow-hidden">
                <Image 
                  src="/images/pngs.png" 
                  alt={creator.name} 
                  width={100} 
                  height={100} 
                  className="w-full h-full object-cover"
                />
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

      <section className="mt-12 mb-8">
        <div className="relative rounded-lg overflow-hidden bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900 border border-white/10">
          <div className="absolute inset-0 opacity-20">
            <Image 
              src="/images/acas.png" 
              alt="Background" 
              fill 
              className="object-cover"
            />
          </div>
          
          <div className="relative flex flex-col lg:flex-row items-center justify-between px-6 lg:px-12 py-8 lg:py-12 gap-8">
            <div className="flex-1 max-w-md">
              <div className="inline-block bg-foreground text-background text-xs font-semibold px-3 py-1 rounded-full mb-4">
                Coming Soon
              </div>
              <h2 className="text-3xl lg:text-4xl font-bold text-foreground mb-4 leading-tight">
                Get the USKY TV for free
              </h2>
              <ul className="space-y-2 text-muted-foreground text-sm">
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
            
            <div className="flex-1 flex justify-center lg:justify-end">
              <div className="w-full max-w-sm">
                <Image 
                  src="/images/pc.png" 
                  alt="USKY TV Display" 
                  width={400} 
                  height={300} 
                  className="w-full h-auto object-contain drop-shadow-lg"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      <footer className="bg-black/50 border-t border-border px-6 lg:px-12 py-8">
        <div className="flex flex-col lg:flex-row justify-between items-center gap-4">
          <p className="text-xs text-muted-foreground">© 2024 USKY. All rights reserved.</p>
          <div className="flex gap-4">
            <a href="#" className="text-muted-foreground hover:text-accent">Twitter</a>
            <a href="#" className="text-muted-foreground hover:text-accent">Instagram</a>
          </div>
        </div>
      </footer>
    </div>
  )
}
