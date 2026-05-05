import { NextResponse } from 'next/server'
import { buildApiUrl } from '@/app/api/_utils'

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const id = searchParams.get('id')
    const judul = searchParams.get('judul')
    const judUrl = searchParams.get('jud_url') || judul
    const authorization = request.headers.get('authorization')

    if (!id && !judUrl) {
      return NextResponse.json(
        { status: false, message: 'Parameter id atau judul/jud_url diperlukan' },
        { status: 400 }
      )
    }

    const query = id
      ? `id=${encodeURIComponent(id)}`
      : `judul=${encodeURIComponent(String(judUrl))}`

    console.log('[EVENT META] Fetching meta with query:', query, { id, judul, judUrl })

    const response = await fetch(buildApiUrl(`/event/meta?${query}`), {
      method: 'GET',
      headers: {
        ...(authorization ? { Authorization: authorization } : {}),
      },
      cache: 'no-store',
    })

    const data = await response.json().catch(() => null)
    
    if (!response.ok) {
      console.error('[EVENT META] Backend API error:', { status: response.status, data })
      return NextResponse.json(
        data || { status: false, message: `Backend API error: ${response.statusText}` },
        { status: response.status }
      )
    }

    return NextResponse.json(data, { status: response.status })
  } catch (error) {
    console.error('Error fetching event meta via proxy:', error)
    return NextResponse.json(
      { status: false, message: 'Internal Server Error', error: String(error) },
      { status: 500 }
    )
  }
}
