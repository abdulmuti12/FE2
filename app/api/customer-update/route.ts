import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    const token = request.headers.get('Authorization')?.replace('Bearer ', '')

    console.log('[v0] Customer update route - Token:', !!token)

    if (!token) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    // Get form data from request
    const formData = await request.formData()
    
    console.log('[v0] Form data keys:', Array.from(formData.keys()))

    // Create a new FormData to send to the external API
    const externalFormData = new FormData()

    // Copy all form fields to the new FormData
    for (const [key, value] of formData.entries()) {
      externalFormData.append(key, value)
    }

    // Forward the request to the external API
    const response = await fetch('https://api.usky.ai/customer/update', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
      },
      body: externalFormData,
    })

    const data = await response.json()
    console.log('[v0] External API response status:', response.status)
    console.log('[v0] External API response:', data)

    if (!response.ok) {
      return NextResponse.json(
        { error: data.message || 'Failed to update profile' },
        { status: response.status }
      )
    }

    return NextResponse.json(data, { status: response.status })
  } catch (error) {
    console.error('[v0] Error in customer-update route:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
