import { NextResponse } from 'next/server';

export async function GET() {
  console.log('hell owrodl!!!!');

  return NextResponse.json({ ok: true });
}
