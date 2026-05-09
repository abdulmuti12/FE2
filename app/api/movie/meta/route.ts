import { NextResponse } from 'next/server'
import { buildApiUrl } from '@/app/api/_utils'

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const id = searchParams.get('id')
  const judul = searchParams.get('judul') || searchParams.get('jud_url')
  const authHeader = request.headers.get('authorization')

  if (!id && !judul) {
    return NextResponse.json(
      { status: false, message: 'Parameter ID atau judul movie diperlukan' },
      { status: 400 }
    )
  }

  try {
    const query = id
      ? `id=${encodeURIComponent(id)}`
      : `judul=${encodeURIComponent(String(judul || ''))}`

    const response = await fetch(
      `${buildApiUrl('/movie/meta')}?${query}`,
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
    console.error('Error fetching movie meta proxy:', error)
    return NextResponse.json(
      { status: false, message: 'Terjadi kesalahan saat mengambil metadata movie' },
      { status: 500 }
    )
  }
}
