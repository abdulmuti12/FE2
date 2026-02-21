'use client'

import { Header } from '@/components/header'
import { Footer } from '@/components/footer'
import { ChevronRight, Copy, ChevronLeft, ChevronDown } from 'lucide-react'
import { useState } from 'react'
import Image from 'next/image'
import { Button } from '@/components/ui/button'

export default function ReferralPage() {
  const [currentPage, setCurrentPage] = useState(1)
  const [rowsPerPage, setRowsPerPage] = useState(5)
  const [copied, setCopied] = useState(false)

  // Mock referral data
  const referralData = Array.from({ length: 47 }, (_, i) => ({
    id: i + 1,
    referral: `ASFA${String(i + 23).padStart(2, '0')}`,
    reward: '5 USKY',
    date: new Date(2025, Math.floor(Math.random() * 3), Math.floor(Math.random() * 28) + 1).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: '2-digit', hour: '2-digit', minute: '2-digit' })
  }))

  const totalPages = Math.ceil(referralData.length / rowsPerPage)
  const startIndex = (currentPage - 1) * rowsPerPage
  const displayedData = referralData.slice(startIndex, startIndex + rowsPerPage)

  const handleCopyLink = () => {
    navigator.clipboard.writeText('[Link Referral Creator]')
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div className="min-h-screen bg-background text-foreground dark">
      <Header />

      {/* Hero Section */}
      <div 
        className="relative w-full h-64 md:h-96 overflow-hidden bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage: 'url(/images/privacy-header.jpg)'
        }}
      >
        <div className="absolute inset-0 bg-blue-950/60"></div>
        <div className="relative h-full flex flex-col justify-center items-center px-4 md:px-12 text-center">
          <h1 className="text-5xl md:text-6xl font-bold text-white mb-6">My Referral</h1>
          <div className="flex items-center justify-center gap-2 text-sm md:text-base">
            <a href="/dashboard" className="text-gray-300 hover:text-white transition-colors">Home</a>
            <ChevronRight className="w-4 h-4 text-gray-300" />
            <span className="text-white">My Referral</span>
          </div>
        </div>
      </div>

      {/* Main Content */}
       <div className="max-w-7xl mx-auto px-4 md:px-6 lg:px-8 py-12 md:py-16">
        
        {/* Profile Section */}
        <div className="mb-12">
          <div className="flex flex-col md:flex-row gap-6 md:gap-8 items-start md:items-center mb-8">
            {/* Avatar */}
            <div className="w-32 h-32 md:w-40 md:h-40 flex-shrink-0 rounded-lg overflow-hidden flex items-center justify-center">
              <div className="w-full h-full relative">
                <Image 
                  src="/images/pngs.png" 
                  alt="Creator Avatar" 
                  fill 
                  className="object-cover"
                />
              </div>
            </div>

            {/* Creator Info */}
            <div className="flex-1">
              <h2 className="text-2xl md:text-3xl font-bold text-white mb-1">[Nama Creator]</h2>
              <p className="text-gray-400 mb-6">[E-Mail Creator]</p>

              {/* Info Cards */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* My Reward Card */}
                <div className="bg-gradient-to-br from-gray-800 to-gray-900 border border-gray-700 rounded-lg p-4 md:p-6">
                  <p className="text-gray-400 text-sm mb-2">My Reward</p>
                  <p className="text-2xl md:text-3xl font-bold text-white">200 USKY</p>
                </div>

                {/* Label Card */}
                <div className="bg-gradient-to-br from-gray-800 to-gray-900 border border-gray-700 rounded-lg p-4 md:p-6">
                  <label className="block text-gray-400 text-sm mb-2">Label</label>
                  <div className="flex gap-2">
                    <input 
                      type="text" 
                      value="[Link Referral Creator]" 
                      readOnly
                      className="flex-1 bg-gray-900 border border-gray-600 rounded px-3 py-2 text-gray-300 text-sm focus:outline-none focus:border-cyan-500"
                    />
                    <button 
                      onClick={handleCopyLink}
                      className="bg-gray-700 hover:bg-gray-600 text-white p-2 rounded transition-colors"
                    >
                      <Copy className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Referral Table */}
        <div className="mb-8">
          
          
          {/* Table with Horizontal Scrolling for Mobile */}
          <div className="overflow-x-auto border-t border-gray-700/60 mt-6">
            <table className="w-full min-w-full">
              <thead>
                <tr className="border-b border-gray-700/50 bg-transparent">
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-300 whitespace-nowrap">My Referral</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-300 whitespace-nowrap">Reward</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-300 whitespace-nowrap">Date</th>
                </tr>
              </thead>
              <tbody>
                {displayedData.map((item, index) => (
                  <tr 
                    key={item.id} 
                    className="border-b border-gray-700 hover:bg-gray-900/30 transition-colors"
                  >
                    <td className="px-6 py-4 text-sm text-gray-300 whitespace-nowrap">{item.referral}</td>
                    <td className="px-6 py-4 text-sm text-gray-300 whitespace-nowrap">{item.reward}</td>
                    <td className="px-6 py-4 text-sm text-gray-300 whitespace-nowrap">{item.date}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Pagination */}
        <div className="mt-4 space-y-3 text-sm text-gray-400">
          {/* First Row: Selected count and Rows per page */}
          <div className="flex items-center justify-between">
            <p>0 of {referralData.length} row(s) selected.</p>
            
            <div className="flex items-center gap-2">
              <span>Rows</span>
              <select 
                value={rowsPerPage}
                onChange={(e) => {
                  setRowsPerPage(Number(e.target.value))
                  setCurrentPage(1)
                }}
                className="bg-gray-900 border border-gray-700 rounded px-3 py-2 text-gray-300 text-sm focus:outline-none focus:border-cyan-500"
              >
                <option value={5}>5</option>
                <option value={10}>10</option>
                <option value={25}>25</option>
              </select>
            </div>
          </div>

          {/* Second Row: Page info and pagination buttons */}
          <div className="flex items-center justify-between">
            <span className="text-gray-400">
              Page {currentPage} of {totalPages}
            </span>

            <div className="flex gap-2">
              <button 
                onClick={() => setCurrentPage(1)}
                disabled={currentPage === 1}
                className="p-2 rounded border border-gray-700 bg-gray-900 hover:bg-gray-800 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                <span className="text-gray-300">«</span>
              </button>
              <button 
                onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                disabled={currentPage === 1}
                className="p-2 rounded border border-gray-700 bg-gray-900 hover:bg-gray-800 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <button 
                onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                disabled={currentPage === totalPages}
                className="p-2 rounded border border-gray-700 bg-gray-900 hover:bg-gray-800 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
              <button 
                onClick={() => setCurrentPage(totalPages)}
                disabled={currentPage === totalPages}
                className="p-2 rounded border border-gray-700 bg-gray-900 hover:bg-gray-800 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                <span className="text-gray-300">»</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  )
}
