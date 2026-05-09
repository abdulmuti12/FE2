import { NextResponse } from 'next/server'
import { buildFilmApiUrl } from '../_utils'

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const id = searchParams.get('id')
  const judul = searchParams.get('judul') || searchParams.get('jud_url')
  const authHeader = request.headers.get('authorization')

  if (!id && !judul) {
    return NextResponse.json(
      { status: false, message: 'Parameter ID atau judul film diperlukan' },
      { status: 400 }
    )
  }

  try {
    const query = id
      ? `id=${encodeURIComponent(id)}`
      : `judul=${encodeURIComponent(String(judul || ''))}`

    const response = await fetch(
      `${buildFilmApiUrl('/films/meta')}?${query}`,
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
    console.error('Error fetching film meta proxy:', error)
    return NextResponse.json(
      { status: false, message: 'Terjadi kesalahan saat mengambil metadata film' },
      { status: 500 }
    )
  }
}
