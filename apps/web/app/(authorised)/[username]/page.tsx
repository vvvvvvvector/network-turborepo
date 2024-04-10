import { cache } from 'react';
import { notFound, redirect } from 'next/navigation';

import { NetworkUserProfile } from '@/components/profiles/network-user-profile';

import { getNetworkUserPubliclyAvailableData } from '@/app/(authorised)/[username]/api';
import { getSignedInUserUsername } from '@/app/(auth)/auth';

import { PAGES } from '@/lib/constants';

const getNetworkUserData = cache(getNetworkUserPubliclyAvailableData);

interface Props {
  params: {
    username: string;
  };
}

export async function generateMetadata({ params }: Props) {
  const user = await getNetworkUserData(params.username);

  return {
    title: !('error' in user) ? user.username : 'Profile not found :('
  };
}

export default async function NetworkUserPage({ params }: Props) {
  const { username } = await getSignedInUserUsername();

  if (!username) redirect(PAGES.SIGN_IN);

  if (username === params.username) redirect(PAGES.MY_PROFILE);

  const user = await getNetworkUserData(params.username);

  if ('error' in user) notFound();

  return <NetworkUserProfile user={user} />;
}
