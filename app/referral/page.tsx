'use client'

import { Header } from '@/components/header'
import { Footer } from '@/components/footer'
import { ChevronRight, Copy, ChevronLeft } from 'lucide-react'
import { useEffect, useState } from 'react'
import Image from 'next/image'

type ReferralItem = {
  info?: string
  rewards?: string | number
  dates?: string
}

type ReferralProfile = {
  id?: string
  name?: string
  email?: string
  avatar?: string
  balance?: string | number
  refferal_code?: string
}

type ReferralMeta = {
  prev_page?: number
  next_page?: number
  total_rows?: number
  per_page?: number
  current_page?: number
  total_pages?: number
}

const DEFAULT_AVATAR = '/images/pngs.png'

const toAvatarUrl = (avatar?: string) => {
  const src = String(avatar || '').trim()
  if (!src) return DEFAULT_AVATAR
  if (src.startsWith('http://') || src.startsWith('https://')) return src
  return `https://usky.ai/uploads/${src}`
}

const buildReferralLink = (code?: string) => {
  const referralCode = String(code || '').trim()
  if (!referralCode) return 'https://usky.ai/login'
  return `https://usky.ai/login?ref=${referralCode}`
}

export default function ReferralPage() {
  const [currentPage, setCurrentPage] = useState(1)
  const [rowsPerPage, setRowsPerPage] = useState(5)
  const [copied, setCopied] = useState(false)
  const [creatorName, setCreatorName] = useState('Creator')
  const [creatorEmail, setCreatorEmail] = useState('-')
  const [creatorBalance, setCreatorBalance] = useState<string | number>('0')
  const [creatorAvatar, setCreatorAvatar] = useState(DEFAULT_AVATAR)
  const [referralLink, setReferralLink] = useState('https://usky.ai/login')
  const [referralData, setReferralData] = useState<ReferralItem[]>([])
  const [referralMeta, setReferralMeta] = useState<ReferralMeta>({
    prev_page: 1,
    next_page: 1,
    total_rows: 0,
    per_page: 5,
    current_page: 1,
    total_pages: 1,
  })
  const [isLoadingReferral, setIsLoadingReferral] = useState(true)
  const [referralError, setReferralError] = useState<string | null>(null)

  const totalPages = Math.max(1, Number(referralMeta.total_pages || 1))
  const displayedData = referralData

  const resolvePrevPage = () => {
    const metaPrev = Number(referralMeta.prev_page)
    if (Number.isFinite(metaPrev) && metaPrev >= 1 && metaPrev < currentPage) {
      return metaPrev
    }
    return Math.max(1, currentPage - 1)
  }

  const resolveNextPage = () => {
    const metaNext = Number(referralMeta.next_page)
    if (Number.isFinite(metaNext) && metaNext > currentPage && metaNext <= totalPages) {
      return metaNext
    }
    return Math.min(totalPages, currentPage + 1)
  }

  const canGoPrev = currentPage > 1
  const canGoNext = currentPage < totalPages

  const handleCopyLink = () => {
    navigator.clipboard.writeText(referralLink)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  useEffect(() => {
    const fetchReferral = async () => {
      try {
        setIsLoadingReferral(true)
        setReferralError(null)

        const rawProfile = localStorage.getItem('user_profile')
        if (rawProfile) {
          try {
            const profile = JSON.parse(rawProfile)
            const rawName = String(profile?.name || '').trim()
            const rawUsername = String(profile?.username || '').trim()
            const rawEmail = String(profile?.email || '').trim()
            const rawReferralCode = String(profile?.refferal_code || '').trim()

            setCreatorName(rawName || rawUsername || 'Creator')
            setCreatorEmail(rawEmail || '-')
            setReferralLink(buildReferralLink(rawReferralCode))
          } catch (error) {
            console.error('Failed to parse user_profile:', error)
          }
        }

        const token = localStorage.getItem('user_token') || ''
        if (!token) {
          setReferralData([])
          setReferralError('Silakan login terlebih dahulu')
          return
        }

        const params = new URLSearchParams({
          page: String(currentPage),
          per_page: String(rowsPerPage),
        })

        const response = await fetch(`/api/referral?${params.toString()}`, {
          method: 'GET',
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        })

        const raw = await response.text()
        let result: any = null
        try {
          result = raw ? JSON.parse(raw) : null
        } catch {
          result = null
        }

        if (response.ok && result?.status === true) {
          const profile: ReferralProfile | null =
            result?.data && typeof result.data === 'object' ? result.data : null
          const meta: ReferralMeta | null =
            result?.meta && typeof result.meta === 'object' ? result.meta : null

          if (profile) {
            const rawName = String(profile.name || '').trim()
            const rawEmail = String(profile.email || '').trim()
            const rawBalance = profile.balance ?? '0'
            const rawAvatar = String(profile.avatar || '').trim()
            const rawReferralCode = String(profile.refferal_code || '').trim()

            if (rawName) setCreatorName(rawName)
            if (rawEmail) setCreatorEmail(rawEmail)
            setCreatorBalance(rawBalance)
            setCreatorAvatar(toAvatarUrl(rawAvatar))
            setReferralLink(buildReferralLink(rawReferralCode))
          }

          if (meta) {
            const incomingCurrent = Number(meta.current_page)
            const normalizedCurrent = Number.isFinite(incomingCurrent)
              ? Math.max(1, incomingCurrent)
              : currentPage
            const incomingPerPage = Number(meta.per_page)
            const normalizedTotalPages = Math.max(1, Number(meta.total_pages) || 1)

            setReferralMeta({
              prev_page: Number(meta.prev_page) || 1,
              next_page: Number(meta.next_page) || normalizedCurrent,
              total_rows: Number(meta.total_rows) || 0,
              per_page: Number.isFinite(incomingPerPage) && incomingPerPage > 0 ? incomingPerPage : rowsPerPage,
              current_page: normalizedCurrent,
              total_pages: normalizedTotalPages,
            })

            if (currentPage > normalizedTotalPages) {
              setCurrentPage(normalizedTotalPages)
            }
          } else {
            setReferralMeta((prev) => ({
              ...prev,
              current_page: currentPage,
              per_page: rowsPerPage,
              total_rows: Array.isArray(result?.list) ? result.list.length : 0,
              total_pages: 1,
            }))
          }

          setReferralData(Array.isArray(result?.list) ? result.list : [])
        } else {
          setReferralData([])
          setReferralError(result?.message || raw || 'Gagal mengambil data referral')
        }
      } catch (error) {
        console.error('Error fetching referral:', error)
        setReferralData([])
        setReferralError('Terjadi kesalahan saat menghubungi server')
      } finally {
        setIsLoadingReferral(false)
      }
    }

    fetchReferral()
  }, [currentPage, rowsPerPage])

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
            <a href="/home" className="text-gray-300 hover:text-white transition-colors">Home</a>
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
                  src={creatorAvatar}
                  alt="Creator Avatar" 
                  fill 
                  className="object-cover"
                  onError={() => setCreatorAvatar(DEFAULT_AVATAR)}
                />
              </div>
            </div>

            {/* Creator Info */}
            <div className="flex-1">
              <h2 className="text-2xl md:text-3xl font-bold text-white mb-1">{creatorName}</h2>
              <p className="text-gray-400 mb-6">{creatorEmail}</p>

              {/* Info Cards */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* My Reward Card */}
                <div className="bg-gradient-to-br from-gray-800 to-gray-900 border border-gray-700 rounded-lg p-4 md:p-6">
                  <p className="text-gray-400 text-sm mb-2">My Reward</p>
                  <p className="text-2xl md:text-3xl font-bold text-white">{creatorBalance} USKY</p>
                </div>

                {/* Label Card */}
                <div className="bg-gradient-to-br from-gray-800 to-gray-900 border border-gray-700 rounded-lg p-4 md:p-6">
                  <label className="block text-gray-400 text-sm mb-2">Label</label>
                  <div className="flex gap-2">
                    <input 
                      type="text" 
                      value={referralLink}
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
                {isLoadingReferral ? (
                  <tr>
                    <td colSpan={3} className="px-6 py-6 text-sm text-gray-400">
                      Loading referral data...
                    </td>
                  </tr>
                ) : displayedData.length > 0 ? (
                  displayedData.map((item, index) => (
                    <tr
                      key={`${item.info || 'ref'}-${index}`}
                      className="border-b border-gray-700 hover:bg-gray-900/30 transition-colors"
                    >
                      <td
                        className="px-6 py-4 text-sm text-gray-300 whitespace-nowrap"
                        dangerouslySetInnerHTML={{ __html: item.info || '-' }}
                      />
                      <td className="px-6 py-4 text-sm text-gray-300 whitespace-nowrap">{item.rewards ?? '0'}</td>
                      <td className="px-6 py-4 text-sm text-gray-300 whitespace-nowrap">{item.dates || '-'}</td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={3} className="px-6 py-6 text-sm text-gray-400">
                      {referralError || 'No referral data found.'}
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Pagination */}
        <div className="mt-4 space-y-3 text-sm text-gray-400">
          {/* First Row: Selected count and Rows per page */}
          <div className="flex items-center justify-between">
            <p>0 of {referralMeta.total_rows || 0} row(s) selected.</p>
            
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
                disabled={!canGoPrev}
                className="p-2 rounded border border-gray-700 bg-gray-900 hover:bg-gray-800 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                <span className="text-gray-300">«</span>
              </button>
              <button 
                onClick={() => setCurrentPage(resolvePrevPage())}
                disabled={!canGoPrev}
                className="p-2 rounded border border-gray-700 bg-gray-900 hover:bg-gray-800 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <button 
                onClick={() => setCurrentPage(resolveNextPage())}
                disabled={!canGoNext}
                className="p-2 rounded border border-gray-700 bg-gray-900 hover:bg-gray-800 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
              <button 
                onClick={() => setCurrentPage(totalPages)}
                disabled={!canGoNext}
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
