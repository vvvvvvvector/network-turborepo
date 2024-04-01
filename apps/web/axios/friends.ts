import { axiosApiInstance } from '@/axios';

import type { BaseFriendRequestStatus } from '@/lib/types';

export type RequestStatus = BaseFriendRequestStatus | 'none';

const ROUTE = '/friend-requests';

// vvv ------------------mutations------------------ vvv

const unfriend = async (username: string) => {
  await axiosApiInstance.patch(`${ROUTE}/unfriend`, { username });
};

const sendFriendRequest = async (username: string) => {
  await axiosApiInstance.post(`${ROUTE}/create`, { username });
};

const acceptFriendRequest = async (username: string) => {
  await axiosApiInstance.patch(`${ROUTE}/accept`, { username });
};

const rejectFriendRequest = async (username: string) => {
  await axiosApiInstance.patch(`${ROUTE}/reject`, { username });
};

const cancelFriendRequest = async (username: string) => {
  await axiosApiInstance.delete(`${ROUTE}/cancel`, {
    data: {
      username
    }
  });
};

// ^^^ ------------------mutations------------------ ^^^

export {
  sendFriendRequest,
  acceptFriendRequest,
  rejectFriendRequest,
  unfriend,
  cancelFriendRequest
};
