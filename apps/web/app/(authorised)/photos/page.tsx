import { type Metadata } from 'next';

import { auth } from '@/app/(auth)/auth';

export const metadata: Metadata = {
  title: 'Authorised / Photos'
};

export default async function PhotosPage() {
  await auth();

  return <div className="rounded-lg bg-background p-5">My photos</div>;
}
