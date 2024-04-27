import { NextResponse } from 'next/server';

export const runtime = 'edge';

export async function GET() {
  console.log('Hello world!');

  return NextResponse.json({ ok: true });
}
