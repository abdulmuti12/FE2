import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  try {
    const authHeader = request.headers.get('authorization')

    if (!authHeader) {
      return NextResponse.json(
        { error: 'Missing authorization token' },
        { status: 401 }
      )
    }

    const idCategory = request.nextUrl.searchParams.get('id_category') || ''
    const page = request.nextUrl.searchParams.get('page') || '1'

    const url = new URL('https://api.usky.ai/event/ongoing')
    url.searchParams.set('id_category', idCategory)
    url.searchParams.set('page', page)

    const response = await fetch(url.toString(), {
      method: 'GET',
      headers: {
        Authorization: authHeader,
        Accept: 'application/json',
      },
      cache: 'no-store',
    })

    const data = await response.json().catch(() => null)

    return NextResponse.json(data, { status: response.status })
  } catch (error) {
    console.error('[ongoing proxy] Error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch ongoing events' },
      { status: 500 }
    )
  }
}
