import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  try {
    const authHeader = request.headers.get('authorization')
    const token = authHeader?.replace('Bearer ', '')

    if (!token) {
      return NextResponse.json(
        { error: 'No authorization token provided' },
        { status: 401 }
      )
    }

    const url = 'https://api.usky.ai/home'

    console.log('[v0] Proxy request →', url)

    const response = await fetch(url, {
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
      status: response.status,
    })
  } catch (error) {
    console.error('[v0] API proxy error:', error)

    return NextResponse.json(
      { error: 'Failed to fetch home data' },
      { status: 500 }
    )
  }
}