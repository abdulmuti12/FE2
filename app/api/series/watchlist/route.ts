import { NextResponse } from 'next/server'
import { buildApiUrl } from '@/app/api/_utils'

export async function POST(request: Request) {
  try {
    // 1. Ambil data JSON dari Frontend
    const body = await request.json()
    const authorization = request.headers.get('authorization')

    // 2. Ubah data menjadi form-data (Sesuai dengan Postman)
    const formData = new FormData()
    formData.append('id', body.id)

    // 3. Kirim ke backend uSky menggunakan FormData
    const response = await fetch(buildApiUrl(`/series/watchlist`), {
      method: 'POST',
      headers: {
        // CATATAN PENTING: Jangan set 'Content-Type' secara manual di sini!
        // Fetch API akan otomatis mengatur Content-Type menjadi 'multipart/form-data'
        // dan menambahkan boundary yang tepat saat mendeteksi body berupa FormData.
        ...(authorization ? { Authorization: authorization } : {}),
      },
      body: formData,
    })

    const data = await response.json()
    return NextResponse.json(data)

  } catch (error) {
    console.error('Error adding series to watchlist via proxy:', error)
    return NextResponse.json({ status: false, message: 'Internal Server Error' }, { status: 500 })
  }
}