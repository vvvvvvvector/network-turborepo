import { del } from '@vercel/blob';

export const runtime = 'edge';

export async function DELETE(request: Request) {
  const body = await request.json();

  await del(body.avatarUrl);

  return new Response();
}
