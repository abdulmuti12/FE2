import { NextRequest, NextResponse } from 'next/server'

type MyEventItem = {
  id?: string | number
  title?: string
  pid?: string | number
  price?: string | number
  status_claim?: string
  from_times?: string
  to_times_format?: string
  from_dates?: string
}

export async function GET(request: NextRequest) {
  try {
    const authHeader = request.headers.get('authorization')
    const token = authHeader?.replace('Bearer ', '')

    if (!token) {
      return NextResponse.json(
        { status: false, message: 'No authorization token provided', data: [] },
        { status: 401 }
      )
    }

    const backendResponse = await fetch('https://api.usky.ai/customer/my-event', {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: 'application/json',
      },
      cache: 'no-store',
    })

    const text = await backendResponse.text()

    let payload: { data?: MyEventItem[]; status?: boolean; message?: string }

    try {
      payload = JSON.parse(text)
    } catch {
      return NextResponse.json(
        {
          status: false,
          message: 'Invalid response format from upstream API',
          data: [],
        },
        { status: 502 }
      )
    }

    const mappedData = (payload?.data ?? []).map((item) => ({
      id: item.id ?? '',
      judul: item.title ?? '',
      ticket_number: item.pid ?? '',
      price: item.price ?? '',
      status: item.status_claim ?? '',
      date: item.from_dates ?? '',
      title: item.title ?? '',
      pid: item.pid ?? '',
      status_claim: item.status_claim ?? '',
      waktu_jam: `${item.from_times ?? ''} - ${item.to_times_format ?? ''}`,
      from_dates: item.from_dates ?? '',
    }))

    return NextResponse.json(
      {
        status: payload?.status ?? backendResponse.ok,
        message: payload?.message ?? (backendResponse.ok ? 'success' : 'failed'),
        data: mappedData,
      },
      { status: backendResponse.status }
    )
  } catch (error) {
    console.error('[myticket-list proxy] Internal error:', error)

    return NextResponse.json(
      { status: false, message: 'Failed to fetch my ticket list', data: [] },
      { status: 500 }
    )
  }
}
