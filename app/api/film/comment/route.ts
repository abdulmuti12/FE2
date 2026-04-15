import { NextResponse } from 'next/server'

export async function GET(request: Request) {
  // Ambil query 'id' dari URL request frontend
  const { searchParams } = new URL(request.url)
  const id = searchParams.get('id')

  // Ambil token dari header request frontend (jika dikirim)
  const authorization = request.headers.get('authorization')

  if (!id) {
    return NextResponse.json({ status: false, message: 'ID film diperlukan' }, { status: 400 })
  }

  try {
    // Lakukan fetch ke API eksternal dari sisi SERVER (Bebas CORS)
    const response = await fetch(`https://api.usky.ai/films/comment?id=${id}`, {
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
    console.error('Error fetching film comments via proxy:', error)
    return NextResponse.json(
      { status: false, message: 'Internal Server Error' },
      { status: 500 }
    )
  }
}

export async function POST(request: Request) {
  try {
    // 1. Ambil data JSON dari Frontend
    const body = await request.json()
    const authorization = request.headers.get('authorization')

    // 2. Validasi input
    if (!body.id || !body.comment) {
      return NextResponse.json({
        status: false,
        message: 'ID film dan komentar diperlukan'
      }, { status: 400 })
    }

    // 3. Ubah data menjadi form-data (Sesuai dengan Postman)
    const formData = new FormData()
    formData.append('id', body.id)
    formData.append('comment', body.comment)

    // 4. Kirim ke backend uSky menggunakan FormData
    const response = await fetch(`https://api.usky.ai/films/comment`, {
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
    console.error('Error posting film comment via proxy:', error)
    return NextResponse.json({ status: false, message: 'Internal Server Error' }, { status: 500 })
  }
}