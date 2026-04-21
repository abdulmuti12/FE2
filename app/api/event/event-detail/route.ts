import { NextResponse } from 'next/server'
import { buildApiUrl } from '@/app/api/_utils'

export async function POST(request: Request) {
  try {
    const body = await request.json().catch(() => null)
    const id = body?.id

    if (!id) {
      return NextResponse.json(
        { status: false, message: 'ID event diperlukan' },
        { status: 400 }
      )
    }

    const authHeader = request.headers.get('authorization')
    if (!authHeader) {
      return NextResponse.json(
        { status: false, message: 'Unauthorized' },
        { status: 401 }
      )
    }

    const formData = new FormData()
    formData.append('id', String(id))

    const backendResponse = await fetch(buildApiUrl('/event/detail'), {
      method: 'POST',
      headers: {
        Authorization: authHeader,
      },
      body: formData,
    })

    const data = await backendResponse.json().catch(() => null)

    if (!backendResponse.ok) {
      return NextResponse.json(
        data || { status: false, message: 'Request detail event ditolak server USKY' },
        { status: backendResponse.status }
      )
    }

    return NextResponse.json(data, { status: backendResponse.status })
  } catch (error) {
    console.error('[event-detail proxy] Internal error:', error)
    return NextResponse.json(
      { status: false, message: 'Terjadi kesalahan pada internal server' },
      { status: 500 }
    )
  }
}
