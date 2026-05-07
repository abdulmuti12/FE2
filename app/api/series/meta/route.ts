import { NextResponse } from 'next/server'
import { buildApiUrl } from '@/app/api/_utils'

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const judul = searchParams.get('judul')
  const authHeader = request.headers.get('authorization')

  if (!judul) {
    return NextResponse.json(
      { status: false, message: 'Parameter judul series diperlukan' },
      { status: 400 }
    )
  }

  try {
    const response = await fetch(
      `${buildApiUrl('/series/meta')}?judul=${encodeURIComponent(judul)}`,
      {
        method: 'GET',
        headers: {
          ...(authHeader ? { Authorization: authHeader } : {}),
          'Content-Type': 'application/json',
        },
        cache: 'no-store',
      }
    )

    const data = await response.json()
    return NextResponse.json(data, { status: response.status })
  } catch (error) {
    console.error('Error fetching series meta proxy:', error)
    return NextResponse.json(
      { status: false, message: 'Terjadi kesalahan saat mengambil metadata series' },
      { status: 500 }
    )
  }
}
