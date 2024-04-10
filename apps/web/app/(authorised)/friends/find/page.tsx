import { type Metadata } from 'next';

import { NetworkUsersList } from '@/components/friends/network-users-list';

import { getNetworkUsersUsernames } from '@/app/(authorised)/friends/api';
import { auth } from '@/app/(auth)/auth';

interface Props {
  searchParams: {
    page: string;
    username?: string;
  };
}

export const metadata: Metadata = {
  title: 'Friends / Find'
};

export default async function FindPage({
  searchParams: { page, username }
}: Props) {
  await auth();

  const data = await getNetworkUsersUsernames(page, username);

  return <NetworkUsersList data={data} />;
}
