import { NextResponse } from 'next/server'
import { buildApiUrl } from '@/app/api/_utils'

export async function GET(request: Request) {
  try {
    const authHeader = request.headers.get('authorization')
    if (!authHeader) {
      return NextResponse.json({ status: false, message: 'Unauthorized' }, { status: 401 })
    }

    const response = await fetch(buildApiUrl('/category'), {
      method: 'GET',
      headers: {
        'Authorization': authHeader,
      },
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