import { axiosApiInstance } from '@/axios';

import type { User, AvatarWithoutLikes } from '../lib/types';

const ROUTE = '/users';

const getAuthorisedUserUsernameAndAvatar = async () => {
  return (
    await axiosApiInstance.get<Omit<User, 'lastSeen'> & AvatarWithoutLikes>(
      `${ROUTE}/me/username-and-avatar`
    )
  ).data;
};

export { getAuthorisedUserUsernameAndAvatar };
