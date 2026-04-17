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

    const stars = Number(body.stars)
    if (!Number.isFinite(stars) || stars < 1 || stars > 5) {
      return NextResponse.json(
        { status: false, message: 'Stars harus bernilai 1 sampai 5' },
        { status: 400 }
      )
    }

    const formData = new FormData()
    formData.append('id', body.id)
    formData.append('stars', String(stars))

    const response = await fetch(buildFilmApiUrl('/films/rate'), {
      method: 'POST',
      headers: {
        ...(authorization ? { Authorization: authorization } : {}),
      },
      body: formData,
    })

    const data = await response.json()
    return NextResponse.json(data)
  } catch (error) {
    console.error('Error rating film via proxy:', error)
    return NextResponse.json(
      { status: false, message: 'Internal Server Error' },
      { status: 500 }
    )
  }
}
