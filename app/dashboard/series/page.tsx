'use client'

import React, { useState } from 'react'
import Image from 'next/image'
import { Header } from '@/components/header'
import { Footer } from '@/components/footer'
import { Play, Search, ChevronDown } from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'

const GENRES = [
  'Action',
  'Adventure',
  'Comedy',
  'History',
  'Horror',
  'Fantasy',
  'Mystery',
  'Religious',
  'Story',
]

const CREATORS = ['All Creator', 'Creator A', 'Creator B', 'Creator C']

const SORT_OPTIONS = ['Latest', 'Oldest', 'Popular', 'A-Z']

export default function SeriesPage() {
  const [selectedGenre, setSelectedGenre] = useState('All Genre')
  const [selectedCreator, setSelectedCreator] = useState('All Creator')
  const [selectedSort, setSelectedSort] = useState('Latest')
  const [searchGenre, setSearchGenre] = useState('')
  const [isGenreDropdownOpen, setIsGenreDropdownOpen] = useState(false)

  const filteredGenres = GENRES.filter((genre) =>
    genre.toLowerCase().includes(searchGenre.toLowerCase())
  )

  const [seriesData] = useState([
    {
      id: 1,
      title: '[Judul Series]',
      genre: 'Genre',
      status: 'In Dev',
      image: '/film/film2.png',
    },
    {
      id: 2,
      title: '[Judul Series]',
      genre: 'Genre',
      status: 'In Dev',
      image:
        'https://hebbkx1anhila5yf.public.blob.vercel-storage.com/0938af323a7fb3c821e2c95b6766a49090cd1e0b-M2XYI31in3J9xgYB1jeAqN6qUyAvW6.png',
    },
    {
      id: 3,
      title: '[Judul Series]',
      genre: 'Genre',
      status: 'In Dev',
      image: '/film/film2.png',
    },
    {
      id: 4,
      title: '[Judul Series]',
      genre: 'Genre',
      status: 'In Dev',
      image: '/film/film2.png',
    },
    {
      id: 5,
      title: '[Judul Series]',
      genre: 'Genre',
      status: 'In Dev',
      image:
        'https://hebbkx1anhila5yf.public.blob.vercel-storage.com/0938af323a7fb3c821e2c95b6766a49090cd1e0b-M2XYI31in3J9xgYB1jeAqN6qUyAvW6.png',
    },
    {
      id: 6,
      title: '[Judul Series]',
      genre: 'Genre',
      status: 'In Dev',
      image:
        'https://hebbkx1anhila5yf.public.blob.vercel-storage.com/0938af323a7fb3c821e2c95b6766a49090cd1e0b-M2XYI31in3J9xgYB1jeAqN6qUyAvW6.png',
    },
    {
      id: 7,
      title: '[Judul Series]',
      genre: 'Genre',
      status: 'In Dev',
      image:
        'https://hebbkx1anhila5yf.public.blob.vercel-storage.com/0938af323a7fb3c821e2c95b6766a49090cd1e0b-M2XYI31in3J9xgYB1jeAqN6qUyAvW6.png',
    },
    {
      id: 8,
      title: '[Judul Series]',
      genre: 'Genre',
      status: 'In Dev',
      image:
        'https://hebbkx1anhila5yf.public.blob.vercel-storage.com/0938af323a7fb3c821e2c95b6766a49090cd1e0b-M2XYI31in3J9xgYB1jeAqN6qUyAvW6.png',
    },
  ])

  const [displayCount, setDisplayCount] = useState(8)

  const handleLoadMore = () => {
    setDisplayCount((prev) => prev + 4)
  }

  return (
    <div className="min-h-screen bg-[#020817] text-white font-sans">
      <Header />

      {/* Hero Section */}
      <div className="relative w-full h-[240px] md:h-[400px] overflow-hidden">
        {/* Background Image */}
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: 'url("/images/privacy-header.jpg")' }}
        />
        {/* Dark Overlay */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-[#020817]/60 to-[#020817]" />

        <div className="relative h-full flex flex-col justify-center items-center text-center px-4">
          <h1 className="text-3xl md:text-5xl font-bold mb-4">Series</h1>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 md:px-12 pb-20 -mt-10 relative z-10">
        {/* Filter Section */}
        <div className="mb-8">
          <div
            className="
              flex flex-col lg:flex-row lg:items-center justify-between gap-4
              rounded-xl border border-gray-800 bg-[#0b1222]/70 p-4
              md:rounded-none md:border-0 md:bg-transparent md:p-0
            "
          >
            {/* Filter By Genre + Sort */}
            <div className="grid grid-cols-1 gap-3 sm:flex sm:flex-row sm:gap-4 sm:items-center">
              {/* FILTER BY + Genre */}
              <div className="grid grid-cols-1 gap-2 sm:flex sm:items-center sm:gap-2">
                <span className="text-xs sm:text-sm font-semibold text-white">
                  FILTER BY
                </span>

                <DropdownMenu
                  open={isGenreDropdownOpen}
                  onOpenChange={setIsGenreDropdownOpen}
                >
                  <DropdownMenuTrigger asChild>
                    <button
                      className="
                        flex w-full items-center justify-between gap-2
                        px-4 py-2 bg-[#1e293b] border border-gray-700 rounded-lg
                        text-white text-sm hover:bg-[#334155] transition-colors
                        sm:w-auto sm:justify-start
                      "
                    >
                      {selectedGenre}
                      <ChevronDown className="w-4 h-4" />
                    </button>
                  </DropdownMenuTrigger>

                  <DropdownMenuContent className="w-64 bg-[#0f172a] border-gray-700">
                    <div className="p-3 border-b border-gray-700">
                      <div className="flex items-center gap-2 bg-[#1e293b] rounded-md px-3 py-2">
                        <Search className="w-4 h-4 text-gray-400" />
                        <input
                          type="text"
                          placeholder="Find a Genre"
                          value={searchGenre}
                          onChange={(e) => setSearchGenre(e.target.value)}
                          className="bg-transparent text-white text-sm outline-none flex-1 placeholder-gray-500"
                        />
                      </div>
                    </div>

                    <div className="max-h-64 overflow-y-auto">
                      <DropdownMenuItem
                        onClick={() => {
                          setSelectedGenre('All Genre')
                          setIsGenreDropdownOpen(false)
                        }}
                        className="px-4 py-2 text-white hover:bg-[#1e293b] cursor-pointer"
                      >
                        Select Genre
                      </DropdownMenuItem>

                      {filteredGenres.map((genre) => (
                        <DropdownMenuItem
                          key={genre}
                          onClick={() => {
                            setSelectedGenre(genre)
                            setIsGenreDropdownOpen(false)
                            setSearchGenre('')
                          }}
                          className="px-4 py-2 text-white hover:bg-[#1e293b] cursor-pointer"
                        >
                          {genre}
                        </DropdownMenuItem>
                      ))}
                    </div>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>

              {/* SORT BY */}
              <div className="grid grid-cols-1 gap-2 sm:flex sm:items-center sm:gap-2">
                <span className="text-xs sm:text-sm font-semibold text-white">
                  SORT BY
                </span>

                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <button
                      className="
                        flex w-full items-center justify-between gap-2
                        px-4 py-2 bg-[#1e293b] border border-gray-700 rounded-lg
                        text-white text-sm hover:bg-[#334155] transition-colors
                        sm:w-auto sm:justify-start
                      "
                    >
                      {selectedSort}
                      <ChevronDown className="w-4 h-4" />
                    </button>
                  </DropdownMenuTrigger>

                  <DropdownMenuContent className="bg-[#0f172a] border-gray-700">
                    {SORT_OPTIONS.map((option) => (
                      <DropdownMenuItem
                        key={option}
                        onClick={() => setSelectedSort(option)}
                        className="px-4 py-2 text-white hover:bg-[#1e293b] cursor-pointer"
                      >
                        {option}
                      </DropdownMenuItem>
                    ))}
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </div>

            {/* Featuring Creator */}
            <div className="grid grid-cols-1 gap-2 sm:flex sm:items-center sm:gap-2">
              <span className="text-xs sm:text-sm font-semibold text-white">
                FEATURING
              </span>

              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <button
                    className="
                      flex w-full items-center justify-between gap-2
                      px-4 py-2 bg-[#1e293b] border border-gray-700 rounded-lg
                      text-white text-sm hover:bg-[#334155] transition-colors
                      sm:w-auto sm:justify-start
                    "
                  >
                    <span>{selectedCreator}</span>
                    <ChevronDown className="w-4 h-4" />
                  </button>
                </DropdownMenuTrigger>

                <DropdownMenuContent className="bg-[#0f172a] border-gray-700">
                  {CREATORS.map((creator) => (
                    <DropdownMenuItem
                      key={creator}
                      onClick={() => setSelectedCreator(creator)}
                      className="px-4 py-2 text-white hover:bg-[#1e293b] cursor-pointer"
                    >
                      {creator}
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </div>

        {/* Series Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 md:gap-6">
          {seriesData.slice(0, displayCount).map((series) => (
            <div
              key={series.id}
              className="group relative overflow-hidden rounded-2xl md:rounded-lg bg-[#1e293b] hover:shadow-lg transition-all duration-300"
            >
              {/* Image Container */}
              <div className="relative w-full aspect-[3/4] overflow-hidden bg-gray-800">
                <Image
                  src={series.image}
                  alt={series.title}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-300"
                />

                {/* Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                  <button className="w-12 h-12 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center hover:bg-white/30 transition-colors">
                    <Play className="w-6 h-6 text-white fill-white" />
                  </button>
                </div>
              </div>

              {/* Content */}
              <div className="p-3 md:p-5">
                <h3 className="text-sm md:text-base font-semibold text-white mb-2 line-clamp-2">
                  {series.title}
                </h3>
                <div className="flex items-center justify-between text-xs md:text-sm text-gray-400">
                  <span>{series.genre}</span>
                  <span className="text-yellow-400">{series.status}</span>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Load More Button */}
        {displayCount < seriesData.length && (
          <div className="flex justify-center mt-12">
            <Button
              onClick={handleLoadMore}
              variant="outline"
              className="bg-[#0f172a] border border-gray-700 text-white hover:bg-gray-900 px-8 py-2"
            >
              Load More
            </Button>
          </div>
        )}
      </div>

      <Footer />
    </div>
  )
}
