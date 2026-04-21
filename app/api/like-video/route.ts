import { NextResponse } from 'next/server'
import { buildApiUrl } from '@/app/api/_utils'

export async function POST(request: Request) {
  try {
    const authHeader = request.headers.get('authorization')
    if (!authHeader) {
      return NextResponse.json({ status: false, message: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()

    // Karena API sebelumnya (like-comment) butuh FormData, kita asumsikan ini juga butuh FormData.
    const formData = new FormData()
    formData.append('id', body.id)

    const response = await fetch(buildApiUrl('/movie/favorit'), {
      method: 'POST',
      headers: {
        'Authorization': authHeader,
      },
      body: formData,
    })

    const data = await response.json()
    return NextResponse.json(data)
    
  } catch (error) {
    console.error('[API Proxy Error]:', error)
    return NextResponse.json(
      { status: false, message: 'Internal Server Error' },
      { status: 500 }
    )
  }
}