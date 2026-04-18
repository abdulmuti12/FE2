import { cookies } from 'next/headers'

export async function GET(request: Request) {
  try {
    const authHeader = request.headers.get('authorization')
    const tokenFromHeader = authHeader?.replace(/^Bearer\s+/i, '').trim()

    const cookieStore = await cookies()
    const tokenFromCookie =
      cookieStore.get('token')?.value ||
      cookieStore.get('auth_token')?.value ||
      cookieStore.get('access_token')?.value

    const token = tokenFromHeader || tokenFromCookie || process.env.USKY_API_TOKEN || ''

    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
    }

    if (token) {
      headers['Authorization'] = `Bearer ${token}`
    }

    const response = await fetch('https://api.usky.ai/award/category', {
      method: 'GET',
      headers,
      cache: 'no-store',
    })

    if (!response.ok) {
      return Response.json(
        { status: false, message: `External API error: ${response.status}` },
        { status: response.status }
      )
    }

    const data = await response.json()
    return Response.json(data)
  } catch (error) {
    console.error('[awards/category] Fetch error:', error)
    return Response.json(
      { status: false, message: 'Failed to fetch award categories', error: String(error) },
      { status: 500 }
    )
  }
}
