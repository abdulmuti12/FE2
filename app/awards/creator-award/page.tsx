'use client'

import React, { useEffect, useMemo, useState } from 'react'
import { Header } from '@/components/header'
import { Footer } from '@/components/footer'
import { ChevronDown, ChevronRight, Search, Trophy } from 'lucide-react'
import { useRouter } from 'next/navigation'
import Image from 'next/image'

interface CreatorAward {
  id: string
  name: string
  avatar_url: string
  total_award: number
}

export default function CreatorAwardPage() {
  const router = useRouter()
  const [sortOption, setSortOption] = useState('Default')
  const [searchQuery, setSearchQuery] = useState('')
  const [creatorAwards, setCreatorAwards] = useState<CreatorAward[]>([])
  const [loading, setLoading] = useState(true)
  const [displayCount, setDisplayCount] = useState(24)

  const colors = [
    'bg-cyan-200',
    'bg-purple-300',
    'bg-pink-300',
    'bg-blue-300',
    'bg-green-300',
    'bg-yellow-300',
  ]

  useEffect(() => {
    const fetchCreatorAwards = async () => {
      try {
        setLoading(true)
        const token = localStorage.getItem('user_token')

        if (!token) {
          router.push('/')
          return
        }

        const response = await fetch('/api/awards/creator-award?page=1&limit=200', {
          method: 'GET',
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        })

        const data = await response.json()
        const rawList = Array.isArray(data?.list)
          ? data.list
          : Array.isArray(data?.data)
            ? data.data
            : Array.isArray(data?.creators)
              ? data.creators
              : []

        const mapped: CreatorAward[] = rawList.map((item: any, index: number) => ({
          id: String(item?.id ?? item?.id_creator ?? index + 1),
          name: String(item?.name ?? item?.creator_name ?? 'Unknown Creator'),
          avatar_url: String(item?.avatar_url ?? item?.avatar ?? item?.image_url ?? ''),
          total_award: Number(item?.total_award ?? item?.award_count ?? item?.total ?? 0),
        }))

        setCreatorAwards(mapped)
      } catch (error) {
        console.error('Error fetching creator awards:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchCreatorAwards()
  }, [router])

  const filteredCreators = useMemo(() => {
    let data = [...creatorAwards]

    if (searchQuery.trim()) {
      data = data.filter((creator) =>
        creator.name.toLowerCase().includes(searchQuery.toLowerCase())
      )
    }

    if (sortOption === 'Name') {
      data.sort((a, b) => a.name.localeCompare(b.name))
    } else if (sortOption === 'Awards') {
      data.sort((a, b) => b.total_award - a.total_award)
    }

    return data
  }, [creatorAwards, searchQuery, sortOption])

  const displayedCreators = filteredCreators.slice(0, displayCount)

  const getCreatorColor = (index: number) => colors[index % colors.length]

  return (
    <div className="min-h-screen bg-[#020817] text-white font-sans">
      <Header />

      <div className="relative w-full h-[300px] md:h-[400px] overflow-hidden">
        {/* <div
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: 'url("/images/privacy-header.jpg")' }}
        /> */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-[#020817]/60 to-[#020817]" />

        <div className="relative h-full flex flex-col justify-center items-center text-center px-4 pt-10">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Creator Award</h1>
          <div className="flex items-center gap-2 text-sm text-gray-400">
            <a href="/" className="hover:text-white transition-colors">
              Home
            </a>
            <ChevronRight className="w-4 h-4" />
            <a href="/awards" className="hover:text-white transition-colors">
              Awards
            </a>
            <ChevronRight className="w-4 h-4" />
            <span className="text-white">Creator Award</span>
          </div>
        </div>
      </div>

      <div className="max-w-[1400px] mx-auto px-6 md:px-12 pb-20 -mt-10 relative z-10">
        <div className="flex flex-col md:flex-row justify-between items-end md:items-center gap-4 mb-10">
          <div className="flex flex-col gap-2 w-full md:w-auto">
            <label className="text-xs font-bold text-gray-400 uppercase tracking-wide">
              Sort By
            </label>
            <div className="relative">
              <select
                value={sortOption}
                onChange={(e) => setSortOption(e.target.value)}
                className="w-full md:w-48 appearance-none bg-[#0a1120] border border-gray-800 text-gray-300 text-sm rounded-lg px-4 py-2.5 focus:outline-none focus:border-blue-600 cursor-pointer"
              >
                <option value="Default">Default</option>
                <option value="Name">Name</option>
                <option value="Awards">Awards</option>
              </select>
              <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500 pointer-events-none" />
            </div>
          </div>

          <div className="flex flex-col gap-2 w-full md:w-auto">
            <label className="text-xs font-bold text-gray-400 uppercase tracking-wide text-left md:text-right">
              Search
            </label>
            <div className="relative">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search creator award..."
                className="w-full md:w-64 bg-[#0a1120] border border-gray-800 text-gray-300 text-sm rounded-lg pl-10 pr-4 py-2.5 focus:outline-none focus:border-blue-600 placeholder-gray-600"
              />
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
            </div>
          </div>
        </div>

        {loading ? (
          <div className="flex justify-center items-center py-20">
            <p className="text-gray-400">Loading creator awards...</p>
          </div>
        ) : displayedCreators.length > 0 ? (
          <>
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-x-6 gap-y-12">
              {displayedCreators.map((creator, index) => {
                const bgColor = getCreatorColor(index)
                const hasAvatar =
                  creator.avatar_url && creator.avatar_url !== 'http://usky.ai/uploads/'

                return (
                  <div
                    key={creator.id}
                    onClick={() => router.push(`/awards/creator-award/detail/${creator.id}`)}
                    className="flex flex-col items-center group cursor-pointer"
                  >
                    <div
                      className={`w-32 h-32 md:w-40 md:h-40 rounded-full ${!hasAvatar ? bgColor : ''} flex items-center justify-center mb-4 transition-transform duration-300 group-hover:scale-105 border-4 border-[#020817] shadow-xl overflow-hidden`}
                    >
                      {hasAvatar ? (
                        <div className="relative w-full h-full">
                          <Image
                            src={creator.avatar_url}
                            alt={creator.name}
                            fill
                            sizes="(max-width: 768px) 128px, 160px"
                            className="object-cover"
                          />
                        </div>
                      ) : (
                        <div className="w-20 h-20 bg-white/30 grid grid-cols-3 gap-1 p-1">
                          <div className="bg-white/60 col-span-3" />
                          <div className="bg-white/60 row-span-2" />
                          <div className="bg-white/60" />
                          <div className="bg-white/60 row-span-2" />
                          <div className="bg-white/60 col-span-3" />
                        </div>
                      )}
                    </div>

                    <h3 className="text-white font-bold text-base mb-1 group-hover:text-blue-400 transition-colors text-center">
                      {creator.name}
                    </h3>
                    <div className="inline-flex items-center gap-1 text-xs text-yellow-400">
                      <Trophy className="w-3.5 h-3.5" />
                      <span>{creator.total_award} Awards</span>
                    </div>
                  </div>
                )
              })}
            </div>

            {displayCount < filteredCreators.length && (
              <div className="mt-16 flex justify-center">
                <button
                  onClick={() => setDisplayCount(displayCount + 24)}
                  className="px-8 py-2.5 bg-[#0f172a] border border-gray-800 hover:bg-gray-800 text-gray-300 text-sm font-medium rounded-lg transition-all"
                >
                  View More
                </button>
              </div>
            )}
          </>
        ) : (
          <div className="flex justify-center items-center py-20">
            <p className="text-gray-400">No creator award data found</p>
          </div>
        )}
      </div>

      <Footer />
    </div>
  )
}
