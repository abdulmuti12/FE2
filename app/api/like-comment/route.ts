import { NextResponse } from 'next/server'

export async function POST(request: Request) {
  try {
    const authHeader = request.headers.get('authorization')
    if (!authHeader) {
      return NextResponse.json({ status: false, message: 'Unauthorized' }, { status: 401 })
    }

    // 1. Ambil payload JSON dari frontend (page.tsx)
    const body = await request.json()

    // 2. UBAH MENJADI FORM DATA agar bisa dibaca oleh API uSky
    const formData = new FormData()
    formData.append('id_comment', body.id_comment)

    // 3. Forward ke API uSky
    const response = await fetch('https://api.usky.ai/movie/comment-like', {
      method: 'POST',
      headers: {
        'Authorization': authHeader,
        // PENTING: Jangan tulis 'Content-Type' di sini. 
        // Fetch akan otomatis mengatur Content-Type ke 'multipart/form-data' jika menggunakan FormData.
      },
      body: formData, // Kirim sebagai form data
    })

    const data = await response.json()
    return NextResponse.json(data)
    
  } catch (error) {
    console.error('[API Proxy Error]:', error)
    return NextResponse.json(
      { status: false, message: 'Internal Server Error' },
      { status: 500 }
    )
  }
}