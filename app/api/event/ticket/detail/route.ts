import { NextRequest, NextResponse } from 'next/server'

type ClaimResponse = {
  status?: boolean
  message?: string
  data?: {
    event?: {
      title?: string
      description?: string
      image_url?: string
      date?: string
      location?: string
      address?: string
      from_dates?: string
      to_dates?: string
      from_times?: string
      to_times?: string
      qrcode_image?: string
      [key: string]: unknown
    }
    data?: {
      pid?: string | number
      qrcode_image?: string
      [key: string]: unknown
    }
    partner?: {
      full_name?: string
      [key: string]: unknown
    }
  }
}

export async function GET(request: NextRequest) {
  try {
    const authHeader = request.headers.get('authorization')
    const token = authHeader?.replace('Bearer ', '')

    if (!token) {
      return NextResponse.json(
        { status: false, message: 'No authorization token provided' },
        { status: 401 }
      )
    }

    const idClaim = request.nextUrl.searchParams.get('id_claim')

    if (!idClaim) {
      return NextResponse.json(
        { status: false, message: 'id_claim is required' },
        { status: 400 }
      )
    }

    const backendResponse = await fetch(
      `https://api.usky.ai/event/claim?id_claim=${encodeURIComponent(idClaim)}`,
      {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${token}`,
          Accept: 'application/json',
        },
        cache: 'no-store',
      }
    )

    const text = await backendResponse.text()

    let payload: ClaimResponse

    try {
      payload = JSON.parse(text)
    } catch {
      return NextResponse.json(
        { status: false, message: 'Invalid response format from upstream API' },
        { status: 502 }
      )
    }

    const event = payload?.data?.event ?? {}
    const claim = payload?.data?.data ?? {}
    const partner = payload?.data?.partner ?? {}

    return NextResponse.json(
      {
        status: payload?.status ?? backendResponse.ok,
        message: payload?.message ?? (backendResponse.ok ? 'success' : 'failed'),
        data: {
          event,
          claim,
          partner,
          judul_event: event.title ?? '',
          description_event: event.description ?? '',
          date_event: event.date ?? event.from_dates ?? '',
          location_event: event.location ?? event.address ?? '',
          image_url_event: event.image_url ?? '',
          tanggal_event: `${event.from_dates ?? ''} - ${event.to_dates ?? ''}`,
          partner_event: partner.full_name ?? '',
          number: claim.pid ?? '',
          qrcode_image: claim.qrcode_image ?? event.qrcode_image ?? '',
        },
      },
      { status: backendResponse.status }
    )
  } catch (error) {
    console.error('[ticket-detail proxy] Internal error:', error)

    return NextResponse.json(
      { status: false, message: 'Failed to fetch ticket detail' },
      { status: 500 }
    )
  }
}
