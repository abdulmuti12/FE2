export async function GET(request: Request) {
  const token = request.headers.get('authorization')?.replace('Bearer ', '')

  if (!token) {
    return Response.json(
      { error: 'Missing authorization token' },
      { status: 401 }
    )
  }

  try {
    const response = await fetch('https://api.usky.ai/event/bycategory', {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    })

    const data = await response.json()
    console.log('[v0] Categories API Response:', data)
    return Response.json(data)
  } catch (error) {
    console.error('[v0] Error fetching categories:', error)
    return Response.json(
      { error: 'Failed to fetch categories' },
      { status: 500 }
    )
  }
}
