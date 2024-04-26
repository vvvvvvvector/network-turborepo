import { put } from '@vercel/blob';
import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  const { searchParams } = new URL(request.url);

  const filename = decodeURIComponent(searchParams.get('filename') as string);

  const blob = await put(filename, request.body as unknown as File, {
    access: 'public'
  });

  return NextResponse.json(blob);
}
