import { NextRequest, NextResponse } from 'next/server'
import { buildApiUrl } from '@/app/api/_utils'

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const idCategory = searchParams.get('id_category') || ''
    const page = searchParams.get('page') || '0'

    const authHeader = request.headers.get('Authorization')

    if (!authHeader) {
      return NextResponse.json(
        { error: 'Authorization header missing' },
        { status: 401 }
      )
    }

    const params = new URLSearchParams({
      id_category: idCategory,
      page: page,
    })

    const response = await fetch(
      buildApiUrl(`/event/completes?${params.toString()}`),
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
    console.log('[v0] Completed Events Response:', data)

    return NextResponse.json(data)
  } catch (error) {
    console.error('[v0] Error fetching completed events:', error)
    return NextResponse.json(
      { error: 'Failed to fetch completed events' },
      { status: 500 }
    )
  }
}
