'use client'

import React, { useState, useEffect } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { Header } from '@/components/header'
import { Footer } from '@/components/footer'
import { Heart, Eye, Edit2, Clock } from 'lucide-react'
import { useRouter } from 'next/navigation'

const TABS = ['Watched', 'Watchlist', 'Favorit', 'Most View'] as const
type Tab = (typeof TABS)[number]

interface ProfileData {
  id: string
  name: string
  email: string
  avatar: string
  avatar_url: string
  balance: string
  refferal_code: string
}

interface ContentItem {
  id: string
  pid?: string
  name: string
  image?: string
  image_landscape?: string
  heart?: string
  viewx?: string
  totalview?: string
  run_time?: string
  cats?: string
  rates?: string
  id_watch?: string
  id_like?: string
  asset_name?: string
  thicker?: string
  description?: string
}

interface ProfileResponse {
  data: ProfileData
  tab: {
    watched: ContentItem[]
    watchlist: ContentItem[]
    liked: ContentItem[]
    view: ContentItem[]
  }
  status: boolean
  message: string
}

export default function MyAccountPage() {
  const router = useRouter()
  const [activeTab, setActiveTab] = useState<Tab>('Watched')
  const [profileData, setProfileData] = useState<ProfileData | null>(null)
  const [tabData, setTabData] = useState<{
    watched: ContentItem[]
    watchlist: ContentItem[]
    liked: ContentItem[]
    view: ContentItem[]
  }>({ watched: [], watchlist: [], liked: [], view: [] })
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [isMounted, setIsMounted] = useState(false)

  useEffect(() => { setIsMounted(true) }, [])
  useEffect(() => { if (isMounted) fetchProfileData() }, [isMounted])

  const fetchProfileData = async () => {
    try {
      setLoading(true)
      const token = localStorage.getItem('user_token')
      if (!token) { router.push('/'); return }

      const response = await fetch('/api/customer-profile', {
        method: 'GET',
        headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
      })
      const data: ProfileResponse = await response.json()

      if (!response.ok) {
        setError('Failed to fetch profile')
      } else {
        if (data.data) setProfileData(data.data)
        if (data.tab) {
          setTabData({
            watched:   Array.isArray(data.tab.watched)   ? data.tab.watched   : [],
            watchlist: Array.isArray(data.tab.watchlist) ? data.tab.watchlist : [],
            liked:     Array.isArray(data.tab.liked)     ? data.tab.liked     : [],
            view:      Array.isArray(data.tab.view)      ? data.tab.view      : [],
          })
        }
      }
    } catch (err) {
      console.error('[MyAccount] fetch error:', err)
      setError('Failed to load profile')
    } finally {
      setLoading(false)
    }
  }

  const getTabData = (): ContentItem[] => {
    switch (activeTab) {
      case 'Watched':   return tabData.watched
      case 'Watchlist': return tabData.watchlist
      case 'Favorit':   return tabData.liked
      case 'Most View': return tabData.view
      default:          return []
    }
  }

  const getImageUrl = (item: ContentItem): string => {
    const src = item.image || item.image_landscape || ''
    if (!src) return '/film/film1.png'
    return src.startsWith('http') ? src : `http://usky.ai/uploads/${src}`
  }

  const getViewCount = (film: ContentItem): string => {
    if (activeTab === 'Most View') return film.totalview ?? '0'
    return film.viewx ?? '0'
  }

  const stripHtml = (html: string): string => {
    return html
      .replace(/<[^>]*>/g, ' ')
      .replace(/&nbsp;/g, ' ')
      .replace(/&amp;/g, '&')
      .replace(/\s+/g, ' ')
      .trim()
  }

  const formatDuration = (runTime?: string): string => {
    const mins = parseInt(runTime ?? '0', 10)
    if (!mins) return '0m'
    const h = Math.floor(mins / 60)
    const m = mins % 60
    if (h === 0) return `${m}m`
    return `${h}h ${m}m`
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-[#050b18] text-white flex flex-col">
        <Header />
        <main className="flex-1 flex items-center justify-center">
          <p className="text-gray-400">Loading profile...</p>
        </main>
      </div>
    )
  }

  if (error || !profileData) {
    return (
      <div className="min-h-screen bg-[#050b18] text-white flex flex-col">
        <Header />
        <main className="flex-1 flex items-center justify-center">
          <p className="text-red-400">{error || 'Failed to load profile'}</p>
        </main>
      </div>
    )
  }

  const displayedFilms = getTabData()

  const avatarSrc = profileData.avatar_url
    ? profileData.avatar_url
    : profileData.avatar
      ? `http://usky.ai/uploads/${profileData.avatar}`
      : '/images/pngs.png'

  const CardBody = ({ film }: { film: ContentItem }) => (
    <div className="p-4">
      <h3 className="text-sm font-semibold text-white/95 line-clamp-1">
        {film.name}
      </h3>
      {film.cats && (
        <p className="mt-0.5 text-[10px] text-white/40 line-clamp-1">{film.cats}</p>
      )}
      {film.description && (
        <p className="mt-2 text-[11px] leading-relaxed text-white/55 line-clamp-2">
          {stripHtml(film.description)}
        </p>
      )}
      <div className="mt-2 flex items-center gap-2 text-[10px] text-white/35">
        {film.cats && (
          <span className="border border-white/15 rounded px-1.5 py-0.5">{film.cats}</span>
        )}
        <span className="flex items-center gap-1">
          <Clock className="w-3 h-3" />
          {formatDuration(film.run_time)}
        </span>
      </div>
      <div className="mt-3 flex items-center gap-4 text-[11px] text-white/45">
        <div className="flex items-center gap-1.5">
          <Heart className="w-4 h-4" />
          <span>{film.heart ?? 0} Likes</span>
        </div>
        <div className="flex items-center gap-1.5">
          <Eye className="w-4 h-4" />
          <span>{getViewCount(film)} Views</span>
        </div>
      </div>
    </div>
  )

  return (
    <div className="min-h-screen bg-[#050b18] text-white flex flex-col">
      <Header />

      <main className="flex-1">
        {/* HERO */}
        <section className="relative w-full overflow-hidden">
          <div className="relative h-[240px] md:h-[340px] lg:h-[380px]">
            <Image src="/images/usky-tv-bg.png" alt="Dashboard Banner" fill priority className="object-cover" />
            <div className="absolute inset-0 bg-black/55" />
            <div className="absolute inset-0 bg-gradient-to-b from-black/10 via-[#050b18]/10 to-[#050b18]" />
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <h1 className="text-2xl md:text-3xl lg:text-4xl font-semibold tracking-wide">Dashboard</h1>
              <div className="mt-2 flex items-center gap-2 text-xs text-white/60">
                <Link href="/" className="hover:text-white/90 transition-colors">Home</Link>
                <span className="text-white/30">›</span>
                <span className="text-white/80">My Account</span>
              </div>
            </div>
          </div>
        </section>

        {/* ========================= MOBILE ========================= */}
        <section className="md:hidden px-4 pb-16">
          {/* FIX: mt-6 ganti -mt-12 agar nama/email tidak tertutup hero */}
          <div className="mt-6">
            <div className="flex items-center gap-4">
              {/* Avatar mobile */}
              <div className="relative w-[72px] h-[72px] flex-none">
                <img
                  src={avatarSrc}
                  alt={profileData.name}
                  onError={(e) => { e.currentTarget.src = '/images/pngs.png' }}
                  className="w-full h-full rounded-full object-cover"
                />
                <div className="absolute inset-0 rounded-full ring-3 ring-[#050b18]" />
              </div>

              {/* Info profil mobile */}
              <div className="flex-1">
                <div className="flex items-center gap-2 flex-wrap">
                  <h2 className="text-base font-semibold text-white">
                    {profileData.name}
                  </h2>
                  <Link
                    href="/dashboard/profile"
                    className="inline-flex items-center gap-1.5 rounded-full border border-white/10 bg-white/5 hover:bg-white/10 transition-colors px-2.5 py-1"
                  >
                    <Edit2 className="w-3.5 h-3.5 text-white/80" />
                    <span className="text-[11px] font-medium text-white/90">Edit Profile</span>
                  </Link>
                </div>
                <p className="mt-0.5 text-[11px] text-white/45">{profileData.email}</p>
                <div className="mt-2 inline-flex items-center gap-2 rounded-md border border-white/10 bg-white/5 px-3 py-1.5">
                  <span className="text-[10px] text-white/45">My Reward:</span>
                  <span className="text-xs font-semibold text-white">{profileData.balance} USKY</span>
                </div>
              </div>
            </div>
          </div>

          {/* Tabs mobile */}
          <div className="mt-6 flex justify-center">
            <div className="inline-flex items-center gap-1 rounded-full border border-white/10 bg-white/5 p-1">
              {TABS.map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={[
                    'px-3 py-1.5 rounded-full text-[11px] font-medium transition-colors',
                    activeTab === tab ? 'bg-black/35 text-white' : 'text-white/60 hover:text-white/85 hover:bg-white/5',
                  ].join(' ')}
                >
                  {tab}
                </button>
              ))}
            </div>
          </div>

          {/* Film list mobile */}
          <div className="mt-6 space-y-4">
            {displayedFilms.length > 0 ? (
              displayedFilms.map((film) => (
                <Link
                  key={film.id}
                  href={film.pid ? `/film/${film.pid}` : '#'}
                  className="block rounded-2xl border border-white/10 bg-[#070f1f]/60 overflow-hidden"
                >
                  <div className="relative aspect-[16/10]">
                    <Image src={getImageUrl(film)} alt={film.name} fill className="object-cover" />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/35 via-transparent to-transparent" />
                    {activeTab === 'Watchlist' && film.id_watch && (
                      <div className="absolute top-2 right-2 w-7 h-7 rounded-full bg-black/60 flex items-center justify-center">
                        <span className="text-white text-xs">✓</span>
                      </div>
                    )}
                    {activeTab === 'Favorit' && (
                      <div className="absolute top-2 right-2 w-8 h-8 rounded-full bg-black/60 flex items-center justify-center">
                        <Heart className="w-4 h-4 text-white fill-white" />
                      </div>
                    )}
                  </div>
                  <CardBody film={film} />
                </Link>
              ))
            ) : (
              <p className="text-center text-white/40 py-10">Tidak ada data</p>
            )}
          </div>
        </section>

        {/* ========================= DESKTOP ========================= */}
        <section className="hidden md:block mx-auto w-full max-w-[1200px] px-4 md:px-6 lg:px-10 pb-16">
          {/* Profile row */}
          <div className="mt-6 md:mt-8">
            <div className="flex items-center gap-5 md:gap-7">
              <div className="relative w-[92px] h-[92px] md:w-[112px] md:h-[112px] lg:w-[120px] lg:h-[120px] flex-none">
                <img
                  src={avatarSrc}
                  alt={profileData.name}
                  onError={(e) => { e.currentTarget.src = '/images/pngs.png' }}
                  className="w-full h-full rounded-full object-cover"
                />
                <div className="absolute inset-0 rounded-full ring-4 ring-[#050b18]" />
              </div>
              <div className="flex-1">
                <div className="flex flex-wrap items-center gap-3">
                  <h2 className="text-lg md:text-xl lg:text-2xl font-semibold text-white">
                    {profileData.name}
                  </h2>
                  <Link
                    href="/dashboard/profile"
                    className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 hover:bg-white/10 transition-colors px-3 py-1.5"
                  >
                    <Edit2 className="w-4 h-4 text-white/80" />
                    <span className="text-xs font-medium text-white/90">Edit Profile</span>
                  </Link>
                </div>
                <p className="mt-1 text-xs text-white/45">[{profileData.email}]</p>
                <div className="mt-4 inline-flex items-center gap-2 rounded-lg border border-white/10 bg-white/5 px-4 py-2">
                  <span className="text-[11px] text-white/45">My Reward:</span>
                  <span className="text-sm font-semibold text-white">{profileData.balance} USKY</span>
                </div>
              </div>
            </div>
          </div>

          {/* Tabs desktop */}
          <div className="mt-10 flex justify-center">
            <div className="inline-flex items-center gap-1 rounded-full border border-white/10 bg-white/5 p-1">
              {TABS.map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={[
                    'px-4 md:px-5 py-2 rounded-full text-xs md:text-sm font-medium transition-colors',
                    activeTab === tab
                      ? 'bg-black/35 text-white shadow-[0_8px_30px_-18px_rgba(0,0,0,0.7)]'
                      : 'text-white/60 hover:text-white/85 hover:bg-white/5',
                  ].join(' ')}
                >
                  {tab}
                </button>
              ))}
            </div>
          </div>

          {/* Grid desktop */}
          <div className="mt-10 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 lg:gap-6">
            {displayedFilms.length > 0 ? (
              displayedFilms.map((film) => (
                <Link
                  key={film.id}
                  href={film.pid ? `/film/${film.pid}` : '#'}
                  className="group block rounded-2xl border border-white/10 bg-[#070f1f]/60 hover:bg-[#070f1f]/80 transition-colors overflow-hidden"
                >
                  <div className="relative aspect-[16/10] overflow-hidden">
                    <Image
                      src={getImageUrl(film)}
                      alt={film.name}
                      fill
                      className="object-cover group-hover:scale-[1.03] transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />
                    {activeTab === 'Watchlist' && film.id_watch && (
                      <div className="absolute top-2 right-2 w-7 h-7 rounded-full bg-black/60 flex items-center justify-center">
                        <span className="text-white text-xs">✓</span>
                      </div>
                    )}
                    {activeTab === 'Favorit' && (
                      <div className="absolute top-2 right-2 w-8 h-8 rounded-full bg-black/60 flex items-center justify-center">
                        <Heart className="w-4 h-4 text-white fill-white" />
                      </div>
                    )}
                  </div>
                  <CardBody film={film} />
                </Link>
              ))
            ) : (
              <p className="col-span-4 text-center text-white/40 py-10">Tidak ada data</p>
            )}
          </div>
        </section>
      </main>

      <Footer />
    </div>
  )
}