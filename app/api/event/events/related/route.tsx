import { NextResponse } from 'next/server';
import { buildApiUrl } from '@/app/api/_utils'

export async function GET(request: Request) {
  // 1. Ambil query parameter (id_category)
  const { searchParams } = new URL(request.url);
  const id_category = searchParams.get('id_category');

  // 2. Ambil token dari header Authorization
  const authHeader = request.headers.get('authorization');

  if (!id_category) {
    return NextResponse.json(
      { status: false, message: 'id_category is required' }, 
      { status: 400 }
    );
  }

  try {
    // 3. Fetch ke server asli dari sisi server Next.js (Bypass CORS)
    const response = await fetch(buildApiUrl(`/event/related?id_category=${id_category}`), {
      method: 'GET',
      headers: {
        'Authorization': authHeader || '',
        'Content-Type': 'application/json',
      },
    });

    const data = await response.json();

    // 4. Kembalikan data ke client
    return NextResponse.json(data);
  } catch (error) {
    console.error('API Route Error:', error);
    return NextResponse.json(
      { status: false, message: 'Internal Server Error' }, 
      { status: 500 }
    );
  }
}