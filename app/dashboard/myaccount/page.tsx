'use client'

import React, { useState, useEffect } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { Header } from '@/components/header'
import { Footer } from '@/components/footer'
import { Heart, Eye, Edit2 } from 'lucide-react'
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
}

interface ProfileResponse {
  data: ProfileData
  tab: {
    watched: ContentItem[]
    watchlist: ContentItem[]
    liked: ContentItem[]
    view: ContentItem[]
  }
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
  }>({
    watched: [],
    watchlist: [],
    liked: [],
    view: [],
  })
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [isMounted, setIsMounted] = useState(false)

  useEffect(() => {
    setIsMounted(true)
  }, [])

  useEffect(() => {
    if (!isMounted) return
    fetchProfileData()
  }, [isMounted])

  const fetchProfileData = async () => {
    try {
      setLoading(true)
      const token = localStorage.getItem('user_token')

      if (!token) {
        router.push('/')
        return
      }

      const response = await fetch('/api/customer-profile', {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      })

      const data: ProfileResponse = await response.json()

      if (!response.ok) {
        setError('Failed to fetch profile')
      } else {
        if (data.data) {
          setProfileData(data.data)
        }
        if (data.tab) {
          setTabData({
            watched: data.tab.watched || [],
            watchlist: data.tab.watchlist || [],
            liked: data.tab.liked || [],
            view: data.tab.view || [],
          })
        }
      }
    } catch (err) {
      console.error('[v0] Error fetching profile:', err)
      setError('Failed to load profile')
    } finally {
      setLoading(false)
    }
  }

  const getTabData = (): ContentItem[] => {
    switch (activeTab) {
      case 'Watched':
        return tabData.watched
      case 'Watchlist':
        return tabData.watchlist
      case 'Favorit':
        return tabData.liked
      case 'Most View':
        return tabData.view
      default:
        return []
    }
  }

  const getImageUrl = (item: ContentItem): string => {
    if (item.image) {
      return item.image.startsWith('http')
        ? item.image
        : `http://usky.ai/uploads/${item.image}`
    } else if (item.image_landscape) {
      return item.image_landscape.startsWith('http')
        ? item.image_landscape
        : `http://usky.ai/uploads/${item.image_landscape}`
    }
    return '/film/film1.png'
  }

  const getViewCount = (film: ContentItem): string => {
    if (activeTab === 'Most View') return film.totalview || '0'
    return film.viewx || '0'
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

  return (
    <div className="min-h-screen bg-[#050b18] text-white flex flex-col">
      <Header />

      <main className="flex-1">
        {/* HERO */}
        <section className="relative w-full overflow-hidden">
          <div className="relative h-[240px] md:h-[340px] lg:h-[380px]">
            <Image
              src="/images/usky-tv-bg.png"
              alt="Dashboard Banner"
              fill
              priority
              className="object-cover"
            />
            <div className="absolute inset-0 bg-black/55" />
            <div className="absolute inset-0 bg-gradient-to-b from-black/10 via-[#050b18]/10 to-[#050b18]" />

            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <h1 className="text-2xl md:text-3xl lg:text-4xl font-semibold tracking-wide">
                Dashboard
              </h1>
              <div className="mt-2 flex items-center gap-2 text-xs text-white/60">
                <Link href="/" className="hover:text-white/90 transition-colors">
                  Home
                </Link>
                <span className="text-white/30">›</span>
                <span className="text-white/80">My Account</span>
              </div>
            </div>
          </div>
        </section>

        {/* =========================
            MOBILE VERSION (md:hidden)
            ========================= */}
        <section className="md:hidden px-4 pb-16">
          <div className="-mt-12">
            <div className="flex items-start gap-4">
              <div className="relative w-[88px] h-[88px] flex-none">
                <img
                  src={profileData.avatar_url || profileData.avatar
                    ? (profileData.avatar_url || `http://usky.ai/uploads/${profileData.avatar}`)
                    : '/images/pngs.png'
                  }
                  alt={profileData.name}
                  onError={(e) => { e.currentTarget.src = '/images/pngs.png' }}
                  className="w-full h-full rounded-full object-cover"
                />
                <div className="absolute inset-0 rounded-full ring-4 ring-[#050b18]" />
              </div>

              <div className="flex-1 pt-1">
                <div className="flex items-center gap-2">
                  <h2 className="text-base font-semibold text-white/95">
                    {profileData.name}
                  </h2>
                  <Link
                    href="/dashboard/profile"
                    className="inline-flex items-center gap-1.5 rounded-full border border-white/10 bg-white/5 hover:bg-white/10 transition-colors px-2.5 py-1"
                  >
                    <Edit2 className="w-3.5 h-3.5 text-white/80" />
                    <span className="text-[11px] font-medium text-white/90">
                      Edit Profile
                    </span>
                  </Link>
                </div>

                <p className="mt-1 text-[11px] text-white/45">
                  {profileData.email}
                </p>

                <div className="mt-3 inline-flex items-center gap-2 rounded-md border border-white/10 bg-white/5 px-3 py-2">
                  <span className="text-[10px] text-white/45">Balance:</span>
                  <span className="text-xs font-semibold text-white">
                    {profileData.balance} USKY
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Tabs */}
          <div className="mt-6 flex justify-center">
            <div className="inline-flex items-center gap-1 rounded-full border border-white/10 bg-white/5 p-1">
              {TABS.map((tab) => {
                const active = activeTab === tab
                return (
                  <button
                    key={tab}
                    onClick={() => setActiveTab(tab)}
                    className={[
                      'px-3 py-1.5 rounded-full text-[11px] font-medium transition-colors',
                      active
                        ? 'bg-black/35 text-white'
                        : 'text-white/60 hover:text-white/85 hover:bg-white/5',
                    ].join(' ')}
                  >
                    {tab}
                  </button>
                )
              })}
            </div>
          </div>

          {/* Film list mobile */}
          <div className="mt-6 space-y-4">
            {displayedFilms.length > 0 ? (
              displayedFilms.map((film: ContentItem) => (
                <Link
                  key={film.id}
                  href={film.pid ? `/film/${film.pid}` : '#'}
                  className="block rounded-2xl border border-white/10 bg-[#070f1f]/60 overflow-hidden"
                >
                  <div className="relative aspect-[16/10]">
                    <Image
                      src={getImageUrl(film)}
                      alt={film.name}
                      fill
                      className="object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/35 via-transparent to-transparent" />
                    {/* Ceklis hanya di Watchlist */}
                    {activeTab === 'Watchlist' && film.id_watch && (
                      <div className="absolute top-2 right-2 w-7 h-7 rounded-full bg-black/60 flex items-center justify-center">
                        <span className="text-white text-xs">✓</span>
                      </div>
                    )}
                  </div>

                  <div className="p-4">
                    <h3 className="text-sm font-semibold text-white/95 line-clamp-1">
                      {film.name}
                    </h3>
                    <p className="mt-2 text-[11px] leading-relaxed text-white/45 line-clamp-2">
                      {film.cats || ''}
                    </p>
                    <div className="mt-3 flex items-center gap-4 text-[11px] text-white/45">
                      <div className="flex items-center gap-1.5">
                        <Heart className="w-4 h-4" />
                        <span>{film.heart || 0} Likes</span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <Eye className="w-4 h-4" />
                        <span>{getViewCount(film)} Views</span>
                      </div>
                    </div>
                  </div>
                </Link>
              ))
            ) : (
              <p className="text-center text-white/40 py-10">Tidak ada data</p>
            )}
          </div>
        </section>

        {/* =========================
            DESKTOP VERSION
            ========================= */}
        <section className="hidden md:block mx-auto w-full max-w-[1200px] px-4 md:px-6 lg:px-10 pb-16">
          {/* Profile row */}
          <div className="mt-6 md:mt-8">
            <div className="flex items-center gap-5 md:gap-7">
              {/* Avatar desktop */}
              <div className="relative w-[92px] h-[92px] md:w-[112px] md:h-[112px] lg:w-[120px] lg:h-[120px] flex-none">
                <img
                  src={profileData.avatar_url || profileData.avatar
                    ? (profileData.avatar_url || `http://usky.ai/uploads/${profileData.avatar}`)
                    : '/images/pngs.png'
                  }
                  alt={profileData.name}
                  onError={(e) => { e.currentTarget.src = '/images/pngs.png' }}
                  className="w-full h-full rounded-full object-cover"
                />
                <div className="absolute inset-0 rounded-full ring-4 ring-[#050b18]" />
              </div>

              {/* Info profil desktop */}
              <div className="flex-1">
                <div className="flex flex-wrap items-center gap-3">
                  {/* nama dari data.name */}
                  <h2 className="text-lg md:text-xl lg:text-2xl font-semibold text-white">
                    {profileData.name}
                  </h2>

                  <Link
                    href="/dashboard/profile"
                    className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 hover:bg-white/10 transition-colors px-3 py-1.5"
                  >
                    <Edit2 className="w-4 h-4 text-white/80" />
                    <span className="text-xs font-medium text-white/90">
                      Edit Profile
                    </span>
                  </Link>
                </div>

                {/* email dari data.email */}
                <p className="mt-1 text-xs text-white/45">
                  [{profileData.email}]
                </p>

                {/* balance dari data.balance */}
                <div className="mt-4 inline-flex items-center gap-2 rounded-lg border border-white/10 bg-white/5 px-4 py-2">
                  <span className="text-[11px] text-white/45">My Reward:</span>
                  <span className="text-sm font-semibold text-white">
                    {profileData.balance} USKY
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Tabs */}
          <div className="mt-10 flex justify-center">
            <div className="inline-flex items-center gap-1 rounded-full border border-white/10 bg-white/5 p-1">
              {TABS.map((tab) => {
                const active = activeTab === tab
                return (
                  <button
                    key={tab}
                    onClick={() => setActiveTab(tab)}
                    className={[
                      'px-4 md:px-5 py-2 rounded-full text-xs md:text-sm font-medium transition-colors',
                      active
                        ? 'bg-black/35 text-white shadow-[0_8px_30px_-18px_rgba(0,0,0,0.7)]'
                        : 'text-white/60 hover:text-white/85 hover:bg-white/5',
                    ].join(' ')}
                  >
                    {tab}
                  </button>
                )
              })}
            </div>
          </div>

          {/* Grid desktop */}
          {/* FIX: ganti filmData → displayedFilms, film: any → film: ContentItem */}
          <div className="mt-10 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 lg:gap-6">
            {displayedFilms.length > 0 ? (
              displayedFilms.map((film: ContentItem) => (
                <Link
                  key={film.id}
                  href={film.pid ? `/film/${film.pid}` : '#'}
                  className="group block rounded-2xl border border-white/10 bg-[#070f1f]/60 hover:bg-[#070f1f]/80 transition-colors overflow-hidden"
                >
                  <div className="relative aspect-[16/10] overflow-hidden">
                    {/* FIX: ganti film.image → getImageUrl(film) */}
                    <Image
                      src={getImageUrl(film)}
                      alt={film.name}
                      fill
                      className="object-cover group-hover:scale-[1.03] transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />
                    {/* Ceklis hanya di Watchlist */}
                    {activeTab === 'Watchlist' && film.id_watch && (
                      <div className="absolute top-2 right-2 w-7 h-7 rounded-full bg-black/60 flex items-center justify-center">
                        <span className="text-white text-xs">✓</span>
                      </div>
                    )}
                  </div>

                  <div className="p-4">
                    {/* FIX: ganti film.title → film.name */}
                    <h3 className="text-sm font-semibold text-white/95 line-clamp-1">
                      {film.name}
                    </h3>
                    {/* FIX: ganti film.synopsis → film.cats */}
                    <p className="mt-2 text-[11px] leading-relaxed text-white/45 line-clamp-2">
                      {film.cats || ''}
                    </p>

                    <div className="mt-3 flex items-center gap-4 text-[11px] text-white/45">
                      <div className="flex items-center gap-1.5">
                        <Heart className="w-4 h-4" />
                        {/* FIX: ganti film.likes → film.heart */}
                        <span>{film.heart || 0} Likes</span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <Eye className="w-4 h-4" />
                        {/* FIX: ganti film.views → getViewCount(film) */}
                        <span>{getViewCount(film)} Views</span>
                      </div>
                    </div>
                  </div>
                </Link>
              ))
            ) : (
              <p className="col-span-4 text-center text-white/40 py-10">
                Tidak ada data
              </p>
            )}
          </div>
        </section>
      </main>

      <Footer />
    </div>
  )
}