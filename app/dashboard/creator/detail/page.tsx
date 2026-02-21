'use client'

import React from "react"
import { Header } from '@/components/header'
import { Footer } from '@/components/footer'
import { ChevronRight, ChevronLeft, Settings, Video, List, MonitorPlay, Heart, ChevronDown } from 'lucide-react'

// Dummy Data untuk Chart
const chartData = [
  { day: 1, val: 40 }, { day: 2, val: 65 }, { day: 3, val: 45 }, { day: 4, val: 70 }, 
  { day: 5, val: 30 }, { day: 6, val: 55 }, { day: 7, val: 35 }, { day: 8, val: 80 },
  { day: 9, val: 50 }, { day: 10, val: 60 }, { day: 11, val: 40 }, { day: 12, val: 45 },
  { day: 13, val: 30 }, { day: 14, val: 75 }, { day: 15, val: 50 }, { day: 16, val: 60 },
  { day: 17, val: 35 }, { day: 18, val: 55 }, { day: 19, val: 40 }, { day: 20, val: 85 },
  { day: 21, val: 60 }, { day: 22, val: 70 }, { day: 23, val: 45 }, { day: 24, val: 65 },
  { day: 25, val: 80 }, { day: 26, val: 55 }, { day: 27, val: 75 }, { day: 28, val: 40 },
  { day: 29, val: 60 }, { day: 30, val: 65 }
]

// Dummy Data untuk Table
const transactionData = [
  { total: '9 USKY', status: 'In', date: 'Feb 24, 2025 1:31 pm', desc: 'Earn From Customer For Watch Video Kutukan Jimat Warisan', hash: '0xc9046c382b5f44bb...' },
  { total: '9 USKY', status: 'Out', date: 'Mar 3, 2025 4:31 pm', desc: 'Publish Fee', hash: '0xc9046c382b5f44bb...' },
  { total: '9 USKY', status: 'In', date: 'Mar 5, 2025 7:06 am', desc: 'Earn From Customer For Watch Video Kutukan Jimat Warisan', hash: '0xc9046c382b5f44bb...' },
  { total: '9 USKY', status: 'In', date: 'Feb 14, 2025 3:05 am', desc: 'Earn From Customer For Watch Video Kutukan Jimat Warisan', hash: '0xc9046c382b5f44bb...' },
  { total: '9 USKY', status: 'Out', date: 'Feb 12, 2025 11:37 am', desc: 'Publish Fee', hash: '0xc9046c382b5f44bb...' },
]

// Dummy Data untuk Clips
const clipsData = [
  { title: '[Judul Film]', genre: '[Genre]', duration: '1h 0m', img: '/images/poster1.jpg' }, 
  { title: '[Judul Film]', genre: '[Genre]', duration: '1h 0m', img: '/images/poster2.jpg' },
  { title: '[Judul Film]', genre: '[Genre]', duration: '1h 0m', img: '/images/poster3.jpg' },
  { title: '[Judul Film]', genre: '[Genre]', duration: '1h 0m', img: '/images/poster4.jpg' },
]

export default function CreatorDetailPage() {
  return (
    <div className="min-h-screen bg-[#020817] text-white font-sans">
      <Header />

      {/* Padding Container: px-4 di mobile biar lebih lega, px-8 di desktop */}
      <div className="max-w-[1400px] mx-auto px-4 md:px-8 pt-6 pb-20">
        
        {/* --- Breadcrumb & Back --- */}
        <div className="flex items-center gap-2 text-xs text-gray-400 mb-6">
          <button className="w-6 h-6 bg-[#0f172a] rounded flex items-center justify-center hover:bg-gray-800 transition-colors">
            <ChevronLeft className="w-3 h-3 text-white" />
          </button>
          <a href="/" className="hover:text-white">Home</a>
          <ChevronRight className="w-3 h-3" />
          <a href="/creators" className="hover:text-white">Creators</a>
          <ChevronRight className="w-3 h-3" />
          <span className="text-white">Creator Details</span>
        </div>

        {/* --- Header Info --- */}
        <div className="flex justify-between items-start mb-8">
          <div>
            <h1 className="text-2xl font-bold mb-1">[Nama Creator]</h1>
            <p className="text-sm text-gray-400">3 Movies</p>
          </div>
          {/* Avatar Pixel Art */}
          <div className="w-12 h-12 rounded-full bg-cyan-200 border-2 border-[#020817] overflow-hidden flex items-center justify-center">
             <div className="w-8 h-8 bg-white/30 grid grid-cols-3 gap-0.5 p-0.5">
                <div className="bg-white/60 col-span-3"></div>
                <div className="bg-white/60 row-span-2"></div>
                <div className="bg-white/60"></div>
                <div className="bg-white/60 row-span-2"></div>
                <div className="bg-white/60 col-span-3"></div>
             </div>
          </div>
        </div>

        {/* --- Chart Section --- */}
        <div className="bg-[#0b1221] rounded-xl p-6 border border-gray-800 mb-6">
          <div className="flex justify-between items-start mb-8">
            <div>
              <h3 className="text-sm font-bold text-white mb-1">Daily View Video</h3>
              <p className="text-xs text-gray-500">Dec 2025</p>
            </div>
            <button className="text-gray-500 hover:text-white transition-colors">
              <Settings className="w-5 h-5" />
            </button>
          </div>

          <div className="relative w-full h-48">
             {/* Background Grid Lines */}
             <div className="absolute inset-0 flex flex-col justify-between pointer-events-none pb-6">
                <div className="border-b border-dashed border-gray-800 w-full h-0"></div>
                <div className="border-b border-dashed border-gray-800 w-full h-0"></div>
                <div className="border-b border-dashed border-gray-800 w-full h-0"></div>
                <div className="border-b border-dashed border-gray-800 w-full h-0"></div>
             </div>

             {/* Bars Container */}
             <div className="relative h-full flex items-end justify-between gap-1 md:gap-2 z-10">
                {chartData.map((data, idx) => (
                  <div key={idx} className="flex flex-col items-center gap-2 group flex-1 h-full justify-end relative">
                    {/* Tooltip */}
                    <div className="absolute bottom-full mb-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200 bg-white text-black text-[10px] font-bold px-2 py-1 rounded whitespace-nowrap z-20 pointer-events-none shadow-lg transform translate-y-1">
                      {300 + (data.val * 2)} Views
                    </div>
                    
                    {/* Bar Biru Tebal */}
                    <div 
                      className="w-full max-w-[12px] md:max-w-[18px] bg-[#2563eb] rounded-t-[4px] hover:bg-[#3b82f6] transition-colors relative shadow-[0_0_10px_rgba(37,99,235,0.2)]"
                      style={{ height: `${data.val}%` }}
                    ></div>
                    
                    {/* X-Axis Label */}
                    <div className="h-4 flex items-center justify-center w-full">
                        <span className={`text-[9px] text-gray-500 ${idx % 5 !== 0 && (idx !== 0 && idx !== chartData.length - 1) ? 'hidden md:block' : 'block'}`}>
                           {data.day}
                        </span>
                    </div>
                  </div>
                ))}
             </div>
          </div>
        </div>

        {/* --- Stats Cards (MOBILE: 2 Kolom, WEB: 4 Kolom) --- */}
        {/* Perubahan: grid-cols-2 di mobile agar lebih rapi & compact */}
        <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4 mb-6">
          {[
            { label: 'Total View Video', val: '333', icon: <Video className="w-4 h-4 md:w-5 md:h-5" /> },
            { label: 'Total Watchlist', val: '333', icon: <List className="w-4 h-4 md:w-5 md:h-5" /> },
            { label: 'Total Watching', val: '333', icon: <MonitorPlay className="w-4 h-4 md:w-5 md:h-5" /> },
            { label: 'Total Favorit', val: '333', icon: <Heart className="w-4 h-4 md:w-5 md:h-5" /> },
          ].map((stat, idx) => (
            <div key={idx} className="bg-[#0b1221] p-4 md:p-5 rounded-xl border border-gray-800 flex flex-col justify-between h-28 md:h-32 relative overflow-hidden group hover:border-blue-900/50 transition-colors">
              <div>
                <p className="text-[10px] md:text-xs text-gray-400 mb-1 truncate">{stat.label}</p>
                <h2 className="text-xl md:text-2xl font-bold text-white">{stat.val}</h2>
              </div>
              <div className="absolute bottom-3 right-3 md:bottom-4 md:right-4 text-gray-600 group-hover:text-blue-400 transition-colors">
                {stat.icon}
              </div>
            </div>
          ))}
        </div>

        {/* --- Transaction Table --- */}
        <div className="bg-[#0b1221] rounded-xl border border-gray-800 mb-10 overflow-hidden">
          <div className="w-full overflow-x-auto">
            <table className="w-full text-left text-sm whitespace-nowrap">
              <thead>
                <tr className="text-xs text-gray-500 border-b border-gray-800 bg-[#0f172a]/50">
                  <th className="px-6 py-4 font-medium">Total</th>
                  <th className="px-6 py-4 font-medium">Status</th>
                  <th className="px-6 py-4 font-medium">Date</th>
                  <th className="px-6 py-4 font-medium">Description</th>
                  <th className="px-6 py-4 font-medium text-right">Txhash</th>
                </tr>
              </thead>
              <tbody>
                {transactionData.map((row, idx) => (
                  <tr key={idx} className="border-b border-gray-800/50 hover:bg-gray-800/20 transition-colors">
                    <td className="px-6 py-4 font-medium text-white">{row.total}</td>
                    <td className="px-6 py-4">
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded ${
                        row.status === 'In'
                      }`}>
                        {row.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-gray-400 text-xs">{row.date}</td>
                    <td className="px-6 py-4 text-gray-300 text-xs max-w-xs truncate">{row.desc}</td>
                    <td className="px-6 py-4 text-gray-500 text-xs text-right font-mono">{row.hash}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          
          {/* Table Footer */}
          <div className="px-6 py-4 flex flex-col md:flex-row justify-between items-center gap-4 text-xs text-gray-500 border-t border-gray-800">
            <span>0 of 100 row(s) selected.</span>
            <div className="flex items-center gap-6">
              <div className="flex items-center gap-2">
                <span>Rows per page</span>
                <div className="flex items-center gap-1 bg-[#0f172a] px-2 py-1 rounded border border-gray-700">
                  <span>5</span>
                  <ChevronDown className="w-3 h-3" />
                </div>
              </div>
              <div className="flex items-center gap-4">
                 <span>Page 1 of 10</span>
                 <div className="flex items-center gap-1">
                    <button className="w-6 h-6 flex items-center justify-center bg-[#0f172a] rounded border border-gray-700 hover:text-white hover:border-gray-500"><ChevronLeft className="w-3 h-3" /></button>
                    <button className="w-6 h-6 flex items-center justify-center bg-[#0f172a] rounded border border-gray-700 hover:text-white hover:border-gray-500"><ChevronRight className="w-3 h-3" /></button>
                 </div>
              </div>
            </div>
          </div>
        </div>

        {/* --- List Clips (MOBILE: 2 Kolom, WEB: 4 Kolom) --- */}
        <div className="mb-10">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-lg font-bold text-white">List Clips</h2>
            <div className="flex gap-1">
                <span className="w-8 h-0.5 bg-gray-600 rounded-full"></span>
                <span className="w-4 h-0.5 bg-gray-800 rounded-full"></span>
                <span className="w-4 h-0.5 bg-gray-800 rounded-full"></span>
            </div>
          </div>
          
          {/* Perubahan: grid-cols-2 di mobile dengan gap-4 */}
          <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
            {clipsData.map((clip, idx) => (
              <div key={idx} className="group relative bg-[#0b1221] rounded-xl overflow-hidden border border-gray-800 hover:border-gray-600 transition-all">
                {/* Image Area */}
                <div className="h-48 md:h-64 w-full bg-gray-800 relative overflow-hidden">
                   <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent opacity-90 z-10"></div>
                   
                   {/* Play Button Overlay */}
                   <div className="absolute inset-0 flex items-center justify-center z-20 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      <div className="w-10 h-10 md:w-12 md:h-12 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center hover:scale-110 transition-transform">
                         <div className="w-0 h-0 border-t-[6px] border-t-transparent border-l-[10px] border-l-white border-b-[6px] border-b-transparent ml-1 md:border-t-[8px] md:border-l-[12px] md:border-b-[8px]"></div>
                      </div>
                   </div>

                   {/* Content */}
                   <div className="absolute bottom-0 left-0 right-0 p-3 md:p-4 z-20">
                      <h3 className="font-bold text-white text-sm md:text-lg mb-1 group-hover:text-blue-400 transition-colors line-clamp-1">{clip.title}</h3>
                      <p className="hidden md:block text-[10px] text-gray-300 leading-relaxed line-clamp-2 mb-3">
                        [Brief Synopsis] Watch groundbreaking films crafted by human creativity and arti...
                      </p>
                      <div className="flex justify-between items-end text-[10px] md:text-xs text-gray-400 font-medium border-t border-gray-700/50 pt-2">
                         <span>{clip.genre}</span>
                         <span>{clip.duration}</span>
                      </div>
                   </div>
                   
                   {/* Background Image Placeholder */}
                   <img src="/images/poster-placeholder.jpg" alt="Poster" className="w-full h-full object-cover opacity-60 group-hover:scale-105 transition-transform duration-500" />
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>

      <Footer />
    </div>
  )
}