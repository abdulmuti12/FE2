// app/api/share/route.ts
import { NextResponse } from 'next/server'
import { buildApiUrl } from '@/app/api/_utils'

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const authHeader = request.headers.get('authorization')

    if (!authHeader) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Ubah ke FormData sesuai permintaan API uSky
    const formData = new FormData()
    formData.append('id', body.id) 

    // Tembak API uSky
    const response = await fetch(buildApiUrl('/movie/share'), {
      method: 'POST',
      headers: {
        'Authorization': authHeader,
        // Jangan tambahkan Content-Type agar fetch otomatis membuat boundary form-data
      },
      body: formData,
    })

    const data = await response.json()
    return NextResponse.json(data, { status: response.status })

  } catch (error) {
    console.error('[v0] Share Proxy Error:', error)
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
  }
}