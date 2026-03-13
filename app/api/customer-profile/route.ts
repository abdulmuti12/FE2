export async function GET(request: Request) {
  try {
    const authHeader = request.headers.get('authorization')
    const token = authHeader?.replace('Bearer ', '')

    console.log('[v0] Fetching customer profile with token:', !!token)

    if (!token) {
      return Response.json({ error: 'No authorization token provided' }, { status: 401 })
    }

    const response = await fetch('https://api.usky.ai/customer/profile', {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    })

    const data = await response.json()
    console.log('[v0] Profile API response status:', response.status)

    if (!response.ok) {
      console.error('[v0] Profile API error:', data)
      return Response.json(data, { status: response.status })
    }

    console.log('[v0] Profile data received successfully')
    return Response.json(data)
  } catch (error) {
    console.error('[v0] Error fetching profile:', error)
    return Response.json({ error: 'Failed to fetch profile' }, { status: 500 })
  }
}
