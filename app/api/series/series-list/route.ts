import { NextRequest, NextResponse } from 'next/server'
import { buildApiUrl } from '@/app/api/_utils'

export async function GET(request: NextRequest) {
  try {
    console.log('[v0] ===== SERIES LIST API =====')
    
    const searchParams = request.nextUrl.searchParams
    const sort = searchParams.get('sort') || 'latest'
    const id_category = searchParams.get('id_category') || ''
    const page = searchParams.get('page') || '1'
    const limit = searchParams.get('limit') || '8'

    const authHeader = request.headers.get('authorization')
    const token = authHeader?.replace('Bearer ', '')

    if (!token) {
      return NextResponse.json(
        { status: false, message: 'Authorization token is required' },
        { status: 401 }
      )
    }

    const queryParams = new URLSearchParams()
    queryParams.append('sort', sort)
    queryParams.append('id_category', id_category) 
    queryParams.append('page', page)
    queryParams.append('limit', limit)

    const apiUrl = buildApiUrl(`/series/list-group?${queryParams.toString()}`)

    const response = await fetch(apiUrl, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    })

    const text = await response.text()
    let data

    try {
      data = JSON.parse(text)
    } catch (error) {
      data = { status: false, message: 'Invalid response format', raw: text }
    }

    return NextResponse.json(data, {
      status: response.status,
    })
  } catch (error) {
    return NextResponse.json(
      { status: false, message: 'Failed to fetch series list' },
      { status: 500 }
    )
  }
}