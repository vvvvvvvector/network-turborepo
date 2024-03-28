import { axiosApiInstance } from '@/axios';

import type { User, AvatarWithoutLikes } from '../lib/types';

const ROUTE = '/users';

// vvv ------------------authorised------------------ vvv
export const url = `${ROUTE}/me/username-avatar`;

const getAuthorisedUserUsernameAndAvatar = async (url: string) => {
  const { data } = await axiosApiInstance.get<User & AvatarWithoutLikes>(url);

  return data;
};

const toogleAuthorisedUserEmailPrivacy = async () => {
  await axiosApiInstance.patch<{
    email: {
      isPublic: boolean;
    };
  }>(`${ROUTE}/me/contacts/email/privacy`);
};

// ^^^ ------------------authorised------------------ ^^^

export { toogleAuthorisedUserEmailPrivacy, getAuthorisedUserUsernameAndAvatar };
