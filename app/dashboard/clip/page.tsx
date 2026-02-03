'use client'

import Image from 'next/image'
import { useState } from 'react'
import { Heart, Plus, Share2, Play, ChevronDown } from 'lucide-react'
import { Header } from '@/components/header'
import { Footer } from '@/components/footer'

const clipCategories = [
  'All Clips',
  'Action',
  'Adventure',
  'Horror',
  'History',
  'Comedy',
  'Mystery',
  'Video Clip',
  'Kids',
  'Story',
  'Religi',
  'Fantasy',
]

const sidebarCategories = [
  { icon: '/images/icon/clippp.png', label: 'All Clips' },
  { icon: '/images/icon/action4.png', label: 'Action' },
  { icon: '/images/icon/adventure.png', label: 'Adventure' },
  { icon: '/images/icon/horror.png', label: 'Horror' },
  { icon: '/images/icon/history.png', label: 'History' },
  { icon: '/images/icon/comedy.png', label: 'Comedy' },
  { icon: '/images/icon/mystery.png', label: 'Mystery' },
  { icon: '/images/icon/clipp.png', label: 'Video Clip' },
  { icon: '/images/icon/child.png', label: 'Kids' },
  { icon: '/images/icon/story.png', label: 'Story' },
  { icon: '/images/icon/religi.png', label: 'Religi' },
  { icon: '/images/icon/fantasy.png', label: 'Fantasy' },
]

const mockClips = [
  {
    id: 1,
    title: '[Judul Clips]',
    image: '/login-hero.jpg',
    description: '[Brief Synopsis] Watch groundbreaking films crafted by human creativity and artificial intelligence.',
    creator: '[Creator]',
    creatorAvatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Creator1',
    genre: '[Genre]',
    likes: 12,
  },
  {
    id: 2,
    title: '[Judul Clips]',
    image: '/login-hero.jpg',
    description: '[Brief Synopsis] Watch groundbreaking films crafted by human creativity and artificial intelligence.',
    creator: '[Creator]',
    creatorAvatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Creator2',
    genre: '[Genre]',
    likes: 8,
  },
]

export default function ClipsPage() {
  const [activeCategory, setActiveCategory] = useState('All Clips')
  const [selectedClip, setSelectedClip] = useState(mockClips[0])
  const [likes, setLikes] = useState(selectedClip.likes)
  const [isLiked, setIsLiked] = useState(false)

  const handleLike = () => {
    setIsLiked(!isLiked)
    setLikes(isLiked ? likes - 1 : likes + 1)
  }

  return (
    <div className="min-h-screen bg-background text-foreground dark flex flex-col">
      <Header />

      <div className="flex-1 flex flex-col lg:flex-row">
        {/* Desktop Sidebar */}
        <aside className="hidden lg:block w-60 bg-[#020817] border-r border-white/5 px-6 py-8">
          <div className="space-y-2">
            {sidebarCategories.map((item) => (
              <button
                key={item.label}
                onClick={() => setActiveCategory(item.label)}
                className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg transition-colors ${
                  activeCategory === item.label
                    ? 'bg-white/10 text-white'
                    : 'text-white/70 hover:text-white'
                }`}
              >
                <Image src={item.icon || "/placeholder.svg"} alt={item.label} width={16} height={16} className="w-4 h-4" />
                <span className="text-sm font-medium">{item.label}</span>
              </button>
            ))}
          </div>
        </aside>

        {/* Mobile Category Tabs */}
        <div className="lg:hidden w-full bg-[#020817] border-b border-white/5 overflow-x-auto">
          <div className="flex gap-2 px-4 py-4 min-w-min">
            {clipCategories.map((category) => (
              <button
                key={category}
                onClick={() => setActiveCategory(category)}
                className={`whitespace-nowrap px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                  activeCategory === category
                    ? 'bg-yellow-400 text-black'
                    : 'bg-[#1a1a2e] text-white/70 hover:text-white'
                }`}
              >
                {category}
              </button>
            ))}
          </div>
        </div>

        {/* Main Content */}
        <main className="flex-1 px-4 md:px-8 lg:px-12 py-8 lg:py-12">
          <div className="max-w-6xl mx-auto">
            {/* Desktop Layout */}
            <div className="hidden lg:grid grid-cols-3 gap-8">
              {/* Left Section - Clip Info */}
              <div className="col-span-1">
                <div className="space-y-6">
                  {/* Creator Info */}
                  <div className="flex items-center gap-3">
                    <Image
                      src={selectedClip.creatorAvatar || "/placeholder.svg"}
                      alt={selectedClip.creator}
                      width={48}
                      height={48}
                      className="w-12 h-12 rounded-full"
                    />
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-white font-semibold">{selectedClip.creator}</span>
                        <span className="text-gray-400">⭐</span>
                      </div>
                    </div>
                  </div>

                  {/* Title and Description */}
                  <div>
                    <h2 className="text-white text-xl font-bold mb-3">{selectedClip.title}</h2>
                    <p className="text-gray-400 text-sm leading-relaxed">{selectedClip.description}</p>
                  </div>

                  {/* Genre Badge */}
                  <div>
                    <span className="inline-block bg-white/10 text-white text-xs font-medium px-3 py-1.5 rounded-full border border-white/20">
                      {selectedClip.genre}
                    </span>
                  </div>
                </div>
              </div>

              {/* Center Section - Clip Image */}
              <div className="col-span-1 flex items-center justify-center">
                <div className="relative group w-full aspect-[9/16] rounded-lg overflow-hidden">
                  <Image
                    src={selectedClip.image || "/placeholder.svg"}
                    alt={selectedClip.title}
                    fill
                    className="object-cover"
                  />
                  <div className="absolute inset-0 bg-black/30 group-hover:bg-black/40 transition-colors flex items-center justify-center">
                    <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center group-hover:bg-white/30 transition-colors backdrop-blur-md">
                      <Play className="w-8 h-8 text-white fill-white" />
                    </div>
                  </div>
                </div>
              </div>

              {/* Right Section - Actions */}
              <div className="col-span-1 flex flex-col items-end justify-center gap-6">
                {/* User Avatar */}
            

                {/* Like Button */}
                <div className="flex flex-col items-center gap-2">
                  <button
                    onClick={handleLike}
                    className={`w-12 h-12 rounded-full flex items-center justify-center transition-colors ${
                      isLiked
                        ? 'bg-red-500 text-white'
                        : 'bg-white/10 text-white hover:bg-white/20'
                    }`}
                  >
                    <Heart className={`w-6 h-6 ${isLiked ? 'fill-current' : ''}`} />
                  </button>
                  <span className="text-white/70 text-sm font-medium">{likes}</span>
                </div>

                {/* Add Button */}
                <div className="flex flex-col items-center gap-2">
                  <button className="w-12 h-12 rounded-full bg-white/10 text-white hover:bg-white/20 flex items-center justify-center transition-colors">
                    <Plus className="w-6 h-6" />
                  </button>
                  <span className="text-white/70 text-sm font-medium">12</span>
                </div>

                {/* Share Button */}
                <div className="flex flex-col items-center gap-2">
                  <button className="w-12 h-12 rounded-full bg-white/10 text-white hover:bg-white/20 flex items-center justify-center transition-colors">
                    <Share2 className="w-6 h-6" />
                  </button>
                  <span className="text-white text-sm font-medium">Share</span>
                </div>
              </div>
            </div>

            {/* Mobile Layout */}
            <div className="lg:hidden space-y-6">
              {mockClips.map((clip) => (
                <div key={clip.id} className="bg-[#1a1a2e] rounded-lg overflow-hidden border border-white/5">
                  {/* Clip Image */}
                  <div className="relative aspect-[9/16] overflow-hidden bg-black">
                    <Image
                      src={clip.image || "/placeholder.svg"}
                      alt={clip.title}
                      fill
                      className="object-cover"
                    />
                    <div className="absolute inset-0 bg-black/30 flex items-center justify-center">
                      <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center backdrop-blur-md">
                        <Play className="w-8 h-8 text-white fill-white" />
                      </div>
                    </div>
                  </div>

                  {/* Clip Info */}
                  <div className="p-4 space-y-4">
                    {/* Creator Info */}
                    <div className="flex items-center gap-3">
                      <Image
                        src={clip.creatorAvatar || "/placeholder.svg"}
                        alt={clip.creator}
                        width={40}
                        height={40}
                        className="w-10 h-10 rounded-full"
                      />
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="text-white font-semibold text-sm">{clip.creator}</span>
                          <span>⭐</span>
                        </div>
                      </div>
                    </div>

                    {/* Title and Description */}
                    <div>
                      <h3 className="text-white font-bold mb-2">{clip.title}</h3>
                      <p className="text-gray-400 text-xs leading-relaxed">{clip.description}</p>
                    </div>

                    {/* Genre Badge */}
                    <div>
                      <span className="inline-block bg-white/10 text-white text-xs font-medium px-3 py-1 rounded-full border border-white/20">
                        {clip.genre}
                      </span>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex gap-3 pt-4 border-t border-white/5">
                      <button className="flex-1 flex items-center justify-center gap-2 py-2 bg-white/5 hover:bg-white/10 rounded-lg transition-colors">
                        <Heart className="w-5 h-5 text-white" />
                        <span className="text-white text-sm">{clip.likes}</span>
                      </button>
                      <button className="flex-1 flex items-center justify-center gap-2 py-2 bg-white/5 hover:bg-white/10 rounded-lg transition-colors">
                        <Plus className="w-5 h-5 text-white" />
                      </button>
                      <button className="flex-1 flex items-center justify-center gap-2 py-2 bg-white/5 hover:bg-white/10 rounded-lg transition-colors">
                        <Share2 className="w-5 h-5 text-white" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </main>
      </div>

      <Footer />
    </div>
  )
}
