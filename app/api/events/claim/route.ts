import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    // 1. Terima request JSON dari frontend page.tsx
    const body = await request.json();
    const { id } = body;

    if (!id) {
      return NextResponse.json({ status: false, message: 'ID event diperlukan dari frontend' }, { status: 400 });
    }

    const authHeader = request.headers.get('authorization');
    if (!authHeader) {
      return NextResponse.json({ status: false, message: 'Unauthorized' }, { status: 401 });
    }

    // 2. Siapkan FormData persis seperti di Postman
    const formData = new FormData();
    // Pastikan valuenya diubah menjadi string karena FormData hanya menerima string/Blob
    formData.append('id', String(id)); 

    // 3. Hit ke backend USKY
    const backendResponse = await fetch('https://api.usky.ai/event/claim', {
      method: 'POST',
      headers: {
        'Authorization': authHeader,
        // PENTING: JANGAN tulis 'Content-Type': 'multipart/form-data' di sini!
        // Biarkan `fetch` bawaan Node.js yang men-generate Content-Type dan Boundary-nya secara otomatis.
      },
      body: formData,
    });

    const data = await backendResponse.json().catch(() => null);

    if (!backendResponse.ok) {
      console.error('Backend USKY Error:', data);
      return NextResponse.json(
        data || { status: false, message: 'Request ditolak oleh server USKY' },
        { status: backendResponse.status }
      );
    }

    return NextResponse.json(data, { status: 200 });

  } catch (error) {
    console.error('Internal API Route Error:', error);
    return NextResponse.json(
      { status: false, message: 'Terjadi kesalahan pada internal server Next.js' },
      { status: 500 }
    );
  }
}