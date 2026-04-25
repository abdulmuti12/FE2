'use client'

import { useState } from 'react'
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

// 💡 SOLUSI: Ubah DUMMY DATA menjadi 12 agar tombol bisa berfungsi (bisa di-scroll)
const DUMMY_CREATORS: Creator[] = Array(12).fill(null).map((_, i) => ({
  id: `dummy-${i + 1}`,
  name: `Creator ${i + 1}`,
  total_video: '3'
}))

export function CreatorSection({ 
  creators = [], 
  title = 'Creator',
  viewAllLink = '/home/creator'
}: CreatorSectionProps) {
  
  const activeData = creators.length > 0 ? creators : DUMMY_CREATORS

  const [currentIndex, setCurrentIndex] = useState(0)

  // Asumsi jumlah item yang terlihat di layar besar adalah 6
  const itemsPerView = 6
  // maxIndex sekarang akan bernilai 6 (karena 12 - 6 = 6), sehingga tombol kanan akan aktif!
  const maxIndex = Math.max(0, activeData.length - itemsPerView)

  const handleNext = () => {
    if (currentIndex < maxIndex) {
      setCurrentIndex(currentIndex + 1)
    }
  }

  const handlePrev = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1)
    }
  }

  return (
    <section className="border-t border-white/10 px-4 py-6 md:px-6 md:py-8 lg:px-12 bg-[#020817]">
      
      {/* ===== HEADER ===== */}
   

      {/* ===== CREATOR LIST ===== */}
      <div className="relative">
        <div className="overflow-hidden">
          <div
            className="flex transition-transform duration-500 ease-in-out gap-4"
            style={{ transform: `translateX(-${currentIndex * (100 / itemsPerView)}%)` }}
          >
            {activeData.map((creator) => (
              <div 
                key={creator.id} 
                className="flex-shrink-0 w-1/3 sm:w-1/4 md:w-1/6" 
              >
                <Link
                  href={`/home/creator?id=${creator.id}`}
                  className="group flex w-full cursor-pointer flex-col items-center"
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
                        <div className="text-xl font-bold text-gray-600">
                          {creator.name.replace(/[^a-zA-Z]/g, '').charAt(0).toUpperCase() || 'C'}
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Creator Info */}
                  <h3 className="mb-1 text-center text-sm font-semibold text-white transition-colors group-hover:text-blue-400 md:text-base line-clamp-1">
                    {creator.name}
                  </h3>
                  <p className="text-center text-xs text-gray-400 md:text-sm">
                    {creator.total_video || '0'} Films
                  </p>
                </Link>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ===== VIEW ALL BUTTON ===== */}
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