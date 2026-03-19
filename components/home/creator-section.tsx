'use client'

import Link from 'next/link'
import Image from 'next/image'
import { ChevronRight } from 'lucide-react'

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

export function CreatorSection({ 
  creators = [], 
  title = 'Top Creators',
  viewAllLink = '/dashboard/creator'
}: CreatorSectionProps) {
  // Display max 6 creators in the section
  const displayedCreators = creators.slice(0, 6)

  return (
    <section className="border-t border-white/10 px-4 py-6 md:px-6 md:py-8 lg:px-12">
      {/* Header with title and View All button */}
      <div className="mb-6 flex items-center justify-between">
        <h2 className="text-sm font-semibold text-white md:text-lg">{title}</h2>
        <Link
          href={viewAllLink}
          className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/10 px-4 py-1.5 text-xs font-medium text-white/90 transition-colors hover:bg-white/15 md:px-5 md:py-2 md:text-sm"
        >
          <span>View all creator</span>
          <ChevronRight className="h-4 w-4" />
        </Link>
      </div>

      {/* Creators Grid */}
      {displayedCreators.length > 0 ? (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 md:gap-6">
          {displayedCreators.map((creator) => (
            <Link
              key={creator.id}
              href={`/dashboard/creator?id=${creator.id}`}
              className="group flex flex-col items-center cursor-pointer"
            >
              {/* Avatar Circle */}
              <div className="relative w-24 h-24 md:w-32 md:h-32 rounded-full overflow-hidden mb-3 md:mb-4 border-4 border-[#020817] shadow-lg transition-transform duration-300 group-hover:scale-110 bg-gradient-to-br from-cyan-500 via-purple-500 to-pink-500">
                {creator.avatar_url || creator.avatar ? (
                  <Image
                    src={creator.avatar_url || creator.avatar || '/placeholder.svg'}
                    alt={creator.name}
                    fill
                    className="object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-cyan-400 via-purple-400 to-pink-400">
                    <div className="text-white font-bold text-xl">
                      {creator.name.charAt(0).toUpperCase()}
                    </div>
                  </div>
                )}
              </div>

              {/* Creator Info */}
              <h3 className="text-white font-semibold text-sm md:text-base text-center mb-1 group-hover:text-blue-400 transition-colors">
                {creator.name}
              </h3>
              <p className="text-gray-400 text-xs md:text-sm text-center">
                {creator.total_video || '0'} Videos
              </p>
            </Link>
          ))}
        </div>
      ) : (
        <div className="flex items-center justify-center py-12">
          <p className="text-gray-400 text-sm">No creators available</p>
        </div>
      )}
    </section>
  )
}
