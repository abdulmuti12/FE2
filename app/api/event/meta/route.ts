import { NextResponse } from 'next/server'
import { buildApiUrl } from '@/app/api/_utils'

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const id = searchParams.get('id')
    const authorization = request.headers.get('authorization')

    if (!id) {
      return NextResponse.json(
        { status: false, message: 'Parameter id diperlukan' },
        { status: 400 }
      )
    }

    const response = await fetch(buildApiUrl(`/event/meta?id=${encodeURIComponent(id)}`), {
      method: 'GET',
      headers: {
        ...(authorization ? { Authorization: authorization } : {}),
      },
      cache: 'no-store',
    })

    const data = await response.json()
    return NextResponse.json(data, { status: response.status })
  } catch (error) {
    console.error('Error fetching event meta via proxy:', error)
    return NextResponse.json(
      { status: false, message: 'Internal Server Error' },
      { status: 500 }
    )
  }
}
