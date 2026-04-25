'use client'

import React, { useState, useEffect } from "react"
import { Header } from '@/components/header'
import { Footer } from '@/components/footer'
import { ChevronRight, Search, ChevronDown } from 'lucide-react'
import { useRouter } from 'next/navigation'
import Image from 'next/image'

interface Creator {
  id: string
  name: string
  avatar: string
  avatar_url: string
}

export default function CreatorsPage() {
  const router = useRouter()
  const [sortOption, setSortOption] = useState('Default')
  const [searchQuery, setSearchQuery] = useState('')
  const [creators, setCreators] = useState<Creator[]>([])
  const [filteredCreators, setFilteredCreators] = useState<Creator[]>([])
  const [loading, setLoading] = useState(true)
  const [displayCount, setDisplayCount] = useState(24)

  // Color palette for creator avatars
  const colors = ['bg-cyan-200', 'bg-purple-300', 'bg-pink-300', 'bg-blue-300', 'bg-green-300', 'bg-yellow-300']

  useEffect(() => {
    fetchCreators()
  }, [])

  useEffect(() => {
    filterAndSortCreators()
  }, [creators, searchQuery, sortOption])

  const fetchCreators = async () => {
    try {
      setLoading(true)
      const token = localStorage.getItem('user_token')

      console.log('[v0] Token from localStorage:', token ? 'Found' : 'Not found')

      if (!token) {
        router.push('/')
        return
      }

      const response = await fetch('/api/creators', {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      })

      const data = await response.json()
      console.log('[v0] Creators Response:', data)

      if (data.list && Array.isArray(data.list)) {
        setCreators(data.list)
      }
    } catch (error) {
      console.error('[v0] Error fetching creators:', error)
    } finally {
      setLoading(false)
    }
  }

  const filterAndSortCreators = () => {
    let filtered = creators

    // Apply search filter
    if (searchQuery.trim()) {
      filtered = filtered.filter(creator =>
        creator.name.toLowerCase().includes(searchQuery.toLowerCase())
      )
    }

    // Apply sorting
    if (sortOption === 'Name') {
      filtered = [...filtered].sort((a, b) => a.name.localeCompare(b.name))
    } else if (sortOption === 'Popularity') {
      // Keep original order (assumed to be by popularity from API)
      filtered = [...filtered]
    } else {
      // Default: keep original order
      filtered = [...filtered]
    }

    setFilteredCreators(filtered)
  }

  const getCreatorColor = (index: number) => {
    return colors[index % colors.length]
  }

  const getCreatorAvatar = (creator: Creator) => {
    if (creator.avatar_url && creator.avatar_url !== 'http://usky.ai/uploads/') {
      return creator.avatar_url
    }
    return null
  }

  const displayedCreators = filteredCreators.slice(0, displayCount)

  return (
    <div className="min-h-screen bg-[#020817] text-white font-sans">
      <Header />

      {/* --- Hero Section --- */}
      <div className="relative w-full h-[300px] md:h-[400px] overflow-hidden">
        {/* Background Image */}
        <div 
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: 'url("/images/privacy-header.jpg")' }} 
        />
        {/* Dark Overlay */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-[#020817]/60 to-[#020817]"></div>

        <div className="relative h-full flex flex-col justify-center items-center text-center px-4 pt-10">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Creators</h1>
          <div className="flex items-center gap-2 text-sm text-gray-400">
            <a href="/" className="hover:text-white transition-colors">Home</a>
            <ChevronRight className="w-4 h-4" />
            <span className="text-white">Creators</span>
          </div>
        </div>
      </div>

      {/* --- Main Content --- */}
      <div className="max-w-[1400px] mx-auto px-6 md:px-12 pb-20 -mt-10 relative z-10">
        
        {/* Filter & Search Bar */}
        <div className="flex flex-col md:flex-row justify-between items-end md:items-center gap-4 mb-10">
          
          {/* Sort By */}
          <div className="flex flex-col gap-2 w-full md:w-auto">
            <label className="text-xs font-bold text-gray-400 uppercase tracking-wide">Sort By</label>
            <div className="relative">
              <select 
                value={sortOption}
                onChange={(e) => setSortOption(e.target.value)}
                className="w-full md:w-48 appearance-none bg-[#0a1120] border border-gray-800 text-gray-300 text-sm rounded-lg px-4 py-2.5 focus:outline-none focus:border-blue-600 cursor-pointer"
              >
                <option value="Default">Default</option>
                <option value="Name">Name</option>
                <option value="Popularity">Popularity</option>
              </select>
              <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500 pointer-events-none" />
            </div>
          </div>

          {/* Search */}
          <div className="flex flex-col gap-2 w-full md:w-auto">
            <label className="text-xs font-bold text-gray-400 uppercase tracking-wide text-left md:text-right">Search</label>
            <div className="relative">
              <input 
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search creators..."
                className="w-full md:w-64 bg-[#0a1120] border border-gray-800 text-gray-300 text-sm rounded-lg pl-10 pr-4 py-2.5 focus:outline-none focus:border-blue-600 placeholder-gray-600"
              />
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
            </div>
          </div>
        </div>

        {/* Creators Grid */}
        {loading ? (
          <div className="flex justify-center items-center py-20">
            <p className="text-gray-400">Loading creators...</p>
          </div>
        ) : displayedCreators.length > 0 ? (
          <>
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-x-6 gap-y-12">
              {displayedCreators.map((creator, index) => {
                const avatarUrl = getCreatorAvatar(creator)
                const bgColor = getCreatorColor(index)

                return (
<div 
  key={creator.id} 
  onClick={() => router.push(`/creator/detail/${creator.id}`)}
  className="flex flex-col items-center group cursor-pointer"
>                    {/* Avatar Circle */}
                    <div className={`w-32 h-32 md:w-40 md:h-40 rounded-full ${!avatarUrl ? bgColor : ''} flex items-center justify-center mb-4 transition-transform duration-300 group-hover:scale-105 border-4 border-[#020817] shadow-xl overflow-hidden`}>
                      {avatarUrl ? (
                        <div className="relative w-full h-full">
                          <Image
                            src={avatarUrl}
                            alt={creator.name}
                            fill
                            sizes="(max-width: 768px) 128px, 160px"
                            className="object-cover"
                          />
                        </div>
                      ) : (
                        <div className="w-20 h-20 bg-white/30 grid grid-cols-3 gap-1 p-1">
                          <div className="bg-white/60 col-span-3"></div>
                          <div className="bg-white/60 row-span-2"></div>
                          <div className="bg-white/60"></div>
                          <div className="bg-white/60 row-span-2"></div>
                          <div className="bg-white/60 col-span-3"></div>
                        </div>
                      )}
                    </div>
                    
                    {/* Info */}
                    <h3 className="text-white font-bold text-base mb-1 group-hover:text-blue-400 transition-colors text-center">{creator.name}</h3>
                    <p className="text-gray-500 text-xs">Creator</p>
                  </div>
                )
              })}
            </div>

            {/* View More Button */}
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
            <p className="text-gray-400">No creators found</p>
          </div>
        )}

      </div>

      <Footer />
    </div>
  )
}
