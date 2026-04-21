import { NextResponse } from 'next/server'
import { buildApiUrl } from '@/app/api/_utils'

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const authorization = request.headers.get('authorization')

    if (!body.id) {
      return NextResponse.json(
        { status: false, message: 'ID series diperlukan' },
        { status: 400 }
      )
    }

    const stars = Number(body.stars)
    if (!Number.isFinite(stars) || stars < 1 || stars > 5) {
      return NextResponse.json(
        { status: false, message: 'Stars harus bernilai 1 sampai 5' },
        { status: 400 }
      )
    }

    const formData = new FormData()
    formData.append('id', body.id)
    formData.append('stars', String(stars))

    const response = await fetch(buildApiUrl('/series/rate'), {
      method: 'POST',
      headers: {
        ...(authorization ? { Authorization: authorization } : {}),
      },
      body: formData,
    })

    const raw = await response.text()
    let data: any = null

    try {
      data = raw ? JSON.parse(raw) : null
    } catch {
      data = null
    }

    if (!response.ok) {
      return NextResponse.json(
        data || {
          status: false,
          message: raw || `External API error: ${response.status}`,
        },
        { status: response.status }
      )
    }

    return NextResponse.json(
      data || { status: true, message: 'Rating submitted' },
      { status: 200 }
    )
  } catch (error) {
    console.error('Error rating series via proxy:', error)
    return NextResponse.json(
      { status: false, message: 'Internal Server Error' },
      { status: 500 }
    )
  }
}
