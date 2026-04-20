// 'use client'

// import React, { useEffect, useMemo, useState } from 'react'
// import { useParams, useRouter } from 'next/navigation'
// import { Header } from '@/components/header'
// import { Footer } from '@/components/footer'
// import {
//   ChevronRight,
//   ChevronLeft,
//   Settings,
//   Video,
//   List,
//   MonitorPlay,
//   Heart,
//   ChevronDown,
//   X,
// } from 'lucide-react'

// type ChartItem = {
//   day: number
//   val: number
// }

// type TransactionItem = {
//   total: string
//   status: string
//   date: string
//   desc: string
//   hash: string
// }

// type ClipItem = {
//   id: string | number
//   title: string
//   genre: string
//   duration: string
//   img: string
//   description?: string
// }

// type CreatorStats = {
//   views: string
//   watchlist: string
//   watching: string
//   likes: string
// }

// type CreatorDetail = {
//   name: string
//   moviesCount: number
//   avatar: string
//   chartData: ChartItem[]
//   transactions: TransactionItem[]
//   clips: ClipItem[]
//   stats: CreatorStats
// }

// const fallbackChartData: ChartItem[] = [
//   { day: 1, val: 40 },
//   { day: 2, val: 65 },
//   { day: 3, val: 45 },
//   { day: 4, val: 70 },
//   { day: 5, val: 30 },
//   { day: 6, val: 55 },
//   { day: 7, val: 35 },
//   { day: 8, val: 80 },
//   { day: 9, val: 50 },
//   { day: 10, val: 60 },
//   { day: 11, val: 40 },
//   { day: 12, val: 45 },
//   { day: 13, val: 30 },
//   { day: 14, val: 75 },
//   { day: 15, val: 50 },
//   { day: 16, val: 60 },
//   { day: 17, val: 35 },
//   { day: 18, val: 55 },
//   { day: 19, val: 40 },
//   { day: 20, val: 85 },
//   { day: 21, val: 60 },
//   { day: 22, val: 70 },
//   { day: 23, val: 45 },
//   { day: 24, val: 65 },
//   { day: 25, val: 80 },
//   { day: 26, val: 55 },
//   { day: 27, val: 75 },
//   { day: 28, val: 40 },
//   { day: 29, val: 60 },
//   { day: 30, val: 65 },
// ]

// const fallbackTransactions: TransactionItem[] = [
//   {
//     total: '9 USKY',
//     status: 'In',
//     date: 'Feb 24, 2025 1:31 pm',
//     desc: 'Earn From Customer For Watch Video Kutukan Jimat Warisan',
//     hash: '0xc9046c382b5f44bb...',
//   },
//   {
//     total: '9 USKY',
//     status: 'Out',
//     date: 'Mar 3, 2025 4:31 pm',
//     desc: 'Publish Fee',
//     hash: '0xc9046c382b5f44bb...',
//   },
//   {
//     total: '9 USKY',
//     status: 'In',
//     date: 'Mar 5, 2025 7:06 am',
//     desc: 'Earn From Customer For Watch Video Kutukan Jimat Warisan',
//     hash: '0xc9046c382b5f44bb...',
//   },
//   {
//     total: '9 USKY',
//     status: 'In',
//     date: 'Feb 14, 2025 3:05 am',
//     desc: 'Earn From Customer For Watch Video Kutukan Jimat Warisan',
//     hash: '0xc9046c382b5f44bb...',
//   },
//   {
//     total: '9 USKY',
//     status: 'Out',
//     date: 'Feb 12, 2025 11:37 am',
//     desc: 'Publish Fee',
//     hash: '0xc9046c382b5f44bb...',
//   },
// ]

// const fallbackClips: ClipItem[] = [
//   {
//     id: 1,
//     title: '[Judul Film]',
//     genre: '[Genre]',
//     duration: '1h 0m',
//     img: '/images/poster1.jpg',
//     description:
//       'Watch groundbreaking films crafted by human creativity and artificial intelligence.',
//   },
//   {
//     id: 2,
//     title: '[Judul Film]',
//     genre: '[Genre]',
//     duration: '1h 0m',
//     img: '/images/poster2.jpg',
//     description:
//       'Watch groundbreaking films crafted by human creativity and artificial intelligence.',
//   },
//   {
//     id: 3,
//     title: '[Judul Film]',
//     genre: '[Genre]',
//     duration: '1h 0m',
//     img: '/images/poster3.jpg',
//     description:
//       'Watch groundbreaking films crafted by human creativity and artificial intelligence.',
//   },
//   {
//     id: 4,
//     title: '[Judul Film]',
//     genre: '[Genre]',
//     duration: '1h 0m',
//     img: '/images/poster4.jpg',
//     description:
//       'Watch groundbreaking films crafted by human creativity and artificial intelligence.',
//   },
// ]

// function isObject(value: unknown): value is Record<string, any> {
//   return typeof value === 'object' && value !== null && !Array.isArray(value)
// }

// function toStringSafe(value: unknown, fallback = '0') {
//   if (value === null || value === undefined || value === '') return fallback
//   return String(value)
// }

// function toNumberSafe(value: unknown, fallback = 0) {
//   const num = Number(value)
//   return Number.isFinite(num) ? num : fallback
// }

// function stripHtml(text: string) {
//   return text.replace(/<[^>]*>/g, '').trim()
// }

// function findNestedCreatorPayload(input: any): Record<string, any> | null {
//   if (!input) return null

//   if (Array.isArray(input)) {
//     for (const item of input) {
//       const found = findNestedCreatorPayload(item)
//       if (found) return found
//     }
//     return null
//   }

//   if (isObject(input)) {
//     const hasCreatorShape =
//       'name' in input ||
//       'avatar_url' in input ||
//       'views' in input ||
//       'watch' in input ||
//       'watched' in input ||
//       'likes' in input ||
//       'info' in input

//     if (hasCreatorShape) return input

//     for (const key of Object.keys(input)) {
//       const found = findNestedCreatorPayload(input[key])
//       if (found) return found
//     }
//   }

//   return null
// }

// function normalizeClips(raw: any): ClipItem[] {
//   const list =
//     raw?.info?.top_items ||
//     raw?.top_items ||
//     raw?.clips ||
//     raw?.movies ||
//     raw?.items ||
//     []

//   if (!Array.isArray(list)) return fallbackClips

//   const normalized = list.map((item: any, index: number) => {
//     const imageName = item?.image_landscape || item?.image || ''
//     const imageUrl = imageName
//       ? imageName.startsWith('http')
//         ? imageName
//         : `http://usky.ai/uploads/${imageName}`
//       : '/images/poster-placeholder.jpg'

//     return {
//       id: item?.id ?? index + 1,
//       title: toStringSafe(item?.name || item?.title, '[Judul Film]'),
//       genre: toStringSafe(item?.cats || item?.genre, '[Genre]'),
//       duration: toStringSafe(item?.run_time_format || item?.duration, '1h 0m'),
//       img: imageUrl,
//       description: item?.description
//         ? stripHtml(String(item.description))
//         : 'Watch groundbreaking films crafted by human creativity and artificial intelligence.',
//     }
//   })

//   return normalized.length > 0 ? normalized : fallbackClips
// }

// function normalizeStats(raw: any): CreatorStats {
//   return {
//     views: toStringSafe(raw?.views?.total ?? raw?.views_total ?? raw?.total_views, '0'),
//     watchlist: toStringSafe(
//       raw?.watch?.total ?? raw?.watchlist?.total ?? raw?.watch_total,
//       '0'
//     ),
//     watching: toStringSafe(
//       raw?.watched?.total ?? raw?.watching?.total ?? raw?.watched_total,
//       '0'
//     ),
//     likes: toStringSafe(raw?.likes?.total ?? raw?.likes_total ?? raw?.total_likes, '0'),
//   }
// }

// function normalizeCreatorData(raw: any): CreatorDetail {
//   const clips = normalizeClips(raw)

//   return {
//     name: toStringSafe(raw?.name, '[Nama Creator]'),
//     moviesCount: Array.isArray(clips) ? clips.length : 0,
//     avatar:
//       raw?.avatar_url && raw.avatar_url !== 'http://usky.ai/uploads/'
//         ? raw.avatar_url
//         : '',
//     chartData: fallbackChartData,
//     transactions: fallbackTransactions,
//     clips,
//     stats: normalizeStats(raw),
//   }
// }

// export default function CreatorDetailPage() {
//   const params = useParams()
//   const router = useRouter()

//   const creatorId = useMemo(() => {
//     const rawId = params?.id
//     if (Array.isArray(rawId)) return rawId[0] || ''
//     return typeof rawId === 'string' ? rawId : ''
//   }, [params])

//   const [data, setData] = useState<CreatorDetail | null>(null)
//   const [loading, setLoading] = useState(true)
//   const [errorMessage, setErrorMessage] = useState('')

//   useEffect(() => {
//     if (!creatorId) {
//       setLoading(false)
//       setErrorMessage('Creator ID tidak valid.')
//       return
//     }

//     const controller = new AbortController()

//     const fetchDetail = async () => {
//       try {
//         setLoading(true)
//         setErrorMessage('')

//         const token =
//           typeof window !== 'undefined'
//             ? localStorage.getItem('user_token')
//             : null

//         if (!token) {
//           router.push('/')
//           return
//         }

//         const response = await fetch('/api/creator-detail', {
//           method: 'POST',
//           headers: {
//             Authorization: `Bearer ${token}`,
//             'Content-Type': 'application/json',
//           },
//           body: JSON.stringify({ id: creatorId }),
//           signal: controller.signal,
//           cache: 'no-store',
//         })

//         if (!response.ok) {
//           throw new Error(`HTTP ${response.status}`)
//         }

//         const result = await response.json()
//         console.log('creator-detail raw:', result)

//         const rawCreator = findNestedCreatorPayload(result)

//         if (!rawCreator) {
//           throw new Error('Payload creator tidak ditemukan')
//         }

//         const normalized = normalizeCreatorData(rawCreator)
//         setData(normalized)
//       } catch (error: any) {
//         if (error?.name === 'AbortError') return

//         console.error('fetch creator detail error:', error)
//         setErrorMessage('Gagal memuat detail creator.')
//         setData(null)
//       } finally {
//         if (!controller.signal.aborted) {
//           setLoading(false)
//         }
//       }
//     }

//     fetchDetail()

//     return () => {
//       controller.abort()
//     }
//   }, [creatorId, router])

//   if (loading) {
//     return (
//       <div className="min-h-screen bg-[#020817] text-white flex items-center justify-center">
//         <div className="w-10 h-10 border-4 border-blue-500 border-t-transparent rounded-full animate-spin" />
//       </div>
//     )
//   }

//   if (errorMessage || !data) {
//     return (
//       <div className="min-h-screen bg-[#020817] text-white">
//         <Header />
//         <div className="max-w-[1400px] mx-auto px-4 md:px-8 pt-10 pb-20">
//           <div className="bg-[#0b1221] border border-gray-800 rounded-xl p-6">
//             <h2 className="text-xl font-bold mb-2">Detail creator tidak tersedia</h2>
//             <p className="text-sm text-gray-400 mb-6">
//               {errorMessage || 'Data tidak ditemukan.'}
//             </p>
//             <button
//               onClick={() => router.back()}
//               className="px-4 py-2 bg-blue-600 rounded hover:bg-blue-700 transition-colors"
//             >
//               Kembali
//             </button>
//           </div>
//         </div>
//         <Footer />
//       </div>
//     )
//   }

//   const maxBarValue = Math.max(...data.chartData.map((item) => item.val), 1)

//   return (
//     <div className="min-h-screen bg-[#020817] text-white font-sans">
//       <Header />

//       <div className="max-w-[1400px] mx-auto px-4 md:px-8 pt-6 pb-20">
//         <div className="flex items-center gap-2 text-xs text-gray-400 mb-6">
//           <button
//             onClick={() => router.back()}
//             className="w-6 h-6 bg-[#0f172a] rounded flex items-center justify-center hover:bg-gray-800 transition-colors"
//           >
//             <ChevronLeft className="w-3 h-3 text-white" />
//           </button>
//           <button onClick={() => router.push('/')} className="hover:text-white">
//             Home
//           </button>
//           <ChevronRight className="w-3 h-3" />
//           <button
//             onClick={() => router.push('/creators')}
//             className="hover:text-white"
//           >
//             Creators
//           </button>
//           <ChevronRight className="w-3 h-3" />
//           <span className="text-white">Creator Details</span>
//         </div>

//         <div className="flex justify-between items-start mb-8">
//           <div>
//             <h1 className="text-2xl font-bold mb-1">{data.name}</h1>
//             <p className="text-sm text-gray-400">{data.moviesCount} Movies</p>
//           </div>

//           <div className="w-12 h-12 rounded-full bg-cyan-200 border-2 border-[#020817] overflow-hidden flex items-center justify-center">
//             {data.avatar ? (
//               <img
//                 src={data.avatar}
//                 alt={data.name}
//                 className="w-full h-full object-cover"
//               />
//             ) : (
//               <div className="w-8 h-8 bg-white/30 grid grid-cols-3 gap-0.5 p-0.5">
//                 <div className="bg-white/60 col-span-3" />
//                 <div className="bg-white/60 row-span-2" />
//                 <div className="bg-white/60" />
//                 <div className="bg-white/60 row-span-2" />
//                 <div className="bg-white/60 col-span-3" />
//               </div>
//             )}
//           </div>
//         </div>

//         <div className="bg-[#0b1221] rounded-xl p-6 border border-gray-800 mb-6">
//           <div className="flex justify-between items-start mb-8">
//             <div>
//               <h3 className="text-sm font-bold text-white mb-1">Daily View Video</h3>
//               <p className="text-xs text-gray-500">Dec 2025</p>
//             </div>
//             <button className="text-gray-500 hover:text-white transition-colors">
//               <Settings className="w-5 h-5" />
//             </button>
//           </div>

//           <div className="relative w-full h-48">
//             <div className="absolute inset-0 flex flex-col justify-between pointer-events-none pb-6">
//               <div className="border-b border-dashed border-gray-800 w-full h-0" />
//               <div className="border-b border-dashed border-gray-800 w-full h-0" />
//               <div className="border-b border-dashed border-gray-800 w-full h-0" />
//               <div className="border-b border-dashed border-gray-800 w-full h-0" />
//             </div>

//             <div className="relative h-full flex items-end justify-between gap-1 md:gap-2 z-10">
//               {data.chartData.map((item, idx) => {
//                 const barHeight = Math.max((item.val / maxBarValue) * 100, 4)

//                 return (
//                   <div
//                     key={`${item.day}-${idx}`}
//                     className="flex flex-col items-center gap-2 group flex-1 h-full justify-end relative"
//                   >
//                     <div className="absolute bottom-full mb-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200 bg-white text-black text-[10px] font-bold px-2 py-1 rounded whitespace-nowrap z-20 pointer-events-none shadow-lg transform translate-y-1">
//                       {item.val} Views
//                     </div>

//                     <div
//                       className="w-full max-w-[12px] md:max-w-[18px] bg-[#2563eb] rounded-t-[4px] hover:bg-[#3b82f6] transition-colors relative shadow-[0_0_10px_rgba(37,99,235,0.2)]"
//                       style={{ height: `${barHeight}%` }}
//                     />

//                     <div className="h-4 flex items-center justify-center w-full">
//                       <span
//                         className={`text-[9px] text-gray-500 ${
//                           idx % 5 !== 0 &&
//                           idx !== 0 &&
//                           idx !== data.chartData.length - 1
//                             ? 'hidden md:block'
//                             : 'block'
//                         }`}
//                       >
//                         {item.day}
//                       </span>
//                     </div>
//                   </div>
//                 )
//               })}
//             </div>
//           </div>
//         </div>

//         <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4 mb-6">
//           {[
//             {
//               label: 'Total View Video',
//               val: data.stats.views,
//               icon: <Video className="w-4 h-4 md:w-5 md:h-5" />,
//             },
//             {
//               label: 'Total Watchlist',
//               val: data.stats.watchlist,
//               icon: <List className="w-4 h-4 md:w-5 md:h-5" />,
//             },
//             {
//               label: 'Total Watching',
//               val: data.stats.watching,
//               icon: <MonitorPlay className="w-4 h-4 md:w-5 md:h-5" />,
//             },
//             {
//               label: 'Total Favorit',
//               val: data.stats.likes,
//               icon: <Heart className="w-4 h-4 md:w-5 md:h-5" />,
//             },
//           ].map((stat, idx) => (
//             <div
//               key={idx}
//               className="bg-[#0b1221] p-4 md:p-5 rounded-xl border border-gray-800 flex flex-col justify-between h-28 md:h-32 relative overflow-hidden group hover:border-blue-900/50 transition-colors"
//             >
//               <div>
//                 <p className="text-[10px] md:text-xs text-gray-400 mb-1 truncate">
//                   {stat.label}
//                 </p>
//                 <h2 className="text-xl md:text-2xl font-bold text-white">
//                   {stat.val}
//                 </h2>
//               </div>
//               <div className="absolute bottom-3 right-3 md:bottom-4 md:right-4 text-gray-600 group-hover:text-blue-400 transition-colors">
//                 {stat.icon}
//               </div>
//             </div>
//           ))}
//         </div>

//         <div className="bg-[#0b1221] rounded-xl border border-gray-800 mb-10 overflow-hidden">
//           <div className="w-full overflow-x-auto">
//             <table className="w-full text-left text-sm whitespace-nowrap">
//               <thead>
//                 <tr className="text-xs text-gray-500 border-b border-gray-800 bg-[#0f172a]/50">
//                   <th className="px-6 py-4 font-medium">Total</th>
//                   <th className="px-6 py-4 font-medium">Status</th>
//                   <th className="px-6 py-4 font-medium">Date</th>
//                   <th className="px-6 py-4 font-medium">Description</th>
//                   <th className="px-6 py-4 font-medium text-right">Txhash</th>
//                 </tr>
//               </thead>
//               <tbody>
//                 {data.transactions.map((row, idx) => (
//                   <tr
//                     key={idx}
//                     className="border-b border-gray-800/50 hover:bg-gray-800/20 transition-colors"
//                   >
//                     <td className="px-6 py-4 font-medium text-white">{row.total}</td>
//                     <td className="px-6 py-4">
//                       <span
//                         className={`text-[10px] font-bold px-2 py-0.5 rounded ${
//                           row.status === 'In'
//                             ? 'text-green-400 bg-green-400/10'
//                             : 'text-red-400 bg-red-400/10'
//                         }`}
//                       >
//                         {row.status}
//                       </span>
//                     </td>
//                     <td className="px-6 py-4 text-gray-400 text-xs">{row.date}</td>
//                     <td className="px-6 py-4 text-gray-300 text-xs max-w-xs truncate">
//                       {row.desc}
//                     </td>
//                     <td className="px-6 py-4 text-gray-500 text-xs text-right font-mono">
//                       {row.hash}
//                     </td>
//                   </tr>
//                 ))}
//               </tbody>
//             </table>
//           </div>

//           <div className="px-6 py-4 flex flex-col md:flex-row justify-between items-center gap-4 text-xs text-gray-500 border-t border-gray-800">
//             <span>0 of 100 row(s) selected.</span>
//             <div className="flex items-center gap-6">
//               <div className="flex items-center gap-2">
//                 <span>Rows per page</span>
//                 <div className="flex items-center gap-1 bg-[#0f172a] px-2 py-1 rounded border border-gray-700">
//                   <span>5</span>
//                   <ChevronDown className="w-3 h-3" />
//                 </div>
//               </div>
//               <div className="flex items-center gap-4">
//                 <span>Page 1 of 10</span>
//                 <div className="flex items-center gap-1">
//                   <button className="w-6 h-6 flex items-center justify-center bg-[#0f172a] rounded border border-gray-700 hover:text-white hover:border-gray-500">
//                     <ChevronLeft className="w-3 h-3" />
//                   </button>
//                   <button className="w-6 h-6 flex items-center justify-center bg-[#0f172a] rounded border border-gray-700 hover:text-white hover:border-gray-500">
//                     <ChevronRight className="w-3 h-3" />
//                   </button>
//                 </div>
//               </div>
//             </div>
//           </div>
//         </div>

//         <div className="mb-10">
//           <div className="flex justify-between items-center mb-6">
//             <h2 className="text-lg font-bold text-white">List Clips</h2>
//             <div className="flex gap-1">
//               <span className="w-8 h-0.5 bg-gray-600 rounded-full" />
//               <span className="w-4 h-0.5 bg-gray-800 rounded-full" />
//               <span className="w-4 h-0.5 bg-gray-800 rounded-full" />
//             </div>
//           </div>

//           <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
//             {data.clips.map((clip) => (
//               <div
//                 key={clip.id}
//                 className="group relative bg-[#0b1221] rounded-xl overflow-hidden border border-gray-800 hover:border-gray-600 transition-all"
//               >
//                 <div className="h-48 md:h-64 w-full bg-gray-800 relative overflow-hidden">
//                   <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent opacity-90 z-10" />

//                   <div className="absolute inset-0 flex items-center justify-center z-20 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
//                     <div className="w-10 h-10 md:w-12 md:h-12 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center hover:scale-110 transition-transform">
//                       <div className="w-0 h-0 border-t-[6px] border-t-transparent border-l-[10px] border-l-white border-b-[6px] border-b-transparent ml-1 md:border-t-[8px] md:border-l-[12px] md:border-b-[8px]" />
//                     </div>
//                   </div>

//                   <div className="absolute bottom-0 left-0 right-0 p-3 md:p-4 z-20">
//                     <h3 className="font-bold text-white text-sm md:text-lg mb-1 group-hover:text-blue-400 transition-colors line-clamp-1">
//                       {clip.title}
//                     </h3>
//                     <p className="hidden md:block text-[10px] text-gray-300 leading-relaxed line-clamp-2 mb-3">
//                       {clip.description}
//                     </p>
//                     <div className="flex justify-between items-end text-[10px] md:text-xs text-gray-400 font-medium border-t border-gray-700/50 pt-2">
//                       <span>{clip.genre}</span>
//                       <span>{clip.duration}</span>
//                     </div>
//                   </div>

//                   <img
//                     src={clip.img || '/images/poster-placeholder.jpg'}
//                     alt={clip.title}
//                     onError={(e) => {
//                       e.currentTarget.src = '/images/poster-placeholder.jpg'
//                     }}
//                     className="w-full h-full object-cover opacity-60 group-hover:scale-105 transition-transform duration-500"
//                   />
//                 </div>
//               </div>
//             ))}
//           </div>
//         </div>
//       </div>

//       <Footer />
//     </div>
//   )
// }