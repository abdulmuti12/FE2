import { cookies } from 'next/headers'

export async function GET() {
  try {
    const cookieStore = await cookies()
    const token = cookieStore.get('token')?.value || 
                  cookieStore.get('auth_token')?.value ||
                  cookieStore.get('access_token')?.value

    console.log('[awards/category] Fetching categories, token available:', !!token)

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

    console.log('[awards/category] Response status:', response.status)

    if (!response.ok) {
      console.error('[awards/category] External API error:', response.status)
      return Response.json(
        { status: false, message: `External API error: ${response.status}` },
        { status: response.status }
      )
    }

    const data = await response.json()
    console.log('[awards/category] Success, received data:', data)
    return Response.json(data)
  } catch (error) {
    console.error('[awards/category] Fetch error:', error)
    return Response.json(
      { status: false, message: 'Failed to fetch award categories', error: String(error) },
      { status: 500 }
    )
  }
}
