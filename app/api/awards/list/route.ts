import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)

    const sort = searchParams.get('sort') || 'latest'
    const id_category = searchParams.get('id_category')
    const page = searchParams.get('page') || '1'
    const limit = searchParams.get('limit') || '15'
    const view_type = searchParams.get('view_type') || 'potrait'

    const authHeader = request.headers.get('authorization')
    const tokenFromHeader = authHeader?.replace(/^Bearer\s+/i, '').trim()
    const token = tokenFromHeader || process.env.USKY_API_TOKEN || ''

    if (!token) {
      return NextResponse.json(
        { status: false, message: 'Authorization token is required' },
        { status: 401 }
      )
    }

    // Build upstream URL dengan semua params
    const params = new URLSearchParams({
      sort,
      page,
      limit,
      view_type,
    })
    if (id_category && id_category.trim()) {
      params.append('id_category', id_category)
    }

    const url = `https://api.usky.ai/award/list?${params.toString()}`

    const upstreamResponse = await fetch(url, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: 'application/json',
      },
      cache: 'no-store',
    })

    const responseText = await upstreamResponse.text()

    if (!upstreamResponse.ok) {
      let errorJson: any = null
      try {
        errorJson = JSON.parse(responseText)
      } catch {
        errorJson = null
      }

      return NextResponse.json(
        errorJson || { status: false, message: `API error ${upstreamResponse.status}` },
        { status: upstreamResponse.status }
      )
    }

    try {
      const data = JSON.parse(responseText)
      return NextResponse.json(data)
    } catch (parseError) {
      return NextResponse.json(
        {
          status: false,
          message: 'Invalid JSON response from API',
          raw: responseText.substring(0, 100),
        },
        { status: 502 }
      )
    }
  } catch (error: any) {
    console.error('Awards list proxy error:', error.message)
    return NextResponse.json(
      { status: false, message: error.message },
      { status: 500 }
    )
  }
}
