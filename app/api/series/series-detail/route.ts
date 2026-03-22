import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  try {
    console.log('[v0] ===== API SERIES DETAIL ROUTE =====')

    const searchParams = request.nextUrl.searchParams
    const id = searchParams.get('id')

    console.log('[v0] Series ID from query:', id)

    if (!id) {
      console.log('[v0] Error: Series ID is required')
      return NextResponse.json(
        { status: false, message: 'Series ID is required' },
        { status: 400 }
      )
    }

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
    console.log('[v0] Making GET request to: https://api.usky.ai/series/detail?id=' + id)

    const response = await fetch(`https://api.usky.ai/series/detail?id=${id}`, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    })

    console.log('[v0] External API response status:', response.status)

    if (!response.ok) {
      const text = await response.text()
      console.error('[v0] External API error response:', {
        status: response.status,
        statusText: response.statusText,
        preview: text.substring(0, 200),
      })
      return NextResponse.json(
        {
          status: false,
          message: `External API error: ${response.status} ${response.statusText}`,
        },
        { status: response.status }
      )
    }

    const text = await response.text()
    let data

    try {
      data = JSON.parse(text)
      console.log('[v0] Successfully parsed response')
    } catch (error) {
      console.error('[v0] JSON parse error:', error)
      console.error('[v0] Response text preview:', text.substring(0, 200))
      return NextResponse.json(
        { status: false, message: 'Invalid response format from external API' },
        { status: 502 }
      )
    }

    console.log('[v0] Series detail loaded successfully')
    console.log('[v0] =====================================')

    return NextResponse.json(data, {
      status: 200,
    })
  } catch (error) {
    console.error('[v0] API error fetching series detail:', error)
    return NextResponse.json(
      { status: false, message: 'Failed to fetch series detail' },
      { status: 500 }
    )
  }
}
