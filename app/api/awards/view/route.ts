import { NextRequest, NextResponse } from 'next/server'
import { buildApiUrl } from '@/app/api/_utils'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const id = body?.id

    if (!id) {
      return NextResponse.json(
        { status: false, message: 'id is required' },
        { status: 400 }
      )
    }

    const authHeader = request.headers.get('authorization')
    const tokenFromHeader = authHeader?.replace(/^Bearer\s+/i, '').trim()
    const token =
      tokenFromHeader ||
      process.env.USKY_API_TOKEN ||
      process.env.NEXT_PUBLIC_API_TOKEN ||
      process.env.API_TOKEN ||
      ''

    if (!token) {
      return NextResponse.json(
        { status: false, message: 'Authorization token is required' },
        { status: 401 }
      )
    }

    const formData = new FormData()
    formData.append('id', String(id))

    const response = await fetch(buildApiUrl('/award/view'), {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
      },
      body: formData,
      cache: 'no-store',
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
        data || { status: false, message: raw || `API error ${response.status}` },
        { status: response.status }
      )
    }

    return NextResponse.json(data || { status: true, message: 'success' })
  } catch (error: any) {
    console.error('Awards view proxy error:', error.message)
    return NextResponse.json(
      { status: false, message: 'Failed to submit view' },
      { status: 500 }
    )
  }
}

