import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  // 1. Ambil query parameter (id_category) dari URL request client
  const { searchParams } = new URL(request.url);
  const id_category = searchParams.get('id_category');

  // 2. Ambil token dari header Authorization yang dikirim client
  const authHeader = request.headers.get('authorization');

  if (!id_category) {
    return NextResponse.json(
      { status: false, message: 'id_category is required' }, 
      { status: 400 }
    );
  }

  try {
    // 3. Fetch ke server asli (api.usky.ai) dari sisi server Next.js (Bebas CORS!)
    const response = await fetch(`https://api.usky.ai/event/related?id_category=${id_category}`, {
      method: 'GET',
      headers: {
        'Authorization': authHeader || '', // Teruskan tokennya
        'Content-Type': 'application/json',
      },
    });

    const data = await response.json();

    // 4. Kembalikan data dari server asli ke client kita
    return NextResponse.json(data);
  } catch (error) {
    console.error('API Route Error:', error);
    return NextResponse.json(
      { status: false, message: 'Internal Server Error' }, 
      { status: 500 }
    );
  }
}