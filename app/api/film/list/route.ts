import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams
  const sort = searchParams.get('sort') || 'latest'
  const id_category = searchParams.get('id_category') || ''
  const page = searchParams.get('page') || '1'
  const limit = searchParams.get('limit') || '10'
  const view_type = searchParams.get('view_type') || 'portrait'

  const authHeader = request.headers.get('Authorization')
  const token = authHeader?.replace('Bearer ', '')

  if (!token) {
    console.error('[v0] No authorization token provided')
    return NextResponse.json(
      { status: false, message: 'Unauthorized' },
      { status: 401 }
    )
  }

  const externalUrl = new URL('https://api.usky.ai/films/list')
  externalUrl.searchParams.append('sort', sort)
  externalUrl.searchParams.append('id_category', id_category)
  externalUrl.searchParams.append('page', page)
  externalUrl.searchParams.append('limit', limit)
  externalUrl.searchParams.append('view_type', view_type)

  console.log('[v0] Fetching from external API:', externalUrl.toString())
  console.log('[v0] Request params:', { sort, id_category, page, limit, view_type })

  try {
    const response = await fetch(externalUrl.toString(), {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    })

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
          details: text.substring(0, 200),
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

    console.log('[v0] Response data:', {
      status: data.status,
      listCount: data.list?.length || 0,
      meta: data.meta,
      view_type: data.view_type,
    })
    console.log('[v0] =============================')

    return NextResponse.json(data, {
      status: 200,
    })
  } catch (error) {
    console.error('[v0] Error fetching films:', error)
    return NextResponse.json(
      { status: false, message: 'Failed to fetch films' },
      { status: 500 }
    )
  }
}
