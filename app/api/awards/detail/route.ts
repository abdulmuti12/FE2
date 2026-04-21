import { NextRequest, NextResponse } from 'next/server'
import { buildApiUrl } from '@/app/api/_utils'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const id = searchParams.get('id')

    if (!id) {
      return NextResponse.json(
        { status: false, message: 'id is required' },
        { status: 400 }
      )
    }

    const authHeader = request.headers.get('authorization')
    const tokenFromHeader = authHeader?.replace(/^Bearer\s+/i, '').trim()
    const token =
      tokenFromHeader ||
      process.env.USKY_API_TOKEN ||
      process.env.NEXT_PUBLIC_API_TOKEN ||
      process.env.API_TOKEN ||
      ''

    if (!token) {
      return NextResponse.json(
        { status: false, message: 'Authorization token is required' },
        { status: 401 }
      )
    }

    const response = await fetch(buildApiUrl(`/award/detail?id=${id}`), {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: 'application/json',
      },
      cache: 'no-store',
    })

    const raw = await response.text()
    let data: any = null

    try {
      data = raw ? JSON.parse(raw) : null
    } catch {
      data = null
    }

    if (!response.ok) {
      return NextResponse.json(
        data || { status: false, message: raw || `API error ${response.status}` },
        { status: response.status }
      )
    }

    if (data?.list && typeof data.list === 'object' && !Array.isArray(data.list)) {
      const list = data.list as Record<string, unknown>
      const myRates = list.my_rates ?? list.rates ?? list.rate ?? null
      data = {
        ...data,
        list: {
          ...list,
          my_rates: myRates,
        },
      }
    }

    return NextResponse.json(data || { status: false, message: 'Invalid response from API' })
  } catch (error: any) {
    console.error('Awards detail proxy error:', error.message)
    return NextResponse.json(
      { status: false, message: 'Failed to fetch award detail' },
      { status: 500 }
    )
  }
}
