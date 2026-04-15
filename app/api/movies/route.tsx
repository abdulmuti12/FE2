import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams

    // Get parameters from query
    const sort = searchParams.get('sort') || 'latest'
    const idCategory = searchParams.get('id_category') || ''
    const idCreator = searchParams.get('id_creator') || ''
    const page = searchParams.get('page') || '1'
    const limit = searchParams.get('limit') || '5'

    // Get token from Authorization header
    const authHeader = request.headers.get('Authorization') || ''

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json(
        { error: 'Missing or invalid Authorization header' },
        { status: 401 }
      )
    }

    // Build query parameters for external API
    const params = new URLSearchParams({
      sort: sort,
      id_category: idCategory,
      id_creator: idCreator,
      page: page,
      limit: limit,
    })

    console.log('[v0] Fetching movies with params:', {
      sort,
      id_category: idCategory,
      id_creator: idCreator,
      page,
      limit,
    })

    const response = await fetch(
      `https://api.usky.ai/movie/list?${params.toString()}`,
      {
        method: 'GET',
        headers: {
          Authorization: authHeader,
          'Content-Type': 'application/json',
        },
      }
    )

    console.log('[v0] API Response Status:', response.status)
    console.log('[v0] API Response OK:', response.ok)

    if (!response.ok) {
      const errorText = await response.text()
      console.error('[v0] API Error Response:', errorText)
      return NextResponse.json(
        { error: `API returned ${response.status}: ${errorText}` },
        { status: response.status }
      )
    }

    const data = await response.json()
    console.log('[v0] Movies Response:', data)

    return NextResponse.json(data)
  } catch (error) {
    console.error('[v0] Error fetching movies:', error)
    return NextResponse.json(
      { error: 'Failed to fetch movies' },
      { status: 500 }
    )
  }
}
