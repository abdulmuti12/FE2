import { NextRequest, NextResponse } from 'next/server'
import { cookies } from 'next/headers'

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    
    // Get query parameters with defaults
    const sort = searchParams.get('sort') || 'latest'
    const id_category = searchParams.get('id_category') || ''
    const page = searchParams.get('page') || '1'
    const limit = searchParams.get('limit') || '7'
    const view_type = searchParams.get('view_type') || 'potrait'

    console.log('[awards/list] Query params:', { sort, id_category, page, limit, view_type })

    // Get auth token from cookies
    const cookieStore = await cookies()
    const token = cookieStore.get('token')?.value ||
                  cookieStore.get('auth_token')?.value ||
                  cookieStore.get('access_token')?.value

    console.log('[awards/list] Token available:', !!token)

    // Build query string - only include id_category if it has a value
    const queryParams = new URLSearchParams()
    queryParams.append('sort', sort)
    queryParams.append('page', page)
    queryParams.append('limit', limit)
    queryParams.append('view_type', view_type)
    if (id_category) {
      queryParams.append('id_category', id_category)
    }

    const url = `https://api.usky.ai/award/list?${queryParams.toString()}`

    console.log('[awards/list] Fetching from:', url)

    const headers: Record<string, string> = {
      'Accept': 'application/json',
      'Content-Type': 'application/json',
    }

    if (token) {
      headers['Authorization'] = `Bearer ${token}`
    }

    const response = await fetch(url, {
      method: 'GET',
      headers,
      cache: 'no-store',
    })

    console.log('[awards/list] Response status:', response.status)

    const data = await response.json()

    console.log('[awards/list] Response data:', data)

    if (!response.ok) {
      console.error('[awards/list] Error response:', response.status, data)
      return NextResponse.json(
        { status: false, message: 'Failed to fetch awards', error: data },
        { status: response.status }
      )
    }

    const normalized = {
  ...data,
  list: data.list ?? data.data ?? data.items ?? [],
  meta: data.meta ?? data.pagination ?? { total_pages: 1 },
}

return NextResponse.json(normalized)

    return NextResponse.json(data)
  } catch (error) {
    console.error('[awards/list] API error:', error)
    return NextResponse.json(
      { status: false, message: 'Failed to connect to awards service', error: String(error) },
      { status: 500 }
    )
  }
}
