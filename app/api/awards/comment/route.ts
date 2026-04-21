import { NextRequest, NextResponse } from 'next/server'
import { buildApiUrl } from '@/app/api/_utils'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const id = searchParams.get('id')

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

    const response = await fetch(buildApiUrl(`/award/comment?id=${id}`), {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: 'application/json',
      },
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

    return NextResponse.json(data || { status: false, message: 'Invalid response from API' })
  } catch (error: any) {
    console.error('Awards comment proxy error:', error.message)
    return NextResponse.json(
      { status: false, message: 'Failed to fetch award comments' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const id = body?.id
    const comment = body?.comment

    if (!id || !comment) {
      return NextResponse.json(
        { status: false, message: 'id and comment are required' },
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
    formData.append('comment', String(comment))

    const response = await fetch(buildApiUrl('/award/comment'), {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
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
        data || { status: false, message: raw || `API error ${response.status}` },
        { status: response.status }
      )
    }

    return NextResponse.json(data || { status: true, message: 'success' })
  } catch (error: any) {
    console.error('Awards comment post proxy error:', error.message)
    return NextResponse.json(
      { status: false, message: 'Failed to post award comment' },
      { status: 500 }
    )
  }
}
