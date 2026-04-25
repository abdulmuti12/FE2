import { NextRequest, NextResponse } from 'next/server'
import { buildApiUrl } from '@/app/api/_utils'

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const sort = searchParams.get('sort') || 'latest'
    const idCategory = searchParams.get('id_category') || ''
    const idPartner = searchParams.get('id_partner') || ''
    const page = searchParams.get('page') || '1'
    const limit = searchParams.get('limit') || '15'

    const authHeader =
      request.headers.get('authorization') || request.headers.get('Authorization')

    if (!authHeader) {
      return NextResponse.json(
        { status: false, message: 'Authorization header missing' },
        { status: 401 }
      )
    }

    const params = new URLSearchParams({
      sort,
      id_category: idCategory,
      id_partner: idPartner,
      page,
      limit,
    })

    const response = await fetch(buildApiUrl(`/event/recap?${params.toString()}`), {
      method: 'GET',
      headers: {
        Authorization: authHeader,
      },
      cache: 'no-store',
    })

    const data = await response.json()
    return NextResponse.json(data, { status: response.status })
  } catch (error) {
    console.error('Error fetching event recap via proxy:', error)
    return NextResponse.json(
      { status: false, message: 'Internal Server Error' },
      { status: 500 }
    )
  }
}

