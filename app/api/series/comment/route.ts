import { NextResponse } from 'next/server'
import { buildApiUrl } from '@/app/api/_utils'

export async function GET(request: Request) {
  // Ambil query 'id' dari URL request frontend
  const { searchParams } = new URL(request.url)
  const id = searchParams.get('id')

  // Ambil token dari header request frontend (jika dikirim)
  const authorization = request.headers.get('authorization')

  if (!id) {
    return NextResponse.json({ status: false, message: 'ID is required' }, { status: 400 })
  }

  try {
    // Lakukan fetch ke API eksternal dari sisi SERVER (Bebas CORS)
    const response = await fetch(buildApiUrl(`/series/comment?id=${id}`), {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        // Teruskan token jika API membutuhkannya
        ...(authorization ? { Authorization: authorization } : {}),
      },
      // Matikan cache agar data komentar selalu fresh
      cache: 'no-store', 
    })

    const data = await response.json()
    return NextResponse.json(data)
    
  } catch (error) {
    console.error('Error fetching comments via proxy:', error)
    return NextResponse.json(
      { status: false, message: 'Internal Server Error' },
      { status: 500 }
    )
  }
}