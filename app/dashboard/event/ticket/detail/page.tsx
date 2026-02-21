'use client'

import Link from 'next/link'
import { Header } from '@/components/header'
import { Footer } from '@/components/footer'
import { Calendar, Clock, MapPin, Users } from 'lucide-react'
import Image from 'next/image'

export default function TicketDetailPage() {
  const ticketDetail = {
    ticketNumber: '346297',
    eventName: '[Judul Event]',
    type: '[Tipe Event]',
    capacity: '5/50',
    date: '12 December 2025',
    day: '12',
    month: 'DEC',
    time: '16:30 PM - 19:30 PM',
    location: 'Online',
    platform: 'Zoom Meeting',
    partner: 'Rindu Marito',
    validDate: '17/09/2025 14:00 - 17/09/2025 15:00',
    venue: 'Wisma kelai, PT Fujitsu Indonesia',
    description: `[Brief Event] Lorem ipsum dolor sit amet consectetur. Volutpat turpis in aliquam pellentesque quis vulputate et imperdiet. Faucibus quam eleifend egestas ac amet feugiat eu sociis velit. Et cras tristique montes nec velit. Semper sit eu vel et dolor vel. Iaculis elementum ut cursus lacinia neque quis non feugiat. Amet neque quis ornare maecenas.`,
  }

  // Komponen Card QR Code agar bisa dipakai ulang di mobile & desktop
  const QRCodeCard = () => (
    <div className="bg-[#0B1220] border border-white/10 rounded-2xl p-6 w-full lg:max-w-[380px] h-fit">
      <div className="bg-white p-4 rounded-xl mb-4">
        {/* Ganti src dengan path QR Code Anda */}
        <div className="relative aspect-square w-full">
           <Image 
            src="/images/qr-code-placeholder.png" 
            alt="QR Code Ticket" 
            fill
            className="object-contain"
          />
        </div>
      </div>
      
      <p className="text-center text-gray-400 text-xs mb-6">Tunjukkan dan scan oleh partner Event</p>
      
      <div className="space-y-4 text-sm">
        <div>
          <p className="text-gray-500 text-xs">No Tiket</p>
          <p className="font-bold text-white">{ticketDetail.ticketNumber}</p>
        </div>
        <div>
          <p className="text-gray-500 text-xs">Partner</p>
          <p className="font-bold text-white">{ticketDetail.partner}</p>
        </div>
        <div>
          <p className="text-gray-500 text-xs">Tanggal</p>
          <p className="font-bold text-white text-xs">{ticketDetail.validDate}</p>
        </div>
        <div>
          <p className="text-gray-500 text-xs">Lokasi</p>
          <p className="font-bold text-white text-xs">{ticketDetail.venue}</p>
        </div>
      </div>
    </div>
  )

  return (
    <div className="min-h-screen bg-[#050B14] text-white font-sans">
      <Header />

      {/* Hero Banner (Desktop) */}
      <div className="hidden md:block relative h-64 md:h-80 w-full bg-cover bg-center" style={{ backgroundImage: 'url(/images/privacy-header.jpg)' }}>
        <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/50 to-[#050B14]" />
        <div className="absolute inset-0 flex flex-col justify-center items-center">
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">My Ticket</h1>
          <div className="flex items-center gap-2 text-sm text-gray-300">
            <Link href="/dashboard/event" className="hover:text-white transition">Event</Link>
            <span className="text-gray-500">›</span>
            <Link href="/dashboard/event/ticket" className="hover:text-white transition">My Ticket</Link>
            <span className="text-gray-500">›</span>
            <span className="text-white">{ticketDetail.eventName}</span>
          </div>
        </div>
      </div>

      {/* Hero Banner (Mobile) */}
      <div className="md:hidden relative h-56 w-full bg-cover bg-center" style={{ backgroundImage: 'url(/images/privacy-header.jpg)' }}>
         <div className="absolute inset-0 bg-gradient-to-t from-[#050B14] to-black/30" />
         <div className="absolute inset-0 flex flex-col justify-center items-center pt-8">
          <h1 className="text-3xl font-bold text-white mb-2">My Ticket</h1>
          <div className="flex items-center gap-2 text-xs text-gray-300">
            <Link href="/dashboard/event">Event</Link>
            <span className="text-gray-500">›</span>
            <Link href="/dashboard/event/ticket">My Ticket</Link>
            <span className="text-gray-500">›</span>
            <span className="text-white truncate max-w-[100px]">{ticketDetail.eventName}</span>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 md:px-12 py-6 md:py-12">
        <div className="flex flex-col lg:flex-row gap-8 lg:gap-12">
          
          {/* LEFT COLUMN */}
          <div className="flex-1 order-1">
            <h2 className="text-3xl md:text-[40px] font-bold text-white mb-4 md:mb-6">{ticketDetail.eventName}</h2>
            
            <div className="flex items-center gap-3 mb-8 md:mb-10">
              <span className="bg-white text-black px-3 py-1 rounded-full text-xs font-bold tracking-tight">
                {ticketDetail.type}
              </span>
              <span className="text-gray-500">•</span>
              <div className="flex items-center gap-1.5 text-gray-400 text-sm">
                <Users className="w-4 h-4" />
                <span>{ticketDetail.capacity}</span>
              </div>
            </div>

            <div className="flex flex-col md:flex-row gap-6 md:gap-12 mb-10 border-b border-white/10 pb-10">
              <div className="flex items-start gap-4">
                <div className="flex flex-col items-center justify-center w-11 h-11 rounded-lg overflow-hidden shrink-0 border border-white/10 bg-white">
                  <div className="bg-red-600 text-white text-[9px] font-bold w-full text-center py-0.5 uppercase tracking-wider">
                    {ticketDetail.month}
                  </div>
                  <div className="text-black font-bold text-sm w-full text-center py-1">
                    {ticketDetail.day}
                  </div>
                </div>
                <div className="space-y-1 mt-0.5">
                  <p className="text-sm font-semibold text-white">{ticketDetail.date}</p>
                  <div className="flex items-center gap-1.5 text-gray-400 text-xs">
                    <Clock className="w-3.5 h-3.5" />
                    <span>{ticketDetail.time}</span>
                  </div>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="flex items-center justify-center w-11 h-11 rounded-xl border border-white/20 bg-transparent shrink-0">
                  <MapPin className="w-5 h-5 text-gray-300" />
                </div>
                <div className="space-y-1 mt-0.5">
                  <p className="text-sm font-semibold text-white">{ticketDetail.location}</p>
                  <p className="text-gray-400 text-xs">{ticketDetail.platform}</p>
                </div>
              </div>
            </div>

            {/* QR Card - Mobile View Only (Tampil sebelum deskripsi) */}
            <div className="lg:hidden mb-10">
              <QRCodeCard />
            </div>

            {/* Deskripsi Event */}
            <div className="space-y-6 text-gray-400 text-sm leading-relaxed pr-0 md:pr-12">
              <p>{ticketDetail.description}</p>
              <p>{ticketDetail.description}</p>
              <p>{ticketDetail.description}</p>
              <p>{ticketDetail.description}</p>
            </div>
          </div>

          {/* RIGHT COLUMN - Desktop View Only */}
          <div className="hidden lg:block order-2">
            <QRCodeCard />
          </div>

        </div>
      </div>

      <Footer />
    </div>
  )
}
