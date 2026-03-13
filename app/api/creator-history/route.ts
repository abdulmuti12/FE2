import { NextResponse } from 'next/server'

export async function GET(request: Request) {
  // 1. Ambil parameter dari URL lokal (/api/creator-history?id=...&per_page=...)
  const { searchParams } = new URL(request.url)
  const id = searchParams.get('id')
  const per_page = searchParams.get('per_page') || '1'

  // 2. Ambil token Authorization yang dikirim dari frontend
  const authHeader = request.headers.get('authorization')

  if (!id) {
    return NextResponse.json({ status: false, message: 'Creator ID is required' }, { status: 400 })
  }

  try {
    // 3. Teruskan request (Proxy) ke server API asli
    const response = await fetch(`https://api.usky.ai/creator/history?id=${id}&per_page=${per_page}`, {
      method: 'GET',
      headers: {
        'Authorization': authHeader || '', // Teruskan token Bearer
        'Content-Type': 'application/json',
      },
    })

    const data = await response.json()
    
    // 4. Kembalikan data ke frontend lokal
    return NextResponse.json(data)
  } catch (error) {
    console.error('API Route Error:', error)
    return NextResponse.json({ status: false, message: 'Internal Server Error' }, { status: 500 })
  }
}