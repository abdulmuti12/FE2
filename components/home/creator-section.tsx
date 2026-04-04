'use client'

import Link from 'next/link'
import Image from 'next/image'
import { ChevronLeft, ChevronRight } from 'lucide-react'

interface Creator {
  id: string
  name: string
  avatar_url?: string
  avatar?: string
  total_video?: string
}

interface CreatorSectionProps {
  creators?: Creator[]
  title?: string
  viewAllLink?: string
}

// 💡 DUMMY DATA: Dipakai sementara jika props 'creators' yang dikirim kosong
const DUMMY_CREATORS: Creator[] = Array(6).fill(null).map((_, i) => ({
  id: `dummy-${i + 1}`,
  name: '[Creator]',
  total_video: '3'
}))

export function CreatorSection({ 
  creators = [], 
  title = 'Creator',
  viewAllLink = '/dashboard/creator'
}: CreatorSectionProps) {
  
  // Jika creators kosong, pakaikan dummy data agar UI tetap bisa di-test
  const activeData = creators.length > 0 ? creators : DUMMY_CREATORS
  const displayedCreators = activeData.slice(0, 6)

  return (
    <section className="border-t border-white/10 px-4 py-6 md:px-6 md:py-8 lg:px-12 bg-[#020817]">
      {/* Header dengan title dan panah navigasi */}
      <div className="mb-6 flex items-center justify-between">
        <h2 className="text-lg font-bold text-white md:text-xl">{title}</h2>
        <div className="flex items-center gap-4 text-gray-400">
          <button className="transition-colors hover:text-white" aria-label="Previous">
            <ChevronLeft className="h-5 w-5" />
          </button>
          <button className="transition-colors hover:text-white" aria-label="Next">
            <ChevronRight className="h-5 w-5" />
          </button>
        </div>
      </div>

      {/* Creators Grid */}
      <div className="grid grid-cols-2 gap-4 md:grid-cols-3 md:gap-6 lg:grid-cols-6">
        {displayedCreators.map((creator) => (
          <Link
            key={creator.id}
            href={`/dashboard/creator?id=${creator.id}`}
            className="group flex cursor-pointer flex-col items-center"
          >
            {/* Avatar Circle */}
            <div className="relative mb-3 h-24 w-24 overflow-hidden rounded-full border-4 border-[#020817] bg-gray-800 shadow-lg transition-transform duration-300 group-hover:scale-110 md:mb-4 md:h-32 md:w-32">
              {creator.avatar_url || creator.avatar ? (
                <Image
                  src={creator.avatar_url || creator.avatar || '/placeholder.svg'}
                  alt={creator.name}
                  fill
                  className="object-cover"
                />
              ) : (
                <div className="flex h-full w-full items-center justify-center bg-gray-200">
                   {/* Placeholder Pixel-art style as seen on image can be complex, using simple text for now */}
                  <div className="text-xl font-bold text-gray-600">
                    {creator.name.replace(/[^a-zA-Z]/g, '').charAt(0).toUpperCase()}
                  </div>
                </div>
              )}
            </div>

            {/* Creator Info */}
            <h3 className="mb-1 text-center text-sm font-semibold text-white transition-colors group-hover:text-blue-400 md:text-base">
              {creator.name}
            </h3>
            <p className="text-center text-xs text-gray-400 md:text-sm">
              {creator.total_video || '0'} Films
            </p>
          </Link>
        ))}
      </div>

      {/* Tombol View All Creators - Pindah ke bawah tengah */}
      <div className="mt-8 flex justify-center">
        <Link
          href={viewAllLink}
          className="rounded-lg border border-white/20 bg-transparent px-6 py-2 text-sm font-medium text-white transition-colors hover:bg-white/10 md:px-8 md:py-2.5"
        >
          View All Creators
        </Link>
      </div>
    </section>
  )
}