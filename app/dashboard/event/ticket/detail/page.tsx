'use client'

import Link from 'next/link'
import { Header } from '@/components/header'
import { Footer } from '@/components/footer'
import { Clock, MapPin } from 'lucide-react'
import Image from 'next/image'
import { Suspense, useEffect, useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'

type TicketDetailData = {
  judul_event?: string
  description_event?: string
  date_event?: string
  location_event?: string
  image_url_event?: string
  tanggal_event?: string
  partner_event?: string
  number?: string | number
  qrcode_image?: string
  event?: {
    from_dates?: string
    to_dates?: string
    from_times?: string
    to_times?: string
    address?: string
  }
}

const getDayMonth = (dateString?: string) => {
  if (!dateString) {
    return { day: '-', month: '---' }
  }

  const date = new Date(dateString)

  if (Number.isNaN(date.getTime())) {
    return { day: '-', month: '---' }
  }

  return {
    day: String(date.getDate()).padStart(2, '0'),
    month: date
      .toLocaleString('en-US', { month: 'short' })
      .toUpperCase(),
  }
}

function TicketDetailContent() {
  const router = useRouter()
  const searchParams = useSearchParams()

  const [ticketDetail, setTicketDetail] = useState<TicketDetailData | null>(null)
  const [loading, setLoading] = useState(true)
  const [errorMessage, setErrorMessage] = useState('')

  useEffect(() => {
    const token = localStorage.getItem('user_token')
    const idClaim = searchParams.get('id_claim')

    if (!token) {
      router.push('/')
      return
    }

    if (!idClaim) {
      setErrorMessage('id_claim tidak ditemukan')
      setLoading(false)
      return
    }

    const fetchDetail = async () => {
      try {
        setLoading(true)
        setErrorMessage('')

        const response = await fetch(`/api/event/ticket/detail?id_claim=${encodeURIComponent(idClaim)}`, {
          method: 'GET',
          headers: {
            Authorization: `Bearer ${token}`,
            Accept: 'application/json',
          },
          cache: 'no-store',
        })

        const result = await response.json().catch(() => ({}))

        if (!response.ok) {
          throw new Error(result?.message || 'Gagal mengambil detail tiket')
        }

        setTicketDetail(result?.data ?? null)
      } catch (error) {
        console.error('[ticket-detail] Error fetching detail:', error)
        setErrorMessage(error instanceof Error ? error.message : 'Terjadi kesalahan saat memuat detail tiket')
      } finally {
        setLoading(false)
      }
    }

    fetchDetail()
  }, [router, searchParams])

  const title = ticketDetail?.judul_event || '-'
  const description = ticketDetail?.description_event || 'Deskripsi event tidak tersedia.'
  const dateEvent = ticketDetail?.date_event || '-'
  const locationEvent = ticketDetail?.location_event || '-'
  const tanggalEvent = ticketDetail?.tanggal_event || '-'
  const partnerEvent = ticketDetail?.partner_event || '-'
  const ticketNumber = ticketDetail?.number?.toString() || '-'
  const qrcodeImage = ticketDetail?.qrcode_image || '/images/qr.png'
  const bannerImage = ticketDetail?.image_url_event || '/images/privacy-header.jpg'

  const timeRange = `${ticketDetail?.event?.from_times || '-'} - ${ticketDetail?.event?.to_times || '-'}`
  const venue = ticketDetail?.event?.address || locationEvent
  const { day, month } = getDayMonth(ticketDetail?.event?.from_dates || dateEvent)

  const QRCodeCard = () => (
    <div className="bg-[#0B1220] border border-white/10 rounded-2xl p-6 w-full lg:max-w-[380px] h-fit">
      <div className="bg-white p-4 rounded-xl mb-4">
        <div className="relative aspect-square w-full">
          <Image src={qrcodeImage} alt="QR Code Ticket" fill className="object-contain" />
        </div>
      </div>

      <p className="text-center text-gray-400 text-xs mb-6">Tunjukkan dan scan oleh partner Event</p>

      <div className="space-y-4 text-sm">
        <div>
          <p className="text-gray-500 text-xs">No Tiket</p>
          <p className="font-bold text-white">{ticketNumber}</p>
        </div>
        <div>
          <p className="text-gray-500 text-xs">Partner</p>
          <p className="font-bold text-white">{partnerEvent}</p>
        </div>
        <div>
          <p className="text-gray-500 text-xs">Tanggal</p>
          <p className="font-bold text-white text-xs">{tanggalEvent}</p>
        </div>
        <div>
          <p className="text-gray-500 text-xs">Lokasi</p>
          <p className="font-bold text-white text-xs">{venue}</p>
        </div>
      </div>
    </div>
  )

  return (
    <div className="min-h-screen bg-[#050B14] text-white font-sans">
      <Header />

      <div
        className="hidden md:block relative h-64 md:h-80 w-full bg-cover bg-center"
        style={{ backgroundImage: `url(${bannerImage})` }}
      >
        <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/50 to-[#050B14]" />
        <div className="absolute inset-0 flex flex-col justify-center items-center">
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">My Ticket</h1>
          <div className="flex items-center gap-2 text-sm text-gray-300">
            <Link href="/event" className="hover:text-white transition">Event</Link>
            <span className="text-gray-500">›</span>
            <Link href="/event/ticket" className="hover:text-white transition">My Ticket</Link>
            <span className="text-gray-500">›</span>
            <span className="text-white">{title}</span>
          </div>
        </div>
      </div>

      <div
        className="md:hidden relative h-56 w-full bg-cover bg-center"
        style={{ backgroundImage: `url(${bannerImage})` }}
      >
        <div className="absolute inset-0 bg-gradient-to-t from-[#050B14] to-black/30" />
        <div className="absolute inset-0 flex flex-col justify-center items-center pt-8">
          <h1 className="text-3xl font-bold text-white mb-2">My Ticket</h1>
          <div className="flex items-center gap-2 text-xs text-gray-300">
            <Link href="/event">Event</Link>
            <span className="text-gray-500">›</span>
            <Link href="/event/ticket">My Ticket</Link>
            <span className="text-gray-500">›</span>
            <span className="text-white truncate max-w-[100px]">{title}</span>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 md:px-12 py-6 md:py-12">
        {loading ? (
          <div className="text-gray-400">Loading detail tiket...</div>
        ) : errorMessage ? (
          <div className="text-red-400">{errorMessage}</div>
        ) : (
          <div className="flex flex-col lg:flex-row gap-8 lg:gap-12">
            <div className="flex-1 order-1">
              <h2 className="text-3xl md:text-[40px] font-bold text-white mb-4 md:mb-6">{title}</h2>

              <div className="flex items-center gap-3 mb-8 md:mb-10">
                <span className="bg-white text-black px-3 py-1 rounded-full text-xs font-bold tracking-tight">
                  Event Ticket
                </span>
              </div>

              <div className="flex flex-col md:flex-row gap-6 md:gap-12 mb-10 border-b border-white/10 pb-10">
                <div className="flex items-start gap-4">
                  <div className="flex flex-col items-center justify-center w-11 h-11 rounded-lg overflow-hidden shrink-0 border border-white/10 bg-white">
                    <div className="bg-red-600 text-white text-[9px] font-bold w-full text-center py-0.5 uppercase tracking-wider">
                      {month}
                    </div>
                    <div className="text-black font-bold text-sm w-full text-center py-1">{day}</div>
                  </div>
                  <div className="space-y-1 mt-0.5">
                    <p className="text-sm font-semibold text-white">{dateEvent}</p>
                    <div className="flex items-center gap-1.5 text-gray-400 text-xs">
                      <Clock className="w-3.5 h-3.5" />
                      <span>{timeRange}</span>
                    </div>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="flex items-center justify-center w-11 h-11 rounded-xl border border-white/20 bg-transparent shrink-0">
                    <MapPin className="w-5 h-5 text-gray-300" />
                  </div>
                  <div className="space-y-1 mt-0.5">
                    <p className="text-sm font-semibold text-white">{locationEvent}</p>
                    <p className="text-gray-400 text-xs">{venue}</p>
                  </div>
                </div>
              </div>

              <div className="lg:hidden mb-10">
                <QRCodeCard />
              </div>

              <div className="space-y-6 text-gray-400 text-sm leading-relaxed pr-0 md:pr-12">
                <div dangerouslySetInnerHTML={{ __html: description }} />

                {/* <div className="space-y-2">
                  <div className="flex items-center gap-2 text-sm text-gray-300">
                    <Calendar className="w-4 h-4" />
                    <span>Tanggal Event: {tanggalEvent}</span>
                  </div>
                  <p className="text-sm text-gray-300">Partner Event: {partnerEvent}</p>
                  <p className="text-sm text-gray-300">Number: {ticketNumber}</p>
                </div> */}
              </div>
            </div>

            <div className="hidden lg:block order-2">
              <QRCodeCard />
            </div>
          </div>
        )}
      </div>

      <Footer />
    </div>
  )
}

export default function TicketDetailPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-[#050B14] text-white font-sans flex items-center justify-center">
          <div className="w-10 h-10 border-4 border-white/30 border-t-white rounded-full animate-spin" />
        </div>
      }
    >
      <TicketDetailContent />
    </Suspense>
  )
}
