import { NextRequest, NextResponse } from 'next/server'
import { buildApiUrl } from '@/app/api/_utils'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const id = searchParams.get('id') || '440'

    const token = process.env.NEXT_PUBLIC_API_TOKEN || process.env.API_TOKEN

    if (!token) {
      console.error('[v0] API Token not configured')
      return NextResponse.json(
        { error: 'API Token not configured' },
        { status: 500 }
      )
    }

    const response = await fetch(
      buildApiUrl(`/award/detail?id=${id}`),
      {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      }
    )

    if (!response.ok) {
      console.error(`[v0] API request failed with status ${response.status}`)
      return NextResponse.json(
        { error: 'Failed to fetch award details' },
        { status: response.status }
      )
    }

    const data = await response.json()
    return NextResponse.json(data)
  } catch (error) {
    console.error('[v0] Error fetching award details:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
