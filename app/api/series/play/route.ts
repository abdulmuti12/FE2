import { NextResponse } from 'next/server'
import { buildApiUrl } from '@/app/api/_utils'

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const authorization = request.headers.get('authorization')

    if (!body.id) {
      return NextResponse.json(
        { status: false, message: 'ID series diperlukan' },
        { status: 400 }
      )
    }

    const formData = new FormData()
    formData.append('id', body.id)
    console.log('Sending series play request with ID:', body.id)
    const response = await fetch(buildApiUrl('/series/play'), {
      method: 'POST',
      headers: {
        ...(authorization ? { Authorization: authorization } : {}),
      },
      body: formData,
      cache: 'no-store',
    })

    const data = await response.json()
    console.log('Response from series play API:', data)
    return NextResponse.json(data)
  } catch (error) {
    console.error('Error sending series play via proxy:', error)
    return NextResponse.json(
      { status: false, message: 'Internal Server Error' },
      { status: 500 }
    )
  }
}
