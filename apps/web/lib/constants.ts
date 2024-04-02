import { env } from '@/lib/env';

export const TOKEN_NAME = env.NEXT_PUBLIC_TOKEN_NAME || 'token';

export const PAGES = {
  SIGN_IN: '/',
  SIGN_UP: '/signup',
  MESSENGER: '/messenger',
  NEWS: '/news',
  MY_PROFILE: '/profile',
  FRIENDS: '/friends',
  FRIENDS_FIND: '/friends/find',
  FRIENDS_REQUESTS: '/friends/requests',
  PHOTOS: '/photos'
} as const;

export const MAIN_NAV_PAGES = [
  PAGES.MY_PROFILE,
  PAGES.NEWS,
  PAGES.MESSENGER,
  PAGES.FRIENDS,
  PAGES.PHOTOS
] as const;
