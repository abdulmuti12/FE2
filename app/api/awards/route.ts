import { NextRequest, NextResponse } from 'next/server'
import { cookies } from 'next/headers'

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const sort = searchParams.get('sort') || 'latest'
    const id_category = searchParams.get('id_category') || ''
    const id_creator = searchParams.get('id_creator') || ''

    // Next.js 15: cookies() adalah async, harus await
    const cookieStore = await cookies()
    const token = cookieStore.get('token')?.value ||
                  cookieStore.get('auth_token')?.value ||
                  cookieStore.get('access_token')?.value || ''

    const url = `https://api.usky.ai/award/list?sort=${sort}&id_category=${id_category}&id_creator=${id_creator}`

    console.log('[awards] Fetching:', url)
    console.log('[awards] Token exists:', !!token)

    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
        ...(token && { 'Authorization': `Bearer ${token}` }),
      },
      cache: 'no-store',
    })

    const text = await response.text()
    console.log('[awards] Status:', response.status)
    console.log('[awards] Raw:', text.slice(0, 300))

    let data: unknown
    try {
      data = JSON.parse(text)
    } catch {
      return NextResponse.json(
        { status: false, message: `Response tidak valid: ${text.slice(0, 200)}` },
        { status: 502 }
      )
    }

    const parsed = data as { status: boolean; message?: string; list?: unknown[] }

    if (!parsed.status) {
      return NextResponse.json(
        { status: false, message: parsed.message || 'Gagal fetch dari upstream' },
        { status: 400 }
      )
    }

    return NextResponse.json(data)
  } catch (error) {
    console.error('[awards] API error:', error)
    return NextResponse.json(
      { status: false, message: 'Gagal menghubungi server awards' },
      { status: 500 }
    )
  }
}