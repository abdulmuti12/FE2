import { NextRequest, NextResponse } from 'next/server'
import { buildApiUrl } from '@/app/api/_utils'

export async function GET(request: NextRequest) {
  try {
    const authHeader = request.headers.get('Authorization')
    const idCategory = request.nextUrl.searchParams.get('id_category') || ''
    const page = request.nextUrl.searchParams.get('page') || '1'

    if (!authHeader) {
      return NextResponse.json(
        { error: 'Missing authorization token' },
        { status: 401 }
      )
    }

    const response = await fetch(
      buildApiUrl(`/event/ongoing?id_category=${encodeURIComponent(idCategory)}&page=${page}`),
      {
        method: 'GET',
        headers: {
          Authorization: authHeader,
          'Content-Type': 'application/json',
        },
      }
    )

    const data = await response.json()

    return NextResponse.json(data, { status: response.status })
  } catch (error) {
    console.error('[v0] Error in upcoming-events API route:', error)
    return NextResponse.json(
      { error: 'Failed to fetch upcoming events' },
      { status: 500 }
    )
  }
}
