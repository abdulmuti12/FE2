'use client'

import { useEffect, useMemo, useRef, useState } from 'react'
import Image from 'next/image'
import { Play } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { Header } from '@/components/header'

interface ClipCategory {
  id: string
  name: string
  images_url: string
}

interface ClipItem {
  id: string
  name: string
  image_url: string
  cats?: string
  favorit?: string
  comment?: string
}

const STORAGE_KEY = 'user_token'
const MAX_DISPLAY_ITEMS = 15

export default function ClipListPage() {
  const router = useRouter()
  const [categories, setCategories] = useState<ClipCategory[]>([])
  const [activeCategoryId, setActiveCategoryId] = useState<string>('')
  const [activeCategoryName, setActiveCategoryName] = useState<string>('All Clips')
  const [clips, setClips] = useState<ClipItem[]>([])
  const [page, setPage] = useState(1)
  const [hasMore, setHasMore] = useState(true)
  const [loadingCategories, setLoadingCategories] = useState(true)
  const [loadingClips, setLoadingClips] = useState(true)
  const [loadingMore, setLoadingMore] = useState(false)
  const [hoveredClipId, setHoveredClipId] = useState<string | null>(null)
  const scrollContainerRef = useRef<HTMLElement | null>(null)
  const loadMoreRef = useRef<HTMLDivElement | null>(null)

  useEffect(() => {
    const fetchCategories = async (token: string) => {
      try {
        const response = await fetch('/api/categories', {
          headers: { Authorization: `Bearer ${token}` },
        })

        const data = await response.json()

        if (data.status === true && Array.isArray(data.category)) {
          const allClipsCategory: ClipCategory = {
            id: '',
            name: 'All Clips',
            images_url: '/images/icon/clippp.png',
          }

          setCategories([allClipsCategory, ...data.category])
        } else {
          setCategories([])
        }
      } catch (error) {
        console.error('[clip/list] Error fetching categories:', error)
        setCategories([])
      } finally {
        setLoadingCategories(false)
      }
    }

    const token = localStorage.getItem(STORAGE_KEY)

    if (!token) {
      setLoadingCategories(false)
      setLoadingClips(false)
      return
    }

    fetchCategories(token)
  }, [])

  useEffect(() => {
    const fetchClips = async (token: string) => {
      const isInitialPage = page === 1
      if (isInitialPage) {
        setLoadingClips(true)
      } else {
        setLoadingMore(true)
      }

      try {
        const params = new URLSearchParams({
          sort: 'latest',
          id_category: activeCategoryId,
          id_creator: '',
          page: page.toString(),
          limit: MAX_DISPLAY_ITEMS.toString(),
        })

        const response = await fetch(`/api/movies?${params.toString()}`, {
          headers: { Authorization: `Bearer ${token}` },
        })

        const data = await response.json()

        if (data?.status === true && Array.isArray(data.list)) {
          const incoming = data.list.slice(0, MAX_DISPLAY_ITEMS)

          if (isInitialPage) {
            setClips(incoming)
          } else {
            setClips((prev) => {
              const prevIds = new Set(prev.map((item) => item.id))
              const nextItems = incoming.filter((item: ClipItem) => !prevIds.has(item.id))
              return [...prev, ...nextItems]
            })
          }

          setHasMore(incoming.length === MAX_DISPLAY_ITEMS)
        } else {
          if (isInitialPage) {
            setClips([])
          }
          setHasMore(false)
        }
      } catch (error) {
        console.error('[clip/list] Error fetching clips:', error)
        if (page === 1) {
          setClips([])
        }
        setHasMore(false)
      } finally {
        if (isInitialPage) {
          setLoadingClips(false)
        } else {
          setLoadingMore(false)
        }
      }
    }

    const token = localStorage.getItem(STORAGE_KEY)

    if (!token) {
      setLoadingClips(false)
      return
    }

    fetchClips(token)
  }, [activeCategoryId, page])

  useEffect(() => {
    if (!hasMore || loadingClips || loadingMore) return

    const root = scrollContainerRef.current
    const target = loadMoreRef.current
    if (!root || !target) return

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0]?.isIntersecting) {
          setPage((prev) => prev + 1)
        }
      },
      {
        root,
        rootMargin: '200px',
        threshold: 0.1,
      }
    )

    observer.observe(target)

    return () => observer.disconnect()
  }, [hasMore, loadingClips, loadingMore])

  const hasClips = useMemo(() => clips.length > 0, [clips])
  const handleSelectCategory = (category: ClipCategory) => {
    setActiveCategoryId(category.id)
    setActiveCategoryName(category.name)
    setPage(1)
    setHasMore(true)
    setClips([])
  }

  return (
    <>
      <Header />
      <main className="h-[calc(100vh-64px)] bg-black text-white overflow-hidden">
        <div className="flex h-full">
          <aside className="hidden lg:flex lg:w-64 lg:flex-col lg:border-r lg:border-white/10 bg-black h-full overflow-y-auto [&::-webkit-scrollbar]:hidden [-ms-overflow-style:'none'] [scrollbar-width:'none']">
            <div className="p-6 space-y-4">
              {loadingCategories ? (
                <div className="text-center text-gray-500 text-sm mt-10 animate-pulse">
                  Loading categories...
                </div>
              ) : categories.length > 0 ? (
                categories.map((category) => (
                  <button
                    key={`desktop-${category.id || category.name}`}
                    onClick={() => handleSelectCategory(category)}
                    className={`w-full flex items-center gap-4 px-4 py-3 rounded-lg transition-all ${
                      activeCategoryId === category.id
                        ? 'bg-white/10 text-white border border-white/20'
                        : 'text-gray-400 hover:text-white hover:bg-white/5'
                    }`}
                  >
                    <Image
                      src={category.images_url}
                      alt={category.name}
                      width={24}
                      height={24}
                      className="w-6 h-6 flex-shrink-0 object-cover rounded-md bg-white/5"
                    />
                    <span className="text-sm font-medium text-left">{category.name}</span>
                  </button>
                ))
              ) : (
                <div className="text-center text-gray-500 text-sm mt-10">No categories found</div>
              )}
            </div>
          </aside>

          <section
            ref={scrollContainerRef}
            className="flex-1 h-full px-4 py-6 md:px-8 lg:px-10 lg:py-8 overflow-y-auto"
          >
            <div className="mb-5 lg:hidden">
              {loadingCategories ? (
                <div className="text-gray-500 text-sm animate-pulse">Loading categories...</div>
              ) : categories.length > 0 ? (
                <div className="flex gap-3 overflow-x-auto pb-1 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:'none'] [scrollbar-width:'none']">
                  {categories.map((category) => (
                    <button
                      key={`mobile-${category.id || category.name}`}
                      onClick={() => handleSelectCategory(category)}
                      className={`inline-flex w-fit items-center justify-center gap-2 px-3 py-2 rounded-full border transition-all whitespace-nowrap shrink-0 ${
                        activeCategoryId === category.id
                          ? 'bg-white/10 text-white border-white/30'
                          : 'text-gray-300 border-white/10 bg-white/5'
                      }`}
                      title={category.name}
                    >
                      <Image
                        src={category.images_url}
                        alt={category.name}
                        width={16}
                        height={16}
                        className="w-4 h-4 object-cover rounded-sm bg-white/5"
                      />
                      <span className="text-xs font-medium leading-none">{category.name}</span>
                    </button>
                  ))}
                </div>
              ) : (
                <div className="text-gray-500 text-sm">No categories found</div>
              )}
            </div>

            <div className="mb-5">
              <h1 className="text-xl md:text-2xl font-semibold">{activeCategoryName}</h1>
              <p className="text-sm text-gray-400 mt-1">Memuat 15 clip per scroll</p>
            </div>

            {loadingClips ? (
              <div className="w-full py-20 flex items-center justify-center">
                <div className="text-center">
                  <div className="w-10 h-10 border-4 border-white/20 border-t-white rounded-full animate-spin mx-auto mb-4" />
                  <p className="text-gray-400 text-sm">Loading clips...</p>
                </div>
              </div>
            ) : !hasClips ? (
              <div className="w-full py-20 flex items-center justify-center">
                <p className="text-gray-400">No {activeCategoryName} clips found</p>
              </div>
            ) : (
              <>
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 md:gap-4">
                  {clips.map((clip) => {
                    const isHovered = hoveredClipId === clip.id

                    return (
                      <article
                        key={clip.id}
                        className="relative transition-all duration-300 ease-out cursor-pointer group"
                        onMouseEnter={() => setHoveredClipId(clip.id)}
                        onMouseLeave={() => setHoveredClipId(null)}
                        onClick={() => {
                          const params = new URLSearchParams({ id: clip.id })
                          if (activeCategoryId) {
                            params.set('category', activeCategoryId)
                          }
                          router.push(`/home/clip?${params.toString()}`)
                        }}
                      >
                        <div className="relative rounded-xl overflow-hidden bg-[#0f172a] w-full aspect-[2/3]">
                          <Image
                            src={clip.image_url || '/placeholder.svg'}
                            alt={clip.name}
                            fill
                            className="object-cover transition-transform duration-500 group-hover:scale-110"
                            unoptimized
                          />

                          <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent md:hidden" />
                          <div className="absolute left-3 right-3 bottom-3 md:hidden">
                            <h3 className="text-white text-xs font-semibold line-clamp-1 mb-1">{clip.name}</h3>
                            <p className="text-[10px] text-gray-400 line-clamp-1">{clip.cats || 'Video Clip'}</p>
                          </div>

                          <div className="hidden md:block">
                            {isHovered && (
                              <>
                                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent" />
                                <div className="absolute inset-0 flex flex-col justify-end p-4">
                                  <h3 className="text-white text-sm font-semibold mb-2 line-clamp-2">{clip.name}</h3>
                                  <div className="flex items-center gap-2 mb-2">
                                    <div className="flex items-center gap-1 bg-white text-black px-3 py-1 rounded-full text-xs font-semibold">
                                      <Play className="w-3 h-3 fill-black" />
                                      Clip
                                    </div>
                                  </div>
                                  <p className="text-xs text-white/70 line-clamp-1">{clip.cats || 'Video Clip'}</p>
                                </div>
                              </>
                            )}
                          </div>
                        </div>
                      </article>
                    )
                  })}
                </div>

                <div ref={loadMoreRef} className="h-1 w-full" />

                {loadingMore && (
                  <div className="w-full py-6 flex items-center justify-center">
                    <div className="w-8 h-8 border-4 border-white/20 border-t-white rounded-full animate-spin" />
                  </div>
                )}

                {!hasMore && clips.length > 0 && (
                  <p className="text-center text-xs text-gray-500 py-6">Semua clip sudah ditampilkan</p>
                )}
              </>
            )}
          </section>
        </div>
      </main>
    </>
  )
}
