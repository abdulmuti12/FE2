'use client'

import React, { useMemo, useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { Header } from '@/components/header'
import { Footer } from '@/components/footer'
import { Heart, Eye, Edit2 } from 'lucide-react'

const TABS = ['Watched', 'Watchlist', 'Favorit', 'Most View'] as const
type Tab = (typeof TABS)[number]

export default function MyAccountPage() {
  const [activeTab, setActiveTab] = useState<Tab>('Watched')

  const profileData = useMemo(
    () => ({
      name: '[Nama Creator]',
      role: 'UI-Mal Creator',
      rewards: '200 USKY',
      avatar:
        '/images/pngs.png',
    }),
    []
  )

  const filmData = useMemo(
    () => [
      {
        id: 1,
        title: '[Judul Film]',
        synopsis:
          '[Brief Synopsis] Watch groundbreaking films crafted by human creativity and arti...',
        image: '/film/film1.png',
        likes: 12,
        views: 15,
      },
      {
        id: 2,
        title: '[Judul Film]',
        synopsis:
          '[Brief Synopsis] Watch groundbreaking films crafted by human creativity and arti...',
        image: '/film/film2.png',
        likes: 12,
        views: 15,
      },
      {
        id: 3,
        title: '[Judul Film]',
        synopsis:
          '[Brief Synopsis] Watch groundbreaking films crafted by human creativity and arti...',
        image: '/film/film3.png',
        likes: 12,
        views: 15,
      },
      {
        id: 4,
        title: '[Judul Film]',
        synopsis:
          '[Brief Synopsis] Watch groundbreaking films crafted by human creativity and arti...',
        image: '/film/film1.png',
        likes: 12,
        views: 15,
      },
      {
        id: 5,
        title: '[Judul Film]',
        synopsis:
          '[Brief Synopsis] Watch groundbreaking films crafted by human creativity and arti...',
        image: '/film/film2.png',
        likes: 12,
        views: 15,
      },
      {
        id: 6,
        title: '[Judul Film]',
        synopsis:
          '[Brief Synopsis] Watch groundbreaking films crafted by human creativity and arti...',
        image: '/film/film3.png',
        likes: 12,
        views: 15,
      },
      {
        id: 7,
        title: '[Judul Film]',
        synopsis:
          '[Brief Synopsis] Watch groundbreaking films crafted by human creativity and arti...',
        image: '/film/film1.png',
        likes: 12,
        views: 15,
      },
      {
        id: 8,
        title: '[Judul Film]',
        synopsis:
          '[Brief Synopsis] Watch groundbreaking films crafted by human creativity and arti...',
        image: '/film/film2.png',
        likes: 12,
        views: 15,
      },
    ],
    []
  )

  return (
    <div className="min-h-screen bg-[#050b18] text-white flex flex-col">
      <Header />

      <main className="flex-1">
        {/* HERO (tetap) */}
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
          {/* Profile block (sesuai screenshot mobile) */}
          <div className="-mt-12">
            <div className="flex items-start gap-4">
              {/* avatar */}
              <div className="relative w-[88px] h-[88px] flex-none">
                <Image
                  src={profileData.avatar}
                  alt={profileData.name}
                  fill
                  className="rounded-full object-cover"
                />
                <div className="absolute inset-0 rounded-full ring-4 ring-[#050b18]" />
              </div>

              {/* info */}
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
                  {profileData.role}
                </p>

                <div className="mt-3 inline-flex items-center gap-2 rounded-md border border-white/10 bg-white/5 px-3 py-2">
                  <span className="text-[10px] text-white/45">My Rewards:</span>
                  <span className="text-xs font-semibold text-white">
                    {profileData.rewards}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Tabs (pills kecil satu baris, center) */}
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

          {/* Film list (1 column, card seperti screenshot) */}
          <div className="mt-6 space-y-4">
            {filmData.map((film) => (
              <Link
                key={film.id}
                href="#"
                className="block rounded-2xl border border-white/10 bg-[#070f1f]/60 overflow-hidden"
              >
                <div className="relative aspect-[16/10]">
                  <Image
                    src={film.image}
                    alt={film.title}
                    fill
                    className="object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/35 via-transparent to-transparent" />
                </div>

                <div className="p-4">
                  <h3 className="text-sm font-semibold text-white/95 line-clamp-1">
                    {film.title}
                  </h3>

                  <p className="mt-2 text-[11px] leading-relaxed text-white/45 line-clamp-2">
                    {film.synopsis}
                  </p>

                  <div className="mt-3 flex items-center gap-4 text-[11px] text-white/45">
                    <div className="flex items-center gap-1.5">
                      <Heart className="w-4 h-4" />
                      <span>{film.likes} Likes</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <Eye className="w-4 h-4" />
                      <span>{film.views} Views</span>
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </section>

        {/* =========================
            DESKTOP VERSION (jangan diubah)
            ========================= */}
        <section className="hidden md:block mx-auto w-full max-w-[1200px] px-4 md:px-6 lg:px-10 pb-16">
          {/* Profile row */}
          <div className="-mt-14 md:-mt-16 lg:-mt-20">
            <div className="flex items-start gap-5 md:gap-7">
              <div className="relative w-[92px] h-[92px] md:w-[112px] md:h-[112px] lg:w-[120px] lg:h-[120px] flex-none">
                <Image
                  src={profileData.avatar}
                  alt={profileData.name}
                  fill
                  className="rounded-full object-cover"
                />
                <div className="absolute inset-0 rounded-full ring-4 ring-[#050b18]" />
              </div>

              <div className="flex-1 pt-2 md:pt-4">
                <div className="flex flex-wrap items-center gap-3">
                  <h2 className="text-lg md:text-xl lg:text-2xl font-semibold">
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

                <p className="mt-1 text-xs text-white/45">{profileData.role}</p>

                <div className="mt-4 inline-flex items-center gap-2 rounded-lg border border-white/10 bg-white/5 px-4 py-2">
                  <span className="text-[11px] text-white/45">My Rewards:</span>
                  <span className="text-sm font-semibold text-white">
                    {profileData.rewards}
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

          {/* Grid */}
          <div className="mt-10 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 lg:gap-6">
            {filmData.map((film) => (
              <Link
                key={film.id}
                href="#"
                className="group block rounded-2xl border border-white/10 bg-[#070f1f]/60 hover:bg-[#070f1f]/80 transition-colors overflow-hidden"
              >
                <div className="relative aspect-[16/10] overflow-hidden">
                  <Image
                    src={film.image}
                    alt={film.title}
                    fill
                    className="object-cover group-hover:scale-[1.03] transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />
                </div>

                <div className="p-4">
                  <h3 className="text-sm font-semibold text-white/95 line-clamp-1">
                    {film.title}
                  </h3>

                  <p className="mt-2 text-[11px] leading-relaxed text-white/45 line-clamp-2">
                    {film.synopsis}
                  </p>

                  <div className="mt-3 flex items-center gap-4 text-[11px] text-white/45">
                    <div className="flex items-center gap-1.5">
                      <Heart className="w-4 h-4" />
                      <span>{film.likes} Likes</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <Eye className="w-4 h-4" />
                      <span>{film.views} Views</span>
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </section>
      </main>

      <Footer />
    </div>
  )
}
