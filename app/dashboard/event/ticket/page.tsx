'use client'

import Link from 'next/link'
import { Header } from '@/components/header'
import { Footer } from '@/components/footer'
import { Calendar, Clock } from 'lucide-react'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'

type TicketItem = {
  id: string | number
  judul?: string
  title?: string
  ticket_number?: string | number
  pid?: string | number
  price?: string | number
  status?: string
  status_claim?: string
  waktu_jam?: string
  date?: string
  from_dates?: string
}

export default function MyTicketPage() {
  const router = useRouter()
  const [tickets, setTickets] = useState<TicketItem[]>([])
  const [loading, setLoading] = useState(true)
  const [errorMessage, setErrorMessage] = useState('')

  useEffect(() => {
    const token = localStorage.getItem('user_token')

    if (!token) {
      router.push('/')
      return
    }

    const fetchTickets = async () => {
      try {
        setLoading(true)
        setErrorMessage('')

        const response = await fetch('/api/event/myticket/list', {
          method: 'GET',
          headers: {
            Authorization: `Bearer ${token}`,
            Accept: 'application/json',
          },
          cache: 'no-store',
        })

        const data = await response.json().catch(() => ({}))

        if (!response.ok) {
          throw new Error(data?.message || 'Gagal mengambil data tiket')
        }

        if (Array.isArray(data?.data)) {
          setTickets(data.data)
          return
        }

        setTickets([])
      } catch (error) {
        console.error('[my-ticket] Error fetching tickets:', error)
        setErrorMessage(error instanceof Error ? error.message : 'Terjadi kesalahan saat memuat tiket')
      } finally {
        setLoading(false)
      }
    }

    fetchTickets()
  }, [router])

  return (
    <div className="min-h-screen bg-[#050B14] text-white font-sans">
      <Header />

      {/* Banner Section */}
      <div
        className="relative h-64 md:h-80 w-full bg-cover bg-center"
        style={{ backgroundImage: 'url(/images/privacy-header.jpg)' }}
      >
        <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/50 to-[#050B14]" />
        <div className="absolute inset-0 flex flex-col justify-center items-center">
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4 text-center">My Ticket</h1>
          <div className="flex items-center gap-2 text-sm md:text-base text-gray-300">
            <Link href="/event" className="hover:text-white transition">Event</Link>
            <span className="text-gray-400">›</span>
            <span className="text-white">My Ticket</span>
          </div>
        </div>
      </div>

    {/* Main Content */}
      <div className="px-4 md:px-12 py-8 md:py-12">
        {/* Ticket Detail Header */}
        <div className="flex flex-col md:flex-row md:justify-between md:items-center mb-8">
          <h2 className="text-xl md:text-2xl font-semibold text-white mb-4 md:mb-0">
            Ticket Detail
          </h2>
          <span className="text-right text-gray-400 text-sm md:text-base md:block hidden">
            Status
          </span>
        </div>

        {/* Tickets List Container */}
        <div className="divide-y divide-white/10">
          {loading ? (
            <div className="py-6 text-gray-400">Loading tiket...</div>
          ) : errorMessage ? (
            <div className="py-6 text-red-400">{errorMessage}</div>
          ) : tickets.length === 0 ? (
            <div className="py-6 text-gray-400">Belum ada tiket.</div>
          ) : (
            tickets.map((ticket) => {
              const ticketNumber = ticket.ticket_number ?? ticket.pid ?? '-'
              const eventName = ticket.judul ?? ticket.title ?? '-'
              const date = ticket.date ?? ticket.from_dates ?? '-'
              const time = ticket.waktu_jam ?? '-'
              const status = ticket.status ?? ticket.status_claim ?? '-'
              const priceNumber = Number(ticket.price)
              const priceLabel =
                !Number.isNaN(priceNumber) && priceNumber === 0
                  ? 'Gratis'
                  : (ticket.price?.toString() || '-')

              return (
                <Link
                  key={ticket.id}
                  href={`/event/ticket/detail?id_claim=${ticket.id}`}
                  className="block py-6 hover:bg-white/[0.02] transition-colors group"
                >
                  {/* MOBILE LAYOUT (Gambar Kanan - List Row Style) */}
                  <div className="md:hidden flex justify-between items-start gap-2">
                    <div className="space-y-2">
                      <p className="text-xs text-gray-500">Ticket Number: {ticketNumber}</p>
                      <h3 className="text-base font-bold text-white uppercase tracking-tight">
                        {eventName}
                      </h3>
                      <div className="flex flex-col gap-1.5 mt-2">
                        <div className="flex items-center gap-2 text-gray-400 text-xs">
                          <Calendar className="w-3.5 h-3.5" />
                          <span>{date}</span>
                          <span className="text-gray-600">•</span>
                        </div>
                        <div className="flex items-center gap-2 text-gray-400 text-xs">
                          <Clock className="w-3.5 h-3.5" />
                          <span>{time}</span>
                        </div>
                      </div>
                    </div>

                    <div className="flex flex-col items-end gap-2 shrink-0">
                      <p className="text-gray-300 text-sm font-medium">{priceLabel}</p>
                      <span className="px-3 py-1 bg-white text-black text-[10px] font-bold rounded-full uppercase tracking-tighter">
                        {status}
                      </span>
                    </div>
                  </div>

                  {/* DESKTOP LAYOUT (Gambar Kiri - List Row Style Horizontal) */}
                  <div className="hidden md:flex justify-between items-center">
                    <div className="space-y-1">
                      <p className="text-sm text-gray-500">Ticket Number: {ticketNumber}</p>
                      <h3 className="text-xl font-bold text-white">{eventName}</h3>
                      <div className="flex items-center gap-4 text-gray-400 text-sm mt-1">
                        <div className="flex items-center gap-2">
                          <Calendar className="w-4 h-4" />
                          {date}
                        </div>
                        <span className="text-gray-700">•</span>
                        <div className="flex items-center gap-2">
                          <Clock className="w-4 h-4" />
                          {time}
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-4">
                      <p className="text-gray-300 text-base font-medium">{priceLabel}</p>
                      <span className="text-gray-700 mx-2">•</span>
                      <span className="px-5 py-1 bg-white text-black text-xs font-bold rounded-full uppercase tracking-wider">
                        {status}
                      </span>
                    </div>
                  </div>
                </Link>
              )
            })
          )}
        </div>
      </div>

      <Footer />
    </div>
  )
}
