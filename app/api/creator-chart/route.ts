import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const authHeader = request.headers.get('authorization');

    const body = await request.json();
    const { id_creator, tahun, bulan } = body;

    if (!id_creator || !tahun || !bulan) {
      return NextResponse.json(
        {
          status: false,
          message: 'Parameter id_creator, tahun, dan bulan wajib diisi',
        },
        { status: 400 }
      );
    }

    const formData = new FormData();
    formData.append('id_creator', String(id_creator));
    formData.append('tahun', String(tahun));
    formData.append('bulan', String(bulan));

    const response = await fetch('https://api.usky.ai/creator/chart', {
      method: 'POST',
      headers: {
        Authorization: authHeader || '',
      },
      body: formData,
    });

    const data = await response.json();

    return NextResponse.json(data, { status: response.status });
  } catch (error) {
    console.error('Proxy Error:', error);

    return NextResponse.json(
      {
        status: false,
        message: 'Internal Server Error',
      },
      { status: 500 }
    );
  }
}