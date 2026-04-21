import { NextRequest, NextResponse } from 'next/server'
import { buildApiUrl } from '@/app/api/_utils'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { id, comment } = body

    if (!id || !comment) {
      return NextResponse.json(
        { status: false, message: 'ID and comment are required' },
        { status: 400 }
      )
    }

    const authHeader = request.headers.get('authorization')
    const token = authHeader?.replace('Bearer ', '')

    if (!token) {
      return NextResponse.json(
        { status: false, message: 'Authorization token is required' },
        { status: 401 }
      )
    }

    console.log('[v0] Posting comment to API - ID:', id, 'Comment:', comment)

    const response = await fetch(buildApiUrl('/movie/comment'), {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams({
        id: id.toString(),
        comment: comment,
      }).toString(),
      cache: 'no-store',
    })

    console.log('[v0] API Response status:', response.status)

    const text = await response.text()
    let data

    try {
      data = JSON.parse(text)
    } catch (error) {
      console.error('[v0] JSON parse error:', error)
      data = { status: false, message: 'Invalid response format', raw: text }
    }

    console.log('[v0] API Response data:', data)

    return NextResponse.json(data, {
      status: response.status,
    })
  } catch (error) {
    console.error('[v0] Error posting comment:', error)
    return NextResponse.json(
      { status: false, message: 'Failed to post comment' },
      { status: 500 }
    )
  }
}
