'use client'

import React, { useState } from 'react'
import Image from 'next/image'
import { Header } from '@/components/header'
import { Footer } from '@/components/footer'
import {
  Heart,
  Plus,
  Share2,
  Volume2,
  Settings,
  ChevronRight,
  Play,
  Info,
} from 'lucide-react'

interface Episode {
  id: number
  title: string
  description: string
  duration: string
  image: string
}

interface Comment {
  id: number
  author: string
  avatar: string
  text: string
  date: string
}

const episodes: Episode[] = [
  {
    id: 1,
    title: '[Judul Series]',
    description:
      '[Brief Synopsis] Watch groundbreaking films crafted by human creativity and arti...',
    duration: '1h 0m',
    image: '/film/film1.png',
  },
  {
    id: 2,
    title: '[Judul Series]',
    description:
      '[Brief Synopsis] Watch groundbreaking films crafted by human creativity and arti...',
    duration: '1h 0m',
    image: '/film/film2.png',
  },
  {
    id: 3,
    title: '[Judul Series]',
    description:
      '[Brief Synopsis] Watch groundbreaking films crafted by human creativity and arti...',
    duration: '1h 0m',
    image: '/images/icon/action4.png',
  },
  {
    id: 4,
    title: '[Judul Series]',
    description:
      '[Brief Synopsis] Watch groundbreaking films crafted by human creativity and arti...',
    duration: '1h 0m',
    image: '/images/icon/fantasy.png',
  },
]

const comments: Comment[] = [
  {
    id: 1,
    author: 'fredthegreat',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=fredthegreat',
    text: '[Comment] Lorem ipsum dolor sit amet consectetur. Volutpat turpis in aliquam pellentesque quis vulputate et imperdiet.',
    date: '09/05/2025',
  },
  {
    id: 2,
    author: 'fredthegreat',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=fredthegreat2',
    text: '[Comment] Lorem ipsum dolor sit amet consectetur. Volutpat turpis in aliquam pellentesque quis vulputate et imperdiet.',
    date: '09/05/2025',
  },
  {
    id: 3,
    author: 'fredthegreat',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=fredthegreat3',
    text: '[Comment] Lorem ipsum dolor sit amet consectetur. Volutpat turpis in aliquam pellentesque quis vulputate et imperdiet.',
    date: '09/05/2025',
  },
  {
    id: 4,
    author: 'fredthegreat',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=fredthegreat4',
    text: '[Comment] Lorem ipsum dolor sit amet consectetur. Volutpat turpis in aliquam pellentesque quis vulputate et imperdiet.',
    date: '09/05/2025',
  },
  {
    id: 5,
    author: 'fredthegreat',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=fredthegreat5',
    text: '[Comment] Lorem ipsum dolor sit amet consectetur. Volutpat turpis in aliquam pellentesque quis vulputate et imperdiet.',
    date: '09/05/2025',
  },
]

export default function SeriesDetailPage() {
  const [progress] = useState(33)
  const [rating, setRating] = useState(0)
  const [reviewText, setReviewText] = useState('')
  const [sortBy] = useState('Newest')

  return (
    <div className="min-h-screen bg-[#020817] text-white font-sans">
      <Header />

      {/* ===== TOP PLAYER AREA ===== */}
      <div className="bg-gradient-to-b from-[#0b1222] via-[#020817] to-[#020817] pb-8 md:pb-10">
        <div className="max-w-[1400px] mx-auto px-3 sm:px-4 md:px-12 pt-4 md:pt-6">
          {/* Player Card */}
          <div className="relative w-full rounded-xl md:rounded-2xl overflow-hidden bg-black shadow-[0_20px_60px_rgba(0,0,0,0.6)]">
            {/* MOBILE: lebih pendek, DESKTOP: tetap seperti kamu */}
            <div className="relative w-full h-[220px] sm:h-[300px] md:h-[648px]">
              <Image
                src="/film/film1.png"
                alt="Series player"
                fill
                className="object-cover"
                priority
              />

              {/* Overlay */}
              <div className="absolute inset-0">
                <div className="absolute inset-0 bg-black/25" />
                <div className="absolute inset-0 bg-gradient-to-b from-black/20 via-black/10 to-black/80" />
              </div>

              {/* Controls Layer */}
              <div className="absolute inset-0 flex flex-col justify-between p-3 sm:p-4 md:p-6">
                {/* Top row */}
                <div className="flex items-start justify-between">
                  <p className="text-white/80 text-xs sm:text-sm font-medium">
                    [Judul Series]
                  </p>

                  <div className="flex items-center gap-2 md:gap-3">
                    <button className="h-9 w-9 md:h-10 md:w-10 rounded-full bg-white/10 border border-white/15 hover:bg-white/15 transition-colors flex items-center justify-center">
                      <Volume2 className="w-4 h-4 md:w-5 md:h-5 text-white" />
                    </button>
                    <button className="h-9 w-9 md:h-10 md:w-10 rounded-full bg-white/10 border border-white/15 hover:bg-white/15 transition-colors flex items-center justify-center">
                      <Settings className="w-4 h-4 md:w-5 md:h-5 text-white" />
                    </button>
                  </div>
                </div>

                {/* Center play */}
                <div className="flex items-center justify-center">
                  <button className="h-12 w-12 sm:h-14 sm:w-14 rounded-full bg-white/15 border border-white/25 hover:bg-white/20 transition-colors flex items-center justify-center">
                    <Play className="w-6 h-6 sm:w-7 sm:h-7 text-white fill-white" />
                  </button>
                </div>

                {/* Bottom controls */}
                <div className="space-y-3 md:space-y-4">
                  <p className="text-white font-semibold text-xs sm:text-sm md:text-base">
                    [Judul Series]
                  </p>

                  {/* Progress bar */}
                  <div className="space-y-1.5 md:space-y-2">
                    <div className="w-full h-1 md:h-1.5 bg-white/15 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-red-600 rounded-full"
                        style={{ width: `${progress}%` }}
                      />
                    </div>

                    <div className="flex items-center justify-between text-[10px] sm:text-xs text-white/70">
                      <span>5:07</span>
                      <span>15:28</span>
                    </div>
                  </div>

                  {/* Buttons row */}
                  <div className="flex items-center gap-2 md:gap-3">
                    <button className="h-9 sm:h-10 px-3 sm:px-4 rounded-full bg-white text-black font-semibold text-xs sm:text-sm inline-flex items-center gap-2 hover:bg-white/90 transition-colors">
                      <Info className="w-4 h-4" />
                      Info
                    </button>

                    <button className="h-9 sm:h-10 px-4 sm:px-5 rounded-full bg-white/10 border border-white/20 text-white font-semibold text-xs sm:text-sm hover:bg-white/15 transition-colors">
                      Continue Watching
                    </button>
                  </div>
                </div>
              </div>

              {/* Right small icons cluster - keep desktop, hide on mobile */}
              <div className="hidden md:flex absolute right-6 bottom-28 items-center gap-2 opacity-80">
                <div className="h-8 w-8 rounded-lg bg-white/10 border border-white/15" />
                <div className="h-8 w-8 rounded-lg bg-white/10 border border-white/15" />
              </div>
            </div>
          </div>

          {/* ===== INFO BAR under player ===== */}
          <div className="mt-5 md:mt-8 flex flex-col md:flex-row md:items-start md:justify-between gap-4 md:gap-6">
            <div className="space-y-2 md:space-y-3">
              <h1 className="text-lg sm:text-xl md:text-3xl font-bold">
                [Judul Series]
              </h1>

              <div className="flex flex-wrap items-center gap-2 md:gap-3 text-xs md:text-sm">
                <span className="px-2.5 py-1 rounded-full bg-white/10 border border-white/10">
                  [Genre]
                </span>

                <div className="flex items-center gap-1 text-yellow-400">
                  <span>★</span>
                  <span>★</span>
                  <span>★</span>
                  <span className="text-white/70">8.0</span>
                </div>

                <span className="text-white/60">2025</span>
                <span className="text-white/60">1h 0m</span>
              </div>
            </div>

            {/* ACTION BUTTONS: kecil di mobile, DESKTOP sama */}
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
          <p className="mt-3 md:mt-5 text-white/70 text-xs sm:text-sm leading-relaxed max-w-4xl">
            [Brief Synopsis] Lorem ipsum dolor sit amet consectetur. Volutpat turpis in aliquam
            pellentesque quis vulputate et imperdiet. Faucibus quam eleifend egestas ac amet
            sociis velit. Et cras tristique montes nec velit.
          </p>
        </div>
      </div>

      {/* ===== MAIN CONTENT ===== */}
      <div className="max-w-[1400px] mx-auto px-3 sm:px-4 md:px-12 pb-14 md:pb-16">
        {/* ===== EPISODES ===== */}
        <section className="mt-2">
          <div className="flex items-end justify-between mb-3 md:mb-4">
            <h2 className="text-base sm:text-lg md:text-xl font-bold">Episode</h2>

            {/* keep desktop arrow only */}
            <button className="hidden md:inline-flex items-center gap-1 text-white/60 hover:text-white transition-colors text-sm">
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>

          {/* MOBILE: grid 2 kolom kecil (match screenshot), DESKTOP: tetap horizontal */}
          <div className="md:hidden grid grid-cols-2 gap-3">
            {episodes.map((ep) => (
              <div key={ep.id} className="cursor-pointer">
                <div className="relative w-full aspect-[3/4] rounded-xl overflow-hidden bg-[#0f172a] border border-white/10">
                  <Image src={ep.image} alt={ep.title} fill className="object-cover" />
                </div>

                <div className="mt-2 space-y-1">
                  <p className="text-xs font-semibold text-white line-clamp-1">{ep.title}</p>
                  <p className="text-[10px] text-white/60 line-clamp-2">{ep.description}</p>
                  <div className="flex items-center justify-between text-[10px] text-white/50">
                    <span>[Genre]</span>
                    <span>{ep.duration}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* DESKTOP: tetap horizontal seperti sebelumnya */}
          <div className="hidden md:block relative">
            <div className="overflow-x-auto hide-scrollbar -mx-4 md:mx-0 px-4 md:px-0 pb-2">
              <div className="flex gap-5 min-w-max">
                {episodes.map((ep) => (
                  <div key={ep.id} className="group cursor-pointer w-[260px]">
                    <div className="relative h-[260px] rounded-2xl overflow-hidden bg-[#0f172a] border border-white/10">
                      <Image
                        src={ep.image}
                        alt={ep.title}
                        fill
                        className="object-cover group-hover:scale-[1.03] transition-transform duration-300"
                      />

                      <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/25 to-transparent" />

                      <div className="absolute inset-0 flex items-center justify-center">
                        <button className="h-12 w-12 rounded-full bg-white/15 border border-white/20 hover:bg-white/20 transition-colors flex items-center justify-center">
                          <Play className="w-6 h-6 text-white fill-white" />
                        </button>
                      </div>

                      <div className="absolute left-4 right-4 bottom-4 space-y-1">
                        <p className="text-white font-semibold text-sm line-clamp-1">{ep.title}</p>
                        <p className="text-white/70 text-xs leading-snug line-clamp-2">
                          {ep.description}
                        </p>
                        <div className="flex items-center justify-between text-xs text-white/60 pt-1">
                          <span>[Genre]</span>
                          <span>{ep.duration}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="hidden md:flex absolute right-0 top-1/2 -translate-y-1/2">
              <button className="h-10 w-10 rounded-full bg-white/10 border border-white/15 hover:bg-white/15 transition-colors flex items-center justify-center">
                <ChevronRight className="w-5 h-5 text-white" />
              </button>
            </div>
          </div>
        </section>

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
              placeholder="Placeholder review"
              className="w-full min-h-[100px] rounded-xl bg-[#0b1222] border border-white/10 px-4 py-3 text-xs sm:text-sm text-white placeholder:text-white/35 outline-none focus:border-white/20"
            />

            <div className="flex justify-end mt-4">
              <button className="h-9 sm:h-10 px-5 sm:px-6 rounded-full bg-white text-black font-semibold text-xs sm:text-sm hover:bg-white/90 transition-colors">
                Submit Review
              </button>
            </div>
          </div>

          <div className="px-4 sm:px-6 py-4 border-t border-white/10 flex items-center justify-between">
            <button className="text-xs sm:text-sm text-white/60 hover:text-white transition-colors">
              ↑ Scroll to Top
            </button>
            <div className="text-xs text-white/40" />
          </div>
        </section>
      </div>

      <Footer />
    </div>
  )
}
