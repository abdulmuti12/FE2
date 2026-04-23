import { NextResponse } from 'next/server'
import { buildFilmApiUrl } from '../_utils'

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const authorization = request.headers.get('authorization')

    if (!body.id) {
      return NextResponse.json(
        { status: false, message: 'ID film diperlukan' },
        { status: 400 }
      )
    }

    const formData = new FormData()
    formData.append('id', body.id)

    const response = await fetch(buildFilmApiUrl('/films/play'), {
      method: 'POST',
      headers: {
        ...(authorization ? { Authorization: authorization } : {}),
      },
      body: formData,
      cache: 'no-store',
    })

    const data = await response.json()
    return NextResponse.json(data)
  } catch (error) {
    console.error('Error sending film play via proxy:', error)
    return NextResponse.json(
      { status: false, message: 'Internal Server Error' },
      { status: 500 }
    )
  }
}
