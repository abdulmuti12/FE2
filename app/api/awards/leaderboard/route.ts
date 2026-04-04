export async function GET() {
  try {
    console.log('[v0] Awards Leaderboard: Fetching from external API')
    
    const token = process.env.USKY_API_TOKEN
    
    if (!token) {
      console.error('[v0] Awards Leaderboard: Missing USKY_API_TOKEN')
      return Response.json(
        { error: 'API token not configured' },
        { status: 500 }
      )
    }

    const response = await fetch('https://api.usky.ai/award/leaderboard', {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    })

    if (!response.ok) {
      console.error('[v0] Awards Leaderboard: API error', response.status)
      return Response.json(
        { error: 'Failed to fetch leaderboard data' },
        { status: response.status }
      )
    }

    const data = await response.json()
    console.log('[v0] Awards Leaderboard: Data fetched successfully')
    
    return Response.json(data)
  } catch (error) {
    console.error('[v0] Awards Leaderboard: Error', error)
    return Response.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
