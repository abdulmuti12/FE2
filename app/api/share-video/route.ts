import { NextResponse } from 'next/server'

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const id = searchParams.get('id')
    const authHeader = request.headers.get('authorization')

    if (!authHeader || !id) {
      return NextResponse.json({ status: false, message: 'Unauthorized or missing ID' }, { status: 401 })
    }

    const response = await fetch(`https://api.usky.ai/movie/share?id=${id}`, {
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