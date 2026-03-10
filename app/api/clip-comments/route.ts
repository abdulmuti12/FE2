import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const clipId = searchParams.get('id')

    if (!clipId) {
      return NextResponse.json(
        { status: false, message: 'Clip ID is required' },
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

    const url = new URL('https://api.usky.ai/movie/comment')
    url.searchParams.set('id', clipId)

    console.log('[v0] Fetching clip comments from:', url.toString())

    const response = await fetch(url.toString(), {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: 'application/json',
      },
      cache: 'no-store',
    })

    const text = await response.text()
    let data

    try {
      data = JSON.parse(text)
    } catch (error) {
      console.error('[v0] JSON parse error:', error)
      data = { status: false, message: 'Invalid response format', raw: text }
    }

    return NextResponse.json(data, {
      status: response.status,
    })
  } catch (error) {
    console.error('[v0] API error fetching clip comments:', error)
    return NextResponse.json(
      { status: false, message: 'Failed to fetch comments' },
      { status: 500 }
    )
  }
}
