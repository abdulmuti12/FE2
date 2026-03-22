import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  try {
    console.log('[v0] ===== SERIES CATEGORIES API =====')

    const authHeader = request.headers.get('authorization')
    const token = authHeader?.replace('Bearer ', '')

    if (!token) {
      console.log('[v0] Error: Authorization token is required')
      return NextResponse.json(
        { status: false, message: 'Authorization token is required' },
        { status: 401 }
      )
    }

    console.log('[v0] Token available:', !!token)
    console.log('[v0] Making GET request to: https://api.usky.ai/series/category')

    const response = await fetch('https://api.usky.ai/series/category', {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    })

    console.log('[v0] External API response status:', response.status)

    const text = await response.text()
    let data

    try {
      data = JSON.parse(text)
      console.log('[v0] Successfully parsed response')
    } catch (error) {
      console.error('[v0] JSON parse error:', error)
      data = { status: false, message: 'Invalid response format', raw: text }
    }

    console.log('[v0] Categories fetched:', data.list?.length || 0)
    console.log('[v0] ===================================')

    return NextResponse.json(data, {
      status: response.status,
    })
  } catch (error) {
    console.error('[v0] API error fetching series categories:', error)
    console.log('[v0] ===================================')
    return NextResponse.json(
      { status: false, message: 'Failed to fetch series categories' },
      { status: 500 }
    )
  }
}
