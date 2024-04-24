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

const pages = [PAGES.SIGN_IN, PAGES.MY_PROFILE, PAGES.NEWS];

type RedirectPage = (typeof pages)[number];

export async function auth(
  redirectPage: RedirectPage = '/',
  inverseRedirectCondition: boolean = false // I don't know how to name the argument and not sure if it's a good idea to have it
) {
  const { username } = await getSignedInUserUsername();

  if (inverseRedirectCondition ? username : !username) redirect(redirectPage);
}
