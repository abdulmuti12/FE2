import { NextResponse } from 'next/server'
import { buildFilmApiUrl } from '../_utils'

export async function GET(request: Request) {
  // 1. Ambil parameter 'id' dari URL request internal
  const { searchParams } = new URL(request.url)
  const id = searchParams.get('id')

  // 2. Ambil token Authorization dari request frontend
  const authHeader = request.headers.get('Authorization')

  if (!id) {
    return NextResponse.json(
      { status: false, message: 'Parameter ID film diperlukan' },
      { status: 400 }
    )
  }

  try {
    // 3. Hit ke endpoint uSky API dari SERVER (Bypass CORS)
    const response = await fetch(`${buildFilmApiUrl('/movie/detail')}?id=${id}`, {
      method: 'GET',
      headers: {
        // Teruskan token ke server uSky
        'Authorization': authHeader || '',
        'Content-Type': 'application/json'
      },
      // Matikan cache agar data selalu fresh
      cache: 'no-store' 
    })

    const data = await response.json()

    // 4. Kembalikan response dari uSky ke client (browser) Anda
    return NextResponse.json(data)

  } catch (error) {
    console.error('Error fetching film detail proxy:', error)
    return NextResponse.json(
      { status: false, message: 'Terjadi kesalahan pada server internal saat fetch ke API uSky' },
      { status: 500 }
    )
  }
}
