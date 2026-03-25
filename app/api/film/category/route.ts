import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  try {
    const authHeader = request.headers.get('authorization')
    const token = authHeader?.replace('Bearer ', '')

    if (!token) {
      return NextResponse.json(
        { status: false, message: 'Authorization token is required' },
        { status: 401 }
      )
    }

    console.log('[v0] Fetching film categories from external API')

    const response = await fetch('https://api.usky.ai/films/category', {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    })

    console.log('[v0] External API response status:', response.status)

    if (!response.ok) {
      const errorText = await response.text()
      console.error('[v0] External API error:', {
        status: response.status,
        statusText: response.statusText,
        preview: errorText.substring(0, 200),
      })

      return NextResponse.json(
        {
          status: false,
          message: `External API error: ${response.status} ${response.statusText}`,
        },
        { status: response.status }
      )
    }

    const data = await response.json()

    console.log('[v0] Film categories response received:', {
      status: data.status,
      listCount: data.list?.length || 0,
    })

    // Extract only id and name from the response
    if (data.status === true && data.list && Array.isArray(data.list)) {
      const categories = data.list.map((cat: any) => ({
        id: cat.id,
        name: cat.name,
      }))

      console.log('[v0] Categories extracted:', categories.length)

      return NextResponse.json(
        {
          status: true,
          message: 'success',
          list: categories,
        },
        { status: 200 }
      )
    }

    return NextResponse.json(
      {
        status: false,
        message: 'Invalid response format from external API',
        list: [],
      },
      { status: 502 }
    )
  } catch (error) {
    console.error('[v0] Error fetching film categories:', error)

    return NextResponse.json(
      {
        status: false,
        message: 'Failed to fetch film categories',
      },
      { status: 500 }
    )
  }
}
