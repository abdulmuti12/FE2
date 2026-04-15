'use client'

import { Suspense, useEffect, useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { useSearchParams } from 'next/navigation'
import { Header } from '@/components/header'
import { Footer } from '@/components/footer'
import { Eye, Heart, Play, Share2 } from 'lucide-react'

interface RelatedAward {
  id: string
  name: string
  image_url?: string | null
  image_landscape_url?: string | null
  video_url?: string | null
  likes?: string | number
  views?: string | number
}

interface AwardDetailData {
  id: string
  name: string
  dates?: string
  description?: string
  type?: string
  run_time_format?: string
  likes?: string | number
  views?: string | number
  play?: string | number
  image_url?: string
  image_landscape_url?: string
  video_url?: string
  relate?: RelatedAward[]
}

const convertToSecureUrl = (url: string | null | undefined): string => {
  if (!url) return ''
  return url.replace('http://', 'https://')
}

function AwardsDetailContent() {
  const searchParams = useSearchParams()
  const awardId = searchParams.get('id')

  const [awardData, setAwardData] = useState<AwardDetailData | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchAwardDetail = async () => {
      if (!awardId) {
        setError('ID award tidak ditemukan di URL')
        setIsLoading(false)
        return
      }

      try {
        setIsLoading(true)
        const token = localStorage.getItem('user_token') || ''

        if (!token) {
          setError('Silakan login terlebih dahulu')
          return
        }

        const url = new URL('/api/awards/detail', window.location.origin)
        url.searchParams.set('id', awardId)

        const response = await fetch(url.toString(), {
          method: 'GET',
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        })

        const result = await response.json()

        if (response.ok && result.status === true && result.list) {
          setAwardData(result.list)
        } else {
          setError(result.message || 'Gagal mengambil detail award')
        }
      } catch (err) {
        console.error('Error fetching award detail:', err)
        setError('Terjadi kesalahan saat menghubungi server')
      } finally {
        setIsLoading(false)
      }
    }

    fetchAwardDetail()
  }, [awardId])

  const handleShare = async () => {
    const url = window.location.href

    try {
      await navigator.clipboard.writeText(url)
      alert('Link copied to clipboard!')
    } catch {
      alert('Gagal menyalin link')
    }
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#020817] flex flex-col items-center justify-center text-white font-sans">
        <div className="w-10 h-10 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mb-4"></div>
        <p>Memuat Award...</p>
      </div>
    )
  }

  if (error || !awardData) {
    return (
      <div className="min-h-screen bg-[#020817] flex flex-col items-center justify-center text-white font-sans gap-4">
        <p className="text-xl font-bold">Oops!</p>
        <p className="text-gray-400">{error || 'Data award tidak ditemukan.'}</p>
        <Link href="/dashboard/awards" className="px-6 py-2 bg-blue-600 hover:bg-blue-700 rounded-full transition-colors">
          Kembali ke Awards
        </Link>
      </div>
    )
  }

  return (
    <>
      <Header />

      <div className="bg-gradient-to-b from-[#0b1222] via-[#020817] to-[#020817] pb-8 md:pb-10">
        <div className="w-full px-4 md:px-8 lg:px-12 pt-4 md:pt-6">
          <div className="relative w-full rounded-xl md:rounded-2xl overflow-hidden bg-black shadow-[0_20px_60px_rgba(0,0,0,0.6)]">
            <div className="relative w-full aspect-video md:max-h-[85vh] bg-black mx-auto">
              {awardData.video_url ? (
                <video
                  key={awardData.video_url}
                  controls
                  controlsList="nodownload"
                  className="w-full h-full object-contain"
                  poster={convertToSecureUrl(awardData.image_landscape_url || awardData.image_url)}
                >
                  <source src={convertToSecureUrl(awardData.video_url)} type="video/mp4" />
                  Browser Anda tidak mendukung pemutar video ini.
                </video>
              ) : (
                <div className="w-full h-full flex items-center justify-center text-white/50">
                  Video tidak tersedia
                </div>
              )}
            </div>
          </div>

          <div className="mt-5 md:mt-8 flex flex-col md:flex-row md:items-start md:justify-between gap-4 md:gap-6">
            <div className="space-y-2 md:space-y-3">
              <h1 className="text-lg sm:text-xl md:text-3xl font-bold">{awardData.name}</h1>

              <div className="flex flex-wrap items-center gap-2 md:gap-3 text-xs md:text-sm">
                <span className="px-2.5 py-1 rounded-full bg-white/10 border border-white/10">
                  {awardData.type || 'Award'}
                </span>
                <span className="text-white/60">{awardData.run_time_format || '-'}</span>
                <span className="text-white/60">
                  {awardData.dates
                    ? new Date(awardData.dates).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'short',
                        day: 'numeric',
                      })
                    : '-'}
                </span>
                <div className="flex items-center gap-1 text-white/70">
                  <Heart className="w-3.5 h-3.5" />
                  <span>{awardData.likes || 0}</span>
                </div>
                <div className="flex items-center gap-1 text-white/70">
                  <Eye className="w-3.5 h-3.5" />
                  <span>{awardData.views || 0}</span>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2 md:gap-3">
              <Link
                href="/dashboard/awards"
                className="h-9 px-4 md:h-10 rounded-full border border-white/15 text-white bg-white/5 hover:bg-white/10 transition-colors flex items-center justify-center text-xs md:text-sm"
              >
                Back
              </Link>
              <button
                onClick={handleShare}
                className="h-9 w-9 md:h-10 md:w-10 rounded-full border border-white/15 bg-white/5 hover:bg-white/10 transition-colors flex items-center justify-center"
                title="Share"
              >
                <Share2 className="w-4 h-4 md:w-5 md:h-5" />
              </button>
            </div>
          </div>

          <div
            className="mt-3 md:mt-5 text-white/70 text-xs sm:text-sm leading-relaxed md:max-w-[80%] overflow-hidden [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]"
            dangerouslySetInnerHTML={{ __html: awardData.description || 'Tidak ada deskripsi award.' }}
          />
        </div>
      </div>

      <div className="w-full px-4 md:px-8 lg:px-12 pb-14 md:pb-16">
        <section className="mt-8 md:mt-10 rounded-2xl bg-white/5 border border-white/10 overflow-hidden">
          <div className="px-4 sm:px-6 py-4 sm:py-5 border-b border-white/10">
            <h2 className="text-base sm:text-lg md:text-xl font-bold">Related Awards</h2>
          </div>

          <div className="px-4 sm:px-6 py-5 sm:py-6">
            {!awardData.relate || awardData.relate.length === 0 ? (
              <p className="text-white/60 text-sm">Belum ada related awards.</p>
            ) : (
              <div className="flex gap-4 md:gap-5 overflow-x-auto pb-2 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
                {awardData.relate.map((related) => (
                  <Link
                    key={related.id}
                    href={`/dashboard/awards/detail?id=${related.id}`}
                    className="snap-start shrink-0 w-[240px] cursor-pointer p-2 rounded-xl border border-white/10 hover:border-white/30 bg-white/5 transition-all"
                  >
                    <div className="relative aspect-video rounded-lg overflow-hidden mb-2 bg-gray-800">
                      <Image
                        src={convertToSecureUrl(related.image_landscape_url || related.image_url) || '/film/film1.png'}
                        alt={related.name}
                        fill
                        className="object-cover"
                      />
                      <div className="absolute inset-0 bg-black/20 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity">
                        <Play className="text-white w-5 h-5" />
                      </div>
                    </div>
                    <h3 className="font-bold text-sm truncate">{related.name}</h3>
                    <div className="mt-1 flex items-center gap-3 text-white/65 text-xs">
                      <span className="inline-flex items-center gap-1">
                        <Heart className="w-3.5 h-3.5" />
                        {related.likes || 0}
                      </span>
                      <span className="inline-flex items-center gap-1">
                        <Eye className="w-3.5 h-3.5" />
                        {related.views || 0}
                      </span>
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </div>
        </section>
      </div>

      <Footer />
    </>
  )
}

export default function AwardsDetailPage() {
  return (
    <div className="min-h-screen bg-[#020817] text-white font-sans">
      <Suspense
        fallback={
          <div className="min-h-screen flex items-center justify-center">
            <div className="w-10 h-10 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
          </div>
        }
      >
        <AwardsDetailContent />
      </Suspense>
    </div>
  )
}
