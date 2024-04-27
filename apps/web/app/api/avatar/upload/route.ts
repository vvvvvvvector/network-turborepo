import { cookies } from 'next/headers';
import { put } from '@vercel/blob';

import { TOKEN_NAME } from '@/lib/constants';

export async function POST(request: Request) {
  try {
    const { searchParams } = new URL(request.url);

    const cookiesStore = cookies();
    const token = cookiesStore.get(TOKEN_NAME);

    const filename = decodeURIComponent(searchParams.get('filename') as string);

    const blob = await put(filename, request.body as ReadableStream, {
      access: 'public'
    });

    await fetch(`${process.env.NEXT_PUBLIC_API_URL}/profiles/avatar`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token?.value}`
      },
      body: JSON.stringify({
        url: blob.url
      })
    });

    return Response.json({
      message: 'Avatar was successfully uploaded!'
    });
  } catch (error) {
    return new Response(`Error while uploading avatar!`, {
      status: 500
    });
  }
}
