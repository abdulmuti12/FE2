import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams

    const page = searchParams.get('page') || '1'
    const limit = searchParams.get('limit') || '50'
    const search = searchParams.get('search') || ''

    const authHeader = request.headers.get('authorization')
    const token = authHeader?.replace('Bearer ', '')

    if (!token) {
      return NextResponse.json(
        { error: 'No authorization token provided' },
        { status: 401 }
      )
    }

    const url = new URL('https://api.usky.ai/creator')

    url.searchParams.set('page', page)
    url.searchParams.set('limit', limit)
    if (search) {
      url.searchParams.set('search', search)
    }

    console.log('[v0] Proxy request →', url.toString())

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
    } catch {
      data = { raw: text }
    }

    return NextResponse.json(data, {
      status: response.status
    })

  } catch (error) {

    console.error('[v0] API proxy error:', error)

    return NextResponse.json(
      { error: 'Failed to fetch creators' },
      { status: 500 }
    )
  }
}
