'use server';

import { z } from 'zod';
import { redirect } from 'next/navigation';

import { request } from '@/app/server';

import { PAGES } from '@/lib/constants';

export const getSignedInUserUsername = async () => {
  return {
    username: z
      .object({
        username: z.string().nullish()
      })
      .parse(await request<{ username: string }>('users/me/username')).username
  };
};

type RedirectPage =
  | typeof PAGES.SIGN_IN
  | typeof PAGES.MY_PROFILE
  | typeof PAGES.NEWS;

export async function auth(
  redirectPage: RedirectPage = '/',
  condition: 'username' | '!username' = '!username'
) {
  const { username } = await getSignedInUserUsername();

  if (condition === 'username' ? username : !username) redirect(redirectPage);
}
