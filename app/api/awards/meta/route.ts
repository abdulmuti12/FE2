import { NextResponse } from 'next/server'
import { buildApiUrl } from '@/app/api/_utils'

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const id = searchParams.get('id')
    const judul = searchParams.get('judul')
    const authorization = request.headers.get('authorization')

    if (!id && !judul) {
      console.warn('[awards-meta-debug] missing id/judul param')
      return NextResponse.json(
        { status: false, message: 'Parameter id atau judul diperlukan' },
        { status: 400 }
      )
    }

    const query = judul
      ? `judul=${encodeURIComponent(judul)}`
      : `id=${encodeURIComponent(String(id))}`

    console.info('[awards-meta-debug] proxy request start', { id, judul, query })

    const response = await fetch(buildApiUrl(`/award/meta?${query}`), {
      method: 'GET',
      headers: {
        ...(authorization ? { Authorization: authorization } : {}),
      },
      cache: 'no-store',
    })

    const data = await response.json()
    console.info('[awards-meta-debug] upstream response', {
      id,
      judul,
      status: response.status,
      ok: response.ok,
      hasData: typeof data?.data === 'string' && data.data.length > 0,
    })
    return NextResponse.json(data, { status: response.status })
  } catch (error) {
    console.error('Error fetching awards meta via proxy:', error)
    return NextResponse.json(
      { status: false, message: 'Internal Server Error' },
      { status: 500 }
    )
  }
}
