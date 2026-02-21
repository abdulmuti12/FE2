'use client'

import Link from 'next/link'
import { Header } from '@/components/header'
import { Footer } from '@/components/footer'
import { Calendar, Clock } from 'lucide-react'

const tickets = [
  {
    id: 1,
    ticketNumber: '[No Tiket]',
    eventName: '[Judul Event]',
    date: '22-11-2025',
    time: '16:30 PM - 19:30 PM',
    price: 'Gratis',
    status: 'Waiting',
  },
  {
    id: 2,
    ticketNumber: '[No Tiket]',
    eventName: '[Judul Event]',
    date: '22-11-2025',
    time: '16:30 PM - 19:30 PM',
    price: 'Gratis',
    status: 'Waiting',
  },
]

export default function MyTicketPage() {
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
            <Link href="/dashboard/event" className="hover:text-white transition">Event</Link>
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
          {tickets.map((ticket) => (
            <Link
              key={ticket.id}
              href="/dashboard/event/ticket/detail"
              className="block py-6 hover:bg-white/[0.02] transition-colors group"
            >
              {/* MOBILE LAYOUT (Gambar Kanan - List Row Style) */}
              <div className="md:hidden flex justify-between items-start gap-2">
                <div className="space-y-2">
                  <p className="text-xs text-gray-500">Ticket Number: {ticket.ticketNumber}</p>
                  <h3 className="text-base font-bold text-white uppercase tracking-tight">
                    {ticket.eventName}
                  </h3>
                  <div className="flex flex-col gap-1.5 mt-2">
                    <div className="flex items-center gap-2 text-gray-400 text-xs">
                      <Calendar className="w-3.5 h-3.5" />
                      <span>{ticket.date}</span>
                      <span className="text-gray-600">•</span>
                    </div>
                    <div className="flex items-center gap-2 text-gray-400 text-xs">
                      <Clock className="w-3.5 h-3.5" />
                      <span>{ticket.time}</span>
                    </div>
                  </div>
                </div>

                <div className="flex flex-col items-end gap-2 shrink-0">
                  <p className="text-gray-300 text-sm font-medium">{ticket.price}</p>
                  <span className="px-3 py-1 bg-white text-black text-[10px] font-bold rounded-full uppercase tracking-tighter">
                    {ticket.status}
                  </span>
                </div>
              </div>

              {/* DESKTOP LAYOUT (Gambar Kiri - List Row Style Horizontal) */}
              <div className="hidden md:flex justify-between items-center">
                <div className="space-y-1">
                  <p className="text-sm text-gray-500">Ticket Number: {ticket.ticketNumber}</p>
                  <h3 className="text-xl font-bold text-white">{ticket.eventName}</h3>
                  <div className="flex items-center gap-4 text-gray-400 text-sm mt-1">
                    <div className="flex items-center gap-2">
                      <Calendar className="w-4 h-4" />
                      {ticket.date}
                    </div>
                    <span className="text-gray-700">•</span>
                    <div className="flex items-center gap-2">
                      <Clock className="w-4 h-4" />
                      {ticket.time}
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-4">
                  <p className="text-gray-300 text-base font-medium">{ticket.price}</p>
                  <span className="text-gray-700 mx-2">•</span>
                  <span className="px-5 py-1 bg-white text-black text-xs font-bold rounded-full uppercase tracking-wider">
                    {ticket.status}
                  </span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>

      <Footer />
    </div>
  )
}
