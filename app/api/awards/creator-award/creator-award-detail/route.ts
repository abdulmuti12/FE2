import { NextRequest, NextResponse } from 'next/server'
import { buildApiUrl } from '@/app/api/_utils'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { id } = body

    const authHeader = request.headers.get('authorization')
    const token = authHeader?.replace('Bearer ', '')

    if (!token || !id) {
      return NextResponse.json(
        { error: 'No token or ID provided' },
        { status: 400 }
      )
    }

    // Siapkan FormData sesuai spesifikasi API
    const formData = new FormData()
    formData.append('id', id)

    const response = await fetch(buildApiUrl('/award-creator/detail'), {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
      },
      body: formData,
      cache: 'no-store',
    })

    const data = await response.json()
    return NextResponse.json(data, { status: response.status })

  } catch (error) {
    console.error('[v0] API detail creator error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch creator details' },
      { status: 500 }
    )
  }
}