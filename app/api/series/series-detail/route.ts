import { NextRequest, NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import { buildApiUrl } from '@/app/api/_utils'

export async function GET(request: NextRequest) {
  try {
    console.log('[v0] ===== API SERIES DETAIL ROUTE =====')

    // AMBIL id_group sesuai dengan kebutuhan URL eksternal
    const searchParams = request.nextUrl.searchParams
    const idGroup = searchParams.get('id_group')

    console.log('[v0] Series ID Group from query:', idGroup)

    if (!idGroup) {
      return NextResponse.json(
        { status: false, message: 'id_group is required' },
        { status: 400 }
      )
    }

    const authHeader = request.headers.get('authorization')
    const tokenFromHeader = authHeader?.replace(/^Bearer\s+/i, '').trim()
    const cookieStore = await cookies()
    const tokenFromCookie =
      cookieStore.get('token')?.value ||
      cookieStore.get('auth_token')?.value ||
      cookieStore.get('access_token')?.value
    const token =
      tokenFromHeader ||
      tokenFromCookie ||
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

    // MEMANGGIL ENDPOINT SESUAI PERMINTAAN: detail-group?id_group=...
    const response = await fetch(buildApiUrl(`/series/detail-group?id_group=${idGroup}`), {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    })

    if (!response.ok) {
      return NextResponse.json(
        { status: false, message: `External API error: ${response.status}` },
        { status: response.status }
      )
    }

    const data = await response.json()
    return NextResponse.json(data, { status: 200 })

  } catch (error) {
    console.error('[v0] API error:', error)
    return NextResponse.json(
      { status: false, message: 'Failed to fetch series detail' },
      { status: 500 }
    )
  }
}
