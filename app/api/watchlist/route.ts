// app/api/watchlist/route.ts
import { NextResponse } from 'next/server'
import { buildApiUrl } from '@/app/api/_utils'

export async function POST(request: Request) {
  try {
    // 1. Terima JSON dari frontend lokal kita
    const body = await request.json()
    const authHeader = request.headers.get('authorization')

    if (!authHeader) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // 2. Buat FormData sesuai permintaan API uSky (seperti di Postman)
    const formData = new FormData()
    formData.append('id', body.id) // Masukkan ID dari frontend

    // 3. Tembak API uSky menggunakan FormData
    const response = await fetch(buildApiUrl('/movie/watchlist'), {
      method: 'POST',
      headers: {
        'Authorization': authHeader,
        // PENTING: Jangan tulis Content-Type di sini. 
        // Biarkan fetch yang otomatis men-set 'multipart/form-data' beserta boundary-nya.
      },
      body: formData,
    })

    const data = await response.json()

    // 4. Kembalikan respons uSky ke frontend
    return NextResponse.json(data, { status: response.status })

  } catch (error) {
    console.error('[v0] Watchlist Proxy Error:', error)
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
  }
}