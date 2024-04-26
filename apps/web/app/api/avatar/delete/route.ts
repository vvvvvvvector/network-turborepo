import { cookies } from 'next/headers';
import { del } from '@vercel/blob';

import { TOKEN_NAME } from '@/lib/constants';

export const runtime = 'edge';

export async function DELETE(request: Request) {
  const body = await request.json();

  const cookiesStore = cookies();
  const token = cookiesStore.get(TOKEN_NAME);

  await del(body.avatarUrl);

  await fetch(`${process.env.NEXT_PUBLIC_API_URL}/profiles/avatar`, {
    method: 'DELETE',
    headers: {
      Authorization: `Bearer ${token?.value}`
    }
  });

  return new Response();
}
