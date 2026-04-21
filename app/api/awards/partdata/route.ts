import { NextRequest, NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import { buildApiUrl } from '@/app/api/_utils'

const CATEGORY_ORDER = [
  'Long AI Film',
  'Short AI Film',
  'Documentary AI Film',
  'Video Clip',
  'Video Advertising AI',
  'AI Content for Social Media',
] as const

function normalizeName(name: string): string {
  return name.trim().replace(/\s+/g, ' ')
}

export async function GET(request: NextRequest) {
  try {
    const authHeader = request.headers.get('authorization')
    const tokenFromHeader = authHeader?.replace(/^Bearer\s+/i, '').trim()

    const cookieStore = await cookies()
    const tokenFromCookie =
      cookieStore.get('token')?.value ||
      cookieStore.get('auth_token')?.value ||
      cookieStore.get('access_token')?.value

    const token = tokenFromHeader || tokenFromCookie || process.env.USKY_API_TOKEN || ''
    if (!token) {
      return NextResponse.json(
        { status: false, message: 'Authorization token is required' },
        { status: 401 }
      )
    }

    const upstreamResponse = await fetch(buildApiUrl('/award/leaderboard'), {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: 'application/json',
      },
      cache: 'no-store',
    })

    const responseText = await upstreamResponse.text()

    if (!upstreamResponse.ok) {
      let errorJson: unknown = null
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

    let data: any
    try {
      data = JSON.parse(responseText)
    } catch {
      return NextResponse.json(
        { status: false, message: 'Invalid JSON response from API' },
        { status: 502 }
      )
    }

    const sourceList = Array.isArray(data?.list) ? data.list : []
    const categoryMap = new Map<string, any>()
    for (const item of sourceList) {
      if (!item?.name) continue
      categoryMap.set(normalizeName(String(item.name)), item)
    }

    const orderedList = CATEGORY_ORDER.map((name) => categoryMap.get(name)).filter(Boolean)

    return NextResponse.json({
      ...data,
      list: orderedList,
      status: data?.status ?? true,
      message: data?.message ?? 'success',
    })
  } catch (error: any) {
    console.error('Awards partdata proxy error:', error?.message || error)
    return NextResponse.json(
      { status: false, message: error?.message || 'Internal server error' },
      { status: 500 }
    )
  }
}
