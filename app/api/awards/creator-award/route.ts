import { NextRequest, NextResponse } from 'next/server'
import { buildApiUrl } from '@/app/api/_utils'

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const page = searchParams.get('page') || '1'
    const limit = searchParams.get('limit') || '50'
    const search = searchParams.get('search') || ''
    const sort = searchParams.get('sort') || ''

    const authHeader = request.headers.get('authorization')
    const tokenFromHeader = authHeader?.replace(/^Bearer\s+/i, '').trim()
    const token = tokenFromHeader || process.env.USKY_API_TOKEN || ''

    if (!token) {
      return NextResponse.json(
        { status: false, message: 'Authorization token is required' },
        { status: 401 }
      )
    }

    const url = new URL(buildApiUrl('/award-creator'))
    url.searchParams.set('page', page)
    url.searchParams.set('limit', limit)
    if (search) {
      url.searchParams.set('search', search)
    }
    if (sort) {
      url.searchParams.set('sort', sort)
    }

    const response = await fetch(url.toString(), {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: 'application/json',
      },
      cache: 'no-store',
    })

    const raw = await response.text()
    let data: any

    try {
      data = JSON.parse(raw)
    } catch {
      data = { status: false, message: 'Invalid JSON response', raw }
    }

    return NextResponse.json(data, { status: response.status })
  } catch (error: any) {
    return NextResponse.json(
      { status: false, message: error?.message || 'Failed to fetch creator award data' },
      { status: 500 }
    )
  }
}
