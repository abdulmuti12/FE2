import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)

    const sort = searchParams.get('sort') || 'latest'
    const id_category = searchParams.get('id_category') || ''
    const page = searchParams.get('page') || '1'
    const limit = searchParams.get('limit') || '7'
    const view_type = searchParams.get('view_type') || 'potrait'

    const token = process.env.USKY_API_TOKEN || ''

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

    console.log('📍 Fetching URL:', url)
    console.log('🔐 Has Token:', !!token)

    const upstreamResponse = await fetch(url, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: 'application/json',
      },
      cache: 'no-store',
    })

    console.log('📊 Status:', upstreamResponse.status)

    const responseText = await upstreamResponse.text()
    console.log('📄 Response length:', responseText.length)
    console.log('📄 First 200 chars:', responseText.substring(0, 200))

    if (!upstreamResponse.ok) {
      console.error('❌ API Error:', responseText.substring(0, 500))
      return NextResponse.json(
        { status: false, message: `API error ${upstreamResponse.status}` },
        { status: upstreamResponse.status }
      )
    }

    try {
      const data = JSON.parse(responseText)
      console.log('✅ Parsed successfully, records:', data.list?.length)
      return NextResponse.json(data)
    } catch (parseError) {
      console.error('❌ JSON Parse Error:', parseError)
      console.error('Response was:', responseText.substring(0, 300))
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
    console.error('💥 Network Error:', error.message)
    return NextResponse.json(
      { status: false, message: error.message },
      { status: 500 }
    )
  }
}