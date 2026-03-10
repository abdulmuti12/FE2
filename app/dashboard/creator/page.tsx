'use client'

import React, { useState } from "react"
import { Header } from '@/components/header'
import { Footer } from '@/components/footer'
import { ChevronRight, Search, ChevronDown } from 'lucide-react'

// Dummy data untuk simulasi daftar creator
const creatorsData = Array(24).fill(null).map((_, i) => ({
  id: i,
  name: '[Creator]',
  movies: '3 Movies',
  // Kita gunakan warna background berbeda untuk variasi visual seperti di gambar
  color: i % 3 === 0 ? 'bg-cyan-200' : i % 3 === 1 ? 'bg-purple-300' : 'bg-pink-300' 
}))

export default function CreatorsPage() {
  const [sortOption, setSortOption] = useState('Default')
  const [searchQuery, setSearchQuery] = useState('')

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
                placeholder="Placeholder"
                className="w-full md:w-64 bg-[#0a1120] border border-gray-800 text-gray-300 text-sm rounded-lg pl-10 pr-4 py-2.5 focus:outline-none focus:border-blue-600 placeholder-gray-600"
              />
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
            </div>
          </div>
        </div>

        {/* Creators Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-x-6 gap-y-12">
          {creatorsData.map((creator) => (
            <div key={creator.id} className="flex flex-col items-center group cursor-pointer">
              {/* Avatar Circle */}
              <div className={`w-32 h-32 md:w-40 md:h-40 rounded-full ${creator.color} flex items-center justify-center mb-4 transition-transform duration-300 group-hover:scale-105 border-4 border-[#020817] shadow-xl overflow-hidden`}>
                 {/* Placeholder Image (Pixel Art Style) */}
                 <div className="w-20 h-20 bg-white/30 grid grid-cols-3 gap-1 p-1">
                    <div className="bg-white/60 col-span-3"></div>
                    <div className="bg-white/60 row-span-2"></div>
                    <div className="bg-white/60"></div>
                    <div className="bg-white/60 row-span-2"></div>
                    <div className="bg-white/60 col-span-3"></div>
                 </div>
              </div>
              
              {/* Info */}
              <h3 className="text-white font-bold text-base mb-1 group-hover:text-blue-400 transition-colors">{creator.name}</h3>
              <p className="text-gray-500 text-xs">{creator.movies}</p>
            </div>
          ))}
        </div>

        {/* View More Button */}
        <div className="mt-16 flex justify-center">
          <button className="px-8 py-2.5 bg-[#0f172a] border border-gray-800 hover:bg-gray-800 text-gray-300 text-sm font-medium rounded-lg transition-all">
            View More
          </button>
        </div>

      </div>

      <Footer />
    </div>
  )
}